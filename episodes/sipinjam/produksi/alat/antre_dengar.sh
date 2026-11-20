#!/bin/bash
# Transkrip whisper semua beat (cek lafal), setelah antrean pasca selesai. Hasil: dengar/Pnn.txt
cd /home/user/pinjam
sleep 1
for B in P00 P01 P02 P03 P04 P05 P06 P07 P08 P09 P10 P11 P12 P13; do
  [ -s dengar/$B.txt ] && continue
  UTAS=1 nice -n 19 python3 alat/dengar.py $B/suara/b*.mp3 > dengar/$B.tmp 2>dengar/$B.err && mv dengar/$B.tmp dengar/$B.txt
  echo "$(date -u +%H:%M:%S) dengar $B" >> dengar/log.txt
done
echo "DENGAR SELESAI" >> dengar/log.txt
