"""Pulihkan narasi per beat dari video akhir lama (MP3 asli tidak tersimpan). Tanpa kredit ElevenLabs.
Memakai SRT akhir: tiap kalimat berurutan sesuai naskah; awal beat = awal kalimat pertama, akhir = akhir kalimat terakhir.
Keluaran: <EP>/suara/bNN.mp3 + bNN.json (awal tiap kalimat, disesuaikan ke jeda hening terdekat). Idempoten."""
import json, re, os, subprocess, sys, numpy as np
B = "/home/user/antre"; SRC = "/mnt/project-files/antrean/Sistem_Antrean_dari_Nol"
sys.path.insert(0, B + "/alat"); from durasi import nm
URUT = ["A00", "P01"] + [f"A{i:02d}" for i in range(1, 13)]
def s(t): h, m, r = t.split(":"); d, ms = r.split(","); return int(h) * 3600 + int(m) * 60 + int(d) + int(ms) / 1000
blok = [b.split("\n") for b in open(SRC + ".srt").read().strip().split("\n\n")]
srt = [(s(b[1].split("-->")[0].strip()), s(b[1].split("-->")[1].strip()), " ".join(b[2:]).strip()) for b in blok]
wav = "/tmp/claude-0/lama.wav"
if not os.path.exists(wav): subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", SRC + ".mp4", "-vn", "-ar", "44100", "-ac", "1", wav], check=True)
i = 0
for ep in URUT:
    N = json.load(open(f"{B}/naskah_{ep}.json")) + json.load(open(f"{B}/naskah_sisip.json")).get(ep, [])
    os.makedirs(f"{B}/{ep}/suara", exist_ok=True)
    for b in sorted(N, key=lambda x: x["no"]):
        kal = [x.strip() for x in re.split(r"(?<=[.!?])\s+", b["teks"]) if x.strip()]
        for j, k in enumerate(kal):
            assert srt[i + j][2] == k, (ep, b["no"], srt[i + j][2], k)
        a, z = srt[i][0], srt[i + len(kal) - 1][1] + 0.05; i += len(kal)
        # SRT bisa meleset beberapa ratus ms: ambil jendela lebih lebar lalu pangkas ke bagian bersuara (antarbeat hening >= 2 dtk)
        raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", f"{a - 0.9:.3f}", "-t", f"{z - a + 1.8:.3f}", "-i", wav, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
        x = np.abs(np.frombuffer(raw, np.int16).astype(np.float32)); e = np.sqrt(np.convolve(x * x, np.ones(320) / 320, "same")); idx = np.where(e > 250)[0]
        a, z = a - 0.9 + idx[0] / 16000 - 0.06, a - 0.9 + idx[-1] / 16000 + 0.12
        out = f"{B}/{ep}/suara/b{nm(b['no'])}.mp3"
        if os.path.exists(out) and os.path.exists(out[:-4] + ".json") and "senyap" in open(out[:-4] + ".json").read(): continue
        r = subprocess.run(["ffmpeg", "-y", "-ss", f"{a:.3f}", "-t", f"{z - a:.3f}", "-i", wav, "-af", "silencedetect=noise=-38dB:d=0.18", "-c:a", "libmp3lame", "-b:a", "160k", out], capture_output=True, text=True).stderr
        st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r)]; en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r)]
        hen = list(zip(st, en)); tot = sum(len(x) for x in kal); D = z - a; mulai = [0.0]; senyap = [True]
        for j in range(1, len(kal)):
            p = D * sum(len(x) for x in kal[:j]) / tot
            c = [h for h in hen if abs((h[0] + h[1]) / 2 - p) < 1.6 and h[1] > mulai[-1] + 0.5]
            if c: h = min(c, key=lambda h: abs((h[0] + h[1]) / 2 - p) - (h[1] - h[0])); p = h[1] - 0.05  # kalimat mulai di akhir hening
            mulai.append(round(max(p, mulai[-1] + 0.3), 3)); senyap.append(bool(c))
        json.dump({"kalimat": mulai, "senyap": senyap, "akhir": round(D, 3), "sumber": "potong"}, open(out[:-4] + ".json", "w"))
    print(ep, len(N), "beat", flush=True)
assert i == len(srt), (i, len(srt)); print("semua kalimat cocok:", i)
