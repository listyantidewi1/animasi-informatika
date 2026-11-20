NAMA = "B07_pencarian"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KAI = ["buku.get('/', async (req, res) => {", "  const q = req.query.q || ''", "  const [rows] = await db.query(", "    'SELECT * FROM buku WHERE judul LIKE ?',", "    ['%' + q + '%'])", "  res.json(rows)", "})"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 7', judul='Pencarian', sub='Kata kunci, kategori, dan hanya yang tersedia', lapis='server'))],
 2: [R('b02', 'b02_trim'), R('b02_trim', 'b02_sql', kalimat=1, maks=1.8), R('b02_sql', 'b02_let', kalimat=2, maks=5), R('b02_let', 'b02_where'), R('b02_where', 'b02_limit', kalimat=3), R('b02_limit', 'b02_dua', kalimat=4), R('b02_dua', 'b02_akhir', kalimat=5)],
 3: [R('b03', 'b03_kat', maks=3), R('b03_kat', 'b03_having'), R('b03_having', 'b03_teks', kalimat=2, maks=2.5), R('b03_teks', 'b03_nilai', kalimat=3), R('b03_nilai', 'b03_akhir', kalimat=5)],
 4: [A('polaLike'), R('b04_pola', 'b04_sorot', kalimat=3, maks=3.5), R('b04_sorot', 'b04_kat'), R('b04_kat', 'b04_distinct', kalimat=4, maks=3.5), R('b04_distinct', 'b04_akhir')],
 5: [R('b05', 'b05_state'), R('b05_state', 'b05_saring', kalimat=1, maks=3), R('b05_saring', 'b05_tiga', kalimat=2, maks=5), R('b05_tiga', 'b05_pola'), R('b05_pola', 'b05_akhir', kalimat=3), E('b06', 'b06_daftar', 4)],
 6: [R('b06_daftar', 'b06_huruf'), R('b06_huruf', 'b06_tunggu', kalimat=2), R('b06_tunggu', 'b06_bersih', kalimat=3), R('b06_bersih', 'b06_param', kalimat=4), R('b06_param', 'b06_batal', kalimat=5), R('b06_batal', 'b06_akhir', kalimat=6)],
 7: [W('awal', 'laskar'), W('laskar', 'tere', kalimat=1), W('tere', 'komputer', kalimat=2), W('komputer', 'persen', kalimat=3, maks=2), W('persen', 'persen_hasil', kalimat=4), W('persen_hasil', 'persen_akhir', kalimat=5)],
 8: [R('b08', 'b08_kat', maks=2.5), R('b08_kat', 'b08_like', kalimat=2, maks=1.4), R('b08_like', 'b08_akhir', kalimat=3, maks=1.6),
     A('poin', kalimat=4, min=9, a=dict(judul='Seberapa berat bagi MySQL?', warna='#38bdf8', kol=2, tinggi=320, item=[
        dict(k=4, d=0.2, besar='500 judul', judul='Membaca semuanya selesai dalam sekejap'), dict(k=5, d=0.2, besar='Jutaan judul', judul='Baru perlu FULLTEXT index', isi='Belum kita perlukan sekarang.', warna='#a78bfa')]))],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='tambahkan pencarian ke daftar buku', kode=KAI, size=34, w=1300))],
 10: [A('masalahAI', a=dict(kode=KAI, size=28, w=1640, masalah=[
        dict(k=0, judul='Tidak ada LIMIT', isi='Kotak cari yang kosong berarti seluruh koleksi dikirim ke HP setiap kali halaman dibuka.', sorot=[3]),
        dict(k=2, judul='Tanda % dan _ tidak ditangani', isi='Pencarian judul yang mengandung tanda itu memberi hasil yang salah.', sorot=[4])])),
      R('b10_commit', 'b10_akhir', kalimat=4, maks=2.5),
      A('lanjut', kalimat=5, min=10, a=dict(selesai='Pencarian berjalan, dan server hanya mengirim 20 buku setiap kali.', tanya='Nadia dan Raka menekan Pinjam pada detik yang sama, untuk satu eksemplar terakhir. Siapa yang dapat?', berikut='Bab 8: Pinjam dan kembali'))],
}
