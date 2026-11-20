"""Render bingkai adegan ke PNG: python3 still.py <ep> <nama> <t[,t2..]> <D> '<json a>' <out.png>  (a.kal boleh diisi sendiri)"""
import sys, json, base64, pathlib
from playwright.sync_api import sync_playwright
WEB = pathlib.Path(__file__).parent / "web"
ep, nama, D, a, out = sys.argv[1], sys.argv[2], float(sys.argv[4]), json.loads(sys.argv[5]), sys.argv[6]
ts = [float(x) for x in sys.argv[3].split(",")]
def uri(v): return pathlib.Path(v).resolve().as_uri() if isinstance(v, str) and v.startswith("/") and v.rsplit(".", 1)[-1] in ("png", "jpg") else v
def jalan(o, imgs):
    if isinstance(o, dict): return {k: jalan(v, imgs) for k, v in o.items()}
    if isinstance(o, list): return [jalan(v, imgs) for v in o]
    u = uri(o)
    if u != o: imgs.append(u)
    return u
with sync_playwright() as p:
    b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto((WEB / "render.html").as_uri()); pg.on("pageerror", lambda e: print("pageerror", str(e)[:300]))
    for s in [WEB / "antre.js", WEB / "lapor.js", WEB / "baca.js", pathlib.Path(f"/home/user/baca/{ep}/adegan.js")]:
        if s.exists(): pg.evaluate("s => muatSkrip(s)", s.resolve().as_uri())
    imgs = []; a = jalan(a, imgs); pg.evaluate("s => muat(s)", imgs)
    for i, t in enumerate(ts):
        d = pg.evaluate("([n,t,D,a]) => gambar(n,t,D,a)", [nama, t, D, a])
        o = out if len(ts) == 1 else out.replace(".png", f"_{i}.png")
        open(o, "wb").write(base64.b64decode(d.split(",", 1)[1]))
    b.close()
