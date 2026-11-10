"""Thumbnail dokumenter 1920x1080 digambar dengan kode (mesin sinema_dok + dokkit sama dengan video).
  python3 episodes/_alat/thumbnail_dok.py dok/D05 episodes/dok/D05/thumbnail.js
thumbnail.js berisi badan gambar; tersedia ctx (kanvas 1920x1080), D = Kiko.dok (D.bg, D.glow, D.txt, D.bip, D.hexA, D.rng, D.P),
H = Kiko.helpers (H.rr, H.para, H.wrap). Contoh gaya: judul besar 2-3 baris di kiri (putih + amber), pita "DOKUMENTER ANIMASI",
Bip di kanan bawah, satu objek kunci bercahaya. Keluaran: <episode>/thumbnail.jpg (JPEG kualitas 92). Simpan thumbnail.js di repo."""
import os, sys
import episode as E
from playwright.sync_api import sync_playwright
if len(sys.argv) < 3: sys.exit(__doc__)
ROOT, _ = E.find_root([sys.argv[1]]); S = E.load_script(ROOT); JS = E.engine_js(ROOT, S); DRAW = open(sys.argv[2], encoding="utf-8").read()
HTML = f"""<!doctype html><html><head><meta charset=utf-8></head><body style=margin:0><canvas id=c width=1920 height=1080></canvas>
<script>{JS}</script><script>const cv=document.getElementById('c'),ctx=cv.getContext('2d'),D=Kiko.dok,P=D.P,H=Kiko.helpers;
document.fonts.ready.then(()=>{{ {DRAW}
; window.__ok=1; }});</script></body></html>"""
tmp = os.path.join(ROOT, f"thumb-{os.getpid()}.built.html"); open(tmp, "w", encoding="utf-8").write(HTML)
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(args=E.browser_args(S)); pg = b.new_page(viewport={"width": 1920, "height": 1080}); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e))); pg.goto("file://" + tmp); pg.wait_for_function("window.__ok || window.__err", timeout=60000)
        pg.wait_for_timeout(300); out = os.path.join(ROOT, "thumbnail.jpg"); pg.locator("#c").screenshot(path=out, type="jpeg", quality=92); b.close()
    print(out, "galat:" if errs else "", *errs)
finally: os.remove(tmp)
