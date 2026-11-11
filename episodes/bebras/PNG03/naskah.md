# Pembahasan Soal Bebras Penggalang: Jalan yang Diblokir (2025-IT-02)

Video pembahasan ±10 menit untuk kategori **Penggalang (SMP)**, seri "Pembahasan Soal Bebras" (soal Penggalang ketiga, kode PNG03). Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan. Suara Kak Ceria, kecepatan 0,95.

Soal asli: "Jalan yang Diblokir", Bebras 2025, usulan Italia (kode 2025-IT-02). Judul asli berbahasa Inggris tidak ada di berkas, jadi dipakai judul Indonesia. Peta taman digambar ulang dengan kode, letak taman dan arah panah sama dengan gambar soal.

**Isi soal:** Sebuah kota punya 7 taman (A sampai G) yang terhubung oleh 10 jalan satu arah. Bertrand dan Noam ingin mengadakan aksi duduk damai yang akan memblokir satu jalan. Jalan itu harus dipilih supaya warga tetap bisa bepergian di antara dua taman mana pun, dengan tetap mematuhi arah jalan. Ada dua jawaban yang benar; jawaban ditulis dengan dua huruf mengikuti arah jalan (misalnya BA berarti dari B ke A).

**Jawaban: FB atau FG** (keduanya benar).

**Telaah jawaban (dibaca dari arah panah di gambar soal yang diperbesar, diperiksa 11 Nov):**

Sepuluh jalan satu arah: B→A, A→G, G→B, F→B, B→C, C→E, E→D, D→C, E→F, F→G.

| Taman | Jalan masuk | Jalan keluar |
|---|---|---|
| A | B→A | A→G |
| B | G→B, F→B | B→A, B→C |
| C | B→C, D→C | C→E |
| D | E→D | D→C |
| E | C→E | E→D, E→F |
| F | E→F | F→B, F→G |
| G | A→G, F→G | G→B |

1. Jalan yang merupakan satu-satunya jalan keluar dari sebuah taman tidak boleh diblokir (warga terkurung di taman itu). Begitu juga satu-satunya jalan masuk ke sebuah taman (taman itu tidak bisa didatangi). Dari tabel, tujuh jalan seperti itu adalah B→A, A→G, G→B, C→E, E→D, D→C, dan E→F.
2. Tersisa tiga calon: B→C, F→B, dan F→G.
3. Blokir B→C: dari B hanya bisa ke A, lalu G, lalu kembali ke B. Taman C, D, E, F tidak bisa dicapai dari B. Gagal.
4. Blokir F→B: masih ada rute keliling yang melewati ketujuh taman dan kembali ke awal, yaitu B→A→G→B→C→E→D→C→E→F→G→B. Berhasil.
5. Blokir F→G: rute kelilingnya B→A→G→B→C→E→D→C→E→F→B. Berhasil.
6. Rute keliling yang melewati semua taman membuktikan bahwa setiap taman bisa mencapai setiap taman lain (ikuti saja rutenya sampai tiba). Jadi, jawabannya FB dan FG, tepat dua seperti kata soal.

Konsep yang ditonjolkan: peta jalan satu arah sebagai **graf berarah**; syarat "semua taman saling terjangkau" (terhubung kuat); cara memangkas pilihan dengan menghitung jalan masuk dan keluar, lalu membuktikan dengan rute keliling. Kaitan dengan jaringan komputer: jalur cadangan. Ada dua jeda "pikirkan dulu" (±6 detik).

**Perkiraan kredit ElevenLabs:** narasi video ±7.000 karakter dan Short ±1.000 karakter. Dengan pemakaian episode sebelumnya (PG03 ±2.500 kredit untuk ±6.700 karakter), video + Short kira-kira **3.000 kredit** (paling banyak ±3.500 bila ada beat yang diulang). Sisa kuota saat naskah ini ditulis ±16.300 kredit (dipakai bersama soal Penggalang lain).

---

## 0. Pembuka dan soal (±2:30)

