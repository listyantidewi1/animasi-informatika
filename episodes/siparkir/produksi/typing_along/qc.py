"""QC sinkron: untuk tiap sisipan di bab P, frame pada kalimat sebelum dan sesudah sisipan + teksnya -> qc_P.png"""
import json, os, sys, subprocess, textwrap
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import peta
HASIL = os.environ.get("HASIL", "/mnt/project-files/siparkir/typing-along/hasil"); FPS = 30
P = sys.argv[1]; R = json.load(open(f"{HASIL}/{P}.json")); a0 = R["F0"] / FPS; a1 = R["F1"] / FPS
srt = [(a - a0, b - a0, t) for a, b, t in peta.baca_srt() if a0 - 0.01 <= a < a1 - 0.01]
off = R["t0"] - a0
def geser(x): return sum(s["n"] / FPS for s in R["sisip"] if s["c"] + off <= x + 0.05)
d = f"/home/user/kerja/qc_{P}"; os.makedirs(d, exist_ok=True); n = 0
for s in R["sisip"]:
    j = next((i for i, x in enumerate(srt) if x[0] >= s["c"] + off - 0.01), len(srt))
    for i in [j - 1, j]:
        if 0 <= i < len(srt):
            a, b, t = srt[i]; tn = a + geser(a) + 0.6
            f = f"{d}/{n:02d}.png"; open(f"{d}/t.txt", "w").write(f"{s['id']} {'SEBELUM' if i < j else 'SESUDAH'} @{tn:.1f}: " + "\n".join(textwrap.wrap(t, 70)))
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{tn:.2f}", "-i", f"{HASIL}/{P}.mp4", "-frames:v", "1", "-vf",
                            f"scale=640:-1,pad=640:440:0:0:color=black,drawtext=fontfile=/usr/share/fonts/opentype/inter/Inter-Medium.otf:textfile={d}/t.txt:x=8:y=368:fontsize=15:fontcolor=white", f], check=True); n += 1
subprocess.run(f"ffmpeg -loglevel error -y -pattern_type glob -i '{d}/*.png' -vf tile=3x{(n+2)//3} -frames:v 1 /home/user/kerja/qc_{P}.png", shell=True, check=True)
print("ok", n)
