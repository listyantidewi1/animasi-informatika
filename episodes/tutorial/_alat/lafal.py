"""Suara ulang hanya kalimat yang berisi istilah teknis yang salah dilafalkan. python3 lafal.py [--coba] Txx..."""
import json, re, sys, os, urllib.request, time
sys.path.insert(0, os.path.dirname(__file__))
from suara import tts_teks, VID, MODEL
from kalimat import kalimat
GANTI = {"SyntaxError": "syntax error", "KeyError": "key error", "IndexError": "index error", "DecisionTreeClassifier": "decision tree classifier",
 "addEventListener": "add event listener", "clearInterval": "clear interval", "setInterval": "set interval", "getTemperature": "get temperature",
 "localStorage": "local storage", "forEach": "for each", "getItem": "get item", "setItem": "set item", "CountVectorizer": "count vectorizer",
 "MultinomialNB": "multinomial N B", "TfidfVectorizer": "T F I D F vectorizer", "DataFrame": "data frame", "JSON": "Jason", "WiFi": "Wi-Fi", "IoT": "ai-o-ti"}
POLA = r"\b(" + "|".join(GANTI) + r")\b"
def lafal(t):
    t = re.sub(POLA, lambda m: GANTI[m.group(1)], t); return t[:1].upper() + t[1:]
def daftar(ep):
    N = json.load(open("/home/user/tut/naskah.json"))[ep]["beats"]; out = []
    for b in N:
        K = kalimat(b["teks"])
        for k, s in enumerate(K):
            if re.search(POLA, s): out.append((b["no"], k + 1, s, K[k - 1] if k else None, K[k + 1] if k + 1 < len(K) else None))
    return out
def tts(teks, out, prev, nxt):
    body = {"text": tts_teks(lafal(teks)), "model_id": MODEL, "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.0, "speed": 1.0}}
    if prev: body["previous_text"] = tts_teks(lafal(prev))
    if nxt: body["next_text"] = tts_teks(lafal(nxt))
    for k in range(4):
        try:
            r = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VID}?output_format=mp3_44100_128", data=json.dumps(body).encode(),
                                       headers={"xi-api-key": "dummy", "Content-Type": "application/json"})
            open(out, "wb").write(urllib.request.urlopen(r, timeout=120).read()); return True
        except Exception as e:
            if getattr(e, "code", 0) == 400 and "previous_text" in body: body.pop("previous_text", None); body.pop("next_text", None); continue
            print("ulang", e); time.sleep(3 * (k + 1))
if __name__ == "__main__":
    coba = "--coba" in sys.argv
    for ep in [a for a in sys.argv[1:] if not a.startswith("--")]:
        os.makedirs(f"/home/user/tut/{ep}/kalimat_baru", exist_ok=True)
        for no, k, s, p, n in daftar(ep):
            out = f"/home/user/tut/{ep}/kalimat_baru/b{no:02d}_k{k}.mp3"
            print(ep, no, k, len(s), "|", tts_teks(lafal(s)))
            if not coba and not os.path.exists(out): tts(s, out, p, n)
