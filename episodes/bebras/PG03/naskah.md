# Pembahasan Soal Bebras Penegak: Peta Kecerahan (2025-DE-06)

Video pembahasan ±9 menit untuk kategori **Penegak (SMA)**, seri "Pembahasan Soal Bebras" (soal Penegak ketiga, kode PG03). Diproduksi langsung tanpa menunggu persetujuan naskah (permintaan Bu Dewi, 10 Nov 2026). Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan.

Soal asli: "Peta Kecerahan", Bebras 2025, usulan Jerman (kode 2025-DE-06). Judul asli berbahasa Inggris tidak ada di berkas, jadi dipakai judul Indonesia. Semua gambar digambar ulang dengan kode; warna piksel diukur langsung dari gambar soal (RGB) supaya setia.

**Isi soal:** Setiap piksel gambar diberi angka dengan membandingkannya dengan tetangga kanannya: 1 jika lebih cerah, 0 jika sama cerah, −1 jika lebih gelap. Gambar dikelilingi piksel putih. Contoh: gambar 2×2 (ungu muda, ungu / ungu, ungu) punya peta 1, −1 / 0, −1. Tantangan: pilih satu-satunya gambar yang peta kecerahannya berbeda dari yang lain.

**Jawaban: B.**

**Telaah jawaban (sel demi sel, diperiksa 10 Nov):**

| Gambar | Warna (RGB terukur) | Peta tiap baris |
|---|---|---|
| A | baris 1 biru muda (181,213,255); baris 2–3 biru (39,121,228) | 0, 0, −1 |
| B | kolom 1–2 ungu tua (129,62,171); kolom 3 ungu muda (229,189,255) | 0, −1, −1 |
| C | semua merah (255,5,5) | 0, 0, −1 |
| D | baris 1 dan 3 hijau tua (33,113,87); baris 2 hijau terang (22,241,171) | 0, 0, −1 |

1. Di A, C, dan D setiap baris berwarna seragam, jadi dua perbandingan pertama sama cerah (0) dan piksel paling kanan selalu lebih gelap dari putih (−1). Perubahan warna atas–bawah (A, D) tidak pernah dibandingkan.
2. Di B, ungu tua (luma ±95) lebih gelap dari ungu muda (luma ±208), jadi kolom tengah −1; ungu muda lebih gelap dari putih, jadi kolom kanan −1.
3. Peta contoh dihitung ulang dengan rumus luma yang sama dan cocok dengan peta di soal (1, −1 / 0, −1); pemeriksaan ini juga ada di kode adegan.
4. Hanya B yang berbeda; jawabannya tunggal.

Konsep yang ditonjolkan: peta kecerahan adalah **abstraksi** yang membuang warna asli dan perubahan atas–bawah; kaitan dengan deteksi tepi di pengolahan gambar. Ada dua jeda "pikirkan dulu" (±6 detik).

---

## 0. Pembuka dan soal (±2:23)

Halo, teman-teman! Aku Kiko. Selamat datang di pembahasan soal Bebras. Kali ini, kita akan mengerjakan satu soal Bebras untuk tingkat SMA.
*[Visual: Papan tulis putih; tulisan "Tantangan Bebras" ditulis spidol; empat berang-berang muncul; Kiko di kiri.]*

Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah. Jadi, kita tidak perlu menebak.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Peta Kecerahan". Soal ini berasal dari Bebras tahun dua ribu dua puluh lima, dan dibuat oleh tim Bebras dari negara Jerman.
*[Visual: Bola dunia, bendera Jerman (hitam, merah, emas); kartu ASAL SOAL: judul, tahun, tim Bebras Jerman (dilingkari), kode 2025-DE-06.]*

Setelah menonton video ini, kamu bisa mengubah gambar piksel menjadi peta angka, lalu melihat informasi apa yang hilang dari gambar itu.
*[Visual: Kartu judul "Peta Kecerahan" dengan kalimat kait.]*

