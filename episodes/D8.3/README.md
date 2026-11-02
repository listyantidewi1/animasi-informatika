# D8.3 — Flowchart dan Pseudocode Dasar (12 JP)

Elemen BK (gerbang penguasaan urutan dan percabangan): lima bentuk flowchart, flowchart urutan (teh manis), pseudocode berkosakata terbatas dan aturannya, percabangan JIKA–MAKA–LAINNYA di flowchart (belah ketupat, dua panah) dan pseudocode, menelusuri dengan token yang memilih cabang sesuai data (termasuk nilai batas 70), percabangan bertingkat LAINNYA JIKA. Dua bagian video: **D8.3a** (bentuk dan urutan) dan **D8.3b** (percabangan dan menelusuri). Prasyarat: D8.0.

Berkas khusus episode ini:
- `script.json` — 29 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `alur.js`, `scenes.js`.
- `alur.js` — simpul flowchart (oval, kotak, jajar genjang, belah ketupat), panah siku berlabel, token dan jalur, panel pseudocode dengan kata kunci berwarna dan indentasi; `scenes.js` menganimasikan token di flowchart nilai (jalan ya dan tidak).
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan (pasangkan bentuk dengan arti; jalankan token dengan nilai pilihan sendiri di flowchart tiga jalan, wajib menelusuri ketiga jalan; susun pseudocode percabangan dua tingkat). Kunci `d83-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 29 adegan diperiksa, narasi Kak Ceria, halaman, video dua versi).
