"""Lembar QA: frame tiap N detik dari video bab + kalimat narasi (SRT) yang sedang terdengar di bawahnya.
python3 qa.py A05 [jarak=5] -> /tmp/claude-0/qa/A05_hNN.png (20 frame per lembar)"""
import sys, re, subprocess, os, glob
from PIL import Image, ImageDraw, ImageFont
ep = sys.argv[1]; jarak = float(sys.argv[2]) if len(sys.argv) > 2 else 5
mp4 = [f for f in glob.glob(f"/home/user/lapor/{ep}/{ep}_*.mp4")][0]; srt = open(mp4[:-4] + ".srt").read()
def dtk(s): h, m, x = s.split(":"); return int(h) * 3600 + int(m) * 60 + float(x.replace(",", "."))
sub = [(dtk(a), dtk(b), t.strip()) for a, b, t in re.findall(r"(\S+) --> (\S+)\n(.+?)\n", srt)]
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4]))
out = f"/tmp/claude-0/qa/{ep}"; os.makedirs(out, exist_ok=True)
for f in glob.glob(out + "/*"): os.remove(f)
subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-i", mp4, "-vf", f"fps=1/{jarak},scale=640:-1", f"{out}/f%04d.png"])
fr = sorted(glob.glob(out + "/f*.png")); fn = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
W, H, TH = 640, 360, 58
for k in range(0, len(fr), 20):
    lb = Image.new("RGB", (W * 4, (H + TH) * 5), "white"); d = ImageDraw.Draw(lb)
    for j, f in enumerate(fr[k:k + 20]):
        i = k + j; t = i * jarak + jarak / 2 if False else i * jarak
        x, y = (j % 4) * W, (j // 4) * (H + TH); lb.paste(Image.open(f), (x, y))
        teks = next((s for a, b, s in sub if a <= t + 0.5 <= b + 0.6), "")
        d.text((x + 4, y + H + 2), f"{int(t // 60)}:{int(t % 60):02d}  {teks[:75]}", fill="black", font=fn)
        d.text((x + 4, y + H + 22), teks[75:150], fill="black", font=fn)
    lb.save(f"/tmp/claude-0/qa/{ep}_h{k // 20 + 1:02d}.png")
print(len(fr), "frame")
