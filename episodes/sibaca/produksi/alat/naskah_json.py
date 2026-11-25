import json, re, sys
for ep in sys.argv[1:]:
    par = [x.strip().replace("\n", " ") for x in re.split(r"\n\s*\n", open(f"/home/user/baca/naskah/{ep}.txt").read()) if x.strip()]
    json.dump([{"no": i + 1, "teks": t} for i, t in enumerate(par)], open(f"/home/user/baca/naskah_{ep}.json", "w"), ensure_ascii=False, indent=1); print(ep, len(par))
