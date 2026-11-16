# T14 YouTube

## Video utama (2:34)

**Judul:** Olah Data Nilai Otomatis dengan Python dan Excel (Rata-rata, Peringkat, Predikat)

**Deskripsi:**

Buat program Python yang membaca file Excel nilai satu kelas, menghitung rata-rata setiap murid, membuat peringkat, memberi predikat, lalu menyimpan hasilnya kembali ke Excel. Kamu belajar read_excel dan DataFrame di pandas, arti axis=0 dan axis=1, kenapa rank() memberi peringkat 4.0 untuk nilai yang sama dan cara memperbaikinya dengan method="min", apply, sort_values, dan to_excel. Setiap konsep dijelaskan dengan animasi.

Bab:
0:00 Pembuka
0:18 Dari Excel ke pandas
0:36 Membaca file Excel
0:51 Ke bawah atau ke samping: axis
1:06 Menghitung rata-rata
1:17 Tebak dulu
1:28 Ubah dan uji: peringkat yang adil
1:49 Predikat dan menyimpan ke Excel
2:07 Rangkuman dan tantangan

Kode lengkap:
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

Sebelumnya: Bikin Chatbot AI Sendiri dengan Python. Lebih mudah bila sudah menonton Hitung Nilai Rapor Otomatis.
Playlist: Proyek Pemrograman Sederhana. Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.

Subscribe: https://www.youtube.com/@iTeachSWE

#python #excel #pandas #belajarcoding

**Komentar tersemat:** Tantangan: tambahkan kolom keterangan tuntas atau belum tuntas. Siapa saja yang belum tuntas di data contoh? Tulis di komentar!

**Tag:** python excel, pandas excel, olah nilai python, read_excel pandas, rata-rata pandas, rank pandas, proyek python sederhana, python untuk pemula, tutorial python bahasa indonesia, otomatisasi excel

## Short

**Judul:** Hitung nilai sekelas dalam sekejap? #shorts

**Deskripsi:**

Olah nilai satu kelas dari Excel dengan Python: rata-rata, peringkat yang adil, predikat, lalu simpan ke Excel.

Tutorial lengkapnya: Olah Data Nilai Otomatis dengan Python dan Excel (Rata-rata, Peringkat, Predikat) (playlist Proyek Pemrograman Sederhana).
Subscribe: https://www.youtube.com/@iTeachSWE
#shorts #python #excel #pandas

**Video terkait:** Olah Data Nilai Otomatis dengan Python dan Excel (Rata-rata, Peringkat, Predikat)
