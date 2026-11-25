"""Render bab Manim D11.
  python3 render_manim.py 0 1 2        render bab (kualitas pratinjau 480p15) + lembar kontak per beat
  python3 render_manim.py --hd 0 1     render 1080p30 (untuk video akhir)
  python3 render_manim.py --gabung     gabung semua bab 1080p + narasi (audio/narration.wav bila ada) -> ../video/
Hasil pratinjau: ../video/pratinjau/babN.mp4 dan ../video/pratinjau/babN_kontak.jpg"""
import json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(D)
HD = "--hd" in sys.argv; args = [a for a in sys.argv[1:] if not a.startswith("--")]
OUT = os.path.join(R, "video", "hd" if HD else "pratinjau"); os.makedirs(OUT, exist_ok=True)
from kit import TL, TL_PATH


def render(seg):
    q = ["-qh", "--fps", "30"] if HD else ["-ql"]
    media = os.path.join(R, "video", "media")
    subprocess.run(["manim", *q, "--disable_caching", "--media_dir", media, "-o", f"bab{seg}.mp4", os.path.join(D, f"bab{seg}.py"), f"Bab{seg}"], check=True, cwd=D)
    sub = "1080p30" if HD else "480p15"
    src = os.path.join(media, "videos", f"bab{seg}", sub, f"bab{seg}.mp4"); dst = os.path.join(OUT, f"bab{seg}.mp4")
    os.replace(src, dst); return dst


def kontak(seg, mp4):
    beats = [b for b in TL["beats"] if b["seg"] == seg]; t0 = beats[0]["start"]; tmp = os.path.join(OUT, "_k"); os.makedirs(tmp, exist_ok=True)
    files = []
    for i, b in enumerate(beats):
        for j, t in enumerate([b["speech"] - t0 + (b["audio"] * 0.5), b["start"] - t0 + b["dur"] - 0.35]):
            f = os.path.join(tmp, f"{i:02d}_{j}.png")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(0, t):.2f}", "-i", mp4, "-frames:v", "1", "-vf",
                            f"scale=480:-1,drawtext=text='{b['id']} {'tengah' if j == 0 else 'akhir'}':fontcolor=white:fontsize=16:x=6:y=6:box=1:boxcolor=black@0.6", f], check=True)
            files.append(f)
    cols = 4; rows = (len(files) + cols - 1) // cols
    inp = sum([["-i", f] for f in files], [])
    lay = "|".join(f"{(k % cols) * 480}_{(k // cols) * 270}" for k in range(len(files)))
    out = os.path.join(OUT, f"bab{seg}_kontak.jpg")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inp, "-filter_complex", f"xstack=inputs={len(files)}:layout={lay}:fill=black", "-q:v", "3", out], check=True)
    for f in files: os.remove(f)
    return out


if "--gabung" in sys.argv:
    hd = os.path.join(R, "video", "hd"); segs = sorted({b["seg"] for b in TL["beats"]})
    lst = os.path.join(hd, "daftar.txt"); open(lst, "w").write("".join(f"file 'bab{s}.mp4'\n" for s in segs))
    vid = os.path.join(hd, "gabung_video.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", vid], check=True)
    aud = os.path.join(R, "audio", "narration.wav")
    out = os.path.join(R, "video", "D11_AI_Mengklaim_VP_vs_VNP.mp4")
    if os.path.exists(aud):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", vid, "-i", aud, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out], check=True)
    else:
        os.replace(vid, out)
    print(out); sys.exit()

print("timeline:", os.path.basename(TL_PATH))
for a in args:
    s = int(a); mp4 = render(s)
    print(mp4)
    if not HD: print(kontak(s, mp4))
