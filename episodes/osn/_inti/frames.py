"""Pratinjau frame: python3 osn/_inti/frames.py osn/ON01 out_dir [id[@detik|@akhir] ...]
Tanpa id: semua beat, masing-masing satu frame di akhir ucapan (semua gambar sudah muncul) -> lembar kontak."""
import json, os, sys, base64
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "_alat"))
import episode as E
from playwright.sync_api import sync_playwright
ep, out = sys.argv[1], sys.argv[2]; want = sys.argv[3:]
ROOT = os.path.join(E.EPISODES, ep); S = E.load_script(ROOT); TL = E.load_timeline(ROOT, "suara")
html = open(os.path.join(E.ALAT, "render.html")).read().replace("__ENGINE__", E.engine_js(ROOT, S)).replace("__TIMELINE__", json.dumps(TL, ensure_ascii=False))
os.makedirs(out, exist_ok=True); p = os.path.join(out, "_f.html"); open(p, "w").write(html)
beats = {b["id"]: b for b in TL["beats"]}
jobs = []
for w in (want or [b["id"] for b in TL["beats"]]):
    bid, _, sec = w.partition("@"); b = beats[bid]
    if sec in ("", "akhir"): t = b["speech"] + b["audio"] - 0.05
    elif sec == "awal": t = b["start"] + 0.6
    else: t = b["start"] + float(sec)
    jobs.append((f"{bid}@{sec or 'akhir'}", t))
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080}); pg.goto("file://" + p); pg.wait_for_function("window.__ready")
    errs = []; pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None); pg.on("pageerror", lambda e: errs.append(str(e)))
    for name, t in jobs:
        d = pg.evaluate("t => window.__seek(t)", t); open(os.path.join(out, name.replace("@", "_") + ".jpg"), "wb").write(base64.b64decode(d.split(",", 1)[1]))
    print("errors:", errs[:5]); br.close()
