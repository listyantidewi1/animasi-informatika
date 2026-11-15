"""Ilustrasi kucing, anjing, dan benda lain yang digambar dengan kode (tanpa gambar dari internet)."""
import random, math, os, sys
from PIL import Image, ImageDraw, ImageFilter
S = 2; N = 400
BULU_K = [(240, 150, 60), (60, 60, 64), (235, 235, 230), (150, 150, 155), (200, 120, 70), (110, 80, 60), (250, 210, 150)]
BULU_A = [(200, 150, 90), (90, 60, 40), (240, 230, 210), (40, 40, 40), (180, 110, 60), (230, 190, 120), (150, 100, 70)]
LATAR_DALAM = [(236, 222, 200), (210, 225, 240), (245, 235, 215), (225, 215, 235), (220, 235, 225)]
LANTAI = [(180, 140, 100), (160, 120, 90), (200, 190, 175), (150, 160, 175)]
def gelap(c, k=.75): return tuple(int(v * k) for v in c)
def latar(d, R, rumput=False):
    if rumput:
        d.rectangle([0, 0, N * S, N * S * .55], fill=(150, 200, 240)); d.rectangle([0, N * S * .55, N * S, N * S], fill=(110, 180, 80))
        for _ in range(60):
            x = R.uniform(0, N * S); y = R.uniform(N * S * .56, N * S); d.line([x, y, x + R.uniform(-6, 6) * S, y - R.uniform(8, 18) * S], fill=(80, 150, 60), width=2 * S)
    else:
        w = R.choice(LATAR_DALAM); f = R.choice(LANTAI); h = R.uniform(.55, .72)
        d.rectangle([0, 0, N * S, N * S * h], fill=w); d.rectangle([0, N * S * h, N * S, N * S], fill=f)
        if R.random() < .5: x = R.uniform(.05, .7) * N * S; d.rectangle([x, N * S * .12, x + 90 * S, N * S * .38], fill=(255, 255, 255), outline=gelap(w), width=6 * S)
def el(d, cx, cy, rx, ry, f): d.ellipse([(cx - rx) * S, (cy - ry) * S, (cx + rx) * S, (cy + ry) * S], fill=f)
def poly(d, pts, f): d.polygon([(x * S, y * S) for x, y in pts], fill=f)
def belang(d, cx, cy, rx, ry, c, R):
    for i in range(R.randint(2, 4)):
        y = cy - ry * .5 + i * ry * .35; d.line([(cx - rx * .6) * S, y * S, (cx - rx * .2) * S, (y + 4) * S], fill=c, width=6 * S)
def kucing(R, rumput=False, setengah=False):
    im = Image.new("RGB", (N * S, N * S)); d = ImageDraw.Draw(im); latar(d, R, rumput)
    c = R.choice(BULU_K); cg = gelap(c); sk = R.uniform(.75, 1.1); cx = R.uniform(140, 260); cy = R.uniform(170, 220)
    tidur = R.random() < .25 and not setengah
    if tidur:
        el(d, cx, cy + 90 * sk, 120 * sk, 60 * sk, c); el(d, cx - 80 * sk, cy + 70 * sk, 55 * sk, 48 * sk, c)
        hx, hy = cx - 80 * sk, cy + 70 * sk
        poly(d, [(hx - 48 * sk, hy - 20 * sk), (hx - 38 * sk, hy - 72 * sk), (hx - 10 * sk, hy - 40 * sk)], c); poly(d, [(hx + 48 * sk, hy - 20 * sk), (hx + 38 * sk, hy - 72 * sk), (hx + 10 * sk, hy - 40 * sk)], c)
        for s in (-1, 1): d.arc([(hx + s * 20 * sk - 10 * sk) * S, (hy - 8 * sk) * S, (hx + s * 20 * sk + 10 * sk) * S, (hy + 6 * sk) * S], 20, 160, fill=(30, 30, 30), width=3 * S)
        d.arc([(cx + 40 * sk) * S, (cy + 40 * sk) * S, (cx + 150 * sk) * S, (cy + 150 * sk) * S], 200, 340, fill=c, width=16 * S)
        return im
    # badan duduk + ekor
    if not setengah:
        el(d, cx, cy + 120 * sk, 75 * sk, 95 * sk, c); el(d, cx - 30 * sk, cy + 200 * sk, 22 * sk, 14 * sk, c); el(d, cx + 30 * sk, cy + 200 * sk, 22 * sk, 14 * sk, c)
        tx = cx + 70 * sk; d.arc([tx * S - 40 * sk * S, (cy + 80 * sk) * S, (tx + 70 * sk) * S, (cy + 210 * sk) * S], 260, 90, fill=c, width=int(14 * sk * S))
        if R.random() < .5: belang(d, cx, cy + 120 * sk, 75 * sk, 95 * sk, cg, R)
    else:
        cx = R.uniform(320, 380)
    hx, hy, r = cx, cy, 62 * sk
    for s in (-1, 1):
        poly(d, [(hx + s * r * .95, hy - r * .2), (hx + s * r * .75, hy - r * 1.35), (hx + s * r * .2, hy - r * .8)], c)
        poly(d, [(hx + s * r * .82, hy - r * .35), (hx + s * r * .72, hy - r * 1.1), (hx + s * r * .38, hy - r * .78)], (240, 170, 170))
    el(d, hx, hy, r, r * .88, c)
    for s in (-1, 1):
        el(d, hx + s * r * .38, hy - r * .1, r * .17, r * .2, (150, 200, 80) if R.random() < .5 else (230, 190, 60)); el(d, hx + s * r * .38, hy - r * .1, r * .05, r * .17, (20, 20, 20))
        for k in (-1, 0, 1): d.line([(hx + s * r * .3) * S, (hy + r * .3 + k * 6) * S, (hx + s * r * 1.15) * S, (hy + r * .25 + k * 14) * S], fill=(40, 40, 40) if sum(c) > 300 else (230, 230, 230), width=2 * S)
    poly(d, [(hx - r * .1, hy + r * .2), (hx + r * .1, hy + r * .2), (hx, hy + r * .32)], (230, 120, 130))
    d.arc([(hx - r * .2) * S, (hy + r * .25) * S, hx * S, (hy + r * .45) * S], 0, 180, fill=(40, 40, 40), width=2 * S); d.arc([hx * S, (hy + r * .25) * S, (hx + r * .2) * S, (hy + r * .45) * S], 0, 180, fill=(40, 40, 40), width=2 * S)
    return im
