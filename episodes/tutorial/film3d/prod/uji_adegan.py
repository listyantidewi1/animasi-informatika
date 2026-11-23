"""Gambar satu frame tiap adegan kanvas untuk diperiksa: python3 uji_adegan.py -> /tmp/uji_adegan/*.jpg"""
import base64, os, pathlib, sys
from playwright.sync_api import sync_playwright
F = pathlib.Path(__file__).resolve().parent.parent
WEB = F.parent / "_alat" / "web"
RAW = F / "raw"
UJI = [
 ("judul", 4, 5, dict(judul="Bikin Film Animasi 3D\ndari Nol", hook="Setelah menonton, kamu bisa membuat film animasi 3D pendek dengan Claude Code dan Blender.")),
 ("bab", 3, 4, dict(n=4)),
 ("teks", 7, 8, dict(judul="Tiga pemeriksaan storyboard", isi=["Satu shot, satu ide.", "Tanpa narasi, cerita harus terbaca dari gambar dan suara.", "Setiap lelucon harus benar-benar ada di layar."])),
 ("pelajaran", 3, 5, dict(teks="AI tidak tahu mana yang lelucon, kalau kita tidak bilang.", label="PELAJARAN 1")),
 ("gambar", 7, 8, dict(bg=str(RAW / "F08c_poles_lembar.png"), judul="Lembar kontak delapan shot", cap="Satu gambar kecil per shot", tanda=[dict(x=.37, y=.25, r=.1, teks="motor kecil"), dict(x=.62, y=.75, r=.08, k="benar", teks="siluet")])),
 ("flipbook", 2.1, 8, {}), ("keyframe", 6.5, 10, {}),
 ("alur", 9, 10, dict(judul="Cara kerja proyek", kotak=[["bangun.py", "skrip Python yang ditulis Claude Code", "sky"], ["blender --background", "Blender menjalankan skrip tanpa jendela", "amber"], ["film.blend", "seluruh film, bisa dibangun ulang kapan saja", "lime"], ["gambar cek", "lembar kontak 480p untuk diperiksa", "violet"]], cap="Salah? Perbaiki skripnya, lalu bangun ulang.")),
 ("kartu", 6, 12, dict(judul="Empat alat kamera", kartu=[["Lensa", "Lebar untuk tempat, panjang untuk perasaan.", "sky"], ["Gerakan", "Naik pelan, mengikuti, mendekat.", "teal"], ["Fokus kabur", "Yang penting tajam, latar kabur.", "violet"], ["Motion blur", "Benda cepat sedikit kabur.", "amber"]])),
 ("duaJalan", 9, 10, dict(judul="Jangan langsung meminta filmnya", kiri=["Tanpa storyboard", "buatkan film animasi tentang kurir", "AI menebak semuanya. Hasilnya acak."], kanan=["Dengan storyboard", "tabel 8 shot: detik, gambar, kamera, suara", "AI mengikuti rencana kita."])),
]
os.makedirs("/tmp/uji_adegan", exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto((WEB / "render.html").as_uri()); pg.evaluate("s => muatSkrip(s)", (F / "adegan.js").as_uri())
    for nama, t, D, a in UJI:
        a = dict(a)
        if a.get("bg"): a["bg"] = pathlib.Path(a["bg"]).as_uri(); pg.evaluate("s => muat(s)", [a["bg"]])
        else: pg.evaluate("s => muat(s)", [])
        d = pg.evaluate("([n,t,D,a]) => gambar(n,t,D,a)", [nama, t, D, a])
        open(f"/tmp/uji_adegan/{nama}.jpg", "wb").write(base64.b64decode(d.split(",", 1)[1]))
    b.close()
