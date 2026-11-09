# Buku yang Ditulis Selama 64 Tahun dan Belum Selesai

Dokumenter animasi ±10 menit untuk penonton umum, channel I Teach Software Engineering (@iTeachSWE).
Naskah final (revisi Bu Dewi, 9 Nov 2026). Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan.
Gaya, narator (Bian), musik, dan Bip sama dengan D01–D03. Orang sungguhan (Donald Knuth, Filip Stappers, Ho Boon Suan, Bill Gates) tidak digambar dan suaranya tidak ditiru: mereka hadir lewat benda (meja, lampu, pensil, surat), tangan tanpa ciri, label nama, dan kutipan yang diketik di layar. Tulisan tangan di layar memakai huruf ilustratif, bukan tulisan asli. Adegan sehari-hari (warung, kelas) dan tokohnya rekaan. AI digambar abstrak (kartu catatan bernomor, garis cahaya), tanpa maskot, wajah robot, atau logo perusahaan; AI dari Anthropic dan dari OpenAI digambar dengan gaya yang setara.

---
Tempo (permintaan Bu Dewi): visualisasi matematika dan algoritma (bab 3, 4, 7, 8) diberi waktu untuk dilihat dan dipahami; setiap langkah ditahan, ada jeda tayang tanpa narasi sesudah penjelasan penting, dan gambarnya dibuat rinci (angka setiap langkah, penghitung, label).

---

## 0. Pembuka (±0:45)

Pada akhir Februari dua ribu dua puluh enam, seorang profesor berusia delapan puluh delapan tahun menulis catatan yang dibuka dengan kata "Shock! Shock!", yang artinya "Kaget! Kaget!"
*[Visual: layar gelap; lampu meja menyala; huruf "Shock! Shock!" muncul satu per satu di kertas catatan. Tidak ada orang, hanya meja, lampu, kacamata, dan pensil.]*

Teka-teki yang berminggu-minggu ia pikirkan ternyata terpecahkan sebagian dengan bantuan AI dalam waktu sekitar satu jam.
*[Visual: kubus titik-titik berputar pelan; tiga garis cahaya merah, hijau, biru menyusurinya; jam pasir satu jam.]*

Profesor itu adalah Donald Knuth. Sejak tahun seribu sembilan ratus enam puluh dua, ia menulis buku The Art of Computer Programming, dan buku itu belum selesai.
*[Visual: rak buku; punggung buku berlabel 1, 2, 3, 4A, 4B; di sebelahnya garis putus-putus 4C, 4D, 5, 6, 7 berpendar; judul video muncul.]*

Bagaimana ide-ide dari buku setua itu bisa ada di balik aplikasi di HP-mu, dan apa sebenarnya peran AI dalam cerita ini?

## 1. Selembar kertas, dua belas bab (±0:55)

Pada Januari tahun seribu sembilan ratus enam puluh dua, tepat di hari ulang tahunnya yang kedua puluh empat, Knuth yang masih mahasiswa diminta sebuah penerbit menulis buku tentang compiler, yaitu program penerjemah untuk komputer. Hari itu juga, ia menulis judul dua belas bab di selembar kertas yang masih ia simpan puluhan tahun kemudian.
*[Visual: kalender Januari 1962; lilin angka 24; amplop penerbit generik tanpa logo; tangan tanpa ciri menulis 12 baris di kertas bergaris (huruf ilustratif).]*

Tiga tahun kemudian, naskah tulisan tangannya sudah mencapai sekitar tiga ribu halaman. Penerbit terkejut, sehingga satu buku itu diubah menjadi rencana tujuh jilid.
*[Visual: tumpukan kertas tumbuh lebih tinggi dari Bip, lalu terbelah menjadi tujuh buku.]*

## 2. Apa itu algoritma? (±0:55)

Jilid pertama terbit pada tahun seribu sembilan ratus enam puluh delapan, dan isinya dimulai dari satu kata, yaitu algoritma.

Bayangkan resep nasi goreng yang menulis "garam secukupnya". Kita mengerti maksudnya, tetapi komputer tidak. Menurut Knuth, algoritma harus ditulis begitu tepat sampai komputer pun bisa mengikutinya, dengan langkah yang jelas dan pasti berakhir.
*[Visual: kertas resep di dapur; "garam secukupnya" disorot; Bip bingung menatap tiga takaran; resep berubah menjadi kartu langkah bernomor dengan bendera "selesai" di ujung.]*

