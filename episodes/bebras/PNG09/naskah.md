# Pembahasan Soal Bebras Penggalang: Antrian Mobil (2018-CY-03)

Video pembahasan untuk kategori **Penggalang (SMP)**, seri "Pembahasan Soal Bebras" (kode PNG09). Isinya tidak terikat waktu. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan. Suara Kak Ceria, kecepatan 0,95 (intro1 dan intro2 dipakai ulang dari PNG08).

Soal asli: "Antrian Mobil", Tantangan Bebras 2018, usulan Siprus (kode I-2018-CY-03, penulis Pavlos Pavlikas), dari Buku Tantangan Bebras Indonesia 2018 tingkat SMP (Penggalang). Jalan, mobil, dan tabel digambar ulang dengan kode.

**Isi soal:** Ari punya jalan masuk yang panjang dan sempit di halamannya. Tetangga boleh parkir di situ, tetapi mobil hanya bisa keluar dengan mundur. Setiap pagi, mobil yang pergi keluar dulu, baru mobil lain masuk. Jadwal: Senin 0 keluar, masuk Ari, Bob; Selasa 1 keluar, masuk Kati, Ben, Roi; Rabu 2 keluar, masuk Desi; Kamis 0 keluar, masuk Fina, Rosa; Jumat 3 keluar, masuk Vino. Mobil siapa yang masih parkir pada akhir Jumat? Pilihan: A. Bob, Vino, Desi; B. Vino, Ari, Rosa; C. Ari, Kati, Vino; D. Ari, Vino, Bob.

**Jawaban: C. Ari, Kati, Vino.** Akhir Senin: Ari, Bob. Akhir Selasa: Ari, Kati, Ben, Roi. Akhir Rabu: Ari, Kati, Desi. Akhir Kamis: Ari, Kati, Desi, Fina, Rosa. Akhir Jumat: Ari, Kati, Vino. Diperiksa ulang dengan program (scratchpad cek2.py) dan di scenes.js.

Konsep: stack (tumpukan), LIFO, push dan pop. Ada dua jeda "pikirkan dulu".

## 0. Pembuka dan soal

Halo, teman-teman! Aku Kiko. Selamat datang di pembahasan soal Bebras. Kali ini, kita akan mengerjakan satu soal Bebras untuk tingkat SMP.
*[Visual: Papan tulis putih; tulisan "Tantangan Bebras"; empat berang-berang; Kiko di kiri.]*

Kita akan mengerjakannya pelan-pelan, satu langkah demi satu langkah. Jadi, kita tidak perlu menebak.
*[Visual: Tulisan tangan "pelan-pelan, satu langkah demi satu langkah".]*

Soal ini berjudul "Antrian Mobil". Soal ini berasal dari Tantangan Bebras tahun dua ribu delapan belas, dan dibuat oleh tim Bebras dari negara Siprus.
*[Visual: Bola dunia, bendera Siprus; kartu ASAL SOAL: judul, Bebras 2018, tim Bebras Siprus (dilingkari), kode 2018-CY-03, sumber buku Tantangan Bebras Indonesia 2018.]*

Setelah menonton video ini, kamu bisa melacak isi sebuah tempat yang hanya punya satu pintu, dengan aturan masuk terakhir keluar pertama.
*[Visual: Kartu judul "Antrian Mobil" dengan kalimat kait.]*

Sebelum membahasnya, mari kita pahami soalnya dulu. Ari punya jalan masuk yang panjang di halaman rumahnya. Jalan itu sempit, dan ujungnya buntu. Pintunya hanya satu, yaitu dari jalan raya.
*[Visual: Jalan masuk abu-abu yang panjang; ujung kiri buntu (rumah Ari), ujung kanan terbuka ke jalan raya; label "buntu" dan "pintu".]*

