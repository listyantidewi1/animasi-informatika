NAMA = "P09_admin"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
KODE = ["// admin/log.php", "$log = q('SELECT * FROM log_aktivitas ORDER BY id DESC')->fetchAll();", "",
        "// admin/alat_hapus.php", "q('DELETE FROM peminjaman WHERE alat_id = ?', [$id]);", "q('DELETE FROM alat WHERE id = ?', [$id]);", "pesan('Alat dihapus.');"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 9', judul='Halaman admin', sub='Tambah, ubah, hapus, dengan data yang diperiksa', lapis='server'))],
 2: [R('b02', 'b02_wajib', kalimat=0, maks=12), R('b02_wajib', 'b02_total', kalimat=1), R('b02_total', 'b02_limit', kalimat=2), R('b02_limit', 'b02_like', kalimat=4), R('b02_like', 'b02_akhir', kalimat=6)],
 3: [R('b03', 'b03_id', kalimat=0, maks=26), R('b03_id', 'b03_validasi', kalimat=1), R('b03_v1', 'b03_v2', kalimat=4), R('b03_v2', 'b03_v3', kalimat=5), R('b03_v3', 'b03_v4', kalimat=6), R('b03_v4', 'b03_v5', kalimat=7),
     R('b03_v5', 'b03_galat', kalimat=8), R('b03_galat', 'b03_akhir', kalimat=9)],
 4: [R('b04', 'b04_stok', kalimat=2), R('b04_stok', 'b04_akhir', kalimat=3)],
 5: [W('daftar', 'tambah', maks=2.5), W('tambah', 'salah', kalimat=1, maks=1.5), W('salah', 'benar', kalimat=2), W('benar', 'muncul', kalimat=3, maks=1.5), W('muncul', 'tambah_akhir', kalimat=4)],
 6: [R('b06', 'b06_delete', kalimat=0, maks=10), R('b06_delete', 'b06_catch', kalimat=1), W('hapus', 'riwayat', kalimat=2), R('b06_catch', 'b06_nonaktif', kalimat=3), R('b06_nonaktif', 'b06_akhir', kalimat=4), W('riwayat', 'hapus_akhir', kalimat=5)],
 7: [R('b07', 'b07_hash', kalimat=0), R('b07_hash', 'b07_akhir', kalimat=1), W('log', 'akhir', kalimat=2)],
 8: [A('cekAI', tambah=3.5, a=dict(perintah='buat halaman log, dan tombol hapus alat yang tidak pernah error', kode=KODE, size=28, w=1560))],
 9: [A('masalahAI', a=dict(kode=KODE, size=26, w=1640, masalah=[
        dict(k=0, judul='Log tanpa LIMIT: ratusan ribu baris sekaligus', isi='Setahun kemudian, halaman ini membuat browser Bu Sari membeku.', sorot=[1]),
        dict(k=2, judul='Riwayat pinjam dihapus diam-diam', isi='Tidak ada error, tetapi laporan tahun lalu berkurang. Error foreign key adalah peringatan.', sorot=[4])])),
     R('b09_commit', 'b09_akhir', kalimat=7, maks=3), A('lanjut', kalimat=8, min=10, a=dict(selesai='Bu Sari bisa mengelola alat, dan datanya selalu diperiksa.', berikut='Bab 10: Halaman peminjam'))],
}
