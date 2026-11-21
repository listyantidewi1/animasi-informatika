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
