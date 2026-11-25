"""Tabel waktu global: awal bab, awal beat, awal kalimat (detik di video jadi)."""
import json
PROD = "/home/user/animasi-informatika/episodes/silapor/produksi"
BAB = ["L00", "L01", "L02", "L03", "L04", "L05", "L06", "L07", "L08", "L09"]
def tabel():
    t0 = 0.0; out = {}
    for b in BAB:
        w = json.load(open(f"{PROD}/{b}/waktu.json")); D = w[-1]["mulai"] + w[-1]["D"]
        out[b] = dict(mulai=t0, D=D, beat={x["no"]: dict(mulai=t0 + x["mulai"], D=x["D"], kal=[t0 + x["mulai"] + k for k in x.get("kalT", [])], audio=x.get("audio")) for x in w})
        t0 += D
    return out
if __name__ == "__main__":
    T = tabel()
    for b, v in T.items(): print(b, round(v["mulai"], 2), round(v["D"], 2), len(v["beat"]))
