"""Pratinjau adegan persiapan tanpa suara: perkiraan waktu kalimat dari jumlah karakter. python3 pratinjau.py [nama...]"""
import json, re, sys, base64, pathlib, subprocess
from playwright.sync_api import sync_playwright
B = pathlib.Path("/home/user/baca"); WEB = B / "alat/web"; OUT = pathlib.Path("/tmp/claude-0/siap")
P = {b["no"]: b["teks"] for b in json.load(open(B / "naskah_P01.json"))}; Sx = json.load(open(B / "naskah_sisip.json"))
ADG = [("siapKartu", P[1]), ("siapNode", P[2]), ("siapGitVS", P[3]), ("siapPg", P[4]), ("siapCek", P[5]), ("siapPsql", P[6]), ("siapTag", P[7]),
       ("alamatDB", Sx["A04"][0]["teks"]), ("akunContoh", Sx["A08"][0]["teks"]), ("cobaHP", Sx["A10"][0]["teks"]),
       ("sshDocker", Sx["A12"][0]["teks"]), ("dnsA", Sx["A12"][1]["teks"]), ("certbot", Sx["A12"][2]["teks"])]
mau = sys.argv[1:]
with sync_playwright() as p:
    b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto((WEB / "render.html").as_uri())
    for s in ["antre.js", "siap.js"]: pg.evaluate("s => muatSkrip(s)", (WEB / s).as_uri())
    img = (B / "A10/hp_ambil.png").as_uri(); pg.evaluate("s => muat(s)", [img])
    for nama, teks in ADG:
        if mau and nama not in mau: continue
        kal = [x.strip() for x in re.split(r"(?<=[.!?])\s+", teks) if x.strip()]; tot = sum(len(x) for x in kal); au = len(teks) / 14.5
        kt = [0.4 + au * sum(len(x) for x in kal[:j]) / tot for j in range(len(kal))]; D = au + 2.0
        ts = sorted(set([round(min(D - .1, k + (kt[i + 1] - k if i + 1 < len(kt) else D - k) * .92), 2) for i, k in enumerate(kt)]))
        fs = []
        for i, t in enumerate(ts):
            d = pg.evaluate("([n,t,D,a]) => gambar(n,t,D,a)", [nama, t, D, {"kal": kt, "img": img}]); f = OUT / f"{nama}_{i}.jpg"
            open(f, "wb").write(base64.b64decode(d.split(",", 1)[1])); fs.append(str(f))
        n = len(fs); kolom = 2 if n <= 4 else 3
        subprocess.run(["montage", *fs, "-tile", f"{kolom}x", "-geometry", "960x540+6+6", "-background", "#000", str(OUT / f"lembar_{nama}.jpg")], check=True)
        print(nama, f"D={D:.1f}", [round(x, 1) for x in kt], flush=True)
    b.close()
