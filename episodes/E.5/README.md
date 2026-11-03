# E.5 — Struktur Data Standar (8 JP)

Elemen BK, prioritas P1. Array (indeks, akses langsung, penelusuran dengan perulangan, batas indeks, catatan indeks dari 0), record (siswa.nama, siswa.nilai; array berisi record = tabel), stack (push, pop, peek; LIFO; undo, kembali, kurung seimbang), queue (enqueue, dequeue; FIFO; cetak, pesan, tiket, giliran prosesor), tabel memilih wadah, contoh aplikasi klinik yang memakai keempatnya. Dua bagian video: **E.5a** (array dan record) dan **E.5b** (stack dan queue). Prasyarat: D7.6, D9.1.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D8.3/alur.js` (pseudocode), `../D9.1/memori.js`, `sd.js`, `scenes.js`.
- `sd.js` — array berindeks (dengan sel error), kartu record bertipe, stack vertikal dan queue horizontal dengan animasi masuk/keluar, kartu operasi.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan (simulator stack dan queue lalu tiga pertanyaan; tebak isi array dari empat program kecil; pilih wadah untuk delapan persoalan). Kunci `e5-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
