NAMA = "B05_login"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KAI = ["auth.post('/daftar', async (req, res) => {", "  const { nama, nis, sandi, peran } = req.body", "  const hash = await bcrypt.hash(sandi, 10)", "  await db.query(",
       "    `INSERT INTO pengguna (nama, nis, sandi_hash, peran, aktif)", "     VALUES (?, ?, ?, ?, TRUE)`, [nama, nis, hash, peran])", "  res.json({ pesan: 'Pendaftaran berhasil' })", "})"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 5', judul='Daftar dan login', sub='Kata sandi teracak, cookie bertanda tangan', lapis='server'))],
 2: [A('hashCookie')],
 3: [R('b03', 'b03_kunci', maks=2.5), R('b03_kunci', 'b03_env', kalimat=1, maks=1.6), R('b03_env', 'b03_sendiri', kalimat=2, maks=2.5), R('b03_sendiri', 'b03_akhir', kalimat=3),
     A('termGambar', kalimat=4, min=8, a=dict(judul='Isi .env berubah: nyalakan ulang server', termJudul='Terminal 1', size=32, tinggi=460,
        baris=[dict(k=4, d=0.2, cmd='npm run dev', out=['SiBaca berjalan di port 3000']), dict(k=4, d=2.2, cmd='^C', out=[]), dict(k=4, d=5.0, cmd='npm run dev', out=['SiBaca berjalan di port 3000'])])),
     E('b03_contoh', 'b03_contoh_akhir', 2.5), E('b04_kepala', 'b04', 3)],
 4: [R('b04', 'b04_ambil', maks=4.5), R('b04_ambil', 'b04_periksa', kalimat=2), R('b04_periksa', 'b04_hash', kalimat=3), R('b04_hash', 'b04_simpan', kalimat=4), R('b04_simpan', 'b04_bawaan', kalimat=5),
     R('b04_bawaan', 'b04_kembar', kalimat=6), R('b04_kembar', 'b04_akhir', kalimat=7), E('b05', 'b05_aktif', 3.5)],
 5: [R('b05_aktif', 'b05_cari', kalimat=1), R('b05_cari', 'b05_sama', kalimat=2), R('b05_sama', 'b05_tebak', kalimat=3), R('b05_tebak', 'b05_setuju', kalimat=4), R('b05_setuju', 'b05_session', kalimat=5),
     R('b05_session', 'b05_cookie', kalimat=6), R('b05_cookie', 'b05_akhir', kalimat=7), E('b06', 'b06_login', 3.5)],
 6: [R('b06_login', 'b06_401', kalimat=1), R('b06_401', 'b06_ulang', kalimat=2), R('b06_ulang', 'b06_petugas', kalimat=3), R('b06_petugas', 'b06_keluar', kalimat=5), R('b06_keluar', 'b06_akhir', kalimat=6), E('b07', 'b07_lihat', 3)],
 7: [R('b07_lihat', 'b07_nama'), R('b07_nama', 'b07_http', kalimat=1), R('b07_http', 'b07_error', kalimat=2), R('b07_error', 'b07_rapi', kalimat=3), R('b07_rapi', 'b07_buku', kalimat=4),
     R('b07_buku', 'b07_jaga', kalimat=5, maks=3), R('b07_jaga', 'b07_akhir', kalimat=6)],
 8: [R('b08', 'b08_tanpa'), R('b08_tanpa', 'b08_nadia', kalimat=1), R('b08_nadia', 'b08_salah', kalimat=3, maks=2.2), R('b08_salah', 'b08_akhir', kalimat=4, maks=2.2)],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan fitur daftar dan login dengan peran anggota dan petugas', kode=KAI, size=30, w=1500))],
 10: [A('masalahAI', a=dict(kode=KAI, size=26, w=1640, masalah=[
        dict(k=0, judul='Form hanyalah satu cara mengirim data', isi='Siapa pun bisa mengirim data sendiri, misalnya dengan curl.', sorot=[1]),
        dict(k=2, judul='Mendaftar langsung sebagai petugas', isi='Cukup mengirim peran: petugas, dan akunnya langsung aktif tanpa persetujuan siapa pun.', sorot=[4, 5])])),
      R('b10', 'b10_terima', kalimat=3, maks=3), R('b10_terima', 'b10_tabel', kalimat=5), R('b10_tabel', 'b10_hasil', kalimat=6, maks=2.5), R('b10_hasil', 'b10_akhir'),
      A('aturanBesar', kalimat=7, min=4.5, a=dict(teks='Jangan pernah percaya pada data yang datang dari luar.', sub='Server sendiri yang menentukan peran dan status akun.')),
      R('b10_commit', 'b10_commit_akhir', kalimat=8, maks=2.5),
      A('lanjut', kalimat=9, min=8, a=dict(selesai='Daftar, login, dan penjaga alamat sudah bekerja, diuji lewat terminal.', berikut='Bab 6: React pertama'))],
}
