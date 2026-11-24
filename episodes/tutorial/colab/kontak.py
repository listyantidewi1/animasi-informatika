"""Lembar kontak dari video: python3 kontak.py <video> <keluar.png> <kolom> t1 t2 ... (lebar tiap gambar 960)"""
import sys, subprocess, os, tempfile
v, out, kol = sys.argv[1], sys.argv[2], int(sys.argv[3]); ts = sys.argv[4:]; L = int(os.environ.get("LEBAR", "960"))
d = tempfile.mkdtemp(); fs = []
for i, t in enumerate(ts):
    f = f"{d}/{i}.png"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", t, "-i", v, "-frames:v", "1", "-vf", f"scale={L}:-1,drawtext=text='{t}':x=8:y=8:fontsize=28:fontcolor=yellow:box=1:boxcolor=black@0.7", f]); fs.append(f)
while len(fs) % kol: fs.append(fs[-1])
rows = [fs[i:i + kol] for i in range(0, len(fs), kol)]
inp = sum([["-i", f] for f in fs], []); fc = ""; n = 0
for ri, r in enumerate(rows):
    fc += "".join(f"[{n + k}]" for k in range(len(r))) + (f"hstack={len(r)}[r{ri}];" if len(r) > 1 else f"null[r{ri}];"); n += len(r)
fc += "".join(f"[r{i}]" for i in range(len(rows))) + (f"vstack={len(rows)}" if len(rows) > 1 else "null")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y"] + inp + ["-filter_complex", fc, out])
