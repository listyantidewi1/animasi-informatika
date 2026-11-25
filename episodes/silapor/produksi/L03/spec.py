NAMA = "L03_data"
REKAMAN = []
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
KODE = ["CREATE TABLE aduan (", "    id            INT PRIMARY KEY,", "    nama_pelapor  VARCHAR(100),", "    kategori      VARCHAR(50),", "    isi           TEXT,", "    status        VARCHAR(20),", "    tanggapan     TEXT,", "    tanggal       VARCHAR(20)", ");"]
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 3', judul='Merancang data', sub='Empat tabel dan hubungannya', lapis='database'))],
 2: [A('kataBenda')], 3: [A('tabelUsers')], 4: [A('kategoriTabel')], 5: [A('tabelReports')], 6: [A('foreignKey')], 7: [A('riwayatTertimpa')], 8: [A('tabelRiwayat')], 9: [A('statusSalinan')], 10: [A('alurStatus')],
 11: [A('poin', a=dict(judul='Tipe data', warna='#2dd4bf', kol=3, tinggi=380, item=[
        dict(k=1, besar='timestamp', mono=True, judul='Waktu, bukan teks', isi='Bisa diurutkan dan disaring per bulan.'),
        dict(k=2, besar='100', mono=True, judul='Panjang judul', isi='Judul dibatasi seratus karakter.'),
        dict(k=3, besar='string', mono=True, judul='Status: teks pendek', isi='Nilainya kita jaga dari kode.')]))],
 12: [A('erdLengkap')],
 13: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan tabel untuk aplikasi pengaduan', kode=KODE, size=30, w=1300))],
 14: [A('masalahAI', a=dict(kode=KODE, size=24, w=1640, masalah=[
        dict(k=1, judul='Tanggapan hanya satu kolom', isi='Setiap balasan baru menimpa balasan lama.', sorot=[6]),
        dict(k=2, judul='Tanggal disimpan sebagai teks', isi='“28/11” tidak bisa diurutkan dengan benar, dan tidak bisa disaring per bulan.', sorot=[7]),
        dict(k=3, judul='Nama pelapor diketik sebagai teks', isi='Siapa pun bisa melapor atas nama orang lain.', sorot=[2])],
        tantangan=dict(k=4, tantangan='Tambahkan satu tabel ke rancangan kita, supaya satu laporan bisa punya lebih dari satu foto.', berikut='Bab 4: Migration dan SQL')))],
}
