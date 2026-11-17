"""Thumbnail 1280x720 seri Git: potongan layar asli (output yang menarik) + judul besar."""
import os, subprocess, sys
sys.path.insert(0, "/home/user/git-seri/prod")
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import rakit_git as R
FB = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"
KUNING = (255, 176, 32)
T = {  # kode: (src, tanda, crop, [baris judul (teks, warna, ukuran)], sorot (x0,y0,x1,y1) dalam koordinat crop atau None)
 "G01": ("G01", "env_selesai-0.3", (400, 55, 720, 110), [("GIT", (255, 255, 255), 130), ("DARI NOL", KUNING, 104), ("commit pertamamu", (255, 255, 255), 54)], (4, 54, 716, 104)),
 "G02": ("G02", "reflog_selesai-0.3", (380, 718, 1220, 686), [("KERJAAN", (255, 255, 255), 104), ("HILANG?", KUNING, 116), ("selamatkan dengan reflog", (255, 255, 255), 46)], None),
 "G03": ("G03", "commit2+4", (1600, 0, 960, 820), [("BRANCH", KUNING, 120), ("bukan salinan", (255, 255, 255), 64), ("folder", (255, 255, 255), 64)], None),
 "G04": ("G04", "baca_selesai-0.3", (380, 60, 1220, 620), [("MERGE", (255, 255, 255), 120), ("CONFLICT", (255, 90, 90), 108), ("jangan panik", (255, 255, 255), 56)], None),
 "G05": ("G05", "ditolak+0.8", (30, 690, 1190, 392), [("PUSH", (255, 255, 255), 130), ("DITOLAK?", (255, 90, 90), 108), ("jangan --force dulu", (255, 255, 255), 48)], None),
 "G06": ("G06", "tebak", (0, 630, 1220, 680), [("ALUR GIT", (255, 255, 255), 112), ("TIM", KUNING, 130), ("stash, rebase, tag", (255, 255, 255), 50)], None),
}
def buat(kode):
    src, tanda, (cx, cy, cw, ch), judul, sorot = T[kode]
    t = R.waktu(src, tanda); png = f"/tmp/th_{kode}.png"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", f"{R.RAW}/{src}.mkv", "-frames:v", "1", "-vf", f"crop={cw}:{ch}:{cx}:{cy}", png], check=True)
    im = Image.new("RGB", (1280, 720)); d = ImageDraw.Draw(im)
    for y in range(720):
        k = y / 720; d.line([(0, y), (1280, y)], fill=(int(18 + 9 * k), int(24 + 12 * k), int(41 + 23 * k)))
    for x in range(30, 1280, 36):
        for y in range(30, 720, 36): d.point((x, y), fill=(40, 48, 74))
    fr = Image.open(png).convert("RGB"); maxw, maxh = 700, 600
    k = min(maxw / fr.width, maxh / fr.height); fr = fr.resize((int(fr.width * k), int(fr.height * k)), Image.LANCZOS)
    x0 = 1280 - fr.width - 40; y0 = (720 - fr.height) // 2
    sh = Image.new("RGBA", (fr.width + 80, fr.height + 80), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle([40, 48, fr.width + 40, fr.height + 48], 24, fill=(0, 0, 0, 180)); sh = sh.filter(ImageFilter.GaussianBlur(14))
    im.paste(sh, (x0 - 40, y0 - 40), sh)
    d.rounded_rectangle([x0 - 12, y0 - 12, x0 + fr.width + 12, y0 + fr.height + 12], 26, fill=(11, 15, 26), outline=(58, 69, 102), width=4)
    m = Image.new("L", fr.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, fr.width, fr.height], 16, fill=255); im.paste(fr, (x0, y0), m)
    if sorot:
        a, b, c, e = [v * k for v in sorot]; d.rounded_rectangle([x0 + a - 6, y0 + b - 6, x0 + c + 6, y0 + e + 6], 12, outline=(235, 64, 64), width=7)
    f = ImageFont.truetype(FB, 28); cw2 = d.textlength(f"GIT & KERJA TIM · {kode}", font=f) + 48
    d.rounded_rectangle([44, 52, 44 + cw2, 104], 26, fill=KUNING); d.text((44 + cw2 / 2, 78), f"GIT & KERJA TIM · {kode}", font=f, fill=(20, 24, 38), anchor="mm")
    y = 140
    for s, w, u in judul:
        fo = ImageFont.truetype(FB, u)
        while d.textlength(s, font=fo) > x0 - 70: u -= 4; fo = ImageFont.truetype(FB, u)
        d.text((46, y), s, font=fo, fill=w, stroke_width=4, stroke_fill=(18, 24, 41)); y += int(u * 1.12)
    out = [f"{R.ROOT}/{kode}/{x}" for x in os.listdir(f"{R.ROOT}/{kode}") if x.endswith(".mp4") and "_Short" not in x][0][:-4] + "_thumbnail.jpg"
    im.save(out, quality=92); print(out)
if __name__ == "__main__":
    for k in sys.argv[1:] or T: buat(k)
