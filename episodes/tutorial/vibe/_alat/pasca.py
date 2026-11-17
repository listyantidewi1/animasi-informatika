"""Pascaproduksi rekaman layar: kamera halus (zoom/geser), label langkah, kartu judul. Keluaran 1920x1080 30fps."""
import cv2, json, sys, subprocess, numpy as np, math
from PIL import Image, ImageDraw, ImageFont
OW, OH, FPS = 1920, 1080, 30
FB = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"; FS = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"

def pil_rgba(img): a = np.array(img); return a[:, :, :3][:, :, ::-1].copy(), a[:, :, 3:4] / 255.0

def label_img(teks):
    f = ImageFont.truetype(FB, 44); w = int(f.getlength(teks)) + 90; h = 92
    im = Image.new("RGBA", (w + 20, h + 20), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([10, 14, w + 10, h + 14], 22, fill=(0, 0, 0, 70))
    d.rounded_rectangle([6, 6, w + 6, h + 6], 22, fill=(20, 24, 38, 235))
    d.rounded_rectangle([6, 6, 22, h + 6], 8, fill=(255, 176, 32, 255))
    d.text((52, 6 + h / 2), teks, font=f, fill=(255, 255, 255, 255), anchor="lm")
    return pil_rgba(im)

def tempel(fr, ov, x, y, alpha):
    bgr, a = ov; h, w = bgr.shape[:2]
    roi = fr[y:y + h, x:x + w].astype(np.float32); a = a * alpha
    fr[y:y + h, x:x + w] = (roi * (1 - a) + bgr * a).astype(np.uint8)

def kartu(judul, sub, warna=(255, 176, 32)):
    im = Image.new("RGB", (OW, OH)); d = ImageDraw.Draw(im)
    for yy in range(OH):
        k = yy / OH; d.line([(0, yy), (OW, yy)], fill=(int(16 + 10 * k), int(20 + 12 * k), int(34 + 26 * k)))
    # pola titik kisi halus
    for gx in range(60, OW, 60):
        for gy in range(60, OH, 60): d.point((gx, gy), fill=(48, 56, 82))
    f1 = ImageFont.truetype(FB, 92); f2 = ImageFont.truetype(FS, 44); f3 = ImageFont.truetype(FS, 34)
    d.rounded_rectangle([140, 300, 410, 352], 26, fill=warna); d.text((275, 326), "PROYEK PEMROGRAMAN", font=ImageFont.truetype(FB, 22), fill=(20, 24, 38), anchor="mm")
    y = 400
    for baris in judul.split("\n"):
        d.text((140, y), baris, font=f1, fill=(255, 255, 255)); y += 112
    d.text((140, y + 30), sub, font=f2, fill=(190, 200, 225))
    return np.array(im)[:, :, ::-1].copy()

def jalankan(src, out, judul=None, sub="", dur_kartu=3.5):
    log = json.load(open(src + ".json")); W, H = log["src"]
    cap = cv2.VideoCapture(src + ".mkv"); n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OW}x{OH}", "-r", str(FPS), "-i", "-",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], stdin=subprocess.PIPE)
    if judul:
        k = kartu(judul, sub); nk = int(dur_kartu * FPS)
        for i in range(nk):
            t = i / FPS; s = 1 + 0.02 * t / dur_kartu
            M = cv2.getRotationMatrix2D((OW / 2, OH / 2), 0, s); fr = cv2.warpAffine(k, M, (OW, OH))
            fade = min(1, t / 0.4, (dur_kartu - t) / 0.4); ff.stdin.write((fr * max(0, fade)).astype(np.uint8).tobytes())
    kam = sorted(log["kamera"], key=lambda e: e[0])
    L = sorted(log["label"], key=lambda e: e[0]); labels = []
    for j, (t, tx, d, pos) in enumerate(L):
        d = d or 3.0
        if j + 1 < len(L): d = min(d, L[j + 1][0] - t - 0.05)
        labels.append((t, label_img(tx), d, pos))
    cx, cy, z = W / 2, H / 2, 1.0; vx = vy = vz = 0.0; om = 4.0; dt = 1 / FPS; ki = 0; tgt = [W / 2, H / 2, 1.0]
    for i in range(n):
        ok, fr = cap.read()
        if not ok: break
        t = i / FPS
        while ki < len(kam) and kam[ki][0] <= t:
            tgt = kam[ki][1] or [W / 2, H / 2, 1.0]; ki += 1
        # pegas teredam kritis
        for attr in range(3):
            pass
        ax = om * om * (tgt[0] - cx) - 2 * om * vx; vx += ax * dt; cx += vx * dt
        ay = om * om * (tgt[1] - cy) - 2 * om * vy; vy += ay * dt; cy += vy * dt
        az = om * om * (tgt[2] - z) - 2 * om * vz; vz += az * dt; z += vz * dt
        zz = max(1.0, z); cw, ch = W / zz, H / zz
        x0 = min(max(cx - cw / 2, 0), W - cw); y0 = min(max(cy - ch / 2, 0), H - ch)
        s = OW / cw
        M = np.float32([[s, 0, -x0 * s], [0, s, -y0 * s]])
        o = cv2.warpAffine(fr, M, (OW, OH), flags=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC)
        for (lt, ov, d, pos) in labels:
            if lt <= t < lt + d:
                a = min(1, (t - lt) / 0.25, (lt + d - t) / 0.3); dy = int((1 - min(1, (t - lt) / 0.25)) * 20)
                tempel(o, ov, 60, (50 - dy) if pos == 'atas' else (OH - 60 - ov[0].shape[0] + dy), a)
        ff.stdin.write(o.tobytes())
    ff.stdin.close(); ff.wait()

if __name__ == "__main__":
    a = sys.argv; jalankan(a[1], a[2], a[3].replace("\\n", "\n") if len(a) > 3 else None, a[4] if len(a) > 4 else "")
