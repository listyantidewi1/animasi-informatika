import sys, json, base64, urllib.request; sys.path.insert(0, "/home/user/git-seri/rek")
from proyek import *
def api(m, path, d=None):
    rq = urllib.request.Request("http://127.0.0.1:3000/api/v1" + path, method=m, data=json.dumps(d).encode() if d else None,
        headers={"Content-Type": "application/json", "Authorization": "Basic " + base64.b64encode(b"raka:siantre123").decode()})
    try: return urllib.request.urlopen(rq).status
    except Exception as e: return getattr(e, "code", e)
for r in ["siantre", "uji"]: api("DELETE", f"/repos/raka/{r}")
R = "/home/user/proyek/raka/siantre"
for nama in ["Raka", "Nadia"]:
    rumah(nama, f"{nama.lower()}@majujaya.id"); h = f"/home/user/rumah/{nama.lower()}"
    open(h + "/.gitconfig", "a").write("[credential]\n\thelper = store\n")
    open(h + "/.git-credentials", "w").write(f"http://{nama.lower()}:siantre123@localhost:3000\n"); os.chmod(h + "/.git-credentials", 0o600)
shutil.rmtree("/home/user/proyek/nadia", ignore_errors=True); os.makedirs("/home/user/proyek/nadia")
dasar_g01(R)
shutil.copy(D + "/package.json", R + "/package.json"); commit(R, "Tambahkan package.json", "2026-11-11T10:20:00+07:00")
shutil.copytree(D + "/node_modules", R + "/node_modules", symlinks=True)
tulis(R, "public/tv.html", "<!doctype html>\n<html lang=\"id\">\n<body>\n  <h1>Nomor dipanggil</h1>\n  <div id=\"nomor\">-</div>\n  <script src=\"tv.js\"></script>\n</body>\n</html>\n")
tulis(R, "public/tv.js", "// Layar TV SiAntre\nconst layar = document.getElementById('nomor');\n\nasync function perbarui() {\n  const data = await (await fetch('/api/info')).json();\n  layar.textContent = data.dipanggil;\n}\nsetInterval(perbarui, 2000);\n")
commit(R, "Tambah halaman TV", "2026-11-13T14:10:00+07:00")
print(git(R, "log", "--oneline"))
