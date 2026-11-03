# F12.1 — Struktur Data Kompleks dan Abstrak (24 JP)

Unit inti kelas XII (prioritas P1): abstract data type (operasinya, bukan cara menyimpannya), memakai yang disediakan Python (list sebagai stack, `collections.deque` sebagai queue, dictionary sebagai hash map), linked list (node, penunjuk, head, None; sisip cepat, ambil lambat), fungsi hash dan collision (contoh rumus "banyak huruf % 5"), tree (root, child, leaf; folder di laptop), binary search tree (kecil ke kiri, besar ke kanan; mencari 60 dalam tiga langkah), dan graph sebagai dictionary berisi list (jalur angkot fiktif). Ditutup panduan memilih struktur dari kebutuhan. Kegiatan tanpa komputer: rantai kartu nama dan loker berdasarkan banyak huruf. Dua bagian video: **F12.1a** (ADT, library, dan linked list) dan **F12.1b** (hash map, tree, dan graph). Gaya diagram Fase F.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../F11.0/py.js`, `struktur.js`, `scenes.js`.
- `struktur.js` — node dan rantai linked list, stack tegak, queue mendatar, laci hash map, binary search tree dengan tata letak otomatis dan jalur pencarian, graph berbobot (dipakai ulang F12.2).
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan: binary search tree interaktif (root 50; sisipkan delapan nilai dengan mengetuk kiri/kanan, lalu cari 65 dan 25 sambil membandingkan jumlah langkah dengan linear search), pemilih struktur data (enam kasus), pelacak stack dan queue (empat program Python). Kunci `f121-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman); video dua versi dalam antrean render.
