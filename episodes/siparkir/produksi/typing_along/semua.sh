#!/bin/bash
# Render semua bab (idempoten: bab yang sudah ada di hasil/ dilewati; segmen yang sudah jadi di /home/user/kerja/tmp_Pxx dipakai ulang).
cd /home/user/kerja/ta
for p in P06 P00 P01 P02 P03 P04 P05 P07 P08 P09 P10 P11 P12; do python3 olah.py $p || { echo "GAGAL $p"; exit 1; }; done
echo SEMUA_SELESAI