Halo, teman-teman! Aku Kiko. Selamat datang di pembahasan soal Bebras. Kali ini, kita akan mengerjakan satu soal Bebras untuk tingkat SMP.
*[Visual: Papan tulis putih; tulisan "Tantangan Bebras" ditulis spidol; empat berang-berang muncul; Kiko di kiri.]*

Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah. Jadi, kita tidak perlu menebak.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Jalan yang Diblokir". Soal ini berasal dari Bebras tahun dua ribu dua puluh lima, dan dibuat oleh tim Bebras dari negara Italia.
*[Visual: Bola dunia, bendera Italia (hijau, putih, merah); kartu ASAL SOAL: judul, tahun, tim Bebras Italia (dilingkari), kode 2025-IT-02.]*

Setelah menonton video ini, kamu bisa memeriksa apakah sebuah peta jalan satu arah masih bisa dilalui ke mana saja, walaupun ada jalan yang ditutup.
*[Visual: Kartu judul "Jalan yang Diblokir" dengan kalimat kait.]*

Sebelum membahasnya, mari kita pahami soalnya dulu. Di sebuah kota, ada tujuh taman. Nama taman-taman itu adalah huruf A sampai G.
*[Visual: Tujuh taman (lingkaran hijau berpohon) muncul satu per satu di posisi seperti soal, dengan label A–G.]*

Taman-taman itu terhubung oleh sepuluh jalan. Setiap jalan adalah jalan satu arah. Artinya, warga hanya boleh berjalan searah dengan panah di jalan itu.
*[Visual: Sepuluh jalan abu-abu dengan panah putih tergambar satu per satu, sama persis dengan soal; satu jalan disorot dengan tulisan "hanya searah panah".]*

Contohnya, jalan di antara taman B dan taman A punya panah yang menunjuk ke A. Jadi, warga boleh berjalan dari B ke A, tetapi tidak boleh dari A ke B.
*[Visual: Jalan B–A disorot; bidak kecil berjalan dari B ke A (centang hijau); bidak mencoba dari A ke B dan dicoret merah.]*

Di soal, jalan ini ditulis dengan dua huruf, yaitu BA. Huruf pertama adalah taman asal, dan huruf kedua adalah taman tujuan.
*[Visual: Label "BA" muncul di samping jalan; "B" ditandai "asal", "A" ditandai "tujuan".]*

Sekarang, Bertrand dan Noam ingin mengadakan aksi duduk damai. Aksi itu akan dilakukan di tengah satu jalan, sehingga jalan itu tertutup.
*[Visual: Dua berang-berang (Bertrand dan Noam) memegang papan "Damai"; tanda palang merah di satu jalan sebagai contoh, lalu hilang lagi.]*

Mereka tidak ingin mengganggu warga. Jadi, setelah satu jalan ditutup, warga harus tetap bisa pergi dari taman mana pun ke taman mana pun, dengan tetap mematuhi arah jalan.
*[Visual: Tulisan "dari taman mana pun ke taman mana pun"; panah-panah kecil antartaman berkedip.]*

Tantangannya adalah sebagai berikut. Jalan mana yang boleh dipilih untuk aksi duduk damai itu? Soal ini punya dua jawaban yang benar. Ayo kita temukan keduanya, tanpa menebak.
*[Visual: Peta utuh seperti soal; pertanyaan di atas; tulisan "ada 2 jawaban benar"; tidak ada jalan yang ditandai.]*

## 1. Memahami syaratnya (±1:30)

Pertama, kita pahami dulu apa artinya bisa pergi ke mana saja. Mari kita lihat peta sebelum ada jalan yang ditutup.
*[Visual: Peta lengkap di papan; Kiko menunjuk.]*

Misalnya, seorang warga ingin pergi dari taman D ke taman A. Dari D, ia mengikuti panah ke C. Dari C, ia ke E. Dari E, ia ke F. Dari F, ia ke B. Terakhir, dari B, ia ke A.
*[Visual: Bidak berjalan D → C → E → F → B → A; jejaknya digambar spidol oranye; daftar "D, C, E, F, B, A" tertulis di samping.]*

