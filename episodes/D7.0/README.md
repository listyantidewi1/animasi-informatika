# D7.0 — Jembatan: Cara Memakai Komputer dan HP (6 JP)

Unit jembatan kelas VII: asesmen diagnostik (cek diri + kuis bergambar) dan mengenal perangkat: mouse, keyboard, touch screen, file, folder, save & cari. Dua bagian video: **D7.0a** (cek diri, mouse, keyboard) dan **D7.0b** (touch screen, file, folder, save dan cari, giliranmu). Tidak ada episode prasyarat.

Berkas khusus episode ini:
- `script.json` — naskah (51 beat, 9 segmen, 4 kuis), `parts`, `recap`, `next`; `engine`: `kiko-core.js`, `devices.js`, `scenes.js`, `scenes-b.js`.
- `../_alat/kiko-devices.js` (dulu `devices.js` di sini) — pembantu gambar perangkat: monitor, mouse, pointer, keyboard, HP, jari, ikon file/folder, jendela, kotak teks, menu.
- `scenes.js` (bagian a + touch screen), `scenes-b.js` (file, folder, save, giliranmu).
- `page.html` — halaman latihan: pemutar, 4 cek pemahaman, kuis bergambar tiga bagian (Mouse, Keyboard, Folder) dengan "Peta belajarmu" (diagnostik: lancar / perlu diulang, tombol ke segmen video), "Untuk guru" (3 pertemuan × 2 JP).
- `tts-kit/` — `buat_suara.py` (edge-tts + peta pelafalan `UCAP`), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai. Naskah disetujui; 51 adegan diperiksa (`preview.py`); narasi Kak Ceria (ElevenLabs, Eleven v4) di `suara_in/suara/`; halaman `episode-d70.html` (suara + teks); video versi teks (D7.0a 5:24, D7.0b 5:55) dan versi suara (D7.0a 4:20, D7.0b 4:46).
