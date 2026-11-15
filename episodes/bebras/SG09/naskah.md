# Pembahasan Soal Bebras Siaga: Membangun Bendungan (2017-IR-02)

Video pembahasan untuk kategori **Siaga (kelas 4–6 SD)**, seri "Pembahasan Soal Bebras" (kode SG09). Bahasanya semudah kategori SiKecil. Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan. Suara Kak Ceria, kecepatan 0,9 (intro1 dan intro2 dipakai ulang dari SG07).

Soal asli: "Membangun Bendungan", Tantangan Bebras 2017, usulan Iran (kode I-2017-IR-02), dari Buku Tantangan Bebras Indonesia 2017 tingkat SD (Siaga). Pilihan jawaban di buku tidak berhuruf; di video diberi huruf A–D sesuai urutan di buku. Batang kayu dan berang-berang digambar ulang dengan kode.

**Isi soal:** Bebras Jordan menebang pohon; setiap batang panjangnya 10 meter. Bebras Ali butuh 7 potong kayu 4 meter dan 7 potong kayu 3 meter untuk bendungan, dan boleh memotong batang sesuai keperluan. Jordan ingin memberi batang sesedikit mungkin. Berapa batang paling sedikit? Pilihan: 5, 6, 7, 8.

**Jawaban: B. 6 batang.** Butuh 7×4 + 7×3 = 49 m, jadi paling sedikit 5 batang (50 m). Dengan 5 batang, kayu yang terbuang paling banyak 1 m, sehingga tidak boleh ada batang yang dipotong 4+4 (sisa 2 m). Akibatnya setiap batang memuat paling banyak satu potong 4 m, jadi paling banyak 5 potong 4 m, padahal butuh 7. Enam batang cukup: tiga batang 4+3+3, dua batang 4+4, satu batang untuk satu potong 3 m. Diperiksa ulang dengan program (scratchpad cek.py) dan di scenes.js.

Jebakan: 5 = 49 dibagi 10 lalu dibulatkan ke atas, tanpa memeriksa apakah potongannya benar-benar muat. Ada dua jeda "pikirkan dulu".

## 0. Pembuka dan soal

Halo, teman-teman! Aku Kiko. Apakah kamu pernah mendengar Tantangan Bebras? Tantangan Bebras adalah lomba berpikir yang seru untuk anak-anak di seluruh dunia.
*[Visual: Papan tulis putih; tulisan "Tantangan Bebras" ditulis spidol; empat berang-berang muncul; Kiko di kiri.]*

Hari ini, kita akan mengerjakan satu soal Bebras untuk kelas empat, lima, dan enam. Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Membangun Bendungan". Soal ini berasal dari Tantangan Bebras tahun dua ribu tujuh belas, dan dibuat oleh tim Bebras dari negara Iran.
*[Visual: Bola dunia, bendera Iran; kartu ASAL SOAL: judul, Bebras 2017, tim Bebras Iran (dilingkari), kode 2017-IR-02, sumber buku Tantangan Bebras Indonesia 2017.]*

Setelah menonton video ini, kamu bisa mencari cara memotong yang paling hemat, lalu membuktikan bahwa tidak ada cara yang lebih hemat lagi.
*[Visual: Kartu judul "Membangun Bendungan" dengan kalimat kait.]*

Sebelum membahasnya, mari kita pahami soalnya dulu. Bebras Jordan menebang pohon. Setiap pohon dipotong menjadi satu batang kayu yang panjangnya sepuluh meter.
*[Visual: Berang-berang Jordan; satu batang kayu panjang dengan penggaris 0–10 meter.]*

Bebras Ali ingin membangun bendungan. Ali membutuhkan tujuh potong kayu yang panjangnya empat meter, dan tujuh potong kayu yang panjangnya tiga meter.
*[Visual: Berang-berang Ali; kartu kebutuhan: tujuh potong biru 4 m dan tujuh potong hijau 3 m.]*

Ali boleh memotong batang kayu dari Jordan sesuai keperluannya. Tetapi, Jordan ingin memberikan batang kayu sesedikit mungkin.
*[Visual: Batang kayu dengan garis potong putus-putus; tulisan "sesedikit mungkin batang".]*

Pertanyaannya adalah, berapa batang kayu paling sedikit yang harus diberikan Jordan kepada Ali? Pilihan A adalah lima. Pilihan B adalah enam. Pilihan C adalah tujuh. Pilihan D adalah delapan.
*[Visual: Kartu pertanyaan dan pilihan A 5, B 6, C 7, D 8.]*

## 1. Cara memotong satu batang

Mari kita lihat dulu, bagaimana satu batang sepuluh meter bisa dipotong. Cara pertama adalah empat, tiga, dan tiga meter. Jumlahnya tepat sepuluh meter, jadi tidak ada kayu yang tersisa.
*[Visual: Baris cara 1: batang dipotong 4 + 3 + 3 = 10, sisa 0.]*

Cara kedua adalah dua potong empat meter. Jumlahnya delapan meter, jadi sisanya dua meter. Sisa dua meter terlalu pendek untuk potongan tiga meter, jadi sisa itu terbuang. Tiga potong empat meter juga tidak muat, karena dua belas meter lebih panjang dari sepuluh meter.
*[Visual: Baris cara 2: 4 + 4 = 8, sisa 2 (abu-abu, terbuang); catatan 4 + 4 + 4 = 12, tidak muat.]*

Cara ketiga adalah tiga potong tiga meter. Jumlahnya sembilan meter, jadi sisanya satu meter. Perhatikan, cara ketiga tidak menghasilkan potongan empat meter sama sekali.
*[Visual: Baris cara 3: 3 + 3 + 3 = 9, sisa 1.]*

