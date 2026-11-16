NAMA = "T08_Sandi_Rahasia_Python"
JUDUL_YT = "Bikin Sandi Rahasia dengan Python (Sandi Caesar dan Cara Membobolnya)"
BEATS = {
 1: [dict(k="klip", a="b13", b="b13_akhir", speed=1.4, maks=2.0), dict(k="adegan", nama="judul", min=8.5, a={"judul": "Bikin Sandi Rahasia\ndengan Python", "hook": "Setelah menonton, kamu bisa membuat program pengunci dan pembuka pesan rahasia, dan tahu kenapa sandi ini mudah dibobol."})],
 2: [dict(k="adegan", nama="caesar")],
 3: [dict(k="adegan", nama="nomor")],
 4: [dict(k="rek", a="b04", b="b04_akhir")],
 5: [dict(k="adegan", nama="fungsi")],
 6: [dict(k="rek", a="b06", b="b06_akhir")],
 7: [dict(k="rek", a="b07", b="b07_akhir")],
 8: [dict(k="adegan", nama="tebak", bg=("rek", "b09_tebak"))],
 9: [dict(k="rek", a="b09_tebak", b="b09_akhir", speed=0.6)],
 10: [dict(k="adegan", nama="modulo")],
 11: [dict(k="rek", a="b11", b="b11_akhir")],
 12: [dict(k="adegan", nama="bobol")],
 13: [dict(k="rek", a="b13", b="b13_akhir")],
 14: [dict(k="adegan", nama="modern")],
 15: [dict(k="adegan", nama="rangkuman", a={"item": [{"ikon": "Ubin", "warna": "#60a5fa", "judul": "Huruf = angka", "sub": "nomor urut abjad", "kode": "index()"}, {"ikon": "Mesin", "warna": "#a78bfa", "judul": "Fungsi", "sub": "masukan dan keluaran", "kode": "def kunci()"}, {"ikon": "Roda", "warna": "#2dd4bf", "judul": "Modulo", "sub": "abjad melingkar", "kode": "% 26"}, {"ikon": "Gembok", "warna": "#ff6b6b", "judul": "Brute force", "sub": "coba semua kunci", "kode": "range(26)"}]})],
 16: [dict(k="adegan", nama="penutup", a={"tantangan": "Buat program yang tetap bekerja untuk huruf kapital. Petunjuk: siapkan string kedua untuk abjad kapital.", "berikut": "Bikin Kipas Otomatis Pengukur Suhu (IoT)"})],
}
SHORT = {"judul": "Pesan rahasia ala Caesar?", "beats": [
 {"teks": "Pesan rahasia ini dibuat dengan cara yang dipakai Julius Caesar lebih dari dua ribu tahun lalu.", "dari": (2, 14, "tengah")},
 {"teks": "Setiap huruf diberi nomor, lalu nomornya digeser. Huruf c bernomor dua, ditambah tiga menjadi f.", "dari": (3, 15, "kanan")},
 {"teks": "Kalau lewat dari z, kita kembali ke awal abjad dengan modulo, seperti jarum jam.", "dari": (10, 18, "kanan")},
 {"teks": "Tetapi kuncinya hanya dua puluh enam. Komputer bisa mencoba semuanya dalam sekejap.", "dari": (13, 14, "kiri")},
 {"teks": "Mau membuat dan membobol sandimu sendiri? Tonton tutorial lengkapnya di channel ini.", "dari": (12, 16, "kiri")},
]}
THUMB = {"gambar": "thumb_out.json", "lebar": 720, "dari": (13, 14), "pita": "PYTHON", "baris": ["SANDI", "RAHASIA", "CAESAR"], "sorot": 1, "ukuran": 112}
META = {
 "ringkas": "Buat program Python untuk mengunci dan membuka pesan rahasia dengan sandi Caesar, lalu bobol sandinya sendiri. Kamu belajar mengubah huruf menjadi angka dengan index, membuat fungsi dengan parameter dan return, perulangan untuk setiap huruf, memperbaiki IndexError dengan modulo (abjad yang melingkar seperti jam), brute force untuk mencoba semua kunci, dan kenapa sandi modern memakai kunci dengan kemungkinan yang sangat banyak. Setiap konsep dijelaskan dengan animasi.",
 "bab": [(1, "Pembuka"), (2, "Sandi Caesar"), (3, "Huruf menjadi angka"), (4, "Abjad sebagai string"), (5, "Fungsi pengunci"), (6, "Fungsi kunci"), (7, "Fungsi buka"), (8, "Tebak dulu"), (9, "IndexError"), (10, "Modulo"), (11, "Menambahkan modulo"), (12, "Membobol sandi"), (13, "Brute force"), (14, "Sandi modern"), (15, "Rangkuman dan tantangan")],
 "kode": '''huruf = "abcdefghijklmnopqrstuvwxyz"

def kunci(pesan, geser):
    hasil = ""
    for h in pesan:
        if h in huruf:
            posisi = huruf.index(h) + geser
            posisi = posisi % 26
            hasil = hasil + huruf[posisi]
        else:
            hasil = hasil + h
    return hasil

def buka(sandi, geser):
    return kunci(sandi, -geser)

rahasia = kunci("ketemu di kantin jam sepuluh", 3)
print(rahasia)
print(buka(rahasia, 3))

# brute force
sandi = "uhuap zvyl shapohu ihzrla"
for g in range(26):
    print(g, buka(sandi, g))''',
 "prasyarat": "Sebelumnya: Bikin Game Ular Sendiri di Browser. Lebih mudah bila sudah menonton Bikin Game Tebak Angka dengan Python. Berikutnya: Bikin Kipas Otomatis Pengukur Suhu (IoT).",
 "komentar": "Tantangan: buat programmu tetap bekerja untuk huruf kapital. Coba pecahkan sandi ini dan tulis jawabannya di komentar: vhodpdw ehodmdu",
 "tag": ["sandi caesar python", "kriptografi untuk pemula", "python untuk pemula", "fungsi python", "modulo python", "brute force", "belajar coding", "tutorial python bahasa indonesia", "proyek python sederhana", "pesan rahasia"],
 "hashtag": ["python", "kriptografi", "belajarcoding", "coding"],
 "short_desk": "Sandi Caesar dengan Python: huruf jadi angka, modulo seperti jarum jam, dan kenapa 26 kunci mudah dibobol.",
}
