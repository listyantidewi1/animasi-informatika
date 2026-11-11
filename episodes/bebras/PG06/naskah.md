# Pembahasan Soal Bebras Penegak: Batu, Kertas, Gunting dan Tukar (2025-BR-02)

Video pembahasan ±9,7 menit untuk kategori **Penegak (SMA)**, seri "Pembahasan Soal Bebras" (kode PG06). Diproduksi langsung tanpa menunggu persetujuan naskah (Bu Dewi mempercayakan, 11 Nov 2026). Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan.

Soal asli: "Batu, Kertas, Gunting dan Tukar", Bebras 2025, usulan Brasil (kode 2025-BR-02). Semua gambar (berang-berang, kursi, kartu batu/gunting/kertas) digambar ulang dengan kode.

**Isi soal:** Anna (A), Bert (B), dan Corry (C) duduk berjajar memegang kartu yang terlihat semua pemain: Anna batu, Bert gunting, Corry kertas. Mereka menentukan berapa kali pertukaran kartu (dua pemain saling menukar kartu) dan siapa yang terlibat di setiap pertukaran. Satu-satunya tujuan Bert adalah membuat Corry kalah. Strategi apa yang menjamin keberhasilannya? Pilihan (diberi huruf sesuai urutan di soal): A jumlah pertukaran genap, tidak peduli pertukaran mana; B Bert selalu bertukar dengan Corry; C jumlah pertukaran ganjil dengan Corry; D Bert tidak boleh bertukar dengan Corry.

**Jawaban: A** (pilihan pertama: Bert hanya perlu memastikan jumlah pertukaran genap, tidak peduli pertukaran mana yang dilakukan).

**Telaah jawaban (diperiksa 11 Nov):**

1. Tafsiran "Corry kalah": ketiga kartu selalu berbeda, jadi setiap pemain menang dari satu pemain dan kalah dari satu pemain lain. Corry selalu kalah dari seseorang, sehingga satu-satunya tafsiran yang bermakna adalah Corry kalah melawan Bert (kartu Bert mengalahkan kartu Corry). Tafsiran ini dijelaskan di video.
2. Susunan [Anna, Bert, Corry] ada 3! = 6. Bert menang: (batu, gunting, kertas), (kertas, batu, gunting), (gunting, kertas, batu), yaitu awal dan dua rotasinya. Corry menang: (gunting, batu, kertas), (batu, kertas, gunting), (kertas, gunting, batu).
3. Setiap pertukaran (transposisi) memindahkan susunan dari satu kelompok ke kelompok lain; sembilan pertukaran dari kelompok "Bert menang" semuanya mendarat di kelompok "Corry menang" (diperiksa satu per satu di kode, `EDGES` di scenes.js). Jadi pemenang Bert lawan Corry berbalik setiap pertukaran: genap → Bert menang, ganjil → Corry menang (paritas permutasi).
4. Pilihan: D salah (satu pertukaran Anna ↔ Bert → Corry menang); B salah (satu pertukaran Bert ↔ Corry → Corry menang); C salah (satu pertukaran Bert ↔ Corry saja → ganjil → Corry menang); A benar dan menjamin (genap selalu kembali ke kelompok Bert menang).

Konsep penutup: invarian (sifat yang selalu benar setelah setiap langkah), contoh puzzle geser angka dengan 14 dan 15 tertukar yang tidak bisa diselesaikan. Dua jeda "pikirkan dulu" (±6 dan ±5 detik). Suara: Kak Ceria, Eleven v4, speed 0,95.

---


## 0. Pembuka dan soal

Halo, teman-teman! Aku Kiko. Selamat datang di pembahasan soal Bebras. Kali ini, kita akan mengerjakan satu soal Bebras untuk tingkat SMA.
*[Visual: Papan tulis putih; tulisan "Tantangan Bebras"; tiga berang-berang dengan kartu batu, gunting, kertas; Kiko melambai.]*

Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah. Jadi, kita tidak perlu menebak.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Batu, Kertas, Gunting dan Tukar". Soal ini berasal dari Bebras tahun dua ribu dua puluh lima, dan dibuat oleh tim Bebras dari negara Brasil.
*[Visual: Bola dunia, bendera Brasil; kartu ASAL SOAL: judul, tahun, tim Bebras Brasil (dilingkari), kode 2025-BR-02.]*

Setelah menonton video ini, kamu bisa menemukan sifat yang tidak pernah berubah dalam sebuah permainan, lalu memakainya untuk memilih strategi yang pasti berhasil.
*[Visual: Kartu judul dengan kalimat kait.]*

