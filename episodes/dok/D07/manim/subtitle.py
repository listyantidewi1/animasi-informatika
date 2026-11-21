"""Subtitle .srt D07 dari timeline.json (waktu per kata hasil penyelarasan ElevenLabs).
Angka yang dieja untuk TTS ditulis kembali sebagai angka supaya mudah dibaca.
  python3 manim/subtitle.py   ->  video/D07_Hipotesis_Riemann_AI.srt (dan salinan .id.srt)"""
import json, os, re
D = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(D)

GANTI = [
    ("dua puluh November dua ribu dua puluh enam", "20 November 2026"),
    ("Agustus dua ribu dua puluh enam", "Agustus 2026"),
    ("seratus enam puluh tujuh tahun", "167 tahun"),
    ("dua ratus lima puluh ribu halaman", "250.000 halaman"),
    ("tahun seribu delapan ratus lima puluh sembilan", "tahun 1859"),
    ("tahun seribu sembilan ratus lima puluhan", "tahun 1950-an"),
    ("dua belas triliun", "12 triliun"),
    ("nol koma lima", "0,5"),
    ("empat puluh satu koma enam persen", "41,6%"),
    ("enam puluh tujuh koma dua persen", "67,2%"),
    ("enam ratus lima puluh", "650"),
    ("enam puluh subagen", "60 subagen"),
    ("tiga puluh satu juta", "31 juta"),
    ("lebih dari dua ribu perintah", "lebih dari 2.000 perintah"),
    ("tiga belas juta", "13 juta"),
    ("tiga puluh ribu", "30.000"),
    ("sebelas hari", "11 hari"),
    ("dua tambah dua sama dengan empat", "2 + 2 = 4"),
    ("dua tambah dua sama dengan lima", "2 + 2 = 5"),
    ("satu juta dolar", "1 juta dolar"),
]
MAKS = 84   # karakter per cue (dua baris x 42)


def tampil(s):
    for a, b in GANTI:
        s = s.replace(a, b)
    return s


def klausa(s):
    return [x for x in re.split(r"(?<=[,.?!;:])\s+", s.strip()) if x]


def waktu(t):
    t = max(0, t); ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def dua_baris(s):
    if len(s) <= 42: return s
    w = s.split(); best = min(range(1, len(w)), key=lambda i: abs(len(" ".join(w[:i])) - len(" ".join(w[i:]))))
    return " ".join(w[:best]) + "\n" + " ".join(w[best:])


def main(tl_path=os.path.join(R, "timeline.json"), out_path=os.path.join(R, "video", "D07_Hipotesis_Riemann_AI.srt")):
    TL = json.load(open(tl_path))
    cues = []
    for b in TL["beats"]:
        words = b.get("words") or []
        if not words: continue
        ks, kt = klausa(b["text"]), klausa(tampil(b["text"]))
        assert len(ks) == len(kt), (b["id"], ks, kt)
        # waktu tiap klausa dari kata-kata lisan
        i = 0; segs = []
        for s, t in zip(ks, kt):
            n = len(s.split()); w = words[i:i + n]; i += n
            segs.append([b["start"] + w[0][1], b["start"] + w[-1][2], t])
        # gabungkan klausa pendek, pecah klausa panjang
        grup = []
        for a, e, t in segs:
            if grup and len(grup[-1][2]) + 1 + len(t) <= MAKS:
                grup[-1][1] = e; grup[-1][2] += " " + t
            elif len(t) > MAKS:
                ww = t.split(); k = len(ww) // 2; t1, t2 = " ".join(ww[:k]), " ".join(ww[k:])
                m = a + (e - a) * len(t1) / len(t)
                grup += [[a, m, t1], [m, e, t2]]
            else:
                grup.append([a, e, t])
        cues += grup

    out = []
    for k, (a, e, t) in enumerate(cues):
        nxt = cues[k + 1][0] if k + 1 < len(cues) else e + 1
        e = min(max(e + 0.4, a + 1.2), nxt - 0.05)
        out.append(f"{k + 1}\n{waktu(a)} --> {waktu(e)}\n{dua_baris(t)}\n")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    open(out_path, "w", encoding="utf-8").write("\n".join(out))
    print(out_path, len(out), "cue")


if __name__ == "__main__":
    import sys
    if "--short" in sys.argv:
        main(os.path.join(R, "short", "timeline.json"), os.path.join(R, "video", "D07_Short.srt"))
    else:
        main()
