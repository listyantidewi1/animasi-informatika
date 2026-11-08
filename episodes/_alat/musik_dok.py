"""Musik latar untuk video dokumenter, disusun dengan kode (tanpa unduhan, aman lisensi), lalu dicampur dengan narasi.

  python3 episodes/_alat/musik_dok.py dok/D01            buat musik dan campuran -> audio/narration.wav (dipakai render.py --suara)
  python3 episodes/_alat/musik_dok.py dok/D01 --dengar   juga simpan audio/musik.wav (musik saja) untuk didengar

Narasi asli dari voice.py disimpan sebagai audio/narration_vo.wav; setiap kali voice.py dijalankan ulang (timeline.json lebih baru),
salinan itu diperbarui dulu. Isi musik:
  - pad akor ambient yang lembut (progresi per bab, nada dasar berganti mengikuti suasana bab),
  - denting bel jarang seperti bintang,
  - desir naik + dentum rendah pada kartu judul bab, dan tutup yang hangat.
Volume musik turun otomatis saat narator bicara (ducking) dan naik di jeda antarbab.
Opsional per episode:
  - script.json "musik": {"mood": {"0": "misteri", ...}} mengganti suasana per bab (kagum, misteri, renung, hangat);
  - sfx.json (dibuat sfx_dok.py dari Kiko.sfx di scenes.js): efek suara [detik, jenis, kekuatan] dengan jenis
    whoosh (desir), clack (ketuk mendarat), shimmer (denting berkilau), riser (naik), boom (dentum), pop (letup kecil).
"""
import json, os, sys, wave, shutil
import numpy as np
import episode as E

ROOT, _ = E.find_root([a for a in sys.argv[1:] if not a.startswith("--")])
TL = E.load_timeline(ROOT, "suara"); SCRIPT = E.load_script(ROOT)
AUD = os.path.join(ROOT, "audio"); NAR = os.path.join(AUD, "narration.wav"); VO = os.path.join(AUD, "narration_vo.wav")
if not os.path.exists(VO) or os.path.getmtime(E.timeline_path(ROOT, "suara")) > os.path.getmtime(VO): shutil.copyfile(NAR, VO)
SR = 44100

def read_wav(p):
    w = wave.open(p); sr, n, ch = w.getframerate(), w.getnframes(), w.getnchannels(); x = np.frombuffer(w.readframes(n), dtype=np.int16).astype(np.float32) / 32768
    if ch == 2: x = x.reshape(-1, 2).mean(1)
    if sr != SR: x = np.interp(np.arange(int(len(x) * SR / sr)) / SR, np.arange(len(x)) / sr, x).astype(np.float32)
    return x

vo = read_wav(VO); N = max(len(vo), int(TL["total"] * SR)) + SR; vo = np.pad(vo, (0, N - len(vo)))
t = np.arange(N) / SR
rng = np.random.default_rng(7)

def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp(x, fc):  # filter lolos-rendah satu kutub
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); acc = 0.0
    # vektorisasi lewat lfilter sederhana tidak tersedia; pakai cumulative trick per blok
    from itertools import accumulate
    y[:] = np.fromiter(accumulate(x * (1 - a), lambda p, v: p * a + v), dtype=np.float32, count=len(x)); return y

# ---------- progresi per bab (nada MIDI akor) ----------
# suasana: 0 pembuka (penasaran), 1–3 kagum, 4–5 misteri, 6 perdebatan, 7 merenung, 8–9 hangat
PROG = {
    "kagum":   [[57, 64, 67, 71], [53, 60, 64, 69], [48, 55, 60, 64], [55, 62, 67, 71]],   # Am9 – Fmaj7 – C – G
    "misteri": [[50, 57, 60, 65], [46, 53, 58, 62], [43, 50, 55, 58], [45, 52, 57, 61]],   # Dm – Bb – Gm – A
    "renung":  [[52, 59, 62, 67], [48, 55, 59, 64], [45, 52, 55, 60], [47, 54, 57, 62]],   # Em – C – Am – Bm
    "hangat":  [[48, 55, 64, 67], [53, 60, 65, 69], [57, 64, 67, 72], [55, 62, 67, 71]],   # C – F – Am – G
    "tegang":  [[48, 55, 58, 63], [44, 51, 56, 60], [41, 48, 53, 56], [43, 50, 55, 59]],   # Cm – Ab – Fm – G (+ denyut rendah)
}
V2 = SCRIPT.get("musik", {}).get("versi", 1) >= 2   # versi 2 (audit D02): stereo, ducking per kalimat utuh, master −14 LUFS/−1 dBTP
MOOD = {0: "kagum", 1: "kagum", 2: "kagum", 3: "kagum", 4: "misteri", 5: "misteri", 6: "renung", 7: "renung", 8: "hangat", 9: "hangat"}
MOOD.update({int(k): v for k, v in SCRIPT.get("musik", {}).get("mood", {}).items()})
segs = {}
for b in TL["beats"]: s = b["seg"]; segs.setdefault(s, [b["start"], b["start"] + b["dur"]]); segs[s][1] = b["start"] + b["dur"]

