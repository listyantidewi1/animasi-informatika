# Pembahasan Soal Bebras Penegak: Mesin Makanan Bebravy (2025-PK-03)

Video pembahasan ±12,5 menit untuk kategori **Penegak (SMA)**, seri "Pembahasan Soal Bebras" (kode PG08). Diproduksi langsung tanpa menunggu persetujuan naskah (Bu Dewi tidur, 11 Nov 2026). Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan.

Soal asli: "Mesin Makanan Bebravy", Bebras 2025, usulan Pakistan (kode 2025-PK-03). Judul asli berbahasa Inggris tidak ada di berkas, jadi dipakai judul Indonesia. Semua gambar (bahan, hidangan, mesin, ban berjalan) digambar ulang dengan kode. Nama hidangan disesuaikan dengan ikonnya: nasi goreng (ikon mangkuk di soal), sate, burger, roti lapis, salad.

**Isi soal:** Lima resep: nasi-cabai-bawang = nasi goreng; cabai-bawang-tomat-daging = sate; timun-selada-tomat-keju-daging-roti = burger; keju-daging-roti = roti lapis; timun-selada-tomat = salad. Bahan harus berurutan persis, tidak boleh dilewati, sekali pakai; bahan yang tidak dipakai keluar apa adanya. Ban berjalan (22 bahan, dibaca dari gambar soal yang diperbesar): nasi, cabai, bawang, tomat, daging, timun, selada, tomat, tomat, keju, daging, roti, tomat, nasi, cabai, bawang, timun, selada, tomat, keju, daging, roti. Berapa jumlah keluaran paling sedikit? Pilihan: 7, 10, 9, 8.

**Jawaban: 8** (pilihan keempat).

**Telaah jawaban (diperiksa dengan program pemrograman dinamis, 11 Nov):**

1. Semua kecocokan: nasi goreng 1–3 dan 14–16; sate 2–5; salad 6–8 dan 17–19; roti lapis 10–12 dan 20–22; burger 17–22. Tomat 9 dan 13 tidak masuk kecocokan mana pun, jadi pasti sisa dan membagi ban menjadi tiga bagian bebas.
2. Bagian kiri (1–8): nasi goreng dan sate berebut cabai 2 dan bawang 3. Nasi goreng → 4 keluaran (nasi goreng, tomat, daging, salad); sate → 3 (nasi, sate, salad). Minimum 3.
3. Bagian tengah (10–12): roti lapis = 1. Bagian kanan (14–22): nasi goreng + burger = 2; tidak bisa 1 karena resep terpanjang 6 bahan.
4. Total minimum 3 + 1 + 1 + 1 + 2 = 8 (cek: 22 − (3 + 2 + 2 + 2 + 5) = 8). Susunan optimal unik: nasi | sate | salad | tomat | roti lapis | tomat | nasi goreng | burger.

Jebakan yang dibahas: cara greedy (pakai resep pertama yang cocok dari kiri) memberi 9; bila di akhir memilih salad + roti lapis alih-alih burger, hasilnya 10. Keduanya ada di pilihan jawaban.

Warna tetap: nasi goreng oranye, sate merah, burger ungu, roti lapis biru, salad hijau. Satu jeda "pikirkan dulu" ±6 detik. Suara: Kak Ceria, Eleven v4, speed 0,95 (intro1, intro2, c4 dipakai ulang dari PG02).

---


## 0. Pembuka dan soal

Halo, teman-teman! Aku Kiko. Selamat datang di pembahasan soal Tantangan Bebras. Tantangan Bebras adalah lomba berpikir yang diikuti pelajar dari seluruh dunia.
*[Visual: Papan tulis putih; tulisan "Tantangan Bebras"; mesin makanan kecil dengan ban berjalan; Kiko melambai.]*

Kali ini, kita akan membahas satu soal Bebras untuk tingkat SMA. Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Mesin Makanan Bebravy". Soal ini berasal dari Bebras tahun dua ribu dua puluh lima, dan dibuat oleh tim Bebras dari negara Pakistan.
*[Visual: Bola dunia, bendera Pakistan; kartu ASAL SOAL: judul, tahun, tim Bebras Pakistan (dilingkari), kode 2025-PK-03.]*