Kata algoritma berasal dari nama al-Khwarizmi, ilmuwan Persia yang hidup sekitar seribu dua ratus tahun lalu.
*[Visual: gulungan naskah bergaya kaligrafi (tanpa gambar tokoh); nama al-Khwarizmi berubah menjadi kata "algoritma".]*

Knuth memakai kata art, atau seni, karena menurutnya menyusun program bisa terasa indah, seperti menggubah puisi atau musik.
*[Visual: baris-baris kode berubah menjadi not balok yang mengalun.]*

## 3. Salah satu algoritma tertua: mencari FPB (±1:05)

Algoritma pertama di buku itu sudah berumur lebih dari dua ribu tahun, yaitu algoritma Euclid untuk mencari FPB.

Bayangkan dua utas tali rafia. Yang satu panjangnya sembilan puluh satu sentimeter, dan yang lain dua puluh satu sentimeter. Kalau kita terus memotong tali yang panjang sepanjang tali yang pendek, setelah enam kali memotong kita mendapat dua potongan yang sama panjang, yaitu tujuh sentimeter. Itulah FPB-nya.
*[Visual: dua tali rafia berlabel 91 cm dan 21 cm di atas penggaris; tali pendek ditempel di tali panjang lalu dipotong, satu per satu, dengan penghitung potongan 1 sampai 6 (91→70→49→28→7, lalu 21→14→7); setiap potongan jatuh dan diberi label 21 atau 7; dua potongan terakhir sama-sama 7 cm dan disorot "FPB = 7". Setiap langkah ditahan cukup lama supaya bisa diikuti.]*

Cara yang ditulis di buku Knuth lebih cepat. Kita langsung membagi dan memakai sisanya, sampai sisanya nol. Jawabannya tetap tujuh, tetapi kali ini hanya butuh dua kali pembagian.
*[Visual: tabel pembagian besar: "91 : 21 = 4, sisa 7" lalu "21 : 7 = 3, sisa 0"; panah sisa turun ke baris berikutnya; penghitung berhenti di 2, di samping penghitung cara memotong yang berhenti di 6. Tidak ada label "temuan Knuth"; cukup label "cara pembagian".]*

## 4. Menghitung langkah (±1:05)

Membandingkan banyaknya langkah seperti ini disebut analisis algoritma, istilah yang dipopulerkan oleh Knuth.

Coba main tebak angka dari satu sampai seribu. Temanmu hanya boleh menjawab "lebih besar" atau "lebih kecil". Menebak satu per satu bisa butuh seribu tebakan. Kalau kamu selalu menebak angka di tengah, setiap jawaban membuang separuh kemungkinan, sehingga sepuluh tebakan sudah cukup.
*[Visual: dua murid rekaan di kelas; gelembung jawaban "lebih besar" / "lebih kecil"; papan angka 1–1000; setiap tebakan menandai angka tengah (500, 750, …) dan menghapus separuh papan; tabel kecil sisa kemungkinan 1000 → 500 → 250 → … → 1; penghitung tebakan berhenti di 10; Bip bersorak.]*

Jilid ketiga membahas cara mencari seperti ini dengan rinci. Ide yang sama membuat komputer, termasuk HP-mu, bisa menemukan satu nama di antara ribuan nama yang urut dalam sekejap.
*[Visual: daftar nama urut abjad di layar HP generik (bukan aplikasi kontak bermerek) terbelah dua berulang kali sampai satu nama menyala.]*

Pada tahun seribu sembilan ratus tujuh puluh empat, di usia tiga puluh enam tahun, Knuth menerima Turing Award, yang sering disebut Nobel-nya ilmu komputer. Seri bukunya disebut langsung dalam alasan penghargaan itu.
*[Visual: medali generik bertuliskan 1974; kutipan alasan penghargaan diketik, frasa "art of computer programming" disorot.]*

## 5. Buku yang tak kunjung selesai (±0:55)

Beberapa tahun setelah jilid ketiga terbit, Knuth melihat cetakan baru bukunya dan merasa hurufnya jelek sekali. Ia berhenti sebentar untuk membuat program penyusun huruf sendiri, yaitu TeX. Rencananya hanya setahun, tetapi ternyata butuh sekitar sepuluh tahun.
*[Visual: halaman rumus dengan huruf miring-miring; Bip meringis; lembar kalender "1 tahun" terus disobek; huruf merapikan diri dengan mulus; nomor versi kecil 3.14 → 3.141592653 bergulir di pojok seperti odometer, tanpa dibacakan.]*

