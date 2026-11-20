# Mengirim tag bab ke repo SiBaca

Kode dan README sudah ada di cabang `main`. Tag per bab belum terkirim, karena akses saya hanya boleh mengirim cabang. Jalankan perintah ini satu kali di komputer Ibu (Git Bash atau Terminal):

```bash
git clone https://github.com/listyantidewi1/SiBaca.git
cd SiBaca
git tag bab-01 0a98400
git tag bab-02 0a98400
git tag bab-03 ca6fee7
git tag bab-04 81aa79b
git tag bab-05 4261922
git tag bab-06 c6e93de
git tag bab-07 0d68379
git tag bab-08 7ba0917
git tag bab-09 4b8a0d6
git tag bab-10 0e14335
git tag bab-11 169a64f
git push origin --tags
```

Tag `bab-02` menunjuk ke kode yang sama dengan `bab-01`, karena Bab 2 berisi obrolan kebutuhan dan belum menulis kode baru.
