"""Versi TikTok dari Short pembahasan Bebras (1080x1920, 30 fps, hanya bersuara, durasi 60 detik sampai 2 menit).
  python3 episodes/_alat/render_tiktok_bebras.py bebras/B01              Short jadi + penutup ajakan subscribe
  python3 episodes/_alat/render_tiktok_bebras.py bebras/B01 --frame 2 6  pratinjau JPG penutup (detik dalam penutup)
Cara kerja:
  - Short yang sudah >= 60 detik: video Short jadi (<kode>_Short.mp4 di /mnt/project-files/bebras/...) disambung dengan
    penutup "ajakan subscribe" (adegan tiktok_subscribe di short.js) bergaya sama dengan Short-nya.
  - Short yang terlalu pendek diberi folder <episode>/tiktok/ (format sama dengan short/, beat terakhir = ajakan):
    seluruh videonya dirender dari timeline itu. Contoh: B04 (Short 50 detik + pembahasan pilihan jawaban dari video lengkap).
  - Suara ajakan direkam sekali per kecepatan Kak Ceria (episodes/bebras/_tiktok/ajakan085|090|095) lalu dipakai ulang.
Hasil: <kode>_TikTok.mp4, <kode>_TikTok.srt, <kode>_TikTok_caption.md di samping Short-nya."""
import base64, glob, json, os, subprocess, sys
from playwright.sync_api import sync_playwright
import episode as E

args = [a for a in sys.argv[1:] if not a.startswith("--")]; flags = [a for a in sys.argv[1:] if a.startswith("--")]
if not args: raise SystemExit(__doc__)
EP = os.path.join(E.EPISODES, args[0]); CODE = os.path.basename(EP.rstrip("/"))
FRAMES = [float(x) for x in args[1:]] if "--frame" in flags else []
PARENT = E.load_script(EP); bb = PARENT.get("bebras", {})
SHORT = os.path.join(EP, "short"); TIK = os.path.join(EP, "tiktok"); FULLTIK = os.path.exists(os.path.join(TIK, "script.json"))
SPEED = json.load(open(os.path.join(SHORT, "tts-kit", "suara.json")))["speed"]
AJAK = os.path.join(E.EPISODES, "bebras", "_tiktok", "ajakan%03d" % round(SPEED * 100))
PF = "/mnt/project-files/bebras/"
found = glob.glob(PF + f"**/{CODE}/{CODE}_Short.mp4", recursive=True)
if not found: raise SystemExit(f"{CODE}_Short.mp4 tidak ditemukan di {PF}")
SHORT_MP4 = found[0]; OUTDIR = os.path.dirname(SHORT_MP4)
OUT = os.path.join(OUTDIR, f"{CODE}_TikTok.mp4"); FPS = 30
CHANNEL = "youtube.com/@iTeachSWE"
ENGINE = "\n".join(open(os.path.join(EP, f), encoding="utf-8").read() for f in PARENT["engine"]) + "\n" + \
         open(os.path.join(E.ALAT, "short.js"), encoding="utf-8").read()
HTML = """<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000}canvas{display:block}</style></head>
<body><canvas id="c" width="1080" height="1920"></canvas><script>__ENGINE__</script><script>
const TL = __TIMELINE__; const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const off = document.createElement('canvas'); off.width = 1920; off.height = 1080;
window.__seek = t => { Kiko.drawShort(ctx, off, t, TL); return cv.toDataURL('image/jpeg', 0.92); };
window.__ready = true;</script></body></html>"""

def dur(p): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]))

def meta(TL):
    TL.update(episode=PARENT["episode"], label=bb.get("kategori", "Bebras").split(" (")[0],
              full_title=f"Pembahasan Soal Bebras | {PARENT['title']}", channel=CHANNEL)
    return TL

def with_src(TL):
    src = {b["id"]: b for b in E.load_timeline(EP, "suara")["beats"]}
    for b in TL["beats"]:
        if b.get("src") in src:
            s0 = src[b["src"]]; b.update(src_dur=s0["dur"], src_audio=s0["audio"], src_text=s0["text"], src_words=s0.get("words"),
                                         src_lead=(s0["speech"] - s0["start"]) if s0.get("speech") is not None else 0.4)
    return TL

def tap_time(b):   # ketukan tombol saat kata "subscribe" diucapkan (perkiraan dari posisi huruf)
    i = b["text"].find("subscribe"); lead = b["speech"] - b["start"]
    return lead + max(0, i) / len(b["text"]) * b["audio"] + 0.4

def page(pg, TL, where):
    html = HTML.replace("__ENGINE__", ENGINE).replace("__TIMELINE__", json.dumps(TL, ensure_ascii=False))
    built = os.path.join(where, "tiktok.built.html"); open(built, "w", encoding="utf-8").write(html)
    pg.goto("file://" + built); pg.wait_for_function("window.__ready")

