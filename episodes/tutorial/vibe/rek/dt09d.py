from dt import *
S = 1.28
def k(x, y): klik(x * S, y * S)
d = DT("http://localhost:4173/"); time.sleep(1); d.panel("Application"); time.sleep(1); k(1407, 225); time.sleep(1)
d.mulai("/home/user/vibe/raw/D09d"); d.tanda("mulai"); time.sleep(2)
d.tanda("muat_ulang1"); k(124, 82); time.sleep(3.5)
d.tanda("muat_ulang2"); k(124, 82); time.sleep(3.5); foto("/tmp/d09d_1.png")
print("tagline:", d.pg.locator("text=adil sampai rupiah").count())
d.tanda("cache"); k(1301, 556); time.sleep(1); k(1420, 585); time.sleep(4); foto("/tmp/d09d_2.png")
d.tanda("akhir"); d.stop(); d.tutup()
