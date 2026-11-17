from vc import *
v = VC("/home/user/vibe/raw/V06b")
v.pilih_terminal(0)
v.mulai("/home/user/vibe/raw/V06b"); v.tanda("mulai"); v.tunggu(1)
v.tanda("prompt_gulir")
v.prompt("Saya cek di HP: setelah tombol Hitung diketuk, layar tidak berubah karena hasilnya ada jauh di bawah.\nPengguna bisa mengira tombolnya tidak jalan. Setelah dihitung, gulirkan layar ke hasil.\nJangan mengubah src/hitung.js.", cps=45, batas=600)
v.tanda("gulir_jadi"); v.tunggu(3)
v.stop(); v.foto("/tmp/v06b.png"); v.ctx.close(); v.pw.stop()
