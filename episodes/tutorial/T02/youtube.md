# T02 YouTube

## Video utama (4:51)

**Judul:** Bikin Kuis Otomatis yang Langsung Menghitung Skor dengan Python

**Deskripsi:**

Bikin kuis dengan Python yang langsung memeriksa jawaban dan menghitung nilai akhir. Soal dan kunci jawaban disimpan dalam list, dibuka satu per satu dengan perulangan for, jawaban dirapikan dengan strip() dan lower() sebelum dibandingkan, lalu skor diubah menjadi persen. Setiap konsep dijelaskan dengan animasi: list sebagai rak berlaci, for sebagai tangan yang membuka laci, = dan == yang sering tertukar, sampai diagram persen. Bisa diikuti di Google Colab atau Jupyter Notebook.

Bab:
0:00 Pembuka
0:28 List: rak berlaci
0:52 Menulis daftar soal
1:10 Perulangan for
1:54 Membandingkan teks
2:20 Memeriksa jawaban
2:49 Tebak dulu
3:08 Menghitung nilai
3:50 Tambah soal dan SyntaxError
4:11 Rangkuman dan tantangan

Kode lengkap:
soal = [
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
print(f"Skor kamu {skor} dari {len(soal)} ({round(nilai)}%)")

Sebelumnya: Bikin Game Tebak Angka Pertamamu dengan Python. Berikutnya: Hitung Nilai Rapor Otomatis, Lengkap dengan Grafiknya.
Playlist: Proyek Pemrograman Sederhana. Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.

Subscribe: https://www.youtube.com/@iTeachSWE

#python #belajarpython #coding #tutorialpython

**Komentar tersemat:** Tantangan: acak urutan soalnya dengan random.shuffle supaya setiap kali dimainkan urutannya berbeda. Kuis tentang apa yang ingin kamu buat?

**Tag:** python untuk pemula, kuis python, list python, for loop python, belajar python, tutorial python bahasa indonesia, strip lower python, google colab, coding untuk pelajar, proyek python sederhana

## Short

**Judul:** Kuis yang menilai dirinya sendiri? #shorts

**Deskripsi:**

Kuis yang langsung menilai dirinya sendiri, dibuat dengan Python. Kuncinya: list, perulangan for, merapikan teks dengan strip dan lower, dan rumus nilai.

Tutorial lengkapnya: Bikin Kuis Otomatis yang Langsung Menghitung Skor dengan Python (playlist Proyek Pemrograman Sederhana).
Subscribe: https://www.youtube.com/@iTeachSWE
#shorts #python #belajarpython #coding

**Video terkait:** Bikin Kuis Otomatis yang Langsung Menghitung Skor dengan Python
