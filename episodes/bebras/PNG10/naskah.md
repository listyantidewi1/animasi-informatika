# Pembahasan Soal Bebras Penggalang: Robot Pengumpul Permen (2017-CA-12)

Video pembahasan untuk kategori **Penggalang (SMP)**, seri "Pembahasan Soal Bebras" (kode PNG10). Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan. Suara Kak Ceria, kecepatan 0,95 (intro1 dan intro2 dipakai ulang dari PNG08).

Soal asli: "Robot Pengumpul Permen", Tantangan Bebras 2017, usulan Kanada (kode I-2017-CA-12), dari Buku Tantangan Bebras Indonesia 2017 tingkat SMP (Penggalang). Pilihan jawaban di buku tidak berhuruf; di video diberi huruf A–E sesuai urutan di buku. Lantai, permen, dan robot digambar ulang dengan kode.

**Isi soal:** Lantai 5 × 5 petak; setiap petak berisi 0–3 permen. Dari baris atas ke bawah: 2 0 1 1 F / 1 2 0 2 3 / 2 2 0 2 1 / 3 1 0 2 0 / S 0 1 3 0. Robot mulai di S (kiri bawah), berakhir di F (kanan atas), setiap langkah hanya ke kanan atau ke atas, dan mengambil semua permen di petak yang dilewati. Berapa permen paling banyak? Pilihan: 10, 12, 14, 16, 13.

**Jawaban: C. 14.** Tabel nilai terbaik (dari bawah ke atas, kolom demi kolom): kolom 1: 0, 3, 5, 6, 8; kolom 2: 0, 4, 7, 9, 9; kolom 3: 1, 4, 7, 9, 10; kolom 4: 4, 6, 9, 11, 12; kolom 5: 4, 6, 10, 14, 14. Jalan terbaik: naik, naik, kanan, naik, kanan, kanan, kanan, naik (ada satu jalan lain yang juga 14). Ada 70 jalan dari S ke F. Diperiksa ulang dengan program (scratchpad cek.py) dan di scenes.js.

Jebakan: 10 = naik terus lalu ke kanan; 13 = ke kanan dulu mengambil 3 permen di baris bawah. Ada satu jeda "pikirkan dulu".

## 0. Pembuka dan soal

Halo, teman-teman! Aku Kiko. Selamat datang di pembahasan soal Bebras. Kali ini, kita akan mengerjakan satu soal Bebras untuk tingkat SMP.
*[Visual: Papan tulis putih; tulisan "Tantangan Bebras"; empat berang-berang; Kiko di kiri.]*

Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah. Jadi, kita tidak perlu menebak.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Robot Pengumpul Permen". Soal ini berasal dari Tantangan Bebras tahun dua ribu tujuh belas, dan dibuat oleh tim Bebras dari negara Kanada.
*[Visual: Bola dunia, bendera Kanada; kartu ASAL SOAL: judul, Bebras 2017, tim Bebras Kanada (dilingkari), kode 2017-CA-12, sumber buku Tantangan Bebras Indonesia 2017.]*

Setelah menonton video ini, kamu bisa mencari jalan dengan hasil terbanyak tanpa harus mencoba semua jalan satu per satu.
*[Visual: Kartu judul "Robot Pengumpul Permen" dengan kalimat kait.]*

Sebelum membahasnya, mari kita pahami soalnya dulu. Robot Candy berjalan di lantai yang terdiri dari petak-petak, yaitu lima baris dan lima kolom. Di setiap petak ada nol, satu, dua, atau tiga permen.
*[Visual: Lantai 5 × 5 petak dengan gambar permen di setiap petak.]*

Robot mulai dari petak S di kiri bawah, dan harus sampai di petak F di kanan atas. Setiap kali melangkah, robot hanya boleh pindah ke petak di sebelah kanan, atau ke petak di sebelah atas.
*[Visual: S dan F dilingkari; robot di S; panah kanan dan atas (boleh), panah kiri dan bawah disilang.]*

Robot mengambil semua permen di petak yang ia lewati. Misalnya, robot naik terus sampai baris paling atas, lalu belok ke kanan. Robot mendapat tiga, dua, satu, dan dua permen, lalu nol, satu, dan satu permen. Jumlahnya sepuluh permen.
*[Visual: Jalan naik terus lalu ke kanan digambar; penghitung permen bertambah sampai 10.]*

Pertanyaannya adalah, berapa permen paling banyak yang bisa dikumpulkan robot? Pilihan A adalah sepuluh. Pilihan B adalah dua belas. Pilihan C adalah empat belas. Pilihan D adalah enam belas. Pilihan E adalah tiga belas.
*[Visual: Kartu pertanyaan dan pilihan A 10, B 12, C 14, D 16, E 13.]*

## 1. Mencoba semua jalan?

Cara pertama yang terpikir adalah mencoba semua jalan. Tetapi, dari S ke F ada tujuh puluh jalan yang berbeda! Mencoba semuanya satu per satu sangat melelahkan, dan mudah salah hitung.
*[Visual: Banyak jalan tipis muncul bertumpuk; tulisan "70 jalan!".]*

Bagaimana kalau kita memilih jalan yang terlihat bagus? Misalnya, robot ke kanan dulu untuk mengambil tiga permen di baris bawah, lalu naik, lalu ke kanan lagi. Hasilnya tiga belas permen.
*[Visual: Jalan ke kanan, naik, ke kanan digambar; penghitung sampai 13.]*

Tiga belas lebih banyak dari sepuluh. Tetapi, apakah itu yang terbanyak? Kita belum tahu, karena masih banyak jalan lain. Kita butuh cara yang lebih pintar.
*[Visual: Tulisan "13 > 10, tetapi terbanyak?".]*

