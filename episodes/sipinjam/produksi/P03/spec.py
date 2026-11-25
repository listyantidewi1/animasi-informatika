NAMA = "P03_rancang"
REKAMAN = []
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
KODE = ['CREATE TABLE pengembalian (', '    id INT AUTO_INCREMENT PRIMARY KEY,', '    peminjaman_id INT,', '    tanggal_kembali VARCHAR(20),', '    denda FLOAT', ');']
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 3', judul='Merancang database', sub='Tujuh tabel dan hubungannya, di atas kertas dulu', lapis='database'))],
 2: [A('poin', tambah=1.5, a=dict(judul='Cari kata benda di daftar aturan', warna='#2dd4bf', kol=4, tinggi=230, sj=34, si=24, item=[
        dict(k=1, d=.4, judul='pengguna', mono=1, isi='Siswa, guru, petugas, admin.'), dict(k=1, d=1.4, judul='alat', mono=1, isi='Kamera, proyektor, tripod.'),
        dict(k=1, d=2.1, judul='kategori', mono=1, isi='Kelompok alat.'), dict(k=1, d=3.3, judul='peminjaman', mono=1, isi='Siapa meminjam apa, kapan.'),
        dict(k=1, d=4.3, judul='pengembalian', mono=1, isi='Tanggal kembali dan denda.'), dict(k=1, d=5.3, judul='log_aktivitas', mono=1, isi='Catatan setiap perubahan.'),
        dict(k=2, d=.6, judul='pengaturan', mono=1, isi='Tarif denda dan batas hari, bisa diubah Bu Sari tanpa menyentuh kode.', warna='#ffb020')]))],
 3: [A('erd1', tambah=2)],
 4: [A('erd2', tambah=2.5)],
 5: [A('poin', tambah=2, a=dict(judul='Tipe data yang ikut menjaga aturan', warna='#a78bfa', kol=2, tinggi=310, item=[
        dict(k=1, besar='DATE', mono=1, judul='Tanggal, bukan teks', isi='MySQL bisa menghitung selisih hari.', warna='#38bdf8'),
        dict(k=2, besar='DECIMAL(10, 2)', mono=1, judul='Uang', isi='Angka dengan jumlah desimal yang pasti.', warna='#a3e635'),
        dict(k=3, besar='ENUM', mono=1, judul='Status', isi='MySQL menolak nilai di luar lima pilihan.', warna='#ffb020'),
        dict(k=4, besar='INT UNSIGNED', mono=1, judul='Stok', isi='Bilangan bulat yang tidak bisa negatif: database sendiri menolak stok minus.', warna='#ff6b6b')]))],
 6: [A('cekAI', tambah=3.5, a=dict(perintah='buat tabel pengembalian', kode=KODE, size=36, w=1300, ket='Denda memakai FLOAT, dan tanggal kembali disimpan sebagai teks.', ketK=2))],
 7: [A('masalahAI', a=dict(kode=KODE, size=28, w=1640, masalah=[
        dict(k=1, judul='FLOAT membulatkan: 0.1 + 0.2 = 0.30000000447', isi='Untuk uang, selisih sekecil apa pun membuat laporan tidak cocok dengan uang di laci.', sorot=[4]),
        dict(k=3, judul="Teks diurutkan seperti kata: '2 Desember' > '10 Desember'", isi='Karena angka 2 lebih besar daripada angka 1.', sorot=[3]),
        dict(k=5, judul='Selisih hari tidak bisa dihitung', isi='Padahal denda bergantung pada selisih hari.', sorot=[3], warna='#a78bfa')])),
     A('lanjut', kalimat=6, min=9, a=dict(selesai='Rancangan tujuh tabel sudah jadi di atas kertas.', berikut='Bab 4: SQL dengan tangan'))],
}
