## F02 Dari ide ke storyboard (±6 menit)

Layar: dua kolom. Kiri: prompt satu baris "buatkan film animasi tentang kurir", panah ke hasil acak yang berantakan. Kanan: storyboard rapi, panah ke film jadi.

Kesalahan paling umum saat membuat animasi dengan AI adalah langsung meminta filmnya. Kalau kita hanya menulis "buatkan film animasi tentang kurir", AI harus menebak ceritanya, gayanya, durasinya, dan gerakan kameranya sekaligus. Hasilnya acak, dan setiap kali diulang, hasilnya berbeda. Karena itu, kita menulis storyboard lebih dulu.

Layar: VS Code, terminal di bawah, "claude" diketik. Label "Prompt 2.1". Prompt diketik pelan, jeda setelah selesai.

{{p_storyboard}}

Kita membuka Claude Code di terminal VS Code, lalu menulis prompt ini. Perhatikan tiga hal. Pertama, kita menjelaskan ceritanya dari awal sampai akhir, termasuk gayanya. Kedua, kita meminta bentuk hasil yang jelas, yaitu tabel delapan shot. Ketiga, kita menulis "jangan menulis kode dulu", supaya AI tidak buru-buru membuat program sebelum rencananya kita setujui.

Layar: STORYBOARD.md terbuka di editor, tabel 8 shot. Sorot kolom detik, lalu kolom suara.

Ini storyboard pertama yang ditulis Claude. Sekilas, tabelnya terlihat rapi dan lengkap. Sekarang kita periksa dengan teliti, karena storyboard adalah tempat termurah untuk memperbaiki kesalahan. Mengganti satu kalimat di sini hanya butuh beberapa detik, sedangkan mengganti adegan yang sudah dirender bisa butuh berjam-jam.

Layar: kartu "Tiga pemeriksaan storyboard". Lalu tiga baris tabel disorot merah satu per satu: shot GPS, shot kucing, shot pintu.

Ada tiga hal yang kita periksa. Pertama, setiap shot hanya membawa satu ide. Kedua, karena film ini tanpa narasi, ceritanya harus bisa dipahami hanya dari gambar dan suara. Ketiga, setiap lelucon harus benar-benar ada di layar. Di sinilah kita menemukan tiga masalah. Di shot GPS, Claude hanya menulis bahwa GPS mengarah ke jalan kecil di tepi kali, dan ia sengaja membuang suara GPS supaya film tetap tanpa narasi. Akibatnya, leluconnya hilang. Di shot kucing, kucingnya turun sendiri lalu lari, padahal lucunya justru karena kucing itu tidak mau turun. Di shot pintu, wajah anak diterangi cahaya lilin, padahal kita ingin wajahnya tidak pernah terlihat.

Layar: tulisan besar: "AI tidak tahu mana yang lelucon, kalau kita tidak bilang."

Ini bukan kesalahan AI sepenuhnya. Di prompt pertama, kita hanya menulis kejadiannya, tetapi tidak menulis maksudnya. AI tidak tahu bagian mana yang seharusnya lucu, kalau kita tidak mengatakannya.

Layar: label "Prompt 2.2". Prompt perbaikan diketik, jeda, tabel berubah, baris yang berubah disorot hijau.

{{p_storyboard_fix}}

Di prompt perbaikan, kita menjelaskan tiga lelucon itu satu per satu, lengkap dengan alasannya. Hasilnya jauh lebih baik. Sekarang GPS berkata "Belok kanan" dua kali dengan nada yang persis sama, dan motor mengerem tepat di bibir kali. Kucing duduk di atas boks paket, lampu berubah hijau, lalu ada satu detik hening sebelum kurir turun dan mengangkatnya. Anak di akhir film menjadi siluet gelap, dan ia hanya mengucapkan satu kalimat. Claude juga menambahkan daftar aturan kontinuitas di bawah tabel, dan total durasinya tetap tujuh puluh lima detik.

Layar: berkas baru CLAUDE.md, aturan diketik satu per satu, setiap baris disorot saat dijelaskan. Label "Salin dari: github.com/listyantidewi1/paket-terakhir/blob/main/CLAUDE.md".

{{claude_md}}