Knuth pernah memperkirakan jilid keempat selesai sekitar tahun dua ribu tiga. Kenyataannya, jilid empat A baru terbit tahun dua ribu sebelas, jilid empat B tahun dua ribu dua puluh dua, dan beberapa jilid lagi masih dalam pengerjaan.
*[Visual: lini waktu 1962–2026; buku muncul di 1968, 1969, 1973; celahnya diisi tanda kecil "edisi baru jilid 1–3 (1997–1998)", "TeX", dan "fasikel (2005–2009)"; lalu 2011 (4A), 2022 (4B), dan tanda kecil 2025 berlabel "Fasikel 7 (awal 4C)", bukan buku utuh; label "target: 2003" dicoret; garis putus-putus untuk sisa 4C, 4D, 5, 6, 7.]*

## 6. Kebiasaan seorang penulis (±0:50)

Supaya bisa fokus, Knuth berhenti memakai email sejak tahun seribu sembilan ratus sembilan puluh. Orang pertama yang menemukan sebuah kesalahan di bukunya mendapat hadiah dua koma lima enam dolar, yang ia sebut satu dolar heksadesimal. Dulu, hadiahnya berupa cek, dan banyak penerima hadiah memilih untuk membingkainya. Kini, hadiahnya berupa sertifikat dari bank khayalan.
*[Visual: kotak masuk email dengan angka 0 membeku di samping tumpukan surat kertas; cek generik "$2.56" (bukan desain asli) dibingkai di dinding; lalu sertifikat generik "0x$1.00" dari "bank di negeri khayalan" (bukan desain asli) masuk ke amplop.]*

Buku ini terkenal sulit. Bill Gates pernah menulis di kolom korannya bahwa ia butuh disiplin dan waktu berbulan-bulan untuk membacanya. Ia juga menulis, bahwa kalau kamu bisa membaca semua isi bukunya, maka kirimkan riwayat hidupmu kepadanya.
*[Visual: potongan kolom koran generik tanpa foto, tanpa nama koran dan tanpa tanggal; kalimat yang disorot melayang dan menempel di sampul buku bergaya.]*

## 7. Teka-teki tiga jalan (±1:05)

Kembali ke tahun dua ribu dua puluh enam, Knuth sedang menulis tentang sebuah rute yang mengunjungi setiap tempat tepat satu kali, lalu kembali ke tempat awal.

Bayangkan gedung berbentuk kubus yang berisi dua puluh tujuh ruangan, tiga kali tiga kali tiga. Setiap ruangan punya tiga pintu satu arah, yaitu ke kanan, ke belakang, dan ke atas. Pintu di ujung gedung tembus ke sisi seberangnya, seperti di game Pac-Man.
*[Visual: kubus 3×3×3 transparan dengan 27 titik bernomor; satu ruangan disorot dan ketiga pintunya berkedip bergantian (kanan, belakang, atas) dengan label; satu titik keluar dari sisi kanan lalu muncul di sisi kiri, diulang supaya jelas.]*

Teka-tekinya adalah mewarnai setiap pintu dengan merah, hijau, atau biru, sehingga setiap warna menjadi satu jalan yang melewati semua ruangan tepat satu kali.
*[Visual: tiga ular cahaya merah, hijau, biru menyusuri kubus satu per satu (bukan bersamaan); penghitung ruangan yang dilewati naik 1 sampai 27 untuk tiap warna; setiap pintu hanya dilewati satu warna.]*

Knuth bisa memecahkan kubus berukuran tiga, dan temannya, Filip Stappers, memakai komputer untuk menemukan jawaban sampai di ukuran enam belas. Tetapi solusi yang bisa digunakan untuk semua ukuran masih belum ditemukan.
*[Visual: kubus membesar 3, 5, 16; tanda tanya di atas kubus berukuran tak diketahui; label nama "Filip Stappers" di samping papan ketik, tanpa wajah.]*

## 8. Tiga puluh satu percobaan (±1:40)

Stappers lalu memberikan soal itu kepada Claude Opus empat koma enam, model AI buatan Anthropic yang baru dirilis tiga minggu sebelumnya.

