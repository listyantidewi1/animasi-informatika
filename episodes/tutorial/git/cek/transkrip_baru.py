import sys, subprocess, numpy as np, glob, os, time
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
fs = [f for f in glob.glob("/home/user/git-seri/prod/ep/G0*/suara/*.mp3") if time.time() - os.path.getmtime(f) < 3600 * 3 and len(os.path.basename(f)) == 14]
for f in sorted(fs, key=os.path.getmtime):
    a = np.frombuffer(subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
    seg, _ = m.transcribe(a, language="id"); print(f.split("/")[-3], round(len(a) / 16000, 1), " ".join(s.text.strip() for s in seg), flush=True)
