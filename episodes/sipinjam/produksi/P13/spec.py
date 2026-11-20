NAMA = "P13_online"
REKAMAN = ["rek"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
KODE = ["server {", "    listen 80;", "    server_name sipinjam.sekolahmu.sch.id;", "", "    root /var/www/sipinjam;", "    index index.php;", "",
        "    location ~ \\.php$ {", "        include snippets/fastcgi-php.conf;", "        fastcgi_pass unix:/run/php/php8.3-fpm.sock;", "    }", "}", "", "# .env", "APP_DEBUG=true"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 13', judul='Online', sub='Server sungguhan, HTTPS, dan cadangan setiap malam', lapis='deploy'))],
 2: [A('poin', a=dict(judul='Tiga hal yang perlu disiapkan', warna='#ffb020', kol=3, tinggi=340, item=[
        dict(k=1, besar='1', judul='Server Linux', isi='VPS sewaan, atau komputer di ruang server sekolah.'), dict(k=2, besar='2', judul='Nama domain', isi='Alamat yang mudah diingat.'),
        dict(k=3, besar='3', judul='Nginx, PHP-FPM, MySQL, Git', isi='Empat program di server.')], repo=dict(k=4, ket='Perintah pemasangan lengkap ada di README', y=890)))],
 3: [A('termGambar', a=dict(judul='Di server: mirip dengan bab 1', termJudul='Terminal server', size=25, tinggi=660, baris=[
        dict(k=1, cmd='git clone https://github.com/listyantidewi1/SiPinjam.git sipinjam', out=[]),
        dict(k=2, cmd='sudo mysql', out=['mysql> CREATE DATABASE sipinjam;', "mysql> CREATE USER 'sipinjam'@'localhost' IDENTIFIED BY 'kata-sandi-panjang-dan-acak';", 'mysql> GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON sipinjam.* ...']),
        dict(k=3, cmd='sudo mysql sipinjam < database/01_tabel.sql', out=[['lalu 02_fungsi.sql dan 03_trigger.sql', '#ffb020']]),
        dict(k=4, cmd='cp .env.example .env', out=[['isi DB_PASS, lalu ubah: APP_DEBUG=false', '#ffb020']])]))],
 4: [R('b04', 'b04_root', kalimat=0, maks=10), R('b04_root', 'b04_php', kalimat=1), R('b04_php', 'b04_titik', kalimat=2), R('b04_titik', 'b04_akhir', kalimat=3)],
 5: [A('termGambar', min=14, a=dict(judul='HTTPS dengan Certbot', warna='#a3e635', termJudul='Terminal server', size=26, tinggi=330, baris=[
        dict(k=0, d=1.5, cmd='sudo certbot --nginx -d sipinjam.sekolahmu.sch.id', out=[['Successfully received certificate.', '#a3e635']])],
        catatan=[dict(k=0, d=5.0, teks='Gratis, dari Let\'s Encrypt', isi='Diperpanjang sendiri.', warna='#a3e635'), dict(k=1, teks='Tanpa HTTPS', isi='Kata sandi yang diketik di WiFi sekolah bisa dibaca orang lain.', warna='#ff6b6b', h=230, yi=92)])), R('b05', 'b05_dump', kalimat=2, maks=3), R('b05_dump', 'b05_cron', kalimat=3), R('b05_cron', 'b05_akhir', kalimat=4, maks=4), A('poin', kalimat=5, min=6, a=dict(judul='Cadangan', warna='#ffb020', kol=1, tinggi=300, sj=44, item=[dict(judul='Cadangan yang belum pernah dicoba dipulihkan belum bisa disebut cadangan.')]))],
 6: [A('cekAI', tambah=3.5, a=dict(perintah='buat pengaturan Nginx supaya situsnya cepat jalan', kode=KODE, size=26, w=1300))],
 7: [R('b07', 'b07_curl', kalimat=1, maks=1.5), R('b07_curl', 'b07_bocor', kalimat=2, maks=1.3), R('b07_bocor', 'b07_bocor_akhir', kalimat=3, maks=2.5), A('poin', kalimat=4, min=14, a=dict(judul='Yang ikut terbuka', warna='#ff6b6b', kol=2, tinggi=400, item=[
        dict(k=4, d=.4, besar='GET /.env', mono=True, judul='Robot pencari celah mencobanya setiap hari', isi='Siapa pun di internet bisa melakukan hal yang sama.', warna='#ff6b6b'),
        dict(k=5, besar='APP_DEBUG=true', mono=True, judul='Setiap error tampil ke publik', isi='Lengkap dengan nama berkas dan nomor baris.', warna='#ffb020')])), R('b07_public', 'b07_akhir', kalimat=6, asli=True, speed=3.2, db=-8.9), R('b07_akhir', 'b07_akhir', da=-8.9, db=-5.0, ekor=True), dict(k='rek', a='b07_commit', b='b07_commit_akhir', asli=True, ekor=True, speed=2.0)],
 8: [A('penutup')],
}
