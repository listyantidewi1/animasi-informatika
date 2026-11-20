import sys, time; sys.path.insert(0, "/home/user/pinjam/alat")
from webbantu import Peramban, server, matikan
def login(w, u, cps=9):
    w.ketik("input[name=username]", u, cps=cps); w.ketik("input[name=sandi]", "rahasia123", cps=12); time.sleep(0.5); w.klik("form.login button", jeda=1.5)
# 1) aplikasi kita: tiga peran
server()
w = Peramban("/home/user/pinjam/P08/web", devtools=False)
w.mulai(); w.kamera(None); time.sleep(0.6); w.tanda("mulai")
w.alamat("http://localhost:8000", tampil="localhost:8000", jeda=1.5); w.tanda("rafi"); w.kam("form.login", zoom=1.5); login(w, "rafi"); w.kamera(None); w.label("Rafi tiba di daftar alat", 4.0); time.sleep(4.5)
w.tanda("admin"); w.kam_alamat(); w.alamat("http://localhost:8000/admin/alat.php", tampil="localhost:8000/admin/alat.php", cps=10, jeda=1.5)
w.tanda("tolak"); w.label("403: Kamu tidak punya akses ke halaman ini", 6.0); time.sleep(7.0)
w.kamera(None); w.tanda("keluar"); w.pg.goto("http://localhost:8000/keluar.php"); time.sleep(1.5); w.kam("form.login", zoom=1.5); login(w, "sari", cps=10); w.kamera(None)
w.tanda("sari"); w.label("Bu Sari, admin: halaman admin terbuka", 5.0); time.sleep(6.5); w.tanda("akhir"); w.selesai(); matikan()
# 2) aplikasi contoh bergaya AI: menu disembunyikan
server("/home/user/pinjam-ai", 8001)
w = Peramban("/home/user/pinjam/P08/web_ai", devtools=False)
w.mulai(); w.kamera(None); time.sleep(0.6); w.tanda("mulai")
w.alamat("http://localhost:8001", tampil="localhost:8001", jeda=1.5); w.label("Contoh kode bergaya hasil AI", 5.0); w.kam("form.login", zoom=1.5); login(w, "rafi", cps=12); w.kamera(None); time.sleep(0.8)
w.tanda("menu"); w.kam("nav", zoom=1.5); w.label("Menu Rafi hanya dua", 4.5); time.sleep(5.0)
w.tanda("alamat"); w.kam_alamat(); w.alamat("http://localhost:8001/admin/pengguna.php", tampil="localhost:8001/admin/pengguna.php", cps=9, jeda=1.5)
w.kamera(None); w.tanda("terbuka"); w.label("Halaman admin terbuka untuk Rafi", 5.0); time.sleep(2.5); w.kam("form.kartu", zoom=1.3); time.sleep(8.0); w.kamera(None); time.sleep(2.0); w.tanda("akhir"); w.selesai(); matikan(8001)
