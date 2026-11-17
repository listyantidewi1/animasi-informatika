"""Rakit video Vibe Coding Patungan dari rencana.py.
python3 rakit.py suara [V05 ...]     -> buat MP3 Cahaya yang belum ada
python3 rakit.py bab V05 [--cek]      -> rakit satu bab (mp4 + srt bagian), --cek: hanya cetak rencana waktu
python3 rakit.py gabung               -> gabung semua bab + srt + chapter
"""
import copy
import json, os, sys, re, subprocess, urllib.request, time, shutil
import numpy as np
sys.path.insert(0, "/home/user/vibe/_alat"); sys.path.insert(0, "/home/user/vibe/prod")
from PIL import Image, ImageDraw, ImageFont
import rencana as RC
ROOT = "/home/user/vibe/prod"; RAW = "/home/user/vibe/raw"; FPS = 30; LEAD, TAIL = 0.4, 1.3
FB = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"; FS = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
VID = "iWydkXKoiVtvdn4vLKp9"; MODEL = "eleven_v4"
CROP = {"full": (0, 0, 2560, 1440), "termU": (1300, 40, 1260, 709), "termK": (1300, 30, 1040, 585), "termM": (1300, 330, 1260, 709), "termD": (1300, 700, 1260, 709),
        "edit": (400, 40, 1440, 810), "dt": (1040, 140, 1520, 855),
        "nMenu": (0, 0, 1600, 900), "nDialog": (640, 0, 1280, 720), "nSide": (0, 0, 1280, 720), "nToolbar": (0, 0, 1680, 945)}
def sh(*a): subprocess.run(a, check=True)
def dur(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
def bab(kode): return next(b for b in RC.BAB if b["kode"] == kode)

# ---------------- suara
def tts_teks(t):
    t = t.replace("SPEK.md", "spek titik em de").replace("CLAUDE.md", "klod titik em de").replace("AGENTS.md", "agents titik em de")
    t = re.sub(r"\b([a-z]+)\.(js|json|css|html)\b", lambda m: m.group(1) + " titik " + {"js": "je es", "json": "jeson", "css": "ce es es", "html": "ha te em el"}[m.group(2)], t)
    for a, b in [("localStorage", "local storage"), ("innerHTML", "inner HTML"), ("textContent", "text content"), ("bagiKeAtas", "bagi ke atas"), ("DevTools", "Dev Tools"), ("F12", "ef dua belas"), ("alamat https", "alamat ha te te pe es"), ("Wi-Fi", "wai fai")]:
        t = t.replace(a, b)
    t = t.replace("wa.me", "wa titik mi").replace("npm run", "en pe em ran").replace("npm install", "en pe em install").replace("git diff", "git dif")
    return t
import hashlib
def mp3(kode, t): return f"{ROOT}/{kode}/suara/h_{hashlib.md5(tts_teks(t).encode()).hexdigest()[:12]}.mp3"
def suara(kodes):
    for kode in kodes:
        B = bab(kode)["beats"]; os.makedirs(f"{ROOT}/{kode}/suara", exist_ok=True)
        teks = [t for t, _ in B]
        for i, t in enumerate(teks):
            out = mp3(kode, t)
            if not t or os.path.exists(out): continue
            body = {"text": tts_teks(t), "model_id": MODEL, "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.0, "speed": 1.0}}
            prev = [x for x in teks[:i] if x]; nxt = [x for x in teks[i + 1:] if x]
            if prev: body["previous_text"] = tts_teks(prev[-1])
            if nxt: body["next_text"] = tts_teks(nxt[0])
            data = None
            for k in range(5):
                try:
                    r = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VID}?output_format=mp3_44100_128",
                        data=json.dumps(body).encode(), headers={"xi-api-key": "dummy", "Content-Type": "application/json"})
                    data = urllib.request.urlopen(r, timeout=180).read(); break
                except Exception as e:
                    if getattr(e, "code", 0) == 400: body.pop("previous_text", None); body.pop("next_text", None)
                    print("ulang", kode, i, e, flush=True); time.sleep(4 * (k + 1))
            if data: open(out, "wb").write(data); print(kode, i, len(t), flush=True)

# ---------------- waktu tanda
_log = {}
def log(src):
    if src not in _log: _log[src] = json.load(open(f"{RAW}/{src}.json"))
    return _log[src]
def waktu(src, ref):
    if isinstance(ref, (int, float)): return float(ref)
    m = re.match(r"^([a-z_0-9]+)([+-][0-9.]+)?$", ref); n, d = m.group(1), float(m.group(2) or 0)
    L = log(src); T = {nm: t for t, nm in L["tanda"]}; T.setdefault("akhir", L.get("durasi", 0))
    return T[n] + d

