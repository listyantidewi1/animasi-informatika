"""K18: jalankan program kas kelas dengan Python sungguhan (sys.settrace) dan simpan jejaknya ke jejak.js.
Setiap langkah = satu baris yang dijalankan: nomor baris, isi memori SETELAH baris itu (nama, nilai repr, tipe),
keluaran layar sampai saat itu (teks + bagian yang diketik pengguna), dan catatan singkat.
    python3 episodes/sim/K18/lacak.py
Semua angka di video diambil dari berkas hasil ini, jadi selalu sama dengan hasil python3."""
import builtins, json, os, sys

BENAR = [
    'n = int(input("Berapa transaksi? "))',
    'total = 0',
    'for i in range(n):',
    '    jumlah = int(input("Jumlah: "))',
    '    if jumlah > 0:',
    '        total = total + jumlah',
    '    else:',
    '        print("Ditolak:", jumlah)',
    'print("Total kas:", total)',
]
BUG = [  # total = 0 ikut masuk ke dalam for (menjorok), sehingga diulang setiap putaran
    'n = int(input("Berapa transaksi? "))',
    'for i in range(n):',
    '    total = 0',
    '    jumlah = int(input("Jumlah: "))',
    '    if jumlah > 0:',
    '        total = total + jumlah',
    '    else:',
    '        print("Ditolak:", jumlah)',
    'print("Total kas:", total)',
]
RUNS = {
    "v1": ("benar", ["2", "20000", "15000"]),
    "v2": ("benar", ["3", "20000", "-5000", "15000"]),
    "v3": ("benar", ["0"]),
    "v4": ("bug", ["2", "20000", "15000"]),
    "q3": ("benar", ["3", "10000", "5000", "-2000"]),
}


def run(lines, inputs):
    src = "\n".join(lines) + "\n"
    code = compile(src, "<k18>", "exec")
    segs = []                       # keluaran: [teks, jenis] jenis "out" atau "in" (diketik)
    feed = list(inputs)

    class Out:
        def write(self, s): segs.append([s, "out"]); return len(s)
        def flush(self): pass

    def fake_input(prompt=""):
        v = feed.pop(0); segs.append([prompt, "out"]); segs.append([v, "in"]); segs.append(["\n", "out"]); return v

    g = {"__builtins__": builtins.__dict__.copy()}
    g["__builtins__"]["input"] = fake_input
    events = []                     # (baris, memori sebelum baris, panjang keluaran sebelum baris)

    def snap():
        return [[k, repr(v), type(v).__name__] for k, v in g.items() if not k.startswith("__")]

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<k18>": return None
        if event == "line": events.append((frame.f_lineno, snap(), len(segs)))
        return tracer

    old = sys.stdout; sys.stdout = Out(); sys.settrace(tracer)
    err = None
    try:
        exec(code, g)
    except Exception as e:  # noqa
        err = f"{type(e).__name__}: {e}"
    finally:
        sys.settrace(None); sys.stdout = old
    final = (snap(), len(segs))
    steps = []
    for k, (ln, before, _) in enumerate(events):
        after, nseg = (events[k + 1][1], events[k + 1][2]) if k + 1 < len(events) else final
        steps.append({"ln": ln, "before": before, "vars": after, "out": console(segs[:nseg])})
    for k, s in enumerate(steps):
        s["note"] = note(lines, s, steps[k + 1] if k + 1 < len(steps) else None)
    return {"steps": steps, "error": err, "output": console(segs)}


def console(segs):
    """Gabungkan potongan keluaran menjadi baris: tiap baris = [[teks, jenis], ...]."""
    lines, cur = [], []
    for t, kind in segs:
        parts = t.split("\n")
        for j, p in enumerate(parts):
            if p: cur.append([p, kind])
            if j < len(parts) - 1: lines.append(cur); cur = []
    if cur: lines.append(cur)
    return lines


def note(lines, s, nxt):
    code = lines[s["ln"] - 1].strip()
    after = {k: (v, t) for k, v, t in s["vars"]}
    before = {k: (v, t) for k, v, t in s["before"]}
    if "int(input(" in code:
        name = code.split(" = ")[0]; v = after[name][0]
        return f'input() memberi "{v}" (str), lalu int() mengubahnya menjadi {v} (int)'
    if code.startswith("for "):
        n = after["n"][0]
        if "i" in after and before.get("i") != after.get("i"):
            i = int(after["i"][0]); return f"range({n}) memberi i = {i}: putaran {i + 1} dari {n}"
        return f"range({n}) sudah habis, jadi program keluar dari for"
    if code.startswith("if "):
        j = int(after["jumlah"][0]); ok = j > 0
        return f"{j} > 0 bernilai {ok}, jadi " + ("baris berikutnya dijalankan" if ok else "program lompat ke else")
    if code == "total = total + jumlah":
        return f"total = {before['total'][0]} + {after['jumlah'][0]} = {after['total'][0]}"
    if code == "total = 0":
        return "total diisi 0" if "total" not in before else f"total diisi 0 lagi (tadinya {before['total'][0]})"
    if code.startswith("print("):
        return "print() menampilkan: " + "".join(t for t, _ in s["out"][-1])
    return ""


out = {"programs": {"benar": BENAR, "bug": BUG}, "runs": {}}
for key, (prog, inp) in RUNS.items():
    r = run(BENAR if prog == "benar" else BUG, inp)
    out["runs"][key] = {"prog": prog, "inputs": inp, **r}
    print(f"{key}: {len(r['steps'])} langkah, galat={r['error']}, baris={[s['ln'] for s in r['steps']]}")
    for ln in r["output"]: print("   |", "".join(t for t, _ in ln))
path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "jejak.js")
open(path, "w", encoding="utf-8").write("/* Dibuat oleh lacak.py dari jalannya python3 sungguhan. Jangan diubah dengan tangan. */\n"
                                        "(function (g) { g.Kiko.k18jejak = " + json.dumps(out, ensure_ascii=False) + "; })(typeof window !== \"undefined\" ? window : globalThis);\n")
print("->", path)
