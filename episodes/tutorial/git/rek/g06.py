"""Rekam G06: riwayat berantakan, commit raksasa -> reset --soft + add -p, stash (Nadia), pull --rebase, tag rilis."""
import sys, subprocess; sys.path.insert(0, "/home/user/git-seri/rek")
subprocess.run(["python3", "/home/user/git-seri/rek/siap_g06.py"], check=True, capture_output=True)
from gs import *
from proyek import git
import siap_g06 as S6
P = "/home/user/proyek/raka/siantre"; GT = "http://localhost:3000"
g = GS(P, graf_repo=P, tempat=False, web=GT + "/user/login", web_dsf=2.08)
LUAR = W + 60
def tampil_web():
    g.web.letak(0, 0, W, H); g.vs.letak(LUAR, 0, W, H); g.graf.letak(LUAR, 0, W - 1600, H); time.sleep(1.0)
def tampil_vs():
    g.vs.letak(0, 0, W, H); g.graf.letak(LUAR, 0, W - 1600, H); g.web.letak(LUAR, 0, W, H); time.sleep(1.0)
pg = g.web.pg; pg.goto(GT + "/user/login"); pg.fill("#user_name", "raka"); pg.fill("#password", "siantre123"); pg.click("form button.primary"); pg.wait_for_load_state()
tampil_vs()
g.sidebar(False); g.tombol("Control+Backquote", 2.0); g.tinggi_panel(0.62)
g.buka("antrean.js"); g.terminal()
g.palet("Terminal: Split Terminal"); time.sleep(2.0)
g.ketik("exec bash --rcfile /home/user/proyek/nadia.rc", 40); g.tombol("Enter", 2.0)
g.terminal(0); g.bersih()
g.mulai("G06")
g.tanda("awal"); time.sleep(1.0)
# --- kait: riwayat yang sulit dibaca
g.perintah("git log --oneline", tunggu=4.0); g.tanda("kait_log")
# --- commit raksasa
g.bersih(); g.tanda("raksasa"); g.perintah("git status --short", tunggu=2.0)
g.perintah("git add .", tunggu=0.8); g.perintah('git commit -m "update"', tunggu=1.5)
g.perintah("git show --stat --oneline HEAD", tunggu=3.5); g.tanda("raksasa_selesai")
# --- perbaikan: reset --soft + add -p
g.bersih(); g.tanda("pecah"); g.perintah("git reset --soft HEAD~1", tunggu=1.0); g.perintah("git status --short", tunggu=2.0); g.tanda("pecah_soft")
g.perintah("git restore --staged .", tunggu=1.0); g.tinggi_panel(0.86); g.terminal(0); g.bersih(); time.sleep(0.5); g.tanda("addp")
g.perintah("git add -p", tunggu=3.5); g.tanda("addp_1")
g.ketik("n", 4); time.sleep(0.6); g.tombol("Enter", 3.5); g.tanda("addp_2")
g.ketik("y", 4); time.sleep(0.6); g.tombol("Enter", 3.5); g.tanda("addp_3")
g.ketik("n", 4); time.sleep(0.6); g.tombol("Enter", 1.5); g.tanda("addp_selesai")
g.tinggi_panel(0.62); g.terminal(0)
g.bersih(); g.perintah('git commit -m "fix: nomor antrean kembali ke 1 setiap hari"', tunggu=2.0); g.tanda("commit_fix")
g.perintah("git add README.md", tunggu=0.6); g.perintah('git commit -m "docs: tambah langkah memakai aplikasi"', tunggu=1.5)
g.perintah('git commit -am "feat: perbesar tombol ambil nomor"', tunggu=1.5)
g.bersih(); g.perintah("git log --oneline -4", tunggu=4.0); g.tanda("rapi")
# --- stash oleh Nadia
g.terminal(1); g.bersih(); g.tanda("stash")
g.perintah("git status --short", tunggu=2.0); g.perintah("git stash", tunggu=2.0); g.perintah("git status --short", tunggu=1.5); g.tanda("stash_simpan")
g.perintah("git switch main", tunggu=1.5)
g.perintah("sed -i \"s/'80.00'/'08.00'/\" server.js", tunggu=1.0)
g.perintah('git commit -am "fix: perbaiki salah ketik jam buka"', tunggu=1.5); g.perintah("git push", tunggu=4.0); g.tanda("stash_fix")
g.bersih(); g.perintah("git switch fitur/tv-suara", tunggu=1.5); g.perintah("git stash pop", tunggu=3.5); g.tanda("stash_pop")
# --- Raka tertinggal dari main
g.terminal(0); g.bersih(); g.tanda("tertinggal")
g.perintah("git fetch", tunggu=3.0); g.perintah("git log --oneline --graph --all -6", tunggu=3.0); g.tanda("tebak")
time.sleep(1.0)
g.bersih(); g.tanda("rebase"); g.perintah("git pull --rebase origin main", tunggu=4.0)
g.perintah("git log --oneline --graph -5", tunggu=4.5); g.tanda("rebase_selesai")
# --- di luar kamera: push branch, pull request, merge di Gitea
g.tanda("jeda")
subprocess.run(["git", "-C", P, "push", "-q", "-u", "origin", "perbaikan/nomor-harian"], check=True,
               env=dict(os.environ, GIT_CONFIG_GLOBAL="/home/user/rumah/raka/.gitconfig", HOME="/home/user/rumah/raka"))
pr = S6.api("POST", "/repos/raka/siantre/pulls", {"title": "Nomor antrean kembali ke 1 setiap hari", "head": "perbaikan/nomor-harian", "base": "main"})
n = pr["number"] if isinstance(pr, dict) else 1
ujung = git(P, "rev-parse", "HEAD")
for k in range(30):  # tunggu Gitea selesai memeriksa PR, lalu pastikan main benar-benar maju
    time.sleep(1.0); info = S6.api("GET", f"/repos/raka/siantre/pulls/{n}")
    if isinstance(info, dict) and info.get("mergeable") and not info.get("merged"):
        print("merge", S6.api("POST", f"/repos/raka/siantre/pulls/{n}/merge", {"Do": "rebase"}, u="nadia"))
    br = S6.api("GET", "/repos/raka/siantre/branches/main")
    if isinstance(br, dict) and br["commit"]["id"] == ujung: break
print("main di server", br["commit"]["id"][:7] if isinstance(br, dict) else br, "ujung", ujung[:7])
time.sleep(1.5); g.tanda("tag_mulai")
# --- tag dan rilis
g.bersih(); g.perintah("git switch main", tunggu=1.5); g.perintah("git pull", tunggu=4.0); g.tanda("tag_pull")
g.bersih(); g.perintah('git tag -a v1.0.0 -m "Rilis pertama SiAntre"', tunggu=1.0); g.perintah("git push origin v1.0.0", tunggu=4.0)
g.perintah("git log --oneline --decorate -4", tunggu=4.0); g.tanda("tag_selesai")
pg.goto(GT + "/raka/siantre/tags"); time.sleep(1.5); tampil_web(); time.sleep(3.5); g.tanda("tag_web")
time.sleep(1.5); g.tanda("akhir")
g.selesai()
