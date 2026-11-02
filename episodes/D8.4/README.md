# D8.4 — Menilai Informasi dan Ekosistem Pers Digital (8 JP)

Elemen LD: perjalanan berita di media pers (peristiwa, wartawan, redaksi/verifikasi, layar), beda media pers dan akun perorangan (nama, redaksi, koreksi, Dewan Pers), lalu empat pertanyaan penilai informasi: siapa sumbernya, apa buktinya, kapan terjadi, apakah sumber lain sepakat; diterapkan pada portal berita vs akun gosip. Konteks: pohon tumbang di depan sekolah; semua nama media dan akun rekaan. Dua bagian video: **D8.4a** (dari peristiwa ke layar) dan **D8.4b** (empat pertanyaan). Prasyarat: D7.4.

Berkas khusus episode ini:
- `script.json` — 28 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `pers.js`, `scenes.js`.
- `pers.js` — kartu kabar (portal/akun/grup) dengan lencana, pohon tumbang, kamera, buku catatan, bilah perjalanan berita, daftar empat pertanyaan.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan (urutkan perjalanan berita termasuk koreksi; nilai empat kabar dengan empat pertanyaan Ya/Tidak; pers atau bukan). Kunci `d84-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 28 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
