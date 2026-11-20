#!/bin/bash
# lembar.sh EP "nama:D nama:D ..." -> /tmp/claude-0/st/EP_nama.png (3 waktu ditumpuk 2x2 kecil)
ep=$1; shift
for x in $@; do n=${x%%:*}; D=${x##*:}
  t="$(python3 -c "print(','.join(str(round($D*f,2)) for f in (.3,.6,.97)))")"
  python3 /home/user/pinjam/alat/still.py $ep $n $t $D '{}' /tmp/claude-0/st/${ep}_$n.png 2>&1 | tail -2
  ffmpeg -loglevel error -y -i /tmp/claude-0/st/${ep}_${n}_0.png -i /tmp/claude-0/st/${ep}_${n}_1.png -i /tmp/claude-0/st/${ep}_${n}_2.png -filter_complex "[0]scale=640:-1[a];[1]scale=640:-1[b];[2]scale=640:-1[c];[a][b][c]hstack=3" /tmp/claude-0/st/${ep}_${n}.png
done
