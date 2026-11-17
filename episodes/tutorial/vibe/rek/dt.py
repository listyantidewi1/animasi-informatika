"""Jendela Chromium biasa + DevTools di Xvfb :99 (untuk rekaman tab Application/Network)."""
import os, time, subprocess, json
from playwright.sync_api import sync_playwright
W, H, DSF = 2560, 1440, 1.6667
def xdo(*a): subprocess.run(["xdotool", *a], env=dict(os.environ, DISPLAY=":99"))
def kunci(*k):
    for x in k: xdo("key", "--clearmodifiers", x); time.sleep(0.25)
def ketik(t, d=60): xdo("type", "--delay", str(d), t)
def klik(x, y):  # koordinat piksel layar (2560x1440)
    xdo("mousemove", str(int(x)), str(int(y))); time.sleep(0.15); xdo("click", "1"); time.sleep(0.3)
def foto(f): subprocess.run(["ffmpeg","-loglevel","error","-y","-f","x11grab","-video_size",f"{W}x{H}","-i",":99","-frames:v","1",f])
class DT:
    def __init__(self, url, profil="/tmp/dtprof"):
        self.pw = sync_playwright().start()
        os.makedirs(profil + "/Default", exist_ok=True)
        if not os.path.exists(profil + "/Default/Preferences"):
            json.dump({"translate": {"enabled": False}, "translate_blocked_languages": ["id", "en"]}, open(profil + "/Default/Preferences", "w"))
        self.ctx = self.pw.chromium.launch_persistent_context(profil, headless=False, no_viewport=True, env=dict(os.environ, DISPLAY=":99"),
            args=[f"--window-size={round(W/DSF)},{round(H/DSF)}", "--window-position=0,0", f"--force-device-scale-factor={DSF}",
                  "--auto-open-devtools-for-tabs", "--test-type", "--hide-crash-restore-bubble", "--disable-features=Translate,TranslateUI", "--lang=id-ID"], locale="id-ID",
            ignore_default_args=["--enable-automation"])
        time.sleep(2); self.pg = self.ctx.pages[0]; self.pg.goto(url); time.sleep(3)
        self.ff = None
    def mulai(self, keluar):
        self.keluar = keluar; self.log = {"src": [W, H], "kamera": [], "label": [], "tanda": []}
        self.ff = subprocess.Popen(["ffmpeg","-loglevel","error","-y","-f","x11grab","-draw_mouse","1","-framerate","30","-video_size",f"{W}x{H}","-i",":99",
            "-c:v","libx264","-preset","ultrafast","-crf","16","-pix_fmt","yuv420p",keluar+".mkv"], stdin=subprocess.PIPE)
        time.sleep(0.5); self.t0 = time.time()
    def tanda(self, n): self.log["tanda"].append([round(time.time()-self.t0,3), n]); print("dt", n, flush=True)
    def stop(self):
        time.sleep(0.4); self.ff.stdin.write(b"q"); self.ff.stdin.flush(); self.ff.wait()
        self.log["durasi"] = round(time.time()-self.t0,3); json.dump(self.log, open(self.keluar+".json","w"), indent=1)
    def tutup(self): self.ctx.close(); self.pw.stop()

    def panel(self, nama):  # buka panel DevTools lewat Command Menu
        klik(2200, 1300); kunci("ctrl+shift+p"); time.sleep(0.6); ketik("Show " + nama, 50); time.sleep(0.6); kunci("Return"); time.sleep(1)
