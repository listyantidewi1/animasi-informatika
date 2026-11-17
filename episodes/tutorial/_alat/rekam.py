"""Perekam layar sungguhan: Chromium (Xvfb :99, 2560x1440) + ffmpeg x11grab.
Mencatat jejak kamera (fokus) dan label ke JSON untuk pascaproduksi."""
import os, time, json, random, subprocess, math
os.environ["DISPLAY"] = ":99"
from playwright.sync_api import sync_playwright

W, H, DSF = 2560, 1440, 1.6667
CURSOR_JS = r"""
(() => {
  const mk = () => {
    if (document.getElementById('__kursor')) return;
    const d = document.createElement('div'); d.id='__kursor';
    d.innerHTML = '<svg width="26" height="38" viewBox="0 0 26 38"><path d="M2 2 L2 30 L9 23.5 L13.8 35 L18.6 33 L13.9 21.8 L23 21.8 Z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';
    Object.assign(d.style,{position:'fixed',left:'-100px',top:'-100px',zIndex:2147483647,pointerEvents:'none',transform:'translate(-2px,-2px)',filter:'drop-shadow(0 2px 3px rgba(0,0,0,.35))'});
    const r = document.createElement('div'); r.id='__riak';
    Object.assign(r.style,{position:'fixed',width:'44px',height:'44px',marginLeft:'-22px',marginTop:'-22px',borderRadius:'50%',background:'rgba(255,170,0,.45)',zIndex:2147483646,pointerEvents:'none',transform:'scale(0)',opacity:0,transition:'transform .35s ease-out, opacity .45s ease-out'});
    document.documentElement.appendChild(r); document.documentElement.appendChild(d);
    addEventListener('mousemove', e => { d.style.left=e.clientX+'px'; d.style.top=e.clientY+'px'; }, true);
    addEventListener('mousedown', e => { r.style.transition='none'; r.style.left=e.clientX+'px'; r.style.top=e.clientY+'px'; r.style.transform='scale(.3)'; r.style.opacity=1; r.offsetWidth; r.style.transition='transform .35s ease-out, opacity .5s ease-out'; r.style.transform='scale(1.2)'; r.style.opacity=0; }, true);
  };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', mk); else mk();
})();
"""