Sebelum menulis kode, kita membuat satu berkas lagi bernama CLAUDE.md. Berkas ini kita ketik sendiri. Claude Code selalu membaca berkas ini setiap kali mulai bekerja, jadi aturan di dalamnya tidak perlu kita ulang di setiap prompt. Aturan pertama menjelaskan cara kerja proyek ini, yaitu film tidak disusun dengan mouse, tetapi dibangun oleh skrip Python yang dijalankan Blender. Aturan kedua mengatur aset dari luar. Kita hanya memakai aset berlisensi CC0, dan setiap aset dicatat di ASET.md, supaya kita selalu tahu asal setiap tekstur di film kita. Aturan tentang semesta Kota Senja menjaga supaya warna helm, jas hujan, motor, dan nama jalannya sama dengan game Kurir Senja yang akan kita bangun di video lain. Ada juga aturan tentang laptop. Render akhir akan dikerjakan di laptop dengan kartu grafis empat gigabyte, jadi tekstur paling besar berukuran dua K. Aturan tentang gambar kecil juga sangat penting, karena satu render penuh bisa memakan waktu berjam-jam, sedangkan gambar kecil selesai jauh lebih cepat.

Layar: terminal, perintah commit diketik, jeda, hasil. Freeze.

```
git add .
git commit -m "Storyboard dan aturan proyek"
```

Storyboard dan aturan sudah kita setujui, jadi kita simpan dengan commit.

## F03 Kerangka: kode yang membangun film (±6 menit)

Layar: animasi buku flipbook: halaman dibalik cepat, bola memantul. Angka "frame 1, 2, 3 …" muncul di pojok setiap halaman.

Video sebenarnya adalah kumpulan gambar diam yang ditampilkan dengan cepat, seperti buku flipbook. Film kita memakai dua puluh empat gambar per detik, seperti film bioskop, jadi film tujuh puluh lima detik terdiri dari seribu delapan ratus gambar. Setiap gambar ini disebut frame.

Layar: timeline Blender digambar sederhana. Bola di frame 1 (kiri) dan frame 48 (kanan) diberi tanda wajik. Di antaranya bola bergerak sendiri. Lalu dua kurva: garis lurus dan kurva lembut.

Kita tidak perlu mengatur seribu delapan ratus gambar itu satu per satu. Kita cukup menentukan posisi benda pada beberapa frame penting, misalnya bola di kiri pada frame satu dan di kanan pada frame empat puluh delapan. Tanda ini disebut keyframe. Blender mengisi gerakan di antaranya secara otomatis. Blender juga membuat gerakannya mulai dengan pelan, lalu cepat, lalu melambat sebelum berhenti, seperti benda di dunia nyata. Perlambatan ini disebut easing, dan gerakan dengan easing terasa jauh lebih hidup daripada gerakan dengan kecepatan tetap.

Layar: diagram alur: berkas Python di kiri, panah "blender --background", berkas film.blend di tengah, panah ke "gambar cek" dan "buka di Blender".

Cara kerja proyek kita begini. Claude Code menulis skrip Python. Skrip itu dijalankan oleh Blender tanpa membuka jendelanya, lalu skrip membangun seluruh film dan menyimpannya sebagai berkas film dot blend. Berkas ini bisa kita buka di Blender untuk dilihat, atau kita render menjadi gambar. Kalau ada yang salah, kita tidak memperbaikinya dengan mouse, tetapi meminta Claude memperbaiki skripnya, lalu membangun ulang. Dengan cara ini, seluruh film bisa dibuat ulang dari nol kapan saja hanya dengan satu perintah.

Layar: terminal Claude Code, "/exit" diketik, lalu "claude" diketik lagi.

Sebelum melanjutkan, kita keluar dari Claude Code dengan mengetik slash exit, lalu membukanya lagi. Dengan sesi yang baru, berkas CLAUDE.md yang tadi kita tulis pasti terbaca.

Layar: label "Prompt 3.1". Prompt diketik, jeda. Lalu daftar berkas baru muncul di panel kiri VS Code, satu per satu disorot.

{{p_kerangka}}

Prompt ini meminta kerangkanya saja, tanpa isi adegan. Daftar shot ditulis di satu berkas, supaya kalau durasi shot berubah, kita cukup mengubah satu tempat. Setiap shot mendapat kameranya sendiri, dan Blender berpindah kamera sesuai tanda di timeline. Berkas cek dot py adalah alat pemeriksa kita. Alat ini merender beberapa gambar kecil dan menyusunnya dalam satu lembar, seperti lembar kontak foto.

Layar: Claude Code menampilkan permintaan izin menjalankan perintah. Pilihan nomor 3 "Yes, and switch to auto mode" disorot, lalu dipilih.

