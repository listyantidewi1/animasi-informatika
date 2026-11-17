# T01 YouTube

## Video utama (5:57)

**Judul:** Bikin Game Tebak Angka Pertamamu dengan Python

**Deskripsi:**

Bikin game tebak angka dengan Python dari sel kosong sampai bisa dimainkan. Komputer memilih angka rahasia, kamu yang menebak, dan program menjawab terlalu kecil, terlalu besar, atau benar. Di sepanjang video, setiap baris dijelaskan dengan animasi: variabel sebagai kotak berlabel, perulangan while sebagai lintasan yang berputar, dan percabangan if/elif/else sebagai jalan bercabang. Kamu juga belajar membaca pesan error dan trik menebak di tengah (pencarian biner). Bisa diikuti di Google Colab atau Jupyter Notebook, tanpa instalasi.

Bab:
0:00 Pembuka
0:21 Notebook dan sel
0:39 Rencana dulu: algoritma
1:09 Variabel
1:37 Angka rahasia dengan random
2:20 Tebak dulu
2:46 Perulangan while
3:05 input dan int
3:43 Percabangan if, elif, else
4:33 Mainkan gamenya
4:56 Ubah kode dan baca pesan error
5:21 Rangkuman dan tantangan

Kode lengkap:
import random

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
        break

Episode berikutnya: Bikin Kuis Otomatis yang Langsung Menghitung Skor.
Playlist: Proyek Pemrograman Sederhana. Narasi: Cahaya (suara sintetis ElevenLabs). Rekaman layar sungguhan; animasi penjelasan dibuat dengan kode oleh I Teach Software Engineering. Naskah disusun dengan bantuan AI (Claude buatan Anthropic) dan disunting manusia.

Subscribe: https://www.youtube.com/@iTeachSWE

#python #belajarpython #coding #tutorialpython

**Komentar tersemat:** Tantangan: batasi pemain hanya boleh menebak 7 kali, lalu tampilkan "Kamu kalah" kalau kesempatannya habis. Tulis kodemu di komentar! Kamu berhasil menebak dalam berapa kali?

**Tag:** python untuk pemula, game tebak angka python, belajar python, tutorial python bahasa indonesia, while loop python, if elif else python, variabel python, google colab, coding untuk pelajar, proyek python sederhana

## Short

**Judul:** Bikin game sendiri pakai Python? #shorts

**Deskripsi:**

Bikin game tebak angka dengan Python cuma dengan belasan baris kode. Rahasianya tiga ide: variabel, perulangan, dan percabangan. Plus trik menebak di tengah: angka 1 sampai 100 selalu tertebak paling banyak 7 kali.

Tutorial lengkapnya: Bikin Game Tebak Angka Pertamamu dengan Python (playlist Proyek Pemrograman Sederhana).
Subscribe: https://www.youtube.com/@iTeachSWE
#shorts #python #belajarpython #coding

**Video terkait:** Bikin Game Tebak Angka Pertamamu dengan Python
