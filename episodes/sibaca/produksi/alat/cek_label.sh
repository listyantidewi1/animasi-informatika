#!/bin/bash
# Lembar periksa: satu frame (720p) per label di rek_cam.mp4 → /tmp/claude-0/st/<EP>_label.png
EP=$1; cd /home/user/baca; rm -rf /tmp/claude-0/st/lb_$EP; mkdir -p /tmp/claude-0/st/lb_$EP
python3 -c "
import json; d=json.load(open('$EP/rek.json'))
for i,l in enumerate(d['label']): print(i, l[0]+l[2]*0.6)" | while read i t; do
  ffmpeg -nostdin -loglevel error -y -ss $t -i $EP/rek_cam.mp4 -frames:v 1 -vf scale=640:-1 /tmp/claude-0/st/lb_$EP/$(printf %02d $i).png; done
ffmpeg -loglevel error -y -pattern_type glob -i "/tmp/claude-0/st/lb_$EP/*.png" -vf tile=4x6 -frames:v 1 /tmp/claude-0/st/${EP}_label.png
