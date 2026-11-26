"""Subtitle .srt L01 dari timeline.json (waktu per kata hasil penyelarasan ElevenLabs).
  python3 subtitle.py   ->  video/L01_Apa_Itu_Lean_4.srt """
import json, os, re
R = D = os.path.dirname(os.path.abspath(__file__))

GANTI = []
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


def main(tl_path=os.path.join(R, "timeline.json"), out_path=os.path.join(R, "video", "L01_Apa_Itu_Lean_4.srt")):
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
    main()
