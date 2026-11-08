"""Gambar frame ukuran penuh pada beat tertentu untuk diperiksa, disimpan di <episode>/preview/<id>.jpg.
  python3 episodes/_alat/preview.py D7.0            semua beat
  python3 episodes/_alat/preview.py D7.0 s1b s4d    beat tertentu;  s1b=2.5  pada detik lokal 2,5
  --teks / --suara memilih timeline (bawaan: suara bila ada, kalau tidak teks).
Frame diambil pada 80% waktu baca beat (saat adegan paling ramai)."""
import json, os, base64, sys
from playwright.sync_api import sync_playwright
import episode as E

flags = [a for a in sys.argv[1:] if a.startswith("--")]
ROOT, want = E.find_root([a for a in sys.argv[1:] if not a.startswith("--")])
variant = E.pick_variants(ROOT, flags, need_audio=False)[-1]
TL = E.load_timeline(ROOT, variant); SCRIPT = E.load_script(ROOT)
html = (open(os.path.join(E.ALAT, "render.html"), encoding="utf-8").read()
        .replace("__ENGINE__", E.engine_js(ROOT, SCRIPT)).replace("__TIMELINE__", json.dumps(TL, ensure_ascii=False)))
BUILT = os.path.join(ROOT, f"render-{variant}.built.html"); open(BUILT, "w", encoding="utf-8").write(html)
OUT = os.path.join(ROOT, "preview"); os.makedirs(OUT, exist_ok=True)

beats = {b["id"]: b for b in TL["beats"]}
want = want or list(beats)
with sync_playwright() as p:
    br = p.chromium.launch(args=E.browser_args(SCRIPT)); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + BUILT); pg.wait_for_function("window.__ready")
    for w in want:
        wid, _, at = w.partition("=")
        b = beats[wid]; t = b["start"] + (float(at) if at else min(b["dur"] - 0.3, b["audio"] * 0.8))
        data = pg.evaluate("t => window.__seek(t)", t)
        open(os.path.join(OUT, f"{w.replace('=', '_at')}.jpg"), "wb").write(base64.b64decode(data.split(",", 1)[1]))
    print(f"[{variant}] {len(want)} frame -> {OUT}; errors: {errs}")
    br.close()
