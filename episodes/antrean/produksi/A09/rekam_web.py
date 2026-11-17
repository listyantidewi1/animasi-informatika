"""A09: layar TV (kiri) dan HP pelanggan (kanan) berdampingan; petugas memanggil lewat request."""
import sys, time, json, subprocess, http.cookiejar, urllib.request; sys.path.insert(0, "/home/user/antre/alat")
P = "/home/user/proyek/siantre"
subprocess.run("fuser -k 3000/tcp", shell=True, stderr=subprocess.DEVNULL)
subprocess.run("psql -U postgres -d antrean -qc 'TRUNCATE tickets, ticket_events RESTART IDENTITY CASCADE'", shell=True)
srv = subprocess.Popen(f"cd {P} && SESSION_SECRET=rahasia-lokal DATABASE_URL=postgres://postgres@localhost/antrean exec node src/server.js", shell=True); time.sleep(1.5)
jar = http.cookiejar.CookieJar(); op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
def kirim(path, data=None):
    req = urllib.request.Request("http://localhost:3000" + path, data=json.dumps(data or {}).encode(), headers={"Content-Type": "application/json"}, method="POST")
    return json.loads(op.open(req).read())
kode = [kirim("/api/tiket", {"service_id": 1})["code"] for _ in range(4)][2]   # HP memegang tiket ketiga (A-003)
kirim("/api/login", {"username": "dina", "password": "rahasia123"})
from rekam_web import Web, CW, CH
w = Web("/home/user/antre/A09/web", "http://localhost:3000/tv.html", devtools=False, lebar=1060)
hp = w.pw.chromium.launch_persistent_context("/tmp/claude-0/prof_hp", headless=False, no_viewport=True, locale="id-ID", timezone_id="Asia/Jakarta",
    args=[f"--app=http://localhost:3000/tiket.html?kode={kode}", "--window-size=420,780", "--window-position=1090,40", "--force-device-scale-factor=1.6667", "--test-type", "--disable-features=Translate,TranslateUI", "--no-first-run"],
    ignore_default_args=["--enable-automation"])
time.sleep(2); hpg = hp.pages[0]
for pg in (w.pg, hpg):
    pg.evaluate("""() => { window.__ubah = 0; const el = document.getElementById('nomor') || document.getElementById('info');
      new MutationObserver(() => { if (!window.__ubah) window.__ubah = Date.now(); }).observe(el, {childList: true, characterData: true, subtree: true}); }""")
def panggil(lab=True):
    for pg in (w.pg, hpg): pg.evaluate("() => { window.__ubah = 0; }")
    t0 = time.time() * 1000; kirim("/api/loket/1/panggil"); time.sleep(0.6)
    return max(pg.evaluate("() => window.__ubah") - t0 for pg in (w.pg, hpg))
w.mulai(); w.kamera(None); time.sleep(1.5); w.tanda("uji")
w.label("Kiri: layar TV. Kanan: HP pelanggan (A-003)", 3.5); time.sleep(3.5)
for i in range(3):
    w.label("Petugas Dina menekan Panggil", 1.2); time.sleep(1.2)
    ms = panggil(); w.label(f"TV dan HP berubah {ms:.0f} ms setelah tombol ditekan", 3); time.sleep(3.2)
w.tanda("suara"); w.kamera([0, 0, 1060, 300]); time.sleep(0.8)
box = w.pg.locator("#suara").bounding_box(); w.pg.mouse.move(box["x"] + 40, box["y"] + 20); time.sleep(0.6); w.pg.mouse.click(box["x"] + 40, box["y"] + 20)
w.label("Satu klik saat bengkel buka", 2.5); time.sleep(2.5); w.kamera(None)
panggil(); w.label("Suara: Nomor A, 4. Silakan ke Loket 1.", 4); time.sleep(4.5); w.tanda("akhir")
hp.close(); w.selesai(); srv.terminate()
subprocess.run("python3 /home/user/antre/alat/pasca.py /home/user/antre/A09/web /home/user/antre/A09/web_cam.mp4", shell=True)
