from dt import *
S = 1.28
def k(x, y): klik(x * S, y * S)
d = DT("http://localhost:4173/"); time.sleep(1); d.panel("Application"); time.sleep(1); k(1407, 225); time.sleep(1)
d.mulai("/home/user/vibe/raw/D09b"); d.tanda("mulai"); time.sleep(1.5)
d.tanda("offline"); klik(2012, 296); time.sleep(2); foto("/tmp/d09b_1.png")
d.tanda("muat_ulang"); k(124, 82); time.sleep(4); foto("/tmp/d09b_2.png")
d.tanda("online"); klik(2012, 296); time.sleep(1.5)
d.tanda("pasang"); k(1760, 82); time.sleep(2.5); foto("/tmp/d09b_3.png")
d.tanda("akhir"); d.stop(); d.tutup()
