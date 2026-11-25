import pandas as pd

data = pd.read_csv("nilai.csv")
data

data["Rata-rata"] = data[["Matematika", "IPA", "Bahasa"]].mean(axis=1).round(1)
data

data.sort_values(by="Rata-rata", ascending=False)

data[data["Rata-rata"] < 75]

import matplotlib.pyplot as plt

plt.figure(figsize=(10, 4))
plt.bar(data["Nama"], data["Rata-rata"])
plt.axhline(75, color="red", linestyle="--")
plt.title("Rata-rata Nilai Kelas 8A")
plt.show()
