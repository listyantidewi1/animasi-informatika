# Vibe Coding Aplikasi HP dari Nol: Patungan

Video @iTeachSWE (38:24) + Short. Video, Short, thumbnail, dan .srt ada di Library proyek `tutorial/vibe/`.

- `patungan/`: kode akhir aplikasi (Vite + JS murni + Vitest, PWA tanpa plugin), 28 tes.
- `rek/`: perekam layar (code-server + Claude Code CLI `vc.py`, HP `hp.py`, DevTools `dt.py`) dan skrip rekam per bab.
- `prod/rencana.py`: narasi per beat + potongan rekaman/adegan; `prod/rakit.py suara|bab Vnn|gabung`.
- `prod/short.py`, `prod/thumb.py`: Short vertikal dan thumbnail.
- `adegan.js`: adegan kanvas (dirender `_alat/adegan.py`).
- `Metadata_YouTube.md`: judul, deskripsi, chapter, semua prompt.

Gambar beku (rekaman lebih pendek dari narasi) diberi zoom pelan hanya bila seluruh teks tetap muat (`zoom_aman` di rakit.py).
