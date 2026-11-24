"""Bangun halaman latihan satu berkas: <episode>/page.html + page-core.css/js + mesin gambar + kedua timeline -> <episode>/episode-<kode>.html
  python3 episodes/_alat/build.py D7.0
Halaman memuat timeline versi suara (bila ada) dan versi teks; tombol suara di pemutar berpindah di antara keduanya."""
import json, os, sys
import episode as E

ROOT, _ = E.find_root(sys.argv[1:])
script = E.load_script(ROOT)
teks = E.load_timeline(ROOT, "teks") if os.path.exists(E.timeline_path(ROOT, "teks")) else None
# halaman cukup memakai timeline.json + narasi.mp3 (audio/narration.wav hanya untuk render dan tidak ada di git)
suara = E.load_timeline(ROOT, "suara") if os.path.exists(E.timeline_path(ROOT, "suara")) and (E.has_variant(ROOT, "suara") or os.path.exists(os.path.join(ROOT, "narasi.mp3"))) else None
if not teks and not suara: raise SystemExit("belum ada timeline: jalankan timing.py dan/atau voice.py dulu")
css = open(os.path.join(E.ALAT, "page-core.css"), encoding="utf-8").read()
js = open(os.path.join(E.ALAT, "page-core.js"), encoding="utf-8").read()


def yt_id(v):
    """Link YouTube (youtu.be/…, watch?v=…, shorts/…, embed/…) atau ID 11 karakter -> ID; selain itu kosong."""
    import re
    m = re.search(r"(?:youtu\.be/|v=|shorts/|embed/|live/)([A-Za-z0-9_-]{11})", v or "") or re.fullmatch(r"([A-Za-z0-9_-]{11})", (v or "").strip())
    return m.group(1) if m else ""


YTMAP = E.load_json(os.path.join(E.ALAT, "youtube_id.json")) if os.path.exists(os.path.join(E.ALAT, "youtube_id.json")) else {}
_parts = list(script.get("parts", {}).keys()) or [script["episode"]]
YT = [{"part": k, "id": yt_id(YTMAP.get(k, ""))} for k in _parts]
YT = [x for x in YT if x["id"]]
# hanya video yang sudah tayang (yt_tayang.py); video terjadwal masih pribadi dan tidak bisa diputar murid
_TAYANG = os.path.join(E.ALAT, "youtube_tayang.json")
if os.path.exists(_TAYANG):
    _t = E.load_json(_TAYANG); YT = [x for x in YT if _t.get(x["part"], {}).get("id") == x["id"]]
js = "window.__YT = " + json.dumps(YT) + ";\n" + js   # video YouTube halaman ini (kosong = pemutar animasi saja)
SIM = "for" in script and not os.path.exists(os.path.join(ROOT, "page.html"))   # video simulasi: halaman pemutar bersama
if SIM: teks = None   # simulasi hanya versi bersuara


def sim_template():
    """Halaman pemutar video simulasi (episodes/_alat/sim-page.html), diisi dari script.json simulasi."""
    import html
    esc = lambda s: html.escape(str(s), quote=False)
    yt = script.get("youtube", {}); jenis = "Simulasi konsep" if script.get("kind") == "konsep" else "Simulasi praktik"
    links = []
    for c in script["for"]:
        try: t = E.load_script(os.path.join(E.EPISODES, c))["title"]
        except Exception: t = ""
        links.append(f'<a href="../../{c}/episode-{E.code_slug(c)}.html">Episode {c}: {esc(t)}<span>Tonton episodenya dan kerjakan latihannya.</span></a>')
    links.append('<a href="../../../index.html">Daftar semua episode<span>Kembali ke halaman utama.</span></a>')
    hint = (f"Setelah menonton, kamu bisa {esc(script['hook'])} " if script.get("hook") else "") + \
           f"Simulasi ini melengkapi episode {', '.join(script['for'])}. " + \
           ("Saat muncul pertanyaan \"Menurutmu …\", hentikan dulu videonya dan tebak jawabannya." if script.get("kind") == "konsep"
            else "Hentikan videonya di setiap jeda \"Coba sekarang\" untuk mencoba sendiri.")
    rep = {"__TITLE__": esc(f"Kiko: {script['title']}"), "__EYEBROW__": esc(f"Informatika · {jenis} · {script['episode']}"), "__H1__": esc(script["title"]),
           "__HINT__": hint, "__BELAJAR__": "".join(f"<li>{esc(x)}</li>" for x in yt.get("belajar", [])), "__LINKS__": "".join(links)}
    s = open(os.path.join(E.ALAT, "sim-page.html"), encoding="utf-8").read()
    for k, v in rep.items(): s = s.replace(k, v)
    return s


