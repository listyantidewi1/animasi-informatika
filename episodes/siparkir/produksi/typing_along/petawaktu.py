"""Ubah cap waktu video lama -> video baru (typing along)."""
import json, os, subprocess, re, sys
HASIL = os.environ.get("HASIL", "/mnt/project-files/siparkir/typing-along/hasil"); FPS = 30
BAB = ["P%02d" % i for i in range(13)]
def dur(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
def muat():
    out = []; t = 0.0
    for P in BAB:
        R = json.load(open(f"{HASIL}/{P}.json")); out.append((R, t)); t += dur(f"{HASIL}/{P}.mp4")
    return out
def baru(x, M):
    for R, tb in M:
        a0 = R["F0"] / FPS; a1 = R["F1"] / FPS
        if a0 - 0.6 <= x < a1:
            g = sum(s["n"] / FPS for s in R["sisip"] if s["c"] + R["t0"] <= x + 0.6)
            return max(0, x - a0) + g + tb
    return x
def ts(s): s = int(s + 0.5); h, m = divmod(s, 3600); m, d = divmod(m, 60); return f"{h}:{m:02d}:{d:02d}" if h else f"{m}:{d:02d}"
def ganti(teks, M):
    def f(m):
        p = [int(x) for x in m.group(0).split(":")]; x = p[0] * 3600 + p[1] * 60 + p[2] if len(p) == 3 else p[0] * 60 + p[1]
        return ts(baru(x, M))
    return re.sub(r"(?<![\d:])(?:\d:)?\d{1,2}:\d{2}(?![\d:])", f, teks)
