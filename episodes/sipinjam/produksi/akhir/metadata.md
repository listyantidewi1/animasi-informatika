# Metadata YouTube: Aplikasi Peminjaman Alat dari Nol dengan PHP dan MySQL (SiPinjam)

## Judul (tiga versi untuk Test & Compare)
1. Membuat Aplikasi Peminjaman Alat dari Nol dengan PHP & MySQL (Stored Procedure, Trigger, Transaksi)
2. PHP + MySQL dari Nol sampai Online: Bikin Aplikasi Peminjaman Alat Sekolah
3. Tutorial PHP MySQL Lengkap: Aplikasi Peminjaman Alat, dari Database sampai HTTPS

Thumbnail: `thumbnail.png` (tampilan aplikasi yang sudah jadi, teks "Bikin Aplikasi Peminjaman Alat dari Nol", tagline kecil "Jangan Langsung Percaya Hasil AI").

## Deskripsi
Di video ini kita membangun SiPinjam, aplikasi peminjaman alat lab untuk SMK Nusa Bakti, dari komputer kosong sampai online dengan HTTPS. Semuanya memakai PHP dan MySQL tanpa framework, supaya kamu melihat sendiri cara kerja setiap bagiannya. Siswa mengajukan pinjaman dari HP, petugas lab menyetujui dan mencatat pengembalian, dan denda dihitung otomatis oleh database.

Aturan pentingnya kita taruh di dalam database: function untuk denda, stored procedure dengan transaksi dan kunci baris supaya satu alat tidak dipinjam dua orang, serta trigger untuk stok dan log. Di setiap bab ada segmen "Cek kerjaan AI": potongan kode yang lazim ditulis AI, lalu kita buktikan di mana rusaknya.

Kamu cukup mengenal dasar PHP dan HTML. Cara memasang XAMPP, VS Code, dan Git dibahas di Bab 1.

Yang kamu pelajari:
- Memasang XAMPP, VS Code, dan Git, lalu membuat database dan pengguna database khusus
- Menggali kebutuhan dari pemakai dan menuliskannya menjadi aturan
- Merancang tujuh tabel: primary key, foreign key, ENUM, DECIMAL, CHECK, dan index
- Function, stored procedure, transaksi (COMMIT dan ROLLBACK), SELECT ... FOR UPDATE, dan SIGNAL
- Trigger untuk log aktivitas dan stok
- PHP dengan PDO dan prepared statement, supaya aman dari SQL injection
- Login, session, password_hash, tiga peran, dan token CSRF
- CRUD dengan validasi dan paginasi, halaman untuk HP, dan laporan yang bisa disimpan sebagai PDF
- Menguji dengan skenario, termasuk sepuluh permintaan bersamaan
- Online dengan Nginx, PHP-FPM, HTTPS dari Certbot, dan cadangan harian

Bab:
0:00 Pembuka: satu kamera, dua peminjam
3:36 Bab 1: Persiapan XAMPP, VS Code, Git, dan database
12:29 Bab 2: Kebutuhan dan empat aturan
16:28 Bab 3: Merancang database, tujuh tabel
20:03 Bab 4: CREATE TABLE, foreign key, dan index
25:08 Bab 5: Function, stored procedure, dan transaksi
32:18 Bab 6: Trigger dan log aktivitas
36:51 Bab 7: PHP dan PDO, prepared statement
42:11 Bab 8: Login, session, dan tiga peran
46:58 Bab 9: CRUD alat untuk admin
51:53 Bab 10: Halaman peminjam di HP
56:35 Bab 11: Halaman petugas, denda, dan laporan PDF
1:01:34 Bab 12: Menguji, sepuluh permintaan bersamaan
1:05:35 Bab 13: Online dengan Nginx dan HTTPS

Kode lengkap, satu tag untuk setiap bab: https://github.com/listyantidewi1/SiPinjam
Daftar periksa kode buatan AI: https://github.com/listyantidewi1/SiPinjam/blob/main/docs/DAFTAR_PERIKSA.md
Playlist Membangun Aplikasi dari Nol: [link playlist]

Alat yang perlu dipasang (semuanya gratis):
- XAMPP (PHP dan MySQL): https://www.apachefriends.org
- Git: https://git-scm.com
- VS Code: https://code.visualstudio.com
Panduan memasang untuk Windows, Mac, dan Linux, serta perintah untuk server, ada di README repo.

