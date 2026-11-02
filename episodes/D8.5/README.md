# D8.5 — Fakta, Opini, dan Hoaks (10 JP)

Elemen LD: membedakan fakta (bisa dicek), opini (pendapat, boleh beda), dan hoaks (bohong yang menyamar fakta); lima ciri hoaks; pola penyebaran di jaringan pertemanan beranak tiga (1, 3, 9, 27, 81) dan perbandingan pilihan "bagikan" vs "periksa dulu"; tiga langkah memeriksa dan cara membalas dengan sopan. Semua pesan rekaan bertema sekolah. Dua bagian video: **D8.5a** (fakta, opini, hoaks, lima ciri) dan **D8.5b** (penyebaran dan cara memeriksa). Prasyarat: D8.4.

Berkas khusus episode ini:
- `script.json` — 28 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `hoaks.js`, `scenes.js`.
- `hoaks.js` — kartu kalimat berlabel, gelembung pesan, daftar lima ciri, pohon penyebaran dengan cabang yang berhenti, penghitung.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan (pilah 12 kalimat; centang ciri hoaks pada 3 pesan; simulasi penyebaran interaktif dengan titik "periksa dulu"). Kunci `d85-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 28 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
