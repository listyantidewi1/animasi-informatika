"""Lembar kontak bingkai bekukan tiap titik: data/lembar/NN.jpg (12 per lembar)."""
import json, subprocess, os, sys
from PIL import Image, ImageDraw, ImageFont
V = "/mnt/project-files/silapor/SiLapor_Laravel_dari_Nol.mp4"; T = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "data/titik.json")); E = json.load(open("data/peta.json"))
os.makedirs("data/lembar2", exist_ok=True); f = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf", 15)
def bingkai(t, out): subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{max(0,t):.2f}", "-i", V, "-frames:v", "1", "-vf", "scale=640:360", out])
for p in range(0, len(T), 6):
    sh = Image.new("RGB", (640 * 3, 400 * 2), (30, 30, 30)); d = ImageDraw.Draw(sh)
    for j, x in enumerate(T[p:p + 6]):
        fn = f"/tmp/lb_{x['id']}.jpg"; bingkai(x["t"] - 0.1, fn); im = Image.open(fn)
        X, Y = (j % 3) * 640, (j // 3) * 400; sh.paste(im, (X, Y + 40))
        lab = " | ".join((E[i].get("berkas") or E[i].get("teks", "")).split("\n")[0][-34:] for i in x["ev"])
        d.text((X + 4, Y + 2), f"#{x['id']} {x['t']:.1f} {x['jenis']} {x.get('s') or ''}", font=f, fill=(255, 220, 90)); d.text((X + 4, Y + 20), lab[:90], font=f, fill=(150, 220, 255))
    sh.save(f"data/lembar2/{p // 6:02d}.jpg", quality=80)
print("ok")
