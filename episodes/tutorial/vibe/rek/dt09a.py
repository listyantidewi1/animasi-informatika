from dt import *
S = 1.28
def k(x, y): klik(x * S, y * S)
d = DT("http://localhost:4173/"); time.sleep(1); d.panel("Application"); time.sleep(1)
d.pg.reload(); time.sleep(2)
d.mulai("/home/user/vibe/raw/D09a"); d.tanda("mulai"); time.sleep(1)
d.tanda("manifest"); k(1379, 196); time.sleep(5); foto("/tmp/d09_1.png")
d.tanda("sw"); k(1407, 225); time.sleep(5); foto("/tmp/d09_2.png")
d.tanda("cache"); k(1301, 556); time.sleep(1); foto("/tmp/d09_3a.png")
k(1420, 585); time.sleep(5); foto("/tmp/d09_3.png")
d.tanda("akhir"); d.stop(); d.tutup()
