# F11.7 — Model Jaringan dan Pengiriman Data (16 JP)

Unit Berpikir Komputasional Fase F (kelas XI): topologi (bus, bintang, mesh; jaringan sekolah sebagai pohon dari lab-lab bintang, dampak kabel putus), model klien–server (web, email, gim daring; server padam = semua klien terhenti) dan peer-to-peer (semua setara; tahan tetapi sulit dikendalikan), empat lapisan TCP/IP (aplikasi, transport, internet, tautan) dengan enkapsulasi header port/IP/MAC yang dibungkus turun dan dibuka naik, perjalanan paket di jaringan lokal (MAC, IP lokal, port) dan ke internet (NAT, lompatan router, TCP mengirim ulang paket hilang; ping, traceroute), ditutup praktik ping dan server web kecil Python di satu Wi-Fi beserta aturan mainnya. Dua bagian video: **F11.7a** (topologi dan model jaringan) dan **F11.7b** (lapisan TCP/IP dan perjalanan paket). Gaya diagram Fase F.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D9.2/jaringan.js`, `lapisan.js`, `scenes.js`.
- `lapisan.js` — tumpukan empat lapisan, paket berheader, amplop berlapis, topologi bus/bintang/mesh/pohon dengan kabel putus dan pencarian keterhubungan, jalur lompatan paket.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan: pembungkus paket (bungkus turun, buka naik, empat pertanyaan header), penghubung topologi (SVG interaktif: pilih topologi, ketuk kabel untuk memutus, lihat siapa terputus; empat pertanyaan), pelacak lompatan (urutkan tujuh lompatan HP → server; tiga pertanyaan). Kunci `f117-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
