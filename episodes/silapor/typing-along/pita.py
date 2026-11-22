"""Pita bawah 1920x86: apa yang sedang diketik + alamat GitHub-nya. Konten video diperkecil 92% di atas pita."""
from PIL import Image, ImageDraw, ImageFont
import hashlib, os, subprocess
W, H = 1920, 86; BG = (11, 16, 32)
FI = "/usr/share/fonts/opentype/inter/"; FM = "/usr/share/fonts/truetype/jetbrains-mono/"
REPO = "github.com/listyantidewi1/SiLapor"; LOKAL = "/home/user/listyantidewi1/silapor"
TAG = {"L01": "bab-01", "L04": "bab-04", "L05": "bab-05", "L06": "bab-06", "L07": "bab-07", "L08": "bab-08", "L09": "bab-09"}
NOMOR = {"L00": 0, "L01": 1, "L02": 2, "L03": 3, "L04": 4, "L05": 5, "L06": 6, "L07": 7, "L08": 8, "L09": 9}
def f(nama, s): return ImageFont.truetype(nama, s, layout_engine=ImageFont.Layout.BASIC)
def ada(tag, path): return subprocess.run(["git", "-C", LOKAL, "cat-file", "-e", f"{tag}:{path}"]).returncode == 0
def muat(d, teks, font_nama, maks_w, s0, s_min=16):
    s = s0
    while s > s_min and d.textlength(teks, font=f(font_nama, s)) > maks_w: s -= 1
    return f(font_nama, s)
def chip(d, x, y, teks, warna, tw=(12, 16, 30)):
    ft = f(FI + "Inter-ExtraBold.otf", 17); w = d.textlength(teks, font=ft) + 26
    d.rounded_rectangle([x, y, x + w, y + 30], 8, fill=warna); d.text((x + 13, y + 15), teks, font=ft, fill=tw, anchor="lm"); return x + w
