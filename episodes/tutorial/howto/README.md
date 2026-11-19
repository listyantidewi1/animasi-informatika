# Contoh Short how-to (Google TTS gratis)

Contoh pertama: "Cara pasang Claude Code dalam 4 langkah" (19 Nov 2026), narasi gTTS (Google Translate TTS, gratis, tanpa kunci), 0 kredit ElevenLabs.

1. `pip install gTTS websockets playwright==1.63.0`; di `web/`: `npm pack @xterm/xterm@5.5.0` lalu ekstrak ke `web/xterm-xterm-5.5.0/`.
2. `python3 gtts_buat.py` (suara per beat, rubberband tempo 1,15, loudnorm). Teks TTS pakai ejaan lafal (Klod Kod, Pawersyel, saksesfuli instold).
3. Pengguna baru `siswa` (home bersih, PS1 pendek di .bashrc), `Xvfb :99 -screen 0 1080x1920x24`, lalu `python3 rekam.py`: terminal sungguhan (pty `su - siswa`) ditampilkan xterm.js di Chromium `--app`, direkam ffmpeg x11grab. Tiap beat menunggu narasinya selesai, jadi sinkron dengan sendirinya; waktu beat di `rekam_log.json`.
4. Suara ditaruh per beat dengan adelay pada waktu beat (lihat riwayat thread), keluaran + .srt.

Varian edge-tts (gratis, tanpa akun): `python3 edge_buat.py` (Gadis dan Ardi; SSL lewat CA proxy `/root/.ccr/ca-bundle.crt`; ejaan lafal Klod, Pawer Syel, saksesfuli instold). Gadis dipercepat 1,12 (rubberband) agar muat di waktu beat rekaman yang sama.
