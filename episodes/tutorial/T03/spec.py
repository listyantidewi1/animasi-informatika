NAMA = "T03_Nilai_Rapor_Otomatis_Python"
JUDUL_YT = "Hitung Nilai Rapor Otomatis, Lengkap dengan Grafiknya (Python pandas)"
BEATS = {
 1: [dict(k="klip", a="b11", b="b11_akhir", speed=2.0, maks=2.4), dict(k="adegan", nama="judul", min=8.5, a={"judul": "Hitung Nilai Rapor Otomatis,\nLengkap dengan Grafiknya", "hook": "Setelah menonton, kamu bisa mengolah data nilai menjadi rata-rata, peringkat, dan grafik dalam hitungan detik."})],
 2: [dict(k="adegan", nama="rakKeTabel")],
 3: [dict(k="adegan", nama="csv")],
 4: [dict(k="rek", a="b04", b="b04_akhir")],
 5: [dict(k="adegan", nama="tebak", bg=("rek", "b04_akhir"))],
 6: [dict(k="adegan", nama="axis")],
 7: [dict(k="rek", a="b07", b="b07_akhir"), dict(k="adegan", nama="catatan", bg=True, min=8, a={"judul": "axis=1 artinya menghitung ke samping, per murid", "kode": ['data["Rata-rata"] = data[["Matematika", "IPA", "Bahasa"]]', '    .mean(axis=1).round(1)'], "ukuran": 24, "sorot": [1], "gambar": "g_rata"})],
 8: [dict(k="adegan", nama="saring")],
 9: [dict(k="rek", a="b09", b="b09_akhir")],
 10: [dict(k="adegan", nama="batang")],
 11: [dict(k="rek", a="b11", b="b11_akhir")],
 12: [dict(k="rek", a="b12", b="b12_akhir")],
 13: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "Kotak", "warna": "#ffb020", "judul": "Baca CSV", "sub": "tabel dari file", "kode": "pd.read_csv()"}, {"ikon": "Putar", "warna": "#a78bfa", "judul": "Rata-rata", "sub": "per baris", "kode": ".mean(axis=1)"}, {"ikon": "Cabang", "warna": "#60a5fa", "judul": "Urut & saring", "sub": "peringkat dan remedial", "kode": ".sort_values()"}, {"ikon": "Kotak", "warna": "#a3e635", "judul": "Grafik", "sub": "angka jadi gambar", "kode": "plt.bar()"}]})],
 14: [dict(k="adegan", nama="penutup", a={"tantangan": "Buat grafik rata-rata per mata pelajaran, bukan per murid. Petunjuknya ada di axis. Mata pelajaran apa yang paling sulit di kelas ini?", "berikut": "Bikin Website Profil Diri dalam 10 Menit"})],
}
SHORT = {"judul": "Nilai rapor dalam 1 detik?", "beats": [
 {"teks": "Menghitung rata-rata nilai satu kelas dengan kalkulator bisa makan waktu satu jam. Dengan Python, cukup beberapa baris.", "dari": (11, 14, "kiri")},
 {"teks": "Data nilai disimpan sebagai file CSV, yaitu teks biasa yang dipisahkan koma.", "dari": (3, 12, "tengah")},
 {"teks": "Dengan pandas, mean dan axis sama dengan satu menghitung rata-rata ke samping, per murid.", "dari": (6, 10, "tengah")},
 {"teks": "Lalu tabel diurutkan, dan murid di bawah batas tuntas disaring otomatis.", "dari": (8, 19, "kanan")},
 {"teks": "Terakhir, angka diubah menjadi grafik batang dengan garis batas tuntas.", "dari": (11, 16, "kiri")},
 {"teks": "Mau mencobanya dengan data kelasmu? Tonton tutorial lengkapnya di channel ini.", "dari": (12, 12, "kiri")},
]}
THUMB = {"png": "thumb_grafik.png", "dari": (11, 18), "pita": "PYTHON PEMULA", "baris": ["NILAI", "RAPOR", "OTOMATIS"], "sorot": 1, "ukuran": 112}
META = {
 "ringkas": "Olah data nilai satu kelas dengan Python dan pandas: baca file CSV, hitung rata-rata tiap murid, urutkan peringkat, saring murid di bawah batas tuntas, lalu buat grafik batang dengan matplotlib. Setiap konsep dijelaskan dengan animasi: tabel dan file CSV, arti axis=1 (ke samping) dan axis=0 (ke bawah), saringan baris, sampai cara membaca grafik batang. Bisa diikuti di Google Colab atau Jupyter Notebook.",
 "bab": [(1, "Pembuka"), (2, "Dari list ke tabel"), (3, "File CSV"), (4, "Membaca tabel dengan pandas"), (5, "Tebak dulu"), (6, "Rata-rata dan axis"), (7, "Menghitung rata-rata"), (8, "Mengurutkan dan menyaring"), (9, "Peringkat dan remedial"), (10, "Grafik batang"), (11, "Membuat grafik"), (12, "Ubah batas dan KeyError"), (13, "Rangkuman dan tantangan")],
 "kode": '''import pandas as pd

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

# isi nilai.csv
Nama,Matematika,IPA,Bahasa
Andi,80,75,85
Bunga,92,88,90
Citra,70,65,72
Dimas,85,90,78
Eka,60,72,70
Fajar,78,80,82
Gita,88,85,94
Hana,75,70,79
Iqbal,90,82,76
Jihan,82,79,85''',
 "prasyarat": "Sebelumnya: Bikin Kuis Otomatis yang Langsung Menghitung Skor. Berikutnya: Bikin Website Profil Diri dalam 10 Menit.",
 "komentar": "Tantangan: buat grafik rata-rata per mata pelajaran (petunjuk: axis). Mata pelajaran apa yang paling sulit di kelas ini? Tulis jawabanmu di komentar.",
 "tag": ["python untuk pemula", "pandas python", "rata-rata python", "grafik python", "matplotlib", "olah data nilai", "csv python", "tutorial python bahasa indonesia", "google colab", "proyek python sederhana"],
 "hashtag": ["python", "pandas", "belajarpython", "coding"],
 "short_desk": "Rata-rata nilai satu kelas, peringkat, daftar remedial, dan grafiknya, semua dalam beberapa baris Python dengan pandas dan matplotlib.",
}
