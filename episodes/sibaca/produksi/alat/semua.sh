#!/bin/bash
# semua.sh B01 B03 ...: rekam ulang berurutan, aman diulang (bab yang sudah punya tanda selesai dilewati).
# Tiap bab: rekam.py -> pasca -> rekam_web.py -> pasca -> rakit (latar, prioritas rendah) -> salin hasil ke Library.
cd /home/user/baca; bash alat/hidup.sh >/dev/null; L=/mnt/project-files/sibaca/kerja/v2; mkdir -p $L
rakit() { EP=$1; nice -n 19 python3 alat/rakit.py $EP > /tmp/claude-0/rakit_$EP.log 2>&1 && touch $EP/.rakit_ok && cp $EP/${EP}_*.mp4 $EP/${EP}_*.srt $L/ 2>/dev/null; echo "--- rakit $EP selesai $(date +%T)"; }
for EP in "$@"; do
  if [ ! -f $EP/.rekam_ok ]; then
    rm -f $EP/.rakit_ok
    if [ "$EP" != "B01" ]; then (cd /home/user/proyek/sibaca && git fetch -q /home/user/sibaca-github 'refs/tags/*:refs/tags/*' 2>/dev/null); fi  # tag bab yang belum direkam ulang diambil dari repo publik
    bash alat/jalur2.sh $EP || { echo "GAGAL $EP"; exit 1; }
    for f in $EP/*.json; do case $f in *waktu.json) ;; *) cp $f $L/$(basename $EP)_$(basename $f);; esac; done
    touch $EP/.rekam_ok
  fi
  [ -f $EP/.rakit_ok ] || rakit $EP &
done
wait; echo "=== SEMUA SELESAI $(date +%T)"
