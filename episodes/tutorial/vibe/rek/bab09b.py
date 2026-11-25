from vc import *
v = VC("/home/user/vibe/raw/V09b")
v.pilih_terminal(0)
v.mulai("/home/user/vibe/raw/V09b"); v.tanda("mulai"); v.tunggu(1)
v.tanda("build"); v.bash("npm run build", tunggu=8); v.tanda("build_akhir"); v.tunggu(3)
v.buka("public/sw.js"); time.sleep(0.5); v.palet("View: Hide Panel"); time.sleep(0.6)
for baris, nama, lama in [(1, "baca_versi", 6), (13, "baca_daftar", 9), (27, "baca_install", 7), (39, "baca_activate", 7), (53, "baca_fetch", 8)]:
    v.tombol("Control+g", 0.4); v.ketik(str(baris), 20); v.tombol("Enter", 0.3)
    v.palet("View: Scroll Line Up") if False else None
    v.tanda(nama); v.tunggu(lama)
v.stop(); v.foto("/tmp/v09b.png"); v.ctx.close(); v.pw.stop()
