from kit import *
import json, math, cmath
import numpy as np
import mpmath

NOLZ = json.load(open(os.path.join(D, "nol100.json")))
PRIMA_L = [p for p in range(2, 10001) if all(p % d for d in range(2, int(p ** 0.5) + 1))]


def pi_x(x):
    import bisect
    return bisect.bisect_right(PRIMA_L, x)


def psi(x):
    s = 0.0
    for p in PRIMA_L:
        if p > x: break
        k = p
        while k <= x:
            s += math.log(p); k *= p
    return s


def psi_nol(x, n):
    """Rumus eksplisit von Mangoldt dengan n pasang nol zeta pertama."""
    s = x - math.log(2 * math.pi) - 0.5 * math.log(1 - x ** -2)
    for g in NOLZ[:n]:
        r = complex(0.5, g)
        s -= 2 * (cmath.exp(r * math.log(x)) / r).real
    return s


class Bab1(BabScene):
    SEG = 1

    # ---------- bilangan prima dan saringan ----------
    def beat_b1_1(self, b):
        kotak = VGroup()
        for i in range(1, 101):
            sq = Square(0.56, stroke_color=GARIS, stroke_width=2, fill_color=PANEL, fill_opacity=1)
            lb = T(str(i), 20, INK2).move_to(sq)
            kotak.add(VGroup(sq, lb))
        kotak.arrange_in_grid(10, 10, buff=0.06).move_to(DOWN * 0.15)
        judul = TB("Bilangan prima", 44).to_edge(UP, buff=0.35)
        self.play_at(b.at("Bilangan prima"), FadeIn(judul, shift=DOWN * 0.2), LaggedStart(*[FadeIn(k) for k in kotak], lag_ratio=0.006), dur=1.2)
        self.play(kotak[0].animate.set_opacity(0.25), run_time=0.3)
        warna = {2: AI, 3: UNGU, 5: ORANYE, 7: LEAN}
        coret = set()
        for p in (2, 3, 5, 7):
            idx = [m - 1 for m in range(p * 2, 101, p) if m not in coret]
            coret.update(m for m in range(p * 2, 101, p))
            self.play(kotak[p - 1][0].animate.set_fill(PRIMA, 1), kotak[p - 1][1].animate.set_color(BG),
                      LaggedStart(*[kotak[i].animate.set_opacity(0.18) for i in idx], lag_ratio=0.02), run_time=0.9)
        sisa = [i for i in range(11, 101) if i not in coret]
        self.play(*[kotak[i - 1][0].animate.set_fill(PRIMA, 1) for i in sisa], *[kotak[i - 1][1].animate.set_color(BG) for i in sisa], run_time=0.7)
        self.kotak, self.judul = kotak, judul

    def beat_b1_2(self, b):
        ax = NumberLine(x_range=[0, 100, 10], length=12.6, color=DIM, include_numbers=True, font_size=24).shift(DOWN * 0.6)
        tanda = VGroup(*[Line(UP * 0.0, UP * 0.8, color=PRIMA, stroke_width=5).move_to(ax.n2p(p) + UP * 0.4) for p in PRIMA_L if p < 100])
        self.play_at(b.at("Kalau"), FadeOut(self.kotak, scale=0.8), Create(ax), dur=0.8)
        self.play(LaggedStart(*[GrowFromEdge(t, DOWN) for t in tanda], lag_ratio=0.05), run_time=1.4)
        # celah antarprima
        celah = VGroup()
        for a, c in [(23, 29), (89, 97), (7, 11), (31, 37)]:
            br = BraceBetweenPoints(ax.n2p(a) + UP * 0.9, ax.n2p(c) + UP * 0.9, UP, color=INK2)
            celah.add(VGroup(br, T(str(c - a), 22, INK2).next_to(br, UP, buff=0.08)))
        dua = VGroup(*[BraceBetweenPoints(ax.n2p(a) + UP * 0.9, ax.n2p(c) + UP * 0.9, UP, color=INK2) for a, c in [(41, 43), (59, 61)]])
        dua_l = VGroup(*[T("2", 22, INK2).next_to(x, UP, buff=0.08) for x in dua])
        self.play_at(b.at("acak"), LaggedStart(*[FadeIn(c, shift=DOWN * 0.1) for c in celah], FadeIn(dua), FadeIn(dua_l), lag_ratio=0.2), dur=1.4)
        tanya = TB("?", 90, PRIMA).shift(UP * 2.2)
        self.play_at(b.at("sulit"), FadeIn(tanya, scale=1.5), dur=0.5)
        self.garis = VGroup(ax, tanda, celah, dua, dua_l, tanya)

    def beat_b1_3(self, b):
        ax = Axes(x_range=[0, 100, 10], y_range=[0, 26, 5], x_length=10.5, y_length=5, axis_config={"color": DIM, "font_size": 24, "decimal_number_config": {"group_with_commas": False, "num_decimal_places": 0}},
                  x_axis_config={"numbers_to_include": range(0, 101, 20)}, y_axis_config={"numbers_to_include": range(0, 26, 5)}).shift(DOWN * 0.4)
        lab = T("banyak bilangan prima sampai x", 26, PRIMA).next_to(ax, UP, buff=0.15).align_to(ax, LEFT)
        pts = [ax.c2p(0, 0)]
        for p in PRIMA_L:
            if p > 100: break
            k = pi_x(p)
            pts += [ax.c2p(p, k - 1), ax.c2p(p, k)]
        pts.append(ax.c2p(100, 25))
        tangga = VMobject(color=PRIMA, stroke_width=5).set_points_as_corners(pts)
        self.play_at(b.at("Namun"), FadeOut(self.garis), FadeOut(self.judul), Create(ax), FadeIn(lab), dur=0.8)
        self.play_at(b.at("berapa"), Create(tangga), dur=2.6, rate_func=linear)
        # perbesar sampai 10.000
        ax2 = Axes(x_range=[0, 10000, 2000], y_range=[0, 1300, 250], x_length=10.5, y_length=5, axis_config={"color": DIM, "font_size": 24, "decimal_number_config": {"group_with_commas": False, "num_decimal_places": 0}},
                   x_axis_config={"numbers_to_include": range(0, 10001, 2000)}, y_axis_config={"numbers_to_include": range(0, 1251, 250)}).shift(DOWN * 0.4)
        xs = np.linspace(2, 10000, 600)
        mulus = VMobject(color=PRIMA, stroke_width=5).set_points_as_corners([ax2.c2p(x, pi_x(x)) for x in xs])
        self.play_at(b.at("pola"), ReplacementTransform(ax, ax2), ReplacementTransform(tangga, mulus), dur=2.0)
        wow = T("hampir mulus!", 34, INK).next_to(ax2.c2p(6500, 840), UL, buff=0.2)
        self.play(FadeIn(wow, shift=UP * 0.2), run_time=0.5)
        self.graf = VGroup(ax2, mulus, lab, wow)

    def beat_b1_4(self, b):
        tahun = TB("1859", 72, INK2).to_edge(UP, buff=0.6)
        nama = T("Bernhard Riemann", 36, INK).next_to(tahun, DOWN, buff=0.2)
        # halaman catatan tanpa foto
        hal = VGroup(Rectangle(width=3.0, height=3.8, fill_color="#F4F1E8", fill_opacity=1, stroke_width=0),
                     *[Line(LEFT * 1.1, RIGHT * (1.1 - (i % 4) * 0.3), color="#B9B09A", stroke_width=2).shift(UP * (1.4 - i * 0.28)) for i in range(11)]).shift(LEFT * 4.2 + DOWN * 0.8)
        self.play_at(b.at("Pada"), FadeOut(self.graf), FadeIn(tahun, shift=DOWN * 0.2), dur=0.7)
        self.play_at(b.at("Bernhard"), FadeIn(nama), FadeIn(hal, shift=UP * 0.3), dur=0.7)
        rumus = MathTex(r"\zeta(s)", r"=", r"\frac{1}{1^s}+\frac{1}{2^s}+\frac{1}{3^s}+\frac{1}{4^s}+\cdots", font_size=58).shift(RIGHT * 2.3 + DOWN * 0.8)
        rumus[0].set_color(AI)
        self.play_at(b.at("fungsi zeta"), Write(rumus), dur=1.8)
        self.r4 = VGroup(tahun, nama, hal, rumus)

    def beat_b1_5(self, b):
        self.play_at(b.at("Fungsi"), FadeOut(self.r4), dur=0.6)
        bid1 = NumberPlane(x_range=[-1, 3, 1], y_range=[-2, 2, 1], x_length=4, y_length=4, background_line_style={"stroke_color": GARIS, "stroke_width": 1},
                           axis_config={"color": DIM}).shift(LEFT * 4.6)
        bid2 = bid1.copy().shift(RIGHT * 9.2)
        mesin = VGroup(RoundedRectangle(width=2.4, height=1.6, corner_radius=0.2, fill_color=PANEL, fill_opacity=1, stroke_color=AI, stroke_width=3),
                       MathTex(r"\zeta", font_size=80, color=AI))
        l1 = T("masukan s", 24, INK2).next_to(bid1, DOWN, buff=0.2); l2 = T("keluaran ζ(s)", 24, INK2).next_to(bid2, DOWN, buff=0.2)
        self.play_at(b.at("bilangan kompleks"), FadeIn(bid1), FadeIn(l1), dur=0.6)
        s = Dot(bid1.c2p(2, 1), color=INK, radius=0.1)
        sl = MathTex("s=2+i", font_size=34).next_to(s, UR, buff=0.05)
        s.move_to(bid1.c2p(2, 1)); sl.next_to(s, UR, buff=0.05)
        self.play_at(b.at("titik pada"), GrowFromCenter(s), FadeIn(sl), dur=0.5)
        self.play(FadeIn(mesin, scale=0.8), FadeIn(bid2), FadeIn(l2), run_time=0.6)
        v = complex(mpmath.zeta(complex(2, 1)))
        s2 = s.copy()
        self.play_at(b.at("mengeluarkan"), s2.animate.move_to(mesin), dur=0.6)
        self.play(s2.animate.move_to(bid2.c2p(v.real, v.imag)).set_color(AI), run_time=0.7)
        self.r5 = VGroup(bid1, bid2, mesin, l1, l2, s, sl, s2)

    def beat_b1_6(self, b):
        self.play_at(b.at("Ada"), FadeOut(self.r5), dur=0.5)
        ax = Axes(x_range=[-0.5, 1.5, 0.5], y_range=[0, 32, 10], x_length=3, y_length=5.4, axis_config={"color": DIM, "include_ticks": False}).shift(LEFT * 4.3 + DOWN * 0.3)
        ax2 = Axes(x_range=[-1.5, 3.5, 1], y_range=[-2.5, 2.5, 1], x_length=6.2, y_length=6.2, axis_config={"color": DIM}).shift(RIGHT * 2.6 + DOWN * 0.3)
        l1 = T("masukan: 1/2 + t·i", 24, INK2).next_to(ax, DOWN, buff=0.15)
        l2 = T("keluaran ζ", 24, AI).next_to(ax2, DOWN, buff=0.05).shift(RIGHT * 2)
        f = lambda t: complex(mpmath.zeta(complex(0.5, t)))
        tt = ValueTracker(0.01)
        jejak = always_redraw(lambda: ParametricFunction(lambda u: ax2.c2p(f(u).real, f(u).imag), t_range=[0.01, max(0.02, tt.get_value()), 0.05], color=AI, stroke_width=4))
        ttk = always_redraw(lambda: Dot(ax2.c2p(f(tt.get_value()).real, f(tt.get_value()).imag), color=INK, radius=0.08))
        mas = always_redraw(lambda: Dot(ax.c2p(0.5, tt.get_value()), color=INK, radius=0.08))
        self.play_at(b.at("Ada"), FadeIn(ax), FadeIn(ax2), FadeIn(l1), FadeIn(l2), dur=0.6)
        self.add(jejak, ttk, mas)
        self.play_at(b.at("titik-titik khusus"), tt.animate.set_value(14.1347), dur=3.2, rate_func=rate_functions.ease_in_out_sine)
        # sampai di pusat: kilat
        nol = Dot(ax.c2p(0.5, 14.1347), color=NOL, radius=0.11)
        ring = Circle(radius=0.15, color=NOL, stroke_width=4).move_to(ax2.c2p(0, 0))
        lab = T("ζ = 0", 30, NOL).next_to(ax2.c2p(0, 0), UL, buff=0.15)
        self.play(GrowFromCenter(nol), Flash(ax2.c2p(0, 0), color=NOL, line_length=0.35), FadeIn(lab), Create(ring), run_time=0.7)
        self.play_at(b.at("nol zeta"), FadeIn(T("nol zeta pertama: s = 1/2 + 14,13i", 30, NOL).to_edge(UP, buff=0.4)), dur=0.5)
        self.r6 = dict(ax=ax, ax2=ax2, tt=tt, jejak=jejak, ttk=ttk, mas=mas, nol=VGroup(nol), lab=VGroup(lab, ring), l=VGroup(l1, l2), f=f)

    def beat_b1_7(self, b):
        r = self.r6; ax = r["ax"]
        garis = DashedLine(ax.c2p(0.5, 0), ax.c2p(0.5, 32), color=KRITIS, dash_length=0.12)
        self.play_at(b.at("Riemann"), FadeOut(r["lab"]), *[FadeOut(m) for m in self.mobjects if isinstance(m, Text) and "pertama" in m.text], dur=0.4)
        lanjut = [g for g in NOLZ if 14.2 < g < 32]
        def ping(g):
            return Succession(Wait(0), GrowFromCenter(Dot(ax.c2p(0.5, g), color=NOL, radius=0.11)))
        # jejak berlanjut, tiap kali lewat pusat muncul titik merah
        self.play_at(b.at("semua nol"), r["tt"].animate.set_value(31.5), dur=3.0, rate_func=linear)
        titik = VGroup(*[Dot(ax.c2p(0.5, g), color=NOL, radius=0.11) for g in lanjut])
        self.add(titik)
        self.play_at(b.at("garis lurus"), Create(garis), dur=0.9)
        lb = T("bagian real = 1/2", 26, KRITIS).next_to(ax, UP, buff=0.1)
        self.play_at(b.at("setengah"), FadeIn(lb, shift=DOWN * 0.1), dur=0.5)
        self.r6.update(garis=garis, titik=titik, lb=lb)

    def beat_b1_8(self, b):
        r = self.r6
        for k in ("jejak", "ttk", "mas"): r[k].clear_updaters()
        kotak = VGroup()
        j = TB("Hipotesis Riemann", 40, PRIMA)
        i = T("Semua nol nontrivial fungsi zeta", 30, INK)
        i2 = T("berada di garis bagian real = 1/2.", 30, INK)
        isi = VGroup(j, i, i2).arrange(DOWN, buff=0.18)
        bg = panel(isi.width + 0.8, isi.height + 0.6).move_to(isi)
        kotak = VGroup(bg, isi).move_to(RIGHT * 2.6 + DOWN * 0.3)
        self.play_at(b.at("Dugaan"), FadeOut(VGroup(r["ax2"], r["jejak"], r["ttk"], r["l"][1])), FadeIn(kotak, shift=LEFT * 0.3), dur=0.8)
        self.r8 = kotak

    # ---------- nada dari nol zeta membentuk tangga ----------
    def beat_b1_9(self, b):
        r = self.r6
        self.play_at(b.at("Kenapa"), FadeOut(VGroup(self.r8, r["ax"], r["garis"], r["titik"], r["nol"], r["lb"], r["mas"], r["l"][0])), dur=0.6)
        ax = Axes(x_range=[2, 30, 2], y_range=[0, 32, 5], x_length=11.5, y_length=5.2, axis_config={"color": DIM, "font_size": 22, "decimal_number_config": {"group_with_commas": False, "num_decimal_places": 0}},
                  x_axis_config={"numbers_to_include": range(2, 31, 4)}, y_axis_config={"numbers_to_include": range(0, 31, 10)}).shift(DOWN * 0.45)
        pts = [ax.c2p(2, 0)]; xs = np.linspace(2, 30, 1400)
        prev = 0
        for x in xs:
            v = psi(x)
            if v != prev: pts.append(ax.c2p(x, prev))
            pts.append(ax.c2p(x, v)); prev = v
        tangga = VMobject(color=PRIMA, stroke_width=4).set_points_as_corners(pts).set_stroke(opacity=0.6)
        lt = T("tangga bilangan prima", 24, PRIMA).next_to(ax.c2p(4, 26), RIGHT, buff=0)
        self.play(Create(ax), Create(tangga), FadeIn(lt), run_time=1.0)
        # satu nada (gelombang) dari satu nol
        xs2 = np.linspace(2.05, 30, 900)
        def kurva(n, warna=AI):
            return VMobject(color=warna, stroke_width=4).set_points_smoothly([ax.c2p(x, max(-2, min(34, psi_nol(x, n)))) for x in xs2])
        g1 = kurva(1)
        cap = always_redraw(lambda: None) if False else None
        lab = T("1 nol", 30, AI).to_corner(UR, buff=0.6)
        self.play_at(b.at("satu nada"), Create(g1), FadeIn(lab), dur=1.6)
        for n in (5, 20, 100):
            lb2 = T(f"{n} nol", 30, AI).to_corner(UR, buff=0.6)
            self.play(Transform(g1, kurva(n)), Transform(lab, lb2), run_time=1.5)
            self.wait(0.4)
        self.play_at(b.at("persis"), Indicate(lt, color=PRIMA, scale_factor=1.15), dur=0.8)
        self.r9 = VGroup(ax, tangga, lt, g1, lab)

    def beat_b1_10(self, b):
        self.play_at(b.at("Jadi"), FadeOut(self.r9), dur=0.6)
        ax = Axes(x_range=[0, 10000, 2000], y_range=[0, 1300, 250], x_length=10.5, y_length=5, axis_config={"color": DIM, "font_size": 24, "decimal_number_config": {"group_with_commas": False, "num_decimal_places": 0}},
                  x_axis_config={"numbers_to_include": range(0, 10001, 2000)}, y_axis_config={"numbers_to_include": range(0, 1251, 250)}).shift(DOWN * 0.4)
        xs = np.linspace(10, 10000, 400)
        li = lambda x: float(mpmath.li(x))
        lebar = ValueTracker(8.0)
        def pita():
            k = lebar.get_value()
            atas = [ax.c2p(x, li(x) + k * math.sqrt(x) * math.log(x) / (8 * math.pi)) for x in xs]
            bawah = [ax.c2p(x, li(x) - k * math.sqrt(x) * math.log(x) / (8 * math.pi)) for x in xs[::-1]]
            return Polygon(*atas, *bawah, stroke_width=0, fill_color=PRIMA, fill_opacity=0.18)
        pt = always_redraw(pita)
        kurva = VMobject(color=PRIMA, stroke_width=5).set_points_as_corners([ax.c2p(x, pi_x(x)) for x in xs])
        self.play(Create(ax), Create(kurva), FadeIn(pt), run_time=1.0)
        ket = T("batas kesalahan jika Hipotesis Riemann benar", 26, PRIMA).next_to(ax.c2p(9800, 300), UL, buff=0.1)
        self.play_at(b.at("batas"), lebar.animate.set_value(1.0), FadeIn(ket), dur=1.6)
        pt.clear_updaters()
