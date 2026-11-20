"""Render Short vertikal seri OSN-K: python3 osn/_inti/render_short.py osn/ON01 [--frame h1@3 h4@8 ...]
Butuh <ep>/short/timeline.json + audio/narration.wav (voice.py <ep>/short) dan timeline induk <ep>/timeline.json."""
import base64, json, os, subprocess, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "_alat"))
import episode as E
from playwright.sync_api import sync_playwright
ep = sys.argv[1]; FR = sys.argv[sys.argv.index("--frame") + 1:] if "--frame" in sys.argv else []
EP = os.path.join(E.EPISODES, ep); ROOT = os.path.join(EP, "short"); P = E.load_script(EP)
ENGINE = E.engine_js(EP, P) + "\n" + open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "osn-short.js")).read()
TL = E.load_timeline(ROOT, "suara"); PTL = E.load_timeline(EP, "suara")
HTML = f"""<!doctype html><html><head><meta charset="utf-8"><style>html,body{{margin:0;background:#000}}canvas{{display:block}}</style></head>
<body><canvas id="c" width="1080" height="1920"></canvas><script>{ENGINE}</script><script>
const TL = {json.dumps(TL, ensure_ascii=False)}; const PTL = {json.dumps(PTL, ensure_ascii=False)};
const cv = document.getElementById('c'), ctx = cv.getContext('2d'); const off = document.createElement('canvas'); off.width = 1920; off.height = 1080;
window.__seek = t => {{ Kiko.drawShort(ctx, off, t, TL, PTL); return cv.toDataURL('image/jpeg', 0.92); }}; window.__ready = true;</script></body></html>"""
OUT = os.path.join(EP, "video"); os.makedirs(OUT, exist_ok=True); built = os.path.join(ROOT, "short.built.html"); open(built, "w").write(HTML)
with sync_playwright() as pw:
    br = pw.chromium.launch(); pg = br.new_page(viewport={"width": 1080, "height": 1920}); pg.goto("file://" + built); pg.wait_for_function("window.__ready")
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    if FR:
        pv = os.path.join(ROOT, "preview"); os.makedirs(pv, exist_ok=True); bs = {b["id"]: b for b in TL["beats"]}
        for f in FR:
            bid, _, s = f.partition("@"); b = bs[bid]; t = b["speech"] + b["audio"] - 0.05 if not s else b["start"] + float(s)
            open(os.path.join(pv, f.replace("@", "_") + ".jpg"), "wb").write(base64.b64decode(pg.evaluate("t => window.__seek(t)", t).split(",", 1)[1]))
        print("errors:", errs); sys.exit()
    tmp = os.path.join(OUT, "short_v.mp4"); n = int(round(TL["total"] * 30))
    pr = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", tmp], stdin=subprocess.PIPE)
    for i in range(n): pr.stdin.write(base64.b64decode(pg.evaluate("t => window.__seek(t)", i / 30).split(",", 1)[1]))
    pr.stdin.close(); pr.wait(); br.close(); print("errors:", errs)
name = f"OSN-K_{P['episode']}_{E.title_slug(P['title'])}_Short.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-i", os.path.join(ROOT, "audio", "narration.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-shortest", "-movflags", "+faststart", os.path.join(OUT, name)], check=True)
print("DONE", os.path.join(OUT, name))