Perjalanannya memang panjang, tetapi ia sampai. Yang penting bukan jaraknya, melainkan ada atau tidaknya jalan yang searah panah.
*[Visual: Centang hijau di A; tulisan "jauh tidak apa-apa, asal sampai".]*

Kalau satu jalan ditutup, mungkin ada warga yang tidak bisa sampai lagi. Kita harus mencari jalan yang, kalau ditutup, tidak membuat satu warga pun terjebak atau tidak bisa sampai.
*[Visual: Satu jalan dicoret, bidak berhenti di ujung buntu dengan tanda tanya; lalu kembali normal.]*

Ada sepuluh jalan. Kita bisa mencoba menutup jalan satu per satu, tetapi itu melelahkan. Jadi, kita cari cara yang lebih cerdas untuk mencoret jalan-jalan yang pasti tidak boleh ditutup.
*[Visual: Sepuluh label jalan berjajar di samping peta: BA, AG, GB, FB, BC, CE, ED, DC, EF, FG.]*

## 2. Mencoret jalan yang tidak boleh ditutup (±2:00)

Lihat taman A. Hanya ada satu jalan yang keluar dari A, yaitu jalan dari A ke G. Kalau jalan itu ditutup, warga yang berada di A tidak bisa pergi ke mana pun. Ia terkurung di taman A.
*[Visual: Taman A disorot; satu-satunya panah keluar (A ke G) berkedip; jalan itu dipalang, bidak di A terkurung dengan garis lingkaran merah.]*

Taman A juga hanya punya satu jalan masuk, yaitu jalan dari B ke A. Kalau jalan itu ditutup, tidak ada warga yang bisa datang ke taman A.
*[Visual: Panah masuk B ke A berkedip; dipalang; bidak dari taman lain berhenti, tidak bisa masuk A.]*

Jadi, kita mendapat aturan penting. Kalau sebuah jalan adalah satu-satunya jalan keluar dari suatu taman, jalan itu tidak boleh ditutup. Begitu juga, kalau sebuah jalan adalah satu-satunya jalan masuk ke suatu taman, jalan itu juga tidak boleh ditutup.
*[Visual: Kotak aturan ditulis spidol: "satu-satunya jalan keluar → jangan ditutup", "satu-satunya jalan masuk → jangan ditutup".]*

Sekarang, giliranmu. Hitung jalan masuk dan jalan keluar di setiap taman, lalu cari jalan mana saja yang tidak boleh ditutup. Hentikan videonya sebentar kalau kamu perlu waktu.
*[Visual: Tabel kosong "Taman | Masuk | Keluar" di samping peta; lencana PIKIRKAN DULU dengan jam pasir.]*

Sudah? Mari kita periksa bersama. Taman A punya satu jalan masuk dan satu jalan keluar, jadi jalan dari B ke A dan jalan dari A ke G kita coret.
*[Visual: Baris A di tabel terisi; label BA dan AG di daftar dicoret merah; di peta, kedua jalan ditandai gembok.]*

Taman G punya dua jalan masuk, tetapi hanya satu jalan keluar, yaitu jalan dari G ke B. Jadi, jalan dari G ke B kita coret.
*[Visual: Baris G terisi; GB dicoret dan digembok.]*

Taman C hanya punya satu jalan keluar, yaitu jalan dari C ke E. Taman D hanya punya satu jalan masuk dan satu jalan keluar, yaitu jalan dari E ke D dan jalan dari D ke C. Jadi, ketiga jalan itu kita coret.
*[Visual: Baris C dan D terisi; CE, ED, DC dicoret dan digembok.]*

Terakhir, taman F hanya punya satu jalan masuk, yaitu jalan dari E ke F. Jadi, jalan itu juga kita coret.
*[Visual: Baris F terisi; EF dicoret dan digembok. Baris B dan E terisi tanpa coretan baru.]*

