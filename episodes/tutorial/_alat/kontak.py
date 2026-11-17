import json, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
ep, vid = sys.argv[1], sys.argv[2]; W = json.load(open(f"/home/user/tut/{ep}/waktu.json"))
pts = []
for b in W:
    for f in (0.3, 0.85): pts.append((b["no"], b.get("isi", b["mulai"]) + b["D"] * f))
ims = []
for i, (n, t) in enumerate(pts):
    o = f"/tmp/kk{i}.jpg"; subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.2f}", "-i", vid, "-frames:v", "1", "-vf", "scale=480:-1", o]); im = Image.open(o)
    ImageDraw.Draw(im).text((8, 6), f"b{n:02d} {t:.0f}s", fill=(255, 255, 0), font=ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf", 22)); ims.append(im)
w, h = ims[0].size; cols = 4; rows = (len(ims) + cols - 1) // cols; s = Image.new("RGB", (w * cols, h * rows))
for i, im in enumerate(ims): s.paste(im, ((i % cols) * w, (i // cols) * h))
s.save(sys.argv[3]); print(sys.argv[3])
