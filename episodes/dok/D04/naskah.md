# Buku yang Ditulis Selama 64 Tahun dan Belum Selesai

Dokumenter animasi ±10 menit untuk penonton umum, channel I Teach Software Engineering (@iTeachSWE).
Naskah revisi 1 (setelah dua pemeriksaan fakta, 9 Nov 2026), untuk dibaca Bu Dewi. Teks biasa adalah narasi yang dibacakan; teks *[Visual: …]* adalah catatan gambar dan tidak dibacakan.
Gaya, narator (Bian), musik, dan Bip sama dengan D01–D03. Orang sungguhan (Donald Knuth, Filip Stappers, Ho Boon Suan, Bill Gates) tidak digambar dan suaranya tidak ditiru: mereka hadir lewat benda (meja, lampu, pensil, surat), tangan tanpa ciri, label nama, dan kutipan yang diketik di layar. Tulisan tangan di layar memakai huruf ilustratif, bukan tulisan asli. Adegan sehari-hari (warung, kelas) dan tokohnya rekaan. AI digambar abstrak (kartu catatan bernomor, garis cahaya), tanpa maskot, wajah robot, atau logo perusahaan; AI dari Anthropic dan dari OpenAI digambar dengan gaya yang setara.

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

Bayangkan dua lidi di meja warung. Yang satu panjangnya lima ratus empat puluh empat milimeter, dan yang lain seratus sembilan belas milimeter. Kalau kita terus memotong lidi yang panjang sepanjang lidi yang pendek, setelah delapan kali memotong kita mendapat dua potongan yang sama panjang, yaitu tujuh belas milimeter. Itulah FPB-nya.
*[Visual: dua lidi berlabel 544 dan 119; Bip memotong dengan penghitung 1 sampai 8 (544→425→306→187→68, 119→51, 68→17, 51→34→17); dua potongan terakhir sama-sama 17.]*

Cara yang ditulis di buku Knuth lebih cepat. Kita langsung membagi dan memakai sisanya, sampai sisanya nol. Jawabannya tetap tujuh belas, tetapi kali ini hanya butuh empat kali pembagian.
*[Visual: tangga sisa 544 → 119 → 68 → 51 → 17 → 0; penghitung berhenti di 4, di samping penghitung lama yang berhenti di 8. Tidak ada label "temuan Knuth"; cukup label "cara pembagian".]*

## 4. Menghitung langkah (±1:05)

Membandingkan banyaknya langkah seperti ini disebut analisis algoritma, istilah yang dipopulerkan oleh Knuth.

Coba main tebak angka dari satu sampai seribu. Temanmu hanya boleh menjawab "lebih besar" atau "lebih kecil". Menebak satu per satu bisa butuh seribu tebakan. Kalau kamu selalu menebak angka di tengah, setiap jawaban membuang separuh kemungkinan, sehingga sepuluh tebakan sudah cukup.
*[Visual: dua murid rekaan di kelas; gelembung jawaban "lebih besar" / "lebih kecil"; deretan 1–1000 terlipat dua berulang kali; penghitung tebakan berhenti di 10; Bip bersorak.]*

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

Supaya bisa fokus, Knuth berhenti memakai email sejak tahun seribu sembilan ratus sembilan puluh. Orang pertama yang menemukan sebuah kesalahan di bukunya mendapat hadiah dua koma lima enam dolar, yang ia sebut satu dolar heksadesimal. Dulu hadiahnya berupa cek, dan banyak penerima memilih membingkainya. Kini hadiahnya berupa sertifikat dari bank khayalan.
*[Visual: kotak masuk email dengan angka 0 membeku di samping tumpukan surat kertas; cek generik "$2.56" (bukan desain asli) dibingkai di dinding; lalu sertifikat generik "0x$1.00" dari "bank di negeri khayalan" (bukan desain asli) masuk ke amplop.]*

Buku ini terkenal sulit. Bill Gates pernah menulis di kolom korannya bahwa ia butuh disiplin dan waktu berbulan-bulan untuk membacanya. Ia juga menulis, kalau kamu bisa membaca semuanya, kirimkan riwayat hidupmu kepadanya.
*[Visual: potongan kolom koran generik tanpa foto, tanpa nama koran dan tanpa tanggal; kalimat yang disorot melayang dan menempel di sampul buku bergaya.]*

## 7. Teka-teki tiga jalan (±1:05)

Kembali ke tahun dua ribu dua puluh enam, Knuth sedang menulis tentang rute yang mengunjungi setiap tempat tepat satu kali, lalu kembali ke tempat awal.

