"""Profil perubahan tiap frame rekaman mentah: jumlah piksel berubah per sel grid 64x36 (resolusi 1280x720 abu-abu)."""
import subprocess, numpy as np, sys
W, H = 1280, 720; GX, GY = 64, 36
for k in sys.argv[1:]:
    p = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", f"/home/user/git-seri/raw/{k}.mkv", "-vf", f"scale={W}:{H}:flags=area,format=gray", "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
    prev = None; rows = []
    while True:
        b = p.stdout.read(W * H)
        if len(b) < W * H: break
        f = np.frombuffer(b, np.uint8).astype(np.int16).reshape(H, W)
        if prev is None: rows.append(np.zeros((GY, GX), np.uint16))
        else:
            d = (np.abs(f - prev) > 28).reshape(GY, H // GY, GX, W // GX).sum(axis=(1, 3)).astype(np.uint16); rows.append(d)
        prev = f
    np.save(f"/home/user/git-seri/cek/{k}_beda.npy", np.stack(rows)); print(k, len(rows), flush=True)
