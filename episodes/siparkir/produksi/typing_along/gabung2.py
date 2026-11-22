"""Gabung hasil/Pxx.mp4 -> video penuh + SRT + chapter (urut, idempoten)."""
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import peta
HASIL = os.environ.get("HASIL", "/mnt/project-files/siparkir/typing-along/hasil"); FPS = 30
JUDUL = [l.split(" ", 1)[1] for l in open("/mnt/project-files/siparkir/chapter.txt").read().strip().split("\n")]
def dur(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
def ts(s): h, m = divmod(int(s), 3600); m, d = divmod(m, 60); return f"{h}:{m:02d}:{d:02d}" if h else f"{m}:{d:02d}"
def srt_t(s): ms = round(s * 1000); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); d, ms = divmod(ms, 1000); return f"{h:02d}:{m:02d}:{d:02d},{ms:03d}"
srt = peta.baca_srt(); out_srt = []; bab = []; daftar = []; t_baru = 0.0
for k, P in enumerate(peta.BAB):
    R = json.load(open(f"{HASIL}/{P}.json")); f = f"{HASIL}/{P}.mp4"; daftar.append(f"file '{f}'")
    a0 = R["F0"] / FPS; a1 = R["F1"] / FPS; bab.append(f"{ts(t_baru)} {JUDUL[k]}")
    def geser(x): return sum(s["n"] / FPS for s in R["sisip"] if s["c"] + R["t0"] <= x + 0.05)
    for a, b, teks in srt:
        if a0 - 0.01 <= a < a1 - 0.01:
            g = geser(a); out_srt.append((a - a0 + g + t_baru, b - a0 + g + t_baru, teks))
    t_baru += dur(f)
NAMA = "SiParkir_Laravel_dari_Nol_typing_along"; OUT = os.environ.get("OUT", "/mnt/project-files/siparkir/typing-along")
open("/home/user/kerja/gabung2.txt", "w").write("\n".join(daftar) + "\n")
if "--tanpa-video" not in sys.argv:
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", "/home/user/kerja/gabung2.txt", "-c", "copy", "-movflags", "+faststart", f"/home/user/kerja/{NAMA}.mp4"], check=True)
    subprocess.run(["cp", f"/home/user/kerja/{NAMA}.mp4", f"{OUT}/{NAMA}.mp4"], check=True)
open(f"{OUT}/{NAMA}.srt", "w").write("\n".join(f"{i+1}\n{srt_t(a)} --> {srt_t(b)}\n{t}\n" for i, (a, b, t) in enumerate(out_srt)))
open(f"{OUT}/chapter.txt", "w").write("\n".join(bab) + "\n")
print("durasi", ts(t_baru)); print("\n".join(bab))
