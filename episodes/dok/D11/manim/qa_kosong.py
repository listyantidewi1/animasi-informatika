"""Cari layar kosong: python3 qa_kosong.py <mp4> ...  (cuplik 2 fps, lapor rentang >= 2,5 dtk tanpa isi)"""
import subprocess, sys
import numpy as np
for f in sys.argv[1:]:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vf", "fps=2,scale=160:90,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, np.uint8).reshape(-1, 90, 160).astype(int)
    bg = int(np.median(a[0])) if True else 16
    isi = (np.abs(a - 16) > 14).mean(axis=(1, 2))
    kos = isi < 0.002; run = 0; out = []
    for i, k in enumerate(list(kos) + [False]):
        if k: run += 1
        else:
            if run >= 5: out.append((round((i - run) / 2, 1), run / 2))
            run = 0
    print(f.split("/")[-1], "kosong:", out or "tidak ada")
