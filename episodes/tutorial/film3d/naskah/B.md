## F06 Kamera sinematik (±10 menit)

Layar: shot 1 diputar dua kali. Pertama dengan kamera diam setinggi mata di pinggir jalan: motor lewat begitu saja dan terasa datar. Kedua dengan kamera rendah dekat genangan yang naik pelan saat motor lewat: terasa seperti film.

Adegan yang sama bisa terasa membosankan atau menegangkan, tergantung kameranya. Kamera yang diam setinggi mata membuat penonton seperti melihat dari trotoar. Kamera yang rendah di dekat genangan, lalu naik pelan saat motor lewat, membuat penonton merasa berada di dalam hujan bersama Mas Adit. Di bab ini, kita belajar empat alat kamera yang dipakai pembuat film sungguhan.

Layar: empat kartu bergantian, masing-masing dengan contoh gambar dari film kita: lensa lebar dan lensa jauh, gerakan kamera, fokus kabur, motion blur.

Alat pertama adalah lensa. Lensa lebar, misalnya dua puluh empat milimeter, memperlihatkan banyak hal sekaligus dan cocok untuk memperkenalkan tempat, seperti kota di shot satu. Lensa yang lebih panjang mendekatkan satu benda dan cocok untuk menunjukkan perasaan, seperti label paket di shot lima. Alat kedua adalah gerakan kamera, misalnya naik pelan, mengikuti dari belakang, atau mendekat perlahan. Alat ketiga adalah fokus kabur, atau depth of field. Benda yang penting terlihat tajam, sedangkan latar belakangnya kabur, sehingga mata penonton langsung tahu harus melihat ke mana. Alat keempat adalah motion blur, yaitu sedikit kabur pada benda yang bergerak cepat, seperti pada kamera sungguhan. Tanpa motion blur, roda dan tetes hujan terlihat patah-patah.

Layar: kartu "Kamera diam untuk lelucon": shot 3 diputar dengan kamera diam, kucing naik ke atas boks, lampu berubah hijau.

Ada satu aturan yang sering dipakai di film komedi. Saat ada lelucon, kamera justru dibuat diam. Kamera yang diam membuat penonton memperhatikan waktu dan reaksi, dan di situlah lucunya. Karena itu, selama jeda satu detik di shot tiga, kamera kita tidak bergerak sama sekali.

Layar: label "Prompt 6.1". Prompt diketik, jeda.

{{p_kamera}}

Kita meminta Claude mengikuti kolom gerakan kamera di storyboard, dan kita mengulang aturan terpenting, yaitu wajah kurir dan wajah anak tidak boleh terlihat. Sekali lagi, storyboard bekerja untuk kita.

Layar: terminal. Satu frame cek berjalan lebih dari sepuluh menit. Penanda waktu. Tombol Esc ditekan. Label "Prompt 6.2". Prompt diketik.

{{p_cek_cepat}}

Kameranya selesai ditulis, tetapi gambar ceknya macet. Setelah motion blur dan fokus kabur dinyalakan, satu gambar kecil butuh lebih dari sepuluh menit. Kita menghentikannya dengan Escape, lalu memberi aturan baru. Fitur yang mahal hanya dinyalakan untuk render akhir, dan saat memeriksa, cukup satu gambar per shot.

Layar: terminal, Claude mencoba menyimpan simulasi kain untuk 1.145 frame, waktu terus berjalan: 55 menit. Tombol Esc ditekan. Tulisan besar: "Sederhanakan rancangannya. Jangan mengoptimalkan hal yang bisa dibuang." Label "Prompt 6.3". Prompt diketik.

{{p_tanpa_simulasi}}

