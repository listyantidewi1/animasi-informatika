#!/bin/bash
# Idempoten: olah bab yang belum punya out/Pxx.mp4, salin ke Project Files. Jalankan dari /home/user/kerja-sp.
cd /home/user/kerja-sp
TUJ=/mnt/project-files/sipinjam/typing-along/bab; mkdir -p $TUJ
olah() { p=$1
  if [ ! -f out/$p.mp4 ]; then python3 olah.py $p > log/$p.log 2>&1 || { echo "GAGAL $p"; return; }; fi
  if [ ! -f $TUJ/$p.done ]; then cp out/$p.mp4 out/$p.srt $TUJ/ && touch $TUJ/$p.done; fi
  echo "OK $p"; }
mkdir -p log
export -f olah; export TUJ
printf "P%02d\n" $(seq 4 13) 1 0 2 3 | xargs -P 2 -I{} bash -c 'olah {}'
echo SEMUA_SELESAI
