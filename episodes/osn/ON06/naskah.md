# Naskah ON06 Perjalanan ke Timur

## 0. Kait

Sekelompok bebek ingin berjalan dari titik A ke titik H, dan mereka hanya boleh bergerak ke kanan mengikuti arah panah. Ada banyak sekali lajur, bahkan ada tiga lajur rahasia yang dikunci gembok. Ada berapa rute yang bisa mereka tempuh?

Menghitung rute satu per satu pasti membuat pusing. Di video ini, kita memakai satu trik sederhana. Kita tulis satu angka di setiap titik, dan jawabannya muncul sendiri di titik H.

Setelah menonton video ini, kamu bisa menghitung banyak rute di sebuah peta dengan pemrograman dinamis, tanpa mendaftar rutenya satu per satu.

## 1. Pengantar

Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima jenjang SMA, yaitu soal nomor empat belas, lima belas, dan enam belas, yang berjudul Perjalanan ke Timur. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.

Ketiga soal ini memakai peta yang sama. Kita pahami petanya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.

## 2. Soal · Peta Timur

Bebek-bebek Pak Dengklek mulai dari titik A dan ingin mencapai titik H. Mereka hanya boleh bergerak ke kanan, mengikuti arah panah pada setiap lajur.

Dua titik bisa dihubungkan oleh lebih dari satu lajur. Misalnya, dari A ke B ada dua lajur yang berbeda. Dua rute dianggap berbeda kalau ada lajur yang dilewati oleh satu rute, tetapi tidak dilewati oleh rute lainnya.

Ada juga tiga lajur rahasia yang dikunci gembok, yaitu lajur dari E ke D, dari D ke F, dan salah satu lajur dari D ke G. Untuk melewati lajur bergembok, bebek butuh sebuah kunci sakti, dan satu kunci hanya bisa dipakai satu kali.

Ada tiga pertanyaan. Soal empat belas, berapa banyak rute kalau bebek tidak punya kunci sakti? Soal lima belas, kalau mereka punya tiga kunci. Soal enam belas, kalau mereka hanya punya satu kunci.

## 3. Soal 14 · Tanpa kunci

Soal nomor empat belas. Tanpa kunci sakti, semua lajur bergembok tertutup. Berapa banyak rute dari A ke H?

Coba hitung sendiri dulu. Pause videonya kalau perlu.

Kita tulis di setiap titik, ada berapa rute dari A menuju titik itu. Di titik A, kita tulis satu, karena bebek sudah berada di sana. Ke titik B ada dua lajur dari A, jadi kita tulis dua.

Ke titik C ada satu lajur dari B, jadi rutenya dua kali satu, yaitu dua. Ke titik D ada tiga lajur dari B, jadi dua kali tiga, yaitu enam. Ke titik E ada satu lajur dari B, jadi dua.

Ke titik F ada tiga lajur dari E, jadi dua kali tiga, yaitu enam.

Titik G bisa dicapai dari tiga arah. Dari C ada dua rute kali satu lajur. Dari D ada enam rute kali dua lajur, yaitu dua belas. Dari F ada enam rute kali satu lajur. Jumlahnya dua ditambah dua belas ditambah enam, yaitu dua puluh.

Terakhir, dari G ke H ada tiga lajur. Jadi, banyak rute ke H adalah dua puluh kali tiga, yaitu enam puluh. Jawaban soal empat belas adalah enam puluh.

## 4. Soal 15 · Tiga kunci

Soal nomor lima belas. Sekarang bebek punya tiga kunci sakti, jadi ketiga lajur bergembok bisa dibuka. Satu rute paling banyak melewati dua gembok, jadi kuncinya selalu cukup. Berapa banyak rutenya?

Coba hitung sendiri dulu. Pause videonya kalau perlu.

Angka di A, B, C, dan E tidak berubah. Titik D sekarang juga bisa dicapai dari E lewat lajur bergembok. Jadi, D bernilai enam ditambah dua, yaitu delapan.

Titik F bisa dicapai dari titik E dengan enam rute, dan dari titik D lewat lajur bergembok, dengan delapan rute. Jadi, F bernilai empat belas.

Titik G sekarang punya tiga lajur dari D. Jadi, dari C ada dua, dari D ada delapan kali tiga, yaitu dua puluh empat, dan dari F ada empat belas. Jumlahnya empat puluh.

Banyak rute ke H adalah empat puluh kali tiga, yaitu seratus dua puluh. Jawaban soal lima belas adalah seratus dua puluh.

## 5. Soal 16 · Satu kunci

Soal nomor enam belas. Bebek hanya punya satu kunci sakti, jadi setiap rute boleh melewati paling banyak satu gembok. Berapa banyak rutenya?

Coba hitung sendiri dulu. Pause videonya kalau perlu.

Dari seratus dua puluh rute di soal lima belas, kita buang rute yang melewati dua gembok. Rute seperti itu pasti lewat lajur E ke D, lalu lanjut lewat gembok kedua.

Ada dua jenis rute. Jenis pertama berjalan dari B ke E, lalu ke D, lalu ke G lewat lajur bergembok. Dari A ke B ada dua cara, dan dari G ke H ada tiga cara, jadi ada dua kali tiga, yaitu enam rute.

Jenis kedua berjalan dari E ke D, lalu ke F, lalu ke G. Jenis ini juga punya enam rute. Totalnya ada dua belas rute yang melewati dua gembok.

Jadi, jawaban soal enam belas adalah seratus dua puluh dikurangi dua belas, yaitu seratus delapan.

## 6. Konsep · Pemrograman dinamis

Cara menulis angka di setiap titik ini disebut pemrograman dinamis, atau dynamic programming. Kita memecah masalah besar menjadi masalah kecil, lalu menyimpan jawabannya supaya tidak dihitung ulang.

Aturannya sederhana. Banyak rute ke sebuah titik sama dengan jumlah rute ke titik asal setiap lajur yang masuk. Urutan hitungnya dari kiri ke kanan, supaya titik asal sudah dihitung lebih dulu.

Kalau ada syarat tambahan, seperti kunci sakti, kita cukup menyimpan lebih banyak angka di setiap titik. Misalnya, banyak rute yang belum memakai kunci, dan banyak rute yang sudah memakai satu kunci.

## 7. Penutup

Mari kita ulang ketiga jawabannya. Jawaban soal empat belas adalah enam puluh. Jawaban soal lima belas adalah seratus dua puluh. Jawaban soal enam belas adalah seratus delapan.

Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima, nomor empat belas sampai enam belas, yang berjudul Perjalanan ke Timur. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.

Coba hitung sendiri, ada berapa rute tanpa kunci yang pasti melewati titik D, lalu tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!
