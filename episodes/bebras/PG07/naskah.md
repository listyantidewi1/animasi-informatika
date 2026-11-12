# Pembahasan Soal Bebras Penegak: Tempat Parkir yang Tersedia (2025-KR-05)

Video pembahasan ±10 menit (10:26) untuk kategori **Penegak (SMA)**, seri "Pembahasan Soal Bebras" (kode PG07). Diproduksi langsung tanpa menunggu persetujuan naskah (permintaan Bu Dewi, 11 Nov 2026). Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan.

Soal asli: "Tempat Parkir yang Tersedia", Bebras 2025, usulan Korea Selatan (kode 2025-KR-05). Semua gambar digambar ulang dengan kode.

**Isi soal:** Empat zona parkir: disabilitas (hanya penyandang disabilitas), staf (hanya staf), orang tua (hanya orang tua murid), kuning (setiap orang). Orang yang termasuk lebih dari satu kelompok boleh memakai semua zona kelompoknya. Papan awal: 3, 1, 3, 2. Antrean: 1 staf penyandang disabilitas, 2–3 staf, 4–5 orang tua murid. Tantangan: pilih semua kemungkinan tampilan papan setelah semua mobil parkir berurutan. Pilihan: A 2 1 0 1, B 2 1 1 0, C 3 0 1 0, D 3 0 0 1.

**Jawaban: B dan C.**

**Telaah jawaban (diperiksa 11 Nov, juga dengan enumerasi otomatis di scenes.js):**

1. Mobil 1 boleh di disabilitas, staf, atau kuning; mobil 2–3 di staf atau kuning; mobil 4–5 di orang tua atau kuning. Semua mobil pasti kebagian tempat (staf punya 1 + 2 = 3 tempat, mobil 1 memakai paling banyak satu; orang tua punya 3 tempat).
2. Jumlah angka akhir selalu 9 − 5 = 4, dan semua pilihan berjumlah 4, jadi jumlah tidak membedakan.
3. Zona orang tua hanya bisa diisi dua orang tua, jadi angkanya paling kecil 1. A dan D (angka 0) tidak mungkin.
4. B terjadi bila mobil 1 → disabilitas, mobil 2–3 → kuning, mobil 4–5 → orang tua. C terjadi bila mobil 1 → staf (atau kuning), staf lain mengisi sisa staf/kuning, mobil 4–5 → orang tua.
5. Semua tampilan yang mungkin: 2 0 1 1, 2 0 2 0, 2 1 1 0 (B), 3 0 1 0 (C).

Konsep yang ditonjolkan: menelusuri semua kemungkinan secara sistematis (pohon cabang), mencari batasan (invarian) untuk membuang pilihan, dan membuktikan kemungkinan dengan contoh nyata. Ada dua jeda "pikirkan dulu".

---


## 0. Pembuka dan soal (0:00)

Halo, teman-teman! Aku Kiko. Selamat datang di pembahasan soal Bebras. Kali ini, kita akan mengerjakan satu soal Bebras untuk tingkat SMA.
*[Visual: Papan tulis; tulisan "Tantangan Bebras"; empat berang-berang; Kiko melambai.]*

Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah. Jadi, kita tidak perlu menebak.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Tempat Parkir yang Tersedia". Soal ini berasal dari Bebras tahun dua ribu dua puluh lima, dan dibuat oleh tim Bebras dari negara Korea Selatan.
*[Visual: Bola dunia, bendera Korea Selatan; kartu ASAL SOAL: judul, tahun, tim Bebras Korea Selatan (dilingkari), kode 2025-KR-05.]*

Setelah menonton video ini, kamu bisa menelusuri semua kemungkinan dengan teratur, lalu membuang pilihan yang tidak mungkin terjadi.
*[Visual: Kartu judul dengan kalimat kait.]*

Sebelum membahasnya, mari kita pahami soalnya dulu. Sekolah Menengah Berang-berang mempunyai tempat parkir dengan empat zona. Setiap zona punya tanda sendiri, yang menunjukkan siapa yang boleh parkir di sana.
*[Visual: Tempat parkir dilihat dari atas: empat zona dengan tanda masing-masing muncul satu per satu; hanya tempat yang masih kosong yang digambar.]*

