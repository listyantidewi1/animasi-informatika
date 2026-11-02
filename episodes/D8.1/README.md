# D8.1 — Lembar Kerja Pengolah Data (8 JP)

Elemen BK dan LD: konsep sel (alamat huruf kolom + nomor baris), rumus yang dimulai dengan = dan "hidup" (ubah satu angka, sel yang bergantung ikut berubah, berantai seperti domino), fungsi SUM, AVERAGE, MAX, MIN, menyalin rumus ke samping, grafik batang (membandingkan) dan garis (perubahan), mengurutkan data menjadi keputusan. Dua bagian video: **D8.1a** (sel dan rumus) dan **D8.1b** (fungsi, grafik, mengolah). Tidak terikat merek aplikasi. Prasyarat: D7.6.

Berkas khusus episode ini:
- `script.json` — 29 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `lembar.js`, `scenes.js`.
- `lembar.js` — kisi lembar kerja (huruf kolom, nomor baris, sel aktif, sorotan, rumus), bilah rumus, panah ketergantungan, grafik batang dan garis, tabel kertas.
- `page.html` — pemutar, 4 cek pemahaman, lembar kerja mini yang menghitung sendiri (=A1+B1, SUM, AVERAGE, MAX, MIN) untuk tiga latihan: tebak sel yang ikut berubah, tulis rumusnya, pilih grafik. Kunci `d81-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 29 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
