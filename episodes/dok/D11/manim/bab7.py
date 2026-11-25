from kit import *


class Bab7(BabScene):
    SEG = 7

    def beat_b7_6(self, b):
        kartu = RoundedRectangle(width=6.4, height=3.6, corner_radius=0.2, fill_color=PANEL, fill_opacity=1, stroke_color=AI, stroke_width=4).move_to(LEFT * 3.4 + UP * 0.9)
        seg = Triangle(fill_color=AI, fill_opacity=1, stroke_width=0).rotate(-90 * DEGREES).scale(0.45).move_to(kartu.get_center() + UP * 0.5)
        jk = VGroup(TB("Hipotesis Riemann,", 30, INK), TB("Claude, dan Lean", 30, INK)).arrange(DOWN, buff=0.1).move_to(kartu.get_center() + DOWN * 0.85)
        ld = T("tautannya ada di deskripsi", 28, AI).next_to(kartu, DOWN, buff=0.25)
        self.play(FadeIn(kartu, shift=UP * 0.2), FadeIn(seg), FadeIn(jk), run_time=0.6)
        self.play_at(b.at("videonya ada di deskripsi"), FadeIn(ld, shift=UP * 0.15), dur=0.5)
        kanal = TB("I Teach Software Engineering", 34, INK)
        st = status_chip()
        sj = TB("Sampai jumpa!", 54, PRIMA)
        kanan = VGroup(sj, kanal, st).arrange(DOWN, buff=0.45).move_to(RIGHT * 3.7 + UP * 0.9)
        if kanan.width > 6.2: kanan.scale_to_fit_width(6.2)
        self.play_at(b.at("Sampai jumpa"), FadeIn(kanan, shift=UP * 0.2), dur=0.6)
        t = T("Naskah video ini disusun dengan bantuan AI, termasuk Claude buatan Anthropic, yaitu pihak yang mengajukan klaim ini,\nlalu diperiksa faktanya dan disunting oleh manusia. Semua kutipan diambil langsung dari README dan makalahnya.", 22, INK2, line_spacing=1.2)
        if t.width > 12.8: t.scale_to_fit_width(12.8)
        t.move_to(DOWN * 2.9)
        self.play(FadeIn(t), run_time=0.6)
