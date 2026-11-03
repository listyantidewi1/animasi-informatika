# F12.3 — Analisis Data untuk Prediksi (22 JP)

Unit kelas XII (prioritas P1, elemen AD): prediksi sebagai tebakan beralasan dari pola data. Data fiktif Bank Sampah SMA Tunas (20, 24, 25, 28, 33, 35 kg, disusun agar garis regresinya tepat y = 17 + 3x). Alurnya: rata-rata yang tidak melihat arah (27,5), tren sebagai rata-rata kenaikan (3 kg/bulan), garis tren y = a + bx (kemiringan dan titik awal), error dan alasan error dikuadratkan, regresi linear sebagai garis dengan jumlah kuadrat error terkecil (4, dibanding 8,75 dan 161,5 untuk garis lain), lembar kerja (diagram titik, garis tren, SLOPE, INTERCEPT, FORECAST), Python (`statistics.linear_regression`, perulangan jumlah kuadrat error), satu data salah ketik (cara titik awal–akhir meleset ke 45,2, regresi 42), hati-hati (terlalu jauh, data aneh, naik bersama bukan sebab-akibat), dan keputusan dengan rentang serta batasan. Kegiatan tanpa komputer: benang di kertas berpetak dan jarak tegak dengan penggaris. Dua bagian video: **F12.3a** (rata-rata, tren, dan error) dan **F12.3b** (lembar kerja, Python, dan keputusan). Gaya diagram Fase F.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `../D8.1/lembar.js`, `../F11.0/py.js`, `tren.js`, `scenes.js`.
- `tren.js` — diagram titik dengan sumbu, garis tren, segmen error, kotak kuadrat error, garis rata-rata, titik prediksi, batang perbandingan.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan: penggeser garis tren (dua data, naik dan turun; jumlah kuadrat error dihitung langsung, garis regresi ditampilkan setelah berhasil), kalkulator prediksi (empat soal, pilihan salah dari kesalahan urutan hitung), detektif prediksi (empat klaim). Kunci `f123-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman); video dua versi dalam antrean render.