Setelah menonton video ini, kamu bisa mencari cara mengolah bahan yang menghasilkan keluaran paling sedikit. Kamu juga bisa membuktikan bahwa tidak ada cara yang lebih baik.
*[Visual: Kartu judul dengan kalimat kait.]*

Sebelum membahasnya, mari kita lihat soalnya dulu. Sebuah perusahaan makanan mempunyai mesin khusus untuk menyiapkan hidangan. Mesin itu memeriksa bahan-bahan yang masuk, lalu mencoba mencocokkannya dengan resep.
*[Visual: Mesin besar; bahan masuk dari ban berjalan kiri, hidangan keluar di kanan.]*

Mesin itu mengenal lima resep. Nasi, cabai, dan bawang menjadi nasi goreng. Cabai, bawang, tomat, dan daging menjadi sate. Timun, selada, tomat, keju, daging, dan roti menjadi burger. Keju, daging, dan roti menjadi roti lapis. Terakhir, timun, selada, dan tomat menjadi salad.
*[Visual: Daftar 9 bahan berlabel di atas; lima baris resep muncul satu per satu (bahan berurutan = hidangan).]*

Setiap resep harus dicocokkan dengan tepat. Bahan-bahannya harus berurutan persis seperti di resep, dan mesin tidak boleh melewatkan satu bahan pun. Setelah dipakai, sebuah bahan tidak dapat dipakai lagi.
*[Visual: Kartu aturan: urutan persis (salad terbalik disilang), tidak boleh melompati bahan (bawang di tengah disilang), sekali pakai.]*

Bahan yang tidak dipakai untuk resep apa pun akan keluar dari mesin tanpa berubah. Jadi, setiap bahan yang tersisa juga dihitung sebagai satu keluaran.
*[Visual: Kartu aturan keempat: bahan sisa keluar apa adanya = 1 keluaran.]*

Ini contohnya. Masukannya adalah nasi, cabai, bawang, bawang, timun, selada, dan tomat. Nasi, cabai, dan bawang yang pertama menjadi nasi goreng. Bawang kedua tidak cocok dengan resep mana pun, jadi bawang itu keluar apa adanya. Timun, selada, dan tomat menjadi salad.
*[Visual: Tujuh bahan berjajar; kurung merah muda (nasi goreng), bawang sendiri, kurung hijau (salad); keluaran di bawah.]*

Jadi, tujuh bahan itu menghasilkan tiga keluaran, yaitu nasi goreng, sebutir bawang, dan salad.
*[Visual: Keluaran diberi nomor 1, 2, 3; tulisan "7 bahan → 3 keluaran".]*

Sekarang, inilah tantangannya. Ada dua puluh dua bahan yang ditaruh di ban berjalan. Kita membacanya dari kiri ke kanan, sama seperti resep dan contohnya.
*[Visual: Ban berjalan dengan 22 bahan (digambar besar), panah baca kiri → kanan.]*

Pertanyaannya adalah, berapa jumlah keluaran paling sedikit yang dapat dihasilkan mesin? Keluaran itu terdiri atas hidangan dan bahan yang tidak diolah. Pilihannya adalah tujuh, sepuluh, sembilan, atau delapan.
*[Visual: Ban berjalan kecil di atas; pertanyaan; empat pilihan 7, 10, 9, 8.]*

Ayo kita cari jawabannya bersama-sama. Kita tidak akan menebak, tetapi kita akan membuktikannya.
*[Visual: Belum ada pilihan yang ditandai; Kiko.]*


## 1. Menghitung keluaran

Sebelum mulai, mari kita perhatikan satu hal penting. Setiap keluaran dihitung satu, baik berupa hidangan maupun bahan yang tidak diolah.
*[Visual: Tulisan "1 hidangan = 1 keluaran", "1 bahan sisa = 1 keluaran".]*

Kalau tidak ada resep yang dipakai, dua puluh dua bahan menghasilkan dua puluh dua keluaran. Setiap kali sebuah resep dipakai, beberapa bahan bergabung menjadi satu hidangan, sehingga jumlah keluaran berkurang.
*[Visual: "tanpa resep: 22 bahan → 22 keluaran".]*

