"""Rakit Bab 3-5 L01 dari tangkapan layar Lean sungguhan (rek/log.json) + waktu kata narasi (timeline.json).
  python3 rakit.py --rencana       hitung jeda (hold) tiap beat agar ketikan selesai -> hold.json (lalu buat_script.py + voice.py)
  python3 rakit.py --cek [3 4 5]   lembar kontak per beat (tanpa kartu bab) -> video/pratinjau/rakitN_kontak_*.jpg
  python3 rakit.py --frame 250.5   satu frame pada detik mutlak -> video/pratinjau/f_250.5.png
  python3 rakit.py 3 4 5           render 1080p30 -> video/hd/babN.mp4 (butuh kerangka Manim video/hd/shellN.mp4)
Tiap ketukan = satu tangkapan layar; waktunya ditentukan di SPEC lewat potongan kalimat narasi, jadi rekaman tidak perlu diulang."""
import json, os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

D = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(D + "/timeline.json")); LOG = json.load(open(D + "/rek/log.json"))["keadaan"]
W, H, FPS, OY = 1920, 1080, 30, 90
FI = "/usr/share/fonts/opentype/inter/Inter-"; FM = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono"
F = lambda n, s: ImageFont.truetype(FI + n + ".otf", s)
M = lambda s, b=False: ImageFont.truetype(FM + ("-Bold" if b else "") + ".ttf", s)
KUNING = (242, 201, 76); GELAP = (14, 17, 23); PUTIH = (242, 244, 248); ABU = (140, 150, 168)
GITHUB = "github.com/listyantidewi1/animasi-informatika/blob/main/bahan-tutorial/lean/pertama.lean"
ALAMAT = "live.lean-lang.org"

# ---------- spec ----------
def K(step, at=None, dt=0.2, tenang=0.7): return dict(k="K", step=step, at=at, dt=dt, tenang=tenang)
def P(step, at=None): return dict(k="P", step=step, at=at)
def T(teks, at=0.2, dur=2.2): return dict(k="T", teks=teks, at=at, dur=dur)
def Hl(apa, at, end=None, tunggu=False, label=None): return dict(k="H", apa=apa, at=at, end=end, tunggu=tunggu, label=label)
def B(baris, at, end=None, besar=False, tunggu=False): return dict(k="B", baris=baris, at=at, end=end, besar=besar, tunggu=tunggu)

