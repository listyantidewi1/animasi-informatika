# Daftar periksa kode buatan AI (SiParkir)

Daftar ini merangkum segmen "Cek kerjaan AI" di video SiParkir. Semua contoh di video berjalan tanpa error, dan justru itu yang membuatnya berbahaya. Pakailah daftar ini setiap kali AI menyodorkan kode untuk aplikasi web, apa pun framework-nya.

## Persiapan dan kebutuhan

- [ ] Bab 1. Apakah jam yang tersimpan dan tercetak sama dengan jam di dinding? Periksa zona waktu aplikasi (`APP_TIMEZONE`). Di versi buatan AI, jam di tiket bergeser tujuh jam.
- [ ] Bab 2. Dari mana angka dan aturan di kode ini berasal? Tanyakan tarif, kelonggaran, dan aturan menginap kepada pemakainya, jangan biarkan AI mengarangnya.

## Rancangan data

- [ ] Bab 3. Apakah uang disimpan sebagai bilangan bulat, bukan `FLOAT`? Apakah data yang sama hanya ditulis di satu tempat?
- [ ] Bab 4. Apakah ada foreign key, aturan `unique`, dan index untuk kolom yang sering disaring?

## Login dan hak akses

- [ ] Bab 5. Apakah halamannya dijaga di server (middleware), bukan hanya tombolnya yang disembunyikan?
- [ ] Bab 6. Apakah kode hanya mengambil isian yang sudah divalidasi, bukan `$request->all()`? Kalau tidak, orang bisa menyisipkan kolom `role` lewat form.

## Hitungan dan transaksi

- [ ] Bab 7. Apa hasilnya tepat di batas, misalnya 60 menit, 65 menit, dan 24 jam lebih sedikit? Apakah ada test untuk setiap batas itu?
- [ ] Bab 8. Apa yang terjadi kalau dua permintaan datang hampir bersamaan? Pemeriksaan "sudah ada atau belum" di PHP saja tidak cukup; pasang aturan `unique` di database dan pakai transaction.
- [ ] Bab 9. Apakah ada angka uang atau hak yang dibawa lewat alamat atau form lalu dipercaya begitu saja? Biaya harus dihitung ulang di server.

## Laporan

- [ ] Bab 10. Apakah hari terakhir ikut terhitung sampai pukul 23.59? Hindari `BETWEEN` untuk kolom tanggal dan jam; pakai `>= awal` dan `< awal hari berikutnya`. Di versi buatan AI, rekap Oktober kehilangan 30 kendaraan dan Rp177.000.
- [ ] Bab 10. Apakah query masih bisa memakai index? Periksa dengan `EXPLAIN`.

## Test dan server

- [ ] Bab 11. Apakah test juga memeriksa hal yang seharusnya ditolak, bukan hanya yang seharusnya berhasil? Coba hapus penjaganya: kalau test tetap hijau, test itu tidak menjaga apa-apa.
- [ ] Bab 12. Apakah `APP_DEBUG=false` dan kata sandinya bukan kata sandi latihan? Halaman error yang terbuka bisa membocorkan kata sandi database.

Kode lengkap dan README: https://github.com/listyantidewi1/SiParkir
