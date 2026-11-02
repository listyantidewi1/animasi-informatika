"""Use the uploaded neural narration: raise pitch slightly, trim, normalise; rebuild the timeline and one narration track."""
import json, subprocess, wave, os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "suara_in", "suara")
OUT = os.path.join(ROOT, "audio"); os.makedirs(OUT, exist_ok=True)
PITCH = float(sys.argv[1]) if len(sys.argv) > 1 else 1.18
script = json.load(open(os.path.join(ROOT, "script.json")))
RATE = 22050; LEAD = 0.4; WPS = 1.6

def prep(src, dst):
    af = (f"rubberband=pitch={PITCH}:pitchq=quality,"
          "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-45dB,areverse,"
          "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-45dB,areverse,loudnorm=I=-17:TP=-1.5")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ac", "1", "-ar", str(RATE), "-af", af, dst], check=True)
    with wave.open(dst) as w: return w.getnframes() / w.getframerate()

t = 0.0; timeline = []; track = bytearray()
for b in script["beats"]:
    dst = os.path.join(OUT, b["id"] + ".wav"); dur = prep(os.path.join(SRC, b["id"] + ".mp3"), dst)
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
json.dump({"title": script["title"], "episode": script["episode"], "segments": script["segments"], "quizzes": script["quizzes"],
           "beats": timeline, "total": round(t, 3)}, open(os.path.join(ROOT, "timeline.json"), "w"), ensure_ascii=False, indent=1)
print(f"beats={len(timeline)} total={t:.1f}s  split={[x['start'] for x in timeline if x['id']=='s3a'][0]}")