Saat bekerja, Claude meminta izin untuk menjalankan Blender. Kita membaca dulu perintahnya. Karena perintah itu hanya membangun dan merender di folder proyek kita, kita memilih pilihan ketiga, sehingga Claude tidak perlu bertanya lagi untuk perintah sejenis.

Layar: film/waktu.py terbuka. Sorot baris perhitungan frame dari detik, lalu baris daftar shot. Label "Salin dari: github.com/listyantidewi1/paket-terakhir/blob/main/film/waktu.py".

Kita baca dulu kode yang paling penting, yaitu waktu dot py. Baris ini mengalikan jumlah detik dengan dua puluh empat untuk mendapat nomor frame. Daftar di bawahnya menyalin tabel detik dari storyboard. Kode ini pendek, jadi kita bisa memahaminya dalam satu menit. Kalau ada bagian yang tidak kamu pahami, tanyakan saja ke Claude dengan kalimat "jelaskan baris ini".

Layar: cek/lembar.png terbuka: 8 kotak berisi kubus dan tulisan "Shot 1" sampai "Shot 8".

Claude sudah menjalankan bangun dot py dan cek dot py sendiri. Delapan gambar kecil selesai dalam waktu sekitar lima belas detik. Kita buka cek slash lembar dot png, dan setiap shot muncul dengan nomornya. Kerangkanya bekerja.

Layar: Blender dibuka, berkas film.blend. Timeline di bawah, marker shot disorot. Tombol Play ditekan; tampilan berganti kamera pada setiap marker.

Kita juga bisa membuka film dot blend di Blender. Di bagian bawah ada timeline dengan tanda untuk setiap shot. Tekan spasi untuk memutar, dan tampilan berpindah kamera setiap kali shot berganti. Di layar ini, kita hanya melihat. Semua perubahan tetap kita minta lewat Claude.

Layar: berkas .gitignore terbuka, sudah berisi film.blend, *.blend1, cek/, __pycache__/. Dua baris baru diketik: aset/ dan render/. Lalu commit. Freeze pada lembar kontak.

```
git add .
git commit -m "Kerangka film dan alat cek"
```

Claude ternyata sudah membuat berkas dot gitignore sendiri, supaya Git mengabaikan berkas film dan gambar cek, karena semuanya bisa dibuat ulang kapan saja dan ukurannya besar. Kita menambahkan dua baris, yaitu folder aset dan folder render. Yang kita simpan di Git hanya kodenya.

## F04 Membangun kota yang basah oleh hujan (±12 menit)

Layar: animasi penjelasan dengan gaya Blender: panggung kosong, lalu kamera, lampu, dan sebuah kotak muncul. Kotak dipecah menjadi "mesh" (kerangka kawat) dan "material" (warna, kilap, cahaya).

Sebelum meminta AI membangun kota, kita perlu tahu empat istilah dasar di Blender. Scene adalah panggung tempat semua benda diletakkan. Kamera adalah mata penonton. Lampu menentukan bagian mana yang terang dan mana yang gelap. Setiap benda terdiri dari dua bagian, yaitu mesh dan material. Mesh menentukan bentuknya, sedangkan material menentukan warnanya, kilapnya, dan apakah benda itu menyala.

Layar: browser generik, alamat "polyhaven.com" tampil besar. Halaman tekstur aspal, label "CC0" disorot. Lalu kartu: "CC0 = domain publik: boleh dipakai, diubah, dan dimonetisasi tanpa izin."

Realisme sebuah film banyak ditentukan oleh permukaan benda, misalnya aspal yang retak, dinding yang kusam, dan genteng yang lembap. Permukaan seperti ini disebut tekstur, dan membuatnya dari nol butuh waktu yang lama. Karena itu, kita bekerja sama dengan para seniman di Poly Haven, yang membagikan tekstur dan foto langit berlisensi CC0. Artinya, aset itu boleh dipakai siapa saja, termasuk untuk video yang dimonetisasi, tanpa perlu izin.

Layar: terminal. "claude --continue" diketik pelan, jeda. Percakapan sebelumnya muncul lagi.

Satu tips sebelum lanjut. Kalau terminal tertutup atau komputer mati di tengah pekerjaan, kamu tidak perlu mengulang dari awal. Ketik claude, spasi, strip strip continue, maka Claude Code melanjutkan percakapan terakhir di folder ini.

Layar: label "Prompt 4.1". Prompt diketik, jeda. Claude menampilkan daftar pilihan aset dan bertanya "Apakah pilihan ini sudah oke?"

{{p_aset}}

