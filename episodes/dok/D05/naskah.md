# Bagaimana TikTok Tahu Apa yang Kamu Suka?

Dokumenter animasi ±9–10 menit untuk penonton umum, channel I Teach Software Engineering (@iTeachSWE).
Draf naskah 1 (10 Nov 2026), menunggu suntingan Bu Dewi. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan.
Gaya, narator (Bian), musik, dan Bip sama dengan D01–D04. Tanpa suara tokoh (hanya narasi Bian), jadi tidak perlu suara peran tambahan.
Aplikasi digambar generik: layar HP dengan feed video vertikal berlabel "Untukmu", tanpa logo, warna khas, atau ikon merek TikTok, YouTube, Netflix, maupun Instagram. Nama perusahaan hanya disebut dalam narasi dan label teks. Tokoh Raka, Nadia, dan Yoga adalah rekaan. Orang sungguhan tidak digambar.
Tempo: visualisasi tabel selera (bab 3) dan perhitungan skor (bab 5) diberi jeda tayang tanpa narasi (`holds`), dengan angka setiap langkah tetap terlihat.

---

## 0. Pembuka (±0:45)

Kemarin malam, Raka menonton satu video kucing oranye yang jatuh dari sofa, dan ia menontonnya sampai habis.
*[Visual: kamar malam, lampu tidur; HP generik di tangan tanpa ciri; video kucing oranye jatuh dari sofa; garis kemajuan video penuh sampai ujung.]*

Pagi ini, ketika ia membuka aplikasi lagi, layarnya dipenuhi kucing. Ada kucing yang tidur, kucing yang marah, dan kucing yang takut pada timun.
*[Visual: Raka menggeser layar; video kucing muncul satu demi satu; Bip mengintip dari balik HP dan ikut terheran.]*

Rasanya seperti aplikasi itu bisa membaca pikiran. Padahal, Raka tidak pernah mengetik kata "kucing" sama sekali.
*[Visual: kolom pencarian kosong dengan kursor berkedip; gelembung pikiran Raka berisi kucing; tanda tanya besar.]*

Bagaimana sebuah aplikasi bisa tahu apa yang kamu suka, dan apakah ia benar-benar mengenalmu?
*[Visual: judul video muncul: "Bagaimana TikTok Tahu Apa yang Kamu Suka?"]*

## 1. Terlalu banyak untuk ditonton (±0:50)

Setiap hari, orang di seluruh dunia mengunggah video pendek dalam jumlah yang sangat besar. Kalau kamu menonton tanpa tidur sepanjang hidupmu, kamu tetap tidak akan bisa menonton semuanya.
*[Visual: hujan kartu video kecil yang terus turun dari langit; Bip membawa ember kecil dan kewalahan; jam pasir berputar berkali-kali.]*

Karena itu, aplikasi harus memilih. Dari sekian banyak video, hanya beberapa yang muncul di layarmu berikutnya. Proses memilih ini disebut sistem rekomendasi.
*[Visual: corong raksasa; kartu video masuk dari atas, hanya beberapa yang keluar di bawah dan masuk ke layar HP; label "sistem rekomendasi".]*

Sistem rekomendasi adalah algoritma, yaitu langkah-langkah yang jelas, yang menebak video mana yang paling mungkin kamu tonton. Ia tidak membaca pikiran. Ia menghitung kebiasaan.
*[Visual: corong berubah menjadi kartu langkah bernomor; kata "membaca pikiran" dicoret, diganti "menghitung kebiasaan".]*

## 2. Bertanya pada orang yang seleranya mirip (±0:55)

Ide dasarnya sudah ada jauh sebelum video pendek. Pada awal tahun seribu sembilan ratus sembilan puluhan, para peneliti di laboratorium Xerox PARC di Amerika Serikat kebanjiran email.
*[Visual: kantor tahun 1990-an bergaya; monitor tabung; kotak masuk email meluap menjadi tumpukan amplop yang tumpah ke lantai; label "Xerox PARC, awal 1990-an".]*

Mereka membuat sistem bernama Tapestry. Pengguna bisa memberi tanda pada pesan yang menarik, lalu orang lain bisa menyaring pesan berdasarkan tanda dari teman-temannya. Mereka menamai cara ini collaborative filtering, artinya menyaring bersama-sama.
*[Visual: amplop diberi stiker bintang oleh beberapa tangan tanpa ciri; saringan besar meloloskan amplop berbintang; label "Tapestry (1992)" dan "collaborative filtering = menyaring bersama".]*

