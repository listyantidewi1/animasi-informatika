"""Rakit episode tutorial versi 2 (standar revisi 17 Nov 2026):
- rekaman layar tidak dipercepat lebih dari CAP, narasi ditempatkan per kalimat dan ditambatkan ke baris kode yang dibahas (OCR)
- baris yang sedang dijelaskan disorot
- jeda setelah rekaman selesai, jeda akhir bab, dan kartu bab +-4 detik
- kalimat pengganti lafal: Txx/kalimat_baru/bNN_kK.mp3 menggantikan kalimat K (mulai 1) pada beat NN
python3 rakit2.py Txx"""
import json, os, sys, re, subprocess, importlib.util, math
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(__file__))
from durasi import audio, LEAD, TAIL
from kalimat import kalimat, pecah
import adegan as ADG
FPS, OW, OH, SR = 30, 1920, 1080, 48000
CAP = 1.3          # kecepatan maksimum rekaman layar
HOLD_REK = 2.2     # jeda minimal setelah rekaman beat selesai (layar akhir tetap terlihat)
HOLD_NAR = 1.0     # jeda setelah kalimat terakhir
HOLD_BAB = 1.5     # tambahan jeda sebelum pindah bab
KARTU = 4.0        # kartu bab
GAP = 0.3          # jeda minimal antarkalimat
FB = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"; FX = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"
NUM = {"nol": "0", "satu": "1", "dua": "2", "tiga": "3", "empat": "4", "lima": "5", "enam": "6", "tujuh": "7", "delapan": "8", "sembilan": "9", "sepuluh": "10"}
STOP = {"kolom", "perlu", "berisi", "nilai", "file", "dan", "yang", "ini", "itu", "kita", "kamu", "untuk", "dengan", "lalu", "atau", "jika", "kalau", "akan", "ada", "tidak", "bisa", "sama", "baru", "the"}
def sh(*a): subprocess.run(a, check=True)
def durf(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
def pcm(f):
    raw = subprocess.check_output(["ffmpeg", "-loglevel", "error", "-i", f, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"])
    return np.frombuffer(raw, np.float32).reshape(-1, 2)
def potong(src, a, b, speed, dur, out):
    vf = f"setpts=(PTS-STARTPTS)/{speed},fps={FPS},tpad=stop_mode=clone:stop_duration=60"
    sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", src, "-vf", vf, "-t", f"{dur:.3f}", "-an",
       "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p", "-r", str(FPS), out)

# ---------- kosakata kode & token kalimat ----------
def kosakata(S):
    M = getattr(S, "META", {}); teks = (M.get("kode") or "") + "\n" + (M.get("langkah") or "")
    for k in ("C0", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "KODE"):
        if isinstance(getattr(S, k, None), str): teks += "\n" + getattr(S, k)
    teks = "\n".join(re.sub(r"(^|\s)(#|//).*", "", l) for l in teks.split("\n"))
    V = {w.lower() for w in re.findall(r"[A-Za-z_][A-Za-z0-9_]*", teks)}
    V |= {w.lower() for w in re.findall(r"[A-Za-z][a-z]+(?=[A-Z])|[A-Z][a-z]+", teks)}  # potongan camelCase
    return V, [l.lower() for l in teks.split("\n") if l.strip()]
def token(sent, V, lines):
    w = [NUM.get(x, x) for x in re.findall(r"[a-z0-9_]+", sent.lower())]; best, bs = None, 2.5
    for i in range(len(w)):
        for n in (1, 2, 3):
            seg = w[i:i + n]
            if len(seg) < n: continue
            for j in ("_", ""):
                c = j.join(seg)
                if c not in V or len(c) < 3 or c in STOP or c.isdigit(): continue
                cnt = sum(c in l for l in lines)
                s = len(c) + (3 if ("_" in c or any(ch.isdigit() for ch in c) or n > 1) else 0) - 1.2 * min(cnt, 6)
                if s > bs: best, bs = c, s
    return best
def norm(t): return re.sub(r"[\s_]+", "", t.lower())

# ---------- OCR ----------
_ocr = None
def ocr(fr):
    global _ocr
    if _ocr is None:
        from rapidocr_onnxruntime import RapidOCR; _ocr = RapidOCR()
    r, _ = _ocr(fr)
    return [(min(p[0] for p in b), min(p[1] for p in b), max(p[0] for p in b), max(p[1] for p in b), t) for b, t, s in (r or []) if float(s) > .5]
def sampel(f, L, step=0.5):
    cap = cv2.VideoCapture(f); S = []; t = 0.0
    while t <= L + 1e-6:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(round(t * FPS))); ok, fr = cap.read()
        if not ok: break
        S.append((t, ocr(fr))); t += step
    return S
def kodeish(t): return bool(re.search(r"[=()\[\]:\"'.<>{}_]", t))
def cari(boxes, tok):
    m = [b for b in boxes if norm(tok) in norm(b[4])]
    if not m: return None
    m.sort(key=lambda b: (kodeish(b[4]), b[1]), reverse=True); b = m[0]
    h = b[3] - b[1]; yc = (b[1] + b[3]) / 2
    row = [x for x in boxes if abs((x[1] + x[3]) / 2 - yc) < h * 0.45 and abs((x[3] - x[1]) - h) < h * 0.6]
    x0 = min(x[0] for x in row); x1 = max(x[2] for x in row)
    if x1 - x0 > OW * 0.85: x0, x1 = b[0], b[2]
    return [x0, b[1], x1, b[3]]

# ---------- sorotan ----------
def sorot_klip(src, out, dur, sorot):
    """sorot: list of (t0, t1, boxes_by_time) dalam waktu lokal; tulis dur detik."""
    cap = cv2.VideoCapture(src); n = int(round(dur * FPS)); last = None
    ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OW}x{OH}", "-r", str(FPS), "-i", "-",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    for i in range(n):
        ok, fr = cap.read()
        if ok: last = fr
        fr = last.copy(); t = i / FPS
        for (t0, t1, kot) in sorot:
            if not (t0 <= t <= t1): continue
            b = kot(t)
            if not b: continue
            a = min(1, (t - t0) / 0.25, (t1 - t) / 0.3)
            x0, y0, x1, y1 = int(b[0]) - 14, int(b[1]) - 9, int(b[2]) + 14, int(b[3]) + 9
            ov = fr.copy(); cv2.rectangle(ov, (x0, y0), (x1, y1), (32, 176, 255), -1)
            fr = cv2.addWeighted(ov, 0.16 * a, fr, 1 - 0.16 * a, 0)
            ov = fr.copy(); cv2.rectangle(ov, (x0, y0), (x1, y1), (32, 176, 255), 4, cv2.LINE_AA); cv2.rectangle(ov, (x0 - 16, y0), (x0 - 8, y1), (32, 176, 255), -1)
            fr = cv2.addWeighted(ov, 0.95 * a, fr, 1 - 0.95 * a, 0)
        ff.stdin.write(fr.tobytes())
    ff.stdin.close(); ff.wait()
