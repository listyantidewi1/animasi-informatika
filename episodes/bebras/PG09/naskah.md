# Pembahasan Soal Bebras Penegak: Jadwal Gladi Resik (2018-BE-04)

Video pembahasan untuk kategori **Penegak (SMA)**, seri "Pembahasan Soal Bebras" (kode PG09). Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan. Suara Kak Ceria, kecepatan 0,95 (intro1 dan intro2 dipakai ulang dari PG08).

Soal asli: "Jadwal Gladi Resik", Tantangan Bebras 2018, usulan Belgia (kode I-2018-BE-04), dari Buku Tantangan Bebras Indonesia 2018 tingkat SMA (Penegak). Graf dan kartu tarian digambar ulang dengan kode.

**Isi soal:** Enam penari (Ana, Budi, Cinta, Dori, Evi, Fani) dan sepuluh pasangan: Ana–Budi, Evi–Dori, Ana–Evi, Budi–Cinta, Dori–Ana, Fani–Budi, Cinta–Evi, Budi–Dori, Dori–Fani, Fani–Evi. Gladi resik berupa tarian berantai: dari satu tarian ke berikutnya, salah satu penari tetap di panggung; tidak ada penari yang menari tiga kali berturut-turut. Penari mana yang tidak boleh dijadwalkan pada tarian pertama? Pilihan: A. Ana, B. Cinta, C. Evi, D. Dori, E. Budi, F. Fani.

**Jawaban: B. Cinta.** Penari = simpul, pasangan = garis. Aturan "tidak tiga kali berturut-turut" membuat penari yang tinggal selalu berganti, sehingga jadwal = jalan yang melewati setiap garis tepat satu kali (jalur Euler). Derajat: Ana 3, Budi 4, Cinta 2, Dori 4, Evi 4, Fani 3; hanya Ana dan Fani yang ganjil, jadi jalur dimulai di Ana atau Fani. Pasangan pertama yang mungkin: Ana–Budi, Ana–Evi, Ana–Dori, Fani–Budi, Fani–Dori, Fani–Evi; Cinta tidak ada. Program pemeriksa (scratchpad) menemukan 264 jadwal sah dan pasangan pertamanya hanya keenam pasangan itu. Contoh jadwal: Ana–Budi, Budi–Cinta, Cinta–Evi, Evi–Dori, Dori–Ana, Ana–Evi, Evi–Fani, Fani–Budi, Budi–Dori, Dori–Fani.

Ada satu jeda "pikirkan dulu".

## 0. Pembuka dan soal

Halo, teman-teman! Aku Kiko. Selamat datang di pembahasan soal Tantangan Bebras. Tantangan Bebras adalah lomba berpikir yang diikuti pelajar dari seluruh dunia.
*[Visual: Papan tulis putih; tulisan "Tantangan Bebras"; mesin makanan kecil dengan ban berjalan; Kiko melambai.]*

Kali ini, kita akan membahas satu soal Bebras untuk tingkat SMA. Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Jadwal Gladi Resik". Soal ini berasal dari Tantangan Bebras tahun dua ribu delapan belas, dan dibuat oleh tim Bebras dari negara Belgia.
*[Visual: Bola dunia, bendera Belgia; kartu ASAL SOAL: judul, Bebras 2018, tim Bebras Belgia (dilingkari), kode 2018-BE-04, sumber buku Tantangan Bebras Indonesia 2018.]*

Setelah menonton video ini, kamu bisa mengubah soal jadwal menjadi gambar titik dan garis, yaitu graf, lalu memakai sifat graf untuk menjawabnya dengan cepat.
*[Visual: Kartu judul "Jadwal Gladi Resik" dengan kalimat kait.]*

Sebelum membahasnya, mari kita pahami soalnya dulu. Sekolah Bebras akan mengadakan pertunjukan tari berpasangan. Ada enam penari, yaitu Ana, Budi, Cinta, Dori, Evi, dan Fani.
*[Visual: Enam lingkaran nama penari muncul satu per satu.]*

