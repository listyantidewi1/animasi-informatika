# Naskah ON03 Mesin BCS (Stack)

## 0. Kait

Ada lima deretan angka di layar. Empat di antaranya bisa dicetak oleh sebuah mesin sederhana, tetapi satu deretan tidak mungkin dicetak. Bisakah kamu menemukan yang mustahil?

Mesin itu hanya punya tiga tombol dan sebuah tabung berisi koin. Di video ini, kita akan menjalankan mesin itu, membalik cara kerjanya, lalu menemukan deretan yang mustahil.

Setelah menonton video ini, kamu bisa mengenali salah satu struktur data terpenting dalam informatika, yaitu stack, hanya dari perilakunya.

## 1. Pengantar

Halo, selamat datang di Bedah Soal OSN-K Informatika. OSN-K adalah Olimpiade Sains Nasional tingkat kabupaten dan kota, yaitu babak pertama sebelum tingkat provinsi dan tingkat nasional.

Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima jenjang SMA, yaitu soal nomor sebelas, dua belas, dan tiga belas, yang berjudul Mesin BCS. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.

Ketiga soal ini memakai satu mesin yang sama. Kita pahami mesinnya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.

## 2. Mesin BCS

Pak Dengklek punya sebuah mesin ajaib. Salah satu bagiannya berbentuk tabung, dan tabung itu hanya bisa dibuka dari atas. Pak Dengklek juga punya beberapa koin yang bernomor satu, dua, tiga, dan seterusnya.

Mesin ini punya tiga tombol. Tombol B artinya buka. Saat tombol B ditekan, Pak Dengklek memasukkan koin bernomor terkecil yang belum pernah ia masukkan ke dalam tabung.

Tombol C artinya cetak. Saat tombol C ditekan, mesin mencetak nomor koin yang berada paling atas di tabung. Lalu, koin itu dikeluarkan dan tidak dipakai lagi.

Tombol S artinya stop. Tombol ini ditekan paling akhir, saat tabung sudah kosong. Lalu, mesin mengeluarkan kertas berisi semua nomor yang dicetak, berderet tanpa spasi.

Contohnya, Pak Dengklek punya empat koin dan menekan tombol B, B, C, B, B, C, C, C, lalu S. Mari kita jalankan bersama.

Tombol B pertama memasukkan koin satu, dan tombol B kedua memasukkan koin dua di atasnya. Lalu, tombol C mencetak koin paling atas, yaitu dua.

Berikutnya, dua tombol B memasukkan koin tiga dan koin empat. Sekarang, isi tabung dari bawah ke atas adalah satu, tiga, dan empat.

Tiga tombol C mencetak empat, lalu tiga, lalu satu. Tabung sudah kosong, dan tombol S mengeluarkan kertas bertuliskan dua, empat, tiga, satu.

Perhatikan satu hal penting. Koin yang masuk paling akhir selalu keluar paling dulu, karena hanya koin paling atas yang bisa dicetak.

## 3. Soal 11 · Jalankan mesinnya

Soal nomor sebelas. Pak Dengklek punya enam koin, dan ia menekan tombol B, B, C, B, C, B, B, C, C, C, B, C, lalu S. Apa isi kertas hasil cetakannya?

Coba jalankan mesinnya di kertas. Pause videonya kalau perlu.

Kita jalankan pelan-pelan. B, B memasukkan koin satu dan dua. Tombol C mencetak dua. Lalu, B memasukkan koin tiga, dan C langsung mencetaknya.

Berikutnya, B, B memasukkan koin empat dan lima. Tiga tombol C mencetak lima, empat, lalu satu, karena koin satu sudah menunggu di dasar tabung sejak awal.

Terakhir, B memasukkan koin enam, C mencetaknya, dan S mengeluarkan kertas.

Jadi, isi kertasnya adalah dua, tiga, lima, empat, satu, enam. Jebakannya ada pada koin satu. Koin ini masuk paling awal, tetapi baru keluar setelah semua koin di atasnya dicetak.

