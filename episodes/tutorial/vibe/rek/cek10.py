from playwright.sync_api import sync_playwright; from isi_cepat import isi_cepat
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(); pg.goto("http://localhost:5173/"); pg.evaluate("localStorage.clear()"); pg.reload()
    dialogs=[]; pg.on("dialog", lambda d: (dialogs.append(d.message), d.dismiss()))
    pg.fill("#form-orang input[name=nama]", "<img src=x onerror=alert(1)>"); pg.click("#form-orang button[type=submit]")
    pg.fill("#form-menu input[name=nama]", "<b>Es</b>"); pg.fill("#form-menu input[name=harga]", "10000"); pg.click("#form-menu button[type=submit]")
    pg.click("#daftar-menu .chip"); pg.click(".bar-bawah button"); pg.wait_for_timeout(500)
    print("dialog:", dialogs, "| img tags:", pg.locator("#app img").count())
    print(pg.locator("#hasil").inner_text())
    for vouch, menu in [("999999", None), ("0", [("Gratis", "0")]), ("0", [("Mahal", "999999999")])]:
        pg.evaluate("localStorage.clear()"); pg.reload()
        isi_cepat(pg) if menu is None else None
        if menu:
            pg.fill("#form-orang input[name=nama]", "Andi"); pg.click("#form-orang button[type=submit]")
            for n,h in menu: pg.fill("#form-menu input[name=nama]", n); pg.fill("#form-menu input[name=harga]", h); pg.click("#form-menu button[type=submit]")
            pg.click("#daftar-menu .chip")
        pg.fill("#form-hitung input[name=voucher]", vouch); pg.click(".bar-bawah button"); pg.wait_for_timeout(300)
        print("---", vouch, menu, "\n", pg.locator("#hasil").inner_text())
    pg.evaluate("localStorage.clear()")
