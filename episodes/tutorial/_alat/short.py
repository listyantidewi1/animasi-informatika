"""Short vertikal 1080x1920 dari potongan episode + narasi Short. Spesifikasi: SHORT di Txx/spec.py
SHORT = {"judul": "...", "beats": [{"teks": "...", "dari": (beat_no, detik_ke, "kiri"|"tengah")}]}"""
import json, os, sys, subprocess, importlib.util, urllib.request, time, re
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(__file__))
from suara import tts_teks as _tt, VID, MODEL
from lafal import lafal
def tts_teks(t): return _tt(lafal(t))
FB = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"
if not os.path.exists(FB): FB = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
def sh(*a): subprocess.run(a, check=True)
def durf(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
def tts(teks, out, prev=None, nxt=None):
    if os.path.exists(out): return
    body = {"text": tts_teks(teks), "model_id": MODEL, "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.0, "speed": 1.0}}
    if prev: body["previous_text"] = tts_teks(prev)
    if nxt: body["next_text"] = tts_teks(nxt)
    for k in range(4):
        try:
            r = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VID}?output_format=mp3_44100_128", data=json.dumps(body).encode(),
                                       headers={"xi-api-key": "dummy", "Content-Type": "application/json"})
            open(out, "wb").write(urllib.request.urlopen(r, timeout=120).read()); return
        except Exception as e: print("ulang", e); time.sleep(3 * (k + 1))
def wrap(d, s, f, w):
    out, line = [], ""
    for x in s.split():
        t = (line + " " + x).strip()
        if d.textlength(t, font=f) > w and line: out.append(line); line = x
        else: line = t
    out.append(line); return out
def png_teks(s, out, size, warna=(255, 255, 255), lebar=960, bg=None):
    f = ImageFont.truetype(FB, size); im = Image.new("RGBA", (1080, 700), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    lines = wrap(d, s, f, lebar); lh = int(size * 1.22); h = lh * len(lines) + 40
    if bg: d.rounded_rectangle([540 - lebar // 2 - 30, 0, 540 + lebar // 2 + 30, h], 28, fill=bg)
    for i, l in enumerate(lines):
        y = 20 + i * lh
        d.text((540, y + lh // 2), l, font=f, fill=warna, anchor="mm", stroke_width=0 if bg else 5, stroke_fill=(10, 14, 28))
    im.crop((0, 0, 1080, h)).save(out); return h
def main(ep):
    base = f"/home/user/tut/{ep}"; sd = f"{base}/short"; os.makedirs(sd, exist_ok=True)
    spec = importlib.util.spec_from_file_location("spec", f"{base}/spec.py"); S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
    SH = S.SHORT; lama = os.path.exists(f"{base}/lama.mp4") and os.path.exists(f"{base}/waktu_lama.json")
    W = {b["no"]: b for b in json.load(open(f"{base}/waktu_lama.json" if lama else f"{base}/waktu.json"))}; vid = f"{base}/lama.mp4" if lama else f"{base}/{S.NAMA}.mp4"
    B = SH["beats"]
    for i, b in enumerate(B): tts(b["teks"], f"{sd}/s{i+1:02d}.mp3", B[i-1]["teks"] if i else None, B[i+1]["teks"] if i + 1 < len(B) else None)
    hj = png_teks(SH["judul"], f"{sd}/judul.png", 74, (255, 255, 255), 940, bg=(255, 176, 32, 255))
    # judul hitam di atas pita kuning
    im = Image.open(f"{sd}/judul.png"); d = ImageDraw.Draw(im); f = ImageFont.truetype(FB, 74)
    im2 = Image.new("RGBA", im.size, (0, 0, 0, 0)); d2 = ImageDraw.Draw(im2); lines = wrap(d2, SH["judul"], f, 940); lh = int(74 * 1.22)
    d2.rounded_rectangle([540 - 500, 0, 540 + 500, im.size[1]], 28, fill=(255, 176, 32, 255))
    for k, l in enumerate(lines): d2.text((540, 20 + k * lh + lh // 2), l, font=f, fill=(20, 24, 38), anchor="mm")
    im2.save(f"{sd}/judul.png")
    files = []; A = []
    for i, b in enumerate(B):
        mp3 = f"{sd}/s{i+1:02d}.mp3"; da = durf(mp3); D = da + 0.35; A.append((mp3, D))
        no, off, pos = b["dari"]; t0 = W[no]["mulai"] + off
        cap = f"{sd}/cap{i+1:02d}.png"; png_teks(b["teks"], cap, 62, (255, 255, 255), 960)
        sc = 1.3; cw = int(1920 * sc * 1080 / 1920 / 1.0)
        # skala klip ke tinggi 790 (lebar 1404), potong 1080
        x = {"kiri": 0, "tengah": (1404 - 1080) // 2, "kanan": 1404 - 1080}[pos]
        out = f"{sd}/seg{i+1:02d}.mp4"
        fc = (f"[0:v]scale=1404:790,crop=1080:790:{x}:0,setsar=1[v];color=c=0x121829:s=1080x1920:r=30:d={D:.3f}[bg];"
              f"[bg][v]overlay=0:520:shortest=1[a];[a][1:v]overlay=0:150[b];[b][2:v]overlay=0:1390[o]")
        sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t0:.3f}", "-t", f"{D:.3f}", "-i", vid, "-i", f"{sd}/judul.png", "-i", cap,
           "-filter_complex", fc, "-map", "[o]", "-t", f"{D:.3f}", "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", out)
        files.append(out)
    # kartu akhir
    end = f"{sd}/akhir.png"; im = Image.new("RGB", (1080, 1920), (18, 24, 41)); d = ImageDraw.Draw(im)
    f1 = ImageFont.truetype(FB, 46); f2 = ImageFont.truetype(FB, 76)
    d.text((540, 700), "Tutorial lengkap", font=f1, fill=(255, 176, 32), anchor="mm")
    for k, l in enumerate(wrap(d, S.JUDUL_YT, f2, 940)): d.text((540, 800 + k * 92), l, font=f2, fill=(255, 255, 255), anchor="mm")
    d.text((540, 1250), "Playlist: Proyek Pemrograman Sederhana", font=f1, fill=(190, 200, 225), anchor="mm"); im.save(end)
    sh("ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-i", end, "-t", "2.5", "-r", "30", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "19", f"{sd}/akhir.mp4"); files.append(f"{sd}/akhir.mp4")
    with open(f"{sd}/v.txt", "w") as f: f.writelines(f"file '{x}'\n" for x in files)
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{sd}/v.txt", "-c", "copy", f"{sd}/v.mp4")
    with open(f"{sd}/a.txt", "w") as f:
        for k, (mp3, D) in enumerate(A):
            w = f"{sd}/a{k:02d}.wav"; sh("ffmpeg", "-loglevel", "error", "-y", "-i", mp3, "-af", "adelay=150:all=1,apad", "-t", f"{D:.3f}", "-ar", "48000", "-ac", "2", w); f.write(f"file '{w}'\n")
        sh("ffmpeg", "-loglevel", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", "2.5", f"{sd}/sunyi.wav"); f.write(f"file '{sd}/sunyi.wav'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{sd}/a.txt", "-af", "loudnorm=I=-15:TP=-1.5", "-ar", "48000", f"{sd}/a.wav")
    out = f"{base}/{ep}_Short.mp4"
    sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{sd}/v.mp4", "-i", f"{sd}/a.wav", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out)
    print("SHORT", out, durf(out))
if __name__ == "__main__": main(sys.argv[1])
