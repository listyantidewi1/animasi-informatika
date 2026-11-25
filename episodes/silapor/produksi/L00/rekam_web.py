import sys, time, subprocess, os, shutil; sys.path.insert(0, "/home/user/lapor/alat")
from webbantu import Peramban
AP = "/home/user/aduan-ai"; B = "/home/user/lapor/bahan/"; U = "http://localhost:8001"
subprocess.run("pkill -f 'php -S 127.0.0.1:8001'", shell=True); shutil.copy(AP + "/data.awal.json", AP + "/data.json"); subprocess.run(f"rm -f {AP}/uploads/*", shell=True)
srv = subprocess.Popen(["env", "-i", "PATH=/usr/bin:/bin", "php", "-S", "127.0.0.1:8001", "router.php"], cwd=AP, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1.5)
w = Peramban("/home/user/lapor/L00/web", devtools=False); pg = w.pg; pg.goto(U + "/"); time.sleep(1.0)
CAP = "Contoh kode bergaya hasil AI"
w.mulai(); w.kamera(None); time.sleep(0.8)
# b3 ganti satu angka
w.tanda("b03"); w.label(CAP, 60, "bawah"); w.ketik('input[name=email]', 'dimas@nusabakti.test', 16); w.ketik('input[name=password]', 'rahasia123', 16); w.klik('button', jeda=1.5)
w.tanda("b03_masuk"); w.klik('a.kartu >> nth=1', jeda=1.5); w.tanda("b03_14"); w.kam_alamat(1.8); w.label("Alamatnya: /laporan/14", 4.0); time.sleep(5.0)
w.tanda("b03_ganti"); w.alamat(U + "/laporan/13", tampil="localhost:8001/laporan/13", cps=9, jeda=1.5); w.tanda("b03_13"); w.kamera(None); time.sleep(0.8); w.kam('div.kartu', zoom=1.5); w.label("Laporan milik Lina, lengkap dengan nama dan kelasnya", 5.0); time.sleep(8.0); w.kamera(None); time.sleep(1.2); w.tanda("b03_akhir")
# b4 unggah berkas PHP
pg.goto(U + "/laporan"); time.sleep(1.0); w.tanda("b04"); w.label(CAP, 60, "bawah"); w.gulir(300, 0.8); w.ketik('input[name=judul]', 'Tes foto', 14); w.ketik('textarea[name=isi]', 'Coba unggah.', 14)
x, y, ww, h = w.kotak('input[name=foto]'); w.gerak(x + 60, y + h / 2); time.sleep(0.3); pg.set_input_files('input[name=foto]', B + 'foto.php'); w.tanda("b04_pilih"); w.label("Berkas yang diunggah: foto.php, isinya kode PHP", 4.5); time.sleep(5.0)
w.klik('form button', jeda=1.5); w.tanda("b04_terkirim"); w.label("Diterima tanpa diperiksa", 3.0); time.sleep(3.5); w.tanda("b04_buka"); w.klik('div.kartu a', jeda=1.5); w.tanda("b04_jalan"); w.kam('pre', zoom=1.6); w.label("Server menjalankan isi berkas itu", 5.0); time.sleep(8.0); w.kamera(None); time.sleep(1.0); w.tanda("b04_akhir")
w.selesai(); srv.terminate(); subprocess.run("pkill -f 'php -S 127.0.0.1:8001'", shell=True)
