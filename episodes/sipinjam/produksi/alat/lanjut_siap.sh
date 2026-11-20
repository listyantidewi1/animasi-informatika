#!/bin/sh
# Setelah kredit ElevenLabs terisi dan naskah di Claude Doc disalin ke naskah_P01.json / naskah_sisip.json:
set -e
cd /home/user/pinjam
python3 alat/suara.py P01
for e in A04 A08 A10 A12; do python3 alat/suara.py $e --sisip; done
for e in P01 A03 A04 A08 A10 A12; do python3 alat/rakit.py $e; done
python3 alat/gabung.py
