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
page = (open(os.path.join(ROOT, "page.html"), encoding="utf-8").read()
        .replace("__PAGE_CSS__", css).replace("__ENGINE__", E.engine_js(ROOT, script)).replace("__PAGE_JS__", js)
        .replace("__TIMELINE_TEKS__", json.dumps(teks, ensure_ascii=False)).replace("__TIMELINE__", json.dumps(suara, ensure_ascii=False)))
out = os.path.join(ROOT, f"episode-{E.code_slug(script['episode'])}.html")
open(out, "w", encoding="utf-8").write(page)
print(out, len(page) // 1024, "KB", "(suara + teks)" if suara and teks else "(teks saja)" if teks else "(suara saja)")
