"""Ukur perubahan antarbingkai video jadi (10 fps, 480x270 abu-abu): data/beda.npy kolom [t, frac_berubah, x0,y0,x1,y1]."""
import subprocess, numpy as np, sys
V = sys.argv[1]; W, H, F = 480, 270, 10
p = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", V, "-vf", f"fps={F},scale={W}:{H},format=gray", "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
prev = None; out = []; i = 0
while True:
    b = p.stdout.read(W * H)
    if len(b) < W * H: break
    f = np.frombuffer(b, np.uint8).astype(np.int16)
    if prev is not None:
        d = np.abs(f - prev).reshape(H, W) > 18
        n = d.sum()
        if n:
            ys, xs = np.nonzero(d); out.append([i / F, n / (W * H), xs.min(), ys.min(), xs.max(), ys.max()])
        else: out.append([i / F, 0, 0, 0, 0, 0])
    prev = f; i += 1
np.save("data/beda.npy", np.array(out, np.float32)); print("selesai", i)
