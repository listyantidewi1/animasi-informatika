# Short vertikal 1080x1920 "Vibe Coding Patungan": bug voucher (nyata, bab V10).
import os, sys, json, subprocess
sys.path.insert(0, "/home/user/vibe/prod")
from PIL import Image, ImageDraw, ImageFont
import rakit as R
OUT = "/home/user/vibe/prod/short"; os.makedirs(OUT, exist_ok=True)
FB = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"
if not os.path.exists(FB): FB = R.FB
FM = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
BG = (18, 24, 41); KUNING = (255, 176, 32)
JUDUL = "AI bikin aplikasi patungan. Di mana salahnya?"

BEATS = [
 ("Saya minta AI membuat aplikasi patungan untuk HP. Semua tesnya lulus, dan hasilnya cocok dengan struk. Lalu saya mengisi voucher sembilan ratus sembilan puluh sembilan ribu. Coba lihat hasilnya, dan cari kesalahannya.",
  [("hpz", "H10b", 1.0, 1.0), ("hpz", "H10b", 1.0, 4.8)]),
 ("Pikirkan dulu sebentar.", [("pikir", "H10b", 6.7)]),
 ("Semua bagian menjadi minus. Andi minus dua ratus lima puluh lima ribu, artinya aplikasi menyuruh Andi membayar teman-temannya. Kalau semua menunya gratis, bagian Andi malah menjadi minus tak hingga.",
  [("hpz", "H10b", 6.7, 6.7), ("hpz", "H10b", 17.0, 19.2)]),
 ("Yang paling menarik, AI sudah memperingatkan masalah ini sejak awal. Di laporannya ada tulisan: voucher yang lebih besar dari subtotal belum dicek. Peringatannya ada, tetapi tidak ada yang menindaklanjutinya.",
  [("kutip",)]),
 ("Jadi saya menulis tesnya dulu sampai merah, lalu meminta AI memperbaikinya. Sekarang ada dua puluh delapan tes yang lulus, dan voucher yang kebesaran menghasilkan nol untuk semua orang.",
  [("tes", 0.35), ("hpz", "H10c", 1.0, 10.99)]),
 ("Cara lengkap membuat aplikasi ini dengan AI, dari folder kosong sampai terpasang di HP, ada di video lengkapnya.",
  [("akhir",)]),
]

def sh(*a): subprocess.run(a, check=True)
def wrap(d, s, f, w):
    out, line = [], ""
    for x in s.split():
        t = (line + " " + x).strip()
        if d.textlength(t, font=f) > w and line: out.append(line); line = x
        else: line = t
    out.append(line); return out

