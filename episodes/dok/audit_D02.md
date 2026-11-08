# Rencana Perbaikan untuk Dokumenter D03 (dari audit D02)

## 1. Ringkasan

D02 sudah punya dasar yang kuat. Bidikan 3D-nya bagus, angkanya bersumber, gambarnya ikut kalimat narasi, dan metafora meja/lemari mudah dipahami. Masalahnya, video terasa lambat dan mirip slide presentasi:
- ±26% durasi tanpa narasi.
- 33 dari 34 pergantian adegan dipotong mendadak tanpa transisi.
- Adegan 2D tidak punya gerak kamera dan latarnya langit kosong.
- Suaranya pelan (−19,4 LUFS).

Tiga lompatan terbesar untuk D03:
1. **Ritme**: buang jeda "waktu baca murid" dan pendekkan kartu bab. Ini menghemat ±60–80 detik.
2. **Gerak**: kamera bergerak di setiap adegan, ada transisi antaradegan, dan detik pertama setiap adegan sudah berisi gambar.
3. **Dunia yang hidup**: latar berupa tempat yang jelas, ada tokoh manusia, Bip benar-benar beraksi, dan setiap catatan [Visual] di naskah dibuat.

Semuanya dijaga oleh pemeriksaan otomatis sebelum render penuh.

## 2. Yang sudah bagus dan dipertahankan

- Bidikan 3D: wafer (2:45), lorong pusat data (4:00), dan keping HBM yang terbang lalu bertumpuk (4:42). Urutan HBM adalah contoh terbaik benda yang "terbawa" dari satu adegan ke adegan berikutnya.
- Satu angka besar per adegan, dan angkanya menghitung naik. Angka ini tetap terbaca di layar HP.
- Grafik digambar sesuai skala dan diberi catatan sumber kecil. Deskripsi berisi daftar sumber dan hitungan sendiri.
- Analogi lokal (meja/lemari, penjual nasi goreng) dan bab tips praktis.
- Kalimat penutup bab yang membuat penasaran di bab 0 dan bab 2.
- Gambar dan efek suara diikat ke potongan kalimat narasi. Semua bisa dirender ulang dengan hasil sama, dan audio bisa diganti tanpa render ulang gambar (`--mux`).
- Palet warna, font Inter, dan tidak ada logo merek.

## 3. Prioritas perbaikan

