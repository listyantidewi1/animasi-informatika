"""Rakit video akhir dari rek.mkv + rek.json + suara/*.mp3: kait, kartu bagian, kamera halus, pita ketik, panel penutup, SRT.
python3 rakit.py [keluar.mp4]      (RENCANA=1 hanya mencetak rencana waktu)"""
import cv2, json, sys, os, subprocess, re, math, numpy as np
from PIL import Image, ImageDraw, ImageFont
from naskah import BEATS, BAB

D = os.path.dirname(os.path.abspath(__file__))
OW, OH, FPS = 1920, 1080, 30
FB = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"; FS = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"; FR = "/usr/share/fonts/opentype/inter/Inter-Regular.otf"
FM = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"; FMB = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
URL_PALSU = ("colab.research.google.com", "/drive/1mKq8Zt3vWx0aYpL5nR7sJc2dEfGhUiBo")
KARTU = 3.6
log = json.load(open(D + "/rek.json")); W, H = log["src"]
KATA = json.load(open(D + "/kata.json")) if os.path.exists(D + "/kata.json") else {}
TEKS = {b[0]: b[1] for b in BEATS}

def durasi(i):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{D}/suara/{i}.mp3"], capture_output=True, text=True)
    return float(r.stdout.strip())
DUR = {b[0]: durasi(b[0]) for b in BEATS}
TANDA = {n: t for t, n in log["tanda"]}
def kata_mulai(beat, awalan, cadangan):
    for a, b, k in KATA.get(beat, []):
        if k.lower().strip(".,:").startswith(awalan): return a
    return cadangan

# ---------- gambar bantu ----------
def bgra(img): a = np.array(img); return a[:, :, :3][:, :, ::-1].copy(), a[:, :, 3:4] / 255.0
def tempel(fr, ov, x, y, alpha=1.0):
    bgr, a = ov; h, w = bgr.shape[:2]; x = int(x); y = int(y)
    if alpha <= 0: return
    roi = fr[y:y + h, x:x + w].astype(np.float32); a = a * alpha
    fr[y:y + h, x:x + w] = (roi * (1 - a) + bgr * a).astype(np.uint8)
