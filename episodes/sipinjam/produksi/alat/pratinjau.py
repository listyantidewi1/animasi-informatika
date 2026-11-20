"""Pratinjau adegan gambar satu bab tanpa suara: python3 alat/pratinjau.py L02 [no beat ...]
Waktu kalimat diperkirakan dari jumlah karakter. Hasil: /tmp/claude-0/pra/<bab>_bNN_<nama>.jpg (satu frame menjelang akhir tiap kalimat)."""
import json, re, sys, base64, pathlib, subprocess, importlib.util, os
from playwright.sync_api import sync_playwright
B = pathlib.Path("/home/user/pinjam"); WEB = B / "alat/web"; ep = sys.argv[1]; mau = [float(x) for x in sys.argv[2:]]
OUT = pathlib.Path("/tmp/claude-0/pra"); OUT.mkdir(exist_ok=True)
N = {b["no"]: b["teks"] for b in json.load(open(B / f"naskah_{ep}.json"))}
spec = importlib.util.spec_from_file_location("spec", B / ep / "spec.py"); S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
with sync_playwright() as p:
    b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto((WEB / "render.html").as_uri()); galat = []; pg.on("pageerror", lambda e: galat.append(str(e)))
    for s in [x for x in [WEB / "antre.js", WEB / "pinjam.js", B / ep / "adegan.js"] if x.exists()] + [pathlib.Path(x) for x in getattr(S, "SKRIP", [])]:
        if s.exists(): pg.evaluate("s => muatSkrip(s)", s.as_uri())
    for no in sorted(S.BEATS):
        if mau and no not in mau: continue
        teks = N[no]; kal = [x.strip() for x in re.split(r"(?<=[.!?])\s+", teks) if x.strip()]; tot = sum(len(x) for x in kal); au = len(teks) / 14.5
        kt = [0.4 + au * sum(len(x) for x in kal[:j]) / tot for j in range(len(kal))]; D = au + 2.0
        adg = [q for q in S.BEATS[no] if q["k"] == "adegan"]
        for q in adg:
            a = dict(q.get("a", {})); a["kal"] = kt; imgs = []
            for k in list(a):
                if (k == "bg" or k.startswith("img")) and a[k] and os.path.exists(str(a[k])): a[k] = pathlib.Path(a[k]).resolve().as_uri(); imgs.append(a[k])
            pg.evaluate("s => muat(s)", imgs)
            ts = sorted(set([round(min(D - .1, k + (kt[i + 1] - k if i + 1 < len(kt) else D - k) * .92), 2) for i, k in enumerate(kt)])); fs = []
            for i, t in enumerate(ts):
                try: d = pg.evaluate("([n,t,D,a]) => gambar(n,t,D,a)", [q["nama"], t, D, a])
                except Exception as e: print("GALAT", no, q["nama"], str(e)[:300]); break
                f = OUT / f"_{i}.jpg"; open(f, "wb").write(base64.b64decode(d.split(",", 1)[1])); fs.append(str(f))
            if not fs: continue
            n = len(fs); kolom = 2 if n <= 4 else 3
            subprocess.run(["montage", *fs, "-tile", f"{kolom}x", "-geometry", "960x540+6+6", "-background", "#000", str(OUT / f"{ep}_b{int(no):02d}_{q['nama']}.jpg")], check=True)
            print(no, q["nama"], f"D={D:.1f}", len(kal), "kalimat", flush=True)
    for g in galat[:5]: print("pageerror", g[:300])
    b.close()
