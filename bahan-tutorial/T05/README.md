# T05 Kucing vs anjing (Teachable Machine)

Gambar contoh yang dipakai di video. Semua gambar adalah ilustrasi buatan sendiri (digambar dengan kode), bukan foto dari internet, jadi bebas dipakai untuk latihan.

**Cara paling mudah:** unduh [gambar_T05.zip](gambar_T05.zip) (klik nama file, lalu tombol **Download raw file**), lalu ekstrak. Isinya:

| Folder | Isi | Dipakai untuk |
|---|---|---|
| `Kucing` | 36 gambar kucing | data latih kelas Kucing |
| `Anjing` | 36 gambar anjing | data latih kelas Anjing |
| `Bukan` | 36 gambar benda (sepeda, bola, buku, kursi, mobil, tanaman, gelas) | data latih kelas Bukan keduanya |
| `uji` | `kucing_baru`, `kucing_setengah`, `anjing_baru`, `kucing_di_rumput`, `sepeda`, `sepeda_merah` | data uji di bagian Preview |

Langkah di Teachable Machine:

1. Buka teachablemachine.withgoogle.com, klik Get Started, pilih Image Project, lalu Standard image model.
2. Ganti nama Class 1 menjadi Kucing dan Class 2 menjadi Anjing.
3. Klik Upload di kelas Kucing, lalu pilih semua gambar di folder `Kucing`. Lakukan hal yang sama untuk kelas Anjing dengan folder `Anjing`.
4. Klik Train Model dan tunggu sampai selesai. Jangan tutup tab browser.
5. Di Preview, ganti Input menjadi File, lalu unggah gambar dari folder `uji` satu per satu.
6. Tambahkan kelas Bukan keduanya, isi dengan gambar di folder `Bukan`, lalu latih ulang dan uji lagi dengan `sepeda_merah.jpg`.

Gambar yang sama juga tersedia satu per satu di folder [gambar](gambar). Kode pembuat gambarnya ada di [episodes/tutorial/T05/hewan.py](../../episodes/tutorial/T05/hewan.py).
