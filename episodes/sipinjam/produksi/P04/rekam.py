import sys, time; sys.path.insert(0, "/home/user/pinjam/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-01", "kosong")
b = Bab("/home/user/pinjam/P04/rek"); r = b.r
F = "database/01_tabel.sql"; PENUH = acuan(F)
def tabel(nama): i = PENUH.index("CREATE TABLE " + nama); return PENUH[i:PENUH.index(");\n", i) + 3]
T1 = "-- SiPinjam: tabel-tabel database.\n\n" + tabel("pengguna")
T2 = T1 + "\n" + tabel("kategori") + "\n" + tabel("alat")
T3 = T2 + "\n" + tabel("peminjaman")
r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 pengguna
r.tanda("b02"); b.ubah(F, T1, cps=13); time.sleep(0.6)
b.sorot(F, "id INT UNSIGNED AUTO_INCREMENT", "Nomor urut otomatis, tanda pengenal unik", 9.0, tanda="b02_id"); b.sorot(F, "nama VARCHAR(100) NOT NULL", "NOT NULL: wajib diisi", 4.0, tanda="b02_notnull")
b.sorot(F, "username", "UNIQUE: tidak boleh kembar", 5.5, tanda="b02_unik"); b.sorot(F, "peran ENUM", "Tiga pilihan, bawaannya peminjam", 7.5, tanda="b02_enum", zoom=1.25); r.tanda("b02_akhir")
# b03 kategori + alat
r.kamera(None); r.tanda("b03"); b.ubah(F, T2, cps=20); time.sleep(0.6)
b.sorot(F, "CREATE TABLE kategori", "Tabel kategori: dua kolom", 3.0, tanda="b03_kat", n=4); b.sorot(F, "CREATE TABLE alat", "Tabel alat", 3.0, tanda="b03_alat", n=8)
b.sorot(F, "FOREIGN KEY (kategori_id)", "kategori_id harus ada di tabel kategori", 7.5, tanda="b03_fk"); b.sorot(F, "CHECK (stok", "Stok tidak boleh melebihi jumlah total", 6.5, tanda="b03_check"); r.tanda("b03_akhir")
# b04 peminjaman
r.kamera(None); r.tanda("b04"); b.ubah(F, T3, cps=24); time.sleep(0.6)
b.sorot(F, "FOREIGN KEY (pengguna_id)", "Ke peminjam, ke alat, ke petugas", 7.0, tanda="b04_fk", n=3); b.sorot(F, "petugas_id INT UNSIGNED NULL", "Boleh kosong: belum diproses siapa pun", 6.0, tanda="b04_null")
b.sorot(F, "INDEX (status)", "Index: pencarian tetap cepat", 9.0, tanda="b04_index", n=2); r.tanda("b04_akhir")
# b05 tiga tabel lain dari GitHub
r.kamera(None); r.tanda("b05"); b.taruh(F, PENUH); b.lihat(F, "CREATE TABLE pengembalian", jeda=0.5); r.label("Tiga tabel lain: salin dari GitHub", 5.0); time.sleep(5.5)
b.sorot(F, "peminjaman_id INT UNSIGNED NOT NULL UNIQUE", "Satu peminjaman, satu pengembalian", 7.0, tanda="b05_unik"); b.sorot(F, "INSERT INTO pengaturan", "Denda Rp2.000 per hari, paling lama 7 hari", 8.0, tanda="b05_atur", n=3); r.tanda("b05_akhir")
# b06 jalankan
b.term(); r.tanda("b06"); b.jalan("mysql -u root sipinjam < database/01_tabel.sql", tunggu=1.5, cps=12, label="<  isi berkas dikirim ke MySQL", dur=5.0); time.sleep(5.0)
r.tanda("b06_masuk"); b.besar(); r.terminal("mysql -u root sipinjam", cps=14, tunggu=0.5); b.tunggu("mysql>"); time.sleep(1.0); r.tekan("Control+l", 0.4)
r.tanda("b06_show"); b.sql("SHOW TABLES;", "Tujuh tabel kita sudah ada", 4.0, cps=12); r.tanda("b06_akhir")
# b07 melanggar aturan
r.tekan("Control+l", 0.4); r.tanda("b07"); b.sql("INSERT INTO kategori (nama) VALUES ('Kamera dan Foto'), ('Audio');", cps=24, tunggu=1.0)
b.sql(["INSERT INTO alat (kategori_id, kode, nama, jumlah_total, stok) VALUES", "(1, 'KAM-01', 'Kamera DSLR', 2, 2),", "(2, 'MIC-01', 'Mikrofon wireless', 3, 3);"], "Dua kategori dan dua alat", 3.5, cps=26)
r.tekan("Control+l", 0.4); r.tanda("b07_stok"); b.sql("UPDATE alat SET stok = stok - 5 WHERE id = 1;", "Ditolak: stok tidak bisa negatif", 6.0, cps=14)
r.tanda("b07_fk"); b.sql(["INSERT INTO alat (kategori_id, kode, nama, jumlah_total, stok)", "VALUES (99, 'XX-01', 'Alat coba', 1, 1);"], "Ditolak: kategori 99 tidak ada", 6.0, cps=22); time.sleep(4.0); r.tanda("b07_akhir")
# b08 JOIN
r.tekan("Control+l", 0.4); r.tanda("b08"); b.sql("SELECT nama, kategori_id FROM alat;", "Tabel alat hanya menyimpan nomor kategori", 5.0, cps=16)
r.tanda("b08_join"); b.sql(["SELECT alat.nama, kategori.nama AS kategori", "FROM alat", "JOIN kategori ON kategori.id = alat.kategori_id;"], "Nama alat dan nama kategori berdampingan", 7.0, cps=16); time.sleep(3.0); r.tanda("b08_akhir")
b.sql("exit", tunggu=1.0); r.tekan("Control+l", 0.3); b.kecil()
# b10 commit
b.term(); b.commit("tujuh tabel", "b10_commit"); time.sleep(1.0); r.tanda("b10_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-04"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3").stdout)
