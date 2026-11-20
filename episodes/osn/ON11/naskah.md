# Naskah ON11 Peta Internet Sekolah

## 0. Kait

Sekolah bebek punya deretan ruang kelas di satu koridor. Sebuah penguat sinyal memancarkan sinyal paling kuat di ruangnya, lalu melemah satu tingkat di setiap ruang berikutnya. Di mana penguat baru harus dipasang, supaya paling banyak kelas bisa belajar daring?

Lalu, kalau koridornya punya seratus lima puluh kelas, berapa penguat yang kita butuhkan? Ternyata, jawabannya cukup dihitung dari jarak terjauh antara dua penguat.

Setelah menonton video ini, kamu bisa menghitung banyak alat paling sedikit yang dibutuhkan untuk menutupi seluruh area.

## 1. Pengantar

Soal di video ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam jenjang SMA, yaitu soal nomor dua puluh, dua puluh satu, dan dua puluh dua, yang berjudul Peta Internet Sekolah. Soal ini disusun oleh Tim Olimpiade Komputer Indonesia.

Ketiga soal ini memakai cerita yang sama. Kita pahami ceritanya dulu, lalu kita kerjakan soalnya satu per satu. Setiap soal punya waktu untuk kamu coba sendiri.

## 2. Soal · Peta Internet Sekolah

Sekolah bebek punya N ruang kelas yang berjajar di satu koridor lurus, dari ruang satu di paling kiri sampai ruang N di paling kanan. Sekolah akan memasang beberapa penguat sinyal internet.

Setiap penguat punya posisi dan kekuatan awal. Kalau penguat dipasang di ruang X dengan kekuatan Y, ruang X mendapat tambahan sinyal Y. Ruang yang berjarak satu mendapat Y kurang satu, ruang yang berjarak dua mendapat Y kurang dua, dan seterusnya sampai nol.

Misalnya, penguat berkekuatan empat di ruang lima memberi sinyal empat di ruang lima, tiga di ruang empat dan enam, dua di ruang tiga dan tujuh, lalu satu di ruang dua dan delapan. Sinyal dari beberapa penguat dijumlahkan.

Sebuah ruang kelas layak untuk belajar daring kalau total sinyalnya paling sedikit P.

## 3. Soal 20 · Satu penguat baru

Soal nomor dua puluh. Ada delapan belas ruang dan empat penguat yang sudah terpasang, seperti di tabel ini. Kita boleh memasang satu penguat lagi berkekuatan empat, di ruang mana pun. Kalau P sama dengan delapan, berapa paling banyak ruang yang layak?

Coba hitung sendiri dulu. Pause videonya kalau perlu.

Pertama, kita hitung total sinyal setiap ruang dari keempat penguat. Ruang yang sudah layak hanya lima, yaitu ruang tujuh, tiga belas, empat belas, lima belas, dan enam belas.

Penguat baru memberi empat di ruangnya, tiga di sebelahnya, lalu dua, lalu satu. Jadi, penguat ini hanya menolong ruang yang dekat dan kekurangannya sedikit. Ruang enam sampai dua belas hanya kurang satu atau dua.

Kita coba setiap posisi. Hasil terbaik didapat kalau penguat baru dipasang di ruang sembilan. Ruang enam, delapan, sembilan, sepuluh, sebelas, dan dua belas menjadi layak, jadi ada enam ruang baru.

Totalnya lima ditambah enam, yaitu sebelas ruang. Jawaban soal dua puluh adalah sebelas.

## 4. Soal 21 · Penguat paling sedikit

Soal nomor dua puluh satu. Sekarang ada seratus lima puluh ruang tanpa penguat sama sekali. Semua penguat berkekuatan sepuluh, dan P sama dengan enam. Berapa penguat paling sedikit agar semua ruang layak?

Coba hitung sendiri dulu. Pause videonya kalau perlu.

Satu penguat berkekuatan sepuluh hanya cukup untuk ruang yang jaraknya paling jauh empat, karena sepuluh kurang empat sama dengan enam. Jadi, ruang paling ujung butuh penguat yang jaraknya paling jauh empat ruang.

Di antara dua penguat, sinyalnya saling membantu. Kalau jarak dua penguat empat belas ruang, ruang di tengah berjarak tujuh dari keduanya, dan mendapat tiga ditambah tiga, yaitu enam. Itu masih cukup. Tetapi, kalau jaraknya lima belas, ada ruang yang hanya mendapat lima.

Jadi, penguat pertama dipasang di ruang lima, lalu setiap penguat berikutnya paling jauh empat belas ruang dari sebelumnya. Dengan k penguat, jangkauannya sampai ruang empat belas kali k, dikurangi lima.

Sebelas penguat hanya menjangkau sampai ruang seratus empat puluh sembilan. Dua belas penguat menjangkau sampai ruang seratus enam puluh tiga, cukup untuk seratus lima puluh ruang. Jawaban soal dua puluh satu adalah dua belas.

## 5. Soal 22 · Kekuatan paling kecil

Soal nomor dua puluh dua. Masih ada seratus lima puluh ruang, dan P sama dengan enam. Tetapi, sekarang hanya ada empat penguat dengan kekuatan yang sama. Berapa kekuatan paling kecil yang dibutuhkan?

Coba hitung sendiri dulu. Pause videonya kalau perlu.

Kita pakai cara yang sama untuk kekuatan Y. Di ujung, satu penguat menjangkau Y kurang enam ruang. Di antara dua penguat, ruang di tengah mendapat jumlah dua sinyal, jadi jaraknya paling jauh dua Y kurang enam.

Empat penguat punya dua ujung dan tiga celah. Jadi, panjang yang terjangkau adalah dua kali Y kurang enam, ditambah tiga kali dua Y kurang enam, ditambah satu ruang tempat penguat pertama. Hasilnya delapan Y kurang dua puluh sembilan.

Kita butuh delapan Y kurang dua puluh sembilan paling sedikit seratus lima puluh. Untuk Y dua puluh dua, hasilnya seratus empat puluh tujuh, belum cukup. Untuk Y dua puluh tiga, hasilnya seratus lima puluh lima, sudah cukup. Jawaban soal dua puluh dua adalah dua puluh tiga.

## 6. Konsep · Masalah cakupan

Soal seperti ini disebut masalah cakupan, yaitu menutupi seluruh area dengan alat sesedikit mungkin. Contohnya memasang wifi, lampu jalan, atau menara pemancar.

Triknya adalah mencari celah terbesar yang masih aman, bukan mencoba semua posisi. Setelah celah terbesar diketahui, banyak alat tinggal dihitung dengan pembagian.

Cara memasangnya adalah cara rakus. Pasang alat pertama sejauh mungkin dari ujung, lalu setiap alat berikutnya sejauh mungkin dari alat sebelumnya, selama semua ruang masih aman.

## 7. Penutup

Mari kita ulang ketiga jawabannya. Jawaban soal dua puluh adalah sebelas. Jawaban soal dua puluh satu adalah dua belas. Jawaban soal dua puluh dua adalah dua puluh tiga.

Soal-soal ini berasal dari OSN-K Informatika tahun dua ribu dua puluh enam, nomor dua puluh sampai dua puluh dua, yang berjudul Peta Internet Sekolah. Terima kasih kepada Tim Olimpiade Komputer Indonesia yang telah menyusunnya.

Coba pikirkan, kalau kekuatan penguat sepuluh dan P sama dengan delapan, berapa penguat paling sedikit untuk seratus lima puluh ruang? Tulis jawabanmu di kolom komentar. Sampai jumpa di soal berikutnya!
