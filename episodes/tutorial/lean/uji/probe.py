import asyncio, sys, json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 660}, device_scale_factor=1.5)
    pg.goto("https://live.lean-lang.org/", wait_until="domcontentloaded", timeout=60000); pg.wait_for_timeout(20000)
    for f in pg.frames:
        try: f.get_by_text("Don't show this again").click(timeout=1500)
        except Exception: pass
    pg.screenshot(path="uji/p0.png")
    ed = pg.locator(".monaco-editor").first; ed.click(); pg.keyboard.press("Control+A"); pg.keyboard.press("Delete"); pg.wait_for_timeout(500)
    pg.keyboard.type("theorem tukar (p q : Prop) : p \\and q \\to q \\and p := by", delay=30); pg.keyboard.press("Enter"); pg.keyboard.type("  intro h", delay=30); pg.keyboard.press("Enter"); pg.keyboard.type("constructor", delay=30); pg.keyboard.press("Enter"); pg.keyboard.type("\\. exact h.right", delay=30)
    pg.wait_for_timeout(6000); pg.screenshot(path="uji/p1.png")
    print(json.dumps(pg.evaluate("""()=>({lines:[...document.querySelectorAll('.view-line')].map(e=>[e.textContent,e.getBoundingClientRect().toJSON()]).slice(0,8), ifr:[...document.querySelectorAll('iframe')].map(e=>[e.src,e.getBoundingClientRect().toJSON()]), val: (window.monaco&&monaco.editor.getModels()[0].getValue())})"""), ensure_ascii=False)[:3000])
    for f in pg.frames: print("FRAME", f.url[:80], len(f.locator("body").inner_text()) if f.url!='' else 0)
    b.close()
