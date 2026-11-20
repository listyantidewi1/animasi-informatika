import subprocess, numpy as np, json, sys
W, H = 2560, 1440
def frame(src, t):
    raw = subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-ss", f"{t:.3f}", "-i", src, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(H, W)
def baris_aktif(g, x0=760, x1=2440):
    """y atas dan tinggi baris kursor (bingkai lineHighlightBorder), atau None."""
    med = np.median(g[:, x0:x1], axis=1).astype(int)
    kand = [y for y in range(2, H - 2) if med[y] - min(med[y - 2], med[y + 2]) >= 5 and 33 <= med[y] <= 52]
    # kelompokkan
    grp = []
    for y in kand:
        if grp and y - grp[-1][-1] <= 1: grp[-1].append(y)
        else: grp.append([y])
    ys = [sum(a) / len(a) for a in grp]
    for i in range(len(ys)):
        for j in range(i + 1, len(ys)):
            d = ys[j] - ys[i]
            if 36 <= d <= 48 or 80 <= d <= 92 or 123 <= d <= 135: return ys[i], d, ys
    return None, None, ys
if __name__ == "__main__":
    ep = sys.argv[1]; d = json.load(open(f"/home/user/baca/{ep}/rek.json"))
    for t, k in d["kamera"]:
        if k and k[2] >= 1.55:
            lab = [l for l in d["label"] if -0.3 <= l[0] - t <= 0.8]
            y, h, ys = baris_aktif(frame(f"/home/user/baca/{ep}/rek.mkv", t + 1.3))
            print(ep, round(t, 1), "ky=%.0f" % k[1], "deteksi=", None if y is None else round(y), h and round(h), "selisih=", None if y is None else round(y + h / 2 - k[1]), lab[0][1] if lab else "(tanpa label)", flush=True)
