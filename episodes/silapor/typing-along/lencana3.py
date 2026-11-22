"""Pecah rentang lencana yang kecepatannya berubah (baca tiap 0,4 dtk)."""
import json, numpy as np
from lencana2 import crop, baca
d = json.load(open("data/lencana_rentang.json")); out = []
for x in d:
    if len(set(x["sp"])) == 1: out.append(dict(a=x["a"], b=x["b"], s=x["sp"][0])); continue
    ts = np.arange(x["a"], x["b"] + 0.01, 0.4); sp = [baca(crop(t)) for t in ts]; print(x["a"], list(zip([round(t, 1) for t in ts], sp)), flush=True)
    cur = dict(a=x["a"], b=x["a"], s=sp[0])
    for t, s in zip(ts, sp):
        if s == cur["s"]: cur["b"] = float(t)
        else: out.append(cur); cur = dict(a=float(t), b=float(t), s=s)
    cur["b"] = x["b"]; out.append(cur)
json.dump(out, open("data/lencana_final.json", "w"), indent=1)
