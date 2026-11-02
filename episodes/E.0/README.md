# E.0 — Jembatan ke Kelas X: Empat Bekal dari SMP (8 JP)

Unit jembatan Fase E (prasyarat). Memetakan kemampuan murid kelas X dari berbagai SMP lalu menguatkan empat bekal: empat jurus berpikir komputasional (D7.1), data terstruktur: tabel, antrean, tumpukan, hierarki (D7.6), pseudocode dasar dengan tabel pelacakan (D8.3, D9.1), dan keamanan akun dasar (D7.3). Ditutup peta kelas X dan cara belajar Fase E (gaya diagram, "buka tutup mesin"). Dua bagian video: **E.0a** (berpikir komputasional dan data terstruktur) dan **E.0b** (pseudocode, keamanan akun, peta kelas X). Kuis diagnostik ada di halaman web, bukan di video.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D7.6/struktur.js` (tabel, pohon), `../D8.3/alur.js` (pseudocode), `../D7.3/sandi.js` (kotak sandi, pengukur, gembok), `scenes.js` (gaya diagram, pembantu `box`).
- `page.html` — pemutar, 4 cek pemahaman, kuis diagnostik 12 soal (3 per bekal) → peta belajar (aman bila 2 dari 3) dengan rujukan episode SMP, pelacak mini tiga program (isi tabel pelacakan). Kunci `e0-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Catatan alat: mulai episode ini `kiko-core.js` menulis "Fase E" di kartu judul berdasarkan huruf pertama kode episode, dan `youtube.py` mengenal kelas 10–12.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
