"""Render satu bingkai adegan ke PNG: python3 still.py <ep> <nama> <t> <D> '<json a>' <out.png> [t2 ...]"""
import sys, json, base64, pathlib
from playwright.sync_api import sync_playwright
WEB = pathlib.Path(__file__).parent / "web"
ep, nama, D, a, out = sys.argv[1], sys.argv[2], float(sys.argv[4]), json.loads(sys.argv[5]), sys.argv[6]
ts = [float(x) for x in sys.argv[3].split(",")]
with sync_playwright() as p:
    b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto((WEB / "render.html").as_uri())
    for s in [WEB / "antre.js", pathlib.Path("/home/user/parkir/A01/adegan.js"), pathlib.Path(f"/home/user/parkir/{ep}/adegan.js")]:
        if s.exists(): pg.evaluate("s => muatSkrip(s)", s.resolve().as_uri())
    if a.get("bg"): a["bg"] = pathlib.Path(a["bg"]).resolve().as_uri()
    pg.evaluate("s => muat(s)", [a["bg"]] if a.get("bg") else [])
    for i, t in enumerate(ts):
        d = pg.evaluate("([n,t,D,a]) => gambar(n,t,D,a)", [nama, t, D, a])
        o = out if len(ts) == 1 else out.replace(".png", f"_{i}.png")
        open(o, "wb").write(base64.b64decode(d.split(",", 1)[1]))
    b.close()
