"""Render adegan kanvas menjadi mp4 (tanpa suara). jobs: [{nama, D, a, out}]"""
import json, base64, subprocess, os, sys, pathlib
from playwright.sync_api import sync_playwright
WEB = pathlib.Path(__file__).parent / "web"
def render(jobs, skrip, fps=30):
    with sync_playwright() as p:
        b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(viewport={"width": 1920, "height": 1080})
        pg.goto((WEB / "render.html").as_uri())
        for s in skrip: pg.evaluate("s => muatSkrip(s)", pathlib.Path(s).resolve().as_uri())
        for j in jobs:
            a = dict(j.get("a", {})); imgs = []
            for k in list(a):  # bg dan kunci berawalan img: berkas gambar yang dimuat ke K.IMG
                if (k == "bg" or k.startswith("img")) and a[k]: a[k] = pathlib.Path(a[k]).resolve().as_uri(); imgs.append(a[k])
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
