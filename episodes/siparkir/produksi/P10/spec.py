NAMA = "P10_rekap"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KODE = ["SELECT COUNT(*), SUM(fee)", "FROM parkings", "WHERE exited_at BETWEEN '2026-10-01' AND '2026-10-31';"]
BEATS = {
 1: [A('kartuBab', min=5, a=dict(bab='BAB 10', judul='Rekap pendapatan', sub='Yang ditunggu Bu Ratna setiap akhir bulan', lapis='database')),
     A('poin', kalimat=1, a=dict(judul='Rekap untuk Bu Ratna', sub='Pilih rentang tanggal, lalu lihat:', warna='#f472b6', kol=3, tinggi=300, item=[
        dict(k=1, d=3.0, besar='1.500', mono=True, judul='Jumlah kendaraan'),
        dict(k=1, d=4.6, besar='Rp', mono=True, judul='Total pendapatan'),
        dict(k=1, d=6.2, besar='Per hari', judul='Rincian per hari'),
        dict(k=1, d=7.8, besar='Daftar', judul='Daftar transaksinya'),
        dict(k=2, besar='200.000', mono=True, judul='Tetap cepat', isi='Walaupun datanya dua ratus ribu baris.', warna='#a3e635')]))],
 2: [R('b02', 'b02_cmd'), R('b02_cmd', 'b02_isi', maks=1.5), R('b02_isi', 'b02_srand', kalimat=1), R('b02_srand', 'b02_akhir', kalimat=2)],
 3: [R('b03', 'b03_ketik', maks=1.3), R('b03_ketik', 'b03_valid', maks=6), R('b03_valid', 'b03_batas', kalimat=1), R('b03_batas', 'b03_akhir', kalimat=2), A('rentang', kalimat=4, min=11, a=dict(k4=4, k5=5))],
 4: [R('b04', 'b04_total', maks=6), R('b04_total', 'b04_harian'), R('b04_harian', 'b04_akhir', kalimat=3)],
 5: [R('b05', 'b05_pag', maks=6), R('b05_pag', 'b05_with'), R('b05_with', 'b05_akhir', kalimat=1), A('nPlusSatu', kalimat=3, min=14, a=dict(k3=3, k4=4))],
 6: [R('b06', 'b06_routes'), R('b06_routes', 'b06_akhir', maks=4), W('b06', 'b06_tanggal', kalimat=1, maks=2), W('b06_tanggal', 'b06_hasil', maks=1.3), W('b06_hasil', 'b06_harian', kalimat=2), W('b06_harian', 'b06_akhir', kalimat=3)],
 7: [R('b07', 'b07_seed'), R('b07_seed', 'b07_mysql', kalimat=2, maks=4), R('b07_mysql', 'b07_ketik', kalimat=3, maks=3), R('b07_ketik', 'b07_hasil', maks=1.5), R('b07_hasil', 'b07_akhir', kalimat=4)],
 8: [R('b08', 'b08_hasil', maks=1.5), R('b08_hasil', 'b08_akhir', kalimat=1)],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan rekap pendapatan per rentang tanggal', kode=KODE, size=36, w=1560, ket='Bunyinya persis seperti kalimat permintaan kita.', ketK=3))],
 10: [R('b10', 'b10_between', maks=1.5), R('b10_between', 'b10_kita', kalimat=1), R('b10_kita', 'b10_30', kalimat=2, maks=1.5), R('b10_30', 'b10_akhir', kalimat=3, maks=1.5), A('tengahMalam', kalimat=4, min=20, a=dict(k4=4, k5=5, k6=6, k7=7))],
 11: [R('b11_commit', 'b11_commit_akhir', maks=1.5), A('tantangan', kalimat=1, min=9, a=dict(tantangan='Tambahkan tombol untuk mengunduh rekap sebagai berkas CSV.', berikut='Bab 11: Pengujian'))],
}
