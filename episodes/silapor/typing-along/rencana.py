"""Rencana suntingan akhir dari data/titik.json + koreksi.json -> data/rencana.json.
Semua waktu dibulatkan ke kisi bingkai 30 fps video lama."""
import json, numpy as np
from tabel import tabel, BAB
import srt as SRT
FPS = 30; T = tabel(); D = np.load("data/beda.npy").astype(float)
TI = json.load(open("data/titik.json")); K = json.load(open("koreksi.json"))
SUB = SRT.baca("/mnt/project-files/silapor/SiLapor_Laravel_dari_Nol.srt")
def fr(t): return int(round(t * FPS))
def diam_mundur(t, cari=5.0, lama=0.4):
    x = D[(D[:, 0] > t - cari) & (D[:, 0] <= t)]
    for i in range(len(x) - 1, -1, -1):
        j = i
        while j >= 0 and x[j, 1] < 0.002 and x[i, 0] - x[j, 0] < lama: j -= 1
        if j >= 0 and x[i, 0] - x[j, 0] >= lama and all(x[j:i + 1, 1] < 0.002): return x[i, 0]
    return t
def diam_maju(t, maks=6.0, lama=0.5):
    x = D[(D[:, 0] > t) & (D[:, 0] < t + maks + lama)]; mulai = None
    for r in x:
        if r[1] < 0.002:
            mulai = r[0] if mulai is None else mulai
            if r[0] - mulai >= lama: return mulai
        else: mulai = None
    return t
def potong_setelah(t0, t1=None):
    x = D[(D[:, 0] > t0) & (D[:, 0] < (t1 or t0 + 20))]
    for r in x:
        if r[1] > 0.3: return r[0] - 0.15
    return t0
def bab_dari(t):
    for b in BAB:
        v = T[b]
        if v["mulai"] <= t < v["mulai"] + v["D"]: return b
def durasi_beku(lab):
    F = 0
    for it in lab:
        k, isi = it[0], it[2:]
        F += {"T": max(2.5, min(6.0, len(isi) / 4)), "S": max(3.0, min(7.0, len(isi) / 5)), "B": 4.0, "C": 3.0, "E": 4.0}[k]
    return min(9.0, F)
out = []
for x in TI:
    k = x["kunci"]
    if k in K["hapus"]: continue
    lab = K["label"].get(k)
    if lab is None and k not in K["lambat_saja"]: print("TANPA LABEL", k); continue
    t = K["geser"].get(k, x["t"])
    if x["jenis"] == "kelompok" and k not in K["geser"]: t = diam_mundur(t)
    if k in K["maju"]: t = diam_maju(t)
    r = dict(kunci=k, t=t, label=lab or [], beku=k not in K["lambat_saja"])
    if x["jenis"] == "cepat" and x["s"] > 1.5:
        a, s = x["a"], x["s"]; L = x["t"] - a
        f = min(s / 1.5, 1 + 25 / max(L, 0.5)); r.update(lambat=[a, x["t"]], f=round(f, 3), s=s)
    out.append(r)
for x in K["tambah"]:
    t = x["t"]
    if x["cari"] == "sebelum_potong": t = potong_setelah(x["dari"])
    out.append(dict(kunci=f"tambah:{x['t']}", t=t, label=x["label"], beku=True))
out.sort(key=lambda r: r["t"])
# kisi bingkai, durasi beku, titik sisip audio
starts = [s[0] for s in SUB]; ends = [s[1] for s in SUB]
def sisip_audio(t):
    for a, b, _ in SUB:
        if a - 0.05 <= t <= b + 0.02:  # t di tengah kalimat
            nxt = [s for s in starts if s > t]; prv = [e for e in ends if e < t]
            ca = (nxt[0] - 0.08) if nxt else None; cb = (prv[-1] + 0.03) if prv else None
            if ca is not None and ca - t <= 3.0: return ca
            if cb is not None and t - cb <= 3.0: return cb
            return min([c for c in (ca, cb) if c is not None], key=lambda c: abs(c - t))
    return t
for r in out:
    r["bab"] = bab_dari(r["t"]); r["fr"] = fr(r["t"])
    r["F"] = round(durasi_beku(r["label"]), 2) if r["beku"] else 0.0
    if "lambat" in r:
        a, b = fr(r["lambat"][0]), fr(r["lambat"][1]); r["lambat_fr"] = [a, b]
        r["lambat_baru_fr"] = int(round((b - a) * r["f"]))
    r["audio_t"] = round(sisip_audio(r["t"]), 3)
# freeze akhir bab: bingkai terakhir sebelum kartu bab berikutnya, 2,5 dtk
bab = [dict(bab=b, fr=fr(T[b]["mulai"]), F=2.5) for b in BAB[1:]]
json.dump(dict(titik=out, bab=bab), open("data/rencana.json", "w"), indent=1, ensure_ascii=False)
tambah = sum(r["F"] + (r.get("lambat_baru_fr", 0) - (r["lambat_fr"][1] - r["lambat_fr"][0] if "lambat_fr" in r else 0)) / FPS for r in out) + 2.5 * len(bab)
selisih = [abs(r["audio_t"] - r["t"]) for r in out]
print(len(out), "titik; tambahan", round(tambah / 60, 1), "menit; total", round((3945.6 + tambah) / 60, 1), "menit")
print("selisih sisip audio > 1 dtk:", [(r["kunci"], round(r["audio_t"] - r["t"], 1)) for r in out if abs(r["audio_t"] - r["t"]) > 1])