Sebelum membahasnya, mari kita pahami soalnya dulu. Anna, Bert, dan Corry sedang memainkan variasi dari permainan batu, gunting, kertas.
*[Visual: Tiga berang-berang duduk di kursi: Anna, Bert, Corry (nama berwarna).]*

Ingat aturannya. Batu mengalahkan gunting, gunting mengalahkan kertas, dan kertas mengalahkan batu.
*[Visual: Panel aturan di kanan: batu > gunting, gunting > kertas, kertas > batu, muncul satu per satu.]*

Mereka duduk berjajar di kursi. Anna memegang kartu batu, Bert memegang kartu gunting, dan Corry memegang kartu kertas. Kartu itu dipegang menghadap ke depan, sehingga semua pemain dapat melihatnya.
*[Visual: Kartu muncul di tangan masing-masing: Anna batu, Bert gunting, Corry kertas.]*

Sebelum bermain, mereka harus menentukan berapa kali pertukaran kartu yang akan dilakukan. Satu pertukaran artinya dua pemain saling menukar kartunya.
*[Visual: Kotak "Berapa kali pertukaran?"; tulisan "1 pertukaran = 2 pemain saling menukar kartu" dengan panah dua arah.]*

Mereka juga harus menentukan pemain mana saja yang terlibat dalam setiap pertukaran. Misalnya, pertukaran pertama dilakukan oleh Anna dan Bert. Lalu, pertukaran kedua dilakukan oleh Bert dan Corry.
*[Visual: Rencana: 1. Anna ↔ Bert, 2. Bert ↔ Corry; kartu berpindah sesuai urutan.]*

Tantangannya adalah sebagai berikut. Satu-satunya tujuan Bert adalah membuat Corry kalah. Strategi apa yang akan menjamin keberhasilan Bert?
*[Visual: Pertanyaan di atas; empat pilihan muncul.]*

Ada empat pilihan jawaban, dan kita beri huruf A sampai D sesuai urutannya. Pilihan A, Bert hanya perlu memastikan bahwa jumlah pertukaran adalah genap, tidak peduli pertukaran mana yang dilakukan. Pilihan B, berapa pun banyaknya pertukaran, Bert harus selalu bertukar kartu dengan Corry.
*[Visual: Pilihan A dan B disorot bergantian.]*

Pilihan C, Bert hanya perlu menjamin jumlah pertukaran yang ganjil dengan Corry. Pilihan D, berapa pun banyaknya pertukaran, Bert tidak boleh bertukar kartu dengan Corry.
*[Visual: Pilihan C dan D disorot; tidak ada pilihan yang ditandai.]*


## 1. Memahami tujuan Bert

Pertama, mari kita lihat siapa mengalahkan siapa pada awal permainan. Batu milik Anna mengalahkan gunting milik Bert. Gunting milik Bert mengalahkan kertas milik Corry.
*[Visual: Tiga kartu besar; panah "menang" dari Anna ke Bert, lalu dari Bert ke Corry.]*

Lalu, kertas milik Corry mengalahkan batu milik Anna. Jadi, setiap pemain menang melawan satu pemain, dan kalah melawan satu pemain lainnya.
*[Visual: Panah melengkung dari Corry ke Anna; tulisan "1 menang, 1 kalah" di bawah setiap pemain.]*

Karena ketiga kartunya selalu berbeda, Corry pasti kalah dari salah satu pemain. Jadi, tujuan Bert yang sebenarnya adalah membuat Corry kalah melawan Bert. Dengan kata lain, kartu Bert harus mengalahkan kartu Corry.
*[Visual: Pasangan Bert dan Corry dilingkari; papan "Bert lawan Corry".]*

Pada awal permainan, gunting milik Bert mengalahkan kertas milik Corry. Jadi, kalau tidak ada pertukaran sama sekali, Bert berhasil.
*[Visual: Papan skor: "0 pertukaran: Bert menang" dicentang.]*


## 2. Mencoba pertukaran

Sekarang, coba pikirkan. Kalau mereka hanya melakukan satu pertukaran, siapa yang menang antara Bert dan Corry? Hentikan videonya sebentar kalau kamu perlu waktu.
*[Visual: Susunan awal di kiri; tiga kolom kosong "Anna ↔ Bert", "Bert ↔ Corry", "Anna ↔ Corry"; lencana PIKIRKAN DULU.]*

Sudah? Ada tiga kemungkinan pertukaran. Kemungkinan pertama, Anna dan Bert bertukar. Sekarang, Bert memegang batu, dan Corry memegang kertas. Kertas mengalahkan batu, jadi Corry menang.
*[Visual: Kolom 1: kartu Anna dan Bert bertukar; Bert batu, Corry kertas; label "Corry menang".]*

