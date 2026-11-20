"""Short vertikal 1080x1920 dari segmen Cek kerjaan AI di video bab (tanpa suara baru): python3 short.py A05"""
import sys, json, glob, subprocess, os
from PIL import Image, ImageDraw, ImageFont
B = "/home/user/parkir"; ep = sys.argv[1]; OUT = f"{B}/akhir/short"; os.makedirs(OUT, exist_ok=True)
KAIT = {"P00": "Aplikasi parkir ini dibuat AI dan berjalan lancar. Coba lihat jam di tiketnya…",
 "P07": "Rumus tarif parkir dari AI. Berapa yang harus dibayar untuk parkir tepat 60 menit?",
 "P08": "AI diminta mencegah kendaraan masuk dua kali. Kapan kode ini gagal?",
 "P09": "Halaman struk buatan AI. Apa yang bisa dilakukan petugas yang tidak jujur?",
 "P10": "Rekap pendapatan dari AI kehilangan Rp177.000. Penyebabnya satu kata di query."}
naskah = json.load(open(f"{B}/naskah_{ep}.json")); nas = {b["no"]: b["teks"] for b in naskah}
waktu = {w["no"]: w for w in json.load(open(f"{B}/{ep}/waktu.json"))}
if ep == "P00":
    beats = [3, 4]
    a = waktu[beats[0]]["mulai"]; b = waktu[beats[-1]]["mulai"] + waktu[beats[-1]]["D"]
else:  # beat pertanyaan + jawaban di beat berikutnya, berhenti sebelum kalimat commit atau tantangan
    import re as _re
    cek = [x["no"] for x in naskah if x["teks"].startswith("Cek kerjaan AI")][0]; j = cek + 1
    kal = [x.strip() for x in _re.split(r"(?<=[.!?])\s+", nas[j]) if x.strip()]; k = [i for i, x in enumerate(kal) if x.startswith(("Commit", "Simpan", "Kita simpan", "Tantanganmu"))]
    a = waktu[cek]["mulai"]; b = waktu[j]["mulai"] + (waktu[j]["kalT"][k[0]] - 0.3 if k else waktu[j]["D"])
vid = [f for f in glob.glob(f"{B}/{ep}/{ep}_*.mp4")][0]; srt = vid[:-4] + ".srt"
# teks atas dan bawah
F = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"; FB = "/usr/share/fonts/opentype/inter/Inter-Black.otf"
img = Image.new("RGBA", (1080, 1920), (14, 20, 36, 255)); d = ImageDraw.Draw(img)
def bungkus(teks, font, lebar):
    kata, baris, cur = teks.split(), [], ""
    for k in kata:
        uji = (cur + " " + k).strip()
        if d.textlength(uji, font=font) > lebar: baris.append(cur); cur = k
        else: cur = uji
    return baris + [cur]
