NAMA = "T06_AI_Penebak_Kelulusan_Python"
JUDUL_YT = "Bikin AI Penebak Kelulusan dari Data Nilai (Machine Learning Python untuk Pemula)"
BEATS = {
 1: [dict(k="klip", a=70.0, b="b11_akhir", speed=1.6, maks=2.2), dict(k="adegan", nama="judul", min=8.5, a={"judul": "Bikin AI Penebak Kelulusan\ndari Data Nilai", "hook": "Setelah menonton, kamu bisa melatih, menguji, dan memakai model machine learning dengan kodemu sendiri."})],
 2: [dict(k="adegan", nama="pengingat")],
 3: [dict(k="adegan", nama="fitur")],
 4: [dict(k="rek", a="b04", b="b04_akhir")],
 5: [dict(k="adegan", nama="bagi")],
 6: [dict(k="rek", a="b06", b="b06_akhir"), dict(k="adegan", nama="catatan", bg=True, min=8, a={"judul": "Satu perintah, empat bagian", "kode": ["X_latih, X_uji, y_latih, y_uji = train_test_split(", "    X, y, test_size=0.2, random_state=42)"], "ukuran": 28, "sorot": [0], "gambar": "g_empat"})],
 7: [dict(k="adegan", nama="pohon")],
 8: [dict(k="rek", a="b08", b="b08_akhir")],
 9: [dict(k="rek", a="b09", b="b09_akhir", maks=1.4)],
 10: [dict(k="adegan", nama="tebak", bg=("rek", "b11"))],
 11: [dict(k="rek", a="b11", b="b11_akhir", maks=1.6), dict(k="adegan", nama="akurasi", min=8)],
 12: [dict(k="rek", a="b12", b="b12_akhir", maks=1.6), dict(k="adegan", nama="catatan", bg=True, min=8, a={"judul": "Jalan murid baru di dalam pohon", "kode": ["murid_baru = pd.DataFrame([[4, 90, 78]], columns=X.columns)", "model.predict(murid_baru)"], "ukuran": 28, "sorot": [1], "gambar": "g_jalur"})],
 13: [dict(k="adegan", nama="batas")],
 14: [dict(k="rek", a="b14", b="b14_akhir", maks=2.0), dict(k="adegan", nama="overfit", min=7)],
 15: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "Tabel", "warna": "#2dd4bf", "judul": "Fitur & label", "sub": "petunjuk dan jawaban", "kode": "X, y"}, {"ikon": "Amplop", "warna": "#ffb020", "judul": "Data uji", "sub": "disisihkan dulu", "kode": "test_size"}, {"ikon": "Pohon", "warna": "#a78bfa", "judul": "Melatih", "sub": "pohon keputusan", "kode": "model.fit()"}, {"ikon": "Mata", "warna": "#60a5fa", "judul": "Membaca", "sub": "aturan dari komputer", "kode": "plot_tree"}, {"ikon": "Target", "warna": "#a3e635", "judul": "Akurasi", "sub": "benar dibagi semua", "kode": "accuracy"}, {"ikon": "Murid", "warna": "#f472b6", "judul": "Data baru", "sub": "memakai model", "kode": "predict()"}]})],
 16: [dict(k="adegan", nama="akhir", a={"tantangan": "Tambahkan satu fitur baru, misalnya jam tidur, lalu lihat apakah akurasinya berubah."})],
}
SHORT = {"judul": "AI bisa menebak kelulusan?", "beats": [
 {"teks": "Model ini menebak apakah seorang murid lulus, hanya dari kebiasaan belajarnya.", "dari": (1, 4, "kiri")},
 {"teks": "Kolom petunjuk disebut fitur, dan kolom jawaban disebut label.", "dari": (3, 16, "tengah")},
 {"teks": "Komputer menyusun sendiri rangkaian if dan else yang disebut pohon keputusan.", "dari": (7, 20, "kanan")},
 {"teks": "Diuji dengan dua belas murid yang belum pernah dilihatnya, sebelas tebakannya benar.", "dari": (11, 3, "kiri")},
 {"teks": "Tetapi model tidak tahu kalau murid sedang sakit. Jangan pakai untuk menghakimi.", "dari": (13, 18, "tengah")},
 {"teks": "Mau membuatnya sendiri dengan Python? Tonton tutorial lengkapnya di channel ini.", "dari": (9, 12, "kanan")},
]}
THUMB = {"png": "thumb_pohon.png", "dari": (9, 12), "pita": "PYTHON + AI", "baris": ["AI", "PENEBAK", "KELULUSAN"], "sorot": 0, "ukuran": 104}
META = {
 "ringkas": "Buat model machine learning pertamamu dengan Python dan scikit-learn: model pohon keputusan yang menebak apakah seorang murid lulus dari jam belajar, kehadiran, dan nilai tugas. Kamu belajar fitur dan label, memisahkan data latih dan data uji, melatih dan membaca pohon keputusan, mengukur akurasi, memakai model untuk data baru, batas dan etika model, sampai overfitting. Setiap konsep dijelaskan dengan animasi. Data yang dipakai adalah 60 baris data contoh buatan (fiktif). Bisa diikuti di Google Colab atau Jupyter Notebook.",
 "bab": [(1, "Pembuka"), (2, "Yang sudah kamu kenal"), (3, "Fitur dan label"), (4, "Membaca data"), (5, "Data latih dan data uji"), (6, "train_test_split"), (7, "Pohon keputusan"), (8, "Melatih model"), (9, "Melihat pohonnya"), (10, "Tebak dulu"), (11, "Akurasi"), (12, "Memakai model"), (13, "Batas model"), (14, "Overfitting"), (15, "Rangkuman dan tantangan")],
 "kode": '''import pandas as pd

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
# Buat sendiri minimal 30 baris, atau isi dari data kelasmu dengan nama disamarkan.''',
 "prasyarat": "Sebelumnya: Ajari Komputer Membedakan Kucing dan Anjing, dan Hitung Nilai Rapor Otomatis. Ini episode terakhir playlist.",
 "komentar": "Tantangan: tambahkan fitur jam tidur ke datamu. Apakah akurasinya naik atau turun? Tulis hasilnya di komentar.",
 "tag": ["machine learning python", "scikit-learn pemula", "decision tree", "pohon keputusan", "belajar AI", "proyek AI sederhana", "akurasi model", "overfitting", "tutorial python bahasa indonesia", "data science pemula"],
 "hashtag": ["machinelearning", "python", "AI", "belajarcoding"],
 "short_desk": "Model AI sederhana dengan Python: fitur dan label, pohon keputusan, akurasi 92%, dan kenapa model tidak boleh dipakai untuk menghakimi.",
}

