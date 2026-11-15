import sys, subprocess, json, importlib.util
from PIL import Image, ImageDraw, ImageFont, ImageFilter
FB = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"
def main(ep):
    base = f"/home/user/tut/{ep}"
    spec = importlib.util.spec_from_file_location("spec", f"{base}/spec.py"); S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
    T = S.THUMB; W = {b["no"]: b for b in json.load(open(f"{base}/waktu.json"))}
    no, off = T["dari"]; t = W[no]["mulai"] + off
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.2f}", "-i", f"{base}/{S.NAMA}.mp4", "-frames:v", "1", "/tmp/th.png"], check=True)
    im = Image.new("RGB", (1280, 720), (18, 24, 41)); d = ImageDraw.Draw(im)
    for x in range(30, 1280, 36):
        for y in range(30, 720, 36): d.point((x, y), fill=(40, 48, 74))
    fr = Image.open("/tmp/th.png").convert("RGB"); cx, cy, cw, ch = T.get("crop", (0, 0, 1920, 1080)); fr = fr.crop((cx, cy, cx + cw, cy + ch))
    fr = fr.resize((700, int(700 * ch / cw))); sh = Image.new("RGBA", (fr.width + 40, fr.height + 40), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle([20, 26, fr.width + 20, fr.height + 26], 18, fill=(0, 0, 0, 160)); sh = sh.filter(ImageFilter.GaussianBlur(10))
    x0, y0 = 1280 - fr.width - 40, (720 - fr.height) // 2 + 30
    im.paste(sh, (x0 - 20, y0 - 20), sh); mask = Image.new("L", fr.size, 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, fr.width, fr.height], 18, fill=255)
    im.paste(fr, (x0, y0), mask); d = ImageDraw.Draw(im)
    d.rounded_rectangle([40, 44, 40 + 330, 96], 26, fill=(255, 176, 32)); d.text((205, 70), T.get("pita", "PYTHON"), font=ImageFont.truetype(FB, 30), fill=(20, 24, 38), anchor="mm")
    y = 150
    for i, l in enumerate(T["baris"]):
        uk = T.get("ukuran", 96)
        while ImageFont.truetype(FB, uk).getlength(l) > 470: uk -= 4
        f = ImageFont.truetype(FB, uk); col = (255, 176, 32) if i == T.get("sorot", -1) else (255, 255, 255)
        d.text((44, y), l, font=f, fill=col, stroke_width=4, stroke_fill=(18, 24, 41)); y += int(uk * 1.12)
    im.save(f"{base}/{ep}_thumbnail.jpg", quality=92); print("thumb ok")
if __name__ == "__main__": main(sys.argv[1])
