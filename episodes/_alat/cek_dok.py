"""Pemeriksaan otomatis video dokumenter sebelum render penuh (dari audit D02).
  python3 episodes/_alat/cek_dok.py dok/D03                 semua beat, sampel tiap 0,5 detik
  python3 episodes/_alat/cek_dok.py dok/D03 b2_1 b2_2       beat tertentu
  ... --langkah 0.25                                        jarak sampel (detik)
Memeriksa per frame sampel:
  - teks: setiap fillText dicatat (ukuran huruf sesudah transformasi kamera, kotak di layar). Dilaporkan: huruf < 40 px,
    teks di luar zona aman (x < 96, x > 1824, dasar teks > 930), dan teks yang saling bertumpuk;
  - gerak: bagian yang hampir diam ≥ 4 detik selagi narator bicara;
  - kecerahan: median luminans frame < 60/255;
  - window.__missing: potongan teks at() yang tidak ada di narasi.
Keluaran ringkas di layar dan lengkap di <episode>/cek_dok.json. Tidak membuat video."""
import json, os, sys, base64, io
import numpy as np
from playwright.sync_api import sync_playwright
import episode as E

args = [a for a in sys.argv[1:] if not a.startswith("--")]; STEP = 0.5
if "--langkah" in sys.argv: STEP = float(sys.argv[sys.argv.index("--langkah") + 1]); args = [a for a in args if a != sys.argv[sys.argv.index("--langkah") + 1]]
ROOT, want = E.find_root(args); SCRIPT = E.load_script(ROOT); TL = E.load_timeline(ROOT, "suara")
HOOK = r"""
(() => { const P = CanvasRenderingContext2D.prototype, orig = P.fillText; window.__texts = [];
  P.fillText = function (s, x, y, mw) {
    if (window.__rec && this.canvas.width === 1920 && String(s).trim()) {
      const m = this.getTransform(), fs = parseFloat((this.font.match(/([\d.]+)px/) || [0, 0])[1]), sc = Math.hypot(m.a, m.b);
      const w = this.measureText(s).width, al = this.textAlign; const x0 = al === 'center' ? x - w / 2 : (al === 'right' || al === 'end') ? x - w : x;
      const X = m.a * x0 + m.c * y + m.e, Y = m.b * x0 + m.d * y + m.f;
      if (this.globalAlpha > 0.35) window.__texts.push({ s: String(s).slice(0, 40), px: Math.round(fs * sc), x: Math.round(X), y: Math.round(Y), w: Math.round(w * sc), a: +this.globalAlpha.toFixed(2) });
    }
    return orig.call(this, s, x, y, mw);
  };
})();"""
html = (open(os.path.join(E.ALAT, "render.html"), encoding="utf-8").read()
        .replace("__ENGINE__", HOOK + "\n" + E.engine_js(ROOT, SCRIPT)).replace("__TIMELINE__", json.dumps(TL, ensure_ascii=False)))
built = os.path.join(ROOT, "cek-suara.built.html"); open(built, "w", encoding="utf-8").write(html)
beats = [b for b in TL["beats"] if not want or b["id"] in want]
rep = {"kecil": [], "luar": [], "tumpuk": [], "diam": [], "gelap": [], "missing": []}
def lum(data):
    from PIL import Image
    im = Image.open(io.BytesIO(base64.b64decode(data.split(",", 1)[1]))).convert("L").resize((96, 54)); return np.asarray(im, dtype=np.float32)
with sync_playwright() as p:
    br = p.chromium.launch(args=E.browser_args(SCRIPT)); pg = br.new_page(viewport={"width": 1920, "height": 1080}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + built); pg.wait_for_function("window.__ready")
    for b in beats:
        prev = None; still = 0.0; ts = np.arange(0.05, b["dur"], STEP)
        for l in ts:
            t = b["start"] + l
            data = pg.evaluate("t => { window.__texts = []; window.__rec = true; const d = window.__seek(t); window.__rec = false; return d; }", t)
            texts = pg.evaluate("window.__texts"); g = lum(data); stamp = f"{b['id']}@{l:.1f}s ({int(t // 60)}:{t % 60:04.1f})"
            for x in texts:
                if x["px"] < 40: rep["kecil"].append(f"{stamp} {x['px']}px “{x['s']}”")
                if x["x"] < 96 or x["x"] + x["w"] > 1824 or x["y"] > 930 or x["y"] < 60: rep["luar"].append(f"{stamp} ({x['x']},{x['y']}) “{x['s']}”")
            for i in range(len(texts)):
                for j in range(i + 1, len(texts)):
                    a, c = texts[i], texts[j]
                    if a["s"] == c["s"]: continue
                    ha, hc = a["px"] * 0.8, c["px"] * 0.8
                    if a["x"] < c["x"] + c["w"] and c["x"] < a["x"] + a["w"] and a["y"] - ha < c["y"] and c["y"] - hc < a["y"]:
                        rep["tumpuk"].append(f"{stamp} “{a['s']}” × “{c['s']}”")
            med = float(np.median(g))
            if med < 60: rep["gelap"].append(f"{stamp} median {med:.0f}")
            speaking = b["speech"] - b["start"] <= l <= b["speech"] - b["start"] + b["audio"]
            if prev is not None and float(np.mean(np.abs(g - prev))) < 0.6 and speaking: still += STEP
            else:
                if still >= 4: rep["diam"].append(f"{b['id']} {still:.1f}s diam berakhir di {l:.1f}s")
                still = 0.0
            prev = g
        if still >= 4: rep["diam"].append(f"{b['id']} {still:.1f}s diam sampai akhir beat")
    rep["missing"] = pg.evaluate("window.__missing || []"); rep["galat"] = errs[:20]
    br.close()
os.remove(built)
json.dump(rep, open(os.path.join(ROOT, "cek_dok.json"), "w"), ensure_ascii=False, indent=1)
for k, v in rep.items():
    print(f"{k}: {len(v)}"); [print("   ", x) for x in v[:12]]
print("lengkap:", os.path.join(ROOT, "cek_dok.json"))
