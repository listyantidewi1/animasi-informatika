import json, re, importlib.util, glob, sys
PR = "/home/user/animasi-informatika/episodes/sipinjam/produksi"
NAMA = {f"P{i:02d}": g for i, g in enumerate(sorted(glob.glob("bab/*.mp4")))}
def spec(ep):
    s = importlib.util.spec_from_file_location("s", f"{PR}/{ep}/spec.py"); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m
def ops(ep):
    try: src = open(f"{PR}/{ep}/rekam.py").read()
    except: return {}
    # posisi tiap tanda
    pos = [(m.start(), m.group(1) or m.group(2)) for m in re.finditer(r'r\.tanda\("([^"]+)"\)|tanda="([^"]+)"', src)]
    out = {}
    for i, (p, n) in enumerate(pos):
        q = pos[i+1][0] if i+1 < len(pos) else len(src)
        seg = src[p:q]
        # untuk tanda=... argumen, operasi sebelumnya di baris yg sama milik tanda sebelumnya; cukup kasar
        out[n] = seg
    return out
KET = re.compile(r'\b(ubah|sql|jalan|terminal|commit|ketik|taruh|baru)\(')
hasil = {}
for ep in sorted(NAMA):
    S = spec(ep); W = {w["no"]: w for w in json.load(open(f"{PR}/{ep}/waktu.json"))}; O = ops(ep)
    base = NAMA[ep][4:-4]; lab = json.load(open(f"scan/{base}.json")); sp = json.load(open("scan/speeds.json"))
    rows = []
    for no, parts in sorted(S.BEATS.items()):
        w = W[no]; k = 0
        for p in parts:
            if p.get("kalimat") is not None and p["kalimat"] > 0: k = min(p["kalimat"], len(w["kalT"]) - 1)
            t = w["mulai"] + (w["kalT"][k] - 0.2 if k > 0 else 0)
            if p["k"] == "rek":
                seg = O.get(p["a"], "") if isinstance(p["a"], str) else ""
                f = sorted(set(KET.findall(seg)))
                rows.append(dict(no=no, a=p["a"], b=p["b"], t=round(t, 1), ops=f, maks=p.get("maks"), seg=seg[:150].replace("\n", " ")))
            else:
                rows.append(dict(no=no, adegan=p.get("nama"), t=round(t, 1)))
    hasil[ep] = rows
    print("==", ep, base, "label:", [(a, round(e - a, 1), sp[f"scan/{base}_{i}.png"]) for i, (a, e) in enumerate(lab)])
    for r in rows:
        if "adegan" in r: print(f"   {r['t']:7.1f} b{r['no']} [{r['adegan']}]")
        else: print(f"   {r['t']:7.1f} b{r['no']} {r['a']}->{r['b']} maks={r['maks']} {r['ops']} | {r['seg'][:110]}")
json.dump(hasil, open("analisis.json", "w"), indent=1)
