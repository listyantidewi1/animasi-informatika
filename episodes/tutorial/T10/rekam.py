import sys, time, threading
sys.path.insert(0, "/home/user/tut/alat")
from rekam import Rekaman, DSF
from durasi import beat
from cmketik import ketik_ke, keadaan, V
D = beat("T10")
T = {k: open(f"/home/user/tut/T10/{k}.html").read().rstrip("\n") for k in ["a", "b", "c", "d", "e"]}
open("/home/user/tut/nb/tugas/index.html", "w").write("")
import subprocess, atexit, os
bg = subprocess.Popen(["/opt/pw-browsers/chromium-1243/chrome-linux64/chrome", "--app=data:text/html,<body style='margin:0;background:linear-gradient(135deg,%23334155,%231e293b)'></body>", "--user-data-dir=/tmp/claude-0/bgprof", "--window-position=0,0", "--window-size=1536,864", "--force-device-scale-factor=1.6667", "--no-first-run", "--test-type", "--disable-infobars", "--no-sandbox"], env=dict(os.environ, DISPLAY=":99"), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
atexit.register(bg.kill); time.sleep(3)
EW, PW, WH = 880, 656, 864
r = Rekaman("/home/user/tut/T10/rek", "http://localhost:8888/edit/tugas/index.html?factory=Editor"); pg = r.pg
def jendela(page, left, width):
    cdp = page.context.new_cdp_session(page); wid = cdp.send("Browser.getWindowForTarget")["windowId"]
    cdp.send("Browser.setWindowBounds", {"windowId": wid, "bounds": {"left": left, "top": 0, "width": width, "height": WH}})
jendela(pg, 0, EW)
b2 = r.pw.chromium.launch(headless=False, args=[f"--window-size={PW},{WH}", f"--window-position={EW},0", f"--force-device-scale-factor={DSF}", "--disable-infobars", "--test-type", "--hide-crash-restore-bubble"], ignore_default_args=["--enable-automation"])
pv = b2.new_context(no_viewport=True).new_page(); pv.goto("file:///home/raka/daftar-tugas/index.html"); jendela(pv, EW, PW)
pg.bring_to_front(); pg.wait_for_selector(".cm-content"); time.sleep(3)
def off(page): return page.evaluate("window.outerHeight-window.innerHeight")
OE, OP = off(pg), off(pv)
def kam(x, y, w, h, zoom=None, left=0, oy=0, pad=20):
    x -= pad; y -= pad; w += 2 * pad; h += 2 * pad
    sx, sy, sw, sh = (left + x) * DSF, (y + oy) * DSF, w * DSF, h * DSF
    z = zoom or max(1.0, min(2.4, 2560 / sw, 1440 / sh))
    r.log["kamera"].append([r.t(), [sx + sw / 2, sy + sh / 2, z]])
def kam_preview(z=None):
    w = pv.evaluate("innerWidth"); h = pv.evaluate("innerHeight")
    kam(0, 0, w, h, zoom=z, left=EW, oy=OP, pad=0)
def kam_edit_baris(z=1.45):
    c = pg.evaluate(f"(()=>{{const v={V}; const k=v.coordsAtPos(v.state.selection.main.head); return k?[k.top,k.bottom]:null}})()")
    if not c: return
    y = (c[0] + c[1]) / 2; hh = 1440 / z / DSF
    kam(0, max(0, y - hh / 2), EW, hh, zoom=z, oy=OE, pad=0)
_tl = [None]
def ikuti():
    D_, p = keadaan(pg); L = D_[:p].count("\n")
    if _tl[0] is None or abs(L - _tl[0]) >= 3: _tl[0] = L; kam_edit_baris()
def ke_baris(teks, akhir=True):
    D_, _ = keadaan(pg); i = D_.index(teks) + (len(teks) if akhir else 0)
    pg.evaluate(f"(k)=>{{const v={V}; v.dispatch({{effects: v.constructor.scrollIntoView(k, {{y:'center'}})}})}}", i); time.sleep(0.4)
    c = pg.evaluate(f"(k)=>{{const v={V}; const q=v.coordsAtPos(k); return [q.right, (q.top+q.bottom)/2]}}", i)
    r.klik(xy=(c[0] + 3, c[1]), dur=0.5)
    pg.evaluate(f"(k)=>{{const v={V}; v.dispatch({{selection:{{anchor:k}}}})}}", i)
def hapus_baris(teks):
    ke_baris(teks); kam_edit_baris(1.9); time.sleep(0.5)
    D_, k = keadaan(pg); a = D_.rfind("\n", 0, k)
    pg.evaluate(f"([a,b])=>{{const v={V}; v.dispatch({{selection:{{anchor:b, head:a}}}})}}", [a, k]); time.sleep(0.7)
    pg.keyboard.press("Backspace"); time.sleep(0.6)
def simpan(tahan=2.5):
    pg.keyboard.press("Control+s"); time.sleep(0.6); pv.reload(); time.sleep(0.3); r.kamera(None); time.sleep(tahan)
def ketik_to(T_, dur):
    D_, p = keadaan(pg)
    cps = max(8, min(30, abs(len(T_) - len(D_)) / max(1, dur)))
    _tl[0] = None; ikuti(); ketik_ke(pg, T_, cps, ikuti=ikuti); assert keadaan(pg)[0] == T_
def ketik(stage, dur): ketik_to(T[stage], dur)
def tambah_tugas(teks):
    kam_preview(1.6); pv.click("#isian"); time.sleep(0.3)
    for ch in teks: pv.keyboard.type(ch); time.sleep(0.045)
    time.sleep(0.3); bb = pv.locator("button").bounding_box(); pv.mouse.move(bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2, steps=8); time.sleep(0.2); pv.click("button"); time.sleep(0.9)
def refresh(tahan=2.0):
    kam_preview(1.6); time.sleep(0.6); pv.reload(); time.sleep(tahan)
def ganti(a, b): return T[a].replace(*b) if b else T[a]
b = T["b"]
c1 = b.replace("let tugas = [];", 'let tugas = JSON.parse(localStorage.getItem("tugas")) || [];')
c2 = T["c"].replace("      simpan();\n    }\n\n    tampilkan();", "      tampilkan();\n    }\n\n    tampilkan();")
d1 = T["c"].replace("cursor: pointer; }\n", "cursor: pointer; }\n    .selesai { text-decoration: line-through; color: #999; }\n")

r.gerak(400, 500, 0.01)
r.mulai(); time.sleep(0.5); r.kamera(None)
r.tanda("b03"); r.klik(xy=(300, 200)); time.sleep(0.3)
ketik("a", D[3] * 0.65); r.label("Ctrl+S untuk menyimpan, lalu refresh browser", 3.5)
simpan(1.0); kam_preview(1.6); time.sleep(3.0); r.kamera(None); r.tanda("b03_akhir")
r.tanda("b05"); ke_baris('<ul id="daftar"></ul>'); ketik("b", D[5] * 0.55); simpan(0.5)
r.tanda("b05_coba"); tambah_tugas("PR Matematika hal. 45"); tambah_tugas("Bawa baju olahraga"); time.sleep(1.5); r.kamera(None); r.tanda("b05_akhir")
r.tanda("b06"); refresh(1.0); r.label("Setelah refresh, semua tugas hilang", 3.0); time.sleep(3.0); r.kamera(None); r.tanda("b06_akhir")
r.tanda("b07"); ke_baris("let tugas = [];"); kam_edit_baris(1.9)
for _ in range(3): pg.keyboard.press("Backspace"); time.sleep(0.15)
ketik_to(c1, 6); ke_baris("      });\n    }"); ketik_to(c2, 7); hapus_baris('isian.value = "";\n      tampilkan();'); ketik("c", 2); simpan(0.5)
r.tanda("b07_coba"); tambah_tugas("PR Matematika hal. 45"); tambah_tugas("Bawa baju olahraga"); tambah_tugas("Belajar ulangan IPA"); time.sleep(0.8)
r.tanda("b07_refresh"); refresh(1.0); r.label("Setelah refresh, tugas tetap ada", 3.0); time.sleep(3.0); r.kamera(None); r.tanda("b07_akhir")
r.tanda("b08"); ke_baris("cursor: pointer; }"); ketik_to(d1, 3); ke_baris("li.textContent = t.teks;"); ketik("d", D[8] * 0.45); simpan(0.5)
r.tanda("b08_klik"); kam_preview(1.6); time.sleep(0.6)
for i in (1, 0):
    bb = pv.locator("li").nth(i).bounding_box(); pv.mouse.move(bb["x"] + 60, bb["y"] + bb["height"] / 2, steps=10); time.sleep(0.3); pv.mouse.click(bb["x"] + 60, bb["y"] + bb["height"] / 2); time.sleep(1.4)
time.sleep(1.5); r.kamera(None); r.tanda("b08_akhir")
r.tanda("b10"); kam_preview(1.6); time.sleep(1.0); bb = pv.locator("button").bounding_box(); pv.mouse.move(bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2, steps=10); time.sleep(0.8)
r.tanda("b10_tebak"); pv.click("button"); time.sleep(0.6); pv.click("button"); time.sleep(2.5); r.tanda("b10_bug")
ke_baris('getElementById("isian");'); ketik("e", 4); simpan(0.5); kam_preview(1.6); time.sleep(0.6)
r.label("Tugas kosong tadi sudah terlanjur tersimpan", 3.0); bb = pv.locator("button").bounding_box(); pv.mouse.move(bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2, steps=10)
for _ in range(3): pv.click("button"); time.sleep(0.8)
time.sleep(1.5); r.kamera(None); r.tanda("b10_akhir")
time.sleep(0.5); b2.close(); r.selesai(); print("selesai", r.log["durasi"])
