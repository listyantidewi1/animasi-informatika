#!/bin/bash
# Hook SessionStart untuk sesi cloud Claude Code: memasang alat produksi yang tidak ada di kontainer bawaan
# (lihat episodes/_alat/README.md, bagian Kebutuhan). Di laptop (bukan sesi cloud) hook ini tidak berbuat apa-apa.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi
cd "${CLAUDE_PROJECT_DIR:-.}"

# Playwright untuk Python harus seversi dengan Chromium bawaan kontainer (yang dipasang untuk Node), kalau tidak
# browsernya tidak ditemukan. Ambil versinya dari paket Node; bila tidak ada, pakai versi yang diketahui cocok.
PW_VER=$(node -e "console.log(require('playwright/package.json').version)" 2>/dev/null || echo "1.63.0")
# pip selesai dalam 1-2 detik bila semuanya sudah terpasang, jadi aman dijalankan tiap sesi.
PIP_ROOT_USER_ACTION=ignore python3 -m pip install --quiet --user --disable-pip-version-check "playwright==${PW_VER}" edge-tts numpy

# Pemeriksaan alat lain: hanya peringatan, sesi tetap jalan. (grep tanpa -q agar ffmpeg/fc-list tidak kena SIGPIPE di bawah pipefail.)
python3 -c "import playwright, edge_tts, numpy" 2>/dev/null || echo "peringatan: modul Python (playwright/edge_tts/numpy) belum bisa diimpor" >&2
ffmpeg -hide_banner -filters 2>/dev/null | grep rubberband >/dev/null || echo "peringatan: ffmpeg tanpa filter rubberband (voice.py butuh ini)" >&2
fc-list 2>/dev/null | grep -i "inter" >/dev/null || echo "peringatan: font Inter tidak ditemukan (dipakai di video)" >&2
echo "alat produksi siap: playwright ${PW_VER}, edge-tts, numpy, ffmpeg+rubberband, font Inter"
