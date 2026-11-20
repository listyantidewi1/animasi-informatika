import sys, time; sys.path.insert(0, "/home/user/baca/alat")
from webbantu import Peramban
from tulis import server, matikan, sh
print(sh("git reset -q --hard bab-01 && git log --oneline | head -1").stdout)
server()
w = Peramban("/home/user/baca/B01/web", devtools=False)
w.mulai(); w.kamera(None); time.sleep(1.0)
w.tanda("halo"); w.kam_alamat(1.5); w.alamat("http://localhost:3000/api/halo", tampil="localhost:3000/api/halo", cps=11, jeda=1.5)
w.label("Server kita menjawab dengan JSON", 4.5); time.sleep(5.5); w.tanda("halo_akhir")
w.kamera(None); time.sleep(1.0)
w.tanda("vite"); w.kam_alamat(1.5); w.alamat("http://localhost:5173", tampil="localhost:5173", cps=11, jeda=1.5); w.kamera(None)
w.label("Halaman contoh dari Vite", 4.0); time.sleep(6.0); w.tanda("vite_akhir")
w.selesai(); matikan()
