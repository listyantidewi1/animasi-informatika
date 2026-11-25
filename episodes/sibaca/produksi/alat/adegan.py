"""Render adegan kanvas menjadi mp4 (tanpa suara). jobs: [{nama, D, a, out}]"""
import json, base64, subprocess, os, sys, pathlib
from playwright.sync_api import sync_playwright
WEB = pathlib.Path(__file__).parent / "web"
def _gambar(o, imgs):
    """Semua teks berupa jalur berkas gambar (di kedalaman berapa pun) diubah menjadi URI dan dimuat ke K.IMG."""
    import pathlib, os
    if isinstance(o, dict): return {k: _gambar(v, imgs) for k, v in o.items()}
    if isinstance(o, list): return [_gambar(v, imgs) for v in o]
    if isinstance(o, str) and o.startswith("/") and o.rsplit(".", 1)[-1] in ("png", "jpg") and os.path.exists(o):
        u = pathlib.Path(o).resolve().as_uri(); imgs.append(u); return u
    return o
def render(jobs, skrip, fps=30):
    with sync_playwright() as p:
        b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(viewport={"width": 1920, "height": 1080})
        pg.goto((WEB / "render.html").as_uri())
        for s in skrip: pg.evaluate("s => muatSkrip(s)", pathlib.Path(s).resolve().as_uri())
        for j in jobs:
            imgs = []; a = _gambar(dict(j.get("a", {})), imgs)
            pg.evaluate("s => muat(s)", imgs)
            n = max(1, round(j["D"] * fps))
            ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "image2pipe", "-c:v", "mjpeg", "-r", str(fps), "-i", "-",
                                   "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(fps), j["out"]], stdin=subprocess.PIPE)
            for i in range(n):
                d = pg.evaluate("([n,t,D,a]) => gambar(n,t,D,a)", [j["nama"], i / fps, j["D"], a])
                ff.stdin.write(base64.b64decode(d.split(",", 1)[1]))
            ff.stdin.close(); ff.wait(); print("adegan", j["out"], flush=True)
        b.close()
if __name__ == "__main__":
    jobs = json.load(open(sys.argv[1])); render(jobs, sys.argv[2:])
