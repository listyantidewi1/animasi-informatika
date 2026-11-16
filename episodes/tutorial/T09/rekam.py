import sys, time, re, random
sys.path.insert(0, "/home/user/tut/alat")
from rekam import Rekaman
from durasi import beat
D = beat("T09")
DIAG = open("/home/user/tut/T09/diagram.json").read()
A = open("/home/user/tut/T09/a.ino").read(); F = open("/home/user/tut/T09/f.ino").read()
r = Rekaman("/home/user/tut/T09/rek", "https://wokwi.com/projects/new/esp32"); pg = r.pg
pg.wait_for_function("typeof monaco !== 'undefined' && monaco.editor.getEditors().length > 0", timeout=60000); time.sleep(6)
ED = "monaco.editor.getEditors().filter(e=>e.getDomNode().offsetParent)[0]"
def opsi(): pg.evaluate(f"{ED}.updateOptions({{autoClosingBrackets:'never', autoClosingQuotes:'never', autoIndent:'none', formatOnType:false, autoSurround:'never', quickSuggestions:false, suggestOnTriggerCharacters:false, acceptSuggestionOnEnter:'off', wordBasedSuggestions:'off', parameterHints:{{enabled:false}}}})")
def nilai(): return pg.evaluate(f"{ED}.getValue()")
def xy_offset(off):
    return pg.evaluate(f"""(o)=>{{const e={ED}; const p=e.getModel().getPositionAt(o); e.revealPositionInCenterIfOutsideViewport(p); const v=e.getScrolledVisiblePosition(p); const b=e.getDomNode().getBoundingClientRect(); return [b.x+v.left, b.y+v.top+v.height/2, v.height]}}""", off)
def set_off(off): pg.evaluate(f"(o)=>{{const e={ED}; e.setPosition(e.getModel().getPositionAt(o)); e.focus()}}", off)
def kam_baris(off, z=1.9):
    x, y, h = xy_offset(off); r.kamera([0, y - 120, 768, 240], zoom=z, pad=0)
def ketik(teks, cps):
    n = 0
    for ch in teks:
        if ch == "\n": pg.keyboard.press("Enter"); time.sleep(0.12); n += 1
        else: pg.keyboard.type(ch); time.sleep(1 / cps * random.uniform(0.55, 1.5))
        if ch == "\n" and n % 3 == 0:
            v = nilai(); p = pg.evaluate(f"{ED}.getModel().getOffsetAt({ED}.getPosition())"); kam_baris(p)
def sisip(jangkar, teks, cps):
    v = nilai(); off = v.index(jangkar) + len(jangkar)
    x, y, h = xy_offset(off); r.klik(xy=(x + 2, y), dur=0.45); set_off(off); kam_baris(off); time.sleep(0.4)
    ketik(teks, cps)
def tab(nama): r.klik(xy=tuple(pg.evaluate(f"""(n)=>{{const el=[...document.querySelectorAll('*')].filter(e=>e.childElementCount===0 && e.textContent.trim()===n && e.getBoundingClientRect().y<90)[0]; const b=el.getBoundingClientRect(); return [b.x+b.width/2,b.y+b.height/2]}}""", nama)), dur=0.5); time.sleep(1.2)
def jalankan():
    r.klik(xy=(796, 108), dur=0.5); r.label("Klik tombol hijau untuk menjalankan simulasi", 3)
    for _ in range(120):
        if re.search(r"\d\d:\d\d\.\d\d\d", pg.inner_text("body")): break
        time.sleep(0.5)
    time.sleep(2.5)
    W, H = pg.evaluate("[innerWidth, innerHeight]"); r.klik(xy=(W - 20, H - 16), dur=0.4); time.sleep(0.8)
def kam_sim(): r.kamera([770, 80, 766, 700], pad=0)
def kam_lcd():
    b = pg.locator("wokwi-lcd1602").bounding_box(); k = pg.locator("wokwi-led").bounding_box()
    x0 = min(b["x"], k["x"]); y0 = min(b["y"], k["y"]); x1 = max(b["x"] + b["width"], k["x"] + k["width"]); y1 = b["y"] + b["height"]
    r.kamera([x0, y0, x1 - x0, y1 - y0], pad=40)
