"""Rekam G02: restore, amend, revert, reset, reflog."""
import sys, subprocess; sys.path.insert(0, "/home/user/git-seri/rek")
subprocess.run(["python3", "/home/user/git-seri/rek/siap_g02.py"], check=True)
from gs import *
from proyek import git, ganti, tulis, commit
P = "/home/user/proyek/raka/siantre"
g = GS(P, graf_repo=P, tempat=True)
g.lebar_sidebar(170); g.tombol("Control+Backquote", 2.0); g.tinggi_panel(0.56)
g.buka("antrean.js"); g.terminal()
g.mulai("G02")
g.tanda("awal"); time.sleep(1.5)
g.perintah("git log --oneline", tunggu=3.0); g.tanda("awal_log")
# --- restore
g.buka("antrean.js"); g.ke_baris(8); g.tombol("Home", 0.2)
for _ in range(4): g.tombol("Shift+ArrowDown", 0.25)
g.tanda("hapus"); time.sleep(0.8); g.tombol("Delete", 0.8); g.simpan(); time.sleep(1.5); g.tanda("hapus_selesai")
g.terminal(); g.bersih(); g.perintah("git status", tunggu=3.0); g.tanda("restore")
g.perintah("git restore antrean.js", tunggu=3.0); g.tanda("restore_selesai")
# --- amend
g.buka("public/index.html"); g.ke_baris(11, 21); g.tanda("amend_edit"); g.ketik(' class="besar"', 14); g.simpan()
g.buka("public/style.css"); g.tombol("Control+End", 0.4); g.ketik(".besar { font-size: 32px; padding: 24px 48px; }\n", 22); g.simpan(); time.sleep(0.8)
g.terminal(); g.bersih(); g.tanda("amend_commit"); g.perintah("git add public/index.html", tunggu=0.8)
g.perintah('git commit -m "Perbesar tombol ambil nomor"', tunggu=2.0); g.perintah("git status --short", tunggu=2.5); g.tanda("amend_lupa")
g.bersih(); g.perintah("git log --oneline -2", tunggu=2.0); g.tanda("amend_jalan")
g.perintah("git add public/style.css", tunggu=0.8); g.perintah("git commit --amend --no-edit", tunggu=2.0)
g.perintah("git log --oneline -2", tunggu=3.5); g.tanda("amend_selesai")
# --- revert
g.bersih(); g.perintah("git log --oneline", tunggu=2.5); g.tanda("revert_log")
h = git(P, "log", "--format=%h", "--grep", "jam buka", "-1")
g.ketik(f"git revert {h}", 12); g.tanda("revert_tebak"); time.sleep(1.5); g.tombol("Enter", 2.0); g.tanda("revert_jalan")
g.perintah("git log --oneline", tunggu=3.0); g.tanda("revert_log2")
g.bersih(); g.perintah("git diff HEAD~1", tunggu=4.0); g.tanda("revert_selesai")
# --- di luar kamera: dua commit fitur panggil nomor
g.bersih(); time.sleep(0.5); g.tanda("jeda")
tulis(P, "public/petugas.html", "<!doctype html>\n<html lang=\"id\">\n<body>\n  <h1>Halaman Petugas</h1>\n  <button id=\"panggil\">Panggil nomor berikutnya</button>\n</body>\n</html>\n")
commit(P, "Tambah fitur panggil nomor", "2026-11-17T13:10:00+07:00")
ganti(P, "server.js", "app.listen(", "let dipanggil = 0;\napp.post('/api/panggil', (req, res) => {\n  dipanggil = dipanggil + 1;\n  res.json({ dipanggil });\n});\n\napp.listen(")
commit(P, "Tambah API panggil nomor", "2026-11-17T15:45:00+07:00")
time.sleep(2.0); g.tanda("reset_mulai")
g.perintah("git log --oneline", tunggu=3.0); g.tanda("reset_log")
g.ketik("git reset --hard HEAD~3", 12); g.tanda("reset_ketik"); time.sleep(1.0); g.tombol("Enter", 2.0); g.tanda("reset_jalan")
g.perintah("git log --oneline", tunggu=4.0); g.tanda("reset_selesai")
# --- reflog
g.bersih(); g.perintah("git reflog -6", tunggu=4.0); g.tanda("reflog")
h2 = git(P, "rev-parse", "--short", "HEAD@{1}")
g.perintah(f"git reset --hard {h2}", tunggu=2.0); g.perintah("git log --oneline", tunggu=4.0); g.tanda("reflog_selesai")
time.sleep(2.0); g.tanda("akhir")
g.selesai()
