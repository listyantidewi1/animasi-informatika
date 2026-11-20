import sys, time, subprocess; sys.path.insert(0, "/home/user/parkir/alat")
from webbantu import Peramban, server, matikan
P = "/home/user/proyek/siparkir"
subprocess.run(f"rm -f {P}/storage/framework/sessions/*", shell=True); subprocess.run(["/home/user/parkir/alat/bersih.sh", P, "php artisan cache:clear -q"]); server()
w = Peramban("/home/user/parkir/P05/web", devtools=False)
def masuk(email, sandi="rahasia123", cps=13):
    w.ketik('input[name=email]', email, cps); w.ketik('input[name=password]', sandi, cps); w.klik('button.tombol', jeda=1.2)
def tengah():
    iw, ih = w.pg.evaluate("[innerWidth, innerHeight]"); w.kam(rect=[iw / 2 - 330, ih / 2 - 170, 660, 340], zoom=1.9, pad=0)
w.mulai(); w.kamera(None); time.sleep(0.6)
w.tanda("b08"); w.alamat("http://localhost:8000", tampil="localhost:8000", jeda=1.5); w.label("Belum login: diarahkan ke halaman masuk", 3.5); time.sleep(2.0)
w.tanda("b08_joko"); w.kam("main", zoom=1.6); masuk("joko@nusabakti.test"); w.kamera(None); w.label("Pak Joko tiba di halaman parkir", 3.5); w.gerak(1050, 60); time.sleep(4.0)
w.tanda("b08_ketik"); w.kam_alamat(); w.alamat("http://localhost:8000/admin/area", tampil="localhost:8000/admin/area", cps=11, jeda=1.2); w.tanda("b08_403"); tengah(); w.label("403: terlarang", 3.0); time.sleep(3.5)
w.tanda("b08_tahu"); w.kamera(None); w.label("Tahu alamatnya, tetap tidak bisa masuk", 4.0); time.sleep(4.5)
w.tanda("b08_keluar"); w.pg.go_back(); time.sleep(1.2); w.klik('button.tautan', jeda=1.2); w.kam("main", zoom=1.6); masuk("sinta@nusabakti.test", cps=18); w.kamera(None)
w.tanda("b08_sinta"); w.label("Bu Sinta (admin): halaman admin terbuka", 4.0); w.gerak(1050, 60); time.sleep(4.5); w.tanda("b08_akhir")
w.klik('button.tautan', jeda=1.0); w.selesai(); matikan()
