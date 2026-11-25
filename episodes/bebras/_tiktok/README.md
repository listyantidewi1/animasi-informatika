# Versi TikTok pembahasan Bebras

Diminta Bu Dewi (11 Nov 2026): Short pembahasan Bebras dipakai ulang untuk TikTok, durasi lebih dari 60 detik tetapi tidak lebih dari 2 menit, dan selalu diakhiri ajakan subscribe channel YouTube @iTeachSWE.

- Penutup: adegan `tiktok_subscribe` di `_alat/short.js` (kartu "Pembahasan lengkapnya ada di YouTube", youtube.com/@iTeachSWE, tombol SUBSCRIBE yang diketuk, Kiko melambai). Narasi: "Pembahasan lengkap soal ini ada di channel YouTube iTeachSWE. Yuk, subscribe supaya kamu tidak ketinggalan pembahasan soal Bebras berikutnya!"
- Suara penutup direkam sekali per kecepatan Kak Ceria lalu dipakai ulang: `ajakan085` (SiKecil), `ajakan090` (Siaga), `ajakan095` (Penggalang, Penegak). Jangan dibuat ulang.
- Short yang sudah >= 60 detik: video Short jadi + penutup (11,7 detik).
- Short yang terlalu pendek diberi folder `<kode>/tiktok/` (format sama dengan `short/`). B04: Short + pembahasan pilihan A, B, D, C (suara p1–p4 dari video lengkap) + kredit (potongan kalimat pertama c2) + penutup. Tidak ada kredit ElevenLabs tambahan.

Perintah (dari `episodes/_alat/`):
```
python3 render_tiktok_bebras.py bebras/SG07 --frame 3 5.2 9   # pratinjau penutup
nice -n 10 python3 render_tiktok_bebras.py bebras/SG07        # <kode>_TikTok.mp4 + .srt + _caption.md di samping Short di /mnt/project-files/bebras/
```
Soal baru: buat Short seperti biasa, lalu jalankan perintah di atas. Bila Short < 60 detik, buat `<kode>/tiktok/script.json` (contoh B04), salin MP3 beat-nya ke `tiktok/suara_in/suara/` (termasuk `ajak.mp3` dari folder ajakan yang sesuai), `voice.py bebras/<kode>/tiktok`, lalu render.
