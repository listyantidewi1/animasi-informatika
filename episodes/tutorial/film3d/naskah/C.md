## F00 Kait dan pembuka

Layar: frame pertama langsung film versi 3: jalan malam yang basah, hujan deras. Tulisan besar: "Film ini dibuat oleh manusia dan AI."

Film pendek ini dibuat oleh dua pihak. Saya menulis ceritanya dan memeriksa setiap frame. Claude Code menulis semua kode yang membangun kota, hujan, motor, dan gerakan kameranya di Blender.

Layar: potongan cepat dari percobaan yang gagal.

Tapi kerja sama ini tidak langsung mulus. Ponconya pernah menggembung sampai menutupi hampir seluruh layar, dan kameranya pernah terselip di dalam bahu kurir.

Layar: film diputar sebentar (kucing di lampu merah), lalu daftar bab menyala satu per satu.

Di video ini, kamu akan membuat film yang sama dari folder kosong, langkah demi langkah, sampai menjadi file MP4 yang siap diunggah ke YouTube. Kita mulai dari memasang alat, lalu menulis storyboard, membangun kota yang basah oleh hujan, menggerakkan motor dan kamera, menambahkan suara, dan merendernya menjadi video.

Bahkan setelah filmnya selesai dirender selama tiga puluh dua jam, masih ada kesalahan yang lolos. Kesalahan itu baru ketahuan saat filmnya ditonton dengan teliti, dan di bab sembilan kita akan melihat cara menangkapnya.

Layar: kartu judul, lalu film diputar utuh (75 detik) dengan suaranya.

Sebelum kita mulai, mari kita tonton dulu film utuhnya. Filmnya berjudul Paket Terakhir Malam Ini.

Layar: tiga kartu berdampingan: "Butuh apa", "Biaya", "Waktu render".

Untuk mengikuti video ini, kamu membutuhkan laptop atau komputer dengan Windows, macOS, atau Linux. Kartu grafis membuat render jauh lebih cepat. Saya merender film ini di laptop dengan kartu grafis RTX 3050 yang memorinya empat gigabyte, dan satu kali render seluruh film memakan waktu sekitar tiga puluh dua jam. Tanpa kartu grafis, kamu tetap bisa membuat film ini, tetapi turunkan kualitas render supaya waktunya tidak terlalu lama.

Blender adalah aplikasi gratis dan open source. Tekstur dan langit malam yang kita pakai berasal dari Poly Haven, yang semuanya berlisensi CC0, artinya bebas dipakai siapa saja, termasuk untuk video yang dimonetisasi. Hanya Claude Code yang memerlukan langganan berbayar, dan paket termurahnya sudah cukup untuk proyek ini. Semua prompt yang saya pakai ada di repositori GitHub, dan link-nya ada di deskripsi.

Layar: diagram lima langkah berputar.

Cara kerja kita sepanjang video selalu sama. Saya menulis rencana lebih dulu, lalu memberi AI satu tugas kecil. Setelah itu, saya melihat hasilnya, memeriksa frame-nya dengan teliti, dan menyimpan pekerjaan dengan commit di Git. AI bekerja dengan sangat cepat, tetapi keputusan tentang cerita, rasa, dan benar atau salahnya tetap ada di tangan kita.

## F08 lanjutan: render di laptop

Banyak tutorial Blender menyuruh kita melakukan bake sebelum render, yaitu menghitung simulasi kain dari awal sampai akhir lalu menyimpannya. Ponco kita tidak membutuhkan langkah itu, karena di bab enam kita sudah membuang simulasi kainnya, dan sekarang ponco ikut bergerak bersama tulang kurir. Simulasi yang tersisa hanya cipratan air dari roda motor. render.py menghitung cipratan itu sekali secara otomatis sebelum render dimulai, lalu menyimpannya, sehingga setiap frame bisa dirender dalam urutan apa pun.

Render akhir saya jalankan di laptop dengan kartu grafis. Sebelum merender seluruh film, saya merender empat frame uji dari shot yang berbeda. Cara ini memberi tahu kita dua hal, yaitu render benar-benar memakai kartu grafis, dan berapa lama satu frame dirender.

Saat render seluruh film dimulai, shot satu langsung gagal karena memori kartu grafis habis. Shot satu adalah pemandangan kota dari atas, sehingga ada banyak sekali benda yang harus dimuat sekaligus. Solusinya sederhana. Shot satu dipindah ke urutan terakhir, dan saat dicoba lagi, shot itu berhasil dirender.

Ini waktu render yang sebenarnya. Shot satu sampai lima memakai enam puluh empat sampel, dan shot enam sampai delapan memakai seratus dua puluh delapan sampel, karena di shot itu ada cahaya hangat dari pintu yang mudah berbintik. Rata-rata satu frame membutuhkan sekitar satu menit, dan seluruh film membutuhkan sekitar tiga puluh dua jam. Render ini sempat terhenti enam kali, dan setiap kali dilanjutkan, render.py langsung meneruskan dari frame terakhir yang belum ada.

