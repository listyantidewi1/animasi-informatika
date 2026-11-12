# Pembahasan Soal Bebras Penggalang: Mesin Klasifikasi Apel (2025-TW-03)

Video pembahasan ±12 menit untuk kategori **Penggalang (SMP)**, seri "Pembahasan Soal Bebras" (soal Penggalang kelima, kode PNG05). Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan. Suara Kak Ceria, kecepatan 0,95; intro1 dan intro2 dipakai ulang dari PNG03 (teksnya sama).

Soal asli: "Mesin Klasifikasi Apel", Bebras 2025, usulan Taiwan (kode 2025-TW-03). Judul asli berbahasa Inggris tidak ada di berkas, jadi dipakai judul Indonesia. Mesin pemilah digambar ulang dengan kode; susunan sensor dan isi kotak sama dengan gambar soal.

**Isi soal:** Di kebun berang-berang, apel dipilah menjadi 8 tingkatan menurut berat. Mesin pemilah punya sensor berat bertingkat: apel yang beratnya sama dengan atau lebih besar dari angka sensor jatuh ke saluran kanan, yang lebih ringan ke saluran kiri. Layar sensor A, B, dan C rusak. Dari isi kotak hasil pemilahan, manakah angka yang benar untuk sensor A, B, C? Pilihan: A) 10, 5, 18; B) 11, 6, 17; C) 12, 7, 20; D) 13, 8, 19.

**Jawaban: C** (sensor A = 12, sensor B = 7, sensor C = 20).

**Telaah jawaban** (isi kotak dibaca dari gambar soal yang diperbesar, 12 Nov 2026; angka di gambar sangat kecil): sensor yang terbaca 16 (kanan A), 4 dan 9 (bawah B), 14 dan C (bawah 16). Kotak dari kiri: [1, 3], [6, 5], [8], [9, 9], [12, 13], [14, 15, 14], [17, 18], [20].

1. Sensor C: apel 18 ke kiri, jadi C > 18; apel 20 ke kanan, jadi C ≤ 20. C = 19 atau 20. Pilihan A (18) dan B (17) salah.
2. Sensor A: apel teringan di sisi kanan adalah 12, jadi A ≤ 12; apel terberat di sisi kiri adalah 9, jadi A > 9. Pilihan D (13) salah, karena apel 12 akan belok ke kiri.
3. Sensor B (memeriksa pilihan C): apel 6 ke kiri, jadi B > 6; apel 8 ke kanan, jadi B ≤ 8. B = 7 cocok.
4. Setiap pilihan salah punya angka yang cocok (A: 10; B: 11; D: 8 dan 19), jadi ketiga sensor harus diperiksa.

Konsep yang ditonjolkan: aturan "sama dengan → kanan" (≥), mencari batas dari apel terberat yang ke kiri dan teringan yang ke kanan, eliminasi pilihan. Kaitan dengan informatika: pohon pencarian biner (binary search tree); 3 pertanyaan → 8 kotak, ±20 pertanyaan → sejuta data. Ada satu jeda "pikirkan dulu" (±6 detik).

---


## 0. Pembuka dan soal

Halo, teman-teman! Aku Kiko. Selamat datang di pembahasan soal Bebras. Kali ini, kita akan mengerjakan satu soal Bebras untuk tingkat SMP.

Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah. Jadi, kita tidak perlu menebak.

Soal ini berjudul "Mesin Klasifikasi Apel". Soal ini berasal dari Bebras tahun dua ribu dua puluh lima, dan dibuat oleh tim Bebras dari negara Taiwan.

Setelah menonton video ini, kamu bisa mencari angka sensor yang hilang pada sebuah mesin pemilah, hanya dengan melihat ke mana setiap apel jatuh.

Sebelum membahasnya, mari kita pahami soalnya dulu. Di kebun berang-berang, apel dipilah menjadi delapan tingkatan menurut beratnya. Apel yang tingkatannya sama dikirim ke tempat pengemasan yang sama.

Pak Berang-berang membuat mesin pemilah otomatis. Apel menggelinding melewati sensor berat, dan setiap sensor punya layar yang menunjukkan sebuah angka.

