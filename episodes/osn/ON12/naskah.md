# Naskah ON12 Dua dari Tujuh Telur

## 0. Kait

Ada tujuh telur bebek, dan dua di antaranya adalah telur emas. Kamu punya mesin yang hanya menjawab satu hal, yaitu ada telur emas atau tidak. Berapa kali mesin harus dipakai, supaya kedua telur emas pasti ketemu?

Kita tidak sekadar menebak. Kita akan membuktikan bahwa satu angka pasti cukup, dan satu kali lebih sedikit pasti tidak cukup.

Setelah menonton video ini, kamu bisa menghitung batas paling sedikit sebuah pencarian yang jawabannya hanya ya atau tidak.

## 1. Pengantar

Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima jenjang SMA, yaitu soal nomor sepuluh, yang berjudul Dua dari Tujuh Telur Bebek. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.

Kita pahami cara kerja mesinnya dulu. Setelah itu, kamu punya waktu untuk mencoba, lalu kita bahas bersama.

## 2. Soal 10 · Dua dari Tujuh Telur

Pak Dengklek punya tujuh telur bebek berlabel satu sampai tujuh. Tepat dua telur adalah telur emas, tetapi semua telur terlihat sama.

Ia punya mesin pendeteksi. Ia boleh memasukkan satu telur atau lebih. Mesin hanya menjawab tidak ada telur emas, atau telur emas terdeteksi, tanpa memberi tahu telur yang mana.

Misalnya, telur dua dan tiga adalah telur emas. Kalau telur satu, dua, dan lima dimasukkan, mesin menjawab terdeteksi. Kalau telur satu dan empat dimasukkan, mesin menjawab tidak ada.

Pak Dengklek ingin strategi terbaik, supaya kedua telur emas pasti ketemu, apa pun pasangannya. Paling banyak berapa kali mesin harus dipakai? Nilai ini kita sebut K.

Coba pikirkan sendiri dulu. Pause videonya kalau perlu.

## 3. Kenapa 4 kali tidak cukup

Pertama, kita hitung ada berapa kemungkinan pasangan telur emas. Memilih dua dari tujuh telur ada dua puluh satu cara.

Setiap kali mesin dipakai, jawabannya hanya dua macam. Jadi, satu kali pemakaian membagi kemungkinan menjadi dua kelompok.

Dengan empat kali pemakaian, paling banyak ada dua kali dua kali dua kali dua, yaitu enam belas urutan jawaban yang berbeda. Padahal, ada dua puluh satu kemungkinan pasangan.

Artinya, pasti ada dua pasangan berbeda yang mendapat urutan jawaban yang sama, sehingga tidak bisa dibedakan. Jadi, empat kali tidak cukup, dan K paling sedikit lima.

## 4. Strategi 5 kali

Sekarang kita cari strategi dengan lima kali pemakaian. Kelompokkan telur menjadi tiga pasang, yaitu satu dan dua, tiga dan empat, serta lima dan enam. Telur tujuh disisihkan.

Masukkan setiap pasang ke mesin, satu per satu. Ini memakai tiga kali pemakaian. Karena ada dua telur emas, paling sedikit satu pasang pasti terdeteksi.

Kasus pertama, dua pasang terdeteksi. Berarti setiap pasang berisi tepat satu telur emas. Cek satu telur dari setiap pasang. Ini memakai dua kali lagi, jadi totalnya lima.

Kasus kedua, hanya satu pasang terdeteksi, misalnya satu dan dua. Kemungkinannya tinggal tiga, yaitu satu dan dua, satu dan tujuh, atau dua dan tujuh.

Cek telur tujuh. Kalau tidak ada, jawabannya satu dan dua. Kalau terdeteksi, cek telur satu untuk tahu pasangannya. Totalnya juga lima kali.

Dalam semua kasus, lima kali pemakaian sudah cukup, dan empat kali pasti tidak cukup. Jadi, jawaban soal nomor sepuluh adalah lima.

## 5. Konsep · Pengujian kelompok

Soal ini adalah contoh pengujian kelompok. Kita menguji banyak benda sekaligus, lalu memakai jawabannya untuk memperkecil kemungkinan.

Triknya adalah menghitung batas bawah. Kalau ada N kemungkinan dan setiap jawaban hanya ya atau tidak, kita butuh k pertanyaan dengan dua pangkat k paling sedikit N. Ide yang sama dipakai di pencarian biner.

## 6. Penutup

Mari kita ulang jawabannya. Kedua telur emas pasti ketemu dengan paling banyak lima kali pemakaian mesin. Jawaban soal nomor sepuluh adalah lima.

Soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima, nomor sepuluh, yang berjudul Dua dari Tujuh Telur Bebek. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.

Coba pikirkan, kalau ada delapan telur dan tetap dua telur emas, apakah lima kali masih cukup? Tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!
