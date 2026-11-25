import sys, time, subprocess, os; sys.path.insert(0, "/home/user/parkir/alat")
from webbantu import Peramban, server, matikan
from rekam_web import DSF
P = "/home/user/proyek/siparkir"
X = lambda *k: subprocess.run(["xdotool", *k], env=dict(os.environ, DISPLAY=":99"))
subprocess.run(["mysql", "siparkir", "-e", "SET FOREIGN_KEY_CHECKS=0; TRUNCATE parkings; TRUNCATE vehicles; TRUNCATE activity_logs; TRUNCATE sessions; SET FOREIGN_KEY_CHECKS=1;"])
subprocess.run(["/home/user/parkir/alat/bersih.sh", P, "php artisan cache:clear -q"]); server(waktu="2026-11-23 07:15:00")
w = Peramban("/home/user/parkir/P09/web", devtools=False)
MASUK = 'form[action="/parkir"]'
w.mulai(); w.kamera(None); time.sleep(0.6)
w.alamat("http://localhost:8000", tampil="localhost:8000", jeda=1.2)
w.ketik('input[name=email]', "joko@nusabakti.test", 20); w.ketik('input[name=password]', "rahasia123", 20); w.klik('button.tombol', jeda=1.2)
w.tanda("b06"); w.label("Pak Joko di halaman parkir", 2.5); time.sleep(2.5)
w.tanda("b06_masuk"); w.kam(MASUK, zoom=1.5); w.ketik('input[name=plate]', "N 1234 AB", 9); w.klik(MASUK + ' button.tombol', jeda=1.5)
w.kam(".struk", zoom=1.7); w.label("Tiket dengan kode QR", 4.0); time.sleep(4.5)
# tombol Cetak: klik dengan xdotool, karena window.print() menahan halaman selama jendela cetak terbuka
w.kamera(None); time.sleep(0.6); x, y, bw, bh = w.kotak(".aksi button"); w.gerak(x + bw / 2, y + bh / 2); time.sleep(0.4)
w.tanda("b06_cetak"); X("click", "1"); time.sleep(4.0)
w.tanda("b06_pratinjau"); w.label("Pratinjau cetak: kertas sempit, selebar 58 mm", 7.0); time.sleep(8.0)
w.tanda("b06_margin"); w.label("Pilih printer kasirmu, lalu atur Margins: None", 7.0); time.sleep(8.0); w.tanda("b06_akhir")
X("key", "Escape"); time.sleep(1.0); w.selesai()
subprocess.run(["mysql", "siparkir", "-e", "SET FOREIGN_KEY_CHECKS=0; TRUNCATE parkings; TRUNCATE vehicles; TRUNCATE activity_logs; SET FOREIGN_KEY_CHECKS=1;"]); matikan()