Kita juga sering melakukannya. Kalau kamu bingung memilih jajanan di kantin, kamu bertanya pada teman yang seleranya mirip denganmu, bukan pada sembarang orang.
*[Visual: kantin sekolah; Raka melihat deretan jajanan; ia menoleh ke Nadia yang memegang bakso yang sama seperti kesukaannya; Nadia menunjuk cireng; Raka mengangguk.]*

## 3. Tabel selera (±1:10)

Bayangkan sebuah tabel. Barisnya adalah orang, dan kolomnya adalah video. Setiap kotak berisi tanda apakah orang itu menonton video tersebut sampai habis.
*[Visual: tabel besar muncul pelan; baris Raka, Nadia, Yoga; kolom lima video bergambar ikon kucing, sepak bola, masak, gitar, kucing lain; centang hijau dan silang abu-abu diisi satu per satu. Tahan.]*

Raka dan Nadia sama-sama menonton video kucing dan video masak sampai habis. Yoga lebih suka sepak bola. Jadi, selera Raka lebih mirip dengan Nadia daripada dengan Yoga.
*[Visual: baris Raka dan Nadia disorot; kotak yang sama diberi garis penghubung; penghitung "kesamaan: 2 dari 2" untuk Raka–Nadia dan "0 dari 2" untuk Raka–Yoga. Tahan.]*

Nadia juga menonton video gitar sampai habis, sedangkan Raka belum pernah melihatnya. Maka, sistem menebak bahwa Raka mungkin juga akan suka video gitar itu.
*[Visual: kotak kosong Raka di kolom gitar berkedip dengan tanda tanya; panah dari centang Nadia ke kotak itu; tanda tanya berubah menjadi "mungkin suka". Tahan.]*

Pada tahun dua ribu enam, Netflix mengadakan lomba berhadiah satu juta dolar untuk siapa saja yang bisa menebak selera penonton sepuluh persen lebih tepat daripada sistem mereka sendiri. Tabelnya berisi lebih dari seratus juta penilaian dari hampir setengah juta pelanggan.
*[Visual: tabel kecil tadi mundur dan membesar menjadi tabel raksasa yang tak terlihat ujungnya; label "100 juta penilaian, 480 ribu penonton, 17.770 film"; piala generik bertuliskan "$1.000.000" (tanpa logo).]*

Lomba itu baru dimenangkan tiga tahun kemudian, pada tahun dua ribu sembilan, dengan selisih sepuluh koma nol enam persen. Pemenangnya adalah gabungan beberapa tim dari berbagai negara, yang menggabungkan ratusan cara menebak.
*[Visual: grafik garis "ketepatan" naik pelan dari 2006 sampai 2009, menyentuh garis target 10% tepat di 2009; label "10,06%"; beberapa bendera kecil bergaya tanpa lambang; label "BellKor's Pragmatic Chaos".]*

## 4. Sinyal kecil yang kamu kirim (±1:05)

Aplikasi video pendek tidak hanya melihat tanda suka. Pada tahun dua ribu dua puluh, TikTok menjelaskan bahwa feed Untukmu disusun dari tiga jenis petunjuk.
*[Visual: layar HP generik dengan feed "Untukmu"; tiga laci muncul di bawahnya, masih tertutup.]*

Petunjuk pertama adalah apa yang kamu lakukan, misalnya video yang kamu sukai, bagikan, komentari, akun yang kamu ikuti, dan video yang kamu buat sendiri. Petunjuk kedua adalah isi videonya, misalnya keterangan, suara, dan tagar. Petunjuk ketiga adalah pengaturan HP dan akunmu, misalnya bahasa dan negara.
*[Visual: laci 1 terbuka berisi ikon hati, panah bagikan, gelembung komentar, tombol ikuti; laci 2 berisi teks keterangan, not musik, tanda pagar; laci 3 berisi bola dunia dan huruf "Aa".]*

Ketiga petunjuk itu tidak sama berat. Menurut penjelasan itu, menonton video yang lebih panjang sampai habis adalah tanda minat yang kuat, sedangkan bahasa dan negara diberi bobot yang lebih kecil.
*[Visual: timbangan besar; balok "tonton sampai habis" jatuh berat ke satu sisi; balok kecil "bahasa" dan "negara" hanya menggeser sedikit. Tahan.]*

Menariknya, jumlah pengikut seorang kreator bukan penentu langsung. Video dari akun kecil tetap bisa sampai ke banyak orang kalau banyak penonton menontonnya sampai habis.
*[Visual: dua akun generik, satu berlabel "2 jt pengikut", satu "35 pengikut"; video akun kecil disukai beberapa orang, lalu menyebar ke lingkaran penonton yang makin lebar.]*

