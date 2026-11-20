import sys, json, numpy as np
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, "/tmp/claude-0/sor"); from det import frame, baris_aktif
fn = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 26)
rows = []
for ep in sys.argv[1:]:
    d = json.load(open(f"/home/user/pinjam/{ep}/rek.json"))
    for t, k in d["kamera"]:
        if k and k[2] >= 1.55 or (k and abs(k[2]-1.4)<.01):
            lab = [l for l in d["label"] if -0.3 <= l[0] - t <= 0.8]
            g = frame(f"/home/user/pinjam/{ep}/rek.mkv", t + 1.3); y, h, ys = baris_aktif(g)
            yc = int(y + h / 2) if y is not None else int(k[1])
            a = max(0, yc - 110); s = Image.fromarray(g[a:a + 220, 560:2560]).convert("RGB"); dr = ImageDraw.Draw(s)
            if y is not None: dr.rectangle([0, y - a, 1999, y + h - a], outline=(255, 200, 0), width=3)
            cap = f"{ep} t={t:.1f} ky={k[1]:.0f} det={'-' if y is None else round(y)} | {lab[0][1] if lab else '(tanpa label)'}"
            print(cap, flush=True); rows.append((cap, s))
for k in range(0, len(rows), 8):
    im = Image.new("RGB", (2000, 8 * 260), "white"); dr = ImageDraw.Draw(im)
    for j, (cap, s) in enumerate(rows[k:k + 8]): im.paste(s, (0, j * 260 + 36)); dr.text((6, j * 260 + 4), cap, fill="black", font=fn)
    im.save(f"/tmp/claude-0/sor/S_{k // 8 + 1}.png")
