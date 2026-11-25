MENU = [("Nasi goreng spesial telur ceplok", "32000", ["Andi"]), ("Mie ayam bakso", "28000", ["Bela"]), ("Ayam geprek", "25000", ["Citra"]),
        ("Kentang goreng", "30000", ["Andi", "Bela", "Citra", "Dimas"]), ("Es teh manis (2 gelas)", "16000", ["Andi", "Dimas"]),
        ("Kopi susu", "22000", ["Dimas"]), ("Pisang bakar", "24000", ["Bela", "Citra"])]
def isi_cepat(pg, menu=MENU, biaya=True):
    for n in ["Andi", "Bela", "Citra", "Dimas"]:
        pg.fill("#form-orang input[name=nama]", n); pg.click("#form-orang button[type=submit]")
    for nama, harga, _ in menu:
        pg.fill("#form-menu input[name=nama]", nama); pg.fill("#form-menu input[name=harga]", harga); pg.click("#form-menu button[type=submit]")
    for k, (_, _, pem) in enumerate(menu, 1):
        for p in pem: pg.click(f'#daftar-menu li:nth-child({k}) .chip:text-is("{p}")')
    if biaya:
        for n, v in [("voucher", "15000"), ("service", "5"), ("pajak", "10")]: pg.fill(f"#form-hitung input[name={n}]", v)
    pg.evaluate("scrollTo(0,0)")