Berapa banyak berkurangnya? Kalau resepnya memakai tiga bahan, tiga keluaran berubah menjadi satu. Jadi, jumlah keluaran berkurang dua.
*[Visual: Tiga bahan bergabung menjadi satu hidangan: 3 → 1, "berkurang 2".]*

Kita sebut angka ini sebagai penghematan. Nasi goreng, roti lapis, dan salad masing-masing memakai tiga bahan, jadi penghematannya dua. Sate memakai empat bahan, jadi penghematannya tiga. Burger memakai enam bahan, jadi penghematannya lima.
*[Visual: Tabel hidangan, banyak bahan, hemat: nasi goreng 3/2, roti lapis 3/2, salad 3/2, sate 4/3, burger 6/5.]*

Jadi, tugas kita adalah memilih resep-resep yang total penghematannya paling besar. Jumlah keluaran sama dengan dua puluh dua dikurangi total penghematan.
*[Visual: Rumus: keluaran = 22 − total hemat.]*

Coba periksa rumus ini dengan contoh tadi. Ada tujuh bahan, lalu nasi goreng menghemat dua dan salad juga menghemat dua. Tujuh dikurangi empat sama dengan tiga keluaran, dan hasilnya cocok.
*[Visual: Contoh: 7 − (2 + 2) = 3 (centang).]*


## 2. Cara cepat yang menjebak

Sekarang, mari kita coba cara yang paling cepat terpikir. Kita baca bahan dari kiri, dan setiap kali ada resep yang cocok, kita langsung memakainya.
*[Visual: Ban 22 bahan bernomor; penunjuk di bahan 1.]*

Tiga bahan pertama adalah nasi, cabai, dan bawang. Itu cocok dengan nasi goreng, jadi kita langsung membuat nasi goreng. Lalu, tomat dan daging tidak bisa membentuk resep apa pun, jadi keduanya keluar apa adanya.
*[Visual: Kurung nasi goreng 1–3; tomat 4 dan daging 5 diberi tanda sisa.]*

Berikutnya, timun, selada, dan tomat menjadi salad. Tomat yang berikutnya tersisa. Keju, daging, dan roti menjadi roti lapis, lalu satu tomat tersisa lagi.
*[Visual: Salad 6–8, tomat 9 sisa, roti lapis 10–12, tomat 13 sisa.]*

Di bagian akhir, nasi, cabai, dan bawang menjadi nasi goreng. Setelah itu, timun, selada, dan tomat bisa menjadi salad, tetapi keenam bahan terakhir juga bisa menjadi burger. Kalau kita memilih salad lalu roti lapis, hasilnya malah sepuluh keluaran. Burger lebih hemat, jadi kita memilih burger.
*[Visual: Nasi goreng 14–16; dua kemungkinan di 17–22: salad + roti lapis (10, abu-abu) atau burger (dipilih).]*

Dengan cara cepat ini, hasilnya adalah sembilan keluaran. Apakah sembilan sudah paling sedikit? Hentikan videonya sebentar, lalu coba cari cara yang lebih baik.
*[Visual: Penghitung keluaran 9; jam pasir PIKIRKAN DULU ±6 detik.]*


## 3. Menandai semua resep yang cocok

Supaya tidak terjebak, kita tidak langsung memakai resep pertama yang cocok. Kita tandai dulu semua tempat di ban berjalan yang cocok dengan sebuah resep. Agar mudah, setiap bahan diberi nomor dari satu sampai dua puluh dua.
*[Visual: Ban bernomor 1–22, belum ada tanda.]*

Nasi goreng cocok di bahan satu sampai tiga, dan juga di bahan empat belas sampai enam belas. Sate cocok di bahan dua sampai lima.
*[Visual: Kurung warna nasi goreng (1–3, 14–16) dan sate (2–5) di bawah ban, bertumpuk bila bertabrakan.]*

Salad cocok di bahan enam sampai delapan, dan di bahan tujuh belas sampai sembilan belas. Roti lapis cocok di bahan sepuluh sampai dua belas, dan di bahan dua puluh sampai dua puluh dua. Burger hanya cocok di bahan tujuh belas sampai dua puluh dua.
*[Visual: Kurung salad, roti lapis, burger.]*

