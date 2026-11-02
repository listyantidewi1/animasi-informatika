"""Draw a few full-size frames at the busiest moments and save them for a look."""
import json, os, base64, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(ROOT, "timeline.json")))
html = open(os.path.join(ROOT, "render.html")).read().replace("__TIMELINE__", json.dumps(TL, ensure_ascii=False))
open(os.path.join(ROOT, "render.built.html"), "w").write(html)
os.makedirs(os.path.join(ROOT, "preview"), exist_ok=True)

want = sys.argv[1:] or ["intro1", "play2", "s1a", "s1b", "s1c", "s1d", "s1f", "s1h", "q1", "q1a", "s2b", "s2d", "s2e", "s3b", "s3c", "s4b", "s4d", "s4e", "s4f", "s5a", "s5b", "s5d", "s6a", "recap", "outro"]
beats = {b["id"]: b for b in TL["beats"]}
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto("file://" + os.path.join(ROOT, "render.built.html")); pg.wait_for_function("window.__ready")
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    for w in want:
        b = beats[w]; t = b["start"] + min(b["dur"] - 0.3, b["audio"] * 0.8)
        data = pg.evaluate("t => window.__seek(t)", t)
        open(os.path.join(ROOT, "preview", f"{w}.jpg"), "wb").write(base64.b64decode(data.split(",", 1)[1]))
    print("errors:", errs)
    br.close()
