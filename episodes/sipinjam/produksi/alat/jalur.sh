#!/bin/bash
# Rekam berurutan: jalur.sh A06 A07 ... (rekam.py, pasca, web, rakit)
cd /home/user/pinjam
for EP in "$@"; do
  echo "=== $EP rekam $(date +%T)"
  if [ ! -f $EP/rek_cam.mp4 ] || [ $EP/rekam.py -nt $EP/rek_cam.mp4 ]; then
    python3 $EP/rekam.py > /tmp/claude-0/rek_$EP.log 2>&1 || { echo "GAGAL rekam $EP"; tail -n 5 /tmp/claude-0/rek_$EP.log; exit 1; }
    N=$(ffprobe -v error -count_packets -select_streams v -show_entries stream=nb_read_packets -of csv=p=0 $EP/rek.mkv); python3 -c "import json; d=json.load(open('$EP/rek.json'))['durasi']; r=$N/30/d; print('frame %.3f' % r, 'PERINGATAN: frame hilang' if r < 0.97 else 'ok')"
    python3 alat/pasca.py $EP/rek $EP/rek_cam.mp4 > /tmp/claude-0/pasca_$EP.log 2>&1 || { echo "GAGAL pasca $EP"; exit 1; }
  fi
  if [ -f $EP/web.sh ]; then echo "=== $EP web"; bash $EP/web.sh > /tmp/claude-0/web_$EP.log 2>&1 || { echo "GAGAL web $EP"; tail -n 5 /tmp/claude-0/web_$EP.log; exit 1; }; fi
  echo "=== $EP rakit $(date +%T)"
  python3 alat/rakit.py $EP > /tmp/claude-0/rakit_$EP.log 2>&1 &
done
wait; echo "=== SELESAI $(date +%T)"