page = ((sim_template() if SIM else open(os.path.join(ROOT, "page.html"), encoding="utf-8").read())
        .replace("__PAGE_CSS__", css).replace("__ENGINE__", E.engine_js(ROOT, script)).replace("__PAGE_JS__", js)
        .replace("__TIMELINE_TEKS__", json.dumps(teks, ensure_ascii=False)).replace("__TIMELINE__", json.dumps(suara, ensure_ascii=False)))
if not SIM:
    # tombol "Tonton simulasi": video simulasi (episodes/sim/*) yang memakai episode ini dan sudah punya halaman pemutar
    import glob, html
    sims = []
    for sp in sorted(glob.glob(os.path.join(E.EPISODES, "sim", "*", "script.json"))):
        ss = E.load_script(os.path.dirname(sp)); c = ss["episode"]
        if script["episode"] in ss.get("for", []) and os.path.exists(os.path.join(os.path.dirname(sp), f"simulasi-{E.code_slug(c)}.html")):
            sims.append((c, ss["title"], ss.get("kind", "praktik")))
    sims.sort(key=lambda x: (x[0][0] != "S", int(x[0][1:])))
    if sims:
        btn = "".join(f'<a class="simbtn" href="../sim/{c}/simulasi-{E.code_slug(c)}.html">▶ Tonton simulasi {c}<span>{html.escape(t)}</span></a>' for c, t, k in sims)
        card = ('\n  <section class="card" aria-label="Video simulasi">\n    <h2>Video simulasi</h2>\n    <p class="hint">Peragaan langkah demi langkah untuk dicoba sendiri di komputer atau HP.</p>\n'
                f'    <div class="simlinks">{btn}</div>\n  </section>')
        style = ('<style>.simlinks{display:grid;gap:10px}.simbtn{display:block;background:var(--accent);color:var(--accent-ink);text-decoration:none;font-weight:900;border-radius:12px;padding:12px 16px}'
                 '.simbtn span{display:block;font-weight:600;font-size:15px;opacity:.9}</style>')
        i = page.find("</section>")
        if i > 0: page = page[:i + 10] + card + page[i + 10:] + style
# kartu "File untuk latihan": file data/kode yang dipakai di video (bahan/bahan.json), untuk halaman simulasi dan episode pemakainya
import html as _html
_bahan_path = os.path.join(E.EPISODES, "..", "bahan", "bahan.json")
_bahan = json.load(open(_bahan_path, encoding="utf-8")) if os.path.exists(_bahan_path) else {}
_kode = script["episode"]
_sumber = [(_kode, None)] if _kode in _bahan else []
if not SIM:
    _sumber += [(c, t) for c, t, k in sims if c in _bahan]
if _sumber:
    _bdir = os.path.relpath(os.path.join(E.EPISODES, "..", "bahan"), ROOT).replace(os.sep, "/")
    _isi = ""
    for c, t in _sumber:
        if t and len(_sumber) > 1 or t and not SIM:
            _isi += f'    <h3 class="bh-s">Dari simulasi {c}: {_html.escape(t)}</h3>\n'
        elif len(_sumber) > 1:
            _isi += '    <h3 class="bh-s">Dari episode ini</h3>\n'
        _isi += '    <div class="bh-list">' + "".join(
            f'<a class="bh-f" href="{_bdir}/{c}/{b["file"]}" download><b>&darr; {_html.escape(b["file"])}</b><span>{_html.escape(b["ket"])}</span></a>'
            for b in _bahan[c]) + '</div>\n'
    _card = ('\n  <section class="card bahan" aria-label="File untuk latihan">\n    <h2>File untuk latihan</h2>\n'
             '    <p class="hint">Download file yang dipakai di video, lalu buka di aplikasimu supaya kamu bisa ikut mencoba. Semua datanya rekaan.</p>\n'
             + _isi + '  </section>')
    _style = ('<style>.bh-list{display:grid;gap:10px}.bh-s{font-size:16px;margin:14px 0 8px}.bh-f{display:block;background:var(--surface2);color:var(--ink);text-decoration:none;border-radius:12px;padding:12px 16px;overflow-wrap:anywhere}'
              '.bh-f b{display:block;font-weight:900}.bh-f span{display:block;font-size:15px;opacity:.9}.bh-f:hover,.bh-f:focus-visible{background:var(--accent);color:var(--accent-ink)}</style>')
    # setelah kartu "Video simulasi" bila ada, kalau tidak setelah kartu pertama (pemutar)
    i = page.find('aria-label="Video simulasi"')
    i = page.find("</section>", i if i > 0 else 0)
    if i > 0: page = page[:i + 10] + _card + page[i + 10:] + _style
