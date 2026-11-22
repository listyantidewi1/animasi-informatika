#!/bin/bash
# Satu perintah untuk menyiapkan ulang lingkungan rekam SiAntre (idempoten; aman dijalankan berkali-kali).
set -u
PROD=$(cd "$(dirname "$0")/.." && pwd); mkdir -p /tmp/claude-0 /home/user/proyek
[ -e /home/user/antre ] || ln -s "$PROD" /home/user/antre
python3 -c "import cv2, PIL, playwright, numpy" 2>/dev/null || pip install -q opencv-python-headless pillow numpy playwright==1.63.0
# code-server
if [ ! -x /home/user/cs/node_modules/.bin/code-server ]; then
  dpkg -s libkrb5-dev >/dev/null 2>&1 || (apt-get update -q; apt-get install -y -q libkrb5-dev) >/dev/null
  mkdir -p /tmp/vscode-ripgrep-cache-1.15.14
  [ -s /tmp/vscode-ripgrep-cache-1.15.14/ripgrep-v13.0.0-13-x86_64-unknown-linux-musl.tar.gz ] || curl -sL -o /tmp/vscode-ripgrep-cache-1.15.14/ripgrep-v13.0.0-13-x86_64-unknown-linux-musl.tar.gz https://github.com/microsoft/ripgrep-prebuilt/releases/download/v13.0.0-13/ripgrep-v13.0.0-13-x86_64-unknown-linux-musl.tar.gz
  mkdir -p /home/user/cs && (cd /home/user/cs && npm i --unsafe-perm code-server@4.105.1 >/tmp/claude-0/cs_install.log 2>&1)
