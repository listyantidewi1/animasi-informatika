from vc import *
v = VC("/home/user/vibe/raw/V09c")
v.pilih_terminal(0); v.palet("View: Toggle Panel Visibility") if False else None
v.mulai("/home/user/vibe/raw/V09c"); v.tanda("mulai"); v.tunggu(1)
v.tanda("prompt_kalimat")
v.prompt("Tambahkan satu kalimat kecil di bawah judul: \"Bagi tagihan makan bareng, adil sampai rupiah terakhir.\"", cps=45, batas=400)
v.tanda("kalimat_jadi"); v.tunggu(2)
v.tanda("build"); v.bash("npm run build", tunggu=8); v.tanda("build_akhir"); v.tunggu(2)
v.stop(); v.foto("/tmp/v09c.png"); v.ctx.close(); v.pw.stop()
