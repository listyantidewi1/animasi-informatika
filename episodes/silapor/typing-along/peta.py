"""Petakan tiap ketikan (dari data/<bab>_peristiwa.json) ke waktunya di video jadi.
Jendela kasar dari spec.py + waktu.json, lalu ujung ketikan dicari dari data/beda.npy (pola huruf muncul satu per satu)."""
import json, numpy as np, importlib.util, sys
from tabel import tabel, PROD
T = tabel(); D = np.load("data/beda.npy").astype(float)
KET = ("berkas", "perintah", "sql", "salin")
def spec(b):
    s = importlib.util.spec_from_file_location("s", f"{PROD}/{b}/spec.py"); m = importlib.util.module_from_spec(s)
    src = open(f"{PROD}/{b}/spec.py").read()
    g = {}; exec(compile(src, "spec", "exec"), g); return g
def huruf(t0, t1):
    """Sampel 'huruf diketik': perubahan kecil setinggi satu baris."""
    m = (D[:, 0] >= t0) & (D[:, 0] <= t1); x = D[m]
    ok = (x[:, 1] > 0) & (x[:, 1] < 0.004) & ((x[:, 5] - x[:, 3]) <= 16) & ((x[:, 4] - x[:, 2]) >= 3) & ((x[:, 4] - x[:, 2]) <= 60)
    return x[ok, 0]
def runs(ts, gap=0.45, minn=3):
    out = []
    for t in ts:
        if out and t - out[-1][1] <= gap: out[-1][1] = t; out[-1][2] += 1
        else: out.append([t, t, 1])
    return [r for r in out if r[2] >= minn]
def diam_setelah(t, maks=6.0, lama=0.5):
    """Detik pertama setelah t ketika layar diam >= lama detik."""
    m = (D[:, 0] > t) & (D[:, 0] < t + maks + lama); x = D[m]; mulai = None
    for r in x:
        if r[1] < 0.0002:
            mulai = r[0] if mulai is None else mulai
            if r[0] - mulai >= lama: return float(mulai)
        else: mulai = None
    return None
def jendela(b):
    S = spec(b); B = T[b]["beat"]; ev = json.load(open(f"data/{b}_peristiwa.json")); hasil = []
    for rek, E in ev.items():
        urut = [e["tanda"] for e in E if e["jenis"] == "tanda"]; vt = {e["tanda"]: e["vt"] for e in E if e["jenis"] == "tanda"}
        def pos(x):
            if isinstance(x, str): return urut.index(x) if x in urut else None
            for i, n in enumerate(urut):  # angka detik rekaman: pakai jam virtual
                if vt[n] >= x * 0.97: return i - 0.5
            return len(urut)
        bag = []
        # bagian berbatas angka (detik rekaman) digabung dengan tetangganya yang bertanda nama
        for no, parts in S["BEATS"].items():
            ps = [p for p in parts if p.get("k") == "rek" and p.get("r", "rek") == rek]
            for i, p in enumerate(ps):
                if not isinstance(p["a"], str):
                    j = i - 1
                    while j >= 0 and not isinstance(ps[j]["a"], str): j -= 1
                    p["a"] = ps[j]["a"] if j >= 0 else p["a"]
                if not isinstance(p["b"], str):
                    j = i + 1
                    while j < len(ps) and not isinstance(ps[j]["b"], str): j += 1
                    p["b"] = ps[j]["b"] if j < len(ps) else p["b"]
        for no, parts in S["BEATS"].items():
            bt = B[no]; kal = bt["kal"]; ujung = bt["mulai"] + bt["D"]
            ks = sorted({min(p.get("kalimat", 0), len(kal) - 1) for p in parts if not p.get("ekor") and p.get("kalimat") is not None} | {0})
            for p in parts:
                if p.get("k") != "rek" or p.get("r", "rek") != rek: continue
                idx = parts.index(p); kk = 0
                if p.get("ekor"): w0, w1 = ujung - 30, ujung
                else:
                    k = min(p.get("kalimat", 0), len(kal) - 1) if p.get("kalimat") is not None else None
                    # kelompok bagian ini = kalimat terakhir <= bagian sebelumnya
                    idx = parts.index(p); kk = 0
                    for q in parts[:idx + 1]:
                        if not q.get("ekor") and q.get("kalimat") is not None: kk = max(kk, min(q["kalimat"], len(kal) - 1))
                    nxt = [x for x in ks if x > kk]
                    w0 = bt["mulai"] if kk == 0 else kal[kk] - 0.2
                    w1 = (kal[nxt[0]] - 0.2) if nxt else ujung
                pa, pb = pos(p["a"]), pos(p["b"])
                if pa is not None and pa == pb: pb = pa + 1
                # apa yang tampil di ujung kelompok: bagian lain sesudah p di kelompok yang sama
                sesudah = []
                if not p.get("ekor"):
                    for q2 in parts[idx + 1:]:
                        if q2.get("ekor"): continue
                        if q2.get("kalimat") is not None and min(q2["kalimat"], len(kal) - 1) > kk: break
                        sesudah.append(q2.get("k") if q2.get("k") != "rek" else (q2.get("r", "rek") if q2.get("r", "rek") == rek else "web"))
                else:
                    ek = [q2 for q2 in parts if q2.get("ekor")]; sesudah = ["rek"] * (len(ek) - 1 - ek.index(p))
                bag.append(dict(no=no, a=pa, b=pb, w=[w0, w1], sesudah=sesudah, ekor=bool(p.get("ekor")), maks=p.get("maks"), speed=p.get("speed")))
        tanda = "(awal)"; kursor = 0.0
        for e in E:
            if e["jenis"] == "tanda": tanda = e["tanda"]; continue
            if e["jenis"] not in KET: continue
            ps = urut.index(tanda) if tanda in urut else -1
            cocok = [q for q in bag if q["a"] is not None and q["b"] is not None and q["a"] <= ps < q["b"]]
            if not cocok: hasil.append(dict(bab=b, rek=rek, **e, status="tanpa-bagian")); continue
            q = cocok[0]; w0, w1 = max(q["w"][0], kursor), q["w"][1]
            info = dict(grup=[round(q["w"][0], 2), round(q["w"][1], 2)], ekor=q["ekor"], sesudah=q["sesudah"], beat=q["no"])
            R = [[float(a), float(b_), c] for a, b_, c in runs(huruf(w0, w1))]
            if not R: hasil.append(dict(bab=b, rek=rek, **e, **info, w=[w0, w1], status="tanpa-ketikan")); continue
            # gugus ketikan pertama (celah <= 2,5 dtk) setelah kursor
            g0, g1 = R[0][0], R[0][1]
            for r in R[1:]:
                if r[0] - g1 <= 2.5: g1 = r[1]
                else: break
            d = diam_setelah(g1) or g1 + 0.5
            hasil.append(dict(bab=b, rek=rek, **e, **info, w=[round(w0, 2), round(w1, 2)], ketik=[round(g0, 2), round(g1, 2)], diam=round(d, 2), status="ok"))
            kursor = g1 + 0.3
    return hasil
if __name__ == "__main__":
    semua = []
    for b in ["L01", "L04", "L05", "L06", "L07", "L08", "L09"]: semua += jendela(b)
    json.dump(semua, open("data/peta.json", "w"), indent=1, ensure_ascii=False)
    for h in semua:
        print(h["bab"], h["rek"][:5].ljust(5), h["tanda"][:14].ljust(14), h["jenis"][:6], (h.get("berkas") or h.get("teks", ""))[-40:].ljust(40), h["status"], h.get("w"), h.get("ketik"), h.get("diam"))
