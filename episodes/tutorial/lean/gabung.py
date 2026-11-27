"""Gabung bab 0-8 (video/hd/babN.mp4) + narasi -> video/L01_Apa_Itu_Lean_4.mp4"""
import json, os, subprocess
D = os.path.dirname(os.path.abspath(__file__)); hd = D + "/video/hd"; TL = json.load(open(D + "/timeline.json"))
segs = sorted({b["seg"] for b in TL["beats"]}); inp = sum([["-i", f"{hd}/bab{s}.mp4"] for s in segs], [])
fc = "".join(f"[{i}:v]fps=30,format=yuv420p,setsar=1[v{i}];" for i in range(len(segs))) + "".join(f"[v{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v]"
out = D + "/video/L01_Apa_Itu_Lean_4.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", *inp, "-i", D + "/audio/narration.wav", "-filter_complex", fc, "-map", "[v]", "-map", f"{len(segs)}:a", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
                "-c:a", "aac", "-b:a", "192k", "-t", f"{TL['total']:.2f}", "-movflags", "+faststart", out], check=True)
print(out)
