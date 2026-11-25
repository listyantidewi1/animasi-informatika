from vc import *
v = VC("/home/user/vibe/raw/V10b")
v.pilih_terminal(0)
v.mulai("/home/user/vibe/raw/V10b"); v.tanda("mulai"); v.tunggu(1)
v.tanda("prompt_mati")
v.prompt("Tunjukkan fungsi, variabel, atau berkas yang tidak dipakai di mana pun di proyek ini.\nJangan dihapus dulu, tunjukkan saja beserta buktinya.", cps=45, batas=900)
v.tanda("mati_jadi"); v.tunggu(5)
v.stop(); v.foto("/tmp/v10b.png"); v.ctx.close(); v.pw.stop()
