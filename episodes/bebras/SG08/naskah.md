# Pembahasan Soal Bebras Siaga: Robot Pengecat Pagar (2017-SK-10)

Video pembahasan untuk kategori **Siaga (kelas 4–6 SD)**, seri "Pembahasan Soal Bebras" (kode SG08). Bahasanya semudah kategori SiKecil. Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan. Suara Kak Ceria, kecepatan 0,9 (intro1 dan intro2 dipakai ulang dari SG07).

Soal asli: "Robot Pengecat Pagar", Tantangan Bebras 2017, usulan Slowakia (kode I-2017-SK-10), dari Buku Tantangan Bebras Indonesia 2017 tingkat SD (Siaga). Pilihan jawaban di buku tidak berhuruf; di video diberi huruf A–D sesuai urutan di buku. Pagar, kaleng cat, dan robot digambar ulang dengan kode.

**Isi soal:** Robot mengecat pagar papan demi papan dari kiri. Empat kaleng: merah cukup 5 papan, hijau 3, kuning 7, biru 2. Urutan warna merah, hijau, kuning, biru, lalu kembali ke merah. Kaleng yang habis dibuang, robot meneruskan dengan kaleng yang tersisa. Dua papan bersebelahan tidak boleh sama warnanya, sehingga robot berhenti bila semua kaleng kosong atau cat tinggal di satu kaleng. Pertanyaan: berapa papan yang dapat dicat? Pilihan: 8, 17, 15, 5.

**Jawaban: C. 15 papan.** Urutan M-H-K-B-M-H-K-B-M-H-K-M-K-M-K; kuning masih sisa 2 tetapi tidak bisa dipakai. Diperiksa ulang dengan program simulasi (scratchpad cek.py) dan di scenes.js.

Jebakan: 17 = jumlah semua cat (lupa aturan papan bersebelahan); 8 = berhenti saat kaleng pertama habis. Ada dua jeda "pikirkan dulu".

## 0. Pembuka dan soal

Halo, teman-teman! Aku Kiko. Apakah kamu pernah mendengar Tantangan Bebras? Tantangan Bebras adalah lomba berpikir yang seru untuk anak-anak di seluruh dunia.
*[Visual: Papan tulis putih; tulisan "Tantangan Bebras" ditulis spidol; empat berang-berang muncul; Kiko di kiri.]*

Hari ini, kita akan mengerjakan satu soal Bebras untuk kelas empat, lima, dan enam. Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Robot Pengecat Pagar". Soal ini berasal dari Tantangan Bebras tahun dua ribu tujuh belas, dan dibuat oleh tim Bebras dari negara Slowakia.
*[Visual: Bola dunia, bendera Slowakia; kartu ASAL SOAL: judul, Bebras 2017, tim Bebras Slowakia (dilingkari), kode 2017-SK-10, sumber buku Tantangan Bebras Indonesia 2017.]*

Setelah menonton video ini, kamu bisa menjalankan aturan langkah demi langkah seperti komputer, lalu menghitung hasilnya dengan teliti.
*[Visual: Kartu judul "Robot Pengecat Pagar" dengan kalimat kait.]*

Sebelum membahasnya, mari kita pahami soalnya dulu. Si Bebras punya pagar kayu yang panjang. Pagar itu tersusun dari banyak papan yang berjajar.
*[Visual: Pagar 17 papan kayu muncul dari kiri; tulisan "pagar si Bebras".]*

Sebuah robot akan mengecat pagar itu. Robot mengecat satu papan dengan satu warna. Robot mulai dari papan paling kiri, lalu bergeser ke papan di sebelah kanannya.
*[Visual: Robot pengecat muncul di papan paling kiri; panah ke kanan "mulai dari kiri".]*

Robot membawa empat kaleng cat. Cat merah cukup untuk mengecat lima papan. Cat hijau cukup untuk tiga papan. Cat kuning cukup untuk tujuh papan. Cat biru cukup untuk dua papan.
*[Visual: Empat kaleng muncul satu per satu dengan angka sisa 5, 3, 7, 2 dan kotak kecil sebanyak papan.]*

Robot memakai warna secara berurutan, yaitu merah, hijau, kuning, lalu biru. Setelah biru, robot kembali lagi ke merah, dan begitu seterusnya.
*[Visual: Panel kanan: lingkaran urutan merah → hijau → kuning → biru → kembali ke merah.]*