Kalau komputermu lebih lambat, ada tiga cara untuk menghemat waktu. Pertama, turunkan jumlah sampel, karena denoising akan merapikan sisa bintiknya. Kedua, render di malam hari sambil laptop dicolokkan ke listrik. Ketiga, render satu shot dulu untuk memeriksa hasilnya sebelum merender seluruh film.

Setelah semua frame selesai, gabung dot py menyatukan gambar, suara, dan teks menjadi film lebar dot MP4. Untuk pertama kalinya, kita menonton film kita dalam bentuk video sungguhan.

Filmnya sudah jadi. Tapi jangan diunggah dulu, karena masih ada satu langkah penting.

## F09 Cek kerjaan AI

Setelah render pertama selesai, saya menonton filmnya dengan teliti, dan ternyata ada beberapa kesalahan. Saat berbelok di tepi kali, kurirnya menembus sudut tembok. Lengannya kadang keluar menembus ponco. Motornya menembus tanaman di gang, anaknya menembus pintu, dan gagang pintunya tertinggal di udara saat pintu dibuka. Jalanannya juga terlalu kering untuk hujan sederas itu.

Saya menyebutkan setiap kesalahan itu kepada Claude, lengkap dengan shot dan bagian yang salah, lalu Claude memperbaikinya. Perbaikannya mengubah gerakan, jadi seluruh film harus dirender ulang. Render kedua ini memakan waktu sekitar tiga puluh empat jam.

Tapi ada masalah dengan cara ini. Saya menemukan kesalahan itu dengan mata, dan mata kita mudah tertipu oleh gerakan. Kesalahan yang hanya muncul dalam satu atau dua frame tidak akan kita sadari saat menonton sekali, padahal penonton YouTube sering menjeda video. Karena itu, kita meminta Claude membuat skrip pemeriksa.

Kita meminta empat pemeriksaan. Pertama, pemeriksaan tembus, yang membaca bentuk setiap benda di dalam berkas film, lalu mencari benda bergerak yang masuk ke benda lain. Kedua, pemeriksaan roda, yang membandingkan jarak tempuh motor dengan putaran rodanya. Ketiga, deteksi lompatan, yang membandingkan setiap frame video dengan frame sebelumnya. Keempat, lembar kontak, yaitu satu gambar kecil setiap setengah detik.

Perhatikan kalimat terakhir prompt ini. Kita meminta Claude menguji pemeriksanya dulu pada versi pertama, karena pemeriksa yang baik harus bisa menemukan kesalahan yang sudah kita ketahui. Kalau pemeriksa itu tidak menemukan apa pun di versi pertama, berarti pemeriksanya yang salah.

Hasilnya, pemeriksa menemukan tembok kali, tanaman di gang, dan pintu di versi pertama, dan semuanya sudah hilang di versi sekarang. Pemeriksa juga mencatat banyak hal kecil, misalnya jok motor yang masuk sedikit ke ponco. Itu wajar, karena kurirnya memang duduk di jok. Membaca laporan tetap tugas kita, karena tidak semua temuan adalah kesalahan.

Lalu ada satu temuan yang tidak pernah saya lihat. Di beberapa frame tepat pada pergantian shot, gambarnya kabur dan berbayang. Tulisan di layar HP dan label paket tampak dobel. Saat film diputar biasa, satu frame hanya tampil sekejap, kurang dari sepersepuluh detik, sehingga mata kita tidak menangkapnya. Tapi begitu video dijeda, kesalahan ini langsung terlihat.

Claude membuktikan penyebabnya dengan angka. Untuk membuat motion blur, Blender membuka shutter kamera sebentar di setiap frame, dan shutter itu berpusat di nomor frame. Artinya, sebagian waktunya mengintip sedikit ke frame sebelum dan sesudahnya. Di frame pertama dan frame terakhir sebuah shot, salah satu tetangganya adalah milik shot lain, sehingga kameranya ikut tergeser ke posisi shot lain, dan gambarnya berbayang. Perbaikannya, di frame pertama setiap shot shutter mulai dibuka tepat di frame itu, dan di frame terakhir shutter ditutup tepat di frame itu. Dengan begitu, shutter tidak pernah menyeberang ke shot lain.

Perhatikan cara kita meminta perbaikan. Kita menyebut nomor frame dan apa yang terlihat salah. Kita meminta Claude membuktikan penyebabnya dengan angka, bukan hanya menduga. Kita juga meminta daftar frame yang harus dirender ulang, sehingga kita tidak perlu merender seluruh film lagi. Terakhir, kita menjelaskan temuan mana yang memang bukan kesalahan.

