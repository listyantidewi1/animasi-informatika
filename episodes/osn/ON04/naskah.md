# Naskah ON04 Lipat Kode

## 0. Kait

Empat puluh satu orang duduk melingkar. Mulai dari kursi nomor satu, setiap orang kedua harus keluar dari lingkaran, terus berputar sampai tersisa satu orang. Di kursi nomor berapa kamu harus duduk supaya menjadi yang terakhir?

Jawabannya ternyata bisa dihitung oleh potongan kode C++ yang hanya beberapa baris. Kode itu muncul di soal OSN-K, dan di video ini kita akan membongkarnya sampai tuntas.

Setelah menonton video ini, kamu bisa menelusuri fungsi rekursif tanpa komputer, dan menemukan pola tersembunyi lewat bilangan biner.

## 1. Pengantar

Halo, selamat datang di Bedah Soal OSN-K Informatika. OSN-K adalah Olimpiade Sains Nasional tingkat kabupaten dan kota, yaitu babak pertama sebelum tingkat provinsi dan tingkat nasional.

Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam jenjang SMA, yaitu soal nomor tiga puluh lima, tiga puluh enam, dan tiga puluh tujuh, yang berjudul Lipat Kode. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.

Ketiga soal ini memakai potongan kode yang sama. Kita pahami kodenya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.

## 2. Kode C++

Soal ini memberikan empat fungsi dalam bahasa C++, yaitu Lipat, Kode, Tunggal, dan Ganda. Kita baca satu per satu, mulai dari yang paling kecil.

Fungsi Lipat menerima sebuah bilangan n. Kalau n sama dengan satu, fungsi ini mengembalikan satu. Kalau tidak, ia memanggil dirinya sendiri dengan n dibagi dua, lalu hasilnya dikali dua.

Perhatikan bahwa n bertipe integer. Jadi, sisa pembagian dibuang. Misalnya, lima dibagi dua hasilnya dua, bukan dua koma lima.

Fungsi Kode memakai hasil Lipat. Rumusnya adalah dua kali, n dikurangi Lipat n, lalu ditambah satu.

Fungsi Tunggal menjumlahkan Kode dari satu sampai n. Fungsi Ganda sedikit berbeda. Untuk setiap i, ia menerapkan Kode berulang kali sebanyak k kali, lalu menjumlahkan hasil akhirnya.

## 3. Soal 35 · KODE(41)

Soal nomor tiga puluh lima. Berapakah nilai kembalian dari pemanggilan Kode empat puluh satu?

Coba telusuri kodenya di kertas. Pause videonya kalau perlu.

Kode empat puluh satu membutuhkan Lipat empat puluh satu. Lipat empat puluh satu memanggil Lipat dua puluh, lalu Lipat sepuluh, Lipat lima, Lipat dua, dan akhirnya Lipat satu.

Lipat satu adalah base case, jadi hasilnya langsung satu. Lalu, setiap tingkat di atasnya mengalikan dengan dua. Hasilnya dua, empat, delapan, enam belas, dan tiga puluh dua.

Jadi, Lipat n selalu menghasilkan pangkat dua terbesar yang tidak melebihi n. Untuk empat puluh satu, hasilnya tiga puluh dua, karena enam puluh empat sudah terlalu besar.

Sekarang, Kode empat puluh satu sama dengan dua kali, empat puluh satu dikurangi tiga puluh dua, ditambah satu. Empat puluh satu dikurangi tiga puluh dua adalah sembilan. Dua kali sembilan adalah delapan belas, dan ditambah satu menjadi sembilan belas.

Jadi, jawaban soal tiga puluh lima adalah sembilan belas. Ingat angka ini, karena nanti ia akan muncul lagi.

## 4. Soal 36 · TUNGGAL(63)

Soal nomor tiga puluh enam. Berapakah nilai kembalian dari pemanggilan Tunggal enam puluh tiga? Artinya, kita perlu menjumlahkan Kode satu, Kode dua, dan seterusnya, sampai Kode enam puluh tiga.

Coba cari polanya dulu. Pause videonya kalau perlu.

Menghitung enam puluh tiga nilai satu per satu tentu melelahkan. Jadi, kita tulis beberapa nilai pertama, lalu kita cari polanya.

Kode satu adalah satu. Kode dua dan tiga adalah satu dan tiga. Kode empat sampai tujuh adalah satu, tiga, lima, dan tujuh. Setiap kali n mencapai pangkat dua yang baru, nilainya kembali ke satu, lalu naik dua demi dua.

