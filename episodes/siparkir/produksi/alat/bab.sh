#!/bin/bash
# bab.sh Pnn [rekaman...]: rekam (rekam.py, rekam_web.py bila ada), periksa frame, pasca, lalu rakit. Berhenti pada kegagalan pertama.
cd /home/user/parkir; EP=$1; L=/tmp/claude-0
cekframe() { N=$(ffprobe -v error -count_packets -select_streams v -show_entries stream=nb_read_packets -of csv=p=0 $1.mkv); python3 -c "import json; d=json.load(open('$1.json'))['durasi']; r=$N/30/d; print('$1 frame %.3f %.0fs' % (r, d), 'PERINGATAN: frame hilang' if r < 0.97 else 'ok')"; }
for S in ${REKAM:-rekam_a rekam rekam_web}; do
  [ -f $EP/$S.py ] || continue
  case $S in rekam_a) K=rek_a;; rekam) K=rek;; rekam_web) K=web;; *) K=${S#rekam_};; esac
  echo "--- $EP $S $(date +%T)"; python3 -u $EP/$S.py > $L/${S}_$EP.log 2>&1 || { echo "GAGAL $S $EP"; tail -n 8 $L/${S}_$EP.log; exit 1; }
  grep -E "CACAT|BANDING|PERINGATAN" $L/${S}_$EP.log | tail -5
  cekframe $EP/$K
  python3 alat/pasca.py $EP/$K $EP/${K}_cam.mp4 > $L/pasca_${K}_$EP.log 2>&1 || { echo "GAGAL pasca $K $EP"; tail -n 5 $L/pasca_${K}_$EP.log; exit 1; }
done
[ -n "$TANPA_RAKIT" ] && exit 0
echo "--- $EP rakit $(date +%T)"; python3 alat/rakit.py $EP > $L/rakit_$EP.log 2>&1 || { echo "GAGAL rakit $EP"; tail -n 8 $L/rakit_$EP.log; exit 1; }
tail -n 1 $L/rakit_$EP.log
