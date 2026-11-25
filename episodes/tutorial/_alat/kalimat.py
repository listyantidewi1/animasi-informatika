"""Pecah narasi tiap beat menjadi kalimat (waktu mulai/akhir di MP3) memakai deteksi jeda."""
import json, re, subprocess, sys
def kalimat(teks): return [s.strip() for s in re.split(r"(?<=[.!?])\s+", teks) if s.strip()]
def durf(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
def jeda(f, db=-35, d=0.12):
    o = subprocess.run(["ffmpeg", "-i", f, "-af", f"silencedetect=n={db}dB:d={d}", "-f", "null", "-"], capture_output=True, text=True).stderr
    s = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", o)]; e = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", o)]
    return list(zip(s, e))
def pecah(f, teks):
    K = kalimat(teks); n = len(K); L = durf(f); J = [j for j in jeda(f) if j[0] > 0.3 and j[1] < L - 0.1]
    if n == 1: return [[0.0, L]]
    # perkiraan batas menurut jumlah huruf, lalu pilih jeda terdekat yang cukup panjang
    tot = sum(len(k) for k in K); batas = []; acc = 0
    for k in K[:-1]: acc += len(k); batas.append(L * acc / tot)
    pilih = []
    for b in batas:
        cand = sorted(J, key=lambda j: abs((j[0] + j[1]) / 2 - b) - 0.8 * (j[1] - j[0]))
        cand = [j for j in cand if j not in pilih and (not pilih or j[0] > pilih[-1][1])]
        pilih.append(cand[0] if cand else (b, b))
    seg = []; a = 0.0
    for j in pilih: seg.append([a, j[0] + 0.05]); a = max(j[0] + 0.05, j[1] - 0.06)
    seg.append([a, L]); return seg
if __name__ == "__main__":
    ep = sys.argv[1]; N = json.load(open("/home/user/tut/naskah.json"))[ep]["beats"]; out = {}
    for b in N:
        f = f"/home/user/tut/{ep}/suara/b{b['no']:02d}.mp3"; out[b["no"]] = pecah(f, b["teks"])
        print(b["no"], [round(e - s, 2) for s, e in out[b["no"]]], [len(k) for k in kalimat(b["teks"])])
    json.dump(out, open(f"/home/user/tut/{ep}/kalimat.json", "w"))
