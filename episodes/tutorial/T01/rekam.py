import sys, time, json
sys.path.insert(0, "/home/user/tut/alat")
from rekam import Rekaman
from durasi import beat
D = beat("T01")
A = 'import random\n\nangka_rahasia = random.randint(1, 100)'
B = 'jumlah_tebakan = 0\nprint("Aku sudah memilih angka dari 1 sampai 100. Coba tebak!")'
C = 'while True:\n    tebakan = int(input("Tebakanmu: "))'
E = '    jumlah_tebakan = jumlah_tebakan + 1'
F = '''    if tebakan < angka_rahasia:
        print("Terlalu kecil!")
    elif tebakan > angka_rahasia:
        print("Terlalu besar!")
    else:
        print("Benar! Kamu menebak dalam", jumlah_tebakan, "kali.")
        break'''
def cps(teks, dur): return max(6, min(30, len(teks) / dur))
r = Rekaman("/home/user/tut/T01/rek", "http://localhost:8888/notebooks/T01_game_tebak_angka.ipynb")
pg = r.pg
pg.wait_for_selector(".jp-Cell .cm-content"); time.sleep(4); r.gerak(600, 500, 0.01)
r.mulai()
cell0 = ".jp-Notebook .jp-Cell >> nth=0"
def ikuti():
    l = r.baris_aktif()
    cx, cy, cw, ch = r.kotak(".jp-Notebook .jp-Cell")
    if l: r.kamera([cx, l["y"] - 150, 900, 300], zoom=1.75, pad=10)
def ketik(teks, dur, awal_baris_baru=True):
    t0 = time.time()
    if awal_baris_baru: pg.keyboard.press("End"); pg.keyboard.press("Enter"); time.sleep(0.1)
    r.ketik_kode(teks, cps=cps(teks, dur * 0.85), ikuti=ikuti)
    sisa = dur - (time.time() - t0)
    if sisa > 0: time.sleep(sisa)
# b02: kenalan dengan sel
r.tanda("b02"); r.kamera(None); time.sleep(2.5)
cx, cy, cw, ch = r.kotak(cell0)
r.kamera([0, 0, 1000, cy + 120], pad=20); r.gerak(cx + 300, cy + ch / 2, 1.0); time.sleep(0.5)
r.label("Sel: tempat menulis kode", 5)
time.sleep(4.5); r.klik(cell0 + " >> .cm-content", dur=0.5)
r.label("Jalankan: Shift + Enter", 5); time.sleep(max(1, D[2] - 9.5))
r.tanda("b02_akhir")
# b05
r.tanda("b05"); ketik(A, D[5] * 0.42, awal_baris_baru=False); time.sleep(0.4); r.tanda("b05_akhir")
r.tanda("b06"); pg.keyboard.press("End"); pg.keyboard.press("Enter"); ketik(B, D[6] * 0.42); time.sleep(0.4); r.tanda("b06_akhir")
# b08: jalankan
r.tanda("b08"); cx, cy, cw, ch = r.kotak(cell0)
r.kamera([cx, cy, 1100, ch + 80], pad=20); time.sleep(1.2); pg.keyboard.press("Shift+Enter"); time.sleep(1.5)
out = pg.locator(".jp-Cell >> nth=0").locator(".jp-OutputArea").bounding_box()
r.kamera([out["x"], out["y"] - 80, 1000, out["height"] + 120], zoom=1.9, pad=10)
time.sleep(max(2, D[8] - 3.5)); r.tanda("b08_akhir")
# kembali ke sel pertama
r.klik(cell0 + " >> .cm-content", dur=0.5); pg.keyboard.press("Control+End"); time.sleep(0.3)
r.tanda("b10"); pg.keyboard.press("Enter"); ketik(C, D[10] * 0.45); time.sleep(0.4); r.tanda("b10_akhir")
r.tanda("b11"); ketik(E, D[11] * 0.42); time.sleep(0.4); r.tanda("b11_akhir")
r.tanda("b13"); ketik(F, D[13] * 0.9); time.sleep(0.6); r.tanda("b13_akhir")
# b14: main
r.tanda("b14"); cx, cy, cw, ch = r.kotak(cell0); r.kamera([cx, cy + ch - 300, 1000, 300], pad=20)
pg.keyboard.press("Shift+Enter"); pg.wait_for_selector(".jp-Stdin-input", timeout=15000); time.sleep(0.6)
lo, hi = 1, 100; tebakan = []
for _ in range(10):
    ib = pg.locator(".jp-Stdin-input").first.bounding_box(); vh = pg.evaluate("innerHeight")
    if ib["y"] > vh - 160:
        r.gerak(r.mx, vh * 0.6, 0.3)
        for _ in range(int((ib["y"] - vh * 0.5) / 60) + 1): pg.mouse.wheel(0, 60); time.sleep(0.03)
        time.sleep(0.4); ib = pg.locator(".jp-Stdin-input").first.bounding_box()
    out = pg.locator(".jp-Cell >> nth=0").locator(".jp-OutputArea").bounding_box()
    r.kamera([out["x"], ib["y"] - 230, 900, 300], zoom=1.9, pad=10); time.sleep(0.5)
    r.klik(xy=(ib["x"] + 40, ib["y"] + ib["height"] / 2), dur=0.35)
    g = (lo + hi) // 2; r.ketik(str(g), cps=7); time.sleep(0.3); pg.keyboard.press("Enter"); time.sleep(1.1)
    teks = pg.locator(".jp-Cell >> nth=0").locator(".jp-OutputArea").inner_text()
    hasil = [s for s in teks.split("\n") if ("Terlalu" in s or "Benar" in s)]; last = hasil[-1] if hasil else ""
    if "kecil" in last: lo = g + 1; tebakan.append([g, "kecil"])
    elif "besar" in last: hi = g - 1; tebakan.append([g, "besar"])
    else: tebakan.append([g, "benar"]); break
    pg.wait_for_selector(".jp-Stdin-input", timeout=5000)