class Rekaman:
    def __init__(self, keluar, url=None):
        self.keluar = keluar; self.log = {"src": [W, H], "kamera": [], "label": [], "tanda": []}
        self.pw = sync_playwright().start()
        self.b = self.pw.chromium.launch(headless=False, args=[f"--window-size={round(W/DSF)},{round(H/DSF)}", "--window-position=0,0",
            f"--force-device-scale-factor={DSF}", "--disable-infobars", "--test-type", "--hide-crash-restore-bubble"],
            ignore_default_args=["--enable-automation"])
        self.ctx = self.b.new_context(no_viewport=True); self.ctx.add_init_script(CURSOR_JS)
        self.pg = self.ctx.new_page(); self.mx, self.my = 700, 500
        if url: self.pg.goto(url)

    # --- waktu & rekaman ---
    def mulai(self):
        import atexit
        if os.path.exists(self.keluar + ".mkv"): os.remove(self.keluar + ".mkv")
        self.ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "x11grab", "-draw_mouse", "0", "-framerate", "30",
            "-video_size", f"{W}x{H}", "-i", ":99", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "12", "-pix_fmt", "yuv420p",
            self.keluar + ".mkv"], stdin=subprocess.PIPE)
        atexit.register(lambda: self.ff.poll() is None and self.ff.kill())
        time.sleep(0.4); self.t0 = time.time()
    def t(self): return round(time.time() - self.t0, 3)
    def selesai(self):
        time.sleep(0.3); self.ff.stdin.write(b"q"); self.ff.stdin.flush(); self.ff.wait()
        self.log["durasi"] = self.t(); json.dump(self.log, open(self.keluar + ".json", "w"), indent=1)
        self.b.close(); self.pw.stop()
    def tunggu(self, s): time.sleep(s)
    def tanda(self, nama): self.log["tanda"].append([self.t(), nama])

    # --- koordinat ---
    def offset(self):
        o = self.pg.evaluate("[window.outerHeight-window.innerHeight, window.outerWidth-window.innerWidth]")
        return o[0]
    def layar(self, x, y, w, h):
        oy = self.offset()
        return [x * DSF, (y + oy) * DSF, w * DSF, h * DSF]
    def kotak(self, sel):
        bb = self.pg.locator(sel).first.bounding_box()
        return [bb["x"], bb["y"], bb["width"], bb["height"]]

    # --- kamera: fokus ke kotak (css px), zoom otomatis atau tetap ---
    def kamera(self, rect=None, zoom=None, pad=40):
        if rect is None: self.log["kamera"].append([self.t(), None]); return
        x, y, w, h = rect; x -= pad; y -= pad; w += 2 * pad; h += 2 * pad
        sx, sy, sw, sh = self.layar(x, y, w, h)
        z = zoom or max(1.0, min(2.6, W / sw, H / sh))
        self.log["kamera"].append([self.t(), [sx + sw / 2, sy + sh / 2, z]])
    def label(self, teks, dur=None, posisi="bawah"):
        self.log["label"].append([self.t(), teks, dur, posisi])

    # --- mouse ---
    def gerak(self, x, y, dur=0.6):
        n = max(8, int(dur * 60)); x0, y0 = self.mx, self.my
        for i in range(1, n + 1):
            k = i / n; e = k * k * (3 - 2 * k)
            self.pg.mouse.move(x0 + (x - x0) * e, y0 + (y - y0) * e); time.sleep(dur / n)
        self.mx, self.my = x, y
    def klik(self, sel=None, xy=None, dur=0.6):
        if sel:
            x, y, w, h = self.kotak(sel); xy = (x + w / 2, y + h / 2)
        self.gerak(*xy, dur=dur); time.sleep(0.12); self.pg.mouse.down(); time.sleep(0.07); self.pg.mouse.up(); time.sleep(0.2)

    # --- ketik ---
    def baris_aktif(self):
        return self.pg.evaluate("""(() => { const s=getSelection(); let n=s&&s.anchorNode; if(!n) return null; if(n.nodeType==3) n=n.parentElement; const l=n.closest('.cm-line'); if(!l) return null; const b=l.getBoundingClientRect(); return {x:b.x,y:b.y,width:b.width,height:b.height}; })()""")
    def ketik(self, teks, cps=14):
        for ch in teks:
            self.pg.keyboard.type(ch)
            d = 1 / cps * random.uniform(0.55, 1.5)
            if ch in " (),:": d *= 1.3
            time.sleep(d)
    def ketik_kode(self, kode, cps=14, ikuti=None):
        """Ketik kode baris per baris di editor CodeMirror; indentasi disesuaikan dengan isi baris aktif."""
        baris = kode.strip("\n").split("\n")
        for i, b in enumerate(baris):
            if i:
                self.pg.keyboard.press("Enter"); time.sleep(0.12)
            isi = b.lstrip(" "); mau = len(b) - len(isi)
            ada = self.pg.evaluate("(() => { const l = (() => { const s=getSelection(); let n=s&&s.anchorNode; if(!n) return null; if(n.nodeType==3) n=n.parentElement; return n.closest('.cm-line'); })(); return l ? l.textContent.length - l.textContent.trimStart().length : 0 })()")
            while ada > mau:
                self.pg.keyboard.press("Backspace"); time.sleep(0.08)
                ada = self.pg.evaluate("(() => { const l = (() => { const s=getSelection(); let n=s&&s.anchorNode; if(!n) return null; if(n.nodeType==3) n=n.parentElement; return n.closest('.cm-line'); })(); return l ? l.textContent.length - l.textContent.trimStart().length : 0 })()")
            if ada < mau: self.ketik(" " * (mau - ada), cps * 3)
            if ikuti: ikuti()
            self.ketik(isi, cps)
            if isi.strip() == "": pass
            time.sleep(0.15 + (0.35 if isi.endswith(":") else 0))
