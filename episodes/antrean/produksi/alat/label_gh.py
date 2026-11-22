"""Label alamat GitHub berkas yang sedang diketik (typing along). Tag per bab: blob/bab-NN/<berkas>."""
import json, os, subprocess
from PIL import Image, ImageDraw, ImageFont
FB = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"; FS = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
REPO = "github.com/listyantidewi1/SiAntre"; CACHE = "/home/user/antre/alat/url_ada.json"
def ada(url):
    c = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    if url not in c:
        r = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-L", "https://" + url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")], capture_output=True, text=True).stdout.strip()
        if r not in ("200", "404"): return True  # jaringan bermasalah: jangan simpan
        c[url] = r == "200"; json.dump(c, open(CACHE, "w"), indent=0, sort_keys=True)
    return c[url]
def alamat(berkas, bab):
    """(teks kiri, alamat). Bila berkas tidak ada di repo publik pada tag bab itu, tunjuk folder bab."""
    tag = f"bab-{bab:02d}"
    if berkas and ada(f"{REPO}/blob/{tag}/{berkas}"): return berkas, f"{REPO}/blob/{tag}/{berkas}"
    return None, f"{REPO}/tree/{tag}"
def pil(berkas, bab, besar=False):
    nama, url = alamat(berkas, bab); fz = 34 if besar else 28; h = 68 if besar else 56
    f1 = ImageFont.truetype(FB, fz); f2 = ImageFont.truetype(FS, fz)
    a = (nama + "   ") if nama else ""; b = "Salin dari: " if nama else "Kode bab ini: "
    w = int(f1.getlength(a) + f2.getlength(b) + f1.getlength(url)) + 64
    im = Image.new("RGBA", (w + 12, h + 12), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([6, 6, w + 6, h + 6], 16, fill=(14, 20, 36, 238), outline=(255, 176, 32, 255), width=2)
    x = 6 + 30; y = 6 + h / 2
    if a: d.text((x, y), a, font=f1, fill=(251, 191, 36, 255), anchor="lm"); x += f1.getlength(a)
    d.text((x, y), b, font=f2, fill=(190, 200, 225, 255), anchor="lm"); x += f2.getlength(b)
    d.text((x, y), url, font=f1, fill=(255, 255, 255, 255), anchor="lm")
    return im
