NAMA = "P11_petugas"
REKAMAN = ["rek", "web", "web_ai"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def WA(a, b, **k): return dict(k='rek', r='web_ai', a=a, b=b, **k)
KODE = ["$daftar = q('SELECT * FROM peminjaman WHERE tanggal_pinjam BETWEEN ? AND ?', [$dari, $sampai])->fetchAll();", "",
        "foreach ($daftar as $i => $p) {", "    $u = q('SELECT nama, kelas FROM pengguna WHERE id = ?', [$p['pengguna_id']])->fetch();",
        "    $a = q('SELECT nama FROM alat WHERE id = ?', [$p['alat_id']])->fetch();", "    $k = q('SELECT denda FROM pengembalian WHERE peminjaman_id = ?', [$p['id']])->fetch();", "    // ...", "}"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 11', judul='Halaman petugas', sub='Setujui, terima kembali, cetak laporan', lapis='frontend'))],
 2: [R('b02', 'b02_tombol', maks=16), R('b02_tombol', 'b02_proses', kalimat=0), R('b02_proses', 'b02_match', kalimat=1, maks=12), R('b02_match', 'b02_update', kalimat=2), R('b02_update', 'b02_akhir', kalimat=3)],
 3: [R('b03', 'b03_urut', maks=20), R('b03_urut', 'b03_denda', kalimat=0), R('b03_denda', 'b03_akhir', kalimat=1)],
 4: [R('b04', 'b04_call', kalimat=0, maks=10), R('b04_call', 'b04_pesan', kalimat=1), R('b04_pesan', 'b04_akhir', kalimat=4)],
 5: [W('mulai', 'setujui', maks=4), W('setujui', 'dipinjam', kalimat=1, maks=2), W('dipinjam', 'terima', kalimat=2), W('terima', 'coba_akhir', kalimat=3)],
 6: [R('b06', 'b06_tgl', kalimat=0, maks=20), R('b06_tgl', 'b06_join', kalimat=1), R('b06_join', 'b06_rentang', kalimat=2), R('b06_rentang', 'b06_sum', kalimat=3), R('b06_sum', 'b06_akhir', kalimat=5), W('laporan', 'laporan_akhir', maks=1.5)],
 7: [R('b07', 'b07_css', kalimat=1), R('b07_css', 'b07_akhir', kalimat=2), A('cetakPDF', kalimat=3, min=8, a=dict(img='/home/user/pinjam/bahan/laporan_pdf-1.png'))],
 8: [A('cekAI', tambah=3.5, a=dict(perintah='buat laporan peminjaman per rentang tanggal', kode=KODE, size=23, w=1700))],
 9: [R('b09', 'b09_commit', kalimat=1), W('bawah', 'akhir', kalimat=2), WA('bawah', 'akhir', kalimat=3), A('poin', kalimat=4, min=12, a=dict(judul='Sama di layar, berbeda di belakang layar', warna='#ff6b6b', kol=2, tinggi=400, item=[
        dict(k=4, d=.5, besar='15.000 query', judul='Untuk 5.000 pinjaman dalam setahun', isi='Satu untuk daftarnya, ditambah tiga untuk setiap baris.', warna='#ff6b6b'),
        dict(k=5, besar='N + 1', mono=True, judul='Nama masalahnya: N+1 query', isi='Obatnya JOIN: satu query untuk semuanya.', warna='#a3e635')])),
     R('b09_commit', 'b09_akhir', kalimat=6, maks=2.5), A('lanjut', kalimat=7, min=12, a=dict(selesai='Pak Yusuf bisa menyetujui, menerima kembali, dan mencetak laporan.', berikut='Bab 12: Pengujian'))],
}
