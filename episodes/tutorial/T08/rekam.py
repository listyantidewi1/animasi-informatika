import sys, time
sys.path.insert(0, "/home/user/tut/alat")
from rekam import Rekaman
from durasi import beat
from jupy import J, sel
D = beat("T08")
C0 = 'huruf = "abcdefghijklmnopqrstuvwxyz"\nprint(huruf.index("c"))\nprint(huruf[5])'
C1 = 'def kunci(pesan, geser):\n    hasil = ""\n    for h in pesan:\n        if h in huruf:\n            posisi = huruf.index(h) + geser\n            hasil = hasil + huruf[posisi]\n        else:\n            hasil = hasil + h\n    return hasil\n\nprint(kunci("ketemu di kantin jam sepuluh", 3))'
C2 = 'def buka(sandi, geser):\n    return kunci(sandi, -geser)\n\nrahasia = kunci("ketemu di kantin jam sepuluh", 3)\nprint(buka(rahasia, 3))'
C3 = 'print(kunci("zebra", 3))'
C4 = 'sandi = "uhuap zvyl shapohu ihzrla"\nfor g in range(26):\n    print(g, buka(sandi, g))'
r = Rekaman("/home/user/tut/T08/rek", "http://localhost:8888/notebooks/T08_sandi.ipynb"); pg = r.pg; j = J(r)
pg.wait_for_selector(".jp-Cell .cm-content"); time.sleep(4); r.gerak(600, 500, 0.01)
r.mulai(); time.sleep(0.5); r.kamera(None); j.masuk(0)
r.tanda("b04"); j.ketik(C0, D[4] * 0.5, baris_baru=False); j.jalankan(0, 1.5); j.fokus_out(0, zoom=2.0); time.sleep(3.0); r.tanda("b04_akhir")
r.tanda("b06"); j.ketik(C1, D[6] * 0.6, baris_baru=False); j.jalankan(1, 1.5); j.fokus_out(1, zoom=2.0); time.sleep(3.0); r.tanda("b06_akhir")
r.tanda("b07"); j.ketik(C2, D[7] * 0.5, baris_baru=False); j.jalankan(2, 1.5); j.fokus_out(2, zoom=2.0); time.sleep(3.0); r.tanda("b07_akhir")
r.tanda("b09"); j.ketik(C3, 2.5, baris_baru=False); time.sleep(0.8); r.tanda("b09_tebak"); j.jalankan(3, 2.0); j.fokus_out(3, zoom=1.5); time.sleep(5.0); r.tanda("b09_akhir")
r.tanda("b11"); j.gulir_atas(); r.kamera(None); time.sleep(0.6); j.fokus_sel(1, zoom=1.6); time.sleep(0.5); j.masuk(1, akhir=False); pg.keyboard.press("Control+Home")
for _ in range(4): pg.keyboard.press("ArrowDown"); time.sleep(0.05)
j.ketik("            posisi = posisi % 26", 3.5); time.sleep(0.6)
j.jalankan(1, 1.5); j.fokus_out(1, zoom=2.0); time.sleep(1.5)
pg.locator(sel(3)).scroll_into_view_if_needed(); time.sleep(0.5); j.masuk(3); j.jalankan(3, 1.5); j.fokus_out(3, zoom=2.2); time.sleep(3.0); r.tanda("b11_akhir")
r.tanda("b13"); pg.locator(sel(4)).scroll_into_view_if_needed(); time.sleep(0.4); j.masuk(4); j.ketik(C4, D[13] * 0.4, baris_baru=False); j.jalankan(4, 1.5)
o = j.out(4); j.gulir_ke(o["y"] + o["height"], 40); time.sleep(0.4); o = j.out(4); r.kamera([o["x"], o["y"], 800, o["height"]], pad=10); time.sleep(3.0)
o = j.out(4); h = o["height"] / 26; r.kamera([o["x"], o["y"] + h * 5, 700, h * 5], zoom=2.3, pad=10); time.sleep(4.0); r.tanda("b13_akhir")
time.sleep(0.5); r.selesai(); print("selesai", r.log["durasi"])
