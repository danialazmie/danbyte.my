# danbyte.my

Personal portfolio of Danial Azmi, built with FastAPI and Jinja2 using a terminal-style theme.

## Editing content

All copy lives in [`app/content/portfolio.yaml`](app/content/portfolio.yaml), validated by the models in `app/content.py`. Inline formatting supports `**bold**` and `==highlight==`.

- **Experience:** newest first. `start`/`end` are `YYYY-MM`, and `end: null` marks the current role. `slug` is the label in the career timeline (max 10 chars).
- **Featured projects:** each needs ASCII art at `app/templates/art/<slug>.html`. Keep company names out of project copy (a test checks this).

## Run locally

```bash
docker build -t danbyte .
docker run --rm -p 8000:8000 danbyte
# → http://localhost:8000
```

Local dev with live reload and the theme switcher:

```bash
docker run --rm -p 8000:8000 -e DANBYTE_DEV=1 -v "$PWD/app":/srv/app:ro danbyte \
  uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --reload-dir /srv/app \
  --reload-include '*.yaml' --reload-include '*.html' --reload-include '*.css'
```

## Themes

Colour themes live in `app/static/css/themes.css`; the live one is `site.theme` in `portfolio.yaml`
(see `THEMES` in `app/content.py`):

- `amber`: the original warm phosphor look.
- `ghostty-*` (blue, yellow, magenta, cyan): Ghostty's default background/foreground and Tomorrow Night palette.
- `lazyvim-*` (normal, insert, visual, command): tokyonight "moon", LazyVim's default; accents follow the Vim mode colours.
- `github-*` (blue, coral, green): GitHub Dark, from Primer primitives.

With `DANBYTE_DEV=1` a switcher appears bottom-left (`[` / `]` cycle through them, and `?theme=<name>` works
in the URL). It only changes your browser; to ship a theme, set `site.theme`. To add one, define it in
`themes.css` and add it to `THEMES` in `app/content.py` (tests check they match).

Without Docker:

```bash
python -m venv .venv && . .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

## Tests

```bash
pytest
# or, without a local venv:
docker run --rm -e PYTHONDONTWRITEBYTECODE=1 -v "$PWD":/srv -w /srv python:3.12-slim \
  sh -c "pip install -q -r requirements-dev.txt && pytest -q -p no:cacheprovider"
```

## Layout

```
app/
  main.py               routes: /, /projects (301 → /#projects), /healthz, /robots.txt, /sitemap.xml, 404
  content.py            pydantic models + YAML loader + inline markdown filter
  content/portfolio.yaml
  templates/            base.html, index.html, 404.html, art/<slug>.html
  static/               css/main.css, js/main.js, favicon.svg
themes/                 design explorations (not deployed)
CONTENT.md              content decisions and source notes
```
