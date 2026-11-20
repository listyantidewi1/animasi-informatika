# Mengirim tag bab ke repo SiPinjam

Kode dan README sudah ada di cabang `main`. Tag per bab belum terkirim, karena akses saya hanya boleh mengirim cabang. Jalankan perintah ini satu kali di komputer Ibu (Git Bash atau Terminal):

```bash
git clone https://github.com/listyantidewi1/SiPinjam.git
cd SiPinjam
git tag bab-01 b27d4e6
git tag bab-04 de38485
git tag bab-05 34f381a
git tag bab-06 cb8613f
git tag bab-07 89015d7
git tag bab-08 0fb43a7
git tag bab-09 a796a9a
git tag bab-10 316e7a8
git tag bab-11 a5bcd51
git tag bab-12 c9b3920
git tag bab-13 bdc1517
git push origin --tags
```

Bab 2 dan Bab 3 tidak punya tag karena belum ada kode yang ditulis di kedua bab itu.
