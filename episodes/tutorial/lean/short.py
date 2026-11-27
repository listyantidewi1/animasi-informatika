"""Short L01 (1080x1920) dari potongan narasi dan rekaman layar video utama, tanpa suara baru.
  python3 short.py          -> video/L01_Short.mp4 + video/L01_Short.srt
  python3 short.py --cek    -> video/pratinjau/short_kontak.jpg"""
import os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw
import rakit as R
from rakit import F, M, KUNING, GELAP, PUTIH, OY, LOG

D = R.D; W, H, FPS, Z = 1080, 1920, 30, 1.3
# (beat, ekor setelah narasi, baris pertama potongan editor, y awal potongan panel kanan)
KLIP = [("b3_10", 1.2, 1, 190), ("b3_11", 0.5, 1, 190), ("b5_1", 0.4, 1, 77), ("b5_2", 3.5, 16, 77), ("b5_3", 0.5, 16, 77), ("b5_4", 0.9, 16, 77)]
KAIT = ["Bisakah kamu membohongi", "komputer bahwa 2 + 2 = 5?"]
AJAK = ["Video lengkap:", "Apa Itu Lean 4?"]; EKOR = 3.2
S = R.susun()

def susun_klip():
    out = []; t = 0.0
    for bid, ekor, l0, iy in KLIP:
        b = R.B_ID[bid]; a = b["start"] + 0.25; z = b["start"] + 0.4 + b["audio"] + ekor
        out.append(dict(b=b, t0=t, a=a, z=z, l0=l0, iy=iy)); t += z - a
    return out, t
KL, TOT = susun_klip()

def potong(b):
    """-> [(t_rel_beat, teks)] potongan takarir pendek."""
    out = []; cur = []
    for w, a, e in b["words"]:
        cur.append((w, a))
        if re.search(r"[,.?!:]$", w) and len(cur) >= 2 or len(cur) >= 6:
            out.append((cur[0][1], " ".join(x[0] for x in cur))); cur = []
    if cur:
        if out and len(cur) < 2: out[-1] = (out[-1][0], out[-1][1] + " " + cur[0][0])
        else: out.append((cur[0][1], " ".join(x[0] for x in cur)))
    return out
for k in KL: k["tak"] = potong(k["b"])

def bungkus(d, teks, f, maks):
    baris = []; cur = ""
    for w in teks.split():
        if d.textlength((cur + " " + w).strip(), font=f) <= maks: cur = (cur + " " + w).strip()
        else: baris.append(cur); cur = w
    return baris + [cur]

