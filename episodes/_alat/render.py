"""Render episode menjadi MP4 siap YouTube (1080p30, teks narasi terbakar) per bagian, plus .srt, dalam dua versi:
  _teks.mp4  tanpa suara, dipacu waktu baca (timeline-teks.json);  _suara.mp4  teks + narasi (timeline.json + audio/narration.wav).
  python3 episodes/_alat/render.py D7.0                 semua bagian, semua versi yang bahannya ada
  python3 episodes/_alat/render.py D7.0 D7.0a --suara   satu bagian, satu versi
  ... --mux   hanya suara/subtitel yang berubah: berkas segmen di video/ dipakai ulang, gambar tidak dirender ulang.
  ... --seg=2,3 hanya merender berkas segmen itu (tanpa menggabung), untuk render paralel di beberapa proses;
              sesudah semua selesai, jalankan sekali lagi dengan --lanjut untuk menggabung.
  ... --lanjut lanjutkan render yang terputus: segmen yang sudah ada dan lebih baru dari semua sumbernya
              (timeline, script.json, berkas engine, render.html) tidak dirender ulang.
Dari dalam folder episode kodenya boleh dihilangkan: python3 ../_alat/render.py D7.0a
Bagian (segmen, kartu pembuka/penutup) dibaca dari kunci "parts" di script.json."""
import json, os, base64, subprocess, sys
from playwright.sync_api import sync_playwright
import episode as E

flags = [a for a in sys.argv[1:] if a.startswith("--")]; MUX = "--mux" in flags; LANJUT = "--lanjut" in flags
SEGS = {int(x) for f in flags if f.startswith("--seg=") for x in f[6:].split(",")}
ROOT, only = E.find_root([a for a in sys.argv[1:] if not a.startswith("--")])
OUT = os.path.join(ROOT, "video"); os.makedirs(OUT, exist_ok=True)
FPS = 30
SCRIPT = E.load_script(ROOT); ENGINE = E.engine_js(ROOT, SCRIPT)
VARIANTS = E.pick_variants(ROOT, flags)
for n in only:
    if n not in SCRIPT["parts"]: raise SystemExit(f"bagian {n} tidak ada; yang ada: {', '.join(SCRIPT['parts'])}")

DOK = SCRIPT.get("kind") == "dokumenter"
# dokumenter: kualitas gambar lebih tinggi (audit D02: 1,96 Mb/s veryfast crf 20 terlalu rendah untuk gradasi gelap dan butir film)
X264 = ["-preset", "medium", "-crf", "16", "-tune", "animation", "-aq-mode", "3"] if DOK else ["-preset", "veryfast", "-crf", "20"]
def enc(path):
    return subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                             "-c:v", "libx264", *X264, "-pix_fmt", "yuv420p", "-r", str(FPS), path], stdin=subprocess.PIPE)

def sub_cues(b, s0):
    """Subtitel dokumenter: potong per kata (waktu dari "words") menjadi ≤2 baris × 42 karakter dan ≤7 detik.
    b["sub"] (opsional) = teks tampilan dengan angka ditulis sebagai angka; jumlah katanya boleh berbeda, waktunya dibagi proporsional."""
    words = b.get("words"); text = b.get("sub") or b["text"]; toks = text.split()
    if not words: return [(s0, s0 + min(b["audio"] + 1.0, b["dur"] - 0.05), text)]
    t0, t1 = words[0][1], words[-1][2]
    times = [(w[1], w[2]) for w in words] if len(words) == len(toks) else [(t0 + (t1 - t0) * i / len(toks), t0 + (t1 - t0) * (i + 1) / len(toks)) for i in range(len(toks))]
    cues, cur = [], []
    for i, tk in enumerate(toks):
        cand = " ".join(cur + [tk])
        if cur and (len(cand) > 84 or times[i][1] - times[cur_i][0] > 7.0): cues.append((cur_i, i - 1)); cur = []
        if not cur: cur_i = i
        cur.append(tk)
        if tk[-1] in ".?!" and len(" ".join(cur)) > 30: cues.append((cur_i, i)); cur = []
    if cur: cues.append((cur_i, len(toks) - 1))
    out = []
    for a, z in cues:
        line = " ".join(toks[a:z + 1])
        if len(line) > 42:   # bagi dua baris di spasi terdekat dari tengah
            mid = len(line) // 2; k = min((i for i, c in enumerate(line) if c == " "), key=lambda i: abs(i - mid)); line = line[:k] + "\n" + line[k + 1:]
        out.append((s0 + times[a][0], s0 + times[z][1] + 0.25, line))
    for i in range(len(out) - 1):   # jangan bertumpuk
        if out[i][1] > out[i + 1][0]: out[i] = (out[i][0], out[i + 1][0] - 0.02, out[i][2])
    return out

def finish(proc, tmp, final):
    proc.stdin.close(); rc = proc.wait()
    if rc != 0: raise SystemExit(f"ffmpeg failed on {tmp}")
    os.replace(tmp, final)

def fresh(final, variant):
    """--lanjut: berkas segmen dianggap sah bila ada dan lebih baru dari semua sumber gambarnya."""
    if not LANJUT or not os.path.exists(final): return False
    src = [E.timeline_path(ROOT, variant), os.path.join(ROOT, "script.json"), os.path.join(E.ALAT, "render.html")]
    src += [os.path.normpath(os.path.join(ROOT, f)) for f in SCRIPT.get("engine", [])]
    return os.path.getmtime(final) > max(os.path.getmtime(f) for f in src if os.path.exists(f))

