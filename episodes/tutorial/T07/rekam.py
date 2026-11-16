import sys, time, threading
sys.path.insert(0, "/home/user/tut/alat")
from rekam import Rekaman, DSF
from durasi import beat
from cmketik import ketik_ke, keadaan, V
D = beat("T07")
T = {k: open(f"/home/user/tut/T07/{k}.html").read().rstrip("\n") for k in ["a", "b", "c", "d", "e"]}
open("/home/user/tut/nb/ular/index.html", "w").write("")
import subprocess, atexit, os
bg = subprocess.Popen(["/opt/pw-browsers/chromium-1243/chrome-linux64/chrome", "--app=data:text/html,<body style='margin:0;background:linear-gradient(135deg,%23334155,%231e293b)'></body>", "--user-data-dir=/tmp/claude-0/bgprof", "--window-position=0,0", "--window-size=1536,864", "--force-device-scale-factor=1.6667", "--no-first-run", "--test-type", "--disable-infobars", "--no-sandbox"], env=dict(os.environ, DISPLAY=":99"), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
atexit.register(bg.kill); time.sleep(3)
EW, PW, WH = 880, 656, 864
r = Rekaman("/home/user/tut/T07/rek", "http://localhost:8888/edit/ular/index.html?factory=Editor"); pg = r.pg
def jendela(page, left, width):
    cdp = page.context.new_cdp_session(page); wid = cdp.send("Browser.getWindowForTarget")["windowId"]
    cdp.send("Browser.setWindowBounds", {"windowId": wid, "bounds": {"left": left, "top": 0, "width": width, "height": WH}})
jendela(pg, 0, EW)
b2 = r.pw.chromium.launch(headless=False, args=[f"--window-size={PW},{WH}", f"--window-position={EW},0", f"--force-device-scale-factor={DSF}", "--disable-infobars", "--test-type", "--hide-crash-restore-bubble"], ignore_default_args=["--enable-automation"])
pv = b2.new_context(no_viewport=True).new_page(); pv.goto("file:///home/raka/game-ular/index.html"); jendela(pv, EW, PW)
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
def ketik(stage, dur):
    D_, p = keadaan(pg)
    cps = max(8, min(30, abs(len(T[stage]) - len(D_)) / max(1, dur)))
    _tl[0] = None; ikuti(); ok = ketik_ke(pg, T[stage], cps, ikuti=ikuti); assert keadaan(pg)[0] == T[stage], stage
AUTO = """() => { if (typeof ular === 'undefined') return null; const h=ular[0], m=makanan; let k=null;
 const ok=(dx,dy)=>!(dx===-arah.x&&dy===-arah.y)&&!ular.slice(0,-1).some(b=>b.x===h.x+dx&&b.y===h.y+dy)&&h.x+dx>=0&&h.x+dx<20&&h.y+dy>=0&&h.y+dy<20;
 const c=[]; if(m.x>h.x)c.push([1,0,'ArrowRight']); if(m.x<h.x)c.push([-1,0,'ArrowLeft']); if(m.y>h.y)c.push([0,1,'ArrowDown']); if(m.y<h.y)c.push([0,-1,'ArrowUp']);
 c.push([arah.x,arah.y,null],[0,1,'ArrowDown'],[0,-1,'ArrowUp'],[1,0,'ArrowRight'],[-1,0,'ArrowLeft']);
 for(const [dx,dy,kk] of c) if(ok(dx,dy)) return (dx===arah.x&&dy===arah.y)?null:kk; return null; }"""
def main_game(detik, ke_dinding=False):
    """pemain menekan tombol panah di jendela game"""
    t0 = time.time(); last = 0
    while time.time() - t0 < detik:
        k = pv.evaluate(AUTO)
        if k and time.time() - last > 0.1: pv.keyboard.press(k); last = time.time()
        time.sleep(0.04)
    if ke_dinding:
        for _ in range(60):
            h = pv.evaluate("[ular[0].x, ular[0].y, arah.x, arah.y]")
            if h[2] == 0: pv.keyboard.press("ArrowRight" if h[0] >= 10 else "ArrowLeft"); 
            time.sleep(0.15)
            if pv.evaluate("ular[0].x<=0||ular[0].x>=19"): break
        time.sleep(1.5)

r.gerak(400, 500, 0.01)
r.mulai(); time.sleep(0.5); r.kamera(None)
r.tanda("b03"); r.klik(xy=(300, 200)); time.sleep(0.3)
ketik("a", D[3] * 0.6); r.label("Ctrl+S untuk menyimpan, lalu refresh browser", 3.5)
simpan(1.5); kam_preview(1.6); time.sleep(2.5); r.kamera(None); r.tanda("b03_akhir")
r.tanda("b05"); hapus_baris("pena.fillRect(ular[0].x * kotak, ular[0].y * kotak, kotak - 2, kotak - 2);")
ke_baris("{x: 10, y: 10}"); ketik("b", D[5] * 0.5); simpan(1.5); kam_preview(1.6); time.sleep(2.5); r.kamera(None); r.tanda("b05_akhir")
r.tanda("b07"); ke_baris("kotak - 2);\n      }\n    }"); ketik("c", D[7] * 0.5); simpan(0.2); kam_preview(1.3); time.sleep(4.5); r.kamera(None); r.tanda("b07_akhir")
r.tanda("b09"); ke_baris("y: ular[0].y + arah.y};"); ketik("d", D[9] * 0.6); simpan(0.8); kam_preview(1.3)
r.tanda("b09_main"); main_game(5, ke_dinding=True); r.kamera(None); r.tanda("b09_akhir")
r.tanda("b11"); hapus_baris("      ular.pop();"); ke_baris("ular.unshift(kepala);"); ketik("e", D[11] * 0.5); simpan(0.8); kam_preview(1.3)
r.tanda("b11_main"); main_game(16); r.kamera(None); r.tanda("b11_akhir")
r.tanda("b13"); hapus_baris("        ular.pop();"); simpan(0.8); kam_preview(1.3); main_game(6); r.kamera(None); time.sleep(0.5)
ke_baris("} else {"); kam_edit_baris(1.9); time.sleep(0.3); pg.keyboard.press("Control+z"); time.sleep(0.8)
assert keadaan(pg)[0] == T["e"], "undo"
ke_baris("setInterval(langkah, 150"); kam_edit_baris(1.9); time.sleep(0.4)
for _ in range(3): pg.keyboard.press("Backspace"); time.sleep(0.2)
r.ketik("80", 6); time.sleep(0.4); simpan(0.8); kam_preview(1.3); r.tanda("b13_cepat"); main_game(7); r.kamera(None); r.tanda("b13_akhir")
time.sleep(0.5); b2.close(); r.selesai(); print("selesai", r.log["durasi"])