Kita meminta Claude menulis skrip pengunduh, bukan mengunduh secara manual, supaya siapa pun yang membuka proyek ini bisa mendapatkan aset yang sama dengan satu perintah. Kalimat "tunjukkan daftar pilihannya ke saya" penting, karena manusialah yang memilih rasa visual filmnya.

Layar: dua foto langit berdampingan: jalan berbatu dengan gedung Eropa, dan lapangan gelap tanpa bangunan. Yang pertama dicoret. Label "Prompt 4.2". Prompt diketik.

{{p_aset_pilih}}

Claude mengusulkan foto langit malam dari sebuah jalan berbatu. Fotonya bagus, tetapi di dalamnya ada gedung-gedung bergaya Eropa. Foto langit ini akan terpantul di setiap genangan, jadi gedung itu akan ikut muncul di kota kita. Kita memintanya memilih langit malam tanpa bangunan, dan menambah tekstur beton untuk tepi kali. Keputusan kecil seperti ini adalah bagian kita sebagai sutradara.

Layar: aset/ berisi beberapa folder, dan ASET.md terbuka dengan tabel nama, alamat, lisensi.

Setelah kita setuju, skrip mengunduh asetnya dan mencatat semuanya di ASET.md.

Layar: label "Prompt 4.3". Prompt diketik, jeda. Penanda waktu: "22 menit kemudian".

{{p_kota}}

Prompt ini menjelaskan kota yang kita mau dengan rinci, dan semuanya mengikuti storyboard. Perhatikan permintaan tentang Gang Melati. Lelucon di shot empat bergantung pada pagar hijau yang mirip satu sama lain, jadi kita menuliskannya dengan jelas. Bentuk rumah dibuat bervariasi dengan bilangan acak ber-seed, yang selalu menghasilkan urutan yang sama, seperti mengocok kartu dengan cara yang persis sama setiap kali. Tanpa seed, rumah di gang bisa berubah bentuk setiap kali film dibangun ulang. Pekerjaan ini besar, dan Claude mengerjakannya selama kurang lebih dua puluh dua menit.

Layar: lembar kontak pertama kota. Bagian yang bagus diberi tanda centang, bagian yang kurang diberi lingkaran merah: ruko kotak polos, gambar gelap dan serba cokelat, genangan seperti cermin besar, lampu lalu lintas hanya titik merah.

Ini hasil pertamanya. Suasana hujan dan pantulan di aspal sudah terasa, dan Claude bahkan menambahkan gapura bertuliskan Gang Melati. Namun, masih banyak yang kurang. Ruko masih berupa kotak polos, dan Claude sendiri mengakuinya di laporannya. Gambarnya terlalu gelap dan semuanya berwarna cokelat. Genangan di shot satu terlihat seperti cermin besar yang menutup jalan. Lampu lalu lintas hanya berupa titik merah. Ini hal yang wajar, karena hasil pertama hampir tidak pernah langsung bagus.

Layar: tiga pasang gambar sebelum dan sesudah berdampingan: genangan, cahaya, ruko. Label "Prompt 4.4", "Prompt 4.5", "Prompt 4.6" bergantian; setiap prompt diketik, jeda, lalu hasilnya.

{{p_genangan}}

{{p_cahaya}}

{{p_ruko}}

Sekarang kita memoles kotanya sedikit demi sedikit. Kita memperbaiki satu hal per prompt, yaitu genangan, lalu cahaya, lalu ruko. Dengan cara ini, kalau hasilnya memburuk, kita langsung tahu prompt mana penyebabnya. Setiap prompt selesai dalam enam sampai sembilan menit. Genangan sekarang kecil dan tidak beraturan, langit menjadi kebiruan dan jendela rumah menyala hangat, dan ruko mendapat pintu gulung, papan nama, serta kotak pendingin udara.

Layar: lembar kontak setelah tiga perbaikan, tiga lingkaran merah baru: gumpalan hijau menyala di ujung jalan, tiang lampu lalu lintas tidak tampak, kolam cahaya lampu jalan belum ada. Label "Prompt 4.7".

{{p_rapikan}}

Setelah tiga perbaikan itu, masih ada sisa masalah kecil, dan ada juga masalah baru. Kita kumpulkan semuanya dalam satu prompt perapian. Kita menyebut shot dan letak masalahnya, supaya Claude tidak perlu menebak.

Layar: tiga foto kota dari viewport Blender: Jl. Kenanga dari atas, kali, Gang Melati dari atas. Gerakan pelan pada foto.

