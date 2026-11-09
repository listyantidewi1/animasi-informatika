# Animasi Informatika (Fase D–F)

Seri bahan ajar animasi untuk mata pelajaran Informatika SMP–SMA mengikuti CP 2025 (Keputusan Kepala BSKAP 046/H/KR/2025). Setiap episode dibuat dari satu mesin animasi yang menghasilkan video YouTube (MP4 1080p, versi teks dan versi teks + suara) dan halaman latihan interaktif.

Peta kurikulum, alur belajar, dan daftar 52 episode ada di dokumen "Kurikulum Seri Animasi Informatika (Fase D–F)".

## Latihan interaktif (link untuk murid)
Situs latihan: **https://belajar-informatika.vercel.app/** (Vercel, terhubung ke repositori ini; setiap push ke `main` otomatis diterbitkan). Halaman depan `index.html` berisi semua episode per kelas, dibuat `episodes/_alat/indeks.py`. Tiap episode punya link pendek `https://belajar-informatika.vercel.app/<kode-tanpa-titik>`, misalnya `/d70` atau `/f1110`, yang diarahkan ke `episodes/<kode>/episode-<kode>.html` lewat `vercel.json` (juga dibuat `indeks.py`). Link yang sama, beserta alat luar untuk latihan di komputer (Python/Google Colab, Google Sheets/LibreOffice Calc, Portal Satu Data Indonesia; daftar di `episodes/_alat/alat_luar.json`), tercantum di deskripsi dan komentar tersemat `youtube.md` tiap episode. `.vercelignore` menyisihkan bahan produksi (suara per beat, tts-kit, preview) dari situs.

## Struktur
- `episodes/_alat/` — mesin gambar bersama (`kiko-core.js`, `kiko-grid.js`), inti halaman (`page-core.*`), dan alat produksi (`timing.py`, `voice.py`, `preview.py`, `render.py`, `build.py`, `naskah_tts.py`). Alur produksi lengkap ada di `episodes/_alat/README.md`.
- `episodes/<kode>/` — satu folder per episode: naskah (`script.json`), adegan (`scenes.js`), halaman (`page.html`), paket suara (`tts-kit/`), narasi (`suara_in/`, `narasi.mp3`), timeline, dan halaman jadi `episode-<kode>.html`.

## Keputusan produksi
- Video dipecah menjadi bagian 3–5 menit; teks narasi selalu tampil di layar; tiap animasi punya versi teks saja dan versi teks + suara.
- Narasi: ElevenLabs, suara "Kak Ceria – Cute Kids Storyteller" (model Eleven v4), dibuat otomatis per beat oleh `episodes/_alat/suara_elevenlabs.py`; cadangan edge-tts id-ID-GadisNeural (nada +18%).
- Tanpa musik latar.
- Fase D memakai tokoh orisinal (robot Kiko, murid Dito dan Sinta); Fase E–F memakai gaya diagram.
- Asumsi murid: pemahaman dasar sangat rendah; tiap kelas dibuka unit jembatan.
- Istilah yang akrab bagi murid dalam bahasa Inggris (mouse, keyboard, file, …) ditulis dalam bahasa aslinya, terjemahan Indonesia dalam kurung pada penyebutan pertama.

## Status
Semua 52 episode sudah final setelah revisi istilah dan tata letak (render ulang selesai 4 Nov 2026), dan 52 YouTube Short (`<kode>/short/`, vertikal, versi suara + teks) selesai 3 Nov 2026.

**Video simulasi** (`episodes/sim/`, panduan `episodes/_alat/SIMULASI.md`, daftar `episodes/sim/daftar.json`): 58 dari 58 selesai per 5 Nov 2026, masing-masing hanya versi bersuara, dengan satu Short, halaman pemutar `simulasi-<kode>.html`, dan tombol "Video simulasi" di halaman latihan episode pemakainya. K11 dibuat ulang sebagai versi pertahanan ("Melindungi HP dari Aplikasi Berbahaya", keputusan Bu Dewi 5 Nov 2026).

**Dokumenter** (`episodes/dok/`, untuk penonton umum, gaya dokumenter ilustrasi): D01 "Apakah AI Benar-benar Berpikir?" selesai 7 Nov 2026 (10:36, narator Bian dari ElevenLabs, musik latar dibuat dengan kode oleh `episodes/_alat/musik_dok.py`, mesin kamera dan cahaya di `episodes/dok/D01/sinema.js`). Bahan unggah ada di `episodes/dok/D01/youtube.md` dan `thumbnail.jpg`. Urutan render: `voice.py` → `musik_dok.py` → `render.py --suara`. D02 "Kenapa Harga HP Naik? Karena AI Sedang Memakan RAM Dunia" selesai 8 Nov 2026 (10:07, adegan 3D three.js di `episodes/dok/D02/g3d.js` + 2D di `scenes.js`, efek suara dari `Kiko.sfx` lewat `sfx_dok.py`). Urutan D02: `voice.py` → `sfx_dok.py` → `musik_dok.py` → `render.py --suara --seg=…` (paralel) → `render.py --suara --lanjut`. D03 "Suara Ibumu Bisa Dipalsukan dalam 3 Detik" selesai 9 Nov 2026 (9:17) dengan pipeline dokumenter v2 dari audit D02 (`episodes/dok/audit_D02.md`): mesin `episodes/_alat/sinema_dok.js`, perangkat gambar `episodes/_alat/dokkit/` (tokoh, latar, peta, layar HP, Bip; API di `dokkit/API.md`), waktu kata `align_dok.py`, suara tokoh per beat (`peran` di tts-kit), pemeriksa `cek_dok.py`, master −14 LUFS. Urutan D03: `suara_elevenlabs.py` → `align_dok.py` → `voice.py` → (adegan bab<n>.js + `preview.py`/`cek_dok.py`) → `sfx_dok.py` → `musik_dok.py` → `render.py --suara --seg=…` → `render.py --suara --lanjut`.