Bayangkan gedung kubus berisi dua puluh tujuh ruangan, tiga kali tiga kali tiga. Setiap ruangan punya tiga pintu satu arah, yaitu ke kanan, ke belakang, dan ke atas. Pintu di ujung gedung tembus ke sisi seberangnya, seperti di game Pac-Man.
*[Visual: kubus 3×3×3 transparan dengan 27 titik; panah ke kanan, ke belakang, ke atas; satu titik keluar dari sisi kanan lalu muncul di sisi kiri.]*

Teka-tekinya adalah mewarnai setiap pintu dengan merah, hijau, atau biru, sehingga setiap warna menjadi satu jalan yang melewati semua ruangan tepat satu kali.
*[Visual: tiga ular cahaya merah, hijau, biru menyusuri kubus; setiap pintu hanya dilewati satu warna.]*

Knuth bisa memecahkan kubus berukuran tiga, dan temannya, Filip Stappers, memakai komputer untuk menemukan jawaban sampai ukuran enam belas. Tetapi aturan untuk semua ukuran belum ditemukan.
*[Visual: kubus membesar 3, 5, 16; tanda tanya di atas kubus berukuran tak diketahui; label nama "Filip Stappers" di samping papan ketik, tanpa wajah.]*

## 8. Tiga puluh satu percobaan (±1:40)

Stappers lalu memberikan soal itu kepada Claude Opus empat koma enam, model AI buatan Anthropic yang baru dirilis tiga minggu sebelumnya.

AI itu mencoba banyak cara dengan menulis program kecil, sementara Stappers terus mendampingi dan mengingatkannya mencatat kemajuan.
*[Visual: deretan kartu catatan bernomor 1 sampai 31; sebagian besar abu-abu berlabel "terlalu lambat" atau "tidak berhasil"; tangan tanpa ciri menempelkan catatan "perbarui catatan!".]*

Pada percobaan ketiga puluh satu, sekitar satu jam setelah mulai, AI itu menghasilkan program yang berhasil untuk kubus berukuran ganjil. Stappers mengujinya sampai ukuran seratus satu, lalu Knuth menulis sendiri bukti matematikanya.
*[Visual: kartu nomor 31 menyala; kubus 3, 5, 7 terisi tiga warna; centang hijau sampai 101; pensil menulis bukti di kertas.]*

Untuk ukuran genap, AI itu hanya berhasil pada beberapa ukuran kecil dan tidak menemukan aturan umumnya. Beberapa hari kemudian, Ho Boon Suan dari Singapura meminta model GPT buatan OpenAI menulis program untuk ukuran genap mulai delapan. Ia mengujinya pada banyak ukuran, termasuk kubus berisi jutaan ruangan.
*[Visual: kubus 4, 6, 8 dengan centang kecil, lalu tanda tanya; garis cahaya bergaya berbeda tetapi setara (pola garis, bukan maskot atau logo) berlabel "GPT (OpenAI)"; label nama "Ho Boon Suan, Singapura"; zoom keluar ke kubus raksasa berlabel "200 × 200 × 200 = 8 juta ruangan".]*

Tidak lama kemudian, model GPT lain menulis bukti empat belas halaman untuk ukuran genap, dan Knuth menyebutnya tampak tanpa cacat.
*[Visual: tumpukan 14 halaman rapi dengan rumus ilustratif; kaca pembesar menyusuri halaman; label "diperiksa Knuth".]*

Tiga tahun sebelumnya, Knuth meminta mahasiswanya menguji ChatGPT. Ia heran karena jawaban karangan bisa terdengar sangat meyakinkan, dan ia menyerahkan penelitian AI semacam itu kepada orang lain. Kini ia menulis bahwa sepertinya ia harus merevisi pendapatnya tentang AI generatif. Ia juga menulis "Hats off to Claude!", yang artinya angkat topi untuk Claude.
*[Visual: dua kutipan diketik rapi berdampingan, berlabel "2023" dan "2026"; timbangan bergeser pelan tanpa jatuh.]*

## 9. Penutup (±0:45)

Jadi, apakah buku ini menjadi usang karena ada AI? Jawabannya tidak. AI membantu mencari, mencoba, bahkan menulis sebagian bukti. Tetapi manusialah yang mengajukan pertanyaan, mendampingi, menguji, dan memeriksa apakah jawabannya benar.
*[Visual: kubus tiga warna mengecil menjadi satu halaman buku; tangan tanpa ciri, kartu catatan AI (dua gaya garis yang setara), dan pensil ada di halaman yang sama.]*

