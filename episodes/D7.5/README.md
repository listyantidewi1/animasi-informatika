# D7.5 — Instruksi untuk Manusia dan Mesin (12 JP)

Episode contoh yang sudah selesai: dua bagian video (D7.5a, D7.5b), masing-masing versi teks dan versi suara, plus halaman latihan `episode-d75.html` dengan latihan robot Kiko (Tebak, Perbaiki, Buat 1–3).

Alat produksi ada di `episodes/_alat/` (lihat README di sana). Berkas khusus episode ini:
- `script.json` — naskah (47 beat, 8 segmen, 4 kuis); `engine` memuat `kiko-core.js`, `kiko-grid.js`, `scenes.js`.
- `scenes.js` — adegan kantin, papan robot, tebak–jalankan–perbaiki, simbol → kata.
- `page.html` — halaman latihan dengan latihan robot Kiko (memakai `Kiko.worlds`, `Kiko.programs`).
- `suara_in/suara/*.mp3` — narasi mentah dari ElevenLabs (Kak Ceria, Eleven v4; sebelumnya GadisNeural, masih ada di riwayat git); `timeline.json`, `narasi.mp3` hasil `voice.py` (nada 1.0 dari `tts-kit/suara.json`); `timeline-teks.json` hasil `timing.py`.
- `tts-kit/` — `suara.json` (pengaturan ElevenLabs), `buat_suara.py` (cadangan edge-tts), `naskah.json`, `naskah-tts.txt/.csv`.

Perintah: `python3 episodes/_alat/render.py D7.5` (video), `python3 episodes/_alat/build.py D7.5` (halaman).
