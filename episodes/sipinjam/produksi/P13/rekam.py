import sys, time, subprocess; sys.path.insert(0, "/home/user/pinjam/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-12", "contoh"); subprocess.run("pkill -f 'php -S'", shell=True)
b = Bab("/home/user/pinjam/P13/rek"); r = b.r
N, C = "deploy/nginx.conf", "deploy/cadangan.sh"
r.mulai(); r.kamera(None); time.sleep(0.8)
# b04 nginx.conf
r.tanda("b04"); b.ubah(N, acuan(N), cps=24); time.sleep(0.5)
b.sorot(N, "root /var/www/sipinjam/public;", "root menunjuk ke folder public, bukan folder proyek", 9.0, tanda="b04_root", zoom=1.2)
b.sorot(N, "location ~ \\.php$", "Berkas PHP diteruskan ke PHP-FPM", 5.5, tanda="b04_php", n=4, zoom=1.2); b.sorot(N, "location ~ /\\.", "Berkas berawalan titik selalu ditolak", 6.0, tanda="b04_titik", n=3, zoom=1.2); r.tanda("b04_akhir")
# b05 cadangan
r.kamera(None); r.tanda("b05"); b.salin(C); b.lihat(C, jeda=0.5); r.label("deploy/cadangan.sh: salin dari GitHub", 4.0); time.sleep(4.5)
b.sorot(C, "mysqldump", "Seluruh database, termasuk prosedur dan trigger", 8.0, tanda="b05_dump", zoom=1.0); b.sorot(C, "0 2 * * *", "cron: setiap pukul 02.00", 5.5, tanda="b05_cron", zoom=1.1)
r.kamera(None); gi = b.isi(".gitignore"); b.ubah(".gitignore", gi.rstrip() + "\n/cadangan/\n", cps=10); r.label("Cadangan tidak ikut ke GitHub", 3.0); time.sleep(5.0); r.tanda("b05_akhir")
# b07 bukti .env bocor
b.besar(); r.tanda("b07"); b.jalan("php -S localhost:8002 > /dev/null 2>&1 &", tunggu=1.5, cps=14, label="Dari folder proyek, tanpa -t public, seperti saran AI", dur=5.5)
r.tanda("b07_curl"); b.jalan("curl localhost:8002/.env", tunggu=1.5, cps=12); r.tanda("b07_bocor"); r.label("Seluruh isi .env keluar, termasuk kata sandi database", 8.0); time.sleep(16.0); r.tanda("b07_bocor_akhir")
b.jalan("kill %1", tunggu=1.0, cps=20); r.tekan("Control+l", 0.4)
r.tanda("b07_public"); b.jalan("php -S localhost:8003 -t public > /dev/null 2>&1 &", tunggu=1.5, cps=24); b.jalan("curl -I localhost:8003/.env", tunggu=1.5, cps=16, label="Dengan -t public: 404, berkasnya tidak terjangkau", dur=6.0); time.sleep(1.0)
b.jalan("kill %1", tunggu=1.0, cps=20); r.tekan("Control+l", 0.4); r.tanda("b07_akhir")
b.kecil(); b.term(); b.commit("siap online", "b07_commit"); time.sleep(1.0); r.tanda("b07_commit_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-13"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -15").stdout)
