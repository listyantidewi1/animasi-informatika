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
