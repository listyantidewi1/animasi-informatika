from dt import *
d = DT("http://localhost:4173/"); time.sleep(2)
d.mulai("/home/user/vibe/raw/D09c"); d.tanda("mulai"); time.sleep(1.5)
d.tanda("pasang"); klik(2324, 104); time.sleep(2.5); foto("/tmp/d09c_1.png")
d.tanda("akhir"); d.stop(); d.tutup()
