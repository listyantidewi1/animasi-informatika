#!/bin/bash
# Typing along: satu bab dari rekam sampai rakit. Idempoten: langkah yang keluarannya sudah ada dilewati.
# Pakai: jalur2.sh A04 A05 ...   (ULANG=rekam|pasca|rakit untuk memaksa dari langkah itu)
cd /home/user/antre; L=/tmp/claude-0; mkdir -p $L /mnt/project-files/antrean/v2
for EP in "$@"; do
  echo "=== $EP mulai $(date +%T)"
  if [ "${ULANG:-}" = rekam ] || [ ! -s $EP/rek.json ] || [ ! -s $EP/rek.mkv ]; then
    rm -f $EP/rek.json $EP/rek_cam.mp4 $EP/web.json $EP/web_cam.mp4 $EP/$EP_*.mp4
    touch $EP/.rekam_baru; python3 $EP/rekam.py > $L/rek_$EP.log 2>&1 || { echo "GAGAL rekam $EP"; tail -n 5 $L/rek_$EP.log; exit 1; }
    N=$(ffprobe -v error -count_packets -select_streams v -show_entries stream=nb_read_packets -of csv=p=0 $EP/rek.mkv); python3 -c "import json; d=json.load(open('$EP/rek.json'))['durasi']; r=$N/30/d; print('$EP frame %.3f' % r, 'PERINGATAN: frame hilang' if r < 0.97 else 'ok')"
  fi
  # Kode hasil rekaman harus sama dengan tag asli bab itu (kalau beda, ada langkah yang gagal saat direkam)
  B=${EP#A}; if [ -f $EP/.rekam_baru ]; then
    BEDA=$(git -C /home/user/proyek/siantre diff --stat refs/asli/bab-$B bab-$B -- . ':!package.json' ':!package-lock.json' | tail -n 1)
    if [ -n "$BEDA" ]; then echo "GAGAL $EP: kode berbeda dari tag asli bab-$B:$BEDA"; exit 1; fi; rm -f $EP/.rekam_baru; echo "$EP kode sama dengan tag asli"
  fi
  if [ "${ULANG:-}" = pasca ] || [ ! -s $EP/rek_cam.mp4 ] || [ $EP/rek.json -nt $EP/rek_cam.mp4 ]; then
    python3 alat/pasca.py $EP/rek $EP/rek_cam.mp4 > $L/pasca_$EP.log 2>&1 || { echo "GAGAL pasca $EP"; tail -n 5 $L/pasca_$EP.log; exit 1; }
  fi
  if { [ -f $EP/rekam_web.py ] || [ -f $EP/web.sh ]; } && { [ ! -s $EP/web_cam.mp4 ] || [ $EP/rek.json -nt $EP/web_cam.mp4 ]; }; then
    if [ -f $EP/web.sh ]; then bash $EP/web.sh > $L/web_$EP.log 2>&1; else (python3 $EP/rekam_web.py && python3 alat/pasca.py $EP/web $EP/web_cam.mp4) > $L/web_$EP.log 2>&1; fi || { echo "GAGAL web $EP"; tail -n 5 $L/web_$EP.log; exit 1; }
  fi
  F=$(ls $EP/${EP}_*.mp4 2>/dev/null | head -1)
  if [ "${ULANG:-}" != "" ] || [ -z "$F" ] || [ $EP/rek_cam.mp4 -nt "$F" ] || [ $EP/spec.py -nt "$F" ]; then
    python3 alat/rakit.py $EP > $L/rakit_$EP.log 2>&1 || { echo "GAGAL rakit $EP"; tail -n 5 $L/rakit_$EP.log; exit 1; }
    F=$(ls $EP/${EP}_*.mp4 | head -1); cp "$F" "${F%.mp4}.srt" /mnt/project-files/antrean/v2/
  fi
  echo "=== $EP selesai $(date +%T) $(tail -n 1 $L/rakit_$EP.log)"
done
