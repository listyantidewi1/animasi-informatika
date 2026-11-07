# Panduan video TikTok konsep inti informatika

Proyek terpisah dari seri belajar: **jangan menyebut kelas, kurikulum, episode, atau kode seri** di naskah, gambar, maupun keterangan. Daftar judul: `daftar.json` (T01–T45). Contoh jadi: `T01/` (angka dan perbandingan), `T02/` (gambar piksel buatan kode, perbesaran), `T03/` (jaringan, animasi perjalanan). Tiru strukturnya.

## Format
- Vertikal 1080×1920, 30 fps, **hanya versi bersuara** (Kak Ceria, Eleven v4, pengaturan di `<kode>/tts-kit/suara.json`, salin dari T01).
- Durasi ±40–50 detik: **narasi total 450–600 karakter** (±0,55 kredit per karakter, kredit dipakai bersama). 6–7 beat, 50–135 karakter per beat.
- Tokoh **Bip** (makhluk bulat tosca berantena, mata besar) dan palet gelap pekat dengan aksen kuning, pink, tosca, biru (`TikTok.C` di `_alat/tiktok-core.js`). Font Inter. Semua gambar digambar dengan kode; tanpa gambar/musik unduhan, tanpa logo atau tampilan merek; nama, pesan, akun, dan data rekaan.
- Tata letak: kait sangat besar di beat pertama (tampil penuh < 0,5 detik); chip topik di atas (kunci `topik`); area gambar di tengah; kotak narasi di bawah (x 50–880, dasar y 1590) dengan garis kemajuan; tetap terbaca tanpa suara.
- Ruang aman TikTok: tidak ada teks penting di x > 900 pada y 900–1500 (tombol), di y > 1600 (keterangan), atau di y < 150. Gambar di bawah y 900 berpusat di x 480, lebar maksimum 820.
- Penutup selalu adegan `akhir`: kartu "youtube.com/@iTeachSWE" + tombol SUBSCRIBE yang diketuk, narasi persis: **"Mau belajar lebih banyak? Subscribe channel iTeachSWE di YouTube, ya!"** (69 karakter, MP3-nya sama untuk semua video tetapi tetap dibuat per video karena alat membuat per folder; hold 1,6).

## Aturan isi
- Beat pertama = kait: pertanyaan atau fakta mengejutkan dalam satu-dua kalimat lengkap. Satu konsep per video.
- Bahasa santai tetapi **kalimat lengkap** dengan tanda baca benar (TTS membaca intonasinya); kata sehari-hari; istilah sesuai `_alat/ISTILAH.md` (router, file, browser, error, dst.).
- Fakta harus benar; hitung angka dengan `python3` dan tulis kualifikasi bila perlu ("sekitar", "biasanya"). Angka di layar boleh digit; di narasi digit juga boleh (Kak Ceria membacanya), tetapi hindari singkatan yang ambigu.
- Gerakan baru tiap 2–3 detik: pakai isyarat kata (`cue`, `ph`, `pop` dengan kata dari teks beat) supaya gambar muncul tepat saat kata itu diucapkan.
- `em` di beat: kata/frasa yang diwarnai kuning di kotak narasi (dan di kait).

