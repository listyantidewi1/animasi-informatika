NAMA = "T02_Kuis_Otomatis_Python"
JUDUL_YT = "Bikin Kuis Otomatis yang Langsung Menghitung Skor dengan Python"
BEATS = {
 1: [dict(k="klip", a="b13", b=104, speed=2.2, maks=2.4), dict(k="adegan", nama="judul", min=8.5, a={"judul": "Bikin Kuis Otomatis yang\nLangsung Menghitung Skor", "hook": "Setelah menonton, kamu bisa membuat kuis sendiri untuk teman sekelasmu, lengkap dengan nilai akhirnya."})],
 2: [dict(k="adegan", nama="pengingat")],
 3: [dict(k="adegan", nama="rakList")],
 4: [dict(k="rek", a="b04", b="b04_akhir"), dict(k="adegan", nama="catatan", bg=True, min=7, a={"judul": "Satu list, tiga pasang soal dan kunci", "kode": ['soal = [', '    ("Apa ibu kota Indonesia?", "jakarta"),', '    ("Berapa 7 x 8?", "56"),', '    ("Planet ... Matahari?", "merkurius"),', ']'], "ukuran": 26, "sorot": [1, 2, 3], "gambar": "g_rak"})],
 5: [dict(k="adegan", nama="forLaci")],
 6: [dict(k="rek", a="b06", b="b06_akhir"), dict(k="adegan", nama="catatan", bg=True, min=9, a={"judul": "Setiap putaran, isi laci masuk ke dua kotak", "kode": ["skor = 0", "for pertanyaan, kunci in soal:"], "sorot": [1], "gambar": "g_for"})],
 7: [dict(k="adegan", nama="timbangan")],
 8: [dict(k="rek", a="b08", b="b08_akhir"), dict(k="adegan", nama="catatan", bg=True, min=10, a={"judul": "Satu tanda sama dengan atau dua?", "kode": ["    if jawaban == kunci:", "        skor = skor + 1"], "sorot": [0, 1], "gambar": "g_samaDengan"})],
 9: [dict(k="adegan", nama="tebak", bg=("rek", "b08_akhir"))],
 10: [dict(k="rek", a="b10", b="b10_akhir", maks=1.6)],
 11: [dict(k="adegan", nama="persen")],
 12: [dict(k="rek", a="b12", b="b12_akhir")],
 13: [dict(k="rek", a="b13", b="b13_akhir", maks=2.0)],
 14: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "Kotak", "warna": "#ffb020", "judul": "List", "sub": "menyimpan banyak data", "kode": "soal = [...]"}, {"ikon": "Putar", "warna": "#a78bfa", "judul": "for", "sub": "membuka satu per satu", "kode": "for ... in soal:"}, {"ikon": "Cabang", "warna": "#60a5fa", "judul": "Teks rapi", "sub": "sebelum dibandingkan", "kode": ".strip().lower()"}, {"ikon": "Kotak", "warna": "#a3e635", "judul": "Nilai", "sub": "skor / jumlah x 100", "kode": "len(soal)"}]})],
 15: [dict(k="adegan", nama="penutup", a={"tantangan": "Acak urutan soalnya, supaya setiap kali dimainkan urutannya berbeda. Petunjuk: kamu sudah kenal random dari episode sebelumnya. Coba cari perintah random.shuffle.", "berikut": "Hitung Nilai Rapor Otomatis, Lengkap dengan Grafiknya"})],
}
SHORT = {"judul": "Kuis yang menilai dirinya sendiri?", "beats": [
 {"teks": "Kuis ini menilai dirinya sendiri. Kamu menjawab, dan skornya langsung muncul.", "dari": (1, 0.5, "kiri")},
 {"teks": "Semua soal disimpan dalam satu list, seperti rak dengan laci berurutan.", "dari": (3, 9, "tengah")},
 {"teks": "Perintah for membuka laci itu satu per satu, lalu berhenti sendiri setelah laci terakhir.", "dari": (5, 7, "kiri")},
 {"teks": "Supaya Jakarta dengan huruf besar tetap dianggap benar, jawaban dirapikan dulu dengan strip dan lower.", "dari": (7, 14, "tengah")},
 {"teks": "Terakhir, skor dibagi jumlah soal, lalu dikali seratus.", "dari": (11, 9, "kanan")},
 {"teks": "Mau membuat kuismu sendiri? Tonton tutorial lengkapnya di channel ini.", "dari": (12, 8, "kiri")},
]}
THUMB = {"dari": (10, 11), "crop": (0, 0, 1300, 1080), "pita": "PYTHON PEMULA", "baris": ["BIKIN", "KUIS", "OTOMATIS"], "sorot": 1, "ukuran": 112}
META = {
 "ringkas": "Bikin kuis dengan Python yang langsung memeriksa jawaban dan menghitung nilai akhir. Soal dan kunci jawaban disimpan dalam list, dibuka satu per satu dengan perulangan for, jawaban dirapikan dengan strip() dan lower() sebelum dibandingkan, lalu skor diubah menjadi persen. Setiap konsep dijelaskan dengan animasi: list sebagai rak berlaci, for sebagai tangan yang membuka laci, = dan == yang sering tertukar, sampai diagram persen. Bisa diikuti di Google Colab atau Jupyter Notebook.",
 "bab": [(1, "Pembuka"), (3, "List: rak berlaci"), (4, "Menulis daftar soal"), (5, "Perulangan for"), (7, "Membandingkan teks"), (8, "Memeriksa jawaban"), (9, "Tebak dulu"), (11, "Menghitung nilai"), (13, "Tambah soal dan SyntaxError"), (14, "Rangkuman dan tantangan")],
 "kode": '''soal = [
    ("Apa ibu kota Indonesia?", "jakarta"),
    ("Berapa 7 x 8?", "56"),
    ("Planet apa yang paling dekat dengan Matahari?", "merkurius"),
]

skor = 0
for pertanyaan, kunci in soal:
    jawaban = input(pertanyaan + " ")
    jawaban = jawaban.strip().lower()
    if jawaban == kunci:
        print("Benar!")
        skor = skor + 1
    else:
        print("Salah. Jawabannya", kunci)

nilai = skor / len(soal) * 100
print(f"Skor kamu {skor} dari {len(soal)} ({round(nilai)}%)")''',
 "prasyarat": "Sebelumnya: Bikin Game Tebak Angka Pertamamu dengan Python. Berikutnya: Hitung Nilai Rapor Otomatis, Lengkap dengan Grafiknya.",
 "komentar": "Tantangan: acak urutan soalnya dengan random.shuffle supaya setiap kali dimainkan urutannya berbeda. Kuis tentang apa yang ingin kamu buat?",
 "tag": ["python untuk pemula", "kuis python", "list python", "for loop python", "belajar python", "tutorial python bahasa indonesia", "strip lower python", "google colab", "coding untuk pelajar", "proyek python sederhana"],
 "hashtag": ["python", "belajarpython", "coding", "tutorialpython"],
 "short_desk": "Kuis yang langsung menilai dirinya sendiri, dibuat dengan Python. Kuncinya: list, perulangan for, merapikan teks dengan strip dan lower, dan rumus nilai.",
}
