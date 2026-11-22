#!/bin/bash
# Hidupkan lingkungan kerja typing along SiParkir setelah restart (idempoten).
set -e
TA=/mnt/project-files/siparkir/typing-along
if [ ! -d /home/user/kerja/parkir ]; then mkdir -p /home/user/kerja; tar xzf /mnt/project-files/siparkir/kerja/kerja_sumber.tgz -C /home/user/kerja; fi
ln -sfn /home/user/kerja/parkir /home/user/parkir
mkdir -p /home/user/kerja/ta; cp -r $TA/alat/. /home/user/kerja/ta/ 2>/dev/null || true
[ -f /home/user/kerja/sumber.mp4 ] || cp /mnt/project-files/siparkir/SiParkir_Laravel_dari_Nol.mp4 /home/user/kerja/sumber.mp4
echo "siap; hasil per bab ada di $TA/hasil/"
ls $TA/hasil 2>/dev/null || true
