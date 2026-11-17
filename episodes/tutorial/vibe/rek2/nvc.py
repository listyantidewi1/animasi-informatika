import sys; sys.path.insert(0, "/home/user/vibe/rek")
import vc, time, shutil, os
from vc import VC
from playwright.sync_api import sync_playwright
os.environ["DISPLAY"] = ":99"
class NVC(VC):
    def __init__(self, keluar, folder=None, prof="/tmp/nprof"):
        self.keluar = keluar; self.log = {"src": [vc.W, vc.H], "kamera": [], "label": [], "tanda": []}
        self.pw = sync_playwright().start()
        shutil.rmtree(prof, ignore_errors=True)
        url = "http://127.0.0.1:8082/" + (f"?folder={folder}" if folder else "?ew=true")
        self.ctx = self.pw.chromium.launch_persistent_context(prof, headless=False, no_viewport=True,
            args=[f"--window-size={round(vc.W/vc.DSF)},{round(vc.H/vc.DSF)}", "--window-position=0,0", f"--force-device-scale-factor={vc.DSF}",
                  f"--app={url}", "--test-type", "--hide-crash-restore-bubble"],
            ignore_default_args=["--enable-automation"])
        time.sleep(9); self.pg = self.ctx.pages[0]; self.ff = None; self.t0 = time.time()
    def mulai(self, keluar=None):
        import subprocess, atexit
        if keluar: self.keluar = keluar; self.log = {"src": [vc.W, vc.H], "kamera": [], "label": [], "tanda": []}
        self.ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "x11grab", "-draw_mouse", "1", "-framerate", "30",
            "-video_size", f"{vc.W}x{vc.H}", "-i", ":99", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "14", "-pix_fmt", "yuv420p",
            self.keluar + ".mkv"], stdin=subprocess.PIPE)
        atexit.register(lambda: self.ff and self.ff.poll() is None and self.ff.kill())
        time.sleep(0.5); self.t0 = time.time()
    def klik(self, loc, jeda=0.8):
        b = loc.bounding_box(); x, y = b["x"] + b["width"] / 2, b["y"] + b["height"] / 2
        self.pg.mouse.move(x, y, steps=12); time.sleep(0.35); self.pg.mouse.click(x, y); time.sleep(jeda)
    def arahkan(self, loc, jeda=0.6):
        b = loc.bounding_box(); self.pg.mouse.move(b["x"] + b["width"] / 2, b["y"] + b["height"] / 2, steps=12); time.sleep(jeda)
