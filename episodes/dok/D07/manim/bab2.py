from kit import *
import json, random

NOLZ = json.load(open(os.path.join(D, "nol100.json")))
KELUARAN = ["(0.5 + 14.1347251417347j)", "(0.5 + 21.0220396387716j)", "(0.5 + 25.0108575801457j)", "(0.5 + 30.4248761258595j)",
            "(0.5 + 32.9350615877392j)", "(0.5 + 37.5861781588257j)", "(0.5 + 40.9187190121475j)", "(0.5 + 43.327073280915j)",
            "(0.5 + 48.0051508811672j)", "(0.5 + 49.7738324776723j)"]


def komputer_tabung():
    badan = RoundedRectangle(width=3.0, height=2.2, corner_radius=0.12, fill_color="#2A2F3A", fill_opacity=1, stroke_color=DIM, stroke_width=2)
    tabung = VGroup()
    for r in range(2):
        for c in range(5):
            t = VGroup(RoundedRectangle(width=0.32, height=0.62, corner_radius=0.14, fill_color="#3A4150", fill_opacity=1, stroke_color=DIM, stroke_width=1.5),
                       Circle(radius=0.08, fill_color=ORANYE, fill_opacity=0.9, stroke_width=0))
            t.move_to(badan.get_corner(UL) + RIGHT * (0.42 + c * 0.54) + DOWN * (0.5 + r * 0.8)); tabung.add(t)
    pita = Rectangle(width=2.6, height=0.18, fill_color="#F4F1E8", fill_opacity=1, stroke_width=0).next_to(badan, DOWN, buff=0.05)
    return VGroup(badan, tabung, pita)


