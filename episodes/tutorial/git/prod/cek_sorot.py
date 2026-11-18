import sys, os, rakit_git as R
k = sys.argv[1]; tmp = f"/tmp/sorot_{k}"; os.makedirs(tmp, exist_ok=True)
for r in R.rencanakan(k):
    for j, p in enumerate(r["parts"]):
        if p.get("sorot") and p["k"] == "rek":
            out = f"{tmp}/b{r['no']:02d}_{j}.mp4"; print(out, p["sorot"], flush=True); R.sorotan(p, out, tmp)
