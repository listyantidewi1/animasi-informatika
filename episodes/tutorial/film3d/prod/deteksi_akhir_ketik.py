import subprocess, numpy as np, json, sys
def frames(src, a, b, fps=10):
    cmd = ["ffmpeg", "-loglevel", "error", "-ss", str(a), "-to", str(b), "-i", f"/home/user/animasi-informatika/episodes/tutorial/film3d/raw/{src}.mkv",
           "-vf", f"fps={fps},crop=1240:1440:1300:0,scale=620:720,format=gray", "-f", "rawvideo", "-"]
    raw = subprocess.run(cmd, capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, 720, 620)
def tinta(f):
    g = f.astype(int)
    line = ((g > 55) & (g < 140)).mean(1) > 0.7
    ys = np.where(line)[0]
    ys = [y for y in ys if y > 200]
    if len(ys) < 2: return -1, None
    # kelompokkan
    grp = [ys[0]]
    for y in ys[1:]:
        if y - grp[-1] > 2: grp.append(y)
    if len(grp) < 2: return -1, None
    a, b = grp[-2], grp[-1]
    reg = g[a + 3:b - 2, 20:]
    return int((reg > 150).sum()), (a, b)
def deteksi(src, t0, dur=60):
    F = frames(src, t0, t0 + dur)
    ink = [tinta(f)[0] for f in F]
    mx = 0
    for i, v in enumerate(ink):
        if v > mx: mx = v
        if mx > 300 and 0 <= v < mx * 0.25:
            return round(t0 + (i - 1) / 10, 2), ink
    return None, ink
if __name__ == "__main__":
    r, ink = deteksi(sys.argv[1], float(sys.argv[2]))
    print(r, ink[::5])
