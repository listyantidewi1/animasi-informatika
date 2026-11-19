import sys, time, subprocess, re; sys.path.insert(0, "/home/user/lapor/alat")
from webbantu import Peramban, server, matikan
from tulis import acuan, sh
P = "/home/user/proyek/silapor"; B = "/home/user/lapor/bahan/"; U = "http://localhost:8000"; RC = "app/Http/Controllers/ReportController.php"
rcA = acuan(RC); TANPA = rcA.replace("        Gate::authorize('view', $report);\n", "").replace("        Gate::authorize('view', Report::findOrFail($update->report_id));\n", "")
subprocess.run(["/home/user/lapor/alat/bersih.sh", P, "php artisan cache:clear -q"]); open(f"{P}/{RC}", "w").write(TANPA); server()
subprocess.run(["mysql", "-usilapor", "-pgantiSandiIni!", "silapor", "-e", "DELETE FROM report_updates WHERE report_id IN (SELECT id FROM reports WHERE created_at > '2026-11-17 23:59:59'); DELETE FROM reports WHERE created_at > '2026-11-17 23:59:59';"])  # buang laporan sisa rekaman lain
w = Peramban("/home/user/lapor/L08/web", devtools=False); pg = w.pg
def login(email):
    pg.goto(U + "/masuk"); pg.fill('input[name=email]', email); pg.fill('input[name=password]', 'rahasia123'); pg.click('button.tombol'); time.sleep(1.2)
def logout(): pg.goto(U + "/"); pg.click('button.tautan'); time.sleep(0.8)
# di luar kamera: laporan proyektor Lina dengan foto, ditanggapi Pak Hendra sampai selesai (seperti bab enam dan tujuh)
login('lina@nusabakti.test'); pg.goto(U + "/laporan/buat"); pg.select_option('select[name=category_id]', label='Ruang kelas'); pg.fill('input[name=title]', 'Proyektor tidak menyala'); pg.fill('input[name=location]', 'XI RPL 1')
pg.fill('textarea[name=description]', 'Sejak pagi proyektor tidak mau menyala. Lampu indikatornya merah.'); pg.set_input_files('input[name=photo]', B + 'proyektor.jpg'); pg.click('button.tombol'); time.sleep(1.5)
ID = re.search(r"/laporan/(\d+)", pg.url).group(1); open("/home/user/lapor/L08/id.txt", "w").write(ID); logout(); login('hendra@nusabakti.test')
for st, note, foto in [("diproses", "Teknisi datang besok pagi.", None), ("selesai", "Lampu proyektor sudah diganti. Silakan dipakai.", "proyektor_nyala.jpg")]:
    pg.goto(f"{U}/laporan/{ID}"); pg.select_option('select[name=status]', value=st); pg.fill('textarea[name=note]', note)
    if foto: pg.set_input_files('form.kartu input[name=photo]', B + foto)
    pg.click('form.kartu button.tombol'); time.sleep(1.2)
logout(); pg.goto(U + "/masuk"); time.sleep(1.0)
def masuk(email):
    w.ketik('input[name=email]', email, 16); w.ketik('input[name=password]', 'rahasia123', 16); w.klik('button.tombol', jeda=1.5)
def kol():
    mx, my, mw, mh = w.kotak('main'); w.kam(rect=[mx, 0, mw, 600], pad=30)
def tengah():
    iw, ih = w.pg.evaluate("[innerWidth, innerHeight]"); w.kam(rect=[iw / 2 - 330, ih / 2 - 170, 660, 340], zoom=1.9, pad=0)
w.mulai(); w.kamera(None); time.sleep(0.8)
# b04 Dimas: daftar aman, detail bocor
w.tanda("b04"); masuk('dimas@nusabakti.test'); w.tanda("b04_daftar"); kol(); w.label("Dimas: hanya laporannya sendiri", 4.0); w.gerak(900, 420); time.sleep(4.5)
w.tanda("b04_alamat"); w.kamera(None); time.sleep(0.6); w.alamat(U + "/laporan/13", tampil="localhost:8000/laporan/13", jeda=1.5); w.tanda("b04_bocor"); w.label("Laporan milik Lina terbuka", 4.5); w.kam('article.kartu', zoom=1.5); time.sleep(6.0); w.kamera(None); time.sleep(1.5); w.tanda("b04_akhir")
# kode diperbaiki (di luar kamera: keadaan akhir bab)
open(f"{P}/{RC}", "w").write(rcA); time.sleep(1.0)
w.tanda("b06"); w.alamat(U + "/laporan/13", tampil="localhost:8000/laporan/13", jeda=1.5); tengah(); w.label("Dimas membuka /laporan/13: 403", 4.5); time.sleep(5.0); w.tanda("b06_403"); time.sleep(0.8); w.kamera(None); time.sleep(0.8)
logout(); login('lina@nusabakti.test'); pg.goto(U + "/laporan/13"); time.sleep(1.0); w.tanda("b06_lina"); w.label("Lina, pemiliknya: terbuka", 3.5); w.gerak(1000, 60); time.sleep(3.5); w.tanda("b06_lina_akhir")
logout(); login('hendra@nusabakti.test'); pg.goto(U + "/laporan/13"); time.sleep(1.0); w.tanda("b06_hendra"); w.label("Pak Hendra, admin: terbuka", 3.5); w.gerak(1040, 60); time.sleep(3.5); w.tanda("b06_akhir")
# b07 XSS
logout(); login('lina@nusabakti.test'); pg.goto(U + "/laporan/buat"); pg.select_option('select[name=category_id]', label='Laboratorium'); pg.fill('input[name=location]', 'Lab Komputer 1'); pg.fill('textarea[name=description]', 'Mencoba judul berisi tag HTML.'); w.kam('form.kartu', pad=30); time.sleep(1.0)
w.tanda("b07"); w.ketik('input[name=title]', "<script>alert('halo')</script>", 12); time.sleep(1.5); w.klik('button.tombol', jeda=1.5); w.tanda("b07_hasil"); w.kam('article.kartu', zoom=1.5); w.label("Tag tampil sebagai tulisan, tidak dijalankan", 5.0); time.sleep(8.0); w.tanda("b07_akhir")
w.selesai(); matikan()
# tangkapan layar ukuran HP untuk adegan
subprocess.run(["mysql", "-usilapor", "-pgantiSandiIni!", "silapor", "-e", "DELETE FROM report_updates WHERE report_id IN (SELECT id FROM reports WHERE title LIKE '<script%'); DELETE FROM reports WHERE title LIKE '<script%';"])  # laporan uji XSS tidak ikut ke tangkapan HP
from playwright.sync_api import sync_playwright
server(); 
with sync_playwright() as pw:
    br = pw.chromium.launch(); cx = br.new_context(viewport={"width": 390, "height": 800}, device_scale_factor=2.5, locale="id-ID", timezone_id="Asia/Jakarta"); p2 = cx.new_page()
    p2.goto(U + "/masuk"); p2.fill('input[name=email]', 'lina@nusabakti.test'); p2.fill('input[name=password]', 'rahasia123'); p2.click('button.tombol'); time.sleep(1.2)
    p2.screenshot(path="/home/user/lapor/L08/hp_daftar.png"); p2.goto(f"{U}/laporan/{ID}"); time.sleep(1.2); p2.screenshot(path="/home/user/lapor/L08/hp_detail.png", full_page=True); br.close()
matikan(); print(sh("git status --short").stdout)
