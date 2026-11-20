NAMA = "B10_tanpa_internet"
REKAMAN = ["rek", "web"]
G = "/home/user/baca/gambar/"
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KAI = ['<link href="https://fonts.googleapis.com/css2?family=Poppins" rel="stylesheet">', '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">', '', "const API = 'http://localhost:3000/api'"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 10', judul='Berjalan tanpa internet', sub='Satu laptop melayani seluruh perpustakaan', lapis='semua'))],
 2: [A('kemas'), R('b02', 'b02_build', kalimat=3, maks=1.5), R('b02_build', 'b02_dist', maks=3), R('b02_dist', 'b02_isi', kalimat=4, maks=2.5), R('b02_isi', 'b02_semua', kalimat=6), R('b02_semua', 'b02_akhir', kalimat=7), E('b03_ketik', 'b03', 3)],
 3: [R('b03', 'b03_static'), R('b03_static', 'b03_semua', kalimat=1), R('b03_semua', 'b03_react', kalimat=2), R('b03_react', 'b03_404', kalimat=3), R('b03_404', 'b03_ignore', kalimat=4), R('b03_ignore', 'b03_akhir', kalimat=5)],
 4: [R('b04', 'b04_start', maks=5), R('b04_start', 'b04_jalan', maks=2.5), R('b04_jalan', 'b04_akhir', kalimat=1, maks=1.8), W('buka', 'port', maks=1.6), W('port', 'masuk', kalimat=2), W('masuk', 'masuk_akhir', kalimat=3, maks=1.8)],
 5: [A('termGambar', a=dict(judul='Membuka SiBaca dari HP', termJudul='Command Prompt di laptop', size=30, tinggi=470, lebar=1060,
        baris=[dict(k=3, d=0.8, prompt='C:\\> ', cmd='ipconfig', out=['', 'Wireless LAN adapter Wi-Fi:', '', '   IPv4 Address. . . . . . : 192.168.1.10', '   Subnet Mask . . . . . . : 255.255.255.0', '   Default Gateway . . . . : 192.168.1.1'])],
        sorot=[[0, 3, 4]], catatan=[dict(k=1, teks='Laptop dan HP di WiFi yang sama', h=150), dict(k=2, teks='Berapa alamat laptop di jaringan itu?', h=150), dict(k=4, teks='192.168.1.10', isi='Alamat di jaringanmu bisa berbeda.', warna='#a3e635', h=170)],
        repo=dict(k=3, ket='Mac dan Linux: perintahnya ada di README'))),
     A('hpLangkah', kalimat=5, min=5, a=dict(judul='Di browser HP', alamat='192.168.1.10:3000', langkah=[dict(k=5, img=G + 'hp_masuk.png')],
        item=[dict(k=5, d=0.4, besar='192.168.1.10:3000', size=84, y=360, warna='#a3e635'), dict(k=5, d=1.6, judul='Alamat laptop, titik dua, port 3000', isi='Tidak perlu memasang aplikasi apa pun di HP.', y=480)]))],
 6: [A('firewallRouter')],
 7: [A('cabutInternet'),
     A('hpLangkah', kalimat=2, min=10, a=dict(judul='HP Nadia, tanpa internet', alamat='192.168.1.10:3000', pil=True, internet=False,
        langkah=[dict(k=2, img=G + 'hp_masuk.png'), dict(k=2, d=1.5, img=G + 'hp_masuk_isi.png'), dict(k=2, d=3.0, img=G + 'hp_katalog.png'), dict(k=2, d=4.4, img=G + 'hp_cari.png'), dict(k=2, d=5.6, img=G + 'hp_pinjam.png')],
        item=[dict(k=2, d=1.5, judul='Login', isi='dengan NIS dan kata sandi', y=240, h=140), dict(k=2, d=4.4, judul='Mencari buku', isi='pencarian dijawab laptop Bu Ratih', y=410, h=140, warna='#38bdf8'), dict(k=2, d=5.6, judul='Meminjam', isi='kode eksemplar langsung tampil', y=580, h=140, warna='#a78bfa'),
              dict(k=3, besar='Huruf dan tampilannya utuh.', size=58, y=820, warna='#a3e635')])),
     A('poin', kalimat=4, min=15, a=dict(judul='Kenapa bisa? Dua keputusan kecil di Bab 6', warna='#a3e635', kol=1, tinggi=190, item=[
        dict(k=6, d=0.2, judul="import '@fontsource/inter/400.css'", mono=True, isi='Huruf Inter tersimpan di dalam proyek, bukan diambil dari internet.'),
        dict(k=6, d=3.4, judul="fetch('/api' + alamat)", mono=True, isi='Alamat API relatif, tanpa nama komputer dan tanpa port.', warna='#38bdf8'),
        dict(k=7, d=0.2, judul='Halaman dibuka dari 192.168.1.10:3000', isi='Maka permintaan datanya juga dikirim ke 192.168.1.10:3000.', warna='#a3e635')]))],
 8: [A('cekAI', tambah=3.5, a=dict(perintah='(aplikasi perpustakaan buatan AI dari awal video)', kode=KAI, size=26, w=1640))],
 9: [A('masalahAI', a=dict(kode=KAI, size=26, w=1640, masalah=[
        dict(k=0, judul='Huruf dan gaya tampilan diambil dari internet', isi='Tanpa internet, browser menunggu lama, lalu menampilkan halaman tanpa gaya.', sorot=[0, 1]),
        dict(k=3, judul='Alamat API berisi localhost', isi='Di HP Nadia, localhost berarti HP Nadia sendiri, dan di sana tidak ada server apa pun.', sorot=[3])])),
     A('aturanBesar', kalimat=6, min=8.5, a=dict(kecil='Jadi', teks='AI tidak salah menulis kode.', sub='Ia hanya tidak tahu bahwa perpustakaannya tanpa internet, karena tidak ada yang memberitahunya.')),
     R('b09', 'b09_akhir', kalimat=8, maks=3),
     A('lanjut', kalimat=9, min=9, a=dict(selesai='SiBaca berjalan dari satu laptop, dan bisa dibuka dari HP tanpa internet.', tanya='Bagaimana kalau besok laptop itu rusak?', berikut='Bab 11: Uji, backup, dan panduan'))],
}
