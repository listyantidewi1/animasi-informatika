from hp import *; from isi_cepat import MENU; from mock_share import MOCK
h = HP("http://localhost:5173/", profil="/tmp/hpprof412", lebar=412); h.pg.evaluate("localStorage.clear()")
h.ctx.add_init_script(MOCK); h.pg.reload(); h.tunggu(1)
h.mulai("/home/user/vibe/raw/H00"); h.tanda("mulai"); h.tunggu(1)
h.tanda("orang")
for n in ["Andi", "Bela", "Citra", "Dimas"]:
    h.isi("#form-orang input[name=nama]", n, 18); h.tap("#form-orang button[type=submit]", 0.2)
h.gulir(-1500); h.tunggu(0.3)
h.tanda("menu")
for nama, harga, _ in MENU:
    h.isi("#form-menu input[name=nama]", nama, 30); h.isi("#form-menu input[name=harga]", harga, 16); h.tap("#form-menu button[type=submit]", 0.25)
h.tanda("pemakan")
for k, (_, _, pem) in enumerate(MENU, 1):
    for p in pem: h.tap(f'#daftar-menu li:nth-child({k}) .chip:text-is("{p}")', 0.2)
h.tanda("biaya")
h.isi("#form-hitung input[name=tempat]", "Kafe Senja", 20)
h.pg.locator("select[name=penalang]").select_option("Andi"); h.tunggu(0.4)
for n, val in [("voucher", "15000"), ("service", "5"), ("pajak", "10")]:
    h.tap(f"#form-hitung input[name={n}]", 0.15); h.pg.keyboard.press("Control+A"); h.ketik(val, 16)
h.tanda("hitung"); h.tap(".bar-bawah button", 3); h.foto("/tmp/h00_hasil.png")
h.tanda("bagikan"); h.tap("#hasil button:text-is('Bagikan')", 4); h.foto("/tmp/h00_bagikan.png")
h.tanda("akhir"); h.stop(); h.pg.evaluate("localStorage.clear()"); h.tutup()
