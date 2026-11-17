# Pembahasan Soal Bebras Siaga: Permen Loli dan Sikat Gigi (2017-IE-01)

Video pembahasan untuk kategori **Siaga (kelas 4–6 SD)**, seri "Pembahasan Soal Bebras" (kode SG11). Bahasanya semudah kategori SiKecil. Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan. Suara Kak Ceria, kecepatan 0,9 (intro1 dan intro2 dipakai ulang dari SG07).

Soal asli: "Permen Loli dan Sikat Gigi", Tantangan Bebras 2017, usulan Irlandia (kode I-2017-IE-01), dari Buku Tantangan Bebras Indonesia 2017 tingkat SD (Siaga). Lorong, permen loli, sikat gigi, dan berang-berang digambar ulang dengan kode.

**Isi soal:** Lorong 11 kotak: loli, sikat, loli, loli, sikat, sikat, loli, loli, loli, sikat, loli. Berjalan ke kanan, tidak boleh mundur; di setiap kotak boleh makan loli, menggosok gigi, atau lewat; tidak boleh membawa barang. Setelah makan dua loli, harus menggosok gigi sebelum makan lagi. Berapa loli paling banyak? (3, 5, 6, 7)

**Jawaban: 6** (kotak 1, 3, 4, 7, 8, 11; kotak 9 dilewati). Dihitung ulang di scenes.js, termasuk pemeriksaan semua cara (2^7) bahwa 7 tidak mungkin; K._warn bila berbeda.

Ada satu jeda "pikirkan dulu".

## 0. Pembuka dan soal

Halo, teman-teman! Aku Kiko. Apakah kamu pernah mendengar Tantangan Bebras? Tantangan Bebras adalah lomba berpikir yang seru untuk anak-anak di seluruh dunia.
*[Visual: Papan tulis putih; tulisan "Tantangan Bebras" ditulis spidol; empat berang-berang muncul; Kiko di kiri.]*

Hari ini, kita akan mengerjakan satu soal Bebras untuk kelas empat, lima, dan enam. Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Permen Loli dan Sikat Gigi". Soal ini berasal dari Tantangan Bebras tahun dua ribu tujuh belas, dan dibuat oleh tim Bebras dari Irlandia.
*[Visual: Bola dunia, bendera Irlandia; kartu ASAL SOAL.]*

Setelah menonton video ini, kamu bisa mencari hasil terbanyak, tetapi tetap menaati aturan yang diberikan.
*[Visual: Kartu judul.]*

Sebelum membahasnya, mari kita pahami soalnya dulu. Seekor berang-berang menemukan sebuah lorong. Lorong itu terdiri dari sebelas kotak. Setiap kotak berisi permen loli atau sikat gigi.
*[Visual: Lorong 11 kotak berisi permen loli dan sikat gigi.]*

Berang-berang berjalan dari kiri ke kanan, dan tidak boleh mundur. Di setiap kotak, ia boleh makan permen loli, menggosok gigi, atau hanya lewat saja. Ia tidak boleh membawa permen loli atau sikat gigi ke kotak berikutnya.
*[Visual: Panah ke kanan; tiga pilihan: makan, gosok gigi, lewat.]*

Ada satu aturan penting. Setelah makan dua permen loli, ia harus menggosok gigi dulu, sebelum boleh makan permen loli lagi.
*[Visual: Kartu aturan: 2 loli → gosok gigi dulu.]*

Pertanyaannya adalah, berapa permen loli paling banyak yang bisa dimakan berang-berang, dengan tetap menaati aturan itu? Pilihannya adalah tiga, lima, enam, atau tujuh. Coba pikirkan dulu, ya.
*[Visual: Pilihan 3, 5, 6, 7; jam pasir PIKIRKAN DULU.]*

## 1. Berjalan kotak demi kotak

Kita pakai sebuah penghitung. Penghitung ini menunjukkan berapa permen loli yang sudah dimakan sejak terakhir kali menggosok gigi. Kalau penghitungnya sudah dua, berang-berang tidak boleh makan lagi.
*[Visual: Kartu penghitung dengan dua tempat.]*

