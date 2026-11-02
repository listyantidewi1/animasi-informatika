# E.2 — Peran Sistem Operasi (4 JP)

Elemen BK, prioritas P1. Sistem operasi sebagai pengatur antara aplikasi dan perangkat keras, dengan empat tugas: proses (irisan waktu, giliran berputar, prioritas, pengelola tugas), memori (wilayah per proses, peta, RAM penuh dan pemindahan ke penyimpanan), berkas (nama dan folder yang terlihat, blok penyimpanan yang dicatat, izin berkas dan izin aplikasi), perangkat (driver sebagai penerjemah, antrean cetak, interupsi). Dua bagian video: **E.2a** (proses dan memori) dan **E.2b** (berkas dan perangkat). Prasyarat: E.1.

Berkas khusus episode ini:
- `script.json` — 23 beat, 7 segmen, 3 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D7.2/komputer.js` (printer), `../D7.6/struktur.js` (pohon folder), `os.js`, `scenes.js`.
- `os.js` — kartu proses, prosesor dengan bilah irisan waktu, peta memori berblok, blok penyimpanan, jendela pengelola tugas, steker driver.
- `page.html` — pemutar, 3 cek pemahaman, tiga latihan (simulasi giliran berputar lalu tiga pertanyaan; peta memori 10 blok tanpa tumpang tindih; pasangkan delapan kejadian dengan tugas sistem operasi). Kunci `e2-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 23 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
