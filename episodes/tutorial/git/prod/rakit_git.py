"""Rakit video seri Git dari rencana_git.py.
python3 rakit.py suara [V05 ...]     -> buat MP3 Cahaya yang belum ada
python3 rakit.py bab V05 [--cek]      -> rakit satu bab (mp4 + srt bagian), --cek: hanya cetak rencana waktu
python3 rakit.py gabung               -> gabung semua bab + srt + chapter
"""
import json, os, sys, re, subprocess, urllib.request, time, shutil
sys.path.insert(0, "/home/user/git-seri/_alat"); sys.path.insert(0, "/home/user/git-seri/prod")
from PIL import Image, ImageDraw, ImageFont
import rencana_git as RC
ROOT = "/home/user/git-seri/prod/ep"; RAW = "/home/user/git-seri/raw"; FPS = 30; LEAD, TAIL = 0.35, 0.9  # jeda antarbagian lebih lega (masukan Dewi 17 Nov)
FB = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"; FS = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
VID = "iWydkXKoiVtvdn4vLKp9"; MODEL = "eleven_v4"
CROP = {"full": (0, 0, 2560, 1440), "term": (380, 718, 1220, 686), "edit": (0, 0, 1600, 900), "graf": (1200, 0, 1360, 765), "tempat": (1060, 596, 1500, 844),
        "kiri": (0, 0, 1600, 900), "web": (0, 0, 2560, 1440),
        # G06 (layar dibagi dua): terminal Raka/Nadia saja, panel normal (0,62) dan panel tinggi (0,86) saat git add -p
        "rk": (0, 630, 1220, 780), "nk": (1240, 630, 1320, 780), "rkt": (0, 300, 1220, 1110), "webkiri": (0, 0, 1600, 900)}
