"""Menjalankan program video di IPython sungguhan dan menyimpan keluaran + traceback (ANSI -> HTML) ke keluaran.json."""
import io, json, re, sys, html
from contextlib import redirect_stdout, redirect_stderr
from IPython.core.interactiveshell import InteractiveShell
P1 = 'print("Halo, dunia!")'
P2 = 'nama = "Rani"\numur = 15\nprint("Halo, " + nama)\nprint("Tahun depan umurku " + umur + 1)'
P3 = 'nama = "Rani"\numur = 15\nprint("Halo, " + nama)\nprint("Tahun depan umurku", umur + 1)'
sh = InteractiveShell.instance(); sh.colors = "LightBG"
def jalan(kode):
    b = io.StringIO()
    with redirect_stdout(b), redirect_stderr(b): sh.run_cell(kode, store_history=True)
    return b.getvalue()
WARNA = {"31": "r", "32": "g", "36": "c", "33": "y", "34": "c", "35": "r", "1": "b", "01": "b"}
def ke_html(t):
    out = ""; kelas = []
    for bagian in re.split(r"(\x1b\[[0-9;]*m)", t):
        m = re.match(r"\x1b\[([0-9;]*)m", bagian)
        if m:
            kode = [k for k in m.group(1).split(";") if k]
            if not kode or kode == ["0"]: kelas = []
            else:
                for k in kode:
                    if k in ("0", "00"): kelas = []
                    elif k in WARNA and WARNA[k] not in kelas: kelas.append(WARNA[k])
        elif bagian:
            e = html.escape(bagian, quote=False)
            out += f'<span class="{" ".join(kelas)}">{e}</span>' if kelas else e
    return out
if __name__ == "__main__":
    o1 = jalan(P1); o2 = jalan(P2); o3 = jalan(P3)
    o2 = re.sub(r"<ipython-input-(\d+)-(\w+)>", r"/tmp/ipython-input-\1-\2.py", o2)
    polos = re.sub(r"\x1b\[[0-9;]*m", "", o2); print(polos); print(repr(o2[:400]))
    json.dump({"p1": P1, "p2": P2, "p3": P3, "o1": html.escape(o1.rstrip("\n")), "o2": ke_html(o2.rstrip("\n")), "o3": html.escape(o3.rstrip("\n")), "o2_polos": polos}, open("keluaran.json", "w"), indent=1)
