# E.6 — Algoritma Standar: Pencarian dan Pengurutan (10 JP)

Elemen BK, prioritas P1. Pencarian linear dan biner (tebak angka 1–100, larik 8 nilai, tabel pertumbuhan 8 / 1.000 / 1.000.000, pseudocode biner dengan pelacakan), tiga pengurutan pada lima kartu yang sama [48, 37, 25, 12, 56] dengan penghitung perbandingan dan pertukaran (bubble 10/6, selection 10/2, insertion 7 perbandingan/6 geseran), pseudocode bubble sort (perulangan bersarang), skala n×n/2 dan kurva n² vs n log n. Dua bagian video: **E.6a** (pencarian linear dan biner) dan **E.6b** (tiga cara mengurutkan). Prasyarat: D8.2, E.5.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D8.3/alur.js`, `../D8.2/kartu.js`, `urut.js`, `scenes.js`.
- `urut.js` — penelusur algoritma (`U.trace` bubble/selection/insertion, `U.linear`, `U.binary`) yang menghasilkan daftar langkah; penggambar kartu dengan sorotan, penghitung ganda, tabel perbandingan.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan (visualisator tiga algoritma × tiga bentuk data dengan Langkah dan penghitung; lomba tiga algoritma dengan tebakan; tebak langkah pencarian biner). Kunci `e6-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