Sekarang, perhatikan tomat nomor sembilan dan tomat nomor tiga belas. Kedua tomat itu tidak termasuk dalam tanda mana pun. Jadi, keduanya pasti keluar apa adanya, bagaimana pun cara kita memilih.
*[Visual: Tomat 9 dan 13 dilingkari merah: "pasti sisa".]*

Kedua tomat itu membagi ban berjalan menjadi tiga bagian. Bagian kiri adalah bahan satu sampai delapan. Bagian tengah adalah bahan sepuluh sampai dua belas. Bagian kanan adalah bahan empat belas sampai dua puluh dua. Kita bisa mengurus setiap bagian secara terpisah.
*[Visual: Garis pemisah di 9 dan 13; label Bagian kiri, tengah, kanan.]*


## 4. Menyusun pilihan terbaik

Mari kita mulai dari bagian kiri. Di sini, nasi goreng dan sate sama-sama membutuhkan cabai dan bawang nomor dua dan tiga. Karena setiap bahan hanya bisa dipakai sekali, kita harus memilih salah satunya.
*[Visual: Bagian kiri (1–8) diperbesar; cabai 2 dan bawang 3 disorot sebagai rebutan.]*

Kalau kita memilih nasi goreng, tomat dan daging tersisa. Bagian kiri menghasilkan nasi goreng, tomat, daging, dan salad, yaitu empat keluaran.
*[Visual: Pilihan A: nasi goreng + tomat + daging + salad = 4.]*

Kalau kita memilih sate, hanya nasi yang tersisa. Bagian kiri menghasilkan nasi, sate, dan salad, yaitu tiga keluaran. Jadi, sate adalah pilihan yang lebih baik.
*[Visual: Pilihan B: nasi + sate + salad = 3 (dicentang).]*

Bagian tengah hanya berisi keju, daging, dan roti. Ketiganya menjadi satu roti lapis.
*[Visual: Bagian tengah: roti lapis = 1.]*

Di bagian kanan, nasi, cabai, dan bawang menjadi nasi goreng. Enam bahan sisanya menjadi burger. Jadi, sembilan bahan di bagian kanan menjadi dua hidangan saja.
*[Visual: Bagian kanan: nasi goreng + burger = 2.]*

Sekarang, kita jumlahkan semuanya. Bagian kiri menghasilkan tiga keluaran, dan tomat nomor sembilan menghasilkan satu keluaran. Bagian tengah menghasilkan satu keluaran, tomat nomor tiga belas menghasilkan satu keluaran, dan bagian kanan menghasilkan dua keluaran. Tiga ditambah satu ditambah satu ditambah satu ditambah dua sama dengan delapan.
*[Visual: Baris keluaran lengkap: nasi, sate, salad, tomat, roti lapis, tomat, nasi goreng, burger; 3 + 1 + 1 + 1 + 2 = 8.]*

Kita juga bisa memeriksanya dengan penghematan. Sate menghemat tiga, salad menghemat dua, roti lapis menghemat dua, nasi goreng menghemat dua, dan burger menghemat lima. Totalnya empat belas, dan dua puluh dua dikurangi empat belas sama dengan delapan.
*[Visual: 3 + 2 + 2 + 2 + 5 = 14; 22 − 14 = 8 (centang).]*


## 5. Mengapa tujuh tidak mungkin

Apakah ada cara yang menghasilkan tujuh keluaran? Mari kita periksa setiap bagian sekali lagi.
*[Visual: Judul "Bisakah 7?"; tiga bagian dan dua tomat.]*

Dua tomat tadi pasti menjadi dua keluaran. Bagian tengah paling sedikit menghasilkan satu keluaran. Bagian kanan berisi sembilan bahan, padahal resep terpanjang hanya memakai enam bahan. Jadi, bagian kanan paling sedikit menghasilkan dua keluaran.
*[Visual: Kotak minimum: tomat 1 + 1, tengah ≥ 1, kanan ≥ 2 (9 bahan > 6).]*

