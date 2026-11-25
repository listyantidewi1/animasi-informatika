"""Short vertikal D11 (1080x1920), sinkron dengan short/timeline.json.
  manim -qh -r 1080,1920 --fps 30 --disable_caching short.py ShortD11   (pratinjau: -ql -r 540,960)"""
import os
os.environ.setdefault("D11_TL", os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "short", "timeline.json"))
from kit import *
from bab2 import HURUF, PERM, suku, kisi
from subtitle import tampil, klausa

config.frame_width = 9.0
config.frame_height = 16.0

KAIT = "Dua Rumus Ini Hampir Kembar.\nMengapa Hanya Satu yang\nBisa Dihitung Komputer?"


def cues_beat(b):
    out = []; i = 0
    for s, t in zip(klausa(b.text), klausa(tampil(b.text))):
        n = len(s.split())
        if i < len(b.words): out.append((b.t0 + b.words[i][1], t))
        i += n
    return out


def teks_cap(t):
    w = t.split(" "); baris = [""]
    for x in w:
        if len(baris[-1]) + len(x) + 1 > 28 and baris[-1]: baris.append(x)
        else: baris[-1] = (baris[-1] + " " + x).strip()
    g = VGroup(*[TB(s, 36, INK).move_to(DOWN * i * 0.66) for i, s in enumerate(baris)])
    bg = BackgroundRectangle(g, color=BG, fill_opacity=0.85, buff=0.2)
    return VGroup(bg, g).move_to(DOWN * 3.9, aligned_edge=UP)


