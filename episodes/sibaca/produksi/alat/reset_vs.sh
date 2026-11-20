#!/bin/bash
# Mulai ulang code-server dengan terminal segar dan lingkungan bersih (tanpa variabel agen AI).
pkill -f code-server; sleep 1.5
D=${DIR:-/home/user/proyek/sibaca}; mkdir -p $D
rm -rf /root/.local/share/code-server/User/workspaceStorage /root/.local/share/code-server/User/History /root/.local/share/code-server/User/Backups
cd $D
nohup env -i HOME=/root USER=root SHELL=/bin/bash TERM=xterm-256color LANG=C.UTF-8 PROYEK_DIR=$D \
  PATH=/root/.config/composer/vendor/bin:/usr/local/bin:/usr/bin:/bin:/opt/node22/bin \
  HTTPS_PROXY=$HTTPS_PROXY https_proxy=$HTTPS_PROXY HTTP_PROXY=$HTTP_PROXY http_proxy=$HTTP_PROXY NO_PROXY=localhost,127.0.0.1 no_proxy=localhost,127.0.0.1 \
  SSL_CERT_FILE=/root/.ccr/ca-bundle.crt NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
  /home/user/cs/node_modules/.bin/code-server --auth none --bind-addr 127.0.0.1:8080 --disable-telemetry --disable-update-check --disable-workspace-trust --disable-getting-started-override $D > /tmp/claude-0/cs.log 2>&1 &
for i in $(seq 40); do curl -s --noproxy '*' localhost:8080/healthz >/dev/null && break; sleep 0.5; done; sleep 1
