"""Timeline perkiraan (sebelum suara ada): laju 16 karakter/detik, waktu kata proporsional.
Logika sama dengan voice.py (lead 0,4 atau 'lead' beat, + audio + 0,3 + hold). Hasil: ../timeline-perkiraan.json"""
import json, os, re
D = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(D)
S = json.load(open(os.path.join(R, "script.json"))); CPS = 16.0
t = 0.0; out = []
for b in S["beats"]:
    lead = b.get("lead", 0.4); audio = len(b["text"]) / CPS
    toks = b["text"].split(); words = []; pos = 0
    for w in toks:
        i = b["text"].index(w, pos); pos = i + len(w)
        words.append([w, round(lead + i / CPS, 3), round(lead + pos / CPS, 3)])
    dur = round(lead + audio + 0.3 + b.get("hold", 0.8), 3)
    out.append({**b, "start": round(t, 3), "speech": round(t + lead, 3), "audio": round(audio, 3), "dur": dur, "words": words}); t += dur
json.dump({**{k: v for k, v in S.items() if k != "beats"}, "beats": out, "total": round(t, 3)}, open(os.path.join(R, "timeline-perkiraan.json"), "w"), ensure_ascii=False)
print(f"{len(out)} beat, total {t/60:.1f} menit")
