#!/bin/bash
# Jalankan perintah dengan lingkungan bersih (tanpa variabel agen AI): bersih.sh <folder> <perintah...>
D=$1; shift
cd $D && env -i HOME=/root USER=root TERM=xterm-256color LANG=C.UTF-8 COMPOSER_ALLOW_SUPERUSER=1 \
  PATH=/root/.config/composer/vendor/bin:/usr/local/bin:/usr/bin:/bin:/opt/node22/bin \
  HTTPS_PROXY=$HTTPS_PROXY https_proxy=$HTTPS_PROXY HTTP_PROXY=$HTTP_PROXY http_proxy=$HTTP_PROXY NO_PROXY=localhost,127.0.0.1 no_proxy=localhost,127.0.0.1 \
  SSL_CERT_FILE=/root/.ccr/ca-bundle.crt NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt bash -c "$*"
