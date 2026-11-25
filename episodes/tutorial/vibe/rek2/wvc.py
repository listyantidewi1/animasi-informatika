import sys; sys.path.insert(0, "/home/user/vibe/rek")
import vc, time, shutil
from vc import VC
from playwright.sync_api import sync_playwright
import os
os.environ["DISPLAY"] = ":99"
FOLDER = "/tmp/wrap/patungan"
class WVC(VC):
    def __init__(self, keluar):
        self.keluar = keluar; self.log = {"src": [vc.W, vc.H], "kamera": [], "label": [], "tanda": []}
        self.pw = sync_playwright().start()
        shutil.rmtree("/tmp/wprof", ignore_errors=True)
        self.ctx = self.pw.chromium.launch_persistent_context("/tmp/wprof", headless=False, no_viewport=True,
            args=[f"--window-size={round(vc.W/vc.DSF)},{round(vc.H/vc.DSF)}", "--window-position=0,0", f"--force-device-scale-factor={vc.DSF}",
                  f"--app=http://127.0.0.1:8081/?folder={FOLDER}", "--test-type", "--hide-crash-restore-bubble"],
            ignore_default_args=["--enable-automation"])
        time.sleep(9); self.pg = self.ctx.pages[0]; self.ff = None; self.t0 = time.time()
    def tata_editor(self, tinggi_css=440):
        # panel terminal di bawah; editor setinggi tinggi_css
        p = self.pg.evaluate("(() => { const p=document.querySelector('.part.panel'); if(!p) return null; const b=p.getBoundingClientRect(); return [b.left+b.width/2, b.top]; })()")
        if p:
            x, y = p; self.pg.mouse.move(x, y - 1); time.sleep(0.2); self.pg.mouse.down(); time.sleep(0.2)
            for i in range(1, 21): self.pg.mouse.move(x, y + (35 + tinggi_css - y) * i / 20); time.sleep(0.02)
            self.pg.mouse.up(); time.sleep(0.5); self.pg.mouse.move(-10, -10)
    def gulir_ke(self, baris_atas, cps=14):
        """gulir halus dengan Ctrl+Down/Up sampai baris_atas berada di atas (tanpa popup)"""
        sekarang = self.pg.evaluate("(() => { const n=[...document.querySelectorAll('.margin-view-overlays .line-numbers')].map(e=>parseInt(e.textContent)).filter(x=>!isNaN(x)); return n.length?Math.min(...n):1; })()")
        k = "Control+ArrowDown" if baris_atas > sekarang else "Control+ArrowUp"
        for _ in range(abs(baris_atas - sekarang)): self.pg.keyboard.press(k); time.sleep(1 / cps)
