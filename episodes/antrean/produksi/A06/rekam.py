import sys, time, os, subprocess; sys.path.insert(0, "/home/user/antre/alat")
P = "/home/user/proyek/siantre"; K = "/home/user/antre/kode/A06/"
subprocess.run(f"cd {P} && git reset -q --hard bab-05 && git clean -qfd", shell=True)
subprocess.run("psql -U postgres -d antrean -qc 'ALTER TABLE tickets DROP COLUMN IF EXISTS counter_id' -c 'TRUNCATE tickets, ticket_events RESTART IDENTITY'", shell=True)
subprocess.run("/home/user/antre/alat/reset_vs.sh", shell=True)
from rekam_vs import VS
r = VS("/home/user/antre/A06/rek")
def baris_ke(path, teks):
    r.tekan("Control+s", 0.3)  # simpan dulu supaya nomor baris di disk sama dengan di editor
    for i, b in enumerate(open(path).read().split("\n")):
        if teks in b: return i + 1
    raise Exception("tidak ketemu " + teks)
def ke_baris(n): r.tekan("Control+g", 0.4); r.ketik(str(n), 12); r.tekan("Enter", 0.3)
def ganti_baris(n, teks, cps=18): ke_baris(n); r.tekan("End", 0.1); r.tekan("Shift+Home", 0.1); r.tekan("Shift+Home", 0.2); r.ketik(teks, cps)
def editor(): r.kamera(r.kotak(".editor-group-container"), pad=0)
def term(): r.kamera(None); r.fokus_terminal(); time.sleep(0.3); r.tekan("Control+l", 0.3); r.kamera_terminal()
def ke_editor(nama): r.kamera(None); r.fokus_editor(); r.buka(nama); time.sleep(0.3)
SERVER = "DATABASE_URL=postgres://postgres@localhost/antrean node src/server.js &"
r.mulai(); r.kamera(None); time.sleep(0.6)
# b04 fungsi transaksi
ke_editor("db.js"); editor(); n = baris_ke(P + "/src/db.js", "module.exports"); ke_baris(n); r.tekan("Home", 0.2); r.kamera_editor()
r.tanda("b04"); r.ketik_kode(open(K + "transaksi.js").read(), cps=17); r.tekan("Enter", 0.1); r.tekan("Enter", 0.2)
ganti_baris(n + 16, "module.exports = { pool, transaksi };"); r.tekan("Control+s", 0.4); editor(); time.sleep(2.0); r.tanda("b04_akhir")
# b05 tiket dalam transaksi
T = P + "/src/routes/tiket.js"
ke_editor("tiket.js"); editor()
r.tanda("b05"); ganti_baris(baris_ke(T, "require('../db')"), "const { pool, transaksi } = require('../db');", 20)
a = baris_ke(T, "// Ambil nomor antrean baru"); b = baris_ke(T, "// Status tiket")
r.perintah("View: Toggle Word Wrap", 0.5); ke_baris(a); r.tekan("Home", 0.1); r.tekan("Home", 0.1)
for _ in range(b - a): r.pg.keyboard.press("Shift+ArrowDown"); time.sleep(0.03)
time.sleep(0.6); r.tekan("Delete", 0.3); r.perintah("View: Toggle Word Wrap", 0.5); r.kamera_editor()
r.ketik_kode(open(K + "tiket_post.js").read(), cps=60); r.tekan("Enter", 0.1); r.tekan("Enter", 0.2); r.tekan("Control+s", 0.4); r.tanda("b05_uji")
term(); r.terminal(SERVER, cps=40, tunggu=1.5); r.tekan("Control+l", 0.3)
r.terminal("node uji/serbu.js", cps=22, tunggu=2.5); r.label("Transaksi saja: masih ada error", 3.5); time.sleep(3.5); r.tanda("b05_akhir")
# b06 FOR UPDATE
time.sleep(1.0)
ke_editor("tiket.js"); L = baris_ke(T, "SELECT code FROM services WHERE id = $1'"); kol = open(T).read().split("\n")[L - 1].index("$1'") + 3
ke_baris(L); r.tekan("Home", 0.1); r.tekan("Home", 0.1); r.kamera_editor()
r.tanda("b06"); r.tekan("Enter", 0.1); r.tekan("ArrowUp", 0.2); r.ketik("  // Kunci baris layanan ini, supaya dua orang tidak menghitung nomor bersamaan", 30)
r.tekan("Control+g", 0.4); r.ketik(f"{L + 1}:{kol}", 12); r.tekan("Enter", 0.3); r.ketik(" FOR UPDATE", 9); r.tekan("Control+s", 0.4)
editor(); r.label("FOR UPDATE: baris layanan terkunci", 3); time.sleep(3.0); r.tanda("b06_uji")
term(); r.terminal("kill %%", tunggu=0.5); r.terminal(SERVER, cps=40, tunggu=1.5); r.tekan("Control+l", 0.3)
r.terminal("node uji/serbu.js", cps=22, tunggu=2.5); r.label("20 nomor berbeda, 0 error", 4); time.sleep(4.0); r.tanda("b06_akhir")
# b09-b10 panggil dengan SKIP LOCKED
r.tekan("Control+l", 0.3); r.tanda("b10_kolom")
r.terminal('psql antrean -c "ALTER TABLE tickets ADD COLUMN counter_id integer REFERENCES counters"', cps=36, tunggu=1.2); r.label("Kolom baru: counter_id", 3); time.sleep(2.0)
ke_editor("tiket.js"); r.berkas_baru("loket.js"); r.kamera_editor()
r.tanda("b10"); r.ketik_kode(open(K + "loket_a.js").read(), cps=24); r.tekan("Control+s", 0.4); r.tanda("b10_sorot")
ke_baris(baris_ke(P + "/src/routes/loket.js", "SKIP LOCKED")); r.kamera_editor(zoom=1.6); r.label("FOR UPDATE SKIP LOCKED", 3); time.sleep(3.0)
ke_baris(baris_ke(P + "/src/routes/loket.js", "RETURNING")); r.kamera_editor(zoom=1.6); r.label("RETURNING: tiket yang didapat", 3); time.sleep(3.0)
ke_editor("server.js"); editor(); n = baris_ke(P + "/src/server.js", "routes/tiket"); ke_baris(n); r.tekan("End", 0.2); r.tekan("Enter", 0.2)
r.ketik("app.use('/api', require('./routes/loket'));", 18); r.tekan("Control+s", 0.4); time.sleep(1.5); r.tanda("b10_akhir")
# b11 BOLEH
ke_editor("loket.js"); r.tekan("Control+End", 0.3); r.tekan("Enter", 0.1); r.tekan("Enter", 0.2); r.kamera_editor()
r.tanda("b11"); r.ketik_kode(open(K + "loket_b.js").read(), cps=26); r.tekan("Control+s", 0.4); r.tanda("b11_uji")
term(); r.terminal("kill %%", tunggu=0.5); r.terminal(SERVER, cps=40, tunggu=1.5); r.tekan("Control+l", 0.3)
r.terminal("curl -i -X POST localhost:3000/api/tiket-loket/1/selesai", cps=30, tunggu=1.2); r.label("Menunggu → Selesai: ditolak 409", 3.5); time.sleep(3.5); r.tanda("b11_akhir")
# b12 dua loket
r.kamera(None); r.berkas_baru("uji/isi-antrean.sql", akar=True); r.kamera_editor()
r.tanda("b12"); r.ketik_kode(open(K + "isi-antrean.sql").read(), cps=70); r.tekan("Control+s", 0.4)
r.kamera(None); r.berkas_baru("uji/dua-loket.js", akar=True); r.kamera_editor(); r.ketik_kode(open(K + "dua-loket.js").read(), cps=60); r.tekan("Control+s", 0.4)
r.kamera(None); r.berkas_baru("uji/ganda.sql", akar=True); r.kamera_editor(); r.ketik_kode(open(K + "ganda.sql").read(), cps=40); r.tekan("Control+s", 0.4); r.tanda("b12_jalan")
term(); r.terminal("psql antrean -f uji/isi-antrean.sql", cps=30, tunggu=1.2); r.terminal("node uji/dua-loket.js", cps=26, tunggu=2.5)
r.terminal("psql antrean -f uji/ganda.sql", cps=30, tunggu=1.5); r.label("0 baris: tidak ada panggilan ganda", 4); time.sleep(4.0); r.tanda("b12_akhir")
# b14 versi AI
r.kamera(None); r.berkas_baru("uji/panggil-ai.js", akar=True); r.kamera_editor()
r.tanda("b14"); r.ketik_kode(open(K + "panggil-ai.js").read(), cps=90); r.tekan("Control+s", 0.4); r.label("Contoh kode bergaya hasil AI", 3); time.sleep(1.5); r.tanda("b14_jalan")
term(); r.terminal("DATABASE_URL=postgres://postgres@localhost/antrean node uji/panggil-ai.js &", cps=30, tunggu=1.2); r.tekan("Control+l", 0.3)
r.terminal("psql antrean -f uji/isi-antrean.sql", cps=34, tunggu=1.2); r.terminal("node uji/dua-loket.js http://localhost:4001", cps=30, tunggu=2.5)
r.terminal("psql antrean -f uji/ganda.sql", cps=34, tunggu=1.5); r.label("Versi AI: puluhan tiket dipanggil dua kali", 4); time.sleep(4.5); r.tanda("b14_akhir")
# b16 commit
r.terminal("kill $(jobs -p)", tunggu=0.8); r.tekan("Control+l", 0.3)
r.tanda("b16"); r.terminal("git add .", tunggu=0.6); r.terminal('git commit -m "Transaksi dan penguncian"', tunggu=1.5); r.label("Commit", 2.5); time.sleep(2.5); r.tanda("b16_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
subprocess.run(f"cd {P} && git tag -f bab-06", shell=True)
