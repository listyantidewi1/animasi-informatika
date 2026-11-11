# Pembahasan Soal Bebras Penegak: Buletin Pulau Berang-berang (2025-TW-04)

Video pembahasan ±8,5 menit untuk kategori **Penegak (SMA)**, seri "Pembahasan Soal Bebras" (soal Penegak keempat, kode PG04). Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan. Suara Kak Ceria, kecepatan 0,95.

Soal asli: "Buletin Pulau Berang-berang", Bebras 2025, usulan Taiwan (kode 2025-TW-04). Judul asli berbahasa Inggris tidak ada di berkas, jadi dipakai judul Indonesia. Peta pulau digambar ulang dengan kode; letak desa dan jalan sama dengan gambar soal.

**Isi soal:** Pulau Berang-berang punya 18 desa (A sampai R) yang dihubungkan jalan. Setiap kali sebuah desa mengirim pesan atau menerima pesan baru, pengirim pesannya meneruskan pesan itu ke semua desa tetangga, dan pesan tiba pada hari berikutnya. Contoh: dari A, hari 1 tiba di B, C, Q; hari 2 di D, E, F. Pertanyaan: kalau pesan baru mulai dari desa J, berapa hari sampai pesan tiba di seluruh desa? (bilangan bulat 1–18)

**Jawaban: 4 hari.**

**Telaah jawaban (jalan dibaca dari gambar soal yang diperbesar, diperiksa 11 Nov):**

25 jalan: Q–F, F–K, K–P, Q–A, F–C, C–A, C–E, A–B, B–E, B–D, E–J, K–H, H–N, H–J, N–M, J–G, J–M, G–D, G–I, I–L, M–O, M–L, P–O, O–L, L–R. Contoh soal cocok (A: hari 1 B, C, Q; hari 2 D, E, F).

| Hari | Desa yang menerima pesan |
|---|---|
| 0 | J |
| 1 | E, H, G, M |
| 2 | C, B, K, N, D, I, O, L |
| 3 | A, F, P, R |
| 4 | Q |

Bukti tidak bisa kurang dari 4: setiap rute dari J ke Q melewati paling sedikit 4 jalan (misalnya J–H–K–F–Q), dan pesan hanya maju satu jalan per hari. Pada hari ke-4 semua desa sudah menerima pesan. Dihitung ulang otomatis di scenes.js (BFS dari J = 4, dari A = 6).

Konsep yang ditonjolkan: penyebaran pesan lapis demi lapis (**breadth-first search**), jarak = banyaknya jalan, bukan jarak di gambar; titik awal di tengah jaringan menyebar lebih cepat (J 4 hari, A 6 hari). Jebakan: menjumlahkan hari seolah satu pengirim berkeliling; mengira desa R (pojok kanan) paling akhir. Satu jeda "pikirkan dulu" (±6 detik).

**Kredit ElevenLabs:** narasi video ±5.100 karakter (intro1 dan intro2 dipakai ulang dari PG03) dan Short ±860 karakter. Sisa kuota sebelum mulai 46.750 kredit (dipakai bersama soal Penegak lain).

---

## 0. Pembuka dan soal

Halo, teman-teman! Aku Kiko. Selamat datang di pembahasan soal Bebras. Kali ini, kita akan mengerjakan satu soal Bebras untuk tingkat SMA.
*[Visual: Papan tulis putih; tulisan "Tantangan Bebras" ditulis spidol; empat berang-berang muncul; Kiko di kiri.]*

Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah. Jadi, kita tidak perlu menebak.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Buletin Pulau Berang-berang". Soal ini berasal dari Bebras tahun dua ribu dua puluh lima, dan dibuat oleh tim Bebras dari Taiwan.
*[Visual: Bola dunia, bendera Taiwan; kartu ASAL SOAL: judul, tahun, tim Bebras Taiwan (dilingkari), kode 2025-TW-04.]*

Setelah menonton video ini, kamu bisa menghitung berapa hari yang dibutuhkan sebuah kabar untuk menyebar ke seluruh jaringan, tanpa harus menebak.
*[Visual: Kartu judul "Buletin Pulau Berang-berang" dengan kalimat kait.]*

Sebelum membahasnya, mari kita pahami soalnya dulu. Di Pulau Berang-berang, ada delapan belas desa. Setiap desa diberi nama dengan satu huruf.
*[Visual: Pulau hijau; delapan belas rumah desa muncul satu per satu di posisi seperti gambar soal, dengan huruf A–R.]*

Desa-desa itu dihubungkan oleh jalan. Dua desa yang dihubungkan langsung oleh satu jalan disebut desa tetangga.
*[Visual: Jalan putih tergambar; jalan A–B disorot; tulisan "A dan B bertetangga".]*