Kemungkinan kedua, Bert dan Corry bertukar. Sekarang, Bert memegang kertas, dan Corry memegang gunting. Gunting mengalahkan kertas, jadi Corry menang lagi.
*[Visual: Kolom 2: kartu Bert dan Corry bertukar; label "Corry menang".]*

Kemungkinan ketiga, Anna dan Corry bertukar. Bert tetap memegang gunting, tetapi Corry sekarang memegang batu. Batu mengalahkan gunting, jadi Corry tetap menang.
*[Visual: Kolom 3: kartu Anna dan Corry bertukar; Bert tidak ikut bertukar; label "Corry menang".]*

Jadi, pertukaran mana pun yang dipilih, satu pertukaran selalu membuat Corry menang. Bahkan, pertukaran antara Anna dan Corry pun ikut mengubah hasilnya, walaupun Bert tidak ikut bertukar.
*[Visual: Ketiga label "Corry menang" dilingkari; tulisan "1 pertukaran → Corry menang".]*

Bagaimana kalau ada dua pertukaran? Misalnya, Anna dan Bert bertukar dulu, sehingga Corry menang. Lalu, Anna dan Corry bertukar. Sekarang, Bert memegang batu, dan Corry memegang gunting. Batu mengalahkan gunting, jadi Bert menang lagi.
*[Visual: Rantai susunan: awal → Anna ↔ Bert → Anna ↔ Corry; label pemenang di bawah setiap susunan.]*

Sekarang, kita tambah pertukaran ketiga, misalnya antara Bert dan Corry. Bert memegang gunting, dan Corry memegang batu. Jadi, Corry menang lagi.
*[Visual: Susunan keempat muncul: Bert ↔ Corry; label "Corry menang".]*

Polanya mulai terlihat. Setiap kali ada satu pertukaran, pemenang antara Bert dan Corry berbalik. Mula-mula Bert yang menang, lalu Corry, lalu Bert lagi, kemudian Corry lagi.
*[Visual: Panah "berbalik" di antara label pemenang; hitungan 0, 1, 2, 3 pertukaran.]*


## 3. Mengapa selalu berbalik?

Tetapi, apakah pola ini selalu benar? Kita tidak boleh hanya percaya pada beberapa contoh. Jadi, mari kita periksa semua kemungkinannya.
*[Visual: Kiko bertanya; tulisan "Selalu benar?".]*

Tiga kartu yang berbeda hanya dapat dibagikan kepada tiga pemain dengan enam cara. Kita kelompokkan keenam susunan itu. Di kiri ada tiga susunan saat Bert menang, dan di kanan ada tiga susunan saat Corry menang.
*[Visual: Enam susunan: kotak kiri "Bert menang" (biru), kotak kanan "Corry menang" (hijau tosca).]*

Sekarang, kita gambar garis untuk setiap pertukaran. Dari setiap susunan, ada tiga pertukaran yang mungkin, sehingga ada tiga garis yang keluar dari setiap susunan.
*[Visual: Tiga garis berwarna keluar dari susunan awal (Anna ↔ Bert, Bert ↔ Corry, Anna ↔ Corry), menuju kotak kanan.]*

Perhatikan baik-baik. Setiap garis selalu menyeberang dari kelompok kiri ke kelompok kanan. Tidak ada satu pun pertukaran yang membuat kita tetap berada di kelompok yang sama.
*[Visual: Semua sembilan garis tergambar; tulisan "semua garis menyeberang".]*

Jadi, setiap pertukaran bekerja seperti saklar lampu. Sekali ditekan, pemenangnya berbalik. Dua kali ditekan, pemenangnya kembali seperti semula.
*[Visual: Saklar lampu ditekan; lampu menyala dan padam; label Bert / Corry berganti.]*

Permainan dimulai dengan Bert sebagai pemenang. Kalau jumlah pertukarannya genap, Bert menang. Kalau jumlah pertukarannya ganjil, Corry menang. Siapa yang bertukar tidak penting sama sekali.
*[Visual: Tabel jumlah pertukaran 0–5 dengan pemenang; "genap → Bert menang", "ganjil → Corry menang".]*


## 4. Memeriksa pilihan

Sekarang, dengan aturan genap dan ganjil ini, coba periksa keempat pilihan. Hentikan videonya dulu, lalu kita periksa bersama.
*[Visual: Empat pilihan di kiri; lencana PIKIRKAN DULU di kanan.]*

