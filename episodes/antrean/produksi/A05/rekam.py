import sys, time, os, subprocess; sys.path.insert(0, "/home/user/antre/alat")
P = "/home/user/proyek/siantre"; K = "/home/user/antre/kode/A05/"
subprocess.run(f"cd {P} && git reset -q --hard bab-04 && git clean -qfd", shell=True)
subprocess.run("psql -U postgres -d antrean -qc 'ALTER TABLE tickets DROP COLUMN IF EXISTS code'", shell=True)
subprocess.run("psql -U postgres -d antrean_ai -qc 'TRUNCATE tiket RESTART IDENTITY'", shell=True)
subprocess.run("/home/user/antre/alat/reset_vs.sh", shell=True)
from rekam_vs import VS
r = VS("/home/user/antre/A05/rek")
def baris_ke(path, teks):
    r.tekan("Control+s", 0.3)
    for i, b in enumerate(open(path).read().split("\n")):
        if teks in b: return i + 1
    raise Exception("tidak ketemu " + teks)
def ke_baris(n): r.tekan("Control+g", 0.4); r.ketik(str(n), 12); r.tekan("Enter", 0.3)
def editor(): r.kamera(r.kotak(".editor-group-container"), pad=0)
def term(): r.kamera(None); r.fokus_terminal(); time.sleep(0.3); r.tekan("Control+l", 0.3); r.kamera_terminal()
def ke_editor(nama): r.kamera(None); r.fokus_editor(); r.buka(nama); time.sleep(0.3)
SERVER = "DATABASE_URL=postgres://postgres@localhost/antrean node src/server.js &"
r.mulai(); r.kamera(None); time.sleep(0.6)
# b04 router
r.tanda("b04"); r.berkas_baru("src/routes/tiket.js"); r.kamera_editor(); r.ketik_kode(open(K + "tiket_a.js").read(), cps=16); r.tekan("Control+s", 0.4)
ke_editor("server.js"); editor(); ke_baris(5); r.tekan("End", 0.2); r.tekan("Enter", 0.2); r.ketik("app.use('/api', require('./routes/tiket'));", 15); r.tekan("Control+s", 0.4)
r.label("Router dipasang di /api", 3); time.sleep(2.5); r.tanda("b04_akhir")
# b05 express.json
r.tanda("b05"); ke_baris(5); r.tekan("End", 0.2); r.tekan("Enter", 0.2); r.ketik("app.use(express.json());", 13); r.tekan("Control+s", 0.4)
r.label("Body JSON → req.body", 3); time.sleep(3.0); r.tanda("b05_akhir")
# b06 validasi
ke_editor("tiket.js"); r.tekan("Control+End", 0.3); r.tekan("Enter", 0.1); r.tekan("Enter", 0.1); r.kamera_editor()
r.tanda("b06"); r.ketik_kode(open(K + "tiket_b.js").read() + open(K + "tiket_validasi.js").read(), cps=17); time.sleep(1.0); r.tanda("b06_akhir")
# b07 penomoran
r.tanda("b07"); r.tekan("Enter", 0.1); r.ketik_kode(open(K + "tiket_nomor.js").read(), cps=17); time.sleep(1.0); r.tanda("b07_akhir")
# b08 kode acak + kolom baru
r.tanda("b08"); r.tekan("Enter", 0.1); r.ketik_kode(open(K + "tiket_kode.js").read(), cps=15); r.tekan("Control+s", 0.4); time.sleep(0.8); r.tanda("b08_kolom")
term(); r.terminal('psql antrean -c "ALTER TABLE tickets ADD COLUMN code text UNIQUE"', cps=30, tunggu=1.2); r.label("Kolom baru: code", 3)
r.terminal('psql antrean -c "TRUNCATE tickets, ticket_events RESTART IDENTITY"', cps=34, tunggu=1.2); r.label("Mulai dari antrean kosong", 3); time.sleep(2.0); r.tanda("b08_akhir")
# b09 insert
ke_editor("tiket.js"); r.tekan("Control+End", 0.3); r.tekan("Enter", 0.1); r.kamera_editor()
r.tanda("b09"); r.ketik_kode(open(K + "tiket_insert.js").read(), cps=18); r.tekan("Control+s", 0.4); time.sleep(1.0); r.tanda("b09_akhir")
# b10 curl
term(); r.terminal(SERVER, cps=40, tunggu=1.5)
CURL = "curl -i -X POST localhost:3000/api/tiket -H 'Content-Type: application/json' -d '{BODY}'"
for i, (body, lab) in enumerate([('{"service_id": 1}', "201 · A-001"), ('{"service_id": 1}', "201 · A-002"), ('{"service_id": 2}', "201 · B-001"),
                                 ('{"service_id": "abc"}', "400 · input salah"), ('{"service_id": 99}', "404 · layanan tidak ada")]):
    r.tekan("Control+l", 0.3); r.tanda(f"b10_{i}"); r.terminal(CURL.replace("{BODY}", body), cps=45, tunggu=1.2); r.label(lab, 2.5); time.sleep(2.5)
