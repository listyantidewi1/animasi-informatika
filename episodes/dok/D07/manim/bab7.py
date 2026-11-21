from kit import *
from bab3 import agen
from bab0 import baris_kode
import json

NOLZ = json.load(open(os.path.join(D, "nol100.json")))


def ikon(label, simbol, warna):
    c = Circle(radius=0.9, fill_color=PANEL, fill_opacity=1, stroke_color=warna, stroke_width=4)
    s = T(simbol, 50, warna, weight=BOLD).move_to(c)
    return VGroup(c, s, T(label, 28, INK).next_to(c, DOWN, buff=0.25))


class Bab7(BabScene):
    SEG = 7

    def beat_b7_1(self, b):
        g = NumberLine(x_range=[1850, 2030, 10], length=12, color=DIM, include_numbers=False)
        tt = VGroup(*[VGroup(Dot(g.n2p(y), color=w), T(s, 22, w).next_to(g.n2p(y), UP if k % 2 == 0 else DOWN, buff=0.25))
                      for k, (y, s, w) in enumerate([(1859, "Riemann 1859", PRIMA), (1953, "Turing", ORANYE), (2021, "12 triliun nol", NOL), (2026, "AI + Lean", AI)])])
        self.play_at(b.at("Apa pun"), Create(g), LaggedStart(*[FadeIn(x, scale=0.8) for x in tt], lag_ratio=0.2), dur=1.4)
        baru = T("cara baru bekerja dengan AI", 36, AI).shift(UP * 2.2)
        self.play_at(b.at("cara baru"), FadeIn(baru, shift=DOWN * 0.2), dur=0.6)
        self.r1 = VGroup(g, tt, baru)

    def beat_b7_2(self, b):
        self.play_at(b.at("AI bisa"), FadeOut(self.r1), dur=0.5)
        a = agen(1.2).shift(LEFT * 5.0)
        ide = baris_kode(8).scale(0.55).next_to(a, RIGHT, buff=0.4)
        cek = VGroup(RoundedRectangle(width=2.6, height=1.6, corner_radius=0.2, fill_color=PANEL, fill_opacity=1, stroke_color=PRIMA, stroke_width=4), T("pemeriksa", 30, PRIMA))
        cek[1].move_to(cek[0]); cek.shift(RIGHT * 1.6)
        ok = T("✓", 90, LEAN, weight=BOLD).shift(RIGHT * 5.0)
        self.play(FadeIn(a, scale=0.6), run_time=0.4)
        self.play_at(b.at("ratusan ide"), LaggedStart(*[FadeIn(x, shift=RIGHT * 0.2) for x in ide], lag_ratio=0.1), dur=1.0)
        self.play_at(b.at("diperiksa"), FadeIn(cek), ide.animate.scale(0.4).move_to(cek), dur=0.8)
        self.play_at(b.at("bisa dipercaya"), FadeIn(ok, scale=1.5), dur=0.5)
        self.r2 = VGroup(a, ide, cek, ok)

    def beat_b7_3(self, b):
        self.play_at(b.at("Di matematika"), FadeOut(self.r2), dur=0.5)
        l = ikon("Lean", "✓", LEAN).shift(LEFT * 4.8)
        bar = Line(UP * 1.4, DOWN * 1.8, color=GARIS).shift(LEFT * 2.9)
        t1 = ikon("test", "✓", AI); t2 = ikon("code review", "👁", AI) if False else ikon("code review", "≡", AI); t3 = ikon("pemahamanmu", "?", PRIMA)
        kita = VGroup(t1, t2, t3).arrange(RIGHT, buff=0.9).shift(RIGHT * 1.9)
        lm = T("matematika", 26, INK2).next_to(l, UP, buff=0.35); lk = T("pekerjaan kita", 26, INK2).next_to(kita, UP, buff=0.35)
        self.play_at(b.at("Lean"), FadeIn(l, scale=0.8), FadeIn(lm), dur=0.6)
        self.play(Create(bar), FadeIn(lk), run_time=0.3)
        self.play_at(b.at("test"), FadeIn(t1, scale=0.8), dur=0.4)
        self.play_at(b.at("code review"), FadeIn(t2, scale=0.8), dur=0.4)
        self.play_at(b.at("pemahaman"), FadeIn(t3, scale=0.8), dur=0.4)
        self.r3 = VGroup(l, bar, kita, lm, lk)

    def beat_b7_4(self, b):
        self.play_at(b.at("Jadi"), FadeOut(self.r3), dur=0.5)
        t = TB("Jangan Langsung\nPercaya Hasil AI", 84, PRIMA, line_spacing=1.0)
        sub = T("periksa dengan alat yang tepat", 34, INK2).next_to(t, DOWN, buff=0.45)
        self.play_at(b.at("Jangan"), FadeIn(t, scale=1.1), dur=0.8)
        self.play_at(b.at("periksa"), FadeIn(sub, shift=UP * 0.2), dur=0.5)
        self.r4 = VGroup(t, sub)

    def beat_b7_5(self, b):
        self.play_at(b.at("Klaim"), FadeOut(self.r4), dur=0.5)
        g = DashedLine(DOWN * 3.3, UP * 3.3, color=KRITIS, dash_length=0.12); g0 = Line(DOWN * 3.3, UP * 3.3)
        dots = VGroup(*[Dot(g0.point_from_proportion(z / 240), color=NOL, radius=0.07) for z in NOLZ if z < 226])
        self.play(Create(g), LaggedStart(*[GrowFromCenter(d) for d in dots], lag_ratio=0.02), run_time=1.6)
        top = Dot(g0.point_from_proportion(0.985), color=INK, radius=0.11)
        q = TB("?", 60, INK).next_to(top, RIGHT, buff=0.25)
        self.play_at(b.at("atau mungkin"), FadeIn(top), FadeIn(q), dur=0.5)
        self.play(top.animate.set_opacity(0.2), run_time=0.4); self.play(top.animate.set_opacity(1), run_time=0.4)
        k1 = T("momen terbesar\ndalam sejarah matematika?", 30, PRIMA, line_spacing=1.0).shift(LEFT * 4.2)
        k2 = T("atau ada celah\nyang ditemukan?", 30, INK2, line_spacing=1.0).shift(RIGHT * 4.2)
        self.play(FadeIn(k1), FadeIn(k2), run_time=0.5)
        self.r5 = VGroup(g, dots, top, q, k1, k2)

    def beat_b7_6(self, b):
        self.play_at(b.at("Saya akan"), self.r5.animate.set_opacity(0.15), dur=0.5)
        box = VGroup(panel(8.4, 1.5), T("Pembaruan status: lihat komentar tersemat", 34, INK))
        box[1].move_to(box[0])
        self.play_at(b.at("kolom komentar"), FadeIn(box, shift=UP * 0.2), dur=0.6)
        self.r6 = VGroup(self.r5, box)

    def beat_b7_7(self, b):
        self.play_at(b.at("Kalau kamu"), FadeOut(self.r6), dur=0.5)
        win = jendela("Editor Lean", 10.5, 3.0).shift(UP * 0.6)
        kd = blok_kode(["theorem dua_tambah_dua :", "  2 + 2 = 4 := by rfl"], 30).move_to(win[0]).shift(DOWN * 0.15)
        cek = VGroup(Circle(radius=0.45, fill_color=LEAN, fill_opacity=1, stroke_width=0), T("✓", 40, BG, weight=BOLD)).next_to(win, RIGHT, buff=-1.1).shift(DOWN * 0.15)
        cta = T("Coba sendiri, lalu ceritakan hasilnya di komentar!", 34, PRIMA).next_to(win, DOWN, buff=0.6)
        self.play(FadeIn(win), run_time=0.4)
        self.play_at(b.at("coba tulis"), AddTextLetterByLetter(kd[0], time_per_char=0.03), AddTextLetterByLetter(kd[1], time_per_char=0.04), dur=1.4)
        self.play(GrowFromCenter(cek), run_time=0.4)
        self.play_at(b.at("ceritakan"), FadeIn(cta, shift=UP * 0.2), dur=0.5)
        self.r7 = VGroup(win, kd, cek, cta)

    def beat_b7_8(self, b):
        self.play_at(b.at("Naskah"), FadeOut(self.r7), dur=0.5)
        t = T("Naskah video ini disusun dengan bantuan AI, termasuk Claude buatan Anthropic,\nlalu diperiksa fakta dan disunting manusia.", 28, INK2, line_spacing=1.2)
        if t.width > 12.4: t.scale_to_fit_width(12.4)
        kanal = TB("I Teach Software Engineering", 44, INK).next_to(t, UP, buff=0.8)
        self.play(FadeIn(kanal), FadeIn(t), run_time=0.8)
