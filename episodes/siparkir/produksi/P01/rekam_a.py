import sys, time, os, subprocess, shutil; sys.path.insert(0, "/home/user/parkir/alat")
from tulis import Bab, CACAT, P, sh
L = "/home/user/parkir/P01"
# ---------- persiapan di luar kamera: folder kosong, database belum ada ----------
subprocess.run("pkill -f 'artisan serve'", shell=True); shutil.rmtree(P, ignore_errors=True)
subprocess.run("""mysql -e "DROP DATABASE IF EXISTS siparkir; DROP USER IF EXISTS 'siparkir'@'localhost';" """, shell=True)  # pengguna dibuat lagi di depan kamera; hak atas siparkir_acuan dipulihkan di akhir
subprocess.run("DIR=/home/user/proyek /home/user/parkir/alat/reset_vs.sh", shell=True)

# ================= Bagian A: terminal di folder kosong =================
b = Bab(L + "/rek_a", proyek="/home/user/proyek"); r = b.r
r.fokus_terminal(); time.sleep(0.5); r.perintah("View: Toggle Maximized Panel", 0.8); r.tekan("Control+l", 0.3)
r.mulai(); r.kamera(None); time.sleep(0.8)
# b05 periksa versi
r.tanda("b05"); b.term(bersih=False)
for i, (cmd, lab, s) in enumerate([("php --version", "PHP terpasang", "PHP 8"), ("composer --version", "Composer terpasang", "Composer version"), ("mysql --version", "MySQL terpasang", "Ver 8"), ("git --version", "Git terpasang", "git version")]):
    r.tanda(f"b05_{i}"); b.jalan(cmd, tunggu=0.8, sampai=s, label=lab, dur=2.2)
time.sleep(1.0); r.tanda("b05_akhir")
# b06 laravel new
r.tekan("Control+l", 0.4); r.tanda("b06")
b.jalan("laravel new siparkir --database=mysql --pest --no-boost", cps=14, tunggu=1.0, sampai="starter kit")
r.tanda("b06_kit"); r.label("Starter kit: jawab No", 3.5); time.sleep(3.5); r.tekan("Enter", 0.3)
t0 = time.time()
while time.time() - t0 < 60 and "frontend stack" not in b.layar(): time.sleep(0.3)
time.sleep(0.8); r.tanda("b06_blade"); r.label("Frontend: pilih Blade", 3.5); time.sleep(3.5); r.tekan("Enter", 0.3)
r.tanda("b06_pasang"); t0 = time.time()
while time.time() - t0 < 600 and "Application ready" not in b.layar(): time.sleep(0.5)
time.sleep(1.5); r.tanda("b06_siap"); print(b.layar()[-1500:])
r.label("Tanda silang di Database migrated: wajar", 4); time.sleep(4.5); r.tanda("b06_akhir")
# b08 database
r.tekan("Control+l", 0.4); r.tanda("b08")
b.jalan("mysql -u root -p", tunggu=0.8, sampai="Enter password"); r.label("Kata sandi root tidak terlihat saat diketik", 3.5); time.sleep(1.2)
r.ketik("rahasiaRootKu", 9); time.sleep(0.8); r.tekan("Enter", 0.5)
t0 = time.time()
while time.time() - t0 < 20 and "mysql>" not in b.layar(): time.sleep(0.3)
time.sleep(1.5)
for i, (cmd, lab, d) in enumerate([("CREATE DATABASE siparkir;", "Database: siparkir", 3.0),
                                ("CREATE USER 'siparkir'@'localhost' IDENTIFIED BY 'gantiSandiIni!';", "Pengguna khusus aplikasi ini", 4.0),
                                ("GRANT ALL ON siparkir.* TO 'siparkir'@'localhost';", "Hak hanya atas database siparkir", 4.0)]):
    r.tanda(f"b08_{i}"); r.terminal(cmd, cps=16, tunggu=1.2); r.label(lab, d); time.sleep(d)
r.tanda("b08_keluar"); r.terminal("exit", tunggu=1.5); r.tanda("b08_akhir")
r.kamera(None); time.sleep(0.6); r.selesai()
assert os.path.exists(P + "/artisan"), "proyek tidak terbuat"
subprocess.run("""mysql -e "GRANT ALL ON siparkir_acuan.* TO 'siparkir'@'localhost';" """, shell=True)
subprocess.run("find " + P + "/vendor -maxdepth 3 -name .git -type d -prune -exec rm -rf {} +", shell=True)  # hemat disk: riwayat git pustaka tidak diperlukan

