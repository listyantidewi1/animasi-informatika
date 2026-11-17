from vc import *
v = VC("/home/user/vibe/raw/V05c")
v.pilih_terminal(0)
v.mulai("/home/user/vibe/raw/V05c"); v.tanda("mulai"); v.tunggu(1)
v.tanda("prompt_commit")
v.prompt("Semua tes sudah lulus dan hasilnya sudah saya cek di HP. Commit semua perubahan dengan pesan \"Hitung patungan + tes\".", cps=45, batas=400)
v.tanda("commit_jadi"); v.tunggu(2)
v.tanda("log"); v.bash("git log --oneline", tunggu=4); v.tanda("log_akhir"); v.tunggu(2)
v.stop(); v.foto("/tmp/v05c.png"); v.ctx.close(); v.pw.stop()
