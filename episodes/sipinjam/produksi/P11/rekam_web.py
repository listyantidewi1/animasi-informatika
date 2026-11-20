import sys, time, subprocess; sys.path.insert(0, "/home/user/pinjam/alat")
from webbantu import Peramban, server, matikan
def login(w, u, cps=10):
    w.ketik("input[name=username]", u, cps=cps); w.ketik("input[name=sandi]", "rahasia123", cps=14); time.sleep(0.4); w.klik("form.login button", jeda=1.5)
def bawah(w, lab, dur):
    w.pg.evaluate("() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})"); time.sleep(1.8); w.kam("footer.debug", zoom=1.8); w.label(lab, dur); time.sleep(dur + 0.5)
    print("FOOTER", w.pg.inner_text("footer.debug"), "| baris", w.pg.locator("table tr").count() - 1, flush=True)
server()
w = Peramban("/home/user/pinjam/P11/web", devtools=False)
w.mulai(); w.kamera(None); time.sleep(0.6); w.tanda("mulai")
w.alamat("http://localhost:8000", tampil="localhost:8000", jeda=1.2); login(w, "yusuf"); w.label("Pak Yusuf: permintaan yang menunggu", 3.5); time.sleep(3.5)
w.tanda("setujui"); w.kam(".kartu:has-text('Lina')", zoom=1.5); time.sleep(1.5); w.klik(".kartu:has-text('Lina') button[value=setujui]", jeda=1.5); w.kam("main", zoom=1.2); w.label("Tripod untuk Lina: disetujui", 3.5); time.sleep(4.0)
w.kamera(None); w.tanda("dipinjam"); w.klik("nav a:has-text('Sedang dipinjam')", jeda=1.5); w.kam("tr:has-text('HT (handy talky)')", zoom=1.25); w.label("HT Rafi: terlambat 3 hari x 2 unit = Rp12.000", 9.0); time.sleep(10.0)
w.tanda("terima"); w.klik("tr:has-text('HT (handy talky)') button", jeda=1.5); w.kam("main", zoom=1.2); w.label("Alat diterima kembali, barisnya hilang dari daftar", 7.0); time.sleep(8.5); w.kamera(None); time.sleep(0.8); w.tanda("coba_akhir")
w.tanda("laporan"); w.klik("nav a:has-text('Laporan')", jeda=1.5); w.label("Laporan bulan ini", 3.0); time.sleep(2.0); w.gulir(500, 1.5); time.sleep(1.5); w.gulir(-500, 1.2); time.sleep(1.0); w.tanda("laporan_akhir")
w.tanda("bawah"); bawah(w, "Laporan kita: 1 query", 5.0); w.kamera(None); time.sleep(0.8); w.tanda("akhir"); w.selesai()
# PDF dan tangkapan layar laporan (untuk adegan cetak)
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={"width": 1280, "height": 800}); pg.goto("http://127.0.0.1:8000/"); pg.fill("input[name=username]", "yusuf"); pg.fill("input[name=sandi]", "rahasia123"); pg.click("form.login button")
    pg.goto("http://127.0.0.1:8000/petugas/laporan.php"); pg.pdf(path="/home/user/pinjam/bahan/laporan.pdf", format="A4", margin=dict(top="15mm", bottom="15mm", left="12mm", right="12mm")); br.close()
subprocess.run("pdftoppm -png -r 110 -f 1 -l 1 /home/user/pinjam/bahan/laporan.pdf /home/user/pinjam/bahan/laporan_pdf", shell=True)
matikan()
# aplikasi contoh bergaya AI: laporan N+1
subprocess.run("php database/isi_contoh.php", shell=True, cwd="/home/user/pinjam-ai", capture_output=True)
server("/home/user/pinjam-ai", 8001)
w = Peramban("/home/user/pinjam/P11/web_ai", devtools=False)
w.mulai(); w.kamera(None); time.sleep(0.6); w.tanda("mulai")
w.alamat("http://localhost:8001", tampil="localhost:8001", jeda=1.2); w.label("Contoh kode bergaya hasil AI", 5.0); login(w, "yusuf", cps=14); w.klik("nav a:has-text('Laporan')", jeda=1.5); time.sleep(2.0)
w.tanda("bawah"); bawah(w, "Laporan versi AI: tampilan sama, query jauh lebih banyak", 8.0); w.kamera(None); time.sleep(0.8); w.tanda("akhir"); w.selesai(); matikan(8001)
