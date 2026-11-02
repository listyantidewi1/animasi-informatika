# D8.2 — Memecahkan Persoalan dengan Data Kecil (10 JP)

Elemen BK: mencari (satu per satu vs belah dua pada data urut), mengurutkan dengan cara yang jelas (pilih terkecil; bandingkan tetangga) sambil menghitung langkah, mengelompokkan ke tumpukan, menyaring dengan syarat DAN/ATAU, lalu menggabungkan pekerjaan dengan urutan yang hemat langkah (saring dulu, baru urutkan). Konteks: 32 kartu nilai ulangan rekaan. Dua bagian video: **D8.2a** (mencari, mengurutkan) dan **D8.2b** (mengelompokkan, menyaring, menggabungkan). Prasyarat: D8.1.

Berkas khusus episode ini:
- `script.json` — 28 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `kartu.js`, `scenes.js`.
- `kartu.js` — kartu nilai (terbuka/tertutup/disorot/pudar), deretan kartu, penghitung langkah, tumpukan kelompok, kotak syarat, tabel saring; `scenes.js` menyimulasikan pencarian linear dan belah dua, selection sort (10 kali membandingkan, 4 kali memindahkan), satu putaran tukar tetangga, pengelompokan 32 kartu, filter lembar kerja.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan (cari 85 di kartu acak lalu urut dengan hitungan langkah; urutkan dengan mengetuk kartu terkecil; saring tabel dengan DAN/ATAU dan pertanyaan gabungan). Kunci `d82-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 28 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
