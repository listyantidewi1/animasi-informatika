#!/bin/bash
# Pasca-proses (kamera, label, sorot) untuk rekaman yang belum punya _cam.mp4: alat/antre_pasca.sh P01 P04 ...
cd /home/user/pinjam
for B in "$@"; do
  for n in rek web web_ai; do
    [ -f $B/$n.mkv ] && [ -f $B/$n.json ] || continue
    [ -f $B/${n}_cam.mp4 ] && [ $B/${n}_cam.mp4 -nt $B/$n.mkv ] && continue
    echo "$(date +%H:%M:%S) pasca $B/$n" >> pasca.log
    nice -n 19 python3 alat/pasca.py $B/$n $B/${n}_cam.mp4 > $B/pasca_$n.log 2>&1; echo "$(date +%H:%M:%S) $B/$n rc=$? $(tail -1 $B/pasca_$n.log | cut -c1-120)" >> pasca.log
  done
done
echo "PASCA SELESAI $*" >> pasca.log
