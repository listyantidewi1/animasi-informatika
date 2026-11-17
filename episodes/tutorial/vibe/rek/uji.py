import os, time
os.environ["DISPLAY"]=":99"
from playwright.sync_api import sync_playwright
W,H,DSF=2560,1440,1.6667
with sync_playwright() as p:
    ctx=p.chromium.launch_persistent_context("/tmp/vcprof",headless=False,no_viewport=True,args=[f"--window-size={round(W/DSF)},{round(H/DSF)}","--window-position=0,0",f"--force-device-scale-factor={DSF}","--app=http://127.0.0.1:8080/?folder=/home/user/proyek/patungan","--test-type"],ignore_default_args=["--enable-automation"])
    time.sleep(8)
    pg=ctx.pages[0]
    print(pg.url, pg.viewport_size)
    pg.screenshot(path="/tmp/uji1.png")
    ctx.close()
