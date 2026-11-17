"""Pratinjau beberapa frame adegan menjadi satu grid: still.py EP out.jpg nama:t:D[,...]"""
import sys, base64, io, pathlib, json
from playwright.sync_api import sync_playwright
from PIL import Image
WEB = pathlib.Path("/home/user/tut/alat/web")
def main(ep, out, specs, a=None):
    ims = []
    with sync_playwright() as p:
        b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(viewport={"width": 1920, "height": 1080})
        pg.goto((WEB / "render.html").as_uri()); pg.evaluate("s => muatSkrip(s)", pathlib.Path(f"/home/user/tut/{ep}/adegan.js").resolve().as_uri())
        for s in specs:
            n, t, D = s.split(":"); aa = json.loads(a) if a else {}
            pg.evaluate("s => muat(s)", [])
            d = pg.evaluate("([n,t,D,a]) => gambar(n,t,D,a)", [n, float(t), float(D), aa])
            ims.append(Image.open(io.BytesIO(base64.b64decode(d.split(",", 1)[1]))).resize((960, 540)))
        b.close()
    cols = 2; rows = (len(ims) + 1) // 2; g = Image.new("RGB", (960 * cols, 540 * rows))
    for i, im in enumerate(ims): g.paste(im, ((i % cols) * 960, (i // cols) * 540))
    g.save(out)
if __name__ == "__main__": main(sys.argv[1], sys.argv[2], sys.argv[3].split(","), sys.argv[4] if len(sys.argv) > 4 else None)
