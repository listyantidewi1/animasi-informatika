# D8.6 — Proyek: Cek Data, Cek Fakta (16 JP)

Elemen BK dan LD, proyek akhir kelas VIII: klaim diubah menjadi pertanyaan yang bisa dihitung, rencana pengumpulan data (apa, siapa, kapan, berapa lama), pencatatan yang jujur, pengolahan di lembar kerja (AVERAGE, MAX, grafik batang dan garis), tiga kesimpulan yang boleh (benar, tidak terbukti, belum cukup data), penyajian lima slide dan balasan sopan di grup. Konteks: klaim "kelas 8 lebih sering telat" dengan data rekaan 10 hari. Memakai ulang D8.1, D8.4, D8.5. Dua bagian video: **D8.6a** (klaim dan data) dan **D8.6b** (mengolah, menyimpulkan, menyajikan).

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `cek.js`, `scenes.js`.
- `cek.js` — kartu klaim, kartu langkah, lembar data, bilah rumus, grafik batang dan garis dengan penanda hari hujan, kartu kesimpulan.
- `page.html` — pemutar, 4 cek pemahaman, tiga alat proyek yang isiannya tersimpan di perangkat (perencana proyek dengan pemeriksaan pertanyaan yang bisa dihitung; lembar data contoh yang menghitung rata-rata, maksimum, dan grafik sendiri; latihan menyimpulkan 6 kasus). Kunci `d86-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
