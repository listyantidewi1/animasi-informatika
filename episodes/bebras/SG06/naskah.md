# Pembahasan Soal Bebras Siaga: Waktunya Camilan (2025-ID-01)

Video pembahasan ±8 menit untuk kategori **Siaga (kelas 4–6 SD)**, seri "Pembahasan Soal Bebras" (kode SG06). Bahasanya semudah kategori SiKecil. Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan.

Soal asli: "Waktunya Camilan", Bebras 2025, usulan Indonesia (kode 2025-ID-01). Soal 2025 hanya punya judul Indonesia, jadi di layar dan kredit dipakai judul itu. Lala, keempat camilan, dan tabel rencana digambar ulang dengan kode.

**Isi soal:** Lala mendapat camilan setiap sore. Ibunya menyediakan apel, pir, mangga, dan permen. Lala hanya boleh memilih satu jenis camilan setiap hari, dengan dua aturan: (1) tidak boleh makan mangga dua hari berturut-turut; (2) jika makan permen hari ini, besok harus apel atau pir. Lala merencanakan camilan lima hari. Rencana mana yang diperbolehkan?

| Pilihan | Hari 1 | Hari 2 | Hari 3 | Hari 4 | Hari 5 |
|---|---|---|---|---|---|
| A | permen | permen | apel | pir | mangga |
| B | permen | mangga | apel | permen | pir |
| C | mangga | permen | apel | mangga | permen |
| D | permen | apel | mangga | mangga | permen |

**Jawaban: C.**

**Telaah jawaban (diperiksa 11 Nov):**

1. A: hari 1 permen, hari 2 permen. Melanggar aturan 2 (setelah permen harus apel atau pir).
2. B: hari 1 permen, hari 2 mangga. Melanggar aturan 2.
3. C: mangga→permen (aman), permen→apel (sesuai aturan 2), apel→mangga (aman), mangga→permen (aman). Permen di hari 5 tidak perlu diperiksa karena rencananya hanya lima hari. Tidak ada mangga berturut-turut. Jadi C diperbolehkan.
4. D: hari 3 mangga, hari 4 mangga. Melanggar aturan 1.
5. Jebakan yang mungkin: mengira mangga di dua hari yang tidak berdampingan juga dilarang, atau mengira permen di hari terakhir melanggar aturan 2. Keduanya dibahas langsung.
6. Konsep di baliknya: memeriksa batasan (constraint) pada urutan dengan bingkai dua hari yang digeser (seperti komputer memeriksa data satu per satu), dan satu pelanggaran saja cukup untuk menolak rencana.

Warna tetap di seluruh video: bingkai pemeriksa oranye, centang hijau untuk pasangan aman, silang merah untuk pelanggaran. Ada dua jeda "pikirkan dulu" (±6 dan ±5 detik).

---

## 0. Pembuka dan soal

Halo, teman-teman! Aku Kiko. Apakah kamu pernah mendengar Tantangan Bebras? Tantangan Bebras adalah lomba berpikir yang seru untuk anak-anak di seluruh dunia.
*[Visual: Papan tulis putih; tulisan "Tantangan Bebras" ditulis spidol; empat berang-berang muncul; Kiko di kiri.]*

Hari ini, kita akan mengerjakan satu soal Bebras untuk kelas empat, lima, dan enam. Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Waktunya Camilan". Soal ini berasal dari Bebras tahun dua ribu dua puluh lima, dan dibuat oleh tim Bebras dari negara kita sendiri, yaitu Indonesia.
*[Visual: Bola dunia, bendera Merah Putih; kartu ASAL SOAL: judul, tahun, tim Bebras Indonesia (dilingkari), kode 2025-ID-01. Sepanjang video, judul dan kode soal tampil di tajuk atas.]*

Setelah menonton video ini, kamu bisa memeriksa apakah sebuah rencana mengikuti aturan, seperti cara komputer memeriksa.
*[Visual: Kartu judul "Waktunya Camilan" dengan kalimat kait.]*

