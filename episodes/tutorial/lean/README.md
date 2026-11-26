# L01: Apa Itu Lean 4 dan Cara Mulai Belajar

Video penjelasan + praktik (±15,5 menit, narasi Cahaya v4 Turbo) dan satu Short dari potongan narasi video utama.

- Naskah: `naskah_doc.json` (salinan tabel dari dokumen Claude yang disunting Bu Dewi) -> `python3 buat_script.py` -> `script.json`, `short/script.json`. Jeda tiap beat diambil dari `hold.json`.
- Suara: `python3 ../../_alat/suara_elevenlabs.py tutorial/lean`, `align_dok.py`, `voice.py` -> `timeline.json`.
- Bab 0-2, akhir Bab 5, Bab 6-8: Manim (`manim/babN.py`, kit di `manim/kit.py`, venv `/opt/mv`). `python render_manim.py --hd 0 1 2 ...`
- Bab 3-5: rekaman Lean sungguhan di live.lean-lang.org. `rekam.py` menyimpan satu tangkapan layar per ketukan (`rek/*.png`, tidak ikut git, dan `rek/log.json`); `rakit.py` memberi waktu tiap ketukan dari kata narasi (SPEC), lalu menambah pita KETIK, sorotan, kotak bantuan, dan label alamat kode.
  1. `python3 rakit.py --rencana` (hitung `hold.json`), `python3 buat_script.py`, `voice.py`.
  2. `python3 rakit.py --cek` (lembar kontak), render kerangka Manim bab 3-5 lalu ganti nama menjadi `video/hd/shellN.mp4`, `python3 rakit.py 3 4 5`.
- `gabung.py`: gabung semua bab + narasi -> `video/L01_Apa_Itu_Lean_4.mp4`; `subtitle.py` -> .srt; `short.py` -> Short; `thumbnail.py`; `youtube.md`.
- Kode yang diketik di video: `bahan-tutorial/lean/pertama.lean`.
