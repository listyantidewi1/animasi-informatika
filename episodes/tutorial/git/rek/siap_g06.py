"""Siapkan G06: repo SiAntre di Gitea dengan riwayat pesan "fix/update" (kait), Raka di branch perbaikan,
tiga perubahan belum di-commit; Nadia di branch fitur/tv-suara dengan tv.js setengah jadi; main berisi bug jam buka."""
import sys, json, base64, urllib.request, os, shutil; sys.path.insert(0, "/home/user/git-seri/rek")
from proyek import *
def api(m, path, d=None, u="raka"):
    rq = urllib.request.Request("http://127.0.0.1:3000/api/v1" + path, method=m, data=json.dumps(d).encode() if d else None,
        headers={"Content-Type": "application/json", "Authorization": "Basic " + base64.b64encode(f"{u}:siantre123".encode()).decode()})
    try:
        r = urllib.request.urlopen(rq); b = r.read(); return json.loads(b) if b else r.status
    except Exception as e: return getattr(e, "code", e)
for r in ["siantre", "uji"]: api("DELETE", f"/repos/raka/{r}")
R = "/home/user/proyek/raka/siantre"; N = "/home/user/proyek/nadia/siantre"
for nama in ["Raka", "Nadia"]:
    rumah(nama, f"{nama.lower()}@majujaya.id"); h = f"/home/user/rumah/{nama.lower()}"
    open(h + "/.gitconfig", "a").write("[credential]\n\thelper = store\n[pull]\n\trebase = false\n")
    open(h + "/.git-credentials", "w").write(f"http://{nama.lower()}:siantre123@localhost:3000\n"); os.chmod(h + "/.git-credentials", 0o600)
shutil.rmtree("/home/user/proyek/nadia", ignore_errors=True); os.makedirs("/home/user/proyek/nadia")
dasar_g01(R)
shutil.copy(D + "/package.json", R + "/package.json"); commit(R, "Tambahkan package.json", "2026-11-11T10:20:00+07:00")
shutil.copytree(D + "/node_modules", R + "/node_modules", symlinks=True)
tulis(R, "README.md", "# SiAntre\n\nAplikasi antrean sederhana.\n\n## Cara menjalankan\n\n1. npm install\n2. node server.js\n")
commit(R, "Tambah README", "2026-11-11T11:00:00+07:00")
tulis(R, "public/tv.html", "<!doctype html>\n<html lang=\"id\">\n<body>\n  <h1>Nomor dipanggil</h1>\n  <div id=\"nomor\">-</div>\n  <script src=\"tv.js\"></script>\n</body>\n</html>\n")
tulis(R, "public/tv.js", "// Layar TV SiAntre\nconst layar = document.getElementById('nomor');\n\nasync function perbarui() {\n  const data = await (await fetch('/api/info')).json();\n  layar.textContent = data.dipanggil;\n}\nsetInterval(perbarui, 2000);\n")
commit(R, "Tambah halaman TV", "2026-11-12T14:10:00+07:00")
# riwayat yang sulit dibaca (untuk kait)
sampah = [("fix", "h1 { color: #1d3a8a; }", "h1 { color: #1e3a8a; }"), ("update", "background: #f3f5fa;", "background: #f2f5fa;"),
          ("coba lagi", "border-radius: 12px;", "border-radius: 10px;"), ("fix", "border-radius: 10px;", "border-radius: 12px;"),
          ("update", "margin-top: 24px;", "margin-top: 20px;"), ("fix lagi", "margin-top: 20px;", "margin-top: 24px;"),
          ("coba lagi", "h1 { color: #1e3a8a; }", "h1 { color: #1d3a8a; }"), ("final", "background: #f2f5fa;", "background: #f3f5fa;")]
for i, (m, a, b) in enumerate(sampah):
    ganti(R, "public/style.css", a, b); commit(R, m, f"2026-11-{13 + i // 3:02d}T{9 + (i % 3) * 3:02d}:1{i}:00+07:00")
ganti(R, "server.js", "const JAM_BUKA = '08.00';", "const JAM_BUKA = '80.00';"); commit(R, "update", "2026-11-16T16:20:00+07:00")
# server
rq = api("POST", "/user/repos", {"name": "siantre", "default_branch": "main"}); print("repo", type(rq))
git(R, "remote", "add", "origin", "http://localhost:3000/raka/siantre.git")
subprocess.run(["git", "-C", R, "push", "-q", "-u", "http://raka:siantre123@localhost:3000/raka/siantre.git", "main"], check=True,
               env=dict(os.environ, GIT_CONFIG_GLOBAL="/dev/null"))
git(R, "fetch", "-q", "origin"); git(R, "branch", "-u", "origin/main", "main")
api("PUT", "/repos/raka/siantre/collaborators/nadia", {"permission": "write"})
# Nadia: clone + branch fitur suara, tv.js setengah jadi
subprocess.run(["git", "clone", "-q", "http://localhost:3000/raka/siantre.git", N], check=True,
               env=dict(os.environ, GIT_CONFIG_GLOBAL="/dev/null", HOME="/home/user/rumah/nadia"))
git(N, "switch", "-q", "-c", "fitur/tv-suara", nama="Nadia", email="nadia@majujaya.id")
ganti(N, "public/tv.js", "  layar.textContent = data.dipanggil;\n", "  layar.textContent = data.dipanggil;\n  // TODO: bunyikan suara saat nomor berganti\n  const bunyi = new Audio('/ding.mp3');\n")
# Raka: branch perbaikan, tiga perubahan sekaligus
git(R, "switch", "-q", "-c", "perbaikan/nomor-harian")
ganti(R, "README.md", "2. node server.js\n", "2. node server.js\n3. Buka http://localhost:3001, lalu tekan tombol Ambil Nomor.\n")
ganti(R, "antrean.js", "let nomorTerakhir = 0;\n", "let nomorTerakhir = 0;\nlet tanggalTerakhir = '';\n")
ganti(R, "antrean.js", "function ambilNomor() {\n", "function ambilNomor() {\n  const hariIni = new Date().toDateString();\n  if (hariIni !== tanggalTerakhir) { nomorTerakhir = 0; tanggalTerakhir = hariIni; }\n")
ganti(R, "public/style.css", "button { font-size: 24px; padding: 16px 32px;", "button { font-size: 32px; padding: 24px 48px;")
print(git(R, "log", "--oneline", "-3")); print(git(R, "status", "--short")); print(git(N, "status", "--short"))