def frames_to(pg, total, path):
    pr = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                           "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS), path], stdin=subprocess.PIPE)
    for i in range(int(round(total * FPS))): pr.stdin.write(base64.b64decode(pg.evaluate("t => window.__seek(t)", i / FPS).split(",", 1)[1]))
    pr.stdin.close()
    if pr.wait() != 0: raise SystemExit("ffmpeg gagal")

def srt_time(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"
def srt_lines(beats, off=0.0):
    return [(off + b["start"], off + b["start"] + min(b["audio"] + 1.0, b["dur"] - 0.05), b["text"]) for b in beats]

def caption():
    neg = bb.get("negara", ""); kode = bb.get("kode", ""); kat = bb.get("kategori", "")
    judul = bb.get("judul_asli") or bb.get("judul") or PARENT["title"]
    hook = E.load_script(SHORT).get("hook", "")
    txt = (f"# TikTok {CODE}: {PARENT['title']}\n\n**Keterangan** (salin ke TikTok):\n\n```\n{hook} Pembahasan soal Bebras \"{PARENT['title']}\" "
           f"untuk kategori {kat}. Pembahasan lengkapnya ada di YouTube: {CHANNEL}\n\n"
           f"Soal: {judul}, Bebras {bb.get('tahun', '')}, kontributor {neg} ({kode}), digambar ulang.\n\n"
           f"#Bebras #SoalBebras #BerpikirKomputasional #belajarditiktok #informatika\n```\n")
    open(os.path.join(OUTDIR, f"{CODE}_TikTok_caption.md"), "w", encoding="utf-8").write(txt)

with sync_playwright() as p:
    br = p.chromium.launch(args=E.browser_args(PARENT)); pg = br.new_page(viewport={"width": 1080, "height": 1920})
    if FULLTIK:   # seluruh video dari <episode>/tiktok/timeline.json
        TL = with_src(meta(E.load_timeline(TIK, "suara")))
        for b in TL["beats"]:
            if b["scene"] == "tiktok_subscribe": b["tap"] = tap_time(b)
        page(pg, TL, TIK); total = TL["total"]; wav = os.path.join(TIK, "audio", "narration.wav"); subs = srt_lines(TL["beats"])
    else:         # penutup saja, disambung ke Short jadi
        A = E.load_timeline(AJAK, "suara"); b = A["beats"][0]; b["tap"] = tap_time(b)
        TL = meta(E.load_timeline(SHORT, "suara")); TL.update(beats=[b], total=A["total"], bar_full=True)
        page(pg, TL, AJAK); total = A["total"]; wav = os.path.join(AJAK, "audio", "narration.wav")
    if FRAMES:
        d = os.path.join(EP, "tiktok" if FULLTIK else "short", "preview"); os.makedirs(d, exist_ok=True)
        for t in FRAMES:
            open(os.path.join(d, f"tiktok_{t:g}.jpg"), "wb").write(base64.b64decode(pg.evaluate("t => window.__seek(t)", t).split(",", 1)[1]))
        print(f"{len(FRAMES)} frame -> {d}"); br.close(); raise SystemExit
    tmp = os.path.join(OUTDIR, f".{CODE}_tiktok_part.mp4"); vid = tmp + ".v.mp4"
    frames_to(pg, total, vid); br.close()
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", vid, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "96k",
                    "-ar", "48000", "-ac", "1", "-af", "apad", "-shortest", tmp], check=True); os.remove(vid)
    if FULLTIK: os.replace(tmp, OUT)
    else:
        S = dur(SHORT_MP4)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SHORT_MP4, "-i", tmp, "-filter_complex",
                        "[0:v]fps=30,format=yuv420p[v0];[0:a]aresample=48000,aformat=channel_layouts=mono[a0];"
                        "[1:v]fps=30,format=yuv420p[v1];[1:a]aresample=48000,aformat=channel_layouts=mono[a1];"
                        "[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]", "-map", "[v]", "-map", "[a]",
                        "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k",
                        "-movflags", "+faststart", OUT], check=True); os.remove(tmp)
        TS = E.load_timeline(SHORT, "suara")
        if abs(TS["total"] - S) > 0.5: print(f"PERINGATAN: timeline Short {TS['total']:.1f}s, video {S:.1f}s; subtitel bisa bergeser")
        subs = srt_lines(TS["beats"]) + srt_lines(A["beats"], S)
    open(OUT[:-4] + ".srt", "w", encoding="utf-8").write("\n".join(f"{i + 1}\n{srt_time(a)} --> {srt_time(z)}\n{t}\n" for i, (a, z, t) in enumerate(subs)))
    caption()
    print("DONE", OUT, f"{dur(OUT):.1f}s", flush=True)