Zona abu-abu bergambar kursi roda hanya untuk penyandang disabilitas. Zona oranye bermotif kotak-kotak hanya untuk staf sekolah. Zona biru bergaris hanya untuk orang tua murid. Zona kuning boleh dipakai oleh setiap orang.
*[Visual: Tabel zona seperti di soal: tanda zona dan keterangan siapa yang boleh parkir, muncul baris demi baris.]*

Ada orang yang boleh parkir di lebih dari satu zona. Misalnya, orang tua murid yang menyandang disabilitas boleh parkir di zona disabilitas, zona orang tua, atau zona kuning.
*[Visual: Contoh: mobil orang tua dengan tanda kursi roda; tiga panah ke zona disabilitas, zona orang tua, dan zona kuning; zona staf dicoret.]*

Di pintu masuk, ada papan yang menunjukkan banyaknya tempat parkir yang masih kosong. Saat ini, ada tiga tempat kosong di zona disabilitas, satu di zona staf, tiga di zona orang tua, dan dua di zona kuning.
*[Visual: Papan hitam "Ruang Parkir yang Tersedia" 3 1 3 2; setiap angka disorot bersama zonanya di tempat parkir.]*

Lima mobil sedang antre untuk parkir. Mobil pertama dikemudikan oleh staf yang menyandang disabilitas. Mobil kedua dan mobil ketiga dikemudikan oleh staf. Mobil keempat dan mobil kelima dikemudikan oleh orang tua murid.
*[Visual: Lima mobil muncul di jalur antrean, bernomor 1–5, dengan label pengemudinya. Mobil staf oranye, mobil orang tua biru, mobil 1 diberi tanda kursi roda.]*

Tantangannya adalah sebagai berikut. Mobil-mobil itu parkir satu per satu, sesuai urutan antrean. Pilihlah semua kemungkinan tampilan papan setelah kelima mobil selesai parkir.
*[Visual: Pertanyaan di atas; empat pilihan papan A–D seperti di soal: A 2 1 0 1, B 2 1 1 0, C 3 0 1 0, D 3 0 0 1.]*

Perhatikan kata "semua kemungkinan" di soal. Artinya, jawaban yang benar bisa lebih dari satu. Jadi, kita harus memeriksa setiap pilihan dengan teliti.
*[Visual: Kata "semua kemungkinan" digarisbawahi; tulisan tangan "jawaban bisa lebih dari satu".]*


## 1. Siapa boleh parkir di mana (2:42)

Pertama, kita tentukan dulu zona yang boleh dipakai oleh setiap mobil. Coba pikirkan sebentar, lalu kita periksa bersama.
*[Visual: Tabel kosong: baris mobil, kolom empat zona; lencana PIKIRKAN DULU dengan jam pasir.]*

Mobil pertama dikemudikan oleh staf yang menyandang disabilitas. Jadi, mobil ini boleh parkir di zona disabilitas, zona staf, atau zona kuning. Mobil ini punya tiga pilihan.
*[Visual: Baris mobil 1: centang di disabilitas, staf, kuning; silang di orang tua.]*

Mobil kedua dan mobil ketiga dikemudikan oleh staf. Keduanya boleh parkir di zona staf atau zona kuning. Mereka tidak boleh parkir di zona disabilitas, dan juga tidak boleh parkir di zona orang tua.
*[Visual: Baris mobil 2 dan 3: centang di staf dan kuning; silang di disabilitas dan orang tua.]*

Mobil keempat dan mobil kelima dikemudikan oleh orang tua murid. Keduanya boleh parkir di zona orang tua atau zona kuning.
*[Visual: Baris mobil 4 dan 5: centang di orang tua dan kuning.]*

Perhatikan kolom zona kuning. Semua mobil boleh parkir di sana. Jadi, zona kuning bisa dipakai oleh siapa saja yang datang lebih dulu.
*[Visual: Kolom zona kuning dilingkari; tulisan "semua boleh".]*

Apakah ada mobil yang tidak kebagian tempat? Staf bisa memakai tiga tempat, yaitu satu tempat di zona staf dan dua tempat di zona kuning. Mobil pertama paling banyak memakai satu dari tiga tempat itu, sehingga kedua staf pasti kebagian.
*[Visual: Catatan di bawah tabel: staf bisa memakai 1 + 2 = 3 tempat; mobil 1 memakai paling banyak 1.]*

