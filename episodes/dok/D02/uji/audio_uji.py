"""Musik dan efek suara klip uji D02 (dibuat dengan kode, tanpa unduhan). Isyarat waktu dari cues.json (sama dengan animasi)."""
import json, os, wave
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); CUE = json.load(open(os.path.join(HERE, "cues.json")))
SR, DUR = 44100, 15.0; N = int(SR * DUR); t = np.arange(N) / SR; rng = np.random.default_rng(4)
midi = lambda m: 440.0 * 2 ** ((m - 69) / 12)
def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)): acc = acc * a + x[i] * (1 - a); y[i] = acc
    return y
def add(buf, start, sig):
    i = int(start * SR); j = min(N, i + len(sig))
    if i < N and j > i: buf[i:j] += sig[: j - i]

# --- pad musik: Dm9 – Bbmaj7 – Gm9 – A (misteri yang megah), 3,75 detik per akor ---
mus = np.zeros(N)
CH = [[50, 57, 64, 65, 69], [46, 53, 57, 62, 65], [43, 50, 57, 58, 62], [45, 52, 57, 61, 64]]
for k, notes in enumerate(CH):
    s0 = k * 3.75; L = int(6.0 * SR); tt = np.arange(L) / SR; env = np.clip(tt / 1.8, 0, 1) * np.clip((6.0 - tt) / 2.2, 0, 1)
    sig = np.zeros(L)
    for j, m in enumerate(notes):
        for d in (0.996, 1.0, 1.005): sig += np.sin(2 * np.pi * midi(m) * d * tt + j) / 15
        if j == 0: sig += 0.6 * np.sin(2 * np.pi * midi(m - 12) * tt) / 5
    add(mus, s0, sig * env * 0.5)
# arpeggio lembut (denting) yang makin rapat menjelang klimaks
for i in range(40):
    st = 1.0 + i * 0.3 * (1 - 0.35 * (i / 40)); k = min(3, int(st / 3.75)); m = CH[k][i % 5] + 24
    L = int(1.6 * SR); tt = np.arange(L) / SR; add(mus, st, 0.05 * np.sin(2 * np.pi * midi(m) * tt) * np.exp(-tt * 3.2))
mus = lp(mus, 3200)

# --- efek suara ---
fx = np.zeros(N)
def whoosh(start, dur=1.2, amp=0.22):
    L = int(dur * SR); n = rng.standard_normal(L); env = np.sin(np.pi * np.linspace(0, 1, L)) ** 2
    fc = np.linspace(400, 2600, L); y = np.zeros(L); acc = 0.0
    for i in range(L): a = np.exp(-2 * np.pi * fc[i] / SR); acc = acc * a + n[i] * (1 - a); y[i] = acc
    add(fx, start, amp * y * env * 3)
def clack(start, pitch=1.0, amp=0.5):
    L = int(0.5 * SR); tt = np.arange(L) / SR
    body = np.sin(2 * np.pi * 150 * pitch * tt) * np.exp(-tt * 18) + 0.5 * np.sin(2 * np.pi * 420 * pitch * tt) * np.exp(-tt * 30)
    click = rng.standard_normal(L) * np.exp(-tt * 120) * 0.4; add(fx, start, amp * (body + click))
def shimmer(start, amp=0.12):
    for i, m in enumerate([86, 90, 93, 98, 102]):
        L = int(2.0 * SR); tt = np.arange(L) / SR; add(fx, start + i * 0.07, amp * np.sin(2 * np.pi * midi(m) * tt) * np.exp(-tt * 2.5))
def riser(start, dur, amp=0.18):
    L = int(dur * SR); tt = np.arange(L) / SR; f = 80 + 600 * (tt / dur) ** 2
    add(fx, start, amp * np.sin(2 * np.pi * np.cumsum(f) / SR) * (tt / dur) ** 2 + amp * 0.4 * lp(rng.standard_normal(L), 1500) * (tt / dur) ** 3)
def boom(start, amp=0.7):
    L = int(3.0 * SR); tt = np.arange(L) / SR; add(fx, start, amp * np.sin(2 * np.pi * (48 - 10 * tt) * tt) * np.exp(-tt * 1.4))

shimmer(CUE["shimmer"])
whoosh(CUE["lift0"] - 0.2, 1.4)
for i, x in enumerate(CUE["lands"]): clack(x, pitch=1 + i * 0.06, amp=0.45)
shimmer(CUE["stackGlow"], 0.1); whoosh(CUE["stackGlow"] + 0.2, 1.0, 0.12)
for i in range(3): clack(CUE["ratio"] + i * 0.18, pitch=2.2, amp=0.18)
riser(CUE["reveal"] - 1.8, 1.8); boom(CUE["reveal"]); whoosh(CUE["reveal"] - 0.3, 1.8, 0.2)

mix = mus * 0.9 + fx
fade = np.clip(t / 0.6, 0, 1) * np.clip((DUR - t) / 1.0, 0, 1); mix = mix * fade
mix = mix / np.max(np.abs(mix)) * 0.89
st = np.stack([mix, mix], 1)
w = wave.open(os.path.join(HERE, "audio_uji.wav"), "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes()); w.close()
print("audio_uji.wav", DUR, "s")