Sekarang, hitunglah panjang semua kayu yang dibutuhkan Ali. Berapa meter jumlahnya? Coba pikirkan dulu.
*[Visual: Jam pasir PIKIRKAN DULU; tujuh potong 4 m dan tujuh potong 3 m dengan tanda tanya.]*

Tujuh potong empat meter panjangnya dua puluh delapan meter. Tujuh potong tiga meter panjangnya dua puluh satu meter. Jadi, jumlahnya empat puluh sembilan meter. Empat batang hanya empat puluh meter, jadi tidak cukup. Paling sedikit, Jordan harus memberi lima batang.
*[Visual: Coretan 7 × 4 = 28, 7 × 3 = 21, 28 + 21 = 49; 4 batang = 40 m (kurang, disilang), 5 batang = 50 m.]*

## 2. Apakah lima batang cukup?

Apakah lima batang benar-benar cukup? Lima batang panjangnya lima puluh meter, sedangkan Ali butuh empat puluh sembilan meter. Jadi, kayu yang terbuang hanya boleh satu meter.
*[Visual: 50 − 49 = 1; tulisan "yang terbuang paling banyak 1 meter".]*

Cara kedua membuang dua meter, jadi cara kedua tidak boleh dipakai. Yang tersisa hanya cara pertama dan cara ketiga.
*[Visual: Kartu tiga cara memotong; cara 2 disilang merah.]*

Tetapi lihat, cara pertama hanya menghasilkan satu potong empat meter, dan cara ketiga tidak menghasilkan potongan empat meter sama sekali. Jadi, lima batang paling banyak menghasilkan lima potong empat meter. Padahal, Ali butuh tujuh potong. Lima batang tidak cukup, dan jawabannya bukan lima.
*[Visual: Lima batang dengan cara 1; penghitung potongan 4 m berhenti di 5 dari 7 (merah); pilihan A dicoret.]*

## 3. Mencoba enam batang

Bagaimana dengan enam batang? Coba susun sendiri potongannya, supaya Ali mendapat tujuh potong empat meter dan tujuh potong tiga meter.
*[Visual: Jam pasir PIKIRKAN DULU; enam batang kosong dan penghitung 0 dari 7.]*

Batang pertama, kedua, dan ketiga dipotong dengan cara pertama, yaitu empat, tiga, dan tiga meter. Sekarang kita punya tiga potong empat meter, dan enam potong tiga meter.
*[Visual: Tiga batang pertama dipotong 4 + 3 + 3; penghitung 4 m: 3, 3 m: 6.]*

Kita masih butuh empat potong empat meter. Batang keempat dan kelima dipotong dengan cara kedua, yaitu empat dan empat meter. Sekarang potongan empat meter sudah tujuh.
*[Visual: Batang 4 dan 5 dipotong 4 + 4; penghitung 4 m: 7 (hijau, lengkap).]*

Kita masih butuh satu potong tiga meter. Dari batang keenam, Ali memotong tiga meter. Sisa batang itu boleh disimpan untuk keperluan lain. Sekarang semua potongan sudah lengkap.
*[Visual: Batang 6: satu potong 3 m, sisanya 7 m disimpan; penghitung 3 m: 7 (hijau).]*

Jadi, enam batang cukup, sedangkan lima batang tidak cukup. Jawabannya adalah B, yaitu enam batang.
*[Visual: Kartu jawaban "B. 6 batang"; pilihan B dilingkari.]*

Tujuh atau delapan batang memang cukup, tetapi itu bukan yang paling sedikit. Ingat, yang ditanyakan adalah jumlah batang paling sedikit.
*[Visual: Pilihan C dan D dicoret; catatan "cukup, tetapi tidak paling sedikit".]*

## 4. Penutup

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, daftar semua cara memotong satu batang, beserta sisanya. Kedua, hitung panjang semua kayu yang dibutuhkan, supaya tahu batas paling sedikit. Ketiga, periksa apakah batas itu bisa dicapai. Kalau tidak, tambah satu batang.
*[Visual: Tiga kartu langkah muncul satu per satu.]*

Di pabrik, komputer sering diminta mencari cara memotong kayu, pipa, kain, atau kertas, supaya bahan yang terbuang sesedikit mungkin. Mencari cara yang paling hemat seperti ini adalah salah satu pekerjaan penting dalam informatika.
*[Visual: Ikon kayu, pipa, kain, kertas; layar komputer menyusun potongan; tulisan "cari cara paling hemat".]*

Jadi, Ali cukup menerima enam batang kayu dari Jordan untuk membangun bendungannya.
*[Visual: Enam batang terpotong lengkap; label "6 batang".]*

Terima kasih kepada tim Bebras Iran yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!
*[Visual: Kartu TERIMA KASIH dengan kredit soal; Kiko melambai.]*

## Short (vertikal)

Setiap batang kayu panjangnya sepuluh meter. Ali butuh tujuh potong empat meter, dan tujuh potong tiga meter.

Berapa batang paling sedikit yang dibutuhkan? Pilihannya lima, enam, tujuh, atau delapan. Coba pikirkan dulu.

Jumlah semuanya empat puluh sembilan meter. Kalau lima batang, yang terbuang hanya boleh satu meter.

Batang yang dipotong empat dan empat membuang dua meter, jadi tidak boleh dipakai. Akibatnya, lima batang hanya memberi lima potong empat meter. Itu kurang dari tujuh!

Dengan enam batang, potonglah tiga batang menjadi empat, tiga, tiga, dan dua batang menjadi empat, empat. Batang terakhir untuk satu potong tiga meter. Jawabannya enam batang.

Tonton pembahasan lengkapnya, ya! Soal ini dibuat oleh tim Bebras Iran.
