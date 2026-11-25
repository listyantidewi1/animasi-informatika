from hp import *
h = HP("http://localhost:5173/")
h.mulai("/home/user/vibe/raw/H04"); h.tanda("mulai"); h.tunggu(2)
h.tanda("tambah_menu")
for nama, harga in [("Nasi goreng spesial", "32000"), ("Mie ayam bakso", "28000"), ("Kentang goreng", "30000")]:
    h.isi("#form-menu input[name=nama]", nama, 12); h.isi("#form-menu input[name=harga]", harga, 8); h.tap("#form-menu button", 0.8)
h.tanda("tambah_orang")
for n in ["Andi", "Bela", "Citra", "Dimas"]:
    h.isi("#form-orang input[name=nama]", n, 10); h.tap("#form-orang button", 0.6)
h.tunggu(1.5); h.gulir(-800); h.tunggu(1)
h.tanda("uji_huruf"); h.isi("#form-menu input[name=nama]", "Es teh", 10); h.isi("#form-menu input[name=harga]", "abc", 6); h.tunggu(1.5)
h.tap("#form-menu button", 2.5); h.foto("/tmp/h04_huruf.png")
h.tanda("uji_kosong"); h.pg.locator("#form-menu input[name=nama]").fill(""); h.tap("#form-menu button", 3); h.foto("/tmp/h04_kosong.png")
h.tanda("akhir"); h.stop(); h.tutup()
