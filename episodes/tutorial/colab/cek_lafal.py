"""Cek lafal narasi dengan faster-whisper + simpan waktu per kata (kata.json). python3 cek_lafal.py [model]"""
import sys, json, subprocess, numpy as np, os
from faster_whisper import WhisperModel
from naskah import BEATS
D = os.path.dirname(os.path.abspath(__file__)); m = WhisperModel(sys.argv[1] if len(sys.argv) > 1 else "small", device="cpu", compute_type="int8")
out = {}
HANYA = set(sys.argv[2].split(',')) if len(sys.argv) > 2 else None
for b in BEATS:
    if HANYA and b[0] not in HANYA: continue
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f"{D}/suara/{b[0]}.mp3", "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
    a = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
    segs, _ = m.transcribe(a, language="id", word_timestamps=True, initial_prompt="Google Colab, notebook, print, TypeError, Sign in, Next, New notebook, Untitled, Enter, Control, Python.")
    kata = [[round(w.start, 2), round(w.end, 2), w.word.strip()] for s in segs for w in s.words]
    out[b[0]] = kata; print(b[0], "|", " ".join(k[2] for k in kata), flush=True)
if not HANYA: json.dump(out, open(D + "/kata.json", "w"), indent=0)
