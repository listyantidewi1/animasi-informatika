"""Cek lafal narasi dengan faster-whisper (small, CPU). cek_lafal.py P01 P02 ...
Audio didekode lewat ffmpeg (PyAV di kontainer rusak). Hasil: /tmp/claude-0/lafal/<Pnn>.txt berisi kata yang berbeda
antara naskah dan hasil dengar. Perbedaan ejaan biasa (angka, tanda baca) wajar; yang dicari adalah istilah yang salah ucap."""
import sys, json, re, subprocess, os, difflib
import numpy as np
from faster_whisper import WhisperModel
B = "/home/user/parkir"; O = "/tmp/claude-0/lafal"; os.makedirs(O, exist_ok=True)
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=int(os.environ.get("INTI", "2")))
def kata(t): return re.sub(r"[^a-z0-9 ]", " ", t.lower().replace("-", " ")).split()
for ep in sys.argv[1:]:
    nas = {b["no"]: b["teks"] for b in json.load(open(f"{B}/naskah_{ep}.json"))}; out = []
    for no, teks in sorted(nas.items()):
        f = f"{B}/{ep}/suara/b{no:02d}.mp3"
        if not os.path.exists(f): continue
        pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
        a = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
        seg, _ = m.transcribe(a, language="id", beam_size=3, vad_filter=False)
        dengar = " ".join(s.text for s in seg)
        A, D = kata(teks), kata(dengar); beda = []
        for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, A, D, autojunk=False).get_opcodes():
            if op != "equal": beda.append(f"  [{' '.join(A[i1:i2])}] -> [{' '.join(D[j1:j2])}]")
        out.append(f"b{no}: {len(beda)} beda\n" + "\n".join(beda))
        print(ep, no, len(beda), flush=True)
    open(f"{O}/{ep}.txt", "w").write("\n".join(out) + "\n")
