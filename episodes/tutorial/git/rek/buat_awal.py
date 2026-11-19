"""Buat berkas proyek awal g01..g06-awal.zip untuk halaman Releases (tanpa Gitea, tanpa node_modules)."""
import sys, os, shutil, re, subprocess; sys.path.insert(0, "/home/user/git-seri/rek")
OUT = "/home/user/git-seri/awal"; TMP = "/tmp/awal_kerja"
import proyek
proyek.rumah = lambda *a, **k: None          # jangan sentuh rumah perekam
def jalankan(kode, sumber):
    shutil.rmtree(TMP, ignore_errors=True); R = f"{TMP}/siantre"
    src = sumber.replace('"/home/user/proyek/raka/siantre"', repr(R)).replace('"/home/user/proyek/nadia/siantre"', repr(TMP + "/nadia"))
    src = re.sub(r"^.*copytree\(D \+ \"/node_modules\".*$", "", src, flags=re.M)
    g = {"__name__": "x"}; exec(src, g)
    return R
def kemas(kode, R):
    for p in ["node_modules"]: shutil.rmtree(f"{R}/{p}", ignore_errors=True)
    if os.path.isdir(R + "/.git"):
        subprocess.run(["git", "-C", R, "remote", "remove", "origin"], capture_output=True)
        subprocess.run(["git", "-C", R, "config", "--unset", "branch.main.remote"], capture_output=True)
        subprocess.run(["git", "-C", R, "config", "--unset", "branch.main.merge"], capture_output=True)
        subprocess.run(["git", "-C", R, "gc", "-q"], capture_output=True)
    z = f"{OUT}/{kode}-awal"; 
    if os.path.exists(z + ".zip"): os.remove(z + ".zip")
    shutil.make_archive(z, "zip", os.path.dirname(R), "siantre"); print(kode, os.path.getsize(z + ".zip"))
# g01: folder tanpa Git
shutil.rmtree(TMP, ignore_errors=True); R = f"{TMP}/siantre"; os.makedirs(R + "/public")
for f in ["antrean.js", "server.js", ".env", "package.json", "public/index.html", "public/style.css"]: shutil.copy(f"{proyek.D}/{f}", f"{R}/{f}")
kemas("g01", R)
for k in ["g02", "g03", "g04", "g05"]:
    s = open(f"/home/user/git-seri/rek/siap_{k}.py").read()
    s = re.sub(r"^for r in \[\"siantre\", \"uji\"\].*$", "", s, flags=re.M)
    s = re.sub(r"^for nama in \[\"Raka\", \"Nadia\"\]:\n(    .*\n)+", "", s, flags=re.M)
    s = re.sub(r"^shutil.rmtree\(\"/home/user/proyek/nadia\".*$", "", s, flags=re.M)
    kemas(k, jalankan(k, s))
s = open("/home/user/git-seri/rek/siap_g06.py").read()
s = re.sub(r"^for r in \[\"siantre\", \"uji\"\].*$", "", s, flags=re.M)
s = re.sub(r"^for nama in \[\"Raka\", \"Nadia\"\]:\n(    .*\n)+", "", s, flags=re.M)
s = re.sub(r"^shutil.rmtree\(\"/home/user/proyek/nadia\".*$", "", s, flags=re.M)
a, b = s.split("# server"); b = b[b.index("# Raka:"):]; b = b[:b.index("print(")]
kemas("g06", jalankan("g06", a + b))
