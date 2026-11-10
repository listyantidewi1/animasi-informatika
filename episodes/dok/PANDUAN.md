# Panduan produksi dokumenter (D01–D04 dan seterusnya)

Seri dokumenter animasi untuk penonton umum (bukan kelas tertentu), gaya ilustrasi seperti dokumenter sains populer (figur sederhana, latar berlapis, kamera bergerak, cahaya). Kanal: I Teach Software Engineering (@iTeachSWE). Folder: `episodes/dok/<kode>/`; alat dipanggil dengan kode `dok/<kode>`.

## Keputusan yang sudah disepakati Bu Dewi
- **Narator Bian**: suara ElevenLabs `1k39YpzqXZn52BgyLyGO` ("Bee Ard - Clear, Dynamic Voice"), model Eleven v4, speed 0.95, stability 0.5, similarity 0.75 (`tts-kit/suara.json` tiap episode). **Maskot Bip** (robot hijau toska). Tokoh pendukung boleh bersuara terpisah (`peran` di tts-kit, mis. suara ibu-ibu untuk tokoh ibu).
- **Durasi ±9–10 menit**, 8–10 bab dengan kartu bab. Adegan tambahan hanya bila menarik. Visualisasi matematika/algoritma diberi **jeda tambahan** (`holds` di script.json) dan dibuat rinci; jangan cepat berpindah (masukan D04).
- **Irama**: satu dokumenter tiap 3 hari, dua naskah per minggu. Bu Dewi **menyunting naskah** (`naskah.md`) sebelum produksi, dan **mendengarkan contoh suara** (`contoh_suara.mp3`) sebelum semua beat dibuat.
- **Kualitas diperiksa sendiri** (hemat kuota, tanpa alur kerja banyak agen): `cek_dok.py` + lembar kontak per bab yang dikirim ke Bu Dewi sebelum video dikirim.
- **Orang sungguhan tidak digambar** (mis. Donald Knuth, Bill Gates): tampilkan lewat benda, tangan tanpa ciri, dan label. Nama rekaan dan domain `.example` untuk contoh. Tanpa logo merek. Semua gambar, musik, dan efek suara dibuat dengan kode; jangan unduh aset.
- **Keterbukaan AI**: kalimat "Naskah video ini disusun dengan bantuan AI, termasuk Claude buatan Anthropic, lalu diperiksa fakta dan disunting manusia" di deskripsi, dan dibacakan di akhir video (mulai D04). Label "Dramatisasi · suara dibuat AI" muncul otomatis pada beat dialog.
- **Pengaturan unggah YouTube**: "Tidak, video ini tidak dibuat untuk anak-anak"; "Konten diubah atau sintetis: Ya". Rincian per video di `youtube.md`.
- Satu **Short** per dokumenter (hanya bersuara, ±45–60 detik, pertanyaan kait di atas, 4 cuplikan + ajakan).
- Kredit ElevenLabs: ±3.500–4.500 kredit per dokumenter (naskah ±6.500–8.000 karakter) + ±250 per Short. Cek sisa lewat GET `api.elevenlabs.io/v1/user/subscription`. Kunci API hanya lewat secret jaringan lingkungan cloud (tidak pernah ditulis atau diminta di chat).

