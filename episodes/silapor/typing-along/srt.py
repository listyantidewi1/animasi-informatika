import re
def baca(f):
    out = []
    for blok in open(f).read().strip().split("\n\n"):
        bar = blok.split("\n"); a, b = bar[1].split(" --> ")
        def s(x): h, m, r = x.strip().split(":"); d, ms = r.split(","); return int(h) * 3600 + int(m) * 60 + int(d) + int(ms) / 1000
        out.append([s(a), s(b), "\n".join(bar[2:])])
    return out
def tulis(f, subs):
    def ts(x): ms = round(x * 1000); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); d, ms = divmod(ms, 1000); return f"{h:02d}:{m:02d}:{d:02d},{ms:03d}"
    open(f, "w").write("\n\n".join(f"{i+1}\n{ts(a)} --> {ts(b)}\n{t}" for i, (a, b, t) in enumerate(subs)) + "\n")
