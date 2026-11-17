"""Rakit video Vibe Coding Patungan dari rencana.py.
python3 rakit.py suara [V05 ...]     -> buat MP3 Cahaya yang belum ada
python3 rakit.py bab V05 [--cek]      -> rakit satu bab (mp4 + srt bagian), --cek: hanya cetak rencana waktu
python3 rakit.py gabung               -> gabung semua bab + srt + chapter
"""
import json, os, sys, re, subprocess, urllib.request, time, shutil
sys.path.insert(0, "/home/user/vibe/_alat"); sys.path.insert(0, "/home/user/vibe/prod")
from PIL import Image, ImageDraw, ImageFont
import rencana as RC
ROOT = "/home/user/vibe/prod"; RAW = "/home/user/vibe/raw"; FPS = 30; LEAD, TAIL = 0.25, 0.45
FB = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"; FS = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
VID = "iWydkXKoiVtvdn4vLKp9"; MODEL = "eleven_v4"
CROP = {"full": (0, 0, 2560, 1440), "termU": (1300, 40, 1260, 709), "termK": (1300, 30, 1040, 585), "termM": (1300, 330, 1260, 709), "termD": (1300, 700, 1260, 709),
        "edit": (400, 40, 1440, 810), "dt": (1040, 140, 1520, 855)}
def sh(*a): subprocess.run(a, check=True)
def dur(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
def bab(kode): return next(b for b in RC.BAB if b["kode"] == kode)

# ---------------- suara
def tts_teks(t):
    t = t.replace("SPEK.md", "spek titik em de").replace("CLAUDE.md", "klod titik em de").replace("AGENTS.md", "agents titik em de")
    t = re.sub(r"\b([a-z]+)\.(js|json|css|html)\b", lambda m: m.group(1) + " titik " + {"js": "je es", "json": "jeson", "css": "ce es es", "html": "ha te em el"}[m.group(2)], t)
    t = t.replace("wa.me", "wa titik mi").replace("npm run", "en pe em ran").replace("npm install", "en pe em install").replace("git diff", "git dif")
    return t
def suara(kodes):
    for kode in kodes:
        B = bab(kode)["beats"]; os.makedirs(f"{ROOT}/{kode}/suara", exist_ok=True)
        teks = [t for t, _ in B]
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


def zoom_aman(p, out, tmp):
    """Cari kotak semua teks/isi di frame terakhir; kembalikan zoom maks (<=1.06) yang tetap memuat kotak itu + pusatnya."""
    from PIL import ImageFilter
    src = f"{RAW}/{p['src']}.mkv"; png = f"{tmp}/{os.path.basename(out)}.akhir.png"
    t = max(p["_a"], p["_b"] - 0.06)
    if p["k"] == "rek":
        x, y, w, h = CROP[p["crop"]]
        sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", src, "-frames:v", "1", "-vf", f"crop={w}:{h}:{x}:{y},scale=1920:1080", png)
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

# ---------------- potong bagian rekaman
def potong(p, out, tmp):
    src = f"{RAW}/{p['src']}.mkv"; a, b = p["_a"], p["_b"]; sp = p["_sp"]; D = p["_d"]
    filt = []; inputs = ["-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", src]
    if p["k"] == "rek":
        x, y, w, h = CROP[p["crop"]]
        base = f"[0:v]setpts=(PTS-STARTPTS)/{sp},fps={FPS},crop={w}:{h}:{x}:{y},scale=1920:1080:flags=lanczos,tpad=stop_mode=clone:stop_duration=60"
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
    lab = None
    if sp >= 1.8: lab = ("AI bekerja · " if (p.get("lab") or "").startswith("AI") else "") + f"dipercepat {sp:.0f}×"
    if lab:
        png = f"{tmp}/{os.path.basename(out)}.lab.png"; pil_label(lab, png); inputs += ["-i", png]
        n = 2 if p["k"] == "hp" else 1
        fc = base + f"[v0];[v0][{n}:v]overlay=50:40"
    else: fc = base
    sh("ffmpeg", "-loglevel", "error", "-y", *inputs, "-filter_complex", fc, "-t", f"{D:.3f}", "-an", "-r", str(FPS),
       "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out)

# ---------------- rencana waktu satu bab
def rencanakan(kode):
    B = bab(kode); hasil = []
    for i, (teks, parts) in enumerate(B["beats"]):
        mp3 = f"{ROOT}/{kode}/suara/b{i:02d}.mp3"
        A = dur(mp3) if teks and os.path.exists(mp3) else (len(teks) / 14.5 if teks else 0)
        D = A + LEAD + TAIL if teks else 0
        parts = [dict(p) for p in parts]
        for p in parts:
            if p["k"] != "adegan":
                p["_a"], p["_b"] = waktu(p["src"], p["a"]), waktu(p["src"], p["b"]); p["_L"] = max(0.2, p["_b"] - p["_a"])
        rec = [p for p in parts if p["k"] != "adegan"]; flex = [p for p in parts if p["k"] == "adegan"]
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
            # pastikan min
            kur = sum(max(0, p["min"] - p["_d"]) for p in flex)
            if kur > 0:
                for p in flex: p["_d"] = max(p["_d"], p["min"])
                D = fix + sum(p["_d"] for p in flex)
        elif rec: rec[-1]["_d"] += sisa
        hasil.append(dict(no=i, teks=teks, A=A, D=D, parts=parts))
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
            w = f"{tmp}/a{r['no']:02d}.wav"
            if r["teks"]:
                sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{base}/suara/b{r['no']:02d}.mp3", "-af", f"adelay={int(LEAD*1000)}:all=1,apad", "-t", f"{r['D']:.3f}", "-ar", "48000", "-ac", "2", w)
            else:
                sh("ffmpeg", "-loglevel", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", f"{r['D']:.3f}", w)
            fh.write(f"file '{w}'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{tmp}/audio.txt", "-c:a", "pcm_s16le", f"{tmp}/audio.wav")
    sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{tmp}/video.mp4", "-i", f"{tmp}/audio.wav", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", f"{base}/{kode}.mp4")
    # srt relatif bab
    srt = []; t = kartu
    for r in R:
        if r["teks"]:
            kal = [s.strip() for s in re.split(r"(?<=[.!?])\s+", r["teks"]) if s.strip()]; tl = sum(len(s) for s in kal); t0 = t + LEAD
            for s in kal: d = r["A"] * len(s) / tl; srt.append((t0, t0 + d - 0.05, s)); t0 += d
        t += r["D"]
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