Pilihan D mengatakan bahwa Bert tidak boleh bertukar kartu dengan Corry. Tetapi, kalau hanya ada satu pertukaran antara Anna dan Bert, jumlahnya ganjil, sehingga Corry menang. Jadi, pilihan D tidak menjamin keberhasilan Bert.
*[Visual: Contoh: Anna ↔ Bert, Corry menang; pilihan D disilang.]*

Pilihan B mengatakan bahwa Bert harus selalu bertukar kartu dengan Corry. Kalau hanya ada satu pertukaran antara Bert dan Corry, jumlahnya ganjil, sehingga Corry menang lagi. Jadi, pilihan B juga tidak menjamin.
*[Visual: Contoh: Bert ↔ Corry, Corry menang; pilihan B disilang.]*

Pilihan C meminta jumlah pertukaran yang ganjil dengan Corry. Kalau tidak ada pertukaran lain, jumlah semua pertukarannya ganjil, sehingga Corry pasti menang. Jadi, pilihan C juga tidak menjamin.
*[Visual: Contoh: satu kali Bert ↔ Corry (ganjil), Corry menang; pilihan C disilang.]*

Pilihan A mengatakan bahwa jumlah pertukaran harus genap, tidak peduli pertukaran mana yang dilakukan. Ini sesuai dengan temuan kita. Dengan jumlah pertukaran yang genap, kartu Bert selalu mengalahkan kartu Corry.
*[Visual: Pilihan A dicentang; "genap → Bert menang".]*

Jadi, jawaban yang benar adalah pilihan A. Bert hanya perlu memastikan bahwa jumlah pertukarannya genap.
*[Visual: Pilihan A dilingkari hijau; tulisan "Jawaban: A".]*


## 5. Penutup

Di soal ini, ada satu hal yang selalu benar setelah setiap pertukaran. Bert menang tepat ketika jumlah pertukarannya genap. Dalam informatika, sifat yang selalu benar seperti ini disebut invarian.
*[Visual: Kartu "Selalu benar: Bert menang ⇔ jumlah pertukaran genap"; label "invarian".]*

Programmer memakai invarian untuk memastikan programnya benar. Invarian juga menjelaskan mengapa beberapa susunan pada puzzle geser angka tidak akan pernah bisa diselesaikan, karena alasan genap dan ganjil seperti di soal ini.
*[Visual: Puzzle geser 4×4 dengan 14 dan 15 tertukar; label "tidak bisa diselesaikan".]*

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, baca tujuannya dengan teliti. Kedua, coba beberapa langkah kecil, lalu cari polanya. Ketiga, buktikan bahwa polanya selalu benar, lalu periksa setiap pilihan dengan contoh.
*[Visual: Tiga langkah ditulis besar satu per satu.]*

Terima kasih kepada tim Bebras Brasil yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!
*[Visual: Kiko dan berang-berang melambai; kartu kredit soal.]*


---

## YouTube Short (±1:19)

Pertanyaan kait di atas: "Strategi mana yang pasti membuat Bert menang?"

Anna memegang batu, Bert memegang gunting, dan Corry memegang kertas. Batu mengalahkan gunting, gunting mengalahkan kertas, dan kertas mengalahkan batu.
*[Visual: potongan adegan soal3 (soal_v)]*

Sebelum bermain, mereka menentukan berapa kali pertukaran kartu dilakukan. Dalam satu pertukaran, dua pemain saling menukar kartunya.
*[Visual: potongan adegan soal4 (soal_v)]*

Satu-satunya tujuan Bert adalah membuat Corry kalah melawannya. Strategi mana yang pasti berhasil? Coba pikirkan dulu.
*[Visual: potongan adegan soal8 (pilihan_v)]*

Pada awalnya, gunting milik Bert mengalahkan kertas milik Corry. Tetapi, setelah satu pertukaran apa pun, Corry selalu menang, walaupun Bert tidak ikut bertukar.
*[Visual: potongan adegan t4 (satu_v)]*

Setelah dua pertukaran, Bert menang lagi. Setelah tiga pertukaran, Corry menang lagi. Jadi, setiap pertukaran membalik pemenangnya.
*[Visual: potongan adegan t7 (dua_v)]*

Jadi, jumlah pertukaran yang genap selalu membuat Bert menang, siapa pun yang bertukar. Jawabannya adalah pilihan A.
*[Visual: potongan adegan p5 (pilihan_v)]*

Tonton pembahasan lengkapnya untuk melihat mengapa polanya selalu benar. Soal ini dibuat oleh tim Bebras Brasil.
*[Visual: potongan adegan c4 (cta_bebras)]*
