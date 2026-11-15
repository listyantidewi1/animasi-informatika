NAMA = "T01_Game_Tebak_Angka_Python"
def tebakan(rek): return {"tebakan": rek["rek"]["log"]["tebakan"]}
BEATS = {
 1: [dict(k="klip", a="b14", b="b14_akhir", speed=2.4, maks=2.4), dict(k="adegan", nama="judul", min=9, a={"judul": "Bikin Game Tebak Angka\nPertamamu dengan Python", "hook": "Setelah menonton, kamu bisa membuat program yang mengingat angka, bertanya kepada pemain, dan mengambil keputusan sendiri."})],
 2: [dict(k="rek", a="b02", b="b02_akhir")],
 3: [dict(k="adegan", nama="alur")],
 4: [dict(k="adegan", nama="variabel")],
 5: [dict(k="rek", a="b05", b="b05_akhir"), dict(k="adegan", nama="catatan", bg=True, min=12, a={"judul": "Angka rahasia dipilih secara acak", "kode": ["import random", "", "angka_rahasia = random.randint(1, 100)"], "sorot": [2], "gambar": "g_dadu", "angka": 42})],
 6: [dict(k="rek", a="b06", b="b06_akhir"), dict(k="adegan", nama="catatan", bg=True, min=7, a={"judul": "Kotak kedua untuk menghitung tebakan", "kode": ["jumlah_tebakan = 0", 'print("Aku sudah memilih angka dari 1 sampai 100. Coba tebak!")'], "sorot": [0], "gambar": "g_duaKotak", "ukuran": 30})],
 7: [dict(k="adegan", nama="tebak", bg=("rek", "b06_akhir"))],
 8: [dict(k="rek", a="b08", b="b08_akhir")],
 9: [dict(k="adegan", nama="perulangan")],
 10: [dict(k="rek", a="b10", b="b10_akhir"), dict(k="adegan", nama="catatan", bg=True, min=10, a={"judul": "input() memberi teks, int() mengubahnya menjadi angka", "kode": ['tebakan = int(input("Tebakanmu: "))'], "sorot": [0], "gambar": "g_int"})],
 11: [dict(k="rek", a="b11", b="b11_akhir"), dict(k="adegan", nama="catatan", bg=True, min=8.5, a={"judul": "Menambah isi kotak dengan satu", "kode": ["jumlah_tebakan = jumlah_tebakan + 1"], "sorot": [0], "gambar": "g_tambah"})],
 12: [dict(k="adegan", nama="cabang")],
 13: [dict(k="rek", a="b13", b="b13_akhir", maks=1.3)],
 14: [dict(k="rek", a="b14", b="b14_akhir", maks=2.2), dict(k="adegan", nama="garis", min=8, a_fn=tebakan)],
 15: [dict(k="rek", a="b15", b="b15_akhir", maks=1.3)],
 16: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "Kotak", "warna": "#2dd4bf", "judul": "Variabel", "sub": "untuk mengingat", "kode": "x = 42"}, {"ikon": "Putar", "warna": "#a78bfa", "judul": "Perulangan", "sub": "untuk mengulang", "kode": "while True:"}, {"ikon": "Cabang", "warna": "#ff6b6b", "judul": "Percabangan", "sub": "untuk memutuskan", "kode": "if / elif / else"}]})],
 17: [dict(k="adegan", nama="penutup", a={"tantangan": "Batasi pemain hanya boleh menebak 7 kali, lalu tampilkan “Kamu kalah” kalau kesempatannya habis. Petunjuk: perhatikan kotak jumlah_tebakan.", "berikut": "Bikin Kuis Otomatis yang Langsung Menghitung Skor"})],
}
JUDUL_YT = "Bikin Game Tebak Angka Pertamamu dengan Python"
SHORT = {"judul": "Bikin game sendiri pakai Python?", "beats": [
 {"teks": "Kamu bisa membuat game sendiri dengan Python, hanya dengan belasan baris kode.", "dari": (1, 0.5, "kiri")},
 {"teks": "Komputer memilih satu angka rahasia dari satu sampai seratus, lalu kamu menebaknya.", "dari": (5, 14, "tengah")},
 {"teks": "Rahasianya ada di tiga ide. Pertama, variabel, untuk mengingat angka rahasia.", "dari": (4, 9, "tengah")},
 {"teks": "Kedua, perulangan, supaya pemain bisa menebak berkali-kali.", "dari": (9, 6, "tengah")},
 {"teks": "Ketiga, percabangan, supaya komputer bisa menjawab terlalu kecil, terlalu besar, atau benar.", "dari": (12, 6, "kanan")},
 {"teks": "Ini triknya. Selalu tebak angka di tengah, maka angka berapa pun tertebak paling banyak tujuh kali.", "dari": (14, 15.5, "tengah")},
 {"teks": "Mau tahu cara membuatnya baris demi baris? Tonton tutorial lengkapnya di channel ini.", "dari": (13, 6, "kiri")},
]}
META = {
 "ringkas": "Bikin game tebak angka dengan Python dari sel kosong sampai bisa dimainkan. Komputer memilih angka rahasia, kamu yang menebak, dan program menjawab terlalu kecil, terlalu besar, atau benar. Di sepanjang video, setiap baris dijelaskan dengan animasi: variabel sebagai kotak berlabel, perulangan while sebagai lintasan yang berputar, dan percabangan if/elif/else sebagai jalan bercabang. Kamu juga belajar membaca pesan error dan trik menebak di tengah (pencarian biner). Bisa diikuti di Google Colab atau Jupyter Notebook, tanpa instalasi.",
 "bab": [(1, "Pembuka"), (2, "Notebook dan sel"), (3, "Rencana dulu: algoritma"), (4, "Variabel"), (5, "Angka rahasia dengan random"), (7, "Tebak dulu"), (9, "Perulangan while"), (10, "input dan int"), (12, "Percabangan if, elif, else"), (14, "Mainkan gamenya"), (15, "Ubah kode dan baca pesan error"), (16, "Rangkuman dan tantangan")],
 "kode": '''import random

angka_rahasia = random.randint(1, 100)
jumlah_tebakan = 0
print("Aku sudah memilih angka dari 1 sampai 100. Coba tebak!")

while True:
    tebakan = int(input("Tebakanmu: "))
    jumlah_tebakan = jumlah_tebakan + 1
    if tebakan < angka_rahasia:
        print("Terlalu kecil!")
    elif tebakan > angka_rahasia:
        print("Terlalu besar!")
    else:
        print("Benar! Kamu menebak dalam", jumlah_tebakan, "kali.")
        break''',
 "prasyarat": "Episode berikutnya: Bikin Kuis Otomatis yang Langsung Menghitung Skor.",
 "komentar": "Tantangan: batasi pemain hanya boleh menebak 7 kali, lalu tampilkan \"Kamu kalah\" kalau kesempatannya habis. Tulis kodemu di komentar! Kamu berhasil menebak dalam berapa kali?",
 "tag": ["python untuk pemula", "game tebak angka python", "belajar python", "tutorial python bahasa indonesia", "while loop python", "if elif else python", "variabel python", "google colab", "coding untuk pelajar", "proyek python sederhana"],
 "hashtag": ["python", "belajarpython", "coding", "tutorialpython"],
 "short_desk": "Bikin game tebak angka dengan Python cuma dengan belasan baris kode. Rahasianya tiga ide: variabel, perulangan, dan percabangan. Plus trik menebak di tengah: angka 1 sampai 100 selalu tertebak paling banyak 7 kali.",
}
THUMB = {"dari": (14, 9), "crop": (0, 0, 1300, 1080), "pita": "PYTHON PEMULA", "baris": ["BIKIN", "GAME", "TEBAK", "ANGKA"], "sorot": 1, "ukuran": 104}
