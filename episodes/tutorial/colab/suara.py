"""Narasi Cahaya (eleven_v4_turbo) per beat; hanya membuat MP3 yang belum ada. python3 suara.py [--hanya k1,a1]"""
import json, sys, os, urllib.request, time
from naskah import BEATS
VID = "iWydkXKoiVtvdn4vLKp9"; MODEL = "eleven_v4_turbo"
D = os.path.dirname(os.path.abspath(__file__)); os.makedirs(D + "/suara", exist_ok=True)
hanya = set(sys.argv[sys.argv.index("--hanya") + 1].split(",")) if "--hanya" in sys.argv else None
T = [b[2] or b[1] for b in BEATS]
for i, b in enumerate(BEATS):
    if hanya and b[0] not in hanya: continue
    out = f"{D}/suara/{b[0]}.mp3"
    if os.path.exists(out): continue
    body = {"text": T[i], "model_id": MODEL, "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.0, "speed": 1.0}}
    if i: body["previous_text"] = T[i - 1]
    if i + 1 < len(T): body["next_text"] = T[i + 1]
    data = None
    for k in range(4):
        try:
            r = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VID}?output_format=mp3_44100_128",
                data=json.dumps(body).encode(), headers={"xi-api-key": "dummy", "Content-Type": "application/json"})
            data = urllib.request.urlopen(r, timeout=120).read(); break
        except Exception as e:
            print("ulang", b[0], e, getattr(e, "read", lambda: b"")()[:200])
            if getattr(e, "code", 0) == 400: body.pop("previous_text", None); body.pop("next_text", None)
            time.sleep(3 * (k + 1))
    if data: open(out, "wb").write(data); print(b[0], len(T[i]))
