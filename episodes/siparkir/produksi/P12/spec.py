NAMA = "P12_online"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def T(judul, baris, **k):
    ex = {x: k.pop(x) for x in ('kalimat', 'min', 'bobot') if x in k}; return dict(k='adegan', nama='termGambar', a=dict(judul=judul, baris=baris, **k), **ex)
D = 'parkir.sekolahmu.sch.id'; S = 'rahmat@server:~$ '; S2 = 'rahmat@server:~/SiParkir$ '
ENV = ["APP_NAME=SiParkir", "APP_ENV=production", "APP_KEY=", "APP_DEBUG=false", "APP_DOMAIN=" + D, "", "DB_CONNECTION=mysql", "DB_DATABASE=siparkir", "DB_USERNAME=siparkir", "DB_PASSWORD=kata-sandi-baru-yang-panjang-dan-acak"]
ENVAI = ["APP_NAME=SiParkir", "APP_ENV=local", "APP_KEY=base64:Xk2p...", "APP_DEBUG=true", "APP_URL=https://" + D, "", "DB_CONNECTION=mysql", "DB_HOST=db", "DB_DATABASE=siparkir", "DB_USERNAME=siparkir", "DB_PASSWORD=..."]
BEATS = {
 1: [A('kartuBab', min=5, a=dict(bab='BAB 12', judul='Online', sub='Dari laptop ke server, dengan Docker dan HTTPS', lapis='deploy')),
     A('poin', kalimat=1, a=dict(judul='Dari laptop ke pos parkir', warna='#38bdf8', kol=3, tinggi=330, item=[
        dict(k=1, d=1.0, besar='Server', judul='Menyala terus', isi='Supaya bisa dibuka dari pos parkir.'),
        dict(k=2, besar='Docker', judul='Satu kemasan', isi='Server tidak perlu dipasangi PHP dan MySQL satu per satu.'),
        dict(k=3, besar='HTTPS', judul='Alamat yang aman', isi='SiParkir dibuka lewat nama domain.', warna='#a3e635')]))],
 2: [A('dockerKonsep', min=24, a=dict(k1=1, k2=2, k3=3, k4=4, k5=5))],
 3: [R('b03', 'b03_from', maks=2.5), R('b03_from', 'b03_ext', kalimat=1), R('b03_ext', 'b03_salin', kalimat=2), R('b03_salin', 'b03_abai', kalimat=3), R('b03_abai', 'b03_env', kalimat=4, maks=2), R('b03_env', 'b03_akhir')],
 4: [R('b04', 'b04_app', maks=8), R('b04_app', 'b04_port', kalimat=1), R('b04_port', 'b04_domain'), R('b04_domain', 'b04_host', kalimat=2), R('b04_host', 'b04_db', kalimat=4), R('b04_db', 'b04_volume', kalimat=5), R('b04_volume', 'b04_akhir')],
 5: [R('b05_commit', 'b05_commit_akhir', maks=1.5),
     T('Kirim ke GitHub', [dict(k=0, d=5.0, cmd='git push', out=['To github.com:listyantidewi1/SiParkir.git', '   57c351d..c4d9e89  main -> main'], prompt='rahmat@laptop:siparkir$ ')], size=30, tinggi=300, min=5),
     A('server', kalimat=1, min=14, a=dict(k1=1, k2=2, k3=3)),
     T('Masuk ke server, pasang Docker', [dict(k=4, d=.3, cmd='ssh rahmat@' + D, out=['Welcome to Ubuntu 24.04 LTS'], prompt='rahmat@laptop:~$ '), dict(k=4, d=3.6, cmd='curl -fsSL https://get.docker.com | sudo sh', out=['# Executing docker install script', 'Docker version 27 terpasang'], prompt=S)], size=28, tinggi=420, kalimat=4, min=9, repo=dict(k=4, ket='Perintah lengkap: README, bagian "Memasang di server"', y=780))],
 6: [T('Ambil kode dan siapkan .env', [dict(k=0, d=.3, cmd='git clone https://github.com/listyantidewi1/SiParkir.git', out=["Cloning into 'SiParkir'... done."], prompt=S), dict(k=0, d=3.4, cmd='cd SiParkir', out=[], prompt=S), dict(k=1, d=.3, cmd='cp .env.example .env', out=[], prompt=S2), dict(k=1, d=2.4, cmd='nano .env', out=[], prompt=S2)], size=28, tinggi=470, min=9),
     A('kodeJelas', kalimat=2, min=16, a=dict(judul='Empat hal yang diubah di .env', warna='#ffb020', berkas='.env  (di server)', kode=ENV, size=30, w=1640, langkah=[
        dict(k=2, sorot=[1], ket='APP_ENV=production'), dict(k=3, sorot=[3], ket='APP_DEBUG=false'), dict(k=4, sorot=[4], ket='APP_DOMAIN: nama domain untuk HTTPS'), dict(k=5, sorot=[9], ket='DB_PASSWORD: kata sandi baru yang panjang, bukan kata sandi latihan')])),
     T('Kunci aplikasi', [dict(k=6, d=.3, cmd='docker compose run --rm --no-deps app php artisan key:generate --show', out=['base64:pV3s7Qm0h1…  (tempel ke APP_KEY di .env)'], prompt=S2)], size=26, tinggi=300, kalimat=6, min=10)],
 7: [T('Nyalakan', [dict(k=0, d=.3, cmd='docker compose up -d --build', out=[' ✔ Image siparkir-app   Built', ' ✔ Container siparkir-db-1   Healthy', ' ✔ Container siparkir-app-1  Started'], prompt=S2),
        dict(k=2, d=.5, cmd='docker compose exec app php artisan migrate --seed --force', out=['   INFO  Running migrations.', '   INFO  Seeding database.'], prompt=S2)], size=26, tinggi=560, min=18),
     A('online', kalimat=3, min=16, a=dict(img='/home/user/parkir/P12/masuk.png', k3=3, k4=4, k5=5))],
 8: [T('Cadangan setiap malam', [dict(k=1, d=.3, cmd='docker compose exec db sh -c \'mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" siparkir\' > siparkir-$(date +%F).sql', out=[], prompt=S2), dict(k=1, d=6.0, cmd='ls -lh *.sql', out=['-rw-r--r-- 1 rahmat rahmat 2,1M  siparkir-2026-11-23.sql'], prompt=S2)], size=24, tinggi=420, min=20,
        catatan=None), A('poin', kalimat=2, min=9, a=dict(judul='Catatan uang = bukti', warna='#ff6b6b', kol=2, tinggi=300, item=[
        dict(k=2, besar='Setiap malam', judul='Jalankan cadangannya', isi='Simpan salinannya di luar server.'),
        dict(k=3, besar='Kalau hilang', judul='Buktinya ikut hilang', isi='Aplikasi parkir menyimpan catatan uang.', warna='#ffb020')]))],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='siapkan berkas .env untuk server', kode=ENVAI, size=28, w=1300, ket='Aplikasinya langsung berjalan.', ketK=2))],
 10: [A('masalahAI', min=8, a=dict(kode=ENVAI, size=22, w=1640, masalah=[dict(k=0, judul='APP_DEBUG=true', isi='Setiap error menampilkan halaman penuh rincian kepada siapa pun yang membukanya.', sorot=[3])])),
      A('gambarJelas', kalimat=2, min=18, a=dict(judul='Halaman error saat APP_DEBUG=true', sub='Tangkapan layar asli dari SiParkir, dua potongan', warna='#ff6b6b', img='/home/user/parkir/P12/debug3.png', w=1100, sorot=[
        dict(k=2, d=.2, k2=3, r=[.06, .53, .88, .46]), dict(k=2, d=2.2, k2=3, r=[.055, .128, .56, .05]), dict(k=2, d=4.0, k2=3, r=[.055, .2, .88, .26])], item=[
        dict(k=2, d=.2, judul='Potongan kode', isi='dan letak berkas di server', h=130), dict(k=2, d=4.0, judul='Query dan nama database', isi='yang sedang dijalankan', h=130),
        dict(k=3, judul='Bagi penyerang: peta', isi='Bagi kita ini alat bantu.', warna='#ff6b6b', h=130), dict(k=4, judul='APP_DEBUG=false', isi='Pengunjung hanya melihat halaman maaf yang sederhana.', warna='#a3e635', h=170, mono=True)]))],
 11: [A('akhir', min=30, a=dict(k1=1, k2=2, k3=3))],
 12: [A('tantanganAkhir', min=28, a=dict(k1=1, k2=2, k3=3))],
}
