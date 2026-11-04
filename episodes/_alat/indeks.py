"""Halaman daftar latihan untuk situs Vercel -> index.html dan vercel.json (link pendek /<kode>) di akar repositori.
  python3 episodes/_alat/indeks.py
Membaca script.json tiap episode (judul, hook, bagian, JP) dan alat_luar.json (link situs dan alat luar)."""
import glob, html, json, os
import episode as E

ALAT_DIR = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(os.path.dirname(ALAT_DIR))
AL = json.load(open(os.path.join(ALAT_DIR, "alat_luar.json"), encoding="utf-8"))
SITUS_HOST = AL["situs"].split("//", 1)[1]
KELAS = [("D7", "Kelas VII", "Fase D"), ("D8", "Kelas VIII", "Fase D"), ("D9", "Kelas IX", "Fase D"), ("E", "Kelas X", "Fase E"), ("F11", "Kelas XI", "Fase F"), ("F12", "Kelas XII", "Fase F")]
def key(code):
    a, b = code.split("."); return (a, int(b))
eps = []
for p in glob.glob(os.path.join(REPO, "episodes", "*", "script.json")):
    s = json.load(open(p, encoding="utf-8")); code = s["episode"]; slug = E.code_slug(code)
    page = f"episodes/{code}/episode-{slug}.html"
    if not os.path.exists(os.path.join(REPO, page)): continue
    eps.append(dict(code=code, title=s["title"], hook=s.get("hook", ""), jp=s.get("youtube", {}).get("jp"), page=page, parts=len(s.get("parts", {})),
                    alat=[x for k in AL["episode"].get(code, []) for x in AL["alat"][k]]))
eps.sort(key=lambda e: key(e["code"]))
# video simulasi yang sudah punya halaman pemutar (episodes/sim/<kode>/simulasi-<kode>.html)
sims = []
for p in glob.glob(os.path.join(REPO, "episodes", "sim", "*", "script.json")):
    s = json.load(open(p, encoding="utf-8")); code = s["episode"]; page = f"episodes/sim/{code}/simulasi-{E.code_slug(code)}.html"
    if os.path.exists(os.path.join(REPO, page)): sims.append(dict(code=code, title=s["title"], hook=s.get("hook", ""), kind=s.get("kind", "praktik"), page=page, eps=s.get("for", [])))
sims.sort(key=lambda x: (x["code"][0] != "S", int(x["code"][1:])))
e_ = html.escape
def sim_links(code):
    xs = [x for x in sims if code in x["eps"]]
    return (f'<p class="tools">Video simulasi: {" · ".join(f'<a href="{e_(x["page"])}">{e_(x["code"])} {e_(x["title"])}</a>' for x in xs)}</p>') if xs else ""
sec = []
for pre, nama, fase in KELAS:
    rows = [e for e in eps if e["code"].split(".")[0] == pre]
    if not rows: continue
    cards = "".join(f'''<li class="ep"><a class="main" href="{e_(e["page"])}"><span class="code">{e_(e["code"])}</span><span class="t">{e_(e["title"])}</span></a>
<p class="hook">Setelah menonton, kamu bisa {e_(e["hook"])}</p><p class="meta">{e["jp"]} JP · {e["parts"]} bagian video · link: {e_(SITUS_HOST)}/{e_(E.code_slug(e["code"]))}</p>''' + (f'''<p class="tools">Alat di komputer: {" · ".join(f'<a href="{e_(u)}" rel="noopener">{e_(n)}</a>' for n, u in e["alat"])}</p>''' if e["alat"] else "") + sim_links(e["code"]) + "</li>" for e in rows)
    sec.append(f'<section id="{pre.lower()}"><h2>{nama} <small>{fase}</small></h2><ul class="list">{cards}</ul></section>')
if sims:
    for kind, judul in (("praktik", "Simulasi praktik"), ("konsep", "Simulasi konsep")):
        rows = [x for x in sims if x["kind"] == kind]
        if not rows: continue
        cards = "".join(f'''<li class="ep"><a class="main" href="{e_(x["page"])}"><span class="code">{e_(x["code"])}</span><span class="t">{e_(x["title"])}</span></a>
<p class="hook">{("Setelah menonton, kamu bisa " + e_(x["hook"])) if x["hook"] else ""}</p><p class="meta">Untuk episode {e_(", ".join(x["eps"]))} · link: {e_(SITUS_HOST)}/{e_(E.code_slug(x["code"]))}</p></li>''' for x in rows)
        sec.append(f'<section id="sim-{kind}"><h2>{judul} <small>video peragaan</small></h2><ul class="list">{cards}</ul></section>')
