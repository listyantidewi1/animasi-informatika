# Thumbnail "Vibe Coding yang Benar: Membuat Aplikasi Patungan Sampai Jadi (Claude Code)"
from PIL import Image, ImageDraw, ImageFont, ImageFilter
FB = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"
FS = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
im = Image.new("RGB", (1280, 720)); d = ImageDraw.Draw(im)
for y in range(720):
    k = y / 720; d.line([(0, y), (1280, y)], fill=(int(18 + 9 * k), int(24 + 12 * k), int(41 + 23 * k)))
for x in range(30, 1280, 36):
    for y in range(30, 720, 36): d.point((x, y), fill=(40, 48, 74))
src = Image.open("/tmp/fr/th_ok.png").convert("RGB")       # 1236x2748, DSF 3: hasil benar (kunci jawaban)
fr = src.crop((105, 600, 1131, 2070))                      # CSS 35..377 x 200..690
k = 640 / fr.height; fr = fr.resize((int(fr.width * k), 640), Image.LANCZOS)
x0, y0 = 1280 - fr.width - 50, 40
sh = Image.new("RGBA", (fr.width + 80, fr.height + 80), (0, 0, 0, 0))
ImageDraw.Draw(sh).rounded_rectangle([40, 48, fr.width + 40, fr.height + 48], 28, fill=(0, 0, 0, 180)); sh = sh.filter(ImageFilter.GaussianBlur(14))
im.paste(sh, (x0 - 40, y0 - 40), sh)
d.rounded_rectangle([x0 - 14, y0 - 14, x0 + fr.width + 14, y0 + fr.height + 14], 34, fill=(11, 15, 26), outline=(58, 69, 102), width=4)
m = Image.new("L", fr.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, fr.width, fr.height], 22, fill=255); im.paste(fr, (x0, y0), m)
# sorot hasil per orang (CSS y 428..632 dalam potongan 200..690)
s = 640 / 490; ya, yb = y0 + (428 - 200) * s, y0 + (632 - 200) * s
d.rounded_rectangle([x0 - 8, ya, x0 + fr.width + 8, yb], 16, outline=(34, 197, 94), width=8)
f = ImageFont.truetype(FB, 28)
d.rounded_rectangle([50, 58, 446, 108], 25, fill=(255, 176, 32)); d.text((248, 83), "VIBE CODING YANG BENAR", font=f, fill=(20, 24, 38), anchor="mm")
y = 146
for t, c, u in [("APLIKASI", (255, 255, 255), 104), ("PATUNGAN", (255, 176, 32), 112), ("SAMPAI JADI", (255, 255, 255), 80)]:
    fo = ImageFont.truetype(FB, u)
    d.text((50, y), t, font=fo, fill=c, stroke_width=4, stroke_fill=(18, 24, 41)); y += int(u * 1.12)
y += 26
fo = ImageFont.truetype(FS, 36)
d.text((52, y), "dengan Claude Code", font=fo, fill=(190, 200, 225))
d.text((52, y + 54), "spek · tes · PWA · terbit", font=ImageFont.truetype(FS, 30), fill=(130, 142, 175))
im.save("/home/user/vibe/prod/akhir/Vibe_Coding_Patungan_thumbnail.jpg", quality=92)