Kalau cat di sebuah kaleng habis, robot membuang kaleng itu. Lalu, robot terus mengecat dengan kaleng yang masih ada, dengan urutan yang sama.
*[Visual: Contoh kaleng kosong disilang dan dibuang; tulisan "kaleng habis, dibuang".]*

Ada satu aturan penting lagi. Dua papan yang bersebelahan tidak boleh berwarna sama. Karena itu, robot berhenti kalau semua kaleng sudah kosong, atau kalau cat tinggal ada di satu kaleng saja.
*[Visual: Dua papan merah bersebelahan disilang; kartu "Robot berhenti kalau: semua kaleng kosong, atau cat tinggal di 1 kaleng".]*

Pertanyaannya adalah, berapa papan yang dapat dicat oleh robot sampai ia berhenti? Pilihan A adalah delapan. Pilihan B adalah tujuh belas. Pilihan C adalah lima belas. Pilihan D adalah lima.
*[Visual: Kartu pertanyaan dan pilihan A 8, B 17, C 15, D 5.]*

## 1. Kapan robot berhenti?

Sebelum menghitung, kita pahami dulu aturan yang terakhir. Mengapa robot harus berhenti kalau cat tinggal ada di satu kaleng saja?
*[Visual: Kartu aturan berhenti dilingkari.]*

Bayangkan hanya kaleng kuning yang masih berisi cat. Robot mengecat satu papan dengan warna kuning. Papan berikutnya harus berwarna lain, tetapi tidak ada warna lain lagi. Kalau robot memakai kuning lagi, dua papan kuning akan bersebelahan, dan itu dilarang. Jadi, robot harus berhenti.
*[Visual: Contoh: hanya kaleng kuning; papan kuning, lalu papan kuning kedua disilang; tulisan "tidak boleh sama, robot berhenti".]*

Sekarang kamu tahu, jawabannya belum tentu sama dengan jumlah semua cat. Kalau kita menjumlahkan lima, tiga, tujuh, dan dua, hasilnya tujuh belas. Tetapi, robot belum tentu bisa memakai semua cat itu.
*[Visual: Coretan 5 + 3 + 7 + 2 = 17, lalu tanda tanya "belum tentu!".]*

Cara yang paling aman adalah menjalankan aturannya langkah demi langkah, seperti robot. Kita akan mencatat warna setiap papan, dan menghitung sisa cat di setiap kaleng.
*[Visual: Tulisan "jalankan langkah demi langkah"; angka sisa di kaleng dilingkari.]*

## 2. Menjalankan aturan: delapan papan pertama

Kita mulai. Papan pertama dicat merah, jadi sisa cat merah tinggal empat. Papan kedua dicat hijau, dan sisa hijau tinggal dua. Papan ketiga dicat kuning, dan sisa kuning tinggal enam. Papan keempat dicat biru, dan sisa biru tinggal satu.
*[Visual: Robot mengecat papan 1–4; angka sisa kaleng berkurang tepat saat papan dicat.]*

Sekarang, robot kembali ke merah. Coba lanjutkan sendiri empat papan berikutnya. Berapa sisa cat di setiap kaleng? Hentikan videonya sebentar kalau kamu perlu waktu.
*[Visual: Jam pasir PIKIRKAN DULU; papan 5–8 diberi tanda tanya.]*

Papan kelima dicat merah, jadi sisa merah tinggal tiga. Papan keenam dicat hijau, jadi sisa hijau tinggal satu. Papan ketujuh dicat kuning, jadi sisa kuning tinggal lima. Papan kedelapan dicat biru, dan sisa biru menjadi nol. Kaleng biru habis!
*[Visual: Robot mengecat papan 5–8; angka biru menjadi 0 dan kaleng biru disilang.]*

Karena kaleng biru sudah kosong, robot membuang kaleng biru. Tetapi, robot belum berhenti, karena masih ada tiga kaleng yang berisi cat. Jadi, jawabannya bukan delapan.
*[Visual: Kaleng biru dibuang (redup); di urutan warna, biru dicoret; pilihan A (8) dicoret.]*

## 3. Kaleng hijau dan merah habis

Sekarang, urutan warnanya tinggal merah, hijau, dan kuning. Papan kesembilan dicat merah, dan sisa merah tinggal dua. Papan kesepuluh dicat hijau, dan sisa hijau menjadi nol. Kaleng hijau juga habis, jadi kaleng hijau dibuang.
*[Visual: Robot mengecat papan 9–10; kaleng hijau disilang dan dibuang; hijau dicoret di urutan warna.]*

