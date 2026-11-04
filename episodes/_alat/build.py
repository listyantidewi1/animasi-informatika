"""Bangun halaman latihan satu berkas: <episode>/page.html + page-core.css/js + mesin gambar + kedua timeline -> <episode>/episode-<kode>.html
  python3 episodes/_alat/build.py D7.0
Halaman memuat timeline versi suara (bila ada) dan versi teks; tombol suara di pemutar berpindah di antara keduanya."""
import json, os, sys
import episode as E

ROOT, _ = E.find_root(sys.argv[1:])
script = E.load_script(ROOT)
teks = E.load_timeline(ROOT, "teks") if os.path.exists(E.timeline_path(ROOT, "teks")) else None
suara = E.load_timeline(ROOT, "suara") if E.has_variant(ROOT, "suara") else None
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
out = os.path.join(ROOT, f"{'simulasi' if SIM else 'episode'}-{E.code_slug(script['episode'])}.html")
open(out, "w", encoding="utf-8").write(page)
print(out, len(page) // 1024, "KB", "(suara + teks)" if suara and teks else "(teks saja)" if teks else "(suara saja)")
