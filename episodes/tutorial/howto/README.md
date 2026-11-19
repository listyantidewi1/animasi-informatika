# Contoh Short how-to (Google TTS gratis)

Contoh pertama: "Cara pasang Claude Code dalam 4 langkah" (19 Nov 2026), narasi gTTS (Google Translate TTS, gratis, tanpa kunci), 0 kredit ElevenLabs.

1. `pip install gTTS websockets playwright==1.63.0`; di `web/`: `npm pack @xterm/xterm@5.5.0` lalu ekstrak ke `web/xterm-xterm-5.5.0/`.
2. `python3 gtts_buat.py` (suara per beat, rubberband tempo 1,15, loudnorm). Teks TTS pakai ejaan lafal (Klod Kod, Pawersyel, saksesfuli instold).
3. Pengguna baru `siswa` (home bersih, PS1 pendek di .bashrc), `Xvfb :99 -screen 0 1080x1920x24`, lalu `python3 rekam.py`: terminal sungguhan (pty `su - siswa`) ditampilkan xterm.js di Chromium `--app`, direkam ffmpeg x11grab. Tiap beat menunggu narasinya selesai, jadi sinkron dengan sendirinya; waktu beat di `rekam_log.json`.
4. Suara ditaruh per beat dengan adelay pada waktu beat (lihat riwayat thread), keluaran + .srt.

Varian edge-tts (gratis, tanpa akun): `python3 edge_buat.py` (Gadis dan Ardi; SSL lewat CA proxy `/root/.ccr/ca-bundle.crt`; ejaan lafal Klod, Pawer Syel, saksesfuli instold). Gadis dipercepat 1,12 (rubberband) agar muat di waktu beat rekaman yang sama.

## Seri Short how-to H01–H13 (suara edge-tts Ardi, keputusan Bu Dewi 19 Nov 2026)

Semua Short how-to memakai `id-ID-ArdiNeural` (+5%), gratis. Tiap Short mengarah ke video panjang terkait (dokumenter atau tutorial). Metadata YouTube per Short di `meta/Hnn_youtube.md` (`[link video]` = link belum ada).

Alat: `alat/rig.py` + `alat/halaman.html` (H01 dibuat dengan `rekam.py` lama). Satu Short = satu modul `shorts/hNN.py` berisi `KODE`, `NAMA`, `JUDUL`, `LANGKAH`, `VIDEO`, `BEATS` (id, teks layar, teks TTS opsional), opsional `LAFAL`, `SIAPKAN` (perintah persiapan untuk pengguna `siswa`), `PATH_EXTRA`, `EXTRA_CSS/HTML/JS`, dan `async ADEGAN(r)`.

1. Siapkan sekali: `pip install edge-tts websockets playwright==1.63.0 faster-whisper` ; `npm pack @xterm/xterm@5.5.0`, ekstrak ke `alat/xterm/` ; pengguna `siswa` ; `setsid nohup Xvfb :99 -screen 0 1080x1920x24 &`.
2. `cd alat && python3 rig.py ../shorts/h05.py` → `keluar/H05/H05_<NAMA>_Short.mp4` + `.srt` + `_lembar.jpg` (lembar kontak untuk diperiksa) + `_log.json`. `--suara` hanya membuat suara.
3. Pengguna `siswa` dibuat ulang tiap Short; `.bash_profile` membuang `NVM_DIR`/PATH global (dari `/etc/profile.d`) supaya pemasangan terlihat seperti di komputer baru. Alat bersama dibuat symlink di `/opt/siswa-bin`.

Pelajaran:
- Tiap beat menunggu narasinya; minimal 1,5 detik jeda setelah aksi agar hasil terminal terbaca. Tunggu lama (>2,5 detik) dipercepat 6× saat penyuntingan.
- Lafal: istilah ditulis sesuai bacaan di `LAFAL` (Klod Kod, Git Hab, pe ha pe, rid mi, de ef titik hed). Cek lafal dengan faster-whisper (tidak selalu tepat, tetapi menunjukkan bagian yang meragukan).
- Panel web/HP digambar (`shorts/web_umum.py`, `shorts/hp_umum.py`); halaman sungguhan (Laravel, Jupyter, server Node) lewat iframe. Jupyter perlu CSP `frame-ancestors`, ukuran huruf lewat `themes.jupyterlab-settings`, CSS tabel disisipkan ke frame.
- Paket Python untuk `siswa`: `PIP_USER=0 pip install --ignore-installed --prefix /usr/local notebook ipykernel pandas openpyxl`.
