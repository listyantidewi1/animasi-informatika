# Seri "Git dan Kerja Tim" (G01–G06), @iTeachSWE

Enam video pendek (±4,5–5,5 menit) + satu Short per episode, narasi Cahaya (ElevenLabs, eleven_v4). Video, Short, thumbnail, .srt, dan metadata ada di Library proyek `tutorial/git/Gnn/`.

| Kode | Judul |
|---|---|
| G01 | Git dari Nol: Commit Pertamamu |
| G02 | Mundur ke Masa Lalu tanpa Panik |
| G03 | Branch: Kerja Paralel tanpa Saling Ganggu |
| G04 | Merge Conflict: Membaca dan Membereskannya |
| G05 | Remote dan Pull Request |
| G06 | Alur Kerja Tim Sehari-hari |

Semua layar adalah rekaman sungguhan: code-server (VS Code) di Xvfb 2560×1440, terminal Raka/Nadia, panel graf commit (`graf/`), dan server Gitea lokal (G05–G06). Akun Gitea `raka`/`nadia` hanya ada di server lokal perekaman.

## Alur
1. `siapkan.sh` menyalakan Xvfb, code-server, dan server graf. `rek/siap_gNN.py` menyiapkan keadaan repo SiAntre (dari `siantre_dasar/`) di luar kamera; `rek/gNN.py` merekam dan menulis tanda waktu (`raw/GNN.json`).
2. `prod/rencana_git.py`: narasi per beat + potongan rekaman/adegan. `s=k` = bagian itu mulai pada kalimat ke-k (sinkron narasi-visual); `BAB(...)` = kartu antarbab ±4,2 detik tanpa narasi.
3. `prod/rakit_git.py suara GNN` lalu `prod/rakit_git.py ep GNN [--cek]`. Jeda antarbeat 0,35 + 0,9 detik. Crop yang tidak 16:9 diberi latar, tidak dipotong; zoom pelan hanya bila seluruh teks tetap muat.
4. `prod/cek_potong.py GNN <folder>`: lembar kontak tiap potongan sebelum render.
5. `prod/short_git.py GNN` (Short vertikal, satu klip per kalimat, isi di `short_git_isi.py`), `prod/thumb_git.py`, `prod/youtube_git.py` (metadata + chapter di `metadata/`).

Adegan kanvas ada di `adegan_git.js` (dirender `_alat/adegan_r.py`). Naskah yang disetujui: `teks/naskah.txt`.
