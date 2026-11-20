import sys, time, os, shutil, subprocess; sys.path.insert(0, "/home/user/baca/alat")
from tulis import Bab, CACAT, P, sh, matikan, db, ENV5
import tahap as T
matikan(); db("tiada")
shutil.rmtree(P, ignore_errors=True); os.makedirs(P); shutil.rmtree("/root/.npm/_npx", ignore_errors=True)
subprocess.run("/home/user/baca/alat/reset_vs.sh", shell=True)
b = Bab("/home/user/baca/B01/rek"); r = b.r
PLUS = '.part.panel a.codicon-plus'
r.mulai(); r.kamera(None); time.sleep(0.8)
# b05 periksa alat
r.tanda("b05"); r.label("File → Open Folder → sibaca", 4.5); time.sleep(5.0)
b.term(); r.tanda("b05_cek")
b.jalan("node --version", tunggu=1.2, sampai="v22"); b.jalan("npm --version", tunggu=1.2, sampai="10."); b.jalan("mysql --version", tunggu=1.2, sampai="Ver")
b.jalan("git --version", tunggu=1.5, sampai="git version", label="Empat nomor versi: semua alat siap", dur=4.0); r.tanda("b05_akhir")
# b06 npm init, install
r.tekan("Control+l", 0.4); r.tanda("b06"); b.jalan("npm init -y", tunggu=1.5, sampai='"license"', label="package.json: kartu identitas proyek", dur=4.5)
r.tekan("Control+l", 0.4); r.tanda("b06_pasang"); b.jalan("npm install express mysql2", tunggu=1.5, sampai="added", maks=240, label="Express: server web · mysql2: penghubung ke MySQL", dur=6.0)
r.kamera(None); r.tanda("b06_json"); b.lihat("package.json", '"dependencies"', jeda=1.0); b.sorot("package.json", '"dependencies"', "Nama pustaka dicatat di package.json", 6.0, n=4); r.tanda("b06_akhir")
# b07 database
b.besar(); r.tanda("b07"); r.terminal("mysql -u root -p", tunggu=0.5); b.tunggu("Enter password"); r.label("Kata sandi tidak terlihat saat diketik", 4.5); time.sleep(1.2); r.ketik("sandiRootKu1", 7); time.sleep(0.8); r.tekan("Enter", 0.5); b.tunggu("mysql>"); time.sleep(2.0)
r.tanda("b07_db"); b.sql("CREATE DATABASE sibaca;", "Database: sibaca", 3.5)
r.tanda("b07_user"); b.sql("CREATE USER 'sibaca'@'localhost' IDENTIFIED BY 'gantiSandiIni!';", "Pengguna khusus untuk aplikasi ini", 5.0)
r.tanda("b07_grant"); b.sql("GRANT ALL PRIVILEGES ON sibaca.* TO 'sibaca'@'localhost';", "Hak hanya atas database sibaca", 5.0); r.tanda("b07_keluar")
b.sql("exit", tunggu=1.0); b.kecil(); r.tekan("Control+l", 0.3)
# b08 .env, .gitignore, .env.example
r.kamera(None); r.tanda("b08"); b.ubah(".env", ENV5, cps=14); r.tanda("b08_env"); b.sorot(".env", "DB_HOST", "Port, alamat MySQL, pengguna, kata sandi, nama database", 7.0, n=3, ke=1)
r.tanda("b08_ignore"); b.ubah(".gitignore", T.GITIGNORE[1], cps=12); b.sorot(".gitignore", "node_modules", "Dua nama ini tidak ikut ke GitHub", 5.0, tanda="b08_isi", n=2)
r.tanda("b08_contoh"); b.ubah(".env.example", T.ENV_CONTOH5, cps=18); b.sorot(".env.example", "DB_PASSWORD", "Contoh tanpa isi rahasia", 5.0, tanda="b08_kosong"); r.tanda("b08_akhir")
# b09 server pertama
AP = "server/app.js"
r.kamera(None); r.tanda("b09"); b.ubah(AP, T.APP[1], cps=13); time.sleep(0.6)
b.sorot(AP, "import express", "Mengambil Express", 3.5, tanda="b09_import"); b.sorot(AP, "const app = express()", "Membuat aplikasinya", 3.5, tanda="b09_app")
b.sorot(AP, "app.get('/api/halo'", "Alamat: /api/halo", 5.0, tanda="b09_alamat"); b.sorot(AP, "res.json", "Jawaban berformat JSON", 6.0, tanda="b09_json")
b.sorot(AP, "const port", "Menyalakan server di port dari .env", 6.0, tanda="b09_listen", n=2); r.tanda("b09_akhir")
# b10 package.json, npm run dev
pj = b.isi("package.json")
pj1 = pj.replace('  "main": "index.js",\n', '  "main": "index.js",\n  "type": "module",\n')
pj2 = pj1.replace('    "test": "echo \\"Error: no test specified\\" && exit 1"', '    "dev": "node --env-file=.env --watch server/app.js"')
assert pj1.count("module") == 1 and "--watch" in pj2
r.kamera(None); r.tanda("b10"); b.lihat("package.json", '"main"', jeda=1.2); r.tanda("b10_ketik"); b.ubah("package.json", pj1, cps=12)
b.sorot("package.json", '"type"', "Supaya boleh memakai import", 4.5, tanda="b10_type")
r.tanda("b10_ketik2"); b.ubah("package.json", pj2, cps=12); b.sorot("package.json", '"dev"', "--env-file: baca .env  ·  --watch: menyala ulang sendiri", 9.0, tanda="b10_dev", zoom=1.3)
b.term(); r.tanda("b10_jalan"); b.jalan("npm run dev", tunggu=2.0, sampai="SiBaca berjalan di port 3000", label="Server menyala di port 3000", dur=4.5); r.tanda("b10_akhir")
# b11 terminal kedua: Vite + React
r.kamera(None); time.sleep(0.6); r.tanda("b11"); r.klik(PLUS); time.sleep(1.5); r.label("Tombol +: terminal kedua", 3.5); time.sleep(3.0); r.kamera_terminal()
r.tanda("b11_vite"); r.terminal("npm create vite@latest web -- --template react", cps=13, tunggu=0.5)
t0 = time.time()
while time.time() - t0 < 90:
    L = b.layar()
    if "Ok to proceed" in L or "linter" in L: break
    time.sleep(0.4)
