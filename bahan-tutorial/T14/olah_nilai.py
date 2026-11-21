# File nilai_kelas.xlsx berisi kolom: nama, mat, ipa, bahasa
# Perlu: pip install pandas openpyxl

import pandas as pd
data = pd.read_excel("nilai_kelas.xlsx")
data

data["rata2"] = data[["mat", "ipa", "bahasa"]].mean(axis=1).round(1)
data

data["peringkat"] = data["rata2"].rank(ascending=False, method="min").astype(int)
data

def predikat(n):
    if n >= 90:
        return "A"
    elif n >= 80:
        return "B"
    elif n >= 70:
        return "C"
    else:
        return "D"

data["predikat"] = data["rata2"].apply(predikat)
data.sort_values("peringkat").to_excel("hasil_nilai.xlsx", index=False)
print("Tersimpan!")