# kartu "Tonton dulu": link ke episode prasyarat (kunci youtube.prasyarat di script.json) + video YouTube-nya yang sudah tayang
def prasyarat_kodes(teks_pr):
    import re
    kode = []
    for m in re.finditer(r"\b([DEF]\d*)\.(\d+)\b(?:\s+sampai\s+\1\.(\d+)\b)?", teks_pr):
        a = int(m.group(2)); b = int(m.group(3)) if m.group(3) else a
        for n in range(a, b + 1):
            c = f"{m.group(1)}.{n}"
            if c not in kode and c != script["episode"]: kode.append(c)
    return kode


_pr = script.get("youtube", {}).get("prasyarat", "")
if not SIM and _pr and 'class="card prasyarat"' not in page and "</header>" in page:
    import html
    _tay = E.load_json(_TAYANG) if os.path.exists(_TAYANG) else {}
    _items = []; esc = html.escape

    def rangkuman_html(c, ps):
        """Rangkuman materi episode prasyarat: episodes/<kode>/rangkuman.json (per bagian, ditulis tangan); cadangan: ringkas + belajar + recap dari script.json."""
        rp = os.path.join(E.EPISODES, c, "rangkuman.json"); y = ps.get("youtube", {}); out = []
        if os.path.exists(rp):
            r = E.load_json(rp)
            if r.get("inti"): out.append(f'<p>{esc(r["inti"])}</p>')
            for bg in r.get("bagian", []):
                out.append(f'<h4>{esc(bg["judul"])}</h4><ul>{"".join(f"<li>{esc(x)}</li>" for x in bg["poin"])}</ul>')
            if r.get("ingat"): out.append(f'<h4>Yang perlu diingat</h4><ul>{"".join(f"<li>{esc(x)}</li>" for x in r["ingat"])}</ul>')
        else:
            if y.get("ringkas"): out.append(f'<p>{esc(y["ringkas"])}</p>')
            if y.get("belajar"): out.append(f'<h4>Yang dipelajari</h4><ul>{"".join(f"<li>{esc(x)}</li>" for x in y["belajar"])}</ul>')
            if ps.get("recap"): out.append(f'<h4>Yang perlu diingat</h4><ul>{"".join(f"<li>{esc(x)}</li>" for x in ps["recap"])}</ul>')
        return "".join(out)

    for c in prasyarat_kodes(_pr):
        d = os.path.join(E.EPISODES, c)
        if not os.path.exists(os.path.join(d, "script.json")): continue
        ps = E.load_script(d); pparts = list(ps.get("parts", {}).keys()) or [c]
        vids = [(k, _tay[k]["id"]) for k in pparts if _tay.get(k, {}).get("id")]
        vid = ""
        if vids:
            fr = "".join((f'<p class="pr-bag">Bagian {i + 1}</p>' if len(vids) > 1 else "")
                         + f'<div class="yt-frame"><iframe data-src="https://www.youtube-nocookie.com/embed/{v}?rel=0" title="Video episode {c}{(" bagian " + str(i + 1)) if len(vids) > 1 else ""}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>'
                         + f'<p class="pr-luar"><a href="https://www.youtube.com/watch?v={v}" target="_blank" rel="noopener">Buka di YouTube</a></p>'
                         for i, (k, v) in enumerate(vids))
            vid = f'<details class="pr-d pr-vid"><summary>&#9654; Tonton videonya di sini</summary><div class="pr-isi">{fr}</div></details>'
        rk = rangkuman_html(c, ps)
        rk = f'<details class="pr-d"><summary>Baca rangkuman materinya</summary><div class="pr-isi pr-rk">{rk}</div></details>' if rk else ""
        _items.append(f'<li><a class="pr-ep" href="../{c}/episode-{E.code_slug(c)}.html">Episode {c}: {esc(ps["title"])}</a>{vid}{rk}</li>')
    if _items:
        _ket = esc(_pr[0].upper() + _pr[1:])
        _card = ('<details class="card prasyarat" aria-label="Prasyarat">\n    <summary><b>Prasyarat</b> <span>' + _ket + '</span></summary>\n'
                 '    <p class="hint">Belum menonton episode prasyaratnya? Ketuk judulnya untuk membuka halaman latihannya, tonton videonya di sini, atau baca rangkumannya bila waktumu sedikit.</p>\n'
                 f'    <ul class="pr-list">{"".join(_items)}</ul>\n  </details>\n  '
                 '<style>.prasyarat{padding:0}.prasyarat>summary{cursor:pointer;padding:14px 18px;min-height:48px;list-style-position:outside;margin-left:22px;padding-left:4px}'
                 '.prasyarat>summary b{font-weight:900}.prasyarat>summary span{color:var(--ink2);font-weight:600}.prasyarat>.hint{margin:0 18px 14px}.prasyarat>.pr-list{margin:0 10px 12px}'
                 '.pr-list{list-style:none;padding:0;display:grid;gap:10px}.pr-list>li{background:var(--surface2);border-radius:12px;padding:10px;min-width:0}'
                 '.pr-ep{display:block;color:var(--ink);font-weight:800;text-decoration:underline;text-decoration-color:var(--line);text-underline-offset:3px;min-height:28px}'
                 '.pr-d{margin-top:8px;background:var(--surface);border:1px solid var(--line);border-radius:10px}.pr-d>summary{cursor:pointer;font-weight:800;padding:10px 12px;min-height:44px}'
                 '.pr-vid>summary{color:#B8322A}.pr-isi{padding:0 12px 12px}.pr-bag{font-weight:800;margin:10px 0 6px}.pr-luar{margin:6px 0 0;font-size:14px}.pr-luar a{color:var(--accent);font-weight:700}'
                 '.pr-rk{font-size:16px}.pr-rk h4{margin:12px 0 4px;font-size:16px}.pr-rk p{margin:0 0 6px}.pr-rk ul{margin:0;padding-left:20px}.pr-rk li{margin-bottom:4px}'
                 '@media (prefers-color-scheme: dark){.pr-vid>summary{color:#FF8A80}}</style>\n  '
                 '<script>document.addEventListener("toggle",function(e){var d=e.target;if(!d.classList||!d.classList.contains("pr-vid"))return;'
                 '[].forEach.call(d.querySelectorAll("iframe"),function(f){if(d.open){if(!f.src)f.src=f.getAttribute("data-src");}else if(f.src){f.removeAttribute("src");}});},true);</script>\n  ')
        i = page.find("</header>") + len("</header>")
        page = page[:i] + "\n\n  " + _card + page[i:]

