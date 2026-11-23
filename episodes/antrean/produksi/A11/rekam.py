import sys, time, os, subprocess; sys.path.insert(0, "/home/user/antre/alat")
P = "/home/user/proyek/siantre"; K = "/home/user/antre/kode/A11/"
subprocess.run(f"cd {P} && git reset -q --hard bab-10 && git clean -qfd", shell=True)
subprocess.run("fuser -k 3000/tcp", shell=True, stderr=subprocess.DEVNULL)
subprocess.run("psql -U postgres -qc 'DROP DATABASE IF EXISTS antrean_test'", shell=True)
subprocess.run("/home/user/antre/alat/reset_vs.sh", shell=True)
from rekam_vs import VS
r = VS("/home/user/antre/A11/rek")
def baris_ke(path, teks):
    r.tekan("Control+s", 0.3)
    for i, b in enumerate(open(path).read().split("\n")):
        if teks in b: return i + 1
    raise Exception("tidak ketemu " + teks)
def isi_baris(path, teks):
    for b in open(path).read().split("\n"):
        if teks in b: return b
def ke_baris(n): r.tekan("Control+g", 0.4); r.ketik(str(n), 12); r.tekan("Enter", 0.3)
def ganti_baris(n, teks, cps=18): ke_baris(n); r.tekan("End", 0.1); r.tekan("Shift+Home", 0.1); r.tekan("Shift+Home", 0.2); r.ketik(teks, cps)
def editor(): r.kamera(r.kotak(".editor-group-container"), pad=0)
def term(): r.kamera(None); r.fokus_terminal(); time.sleep(0.3); r.tekan("Control+l", 0.3); r.kamera_terminal()
def ke_editor(nama): r.kamera(None); r.fokus_editor(); r.buka(nama); time.sleep(0.3)
def baru(nama, kode, cps): r.kamera(None); r.berkas_baru(nama, akar=True); r.kamera_editor(); r.ketik_kode(kode, cps=cps); r.tekan("Control+s", 0.4)
def tunggu_berkas(f):
    for _ in range(240):
        if os.path.exists(f): return
        time.sleep(0.25)
def npm_test(lab, dur=3.5, tunggu=6.0):
    r.terminal("npm test", cps=24, tunggu=tunggu); r.label(lab, dur); time.sleep(dur)
