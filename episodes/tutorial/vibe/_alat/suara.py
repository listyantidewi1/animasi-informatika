"""Narasi Cahaya per beat untuk seri tutorial. python3 suara.py T01 [--hanya 1,2]"""
import json, sys, re, os, urllib.request, time
VID = "iWydkXKoiVtvdn4vLKp9"; MODEL = "eleven_v4"
def tts_teks(t):
    t = t.replace("`", "")
    t = re.sub(r"\b([A-Za-z]+)\.([A-Za-z_]+)\b", lambda m: m.group(1) + " titik " + m.group(2), t)
    t = re.sub(r"(?<=[A-Za-z])_(?=[A-Za-z])", " ", t)
    t = t.replace("pd titik", "pe de titik").replace("plt titik", "p l t titik")
    return t
def main():
    ep = sys.argv[1]; hanya = None
    if "--hanya" in sys.argv: hanya = set(int(x) for x in sys.argv[sys.argv.index("--hanya") + 1].split(","))
    N = json.load(open("/home/user/tut/naskah.json"))[ep]["beats"]
    if os.path.exists(f"/home/user/tut/{ep}/naskah_ep.json"): N = json.load(open(f"/home/user/tut/{ep}/naskah_ep.json"))
    os.makedirs(f"/home/user/tut/{ep}/suara", exist_ok=True)
    for i, b in enumerate(N):
        if hanya and b["no"] not in hanya: continue
        out = f"/home/user/tut/{ep}/suara/b{b['no']:02d}.mp3"
        if os.path.exists(out): continue
        body = {"text": tts_teks(b["teks"]), "model_id": MODEL,
                "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.0, "speed": 1.0}}
        if i: body["previous_text"] = tts_teks(N[i - 1]["teks"])
        if i + 1 < len(N): body["next_text"] = tts_teks(N[i + 1]["teks"])
        for k in range(4):
            try:
                r = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VID}?output_format=mp3_44100_128",
                    data=json.dumps(body).encode(), headers={"xi-api-key": "dummy", "Content-Type": "application/json"})
                data = urllib.request.urlopen(r, timeout=120).read(); break
            except Exception as e:
                if getattr(e, "code", 0) == 400 and ("previous_text" in body):
                    body.pop("previous_text", None); body.pop("next_text", None); continue
                print("ulang", e); time.sleep(3 * (k + 1))
        open(out, "wb").write(data); print(ep, b["no"], len(b["teks"]))
main()
