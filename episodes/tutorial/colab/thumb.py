"""Thumbnail polos (tanpa merek kanal) dari video jadi."""
import cv2, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from rakit import latar, FB, FS
w = json.load(open('out/waktu.json')); t = dict((i, x) for i, x in w['suara'])
cap = cv2.VideoCapture('out/Google_Colab_Pertama.mp4'); cap.set(cv2.CAP_PROP_POS_MSEC, (t['d4'] + 3.0) * 1000); ok, fr = cap.read()
shot = Image.fromarray(fr[:, :, ::-1]).crop((150, 130, 1920, 830))
im = latar().resize((1280, 720)); sw = 760; sh = int(shot.height * sw / shot.width); shot = shot.resize((sw, sh), Image.LANCZOS)
mask = Image.new('L', (sw, sh), 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, sw, sh], 22, fill=255)
x, y = 1280 - sw - 36, (720 - sh) // 2 + 40
sd = Image.new('RGBA', (1280, 720), (0, 0, 0, 0)); ImageDraw.Draw(sd).rounded_rectangle([x + 6, y + 14, x + sw + 6, y + sh + 14], 22, fill=(0, 0, 0, 150)); sd = sd.filter(ImageFilter.GaussianBlur(14))
im = Image.alpha_composite(im.convert('RGBA'), sd); im.paste(shot, (x, y), mask); d = ImageDraw.Draw(im)
d.rounded_rectangle([x - 3, y - 3, x + sw + 3, y + sh + 3], 24, outline=(249, 171, 0), width=5)
d.rounded_rectangle([44, 60, 44 + 250, 60 + 50], 25, fill=(249, 171, 0)); d.text((44 + 125, 85), "UNTUK PEMULA", font=ImageFont.truetype(FB, 24), fill=(22, 27, 41), anchor="mm")
f = ImageFont.truetype(FB, 60); yy = 140
for b in ["Program", "Python", "Pertama di", "Google Colab"]: d.text((44, yy), b, font=f, fill=(255, 255, 255)); yy += 74
f2 = ImageFont.truetype(FS, 30); yy += 24
for b in ["dan cara membaca", "pesan error"]: d.text((44, yy), b, font=f2, fill=(255, 205, 96)); yy += 42
im.convert('RGB').save('out/thumbnail.png')
