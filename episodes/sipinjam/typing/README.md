# Typing along SiPinjam (22 Nov 2026)

Pasca-olah video per bab (rekaman mentah sudah tidak ada) supaya penonton bisa mengetik mengikuti video.
Kerja di `/home/user/kerja-sp` (salin skrip ini ke sana, video bab dari `/mnt/project-files/sipinjam/bab/` ke `bab/`).

1. `scan_speed.py bab/X.mp4 scan/X.speed.json`: membaca label "dipercepat Nx" per frame (templat di `tpl/`, dibuat dengan drawtext yang sama seperti rakit.py).
2. `analisis.py` lalu `peta.py`: bagian per bab (berkas yang diketik / perintah / umum) dari spec.py, waktu.json, rekam.py.
3. `pecah_srt.py`: SRT penuh dipecah per bab ke `tmp/Pxx_in.srt`.
4. `lanjut.sh`: menjalankan `olah.py Pxx` untuk bab yang belum jadi (idempoten) dan menyalin ke Project Files.
5. `buat_readme.py`: daftar perintah dan berkas per bab -> `bahan-tutorial/SiPinjam/README.md`.