Ada sepuluh pasangan yang harus tampil, yaitu Ana dengan Budi, Evi dengan Dori, Ana dengan Evi, Budi dengan Cinta, Dori dengan Ana, Fani dengan Budi, Cinta dengan Evi, Budi dengan Dori, Dori dengan Fani, dan Fani dengan Evi.
*[Visual: Daftar sepuluh pasangan muncul di kanan.]*

Pelatih ingin menyusun gladi resik untuk semua pasangan itu, dalam bentuk tarian berantai. Artinya, dari satu tarian ke tarian berikutnya, salah satu penari tetap tinggal di panggung. Contohnya, setelah Ana dan Evi menari, berikutnya bisa Cinta dan Evi, karena Evi tetap di panggung.
*[Visual: Kartu tarian "Ana–Evi" lalu "Cinta–Evi"; Evi disorot "tetap di panggung".]*

Ada satu aturan lagi. Seorang penari tidak boleh menari tiga kali berturut-turut, karena akan kelelahan. Jadi, setelah Ana dan Evi, lalu Cinta dan Evi, tarian berikutnya tidak boleh melibatkan Evi lagi.
*[Visual: Kartu ketiga "? – Evi" disilang; tulisan "Evi lelah".]*

Pertanyaannya adalah, penari mana yang tidak boleh dijadwalkan pada tarian pertama, karena akan membuat tarian berantai tidak mungkin disusun? Pilihannya adalah A Ana, B Cinta, C Evi, D Dori, E Budi, dan F Fani.
*[Visual: Kartu pertanyaan dan pilihan A–F.]*

## 1. Mengubah soal menjadi graf

Sepuluh pasangan ini sulit diingat kalau hanya berupa daftar. Mari kita gambar. Setiap penari kita gambar sebagai titik. Setiap pasangan kita gambar sebagai garis yang menghubungkan dua titik.
*[Visual: Garis pasangan muncul satu per satu sambil daftar pasangan dicentang.]*

Gambar seperti ini disebut graf. Titiknya disebut simpul, dan garisnya disebut sisi. Graf ini punya enam simpul dan sepuluh sisi.
*[Visual: Label "simpul" dan "sisi"; tulisan "6 simpul, 10 sisi".]*

Sekarang, perhatikan tarian berantai. Misalnya, Ana dan Evi menari, lalu Evi tetap di panggung bersama Cinta. Di graf, kita berjalan dari Ana ke Evi, lalu dari Evi ke Cinta.
*[Visual: Panah berjalan dari Ana ke Evi, lalu dari Evi ke Cinta; kartu tarian di kanan.]*

Karena Evi tidak boleh menari tiga kali berturut-turut, tarian berikutnya harus melibatkan Cinta, dan kita lanjut berjalan dari Cinta. Semua sepuluh pasangan harus tampil sekali. Jadi, jadwal gladi resik sama dengan satu jalan yang melewati setiap garis tepat satu kali, tanpa mengangkat pensil.
*[Visual: Panah lanjut dari Cinta ke Budi; tulisan "lewati setiap garis tepat satu kali".]*

## 2. Menghitung garis di setiap simpul

Bayangkan kita melewati sebuah simpul di tengah perjalanan. Kita masuk lewat satu garis, lalu keluar lewat garis yang lain. Jadi, garis di simpul itu terpakai berpasangan, satu untuk masuk dan satu untuk keluar.
*[Visual: Simpul Dori diperbesar; panah masuk dan keluar berpasangan.]*

Artinya, setiap simpul di tengah perjalanan harus punya jumlah garis yang genap. Hanya simpul awal dan simpul akhir yang boleh punya jumlah garis ganjil.
*[Visual: Catatan "tengah: genap" dan "awal dan akhir: boleh ganjil".]*

Sekarang, hitunglah banyak garis di setiap simpul. Simpul mana yang jumlah garisnya ganjil? Coba pikirkan dulu.
*[Visual: Jam pasir PIKIRKAN DULU; tanda tanya di samping setiap simpul.]*

