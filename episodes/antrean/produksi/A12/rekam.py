import sys, time, os, subprocess; sys.path.insert(0, "/home/user/antre/alat")
P = "/home/user/proyek/siantre"; K = "/home/user/antre/kode/A12/"; SRV = "/home/user/server"
subprocess.run(f"cd {SRV}/siantre 2>/dev/null && docker compose down -v --remove-orphans; rm -rf {SRV}; mkdir -p {SRV}; docker rmi -f siantre-app 2>/dev/null", shell=True)
subprocess.run(f"cd {P} && git reset -q --hard bab-11 && git clean -qfd", shell=True)
subprocess.run("fuser -k 3000/tcp", shell=True, stderr=subprocess.DEVNULL)
subprocess.run("/home/user/antre/alat/reset_vs.sh", shell=True)
from rekam_vs import VS
r = VS("/home/user/antre/A12/rek")
def baris_ke(path, teks):
    r.tekan("Control+s", 0.3)
    for i, b in enumerate(open(path).read().split("\n")):
        if teks in b: return i + 1
    raise Exception("tidak ketemu " + teks)
def ke_baris(n): r.tekan("Control+g", 0.4); r.ketik(str(n), 12); r.tekan("Enter", 0.3)
def ganti_baris(n, teks, cps=18): ke_baris(n); r.tekan("End", 0.1); r.tekan("Shift+Home", 0.1); r.tekan("Shift+Home", 0.2); r.ketik(teks, cps)
def sisip_setelah(path, cari, teks, cps=20): ke_baris(baris_ke(path, cari)); r.tekan("End", 0.1); r.tekan("Enter", 0.2); r.ketik(teks, cps)
def editor(): r.kamera(r.kotak(".editor-group-container"), pad=0)
def term(): r.kamera(None); r.fokus_terminal(); time.sleep(0.3); r.tekan("Control+l", 0.3); r.kamera_terminal()
def ke_editor(nama): r.kamera(None); r.fokus_editor(); r.buka(nama); time.sleep(0.3)
def baru(nama, berkas, cps): r.kamera(None); r.berkas_baru(nama, akar=True); r.kamera_editor(); r.ketik_kode(open(K + berkas).read(), cps=cps); r.tekan("Control+s", 0.4)
def sembunyi(cmd): subprocess.run(cmd, shell=True)
SV = P + "/src/server.js"
r.mulai(); r.kamera(None); time.sleep(0.6)
# b03 rahasia di environment
ke_editor(".gitignore"); r.tekan("Control+End", 0.3); r.kamera_editor(); r.tanda("b03")
r.tekan("Enter", 0.1); r.ketik(".env", 10); r.tekan("Enter", 0.1); r.ketik("backup/", 12); r.tekan("Control+s", 0.4); time.sleep(0.6)
baru(".env.example", "env.example", 40); time.sleep(1.0); r.label(".env.example: nama variabel saja, tanpa nilai asli", 3); time.sleep(3.0); r.tanda("b03_akhir")
# b04 Dockerfile
r.tanda("b04"); baru("Dockerfile", "Dockerfile", 26); baru(".dockerignore", "dockerignore", 30)
ke_editor("Dockerfile"); ke_baris(baris_ke(P + "/Dockerfile", "npm ci")); r.kamera_editor(zoom=1.6); r.label("Pustaka dipasang sebelum kode disalin", 3); time.sleep(3.0)
ke_baris(baris_ke(P + "/Dockerfile", "USER node")); r.kamera_editor(zoom=1.6); r.label("Bukan root", 2.5); time.sleep(2.5); r.tanda("b04_akhir")
# b05 Docker Compose
r.tanda("b05"); baru("compose.yaml", "compose.yaml", 50); r.tanda("b05_sorot")
ke_baris(baris_ke(P + "/compose.yaml", "data-db:/var/lib")); r.kamera_editor(zoom=1.6); r.label("Volume: data tidak hilang", 2.5); time.sleep(2.5)
ke_baris(baris_ke(P + "/compose.yaml", "condition: service_healthy")); r.kamera_editor(zoom=1.6); r.label("App menunggu database siap", 2.5); time.sleep(2.5); r.tanda("b05_akhir")
# b07 Nginx dan trust proxy
r.tanda("b07"); baru("deploy/nginx.conf", "nginx.conf", 50); r.tanda("b07_express")
ke_editor("server.js"); editor(); sisip_setelah(SV, "const app = express();", "app.set('trust proxy', 1); // di belakang Nginx", 22)
ke_editor("server.js"); ganti_baris(baris_ke(SV, "cookie: { httpOnly: true"), "  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 12 * 60 * 60 * 1000 },", 40)
r.tekan("Control+s", 0.4); r.kamera_editor(zoom=1.4); r.label("Cookie secure saat production", 3); time.sleep(3.0); r.tanda("b07_akhir")
# b09 skrip backup
r.tanda("b09"); baru("deploy/backup.sh", "backup.sh", 40); r.tanda("b09_akhir")
# b11 versi AI (hanya ditampilkan, tidak dijalankan)
r.tanda("b11"); baru("uji/compose-ai.yaml", "compose-ai.yaml", 90)
ke_baris(baris_ke(P + "/uji/compose-ai.yaml", "SESSION_SECRET")); r.kamera_editor(zoom=1.6); r.label("Contoh kode bergaya hasil AI", 3); time.sleep(3.0); r.tanda("b11_akhir")
r.kamera(None); r.berkas_baru("uji/nginx-ai.conf", akar=True); r.kamera_editor(); r.ketik_kode(open(K + "nginx-ai.conf").read(), cps=90); r.tekan("Control+s", 0.4); time.sleep(0.8)
# b06 commit, lalu di "server"
term(); r.tanda("b06_commit"); r.terminal("git add .", tunggu=0.5); r.terminal('git commit -q -m "Siap deploy dengan Docker"', tunggu=1.2); r.tekan("Control+l", 0.3)
r.tanda("b06"); r.label("Demo lokal: folder ~/server berperan sebagai VPS", 4)
r.terminal(f"cd {SRV} && git clone -q {P} && cd siantre", cps=30, tunggu=1.0)
r.terminal('echo "DB_PASSWORD=$(openssl rand -hex 16)" > .env', cps=34, tunggu=0.4)
r.terminal('echo "SESSION_SECRET=$(openssl rand -hex 32)" >> .env', cps=34, tunggu=0.4)
r.terminal('echo "ALAMAT_PUBLIK=https://antre.bengkelmajujaya.test/" >> .env', cps=40, tunggu=0.6); r.tanda("b06_build")
sembunyi(f"cp /root/.ccr/ca-bundle.crt {SRV}/siantre/ && cd {SRV}/siantre && docker build -q --network host --build-arg HTTPS_PROXY=\"$HTTPS_PROXY\" --build-arg HTTP_PROXY=\"$HTTP_PROXY\" -f /home/user/antre/A12/Dockerfile.lokal -t siantre-app . ; rm -f {SRV}/siantre/ca-bundle.crt")
r.tekan("Control+l", 0.3); r.tanda("b06_up")
r.terminal("docker compose up -d", cps=26, tunggu=14.0); r.label("Tiga container menyala", 3); time.sleep(2.0); r.tekan("Control+l", 0.3)
r.terminal("docker compose ps --format 'table {{.Service}}\\t{{.Status}}'", cps=40, tunggu=1.5); r.label("db, app, nginx: berjalan", 3); time.sleep(2.5)
r.terminal("docker compose logs app", cps=30, tunggu=1.5); r.label("SiAntre berjalan", 2.5); time.sleep(2.5); r.tanda("b06_akhir")
sembunyi(f"cd {SRV}/siantre && docker compose exec -T app node db/pengguna.js")
# b09 backup dan uji pulihkan
r.tekan("Control+l", 0.3); r.tanda("b09_jalan")
r.terminal("sh deploy/backup.sh && ls backup", cps=30, tunggu=2.0); r.label("Backup malam ini", 2.5); time.sleep(2.0)
r.terminal("docker compose exec -T db createdb -U postgres uji_pulih", cps=34, tunggu=1.0)
r.terminal("gunzip -c backup/*.sql.gz | docker compose exec -T db psql -q -U postgres uji_pulih", cps=40, tunggu=2.0)
r.terminal("docker compose exec db psql -U postgres uji_pulih -c 'SELECT count(*) FROM services'", cps=40, tunggu=1.5); r.label("Dipulihkan dan dicek: backup ini bisa dipakai", 4); time.sleep(4.0); r.tanda("b09_jalan_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
subprocess.run(f"cd {P} && git tag -f bab-12", shell=True)