music = np.zeros(N, dtype=np.float32)
CH = 8.0  # detik per akor
for s, (a, z) in sorted(segs.items()):
    prog = PROG[MOOD.get(s, "kagum")]; k = 0; c0 = a
    while c0 < z:
        notes = prog[k % len(prog)]; c1 = min(c0 + CH, z + 1.5); i0, i1 = int(c0 * SR), min(N, int((c1 + 2.5) * SR)); tt = t[i0:i1] - c0
        env = np.clip(tt / 2.5, 0, 1) * np.clip((c1 + 2.5 - c0 - tt) / 2.5, 0, 1)
        sig = np.zeros(i1 - i0, dtype=np.float32)
        for j, m in enumerate(notes):
            f = midi(m); det = [0.997, 1.0, 1.004]
            for d in det: sig += (np.sin(2 * np.pi * f * d * tt + j) + 0.25 * np.sin(4 * np.pi * f * d * tt)) / (len(det) * len(notes))
            sig += 0.5 * np.sin(2 * np.pi * f / 2 * tt) / len(notes) if j == 0 else 0
        music[i0:i1] += 0.55 * sig * env * (0.85 + 0.15 * np.sin(2 * np.pi * 0.07 * tt))
        # denting bel jarang dari nada akor, oktaf atas
        for _ in range(2 if MOOD.get(s) != "renung" else 1):
            bt = c0 + rng.uniform(0.5, CH - 1); m = notes[rng.integers(1, len(notes))] + 24; j0 = int(bt * SR); L = int(3.5 * SR)
            if j0 + L < N: tb = np.arange(L) / SR; music[j0:j0 + L] += 0.10 * np.sin(2 * np.pi * midi(m) * tb) * np.exp(-tb * 1.6) * (1 + 0.3 * np.sin(2 * np.pi * midi(m) * 2.01 * tb) * np.exp(-tb * 3))
        if V2 and MOOD.get(s) == "tegang":   # denyut jantung rendah, dua ketukan tiap 1,1 detik
            for hb in np.arange(c0, min(c0 + CH, z), 1.1):
                for dd, aa in ((0.0, 0.22), (0.24, 0.14)):
                    j0 = int((hb + dd) * SR); L = int(0.4 * SR)
                    if j0 + L < N: tb = np.arange(L) / SR; music[j0:j0 + L] += aa * np.sin(2 * np.pi * 52 * tb) * np.exp(-tb * 11)
        c0 += CH; k += 1
music = lp(music, 2400)

# ---------- kartu judul bab: desir naik + dentum rendah ----------
fx = np.zeros(N, dtype=np.float32)
beats = TL["beats"]
for i, b in enumerate(beats[:-1]):
    nx = beats[i + 1]
    if nx["seg"] == b["seg"]: continue
    s0 = b["start"] + (b["speech"] - b["start"] if b.get("speech") else 0.4) + (b.get("audio") or 0) + 0.9   # sama dengan sinema.js
    L = int(1.8 * SR); j0 = int((s0 - 1.6) * SR)
    if j0 > 0 and j0 + L < N:
        noise = rng.standard_normal(L).astype(np.float32); sw = lp(noise, 1800) * np.linspace(0, 1, L) ** 2; fx[j0:j0 + L] += 0.18 * sw
    j1 = int(s0 * SR); L2 = int(2.8 * SR)
    if j1 + L2 < N: tb = np.arange(L2) / SR; fx[j1:j1 + L2] += 0.35 * np.sin(2 * np.pi * (55 - 12 * tb) * tb) * np.exp(-tb * 1.8)

# ---------- efek suara dari sfx.json (waktu sama dengan gambar) ----------
SFX = os.path.join(ROOT, "sfx.json")
def put(start, sig):
    i = int(start * SR); j = min(N, i + len(sig))
    if 0 <= i < N and j > i: fx[i:j] += sig[: j - i].astype(np.float32)