AI itu mencoba banyak cara dengan menulis program kecil, sementara Stappers terus mendampingi dan mengingatkannya untuk mencatat setiap kemajuan.
*[Visual: deretan kartu catatan bernomor 1 sampai 31; sebagian besar abu-abu berlabel "terlalu lambat" atau "tidak berhasil"; tangan tanpa ciri menempelkan catatan "perbarui catatan!"; label "Claude Opus 4.6 (Anthropic)".]*

Pada percobaan ketiga puluh satu, sekitar satu jam setelah mulai, AI itu menghasilkan program yang berhasil untuk kubus berukuran ganjil. Stappers mengujinya sampai ukuran seratus satu, lalu Knuth menulis sendiri bukti matematikanya. Bukti itu kemudian juga diperiksa ulang oleh Kim Morrison dengan program pemeriksa bukti bernama Lean.
*[Visual: kartu nomor 31 menyala; kubus 3, 5, 7 terisi tiga warna; centang hijau sampai 101; pensil menulis bukti di kertas; lalu halaman bukti masuk ke mesin pemeriksa bergaya berlabel "Lean" dan keluar dengan centang; label nama "Kim Morrison" tanpa wajah.]*

Untuk ukuran genap, AI itu hanya berhasil pada beberapa ukuran kecil dan tidak menemukan rumus umumnya. Beberapa hari kemudian, Ho Boon Suan dari Singapura meminta model GPT buatan OpenAI menulis program untuk kubus yang berukuran genap mulai delapan. Ia mengujinya pada banyak ukuran, termasuk kubus berisi jutaan ruangan.
*[Visual: kubus 4, 6, 8 dengan centang kecil, lalu tanda tanya; garis cahaya bergaya berbeda tetapi setara (pola garis, bukan maskot atau logo) berlabel "GPT-5.3-codex (OpenAI)"; label nama "Ho Boon Suan, Singapura"; zoom keluar ke kubus raksasa berlabel "200 × 200 × 200 = 8 juta ruangan".]*

Tidak lama kemudian, model GPT lain menulis bukti empat belas halaman untuk ukuran genap, dan Knuth menyebutnya tampak tanpa cacat.
*[Visual: tumpukan 14 halaman rapi dengan rumus ilustratif berlabel "GPT-5.4 Pro (OpenAI)"; kaca pembesar menyusuri halaman; label "diperiksa Knuth".]*

Tiga tahun sebelumnya, Knuth meminta mahasiswanya menguji ChatGPT. Ia heran karena jawaban yang sebenarnya hanya karangan bisa terdengar sangat meyakinkan, dan ia menyerahkan penelitian AI semacam itu kepada orang lain. Kini ia menulis bahwa sepertinya ia harus merevisi pendapatnya tentang AI generatif. Ia juga menulis "Hats off to Claude!", yang artinya angkat topi untuk Claude.
*[Visual: dua kutipan diketik rapi berdampingan, berlabel "2023" dan "2026"; timbangan bergeser pelan tanpa jatuh.]*

Knuth menutup catatannya dengan kalimat "We are living in very interesting times indeed", yang artinya kita sungguh hidup di masa yang sangat menarik.
*[Visual: kertas catatan dilipat dan diletakkan di atas tumpukan naskah buku; lampu meja tetap menyala; kalimat penutup diketik pelan di layar.]*

## 9. Penutup (±0:50)

Jadi, apakah buku ini menjadi usang karena ada AI? Jawabannya tidak. AI membantu mencari, mencoba, bahkan menulis sebagian bukti. Tetapi manusialah yang mengajukan pertanyaan, mendampingi, menguji, dan memeriksa apakah jawabannya benar.
*[Visual: kubus tiga warna mengecil menjadi satu halaman buku; tangan tanpa ciri, kartu catatan AI (dua gaya garis yang setara), dan pensil ada di halaman yang sama.]*

Knuth sudah menulis bukunya selama enam puluh empat tahun. Ia memberi hadiah kepada orang yang menemukan kesalahannya, dan di usia delapan puluh delapan tahun ia masih terbuka untuk memikirkan ulang pendapatnya. Belajar memang tidak harus cepat, asalkan kita tidak berhenti.
*[Visual: meja malam; kertas 12 bab tumbuh menjadi pohon; cabangnya buku, daunnya ikon aplikasi di HP; cabang yang belum jadi digambar putus-putus, dan sebuah pensil kecil terus menulis.]*

