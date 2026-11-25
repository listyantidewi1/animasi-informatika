import sys, time; sys.path.insert(0, "/home/user/baca/alat")
from tulis import Bab, CACAT, sh, matikan, siapkan, acuan
siapkan("bab-01", "kosong")
b = Bab("/home/user/baca/B03/rek"); r = b.r
S = "database/schema.sql"; F = acuan(S)
S1 = F[:F.index("CREATE TABLE buku")].rstrip() + "\n"; S2 = F[:F.index("CREATE TABLE peminjaman")].rstrip() + "\n"
r.mulai(); r.kamera(None); time.sleep(1.0)
# b03 tabel pengguna
r.tanda("b03"); b.ubah(S, S1, cps=16); time.sleep(0.6); r.tanda("b03_ketik")
b.sorot(S, "id INT AUTO_INCREMENT", "id: bernomor otomatis, primary key", 4.5, tanda="b03_id")
b.sorot(S, "nis VARCHAR", "UNIQUE: tidak boleh ada dua yang sama", 6.0, tanda="b03_nis")
b.sorot(S, "sandi_hash", "Kata sandi yang sudah diacak (Bab 5)", 6.0, tanda="b03_sandi")
b.sorot(S, "peran ENUM", "Hanya dua pilihan, bawaannya anggota", 6.0, tanda="b03_peran")
b.sorot(S, "aktif BOOLEAN", "Akun baru: belum aktif", 6.0, tanda="b03_aktif"); r.tanda("b03_akhir")
# b04 buku dan eksemplar
r.kamera(None); r.tanda("b04"); b.ubah(S, S2, cps=16); time.sleep(0.6)
b.sorot(S, "judul VARCHAR", "Tabel buku: judul, penulis, kategori, tahun", 5.0, tanda="b04_buku", n=4)
b.sorot(S, "INDEX (kategori)", "INDEX: pencarian lebih cepat", 8.5, tanda="b04_index", n=2)
b.sorot(S, "buku_id INT NOT NULL", "buku_id: milik judul yang mana", 4.0, tanda="b04_fk")
b.sorot(S, "FOREIGN KEY (buku_id)", "Wajib menunjuk ke id yang ada di tabel buku", 6.0)
b.sorot(S, "kode VARCHAR", "Kode di label buku, tidak boleh kembar", 4.5, tanda="b04_kode")
b.sorot(S, "status ENUM", "tersedia, dipinjam, atau hilang", 4.5, tanda="b04_status"); r.tanda("b04_akhir")
# b05 peminjaman
r.kamera(None); r.tanda("b05"); b.ubah(S, F, cps=16); time.sleep(0.6)
b.sorot(S, "eksemplar_id INT NOT NULL", "Eksemplar mana, dipinjam siapa", 4.0, tanda="b05_fk", n=2)
b.sorot(S, "tgl_pinjam", "Pinjam, jatuh tempo, kembali", 4.5, tanda="b05_tgl", n=3)
b.sorot(S, "tgl_kembali DATETIME NULL", "NULL (kosong) = masih dipinjam", 5.5, tanda="b05_null")
b.sorot(S, "DROP TABLE IF EXISTS", "Menghapus tabel lama, beserta isinya!", 8.0, tanda="b05_drop")
r.tanda("b05_awas"); r.label("Jangan dijalankan di database berisi data sungguhan", 5.5); time.sleep(6.0); r.tanda("b05_akhir")
# b06 menjalankan schema.sql
b.term(); r.tanda("b06"); r.terminal("mysql -u sibaca -p sibaca < database/schema.sql", cps=14, tunggu=0.5); b.tunggu("Enter password"); time.sleep(1.5)
r.tanda("b06_sandi"); r.label("Kata sandi pengguna sibaca (tidak terlihat saat diketik)", 4.5); time.sleep(1.0); r.ketik("gantiSandiIni!", 8); time.sleep(0.6); r.tekan("Enter", 1.5); time.sleep(2.0)
b.besar(); r.tanda("b06_masuk"); b.mysql(bersih=False); r.kamera_terminal()
b.sql("SHOW TABLES;", "Empat tabel kita sudah ada", 4.5); r.tanda("b06_akhir")
# b07 mencoba
r.tekan("Control+l", 0.4); r.tanda("b07")
b.sql(["INSERT INTO buku (judul, penulis, kategori, tahun)", "VALUES ('Laskar Pelangi', 'Andrea Hirata', 'Novel', 2005);"], "Satu judul", 2.5, cps=18)
b.sql(["INSERT INTO eksemplar (buku_id, kode)", "VALUES (1, 'B0001-1'), (1, 'B0001-2'), (1, 'B0001-3');"], "Tiga eksemplar, kodenya berbeda", 3.5, cps=18)
r.tanda("b07_ubah"); b.sql("UPDATE eksemplar SET status = 'dipinjam' WHERE kode = 'B0001-2';", "Satu eksemplar dipinjam", 3.0, cps=18)
r.tekan("Control+l", 0.4); r.tanda("b07_tanya")
b.sql(["SELECT b.judul, COUNT(e.id) AS jumlah,", "SUM(e.status = 'tersedia') AS tersedia", "FROM buku b JOIN eksemplar e ON e.buku_id = b.id", "GROUP BY b.id;"], tunggu=1.5, cps=18)
r.tanda("b07_hasil"); r.label("3 eksemplar, 2 tersedia", 5.0); time.sleep(6.5); r.tanda("b07_akhir")
# b08 penjaga
r.tekan("Control+l", 0.4); r.tanda("b08"); b.sql(["INSERT INTO eksemplar (buku_id, kode)", "VALUES (99, 'B0099-1');"], tunggu=1.5, cps=16)
r.tanda("b08_tolak"); r.label("Ditolak: buku nomor 99 tidak ada", 6.0); time.sleep(7.0); r.tanda("b08_akhir")
b.sql("exit", tunggu=1.0); b.kecil()
# b10 commit
b.term(); b.commit("Rancangan database", tanda="b10_commit"); time.sleep(1.0); r.tanda("b10_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
matikan(); sh("git tag -f bab-03"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3").stdout)
