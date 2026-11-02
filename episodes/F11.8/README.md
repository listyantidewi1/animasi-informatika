# F11.8 — Troubleshooting dan Keamanan Lanjut Jaringan (16 JP)

Unit Berpikir Komputasional dan Literasi Digital Fase F (kelas XI): koneksi sebagai rantai (perangkat, kabel/Wi-Fi, IP, router, internet, DNS, server), diagnosis bertahap dari bawah ke atas (lampu/sinyal, ipconfig dan alamat 169.254, ping router, ping alamat internet, nslookup, aplikasi), memilih uji yang membelah dua tersangka, empat alat detektif (ping, ipconfig/ifconfig, traceroute, nslookup); lalu keamanan lanjut: firewall sebagai satpam dengan aturan izinkan/tolak per port yang dibaca dari atas, enkripsi di jalur (HTTPS/TLS, WPA2/WPA3; penyadap hanya melihat acak, tujuan tetap terlihat), VPN sebagai terowongan (bukan jubah gaib), daftar periksa router sekolah, dan log sebagai buku tamu. Semua alamat dan skenario fiktif. Dua bagian video: **F11.8a** (detektif jaringan) dan **F11.8b** (firewall, enkripsi, VPN). Gaya diagram Fase F.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D9.2/jaringan.js`, `../F11.7/lapisan.js`, `detektif.js`, `scenes.js`.
- `detektif.js` — rantai koneksi berstatus uji, terminal perintah, tabel aturan firewall dengan paket yang dicocokkan, kartu paket, gembok, terowongan VPN, mata penyadap, daftar periksa, baris log.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan: detektif jaringan (lima kasus; pilih uji, baca hasil terminal, tebak mata rantai; ≤3 uji dianggap efisien), penjaga firewall (lima aturan, tujuh paket: izinkan/tolak), audit router (enam temuan → tindakan). Kunci `f118-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