Artinya, kamu tidak perlu menekan tombol apa pun untuk memberi tahu seleramu. Berhenti dua detik lebih lama di satu video saja sudah menjadi sinyal.
*[Visual: jempol Raka berhenti sebentar; stopwatch kecil menunjukkan "+2 detik"; titik cahaya kecil terbang dari layar menuju server bergaya di kejauhan.]*

## 5. Menghitung skor, lalu mengurutkan (±1:10)

Lalu bagaimana sistem memilih satu video dari jutaan? Pada tahun dua ribu enam belas, tim YouTube menerbitkan makalah yang menjelaskan sistem rekomendasi mereka dalam dua tahap.
*[Visual: tumpukan kartu video setinggi gedung; label "jutaan video"; makalah generik berlabel "YouTube, 2016" (tanpa logo).]*

Tahap pertama adalah menyaring kasar. Dari jutaan video, sistem mengambil beberapa ratus yang kira-kira cocok, misalnya video kucing dan video masak untuk Raka.
*[Visual: saringan kasar; tumpukan raksasa menyusut menjadi sekitar seratus kartu; penghitung "jutaan → ratusan". Tahan.]*

Tahap kedua adalah menghitung skor setiap kandidat dengan lebih teliti. Misalnya, video kucing tidur diperkirakan ditonton sampai habis dengan peluang delapan puluh persen, video masak enam puluh persen, dan video berita sepak bola hanya dua puluh persen.
*[Visual: tiga kartu besar berjajar; di bawah tiap kartu bar peluang terisi pelan: 80%, 60%, 20%; angka muncul jelas. Tahan.]*

Sistem juga bisa menambahkan petunjuk lain, misalnya peluang kamu menyukai atau membagikan video itu. Setelah setiap video punya skor, video diurutkan dari skor tertinggi, lalu yang teratas muncul di layarmu.
*[Visual: tiap kartu mendapat bar kedua yang lebih kecil "suka"; bar digabung menjadi satu angka skor; kartu bergerak menyusun urutan 1, 2, 3; kartu nomor 1 meluncur ke layar HP Raka. Tahan.]*

Semua perhitungan ini terjadi dalam sekejap, setiap kali kamu menggeser layar.
*[Visual: jempol menggeser; seluruh proses dari tumpukan, saringan, sampai urutan diputar cepat dalam satu detik; stopwatch "< 1 detik".]*

## 6. Belajar dari setiap geseran (±0:55)

Sistem rekomendasi tidak selesai setelah memilih. Setiap kali kamu menonton, melewati, atau mengulang video, tabel seleramu diperbarui, lalu tebakan berikutnya ikut berubah.
*[Visual: lingkaran panah berputar: "tonton" → "catat" → "hitung ulang" → "tampilkan" → kembali ke "tonton"; tabel selera Raka berubah sedikit di setiap putaran.]*

Bagaimana dengan pengguna baru yang belum punya catatan? Aplikasi bisa memintanya memilih minat, seperti hewan atau jalan-jalan. Kalau ia melewatinya, aplikasi menampilkan video-video yang sedang populer dulu.
*[Visual: layar pilihan minat dengan kotak "hewan", "jalan-jalan", "masak", "olahraga"; tombol "lewati" ditekan; feed berisi video populer dengan ikon api.]*

Kadang, sistem sengaja menyelipkan video yang berbeda dari biasanya, untuk menguji apakah kamu punya minat baru. Mirip penjual di warung langganan yang sesekali menawarkan menu baru, karena ia ingin tahu apakah kamu juga suka.
*[Visual: deretan video kucing; satu kartu berbeda (video menanam cabai) diselipkan dengan label kecil "coba yang baru?"; warung bergaya, penjual menyodorkan piring kecil "menu baru" kepada Raka.]*

## 7. Gelembung yang makin sempit (±1:00)

Masalahnya, sistem yang terus memberi apa yang kamu suka bisa membuat duniamu menyempit. Pada tahun dua ribu sebelas, penulis Eli Pariser menyebut hal ini filter bubble, atau gelembung saringan.
*[Visual: Raka duduk di dalam gelembung bening; dinding gelembung dipenuhi video kucing; di luar gelembung, video lain (sains, musik, berita) samar dan tidak terdengar; label "filter bubble (Eli Pariser, 2011)".]*

Di dalam gelembung, kamu lebih sering melihat hal yang sama, dan pendapat yang berbeda makin jarang muncul. Lama-lama, kita bisa mengira semua orang berpikir seperti kita.
*[Visual: gelembung mengecil pelan; Raka mengintip keluar dan melihat Yoga di gelembung lain penuh sepak bola; keduanya tidak saling melihat.]*