Setiap desa punya seorang pengirim pesan. Kalau desanya ingin mengirim pesan, atau baru saja menerima pesan baru, pengirim pesan itu akan meneruskan pesannya ke semua desa tetangga. Pesan itu tiba di desa tetangga pada hari berikutnya.
*[Visual: Berang-berang tukang pos dengan amplop; aturan ditulis spidol: "pesan baru → teruskan ke semua tetangga", "tiba besok".]*

Soal memberi sebuah contoh. Kalau desa A mengirim pesan, pesan itu tiba di desa B, C, dan Q setelah satu hari. Ketiga desa itu adalah tetangga desa A.
*[Visual: Desa A dilingkari; amplop bergerak dari A ke B, C, Q; label "hari 1" di ketiga desa.]*

Pada hari kedua, desa B, C, dan Q meneruskan pesan itu. Jadi, pesan tiba di desa D, E, dan F. Begitu seterusnya, sampai semua desa menerima pesan.
*[Visual: Amplop bergerak ke D, E, F; label "hari 2"; tulisan "dan seterusnya".]*

Tantangannya adalah sebagai berikut. Kalau ada pesan baru yang mulai dari desa J, berapa hari yang dibutuhkan supaya pesan itu sampai ke seluruh desa? Jawabannya berupa satu bilangan bulat, dari satu sampai delapan belas.
*[Visual: Peta utuh; desa J dilingkari; pertanyaan di panel kanan; "Jawaban: bilangan bulat 1–18".]*

## 1. Cara pesan menyebar

Pertama, kita perhatikan satu hal penting. Pengirim pesan tidak berkeliling ke desa-desa satu per satu. Semua pengirim yang baru menerima pesan bekerja bersamaan, pada hari yang sama.
*[Visual: Dua gambar: satu tukang pos berkeliling (dicoret) dan banyak tukang pos berangkat bersamaan (dicentang).]*

Jadi, pesan menyebar seperti riak air ketika kita melempar batu ke kolam. Gelombangnya melebar ke segala arah pada waktu yang sama.
*[Visual: Kolam dengan batu jatuh; lingkaran riak melebar.]*

Karena itu, kita tidak perlu menjumlahkan hari dari semua jalan. Kita cukup mencari kapan desa yang paling akhir menerima pesan.
*[Visual: Tulisan "jangan dijumlahkan" dicoret; "cari desa yang paling akhir" dilingkari.]*

Mari kita coba cara ini dengan contoh dari soal. Kita tulis angka hari di samping setiap desa. Desa A adalah titik awal, jadi desa A mendapat angka nol.
*[Visual: Peta; lingkaran kecil berangka di samping desa; A = 0.]*

Tetangga desa A, yaitu B, C, dan Q, mendapat angka satu. Lalu, tetangga mereka yang belum punya angka, yaitu D, E, dan F, mendapat angka dua.
*[Visual: B, C, Q = 1; D, E, F = 2; jalan yang dipakai pesan menyala oranye.]*

Perhatikan desa F. Pesan bisa tiba di F lewat desa Q, atau lewat desa C. Keduanya tiba pada hari kedua. Desa yang sudah punya angka tidak perlu diberi angka lagi, karena pesan yang datang lagi bukan pesan baru.
*[Visual: Dua jalur ke F (Q–F dan C–F) berkedip; angka 2 di F tetap; tulisan "sudah punya angka → lewati".]*

## 2. Menghitung hari dari desa J

Sekarang, giliranmu. Mulailah dari desa J, lalu tulis angka hari di samping setiap desa. Hentikan videonya sebentar kalau kamu perlu waktu.
*[Visual: Peta tanpa angka, J dilingkari; lencana PIKIRKAN DULU dengan jam pasir.]*

Sudah? Mari kita periksa bersama. Desa J adalah titik awal, jadi kita beri angka nol. Pada hari pertama, pesan tiba di semua tetangga desa J, yaitu desa E, H, G, dan M.
*[Visual: J = 0; E, H, G, M = 1; tabel hari di kanan: Hari 1: E, H, G, M.]*

Pada hari kedua, keempat desa itu meneruskan pesannya. Dari desa E, pesan tiba di C dan B. Dari desa H, pesan tiba di K dan N. Dari desa G, pesan tiba di D dan I. Terakhir, dari desa M, pesan tiba di O dan L.
*[Visual: Pasangan desa bertambah satu per satu dengan angka 2; tabel: Hari 2: C, B, K, N, D, I, O, L.]*

Sampai hari kedua, sudah ada tiga belas desa yang menerima pesan. Masih ada lima desa yang belum, yaitu desa A, F, P, R, dan Q.
*[Visual: Lima desa tanpa angka diberi tanda tanya oranye; tulisan "13 desa sudah, 5 belum".]*

Pada hari ketiga, dari desa C, pesan tiba di A dan F. Dari desa K, pesan tiba di P. Dari desa L, pesan tiba di R.
*[Visual: A, F, P, R = 3; tabel: Hari 3: A, F, P, R.]*