Kotak pertama berisi permen loli. Penghitungnya masih nol, jadi berang-berang memakannya. Kotak kedua berisi sikat gigi, jadi ia menggosok gigi, dan penghitungnya kembali menjadi nol.
*[Visual: Kotak 1 makan, kotak 2 gosok.]*

Kotak ketiga dan keempat berisi permen loli. Berang-berang memakan keduanya, jadi penghitungnya menjadi dua. Untungnya, kotak kelima berisi sikat gigi. Ia menggosok gigi, dan penghitungnya kembali nol. Kotak keenam juga berisi sikat gigi, jadi ia menggosok gigi lagi.
*[Visual: Kotak 3–4 makan, kotak 5–6 gosok.]*

Kotak ketujuh dan kedelapan berisi permen loli. Berang-berang memakan keduanya, dan penghitungnya menjadi dua. Kotak kesembilan juga berisi permen loli, tetapi ia belum menggosok gigi. Jadi, permen loli itu harus dilewati.
*[Visual: Kotak 7–8 makan, kotak 9 lewat.]*

Kotak kesepuluh berisi sikat gigi, jadi ia menggosok gigi. Kotak kesebelas berisi permen loli, dan berang-berang memakannya.
*[Visual: Kotak 10 gosok, kotak 11 makan.]*

Mari kita hitung. Satu, dua, tiga, empat, lima, enam. Berang-berang memakan enam permen loli. Jadi, jawabannya adalah enam.
*[Visual: Permen loli yang dimakan diberi nomor 1–6; kartu jawaban.]*

## 2. Mengapa tidak bisa tujuh?

Apakah ia bisa makan tujuh permen loli? Di lorong ini, ada tujuh permen loli. Kalau ingin makan tujuh, berarti semua permen loli harus dimakan.
*[Visual: Ketujuh permen loli dilingkari.]*

Tetapi lihat kotak ketujuh, kedelapan, dan kesembilan. Ada tiga permen loli berturut-turut, tanpa sikat gigi di antaranya. Paling banyak, hanya dua yang boleh dimakan. Jadi, tujuh tidak mungkin, dan enam adalah yang paling banyak.
*[Visual: Kurung merah di kotak 7–9: "3 loli berturut-turut".]*

## 3. Penutup

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, pahami aturannya dengan teliti. Kedua, berjalan kotak demi kotak sambil memakai penghitung. Ketiga, periksa apakah hasil yang lebih besar mungkin dicapai.
*[Visual: Tiga kartu langkah.]*

Aturan seperti ini disebut batasan. Komputer juga sering mencari hasil terbaik sambil menaati batasan. Misalnya, menyusun jadwal pelajaran supaya tidak bentrok, atau mengisi tas tanpa melebihi berat yang boleh dibawa.
*[Visual: Kartu batasan: jadwal tidak bentrok, tas tidak terlalu berat.]*

Terima kasih kepada tim Bebras Irlandia yang membuat soal ini. Selamat berlatih, dan sampai jumpa di soal berikutnya!
*[Visual: Kartu TERIMA KASIH; Kiko melambai.]*

## Short (vertikal)

Berang-berang berjalan dari kiri ke kanan. Di setiap kotak, ia boleh makan permen loli, menggosok gigi, atau lewat saja. Setelah makan dua permen loli, ia harus menggosok gigi dulu.

Berapa permen loli paling banyak yang bisa dimakannya? Coba pikirkan dulu.

Makan permen loli setiap kali boleh, tetapi berhenti setelah dua, sampai bertemu sikat gigi. Karena itu, kotak kesembilan harus dilewati.

Jadi, ia makan enam permen loli. Tujuh tidak mungkin, karena ada tiga permen loli berturut-turut. Jawabannya adalah enam!

Mau melihat langkahnya kotak demi kotak? Tonton pembahasan lengkapnya, ya! Soal ini dibuat oleh tim Bebras Irlandia.
