from kit import *


def halaman_judul(w=5.4, h=6.4):
    """Halaman depan makalah (teks judul dan penulis sesuai paper.pdf)."""
    kertas = Rectangle(width=w, height=h, fill_color="#F4F1E8", fill_opacity=1, stroke_width=0)
    jud = Text("VP ≠ VNP OVER EVERY FIELD", font="DejaVu Serif", font_size=19, color="#1B1E24").move_to(kertas.get_top() + DOWN * 0.9)
    pen = Text("CLAUDE", font="DejaVu Serif", font_size=18, color="#1B1E24").next_to(jud, DOWN, buff=0.35)
    aff = Text("ANTHROPIC", font="DejaVu Serif", font_size=13, color="#4A4F5A").next_to(pen, DOWN, buff=0.12)
    garis = VGroup(*[Line(LEFT * (w / 2 - 0.5), RIGHT * (w / 2 - 0.5 - (0.9 if i % 5 == 4 else 0)), color="#C9C2B0", stroke_width=2.5)
                     .move_to(kertas.get_top() + DOWN * (2.5 + i * 0.26), aligned_edge=LEFT).align_to(kertas, LEFT).shift(RIGHT * 0.5) for i in range(12)])
    g = VGroup(kertas, jud, pen, aff, garis); g.pen = VGroup(pen, aff)
    return g


class Bab0(BabScene):
    SEG = 0

    def beat_b0_1(self, b):
        tp = tumpukan(38).move_to(LEFT * 4.6 + UP * 0.2)
        self.play_at(b.at("Bukti"), LaggedStart(*[FadeIn(h, shift=DOWN * 0.8) for h in tp], lag_ratio=0.04), dur=1.6, sebelum=b.at("tujuh puluh halaman"))
        lab = VGroup(TB("70", 96, INK), T("halaman", 36, INK2)).arrange(DOWN, buff=0.1).next_to(tp, RIGHT, buff=0.5)
        self.play_at(b.at("tujuh puluh halaman"), FadeIn(lab, shift=UP * 0.2), dur=0.5)
        th = ValueTracker(1979)
        tahun = always_redraw(lambda: TB(str(int(th.get_value())), 130, INK).move_to(RIGHT * 3.4 + UP * 0.7))
        ket = T("soal ilmu komputer", 32, INK2).move_to(RIGHT * 3.4 + UP * 2.2)
        self.play_at(b.at("soal ilmu komputer"), FadeIn(tahun), FadeIn(ket), dur=0.5)
        self.play_at(b.at("terbuka"), th.animate.set_value(2026), dur=2.0, rate_func=rate_functions.ease_in_out_cubic, sebelum=b.at("empat puluh tujuh"))
        lama = TB("47 tahun terbuka", 52, PRIMA).move_to(RIGHT * 3.4 + DOWN * 1.0)
        self.play_at(b.at("empat puluh tujuh"), FadeIn(lama, shift=UP * 0.3), dur=0.6)
        self.tahun = tahun; self.r1 = VGroup(tp, lab, ket, lama)

    def beat_b0_2(self, b):
        self.tahun.clear_updaters()
        hal = halaman_judul().move_to(LEFT * 2.6)
        self.play_at(b.at("Penulisnya"), FadeOut(self.r1), FadeOut(self.tahun), FadeIn(hal, shift=UP * 0.3), dur=0.7)
        kot = SurroundingRectangle(hal.pen, color=NOL, buff=0.14, stroke_width=5, corner_radius=0.08)
        lab = TB("satu penulis", 44, NOL).next_to(kot, RIGHT, buff=2.6)
        pan = Arrow(lab.get_left(), kot.get_right(), buff=0.12, color=NOL, stroke_width=5)
        self.play_at(b.at("hanya satu"), Create(kot), FadeIn(lab), GrowArrow(pan), dur=0.6)
        bm = TB("bukan manusia", 44, INK).next_to(lab, DOWN, buff=0.3)
        self.play_at(b.at("bukan manusia"), FadeIn(bm, shift=UP * 0.15), dur=0.6)
        self.r2 = VGroup(hal, kot, lab, pan, bm)

    def beat_b0_3(self, b):
        win = jendela("README.md  ·  github.com/anthropics/formal-math/vp-vnp", 12.4, 5.4)
        en1 = T("“Both were written by AI models,", 34, INK2)
        en2 = T("and no human mathematician has checked the proof.”", 34, INK)
        en = VGroup(en1, en2).arrange(DOWN, buff=0.22).move_to(win[0]).shift(UP * 0.75)
        if en.width > 11.4: en.scale_to_fit_width(11.4)
        self.play_at(b.at("Di repositorinya"), FadeOut(self.r2), FadeIn(win, scale=0.96), dur=0.8)
        self.play_at(b.at("tertulis"), FadeIn(en1, shift=UP * 0.1), FadeIn(en2, shift=UP * 0.1), dur=0.7)
        und = Line(en2.get_corner(DL), en2.get_corner(DR), color=PRIMA, stroke_width=5).shift(DOWN * 0.1)
        idn = TB("Belum ada matematikawan\nyang memeriksa bukti ini.", 44, PRIMA, line_spacing=1.05).move_to(win[0]).shift(DOWN * 1.35)
        self.play_at(b.at("belum ada satu pun"), Create(und), FadeIn(idn, shift=UP * 0.2), dur=0.8)
        self.r3 = VGroup(win, en, und, idn)

    def beat_b0_4(self, b):
        s1 = stempel("Diperiksa mesin", LEAN, size=40).move_to(LEFT * 3.4 + UP * 0.3)
        s2 = stempel("Diperiksa manusia", kosong=True, size=40).move_to(RIGHT * 3.2 + UP * 0.3)
        q = TB("?", 110, PRIMA).next_to(s2, DOWN, buff=0.3)
        self.play_at(b.at("Lalu"), FadeOut(self.r3), dur=0.5)
        self.play_at(b.at("mengapa"), FadeIn(s2, scale=1.3), dur=0.5)
        self.play_at(b.at("serius"), FadeIn(s1, scale=1.3), FadeIn(q, scale=0.6), dur=0.6)
        j0 = T("soal paling terkenal di ilmu komputer", 34, INK2)
        j1 = TB("P vs NP", 170, INK)
        j2 = TB("dan versi aljabarnya yang baru saja diklaim terbukti", 40, PRIMA)
        judul = VGroup(j0, j1, j2).arrange(DOWN, buff=0.4).move_to(UP * 0.3)
        st = status_chip().next_to(judul, DOWN, buff=0.6)
        self.play_at(b.at("Untuk menjawabnya"), FadeOut(VGroup(s1, s2, q), scale=0.9), dur=0.5)
        self.play_at(b.at("soal paling terkenal"), FadeIn(j0, shift=UP * 0.2), dur=0.5)
        self.play_at(b.at("yaitu"), Write(j1), dur=0.9)
        self.play(FadeIn(j2, shift=UP * 0.2), FadeIn(st), run_time=0.6)
