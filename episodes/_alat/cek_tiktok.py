"""Cek video TikTok sebelum membuat suara dan sebelum render (tanpa render video, cepat):
  1. panjang narasi total (target 450–600 karakter, hemat kredit ElevenLabs) dan per beat;
  2. jumlah baris kotak narasi tiap beat (paling banyak 4; dihitung dengan mesin gambar yang sama, tiktok-core.js);
  3. teks rusak ("undefined", "NaN", "null", "Infinity", "[object") dan error JavaScript di seluruh timeline (tiap 0,2 detik);
  4. teks di ruang aman TikTok: kolom tombol kanan (x > 900, y 900–1500), keterangan bawah (y > 1600), dan atas (y < 150);
  5. beat pertama adegan "kait", beat terakhir adegan "akhir" yang menyebut subscribe dan iTeachSWE.
  python3 episodes/_alat/cek_tiktok.py tiktok/T01            timeline.json bila ada, kalau tidak timeline-teks.json, kalau tidak dibuat sementara
"""
import json, os, re, sys
from playwright.sync_api import sync_playwright
import episode as E

ROOT, _ = E.find_root([a for a in sys.argv[1:] if not a.startswith("--")])
SCRIPT = E.load_script(ROOT)
ENGINE = "\n".join(open(os.path.join(ROOT, f), encoding="utf-8").read() for f in SCRIPT.get("engine", ["../../_alat/tiktok-core.js", "scenes.js"]))
if E.has_variant(ROOT, "suara"): TL, src = E.load_timeline(ROOT, "suara"), "timeline.json"
elif os.path.exists(E.timeline_path(ROOT, "teks")): TL, src = E.load_timeline(ROOT, "teks"), "timeline-teks.json"
else:   # timeline sementara seperti timing.py
    t, beats = 0.0, []
    for b in SCRIPT["beats"]:
        read = max(3.5, len(b["text"].split()) / 1.6 + 0.8); d = read + 1.0 + b.get("hold", 0.8)
        beats.append({**b, "start": t, "speech": t, "audio": read, "dur": d}); t += d
    TL, src = E.timeline_from(SCRIPT, beats, t), "timeline sementara"
TL.setdefault("channel", SCRIPT.get("channel", "youtube.com/@iTeachSWE"))
problems = []

# 1. karakter
chars = sum(len(b["text"]) for b in SCRIPT["beats"])
print(f"{SCRIPT['episode']}: {len(SCRIPT['beats'])} beat, {chars} karakter narasi (target 450–600)")
if not 450 <= chars <= 600: problems.append(f"narasi {chars} karakter, di luar 450–600")
for b in SCRIPT["beats"]:
    if re.search(r"\s{2,}|\s[,.?!]", b["text"]): problems.append(f"beat {b['id']}: spasi ganda atau spasi sebelum tanda baca")
    if not re.search(r"[.?!]$", b["text"].strip()): problems.append(f"beat {b['id']}: kalimat tidak diakhiri tanda baca")
# 5. struktur
if SCRIPT["beats"][0]["scene"] != "kait": problems.append("beat pertama sebaiknya adegan 'kait'")
last = SCRIPT["beats"][-1]
if last["scene"] != "akhir" or "subscribe" not in last["text"].lower() or "iteachswe" not in last["text"].lower():
    problems.append("beat terakhir harus adegan 'akhir' dengan ajakan subscribe channel iTeachSWE")

BAD = r"undefined|NaN|\bnull\b|Infinity|\[object"
HTML = """<!doctype html><html><head><meta charset="utf-8"></head><body><canvas id="c" width="1080" height="1920"></canvas>
<script>window.__hits=[];const of=CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText=function(s,x,y,m){s=String(s);
 if(/__BAD__/.test(s))window.__hits.push(['rusak',s]);
 else if(this.globalAlpha>0.05&&s.trim()){const mt=this.measureText(s),w=mt.width,a=this.textAlign;
  const x0=a==='center'?x-w/2:a==='right'||a==='end'?x-w:x,y0=y-mt.actualBoundingBoxAscent,y1=y+mt.actualBoundingBoxDescent;
  const T=this.getTransform(),P=[[x0,y0],[x0+w,y0],[x0,y1],[x0+w,y1]].map(([px,py])=>[T.a*px+T.c*py+T.e,T.b*px+T.d*py+T.f]);
  const X0=Math.min(...P.map(p=>p[0])),X1=Math.max(...P.map(p=>p[0])),Y0=Math.min(...P.map(p=>p[1])),Y1=Math.max(...P.map(p=>p[1]));
  if(X1>902&&Y1>900&&Y0<1500)window.__hits.push(['kolom kanan',s]);
  else if(Y1>1602)window.__hits.push(['bawah',s]);
  else if(Y0<150)window.__hits.push(['atas',s]);
  else if(X0<-2||X1>1082)window.__hits.push(['keluar layar',s]);}
 return of.call(this,s,x,y,m);};</script>
<script>__ENGINE__</script><script>const TL=__TL__;const ctx=document.getElementById('c').getContext('2d');
window.__run=ts=>{const out=[];for(const t of ts){window.__hits=[];TikTok.draw(ctx,t,TL);for(const h of window.__hits)out.push([t,...h]);}return out;};
window.__lines=()=>TL.beats.map(b=>{const nb=TikTok.narrLayout(ctx,b);return [b.id,nb.lines.length,nb.size,Math.round(nb.y0)];});
window.__ready=true;</script></body></html>"""
html = HTML.replace("__BAD__", BAD).replace("__ENGINE__", ENGINE).replace("__TL__", json.dumps(TL, ensure_ascii=False))
built = os.path.join(ROOT, "cek-tiktok.built.html"); open(built, "w", encoding="utf-8").write(html)
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
    lines = pg.evaluate("window.__lines()")
    hits = []
    for i in range(0, len(ts), 300): hits += pg.evaluate("ts => window.__run(ts)", ts[i:i + 300])
    br.close()
os.remove(built)
# 2. baris narasi
for bid, n, size, y0 in lines:
    flag = "  <-- terlalu panjang" if n > 4 else "  (4 baris: area gambar mengecil)" if n == 4 else ""
    print(f"  {bid:8} {n} baris @{size}px, kotak mulai y {y0}{flag}")
    if n > 4: problems.append(f"beat {bid}: kotak narasi {n} baris (maks 4): pecah beatnya atau persingkat")
beat = lambda t: next(b["id"] for b in reversed(TL["beats"]) if b["start"] <= t)
seen = {}
for t, kind, s in hits: seen.setdefault((beat(t), kind, s), t)
for (bid, kind, s), t in list(seen.items())[:25]: problems.append(f"beat {bid} ({kind}, detik {t:.1f}): {s[:60]!r}")
for e in sorted(set(errs))[:5]: problems.append(f"JS error: {e[:200]}")
print(f"[{src}] {len(ts)} titik waktu diperiksa")
if problems: print("MASALAH:"); [print("  - " + x) for x in problems]
else: print("OK: tidak ada masalah")
sys.exit(1 if problems else 0)