Ana punya tiga garis. Budi punya empat. Cinta punya dua. Dori punya empat. Evi punya empat. Fani punya tiga. Jadi, yang ganjil hanya Ana dan Fani.
*[Visual: Angka derajat muncul di samping setiap simpul; Ana dan Fani dilingkari.]*

Jadi, perjalanan kita harus dimulai di Ana atau di Fani, dan berakhir di simpul yang satunya. Artinya, tarian pertama pasti melibatkan Ana atau Fani.
*[Visual: Tulisan "mulai: Ana atau Fani".]*

## 3. Siapa yang tidak bisa menari pertama?

Tarian pertama adalah salah satu garis milik Ana atau Fani. Garis milik Ana adalah Ana dengan Budi, Ana dengan Evi, dan Ana dengan Dori. Garis milik Fani adalah Fani dengan Budi, Fani dengan Dori, dan Fani dengan Evi.
*[Visual: Garis-garis Ana dan Fani ditebalkan oranye; daftar enam pasangan pertama yang mungkin.]*

Penari yang muncul di pasangan itu adalah Ana, Budi, Dori, Evi, dan Fani. Cinta tidak pernah berpasangan dengan Ana maupun Fani. Jadi, Cinta tidak mungkin menari di tarian pertama.
*[Visual: Simpul Cinta dilingkari merah dan disilang "tidak pernah".]*

Sebagai bukti bahwa jadwalnya memang bisa disusun, inilah salah satu jadwal lengkap yang dimulai dengan Ana dan Budi. Setiap pasangan tampil tepat satu kali, dan tidak ada yang menari tiga kali berturut-turut.
*[Visual: Jalan Euler digambar bernomor 1–10 di graf; daftar jadwal di kanan.]*

Jadi, jawabannya adalah B, yaitu Cinta.
*[Visual: Kartu jawaban "B. Cinta"; pilihan lain dicoret.]*

Penari lain tetap bisa tampil di tarian pertama. Misalnya, Dori bisa memulai bersama Ana atau Fani, dan Evi juga bisa memulai bersama Ana atau Fani.
*[Visual: Pasangan pertama yang mungkin disorot.]*

## 4. Penutup

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, gambarlah soal sebagai graf, dengan penari sebagai simpul dan pasangan sebagai garis. Kedua, ubah aturan soal menjadi aturan berjalan di graf. Ketiga, hitung garis di setiap simpul untuk mencari simpul awal dan akhir.
*[Visual: Tiga kartu langkah muncul satu per satu.]*

Jalan yang melewati setiap garis tepat satu kali disebut jalur Euler, dari nama matematikawan Leonhard Euler. Graf dipakai di banyak tempat, misalnya untuk merencanakan rute pengiriman barang, menyusun jadwal, dan memodelkan jaringan komputer.
*[Visual: Tulisan "jalur Euler"; ikon rute, jadwal, dan jaringan.]*

Jadi, Cinta adalah penari yang tidak boleh dijadwalkan pada tarian pertama.
*[Visual: Graf dengan simpul Cinta disorot.]*

Terima kasih kepada tim Bebras Belgia yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!
*[Visual: Kartu TERIMA KASIH dengan kredit soal; Kiko melambai.]*

## Short (vertikal)

Enam penari harus tampil dalam sepuluh pasangan. Pada setiap tarian berikutnya, satu penari tetap di panggung, tetapi tidak ada yang boleh menari tiga kali berturut-turut.

Penari mana yang tidak boleh tampil di tarian pertama? Pilihannya Ana, Cinta, Evi, Dori, Budi, atau Fani. Coba pikirkan dulu.

Gambarlah penari sebagai titik, dan pasangan sebagai garis. Jadwal yang benar adalah jalan yang melewati setiap garis tepat satu kali.

Simpul di tengah jalan selalu punya garis genap. Yang ganjil hanya Ana dan Fani, jadi jalannya harus dimulai di Ana atau Fani.

Cinta tidak pernah berpasangan dengan Ana maupun Fani. Jadi, jawabannya adalah Cinta.

Tonton pembahasan lengkapnya, ya! Soal ini dibuat oleh tim Bebras Belgia.
