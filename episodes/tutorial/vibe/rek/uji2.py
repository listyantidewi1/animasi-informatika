from vc import *
v = VC("/tmp/uji2")
v.terminal(); v.perintah("git init -q && claude", tunggu=8)
v.foto("/tmp/uji2a.png")
dt = v.prompt("Jawab satu kalimat: apa itu PWA?", cps=60, batas=120); print("dt", dt)
v.foto("/tmp/uji2b.png")
v.tombol("Control+c"); v.tombol("Control+c")
v.ctx.close()
