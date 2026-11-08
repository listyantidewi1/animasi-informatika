"""Pratinjau perangkat gambar dokumenter (episodes/_alat/dokkit/*.js) tanpa episode.
  python3 episodes/_alat/kit_preview.py <nama> [t ...] [--out DIR]
Memuat kiko-core.js, tiktok-core.js, sinema_dok.js, three.min.js, lalu semua dokkit/*.js (urut nama), dan memanggil
Kiko.kit[<nama>].showcase(ctx, t) pada kanvas 1920x1080 untuk setiap t (bawaan 0 1.5 3). Gambar: DIR/<nama>_t<t>.png (bawaan dokkit/preview/).
Juga mencetak galat halaman dan isi window.__missing."""
import os, sys, base64, glob
from playwright.sync_api import sync_playwright
import episode as E
args = [a for a in sys.argv[1:]]; out = os.path.join(E.ALAT, "dokkit", "preview")
if "--out" in args: i = args.index("--out"); out = args[i + 1]; del args[i:i + 2]
name, ts = args[0], [float(x) for x in args[1:]] or [0, 1.5, 3]
os.makedirs(out, exist_ok=True)
files = [os.path.join(E.ALAT, f) for f in ("kiko-core.js", "tiktok-core.js", "sinema_dok.js", "vendor/three.min.js")] + sorted(glob.glob(os.path.join(E.ALAT, "dokkit", "*.js")))
js = "\n".join(open(f, encoding="utf-8").read() for f in files)
html = f"""<!doctype html><html><head><meta charset=utf-8></head><body style=margin:0><canvas id=c width=1920 height=1080></canvas>
<script>{js}</script><script>const cv=document.getElementById('c'),ctx=cv.getContext('2d');
window.__shot=(n,t)=>{{ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,1920,1080);const k=(Kiko.kit||{{}})[n];if(!k||!k.showcase)throw new Error('Kiko.kit.'+n+'.showcase tidak ada');k.showcase(ctx,t);return cv.toDataURL('image/png');}};
document.fonts.ready.then(()=>{{window.__ready=1}});</script></body></html>"""
p = os.path.join(out, f"_{name}.html"); open(p, "w", encoding="utf-8").write(html)
with sync_playwright() as pw:
    b = pw.chromium.launch(args=E.GL_ARGS); pg = b.new_page(viewport={"width": 1920, "height": 1080}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append("console: " + m.text) if m.type == "error" else None)
    pg.goto("file://" + p); pg.wait_for_function("window.__ready")
    for t in ts:
        try: open(os.path.join(out, f"{name}_t{t:g}.png"), "wb").write(base64.b64decode(pg.evaluate("a=>window.__shot(a[0],a[1])", [name, t]).split(",", 1)[1])); print("ok", os.path.join(out, f"{name}_t{t:g}.png"))
        except Exception as e: errs.append(str(e))
    print("errors:", errs[:8]); print("missing:", pg.evaluate("window.__missing||[]")); b.close()
os.remove(p)
