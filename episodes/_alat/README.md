# Alat bersama: mesin Kiko dan alur produksi satu episode

Satu mesin animasi menghasilkan, untuk tiap episode, **video MP4 1080p** (dua versi: teks saja, dan teks + suara) dan **halaman latihan interaktif** (HTML tunggal). Semua alat di folder ini dipanggil dengan kode episode, dari akar repo:

```bash
python3 episodes/_alat/timing.py D7.0        # timeline versi teks (waktu baca 1,6 kata/detik) -> timeline-teks.json
python3 episodes/_alat/preview.py D7.0       # frame tiap beat -> preview/*.jpg  (atau: preview.py D7.0 s1b s4d=2.5)
python3 episodes/_alat/naskah_tts.py D7.0    # naskah per beat untuk TTS manual -> tts-kit/naskah-tts.txt, .csv, naskah.json
python3 episodes/_alat/suara_elevenlabs.py D7.0 --voice "Nama"   # narasi otomatis lewat API ElevenLabs -> suara_in/suara/<id>.mp3
python3 episodes/_alat/voice.py D7.0         # dari suara_in/suara/<id>.mp3: timeline.json, audio/narration.wav, narasi.mp3
python3 episodes/_alat/build.py D7.0         # halaman latihan -> episode-d70.html
python3 episodes/_alat/render.py D7.0        # video + .srt -> video/ (semua bagian, semua versi yang bahannya ada)
python3 episodes/_alat/render.py D7.0 D7.0a --suara --mux   # satu bagian, satu versi; --mux = pakai ulang segmen, hanya suara/subtitel
```

Dari dalam folder episode, kodenya boleh dihilangkan (`python3 ../_alat/render.py D7.0a`).

## Berkas di folder ini
- `kiko-core.js` — inti mesin gambar: palet (objek `C`), pembantu (teks, kartu, balon), tokoh (robot Kiko, murid), adegan umum (`title`, `quiz`, `quiz_answer`, `recap`, `outro`), dan `Kiko.draw(ctx, t, TL)` yang menggambar frame pada detik `t` beserta kartu teks narasi dan garis kemajuan baca.
- `kiko-grid.js` — papan robot (kotak, meja, bakso), simulasi MAJU/KIRI/KANAN/AMBIL, panel daftar perintah. Dipakai D7.5 dan episode pemrograman berikutnya.
- `page-core.css`, `page-core.js` — inti halaman latihan: pemutar kanvas + narasi, tombol suara nyala/mati (berpindah antara timeline suara dan teks), mode lambat, kuis dengan petunjuk, kemajuan di `localStorage` (`<kode>-progress`, mis. `d75-progress`). Dipakai lewat `PageCore({suara, teks})`.
- `render.html` — kanvas 1920×1080 yang dipakai `render.py`/`preview.py`.
- `episode.py` — pembantu bersama: menemukan folder episode, memuat naskah/timeline, menggabungkan mesin gambar sesuai kunci `engine` di `script.json`.

## Berkas di tiap folder episode
- `script.json` — naskah: `episode`, `title`, `engine` (daftar berkas JS mesin; bawaan `kiko-core.js` + `scenes.js`), `parts` (pembagian bagian a/b: segmen, kartu pembuka/penutup), `recap` (tiga kalimat ringkasan), `next` (episode berikutnya), `beats` (id, seg, scene, text, hold), `segments`, `quizzes`.
- `scenes.js` (+ berkas pembantu lain bila perlu, mis. `devices.js` di D7.0) — adegan episode: `Object.assign(Kiko.SCENES, {...})`. Tiap adegan `fn(ctx, b, l, t, TL)`: `b` beat, `l` detik sejak beat mulai.
- `page.html` — markup halaman: tajuk, pemutar, kuis, latihan khusus episode, "Untuk guru". Placeholder `__PAGE_CSS__`, `__ENGINE__`, `__PAGE_JS__`, `__TIMELINE__`, `__TIMELINE_TEKS__` diisi `build.py`.
- `tts-kit/` — paket untuk membuat narasi di laptop: `buat_suara.py` (edge-tts, suara id-ID-GadisNeural, peta pelafalan opsional `UCAP`), `naskah.json`, `naskah-tts.txt/.csv` (untuk TTS lain). Hasil suara disimpan sebagai `suara_in/suara/<id>.mp3` (boleh .wav/.m4a/.ogg).
- Hasil (tidak masuk git): `video/`, `audio/*.wav`, `preview/`, `*.built.html`.

## Urutan produksi satu episode
1. Tulis `script.json`; minta Bu Dewi membaca naskahnya.
2. Tulis adegan di `scenes.js`; `timing.py` lalu `preview.py`; lihat gambarnya sendiri sebelum render.
3. Suara, salah satu dari: (a) **ElevenLabs otomatis**: `suara_elevenlabs.py <kode> --voice "Nama"` (butuh `ELEVENLABS_API_KEY` di lingkungan; coba `--hanya intro1` dulu, `--uji` untuk menghitung kuota; pengaturan tersimpan di `tts-kit/suara.json`); (b) edge-tts di laptop: `tts-kit/buat_suara.py`; (c) TTS lain memakai `tts-kit/naskah-tts.txt`. Hasil di `suara_in/suara/<id>.mp3`, lalu `voice.py <kode>` (nada: ElevenLabs 1.0, GadisNeural 1.18).
4. `build.py` → halaman; `render.py` → video dua versi. Satu render penuh per permintaan.
5. Perbarui tabel status di `README.md` akar, commit dengan pesan Bahasa Indonesia.

## YouTube Shorts (vertikal 1080×1920)
Satu Short per episode di `<kode>/short/`: satu gagasan, 45–60 detik, pertanyaan kait yang terus tampil di atas, potongan adegan episode di tengah, teks narasi besar di bawah (di luar kolom tombol kanan dan keterangan bawah Shorts), lalu ajakan menonton episode lengkap + link latihan.
- `short/script.json`: `episode` (`<kode>-short`), `title`, `hook`, `judul_short`, `ringkas`, `youtube.tagar`, `segments`, `beats`. Kunci beat: `src` (beat asal di episode; animasinya dimampatkan ke durasi beat Short), `scene`, `crops` ([[x, y, w, h], ...] di kanvas 1920×1080, ditumpuk), `note` (catatan merah di bawah gambar, opsional), `text`, `hold` (0,3). Beat penutup memakai adegan `short_cta`.
- Alur: `timing.py <kode>/short` → `render_short.py <kode> --frame h1=5 ...` (pratinjau di `short/preview/`) → `suara_elevenlabs.py <kode>/short` (±250 kredit) → `voice.py <kode>/short` → `render_short.py <kode>` → `video/Short_<kode>_*_{suara,teks}.mp4`, `.srt`, dan `short/youtube.md` (judul, deskripsi, video terkait).
- `short.js` — penyusun frame vertikal (`Kiko.drawShort`), dimuat setelah mesin gambar episode induk.

## Kebutuhan
Python 3 dengan `playwright` (Chromium), `numpy`; `ffmpeg` dengan filter `rubberband`; font Inter terpasang (dipakai di video). Di laptop untuk suara: `edge-tts`.

## Dokumenter
Panduan lengkap di `episodes/dok/PANDUAN.md`. Alat khusus: `sinema_dok.js`, `dokkit/`, `align_dok.py`, `cek_dok.py`, `sfx_dok.py`, `musik_dok.py`, `short_dok.js`, `kit_preview.py`, `lembar_kontak.py` (lembar kontak per bab), `thumbnail_dok.py` (thumbnail), `yt_panel.py` (judul & deskripsi untuk halaman pelacak).
