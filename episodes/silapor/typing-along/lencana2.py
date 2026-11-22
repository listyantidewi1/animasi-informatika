"""Rentang lencana 'dipercepat' + baca ulang angkanya (geser +-) di tiga bingkai per rentang -> data/lencana_rentang.json"""
import subprocess, numpy as np, json
from PIL import Image, ImageDraw, ImageFont
V = "/mnt/project-files/silapor/SiLapor_Laravel_dari_Nol.mp4"; X, Y, W, H = 1590, 988, 300, 56
FONT = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
def crop(t):
    b = subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", f"{t:.2f}", "-i", V, "-frames:v", "1", "-vf", f"crop={W}:{H}:{X}:{Y}", "-pix_fmt", "rgb24", "-f", "rawvideo", "-"], capture_output=True).stdout
    return np.frombuffer(b, np.uint8).reshape(H, W, 3).astype(np.float32)
def tm(sp):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im); f = ImageFont.truetype(FONT, 30)
    d.text((W / 2, H / 2), f"dipercepat {sp:.1f}x".replace(".", ","), font=f, fill=255, anchor="mm"); return np.array(im, np.float32) / 255
C = [round(1.8 + 0.1 * i, 1) for i in range(83)]; TM = {s: tm(s) for s in C}
def baca(a):
    g = np.clip((a[:, :, 0] + a[:, :, 1]) / 2 - a[:, :, 2], 0, 255); g = g / max(1, g.max()); best = None
    for s in C:
        for dx in range(-3, 4):
            for dy in range(-7, 1):
                e = np.abs(np.roll(np.roll(TM[s], dx, 1), dy, 0) - g).mean()
                if best is None or e < best[0]: best = (e, s)
    return best[1]
if __name__ == "__main__":
  d = json.load(open("data/lencana.json")); R = []
  for t, s in d:
    if s and R and t - R[-1][1] <= 0.3: R[-1][1] = t
    elif s: R.append([t, t])
  out = []
  for a, b in R:
    sp = [baca(crop(a + (b - a) * f)) for f in (0.2, 0.5, 0.8)]
    out.append(dict(a=a, b=b, sp=sp)); print(a, b, sp, flush=True)
  json.dump(out, open("data/lencana_rentang.json", "w"), indent=1)
