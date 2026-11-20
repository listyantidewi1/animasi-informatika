# Naskah ON02 Empat Soal OSN-K Tanpa Coding

## 0. Kait

Ada empat soal OSN-K di video ini. Keempatnya bisa dijawab hanya dengan kertas dan pensil, tanpa menulis satu baris kode pun.

Ada mesin yang mengolah deretan angka, ada tembolok komputer, ada pesan berantai, dan ada permainan mencari koin. Hitung berapa soal yang bisa kamu jawab sebelum pembahasannya dimulai.

Setelah menonton video ini, kamu bisa menjalankan aturan langkah demi langkah dengan teliti, dan kamu akan mengenal empat ide penting dalam informatika.

## 1. Pengantar

Halo, selamat datang di Bedah Soal OSN-K Informatika. OSN-K adalah Olimpiade Sains Nasional tingkat kabupaten dan kota, yaitu babak pertama sebelum tingkat provinsi dan tingkat nasional.

Tiga soal pertama berasal dari OSN-K Informatika tahun dua ribu dua puluh enam, yaitu soal nomor satu, dua, dan tiga. Soal keempat berasal dari OSN-K tahun dua ribu dua puluh lima, soal nomor enam. Semuanya untuk jenjang SMA, dan disusun oleh Tim Olimpiade Komputer Indonesia.

Caranya begini. Untuk setiap soal, kita pahami soalnya dulu. Lalu, kamu punya waktu untuk mencoba. Setelah itu, kita bahas bersama-sama.

## 2. Soal 1 · KWAK dan KWIK

Soal pertama berjudul “Operasi KWAK dan KWIK”. Pak Dengklek punya mesin yang mengolah deretan bilangan dari kiri ke kanan. Mesin ini punya dua operasi.

Operasi pertama bernama KWAK. Mesin mengambil dua bilangan paling kiri, lalu menghitung selisihnya. Selisih ini selalu positif, jadi yang besar dikurangi yang kecil. Hasilnya dimasukkan kembali ke ujung kiri.

Operasi kedua bernama KWIK. Mesin mengambil bilangan paling kanan, lalu menambahkan bilangan itu ke setiap bilangan yang tersisa.

Deretan awalnya adalah dua, lima, tiga, empat, satu, dua. Lalu, mesin menjalankan KWAK, KWIK, KWAK, KWIK, dan KWIK. Pada akhirnya, hanya tersisa satu bilangan. Bilangan berapakah itu?

Coba hitung dulu. Pause videonya kalau kamu butuh waktu lebih lama.

Kita jalankan satu per satu. KWAK yang pertama mengambil dua dan lima. Selisihnya tiga, jadi deretannya menjadi tiga, tiga, empat, satu, dua.

KWIK yang pertama mengambil dua dari ujung kanan, lalu menambahkan dua ke setiap bilangan. Deretannya menjadi lima, lima, enam, tiga.

KWAK yang kedua mengambil lima dan lima. Selisihnya nol, jadi deretannya menjadi nol, enam, tiga.

KWIK yang kedua mengambil tiga, lalu menambahkannya ke nol dan enam. Deretannya menjadi tiga, sembilan. KWIK yang terakhir mengambil sembilan, lalu menambahkannya ke tiga. Hasilnya dua belas.

Jadi, jawaban soal pertama adalah dua belas. Jebakannya ada di operasi KWIK. Bilangan yang diambil tidak ikut tersisa, jadi banyaknya bilangan di deretan selalu berkurang satu.

Cara mengerjakan soal ini disebut menelusuri langkah demi langkah. Tulis keadaan deretan setelah setiap operasi, dan jangan melompati langkah di dalam kepala. Programmer melakukan hal yang sama saat memeriksa programnya.

## 3. Soal 2 · Tembolok Komputer

Soal kedua berjudul “Tembolok Komputer”. Tembolok adalah nama lain dari cache, yaitu tempat penyimpanan kecil yang cepat. Komputer menyimpan data yang baru saja dipakai di sana, supaya data itu bisa diambil lagi dengan cepat.

Tembolok Pak Dengklek hanya muat tiga data, dan pada awalnya kosong. Kalau data yang diakses belum ada di tembolok dan tembolok masih punya tempat, data itu langsung dimasukkan.

Kalau tembolok sudah penuh, tembolok mengeluarkan data yang paling lama tidak diakses. Setiap kali sebuah data diakses, tembolok mencatat waktunya, termasuk kalau data itu sudah ada di dalam.

Pak Dengklek mengakses data A, B, C, A, D, B, E, lalu A. Setelah itu, ia akan mengakses data F. Data apakah yang dikeluarkan untuk memberi tempat bagi F?

Coba kerjakan dulu. Tuliskan isi tembolok setelah setiap akses.

Kita beri nomor waktu pada setiap akses. A diakses di waktu satu, B di waktu dua, dan C di waktu tiga. Sekarang, tembolok sudah penuh.

Di waktu empat, A diakses lagi. A sudah ada di dalam, jadi tidak ada yang keluar. Tetapi, catatan waktu A berubah menjadi empat.

Di waktu lima, D datang. Yang paling lama tidak diakses adalah B, dengan catatan waktu dua. Jadi, B keluar dan D masuk.

Di waktu enam, B datang lagi. Sekarang yang paling lama adalah C, jadi C keluar. Di waktu tujuh, E datang, dan A keluar karena catatan waktunya empat.

Di waktu delapan, A datang lagi, dan D keluar. Isi tembolok sekarang adalah B dengan waktu enam, E dengan waktu tujuh, dan A dengan waktu delapan.

