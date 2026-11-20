#!/bin/bash
# Salin alat produksi SiPinjam (tanpa mkv/mp4/mp3) ke repo animasi-informatika untuk PR.
set -e
S=/home/user/pinjam; T=/home/user/animasi-informatika/episodes/sipinjam/produksi
rm -rf "$T"; mkdir -p "$T"/{akhir,alat,bahan,naskah,thumbnail}
for B in P00 P01 P02 P03 P04 P05 P06 P07 P08 P09 P10 P11 P12 P13; do
  mkdir -p "$T/$B"
  for f in "$S/$B"/*.py "$S/$B"/adegan.js "$S/$B"/waktu.json; do [ -f "$f" ] && cp "$f" "$T/$B/"; done
done
cp -r "$S"/alat/. "$T/alat/"; rm -rf "$T/alat/__pycache__"; rm -f "$T"/alat/antre.sh "$T"/alat/antre2.sh "$T"/alat/antre_rakit.sh "$T"/alat/antre_rakit2.sh "$T"/alat/antre_rakit3.sh
cp "$S"/bahan/*.png "$T/bahan/"
cp "$S"/naskah/*.txt "$T/naskah/"
cp "$S"/akhir/{chapter.txt,metadata.md,cara-push-tag.md,daftar-periksa-kode-ai.md,SiPinjam_PHP_MySQL_dari_Nol.srt} "$T/akhir/"
cp "$S"/akhir/thumbnail.png "$T/thumbnail/"
find "$T" -type f \( -name '*.mkv' -o -name '*.mp4' -o -name '*.mp3' -o -name '*.wav' \) -delete
du -sh "$T"; find "$T" -type f | wc -l
