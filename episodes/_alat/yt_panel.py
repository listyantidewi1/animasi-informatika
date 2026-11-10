"""Panel "Judul & deskripsi YouTube" di halaman pelacak Unggahan Seri Informatika (koleksi DB "yt").
Membaca semua youtube.md (episode, sim/, dok/, termasuk short/youtube.md) -> satu dokumen per kode.
  python3 episodes/_alat/yt_panel.py <folder_keluaran>        (mis. folder scratchpad sesi)
Hasil: <folder>/<kode_titik_jadi_garis_bawah>.json dan <folder>/_batch<n>.json (maks 50 writes per berkas).
Tulis ke pelacak dengan ArtifactData action "batch" (writes dari _batch*.json; dokumen yang sudah ada perlu if_version,
atau cukup kirim dokumen baru/berubah satu per satu dengan "set")."""
import json, os, re, glob, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if len(sys.argv) < 2: sys.exit(__doc__)
OUT = os.path.abspath(sys.argv[1])
def block_after(txt, label):
    i = txt.find(label)
    if i < 0: return ""
    m = re.search(r"```\n(.*?)\n```", txt[i:], re.S); return m.group(1).strip() if m else ""
def title_after(txt):
    m = re.search(r"\*\*Judul\*\*[^\n]*\n\s*\n?([^\n]+)", txt); return m.group(1).strip() if m else ""
def sections(txt):
    parts = re.split(r"^## (.+)$", txt, flags=re.M); return [(parts[i].strip(), parts[i + 1]) for i in range(1, len(parts), 2)]
def short(d):
    p = f"{d}/short/youtube.md"
    if not os.path.exists(p): return None
    t = open(p, encoding="utf-8").read(); m = re.search(r"\*\*Video terkait\*\*[^:]*:\s*(.+)", t)
    return {"judul": title_after(t), "deskripsi": block_after(t, "**Deskripsi:**"), "terkait": m.group(1).strip() if m else ""}
docs = {}
for d in sorted(glob.glob(f"{R}/*/")) + sorted(glob.glob(f"{R}/sim/*/")) + sorted(glob.glob(f"{R}/dok/*/")):
    d = d.rstrip("/"); code = os.path.basename(d); p = f"{d}/youtube.md"
    if not os.path.exists(p) or code.startswith("_"): continue
    t = open(p, encoding="utf-8").read(); items = []
    if "/dok/" in d:
        sec = dict(sections(t)); items.append({"key": code, "judul": sec.get("Judul", "").strip(), "deskripsi": sec.get("Deskripsi", "").strip(),
                                              "komentar": sec.get("Komentar tersemat", "").strip(), "tag": sec.get("Tag", "").strip()})
    elif "/sim/" in d:
        items.append({"key": code, "judul": title_after(t), "deskripsi": block_after(t, "**Deskripsi:**"), "komentar": block_after(t, "**Komentar tersemat")})
    else:
        secs = sections(t); pins = {}
        for h, body in secs:
            m = re.match(r"Komentar tersemat.*?—\s*(\S+)", h)
            if m: pins[m.group(1)] = block_after(body, "```") or re.search(r"```\n(.*?)\n```", body, re.S).group(1).strip()
        for h, body in secs:
            if "versi teks" in h or h.startswith("Komentar"): continue
            items.append({"key": h, "judul": title_after(body), "deskripsi": block_after(body, "**Deskripsi:**"), "komentar": pins.get(h, "")})
    s = short(d)
    if s: items.append({"key": "short", **s})
    did = code.replace(".", "_"); docs[did] = {"code": code, "items": items}
os.makedirs(OUT, exist_ok=True); w = []
for did, data in docs.items():
    fp = f"{OUT}/{did}.json"; json.dump(data, open(fp, "w"), ensure_ascii=False, indent=1)
    w.append({"op": "set", "collection": "yt", "doc_id": did, "file_path": fp})
bad = [(k, it["key"], f) for k, v in docs.items() for it in v["items"] for f in ("judul", "deskripsi") if not it.get(f)]
nopin = [(k, it["key"]) for k, v in docs.items() for it in v["items"] if it["key"] != "short" and not it.get("komentar")]
print(len(docs), "docs;", sum(len(v["items"]) for v in docs.values()), "items; kosong:", bad[:10], "tanpa pin:", nopin[:10], file=sys.stderr)
for i in range(0, len(w), 50): json.dump(w[i:i + 50], open(f"{OUT}/_batch{i // 50}.json", "w"))
