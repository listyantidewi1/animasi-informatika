NAMA = "A03_sql"
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
ZOOM = (0.05, 0, 0.9, 0.9)  # terminal psql penuh: sedikit diperbesar, baris terpanjang (pesan error) tetap utuh
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 3', judul='SQL dengan\ntangan sendiri', sub='Ilmu yang berlaku di framework apa pun', lapis='database', catatan=['Belum memasang PostgreSQL?', 'Lihat chapter Persiapan di awal video']))],
 2: [R('b02', 'b02_berkas', da=-0.4), A('catatan', bg=True, min=8, a=dict(judul='Kenapa ditulis di berkas?',
      baris=['schema.sql tersimpan bersama kode', 'Bisa dijalankan ulang kapan saja', 'Ikut masuk Git'])), R('b02_berkas', 'b03')],
 3: [R('b03', 'b05')],
 4: [A('gerbang')],
 5: [R('b05', 'b05_akhir'), A('catatan', bg=True, min=10, a=dict(judul='UNIQUE (service_id, service_date, number)', mono=False,
      baris=['Layanan yang sama, hari yang sama:', 'tidak boleh ada dua nomor yang sama.', 'Nomor ganda ditolak oleh database.']))],
 6: [R('b06', 'b06_akhir'), A('zonaWaktu', bg=True)],
 7: [R('b07', 'b07_simpan', speed=4, maks=4), R('b07_simpan', 'b07_akhir', maks=1.3, crop=ZOOM)],
 8: [R('b08', 'b08_akhir', db=0.5, maks=1.4, crop=ZOOM)],
 9: [R('b08_akhir', 'b09_simpan', speed=6, maks=6), R('b09_simpan', 'b09_akhir', speed=1.4, maks=1.4)],
 10: [R('b10', 'b10_akhir', da=-0.2, crop=ZOOM)],
 11: [A('join', min=12), R('b11', 'b11_akhir', crop=ZOOM)],
 12: [A('posisi', min=16), R('b12', 'b12_akhir', crop=ZOOM)],
 13: [R('b13', 'b13_akhir', maks=1.3, crop=ZOOM), A('keranjang', min=11)],
 14: [A('queryAI')],
 15: [A('avgNull', min=18), R('b15', 'b15_akhir', speed=1.4, maks=1.6, crop=ZOOM)],
 16: [R('b16', 'b16_akhir'), A('tantangan', min=12, a=dict(tantangan='Tulis query untuk mencari jam tersibuk, yaitu jumlah tiket per jam dalam sehari. Petunjuk: cari fungsi extract di PostgreSQL.', berikut='Bab 4: Server pertama'))],
}
