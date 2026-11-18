#!/bin/bash
# Keadaan awal G01: folder SiAntre tanpa Git, belum ada node_modules
rm -rf /home/user/proyek/raka /home/user/rumah/raka; mkdir -p /home/user/proyek/raka/siantre/public /home/user/rumah/raka
D=/home/user/git-seri/siantre_dasar; T=/home/user/proyek/raka/siantre
cp $D/antrean.js $D/server.js $D/.env $T/; cp $D/public/index.html $D/public/style.css $T/public/
