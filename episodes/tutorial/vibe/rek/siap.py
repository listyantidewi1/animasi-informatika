from vc import *
v = VC("/tmp/siap")
v.foto("/tmp/siap1.png")
v.palet("Terminal: Focus Terminal"); time.sleep(1.5)
print("term:", v.nama_terminal())
v.foto("/tmp/siap2.png"); v.ctx.close(); v.pw.stop()