# tombol kembali ke beranda (index.html) di atas setiap halaman; path relatif supaya tetap jalan luring
_home = os.path.relpath(os.path.join(E.EPISODES, "..", "index.html"), ROOT).replace(os.sep, "/")
_nav = (f'<nav class="topnav" aria-label="Navigasi"><a href="{_home}">&larr; Kembali ke daftar episode</a></nav>\n  '
        '<style>.topnav{position:sticky;top:0;z-index:20;margin:-16px -16px 12px;padding:10px 16px;background:var(--bg);border-bottom:1px solid var(--line)}'
        '.topnav a{display:inline-flex;align-items:center;min-height:44px;padding:8px 14px;border-radius:12px;background:var(--surface2);color:var(--ink);font-weight:800;text-decoration:none}'
        '.topnav a:hover,.topnav a:focus-visible{background:var(--accent);color:var(--accent-ink)}</style>\n  ')
if 'class="topnav"' not in page and "<header>" in page:
    page = page.replace("<header>", _nav + "<header>", 1)
out = os.path.join(ROOT, f"{'simulasi' if SIM else 'episode'}-{E.code_slug(script['episode'])}.html")
open(out, "w", encoding="utf-8").write(page)
print(out, len(page) // 1024, "KB", "(suara + teks)" if suara and teks else "(teks saja)" if teks else "(suara saja)")
