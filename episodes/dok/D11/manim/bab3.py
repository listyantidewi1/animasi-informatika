from kit import *


def keterangan(s, warna=INK):
    t = T(s, 32, warna)
    if t.width > 12.6: t.scale_to_fit_width(12.6)
    return t.move_to(DOWN * 3.45)


class Bab3(BabScene):
    SEG = 3

    def beat_b3_1(self, b):
        besar = Ellipse(width=11.6, height=5.3, stroke_color=ORANYE, stroke_width=5, fill_color="#1D1711", fill_opacity=1).move_to(UP * 0.2)
        kecil = Ellipse(width=4.6, height=3.3, stroke_color=AI, stroke_width=5, fill_color="#0F1C24", fill_opacity=1).move_to(LEFT * 2.6 + DOWN * 0.1)
        self.play_at(b.at("dua kelompok"), Create(besar), Create(kecil), dur=1.0)
        m1 = T("meniru P", 34, INK2).move_to(kecil); m2 = T("meniru NP", 34, INK2).move_to(RIGHT * 3.0 + UP * 0.2)
        self.play_at(b.at("meniru P dan NP"), FadeIn(m1), FadeIn(m2), dur=0.6)
        self.besar, self.kecil, self.m = besar, kecil, VGroup(m1, m2)

    def beat_b3_2(self, b):
        vp = TB("VP", 64, AI).move_to(self.kecil.get_center() + UP * 0.75)
        self.play_at(b.at("VP"), FadeOut(self.m[0]), FadeIn(vp, scale=1.3), dur=0.5)
        k = keterangan("VP: rumus yang bisa dihitung dengan sirkuit kecil", AI)
        self.play_at(b.at("Isinya"), FadeIn(k, shift=UP * 0.15), dur=0.5)
        det = chip("determinan", AI, 30).move_to(self.kecil.get_center() + DOWN * 0.45)
        self.play_at(b.at("determinan"), FadeIn(det, scale=0.8), dur=0.5)
        self.vp, self.det, self.k = vp, det, k

    def beat_b3_3(self, b):
        vnp = TB("VNP", 64, ORANYE).move_to(RIGHT * 2.6 + UP * 1.75)
        self.play_at(b.at("VNP"), FadeOut(self.m[1]), FadeIn(vnp, scale=1.3), dur=0.5)
        k = keterangan("VNP: setiap suku mudah dijelaskan, tetapi jumlah sukunya luar biasa banyak", ORANYE)
        self.play_at(b.at("Isinya"), FadeOut(self.k), FadeIn(k, shift=UP * 0.15), dur=0.5)
        per = chip("permanen", ORANYE, 30).move_to(RIGHT * 2.6 + DOWN * 0.1)
        self.play_at(b.at("seperti permanen"), FadeIn(per, scale=0.8), dur=0.5)
        self.vnp, self.per, self.k = vnp, per, k

    def beat_b3_4(self, b):
        tuj = RIGHT * 3.5 + UP * 0.2
        ters = TB("tersulit di VNP", 26, PRIMA).move_to(tuj + DOWN * 0.7)
        self.play_at(b.at("tersulit"), FadeOut(self.k), self.per.animate.move_to(tuj), dur=0.7)
        self.play(FadeIn(ters, shift=UP * 0.1), Indicate(self.per, color=PRIMA, scale_factor=1.12), run_time=0.6)
        pn = DashedLine(tuj + LEFT * 1.25, self.kecil.get_right() + RIGHT * 0.1, color=INK, stroke_width=5, dash_length=0.16).add_tip(tip_length=0.28)
        tanya = TB("sirkuit kecil?", 26, INK).next_to(pn, UP, buff=0.12).shift(LEFT * 0.35)
        self.play_at(b.at("Kalau permanen"), Create(pn), FadeIn(tanya), dur=0.8)
        bayang = self.kecil.copy().set_fill(opacity=0).set_stroke(AI, 6)
        sama = keterangan("maka VP = VNP", AI)
        self.play_at(b.at("seluruh isi VNP"), Transform(bayang, self.besar.copy().set_fill(opacity=0).set_stroke(AI, 6).scale(1.03)), FadeIn(sama), dur=1.3)
        self.bayang, self.sama, self.pn, self.tanya, self.ters = bayang, sama, pn, tanya, ters

    def beat_b3_5(self, b):
        teb = VGroup(T("tebakan Valiant:", 34, INK2), TB("VP ≠ VNP", 54, PRIMA)).arrange(RIGHT, buff=0.35).move_to(DOWN * 3.4)
        self.play_at(b.at("Tebakannya"), FadeOut(self.bayang), FadeOut(self.sama), dur=0.5)
        self.play_at(b.at("VP tidak sama"), FadeIn(teb, shift=UP * 0.2), dur=0.6)
        x = silang(0.3).move_to(self.pn.get_center())
        tiada = TB("tidak ada jalan pintas", 24, NOL).move_to(self.pn.get_center() + DOWN * 1.1 + RIGHT * 0.3)
        self.play_at(b.at("jalan pintas"), FadeIn(x, scale=1.6), FadeOut(self.tanya), FadeIn(tiada), dur=0.6)
        self.r5 = VGroup(self.besar, self.kecil, self.vp, self.vnp, self.det, self.per, self.ters, self.pn, x, tiada, teb)

    def beat_b3_6(self, b):
        g = NumberLine(x_range=[1979, 2026, 47], length=10.5, color=INK2, include_numbers=False, stroke_width=4).move_to(UP * 2.9)
        a = TB("1979", 32, INK).next_to(g.get_left(), DOWN, buff=0.25); z = TB("2026", 32, INK).next_to(g.get_right(), DOWN, buff=0.25)
        tt = Dot(g.get_left(), color=PRIMA, radius=0.13)
        self.play_at(b.at("Selama"), FadeOut(self.r5), FadeIn(g), FadeIn(a), FadeIn(tt), dur=0.6)
        bt = TB("47 tahun: tebakan itu belum terbukti", 34, PRIMA).next_to(g, DOWN, buff=0.22)
        self.play_at(b.at("empat puluh tujuh"), tt.animate.move_to(g.get_right()), FadeIn(z), dur=1.6, sebelum=b.at("tidak ada yang berhasil"))
        self.play_at(b.at("tidak ada yang berhasil"), FadeIn(bt, shift=UP * 0.15), dur=0.5)
        # tiga batang (ilustrasi)
        x0 = LEFT * 6.3; L = 6.6

        def batang(y, pj, warna, label):
            r = Rectangle(width=pj, height=0.5, fill_color=warna, fill_opacity=0.9, stroke_width=0).move_to(x0 + UP * y, aligned_edge=LEFT)
            t = T(label, 28, INK).next_to(r, UP, buff=0.12).align_to(r, LEFT)
            return VGroup(r, t)
        b1 = batang(0.1, L, DIM, "jumlah bilangan di dalam tabel")
        b2 = batang(-1.25, L * 1.22, ORANYE, "langkah yang terbukti dibutuhkan untuk menghitung permanen")
        b3 = batang(-2.6, L * 0.97, AI, "langkah untuk sekadar membaca semua bilangan itu")
        self.play_at(b.at("hanya bisa memastikan"), FadeIn(b2[1]), dur=0.5)
        self.play_at(b.at("menghitung permanen"), GrowFromEdge(b2[0], LEFT), dur=1.0)
        gar = VGroup(*[Line(x0 + RIGHT * L + UP * (y + 0.38), x0 + RIGHT * L + UP * (y - 0.38), color=INK, stroke_width=4) for y in (0.1, -1.25, -2.6)])
        lebih = TB("hanya sedikit lebih banyak", 26, ORANYE).next_to(b2[0], RIGHT, buff=0.25)
        self.play_at(b.at("sedikit lebih banyak"), FadeIn(b1[1]), GrowFromEdge(b1[0], LEFT), dur=0.8)
        self.play(Create(gar), FadeIn(lebih), run_time=0.6)
        self.play_at(b.at("Padahal"), FadeIn(b3[1]), dur=0.4)
        self.play_at(b.at("membaca semua bilangan"), GrowFromEdge(b3[0], LEFT), dur=1.0)
        cat = T("ilustrasi, tidak berskala", 20, DIM).to_corner(DR, buff=0.25)
        self.play_at(b.at("hampir sebanyak itu"), Indicate(b3[0], color=AI, scale_factor=1.03), FadeIn(cat), dur=0.7)
        self.r6 = VGroup(g, a, z, tt, bt, b1, b2, b3, gar, lebih, cat)

    def beat_b3_7(self, b):
        p = TB("permanen", 60, ORANYE); d = TB("determinan", 60, AI)
        q = VGroup(T("benar-benar", 30, INK2), TB("lebih sulit?", 44, PRIMA), T("daripada", 30, INK2)).arrange(DOWN, buff=0.12)
        g = VGroup(p, q, d).arrange(RIGHT, buff=0.7).move_to(UP * 0.5)
        if g.width > 13: g.scale_to_fit_width(13)
        self.play_at(b.at("Artinya"), FadeOut(self.r6), dur=0.5)
        self.play_at(b.at("tidak ada yang bisa memastikan"), FadeIn(p, shift=RIGHT * 0.2), FadeIn(d, shift=LEFT * 0.2), dur=0.6)
        self.play_at(b.at("benar-benar lebih sulit"), FadeIn(q, scale=1.2), dur=0.6)
        bw = T("47 tahun tanpa kepastian", 36, INK2).next_to(g, DOWN, buff=0.8)
        self.play(FadeIn(bw, shift=UP * 0.15), run_time=0.5)