Sekarang, tujuh jalan sudah dicoret. Hanya tiga jalan yang tersisa sebagai calon, yaitu jalan dari B ke C, jalan dari F ke B, dan jalan dari F ke G.
*[Visual: Daftar tinggal BC, FB, FG dilingkari biru; di peta, ketiga jalan itu disorot biru, yang lain digembok abu-abu.]*

## 3. Menguji tiga calon (±2:10)

Tetapi, aturan tadi hanya mencoret jalan yang pasti salah. Ketiga calon ini belum tentu benar. Jadi, kita perlu mengujinya satu per satu. Coba uji dulu sendiri, lalu kita periksa bersama.
*[Visual: Tiga kartu calon BC, FB, FG; lencana PIKIRKAN DULU.]*

Kita mulai dengan menutup jalan dari B ke C. Seorang warga berangkat dari taman B. Jalan keluar dari B yang masih terbuka hanya jalan ke A. Dari A, ia ke G. Dari G, ia kembali lagi ke B.
*[Visual: Jalan BC dipalang; bidak dari B berjalan B → A → G → B; jejaknya berputar di sisi kiri peta.]*

Ia hanya berputar-putar di taman B, A, dan G. Ia tidak pernah bisa sampai ke taman C, D, E, atau F. Jadi, jalan dari B ke C tidak boleh ditutup.
*[Visual: Taman C, D, E, F diberi tanda silang "tidak terjangkau"; kartu BC dicoret merah.]*

Sekarang, kita buka lagi jalan dari B ke C, lalu kita tutup jalan dari F ke B. Untuk memeriksanya, kita coba cari satu rute keliling yang melewati ketujuh taman, lalu kembali ke taman awal.
*[Visual: BC dibuka lagi; FB dipalang; tulisan "cari rute keliling".]*

Kita mulai dari B, lalu ke A, ke G, dan kembali ke B. Dari B, kita ke C, ke E, ke D, dan kembali ke C. Dari C, kita ke E lagi, lalu ke F. Dari F, kita ke G, lalu ke B. Kita sudah melewati ketujuh taman dan kembali ke B.
*[Visual: Bidak berjalan sesuai rute, jejak oranye tergambar; urutan B, A, G, B, C, E, D, C, E, F, G, B tertulis di bawah; setiap taman yang dilewati diberi centang.]*

Mengapa rute keliling ini sudah cukup? Karena dari taman mana pun, warga cukup mengikuti rute ini sampai tiba di taman tujuannya. Rute itu melewati semua taman, jadi semua taman pasti bisa dicapai.
*[Visual: Contoh dua titik (misalnya dari E ke A) disorot pada rute; bidak mengikuti rute dari E sampai A.]*

Jadi, jalan dari F ke B boleh ditutup. Inilah jawaban pertama kita, yaitu FB.
*[Visual: Kartu FB diberi centang hijau; tulisan "Jawaban 1: FB".]*

Terakhir, kita buka lagi jalan dari F ke B, lalu kita tutup jalan dari F ke G. Rute kelilingnya hampir sama. Dari B ke A, ke G, ke B, ke C, ke E, ke D, ke C, ke E, ke F, lalu dari F langsung ke B.
*[Visual: FB dibuka; FG dipalang; bidak berjalan B, A, G, B, C, E, D, C, E, F, B; setiap taman dicentang.]*

Ketujuh taman terlewati, dan kita kembali ke B. Jadi, jalan dari F ke G juga boleh ditutup. Inilah jawaban kedua kita, yaitu FG.
*[Visual: Kartu FG diberi centang hijau; tulisan "Jawaban 2: FG".]*

## 4. Memeriksa jawaban (±0:50)

Jadi, ada dua jawaban yang benar, yaitu FB dan FG. Hasil ini cocok dengan soal, yang mengatakan bahwa ada dua kemungkinan jawaban.
*[Visual: Peta dengan jalan FB dan FG dilingkari hijau; tulisan "Jawaban: FB atau FG".]*

