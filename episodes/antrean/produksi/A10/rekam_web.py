"""A10: HP pelanggan (kanan) di atas layar TV, lalu layar petugas, layar TV, dan versi AI (innerHTML)."""
import sys, time, json, subprocess, http.cookiejar, urllib.request, urllib.error; sys.path.insert(0, "/home/user/antre/alat")
P = "/home/user/proyek/siantre"
CMD = f"cd {P} && SESSION_SECRET=rahasia-lokal DATABASE_URL=postgres://postgres@localhost/antrean exec node src/server.js"
subprocess.run("fuser -k 3000/tcp 4005/tcp", shell=True, stderr=subprocess.DEVNULL)
subprocess.run("""psql -U postgres -d antrean -qc 'TRUNCATE tickets, ticket_events RESTART IDENTITY CASCADE' -c "DELETE FROM bookings WHERE code = 'xss-demo'" -c "INSERT INTO bookings (slot_id, name, phone, code) VALUES ((SELECT min(id) FROM slots), '<h1 style=\\"font-size:120px;color:#ef4444;margin:0\\">BENGKEL TUTUP</h1>', '081234567890', 'xss-demo')" """, shell=True)
srv = subprocess.Popen(CMD, shell=True); time.sleep(1.5)
ai = subprocess.Popen(f"cd {P} && exec node uji/tv-ai.js", shell=True); time.sleep(1.0)
jar = http.cookiejar.CookieJar(); op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
def kirim(path, data=None):
    req = urllib.request.Request("http://127.0.0.1:3000" + path, data=json.dumps(data or {}).encode(), headers={"Content-Type": "application/json"}, method="POST")
    try: return json.loads(op.open(req).read())
    except urllib.error.HTTPError as e: print("HTTP", e.code, path); return {}
for _ in range(2): kirim("/api/tiket", {"service_id": 1})      # dua orang sudah antre lebih dulu
kirim("/api/login", {"username": "dina", "password": "rahasia123"})
from rekam_web import Web, CW, CH
w = Web("/home/user/antre/A10/web", "http://localhost:3000/tv.html", devtools=False)
hp = w.pw.chromium.launch_persistent_context("/tmp/claude-0/prof_hp", headless=False, no_viewport=True, locale="id-ID", timezone_id="Asia/Jakarta",
    args=["--app=http://localhost:3000/", "--window-size=420,800", "--window-position=1060,30", "--force-device-scale-factor=1.6667", "--test-type", "--disable-features=Translate,TranslateUI", "--no-first-run"],
    ignore_default_args=["--enable-automation"])
time.sleep(2); h = hp.pages[0]; HP = [1060, 30, 420, 800]
def ketuk(loc):
    b = loc.bounding_box(); h.mouse.move(b["x"] + b["width"] / 2, b["y"] + b["height"] / 2); time.sleep(0.5); h.mouse.click(b["x"] + b["width"] / 2, b["y"] + b["height"] / 2)
w.mulai(); w.kamera(HP); time.sleep(1.0)
# beat 5: ambil nomor
w.tanda("hp"); w.label("Halaman ambil nomor di HP", 2.5); time.sleep(2.5)
ketuk(h.locator("button.tombol").first); time.sleep(2.0); w.label("Pindah ke halaman tiket", 2.5); time.sleep(2.5); w.tanda("hp_akhir")
# beat 6: jaringan lambat
w.tanda("lambat"); h.goto("http://localhost:3000/"); time.sleep(1.2)
cdp = hp.new_cdp_session(h); cdp.send("Network.enable"); cdp.send("Network.emulateNetworkConditions", {"offline": False, "latency": 2000, "downloadThroughput": 50000, "uploadThroughput": 50000})
w.label("Jaringan diperlambat (Slow 3G)", 3); time.sleep(1.5)
ketuk(h.locator("button.tombol").nth(1)); time.sleep(0.6); w.label("Tombol langsung nonaktif: tidak ada nomor ganda", 3.5); time.sleep(4.5)
cdp.send("Network.emulateNetworkConditions", {"offline": False, "latency": 0, "downloadThroughput": -1, "uploadThroughput": -1}); time.sleep(1.5); w.tanda("lambat_akhir")
# beat 7: tiket berubah sendiri (pelanggan A-003, dua orang di depan)
h.goto("http://localhost:3000/"); time.sleep(1.2); ketuk(h.locator("button.tombol").first); time.sleep(2.0)
w.tanda("tiket"); w.label("Masih ada dua orang di depan", 2.5); time.sleep(2.5)
for i in range(3):
    w.label("Petugas memanggil", 1.2); time.sleep(1.2); kirim("/api/loket/1/panggil"); time.sleep(2.6)
w.label("Giliranmu: layar berubah tanpa refresh", 3); time.sleep(3.0); w.tanda("tiket_akhir")
# beat 8: koneksi putus, tiket tidak ada
w.tanda("putus"); srv.terminate(); time.sleep(0.5); subprocess.run("fuser -k 3000/tcp", shell=True, stderr=subprocess.DEVNULL); time.sleep(1.5)
w.label("Server mati sebentar", 3); time.sleep(3.0)
srv = subprocess.Popen(CMD, shell=True); time.sleep(3.5); kirim("/api/login", {"username": "dina", "password": "rahasia123"}); w.label("Tersambung lagi", 2); time.sleep(2.0)
h.goto("http://localhost:3000/tiket.html?kode=salahketik"); time.sleep(1.2); w.label("Kode salah: pesan jelas dan jalan keluar", 3.5); time.sleep(3.5); w.tanda("putus_akhir")
hp.close()
# beat 9: layar petugas (Dina, Loket 1)
w.tanda("petugas"); w.kamera(None); w.pg.goto("http://localhost:3000/petugas.html"); time.sleep(1.2)
w.pg.click("#username"); w.pg.keyboard.type("dina", delay=90); w.pg.click("#password"); w.pg.keyboard.type("rahasia123", delay=70); time.sleep(0.4)
w.pg.click("#formLogin button"); time.sleep(1.5); w.label("Login sebagai Dina, Loket 1", 2.5); time.sleep(2.5)
w.pg.click("#panggil"); time.sleep(1.5); w.label("Dipanggil: ulang, lewati, atau layani", 3); time.sleep(3.0)
w.pg.click("[data-aksi=layani]"); time.sleep(1.5); w.label("Sedang dilayani: hanya tombol Selesai", 3); time.sleep(3.5); w.tanda("petugas_akhir")
# beat 10: layar TV
w.tanda("tv"); w.pg.goto("http://localhost:3000/tv.html"); time.sleep(1.5)
w.pg.click("#suara"); time.sleep(0.5); kirim("/api/tiket", {"service_id": 1}); kirim("/api/tiket", {"service_id": 1}); kirim("/api/tiket", {"service_id": 1}); time.sleep(0.6); kirim("/api/loket/1/panggil"); time.sleep(2.0); kirim("/api/loket/1/panggil"); time.sleep(1.0)
w.label("Nomor besar, riwayat, jumlah menunggu, dan QR", 4); time.sleep(5.0); w.tanda("tv_akhir")
# beat 13: versi AI menampilkan nama sebagai HTML
w.tanda("xss"); w.pg.goto("http://localhost:4005/"); time.sleep(1.5); w.label("Nama pemesan berisi kode HTML", 3.5); time.sleep(4.5); w.tanda("akhir")
w.selesai(); srv.terminate(); ai.terminate()
subprocess.run("python3 /home/user/antre/alat/pasca.py /home/user/antre/A10/web /home/user/antre/A10/web_cam.mp4", shell=True)