Di bagian kiri, kita hanya bisa memilih nasi goreng atau sate, dan kita sudah mencoba keduanya. Hasil terbaiknya adalah tiga keluaran. Kalau salad tidak dipakai, hasilnya malah lebih banyak.
*[Visual: Kiri ≥ 3.]*

Jadi, paling sedikit ada tiga ditambah satu ditambah satu ditambah satu ditambah dua, yaitu delapan keluaran. Tujuh keluaran tidak mungkin dicapai.
*[Visual: 3 + 1 + 1 + 1 + 2 = 8; "7 tidak mungkin".]*


## 6. Memilih jawaban

Sekarang, mari kita lihat lagi pilihan jawabannya. Tujuh tidak mungkin, karena kita sudah membuktikan bahwa paling sedikit ada delapan keluaran.
*[Visual: Pilihan 7 dicoret.]*

Sembilan dan sepuluh memang bisa terjadi, misalnya dengan cara cepat tadi. Tetapi, keduanya bukan jumlah yang paling sedikit.
*[Visual: 9 dan 10: "bisa, tetapi bukan yang paling sedikit".]*

Jadi, jawaban yang benar adalah delapan.
*[Visual: Pilihan 8 dilingkari hijau.]*

Jawaban ini pasti benar, karena kita melakukan dua hal. Pertama, kita menunjukkan cara yang menghasilkan delapan keluaran. Kedua, kita membuktikan bahwa tujuh keluaran tidak mungkin.
*[Visual: Dua kotak: CONTOH (cara 8 keluaran) + BUKTI (7 tidak mungkin).]*


## 7. Penutup

Cara berpikir seperti ini juga dipakai di komputer. Program kompresi data, misalnya pembuat file ZIP, mengganti rangkaian data yang sering muncul dengan satu kode pendek. Tujuannya sama dengan soal ini, yaitu membuat hasilnya sependek mungkin.
*[Visual: Deretan huruf; rangkaian berulang diganti satu kotak kode; panjang berkurang.]*

Soal ini juga menunjukkan bahwa cara cepat yang langsung mengambil pilihan pertama tidak selalu memberi hasil terbaik. Cara seperti itu disebut algoritma greedy. Karena itu, kita perlu membandingkan pilihan-pilihan yang saling berebut bahan.
*[Visual: Tulisan "algoritma greedy: 9" vs "bandingkan pilihan: 8".]*

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, tandai semua tempat yang cocok dengan pola. Kedua, cari bagian yang saling berebut, lalu bandingkan pilihannya. Ketiga, buktikan bahwa jawaban yang lebih kecil tidak mungkin.
*[Visual: Tiga kartu langkah.]*

Terima kasih kepada tim Bebras Pakistan yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!
*[Visual: Kiko dan mesin; kartu kredit: judul, Bebras 2025, kontributor Pakistan, kode 2025-PK-03, gambar digambar ulang.]*

---

## Short (±1:41)

Mesin makanan ini mencocokkan bahan-bahan yang masuk dengan lima resep. Bahan harus berurutan persis seperti di resep, tidak boleh dilewati, dan setiap bahan hanya dipakai sekali.

Bahan yang tidak masuk resep apa pun keluar apa adanya. Jadi, setiap hidangan dan setiap bahan sisa dihitung sebagai satu keluaran.

Sekarang, dua puluh dua bahan ini masuk ke mesin. Berapa jumlah keluaran paling sedikit? Coba pikirkan dulu.

Kalau kita langsung memakai resep pertama yang cocok dari kiri, hasilnya sembilan keluaran. Ternyata, ada cara yang lebih baik.

Tandai dulu semua tempat yang cocok dengan resep. Tomat nomor sembilan dan tomat nomor tiga belas tidak termasuk resep mana pun, jadi keduanya pasti tersisa.

Di bagian kiri, sate lebih hemat daripada nasi goreng, karena hanya nasi yang tersisa. Di bagian kanan, nasi goreng dan burger menghabiskan sembilan bahan.

Jumlahnya adalah tiga, ditambah satu, ditambah satu, ditambah satu, ditambah dua. Jadi, jawabannya adalah delapan keluaran.

Tonton pembahasan lengkapnya untuk melihat mengapa tujuh keluaran tidak mungkin. Soal ini dibuat oleh tim Bebras Pakistan.