Para tetangga boleh ikut parkir di jalan itu. Karena jalannya sempit, mobil hanya bisa keluar dengan cara mundur. Jadi, mobil yang masuk terakhir berada paling dekat dengan pintu.
*[Visual: Tiga mobil contoh berwarna abu masuk berurutan; panah mundur ke pintu; mobil terakhir dilingkari "paling dekat pintu".]*

Supaya tidak ada mobil yang terhalang, Ari membuat jadwal. Setiap pagi, mobil yang akan pergi keluar lebih dulu. Setelah itu, barulah mobil lain masuk.
*[Visual: Kartu aturan: "Setiap pagi: keluar dulu, baru masuk".]*

Inilah jadwalnya. Pada hari Senin, tidak ada mobil yang keluar, lalu Ari masuk, disusul Bob. Pada hari Selasa, satu mobil keluar, lalu Kati, Ben, dan Roi masuk. Pada hari Rabu, dua mobil keluar, lalu Desi masuk.
*[Visual: Tabel jadwal muncul baris demi baris: Senin, Selasa, Rabu.]*

Pada hari Kamis, tidak ada mobil yang keluar, lalu Fina dan Rosa masuk. Pada hari Jumat, tiga mobil keluar, lalu Vino masuk.
*[Visual: Baris Kamis dan Jumat muncul.]*

Pertanyaannya adalah, mobil siapa saja yang masih parkir di jalan itu pada akhir hari Jumat? Pilihan A adalah Bob, Vino, dan Desi. Pilihan B adalah Vino, Ari, dan Rosa. Pilihan C adalah Ari, Kati, dan Vino. Pilihan D adalah Ari, Vino, dan Bob.
*[Visual: Kartu pertanyaan dan pilihan A–D.]*

## 1. Siapa yang keluar duluan?

Perhatikan, tabel tidak menyebut nama mobil yang keluar. Tabel hanya menyebut jumlahnya. Jadi, kita harus mencari tahu sendiri, mobil siapa yang keluar.
*[Visual: Kolom "Keluar" pada tabel dilingkari; tanda tanya "siapa?".]*

Ingat, mobil hanya bisa keluar dengan mundur. Mobil yang bisa keluar adalah mobil yang paling dekat dengan pintu, yaitu mobil yang masuk paling akhir. Mobil di belakangnya terhalang, sampai mobil di depannya pergi.
*[Visual: Mobil contoh paling dekat pintu mundur keluar (centang); mobil di belakangnya disilang "terhalang".]*

Pada hari Senin, Ari masuk lebih dulu, lalu Bob. Pada hari Selasa, satu mobil keluar. Mobil siapa itu? Coba pikirkan dulu.
*[Visual: Jam pasir PIKIRKAN DULU; mobil Ari dan Bob di jalan; baris Selasa disorot.]*

## 2. Menjalankan jadwal hari demi hari

Kita mulai dari hari Senin. Ari masuk lebih dulu, sehingga mobilnya berada paling dalam. Lalu Bob masuk, dan mobilnya berada di dekat pintu. Akhir Senin: Ari, Bob.
*[Visual: Mobil Ari masuk sampai ujung, lalu Bob; catatan "Senin: Ari, Bob".]*

Hari Selasa, satu mobil keluar. Mobil yang paling dekat dengan pintu adalah Bob, jadi Bob yang keluar. Lalu, Kati, Ben, dan Roi masuk. Akhir Selasa: Ari, Kati, Ben, Roi.
*[Visual: Bob mundur keluar; Kati, Ben, Roi masuk; catatan "Selasa: Ari, Kati, Ben, Roi".]*

Hari Rabu, dua mobil keluar. Yang pertama keluar adalah Roi, lalu Ben. Setelah itu, Desi masuk. Akhir Rabu: Ari, Kati, Desi.
*[Visual: Roi lalu Ben mundur keluar; Desi masuk; catatan "Rabu: Ari, Kati, Desi".]*