_cache = {}
def pita(teks, gaya):
    k = (teks, gaya)
    if k in _cache: return _cache[k]
    if gaya == "ketik":
        f = ImageFont.truetype(FMB, 40); fk = ImageFont.truetype(FB, 26); lw = int(fk.getlength("KETIK")) + 44
        while f.getlength(teks) > OW - 300 - lw: f = ImageFont.truetype(FMB, f.size - 2)
        w = int(f.getlength(teks)) + lw + 80; h = 92
        im = Image.new("RGBA", (w + 24, h + 28), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.rounded_rectangle([10, 16, w + 14, h + 20], 24, fill=(0, 0, 0, 60)); d.rounded_rectangle([8, 8, w + 8, h + 8], 24, fill=(22, 27, 41, 242))
        d.rounded_rectangle([20, 22, 20 + lw, h - 6], 16, fill=(249, 171, 0, 255)); d.text((20 + lw / 2, 8 + h / 2), "KETIK", font=fk, fill=(22, 27, 41, 255), anchor="mm")
        d.text((20 + lw + 24, 8 + h / 2 + 1), teks, font=f, fill=(255, 255, 255, 255), anchor="lm")
    elif gaya == "langkah":
        f = ImageFont.truetype(FB, 40); w = int(f.getlength(teks)) + 84; h = 86
        im = Image.new("RGBA", (w + 24, h + 28), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.rounded_rectangle([10, 16, w + 14, h + 20], 24, fill=(0, 0, 0, 60)); d.rounded_rectangle([8, 8, w + 8, h + 8], 24, fill=(249, 171, 0, 255))
        d.text((8 + w / 2, 8 + h / 2), teks, font=f, fill=(22, 27, 41, 255), anchor="mm")
    else:
        f = ImageFont.truetype(FS, 38); w = int(f.getlength(teks)) + 84; h = 86
        im = Image.new("RGBA", (w + 24, h + 28), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.rounded_rectangle([10, 16, w + 14, h + 20], 24, fill=(0, 0, 0, 60)); d.rounded_rectangle([8, 8, w + 8, h + 8], 24, fill=(22, 27, 41, 242))
        d.text((8 + w / 2, 8 + h / 2), teks, font=f, fill=(255, 255, 255, 255), anchor="mm")
    _cache[k] = bgra(im); return _cache[k]

def latar():
    im = Image.new("RGB", (OW, OH)); d = ImageDraw.Draw(im)
    for yy in range(OH):
        k = yy / OH; d.line([(0, yy), (OW, yy)], fill=(int(17 + 8 * k), int(21 + 11 * k), int(34 + 22 * k)))
    for gx in range(60, OW, 60):
        for gy in range(60, OH, 60): d.point((gx, gy), fill=(46, 54, 80))
    return im
def kartu_bab(kunci):
    urut = [k for k in BAB if BAB[k]]; n = urut.index(kunci) + 1
    im = latar(); d = ImageDraw.Draw(im)
    d.rounded_rectangle([150, 250, 150 + 230, 250 + 58], 29, fill=(249, 171, 0)); d.text((150 + 115, 279), f"BAGIAN {n}", font=ImageFont.truetype(FB, 28), fill=(22, 27, 41), anchor="mm")
    f1 = ImageFont.truetype(FB, 84); kata = BAB[kunci].split(" "); baris = [""]
    for k in kata:
        if f1.getlength((baris[-1] + " " + k).strip()) > 1500: baris.append(k)
        else: baris[-1] = (baris[-1] + " " + k).strip()
    y = 345
    for b in baris: d.text((150, y), b, font=f1, fill=(255, 255, 255)); y += 104
    y = max(y + 70, 640); f2 = ImageFont.truetype(FS, 34); f2b = ImageFont.truetype(FB, 34)
    for i, k in enumerate(urut):
        aktif = k == kunci; lewat = i < n - 1
        d.ellipse([150, y + 4, 186, y + 40], fill=(249, 171, 0) if aktif else ((70, 82, 116) if lewat else (38, 46, 70)))
        d.text((168, y + 22), str(i + 1), font=ImageFont.truetype(FB, 22), fill=(22, 27, 41) if aktif else (190, 200, 225), anchor="mm")
        d.text((206, y + 22), BAB[k], font=f2b if aktif else f2, fill=(255, 255, 255) if aktif else (140, 152, 184), anchor="lm"); y += 56
    return np.array(im)[:, :, ::-1].copy()

# ---------- sumber video ----------
cap = cv2.VideoCapture(D + "/rek.mkv"); NF = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
def cari_kilat():
    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    for i in range(240):
        ok, fr = cap.read()
        if not ok: break
        if fr[H // 2 - 50:H // 2 + 50, W // 2 - 50:W // 2 + 50].mean() < 40: return i / FPS
    raise SystemExit("kilat kalibrasi tidak ditemukan")
OFF = cari_kilat()
def bingkai(t_log):
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(round((t_log + OFF) * FPS))); ok, fr = cap.read(); return fr

# tambalan alamat (notebook sungguhan beralamat /drive/<id>)
T_EDITOR = TANDA.get("editor", 1e9)
def buat_tambalan():
    fr = bingkai(T_EDITOR + 3); y0, y1, x0, x1 = 78, 132, 252, 2300
    bg = fr[90:96, 2200:2260].reshape(-1, 3).mean(0)
    # ukur huruf dari teks asli: lebar "colab.research.google.com"
    g = cv2.cvtColor(fr[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY).astype(int); gelap = np.where((np.abs(g - int(bg.mean())) > 60).any(0))[0]
    xa = x0 + gelap[0]; rows = np.where((np.abs(g - int(bg.mean())) > 60).any(1))[0]; ya, yb = y0 + rows[0], y0 + rows[-1]
    im = Image.new("RGB", (x1 - x0, y1 - y0), tuple(int(c) for c in bg[::-1])); d = ImageDraw.Draw(im)
    # cari ukuran font: tinggi huruf "l" (ascender) ~ ya..yb mencakup g (descender). Cocokkan lewat lebar domain pada bingkai asli.
    best = None
    for s10 in range(180, 300):
        f = ImageFont.truetype(FR, s10 / 10); bb = f.getbbox("colab.research.google.com/notebooks")
        hh = bb[3] - bb[1]
        if best is None or abs(hh - (yb - ya + 1)) < best[0]: best = (abs(hh - (yb - ya + 1)), s10 / 10)
    f = ImageFont.truetype(FR, best[1]); bb = f.getbbox("colab.research.google.com/notebooks")
    x = xa - x0 - bb[0]; y = ya - y0 - bb[1]
    d.text((x, y), URL_PALSU[0], font=f, fill=(31, 31, 31)); d.text((x + f.getlength(URL_PALSU[0]), y), URL_PALSU[1], font=f, fill=(95, 99, 104))
    return (np.array(im)[:, :, ::-1].copy(), x0, y0)
TAMBAL = buat_tambalan() if T_EDITOR < 1e8 else None
def tambal(fr, t_log):
    if TAMBAL is not None and t_log >= T_EDITOR:
        p, x0, y0 = TAMBAL; fr[y0:y0 + p.shape[0], x0:x0 + p.shape[1]] = p
    return fr

# ---------- kamera (pegas teredam kritis) dihitung untuk semua bingkai sumber ----------
def jalur_kamera():
    kam = sorted(log["kamera"], key=lambda e: e[0]); out = []; cx, cy, z = W / 2, H / 2, 1.0; vx = vy = vz = 0.0; om = 4.6; dt = 1 / FPS; ki = 0; tgt = [W / 2, H / 2, 1.0]
    for i in range(NF):
        t = i / FPS - OFF
        while ki < len(kam) and kam[ki][0] <= t: tgt = kam[ki][1] or [W / 2, H / 2, 1.0]; ki += 1
        ax = om * om * (tgt[0] - cx) - 2 * om * vx; vx += ax * dt; cx += vx * dt
        ay = om * om * (tgt[1] - cy) - 2 * om * vy; vy += ay * dt; cy += vy * dt
        az = om * om * (tgt[2] - z) - 2 * om * vz; vz += az * dt; z += vz * dt
        out.append((cx, cy, max(1.0, z)))
    return out
KAM = jalur_kamera()
def pandang(fr, c, ekstra=1.0):
    cx, cy, z = c; z *= ekstra; cw, ch = W / z, H / z
    x0 = min(max(cx - cw / 2, 0), W - cw); y0 = min(max(cy - ch / 2, 0), H - ch); s = OW / cw
    M = np.float32([[s, 0, -x0 * s], [0, s, -y0 * s]])
    return cv2.warpAffine(fr, M, (OW, OH), flags=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC)
def diam(t_log, lebar=False):
    fr = tambal(bingkai(t_log), t_log); i = int(round((t_log + OFF) * FPS))
    return pandang(fr, (W / 2, H / 2, 1.0) if lebar else KAM[i]), fr

# ---------- label (waktu log) ----------
LAB = []
ev = sorted(log["label"], key=lambda e: e[0])
for j, (t, teks, gaya, dur) in enumerate(ev):
    if teks is None: continue
    akhir = ev[j + 1][0] if j + 1 < len(ev) else log["durasi"] + 5
    LAB.append((t, akhir, teks, gaya))
def gambar_label(o, t):
    for (a, b, teks, gaya) in LAB:
        if a <= t < b:
            ov = pita(teks, gaya); al = min(1, (t - a) / 0.25, (b - t) / 0.25); dy = int((1 - min(1, (t - a) / 0.25)) * 18)
            if gaya == "langkah": tempel(o, ov, 48, 40 - dy + 18, al)
            else: tempel(o, ov, (OW - ov[0].shape[1]) // 2, OH - 44 - ov[0].shape[0] + dy, al)

# ---------- rencana garis waktu ----------
POT = sorted(log["potong"]); UCAP = {i: t for t, i in log["ucap"]}; AKHIR = log["durasi"] - 0.4
def potongan(a, b):
    out = []; x = a
    for (p, q) in POT:
        if q <= x or p >= b: continue
        if p > x: out.append((x, p))
        x = max(x, q)
    if x < b: out.append((x, b))
    return out
ITEM = []   # (jenis, data, durasi)
ITEM.append(("kait", None, DUR["k1"] + 0.55 + DUR["k2"] + 0.9))
bab = [k for k in BAB if BAB[k]]
for i, k in enumerate(bab):
    a = TANDA["bab:" + k]; b = TANDA["bab:" + bab[i + 1]] if i + 1 < len(bab) else TANDA["tutup"]
    ITEM.append(("kartu", k, KARTU))
    for (x, y) in potongan(a, b): ITEM.append(("src", (x, y), y - x))
ITEM.append(("panel", None, TANDA["tantangan"] - TANDA["tutup"]))
ITEM.append(("src", (TANDA["tantangan"], AKHIR), AKHIR - TANDA["tantangan"]))
ITEM.append(("akhir", None, 1.2))
t = 0; MULAI = []
for it in ITEM: MULAI.append(t); t += round(it[2] * FPS) / FPS
TOTAL = t
def keluar_t(t_log):
    """waktu log -> waktu video akhir"""
    for it, m in zip(ITEM, MULAI):
        if it[0] == "src" and it[1][0] - 1e-6 <= t_log < it[1][1] - 1e-6: return m + (t_log - it[1][0])
        if it[0] == "panel" and TANDA["tutup"] <= t_log < TANDA["tantangan"]: return m + (t_log - TANDA["tutup"])
    raise ValueError(f"waktu {t_log} terpotong")
SUARA = [("k1", 0.3), ("k2", 0.3 + DUR["k1"] + 0.55)] + [(i, keluar_t(tt)) for i, tt in UCAP.items()]

def tulis_srt(path):
    def f(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)) % 1000:03d}"
    cues = []
    for i, t0 in sorted(SUARA, key=lambda e: e[1]):
        kal = re.split(r"(?<=[.?!])\s+", TEKS[i]); bag = []
        for k in kal:
            if len(k) > 84 and ", " in k:
                ps = [m.start() for m in re.finditer(", ", k)]; p = min(ps, key=lambda q: abs(q - len(k) / 2)); bag += [k[:p + 1], k[p + 2:]]
            else: bag.append(k)
        tot = sum(len(b) for b in bag); x = t0
        for b in bag:
            d = DUR[i] * len(b) / tot; cues.append((x, x + d - 0.05, b)); x += d
    with open(path, "w") as fo:
        for n, (a, b, tx) in enumerate(cues, 1): fo.write(f"{n}\n{f(a)} --> {f(b)}\n{tx}\n\n")

def cetak_rencana():
    for it, m in zip(ITEM, MULAI): print(f"{m:7.2f} {it[0]:6s} {it[2]:6.2f} {it[1] if it[0] != 'src' else '%.2f-%.2f' % it[1]}")
    print("total", round(TOTAL, 2), "offset", OFF)
    for i, x in sorted(SUARA, key=lambda e: e[1]): print(f"  {x:7.2f} {i} ({DUR[i]:.1f})")
    s = sorted(SUARA, key=lambda e: e[1])
    for (i, x), (j, y) in zip(s, s[1:]):
        if y - (x + DUR[i]) > 6: print(f"  hening {y - x - DUR[i]:.1f} dtk setelah {i}")
        if y < x + DUR[i]: print(f"  TUMPANG TINDIH {i} -> {j}")

# ---------- penggambar tiap jenis ----------
def gambar_kait():
    g_dekat, g_mentah = diam(TANDA["galat_diam"]); g_lebar = pandang(g_mentah, (W / 2, H / 2, 1.0)); b_dekat, _ = diam(TANDA["beres_diam"])
    kt = log["kotak"]; cxg = kt["tb"][0] + kt["tb"][2] / 2; cyg = kt["tb"][1] + kt["tb"][3] / 2; ig = int(round((TANDA["galat_diam"] + OFF) * FPS)); kam_g = KAM[ig]
    d1 = DUR["k1"] + 0.55 + 0.3; t2 = 0.3 + DUR["k1"] + 0.55
    ta = t2 + kata_mulai("k2", "lalu", 5.2) - 0.3; tb_ = t2 + kata_mulai("k2", "memperbaiki", 8.0) - 0.25; n = round(ITEM[0][2] * FPS)
    def kb(mentah, c0, c1, k):
        e = k * k * (3 - 2 * k); return pandang(mentah, tuple(a + (b - a) * e for a, b in zip(c0, c1)))
    dekat0 = (kam_g[0], kam_g[1], kam_g[2] * 0.96); dekat1 = (cxg, cyg + 20, kam_g[2] * 1.12)
    for i in range(n):
        t = i / FPS
        if t < d1: fr = kb(g_mentah, dekat0, dekat1, t / d1)
        elif t < ta:
            fr = kb(g_mentah, (W / 2, H / 2, 1.0), (W * 0.42, H * 0.42, 1.12), (t - d1) / (ta - d1))
            if t - d1 < 0.4: fr = cv2.addWeighted(kb(g_mentah, dekat0, dekat1, 1.0), 1 - (t - d1) / 0.4, fr, (t - d1) / 0.4, 0)
        elif t < tb_:
            fr = kb(g_mentah, dekat1, dekat0, (t - ta) / (tb_ - ta))
            if t - ta < 0.4: fr = cv2.addWeighted(kb(g_mentah, (W / 2, H / 2, 1.0), (W * 0.42, H * 0.42, 1.12), 1.0), 1 - (t - ta) / 0.4, fr, (t - ta) / 0.4, 0)
        else:
            fr = b_dekat
            if t - tb_ < 0.5: fr = cv2.addWeighted(kb(g_mentah, dekat1, dekat0, 1.0), 1 - (t - tb_) / 0.5, b_dekat, (t - tb_) / 0.5, 0)
        if t < 0.3: fr = (fr * (t / 0.3)).astype(np.uint8)
        if t > n / FPS - 0.35: fr = (fr * max(0, (n / FPS - t) / 0.35)).astype(np.uint8)
        yield fr

def gambar_kartu(k):
    kb = kartu_bab(k); n = round(KARTU * FPS)
    for i in range(n):
        t = i / FPS; fade = min(1, t / 0.35, (KARTU - t) / 0.35); yield (kb * max(0, fade)).astype(np.uint8)

def gambar_src(a, b):
    i0 = int(round((a + OFF) * FPS)); n = round((b - a) * FPS); cap.set(cv2.CAP_PROP_POS_FRAMES, i0)
    for j in range(n):
        ok, fr = cap.read()
        if not ok: break
        t = a + j / FPS; o = pandang(tambal(fr, t), KAM[min(i0 + j, NF - 1)]); gambar_label(o, t); yield o

def gambar_panel(dur):
    _, mentah = diam(TANDA["galat_diam"]); kt = log["kotak"]; tb = kt["tb"]; halo = kt["halo"]
    x0 = int(tb[0] - 70); y0 = int(halo[1] - 22); x1 = int(tb[0] + tb[2] + 40); y1 = int(tb[1] + tb[3] + 30)
    crop = mentah[y0:y1, x0:x1]; s = min(1010 / crop.shape[1], 640 / crop.shape[0]); crop = cv2.resize(crop, None, fx=s, fy=s, interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC)
    ch, cw = crop.shape[:2]; px, py = 90, (OH - ch) // 2 + 30
    dasar = latar(); d = ImageDraw.Draw(dasar)
    d.text((90, 96), "Tiga langkah membaca error", font=ImageFont.truetype(FB, 64), fill=(255, 255, 255))
    d.rounded_rectangle([px - 22, py - 22, px + cw + 22, py + ch + 22], 26, fill=(255, 255, 255))
    dasar = np.array(dasar)[:, :, ::-1].copy(); dasar[py:py + ch, px:px + cw] = crop
    def kotak(nama, potong_kiri=0): r = kt[nama]; return [px + (r[0] - x0) * s + potong_kiri, py + (r[1] - y0) * s, r[2] * s - potong_kiri, r[3] * s]
    ak = kotak("akhir"); ps = kotak("pesan"); pn = kotak("panah")
    jenis = [ak[0], ak[1], ps[0] - ak[0] - 14, ak[3]]
    langkah = [("1", "Lihat jenis error di baris paling bawah", jenis, kata_mulai("p1", "lihat", 3.4)),
               ("2", "Baca pesannya", ps, kata_mulai("p1", "baca", 6.9)), ("3", "Cari tanda panahnya", pn, kata_mulai("p1", "cari", 8.6))]
    fb = ImageFont.truetype(FB, 34); ft = ImageFont.truetype(FS, 40); n = round(dur * FPS); XK = px + cw + 80
    for i in range(n):
        t = i / FPS; im = Image.fromarray(dasar[:, :, ::-1]).convert("RGBA"); lap = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lap)
        for j, (no, teks, r, tm) in enumerate(langkah):
            al = max(0, min(1, (t - tm + 0.15) / 0.3))
            if al <= 0: continue
            A = int(255 * al)
            d.rounded_rectangle([r[0] - 8, r[1] - 6, r[0] + r[2] + 8, r[1] + r[3] + 6], 10, outline=(249, 171, 0, A), width=5, fill=(249, 171, 0, int(40 * al)))
            bx, by = (r[0] + r[2] + 36, r[1] + r[3] / 2) if no == "2" else (r[0] - 34, r[1] + r[3] / 2); d.ellipse([bx - 21, by - 21, bx + 21, by + 21], fill=(249, 171, 0, A)); d.text((bx, by), no, font=ImageFont.truetype(FB, 26), fill=(22, 27, 41, A), anchor="mm")
            y = 330 + j * 170; d.ellipse([XK, y, XK + 64, y + 64], fill=(249, 171, 0, A)); d.text((XK + 32, y + 32), no, font=fb, fill=(22, 27, 41, A), anchor="mm")
            kata = teks.split(" "); baris = [""]
            for k in kata:
                if ft.getlength((baris[-1] + " " + k).strip()) > OW - XK - 150: baris.append(k)
                else: baris[-1] = (baris[-1] + " " + k).strip()
            for bi, bt in enumerate(baris): d.text((XK + 88, y + 32 + (bi - (len(baris) - 1) / 2) * 50), bt, font=ft, fill=(255, 255, 255, A), anchor="lm")
        fr = np.array(Image.alpha_composite(im, lap).convert("RGB"))[:, :, ::-1].copy()
        fade = min(1, t / 0.35, (dur - t) / 0.35); yield (fr * max(0, fade)).astype(np.uint8)

def main():
    if os.environ.get("RENCANA"): cetak_rencana(); return
    out = sys.argv[1] if len(sys.argv) > 1 else D + "/out/Google_Colab_Pertama.mp4"; os.makedirs(os.path.dirname(out), exist_ok=True)
    cetak_rencana()
    ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OW}x{OH}", "-r", str(FPS), "-i", "-",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", D + "/out/_video.mp4"], stdin=subprocess.PIPE)
    akhir = None
    for it, m in zip(ITEM, MULAI):
        n = round(it[2] * FPS); c = 0
        if it[0] == "kait": gen = gambar_kait()
        elif it[0] == "kartu": gen = gambar_kartu(it[1])
        elif it[0] == "src": gen = gambar_src(*it[1])
        elif it[0] == "panel": gen = gambar_panel(it[2])
        else: gen = ((akhir * max(0, 1 - (i / FPS) / 1.0)).astype(np.uint8) for i in range(n))
        for fr in gen:
            if c >= n: break
            ff.stdin.write(fr.tobytes()); akhir = fr; c += 1
        while c < n: ff.stdin.write(akhir.tobytes()); c += 1
        print("selesai", it[0], round(m, 1), flush=True)
    ff.stdin.close(); ff.wait()
    # audio
    inp = []; fc = ""
    for j, (i, x) in enumerate(SUARA):
        inp += ["-i", f"{D}/suara/{i}.mp3"]; fc += f"[{j}]adelay={int(x * 1000)}:all=1[a{j}];"
    fc += "".join(f"[a{j}]" for j in range(len(SUARA))) + f"amix=inputs={len(SUARA)}:normalize=0:duration=longest,apad=whole_dur={TOTAL:.3f},loudnorm=I=-16:TP=-1.5:LRA=11[a]"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y"] + inp + ["-filter_complex", fc, "-map", "[a]", "-ar", "48000", "-c:a", "aac", "-b:a", "160k", D + "/out/_audio.m4a"], check=True)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", D + "/out/_video.mp4", "-i", D + "/out/_audio.m4a", "-c", "copy", "-shortest", "-movflags", "+faststart", out], check=True)
    tulis_srt(out[:-4] + ".srt"); json.dump({"suara": SUARA, "item": [[it[0], it[1], it[2], m] for it, m in zip(ITEM, MULAI)], "total": TOTAL}, open(D + "/out/waktu.json", "w"), indent=1)
    print("jadi", out, round(TOTAL, 1))

if __name__ == "__main__":
    main()
