"""Perekam seri Git: code-server (VS Code sungguhan) + panel graf commit + browser, di Xvfb :99 2560x1440.
Jendela diatur dengan CDP Browser.setWindowBounds (tanpa window manager)."""
import os, time, json, random, subprocess, atexit
os.environ["DISPLAY"] = ":99"
from playwright.sync_api import sync_playwright
W, H, DSF = 2560, 1440, 1.6667
CSS = lambda px: round(px / DSF)
RAW = "/home/user/git-seri/raw"

def reset_vs():
    subprocess.run(["/home/user/git-seri/rek/reset_vs.sh"])

class Jendela:
    def __init__(self, pw, url, x, y, w, h, prof, dsf=DSF):
        self.d = dsf; CSS = lambda px: round(px / dsf)
        subprocess.run(["rm", "-rf", prof]); os.makedirs(prof + "/Default", exist_ok=True)
        json.dump({"translate": {"enabled": False}, "translate_blocked_languages": ["id", "en"], "credentials_enable_service": False, "credentials_enable_autosignin": False, "profile": {"password_manager_enabled": False, "password_manager_leak_detection": False}}, open(prof + "/Default/Preferences", "w"))
        self.ctx = pw.chromium.launch_persistent_context(prof, headless=False, no_viewport=True,
            args=[f"--window-size={CSS(w)},{CSS(h)}", f"--window-position={CSS(x)},{CSS(y)}", f"--force-device-scale-factor={dsf}",
                  f"--app={url}", "--test-type", "--hide-crash-restore-bubble", "--disable-features=Translate,PasswordManagerOnboarding,PasswordLeakDetection", "--password-store=basic", "--no-first-run"],
            ignore_default_args=["--enable-automation"])
        time.sleep(3); self.pg = self.ctx.pages[0]
        self.cdp = self.ctx.new_cdp_session(self.pg)
        self.wid = self.cdp.send("Browser.getWindowForTarget")["windowId"]
    def letak(self, x, y, w, h):
        d = self.d; self.cdp.send("Browser.setWindowBounds", {"windowId": self.wid, "bounds": {"left": round(x / d), "top": round(y / d), "width": round(w / d), "height": round(h / d)}})
    def sembunyi(self): self.letak(W + 100, 0, 800, 600)

