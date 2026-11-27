"""Rekam Lean sungguhan (live.lean-lang.org) sebagai deretan tangkapan layar per ketukan, tanpa waktu.
Waktu tiap tangkapan ditentukan belakangan oleh rakit.py dari kata narasi, jadi rekaman tidak perlu diulang bila waktu berubah.
  python3 rekam.py        -> rek/<n>.png + rek/log.json
Tiap keadaan: {id, png, baris:[[teks, y]], kursor:[x,y,w,h], info:[[teks,x,y,w,h]] (hanya keadaan tenang)}; koordinat dalam piksel gambar (skala 2)."""
import json, os, sys
from playwright.sync_api import sync_playwright
D = os.path.dirname(os.path.abspath(__file__)); OUT = D + "/rek"; os.makedirs(OUT, exist_ok=True)
VW, VH, S = 960, 495, 2
CSS = (".monaco-editor .cursors-layer .cursor{visibility:inherit!important;opacity:1!important;animation:none!important}"
       ".suggest-widget,.monaco-hover,.parameter-hints-widget,.context-view{display:none!important}")
JS_ED = """()=>{const L=[...document.querySelectorAll('.view-lines .view-line')].map(e=>[e.textContent.replace(/\\u00a0/g,' '),e.getBoundingClientRect().y]).sort((a,b)=>a[1]-b[1]);
 const c=document.querySelector('.monaco-editor .cursors-layer .cursor');const r=c?c.getBoundingClientRect():{x:0,y:0,width:0,height:0};
 const f=document.querySelector('iframe').getBoundingClientRect();return {baris:L,kursor:[r.x,r.y,r.width,r.height],ifr:[f.x,f.y,f.width,f.height]}}"""
JS_INFO = """()=>{const o=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const t=n.textContent.trim();if(!t||t.startsWith('@keyframes'))continue;
 const r=document.createRange();r.selectNodeContents(n);const b=r.getBoundingClientRect();if(b.width>0)o.push([t,b.x,b.y,b.width,b.height])}return o}"""

