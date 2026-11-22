import sys, time, os, subprocess; sys.path.insert(0, "/home/user/antre/alat")
P = "/home/user/proyek/siantre"; K = "/home/user/antre/kode/A08/"
subprocess.run(f"cd {P} && git reset -q --hard bab-07 && git clean -qfd", shell=True)
subprocess.run(f"psql -U postgres -d antrean -qc 'DELETE FROM ticket_events; DELETE FROM users' -f /home/user/antre/kode/A06/isi-antrean.sql", shell=True)
subprocess.run("/home/user/antre/alat/reset_vs.sh", shell=True)
from rekam_vs import VS
r = VS("/home/user/antre/A08/rek")
def baris_ke(path, teks):
    r.tekan("Control+s", 0.3)  # simpan dulu supaya nomor baris di disk sama dengan di editor
    for i, b in enumerate(open(path).read().split("\n")):
        if teks in b: return i + 1
    raise Exception("tidak ketemu " + teks)
def ke_baris(n): r.tekan("Control+g", 0.4); r.ketik(str(n), 12); r.tekan("Enter", 0.3)
def ganti_baris(n, teks, cps=18): ke_baris(n); r.tekan("End", 0.1); r.tekan("Shift+Home", 0.1); r.tekan("Shift+Home", 0.2); r.ketik(teks, cps)
def sisip_setelah(path, cari, teks, cps=20): ke_baris(baris_ke(path, cari)); r.tekan("End", 0.1); r.tekan("Enter", 0.2); r.ketik(teks, cps)
def editor(): r.kamera(r.kotak(".editor-group-container"), pad=0)
def term(): r.kamera(None); r.fokus_terminal(); time.sleep(0.3); r.tekan("Control+l", 0.3); r.kamera_terminal()
def ke_editor(nama): r.kamera(None); r.fokus_editor(); r.buka(nama); time.sleep(0.3)
DB = "DATABASE_URL=postgres://postgres@localhost/antrean"
SERVER = f"SESSION_SECRET=rahasia-lokal {DB} node src/server.js &"
SV = P + "/src/server.js"; LK = P + "/src/routes/loket.js"
r.mulai(); r.kamera(None); time.sleep(0.6)
# b01 celah: panggil tanpa login
term(); r.terminal(f"{DB} node src/server.js &", cps=40, tunggu=1.5); r.tekan("Control+l", 0.3)
r.tanda("b01"); r.terminal("curl -i -X POST localhost:3000/api/loket/1/panggil", cps=30, tunggu=1.2); r.label("Tanpa login pun bisa memanggil!", 3.5); time.sleep(3.5); r.tanda("b01_akhir")
r.terminal("kill %1", tunggu=0.5); r.tekan("Control+l", 0.3)
# b03 bcrypt
r.tanda("b03"); r.ketik("npm install bcrypt express-session", 22); r.tekan("Enter", 0.2)
for _ in range(240):
    if os.path.exists(P + "/node_modules/bcrypt/package.json") and os.path.exists(P + "/node_modules/express-session/package.json"): break
    time.sleep(0.25)
time.sleep(2.0); r.tekan("Control+l", 0.3); r.tanda("b03_repl")
r.terminal("node", tunggu=1.0); r.terminal("const bcrypt = require('bcrypt')", cps=24, tunggu=0.6)
r.terminal("await bcrypt.hash('rahasia123', 10)", cps=20, tunggu=1.2); r.terminal("await bcrypt.hash('rahasia123', 10)", cps=40, tunggu=1.2)
r.label("Password sama, hash berbeda (salt)", 4); time.sleep(4.0); r.terminal(".exit", tunggu=0.6); r.tanda("b03_akhir")
# b04 route login
r.kamera(None); r.berkas_baru("src/routes/auth.js", akar=True); r.kamera_editor()
r.tanda("b04"); r.ketik_kode(open(K + "auth_a.js").read(), cps=30); r.tekan("Control+s", 0.4); r.tanda("b04_sorot")
ke_baris(baris_ke(P + "/src/routes/auth.js", "Username atau password salah")); r.kamera_editor(zoom=1.6); r.label("Satu pesan untuk dua kesalahan", 3.5); time.sleep(3.5); r.tanda("b04_akhir")
# b06 session
ke_editor("server.js"); editor()
r.tanda("b06"); sisip_setelah(SV, "require('express')", "const session = require('express-session');")
ke_baris(baris_ke(SV, "express.json()")); r.tekan("End", 0.1); r.tekan("Enter", 0.2); r.kamera_editor(); r.ketik_kode(open(K + "session.js").read(), cps=22)
sisip_setelah(SV, "routes/booking", "app.use('/api', require('./routes/auth').router);", 24); r.tekan("Control+s", 0.4); editor(); time.sleep(1.0); r.tanda("b06_pengguna")
r.kamera(None); r.berkas_baru("db/pengguna.js", akar=True); r.kamera_editor(); r.ketik_kode(open(K + "pengguna.js").read(), cps=70); r.tekan("Control+s", 0.4)
term(); r.terminal(f"{DB} node db/pengguna.js", cps=40, tunggu=3.0); r.label("Akun contoh: pakrahmat, dina, yoga", 3); time.sleep(2.0); r.tanda("b06_akhir")
# b07 penjaga
ke_editor("auth.js"); r.tekan("Control+End", 0.3); r.tekan("Enter", 0.1); r.tekan("Enter", 0.2); r.kamera_editor()
r.tanda("b07"); r.ketik_kode(open(K + "auth_b.js").read(), cps=24); r.tekan("Control+s", 0.4); time.sleep(1.5); r.tanda("b07_akhir")
# b08 pasang penjaga
ke_editor("loket.js"); editor()
r.tanda("b08"); sisip_setelah(LK, "require('../db')", "const { wajib } = require('./auth');")
sisip_setelah(LK, "express.Router()", "const petugas = wajib('petugas', 'admin');")
for cari, baru in [("router.post('/loket/:id/panggil', async", "router.post('/loket/:id/panggil', petugas, async (req, res) => {"),
                   ("router.post('/tiket-loket/:id/:aksi', async", "router.post('/tiket-loket/:id/:aksi', petugas, async (req, res) => {")]:
    ganti_baris(baris_ke(LK, cari), baru, 30); r.kamera_editor()