Sebelum membahasnya, mari kita pahami soalnya dulu. Sandra tertarik pada seni visual. Ia membuat peta kecerahan untuk gambar-gambar kecil yang tersusun dari piksel.
*[Visual: Sandra (gadis dengan palet) di kiri; gambar contoh 4×4 piksel di kanan.]*

Piksel adalah kotak kecil berwarna yang menyusun sebuah gambar. Setiap gambar di soal ini dikelilingi oleh piksel berwarna putih.
*[Visual: Gambar contoh membesar; label "piksel" menunjuk satu kotak; pinggiran putih diberi garis putus-putus "piksel putih di sekeliling".]*

Di peta kecerahan, setiap piksel berwarna diganti dengan sebuah angka. Angka itu didapat dengan membandingkan piksel tersebut dengan tetangganya di sebelah kanan.
*[Visual: Satu piksel dan tetangga kanannya dengan panah ke kanan; tulisan "bandingkan dengan tetangga kanan".]*

Angkanya satu, jika piksel itu lebih cerah daripada tetangga kanannya. Angkanya nol, jika keduanya sama cerahnya. Angkanya minus satu, jika piksel itu lebih gelap daripada tetangga kanannya.
*[Visual: Tabel aturan seperti di soal: 1 (ungu muda | ungu), 0 (ungu | ungu), −1 (ungu gelap | ungu muda), muncul satu per satu.]*

Ini contoh dari soal. Gambar ini punya satu piksel ungu muda dan tiga piksel ungu. Peta kecerahannya berisi empat angka, yaitu satu, minus satu, nol, dan minus satu.
*[Visual: Gambar contoh 4×4 (piksel putih di sekeliling) dan peta 2×2: 1, −1 / 0, −1.]*

Tantangannya adalah sebagai berikut. Beberapa gambar bisa punya peta kecerahan yang sama, walaupun gambarnya terlihat berbeda. Pilihlah satu-satunya gambar yang peta kecerahannya berbeda dari yang lain.
*[Visual: Empat pilihan A–D (5×5 dengan 3×3 berwarna) persis seperti di soal; pertanyaan di atas.]*

Setiap pilihan punya tiga baris dan tiga kolom piksel berwarna. Ayo kita cari jawabannya bersama-sama, tanpa menebak.
*[Visual: Kotak 3×3 berwarna di setiap pilihan diberi garis tipis; tidak ada pilihan yang ditandai.]*

## 1. Memahami aturan (±1:37)

Pertama, kita pahami dulu arti cerah dan gelap. Warna yang cerah lebih dekat ke warna putih. Warna yang gelap lebih dekat ke warna hitam.
*[Visual: Pita gradasi hitam → putih; tulisan "gelap" di kiri, "cerah" di kanan.]*

Putih adalah warna yang paling cerah. Jadi, piksel berwarna apa pun lebih gelap daripada piksel putih. Ingat hal ini, karena gambar di soal selalu dikelilingi oleh piksel putih.
*[Visual: Ujung kanan pita ditandai "putih = paling cerah"; pasangan piksel ungu muda | putih dengan tulisan "lebih gelap → −1".]*

Sekarang, mari kita periksa contoh dari soal. Kita mulai dari piksel kiri atas, yaitu piksel ungu muda. Tetangga kanannya adalah piksel ungu. Ungu muda lebih cerah daripada ungu, jadi angkanya satu.
*[Visual: Gambar contoh besar di kiri, peta kosong 2×2 di kanan; pasangan piksel disorot dengan panah ke kanan; angka 1 ditulis.]*

Berikutnya adalah piksel ungu di kanan atas. Tetangga kanannya adalah piksel putih di pinggir gambar. Ungu lebih gelap daripada putih, jadi angkanya minus satu.
*[Visual: Sorotan pindah ke piksel kanan atas dan piksel putih di kanannya; −1 ditulis.]*

Di baris bawah, piksel kiri berwarna ungu, dan tetangga kanannya juga ungu. Keduanya sama cerahnya, jadi angkanya nol.
*[Visual: Sorotan ke baris bawah; 0 ditulis.]*

