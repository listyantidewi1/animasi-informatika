# F11.10 — Proyek: Aplikasi Berbasis Data Terbuka (20 JP)

Unit proyek penutup kelas XI: menggabungkan alur pengembangan (F11.1) dan siklus data terbuka (F11.5) menjadi satu program Python kecil, aplikasi fiktif *Cek Bulan Kemah* untuk OSIS. Alurnya: kebutuhan dari wawancara dan lingkup versi 1.0 yang kecil, desain alur data (baca file CSV → bersihkan → rangkum per bulan → rekomendasikan) dengan list dan dictionary, implementasi satu fungsi satu tugas, pengujian dengan test case (sel kosong, kode 999, baris kembar), rilis 1.0 dengan README, pemeliharaan 1.1, lalu panduan proyek kelompok dengan data terbuka daerah sendiri. Kegiatan tanpa komputer: estafet kartu data hujan, tiap orang satu tugas. Semua data fiktif. Dua bagian video: **F11.10a** (kebutuhan dan desain) dan **F11.10b** (kode, uji, rilis). Gaya diagram Fase F.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D8.1/lembar.js`, `../F11.0/py.js`, `../F11.1/alur_dev.js`, `../F11.5/terbuka.js`, `proyek_data.js`, `scenes.js`.
- `proyek_data.js` — pipa fungsi (kotak fungsi dan data yang diserahkan), kartu baris CSV, tampilan dictionary, kartu README.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan: perakit program (susun empat fungsi sesuai alur data, lalu jawab tiga pertanyaan), penguji fungsi (lima test case: tebak hasil yang diharapkan, lalu lihat hasil saat fungsi dijalankan), pemeriksa README (pilih bagian yang wajib ada, tolak yang tidak pantas). Kunci `f1110-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman); video dua versi dalam antrean render.
