import sys, time, subprocess; sys.path.insert(0, "/home/user/pinjam/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-07", "contoh")
b = Bab("/home/user/pinjam/P08/rek"); r = b.r
AU, LG, PI, AD = "app/auth.php", "public/index.php", "public/peminjam/index.php", "public/admin/alat.php"
PEM = """<?php
require __DIR__ . '/../../app/awal.php';
$saya = wajib_peran('peminjam');

$alat = q('SELECT a.kode, a.nama, a.stok, k.nama AS kategori
           FROM alat a
           JOIN kategori k ON k.id = a.kategori_id
           WHERE a.aktif = TRUE
           ORDER BY k.nama, a.nama')->fetchAll();

$judul = 'Daftar alat';
require __DIR__ . '/../../app/tampilan/atas.php';
?>
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
<?php require __DIR__ . '/../../app/tampilan/bawah.php';
"""
def sementara(peran, judul, isi): return f"""<?php
require __DIR__ . '/../../app/awal.php';
$saya = wajib_peran({peran});

$judul = '{judul}';
require __DIR__ . '/../../app/tampilan/atas.php';
?>
<h1>{isi}</h1>
<p>Halaman ini kita isi di bab berikutnya.</p>
<?php require __DIR__ . '/../../app/tampilan/bawah.php';
"""
HASH = """php -r "echo password_hash('rahasia123', PASSWORD_DEFAULT), PHP_EOL;\""""
r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 password_hash
b.term(); r.tanda("b02"); b.jalan(HASH, tunggu=1.5, cps=13, label="Yang disimpan: hasil acakannya, bukan kata sandinya", dur=7.0); time.sleep(2.0)
r.tanda("b02_lagi"); b.jalan(HASH, tunggu=1.5, cps=40, label="Kata sandi sama, acakannya berbeda", dur=7.0); time.sleep(2.0)
r.tanda("b02_verify"); r.label("Saat login: password_verify(ketikan, acakan)", 6.0); time.sleep(7.0); r.tanda("b02_akhir")
# b03 auth.php
r.tekan("Control+l", 0.3); r.kamera(None); r.tanda("b03"); b.ubah(AU, acuan(AU), cps=26); time.sleep(0.6)
b.sorot(AU, "session_start()", "Sesi: server mengingat siapa yang login", 6.0, tanda="b03_sesi"); b.sorot(AU, "session_set_cookie_params", "httponly: cookie sesi tidak terbaca JavaScript", 5.5, tanda="b03_http", zoom=1.25)
b.sorot(AU, "function pengguna()", "Siapa yang sedang login?", 4.5, tanda="b03_pengguna", n=4); b.sorot(AU, "function wajib_peran", "wajib_peran: penjaga setiap halaman", 4.5, tanda="b03_wajib", zoom=1.25)
b.sorot(AU, "if (!$saya)", "Belum login: ke halaman login", 4.5, tanda="b03_belum", n=3); b.sorot(AU, "if (!in_array", "Peran tidak cocok: 403, dilarang", 9.0, tanda="b03_403", n=4, zoom=1.25)
b.sorot(AU, "function beranda", "Halaman pertama setiap peran", 5.0, tanda="b03_beranda", n=8); r.tanda("b03_awal")
r.kamera(None); b.ubah("app/awal.php", acuan("app/awal.php"), cps=18); r.label("awal.php ikut memanggil auth.php", 3.5); time.sleep(3.5); r.tanda("b03_akhir")
# b04 login
b.term(); r.tanda("b04"); b.jalan("mkdir public/peminjam", tunggu=0.8, cps=18); b.jalan("git mv public/index.php public/peminjam/index.php", tunggu=1.2, cps=20, label="Daftar alat pindah ke folder peminjam", dur=3.5)
r.tekan("Control+l", 0.3); r.kamera(None); r.tanda("b04_ketik"); b.ubah(LG, acuan(LG), cps=30); time.sleep(0.6)
b.sorot(LG, "$u = q('SELECT * FROM pengguna", "Cari pengguna dengan prepared statement", 6.5, tanda="b04_cari", zoom=1.0); b.sorot(LG, "password_verify", "Cocokkan ketikan dengan acakan", 4.0, tanda="b04_verify", zoom=1.15)
b.sorot(LG, "session_regenerate_id", "Nomor sesi diganti setelah login", 7.0, tanda="b04_regen", zoom=1.25); b.sorot(LG, "$_SESSION['pengguna'] =", "Yang diingat: id, nama, peran", 4.5, tanda="b04_simpan", zoom=1.0)
b.sorot(LG, "Username atau kata sandi salah", "Pesannya sengaja sama untuk dua kesalahan", 9.0, tanda="b04_pesan", zoom=1.2); r.tanda("b04_akhir")
# b05 tampilan
r.kamera(None); r.tanda("b05"); b.salin("app/tampilan/atas.php"); b.salin("app/tampilan/bawah.php"); b.salin("public/keluar.php"); b.lihat("app/tampilan/atas.php", jeda=0.5); r.label("atas.php, bawah.php, keluar.php: salin dari GitHub", 6.0); time.sleep(6.5)
b.sorot("app/tampilan/atas.php", "if ($saya['peran'] === 'admin')", "Menu berbeda untuk setiap peran", 5.0, tanda="b05_menu", n=14, zoom=1.1); r.kamera(None); time.sleep(4.0); r.tanda("b05_akhir")
# b06 penjaga
r.tanda("b06"); b.ubah(PI, PEM, cps=30); b.sorot(PI, "wajib_peran('peminjam')", "Hanya peminjam yang boleh masuk", 6.0, tanda="b06_wajib", zoom=1.25)
r.kamera(None); r.tanda("b06_admin"); b.ubah(AD, sementara("'admin'", "Alat", "Halaman admin"), cps=30); b.sorot(AD, "wajib_peran('admin')", "Halaman sementara admin", 3.5, tanda="b06_admin_wajib", zoom=1.25)
b.taruh("public/petugas/index.php", sementara("'petugas', 'admin'", "Permintaan", "Halaman petugas")); b.sorot("public/petugas/index.php", "wajib_peran('petugas', 'admin')", "Halaman sementara petugas", 3.5, tanda="b06_petugas", zoom=1.25); r.tanda("b06_akhir")
# b08 penutup: baris penjaga, commit
r.kamera(None); r.tanda("b08"); b.sorot(AD, "wajib_peran('admin')", "Setiap halaman memeriksa perannya sendiri", 8.0, tanda="b08_wajib", zoom=1.25)
b.term(); b.commit("login dan peran", "b08_commit"); time.sleep(1.0); r.tanda("b08_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-08"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3").stdout)
