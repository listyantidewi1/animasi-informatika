"""Cek teks rusak di animasi: menjalankan seluruh timeline (tiap 0,2 detik, plus awal dan akhir tiap beat) dan menangkap setiap
teks yang digambar berisi "undefined", "NaN", "null", "Infinity", "[object", atau angka negatif aneh (mis. "ke--3", "ke-—").
Juga melaporkan error JavaScript.  Tanpa render video, cepat.
  python3 episodes/_alat/cek_teks.py sim/K02            timeline suara (bawaan bila ada), atau --teks
  python3 episodes/_alat/cek_teks.py sim/K02 --short    Short (short/timeline*.json, dengan short.js)
"""
import json, os, re, sys
from playwright.sync_api import sync_playwright
import episode as E

flags = [a for a in sys.argv[1:] if a.startswith("--")]
ROOT, _ = E.find_root([a for a in sys.argv[1:] if not a.startswith("--")])
SHORT = "--short" in flags
SCRIPT = E.load_script(ROOT)
ENGINE = E.engine_js(ROOT, SCRIPT)
if SHORT:
    SR = os.path.join(ROOT, "short"); variant = "suara" if os.path.exists(E.timeline_path(SR, "suara")) else "teks"
    TL = E.load_timeline(SR, variant); src = {b["id"]: b for b in E.load_timeline(ROOT, variant)["beats"]}
    for b in TL["beats"]:
        if b.get("src") in src: s0 = src[b["src"]]; b["src_dur"] = s0["dur"]; b["src_audio"] = s0["audio"]; b["src_text"] = s0["text"]; b["src_lead"] = (s0["speech"] - s0["start"]) if s0.get("speech") is not None else 0.4
    TL.update(label="Simulasi", full_title=SCRIPT["title"], link="x")
    ENGINE += "\n" + open(os.path.join(E.ALAT, "short.js"), encoding="utf-8").read()
    DRAW = "const off=document.createElement('canvas');off.width=1920;off.height=1080;cv.width=1080;cv.height=1920;window.__d=t=>Kiko.drawShort(ctx,off,t,TL);"
else:
    variant = "suara" if E.has_variant(ROOT, "suara") and "--teks" not in flags else "teks"
    TL = E.load_timeline(ROOT, variant)
    DRAW = "window.__d=t=>Kiko.draw(ctx,t,TL);"
BAD = re.compile(r"undefined|NaN|\bnull\b|Infinity|\[object|ke-[-—–]|-\d+\s*%")
HTML = """<!doctype html><html><head><meta charset="utf-8"></head><body><canvas id="c" width="1920" height="1080"></canvas>
<script>window.__bad={};const of=CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText=function(s,x,y,m){s=String(s);if(/__RE__/.test(s)){window.__bad[s]=(window.__bad[s]||0)+1;window.__last=s;}return of.call(this,s,x,y,m);};</script>
<script>__ENGINE__</script><script>const TL=__TL__;const cv=document.getElementById('c'),ctx=cv.getContext('2d');__DRAW__
window.__run=ts=>{const hits=[];for(const t of ts){window.__last=null;__d(t);if(window.__last)hits.push([t,window.__last]);}return hits;};window.__ready=true;</script></body></html>"""
html = HTML.replace("__RE__", BAD.pattern.replace("\\b", "\\b")).replace("__ENGINE__", ENGINE).replace("__TL__", json.dumps(TL, ensure_ascii=False)).replace("__DRAW__", DRAW)
built = os.path.join(ROOT, "short" if SHORT else "", "cek-teks.built.html"); open(built, "w", encoding="utf-8").write(html)
ts = []
for b in TL["beats"]:
    t, end = b["start"], b["start"] + b["dur"]
    ts += [b["start"] + 0.02, b["start"] + 0.15, end - 0.05]
    while t < end: ts.append(round(t, 3)); t += 0.2
ts = sorted(set(x for x in ts if 0 <= x < TL["total"]))
with sync_playwright() as p:
    br = p.chromium.launch(); pg = br.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + built); pg.wait_for_function("window.__ready")
    hits = []
    for i in range(0, len(ts), 400): hits += pg.evaluate("ts => window.__run(ts)", ts[i:i + 400])
    br.close()
os.remove(built)
beat = lambda t: next(b["id"] for b in reversed(TL["beats"]) if b["start"] <= t)
by = {}
for t, s in hits: by.setdefault(beat(t), []).append((round(t - next(b["start"] for b in TL["beats"] if b["id"] == beat(t)), 2), s))
tag = "Short" if SHORT else variant
if not by and not errs: print(f"[{tag}] OK: {len(ts)} titik waktu, tidak ada teks rusak")
for k, v in by.items(): print(f"[{tag}] beat {k}: {len(v)}×, mis. detik {v[0][0]}: {v[0][1][:80]!r}")
for e in sorted(set(errs))[:5]: print(f"[{tag}] JS error: {e[:200]}")
sys.exit(1 if by or errs else 0)
