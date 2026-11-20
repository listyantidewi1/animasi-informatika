NAMA = "B09_petugas"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KAI = ["petugas.delete('/anggota/:id', async (req, res) => {", "  await db.query('DELETE FROM peminjaman WHERE pengguna_id = ?', [req.params.id])", "  await db.query('DELETE FROM pengguna WHERE id = ?', [req.params.id])", "  res.json({ pesan: 'Anggota dihapus' })", "})"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 9', judul='Halaman petugas', sub='Menyetujui anggota, mencatat pengembalian, menambah buku', lapis='semua'))],
 2: [R('b02', 'b02_use', maks=6), R('b02_use', 'b02_semua', kalimat=1), R('b02_semua', 'b02_lupa', kalimat=2), R('b02_lupa', 'b02_akhir', kalimat=3), E('b03', 'b03_anggota', 3.5)],
 3: [R('b03_anggota', 'b03_left'), R('b03_left', 'b03_akhir', kalimat=1), A('leftJoin', kalimat=2, min=8), E('b04', 'b04_setujui', 4)],
 4: [R('b04_setujui', 'b04_non'), R('b04_non', 'b04_hitung', kalimat=1), R('b04_hitung', 'b04_hapus', kalimat=2), R('b04_hapus', 'b04_riwayat', kalimat=3), R('b04_riwayat', 'b04_akhir', kalimat=4), E('b05', 'b05_pinjam', 3.5)],
 5: [R('b05_pinjam', 'b05_diff'), R('b05_diff', 'b05_buku', kalimat=1), R('b05_buku', 'b05_trans', kalimat=2, maks=9), R('b05_trans', 'b05_app', kalimat=3), R('b05_app', 'b05_akhir', kalimat=4, maks=3)],
 6: [R('b06', 'b06_salin', maks=3), A('dariGitHub', bg=True, min=3.5, a=dict(ket='Tiga berkas itu ada di folder web/src/halaman')), R('b06_app', 'b06_menu', kalimat=1, maks=7), R('b06_menu', 'b06_ingat'), R('b06_ingat', 'b06_jaga', kalimat=2),
     R('b06_jaga', 'b06_akhir', kalimat=4), E('b06_kat', 'b06_kat_akhir', 2.5)],
 7: [W('ratih', 'anggota', maks=2.2), W('anggota', 'setujui', kalimat=1), W('setujui', 'pinjaman', kalimat=2), W('pinjaman', 'kembali', kalimat=3), W('kembali', 'tersedia', kalimat=4), W('tersedia', 'tambah', kalimat=5),
     W('tambah', 'label', kalimat=6, maks=2.5), W('label', 'tambah_akhir')],
 8: [W('nadia', 'khusus', maks=1.6), W('khusus', 'khusus_akhir', kalimat=2)],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan fitur hapus anggota', kode=KAI, size=28, w=1640))],
 10: [A('masalahAI', a=dict(kode=KAI, size=26, w=1640, masalah=[
        dict(k=1, judul='Catatan peminjamannya ikut terhapus', isi='Bu Ratih salah menekan hapus pada Nadia, yang sedang meminjam dua buku.', sorot=[1]),
        dict(k=2, judul='Dua buku berstatus dipinjam, tanpa peminjam', isi='Buku-buku itu hilang dari pembukuan untuk selamanya.', sorot=[1, 2]),
        dict(k=4, judul='Riwayat lama ikut lenyap', isi='Padahal Bu Ratih membutuhkannya untuk laporan akhir tahun.', sorot=[1])])),
      W('non', 'non_tolak', kalimat=5, maks=1.5), W('non_tolak', 'non_akhir', kalimat=6),
      A('aturanBesar', kalimat=7, min=4.5, a=dict(teks='Data yang punya riwayat dinonaktifkan, bukan dihapus.')),
      R('b10_commit', 'b10_akhir', kalimat=8, maks=2.5),
      A('lanjut', kalimat=9, min=9, a=dict(selesai='Aplikasinya lengkap: anggota meminjam, petugas mengelola.', tanya='Tetapi aplikasinya masih hidup di laptop kita, dengan internet.', berikut='Bab 10: Berjalan tanpa internet'))],
}
