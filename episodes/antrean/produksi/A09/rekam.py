import sys, time, os, subprocess; sys.path.insert(0, "/home/user/antre/alat")
P = "/home/user/proyek/siantre"; K = "/home/user/antre/kode/A09/"
subprocess.run(f"cd {P} && git reset -q --hard bab-08 && git clean -qfd", shell=True)
subprocess.run("psql -U postgres -d antrean -qc 'TRUNCATE tickets, ticket_events RESTART IDENTITY CASCADE'", shell=True)
subprocess.run("fuser -k 3000/tcp 4004/tcp", shell=True, stderr=subprocess.DEVNULL)
subprocess.run("/home/user/antre/alat/reset_vs.sh", shell=True)
from rekam_vs import VS
r = VS("/home/user/antre/A09/rek")
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
SERVER = "SESSION_SECRET=rahasia-lokal DATABASE_URL=postgres://postgres@localhost/antrean node src/server.js &"
SV = P + "/src/server.js"; LK = P + "/src/routes/loket.js"; TK = P + "/src/routes/tiket.js"
LOGIN = """curl -s -c kue.txt -X POST localhost:3000/api/login -H 'Content-Type: application/json' -d '{"username": "dina", "password": "rahasia123"}'"""
r.mulai(); r.kamera(None); time.sleep(0.6)
# b05 siaran.js
r.berkas_baru("src/siaran.js", akar=True); r.kamera_editor()
r.tanda("b05"); r.ketik_kode(open(K + "siaran.js").read(), cps=30); r.tekan("Control+s", 0.4); r.tanda("b05_akhir")
# b06 sorot format pesan + pasang di server
ke_baris(baris_ke(P + "/src/siaran.js", "const pesan")); r.kamera_editor(zoom=1.7); r.tanda("b06"); r.label("event, data, lalu baris kosong", 3.5); time.sleep(3.5)
ke_baris(baris_ke(P + "/src/siaran.js", "setInterval")); r.kamera_editor(zoom=1.7); r.label("Detak setiap 25 detik", 2.5); time.sleep(2.5); r.tanda("b06_server")
ke_editor("server.js"); editor()
sisip_setelah(SV, "require('express-session')", "const { dengarkan } = require('./siaran');", 24)
sisip_setelah(SV, "express.json()", "app.use(express.static('public'));", 24)
sisip_setelah(SV, "routes/laporan", "app.get('/api/siaran', dengarkan);", 24); r.tekan("Control+s", 0.4); editor(); time.sleep(1.0); r.tanda("b06_akhir")
# b07 siarkan setelah commit
ke_editor("loket.js"); editor()
r.tanda("b07"); sisip_setelah(LK, "require('./auth')", "const { siarkan } = require('../siaran');", 24)
ganti_baris(baris_ke(LK, "RETURNING id, label`,"), "        RETURNING id, label, (SELECT name FROM counters WHERE id = $1) AS loket`,", 26); r.kamera_editor()
sisip_setelah(LK, "if (!tiket) return res.status(404)", "  siarkan('panggil', { label: tiket.label, loket: tiket.loket }); // setelah commit", 22); r.kamera_editor()
r.tekan("End", 0.1); r.tekan("Enter", 0.2); r.ketik("  siarkan('antrean', {});", 22)
sisip_setelah(LK, "if (!hasil) return res.status(409)", "  siarkan('antrean', {});", 24); r.kamera_editor(); r.tekan("Control+s", 0.4)
ke_editor("tiket.js"); editor()
sisip_setelah(TK, "require('../db')", "const { siarkan } = require('../siaran');", 26)
sisip_setelah(TK, "if (!tiket) return res.status(404).json({ error: 'Layanan", "  siarkan('antrean', { service_id: serviceId });", 24); r.kamera_editor(); r.tekan("Control+s", 0.4); time.sleep(0.5)
ke_editor("loket.js"); ke_baris(baris_ke(LK, "siarkan('panggil'")); r.kamera_editor(zoom=1.6); r.label("Siarkan setelah transaksi selesai", 3.5); time.sleep(3.5); r.tanda("b07_uji")
term(); r.terminal(SERVER, cps=40, tunggu=1.5); r.tekan("Control+l", 0.3)
r.terminal("curl -N localhost:3000/api/siaran &", cps=30, tunggu=1.0); r.label("Sambungan dibiarkan terbuka", 2.5); time.sleep(1.5)
r.terminal(LOGIN + " > /dev/null", cps=60, tunggu=0.8)
r.terminal("curl -s -b kue.txt -X POST localhost:3000/api/tiket -H 'Content-Type: application/json' -d '{\"service_id\": 1}' > /dev/null", cps=60, tunggu=1.0)
r.terminal("curl -s -b kue.txt -X POST localhost:3000/api/loket/1/panggil > /dev/null", cps=40, tunggu=1.5); r.label("Kabar panggil sampai lewat sambungan yang sama", 4); time.sleep(4.0)
r.terminal("kill %2", tunggu=0.4); r.tanda("b07_akhir")
# b08 halaman TV dan HP
r.kamera(None); r.berkas_baru("public/tv.html", akar=True); r.kamera_editor()
r.tanda("b08"); r.ketik_kode(open(K + "tv.html").read(), cps=80); r.tekan("Control+s", 0.4); r.tanda("b08_tvjs")
r.kamera(None); r.berkas_baru("public/tv.js", akar=True); r.kamera_editor()
r.ketik_kode(open(K + "tv_a.js").read(), cps=26); r.tekan("Control+s", 0.4); r.tanda("b08_tiket")
r.kamera(None); r.berkas_baru("public/tiket.html", akar=True); r.kamera_editor(); r.ketik_kode(open(K + "tiket.html").read(), cps=80); r.tekan("Control+s", 0.4)
r.kamera(None); r.berkas_baru("public/tiket.js", akar=True); r.kamera_editor(); r.ketik_kode(open(K + "tiket_hp.js").read(), cps=30); r.tekan("Control+s", 0.4)
editor(); time.sleep(1.2); r.tanda("b08_akhir")
# b10 suara
ke_editor("tv.js"); r.tekan("Control+End", 0.3); r.tekan("Enter", 0.1); r.tekan("Enter", 0.2); r.kamera_editor()
r.tanda("b10"); r.ketik_kode(open(K + "tv_b.js").read(), cps=26); r.tekan("Control+s", 0.4); r.tanda("b10_sorot")
ke_baris(baris_ke(P + "/public/tv.js", "Number(angka)")); r.kamera_editor(zoom=1.6); r.label("A-012 dibaca \"A, 12\"", 3); time.sleep(3.0); r.tanda("b10_akhir")
ke_baris(baris_ke(P + "/public/tv.js", "let bolehBersuara")); r.kamera_editor(zoom=1.6); r.tanda("b11"); r.label("Suara baru boleh setelah klik", 3); time.sleep(3.5); r.tanda("b11_akhir")
# b12 sambung ulang
ke_editor("public/tiket.js"); ke_baris(baris_ke(P + "/public/tiket.js", "sumber.onopen")); r.kamera_editor(zoom=1.7)
r.tanda("b12"); r.label("Tersambung lagi: ambil keadaan terbaru", 4); time.sleep(4.5); r.tanda("b12_akhir")
# b13 versi AI: polling 100 ms
r.kamera(None); r.berkas_baru("uji/polling-ai.js", akar=True); r.kamera_editor()
r.tanda("b13"); r.ketik_kode(open(K + "polling-ai.js").read(), cps=90); r.tekan("Control+s", 0.4)
ke_baris(baris_ke(P + "/uji/polling-ai.js", "}, 100);")); r.kamera_editor(zoom=1.6); r.label("Contoh kode bergaya hasil AI", 3); time.sleep(2.0); r.tanda("b13_akhir")
term(); r.tanda("b14"); r.terminal("node uji/polling-ai.js", cps=30, tunggu=2.5)
tamu = subprocess.Popen(["python3", "/home/user/antre/A09/tamu.py"]); r.label("Tiga layar membuka halaman polling", 3); time.sleep(7.0)
r.label("Tiga layar: sekitar 30 request per detik, padahal tidak ada yang berubah", 4); time.sleep(4.0); tamu.wait()
r.tekan("Control+c", 0.6); r.tekan("Control+l", 0.3); r.tanda("b14_sse")
r.terminal("curl -N localhost:3000/api/siaran", cps=30, tunggu=1.0); r.label("SSE: tidak ada kejadian, tidak ada request", 4); time.sleep(4.5)
r.tekan("Control+c", 0.6); r.tanda("b14_akhir")
# b15 commit
r.terminal("kill %1", tunggu=0.6); r.terminal("rm kue.txt", tunggu=0.4); r.tekan("Control+l", 0.3)
r.tanda("b15"); r.terminal("git add .", tunggu=0.6); r.terminal('git commit -m "Layar real time dan suara panggilan"', tunggu=1.5); r.label("Commit", 2.5); time.sleep(2.5); r.tanda("b15_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
subprocess.run(f"cd {P} && git tag -f bab-09", shell=True)
