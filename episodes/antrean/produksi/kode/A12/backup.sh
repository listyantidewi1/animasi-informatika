#!/bin/sh
# Backup setiap malam (cron: 0 2 * * *). Simpan tujuh hari, salin ke luar server.
set -e
cd "$(dirname "$0")/.."
mkdir -p backup
docker compose exec -T db pg_dump -U postgres antrean | gzip > backup/antrean-$(date +%F).sql.gz
find backup -name '*.sql.gz' -mtime +7 -delete
# rclone copy backup cadangan:siantre   # tujuan di luar server, misalnya penyimpanan cloud