LP = P + "/src/routes/laporan.js"; TK = P + "/src/routes/tiket.js"; SV = P + "/src/server.js"
SERVER = "SESSION_SECRET=rahasia-lokal DATABASE_URL=postgres://postgres@localhost/antrean node src/server.js &"
r.mulai(); r.kamera(None); time.sleep(0.6)
# b02 laporan dengan WITH
ke_editor("laporan.js"); time.sleep(0.4); ke_baris(baris_ke(LP, "router.get('/laporan'")); r.tekan("Home", 0.1)
for _ in range(6): r.tekan("Control+Shift+K", 0.15)   # hapus baris: tidak bergantung word wrap
time.sleep(0.3); r.kamera_editor(); r.tanda("b02"); r.ketik_kode(open(K + "laporan_route.js").read(), cps=34); r.tanda("b02_akhir")
# b03 jam tersibuk
r.tanda("b03"); r.tekan("Enter", 0.1); r.ketik_kode(open(K + "laporan_jam.js").read(), cps=30); r.tekan("Control+s", 0.4)
ke_baris(baris_ke(LP, "AT TIME ZONE")); r.kamera_editor(zoom=1.7); r.label("Sebutkan zona waktu bengkel", 3); time.sleep(3.5); r.tanda("b03_akhir")
# b04 grafik canvas
r.tanda("b04"); baru("public/laporan.html", open(K + "laporan_a.html").read(), 120); r.tanda("b04_grafik")
ke_baris(baris_ke(P + "/public/laporan.html", "    mulai();")); r.tekan("Home", 0.1); r.kamera_editor()
r.ketik_kode(open(K + "laporan_grafik.js").read(), cps=34); r.tekan("Enter", 0.1); r.tekan("Control+s", 0.4)
ke_baris(baris_ke(P + "/public/laporan.html", "const h = (H - bawah - 70) * n / maks")); r.kamera_editor(zoom=1.6); r.label("Tinggi batang sebanding nilai terbesar", 3); time.sleep(3.0); r.tanda("b04_akhir")
# b06 app diekspor, supertest
ke_editor("server.js"); editor(); r.tanda("b06")
ganti_baris(baris_ke(SV, "app.listen(3000)"), "if (require.main === module) app.listen(3000, () => console.log('SiAntre berjalan'));", 26)
r.tekan("End", 0.1); r.tekan("Enter", 0.2); r.ketik("module.exports = app;", 22); r.tekan("Control+s", 0.4); r.kamera_editor(); time.sleep(1.5); r.tanda("b06_npm")
term(); r.terminal("npm install --save-dev supertest", cps=26, tunggu=1.0); tunggu_berkas(P + "/node_modules/supertest/package.json"); time.sleep(2.0)
r.terminal("npm pkg set scripts.test='node --test test/*.test.js'", cps=30, tunggu=1.0); r.tanda("b06_akhir")
# b07 database test
ke_editor("schema.sql"); r.tekan("Control+End", 0.3); r.tekan("Enter", 0.1); r.tekan("Enter", 0.2); r.kamera_editor(); r.tanda("b07"); r.ketik_kode(open(K + "skema_tambahan.sql").read(), cps=36); r.tekan("Control+s", 0.4)
r.label("Skema dilengkapi dengan kolom dari bab 5 sampai 7", 3); time.sleep(2.0)
term(); r.terminal("createdb antrean_test", cps=26, tunggu=1.0)
baru("test/siapkan.js", open(K + "siapkan.js").read(), 60); time.sleep(1.0); r.tanda("b07_akhir")
# b08 test pertama
r.tanda("b08"); baru("test/api.test.js", open(K + "api_a.test.js").read(), 50); r.tanda("b08_jalan")
term(); npm_test("Semua hijau"); r.tanda("b08_akhir")
# b09 diagram status
ke_editor("api.test.js"); r.tekan("Control+End", 0.3); r.tekan("Enter", 0.1); r.tekan("Enter", 0.2); r.kamera_editor(); r.tanda("b09"); r.ketik_kode(open(K + "api_b.test.js").read(), cps=40); r.tekan("Control+s", 0.4); r.tanda("b09_jalan")
term(); npm_test("Panah terlarang: 409"); r.tanda("b09_akhir")
# b10 race condition, lalu FOR UPDATE dihapus dengan sengaja
ke_editor("api.test.js"); r.tekan("Control+End", 0.3); r.tekan("Enter", 0.1); r.tekan("Enter", 0.2); r.kamera_editor(); r.tanda("b10"); r.ketik_kode(open(K + "api_c.test.js").read(), cps=40); r.tekan("Control+s", 0.4); r.tanda("b10_jalan")
term(); npm_test("20 nomor berbeda: hijau", 3); r.tanda("b10_rusak")
ke_editor("routes/tiket.js"); asli = isi_baris(TK, "FOR UPDATE"); n = baris_ke(TK, "FOR UPDATE")
ganti_baris(n, asli.replace(" FOR UPDATE", ""), 60); r.tekan("Control+s", 0.4); r.kamera_editor(zoom=1.6); r.label("FOR UPDATE dihapus dengan sengaja", 3); time.sleep(3.0)
term(); npm_test("Merah: test ini benar-benar menjaga sesuatu", 4.5, 7.0); r.tanda("b10_merah")
ke_editor("routes/tiket.js"); ganti_baris(n, asli, 80); r.tekan("Control+s", 0.4); r.kamera_editor(zoom=1.6); time.sleep(1.0)
term(); npm_test("Dikembalikan: hijau lagi", 3); r.tanda("b10_akhir")
# b11 debugging stack trace
ke_editor("routes/tiket.js"); asli2 = isi_baris(TK, "ON t.service_id = s.id"); n2 = baris_ke(TK, "ON t.service_id = s.id")
r.tanda("b11"); ganti_baris(n2, asli2.replace("t.service_id", "t.servce_id"), 60); r.tekan("Control+s", 0.4); r.kamera_editor(zoom=1.6); r.label("Salah ketik dengan sengaja: servce_id", 3); time.sleep(2.5)
term(); r.terminal(SERVER, cps=50, tunggu=1.5); r.tekan("Control+l", 0.3)
r.terminal("curl -s localhost:3000/api/ringkas", cps=30, tunggu=1.5); r.label("Baca baris paling atas: column t.servce_id does not exist", 4.5); time.sleep(4.5)
r.label("Lalu cari baris pertama di berkas milikmu: src/routes/tiket.js", 4.5); time.sleep(4.5)
r.terminal("kill %1", tunggu=0.5); ke_editor("routes/tiket.js"); ganti_baris(n2, asli2, 80); r.tekan("Control+s", 0.4); r.tanda("b11_akhir")
# b12 versi AI: test yang tidak bisa gagal
r.tanda("b12"); baru("test/ambil-ai.test.js", open(K + "ambil-ai.test.js").read(), 90)
ke_baris(baris_ke(P + "/test/ambil-ai.test.js", "assert.ok(res)")); r.kamera_editor(zoom=1.6); r.label("Contoh kode bergaya hasil AI", 3); time.sleep(2.0); r.tanda("b12_jalan")
term(); r.terminal("node --test test/ambil-ai.test.js", cps=30, tunggu=4.0); r.label("Hijau", 2); time.sleep(2.0); r.tanda("b12_akhir")
# b13 rusak kodenya: test AI tetap hijau
ke_editor("routes/tiket.js"); asli3 = isi_baris(TK, "const nomor = rows[0].nomor;"); n3 = baris_ke(TK, "const nomor = rows[0].nomor;")
r.tanda("b13"); ganti_baris(n3, asli3.replace("rows[0].nomor", "rows[0].nomr"), 40); r.tekan("Control+s", 0.4); r.kamera_editor(zoom=1.6); r.label("Kode dirusak dengan sengaja", 2.5); time.sleep(2.5)
term(); r.terminal("node --test test/ambil-ai.test.js", cps=40, tunggu=4.0); r.label("Server error 500, test AI tetap hijau", 4); time.sleep(4.0)
r.tekan("Control+l", 0.3); npm_test("Test kita: merah", 3.5, 7.0)
ke_editor("routes/tiket.js"); ganti_baris(n3, asli3, 80); r.tekan("Control+s", 0.4); r.tanda("b13_akhir")
# b14 commit
term(); r.terminal("rm test/ambil-ai.test.js", cps=30, tunggu=0.4); r.tekan("Control+l", 0.3)
r.tanda("b14"); r.terminal("git add .", tunggu=0.6); r.terminal('git commit -m "Laporan dan test"', tunggu=1.5); r.label("Commit", 2.5); time.sleep(2.5); r.tanda("b14_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
subprocess.run(f"cd {P} && git tag -f bab-11", shell=True)