class GS:
    def __init__(self, folder, graf_repo=None, tempat=False, lebar_vs=1600, web=None, web_dsf=DSF):
        reset_vs()
        self.pw = sync_playwright().start(); self.lebar_vs = lebar_vs
        self.vs = Jendela(self.pw, f"http://127.0.0.1:8080/?folder={folder}", 0, 0, lebar_vs if graf_repo else W, H, "/tmp/gsprof_vs")
        self.pg = self.vs.pg
        self.graf = None
        if graf_repo: self.buka_graf(graf_repo, tempat)
        self.web = None
        if web: self.web = Jendela(self.pw, web, W + 100, 0, 1200, 900, "/tmp/gsprof_web", dsf=web_dsf)
        time.sleep(5); self.ff = None; self.t0 = time.time(); self.log = None
        self.pg.mouse.move(-10, -10)
        self.palet("Notifications: Toggle Do Not Disturb Mode"); self.tombol("Escape", 0.3)
    def buka_graf(self, repo, tempat=False, label=None):
        url = f"http://127.0.0.1:7070/?repo={repo}&tempat={1 if tempat else 0}&label={label or repo.split('/')[-1]}"
        if self.graf: self.graf.pg.goto(url); self.graf.letak(self.lebar_vs, 0, W - self.lebar_vs, H)
        else: self.graf = Jendela(self.pw, url, self.lebar_vs, 0, W - self.lebar_vs, H, "/tmp/gsprof_graf")
    def tata_letak(self, mode):
        """mode: 'vs+graf' | 'vs' | 'web' | 'vs+web'"""
        if mode == "vs+graf": self.vs.letak(0, 0, self.lebar_vs, H); self.graf.letak(self.lebar_vs, 0, W - self.lebar_vs, H)
        elif mode == "vs":
            self.vs.letak(0, 0, W, H)
            if self.graf: self.graf.sembunyi()
            if self.web: self.web.sembunyi()
        elif mode == "web":
            self.web.letak(0, 0, W, H)
        elif mode == "web+graf": self.web.letak(0, 0, self.lebar_vs, H); self.graf.letak(self.lebar_vs, 0, W - self.lebar_vs, H)
        time.sleep(1.2)
    # ---------------- rekam
    def mulai(self, nama):
        self.keluar = f"{RAW}/{nama}"; os.makedirs(RAW, exist_ok=True)
        subprocess.run("pkill -f 'x11grab' ; sleep 0.3", shell=True)
        if os.path.exists(self.keluar + ".mkv"): os.remove(self.keluar + ".mkv")
        self.log = {"src": [W, H], "tanda": []}
        self.ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "x11grab", "-draw_mouse", "0", "-framerate", "30",
            "-video_size", f"{W}x{H}", "-i", ":99", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "14", "-pix_fmt", "yuv420p",
            self.keluar + ".mkv"], stdin=subprocess.PIPE)
        atexit.register(lambda: self.ff and self.ff.poll() is None and self.ff.kill())
        time.sleep(0.6); self.t0 = time.time()
    def t(self): return round(time.time() - self.t0, 3)
    def tanda(self, n): self.log["tanda"].append([self.t(), n]); self.simpan_log(); print("tanda", n, self.t(), flush=True)
    def simpan_log(self):
        self.log["durasi"] = self.t(); json.dump(self.log, open(self.keluar + ".json", "w"), indent=1)
    def stop(self):
        time.sleep(0.6)
        if self.ff: self.ff.stdin.write(b"q"); self.ff.stdin.flush(); self.ff.wait(); self.ff = None
        self.simpan_log()
    def selesai(self):
        if self.ff: self.stop()
        for j in [self.vs, self.graf, self.web]:
            if j:
                try: j.ctx.close()
                except Exception: pass
        self.pw.stop()
    # ---------------- masukan
    def ketik(self, teks, cps=16, pg=None):
        pg = pg or self.pg
        for ch in teks:
            if ch == "\n": pg.keyboard.press("Enter")
            else: pg.keyboard.type(ch)
            time.sleep(1 / cps * random.uniform(0.5, 1.5) * (1.4 if ch in " ,." else 1))
    def tombol(self, k, jeda=0.4, pg=None): (pg or self.pg).keyboard.press(k); time.sleep(jeda)
    def palet(self, cmd):
        self.tombol("F1", 0.8); self.ketik(cmd, 45); time.sleep(0.9); self.tombol("Enter", 1.0)
    def panel_tampil(self):
        return self.pg.evaluate("(() => { const p=document.querySelector('.part.panel'); return !!(p && p.offsetHeight > 40); })()")
    def panel(self, tampil):
        if self.panel_tampil() != tampil: self.tombol("Control+j", 0.8)
    def terminal(self, i=0):
        self.panel(True)
        r = self.pg.evaluate("i => { const t=[...document.querySelectorAll('.terminal-wrapper')].filter(e=>e.offsetWidth)[i]; if(!t) return null; const b=t.getBoundingClientRect(); return [b.x+b.width/2, b.y+b.height/2]; }", i)
        if r: self.pg.mouse.click(r[0], r[1]); time.sleep(0.4); self.pg.mouse.move(-10, -10); time.sleep(0.3)
        else: self.palet("Terminal: Focus Terminal"); time.sleep(0.8)
    def perintah(self, cmd, cps=13, tunggu=1.2):
        self.ketik(cmd, cps); time.sleep(0.35); self.tombol("Enter", tunggu)
    def bersih(self): self.tombol("Control+l", 0.5)
    def buka(self, path):
        self.tombol("Control+p", 0.8); self.ketik(path, 30); time.sleep(0.9); self.tombol("Enter", 1.3)
        self.panel(False)  # editor penuh: tidak ada baris kode yang terpotong saat zoom
    def ke_baris(self, n, kolom=None):
        self.tombol("Control+g", 0.5); self.ketik(f"{n}" + (f":{kolom}" if kolom else ""), 20); self.tombol("Enter", 0.6)
    def simpan(self): self.tombol("Control+s", 0.8)
    def foto(self, f): subprocess.run(["import", "-window", "root", f]) if False else subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "x11grab", "-video_size", f"{W}x{H}", "-i", ":99", "-frames:v", "1", f])
    # ---------------- tata letak VS Code
    def seret(self, x1, y1, x2, y2):
        m = self.pg.mouse; m.move(x1, y1); time.sleep(0.2); m.down(); time.sleep(0.2)
        for i in range(1, 21): m.move(x1 + (x2 - x1) * i / 20, y1 + (y2 - y1) * i / 20); time.sleep(0.02)
        m.up(); time.sleep(0.5); m.move(-10, -10)
    def tinggi_panel(self, frac=0.5):
        r = self.pg.evaluate("(() => { const p=document.querySelector('.part.panel').getBoundingClientRect(); return [p.left + p.width/2, p.top]; })()")
        tot = self.pg.evaluate("window.innerHeight")
        self.seret(r[0], r[1] - 1, r[0], 34 + (tot - 34 - 22) * (1 - frac))
    def lebar_sidebar(self, px):
        r = self.pg.evaluate("(() => { const s=document.querySelector('.part.sidebar'); if(!s||!s.offsetWidth) return null; const b=s.getBoundingClientRect(); return [b.right, b.top + b.height/2]; })()")
        if r: self.seret(r[0], r[1], 48 + px, r[1])
    def sidebar(self, tampil):
        vis = self.pg.evaluate("(() => { const s=document.querySelector('.part.sidebar'); return !!(s && s.offsetWidth); })()")
        if vis != tampil: self.tombol("Control+b", 0.8)
    def tutup_editor(self): self.palet("View: Close All Editors")
