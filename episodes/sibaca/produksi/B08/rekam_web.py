import sys, time; sys.path.insert(0, "/home/user/baca/alat")
from webbantu import Peramban
from tulis import server, matikan, sh, db
print(sh("git reset -q --hard bab-08 && git log --oneline | head -1").stdout); db("contoh"); server()
w = Peramban("/home/user/baca/B08/web", url="http://localhost:5173", devtools=False)
w.pg.fill("form input >> nth=0", "2425102"); w.pg.fill("input[type=password]", "rahasia123"); w.pg.click("form button"); w.pg.wait_for_selector(".saring"); time.sleep(1.0)
CARI = ".saring input >> nth=0"
def kam(h=560):
    bb = w.kotak("main"); w.kam(rect=[bb[0], 0, bb[2], h], pad=20)
def ganti(teks, cps=7):
    w.klik(CARI, jeda=0.3); w.pg.keyboard.press("Control+a"); time.sleep(0.3)
    for ch in teks: w.pg.keyboard.type(ch); time.sleep(1 / cps)
    time.sleep(1.2)
w.mulai(); w.kamera(None); time.sleep(1.0); w.tanda("awal"); kam(); w.label("Nadia sedang meminjam dua buku", 3.0); time.sleep(3.5)
w.tanda("bumi"); ganti("bumi"); time.sleep(0.6); w.klik('li.kartu:has(b:text-is("Bumi")) button', jeda=1.5)
w.tanda("kode"); w.label("Kode eksemplar tampil, yang tersedia berkurang satu", 5.0); time.sleep(5.5)
w.tanda("pinjamanku"); w.kamera(None); time.sleep(0.4); w.klik('nav a:has-text("Pinjamanku")', jeda=1.5); kam(620); w.label("Tiga buku, dengan tanggal pengembaliannya", 5.0); time.sleep(5.5)
w.tanda("keempat"); w.kamera(None); time.sleep(0.4); w.klik('nav a:has-text("Katalog")', jeda=1.2); kam(); ganti("hujan"); w.klik('li.kartu:has(b:text-is("Hujan")) button', jeda=1.5)
w.tanda("tolak"); w.label("Ditolak: batas pinjam 3 buku", 4.5); time.sleep(5.5); w.tanda("tolak_akhir")
w.selesai(); matikan()
