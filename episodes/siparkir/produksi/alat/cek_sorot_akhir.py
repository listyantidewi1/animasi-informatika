import sys, re, subprocess, glob, numpy as np
from PIL import Image, ImageDraw, ImageFont
fn = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
def dtk(s): h, m, x = s.split(":"); return int(h) * 3600 + int(m) * 60 + float(x.replace(",", "."))
hits = []
for ep in sys.argv[1:]:
    mp4 = glob.glob(f"/home/user/parkir/{ep}/{ep}_*.mp4")[0]; srt = open(mp4[:-4] + ".srt").read()
    sub = [(dtk(a), dtk(b), t.strip()) for a, b, t in re.findall(r"(\S+) --> (\S+)\n(.+?)\n", srt)]
    p = subprocess.Popen(["ffmpeg", "-nostdin", "-loglevel", "error", "-i", mp4, "-vf", "fps=2,scale=960:540", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    i = 0; aktif = None
    while True:
        raw = p.stdout.read(960 * 540 * 3)
        if len(raw) < 960 * 540 * 3: break
        f = np.frombuffer(raw, np.uint8).reshape(540, 960, 3).astype(int); t = i / 2; i += 1
        d = np.median(f[:, 200:900, 0] - f[:, 200:900, 2], axis=1); ada = (d > 30).sum() >= 6
        if ada and aktif is None: aktif = [t, t, None]
        if ada:
            aktif[1] = t
            if aktif[2] is None and t - aktif[0] >= 1.0: aktif[2] = f.astype(np.uint8)
        if not ada and aktif:
            if aktif[2] is not None:
                ka = " / ".join(s for a, b, s in sub if a < aktif[1] and b > aktif[0])
                hits.append((f"{ep} {aktif[0]:.1f}-{aktif[1]:.1f}s", ka, aktif[2])); print(hits[-1][0], ka[:160], flush=True)
            aktif = None
for k in range(0, len(hits), 8):
    im = Image.new("RGB", (1920, 4 * 610), "white"); dr = ImageDraw.Draw(im)
    for j, (cap, ka, f) in enumerate(hits[k:k + 8]):
        x, y = (j % 2) * 960, (j // 2) * 610; im.paste(Image.fromarray(f), (x, y)); dr.text((x + 4, y + 542), cap + "  " + ka[:70], fill="black", font=fn); dr.text((x + 4, y + 572), ka[70:150], fill="black", font=fn)
    im.save(f"/tmp/claude-0/sor/F_{k // 8 + 1}.png")
