from PIL import Image, ImageDraw, ImageFont, ImageFilter
FB = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"
im = Image.new("RGB", (1280, 720)); d = ImageDraw.Draw(im)
for y in range(720):
    k = y / 720; d.line([(0, y), (1280, y)], fill=(int(18 + 9 * k), int(24 + 12 * k), int(41 + 23 * k)))
for x in range(30, 1280, 36):
    for y in range(30, 720, 36): d.point((x, y), fill=(40, 48, 74))
src = Image.open("/tmp/fr/th_min.png").convert("RGB")      # 1236x2748, DSF 3
fr = src.crop((105, 540, 1131, 1860))                      # CSS 35..377 x 180..620
k = 640 / fr.height; fr = fr.resize((int(fr.width * k), 640), Image.LANCZOS)
x0, y0 = 1280 - fr.width - 50, 40
sh = Image.new("RGBA", (fr.width + 80, fr.height + 80), (0, 0, 0, 0))
ImageDraw.Draw(sh).rounded_rectangle([40, 48, fr.width + 40, fr.height + 48], 28, fill=(0, 0, 0, 180)); sh = sh.filter(ImageFilter.GaussianBlur(14))
im.paste(sh, (x0 - 40, y0 - 40), sh)
d.rounded_rectangle([x0 - 14, y0 - 14, x0 + fr.width + 14, y0 + fr.height + 14], 34, fill=(11, 15, 26), outline=(58, 69, 102), width=4)
m = Image.new("L", fr.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, fr.width, fr.height], 22, fill=255); im.paste(fr, (x0, y0), m)
# sorot baris minus (CSS y 410..560 dalam potongan 180..620)
s = 640 / 440; ya, yb = y0 + (410 - 180) * s, y0 + (555 - 180) * s
d.rounded_rectangle([x0 - 8, ya, x0 + fr.width + 8, yb], 16, outline=(235, 64, 64), width=8)
f = ImageFont.truetype(FB, 30)
d.rounded_rectangle([50, 60, 330, 112], 26, fill=(255, 176, 32)); d.text((190, 86), "VIBE CODING", font=f, fill=(20, 24, 38), anchor="mm")
y = 150
for t, c, u in [("AI SALAH", (255, 255, 255), 118), ("HITUNG", (255, 176, 32), 118), ("Aplikasi HP", (255, 255, 255), 64), ("dari nol", (255, 255, 255), 64)]:
    fo = ImageFont.truetype(FB, u)
    d.text((52, y), t, font=fo, fill=c, stroke_width=4, stroke_fill=(18, 24, 41)); y += int(u * 1.08) + (24 if t == "HITUNG" else 0)
im.save("/home/user/vibe/prod/akhir/Vibe_Coding_Patungan_thumbnail.jpg", quality=92)
