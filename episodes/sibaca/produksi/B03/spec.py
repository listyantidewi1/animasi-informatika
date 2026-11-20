NAMA = "B03_database"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KAI = ["-- mencatat peminjaman", "UPDATE buku", "SET stok = stok - 1", "WHERE id = 7;"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 3', judul='Merancang database', sub='Empat tabel, dan cara mereka saling menunjuk', lapis='database'))],
 2: [A('empatTabel')],
 3: [R('b03', 'b03_id', maks=3.5), R('b03_id', 'b03_nis', kalimat=2), R('b03_nis', 'b03_sandi', kalimat=3), R('b03_sandi', 'b03_peran', kalimat=4), R('b03_peran', 'b03_aktif', kalimat=5),
     R('b03_aktif', 'b03_akhir', kalimat=6), E('b04', 'b04_buku', 3)],
 4: [R('b04_buku', 'b04_index'), R('b04_index', 'b04_fk', kalimat=1), R('b04_fk', 'b04_kode', kalimat=2), R('b04_kode', 'b04_status', kalimat=3), R('b04_status', 'b04_akhir', kalimat=4), E('b05', 'b05_fk', 3)],
 5: [R('b05_fk', 'b05_tgl'), R('b05_tgl', 'b05_null', kalimat=1), R('b05_null', 'b05_drop', kalimat=2), R('b05_drop', 'b05_awas', kalimat=3), R('b05_awas', 'b05_akhir', kalimat=4)],
 6: [R('b06', 'b06_sandi', maks=1.3), R('b06_sandi', 'b06_masuk', kalimat=1), R('b06_masuk', 'b06_akhir', kalimat=2, maks=2)],
 7: [R('b07', 'b07_ubah', maks=2.2), R('b07_ubah', 'b07_tanya', kalimat=2, maks=2), R('b07_tanya', 'b07_hasil', kalimat=3, maks=2), R('b07_hasil', 'b07_akhir', kalimat=5)],
 8: [R('b08', 'b08_tolak', maks=1.5), R('b08_tolak', 'b08_akhir', kalimat=2)],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='catat peminjaman buku', kode=KAI, size=44, w=1100))],
 10: [A('masalahAI', a=dict(kode=KAI, size=30, w=1640, masalah=[
        dict(k=1, judul='Buku fisik yang mana?', isi='Kalau satu rusak atau hilang, tidak ada yang tahu siapa peminjam terakhirnya.', sorot=[2]),
        dict(k=2, judul='Stok bisa menjadi -1', isi='Dua orang meminjam buku terakhir pada saat yang sama, dan tidak ada yang mencegahnya.', sorot=[2]),
        dict(k=3, judul='Salah ketik tidak ketahuan', isi='Satu-satunya cara memeriksa angka stok adalah menghitung ulang seluruh rak.', sorot=[2])])),
      A('barisNyata', kalimat=4, min=7), R('b10_commit', 'b10_akhir', kalimat=5, maks=2.5),
      A('lanjut', kalimat=6, min=9, a=dict(selesai='Empat tabel ada di MySQL, dan sudah dicoba dengan satu judul dan tiga eksemplar.', tanya='Browser tidak bisa berbicara langsung dengan MySQL. Siapa perantaranya?', berikut='Bab 4: API dengan Express'))],
}