Ketika F datang, yang paling lama tidak diakses adalah B. Jadi, jawaban soal kedua adalah B. Kalau kamu menjawab D, kamu mungkin mengeluarkan data yang paling lama masuk, bukan data yang paling lama tidak diakses.

Aturan cache ini disebut LRU, singkatan dari least recently used, yang artinya paling lama tidak dipakai. Browser dan prosesor komputer memakai ide yang sama, karena data yang baru saja dipakai biasanya akan segera dipakai lagi.

## 4. Soal 3 · Pesan Rahasia

Soal ketiga berjudul “Aplikasi Pesan Rahasia”. Ada delapan bebek, yaitu A sampai H. Setiap tanda panah berarti bebek di pangkal panah menyimpan bebek di ujung panah sebagai kontak.

Kalau seekor bebek menerima pesan untuk pertama kalinya pada suatu menit, satu menit kemudian pesan itu diteruskan ke semua kontaknya sekaligus. Kalau pesan yang sama datang lagi, pesan itu diabaikan.

Di menit nol, bebek A menerima pesan. Bebek manakah yang paling terakhir menerima pesan? Kalau ada lebih dari satu, pilih yang hurufnya paling awal dalam urutan abjad.

Coba telusuri dulu panah-panahnya. Pause videonya kalau perlu.

Di menit satu, A meneruskan pesan ke kontaknya, yaitu B dan C.

Di menit dua, B meneruskan ke F, sedangkan C meneruskan ke D dan E. Jadi, D, E, dan F menerima pesan di menit dua.

Di menit tiga, D juga mengirim ke F. Tetapi, F sudah menerima pesan, jadi pesan itu diabaikan. Sementara itu, E meneruskan ke G, dan F meneruskan ke H. Jadi, G dan H menerima pesan di menit tiga.

Di menit empat, G juga mengirim ke H, tetapi H sudah menerima pesan. Tidak ada bebek baru yang menerima pesan, jadi penyebarannya selesai.

Bebek yang paling terakhir menerima pesan adalah G dan H, yaitu di menit tiga. Karena G lebih awal dalam abjad, jawaban soal ketiga adalah G. Jebakannya, H terlihat paling jauh di gambar, padahal H sudah menerima pesan lewat jalur atas.

Cara menyebarkan pesan lapis demi lapis seperti ini disebut pencarian melebar, atau BFS. Menit penerimaan setiap bebek sama dengan jarak terpendeknya dari A. Ide ini dipakai untuk mencari rute terpendek, misalnya di aplikasi peta.

## 5. Soal 4 · Pencarian Koin

Soal keempat berasal dari OSN-K tahun dua ribu dua puluh lima, soal nomor enam, berjudul “Pencarian Koin”. Ada dua ratus lima puluh lima bebek yang berbaris dari barat ke timur, bernomor satu sampai dua ratus lima puluh lima. Salah satu bebek memegang koin.

Pak Dengklek boleh bertanya kepada satu bebek. Kalau bebek itu memegang koin, permainan selesai. Kalau tidak, bebek itu memberi tahu apakah koinnya ada di sebelah barat atau di sebelah timur.

Pak Dengklek selalu bertanya kepada bebek yang berada tepat di tengah barisan yang masih mungkin. Jawaban yang ia dapat berturut-turut adalah barat, barat, timur, barat, timur, lalu koin ditemukan pada pertanyaan keenam. Bebek nomor berapakah yang memegang koin?

Coba hitung dulu. Pause videonya kalau perlu.

Pada awalnya, bebek yang mungkin adalah nomor satu sampai dua ratus lima puluh lima. Bebek di tengah adalah nomor seratus dua puluh delapan. Jawabannya barat, jadi yang tersisa adalah nomor satu sampai seratus dua puluh tujuh.

Tengahnya sekarang adalah nomor enam puluh empat. Jawabannya barat lagi, jadi tersisa nomor satu sampai enam puluh tiga. Lalu, tengahnya nomor tiga puluh dua, dan jawabannya timur. Tersisa nomor tiga puluh tiga sampai enam puluh tiga.

Tengahnya nomor empat puluh delapan, dan jawabannya barat. Tersisa nomor tiga puluh tiga sampai empat puluh tujuh. Tengahnya nomor empat puluh, dan jawabannya timur. Tersisa nomor empat puluh satu sampai empat puluh tujuh.

Pertanyaan keenam ditujukan kepada bebek di tengah, yaitu nomor empat puluh empat, dan ternyata ia memegang koinnya. Jadi, jawaban soal keempat adalah empat puluh empat.

Strategi ini disebut pencarian biner. Setiap pertanyaan membuang separuh barisan. Karena itu, dua ratus lima puluh lima bebek bisa diperiksa dengan paling banyak delapan pertanyaan. Kalau bertanya satu per satu, kita mungkin butuh dua ratus lima puluh lima pertanyaan.

## 6. Penutup

Mari kita lihat lagi keempat jawabannya. Soal pertama dua belas, soal kedua B, soal ketiga G, dan soal keempat empat puluh empat. Berapa yang berhasil kamu jawab?

Keempat soal ini melatih hal yang sama, yaitu menjalankan aturan dengan teliti, satu langkah demi satu langkah, sambil mencatat keadaan setiap langkah. Kemampuan ini sangat penting saat kamu menulis dan memeriksa program.

Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam nomor satu, dua, dan tiga, serta tahun dua ribu dua puluh lima nomor enam. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusun soal-soal ini.

Kalau kamu ingin berlatih soal lain, kamu bisa mencobanya di situs latihan TOKI. Tulis skormu di kolom komentar, ya. Sampai jumpa di soal berikutnya!