Orang tua juga pasti kebagian, karena zona orang tua punya tiga tempat untuk dua mobil. Jadi, kelima mobil pasti bisa parkir.
*[Visual: Catatan: orang tua 3 tempat untuk 2 mobil; kotak hijau "Kelima mobil pasti bisa parkir".]*


## 2. Membuang pilihan yang tidak mungkin (4:28)

Sekarang, mari kita hitung semua tempat kosong di papan. Tiga ditambah satu, ditambah tiga, ditambah dua, hasilnya sembilan. Ada lima mobil yang parkir, jadi di akhir pasti tersisa empat tempat kosong.
*[Visual: Papan 3 1 3 2 besar dengan tanda tambah; = 9; 9 − 5 = 4.]*

Coba jumlahkan angka di setiap pilihan. Ternyata, jumlahnya selalu empat. Jadi, cara ini belum bisa membuang satu pilihan pun. Kita perlu petunjuk yang lain.
*[Visual: Empat pilihan dengan jumlahnya masing-masing: semuanya 4; tulisan "belum ada yang tercoret".]*

Sekarang, perhatikan zona orang tua. Zona ini hanya boleh dipakai oleh orang tua murid. Di antrean, hanya ada dua orang tua, yaitu mobil keempat dan mobil kelima.
*[Visual: Zona orang tua dengan tiga tempat kosong; dua mobil orang tua (4 dan 5) di sampingnya.]*

Jadi, paling banyak hanya dua tempat di zona orang tua yang terisi. Zona ini punya tiga tempat, sehingga paling sedikit masih tersisa satu tempat kosong.
*[Visual: Mobil 4 dan 5 masuk ke dua tempat; tempat ketiga tetap kosong dan dilingkari: "selalu sisa paling sedikit 1".]*

Sekarang, lihat pilihan A dan pilihan D. Keduanya menunjukkan angka nol di zona orang tua. Artinya, ketiga tempat di zona itu terisi semua. Itu tidak mungkin, karena orang tuanya hanya dua. Jadi, pilihan A dan D kita coret.
*[Visual: Pilihan A dan D: angka 0 di zona orang tua dilingkari merah, lalu pilihan dicoret. B dan C tetap (angka 1).]*


## 3. Membuktikan pilihan B dan C (5:49)

Pilihan B dan C belum tentu benar. Untuk membuktikannya, kita harus menemukan urutan parkir yang benar-benar menghasilkan tampilan itu. Coba cari sendiri dulu, lalu kita simulasikan bersama.
*[Visual: Tempat parkir awal, papan 3 1 3 2, lima mobil antre; target B dan C di kiri bawah; lencana PIKIRKAN DULU.]*

Kita mulai dari pilihan B, yaitu dua, satu, satu, nol. Mobil pertama parkir di zona disabilitas. Angka di zona disabilitas turun dari tiga menjadi dua.
*[Visual: Target B: 2 1 1 0. Mobil 1 berjalan masuk ke zona disabilitas; angka papan 3 → 2.]*

Mobil kedua dan mobil ketiga adalah staf. Keduanya parkir di zona kuning, sehingga angka zona kuning menjadi nol. Satu tempat di zona staf tetap kosong.
*[Visual: Mobil 2 dan 3 masuk ke zona kuning; angka kuning 2 → 0; tempat staf yang kosong ditunjuk.]*

Terakhir, kedua orang tua parkir di zona orang tua. Angkanya turun dari tiga menjadi satu. Sekarang, papan menunjukkan dua, satu, satu, nol. Tampilan ini sama dengan pilihan B. Jadi, pilihan B memang mungkin terjadi.
*[Visual: Mobil 4 dan 5 masuk ke zona orang tua; angka 3 → 1; papan 2 1 1 0 dicentang = B.]*

Sekarang, kita coba pilihan C, yaitu tiga, nol, satu, nol. Kali ini, mobil pertama parkir di zona staf. Ingat, staf yang menyandang disabilitas boleh parkir di sana. Angka zona staf menjadi nol.
*[Visual: Tempat parkir kembali kosong; target C: 3 0 1 0. Mobil 1 masuk ke zona staf; angka 1 → 0.]*

