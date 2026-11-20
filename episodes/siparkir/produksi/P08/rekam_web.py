import sys, time, subprocess, os; sys.path.insert(0, "/home/user/parkir/alat")
from webbantu import Peramban, server, matikan
P = os.environ.get("PROYEK", "/home/user/proyek/siparkir"); DB = os.environ.get("DB", "siparkir")  # rekam ulang: salinan proyek pada tag bab-08
subprocess.run(["mysql", DB, "-e", "SET FOREIGN_KEY_CHECKS=0; TRUNCATE parkings; TRUNCATE vehicles; TRUNCATE activity_logs; TRUNCATE sessions; SET FOREIGN_KEY_CHECKS=1;"])
subprocess.run(["/home/user/parkir/alat/bersih.sh", P, "php artisan cache:clear -q"]); server(P, waktu="2026-11-23 07:00:00")
w = Peramban("/home/user/parkir/P08/web", devtools=False)
def masuk(email="joko@nusabakti.test", cps=20):
    w.ketik('input[name=email]', email, cps); w.ketik('input[name=password]', "rahasia123", cps); w.klik('button.tombol', jeda=1.2)
MASUK = 'form[action="/parkir"]'; CARI = 'form[action="/parkir/cari"]'
w.mulai(); w.kamera(None); time.sleep(0.6)
w.alamat("http://localhost:8000", tampil="localhost:8000", jeda=1.2); masuk()
# b07: motor masuk
w.tanda("b07"); w.label("Pak Joko, petugas jaga pagi", 3.0); w.gerak(1500, 40); time.sleep(3.0)
w.tanda("b07_plat"); w.kam(MASUK, zoom=1.5); w.ketik('input[name=plate]', "n 1234 ab", 7); time.sleep(0.8); w.label("Huruf kecil dan spasi", 2.5); time.sleep(2.5); w.klik(MASUK + ' button.tombol', jeda=1.2)
w.tanda("b07_tiket"); w.kam(".kartu.sempit", zoom=1.5); w.label("Tiket P-000001, plat sudah rapi: N1234AB", 4.0); time.sleep(4.3)
w.kamera(None); w.klik('.kartu.sempit a.tombol', jeda=1.0); w.kam(".ringkas", zoom=1.4); w.label("Area Motor: terisi 1 dari 40", 3.5); time.sleep(4.0); w.tanda("b07_akhir")
# b08: plat yang sama ditolak
w.kamera(None); time.sleep(0.6); w.tanda("b08"); w.kam(MASUK, zoom=1.5); w.ketik('input[name=plate]', "N 1234 AB", 9); w.klik(MASUK + ' button.tombol', jeda=1.2)
w.tanda("b08_tolak"); w.kam("ul.galat", zoom=1.6); w.label("Ditolak: masih tercatat di dalam", 5.0); time.sleep(8.0); w.tanda("b08_akhir")
# b09: 2 jam 20 menit kemudian
w.kamera(None); time.sleep(0.5); server(P, waktu="2026-11-23 09:20:25"); w.pg.goto("http://localhost:8000/parkir"); time.sleep(1.0)
if "/masuk" in w.pg.url: masuk(); time.sleep(0.5)
w.tanda("b09"); w.label("Dua jam dua puluh menit kemudian", 3.0); time.sleep(3.2)
w.tanda("b09_cari"); w.kam(CARI, zoom=1.5); w.ketik('input[name=q]', "P-000001", 7); w.klik(CARI + ' button.tombol', jeda=1.2)
w.tanda("b09_biaya"); w.kam("form.kartu.sempit", zoom=1.4); w.label("Lama parkir 2 jam 20 menit, biaya Rp4.000", 8.5); time.sleep(9.0)
w.tanda("b09_keluar"); w.klik('form.kartu.sempit button.tombol', jeda=1.2); w.kam(".kartu.sempit", zoom=1.4); w.label("Struk: dibayar Rp4.000", 3.5); time.sleep(3.8)
w.kamera(None); w.klik('.kartu.sempit a.tombol', jeda=1.0); w.kam(".ringkas", zoom=1.4); w.label("Tempatnya kembali kosong", 3.0); time.sleep(3.5); w.tanda("b09_akhir")
w.kamera(None); time.sleep(0.5); w.selesai()
# tangkapan layar HP untuk b10: tiga kendaraan sedang parkir
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 390, "height": 800}, device_scale_factor=3, is_mobile=True)
    pg.goto("http://localhost:8000/masuk"); pg.fill('input[name=email]', "joko@nusabakti.test"); pg.fill('input[name=password]', "rahasia123"); pg.click('button.tombol'); pg.wait_for_url("**/parkir")
    for pl, j in [("N 4821 KD", "motor"), ("N 1305 BC", "mobil"), ("N 2290 AC", "motor")]:
        pg.fill('input[name=plate]', pl); pg.select_option('select[name=type]', j); pg.click(MASUK + ' button.tombol'); pg.wait_for_load_state(); pg.goto("http://localhost:8000/parkir")
    pg.screenshot(path="/home/user/parkir/P08/hp.png", full_page=True); br.close()
subprocess.run(["mysql", DB, "-e", "SET FOREIGN_KEY_CHECKS=0; TRUNCATE parkings; TRUNCATE vehicles; TRUNCATE activity_logs; SET FOREIGN_KEY_CHECKS=1;"]); matikan()
