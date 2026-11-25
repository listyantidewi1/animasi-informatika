# SiPinjam: perintah dan berkas per bab

Bahan untuk mengikuti video **SiPinjam: Aplikasi Peminjaman Alat dengan PHP dan MySQL dari Nol** sambil mengetik.

- Kode lengkap: https://github.com/listyantidewi1/SiPinjam
- Isi berkas di akhir setiap bab: buka tag `bab-NN`, misalnya https://github.com/listyantidewi1/SiPinjam/tree/bab-04
- Perintah terminal dan perintah SQL yang diketik di video ada di bawah, urut sesuai bab. Ketik satu per satu, tekan Enter, lalu bandingkan hasilnya dengan video.
- Belum selesai mengetik? Jeda dulu videonya. Tidak ada yang tertinggal: semua yang diketik di video ada di sini atau di tag bab.

## Bab 1

**Bab 1: Persiapan XAMPP, VS Code, Git, dan database**

Berkas yang diketik atau disalin di bab ini (isi akhir bab):

- [`.env`](https://github.com/listyantidewi1/SiPinjam/blob/bab-01/.env)
- [`.gitignore`](https://github.com/listyantidewi1/SiPinjam/blob/bab-01/.gitignore)
- [`.env.example`](https://github.com/listyantidewi1/SiPinjam/blob/bab-01/.env.example)
- [`public/index.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-01/public/index.php)

Perintah, urut seperti di video. Blok `bash` diketik di terminal (Git Bash), blok `sql` diketik setelah masuk ke `mysql`.

```bash
php --version
```
```bash
mysql --version
```
```bash
git --version
```
```bash
mkdir public app database
```
```bash
mysql -u root
```
```sql
CREATE DATABASE sipinjam;
```
```sql
CREATE USER 'sipinjam'@'localhost' IDENTIFIED BY 'gantiSandiIni!';
```
```sql
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE
ON sipinjam.* TO 'sipinjam'@'localhost';
```
```sql
exit
```
```bash
php -S localhost:8000 -t public
```
```bash
git init
```
```bash
git add .
```
```bash
git commit -m "proyek awal"
```

## Bab 4

**Bab 4: CREATE TABLE, foreign key, dan index**

Berkas yang diketik atau disalin di bab ini (isi akhir bab):

- [`database/01_tabel.sql`](https://github.com/listyantidewi1/SiPinjam/blob/bab-04/database/01_tabel.sql)

Perintah, urut seperti di video. Blok `bash` diketik di terminal (Git Bash), blok `sql` diketik setelah masuk ke `mysql`.

```bash
mysql -u root sipinjam < database/01_tabel.sql
```
```bash
mysql -u root sipinjam
```
```sql
SHOW TABLES;
```
```sql
INSERT INTO kategori (nama) VALUES ('Kamera dan Foto'), ('Audio');
```
```sql
INSERT INTO alat (kategori_id, kode, nama, jumlah_total, stok) VALUES
(1, 'KAM-01', 'Kamera DSLR', 2, 2),
(2, 'MIC-01', 'Mikrofon wireless', 3, 3);
```
```sql
UPDATE alat SET stok = stok - 5 WHERE id = 1;
```
```sql
INSERT INTO alat (kategori_id, kode, nama, jumlah_total, stok)
VALUES (99, 'XX-01', 'Alat coba', 1, 1);
```
```sql
SELECT nama, kategori_id FROM alat;
```
```sql
SELECT alat.nama, kategori.nama AS kategori
FROM alat
JOIN kategori ON kategori.id = alat.kategori_id;
```
```sql
exit
```
```bash
git add .
git commit -m "tujuh tabel"
```

## Bab 5

**Bab 5: Function, stored procedure, dan transaksi**

Berkas yang diketik atau disalin di bab ini (isi akhir bab):

- [`database/02_fungsi.sql`](https://github.com/listyantidewi1/SiPinjam/blob/bab-05/database/02_fungsi.sql)

Perintah, urut seperti di video. Blok `bash` diketik di terminal (Git Bash), blok `sql` diketik setelah masuk ke `mysql`.

```bash
mysql -u root sipinjam
```
```bash
mysql -u root sipinjam < database/02_fungsi.sql
```
```sql
SELECT hitung_denda('2026-11-10', '2026-11-10', 1);
```
```sql
SELECT hitung_denda('2026-11-10', '2026-11-13', 1);
```
```sql
SELECT hitung_denda('2026-11-10', '2026-11-08', 1);
```
```sql
exit
```
```bash
mysql -u root sipinjam < database/02_fungsi.sql
```
```sql
INSERT INTO pengguna (nama, username, sandi_hash, peran, kelas) VALUES
('Rafi', 'rafi', 'belum', 'peminjam', 'XI RPL 1'),
('Nadia', 'nadia', 'belum', 'peminjam', 'XI DKV 2'),
('Pak Yusuf', 'yusuf', 'belum', 'petugas', NULL);
```
```sql
SELECT id, nama, stok FROM alat;
```
```sql
CALL ajukan_pinjam(1, 1, 1, 3);
```
```sql
SELECT nama, stok FROM alat WHERE id = 1;
```
```sql
SELECT pengguna_id, alat_id, jumlah, jatuh_tempo, status FROM peminjaman;
```
```sql
CALL ajukan_pinjam(2, 1, 2, 3);
```
```sql
SELECT nama, stok FROM alat WHERE id = 1;
```
```sql
exit
```
```bash
mysql -u root sipinjam -e "SELECT nama, stok FROM alat WHERE id = 1"
```
```bash
(for i in $(seq 10); do mysql -u root sipinjam -e "CALL ajukan_pinjam(1, 1, 1, 3)" & done; wait)
```
```bash
mysql -u root sipinjam -e "SELECT nama, stok FROM alat WHERE id = 1"
```
```bash
git add .
git commit -m "function dan prosedur"
```

## Bab 6

**Bab 6: Trigger dan log aktivitas**

Berkas yang diketik atau disalin di bab ini (isi akhir bab):

- [`database/03_trigger.sql`](https://github.com/listyantidewi1/SiPinjam/blob/bab-06/database/03_trigger.sql)
- [`database/trigger_ai.sql`](https://github.com/listyantidewi1/SiPinjam/blob/bab-06/database/trigger_ai.sql)

Perintah, urut seperti di video. Blok `bash` diketik di terminal (Git Bash), blok `sql` diketik setelah masuk ke `mysql`.

```bash
mysql -u root sipinjam
```
```bash
mysql -u root sipinjam < database/03_trigger.sql
```
```sql
CALL ajukan_pinjam(1, 2, 1, 3);
```
```sql
SELECT aksi, keterangan, waktu FROM log_aktivitas;
```
```sql
UPDATE peminjaman SET status = 'ditolak' WHERE id = 2;
```
```sql
SELECT nama, stok FROM alat;
```
```sql
SELECT aksi, keterangan FROM log_aktivitas;
```
```sql
UPDATE peminjaman SET status = 'disetujui', petugas_id = 3 WHERE id = 1;
```
```sql
SELECT id, alat_id, jatuh_tempo, status FROM peminjaman WHERE id = 1;
```
Ganti TANGGAL dengan tanggal jatuh tempo ditambah 4 hari, formatnya TTTT-BB-HH (contoh 2026-11-27).
```sql
CALL kembalikan_pinjam(1, 3, 'TANGGAL');
```
```sql
SELECT * FROM pengembalian;
```
```sql
SELECT nama, stok FROM alat WHERE id = 1;
```
```sql
SELECT id, status FROM peminjaman WHERE id = 1;
```
```sql
exit
```
```bash
mysql -u root sipinjam < database/trigger_ai.sql
```
```bash
mysql -u root sipinjam -e "UPDATE peminjaman SET jumlah = 1 WHERE id = 1"
```
```bash
mysql -u root sipinjam -e "DROP TRIGGER tandai_terlambat"
```
```bash
rm database/trigger_ai.sql
```
```bash
git add .
git commit -m "trigger"
```

## Bab 7

**Bab 7: PHP dan PDO, prepared statement**

Berkas yang diketik atau disalin di bab ini (isi akhir bab):

- [`app/koneksi.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-07/app/koneksi.php)
- [`app/bantu.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-07/app/bantu.php)
- [`app/awal.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-07/app/awal.php)
- [`public/index.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-07/public/index.php)

Perintah, urut seperti di video. Blok `bash` diketik di terminal (Git Bash), blok `sql` diketik setelah masuk ke `mysql`.

```bash
php database/isi_contoh.php
```
```bash
php -S localhost:8000 -t public
```
```bash
git add .
git commit -m "kerangka PHP"
```

## Bab 8

**Bab 8: Login, session, dan tiga peran**

Berkas yang diketik atau disalin di bab ini (isi akhir bab):

- [`app/auth.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-08/app/auth.php)
- [`app/awal.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-08/app/awal.php)
- [`public/index.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-08/public/index.php)
- [`public/peminjam/index.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-08/public/peminjam/index.php)
- [`public/admin/alat.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-08/public/admin/alat.php)
- [`public/petugas/index.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-08/public/petugas/index.php)

Perintah, urut seperti di video. Blok `bash` diketik di terminal (Git Bash), blok `sql` diketik setelah masuk ke `mysql`.

```bash
php -r "echo password_hash('rahasia123', PASSWORD_DEFAULT), PHP_EOL;"
```
```bash
php -r "echo password_hash('rahasia123', PASSWORD_DEFAULT), PHP_EOL;"
```
```bash
mkdir public/peminjam
```
```bash
git mv public/index.php public/peminjam/index.php
```
```bash
git add .
git commit -m "login dan peran"
```

## Bab 9

**Bab 9: CRUD alat untuk admin**

Berkas yang diketik atau disalin di bab ini (isi akhir bab):

- [`public/admin/alat.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-09/public/admin/alat.php)
- [`public/admin/alat_form.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-09/public/admin/alat_form.php)
- [`public/admin/alat_hapus.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-09/public/admin/alat_hapus.php)

Perintah, urut seperti di video. Blok `bash` diketik di terminal (Git Bash), blok `sql` diketik setelah masuk ke `mysql`.

```bash
git add .
git commit -m "halaman admin"
```

## Bab 10

**Bab 10: Halaman peminjam di HP**

Berkas yang diketik atau disalin di bab ini (isi akhir bab):

- [`public/peminjam/index.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-10/public/peminjam/index.php)
- [`public/peminjam/ajukan.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-10/public/peminjam/ajukan.php)
- [`public/peminjam/pinjaman.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-10/public/peminjam/pinjaman.php)
- [`public/peminjam/batalkan.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-10/public/peminjam/batalkan.php)

Perintah, urut seperti di video. Blok `bash` diketik di terminal (Git Bash), blok `sql` diketik setelah masuk ke `mysql`.

```bash
git add .
git commit -m "halaman peminjam"
```

## Bab 11

**Bab 11: Halaman petugas, denda, dan laporan PDF**

Berkas yang diketik atau disalin di bab ini (isi akhir bab):

- [`public/petugas/index.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-11/public/petugas/index.php)
- [`public/petugas/proses.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-11/public/petugas/proses.php)
- [`public/petugas/dipinjam.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-11/public/petugas/dipinjam.php)
- [`public/petugas/terima.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-11/public/petugas/terima.php)
- [`public/petugas/laporan.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-11/public/petugas/laporan.php)

Perintah, urut seperti di video. Blok `bash` diketik di terminal (Git Bash), blok `sql` diketik setelah masuk ke `mysql`.

```bash
git add .
git commit -m "halaman petugas"
```

## Bab 12

**Bab 12: Menguji, sepuluh permintaan bersamaan**

Berkas yang diketik atau disalin di bab ini (isi akhir bab):

- [`tes/uji.php`](https://github.com/listyantidewi1/SiPinjam/blob/bab-12/tes/uji.php)
- [`database/02_fungsi.sql`](https://github.com/listyantidewi1/SiPinjam/blob/bab-12/database/02_fungsi.sql)

Perintah, urut seperti di video. Blok `bash` diketik di terminal (Git Bash), blok `sql` diketik setelah masuk ke `mysql`.

```bash
php tes/uji.php
```
```bash
mysql -u root sipinjam < database/02_fungsi.sql
```
```bash
php tes/uji.php
```
```bash
mysql -u root sipinjam < database/02_fungsi.sql
```
```bash
php tes/uji.php
```
```bash
git add .
git commit -m "skenario uji"
```

## Bab 13

**Bab 13: Online dengan Nginx dan HTTPS**

Berkas yang diketik atau disalin di bab ini (isi akhir bab):

- [`deploy/nginx.conf`](https://github.com/listyantidewi1/SiPinjam/blob/bab-13/deploy/nginx.conf)
- [`.gitignore`](https://github.com/listyantidewi1/SiPinjam/blob/bab-13/.gitignore)

Perintah, urut seperti di video. Blok `bash` diketik di terminal (Git Bash), blok `sql` diketik setelah masuk ke `mysql`.

```bash
php -S localhost:8002 > /dev/null 2>&1 &
```
```bash
curl localhost:8002/.env
```
```bash
kill %1
```
```bash
php -S localhost:8003 -t public > /dev/null 2>&1 &
```
```bash
curl -I localhost:8003/.env
```
```bash
kill %1
```
```bash
git add .
git commit -m "siap online"
```