class ShortD11(BabScene):
    SEG = 0

    def construct(self):
        kait = TB(KAIT, 44, PRIMA, line_spacing=1.05)
        if kait.width > 8.3: kait.scale_to_fit_width(8.3)
        garis = Line(LEFT * 1.2, RIGHT * 1.2, color=PRIMA, stroke_width=6)
        atas = VGroup(kait, garis).arrange(DOWN, buff=0.28).move_to(UP * 6.45)
        self.add(atas)
        semua = [c for b in self.B for c in cues_beat(b)]
        cap = teks_cap(semua[0][1]); cur = [0]

        def upd(m):
            t = self.renderer.time; k = max(i for i, (a, _) in enumerate(semua) if a <= t + 0.05) if t + 0.05 >= semua[0][0] else 0
            if k != cur[0]:
                cur[0] = k; m.become(teks_cap(semua[k][1]))
        cap.add_updater(upd); cap.set_z_index(5); self.add(cap)
        super().construct()

    def beat_s1(self, b):
        m = matriks(HURUF, 0.8, INK, 34).move_to(UP * 3.75)
        a = suku(True, 46).move_to(UP * 0.7); c = suku(False, 46).move_to(DOWN * 1.9)
        la = T("rumus pertama", 28, INK2).next_to(a, UP, buff=0.3); lc = T("rumus kedua", 28, INK2).next_to(c, UP, buff=0.3)
        self.add(m)
        self.play(FadeIn(a, shift=UP * 0.2), FadeIn(la), FadeIn(c, shift=UP * 0.2), FadeIn(lc), run_time=0.5)
        kot = VGroup(*[SurroundingRectangle(VGroup(a[i][0]), color=PRIMA, buff=0.1, stroke_width=5, corner_radius=0.08) for i in range(6) if PERM[i][1] < 0],
                     *[SurroundingRectangle(VGroup(c[i][0]), color=PRIMA, buff=0.1, stroke_width=5, corner_radius=0.08) for i in range(6) if PERM[i][1] < 0])
        self.play_at(b.at("tanda tambah"), *[Indicate(s[0], scale_factor=1.6, color=LEAN) for s in c], dur=0.6)
        self.play_at(b.at("tanda kurang"), Create(kot), dur=0.6)
        self.m, self.a, self.c, self.la, self.lc, self.kot = m, a, c, la, lc, kot

    def beat_s2(self, b):
        na = TB("determinan", 40, AI).move_to(self.la)
        self.play_at(b.at("determinan"), FadeOut(self.kot), FadeOut(self.la), FadeIn(na, scale=1.2), self.c.animate.set_opacity(0.3), self.lc.animate.set_opacity(0.3), dur=0.6)
        k = kisi(20, 2.7).move_to(UP * 3.5); uk = T("tabel 20 × 20", 28, INK2).next_to(k, DOWN, buff=0.15)
        rumus = VGroup(self.a, na)
        self.play_at(b.at("Untuk tabel"), FadeOut(self.m), FadeOut(self.c), FadeOut(self.lc), FadeIn(k), FadeIn(uk), rumus.animate.scale(0.6).move_to(UP * 0.8), dur=0.8)
        bd = Rectangle(width=0.35, height=0.55, fill_color=AI, fill_opacity=1, stroke_width=0).move_to(LEFT * 3.9 + DOWN * 0.35, aligned_edge=LEFT)
        ld = VGroup(TB("beberapa ribu langkah", 34, AI)).next_to(bd, RIGHT, buff=0.3)
        self.play_at(b.at("beberapa ribu"), GrowFromEdge(bd, LEFT), FadeIn(ld), dur=0.6)
        self.r2 = VGroup(k, uk, rumus, bd, ld); self.rumus = rumus; self.bd = bd

    def beat_s3(self, b):
        nc = TB("permanen", 40, ORANYE); c = suku(False, 46)
        rp = VGroup(c, nc); nc.next_to(c, UP, buff=0.3); rp.scale(0.6).move_to(DOWN * 1.5).set_opacity(1)
        self.play_at(b.at("permanen"), FadeIn(rp, shift=UP * 0.2), dur=0.6)
        bp = Rectangle(width=8.6, height=0.55, fill_color=ORANYE, fill_opacity=1, stroke_width=0).move_to(LEFT * 3.9 + DOWN * 3.3, aligned_edge=LEFT)
        lp = TB("puluhan juta langkah", 34, ORANYE).next_to(bp, UP, buff=0.15).align_to(bp, LEFT)
        self.play_at(b.at("puluhan juta"), GrowFromEdge(bp, LEFT, rate_func=rate_functions.ease_in_quad), FadeIn(lp), dur=0.9)
        pn = Arrow(RIGHT * 2.4 + DOWN * 2.75, RIGHT * 4.2 + DOWN * 2.75, buff=0, color=ORANYE, stroke_width=8)
        self.play_at(b.at("meledak"), GrowArrow(pn), Indicate(bp, color=NOL, scale_factor=1.04), dur=0.7)
        self.r3 = VGroup(rp, bp, lp, pn)

    def beat_s4(self, b):
        th = ValueTracker(1979)
        tahun = always_redraw(lambda: TB(str(int(th.get_value())), 120, INK).move_to(UP * 2.6))
        self.play_at(b.at("Sejak"), FadeOut(self.r2), FadeOut(self.r3), dur=0.4)
        self.add(tahun)
        self.play_at(b.at("seribu sembilan ratus"), th.animate.set_value(2026), dur=2.2, rate_func=rate_functions.ease_in_out_cubic, sebelum=b.at("tidak ada yang bisa"))
        tahun.clear_updaters()
        jp = VGroup(T("jalan pintas untuk permanen:", 34, INK2), TB("ada atau tidak?", 54, PRIMA)).arrange(DOWN, buff=0.25).move_to(DOWN * 0.3)
        bl = T("47 tahun belum terjawab", 32, INK).next_to(jp, DOWN, buff=0.6)
        self.play_at(b.at("tidak ada yang bisa"), FadeIn(bl, shift=UP * 0.15), dur=0.5)
        self.play_at(b.at("jalan pintasnya"), FadeIn(jp, scale=1.1), dur=0.6)
        self.r4 = VGroup(tahun, jp, bl)

    def beat_s5(self, b):
        tgl = TB("November 2026", 48, AI).move_to(UP * 4.3)
        self.play_at(b.at("Pada November"), FadeOut(self.r4), FadeIn(tgl, shift=DOWN * 0.2), dur=0.5)
        tp = tumpukan(34, 2.6, 0.1).move_to(LEFT * 2.3 + UP * 1.6)
        lab = VGroup(TB("70", 80, INK), T("halaman", 32, INK2), chip("ditulis AI", AI, 26)).arrange(DOWN, buff=0.15).move_to(RIGHT * 2.2 + UP * 1.6)
        self.play_at(b.at("sebuah AI"), LaggedStart(*[FadeIn(h, shift=DOWN * 0.5) for h in tp], lag_ratio=0.03), FadeIn(lab[2]), dur=1.0)
        self.play_at(b.at("tujuh puluh halaman"), FadeIn(lab[:2], scale=1.2), dur=0.5)
        s1 = stempel("Diperiksa mesin", LEAN, size=36).move_to(DOWN * 1.2)
        s2 = stempel("Diperiksa manusia", kosong=True, size=36).move_to(DOWN * 2.75)
        self.play_at(b.at("Mesin sudah memeriksa"), FadeIn(s1, scale=1.4), dur=0.5)
        self.play_at(b.at("belum ada satu pun"), FadeIn(s2, scale=1.4), dur=0.5)
        self.r5 = VGroup(tgl, tp, lab, s1, s2)

    def beat_s6(self, b):
        q = TB("?", 260, PRIMA).move_to(UP * 2.2)
        self.play_at(b.at("Lalu"), FadeOut(self.r5), dur=0.4)
        self.play_at(b.at("bagian mana"), FadeIn(q, scale=1.5), dur=0.6)
        cta = VGroup(panel(7.8, 2.0, PANEL, PRIMA), TB("Tonton video lengkapnya", 38, INK)); cta[1].move_to(cta[0]); cta.move_to(DOWN * 1.6)
        sub = T("I Teach Software Engineering", 28, INK2).next_to(cta, DOWN, buff=0.3)
        st = T("Status: klaim, per 25 November 2026", 24, INK2).next_to(sub, DOWN, buff=0.25)
        self.play_at(b.at("Jawabannya"), q.animate.scale(0.5).move_to(UP * 3.0), FadeIn(cta, scale=1.1), FadeIn(sub), FadeIn(st), dur=0.6)
