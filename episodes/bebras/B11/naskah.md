# Pembahasan Soal Bebras SiKecil: Pohon Sudoku (2020-CH-04)

Video pembahasan untuk kategori **SiKecil (kelas 1–3 SD)**, seri "Pembahasan Soal Bebras" (kode B11). Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan. Suara Kak Ceria, kecepatan 0,85 (intro1 dan intro2 dipakai ulang dari B09).

Soal asli: "Pohon Sudoku", Tantangan Bebras 2020, usulan Swiss (kode 2020-CH-04), dari Buku Tantangan Bebras Indonesia 2020 kategori SiKecil. Pohon, papan, dan berang-berang digambar ulang dengan kode.

**Isi soal:** Empat pohon berbeda tinggi dalam satu baris; papan di kedua ujung berisi banyak pohon yang terlihat dari sana (pohon tersembunyi di balik pohon yang lebih tinggi). Contoh: besar, kecil, paling besar, sedang → 2 dan 2. Soal: kecil, besar, paling besar, sedang. Pilihan: A. A=2, B=3; B. A=3, B=2; C. A=2, B=4; D. A=4, B=1.

**Jawaban: B (A=3, B=2).** Dari A: kecil, besar, paling besar terlihat; sedang tersembunyi. Dari B: sedang, paling besar terlihat (diperiksa di scenes.js).

Ada satu jeda "pikirkan dulu".

## 0. Pembuka dan soal

Halo, teman-teman! Aku Kiko. Hari ini, kita akan mengerjakan satu soal Bebras untuk kelas satu, dua, dan tiga.
*[Visual: Papan tulis; Tantangan Bebras; berang-berang; Kiko melambai.]*

Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah.
*[Visual: Tulisan tangan pelan-pelan.]*

Soal ini berjudul "Pohon Sudoku". Soal ini berasal dari Tantangan Bebras tahun dua ribu dua puluh, dan dibuat oleh tim Bebras dari negara Swiss.
*[Visual: Bola dunia, bendera Swiss; kartu ASAL SOAL.]*

Setelah menonton video ini, kamu bisa menghitung benda yang terlihat dari depan, dengan mengingat benda paling tinggi yang sudah kamu lihat.
*[Visual: Kartu judul "Pohon Sudoku".]*

Mari kita lihat soalnya dulu. Bebras si berang-berang menanam empat pohon dalam satu baris. Tinggi pohon-pohon itu berbeda-beda. Ada pohon kecil, pohon sedang, pohon besar, dan pohon paling besar.
*[Visual: Empat petak ladang; empat pohon dengan label kecil, sedang, besar, paling besar.]*

Kalau berang-berang berdiri di ujung baris dan melihat ke arah pohon, ia tidak bisa melihat pohon yang tersembunyi di balik pohon yang lebih tinggi.
*[Visual: Berang-berang di ujung; garis pandang; pohon tersembunyi menjadi pucat.]*

Di setiap ujung baris, ada papan. Di papan itu, berang-berang menulis banyak pohon yang terlihat dari tempat itu. Contohnya, pada baris ini, dari kiri terlihat dua pohon, dan dari kanan juga terlihat dua pohon.
*[Visual: Baris contoh besar, kecil, paling besar, sedang; papan 2 dan 2 dengan garis pandang.]*

Sekarang, lihat baris pohon yang baru ini. Ada papan A di sebelah kiri, dan papan B di sebelah kanan. Pertanyaannya adalah, angka berapa yang harus ditulis di papan A dan di papan B?
*[Visual: Baris soal kecil, besar, paling besar, sedang; papan A dan B berisi tanda tanya.]*

Pilihannya ada empat. A, papan A dua dan papan B tiga. B, papan A tiga dan papan B dua. C, papan A dua dan papan B empat. D, papan A empat dan papan B satu.
*[Visual: Pilihan A–D.]*

## 1. Pemanasan: siapa yang terlihat?

Sebelum menjawab, ayo kita pemanasan dulu. Bayangkan kamu berbaris di belakang teman yang lebih tinggi. Kalau kamu lebih pendek, kepalamu tertutup, jadi kamu tidak terlihat dari depan.
*[Visual: Anak-anak berbaris dilihat dari samping; mata di depan; anak pendek di belakang anak tinggi tertutup.]*

