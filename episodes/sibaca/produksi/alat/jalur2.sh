#!/bin/bash
# jalur2.sh B04 [B05 ...]: rekam.py -> cek frame -> pasca; rekam_web*.py -> pasca
cd /home/user/baca
for EP in "$@"; do
  for S in $EP/rekam*.py; do
    [ -f "$S" ] || continue
    N=$(basename $S .py); N=${N/rekam_/}; [ "$N" = "rekam" ] && N=rek
    echo "=== $EP $N $(date +%T)"
    python3 $S > /tmp/claude-0/rek_${EP}_$N.log 2>&1 || { echo "GAGAL $S"; tail -n 8 /tmp/claude-0/rek_${EP}_$N.log; exit 1; }
    grep -n "CACAT\|PERINGATAN\|Traceback" /tmp/claude-0/rek_${EP}_$N.log | head -5
    F=$(ffprobe -v error -count_packets -select_streams v -show_entries stream=nb_read_packets -of csv=p=0 $EP/$N.mkv); python3 -c "import json; d=json.load(open('$EP/$N.json'))['durasi']; r=$F/30/d; print('durasi %.0f dtk, frame %.3f' % (d, r), 'PERINGATAN: frame hilang' if r < 0.97 else 'ok')"
    python3 alat/pasca.py $EP/$N $EP/${N}_cam.mp4 > /tmp/claude-0/pasca_${EP}_$N.log 2>&1 || { echo "GAGAL pasca $EP $N"; tail -n 5 /tmp/claude-0/pasca_${EP}_$N.log; exit 1; }
  done
done
echo "=== SELESAI $(date +%T)"
