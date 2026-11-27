# Bahan tutorial "Proyek Pemrograman Sederhana"

Kode lengkap dan file contoh untuk setiap video di playlist **Proyek Pemrograman Sederhana** (kanal YouTube [I Teach Software Engineering](https://www.youtube.com/@iTeachSWE)).

Cara mengunduh satu file: klik nama file, lalu klik tombol **Download raw file** (ikon panah ke bawah) di kanan atas.

| Video | Isi folder |
|---|---|
| [T01](T01) Game tebak angka (Python) | `tebak_angka.py` |
| [T02](T02) Kuis otomatis (Python) | `kuis.py` |
| [T03](T03) Nilai rapor otomatis + grafik (pandas) | `nilai_rapor.py`, `nilai.csv` |
| [T04](T04) Website profil diri (HTML, CSS) | `index.html` |
| [T05](T05) Kucing vs anjing (Teachable Machine) | `gambar_T05.zip` (gambar latih Kucing, Anjing, Bukan, dan gambar uji); tanpa kode, cukup browser |
| [T06](T06) AI penebak kelulusan (scikit-learn) | `penebak_kelulusan.py`, `kelulusan.csv` (60 baris data fiktif) |
| [T07](T07) Game ular (JavaScript) | `index.html` |
| [T08](T08) Sandi Caesar (Python) | `sandi_caesar.py` |
| [T09](T09) Kipas otomatis pengukur suhu (ESP32 di Wokwi) | `sketch.ino`, `diagram.json`, `libraries.txt` |
| [T10](T10) Website daftar tugas (JavaScript, localStorage) | `index.html` |
| [T11](T11) AI penyaring spam (scikit-learn) | `penyaring_spam.py` (30 pesan contoh ada di dalamnya) |
| [T12](T12) AI pembaca angka tulisan tangan | `pembaca_angka.py` |
| [T13](T13) Chatbot AI (Python) | `chatbot.py` |
| [T14](T14) Olah data nilai dengan Python dan Excel | `olah_nilai.py`, `nilai_kelas.xlsx` |

File `.py` ditulis untuk notebook (Google Colab atau Jupyter): salin per bagian ke sel yang berbeda, seperti di video. Di Colab, file CSV bisa langsung dibaca dari internet tanpa diunggah, misalnya:

```python
data = pd.read_csv("https://raw.githubusercontent.com/listyantidewi1/animasi-informatika/main/bahan-tutorial/T03/nilai.csv")
```

Semua data di folder ini fiktif (nama dan nilai karangan).

Di luar playlist itu: folder [lean](lean) berisi `pertama.lean`, kode yang diketik di video "Apa Itu Lean 4?" (bisa ditempel langsung ke https://live.lean-lang.org).