r.tekan("Control+s", 0.4); time.sleep(0.8)
r.kamera(None); r.berkas_baru("src/routes/laporan.js", akar=True); r.kamera_editor(); r.ketik_kode(open(K + "laporan.js").read(), cps=60); r.tekan("Control+s", 0.4)
ke_editor("server.js"); editor(); sisip_setelah(SV, "routes/auth", "app.use('/api', require('./routes/laporan'));", 26); r.tekan("Control+s", 0.4); time.sleep(0.8); r.tanda("b08_uji")
term(); r.terminal(SERVER, cps=40, tunggu=1.5); r.tekan("Control+l", 0.3)
r.terminal("curl -i -X POST localhost:3000/api/loket/1/panggil", cps=40, tunggu=1.2); r.label("Tanpa login: 401", 3); time.sleep(3.0); r.tekan("Control+l", 0.3)
r.terminal("""curl -c kue.txt -X POST localhost:3000/api/login -H 'Content-Type: application/json' -d '{"username": "dina", "password": "rahasia123"}'""", cps=50, tunggu=1.5)
r.terminal("curl -b kue.txt -X POST localhost:3000/api/loket/1/panggil", cps=40, tunggu=1.2); r.label("Dina login: boleh memanggil", 3); time.sleep(3.0)
r.terminal("curl -i -b kue.txt localhost:3000/api/laporan", cps=34, tunggu=1.2); r.label("Laporan khusus admin: 403", 3); time.sleep(3.5); r.tanda("b08_akhir")
# b10 SQL injection
r.kamera(None); r.berkas_baru("uji/injeksi.js", akar=True); r.kamera_editor()
r.tanda("b10"); r.ketik_kode(open(K + "injeksi.js").read(), cps=45); r.tekan("Control+s", 0.4); r.tanda("b10_jalan")
term(); r.terminal(f"{DB} node uji/injeksi.js", cps=36, tunggu=2.0); r.label("$1: input tetap data, bukan perintah", 4); time.sleep(4.0); r.tanda("b10_akhir")
# b11 rahasia sesi
ke_editor("server.js"); ke_baris(baris_ke(SV, "SESSION_SECRET")); r.kamera_editor(zoom=1.7)
r.tanda("b11"); r.label("Kunci rahasia dari environment variable", 4); time.sleep(5.0); r.tanda("b11_akhir")
# b13 IDOR versi AI
r.kamera(None); r.berkas_baru("uji/tiket-ai.js", akar=True); r.kamera_editor()
r.tanda("b13"); r.ketik_kode(open(K + "tiket-ai.js").read(), cps=90); r.tekan("Control+s", 0.4); r.label("Contoh kode bergaya hasil AI", 3); time.sleep(2.0); r.tanda("b13_akhir")
# b14 commit
term(); r.terminal("kill %1", tunggu=0.6); r.terminal("rm kue.txt", tunggu=0.4); r.tekan("Control+l", 0.3)
r.tanda("b14"); r.terminal("git add .", tunggu=0.6); r.terminal('git commit -m "Login dan keamanan"', tunggu=1.5); r.label("Commit", 2.5); time.sleep(2.5); r.tanda("b14_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
subprocess.run(f"cd {P} && git tag -f bab-08", shell=True)