Aturannya seperti ini. Kalau berat apel sama dengan atau lebih besar dari angka sensor, apel jatuh ke saluran kanan. Kalau berat apel lebih kecil dari angka sensor, apel jatuh ke saluran kiri.

Contohnya, sensor ini menunjukkan angka dua belas. Apel seberat sembilan lebih kecil dari dua belas, jadi apel itu jatuh ke kiri. Apel seberat tiga belas lebih besar, jadi apel itu jatuh ke kanan.

Lalu, bagaimana dengan apel seberat dua belas? Beratnya sama dengan angka sensor. Jadi, apel itu jatuh ke kanan, bukan ke kiri. Ingat baik-baik aturan ini, karena nanti akan sangat penting.

Mesin yang sebenarnya lebih besar. Ada tujuh sensor yang tersusun bertingkat. Setiap apel masuk dari atas, melewati tiga sensor, lalu jatuh ke salah satu dari delapan kotak di bawah.

Mesin itu sudah memilah beberapa apel, dan hasilnya terlihat di kotak-kotak ini. Angka pada setiap apel adalah beratnya. Sayangnya, layar pada tiga sensor rusak, yaitu sensor A, sensor B, dan sensor C. Kita perlu mencari angkanya.

Tantangannya adalah sebagai berikut. Manakah angka yang benar untuk sensor A, B, dan C? Pilihan A adalah sepuluh, lima, dan delapan belas. Pilihan B adalah sebelas, enam, dan tujuh belas. Pilihan C adalah dua belas, tujuh, dan dua puluh. Pilihan D adalah tiga belas, delapan, dan sembilan belas.

Hati-hati, huruf A, B, dan C dipakai dua kali. Ada sensor A, B, dan C, dan ada juga pilihan jawaban A, B, C, dan D. Jadi, kita akan selalu menyebut kata sensor atau kata pilihan, supaya tidak tertukar.

Coba pikirkan dulu jawabanmu. Hentikan videonya sebentar kalau kamu perlu waktu.


## 1. Membaca petunjuk dari kotak

Pertama, kita pahami cara membaca petunjuknya. Kita belum tahu angka sensor A, B, dan C. Tetapi, kita tahu di kotak mana setiap apel berakhir, dan itulah petunjuknya.

Contohnya, apel seberat delapan berakhir di kotak ketiga dari kiri. Untuk sampai ke sana, apel itu belok ke kiri di sensor A, lalu belok ke kanan di sensor B, lalu belok ke kiri di sensor sembilan.

Belok ke kanan berarti beratnya sama dengan atau lebih besar dari angka sensor. Belok ke kiri berarti beratnya lebih kecil. Jadi, apel delapan memberi kita dua petunjuk. Angka sensor B paling besar delapan, dan angka sensor A lebih besar dari delapan.


## 2. Sensor C

Sekarang, kita mulai dari sensor C, karena petunjuknya paling jelas. Di bawah sensor C, ada dua kotak. Kotak kiri berisi apel tujuh belas dan apel delapan belas. Kotak kanan berisi apel dua puluh.

Apel delapan belas belok ke kiri. Artinya, delapan belas lebih kecil dari angka sensor C. Jadi, angka sensor C harus lebih besar dari delapan belas.

Apel dua puluh belok ke kanan. Artinya, dua puluh sama dengan atau lebih besar dari angka sensor C. Jadi, angka sensor C paling besar dua puluh. Kesimpulannya, angka sensor C adalah sembilan belas atau dua puluh.

Sekarang, lihat pilihan jawabannya. Di pilihan A, sensor C bernilai delapan belas, dan di pilihan B, tujuh belas. Keduanya terlalu kecil. Dengan angka delapan belas, apel delapan belas justru akan belok ke kanan. Jadi, pilihan A dan pilihan B kita coret.


## 3. Sensor A

Tinggal pilihan C dan pilihan D. Di pilihan C, sensor A bernilai dua belas. Di pilihan D, sensor A bernilai tiga belas. Mari kita lihat sensor A, yang ada di paling atas.