Ternyata penyebab utamanya adalah simulasi kain di tepi ponco. Setiap kali satu gambar dirender, Blender menghitung ulang kain itu dari frame pertama. Claude mencoba menyimpan hasil simulasinya, tetapi setelah lima puluh lima menit, ia masih berputar-putar mengukur. Ini pelajaran ketiga, dan mungkin yang paling penting. Kita bertanya pada diri sendiri, apakah penonton akan melihat bedanya? Jawabannya tidak. Jadi kita menghapus simulasi kain itu sama sekali, dan menggantinya dengan goyangan sederhana. Tujuh setengah menit kemudian, delapan gambar cek keluar dengan cepat.

Layar: lembar kontak delapan shot. Shot 2 dan shot 5 dilingkari merah. Label "Prompt 6.4". Prompt diketik. Hasil: label shot 5 terbaca, miring, hangat.

{{p_kamera_fix}}

Sekarang kita bisa melihat kedelapan shot sekaligus, dan dua di antaranya bermasalah. Di shot dua, kamera berada di dalam bahu kurir. Di shot lima, label paketnya gelap dan datar. Kita menyebut shot dan masalahnya, dan menegaskan bahwa shot lain tidak boleh berubah. Label di shot lima langsung membaik.

Layar: tiga percobaan shot 2 berdampingan: kamera di dalam bahu, kamera dari depan kurir, kamera di belakang bahu tetapi badan menutupi HP. Label "Prompt 6.5". Prompt diketik.

{{p_kamera_fix2}}

Shot dua lebih bandel. Pada percobaan kedua, kameranya malah berada di depan kurir, sehingga layar HP tidak terlihat. Kita memberi posisi yang lebih jelas, dan meminta Claude memeriksa angkanya dulu sebelum merender. Pada percobaan ketiga, kameranya sudah benar berada di belakang bahu, tetapi sekarang badan kurir menutupi HP dan jalan di depannya.

Layar: tulisan besar: "Kadang storyboard-nya yang harus diubah, bukan kodenya." Lalu tiga kotak kecil: close-up HP, kamera di seberang kali, motor keluar ke kiri. Label "Prompt 6.6". Prompt diketik, jeda. Hasil: empat gambar shot 2.

{{p_shot2_potong}}

Setelah tiga percobaan, kita berhenti dan berpikir sebagai sutradara. Masalahnya bukan di kode, tetapi di rancangan shot-nya. Satu kamera di belakang bahu tidak mungkin memperlihatkan layar HP, kali, dan toleh kepala sekaligus. Jadi kita mengubah storyboard. Shot dua dipotong menjadi tiga sudut. Pertama, close-up layar HP dengan tulisan "Belok kanan". Kedua, kamera diam di seberang kali, sehingga kita melihat motor berbelok dan mengerem tepat di bibir beton. Ketiga, kamera yang sama saat motor pergi ke kiri. Sembilan menit kemudian, shot dua akhirnya bercerita dengan jelas.

```
git add .
git commit -m "Shot 2 dipotong menjadi tiga sudut kamera"
```

Layar: gambar shot 1 dalam dua bingkai: 16:9 (lebar) dan 9:16 (tegak). Pada bingkai tegak, motor terlalu kecil dan toko di kiri-kanan terpotong.

Film kita juga harus menjadi Short dengan bingkai tegak. Masalahnya, gambar yang bagus dalam bingkai lebar belum tentu bagus dalam bingkai tegak.

Layar: label "Prompt 6.7". Prompt diketik, jeda. Lalu lembar kontak versi tegak, sembilan gambar berjajar.

{{p_tegak}}

Karena itu, setiap shot mendapat kamera kedua untuk versi tegak. Gerakannya sama, tetapi bidikannya diarahkan ke benda yang penting, dan lensanya dihitung otomatis supaya benda itu utuh. Kita juga meminta satu hal yang penting, yaitu tanpa pilihan tegak, hasilnya harus tetap versi lebar yang sama persis. Claude membuktikannya dengan membandingkan film sebelum dan sesudah perubahan.

Layar: lembar kontak versi tegak. Freeze, lalu commit.

```
git add .
git commit -m "Kamera sinematik untuk versi lebar dan tegak"
```

