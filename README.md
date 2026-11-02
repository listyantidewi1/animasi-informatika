# Animasi Informatika (Fase D–F)

Seri bahan ajar animasi untuk mata pelajaran Informatika SMP–SMA mengikuti CP 2025 (Keputusan Kepala BSKAP 046/H/KR/2025). Setiap episode dibuat dari satu mesin animasi yang menghasilkan video YouTube (MP4 1080p) dan halaman latihan interaktif.

Peta kurikulum, alur belajar, dan daftar 52 episode ada di dokumen "Kurikulum Seri Animasi Informatika (Fase D–F)".

## Struktur
- `episodes/<kode>/` — satu folder per episode: naskah (`script.json`), mesin gambar (`engine.js`), alat render, halaman latihan, narasi.
- `episodes/D7.5/README.md` — alur produksi satu episode, dari naskah sampai video.

## Keputusan produksi
- Video dipecah menjadi bagian 3–5 menit; teks narasi selalu tampil di layar.
- Narasi: suara neural Microsoft id-ID-GadisNeural (dibuat lokal dengan edge-tts), nada dinaikkan 18%.
- Tanpa musik latar.
- Fase D memakai tokoh orisinal (robot Kiko, murid Dito dan Sinta); Fase E–F memakai gaya diagram.
- Asumsi murid: pemahaman dasar sangat rendah; tiap kelas dibuka unit jembatan.

## Status
| Episode | Naskah | Suara | Video | Halaman |
| --- | --- | --- | --- | --- |
| D7.0 Jembatan: Cara Memakai Komputer dan HP | draf (menunggu tinjauan) | – | – | – |
| D7.5 Instruksi untuk Manusia dan Mesin | ✓ | ✓ | ✓ (2 bagian) | ✓ |
