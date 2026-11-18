# Metadata YouTube: Membangun Aplikasi dari Nol (Sistem Antrean)

## Judul
Membangun Aplikasi dari Nol: Sistem Antrean Bengkel (Node.js, PostgreSQL, Docker) + Cek Kerjaan AI

Alternatif:
- Bikin Aplikasi Antrean dari Nol sampai Online (Full Stack Node.js + PostgreSQL)
- Full Stack dari Nol: Sistem Antrean dan Reservasi, Lengkap dengan Cek Kode AI

## Deskripsi
Sekarang AI bisa membuatkan aplikasi dalam hitungan menit. Tapi apakah kamu tahu kalau hasilnya benar? Di video ini kita membangun SiAntre, sistem antrean dan reservasi untuk Bengkel Maju Jaya milik Pak Rahmat, dari wawancara kebutuhan sampai aplikasi online dengan HTTPS. Setiap bab punya segmen "Cek kerjaan AI": contoh kode bergaya hasil AI yang terlihat benar, lalu kita cari sendiri di mana rusaknya.

Yang kamu pelajari:
- Menggali kebutuhan dari pemakai sungguhan, bukan dari tebakan
- Merancang database PostgreSQL dan menulis SQL dengan tangan sendiri
- REST API dengan Node.js dan Express
- Race condition: dua petugas menekan Panggil bersamaan, dan cara mencegahnya dengan transaksi
- Reservasi tanpa dobel booking (constraint di database)
- Login, hash password, dan bahaya IDOR
- Layar TV real time dengan Server-Sent Events dan suara panggilan
- Halaman pelanggan, petugas, dan TV yang ramah HP
- Laporan dengan SQL dan test otomatis
- Deploy dengan Docker, Nginx, HTTPS, dan backup

Bonus: daftar periksa kode AI (PDF satu halaman) dan kode lengkap per bab.

Bab:
0:00 Pembuka: aplikasi yang dibuat AI dan nomor ganda
3:49 Bab 1: Kebutuhan, bicara dulu dengan pemakai
10:31 Bab 2: Merancang database
17:04 Bab 3: SQL dengan tangan sendiri
25:27 Bab 4: Server pertama
32:46 Bab 5: REST API ambil nomor
40:09 Bab 6: Dua petugas menekan Panggil bersamaan
47:29 Bab 7: Reservasi slot tanpa dobel booking
53:17 Bab 8: Login dan keamanan
59:44 Bab 9: Layar TV real time dan suara
1:06:19 Bab 10: Halaman pelanggan, petugas, dan TV
1:12:28 Bab 11: Laporan dan pengujian
1:18:34 Bab 12: Online dengan Docker dan HTTPS

Kode lengkap (riwayat Git per bab, tag bab-01 sampai bab-12): https://github.com/listyantidewi1/SiAntre
Daftar periksa kode AI (PDF): [link]

Alat yang perlu dipasang (semuanya gratis):
- Node.js (pilih versi LTS): https://nodejs.org
- PostgreSQL: https://www.postgresql.org/download/
- VS Code: https://code.visualstudio.com
- Git: https://git-scm.com/downloads
- Docker Desktop (hanya untuk Bab 12): https://www.docker.com/products/docker-desktop/
Panduan memasang langkah demi langkah, termasuk untuk Windows, Mac, dan Linux, ada di README repo: https://github.com/listyantidewi1/SiAntre

Ingin memakai MySQL? Cara termudah untuk mengikuti video ini adalah tetap memakai PostgreSQL. Semua konsepnya tetap berlaku di MySQL 8, tetapi kodenya perlu disesuaikan, dan ada dua jebakan yang tidak terlihat dari luar. Kami sudah mengubah seluruh SiAntre ke MySQL 8 dan mengujinya. Tutorial tertulisnya, lengkap dengan gambar dan kode siap salin, ada di https://github.com/listyantidewi1/SiAntre/blob/main/docs/mysql/README.md

Catatan: semua data di video adalah data contoh. Domain antre.bengkelmajujaya.test hanya untuk demo lokal; di server sungguhan, pakai domain milikmu sendiri dan sertifikat dari Let's Encrypt.

#fullstack #nodejs #postgresql #webdevelopment #belajarcoding

## Kata kunci pencarian (tag)
membuat aplikasi antrean, full stack dari nol, tutorial node js express postgresql, rest api bahasa indonesia, race condition database, docker nginx https, cek kode buatan AI, proyek RPL, sistem reservasi online, server sent events

## Komentar tersemat
Bab mana yang paling membantumu? Kalau kamu mengerjakan tantangan di akhir bab, tulis jawabanmu di sini. Kode lengkap per bab ada di link deskripsi.

## Short (13 buah, akhir/short/)
Judul Short = kalimat kait di layar, ditambah "#shorts". Deskripsi Short: "Video lengkap: Membangun Aplikasi dari Nol: Sistem Antrean Bengkel [link video]".
