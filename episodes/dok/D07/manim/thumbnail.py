"""Thumbnail D07 1920x1080: manim -qh -s --disable_caching thumbnail.py Thumb"""
from kit import *
from bab0 import baris_kode
import json

NOLZ = json.load(open(os.path.join(D, "nol100.json")))


class Thumb(Scene):
    def construct(self):
        # kanan: garis kritis + nol zeta, kode Lean, tumpukan halaman
        glow = VGroup(*[Circle(radius=3.2 + i * 0.35, fill_color="#16202E", fill_opacity=0.22 - i * 0.035, stroke_width=0) for i in range(6)]).move_to(RIGHT * 3.9)
        g0 = Line(DOWN * 3.7, UP * 3.7).shift(RIGHT * 6.3)
        garis = DashedLine(DOWN * 3.7, UP * 3.7, color=KRITIS, dash_length=0.14, stroke_width=5).shift(RIGHT * 6.3)
        dots = VGroup(*[Dot(g0.point_from_proportion(z / 120), color=NOL, radius=0.09) for z in NOLZ if z < 118])
        tumpuk = VGroup()
        for i in range(34):
            h = Rectangle(width=2.5, height=0.13, fill_color="#F4F1E8", fill_opacity=1, stroke_color="#C9C2B0", stroke_width=1)
            h.move_to([3.5 + 0.03 * ((i * 7) % 5 - 2), -3.4 + i * 0.2, 0]); tumpuk.add(h)
        ang = TB("250.000", 58, INK); hal = T("halaman", 34, INK2)
        lab = VGroup(ang, hal).arrange(DOWN, buff=0.08)
        lab.add_background_rectangle(color=BG, opacity=0.96, buff=0.2); lab.move_to([3.5, 0.2, 0])
        cek = VGroup(Circle(radius=0.75, fill_color=LEAN, fill_opacity=1, stroke_width=0), T("✓", 64, BG, weight=BOLD)).move_to([4.9, 2.7, 0])
        # kiri: judul
        j1 = TB("Hipotesis Riemann", 76, INK)
        j2 = TB("Dipecahkan", 120, PRIMA)
        j3 = TB("oleh AI?", 120, PRIMA)
        judul = VGroup(j1, j2, j3).arrange(DOWN, aligned_edge=LEFT, buff=0.12).to_edge(LEFT, buff=0.7).shift(UP * 0.35)
        if judul.width > 6.3: judul.scale_to_fit_width(6.3).to_edge(LEFT, buff=0.7)
        badge = VGroup(RoundedRectangle(width=5.2, height=0.75, corner_radius=0.37, fill_color=PANEL, fill_opacity=1, stroke_color=AI, stroke_width=3),
                       T("KLAIM BARU · 20 NOVEMBER 2026", 24, AI, weight=BOLD))
        badge[1].move_to(badge[0])
        if badge[1].width > 4.9: badge[1].scale_to_fit_width(4.9)
        badge.next_to(judul, UP, buff=0.4, aligned_edge=LEFT)
        sub = T("Soal 167 tahun, dan buktinya\ndiperiksa oleh komputer.", 32, INK2, line_spacing=1.1).next_to(judul, DOWN, buff=0.4, aligned_edge=LEFT)
        self.add(glow, garis, dots, tumpuk, lab, cek, judul, badge, sub)