Perhatikan bahwa kedua jalan ini keluar dari taman F. Dari G, warga langsung bisa ke B. Jadi, kedua jalan itu sama-sama membawa warga dari F menuju B. Kalau satu jalan ditutup, jalan yang lain bisa menggantikannya.
*[Visual: Taman F disorot dengan dua panah keluarnya; satu dipalang, yang lain menyala hijau, bergantian.]*

Hati-hati juga dengan arah tulisan jawabannya. FB berarti dari F ke B. Kalau kamu menulis BF, artinya jalan dari B ke F, padahal jalan seperti itu tidak ada di peta.
*[Visual: "FB ✓" dan "BF ✗" ditulis berdampingan; panah dari F ke B digambar ulang.]*

## 5. Penutup (±1:00)

Peta seperti ini disebut graf berarah. Tamannya adalah titik, dan jalan satu arahnya adalah panah. Komputer memakai graf untuk banyak hal, misalnya peta jalan di aplikasi navigasi dan jaringan internet.
*[Visual: Peta taman berubah menjadi titik dan panah polos berlabel A–G; tulisan "graf berarah"; ikon kecil peta navigasi dan jaringan komputer digambar dengan kode.]*

Di jaringan internet, data juga harus bisa sampai ke tujuan, walaupun ada satu jalur yang rusak. Karena itu, para ahli jaringan selalu memeriksa jalur mana yang punya cadangan, dan jalur mana yang tidak boleh terputus.
*[Visual: Jaringan komputer kecil; satu kabel putus, data berbelok lewat jalur lain; tulisan "jalur cadangan".]*

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, coret jalan yang menjadi satu-satunya jalan masuk atau satu-satunya jalan keluar sebuah taman. Kedua, uji calon yang tersisa satu per satu. Ketiga, cari rute keliling yang melewati semua taman untuk membuktikan jawabanmu.
*[Visual: Tiga langkah ditulis besar satu per satu, masing-masing dengan gambar kecil.]*

Terima kasih kepada tim Bebras Italia yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!
*[Visual: Kiko dan berang-berang melambai; kartu kredit: Jalan yang Diblokir, Bebras 2025, kontributor Italia, kode 2025-IT-02, gambar soal digambar ulang.]*

---

## Short (±1:30, vertikal)

Pertanyaan kait: Jalan mana yang boleh ditutup?

Kota ini punya tujuh taman dan sepuluh jalan satu arah. Warga hanya boleh berjalan searah panah.

Bertrand dan Noam ingin mengadakan aksi duduk damai yang menutup satu jalan. Tetapi, warga harus tetap bisa pergi dari taman mana pun ke taman mana pun. Jalan mana yang boleh ditutup? Ada dua jawaban. Coba pikirkan dulu.

Taman A hanya punya satu jalan keluar. Kalau jalan itu ditutup, warga di taman A terkurung. Jadi, jalan yang menjadi satu-satunya jalan keluar atau satu-satunya jalan masuk sebuah taman tidak boleh ditutup.

Dengan aturan itu, tujuh jalan tercoret. Tinggal tiga calon, yaitu B ke C, F ke B, dan F ke G.

Kalau jalan B ke C ditutup, warga dari B hanya berputar di B, A, dan G. Jadi, jalan itu tidak boleh ditutup.

Kalau jalan F ke B atau jalan F ke G ditutup, masih ada rute keliling yang melewati ketujuh taman. Jadi, jawabannya adalah FB dan FG.

Tonton pembahasan lengkapnya untuk melihat cara mengujinya langkah demi langkah. Soal ini dibuat oleh tim Bebras Italia.

---

**Catatan produksi (11 Nov):** video 11:16 + Short 1:39, suara Kak Ceria 0,95. Pemakaian ElevenLabs sebenarnya ±3.520 kredit (video + Short); sisa kuota ±10.170 sesudahnya.