Sebelum membahasnya, mari kita lihat soalnya dulu. Ini adalah Lala. Lala mendapat camilan setiap sore.
*[Visual: Lala (anak perempuan, digambar ulang) di kiri; matahari sore; tulisan "camilan setiap sore".]*

Ibu Lala selalu menyediakan empat jenis camilan, yaitu apel, pir, mangga, dan permen. Setiap hari, Lala hanya boleh memilih satu jenis camilan.
*[Visual: Empat camilan muncul satu per satu sesuai narasi, masing-masing dengan namanya: apel merah, pir kuning, mangga hijau, permen lolipop ungu; tulisan "1 camilan setiap hari".]*

Ibu Lala punya dua aturan. Aturan pertama, Lala tidak boleh makan mangga dua hari berturut-turut.
*[Visual: Kartu ATURAN 1: mangga (hari ini) lalu mangga (besok) dicoret merah; tulisan "Tidak boleh makan mangga dua hari berturut-turut."]*

Aturan kedua, kalau Lala makan permen hari ini, maka besok dia harus makan apel atau pir.
*[Visual: Kartu ATURAN 2: permen (hari ini) → apel atau pir (besok); tulisan "Setelah permen, besok harus apel atau pir."]*

Lala sedang merencanakan camilannya selama lima hari berturut-turut. Ada empat rencana, yaitu rencana A, B, C, dan D. Setiap baris menunjukkan camilan dari hari pertama sampai hari kelima.
*[Visual: Tabel rencana dari soal (baris A–D, kolom Hari 1–5) muncul baris demi baris; kedua kartu aturan mengecil ke kanan.]*

Pertanyaannya adalah, rencana mana yang diperbolehkan menurut aturan ibunya? Ayo kita cari jawabannya bersama-sama, tanpa menebak.
*[Visual: Tulisan "Rencana mana yang boleh?" dan "tanpa menebak!"; Kiko mengangguk.]*

## 1. Memahami aturan

Mari kita pahami aturan pertama dulu. Berturut-turut artinya hari yang satu langsung disusul hari berikutnya, tanpa ada hari lain di tengahnya. Jadi, kalau hari ini Lala makan mangga, besok dia tidak boleh makan mangga lagi.
*[Visual: Dua kotak hari berdampingan (Hari 1, Hari 2) dengan busur "langsung besoknya"; mangga lalu mangga, mangga kedua dicoret merah.]*

Tetapi, mangga hari ini dan mangga lagi lusa itu boleh, karena ada hari lain di tengahnya. Contohnya, mangga, lalu apel, lalu mangga. Rencana seperti ini tidak melanggar aturan pertama.
*[Visual: Baris kedua: mangga, apel, mangga; apel di tengah dilingkari; centang hijau.]*

Sekarang, aturan kedua. Kalau hari ini Lala makan permen, besok dia hanya boleh makan apel atau pir. Jadi, setelah permen tidak boleh ada mangga, dan tidak boleh ada permen lagi.
*[Visual: Permen (hari ini) → empat camilan untuk besok: apel ✓, pir ✓, mangga ✗, permen ✗ (muncul sesuai narasi).]*

Ingat, aturan kedua hanya berlaku setelah Lala makan permen. Kalau hari ini Lala makan apel atau pir, besok dia boleh memilih camilan apa saja.
*[Visual: Baris kedua: apel atau pir (hari ini) → keempat camilan dicentang hijau.]*

## 2. Pemanasan: bingkai dua hari

Sekarang, ayo kita pemanasan dulu. Kedua aturan ini selalu membicarakan dua hari yang berdampingan, yaitu hari ini dan besok. Jadi, kita akan memakai sebuah bingkai yang memperlihatkan dua hari saja.
*[Visual: Rencana contoh lima hari (apel, mangga, mangga, pir, permen); bingkai oranye muncul mengelilingi Hari 1 dan Hari 2 dengan label "hari ini" dan "besok".]*

Bingkai ini kita geser dari kiri ke kanan. Mula-mula hari pertama dan hari kedua, lalu hari kedua dan hari ketiga, dan seterusnya. Rencana lima hari punya empat pasangan hari yang harus diperiksa.
*[Visual: Bingkai bergeser satu hari demi satu hari sampai Hari 4–5; di bawahnya muncul empat kurung bernomor 1–4 dan tulisan "4 pasangan".]*

