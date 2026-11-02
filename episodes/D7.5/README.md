# D7.5 — Instruksi untuk Manusia dan Mesin (12 JP)

Episode contoh yang sudah selesai: dua bagian video (D7.5a, D7.5b), masing-masing versi teks dan versi suara, plus halaman latihan `episode-d75.html` dengan latihan robot Kiko (Tebak, Perbaiki, Buat 1–3).

Alat produksi ada di `episodes/_alat/` (lihat README di sana). Berkas khusus episode ini:
- `script.json` — naskah (45 beat, 8 segmen, 3 kuis); `engine` memuat `kiko-core.js`, `kiko-grid.js`, `scenes.js`.
- `scenes.js` — adegan kantin, papan robot, tebak–jalankan–perbaiki, simbol → kata.
- `page.html` — halaman latihan dengan latihan robot Kiko (memakai `Kiko.worlds`, `Kiko.programs`).
- `suara_in/suara/*.mp3` — narasi mentah dari edge-tts; `timeline.json`, `narasi.mp3` hasil `voice.py 1.18`; `timeline-teks.json` hasil `timing.py`.
- `tts-kit/` — paket pembuat suara (`buat_suara.py`, `naskah.json`, `naskah-tts.txt/.csv`).

Perintah: `python3 episodes/_alat/render.py D7.5` (video), `python3 episodes/_alat/build.py D7.5` (halaman).
