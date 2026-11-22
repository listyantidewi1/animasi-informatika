"""Daftar titik bekukan (v2). Sumber waktu yang pasti: ujung rentang lencana 'dipercepat' dan ujung kelompok kalimat.
Keluaran data/titik.json. Koreksi manual: koreksi.json {"hapus": [kunci], "geser": {kunci: t_baru}, "tambah": [...]} (kunci = 'bab:t')."""
import json, os
from tabel import tabel
T = tabel(); L = json.load(open("data/lencana_final.json")); E = json.load(open("data/peta.json"))
KET = ("berkas", "perintah", "sql", "salin")
def bab_dari(t):
    for b, v in T.items():
        if v["mulai"] <= t < v["mulai"] + v["D"]: return b
titik = {}
def tambah(t, jenis, ev, a=None, s=None):
    k = round(t, 1)
    for kk in list(titik):  # gabung titik yang berdekatan (<1,5 dtk)
        if abs(kk - k) < 1.5:
            titik[kk]["ev"] = sorted(set(titik[kk]["ev"]) | set(ev))
            if jenis == "cepat": titik[kk].update(jenis="cepat", t=t, a=a, s=s)
            return
    titik[k] = dict(t=t, jenis=jenis, ev=list(ev), a=a, s=s)
for s in L: tambah(s["b"], "cepat", [], s["a"], s["s"])
grup = {}
for i, e in enumerate(E):
    if e["jenis"] in KET and e.get("grup"): grup.setdefault((e["bab"], e["beat"], e["grup"][1], e["ekor"]), []).append(i)
for (b, no, w1, ekor), ids in grup.items():
    bt = T[b]["beat"][no]; ujung = bt["mulai"] + bt["D"]
    sesudah = E[ids[-1]]["sesudah"]
    if sesudah and sesudah[-1] in ("adegan", "web"): continue  # ujung kelompok menampilkan animasi/browser
    if ekor or abs(w1 - ujung) < 0.05:
        # ujung kelompok terakhir beat: kalau ada rentang lencana di ekor beat ini, ujungnya = awal lencana
        sp = [x for x in L if ujung - 31 < x["a"] < ujung + 0.5]
        if ekor:
            # peristiwa di ekor: titik = ujung lencana pertama sesudah awal jendelanya
            continue
        if sp: tambah(sp[0]["a"] - 0.1, "kelompok", ids); continue
        if any(abs(x["b"] - ujung) < 1 for x in L): continue
    tambah(w1, "kelompok", ids)
# peristiwa: tempelkan ke titik pertama yang tidak lebih awal dari ketikannya
for i, e in enumerate(E):
    if e["jenis"] not in KET: continue
    acuan = e.get("ketik", [None, None])[1] or (e["grup"][0] if e.get("grup") else None)
    if acuan is None: continue
    cand = sorted((v["t"], k) for k, v in titik.items() if v["t"] >= acuan - 0.6)
    if cand and i not in titik[cand[0][1]]["ev"]:
        # perintah yang diikuti bagian lain: beri titik sendiri di 'diam'
        if e["jenis"] in ("perintah", "sql") and e.get("diam") and cand[0][0] - e["diam"] > 4 and e["status"] == "ok":
            tambah(e["diam"], "biasa", [i]); continue
        titik[cand[0][1]]["ev"].append(i)
out = sorted(titik.values(), key=lambda x: x["t"])
for x in out: x["bab"] = bab_dari(x["t"]); x["kunci"] = f"{x['bab']}:{x['t']:.1f}"; x["ev"] = sorted(x["ev"])
for n, x in enumerate(out): x["id"] = n
json.dump(out, open("data/titik.json", "w"), indent=1)
for x in out:
    lab = "; ".join((E[i].get("berkas") or E[i].get("teks", "")).split("\n")[0][-40:] for i in x["ev"])
    print(x["id"], x["kunci"], x["jenis"], x["a"], x.get("s") or "", "|", lab)
