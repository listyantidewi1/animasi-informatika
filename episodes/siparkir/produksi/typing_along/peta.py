"""Peta waktu: setiap potongan (part) tiap bab di video jadi sumber.mp4."""
import json, re
TA = "/home/user/kerja/ta"; SRT = "/mnt/project-files/siparkir/SiParkir_Laravel_dari_Nol.srt"
BAB = ["P%02d" % i for i in range(13)]
def srt_s(t): h, m, r = t.split(":"); d, ms = r.split(","); return int(h)*3600 + int(m)*60 + int(d) + int(ms)/1000
def baca_srt(f=SRT):
    out = []
    for blok in open(f).read().strip().split("\n\n"):
        bar = blok.split("\n"); a, b = [srt_s(x.strip()) for x in bar[1].split("-->")]; out.append([a, b, "\n".join(bar[2:])])
    return out
def peta():
    srt = baca_srt(); k = 0; hasil = {}
    for p in BAB:
        r = json.load(open(f"{TA}/rencana_{p}.json"))
        nkal = sum(len(b["kalT"]) for b in r)
        t0 = srt[k][0] - r[0]["kalT"][0]  # awal bab di video penuh (dikalibrasi dari subtitle pertama)
        k += nkal
        t = t0; parts = []
        for b in r:
            for i, q in enumerate(b["parts"]):
                q = dict(q); q["P"] = p; q["no"] = b["no"]; q["i"] = i; q["t"] = t; t += q["_d"]; parts.append(q)
        hasil[p] = dict(t0=t0, parts=parts, beats=r, D=sum(b["D"] for b in r))
    return hasil
if __name__ == "__main__":
    h = peta()
    for p in BAB: print(p, round(h[p]["t0"], 3), round(h[p]["D"], 3))
