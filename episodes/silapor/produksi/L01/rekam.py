import sys, time, os, subprocess, shutil; sys.path.insert(0, "/home/user/lapor/alat")
from tulis import Bab, CACAT, P, sh
L = "/home/user/lapor/L01"
# ================= Bagian B: folder silapor dibuka di VS Code =================
subprocess.run("/home/user/lapor/alat/reset_vs.sh", shell=True)
b = Bab(L + "/rek"); r = b.r
r.mulai(); r.kamera(None); time.sleep(1.5)
# b07 isi proyek
r.tanda("b07"); r.label("File → Open Folder → silapor", 4); time.sleep(4.0)
def folder(nama, lab, d=3.0, kam=True):
    r.klik(f'.explorer-folders-view .monaco-list-row[aria-label="{nama}"]'); r.tanda("b07_" + nama); r.label(lab, d); time.sleep(d)
r.kamera([0, 0, 760, 428], pad=0); r.log["kamera"][-1][1].append("bebas"); time.sleep(1.2)
folder("app", "app: logika aplikasi"); folder("app", "", 0.3)
folder("routes", "routes: daftar alamat"); folder("routes", "", 0.3)
folder("resources", "resources/views: halaman", 1.5); folder("views", "resources/views: halaman", 2.5); folder("resources", "", 0.3)
folder("database", "database: rancangan tabel"); folder("database", "", 0.3)
r.kamera(None); time.sleep(1.2); r.tanda("b07_akhir")
# b09 .env
r.tanda("b09"); b.lihat(".env", jeda=2.0)
b.sorot(".env", "DB_CONNECTION", "Pengaturan database", 4.0, tanda="b09_db", n=6)
env = b.isi(".env")
r.tanda("b09_user"); b.ubah(".env", env.replace("DB_USERNAME=root", "DB_USERNAME=silapor")); r.label("Pengguna: silapor", 2.5); time.sleep(2.5)
r.tanda("b09_sandi"); b.ubah(".env", env.replace("DB_USERNAME=root", "DB_USERNAME=silapor").replace("DB_PASSWORD=", 'DB_PASSWORD="gantiSandiIni!"')); r.label("Kata sandi yang baru kita buat", 3.0); time.sleep(3.0)
b.sorot(".env", "APP_KEY", "Kunci rahasia, sudah terisi otomatis", 4.0, tanda="b09_key")
b.editor(); time.sleep(1.0); r.tanda("b09_akhir")
# b10 .gitignore dan .env.example
r.tanda("b10"); b.sorot(".gitignore", ".env", ".env tidak ikut ke GitHub", 4.0, tanda="b10_ignore", ke=1)
r.tanda("b10_contoh"); b.lihat(".env.example", jeda=1.0); r.label(".env.example: contoh tanpa isi rahasia", 4.0); time.sleep(4.5); r.tanda("b10_akhir")
# b11 timezone
r.tanda("b11"); app = b.isi("config/app.php"); b.lihat("config/app.php", "'timezone' =>", jeda=1.0)
b.ubah("config/app.php", app.replace("'timezone' => 'UTC'", "'timezone' => 'Asia/Jakarta'")); r.label("Zona waktu: Asia/Jakarta", 3.0); time.sleep(3.5); r.tanda("b11_akhir")
# b12 migrate
b.term(); r.tanda("b12"); b.jalan("php artisan migrate", tunggu=1.5, sampai="DONE", label="DONE: sambungan ke MySQL berhasil", dur=4.0); time.sleep(1.0); r.tanda("b12_akhir")
# b13 serve
r.tekan("Control+l", 0.3); r.tanda("b13"); b.jalan("php artisan serve", tunggu=1.5, sampai="Server running", label="Buka localhost:8000 di browser", dur=3.5); r.tanda("b13_jalan"); time.sleep(1.0)
r.tanda("b13_stop"); r.label("Ctrl + C untuk menghentikan", 3.0); time.sleep(1.2); r.tekan("Control+c", 1.8); r.tanda("b13_akhir")
# b14 git
r.tekan("Control+l", 0.3); r.tanda("b14")
b.jalan("git init", tunggu=1.0, label="Mulai mencatat riwayat", dur=2.2); b.jalan("git add .", tunggu=1.2)
b.jalan('git commit -m "Proyek Laravel baru"', tunggu=1.8, sampai="files changed", label="Commit pertama", dur=3.0); time.sleep(1.0); r.tanda("b14_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-01"); print("CACAT", CACAT); print(sh("git log --oneline | head -3; git status --short | head").stdout)
