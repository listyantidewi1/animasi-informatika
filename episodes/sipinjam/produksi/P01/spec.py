NAMA = "P01_persiapan"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
KODE = ['<?php', '$host = "localhost";', '$user = "root";', '$pass = "";', '$db   = "sipinjam";', '', '$conn = mysqli_connect($host, $user, $pass, $db);']
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 1', judul='Persiapan', sub='Memasang alat sampai halaman pertama tampil', lapis='semua')),
     A('poin', kalimat=2, min=8, a=dict(judul='Tiga alat, semuanya gratis', warna='#ffb020', kol=2, tinggi=300, item=[
        dict(k=2, d=.6, besar='1  XAMPP', judul='PHP dan database MySQL', isi='Satu paket, sekali pasang.', warna='#ffb020'),
        dict(k=2, d=1.6, besar='2  Git', judul='Menyimpan riwayat kode', isi='Membawa terminal Git Bash.', warna='#ff6b6b'),
        dict(k=2, d=2.6, besar='3  VS Code', judul='Tempat menulis kode', isi='Editor dengan terminal di dalamnya.', warna='#38bdf8'),
        dict(k=3, d=.4, besar='Sudah punya?', judul='Lompat ke bagian membuat database', isi='Lewat cap waktu di deskripsi.', warna='#a3e635')]))],
 2: [A('siapXampp', tambah=2.5)],
 3: [A('siapPath', tambah=1.5)],
 4: [A('siapGit', tambah=1)],
 5: [R('b05', 'b05_akhir', kalimat=1, maks=1.5), A('termGambar', kalimat=3, min=8, a=dict(judul='Kalau jawabannya command not found', warna='#ff6b6b', termJudul='Git Bash', size=30, tinggi=420, baris=[
        dict(k=3, d=.5, cmd='php --version', out=[['bash: php: command not found', '#ff8a8a']])],
        catatan=[dict(k=3, d=2.5, teks='Path belum terbaca', isi='Langkah Path tadi belum sampai ke terminal ini.', warna='#ff6b6b', h=200, yi=110),
                 dict(k=4, teks='Tutup VS Code, buka lagi', isi='Lalu coba perintahnya sekali lagi.', warna='#a3e635', h=200, yi=110)]))],
 6: [R('b06', 'b06_mkdir', kalimat=1), R('b06_mkdir', 'b06_public', kalimat=2, maks=2), R('b06_public', 'b06_app', kalimat=3), R('b06_app', 'b06_database', kalimat=4), R('b06_database', 'b06_tiga', kalimat=5), R('b06_tiga', 'b06_akhir', kalimat=6)],
 7: [R('b07', 'b07_db', kalimat=1, maks=1.5), R('b07_db', 'b07_user', kalimat=3), R('b07_user', 'b07_grant', kalimat=4), R('b07_grant', 'b07_akhir', kalimat=5)],
 8: [R('b08', 'b08_host', maks=3), R('b08_host', 'b08_port', kalimat=2), R('b08_port', 'b08_nama', kalimat=3), R('b08_nama', 'b08_debug', kalimat=4), R('b08_debug', 'b08_akhir', kalimat=5)],
 9: [R('b09', 'b09_ignore', kalimat=1, maks=4), R('b09_ignore', 'b09_contoh'), R('b09_contoh', 'b09_kosong', kalimat=2, maks=4), R('b09_kosong', 'b09_akhir'),
     A('termGambar', kalimat=3, min=9, a=dict(judul='Mengambil proyek ini dari GitHub?', warna='#ffb020', termJudul='Git Bash', size=30, tinggi=300, lebar=1640, baris=[
        dict(k=3, d=3.0, cmd='cp .env.example .env', out=['# lalu buka .env dan isi DB_PASS'])], repo=dict(k=3, ket='Langkah lengkapnya ada di README', y=600)))],
 10: [R('b10', 'b10_env', maks=5), R('b10_env', 'b10_pdo', kalimat=2), R('b10_pdo', 'b10_versi', kalimat=3), R('b10_versi', 'b10_akhir', kalimat=4)],
 11: [R('b11', 'b11_jalan', maks=1.5), W('mulai', 'muncul', kalimat=2, maks=1.3), W('muncul', 'akhir', kalimat=3, maks=1.3),
      A('poin', kalimat=4, min=6, a=dict(judul='Kalau yang muncul Access denied', warna='#ff6b6b', kol=1, tinggi=200, sj=34, item=[
        dict(k=4, d=.3, judul="Access denied for user 'sipinjam'@'localhost'", mono=1, isi='Nama pengguna atau kata sandi di .env belum cocok dengan yang dibuat di MySQL.', warna='#ff6b6b'),
        dict(k=4, d=3.0, judul='Periksa DB_USER dan DB_PASS di .env', isi='Samakan dengan perintah CREATE USER tadi, lalu muat ulang halamannya.', warna='#a3e635')])),
      R('b11_stop', 'b11_akhir', kalimat=5)],
 12: [A('cobaHP1', tambah=2)],
 13: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan koneksi database untuk aplikasi peminjaman', kode=KODE, size=36, w=1300))],
 14: [A('masalahAI', a=dict(kode=KODE, size=30, w=1640, masalah=[
        dict(k=1, judul='root adalah pemilik semua database', isi='Kalau aplikasi ini dibobol, penyerang mendapat semua database di server itu.', sorot=[2]),
        dict(k=3, judul='Kata sandi di dalam kode ikut ke GitHub', isi='Semua orang yang membuka repositorinya bisa membacanya.', sorot=[3]),
        dict(k=4, judul='Obatnya sudah kita buat', isi='Pengguna khusus dengan lima hak, dan kata sandi di berkas .env.', sorot=[], warna='#a3e635')])),
      R('b14', 'b14_akhir', kalimat=5, maks=2), A('lanjut', kalimat=7, min=9, a=dict(selesai='PHP, MySQL, dan Git siap, dan halaman pertama sudah tampil.', berikut='Bab 2: Kebutuhan'))],
}