Tetapi, kalau kamu lebih tinggi dari semua teman di depanmu, kepalamu tetap terlihat. Jadi, seseorang terlihat kalau ia lebih tinggi dari semua yang ada di depannya.
*[Visual: Anak paling tinggi di belakang tetap terlihat; tulisan aturan.]*

## 2. Melihat dari papan A

Sekarang, kita berdiri di papan A, lalu melihat ke kanan. Pohon pertama adalah pohon kecil. Tidak ada yang menghalanginya, jadi pohon kecil terlihat. Hitungannya satu.
*[Visual: Garis pandang dari A ke pohon kecil; angka 1.]*

Pohon kedua adalah pohon besar. Pohon besar lebih tinggi dari pohon kecil di depannya, jadi pohon besar terlihat. Hitungannya dua.
*[Visual: Garis pandang ke pohon besar; angka 2.]*

Pohon ketiga adalah pohon paling besar. Pohon ini lebih tinggi dari semua pohon di depannya, jadi terlihat juga. Hitungannya tiga.
*[Visual: Garis pandang ke pohon paling besar; angka 3.]*

Pohon keempat adalah pohon sedang. Pohon sedang tersembunyi di balik pohon paling besar, jadi tidak terlihat. Jadi, angka di papan A adalah tiga.
*[Visual: Pohon sedang pucat dan disilang; papan A = 3.]*

## 3. Melihat dari papan B

Sekarang, giliranmu. Berapa pohon yang terlihat dari papan B? Coba pikirkan dulu, ya.
*[Visual: Jam pasir PIKIRKAN DULU; papan B berisi tanda tanya.]*

Kita berdiri di papan B, lalu melihat ke kiri. Pohon pertama dari sini adalah pohon sedang. Pohon sedang terlihat. Hitungannya satu.
*[Visual: Garis pandang dari B ke pohon sedang; angka 1.]*

Pohon berikutnya adalah pohon paling besar. Pohon ini lebih tinggi dari pohon sedang, jadi terlihat. Hitungannya dua.
*[Visual: Garis pandang ke pohon paling besar; angka 2.]*

Setelah pohon paling besar, semua pohon lain lebih pendek, jadi semuanya tersembunyi. Jadi, angka di papan B adalah dua.
*[Visual: Pohon besar dan kecil pucat; papan B = 2.]*

Jadi, papan A bernilai tiga, dan papan B bernilai dua. Jawabannya adalah B.
*[Visual: Kartu jawaban "B. A = 3, B = 2".]*

## 4. Penutup

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, berdirilah di papan, lalu lihat pohon satu per satu. Kedua, ingat pohon paling tinggi yang sudah kamu lihat. Ketiga, hitung pohon yang lebih tinggi dari pohon itu.
*[Visual: Tiga kartu langkah.]*

Komputer juga sering bekerja seperti ini. Komputer memeriksa data satu per satu, sambil mengingat nilai yang paling besar sejauh ini.
*[Visual: Deretan angka diperiksa satu per satu dengan kotak "terbesar sejauh ini".]*

Terima kasih kepada tim Bebras Swiss yang membuat soal ini. Selamat berlatih, dan sampai jumpa di soal berikutnya!
*[Visual: Kartu TERIMA KASIH; Kiko melambai.]*

## Short (vertikal)

Berang-berang menanam empat pohon dalam satu baris. Dari setiap papan, ia menghitung pohon yang terlihat. Pohon yang lebih pendek tersembunyi di balik pohon yang lebih tinggi.

Berapa angka di papan A dan di papan B? Coba pikirkan dulu.

Dari papan A, terlihat pohon kecil, pohon besar, dan pohon paling besar. Jadi, papan A tiga.

Dari papan B, terlihat pohon sedang dan pohon paling besar. Jadi, papan B dua. Jawabannya adalah B!

Mau melihat cara menghitungnya pelan-pelan? Tonton pembahasan lengkapnya, ya! Soal ini dibuat oleh tim Bebras Swiss.
