"""Bandingkan transkrip whisper (dengar/Pnn.txt) dengan naskah per beat: python3 alat/banding.py P05 [ambang=0.9]
Mencetak rasio kemiripan tiap beat dan potongan kata yang berbeda (naskah -> terdengar)."""
import sys, json, re, difflib
ep = sys.argv[1]; amb = float(sys.argv[2]) if len(sys.argv) > 2 else 2.0
nas = {b["no"]: b["teks"] for b in json.load(open(f"/home/user/pinjam/naskah_{ep}.json"))}
def kata(s): return re.sub(r"[^a-z0-9 ]+", " ", s.lower().replace("-", " ")).split()
for bar in open(f"/home/user/pinjam/dengar/{ep}.txt"):
    f, t = bar.split("|", 1); no = int(re.search(r"b(\d+)", f).group(1)); a, b = kata(nas[no]), kata(t)
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False); r = sm.ratio()
    if r >= amb: continue
    beda = [f"{' '.join(a[i1:i2]) or '∅'} -> {' '.join(b[j1:j2]) or '∅'}" for op, i1, i2, j1, j2 in sm.get_opcodes() if op != "equal"]
    print(f"{ep} b{no:02d} {r:.2f} | " + " ; ".join(beda))