Knuth sudah menulis bukunya selama enam puluh empat tahun. Ia memberi hadiah kepada orang yang menemukan kesalahannya, dan di usia delapan puluh delapan tahun ia masih terbuka untuk memikirkan ulang pendapatnya. Belajar memang tidak harus cepat, asalkan kita tidak berhenti.
*[Visual: meja malam; kertas 12 bab tumbuh menjadi pohon; cabangnya buku, daunnya ikon aplikasi di HP; cabang yang belum jadi digambar putus-putus, dan sebuah pensil kecil terus menulis.]*

Kalau kamu ingin memahami cara kerja teknologi di sekitarmu, subscribe channel I Teach Software Engineering. Sampai jumpa di cerita berikutnya.
*[Visual: kartu akhir dengan Bip dan youtube.com/@iTeachSWE.]*

---

## Sumber (untuk deskripsi YouTube)

Primer = tulisan atau ucapan Knuth sendiri, atau dokumen resmi; sekunder = laporan pihak lain. Halaman Stanford milik Knuth tidak bisa dibuka dari lingkungan riset (sertifikat emSign tidak dikenal, WebFetch 503); isinya dibaca lewat salinan atau cuplikan mesin pencari, jadi wajib dibuka langsung sebelum suara dibuat.

Kalimat untuk deskripsi (disarankan): "Naskah video ini disusun dengan bantuan AI, termasuk Claude buatan Anthropic, lalu diperiksa fakta dan disunting manusia."

- Knuth, D. E. (28 Feb 2026, beberapa kali direvisi). Claude's Cycles. https://cs.stanford.edu/~knuth/papers/claude-cycles.pdf (primer; dibaca lewat salinan "revised 04 March 2026" di https://github.com/kim-em/KnuthClaudeLean). Isi: "Shock! Shock!", masalah kubus m³, Knuth memecahkan m = 3, Stappers m = 4–16, 31 eksplorasi ±1 jam, uji m ganjil 3–101, bukti kasus ganjil oleh Knuth; di eksplorasi 24 Claude hanya menemukan jawaban untuk m = 4, 6, 8 tanpa aturan umum ("it seemed to get stuck"), dan dijalankan ulang ±4 jam tanpa solusi penuh; Ho Boon Suan dengan kode GPT-5.3-codex untuk m genap ≥ 8, diuji untuk semua m genap 8–200 dan beberapa nilai acak 400–2000 (komentar Knuth: graf m = 2000 punya 8 miliar titik); m = 4 dan 6 lewat pencarian komputer, m = 2 mustahil (1982); "I'll have to revise my opinions about 'generative AI' one of these days"; "Hats off to Claude!". Keyakinan tinggi untuk revisi 4 Maret. Revisi berikutnya dilaporkan bertanggal 6 Maret (cuplikan pencarian) dan 16 Maret 2026 (sekunder); tidak ada bukti revisi 14 April.
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

Perhitungan sendiri: FPB(544, 119) = 17; cara pengurangan 8 langkah (544→425→306→187→68; 119→51; 68→17; 51→34→17), cara pembagian 4 langkah (sisa 68, 51, 17, 0) bila mulai dari 544 dan 119 (urutan Knuth 119, 544 butuh satu langkah tukar lebih dulu). Tebak angka dengan jawaban "lebih besar/lebih kecil": 2¹⁰ = 1.024 ≥ 1.000 (10 tebakan). 200³ = 8 juta (ukuran terbesar yang pasti diuji semua, dasar "jutaan ruangan"); 2.000³ = 8 miliar (komentar Knuth, tidak dibacakan). Knuth lahir 10 Jan 1938, jadi berusia 24 pada Jan 1962, 36 pada 1974, dan 88 pada Feb 2026. Al-Khwarizmi (±825 M) → ±1.200 tahun lalu. 1962 → 2026 = 64 tahun; 1962 → 2007 (kertas 12 bab masih disimpan) = 45 tahun, dasar "puluhan tahun kemudian".

## Catatan untuk Bu Dewi

- Panjang narasi terukur: **6.889 karakter** (34 paragraf narasi saja, tanpa judul bab dan catatan visual; 6.922 bila antarparagraf dihitung satu spasi). Masih dalam rentang 6.300–6.900, setara D03 (±9,5–10 menit). Perkiraan kredit ElevenLabs: narasi ±3.100–3.800 (0,45–0,55 kredit per karakter), Short ±250, cadangan ulang beat ±250, jadi ±3.600–4.300 kredit.
- Judul kerja tetap "Buku yang Ditulis Selama 64 Tahun dan Belum Selesai". Alternatif: "Teka-teki Profesor 88 Tahun yang Dipecahkan Bersama AI". Hindari judul "AI memecahkan" saja.

