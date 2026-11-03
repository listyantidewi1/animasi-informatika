# F11.2 — Dari Pseudocode ke Kode (28 JP)

Unit inti Algoritma dan Pemrograman Fase F (kelas XI): menerjemahkan notasi algoritma menjadi program Python terstruktur. Kamus pseudocode→Python dan pola PRIMM, lalu empat bahan: variabel dan tipe data (int, float, str, bool; jebakan input() yang selalu teks), percabangan if-elif-else dengan indentasi dan urutan kondisi, perulangan for dan while dengan pelacakan isi memori, serta fungsi dengan parameter, return, dan frame pemanggilan; ditutup program kas kelas utuh (15 baris) yang lahir dari pseudocode F11.1. Pseudocode dan Python selalu berdampingan dengan baris sepasang yang disorot. Dua bagian video: **F11.2a** (variabel, tipe data, percabangan) dan **F11.2b** (perulangan dan fungsi). Gaya diagram Fase F.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D9.1/memori.js`, `../E.7/kode.js`, `../F11.0/py.js`, `terjemah.js`, `scenes.js`.
- `terjemah.js` — kamus dua kolom, pseudocode–Python berdampingan dengan pasangan baris (`T.side`), kartu tipe data, sel memori bertipe, pemeriksaan cabang if/elif/else, kartu PRIMM.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan: penerjemah (10 baris pseudocode → pilih Python-nya), pelacak Python (4 program: for, elif, fungsi, while; Langkah, papan memori, catatan, pertanyaan), pemburu bug (6 program, ketuk baris salah lalu pilih perbaikan). Kunci `f112-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