def gambar(label, bab, out):
    im = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 2], fill=(40, 52, 84))
    tag = TAG.get(bab); X0 = 40; kanan = W - 40
    if not label:
        x = chip(d, X0, 12, "KODE LENGKAP", (125, 211, 252))
        d.text((x + 18, 27), f"{REPO}", font=f(FM + "JetBrainsMono-Bold.ttf", 26), fill=(240, 244, 255), anchor="lm")
        sub = (f"Kode di akhir Bab {NOMOR[bab]}: {REPO}/tree/{tag}" if tag else "Cara memasang dan menjalankan ada di README repo itu.")
        d.text((X0, 64), sub, font=f(FI + "Inter-SemiBold.otf", 21), fill=(148, 163, 196), anchor="lm")
        im.save(out); return
    jenis = [it[0] for it in label]; isi = [it[2:] for it in label]
    berkas = [i for k, i in zip(jenis, isi) if k in "BC"]
    perintah = [(k, i) for k, i in zip(jenis, isi) if k in "TS"]
    for b in berkas: assert ada(tag, b), (tag, b)
    if perintah and not berkas:
        judul = "KETIK DI MYSQL" if all(k == "S" for k, _ in perintah) else "KETIK DI TERMINAL"
        x = chip(d, X0, 28, judul, (255, 176, 32))
        teks = "   lalu   ".join(("mysql> " if k == "S" else "$ ") + i for k, i in perintah)
        lebar = kanan - x - 30; fb = FM + "JetBrainsMono-Bold.ttf"
        if d.textlength(teks, font=f(fb, 24)) <= lebar:
            d.text((x + 24, 43), teks, font=muat(d, teks, fb, lebar, 34, 24), fill=(255, 255, 255), anchor="lm")
        else:  # terlalu panjang: dua baris, dipotong di spasi dekat tengah
            tengah = len(teks) // 2; p = min((i for i, c in enumerate(teks) if c == " "), key=lambda i: abs(i - tengah))
            b1, b2 = teks[:p], "       " + teks[p + 1:]
            ft = muat(d, max(b1, b2, key=len), fb, lebar, 26, 14)
            d.text((x + 24, 25), b1, font=ft, fill=(255, 255, 255), anchor="lm"); d.text((x + 24, 61), b2, font=ft, fill=(255, 255, 255), anchor="lm")
        im.save(out); return
    if "E" in jenis:
        x = chip(d, X0, 12, "BERKAS .env", (167, 139, 250))
        d.text((x + 18, 27), "Tidak ikut ke GitHub karena berisi kata sandi", font=f(FI + "Inter-SemiBold.otf", 24), fill=(240, 244, 255), anchor="lm")
        d.text((X0, 64), f"Contoh isinya: {REPO}/blob/main/.env.example  ·  langkahnya di README", font=f(FM + "JetBrainsMono-Medium.ttf", 21), fill=(125, 211, 252), anchor="lm")
        im.save(out); return
    salin = all(k == "C" for k in jenis if k in "BC")
    x = chip(d, X0, 12, "SALIN DARI GITHUB" if salin else ("BERKAS" if len(berkas) == 1 else f"{len(berkas)} BERKAS"), (52, 211, 153) if salin else (255, 176, 32))
    awal = ""
    if perintah: awal = "$ " + perintah[0][1] + "   lalu isi   "
    baris1 = awal + "   +   ".join(berkas)
    hint = "Jeda video bila perlu"
    fh = f(FI + "Inter-Bold.otf", 19); hw = d.textlength(hint, font=fh) + 50
    d.rounded_rectangle([kanan - hw, 12, kanan, 42], 8, outline=(148, 163, 196), width=2)
    d.polygon([(kanan - hw + 16, 19), (kanan - hw + 16, 35), (kanan - hw + 22, 35), (kanan - hw + 22, 19)], fill=(148, 163, 196))
    d.polygon([(kanan - hw + 27, 19), (kanan - hw + 27, 35), (kanan - hw + 33, 35), (kanan - hw + 33, 19)], fill=(148, 163, 196))
    d.text((kanan - hw + 42, 27), hint, font=fh, fill=(200, 210, 230), anchor="lm")
    d.text((x + 18, 27), baris1, font=muat(d, baris1, FM + "JetBrainsMono-Bold.ttf", kanan - hw - x - 40, 26, 14), fill=(240, 244, 255), anchor="lm")
    url = f"{REPO}/blob/{tag}/{berkas[0]}" if len(berkas) == 1 else f"{REPO}/tree/{tag}  (kode akhir Bab {NOMOR[bab]})"
    pre = "Kode lengkap: " if not salin else "Salin dari: "
    d.text((X0, 64), pre + url, font=muat(d, pre + url, FM + "JetBrainsMono-Medium.ttf", kanan - X0, 22, 14), fill=(125, 211, 252), anchor="lm")
    im.save(out)
def berkas_pita(label, bab, folder="/home/user/ta/pita"):
    os.makedirs(folder, exist_ok=True)
    h = hashlib.md5(repr((label, bab, open(__file__).read())).encode()).hexdigest()[:12]; out = f"{folder}/{h}.png"
    if not os.path.exists(out): gambar(label, bab, out)
    return out
if __name__ == "__main__":
    contoh = [([], "L04"), (["B:database/migrations/2026_11_19_042423_create_reports_table.php"], "L04"), (["T:php artisan make:model Category -m"], "L04"),
              (["S:SELECT r.title, u.name, c.name AS kategori FROM reports r JOIN users u ON u.id = r.user_id JOIN categories c ON c.id = r.category_id LIMIT 5;"], "L04"),
              (["T:php artisan make:middleware Admin", "B:app/Http/Middleware/Admin.php"], "L05"), (["E:.env"], "L01"), (["C:public/css/gaya.css"], "L05"),
              (["B:resources/views/reports/show.blade.php", "B:app/Http/Controllers/ReportController.php", "B:routes/web.php"], "L06"), (["T:git add .", "T:git commit -m \"Tabel dan model\""], "L04")]
    ims = [Image.open(berkas_pita(l, b)) for l, b in contoh]
    s = Image.new("RGB", (W, H * len(ims) + 6 * len(ims)), (255, 0, 0))
    for i, im in enumerate(ims): s.paste(im, (0, i * (H + 6)))
    s.save("/home/user/ta/pita_contoh.png")
