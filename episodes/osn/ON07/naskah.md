# Naskah ON07 Jadwal Pembinaan

## 0. Kait

Pak Dengklek punya sepuluh hari untuk melatih tim olimpiadenya. Setiap hari ia memilih satu agenda, dan setiap agenda memberi poin yang berbeda. Agenda apa yang harus dipilih setiap hari, supaya total poinnya paling besar?

Cara yang paling menggoda adalah memilih poin terbesar setiap hari. Ternyata, cara ini bisa menjebak. Satu pilihan di hari keempat, yang kelihatannya sama saja, bisa membuat totalmu berkurang tiga poin.

Setelah menonton video ini, kamu bisa menyusun jadwal dengan poin terbesar memakai tabel pemrograman dinamis, dan tahu kapan cara rakus bisa menjebak.

## 1. Pengantar

Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam jenjang SMA, yaitu soal nomor empat belas, lima belas, dan enam belas, yang berjudul Jadwal Pembinaan Tim Olimpiade. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.

Ketiga soal ini memakai aturan yang sama. Kita pahami aturannya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.

## 2. Soal · Jadwal Pembinaan

Pak Dengklek sedang melatih bebek-bebeknya untuk Tim Olimpiade Informatika. Pembinaannya berlangsung selama N hari, dan setiap hari ada tepat satu agenda. Pilihannya ada empat, yaitu latihan Teori, latihan Observasi, latihan Kompetisi, atau Istirahat.

Setiap latihan memberi poin manfaat, dan poinnya bisa berbeda setiap hari. Poin itu ditulis dalam sebuah tabel. Istirahat tidak memberi poin.

Supaya latihannya seimbang, ada aturan jeda. Setelah latihan Teori, selama A hari berikutnya tim tidak boleh latihan Teori lagi. Hal yang sama berlaku untuk Observasi dengan jeda B hari, dan untuk Kompetisi dengan jeda C hari.

Misalnya, C sama dengan dua. Kalau tim latihan Kompetisi di hari pertama, maka hari kedua dan hari ketiga tidak boleh Kompetisi. Kompetisi baru boleh lagi di hari keempat. Istirahat boleh dipakai untuk mengisi hari yang kosong.

Ada tiga soal, dan semuanya berlangsung selama sepuluh hari. Untuk setiap soal, kita mencari total poin manfaat yang paling besar.

## 3. Soal 14 · Jeda satu hari

Soal nomor empat belas. Setiap hari, Teori bernilai dua poin, Observasi tiga poin, dan Kompetisi lima poin. Semua jedanya satu hari. Berapa total poin maksimumnya?

Coba hitung sendiri dulu. Pause videonya kalau perlu.

Kompetisi bernilai paling besar. Tetapi dengan jeda satu hari, Kompetisi tidak boleh dipilih dua hari berturut-turut.

Lihat dua hari yang berurutan. Paling banyak satu hari di antaranya berisi Kompetisi, dan hari yang lain paling baik berisi Observasi. Jadi, setiap pasang hari paling banyak bernilai lima ditambah tiga, yaitu delapan poin.

Sepuluh hari terbagi menjadi lima pasang, jadi totalnya paling banyak lima kali delapan, yaitu empat puluh. Jadwal Kompetisi, Observasi, Kompetisi, Observasi, dan seterusnya mencapai empat puluh. Jawaban soal empat belas adalah empat puluh.

## 4. Soal 15 · Jeda berbeda

Soal nomor lima belas. Poinnya sama dengan soal empat belas, tetapi jedanya berbeda. Jeda Teori satu hari, jeda Observasi dua hari, dan jeda Kompetisi tiga hari. Berapa total poin maksimumnya?

Coba hitung sendiri dulu. Pause videonya kalau perlu.

Dengan jeda tiga hari, dua Kompetisi harus berjarak paling sedikit empat hari. Dalam sepuluh hari, Kompetisi paling banyak tiga kali, misalnya di hari pertama, kelima, dan kesembilan.

