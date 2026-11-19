import subprocess, json, os, glob, re
SDIR = "suara_uji" if os.environ.get("UJI") else "suara"
def audio(ep):
    d = {}
    for f in sorted(glob.glob(f"/home/user/lapor/{ep}/{SDIR}/b*.mp3")):
        m = re.match(r"b(\d+)(?:_(\d+))?\.mp3$", os.path.basename(f))
        n = int(m.group(1)) if not m.group(2) else float(f"{m.group(1)}.{m.group(2)}")  # b12_5.mp3 = beat sisipan 12.5
        d[n] = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
    return d
LEAD, TAIL = 0.25, 0.45
def beat(ep): return {k: v + LEAD + TAIL for k, v in audio(ep).items()}
def nm(no): return f"{no:02d}" if isinstance(no, int) else f"{int(no):02d}_{str(no).split('.')[1]}"
