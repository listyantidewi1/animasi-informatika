# Naskah ON05 Papan Lampu

## 0. Kait

Ada dua puluh lima lampu dan sepuluh tombol. Setiap tombol membalik satu baris atau satu kolom lampu. Kamu harus menekan tepat enam tombol untuk mengubah papan kiri menjadi papan kanan.

Pertanyaannya, ada berapa banyak urutan penekanan yang berhasil? Jawabannya ribuan, dan kita bisa menghitungnya tanpa mencoba satu per satu.

Setelah menonton video ini, kamu bisa memakai ide bit paritas dan aturan membilang untuk menghitung kemungkinan dengan cepat.

## 1. Pengantar

Halo, selamat datang di Bedah Soal OSN-K Informatika. OSN-K adalah Olimpiade Sains Nasional tingkat kabupaten dan kota, yaitu babak pertama sebelum tingkat provinsi dan tingkat nasional.

Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam jenjang SMA, yaitu soal nomor sembilan, yang berjudul Papan Lampu. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.

Kita pahami aturan papannya dulu. Setelah itu, kamu punya waktu untuk mencoba, lalu kita bahas bersama langkah demi langkah.

## 2. Soal 9 · Papan Lampu

Pak Dengklek punya papan lampu dengan lima baris, yaitu baris satu sampai lima, dan lima kolom, yaitu kolom A sampai E. Pada awalnya, semua lampu mati.

Ada sepuluh tombol, yaitu tombol satu sampai lima, dan tombol A sampai E. Tombol angka membalik semua lampu di baris itu. Lampu yang mati menjadi menyala, dan lampu yang menyala menjadi mati.

Tombol huruf bekerja dengan cara yang sama, tetapi untuk kolom. Misalnya, tombol C membalik semua lampu di kolom C.

Pak Dengklek ingin mengubah papan yang semua lampunya mati menjadi papan di sebelah kanan. Lingkaran putih berarti lampu menyala, dan lingkaran hitam berarti lampu mati.

Ia ingin menekan tepat enam tombol. Ada berapa banyak kemungkinan urutan penekanannya? Contohnya, A, C, E, satu, tiga, empat adalah satu urutan. Urutan B, dua, D, lima, E, E juga berhasil.

Coba hitung sendiri dulu. Pause videonya kalau perlu.

## 3. Tombol mana yang ganjil?

Pengamatan pertama. Urutan penekanan tidak mengubah hasil akhir. Tekan A lalu satu, atau satu lalu A, papannya tetap sama, karena setiap lampu hanya peduli berapa kali ia dibalik.

Pengamatan kedua. Menekan tombol yang sama dua kali sama saja dengan tidak menekannya, karena lampu dibalik lalu dibalik kembali. Jadi, yang penting hanyalah apakah sebuah tombol ditekan ganjil kali atau genap kali.

Sekarang, kita cari tombol mana yang harus ditekan ganjil kali. Lihat baris satu. Lampu yang menyala ada di kolom B dan D. Kalau baris satu tidak ditekan, berarti kolom B dan D harus ditekan ganjil kali.

Baris dua kebalikannya, yaitu A, C, dan E yang menyala. Jadi, baris dua harus ditekan. Baris tiga dan empat sama dengan baris satu, sedangkan baris lima sama dengan baris dua. Hasilnya, tombol B, D, dua, dan lima ditekan ganjil kali.

Ada satu kejutan. Menekan kesepuluh tombol sekaligus membalik setiap lampu dua kali, sehingga papannya tidak berubah. Karena itu, kebalikannya juga berhasil, yaitu A, C, E, satu, tiga, dan empat ditekan ganjil kali.

## 4. Membilang urutan

Sekarang kita membilang. Kasus pertama memakai enam tombol A, C, E, satu, tiga, dan empat. Keenam tombol itu harus ditekan tepat sekali, jadi kita hanya menyusun urutannya.

Banyak cara menyusun enam benda berbeda adalah enam faktorial, yaitu enam kali lima kali empat kali tiga kali dua kali satu. Hasilnya tujuh ratus dua puluh.

Kasus kedua memakai empat tombol B, D, dua, dan lima. Keempatnya ditekan sekali, jadi masih ada dua tekanan lagi. Dua tekanan itu bisa dipakai dengan dua cara.

Cara pertama, salah satu dari empat tombol itu ditekan tiga kali. Ada empat pilihan tombol. Urutan enam tekanan dengan satu tombol muncul tiga kali ada enam faktorial dibagi tiga faktorial, yaitu seratus dua puluh. Totalnya empat kali seratus dua puluh, yaitu empat ratus delapan puluh.

Cara kedua, salah satu dari enam tombol lainnya ditekan dua kali, seperti E, E pada contoh soal. Ada enam pilihan tombol, dan setiap pilihan punya enam faktorial dibagi dua faktorial, yaitu tiga ratus enam puluh urutan. Totalnya dua ribu seratus enam puluh.

Jadi, banyak urutannya adalah tujuh ratus dua puluh, ditambah empat ratus delapan puluh, ditambah dua ribu seratus enam puluh, yaitu tiga ribu tiga ratus enam puluh.

## 5. Konsep · Paritas dan membilang

Lampu yang dibalik bekerja seperti operasi XOR pada bit. Nilai akhirnya hanya bergantung pada genap atau ganjilnya jumlah pembalikan, bukan pada urutannya. Ide ini disebut paritas.

Setelah tahu tombol mana yang ganjil, sisanya adalah soal membilang. Untuk menyusun benda yang ada kembarnya, bagi faktorial jumlah semua benda dengan faktorial jumlah benda yang kembar.

## 6. Penutup

Mari kita ulang jawabannya. Banyak urutan enam tekanan yang mengubah papan kiri menjadi papan kanan adalah tiga ribu tiga ratus enam puluh.

Soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam, nomor sembilan, yang berjudul Papan Lampu. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.

Coba hitung sendiri, ada berapa urutan kalau Pak Dengklek menekan tepat empat tombol, lalu tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!
