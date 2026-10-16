import re

import pytest
from fastapi.testclient import TestClient

from app.content import inline_md, load_portfolio
from app.main import app

client = TestClient(app)
content = load_portfolio()


@pytest.fixture(scope="module")
def home():
    r = client.get("/")
    assert r.status_code == 200
    return r.text


def test_home_renders_all_content(home):
    for role in content.experience:
        assert f'id="role-{role.slug}"' in home
    for project in content.projects.featured + content.projects.archive:
        assert project.title.replace("&", "&amp;") in home
    for group in content.skills:
        assert f"<dt>{group.group}</dt>" in home
    assert f"mailto:{content.contact.email}" in home


def test_every_featured_project_has_ascii_art(home):
    arts = re.findall(r'<div class="art" aria-hidden="true"><pre>(.*?)</pre>', home, re.S)
    assert len(arts) == len(content.projects.featured)
    assert all(a.strip() for a in arts)


def test_project_cards_stay_anonymous():
    companies = [r.company for r in content.experience]
    for p in content.projects.featured + content.projects.archive:
        for company in companies:
            assert company not in p.summary, f"{p.slug} names {company}"


def test_roles_json_is_embedded(home):
    assert 'id="roles-data"' in home
    assert '"slug": "tupai-ai"' in home or '"slug":"tupai-ai"' in home


def test_only_one_current_role():
    assert sum(r.current for r in content.experience) == 1


def test_static_assets_are_versioned_and_cached(home):
    css = re.search(r'href="(/static/css/main\.css\?v=\w+)"', home).group(1)
    r = client.get(css)
    assert r.status_code == 200
    assert "immutable" in r.headers["cache-control"]


def test_old_projects_page_redirects():
    r = client.get("/projects", follow_redirects=False)
    assert r.status_code == 301
    assert r.headers["location"] == "/#projects"


def test_404_is_terminal_styled():
    r = client.get("/nope")
    assert r.status_code == 404
    assert "no such file or directory: /nope" in r.text


def test_misc_endpoints():
    assert client.get("/healthz").json() == {"status": "ok"}
    assert "Sitemap:" in client.get("/robots.txt").text
    assert "<urlset" in client.get("/sitemap.xml").text


def test_inline_md_escapes_html():
    out = inline_md("<script>x</script> **bold** ==hi==")
    assert "<script>" not in out
    assert "<strong>bold</strong>" in out
    assert '<strong class="hl">hi</strong>' in out


def test_theme_comes_from_yaml_and_is_validated(home):
    from pydantic import ValidationError

    from app.content import THEMES, Site

    assert f'data-theme="{content.site.theme}"' in home
    assert set(THEMES) == set(Site.model_fields["theme"].annotation.__args__)
    with pytest.raises(ValidationError):
        Site(url="https://x.dev", domain="x.dev", description="x", theme="nope")


def test_every_theme_is_defined_in_css():
    from pathlib import Path

    from app.content import THEMES

    css = (Path(__file__).parents[1] / "app/static/css/themes.css").read_text()
    for name in THEMES:
        assert f'[data-theme="{name}"]' in css


def test_dev_switcher_only_in_dev(home):
    from app.main import templates

    assert 'id="theme-pick"' not in home
    templates.env.globals["dev"] = True
    try:
        assert 'id="theme-pick"' in client.get("/").text
    finally:
        templates.env.globals["dev"] = False
