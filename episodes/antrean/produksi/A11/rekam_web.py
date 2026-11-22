"""A11: halaman laporan Pak Rahmat (admin) dengan grafik jam tersibuk."""
import sys, time, subprocess; sys.path.insert(0, "/home/user/antre/alat")
P = "/home/user/proyek/siantre"
subprocess.run("fuser -k 3000/tcp", shell=True, stderr=subprocess.DEVNULL)
subprocess.run("psql -U postgres -d antrean -q -f /home/user/antre/kode/A11/data-laporan.sql", shell=True)
srv = subprocess.Popen(f"cd {P} && SESSION_SECRET=rahasia-lokal DATABASE_URL=postgres://postgres@localhost/antrean exec node src/server.js", shell=True); time.sleep(1.5)
from rekam_web import Web
w = Web("/home/user/antre/A11/web", "http://localhost:3000/laporan.html", devtools=False)
w.mulai(); w.kamera(None); time.sleep(1.0); w.tanda("laporan")
w.pg.click("#username"); w.pg.keyboard.type("pakrahmat", delay=80); w.pg.click("#password"); w.pg.keyboard.type("rahasia123", delay=60); time.sleep(0.3)
w.pg.click("#formLogin button"); time.sleep(1.5); w.label("Login sebagai Pak Rahmat (admin)", 2.5); time.sleep(2.5)
w.label("Rata-rata tunggu dan pelanggan yang batal", 3.5); time.sleep(3.5)
w.pg.mouse.wheel(0, 500); time.sleep(1.2); w.label("Jam 09.00 paling ramai", 4); time.sleep(4.5); w.tanda("akhir")
w.selesai(); srv.terminate()
subprocess.run("python3 /home/user/antre/alat/pasca.py /home/user/antre/A11/web /home/user/antre/A11/web_cam.mp4", shell=True)