Sekarang film kita sudah bisa dilihat dalam dua bingkai, jadi kita simpan.

## F07 Suara, teks, dan sinkron (±6 menit)

Layar: shot 3 diputar tanpa suara, lalu diputar lagi dengan hujan, mesin motor, dan meong kucing. Perbedaannya terasa besar.

Gambar yang bagus baru terasa hidup setelah ada suaranya. Film kita tidak memakai narasi, jadi suaranya terdiri dari tiga lapisan. Lapisan pertama adalah suasana, yaitu hujan dan gemuruh kali. Lapisan kedua adalah efek suara, seperti mesin motor, rem, ketukan pintu, dan kucing. Lapisan ketiga adalah dua kalimat pendek, yaitu suara GPS dan suara anak di akhir film.

Layar: kolom Suara di STORYBOARD.md disorot baris demi baris.

Daftar suara ini sudah ada di kolom suara storyboard. Sekali lagi, storyboard bekerja untuk kita, karena AI tinggal membaca kolom ini dan tidak perlu menebak.

Layar: label "Prompt 7.1". Prompt diketik, jeda. Lalu folder suara/ terisi 25 berkas WAV, dan gelombang suara beberapa efek tampil sambil diputar: hujan, mesin, rem, meong.

{{p_sfx}}

Efek suara juga bisa dibuat dengan kode. Suara hujan sebenarnya adalah desis acak yang diperhalus. Suara mesin motor adalah dengung yang nadanya naik saat motor menambah kecepatan. Dengan cara ini, kita tidak perlu mengunduh suara dari internet. Python bawaan Blender sudah punya numpy, jadi kita tidak perlu memasang apa pun lagi. Lima menit kemudian, dua puluh lima efek suara sudah ada di folder suara.

Layar: gelombang suara meong buatan kode diputar. Lalu kartu: "Kurang meyakinkan? Rekam sendiri dengan HP, simpan dengan nama file yang sama."

Dengarkan hasilnya dengan jujur. Suara hujan dan mesin sudah meyakinkan, tetapi suara buatan kode tidak selalu sebagus suara sungguhan. Kalau ada yang kurang meyakinkan, kita boleh merekam suara sungguhan dengan HP, misalnya kucing tetangga atau ketukan di pintu rumah sendiri, lalu menaruhnya di folder suara dengan nama file yang sama.

Layar: dua kartu: "Rekam suaramu sendiri" (HP, ruangan tenang, satu file per kalimat) dan "Suara buatan" (layanan pengubah teks menjadi suara, perhatikan batas paket gratis dan aturan pemakaiannya). Lalu folder suara/ dengan gps.mp3 dan anak.mp3 disorot.

Untuk dua kalimat pendek di film, ada dua pilihan. Pilihan pertama adalah merekam suara sendiri dengan HP. Suara GPS bisa direkam dengan nada datar, dan suara anak bisa direkam oleh anggota keluarga, tentu dengan izin mereka. Pilihan kedua adalah layanan suara buatan. Kalau memakai layanan seperti ini, baca dulu aturan pemakaiannya, terutama untuk video yang dimonetisasi. Di film ini, saya memakai layanan suara buatan, lalu menaruh kedua filenya di folder suara dengan nama gps dot mp3 dan anak dot mp3.

Layar: label "Prompt 7.2". Prompt diketik, jeda. Hasil: tabel suara, shot, detik mulai, detik selesai.

{{p_sinkron}}

Suara harus pas dengan gambarnya. Rem harus berdecit tepat saat motor berhenti di tepi kali, bukan setengah detik sesudahnya. Karena itu, kita meminta waktu setiap suara diambil dari kode animasi, bukan dikira-kira. Suara GPS dipakai dua kali dari file yang sama, supaya nadanya persis sama, dan di situlah lucunya. Angka minus empat belas LUFS adalah ukuran kekerasan suara yang dipakai YouTube, jadi film kita tidak terdengar terlalu pelan atau terlalu keras dibanding video lain.

