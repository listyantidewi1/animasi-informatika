#!/bin/bash
# rekam_blender.sh <nama_raw> <file.blend> <skrip_gui.py> <log.json> [batas_detik]
RAW=/home/user/animasi-informatika/episodes/tutorial/film3d/raw
rm -f "$4"
cd /home/user/proyek/paket-terakhir
DISPLAY=:99 blender --gpu-backend opengl "$2" --python "$3" > /tmp/blender_gui.log 2>&1 &
BP=$!
sleep 6
ffmpeg -loglevel error -y -f x11grab -draw_mouse 0 -framerate 30 -video_size 2560x1440 -i :99 -c:v libx264 -preset ultrafast -crf 14 -pix_fmt yuv420p "$RAW/$1.mkv" &
FP=$!; T0=$(date +%s.%N)
timeout ${5:-200} bash -c "until grep -q akhir $4 2>/dev/null; do sleep 0.5; done"
sleep 1.5
kill -INT $FP; wait $FP 2>/dev/null
kill $BP 2>/dev/null; sleep 1; kill -9 $BP 2>/dev/null
python3 - "$4" "$T0" "$RAW/$1.json" <<'P'
import json, sys
# waktu tanda relatif terhadap mulai blender; geser ke waktu rekaman (rekaman mulai 6 dtk setelah blender + jeda)
t = json.load(open(sys.argv[1])); t0 = float(sys.argv[2])
json.dump({"tanda": [[round(a - t0, 3), n] for a, n in t]}, open(sys.argv[3], "w"), indent=1)
P
echo selesai
