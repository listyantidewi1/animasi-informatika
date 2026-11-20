"""Cetak kalimat per beat dengan indeks: python3 kal.py A05 [beat...]"""
import json, re, sys
ep = sys.argv[1]; pilih = [int(x) for x in sys.argv[2:]]
for b in json.load(open(f"/home/user/pinjam/naskah_{ep}.json")):
    if pilih and b["no"] not in pilih: continue
    kal = [x.strip() for x in re.split(r"(?<=[.!?])\s+", b["teks"]) if x.strip()]
    print(f"b{b['no']}:"); [print(f"  {i} {k}") for i, k in enumerate(kal)]
