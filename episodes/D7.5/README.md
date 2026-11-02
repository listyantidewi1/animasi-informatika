# Seri Animasi Informatika — mesin episode (Kiko)

Satu mesin animasi menghasilkan dua keluaran per episode: video MP4 1080p untuk YouTube dan halaman latihan interaktif (HTML tunggal).

## Berkas
- `script.json` — naskah: daftar *beat* (id, segmen, adegan, teks narasi, jeda), kuis, nama segmen.
- `engine.js` — mesin gambar deterministik: `Kiko.draw(ctx, t, timeline)` menggambar frame pada detik `t`. Semua adegan ada di objek `SCENES`.
- `voice.py` — memproses narasi hasil `tts-kit/buat_suara.py` (naikkan nada, rapikan, normalisasi), menyusun `timeline.json` dan `audio/narration.wav`. Tanpa narasi, pakai `timing.py` (durasi dari waktu baca).
- `render.html` + `render.py` — merender video per segmen lewat Playwright + ffmpeg, menggabungkan, menambah narasi, menulis `.srt`. `python3 render.py D7.5a` untuk satu bagian saja.
- `page.html` + `build.py` — halaman latihan; `build.py` menyisipkan engine dan timeline menjadi `episode-d75.html`. Narasi web dimuat dari `narasi.mp3` di folder yang sama.
- `preview.py` — menggambar frame pada beat tertentu untuk dicek: `python3 preview.py s2b s4d`.
- `tts-kit/` — paket untuk membuat narasi suara neural di laptop (edge-tts, suara id-ID-GadisNeural).

## Urutan produksi satu episode
1. Tulis `script.json` (beat 60–90 detik per segmen, 2–3 soal cek pemahaman).
2. Tambah adegan baru di `engine.js` bila perlu; cek dengan `preview.py`.
3. Buat suara: salin `script.json` ke `tts-kit/naskah.json`, jalankan `buat_suara.py`, taruh hasilnya di `suara_in/suara/`.
4. `python3 voice.py 1.07` → timeline dan trek narasi.
5. `python3 build.py` → halaman; `python3 render.py` → video dan .srt di `video/`.

## Kebutuhan
Python 3 dengan `playwright` (Chromium), `numpy`; `ffmpeg` dengan filter `rubberband`; font Inter terpasang (dipakai di video).