KIRI = ("rect", 8, 172, 1304, 1072); KANAN = ("rect", 1346, 172, 1912, 1072)
SPEC = {
 "b3_1": [dict(k="A", at="ketik alamat", dt=0.2), P("awal"), B([("m", ALAMAT)], "ketik alamat", besar=True)],
 "b3_2": [Hl(KIRI, "Bagian kiri", "dan bagian kanan", label="tempat kamu mengetik"), Hl(KANAN, "dan bagian kanan", label="tempat Lean menjawab"), P("klik", ("Lean menjawab", 0.9))],
 "b3_3": [B([("n", "Semua kode di video ini bisa disalin dari:"), ("k", GITHUB)], 0.3, "Ketik tagar"), K("eval1", "Ketik tagar", 0.24)],
 "b3_4": [Hl(("info", "4"), "Lean langsung menjawab")],
 "b3_5": [T("Enter dua kali, supaya ada satu baris kosong", 0.2, 2.6), P("nl1", 0.4), K("def1", "Ketik def", 0.22, 0), K("def2", "yaitu lipatDua", 0.2, 0), K("def3", "tulis n titik", 0.25, 0),
          K("def4", "tulis titik dua Nat", 0.25, 0), K("def5", "tulis titik dua sama", 0.25)],
 "b3_6": [T("Enter", 0.2, 1.6), P("nl2", 0.4), K("eval2", "ketik tagar", 0.2), Hl(("info", "42"), "Lean menjawab", "Sampai di sini", tunggu=True)],
 "b3_7": [T("Enter dua kali", "Kita akan menulis", 2.2), P("nl3", "Kita akan menulis"), K("thm1", "Ketik kata", 0.2, 0), K("thm2", "dua garis bawah", 0.2, 0), K("thm3", "tulis pernyataannya", 0.25),
          B([("n", "Pesan merah di kanan itu wajar,"), ("n", "karena buktinya belum kita tulis.")], ("empat.", 1.2), tunggu=True)],
 "b3_8": [K("thm4", "Ketik titik dua", 0.28, 0), K("thm5", "lalu r f", 0.32)],
 "b3_9": [Hl(("baris", 6), "Tidak ada garis merah", "dan tidak ada pesan"), Hl(KANAN, "dan tidak ada pesan", "Di Lean")],
 "b3_10": [T("Klik di kanan angka 4, tekan Backspace, lalu ketik 5", "Ganti angka", 5.5), P("kur4", "Ganti angka"), P("hps4", ("empat menjadi", 0.3)), K("lima", ("menjadi lima", 0.2), 0.3, 1.0)],
 "b3_11": [Hl(("baris", 6), "Baris itu", "Di sebelah kanan"), Hl(("blok", "Not a definitional", "5"), "Di sebelah kanan", "Lean tidak mau")],
 "b3_12": [T("Backspace, lalu ketik 4", 0.3, 3.2), P("hps5", ("Kembalikan", 0.5)), K("empat", ("menjadi empat", 0.1), 0.3, 0.9)],
 "b4_1": [T("Tekan End, lalu Enter dua kali", "Lean membantu", 2.6), P("ujung", "Lean membantu"), P("nl4")],
 "b4_2": [B([("n", "Kalau p dan q benar, maka q dan p juga benar."), ("m", "p ∧ q → q ∧ p")], "kalau p dan q", besar=True)],
 "b4_3": [K("tk1", "Ketik theorem", 0.2, 0), K("tk2", "tulis p q", 0.25, 0), K("tk3", "Setelah titik dua", 0.3, 0)],
 "b4_4": [B([("m", "\\and  lalu spasi   menjadi   ∧"), ("m", "\\to   lalu spasi   menjadi   →")], 0.3), K("tk4", "garis miring terbalik lalu kata and", 0.42, 0), K("tk5", None, 0.35, 0),
          K("tk6", ("Simbol panah", 0.9), 0.42, 0), K("tk7", "Editor akan", 0.36)],
 "b4_5": [K("by", "ketik titik dua", 0.3, 0), T("Enter, lalu dua spasi", "Tekan Enter", 6.0), P("ent1", "Tekan Enter"), K("sp1", "lalu letakkan", 0.45),
          B([("n", "Baris bukti harus menjorok."), ("n", "Awali baris baru dengan dua spasi.")], "lalu letakkan")],
 "b4_6": [Hl(("irow", "⊢"), "Lean menampilkan", "Bagian ini disebut"), Hl(("satu", "⊢"), "tanda yang mirip", label="goal")],
 "b4_7": [K("intro", "ketik intro", 0.28)],
 "b4_8": [Hl(("irow", "h"), "kita memiliki h", "dan yang tersisa"), Hl(("irow", "⊢"), "dan yang tersisa")],
 "b4_9": [T("Enter", 0.2, 1.6), P("ent2", 0.4), K("cons", "ketik constructor", 0.2), Hl(("irow", "⊢"), "memecah satu tugas", tunggu=True)],
 "b4_10": [T("Enter", 0.2, 1.6), P("ent3", 0.4), K("ex1a", "ketik titik tengah", 0.42, 0), K("ex1", "lalu exact", 0.22),
           B([("m", "\\.  lalu spasi   menjadi   ·"), ("n", "Titik tengah menandai satu tugas.")], "ketik titik tengah", "Kita mengambil")],
 "b4_11": [T("Enter, lalu Backspace sampai sejajar dengan titik tengah di atasnya", 0.2, 3.4), P("ent4", 0.4), P("bs4", 1.5), K("ex2a", "ketik titik tengah", 0.42, 0), K("ex2", "lalu exact", 0.22)],
 "b4_12": [Hl(("irow", "No goals"), "bertuliskan")],
 "b4_13": [Hl(("baris", 9, 2, 7), "seperti intro", "memilih taktik"), Hl(("baris", 10, 2, 13), "constructor, dan", "memilih taktik"), Hl(("baris", 11, 4, 9), "dan exact", "memilih taktik")],
 "b4_14": [T("Enter dua kali", 0.2, 2.0), P("nl5", 0.4), K("tt", "Kita buktikan", 0.15)],
 "b4_15": [T("Enter, lalu dua spasi", 0.2, 3.0), P("ent5", 0.4), K("sp2", None, 0.4, 0),
           B([("n", "Sudah ada di perpustakaan Lean:"), ("m", "Nat.add_comm (n m : Nat) : n + m = m + n")], "teorema ini sudah ada", "Perintah r w"), K("rw", "Ketik r w", 0.25)],
 "b4_16": [Hl(("irow", "No goals"), "goal kembali kosong", "Beginilah")],
 "b5_1": [B([("n", "Bisakah kita membohongi Lean?")], "Bisakah kita", besar=True)],
 "b5_2": [T("Enter dua kali", 0.2, 2.0), P("nl6", 0.4), K("ms", "Kata ini berarti", 0.17, 0), T("Enter, lalu dua spasi", None, 2.6), P("ent6"), K("sp3", None, 0.4, 0), K("sorry", "untuk pernyataan", 0.36)],
 "b5_3": [Hl(("baris2", 17, 18), "Tidak ada garis merah")],
 "b5_4": [T("Panah atas: pindahkan kursor ke baris theorem", "Lean memberi garis", 3.2), P("atas", "Lean memberi garis"), dict(k="S", step="atas$", jeda=0.6), Hl(("irow~", "declaration uses"), "menulis peringatan", tunggu=True)],
 "b5_5": [T("Ctrl + End, lalu Enter dua kali", 0.2, 2.6), P("bawah", 0.4), P("nl7"), K("pa1", "Ketik tagar", 0.2), Hl(("irow~", "depends on axioms"), "Lean menjawab bahwa teorema ini", "Kalau kamu", tunggu=True),
          T("Enter", "Kalau kamu", 1.6), P("nl8", "Kalau kamu"), K("pa2", None, 0.2), Hl(("irow~", "does not depend"), "tidak bergantung", tunggu=True)],
}
# Pita KETIK: teks mentah yang diketik + langkah rekaman yang membentuknya.
PITA = [("#eval 2 + 2", ["eval1"]), ("def lipatDua (n : Nat) : Nat := n * 2", ["def1", "def2", "def3", "def4", "def5"]), ("#eval lipatDua 21", ["eval2"]),
        ("theorem dua_tambah_dua : 2 + 2 = 4 := rfl", ["thm1", "thm2", "thm3", "thm4", "thm5"]),
        ("theorem tukar (p q : Prop) : p \\and q \\to q \\and p := by", ["tk1", "tk2", "tk3", "tk4", "tk5", "tk6", "tk7", "by"]),
        ("intro h", ["intro"]), ("constructor", ["cons"]), ("\\. exact h.right", ["ex1a", "ex1"]), ("\\. exact h.left", ["ex2a", "ex2"]),
        ("theorem tambah_tukar (a b : Nat) : a + b = b + a := by", ["tt"]), ("rw [Nat.add_comm]", ["rw"]),
        ("theorem mustahil : 2 + 2 = 5 := by", ["ms"]), ("sorry", ["sorry"]), ("#print axioms mustahil", ["pa1"]), ("#print axioms tukar", ["pa2"])]