nav = " ".join(f'<a href="#{p.lower()}">{n}</a>' for p, n, _ in KELAS if any(e["code"].split(".")[0] == p for e in eps)) + ("".join(f' <a href="#sim-{k}">{n}</a>' for k, n in (("praktik", "Simulasi praktik"), ("konsep", "Simulasi konsep")) if any(x["kind"] == k for x in sims)))
doc = f'''<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Latihan Animasi Informatika</title>
<meta name="description" content="Halaman latihan interaktif seri Animasi Informatika SMP–SMA (CP 2025): kuis dengan petunjuk, simulasi, dan kegiatan per episode.">
<style>
:root {{ --bg: #F4F8F6; --surface: #FFFFFF; --surface2: #EAF2EE; --ink: #1F2A33; --ink2: #4A5A66; --line: #CFDCD5; --accent: #2E7E9A; --warm: #B57A12; }}
@media (prefers-color-scheme: dark) {{ :root {{ --bg: #141B20; --surface: #1D262D; --surface2: #25313A; --ink: #E8EEF1; --ink2: #A9B7C0; --line: #33424C; --accent: #7CC4DD; --warm: #F2B134; }} }}
* {{ box-sizing: border-box }} body {{ margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.5 Inter, system-ui, sans-serif }}
.wrap {{ max-width: 860px; margin: 0 auto; padding: 20px 16px 48px }}
h1 {{ font-size: 28px; margin: 4px 0 6px }} .eyebrow {{ color: var(--warm); font-weight: 800; font-size: 14px }} .lead {{ color: var(--ink2); margin: 0 0 12px }}
nav {{ display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0 8px; position: sticky; top: 0; background: var(--bg); padding: 8px 0; z-index: 1 }}
nav a {{ border: 2px solid var(--line); border-radius: 999px; padding: 4px 12px; color: var(--ink); text-decoration: none; font-weight: 700; font-size: 14px }}
section {{ scroll-margin-top: 110px }} h2 {{ font-size: 22px; margin: 28px 0 10px }} h2 small {{ color: var(--ink2); font-size: 14px; font-weight: 700 }}
.list {{ list-style: none; padding: 0; margin: 0; display: grid; gap: 10px }}
.ep {{ background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px }}
.ep a.main {{ display: flex; gap: 10px; align-items: baseline; text-decoration: none; color: var(--ink) }}
.code {{ background: var(--accent); color: var(--bg); border-radius: 8px; padding: 1px 8px; font-weight: 800; font-size: 14px; flex: none }}
.t {{ font-weight: 800; font-size: 17px; text-decoration: underline; text-decoration-color: var(--line); text-underline-offset: 3px }}
.hook {{ margin: 6px 0 2px; color: var(--ink2); font-size: 15px }} .meta {{ margin: 0; color: var(--ink2); font-size: 13px; font-weight: 700 }}
.tools {{ margin: 6px 0 0; font-size: 14px }} .tools a {{ color: var(--accent); font-weight: 700 }}
.note {{ background: var(--surface2); border-radius: 12px; padding: 10px 14px; font-size: 14px; color: var(--ink2) }}
</style></head><body><div class="wrap">
<div class="eyebrow">Seri Animasi Informatika · SMP–SMA · CP 2025</div>
<h1>Latihan interaktif per episode</h1>
<p class="lead">Ketuk judul episode untuk membuka halamannya: video, cek pemahaman dengan petunjuk, dan latihan. Kemajuan tersimpan di perangkat masing-masing. Semua halaman bisa dibuka di HP.</p>
<nav aria-label="Kelas">{nav}</nav>
{"".join(sec)}
<p class="note" style="margin-top:28px">Tokoh: robot Kiko, Dito, dan Sinta. Semua gambar dibuat dengan kode; semua nama, akun, dan data dalam contoh bersifat fiktif. Untuk guru: tiap halaman memuat bagian "Untuk guru" dengan pembagian JP.</p>
</div></body></html>
'''
open(os.path.join(REPO, "index.html"), "w", encoding="utf-8").write(doc)
# link pendek: /d70 -> /episodes/D7.0/episode-d70.html (redirect, bukan rewrite, supaya narasi.mp3 yang dipanggil relatif tetap ketemu)
VJ = {"$schema": "https://openapi.vercel.sh/vercel.json", "cleanUrls": False, "trailingSlash": False,
      "redirects": [{"source": "/" + E.code_slug(e["code"]), "destination": "/" + e["page"], "permanent": False} for e in eps + sims]}
open(os.path.join(REPO, "vercel.json"), "w", encoding="utf-8").write(json.dumps(VJ, ensure_ascii=False, indent=1) + "\n")
print(os.path.join(REPO, "index.html"), len(eps), "episode,", len(sims), "simulasi")