Layar: bagian laporan Claude "Hal yang perlu Anda putuskan" disorot, butir demi butir.

Bagian terpenting dari laporan Claude adalah bagian ini, yaitu hal yang perlu kita putuskan. Claude menulis dengan jujur bahwa ia mengecilkan suara kali dan mesin saat GPS berbicara, padahal kita hanya meminta hujan yang dikecilkan, karena kalau tidak, suara GPS sulit terdengar. Ia juga menulis bahwa beberapa waktu ia tentukan sendiri, seperti klakson dan desis lilin, karena kejadiannya tidak ada di animasi. Selalu baca bagian seperti ini. Di situlah AI memberi tahu kita keputusan apa saja yang ia ambil sendiri, dan kita yang menentukan apakah keputusan itu kita terima. Kali ini, semuanya masuk akal, jadi kita terima.

Layar: shot 2 diputar dengan semua suara. Freeze, lalu commit.

```
git add .
git commit -m "Efek suara, dua kalimat, dan subtitle"
```

Semua suara sudah siap. Di bab berikutnya, gambar dan suara ini kita satukan menjadi video.

## F08 Render menjadi MP4 (±8 menit)

Layar: satu frame film dalam dua versi berdampingan: gambar cek 480p yang berbintik, dan render akhir 1080p yang bersih.

Sampai di sini, kita hanya melihat gambar kecil yang cepat dibuat. Sekarang saatnya membuat gambar yang sesungguhnya. Proses ini disebut render, yaitu Blender menghitung perjalanan cahaya untuk setiap titik di setiap gambar. Film kita punya seribu delapan ratus gambar, jadi render adalah bagian yang paling lama, dan paling cocok dikerjakan oleh kartu grafis.

Layar: label "Prompt 8.1". Prompt diketik, jeda. Lalu render.py terbuka, sorot bagian "lewati frame yang sudah ada" dan bagian batas tekstur. Label "Salin dari: github.com/listyantidewi1/paket-terakhir/blob/main/render.py".

{{p_render}}

Ada tiga permintaan penting di prompt ini. Pertama, skrip memakai kartu grafis kalau ada, dan menuliskan perangkat mana yang dipakai, supaya kita tidak diam-diam merender dengan CPU yang jauh lebih lambat. Kedua, karena kartu grafis kita hanya punya memori empat gigabyte, skrip harus berhemat memori. Ketiga, dan ini yang paling penting, setiap gambar disimpan sebagai file sendiri, dan gambar yang sudah ada dilewati. Dengan begitu, kalau render terhenti di tengah malam karena listrik padam atau laptop tertidur, kita cukup menjalankan perintah yang sama, dan render melanjutkan dari gambar terakhir.

Layar: lembar kontak delapan shot sebelum poles. Tiga lingkaran merah: motor kecil di shot 2, ponco kaku di shot 6, kaki siluet anak seperti tongkat. Label "Prompt 8.2". Prompt diketik, jeda. Lalu sebelum dan sesudah untuk ketiganya.

{{p_poles}}

Sebelum render yang panjang, kita melihat kedelapan shot sekali lagi, karena memperbaiki sekarang jauh lebih murah daripada merender ulang. Ada tiga hal yang kita poles. Di shot dua, motor terlalu kecil dan kalinya tidak terbaca, jadi kamera didekatkan. Ponco kurir di depan pintu masih kaku. Kaki siluet anak masih seperti tongkat. Tiga puluh menit kemudian, shot dua jauh lebih jelas, dan siluet anak sudah berproporsi seperti anak kecil yang menyodorkan kue. Ponconya sudah mengilap basah, walaupun bentuknya masih sedikit kaku. Saya memutuskan itu sudah cukup untuk film pertama kita.

```
git add .
git commit -m "Poles shot 2, ponco, dan siluet anak"
git push
```