Kedua staf berikutnya tidak bisa lagi memakai zona staf, karena tempatnya sudah penuh. Jadi, mereka parkir di zona kuning, dan angka zona kuning menjadi nol.
*[Visual: Mobil 2 dan 3 masuk ke zona kuning; angka 2 → 0.]*

Kedua orang tua parkir di zona orang tua, sehingga angkanya menjadi satu. Papan menunjukkan tiga, nol, satu, nol. Tampilan ini sama dengan pilihan C. Jadi, pilihan C juga mungkin terjadi.
*[Visual: Mobil 4 dan 5 masuk ke zona orang tua; papan 3 0 1 0 dicentang = C.]*


## 4. Jawaban dan semua kemungkinan (7:44)

Jadi, jawaban yang benar ada dua, yaitu pilihan B dan pilihan C. Pilihan A dan pilihan D tidak mungkin terjadi.
*[Visual: Empat pilihan: B dan C dilingkari hijau dan dicentang; A dan D dicoret merah. Tulisan "Jawaban: B dan C".]*

Apakah masih ada tampilan lain yang mungkin? Mari kita periksa semua kemungkinan dengan teratur. Kita mulai dari mobil pertama, karena mobil inilah yang punya pilihan paling banyak.
*[Visual: Pohon kemungkinan: akar "Mobil 1" bercabang ke zona staf, zona kuning, dan zona disabilitas.]*

Kalau mobil pertama parkir di zona staf atau zona kuning, kedua staf harus memakai sisa tempat di zona staf dan zona kuning. Lalu, kedua orang tua parkir di zona orang tua. Hasilnya selalu tiga, nol, satu, nol, yaitu pilihan C.
*[Visual: Cabang zona staf dan zona kuning bertemu di daun 3 0 1 0 (C).]*

Kalau mobil pertama parkir di zona disabilitas, kedua staf punya dua cara. Mereka bisa memakai zona staf dan zona kuning, atau memakai dua tempat di zona kuning.
*[Visual: Cabang zona disabilitas bercabang dua untuk staf: staf + kuning, atau kuning + kuning.]*

Setelah itu, orang tua boleh memilih zona orang tua atau sisa zona kuning. Dari cabang ini, muncul tiga tampilan, yaitu dua, nol, satu, satu, lalu dua, nol, dua, nol, dan dua, satu, satu, nol.
*[Visual: Cabang orang tua dan tiga daun: 2 0 1 1, 2 0 2 0, 2 1 1 0.]*

Jadi, semuanya ada empat tampilan yang mungkin. Dua di antaranya ada di pilihan jawaban, yaitu B dan C. Dua tampilan lainnya tidak muncul di pilihan jawaban.
*[Visual: Daun B dan C ditandai hijau; dua daun lain diberi label "tidak ada di pilihan".]*


## 5. Penutup (9:22)

Komputer juga sering bekerja dengan cara seperti ini. Contohnya, sistem parkir pintar menghitung tempat kosong di setiap zona, lalu memperbarui papan setiap kali ada mobil yang masuk.
*[Visual: Layar "Sistem Parkir": denah zona dan papan; mobil masuk dan angka papan berkurang.]*

Ketika ada banyak kemungkinan, program menelusurinya dengan teratur, cabang demi cabang, seperti pohon yang tadi kita buat. Dengan cara itu, tidak ada kemungkinan yang terlewat.
*[Visual: Layar menampilkan pohon kemungkinan kecil yang ditelusuri cabang demi cabang.]*

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, tentukan pilihan yang boleh diambil oleh setiap orang. Kedua, cari batasan yang membuat sebuah pilihan tidak mungkin terjadi. Ketiga, buktikan pilihan yang tersisa dengan mencoba urutan yang benar-benar bisa terjadi.
*[Visual: Tiga kartu langkah dengan ikon.]*

Terima kasih kepada tim Bebras Korea Selatan yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!
*[Visual: Kartu terima kasih dengan kredit soal; Kiko dan berang-berang melambai.]*
