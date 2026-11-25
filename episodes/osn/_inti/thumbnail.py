"""python3 osn/_inti/thumbnail.py osn/ON01 -> <ep>/video/<kode>_thumbnail.png (1280x720) dari adegan "thumb" di thumb.js"""
import base64, json, os, sys, subprocess
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "_alat"))
import episode as E
from playwright.sync_api import sync_playwright
EP = os.path.join(E.EPISODES, sys.argv[1]); S = E.load_script(EP)
eng = E.engine_js(EP, S) + "\n" + open(os.path.join(EP, "thumb.js")).read()
TL = {**S, "beats": [{"id": "t", "seg": 0, "scene": "thumb", "text": "", "start": 0, "dur": 1, "audio": 1}], "total": 1}
html = open(os.path.join(E.ALAT, "render.html")).read().replace("__ENGINE__", eng).replace("__TIMELINE__", json.dumps(TL, ensure_ascii=False))
out = os.path.join(EP, "video"); os.makedirs(out, exist_ok=True); p = os.path.join(out, "_thumb.html"); open(p, "w").write(html)
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080}); pg.goto("file://" + p); pg.wait_for_function("window.__ready")
    pg.evaluate("window.__seek(0.5)"); png = pg.evaluate("document.getElementById('c').toDataURL('image/png')"); br.close()
raw = os.path.join(out, "_thumb_full.png"); open(raw, "wb").write(base64.b64decode(png.split(",", 1)[1]))
dst = os.path.join(out, f"{S['episode']}_thumbnail.png")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-vf", "scale=1280:720:flags=lanczos", dst], check=True); print(dst)
