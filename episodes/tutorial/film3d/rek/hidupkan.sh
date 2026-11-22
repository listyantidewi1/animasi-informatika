#!/bin/bash
# Menyalakan lagi lingkungan rekaman setelah mesin cloud mati (berkas tetap ada, proses hilang).
# Setelah ini: antre job "atur_terminal" (lihat rek/README di catatan memori), lalu `claude --continue` di tab claude.
pgrep Xvfb >/dev/null || (nohup Xvfb :99 -screen 0 2560x1440x24 >/tmp/xvfb.log 2>&1 &)
source /home/user/animasi-informatika/episodes/tutorial/vibe/env.sh
curl -s -o /dev/null http://127.0.0.1:8080/ || (nohup env -i $CLEANENV DISPLAY=:99 /opt/cs/node_modules/.bin/code-server --auth none --bind-addr 127.0.0.1:8080 --disable-telemetry --disable-update-check --disable-workspace-trust /home/user/proyek/paket-terakhir > /tmp/cs.log 2>&1 &)
sleep 6
mkdir -p /tmp/sesi/q /tmp/sesi/done; rm -f /tmp/sesi/q/*.py
pgrep -f "python3 server.py" >/dev/null || (cd "$(dirname "$0")" && nohup python3 server.py > /tmp/sesi/server.out 2>&1 &)
sleep 20; tail -1 /tmp/sesi/log.txt