def diam(src, out, dur, dari_akhir=True):
    sh("ffmpeg", "-loglevel", "error", "-y", "-sseof", "-0.1", "-i", src, "-frames:v", "1", "-q:v", "2", out + ".png")
    sh("ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-i", out + ".png", "-t", f"{dur:.3f}", "-r", str(FPS), "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out)
def kartu_bab(no, judul, out):
    im = Image.new("RGB", (OW, OH)); d = ImageDraw.Draw(im)
    for yy in range(OH):
        k = yy / OH; d.line([(0, yy), (OW, yy)], fill=(int(16 + 10 * k), int(20 + 12 * k), int(34 + 26 * k)))
    for gx in range(60, OW, 60):
        for gy in range(60, OH, 60): d.point((gx, gy), fill=(48, 56, 82))
    f1 = ImageFont.truetype(FX if os.path.exists(FX) else FB, 96); fp = ImageFont.truetype(FB, 34)
    d.rounded_rectangle([160, 380, 380, 440], 30, fill=(255, 176, 32)); d.text((270, 410), f"BAGIAN {no}", font=fp, fill=(20, 24, 38), anchor="mm")
    y = 480; kata = judul.split(); baris = [""]
    for w in kata:
        t = (baris[-1] + " " + w).strip()
        if d.textlength(t, font=f1) > OW - 320 and baris[-1]: baris.append(w)
        else: baris[-1] = t
    for b in baris: d.text((160, y), b, font=f1, fill=(255, 255, 255)); y += 116
    base = np.array(im)[:, :, ::-1].copy(); n = int(KARTU * FPS)
    ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OW}x{OH}", "-r", str(FPS), "-i", "-",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    for i in range(n):
        t = i / FPS; s = 1 + 0.015 * t / KARTU; M = cv2.getRotationMatrix2D((OW / 2, OH / 2), 0, s); fr = cv2.warpAffine(base, M, (OW, OH))
        fade = max(0, min(1, t / 0.35, (KARTU - t) / 0.35)); ff.stdin.write((fr * fade).astype(np.uint8).tobytes())
    ff.stdin.close(); ff.wait()

