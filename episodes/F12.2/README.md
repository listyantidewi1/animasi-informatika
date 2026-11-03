# F12.2 — Memilih Solusi Optimal (14 JP)

Unit kelas XII (prioritas P1): optimal berarti terbaik menurut satu ukuran (jarak, waktu, ongkos sebagai bobot graph); brute force yang meledak untuk data besar; greedy yang bisa tersesat (A–B–E 10 km lawan A–C–E 6 km); algoritma Dijkstra dengan tangan pada graph lima kota fiktif A–E (jarak sementara, kota pasti, catatan "datang dari" untuk menelusuri rute A–B–C–D–E 9 km; kuis jalan C–D ditutup menjadi 11 km); graph berbobot sebagai dictionary berisi dictionary dan `heapq` sebagai priority queue (NetworkX disebut sebagai library siap pakai); penjadwalan lab dengan greedy "selesai paling awal" yang terbukti optimal; dan cara memilih solusi. Kegiatan tanpa komputer: peta kota dari tali di lantai dan kartu jarak sementara. Dua bagian video: **F12.2a** (optimal, greedy, dan Dijkstra) dan **F12.2b** (rute, struktur, dan jadwal). Gaya diagram Fase F.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../F11.0/py.js`, `../F12.1/struktur.js`, `scenes.js`.
- `scenes.js` — adegan beserta langkah Dijkstra (status tiap langkah), tabel jarak, garis waktu jadwal.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan: Dijkstra langkah demi langkah (pilih kota yang dipastikan, perbarui jarak tiap tetangga, telusuri rute), penjadwal lab (dua jadwal; jumlah maksimum dihitung otomatis, semua susunan terbaik diterima), pembanding solusi (empat kasus). Bagian guru memuat program Dijkstra dengan `heapq` yang sudah diuji. Kunci `f122-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman); video dua versi dalam antrean render.
