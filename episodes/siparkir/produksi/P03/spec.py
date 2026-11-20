NAMA = "P03_database"
REKAMAN = []
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
KODE = ["CREATE TABLE parkir (", "    id INT AUTO_INCREMENT PRIMARY KEY,", "    plat VARCHAR(20),", "    jenis VARCHAR(10),", "    jam_masuk DATETIME,", "    jam_keluar DATETIME,", "    biaya FLOAT", ");"]
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 3', judul='Merancang database', sub='Denah bangunan kita: enam tabel dan hubungannya', lapis='database'))],
 2: [A('kataBenda')], 3: [A('usersRates')], 4: [A('areas')], 5: [A('vehicles')], 6: [A('parkings')], 7: [A('kolomOpen')], 8: [A('erd')],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan tabel untuk aplikasi parkir', kode=KODE, size=32, w=1300))],
 10: [A('masalahAI', a=dict(kode=KODE, size=26, w=1640, masalah=[
        dict(k=1, judul='biaya FLOAT', isi='Penjumlahan ribuan transaksi bisa meleset beberapa rupiah.', sorot=[6]),
        dict(k=2, judul='Plat disimpan apa adanya di setiap baris', isi='"N 1234 AB", "N1234AB", dan "n 1234 ab" tercatat sebagai tiga kendaraan.', sorot=[2]),
        dict(k=3, judul='Tidak ada yang mencegah masuk dua kali', isi='Tidak ada aturan unik, jadi satu kendaraan bisa punya dua baris tanpa jam keluar.', sorot=[4, 5])],
        tantangan=dict(k=4, tantangan='Gambar rancangan ini di kertas, lalu tambahkan satu tabel untuk kartu langganan.', berikut='Bab 4: Migration dan model')))],
}
