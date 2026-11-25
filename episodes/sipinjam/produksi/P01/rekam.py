import sys, time, os, subprocess, shutil; sys.path.insert(0, "/home/user/pinjam/alat")
from tulis import Bab, CACAT, P, sh
# keadaan awal: folder kosong, database dan pengguna belum ada
subprocess.run("pkill -f 'php -S'", shell=True)
shutil.rmtree(P, ignore_errors=True); os.makedirs(P)
subprocess.run("""mysql -e "DROP DATABASE IF EXISTS sipinjam; DROP USER IF EXISTS 'sipinjam'@'localhost'" """, shell=True)
subprocess.run("/home/user/pinjam/alat/reset_vs.sh", shell=True)
b = Bab("/home/user/pinjam/P01/rek"); r = b.r
r.mulai(); r.kamera(None); time.sleep(1.5)
# b05 cek versi
b.term(); r.tanda("b05"); time.sleep(0.8)
b.jalan("php --version", tunggu=1.5, cps=14); r.tanda("b05_mysql"); b.jalan("mysql --version", tunggu=1.5, cps=14); r.tanda("b05_git"); b.jalan("git --version", tunggu=1.2, cps=14)
r.label("Tiga nomor versi: semua alat siap", 4.0); time.sleep(4.5); r.tanda("b05_akhir")
# b06 folder proyek
r.tekan("Control+l", 0.3); r.kamera(None); r.tanda("b06"); r.label("File → Open Folder → sipinjam", 5); time.sleep(5.5)
b.term(bersih=False); r.tanda("b06_mkdir"); b.jalan("mkdir public app database", tunggu=1.2, cps=14)
r.kamera([0, 0, 760, 428], pad=0); r.log["kamera"][-1][1].append("bebas"); time.sleep(1.5)
def folder(nama, lab, d=4.0):
    r.klik(f'.explorer-folders-view .monaco-list-row[aria-label="{nama}"]'); r.tanda("b06_" + nama); r.label(lab, d); time.sleep(d)
folder("public", "public: halaman yang boleh dibuka dari browser", 4.5); folder("app", "app: kode yang tidak boleh dibuka langsung", 4.5); folder("database", "database: semua SQL kita", 4.0)
r.tanda("b06_tiga"); r.kamera(None); time.sleep(1.5); r.tanda("b06_akhir")
# b07 database dan pengguna
b.besar(); r.tanda("b07"); r.terminal("mysql -u root", cps=14, tunggu=0.5); b.tunggu("mysql>"); time.sleep(1.2); r.label("root di XAMPP belum punya kata sandi", 4.0); time.sleep(4.5)
r.tekan("Control+l", 0.4); r.tanda("b07_db"); b.sql("CREATE DATABASE sipinjam;", "Database baru: sipinjam", 3.5, cps=14)
r.tanda("b07_user"); b.sql("CREATE USER 'sipinjam'@'localhost' IDENTIFIED BY 'gantiSandiIni!';", "Pengguna khusus untuk aplikasi ini", 4.0, cps=16)
r.tanda("b07_grant"); b.sql(["GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE", "ON sipinjam.* TO 'sipinjam'@'localhost';"], "Lima hak saja, hanya di database sipinjam", 6.0, cps=16); time.sleep(5.0); r.tanda("b07_akhir")
b.sql("exit", tunggu=1.0); r.tekan("Control+l", 0.3); b.kecil()
# b08 .env
ENV = 'DB_HOST=127.0.0.1\nDB_PORT=3306\nDB_NAME=sipinjam\nDB_USER=sipinjam\nDB_PASS="gantiSandiIni!"\nAPP_DEBUG=true\n'
r.kamera(None); r.tanda("b08"); b.ubah(".env", ENV, cps=14); time.sleep(0.6)
b.sorot(".env", "DB_HOST", "Alamat database: komputer ini sendiri", 6.0, tanda="b08_host"); b.sorot(".env", "DB_PORT", "Nomor pintu bawaan MySQL", 4.5, tanda="b08_port")
b.sorot(".env", "DB_NAME", "Yang baru kita buat di MySQL", 6.0, tanda="b08_nama", n=3); b.sorot(".env", "APP_DEBUG", "true selama masih belajar", 6.0, tanda="b08_debug"); r.tanda("b08_akhir")
# b09 .gitignore dan .env.example
r.kamera(None); r.tanda("b09"); b.ubah(".gitignore", ".env\n", cps=10); b.sorot(".gitignore", ".env", ".env tidak ikut ke GitHub", 4.0, tanda="b09_ignore")
CONTOH = '# Salin berkas ini menjadi .env, lalu isi sesuai komputermu.\n# Berkas .env tidak ikut ke GitHub karena berisi kata sandi.\n' + ENV.replace('"gantiSandiIni!"', '""')
r.kamera(None); r.tanda("b09_contoh"); b.ubah(".env.example", CONTOH, cps=40); b.sorot(".env.example", "DB_PASS", "Kata sandinya dikosongkan", 4.0, tanda="b09_kosong"); r.tanda("b09_akhir")
# b10 halaman uji
IDX = """<?php
$env = parse_ini_file(__DIR__ . '/../.env');
$db = new PDO(
    "mysql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$env['DB_NAME']}",
    $env['DB_USER'],
    $env['DB_PASS']
);
echo 'SiPinjam tersambung ke MySQL versi ' . $db->query('SELECT VERSION()')->fetchColumn();
"""
r.kamera(None); r.tanda("b10"); b.ubah("public/index.php", IDX, cps=13); time.sleep(0.6)
b.sorot("public/index.php", "parse_ini_file", "Membaca .env menjadi array", 4.5, tanda="b10_env", zoom=1.25); b.sorot("public/index.php", "new PDO", "PDO: sambungan ke MySQL", 6.5, tanda="b10_pdo", n=5, zoom=1.25)
b.sorot("public/index.php", "SELECT VERSION()", "Bertanya: versi berapa dirimu?", 5.5, tanda="b10_versi", zoom=1.25); r.tanda("b10_akhir")
# b11 server
b.term(); r.tanda("b11"); b.jalan("php -S localhost:8000 -t public", tunggu=1.5, cps=13, sampai="started", label="-t public: hanya isi folder public yang bisa dibuka", dur=6.0); r.tanda("b11_jalan"); time.sleep(1.5)
r.tanda("b11_stop"); r.label("Ctrl + C untuk menghentikan server", 3.5); time.sleep(1.5); r.tekan("Control+c", 2.5); r.tanda("b11_akhir")
# b14 git
r.tekan("Control+l", 0.3); r.tanda("b14"); b.jalan("git init", tunggu=1.2, cps=14, label="Mulai mencatat riwayat", dur=2.2)
sh("git config user.name iTeachSWE; git config user.email iteachswe@users.noreply.github.com; git config commit.gpgsign false")
b.jalan("git add .", tunggu=1.2, cps=14); b.jalan('git commit -m "proyek awal"', tunggu=1.8, cps=14, sampai="files changed", label="Commit pertama", dur=3.0); time.sleep(1.0); r.tanda("b14_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-01"); print("CACAT", CACAT); print(sh("git log --oneline | head -3; git status --short | head; git ls-files").stdout)
