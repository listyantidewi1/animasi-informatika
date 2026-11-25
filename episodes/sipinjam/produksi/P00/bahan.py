"""Bahan pembuka: dua HP (Rafi dan Nadia) meminjam kamera terakhir pada saat yang sama di aplikasi bergaya AI (sungguhan),
lalu tangkapan layar aplikasi jadi di HP. Hasil: /home/user/pinjam/bahan/*.png"""
import subprocess, time, sys
from playwright.sync_api import sync_playwright
B = "/home/user/pinjam/bahan/"; AI = "http://127.0.0.1:8001"; JADI = "http://127.0.0.1:8000"
def sql(db, q): return subprocess.run(["mysql", db, "-N", "-e", q], capture_output=True, text=True).stdout.strip()
def masuk(b, url, siapa, w=400, h=800):
    c = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=2.5 if w < 500 else 1.5, locale="id-ID", timezone_id="Asia/Jakarta"); pg = c.new_page(); pg.goto(url + "/index.php")
    pg.fill("input[name=username]", siapa); pg.fill("input[name=sandi]", "rahasia123"); pg.click("button"); pg.wait_for_load_state(); return pg
with sync_playwright() as p:
    b = p.chromium.launch()
    for coba in range(8):
        sql("sipinjam_ai", "DELETE FROM peminjaman WHERE alat_id=(SELECT id FROM alat WHERE kode='KAM-01') AND pengguna_id IN (SELECT id FROM pengguna WHERE username IN ('rafi','nadia')); UPDATE alat SET stok=1 WHERE kode='KAM-01'")
        r = masuk(b, AI, "rafi"); n = masuk(b, AI, "nadia")
        for pg, nama in ((r, "rafi"), (n, "nadia")): pg.goto(AI + "/peminjam/index.php?cari=Kamera"); pg.screenshot(path=B + f"hp_{nama}_sebelum.png")
        for pg in (r, n): pg.evaluate("() => { setTimeout(() => document.querySelector('form.baris').submit(), 30 - (Date.now() % 30)); }")
        time.sleep(2.0)
        for pg, nama in ((r, "rafi"), (n, "nadia")): pg.wait_for_load_state(); pg.screenshot(path=B + f"hp_{nama}_sesudah.png")
        k = sql("sipinjam_ai", "SELECT COUNT(*) FROM peminjaman p JOIN pengguna u ON u.id=p.pengguna_id WHERE alat_id=(SELECT id FROM alat WHERE kode='KAM-01') AND username IN ('rafi','nadia')")
        print("percobaan", coba, "peminjam kamera terakhir:", k, "stok:", sql("sipinjam_ai", "SELECT stok FROM alat WHERE kode='KAM-01'"), flush=True)
        r.context.close(); n.context.close()
        if k == "2": break
    else: sys.exit("balapan tidak terjadi")
    # aplikasi jadi di HP
    pg = masuk(b, JADI, "rafi"); pg.goto(JADI + "/peminjam/index.php"); pg.screenshot(path=B + "hp_jadi_alat.png"); pg.screenshot(path=B + "hp_jadi_alat_penuh.png", full_page=True)
    pg.goto(JADI + "/peminjam/pinjaman.php"); pg.screenshot(path=B + "hp_jadi_pinjaman.png"); pg.context.close()
    pg = masuk(b, JADI, "yusuf", 1280, 720); pg.goto(JADI + "/petugas/dipinjam.php"); pg.screenshot(path=B + "lap_jadi_dipinjam.png")
    pg.goto(JADI + "/petugas/laporan.php"); pg.screenshot(path=B + "lap_jadi_laporan.png"); pg.context.close()
    b.close()
