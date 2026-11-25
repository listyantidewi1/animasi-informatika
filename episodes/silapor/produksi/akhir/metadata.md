# Metadata YouTube: Membangun Aplikasi Laravel dari Nol (SiLapor)

## Judul
Membangun Aplikasi Laravel dari Nol: Lapor Sarana Sekolah (Laravel 13, MySQL, HTTPS) + Cek Kerjaan AI

Alternatif:
- Laravel dari Nol sampai Online: Aplikasi Pengaduan Sarana Sekolah
- Bikin Aplikasi Laravel + MySQL dari Komputer Kosong, Lengkap dengan Cek Kode AI

## Deskripsi
Sekarang AI bisa membuatkan aplikasi dengan satu kalimat. Tapi apakah kamu tahu kapan hasilnya benar? Di video ini kita membangun SiLapor, aplikasi pengaduan sarana untuk SMK Nusa Bakti, dari komputer kosong sampai aplikasinya online dengan HTTPS. Siswa memotret fasilitas yang rusak dan mengirim laporan dari HP, lalu petugas membalas, mengubah status, dan mengunggah foto hasil perbaikan. Setiap bab punya segmen "Cek kerjaan AI": contoh kode bergaya hasil AI yang terlihat benar, lalu kita cari sendiri di mana rusaknya.

Kamu cukup mengenal dasar PHP. Semua cara memasang alat dibahas di Bab 1, jadi kamu bisa mulai dari komputer yang masih kosong.

Yang kamu pelajari:
- Memasang PHP, Composer, MySQL, Git, dan VS Code, lalu membuat proyek Laravel
- Menggali kebutuhan dari pemakai sungguhan
- Merancang empat tabel dan hubungannya, lalu menulis migration dan query SQL
- Login, peran siswa dan petugas, middleware, dan pembatasan percobaan login
- Upload foto yang aman: periksa isi berkas, simpan di luar folder publik, buang data lokasi
- Alur status laporan dengan riwayat yang tidak bisa diubah, dalam satu transaksi
- Hak akses dengan policy, supaya siswa hanya melihat laporannya sendiri
- Tampilan yang nyaman di HP
- Test otomatis, lalu memasang aplikasi di server dengan Nginx dan HTTPS

Bab:
0:00 Pembuka: aplikasi buatan AI yang membocorkan laporan
4:14 Bab 1: Persiapan, dari komputer kosong sampai Laravel berjalan
12:15 Bab 2: Kebutuhan, mengobrol dengan pemakai
17:06 Bab 3: Merancang data, empat tabel
22:45 Bab 4: Migration dan SQL
30:42 Bab 5: Login dan peran
38:27 Bab 6: Form laporan dan upload foto yang aman
45:52 Bab 7: Halaman petugas dan alur status
53:00 Bab 8: Halaman siswa dan hak akses
58:28 Bab 9: Test otomatis dan online dengan HTTPS

Kode lengkap, satu tag untuk setiap bab: https://github.com/listyantidewi1/SiLapor
Daftar periksa kode buatan AI: https://github.com/listyantidewi1/SiLapor/blob/main/docs/daftar-periksa-kode-ai.md

Alat yang perlu dipasang (semuanya gratis):
- Laravel Herd (PHP, Composer, Node.js): https://herd.laravel.com
- MySQL: https://dev.mysql.com/downloads/
- Git: https://git-scm.com/downloads
- VS Code: https://code.visualstudio.com
Panduan memasang langkah demi langkah untuk Windows, Mac, dan Linux ada di README repo.

Catatan: semua nama, sekolah, dan data di video adalah contoh.

#laravel #php #mysql #webdevelopment #belajarcoding

## Kata kunci pencarian (tag)
tutorial laravel dari nol, laravel 13 bahasa indonesia, membuat aplikasi laravel mysql, aplikasi pengaduan sekolah, upload foto laravel aman, laravel policy hak akses, deploy laravel nginx https, cek kode buatan AI, proyek RPL, belajar laravel pemula

## Komentar tersemat
Bab mana yang paling membantumu? Kalau kamu mengerjakan tantangan di akhir bab, ceritakan hasilnya di sini. Kode lengkap per bab ada di link deskripsi.

## Short (5 buah, folder short/)
Judul Short = kalimat kait di layar, ditambah "#shorts". Deskripsi Short: "Video lengkap: Membangun Aplikasi Laravel dari Nol [link video]".
- L00_short.mp4 (1:11): Aplikasi sekolah ini dibuat AI dan berjalan lancar. Coba ganti satu angka di alamatnya…
- L04_short.mp4 (1:01): Query dari AI untuk laporan bulan November. Hasilnya muncul, tapi jumlahnya salah.
- L05_short.mp4 (0:56): Fungsi login dari AI ini berjalan. Ada dua masalah besar di dalamnya.
- L08_short.mp4 (0:49): AI mengganti {{ }} menjadi {!! !!} supaya baris baru tampil. Apa yang ikut tampil?
- L09_short.mp4 (0:58): Saran AI saat server error: chmod 777 dan debug true. Apa bahayanya?
