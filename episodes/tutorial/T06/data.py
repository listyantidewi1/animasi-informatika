import random, sys
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
def buat(seed):
    R = random.Random(seed); rows = []
    for i in range(60):
        jam = R.randint(0, 10); hadir = R.randint(55, 100); tugas = R.randint(45, 98)
        skor = 0.9 * (hadir - 70) / 10 + 0.8 * (tugas - 65) / 10 + 0.25 * (jam - 4) + R.gauss(0, 0.9)
        rows.append((jam, hadir, tugas, "Lulus" if skor > 0 else "Belum"))
    return pd.DataFrame(rows, columns=["jam_belajar", "kehadiran", "nilai_tugas", "lulus"])
def uji(d):
    X = d[["jam_belajar", "kehadiran", "nilai_tugas"]]; y = d["lulus"]
    Xl, Xu, yl, yu = train_test_split(X, y, test_size=0.2, random_state=42)
    m = DecisionTreeClassifier(max_depth=3, random_state=0).fit(Xl, yl); a3 = accuracy_score(yu, m.predict(Xu))
    m20 = DecisionTreeClassifier(max_depth=20, random_state=0).fit(Xl, yl); a20 = accuracy_score(yu, m20.predict(Xu)); t20 = accuracy_score(yl, m20.predict(Xl)); t3 = accuracy_score(yl, m.predict(Xl))
    akar = m.tree_.feature[0]; thr = m.tree_.threshold[0]
    baru = m.predict(pd.DataFrame([[4, 90, 78]], columns=X.columns))[0]
    return a3, t3, a20, t20, akar, thr, baru, (y == "Lulus").mean()
if __name__ == "__main__":
    for s in range(400):
        d = buat(s); a3, t3, a20, t20, akar, thr, baru, pl = uji(d)
        if a3 >= 0.9 and a20 < a3 - 0.1 and t20 == 1.0 and akar == 1 and 65 <= thr <= 75 and baru == "Lulus" and .45 < pl < .7:
            print(s, a3, t3, a20, t20, thr, pl)
