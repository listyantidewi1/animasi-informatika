# E.8 — Data Berkualitas dari Komputasi Manusia (4 JP)

Elemen BK, prioritas P2. Komputasi manusia (mengisi formulir, melabeli, memeriksa) dan prinsip "sampah masuk, sampah keluar"; formulir yang jelas (satu arti, pilihan tetap, tipe per kolom, wajib), satu format per kolom, panduan label dengan definisi, contoh, dan kasus batas, dua pelabel dan ukuran kesepakatan, akibat label keliru (grafik dari 100 foto kucing), empat aturan validasi (rentang, wajib, tipe, unik), membersihkan tabel dengan empat temuan tanpa menebak, tiga peran dan log perubahan, etika data. Dua bagian video: **E.8a** (formulir dan label) dan **E.8b** (validasi, peran, dan etika). Prasyarat: D8.6, E.5.

Berkas khusus episode ini:
- `script.json` — 23 beat, 7 segmen, 3 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D8.6/cek.js` (grafik batang), `data.js`, `scenes.js`.
- `data.js` — formulir bertipe, sketsa buah/sayur, kartu gambar berlabel, pengukur kesepakatan, tabel dengan sel bertanda, kartu aturan validasi.
- `page.html` — pemutar, 3 cek pemahaman, tiga latihan (rancang formulir: tipe dan aturan enam kolom; labeli delapan gambar dengan panduan lalu bandingkan dengan pelabel lain; bersihkan tabel: temukan empat sel salah dan pilih tindakannya). Kunci `e8-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 23 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