# ---------------- gambar bantu
def pil_label(teks, out):
    f = ImageFont.truetype(FB, 40); w = int(f.getlength(teks)) + 84; h = 84
    im = Image.new("RGBA", (w + 16, h + 16), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([8, 8, w + 8, h + 8], 22, fill=(20, 24, 38, 235)); d.rounded_rectangle([8, 8, 22, h + 8], 7, fill=(255, 176, 32, 255))
    d.text((48, 8 + h / 2), teks, font=f, fill=(255, 255, 255, 255), anchor="lm"); im.save(out)
def bungkus(d, teks, f, maxw):
    baris, cur = [], ""
    for w in teks.split():
        t = (cur + " " + w).strip()
        if f.getlength(t) > maxw and cur: baris.append(cur); cur = w
        else: cur = t
    if cur: baris.append(cur)
    return baris
def latar_hp(cap, pw, ph, out):
    im = Image.new("RGB", (1920, 1080)); d = ImageDraw.Draw(im)
    for y in range(1080):
        k = y / 1080; d.line([(0, y), (1920, y)], fill=(int(18 + 9 * k), int(24 + 12 * k), int(41 + 23 * k)))
    for gx in range(40, 1920, 48):
        for gy in range(40, 1080, 48): d.point((gx, gy), fill=(40, 47, 70))
    cx = 1330; x0, y0 = cx - pw // 2, 40
    d.rounded_rectangle([x0 - 22, y0 - 22, x0 + pw + 22, y0 + ph + 22], 52, fill=(11, 15, 26), outline=(58, 69, 102), width=4)
    if cap:
        d.rounded_rectangle([140, 380, 300, 432], 26, fill=(255, 176, 32)); d.text((220, 406), "DI HP", font=ImageFont.truetype(FB, 26), fill=(20, 24, 38), anchor="mm")
        f = ImageFont.truetype(FB, 64); y = 480
        for b in bungkus(d, cap, f, 820): d.text((140, y), b, font=f, fill=(238, 242, 251)); y += 80
    im.save(out); return x0, y0


def _frame(src, t):
    r = subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", f"{t:.3f}", "-i", src, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                       capture_output=True, check=True).stdout
    return np.frombuffer(r, np.uint8).reshape(1440, 2560, 3)

def _garis(g, x0, x1, y0, y1):
    """baris-baris garis horizontal panjang (bingkai kotak input Claude Code) di daerah itu"""
    reg = g[y0:y1, x0 + 20:x1 - 20]; out = []
    for k, r in enumerate(reg):
        if r.mean() > 90 and (np.abs(r - r.mean()) < 8).mean() > 0.9: out.append(y0 + k)
    return out

def _tanpa_garis(e, L=110):
    """buang garis lurus panjang (scrollbar, pemisah panel, bingkai) dari peta tepi; teks tidak punya garis sepanjang itu"""
    e = e.copy()
    for ax in (0, 1):
        n = L if ax == 0 else 4 * L
        if e.shape[ax] <= n: continue
        c = np.cumsum(e, axis=ax, dtype=np.int32)
        c = np.concatenate([np.zeros((1, e.shape[1]) if ax == 0 else (e.shape[0], 1), np.int32), c], axis=ax)
        if ax == 0: win = c[n:] - c[:-n]
        else: win = c[:, n:] - c[:, :-n]
        lg = (win == n)
        # tandai seluruh jendela panjang
        m = np.zeros_like(e)
        idx = np.argwhere(lg)
        if len(idx):
            if ax == 0:
                for col in np.unique(idx[:, 1]):
                    rows = idx[idx[:, 1] == col, 0]
                    for r in rows: m[r:r + n, col] = True
            else:
                for row in np.unique(idx[:, 0]):
                    cols = idx[idx[:, 0] == row, 1]
                    for c0 in cols: m[row, c0:c0 + n] = True
        e &= ~m
    return e

_POP = {}
def popup_spans(src, a, b, fps=5):
    """selang waktu (absolut) saat popup VS Code (quick open, command palette, go to line) tampil"""
    key = (src, round(a, 2), round(b, 2))
    if key in _POP: return _POP[key]
    W, H = 960, 220
    r = subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", f"{RAW}/{src}.mkv",
                        "-vf", f"fps={fps},crop={W}:{H}:800:40", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
    fr = np.frombuffer(r, np.uint8).reshape(-1, H, W, 3).astype(np.int16)
    tgt = np.array([3, 56, 93]); sp = []
    for k, f in enumerate(fr):
        if (np.abs(f - tgt).max(2) < 14).sum() > 8000:
            t0, t1 = a + k / fps - 0.15, a + (k + 1) / fps + 0.15
            if sp and t0 <= sp[-1][1] + 0.3: sp[-1][1] = t1
            else: sp.append([t0, t1])
    _POP[key] = sp; return sp

def bersih(src, a, b):
    """potongan [a,b] tanpa popup: daftar (s,e) absolut, potongan < 0.3 s dibuang"""
    if src.startswith("H"): return [(a, b)]
    keep, cur = [], a
    for s0, e0 in popup_spans(src, a, b):
        if s0 > cur: keep.append((cur, min(s0, b)))
        cur = max(cur, e0)
    if cur < b: keep.append((cur, b))
    keep = [(x, y) for x, y in keep if y - x >= 0.3]
    return keep or [(a, b)]

_AC = {}
def autocrop(p):
    """Kotak potong yang memuat SEMUA teks di daerah panel (union beberapa frame), lalu dipas ke 1920x1080 dengan bingkai.
    Tidak pernah memotong teks di dalam panel dan tidak mengambil sebagian panel tetangga."""
    key = (p["src"], p["_a"], p["_b"], p["crop"], p.get("lab"))
    if key in _AC: return _AC[key]
    src = f"{RAW}/{p['src']}.mkv"; a, b = p["_a"], p["_b"]; c = p["crop"]
    lama = p["src"] in ("V02", "V03")
    if c.startswith("term"): roi = [1300, 45, 2330 if lama else 2540, 1403]
    elif c == "edit": roi = [440, 52, 1290, 1392]
    elif c == "editW": roi = [575, 56, 1975, 784]  # rekaman ulang: editor word wrap, panel di bawah
    elif c == "dt": roi = [1040, 100, 2560, 1430]
    else: return None
    n = int(min(12, max(4, (b - a) / 1.5)))
    kp = p.get("_keep") or [(a, b)]; Lk = sum(y - x for x, y in kp)
    def _abs(u):
        for x, y in kp:
            if u <= y - x: return x + u
            u -= y - x
        return kp[-1][1] - 0.05
    ts = [_abs(Lk * k / (n - 1)) for k in range(n)]; ts[-1] = max(kp[-1][0], kp[-1][1] - 0.05)
    F0 = None; CH = np.zeros((1440, 2560), bool)
    ketik = p.get("lab") == "Prompt"
    U = None; bgv = []; M = np.zeros((1440, 2560), bool)
    for k, t in enumerate(ts):
        f = _frame(src, t); g = f.astype(np.int16).mean(2)
        x0, y0, x1, y1 = roi
        if c == "edit":
            if F0 is not None: CH[y0:y1, x0:x1] |= np.abs(g[y0:y1, x0:x1] - F0[y0:y1, x0:x1]) > 40
            F0 = g
        if c.startswith("term") and not lama:
            # spanduk Claude Code (logo oranye) bukan isi: lewati sampai di bawah baris promosi
            o = (f[45:420, 1300:1460, 0] > 190) & (f[45:420, 1300:1460, 1] > 90) & (f[45:420, 1300:1460, 1] < 150) & (f[45:420, 1300:1460, 2] < 120)
            ys = np.where(o.sum(1) > 6)[0]
            if len(ys) and o.sum() > 1500: y0 = max(y0, 45 + int(ys.min()) + 228)
            gs = _garis(g, x0, x1, 1000, 1398)
            if len(gs) >= 2:
                atas = min(gs[-1], gs[-2]) if abs(gs[-1] - gs[-2]) > 20 else gs[0]
                tops = sorted(set(gs)); atas = tops[0] if len(tops) else atas
                # kumpulan garis: ambil garis paling atas dari pasangan bingkai terbawah
                grp = [tops[0]]
                for yy in tops[1:]:
                    if yy - grp[-1] > 3: grp.append(yy)
                atas = grp[-2] if len(grp) >= 2 else grp[-1]
                if ketik: y0 = max(y0, atas - 10)
                else: y1 = min(y1, atas - 4)
        R0 = roi
        full = g[R0[1]:R0[3], R0[0]:R0[2]]
        fe = (np.abs(np.diff(full, axis=1)) > 40)[:-1, :] | (np.abs(np.diff(full, axis=0)) > 40)[:, :-1]
        fe = _tanpa_garis(fe); fe = fe & (fe.sum(1) >= 3)[:, None] & (fe.sum(0) >= 3)[None, :]
        M[R0[1]:R0[1] + fe.shape[0], R0[0]:R0[0] + fe.shape[1]] |= fe
        reg = g[y0:y1, x0:x1]
        ed = (np.abs(np.diff(reg, axis=1)) > 40)[:-1, :] | (np.abs(np.diff(reg, axis=0)) > 40)[:, :-1]
        ed = _tanpa_garis(ed)
        # buang titik tepi yang menyendiri (ujung scrollbar, kursor berkedip jauh): baris/kolom harus punya >=3 titik
        rw = ed.sum(1) >= 3; cl = ed.sum(0) >= 3
        ed = ed & rw[:, None] & cl[None, :]
        yy, xx = np.where(ed)
        bgv.append(np.median(f[y0:y1, x0:x1].reshape(-1, 3), axis=0))
        if len(yy) < 30: continue
        bb = [x0 + xx.min(), y0 + yy.min(), x0 + xx.max(), y0 + yy.max()]
        U = bb if U is None else [min(U[0], bb[0]), min(U[1], bb[1]), max(U[2], bb[2]), max(U[3], bb[3])]
    x0, y0, x1, y1 = roi
    if U is None: U = [x0, y0, x0 + 400, y0 + 225]
    m = 26; U = [max(x0, U[0] - m), max(y0, U[1] - m), min(x1, U[2] + m), min(y1, U[3] + m)]
    if c == "edit":
        fk = p.get("fokus")
        if fk: U[1], U[3] = max(y0, fk[0]), min(y1, fk[1])
        else:
            CH = CH & M
            rows = np.where(CH[:, x0:x1].sum(1) >= 3)[0]
            if len(rows):
                need = (U[2] - U[0]) * 9 / 16
                r0, r1 = rows.min() - m, rows.max() + m
                if r1 - r0 < need: r0 = r1 - need  # tambah konteks di atas bagian yang berubah
                U[1], U[3] = int(max(U[1], y0, r0)), int(min(U[3], y1, max(r1, r0 + need)))
    if ketik and c.startswith("term"):
        U[0], U[2] = x0, x1  # baris prompt dan keluaran di atasnya selalu selebar terminal
    bw, bh = U[2] - U[0], U[3] - U[1]
    w = max(bw, bh * 16 / 9, 1100); h = w * 9 / 16
    w = min(w, x1 - x0); h = min(max(h, bh), y1 - y0)
    cx = (U[0] + U[2]) / 2; cy = (U[1] + U[3]) / 2
    X = min(max(cx - w / 2, x0), x1 - w); Y = min(max(cy - h / 2, y0), y1 - h)
    X, Y, w, h = int(X), int(Y), int(w), int(h)
    # tepi potongan harus jatuh di baris/kolom kosong (tidak ada teks terbelah); geser keluar, tetap di dalam panel
    for _ in range(120):
        if Y > y0 and M[Y, X:X + w].any(): Y -= 1; h += 1
        else: break
    for _ in range(120):
        if Y + h < y1 and M[Y + h - 1, X:X + w].any(): h += 1
        else: break
    for _ in range(120):
        if X > x0 and M[Y:Y + h, X].any(): X -= 1; w += 1
        else: break
    for _ in range(120):
        if X + w < x1 and M[Y:Y + h, X + w - 1].any(): w += 1
        else: break
    X, Y, w, h = X // 2 * 2, Y // 2 * 2, (w + 1) // 2 * 2, (h + 1) // 2 * 2
    s = min(1920 / w, 1080 / h, 1.75)
    bg = np.median(np.array(bgv), axis=0).astype(int)
    r = dict(x=X, y=Y, w=w, h=h, ow=int(w * s) // 2 * 2, oh=int(h * s) // 2 * 2, bg="0x%02x%02x%02x" % tuple(bg))
    _AC[key] = r; return r

# ---------------- sorotan baris (OCR tesseract untuk mencari letak baris)
_OCR = {}
def ocr_baris(src, t, roi):
    key = (src, round(t, 2), tuple(roi))
    if key in _OCR: return _OCR[key]
    x0, y0, x1, y1 = roi; f = _frame(f"{RAW}/{src}.mkv", t)[y0:y1, x0:x1]
    png = f"/tmp/ocr_in_{os.getpid()}.png"; Image.fromarray(f).resize(((x1 - x0) * 2, (y1 - y0) * 2)).save(png)
    tsv = subprocess.run(["tesseract", png, "-", "--psm", "4", "tsv"], capture_output=True, text=True, env=dict(os.environ, OMP_THREAD_LIMIT="1"), timeout=300).stdout.splitlines()
    L = {}
    for row in tsv[1:]:
        c = row.split("\t")
        if len(c) < 12 or not c[11].strip(): continue
        k = (int(c[2]), int(c[3]), int(c[4])); X, Y, W, H = (int(v) / 2 for v in c[6:10])
        bb = [x0 + X, y0 + Y, x0 + X + W, y0 + Y + H]
        if k in L: L[k]["t"] += " " + c[11]; b = L[k]["bb"]; L[k]["bb"] = [min(b[0], bb[0]), min(b[1], bb[1]), max(b[2], bb[2]), max(b[3], bb[3])]
        else: L[k] = {"t": c[11], "bb": bb}
    res = sorted(L.values(), key=lambda d: (d["bb"][1], d["bb"][0])); _OCR[key] = res; return res

def sorot_kotak(p, it):
    """it: {'teks': potongan teks baris pertama, 'baris': jumlah baris, 't': detik sumber (default akhir bagian)}"""
    if "kotak" in it: return it["kotak"]
    t = it.get("t", p["_keep"][-1][1] - 0.3)
    ac = autocrop(p); roi = [ac["x"], ac["y"], ac["x"] + ac["w"], ac["y"] + ac["h"]] if ac else list(CROP[p["crop"]][:2]) + [CROP[p["crop"]][0] + CROP[p["crop"]][2], CROP[p["crop"]][1] + CROP[p["crop"]][3]]
    L = ocr_baris(p["src"], t, roi); cari = it["teks"].lower().replace(" ", "")
    for i, d in enumerate(L):
        if cari in d["t"].lower().replace(" ", ""):
            grup = L[i:i + it.get("baris", 1)]
            bb = [min(g["bb"][0] for g in grup), min(g["bb"][1] for g in grup), max(g["bb"][2] for g in grup), max(g["bb"][3] for g in grup)]
            return [bb[0] - 10, bb[1] - 7, bb[2] + 10, bb[3] + 7]
    print("PERINGATAN sorot tidak ketemu:", p["src"], it["teks"], [d["t"][:40] for d in L][:40], flush=True); return None

def filter_sorot(p, ac):
    out = ""
    for it in p.get("sorot", []):
        k = sorot_kotak(p, it)
        if not k: continue
        if ac: sx = ac["ow"] / ac["w"]; ox = (1920 - ac["ow"]) / 2 - ac["x"] * sx; oy = (1080 - ac["oh"]) / 2 - ac["y"] * sx
        else: x, y, w, h = CROP[p["crop"]]; sx = 1920 / w; ox = -x * sx; oy = -y * sx
        X0, Y0, X1, Y1 = k[0] * sx + ox, k[1] * sx + oy, k[2] * sx + ox, k[3] * sx + oy
        X0, Y0 = max(4, X0), max(4, Y0); X1, Y1 = min(1916, X1), min(1076, Y1)
        a = it["_a"] if "_a" in it else it.get("dari", 0.0) * p["_d"]; b = it.get("_b", p["_d"] + 1)
        if it.get("saat") == "tahan": a = p["_L"] / p["_sp"]  # menyala saat prompt utuh dibekukan
        en = f":enable='between(t,{a:.2f},{b:.2f})'"
        out += (f",drawbox=x={X0:.0f}:y={Y0:.0f}:w={X1-X0:.0f}:h={Y1-Y0:.0f}:color=0xFFB020@0.16:t=fill{en}"
                f",drawbox=x={X0:.0f}:y={Y0:.0f}:w={X1-X0:.0f}:h={Y1-Y0:.0f}:color=0xFFB020@0.95:t=5{en}")
    return out

# ---------------- potong bagian rekaman
def potong(p, out, tmp):
    src = f"{RAW}/{p['src']}.mkv"; a, b = p["_a"], p["_b"]; sp = p["_sp"]; D = p["_d"]
    filt = []; inputs = ["-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", src]
    kp = p.get("_keep") or [(a, b)]
    sel = ""
    if len(kp) > 1 or abs(kp[0][0] - a) > 0.01 or abs(kp[0][1] - b) > 0.01:
        ex = "+".join(f"between(t,{x - a:.3f},{y - a:.3f})" for x, y in kp)
        sel = f"fps={FPS},select='{ex}',setpts=N/{FPS}/TB,"
    if p["k"] == "rek":
        ac = autocrop(p)
        if ac:
            base = (f"[0:v]{sel}setpts=(PTS-STARTPTS)/{sp},fps={FPS},crop={ac['w']}:{ac['h']}:{ac['x']}:{ac['y']},scale={ac['ow']}:{ac['oh']}:flags=lanczos,"
                    f"pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color={ac['bg']},tpad=stop_mode=clone:stop_duration=60" + filter_sorot(p, ac))
        else:
            x, y, w, h = CROP[p["crop"]]
            base = f"[0:v]{sel}setpts=(PTS-STARTPTS)/{sp},fps={FPS},crop={w}:{h}:{x}:{y},scale=1920:1080:flags=lanczos,tpad=stop_mode=clone:stop_duration=60" + filter_sorot(p, None)
    else:
        sw, shh = log(p["src"])["src"]; ph = 1000; pw = int(round(sw * ph / shh / 2)) * 2
        bg = f"{tmp}/{os.path.basename(out)}.bg.png"; x0, y0 = latar_hp(p["cap"], pw, ph, bg)
        inputs = ["-loop", "1", "-i", bg] + inputs
        base = f"[1:v]setpts=(PTS-STARTPTS)/{sp},fps={FPS},scale={pw}:{ph}:flags=lanczos,tpad=stop_mode=clone:stop_duration=60[p];[0:v][p]overlay={x0}:{y0}:shortest=0"
    lab = None
    if sp >= 1.8: lab = ("AI bekerja · " if (p.get("lab") or "").startswith("AI") else "") + f"dipercepat {sp:.0f}×"
    if lab:
        png = f"{tmp}/{os.path.basename(out)}.lab.png"; pil_label(lab, png); inputs += ["-i", png]
        n = 2 if p["k"] == "hp" else 1
        fc = base + f"[v0];[v0][{n}:v]overlay=W-w-36:24"
    else: fc = base
    sh("ffmpeg", "-loglevel", "error", "-y", *inputs, "-filter_complex", fc, "-t", f"{D:.3f}", "-an", "-r", str(FPS),
       "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out)

# ---------------- rencana waktu satu bab
def kalimat(t): return [x.strip() for x in re.split(r"(?<=[.!?])\s+", t) if x.strip()]
def potong_kalimat(f, kal, A):
    """batas waktu tiap kalimat di MP3 (jeda hening terdekat dari perkiraan panjang huruf)"""
    if len(kal) <= 1: return [0.0, A]
    er = subprocess.run(["ffmpeg", "-i", f, "-af", "silencedetect=noise=-35dB:d=0.15", "-f", "null", "-"], capture_output=True, text=True).stderr
    S = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", er)]; E = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", er)]
    gaps = [(x + y) / 2 for x, y in zip(S, E) if 0.3 < x < A - 0.3]
    tl = sum(len(k) for k in kal); c = 0; cuts = []
    for k in kal[:-1]:
        c += len(k); e = A * c / tl
        cand = [g for g in gaps if not cuts or g > cuts[-1] + 0.4]
        g = min(cand, key=lambda g: abs(g - e)) if cand else e
        cuts.append(g if abs(g - e) < 3.0 else e)
    return [0.0] + cuts + [A]

def _isi(kode, p):
    if p["k"] != "adegan":
        p["_a"], p["_b"] = waktu(p["src"], p["a"]), waktu(p["src"], p["b"])
        p["_keep"] = bersih(p["src"], p["_a"], p["_b"]) if p["k"] == "rek" else [(p["_a"], p["_b"])]
        p["_L"] = max(0.2, sum(y - x for x, y in p["_keep"]))

def _pas(parts, D, diam=False):
    """atur kecepatan/durasi bagian supaya mengisi D; kembalikan D akhir (tanpa tahan)"""
    rec = [p for p in parts if p["k"] != "adegan"]; flex = [p for p in parts if p["k"] == "adegan"]
    if diam:  # kelompok tanpa narasi: rekaman dipercepat supaya tiap bagian +-5 detik
        for p in rec:
            p["_sp"] = max(p["speed"], min(30.0, p["_L"] / 5.0)); p["_d"] = p["_L"] / p["_sp"]
        for p in flex: p["_d"] = p["min"]
        return sum(p["_d"] for p in parts)
    M = sum(p["min"] for p in flex)
    def total(f): return sum(p["_L"] / min(p["speed"] * f, max(p["maks"], p["speed"])) for p in rec)
    f = 1.0
    if rec and total(1) + M > D:
        lo, hi = 1.0, 60.0
        for _ in range(50):
            mid = (lo + hi) / 2
            if total(mid) + M > D: lo = mid
            else: hi = mid
        f = hi
    for p in rec: p["_sp"] = min(p["speed"] * f, max(p["maks"], p["speed"])); p["_d"] = p["_L"] / p["_sp"]
    fix = sum(p["_d"] for p in rec); D = max(D, fix + M); sisa = D - fix
    if flex:
        w = sum(p["bobot"] for p in flex)
        for p in flex: p["_d"] = max(p["min"], sisa * p["bobot"] / w)
        D = fix + sum(p["_d"] for p in flex)
    elif rec and sisa > 0:
        for p in rec:
            p["_d"] += sisa * p["_d"] / fix; p["_sp"] = max(0.6 * p["speed"], p["_L"] / p["_d"])
    return D

AKHIR_BAB = 3.0
def rencanakan(kode):
    """Satu beat dipecah menjadi kelompok per kalimat (bagian visual dengan s=k mulai di kalimat ke-k).
    Bagian dengan 'tahan' dibekukan sekian detik tanpa narasi (waktu membaca prompt / hasil kerja AI).
    Bagian sesudah bagian bertahan tanpa s menjadi kelompok tanpa narasi."""
    B = bab(kode); hasil = []
    for i, (teks, parts) in enumerate(B["beats"]):
        f_mp3 = mp3(kode, teks) if teks else ""
        A = dur(f_mp3) if teks and os.path.exists(f_mp3) else (len(teks) / 14.5 if teks else 0)
        kal = kalimat(teks) if teks else []
        cut = potong_kalimat(f_mp3, kal, A) if teks and os.path.exists(f_mp3) else [0.0, A]
        if len(cut) != len(kal) + 1: kal = kal or [""]; cut = [0.0] * len(kal) + [A]
        parts = [copy.deepcopy(p) for p in parts]
        for p in parts: _isi(kode, p)
        # kelompok
        grup = []; diam = False
        for j, p in enumerate(parts):
            if j == 0: grup.append(dict(s=p.get("s", 0), parts=[], diam=False))
            elif "s" in p: grup.append(dict(s=p["s"], parts=[], diam=False)); diam = False
            elif diam and not grup[-1]["diam"]: grup.append(dict(s=None, parts=[], diam=True))
            grup[-1]["parts"].append(p)
            if p.get("tahan"): diam = True
        bicara = [g for g in grup if not g["diam"]]
        for k, g in enumerate(bicara):
            s0 = g["s"] or 0; s1 = bicara[k + 1]["s"] if k + 1 < len(bicara) else len(kal)
            g["t0"], g["t1"] = cut[min(s0, len(kal))], cut[min(s1, len(kal))]; g["kal"] = kal[s0:s1]
        for k, g in enumerate(grup):
            pertama = k == 0; terakhir = k == len(grup) - 1
            if g["diam"]: g["t0"] = g["t1"] = 0; g["kal"] = []
            Ag = g["t1"] - g["t0"]
            lead = LEAD if pertama else (0.15 if not g["diam"] else 0)
            tail = TAIL if terakhir else 0.25
            g["lead"] = lead
            D = _pas(g["parts"], Ag + lead + tail if teks and not g["diam"] else 0, diam=g["diam"] or not teks)
            if not teks and not g["diam"]: D = _pas(g["parts"], 0)
            th = 0.0
            for p in g["parts"]:
                t = p.get("tahan", 0) or 0
                if t: p["_d"] += t; th += t
            g["D"] = D + th
            # sorotan per kalimat: {"kal": k} menyala saat kalimat ke-k dibacakan (sampai "kal2" atau akhir bagian)
            off = 0.0
            for p in g["parts"]:
                for it in p.get("sorot", []):
                    if "kal" in it and not g["diam"]:
                        k1 = min(it["kal"], len(kal)); k2 = min(it.get("kal2", len(kal)), len(kal))
                        it["_a"] = max(0.0, cut[k1] - g["t0"] + g["lead"] - off - 0.1)
                        if "kal2" in it: it["_b"] = max(it["_a"] + 0.5, cut[k2] - g["t0"] + g["lead"] - off)
                off += p["_d"]
        hasil.append(dict(no=i, teks=teks, A=A, grup=grup, mp3=f_mp3, D=sum(g["D"] for g in grup),
                          parts=[p for g in grup for p in g["parts"]]))
    # jeda akhir bab: bekukan bagian terakhir
    if hasil:
        g = hasil[-1]["grup"][-1]; g["parts"][-1]["_d"] += AKHIR_BAB; g["D"] += AKHIR_BAB; hasil[-1]["D"] += AKHIR_BAB
    return hasil

def rakit_bab(kode, cek=False):
    base = f"{ROOT}/{kode}"; tmp = f"{base}/tmp"; os.makedirs(tmp, exist_ok=True)
    R = rencanakan(kode); n = RC.BAB.index(bab(kode))
    # kartu bab di depan (kecuali V00)
    for r in R:
        print(f"{kode} b{r['no']:02d} D={r['D']:.1f} A={r['A']:.1f} " + " ".join(
            (p["nama"] if p["k"] == "adegan" else p["src"]) + f":{p['_d']:.1f}" + (f"x{p['_sp']:.1f}" if p["k"] != "adegan" else "") for p in r["parts"]), flush=True)
    tot = sum(r["D"] for r in R); print(f"{kode} total {tot:.1f}s");
    if cek: return
    jobs, files = [], []
    kartu = 0.0
    if kode != "V00":
        kartu = 4.0; out = f"{tmp}/kartu.mp4"; files.append(out); jobs.append({"nama": "bab", "D": kartu, "a": {"n": n}, "out": out})
    for r in R:
        for j, p in enumerate(r["parts"]):
            out = f"{tmp}/b{r['no']:02d}_{j}.mp4"; files.append(out)
            if p["k"] == "adegan": jobs.append({"nama": p["nama"], "D": p["_d"], "a": p["a"], "out": out})
            else: potong(p, out, tmp)
    import adegan as ADG
    ADG.render(jobs, ["/home/user/vibe/adegan.js"])
    with open(f"{tmp}/daftar.txt", "w") as fh:
        for x in files: fh.write(f"file '{x}'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{tmp}/daftar.txt", "-c", "copy", f"{tmp}/video.mp4")
    # audio
    with open(f"{tmp}/audio.txt", "w") as fh:
        if kartu:
            sh("ffmpeg", "-loglevel", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", f"{kartu:.3f}", f"{tmp}/a_kartu.wav"); fh.write(f"file '{tmp}/a_kartu.wav'\n")
        for r in R:
            for k, g in enumerate(r["grup"]):
                w = f"{tmp}/a{r['no']:02d}_{k}.wav"
                if r["teks"] and not g["diam"] and g["t1"] > g["t0"]:
                    sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{g['t0']:.3f}", "-to", f"{g['t1']:.3f}", "-i", r["mp3"],
                       "-af", f"afade=t=in:d=0.02,adelay={int(g['lead']*1000)}:all=1,apad", "-t", f"{g['D']:.3f}", "-ar", "48000", "-ac", "2", w)
                else:
                    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", f"{g['D']:.3f}", w)
                fh.write(f"file '{w}'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{tmp}/audio.txt", "-c:a", "pcm_s16le", f"{tmp}/audio.wav")
    sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{tmp}/video.mp4", "-i", f"{tmp}/audio.wav", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", f"{base}/{kode}.mp4")
    # srt relatif bab
    srt = []; t = kartu
    for r in R:
        for g in r["grup"]:
            if g["kal"] and r["teks"]:
                tl = sum(len(x) for x in g["kal"]); t0 = t + g["lead"]; Ag = g["t1"] - g["t0"]
                for x in g["kal"]: d = Ag * len(x) / tl; srt.append((t0, t0 + d - 0.05, x)); t0 += d
            t += g["D"]
    json.dump(srt, open(f"{base}/srt.json", "w"), ensure_ascii=False)
    print("SELESAI", kode, dur(f"{base}/{kode}.mp4"), flush=True)

