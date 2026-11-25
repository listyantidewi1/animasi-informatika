#!/bin/bash
# Antrean rakit yang bisa dijalankan beberapa sekaligus: tiap bab dikunci dengan mkdir kunci/<bab>.
cd /home/user/pinjam
for B in P04 P05 P06 P07 P08 P09 P10 P11 P12 P13 P00; do
  mkdir kunci/$B 2>/dev/null || continue
  echo "$(date -u +%H:%M:%S) rakit $B ($1)" >> rakit.log
  python3 alat/rakit.py $B > $B/rakit.log 2>&1
  echo "$(date -u +%H:%M:%S) $B rc=$? $(tail -1 $B/rakit.log | cut -c1-160)" >> rakit.log
done
echo "RAKIT4 SELESAI $1" >> rakit.log
