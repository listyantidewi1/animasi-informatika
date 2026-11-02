# F11.5 — Data Terbuka untuk Keputusan (16 JP)

Unit Analisis Data Fase F (kelas XI): siklus analisis data enam langkah (pertanyaan, cari data, bersihkan, olah, gambarkan, putuskan) dijalani lewat satu kasus: bulan apa yang paling aman untuk kemah sekolah? Data terbuka dari portal fiktif (Kota Sukamaju) dengan tiga syarat: terbuka (CSV), terpercaya (lembaga pengukur, metadata), legal (lisensi); pembersihan (sel kosong, satuan berbeda, duplikat, −5, kode 999: tandai, jangan hapus diam-diam, catat), agregasi per bulan (COUNTIFS / groupby), pemilihan ukuran (rata-rata vs median vs hari hujan), grafik jujur (sumbu dari nol, label, sumber; contoh sumbu dipotong yang menyesatkan), keputusan dengan meter keyakinan, risiko, dan cadangan, lalu etika (lisensi, anonimisasi, data pribadi) dan batas data (korelasi bukan sebab, data lama, jarak stasiun). Dua bagian video: **F11.5a** (pertanyaan, sumber, pembersihan) dan **F11.5b** (olah, gambarkan, putuskan). Gaya diagram Fase F.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D8.1/lembar.js`, `../E.8/data.js`, `terbuka.js`, `scenes.js`.
- `terbuka.js` — alur enam langkah, kartu portal data terbuka fiktif, lencana syarat, catatan pembersihan, grafik batang bersumbu terpotong (contoh menyesatkan), petak hujan harian, meter keyakinan.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan: pembersih data (10 baris, 6 bermasalah: ketuk baris, pilih tindakan), ukuran dan grafik (6 soal), pembuat keputusan (3 grafik → rekomendasi dengan keyakinan). Kunci `f115-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