time.sleep(0.4)
out = pg.locator(".jp-Cell >> nth=0").locator(".jp-OutputArea").bounding_box()
r.kamera([out["x"], out["y"] + out["height"] - 200, 900, 250], zoom=1.9, pad=10); time.sleep(2.5)
r.tanda("b14_akhir"); r.log["tebakan"] = tebakan
# b15: ubah dan uji
r.tanda("b15"); r.gerak(r.mx, 300, 0.3)
for _ in range(40): pg.mouse.wheel(0, -80); time.sleep(0.01)
time.sleep(0.5)
r.klik(cell0 + " >> .cm-content", dur=0.5); pg.keyboard.press("Control+Home")
for _ in range(2): pg.keyboard.press("ArrowDown")
pg.keyboard.press("End"); pg.keyboard.press("ArrowLeft")
l = r.baris_aktif(); cx, cy, cw, ch = r.kotak(cell0); r.kamera([cx, l["y"] - 60, 900, 200], zoom=1.9, pad=10); time.sleep(1.2)
r.ketik("0", 4); time.sleep(0.6)
for _ in range(2): pg.keyboard.press("ArrowDown")
pg.keyboard.press("End")
for _ in range(15): pg.keyboard.press("ArrowLeft")
time.sleep(0.6); r.ketik("0", 4); time.sleep(1.0)
r.kamera([cx, cy, 1100, ch], pad=20); pg.keyboard.press("Shift+Enter"); pg.wait_for_selector(".jp-Stdin-input", timeout=15000); time.sleep(1.5)
ib = pg.locator(".jp-Stdin-input").first.bounding_box(); vh = pg.evaluate("innerHeight")
if ib["y"] > vh - 300:
    for _ in range(int((ib["y"] - vh * 0.35) / 60) + 1): pg.mouse.wheel(0, 60); time.sleep(0.03)
    time.sleep(0.4); ib = pg.locator(".jp-Stdin-input").first.bounding_box()
r.kamera([ib["x"] - 80, ib["y"] - 100, 900, 200], zoom=1.9, pad=10); time.sleep(1.5)
r.klik(xy=(ib["x"] + 40, ib["y"] + ib["height"] / 2), dur=0.35); r.ketik("lima", 5); time.sleep(0.5); pg.keyboard.press("Enter"); time.sleep(2.0)
err = pg.locator(".jp-Cell >> nth=0").locator(".jp-RenderedText[data-mime-type='application/vnd.jupyter.stderr']").last.bounding_box()
vh = pg.evaluate("innerHeight")
if err and err["y"] + err["height"] > vh - 40:
    r.gerak(r.mx, vh * 0.6, 0.3)
    for _ in range(int((err["y"] + err["height"] - vh + 120) / 60) + 1): pg.mouse.wheel(0, 60); time.sleep(0.03)
    time.sleep(0.5); err = pg.locator(".jp-Cell >> nth=0").locator(".jp-RenderedText[data-mime-type='application/vnd.jupyter.stderr']").last.bounding_box()
if err:
    r.kamera([err["x"], err["y"], min(1300, err["width"]), err["height"]], pad=20); time.sleep(3)
    r.kamera([err["x"], err["y"] + err["height"] - 70, 1000, 70], zoom=2.2, pad=10); time.sleep(4)
r.tanda("b15_akhir")
time.sleep(1); r.selesai(); print("selesai", r.log["durasi"], tebakan)
