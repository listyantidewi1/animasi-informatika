# F11.3 — Algoritma Standar dalam Kode dan Kualitas Program (16 JP)

Unit Algoritma dan Pemrograman Fase F (kelas XI): pencarian linear dan biner serta bubble dan selection sort ditulis sebagai fungsi Python (diterjemahkan dari pseudocode E.6), diuji dengan kasus batas (kosong, satu elemen, di awal, di akhir, tidak ada), di-debug lewat bug selisih satu dan cara membaca traceback dari bawah, dirapikan (nama snake_case bermakna, komentar "mengapa", satu fungsi satu tugas), lalu dibandingkan efisiensinya dengan menghitung operasi: n lawan log n untuk pencarian, n² lawan n log n untuk pengurutan (bubble 499.500 lawan sorted() ≈ 10.000 pada 1.000 data). Dua bagian video: **F11.3a** (pencarian dan pengurutan dalam Python) dan **F11.3b** (uji, debug, keterbacaan, efisiensi). Gaya diagram Fase F.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D8.2/kartu.js`, `../E.6/urut.js`, `../E.7/kode.js`, `../F11.0/py.js`, `../F11.1/alur_dev.js`, `kualitas.js`, `scenes.js`.
- `kualitas.js` — turus perbandingan, batang jumlah operasi, penelusuran biner versi Python (`//`), penanda kiri/kanan/tengah, kartu traceback.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan: balapan algoritma (pencarian/pengurutan × 8–10.000 data, perbandingan dihitung sungguhan sampai 1.000 data, rumus untuk 10.000; tiga pertanyaan), pemburu bug batas (tiga fungsi dengan bug selisih satu: ketuk baris, pilih perbaikan), perapi kode (enam pilihan nama/komentar/pembagian fungsi). Kunci `f113-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