Piksel terakhir berwarna ungu, dan tetangga kanannya adalah piksel putih. Jadi, angkanya minus satu. Hasil kita sama dengan peta di soal.
*[Visual: −1 ditulis; peta kita dicentang dan disandingkan dengan peta di soal.]*

Perhatikan satu hal penting. Setiap piksel hanya dibandingkan dengan tetangga di sebelah kanannya. Piksel di atas dan di bawahnya tidak pernah dibandingkan.
*[Visual: Panah kanan hijau di setiap piksel; panah atas dan bawah dicoret merah; tulisan "hanya ke kanan".]*

## 2. Peta gambar A (±1:14)

Sekarang, giliranmu. Coba hitung peta kecerahan gambar A. Hentikan videonya sebentar kalau kamu perlu waktu.
*[Visual: Gambar A besar dan peta kosong 3×3; lencana PIKIRKAN DULU dengan jam pasir.]*

Sudah? Kita mulai dari baris atas gambar A. Ketiga pikselnya berwarna biru muda. Piksel pertama dan piksel kedua sama cerahnya, jadi angkanya nol. Piksel kedua dan piksel ketiga juga sama, jadi angkanya juga nol.
*[Visual: Sorotan berpindah di baris atas; 0 dan 0 ditulis.]*

Piksel ketiga adalah piksel paling kanan, dan tetangganya adalah piksel putih. Biru muda memang cerah, tetapi putih lebih cerah lagi. Jadi, angkanya minus satu.
*[Visual: Sorotan ke piksel kanan atas dan piksel putih; −1 ditulis; tulisan "putih lebih cerah".]*

Baris kedua dan baris ketiga berwarna biru tua. Caranya sama, jadi hasilnya juga nol, nol, dan minus satu.
*[Visual: Baris 2 dan 3 terisi 0, 0, −1.]*

Jadi, setiap baris di peta gambar A berisi nol, nol, minus satu. Perhatikan, biru muda dan biru tua tidak pernah dibandingkan, karena letaknya di atas dan di bawah.
*[Visual: Peta A lengkap; garis antara baris biru muda dan biru tua ditandai "tidak dibandingkan" dengan panah atas-bawah dicoret.]*

## 3. Peta gambar B, C, dan D (±1:32)

Sekarang, coba hitung sendiri peta gambar B, C, dan D. Hentikan videonya dulu, lalu kita periksa bersama.
*[Visual: Gambar B, C, D berjajar dengan peta kosong di bawahnya; lencana PIKIRKAN DULU.]*

Kita periksa gambar C dulu. Semua pikselnya berwarna merah yang sama. Jadi, setiap baris berisi nol, nol, minus satu. Petanya sama dengan peta gambar A.
*[Visual: Peta C terisi; tulisan "= peta A".]*

Gambar D punya baris hijau tua, baris hijau terang, lalu baris hijau tua lagi. Di setiap baris, ketiga pikselnya berwarna sama. Jadi, setiap baris juga berisi nol, nol, minus satu.
*[Visual: Peta D terisi; tulisan "= peta A".]*

Sekarang, gambar B. Di setiap baris, dua piksel kiri berwarna ungu tua, sedangkan piksel kanan berwarna ungu muda.
*[Visual: Gambar B disorot; label ungu tua dan ungu muda.]*

Piksel pertama dan piksel kedua sama-sama ungu tua, jadi angkanya nol. Piksel kedua berwarna ungu tua, sedangkan tetangga kanannya ungu muda. Ungu tua lebih gelap, jadi angkanya minus satu.
*[Visual: Sorotan di baris B; 0 lalu −1 ditulis.]*

Piksel ketiga berwarna ungu muda, dan tetangga kanannya putih. Ungu muda lebih gelap daripada putih, jadi angkanya minus satu. Jadi, setiap baris di peta gambar B berisi nol, minus satu, minus satu.
*[Visual: −1 ditulis; peta B lengkap; kolom tengah dilingkari.]*

## 4. Memilih jawaban (±1:05)

