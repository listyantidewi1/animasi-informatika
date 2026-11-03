# F12.5 — Transaksi Digital yang Aman (12 JP)

Unit kelas XII (prioritas P2, elemen LD); semua toko, nama, nomor, dan pesan fiktif. Isi: loka pasar dan rekening bersama (perlindungan hilang bila bertransaksi di luar aplikasi), perbankan digital dan dompet digital (PIN, OTP, notifikasi), perjalanan satu pembayaran QRIS Rp15.000 di Kedai Sari (pindai, cek nama dan nominal, PIN, penerbit memproses, uang masuk, notifikasi) beserta dua titik rawan (stiker QR palsu, bukti transfer hasil sunting), penipuan rekayasa sosial (pesan hadiah meminta OTP, telepon petugas bank palsu, APK kiriman) dan empat tanda bahaya, autentikasi dua langkah (tahu, punya, diri; moda SMS, aplikasi autentikator, kunci keamanan atau passkey, biometrik), langkah bila tertipu, dan kebiasaan aman. Kegiatan tanpa komputer: permainan rekening bersama dengan uang mainan dan stiker QR palsu. Dua bagian video: **F12.5a** (loka pasar, dompet digital, dan QRIS) dan **F12.5b** (penipuan dan autentikasi dua langkah). Gaya diagram Fase F.

Berkas khusus episode ini:
- `script.json` — 27 beat, 8 segmen, 4 kuis, kunci `hook`; `engine`: `kiko-core.js`, `kiko-devices.js`, `bayar.js`, `scenes.js`.
- `bayar.js` — pola mirip kode QR (digambar dengan kode), dudukan QR kasir dan stiker palsu, layar aplikasi pembayaran (pindai, konfirmasi, PIN, berhasil), alur kotak berpanah, gelembung chat.
- `page.html` — pemutar, 4 cek pemahaman, tiga latihan: simulasi kasir QRIS (lima giliran, termasuk peran penjual yang menerima screenshot), detektif pesan penipuan (lima pesan), penyusun 2FA (kelompokkan delapan faktor, pilih pasangan yang benar). Kunci `f125-progress`.
- `tts-kit/` — `suara.json` (Kak Ceria, Eleven v4), `naskah.json`, `naskah-tts.txt/.csv`.

Status: selesai (naskah, 27 adegan diperiksa, narasi Kak Ceria, halaman); video dua versi dalam antrean render.
