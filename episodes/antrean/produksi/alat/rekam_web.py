"""Perekam browser sungguhan + DevTools (Network) di Xvfb 2560x1440, format log sama dengan rekam_vs (untuk pasca.py).
Browser (jendela biasa dengan bilah alamat) di atas, DevTools (frontend remote) di bawah."""
import os, time, json, subprocess, shutil, urllib.request, atexit
os.environ.setdefault("DISPLAY", ":99")
from playwright.sync_api import sync_playwright
W, H, DSF = 2560, 1440, 1.6667
CW, CH = round(W / DSF), round(H / DSF)
class Web:
    def __init__(self, keluar, url, devtools=True, tinggi_atas=None, panel="network", port=9333, lebar=None, args=()):
        self.keluar = keluar; self.log = {"src": [W, H], "kamera": [], "label": [], "tanda": []}
        self.pw = sync_playwright().start(); ha = tinggi_atas or (CH // 2 + 40 if devtools else CH)
        for d in ("/tmp/claude-0/prof_web", "/tmp/claude-0/prof_dt"): shutil.rmtree(d, ignore_errors=True)
        os.makedirs("/tmp/claude-0/prof_web/Default", exist_ok=True)
        json.dump({"translate": {"enabled": False}, "translate_blocked_languages": ["id", "en"],
                   "credentials_enable_service": False, "profile": {"password_manager_enabled": False, "password_manager_leak_detection": False}}, open("/tmp/claude-0/prof_web/Default/Preferences", "w"))
        self.ctx = self.pw.chromium.launch_persistent_context("/tmp/claude-0/prof_web", headless=False, no_viewport=True, timezone_id="Asia/Jakarta", locale="id-ID",
            args=[f"--remote-debugging-port={port}", "--remote-allow-origins=*", f"--window-size={lebar or CW},{ha}", "--window-position=0,0",
                  f"--force-device-scale-factor={DSF}", "--test-type", "--hide-crash-restore-bubble", "--disable-features=Translate,TranslateUI,PasswordManagerOnboarding,PasswordLeakDetection", "--no-first-run", *args],
            ignore_default_args=["--enable-automation"])
        time.sleep(1); self.pg = self.ctx.pages[0]; self.pg.goto(url); time.sleep(1)
        self.dt = None
        if devtools:
            tl = json.load(urllib.request.urlopen(f"http://localhost:{port}/json"))
            pid = [x for x in tl if x["type"] == "page"][0]["id"]
            u = f"http://localhost:{port}/devtools/inspector.html?ws=localhost:{port}/devtools/page/{pid}&panel={panel}"
            self.dctx = self.pw.chromium.launch_persistent_context("/tmp/claude-0/prof_dt", headless=False, no_viewport=True,
                args=[f"--app={u}", f"--window-size={CW},{CH - ha}", f"--window-position=0,{ha}", f"--force-device-scale-factor={DSF}", "--test-type"],
                ignore_default_args=["--enable-automation"])
            time.sleep(2); self.dt = self.dctx.pages[0]
            try: self.dt.locator('[aria-label="Toggle screencast"]').first.click(timeout=4000); time.sleep(1)
            except Exception as e: print("screencast", e)
        self.atas = ha
    def mulai(self):
        self.ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "x11grab", "-draw_mouse", "1", "-framerate", "30", "-video_size", f"{W}x{H}", "-i", os.environ["DISPLAY"],
            "-c:v", "libx264", "-preset", "ultrafast", "-crf", "14", "-pix_fmt", "yuv420p", self.keluar + ".mkv"], stdin=subprocess.PIPE)
        atexit.register(lambda: self.ff.poll() is None and self.ff.kill()); time.sleep(0.5); self.t0 = time.time()
    def t(self): return round(time.time() - self.t0, 3)
    def tanda(self, n): self.log["tanda"].append([self.t(), n]); print(f"[{self.t():7.2f}] {n}", flush=True)
    def label(self, teks, dur=3.0, posisi="atas"): self.log["label"].append([self.t(), teks, dur, posisi])
    def kamera(self, rect=None, zoom=None, pad=20):
        """rect dalam css px layar (x, y, w, h)."""
        if rect is None: self.log["kamera"].append([self.t(), None]); return
        x, y, w, h = rect; x -= pad; y -= pad; w += 2 * pad; h += 2 * pad
        sx, sy, sw, sh = x * DSF, y * DSF, w * DSF, h * DSF; z = zoom or max(1.0, min(2.4, W / sw, H / sh))
        self.log["kamera"].append([self.t(), [sx + sw / 2, sy + sh / 2, z]])
    def kamera_atas(self, zoom=None): self.kamera([0, 0, CW, self.atas], zoom)
    def kamera_bawah(self, zoom=None): self.kamera([0, self.atas, CW, CH - self.atas], zoom)
    def selesai(self):
        time.sleep(0.4); self.ff.stdin.write(b"q"); self.ff.stdin.flush(); self.ff.wait()
        self.log["durasi"] = self.t(); json.dump(self.log, open(self.keluar + ".json", "w"), indent=1)
        self.ctx.close(); self.pw.stop()