class Bab2(BabScene):
    SEG = 2

    def beat_b2_1(self, b):
        garis = NumberLine(x_range=[1850, 2030, 10], length=12.4, color=DIM, include_numbers=False).shift(DOWN * 2.9)
        jd = TB("Perburuan nol zeta", 44).to_edge(UP, buff=0.4)
        lbl = VGroup(*[T(str(y), 22, INK2).next_to(garis.n2p(y), DOWN, buff=0.15) for y in (1859, 1900, 1950, 2000, 2026)])
        m0 = VGroup(Dot(garis.n2p(1859), color=PRIMA), T("Riemann", 22, PRIMA).next_to(garis.n2p(1859), UP, buff=0.2))
        self.play_at(b.at("Sebelum"), FadeIn(jd, shift=DOWN * 0.2), Create(garis), FadeIn(lbl), FadeIn(m0), dur=1.0)
        tanya = VGroup(MathTex(r"\zeta(s) = 0", font_size=110, color=INK2), T("di mana saja?", 34, INK2)).arrange(DOWN, buff=0.35).shift(UP * 0.4)
        self.play_at(b.at("berburu"), FadeIn(tanya, scale=0.9), dur=0.7)
        self.garis, self.glab, self.tanya0 = garis, VGroup(lbl, m0), tanya

    def beat_b2_2(self, b):
        g = self.garis
        m = VGroup(Dot(g.n2p(1953), color=ORANYE), T("Turing", 22, ORANYE).next_to(g.n2p(1953), UP, buff=0.2))
        self.play_at(b.at("awal"), FadeIn(m, shift=DOWN * 0.2), FadeOut(self.tanya0), dur=0.5)
        pc = komputer_tabung().shift(LEFT * 3.6 + UP * 0.3)
        self.play_at(b.at("Alan Turing"), FadeIn(pc, shift=UP * 0.3), dur=0.7)
        self.play(*[t[1].animate.set_fill(PRIMA, 1) for t in pc[1][::2]], run_time=0.3)
        self.play(*[t[1].animate.set_fill(ORANYE, 0.9) for t in pc[1][::2]], *[t[1].animate.set_fill(PRIMA, 1) for t in pc[1][1::2]], run_time=0.3)
        ax = Line(DOWN * 1.6, UP * 2.5, color=KRITIS, stroke_width=3).shift(RIGHT * 2.4)
        lk = T("garis 1/2", 22, KRITIS).next_to(ax, DOWN, buff=0.12)
        self.play(Create(ax), FadeIn(lk), run_time=0.5)
        dots = VGroup(*[Dot(ax.point_from_proportion(min(0.999, g_ / 240)), color=NOL, radius=0.05) for g_ in NOLZ])
        cnt = ValueTracker(0)
        angka_t = always_redraw(lambda: TB(angka(cnt.get_value()) + " nol", 56, INK).move_to(RIGHT * 4.3 + UP * 0.6))
        self.add(angka_t)
        self.play_at(b.at("memeriksa"), LaggedStart(*[GrowFromCenter(d) for d in dots], lag_ratio=0.03), cnt.animate.set_value(1104), dur=2.4)
        self.pc, self.ax, self.dots, self.cnt, self.angka_t, self.lk, self.mt = pc, ax, dots, cnt, angka_t, lk, m

    def beat_b2_3(self, b):
        g = self.garis
        m = VGroup(Dot(g.n2p(2021), color=AI), T("2021", 22, AI).next_to(g.n2p(2021), UP, buff=0.2))
        self.play_at(b.at("Sekarang"), FadeIn(m, shift=DOWN * 0.2), FadeOut(self.pc, shift=LEFT), FadeOut(self.angka_t), VGroup(self.ax, self.dots, self.lk).animate.shift(LEFT * 7.0), dur=0.8)
        self.angka_t.clear_updaters()
        cnt = ValueTracker(1104)
        def teks():
            v = cnt.get_value()
            return TB(angka(v), 64 if v < 1e9 else 58, INK).move_to(RIGHT * 1.2 + UP * 0.9)
        baru = always_redraw(teks)
        self.add(baru)
        padat = Line(self.ax.get_start(), self.ax.get_end(), color=NOL, stroke_width=9)
        self.play_at(b.at("lebih dari dua belas"), cnt.animate.set_value(12_363_153_437_138), FadeIn(padat), dur=2.4, rate_func=rate_functions.ease_in_expo)
        baru.clear_updaters()
        sub = T("nol, semuanya di garis 1/2", 30, INK2).next_to(baru, DOWN, buff=0.25)
        sumber = T("Platt dan Trudgian, 2021", 20, DIM).next_to(sub, DOWN, buff=0.18)
        self.play_at(b.at("semuanya"), FadeIn(sub), FadeIn(sumber), dur=0.5)
        self.r3 = VGroup(m, baru, sub, sumber, padat)

    def beat_b2_4(self, b):
        semua = Group(*[x for x in self.mobjects])
        self.play_at(b.at("Kita"), FadeOut(semua), dur=0.6)
        win = jendela("Editor Python", 10.6, 6.0).shift(UP * 0.1)
        kd = blok_kode(["from mpmath import zetazero", "", "for k in range(1, 11):", "    print(zetazero(k))"], 30)
        kd.next_to(win[1], DOWN, buff=0.45).align_to(win[0], LEFT).shift(RIGHT * 0.5)
        self.play(FadeIn(win, scale=0.95), run_time=0.5)
        self.play(LaggedStart(*[AddTextLetterByLetter(kd[i], time_per_char=0.03) for i in (0, 2, 3)], lag_ratio=0.9), run_time=2.6)
        self.win, self.kd = win, kd

    def beat_b2_5(self, b):
        term = panel(10.6, 4.6, "#0A0D12").shift(DOWN * 1.1)
        self.play_at(b.at("Lihat"), VGroup(self.win, self.kd).animate.scale(0.62).to_edge(UP, buff=0.2), FadeIn(term), dur=0.6)
        out = VGroup(*[kode(s, 22, INK2) for s in KELUARAN]).arrange(DOWN, aligned_edge=LEFT, buff=0.08).move_to(term).align_to(term, LEFT).shift(RIGHT * 0.5)
        self.play(LaggedStart(*[FadeIn(x, shift=UP * 0.1) for x in out], lag_ratio=0.15), run_time=1.3)
        sorot = VGroup(*[SurroundingRectangle(x[1:4], color=PRIMA, buff=0.04, stroke_width=3) for x in out])
        self.play_at(b.at("nol koma lima"), LaggedStart(*[Create(s) for s in sorot], lag_ratio=0.08), *[x[1:4].animate.set_color(PRIMA) for x in out], dur=1.2)
        self.r5 = VGroup(self.win, self.kd, term, out, sorot)

    def beat_b2_6(self, b):
        self.play_at(b.at("Namun"), FadeOut(self.r5), dur=0.6)
        ax = Line(DOWN * 3.4, UP * 3.4, color=KRITIS, stroke_width=3)
        dots = VGroup(*[Dot(ax.point_from_proportion(i / 60), color=NOL, radius=0.06) for i in range(1, 60)])
        self.play(Create(ax), LaggedStart(*[GrowFromCenter(d) for d in dots], lag_ratio=0.02), run_time=1.2)
        tanya = TB("?", 80, INK).next_to(ax, UP, buff=0.05).shift(DOWN * 0.6 + RIGHT * 0.6)
        self.play_at(b.at("belum termasuk"), self.camera.frame.animate.scale(1.0), FadeIn(tanya, scale=1.4), dur=0.6)
        k = T("triliunan contoh  ≠  bukti", 38, INK).shift(RIGHT * 3.3)
        self.play(FadeIn(k, shift=LEFT * 0.2), run_time=0.5)
        self.r6 = dict(ax=ax, dots=dots, tanya=tanya, k=k)

    def beat_b2_7(self, b):
        r = self.r6; d = r["dots"][44]
        self.play_at(b.at("Kalau"), FadeOut(r["k"]), dur=0.4)
        self.play_at(b.at("meleset"), d.animate.shift(RIGHT * 0.7).set_color(ORANYE).scale(1.6), dur=0.7)
        lb = T("satu nol meleset?", 30, ORANYE).next_to(d, RIGHT, buff=0.25)
        self.play(FadeIn(lb), run_time=0.3)
        self.play_at(b.at("runtuh"), r["ax"].animate.set_color(NOL), Wiggle(r["ax"], scale_value=1.05), dur=0.9)
        lb2 = T("belum pernah ditemukan", 30, INK2).next_to(r["ax"], RIGHT, buff=0.6).shift(DOWN * 0.5)
        self.play(d.animate.shift(LEFT * 0.7).set_color(NOL).scale(1 / 1.6), r["ax"].animate.set_color(KRITIS),
                  FadeOut(lb), FadeIn(lb2), run_time=0.7)
        self.r6["lb"] = lb2

    def beat_b2_8(self, b):
        r = self.r6
        semua = T("untuk SEMUA nol", 64, PRIMA, weight=BOLD).shift(RIGHT * 3.6)
        self.play_at(b.at("Karena"), FadeOut(r["lb"]), FadeOut(r["tanya"]), dur=0.4)
        self.play_at(b.at("semua nol"), FadeIn(semua, scale=1.2), dur=0.8)
        bukan = T("bukan hanya yang sudah dicek", 30, INK2).next_to(semua, DOWN, buff=0.3)
        self.play_at(b.at("bukan"), FadeIn(bukan, shift=UP * 0.2), dur=0.5)
