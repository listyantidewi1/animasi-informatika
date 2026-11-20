import sys, time, subprocess; sys.path.insert(0, "/home/user/pinjam/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-06", "skema")
b = Bab("/home/user/pinjam/P07/rek"); r = b.r
K, BT = "app/koneksi.php", "app/bantu.php"
BP = acuan(BT); BQ = BP[:BP.index("function rupiah")].rstrip() + "\n"
BQ = BQ.replace("    $GLOBALS['jumlah_query'] = ($GLOBALS['jumlah_query'] ?? 0) + 1;\n", "")
AWAL = "<?php\nrequire __DIR__ . '/koneksi.php';\nrequire __DIR__ . '/bantu.php';\n"
IDX = """<?php
require __DIR__ . '/../app/awal.php';

$alat = q('SELECT a.kode, a.nama, a.stok, k.nama AS kategori
           FROM alat a
           JOIN kategori k ON k.id = a.kategori_id
           WHERE a.aktif = TRUE
           ORDER BY k.nama, a.nama')->fetchAll();
?>
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SiPinjam</title>
<link rel="stylesheet" href="/gaya.css">
</head>
<body>
<main>
<h1>Daftar alat</h1>
<div class="grid">
<?php foreach ($alat as $a): ?>
  <div class="kartu alat">
    <span class="redup"><?= e($a['kategori']) ?> · <?= e($a['kode']) ?></span>
    <h3><?= e($a['nama']) ?></h3>
    <p>Tersedia: <b><?= $a['stok'] ?></b></p>
  </div>
<?php endforeach ?>
</div>
</main>
</body>
</html>
"""
r.mulai(); r.kamera(None); time.sleep(0.8)
# b03 koneksi.php
r.tanda("b03"); b.ubah(K, acuan(K), cps=26); time.sleep(0.6)
b.sorot(K, "$env = parse_ini_file", "Baca .env; kalau belum ada, berhenti dengan pesan jelas", 8.0, tanda="b03_env", n=4, zoom=1.15)
b.sorot(K, "static $pdo", "static: sambungan hanya dibuat satu kali", 9.0, tanda="b03_static"); r.tanda("b03_tiga"); b.sorot(K, "PDO::ATTR_ERRMODE", "Kesalahan SQL menjadi error yang terlihat", 8.5, tanda="b03_err", zoom=1.3)
b.sorot(K, "PDO::ATTR_DEFAULT_FETCH_MODE", "Hasil query: array dengan nama kolom", 5.0, tanda="b03_fetch", zoom=1.3); b.sorot(K, "PDO::ATTR_EMULATE_PREPARES", "MySQL sendiri yang memisahkan perintah dari data", 6.5, tanda="b03_emul", zoom=1.3); r.tanda("b03_akhir")
# b04 bantu.php: q dan e
r.kamera(None); r.tanda("b04"); b.ubah(BT, BQ, cps=22); time.sleep(0.6)
b.sorot(BT, "function q(", "q(SQL dengan tanda tanya, array nilai)", 10.0, tanda="b04_q", zoom=1.25); b.sorot(BT, "$st = db()->prepare($sql)", "prepare: SQL dulu. execute: nilainya menyusul", 16.0, tanda="b04_prepare", n=2, zoom=1.3)
b.sorot(BT, "function e(", "e(): teks dari pengguna tidak menjadi kode HTML", 9.0, tanda="b04_e", n=4, zoom=1.2); r.tanda("b04_akhir")
# b05 sisa bantu + awal.php
r.kamera(None); r.tanda("b05"); b.taruh(BT, BP); b.lihat(BT, "function rupiah", jeda=0.5); r.label("Fungsi bantu lainnya: salin dari GitHub", 5.0); time.sleep(6.0)
b.sorot(BT, "function csrf()", "Token CSRF: kode acak di setiap form", 9.0, tanda="b05_csrf", n=5, zoom=1.2)
r.kamera(None); r.tanda("b05_awal"); b.ubah("app/awal.php", AWAL, cps=18); r.label("awal.php: satu require untuk semua halaman", 5.0); time.sleep(5.5); r.tanda("b05_akhir")
# b06 data contoh
r.kamera(None); r.tanda("b06"); b.salin("database/isi_contoh.php"); b.lihat("database/isi_contoh.php", jeda=0.5); r.label("isi_contoh.php: salin dari GitHub", 4.0); time.sleep(4.5)
b.term(); r.tanda("b06_jalan"); b.jalan("php database/isi_contoh.php", tunggu=2.0, cps=14, sampai="Data contoh siap", label="7 akun, 12 alat, 37 pinjaman", dur=6.0); time.sleep(4.0); r.tanda("b06_akhir")
# b07 daftar alat
r.tekan("Control+l", 0.3); r.kamera(None); r.tanda("b07"); b.salin("public/gaya.css"); b.ubah("public/index.php", IDX, cps=30); time.sleep(0.6); b.lihat("public/index.php", "require __DIR__", jeda=0.3)
b.sorot("public/index.php", "require __DIR__", "Satu baris: koneksi dan fungsi bantu siap", 4.0, tanda="b07_awal", zoom=1.25); b.sorot("public/index.php", "$alat = q(", "Alat beserta nama kategorinya", 6.0, tanda="b07_q", n=5, zoom=1.2)
b.sorot("public/index.php", "<?php foreach", "Satu kartu per alat, semua teks lewat e()", 7.5, tanda="b07_foreach", n=7, zoom=1.15)
b.term(); r.tanda("b07_server"); b.jalan("php -S localhost:8000 -t public", tunggu=1.5, cps=16, sampai="started", label="Buka localhost:8000 di browser", dur=3.0); r.tanda("b07_jalan"); time.sleep(1.0)
r.tekan("Control+c", 1.5); r.tekan("Control+l", 0.3)
# b09 commit
b.commit("kerangka PHP", "b09_commit"); time.sleep(1.0); r.tanda("b09_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-07"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3").stdout)
