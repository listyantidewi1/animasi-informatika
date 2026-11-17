"""Short vertikal 1080x1920 seri Git: potongan video episode (per kalimat, sinkron) + kait di atas + teks kalimat + ajakan.
python3 short_git.py G01 [G02 ...]"""
import os, sys, json, re, subprocess, urllib.request
sys.path.insert(0, "/home/user/git-seri/prod")
from PIL import Image, ImageDraw, ImageFont
import rakit_git as R, rencana_git as RC
FB = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"
KUNING = (255, 176, 32); ROOT = R.ROOT
from short_git_isi import SH

def sh(*a): subprocess.run(a, check=True)
def wrap(d, s, f, w):
    out, line = [], ""
    for x in s.split():
        t = (line + " " + x).strip()
        if d.textlength(t, font=f) > w and line: out.append(line); line = x
        else: line = t
    out.append(line); return out
def latar(path, kait=None):
    im = Image.new("RGB", (1080, 1920)); d = ImageDraw.Draw(im)
    for y in range(1920):
        k = y / 1920; d.line([(0, y), (1080, y)], fill=(int(18 + 9 * k), int(24 + 12 * k), int(41 + 23 * k)))
    for gx in range(30, 1080, 44):
        for gy in range(30, 1920, 44): d.point((gx, gy), fill=(40, 47, 70))
    if kait:
        f = ImageFont.truetype(FB, 68); L = wrap(d, kait, f, 900); lh = 84
        d.rounded_rectangle([60, 90, 1020, 90 + 44 + lh * len(L)], 32, fill=KUNING)
        for i, l in enumerate(L): d.text((540, 112 + i * lh + lh // 2), l, font=f, fill=(20, 24, 38), anchor="mm")
    im.save(path); return im
def caption(teks, path):
    im = Image.new("RGBA", (1080, 330), (0, 0, 0, 0)); d = ImageDraw.Draw(im); f = ImageFont.truetype(FB, 52)
    L = wrap(d, teks, f, 960); lh = 66; y0 = (330 - lh * len(L)) // 2
    for i, l in enumerate(L): d.text((540, y0 + i * lh + lh // 2), l, font=f, fill=(255, 255, 255), anchor="mm", stroke_width=5, stroke_fill=(10, 14, 28))
    im.save(path)
def srt(kode):
    f = [x for x in os.listdir(f"{ROOT}/{kode}") if x.endswith(".srt") and "_Short" not in x][0]
    out = []
    for blk in open(f"{ROOT}/{kode}/{f}").read().strip().split("\n\n"):
        L = blk.split("\n"); a = L[1].split(" --> ")[0]; h, m, s = a.replace(",", ".").split(":")
        out.append((int(h) * 3600 + int(m) * 60 + float(s), " ".join(L[2:])))
    return out
def cari(kode, frasa):
    for t, s in srt(kode):
        if frasa.lower() in s.lower(): return t
    raise SystemExit(f"frasa tidak ditemukan di {kode}: {frasa}")
def video_ep(kode): return [f"{ROOT}/{kode}/{x}" for x in os.listdir(f"{ROOT}/{kode}") if x.endswith(".mp4") and x.startswith(kode) and "_Short" not in x][0]
TOP = 360
def vis(kode, spec, kait, D, out, tag, OUT):
    bg = f"{OUT}/bg{tag}.png"
    if spec is None:  # kartu ajakan
        im = latar(bg); d = ImageDraw.Draw(im)
        d.text((540, 600), "Episode lengkap", font=ImageFont.truetype(FB, 50), fill=KUNING, anchor="mm")
        f = ImageFont.truetype(FB, 80); y = 720
        for l in wrap(d, RC.JUDUL[kode], f, 940): d.text((540, y), l, font=f, fill=(255, 255, 255), anchor="mm"); y += 100
        d.text((540, y + 40), f"Seri Git dan Kerja Tim · {kode}", font=ImageFont.truetype(FB, 40), fill=(190, 200, 225), anchor="mm")
        d.text((540, y + 150), "@iTeachSWE", font=ImageFont.truetype(FB, 56), fill=KUNING, anchor="mm"); im.save(bg)
        sh("ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-i", bg, "-t", f"{D:.3f}", "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out); return
    if spec[0] == "rek":  # rekaman mentah 2560x1440: ("rek", src, tanda_a, tanda_b, crop)
        _, src, ta, tb, cr = spec; cx, cy, cw, ch = R.CROP[cr] if isinstance(cr, str) else cr
        t0 = R.waktu(src, ta); t1 = R.waktu(src, tb); sp = max(1.0, (t1 - t0) / D); inp = f"{R.RAW}/{src}.mkv"; lim = ["-t", f"{t1 - t0:.3f}"]
    else:  # video episode 1920x1080: (frasa_srt, geser, crop)
        frasa, dt, (cx, cy, cw, ch) = spec[:3]; sp = 1.0; t0 = cari(kode, frasa) + dt; inp = video_ep(kode); lim = []
    w = 1000; h = int(round(ch * w / cw / 2)) * 2
    if h > 1140: h = 1140; w = int(round(cw * h / ch / 2)) * 2
    x = (1080 - w) // 2; y = TOP + (1140 - h) // 2
    im = latar(bg, kait); d = ImageDraw.Draw(im)
    d.rounded_rectangle([x - 12, y - 12, x + w + 12, y + h + 12], 26, fill=(11, 15, 26), outline=(58, 69, 102), width=4); im.save(bg)
    fc = f"[1:v]setpts=(PTS-STARTPTS)/{sp},crop={cw}:{ch}:{cx}:{cy},scale={w}:{h}:flags=lanczos,tpad=stop_mode=clone:stop_duration=60,fps=30[p];[0:v][p]overlay={x}:{y}"
    sh("ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-i", bg, "-ss", f"{t0:.3f}", *lim, "-i", inp, "-filter_complex", fc,
       "-t", f"{D:.3f}", "-r", "30", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out)

def tts(teks, mp3):
    if os.path.exists(mp3): return
    body = {"text": R.tts_teks(teks), "model_id": R.MODEL, "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.0, "speed": 1.0}}
    r = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{R.VID}?output_format=mp3_44100_128",
                               data=json.dumps(body).encode(), headers={"xi-api-key": "dummy", "Content-Type": "application/json"})
    open(mp3, "wb").write(urllib.request.urlopen(r, timeout=180).read()); print("tts", mp3, len(teks), flush=True)

def buat(kode):
    S = SH[kode]; OUT = f"{ROOT}/{kode}/short"; os.makedirs(OUT, exist_ok=True)
    mp3 = f"{OUT}/narasi.mp3"; tts(S["narasi"], mp3)
    kal = R.kalimat(S["narasi"]); A = R.dur(mp3); bt = R.batas_kalimat(mp3, kal, A)
    assert len(S["klip"]) == len(kal), (kode, len(S["klip"]), len(kal))
    LEAD, EKOR, JEDA = 0.3, 1.6, 0.35  # jeda kecil antarkalimat supaya mudah diikuti
    segs, cue, auds, t = [], [], [], 0.0
    for i, k in enumerate(kal):
        a, b = bt[i], bt[i + 1]; pre = LEAD if i == 0 else 0; D = pre + (b - a) + (EKOR if i == len(kal) - 1 else JEDA)
        w = f"{OUT}/a{i}.wav"; sh("ffmpeg", "-loglevel", "error", "-y", "-i", mp3, "-af", f"atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,adelay={int(pre * 1000)}:all=1,apad",
                                 "-t", f"{D:.3f}", "-ar", "48000", "-ac", "2", w); auds.append(w)
        raw = f"{OUT}/v{i}.mp4"; vis(kode, S["klip"][i], S["kait"], D, raw, i, OUT)
        p = f"{OUT}/cap{i}.png"; caption(k, p); seg = f"{OUT}/seg{i}.mp4"
        sh("ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-i", p, "-filter_complex", "[0:v][1:v]overlay=0:1540", "-t", f"{D:.3f}", "-r", "30",
           "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", seg); segs.append(seg)
        cue.append((t + pre, t + pre + (b - a), k)); t += D
    with open(f"{OUT}/v.txt", "w") as f: f.writelines(f"file '{x}'\n" for x in segs)
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{OUT}/v.txt", "-c", "copy", f"{OUT}/v.mp4")
    tot = R.dur(f"{OUT}/v.mp4")
    with open(f"{OUT}/a.txt", "w") as f: f.writelines(f"file '{x}'\n" for x in auds)
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{OUT}/a.txt", "-af", "loudnorm=I=-15:TP=-1.5", "-t", f"{tot:.3f}", "-ar", "48000", "-ac", "2", f"{OUT}/a.wav")
    nama = os.path.basename(video_ep(kode))[:-4] + "_Short"
    out = f"{ROOT}/{kode}/{nama}.mp4"
    sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{OUT}/v.mp4", "-i", f"{OUT}/a.wav", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out)
    with open(out[:-4] + ".srt", "w") as f:
        for j, (a, b, k) in enumerate(cue): f.write(f"{j + 1}\n{R.ts(a)} --> {R.ts(b)}\n{k}\n\n")
    print("SHORT", out, R.dur(out), flush=True)
if __name__ == "__main__":
    for k in sys.argv[1:]: buat(k)
