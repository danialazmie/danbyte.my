"""Portfolio content: loaded once from content/portfolio.yaml and validated."""

import hashlib
import re
from datetime import date
from functools import lru_cache
from pathlib import Path

import yaml
from markupsafe import Markup, escape
from pydantic import BaseModel, Field, HttpUrl

CONTENT_PATH = Path(__file__).parent / "content" / "portfolio.yaml"
YEAR_MONTH = r"^\d{4}-(0[1-9]|1[0-2])$"
MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()


def fmt_month(ym: str | None) -> str:
    if ym is None:
        return "Present"
    year, month = ym.split("-")
    return f"{MONTHS[int(month) - 1]} {year}"


class Site(BaseModel):
    url: HttpUrl
    domain: str
    description: str


class Profile(BaseModel):
    name: str
    roles: list[str]
    tagline: str
    now: str
    location: str
    location_short: str
    handle: str
    status: str


class Note(BaseModel):
    label: str
    text: str


class Education(BaseModel):
    degree: str
    school: str
    years: str
    notes: list[Note] = []


class Role(BaseModel):
    slug: str = Field(max_length=10)
    role: str
    company: str
    legal_name: str | None = None
    location: str
    start: str = Field(pattern=YEAR_MONTH)
    end: str | None = Field(default=None, pattern=YEAR_MONTH)
    internship: bool = False
    highlights: list[str]

    @property
    def current(self) -> bool:
        return self.end is None

    @property
    def period(self) -> str:
        return f"{fmt_month(self.start)} – {fmt_month(self.end)}"

    @property
    def commit(self) -> str:
        """Stable fake commit hash for the git-log styling."""
        return hashlib.sha1(f"{self.slug}{self.start}".encode()).hexdigest()[:7]


class FeaturedProject(BaseModel):
    slug: str
    title: str
    years: str
    domain: str
    summary: str
    tags: list[str]


class ArchivedProject(BaseModel):
    slug: str
    title: str
    summary: str
    tags: list[str]
    url: HttpUrl | None = None


class Projects(BaseModel):
    featured: list[FeaturedProject]
    archive: list[ArchivedProject] = []


class SkillGroup(BaseModel):
    group: str
    items: list[str]


class Link(BaseModel):
    label: str
    url: HttpUrl

    @property
    def display(self) -> str:
        return str(self.url).removeprefix("https://").removeprefix("www.").rstrip("/")


class Contact(BaseModel):
    note: str
    email: str
    links: list[Link]

    def link(self, label: str) -> Link | None:
        return next((l for l in self.links if l.label == label), None)


class Portfolio(BaseModel):
    site: Site
    profile: Profile
    about: list[str]
    education: Education
    experience: list[Role]
    projects: Projects
    skills: list[SkillGroup]
    contact: Contact

    @property
    def roles_timeline(self) -> list[dict]:
        """Minimal role data for the client-side career plot."""
        return [
            {"slug": r.slug, "start": r.start, "end": r.end, "internship": r.internship}
            for r in self.experience
        ]

    @property
    def year(self) -> int:
        return date.today().year


@lru_cache
def load_portfolio(path: Path = CONTENT_PATH) -> Portfolio:
    with path.open(encoding="utf-8") as f:
        return Portfolio.model_validate(yaml.safe_load(f))


_BOLD = re.compile(r"\*\*(.+?)\*\*")
_HIGHLIGHT = re.compile(r"==(.+?)==")


def inline_md(text: str) -> Markup:
    """Escape, then allow **bold** and ==highlight== only."""
    html = str(escape(text))
    html = _BOLD.sub(r"<strong>\1</strong>", html)
    html = _HIGHLIGHT.sub(r'<strong class="hl">\1</strong>', html)
    return Markup(html)
