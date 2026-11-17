# T12 YouTube

## Video utama (5:24)

**Judul:** Bikin AI Pembaca Angka Tulisan Tangan dengan Python (Machine Learning untuk Pemula)

**Deskripsi:**

Latih AI yang membaca angka tulisan tangan dengan Python dan scikit-learn. Kamu belajar bahwa gambar adalah kumpulan angka (piksel), membuka data angka tulisan tangan dengan load_digits, melatih model K Nearest Neighbors (tetangga terdekat), mengukur akurasi, menggambar angka sendiri dengan numpy, dan melihat kenapa AI bisa salah saat datanya berbeda dari contoh latihan. Setiap konsep dijelaskan dengan animasi.

Bab:
0:00 Pembuka
0:18 Gambar adalah angka
0:43 Membuka data
1:36 Melihat contoh
1:57 Tetangga terdekat
2:23 Melatih dan menguji
2:48 Melihat tebakan
3:09 Menggambar dengan angka
3:39 Tebak dulu
3:53 Ubah dan uji
4:25 AI pembaca sungguhan
4:49 Rangkuman dan tantangan

Kode lengkap:
from sklearn.datasets import load_digits
import matplotlib.pyplot as plt

angka = load_digits()
print(angka.images.shape)
plt.imshow(angka.images[0], cmap="gray_r")
plt.show()

fig, ax = plt.subplots(1, 10, figsize=(10, 2))
for i in range(10):
    ax[i].imshow(angka.images[i], cmap="gray_r")
    ax[i].set_title(angka.target[i])
    ax[i].axis("off")
plt.show()

from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

X_latih, X_uji, y_latih, y_uji = train_test_split(angka.data, angka.target, test_size=0.2, random_state=1)
model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_latih, y_latih)
print("Akurasi:", round(model.score(X_uji, y_uji) * 100), "%")

tebakan = model.predict(X_uji[:10])
fig, ax = plt.subplots(1, 10, figsize=(10, 2))
for i in range(10):
    ax[i].imshow(X_uji[i].reshape(8, 8), cmap="gray_r")
    ax[i].set_title(tebakan[i])
    ax[i].axis("off")
plt.show()

import numpy as np
satu = np.zeros((8, 8))
satu[1:7, 4] = 16
plt.imshow(satu, cmap="gray_r")
plt.show()
model.predict([satu.ravel()])

kiri = np.zeros((8, 8))
kiri[1:7, 0] = 16
plt.imshow(kiri, cmap="gray_r")
plt.show()
model.predict([kiri.ravel()])

tengah = np.roll(kiri, 4, axis=1)
plt.imshow(tengah, cmap="gray_r")
plt.show()
model.predict([tengah.ravel()])

Sebelumnya: Bikin AI Penyaring Pesan Spam. Lebih mudah bila sudah menonton Bikin AI Penebak Kelulusan dengan Python.
Playlist: Proyek Pemrograman Sederhana. Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.

Subscribe: https://www.youtube.com/@iTeachSWE

#AI #machinelearning #python #belajarcoding

**Komentar tersemat:** Tantangan: gambar angka tujuh dengan numpy. Apakah modelmu bisa membacanya? Tulis hasilnya di komentar!

**Tag:** ai pembaca angka, handwritten digit recognition, machine learning python, knn python, scikit-learn pemula, load_digits, belajar AI, proyek AI sederhana, tutorial python bahasa indonesia, computer vision pemula

## Short

**Judul:** AI bisa membaca tulisan tangan? #shorts

**Deskripsi:**

AI pembaca angka tulisan tangan dengan Python: gambar adalah angka, tetangga terdekat, dan kenapa AI bisa salah.

Tutorial lengkapnya: Bikin AI Pembaca Angka Tulisan Tangan dengan Python (Machine Learning untuk Pemula) (playlist Proyek Pemrograman Sederhana).
Subscribe: https://www.youtube.com/@iTeachSWE
#shorts #AI #machinelearning #python

**Video terkait:** Bikin AI Pembaca Angka Tulisan Tangan dengan Python (Machine Learning untuk Pemula)
