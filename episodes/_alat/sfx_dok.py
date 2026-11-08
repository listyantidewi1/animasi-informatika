"""Ambil isyarat efek suara dari adegan dokumenter (fungsi Kiko.sfx(TL) di scenes.js) dan simpan ke <episode>/sfx.json.
  python3 episodes/_alat/sfx_dok.py dok/D02
musik_dok.py lalu mensintesis efek itu (desir, ketuk, denting, naik, dentum, pop) pada waktu yang sama dengan gambar."""
import json, os, sys
from playwright.sync_api import sync_playwright
import episode as E

ROOT, _ = E.find_root(sys.argv[1:]); SCRIPT = E.load_script(ROOT); TL = E.load_timeline(ROOT, "suara")
html = (open(os.path.join(E.ALAT, "render.html"), encoding="utf-8").read()
        .replace("__ENGINE__", E.engine_js(ROOT, SCRIPT)).replace("__TIMELINE__", json.dumps(TL, ensure_ascii=False)))
built = os.path.join(ROOT, "render-suara.built.html"); open(built, "w", encoding="utf-8").write(html)
with sync_playwright() as p:
    br = p.chromium.launch(args=E.browser_args(SCRIPT)); pg = br.new_page()
    pg.goto("file://" + built); pg.wait_for_function("window.__ready")
    ev = pg.evaluate("tl => Kiko.sfx ? Kiko.sfx(tl) : null", TL)
    br.close()
if ev is None: raise SystemExit("scenes.js belum punya Kiko.sfx(TL)")
open(os.path.join(ROOT, "sfx.json"), "w").write("[\n" + ",\n".join(json.dumps(e) for e in ev) + "\n]\n")
print(f"{len(ev)} isyarat efek suara -> {os.path.join(ROOT, 'sfx.json')}")
