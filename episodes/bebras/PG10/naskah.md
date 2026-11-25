# Pembahasan Soal Bebras Penegak: Dua Berang-berang Pekerja (2018-LT-04)

Video pembahasan untuk kategori **Penegak (SMA)**, seri "Pembahasan Soal Bebras" (kode PG10). Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan. Suara Kak Ceria, kecepatan 0,95 (intro1 dan intro2 dipakai ulang dari PG08).

Soal asli: "Dua Berang-berang Pekerja", Tantangan Bebras 2018, usulan Lituania (kode I-2018-LT-04), dari Buku Tantangan Bebras Indonesia 2018 tingkat SMA (Penegak). Skema tugas dan garis waktu digambar ulang dengan kode.

**Isi soal:** Delapan tugas A(2), B(3), C(5), D(7), E(10), F(9), G(4), H(6) jam. Urutan: E setelah A dan B; H setelah E; F setelah C; G setelah D. Dua berang-berang bekerja bersamaan. Aturan "pilih tugas terbesar" menghasilkan 32 jam (berang-berang 1: D, G, B, A, menganggur, H; berang-berang 2: C, F, menganggur, E, menganggur). Tentukan waktu paling singkat (bilangan 1–99).

**Jawaban: 23.** Total jam kerja 46; dua pekerja, jadi minimal 23 jam, dan 23 hanya tercapai bila tidak ada yang menganggur. Jadwal: berang-berang 1 A 0–2, C 2–7, E 7–17, H 17–23; berang-berang 2 B 0–3, D 3–10, F 10–19, G 19–23. Semua syarat urutan terpenuhi (diperiksa di scenes.js).

Ada satu jeda "pikirkan dulu".

## 0. Pembuka dan soal

Halo, teman-teman! Aku Kiko. Selamat datang di pembahasan soal Tantangan Bebras. Tantangan Bebras adalah lomba berpikir yang diikuti pelajar dari seluruh dunia.
*[Visual: Papan tulis putih; tulisan "Tantangan Bebras"; mesin makanan kecil dengan ban berjalan; Kiko melambai.]*

Kali ini, kita akan membahas satu soal Bebras untuk tingkat SMA. Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Dua Berang-berang Pekerja". Soal ini berasal dari Tantangan Bebras tahun dua ribu delapan belas, dan dibuat oleh tim Bebras dari negara Lituania.
*[Visual: Bola dunia, bendera Lituania; kartu ASAL SOAL: judul, Bebras 2018, tim Bebras Lituania (dilingkari), kode 2018-LT-04, sumber buku Tantangan Bebras Indonesia 2018.]*

Setelah menonton video ini, kamu bisa menyusun jadwal kerja tercepat untuk dua pekerja, dan membuktikan bahwa jadwal itu memang tidak bisa dipercepat lagi.
*[Visual: Kartu judul "Dua Berang-berang Pekerja" dengan kalimat kait.]*

Sebelum membahasnya, mari kita pahami soalnya dulu. Dua berang-berang sedang membangun bendungan. Mereka harus mengerjakan delapan tugas, yang diberi nama A sampai H, misalnya memotong pohon, memotong cabang, dan merakit batang kayu.
*[Visual: Dua berang-berang; delapan kotak tugas A–H muncul.]*

Setiap tugas butuh waktu yang berbeda. Tugas A butuh dua jam, B tiga jam, C lima jam, D tujuh jam, E sepuluh jam, F sembilan jam, G empat jam, dan H enam jam.
*[Visual: Lama setiap tugas muncul di kotaknya.]*

Beberapa tugas harus menunggu tugas lain selesai. Tugas E baru bisa dimulai setelah A dan B selesai. Tugas H menunggu E. Tugas F menunggu C, dan tugas G menunggu D.
*[Visual: Panah urutan: A, B ke E; E ke H; C ke F; D ke G.]*

Kedua berang-berang bekerja bersamaan, tetapi setiap berang-berang hanya mengerjakan satu tugas pada satu waktu. Kita gambar pekerjaan mereka di garis waktu, satu baris untuk setiap berang-berang.
*[Visual: Garis waktu dua baris (berang-berang 1 dan 2) dengan skala jam.]*

Para berang-berang memakai aturan sederhana. Kalau ada beberapa tugas yang siap dikerjakan, mereka memilih tugas yang paling lama. Dengan aturan ini, semua pekerjaan selesai dalam tiga puluh dua jam.
*[Visual: Kartu aturan "pilih tugas terlama" dan angka 32 jam.]*

Pertanyaannya adalah, berapa jam waktu paling singkat untuk menyelesaikan semua tugas? Jawabannya berupa sebuah bilangan.
*[Visual: Kartu pertanyaan "Paling cepat berapa jam?".]*

## 1. Mencoba aturan tugas terlama

Mari kita lihat dulu jadwal tiga puluh dua jam itu. Di jam nol, tugas yang siap adalah A, B, C, dan D. Berang-berang pertama mengambil D, yang paling lama, yaitu tujuh jam. Berang-berang kedua mengambil C, yaitu lima jam.
*[Visual: Kotak D (0–7) di baris 1, C (0–5) di baris 2.]*

Di jam lima, berang-berang kedua selesai, dan F sudah siap. F adalah tugas terlama, jadi ia mengerjakan F sampai jam empat belas. Di jam tujuh, berang-berang pertama mengambil G, lalu B, lalu A, sampai jam enam belas.
*[Visual: F (5–14), G (7–11), B (11–14), A (14–16).]*

