# E.3 — Keamanan Akun dan Jaringan Dasar (6 JP)

Elemen LD, prioritas P2. Bahaya satu sandi untuk banyak akun (isian kredensial), password manager dengan sandi induk, verifikasi dua langkah (tahu + punya + melekat; alur kode enam angka), kode OTP tidak pernah dibagikan, pengaturan privasi dan pemulihan akun, sesi aktif, dua sandi router (Wi-Fi dan admin), WPA2/WPA3, jaringan tamu, firmware, Wi-Fi publik, daftar periksa enam langkah. Dua bagian video: **E.3a** (password manager dan verifikasi dua langkah) dan **E.3b** (privasi akun dan jaringan rumah). Prasyarat: D7.3, D9.2. Semua akun, sandi, dan kode fiktif.

Berkas khusus episode ini:
- `script.json` — 28 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D7.3/sandi.js`, `../D9.2/jaringan.js`, `../D7.7/empati.js`, `akun.js`, `scenes.js`.
- `akun.js` — kartu akun, brankas kata sandi, formulir masuk dua langkah, layar autentikator, daftar sesi aktif, panel pengaturan router, stiker router.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan (simulasi verifikasi dua langkah empat babak termasuk penolakan OTP dan percobaan penipu; audit akun fiktif delapan pengaturan; atur router fiktif sampai semua lampu hijau). Kunci `e3-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 28 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
