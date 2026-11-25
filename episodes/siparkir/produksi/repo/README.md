# SiParkir

SiParkir adalah aplikasi parkir untuk sekolah. Petugas mencatat kendaraan yang masuk dan tiketnya langsung tercetak. Saat kendaraan keluar, aplikasi menghitung biayanya sendiri lalu mencetak struk. Pengelola bisa membuka rekap pendapatan kapan saja, dan admin mengatur tarif, area, serta akun petugas.

Aplikasi ini dibangun dari nol, langkah demi langkah, di video **"Membangun Aplikasi Parkir dengan Laravel dari Nol"** di kanal YouTube [@iTeachSWE](https://www.youtube.com/@iTeachSWE). Repositori ini berisi kode lengkapnya, ditambah semua perintah yang di video hanya disebut sekilas.

Dibuat dengan Laravel 13, PHP 8.3, MySQL 8, Blade, dan Pest. Tidak ada framework JavaScript.

## Tampilan

Semua gambar di bawah ini diambil dari aplikasi yang sedang berjalan, dengan data contoh dari `ContohSeeder`.

**Halaman petugas.** Pak Joko mencatat kendaraan masuk, mencari tiket, lalu memproses kendaraan keluar.

| Kendaraan masuk dan daftar yang sedang parkir | Kendaraan keluar dan biayanya |
| --- | --- |
| ![Halaman parkir untuk petugas](docs/gambar/petugas-parkir.png) | ![Halaman kendaraan keluar dengan rincian biaya](docs/gambar/petugas-keluar.png) |

**Tiket dan struk.** Keduanya dicetak di kertas selebar 58 mm, dan tiket membawa kode QR.

<p>
  <img src="docs/gambar/tiket.png" alt="Tiket parkir dengan kode QR" width="260">
  <img src="docs/gambar/struk.png" alt="Struk parkir" width="260">
</p>

**Halaman pengelola dan admin.** Bu Ratna membaca rekap pendapatan, sedangkan Bu Sinta mengatur tarif dan area.

| Rekap pendapatan | Kelola tarif |
| --- | --- |
| ![Rekap pendapatan per rentang tanggal](docs/gambar/owner-rekap.png) | ![Halaman tarif untuk admin](docs/gambar/admin-tarif.png) |

**Di HP.** Tampilannya menyesuaikan layar kecil, karena petugas memakainya dari pos parkir.

<p>
  <img src="docs/gambar/hp-parkir.png" alt="Halaman parkir di HP" width="300">
  <img src="docs/gambar/hp-masuk.png" alt="Halaman masuk di HP" width="300">
</p>

## Isi

1. [Yang bisa dilakukan aplikasi ini](#yang-bisa-dilakukan-aplikasi-ini)
2. [Memasang alat](#memasang-alat)
3. [Menjalankan SiParkir di komputermu](#menjalankan-siparkir-di-komputermu)
4. [Mencoba dari HP](#mencoba-dari-hp)
5. [Mengikuti video bab demi bab](#mengikuti-video-bab-demi-bab)
6. [Menjalankan test](#menjalankan-test)
7. [Memasang di server](#memasang-di-server)
8. [Tantangan](#tantangan)
9. [Daftar periksa kode buatan AI](#daftar-periksa-kode-buatan-ai)
10. [Kalau ada masalah](#kalau-ada-masalah)

## Yang bisa dilakukan aplikasi ini

Ada tiga peran, dan setiap peran punya halamannya sendiri.

Petugas:

- Mencatat kendaraan masuk dengan plat, jenis, dan area. Plat dirapikan otomatis, jadi `b 1234 cd` tersimpan sebagai `B1234CD`.
- Mencetak tiket bernomor (misalnya `P-000001`) dengan kode QR.
- Mencari tiket atau plat, melihat biaya, lalu mencatat kendaraan keluar dan mencetak struk.

Admin:

- Mengelola area parkir beserta kapasitasnya, tarif motor dan mobil, data kendaraan, dan akun pengguna.
- Membaca log aktivitas, yaitu siapa melakukan apa dan kapan.

Owner (pengelola):

- Membuka rekap pendapatan untuk rentang tanggal apa pun, lengkap dengan jumlah kendaraan per hari.

Aturan tarifnya begini. Jam pertama punya harga sendiri, setiap jam berikutnya lebih murah, dan ada batas biaya per 24 jam. Bawaannya, motor Rp2.000 lalu Rp1.000 per jam dengan batas Rp8.000, dan mobil Rp5.000 lalu Rp2.000 per jam dengan batas Rp20.000. Ada kelonggaran lima menit sebelum jam berikutnya dihitung.

Hal yang dijaga oleh kodenya:

- Satu kendaraan tidak bisa tercatat masuk dua kali. Aturan ini dijaga di tiga tempat, yaitu pemeriksaan di controller, transaction yang terkunci, dan aturan `unique` di database.
- Petugas tidak bisa membuka halaman admin atau rekap, sekalipun ia tahu alamatnya (middleware `peran`).
- Kolom `role` tidak bisa diisi lewat form, jadi tidak ada yang bisa mengangkat dirinya menjadi admin.
- Angka uang di struk selalu dibaca dari database, tidak pernah dari alamat halaman.
- Rumus tarif dijaga oleh test, termasuk kasus tepat 60 menit, kelonggaran lima menit, dan kendaraan yang menginap.
- Semua jam memakai zona waktu `Asia/Jakarta`.
- Percobaan login dibatasi lima kali per menit.

## Memasang alat

Kamu membutuhkan PHP 8.3 atau lebih baru, Composer, MySQL 8, Git, dan sebuah editor kode. Di video kita memakai VS Code.

### Windows dan Mac

1. **Laravel Herd** memasang PHP, Composer, dan Node.js sekaligus. Unduh dari <https://herd.laravel.com>, jalankan penginstalnya, lalu buka Herd satu kali.
2. **MySQL**. Di Windows, unduh MySQL Installer dari <https://dev.mysql.com/downloads/installer/>, pilih *Server only*, lalu buat kata sandi untuk `root` dan catat. Di Mac, unduh berkas DMG dari <https://dev.mysql.com/downloads/mysql/>.
3. **Git** dari <https://git-scm.com>, dengan pilihan bawaan.
4. **VS Code** dari <https://code.visualstudio.com>.

Setelah Herd terpasang, penginstal Laravel sudah tersedia. Kalau perintah `laravel` belum dikenali, pasang dengan `composer global require laravel/installer`.

### Linux (Ubuntu atau Debian)

```bash
sudo apt update
sudo apt install php php-cli php-mysql php-xml php-mbstring php-curl php-zip php-sqlite3 unzip
sudo apt install composer mysql-server git
composer global require laravel/installer
```

Kalau versi PHP dari `apt` lebih lama dari 8.3, pasang PHP lewat <https://php.new> dengan mengikuti petunjuk di halaman itu.

### Memeriksa hasilnya

Buka terminal baru (di VS Code: menu *Terminal*, *New Terminal*; di Windows pilih *Git Bash*), lalu ketik:

```bash
php --version
composer --version
mysql --version
git --version
```

Keempatnya harus menjawab dengan nomor versi.

### Kalau `mysql` tidak dikenali di Windows

Artinya Windows belum tahu letak program `mysql`. Cara mengatasinya:

1. Buka menu Start, ketik **environment variables**, lalu pilih *Edit the system environment variables*.
2. Klik *Environment Variables*, pilih baris **Path** di bagian atas, lalu klik *Edit*.
3. Klik *New*, lalu isi `C:\Program Files\MySQL\MySQL Server 8.4\bin`. Sesuaikan angkanya dengan folder yang ada di komputermu.
4. Klik *OK* sampai semua jendela tertutup, tutup VS Code, lalu buka lagi.

## Menjalankan SiParkir di komputermu

Bagian ini untuk kamu yang ingin langsung menjalankan versi jadinya. Kalau kamu mengikuti video dari awal, kamu membuat proyeknya sendiri di bab satu dengan `laravel new siparkir --database=mysql --pest --no-boost`.

**1. Ambil kodenya.**

```bash
git clone https://github.com/listyantidewi1/SiParkir.git siparkir
cd siparkir
composer install
```

**2. Buat database dan penggunanya.** Masuk ke MySQL sebagai root dengan `mysql -u root -p`, lalu ketik:

```sql
CREATE DATABASE siparkir;
CREATE USER 'siparkir'@'localhost' IDENTIFIED BY 'gantiSandiIni!';
GRANT ALL PRIVILEGES ON siparkir.* TO 'siparkir'@'localhost';
EXIT;
```

Ganti `gantiSandiIni!` dengan kata sandimu sendiri. Aplikasi sengaja tidak memakai akun `root`, supaya kalau kata sandinya bocor, yang terbuka hanya satu database ini.

**3. Siapkan berkas `.env`.**

```bash
cp .env.example .env
php artisan key:generate
```

Di Command Prompt Windows, pakai `copy .env.example .env`. Lalu buka `.env` dan isi kata sandi database:

```ini
DB_CONNECTION=mysql
DB_DATABASE=siparkir
DB_USERNAME=siparkir
DB_PASSWORD="gantiSandiIni!"
```

Berkas `.env` berisi kata sandi, jadi berkas itu tidak pernah ikut ke GitHub.

**4. Buat tabel dan isi data awal.**

```bash
php artisan migrate --seed
php artisan db:seed --class=ContohSeeder
```

Perintah pertama membuat tabel, dua tarif, dua area, dan empat akun. Perintah kedua menambah transaksi contoh dari 1 Oktober sampai 19 November 2026 supaya rekap punya isi.

**5. Jalankan.**

```bash
php artisan serve
```

Buka <http://localhost:8000> di browser.

### Akun contoh

| Nama | Email | Peran | Halaman pertama |
| --- | --- | --- | --- |
| Bu Sinta | `sinta@nusabakti.test` | admin | `/admin/area` |
| Pak Joko | `joko@nusabakti.test` | petugas | `/parkir` |
| Mas Agus | `agus@nusabakti.test` | petugas | `/parkir` |
| Bu Ratna | `ratna@nusabakti.test` | owner | `/rekap` |

Kata sandi keempatnya adalah `rahasia123`. Kata sandi ini diketahui semua orang, jadi **ganti sebelum aplikasi dipakai sungguhan**.

### Mencetak tiket dan struk

Tombol *Cetak* membuka jendela cetak milik browser. Pilih printer thermal 58 mm, atau pilih *Save as PDF* kalau kamu belum punya printernya. Ukuran kertas (lebar 58 mm, panjang 120 mm) diatur oleh baris `@page` di `public/css/cetak.css`. Kalau strukmu lebih panjang, tambah angka panjangnya di sana.

## Mencoba dari HP

Laptop dan HP harus tersambung ke Wi-Fi yang sama.

1. Jalankan server supaya bisa dijangkau perangkat lain:

   ```bash
   php artisan serve --host=0.0.0.0
   ```

2. Cari alamat IP laptopmu. Di Windows, ketik `ipconfig` dan lihat baris *IPv4 Address*. Di Mac atau Linux, ketik `ip addr` atau `ifconfig`.
3. Di browser HP, ketik alamat itu diikuti `:8000`, misalnya `192.168.1.23:8000`.

Kalau halamannya tidak terbuka, biasanya firewall laptop yang menghalangi. Izinkan PHP saat Windows bertanya, atau izinkan port 8000.

## Mengikuti video bab demi bab

Setiap akhir bab diberi tag, jadi kamu bisa melihat kode persis seperti di akhir bab itu:

```bash
git checkout bab-07
```

| Tag | Isi |
| --- | --- |
| `bab-01` | Proyek Laravel baru yang tersambung ke MySQL, zona waktu `Asia/Jakarta` |
| `bab-04` | Enam tabel, model beserta relasinya, dan data awal |
| `bab-05` | Login, logout, dan middleware untuk tiga peran |
| `bab-06` | Halaman admin (area, tarif, kendaraan, pengguna) dan log aktivitas |
| `bab-07` | Rumus tarif di class `Biaya` beserta test-nya |
| `bab-08` | Kendaraan masuk dan keluar |
| `bab-09` | Tiket dan struk 58 mm dengan kode QR |
| `bab-10` | Rekap pendapatan untuk owner |
| `bab-11` | Feature test untuk peran dan transaksi |
| `bab-12` | Dockerfile dan Docker Compose untuk server |

Bab dua dan tiga berisi kebutuhan dan rancangan database, jadi tidak ada kode baru. Untuk kembali ke versi terakhir, ketik `git checkout main`.

Beberapa berkas di video tidak diketik, melainkan disalin dari repositori ini:

| Berkas | Dipakai di |
| --- | --- |
| `public/css/gaya.css` | Bab 5 |
| folder `lang/id` | Bab 6, supaya pesan validasi berbahasa Indonesia |
| view dan controller admin selain area | Bab 6, polanya sama dengan area |
| view di `resources/views/parkir` | Bab 8 |
| `public/css/cetak.css` | Bab 9 |
| `database/seeders/ContohSeeder.php` dan `BanyakSeeder.php` | Bab 10 |
| `resources/views/rekap/index.blade.php` | Bab 10 |
| `.env.example` | Bab 12 |

`BanyakSeeder` menambah 200.000 transaksi lama untuk menguji kecepatan query di bab sepuluh. Jalankan hanya kalau kamu ingin mengulang percobaan `EXPLAIN` di bab itu:

```bash
php artisan db:seed --class=BanyakSeeder
```

## Menjalankan test

```bash
php artisan test
```

Ada 27 test. `tests/Unit/BiayaTest.php` memeriksa rumus tarif, `tests/Feature/PeranTest.php` memeriksa siapa boleh membuka halaman apa, dan `tests/Feature/ParkirTest.php` memeriksa kendaraan masuk dan keluar. Feature test berjalan di database SQLite sementara di dalam memori, jadi data di MySQL tidak tersentuh.

## Memasang di server

Kamu membutuhkan dua hal:

- **Server Linux yang menyala terus.** Bisa VPS sewaan atau komputer server di sekolah. Untuk VPS, paket terkecil dengan RAM 1 GB dan Ubuntu 24.04 sudah cukup. Saat menyewa, kamu mendapat alamat IP dan cara masuk lewat `ssh`.
- **Nama domain yang diarahkan ke server itu.** Di halaman pengaturan DNS milik penyedia domainmu, buat satu *A record*: isi nama dengan `parkir` (atau nama lain), dan isi nilainya dengan alamat IP server. Tunggu beberapa menit, lalu periksa dengan `ping parkir.sekolahmu.sch.id`. Kalau yang menjawab adalah alamat IP servermu, domainnya sudah siap.

Contoh di bawah memakai domain `parkir.sekolahmu.sch.id`.

**1. Masuk ke server dan pasang Docker.**

```bash
ssh root@parkir.sekolahmu.sch.id
curl -fsSL https://get.docker.com | sh
```

**2. Ambil kodenya.**

```bash
git clone https://github.com/listyantidewi1/SiParkir.git siparkir
cd siparkir
```

**3. Siapkan `.env`.**

```bash
cp .env.example .env
nano .env
```

Ubah empat hal:

```ini
APP_ENV=production
APP_DEBUG=false
APP_DOMAIN=parkir.sekolahmu.sch.id
DB_PASSWORD="kataSandiBaruYangPanjang"
```

`APP_DEBUG` harus `false`. Kalau `true`, setiap error menampilkan potongan kode, letak berkas, dan query kepada siapa pun yang membuka halamannya. Sesuaikan juga `APP_URL` menjadi `https://parkir.sekolahmu.sch.id`.

**4. Buat kunci aplikasi.**

```bash
docker compose run --rm app php artisan key:generate --show
```

Salin hasilnya (diawali `base64:`), lalu tempel ke baris `APP_KEY=` di `.env`.

**5. Nyalakan.**

```bash
docker compose up -d --build
docker compose exec app php artisan migrate --seed --force
```

Perintah pertama membuat image lalu menyalakan dua container, yaitu aplikasi (FrankenPHP) dan MySQL. Perintah kedua membuat tabel dan data awal. Buka `https://parkir.sekolahmu.sch.id`. Sertifikat HTTPS diurus sendiri oleh FrankenPHP begitu `APP_DOMAIN` terisi dan domainnya sudah mengarah ke server.

**6. Ganti kata sandi keempat akun contoh.** Masuk sebagai Bu Sinta, buka menu *Pengguna*, lalu ubah satu per satu. Kata sandi `rahasia123` tertulis terbuka di repositori ini.

**7. Cadangan.** Salin seluruh isi database ke satu berkas:

```bash
docker compose exec db sh -c 'mysqldump -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' > cadangan-$(date +%F).sql
```

Jalankan setiap malam (misalnya lewat `cron`), dan simpan salinannya di luar server.

**Memperbarui aplikasi** setelah ada perubahan kode:

```bash
git pull
docker compose up -d --build
docker compose exec app php artisan migrate --force
```

## Tantangan

Setiap bab di video ditutup dengan satu tantangan. Kerjakan tanpa AI dulu, lalu bandingkan.

1. Bab 2: tanyakan aturan tarif parkir di sekolah atau pasar dekat rumahmu, lalu tulis tiga contoh hitungannya.
2. Bab 3: gambar rancangan tabelnya di kertas, lalu tambahkan satu tabel untuk kartu langganan.
3. Bab 4: tambahkan kolom catatan pada tabel `parkings` lewat migration baru, tanpa menghapus datanya.
4. Bab 5: tambahkan peran keempat bernama satpam, yang hanya boleh melihat daftar kendaraan yang sedang parkir.
5. Bab 6: buat halaman supaya pengguna bisa mengganti kata sandinya sendiri.
6. Bab 8: tambahkan tombol untuk membatalkan transaksi yang salah ketik, lalu catat pembatalannya di log.
7. Bab 9: tambahkan nomor telepon koperasi di bagian bawah struk, dan ambil isinya dari berkas `.env`.
8. Bab 11: tulis test yang memastikan tarif tidak bisa diisi angka negatif.
9. Bab 12: bangun ulang aplikasi ini untuk kebutuhan di sekitarmu, misalnya penitipan helm, sewa lapangan, atau peminjaman alat.

## Daftar periksa kode buatan AI

Di video, setiap bab punya segmen *Cek kerjaan AI*. Semua contohnya berjalan tanpa error, dan justru itu yang membuatnya berbahaya. Pakai daftar ini setiap kali kamu menerima kode dari AI.

| Yang diperiksa | Pertanyaan untuk dirimu | Bab |
| --- | --- | --- |
| Zona waktu | Apakah jam yang tersimpan dan tercetak sama dengan jam di dinding? | 1 |
| Aturan bisnis | Dari mana angka dan aturan di kode ini berasal? Apakah dari pemakainya, atau dikarang? | 2 |
| Rancangan tabel | Apakah uang disimpan sebagai bilangan bulat, bukan `FLOAT`? Apakah data yang sama hanya ditulis di satu tempat? | 3 |
| Penjaga di database | Apakah ada foreign key, aturan `unique`, dan index untuk kolom yang sering disaring? | 4 |
| Hak akses | Apakah halamannya dijaga di server (middleware), bukan hanya tombolnya yang disembunyikan? | 5 |
| Mass assignment | Apakah kode hanya mengambil isian yang sudah divalidasi, bukan `$request->all()`? | 6 |
| Batas hitungan | Apa hasilnya tepat di batas, misalnya 60 menit, 65 menit, dan 24 jam? Apakah ada test-nya? | 7 |
| Race condition | Apa yang terjadi kalau dua permintaan datang hampir bersamaan? | 8 |
| Data dari browser | Apakah ada angka uang atau hak yang dibawa lewat alamat atau form lalu dipercaya begitu saja? | 9 |
| Rentang tanggal | Apakah hari terakhir ikut terhitung sampai pukul 23.59? Hindari `BETWEEN` untuk kolom tanggal dan jam. | 10 |
| Test | Apakah test juga memeriksa hal yang seharusnya ditolak, bukan hanya yang seharusnya berhasil? | 11 |
| Pengaturan server | Apakah `APP_DEBUG=false` dan kata sandinya bukan kata sandi latihan? | 12 |

## Kalau ada masalah

**`SQLSTATE[HY000] [1045] Access denied for user 'siparkir'@'localhost'`**
Nama pengguna atau kata sandi di `.env` tidak cocok dengan yang kamu buat di MySQL. Periksa `DB_USERNAME` dan `DB_PASSWORD`. Kalau kata sandinya memuat tanda `#` atau spasi, apit dengan tanda kutip.

**`SQLSTATE[HY000] [2002] Connection refused`**
MySQL belum berjalan. Di Windows, buka *Services* lalu jalankan layanan MySQL. Di Linux, ketik `sudo systemctl start mysql`.

**Tanda silang di baris "Database migrated" saat `laravel new`**
Itu wajar. Database dan penggunanya memang baru dibuat setelah proyeknya jadi.

**Jam di tiket bergeser tujuh jam**
Zona waktunya masih `UTC`. Buka `config/app.php`, ubah `'timezone'` menjadi `'Asia/Jakarta'` (atau `Asia/Makassar` untuk WITA, `Asia/Jayapura` untuk WIT).

**Pesan validasi masih berbahasa Inggris**
Pastikan `APP_LOCALE=id` di `.env` dan folder `lang/id` ada.

**Halaman tampil tanpa gaya (polos)**
Berkas `public/css/gaya.css` belum ada. Salin dari repositori ini.

**`No application encryption key has been specified`**
Jalankan `php artisan key:generate`.

**Setelah mengubah `.env`, tidak ada yang berubah**
Hentikan `php artisan serve` dengan Ctrl+C, lalu jalankan lagi. Di server, jalankan `docker compose up -d` supaya container membaca `.env` yang baru.

**Tidak bisa dibuka dari HP**
Pastikan server dijalankan dengan `--host=0.0.0.0`, laptop dan HP berada di Wi-Fi yang sama, dan firewall mengizinkan port 8000.

## Lisensi

Kode di repositori ini boleh dipakai untuk belajar dan mengajar. Kalau kamu memakainya di sekolahmu, ganti semua kata sandi contoh lebih dulu.