REKAM = [3, 4, 5]; AKHIR5 = "b5_6"  # bab 5: mulai b5_6 memakai Manim

# ---------- waktu ----------
norm = lambda s: re.sub(r"[^\w]", "", s.lower())
def cari(b, frasa, tepi=0):
    toks = [norm(w[0]) for w in b["words"]]; f = [norm(x) for x in frasa.split()]; f = [x for x in f if x]
    for i in range(len(toks) - len(f) + 1):
        if toks[i:i + len(f)] == f: return b["words"][i][1] if not tepi else b["words"][i + len(f) - 1][2]
    raise ValueError(f"{b['id']}: '{frasa}' tidak ada")
def waktu(b, at):
    if isinstance(at, (int, float)): return float(at)
    if isinstance(at, tuple): return cari(b, at[0], 1 if at[1] > 0 else 0) + at[1]
    return cari(b, at)

IDX = {}
for i, s in enumerate(LOG): IDX.setdefault(s["id"].split("#")[0], []).append(i)

def susun():
    """-> keadaan [(t, idx)], pita [(teks, [t ketuk...], t_akhir)], tekan [(t0,t1,teks)], sorot [(t0,t1,ev)], kotak, alamat (t0, dt), butuh {beat: detik relatif}"""
    st, tekan, sorot, kotak, butuh, tk, alamat = [], [], [], [], {}, {}, None
    for b in TL["beats"]:
        if b["id"] not in SPEC: continue
        t0 = b["start"]; ujung = 0.0; akhir_beat = t0 + b["dur"] - 0.12
        for e in SPEC[b["id"]]:
            a = None if e.get("at") is None else waktu(b, e["at"])
            if e["k"] in "KPA": a = ujung + 0.45 if a is None else max(a, ujung + 0.3)
            if e["k"] == "A":
                alamat = (t0 + a, e["dt"]); ujung = a + len(ALAMAT) * e["dt"] + 0.4
            elif e["k"] == "K":
                ids = IDX[e["step"]]; tk[e["step"]] = [t0 + a + i * e["dt"] for i in range(len(ids))]
                st += list(zip(tk[e["step"]], ids)); ujung = a + (len(ids) - 1) * e["dt"]
                if e["step"] + "$" in IDX and e["tenang"]:
                    ujung += e["tenang"]; st.append((t0 + ujung, IDX[e["step"] + "$"][0])); ujung += 0.8
            elif e["k"] == "P":
                for i, ix in enumerate(IDX[e["step"]]): st.append((t0 + a + i * 0.3, ix))
                ujung = a + 0.3 * (len(IDX[e["step"]]) - 1) + 0.25
            elif e["k"] == "S":
                ujung += e["jeda"]; st.append((t0 + ujung, IDX[e["step"]][0])); ujung += 0.5
            elif e["k"] == "T":
                a = ujung + 0.3 if a is None else a; tekan.append((t0 + a, t0 + a + e["dur"], e["teks"])); ujung = max(ujung, a + 1.2)
            else:
                if e["tunggu"]: a = max(a, ujung + 0.15)
                z = e["end"]; z = akhir_beat if z is None else t0 + waktu(b, z)
                if z < t0 + a + 1.2: z = t0 + a + 1.6; ujung = max(ujung, z - t0)
                (sorot if e["k"] == "H" else kotak).append((t0 + a, z, e));
                if e["tunggu"]: ujung = max(ujung, a + 1.6)
        butuh[b["id"]] = ujung
    st.sort(key=lambda x: x[0])
    pita = []
    for teks, steps in PITA:
        ts = sum([tk[s] for s in steps], []); assert len(ts) == len(teks), (teks, len(ts), len(teks))
        # tampil hanya saat sedang diketik: pecah menjadi rentang bila ada jeda panjang
        pita.append((teks, ts))
    return st, pita, tekan, sorot, kotak, alamat, butuh