fi
mkdir -p /root/.local/share/code-server/User
cp "$PROD/../vscode_settings.json" /root/.local/share/code-server/User/settings.json
cp "$PROD/../terminal.rc" /home/user/proyek/.rc
# PostgreSQL 16
PGB=/usr/lib/postgresql/16/bin
if [ ! -d /home/user/pg/data ]; then mkdir -p /home/user/pg && chown postgres /home/user/pg && su postgres -c "$PGB/initdb -D /home/user/pg/data -A trust -E UTF8 >/dev/null"; fi
su postgres -c "$PGB/pg_ctl -D /home/user/pg/data status" >/dev/null 2>&1 || { rm -f /home/user/pg/data/postmaster.pid; mkdir -p /var/run/postgresql; chown postgres /var/run/postgresql; su postgres -c "$PGB/pg_ctl -D /home/user/pg/data -l /home/user/pg/log -w start" >/dev/null; }
# Xvfb
pgrep -x Xvfb >/dev/null || (nohup Xvfb :99 -screen 0 2560x1440x24 >/dev/null 2>&1 &)
# repo proyek dari bundle (hanya bila belum ada)
if [ ! -d /home/user/proyek/siantre/.git ]; then git clone -q /mnt/project-files/antrean/repo/siantre.bundle /home/user/proyek/siantre && (cd /home/user/proyek/siantre && git fetch -q --tags origin; git checkout -q -B main bab-12; git remote remove origin); fi
git -C /home/user/proyek/siantre fetch -q /mnt/project-files/antrean/repo/siantre.bundle 'refs/tags/*:refs/asli/*'  # tag asli untuk pembanding
echo "env siap: $(ls /home/user/cs/node_modules/.bin/code-server 2>&1) | pg $(psql -U postgres -Atc 'select 1' 2>&1) | tag $(cd /home/user/proyek/siantre && git tag | wc -l)"
# Proyek contoh "kode AI" (port 4000, DB antrean_ai) dan aplikasi jadi untuk demo (port 3001, DB siantre_demo)
if [ ! -d /home/user/proyek/antrean-ai/node_modules ]; then mkdir -p /home/user/proyek/antrean-ai && cp "$PROD/antrean-ai/server.js" /home/user/proyek/antrean-ai/ && (cd /home/user/proyek/antrean-ai && npm init -y >/dev/null && npm i express pg >/dev/null 2>&1); fi
psql -U postgres -tAc "select 1 from pg_database where datname='antrean_ai'" | grep -q 1 || createdb -U postgres antrean_ai
psql -U postgres -d antrean_ai -qc "CREATE TABLE IF NOT EXISTS tiket (id serial PRIMARY KEY, nomor int NOT NULL, dibuat timestamptz DEFAULT now())"
D=/home/user/proyek/siantre-demo
if [ ! -d $D/node_modules ]; then rm -rf $D; cp -r "$PROD/../siantre" $D && sed -i "s/app.listen(3000,/app.listen(process.env.PORT || 3000,/" $D/src/server.js && (cd $D && npm i >/dev/null 2>&1); fi
if ! psql -U postgres -tAc "select 1 from pg_database where datname='siantre_demo'" | grep -q 1; then
  createdb -U postgres siantre_demo && psql -U postgres -d siantre_demo -qc "ALTER DATABASE siantre_demo SET timezone='Asia/Jakarta'" && (cd $D && psql -q -U postgres -d siantre_demo -f db/schema.sql -f db/seed.sql >/dev/null && DATABASE_URL=postgres://postgres@localhost/siantre_demo node db/pengguna.js >/dev/null)
fi
curl -s -o /dev/null localhost:3001/ || (cd $D && PORT=3001 DATABASE_URL=postgres://postgres@localhost/siantre_demo SESSION_SECRET=demo setsid nohup node src/server.js > /tmp/claude-0/demo.log 2>&1 < /dev/null &)
sleep 1; echo "demo 3001: $(curl -s -o /dev/null -w '%{http_code}' localhost:3001/)"
psql -U postgres -d antrean_ai -q <<'SQL'
CREATE TABLE IF NOT EXISTS tiket_pelanggan (id int PRIMARY KEY, label text, nama text, hp text, status text);
INSERT INTO tiket_pelanggan VALUES (121,'A-021','Budi Santoso','0812-5550-0121','selesai'),(122,'B-007','Siti Rahayu','0813-5550-0122','menunggu'),
 (123,'A-022','Agus Wijaya','0857-5550-0123','menunggu'),(124,'A-023','Rina Kartika','0821-5550-0124','menunggu'),(125,'C-004','Hendra Gunawan','0878-5550-0125','menunggu'),
 (126,'B-008','Wulan Sari','0838-5550-0126','menunggu'),(127,'A-024','Yoga Pratama','0896-5550-0127','menunggu') ON CONFLICT DO NOTHING;
SQL
# Bab 12: Docker, CA demo lokal + sertifikat antre.bengkelmajujaya.test, dipercaya Chromium (NSS)
docker info >/dev/null 2>&1 || { (setsid nohup dockerd > /tmp/claude-0/dockerd.log 2>&1 < /dev/null &); sleep 8; }
H=antre.bengkelmajujaya.test; CA=/home/user/ca; L=/etc/letsencrypt/live/$H
if [ ! -s $L/fullchain.pem ]; then
  mkdir -p $CA $L && cd $CA
  openssl req -x509 -newkey rsa:2048 -nodes -days 3650 -subj "/CN=CA Demo Lokal SiAntre" -keyout ca.key -out ca.pem 2>/dev/null
  openssl req -newkey rsa:2048 -nodes -subj "/CN=$H" -keyout $L/privkey.pem -out h.csr 2>/dev/null
  printf "subjectAltName=DNS:$H\nbasicConstraints=CA:FALSE\n" > ext.cnf
  openssl x509 -req -in h.csr -CA ca.pem -CAkey ca.key -CAcreateserial -days 825 -extfile ext.cnf -out $L/cert.pem 2>/dev/null
  cat $L/cert.pem ca.pem > $L/fullchain.pem; cd - >/dev/null
fi
mkdir -p /tmp/claude-0/ca && cp $CA/ca.pem /tmp/claude-0/ca/ca.pem
grep -q "$H" /etc/hosts || echo "127.0.0.1 $H" >> /etc/hosts
mkdir -p /root/.pki/nssdb; [ -f /root/.pki/nssdb/cert9.db ] || certutil -d sql:/root/.pki/nssdb -N --empty-password
certutil -d sql:/root/.pki/nssdb -L 2>/dev/null | grep -q "CA Demo SiAntre" || certutil -d sql:/root/.pki/nssdb -A -t "C,," -n "CA Demo SiAntre" -i $CA/ca.pem
echo "docker: $(docker info 2>/dev/null | grep -c 'Server Version') | sertifikat: $(ls $L | wc -l) berkas"
