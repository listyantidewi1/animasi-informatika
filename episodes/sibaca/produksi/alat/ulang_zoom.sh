#!/bin/bash
# Pasca ulang (zoom tanpa memotong teks) lalu rakit ulang: ulang_zoom.sh A00 A01 ...
cd /home/user/baca
for EP in "$@"; do
  echo "=== $EP $(date +%T)"
  if [ $EP = A00 ]; then nice -n 15 python3 alat/pasca.py A00/rek_ai A00/rek_ai_cam.mp4 || exit 1
  else nice -n 15 python3 alat/pasca.py $EP/rek $EP/rek_cam.mp4 || exit 1; fi
  nice -n 15 python3 alat/rakit.py $EP > /tmp/claude-0/rakitz_$EP.log 2>&1 || { echo "GAGAL rakit $EP"; exit 1; }
  tail -1 /tmp/claude-0/rakitz_$EP.log
done
echo "=== SELESAI $(date +%T)"
