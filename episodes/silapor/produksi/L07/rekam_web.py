import sys, time, subprocess, re; sys.path.insert(0, "/home/user/lapor/alat")
from webbantu import Peramban, server, matikan
P = "/home/user/proyek/silapor"; B = "/home/user/lapor/bahan/"; U = "http://localhost:8000"
subprocess.run(["/home/user/lapor/alat/bersih.sh", P, "php artisan cache:clear -q"]); server()
subprocess.run(["mysql", "-usilapor", "-pgantiSandiIni!", "silapor", "-e", "DELETE FROM report_updates WHERE report_id IN (SELECT id FROM reports WHERE created_at > '2026-11-17 23:59:59'); DELETE FROM reports WHERE created_at > '2026-11-17 23:59:59';"])  # buang laporan sisa rekaman lain
w = Peramban("/home/user/lapor/L07/web", devtools=False); pg = w.pg
def login(email):
    pg.goto(U + "/masuk"); pg.fill('input[name=email]', email); pg.fill('input[name=password]', 'rahasia123'); pg.click('button.tombol'); time.sleep(1.2)
def logout(): pg.goto(U + "/"); pg.click('button.tautan'); time.sleep(0.8)
# di luar kamera: laporan Lina dengan foto (seperti di bab enam)
login('lina@nusabakti.test'); pg.goto(U + "/laporan/buat"); pg.select_option('select[name=category_id]', label='Ruang kelas'); pg.fill('input[name=title]', 'Proyektor tidak menyala'); pg.fill('input[name=location]', 'XI RPL 1')
pg.fill('textarea[name=description]', 'Sejak pagi proyektor tidak mau menyala. Lampu indikatornya merah.'); pg.set_input_files('input[name=photo]', B + 'proyektor.jpg'); pg.click('button.tombol'); time.sleep(1.5)
ID = re.search(r"/laporan/(\d+)", pg.url).group(1); open("/home/user/lapor/L07/id.txt", "w").write(ID); print("laporan", ID); logout(); login('hendra@nusabakti.test'); time.sleep(1.0)
w.mulai(); w.kamera(None); time.sleep(0.8)
# b05 saringan
w.tanda("b05"); w.label("Pak Hendra di halaman /kelola", 3.0); time.sleep(2.5); w.kam('form.saring', zoom=1.5)
x, y, ww, h = w.kotak('input[name=bulan]'); w.gerak(x + ww / 2, y + h / 2); time.sleep(0.3); pg.fill('input[name=bulan]', '2026-11'); time.sleep(0.9); w.pilih('select[name=kategori]', 'Ruang kelas'); w.klik('form.saring button.tombol', jeda=1.5)
w.kamera(None); w.tanda("b05_hasil"); w.label("November, ruang kelas: tersisa beberapa laporan", 4.0); time.sleep(4.5); w.kam_alamat(1.8); w.label("Saringan terlihat di alamat", 3.5); time.sleep(4.0)
w.kamera(None); pg.fill('input[name=bulan]', ''); w.klik('form.saring button.tombol', jeda=1.2); w.tanda("b05_hal"); w.gulir(900, 1.0); w.klik('nav.halaman a', jeda=1.5); w.kam_alamat(1.8); w.label("Pindah halaman: saringan tetap terbawa", 4.0); time.sleep(4.5); w.tanda("b05_akhir")
# b06 rekap
w.kamera(None); pg.goto(U + "/kelola"); time.sleep(1.0); w.tanda("b06"); w.kam('.rekap', zoom=1.8); w.label("Rekap: jumlah laporan di setiap status", 4.0); x, y, ww, h = w.kotak('.rekap a.baru'); w.gerak(x + ww / 2, y + h / 2); time.sleep(5.0); w.tanda("b06_akhir")
# b10 tanggapan
w.kamera(None); w.tanda("b10"); w.klik('a.laporan >> nth=0', jeda=1.5); mx, my, mw, mh = w.kotak('main'); w.kam(rect=[mx, 0, mw, 600], pad=30); w.label("Laporan proyektor dari Lina", 3.0); time.sleep(1.5); w.gulir(700, 1.2); time.sleep(1.0)
w.tanda("b10_proses"); w.pilih('select[name=status]', 'Ubah menjadi diproses'); w.ketik('textarea[name=note]', 'Teknisi datang besok pagi.', 16); w.klik('form.kartu button.tombol', jeda=1.5); w.label("Status: diproses", 3.0); w.gulir(500, 1.0); time.sleep(2.5)
w.tanda("b10_selesai"); w.label("Keesokan harinya", 2.5); w.gulir(700, 0.8); w.pilih('select[name=status]', 'Ubah menjadi selesai'); w.ketik('textarea[name=note]', 'Lampu proyektor sudah diganti. Silakan dipakai.', 18)
x, y, ww, h = w.kotak('form.kartu input[name=photo]'); w.gerak(x + 60, y + h / 2); pg.set_input_files('form.kartu input[name=photo]', B + 'proyektor_nyala.jpg'); w.label("Foto: proyektor sudah menyala", 2.5); time.sleep(2.5)
w.klik('form.kartu button.tombol', jeda=1.5); w.tanda("b10_riwayat"); w.gulir(-2000, 0.6); w.gulir(520, 1.2); w.label("Riwayat tersusun dari atas ke bawah", 4.0); time.sleep(2.5); w.gulir(500, 2.0); time.sleep(3.0); w.tanda("b10_akhir")
w.selesai(); matikan()
