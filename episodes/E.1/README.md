# E.1 — Komputer Von Neumann: Simulasi Input–Proses–Output (10 JP)

Elemen BK, prioritas P1. Model Von Neumann: unit kendali, ALU, register (PC, IR, AKU), memori 16 sel yang menyimpan program dan data bersama, masukan/keluaran, bus; siklus ambil, terjemahkan, jalankan (fetch, decode, execute); program lima instruksi (MUAT, TAMBAH, SIMPAN, KELUAR, BERHENTI) ditelusuri siklus demi siklus; ganti data tanpa mengubah program; bus tiga jalur, detak (clock), perangkat nyata. Dua bagian video: **E.1a** (lima bagian dan siklus mesin) dan **E.1b** (program lima instruksi). Prasyarat: D7.2, E.0. Judul di layar dipendekkan menjadi "Komputer Von Neumann".

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D7.2/komputer.js` (cip, RAM), `vn.js`, `scenes.js`.
- `vn.js` — mesin komputer mini: `V.run(mem, siklus, fase)` menyimulasikan program; `V.machine` menggambar CPU, register, memori, I/O, bus, token di bus dengan sorotan per fase; diagram siklus; gelombang detak.
- `page.html` — pemutar, 4 cek pemahaman, simulator komputer mini (Langkah per fase, register dan memori tersorot, layar) dengan tiga latihan: jalankan dan amati lalu tiga pertanyaan; ubah data agar layar 20; susun program pengurang (enam instruksi termasuk KURANG). Kunci `e1-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
