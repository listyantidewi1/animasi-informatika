"""Tangkapan layar versi "buatan AI" untuk pembuka: tiket dengan jam bergeser (timezone UTC) dan rekap dengan BETWEEN.
Aplikasinya salinan acuan di /home/user/ai-siparkir (timezone UTC, RekapController memakai whereBetween)."""
import sys, subprocess, re, time; sys.path.insert(0, "/home/user/parkir/alat")
from webbantu import server, matikan
from playwright.sync_api import sync_playwright
AI = "/home/user/ai-siparkir"; L = "/home/user/parkir/P00"; U = "http://127.0.0.1:8020"
def env(db):
    s = open(AI + "/.env").read(); open(AI + "/.env", "w").write(re.sub(r"DB_DATABASE=.*", "DB_DATABASE=" + db, s))
def masuk(ctx, email):
    pg = ctx.new_page(); pg.goto(U + "/masuk"); pg.fill("input[name=email]", email); pg.fill("input[name=password]", "rahasia123"); pg.click("button.tombol"); pg.wait_for_load_state(); return pg
with sync_playwright() as p:
    b = p.chromium.launch()
    # 1. Rekap Oktober dengan BETWEEN, data contoh yang sama dengan acuan
    env("siparkir_acuan"); server(AI, 8020, waktu="2026-11-23 13:00:00")
    c = b.new_context(viewport={"width": 1100, "height": 700}, device_scale_factor=2, locale="id-ID", timezone_id="Asia/Jakarta")
    pg = masuk(c, "ratna@nusabakti.test"); pg.goto(U + "/rekap?dari=2026-10-01&sampai=2026-10-31"); teks = pg.inner_text("body")
    print("REKAP AI:", re.findall(r"Rp[\d.]+", teks)[:2], re.findall(r"\b1\.\d{3}\b", teks)[:2]); pg.screenshot(path=L + "/rekap_ai.png"); c.close(); matikan(8020)
    # 2. Tiket: database tersendiri, kendaraan masuk pukul 07.15 WIB
    subprocess.run("""mysql -e "DROP DATABASE IF EXISTS siparkir_ai; CREATE DATABASE siparkir_ai; GRANT ALL ON siparkir_ai.* TO 'siparkir'@'localhost';" """, shell=True, check=True)
    env("siparkir_ai"); print(subprocess.run(["/home/user/parkir/alat/bersih.sh", AI, "php artisan migrate:fresh --seed --force 2>&1 | tail -2"], capture_output=True, text=True).stdout)
    server(AI, 8020, waktu="2026-11-23 07:15:00")
    c = b.new_context(viewport={"width": 1100, "height": 700}, device_scale_factor=3, locale="id-ID", timezone_id="Asia/Jakarta")
    pg = masuk(c, "joko@nusabakti.test"); pg.fill("input[name=plate]", "n 1234 ab"); pg.select_option("select[name=type]", "motor"); pg.click("form[action='/parkir'] button.tombol"); pg.wait_for_load_state()
    print("TIKET AI:", pg.url, re.findall(r"\d\d/\d\d/\d{4} \d\d:\d\d", pg.inner_text("body"))); pg.locator(".struk").screenshot(path=L + "/tiket_ai.png")
    kotak = pg.locator(".struk").bounding_box(); baris = pg.get_by_text("Masuk", exact=True).first.bounding_box()
    print("rMasuk", [0, round((baris["y"] - kotak["y"]) / kotak["height"], 3), 1, round(baris["height"] / kotak["height"], 3)])
    c.close(); matikan(8020); b.close()
subprocess.run("""mysql -e "DROP DATABASE IF EXISTS siparkir_ai;" """, shell=True); env("siparkir_acuan")
