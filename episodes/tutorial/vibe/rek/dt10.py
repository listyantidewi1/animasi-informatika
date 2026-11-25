from dt import *; from isi_cepat import isi_cepat
S = 1.28
d = DT("http://localhost:4173/", profil="/tmp/dtprof10"); time.sleep(1); d.panel("Network"); time.sleep(1)
d.mulai("/home/user/vibe/raw/D10"); d.tanda("mulai"); time.sleep(1)
d.tanda("muat_ulang"); klik(124*S, 82*S); time.sleep(3); foto("/tmp/d10_1.png")
d.tanda("pakai"); isi_cepat(d.pg); d.pg.click(".bar-bawah button"); time.sleep(3); foto("/tmp/d10_2.png")
d.tanda("akhir"); d.stop(); d.tutup()
