"""Mengetik di CodeMirror 6 yang punya auto-close tag (editor HTML Jupyter) menuju teks target T.
Tag penutup yang disisipkan editor dilewati dengan End, seperti pengguna sungguhan."""
import time, random
V = "document.querySelector('.cm-content').cmView.view"
def keadaan(pg):
    return pg.evaluate(f"(()=>{{const v={V}; return [v.state.doc.toString(), v.state.selection.main.head]}})()")
def set_indent(pg, ls, nlama, nbaru, kursor):
    pg.evaluate(f"([ls,a,b,k])=>{{const v={V}; v.dispatch({{changes:{{from:ls,to:ls+a,insert:' '.repeat(b)}}, selection:{{anchor:k}}}})}}", [ls, nlama, nbaru, kursor])
def lead(s): return len(s) - len(s.lstrip(" "))
def ketik_ke(pg, T, cps=14, ikuti=None, maks=5000, pecah=True):
    for _ in range(maks):
        D, p = keadaan(pg)
        if D == T: return True
        DL, TL = D.split("\n"), T.split("\n")
        L = D[:p].count("\n"); ls = D.rfind("\n", 0, p) + 1; col = p - ls
        dline, tline = DL[L], TL[L]
        cur = dline[:col]
        # perbaiki indentasi baris aktif
        if lead(dline) != lead(tline) and cur.strip(" ") == "" or (cur.strip() and lead(cur) != lead(tline) and cur.lstrip(" ") == tline.lstrip(" ")[:len(cur.lstrip(' '))]):
            a = lead(dline); b = lead(tline); set_indent(pg, ls, a, b, p + (b - a) if col >= a else ls + b); time.sleep(0.05); continue
        if cur != tline[:col]:
            raise RuntimeError(f"menyimpang di baris {L}: {cur!r} vs {tline[:col]!r}\n{D!r}")
        tr, dr = tline[col:], dline[col:]
        if ikuti: ikuti()
        if dr and tr == dr: pg.keyboard.press("End"); time.sleep(0.12); continue
        if tr == "":
            if dr:
                if pecah and dr.strip().startswith("</") and dr.strip() in [l.strip() for l in TL[L + 1:]]:
                    pg.keyboard.press("Enter"); time.sleep(0.15); continue
                pg.keyboard.press("Shift+End"); time.sleep(0.15); pg.keyboard.press("Backspace"); time.sleep(0.15); continue
            if not (L + 1 < len(DL) and L + 1 < len(TL) and DL[L + 1].strip() == TL[L + 1].strip()):
                pg.keyboard.press("Enter"); time.sleep(0.15); continue
            pg.keyboard.press("ArrowDown"); pg.keyboard.press("End"); time.sleep(0.12); continue
        c = tr[0]
        pg.keyboard.type(c)
        d = 1 / cps * random.uniform(0.55, 1.5)
        if c in " >;{": d *= 1.4
        time.sleep(d)
    raise RuntimeError("tidak selesai")
