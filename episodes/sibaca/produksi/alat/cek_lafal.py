"""Cek lafal: transkripsi tiap MP3 beat dengan faster-whisper (small), bandingkan dengan naskah.
python3 cek_lafal.py [EP ...] -> /tmp/claude-0/lafal/<EP>.txt (rasio kemiripan + kata yang berbeda per beat)"""
import sys, json, re, glob, difflib, os, subprocess
import numpy as np
from faster_whisper import WhisperModel
B = "/home/user/baca"; eps = sys.argv[1:] or [f"B{i:02d}" for i in range(12)]
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=int(os.environ.get("UTAS", "2")))
def kata(s): return re.findall(r"[a-z0-9]+", s.lower())
for ep in eps:
    out = open(f"/tmp/claude-0/lafal/{ep}.txt", "w")
    for b in json.load(open(f"{B}/naskah_{ep}.json")):
        f = f"{B}/{ep}/suara/b{b['no']:02d}.mp3"
        if not os.path.exists(f): out.write(f"b{b['no']:02d} TIDAK ADA\n"); continue
        au = np.frombuffer(subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout, np.float32)
        seg, _ = m.transcribe(au, language="id", beam_size=3, vad_filter=False, condition_on_previous_text=False)
        t = " ".join(s.text for s in seg); a, c = kata(b["teks"]), kata(t)
        sm = difflib.SequenceMatcher(None, a, c); beda = [f"{' '.join(a[i1:i2])} -> {' '.join(c[j1:j2])}" for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag != "equal"]
        out.write(f"b{b['no']:02d} {sm.ratio():.3f} | " + " ; ".join(beda) + "\n"); out.flush()
    out.close(); print("selesai", ep, flush=True)
