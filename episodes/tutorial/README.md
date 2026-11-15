# Seri tutorial "Proyek Pemrograman Sederhana"

Tutorial untuk anak SMP/SMA dengan rekaman layar sungguhan (bukan animasi). Kurikulum tidak disebut di video maupun metadata.

Alur contoh (T01):
1. `Xvfb :99 -screen 0 2560x1440x24 &` lalu `jupyter notebook --no-browser --port 8888 --IdentityProvider.token='' --allow-root` di folder notebook.
2. `python3 _alat/reset_nb.py <notebook.ipynb>` (matikan kernel lama, kosongkan notebook).
3. `python3 T01/rekam_contoh.py` merekam Chromium sungguhan lewat ffmpeg x11grab (kode diketik dan dijalankan nyata) + jejak kamera/label JSON.
4. `python3 _alat/pasca.py <rekaman> <keluar.mp4> "<judul>" "<sub>"` menambah kartu judul, zoom kamera halus, dan label langkah.

Catatan: Chromium memakai `--window-size` dalam satuan CSS (layar/DSF), jadi jendela 1536x864 CSS = 2560x1440 piksel.
