#!/bin/bash
# Jalankan rekaman beberapa bab berurutan: alat/antre_rekam.sh P01 P04 ...  (log di Pnn/rekam.log, ringkasan di antre.log)
cd /home/user/pinjam; export DISPLAY=:99
for B in "$@"; do
  echo "$(date +%H:%M:%S) mulai $B" >> antre.log
  timeout 1800 python3 $B/rekam.py > $B/rekam.log 2>&1; echo "$(date +%H:%M:%S) $B rekam rc=$? $(grep -c PERINGATAN $B/rekam.log) peringatan; $(grep CACAT $B/rekam.log)" >> antre.log
  if grep -q "Traceback" $B/rekam.log; then echo "GAGAL $B" >> antre.log; break; fi
  if [ -f $B/rekam_web.py ]; then timeout 900 python3 $B/rekam_web.py > $B/rekam_web.log 2>&1; echo "$(date +%H:%M:%S) $B web rc=$?" >> antre.log; fi
done
echo "ANTRE SELESAI" >> antre.log
