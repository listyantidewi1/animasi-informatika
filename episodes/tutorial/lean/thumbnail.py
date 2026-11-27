"""Thumbnail L01 1920x1080: python3 thumbnail.py -> thumbnail.jpg (tidak membocorkan jawaban)."""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
F = lambda n, s: ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-" + n + ".otf", s)
M = lambda s: ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf", s)
BG = (14, 17, 23); INK = (242, 244, 248); INK2 = (174, 182, 198); PRIMA = (242, 201, 76); LEAN = (111, 207, 151); AI = (86, 204, 242)
im = Image.new("RGB", (1920, 1080), BG)
g = Image.new("RGB", (1920, 1080), BG); dg = ImageDraw.Draw(g); dg.ellipse((1000, 150, 1900, 1050), fill=(24, 38, 52)); im = g.filter(ImageFilter.GaussianBlur(120))
d = ImageDraw.Draw(im)
d.text((90, 150), "APA ITU", font=F("Bold", 96), fill=INK)
d.text((82, 250), "LEAN 4", font=F("Black", 228), fill=LEAN)
d.text((90, 560), "Bahasa pemrograman", font=F("Bold", 70), fill=INK)
d.text((90, 650), "yang memeriksa bukti", font=F("Bold", 70), fill=INK)
d.rounded_rectangle((90, 800, 760, 900), 50, fill=PRIMA); d.text((132, 818), "Cara mulai belajar", font=F("Bold", 58), fill=BG)
# jendela editor
x0, y0, x1, y1 = 1010, 300, 1840, 800
d.rounded_rectangle((x0, y0, x1, y1), 28, fill=(26, 32, 44), outline=(70, 80, 100), width=4)
d.rounded_rectangle((x0, y0, x1, y0 + 70), 28, fill=(36, 44, 60)); d.rectangle((x0 + 4, y0 + 40, x1 - 4, y0 + 70), fill=(36, 44, 60))
for i, c in enumerate(((255, 95, 87), (254, 188, 46), (40, 200, 64))): d.ellipse((x0 + 34 + i * 44, y0 + 22, x0 + 60 + i * 44, y0 + 48), fill=c)
f = M(58)
d.text((x0 + 50, y0 + 120), "theorem", font=f, fill=AI); d.text((x0 + 50 + 8 * 35, y0 + 120), "mustahil :", font=f, fill=INK)
d.text((x0 + 50 + 70, y0 + 215), "2 + 2 = 5", font=M(96), fill=PRIMA)
d.text((x0 + 50, y0 + 370), ":= by", font=f, fill=INK2); d.rectangle((x0 + 50 + 6 * 35, y0 + 372, x0 + 50 + 6 * 35 + 8, y0 + 436), fill=INK)
d.text((1640, 90), "?", font=F("Black", 330), fill=PRIMA)
im.save(D + "/thumbnail.jpg", quality=92); print("thumbnail.jpg")