Sekarang giliranmu. Pada hari Kamis, Fina dan Rosa masuk. Pada hari Jumat, tiga mobil keluar, lalu Vino masuk. Siapa saja yang tersisa? Coba pikirkan dulu.
*[Visual: Jam pasir PIKIRKAN DULU; baris Kamis dan Jumat disorot.]*

Hari Kamis, tidak ada mobil yang keluar. Fina masuk, lalu Rosa. Akhir Kamis: Ari, Kati, Desi, Fina, Rosa.
*[Visual: Fina dan Rosa masuk; jalan berisi lima mobil; catatan "Kamis".]*

Hari Jumat, tiga mobil keluar. Yang pertama keluar adalah Rosa, lalu Fina, lalu Desi. Setelah itu, Vino masuk. Akhir Jumat: Ari, Kati, Vino.
*[Visual: Rosa, Fina, Desi mundur keluar satu per satu; Vino masuk; catatan "Jumat: Ari, Kati, Vino".]*

Jadi, mobil yang masih parkir pada akhir hari Jumat adalah milik Ari, Kati, dan Vino. Jawabannya adalah C.
*[Visual: Kartu jawaban "C. Ari, Kati, Vino".]*

Pilihan lain memuat nama Bob, Desi, atau Rosa. Padahal, Bob sudah keluar pada hari Selasa, sedangkan Desi dan Rosa keluar pada hari Jumat. Ari tidak pernah keluar, karena mobilnya selalu berada paling dalam.
*[Visual: Pilihan A, B, D dicoret; nama Bob, Desi, Rosa dilingkari merah.]*

## 3. Penutup

Kalau kamu bertemu soal seperti ini, ingat tiga langkahnya. Pertama, pahami di mana pintu masuk dan pintu keluarnya. Kedua, gambar isinya hari demi hari, dan catat siapa yang paling dekat dengan pintu. Ketiga, cocokkan hasil akhirnya dengan pilihan jawaban.
*[Visual: Tiga kartu langkah muncul satu per satu.]*

Dalam informatika, susunan seperti ini disebut stack, atau tumpukan. Yang masuk terakhir keluar paling dulu. Memasukkan data disebut push, dan mengeluarkannya disebut pop. Tombol undo juga bekerja dengan stack, karena yang dibatalkan adalah langkah terakhir.
*[Visual: Jalan diputar menjadi tumpukan tegak; panah push dan pop; ikon tombol undo.]*

Jadi, pada akhir hari Jumat, jalan itu berisi mobil Ari, Kati, dan Vino.
*[Visual: Jalan dengan tiga mobil Ari, Kati, Vino.]*

Terima kasih kepada tim Bebras Siprus yang membuat soal ini. Selamat berlatih, dan semoga sukses di Tantangan Bebras!
*[Visual: Kartu TERIMA KASIH dengan kredit soal; Kiko melambai.]*

## Short (vertikal)

Jalan parkir ini sempit, dan ujungnya buntu. Mobil hanya bisa keluar dengan mundur, jadi yang masuk terakhir harus keluar lebih dulu.

Senin, Ari dan Bob masuk. Selasa, satu mobil keluar, lalu Kati, Ben, dan Roi masuk. Rabu, dua keluar, lalu Desi masuk. Kamis, Fina dan Rosa masuk. Jumat, tiga keluar, lalu Vino masuk. Siapa yang tersisa? Coba pikirkan dulu.

Hari Selasa, yang keluar adalah Bob, karena mobilnya paling dekat dengan pintu. Hari Rabu, yang keluar adalah Roi, lalu Ben.

Hari Jumat, yang keluar adalah Rosa, Fina, lalu Desi. Setelah itu, Vino masuk.

Jadi, yang tersisa adalah Ari, Kati, dan Vino. Jawabannya C. Aturan masuk terakhir keluar pertama ini disebut stack.

Tonton pembahasan lengkapnya, ya! Soal ini dibuat oleh tim Bebras Siprus.
