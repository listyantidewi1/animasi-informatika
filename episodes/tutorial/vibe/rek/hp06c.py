from hp import *; from isi_cepat import isi_cepat
h = HP("http://localhost:5173/", profil="/tmp/hpprof412", lebar=412); h.pg.reload(); h.tunggu(1)
isi_cepat(h.pg); h.tunggu(0.5)
h.mulai("/home/user/vibe/raw/H06c"); h.tanda("mulai"); h.tunggu(2)
h.tanda("hitung"); h.tap(".bar-bawah button", 3.5); h.foto("/tmp/h06c.png")
h.tanda("akhir"); h.stop(); h.tutup()
