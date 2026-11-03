# F11.9 — Merancang Kebutuhan Sistem Komputer (8 JP)

Unit Literasi Digital Fase F (kelas XI): merancang spesifikasi komputer dari kebutuhan pengguna, bukan dari iklan. Alur lima langkah: profil pengguna dan beban kerja (tiga profil fiktif: Bu Rina guru, Dito tim video, Lab XI), menerjemahkan beban ke komponen (RAM untuk banyak aplikasi, prosesor dan kartu grafis untuk video, SSD agar terasa cepat, jaringan andal untuk lab), membaca spesifikasi dengan satuannya (GB RAM ≠ GB penyimpanan, GHz bukan segalanya), kebutuhan minimum lawan yang dianjurkan dan ruang untuk 3–5 tahun, anggaran lima tahun (lisensi, garansi, listrik, perawatan, pelatihan, cadangan 10%) dan penukaran beralasan, rekomendasi satu halaman dengan alternatif, serta jebakan umum. Semua merek dan harga fiktif. Dua bagian video: **F11.9a** (dari pengguna ke kebutuhan) dan **F11.9b** (komponen, anggaran, rekomendasi). Gaya diagram Fase F.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D7.2/komputer.js`, `spek.js`, `scenes.js`.
- `spek.js` — kartu profil pengguna, kartu komponen bergambar, lembar spesifikasi, brosur iklan fiktif, batang anggaran bertumpuk, lencana peringatan.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan: konfigurator (tiga profil × pilihan prosesor, RAM, penyimpanan, kartu grafis; peringatan beban kerja dan dana, harus bersih sebelum dikirim), pembaca spesifikasi (6 soal), penyusun anggaran lima tahun (centang biaya wajib, tolak yang tidak perlu). Kunci `f119-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
