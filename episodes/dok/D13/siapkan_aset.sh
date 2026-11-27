#!/bin/bash
# Menyiapkan aset/ (bahan asli pihak ketiga, TIDAK di-commit) dari folder kajian di Project Files.
# Dipakai dengan izin Bu Dewi 27 Nov 2026: kutipan pendek untuk kritik/tinjauan, sumber disebut di layar.
set -e
SRC=${SRC:-/mnt/project-files/gta6/kajian-4k120/bahan_asli}
cd "$(dirname "$0")"; mkdir -p aset/klip aset/log
V=$SRC/klaim_4k120_1080p.mp4
# klip 30 fps, 1280x720, 0-10 dtk (latar redup dan cuplikan)
ffmpeg -v error -y -ss 0 -t 10 -i $V -vf "fps=30,scale=1280:720" -q:v 4 aset/klip/f%03d.jpg
# potongan overlay log resolusi penuh (x0..940, y0..580) pada beberapa detik
for s in 0.2 1 3 5 6.4 8 11 14 17 20 23.5; do ffmpeg -v error -y -ss $s -i $V -frames:v 1 -vf "crop=940:580:0:0" -q:v 2 aset/log/t$s.jpg; done
# frame utuh resolusi penuh untuk bukti
for s in 1 5 12; do ffmpeg -v error -y -ss $s -i $V -frames:v 1 -q:v 2 aset/utuh_t$s.jpg; done
python3 - "$SRC" <<'PY'
import sys
from PIL import Image, ImageFilter
src = sys.argv[1]
def blur(im, boxes, r=26):
    for b in boxes:
        reg = im.crop(b).filter(ImageFilter.GaussianBlur(r)); im.paste(reg, b)
    return im
# akun perorangan kecil: foto, nama, dan handle diburamkan
for n in ["tweet_klaim_repost", "tweet_klaim_asli"]:
    im = Image.open(f"{src}/{n}.png").convert("RGB"); blur(im, [(26, 18, 136, 128), (134, 22, 470, 112)]); im.save(f"aset/{n}.jpg", quality=92)
# Pubity: akun media, tampil utuh; hanya bagian teks (tanpa poster resmi)
im = Image.open(f"{src}/tweet_pubity.png").convert("RGB"); im.crop((0, 0, im.width, 398)).save("aset/tweet_pubity.jpg", quality=92)
PY
ls aset | head; ls aset/klip | wc -l
