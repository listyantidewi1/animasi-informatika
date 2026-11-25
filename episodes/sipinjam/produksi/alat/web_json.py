"""Rekam browser + DevTools membuka satu URL JSON di server proyek: python3 web_json.py EP /api/slot "Label" [nama=web]"""
import sys, time, subprocess; sys.path.insert(0, "/home/user/pinjam/alat")
ep, path, lab = sys.argv[1], sys.argv[2], sys.argv[3]; nama = sys.argv[4] if len(sys.argv) > 4 else "web"
subprocess.run("fuser -k 3000/tcp", shell=True, stderr=subprocess.DEVNULL)
srv = subprocess.Popen("cd /home/user/proyek/sipinjam && DATABASE_URL=postgres://postgres@localhost/antrean exec node src/server.js", shell=True); time.sleep(1.5)
from rekam_web import Web
w = Web(f"/home/user/pinjam/{ep}/{nama}", "about:blank")
w.mulai(); w.kamera(None); time.sleep(0.4); w.tanda("mulai")
w.pg.goto(f"http://localhost:3000{path}"); time.sleep(0.8)
w.pg.mouse.move(400, 200); w.pg.mouse.click(104, 14); time.sleep(0.6)
w.kamera_atas(); w.label(lab, 4); time.sleep(4.5)
w.kamera(None); time.sleep(1.0); w.tanda("akhir"); w.selesai(); srv.terminate()
subprocess.run(f"python3 /home/user/pinjam/alat/pasca.py /home/user/pinjam/{ep}/{nama} /home/user/pinjam/{ep}/{nama}_cam.mp4", shell=True)