## 2. Tabel permen terbanyak

Idenya begini. Untuk setiap petak, kita catat permen terbanyak yang bisa dikumpulkan sampai di petak itu. Kita tulis angkanya di pojok petak.
*[Visual: Lingkaran oranye kosong di pojok setiap petak; catatan "nilai = permen terbanyak sampai petak ini".]*

Robot hanya bisa datang dari kiri atau dari bawah. Jadi, nilai sebuah petak sama dengan permen di petak itu, ditambah nilai yang lebih besar di antara petak kirinya dan petak bawahnya.
*[Visual: Satu petak dengan panah dari kiri dan dari bawah; rumus "nilai = permen + yang lebih besar dari (kiri, bawah)".]*

Baris paling bawah hanya bisa dicapai dari kiri. Nilainya nol, nol, satu, empat, dan empat. Kolom paling kiri hanya bisa dicapai dari bawah. Nilainya tiga, lima, enam, dan delapan.
*[Visual: Nilai baris bawah muncul satu per satu, lalu nilai kolom kiri.]*

Sekarang, lihat petak di kanan angka tiga. Petak itu berisi satu permen. Nilai kirinya tiga, dan nilai bawahnya nol. Kita pilih yang lebih besar, yaitu tiga. Jadi, nilainya satu ditambah tiga, yaitu empat.
*[Visual: Petak disorot; panah dari kiri (3, dilingkari) dan bawah (0); nilai 4 muncul.]*

Petak di atasnya berisi dua permen. Nilai kirinya lima, dan nilai bawahnya empat. Jadi, nilainya dua ditambah lima, yaitu tujuh.
*[Visual: Petak di atasnya disorot; 5 dilingkari; nilai 7 muncul.]*

Coba lanjutkan sendiri. Isi petak-petak berikutnya, kolom demi kolom. Berapa nilai di petak F? Hentikan videonya sebentar kalau kamu perlu waktu.
*[Visual: Jam pasir PIKIRKAN DULU; petak F diberi tanda tanya.]*

Kolom kedua, dari bawah ke atas, berisi nol, empat, tujuh, sembilan, dan sembilan. Kolom ketiga berisi satu, empat, tujuh, sembilan, dan sepuluh.
*[Visual: Nilai kolom kedua dan ketiga muncul dari bawah ke atas.]*

Kolom keempat berisi empat, enam, sembilan, sebelas, dan dua belas. Kolom terakhir berisi empat, enam, sepuluh, empat belas, dan empat belas. Jadi, nilai di petak F adalah empat belas.
*[Visual: Nilai kolom keempat dan kelima muncul; nilai 14 di F dilingkari.]*

Artinya, robot bisa mengumpulkan paling banyak empat belas permen. Jawabannya adalah C, yaitu empat belas.
*[Visual: Kartu jawaban "C. 14 permen".]*

Jalannya bisa kita temukan dengan berjalan mundur dari F. Di setiap petak, kita ikuti tetangga yang nilainya lebih besar, yaitu petak kiri atau petak bawah. Salah satu jalan terbaik adalah naik, naik, kanan, naik, lalu kanan tiga kali, dan naik ke F.
*[Visual: Jalan terbaik digambar hijau dari F mundur ke S, lalu robot berjalan dari S ke F.]*

Jawaban enam belas tidak mungkin, karena tabel sudah menghitung yang terbaik untuk setiap petak. Jalan tiga belas tadi hampir benar, tetapi masih kurang satu permen.
*[Visual: Pilihan D (16) dan E (13) dicoret; catatan "16: tidak ada jalan", "13: kurang 1".]*

## 3. Penutup

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, pahami gerakan yang boleh dilakukan robot. Kedua, isi tabel nilai terbaik petak demi petak, mulai dari dekat S. Ketiga, baca jawabannya di F, lalu telusuri jalannya mundur.
*[Visual: Tiga kartu langkah muncul satu per satu.]*

Cara mengisi tabel seperti ini disebut dynamic programming. Masalah besar dipecah menjadi masalah-masalah kecil, dan setiap jawaban kecil dicatat supaya tidak perlu dihitung ulang. Aplikasi peta memakai ide yang mirip untuk mencari rute terbaik.
*[Visual: Tabel nilai penuh; tulisan "dynamic programming: catat jawaban kecil"; ikon peta dengan rute.]*

Jadi, Robot Candy bisa mengumpulkan paling banyak empat belas permen.
*[Visual: Jalan terbaik dan nilai 14 di F.]*

Terima kasih kepada tim Bebras Kanada yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!
*[Visual: Kartu TERIMA KASIH dengan kredit soal; Kiko melambai.]*

## Short (vertikal)

Robot berjalan dari S ke F, hanya ke kanan atau ke atas. Robot mengambil semua permen di petak yang ia lewati.

Berapa permen paling banyak yang bisa dikumpulkan? Pilihannya sepuluh, dua belas, empat belas, enam belas, atau tiga belas. Coba pikirkan dulu.

Ada tujuh puluh jalan, jadi kita tidak mencoba semuanya. Kita isi tabel. Nilai setiap petak adalah permennya, ditambah nilai terbesar dari petak kiri atau petak bawahnya.

Kita isi petak demi petak, mulai dari dekat S. Akhirnya, nilai di petak F adalah empat belas.

Jadi, jawabannya empat belas permen. Salah satu jalannya adalah naik, naik, kanan, naik, kanan tiga kali, lalu naik.

Tonton pembahasan lengkapnya, ya! Soal ini dibuat oleh tim Bebras Kanada.