def latar(path, judul=True):
    im = Image.new("RGB", (1080, 1920)); d = ImageDraw.Draw(im)
    for y in range(1920):
        k = y / 1920; d.line([(0, y), (1080, y)], fill=(int(18 + 9 * k), int(24 + 12 * k), int(41 + 23 * k)))
    for gx in range(30, 1080, 44):
        for gy in range(30, 1920, 44): d.point((gx, gy), fill=(40, 47, 70))
    if judul:
        f = ImageFont.truetype(FB, 64); L = wrap(d, JUDUL, f, 900); lh = 78
        d.rounded_rectangle([60, 70, 1020, 70 + 40 + lh * len(L)], 30, fill=KUNING)
        for i, l in enumerate(L): d.text((540, 90 + i * lh + lh // 2), l, font=f, fill=(20, 24, 38), anchor="mm")
    im.save(path); return im

def caption(teks, path):
    im = Image.new("RGBA", (1080, 330), (0, 0, 0, 0)); d = ImageDraw.Draw(im); f = ImageFont.truetype(FB, 54)
    L = wrap(d, teks, f, 960); lh = 68; y0 = (330 - lh * len(L)) // 2
    for i, l in enumerate(L): d.text((540, y0 + i * lh + lh // 2), l, font=f, fill=(255, 255, 255), anchor="mm", stroke_width=5, stroke_fill=(10, 14, 28))
    im.save(path)

ZW, ZH, ZX, ZY = 900, 1165, 90, 360; ZC = "crop=1020:1320:90:600"
PH, PW = 1180, int(round(1236 * 1180 / 2748 / 2)) * 2; PX, PY = (1080 - PW) // 2, 330
def bingkai(path):
    im = latar(path); d = ImageDraw.Draw(im)
    d.rounded_rectangle([PX - 18, PY - 18, PX + PW + 18, PY + PH + 18], 46, fill=(11, 15, 26), outline=(58, 69, 102), width=4); im.save(path)

def vis(v, D, out, i):
    bg = f"{OUT}/bg{i}.png"
    if v[0] in ("hpz", "pikir"):
        im = latar(bg); d = ImageDraw.Draw(im); d.rounded_rectangle([ZX - 14, ZY - 14, ZX + ZW + 14, ZY + ZH + 14], 30, fill=(11, 15, 26), outline=(58, 69, 102), width=4)
        d.rounded_rectangle([ZX + 20, ZY - 74, ZX + 230, ZY - 26], 24, fill=KUNING); d.text((ZX + 125, ZY - 50), "DI HP", font=ImageFont.truetype(FB, 30), fill=(20, 24, 38), anchor="mm"); im.save(bg)
        if v[0] == "hpz":
            _, src, a, b = v; sp = max(1.0, (b - a) / D)
            inp = ["-ss", f"{a:.3f}", "-to", f"{max(b, a + 0.1):.3f}", "-i", f"{R.RAW}/{src}.mkv"]
            fc = f"[1:v]setpts=(PTS-STARTPTS)/{sp},fps=30,{ZC},scale={ZW}:{ZH}:flags=lanczos,tpad=stop_mode=clone:stop_duration=60[p];[0:v][p]overlay={ZX}:{ZY}"
        else:
            _, src, t = v; png = f"{OUT}/pikir.png"
            im = Image.new("RGBA", (700, 170), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
            d.rounded_rectangle([0, 0, 700, 170], 40, fill=(255, 176, 32, 245)); d.text((350, 85), "Pikirkan dulu…", font=ImageFont.truetype(FB, 76), fill=(20, 24, 38), anchor="mm"); im.save(png)
            inp = ["-ss", f"{t:.3f}", "-i", f"{R.RAW}/{src}.mkv", "-loop", "1", "-i", png]
            fc = f"[1:v]trim=end_frame=1,{ZC},scale={ZW}:{ZH}:flags=lanczos,tpad=stop_mode=clone:stop_duration=60,fps=30[p];[0:v][p]overlay={ZX}:{ZY}[q];[q][2:v]overlay=190:{ZY + 120}"
        sh("ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-i", bg, *inp, "-filter_complex", fc, "-t", f"{D:.3f}", "-r", "30", "-an",
           "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out); return
    if v[0] in ("hp",):
        bingkai(bg)
        if v[0] == "hp":
            _, src, a, b = v; sp = max(1.0, (b - a) / D)
            inp = ["-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", f"{R.RAW}/{src}.mkv"]
            fc = f"[1:v]setpts=(PTS-STARTPTS)/{sp},fps=30,scale={PW}:{PH}:flags=lanczos,tpad=stop_mode=clone:stop_duration=60[p];[0:v][p]overlay={PX}:{PY}"
        else:
            _, src, t = v; png = f"{OUT}/pikir.png"
            im = Image.new("RGBA", (700, 170), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
            d.rounded_rectangle([0, 0, 700, 170], 40, fill=(255, 176, 32, 245)); d.text((350, 85), "Pikirkan dulu…", font=ImageFont.truetype(FB, 76), fill=(20, 24, 38), anchor="mm"); im.save(png)
            inp = ["-ss", f"{t:.3f}", "-i", f"{R.RAW}/{src}.mkv", "-loop", "1", "-i", png]
            fc = f"[1:v]trim=end_frame=1,scale={PW}:{PH}:flags=lanczos,tpad=stop_mode=clone:stop_duration=60,fps=30[p];[0:v][p]overlay={PX}:{PY}[q];[q][2:v]overlay=190:{PY + PH // 2 - 85}"
        sh("ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-i", bg, *inp, "-filter_complex", fc, "-t", f"{D:.3f}", "-r", "30", "-an",
           "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out); return
    im = latar(bg); d = ImageDraw.Draw(im)
    if v[0] == "kutip":
        # potongan asli laporan AI (V05a, akhir vitest2) + teks yang sama diperbesar
        sh("ffmpeg", "-loglevel", "error", "-y", "-ss", "140.2", "-i", f"{R.RAW}/V05a.mkv", "-frames:v", "1", "-vf", "crop=1260:160:1300:450", f"{OUT}/kutip_src.png")
        fr = Image.open(f"{OUT}/kutip_src.png").convert("RGB").resize((1000, 127)); im.paste(fr, (40, 360))
        d.rounded_rectangle([36, 356, 1044, 491], 10, outline=(58, 69, 102), width=3)
        d.text((60, 520), "Laporan AI di bab logika inti (asli):", font=ImageFont.truetype(FB, 40), fill=(170, 180, 205))
        d.rounded_rectangle([40, 590, 1040, 1300], 30, fill=(28, 28, 30))
        fm = ImageFont.truetype(FM, 46); y = 630
        d.text((80, y), "Belum ditangani", font=ImageFont.truetype(FB, 52), fill=(255, 255, 255)); y += 90
        for s, warna in [("- Subtotal 0 atau menu tanpa pemakan akan menghasilkan pembagian dengan nol.", (238, 242, 251)),
                         ("- Voucher yang lebih besar dari subtotal belum dicek.", KUNING)]:
            for l in wrap(d, s, fm, 880): d.text((80, y), l, font=fm, fill=warna); y += 60
            y += 30
        d.rounded_rectangle([60, 1350, 1020, 1470], 26, fill=(220, 60, 60))
        d.text((540, 1410), "Peringatan ada, tidak dibaca", font=ImageFont.truetype(FB, 54), fill=(255, 255, 255), anchor="mm")
    elif v[0] == "tes":
        sh("ffmpeg", "-loglevel", "error", "-y", "-ss", "93.5", "-i", f"{R.RAW}/V10a.mkv", "-frames:v", "1", "-vf", "crop=560:80:1400:1530", f"{OUT}/tes_src.png")
        fr = Image.open(f"{OUT}/tes_src.png").convert("RGB").resize((1000, 143)); d.rounded_rectangle([30, 640, 1050, 803], 16, fill=(28, 28, 30)); im.paste(fr, (40, 650))
        d.text((540, 560), "Setelah diperbaiki", font=ImageFont.truetype(FB, 60), fill=(45, 212, 160), anchor="mm")
        d.text((540, 900), "Voucher paling besar = subtotal", font=ImageFont.truetype(FB, 48), fill=(238, 242, 251), anchor="mm")
        d.text((540, 970), "Subtotal nol = bagian nol", font=ImageFont.truetype(FB, 48), fill=(238, 242, 251), anchor="mm")
    elif v[0] == "akhir":
        im = latar(bg, judul=False); d = ImageDraw.Draw(im)
        d.text((540, 640), "Video lengkap", font=ImageFont.truetype(FB, 50), fill=KUNING, anchor="mm")
        f = ImageFont.truetype(FB, 92); y = 760
        for l in ["Vibe Coding", "Aplikasi HP", "dari Nol"]: d.text((540, y), l, font=f, fill=(255, 255, 255), anchor="mm"); y += 110
        d.text((540, 1150), "Dari folder kosong sampai terpasang di HP", font=ImageFont.truetype(FB, 40), fill=(190, 200, 225), anchor="mm")
        d.text((540, 1260), "@iTeachSWE", font=ImageFont.truetype(FB, 56), fill=KUNING, anchor="mm")
    im.save(bg)
    sh("ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-i", bg, "-t", f"{D:.3f}", "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out)

def main():
    teks = [t for t, _ in BEATS]
    # TTS (pakai fungsi yang sama dengan video utama)
    for i, t in enumerate(teks):
        mp3 = f"{OUT}/s{i:02d}.mp3"
        if os.path.exists(mp3): continue
        import urllib.request
        body = {"text": R.tts_teks(t), "model_id": R.MODEL, "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.0, "speed": 1.0}}
        if i: body["previous_text"] = R.tts_teks(teks[i - 1])
        if i + 1 < len(teks): body["next_text"] = R.tts_teks(teks[i + 1])
        r = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{R.VID}?output_format=mp3_44100_128",
                                   data=json.dumps(body).encode(), headers={"xi-api-key": "dummy", "Content-Type": "application/json"})
        open(mp3, "wb").write(urllib.request.urlopen(r, timeout=180).read()); print("tts", i)
    segs, auds = [], []
    for i, (t, vs) in enumerate(BEATS):
        mp3 = f"{OUT}/s{i:02d}.mp3"; da = R.dur(mp3); D = da + 0.4 + (1.6 if i == 1 else 0) + (1.0 if i == len(BEATS) - 1 else 0)
        # bagi durasi antar visual
        ds = []
        fix = [v for v in vs if v[0] == "tes"]
        if fix: ds = [D * fix[0][1], D * (1 - fix[0][1])]
        elif len(vs) == 2: ds = [D * 0.55, D * 0.45]
        else: ds = [D]
        vids = []
        for j, (v, dv) in enumerate(zip(vs, ds)):
            o = f"{OUT}/v{i}_{j}.mp4"; vis(v, dv, o, f"{i}_{j}"); vids.append(o)
        # caption per kalimat, waktu sebanding jumlah huruf
        kal = [k.strip() + "." for k in t.replace("?", ".").split(".") if k.strip()] if i != 1 else []
        with open(f"{OUT}/c{i}.txt", "w") as f: f.writelines(f"file '{x}'\n" for x in vids)
        raw = f"{OUT}/r{i}.mp4"; sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{OUT}/c{i}.txt", "-c", "copy", raw)
        seg = f"{OUT}/seg{i}.mp4"
        if kal:
            tot = sum(len(k) for k in kal); t0 = 0.15; ins, fc, last = [], [], "0:v"
            for k, s in enumerate(kal):
                p = f"{OUT}/cap{i}_{k}.png"; caption(s, p); ins += ["-i", p]
                t1 = t0 + da * len(s) / tot if k < len(kal) - 1 else D
                fc.append(f"[{last}][{k + 1}:v]overlay=0:1560:enable='between(t,{t0:.2f},{t1:.2f})'[o{k}]"); last = f"o{k}"; t0 = t1
            sh("ffmpeg", "-loglevel", "error", "-y", "-i", raw, *ins, "-filter_complex", ";".join(fc), "-map", f"[{last}]", "-t", f"{D:.3f}", "-r", "30",
               "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", seg)
        else: os.replace(raw, seg)
        segs.append(seg)
        w = f"{OUT}/a{i}.wav"; sh("ffmpeg", "-loglevel", "error", "-y", "-i", mp3, "-af", "adelay=150:all=1,apad", "-t", f"{D:.3f}", "-ar", "48000", "-ac", "2", w); auds.append(w)
    with open(f"{OUT}/v.txt", "w") as f: f.writelines(f"file '{x}'\n" for x in segs)
    with open(f"{OUT}/a.txt", "w") as f: f.writelines(f"file '{x}'\n" for x in auds)
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{OUT}/v.txt", "-c", "copy", f"{OUT}/v.mp4")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{OUT}/a.txt", "-af", "loudnorm=I=-15:TP=-1.5", "-ar", "48000", f"{OUT}/a.wav")
    out = "/home/user/vibe/prod/Vibe_Coding_Patungan_Short.mp4"
    sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{OUT}/v.mp4", "-i", f"{OUT}/a.wav", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out)
    print("SHORT", out, R.dur(out))
if __name__ == "__main__": main()
