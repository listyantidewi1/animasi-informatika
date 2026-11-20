NAMA = "P04_sql"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
KODE = ["CREATE TABLE alat (", "    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,", "    kategori_id INT UNSIGNED NOT NULL,", "    nama VARCHAR(100) NOT NULL,", "    FOREIGN KEY (kategori_id) REFERENCES kategori (id)", "        ON DELETE CASCADE", ");"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 4', judul='SQL dengan tangan', sub='Tujuh tabel menjadi nyata di MySQL', lapis='database'))],
 2: [R('b02', 'b02_id', kalimat=0, maks=5), R('b02_id', 'b02_notnull', kalimat=2), R('b02_notnull', 'b02_unik', kalimat=3), R('b02_unik', 'b02_enum', kalimat=4), R('b02_enum', 'b02_akhir', kalimat=5)],
 3: [R('b03', 'b03_kat', maks=14), R('b03_kat', 'b03_alat', kalimat=0), R('b03_alat', 'b03_fk', kalimat=1), R('b03_fk', 'b03_check', kalimat=2), R('b03_check', 'b03_akhir', kalimat=3)],
 4: [R('b04', 'b04_fk', maks=6), R('b04_fk', 'b04_null', kalimat=0), R('b04_null', 'b04_index', kalimat=1), R('b04_index', 'b04_akhir', kalimat=2), A('poin', kalimat=3, min=5, a=dict(judul='Index: seperti daftar isi di belakang buku', warna='#2dd4bf', kol=2, tinggi=360, item=[
        dict(besar='Tanpa index', judul='Membaca semua baris satu per satu', isi='Makin banyak data, makin lama.', warna='#ff6b6b'),
        dict(besar='Dengan index', judul='Langsung ke baris yang dicari', isi='Tetap cepat walaupun datanya puluhan ribu baris.', warna='#a3e635')]))],
 5: [R('b05', 'b05_unik', kalimat=0), R('b05_unik', 'b05_atur', kalimat=2), R('b05_atur', 'b05_akhir', kalimat=3)],
 6: [R('b06', 'b06_masuk', kalimat=1, maks=1.5), R('b06_masuk', 'b06_akhir', kalimat=4, maks=1.5)],
 7: [R('b07', 'b07_stok', kalimat=1, maks=2.5), R('b07_stok', 'b07_fk', kalimat=2, maks=1.5), R('b07_fk', 'b07_akhir', kalimat=4, maks=2)],
 8: [R('b08', 'b08_join', kalimat=1, maks=1.5), R('b08_join', 'b08_akhir', kalimat=2, maks=1.5)],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='buat tabel alat, kategori harus bisa dihapus tanpa error', kode=KODE, size=34, w=1400))],
 10: [A('masalahAI', a=dict(kode=KODE, size=30, w=1640, masalah=[
        dict(k=0, judul='CASCADE berarti menular', isi='Kategori Audio dihapus: semua alat di kategori itu ikut terhapus, tanpa peringatan.', sorot=[5]),
        dict(k=2, judul='Riwayat pinjam bisa ikut hilang', isi='Kalau tabel peminjaman juga memakai CASCADE.', sorot=[5]),
        dict(k=3, judul='Tanpa CASCADE, MySQL menolak', isi='Penolakan itulah yang kita inginkan.', sorot=[4], warna='#a3e635')])), R('b10_commit', 'b10_akhir', kalimat=5, maks=1.5), A('lanjut', kalimat=5, min=9, a=dict(selesai='Tujuh tabel sudah ada, dan aturannya dijaga oleh database.', berikut='Bab 5: Function dan stored procedure'))],
}
