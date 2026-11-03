# E.4 — Mencari, Memeriksa, Membaca Lateral (6 JP)

Elemen LD, prioritas P2. Operator pencarian (tanda kutip, minus, site:, filter waktu) dan pencarian gambar terbalik; membaca vertikal vs lateral pada situs fiktif; tiga langkah membaca lateral (berhenti, tab baru, telusuri klaim); ekosistem periksa fakta; tanda bahaya (kutipan tanpa tautan, alamat tiruan, tanpa tanggal, tanpa penulis, desakan membagikan); menyaring konten negatif (kenali, jangan sebarkan, laporkan, blokir) dan mengatur umpan. Dua bagian video: **E.4a** (mencari lebih tajam) dan **E.4b** (membaca lateral dan periksa fakta). Prasyarat: D7.4, D8.4, D8.5. Semua situs dan klaim fiktif.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D7.4/pencari.js` (daftar hasil), `../D8.4/pers.js`, `../D8.5/hoaks.js`, `lateral.js`, `scenes.js`.
- `lateral.js` — jendela browser bertab, halaman situs fiktif, query beroperator, lencana tanda bahaya, kartu tindakan.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan (susun query dari potongan; simulasi membaca lateral dengan lima tab fiktif dan lima pertanyaan; pilah enam konten dan tindakannya). Kunci `e4-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