def sfx(start, kind, amp):
    if kind == "whoosh":
        L = int(1.3 * SR); n = rng.standard_normal(L).astype(np.float32); env = np.sin(np.pi * np.linspace(0, 1, L)) ** 2
        lo, hi = lp(n, 500), lp(n, 2600); u = np.linspace(0, 1, L); put(start - 0.6, amp * 0.3 * ((1 - u) * lo + u * hi) * env * 3)
    elif kind == "clack":
        L = int(0.5 * SR); tt = np.arange(L) / SR; p = 1 + (start * 7.3 % 1) * 0.3
        put(start, amp * (np.sin(2 * np.pi * 150 * p * tt) * np.exp(-tt * 18) + 0.5 * np.sin(2 * np.pi * 420 * p * tt) * np.exp(-tt * 30) + rng.standard_normal(L) * np.exp(-tt * 120) * 0.4))
    elif kind == "shimmer":
        for i, m in enumerate([86, 90, 93, 98, 102]): L = int(2.0 * SR); tt = np.arange(L) / SR; put(start + i * 0.07, amp * 0.12 * np.sin(2 * np.pi * midi(m) * tt) * np.exp(-tt * 2.5))
    elif kind == "riser":
        d = 1.6; L = int(d * SR); tt = np.arange(L) / SR; f = 80 + 600 * (tt / d) ** 2
        put(start - d, amp * 0.18 * (np.sin(2 * np.pi * np.cumsum(f) / SR) * (tt / d) ** 2 + 0.4 * lp(rng.standard_normal(L).astype(np.float32), 1500) * (tt / d) ** 3))
    elif kind == "boom":
        L = int(3.0 * SR); tt = np.arange(L) / SR; put(start, amp * 0.6 * np.sin(2 * np.pi * (48 - 10 * tt) * tt) * np.exp(-tt * 1.4))
    elif kind == "pop":
        L = int(0.35 * SR); tt = np.arange(L) / SR; f = 520 + 380 * np.exp(-tt * 30); put(start, amp * (0.5 if V2 else 0.28) * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 14))
if os.path.exists(SFX):
    ev = json.load(open(SFX)); [sfx(a, k, g) for a, k, g in ev]; print(f"{len(ev)} efek suara dari {SFX}")

# ---------- ducking menurut kerasnya suara narator ----------
win = int(0.03 * SR); en = np.sqrt(np.convolve(vo ** 2, np.ones(win) / win, mode="same"))
speech = (en > 0.02).astype(np.float32)
if V2:   # jeda pendek di dalam kalimat (<1,2 dtk) dianggap masih bicara, supaya musik tidak naik-turun di setiap koma
    hold = int(1.2 * SR); idx = np.flatnonzero(speech)
    if len(idx) > 1:
        gaps = np.diff(idx)
        for k in np.flatnonzero((gaps > 1) & (gaps <= hold)): speech[idx[k]:idx[k] + gaps[k]] = 1.0
att, rel = np.exp(-1 / (0.08 * SR)), np.exp(-1 / (0.9 * SR))
from itertools import accumulate
duck = np.fromiter(accumulate(speech, lambda p, v: v + (p - v) * (att if v > p else rel)), dtype=np.float32, count=N)
gain = 0.60 - 0.42 * duck          # di bawah narasi ±15 dB lebih pelan dari suara, di jeda lebih penuh
fade = np.clip(t / 3.0, 0, 1) * np.clip((TL["total"] + 0.5 - t) / 4.0, 0, 1)
bed = (music * gain + fx * 0.8 * (1 - 0.45 * duck)) * fade   # efek suara ikut sedikit merunduk di bawah narasi
mix = vo * 0.95 + bed
peak = np.max(np.abs(mix)); mix = mix / peak * 0.95 if peak > 0.98 else mix
if V2:   # stereo: musik sedikit dilebarkan (efek Haas 11 ms ke kanan), narasi dan efek suara di tengah
    d = int(0.011 * SR); mus = music * gain * fade; musR = np.concatenate([np.zeros(d, np.float32), mus[:-d]])
    rest = vo * 0.95 + fx * 0.8 * (1 - 0.45 * duck) * fade
    st = np.stack([rest + mus, rest + musR], 1); pk = np.max(np.abs(st)); st = st / pk * 0.95 if pk > 0.98 else st

def write_wav(p, x):
    w = wave.open(p, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
if V2:
    import subprocess, json as _json, tempfile
    tmp = os.path.join(AUD, "_mix_stereo.wav"); w = wave.open(tmp, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
    # master dua tahap: ukur, lalu normalkan ke −14 LUFS dengan puncak sejati −1 dBTP (standar YouTube)
    r = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True)
    m = _json.loads(r.stderr[r.stderr.rfind("{"):r.stderr.rfind("}") + 1])
    af = (f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", tmp, "-af", af, "-ar", str(SR), "-c:a", "pcm_s16le", NAR], check=True); os.remove(tmp)
    r = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-i", NAR, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    I = r.stderr[r.stderr.rfind("I:"):].split("\n")[0]; TPk = r.stderr[r.stderr.rfind("Peak:"):].split("\n")[0]
    print(f"master: {I.strip()} | puncak sejati {TPk.strip()}")
else: write_wav(NAR, mix)
if "--dengar" in sys.argv: write_wav(os.path.join(AUD, "musik.wav"), bed)
print(f"musik + narasi -> {NAR} ({len(mix) / SR:.1f} s, {SR} Hz); narasi asli: {VO}")
