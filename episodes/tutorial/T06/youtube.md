# T06 YouTube

## Video utama (5:14)

**Judul:** Bikin AI Penebak Kelulusan dari Data Nilai (Machine Learning Python untuk Pemula)

**Deskripsi:**

Buat model machine learning pertamamu dengan Python dan scikit-learn: model pohon keputusan yang menebak apakah seorang murid lulus dari jam belajar, kehadiran, dan nilai tugas. Kamu belajar fitur dan label, memisahkan data latih dan data uji, melatih dan membaca pohon keputusan, mengukur akurasi, memakai model untuk data baru, batas dan etika model, sampai overfitting. Setiap konsep dijelaskan dengan animasi. Data yang dipakai adalah 60 baris data contoh buatan (fiktif). Bisa diikuti di Google Colab atau Jupyter Notebook.

Bab:
0:00 Pembuka
0:21 Yang sudah kamu kenal
0:36 Fitur dan label
1:00 Membaca data
1:19 Data latih dan data uji
1:39 train_test_split
2:06 Pohon keputusan
2:33 Melatih model
2:53 Melihat pohonnya
3:09 Tebak dulu
3:17 Akurasi
3:35 Memakai model
3:52 Batas model
4:15 Overfitting
4:34 Rangkuman dan tantangan

Kode lengkap:
import pandas as pd

data = pd.read_csv("kelulusan.csv")
X = data[["jam_belajar", "kehadiran", "nilai_tugas"]]
y = data["lulus"]
data.head()

from sklearn.model_selection import train_test_split

X_latih, X_uji, y_latih, y_uji = train_test_split(X, y, test_size=0.2, random_state=42)

from sklearn.tree import DecisionTreeClassifier

model = DecisionTreeClassifier(max_depth=3, random_state=0)
model.fit(X_latih, y_latih)

from sklearn.tree import plot_tree
import matplotlib.pyplot as plt

plt.figure(figsize=(14, 6))
plot_tree(model, feature_names=X.columns, class_names=model.classes_, filled=True)
plt.show()

from sklearn.metrics import accuracy_score

tebakan = model.predict(X_uji)
print("Akurasi:", round(accuracy_score(y_uji, tebakan) * 100), "%")

murid_baru = pd.DataFrame([[4, 90, 78]], columns=X.columns)
model.predict(murid_baru)

# Isi kelulusan.csv: kolom jam_belajar, kehadiran, nilai_tugas, lulus (Lulus/Belum).
# Buat sendiri minimal 30 baris, atau isi dari data kelasmu dengan nama disamarkan.

Sebelumnya: Ajari Komputer Membedakan Kucing dan Anjing, dan Hitung Nilai Rapor Otomatis. Ini episode terakhir playlist.
Playlist: Proyek Pemrograman Sederhana. Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.

Subscribe: https://www.youtube.com/@iTeachSWE

#machinelearning #python #AI #belajarcoding

**Komentar tersemat:** Tantangan: tambahkan fitur jam tidur ke datamu. Apakah akurasinya naik atau turun? Tulis hasilnya di komentar.

**Tag:** machine learning python, scikit-learn pemula, decision tree, pohon keputusan, belajar AI, proyek AI sederhana, akurasi model, overfitting, tutorial python bahasa indonesia, data science pemula

## Short

**Judul:** AI bisa menebak kelulusan? #shorts

**Deskripsi:**

Model AI sederhana dengan Python: fitur dan label, pohon keputusan, akurasi 92%, dan kenapa model tidak boleh dipakai untuk menghakimi.

Tutorial lengkapnya: Bikin AI Penebak Kelulusan dari Data Nilai (Machine Learning Python untuk Pemula) (playlist Proyek Pemrograman Sederhana).
Subscribe: https://www.youtube.com/@iTeachSWE
#shorts #machinelearning #python #AI

**Video terkait:** Bikin AI Penebak Kelulusan dari Data Nilai (Machine Learning Python untuk Pemula)
