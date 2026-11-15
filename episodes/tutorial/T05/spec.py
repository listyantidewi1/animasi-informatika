NAMA = "T05_Kucing_vs_Anjing_Teachable_Machine"
JUDUL_YT = "Ajari Komputer Membedakan Kucing dan Anjing (Machine Learning Tanpa Coding)"
BEATS = {
 1: [dict(k="klip", a="b10", b="b10_akhir", speed=1.6, maks=2.2), dict(k="adegan", nama="judul", min=8.5, a={"judul": "Ajari Komputer Membedakan\nKucing dan Anjing", "hook": "Setelah menonton, kamu bisa melatih model kecerdasan buatanmu sendiri, tanpa menulis satu baris kode pun."})],
 2: [dict(k="adegan", nama="aturan")],
 3: [dict(k="adegan", nama="kelas")],
 4: [dict(k="rek", a="b04", b="b04_akhir", maks=2.4)],
 5: [dict(k="rek", a="b05", b="b05_akhir", maks=2.4)],
 6: [dict(k="adegan", nama="latih")],
 7: [dict(k="rek", a="b07", b="b07_latih", maks=2.0), dict(k="klip", a="b07_latih", b="b07_latih_selesai", speed=14), dict(k="rek", a="b07_latih_selesai", b="b07_akhir")],
 8: [dict(k="adegan", nama="tebak", bg=("rek", "b10"))],
 9: [dict(k="adegan", nama="keyakinan")],
 10: [dict(k="rek", a="b10", b="b10_akhir", maks=2.0)],
 11: [dict(k="adegan", nama="bias")],
 12: [dict(k="rek", a="b12", b="b12_latih", maks=2.4), dict(k="klip", a="b12_latih", b="b12_latih_selesai", speed=14), dict(k="rek", a="b12_latih_selesai", b=249.2), dict(k="rek", a=249.2, b="b12_akhir", db=1.0, speed=0.42)],
 13: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "Contoh", "warna": "#ffb020", "judul": "Contoh", "sub": "bukan aturan", "kode": "data latih"}, {"ikon": "Keranjang", "warna": "#60a5fa", "judul": "Kelas", "sub": "label harus benar", "kode": "Kucing / Anjing"}, {"ikon": "Grafik", "warna": "#a78bfa", "judul": "Training", "sub": "kesalahan makin kecil", "kode": "epoch"}, {"ikon": "Bar", "warna": "#2dd4bf", "judul": "Keyakinan", "sub": "diuji dengan data baru", "kode": "96% + 4%"}, {"ikon": "Rumput", "warna": "#ff6b6b", "judul": "Bias", "sub": "data harus beragam", "kode": "latar hijau"}]})],
 14: [dict(k="adegan", nama="penutup", a={"tantangan": "Buat model yang membedakan tiga ekspresi wajah, yaitu senyum, cemberut, dan kaget, memakai kamera laptopmu.", "berikut": "Bikin AI Penebak Kelulusan dari Data Nilai"})],
}
SHORT = {"judul": "Komputer bisa belajar sendiri?", "beats": [
 {"teks": "Komputer ini belajar membedakan kucing dan anjing, tanpa satu baris kode pun.", "dari": (10, 3, "kanan")},
 {"teks": "Kita tidak menulis aturan. Kita memberi banyak contoh beserta jawabannya.", "dari": (2, 22, "kanan")},
 {"teks": "Saat training, model melihat contoh berkali-kali, dan kesalahannya makin kecil.", "dari": (6, 12, "kanan")},
 {"teks": "Hasilnya bukan ya atau tidak, tetapi tingkat keyakinan untuk setiap kelas.", "dari": (9, 17, "kanan")},
 {"teks": "Hati-hati dengan bias data. Model hanya sebaik contoh yang kita berikan.", "dari": (11, 19, "kanan")},
 {"teks": "Mau melatih modelmu sendiri? Tonton tutorial lengkapnya di channel ini.", "dari": (12, 10, "kanan")},
]}
THUMB = {"dari": (10, 4), "png": "thumb_tm.png", "pita": "TANPA CODING", "baris": ["KUCING", "ATAU", "ANJING?"], "sorot": 2, "ukuran": 112}
META = {
 "ringkas": "Latih model kecerdasan buatan pertamamu untuk membedakan kucing dan anjing dengan Teachable Machine, tanpa menulis kode. Kamu belajar bedanya menulis aturan dan memberi contoh, kelas dan label, data latih dan data uji, proses training dan epoch, tingkat keyakinan, sampai bias data. Di akhir, kita menambah kelas ketiga supaya model tidak memaksa setiap gambar menjadi kucing atau anjing. Semua gambar contoh adalah ilustrasi buatan sendiri.",
 "bab": [(1, "Pembuka"), (2, "Aturan atau contoh"), (3, "Kelas dan label"), (4, "Membuat proyek"), (5, "Data latih"), (6, "Apa itu training"), (7, "Melatih model"), (8, "Tebak dulu"), (9, "Data uji dan keyakinan"), (10, "Menguji model"), (11, "Bias data"), (12, "Kelas ketiga"), (13, "Rangkuman dan tantangan")],
 "kode": None,
 "langkah": """1. Buka teachablemachine.withgoogle.com, klik Get Started, pilih Image Project, lalu Standard image model.
2. Ganti nama Class 1 menjadi Kucing dan Class 2 menjadi Anjing.
3. Klik Upload di setiap kelas, lalu pilih gambar contohnya (data latih).
4. Klik Train Model dan tunggu sampai selesai. Jangan tutup tab browser.
5. Di Preview, ganti Input menjadi File, lalu unggah gambar baru (data uji).
6. Tambahkan kelas Bukan keduanya, isi dengan gambar benda lain, lalu latih ulang.""",
 "prasyarat": "Sebelumnya: Bikin Website Profil Diri dalam 10 Menit. Berikutnya: Bikin AI Penebak Kelulusan dari Data Nilai.",
 "komentar": "Tantangan: buat model yang membedakan senyum, cemberut, dan kaget dengan kamera laptopmu. Berapa persen keyakinan modelmu? Ceritakan di komentar.",
 "tag": ["machine learning untuk pemula", "teachable machine", "kecerdasan buatan", "AI tanpa coding", "belajar AI", "klasifikasi gambar", "bias data", "tutorial AI bahasa indonesia", "proyek AI sederhana", "kucing atau anjing AI"],
 "hashtag": ["machinelearning", "AI", "teachablemachine", "belajarAI"],
 "short_desk": "Melatih AI pembeda kucing dan anjing tanpa coding: contoh, training, tingkat keyakinan, dan bias data.",
}