Sistem juga bisa salah membaca sinyal. Kalau kamu berhenti lama di video yang membuatmu kesal atau sedih, sistem tidak tahu perasaanmu. Ia hanya mencatat bahwa kamu menonton lebih lama.
*[Visual: Raka menonton video bergaya "bikin kesal" dengan wajah cemberut; stopwatch mencatat "+15 detik"; tabel selera menambah centang tanpa tahu ekspresinya; Bip menggeleng.]*

TikTok menyatakan bahwa feed mereka biasanya tidak menampilkan dua video berturut-turut dengan suara atau kreator yang sama, dan berusaha memberi video yang beragam. Tetapi tidak ada sistem yang sempurna.
*[Visual: deretan kartu; dua kartu dengan not musik yang sama dipisah oleh kartu lain; timbangan "suka" dan "beragam" berayun pelan tanpa berhenti.]*

## 8. Kendali ada di jempolmu (±1:00)

Kabar baiknya, kamu bisa ikut mengarahkan sistem ini. Kalau kamu menekan lama sebuah video lalu memilih "Tidak tertarik", kamu memberi sinyal yang jelas bahwa kamu tidak ingin video seperti itu.
*[Visual: jempol menekan lama kartu video; menu generik muncul dengan pilihan "Tidak tertarik"; tabel selera menambah silang tebal.]*

Kamu juga bisa menyembunyikan video dari kreator atau suara tertentu. Sejak tahun dua ribu dua puluh tiga, ada pilihan untuk menyegarkan feed Untukmu, sehingga rekomendasi dimulai lagi seperti akun baru.
*[Visual: pilihan "sembunyikan kreator" dan "sembunyikan suara"; lalu tombol "segarkan feed" ditekan; tabel selera Raka memudar dan kembali kosong; deretan video populer muncul.]*

Di Eropa, aturan bernama Digital Services Act mewajibkan platform besar memberi pilihan feed yang tidak dipersonalisasi. Pengguna di sana bisa mematikan personalisasi, lalu yang muncul adalah video yang populer di daerahnya dan di seluruh dunia.
*[Visual: peta Eropa bergaya tanpa bendera negara; sakelar "personalisasi" digeser ke mati; feed berubah menjadi video populer dengan ikon bola dunia; label "Digital Services Act (Uni Eropa), 2023".]*

Cara paling sederhana tetap ada padamu. Kamu bisa mencari sendiri topik yang ingin kamu pelajari, mengikuti akun yang memberi ilmu, dan sadar bahwa setiap detik tontonanmu adalah suara yang dihitung.
*[Visual: Raka mengetik "cara menanam cabai" di kolom pencarian; feed mulai berisi video tanaman; ikon stopwatch kecil berubah menjadi ikon kotak suara.]*

## 9. Penutup (±0:50)

Jadi, apakah aplikasi itu benar-benar mengenalmu? Sebenarnya tidak. Ia tidak tahu kenapa kamu tertawa, sedih, atau penasaran. Ia hanya menghitung apa yang kamu lakukan, lalu menebak dari kebiasaan jutaan orang lain yang mirip denganmu.
*[Visual: tabel selera raksasa memudar menjadi titik-titik cahaya; satu titik membesar menjadi Raka yang memegang HP; label "kebiasaan, bukan pikiran".]*

Semakin kamu paham cara kerjanya, semakin kamu bisa memilih, apakah kamu yang mengendalikan layarmu, atau layarmu yang mengendalikanmu.
*[Visual: Raka meletakkan HP, lalu mengambil pot cabai di jendela; matahari pagi; gelembung bening pecah pelan menjadi banyak warna.]*

Sebagai catatan, naskah video ini disusun dengan bantuan AI, termasuk Claude buatan Anthropic, lalu diperiksa fakta dan disunting oleh manusia.
*[Visual: kartu kecil "Naskah: disusun dengan bantuan AI, diperiksa dan disunting manusia" dengan ikon pensil dan centang.]*

Kalau kamu ingin memahami cara kerja teknologi di sekitarmu, subscribe channel I Teach Software Engineering. Sampai jumpa di cerita berikutnya.
*[Visual: kartu akhir dengan Bip dan youtube.com/@iTeachSWE.]*

---

## Catatan untuk Bu Dewi (hal yang perlu diputuskan)

