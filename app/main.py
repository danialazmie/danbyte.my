import hashlib
import mimetypes
from functools import lru_cache
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, PlainTextResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.content import inline_md, load_portfolio

BASE_DIR = Path(__file__).parent
STATIC_DIR = BASE_DIR / "static"

# python:slim has no woff2 entry in its mime table
mimetypes.add_type("font/woff2", ".woff2")

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

templates = Jinja2Templates(directory=BASE_DIR / "templates")
templates.env.filters["md"] = inline_md


@lru_cache
def asset(path: str) -> str:
    """URL for a static file with a content hash for cache busting."""
    digest = hashlib.md5((STATIC_DIR / path).read_bytes()).hexdigest()[:10]
    return f"/static/{path}?v={digest}"


templates.env.globals["asset"] = asset


@app.middleware("http")
async def cache_headers(request: Request, call_next):
    response = await call_next(request)
    path = request.url.path
    if path.startswith("/static/fonts/") or (path.startswith("/static/") and "v" in request.query_params):
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    return response


@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse(request, "index.html", {"c": load_portfolio()})


@app.get("/projects")
def projects():
    # The old site had a separate projects page; keep its links working.
    return RedirectResponse("/#projects", status_code=301)


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


@app.get("/robots.txt", response_class=PlainTextResponse)
def robots():
    return f"User-agent: *\nAllow: /\nSitemap: {load_portfolio().site.url}sitemap.xml\n"


@app.get("/sitemap.xml")
def sitemap():
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        f"<url><loc>{load_portfolio().site.url}</loc></url></urlset>\n"
    )
    return PlainTextResponse(xml, media_type="application/xml")


@app.exception_handler(StarletteHTTPException)
async def http_error(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        return templates.TemplateResponse(
            request, "404.html", {"c": load_portfolio(), "path": request.url.path}, status_code=404
        )
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)