**Seri TikTok** (`episodes/tiktok/`, panduan `episodes/tiktok/PANDUAN.md`): 45 video T01–T45 (vertikal, ±45 detik, maskot Bip, ajakan subscribe ke youtube.com/@iteachswe), terlepas dari kurikulum; dirender `episodes/_alat/render_tiktok.py`.

| Episode | Naskah | Suara | Video | Halaman |
| --- | --- | --- | --- | --- |
| D7.0 Jembatan: Cara Memakai Komputer dan HP | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D7.1 Empat Jurus Berpikir Komputasional | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D7.2 Mengenal Komputer: Perjalanan Satu Ketukan | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D7.3 Kata Sandi Aman dan Rekam Jejak Digital | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D7.4 Mesin Pencari: Cara Kerja dan Strategi | ✓ | ✓ Kak Ceria | ✓ (1 bagian × 2 versi) | ✓ |
| D7.6 Data Terstruktur di Sekitar Kita | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D7.7 Ruang Publik Virtual dan Empati | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D7.8 Proyek: Panduan Digital untuk Adik Kelas | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D8.0 Jembatan Kelas VIII: Empat Jurus dan Instruksi | ✓ | ✓ Kak Ceria | ✓ (1 bagian × 2 versi) | ✓ |
| D8.1 Lembar Kerja Pengolah Data | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D8.2 Memecahkan Persoalan dengan Data Kecil | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D8.3 Flowchart dan Pseudocode Dasar | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D8.4 Menilai Informasi dan Ekosistem Pers Digital | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D8.5 Fakta, Opini, dan Hoaks | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D8.6 Proyek: Cek Data, Cek Fakta | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D9.0 Jembatan Kelas IX: Flowchart, Pseudocode, dan Tabel | ✓ | ✓ Kak Ceria | ✓ (1 bagian × 2 versi) | ✓ |
| D9.1 Pseudocode Lengkap: Perulangan dan Data | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D9.2 Jaringan Lokal dan Internet | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D9.3 Melindungi Perangkat dari Malware | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D9.4 Data Pribadi, Identitas Digital, dan Kesadaran Penuh | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D9.5 Produksi dan Diseminasi Konten Digital | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D9.6 Proyek Akhir Fase D | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| E.0 Jembatan ke Kelas X: Empat Bekal dari SMP | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| E.1 Komputer Von Neumann: Simulasi Input–Proses–Output | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| E.2 Peran Sistem Operasi | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| E.3 Keamanan Akun dan Jaringan Dasar | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| E.4 Mencari, Memeriksa, Membaca Lateral | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| E.5 Struktur Data Standar | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| E.6 Algoritma Standar: Pencarian dan Pengurutan | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| E.7 Pseudocode Dekat Bahasa Komputer | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| E.8 Data Berkualitas dari Komputasi Manusia | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| E.9 Proyek: Digitalisasi Budaya Lokal | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F11.0 Jembatan Menuju Pemrograman | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F11.1 Alur Pengembangan Program dan Produk Digital | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F11.2 Dari Pseudocode ke Kode | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F11.3 Algoritma Standar dalam Kode dan Kualitas Program | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F11.4 Riset Digital dan Verifikasi Konten | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F11.5 Data Terbuka untuk Keputusan | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F11.6 Strategi Algoritmik dan Alternatif Solusi | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F11.7 Model Jaringan dan Pengiriman Data | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F11.8 Troubleshooting dan Keamanan Lanjut Jaringan | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F11.9 Merancang Kebutuhan Sistem Komputer | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F11.10 Proyek: Aplikasi Berbasis Data Terbuka | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F12.0 Jembatan Kelas XII: Perulangan, List, dan Fungsi | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F12.1 Struktur Data Kompleks dan Abstrak | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F12.2 Memilih Solusi Optimal | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F12.3 Analisis Data untuk Prediksi | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F12.4 Hukum Digital dan Demokrasi Digital | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F12.5 Transaksi Digital yang Aman | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F12.6 Kreasi Konten Digital dengan Metode Bervariasi | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| F12.7 Proyek Akhir Fase F | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D7.5 Instruksi untuk Manusia dan Mesin | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