d.rounded_rectangle([60, 150, 400, 220], 35, fill=(244, 114, 182)); d.text((230, 185), "Cek kerjaan AI", font=ImageFont.truetype(F, 34), fill=(14, 20, 36), anchor="mm")
fk = ImageFont.truetype(FB, 62); y = 270
for s in bungkus(KAIT[ep], fk, 960): d.text((60, y), s, font=fk, fill=(255, 255, 255)); y += 78
fc = ImageFont.truetype(F, 34)
d.rounded_rectangle([60, 1660, 1020, 1800], 26, outline=(163, 230, 53), width=4)
d.text((540, 1708), "Video lengkap: Aplikasi Parkir dari Nol", font=fc, fill=(163, 230, 53), anchor="mm")
d.text((540, 1756), "@iTeachSWE · tautan di komentar", font=ImageFont.truetype(F, 28), fill=(203, 213, 225), anchor="mm")
img.save(f"/tmp/claude-0/short_{ep}.png")
# subtitle dipotong ke rentang beat, gaya besar di bawah video
def t(s): h, m, r = s.split(":"); x, ms = r.split(","); return int(h) * 3600 + int(m) * 60 + int(x) + int(ms) / 1000
def ass_t(s): s = max(0, s); h = int(s // 3600); m = int(s % 3600 // 60); return f"{h}:{m:02d}:{s % 60:05.2f}"
ev = []
for blok in open(srt).read().strip().split("\n\n"):
    bar = blok.split("\n"); x, y2 = [t(v.strip()) for v in bar[1].split("-->")]
    if y2 <= a or x >= b: continue
    ev.append(f"Dialogue: 0,{ass_t(x - a)},{ass_t(y2 - a)},S,,0,0,0,,{' '.join(bar[2:])}")
open(f"/tmp/claude-0/short_{ep}.ass", "w").write(f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: S,Inter,58,&H00FFFFFF,&H00FFFFFF,&H00241410,&H00000000,1,0,0,0,100,100,0,0,1,4,0,8,70,70,1290,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""" + "\n".join(ev) + "\n")
keluar = f"{OUT}/{ep}_short.mp4"
# kartu penutup dengan ajakan lisan (suara Cahaya, dibuat sekali: akhir/short/ajakan.mp3)
AJ = f"{OUT}/ajakan.mp3"
if not os.path.exists(AJ):
    import urllib.request
    r = urllib.request.Request("https://api.elevenlabs.io/v1/text-to-speech/iWydkXKoiVtvdn4vLKp9?output_format=mp3_44100_128", headers={"xi-api-key": "dummy", "Content-Type": "application/json"},
        data=json.dumps({"text": "Video lengkapnya ada di kanal ini. Kita membangun aplikasi parkir ini dari nol, sampai online. Tonton dari awal, ya!", "model_id": "eleven_v4_turbo", "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.0, "speed": 1.0}}).encode())
    open(AJ, "wb").write(urllib.request.urlopen(r, timeout=180).read())
dj = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", AJ], capture_output=True, text=True).stdout) + 0.8
kp = Image.new("RGB", (1080, 1920), (14, 20, 36)); d2 = ImageDraw.Draw(kp)
d2.text((540, 560), "Tonton video lengkapnya", font=ImageFont.truetype(F, 46), fill=(203, 213, 225), anchor="mm")
y = 700
for s2 in ["APLIKASI PARKIR", "DARI NOL"]: d2.text((540, y), s2, font=ImageFont.truetype(FB, 104), fill=(255, 255, 255) if y == 700 else (255, 176, 32), anchor="mm"); y += 130
d2.rounded_rectangle([290, 930, 790, 1030], 50, fill=(96, 165, 250)); d2.text((540, 980), "Laravel + MySQL", font=ImageFont.truetype(FB, 48), fill=(14, 20, 36), anchor="mm")
d2.text((540, 1150), "dari folder kosong sampai online", font=ImageFont.truetype(F, 40), fill=(203, 213, 225), anchor="mm")
d2.rounded_rectangle([190, 1320, 890, 1440], 30, outline=(163, 230, 53), width=5); d2.text((540, 1380), "@iTeachSWE", font=ImageFont.truetype(FB, 56), fill=(163, 230, 53), anchor="mm")
d2.text((540, 1500), "tautan video ada di komentar", font=ImageFont.truetype(F, 32), fill=(148, 163, 184), anchor="mm")
kp.save(f"/tmp/claude-0/short_{ep}_akhir.png")
L = b - a
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{a:.3f}", "-t", f"{L:.3f}", "-i", vid, "-loop", "1", "-t", f"{L:.3f}", "-i", f"/tmp/claude-0/short_{ep}.png",
  "-loop", "1", "-t", f"{dj:.3f}", "-i", f"/tmp/claude-0/short_{ep}_akhir.png", "-i", AJ,
  "-filter_complex", f"[0:v]scale=1080:608[v];[1:v][v]overlay=0:{560 if len(bungkus(KAIT[ep], fk, 960)) < 4 else 620},ass=/tmp/claude-0/short_{ep}.ass,fps=30,format=yuv420p,setsar=1[m];[2:v]fps=30,format=yuv420p,setsar=1,fade=in:0:8[k];"
                     f"[0:a]aresample=44100,aformat=channel_layouts=stereo,afade=out:st={L - 0.15:.3f}:d=0.15[am];[3:a]aresample=44100,aformat=channel_layouts=stereo,adelay=300|300,apad=whole_dur={dj:.3f}[ak];[m][am][k][ak]concat=n=2:v=1:a=1[o][oa]",
  "-map", "[o]", "-map", "[oa]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-c:a", "aac", "-b:a", "160k", "-r", "30", keluar], check=True)
print(keluar, round(L + dj, 1))