Sekarang, jumlahkan tiap kelompok. Kelompok pertama jumlahnya satu. Satu ditambah tiga sama dengan empat. Satu, tiga, lima, dan tujuh jumlahnya enam belas. Jumlah bilangan ganjil berurutan dari satu selalu berupa bilangan kuadrat.

Bilangan satu sampai enam puluh tiga terbagi menjadi enam kelompok. Jumlah tiap kelompok adalah satu, empat, enam belas, enam puluh empat, dua ratus lima puluh enam, dan seribu dua puluh empat.

Jadi, Tunggal enam puluh tiga sama dengan seribu tiga ratus enam puluh lima. Itulah jawaban soal tiga puluh enam.

## 5. Soal 37 · GANDA

Soal nomor tiga puluh tujuh. Berapakah nilai kembalian dari pemanggilan Ganda enam puluh tiga, enam puluh empat juta enam ratus lima puluh enam ribu enam ratus enam puluh tujuh? Artinya, setiap bilangan dari satu sampai enam puluh tiga dikenai Kode lebih dari enam puluh juta kali.

Jangan langsung menyerah melihat angka sebesar itu. Pause videonya, lalu coba terapkan Kode berkali-kali pada satu bilangan.

Mari kita coba pada empat puluh satu. Kode empat puluh satu adalah sembilan belas. Kode sembilan belas adalah tujuh. Kode tujuh adalah tujuh lagi. Setelah itu, nilainya tidak pernah berubah.

Rahasianya terlihat jelas dalam bilangan biner. Empat puluh satu ditulis satu, nol, satu, nol, nol, satu. Kode memindahkan angka satu paling depan ke paling belakang, sehingga menjadi satu, nol, nol, satu, satu, yaitu sembilan belas.

Angka nol yang berada di depan ikut hilang. Lama-lama, semua nol habis, dan yang tersisa hanya deretan angka satu. Empat puluh satu punya tiga angka satu, jadi ujungnya adalah satu, satu, satu, yaitu tujuh.

Karena itu, setiap bilangan akhirnya berhenti di deretan angka satu yang panjangnya sama dengan banyaknya angka satu di bilangan itu. Untuk bilangan sampai enam puluh tiga, enam putaran sudah cukup. Jadi, puluhan juta putaran tidak mengubah apa pun.

Sekarang, kita kelompokkan bilangan satu sampai enam puluh tiga berdasarkan banyaknya angka satu. Ada enam bilangan dengan satu angka satu, lima belas dengan dua, dua puluh dengan tiga, lima belas dengan empat, enam dengan lima, dan satu bilangan dengan enam.

Jumlahnya adalah enam kali satu, ditambah lima belas kali tiga, ditambah dua puluh kali tujuh, ditambah lima belas kali lima belas, ditambah enam kali tiga puluh satu, ditambah enam puluh tiga. Hasilnya enam ratus enam puluh lima.

Jadi, jawaban soal tiga puluh tujuh adalah enam ratus enam puluh lima. Pelajarannya, angka yang sangat besar di soal sering kali hanya jebakan, karena prosesnya sudah berhenti jauh sebelum itu.

## 6. Konsep · Josephus dan rekursi

Sekarang, kita kembali ke empat puluh satu orang di awal video. Kalau setiap orang kedua keluar, orang yang bertahan paling akhir duduk di kursi nomor sembilan belas. Itu sama persis dengan hasil Kode empat puluh satu.

Teka-teki ini dikenal sebagai masalah Josephus, yang berasal dari sebuah kisah kuno. Fungsi Kode adalah rumus singkat untuk menjawabnya, tanpa perlu menyimulasikan lingkaran satu per satu.

Fungsi Lipat juga mengajarkan satu ide penting, yaitu rekursi. Rekursi adalah fungsi yang memanggil dirinya sendiri dengan masalah yang lebih kecil, sampai bertemu base case yang jawabannya langsung diketahui.

Soal tiga puluh tujuh juga menunjukkan hal lain. Kalau sebuah proses terasa rumit, coba tulis bilangannya dalam bentuk biner, karena polanya sering langsung terlihat.

## 7. Penutup

Mari kita ulang ketiga jawabannya. Jawaban soal tiga puluh lima adalah sembilan belas. Jawaban soal tiga puluh enam adalah seribu tiga ratus enam puluh lima. Jawaban soal tiga puluh tujuh adalah enam ratus enam puluh lima.

Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam, nomor tiga puluh lima sampai tiga puluh tujuh, yang berjudul Lipat Kode. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.

Coba hitung sendiri, di kursi nomor berapa orang terakhir duduk kalau ada seratus orang, lalu tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!
