NAMA = "L09_online"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
def T(judul, baris, **k): return A('termGambar', a=dict(judul=judul, termJudul='Terminal: server', baris=baris, **k))
ENV = ["APP_NAME=SiLapor", "APP_ENV=production", "APP_KEY=", "APP_DEBUG=false", "APP_URL=https://silapor.sekolahmu.sch.id", "", "DB_CONNECTION=mysql", "DB_DATABASE=silapor", "DB_USERNAME=silapor", "DB_PASSWORD=\"kataSandiServer\""]
NGX = ["server {", "    server_name silapor.sekolahmu.sch.id;", "    root /var/www/silapor/public;", "    index index.php;", "", "    location / {", "        try_files $uri $uri/ /index.php?$query_string;", "    }", "    location ~ \\.php$ {", "        fastcgi_pass unix:/run/php/php8.3-fpm.sock;", "        include fastcgi.conf;", "    }", "}"]
SARAN = ["chmod -R 777 /var/www/silapor", "", "# lalu di berkas .env", "APP_DEBUG=true"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 9', judul='Test dan online', sub='Aturan dijaga test otomatis, aplikasi berjalan dengan HTTPS', lapis='deploy'))],
 2: [A('poin', a=dict(judul='Test otomatis: kode yang memeriksa kode', warna='#a3e635', kol=3, tinggi=380, item=[
        dict(k=0, d=.6, besar='Klik sendiri', judul='Melelahkan', isi='Suatu hari pasti ada yang terlewat.'),
        dict(k=2, besar='Test', judul='Dijalankan dengan satu perintah', isi='Memeriksa hal yang sama, setiap kali.'),
        dict(k=4, besar='Pilih', judul='Aturan yang berat akibatnya', isi='Privasi, alur status, dan upload.')])), E('b03', 'b03_nama', 5)],
 3: [R('b03_nama', 'b03_lina'), R('b03_lina', 'b03_dimas', kalimat=1), R('b03_dimas', 'b03_refresh'), R('b03_refresh', 'b03_memori', kalimat=3), R('b03_memori', 'b03_akhir', kalimat=4), E('b04', 'b04_status', 5)],
 4: [R('b04_status', 'b04_upload'), R('b04_upload', 'b04_jalan', kalimat=1), R('b04_jalan', 'b04_akhir', kalimat=3, maks=1.3)],
 5: [R('b05', 'b05_merah', kalimat=2, maks=1.5), R('b05_merah', 'b05_merah_akhir', kalimat=3, maks=1.3), R('b05_balik', 'b05_hijau_akhir', kalimat=5, maks=2.5), E('b05_commit', 'b05_commit_akhir', 1.3)],
 6: [A('susunanServer', min=20)],
 7: [T('Menyiapkan server', [dict(k=0, d=.5, cmd='ssh admin@silapor.sekolahmu.sch.id', out=['Welcome to Ubuntu 24.04 LTS']), dict(k=1, d=.3, cmd='sudo apt install nginx mysql-server composer git', out=[]), dict(k=1, d=2.6, cmd='sudo apt install php-fpm php-mysql php-gd php-xml php-mbstring php-curl php-zip', out=['Setting up php8.3-fpm ... done']),
        dict(k=3, d=.3, cmd='cd /var/www && sudo git clone https://github.com/listyantidewi1/SiLapor.git silapor', out=["Cloning into 'silapor'... done."]), dict(k=3, d=6.5, cmd='cd silapor && composer install --no-dev', out=['Installing dependencies from lock file', 'Generating optimized autoload files'])],
        size=26, tinggi=560, repo=dict(k=2, ket='Perintah lengkap ada di README', y=860))],
 8: [A('kodeJelas', min=14, a=dict(judul='Berkas .env di server', warna='#ffb020', berkas='.env  (disalin dari .env.example)', kode=ENV, size=30, w=1640, langkah=[
        dict(k=2, sorot=[1], ket='APP_ENV=production'), dict(k=3, sorot=[3], ket='APP_DEBUG=false: pesan error tidak ditampilkan kepada pengunjung'), dict(k=4, sorot=[6, 7, 8, 9], ket='Database: pengguna dan kata sandi yang dibuat di server, seperti di bab satu')])),
     T('Kunci, tabel, dan data awal', [dict(k=5, d=.3, cmd='php artisan key:generate', out=['   INFO  Application key set successfully.']), dict(k=5, d=3.0, cmd='php artisan migrate --force', out=['   INFO  Running migrations.']), dict(k=5, d=5.5, cmd='php artisan db:seed --force', out=['   INFO  Seeding database.'])],
        size=28, tinggi=470, catatan=[dict(k=6, teks='Ganti kata sandi admin', isi='Kata sandi contoh dari seeder diketahui semua orang.', warna='#ff6b6b')])],
 9: [T('Dua folder yang boleh ditulis', [dict(k=1, d=.5, cmd='sudo chown -R www-data:www-data storage bootstrap/cache', out=[])], size=30, tinggi=300,
        catatan=None, sub='storage dan bootstrap/cache, untuk pengguna www-data saja')],
 10: [A('kodeJelas', a=dict(judul='Pengaturan Nginx', warna='#a3e635', berkas='/etc/nginx/sites-available/silapor', kode=NGX, size=26, w=1640, langkah=[
        dict(k=0, d=2.5, sorot=[2], ket='root: baris yang paling penting'), dict(k=1, sorot=[2], ket='Arahkan ke folder public, bukan ke folder proyeknya'),
        dict(k=2, sorot=[2], ket='Kalau root menunjuk ke folder proyek, berkas .env bisa diunduh siapa saja')]))],
 11: [T('HTTPS gratis dari Let\'s Encrypt', [dict(k=2, d=.3, cmd='sudo apt install certbot python3-certbot-nginx', out=[]), dict(k=2, d=3.0, cmd='sudo certbot --nginx', out=['Which names would you like to activate HTTPS for?', '1: silapor.sekolahmu.sch.id', ['Congratulations! You have successfully enabled HTTPS', '#a3e635']])],
        size=28, tinggi=470, lebar=1060, catatan=[dict(k=0, d=.6, teks='Wajib untuk halaman login', isi='Tanpa HTTPS, kata sandi melintas di jaringan sebagai teks biasa.', warna='#ff6b6b'), dict(k=3, teks='Diperpanjang otomatis', isi='Certbot memperbarui sertifikat sebelum kedaluwarsa.', warna='#a3e635')])],
 12: [dict(T('Dua hal terakhir', [dict(k=1, d=.3, cmd='php artisan optimize', out=['   INFO  Caching framework bootstrap, configuration, and metadata.']), dict(k=3, d=.3, cmd='crontab -e', out=['# setiap malam pukul 01.00', '0 1 * * * mysqldump silapor > /backup/silapor-$(date +\\%F).sql', '5 1 * * * tar czf /backup/foto-$(date +\\%F).tgz /var/www/silapor/storage/app/private'])],
        size=27, tinggi=470, lebar=1640), bobot=2), A('poin', min=7, a=dict(judul='Backup harus di tempat lain', warna='#ff6b6b', kol=2, tinggi=300, item=[
        dict(k=4, d=.2, besar='Server yang sama', judul='Ikut hilang kalau servernya rusak', isi=''), dict(k=4, d=2.5, besar='Tempat lain', judul='Komputer lain atau penyimpanan cloud', isi='')]))],
 13: [A('cekAI', tambah=3.5, a=dict(perintah='muncul error permission denied di server, bagaimana memperbaikinya?', kode=SARAN, size=36, w=1300))],
 14: [A('masalahAI', a=dict(kode=SARAN, size=30, w=1640, masalah=[
        dict(k=0, judul='777: siapa pun di server boleh mengubah semua berkas', isi='Termasuk kode aplikasinya. Yang benar: hanya storage dan bootstrap/cache, hanya untuk www-data.', sorot=[0]),
        dict(k=1, judul='APP_DEBUG=true membuka isi dapur', isi='Setiap error menampilkan potongan kode, susunan folder, dan isi pengaturan kepada pengunjung.', sorot=[3])]))],
 15: [A('selesai', min=20)],
}
