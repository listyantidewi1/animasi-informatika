import sys; sys.path.insert(0, "/home/user/vibe/rek")
from dt import *
import shutil
shutil.rmtree("/tmp/dtprofN", ignore_errors=True)
class DT2(DT):
    def __init__(self, profil="/tmp/dtprofN"):
        self.pw = sync_playwright().start()
        os.makedirs(profil + "/Default", exist_ok=True)
        json.dump({"translate": {"enabled": False}}, open(profil + "/Default/Preferences", "w"))
        self.ctx = self.pw.chromium.launch_persistent_context(profil, headless=False, no_viewport=True, env=dict(os.environ, DISPLAY=":99"),
            args=[f"--window-size={round(W/DSF)},{round(H/DSF)}", "--window-position=0,0", f"--force-device-scale-factor={DSF}",
                  "--test-type", "--hide-crash-restore-bubble", "--disable-features=Translate,TranslateUI", "--lang=id-ID"], locale="id-ID",
            ignore_default_args=["--enable-automation"])
        time.sleep(2); self.pg = self.ctx.pages[0]; self.ff = None
d = DT2(); time.sleep(1)
foto("/tmp/wrap/d1.png")
kunci("ctrl+l"); ketik("localhost:5173", 80); kunci("Return"); time.sleep(2.5); foto("/tmp/wrap/d2.png")
kunci("F12"); time.sleep(3); klik(1711,166); time.sleep(2.5); foto("/tmp/wrap/d4.png")
d.tutup()
