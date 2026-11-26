# T08 YouTube

## Video utama (7:20)

**Judul:** Sandi Caesar dengan Python: Bikin Sandi Rahasia dan Cara Membobolnya

**Deskripsi:**

Buat program Python untuk mengunci dan membuka pesan rahasia dengan sandi Caesar, lalu bobol sandinya sendiri. Kamu belajar mengubah huruf menjadi angka dengan index, membuat fungsi dengan parameter dan return, perulangan untuk setiap huruf, memperbaiki IndexError dengan modulo (abjad yang melingkar seperti jam), brute force untuk mencoba semua kunci, dan kenapa sandi modern memakai kunci dengan kemungkinan yang sangat banyak. Setiap konsep dijelaskan dengan animasi.

Bab:
0:00 Pembuka
0:28 Sandi Caesar
0:55 Huruf menjadi angka
1:20 Abjad sebagai string
2:16 Fungsi pengunci
2:44 Fungsi kunci
3:15 Fungsi buka
3:40 Tebak dulu
3:53 IndexError
4:21 Modulo
4:49 Menambahkan modulo
5:16 Membobol sandi
5:40 Brute force
6:12 Sandi modern
6:36 Rangkuman dan tantangan

Kode lengkap (bisa diunduh): https://github.com/listyantidewi1/animasi-informatika/tree/main/bahan-tutorial/T08

Kode lengkap:
huruf = "abcdefghijklmnopqrstuvwxyz"

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
    print(g, buka(sandi, g))

Sebelumnya: Bikin Game Ular Sendiri di Browser. Lebih mudah bila sudah menonton Bikin Game Tebak Angka dengan Python. Berikutnya: Bikin Kipas Otomatis Pengukur Suhu (IoT).
Playlist: Proyek Pemrograman Sederhana. Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.

Subscribe: https://www.youtube.com/@iTeachSWE

#python #kriptografi #belajarcoding #coding

**Komentar tersemat:** Tantangan: buat programmu tetap bekerja untuk huruf kapital. Coba pecahkan sandi ini dan tulis jawabannya di komentar: vhodpdw ehodmdu

**Tag:** sandi caesar python, kriptografi untuk pemula, python untuk pemula, fungsi python, modulo python, brute force, belajar coding, tutorial python bahasa indonesia, proyek python sederhana, pesan rahasia

## Short

**Judul:** Pesan rahasia ala Caesar? #shorts

**Deskripsi:**

Sandi Caesar dengan Python: huruf jadi angka, modulo seperti jarum jam, dan kenapa 26 kunci mudah dibobol.

Tutorial lengkapnya: Sandi Caesar dengan Python: Bikin Sandi Rahasia dan Cara Membobolnya (playlist Proyek Pemrograman Sederhana).
Kode lengkap (bisa diunduh): https://github.com/listyantidewi1/animasi-informatika/tree/main/bahan-tutorial/T08
Subscribe: https://www.youtube.com/@iTeachSWE
#shorts #python #kriptografi #belajarcoding

**Video terkait:** Sandi Caesar dengan Python: Bikin Sandi Rahasia dan Cara Membobolnya
