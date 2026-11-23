# Video singkat "Program Python Pertama di Google Colab" (23 Nov 2026)

Tanpa merek kanal, sapaan "Anda", suara Cahaya (eleven_v4_turbo). Layar = halaman Colab ASLI yang direkam tanpa login;
login Google dan hasil run ditirukan lewat `fx.js` (tidak ada kredensial yang dikirim ke Google).

Alur (semua dari folder ini):
1. `python3 suara.py` (hanya MP3 yang belum ada), `python3 cek_lafal.py small` (lafal + `kata.json`).
2. `python3 keluaran.py` (keluaran dan traceback dari IPython 7.34 sungguhan -> `keluaran.json`).
3. `Xvfb :99 -screen 0 2560x1440x24 &` lalu `python3 rek.py` (±5 menit, waktu nyata; `CEPAT=0.3` untuk uji alur) -> `rek.mkv`, `rek.json`.
4. `python3 rakit.py` (kait, kartu bagian, kamera, pita KETIK, panel penutup, SRT) -> `out/`; `python3 thumb.py`.
5. Cek: `python3 kontak.py out/Google_Colab_Pertama.mp4 cek.png 3 <detik> ...`.

Perlu: `pip install playwright==1.63.0 python-xlib ipython==7.34.0 faster-whisper opencv-python-headless`, `apt-get install xdotool`.
Catatan: alamat `/notebooks/empty.ipynb` ditambal menjadi `/drive/<id>` saat perakitan (mengganti path di halaman memicu dialog Colab).
