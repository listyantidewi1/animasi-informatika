"""Balapan sungguhan di aplikasi bergaya AI: Rafi dan Nadia meminjam kamera terakhir pada saat yang sama. Server :8001 harus menyala."""
import subprocess, time
from playwright.sync_api import sync_playwright
AI = "http://127.0.0.1:8001"
def sql(q): return subprocess.run(["mysql", "sipinjam_ai", "-N", "-e", q], capture_output=True, text=True).stdout.strip()
def masuk(b, siapa):
    c = b.new_context(viewport={"width": 400, "height": 800}); pg = c.new_page(); pg.goto(AI + "/index.php"); pg.fill("input[name=username]", siapa); pg.fill("input[name=sandi]", "rahasia123"); pg.click("button"); pg.wait_for_load_state(); return pg
def balap():
    with sync_playwright() as p:
        b = p.chromium.launch()
        for coba in range(10):
            sql("DELETE FROM peminjaman WHERE alat_id=(SELECT id FROM alat WHERE kode='KAM-01') AND pengguna_id IN (SELECT id FROM pengguna WHERE username IN ('rafi','nadia')); UPDATE alat SET stok=1 WHERE kode='KAM-01'")
            r = masuk(b, "rafi"); n = masuk(b, "nadia")
            for pg in (r, n): pg.goto(AI + "/peminjam/index.php?cari=Kamera")
            for pg in (r, n): pg.evaluate("() => { setTimeout(() => document.querySelector('form.baris').submit(), 30 - (Date.now() % 30)); }")
            time.sleep(2.0)
            k = sql("SELECT COUNT(*) FROM peminjaman p JOIN pengguna u ON u.id=p.pengguna_id WHERE alat_id=(SELECT id FROM alat WHERE kode='KAM-01') AND username IN ('rafi','nadia')")
            r.context.close(); n.context.close(); print("percobaan", coba, "peminjam:", k, flush=True)
            if k == "2": b.close(); return True
        b.close(); return False