| No | Area | Masalah di D02 | Perbaikan untuk D03 | Dampak | Usaha |
|---|---|---|---|---|---|
| 1 | Ritme | Aturan baca 1,6 kata/detik dari video kelas ikut dipakai: +47,7 detik sunyi. Paling parah 0:18–0:24 (6 detik diam di pembuka). | Mode dokumenter: lama adegan = durasi suara + 0,3 detik. Jeda hanya bila ditulis di naskah. | tinggi | kecil |
| 2 | Kartu bab | Tampil 4,9–8,3 detik (total ±57 detik). Latarnya hanya 82% gelap sehingga adegan lama tembus. Kartu memudar ke adegan LAMA lalu dipotong (1:04, 2:17, 3:22…). | Kartu 2,5–3 detik, gelap penuh, judul ≥120 px dengan ikon bab. Kartu memudar ke adegan BARU. Tanpa kartu "Penutup". | tinggi | kecil |
| 3 | Kenyaringan | Video −19,4 LUFS dengan puncak +0,2 dBTP; Short −18,6 LUFS. | Normalkan ke −14 LUFS, puncak −1 dBTP. Render dianggap gagal bila hasilnya di luar batas. | tinggi | kecil |
| 4 | Subtitel | 36 subtitel raksasa (sampai 315 karakter, 18 detik), angka dieja dengan huruf. Padahal subtitel adalah satu-satunya teks narasi. | Maks. 2 baris × 42 karakter, ≤7 detik per subtitel, angka ditulis sebagai angka (Rp1.399.000). | tinggi | kecil |
| 5 | Gerak | Adegan 2D tanpa kamera (0 pemakaian). Gambar diam 6–9 detik saat narasi jalan (1:23, 5:33, 8:59…). | Dorong-masuk pelan dan geser di setiap adegan 2D. Latar berlapis yang bergerak beda kecepatan (paralaks). Alat pemeriksa bagian diam >4 detik. | tinggi | kecil |
| 6 | Transisi | Potongan mendadak di 33/34 pergantian. Sekitar 14 adegan dimulai dari layar kosong. Benda melompat posisi (1:21). Pindah 2D↔3D dipotong (2:45, 4:51, 9:31). | Silang-pudar, geser, atau zoom 0,4–0,8 detik. Benda yang sama dibawa dan dipindahkan, bukan digambar ulang. Peralihan 2D↔3D memakai posisi benda yang sama. | tinggi | sedang |
| 7 | Pembuka | 0:09–0:23 gambar beku. Etalase toko, kota, dan aksi Bip dari naskah tidak dibuat. Bip baru muncul 0:46. Tidak ada janji isi. | Kejutan ≤5 detik, gambar berganti tiap 2–4 detik, Bip muncul ≤5 detik, dan janji diucapkan ("di akhir ada 5 cara…"). | tinggi | sedang |
| 8 | Short | Adegan hanya ±25% tinggi layar, dipercepat 2,2–2,65×, teks terpotong ("i di toko online"), tanpa musik (sunyi total), pembuka berupa pertanyaan pasif, alamat channel tidak bisa diklik. | Potongan rapat 9:16 pada satu benda, kecepatan normal, musik + −14 LUFS. Fakta paling mengejutkan di ≤1,5 detik. Ajakan ke tautan "Video terkait". | tinggi | sedang |
| 9 | Isi gambar | Catatan [Visual] diganti teks atau pil (8 tidak dibuat). Bip hanya 5 kali dan diam (0 dari 5 aksi). Tidak ada manusia. Metafora meja ditinggalkan di bab AI. | Daftar periksa catatan [Visual]. Bip bisa memegang benda, berjalan, dan kaget. Helper `orang()` untuk tokoh rekaan. Satu metafora utama di setiap bab. | tinggi | sedang |
| 10 | Latar & gaya | Latar hampir selalu langit bintang yang sama. 21% frame isinya <2,5%. Kicker 21, pil 33, daftar bernomor, layar teks saja (6:08). | Set latar 3 lapis (kamar, rumah, dapur, ruang makan). Grafik "hidup" di dalam benda. Maks. 1 kicker per bab. Tidak ada layar teks saja >1,5 detik. | tinggi | besar |
| 11 | Tata letak | 31 ukuran huruf ≤32 px. Teks terpotong (0:28) atau bertumpuk (2:17). 11 pil di zona bawah yang tertutup player (y 960–1000). Vignette membuat judul abu-abu. | Label ≥44 px, zona aman y≤900 dan 96 px dari tepi, teks digambar SETELAH vignette, pemeriksa tata letak otomatis. | sedang | sedang |
| 12 | Sinkron | Angka muncul ±3 detik sebelum diucapkan (0:07–0:10, 0:27, 8:11). Perkiraan waktu kata meleset sampai 1,25 detik. | Waktu tiap kata diambil dari ElevenLabs (with-timestamps). Angka dan efek suara dipasang pada kata yang diucapkan. | sedang | sedang |
| 13 | Audio | Suara diturunkan ke 22 kHz, lalu dinaikkan lagi dengan cara kasar sehingga muncul desis palsu. Antarbeat beda 3,2 LU. Efek "pop" 15 dB di bawah suara. 146 detik tanpa efek suara (5:58–8:24). Musik naik-turun mengikuti jeda kalimat. Klik kecil di ujung beat. | 44,1 kHz stereo, AAC 192k. Normalkan per beat (LUFS). Level efek suara per jenis + efek otomatis untuk elemen yang muncul. Musik turun-naik mengikuti adegan, bukan per kalimat. Fade 10–15 ms di ujung beat. | sedang | kecil |
| 14 | Gambar | Hampir semua frame gelap (median kecerahan 24/255). Bitrate 1,96 Mb/s (veryfast, crf 20). Grain tidak bekerja di area gelap. | Latar lebih terang dan ada sumber cahaya. Encode slow crf 14, aq-mode 3. Grain merata di semua kecerahan. | sedang | kecil |
| 15 | Kredibilitas | Label "1 GB" keliru (4:59). Angka +300/+600 rb dan 2030 tidak bersumber. Saran "tutup aplikasi" tidak ada sumbernya. "RAM virtual" tidak muncul di layar. | Setiap angka di layar harus ada di daftar sumber atau diberi tanda "ilustrasi". Untuk D03: angka OJK dan kasus Mempawah dicek dulu ke sumber resmi. | sedang | kecil |
| 16 | Naskah | Kalimat pembuka bab 1–8 semuanya pernyataan. Kalimat penutup yang membuat penasaran hanya di 2 dari 9 pergantian bab. | Setiap bab dibuka dengan pertanyaan dan ditutup dengan kalimat yang membuat penasaran. | sedang | kecil |
| 17 | Kemasan | Thumbnail gelap (72% piksel <40), teks terlalu banyak, Bip di pojok label durasi. Judul 77 karakter. Akhir video: "Tonton juga" hanya 7,7 detik, tombol SUBSCRIBE gambar yang tidak bisa diklik, ajakan tidak menyebut video tertentu. | Thumbnail ≤4 kata, Bip besar, latar terang, diperiksa di ukuran 168 px. Judul ≤60 karakter. Layar akhir 20 detik sesuai templat YouTube, ajakan menyebut satu video. | sedang | kecil |
| 18 | Detail 3D | Cahaya menembus lemari (4:08), LED jadi putih, takik wafer menonjol, debu berbentuk kotak. | Perbaiki saat panggung 3D D03 dibuat. | rendah | kecil |
| 19 | Musik | Satu putaran 4 akor (32 detik) diulang ±8 kali, tanpa puncak saat pengungkapan. | Musik disusun per bagian (build, klimaks) dan ada suasana "tegang". | rendah | sedang |

