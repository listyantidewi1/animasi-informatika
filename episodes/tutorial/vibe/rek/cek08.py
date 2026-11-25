from playwright.sync_api import sync_playwright; from isi_cepat import isi_cepat
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(); pg.goto("http://localhost:5173/")
    print("share ada:", pg.evaluate("'share' in navigator"))
    isi_cepat(pg); pg.select_option("select[name=penalang]","Andi"); pg.click(".bar-bawah button")
    pg.route("https://wa.me/**", lambda r: r.fulfill(body="ok"))
    with pg.context.expect_page() as pp: pg.click("#hasil button:text-is('Bagikan')")
    print(pp.value.url[:120]); pg.evaluate("localStorage.clear()")
