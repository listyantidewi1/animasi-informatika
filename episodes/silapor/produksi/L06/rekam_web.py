import sys, time, subprocess; sys.path.insert(0, "/home/user/lapor/alat")
from webbantu import Peramban, server, matikan
P = "/home/user/proyek/silapor"; B = "/home/user/lapor/bahan/"
subprocess.run(["/home/user/lapor/alat/bersih.sh", P, "php artisan cache:clear -q"]); server()
w = Peramban("/home/user/lapor/L06/web", devtools=False)
w.pg.goto("http://localhost:8000/masuk"); w.pg.fill('input[name=email]', 'lina@nusabakti.test'); w.pg.fill('input[name=password]', 'rahasia123'); w.pg.click('button.tombol'); time.sleep(1.5)
def isi():
    w.pilih('select[name=category_id]', 'Ruang kelas'); w.ketik('input[name=title]', 'Proyektor tidak menyala', 16); w.ketik('input[name=location]', 'XI RPL 1', 14)
    w.ketik('textarea[name=description]', 'Sejak pagi proyektor tidak mau menyala. Lampu indikatornya merah.', 22)
def berkas(nama, label, dur=3.0):
    x, y, ww, h = w.kotak('input[name=photo]'); w.gerak(x + 60, y + h / 2); time.sleep(0.3); w.pg.set_input_files('input[name=photo]', B + nama); w.label(label, dur); time.sleep(dur)
w.mulai(); w.kamera(None); time.sleep(0.8)
# b11 Lina mengirim laporan
w.tanda("b11"); w.label("Lina sudah login", 2.5); time.sleep(1.5); w.alamat("http://localhost:8000/laporan/buat", tampil="localhost:8000/laporan/buat", jeda=1.2); w.kam('form.kartu', pad=30); time.sleep(0.6); w.tanda("b11_form"); isi(); w.tanda("b11_foto"); berkas("proyektor.jpg", "Pilih foto: proyektor.jpg", 3.0)
w.tanda("b11_kirim"); w.klik('button.tombol', jeda=2.0); mx, my, mw, mh = w.kotak('main'); w.kam(rect=[mx, 0, mw, 600], pad=30); w.label("Laporan tersimpan, fotonya tampil", 4.5); time.sleep(2.0); w.gulir(380, 1.2); time.sleep(4.0); w.tanda("b11_akhir")
# b12 serangan
w.gulir(-600, 0.5); w.kamera(None); w.alamat("http://localhost:8000/laporan/buat", tampil="localhost:8000/laporan/buat", jeda=1.0); w.pg.select_option('select[name=category_id]', label='Ruang kelas'); w.pg.fill('input[name=title]', 'Coba unggah berkas')
w.pg.fill('input[name=location]', 'Lab'); w.pg.fill('textarea[name=description]', 'Mencoba mengunggah berkas yang bukan foto.'); w.kam('form.kartu', pad=30); time.sleep(0.8)
w.tanda("b12"); berkas("jahat.php", "Berkas yang diunggah: jahat.php", 3.5); w.klik('button.tombol', jeda=1.5); w.kam('.galat', zoom=1.8); w.tanda("b12_tolak1"); w.label("Ditolak", 4.0); time.sleep(5.0)
w.kam('form.kartu', pad=30); w.tanda("b12_jpg"); berkas("jahat.jpg", "Nama diganti: jahat.jpg, isinya tetap PHP", 4.0); w.klik('button.tombol', jeda=1.5); w.kam('.galat', zoom=1.8); w.tanda("b12_tolak2")
w.label("Tetap ditolak: yang diperiksa isinya", 5.0); time.sleep(6.0); w.tanda("b12_akhir")
w.selesai(); matikan()
