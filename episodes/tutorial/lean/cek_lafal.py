"""Cek lafal narasi dengan faster-whisper: python3 cek_lafal.py [model] [id,id]  -> uji/lafal.txt"""
import sys, json, subprocess, numpy as np, os
from faster_whisper import WhisperModel
D = os.path.dirname(os.path.abspath(__file__)); m = WhisperModel(sys.argv[1] if len(sys.argv) > 1 else "small", device="cpu", compute_type="int8")
HANYA = set(sys.argv[2].split(",")) if len(sys.argv) > 2 else None
for b in json.load(open(D + "/script.json"))["beats"]:
    if HANYA and b["id"] not in HANYA: continue
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f"{D}/suara_in/suara/{b['id']}.mp3", "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
    a = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
    segs, _ = m.transcribe(a, language="id", initial_prompt="Lean, Mathlib, theorem, intro, constructor, exact, sorry, goal, kernel, eval, def, Nat, Prop, rfl, rw, by, browser, Visual Studio Code, Extensions, Natural Number Game, Zulip.")
    print(b["id"], "|", " ".join(s.text.strip() for s in segs), flush=True)