# ---------- gambar ----------
_cache = {}
def shot(ix):
    if ix not in _cache:
        if len(_cache) > 40: _cache.clear()
        _cache[ix] = Image.open(f"{D}/rek/{LOG[ix]['png']}").convert("RGB")
    return _cache[ix]

def krom(alamat_teks, kosong, label):
    im = Image.new("RGB", (W, OY), (222, 225, 230)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((12, 6, 300, 60), 12, fill=(255, 255, 255)); d.ellipse((28, 15, 44, 31), fill=(70, 130, 220) if not kosong else (190, 195, 205))
    d.text((54, 11), "Lean 4 Web" if not kosong else "Tab baru", font=F("Medium", 19), fill=(50, 54, 62)); d.text((270, 9), "×", font=F("Regular", 22), fill=(110, 115, 125))
    d.text((314, 7), "+", font=F("Regular", 24), fill=(90, 95, 105))
    d.rectangle((0, 40, W, OY), fill=(255, 255, 255)); d.line((0, OY - 1, W, OY - 1), fill=(210, 214, 220))
    for i, ch in enumerate("←→↻"): d.text((22 + i * 44, 49), ch, font=M(24), fill=(95, 100, 110) if i != 1 else (185, 190, 198))
    d.rounded_rectangle((160, 46, 640 if label else 1500, 84), 19, fill=(241, 243, 244))
    if alamat_teks: d.text((184, 51), alamat_teks, font=F("Regular", 22), fill=(32, 34, 40))
    else: d.text((184, 51), "Telusuri atau ketik alamat web", font=F("Regular", 22), fill=(150, 155, 165))
    if alamat_teks is not None and kosong:
        x = 184 + d.textlength(alamat_teks, font=F("Regular", 22)); d.line((x + 2, 51, x + 2, 79), fill=(32, 34, 40), width=2)
    if label:
        f = F("SemiBold", 21); t1 = "Kode: "; wt = d.textlength(t1 + GITHUB, font=f); x0 = W - wt - 30
        d.rounded_rectangle((x0 - 16, 46, W - 12, 84), 10, fill=GELAP); d.text((x0, 52), t1, font=f, fill=PUTIH); d.text((x0 + d.textlength(t1, font=f), 52), GITHUB, font=f, fill=KUNING)
    return im

def kotak_info(s, apa):
    """-> daftar kotak [x0,y0,x1,y1] koordinat frame."""
    info = s.get("info") or []; atas = next((j for j, e in enumerate(info) if e[0] in ("Expected type", "Messages", "All Messages")), len(info)); baris = s["baris"]; col0 = 64 if len(baris) < 10 else 82; cw = 16.8
    def gab(es): return [min(e[1] for e in es), min(e[2] for e in es) + OY, max(e[1] + e[3] for e in es), max(e[2] + e[4] for e in es) + OY]
    def sebaris(e): return [x for x in info if abs(x[2] - e[2]) < 8]
    k = apa[0]
    if k == "rect": return [list(apa[1:])]
    if k in ("baris", "baris2"):
        n0 = apa[1]; n1 = apa[2] if k == "baris2" else n0; out = []
        if k == "baris" and len(apa) > 2: c0, c1 = apa[2], apa[3]
        else: c0, c1 = 0, max(len(baris[n - 1][0]) for n in range(n0, n1 + 1))
        return [[col0 + c0 * cw, baris[n0 - 1][1] + OY, col0 + c1 * cw, baris[n1 - 1][1] + 38 + OY]]
    if k == "info": return [gab(sebaris(next(e for e in info if e[0] == apa[1] and e[2] > 240)))]
    if k == "satu": return [gab([next(e for e in info if e[0] == apa[1])])]
    if k == "irow": return [gab(sebaris(e)) for e in info[:atas] if e[0] == apa[1]]
    if k == "irow~": return [gab(sebaris(next(e for e in info if apa[1] in e[0])))]
    if k == "blok":
        i = next(j for j, e in enumerate(info) if apa[1] in e[0]); j = next(j for j in range(i + 1, len(info)) if info[j][0] == apa[2])
        return [gab(info[i:j + 1])]

def teks_pita(d, x, y, teks, n, f):
    """Gambar teks mentah; n huruf pertama terang. Spasi setelah singkatan \\x diberi tanda ␣."""
    khusus = {m.end() - 1 for m in re.finditer(r"\\[a-z.]+ ", teks)}
    for i, ch in enumerate(teks):
        c = PUTIH if i < n else (108, 118, 136)
        if i in khusus: ch, c = "␣", (KUNING if i < n else (150, 130, 60))
        d.text((x, y), ch, font=f, fill=c); x += d.textlength("M", font=f)
    return x

def gambar(t, S, tanpa_overlay=False):
    st, pita, tekan, sorot, kotak, alamat, _ = S
    ix = -1
    for tt, i in st:
        if tt <= t: ix = i
        else: break
    kosong = ix < 0
    at = None
    if alamat and t >= alamat[0] - 0.4: at = ALAMAT[:max(0, min(len(ALAMAT), int((t - alamat[0]) / alamat[1]) + 1 if t >= alamat[0] else 0))]
    if not kosong: at = ALAMAT
    lab = t >= B_ID["b3_3"]["start"]
    # tanda tangan frame (untuk memakai ulang frame yang sama)
    pt = None
    for teks, ts in pita:
        n = sum(1 for x in ts if x <= t)
        if n and t <= ts[-1] + 1.6:
            # sembunyikan di jeda panjang antarbagian (lebih dari 4 dtk tanpa ketukan)
            terakhir = max(x for x in ts if x <= t); berikut = min([x for x in ts if x > t], default=None)
            if t - terakhir < 1.6 or (berikut is not None and berikut - terakhir < 60): pt = (teks, n)
    tk = next((x[2] for x in tekan if x[0] <= t <= x[1]), None)
    if pt and tk: tk = None if t - max(x for x in next(ts for te, ts in pita if te == pt[0]) if x <= t) < 1.0 else tk
    if tk: pt = None
    hs = [(a, z, e) for a, z, e in sorot if a <= t <= z]; ks = [(a, z, e) for a, z, e in kotak if a <= t <= z]
    al = lambda a, z: round(min(1, (t - a) / 0.25, (z - t) / 0.25 + 0.05), 1)
    sig = (ix, at, lab, pt, tk, tuple((id(e), al(a, z)) for a, z, e in hs + ks))
    if tanpa_overlay is None: return sig
    im = Image.new("RGB", (W, H), (255, 255, 255)); im.paste(krom(at, kosong, lab), (0, 0))
    if not kosong: im.paste(shot(ix), (0, OY))
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov); s = LOG[max(ix, 0)]
    for a, z, e in hs:
        A = int(255 * al(a, z))
        for x0, y0, x1, y1 in kotak_info(s, e["apa"]):
            p = 4 if e["apa"][0] == "rect" else 9
            d.rounded_rectangle((x0 - p, y0 - p, x1 + p, y1 + p), 10, fill=KUNING + (int(A * 0.13),), outline=(235, 150, 20, A), width=5)
            if e["label"]:
                f = F("Bold", 30); wl = d.textlength(e["label"], font=f)
                if e["apa"][0] == "rect": lx, ly = (x0 + x1) / 2 - wl / 2 - 18, y1 - 150
                else: lx, ly = x0 - 12, y1 + 22
                d.rounded_rectangle((lx, ly, lx + wl + 36, ly + 56), 12, fill=GELAP + (A,)); d.text((lx + 18, ly + 9), e["label"], font=f, fill=KUNING + (A,))
    for a, z, e in ks:
        A = int(255 * al(a, z)); big = e["besar"]; fs = 46 if big else 30
        fn = lambda g: (M(fs, True) if g == "m" else M(22, True) if g == "k" else F("SemiBold", fs))
        ws = [d.textlength(tx, font=fn(g)) for g, tx in e["baris"]]; lh = int(fs * 1.5); bw = max(ws) + 90; bh = lh * len(ws) + 44
        x0 = (1310 - bw) / 2 if big else 60; y1 = 940; y0 = y1 - bh
        if big and kosong: y0, y1 = 420, 420 + bh; x0 = (W - bw) / 2
        d.rounded_rectangle((x0, y0, x0 + bw, y1), 16, fill=GELAP + (int(A * 0.96),)); d.rounded_rectangle((x0, y0, x0 + 12, y1), 6, fill=KUNING + (A,))
        for i, (g, tx) in enumerate(e["baris"]):
            d.text((x0 + 48 if not big else x0 + (bw - ws[i]) / 2, y0 + 22 + i * lh), tx, font=fn(g), fill=(PUTIH if g == "n" else KUNING) + (A,))
    if pt or tk:
        d.rounded_rectangle((30, 972, 1290, 1070), 16, fill=GELAP + (245,))
        lb = "KETIK" if pt else "TEKAN"; f = F("Bold", 26); wl = d.textlength(lb, font=f)
        d.rounded_rectangle((48, 996, 48 + wl + 32, 1046), 10, fill=KUNING if pt else (86, 204, 242)); d.text((64, 1004), lb, font=f, fill=GELAP)
        if pt: teks_pita(d, 48 + wl + 56, 1001, pt[0], pt[1], M(30))
        else: d.text((48 + wl + 56, 1001), tk, font=F("SemiBold", 30), fill=PUTIH)
    return Image.alpha_composite(im.convert("RGBA"), ov).convert("RGB")

