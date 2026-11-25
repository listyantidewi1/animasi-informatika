import sys, time, subprocess; sys.path.insert(0, "/home/user/lapor/alat")
from webbantu import Peramban, server, matikan
P = "/home/user/proyek/silapor"
def bersih(): subprocess.run(["/home/user/lapor/alat/bersih.sh", P, "php artisan cache:clear -q"]); 
subprocess.run(f"rm -f {P}/storage/framework/sessions/*", shell=True); bersih(); server()
w = Peramban("/home/user/lapor/L05/web", devtools=False)
def masuk(email, sandi, cps=13):
    if email: w.ketik('input[name=email]', email, cps)
    w.ketik('input[name=password]', sandi, cps); w.klik('button.tombol', jeda=1.2)
def tengah():
    iw, ih = w.pg.evaluate("[innerWidth, innerHeight]"); w.kam(rect=[iw / 2 - 330, ih / 2 - 170, 660, 340], zoom=1.9, pad=0)
w.mulai(); w.kamera(None); time.sleep(0.6)
# b07: salah lalu benar
w.tanda("b07"); w.label("Server dijalankan dengan php artisan serve", 3.5); w.alamat("http://localhost:8000/masuk", tampil="localhost:8000/masuk", jeda=1.5)
w.kam("main", zoom=1.6); masuk("lina@nusabakti.test", "salahsandi"); w.tanda("b07_salah"); w.label("Pesan error tampil, email tidak hilang", 4.5); time.sleep(5.0)
w.tanda("b07_benar"); masuk(None, "rahasia123"); w.kamera(None); w.label("Lina berhasil masuk", 3.5); w.gerak(1050, 60); time.sleep(4.0); w.tanda("b07_akhir")
# b11: Lina ke /kelola = 403, Pak Hendra boleh
w.tanda("b11"); w.alamat("http://localhost:8000/kelola", tampil="localhost:8000/kelola", jeda=1.2); tengah(); w.label("Lina membuka /kelola: 403", 4.0); time.sleep(4.5); w.tanda("b11_403")
time.sleep(1.0); w.kamera(None); time.sleep(0.8); w.pg.go_back(); time.sleep(1.0); w.klik('button.tautan', jeda=1.2); w.kam("main", zoom=1.6); masuk("hendra@nusabakti.test", "rahasia123"); w.kamera(None); w.tanda("b11_hendra")
w.label("Pak Hendra: halaman kelola terbuka", 4.0); w.gerak(1050, 60); time.sleep(4.5); w.tanda("b11_akhir")
# b12: enam percobaan
w.klik('button.tautan', jeda=1.0); bersih(); w.tanda("b12"); w.kam("main", zoom=1.6)
for i in range(6):
    masuk("lina@nusabakti.test" if i == 0 else None, "tebakan%d" % (i + 1), cps=22)
    if i < 5: w.label(f"Percobaan ke-{i + 1}", 1.6); time.sleep(0.9)
tengah(); w.tanda("b12_429"); w.label("Percobaan keenam: 429, terlalu banyak percobaan", 5.0); time.sleep(5.5); w.tanda("b12_akhir")
w.selesai(); matikan(); bersih()
