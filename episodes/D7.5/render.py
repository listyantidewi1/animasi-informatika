"""Render the episode to two YouTube-ready MP4s (1080p30, burnt-in text, silent audio track) plus SRT files."""
import json, os, base64, subprocess, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "video"); os.makedirs(OUT, exist_ok=True)
FPS = 30
TL = json.load(open(os.path.join(ROOT, "timeline.json")))
html = open(os.path.join(ROOT, "render.html")).read().replace("__TIMELINE__", json.dumps(TL, ensure_ascii=False))
open(os.path.join(ROOT, "render.built.html"), "w").write(html)
beats = TL["beats"]
SPLIT = next(b["start"] for b in beats if b["id"] == "s3a")
PARTS = {
    "D7.5a": {"t0": 0.0, "t1": SPLIT, "segs": [0, 1, 2, 3], "pre": None, "post": ("Lanjut ke Bagian 2: Tebak, Jalankan, Perbaiki", 3)},
    "D7.5b": {"t0": SPLIT, "t1": TL["total"], "segs": [4, 5, 6, 7], "pre": ("Bagian 2: Tebak, Jalankan, Perbaiki", 4), "post": None},
}
only = sys.argv[1:]  # optional part names

def enc(path):
    return subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                             "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS), path], stdin=subprocess.PIPE)

def finish(proc, tmp, final):
    proc.stdin.close(); rc = proc.wait()
    if rc != 0: raise SystemExit(f"ffmpeg failed on {tmp}")
    os.replace(tmp, final)

def srt_time(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"

with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto("file://" + os.path.join(ROOT, "render.built.html")); pg.wait_for_function("window.__ready")
    for name, part in PARTS.items():
        if only and name not in only: continue
        files = []; offset = 0.0; srt = []
        # optional opening card
        if part["pre"]:
            txt, secs = part["pre"]; tmp = os.path.join(OUT, f"{name}_pre.tmp.mp4"); final = tmp.replace(".tmp.mp4", ".mp4")
            frame = base64.b64decode(pg.evaluate("a => window.__card(a[0], a[1])", [txt, part["segs"][0]]).split(",", 1)[1])
            pr = enc(tmp)
            for _ in range(secs * FPS): pr.stdin.write(frame)
            finish(pr, tmp, final); files.append(final); offset += secs
        # one file per segment
        for seg in part["segs"]:
            sb = [b for b in beats if b["seg"] == seg]
            t0, t1 = sb[0]["start"], sb[-1]["start"] + sb[-1]["dur"]
            n = int(round((t1 - t0) * FPS))
            tmp = os.path.join(OUT, f"{name}_seg{seg}.tmp.mp4"); final = tmp.replace(".tmp.mp4", ".mp4")
            pr = enc(tmp)
            for i in range(n):
                t = t0 + i / FPS
                data = pg.evaluate("t => window.__seek(t)", t)
                pr.stdin.write(base64.b64decode(data.split(",", 1)[1]))
            finish(pr, tmp, final); files.append(final)
            for b in sb:
                s = offset + (b["start"] - t0); e = s + b["audio"] + 1.0
                srt.append(f"{len(srt) + 1}\n{srt_time(s)} --> {srt_time(e)}\n{b['text']}\n")
            offset += n / FPS
            print(f"{name} seg{seg} done ({n} frames)", flush=True)
        if part["post"]:
            txt, secs = part["post"]; tmp = os.path.join(OUT, f"{name}_post.tmp.mp4"); final = tmp.replace(".tmp.mp4", ".mp4")
            frame = base64.b64decode(pg.evaluate("a => window.__card(a[0], a[1])", [txt, part["segs"][-1]]).split(",", 1)[1])
            pr = enc(tmp)
            for _ in range(secs * FPS): pr.stdin.write(frame)
            finish(pr, tmp, final); files.append(final)
        # join + silent audio track
        lst = os.path.join(OUT, f"{name}_list.txt")
        open(lst, "w").write("".join(f"file '{f}'\n" for f in files))
        joined = os.path.join(OUT, f"{name}_joined.mp4")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", joined], check=True)
        out = os.path.join(OUT, f"Informatika_{name}_Instruksi_untuk_Manusia_dan_Mesin.mp4")
        pre_ms = int((part["pre"][1] if part["pre"] else 0) * 1000)
        nar = os.path.join(ROOT, "audio", "narration.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", joined, "-i", nar, "-filter_complex",
                        f"[1:a]atrim={part['t0']}:{part['t1']},asetpts=PTS-STARTPTS,adelay={pre_ms}|{pre_ms},apad,aresample=48000[a]",
                        "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "96k", "-shortest", "-movflags", "+faststart", out], check=True)
        open(os.path.join(OUT, f"Informatika_{name}.srt"), "w").write("\n".join(srt))
        print("DONE", out, flush=True)
    br.close()
