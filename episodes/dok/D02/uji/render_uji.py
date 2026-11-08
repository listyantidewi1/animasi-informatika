"""Render klip uji D02 (15 detik, 1080p30): adegan 3D three.js + lapisan 2D, lalu musik dan efek suara buatan kode.
  python3 episodes/dok/D02/uji/render_uji.py --frame 2 6 10 14   pratinjau JPG di uji/preview/
  python3 episodes/dok/D02/uji/render_uji.py                       video penuh -> uji/Klip_Uji_D02_Bab4.mp4
"""
import base64, json, os, subprocess, sys, time
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__)); ALAT = os.path.join(HERE, "..", "..", "..", "_alat")
DUR, FPS = 15.0, 30
# isyarat waktu bersama untuk gambar dan suara
lift0, landStep = 4.3, 0.42
CUE = {"lift0": lift0, "landStep": landStep, "lands": [round(lift0 + 1.6 + i * landStep, 3) for i in range(8)],
       "label": 8.6, "stackGlow": 9.4, "ratio": 10.0, "labelOut": 12.4, "reveal": 12.8, "shimmer": 3.4}
json.dump(CUE, open(os.path.join(HERE, "cues.json"), "w"), indent=1)

def page_html():
    js = lambda p: open(p, encoding="utf-8").read()
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>html,body{{margin:0;background:#000}}</style></head><body>
<canvas id="gl" width="1920" height="1080" style="display:none"></canvas><canvas id="out" width="1920" height="1080"></canvas>
<script>window.CUE = {json.dumps(CUE)};</script>
<script>{js(os.path.join(ALAT, 'vendor', 'three.min.js'))}</script>
<script>{js(os.path.join(ALAT, 'kiko-core.js'))}</script><script>{js(os.path.join(ALAT, 'tiktok-core.js'))}</script>
<script>document.fonts.ready.then(() => {{ const s = document.createElement('script'); s.textContent = {json.dumps(js(os.path.join(HERE, 'uji.js')))}; document.body.appendChild(s); }});</script>
</body></html>"""

def open_page(p):
    b = p.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
    pg = b.new_page(viewport={"width": 1920, "height": 1080}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append("console: " + m.text) if m.type == "error" else None)
    built = os.path.join(HERE, "uji.built.html"); open(built, "w", encoding="utf-8").write(page_html())
    pg.goto("file://" + built); pg.wait_for_function("window.__ready", timeout=120000)
    return b, pg, errs

def grab(pg, t): return base64.b64decode(pg.evaluate("t => window.__frame(t)", t).split(",", 1)[1])

if __name__ == "__main__":
    args = sys.argv[1:]
    with sync_playwright() as p:
        b, pg, errs = open_page(p)
        if "--frame" in args:
            d = os.path.join(HERE, "preview"); os.makedirs(d, exist_ok=True)
            for s in [a for a in args if a != "--frame"]:
                t0 = time.time(); open(os.path.join(d, f"t{float(s):05.1f}.jpg"), "wb").write(grab(pg, float(s)))
                print(f"t={s}: {time.time() - t0:.2f} s/frame", flush=True)
            print("errors:", errs[:5]); b.close(); sys.exit()
        vid = os.path.join(HERE, "klip.video.mp4"); n = int(DUR * FPS); t0 = time.time()
        ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                               "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", vid], stdin=subprocess.PIPE)
        for i in range(n):
            ff.stdin.write(grab(pg, i / FPS))
            if i % 60 == 0: print(f"  frame {i}/{n}  {time.time() - t0:.0f}s", flush=True)
        ff.stdin.close(); ff.wait(); b.close()
        if errs: print("errors:", errs[:5])
    subprocess.run([sys.executable, os.path.join(HERE, "audio_uji.py")], check=True)
    out = os.path.join(HERE, "Klip_Uji_D02_Bab4.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", vid, "-i", os.path.join(HERE, "audio_uji.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out], check=True)
    os.remove(vid); print("DONE", out)
