from playwright.sync_api import sync_playwright
U="http://127.0.0.1:8010"
with sync_playwright() as p:
    b=p.chromium.launch()
    def masuk(ctx, email):
        pg=ctx.new_page(); pg.goto(U+"/masuk"); pg.fill("input[name=email]", email); pg.fill("input[name=password]","rahasia123"); pg.click("button.tombol"); pg.wait_for_load_state(); return pg
    c=b.new_context(viewport={"width":1100,"height":700}, device_scale_factor=2, locale="id-ID", timezone_id="Asia/Jakarta")
    pg=masuk(c,"ratna@nusabakti.test"); pg.goto(U+"/rekap?dari=2026-10-01&sampai=2026-10-31"); pg.screenshot(path="rekap.png")
    c.close(); c=b.new_context(viewport={"width":1100,"height":700}, device_scale_factor=2, locale="id-ID", timezone_id="Asia/Jakarta")
    pg=masuk(c,"joko@nusabakti.test"); pg.screenshot(path="parkir.png")
    pg.goto(U+"/parkir/2432/struk"); pg.locator(".struk").screenshot(path="struk.png"); pg.goto(U+"/parkir/2434"); pg.locator(".struk").screenshot(path="tiket.png")
    c.close(); c=b.new_context(viewport={"width":390,"height":800}, device_scale_factor=3, is_mobile=True, locale="id-ID")
    pg=masuk(c,"joko@nusabakti.test"); pg.screenshot(path="hp.png")
    b.close()
