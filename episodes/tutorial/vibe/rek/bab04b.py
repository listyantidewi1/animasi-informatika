from vc import *
v = VC("/home/user/vibe/raw/V04b")
v.palet("File: Refresh Explorer"); time.sleep(0.5)
v.mulai("/home/user/vibe/raw/V04b"); v.tanda("mulai"); v.tunggu(1.5)
v.palet("Terminal: Create New Terminal"); time.sleep(1.5); v.tanda("terminal2")
v.perintah("npm install", tunggu=6); v.tanda("npm_install"); v.tunggu(1)
v.perintah("npm run dev", tunggu=4); v.tanda("npm_dev"); v.tunggu(3)
# baca main.js
v.buka("src/main.js"); v.tanda("main_js"); v.tunggu(3)
v.tombol("Control+Home", 0.5)
for nama, baris in [("blok_state", 3), ("blok_template", 10), ("blok_tampil", 39), ("blok_submit_menu", 61), ("blok_submit_orang", 73)]:
    v.tombol("Control+g", 0.5); v.ketik(str(baris), 20); v.tombol("Enter", 0.3)
    v.pg.keyboard.press("Control+l") if False else None
    v.tanda(nama); v.tunggu(3)
v.tanda("akhir"); v.stop(); v.ctx.close(); v.pw.stop()