def kartu_setup(langkah, out):
    im = Image.new("RGB", (OW, OH)); d = ImageDraw.Draw(im)
    for yy in range(OH):
        k = yy / OH; d.line([(0, yy), (OW, yy)], fill=(int(16 + 10 * k), int(20 + 12 * k), int(34 + 26 * k)))
    fp = ImageFont.truetype(FB, 32); fj = ImageFont.truetype(FX if os.path.exists(FX) else FB, 64); ft = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-SemiBold.otf", 40)
    d.rounded_rectangle([140, 110, 390, 166], 28, fill=(45, 212, 191)); d.text((265, 138), "PERSIAPAN", font=fp, fill=(20, 24, 38), anchor="mm")
    d.text((140, 200), "Sebelum mulai mengetik", font=fj, fill=(255, 255, 255)); y = 330
    for i, l in enumerate(langkah):
        d.ellipse([140, y + 2, 196, y + 58], fill=(255, 176, 32)); d.text((168, y + 30), str(i + 1), font=fp, fill=(20, 24, 38), anchor="mm")
        baris = [""]
        for w in l.split():
            t = (baris[-1] + " " + w).strip()
            if d.textlength(t, font=ft) > OW - 400 and baris[-1]: baris.append(w)
            else: baris[-1] = t
        for b in baris: d.text((230, y + 6), b, font=ft, fill=(225, 230, 245)); y += 54
        y += 34
    kata = sum(len(l.split()) for l in langkah); dur = min(28.0, 3.0 + kata / 2.2)
    base = np.array(im)[:, :, ::-1].copy(); n = int(dur * FPS)
    ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OW}x{OH}", "-r", str(FPS), "-i", "-",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    for i in range(n):
        t = i / FPS; fade = max(0, min(1, t / 0.35, (dur - t) / 0.35)); fr = base.copy(); cv2.rectangle(fr, (140, OH - 90), (OW - 140, OH - 82), (60, 52, 40), -1); cv2.rectangle(fr, (140, OH - 90), (140 + int((OW - 280) * t / dur), OH - 82), (32, 176, 255), -1); ff.stdin.write((fr * fade).astype(np.uint8).tobytes())
    ff.stdin.close(); ff.wait(); return dur

