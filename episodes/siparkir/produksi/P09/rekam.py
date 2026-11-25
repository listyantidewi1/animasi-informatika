import sys, time, os, subprocess; sys.path.insert(0, "/home/user/parkir/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan, banding
T = "bab-09"
siapkan("bab-08", "seed")
b = Bab("/home/user/parkir/P09/rek"); r = b.r
r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 composer require + class Qr
b.term(); r.tanda("b02"); time.sleep(0.8); r.tanda("b02_cmd"); b.jalan("composer require bacon/bacon-qr-code", cps=13, tunggu=2.0, sampai="Using version", maks=120); r.tanda("b02_jalan")
b.tunggu("security vulnerability", maks=240); time.sleep(1.5); print(b.layar()[-1200:]); r.tanda("b02_selesai"); r.label("Pustaka terpasang", 3.0); time.sleep(3.2)
subprocess.run("find " + P + "/vendor -maxdepth 3 -name .git -type d -prune -exec rm -rf {} +", shell=True)
CJ = "composer.json"; r.kamera(None); r.tanda("b02_json"); b.sorot(CJ, "bacon/bacon-qr-code", "Tercatat di composer.json", 5.0)
QR = "app/Support/Qr.php"; r.kamera(None); r.tanda("b02_qr"); b.ubah(QR, acuan(QR, T), cps=26); time.sleep(0.6)
b.sorot(QR, "public static function svg", "Di tampilan cukup satu baris: Qr::svg(...)", 6.5, tanda="b02_bungkus", n=6)
b.sorot(QR, "new SvgImageBackEnd", "SVG: gambar dari garis dan kotak, tetap tajam saat dicetak", 8.0, tanda="b02_svg"); r.tanda("b02_akhir")
# b03 layout cetak + cetak.css
LC = "resources/views/layouts/cetak.blade.php"; r.kamera(None); r.tanda("b03"); b.ubah(LC, acuan(LC, T), cps=30); time.sleep(0.6); r.tanda("b03_lc"); b.editor(); r.label("Layout kedua: tanpa menu, hanya struk dan dua tombol", 4.0); time.sleep(4.0)
CS = "public/css/cetak.css"; b.salin(CS, tag=T); r.tanda("b03_css"); b.lihat(CS, jeda=0.8); r.label("cetak.css: salin dari github.com/listyantidewi1/SiParkir", 4.0); time.sleep(4.0)
b.sorot(CS, "@page { size: 58mm 120mm", "Ukuran kertas: lebar 58 mm, panjang 120 mm", 10.5, tanda="b03_page")
b.sorot(CS, "@media print {", "Saat dicetak: tombol disembunyikan", 8.0, tanda="b03_print", n=5); r.tanda("b03_akhir")
# b04 tiket
TK = "resources/views/parkir/tiket.blade.php"; r.kamera(None); r.tanda("b04"); b.lihat(TK, jeda=0.6); b.ubah(TK, acuan(TK, T), cps=32); time.sleep(0.6)
b.sorot(TK, "<table>", "Plat, jenis, area, jam masuk, dan petugas", 7.0, tanda="b04_isi", n=7)
b.sorot(TK, "{!! App\\Support\\Qr::svg($parking->ticket) !!}", "Kode QR memuat nomor tiket", 3.2, tanda="b04_qr")
r.tanda("b04_seru"); r.label("{!! !!}: pengaman Blade dimatikan untuk baris ini", 12.5); time.sleep(12.5)
r.tanda("b04_aman"); r.label("Aman: isinya gambar buatan pustaka kita sendiri", 6.5); time.sleep(6.5); r.tanda("b04_akhir")
# b05 struk
SK = "resources/views/parkir/struk.blade.php"; r.kamera(None); r.tanda("b05"); b.lihat(SK, jeda=0.6); b.ubah(SK, acuan(SK, T), cps=32); time.sleep(0.6)
b.sorot(SK, "<table>", "Jam masuk, jam keluar, lama parkir", 4.5, tanda="b05_isi", n=7)
b.sorot(SK, "$parking->fee", "Dibaca dari tabel parkings: angka yang disimpan saat keluar", 14.5, tanda="b05_fee"); r.tanda("b05_akhir")
# b08 commit
b.term(); b.commit("Tiket dan struk 58 mm", "b08_commit"); time.sleep(1.0); r.tanda("b08_commit_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-09"); print("CACAT", CACAT); banding(T); print(sh("git status --short | head; git log --oneline | head -3").stdout)
