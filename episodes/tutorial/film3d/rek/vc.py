"""Perekam VS Code sungguhan (code-server) + asisten AI di terminal. Xvfb :99 2560x1440."""
import os, time, json, random, subprocess
os.environ["DISPLAY"] = ":99"
from playwright.sync_api import sync_playwright
W, H, DSF = 2560, 1440, 1.6667
STOP = "/tmp/vc_stop"
class VC:
    def __init__(self, keluar, folder="/home/user/proyek/paket-terakhir"):
        self.keluar = keluar; self.log = {"src": [W, H], "kamera": [], "label": [], "tanda": []}
        self.pw = sync_playwright().start()
        self.ctx = self.pw.chromium.launch_persistent_context("/tmp/vcprof", headless=False, no_viewport=True,
            args=[f"--window-size={round(W/DSF)},{round(H/DSF)}", "--window-position=0,0", f"--force-device-scale-factor={DSF}",
                  f"--app=http://127.0.0.1:8080/?folder={folder}", "--test-type", "--hide-crash-restore-bubble"],
            ignore_default_args=["--enable-automation"])
        time.sleep(7); self.pg = self.ctx.pages[0]; self.ff = None; self.t0 = time.time()
    def mulai(self, keluar=None):
        import atexit
        if keluar: self.keluar = keluar; self.log = {"src": [W, H], "kamera": [], "label": [], "tanda": []}
        if os.path.exists(self.keluar + ".mkv"): os.remove(self.keluar + ".mkv")
        self.ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "x11grab", "-draw_mouse", "1", "-framerate", "30",
            "-video_size", f"{W}x{H}", "-i", ":99", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "14", "-pix_fmt", "yuv420p",
            self.keluar + ".mkv"], stdin=subprocess.PIPE)
        atexit.register(lambda: self.ff and self.ff.poll() is None and self.ff.kill())
        time.sleep(0.5); self.t0 = time.time()
    def t(self): return round(time.time() - self.t0, 3)
    def tanda(self, n): self.log["tanda"].append([self.t(), n]); self.simpan_log(); print("tanda", n, self.t(), flush=True)
    def simpan_log(self):
        self.log["durasi"] = self.t(); json.dump(self.log, open(self.keluar + ".json", "w"), indent=1)
    def stop(self):
        time.sleep(0.5)
        if self.ff: self.ff.stdin.write(b"q"); self.ff.stdin.flush(); self.ff.wait(); self.ff = None
        self.simpan_log()
    def selesai(self):
        self.stop(); self.ctx.close(); self.pw.stop()
    def kamera(self, rect=None, zoom=None):
        if rect is None: self.log["kamera"].append([self.t(), None]); return
        x, y, w, h = rect; z = zoom or max(1.0, min(2.4, W / (w * DSF), H / (h * DSF)))
        self.log["kamera"].append([self.t(), [(x + w / 2) * DSF, (y + h / 2) * DSF, z]])
    def label(self, teks, dur=None, posisi="atas"): self.log["label"].append([self.t(), teks, dur, posisi])
    def tunggu(self, s): time.sleep(s)
    def ketik(self, teks, cps=16):
        for ch in teks:
            if ch == "\n": self.pg.keyboard.type("\\"); self.pg.keyboard.press("Enter")
            else: self.pg.keyboard.type(ch)
            time.sleep(1 / cps * random.uniform(0.5, 1.5) * (1.4 if ch in " ,." else 1))
    def tombol(self, k, jeda=0.4): self.pg.keyboard.press(k); time.sleep(jeda)
    # terminal
    def terminal(self):
        self.tombol("Control+Backquote", 1.5)
    def perintah(self, cmd, cps=14, tunggu=1.0):
        self.ketik(cmd, cps); time.sleep(0.3); self.tombol("Enter", tunggu)
    # AI: ketik prompt, Enter, tunggu hook Stop
    def prompt(self, teks, cps=40, batas=900):
        if os.path.exists(STOP): os.remove(STOP)
        self.ketik(teks, cps); time.sleep(0.6); self.tombol("Enter", 1)
        t = time.time()
        while not os.path.exists(STOP) and time.time() - t < batas: time.sleep(0.5)
        time.sleep(1.5); return time.time() - t
    def buka(self, path):
        self.tombol("Control+p", 0.8); self.ketik(path, 30); time.sleep(0.8); self.tombol("Enter", 1.2)
    def foto(self, f): self.pg.screenshot(path=f)

    def ketik_editor(self, teks, cps=40):
        for ch in teks:
            if ch == "\n": self.pg.keyboard.press("Enter")
            else: self.pg.keyboard.type(ch)
            time.sleep(1 / cps * random.uniform(0.5, 1.5))
    def palet(self, cmd):
        self.tombol("F1", 0.8); self.ketik(cmd, 40); time.sleep(0.8); self.tombol("Enter", 1.0)
    def berkas_baru(self, nama):
        # buat berkas lewat terminal lalu buka di editor (seperti klik New File)
        self.palet("File: New File..."); time.sleep(0.5); self.ketik(nama, 25); time.sleep(0.5); self.tombol("Enter", 0.8)
        time.sleep(0.5); self.tombol("Enter", 1.5)

    def seret(self, x1, y, x2):
        self.pg.mouse.move(x1, y); time.sleep(0.2); self.pg.mouse.down(); time.sleep(0.2)
        for i in range(1, 21): self.pg.mouse.move(x1 + (x2 - x1) * i / 20, y); time.sleep(0.02)
        self.pg.mouse.up(); time.sleep(0.5); self.pg.mouse.move(-10, -10)
    def sash(self):
        return self.pg.evaluate("""[...document.querySelectorAll('.monaco-sash.vertical')].map(e=>{const b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2,b.height]}).filter(s=>s[2]>300)""")
    def tata(self, sidebar=220, panel=760):
        r = self.pg.evaluate("(() => { const s=document.querySelector('.part.sidebar').getBoundingClientRect(); return s.right; })()")
        self.seret(r, 500, 48 + sidebar)
        r = self.pg.evaluate("(() => { const p=document.querySelector('.part.panel').getBoundingClientRect(); return [p.left, p.top + p.height/2]; })()")
        self.seret(r[0] - 1, r[1], 1536 - panel)

    def fokus_claude(self):
        # terminal pertama (claude) lewat dropdown terminal
        self.palet("Terminal: Focus Terminal"); time.sleep(0.5)
        self.pg.keyboard.press("Alt+1") if False else None
    def bash(self, cmd, tunggu=8):
        self.ketik("!", 10); time.sleep(0.4); self.ketik(cmd, 30); time.sleep(0.4); self.tombol("Enter", tunggu)

    def nama_terminal(self):
        return self.pg.evaluate("(() => { const s=document.querySelector('select[aria-label=\\'Open Terminals.\\']'); return s ? s.options[s.selectedIndex].text : '' })()")
    def pilih_terminal(self, i):
        self.palet("Terminal: Focus Terminal"); time.sleep(0.5)
        for k in range(5):
            nm = self.nama_terminal()
            if nm.startswith(str(i + 1) + ":"): return nm
            self.tombol("F1", 0.7); self.ketik("Terminal: Switch Active Terminal", 50); time.sleep(0.6); self.tombol("Enter", 0.8)
            self.ketik(str(i + 1) + ": ", 20); time.sleep(0.5); self.tombol("Enter", 0.8)
            self.palet("Terminal: Focus Terminal"); time.sleep(0.4)
        raise RuntimeError("terminal " + nm)