## 4. Perubahan alat dan pipeline (berlaku untuk semua dokumenter)

- **voice.py**: mode dokumenter (tanpa aturan waktu baca), 44,1 kHz, normalkan per beat dalam LUFS, fade di ujung beat, langsung menulis `narration_vo.wav`, laporan jeda >3 detik.
- **suara_elevenlabs.py**: simpan waktu tiap huruf/kata (with-timestamps). `at()` memakai waktu itu; perkiraan lama hanya cadangan.
- **Mesin sinema** (pindah ke `_alat/dok/`): kamera bawaan, latar berlapis, transisi per beat (`"trans"` di script.json), kartu bab baru, lapisan teks setelah vignette, pembantu posisi benda antaradegan, token huruf, garis, dan sudut.
- **Pustaka bersama**: benda dengan varian, `orang()`, set latar, peta Indonesia dari titik-titik, pose Bip, ikon vektor pengganti emoji.
- **Mastering**: musik stereo, efek suara otomatis, −14 LUFS / −1 dBTP, AAC 192k. Encode crf 14 slow aq-mode 3.
- **Pemeriksaan sebelum render penuh** (`preview.py`): bagian diam, teks kecil, teks keluar zona aman atau bertumpuk, frame sepi, kecerahan, isi `__missing`, cakupan catatan [Visual], angka tanpa sumber, dan jarak waktu gambar ke kata yang diucapkan.
- **render.py**: subtitel dipecah pendek; render dibagi otomatis ke beberapa proses sekaligus (4 inti).
- **render_short.py**: tanpa peregangan waktu, potongan rapat, musik, tolak potongan yang memotong teks.
- **youtube.py**: cek panjang judul, stempel bab diambil dari awal kartu, tautan ke dokumenter lain dan playlist, pratinjau thumbnail kecil.

## 5. Rencana visual per bab D03

- **0. Pembuka**: Detik 0 sudah ada dering HP di kamar gelap Bu Rina, yang diterangi cahaya layar dan lampu jalan (terang cukup, tidak keruh). Kamera menembus dinding ke anak yang tidur. Gelombang suara narator berubah menjadi angka. Janji "5 cara melindungi keluarga" diucapkan. Kartu bab pertama menyatu dengan gerak kamera.
- **1. Sidik jari suara**: Kamera mendorong pelan ke penampang leher. Spektrogram memenuhi ≥50% layar dan berubah bentuk menjadi sidik jari. Ini metafora utama yang dipakai sampai akhir. Bip membandingkan dengan kaca pembesar.
- **2. Mesin meniru**: Bidikan 3D jaringan neuron. Pindah ke 2D lewat warna spektrogram yang sama. Stopwatch dan meteran 85% menghitung naik tepat saat diucapkan. Label "satu temuan McAfee 2023" ditampilkan.
- **3. Sumber suara**: Set kampung dengan rumah. Ikon video berkelip lalu terbang menjadi potongan rekaman. Peta ini disimpan untuk bab 8.
- **4. Resep**: Set dapur. Bip menuang tiga toples berlabel besar ke panci, dan uapnya membentuk tanda seru. Tanpa pil teks.
- **5. Sekitar kita**: Peta Indonesia dari titik-titik koordinat, titik Kalimantan Barat berdenyut. Tumpukan map tumbuh dari 0 ke angka yang sudah dicek, dengan sumber kecil.
- **6. Telinga tertipu**: Sepuluh tokoh `orang()`, tujuh menggaruk kepala. Dua spektrogram masuk ke "pipa telepon" lalu keluar sama-sama terpotong (gerak geser, bukan dua gambar statis).
- **7. Tanda bahaya**: Setiap tanda menjadi adegan pendek di layar HP yang digambar kode, bukan daftar centang. Tangan Bip berhenti di tombol "Transfer" lalu menekan "Tunggu".
- **8. Melindungi keluarga**: Set ruang makan dengan keluarga rekaan. Tiap cara diperagakan tokoh. Gembok menutup peta dari bab 3, benda yang sama dibawa kembali.
- **9. Penutup**: Kembali ke kamar Bu Rina dengan cahaya lebih hangat. Tanpa kartu "Penutup". Ajakan menyebut satu video, layar akhir 20 detik sesuai templat.

