from kit import *
import random


class Bab8(BabScene):
    SEG = 8

    def beat_b8_1(self, b):
        r = random.Random(5); baris = VGroup()
        for i in range(26):
            w = r.uniform(1.6, 3.6); baris.add(RoundedRectangle(width=w, height=0.1, corner_radius=0.05, fill_color=DIM, fill_opacity=1, stroke_width=0).move_to([-5.2 - 1.8 + w / 2, 3.0 - i * 0.24, 0]))
        lab = T("jutaan baris bukti", 28, INK2).next_to(baris, DOWN, buff=0.3)
        ker = RoundedRectangle(width=2.8, height=1.6, corner_radius=0.2, stroke_color=LEAN, stroke_width=6, fill_color=BG, fill_opacity=1).move_to(ORIGIN + UP * 0.3)
        lk = TB("kernel", 40, LEAN).move_to(ker); ket = T("pemeriksa kecil yang\ntidak bisa dirayu", 26, INK2, line_spacing=0.9).next_to(ker, DOWN, buff=0.3)
        self.play(FadeIn(baris, lag_ratio=0.02), FadeIn(lab), run_time=0.8)
        self.play_at(b.at("setiap langkahnya diperiksa"), FadeIn(ker), FadeIn(lk), dur=0.5)
        p1 = panah(baris.get_right() + RIGHT * 0.1, ker.get_left(), INK2, 6)
        self.play(GrowArrow(p1), FadeIn(ket), run_time=0.6)
        ok = VGroup(centang(0.5), TB("diterima", 40, LEAN)).arrange(DOWN, buff=0.25).move_to(RIGHT * 4.8 + UP * 0.3); p2 = panah(ker.get_right(), ok.get_left() + LEFT * 0.1, LEAN, 6)
        self.play_at(b.at("tidak bisa dirayu"), GrowArrow(p2), FadeIn(ok, scale=1.2), dur=0.6)
        kamu = TB("Hari ini kamu sudah memakainya sendiri.", 30, PRIMA).move_to(RIGHT * 2.2 + DOWN * 2.3)
        self.play_at(b.at("hari ini kamu"), FadeIn(kamu, shift=UP * 0.2), dur=0.5)
        self.s1 = VGroup(baris, lab, ker, lk, ket, p1, p2, ok, kamu)

    def beat_b8_2(self, b):
        j = jendela("Lean di browser", 9.0, 3.2).move_to(UP * 1.2)
        kd = blok_kode(["theorem punyaku : 3 + 4 = 7 := rfl", "theorem coba : 3 + 4 = 8 := rfl"], 28, [INK, INK]).move_to(j[0].get_center() + DOWN * 0.2)
        aj = VGroup(TB("Tulis di kolom komentar:", 36, INK), TB("pesan apa yang kamu dapat dari Lean?", 40, PRIMA)).arrange(DOWN, buff=0.25).move_to(DOWN * 1.9)
        self.play_at(b.at("Coba ubah"), FadeOut(self.s1), FadeIn(j), FadeIn(kd[0]), dur=0.6)
        self.play(FadeIn(kd[1]), run_time=0.5)
        self.play_at(b.at("tulis di kolom komentar"), FadeIn(aj, shift=UP * 0.2), dur=0.5)
        self.s2 = VGroup(j, kd, aj)

    def beat_b8_3(self, b):
        jud = TB("Tonton berikutnya", 44, INK).to_edge(UP, buff=0.7)
        def slot(s):
            k = RoundedRectangle(width=5.6, height=3.15, corner_radius=0.15, stroke_color=GARIS, stroke_width=3, fill_color=PANEL, fill_opacity=1)
            return VGroup(k, T(s, 26, INK2).next_to(k, DOWN, buff=0.25))
        g = VGroup(slot("Hipotesis Riemann dan Lean"), slot("Klaim VP ≠ VNP")).arrange(RIGHT, buff=0.9).move_to(DOWN * 0.3)
        self.play_at(b.at("tonton video berikutnya"), FadeOut(self.s2), FadeIn(jud), FadeIn(g), dur=0.6)
