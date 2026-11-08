"""Timeline versi SUARA: pakai narasi per beat di <episode>/suara_in/suara/ (dari suara_elevenlabs.py, tts-kit/buat_suara.py,
atau TTS lain): sesuaikan nada, rapikan, normalisasi; susun timeline.json, audio/narration.wav, dan narasi.mp3.
  python3 episodes/_alat/voice.py D7.0          nada dari tts-kit/suara.json (ElevenLabs: 1.0), kalau tidak ada 1.18
  python3 episodes/_alat/voice.py D7.0 1.18     nada ditentukan langsung"""
import subprocess, wave, os, re, sys
import episode as E

ROOT, args = E.find_root(sys.argv[1:])
SRC = os.path.join(ROOT, "suara_in", "suara")
OUT = os.path.join(ROOT, "audio"); os.makedirs(OUT, exist_ok=True)
# Nada: argumen > "pitch" di tts-kit/suara.json (ditulis suara_elevenlabs.py, bawaan 1.0) > 1.18 (edge-tts GadisNeural)
CFG = os.path.join(ROOT, "tts-kit", "suara.json")
PITCH = float(args[0]) if args else float(E.load_json(CFG).get("pitch", 1.18)) if os.path.exists(CFG) else 1.18
script = E.load_script(ROOT)
RATE = int(script.get("audio_rate", 22050)); LEAD = 0.4; WPS = 1.6
# efek per beat (kunci "efek" di beat): "telepon" = suara lewat saluran telepon (pita 300–3.400 Hz, kompresi)
EFEK = {"telepon": "highpass=f=320,lowpass=f=3300,acompressor=threshold=-20dB:ratio=4:attack=5:release=60"}

import numpy as np
SILENCE_DB, PAD_S, TARGET_RMS_DB, PEAK_DB = -45.0, 0.05, -17.0, -1.5

DOK = script.get("kind") == "dokumenter"   # dokumenter: tanpa aturan waktu baca murid, ujung beat dihaluskan, dialog telepon sedikit dikeraskan

def prep(src, dst, efek=None):
    """(1) ffmpeg: decode + nada -> WAV mono 22,05 kHz 16 bit. (2) numpy: potong hening awal/akhir (< -45 dBFS, sisakan 50 ms)
    dan normalisasi ke RMS -17 dBFS dengan puncak maksimum -1,5 dBFS. Dulu memakai filter silenceremove/areverse/loudnorm
    ffmpeg, tetapi pada beberapa MP3 ElevenLabs rantai itu menggantung dan loudnorm diam-diam mengubah laju sampel ke 192 kHz."""
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", src, "-ac", "1", "-ar", str(RATE), "-c:a", "pcm_s16le",
                    "-af", f"rubberband=pitch={PITCH}:pitchq=quality" + ("," + EFEK[efek] if efek else ""), dst], check=True, timeout=120)
    with wave.open(dst) as w:
        if (w.getframerate(), w.getnchannels(), w.getsampwidth()) != (RATE, 1, 2):
            raise SystemExit(f"{dst}: format {w.getframerate()} Hz/{w.getnchannels()} kanal/{w.getsampwidth()*8} bit, seharusnya {RATE} Hz mono 16 bit")
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
    loud = np.flatnonzero(np.abs(x) > 10 ** (SILENCE_DB / 20)); trim = 0.0
    if len(loud):
        pad = int(PAD_S * RATE); a0 = max(0, loud[0] - pad); x = x[a0: min(len(x), loud[-1] + pad)]; trim = a0 / RATE
    rms = float(np.sqrt(np.mean(x ** 2))) or 1e-6
    target = TARGET_RMS_DB + (1.5 if (DOK and efek == "telepon") else 0.0)
    gain = min(10 ** (target / 20) / rms, 10 ** (PEAK_DB / 20) / (float(np.max(np.abs(x))) or 1e-6))
    y = np.clip(x * gain, -1.0, 1.0)
    if DOK:   # fade 12 ms di awal dan akhir supaya tidak ada klik antarbeat
        f = min(len(y) // 2, int(0.012 * RATE)); ramp = np.linspace(0, 1, f, dtype=np.float32); y[:f] *= ramp; y[-f:] *= ramp[::-1]
    with wave.open(dst, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes((y * 32767).astype(np.int16).tobytes())
    return len(y) / RATE, trim

def src_for(bid):
    """Berkas suara untuk satu beat: <id>.mp3 (dari edge-tts) atau .wav/.m4a/.ogg (dari TTS lain)."""
    for ext in (".mp3", ".wav", ".m4a", ".ogg"):
        p = os.path.join(SRC, bid + ext)
        if os.path.exists(p): return p
missing = [b["id"] for b in script["beats"] if not src_for(b["id"])]
if missing: raise SystemExit(f"Suara belum ada di {SRC}: {', '.join(missing)}")

t = 0.0; timeline = []; track = bytearray()
for b in script["beats"]:
    dst = os.path.join(OUT, b["id"] + ".wav"); dur, trim = prep(src_for(b["id"]), dst, b.get("efek"))
    lead = b.get("lead", LEAD)                   # beat dialog di tengah kalimat boleh menyambung lebih rapat
    words = len(re.findall(r"\S+", b["text"])); read = words / WPS + 0.8
    body = dur + 0.3 if DOK else max(dur + 0.3, 0.8 * read)   # narration leads, but a slow reader still gets most of the reading window
    total = round(lead + body + b.get("hold", 0.8), 3)
    extra = {}
    wp = os.path.join(ROOT, "suara_in", "waktu", b["id"] + ".json")   # dari align_dok.py: waktu tiap kata, relatif terhadap awal beat
    if os.path.exists(wp): extra["words"] = [[w, round(lead + s0 - trim, 3), round(lead + s1 - trim, 3)] for w, s0, s1 in E.load_json(wp)]
    timeline.append({**b, "start": round(t, 3), "speech": round(t + lead, 3), "audio": round(dur, 3), "dur": total, **extra})
    track += b"\x00\x00" * int(lead * RATE)
    with wave.open(dst) as w: track += w.readframes(w.getnframes())
    track += b"\x00\x00" * int(round((total - lead - dur) * RATE))
    t += total
with wave.open(os.path.join(OUT, "narration.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes(bytes(track))
E.save_json(E.timeline_from(script, timeline, t), E.timeline_path(ROOT, "suara"))
# narasi untuk halaman web (dimuat dari berkas terpisah supaya halaman tetap ringan)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(OUT, "narration.wav"), "-ac", "1", "-ar", str(RATE), "-b:a", "64k", os.path.join(ROOT, "narasi.mp3")], check=True)
print(f"[suara] beats={len(timeline)} total={t:.1f}s pitch={PITCH} -> {E.TIMELINE_FILE['suara']}, audio/narration.wav, narasi.mp3")
