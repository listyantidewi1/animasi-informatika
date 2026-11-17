# T03 YouTube

## Video utama (6:48)

**Judul:** Hitung Nilai Rapor Otomatis, Lengkap dengan Grafiknya (Python pandas)

**Deskripsi:**

Olah data nilai satu kelas dengan Python dan pandas: baca file CSV, hitung rata-rata tiap murid, urutkan peringkat, saring murid di bawah batas tuntas, lalu buat grafik batang dengan matplotlib. Setiap konsep dijelaskan dengan animasi: tabel dan file CSV, arti axis=1 (ke samping) dan axis=0 (ke bawah), saringan baris, sampai cara membaca grafik batang. Bisa diikuti di Google Colab atau Jupyter Notebook.

Bab:
0:00 Pembuka
0:22 Dari list ke tabel
0:39 File CSV
1:11 Membaca tabel dengan pandas
2:14 Tebak dulu
2:27 Rata-rata dan axis
2:56 Menghitung rata-rata
3:37 Mengurutkan dan menyaring
4:07 Peringkat dan remedial
4:40 Grafik batang
5:05 Membuat grafik
5:35 Ubah batas dan KeyError
6:08 Rangkuman dan tantangan

Kode lengkap:
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
Jihan,82,79,85

Sebelumnya: Bikin Kuis Otomatis yang Langsung Menghitung Skor. Berikutnya: Bikin Website Profil Diri dalam 10 Menit.
Playlist: Proyek Pemrograman Sederhana. Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.

Subscribe: https://www.youtube.com/@iTeachSWE

#python #pandas #belajarpython #coding

**Komentar tersemat:** Tantangan: buat grafik rata-rata per mata pelajaran (petunjuk: axis). Mata pelajaran apa yang paling sulit di kelas ini? Tulis jawabanmu di komentar.

**Tag:** python untuk pemula, pandas python, rata-rata python, grafik python, matplotlib, olah data nilai, csv python, tutorial python bahasa indonesia, google colab, proyek python sederhana

## Short

**Judul:** Nilai rapor dalam 1 detik? #shorts

**Deskripsi:**

Rata-rata nilai satu kelas, peringkat, daftar remedial, dan grafiknya, semua dalam beberapa baris Python dengan pandas dan matplotlib.

Tutorial lengkapnya: Hitung Nilai Rapor Otomatis, Lengkap dengan Grafiknya (Python pandas) (playlist Proyek Pemrograman Sederhana).
Subscribe: https://www.youtube.com/@iTeachSWE
#shorts #python #pandas #belajarpython

**Video terkait:** Hitung Nilai Rapor Otomatis, Lengkap dengan Grafiknya (Python pandas)
