import sys, time
sys.path.insert(0, "/home/user/tut/alat")
from rekam import Rekaman
from durasi import beat
from jupy import J, sel
D = beat("T03")
C0 = 'import pandas as pd\n\ndata = pd.read_csv("nilai.csv")\ndata'
C1 = 'data["Rata-rata"] = data[["Matematika", "IPA", "Bahasa"]].mean(axis=1).round(1)\ndata'
C2 = 'data.sort_values(by="Rata-rata", ascending=False)'
C3 = 'data[data["Rata-rata"] < 75]'
C4 = 'import matplotlib.pyplot as plt\n\nplt.figure(figsize=(10, 4))\nplt.bar(data["Nama"], data["Rata-rata"])\nplt.axhline(75, color="red", linestyle="--")\nplt.title("Rata-rata Nilai Kelas 8A")\nplt.show()'
r = Rekaman("/home/user/tut/T03/rek", "http://localhost:8888/notebooks/T03_rapor.ipynb"); pg = r.pg; j = J(r)
pg.wait_for_selector(".jp-Cell .cm-content"); time.sleep(4); r.gerak(600, 500, 0.01)
r.mulai(); time.sleep(0.5); j.masuk(0)
r.tanda("b04"); j.ketik(C0, D[4] * 0.55, baris_baru=False); j.jalankan(0, 1.8); j.fokus_out(0, zoom=1.5); time.sleep(3.0); r.tanda("b04_akhir")
r.tanda("b07"); time.sleep(0.3); j.ketik(C1, D[7] * 0.45, baris_baru=False); j.jalankan(1, 1.5); j.fokus_out(1, zoom=1.45); time.sleep(3.0); r.tanda("b07_akhir")
r.tanda("b09"); j.ketik(C2, D[9] * 0.25, baris_baru=False); j.jalankan(2, 1.3); j.fokus_out(2, zoom=1.45); time.sleep(3.0)
j.ketik(C3, D[9] * 0.18, baris_baru=False); j.jalankan(3, 1.3); j.fokus_out(3, zoom=1.7); time.sleep(3.0); r.tanda("b09_akhir")
r.tanda("b11"); j.ketik(C4, D[11] * 0.6, baris_baru=False); j.jalankan(4, 2.5)
o = j.out(4); j.gulir_ke(o["y"] + o["height"], 60); time.sleep(0.3); o = j.out(4); r.kamera([o["x"], o["y"], min(1100, o["width"]), o["height"]], pad=10); time.sleep(4.5); r.tanda("b11_akhir")
# b12: ubah 75 jadi 80 di sel 3 dan 4, jalankan ulang, lalu KeyError
r.tanda("b12"); j.fokus_sel(3, zoom=1.8); time.sleep(0.6); j.masuk(3); pg.keyboard.press("End")
for _ in range(2): pg.keyboard.press("ArrowLeft")
for _ in range(2): pg.keyboard.press("Backspace"); time.sleep(0.15)
r.ketik("80", 5); time.sleep(0.5); pg.keyboard.press("Shift+Enter"); time.sleep(1.3); j.fokus_out(3, zoom=1.7); time.sleep(3.0)
j.masuk(4, akhir=False); pg.keyboard.press("Control+Home")
for _ in range(4): pg.keyboard.press("ArrowDown")
pg.keyboard.press("Home");
for _ in range(14): pg.keyboard.press("ArrowRight")
l = r.baris_aktif(); r.kamera([10, l["y"] - 80, 900, 200], zoom=1.8, pad=10); time.sleep(0.6)
for _ in range(2): pg.keyboard.press("Backspace"); time.sleep(0.15)
r.ketik("80", 5); time.sleep(0.5); pg.keyboard.press("Shift+Enter"); time.sleep(2.2)
o = j.out(4); j.gulir_ke(o["y"] + o["height"], 60); time.sleep(0.3); o = j.out(4); r.kamera([o["x"], o["y"], min(1100, o["width"]), o["height"]], pad=10); time.sleep(3.5)
# KeyError di sel baru
j.masuk(5); time.sleep(0.3); j.ketik('data["rata-rata"]', 3.0, baris_baru=False); pg.keyboard.press("Shift+Enter"); time.sleep(2.0)
o = j.out(5); j.gulir_ke(o["y"] + o["height"], 60); o = j.out(5)
r.kamera([o["x"], o["y"] + o["height"] - 120, 1000, 120], zoom=1.7, pad=10); time.sleep(4.5); r.tanda("b12_akhir")
time.sleep(0.5); r.selesai(); print("selesai", r.log["durasi"])
