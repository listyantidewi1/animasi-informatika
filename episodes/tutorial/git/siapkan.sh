#!/bin/bash
# Nyalakan Xvfb :99, code-server :8080, server graf :7070, Gitea :3000
pgrep -f "Xvfb :99" >/dev/null || (Xvfb :99 -screen 0 2560x1440x24 -nolisten tcp >/tmp/xvfb.log 2>&1 &)
mkdir -p /tmp/csdata/User; cp /home/user/git-seri/vscode_settings.json /tmp/csdata/User/settings.json
pgrep -f "code-server-4.96.4" >/dev/null || (nohup /home/user/bin/code-server-4.96.4-linux-amd64/bin/code-server --auth none --bind-addr 127.0.0.1:8080 --user-data-dir /tmp/csdata --extensions-dir /tmp/csext --disable-telemetry --disable-update-check --disable-workspace-trust --disable-getting-started-override >/tmp/cs.log 2>&1 &)
pgrep -f "graf/server.js" >/dev/null || (cd /home/user/git-seri/graf && nohup /opt/node22/bin/node server.js >/tmp/graf.log 2>&1 &)
sleep 3; curl -s -o /dev/null -w "cs %{http_code}\n" http://127.0.0.1:8080/
