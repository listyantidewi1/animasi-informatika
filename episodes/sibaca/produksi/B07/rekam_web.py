import sys, time; sys.path.insert(0, "/home/user/baca/alat")
from webbantu import Peramban
from tulis import server, matikan, sh, db
print(sh("git reset -q --hard bab-07 && git log --oneline | head -1").stdout); db("contoh"); server()
w = Peramban("/home/user/baca/B07/web", url="http://localhost:5173", devtools=False)
w.pg.fill("form input >> nth=0", "2425102"); w.pg.fill("input[type=password]", "rahasia123"); w.pg.click("form button"); w.pg.wait_for_selector(".saring"); time.sleep(1.0)
CARI = ".saring input >> nth=0"
def kam():
    bb = w.kotak("main"); w.kam(rect=[bb[0], 0, bb[2], 560], pad=20)
def ganti(teks, cps=7):
    w.klik(CARI, jeda=0.3); w.pg.keyboard.press("Control+a"); time.sleep(0.3)
    if teks == "": w.pg.keyboard.press("Delete")
    for ch in teks: w.pg.keyboard.type(ch); time.sleep(1 / cps)
    time.sleep(1.2)
w.mulai(); w.kamera(None); time.sleep(1.0); w.tanda("awal"); kam(); w.label("Masuk sebagai Nadia", 2.5); time.sleep(2.5)
w.tanda("laskar"); ganti("laskar"); w.label("laskar: Laskar Pelangi", 3.0); time.sleep(3.2)
w.tanda("tere"); ganti("tere"); w.label("tere: pencarian juga melihat nama penulis", 5.0); time.sleep(5.5)
w.tanda("komputer"); ganti(""); w.pilih(".saring select", "Komputer", jeda=1.5); w.klik(".saring input[type=checkbox]", jeda=1.2); w.label("Kategori Komputer, hanya yang tersedia", 3.5); time.sleep(3.8)
w.tanda("persen"); w.klik(".saring input[type=checkbox]", jeda=0.6); w.pilih(".saring select", "Semua kategori", jeda=0.8); ganti("%", 3)
w.tanda("persen_hasil"); w.label("Hanya satu: judulnya memang mengandung %", 5.0); time.sleep(6.0); w.tanda("persen_akhir")
w.selesai(); matikan()