META["kode"] += "\n\n# Isi lengkap kelulusan.csv (salin ke file teks, simpan dengan nama kelulusan.csv):\n" + 'jam_belajar,kehadiran,nilai_tugas,lulus\n10,79,63,Lulus\n4,68,51,Belum\n4,74,55,Belum\n5,76,89,Lulus\n2,97,86,Lulus\n4,76,50,Belum\n4,74,70,Lulus\n10,74,78,Lulus\n7,89,69,Lulus\n7,88,90,Lulus\n3,100,56,Lulus\n3,56,63,Lulus\n4,74,84,Lulus\n1,94,73,Lulus\n7,59,73,Lulus\n5,56,49,Belum\n5,60,60,Belum\n7,55,56,Belum\n4,88,89,Lulus\n3,98,51,Lulus\n4,98,91,Lulus\n9,64,67,Lulus\n6,70,45,Belum\n6,57,56,Lulus\n7,86,80,Lulus\n8,77,82,Lulus\n9,88,90,Lulus\n4,84,63,Belum\n1,68,72,Belum\n3,81,92,Lulus\n6,97,90,Lulus\n3,64,47,Belum\n7,73,93,Lulus\n5,63,67,Belum\n0,56,65,Belum\n10,72,76,Lulus\n9,75,54,Belum\n9,56,56,Belum\n3,98,96,Lulus\n2,56,88,Belum\n2,91,64,Lulus\n3,67,50,Belum\n3,96,84,Lulus\n1,89,51,Belum\n0,61,68,Belum\n5,84,91,Lulus\n4,69,92,Lulus\n7,67,57,Lulus\n7,75,57,Lulus\n3,79,58,Lulus\n5,87,59,Lulus\n2,79,94,Lulus\n8,79,61,Lulus\n2,78,64,Lulus\n6,70,93,Lulus\n9,75,96,Lulus\n10,92,93,Lulus\n9,57,46,Belum\n6,94,59,Lulus\n3,93,49,Belum'