def anjing(R, rumput=False):
    im = Image.new("RGB", (N * S, N * S)); d = ImageDraw.Draw(im); latar(d, R, rumput)
    c = R.choice(BULU_A); cg = gelap(c, .65); sk = R.uniform(.75, 1.1); cx = R.uniform(140, 260); cy = R.uniform(160, 210)
    tidur = R.random() < .2
    if tidur:
        el(d, cx + 20, cy + 110 * sk, 130 * sk, 55 * sk, c); hx, hy = cx - 90 * sk, cy + 95 * sk
        el(d, hx, hy, 55 * sk, 45 * sk, c); el(d, hx - 50 * sk, hy + 15 * sk, 32 * sk, 22 * sk, gelap(c, .9)); el(d, hx - 78 * sk, hy + 10 * sk, 9 * sk, 7 * sk, (20, 20, 20))
        el(d, hx + 25 * sk, hy - 5 * sk, 22 * sk, 40 * sk, cg); d.arc([(hx - 15 * sk) * S, (hy - 15 * sk) * S, (hx + 5 * sk) * S, (hy - 2 * sk) * S], 20, 160, fill=(20, 20, 20), width=3 * S)
        return im
    el(d, cx, cy + 130 * sk, 85 * sk, 90 * sk, c)
    for s in (-1, 1): d.rounded_rectangle([(cx + s * 40 * sk - 16 * sk) * S, (cy + 170 * sk) * S, (cx + s * 40 * sk + 16 * sk) * S, (cy + 225 * sk) * S], 10 * S, fill=c)
    tx = cx + 85 * sk; d.line([tx * S, (cy + 110 * sk) * S, (tx + 50 * sk) * S, (cy + 60 * sk) * S], fill=c, width=int(14 * sk * S))
    if R.random() < .4: el(d, cx + 20 * sk, cy + 120 * sk, 30 * sk, 25 * sk, cg)
    hx, hy, r = cx, cy, 60 * sk
    el(d, hx, hy, r, r * .95, c)
    tegak = False
    for s in (-1, 1):
        if tegak: poly(d, [(hx + s * r * .9, hy - r * .3), (hx + s * r * .8, hy - r * 1.25), (hx + s * r * .35, hy - r * .75)], cg)
        else: el(d, hx + s * r * .95, hy + r * .1, r * .32, r * .7, cg)
    el(d, hx, hy + r * .45, r * .55, r * .4, gelap(c, 1.08) if sum(c) < 600 else (250, 245, 235))
    el(d, hx, hy + r * .25, r * .18, r * .13, (25, 25, 25))
    for s in (-1, 1): el(d, hx + s * r * .38, hy - r * .2, r * .13, r * .15, (30, 25, 20)); el(d, hx + s * r * .34, hy - r * .25, r * .04, r * .04, (255, 255, 255))
    if R.random() < .6: el(d, hx + r * .1, hy + r * .78, r * .14, r * .2, (235, 100, 120))
    if R.random() < .4: d.rectangle([(hx - r * .7) * S, (hy + r * .85) * S, (hx + r * .7) * S, (hy + r * 1.0) * S], fill=R.choice([(220, 40, 40), (40, 90, 200), (40, 160, 80)]))
    return im