def frame(t, hanya_sig=False):
    k = next((x for x in reversed(KL) if x["t0"] <= t), KL[0]); akhir = t >= TOT
    tm = min(k["a"] + (t - k["t0"]), k["z"] - 0.02)
    ix = -1
    for tt, i in S[0]:
        if tt <= tm: ix = i
        else: break
    tak = None
    if not akhir:
        for a, tx in k["tak"]:
            if k["b"]["start"] + a - 0.08 <= tm: tak = tx
    hs = [(a, z, e) for a, z, e in S[3] if a <= tm <= z]
    sig = (ix, tak, akhir, k["l0"], tuple(id(e) for a, z, e in hs))
    if hanya_sig: return sig
    im = Image.new("RGB", (W, H), GELAP); d = ImageDraw.Draw(im)
    f = F("Bold", 66)
    for i, tx in enumerate(KAIT): d.text(((W - d.textlength(tx, font=f)) / 2, 96 + i * 88), tx, font=f, fill=PUTIH if i == 0 else KUNING)
    sh = R.shot(ix); s = LOG[ix]
    ey0 = 77 + 38 * (k["l0"] - 1); eh = 38 * 7; ew = int(1020 / Z); iy0 = k["iy"]; ih = int(640 / Z); iw = 575
    cy = 340; d.rounded_rectangle((20, cy - 14, W - 20, cy + int(eh * Z) + 20 + 640 + 14), 24, fill=(255, 255, 255))
    ed = sh.crop((0, ey0, ew, ey0 + eh)).resize((1020, int(eh * Z)), Image.LANCZOS); im.paste(ed, (30, cy))
    y2 = cy + int(eh * Z) + 20; d.line((30, y2 - 10, W - 30, y2 - 10), fill=(214, 218, 226), width=3)
    inf = sh.crop((1345, iy0, 1345 + iw, iy0 + ih)).resize((int(iw * Z), 640), Image.LANCZOS); im.paste(inf, (50, y2))
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); do = ImageDraw.Draw(ov)
    for a, z, e in hs:
        for x0, y0, x1, y1 in R.kotak_info(s, e["apa"]):
            y0 -= OY; y1 -= OY
            if x0 < 1310: bx = (30 + x0 * Z, cy + (y0 - ey0) * Z, 30 + x1 * Z, cy + (y1 - ey0) * Z); lim = (cy, cy + eh * Z)
            else: bx = (50 + (x0 - 1345) * Z, y2 + (y0 - iy0) * Z, 50 + (x1 - 1345) * Z, y2 + (y1 - iy0) * Z); lim = (y2, y2 + 640)
            if bx[1] < lim[0] - 4 or bx[3] > lim[1] + 4: continue
            do.rounded_rectangle((bx[0] - 9, bx[1] - 9, bx[2] + 9, bx[3] + 9), 12, fill=KUNING + (34,), outline=(235, 150, 20, 255), width=6)
    im = Image.alpha_composite(im.convert("RGBA"), ov).convert("RGB"); d = ImageDraw.Draw(im)
    ty = y2 + 640 + 50
    if akhir:
        for i, tx in enumerate(AJAK):
            f = F("Bold", 58 if i == 0 else 76); d.text(((W - d.textlength(tx, font=f)) / 2, ty + i * 84), tx, font=f, fill=PUTIH if i == 0 else KUNING)
    elif tak:
        f = F("Bold", 54); bs = bungkus(d, tak, f, 960)
        for i, tx in enumerate(bs): d.text(((W - d.textlength(tx, font=f)) / 2, ty + i * 70), tx, font=f, fill=PUTIH)
    return im

def srt():
    wt = lambda t: f"{int(t // 3600):02d}:{int(t // 60 % 60):02d}:{int(t % 60):02d},{int(round(t % 1 * 1000)) % 1000:03d}"
    cues = []
    for k in KL:
        for a, tx in k["tak"]: cues.append([k["t0"] + k["b"]["start"] + a - k["a"], tx])
    out = []
    for i, (a, tx) in enumerate(cues):
        e = cues[i + 1][0] - 0.03 if i + 1 < len(cues) else TOT
        out.append(f"{i + 1}\n{wt(max(0, a))} --> {wt(e)}\n{tx}\n")
    open(D + "/video/L01_Short.srt", "w", encoding="utf-8").write("\n".join(out))

if __name__ == "__main__":
    print("durasi", round(TOT + EKOR, 1))
    if "--cek" in sys.argv:
        ts = [1.0, 8.6, 12, 20, 24.5, 30, 40, 45.5, 49, 56, TOT - 0.5, TOT + 1]
        sheet = Image.new("RGB", (360 * 6, 640 * 2))
        for i, t in enumerate(ts): sheet.paste(frame(t).resize((360, 640), Image.LANCZOS), ((i % 6) * 360, (i // 6) * 640))
        sheet.save(D + "/video/pratinjau/short_kontak.jpg", quality=85); sys.exit()
    srt()
    fc = "".join(f"[0:a]atrim={k['a']:.3f}:{k['z']:.3f},asetpts=PTS-STARTPTS[a{i}];" for i, k in enumerate(KL)) + "".join(f"[a{i}]" for i in range(len(KL))) + f"concat=n={len(KL)}:v=0:a=1,apad=pad_dur={EKOR}[a]"
    out = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", D + "/audio/narration.wav",
                            "-filter_complex", fc.replace("[0:a]", "[1:a]"), "-map", "0:v", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
                            "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", D + "/video/L01_Short.mp4"], stdin=subprocess.PIPE)
    ls = None; raw = None
    for n in range(round((TOT + EKOR) * FPS)):
        sg = frame(n / FPS, True)
        if sg != ls: raw = np.asarray(frame(n / FPS)).tobytes(); ls = sg
        out.stdin.write(raw)
    out.stdin.close(); out.wait(); print(D + "/video/L01_Short.mp4")
