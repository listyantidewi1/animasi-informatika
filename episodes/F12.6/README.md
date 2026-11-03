# F12.6 — Kreasi Konten Digital dengan Metode Bervariasi (8 JP)

Unit kelas XII (elemen LD): memperkenalkan produk proyek akhir lewat satu pesan inti dalam tiga format, dengan contoh aplikasi fiktif Setor Sampah milik Bank Sampah SMA Tunas. Isi: pesan inti satu kalimat (pendek, jelas manfaatnya, ada ajakan) dan audiens (murid, guru, orang tua; di mana mereka melihat), infografik (hierarki visual, tiga poin, satu angka, ajakan, tes lima detik; versi padat lawan rapi), video pendek 30–60 detik (kait tiga detik, papan cerita lima panel, suara jelas, teks di layar, musik berlisensi), halaman web dengan HTML (h1, p, img dengan alt text, a), etika (aset berlisensi, izin wajah, klaim jujur), dan uji ke audiens. Kegiatan tanpa komputer: satu pesan, tiga cara (poster, drama, selebaran). Dua bagian video: **F12.6a** (pesan inti dan infografik) dan **F12.6b** (video pendek, halaman web, dan etika). Gaya diagram Fase F.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../F11.0/py.js`, `konten.js`, `scenes.js`.
- `konten.js` — infografik versi rapi dan padat, panel papan cerita, halaman web di layar HP (dengan alt text saat gambar gagal dimuat), botol plastik.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan: pemilih format (enam situasi), penyusun papan cerita (ketuk lima panel sesuai urutan), pemeriksa halaman web (alt text, teks link, judul h1, klaim jujur). Kunci `f126-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman); video dua versi dalam antrean render.
