import subprocess, json, os, glob
def audio(ep):
    d = {}
    for f in sorted(glob.glob(f"/home/user/tut/{ep}/suara/b*.mp3")):
        n = int(os.path.basename(f)[1:3])
        d[n] = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
    return d
LEAD, TAIL = 0.25, 0.45
def beat(ep): return {k: v + LEAD + TAIL for k, v in audio(ep).items()}