**Yang berubah dari draf (berdasarkan dua pemeriksaan fakta)**
1. Bagian AI (bab 8–9) diperbarui melewati revisi 4 Maret: ditambah kalimat bahwa model GPT lain kemudian menulis bukti empat belas halaman untuk ukuran genap, yang disebut Knuth tampak tanpa cacat. Penutup kini berbunyi "AI membantu mencari, mencoba, bahkan menulis sebagian bukti. Tetapi manusialah yang mengajukan pertanyaan, mendampingi, menguji, dan memeriksa apakah jawabannya benar." (sebelumnya "manusialah yang … membuktikan", salah untuk kasus genap).
2. "AI itu macet" diganti: AI hanya berhasil pada beberapa ukuran kecil dan tidak menemukan aturan umumnya.
3. Ho Boon Suan: kini jelas bahwa ia meminta model GPT buatan OpenAI menulis program untuk ukuran genap mulai delapan; "diuji sampai delapan miliar ruangan" (komentar Knuth, belum tentu diuji) diganti "termasuk kubus berisi jutaan ruangan" (200³ = 8 juta, pasti diuji).
4. Keseimbangan nama: Claude dan GPT kini sama-sama disebut namanya beserta perusahaannya (Anthropic, OpenAI), dan di visual digambar dengan gaya setara. Kalimat transparansi untuk deskripsi YouTube ditambahkan di bagian Sumber.
5. ChatGPT 2023: kini "Knuth meminta mahasiswanya menguji ChatGPT"; hubungan "karena" yang merupakan tafsiran dihapus; "penelitian AI bukan untuknya" diganti "menyerahkan penelitian AI semacam itu kepada orang lain" (sesuai "leave such research to others"). "Menutup catatannya dengan Hats off to Claude" diganti "Ia juga menulis …", karena revisi terbaru mungkin punya kalimat penutup lain. Ditambah "tentang AI generatif".
6. "Masih mau mengubah pendapat" diganti "masih terbuka untuk memikirkan ulang pendapatnya" (Knuth hanya menulis "I'll have to revise my opinions … one of these days").
7. Hadiah kesalahan: kini hanya untuk orang pertama yang menemukan kesalahan; cek yang dibingkai disebut sebagai cerita lama; sejak 2008 hadiahnya sertifikat dari bank khayalan. Visual dipisah menjadi cek lama yang dibingkai dan sertifikat baru. Bab 9: "membayar" diganti "memberi hadiah".
8. Bill Gates: "baginya" (pengalaman Gates sendiri, bukan sifat umum buku); "Itu pujian, bukan tawaran kerja" (tafsiran narator) dihapus; "bercanda" juga tidak dipakai, cukup "Ia juga menulis …". Tanpa tahun dan tanpa nama koran, juga di visual. (Catatan draf yang menyebut narasi memuat "tahun sembilan puluhan" keliru; narasi tidak pernah memuatnya.)
9. Euclid: "Cara di buku Knuth lebih cerdik" diganti "Cara yang ditulis di buku Knuth lebih cepat" supaya tidak terkesan Knuth penemu cara pembagian. Judul bab 3 menjadi "Salah satu algoritma tertua".
10. Tebak angka: syarat jawaban "lebih besar" atau "lebih kecil" kini disebut. Kalimat jilid ketiga ditulis ulang supaya tidak menyiratkan Knuth penemu pencarian biner, dan tidak lagi mengklaim cara kerja aplikasi kontak tertentu; ditambah syarat "nama yang urut".
11. "Knuth sendiri yang mengusulkan nama itu" diganti "istilah yang dipopulerkan oleh Knuth" (lebih aman).
12. Kertas dua belas bab: "masih ia simpan sampai sekarang" diganti "masih ia simpan puluhan tahun kemudian" (bukti terakhir 2007).
13. Jilid: "masih ada beberapa jilid yang belum ditulis" diganti "beberapa jilid lagi masih dalam pengerjaan"; tahun 1993 dihapus dari narasi (tetap di visual sebagai "target: 2003"). Visual lini waktu: tanda 2025 menjadi "Fasikel 7 (awal 4C)", dan celah 1973–2011 diisi edisi baru jilid 1–3, TeX, dan fasikel.
14. Pembuka: "buku setua itu" menjadi "ide-ide dari buku setua itu".
15. Daftar sumber diperbaiki: ulang tahun ke-24 bersumber dari Knuth 1993 (bukan CHM); 3.000 halaman tulisan tangan (2.000 halaman adalah perkiraan penerbit untuk buku cetak); TeX menurut Knuth 11 tahun; tanggal revisi Claude's Cycles (4, 6, dan 16 Maret; tidak ada bukti 14 April).
16. Dipangkas supaya panjang tetap di bawah 6.900: lelucon "empat bulan kebahagiaan" dihapus (selain soal panjang, waktunya di CHM tidak cocok dengan cerita ulang tahun ke-24, karena Knuth menikah musim panas 1961); kalimat "Hasilnya sama … bedanya bisa sangat jauh" dan "TeX masih dipakai … mendekati angka pi" dihapus dari narasi (nomor versi pi tetap muncul di visual tanpa dibacakan); kalimat Stappers mendampingi dipadatkan ("menjalankannya ulang saat ada kesalahan" tidak dibacakan lagi).

