"""Pembantu rekaman Jupyter Notebook untuk seri tutorial."""
import time
CELL = ".jp-Notebook .jp-Cell"
def sel(i): return f"{CELL} >> nth={i}"
def cps(teks, dur): return max(6, min(32, len(teks) / max(0.5, dur)))
class J:
    def __init__(s, r): s.r = r; s.pg = r.pg
    def ikuti(s, i=None):
        def f():
            l = s.r.baris_aktif()
            if l: s.r.kamera([10, l["y"] - 150, 900, 300], zoom=1.75, pad=10)
        return f
    def ketik(s, teks, dur, baris_baru=True):
        t0 = time.time()
        if baris_baru: s.pg.keyboard.press("End"); s.pg.keyboard.press("Enter"); time.sleep(0.1)
        s.r.ketik_kode(teks, cps=cps(teks, dur * 0.85), ikuti=s.ikuti())
        sisa = dur - (time.time() - t0)
        if sisa > 0: time.sleep(sisa)
    def masuk(s, i, akhir=True):
        s.r.klik(sel(i) + " >> .cm-content", dur=0.45)
        if akhir: s.pg.keyboard.press("Control+End")
        time.sleep(0.2)
    def sel_baru(s):  # buat sel baru di bawah sel aktif (mode perintah: Esc lalu b)
        s.pg.keyboard.press("Escape"); time.sleep(0.15); s.pg.keyboard.press("b"); time.sleep(0.3); s.pg.keyboard.press("Enter"); time.sleep(0.2)
    def kotak_sel(s, i): return s.r.kotak(sel(i))
    def out(s, i):
        return s.pg.locator(sel(i)).locator(".jp-OutputArea").bounding_box()
    def jalankan(s, i, tunggu=1.5):
        x, y, w, h = s.kotak_sel(i); s.r.kamera([x, y, 1100, h + 60], pad=20); time.sleep(0.6)
        s.pg.keyboard.press("Shift+Enter"); time.sleep(tunggu)
    def gulir_ke(s, y_bawah, sisa=140):
        vh = s.pg.evaluate("innerHeight")
        if y_bawah > vh - sisa:
            s.r.gerak(s.r.mx, vh * 0.6, 0.25)
            for _ in range(int((y_bawah - vh * 0.55) / 60) + 1): s.pg.mouse.wheel(0, 60); time.sleep(0.03)
            time.sleep(0.4); return True
        return False
    def gulir_atas(s):
        for _ in range(60): s.pg.mouse.wheel(0, -100); time.sleep(0.005)
        time.sleep(0.4)
    def jawab(s, i, teks, cps_=7):
        s.pg.wait_for_selector(".jp-Stdin-input", timeout=15000); time.sleep(0.3)
        ib = s.pg.locator(".jp-Stdin-input").first.bounding_box()
        if s.gulir_ke(ib["y"] + ib["height"]): ib = s.pg.locator(".jp-Stdin-input").first.bounding_box()
        o = s.out(i); s.r.kamera([o["x"], ib["y"] - 230, 950, 300], zoom=1.85, pad=10); time.sleep(0.5)
        s.r.klik(xy=(ib["x"] + 40, ib["y"] + ib["height"] / 2), dur=0.35); s.r.ketik(teks, cps=cps_); time.sleep(0.35)
        s.pg.keyboard.press("Enter"); time.sleep(1.0)
    def fokus_out(s, i, zoom=1.8, tinggi=None, lebar=1000):
        o = s.out(i)
        if s.gulir_ke(o["y"] + o["height"]): o = s.out(i)
        h = tinggi or o["height"]
        s.r.kamera([o["x"], o["y"] + o["height"] - h, lebar, h], zoom=zoom, pad=12)
    def fokus_sel(s, i, zoom=None):
        x, y, w, h = s.kotak_sel(i)
        if s.gulir_ke(y + min(h, 500)): x, y, w, h = s.kotak_sel(i)
        s.r.kamera([x, y, 1100, h], zoom=zoom, pad=20)
