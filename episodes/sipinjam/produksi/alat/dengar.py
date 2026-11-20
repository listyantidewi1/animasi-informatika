"""Transkrip whisper untuk cek lafal: python3 alat/dengar.py berkas.mp3 [...]"""
import sys, subprocess, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=int(__import__("os").environ.get("UTAS", "1")))
for f in sys.argv[1:]:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
    seg, _ = m.transcribe(np.frombuffer(raw, np.float32), language="id", beam_size=3)
    print(f.split("/")[-1], "|", " ".join(s.text.strip() for s in seg), flush=True)
