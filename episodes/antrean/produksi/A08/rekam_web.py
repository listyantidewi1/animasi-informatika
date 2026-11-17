import sys, time, subprocess; sys.path.insert(0, "/home/user/antre/alat")
subprocess.run("fuser -k 3000/tcp 4003/tcp", shell=True, stderr=subprocess.DEVNULL)
E = "cd /home/user/proyek/siantre && SESSION_SECRET=rahasia-lokal DATABASE_URL=postgres://postgres@localhost/antrean exec node "
srv = subprocess.Popen(E + "src/server.js", shell=True); ai = subprocess.Popen(E + "uji/tiket-ai.js", shell=True); time.sleep(1.5)
from rekam_web import Web, CW
w = Web("/home/user/antre/A08/web", "http://localhost:3000/halo", panel="application")
def klik(teks):
    try: w.dt.get_by_text(teks, exact=True).first.click(timeout=4000)
    except Exception as e: print("gagal", teks, e)
w.mulai(); w.kamera(None); time.sleep(0.4); w.tanda("kue")
w.pg.evaluate("""fetch('/api/login', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username: 'dina', password: 'rahasia123'})})""")
time.sleep(1.0); w.label("Login sebagai dina", 2.5); time.sleep(1.0)
klik("Application"); time.sleep(1.5)
bx = w.dt.get_by_text("Cookies", exact=True).first.evaluate("e => { const r = e.parentElement.getBoundingClientRect(); return [r.x, r.y, r.height] }")
w.dt.mouse.move(bx[0] + 10, bx[1] + bx[2] / 2); time.sleep(0.4); w.dt.mouse.click(bx[0] + 10, bx[1] + bx[2] / 2); time.sleep(0.8)
if w.dt.get_by_text("Cookies", exact=True).first.evaluate("e => e.parentElement.getAttribute('aria-expanded')") != "true":
    print("panah gagal, expand()"); w.dt.get_by_text("Cookies", exact=True).first.evaluate("e => e.parentElement.treeElement.expand()"); time.sleep(0.6)
try: w.dt.get_by_text("http://localhost:3000", exact=True).filter(visible=True).first.click(timeout=4000)
except Exception as e: print("gagal asal kue", e)
time.sleep(1.0)
w.kamera_bawah(); w.label("Cookie sesi: HttpOnly, SameSite Lax", 4); time.sleep(5.0); w.tanda("kue_akhir")
w.kamera(None); klik("Network"); time.sleep(0.5)
w.tanda("idor"); w.pg.goto("http://localhost:4003/tiket/124"); time.sleep(0.8); w.kamera_atas(); w.label("Tiket sendiri: /tiket/124", 3); time.sleep(3.0)
w.tanda("idor_ganti")
for n in (123, 122):
    w.pg.goto(f"http://localhost:4003/tiket/{n}"); time.sleep(0.8); w.label(f"/tiket/{n}: data orang lain!", 2.5); time.sleep(2.8)
w.tanda("idor_aman"); w.kamera(None); w.pg.goto("http://localhost:3000/api/tiket/123"); time.sleep(0.8); w.kamera_atas(); w.label("Versi kita: kode acak, 404", 3); time.sleep(3.5)
w.kamera(None); time.sleep(0.8); w.tanda("akhir"); w.selesai(); srv.terminate(); ai.terminate()
subprocess.run("python3 /home/user/antre/alat/pasca.py /home/user/antre/A08/web /home/user/antre/A08/web_cam.mp4", shell=True)