## Berkas per video (`episodes/tiktok/<kode>/`)
- `script.json`: `episode`, `title` (dari daftar.json), `hook` (teks kait besar), `topik` (chip, ≤ 30 huruf), `engine` `["../../_alat/tiktok-core.js", "scenes.js"]`, `caption` {`teks`: 1–2 kalimat, `tagar`: 4–6 tagar umum, mis. #belajarditiktok #informatika #teknologi}, `segments` {"1": "TikTok"}, `beats` [{`id`, `scene`, `text`, `hold` (0,2–0,8; akhir 1,6), `em`, kunci adegan}].
- `scenes.js`: `Object.assign(TikTok.SCENES, { nama(ctx, b, l, t, TL, A) {...} })`; pembantu di `TikTok.helpers`.
- `tts-kit/suara.json` (salin dari T01), `suara_in/suara/*.mp3` (dibuat alat; jangan dihapus, itu kredit), `caption.md` (dibuat render).
- Tidak ikut git (sudah di .gitignore): `video/`, `preview/`, `audio/*.wav`, `*.built.html`. `timeline-teks.json` hanya untuk pratinjau sebelum suara.

## Adegan bawaan (`tiktok-core.js`)
| adegan | kunci beat |
|---|---|
| `kait` | `big` (bawaan `hook`), `em`, `art` (nama adegan gambar di bawah teks; tanpa itu Bip terkejut), `maxLines` |
| `poin` | `head`, `items` [≤ 3–4], `icons` ["check"/"x"/nomor], `cues` [kata dari teks], `mood` |
| `banding` | `a`, `b` = {`label`, `value`, `note`, `tone`: bad/good/kuning}, `cueA`, `cueB` |
| `angka` | `label`, `num`, `count` (hitung naik), `cueNum`, `numSize`, `sub`, `cueSub`, `subEm`, `tone`, `mood` (null = tanpa Bip) |
| `bip` | `say`, `sayEm`, `mood` |
| `akhir` | `head`, `note` (null = tanpa catatan); alamat dari `channel` (bawaan youtube.com/@iTeachSWE) |

Semua beat: `cont: true` (tanpa peralihan masuk), `noChip: true` (tanpa chip topik).
Pembantu: `rr, font, text(opt.fit/shadow), wrap, para, richLine, richLines, emFlags, card(opt.glow/stroke), pill, arrow, check, cross, lock, bip(ctx, x, y, ukuran, {mood: happy|wow|think|sad, t, wave, look, bounce}), bubble, ease, clamp, lerp, back, rnd (acak tetap), fmt (1.000.000), cue/cueAt/ph/pop (isyarat: pecahan 0–1 atau kata dari teks beat)`. Area `A` = {x 60, y, w, h, cx 480, cy, bot}.

## Alur perintah (dari `episodes/_alat/`)
```
python3 timing.py tiktok/T04                       # timeline pratinjau tanpa suara
python3 cek_tiktok.py tiktok/T04                   # karakter, baris narasi, teks rusak, ruang aman, penutup
nice -n 10 python3 render_tiktok.py tiktok/T04 --kontak --teks [--zona]   # lembar kontak preview/kontak.jpg, lihat dengan Read
python3 suara_elevenlabs.py tiktok/T04 --uji       # hitung karakter (WAJIB sebelum membuat suara)
python3 suara_elevenlabs.py tiktok/T04             # hanya MP3 yang belum ada; jangan --ulang kecuali isi salah
python3 voice.py tiktok/T04                        # rapikan suara -> timeline.json, audio/narration.wav
nice -n 10 python3 render_tiktok.py tiktok/T04 --kontak   # merapatkan tempo otomatis, lalu lembar kontak bersuara
nice -n 10 python3 cek_tiktok.py tiktok/T04
nice -n 10 python3 render_tiktok.py tiktok/T04     # video/TikTok_<kode>_<judul>.mp4 + .srt + caption.md
ffmpeg -v error -i video/TikTok_T04_*.mp4 -vf "fps=1/4,scale=270:480,tile=6x2" -frames:v 1 preview/v.jpg   # periksa hasil
```
Pratinjau satu frame: `render_tiktok.py tiktok/T04 --frame k2=1.5 k3` (detik dalam beat; tanpa detik = akhir beat).
Tempo: voice.py memberi waktu baca pemula; `render_tiktok.py` merapatkan timeline secara otomatis (jeda 0,2 s, narasi + 0,25 s, lalu `hold`) dan menandainya `"rapat": true`. Bila voice.py dijalankan ulang, perapatan terjadi lagi saat render/pratinjau berikutnya.
Satu render pada satu waktu, selalu dengan `nice -n 10` (±10–20 menit per video saat mesin sibuk).

## Checklist sebelum selesai
- [ ] `cek_tiktok.py` OK (450–600 karakter, ≤ 4 baris narasi per beat, tanpa teks rusak, ruang aman bersih, penutup benar).
- [ ] Angka/fakta sudah dihitung atau diperiksa; ada kualifikasi bila perkiraan.
- [ ] Lembar kontak dilihat: kait terbaca di frame pertama, tidak ada tumpang tindih, ada gerakan di tiap beat.
- [ ] Video jadi diperiksa dengan ffmpeg (frame tiap 4 detik), durasi ±40–50 detik, suara ada.
- [ ] `caption.md` berisi 1–2 kalimat, 4–6 tagar, dan youtube.com/@iTeachSWE.
