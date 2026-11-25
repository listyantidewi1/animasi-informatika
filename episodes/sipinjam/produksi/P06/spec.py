NAMA = "P06_trigger"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
KODE = ["CREATE TRIGGER tandai_terlambat AFTER UPDATE ON peminjaman", "FOR EACH ROW", "BEGIN", "    UPDATE peminjaman SET status = 'terlambat'", "    WHERE jatuh_tempo < CURDATE() AND status = 'disetujui';", "END"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 6', judul='Trigger', sub='Log dan stok diurus database sendiri', lapis='database'))],
 2: [A('poin', a=dict(judul='Trigger: kode yang berjalan sendiri', warna='#a78bfa', kol=3, tinggi=420, item=[
        dict(k=0, d=1.5, besar='otomatis', judul='Berjalan setiap ada baris baru atau baris berubah', isi='Di satu tabel tertentu.'),
        dict(k=1, besar='menunggu', judul='Tidak dipanggil seperti prosedur', isi='Ia menunggu, lalu bereaksi.'),
        dict(k=3, besar='NEW · OLD', mono=True, judul='Baris versi baru dan baris sebelum diubah', isi='Bisa dibaca di dalam trigger.')]))],
 3: [R('b03', 'b03_after', kalimat=0, maks=7), R('b03_after', 'b03_each', kalimat=2), R('b03_each', 'b03_isi', kalimat=3), R('b03_isi', 'b03_akhir', kalimat=4)],
 4: [R('b04', 'b04_after', maks=8), R('b04_after', 'b04_beda', kalimat=0), R('b04_beda', 'b04_stok', kalimat=1), R('b04_stok', 'b04_akhir', kalimat=2)],
 5: [R('b05', 'b05_after', maks=8), R('b05_after', 'b05_stok', kalimat=0), R('b05_stok', 'b05_status', kalimat=1), R('b05_status', 'b05_akhir', kalimat=2), A('poin', kalimat=3, min=5, a=dict(judul='Satu pengembalian, tiga pekerjaan otomatis', warna='#a3e635', kol=3, tinggi=300, item=[
        dict(besar='1', judul='Stok bertambah'), dict(besar='2', judul='Status menjadi dikembalikan'), dict(besar='3', judul='Log tercatat')]))],
 6: [R('b06', 'b06_ajukan', maks=2), R('b06_ajukan', 'b06_log', kalimat=1, maks=1.5), R('b06_log', 'b06_tolak', kalimat=2, maks=1.5), R('b06_tolak', 'b06_stok', kalimat=3, maks=1.5), R('b06_stok', 'b06_akhir', kalimat=4, maks=2)],
 7: [R('b07', 'b07_call', kalimat=1, maks=2.5), R('b07_call', 'b07_denda', kalimat=2, maks=1.5), R('b07_denda', 'b07_stok', kalimat=3, maks=1.5), R('b07_stok', 'b07_akhir', kalimat=4, maks=2)],
 8: [A('cekAI', tambah=3.5, a=dict(perintah='buat trigger yang menandai pinjaman terlambat', kode=KODE, size=32, w=1500))],
 9: [R('b09', 'b09_pasang', kalimat=0, maks=2.5), R('b09_pasang', 'b09_ubah', maks=2), R('b09_ubah', 'b09_error_akhir', kalimat=1, maks=1.5), A('kodeJelas', kalimat=5, min=8, a=dict(judul='Menandai terlambat tanpa trigger', warna='#a3e635', size=34, w=1400, kode=['SELECT p.*,', '       p.jatuh_tempo < CURDATE() AS terlambat', 'FROM peminjaman p', "WHERE p.status = 'disetujui';"],
        langkah=[dict(k=6, sorot=[1], ket='Dihitung saat data ditampilkan, tidak perlu disimpan.')])),
     R('b09_hapus', 'b09_akhir', kalimat=7, maks=3), A('lanjut', kalimat=8, min=12, a=dict(selesai='Database mencatat log dan mengurus stok dengan sendirinya.', berikut='Bab 7: Kerangka PHP'))],
}