def sh(*a): subprocess.run(a, check=True)
def dur(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
def bab(kode): return {"kode": kode, "judul": RC.JUDUL[kode], "beats": RC.EP[kode]}

# ---------------- suara
def tts_teks(t):
    t = re.sub(r"\b([a-z]+)\.(js|json|css|html)\b", lambda m: m.group(1) + " titik " + {"js": "je es", "json": "jeson", "css": "ce es es", "html": "ha te em el"}[m.group(2)], t)
    t = t.replace("git diff", "git dif").replace("HEAD", "hed").replace("node modules", "nod modyuls")
    return t
def suara(kodes):
    for kode in kodes:
        B = bab(kode)["beats"]; os.makedirs(f"{ROOT}/{kode}/suara", exist_ok=True)
        teks = [t for t, _ in B if t]  # kartu bab (tanpa narasi) tidak ikut dinomori
        for i, t in enumerate(teks):
            out = f"{ROOT}/{kode}/suara/b{i:02d}.mp3"
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
def pil_label(teks, out, merah=False):
    f = ImageFont.truetype(FB, 40); w = int(f.getlength(teks)) + 84; h = 84
    im = Image.new("RGBA", (w + 16, h + 16), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([8, 8, w + 8, h + 8], 22, fill=(120, 22, 30, 240) if merah else (20, 24, 38, 235)); d.rounded_rectangle([8, 8, 22, h + 8], 7, fill=(255, 107, 107, 255) if merah else (255, 176, 32, 255))
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


def zoom_aman(p, out, tmp):
    """Cari kotak semua teks/isi di frame terakhir; kembalikan zoom maks (<=1.06) yang tetap memuat kotak itu + pusatnya."""
    from PIL import ImageFilter
    src = f"{RAW}/{p['src']}.mkv"; png = f"{tmp}/{os.path.basename(out)}.akhir.png"
    t = max(p["_a"], p["_b"] - 0.06)
    if p["k"] == "rek":
        sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", src, "-frames:v", "1", "-vf", vf_crop(p["crop"]), png)
        im = Image.open(png).convert("L")
    else:
        sw, shh = log(p["src"])["src"]; ph = 1000; pw = int(round(sw * ph / shh / 2)) * 2
        bg = f"{tmp}/{os.path.basename(out)}.zbg.png"; x0, y0 = latar_hp(p["cap"], pw, ph, bg)
        sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", src, "-frames:v", "1", "-vf", f"scale={pw}:{ph}", png)
        im = Image.open(bg).convert("RGB"); im.paste(Image.open(png).convert("RGB"), (x0, y0)); im = im.convert("L")
    ed = im.filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v > 45 else 0)
    bb = ed.getbbox()
    if not bb: return 1.0, 960, 540
    m = 24; x0, y0, x1, y1 = max(0, bb[0] - m), max(0, bb[1] - m), min(1920, bb[2] + m), min(1080, bb[3] + m)
    z = min(1.06, 1920 / max(1, x1 - x0), 1080 / max(1, y1 - y0))
    return z, (x0 + x1) / 2, (y0 + y1) / 2

def letak_label(p, png, tmp, out):
    """Pilih posisi label yang paling sedikit menutupi teks (dicek pada frame awal/tengah/akhir)."""
    from PIL import ImageFilter
    lw, lh = Image.open(png).size
    cand = [(1920 - lw - 40, 36)] + [(1920 - lw - 40, y) for y in range(96, 1080 - lh - 30, 40)] + [(40, 1080 - lh - 50), (960 - lw // 2, 1080 - lh - 50)]
    skor = [0] * len(cand)
    for q, t in enumerate([p["_a"] + 0.05, (p["_a"] + p["_b"]) / 2, p["_b"] - 0.05]):
        f = f"{tmp}/{os.path.basename(out)}.lb{q}.png"; bingkai(p["src"], t, p["crop"], f)
        ed = Image.open(f).convert("L").filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v > 45 else 0)
        for i, (x, y) in enumerate(cand):
            skor[i] += sum(ed.crop((x, y, x + lw, y + lh)).histogram()[255:]) * (1.0 if i == 0 else 1.15)  # sedikit utamakan kanan atas
    i = min(range(len(cand)), key=lambda k: skor[k]); return cand[i]

# ---------------- potong bagian rekaman
def potong(p, out, tmp):
    src = f"{RAW}/{p['src']}.mkv"; a, b = p["_a"], p["_b"]; sp = p["_sp"]; D = p["_d"]
    filt = []; inputs = ["-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", src]
    if p["k"] == "rek":
        base = f"[0:v]setpts=(PTS-STARTPTS)/{sp},fps={FPS},{vf_crop(p['crop'])},tpad=stop_mode=clone:stop_duration=60"
    else:
        sw, shh = log(p["src"])["src"]; ph = 1000; pw = int(round(sw * ph / shh / 2)) * 2
        bg = f"{tmp}/{os.path.basename(out)}.bg.png"; x0, y0 = latar_hp(p["cap"], pw, ph, bg)
        inputs = ["-loop", "1", "-i", bg] + inputs
        base = f"[1:v]setpts=(PTS-STARTPTS)/{sp},fps={FPS},scale={pw}:{ph}:flags=lanczos,tpad=stop_mode=clone:stop_duration=60[p];[0:v][p]overlay={x0}:{y0}:shortest=0"
    P = (b - a) / sp; F = D - P
    if F > 3:  # rekaman habis sebelum narasi: zoom pelan, tetapi tidak pernah memotong teks
        z, cx, cy = zoom_aman(p, out, tmp)
        if z > 1.01:
            # skala naik ke z, lalu potong jendela 1920x1080 yang memuat seluruh kotak teks
            e = f"clip((t-{P:.3f})/{F:.3f},0,1)"; Z = f"(1+{z - 1:.4f}*{e})"
            kb = (f",scale=w='trunc(1920*{Z}/2)*2':h='trunc(1080*{Z}/2)*2':eval=frame:flags=bicubic,"
                  f"crop=1920:1080:'min(max({cx:.1f}*iw/1920-960,0),iw-1920)':'min(max({cy:.1f}*ih/1080-540,0),ih-1080)'")
            base = base + kb
    lab = p.get("lab")
    if sp >= 1.8 and not lab: lab = f"dipercepat {sp:.0f}×"
    if lab:
        png = f"{tmp}/{os.path.basename(out)}.lab.png"; pil_label(lab, png, p.get("labw") == "merah"); inputs += ["-i", png]
        n = 2 if p["k"] == "hp" else 1
        lx, ly = (f"main_w-overlay_w-40", 36) if p["k"] == "hp" else letak_label(p, png, tmp, out)
        fc = base + f"[v0];[v0][{n}:v]overlay={lx}:{ly}"
    else: fc = base
    sh("ffmpeg", "-loglevel", "error", "-y", *inputs, "-filter_complex", fc, "-t", f"{D:.3f}", "-an", "-r", str(FPS),
       "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out)

# ---------------- rencana waktu satu episode
# Sinkron: bagian visual boleh diberi s=k (mulai pada kalimat ke-k narasi beat itu). Beat dipecah per kelompok
# kalimat; setiap kelompok punya potongan suaranya sendiri sehingga visual tidak pernah mendahului/tertinggal narasi.
# crop yang tidak 16:9 diskalakan utuh lalu diberi latar warna terminal (tidak ada teks terpotong)
def vf_crop(nama):
    x, y, w, h = CROP[nama]
    if abs(w / h - 16 / 9) < 0.01: return f"crop={w}:{h}:{x}:{y},scale=1920:1080:flags=lanczos"
    return f"crop={w}:{h}:{x}:{y},scale=1920:1080:force_original_aspect_ratio=decrease:flags=lanczos,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x181818"
def kalimat(teks): return [x.strip() for x in re.split(r"(?<=[.!?])\s+", teks) if x.strip()]

def batas_kalimat(mp3, kal, A):
    """Waktu mulai tiap kalimat di mp3 (pakai jeda hening terdekat dengan perkiraan proporsional)."""
    n = len(kal)
    if n <= 1: return [0.0, A]
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", mp3, "-af", "silencedetect=noise=-38dB:d=0.16", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]; en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
    sil = [((x + y) / 2, y - x) for x, y in zip(st, en) if 0.3 < x and y < A - 0.2]
    tl = sum(len(k) for k in kal); bt = [0.0]; c = 0; pakai = set()
    for i in range(n - 1):
        c += len(kal[i]); e = A * c / tl
        cand = [(abs(m - e) - 0.4 * min(d, 1), j, m) for j, (m, d) in enumerate(sil) if j not in pakai and m > bt[-1] + 0.3]
        if cand:
            _, j, m = min(cand)
            if abs(m - e) < max(1.2, A * 0.18): pakai.add(j); bt.append(m); continue
        bt.append(max(e, bt[-1] + 0.3))
    bt.append(A); return bt

def isi_kelompok(parts, D):
    """Bagi durasi D ke bagian visual (rekaman dipercepat bila perlu, adegan mengisi sisa, tebak ditambahkan)."""
    for p in parts:
        if p["k"] in ("rek", "hp"):
            p["_a"], p["_b"] = waktu(p["src"], p["a"]), waktu(p["src"], p["b"]); p["_L"] = max(0.2, p["_b"] - p["_a"])
    rec = [p for p in parts if p["k"] in ("rek", "hp")]; flex = [p for p in parts if p["k"] == "adegan"]; tb = [p for p in parts if p["k"] == "tebak"]
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
        for p in flex: p["_d"] = max(p["min"], sisa * p["bobot"] / w) if len(flex) == 1 else sisa * p["bobot"] / w
        if sum(max(0, p["min"] - p["_d"]) for p in flex) > 0:
            for p in flex: p["_d"] = max(p["_d"], p["min"])
            D = fix + sum(p["_d"] for p in flex)
    elif rec: rec[-1]["_d"] += sisa
    for p in tb: p["_d"] = p["min"]; D += p["min"]
    return D

def rencanakan(kode):
    B = bab(kode); hasil = []; ns = 0
    for i, (teks, parts) in enumerate(B["beats"]):
        mp3 = f"{ROOT}/{kode}/suara/b{ns:02d}.mp3"; ns += 1 if teks else 0; parts = [dict(p) for p in parts]
        kal = kalimat(teks) if teks else []
        A = dur(mp3) if teks and os.path.exists(mp3) else (len(teks) / 14.5 if teks else 0)
        bt = batas_kalimat(mp3, kal, A) if teks and os.path.exists(mp3) else [A * j / max(1, len(kal)) for j in range(len(kal) + 1)]
        # kelompokkan bagian visual menurut kalimat awalnya
        grup = []
        for p in parts:
            s0 = p.pop("s", None)
            if s0 is not None or not grup:
                if s0 is not None and grup and s0 <= grup[-1]["s"]: raise SystemExit(f"{kode} b{i:02d}: s={s0} tidak urut")
                grup.append({"s": s0 if s0 is not None else 0, "parts": []})
            grup[-1]["parts"].append(p)
        grup[0]["s"] = 0
        n = len(kal)
        for g, G in enumerate(grup):
            e = grup[g + 1]["s"] if g + 1 < len(grup) else n
            G["a0"], G["a1"] = (bt[G["s"]], bt[e]) if teks else (0, 0)
            G["lead"] = LEAD if (teks and g == 0) else 0; G["tail"] = TAIL if (teks and g == len(grup) - 1) else 0
            Dn = (G["a1"] - G["a0"]) + G["lead"] + G["tail"] if teks else 0
            G["D"] = isi_kelompok(G["parts"], Dn)
            G["kal"] = [(bt[j] - G["a0"] + G["lead"], bt[j + 1] - G["a0"] + G["lead"] - 0.05, kal[j]) for j in range(G["s"], e)] if teks else []
            # adegan menerima waktu mulai tiap kalimat (relatif ke awal adegan) agar animasinya sinkron dengan narasi
            off = 0.0
            for p in G["parts"]:
                if p["k"] == "adegan": p["a"] = dict(p["a"], _kal=[round(x0 - off, 3) for x0, _, _ in G["kal"]])
                off += p.get("_d", 0)
        hasil.append(dict(no=i, mp3=mp3, teks=teks, A=A, D=sum(G["D"] for G in grup), grup=grup, parts=[p for G in grup for p in G["parts"]]))
    return hasil

def bingkai(src, t, crop, out):
    sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", f"{RAW}/{src}.mkv", "-frames:v", "1", "-vf", vf_crop(crop), out)

def rakit_bab(kode, cek=False):
    base = f"{ROOT}/{kode}"; tmp = f"{base}/tmp"; os.makedirs(tmp, exist_ok=True)
    R = rencanakan(kode)
    for r in R:
        print(f"{kode} b{r['no']:02d} D={r['D']:.1f} A={r['A']:.1f} " + " ".join(
            (p.get("nama") or p.get("src")) + f":{p['_d']:.1f}" + (f"x{p['_sp']:.1f}" if p["k"] in ("rek", "hp") else "") for p in r["parts"]), flush=True)
    tot = sum(r["D"] for r in R); print(f"{kode} total {tot:.1f}s", flush=True)
    if cek: return
    jobs, files = [], []
    for r in R:
        for j, p in enumerate(r["parts"]):
            out = f"{tmp}/b{r['no']:02d}_{j}.mp4"; files.append(out)
            if p["k"] == "adegan": jobs.append({"nama": p["nama"], "D": p["_d"], "a": p["a"], "out": out})
            elif p["k"] == "tebak":
                png = f"{tmp}/b{r['no']:02d}_{j}.png"; bingkai(p["src"], waktu(p["src"], p["tanda"]), p["crop"], png)
                jobs.append({"nama": "tebak", "D": p["_d"], "a": {"bg": png}, "out": out})
            else: potong(p, out, tmp)
    import adegan_r as ADG
    ADG.render(jobs, ["/home/user/git-seri/adegan_git.js"])
    with open(f"{tmp}/daftar.txt", "w") as fh:
        for x in files: fh.write(f"file '{x}'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{tmp}/daftar.txt", "-c", "copy", f"{tmp}/video.mp4")
    with open(f"{tmp}/audio.txt", "w") as fh:
        for r in R:
            for g, G in enumerate(r["grup"]):
                w = f"{tmp}/a{r['no']:02d}_{g}.wav"
                if r["teks"] and G["a1"] > G["a0"]:
                    sh("ffmpeg", "-loglevel", "error", "-y", "-i", r["mp3"], "-af",
                       f"atrim={G['a0']:.3f}:{G['a1']:.3f},asetpts=PTS-STARTPTS,adelay={int(G['lead']*1000)}:all=1,apad", "-t", f"{G['D']:.3f}", "-ar", "48000", "-ac", "2", w)
                else:
                    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", f"{G['D']:.3f}", w)
                fh.write(f"file '{w}'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{tmp}/audio.txt", "-c:a", "pcm_s16le", f"{tmp}/audio.wav")
    nama = f"{kode}_" + re.sub(r"[^A-Za-z0-9]+", "_", RC.JUDUL[kode]).strip("_")
    out = f"{base}/{nama}.mp4"
    sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{tmp}/video.mp4", "-i", f"{tmp}/audio.wav", "-c:v", "copy", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
       "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", out)
    srt = []; t = 0
    for r in R:
        for G in r["grup"]:
            for x0, x1, k in G["kal"]: srt.append((t + x0, t + x1, k))
            t += G["D"]
    open(out.replace(".mp4", ".srt"), "w").write("\n".join(f"{i+1}\n{ts(a)} --> {ts(b)}\n{s}\n" for i, (a, b, s) in enumerate(srt)))
    print("SELESAI", out, dur(out), flush=True)

def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}"

if __name__ == "__main__":
    c = sys.argv[1]
    if c == "suara": suara(sys.argv[2:])
    elif c == "ep":
        for k in sys.argv[2:]:
            if not k.startswith("--"): rakit_bab(k, "--cek" in sys.argv)