Sekarang, hanya desa Q yang belum menerima pesan. Desa Q bertetangga dengan desa A dan desa F. Keduanya baru menerima pesan pada hari ketiga. Jadi, desa Q menerima pesan pada hari keempat.
*[Visual: Q disorot; jalan A–Q dan F–Q menyala; Q = 4; tabel: Hari 4: Q.]*

Kini, kedelapan belas desa sudah punya angka. Angka terbesarnya adalah empat. Jadi, jawabannya adalah empat hari.
*[Visual: Seluruh peta berangka; kotak hijau "Jawaban: 4 hari".]*

## 3. Memeriksa jawaban

Mengapa jawabannya tidak bisa kurang dari empat hari? Lihat desa Q. Setiap rute dari desa J ke desa Q melewati paling sedikit empat jalan. Contohnya, dari J ke H, dari H ke K, dari K ke F, lalu dari F ke Q.
*[Visual: Rute J–H–K–F–Q digambar spidol oranye dengan angka jalan 1, 2, 3, 4.]*

Pesan hanya bisa melewati satu jalan dalam satu hari. Jadi, pesan butuh paling sedikit empat hari untuk sampai di desa Q. Pada hari keempat itu, semua desa lain juga sudah menerima pesan.
*[Visual: Tulisan "1 jalan = 1 hari"; "Q paling cepat hari ke-4"; centang di semua desa.]*

Hati-hati dengan dua kesalahan yang sering terjadi. Kesalahan pertama adalah menjumlahkan hari dari banyak jalan, seolah-olah hanya ada satu pengirim yang berkeliling. Padahal, semua pengirim bekerja bersamaan.
*[Visual: Kartu "Kesalahan 1": satu tukang pos berkeliling dengan hitungan hari yang terus bertambah, dicoret.]*

Kesalahan kedua adalah mengira desa yang terlihat paling jauh di gambar pasti paling akhir menerima pesan. Desa R terletak di pojok kanan, tetapi desa R sudah menerima pesan pada hari ketiga. Yang menentukan adalah banyaknya jalan yang dilewati, bukan jarak di gambar.
*[Visual: Desa R disorot dengan angka 3; desa Q dengan angka 4; tulisan "hitung jalannya, bukan jaraknya".]*

## 4. Penutup

Cara yang baru saja kita pakai, dalam informatika, disebut breadth-first search. Kita menelusuri desa lapis demi lapis, mulai dari desa yang paling dekat dengan titik awal.
*[Visual: Peta berubah menjadi graf titik dan garis; lapisan 0–4 diberi warna berbeda; tulisan "breadth-first search (BFS)".]*

Titik awal juga sangat berpengaruh. Kalau pesan dimulai dari desa A, seperti contoh di soal, pesan butuh enam hari untuk sampai ke seluruh desa. Desa J lebih cepat, karena letaknya lebih di tengah jaringan.
*[Visual: Dua peta kecil berdampingan: mulai dari J (4 hari) dan dari A (6 hari, R terakhir).]*

Cara berpikir ini dipakai di banyak tempat. Contohnya, pengumuman yang diteruskan dari grup kelas ke grup lain, atau data yang dikirim dari satu komputer ke komputer lain di internet.
*[Visual: Ikon HP dengan pengumuman yang diteruskan, lalu jaringan komputer dengan data menyebar.]*

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, beri angka nol pada desa awal. Kedua, beri angka satu pada semua tetangganya, lalu angka dua pada tetangga mereka yang belum punya angka, dan seterusnya. Ketiga, angka terbesar adalah jawabannya.
*[Visual: Tiga langkah ditulis besar satu per satu.]*

Terima kasih kepada tim Bebras Taiwan yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!
*[Visual: Kiko dan berang-berang melambai; kartu kredit: Buletin Pulau Berang-berang, Bebras 2025, kontributor Taiwan, kode 2025-TW-04.]*

---

## Short (±1:25, vertikal)

Pertanyaan kait: Berapa hari pesan ini menyebar?

Pulau Berang-berang punya delapan belas desa. Setiap desa yang menerima pesan baru akan meneruskannya ke semua desa tetangga, dan pesan itu tiba keesokan harinya.

Kalau sebuah pesan baru mulai dari desa J, berapa hari yang dibutuhkan supaya pesan itu sampai ke seluruh desa? Coba pikirkan dulu.

Kuncinya, semua pengirim pesan bekerja bersamaan. Jadi, kita beri angka hari di samping setiap desa, lapis demi lapis.

Pada hari pertama, pesan tiba di desa E, H, G, dan M. Pada hari kedua, pesan tiba di delapan desa lagi.

Pada hari ketiga, pesan tiba di desa A, F, P, dan R. Desa R memang terlihat paling jauh, tetapi ternyata bukan yang terakhir.

Desa terakhir adalah desa Q, yang menerima pesan pada hari keempat. Jadi, jawabannya adalah empat hari.

Tonton pembahasan lengkapnya untuk melihat alasannya langkah demi langkah. Soal ini dibuat oleh tim Bebras Taiwan.
