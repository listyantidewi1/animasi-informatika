"""Satu frame adegan: python3 alat/still.py EP nama t D keluar.jpg '{json a}'"""
import sys, json, base64, pathlib
from playwright.sync_api import sync_playwright
ep, nama, t, D, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), sys.argv[5]; a = json.loads(sys.argv[6]) if len(sys.argv) > 6 else {}
WEB = pathlib.Path("/home/user/pinjam/alat/web")
with sync_playwright() as p:
    b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(viewport={"width": 1920, "height": 1080}); pg.goto((WEB / "render.html").as_uri()); pg.on("pageerror", lambda e: print("pageerror", e))
    for s in [x for x in [WEB / "antre.js", WEB / "siap.js", WEB / "pinjam.js", pathlib.Path(f"/home/user/pinjam/{ep}/adegan.js")] if x.exists()]:
        if s.exists(): pg.evaluate("s => muatSkrip(s)", s.as_uri())
    imgs = []
    for k in list(a):
        if (k == "bg" or k.startswith("img")) and a[k]: a[k] = pathlib.Path(a[k]).resolve().as_uri(); imgs.append(a[k])
    pg.evaluate("s => muat(s)", imgs); d = pg.evaluate("([n,t,D,a]) => gambar(n,t,D,a)", [nama, t, D, a]); open(out, "wb").write(base64.b64decode(d.split(",", 1)[1])); b.close()
