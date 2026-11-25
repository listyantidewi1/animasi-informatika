# Metadata YouTube: Aplikasi Parkir dari Nol (SiParkir)

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
{BAB}

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
Bab mana yang paling membantumu? Kalau kamu mengerjakan tantangan di akhir bab, ceritakan hasilnya di sini. Kode lengkap per bab: https://github.com/listyantidewi1/SiParkir

## Layar akhir dan playlist
- Layar akhir (20 detik terakhir): arahkan ke playlist "Membangun Aplikasi dari Nol", bukan ke satu video.
- Masukkan video penuh dan potongan per bab ke playlist itu.

## Potongan per bab (folder `per-bab/`)
Untuk playlist dan penonton yang mencari satu topik. Judul yang disarankan:
{POTONGAN}

## Short (5 buah, folder `short/`)
Judul Short = kalimat kait di layar, ditambah "#shorts". Setiap Short ditutup ajakan lisan lima detik ke video lengkap. Setelah video panjang tayang, isi "Related video" setiap Short dengan video lengkapnya.
{SHORT}
