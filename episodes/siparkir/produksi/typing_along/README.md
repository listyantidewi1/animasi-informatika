# SiParkir: versi typing along (23 Nov 2026)

Pasca-sunting dari video jadi (rekaman mentah sudah tidak ada), tanpa kredit ElevenLabs baru.

1. `rencana.py` = rakit.py mode RENCANA: batas setiap potongan rekaman per beat (`rencana_Pxx.json`).
2. `ketik.py`: daftar potongan berisi ketikan (kode: label alamat GitHub per tag bab; perintah terminal/SQL: label perintah).
3. `olah.py Pxx`: potongan ketik diputar pada kecepatan asli (dulu dipercepat sampai 12x), hasil ditahan 4-9 dtk dengan ajakan "jeda video", narasi asli disisipi hening di batas kalimat atau jeda napas terdekat.
4. `gabung2.py`: video penuh + SRT + chapter; `perbab.py`: potongan playlist; `petawaktu.py`: cap waktu lama ke baru; `qc.py`: lembar periksa sinkron.
Jalankan ulang: `bash hidupkan.sh` lalu `bash semua.sh` (idempoten).
