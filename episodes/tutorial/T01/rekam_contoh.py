import sys, time, re
sys.path.insert(0, "/home/user/tut/alat")
from rekam import Rekaman
KODE = '''import random

angka_rahasia = random.randint(1, 100)
jumlah_tebakan = 0
print("Aku sudah memilih angka dari 1 sampai 100. Coba tebak!")

while True:
    tebakan = int(input("Tebakanmu: "))
    jumlah_tebakan = jumlah_tebakan + 1
    if tebakan < angka_rahasia:
        print("Terlalu kecil!")
    elif tebakan > angka_rahasia:
        print("Terlalu besar!")
    else:
        print("Benar! Kamu menebak dalam", jumlah_tebakan, "kali.")
        break'''
r = Rekaman("/home/user/tut/rekaman/ep1_contoh", "http://localhost:8888/notebooks/game_tebak_angka.ipynb")
pg = r.pg
pg.wait_for_selector(".jp-Cell .cm-content"); time.sleep(4)
r.gerak(500, 420, 0.01)
r.mulai()
r.kamera(None); r.label("Buka notebook baru", 3.0)
time.sleep(1.5)
cell = ".jp-Notebook .jp-Cell .cm-content"
r.klik(cell, dur=0.9); time.sleep(0.6)
cx, cy, cw, ch = r.kotak(".jp-Notebook .jp-Cell")
def ikuti():
    l = r.baris_aktif()
    if l: r.kamera([cx, l["y"] - 120, cw * 0.62, 280], zoom=1.75, pad=10)
r.label("Langkah 1: ketik kodenya", 4.0)
r.ketik_kode(KODE, cps=15, ikuti=ikuti)
time.sleep(0.8)
cx, cy, cw, ch = r.kotak(".jp-Notebook .jp-Cell")
r.kamera([cx, cy, cw, ch], pad=30); time.sleep(2.0)
r.label("Langkah 2: jalankan dengan Shift + Enter", 3.5)
r.gerak(cx + cw * 0.5, cy + ch - 30, 0.5)
pg.keyboard.press("Shift+Enter")
inp = pg.wait_for_selector(".jp-Stdin-input", timeout=15000); time.sleep(0.8)
lo, hi = 1, 100
r.label("Langkah 3: mainkan gamenya!", 3.5)
for _ in range(10):
    ib = pg.locator(".jp-Stdin-input").first.bounding_box()
    vh = pg.evaluate("innerHeight")
    if ib["y"] > vh - 140:
        r.gerak(r.mx, vh * 0.6, 0.3)
        for _ in range(int((ib["y"] - vh * 0.55) / 60) + 1):
            pg.mouse.wheel(0, 60); time.sleep(0.03)
        time.sleep(0.5); ib = pg.locator(".jp-Stdin-input").first.bounding_box()
    out = pg.locator(".jp-Cell .jp-OutputArea").first.bounding_box()
    r.kamera([out["x"], max(out["y"], ib["y"] - 260), out["width"] * 0.6, 320], zoom=1.9, pad=10)
    time.sleep(0.9)
    r.klik(xy=(ib["x"] + 40, ib["y"] + ib["height"] / 2), dur=0.4)
    g = (lo + hi) // 2
    time.sleep(0.4); r.ketik(str(g), cps=6); time.sleep(0.5); pg.keyboard.press("Enter"); time.sleep(1.5)
    teks = pg.locator(".jp-Cell .jp-OutputArea").first.inner_text()
    hasil = [s for s in teks.split("\n") if ("Terlalu" in s or "Benar" in s)]
    last = hasil[-1] if hasil else ""
    if "kecil" in last: lo = g + 1
    elif "besar" in last: hi = g - 1
    else: break
    try: pg.wait_for_selector(".jp-Stdin-input", timeout=5000)
    except Exception: break
time.sleep(0.6)
out = pg.locator(".jp-Cell .jp-OutputArea").first.bounding_box()
r.kamera([out["x"], out["y"] + out["height"] - 160, out["width"] * 0.6, 300], zoom=1.9, pad=10)
r.label("Benar! Gamenya berhasil.", 3.0, "atas")
time.sleep(4.0)
r.kamera(None); time.sleep(3.0)
r.selesai(); print("selesai", r.log["durasi"])