def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}"
def gabung(nama="Vibe_Coding_Patungan"):
    lst = f"{ROOT}/gabung.txt"; t = 0; srt = []; bab_t = []
    with open(lst, "w") as fh:
        for B in RC.BAB:
            f = f"{ROOT}/{B['kode']}/{B['kode']}.mp4"; fh.write(f"file '{f}'\n"); bab_t.append((t, B["judul"]))
            for a, b, s in json.load(open(f"{ROOT}/{B['kode']}/srt.json")): srt.append((t + a, t + b, s))
            t += dur(f)
    out = f"{ROOT}/{nama}.mp4"
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c:v", "copy", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", out)
    open(out.replace(".mp4", ".srt"), "w").write("\n".join(f"{i+1}\n{ts(a)} --> {ts(b)}\n{s}\n" for i, (a, b, s) in enumerate(srt)))
    json.dump(bab_t, open(f"{ROOT}/chapter.json", "w"), ensure_ascii=False)
    for a, j in bab_t: print(f"{int(a//60)}:{int(a%60):02d} {j}")
    print("SELESAI", out, dur(out))

if __name__ == "__main__":
    c = sys.argv[1]
    if c == "suara": suara(sys.argv[2:] or [b["kode"] for b in RC.BAB])
    elif c == "bab":
        for k in sys.argv[2:]:
            if not k.startswith("--"): rakit_bab(k, "--cek" in sys.argv)
    elif c == "gabung": gabung()
