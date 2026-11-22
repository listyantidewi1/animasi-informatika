from sesi import *
v = Sesi("uji")
v.bersih(); v.tata_awal(); time.sleep(1)
v.foto("/tmp/u3.png")
v.palet("View: Move Panel Right"); time.sleep(1); v.tata(230, 820); time.sleep(1); v.claude(12)
v.foto("/tmp/u4.png")
v.ctx.close(); v.pw.stop()