if "Ok to proceed" in b.layar():
    r.label("Pertama kali: tekan Enter untuk mengizinkan", 3.5); time.sleep(3.0); r.tekan("Enter", 0.5)
b.tunggu("linter", 90); time.sleep(0.8); r.kamera_terminal(); r.tanda("b11_linter"); r.label("Linter: tekan Enter (pilihan pertama)", 4.5); time.sleep(5.0); r.tekan("Enter", 0.6)
b.tunggu("start now", 30); time.sleep(0.6); r.kamera_terminal(); r.tanda("b11_no"); time.sleep(2.0); r.tekan("ArrowRight", 1.0); r.label("Pilih No", 3.5); time.sleep(3.5); r.tekan("Enter", 0.6)
b.tunggu("Done. Now run", 40); time.sleep(2.5); r.kamera_terminal(); r.tanda("b11_cd")
b.jalan("cd web", tunggu=0.8); b.jalan("npm install", tunggu=1.5, sampai="packages in", maks=300, label="Memasang React dan Vite", dur=3.5)
r.tanda("b11_dev"); b.jalan("npm run dev", tunggu=2.5, sampai="Local:", label="Vite menyala di port 5173", dur=4.5); r.tanda("b11_akhir")
r.kamera(None); time.sleep(0.6); r.tanda("b11_tiga"); r.klik(PLUS); time.sleep(1.5); r.label("Terminal ketiga untuk perintah lain", 4.5); time.sleep(5.0); r.tanda("b11_tiga_akhir")
# b13 commit
r.kamera_terminal(); r.tanda("b13"); b.jalan("git init", tunggu=1.5, sampai="Initialized"); b.jalan("git add .", tunggu=2.0)
r.tekan("Control+l", 0.4); r.tanda("b13_commit"); b.jalan('git commit -m "Proyek awal"', tunggu=2.5, sampai="create mode", label="Commit: Proyek awal", dur=3.5); time.sleep(1.0); r.tanda("b13_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
matikan(); sh("git tag -f bab-01"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3; ls -a").stdout)
