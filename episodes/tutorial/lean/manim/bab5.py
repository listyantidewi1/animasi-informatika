from kit import *


class Bab5(BabScene):
    """b5_1 sampai b5_5 = rekaman layar (ditempel rakit.py); b5_6 sampai b5_8 = Manim."""
    SEG = 5

    def beat_b5_6(self, b):
        jud = TB("Dua pertanyaan pertama para ahli", 46, INK).to_edge(UP, buff=0.9)
        def butir(s, w):
            k = RoundedRectangle(width=0.62, height=0.62, corner_radius=0.12, stroke_color=w, stroke_width=5, fill_color=PANEL, fill_opacity=1)
            return VGroup(k, T(s, 40, INK)).arrange(RIGHT, buff=0.4)
        b1 = butir("Apakah buktinya bersih dari sorry?", PRIMA); b2 = butir("Aksioma apa saja yang dipakainya?", AI)
        g = VGroup(b1, b2).arrange(DOWN, buff=0.7, aligned_edge=LEFT).move_to(DOWN * 0.1)
        cmd = kode("#print axioms nama_teorema", 30, LEAN).next_to(g, DOWN, buff=0.8)
        self.play_at(b.at("pertanyaan pertama"), FadeIn(jud), dur=0.5)
        self.play_at(b.at("apakah buktinya"), FadeIn(b1, shift=RIGHT * 0.2), dur=0.5)
        self.play_at(b.at("dan aksioma"), FadeIn(b2, shift=RIGHT * 0.2), FadeIn(cmd), dur=0.5)
        self.s6 = VGroup(jud, g, cmd)

    def beat_b5_7(self, b):
        bukti = kartu_teks("Bukti", "ribuan sampai jutaan langkah", 4.4, 1.6, LEAN, 36).move_to(LEFT * 4.4 + UP * 0.6)
        tulis = kartu_teks("Pernyataan yang tertulis", "dalam kode Lean", 4.8, 1.6, AI, 32).move_to(RIGHT * 0.6 + UP * 0.6)
        maksud = kartu_teks("Yang kamu maksud", "di kepala manusia", 4.2, 1.6, PRIMA, 32).move_to(RIGHT * 4.3 + DOWN * 2.2)
        p1 = DoubleArrow(bukti.get_right(), tulis.get_left(), buff=0.1, color=LEAN, stroke_width=6, max_tip_length_to_length_ratio=0.2)
        c1 = VGroup(centang(0.26), T("diperiksa Lean", 28, LEAN)).arrange(RIGHT, buff=0.2).next_to(VGroup(bukti, tulis), UP, buff=0.4)
        p2 = DashedLine(tulis.get_bottom() + RIGHT * 0.8, maksud.get_top(), color=NOL, stroke_width=6)
        tq = VGroup(TB("?", 60, NOL), T("tidak diperiksa Lean", 28, NOL)).arrange(RIGHT, buff=0.25).next_to(p2, LEFT, buff=0.35)
        self.play_at(b.at("Namun"), FadeOut(self.s6), dur=0.4)
        self.play_at(b.at("Lean hanya memastikan"), FadeIn(bukti), FadeIn(tulis), dur=0.5)
        self.play_at(b.at("bukti cocok dengan"), GrowFromCenter(p1), FadeIn(c1), dur=0.6)
        self.play_at(b.at("Lean tidak tahu"), FadeIn(maksud), Create(p2), dur=0.6)
        self.play_at(b.at("memang sama dengan"), FadeIn(tq, scale=1.2), dur=0.4)
        self.s7 = VGroup(bukti, tulis, maksud, p1, c1, p2, tq)

    def beat_b5_8(self, b):
        salah = T("pernyataan keliru + bukti sempurna = tetap diterima", 30, ORANYE).to_edge(UP, buff=0.7)
        self.play_at(b.at("menulis pernyataan yang keliru"), FadeIn(salah), dur=0.5)
        k1 = VGroup(TB("Lean", 54, LEAN), T("memeriksa buktinya", 36, INK)).arrange(DOWN, buff=0.25)
        og = orang(PRIMA, 1.5); kc = kaca(0.3).next_to(og, RIGHT, buff=0.05)
        k2 = VGroup(VGroup(og, kc), TB("Manusia", 54, PRIMA), T("memeriksa maknanya", 36, INK)).arrange(DOWN, buff=0.25)
        g = VGroup(k1, k2).arrange(RIGHT, buff=2.4, aligned_edge=DOWN).move_to(DOWN * 0.4)
        self.play_at(b.at("Lean memeriksa buktinya"), FadeOut(self.s7), FadeOut(salah), FadeIn(k1), dur=0.6)
        self.play_at(b.at("dan manusia"), FadeIn(k2), dur=0.5)
