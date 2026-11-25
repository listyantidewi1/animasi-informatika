import sys, time, subprocess; sys.path.insert(0, "/home/user/pinjam/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-08", "contoh")
b = Bab("/home/user/pinjam/P09/rek"); r = b.r
AL, FM, HP = "public/admin/alat.php", "public/admin/alat_form.php", "public/admin/alat_hapus.php"
r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 daftar alat admin
r.tanda("b02"); b.ubah(AL, acuan(AL), cps=45); time.sleep(0.6); b.lihat(AL, "wajib_peran", jeda=0.3)
b.sorot(AL, "wajib_peran('admin')", "Seperti biasa: penjaga di baris atas", 4.5, tanda="b02_wajib", zoom=1.25); b.sorot(AL, "$total = (int) q(", "Hitung dulu jumlah seluruhnya", 6.0, tanda="b02_total", n=2, zoom=1.0)
b.sorot(AL, "LIMIT ? OFFSET ?", "LIMIT: berapa diambil. OFFSET: berapa dilewati", 16.0, tanda="b02_limit", zoom=1.0); b.sorot(AL, "WHERE a.nama LIKE ?", "Pencarian: LIKE, nilainya tetap lewat tanda tanya", 7.5, tanda="b02_like", zoom=1.0); r.tanda("b02_akhir")
# b03 form tambah dan ubah
r.kamera(None); r.tanda("b03"); b.ubah(FM, acuan(FM), cps=50); time.sleep(0.6); b.lihat(FM, "$id = (int)", jeda=0.3)
b.sorot(FM, "$id = (int) ($_GET['id']", "Ada id: mengubah. Tidak ada: menambah", 9.0, tanda="b03_id", n=2, zoom=1.1)
r.tanda("b03_validasi"); b.sorot(FM, "preg_match", "Kode 2 sampai 20 karakter", 5.5, tanda="b03_v1", zoom=1.0); b.sorot(FM, "$data['nama'] === ''", "Nama wajib diisi", 2.6, tanda="b03_v2", zoom=1.0)
b.sorot(FM, "SELECT 1 FROM kategori", "Kategori harus ada", 3.0, tanda="b03_v3", zoom=1.0); b.sorot(FM, "$data['jumlah_total'] < 1", "Jumlah minimal 1", 2.6, tanda="b03_v4", zoom=1.0)
b.sorot(FM, "SELECT 1 FROM alat WHERE kode", "Kode tidak boleh kembar", 3.5, tanda="b03_v5", zoom=1.0); b.sorot(FM, "<?php foreach ($galat as $g)", "Semua pesan ditampilkan bersama", 9.0, tanda="b03_galat", zoom=1.0); r.tanda("b03_akhir")
# b04 stok menyesuaikan
r.tanda("b04"); b.sorot(FM, "$dipinjam = $lama", "Sedang dipinjam = jumlah total - stok", 11.0, tanda="b04_dipinjam", n=2, zoom=1.0)
b.sorot(FM, "q('UPDATE alat SET kode", "Stok baru = jumlah baru - yang sedang dipinjam", 9.0, tanda="b04_stok", n=2, zoom=1.0); r.kamera(None); time.sleep(0.8); r.tanda("b04_akhir")
# b06 hapus
r.tanda("b06"); b.ubah(HP, acuan(HP), cps=24); time.sleep(0.6)
b.sorot(HP, "q('DELETE FROM alat", "Coba hapus sungguhan", 6.0, tanda="b06_delete", zoom=1.25); b.sorot(HP, "catch (PDOException", "23000: ditolak foreign key, alat punya riwayat", 8.0, tanda="b06_catch", n=5, zoom=1.1)
b.sorot(HP, "UPDATE alat SET aktif = FALSE", "Gantinya: dinonaktifkan", 5.0, tanda="b06_nonaktif", n=2, zoom=1.1); r.tanda("b06_akhir")
# b07 tiga halaman lain
r.kamera(None); r.tanda("b07")
for f in ("kategori", "pengguna", "log"): b.salin(f"public/admin/{f}.php")
b.lihat("public/admin/kategori.php", jeda=0.5); r.label("kategori.php, pengguna.php, log.php: salin dari GitHub", 8.0); time.sleep(9.0)
b.sorot("public/admin/pengguna.php", "password_hash($sandi", "Kata sandi baru langsung diacak", 6.0, tanda="b07_hash", zoom=1.0); r.tanda("b07_akhir")
# b09 commit
b.term(); b.commit("halaman admin", "b09_commit"); time.sleep(1.0); r.tanda("b09_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-09"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3").stdout)