B_ID = {b["id"]: b for b in TL["beats"]}
def seg_info(seg):
    bs = [b for b in TL["beats"] if b["seg"] == seg]; t0 = bs[0]["start"]; total = bs[-1]["start"] + bs[-1]["dur"] - t0
    akhir_ucap = bs[-1]["start"] - t0 + bs[-1]["words"][-1][2]
    keluar = min(akhir_ucap + 2.8, total - 1.5) if seg != 5 else B_ID[AKHIR5]["start"] + cari(B_ID[AKHIR5], "pertanyaan pertama") - t0 - 0.7
    return bs, t0, total, keluar

def render(seg, S):
    bs, t0, total, keluar = seg_info(seg); n = round(total * FPS); hd = D + "/video/hd"
    src = subprocess.Popen(["ffmpeg", "-v", "error", "-i", f"{hd}/shell{seg}.mp4", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    out = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
                            "-pix_fmt", "yuv420p", f"{hd}/bab{seg}.mp4"], stdin=subprocess.PIPE)
    nb = W * H * 3; sh = None; lsig = None; rec = None
    for f in range(n):
        tr = f / FPS; raw = src.stdout.read(nb)
        if len(raw) == nb: sh = raw
        a = max(0.0, min(1.0, (tr - 0.6) / 0.5)) * (1 - max(0.0, min(1.0, (tr - keluar) / 0.45)))
        if a <= 0: out.stdin.write(sh); continue
        sig = gambar(t0 + tr, S, None)
        if sig != lsig: rec = np.asarray(gambar(t0 + tr, S)); lsig = sig
        if a >= 1: out.stdin.write(rec.tobytes())
        else: out.stdin.write((rec * a + np.frombuffer(sh, np.uint8).reshape(H, W, 3) * (1 - a)).astype(np.uint8).tobytes())
        if f % 1500 == 0: print(f"  bab{seg} {f}/{n}", flush=True)
    out.stdin.close(); out.wait(); src.kill(); print(f"{hd}/bab{seg}.mp4", flush=True)

