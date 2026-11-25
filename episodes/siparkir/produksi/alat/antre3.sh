#!/bin/bash
# Antrean kerja: menjalankan baris demi baris dari antre3.txt (boleh ditambah saat berjalan). Berhenti bila ada yang gagal.
cd /home/user/parkir; i=${MULAI:-0}; touch antre3.txt
while true; do
  n=$(wc -l < antre3.txt)
  if [ $i -lt $n ]; then i=$((i+1)); cmd=$(sed -n "${i}p" antre3.txt); [ "$cmd" = SELESAI ] && exit 0; echo "=== [$i] $(date +%T) $cmd" >> antre.log
    bash -c "$cmd" >> antre.log 2>&1; k=$?; echo "=== [$i] kode $k $(date +%T)" >> antre.log
    [ $k -ne 0 ] && { echo "BERHENTI di baris $i" >> antre.log; exit 1; }
  else sleep 5; fi
done