Catatan: semua nama, sekolah, dan data di video adalah contoh.

#php #mysql #webdevelopment #belajarcoding #pemrogramanweb

## Kata kunci pencarian (tag)
tutorial php mysql dari nol, membuat aplikasi php mysql, aplikasi peminjaman alat php, stored procedure mysql, trigger mysql, transaksi mysql commit rollback, php pdo prepared statement, login php session, crud php mysql, belajar php pemula, php native tanpa framework, deploy php nginx https, cek kode buatan AI

## Komentar tersemat
Bab mana yang paling membantumu? Kalau kamu mengerjakan tantangan perpanjangan pinjaman di akhir video, ceritakan hasilnya di sini. Kode lengkap per bab: https://github.com/listyantidewi1/SiPinjam

## Layar akhir dan kartu
Layar akhir mengarah ke playlist "Membangun Aplikasi dari Nol" (video SiLapor dan SiAntre). Video ini juga dimasukkan ke playlist yang sama.

## Potongan per bab (folder bab/)
Empat belas berkas, satu per bab, untuk diunggah sebagai video terpisah di playlist "Membangun Aplikasi dari Nol". Judul yang disarankan: "<judul bab> | Aplikasi Peminjaman Alat PHP MySQL #<nomor bab>". Di deskripsinya, tautkan video lengkap dan repo.
- bab/SiPinjam_Bab00_Pembuka.mp4 (3:36): Pembuka: satu kamera, dua peminjam
- bab/SiPinjam_Bab01_Persiapan.mp4 (8:53): Bab 1: Persiapan XAMPP, VS Code, Git, dan database
- bab/SiPinjam_Bab02_Kebutuhan.mp4 (3:59): Bab 2: Kebutuhan dan empat aturan
- bab/SiPinjam_Bab03_Merancang_Database.mp4 (3:35): Bab 3: Merancang database, tujuh tabel
- bab/SiPinjam_Bab04_CREATE_TABLE.mp4 (5:04): Bab 4: CREATE TABLE, foreign key, dan index
- bab/SiPinjam_Bab05_Function_dan_Stored_Procedure.mp4 (7:09): Bab 5: Function, stored procedure, dan transaksi
- bab/SiPinjam_Bab06_Trigger.mp4 (4:32): Bab 6: Trigger dan log aktivitas
- bab/SiPinjam_Bab07_PHP_dan_PDO.mp4 (5:20): Bab 7: PHP dan PDO, prepared statement
- bab/SiPinjam_Bab08_Login_dan_Peran.mp4 (4:47): Bab 8: Login, session, dan tiga peran
- bab/SiPinjam_Bab09_Halaman_Admin.mp4 (4:54): Bab 9: CRUD alat untuk admin
- bab/SiPinjam_Bab10_Halaman_Peminjam.mp4 (4:41): Bab 10: Halaman peminjam di HP
- bab/SiPinjam_Bab11_Halaman_Petugas_dan_Laporan.mp4 (4:59): Bab 11: Halaman petugas, denda, dan laporan PDF
- bab/SiPinjam_Bab12_Pengujian.mp4 (4:01): Bab 12: Menguji, sepuluh permintaan bersamaan
- bab/SiPinjam_Bab13_Online.mp4 (4:21): Bab 13: Online dengan Nginx dan HTTPS

## Short (5 buah, folder short/)
Judul Short = kalimat kait di layar, ditambah "#shorts". Deskripsi Short: "Video lengkap: Aplikasi Peminjaman Alat dari Nol dengan PHP dan MySQL [link video]". Pasang video lengkap sebagai Related video di setiap Short.
- short/P00_short.mp4 (1:09): Satu kamera terakhir. Dua siswa menekan tombol bersamaan. Siapa yang dapat?
- short/P05_short.mp4 (1:04): Prosedur pengembalian dari AI ini berjalan. Ada dua masalah di dalamnya.
- short/P07_short.mp4 (1:20): Login sebagai admin tanpa tahu kata sandinya? Cukup satu tanda kutip.
- short/P10_short.mp4 (1:19): Rafi mengganti satu angka di alamat. Pinjaman orang lain ikut batal.
- short/P13_short.mp4 (1:19): Satu pengaturan server dari AI, dan kata sandi database bisa diunduh siapa pun.