def kontak(seg, S):
    bs, t0, total, keluar = seg_info(seg); pr = D + "/video/pratinjau"; os.makedirs(pr, exist_ok=True); cells = []
    for b in bs:
        if b["id"] not in SPEC: continue
        for nm, t in (("tengah", b["speech"] + b["audio"] * 0.55), ("akhir", b["start"] + b["dur"] - 0.3)):
            im = gambar(t, S).resize((640, 360), Image.LANCZOS); d = ImageDraw.Draw(im); d.rectangle((0, 0, 190, 26), fill=(0, 0, 0)); d.text((6, 3), f"{b['id']} {nm}", font=F("Medium", 17), fill=(255, 255, 255)); cells.append(im)
    for p in range(0, len(cells), 12):
        part = cells[p:p + 12]; sheet = Image.new("RGB", (640 * 3, 360 * ((len(part) + 2) // 3)))
        for i, c in enumerate(part): sheet.paste(c, ((i % 3) * 640, (i // 3) * 360))
        fn = f"{pr}/rakit{seg}_kontak_{p // 12}.jpg"; sheet.save(fn, quality=82); print(fn)

if __name__ == "__main__":
    S = susun(); arg = sys.argv[1:]
    if "--rencana" in arg:
        hold = {}; seg_akhir = {}
        for b in TL["beats"]: seg_akhir[b["seg"]] = b["id"]
        for bid, u in S[6].items():
            b = B_ID[bid]; akhir = b["seg"] in REKAM and seg_akhir[b["seg"]] == bid
            perlu = u + 0.9 - (0.4 + b["audio"]) - 0.3; dasar = 6.3 if akhir else (1.3 if any(e["k"] == "K" for e in SPEC[bid]) else 0.6)
            h = round(max(dasar, perlu + (5.7 if akhir else 0)), 2)
            if h != (6.3 if akhir else 0.6): hold[bid] = h
            print(f"{bid}: narasi {b['audio']:.1f}  ketikan selesai {u:.1f}  hold {h}")
        json.dump(hold, open(D + "/hold.json", "w"), indent=1); print("hold.json:", hold)
    elif "--cek" in arg:
        for s in [int(a) for a in arg if a.isdigit()] or REKAM: kontak(s, S)
    elif "--frame" in arg:
        for a in arg[1:]: gambar(float(a), S).save(f"{D}/video/pratinjau/f_{a}.png"); print("f_" + a)
    else:
        for a in arg: render(int(a), S)
