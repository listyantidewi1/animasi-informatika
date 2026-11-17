import sys, time
sys.path.insert(0, "/home/user/tut/alat")
from rekam import Rekaman
from durasi import beat
from jupy import J, sel
D = beat("T06")
C0 = 'import pandas as pd\n\ndata = pd.read_csv("kelulusan.csv")\nX = data[["jam_belajar", "kehadiran", "nilai_tugas"]]\ny = data["lulus"]\ndata.head()'
C1 = 'from sklearn.model_selection import train_test_split\n\nX_latih, X_uji, y_latih, y_uji = train_test_split(X, y, test_size=0.2, random_state=42)\nlen(X_latih), len(X_uji)'
C2 = 'from sklearn.tree import DecisionTreeClassifier\n\nmodel = DecisionTreeClassifier(max_depth=3, random_state=0)\nmodel.fit(X_latih, y_latih)'
C3 = 'from sklearn.tree import plot_tree\nimport matplotlib.pyplot as plt\n\nplt.figure(figsize=(14, 6))\nplot_tree(model, feature_names=X.columns, class_names=model.classes_, filled=True)\nplt.show()'
C4 = 'from sklearn.metrics import accuracy_score\n\ntebakan = model.predict(X_uji)\nprint("Akurasi:", round(accuracy_score(y_uji, tebakan) * 100), "%")'
C5 = 'murid_baru = pd.DataFrame([[4, 90, 78]], columns=X.columns)\nmodel.predict(murid_baru)'
C6 = 'model_besar = DecisionTreeClassifier(max_depth=20, random_state=0)\nmodel_besar.fit(X_latih, y_latih)\nprint("Latihan:", round(model_besar.score(X_latih, y_latih) * 100), "%")\nprint("Ujian:", round(model_besar.score(X_uji, y_uji) * 100), "%")\n\nplt.figure(figsize=(14, 6))\nplot_tree(model_besar, filled=True)\nplt.show()'
r = Rekaman("/home/user/tut/T06/rek", "http://localhost:8888/notebooks/T06_kelulusan.ipynb"); pg = r.pg; j = J(r)
pg.wait_for_selector(".jp-Cell .cm-content"); time.sleep(4); r.gerak(600, 500, 0.01)
r.mulai(); time.sleep(0.5); j.masuk(0)
r.tanda("b04"); j.ketik(C0, D[4] * 0.55, baris_baru=False); j.jalankan(0, 1.8); j.fokus_out(0, zoom=1.6); time.sleep(3.0); r.tanda("b04_akhir")
r.tanda("b06"); time.sleep(0.3); j.ketik(C1, D[6] * 0.5, baris_baru=False); j.jalankan(1, 1.5); j.fokus_out(1, zoom=1.8); time.sleep(3.0); r.tanda("b06_akhir")
r.tanda("b08"); j.ketik(C2, D[8] * 0.5, baris_baru=False); j.jalankan(2, 1.5); j.fokus_out(2, zoom=1.7); time.sleep(3.0); r.tanda("b08_akhir")
r.tanda("b09"); j.ketik(C3, D[9] * 0.45, baris_baru=False); j.jalankan(3, 3.0)
o = j.out(3); j.gulir_ke(o["y"] + o["height"], 40); time.sleep(0.3); o = j.out(3); r.kamera([o["x"], o["y"], min(1300, o["width"]), o["height"]], pad=10); time.sleep(3.0)
o = j.out(3); r.kamera([o["x"] + o["width"] * .25, o["y"], o["width"] * .5, o["height"] * .35], zoom=2.2, pad=10); time.sleep(3.0); r.tanda("b09_akhir")
r.tanda("b11"); j.ketik(C4, D[11] * 0.5, baris_baru=False); j.jalankan(4, 1.5); j.fokus_out(4, zoom=2.0); time.sleep(3.5); r.tanda("b11_akhir")
r.tanda("b12"); j.ketik(C5, D[12] * 0.5, baris_baru=False); j.jalankan(5, 1.5); j.fokus_out(5, zoom=2.0); time.sleep(3.5); r.tanda("b12_akhir")
r.tanda("b14"); j.ketik(C6, D[14] * 0.55, baris_baru=False); j.jalankan(6, 3.0)
o = j.out(6); j.gulir_ke(o["y"] + 120, 60); time.sleep(0.3); o = j.out(6); r.kamera([o["x"], o["y"], 700, 100], zoom=2.0, pad=10); time.sleep(3.0)
o = j.out(6); j.gulir_ke(o["y"] + o["height"], 40); time.sleep(0.3); o = j.out(6); r.kamera([o["x"], o["y"] + 60, min(1300, o["width"]), o["height"] - 60], pad=10); time.sleep(3.0); r.tanda("b14_akhir")
time.sleep(0.5); r.selesai(); print("selesai", r.log["durasi"])
