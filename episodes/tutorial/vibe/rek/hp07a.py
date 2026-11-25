from hp import *; from isi_cepat import isi_cepat
h = HP("http://localhost:5173/", profil="/tmp/hpprof412", lebar=412); h.pg.reload(); h.tunggu(1)
isi_cepat(h.pg); h.tunggu(0.5)
h.mulai("/home/user/vibe/raw/H07a"); h.tanda("mulai"); h.tunggu(2.5)
h.tanda("muat_ulang"); h.pg.reload(); h.tunggu(3); h.foto("/tmp/h07a.png")
h.tanda("akhir"); h.stop(); h.tutup()
