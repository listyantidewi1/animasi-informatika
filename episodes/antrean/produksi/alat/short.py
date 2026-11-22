"""Short vertikal 1080x1920 dari segmen Cek kerjaan AI di video bab (tanpa suara baru): python3 short.py A05"""
import sys, json, glob, subprocess, os
from PIL import Image, ImageDraw, ImageFont
B = "/home/user/antre"; ep = sys.argv[1]; OUT = f"{B}/akhir/short"; os.makedirs(OUT, exist_ok=True)
KAIT = {"A00": "AI membuat aplikasi antrean dalam semenit. Lalu dua puluh orang mengambil nomor bersamaan…",
 "A01": "Spesifikasi dari AI ini kelihatan lengkap. Apa yang terlewat?", "A02": "Skema database dari AI ini punya satu kolom berbahaya. Kamu lihat?",
 "A03": "Query rata-rata dari AI ini berjalan dan angkanya masuk akal. Tapi…", "A04": "Endpoint dari AI ini menjawab 200 OK. Apa masalahnya?",
 "A05": "API ambil nomor dari AI ini rapi. Kenapa nomornya bisa kembar?", "A06": "Fitur panggil antrean \"yang aman\" dari AI. Benarkah aman?",
 "A07": "Booking dengan kuota dari AI: logikanya benar, tapi slotnya tetap kelebihan.", "A08": "Halaman tiket dari AI: coba ganti satu angka di alamatnya…",
 "A09": "Layar TV dari AI terasa seketika. Berapa harganya untuk server?", "A10": "Satu baris innerHTML dari AI bisa membuat layar TV menulis BENGKEL TUTUP.",
 "A11": "Test dari AI ini selalu hijau. Justru itu masalahnya.", "A12": "Deploy dari AI: semuanya menyala. Tapi ada dua masalah."}
naskah = json.load(open(f"{B}/naskah_{ep}.json"))
if ep == "A00": beats = [2, 3]
else:
    cek = [b["no"] for b in naskah if b["teks"].startswith("Cek kerjaan AI") or b["teks"].startswith("Saatnya cek kerjaan AI")][0]
    beats = list(range(cek, len(naskah)))  # sampai sebelum beat terakhir (commit/penutup)
    if ep == "A12": beats = [11, 12, 13]
waktu = {w["no"]: w for w in json.load(open(f"{B}/{ep}/waktu.json"))}
a = waktu[beats[0]]["mulai"]; b = waktu[beats[-1]]["mulai"] + waktu[beats[-1]]["D"]
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
d.text((540, 1708), "Video lengkap: Sistem Antrean dari Nol", font=fc, fill=(163, 230, 53), anchor="mm")
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
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", vid, "-loop", "1", "-i", f"/tmp/claude-0/short_{ep}.png",
  "-filter_complex", f"[1]trim=duration={b - a:.3f}[bg];[0:v]scale=1080:608[v];[bg][v]overlay=0:{560 if len(bungkus(KAIT[ep], fk, 960)) < 4 else 620},ass=/tmp/claude-0/short_{ep}.ass,format=yuv420p[o]",
  "-map", "[o]", "-map", "0:a", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-c:a", "aac", "-b:a", "160k", "-r", "30", keluar], check=True)
print(keluar, round(b - a, 1))