## Urutan produksi (pipeline v2, sejak D03)
```
python3 episodes/_alat/suara_elevenlabs.py dok/D05 --hanya b0_1   # contoh suara, minta Bu Dewi dengar
python3 episodes/_alat/suara_elevenlabs.py dok/D05                # semua beat (hanya MP3 yang belum ada)
python3 episodes/_alat/align_dok.py dok/D05                       # waktu kata (forced alignment, tanpa kredit)
python3 episodes/_alat/voice.py dok/D05                           # timeline.json + narasi
# tulis adegan bab<n>.js (mesin sinema_dok.js + dokkit; API di episodes/_alat/dokkit/API.md)
python3 episodes/_alat/preview.py dok/D05 ...                     # cuplikan frame
python3 episodes/_alat/cek_dok.py dok/D05                         # teks kecil/luar/tumpuk, diam, gelap
python3 episodes/_alat/sfx_dok.py dok/D05                         # efek suara (Kiko.sfx)
python3 episodes/_alat/musik_dok.py dok/D05                       # musik v2 + master -14 LUFS
python3 episodes/_alat/render.py dok/D05 --suara --seg=0,1,2,3    # 3 proses paralel (bagi segmen)
python3 episodes/_alat/render.py dok/D05 --suara --lanjut         # gabung
python3 episodes/_alat/lembar_kontak.py dok/D05                   # video/kontak/bab<n>.jpg -> kirim ke Bu Dewi
```
- Hanya suara/musik berubah: `render.py dok/D05 --suara --mux`. Satu bab berubah: `--seg=N` lalu `--lanjut`.
- Contoh lengkap terbaru: `episodes/dok/D04/` (script.json dengan `holds`, `musik.versi: 2`, mood per bab, bab0–9.js, kubus.js). D03 punya `umum.js` (K.sfxParts, K.sfxAt) yang dipakai ulang D04.
- **Short**: `episodes/dok/<kode>/short/script.json` (beat `src` + `at` + `crops` [x, y, w, h] dalam koordinat 1920×1080; boleh beberapa crop bertumpuk). Pilih crop dengan `render_short.py dok/D05 --frame h1=2 h2=5`; setiap kali crop berubah jalankan ulang `voice.py dok/D05/short`; lalu `musik_dok.py dok/D05/short` dan `render_short.py dok/D05 --suara`. Deskripsi di `short/youtube.md`.
- **Thumbnail**: tulis `thumbnail.js` (badan gambar) lalu `python3 episodes/_alat/thumbnail_dok.py dok/D05 episodes/dok/D05/thumbnail.js` -> `thumbnail.jpg`. Gaya: judul besar 2–3 baris kiri (putih + amber), satu objek kunci bercahaya, Bip kanan bawah.
- **Salinan kirim** (video asli ±250–350 MB): `ffmpeg -i video/Informatika_<kode>_*_suara.mp4 -c:v libx264 -preset slow -crf 21 -tune animation -pix_fmt yuv420p -c:a copy -movflags +faststart video/Dokumenter_<Judul_Singkat>.mp4` (±120–160 MB), kirim lewat chat.

## Pelacak unggahan
Halaman "Unggahan Seri Informatika" (https://claude.ai/artifact/31d36ZDMPwSeD7EQeG6Sjh), basis data koleksi:
- `episodes/<kode>`: `{code, judul, kelas: "Dokumenter", urut: 300+n, ep_status: "siap", ep_kirim: 1, ep_terakhir, short_hook, short_status: "terkirim", short_terakhir, bagian: ["thumbnail"], unduh: {short: {s: {id, nama, size}}, thumbnail: {s: {...}}}}`. `id` = id aset hasil unggah Artifact `asset: true` (berkas ≤20 MB; video utama terlalu besar, jadi dikirim lewat chat). Waktu ditulis WIB, mis. "9 Nov 15.25".
- `yt/<kode>`: judul & deskripsi untuk tombol Salin, dibuat `python3 episodes/_alat/yt_panel.py <folder>` dari `youtube.md` + `short/youtube.md`.

## Topik yang pernah diusulkan dan belum dibuat
1. "Bagaimana TikTok Tahu Apa yang Kamu Suka?" (algoritma rekomendasi/FYP)
2. "Ke Mana Perginya Pertanyaanmu ke AI?" (pusat data, listrik, air; bisa pakai ulang aset 3D D02)
3. "Apakah HP-mu Menguping?" (mitos iklan vs pelacakan data)
4. "Kenapa Data Kita Bocor Terus?" (kebocoran data)
Bu Dewi bisa memilih topik lain (D04 adalah pilihan beliau sendiri).