Urutannya tinggal merah dan kuning. Setelah hijau, giliran berikutnya adalah kuning. Papan kesebelas dicat kuning, dan sisa kuning tinggal empat. Papan kedua belas dicat merah, dan sisa merah tinggal satu.
*[Visual: Urutan tinggal merah ⇄ kuning; robot mengecat papan 11–12.]*

Papan ketiga belas dicat kuning, dan sisa kuning tinggal tiga. Papan keempat belas dicat merah, dan sisa merah menjadi nol. Kaleng merah habis, lalu dibuang.
*[Visual: Robot mengecat papan 13–14; kaleng merah disilang dan dibuang.]*

Sekarang, hanya kaleng kuning yang masih berisi cat, cukup untuk tiga papan lagi. Apa yang akan dilakukan robot? Coba pikirkan dulu.
*[Visual: Jam pasir PIKIRKAN DULU; kaleng kuning sisa 3 dilingkari.]*

Papan terakhir tadi berwarna merah. Jadi, papan kelima belas boleh dicat kuning, dan sisa kuning tinggal dua. Setelah itu, papan berikutnya harus berwarna selain kuning. Tetapi, tidak ada warna lain lagi. Robot pun berhenti.
*[Visual: Robot mengecat papan 15 kuning; papan 16 diberi tanda tanya lalu disilang; tulisan "robot berhenti".]*

Mari kita hitung papan yang sudah dicat. Ada lima belas papan. Jadi, jawabannya adalah C, yaitu lima belas papan.
*[Visual: Nomor papan 1–15 dihitung; kartu jawaban "C. 15 papan".]*

Perhatikan juga, cat kuning masih tersisa untuk dua papan, tetapi tidak bisa dipakai. Itulah sebabnya jawabannya bukan tujuh belas. Jawaban delapan juga salah, karena robot tidak berhenti saat kaleng pertama habis.
*[Visual: Kaleng kuning sisa 2 dilingkari; catatan "17 = semua cat, padahal kuning sisa 2" dan "8 = berhenti terlalu cepat".]*

## 4. Penutup

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, pahami setiap aturan, termasuk kapan harus berhenti. Kedua, jalankan aturannya langkah demi langkah, dan catat setiap perubahan. Ketiga, periksa jawabanmu dengan pilihan yang ada.
*[Visual: Tiga kartu langkah muncul satu per satu.]*

Begitulah cara kerja komputer. Komputer menjalankan perintah satu per satu, seperti robot pengecat ini. Kalau kita ingin tahu hasil sebuah program, kita bisa menelusurinya langkah demi langkah, seperti yang baru saja kita lakukan.
*[Visual: Layar komputer berisi daftar perintah; penunjuk bergerak ke bawah baris demi baris; robot kecil di samping.]*

Jadi, robot mengecat lima belas papan, dengan urutan warna seperti pada pagar ini.
*[Visual: Pagar jadi 15 papan berwarna; label "15 papan".]*

Terima kasih kepada tim Bebras Slowakia yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!
*[Visual: Kartu TERIMA KASIH dengan kredit soal; Kiko melambai.]*

## Short (vertikal)

Sebuah robot mengecat pagar, papan demi papan. Urutan warnanya merah, hijau, kuning, biru, lalu kembali ke merah. Isi catnya cukup untuk lima, tiga, tujuh, dan dua papan.

Kaleng yang habis dibuang. Dua papan yang bersebelahan tidak boleh berwarna sama. Berapa papan yang bisa dicat robot? Pilihannya delapan, tujuh belas, lima belas, atau lima. Coba pikirkan dulu.

Kita jalankan aturannya langkah demi langkah. Setelah delapan papan, kaleng biru habis. Setelah sepuluh papan, kaleng hijau juga habis.

Lalu, robot bergantian memakai kuning dan merah, sampai cat merah habis di papan keempat belas. Papan kelima belas dicat kuning.

Sekarang, cat tinggal ada di kaleng kuning. Papan berikutnya tidak boleh kuning lagi, jadi robot berhenti. Jawabannya adalah lima belas papan, bukan tujuh belas.

Tonton pembahasan lengkapnya, ya! Soal ini dibuat oleh tim Bebras Slowakia.
