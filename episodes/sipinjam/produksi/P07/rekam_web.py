import sys, time; sys.path.insert(0, "/home/user/pinjam/alat")
from webbantu import Peramban, server, matikan
# 1) daftar alat dari proyek kita
server()
w = Peramban("/home/user/pinjam/P07/web", devtools=False)
w.mulai(); w.kamera(None); time.sleep(0.6); w.tanda("mulai")
w.alamat("http://localhost:8000", tampil="localhost:8000", jeda=1.5); w.gerak(900, 420); w.tanda("muncul"); w.label("Dua belas alat, langsung dari database", 5); time.sleep(3.0)
w.gulir(500, 2.0); time.sleep(1.5); w.gulir(-500, 1.5); time.sleep(1.5); w.tanda("akhir"); w.selesai(); matikan()
# 2) SQL injection di aplikasi contoh bergaya AI
server("/home/user/pinjam-ai", 8001)
w = Peramban("/home/user/pinjam/P07/web_ai", devtools=False)
w.mulai(); w.kamera(None); time.sleep(0.6); w.tanda("mulai")
w.alamat("http://localhost:8001", tampil="localhost:8001", jeda=1.5); w.label("Contoh kode bergaya hasil AI", 6.0); time.sleep(2.0)
w.kam("form.login", zoom=1.6); time.sleep(1.0); w.tanda("ketik"); w.ketik("input[name=username]", "' OR 1=1 -- ", cps=5); time.sleep(2.5)
w.tanda("sandi"); w.ketik("input[name=sandi]", "apasaja", cps=8); time.sleep(1.5)
w.tanda("masuk"); w.klik("form.login button", jeda=1.5); w.kamera(None); time.sleep(0.8); w.kam(rect=[960, 0, 960, 110], pad=0); w.label("Masuk sebagai Bu Sari, admin, tanpa kata sandi", 6.0); time.sleep(7.0)
w.kamera(None); time.sleep(2.0); w.tanda("akhir"); w.selesai(); matikan(8001)