log = []; n = [0]
def main():
    with sync_playwright() as p:
        br = p.chromium.launch(); pg = br.new_page(viewport={"width": VW, "height": VH}, device_scale_factor=S)
        pg.goto("https://live.lean-lang.org/", wait_until="domcontentloaded", timeout=90000); pg.wait_for_timeout(25000)
        for f in pg.frames:
            try: f.get_by_text("Don't show this again").click(timeout=1500)
            except Exception: pass
        pg.add_style_tag(content=CSS)
        info = lambda: [f for f in pg.frames if f.url == "about:blank"][0]

        def shot(id, tenang=False):
            path = f"{OUT}/{n[0]:04d}.png"; pg.screenshot(path=path)
            m = pg.evaluate(JS_ED); st = {"id": id, "png": os.path.basename(path), "baris": [[t, y * S] for t, y in m["baris"]], "kursor": [v * S for v in m["kursor"]]}
            if tenang:
                ox, oy = m["ifr"][0], m["ifr"][1]
                st["info"] = [[t, (x + ox) * S, (y + oy) * S, w * S, h * S] for t, x, y, w, h in info().evaluate(JS_INFO)]
            log.append(st); n[0] += 1
            json.dump({"skala": S, "vw": VW, "vh": VH, "keadaan": log}, open(OUT + "/log.json", "w"), ensure_ascii=False)
        def tenang(id, minimum=2.5):
            pg.wait_for_timeout(int(minimum * 1000)); sama = 0; lama = None
            for _ in range(60):
                t = info().locator("body").inner_text()
                sama = sama + 1 if t == lama else 0; lama = t
                if sama >= 4: break
                pg.wait_for_timeout(400)
            shot(id, True); print(id, "|", " / ".join(x[0] for x in log[-1]["info"])[:230], flush=True)
        def K(id, teks, akhir=True):
            for i, ch in enumerate(teks):
                pg.keyboard.type(ch); pg.wait_for_timeout(90); shot(f"{id}#{i}")
            if akhir: tenang(id + "$")
        def P(id, tombol, akhir=False, kali=1):
            for _ in range(kali): pg.keyboard.press(tombol); pg.wait_for_timeout(120)
            shot(id)
            if akhir: tenang(id + "$")
        def esc():
            if pg.evaluate("()=>!!document.querySelector('.suggest-widget.visible')"): pg.keyboard.press("Escape"); pg.wait_for_timeout(80)
        def baris_baru(id, kosong=1):
            """Escape (tutup saran), Enter (+ baris kosong), lalu hapus indentasi otomatis sampai kolom 0."""
            esc()
            for _ in range(kosong + 1): pg.keyboard.press("Enter"); pg.wait_for_timeout(120)
            for _ in range(4):
                if pg.evaluate(JS_ED)["kursor"][0] <= 42: break
                pg.keyboard.press("Backspace"); pg.wait_for_timeout(120)
            shot(id)

        def rapat(kolom, id):
            """Setelah Enter: Backspace sampai kursor di kolom yang dituju (Monaco meneruskan indentasi baris sebelumnya)."""
            for _ in range(6):
                k = round((pg.evaluate(JS_ED)["kursor"][0] - 41) / 8.4)
                if k <= kolom: break
                pg.keyboard.press("Backspace"); pg.wait_for_timeout(150); shot(id)
            print("  kolom", id, round((pg.evaluate(JS_ED)["kursor"][0] - 41) / 8.4), flush=True)
        tenang("awal", 4)
        pg.locator(".monaco-editor").first.click(position={"x": 300, "y": 200}); tenang("klik", 1)
        # Bab 3
        K("eval1", "#eval 2 + 2")
        baris_baru("nl1"); K("def1", "def ", False); K("def2", "lipatDua ", False); K("def3", "(n : Nat)", False); K("def4", " : Nat", False); K("def5", " := n * 2")
        baris_baru("nl2", 0); K("eval2", "#eval lipatDua 21")
        baris_baru("nl3"); K("thm1", "theorem ", False); K("thm2", "dua_tambah_dua", False); K("thm3", " : 2 + 2 = 4"); K("thm4", " := ", False); K("thm5", "rfl")
        P("kur4", "ArrowLeft", kali=7); P("hps4", "Backspace"); K("lima", "5")
        P("hps5", "Backspace"); K("empat", "4")
        # Bab 4
        P("ujung", "End"); baris_baru("nl4")
        K("tk1", "theorem tukar ", False); K("tk2", "(p q : Prop)", False); K("tk3", " : p ", False)
        K("tk4", "\\and ", False); K("tk5", "q ", False); K("tk6", "\\to ", False); K("tk7", "q \\and p")
        K("by", " := by", False); esc(); P("ent1", "Enter"); K("sp1", "  ")
        K("intro", "intro h")
        esc(); P("ent2", "Enter"); rapat(2, "bs2"); K("cons", "constructor")
        esc(); P("ent3", "Enter"); rapat(2, "bs3"); K("ex1a", "\\. ", False); K("ex1", "exact h.right")
        esc(); P("ent4", "Enter"); rapat(2, "bs4"); K("ex2a", "\\. ", False); K("ex2", "exact h.left")
        baris_baru("nl5"); K("tt", "theorem tambah_tukar (a b : Nat) : a + b = b + a := by")
        esc(); P("ent5", "Enter"); K("sp2", "  ", False); K("rw", "rw [Nat.add_comm]")
        # Bab 5
        baris_baru("nl6"); K("ms", "theorem mustahil : 2 + 2 = 5 := by", False); esc(); P("ent6", "Enter"); K("sp3", "  ", False); K("sorry", "sorry")
        P("atas", "ArrowUp", True)
        P("bawah", "Control+End"); baris_baru("nl7"); K("pa1", "#print axioms mustahil")
        baris_baru("nl8", 0); K("pa2", "#print axioms tukar")
        print("ISI AKHIR:\n" + "\n".join(t for t, _ in log[-1]["baris"]))
        br.close()
main()
