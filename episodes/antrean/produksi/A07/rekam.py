import sys, time, os, subprocess; sys.path.insert(0, "/home/user/antre/alat")
P = "/home/user/proyek/siantre"; K = "/home/user/antre/kode/A07/"
subprocess.run(f"cd {P} && git reset -q --hard bab-06 && git clean -qfd", shell=True)
subprocess.run("psql -U postgres -d antrean -qc 'ALTER TABLE bookings DROP COLUMN IF EXISTS code' -c 'TRUNCATE slots, bookings RESTART IDENTITY'", shell=True)
subprocess.run("/home/user/antre/alat/reset_vs.sh", shell=True)
from rekam_vs import VS
r = VS("/home/user/antre/A07/rek")
def psql(q): return subprocess.run(["psql", "-U", "postgres", "-d", "antrean", "-tAc", q], capture_output=True, text=True).stdout.strip()
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
B = P + "/src/routes/booking.js"
r.mulai(); r.kamera(None); time.sleep(0.6)
# b03 slot dengan generate_series
r.berkas_baru("db/slot.sql", akar=True); r.kamera_editor()
r.tanda("b03"); r.ketik_kode(open(K + "slot.sql").read(), cps=34); r.tekan("Control+s", 0.4); editor(); time.sleep(1.5); r.tanda("b03_jalan")
term(); r.terminal("psql antrean -f db/slot.sql", cps=26, tunggu=1.2); r.label("30 slot dibuat", 2.5); time.sleep(1.5)
r.terminal("psql antrean -f db/slot.sql", cps=40, tunggu=1.2); r.label("Dijalankan ulang: 0, tidak dobel", 3); time.sleep(2.5)
r.terminal('psql antrean -c "SELECT id, starts_at, quota FROM slots LIMIT 6"', cps=34, tunggu=1.5); r.label("+07 = WIB", 3); time.sleep(3.0); r.tanda("b03_akhir")
# b05 route slot
r.kamera(None); r.berkas_baru("src/routes/booking.js", akar=True); r.kamera_editor()
r.tanda("b05"); r.ketik_kode(open(K + "booking_a.js").read(), cps=30); r.tekan("Control+s", 0.4); r.tanda("b05_pasang")
ke_editor("tiket.js"); editor(); ganti_baris(baris_ke(P + "/src/routes/tiket.js", "module.exports"), "module.exports = { router, buatTiket };", 20); r.tekan("Control+s", 0.4); time.sleep(0.8)
ke_editor("server.js"); editor(); n = baris_ke(P + "/src/server.js", "routes/tiket"); ganti_baris(n, "app.use('/api', require('./routes/tiket').router);", 24)
r.tekan("End", 0.1); r.tekan("Enter", 0.2); r.ketik("app.use('/api', require('./routes/booking'));", 22); r.tekan("Control+s", 0.4); time.sleep(1.5); r.tanda("b05_akhir")
# b06 validasi pemesanan
ke_editor("booking.js"); ke_baris(baris_ke(B, "module.exports")); r.tekan("Home", 0.1); r.tekan("Enter", 0.1); r.tekan("ArrowUp", 0.2); r.kamera_editor()
r.tanda("b06"); r.ketik_kode(open(K + "booking_b.js").read(), cps=22); time.sleep(1.0); r.tanda("b06_akhir")
# b09 kunci slot
r.tanda("b09"); r.tekan("Enter", 0.1); r.ketik_kode(open(K + "booking_c.js").read(), cps=30); r.tekan("Enter", 0.2); r.tekan("Control+s", 0.4); r.tanda("b09_sorot")
ke_baris(baris_ke(B, "FOR UPDATE")); r.kamera_editor(zoom=1.6); r.label("FOR UPDATE pada slot", 3); time.sleep(3.0)
ke_baris(baris_ke(B, "rows[0].terisi >=")); r.kamera_editor(zoom=1.6); r.label("Penuh → 409", 3); time.sleep(3.0); r.tanda("b09_akhir")
# b10 membuktikan
term(); r.terminal('psql antrean -c "ALTER TABLE bookings ADD COLUMN code text UNIQUE"', cps=36, tunggu=1.2); r.label("Kolom baru: code", 2.5); time.sleep(1.0)
r.kamera(None); r.berkas_baru("uji/pesan-serbu.js", akar=True); r.kamera_editor()
r.tanda("b10"); r.ketik_kode(open(K + "pesan-serbu.js").read(), cps=60); r.tekan("Control+s", 0.4); r.tanda("b10_jalan")
term(); r.terminal(SERVER, cps=40, tunggu=1.5); r.tekan("Control+l", 0.3)
r.terminal("node uji/pesan-serbu.js", cps=24, tunggu=2.0); r.label("Kuota 2: tepat 2 berhasil, 8 penuh", 4); time.sleep(4.0); r.tanda("b10_akhir")
# b11 check-in
ke_editor("booking.js"); ke_baris(baris_ke(B, "module.exports")); r.tekan("Home", 0.1); r.tekan("Enter", 0.1); r.tekan("ArrowUp", 0.2); r.kamera_editor()
r.tanda("b11"); r.ketik_kode(open(K + "booking_d.js").read(), cps=30); r.tekan("Enter", 0.2); r.tekan("Control+s", 0.4); r.tanda("b11_uji")
kode = psql("SELECT code FROM bookings ORDER BY id LIMIT 1")
term(); r.terminal("kill %%", tunggu=0.5); r.terminal(SERVER, cps=40, tunggu=1.5); r.tekan("Control+l", 0.3)
r.terminal(f"curl -i -X POST localhost:3000/api/booking/{kode}/checkin", cps=34, tunggu=1.2); r.label("Pemesanan menjadi tiket", 3); time.sleep(3.0)
r.tekan("Control+l", 0.3); r.terminal(f"curl -i -X POST localhost:3000/api/booking/{kode}/checkin", cps=50, tunggu=1.2); r.label("Kode yang sama: 409", 3); time.sleep(3.0); r.tanda("b11_akhir")
# b13 versi AI
r.kamera(None); r.berkas_baru("uji/booking-ai.js", akar=True); r.kamera_editor()
r.tanda("b13"); r.ketik_kode(open(K + "booking-ai.js").read(), cps=90); r.tekan("Control+s", 0.4); r.label("Contoh kode bergaya hasil AI", 3); time.sleep(1.5); r.tanda("b13_jalan")
term(); r.terminal("DATABASE_URL=postgres://postgres@localhost/antrean node uji/booking-ai.js &", cps=30, tunggu=1.2); r.tekan("Control+l", 0.3)
r.terminal("node uji/pesan-serbu.js http://localhost:4002 2", cps=30, tunggu=2.0)
r.terminal('psql antrean -c "SELECT slot_id, count(*) FROM bookings GROUP BY slot_id"', cps=36, tunggu=1.5); r.label("Versi AI: slot 2 terisi lebih dari kuota", 4); time.sleep(4.5); r.tanda("b13_akhir")
# b14 commit
r.terminal("kill $(jobs -p)", tunggu=0.8); r.tekan("Control+l", 0.3)
r.tanda("b14"); r.terminal("git add .", tunggu=0.6); r.terminal('git commit -m "Reservasi slot"', tunggu=1.5); r.label("Commit", 2.5); time.sleep(2.5); r.tanda("b14_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
subprocess.run(f"cd {P} && git tag -f bab-07", shell=True)