## 4. Soal 12 · Balik arah

Soal nomor dua belas membalik pertanyaannya. Pak Dengklek punya sembilan koin, dan kertasnya berisi lima, empat, tiga, enam, dua, delapan, sembilan, tujuh, satu. Tombol apa saja yang ia tekan, dan dalam urutan apa?

Coba susun urutan tombolnya dulu. Pause videonya kalau perlu.

Kita pakai satu aturan sederhana. Untuk setiap nomor di kertas, tekan B sampai koin itu masuk ke tabung. Setelah koin itu berada paling atas, tekan C.

Nomor pertama adalah lima. Kita tekan B lima kali untuk memasukkan koin satu sampai lima, lalu C mencetak lima. Koin empat dan tiga sudah di atas, jadi C, C mencetak empat dan tiga.

Nomor berikutnya enam. Koin enam belum masuk, jadi kita tekan B, lalu C. Setelah itu, nomor dua sudah berada paling atas, jadi cukup tekan C.

Untuk delapan, kita tekan B dua kali untuk memasukkan tujuh dan delapan, lalu C. Untuk sembilan, tekan B lalu C. Sisanya tujuh dan satu, yang keluar dengan C, C, lalu S.

Jadi, urutan tombolnya adalah lima B, tiga C, B, dua C, dua B, C, B, tiga C, lalu S. Totalnya sembilan belas tombol, yaitu dua kali sembilan ditambah satu, sesuai aturan soal.

## 5. Soal 13 · Yang mustahil

Soal nomor tiga belas. Pak Dengklek punya enam koin, dan ada lima kertas hasil cetakan di layar, yaitu pilihan A sampai E. Satu di antaranya tidak mungkin dihasilkan oleh mesin BCS. Kertas manakah itu?

Coba periksa kelima kertas itu. Pause videonya kalau perlu.

Kita pakai aturan yang sama seperti soal dua belas. Kalau aturan itu bisa berjalan sampai akhir, kertasnya mungkin. Kalau nomor yang kita cari tertutup koin lain, kertasnya mustahil.

Pilihan A, B, C, dan E bisa dijalankan sampai selesai. Misalnya, pilihan E yang berisi satu sampai enam cukup memakai B lalu C sebanyak enam kali.

Sekarang, pilihan D berisi lima, tiga, empat, enam, dua, satu. Untuk mencetak lima, kita masukkan koin satu sampai lima, lalu C. Isi tabung sekarang satu, dua, tiga, empat, dengan empat paling atas.

Nomor berikutnya di kertas adalah tiga. Tetapi, koin tiga tertutup oleh koin empat, dan mesin hanya bisa mencetak koin paling atas. Jadi, kertas D tidak mungkin dihasilkan.

Jawaban soal tiga belas adalah D. Pola umumnya begini. Setelah sebuah nomor besar dicetak, nomor-nomor kecil yang masih di tabung harus keluar dari yang terbesar ke yang terkecil.

## 6. Konsep · Stack

Mesin BCS sebenarnya adalah sebuah stack, atau tumpukan. Stack hanya punya dua operasi utama, yaitu push untuk menaruh data di atas, dan pop untuk mengambil data paling atas.

Aturan ini disebut LIFO, singkatan dari last in, first out, yang artinya masuk terakhir, keluar pertama. Tombol B adalah push, dan tombol C adalah pop.

Kamu memakai stack setiap hari. Tombol undo di aplikasi membatalkan langkah terakhir dulu, dan tombol kembali di browser membuka halaman yang terakhir kamu kunjungi.

## 7. Penutup

Mari kita ulang ketiga jawabannya. Soal sebelas, dua tiga lima empat satu enam. Soal dua belas, sembilan belas tombol yang diakhiri S. Soal tiga belas, D.

Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh lima, nomor sebelas sampai tiga belas, yang berjudul Mesin BCS. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.

Coba buat sendiri satu kertas yang mustahil untuk lima koin, lalu tulis di kolom komentar. Sampai jumpa di soal berikutnya!