Semua apel yang belok ke kanan di sensor A berakhir di empat kotak sebelah kanan. Apel yang paling ringan di sana adalah apel dua belas. Karena apel dua belas belok ke kanan, angka sensor A paling besar dua belas.

Kalau sensor A bernilai tiga belas, apel dua belas lebih kecil dari tiga belas, jadi apel itu akan belok ke kiri. Apel itu akan masuk ke sisi kiri mesin, padahal di gambar ia ada di sisi kanan. Jadi, pilihan D salah, dan kita coret.

Di sisi kiri, apel yang paling berat adalah apel sembilan. Apel sembilan belok ke kiri di sensor A, jadi angka sensor A harus lebih besar dari sembilan. Angka dua belas memenuhi kedua syarat ini.


## 4. Memeriksa sensor B dan jawaban

Sekarang, hanya pilihan C yang tersisa, yaitu sensor A dua belas, sensor B tujuh, dan sensor C dua puluh. Tetapi, jangan langsung percaya. Kita periksa juga sensor B.

Di bawah sensor B, apel yang paling berat di sisi kiri adalah apel enam. Apel enam belok ke kiri, jadi angka sensor B harus lebih besar dari enam. Apel delapan belok ke kanan, jadi angka sensor B paling besar delapan. Angka tujuh ada di antara keduanya, jadi sensor B cocok.

Terakhir, kita jalankan beberapa apel dengan angka dari pilihan C. Apel delapan, apel dua belas, dan apel delapan belas jatuh tepat ke kotak yang sama dengan gambar soal.

Jadi, jawaban yang benar adalah pilihan C. Sensor A bernilai dua belas, sensor B bernilai tujuh, dan sensor C bernilai dua puluh.

Perhatikan bahwa setiap pilihan yang salah punya angka yang cocok. Misalnya, pilihan D cocok untuk sensor B dan sensor C, tetapi salah untuk sensor A. Karena itu, kita harus memeriksa ketiga sensor, bukan hanya satu.


## 5. Penutup

Perhatikan juga bahwa berat apel di kotak-kotak itu makin besar dari kiri ke kanan. Susunan bertingkat seperti ini disebut pohon pencarian biner, atau binary search tree. Komputer memakainya untuk menyimpan dan mencari data dengan cepat.

Dengan tiga pertanyaan saja, mesin ini memilah apel ke delapan kotak. Dengan cara yang sama, komputer cukup bertanya sekitar dua puluh kali untuk menemukan satu data di antara sejuta data.

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, cari apel terberat yang belok ke kiri dan apel teringan yang belok ke kanan. Kedua, ingat bahwa berat yang sama dengan angka sensor belok ke kanan. Ketiga, coret pilihan yang salah, lalu periksa pilihan yang tersisa.

Terima kasih kepada tim Bebras Taiwan yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!


---

## YouTube Short (±1:20)

Pertanyaan kait di atas: "Berapa angka sensor yang rusak?"

Mesin ini memilah apel menurut beratnya. Kalau berat apel sama dengan atau lebih besar dari angka sensor, apel jatuh ke kanan. Kalau lebih kecil, apel jatuh ke kiri.

Layar sensor A, B, dan C rusak. Dilihat dari kotak tempat setiap apel berakhir, berapa angka ketiga sensor itu? Coba pikirkan dulu.

Lihat sensor C. Apel delapan belas jatuh ke kiri, jadi angkanya lebih besar dari delapan belas. Apel dua puluh jatuh ke kanan, jadi angkanya paling besar dua puluh. Pilihan A dan B tercoret.

Lihat sensor A. Apel dua belas jatuh ke kanan, jadi angka sensor A paling besar dua belas. Pilihan D, dengan angka tiga belas, tercoret.

Jadi, jawabannya adalah pilihan C, yaitu dua belas, tujuh, dan dua puluh. Sensor B juga cocok, karena apel enam belok ke kiri dan apel delapan belok ke kanan.

Tonton pembahasan lengkapnya untuk melihat cara memeriksanya langkah demi langkah. Soal ini dibuat oleh tim Bebras Taiwan.
