"""Render YouTube Short vertikal (1080x1920, 30 fps) dari <episode>/short/, dua versi seperti episode:
  _teks.mp4 (tanpa suara, timeline-teks.json) dan _suara.mp4 (narasi, timeline.json + audio/narration.wav), plus .srt dan youtube.md.
  python3 episodes/_alat/render_short.py D7.3              semua versi yang bahannya ada
  python3 episodes/_alat/render_short.py D7.3 --suara      satu versi
  python3 episodes/_alat/render_short.py D7.3 --frame h1=3 h4=5   pratinjau JPG beberapa detik (detik dalam beat) di short/preview/
Alur: tulis short/script.json -> timing.py D7.3/short -> suara_elevenlabs.py D7.3/short -> voice.py D7.3/short -> render_short.py D7.3.
Adegan dipinjam dari episode induk (mesin gambar induk + short.js); kunci beat: src (beat asal), scene, crops, note, text, hold."""
import base64, json, os, subprocess, sys
from playwright.sync_api import sync_playwright
import episode as E

args = [a for a in sys.argv[1:] if not a.startswith("--")]; flags = [a for a in sys.argv[1:] if a.startswith("--")]
if not args: raise SystemExit(__doc__)
EP = os.path.join(E.EPISODES, args[0]); ROOT = os.path.join(EP, "short")
if not os.path.exists(os.path.join(ROOT, "script.json")): raise SystemExit(f"{ROOT}/script.json belum ada")
FRAMES = args[1:] if "--frame" in flags else []
PARENT = E.load_script(EP); SCRIPT = E.load_script(ROOT)
ENGINE = "\n".join(open(os.path.join(EP, f), encoding="utf-8").read() for f in PARENT["engine"]) + "\n" + \
         open(os.path.join(E.ALAT, "short.js"), encoding="utf-8").read()
CFG = E.load_json(os.path.join(E.ALAT, "alat_luar.json")); SITE = CFG.get("situs", "https://belajar-informatika.vercel.app").rstrip("/")
LINK = SITE.replace("https://", "") + "/" + E.code_slug(PARENT["episode"])
code = PARENT["episode"]; kelas = "Kelas 7" if code.startswith("D7") else "Kelas 8" if code.startswith("D8") else "Kelas 9" if code.startswith("D9") \
    else "Kelas 10" if code.startswith("E") else "Kelas 11" if code.startswith("F11") else "Kelas 12"
FULL = f"Informatika {kelas} | {PARENT['title']}"
OUT = os.path.join(EP, "video"); os.makedirs(OUT, exist_ok=True)
FPS = 30
HTML = """<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000}canvas{display:block}</style></head>
<body><canvas id="c" width="1080" height="1920"></canvas><script>__ENGINE__</script><script>
const TL = __TIMELINE__; const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const off = document.createElement('canvas'); off.width = 1920; off.height = 1080;
window.__seek = t => { Kiko.drawShort(ctx, off, t, TL); return cv.toDataURL('image/jpeg', 0.92); };
window.__ready = true;</script></body></html>"""

def timeline(variant):
    TL = E.load_timeline(ROOT, variant)
    src = {b["id"]: b for b in E.load_timeline(EP, variant)["beats"]}
    for b in TL["beats"]:
        if b.get("src") in src: b["src_dur"] = src[b["src"]]["dur"]; b["src_audio"] = src[b["src"]]["audio"]
    TL.update(episode=code, label=f"Informatika {kelas}", full_title=FULL, link=LINK)
    return TL

def page(pg, TL):
    html = HTML.replace("__ENGINE__", ENGINE).replace("__TIMELINE__", json.dumps(TL, ensure_ascii=False))
    built = os.path.join(ROOT, "render.built.html"); open(built, "w", encoding="utf-8").write(html)
    pg.goto("file://" + built); pg.wait_for_function("window.__ready")

def srt_time(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"

def render(pg, variant):
    TL = timeline(variant); page(pg, TL)
    name = f"Short_{code}_{E.title_slug(SCRIPT['title'])}_{variant}"
    tmp = os.path.join(OUT, name + ".video.mp4"); n = int(round(TL["total"] * FPS))
    pr = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                           "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS), tmp], stdin=subprocess.PIPE)
    for i in range(n): pr.stdin.write(base64.b64decode(pg.evaluate("t => window.__seek(t)", i / FPS).split(",", 1)[1]))
    pr.stdin.close()
    if pr.wait() != 0: raise SystemExit("ffmpeg gagal")
    out = os.path.join(OUT, name + ".mp4")
    audio = ["-i", os.path.join(ROOT, "audio", "narration.wav")] if variant == "suara" else ["-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono"]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, *audio, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac",
                    "-b:a", "96k" if variant == "suara" else "48k", "-ar", "48000", "-af", "apad", "-shortest", "-movflags", "+faststart", out], check=True)
    os.remove(tmp)
    srt = [f"{i + 1}\n{srt_time(b['start'])} --> {srt_time(b['start'] + min(b['audio'] + 1.0, b['dur'] - 0.05))}\n{b['text']}\n"
           for i, b in enumerate(TL["beats"])]
    open(os.path.join(OUT, f"Short_{code}_{variant}.srt"), "w", encoding="utf-8").write("\n".join(srt))
    print("DONE", out, f"{TL['total']:.1f}s", flush=True)

def youtube_md():
    yt = SCRIPT.get("youtube", {})
    title = SCRIPT.get("judul_short") or SCRIPT["hook"]
    desc = "\n".join([SCRIPT.get("ringkas", ""), "", f"Episode lengkap: {FULL} (lihat video terkait di atas judul).",
                      f"Latihan interaktif: https://{LINK}", f"Semua episode: {SITE}/", "",
                      "Semua nama, akun, dan contoh di video ini fiktif.", "", " ".join(yt.get("tagar", ["#shorts", "#informatika"]))])
    md = f"# YouTube Short {code}\n\n**Judul** (≤100 karakter):\n\n{title}\n\n**Deskripsi:**\n\n```\n{desc}\n```\n\n" \
         f"**Video terkait** (fitur \"Related video\" di YouTube Studio): {FULL}\n\n" \
         "**Berkas:** `video/Short_*_suara.mp4` (narasi) dan `video/Short_*_teks.mp4` (tanpa suara, waktu baca 1,6 kata/detik).\n"
    open(os.path.join(ROOT, "youtube.md"), "w", encoding="utf-8").write(md)

with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1080, "height": 1920})
    if FRAMES:
        variant = "suara" if E.has_variant(ROOT, "suara") else "teks"; TL = timeline(variant); page(pg, TL)
        d = os.path.join(ROOT, "preview"); os.makedirs(d, exist_ok=True)
        for f in FRAMES:
            bid, _, sec = f.partition("="); b = next(x for x in TL["beats"] if x["id"] == bid)
            t = b["start"] + (float(sec) if sec else b["dur"] - 0.1)
            open(os.path.join(d, f"{bid}_at{sec or 'akhir'}.jpg"), "wb").write(base64.b64decode(pg.evaluate("t => window.__seek(t)", t).split(",", 1)[1]))
        print(f"[{variant}] {len(FRAMES)} frame -> {d}")
    else:
        for v in E.pick_variants(ROOT, flags): render(pg, v)
        youtube_md()
    br.close()
