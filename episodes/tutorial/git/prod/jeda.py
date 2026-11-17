"""Deteksi momen penting di rekaman mentah dari profil perubahan piksel (cek/beda.py) untuk jeda baca otomatis.
Aktivitas dipecah menjadi 'episode' yang dipisahkan ketenangan >= 0,5 detik.
- 'ketik': deretan ketikan terakhir dalam satu episode, lalu Enter (perubahan besar) -> jeda sebelum Enter supaya seluruh perintah terbaca
- 'hasil': akhir episode (layar sudah tenang) -> jeda supaya hasilnya / teks yang baru selesai diketik terbaca
"""
import numpy as np, functools
FPS = 30; SEL = 40
KETIK, BESAR, TENANG = 180, 1300, 27
@functools.lru_cache(None)
def profil(src): return np.load(f"/home/user/git-seri/cek/{src}_beda.npy")
def deret(src, crop):
    x, y, w, h = crop; d = profil(src)
    return d[:, y // SEL:(y + h + SEL - 1) // SEL, x // SEL:(x + w + SEL - 1) // SEL].sum(axis=(1, 2)).astype(np.int64)
def peristiwa(src, crop, a, b):
    s = deret(src, crop); i0, i1 = int(a * FPS), min(len(s) - 1, int(b * FPS)); out = []
    akt = [i for i in range(i0, i1) if s[i] > KETIK]
    eps = []
    for i in akt:
        if eps and i - eps[-1][-1] <= TENANG: eps[-1].append(i)
        else: eps.append([i])
    for e in eps:
        tot = int(s[e].sum()); ket = [i for i in e if s[i] <= BESAR]; bes = [i for i in e if s[i] > BESAR]
        if len(e) < 3 and tot < 2000: continue  # kedip kecil
        if len([i for i in e if s[i] <= BESAR]) < 4 and tot < 15000: continue  # perubahan kecil tanpa ketikan (popup, graf)
        if bes and ket:
            # ketikan sebelum perubahan besar pertama sesudahnya
            lb = bes[-1]; kk = [i for i in ket if i < lb]
            if len(kk) >= 4:
                t = kk[-1] + 1; n = len(kk) / 1.3
                out.append((t / FPS, round(min(2.2, max(0.8, 0.5 + n / 20)), 2), "ketik"))
        selesai = e[-1] + 2
        if not bes: dh = min(2.2, max(1.0, 0.5 + len(ket) / 1.3 / 20))
        else: dh = min(3.0, max(1.2, 0.9 + tot / 12000))
        out.append((selesai / FPS, round(dh, 2), "hasil"))
    out = [x for x in out if a + 0.15 < x[0] < b - 0.15]
    # gabung jeda yang berdekatan (< 0,8 detik mentah): pakai yang terakhir, durasi terbesar
    g = []
    for x in out:
        if g and x[0] - g[-1][0] < 1.5: g[-1] = (x[0], max(x[1], g[-1][1]), x[2])
        else: g.append(x)
    return g
