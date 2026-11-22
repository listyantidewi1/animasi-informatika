import os, time, json, subprocess, shutil
os.environ["DISPLAY"] = ":99"
from playwright.sync_api import sync_playwright
OUT = "/home/user/antre/A00/demo"
subprocess.run("""psql -q -h localhost -U postgres -d siantre_demo -c "TRUNCATE tickets, ticket_events RESTART IDENTITY CASCADE" """, shell=True)
for s in (1, 2, 1):
    subprocess.run(f"""curl -s -X POST localhost:3001/api/tiket -H 'content-type: application/json' -d '{{"service_id":{s}}}' >/dev/null""", shell=True)
shutil.rmtree("/tmp/claude-0/prof_demo", ignore_errors=True)
log = {"tanda": []}
with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context("/tmp/claude-0/prof_demo", headless=False, no_viewport=True, timezone_id="Asia/Jakarta",
        args=["--app=http://localhost:3001/_demo.html", "--window-size=1920,1080", "--window-position=0,0", "--force-device-scale-factor=1.33334",
              "--test-type", "--hide-crash-restore-bubble"], ignore_default_args=["--enable-automation"])
    time.sleep(2); pg = ctx.pages[0]; time.sleep(2)
    pt = pg.frame(name="pt")
    pt.evaluate("""fetch('/api/login', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({username: 'dina', password: 'rahasia123'})})""")
    time.sleep(1.5); pt.evaluate("location.reload()"); time.sleep(4); pt = pg.frame(name="pt")
    pt.evaluate("document.getElementById('panel').scrollIntoView()"); hp = pg.frame(name="hp"); time.sleep(1)
    pg.mouse.move(1900, 1070)
    ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "x11grab", "-draw_mouse", "0", "-framerate", "30", "-video_size", "2560x1440", "-i", ":99",
        "-vf", "scale=1920:1080:flags=lanczos", "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-pix_fmt", "yuv420p", OUT + "_cam.mp4"], stdin=subprocess.PIPE)
    time.sleep(0.5); t0 = time.time(); T = lambda n: log["tanda"].append([round(time.time() - t0, 2), n])
    T("mulai"); time.sleep(1.5)
    hp.click("text=Ganti oli cepat"); T("ambil"); time.sleep(4)
    for i in range(4):
        T(f"panggil{i}"); pt.click("#panggil"); time.sleep(4.5)
    T("akhir"); time.sleep(2)
    ff.stdin.write(b"q"); ff.stdin.flush(); ff.wait(); log["durasi"] = round(time.time() - t0, 2)
    json.dump(log, open(OUT + ".json", "w")); ctx.close()
print(log)
