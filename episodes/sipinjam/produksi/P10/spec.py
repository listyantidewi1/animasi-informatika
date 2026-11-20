NAMA = "P10_peminjam"
REKAMAN = ["rek", "web", "web_ai"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def WA(a, b, **k): return dict(k='rek', r='web_ai', a=a, b=b, **k)
KODE = ["<a href=\"batalkan.php?id=<?= $p['id'] ?>\">Batalkan</a>", "", "<?php  // peminjam/batalkan.php", "$saya = wajib_peran('peminjam');", "",
        "$id = $_GET['id'];", "q(\"UPDATE peminjaman SET status = 'dibatalkan' WHERE id = ?\", [$id]);", "", "pesan('Peminjaman dibatalkan.');"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 10', judul='Halaman peminjam', sub='Mengajukan dari HP, hanya menyentuh milik sendiri', lapis='frontend'))],
 2: [R('b02', 'b02_ketik', maks=1.3), R('b02_ketik', 'b02_query', maks=10), R('b02_query', 'b02_form', kalimat=1), R('b02_form', 'b02_max', kalimat=2), R('b02_max', 'b02_habis', kalimat=3), R('b02_habis', 'b02_akhir', kalimat=4)],
 3: [R('b03', 'b03_cek', kalimat=0, maks=8), R('b03_cek', 'b03_call', kalimat=1), R('b03_call', 'b03_catch', kalimat=2), R('b03_catch', 'b03_pesan', kalimat=3), R('b03_pesan', 'b03_akhir', kalimat=4)],
 4: [R('b04', 'b04_where', kalimat=0, maks=10), R('b04_where', 'b04_left', kalimat=1), R('b04_left', 'b04_batal', kalimat=2), R('b04_batal', 'b04_akhir', kalimat=3)],
 5: [R('b05', 'b05_update', kalimat=0, maks=5), R('b05_update', 'b05_row', kalimat=1), R('b05_row', 'b05_trigger', kalimat=2), R('b05_trigger', 'b05_akhir', kalimat=3)],
 6: [W('mulai', 'cari', maks=4), W('cari', 'ajukan', maks=3), W('ajukan', 'kurang', kalimat=2, maks=2), W('kurang', 'batal'), W('batal', 'kembali', kalimat=3, maks=3), W('kembali', 'akhir', maks=2.5), A('hpLayar', kalimat=4, min=6, a=dict(judul='SiPinjam di layar HP', img='/home/user/pinjam/bahan/hp_jadi_pinjaman.png', item=[dict(k=4, d=.6, judul='Kartu, bukan tabel', isi='Tampilan menyesuaikan lebar layar HP.', warna='#38bdf8')]))],
 7: [A('cekAI', tambah=3.5, a=dict(perintah='buat tombol untuk membatalkan pinjaman', kode=KODE, size=28, w=1560))],
 8: [WA('mulai', 'alamat', maks=4), WA('alamat', 'pesan', maks=1.5), WA('pesan', 'wulan', kalimat=2), WA('wulan', 'dibatalkan', kalimat=3, maks=4), WA('dibatalkan', 'akhir', kalimat=4),
     A('poin', kalimat=6, min=10, a=dict(judul='Tiga kesalahan di satu berkas', warna='#ff6b6b', kol=3, tinggi=340, item=[
        dict(k=7, d=.4, besar='1', judul='Tidak memeriksa pemilik', isi='Id siapa pun diterima.'),
        dict(k=7, d=2.4, besar='2', judul='Tidak memeriksa status', isi='Yang sudah disetujui pun bisa dibatalkan.'),
        dict(k=7, d=4.2, besar='3', judul='Mengubah data lewat tautan', isi='Tanpa form POST dan tanpa token.')])), R('b08', 'b08_commit', kalimat=8), R('b08_commit', 'b08_akhir', kalimat=9, maks=1.5),
     A('lanjut', kalimat=10, min=10, a=dict(selesai='Siswa bisa mengajukan dan membatalkan, hanya untuk pinjamannya sendiri.', berikut='Bab 11: Halaman petugas'))],
}
