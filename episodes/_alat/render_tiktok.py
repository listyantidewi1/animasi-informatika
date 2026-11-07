"""Render video TikTok vertikal (1080x1920, 30 fps, hanya versi bersuara) dari tiktok/<kode>/timeline.json + audio/narration.wav.
  python3 episodes/_alat/render_tiktok.py tiktok/T01                    video/TikTok_<kode>_<judul>.mp4 + .srt, dan caption.md
  python3 episodes/_alat/render_tiktok.py tiktok/T01 --frame k1=0.5 k3   pratinjau JPG (detik dalam beat; tanpa detik = akhir beat) di preview/
  python3 episodes/_alat/render_tiktok.py tiktok/T01 --kontak           lembar kontak preview/kontak.jpg (3 frame per beat: awal, tengah, akhir)
  ... --zona     gambar ruang aman TikTok (merah) di atas frame pratinjau/lembar kontak
  ... --caption  hanya menulis ulang caption.md (keterangan unggahan) dari kunci "caption" di script.json
  ... --rapatkan hanya merapatkan timeline (lihat di bawah), tanpa render
  ... --teks     pratinjau memakai timeline-teks.json (dari timing.py) bila suara belum dibuat; render video selalu memakai timeline.json
Alur: script.json -> cek_tiktok.py -> suara_elevenlabs.py --uji -> suara_elevenlabs.py -> voice.py -> render_tiktok.py --kontak -> render_tiktok.py
Tempo TikTok: voice.py memberi tiap beat waktu baca pemula (cocok untuk seri belajar, terlalu lambat untuk TikTok). Alat ini
merapatkan timeline.json dan audio/narration.wav dari audio/<id>.wav buatan voice.py (jeda awal 0,2 s, narasi + 0,25 s, minimal
waktu baca 17 huruf/detik, lalu "hold" beat) dan menandainya "rapat": true. Otomatis setiap kali timeline belum rapat (mis. sesudah
voice.py dijalankan ulang); voice.py tidak diubah.
Mesin gambar: kunci "engine" di script.json (bawaan ["../../_alat/tiktok-core.js", "scenes.js"])."""
import base64, io, json, os, subprocess, sys
from playwright.sync_api import sync_playwright
import episode as E

args = [a for a in sys.argv[1:] if not a.startswith("--")]; flags = [a for a in sys.argv[1:] if a.startswith("--")]
if not args: raise SystemExit(__doc__)
ROOT, rest = E.find_root(args[:1]); FRAMES = args[1:]
SCRIPT = E.load_script(ROOT); code = SCRIPT["episode"]
ENGINE_FILES = SCRIPT.get("engine", ["../../_alat/tiktok-core.js", "scenes.js"])
ENGINE = "\n".join(open(os.path.join(ROOT, f), encoding="utf-8").read() for f in ENGINE_FILES)
CHANNEL = SCRIPT.get("channel", "youtube.com/@iTeachSWE")
FPS = 30
ZONA = """window.__zona=()=>{ctx.save();ctx.fillStyle='rgba(255,0,0,0.22)';ctx.fillRect(900,900,180,600);ctx.fillRect(0,1600,1080,320);
ctx.fillRect(0,0,1080,150);ctx.restore();};""" if "--zona" in flags else "window.__zona=()=>{};"
HTML = """<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000}canvas{display:block}</style></head>
<body><canvas id="c" width="1080" height="1920"></canvas><script>__ENGINE__</script><script>
const TL = __TIMELINE__; const cv = document.getElementById('c'), ctx = cv.getContext('2d');__ZONA__
window.__seek = (t, z) => { TikTok.draw(ctx, t, TL); if (z) __zona(); return cv.toDataURL('image/jpeg', 0.92); };
window.__ready = true;</script></body></html>"""


LEAD, TAIL, CPS = 0.2, 0.25, 17.0


