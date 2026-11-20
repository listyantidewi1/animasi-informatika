# Metadata YouTube: Aplikasi Parkir dari Nol (SiParkir)

Video penuh: `SiParkir_Laravel_dari_Nol.mp4` (1:15:45) dengan subtitle `SiParkir_Laravel_dari_Nol.srt`. Thumbnail di folder `thumbnail/` (A disarankan).

## Judul (tiga versi, pasangkan dengan thumbnail yang sama hurufnya)
- **A (disarankan):** Cara Membuat Aplikasi Parkir dengan Laravel dan MySQL dari Nol sampai Online (Tarif, Struk, Rekap)
- **B:** Aplikasi Parkir Buatan AI Kehilangan Rp177.000. Kita Bangun Ulang dari Nol dengan Laravel
- **C:** Tutorial Laravel 13 Bahasa Indonesia: Aplikasi Parkir Lengkap (Login 3 Peran, Cetak Struk 58 mm, Docker)

Thumbnail A, B, C ada di folder `thumbnail/`. Semuanya menampilkan aplikasi yang sudah jadi, dengan tagline kecil "Jangan Langsung Percaya Hasil AI". Detik 0 sampai 3 video sama dengan thumbnail A.

## Deskripsi
Di video ini kita membangun SiParkir, aplikasi parkir untuk sekolah, dari folder kosong sampai online. Petugas mencatat kendaraan masuk dan tiketnya tercetak dengan kode QR. Saat kendaraan keluar, aplikasi menghitung tarifnya sendiri dan mencetak struk 58 mm. Pengelola membuka rekap pendapatan kapan saja.

Sekarang AI bisa membuatkan aplikasi seperti ini dalam beberapa menit. Tapi di versi buatan AI yang kucoba, jam di tiket bergeser tujuh jam, dan rekap bulan Oktober kehilangan Rp177.000 tanpa satu pun pesan error. Karena itu, setiap bab punya segmen "Cek kerjaan AI": potongan kode bergaya hasil AI yang terlihat benar, lalu kita cari dan buktikan di mana salahnya.

Kamu cukup mengenal dasar PHP. Semua cara memasang alat dibahas di Bab 1.

Yang kamu pelajari:
- Memasang PHP, Composer, MySQL, Git, dan VS Code, lalu membuat proyek Laravel 13
- Menggali kebutuhan dari pemakai, lalu merancang enam tabel dan hubungannya
- Migration, foreign key, aturan unique, index, model, dan seeder
- Login dengan tiga peran (admin, petugas, owner) dan middleware
- Halaman admin (CRUD), validasi berbahasa Indonesia, dan log aktivitas
- Rumus tarif parkir yang ditulis dengan test lebih dulu (Pest)
- Kendaraan masuk dan keluar dengan transaction, supaya tidak ada yang tercatat dua kali
- Cetak tiket dan struk 58 mm dengan kode QR
- Rekap pendapatan per rentang tanggal, EXPLAIN, dan index
- Feature test untuk hak akses dan transaksi
- Online dengan Docker Compose dan HTTPS

Bab:
0:00 Pembuka: aplikasi parkir buatan AI yang salah hitung
3:40 Bab 1: Persiapan, dari komputer kosong sampai Laravel berjalan
12:09 Bab 2: Kebutuhan, mengobrol dengan pemakai
17:11 Bab 3: Merancang database, enam tabel
21:47 Bab 4: Migration, model, dan data awal
29:11 Bab 5: Login dan tiga peran
34:57 Bab 6: Halaman admin (CRUD) dan log aktivitas
41:42 Bab 7: Rumus tarif dan test pertama
47:16 Bab 8: Kendaraan masuk dan keluar
53:45 Bab 9: Cetak tiket dan struk 58 mm dengan kode QR
58:16 Bab 10: Rekap pendapatan untuk owner
1:04:18 Bab 11: Test otomatis untuk peran dan transaksi
1:08:51 Bab 12: Online dengan Docker Compose

Kode lengkap, satu tag untuk setiap bab: https://github.com/listyantidewi1/SiParkir
Daftar periksa kode buatan AI ada di README repo.

Alat yang perlu dipasang (semuanya gratis):
- Laravel Herd (PHP, Composer, Node.js): https://herd.laravel.com
- MySQL: https://dev.mysql.com/downloads/
- Git: https://git-scm.com/downloads
- VS Code: https://code.visualstudio.com
Panduan memasang langkah demi langkah untuk Windows, Mac, dan Linux ada di README repo.

Catatan: semua nama, sekolah, dan data di video adalah contoh.

