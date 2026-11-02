# Animasi Informatika — instruksi proyek untuk Claude Code

Bahasa kerja: Bahasa Indonesia. Pemilik: Bu Dewi (guru Informatika, penulis buku teks). Tujuan: seri 52 episode animasi untuk mapel Informatika SMP–SMA mengikuti CP 2025 (Keputusan Kepala BSKAP 046/H/KR/2025), tiap episode = video YouTube + halaman latihan interaktif.

## Sumber kebenaran
- Peta kurikulum (52 unit, JP, TP, ide animasi, prioritas produksi, matriks CP) ada di dokumen Claude "Kurikulum Seri Animasi Informatika (Fase D–F)". Ringkasannya untuk kelas VII semester 1: D7.0 Jembatan (6 JP), D7.1 Berpikir Komputasional di Sekitar Kita (10), D7.2 Mengenal Komputer (8), D7.3 Kata Sandi Aman dan Rekam Jejak Digital (6), D7.4 Mesin Pencari (4); semester 2: D7.5 Instruksi untuk Manusia dan Mesin (12, SUDAH JADI), D7.6 Data Terstruktur di Sekitar Kita (8), D7.7 Ruang Publik Virtual dan Empati (6), D7.8 Proyek Panduan Digital (8).
- Urutan produksi mengikuti kurikulum: D7.0 → D7.1 → D7.2 → D7.3 → D7.4 → D7.6 → D7.7 → D7.8 → kelas VIII, dst. Tanyakan ke Bu Dewi bila ingin melompat.
- Episode contoh yang sudah selesai: `episodes/D7.5/`. Baca `episodes/D7.5/README.md` sebelum membuat episode baru; tiru strukturnya.

## Keputusan yang sudah disepakati (jangan diubah tanpa bertanya)
- Asumsi murid: pemahaman dasar sangat rendah. Urutan belajar: konkret (kegiatan tanpa komputer) → gambar (animasi) → simbol. Pemrograman memakai pola PRIMM.
- Video 3–5 menit per bagian (episode panjang dipecah: D7.5a, D7.5b). Segmen 60–90 detik, satu konsep per episode, 2–3 soal cek pemahaman per episode dengan jeda "pikirkan dulu" lalu jawaban; di halaman web, jawaban salah memberi petunjuk, bukan kunci.
- Teks narasi selalu tampil besar di layar (dibakar ke video) dengan garis kemajuan baca; kecepatan baca acuan 1,6 kata/detik.
- Narasi suara: id-ID-GadisNeural lewat edge-tts (`episodes/D7.5/tts-kit/buat_suara.py`), nada dinaikkan 18% dengan rubberband di `voice.py` (`python3 voice.py 1.18`). Suara dibuat lokal, bukan oleh Claude. Tanpa musik latar.
- Gaya visual Fase D: tokoh orisinal (robot Kiko, murid Dito dan Sinta), latar kantin sekolah, palet di `engine.js` (objek C). Fase E–F: gaya diagram. Font Inter.
- Halaman latihan: satu berkas HTML, bisa dipakai luring dan di ponsel (lebar 400 px), kemajuan di localStorage, ada bagian "Untuk guru" dengan pembagian JP.
- Bahasa naskah: kalimat pendek, kata sehari-hari, konteks lokal (kantin, warung, angkot, grup kelas). Setiap episode menyebut episode prasyaratnya.
- Istilah: pakai bentuk yang paling akrab bagi murid. Istilah umum yang murid kenal dalam bahasa Inggris (mouse, keyboard, file, pointer, double click, drag, tap, swipe, pinch, scroll, zoom, save, search, download, login, touch screen, dan istilah populer lainnya; daftar ini contoh, bukan batas) tetap ditulis Inggris, boleh disertai terjemahan Indonesia dalam kurung pada penyebutan pertama: mouse (tetikus). Istilah populer yang bukan bahasa Inggris baku juga dipakai apa adanya (HP, lab komputer, galeri, menu). Istilah yang bentuk Indonesianya sudah umum (klik, klik kanan, spasi, kursor, folder, aplikasi, ikon) tetap Indonesia. Istilah konsep (algoritma, bug, pseudocode) dikenalkan lewat contoh dulu, baru namanya.

## Alur kerja per episode
1. Tulis `episodes/<kode>/script.json` (format sama dengan D7.5: beats dengan id, seg, scene, text, hold; segments; quizzes). Minta Bu Dewi membaca naskah sebelum lanjut.
2. Salin alat dari D7.5 (`engine.js`, `render.html`, `render.py`, `preview.py`, `page.html`, `build.py`, `timing.py`, `voice.py`, `tts-kit/`). Pisahkan helper umum bila sudah dipakai ≥2 episode. Tulis adegan baru di `SCENES`; cek frame dengan `preview.py` dan lihat gambarnya sendiri sebelum render penuh.
3. Tanpa suara: `python3 timing.py` → timeline. Dengan suara: minta Bu Dewi menjalankan `buat_suara.py` dengan naskah episode itu, taruh MP3 di `suara_in/suara/`, lalu `python3 voice.py 1.18`.
4. `python3 build.py` → halaman; `python3 render.py` → video + .srt di `video/` (abaikan di git). Satu render penuh per permintaan: periksa frame dulu, baru render.
5. Perbarui tabel status di `README.md`, commit dengan pesan Bahasa Indonesia.

## Hal teknis
- `render.py` merender 30 fps 1080p lewat Playwright + ffmpeg (libx264 veryfast crf 20), satu berkas per segmen lalu digabung `-c copy`; narasi dimasukkan tanpa render ulang video.
- Perubahan trek suara atau subtitel tidak perlu render ulang; perubahan gambar perlu.
- Jangan unduh musik atau gambar dari internet (risiko lisensi); semua aset digambar dengan kode.
