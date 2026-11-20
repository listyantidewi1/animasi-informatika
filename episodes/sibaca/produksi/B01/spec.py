NAMA = "B01_persiapan"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KAI = ["const db = mysql.createPool({", "  host: 'localhost',", "  user: 'root',", "  password: '',", "  database: 'perpustakaan'", "})"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 1', judul='Persiapan', sub='Dari komputer kosong sampai dua server berjalan', lapis='semua')),
     A('poin', a=dict(judul='Empat alat, semuanya gratis', warna='#ffb020', kol=4, tinggi=300, sj=34, si=24, item=[
        dict(k=2, d=1.0, judul='Node.js', isi='menjalankan JavaScript'), dict(k=2, d=1.6, judul='MySQL', isi='database'),
        dict(k=2, d=2.2, judul='Git', isi='menyimpan riwayat kode'), dict(k=2, d=2.8, judul='VS Code', isi='tempat menulis kode')]))],
 2: [A('siapNode')], 3: [A('siapMySQL')], 4: [A('siapGitVS')],
 5: [R('b05', 'b05_cek', kalimat=1), R('b05_cek', 'b05_akhir', kalimat=2, maks=1.5), A('tidakDikenal', bg=True, min=12)],
 6: [R('b06', 'b06_pasang', kalimat=1, maks=1.3), R('b06_pasang', 'b06_json', kalimat=3, maks=2.5), R('b06_json', 'b06_akhir', kalimat=5)],
 7: [R('b07', 'b07_db', kalimat=1, maks=1.3), R('b07_db', 'b07_user', kalimat=3), R('b07_user', 'b07_grant', kalimat=4), R('b07_grant', 'b07_keluar', kalimat=5), A('kenapaBukanRoot', min=9)],
 8: [R('b08', 'b08_env', kalimat=1, maks=2.5), R('b08_env', 'b08_ignore', kalimat=2), R('b08_ignore', 'b08_isi', kalimat=3, maks=2), R('b08_isi', 'b08_contoh', kalimat=4),
     R('b08_contoh', 'b08_kosong', kalimat=5, maks=3), R('b08_kosong', 'b08_akhir'),
     A('termGambar', min=9, a=dict(judul='Kalau mengambil proyek ini dari GitHub', termJudul='Terminal, di folder sibaca', size=32, tinggi=420,
        baris=[dict(k=6, d=1.5, cmd='cp .env.example .env', out=[]), dict(k=6, d=5.0, cmd='# isi DB_PASSWORD di berkas .env', out=[])],
        repo=dict(k=6, ket='Langkah lengkapnya ada di README', y=700)))],
 9: [R('b09', 'b09_import', maks=4), R('b09_import', 'b09_app', kalimat=2), R('b09_app', 'b09_alamat', kalimat=3), R('b09_alamat', 'b09_json', kalimat=4), R('b09_json', 'b09_listen', kalimat=5), R('b09_listen', 'b09_akhir', kalimat=6)],
 10: [R('b10', 'b10_ketik', maks=2.2), R('b10_ketik', 'b10_type', kalimat=1, maks=2.5), R('b10_type', 'b10_ketik2'), R('b10_ketik2', 'b10_dev', kalimat=2, maks=3), R('b10_dev', 'b10_jalan', kalimat=3),
      R('b10_jalan', 'b10_akhir', kalimat=4, maks=1.5), W('halo', 'halo_akhir', maks=1.3)],
 11: [R('b11', 'b11_vite', kalimat=1), R('b11_vite', 'b11_linter', kalimat=2, maks=2), R('b11_linter', 'b11_no', kalimat=5), R('b11_no', 'b11_cd', kalimat=6), R('b11_cd', 'b11_dev', kalimat=7, maks=4),
      R('b11_dev', 'b11_akhir', maks=1.5), W('vite', 'vite_akhir', kalimat=8, maks=1.3), A('duaProgram', min=7), R('b11_tiga', 'b11_tiga_akhir', kalimat=10)],
 12: [A('cekAI', tambah=3.5, a=dict(perintah='sambungkan Express ke MySQL', kode=KAI, size=38, w=1200))],
 13: [A('masalahAI', a=dict(kode=KAI, size=30, w=1640, masalah=[
        dict(k=1, judul='Memakai root, pemilik semua database', isi='Satu celah di aplikasi membuka semua database di komputer itu.', sorot=[2]),
        dict(k=2, judul='Kata sandi ditulis di dalam kode', isi='Ikut tersimpan di Git dan terbaca oleh siapa pun yang mendapat kodenya.', sorot=[3])])),
      R('b13', 'b13_commit', kalimat=4, maks=1.5), R('b13_commit', 'b13_akhir', kalimat=5, maks=1.5),
      A('lanjut', min=8, a=dict(selesai='Alat terpasang, server Express dan Vite berjalan, database siap.', berikut='Bab 2: Kebutuhan'))],
}