#laravel #php #mysql #webdevelopment #belajarcoding

## Kata kunci pencarian (tag)
cara membuat aplikasi parkir, aplikasi parkir laravel, tutorial laravel dari nol, laravel 13 bahasa indonesia, membuat aplikasi laravel mysql, aplikasi parkir php mysql, cetak struk 58mm laravel, laravel multi role login, rekap pendapatan laravel, deploy laravel docker compose, pest test laravel, cek kode buatan AI, belajar laravel pemula

## Komentar tersemat
Jam di tiket bergeser tujuh jam? Jawabannya di 10:08. Rp177.000 yang hilang dari rekap? Jawabannya di 1:02:26.

Semua segmen "Cek kerjaan AI": 16:01 aturan tarif karangan · 20:41 tabel · 27:58 migration · 33:38 menu admin · 40:25 mass assignment · 43:59 rumus 60 menit · 52:20 masuk dua kali · 56:52 struk palsu · 1:02:26 BETWEEN · 1:07:35 test yang tidak menjaga · 1:13:43 APP_DEBUG

Bab mana yang paling membantumu? Kalau kamu mengerjakan tantangan di akhir bab, ceritakan hasilnya di sini. Kode lengkap per bab: https://github.com/listyantidewi1/SiParkir

## Layar akhir dan playlist
- Layar akhir (20 detik terakhir): arahkan ke playlist "Membangun Aplikasi dari Nol", bukan ke satu video.
- Masukkan video penuh dan potongan per bab ke playlist itu.

## Potongan per bab (folder `per-bab/`)
Untuk playlist dan penonton yang mencari satu topik. Judul yang disarankan:
Durasi dan isi setiap potongan (folder `per-bab/`):
1. **SiParkir_01_Pembuka_Persiapan_Kebutuhan** (17:11): "Membuat Aplikasi Parkir dengan Laravel #1: Pasang Alat, Proyek Baru, dan Menggali Kebutuhan"
2. **SiParkir_02_Database_Migration** (12:00): "Membuat Aplikasi Parkir dengan Laravel #2: Merancang 6 Tabel MySQL, Migration, dan Seeder"
3. **SiParkir_03_Login_Admin** (12:30): "Membuat Aplikasi Parkir dengan Laravel #3: Login 3 Peran, Middleware, dan Halaman Admin (CRUD)"
4. **SiParkir_04_Tarif_Masuk_Keluar** (12:03): "Membuat Aplikasi Parkir dengan Laravel #4: Rumus Tarif dengan Test Pest, Kendaraan Masuk dan Keluar"
5. **SiParkir_05_Struk_Rekap** (10:33): "Membuat Aplikasi Parkir dengan Laravel #5: Cetak Struk 58 mm dengan QR, Rekap Pendapatan, EXPLAIN"
6. **SiParkir_06_Test_Online** (11:26): "Membuat Aplikasi Parkir dengan Laravel #6: Feature Test dan Online dengan Docker Compose + HTTPS"

Setiap potongan punya berkas .srt dan daftar chapter sendiri (`*_chapter.txt`). Di deskripsinya, tautkan video penuh di baris pertama.

## Short (5 buah, folder `short/`)
Judul Short = kalimat kait di layar, ditambah "#shorts". Setiap Short ditutup ajakan lisan lima detik ke video lengkap. Setelah video panjang tayang, isi "Related video" setiap Short dengan video lengkapnya.
1. `P00_short.mp4` (1:06): **Aplikasi parkir ini dibuat AI dan berjalan lancar. Coba lihat jam di tiketnya… #shorts** (jawabannya: Bab 1, 10:08)
2. `P07_short.mp4` (1:23): **Rumus tarif parkir dari AI. Berapa yang harus dibayar untuk parkir tepat 60 menit? #shorts** (Bab 7, 43:59)
3. `P08_short.mp4` (1:04): **AI diminta mencegah kendaraan masuk dua kali. Kapan kode ini gagal? #shorts** (Bab 8, 52:20)
4. `P09_short.mp4` (1:03): **Halaman struk buatan AI. Apa yang bisa dilakukan petugas yang tidak jujur? #shorts** (Bab 9, 56:52)
5. `P10_short.mp4` (1:26): **Rekap pendapatan dari AI kehilangan Rp177.000. Penyebabnya satu kata di query. #shorts** (Bab 10, 1:02:26)

Urutan unggah yang disarankan: P10 dulu (angka uang paling mengundang klik), lalu P00, P07, P08, P09. Semua Short bersuara Cahaya, dengan ajakan lisan ke video lengkap di 9 detik terakhir.
