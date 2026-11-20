NAMA = "B04_api"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KAI = ["buku.get('/', async (req, res) => {", "  const q = req.query.q", "  const [rows] = await db.query(", "    \"SELECT judul, penulis FROM buku WHERE judul LIKE '%\" + q + \"%'\")", "  res.json(rows)", "})"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 4', judul='API dengan Express', sub='Perantara antara browser dan database', lapis='server'))],
 2: [A('alurAPI')],
 3: [R('b03', 'b03_pool', maks=6.5), R('b03_pool', 'b03_env', kalimat=2), R('b03_env', 'b03_rahasia', kalimat=3), R('b03_rahasia', 'b03_opsi', kalimat=4), R('b03_opsi', 'b03_akhir', kalimat=5)],
 4: [A('dariGitHub', bg=('rek', 'b03_akhir'), min=8, a=dict(k=1, ket='daftar-buku.js dan isi-contoh.js ada di folder database')), R('b04', 'b04_bcrypt', kalimat=2, maks=4), R('b04_bcrypt', 'b04_pasang', kalimat=3),
     R('b04_pasang', 'b04_skrip', kalimat=4, maks=2.5), R('b04_skrip', 'b04_jalan', kalimat=5, maks=4.5), R('b04_jalan', 'b04_akhir', maks=2)],
 5: [R('b05', 'b05_router', maks=4.5), R('b05_router', 'b05_get', kalimat=2), R('b05_get', 'b05_q', kalimat=3), R('b05_q', 'b05_akhir', kalimat=4), E('b06', 'b06_query', 3)],
 6: [R('b06_query', 'b06_where'), R('b06_where', 'b06_nilai'), R('b06_nilai', 'b06_pisah', kalimat=3), R('b06_pisah', 'b06_persen', kalimat=4), R('b06_persen', 'b06_akhir', kalimat=5), E('b07', 'b07_lihat', 3)],
 7: [R('b07_lihat', 'b07_json'), R('b07_json', 'b07_use', kalimat=1), R('b07_use', 'b07_hapus', kalimat=2), R('b07_hapus', 'b07_akhir', kalimat=3, maks=3)],
 8: [A('termGambar', min=4, a=dict(judul='Terminal pertama: server menyala ulang sendiri', termJudul='Terminal 1, npm run dev', size=32, tinggi=420,
        baris=[dict(k=0, d=0.3, cmd='npm run dev', out=['SiBaca berjalan di port 3000', "Restarting 'server/app.js'", 'SiBaca berjalan di port 3000'])])),
     W('bumi', 'bumi_hasil', kalimat=1, maks=1.3), W('bumi_hasil', 'bumi_akhir', kalimat=2)],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan pencarian buku', kode=KAI, size=30, w=1500))],
 10: [A('injeksi'), W('injeksi', 'injeksi_hasil', kalimat=5, maks=3), W('injeksi_hasil', 'injeksi_akhir', kalimat=6), R('b10_commit', 'b10_akhir', kalimat=7, maks=2.5),
      A('lanjut', kalimat=8, min=11, a=dict(selesai='Alamat /api/buku menjawab dengan data dari MySQL.', tanya='Siapa pun di WiFi perpustakaan bisa membuka alamat ini tanpa login.', berikut='Bab 5: Daftar dan login'))],
}
