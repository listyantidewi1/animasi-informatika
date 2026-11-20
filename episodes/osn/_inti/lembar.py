"""Lembar kontak: python3 lembar.py dir prefix_out [kolom=3] [lebar=640]; urut sesuai timeline bila ada daftar.txt"""
import sys, os, glob
from PIL import Image, ImageDraw, ImageFont
d, out = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3; w = int(sys.argv[4]) if len(sys.argv) > 4 else 640
fs = sorted(glob.glob(os.path.join(d, "*.jpg")), key=os.path.getmtime)
h = w * 9 // 16; per = cols * 4
f = ImageFont.truetype("/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf", 20)
for k in range(0, len(fs), per):
    grp = fs[k:k + per]; rows = (len(grp) + cols - 1) // cols
    im = Image.new("RGB", (cols * w, rows * (h + 26)), "white"); dr = ImageDraw.Draw(im)
    for i, p in enumerate(grp):
        x, y = (i % cols) * w, (i // cols) * (h + 26); im.paste(Image.open(p).resize((w, h)), (x, y + 26)); dr.text((x + 6, y + 2), os.path.basename(p)[:-4], fill="black", font=f)
    im.save(f"{out}_{k // per + 1}.jpg", quality=85); print(f"{out}_{k // per + 1}.jpg")
