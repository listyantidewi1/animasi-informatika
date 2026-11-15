"""Kartu output program (teks keluaran asli) untuk thumbnail: kartu_output.py <json> <out.png>"""
import sys, json
from PIL import Image, ImageDraw, ImageFont
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"; MONOB = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
FB = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"
def buat(spec, out):
    S = 2; W, uk = spec.get("lebar", 820), spec.get("ukuran", 40)
    baris = spec["baris"]; lh = int(uk * 1.5); H = 90 + 40 + lh * len(baris) + 30
    im = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, W * S, H * S], 26 * S, fill=(250, 251, 253))
    d.rounded_rectangle([0, 0, W * S, 70 * S], 26 * S, fill=(229, 233, 241)); d.rectangle([0, 40 * S, W * S, 70 * S], fill=(229, 233, 241))
    for i, col in enumerate([(255, 107, 107), (255, 176, 32), (163, 230, 53)]): d.ellipse([(28 + i * 34) * S, 24 * S, (50 + i * 34) * S, 46 * S], fill=col)
    d.text((140 * S, 35 * S), spec.get("judul", "Output"), font=ImageFont.truetype(FB, 26 * S), fill=(71, 85, 105), anchor="lm")
    y = 110
    for b in baris:
        teks, warna = b[0], tuple(b[1]) if len(b) > 1 else (30, 41, 59)
        tebal = len(b) > 2 and b[2]
        if tebal: d.rounded_rectangle([18 * S, (y - 8) * S, (W - 18) * S, (y + lh - 4) * S], 12 * S, fill=tuple(list(warna) + [40]) if False else (220, 252, 231))
        d.text((36 * S, (y + lh / 2 - 6) * S), teks, font=ImageFont.truetype(MONOB if tebal else MONO, uk * S), fill=warna, anchor="lm"); y += lh
    im = im.resize((W, H), Image.LANCZOS); im.save(out)
if __name__ == "__main__": buat(json.load(open(sys.argv[1])), sys.argv[2])
