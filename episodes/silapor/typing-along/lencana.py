"""Deteksi lencana 'dipercepat N,Nx' (kanan bawah) di video jadi, 5 fps -> data/lencana.json [[t, speed|0], ...]."""
import subprocess, numpy as np, json, sys
from PIL import Image, ImageDraw, ImageFont
V = sys.argv[1]; F = 5; X, Y, W, H = 1590, 988, 300, 56
FONT = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
def tmpl(sp):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im); f = ImageFont.truetype(FONT, 30)
    tx = f"dipercepat {sp:.1f}x".replace(".", ","); d.text((W / 2, H / 2), tx, font=f, fill=255, anchor="mm"); return np.array(im, np.float32)
CAND = [round(1.8 + 0.1 * i, 1) for i in range(83)]; TM = {s: tmpl(s) for s in CAND}
p = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", V, "-vf", f"fps={F},crop={W}:{H}:{X}:{Y}", "-pix_fmt", "rgb24", "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
out = []; i = 0
while True:
    b = p.stdout.read(W * H * 3)
    if len(b) < W * H * 3: break
    a = np.frombuffer(b, np.uint8).reshape(H, W, 3).astype(np.float32)
    # latar lencana gelap kebiruan merata di tepi kiri/kanan kotak
    tepi = np.concatenate([a[:, :12].reshape(-1, 3), a[:, -12:].reshape(-1, 3)])
    ok = tepi.std(0).max() < 10 and tepi.mean(0)[2] < 60 and tepi.mean(0)[0] < 40
    kuning = (a[:, :, 0] > 170) & (a[:, :, 1] > 130) & (a[:, :, 2] < 110)
    sp = 0
    if ok and kuning.sum() > 150:
        m = kuning.astype(np.float32) * 255
        best = min(CAND, key=lambda s: np.abs(TM[s] - m).mean()); sp = best
    out.append([round(i / F, 2), sp]); i += 1
json.dump(out, open("data/lencana.json", "w")); print("selesai", i)
