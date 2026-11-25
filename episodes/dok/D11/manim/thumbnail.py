"""Thumbnail D11 1920x1080: manim -qh -s --disable_caching thumbnail.py Thumb"""
from kit import *


class Thumb(Scene):
    def construct(self):
        glow = VGroup(*[Circle(radius=3.0 + i * 0.35, fill_color="#16202E", fill_opacity=0.22 - i * 0.035, stroke_width=0) for i in range(6)]).move_to(RIGHT * 4.0)
        tp = tumpukan(36, 3.0, 0.13).move_to(RIGHT * 3.9 + DOWN * 1.2)
        lab = VGroup(TB("70", 64, INK), T("halaman", 34, INK2)).arrange(DOWN, buff=0.06)
        lab.add_background_rectangle(color=BG, opacity=0.96, buff=0.2); lab.move_to(RIGHT * 3.9 + DOWN * 2.2)
        s1 = stempel("Diperiksa mesin", LEAN, size=34).scale(0.8).move_to(RIGHT * 3.6 + UP * 3.0)
        s2 = stempel("Diperiksa manusia", kosong=True, size=34).scale(0.8).move_to(RIGHT * 3.9 + UP * 1.6)
        q = TB("?", 100, PRIMA).next_to(s2, RIGHT, buff=0.15)
        if q.get_right()[0] > 6.9: q.shift(LEFT * (q.get_right()[0] - 6.9))
        j1 = TB("AI Mengklaim Membuktikan", 50, INK)
        j2 = TB("Sepupu", 104, PRIMA)
        j3 = TB("P vs NP", 150, PRIMA)
        judul = VGroup(j1, j2, j3).arrange(DOWN, aligned_edge=LEFT, buff=0.16).to_edge(LEFT, buff=0.6).shift(UP * 0.3)
        if judul.width > 7.0: judul.scale_to_fit_width(7.0).to_edge(LEFT, buff=0.6)
        badge = VGroup(RoundedRectangle(width=5.6, height=0.75, corner_radius=0.37, fill_color=PANEL, fill_opacity=1, stroke_color=AI, stroke_width=3), T("KLAIM BARU · NOVEMBER 2026", 24, AI, weight=BOLD))
        badge[1].move_to(badge[0]); badge.next_to(judul, UP, buff=0.4, aligned_edge=LEFT)
        sub = TB("Siapa yang memeriksa?", 48, INK).next_to(judul, DOWN, buff=0.45, aligned_edge=LEFT)
        self.add(glow, tp, lab, s1, s2, q, judul, badge, sub)
