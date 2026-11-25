NAMA = "L08_siswa"
REKAMAN = ["rek", "web"]
D_ = "/home/user/lapor/L08/"
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KODE = ["<p>{!! nl2br($u->note) !!}</p>"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 8', judul='Halaman siswa dan hak akses', sub='Daftar laporan, policy, dan tampilan di HP', lapis='frontend'))],
 2: [R('b02', 'b02_sorot', maks=3), R('b02_sorot', 'b02_akhir', kalimat=1), E('b03', 'b03_kartu', 5)],
 3: [R('b03_kartu', 'b03_kosong'), R('b03_kosong', 'b03_route', kalimat=1), E('b03_route', 'b03_akhir', 2)],
 4: [W('b04', 'b04_daftar', maks=2.5), W('b04_daftar', 'b04_alamat', kalimat=1), W('b04_alamat', 'b04_bocor', kalimat=2, maks=1.3), W('b04_bocor', 'b04_akhir', kalimat=3)],
 5: [A('policy', min=9), R('b05', 'b05_ketik', kalimat=1, maks=1.3), R('b05_ketik', 'b05_sorot', maks=4), R('b05_sorot', 'b05_akhir', kalimat=2), E('b06', 'b06_show', 3)],
 6: [R('b06_show', 'b06_foto'), R('b06_foto', 'b06_fr', kalimat=1), R('b06_fr', 'b06_akhir'), W('b06', 'b06_403', kalimat=3, maks=1.5), W('b06_lina', 'b06_lina_akhir', kalimat=5), W('b06_hendra', 'b06_akhir')],
 7: [R('b07', 'b07_akhir', kalimat=1), W('b07', 'b07_hasil', kalimat=3, maks=1.5), W('b07_hasil', 'b07_akhir', kalimat=4)],
 8: [R('b08', 'b08_akhir', kalimat=1, maks=1.2), A('termGambar', min=7, a=dict(judul='Mencari alamat IP laptop', termJudul='Terminal (Windows)', size=30, tinggi=420, lebar=1640,
        baris=[dict(k=2, d=.4, cmd='ipconfig', out=['', 'Wireless LAN adapter Wi-Fi:', '', ['   IPv4 Address. . . . . . . . . . . : 192.168.1.23', '#ffb020'], '   Subnet Mask . . . . . . . . . . . : 255.255.255.0'])])),
     A('hpWifi', min=14, a=dict(k1=4, k2=5))],
 9: [A('hpLayar', min=8, a=dict(img=D_ + 'hp_daftar.png', sub='Langsung pas, tanpa perlu diperbesar')), R('b09_meta', 'b09_css', kalimat=2), R('b09_css', 'b09_akhir', kalimat=3),
     A('hpLayar', min=8, a=dict(img=D_ + 'hp_detail.png', judul='Lina memantau dari HP', gulir=[4, 6]))],
 10: [A('cekAI', tambah=3.5, a=dict(perintah='tolong supaya baris baru di catatan petugas ikut tampil', kode=KODE, size=40, w=1300))],
 11: [A('masalahAI', a=dict(kode=KODE, size=34, w=1640, masalah=[
        dict(k=0, judul='{!! !!} menampilkan apa adanya, tanpa diamankan', isi='Tag <script> di laporan siswa ikut dijalankan di browser Pak Hendra.', sorot=[0]),
        dict(k=1, judul='Sesi login admin bisa dicuri', isi='Kode di browser admin bisa mengirim cookie sesi ke penyerang.', sorot=[0])])),
      R('b11', 'b11_akhir', kalimat=2, maks=1.5), R('b11_commit', 'b11_commit_akhir', kalimat=3, maks=1.5), A('tantangan', min=9, a=dict(tantangan='Izinkan siswa membatalkan laporannya sendiri, tetapi hanya selama statusnya masih baru.', berikut='Bab 9: Test dan online'))],
}
