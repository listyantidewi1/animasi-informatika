import sys, time
sys.path.insert(0, "/home/user/tut/alat")
from rekam import Rekaman, DSF
from durasi import beat
from cmketik import ketik_ke, keadaan, V
D = beat("T04")
T = {k: open(f"/home/user/tut/T04/{k}.html").read().rstrip("\n") for k in ["a", "c", "d", "e1", "e2", "f"]}
open("/home/user/tut/nb/web/index.html", "w").write("")
import subprocess, atexit, os
bg = subprocess.Popen(["/opt/pw-browsers/chromium-1243/chrome-linux64/chrome", "--app=data:text/html,<body style='margin:0;background:linear-gradient(135deg,%23334155,%231e293b)'></body>", "--user-data-dir=/tmp/claude-0/bgprof", "--window-position=0,0", "--window-size=1536,864", "--force-device-scale-factor=1.6667", "--no-first-run", "--test-type", "--disable-infobars", "--no-sandbox"], env=dict(os.environ, DISPLAY=":99"), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
atexit.register(bg.kill); time.sleep(3)
EW, PW, WH = 880, 656, 864
r = Rekaman("/home/user/tut/T04/rek", "http://localhost:8888/edit/web/index.html?factory=Editor"); pg = r.pg
def jendela(page, left, width):
    cdp = page.context.new_cdp_session(page); wid = cdp.send("Browser.getWindowForTarget")["windowId"]
    cdp.send("Browser.setWindowBounds", {"windowId": wid, "bounds": {"left": left, "top": 0, "width": width, "height": WH}})
jendela(pg, 0, EW)
b2 = r.pw.chromium.launch(headless=False, args=[f"--window-size={PW},{WH}", f"--window-position={EW},0", f"--force-device-scale-factor={DSF}", "--disable-infobars", "--test-type", "--hide-crash-restore-bubble"], ignore_default_args=["--enable-automation"])
pv = b2.new_context(no_viewport=True).new_page(); pv.goto("file:///home/raka/website/index.html"); jendela(pv, EW, PW)
pg.bring_to_front(); pg.wait_for_selector(".cm-content"); time.sleep(3)
def off(page): return page.evaluate("window.outerHeight-window.innerHeight")
OE, OP = off(pg), off(pv)
def kam(x, y, w, h, zoom=None, left=0, oy=0, pad=20):
    x -= pad; y -= pad; w += 2 * pad; h += 2 * pad
    sx, sy, sw, sh = (left + x) * DSF, (y + oy) * DSF, w * DSF, h * DSF
    z = zoom or max(1.0, min(2.4, 2560 / sw, 1440 / sh))
    r.log["kamera"].append([r.t(), [sx + sw / 2, sy + sh / 2, z]])
def kam_preview(zoom=None):
    w = pv.evaluate("innerWidth"); h = pv.evaluate("innerHeight")
    kam(0, 0, w, h, zoom=zoom, left=pv.evaluate("screenX"), oy=OP, pad=0)
def kam_edit_baris(z=1.45):
    c = pg.evaluate(f"(()=>{{const v={V}; const k=v.coordsAtPos(v.state.selection.main.head); return k?[k.top,k.bottom]:null}})()")
    if not c: return
    y = (c[0] + c[1]) / 2; hh = 1440 / z / DSF
    kam(0, max(0, y - hh / 2), EW, hh, zoom=z, oy=OE, pad=0)
_tl = [None]
def ikuti():
    D_, p = keadaan(pg); L = D_[:p].count("\n")
    if _tl[0] is None or abs(L - _tl[0]) >= 3: _tl[0] = L; kam_edit_baris()
def ke_baris(teks):
    """klik di akhir baris yang berisi teks (dengan kursor tiruan)."""
    D_, _ = keadaan(pg); i = D_.index(teks) + len(teks)
    pg.evaluate(f"(k)=>{{const v={V}; v.dispatch({{effects: v.constructor.scrollIntoView(k, {{y:'center'}})}})}}", i); time.sleep(0.4)
    c = pg.evaluate(f"(k)=>{{const v={V}; const q=v.coordsAtPos(k); return [q.right, (q.top+q.bottom)/2]}}", i)
    r.klik(xy=(c[0] + 3, c[1]), dur=0.5)
    pg.evaluate(f"(k)=>{{const v={V}; v.dispatch({{selection:{{anchor:k}}}})}}", i)
def simpan(tahan=2.5, zoom=None):
    pg.keyboard.press("Control+s"); time.sleep(0.6); pv.reload(); time.sleep(0.3); r.kamera(None); time.sleep(tahan)
def ketik(stage, dur):
    D_, p = keadaan(pg); n = sum(1 for a, b in zip(T[stage], T[stage]) ) - len(D_)
    cps = max(8, min(30, abs(len(T[stage]) - len(D_)) / max(1, dur)))
    _tl[0] = None; ikuti(); ketik_ke(pg, T[stage], cps, ikuti=ikuti, pecah=(stage != "e1"))

r.gerak(400, 500, 0.01)
r.mulai(); time.sleep(0.5)
r.kamera(None)
r.tanda("b04"); r.klik(xy=(300, 200)); time.sleep(0.3)
ketik("a", D[4] * 0.6); r.label("Ctrl+S untuk menyimpan, lalu refresh browser", 3.5)
simpan(3.0, 1.35); r.tanda("b04_akhir")
r.tanda("b06"); ke_baris("Halo, aku Raka</h1>"); kam_edit_baris(1.9); time.sleep(0.4)
for _ in range(5): pg.keyboard.press("Backspace"); time.sleep(0.18)
time.sleep(0.4); simpan(3.2, 1.35)
kam_edit_baris(1.9); time.sleep(0.4); ketik_ke(pg, T["a"], 6); time.sleep(0.3); simpan(1.8, 1.35); r.tanda("b06_akhir")
r.tanda("b07"); ke_baris("menggambar.</p>"); ketik("c", D[7] * 0.62); simpan(3.2, 1.35); r.tanda("b07_akhir")
r.tanda("b09"); ke_baris("<title>Profil Raka</title>"); ketik("d", D[9] * 0.55); simpan(3.0, 1.35); r.tanda("b09_akhir")
r.tanda("b11"); ke_baris("<body>"); ketik("e1", 2.5); time.sleep(0.3)
pg.keyboard.press("ArrowDown"); pg.keyboard.press("Home"); time.sleep(0.2)
for _ in range(10): pg.keyboard.press("Shift+ArrowDown"); time.sleep(0.07)
time.sleep(0.4); pg.keyboard.press("Tab"); time.sleep(0.6)
ke_baris("Tempat aku belajar</a>"); ketik("e2", 2.0); time.sleep(0.3)
ke_baris("color: teal;\n        }"); ketik("f", D[11] * 0.45); simpan(3.5, 1.35); r.tanda("b11_akhir")
r.tanda("b12"); jendela(pv, EW, 430); time.sleep(0.6); r.kamera(None); time.sleep(3.5)
ke_baris("font-family: sans-serif;"); kam_edit_baris(1.9); time.sleep(0.5); pg.keyboard.press("Backspace"); time.sleep(0.6)
simpan(3.5, 1.35); kam_edit_baris(1.9); time.sleep(0.4); pg.keyboard.type(";"); time.sleep(0.5); simpan(2.5, 1.35)
jendela(pv, EW, PW); time.sleep(0.5); r.kamera(None); time.sleep(1.5); r.tanda("b12_akhir")
time.sleep(0.5); b2.close(); r.selesai(); print("selesai", r.log["durasi"])