## 6. Perlu keputusan Bu Dewi

1. **Gaya tokoh manusia**: figur sederhana tanpa detail wajah ala Kurzgesagt, atau wajah ekspresif? Naskah meminta "wajah Bu Rina panik".
2. **Durasi**: kalau jeda dipangkas, D03 menjadi ±8,5–9 menit. Diterima lebih pendek, atau waktu sisanya diisi adegan tambahan?
3. **Kecerahan dan latar**: setuju palet sedikit lebih terang dan membuat set latar (usaha besar, menambah waktu produksi ±beberapa hari), atau cukup kamera + latar berlapis dulu?
## 7. Tambahan dari pemeriksa kelengkapan

- **1. D03 sudah diproduksi dengan aturan lama, tetapi rencana menganggapnya belum dimulai** (tinggi, usaha kecil)
  Bukti: `episodes/dok/D03/timeline.json` sudah di-commit (283fb15, "timeline 10:40"). Isinya 49 beat dengan total 640,3 detik, tetapi suaranya hanya 468,3 detik. Jadi ada **172,1 detik (27%) tanpa narasi**, sama buruknya dengan D02 (±26%). Contoh: b0_4 punya celah 5,0 detik dan b0_5 punya celah 8,4 detik (`hold` 6.0), padahal keduanya ada di pembuka. Semua beat penutup bab memakai `hold` 6.0 (b1_4, b2_5a, b3_4, b4_5, b5_4, b6_4, b7_4, b8_5). Berkas `audio/b*.wav` juga sudah turun ke **22050 Hz mono** (b0_1, b0_1a, b0_2, dan lainnya). Di suara_in hanya ada 49 MP3 tanpa data waktu kata, dan `suara_elevenlabs.py` tidak memakai with-timestamps atau alignment.
  Perbaikan: tambahkan langkah "migrasi D03" ke rencana. Buat ulang timeline dan WAV dari MP3 yang sudah ada, tanpa memanggil TTS lagi. MP3 sumbernya sudah 44,1 kHz (diukur `ffprobe`: 44100 Hz, 128k), jadi kredit ElevenLabs tidak terpakai. Ambil waktu tiap kata lewat forced alignment dari MP3 yang ada, jangan membuat ulang suara (item 12). Laporan waktu mati harus gagal bila celahnya lebih dari 1,5 detik di luar jeda yang ditulis di naskah.

- **2. Penanda "suara buatan AI" dan dramatisasi belum ada di rencana maupun di alat** (tinggi, usaha kecil)
  Bukti: D03 punya 4 beat dialog dengan suara tokoh ElevenLabs yang realistis dan efek telepon (`tts-kit/suara.json` peran "anak"/"ibu"; beat b0_1a, b2_5a, b3_3a, b4_4a). Contohnya tangisan anak "Bu, ini aku. Aku kecelakaan…". Di D02 tidak ada narasi yang dibakar ke video (dicek di sheet s00, hanya label dan angka). Artinya potongan audio dialog ini bisa diambil orang lalu disebar ulang sebagai "rekaman asli". `youtube.md` D02 dan `_alat/youtube.py` sama sekali tidak menyebut pengungkapan "konten diubah/sintetis" di YouTube. Satu-satunya penyebutan adalah "suara sintetis" di deskripsi.
  Perbaikan: pasang label tetap "Dramatisasi · suara dibuat AI" di layar selama beat dialog. Label digambar setelah vignette dan masuk ke potongan Short. Tambahkan butir "Konten diubah/sintetis: Ya" ke templat `youtube.md`, dan beri pemeriksaan di `youtube.py` yang aktif bila script.json berisi beat `suara` atau `efek`.