Mari kita letakkan keempat peta berdampingan. Peta gambar A, C, dan D sama persis. Hanya peta gambar B yang berbeda, yaitu di kolom tengah.
*[Visual: Empat gambar dengan petanya; A, C, D dicentang "sama"; kolom tengah peta B dilingkari.]*

Jadi, jawaban yang benar adalah B.
*[Visual: Pilihan B dilingkari hijau; tulisan "Jawaban: B".]*

Mengapa gambar A, C, dan D punya peta yang sama? Pada gambar A dan D, warnanya berubah dari atas ke bawah. Tetapi, peta kecerahan hanya membandingkan ke kanan, jadi perubahan dari atas ke bawah tidak tercatat.
*[Visual: Gambar A dan D dengan panah atas-bawah dicoret; tulisan "perubahan atas–bawah tidak tercatat".]*

Selain itu, peta kecerahan tidak menyimpan warna aslinya. Merah, biru, dan hijau tidak terlihat lagi di peta. Yang tersisa hanya perbandingan cerah dan gelap.
*[Visual: Gambar A, C, D → satu peta yang sama; tulisan "warna asli hilang".]*

Pada gambar B, warnanya berubah dari kiri ke kanan. Perubahan seperti itu tercatat di peta, sehingga peta gambar B berbeda.
*[Visual: Gambar B dengan panah kanan hijau di batas ungu tua–ungu muda; tulisan "perubahan kiri–kanan tercatat".]*

## 5. Penutup (±0:58)

Komputer juga sering mengubah gambar menjadi angka seperti ini. Contohnya, program pengolah gambar bisa mencari tepi sebuah benda, yaitu tempat kecerahannya berubah tiba-tiba.
*[Visual: Layar komputer: gambar piksel kotak gelap di latar terang, lalu peta angkanya; angka bukan nol hanya muncul di tepi kiri dan kanan kotak.]*

Tetapi, seperti peta milik Sandra, angka-angka itu bisa kehilangan sebagian informasi. Karena itu, kita perlu tahu informasi apa yang disimpan, dan informasi apa yang dibuang.
*[Visual: Tepi atas dan bawah kotak tidak terlihat di peta; tulisan "disimpan / dibuang".]*

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, pahami aturannya dengan mencoba contoh dari soal. Kedua, hitung peta setiap pilihan, baris demi baris. Ketiga, bandingkan petanya, lalu cari yang berbeda.
*[Visual: Tiga langkah ditulis besar satu per satu, masing-masing dengan gambar kecil.]*

Terima kasih kepada tim Bebras Jerman yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!
*[Visual: Kiko dan berang-berang melambai; kartu kredit: Peta Kecerahan, Bebras 2025, kontributor Jerman, kode 2025-DE-06, gambar soal digambar ulang.]*

---

## Short (±1:30, vertikal)

Pertanyaan kait: Gambar mana yang peta kecerahannya berbeda?

Sandra mengubah gambar piksel menjadi peta angka. Setiap piksel dibandingkan dengan tetangga kanannya. Lebih cerah menjadi satu, sama cerah menjadi nol, dan lebih gelap menjadi minus satu.

Setiap gambar dikelilingi piksel putih. Contohnya, gambar ini punya peta satu, minus satu, nol, dan minus satu.

Dari empat gambar ini, hanya satu yang peta kecerahannya berbeda. Gambar mana itu? Coba pikirkan dulu.

Pada gambar A, setiap baris berwarna sama. Jadi, setiap baris petanya nol, nol, minus satu. Piksel paling kanan menjadi minus satu, karena putih lebih cerah.

Gambar C dan D juga begitu. Warnanya berubah dari atas ke bawah, tetapi peta hanya membandingkan ke kanan. Jadi, petanya sama dengan peta gambar A.

Pada gambar B, ungu tua bertemu ungu muda di sebelah kanannya. Jadi, petanya nol, minus satu, minus satu. Jawabannya adalah gambar B.

Tonton pembahasan lengkapnya untuk melihat cara menghitung peta sel demi sel. Soal ini dibuat oleh tim Bebras Jerman.
