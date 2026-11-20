import sys, pathlib
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1280,"height":720})
    for f in sys.argv[1:]:
        pg.goto(pathlib.Path(f).resolve().as_uri()); pg.wait_for_timeout(500); pg.screenshot(path=f.replace(".html",".png"))
    b.close()
