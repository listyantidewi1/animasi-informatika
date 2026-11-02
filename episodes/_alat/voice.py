"""Timeline versi SUARA: pakai narasi neural dari tts-kit (MP3 per beat di <episode>/suara_in/suara/):
naikkan nada, rapikan, normalisasi; susun timeline.json dan satu trek audio/narration.wav.
  python3 episodes/_alat/voice.py D7.0 1.18     (angka = faktor nada; bawaan 1.18)"""
import subprocess, wave, os, re, sys
import episode as E

ROOT, args = E.find_root(sys.argv[1:])
SRC = os.path.join(ROOT, "suara_in", "suara")
OUT = os.path.join(ROOT, "audio"); os.makedirs(OUT, exist_ok=True)
PITCH = float(args[0]) if args else 1.18
script = E.load_script(ROOT)
RATE = 22050; LEAD = 0.4; WPS = 1.6

def prep(src, dst):
    af = (f"rubberband=pitch={PITCH}:pitchq=quality,"
          "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-45dB,areverse,"
          "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-45dB,areverse,loudnorm=I=-17:TP=-1.5")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ac", "1", "-ar", str(RATE), "-af", af, dst], check=True)
    with wave.open(dst) as w: return w.getnframes() / w.getframerate()

def src_for(bid):
    """Berkas suara untuk satu beat: <id>.mp3 (dari edge-tts) atau .wav/.m4a/.ogg (dari TTS lain)."""
    for ext in (".mp3", ".wav", ".m4a", ".ogg"):
        p = os.path.join(SRC, bid + ext)
        if os.path.exists(p): return p
missing = [b["id"] for b in script["beats"] if not src_for(b["id"])]
if missing: raise SystemExit(f"Suara belum ada di {SRC}: {', '.join(missing)}")

t = 0.0; timeline = []; track = bytearray()
for b in script["beats"]:
    dst = os.path.join(OUT, b["id"] + ".wav"); dur = prep(src_for(b["id"]), dst)
    words = len(re.findall(r"\S+", b["text"])); read = words / WPS + 0.8
    body = max(dur + 0.3, 0.8 * read)            # narration leads, but a slow reader still gets most of the reading window
    total = round(LEAD + body + b.get("hold", 0.8), 3)
    timeline.append({**b, "start": round(t, 3), "speech": round(t + LEAD, 3), "audio": round(dur, 3), "dur": total})
    track += b"\x00\x00" * int(LEAD * RATE)
    with wave.open(dst) as w: track += w.readframes(w.getnframes())
    track += b"\x00\x00" * int(round((total - LEAD - dur) * RATE))
    t += total
with wave.open(os.path.join(OUT, "narration.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes(bytes(track))
E.save_json(E.timeline_from(script, timeline, t), E.timeline_path(ROOT, "suara"))
# narasi untuk halaman web (dimuat dari berkas terpisah supaya halaman tetap ringan)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(OUT, "narration.wav"), "-ac", "1", "-ar", str(RATE), "-b:a", "64k", os.path.join(ROOT, "narasi.mp3")], check=True)
print(f"[suara] beats={len(timeline)} total={t:.1f}s pitch={PITCH} -> {E.TIMELINE_FILE['suara']}, audio/narration.wav, narasi.mp3")
