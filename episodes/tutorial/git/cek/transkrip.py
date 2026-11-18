import glob, json, sys, subprocess, numpy as np
def baca(f): return np.frombuffer(subprocess.check_output(["ffmpeg","-loglevel","error","-i",f,"-ac","1","-ar","16000","-f","f32le","-"]),np.float32)
from faster_whisper import WhisperModel
m = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=4)
out = {}
for f in sorted(glob.glob("/home/user/git-seri/prod/ep/G0*/suara/b*.mp3")):
    seg, _ = m.transcribe(baca(f), language="id", beam_size=1, vad_filter=False)
    out[f] = " ".join(s.text.strip() for s in seg); print(f, out[f], flush=True)
    json.dump(out, open("/home/user/git-seri/cek/transkrip.json", "w"), ensure_ascii=False, indent=1)
