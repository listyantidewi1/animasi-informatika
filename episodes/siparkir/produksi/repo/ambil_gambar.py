"""Tangkapan layar untuk README repo (docs/gambar/). Memakai aplikasi acuan (isi = akhir bab 12) dengan database tersendiri
siparkir_gambar: data awal + ContohSeeder, lalu tiga kendaraan masuk pagi hari 23 November 2026. Jalankan saat tidak ada rekaman."""
import sys, subprocess, re, os; sys.path.insert(0, "/home/user/parkir/alat")
from webbantu import server, matikan
from playwright.sync_api import sync_playwright
A = "/home/user/acuan-siparkir"; G = "/home/user/parkir/repo/docs/gambar"; U = "http://127.0.0.1:8021"; os.makedirs(G, exist_ok=True)
def env(db):
    s = open(A + "/.env").read(); open(A + "/.env", "w").write(re.sub(r"DB_DATABASE=.*", "DB_DATABASE=" + db, s))
def masuk(ctx, email):
    pg = ctx.new_page(); pg.goto(U + "/masuk"); pg.fill("input[name=email]", email); pg.fill("input[name=password]", "rahasia123"); pg.click("button.tombol"); pg.wait_for_load_state(); return pg
MASUK = 'form[action="/parkir"]'
try:
    subprocess.run("""mysql -e "DROP DATABASE IF EXISTS siparkir_gambar; CREATE DATABASE siparkir_gambar; GRANT ALL ON siparkir_gambar.* TO 'siparkir'@'localhost';" """, shell=True, check=True)
    env("siparkir_gambar")
    print(subprocess.run(["/home/user/parkir/alat/bersih.sh", A, "php artisan migrate:fresh --seed --force 2>&1 | tail -1; php artisan db:seed --class=ContohSeeder --force 2>&1 | tail -1"], capture_output=True, text=True).stdout)
    with sync_playwright() as p:
        b = p.chromium.launch()
        K = dict(viewport={"width": 1100, "height": 720}, device_scale_factor=2, locale="id-ID", timezone_id="Asia/Jakarta")
        # pagi: tiga kendaraan masuk
        server(A, 8021, waktu="2026-11-23 06:52:00"); c = b.new_context(**K); pg = masuk(c, "joko@nusabakti.test")
        for pl, j in [("N 4821 KD", "motor"), ("N 1305 BC", "mobil"), ("N 2290 AC", "motor")]:
            pg.goto(U + "/parkir"); pg.fill("input[name=plate]", pl); pg.select_option("select[name=type]", j); pg.click(MASUK + " button.tombol"); pg.wait_for_load_state()
        tiket = pg.url; c.close(); matikan(8021)
        # 09.20: petugas
        server(A, 8021, waktu="2026-11-23 09:20:30"); c = b.new_context(**K); pg = masuk(c, "joko@nusabakti.test")
        pg.goto(U + "/parkir"); pg.screenshot(path=G + "/petugas-parkir.png")
        id1 = subprocess.run(["mysql", "-N", "siparkir_gambar", "-e", "select min(id) from parkings where open=1"], capture_output=True, text=True).stdout.strip()
        pg.goto(f"{U}/parkir/{id1}/keluar"); pg.screenshot(path=G + "/petugas-keluar.png")
        c3 = b.new_context(**{**K, "device_scale_factor": 3}); p3 = masuk(c3, "joko@nusabakti.test")
        p3.goto(tiket); p3.locator(".struk").screenshot(path=G + "/tiket.png")
        pg.click("form.kartu.sempit button.tombol"); pg.wait_for_load_state(); print("struk:", pg.url)
        p3.goto(pg.url); p3.locator(".struk").screenshot(path=G + "/struk.png"); c3.close()
        # HP
        h = b.new_context(viewport={"width": 390, "height": 780}, device_scale_factor=3, is_mobile=True, locale="id-ID", timezone_id="Asia/Jakarta")
        ph = h.new_page(); ph.goto(U + "/masuk"); ph.screenshot(path=G + "/hp-masuk.png")
        ph.fill("input[name=email]", "joko@nusabakti.test"); ph.fill("input[name=password]", "rahasia123"); ph.click("button.tombol"); ph.wait_for_load_state(); ph.goto(U + "/parkir"); ph.screenshot(path=G + "/hp-parkir.png"); h.close(); c.close()
        # owner dan admin
        c = b.new_context(**K); pg = masuk(c, "ratna@nusabakti.test"); pg.goto(U + "/rekap?dari=2026-10-01&sampai=2026-10-31"); pg.screenshot(path=G + "/owner-rekap.png")
        print("REKAP:", re.findall(r"Rp[\d.]+", pg.inner_text("body"))[:2]); c.close()
        c = b.new_context(**K); pg = masuk(c, "sinta@nusabakti.test"); pg.goto(U + "/admin/tarif"); pg.screenshot(path=G + "/admin-tarif.png"); c.close()
        matikan(8021); b.close()
finally:
    env("siparkir_acuan"); matikan(8021); subprocess.run("""mysql -e "DROP DATABASE IF EXISTS siparkir_gambar;" """, shell=True)
print(sorted(os.listdir(G)))