1. **Judul.** Usulan lama memakai nama TikTok. Nama boleh disebut (D04 juga menyebut Anthropic dan OpenAI), dan gambarnya tetap generik. Alternatif tanpa merek: "Bagaimana Aplikasi Tahu Video yang Kamu Suka?".
2. **Tanpa angka unggahan per hari.** Angka "berapa juta video per hari" tidak pernah diumumkan resmi dan sumber sekundernya berbeda-beda, jadi bab 1 sengaja tidak memakai angka.
3. **Pilihan mematikan personalisasi** hanya disebut untuk Eropa, karena itu yang terdokumentasi. Ketersediaannya di Indonesia belum dipastikan, sehingga tidak dibacakan.
4. **Contoh skor di bab 5** (80%, 60%, 20%) adalah angka ilustrasi, bukan data asli; di layar diberi label kecil "contoh".

---

## Sumber (untuk deskripsi YouTube)

Primer = dokumen dari pihak yang bersangkutan; sekunder = laporan pihak lain.

- TikTok (18 Jun 2020). How TikTok recommends videos #ForYou. https://newsroom.tiktok.com/how-tiktok-recommends-videos-for-you/?lang=en (primer, dibaca langsung). Isi: tiga kelompok faktor (interaksi pengguna; informasi video seperti keterangan, suara, tagar; pengaturan perangkat dan akun seperti bahasa dan negara, "lower weight"); menonton video yang lebih panjang sampai habis adalah "a strong indicator of interest"; jumlah pengikut dan riwayat video sukses bukan faktor langsung; pengguna baru memilih kategori minat, atau mendapat feed video populer bila melewatinya; "Not Interested", sembunyikan kreator/suara; risiko "filter bubble"; feed umumnya tidak menampilkan dua video berturut-turut dengan suara atau kreator yang sama. Keyakinan tinggi.
- TikTok (Feb–Mar 2023). Fitur menyegarkan feed Untukmu (diuji Feb 2023, diluncurkan Mar 2023). https://techcrunch.com/2023/02/02/tiktok-introduces-a-strike-system-for-violations-tests-a-feature-to-refresh-the-for-you-feed/ , https://9to5mac.com/2023/03/16/tiktok-rolling-out-for-you-feed-reset-button/ (sekunder). Keyakinan tinggi.
- TikTok (Agu 2023). Compliance with the Digital Services Act. https://newsroom.tiktok.com/en-eu/compliance-digital-services-act-eu (primer, dibaca langsung). Isi: pengguna di Eropa (EEA) bisa mematikan personalisasi; feed lalu menampilkan "locally relevant and globally popular videos". Pendukung: https://techcrunch.com/2023/08/04/tiktok-algorithm-dsa/ . Keyakinan tinggi.
- Goldberg, D., Nichols, D., Oki, B. M., Terry, D. (1992). Using collaborative filtering to weave an information tapestry. Communications of the ACM 35(12). Laporan teknis Xerox PARC CSL-92-10: https://ftp.mirrorservice.org/sites/www.bitsavers.org/pdf/xerox/parc/techReports/CSL-92-10_Using_Collaborative_Filtering_to_Weave_an_Information_Tapestry.pdf (primer). Isi: sistem Tapestry untuk menyaring email/berita, istilah "collaborative filtering". Keyakinan tinggi.
- Netflix Prize (2006–2009). https://en.wikipedia.org/wiki/Netflix_Prize (sekunder, dibaca langsung). Isi: dimulai 2 Okt 2006; 100.480.507 penilaian, 480.189 pengguna, 17.770 film; hadiah US$1.000.000 untuk perbaikan 10%; dimenangkan BellKor's Pragmatic Chaos, diumumkan 18 Sep dan diserahkan 21 Sep 2009, perbaikan 10,06%. Pendukung: https://www.popsci.com/scitech/article/2009-09/former-rivals-team-claim-1-million-netflix-prize/ . Keyakinan tinggi. (Gabungan tim dari Amerika Serikat, Austria, Kanada, dan Israel; tidak dibacakan rinci.)
- Covington, P., Adams, J., Sargin, E. (2016). Deep Neural Networks for YouTube Recommendations. RecSys 2016 (primer). Isi: dua tahap, candidate generation (dari jutaan menjadi ratusan) lalu ranking. Keyakinan tinggi; perlu dibuka langsung sebelum suara dibuat.
- Pariser, E. (2011). The Filter Bubble: What the Internet Is Hiding from You. Penguin Press (primer untuk istilah). Keyakinan tinggi.

Kalimat untuk deskripsi: "Naskah video ini disusun dengan bantuan AI, termasuk Claude buatan Anthropic, lalu diperiksa fakta dan disunting manusia."
