import pathlib as _p
_d = _p.Path(__file__).parent
exec(open(_d / "sel.py").read())
NAMA = "T11_AI_Penyaring_Spam_Python"
JUDUL_YT = "Bikin AI Penyaring Pesan Spam dengan Python (Machine Learning untuk Pemula)"
BEATS = {
 1: [dict(k="klip", a="b09_salah", b="b09_akhir", speed=1.4, maks=2.0), dict(k="adegan", nama="judul", min=8.5, a={"judul": "Bikin AI Penyaring\nPesan Spam", "hook": "Setelah menonton, kamu bisa membuat AI sederhana dengan Python yang belajar membedakan pesan spam dan pesan biasa."})],
 2: [dict(k="adegan", nama="aturan")],
 3: [dict(k="rek", a="b03", b="b03_akhir", maks=2.2)],
 4: [dict(k="adegan", nama="kantong")],
 5: [dict(k="rek", a="b05", b="b05_akhir", maks=2.0)],
 6: [dict(k="adegan", nama="bayes")],
 7: [dict(k="rek", a="b07", b="b07_akhir", maks=2.2)],
 8: [dict(k="adegan", nama="tebak", bg=("rek", "b09_tebak"))],
 9: [dict(k="rek", a="b09_tebak", b="b09_akhir", maks=2.2)],
 10: [dict(k="adegan", nama="nyata")],
 11: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "Aturan", "warna": "#ff6b6b", "judul": "Aturan vs ML", "sub": "belajar dari contoh berlabel", "kode": "spam / normal"}, {"ikon": "Kotak", "warna": "#60a5fa", "judul": "Kata → angka", "sub": "hitung setiap kata", "kode": "CountVectorizer"}, {"ikon": "Timbangan", "warna": "#a78bfa", "judul": "Naive Bayes", "sub": "setiap kata adalah bukti", "kode": "MultinomialNB"}, {"ikon": "Data", "warna": "#2dd4bf", "judul": "Data penting", "sub": "contoh menentukan hasil", "kode": "fit()"}]})],
 12: [dict(k="adegan", nama="penutup", a={"tantangan": "Tambahkan sepuluh pesan baru dari pengalamanmu sendiri, lalu cari pesan yang masih salah ditebak oleh model.", "berikut": "Bikin AI Pembaca Angka Tulisan Tangan"})],
}
SHORT = {"judul": "AI pendeteksi spam buatanmu?", "beats": [
 {"teks": "Pesan menang undian dan pulsa gratis sering dipakai untuk menipu. Kita bisa membuat AI yang menyaringnya.", "dari": (2, 2, "tengah")},
 {"teks": "Komputer tidak mengerti kalimat, jadi setiap kata dihitung dan diubah menjadi angka.", "dari": (4, 16, "tengah")},
 {"teks": "Kata hadiah, klaim, dan undian menjadi bukti kuat bahwa sebuah pesan adalah spam.", "dari": (6, 17, "tengah")},
 {"teks": "Tetapi pesan dari guru yang berisi link ikut ditebak spam. AI hanya belajar dari contoh yang kita berikan.", "dari": (9, 2, "kiri")},
 {"teks": "Mau membuat penyaring spammu sendiri? Tonton tutorial lengkapnya di channel ini.", "dari": (7, 9, "kiri")},
]}
THUMB = {"gambar": "thumb_out.json", "lebar": 760, "dari": (7, 12), "pita": "AI PYTHON", "baris": ["SPAM", "ATAU", "BUKAN?"], "sorot": 0, "ukuran": 112}
META = {
 "ringkas": "Buat AI penyaring pesan spam dengan Python dan scikit-learn. Kamu belajar bedanya menulis aturan dan machine learning, menyiapkan data berlabel dengan pandas, mengubah kata menjadi angka dengan CountVectorizer (bag of words), melatih model Naive Bayes, menguji pesan baru, dan memperbaiki tebakan yang salah dengan menambah contoh. Setiap konsep dijelaskan dengan animasi.",
 "bab": [(1, "Pembuka"), (2, "Aturan atau machine learning"), (3, "Menyiapkan data"), (4, "Kata menjadi angka"), (5, "CountVectorizer"), (6, "Naive Bayes"), (7, "Melatih dan mencoba"), (8, "Tebak dulu"), (9, "Ubah dan uji"), (10, "Penyaring spam sungguhan"), (11, "Rangkuman dan tantangan")],
 "kode": "\n\n".join([C0, C1, C2, C3, C4, C5]),
 "prasyarat": "Sebelumnya: Bikin Website Daftar Tugas yang Tetap Tersimpan. Lebih mudah bila sudah menonton Bikin AI Penebak Kelulusan dengan Python. Berikutnya: Bikin AI Pembaca Angka Tulisan Tangan.",
 "komentar": "Tantangan: temukan pesan normal yang masih ditebak spam oleh modelmu. Tulis pesannya di komentar!",
 "tag": ["ai penyaring spam", "machine learning python", "naive bayes python", "countvectorizer", "scikit-learn pemula", "belajar AI", "proyek AI sederhana", "deteksi spam", "tutorial python bahasa indonesia", "klasifikasi teks"],
 "hashtag": ["AI", "machinelearning", "python", "belajarcoding"],
 "short_desk": "AI penyaring spam dengan Python: kata menjadi angka, Naive Bayes, dan kenapa AI bergantung pada contoh.",
}