- **3. Ada elemen baru, dialog lewat telepon, yang belum punya standar audio dan tampilan** (sedang, usaha kecil)
  Bukti: rencana item 13 hanya membahas narator. Hasil ukur ebur128: dialog anak b0_1a −18,7 LUFS dan b4_4a −17,3 LUFS, sedangkan narasi di sekitarnya −16,6 sampai −17,5 LUFS. Jadi dialog yang sudah sempit frekuensinya karena efek telepon (`efek: "telepon"`) malah lebih pelan. Dialog ini adalah kait utama video, dan penonton sasarannya orang tua serta kakek-nenek (b9_2). Subtitel tidak dibakar ke video (lihat item 2), jadi di autoplay tanpa suara kalimat kait ini hilang.
  Perbaikan: samakan kenyaringan dialog dengan narasi (target LUFS yang sama, dicek setelah efek telepon). Tampilkan isi dialog sebagai gelembung teks besar di layar HP yang digambar kode, ≥56 px, ikut kata yang diucapkan. Tambahkan "dialog" ke daftar periksa audio `preview.py`.

- **4. Ajakan bertindak belum bisa langsung dijalankan penonton** (tinggi, usaha kecil)
  Bukti: b8_5 (9:33) menyuruh penonton "laporkan… ke Indonesia Anti-Scam Center", tetapi naskah dan catatan [Visual] tidak memberi alamat situs atau nomor kontaknya. b9_2 (10:07) meminta "Bagikan video ini ke grup keluarga", tetapi tidak ada bahan yang cocok untuk WhatsApp. Short D02 bermasalah (item 8), dan deskripsi D02 hanya memuat link situs kelas dan Subscribe.
  Perbaikan: tampilkan kanal pengaduan resmi IASC/OJK dan langkah "hubungi bank" di layar 5–8 detik. Alamat dan nomornya dicek dulu ke situs resmi OJK, sama seperti cek angka 1.379. Buat satu "kartu 5 cara" bergambar (PNG 1080×1350, dirender dari adegan bab 8) dan satu potongan ±60 detik dengan teks dibakar, supaya bisa dikirim ke WhatsApp. Taruh linknya di deskripsi dan komentar tersemat.

- **5. Judul tidak cocok dengan cerita pembuka** (sedang, usaha kecil)
  Bukti: judul D03 "Suara **Ibumu** Bisa Dipalsukan dalam 3 Detik" (script.json `title`). Padahal di pembuka (b0_1–b0_3) yang dipalsukan adalah suara **anak** yang menelepon ibunya. Suara ibu hanya muncul sebagai contoh rekaman yang dicuri (b3_3a). Rencana item 17 hanya memeriksa panjang judul, bukan apakah janji judul terbayar.
  Perbaikan: samakan judul, thumbnail, dan 30 detik pertama. Ada dua pilihan: ganti judul (misalnya "Suara Anakmu Bisa Dipalsukan dalam 3 Detik"), atau balik ceritanya menjadi ibu yang suaranya dipalsukan untuk menipu anaknya. Tambahkan pemeriksaan "janji judul terbayar ≤30 detik" ke daftar periksa kemasan.

- **6. Pengaturan penonton YouTube ("dibuat untuk anak") tidak dicatat, padahal rencana bergantung pada fitur yang hilang bila pengaturan itu aktif** (sedang, usaha kecil)
  Bukti: `youtube.md` D02 tidak menyebut pengaturan penonton sama sekali (grep "anak|kids|audience" tidak menemukan apa pun dalam pengertian itu). Rencana item 17 bergantung pada layar akhir 20 detik dan komentar tersemat. Video ini kartun dengan maskot Bip dan menautkan ke situs belajar SMP, jadi bisa dianggap konten anak. Bila itu terjadi, layar akhir, komentar, dan notifikasi mati.
  Perbaikan: tambahkan baris wajib "Penonton: Tidak dibuat untuk anak-anak (penonton umum/keluarga)" ke templat `youtube.md`, dan cek di `youtube.py` sebelum unggah.

Berkas yang dirujuk:
- /home/user/animasi-informatika/episodes/dok/D03/timeline.json
- /home/user/animasi-informatika/episodes/dok/D03/script.json
- /home/user/animasi-informatika/episodes/dok/D03/tts-kit/suara.json
- /home/user/animasi-informatika/episodes/dok/D03/audio/
- /home/user/animasi-informatika/episodes/dok/D03/naskah.md
- /home/user/animasi-informatika/episodes/dok/D02/youtube.md
- /home/user/animasi-informatika/episodes/_alat/youtube.py
---
Audit 8 Nov 2026: 8 auditor (komposisi, gerak, sinkron, audio, render 3D, retensi, gaya, teknis), tiap temuan diperiksa ulang verifikator independen; 91 temuan terkonfirmasi, 8 ditolak. Rincian temuan: audit_D02_temuan.json.