Hanya dua puluh empat frame yang dirender ulang, dan pekerjaannya selesai dalam dua puluh tujuh menit. Setelah film digabung ulang, kita jalankan pemeriksa sekali lagi untuk memastikan kesalahannya benar-benar hilang.

Setelah pemeriksa bersih, saya menonton film versi ketiga sekali lagi, dan saya menemukan kesalahan yang tidak ditangkap pemeriksa. Saat pintu terbuka, anak yang membawa kue tidak melangkah. Ia hanya bergeser maju, seperti boneka yang didorong. Pemeriksa kita tidak menandainya, karena tidak ada benda yang menembus benda lain. Pemeriksa hanya menemukan kesalahan yang kita minta untuk dicari.

Kita menjelaskan kepada Claude apa yang terlihat salah dan seperti apa gerakan yang benar. Claude memberi anak rangka tulang, sehingga kaki kiri dan kanan melangkah bergantian, dan sandal yang menapak tidak tergelincir di lantai. Untuk memeriksanya, Claude membuat gambar dari samping dengan kaki kiri berwarna merah dan kaki kanan berwarna biru, sehingga setiap langkah mudah dilihat.

Lalu kita meminta Claude membandingkan posisi anak di versi lama dan versi baru. Hasilnya, hanya enam puluh delapan frame yang berubah, jadi hanya frame itu yang dirender ulang. Pelajarannya, skrip pemeriksa membantu kita, tetapi tidak menggantikan mata kita. Tetap tonton filmmu dengan teliti sebelum mengunggahnya.

Sebelum mengunggah film apa pun, periksa daftar ini. Tidak ada benda yang menembus atau tertinggal. Roda berputar sesuai laju motor. Tidak ada frame yang kabur, berkedip, atau melompat. Gerakan tokoh terlihat alami, misalnya kaki benar-benar melangkah. Suara pas dengan gambarnya. Teks tidak terpotong. Terakhir, setiap aset dari luar tercatat di ASET.md beserta lisensinya.

Sekarang film kita benar-benar siap.

## F10 Penutup

Film kita sudah lolos pemeriksaan, jadi sekarang saatnya diunggah. Untuk thumbnail, pilih satu frame yang paling indah tanpa membocorkan akhir ceritanya, misalnya motor yang menyibak genangan di bawah lampu jalan. Di deskripsi, tuliskan bahwa film ini dibuat oleh manusia bersama AI, karena penonton berhak tahu cara sebuah karya dibuat. Versi tegak untuk Short dirender dengan cara yang sama, cukup dengan mengganti kata lebar menjadi tegak.

Satu hal lagi soal hak cipta. Blender gratis, dan film yang kamu render dengan Blender sepenuhnya milikmu, termasuk untuk diunggah dan dimonetisasi. Tekstur dan langit malam kita berasal dari Poly Haven dengan lisensi CC0. Lisensi ini tidak mewajibkan kita menyebut nama pembuatnya, tetapi kita tetap menuliskannya di ASET.md dan di deskripsi video sebagai ucapan terima kasih. Kalau kamu memakai suara buatan, ikuti aturan pemakaian layanannya.

Mas Adit dan motornya tidak berhenti di film ini. Kota Senja juga menjadi dunia untuk game Kurir Senja yang kita bangun di video lain. Supaya motornya sama persis, kita mengekspornya ke format glTF, yaitu format tiga dimensi yang bisa dibaca game di browser.

Semua kode dan semua prompt dari video ini ada di repositori GitHub yang alamatnya tampil di layar, dan link-nya juga ada di deskripsi. Kamu bisa mengunduhnya, menjalankan aset dot py untuk mengambil tekstur, lalu bangun dot py, dan kamu akan mendapatkan film yang sama persis. Kamu juga bisa membaca berkas prompt untuk melihat setiap prompt yang saya ketik, termasuk yang gagal.

Mari kita ingat lagi cara kerja kita. Kita menulis storyboard sebelum menulis kode. Kita memberi AI satu tugas kecil setiap kali. Kita melihat hasilnya dengan gambar kecil yang cepat. Kita memeriksa film frame demi frame sebelum diunggah. Lalu, kita menyimpan setiap langkah dengan commit. AI menulis kodenya dengan sangat cepat, tetapi ceritanya, rasanya, dan keputusan tentang benar atau salahnya tetap ada di tangan kita.

Sekarang giliranmu. Buat film pendekmu sendiri dengan cara yang sama. Kalau bingung memilih cerita, coba salah satu ide ini. Kalau filmmu sudah jadi, tulis link-nya di kolom komentar, karena saya ingin menontonnya.

Kalau kamu ingin melihat cara membangun aplikasi sungguhan bersama AI dengan cara kerja yang sama, tonton video ini. Sampai jumpa di video berikutnya.
