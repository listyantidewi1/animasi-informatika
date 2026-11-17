from hp import *
MENU = [("Nasi goreng spesial", "32000", ["Andi"]), ("Mie ayam bakso", "28000", ["Bela"]), ("Ayam geprek", "25000", ["Citra"]),
        ("Kentang goreng", "30000", ["Andi", "Bela", "Citra", "Dimas"]), ("Es teh manis (2 gelas)", "16000", ["Andi", "Dimas"]),
        ("Kopi susu", "22000", ["Dimas"]), ("Pisang bakar", "24000", ["Bela", "Citra"])]
h = HP("http://localhost:5173/")
h.pg.reload(); h.tunggu(1.5)
h.mulai("/home/user/vibe/raw/H05"); h.tanda("mulai"); h.tunggu(1.5)
h.tanda("orang")
for n in ["Andi", "Bela", "Citra", "Dimas"]:
    h.isi("#form-orang input[name=nama]", n, 12); h.tap("#form-orang button", 0.4)
h.gulir(-1500); h.tunggu(0.6)
h.tanda("menu")
for nama, harga, _ in MENU:
    h.isi("#form-menu input[name=nama]", nama, 16); h.isi("#form-menu input[name=harga]", harga, 10); h.tap("#form-menu button", 0.5)
h.tanda("pemakan")
for k, (_, _, pem) in enumerate(MENU, 1):
    for p in pem:
        h.tap(f'#daftar-menu li:nth-child({k}) .chip:text-is("{p}")', 0.35)
h.tunggu(1); h.foto("/tmp/h05_chip.png")
h.tanda("biaya")
f = "#form-hitung input[name=%s]"
for n, v in [("voucher", "15000"), ("service", "5"), ("pajak", "10")]:
    h.tap(f % n, 0.2); h.pg.keyboard.press("Control+A"); h.ketik(v, 10); h.tunggu(0.3)
h.tanda("hitung"); h.tap("#form-hitung button", 1.0)
h.pg.locator("#hasil").scroll_into_view_if_needed(); h.tunggu(3); h.foto("/tmp/h05_hasil.png")
h.tanda("akhir"); h.stop(); h.tutup()