Inilah Kota Senja kita dilihat dari atas di Blender. Ada Jalan Kenanga dengan ruko, kali di ujung jalan kecil, dan Gang Melati dengan pagar hijaunya. Kalau laptopmu punya kartu grafis, kamu bisa terbang mengelilingi kota ini dengan lancar di Blender.

Layar: kartu "EEVEE atau Cycles?" dengan dua gambar gang yang sama: kiri lebih cepat tetapi pantulannya kurang nyata, kanan lebih nyata.

Di tahap ini, kamu akan melihat dua mesin render di Blender, yaitu EEVEE dan Cycles. EEVEE bekerja seperti mesin game, jadi sangat cepat. Cycles menghitung perjalanan cahaya seperti di dunia nyata, jadi pantulan lampu di genangan terlihat jauh lebih nyata, tetapi butuh waktu lebih lama. Film kita memakai Cycles.

Layar: commit. Freeze pada gang berpagar hijau yang basah.

```
git add .
git commit -m "Kota malam: jalan raya, kali, Gang Melati"
```

Kotanya sudah jadi, jadi kita simpan. Folder aset tidak ikut disimpan di Git, karena aset dot py bisa mengunduhnya lagi kapan saja.

## F05 Kurir, motor, kucing, dan si kecil (±14 menit)

Layar: dua gambar berdampingan: wajah manusia 3D yang hampir nyata tetapi terasa aneh, dan kurir ber-helm yang terlihat wajar. Tulisan: "Keputusan manusia: wajah tidak ditampilkan."

Ini salah satu keputusan terpenting di film kita, dan keputusan ini diambil oleh manusia, bukan oleh AI. Wajah manusia buatan komputer yang hampir nyata justru sering terasa menyeramkan, karena mata kita sangat peka terhadap wajah. Karena itu, kurir kita selalu memakai helm dan jas hujan ponco, dan kamera selalu berada di belakangnya.

Layar: label "Prompt 5.1". Prompt diketik, jeda. Lalu motor di lembar kontak: bentuknya masih kotak-kotak.

{{p_motor}}

Kita mulai dari motornya. Perhatikan permintaan tentang roda. Kalau roda berputar terlalu lambat dibanding laju motor, motor terlihat seperti meluncur di atas es. Rumusnya sederhana, yaitu jarak yang ditempuh dibagi keliling roda sama dengan jumlah putaran. Kita menuliskan rumus ini di prompt, supaya AI tidak menebak. Hasil pertamanya sudah lengkap, bahkan paketnya sudah berlabel "Penerima: Ayah", tetapi bentuk motornya masih kotak-kotak.

Layar: label "Prompt 5.2". Prompt diketik. Sebelum dan sesudah: motor kotak, motor membulat.

{{p_motor_bulat}}

Claude sendiri menyarankan supaya bodi motornya dibuat lebih membulat, jadi kita memintanya. Setelah empat menit, motornya sudah terlihat seperti motor bebek. Claude juga melaporkan dengan jujur bahwa blok mesin dan spion masih kotak, dan itu bisa kita terima, karena keduanya hampir tidak terlihat di film.

Layar: label "Prompt 5.3". Prompt diketik, jeda.

{{p_kurir}}

Berikutnya kurirnya. Kita meminta tiga lapisan, yaitu tubuh dengan tulang, helm, dan jas hujan ponco. Tubuhnya cukup dari bentuk dasar, karena tubuh itu tertutup jas hujan. Untuk ponco, kita meminta simulasi kain, artinya Blender menghitung gerakan kain itu seperti kain sungguhan.

Layar: terminal Claude Code, penanda waktu berjalan cepat: 20 menit, 40 menit, 60 menit. Angka "paha tertutup 75% … 50% … 62%" berganti-ganti. Lalu tombol Esc ditekan.

Di sinilah kita mendapat pelajaran pertama yang mahal. Claude membuat alat ukur sendiri, yaitu berapa persen paha kurir yang tertutup ponco, lalu berusaha menyempurnakan angka itu. Ia mencoba, mengukur, dan mencoba lagi selama satu jam, tanpa pernah selesai. AI bisa terjebak menyempurnakan satu angka yang sebenarnya tidak penting. Manusialah yang harus memutuskan kapan sesuatu sudah cukup. Kita menekan tombol Escape untuk menghentikannya.

Layar: label "Prompt 5.3b". Prompt diketik. Lalu lembar kontak kurir: duduk di motor, ponco menutupi badan.