Dengan jeda dua hari, Observasi paling banyak empat kali. Caranya hanya satu, yaitu di hari pertama, keempat, ketujuh, dan kesepuluh.

Masalahnya, setiap jadwal dengan tiga Kompetisi selalu memakai hari pertama atau hari kesepuluh. Jadi, tiga Kompetisi dan empat Observasi tidak mungkin dipakai bersamaan.

Coba tiga Kompetisi dan tiga Observasi. Empat hari sisanya diisi Teori, yang tidak boleh berturut-turut. Contohnya jadwal ini, dengan total lima belas ditambah sembilan ditambah delapan, yaitu tiga puluh dua.

Pilihan lain tidak lebih baik. Dengan empat Observasi, Kompetisi paling banyak dua kali, jadi totalnya paling banyak tiga puluh. Dengan tiga Kompetisi dan dua Observasi, totalnya paling banyak tiga puluh satu. Jawaban soal lima belas adalah tiga puluh dua.

## 5. Soal 16 · Poin berubah

Soal nomor enam belas. Jeda semua latihan kembali satu hari, tetapi sekarang poinnya berubah setiap hari, seperti pada tabel ini. Berapa total poin maksimumnya?

Coba hitung sendiri dulu. Pause videonya kalau perlu.

Cara rakus memilih poin terbesar yang boleh pada setiap hari. Di hari keempat, semua poin bernilai satu. Kalau kita memilih Observasi di hari itu, cara rakus berakhir dengan lima puluh tiga poin. Kalau kita memilih Teori, hasilnya lima puluh enam. Jadi, cara rakus tidak bisa dipercaya.

Supaya pasti benar, kita pakai tabel. Untuk setiap hari, kita simpan tiga angka, yaitu total terbesar kalau hari itu diakhiri dengan Teori, dengan Observasi, atau dengan Kompetisi.

Aturannya, angka hari ini sama dengan poin hari ini, ditambah angka terbesar kemarin dari latihan yang berbeda. Di hari pertama, angkanya dua, tiga, dan lima.

Di hari kedua, Teori bernilai dua ditambah lima, yaitu tujuh. Observasi bernilai tiga ditambah lima, yaitu delapan. Kompetisi bernilai lima ditambah tiga, yaitu delapan.

Kita lanjutkan dengan cara yang sama sampai hari kesepuluh. Istirahat tidak pernah dibutuhkan di sini, karena selalu ada latihan lain yang boleh dipilih.

Di hari kesepuluh, angka terbesar ada di Kompetisi, yaitu lima puluh enam. Kalau kita telusuri mundur, jadwalnya terlihat seperti ini. Jawaban soal enam belas adalah lima puluh enam.

## 6. Konsep · Rakus vs pemrograman dinamis

Cara rakus hanya melihat hari ini. Kadang hasilnya benar, tetapi tidak ada jaminan, karena pilihan hari ini mengubah pilihan yang boleh diambil besok.

Pemrograman dinamis menyimpan beberapa kemungkinan terbaik sekaligus, satu untuk setiap latihan terakhir. Keputusan akhirnya baru diambil di hari terakhir.

Caranya mirip dengan menghitung rute di video Perjalanan ke Timur. Bedanya, di sana kita menjumlahkan banyak cara, sedangkan di sini kita mencari nilai yang terbesar.

## 7. Penutup

Mari kita ulang ketiga jawabannya. Jawaban soal empat belas adalah empat puluh. Jawaban soal lima belas adalah tiga puluh dua. Jawaban soal enam belas adalah lima puluh enam.

Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam, nomor empat belas sampai enam belas, yang berjudul Jadwal Pembinaan Tim Olimpiade. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.

Coba pikirkan soal empat belas lagi, tetapi jeda Kompetisi diubah menjadi dua hari. Berapa poin maksimumnya? Tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!
