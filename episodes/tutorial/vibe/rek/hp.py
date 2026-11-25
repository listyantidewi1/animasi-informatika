"""Perekam pratinjau HP: Chromium --app di Xvfb :98 (412x915 CSS, DSF 3)."""
import os, time, json, subprocess, random
from playwright.sync_api import sync_playwright
PW, PH, PD = 412, 916, 3
TAP_JS = r"""
(() => { const mk = () => { if (document.getElementById('__tap')) return;
 const r = document.createElement('div'); r.id='__tap';
 Object.assign(r.style,{position:'fixed',width:'54px',height:'54px',marginLeft:'-27px',marginTop:'-27px',borderRadius:'50%',background:'rgba(120,120,120,.35)',border:'2px solid rgba(255,255,255,.7)',zIndex:2147483646,pointerEvents:'none',transform:'scale(0)',opacity:0});
 document.documentElement.appendChild(r);
 addEventListener('mousedown', e => { r.style.transition='none'; r.style.left=e.clientX+'px'; r.style.top=e.clientY+'px'; r.style.transform='scale(.6)'; r.style.opacity=1; r.offsetWidth; r.style.transition='transform .4s ease-out, opacity .55s ease-out'; r.style.transform='scale(1.25)'; r.style.opacity=0; }, true);
 }; if (document.readyState === 'loading') addEventListener('DOMContentLoaded', mk); else mk(); })();
"""
class HP:
    def __init__(self, url, profil="/tmp/hpprof", lebar=PW):
        self.pw = sync_playwright().start(); self.lebar = lebar
        os.makedirs(profil + "/Default", exist_ok=True)
        json.dump({"translate": {"enabled": False}, "translate_blocked_languages": ["id", "en"], "intl": {"accept_languages": "id,en"}}, open(profil + "/Default/Preferences", "w"))
        env = dict(os.environ, DISPLAY=":98")
        self.ctx = self.pw.chromium.launch_persistent_context(profil, headless=False, no_viewport=True, env=env, locale="id-ID",
            args=[f"--window-size={lebar},{PH}", "--window-position=0,0", f"--force-device-scale-factor={PD}", f"--app={url}", "--test-type",
                  "--hide-crash-restore-bubble", "--disable-infobars", "--lang=id-ID", "--disable-features=Translate,TranslateUI"], ignore_default_args=["--enable-automation"])
        self.ctx.add_init_script(TAP_JS)
        time.sleep(3); self.pg = self.ctx.pages[0]; self.pg.evaluate(TAP_JS); self.ff = None; self.log = None
    def mulai(self, keluar):
        self.keluar = keluar; self.log = {"src": [self.lebar * PD, PH * PD], "kamera": [], "label": [], "tanda": []}
        self.ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "x11grab", "-draw_mouse", "0", "-framerate", "30",
            "-video_size", f"{self.lebar*PD}x{PH*PD}", "-i", ":98", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "16", "-pix_fmt", "yuv420p", keluar + ".mkv"], stdin=subprocess.PIPE)
        time.sleep(0.5); self.t0 = time.time()
    def t(self): return round(time.time() - self.t0, 3)
    def tanda(self, n): self.log["tanda"].append([self.t(), n]); print("hp", n, self.t(), flush=True)
    def stop(self):
        time.sleep(0.4); self.ff.stdin.write(b"q"); self.ff.stdin.flush(); self.ff.wait(); self.ff = None
        self.log["durasi"] = self.t(); json.dump(self.log, open(self.keluar + ".json", "w"), indent=1)
    def tutup(self): self.ctx.close(); self.pw.stop()
    def tunggu(self, s): time.sleep(s)
    def tap(self, sel, jeda=0.5):
        b = self.pg.locator(sel).first; b.scroll_into_view_if_needed(); bb = b.bounding_box()
        if bb["y"] + bb["height"] > PH - 110 and not sel.startswith(".bar-bawah"):
            self.gulir(bb["y"] - PH / 2, 10); time.sleep(0.3); bb = b.bounding_box()
        x, y = bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2
        self.pg.mouse.move(x, y); time.sleep(0.15); self.pg.mouse.down(); time.sleep(0.08); self.pg.mouse.up(); time.sleep(0.05); self.pg.mouse.move(self.lebar - 2, PH - 2); time.sleep(jeda)
    def ketik(self, teks, cps=9):
        for ch in teks: self.pg.keyboard.type(ch); time.sleep(1 / cps * random.uniform(0.6, 1.4))
    def isi(self, sel, teks, cps=9): self.tap(sel, 0.3); self.ketik(teks, cps); time.sleep(0.3)
    def foto(self, f): self.pg.screenshot(path=f)
    def gulir(self, dy, langkah=12):
        for i in range(langkah): self.pg.mouse.wheel(0, dy / langkah); time.sleep(0.03)