def benda(R, paksa=None):
    im = Image.new("RGB", (N * S, N * S)); d = ImageDraw.Draw(im); latar(d, R, R.random() < .4)
    jenis = paksa or R.choice(["sepeda", "bola", "buku", "kursi", "mobil", "tanaman", "gelas"]); cx, cy = R.uniform(150, 250), R.uniform(180, 250)
    col = R.choice([(220, 60, 60), (60, 120, 220), (40, 160, 90), (240, 180, 40), (130, 80, 200)])
    if jenis == "sepeda":
        for s in (-1, 1): d.ellipse([(cx + s * 80 - 55) * S, (cy + 40 - 55) * S, (cx + s * 80 + 55) * S, (cy + 40 + 55) * S], outline=(40, 40, 40), width=8 * S)
        d.line([(cx - 80) * S, (cy + 40) * S, (cx - 10) * S, (cy - 30) * S, (cx + 50) * S, (cy - 30) * S, (cx + 80) * S, (cy + 40) * S], fill=col, width=9 * S); d.line([(cx - 10) * S, (cy - 30) * S, (cx + 10) * S, (cy + 40) * S, (cx + 50) * S, (cy - 30) * S], fill=col, width=9 * S)
        d.line([(cx + 50) * S, (cy - 30) * S, (cx + 45) * S, (cy - 70) * S], fill=(40, 40, 40), width=7 * S); d.line([(cx - 25) * S, (cy - 50) * S, (cx + 5) * S, (cy - 50) * S], fill=(40, 40, 40), width=10 * S)
    elif jenis == "bola": el(d, cx, cy, 80, 80, col); d.arc([(cx - 80) * S, (cy - 30) * S, (cx + 80) * S, (cy + 30) * S], 0, 360, fill=(255, 255, 255), width=6 * S)
    elif jenis == "buku": d.rectangle([(cx - 90) * S, (cy - 60) * S, (cx + 90) * S, (cy + 60) * S], fill=col); d.rectangle([(cx - 80) * S, (cy - 50) * S, (cx + 80) * S, (cy - 30) * S], fill=(250, 250, 250))
    elif jenis == "kursi": d.rectangle([(cx - 60) * S, (cy - 100) * S, (cx + 60) * S, (cy - 80) * S], fill=col); d.rectangle([(cx - 60) * S, (cy) * S, (cx + 60) * S, (cy + 20) * S], fill=col); [d.rectangle([(cx + s * 55 - 6) * S, (cy - 100) * S, (cx + s * 55 + 6) * S, (cy + 100) * S], fill=gelap(col)) for s in (-1, 1)]
    elif jenis == "mobil": d.rounded_rectangle([(cx - 120) * S, (cy - 20) * S, (cx + 120) * S, (cy + 40) * S], 20 * S, fill=col); d.rounded_rectangle([(cx - 60) * S, (cy - 70) * S, (cx + 60) * S, (cy - 10) * S], 20 * S, fill=col); [el(d, cx + s * 70, cy + 45, 25, 25, (40, 40, 40)) for s in (-1, 1)]
    elif jenis == "tanaman": d.polygon([((cx - 50) * S, (cy + 40) * S), ((cx + 50) * S, (cy + 40) * S), ((cx + 35) * S, (cy + 120) * S), ((cx - 35) * S, (cy + 120) * S)], fill=(190, 100, 60)); [el(d, cx + R.uniform(-50, 50), cy + R.uniform(-80, 20), 30, 15, (50, 150, 60)) for _ in range(8)]
    else: d.rectangle([(cx - 40) * S, (cy - 70) * S, (cx + 40) * S, (cy + 70) * S], fill=(200, 230, 245), outline=(120, 150, 170), width=5 * S); d.rectangle([(cx - 36) * S, (cy) * S, (cx + 36) * S, (cy + 66) * S], fill=col)
    return im
def simpan(im, p): im.resize((N, N), Image.LANCZOS).save(p, quality=92)
if __name__ == "__main__":
    out = "/home/user/tut/T05/gambar"
    for sub in ["Kucing", "Anjing", "Bukan", "uji"]: os.makedirs(f"{out}/{sub}", exist_ok=True)
    for i in range(36): simpan(kucing(random.Random(100 + i)), f"{out}/Kucing/kucing_{i+1:02d}.jpg"); simpan(anjing(random.Random(500 + i)), f"{out}/Anjing/anjing_{i+1:02d}.jpg"); simpan(benda(random.Random(900 + i)), f"{out}/Bukan/benda_{i+1:02d}.jpg")
    simpan(kucing(random.Random(7001)), f"{out}/uji/kucing_baru.jpg"); simpan(anjing(random.Random(7006)), f"{out}/uji/anjing_baru.jpg")
    simpan(kucing(random.Random(7003), setengah=True), f"{out}/uji/kucing_setengah.jpg"); simpan(kucing(random.Random(7004), rumput=True), f"{out}/uji/kucing_di_rumput.jpg")
    R = random.Random(7005); im = benda(R)
    while True:
        R = random.Random(R.randint(0, 10**6)); im2 = Image.new("RGB", (1, 1))
        break
    simpan(benda(random.Random(7010), "sepeda"), f"{out}/uji/sepeda.jpg")
