import sys, time; sys.path.insert(0, "/home/user/pinjam/alat")
from webbantu import Peramban, server, matikan
server()
w = Peramban("/home/user/pinjam/P01/web", devtools=False)
w.mulai(); w.kamera(None); time.sleep(0.6); w.tanda("mulai")
w.alamat("http://localhost:8000", tampil="localhost:8000", jeda=1.5); w.gerak(700, 300)
w.tanda("muncul"); w.kam(rect=[0, 0, 1000, 300], pad=0); w.label("PHP dan MySQL sudah tersambung", 5); time.sleep(7.0); w.kamera(None); time.sleep(1.0); w.tanda("akhir"); w.selesai(); matikan()
