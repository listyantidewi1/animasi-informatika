"""Pembantu menyiapkan keadaan repo SiAntre di luar kamera (commit dengan tanggal yang wajar)."""
import subprocess, os, shutil
D = "/home/user/git-seri/siantre_dasar"
def git(repo, *a, nama="Raka", email="raka@majujaya.id", tgl=None, check=True):
    env = dict(os.environ, GIT_CONFIG_GLOBAL="/dev/null", GIT_AUTHOR_NAME=nama, GIT_AUTHOR_EMAIL=email, GIT_COMMITTER_NAME=nama, GIT_COMMITTER_EMAIL=email, GIT_EDITOR="true")
    if tgl: env.update(GIT_AUTHOR_DATE=tgl, GIT_COMMITTER_DATE=tgl)
    return subprocess.run(["git", "-C", repo, *a], env=env, check=check, capture_output=True, text=True).stdout.strip()
def tulis(repo, path, isi):
    f = os.path.join(repo, path); os.makedirs(os.path.dirname(f), exist_ok=True); open(f, "w").write(isi)
def ganti(repo, path, lama, baru):
    f = os.path.join(repo, path); s = open(f).read(); assert lama in s, (path, lama); open(f, "w").write(s.replace(lama, baru, 1))
def commit(repo, pesan, tgl, *berkas, **k):
    git(repo, "add", *(berkas or ["-A"])); git(repo, "commit", "-q", "-m", pesan, tgl=tgl, **k)
def dasar_g01(repo):
    """Keadaan akhir G01: dua commit."""
    if os.path.exists(repo): shutil.rmtree(repo)
    os.makedirs(repo + "/public")
    for f in ["antrean.js", "server.js", ".env", "public/index.html", "public/style.css"]: shutil.copy(f"{D}/{f}", f"{repo}/{f}")
    tulis(repo, ".gitignore", ".env\nnode_modules/\n")
    git(repo, "init", "-q", "-b", "main")
    commit(repo, "Buat kerangka SiAntre", "2026-11-10T09:14:00+07:00", "antrean.js", "server.js", "public", ".gitignore")
    ganti(repo, "antrean.js", "return 'A' + n;", "return 'A' + String(n).padStart(3, '0');")
    commit(repo, "Ubah format nomor menjadi tiga digit", "2026-11-10T09:40:00+07:00")
def rumah(nama, email):
    h = f"/home/user/rumah/{nama.lower()}"; shutil.rmtree(h, ignore_errors=True); os.makedirs(h)
    open(h + "/.gitconfig", "w").write(f"[user]\n\tname = {nama}\n\temail = {email}\n[pull]\n\trebase = false\n" if False else f"[user]\n\tname = {nama}\n\temail = {email}\n")
