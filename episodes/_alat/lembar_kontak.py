"""Lembar kontak per bab dari video dokumenter yang sudah dirender, untuk diperiksa Bu Dewi sebelum dikirim.
  python3 episodes/_alat/lembar_kontak.py dok/D04            12 cuplikan per bab (4x3) dengan stempel waktu
  python3 episodes/_alat/lembar_kontak.py dok/D04 --n 8      jumlah cuplikan per bab
Keluaran: <episode>/video/kontak/bab<n>.jpg (folder video/ diabaikan git)."""
import glob, json, os, subprocess, sys, tempfile
import episode as E
from PIL import Image, ImageDraw, ImageFont
args = [a for a in sys.argv[1:] if not a.startswith("--")]; N = 12
if "--n" in sys.argv: N = int(sys.argv[sys.argv.index("--n") + 1]); args = [a for a in args if a != str(N)]
ROOT, _ = E.find_root(args); TL = E.load_timeline(ROOT, "suara")
vid = [v for v in glob.glob(os.path.join(ROOT, "video", "Informatika_*_suara.mp4"))]
if not vid: sys.exit("video belum dirender: " + os.path.join(ROOT, "video"))
out = os.path.join(ROOT, "video", "kontak"); os.makedirs(out, exist_ok=True)
try: font = ImageFont.truetype((glob.glob("/usr/share/fonts/**/Inter-Bold.*", recursive=True) + glob.glob("/usr/share/fonts/**/DejaVuSans-Bold.ttf", recursive=True))[0], 30)
except Exception: font = ImageFont.load_default()
segs = {}
for b in TL["beats"]: s = segs.setdefault(b["seg"], [b["start"], 0]); s[1] = max(s[1], b["start"] + b["dur"])
cols = 4; rows = -(-N // cols)
for seg, (a, z) in sorted(segs.items(), key=lambda kv: kv[1][0]):
    sheet = Image.new("RGB", (480 * cols, 270 * rows), "black"); d = ImageDraw.Draw(sheet)
    with tempfile.TemporaryDirectory() as tmp:
        for i in range(N):
            t = a + (z - a) * (i + 0.5) / N; f = os.path.join(tmp, f"{i}.jpg")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", vid[0], "-frames:v", "1", "-vf", "scale=480:270", f], check=True)
            x, y = 480 * (i % cols), 270 * (i // cols); sheet.paste(Image.open(f), (x, y))
            lab = f"{int(t // 60):02d}:{t % 60:06.3f}"; d.rectangle([x, y, x + 170, y + 40], fill="black"); d.text((x + 6, y + 2), lab, fill="yellow", font=font)
    p = os.path.join(out, f"bab{seg}.jpg"); sheet.save(p, quality=88); print(p)
