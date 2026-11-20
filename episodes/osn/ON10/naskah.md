# Naskah ON10 Mondar-Mandir

## 0. Kait

Mulai dari satu angka nol. Setiap langkah, salin seluruh tulisannya, balik setiap angkanya, lalu tempelkan di belakang. Nol menjadi nol satu. Lalu nol satu menjadi nol satu satu nol. Lalu menjadi nol satu satu nol satu nol nol satu.

Kalau langkah ini diulang dua ribu dua puluh enam kali, tulisannya jauh lebih panjang daripada banyak atom di alam semesta. Tetapi, kita tetap bisa menebak karakter nomor dua ribu dua puluh lima, tanpa menuliskannya sama sekali.

Setelah menonton video ini, kamu bisa membaca fungsi rekursif yang membangun string, lalu menebak isinya memakai bilangan biner.

## 1. Pengantar

Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam jenjang SMA, yaitu soal nomor tiga puluh dua, tiga puluh tiga, dan tiga puluh empat, yang berjudul Mondar-Mandir. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.

Ketiga soal ini memakai kode program yang sama. Kita pahami kodenya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.

## 2. Soal · Mondar-Mandir

Perhatikan dua fungsi dalam bahasa C++ ini. Fungsi pertama bernama MONDAR. Fungsi ini menerima sebuah string berisi angka nol dan satu, lalu membalik setiap karakternya. Nol menjadi satu, dan satu menjadi nol.

Fungsi kedua bernama MANDIR. Kalau n sama dengan nol, hasilnya adalah string nol. Kalau tidak, MANDIR memanggil dirinya sendiri untuk n kurang satu, lalu menyambung hasilnya dengan MONDAR dari string yang sama.

Jadi, MANDIR satu adalah nol satu. MANDIR dua adalah nol satu satu nol. MANDIR tiga adalah nol satu satu nol satu nol nol satu. Setiap langkah, panjangnya menjadi dua kali lipat.

Soal pertama menanyakan banyak angka satu. Soal kedua menanyakan tiga karakter di posisi tertentu. Soal ketiga menanyakan banyak pasangan nol nol yang berdampingan.

## 3. Soal 32 · Banyak angka 1

Soal nomor tiga puluh dua. Ada berapa karakter satu di dalam hasil MANDIR dua belas?

Coba hitung sendiri dulu. Pause videonya kalau perlu.

Pertama, kita hitung panjangnya. MANDIR nol panjangnya satu, dan setiap langkah panjangnya dikali dua. Jadi, MANDIR dua belas panjangnya dua pangkat dua belas, yaitu empat ribu sembilan puluh enam.

Bagian belakang adalah kebalikan dari bagian depan. Setiap nol di depan menjadi satu di belakang, dan setiap satu di depan menjadi nol di belakang. Jadi, banyak angka satu selalu tepat setengah dari panjangnya.

Setengah dari empat ribu sembilan puluh enam adalah dua ribu empat puluh delapan. Jawaban soal tiga puluh dua adalah dua ribu empat puluh delapan.

## 4. Soal 33 · Posisi 2025

Soal nomor tiga puluh tiga. String S adalah hasil MANDIR dua ribu dua puluh enam. Tiga karakter apa yang ada di posisi dua ribu dua puluh lima sampai dua ribu dua puluh tujuh? Posisi dihitung mulai dari satu.

Coba hitung sendiri dulu. Pause videonya kalau perlu.

MANDIR dua ribu dua puluh enam memang sangat panjang, tetapi bagian depannya selalu sama dengan MANDIR sebelumnya. MANDIR sebelas sudah punya dua ribu empat puluh delapan karakter, jadi posisi yang kita cari ada di dalamnya.

Sekarang kita lacak posisi dua ribu dua puluh lima. Posisi ini ada di setengah bagian belakang, jadi karakternya adalah kebalikan dari posisi dua ribu dua puluh lima dikurangi seribu dua puluh empat, yaitu seribu satu. Kita ulangi terus sampai tiba di posisi satu.

Setiap kali kita pindah ke bagian depan, satu angka satu hilang dari bentuk biner posisi dikurangi satu, dan karakternya terbalik sekali. Jadi, triknya sederhana. Tulis posisi dikurangi satu dalam biner, lalu hitung angka satunya. Kalau ganjil, karakternya satu. Kalau genap, karakternya nol.

Dua ribu dua puluh empat punya tujuh angka satu, jadi karakternya satu. Dua ribu dua puluh lima dan dua ribu dua puluh enam punya delapan angka satu, jadi keduanya nol. Jawaban soal tiga puluh tiga adalah satu nol nol.

## 5. Soal 34 · Pasangan 00

Soal nomor tiga puluh empat. Ada berapa substring nol nol di dalam hasil MANDIR dua belas? Pasangan boleh bertumpuk, seperti contoh di layar yang punya tiga substring nol nol.

Coba hitung sendiri dulu. Pause videonya kalau perlu.

Lihat apa yang terjadi saat string disambung dengan kebalikannya. Pasangan nol nol di bagian depan tetap ada. Di bagian belakang, setiap pasangan satu satu dari depan berubah menjadi nol nol.

Bagaimana dengan sambungannya? Bagian belakang selalu dimulai dengan angka satu, karena MANDIR selalu dimulai dengan nol. Jadi, sambungan tidak pernah membentuk nol nol.

Artinya, banyak nol nol di MANDIR berikutnya sama dengan banyak pasangan kembar di MANDIR sekarang, yaitu nol nol ditambah satu satu. Banyak pasangan kembar ini selalu dua kali lipat, ditambah satu kalau sambungannya membentuk satu satu.

Kita isi tabelnya dari kecil. Pasangan kembar di MANDIR dua ada satu, lalu dua, lima, sepuluh, dua puluh satu, dan seterusnya, sampai MANDIR sebelas dengan enam ratus delapan puluh dua. Jadi, jawaban soal tiga puluh empat adalah enam ratus delapan puluh dua.

## 6. Konsep · Thue-Morse

String ini terkenal dengan nama barisan Thue-Morse. Polanya teratur, tetapi tidak pernah berulang persis, sehingga sering muncul di soal olimpiade.

Kunci ketiga soal ini adalah sifat rekursinya. Bagian depan sama dengan langkah sebelumnya, dan bagian belakang adalah kebalikannya. Dengan sifat ini, kita tidak perlu menuliskan string yang sangat panjang.

Trik biner tadi berlaku untuk semua posisi. Untuk posisi k, tulis k kurang satu dalam biner. Kalau banyak angka satunya ganjil, karakternya satu. Kalau genap, karakternya nol.

## 7. Penutup

Mari kita ulang ketiga jawabannya. Jawaban soal tiga puluh dua adalah dua ribu empat puluh delapan. Jawaban soal tiga puluh tiga adalah satu nol nol. Jawaban soal tiga puluh empat adalah enam ratus delapan puluh dua.

Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam, nomor tiga puluh dua sampai tiga puluh empat, yang berjudul Mondar-Mandir. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.

Coba pikirkan, ada berapa substring satu satu di dalam MANDIR dua belas? Tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!
