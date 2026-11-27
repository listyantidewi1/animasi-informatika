import json, urllib.parse
from playwright.sync_api import sync_playwright
code = open("uji/akhir.lean").read()
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 960, "height": 495}, device_scale_factor=2)
    pg.goto("https://live.lean-lang.org/#code=" + urllib.parse.quote(code), wait_until="domcontentloaded", timeout=60000); pg.wait_for_timeout(30000)
    for f in pg.frames:
        try: f.get_by_text("Don't show this again").click(timeout=1500)
        except Exception: pass
    pg.add_style_tag(content=".monaco-editor .cursors-layer .cursor{visibility:inherit!important;opacity:1!important;animation:none!important} .suggest-widget,.monaco-hover,.parameter-hints-widget{display:none!important}")
    ed = pg.locator(".monaco-editor").first; ed.click(position={"x": 300, "y": 300}); pg.keyboard.press("Control+End"); pg.keyboard.press("ArrowUp"); pg.keyboard.press("ArrowUp"); pg.keyboard.press("ArrowUp"); pg.wait_for_timeout(2500); pg.screenshot(path="uji/q_sorry.png")
    pg.keyboard.press("ArrowUp"); pg.wait_for_timeout(2500); pg.screenshot(path="uji/q_must.png")
    fr = [f for f in pg.frames if f.url == "about:blank"][0]
    print(fr.evaluate("""()=>{const o=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const t=n.textContent.trim();if(!t)continue;const r=document.createRange();r.selectNodeContents(n);const b=r.getBoundingClientRect();o.push([t,Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)])}return o}"""))
    print(pg.evaluate("()=>{const e=document.querySelector('.view-line span span');const l=document.querySelector('.view-lines');return [getComputedStyle(l).fontFamily,getComputedStyle(l).fontSize, e.getBoundingClientRect().width/e.textContent.length, document.querySelector('.monaco-editor .cursor').getBoundingClientRect().toJSON()]}"))
    b.close()
