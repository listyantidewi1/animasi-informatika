# Animasi Informatika (Fase D–F)

Seri bahan ajar animasi untuk mata pelajaran Informatika SMP–SMA mengikuti CP 2025 (Keputusan Kepala BSKAP 046/H/KR/2025). Setiap episode dibuat dari satu mesin animasi yang menghasilkan video YouTube (MP4 1080p, versi teks dan versi teks + suara) dan halaman latihan interaktif.

Peta kurikulum, alur belajar, dan daftar 52 episode ada di dokumen "Kurikulum Seri Animasi Informatika (Fase D–F)".

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
| Episode | Naskah | Suara | Video | Halaman |
| --- | --- | --- | --- | --- |
| D7.0 Jembatan: Cara Memakai Komputer dan HP | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
| D7.5 Instruksi untuk Manusia dan Mesin | ✓ | ✓ Kak Ceria | ✓ (2 bagian × 2 versi) | ✓ |
