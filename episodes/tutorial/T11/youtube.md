# T11 YouTube

## Video utama (5:25)

**Judul:** Membuat AI Penyaring Pesan Spam dengan Python | Machine Learning untuk Pemula

**Deskripsi:**

Buat AI penyaring pesan spam dengan Python dan scikit-learn. Kamu belajar bedanya menulis aturan dan machine learning, menyiapkan data berlabel dengan pandas, mengubah kata menjadi angka dengan CountVectorizer (bag of words), melatih model Naive Bayes, menguji pesan baru, dan memperbaiki tebakan yang salah dengan menambah contoh. Setiap konsep dijelaskan dengan animasi.

Bab:
0:00 Pembuka
0:18 Aturan atau machine learning
0:47 Menyiapkan data
1:39 Kata menjadi angka
2:08 CountVectorizer
2:38 Naive Bayes
3:09 Melatih dan mencoba
3:35 Tebak dulu
3:52 Ubah dan uji
4:24 Penyaring spam sungguhan
4:51 Rangkuman dan tantangan

Kode lengkap (bisa diunduh): https://github.com/listyantidewi1/animasi-informatika/tree/main/bahan-tutorial/T11

Kode lengkap:
pesan = [
    ("Selamat! Nomor Anda menang undian 50 juta, klik link ini", "spam"),
    ("Pulsa gratis 100 ribu, segera klaim hadiah Anda sekarang", "spam"),
    ("Pinjaman cepat cair tanpa jaminan, hubungi nomor ini", "spam"),
    ("Akun Anda diblokir, segera klik link untuk verifikasi", "spam"),
    ("Anda terpilih dapat hadiah HP baru, transfer biaya kirim", "spam"),
    ("Promo kuota gratis 50 GB, klik link dan isi data diri", "spam"),
    ("Menang undian mobil, kirim kode OTP Anda ke nomor ini", "spam"),
    ("Dana bantuan cair hari ini, klik link untuk klaim", "spam"),
    ("Selamat Anda dapat saldo gratis, segera klaim di link ini", "spam"),
    ("Investasi untung 10 kali lipat, transfer sekarang juga", "spam"),
    ("Hadiah undian menunggu Anda, kirim data diri segera", "spam"),
    ("Kuota gratis untuk Anda, cukup klik link dan login", "spam"),
    ("Pinjaman online bunga nol persen, cair lima menit", "spam"),
    ("Klaim voucher belanja gratis 1 juta, klik link sekarang", "spam"),
    ("Anda menang hadiah, segera transfer biaya administrasi", "spam"),
    ("Nanti sore latihan basket jam 4 di lapangan sekolah", "normal"),
    ("Besok kerja kelompok di rumah Dina ya, bawa laptop", "normal"),
    ("Jangan lupa PR matematika halaman 45 dikumpulkan besok", "normal"),
    ("Nak, pulang sekolah langsung ke rumah ya, ibu masak", "normal"),
    ("Ulangan IPA diundur ke hari Kamis kata bu guru", "normal"),
    ("Aku sudah di depan gerbang, kamu di mana?", "normal"),
    ("Terima kasih ya sudah meminjamkan bukunya", "normal"),
    ("Rapat OSIS hari Jumat setelah salat Jumat di ruang kelas", "normal"),
    ("Besok seragamnya pakai batik, jangan sampai salah", "normal"),
    ("Kamu sudah selesai mengerjakan tugas bahasa Inggris?", "normal"),
    ("Selamat ulang tahun, semoga panjang umur dan sehat selalu", "normal"),
    ("Ayah jemput jam 2 di depan sekolah ya", "normal"),
    ("Materi presentasi sudah aku kirim di grup kelas", "normal"),
    ("Jangan lupa bawa bekal, besok ada kegiatan pramuka", "normal"),
    ("Hasil ulangan kemarin sudah dibagikan, nilaiku naik", "normal"),
]

import pandas as pd
data = pd.DataFrame(pesan, columns=["teks", "label"])
data["label"].value_counts()

from sklearn.feature_extraction.text import CountVectorizer
pengubah = CountVectorizer()
X = pengubah.fit_transform(data["teks"])
y = data["label"]
X.shape

from sklearn.naive_bayes import MultinomialNB
model = MultinomialNB()
model.fit(X, y)

def cek(teks):
    return model.predict(pengubah.transform([teks]))[0]

print(cek("Selamat kamu dapat hadiah pulsa gratis, klik link ini"))
print(cek("Besok kerja kelompok jam 3, jangan telat ya"))

cek("Klik link ini untuk ikut kelas online besok pagi")

pesan_baru = [
    ("Klik link zoom ini untuk kelas online jam 8", "normal"),
    ("Link absen sudah dibuka, segera klik sebelum jam 7", "normal"),
    ("Klik link dari bu guru untuk mengumpulkan tugas", "normal"),
]
data = pd.DataFrame(pesan + pesan_baru, columns=["teks", "label"])
X = pengubah.fit_transform(data["teks"])
model.fit(X, data["label"])
cek("Klik link ini untuk ikut kelas online besok pagi")

Sebelumnya: Bikin Website Daftar Tugas yang Tetap Tersimpan. Lebih mudah bila sudah menonton Bikin AI Penebak Kelulusan dengan Python. Berikutnya: Bikin AI Pembaca Angka Tulisan Tangan.
Playlist: Proyek Pemrograman Sederhana. Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.

Subscribe: https://www.youtube.com/@iTeachSWE

#AI #machinelearning #python #belajarcoding

**Komentar tersemat:** Tantangan: temukan pesan normal yang masih ditebak spam oleh modelmu. Tulis pesannya di komentar!

**Tag:** ai penyaring spam, machine learning python, naive bayes python, countvectorizer, scikit-learn pemula, belajar AI, proyek AI sederhana, deteksi spam, tutorial python bahasa indonesia, klasifikasi teks

## Short

**Judul:** AI pendeteksi spam buatanmu? #shorts

**Deskripsi:**

AI penyaring spam dengan Python: kata menjadi angka, Naive Bayes, dan kenapa AI bergantung pada contoh.

Tutorial lengkapnya: Membuat AI Penyaring Pesan Spam dengan Python | Machine Learning untuk Pemula (playlist Proyek Pemrograman Sederhana).
Subscribe: https://www.youtube.com/@iTeachSWE
#shorts #AI #machinelearning #python

**Video terkait:** Membuat AI Penyaring Pesan Spam dengan Python | Machine Learning untuk Pemula
