from dt import *
S = 1.28
def k(x, y): klik(x * S, y * S)
d = DT("http://localhost:4173/"); time.sleep(1); d.panel("Application"); time.sleep(1)
d.mulai("/home/user/vibe/raw/D09f"); d.tanda("mulai"); time.sleep(1.5)
d.tanda("cache"); foto("/tmp/d09f_0.png"); k(1301, 556); time.sleep(1); foto("/tmp/d09f_1.png"); k(1420, 585); time.sleep(4); foto("/tmp/d09f_2.png")
d.tanda("akhir"); d.stop(); d.tutup()