r.tanda("b10_akhir")
# b11 error handler (sebelum app.listen di baris 19)
ke_editor("server.js"); editor(); ke_baris(baris_ke(P + "/src/server.js", "app.listen")); r.tekan("Home", 0.2); r.kamera_editor()
r.tanda("b11"); r.ketik_kode(open(K + "server_error.js").read(), cps=17); r.tekan("Enter", 0.1); r.tekan("Enter", 0.2); r.tekan("Control+s", 0.4)
editor(); time.sleep(2.0); r.tanda("b11_akhir")
# b12 GET tiket (di atas module.exports)
ke_editor("tiket.js"); ke_baris(baris_ke(P + "/src/routes/tiket.js", "module.exports")); r.tekan("Home", 0.1); r.kamera_editor()
r.tanda("b12"); r.ketik_kode(open(K + "tiket_get.js").read(), cps=22); r.tekan("Enter", 0.1); r.tekan("Enter", 0.2); r.tekan("Control+s", 0.4); time.sleep(0.8); r.tanda("b12_kode")
term(); r.terminal("kill %1", tunggu=0.6); r.tekan("Control+l", 0.3); r.terminal(SERVER, cps=40, tunggu=1.5)
r.terminal(CURL.replace("{BODY}", '{"service_id": 1}'), cps=45, tunggu=1.2); r.label("A-003 dan kode acaknya", 3); time.sleep(3.0); r.tanda("b12_akhir")
# b14 serbu
r.kamera(None); r.berkas_baru("uji/serbu.js", akar=True); r.kamera_editor()
r.tanda("b14"); r.ketik_kode(open(K + "serbu.js").read(), cps=60); r.tekan("Control+s", 0.4); time.sleep(0.5); r.tanda("b14_jalan")
term(); r.terminal("node ../antrean-ai/server.js &", cps=30, tunggu=1.5); r.tekan("Control+l", 0.3)
r.terminal("node uji/serbu.js http://localhost:4000/api/tiket", cps=34, tunggu=2.5); r.label("Kode AI: nomor ganda", 3.5); time.sleep(3.5); r.tanda("b14_kita")
r.terminal("node uji/serbu.js", cps=24, tunggu=2.5); r.label("Kode kita: ditolak UNIQUE, tetapi ada error", 3.5); time.sleep(4.0); r.tanda("b14_akhir")
# b15 commit
r.terminal("kill %1 %2", tunggu=0.8); r.tekan("Control+l", 0.3)
r.tanda("b15"); r.terminal("git add .", tunggu=0.6); r.terminal('git commit -m "API ambil nomor"', tunggu=1.5); r.label("Commit", 2.5); time.sleep(2.5); r.tanda("b15_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
subprocess.run(f"cd {P} && git tag -f bab-05", shell=True)
