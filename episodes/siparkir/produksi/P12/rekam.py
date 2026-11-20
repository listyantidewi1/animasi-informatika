import sys, time, os; sys.path.insert(0, "/home/user/parkir/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan, banding
T = "bab-12"
siapkan("bab-11", "seed")
b = Bab("/home/user/parkir/P12/rek"); r = b.r
r.mulai(); r.kamera(None); time.sleep(0.8)
# b03 Dockerfile + .dockerignore
DF = "Dockerfile"; r.tanda("b03"); b.ubah(DF, acuan(DF, T), cps=20); time.sleep(0.6)
b.sorot(DF, "FROM dunglas/frankenphp:1-php8.3", "Image dasar: FrankenPHP dengan PHP 8.3", 7.0, tanda="b03_from")
b.sorot(DF, "RUN install-php-extensions", "Ekstensi untuk MySQL", 4.5, tanda="b03_ext")
b.sorot(DF, "COPY --from=composer:2", "Composer, kode kita, lalu composer install tanpa alat pengembangan", 11.0, tanda="b03_salin", n=5)
DI = ".dockerignore"; r.kamera(None); r.tanda("b03_abai"); b.ubah(DI, acuan(DI, T), cps=16); time.sleep(0.5)
b.sorot(DI, ".env", ".env dan vendor dari laptop tidak ikut tersalin", 7.5, tanda="b03_env", n=2, ke=1); r.tanda("b03_akhir")
# b04 compose.yaml
CY = "compose.yaml"; r.kamera(None); r.tanda("b04"); b.ubah(CY, acuan(CY, T), cps=30); time.sleep(0.6); b.salin(".env.example", tag=T)
b.sorot(CY, "build: .", "Layanan app: dibuat dari Dockerfile tadi", 3.5, tanda="b04_app")
b.sorot(CY, "ports:", "Port 80 dan 443", 4.0, tanda="b04_port", n=3)
b.sorot(CY, "SERVER_NAME:", "Nama domain: FrankenPHP mengurus sertifikat HTTPS sendiri", 11.0, tanda="b04_domain")
b.sorot(CY, "DB_HOST: db", "db = nama layanan kedua", 10.0, tanda="b04_host")
b.sorot(CY, "image: mysql:8.4", "Layanan db: image MySQL", 3.5, tanda="b04_db")
b.sorot(CY, "- data_mysql:/var/lib/mysql", "Volume: data tidak hilang saat container dibuat ulang", 6.5, tanda="b04_volume"); r.tanda("b04_akhir")
# b05 commit
b.term(); b.commit("Docker Compose untuk server", "b05_commit"); time.sleep(1.0); r.tanda("b05_commit_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-12"); print("CACAT", CACAT); banding(T); print(sh("git status --short | head; git log --oneline | head -3").stdout)
# tangkapan halaman masuk untuk adegan "online"
from webbantu import server, matikan
from playwright.sync_api import sync_playwright
server()
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1280, "height": 640}, device_scale_factor=2); pg.goto("http://localhost:8000/masuk"); pg.screenshot(path="/home/user/parkir/P12/masuk.png"); br.close()
matikan()