def rapatkan():
    import wave
    TL = E.load_timeline(ROOT, "suara"); A = os.path.join(ROOT, "audio"); rate = None; track = bytearray(); t = 0.0
    for b in TL["beats"]:
        with wave.open(os.path.join(A, b["id"] + ".wav")) as w:
            rate = rate or w.getframerate(); pcm = w.readframes(w.getnframes()); dur = w.getnframes() / rate
        body = max(dur + TAIL, len(b["text"]) / CPS)
        total = round(LEAD + body + b.get("hold", 0.3), 3)
        b.update(start=round(t, 3), speech=round(t + LEAD, 3), audio=round(dur, 3), dur=total)
        track += b"\x00\x00" * int(LEAD * rate) + pcm + b"\x00\x00" * int(round((total - LEAD - dur) * rate)); t += total
    with wave.open(os.path.join(A, "narration.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(bytes(track))
    TL.update(total=round(t, 3), rapat=True); E.save_json(TL, E.timeline_path(ROOT, "suara"))
    mp3 = os.path.join(ROOT, "narasi.mp3")          # buatan voice.py untuk halaman web seri; tidak dipakai TikTok
    if os.path.exists(mp3): os.remove(mp3)
    print(f"[rapat] {len(TL['beats'])} beat, total {t:.1f} s -> timeline.json, audio/narration.wav", flush=True)


if E.has_variant(ROOT, "suara") and (not E.load_timeline(ROOT, "suara").get("rapat") or "--rapatkan" in flags): rapatkan()
if "--rapatkan" in flags: raise SystemExit(0)


def timeline(variant="suara"):
    TL = E.load_timeline(ROOT, variant); TL.setdefault("channel", CHANNEL); return TL


def page(pg, TL):
    html = HTML.replace("__ENGINE__", ENGINE).replace("__TIMELINE__", json.dumps(TL, ensure_ascii=False)).replace("__ZONA__", ZONA)
    built = os.path.join(ROOT, "render.built.html"); open(built, "w", encoding="utf-8").write(html)
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + built); pg.wait_for_function("window.__ready"); os.remove(built)
    if errs: raise SystemExit("JS error: " + errs[0])


def grab(pg, t, zona=False):
    return base64.b64decode(pg.evaluate("([t, z]) => window.__seek(t, z)", [t, zona]).split(",", 1)[1])


def srt_time(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"


def caption_md(TL, name):
    cap = SCRIPT.get("caption", {}); tags = cap.get("tagar", ["#belajarditiktok", "#informatika", "#teknologi", "#faktaunik"])
    body = "\n".join([cap.get("teks", SCRIPT["title"]), "", f"Belajar lebih banyak di YouTube: {CHANNEL}", "", " ".join(tags)])
    md = (f"# Keterangan TikTok {code}\n\n**Judul/topik:** {SCRIPT['title']}\n\n**Berkas:** `video/{name}.mp4` ({str(round(TL['total'], 1)).replace('.', ',')} detik, "
          f"1080×1920, bersuara) dan subtitel `video/{name}.srt`.\n\n**Keterangan unggahan (salin):**\n\n```\n{body}\n```\n\n"
          "Semua nama, akun, dan contoh di video ini rekaan.\n")
    open(os.path.join(ROOT, "caption.md"), "w", encoding="utf-8").write(md)


def render(pg):
    if not E.has_variant(ROOT, "suara"): raise SystemExit("timeline.json atau audio/narration.wav belum ada: jalankan voice.py dulu")
    TL = timeline(); page(pg, TL)
    out_dir = os.path.join(ROOT, "video"); os.makedirs(out_dir, exist_ok=True)
    name = f"TikTok_{code}_{E.title_slug(SCRIPT['title'])}"; tmp = os.path.join(out_dir, name + ".video.mp4")
    n = int(round(TL["total"] * FPS))
    pr = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                           "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS), tmp], stdin=subprocess.PIPE)
    for i in range(n):
        pr.stdin.write(grab(pg, i / FPS))
        if i % 300 == 0: print(f"  frame {i}/{n}", flush=True)
    pr.stdin.close()
    if pr.wait() != 0: raise SystemExit("ffmpeg gagal")
    out = os.path.join(out_dir, name + ".mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-i", os.path.join(ROOT, "audio", "narration.wav"), "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-af", "apad", "-shortest", "-movflags", "+faststart", out], check=True)
    os.remove(tmp)
    srt = [f"{i + 1}\n{srt_time(b['speech'])} --> {srt_time(min(b['speech'] + b['audio'] + 0.4, b['start'] + b['dur'] - 0.05))}\n{b['text']}\n"
           for i, b in enumerate(TL["beats"])]
    open(os.path.join(out_dir, name + ".srt"), "w", encoding="utf-8").write("\n".join(srt))
    caption_md(TL, name)
    print("DONE", out, f"{TL['total']:.1f}s", flush=True)


def kontak(pg, TL, zona):
    from PIL import Image
    shots = []
    for b in TL["beats"]:
        for f in (0.6, 0.5, None):
            t = b["start"] + (min(f, b["dur"] - 0.1) if f == 0.6 else b["dur"] * f if f else b["dur"] - 0.1)
            shots.append(Image.open(io.BytesIO(grab(pg, t, zona))).resize((270, 480)))
    cols = 6; rows = (len(shots) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * 276, rows * 486), (40, 40, 40))
    for i, im in enumerate(shots): sheet.paste(im, ((i % cols) * 276 + 3, (i // cols) * 486 + 3))
    d = os.path.join(ROOT, "preview"); os.makedirs(d, exist_ok=True); p = os.path.join(d, "kontak.jpg"); sheet.save(p, quality=85)
    print(f"lembar kontak {len(TL['beats'])} beat × 3 frame (awal 0,6 s, tengah, akhir) -> {p}")


if "--caption" in flags:
    caption_md(E.load_timeline(ROOT, "suara"), f"TikTok_{code}_{E.title_slug(SCRIPT['title'])}"); print("caption.md ditulis"); raise SystemExit(0)

with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1080, "height": 1920})
    if FRAMES or "--kontak" in flags:
        variant = "teks" if "--teks" in flags or not E.has_variant(ROOT, "suara") else "suara"
        if not os.path.exists(E.timeline_path(ROOT, variant)): raise SystemExit(f"{E.TIMELINE_FILE[variant]} belum ada: jalankan timing.py atau voice.py dulu")
        TL = timeline(variant); page(pg, TL); zona = "--zona" in flags
        if "--kontak" in flags: kontak(pg, TL, zona)
        d = os.path.join(ROOT, "preview"); os.makedirs(d, exist_ok=True)
        for f in FRAMES:
            bid, _, sec = f.partition("="); b = next((x for x in TL["beats"] if x["id"] == bid), None)
            if not b: raise SystemExit(f"beat '{bid}' tidak ada")
            t = b["start"] + (float(sec) if sec else b["dur"] - 0.1)
            open(os.path.join(d, f"{bid}_at{sec or 'akhir'}.jpg"), "wb").write(grab(pg, t, zona))
        if FRAMES: print(f"[{variant}] {len(FRAMES)} frame -> {d}")
    else:
        render(pg)
    br.close()
