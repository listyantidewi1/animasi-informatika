"""Build the timeline from reading time (no narration audio): slow pace for beginner readers."""
import json, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
script = json.load(open(os.path.join(ROOT, "script.json")))

WPS = 1.6      # words per second a slow reader manages comfortably
MIN = 3.5      # shortest time a line stays on screen
PAD = 1.0      # settle time after reading before the next line

t = 0.0
timeline = []
for b in script["beats"]:
    words = len(re.findall(r"\S+", b["text"]))
    read = max(MIN, words / WPS + 0.8)
    total = round(read + PAD + b.get("hold", 0.8), 3)
    timeline.append({**b, "start": round(t, 3), "speech": round(t, 3), "audio": round(read, 3), "dur": total})
    t += total

out = {"title": script["title"], "episode": script["episode"], "segments": script["segments"],
       "quizzes": script["quizzes"], "beats": timeline, "total": round(t, 3)}
json.dump(out, open(os.path.join(ROOT, "timeline.json"), "w"), ensure_ascii=False, indent=1)
print(f"beats={len(timeline)} total={t:.1f}s")
for x in timeline:
    print(f"{x['start']:7.2f} {x['dur']:5.2f}s  {x['id']:8} {x['text'][:60]}")
