"""Waktu kata per beat dengan faster-whisper (lokal, gratis) + transkrip untuk cek lafal.
  python3 osn/_inti/waktu_kata.py osn/ON01 [--model medium] [--ulang] [--hanya k1 s2]
Hasil: suara_in/waktu/<id>.json = [[kata_naskah, mulai, selesai], ...] (jumlah = jumlah token naskah; kata yang tidak
terdengar diinterpolasi), dan suara_in/lafal.txt (naskah vs dengar, kata yang berbeda ditandai)."""
import json, os, re, subprocess, sys, difflib
import numpy as np
from faster_whisper import WhisperModel
args = sys.argv[1:]; ep = args[0]; ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ep)
MODEL = args[args.index("--model") + 1] if "--model" in args else "medium"; ULANG = "--ulang" in args
HANYA = args[args.index("--hanya") + 1:] if "--hanya" in args else []
S = json.load(open(os.path.join(ROOT, "script.json"))); SRC = os.path.join(ROOT, "suara_in", "suara"); OUT = os.path.join(ROOT, "suara_in", "waktu"); os.makedirs(OUT, exist_ok=True)
m = None
class _M:
    def transcribe(self, *a, **k):
        global m
        if m is None: m = WhisperModel(MODEL, device="cpu", compute_type="int8")
        return m.transcribe(*a, **k)
M = _M()
norm = lambda w: re.sub(r"[^0-9a-z]", "", w.lower())
SAT = ["nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"]
def kata(n):
    """angka -> kata Indonesia (sampai jutaan)"""
    if n < 10: return SAT[n]
    if n == 10: return "sepuluh"
    if n == 11: return "sebelas"
    if n < 20: return SAT[n - 10] + " belas"
    if n < 100: return SAT[n // 10] + " puluh" + ("" if n % 10 == 0 else " " + SAT[n % 10])
    if n < 1000: h = "seratus" if n < 200 else SAT[n // 100] + " ratus"; return h + ("" if n % 100 == 0 else " " + kata(n % 100))
    if n < 1000000: r = "seribu" if n < 2000 else kata(n // 1000) + " ribu"; return r + ("" if n % 1000 == 0 else " " + kata(n % 1000))
    return str(n)
def expand(hw):
    """kata whisper berupa angka ("302", "2026", "100%", "1.006") dipecah menjadi kata-kata dengan waktu dibagi rata"""
    out = []
    for w, s0, s1 in hw:
        m = re.fullmatch(r"([^0-9]*)([0-9][0-9.]*)(%?)([^0-9]*)", w)
        if not m: out.append((w, s0, s1)); continue
        digits = m.group(2).rstrip("."); 
        try: n = int(digits.replace(".", ""))
        except ValueError: out.append((w, s0, s1)); continue
        ws = (kata(n) if not (len(digits) > 1 and digits.startswith("0")) else " ".join(SAT[int(c)] for c in digits)).split()
        if m.group(3): ws += ["persen"]
        d = (s1 - s0) / len(ws)
        out += [(x, s0 + i * d, s0 + (i + 1) * d) for i, x in enumerate(ws)]
    return out
rep = []
for b in S["beats"]:
    if not b["text"] or (HANYA and b["id"] not in HANYA): continue
    out = os.path.join(OUT, b["id"] + ".json")
    if os.path.exists(out) and not ULANG and not HANYA: continue
    rawp = os.path.join(ROOT, "suara_in", "waktu_raw", b["id"] + ".json"); os.makedirs(os.path.dirname(rawp), exist_ok=True)
    if os.path.exists(rawp) and "--whisper" not in args: hw = [tuple(x) for x in json.load(open(rawp))]
    else:
      raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(SRC, b["id"] + ".mp3"), "-ar", "16000", "-ac", "1", "-f", "f32le", "-"], capture_output=True).stdout
      a = np.frombuffer(raw, dtype=np.float32)
      segs, _ = M.transcribe(a, language="id", word_timestamps=True, beam_size=5, initial_prompt="OSN-K, Pak Dengklek, Tim Olimpiade Komputer Indonesia, biner.")
      hw = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]; json.dump(hw, open(rawp, "w"), ensure_ascii=False)
    heard = " ".join(h[0] for h in hw); hw = expand(hw)
    toks = b["text"].split(); nt = [norm(t) for t in toks]; nh = [norm(h[0]) for h in hw]
    tm = [None] * len(toks)
    for blk in difflib.SequenceMatcher(None, nt, nh, autojunk=False).get_matching_blocks():
        for k in range(blk.size): tm[blk.a + k] = (hw[blk.b + k][1], hw[blk.b + k][2])
    # interpolasi token yang tidak cocok
    total = hw[-1][2] + 0.3 if hw else 1.0; known = [i for i, x in enumerate(tm) if x]
    for i in range(len(toks)):
        if tm[i]: continue
        p = max([k for k in known if k < i], default=None); q = min([k for k in known if k > i], default=None)
        t0 = tm[p][1] if p is not None else 0.0; t1 = tm[q][0] if q is not None else total
        n0 = p if p is not None else -1; n1 = q if q is not None else len(toks)
        u0 = t0 + (t1 - t0) * (i - n0 - 1 + 0.0) / (n1 - n0 - 1); u1 = t0 + (t1 - t0) * (i - n0) / (n1 - n0 - 1)
        tm[i] = (round(u0, 3), round(u1, 3))
    json.dump([[t, round(x[0], 3), round(x[1], 3)] for t, x in zip(toks, tm)], open(out, "w"), ensure_ascii=False)
    diff = [t for t, x in zip(toks, nt) if x not in set(nh)]
    rep.append(f"[{b['id']}]\n  naskah: {b['text']}\n  dengar: {heard}\n  beda  : {' '.join(diff) or '-'}\n")
    print(b["id"], "beda:", " ".join(diff) or "-", flush=True)
open(os.path.join(ROOT, "suara_in", "lafal.txt"), "a").write("\n".join(rep))
