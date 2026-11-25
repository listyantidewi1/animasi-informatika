#!/bin/bash
pkill -f "bin/code-server-4.96.4-linux-amd64/lib/node" ; pkill -f "code-server-4.96.4-linux-amd64/bin/code-server"; sleep 1
rm -rf /tmp/csdata/User/workspaceStorage /tmp/csdata/User/History /tmp/csdata/Backups /tmp/csdata/logs /tmp/csdata/User/globalStorage/state.vscdb*
cp /home/user/git-seri/vscode_settings.json /tmp/csdata/User/settings.json
nohup /home/user/bin/code-server-4.96.4-linux-amd64/bin/code-server --auth none --bind-addr 127.0.0.1:8080 --user-data-dir /tmp/csdata --extensions-dir /tmp/csext --disable-telemetry --disable-update-check --disable-workspace-trust --disable-getting-started-override >/tmp/cs.log 2>&1 &
for i in $(seq 60); do curl -s -o /dev/null http://127.0.0.1:8080/healthz && break; sleep 0.5; done; sleep 1