def main(ep):
    base = f"/home/user/tut/{ep}"; tmp = f"{base}/tmp2"; os.makedirs(tmp, exist_ok=True)
    sp = importlib.util.spec_from_file_location("spec", f"{base}/spec.py"); S = importlib.util.module_from_spec(sp); sp.loader.exec_module(S)
    A = audio(ep); NB = {b["no"]: b["teks"] for b in json.load(open("/home/user/tut/naskah.json"))[ep]["beats"]}
    KL = json.load(open(f"{base}/kalimat.json")) if os.path.exists(f"{base}/kalimat.json") else {}
    V, VL = kosakata(S); BAB = {n: j for n, j in getattr(S, "META", {}).get("bab", [])}; bab_no = {n: i + 1 for i, n in enumerate(sorted(BAB))}
    rek = {}
    for nama in getattr(S, "REKAMAN", ["rek"]):
        log = json.load(open(f"{base}/{nama}.json")); rek[nama] = {"src": f"{base}/{nama}_cam.mp4", "tanda": dict((n, t) for t, n in log["tanda"])}
    # ---- klip kalimat ----
    klip = {}
    for no in sorted(S.BEATS):
        f = f"{base}/suara/b{no:02d}.mp3"; X = pcm(f); seg = KL.get(str(no)) or pecah(f, NB[no]); ks = kalimat(NB[no]); C = []
        for k, (a, b) in enumerate(seg):
            alt = f"{base}/kalimat_baru/b{no:02d}_k{k + 1}.mp3"
            if os.path.exists(alt):
                Y = pcm(alt); e = np.abs(Y).max(axis=1) > 0.01; idx = np.where(e)[0]
                if len(idx): Y = Y[max(0, idx[0] - int(.03 * SR)): idx[-1] + int(.08 * SR)]
            else: Y = X[int(a * SR): int(b * SR)]
            C.append({"teks": ks[k] if k < len(ks) else "", "pcm": Y, "L": len(Y) / SR, "a0": a, "b0": b})
        klip[no] = C
    rencana = []; jobs = []
    for no in sorted(S.BEATS):
        parts = [dict(p) for p in S.BEATS[no]]; C = klip[no]; D0 = A[no] + LEAD + TAIL
        for p in parts:
            if p["k"] in ("rek", "klip"):
                R = rek[p.get("r", "rek")]; a = R["tanda"][p["a"]] if isinstance(p["a"], str) else p["a"]; b = R["tanda"][p["b"]] if isinstance(p["b"], str) else p["b"]
                p["_a"], p["_b"] = a + p.get("da", 0), b + p.get("db", 0); p["_L"] = p["_b"] - p["_a"]
        # tata letak lama (untuk memetakan waktu kalimat)
        fixL = sum(p["_L"] / p.get("speed", 1) for p in parts if p["k"] in ("rek", "klip"))
        flex = [p for p in parts if p["k"] == "adegan"]; minflex = sum(p.get("min", 5) for p in flex); speed = 1.0
        if fixL + minflex > D0:
            need = fixL / max(0.1, D0 - minflex); speed = min(max(1.0, need), max([p.get("maks", 1.6) for p in parts if p["k"] in ("rek", "klip")] or [1]))
        fixL2 = fixL / speed; D0 = max(D0, fixL2 + minflex); sisa = D0 - fixL2
        for p in parts:
            if p["k"] in ("rek", "klip"): p["_d0"] = p["_L"] / p.get("speed", 1) / speed; p["_sp0"] = p.get("speed", 1) * speed
        if flex:
            w = sum(p.get("bobot", 1) for p in flex)
            for p in flex: p["_d0"] = sisa * p.get("bobot", 1) / w
        else: [p for p in parts if p["k"] in ("rek", "klip")][-1]["_d0"] += sisa
        punya_rek = any(p["k"] == "rek" for p in parts)
        # waktu lama tiap kalimat (dengan pergeseran bila klip pengganti lebih panjang)
        t = LEAD; tl = []
        for k, c in enumerate(C):
            s = LEAD + c["a0"]
            if k: s = max(s, tl[-1][1] + max(0.05, c["a0"] - C[k - 1]["b0"]))
            tl.append((s, s + c["L"]))
        if not punya_rek:
            D = max(D0, tl[-1][1] + TAIL); f = D / D0
            for p in parts: p["_d"] = p["_d0"] * (f if p["k"] == "adegan" else 1); p["_sp"] = p.get("_sp0", 1)
            if not flex: parts[-1]["_d"] += D - sum(p["_d"] for p in parts)
            for p in parts: p["_d"] = p["_d"]
            r = {"no": no, "parts": parts, "kal": [list(x) for x in tl], "D": D, "rek": False}
        else:
            for p in parts:
                if p["k"] == "rek": p["_sp"] = max(p.get("speed", 1), min(p["_sp0"], CAP)); p["_d"] = p["_L"] / p["_sp"]
                elif p["k"] == "klip": p["_sp"] = p["_sp0"]; p["_d"] = p["_d0"]
                else: p["_d"] = p["_d0"]
            # peta waktu lama -> baru (per bagian)
            o = n_ = 0.0; peta = []
            for p in parts: peta.append((o, o + p["_d0"], n_, n_ + p["_d"])); o += p["_d0"]; n_ += p["_d"]
            def mp(x):
                for (a0, b0, a1, b1) in peta:
                    if x <= b0: return a1 + (x - a0) / max(1e-6, b0 - a0) * (b1 - a1)
                return peta[-1][3] + (x - peta[-1][1])
            r = {"no": no, "parts": parts, "kal0": [mp(s) for s, e in tl], "rek": True}
        rencana.append(r)
        # file per bagian
        prev = None
        for i, p in enumerate(parts):
            out = f"{tmp}/b{no:02d}_{i}.mp4"; p["_f"] = out
            if p["k"] in ("rek", "klip"):
                R = rek[p.get("r", "rek")]; potong(R["src"], p["_a"], p["_b"], p["_sp"], p["_d"] + (12 if r["rek"] else 0), out); prev = (R["src"], p["_b"] - 0.05)
            else:
                a = dict(p.get("a", {}))
                if p.get("bg"):
                    src, tt = prev if p["bg"] is True else (rek[p["bg"][0]]["src"], rek[p["bg"][0]]["tanda"].get(p["bg"][1], p["bg"][1]) if isinstance(p["bg"][1], str) else p["bg"][1])
                    png = f"{tmp}/bg_b{no:02d}_{i}.jpg"; sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{max(0, tt):.3f}", "-i", src, "-frames:v", "1", "-q:v", "2", png); a["bg"] = png
                jobs.append({"nama": p["nama"], "D": p["_d"], "a": a, "out": out})
        print(f"b{no:02d} " + " ".join(f"{p['k']}:{p['_d']:.1f}" + (f"x{p['_sp']:.2f}" if p['k'] != 'adegan' else '') for p in parts), flush=True)
    ADG.render(jobs, [f"{base}/adegan.js"] + getattr(S, "SKRIP", []))
    # ---- penempatan kalimat + sorotan pada beat rekaman ----
    for r in rencana:
        if not r["rek"]: continue
        no = r["no"]; parts = r["parts"]; C = klip[no]; off = 0.0; info = []
        for p in parts:
            p["_o"] = off; off += p["_d"]
            if p["k"] == "rek": p["_Lnat"] = p["_d"]; p["_S"] = sampel(p["_f"], p["_d"])
        vis = off; kal = []; sor = []
        for k, c in enumerate(C):
            tok = token(c["teks"], V, VL); s = r["kal0"][k]; anc = None; hit = None
            if tok:
                for p in parts:
                    if p["k"] != "rek": continue
                    ada = [(t, cari(bx, tok)) for t, bx in p["_S"]]
                    jejak = [(t, b) for t, b in ada if b]
                    if not jejak: continue
                    if not ada[0][1]: anc = p["_o"] + jejak[0][0]
                    hit = (p, dict(jejak)); break
            if anc is not None and anc - 0.2 > s: s = anc - 0.2
            if kal: s = max(s, kal[-1][1] + GAP)
            kal.append((s, s + c["L"])); info.append((tok, hit))
        r["kal"] = [list(x) for x in kal]
        last = parts[-1]; D = max(vis + (HOLD_REK if last["k"] == "rek" else 0.6), kal[-1][1] + HOLD_NAR)
        if last["k"] == "rek": last["_d"] += D - vis
        else: r["ekor"] = D - vis
        r["D"] = D
        # sorotan per bagian rekaman
        for p in parts:
            if p["k"] != "rek": continue
            sl = []
            for k, (tok, hit) in enumerate(info):
                if not hit or hit[0] is not p: continue
                t0, t1 = kal[k][0] - p["_o"], kal[k][1] - p["_o"] + 0.4
                if t1 < 0 or t0 > p["_d"]: continue
                J = hit[1]; ts = sorted(J)
                def kot(t, J=J, ts=ts, Lp=p["_Lnat"]):
                    lo = [x for x in ts if x <= t]; hi = [x for x in ts if x >= t]
                    if not lo: return None
                    a = lo[-1]
                    if t > ts[-1]: return J[a] if a >= Lp - 0.6 else None
                    if not hi: return None
                    b = hi[0]
                    if b == a: return J[a]
                    if b - a > 0.6 or max(abs(J[a][j] - J[b][j]) for j in (0, 1, 3)) > 12: return None
                    f = (t - a) / (b - a); return [J[a][j] * (1 - f) + J[b][j] * f for j in range(4)]
                sl.append((max(0, t0), t1, kot)); print(f"  b{no:02d} sorot '{tok}' {kal[k][0]:.1f}-{kal[k][1]:.1f}", flush=True)
            nf = p["_f"].replace(".mp4", "_s.mp4"); sorot_klip(p["_f"], nf, p["_d"], sl); p["_f"] = nf
    # ---- jeda bab + kartu ----
    daftar = []; waktu = []; t = 0.0; srt = []
    urut = [r["no"] for r in rencana]; SETUP = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "setup.json"))).get(ep, {})
    for idx, r in enumerate(rencana):
        no = r["no"]; mulai_kartu = None
        if no in BAB and idx > 0:
            kf = f"{tmp}/kartu_{no:02d}.mp4"; kartu_bab(bab_no[no], BAB[no], kf); daftar.append((kf, KARTU, None)); mulai_kartu = t; t += KARTU
        if SETUP.get("sebelum") == no:
            sf = f"{tmp}/setup.mp4"; sd = kartu_setup(SETUP["langkah"], sf); daftar.append((sf, sd, None))
            if mulai_kartu is None: mulai_kartu = t
            t += sd
        waktu.append({"no": no, "mulai": mulai_kartu if mulai_kartu is not None else t, "isi": t, "D": r["D"]})
        for p in r["parts"]: daftar.append((p["_f"], p["_d"], None))
        ekor = r.get("ekor", 0.0)
        if idx + 1 < len(rencana) and urut[idx + 1] in BAB: ekor += HOLD_BAB
        if ekor > 0.05:
            ef = f"{tmp}/ekor_{no:02d}.mp4"; diam(r["parts"][-1]["_f"], ef, ekor); daftar.append((ef, ekor, None))
        for k, (s, e) in enumerate(r["kal"]): srt.append((t + s, t + e, klip[no][k]["teks"], klip[no][k]["pcm"]))
        t += r["D"] + ekor
    total = t
    # ---- video: potong tepat panjang lalu gabung ----
    lst = f"{tmp}/daftar.txt"
    with open(lst, "w") as f:
        for i, (fn, d, _) in enumerate(daftar):
            fx = f"{tmp}/z{i:03d}.mp4"
            sh("ffmpeg", "-loglevel", "error", "-y", "-i", fn, "-vf", f"tpad=stop_mode=clone:stop_duration=30,fps={FPS}", "-t", f"{d:.3f}", "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-pix_fmt", "yuv420p", fx)
            f.write(f"file '{fx}'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", f"{tmp}/video.mp4")
    # ---- audio ----
    X = np.zeros((int((total + 1) * SR), 2), np.float32)
    for (s, e, tx, Y) in srt: i = int(s * SR); X[i:i + len(Y)] += Y[:max(0, len(X) - i)]
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", f"{tmp}/mentah.wav") if False else None
    p = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", str(SR), f"{tmp}/audio.wav"], stdin=subprocess.PIPE)
    p.stdin.write(X.tobytes()); p.stdin.close(); p.wait()
    out = f"{base}/{S.NAMA}.mp4"
    sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{tmp}/video.mp4", "-i", f"{tmp}/audio.wav", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-t", f"{total:.3f}", "-movflags", "+faststart", out)
    def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{int(s):02d},{int((s % 1) * 1000):03d}"
    open(out.replace(".mp4", ".srt"), "w").write("\n".join(f"{i + 1}\n{ts(s)} --> {ts(e)}\n{tx}\n" for i, (s, e, tx, _) in enumerate(srt)))
    import shutil
    if not os.path.exists(f"{base}/waktu_lama.json"): shutil.copy(f"{base}/waktu.json", f"{base}/waktu_lama.json")
    json.dump(waktu, open(f"{base}/waktu.json", "w"))
    print("SELESAI", out, durf(out))
if __name__ == "__main__": main(sys.argv[1])
