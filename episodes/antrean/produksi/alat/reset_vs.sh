#!/bin/bash
# Mulai ulang code-server dengan terminal segar. $1=kosong -> kosongkan isi proyek.
pkill -f code-server; sleep 1.5
D=${DIR:-/home/user/proyek/siantre}; mkdir -p $D
[ "$1" = kosong ] && find $D -mindepth 1 -delete
rm -rf /root/.local/share/code-server/User/workspaceStorage /root/.local/share/code-server/User/History
cd $D; export PROYEK_DIR=$D
LANG=C.UTF-8 nohup /home/user/cs/node_modules/.bin/code-server --auth none --bind-addr 127.0.0.1:8080 --disable-telemetry --disable-update-check --disable-workspace-trust --disable-getting-started-override $D > /tmp/claude-0/cs.log 2>&1 &
for i in $(seq 30); do curl -s localhost:8080/healthz >/dev/null && break; sleep 0.5; done; sleep 1
