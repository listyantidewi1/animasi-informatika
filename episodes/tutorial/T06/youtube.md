# T06 YouTube

## Video utama (7:29)

**Judul:** Bikin AI Penebak Kelulusan dari Data Nilai (Machine Learning Python untuk Pemula)

**Deskripsi:**

Buat model machine learning pertamamu dengan Python dan scikit-learn: model pohon keputusan yang menebak apakah seorang murid lulus dari jam belajar, kehadiran, dan nilai tugas. Kamu belajar fitur dan label, memisahkan data latih dan data uji, melatih dan membaca pohon keputusan, mengukur akurasi, memakai model untuk data baru, batas dan etika model, sampai overfitting. Setiap konsep dijelaskan dengan animasi. Data yang dipakai adalah 60 baris data contoh buatan (fiktif). Bisa diikuti di Google Colab atau Jupyter Notebook.

Bab:
0:00 Pembuka
0:22 Yang sudah kamu kenal
0:43 Fitur dan label
1:13 Membaca data
2:06 Data latih dan data uji
2:32 train_test_split
3:12 Pohon keputusan
3:44 Melatih model
4:14 Melihat pohonnya
4:37 Tebak dulu
4:51 Akurasi
5:18 Memakai model
5:44 Batas model
6:12 Overfitting
6:45 Rangkuman dan tantangan

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

# Isi lengkap kelulusan.csv (salin ke file teks, simpan dengan nama kelulusan.csv):
jam_belajar,kehadiran,nilai_tugas,lulus
10,79,63,Lulus
4,68,51,Belum
4,74,55,Belum
5,76,89,Lulus
2,97,86,Lulus
4,76,50,Belum
4,74,70,Lulus
10,74,78,Lulus
7,89,69,Lulus
7,88,90,Lulus
3,100,56,Lulus
3,56,63,Lulus
4,74,84,Lulus
1,94,73,Lulus
7,59,73,Lulus
5,56,49,Belum
5,60,60,Belum
7,55,56,Belum
4,88,89,Lulus
3,98,51,Lulus
4,98,91,Lulus
9,64,67,Lulus
6,70,45,Belum
6,57,56,Lulus
7,86,80,Lulus
8,77,82,Lulus
9,88,90,Lulus
4,84,63,Belum
1,68,72,Belum
3,81,92,Lulus
6,97,90,Lulus
3,64,47,Belum
7,73,93,Lulus
5,63,67,Belum
0,56,65,Belum
10,72,76,Lulus
9,75,54,Belum
9,56,56,Belum
3,98,96,Lulus
2,56,88,Belum
2,91,64,Lulus
3,67,50,Belum
3,96,84,Lulus
1,89,51,Belum
0,61,68,Belum
5,84,91,Lulus
4,69,92,Lulus
7,67,57,Lulus
7,75,57,Lulus
3,79,58,Lulus
5,87,59,Lulus
2,79,94,Lulus
8,79,61,Lulus
2,78,64,Lulus
6,70,93,Lulus
9,75,96,Lulus
10,92,93,Lulus
9,57,46,Belum
6,94,59,Lulus
3,93,49,Belum

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