Masalahnya muncul di sini. Tugas E baru bisa dimulai di jam enam belas, setelah A selesai. Berang-berang kedua menunggu selama dua jam. Lalu, selama sepuluh jam E dikerjakan, berang-berang pertama tidak punya tugas sama sekali.
*[Visual: E (16–26) di baris 2; bagian menganggur diarsir merah.]*

Akhirnya, H dikerjakan dari jam dua puluh enam sampai jam tiga puluh dua. Jadi, banyak waktu terbuang karena berang-berang menganggur. Kalau kita jumlahkan, waktu menganggurnya delapan belas jam.
*[Visual: H (26–32); tulisan "menganggur 18 jam".]*

## 2. Berapa batas tercepatnya?

Sekarang, mari kita jumlahkan semua jam kerja. Dua tambah tiga tambah lima tambah tujuh tambah sepuluh tambah sembilan tambah empat tambah enam, hasilnya empat puluh enam jam.
*[Visual: Penjumlahan 2+3+5+7+10+9+4+6 = 46.]*

Pekerjaan empat puluh enam jam itu dibagi untuk dua berang-berang. Kalau dibagi sama rata, masing-masing bekerja dua puluh tiga jam. Kalau tidak sama rata, salah satunya bekerja lebih lama lagi. Jadi, tidak ada jadwal yang selesai lebih cepat dari dua puluh tiga jam.
*[Visual: 46 : 2 = 23; tulisan "tidak mungkin kurang dari 23 jam".]*

Apakah dua puluh tiga jam benar-benar bisa dicapai? Syaratnya, kedua berang-berang tidak boleh menganggur sama sekali. Coba susun jadwalnya. Pikirkan dulu.
*[Visual: Jam pasir PIKIRKAN DULU; garis waktu kosong dengan batas 23 jam.]*

## 3. Menyusun jadwal 23 jam

Kuncinya, tugas E dan F yang paling lama harus dibagi ke dua berang-berang yang berbeda. Selain itu, E harus dimulai secepat mungkin, karena H masih menunggu di belakangnya.
*[Visual: E dan F disorot pada skema; E–H ditandai sebagai rantai terpanjang.]*

Berang-berang pertama mengerjakan A selama dua jam, lalu C sampai jam tujuh. Berang-berang kedua mengerjakan B selama tiga jam, lalu D sampai jam sepuluh.
*[Visual: A (0–2), C (2–7) di baris 1; B (0–3), D (3–10) di baris 2.]*

Di jam tujuh, A dan B sudah selesai, jadi berang-berang pertama bisa mengerjakan E sampai jam tujuh belas. Di jam sepuluh, C sudah selesai, jadi berang-berang kedua mengerjakan F sampai jam sembilan belas.
*[Visual: E (7–17) di baris 1; F (10–19) di baris 2.]*

Terakhir, berang-berang pertama mengerjakan H dari jam tujuh belas sampai jam dua puluh tiga. Berang-berang kedua mengerjakan G, yang sudah siap sejak D selesai, dari jam sembilan belas sampai jam dua puluh tiga.
*[Visual: H (17–23) di baris 1; G (19–23) di baris 2.]*

Mari kita periksa. Setiap tugas dimulai setelah tugas yang ditunggunya selesai, dan kedua berang-berang tidak pernah menganggur. Keduanya selesai tepat di jam dua puluh tiga.
*[Visual: Centang di setiap syarat urutan; garis selesai di jam 23.]*

Jadi, jawabannya adalah dua puluh tiga jam.
*[Visual: Kartu jawaban "23 jam".]*

Aturan memilih tugas terlama terdengar masuk akal. Tetapi, pada soal ini hasilnya tiga puluh dua jam, sembilan jam lebih lambat daripada jadwal terbaik.
*[Visual: Dua garis waktu dibandingkan: 32 jam dan 23 jam.]*

## 4. Penutup

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, gambarlah tugas dan urutannya, lalu susun jadwal di garis waktu. Kedua, hitung batas tercepatnya, yaitu jumlah semua jam kerja dibagi banyak pekerja. Ketiga, cari jadwal yang tidak pernah menganggur supaya batas itu tercapai.
*[Visual: Tiga kartu langkah muncul satu per satu.]*

Aturan yang selalu mengambil pilihan terbaik saat itu disebut algoritma greedy, atau algoritma serakah. Algoritma greedy cepat dan sering cukup baik, tetapi tidak selalu memberi jawaban terbaik. Komputer juga menghadapi masalah ini saat membagi pekerjaan ke beberapa prosesor.
*[Visual: Tulisan "algoritma greedy"; gambar prosesor dengan beberapa inti.]*

Jadi, waktu paling singkat untuk membangun bendungan adalah dua puluh tiga jam.
*[Visual: Garis waktu 23 jam.]*

Terima kasih kepada tim Bebras Lituania yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!
*[Visual: Kartu TERIMA KASIH dengan kredit soal; Kiko melambai.]*

## Short (vertikal)

Dua berang-berang harus mengerjakan delapan tugas, dan ada tugas yang harus menunggu tugas lain selesai. Kalau mereka selalu memilih tugas terlama, pekerjaan selesai dalam tiga puluh dua jam.

Berapa jam waktu paling singkat yang mungkin? Coba pikirkan dulu.

Jumlahkan semua jam kerja, hasilnya empat puluh enam jam. Karena ada dua berang-berang, paling cepat dua puluh tiga jam.

Jadwal ini mencapainya. Tugas E dan F dipegang berang-berang yang berbeda, dan tidak ada yang menganggur.

Jadi, jawabannya adalah dua puluh tiga jam. Memilih tugas terlama ternyata tidak selalu yang terbaik!

Tonton pembahasan lengkapnya, ya! Soal ini dibuat oleh tim Bebras Lituania.