{{p_kurir_cukup}}

Kita memberi batas yang jelas. Hasil yang sekarang sudah cukup, jadi Claude cukup merapikan dan berhenti. Empat setengah menit kemudian, kurir berponco kuning sudah duduk di atas motornya. Kita simpan dulu dengan commit.

```
git add .
git commit -m "Motor bebek dan kurir Mas Adit"
```

Layar: label "Prompt 5.4". Prompt diketik, jeda. Lembar kontak shot 1: motor menjauh di jalan raya, roda berputar.

{{p_gerak}}

Sekarang kita menggerakkan motor di shot satu. Motor dan kurirnya melaju menjauhi kamera di Jalan Kenanga.

Layar: label "Prompt 5.5". Prompt diketik, jeda. Lembar kontak shot 3: kucing melompat ke boks, lampu hijau, kurir turun, kurir mengangkat kucing.

{{p_kucing}}

Kucing adalah tokoh paling lucu di film ini. Lelucon di shot tiga bergantung pada waktu. Kucing duduk di atas boks, lampu berubah hijau, lalu ada satu detik hening, dan baru setelah itu kurir bereaksi. Claude menganimasikan seluruh shot ini dalam dua puluh delapan menit.

Layar: frame 690 dan 770 diperbesar: ponco menggembung dan terbang liar saat kurir berjalan. Lingkaran merah.

Namun, lihat ponconya saat kurir turun dan berjalan. Ponco itu menggembung dan terbang liar, seperti tertiup angin badai.

Layar: label "Prompt 5.6". Prompt diketik. Hasil: ponco masih menggembung, lepas dari badan.

{{p_ponco_jalan}}

Kita meminta perbaikan dengan menyebut nomor framenya. Enam belas menit kemudian, hasilnya masih gagal. Ponco masih menggembung dan lepas dari badan.

Layar: tulisan besar: "Kalau perbaikan kedua masih gagal, ganti caranya." Lalu label "Prompt 5.7". Prompt diketik. Hasil: ponco menggantung wajar saat berjalan.

{{p_ponco_tulang}}

Ini pelajaran kedua. Kalau perbaikan kedua masih gagal, jangan mengulang prompt yang sama dengan kata-kata yang berbeda. Ganti caranya. Kita meminta ponco itu mengikuti tulang badan, seperti baju biasa, dan hanya tepi bawahnya yang bergoyang. Tujuh menit kemudian, ponconya menggantung dengan wajar saat kurir berjalan.

Layar: label "Prompt 5.8". Prompt diketik, jeda. Hasil cek/hp.png: layar HP dengan panah kanan, "20 m", "Belok kanan", tetes hujan.

{{p_hp}}

Layar HP di setang juga kita bangun dengan kode. Isinya aplikasi peta generik tanpa logo atau merek, karena kita tidak boleh meniru tampilan aplikasi sungguhan. Tetes hujan di layar adalah detail kecil, tetapi detail seperti inilah yang membuat adegan terasa nyata.

Layar: label "Prompt 5.9". Prompt diketik, jeda. Hasil pertama: anak seperti balok kayu yang terang, kepala kurir tanpa helm seperti telur polos.

{{p_pintu}}

Berikutnya adegan pintu di shot enam dan tujuh. Hasil pertamanya buruk, dan kita perlu jujur tentang itu. Anak di ambang pintu terlihat seperti balok kayu yang terang, bukan siluet. Kepala kurir tanpa helm terlihat seperti telur polos, karena rambutnya belum ada.

Layar: label "Prompt 5.10" dan "Prompt 5.11". Kedua prompt diketik bergantian, masing-masing dengan hasilnya: bingkai membaik, lalu anak menjadi siluet gelap dengan kue yang terang.

{{p_pintu_bingkai}}

{{p_siluet}}

Kita memperbaikinya dalam dua langkah. Langkah pertama mengatur bingkainya, yaitu kurir di sepertiga kiri, kue di tengah, rambut basah di kepala, dan helm dipegang di tangan. Langkah kedua mengubah anak itu menjadi siluet gelap yang membulat, dengan cahaya rumah di belakangnya, sehingga hanya kue dan api lilin yang terang. Teknik siluet ini sering dipakai di film sungguhan, dan justru membuat adegannya terasa hangat.

Layar: commit. Freeze pada siluet anak dengan kue.

```
git add .
git commit -m "Layar HP, adegan pintu, dan siluet anak"
```

Semua pemain sudah siap, jadi kita simpan.