Sebagai catatan, naskah video ini juga disusun dengan bantuan AI, termasuk Claude buatan Anthropic, lalu diperiksa fakta dan disunting oleh manusia.
*[Visual: kartu kecil "Naskah: disusun dengan bantuan AI, diperiksa dan disunting manusia" dengan ikon pensil dan centang.]*

Kalau kamu ingin memahami cara kerja teknologi di sekitarmu, subscribe channel I Teach Software Engineering. Sampai jumpa di cerita berikutnya.
*[Visual: kartu akhir dengan Bip dan youtube.com/@iTeachSWE.]*

---

## Sumber (untuk deskripsi YouTube)

Primer = tulisan atau ucapan Knuth sendiri, atau dokumen resmi; sekunder = laporan pihak lain. Halaman Stanford milik Knuth tidak bisa dibuka dari lingkungan riset (sertifikat emSign tidak dikenal, WebFetch 503); isinya dibaca lewat salinan atau cuplikan mesin pencari, jadi wajib dibuka langsung sebelum suara dibuat.

Kalimat untuk deskripsi (disarankan): "Naskah video ini disusun dengan bantuan AI, termasuk Claude buatan Anthropic, lalu diperiksa fakta dan disunting manusia."

- Knuth, D. E. (28 Feb 2026, beberapa kali direvisi). Claude's Cycles. https://cs.stanford.edu/~knuth/papers/claude-cycles.pdf (primer; dibaca lewat salinan "revised 04 March 2026" di https://github.com/kim-em/KnuthClaudeLean). Isi: "Shock! Shock!", masalah kubus m³, Knuth memecahkan m = 3, Stappers m = 4–16, 31 eksplorasi ±1 jam, uji m ganjil 3–101, bukti kasus ganjil oleh Knuth; di eksplorasi 24 Claude hanya menemukan jawaban untuk m = 4, 6, 8 tanpa aturan umum ("it seemed to get stuck"), dan dijalankan ulang ±4 jam tanpa solusi penuh; Ho Boon Suan dengan kode GPT-5.3-codex untuk m genap ≥ 8, diuji untuk semua m genap 8–200 dan beberapa nilai acak 400–2000 (komentar Knuth: graf m = 2000 punya 8 miliar titik); m = 4 dan 6 lewat pencarian komputer, m = 2 mustahil (1982); "I'll have to revise my opinions about 'generative AI' one of these days"; "Hats off to Claude!". Keyakinan tinggi untuk revisi 4 Maret. Revisi terakhir yang dibaca langsung: 14 April 2026 (PDF asli dari Bu Dewi).
- Bukti kasus genap (GPT-5.4 Pro). https://cs.stanford.edu/~knuth/even_closed_form_proof_final.pdf (primer, hanya terlihat lewat cuplikan pencarian). Knuth: "a beautifully formatted and apparently flawless 14-page paper". Pendukung sekunder: https://axisofordinary.substack.com/p/links-for-2026-03-31 , https://www.implicator.ai/claude-opus-4-6-solves-open-combinatorics-problem-that-stumped-knuth-for-weeks/ , https://github.com/no-way-labs/residue (konstruksi genap lebih sederhana oleh Keston Aquino-Michaels dengan Claude dan GPT; tidak dibacakan). Keyakinan sedang–tinggi.
- Morrison, K. KnuthClaudeLean (formalisasi Lean bukti Knuth untuk kasus ganjil). https://github.com/kim-em/KnuthClaudeLean (primer untuk keberadaan formalisasinya; tidak dibacakan). Keyakinan sedang–tinggi.
- Anthropic (5 Feb 2026). Claude Opus 4.6. https://www.anthropic.com/news/claude-opus-4-6 (primer). Keyakinan tinggi.
- Knuth, D. E. (7 Apr 2023). Twenty questions for ChatGPT. https://www-cs-faculty.stanford.edu/~knuth/chatGPT20.txt (primer, dibaca lewat salinan https://hur.st/chatGPT20.html). Isi: pertanyaan disusun Knuth, dijalankan seorang mahasiswa S3; "the confident tone lends credibility to all of that made-up nonsense" (tentang jawaban #10); "I myself shall certainly continue to leave such research to others, and to devote my time to developing concepts that are authentic and trustworthy." Keyakinan tinggi.
- Computer History Museum (2007). Oral History of Donald Knuth (wawancara Edward Feigenbaum). https://archive.computerhistory.org/resources/access/text/2013/05/102658053-05-01-acc.pdf (primer). Isi: "January of 1962", buku "how to write compilers", "I sketched out that day … 12 chapters", "I still have the sheet of tablet paper" (2007, hlm. 14), tujuh jilid, cetakan jilid 2 yang "terrible", TeX "ten years, not one year" (Feigenbaum), lelucon "four months of wedded bliss" (tidak dipakai lagi, lihat catatan). Keyakinan tinggi.
- Knuth, D. E. (1993). Artistic Programming (Citation Classic, Current Contents). https://garfield.library.upenn.edu/classics1993/A1993LQ46300001.pdf (primer). Isi: "On my 24th birthday, a representative of Addison-Wesley asked me…" (buku "about software creation"), "3,000 pages of handwritten manuscript" pada Juni 1965 ("more than 2,000 pages" adalah perkiraan penerbit untuk panjang buku cetak), tujuh jilid, TeX "taking a year off… Alas, that project took 11 years", target jilid 4 tahun 2003. Keyakinan tinggi.
- Knuth, D. E. The Art of Computer Programming, Vol. 1, edisi 3 (1997), pengantar dan §1.1: Algoritma E (contoh Knuth m = 119, n = 544, langkah pertama hanya menukar angka), resep "a dash of salt", al-Khwarizmi, "Analysis of algorithms is the name the author likes to use", pemrograman seperti menggubah "poetry or music"; Euclid sendiri (Elements VII.1–2) memakai pengurangan berulang. https://www.informit.com/articles/article.aspx?p=2182572 dan https://www.informit.com/articles/article.aspx?p=2221792 (primer, kutipan penerbit). Keyakinan tinggi.
- Knuth, D. E. Analysis of Algorithms (halaman buku). https://cs.stanford.edu/~knuth/aa.html (primer, lewat cuplikan; Knuth memperkenalkan frasa itu). Keyakinan sedang; narasi memakai "dipopulerkan" yang lebih aman.
- Knuth, D. E. TAOCP Vol. 2 §4.5.2 (algoritma Euclid "the oldest nontrivial algorithm that has survived to the present day") dan Vol. 3 §6.2.1 (catatan sejarah pencarian biner, mis. John Mauchly 1946). Primer, dikutip dari ingatan pemeriksa fakta, belum dilihat langsung. Keyakinan sedang–tinggi; dasar judul bab 3 "Salah satu algoritma tertua" dan kalimat jilid ketiga yang tidak menyebut Knuth sebagai penemu.
- Knuth, D. E. The Art of Computer Programming, Vol. 4 Fascicle 7 (2025), pengantar: "$2.56 for each error… when it is first reported to me"; "Volume 4C, whose first third will eventually consist of the contents of the present fascicle". https://ptgmedia.pearsoncmg.com/images/9780135328248/samplepages/9780135328248_Sample.pdf (primer). Keyakinan tinggi. Draf bagian Hamiltonian cycles (pra-fascicle 8A) disebut di referensi [3] Claude's Cycles.
- Knuth, D. E. Bank of San Serriffe dan berita Oktober 2008. https://www-cs-faculty.stanford.edu/~knuth/boss.html dan https://cs.stanford.edu/~knuth/news08.html (primer; tidak bisa dibuka, news08 lewat cuplikan). Isi: sejak Oktober 2008 cek diganti "hexadecimal certificate" dari bank fiktif karena masalah pemalsuan cek; uang sungguhan masih bisa diminta. Keyakinan tinggi.
- ACM. A.M. Turing Award 1974, Donald E. Knuth. https://amturing.acm.org/award_winners/knuth_1013846.cfm (primer; isi alasan dibaca lewat cuplikan). Keyakinan tinggi.
- Knuth, D. E. (1990). The Future of TeX and METAFONT. TUGboat 11(4). https://tug.org/TUGboat/tb11-4/tb30knut.pdf dan The TeX tuneup of 2021, https://tug.org/TUGboat/tb42-1/tb130knuth-tuneup21.pdf (primer; versi TeX 3.141592653, kini hanya di visual). Keyakinan tinggi.
- Knuth, D. E. Email (let's drop the hyphen). https://cs.stanford.edu/~knuth/email.html (primer, lewat cuplikan; tanpa email sejak 1 Jan 1990). Keyakinan tinggi.
- Wikipedia. The Art of Computer Programming; Donald Knuth; Knuth reward check. https://en.wikipedia.org/wiki/The_Art_of_Computer_Programming , https://en.wikipedia.org/wiki/Donald_Knuth , https://en.wikipedia.org/wiki/Knuth_reward_check (sekunder; tahun terbit jilid, lahir 10 Jan 1938, hadiah hanya untuk pelapor pertama, sertifikat Bank of San Serriffe sejak Oktober 2008). Keyakinan tinggi.
- Ditlea, S. (1 Sep 1999). Rewriting the Bible in 0's and 1's. MIT Technology Review. https://www.technologyreview.com/1999/09/01/236540/rewriting-the-bible-in-0s-and-1s/ (sekunder). Isi: Gates "in his syndicated newspaper column … once responded to a reader": "It took incredible discipline, and several months, for me to read it", "If you can read the whole thing, send me a resume"; cek hadiah "few are actually cashed"; TeX "nearly nine years". Ini sumber tertua yang ditemukan untuk kutipan Gates; nama koran dan tanggal kolomnya belum ditemukan. Penerbit juga mencetak versi "You should definitely send me a résumé if you can read the whole thing" sebagai pujian Gates untuk Vol. 1 edisi 3 (belum dilihat langsung). Keyakinan sedang–tinggi.

Perhitungan sendiri: FPB(91, 21) = 7; cara memotong 6 langkah (91→70→49→28→7, lalu 21→14→7), cara pembagian 2 langkah (91 : 21 = 4 sisa 7; 21 : 7 = 3 sisa 0). Contoh di buku Knuth memakai 119 dan 544; di video diganti angka kecil atas keputusan Bu Dewi. Tebak angka dengan jawaban "lebih besar/lebih kecil": 2¹⁰ = 1.024 ≥ 1.000 (10 tebakan). 200³ = 8 juta (ukuran terbesar yang pasti diuji semua, dasar "jutaan ruangan"); 2.000³ = 8 miliar (komentar Knuth, tidak dibacakan). Knuth lahir 10 Jan 1938, jadi berusia 24 pada Jan 1962, 36 pada 1974, dan 88 pada Feb 2026. Al-Khwarizmi (±825 M) → ±1.200 tahun lalu. 1962 → 2026 = 64 tahun; 1962 → 2007 (kertas 12 bab masih disimpan) = 45 tahun, dasar "puluhan tahun kemudian".

## Catatan untuk produksi (keputusan Bu Dewi, 9 Nov 2026)

1. Transparansi: kalimat untuk deskripsi YouTube dipakai, dan kalimat yang sama juga dibacakan di akhir video (sebelum ajakan subscribe).
2. Label di layar menulis nama model lengkap: "Claude Opus 4.6 (Anthropic)", "GPT-5.3-codex (OpenAI)", "GPT-5.4 Pro (OpenAI)".
3. Contoh FPB memakai angka kecil 91 dan 21 (tali rafia); konteks tetap algoritma Euclid dari bab pertama buku Knuth.
4. Lelucon "empat bulan kebahagiaan" tidak dipakai: waktunya di wawancara 2007 tidak cocok dengan cerita ulang tahun ke-24 (Knuth 1993), dan bab 1 sudah cukup padat.
5. Kutipan bahasa Inggris ("Shock! Shock!", "Hats off to Claude!") diuji di contoh suara Bian.
6. Ditambahkan: bukti kasus ganjil diperiksa ulang oleh Kim Morrison dengan Lean (primer: repositori KnuthClaudeLean). Kalimat penutup "we are living in very interesting times indeed" tidak dibacakan karena hanya bersumber sekunder.
7. Tempo: bab 3, 4, 7, 8 diberi jeda tayang sesudah penjelasan (lihat kepala naskah).
- Terkonfirmasi dari catatan asli Knuth (PDF dikirim Bu Dewi, revisi 14 April 2026): "Shock! Shock!", Claude Opus 4.6 dirilis tiga minggu sebelumnya, m = 3 oleh Knuth, 4–16 oleh Stappers, eksplorasi 31 ±1 jam, uji ganjil 3–101, bukti ganjil oleh Knuth, Lean oleh Kim Morrison, Claude hanya menemukan m = 4, 6, 8 untuk genap, Ho Boon Suan dengan gpt-5.3-codex (diuji 8–200 dan acak 400–2000), GPT-5.4 Pro "apparently flawless 14-page paper", "Hats off to Claude!", "revise my opinions about 'generative AI'", penutup "We are living in very interesting times indeed" (kini dibacakan).