**Yang masih perlu dipastikan sebelum suara dibuat**
- Kalimat bukti empat belas halaman (bab 8) hanya bersumber primer lewat cuplikan dan sekunder (keyakinan sedang–tinggi). Saya perlu membuka https://cs.stanford.edu/~knuth/papers/claude-cycles.pdf dan even_closed_form_proof_final.pdf langsung. Kalau tidak terkonfirmasi, kalimat itu dihapus (narasi menjadi ±6.730 karakter, masih dalam rentang) dan penutup kembali ke "AI membantu mencari dan mencoba".
- Pastikan "Hats off to Claude!" dan kalimat "revise my opinions about 'generative AI'" masih ada di revisi terakhir.
- Tanggal ulang tahun: Knuth 1993 dan CHM ("January of 1962") cocok dengan ulang tahun ke-24 (10 Jan 1962), tetapi cerita "four months of wedded bliss" di CHM memberi waktu lain. Narasi mengikuti versi 1993.
- Kutipan Gates: isinya cocok dengan MIT Technology Review 1999 (sekunder) dan pujian di sampul buku, tetapi kolom aslinya belum ditemukan. Klaim "1995" yang sering beredar tidak berdasar (tahun itu milik ulasan majalah Byte yang tercetak di sampul yang sama).
- "Beberapa jilid lagi masih dalam pengerjaan": 4C dan 5 memang dikerjakan (fasikel dan draf); jilid 6–7 baru rencana. Kalimatnya umum, jadi saya anggap aman.
- Sumber Vol. 2 §4.5.2 dan Vol. 3 §6.2.1 dikutip dari ingatan pemeriksa fakta; belum dilihat langsung. Keduanya hanya dipakai untuk melunakkan klaim, bukan untuk klaim baru.
- "Penerbit terkejut" (bab 1) tidak ditandai pemeriksa, tetapi kata-kata persisnya belum saya cocokkan.

**Keputusan yang perlu Bu Dewi ambil**
1. Transparansi: pakai kalimat deskripsi di atas, atau tambahkan juga di narasi akhir bab 8 (±100 karakter; bisa dengan memangkas kalimat lain).
2. Nama model: narasi menyebut "Claude Opus empat koma enam" dan "model GPT buatan OpenAI". Apakah label di layar perlu menulis nama lengkap GPT-5.3-codex dan GPT-5.4 Pro supaya benar-benar setara?
3. Angka lidi 544 dan 119 adalah contoh asli buku Knuth, tetapi terdengar panjang. Bisa diganti angka kecil (misalnya 24 dan 18), walaupun kaitannya dengan buku hilang. Kalau ada ruang, bisa ditambah satu kalimat: "Cara memotong ini mirip dengan cara Euclid sendiri menjelaskannya."
4. Lelucon "empat bulan kebahagiaan" bisa dikembalikan kalau Bu Dewi suka, dengan memangkas bagian lain.
5. Kutipan bahasa Inggris ("Shock! Shock!", "Hats off to Claude!") perlu dicek di uji suara apakah Bian mengucapkannya dengan wajar.
6. Tambahan opsional (sekunder, keyakinan sedang): bukti Knuth untuk ukuran ganjil diperiksa ulang dengan program pemeriksa bukti Lean oleh Kim Morrison, dan revisi 16 Maret ditutup dengan "we are living in very interesting times indeed". Keduanya belum dibacakan.
