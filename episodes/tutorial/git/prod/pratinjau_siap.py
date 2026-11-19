"""Pratinjau adegan gambar baru (tanpa suara): lembar kontak beberapa saat per adegan, dengan waktu kalimat perkiraan."""
import sys, base64, pathlib, subprocess, os
import rencana_git as RC, rakit_git as R
from playwright.sync_api import sync_playwright
OUT = sys.argv[1]; kodes = sys.argv[2:]; os.makedirs(OUT, exist_ok=True)
WEB = pathlib.Path("/home/user/git-seri/_alat/web")
BARU = {"siapAlat", "siapGit", "siapVSCode", "siapProyek", "siapConfig", "logQ", "prasyaratRepo", "nodeJalan", "tabMerge", "ghDaftar", "ghRepo", "ghLogin", "ghPR", "ghFiles", "ghSendiri", "ghIssue", "ghRelease"}
with sync_playwright() as p:
    b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(viewport={"width": 1920, "height": 1080}); pg.goto((WEB / "render.html").as_uri())
    for s in ["/home/user/git-seri/adegan_git.js", "/home/user/git-seri/adegan_siap_git.js"]: pg.evaluate("s => muatSkrip(s)", pathlib.Path(s).as_uri())
    pg.evaluate("s => muat(s)", [])
    for k in kodes:
        n = 0
        for teks, parts in RC.EP[k]:
            for q in parts:
                if q["k"] != "adegan" or q["nama"] not in BARU: continue
                kal = R.kalimat(teks); s0 = q.get("s", 0); kal = kal[s0:]; t = 0.35; kl = []
                for x in kal: kl.append(round(t, 2)); t += len(x) / 14.5 + 0.3
                D = t + 1; a = dict(q["a"], _kal=kl); ts = sorted(set([x + d for x in kl for d in (0.4, 2.2, 4.5) if x + d < D] + [D - 0.2])); fs = []
                for i, tt in enumerate(ts):
                    d = pg.evaluate("([n,t,D,a]) => gambar(n,t,D,a)", [q["nama"], tt, D, a]); f = f"{OUT}/_{i}.jpg"; open(f, "wb").write(base64.b64decode(d.split(",", 1)[1])); fs.append(f)
                kol = 4; out = f"{OUT}/{k}_{n}_{q['nama']}.jpg"; n += 1
                subprocess.run(["ffmpeg", "-loglevel", "error", "-y"] + sum([["-i", f] for f in fs], []) + ["-filter_complex",
                    "".join(f"[{i}]scale=640:360[s{i}];" for i in range(len(fs))) + "".join(f"[s{i}]" for i in range(len(fs))) + f"xstack=inputs={len(fs)}:layout=" + "|".join(f"{(i % kol) * 640}_{(i // kol) * 360}" for i in range(len(fs))) + ":fill=black" if len(fs) > 1 else "[0]scale=640:360", out], check=True)
                print(out, len(fs), kl)
    b.close()
