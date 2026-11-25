"""Susun script.json dari beats.json (pecah.py) + vis.json (rancangan gambar per beat, ditulis tangan) + ucap.json (ejaan TTS)."""
import json, os
D = os.path.dirname(os.path.abspath(__file__)); L = lambda f, d=None: json.load(open(os.path.join(D, f), encoding="utf-8")) if os.path.exists(os.path.join(D, f)) else d
bj = L("beats.json"); vis = L("vis.json", {}); ucap = L("ucap.json", {}); beats = []
titles = [bj["titles"][str(i)] if i == 0 else f"Bab {i}|" + bj["titles"][str(i)] for i in range(10)]
for i, b in enumerate(bj["beats"]):
    nb = {"id": b["id"], "seg": b["seg"], "scene": "r01", "text": b["text"], "hold": 0.45}
    first = i == 0 or bj["beats"][i - 1]["seg"] != b["seg"]; last = i == len(bj["beats"]) - 1 or bj["beats"][i + 1]["seg"] != b["seg"]
    if first and i: nb.update(lead=1.2, cardOut=0.9)
    if last: nb.update(hold=2.7, cardDelay=1.0, cardFade=0.5)
    if i == len(bj["beats"]) - 1: nb = {**{k: v for k, v in nb.items() if k not in ("cardDelay", "cardFade")}, "hold": 20.0}
    if b["id"] in ucap:
        assert len(ucap[b["id"]].split()) == len(b["text"].split()), b["id"]; nb["ucap"] = ucap[b["id"]]
    if b["id"] in vis: nb["vis"] = vis[b["id"]]
    beats.append(nb)
S = {"episode": "R01", "title": "Mau Jadi Software Engineer di Era AI? Ini Peta Lengkapnya", "kind": "dokumenter", "label": "Peta Karier · I Teach Software Engineering",
     "engine": ["../../_alat/kiko-core.js", "../../_alat/tiktok-core.js", "../../_alat/sinema_dok.js", "../../_alat/short_dok.js", "../../_alat/dokkit/bipkit.js", "../D06/umum.js", "vis.js", "gambar.js", "adegan.js", "sfx.js"],
     "parts": {"R01": {"segs": list(range(10))}}, "segments": titles, "webgl": False, "audio_rate": 44100,
     "musik": {"versi": 2, "mood": {"0": "tegang", "1": "renung", "2": "hangat", "3": "hangat", "4": "tegang", "5": "renung", "6": "hangat", "7": "tegang", "8": "hangat", "9": "hangat"}}, "beats": beats}
json.dump(S, open(os.path.join(D, "script.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1); print(len(beats), "beat")
