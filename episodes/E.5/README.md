# E.5 — Struktur Data Standar (8 JP)

Elemen BK, prioritas P1. Larik (indeks, akses langsung, penelusuran dengan perulangan, batas indeks, catatan indeks dari 0), rekaman (siswa.nama, siswa.nilai; larik berisi rekaman = tabel), tumpukan (push, pop, peek; LIFO; undo, kembali, kurung seimbang), antrean (enqueue, dequeue; FIFO; cetak, pesan, tiket, giliran prosesor), tabel memilih wadah, contoh aplikasi klinik yang memakai keempatnya. Dua bagian video: **E.5a** (larik dan rekaman) dan **E.5b** (tumpukan dan antrean). Prasyarat: D7.6, D9.1.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D8.3/alur.js` (pseudocode), `../D9.1/memori.js`, `sd.js`, `scenes.js`.
- `sd.js` — larik berindeks (dengan sel galat), kartu rekaman bertipe, tumpukan vertikal dan antrean horizontal dengan animasi masuk/keluar, kartu operasi.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan (simulator tumpukan dan antrean lalu tiga pertanyaan; tebak isi larik dari empat program kecil; pilih wadah untuk delapan persoalan). Kunci `e5-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