Coba kita periksa rencana contoh ini, yaitu apel, mangga, mangga, pir, dan permen. Di pasangan pertama, ada apel lalu mangga. Tidak ada aturan yang dilanggar, jadi pasangan ini aman.
*[Visual: Bingkai kembali ke pasangan 1 (apel–mangga); centang hijau di bawah pasangan itu.]*

Di pasangan kedua, ada mangga lalu mangga lagi. Wah, ini melanggar aturan pertama! Begitu kita menemukan satu saja pelanggaran, rencana itu sudah pasti tidak boleh, jadi kita tidak perlu memeriksa pasangan yang lain.
*[Visual: Bingkai ke pasangan 2 (mangga–mangga); silang merah dan tulisan "melanggar aturan 1"; pasangan 3 dan 4 memudar; tulisan "1 pelanggaran = tidak boleh".]*

## 3. Memeriksa rencana

Sekarang, kita kembali ke soal. Coba periksa sendiri dulu keempat rencana itu dengan bingkai dua hari. Hentikan videonya sebentar kalau kamu perlu waktu.
*[Visual: Tabel rencana A–D di kiri, dua kartu aturan di kanan; jam pasir "PIKIRKAN DULU" ±6 detik tanpa narasi.]*

Sudah? Kita mulai dari rencana A. Hari pertama permen, dan hari kedua permen lagi. Menurut aturan kedua, setelah permen, Lala harus makan apel atau pir. Jadi, rencana A melanggar aturan kedua.
*[Visual: Baris A disorot; bingkai di Hari 1–2 (permen, permen); kartu aturan 2 dilingkari; silang merah di pasangan itu dan di huruf A.]*

Sekarang, rencana B. Hari pertama permen, dan hari kedua mangga. Mangga bukan apel, dan juga bukan pir. Jadi, rencana B juga melanggar aturan kedua.
*[Visual: Baris B; bingkai di Hari 1–2 (permen, mangga); silang merah di pasangan itu dan di huruf B.]*

Berikutnya, rencana C. Hari pertama mangga, dan hari kedua permen. Mangganya tidak berturut-turut, jadi pasangan pertama aman.
*[Visual: Baris C; bingkai di Hari 1–2 (mangga, permen); centang kecil di bawah pasangan 1.]*

Hari kedua permen, dan hari ketiga apel. Setelah permen, Lala makan apel. Ini sesuai dengan aturan kedua, jadi pasangan kedua aman.
*[Visual: Bingkai di Hari 2–3 (permen, apel); kartu aturan 2 dilingkari hijau; centang di bawah pasangan 2.]*

Hari ketiga apel, dan hari keempat mangga. Pasangan ketiga aman. Hari keempat mangga, dan hari kelima permen. Pasangan keempat juga aman.
*[Visual: Bingkai bergeser ke Hari 3–4 lalu Hari 4–5; centang di bawah pasangan 3 dan 4.]*

Hari kelima memang permen, tetapi rencananya hanya sampai hari kelima. Tidak ada hari keenam yang perlu diperiksa. Jadi, rencana C tidak melanggar aturan apa pun.
*[Visual: Bingkai di Hari 5 saja; tulisan "tidak ada hari ke-6"; centang hijau di huruf C.]*

Terakhir, rencana D. Permen lalu apel itu aman, dan apel lalu mangga juga aman. Tetapi, hari ketiga mangga, dan hari keempat mangga lagi. Jadi, rencana D melanggar aturan pertama.
*[Visual: Baris D; bingkai di pasangan 1 (centang), pasangan 2 (centang), pasangan 3 mangga–mangga (silang merah); kartu aturan 1 dilingkari; silang di huruf D.]*

Jadi, jawabannya adalah C. Hanya rencana C yang diperbolehkan menurut aturan ibu Lala.
*[Visual: Baris A, B, D memudar; baris C dilingkari hijau; kotak "Jawaban: C".]*

## 4. Bagaimana kalau

