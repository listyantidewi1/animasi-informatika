import pathlib as _p
_d = _p.Path(__file__).parent
exec(open(_d / "sel.py").read())
NAMA = "T12_AI_Pembaca_Angka_Tulisan_Tangan"
JUDUL_YT = "Bikin AI Pembaca Angka Tulisan Tangan dengan Python (Machine Learning untuk Pemula)"
BEATS = {
 1: [dict(k="klip", a="b07", b="b07_akhir", speed=1.6, maks=2.4), dict(k="adegan", nama="judul", min=8.5, a={"judul": "Bikin AI Pembaca\nAngka Tulisan Tangan", "hook": "Setelah menonton, kamu bisa melatih AI yang membaca angka tulisan tangan dengan Python, dan tahu kapan AI itu bisa salah."})],
 2: [dict(k="adegan", nama="piksel")],
 3: [dict(k="rek", a="b03", b="b03_akhir", maks=2.2)],
 4: [dict(k="rek", a="b04", b="b04_akhir", maks=2.2)],
 5: [dict(k="adegan", nama="knn")],
 6: [dict(k="rek", a="b06", b="b06_akhir", maks=2.4)],
 7: [dict(k="rek", a="b07", b="b07_akhir", maks=2.4)],
 8: [dict(k="rek", a="b08", b="b08_akhir", maks=2.0)],
 9: [dict(k="adegan", nama="tebak", bg=("rek", "b10_tebak"))],
 10: [dict(k="rek", a="b10_tebak", b="b10_akhir", maks=1.8)],
 11: [dict(k="adegan", nama="nyata")],
 12: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "Piksel", "warna": "#60a5fa", "judul": "Piksel", "sub": "gambar = 64 angka, 0 sampai 16", "kode": "load_digits()"}, {"ikon": "Tetangga", "warna": "#a78bfa", "judul": "KNN", "sub": "cari 3 gambar paling mirip", "kode": "n_neighbors=3"}, {"ikon": "Kotak", "warna": "#2dd4bf", "judul": "Gambar sendiri", "sub": "kotak berisi angka", "kode": "np.zeros()"}, {"ikon": "Peringatan", "warna": "#ffb020", "judul": "Bisa salah", "sub": "data harus mirip contoh", "kode": "np.roll()"}]})],
 13: [dict(k="adegan", nama="penutup", a={"tantangan": "Gambar angka tujuh dengan angka-angka di numpy, lalu lihat apakah model bisa membacanya. Coba juga ubah n_neighbors menjadi 1 atau 7."})],
}
SHORT = {"judul": "AI bisa membaca tulisan tangan?", "beats": [
 {"teks": "AI ini membaca angka tulisan tangan, dan sepuluh tebakan pertamanya benar semua.", "dari": (7, 4, "kiri")},
 {"teks": "Bagi komputer, gambar hanyalah angka. Delapan kali delapan piksel sama dengan enam puluh empat angka.", "dari": (2, 10.5, "tengah")},
 {"teks": "Model mencari tiga gambar latihan yang paling mirip, lalu memilih jawaban terbanyak.", "dari": (5, 12, "tengah")},
 {"teks": "Tetapi angka satu yang digeser ke pinggir ditebak nol. AI bisa salah kalau datanya berbeda dari contoh.", "dari": (10, 4, "kiri")},
 {"teks": "Mau melatih AI pembaca angkamu sendiri? Tonton tutorial lengkapnya di channel ini.", "dari": (8, 8, "kiri")},
]}
THUMB = {"png": "thumb_angka.png", "dari": (7, 4), "pita": "AI PYTHON", "baris": ["AI BACA", "TULISAN", "TANGAN"], "sorot": 1, "ukuran": 104}
META = {
 "ringkas": "Latih AI yang membaca angka tulisan tangan dengan Python dan scikit-learn. Kamu belajar bahwa gambar adalah kumpulan angka (piksel), membuka data angka tulisan tangan dengan load_digits, melatih model K Nearest Neighbors (tetangga terdekat), mengukur akurasi, menggambar angka sendiri dengan numpy, dan melihat kenapa AI bisa salah saat datanya berbeda dari contoh latihan. Setiap konsep dijelaskan dengan animasi.",
 "bab": [(1, "Pembuka"), (2, "Gambar adalah angka"), (3, "Membuka data"), (4, "Melihat contoh"), (5, "Tetangga terdekat"), (6, "Melatih dan menguji"), (7, "Melihat tebakan"), (8, "Menggambar dengan angka"), (9, "Tebak dulu"), (10, "Ubah dan uji"), (11, "AI pembaca sungguhan"), (12, "Rangkuman dan tantangan")],
 "kode": "\n\n".join([C0, C1, C2, C3, C4, C5, C6]),
 "prasyarat": "Sebelumnya: Bikin AI Penyaring Pesan Spam. Lebih mudah bila sudah menonton Bikin AI Penebak Kelulusan dengan Python.",
 "komentar": "Tantangan: gambar angka tujuh dengan numpy. Apakah modelmu bisa membacanya? Tulis hasilnya di komentar!",
 "tag": ["ai pembaca angka", "handwritten digit recognition", "machine learning python", "knn python", "scikit-learn pemula", "load_digits", "belajar AI", "proyek AI sederhana", "tutorial python bahasa indonesia", "computer vision pemula"],
 "hashtag": ["AI", "machinelearning", "python", "belajarcoding"],
 "short_desk": "AI pembaca angka tulisan tangan dengan Python: gambar adalah angka, tetangga terdekat, dan kenapa AI bisa salah.",
}