def srt_time(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"

def still(pg, txt, seg, final, secs, variant):
    """Kartu diam (pembuka/penutup bagian) selama `secs` detik."""
    if MUX or fresh(final, variant): return
    tmp = final.replace(".mp4", ".tmp.mp4")
    frame = base64.b64decode(pg.evaluate("a => window.__card(a[0], a[1])", [txt, seg]).split(",", 1)[1])
    pr = enc(tmp)
    for _ in range(secs * FPS): pr.stdin.write(frame)
    finish(pr, tmp, final)

def render_variant(pg, variant):
    TL = E.load_timeline(ROOT, variant); beats = TL["beats"]
    html = (open(os.path.join(E.ALAT, "render.html"), encoding="utf-8").read()
            .replace("__ENGINE__", ENGINE).replace("__TIMELINE__", json.dumps(TL, ensure_ascii=False)))
    built = os.path.join(ROOT, f"render-{variant}.built.html"); open(built, "w", encoding="utf-8").write(html)
    pg.goto("file://" + built); pg.wait_for_function("window.__ready")
    for name, p in TL["parts"].items():
        if only and name not in only: continue
        sb_all = [b for b in beats if b["seg"] in p["segs"]]
        t_start, t_end = sb_all[0]["start"], sb_all[-1]["start"] + sb_all[-1]["dur"]
        pre = (p["pre"], p.get("pre_secs", 4)) if p.get("pre") else None
        post = (p["post"], p.get("post_secs", 3)) if p.get("post") else None
        tag = f"{name}_{variant}"; files = []; offset = 0.0; srt = []
        if pre:
            final = os.path.join(OUT, f"{tag}_pre.mp4"); still(pg, pre[0], p["segs"][0], final, pre[1], variant); files.append(final); offset += pre[1]
        for seg in p["segs"]:  # one file per segment
            if SEGS and seg not in SEGS: continue
            sb = [b for b in beats if b["seg"] == seg]
            t0, t1 = sb[0]["start"], sb[-1]["start"] + sb[-1]["dur"]
            n = int(round((t1 - t0) * FPS))
            tmp = os.path.join(OUT, f"{tag}_seg{seg}.tmp.mp4"); final = tmp.replace(".tmp.mp4", ".mp4")
            if MUX:
                if not os.path.exists(final): raise SystemExit(f"--mux: {final} belum ada; render dulu tanpa --mux")
            elif fresh(final, variant):
                print(f"{tag} seg{seg} dipakai ulang (--lanjut)", flush=True)
            else:
                pr = enc(tmp)
                for i in range(n):
                    data = pg.evaluate("t => window.__seek(t)", t0 + i / FPS)
                    pr.stdin.write(base64.b64decode(data.split(",", 1)[1]))
                finish(pr, tmp, final)
            files.append(final)
            for b in sb:
                s = offset + (b["start"] - t0); e = s + min(b["audio"] + 1.0, b["dur"] - 0.05)
                if DOK:
                    for cs, ce, line in sub_cues(b, s): srt.append(f"{len(srt) + 1}\n{srt_time(cs)} --> {srt_time(ce)}\n{line}\n")
                else: srt.append(f"{len(srt) + 1}\n{srt_time(s)} --> {srt_time(e)}\n{b['text']}\n")
            offset += n / FPS
            print(f"{tag} seg{seg} done ({n} frames)", flush=True)
        if SEGS: continue  # render sebagian: penggabungan dilakukan oleh proses --lanjut sesudahnya
        if post:
            final = os.path.join(OUT, f"{tag}_post.mp4"); still(pg, post[0], p["segs"][-1], final, post[1], variant); files.append(final)
        # join, then audio track: narration (suara) or silence (teks)
        lst = os.path.join(OUT, f"{tag}_list.txt"); open(lst, "w").write("".join(f"file '{f}'\n" for f in files))
        joined = os.path.join(OUT, f"{tag}_joined.mp4")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", joined], check=True)
        out = os.path.join(OUT, f"Informatika_{name}_{E.title_slug(TL['title'])}_{variant}.mp4")
        if variant == "suara":
            pre_ms = int((pre[1] if pre else 0) * 1000); nar = os.path.join(ROOT, "audio", "narration.wav")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", joined, "-i", nar, "-filter_complex",
                            f"[1:a]atrim={t_start}:{t_end},asetpts=PTS-STARTPTS,adelay={pre_ms}|{pre_ms},apad,aresample=48000[a]",
                            "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k" if DOK else "96k", "-shortest", "-movflags", "+faststart", out], check=True)
        else:
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", joined, "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono",
                            "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "48k", "-shortest", "-movflags", "+faststart", out], check=True)
        open(os.path.join(OUT, f"Informatika_{name}_{variant}.srt"), "w", encoding="utf-8").write("\n".join(srt))
        print("DONE", out, flush=True)

with sync_playwright() as p:
    br = p.chromium.launch(args=E.browser_args(SCRIPT)); pg = br.new_page(viewport={"width": 1920, "height": 1080})
    for v in VARIANTS: render_variant(pg, v)
    br.close()
