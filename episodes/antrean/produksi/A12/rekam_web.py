"""A12: aplikasi online lewat Nginx + HTTPS (demo lokal), lalu alur lengkap pelanggan, petugas, dan TV."""
import sys, time, json, ssl, subprocess, http.cookiejar, urllib.request, urllib.error; sys.path.insert(0, "/home/user/antre/alat")
U = "https://antre.bengkelmajujaya.test"; SRV = "/home/user/server/siantre"
ctx = ssl.create_default_context(cafile="/tmp/claude-0/ca/ca.pem"); ctx.verify_flags &= ~ssl.VERIFY_X509_STRICT  # CA demo lokal buatan sendiri
jar = http.cookiejar.CookieJar()
op = urllib.request.build_opener(urllib.request.ProxyHandler({}), urllib.request.HTTPSHandler(context=ctx), urllib.request.HTTPCookieProcessor(jar))
def kirim(path, data=None):
    req = urllib.request.Request(U + path, data=json.dumps(data or {}).encode(), headers={"Content-Type": "application/json"}, method="POST")
    try: return json.loads(op.open(req).read())
    except urllib.error.HTTPError as e: print("HTTP", e.code, path); return {}
subprocess.run(f"cd {SRV} && docker compose exec -T db psql -q -U postgres antrean -c 'TRUNCATE tickets, ticket_events RESTART IDENTITY CASCADE'", shell=True)
kirim("/api/login", {"username": "dina", "password": "rahasia123"})
for _ in range(3): kirim("/api/tiket", {"service_id": 2})
for _ in range(3): kirim("/api/loket/1/panggil")
from rekam_web import Web
A = ["--no-proxy-server"]
w = Web("/home/user/antre/A12/web", "about:blank", devtools=False, args=A)
w.mulai(); w.kamera(None); time.sleep(0.5)
# beat 8: gembok HTTPS
w.tanda("https"); w.pg.goto("http://antre.bengkelmajujaya.test/"); time.sleep(1.5)
w.kamera([0, 0, 900, 120]); w.label("Dialihkan ke " + w.pg.url.rstrip("/"), 4, "bawah"); time.sleep(4.5); w.kamera(None); time.sleep(0.5); w.tanda("https_akhir")
# beat 14: alur lengkap
w.pg.goto(U + "/tv.html"); time.sleep(1.5); w.pg.evaluate("document.documentElement.style.zoom = '0.72'; document.documentElement.style.width = '1470px'; document.body.style.overflow = 'hidden'"); time.sleep(0.5); w.pg.click("#suara"); time.sleep(0.5)
hp = w.pw.chromium.launch_persistent_context("/tmp/claude-0/prof_hp", headless=False, no_viewport=True, locale="id-ID", timezone_id="Asia/Jakarta",
    args=[f"--app={U}/", "--window-size=420,800", "--window-position=1100,40", "--force-device-scale-factor=1.6667", "--test-type", "--disable-features=Translate,TranslateUI", "--no-first-run", *A],
    ignore_default_args=["--enable-automation"])
time.sleep(2.5); h = hp.pages[0]
def ketuk(loc):
    b = loc.bounding_box(); h.mouse.move(b["x"] + b["width"] / 2, b["y"] + b["height"] / 2); time.sleep(0.5); h.mouse.click(b["x"] + b["width"] / 2, b["y"] + b["height"] / 2)
w.tanda("final"); w.label("Pelanggan membuka alamat dari QR di HP-nya", 3); time.sleep(3.0)
ketuk(h.locator("button.tombol").nth(1)); time.sleep(2.0); w.label("Nomor B-004", 2.5); time.sleep(3.0)
w.label("Petugas Dina menekan Panggil", 2); time.sleep(2.0); kirim("/api/loket/1/panggil"); time.sleep(1.0)
w.label("TV berbunyi, HP berubah warna", 4); time.sleep(5.0); w.tanda("akhir")
hp.close(); w.selesai()
subprocess.run("python3 /home/user/antre/alat/pasca.py /home/user/antre/A12/web /home/user/antre/A12/web_cam.mp4", shell=True)
