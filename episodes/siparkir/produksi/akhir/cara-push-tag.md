# Mengirim tag bab ke repo SiParkir

Kode, README, dan tangkapan layar sudah ada di cabang `main` (https://github.com/listyantidewi1/SiParkir). Tag per bab belum terkirim, karena akses saya hanya boleh mengirim cabang. Jalankan perintah ini satu kali di komputer Ibu (Git Bash atau Terminal):

```bash
git clone https://github.com/listyantidewi1/SiParkir.git
cd SiParkir
git tag bab-01 8ab0141
git tag bab-04 1947abe
git tag bab-05 7e275ac
git tag bab-06 8e3bfcf
git tag bab-07 104587e
git tag bab-08 285b5f7
git tag bab-09 17ea069
git tag bab-10 7a2e4b1
git tag bab-11 bed01e7
git tag bab-12 8d4bc5f
git push origin --tags
```

Bab 2 dan Bab 3 tidak punya tag karena belum ada kode yang ditulis di kedua bab itu. README di repo sudah menyebut tag ini, jadi penonton bisa mengunduh kode di akhir setiap bab setelah tag terkirim.
