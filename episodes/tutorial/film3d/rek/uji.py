from vc import *
v = VC("/tmp/uji")
v.foto("/tmp/u1.png")
v.terminal(); time.sleep(2)
v.ketik("claude", 12); v.tombol("Enter", 12)
v.foto("/tmp/u2.png")
v.ctx.close(); v.pw.stop()
