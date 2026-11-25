NAMA = "L01_persiapan"
REKAMAN = ["rek", "rek_a", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def RA(a, b, **k): return dict(k='rek', r='rek_a', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 1', judul='Persiapan', sub='Dari komputer kosong sampai Laravel berjalan', lapis='semua')),
     A('poin', a=dict(judul='Lima alat, semuanya gratis', warna='#ffb020', kol=5, tinggi=300, sj=34, si=24, item=[
        dict(k=2, d=1.0, judul='PHP', isi='bahasa yang dipakai Laravel'), dict(k=2, d=1.6, judul='Composer', isi='memasang pustaka PHP'), dict(k=2, d=2.2, judul='MySQL', isi='database'),
        dict(k=2, d=2.8, judul='VS Code', isi='tempat menulis kode'), dict(k=2, d=3.4, judul='Git', isi='menyimpan riwayat kode')]))],
 2: [A('siapHerd')], 3: [A('siapMySQL')], 4: [A('siapGitVS')],
 5: [RA('b05', 'b05_akhir', kalimat=1, maks=1.5), A('tidakDikenal', bg=True, min=12)],
 6: [RA('b06', 'b06_kit', kalimat=1, maks=1.3), A('tigaPilihan', bg=True, min=10), RA('b06_kit', 'b06_blade', kalimat=6), RA('b06_blade', 'b06_pasang', kalimat=7),
     RA('b06_pasang', 'b06_siap', kalimat=8, maks=2.5), RA('b06_siap', 'b06_akhir', kalimat=9)],
 7: [R('b07', 6.9), R(6.9, 12.7, kalimat=4), R(12.7, 18.5, kalimat=5), R(18.5, 26.4, kalimat=6), R(26.4, 'b07_akhir', kalimat=7)],
 8: [RA('b08', 'b08_0', kalimat=1, maks=1.3), RA('b08_0', 'b08_1', kalimat=3), RA('b08_1', 'b08_2', kalimat=4), RA('b08_2', 'b08_keluar', kalimat=5), A('kenapaBukanRoot', min=9)],
 9: [R('b09', 'b09_db', maks=2), R('b09_db', 'b09_user', kalimat=2), R('b09_user', 'b09_key', kalimat=4, maks=1.4), R('b09_key', 'b09_akhir', kalimat=6)],
 10: [R('b10', 'b10_ignore', speed=2, maks=2), R('b10_ignore', 'b10_contoh', kalimat=1), R('b10_contoh', 'b10_akhir', kalimat=2, maks=2),
      A('termGambar', min=10, a=dict(judul='Kalau mengambil proyek ini dari GitHub', termJudul='Terminal, di folder silapor', size=32, tinggi=420,
        baris=[dict(k=3, d=1.5, cmd='cp .env.example .env', out=[]), dict(k=3, d=5.0, cmd='# isi bagian DB_ di berkas .env', out=[]), dict(k=3, d=8.0, cmd='php artisan key:generate', out=['   INFO  Application key set successfully.'])],
        repo=dict(k=3, ket='Langkah lengkapnya ada di README', y=700)))],
 11: [R('b11', 'b11_akhir', maks=1.6), A('zonaWaktu', bg=True, min=8)],
 12: [R('b12', 'b12_akhir', maks=1.3), A('termGambar', min=7, a=dict(judul='Kalau muncul Access denied', warna='#ff6b6b', size=28, tinggi=330, lebar=1640,
        baris=[dict(k=4, d=.3, cmd='php artisan migrate', out=[["SQLSTATE[HY000] [1045] Access denied for user 'silapor'@'localhost'", '#ff6b6b'], '', ['Periksa DB_USERNAME dan DB_PASSWORD di berkas .env', '#ffb020']])]))],
 13: [R('b13', 'b13_jalan', maks=1.3), W('mulai', 'akhir', maks=1.3), R('b13_stop', 'b13_akhir', kalimat=3)],
 14: [R('b14', 'b14', db=14.5, kalimat=1, maks=1.5), A('lanjut', min=7, a=dict(selesai='Alat terpasang, proyek Laravel berjalan, dan tersambung ke MySQL.', berikut='Bab 2: Kebutuhan'))],
}
