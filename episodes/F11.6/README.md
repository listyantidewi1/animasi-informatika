# F11.6 — Strategi Algoritmik dan Alternatif Solusi (26 JP)

Unit Berpikir Komputasional dan Algoritma Pemrograman Fase F (kelas XI): empat strategi algoritmik dibandingkan lewat uang kembalian dan tebak angka. Brute force (semua kombinasi; pasti benar, ledakan kemungkinan: 10³, 10⁴, 10!), greedy (ambil terbesar dulu; optimal untuk pecahan rupiah, gagal untuk koin 1-3-4 pada 6: 4+1+1 lawan 3+3), divide and conquer (tebak angka 100 → 7 tebakan; merge sort bagi–urutkan–gabungkan, n log n), rekursi (jumlah daftar dengan kasus dasar dan kasus rekursif, tumpukan bingkai, RecursionError tanpa kasus dasar), lalu tabel justifikasi benar/cepat/mudah dan alternatif solusi penjadwalan aula (greedy selesai-paling-awal lawan brute force). Dua bagian video: **F11.6a** (brute force dan greedy) dan **F11.6b** (divide and conquer, rekursi, justifikasi). Gaya diagram Fase F.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D8.2/kartu.js`, `../E.6/urut.js`, `../F11.0/py.js`, `strategi.js`, `scenes.js`.
- `strategi.js` — koin, daftar kombinasi, garis bilangan tebak angka, pohon merge sort, tumpukan bingkai rekursi, tabel justifikasi.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan: mesin kembalian (tiga set koin × jumlah; greedy lawan optimal dihitung dengan pemrograman dinamis; tiga pertanyaan), tebak angka (cara urut lawan cara tengah dengan penghitung; dua pertanyaan), pelacak rekursi (jumlah daftar dan faktorial: bingkai dibuka dan ditutup langkah demi langkah). Kunci `f116-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
