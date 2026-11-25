import sys, time, os, subprocess; sys.path.insert(0, "/home/user/antre/alat")
P = "/home/user/proyek/siantre"; K = "/home/user/antre/kode/A04/"
subprocess.run(f"cd {P} && git reset -q --hard bab-03 && git clean -qfdx", shell=True)
subprocess.run("/home/user/antre/alat/reset_vs.sh", shell=True)
from rekam_vs import VS
r = VS("/home/user/antre/A04/rek")
def tunggu(cek, maks=90):
    for _ in range(maks * 4):
        if cek(): return
        time.sleep(0.25)
def ke_baris(n): r.tekan("Control+g", 0.4); r.ketik(str(n), 12); r.tekan("Enter", 0.3)
def explorer(): r.kamera(r.kotak(".part.sidebar"), pad=10)
r.mulai(); r.kamera(None); time.sleep(0.6)
r.fokus_terminal(); time.sleep(0.3)
# b06 npm init + express
r.tanda("b06"); r.terminal("npm init -y", tunggu=1.5); r.label("package.json dibuat", 2.5); time.sleep(1.0)
r.tanda("b06_install"); r.ketik("npm install express", 18); r.tekan("Enter", 0.2)
tunggu(lambda: os.path.exists(P + "/node_modules/express/package.json") and os.path.exists(P + "/package-lock.json")); time.sleep(1.5)
r.tanda("b06_pkg"); r.kamera(None); r.fokus_editor(); r.buka("package.json"); r.kamera(r.kotak(".editor-group-container"), pad=0); time.sleep(3.5); r.tanda("b06_akhir")
# b07 node_modules + .gitignore
r.tanda("b07"); explorer(); r.label("node_modules: ribuan berkas pustaka", 3); time.sleep(3.5)
r.kamera(None); r.berkas_baru(".gitignore"); r.kamera_editor(); r.ketik("node_modules/", 12); r.tekan("Control+s", 0.5); time.sleep(0.5)
explorer(); time.sleep(2.5); r.tanda("b07_akhir")
# b08 struktur folder
r.kamera(None); r.fokus_terminal(); time.sleep(0.3)
r.tanda("b08"); r.terminal("mkdir src public db", tunggu=0.6); r.terminal("git mv schema.sql seed.sql db/", tunggu=1.0)
explorer(); r.label("src · public · db", 3); time.sleep(3.0); r.tanda("b08_akhir")
# b09 server.js
r.kamera(None); r.berkas_baru("src/server.js"); r.kamera_editor()
r.tanda("b09"); r.ketik_kode(open(K + "server_a.js").read(), cps=13); r.tekan("Control+s", 0.5); time.sleep(1.0); r.tanda("b09_akhir")
# b10 jalankan
r.kamera(None); r.fokus_terminal(); time.sleep(0.3)
r.tanda("b10"); r.terminal("node src/server.js", tunggu=2.5); r.label("Server menunggu di port 3000", 3); time.sleep(3.0); r.tanda("b10_akhir")
r.tekan("Control+c", 0.6)
# b12 pg + db.js
r.tanda("b12"); r.ketik("npm install pg", 18); r.tekan("Enter", 0.2)
tunggu(lambda: os.path.exists(P + "/node_modules/pg/package.json")); time.sleep(1.5); r.tanda("b12_db")
r.kamera(None); r.berkas_baru("db.js"); r.kamera_editor()
r.ketik_kode(open(K + "db.js").read(), cps=14); r.tekan("Control+s", 0.5); time.sleep(1.0); r.tanda("b12_akhir")
# b13 route layanan
r.kamera(None); r.buka("server.js"); r.kamera(r.kotak(".editor-group-container"), pad=0)
r.tanda("b13"); ke_baris(2); r.tekan("End", 0.2); r.tekan("Enter", 0.2); r.ketik(open(K + "server_import.js").read().strip(), 14); time.sleep(0.5)
ke_baris(11); r.tekan("Home", 0.2); r.kamera_editor(); r.ketik_kode(open(K + "server_route.js").read(), cps=15); r.tekan("Enter", 0.1); r.tekan("Enter", 0.2)
r.tekan("Control+s", 0.5); r.kamera(r.kotak(".editor-group-container"), pad=0); time.sleep(2.0); r.tanda("b13_kode")
r.kamera(None); r.fokus_terminal(); time.sleep(0.3)
r.terminal("DATABASE_URL=postgres://postgres@localhost/antrean node src/server.js", cps=30, tunggu=2.0); r.label("Alamat database lewat environment variable", 3); time.sleep(3.0); r.tanda("b13_akhir")
r.tekan("Control+c", 0.6); subprocess.run('fuser -k 3000/tcp', shell=True)
# b16 commit
r.tekan("Control+l", 0.4); r.kamera_terminal()
r.tanda("b16"); r.terminal("git add .", tunggu=0.6); r.terminal('git commit -m "Server pertama dan route layanan"', tunggu=1.5)
r.label("Commit", 2.5); time.sleep(2.5); r.tanda("b16_akhir"); r.kamera(None); time.sleep(0.8); r.selesai()
subprocess.run(f"cd {P} && git tag -f bab-04", shell=True)
