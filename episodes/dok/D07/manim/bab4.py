from kit import *
from bab0 import baris_kode


def kertas(w=2.6, h=3.4, n=9):
    k = Rectangle(width=w, height=h, fill_color="#F4F1E8", fill_opacity=1, stroke_width=0)
    g = VGroup(*[Line(LEFT * (w / 2 - 0.3), RIGHT * (w / 2 - 0.3 - (i % 3) * 0.3), color="#B9B09A", stroke_width=2).shift(UP * (h / 2 - 0.5 - i * (h - 0.8) / n)) for i in range(n)])
    return VGroup(k, g)


class Bab4(BabScene):
    SEG = 4

    def beat_b4_1(self, b):
        tgl = TB("20 November 2026", 44, PRIMA).to_edge(UP, buff=0.5)
        cat = kertas().shift(LEFT * 3.4 + DOWN * 0.4)
        nama = TB("Levent Alpöge", 52).shift(RIGHT * 2.2 + UP * 0.3)
        peran = T("matematikawan", 30, INK2).next_to(nama, DOWN, buff=0.2)
        self.play_at(b.at("Pada"), FadeIn(tgl, shift=DOWN * 0.2), dur=0.6)
        self.play_at(b.at("Levent"), FadeIn(nama, shift=LEFT * 0.2), FadeIn(peran), dur=0.6)
        situs = T("dipasang di situs pribadinya", 24, DIM).next_to(cat, DOWN, buff=0.25)
        self.play_at(b.at("catatan"), FadeIn(cat, shift=UP * 0.3), FadeIn(situs), dur=0.7)
        self.r1 = dict(tgl=tgl, cat=cat, nama=nama, peran=peran, situs=situs)

    def beat_b4_2(self, b):
        r = self.r1
        ant = T("bekerja di Anthropic,\nperusahaan pembuat Claude", 28, AI, line_spacing=1.0).next_to(r["peran"], DOWN, buff=0.35)
        self.play_at(b.at("Anthropic"), FadeIn(ant, shift=UP * 0.2), dur=0.6)
        self.r1["ant"] = ant

    def beat_b4_3(self, b):
        r = self.r1
        self.play_at(b.at("Dalam"), FadeOut(VGroup(r["nama"], r["peran"], r["ant"], r["situs"])), r["cat"].animate.scale(0.7).to_edge(LEFT, buff=0.8), dur=0.6)
        q = T("“Saya yakin, bersama Claude,\nsaya telah menemukan bukti\nHipotesis Riemann.”", 46, INK, line_spacing=1.15).shift(RIGHT * 1.2)
        src = T("Levent Alpöge (diterjemahkan)", 24, DIM).next_to(q, DOWN, buff=0.4).align_to(q, LEFT)
        self.play_at(b.at("ia yakin"), Write(q), FadeIn(src), dur=1.6)
        self.r3 = VGroup(q, src)

    def beat_b4_4(self, b):
        self.play_at(b.at("Ia juga"), FadeOut(self.r3), FadeOut(self.r1["cat"]), FadeOut(self.r1["tgl"]), dur=0.5)
        g = DashedLine(DOWN * 2.6, UP * 2.6, color=KRITIS, dash_length=0.12)
        satu = T("fungsi zeta", 24, KRITIS).next_to(g, DOWN, buff=0.15)
        self.play(Create(g), FadeIn(satu), run_time=0.6)
        warna = [AI, UNGU, LEAN, ORANYE, NOL, AI, UNGU, LEAN]
        banyak = VGroup(*[DashedLine(DOWN * 2.6, UP * 2.6, color=warna[i], dash_length=0.12).shift(RIGHT * (i - 3.5) * 1.3) for i in range(8)])
        lab = T("Hipotesis Riemann yang Diperumum: nol setiap fungsi L juga di garis 1/2", 26, INK).to_edge(UP, buff=0.35)
        self.play_at(b.at("lebih umum"), ReplacementTransform(VGroup(g), banyak), FadeOut(satu), dur=1.2)
        self.play_at(b.at("Diperumum"), FadeIn(lab, shift=DOWN * 0.2), dur=0.6)
        self.r4 = VGroup(banyak, lab)

    def beat_b4_5(self, b):
        self.play_at(b.at("Bagian"), FadeOut(self.r4), dur=0.5)
        mak = kertas(2.6, 3.4).shift(LEFT * 3.6)
        lb = T("makalah biasa", 26, INK2).next_to(mak, DOWN, buff=0.2)
        self.play(FadeIn(mak), FadeIn(lb), run_time=0.5)
        x = Cross(mak, stroke_color=NOL, stroke_width=8).scale(0.6)
        self.play_at(b.at("tidak berupa"), Create(x), dur=0.5)
        dinding = VGroup(*[baris_kode(16).scale(0.7) for _ in range(3)]).arrange(RIGHT, buff=0.3).shift(RIGHT * 2.6)
        dinding.set_opacity(0.9)
        self.play_at(b.at("kode Lean"), FadeOut(VGroup(mak, lb, x), shift=LEFT), LaggedStart(*[FadeIn(c, shift=UP * 0.4) for c in dinding], lag_ratio=0.2), dur=1.2)
        self.play(dinding.animate.shift(UP * 0.8), run_time=1.0, rate_func=linear)
        self.dinding = dinding

    def beat_b4_6(self, b):
        self.play_at(b.at("Menurut"), self.dinding.animate.set_opacity(0.15).shift(UP * 0.4), dur=0.6)
        tumpuk = VGroup()
        for i in range(36):
            h = Rectangle(width=2.4, height=0.11, fill_color="#F4F1E8", fill_opacity=1, stroke_color="#C9C2B0", stroke_width=1)
            h.move_to([-3.4 + 0.03 * ((i * 7) % 5 - 2), -3.2 + i * 0.17, 0]); tumpuk.add(h)
        self.play(LaggedStart(*[FadeIn(h, shift=DOWN * 0.5) for h in tumpuk], lag_ratio=0.04), run_time=1.6)
        ang = TB("250.000+", 96, INK).shift(RIGHT * 2.2 + UP * 0.4)
        hal = T("halaman, kalau ditulis untuk dibaca manusia", 28, INK2).next_to(ang, DOWN, buff=0.25)
        src = T("perkiraan Thomas Bloom, matematikawan", 22, DIM).next_to(hal, DOWN, buff=0.2)
        self.play_at(b.at("dua ratus"), FadeIn(ang, scale=1.3), FadeIn(hal), FadeIn(src), dur=0.8)
        self.r6 = VGroup(self.dinding, tumpuk, ang, hal, src)

    def beat_b4_7(self, b):
        self.play_at(b.at("Setelah"), FadeOut(self.r6), dur=0.5)
        term = jendela("Terminal (ilustrasi)", 11, 5.6)
        p = term[1].get_bottom() + DOWN * 0.45
        def ln(s, w=INK2, i=0):
            return kode(s, 22, w).move_to(p + DOWN * i * 0.55, aligned_edge=UL).align_to(term[0], LEFT).shift(RIGHT * 0.5)
        l0 = ln("$ lake build", INK, 0)
        self.play(FadeIn(term, scale=0.95), run_time=0.4)
        nm = T("Andrew Sutherland, MIT: dikompilasi ulang secara independen", 24, INK2).next_to(term, UP, buff=0.25)
        self.play_at(b.at("Andrew"), FadeIn(nm), dur=0.5)
        self.play_at(b.at("mengompilasi"), AddTextLetterByLetter(l0, time_per_char=0.05), dur=0.6)
        bar_bg = Rectangle(width=7, height=0.3, stroke_color=DIM, stroke_width=2).move_to(p + DOWN * 1.2).align_to(term[0], LEFT).shift(RIGHT * 0.5)
        bar = Rectangle(width=0.01, height=0.3, fill_color=LEAN, fill_opacity=1, stroke_width=0).move_to(bar_bg, aligned_edge=LEFT)
        self.add(bar_bg, bar)
        self.play_at(self.now, bar.animate.stretch_to_fit_width(7).move_to(bar_bg, aligned_edge=LEFT), dur=1.6, rate_func=rate_functions.ease_in_out_sine, sebelum=b.at("tiga aksioma") - 0.3)
        l2 = ln("Build completed successfully.", LEAN, 3)
        self.play(FadeIn(l2), run_time=0.3)
        l3 = ln("depends on axioms: [propext, Classical.choice, Quot.sound]", INK2, 4.3)
        if l3.width > 10: l3.scale_to_fit_width(10).align_to(term[0], LEFT).shift(RIGHT * 0.5)
        l4 = T("hanya tiga aksioma standar Lean", 26, PRIMA).next_to(l3, DOWN, buff=0.3).align_to(l3, LEFT)
        self.play_at(b.at("tiga aksioma"), FadeIn(l3), FadeIn(l4), dur=0.6)
        self.r7 = VGroup(term, l0, bar_bg, bar, l2, l3, l4, nm)

    def beat_b4_8(self, b):
        self.play_at(b.at("Sutherland"), FadeOut(self.r7), dur=0.5)
        q = TB("“Momen bersejarah.”", 72, INK)
        src = T("Andrew Sutherland, MIT (diterjemahkan dari “an historic moment”)", 24, DIM).next_to(q, DOWN, buff=0.4)
        self.play_at(b.at("momen"), FadeIn(q, scale=1.1), FadeIn(src), dur=0.7)
        self.r8 = VGroup(q, src)

    def beat_b4_9(self, b):
        self.play_at(b.at("Namun"), FadeOut(self.r8), dur=0.5)
        uang = TB("US$1.000.000", 100, PRIMA)
        ket = T("Clay Mathematics Institute", 28, INK2).next_to(uang, DOWN, buff=0.35)
        self.play(FadeIn(uang), FadeIn(ket), run_time=0.6)
        st = VGroup(RoundedRectangle(width=5.4, height=1.1, corner_radius=0.15, stroke_color=INK2, stroke_width=6),
                    TB("BELUM DIBERIKAN", 44, INK2)).rotate(-0.18).move_to(uang).shift(DOWN * 0.2)
        self.play_at(b.at("belum diberikan"), FadeIn(st, scale=1.6), dur=0.4)
        self.play_at(b.at("pemeriksaan"), uang.animate.set_opacity(0.4), dur=0.6)
