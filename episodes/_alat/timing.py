"""Timeline versi TEKS (tanpa suara): durasi tiap beat dari waktu baca pembaca pemula (1,6 kata/detik) -> timeline-teks.json
  python3 episodes/_alat/timing.py D7.0"""
import re, sys
import episode as E

ROOT, _ = E.find_root(sys.argv[1:])
script = E.load_script(ROOT)

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

E.save_json(E.timeline_from(script, timeline, t), E.timeline_path(ROOT, "teks"))
print(f"[teks] beats={len(timeline)} total={t:.1f}s -> {E.TIMELINE_FILE['teks']}")
for x in timeline:
    print(f"{x['start']:7.2f} {x['dur']:5.2f}s  {x['id']:8} {x['text'][:60]}")
