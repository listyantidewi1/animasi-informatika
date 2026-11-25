"""Periksa bingkai zoom: ambil frame awal/tengah/akhir tiap potongan non-full, gabung jadi lembar kontak."""
import sys, os, subprocess
sys.path.insert(0, "/home/user/git-seri/prod")
import rakit_git as K
from PIL import Image
out = sys.argv[2]; kode = sys.argv[1]; os.makedirs(out, exist_ok=True); daf = []
for r in K.rencanakan(kode):
    for j, p in enumerate(r["parts"]):
        if p["k"] == "rek" and p["crop"] != "full":
            for q, t in enumerate([p["_a"] + 0.1, (p["_a"] + p["_b"]) / 2, p["_b"] - 0.05]):
                f = f"{out}/{kode}_b{r['no']:02d}_{j}_{q}.png"; K.bingkai(p["src"], t, p["crop"], f); daf.append(f)
ims = [Image.open(f).resize((640, 360)) for f in daf]; n = len(ims); kol = 3
lem = Image.new("RGB", (640 * kol, 360 * ((n + kol - 1) // kol)), "white")
for i, im in enumerate(ims): lem.paste(im, ((i % kol) * 640, (i // kol) * 360))
lem.save(f"{out}/{kode}_lembar.png"); print(n)
