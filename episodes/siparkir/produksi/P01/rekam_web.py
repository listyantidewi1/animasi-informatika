import sys, time; sys.path.insert(0, "/home/user/parkir/alat")
from webbantu import Peramban, server, matikan
server()
w = Peramban("/home/user/parkir/P01/web", devtools=False)
w.mulai(); w.kamera(None); time.sleep(0.6); w.tanda("mulai")
w.alamat("http://localhost:8000", tampil="localhost:8000", jeda=1.5); w.gerak(700, 400)
w.label("Halaman selamat datang Laravel", 4); time.sleep(5.0); w.tanda("akhir"); w.selesai(); matikan()