def stop(): r.klik(xy=(844, 108), dur=0.4); time.sleep(1.0)
def geser_suhu(v):
    b = pg.locator("input[type=range]").first.bounding_box(); cur = float(pg.locator("input[type=range]").first.input_value())
    X = lambda t: b["x"] + 8 + (t + 40) / 120 * (b["width"] - 16)
    r.gerak(X(cur), b["y"] + b["height"] / 2, 0.4); pg.mouse.down(); time.sleep(0.1)
    r.gerak(X(v), b["y"] + b["height"] / 2, 1.2); pg.mouse.up(); time.sleep(0.3)
    pg.locator("input[type=range]").first.fill(str(v)); pg.locator("input[type=range]").first.dispatch_event("input")

r.gerak(500, 400, 0.01); r.mulai(); time.sleep(0.5); r.kamera(None); time.sleep(1.5)
r.tanda("b03"); tab("diagram.json"); opsi()
x, y, h = xy_offset(10); r.klik(xy=(x + 100, y), dur=0.5); time.sleep(0.3)
pg.keyboard.press("Control+a"); time.sleep(0.6); r.label("Salin isi diagram.json dari deskripsi video", 3.5)
pg.evaluate(f"(t)=>{{const e={ED}; e.executeEdits('paste',[{{range:e.getModel().getFullModelRange(), text:t}}]); e.setPosition({{lineNumber:1,column:1}})}}", DIAG); time.sleep(1.5)
kam_sim(); time.sleep(4.0); r.kamera(None)
tab("Library Manager")
for lib in ["DHT sensor library for ESPx", "LiquidCrystal I2C"]:
    r.klik(xy=(728, 119), dur=0.5); time.sleep(1.0); r.ketik(lib, 16); time.sleep(2.5)
    bb = pg.get_by_text(lib, exact=True).last.bounding_box(); r.klik(xy=(bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2), dur=0.5); time.sleep(1.5)
r.kamera([0, 80, 768, 250], pad=0); time.sleep(2.0); r.kamera(None); r.tanda("b03_akhir")
r.tanda("b05"); tab("sketch.ino"); opsi()
x, y, h = xy_offset(5); r.klik(xy=(x + 100, y), dur=0.4); pg.keyboard.press("Control+a"); time.sleep(0.4); pg.keyboard.press("Delete"); time.sleep(0.5)
kam_baris(0); ketik(A, max(14, len(A) / (D[5] * 0.55))); assert nilai().rstrip() == A.rstrip(), "A"
time.sleep(0.5); r.kamera(None); r.tanda("b05_jalan"); jalankan(); kam_lcd(); time.sleep(3.5); r.kamera(None); r.tanda("b05_akhir")
r.tanda("b07"); stop(); cps = 16
sisip("LiquidCrystal_I2C layar(0x27, 16, 2);", "\nconst int KIPAS = 4;\nconst float BATAS = 30.0;", cps)
sisip("  layar.backlight();", "\n  pinMode(KIPAS, OUTPUT);", cps)
sisip('  layar.print(" C  ");', '\n  layar.setCursor(0, 1);\n  if (suhu > BATAS) {\n    digitalWrite(KIPAS, HIGH);\n    layar.print("Kipas: NYALA");\n  } else {\n    digitalWrite(KIPAS, LOW);\n    layar.print("Kipas: MATI ");\n  }', cps)
assert nilai().rstrip() == F.rstrip(), "F"
time.sleep(0.4); r.kamera(None); r.tanda("b07_jalan"); jalankan(); kam_lcd(); time.sleep(2.5)
r.tanda("b07_geser"); s = pg.locator("wokwi-dht22").bounding_box(); kam_sim(); r.klik(xy=(s["x"] + s["width"] / 2, s["y"] + s["height"] / 3), dur=0.6); time.sleep(1.2)
r.kamera([770, 80, 766, 600], pad=0); geser_suhu(34); time.sleep(0.5); kam_lcd(); time.sleep(3.5)
kam_sim(); time.sleep(0.5); geser_suhu(26.5); time.sleep(0.5); kam_lcd(); time.sleep(3.5); r.kamera(None); r.tanda("b07_akhir")
r.tanda("b09"); pg.keyboard.press("Escape"); stop()
v = nilai(); off = v.index("BATAS = 30.0") + len("BATAS = 30"); x, y, h = xy_offset(off); r.klik(xy=(x + 2, y), dur=0.45); set_off(off); kam_baris(off, 2.2); time.sleep(0.6)
for _ in range(2): pg.keyboard.press("Backspace"); time.sleep(0.25)
ketik("25", 5); time.sleep(0.8); r.kamera(None); jalankan(); kam_lcd(); time.sleep(4.0); r.kamera(None); r.tanda("b09_akhir")
time.sleep(0.5); r.selesai(); print("selesai", r.log["durasi"])