Sekarang, ada pertanyaan yang lebih seru. Kalau hari ini Lala makan permen, ada berapa pilihan camilan untuk besok? Coba pikirkan dulu.
*[Visual: Permen (hari ini) → empat kotak kosong untuk besok; jam pasir ±5 detik.]*

Jawabannya ada dua pilihan, yaitu apel atau pir. Mangga tidak boleh, dan permen juga tidak boleh.
*[Visual: Baris permen: apel ✓, pir ✓, mangga ✗, permen ✗; tulisan "2 pilihan".]*

Kalau hari ini Lala makan mangga, besok dia boleh makan apel, pir, atau permen. Jadi, ada tiga pilihan. Kalau hari ini Lala makan apel atau pir, besok dia boleh makan keempat camilan.
*[Visual: Baris mangga: apel ✓, pir ✓, mangga ✗, permen ✓ → "3 pilihan"; baris apel/pir: semua ✓ → "4 pilihan".]*

Komputer juga sering memeriksa aturan seperti ini. Contohnya, ketika kamu membuat kata sandi, komputer memeriksa apakah kata sandimu sudah mengikuti semua aturannya. Kalau ada satu aturan saja yang dilanggar, komputer akan menolaknya.
*[Visual: Layar komputer (digambar dengan kode) dengan kotak "Buat kata sandi" berisi "kucingku"; daftar aturan "paling sedikit 8 huruf" ✓ dan "ada angka" ✗; tulisan merah "Ditolak".]*

## 5. Penutup

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, pahami setiap aturan dengan contoh. Kedua, periksa dua hari yang berdampingan, satu pasangan demi satu pasangan. Ketiga, kalau ada satu pelanggaran saja, rencana itu tidak boleh.
*[Visual: Tiga langkah ditulis besar satu per satu, masing-masing dengan gambar kecil (kartu aturan, bingkai dua hari, silang merah).]*

Jadi, jawaban soal kita adalah C, karena hanya rencana C yang tidak melanggar aturan apa pun.
*[Visual: Rencana C besar dengan empat centang di antara harinya; Lala tersenyum; tulisan "Jawaban: C".]*

Terima kasih kepada tim Bebras Indonesia yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!
*[Visual: Kiko dan Lala melambai; kartu kredit: Waktunya Camilan, Bebras 2025, kontributor Indonesia, kode 2025-ID-01, gambar soal digambar ulang.]*

---

## Short YouTube (vertikal, hanya bersuara)

Pertanyaan kait di atas: "Rencana camilan mana yang boleh?". Soal disajikan utuh dulu (camilan, dua aturan, tabel rencana), lalu pembahasan. Tidak ada jawaban yang tampil sebelum dijelaskan narasi.

1. Ini Lala. Setiap sore, Lala memilih satu camilan, yaitu apel, pir, mangga, atau permen. Ibunya punya dua aturan.
2. Pertama, Lala tidak boleh makan mangga dua hari berturut-turut. Kedua, kalau hari ini Lala makan permen, besok dia harus makan apel atau pir.
3. Lala membuat empat rencana untuk lima hari. Rencana mana yang diperbolehkan? Coba pikirkan dulu.
4. Rencana A punya permen lalu permen, dan rencana B punya permen lalu mangga. Keduanya melanggar aturan kedua.
5. Rencana D punya mangga dua hari berturut-turut, jadi rencana D melanggar aturan pertama.
6. Rencana C tidak melanggar aturan apa pun. Jadi, jawabannya adalah C!
7. Tonton pembahasan lengkapnya, ya! Soal ini dibuat oleh tim Bebras Indonesia.

## Produksi

- Kode **SG06**, folder repo `episodes/bebras/SG06/` (alat dipanggil dengan `bebras/SG06`), berkas proyek di `bebras/siaga/`.
- Suara Kak Ceria (Eleven v4), kecepatan 0,9 seperti SG01–SG04; hanya versi bersuara; satu Short. MP3 intro1 dan intro2 dipakai ulang dari SG04 (teksnya sama).
- Narasi video 5293 karakter (817 kata), Short 689 karakter.
