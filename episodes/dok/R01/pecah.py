"""Pecah naskah.md (ekspor Claude Doc yang disunting Bu Dewi) menjadi beat narasi: beats.json = [{id, seg, text}].
Paragraf dipecah per kelompok kalimat (maks ±300 karakter) supaya gambar bisa sinkron per kalimat."""
import re, json, os
D = os.path.dirname(os.path.abspath(__file__)); md = open(os.path.join(D, "naskah.md"), encoding="utf-8").read()
a = md.index("### Bab 0."); z = md.index("## Short, metadata"); body = md[a:z]
parts = re.split(r"^### Bab (\d+)\. (.+?) \(±[\d:]+\)\s*$", body, flags=re.M)
beats = []; titles = {}
for k in range(1, len(parts), 3):
    seg = int(parts[k]); titles[seg] = parts[k + 1].strip(); n = 0
    for p in parts[k + 2].split("\n\n"):
        p = p.strip()
        if not p or p.startswith("&#91;") or p.startswith("|") or p.startswith("**Rancangan") or p.startswith("Aturan yang sama"): continue
        p = p.replace("\\[", "[").replace("\\]", "]").replace("\\_", "_")
        fixed = [x.strip() for x in re.split(r'(?<=[.?!])\s+(?=[A-Z"“])', p) if x.strip()]
        cur = ""
        for s in fixed:
            if cur and len(cur) + len(s) > 300: n += 1; beats.append({"id": f"b{seg}_{n}", "seg": seg, "text": cur}); cur = s
            else: cur = (cur + " " + s).strip()
        if cur: n += 1; beats.append({"id": f"b{seg}_{n}", "seg": seg, "text": cur})
i9 = max(i for i, b in enumerate(beats) if b["seg"] == 9)   # keterbukaan AI sebelum ajakan terakhir (aturan kanal)
last = beats.pop(i9); beats.append({"id": last["id"], "seg": 9, "text": "Sebagai catatan, naskah video ini disusun dengan bantuan AI, termasuk Claude buatan Anthropic, lalu diperiksa dan disunting oleh manusia."})
beats.append({"id": f"b9_{int(last['id'].split('_')[1]) + 1}", "seg": 9, "text": last["text"]})
json.dump({"titles": titles, "beats": beats}, open(os.path.join(D, "beats.json"), "w"), ensure_ascii=False, indent=1)
if __name__ == "__main__":
    print(len(beats), sum(len(b["text"]) for b in beats))
    for b in beats: print(b["id"], len(b["text"]), "|", b["text"][:64])
