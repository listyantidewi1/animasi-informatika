"""Pascaproduksi rekaman layar: kamera halus (zoom/geser), label langkah, kartu judul. Keluaran 1920x1080 30fps."""
import os, cv2, json, sys, subprocess, numpy as np, math
from PIL import Image, ImageDraw, ImageFont
OW, OH, FPS = 1920, 1080, 30
FB = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"; FS = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"

def pil_rgba(img): a = np.array(img); return a[:, :, :3][:, :, ::-1].copy(), a[:, :, 3:4] / 255.0

def label_img(teks):
    uk = 44
    while uk > 28 and ImageFont.truetype(FB, uk).getlength(teks) + 90 > OW - 140: uk -= 2  # label panjang: huruf dikecilkan supaya muat di bingkai
    f = ImageFont.truetype(FB, uk); w = int(f.getlength(teks)) + 90; h = 92
    im = Image.new("RGBA", (w + 20, h + 20), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([10, 14, w + 10, h + 14], 22, fill=(0, 0, 0, 70))
    d.rounded_rectangle([6, 6, w + 6, h + 6], 22, fill=(20, 24, 38, 235))
    d.rounded_rectangle([6, 6, 22, h + 6], 8, fill=(255, 176, 32, 255))
    d.text((52, 6 + h / 2), teks, font=f, fill=(255, 255, 255, 255), anchor="lm")
    return pil_rgba(im)

FM = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
CHIP = {"ketik": ("KETIK BERSAMA", (255, 176, 32), "Salin dari: "), "tahan": ("JEDA VIDEO BILA PERLU", (74, 222, 128), "Salin dari: "),
        "berkas": ("BERKAS INI", (125, 170, 255), ""), "term": ("KETIK DI TERMINAL", (255, 176, 32), "")}
def chip_img(jenis, teks):
    """Pita kiri bawah: lencana kecil + alamat GitHub berkas yang sedang diketik, atau perintah terminal."""
    tag, warna, awal = CHIP[jenis]
    if "github.com" not in teks: awal = ""
    ft = ImageFont.truetype(FB, 22); uk = 32
    mono = jenis == "term" or "github.com" in teks
    def F(u): return ImageFont.truetype(FM if mono else FS, u)
    wt = int(ft.getlength(tag)) + 36; fa = ImageFont.truetype(FS, 30); wa = int(fa.getlength(awal)) if awal else 0
    while uk > 20 and wt + wa + F(uk).getlength(teks) + 80 > OW - 120: uk -= 1
    f = F(uk); w = wt + wa + int(f.getlength(teks)) + 70; h = 68
    im = Image.new("RGBA", (w + 16, h + 16), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([8, 10, w + 8, h + 10], 18, fill=(0, 0, 0, 80))
    d.rounded_rectangle([4, 4, w + 4, h + 4], 18, fill=(16, 20, 34, 240), outline=warna + (255,), width=2)
    d.rounded_rectangle([14, 16, 14 + wt, h - 8], 12, fill=warna + (255,)); d.text((14 + wt / 2, 4 + h / 2), tag, font=ft, fill=(16, 20, 34, 255), anchor="mm")
    x = 14 + wt + 20
    if awal: d.text((x, 4 + h / 2), awal, font=fa, fill=(190, 200, 225, 255), anchor="lm"); x += wa
    d.text((x, 4 + h / 2), teks, font=f, fill=(255, 255, 255, 255), anchor="lm")
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
    # Sorot baris: kamera_editor(zoom=...) yang diikuti label = baris yang sedang dijelaskan. Posisi diambil dari
    # frame yang sudah diam (bingkai baris kursor), bukan dari catatan saat merekam.
    sorot = []
    if os.path.basename(src).startswith("rek"):
        for i, e in enumerate(kam):
            if not e[1] or (len(e[1]) > 3 and e[1][3] == 'bebas') or min(abs(e[1][2] - z0) for z0 in (1.3, 1.4, 1.6, 1.7)) > 0.01: continue  # hanya sorot editor
            lab = [l for l in log["label"] if -0.3 <= l[0] - e[0] <= 0.8]
            if not lab: continue
            g = _abu(src + ".mkv", e[0] + 1.3, W, H); ba = baris_aktif(g, dekat=e[1][1]) if g is not None else None
            if not ba: print("sorot: baris kursor tidak terdeteksi", round(e[0], 1), lab[0][1], flush=True); continue
            geser = (e[1][3] if len(e[1]) > 3 else 0) * LH; y0, hh = ba
            akhir = min(lab[0][0] + (lab[0][2] or 3.0), kam[i + 1][0] if i + 1 < len(kam) else 1e9)
            atas = (e[1][4] if len(e[1]) > 4 else 0) * LH; bawah = (e[1][5] if len(e[1]) > 5 else 0) * LH  # baris yang terlipat (word wrap)
            sorot.append((e[0] + 0.3, akhir, y0 + geser - atas, hh + atas + bawah, y0, hh)); e[1] = [e[1][0], y0 + geser + hh / 2, e[1][2]]
            print("sorot", round(e[0], 1), "y=%d" % (y0 + geser), lab[0][1], flush=True)
    # Zoom tidak boleh memotong teks di kanan: tepi kiri bingkai tetap, lebar diperluas sampai tepi kanan layar.
    for e in (kam if os.path.basename(src).startswith("rek") else []):  # hanya rekaman VS Code
        if e[1] and len(e[1]) > 3 and e[1][3] == "bebas": e[1] = e[1][:3]; continue  # zoom bebas (mis. Explorer): tidak diperlebar
        if e[1] and e[1][2] > 1.0:
            kx, ky, kz = e[1]; kiri = min(max(kx - W / (2 * kz), 0), W - W / kz)
            if kiri + W / kz < W - 1:
                kz2 = max(1.0, W / (W - kiri)); e[1] = [kiri + W / (2 * kz2), ky, kz2]
    L = sorted(log["label"], key=lambda e: e[0]); labels = []
    for j, (t, tx, d, pos) in enumerate(L):
        d = d or 3.0
        brk = [x[0] for x in L[j + 1:] if x[3] == pos]  # label berikutnya di posisi yang sama
        if brk: d = min(d, brk[0] - t - 0.05)
        labels.append((t, label_img(tx), d, pos))
    CL = sorted(log.get("chip", []), key=lambda e: e[0]); chips = []
    for j, (t, jenis, tx) in enumerate(CL):
        if jenis and tx: chips.append((t, CL[j + 1][0] if j + 1 < len(CL) else 1e9, chip_img(jenis, tx)))
    cx, cy, z = W / 2, H / 2, 1.0; vx = vy = vz = 0.0; om = 4.0; dt = 1 / FPS; ki = 0; tgt = [W / 2, H / 2, 1.0]
    # Pakai stempel waktu asli tiap frame: bila perekam sempat kehilangan frame, frame terakhir diulang supaya waktu tetap pas.
    ok, fr = cap.read(); tf = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000; nxt = None
    dur = log.get("durasi") or n / FPS
    for i in range(int(dur * FPS)):
        t = i / FPS
        while ok:
            if nxt is None:
                ok2, fr2 = cap.read()
                if not ok2: break
                nxt = (cap.get(cv2.CAP_PROP_POS_MSEC) / 1000, fr2)
            if nxt[0] <= t + 0.5 / FPS: tf, fr = nxt; nxt = None
            else: break
        if fr is None: break
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
        fb = fr
        for (ta, tb, ys, hh, ycek, hcek) in sorot:
            if ta <= t < tb and garis_ada(fr, ycek) and garis_ada(fr, ycek + hcek):
                al = 0.24 * min(1, (t - ta) / 0.25, (tb - t) / 0.25); a0, a1 = int(ys) + 1, int(ys + hh) + 1
                fb = fr.copy(); blok = fb[a0:a1, 590:2545].astype(np.float32)
                fb[a0:a1, 590:2545] = (blok * (1 - al) + np.float32([36, 191, 251]) * al).astype(np.uint8)
                fb[a0:a1, 590:600] = (fb[a0:a1, 590:600] * (1 - al / 0.24) + np.float32([36, 191, 251]) * (al / 0.24)).astype(np.uint8)
        s = OW / cw
        M = np.float32([[s, 0, -x0 * s], [0, s, -y0 * s]])
        o = cv2.warpAffine(fb, M, (OW, OH), flags=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC)
        ada_chip = False
        for (ca, cb, ov) in chips:
            if ca <= t < cb:
                a = min(1, (t - ca) / 0.2, (cb - t) / 0.2); tempel(o, ov, 40, OH - 34 - ov[0].shape[0], max(0, a)); ada_chip = True
        for (lt, ov, d, pos) in labels:
            if pos != 'atas' and ada_chip: pos = 'bawah2'  # label bawah naik di atas pita
            if lt <= t < lt + d:
                a = min(1, (t - lt) / 0.25, (lt + d - t) / 0.3); dy = int((1 - min(1, (t - lt) / 0.25)) * 20)
                tempel(o, ov, max(60, OW - 100 - ov[0].shape[1]), (50 - dy) if pos == 'atas' else (OH - (150 if pos == 'bawah2' else 60) - ov[0].shape[0] + dy), a)
        ff.stdin.write(o.tobytes())
    ff.stdin.close(); ff.wait()

LH = 26 * 1.6667  # tinggi baris editor dalam piksel rekaman
def _abu(src, t, W, H):
    raw = subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-ss", f"{t:.3f}", "-i", src, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(H, W) if len(raw) == W * H else None
def baris_aktif(g, x0=760, x1=2440, dekat=None):
    """Bingkai baris kursor VS Code (lineHighlightBorder) pada frame abu-abu: (y atas, tinggi) atau None."""
    H = g.shape[0]
    med = np.median(g[:, x0:x1], axis=1).astype(int)
    kand = [y for y in range(2, H - 2) if med[y] - min(med[y - 2], med[y + 2]) >= 5 and 33 <= med[y] <= 52]
    grp = []
    for y in kand:
        if grp and y - grp[-1][-1] <= 1: grp[-1].append(y)
        else: grp.append([y])
    ys = [sum(a) / len(a) for a in grp]
    cocok = []
    for i in range(len(ys)):
        for j in range(i + 1, len(ys)):
            d = ys[j] - ys[i]
            if 36 <= d <= 48 or 80 <= d <= 92 or 123 <= d <= 135: cocok.append((ys[i], d))
    if not cocok: return None
    if dekat is None: return cocok[0]
    return min(cocok, key=lambda q: abs(q[0] - dekat))  # yang paling dekat dengan posisi kursor saat merekam
def garis_ada(fr, y):
    """Apakah garis bingkai baris kursor masih ada di sekitar y pada frame BGR ini (layar belum bergulir)?"""
    y = int(round(y)); m = np.median(fr[max(0, y - 3):y + 4, 760:2440:4, 1], axis=1)
    return m.max() - m.min() >= 5

if __name__ == "__main__":
    a = sys.argv; jalankan(a[1], a[2], a[3].replace("\\n", "\n") if len(a) > 3 else None, a[4] if len(a) > 4 else "")
