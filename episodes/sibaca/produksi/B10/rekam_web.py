import sys, time; sys.path.insert(0, "/home/user/baca/alat")
from webbantu import Peramban
from tulis import server, matikan, sh, db
print(sh("git reset -q --hard bab-10 && git log --oneline | head -1").stdout); db("contoh"); server(vite=False, mode="start")
w = Peramban("/home/user/baca/B10/web", devtools=False)
luar = []
w.pg.on("request", lambda q: None if q.url.startswith(("http://localhost:3000", "about:", "data:", "chrome")) else luar.append(q.url))
w.mulai(); w.kamera(None); time.sleep(1.0)
w.tanda("buka"); w.kam_alamat(1.5); w.alamat("http://localhost:3000", tampil="localhost:3000", cps=10, jeda=1.5)
w.tanda("port"); w.label("Port 3000, bukan 5173", 4.5); time.sleep(5.0)
w.tanda("masuk"); w.kamera(None); time.sleep(0.4); w.ketik("form input >> nth=0", "2425102", 10); w.ketik("input[type=password]", "rahasia123", 12); w.klik("form button", jeda=1.5)
w.label("Satu program melayani tampilan sekaligus datanya", 4.0); time.sleep(4.5); w.tanda("masuk_akhir")
w.selesai(); matikan(); print("PERMINTAAN KE LUAR:", luar)
