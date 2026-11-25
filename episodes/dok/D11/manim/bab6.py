from kit import *


def kotak(teks, warna, w=4.4, h=1.5, size=34, sub=None):
    k = RoundedRectangle(width=w, height=h, corner_radius=0.18, fill_color=PANEL, fill_opacity=1, stroke_color=warna, stroke_width=4)
    t = TB(teks, size, warna)
    if sub: t = VGroup(t, T(sub, int(size * 0.72), INK2)).arrange(DOWN, buff=0.1)
    if t.width > w - 0.4: t.scale_to_fit_width(w - 0.4)
    return VGroup(k, t.move_to(k))


def bil(s, warna=INK, size=34):
    t = TB(s, size, warna)
    k = RoundedRectangle(width=max(t.width + 0.45, 0.95), height=0.85, corner_radius=0.16, fill_color=PANEL, fill_opacity=1, stroke_color=warna, stroke_width=3)
    return VGroup(k, t)


class Bab6(BabScene):
    SEG = 6

    def beat_b6_1(self, b):
        a = TB("VP ≠ VNP", 70, PRIMA).move_to(LEFT * 3.8 + UP * 1.6)
        la = T("kalau klaim ini benar", 28, INK2).next_to(a, UP, buff=0.25)
        c = TB("P vs NP", 70, INK).move_to(RIGHT * 4.0 + UP * 1.6)
        pn = Arrow(a.get_right(), c.get_left(), buff=0.35, color=INK2, stroke_width=6)
        q = TB("?", 60, INK).next_to(pn, UP, buff=0.1)
        self.play(FadeIn(a), FadeIn(la), run_time=0.4)
        self.play_at(b.at("apakah P versus NP"), GrowArrow(pn), FadeIn(c, shift=LEFT * 0.2), FadeIn(q), dur=0.7)
        bl = TB("Belum.", 80, NOL).move_to(DOWN * 0.5)
        self.play_at(b.at("Jawabannya belum"), FadeIn(bl, scale=1.3), q.animate.set_color(NOL), dur=0.5)
        e = T("“This does not settle P vs NP.”", 40, INK, slant=ITALIC).move_to(DOWN * 2.1)
        s = T("paper.pdf  ·  “VP ≠ VNP over every field”", 22, DIM).next_to(e, DOWN, buff=0.25)
        self.play_at(b.at("makalah itu sendiri"), FadeIn(e, shift=UP * 0.15), FadeIn(s), dur=0.7)
        self.r1 = VGroup(a, la, c, pn, q, bl, e, s)

    def beat_b6_2(self, b):
        sa = kotak("sirkuit aritmetika", AI, 5.0, 1.5, 34).move_to(LEFT * 3.5 + UP * 2.4)
        self.play_at(b.at("Ingat syarat tadi"), FadeOut(self.r1), FadeIn(sa, shift=DOWN * 0.2), dur=0.7)
        isi = ["3", "−2", "0,5", "120", "7", "−40,25", "1.000.000", "0", "1", "99", "2/3", "−8"]
        ch = VGroup(*[bil(s) for s in isi]).arrange_in_grid(rows=3, buff=0.22).move_to(LEFT * 3.5 + DOWN * 0.55)
        if ch.width > 6.2: ch.scale_to_fit_width(6.2)
        ls = TB("harus benar untuk semua bilangan", 28, ORANYE).next_to(ch, DOWN, buff=0.35)
        self.play_at(b.at("Sirkuit aritmetika"), Indicate(sa, color=AI, scale_factor=1.05), dur=0.5)
        self.play_at(b.at("harus benar"), LaggedStart(*[FadeIn(c, shift=UP * 0.3) for c in ch], lag_ratio=0.08), dur=1.3)
        self.play_at(b.at("semua bilangan"), FadeIn(ls, shift=UP * 0.15), dur=0.5)
        self.kiri = VGroup(sa, ch, ls)

    def beat_b6_3(self, b):
        kb = kotak("komputer sungguhan", LEAN, 5.0, 1.5, 34).move_to(RIGHT * 3.5 + UP * 2.4)
        grs = DashedLine(UP * 3.3, DOWN * 3.0, color=GARIS, dash_length=0.15, stroke_width=3)
        self.play_at(b.at("Komputer sungguhan"), FadeIn(kb, shift=DOWN * 0.2), Create(grs), dur=0.7)
        ch = VGroup(bil("0", LEAN, 70), bil("1", LEAN, 70)).arrange(RIGHT, buff=0.6).move_to(RIGHT * 3.5 + DOWN * 0.55)
        for c in ch: c[0].stretch_to_fit_width(1.6).stretch_to_fit_height(1.6)
        ls = TB("cukup benar untuk 0 dan 1", 28, LEAN).next_to(ch, DOWN, buff=0.5)
        self.play_at(b.at("nol atau satu"), FadeIn(ch[0], scale=0.7), dur=0.35)
        self.play(FadeIn(ch[1], scale=0.7), FadeIn(ls), run_time=0.4)
        self.r3 = VGroup(self.kiri, kb, grs, ch, ls)

    def beat_b6_4(self, b):
        self.play_at(b.at("Pada nilai"), FadeOut(self.r3), dur=0.5)
        kol = [-2.6, 0.0, 2.6]; yb = [1.9, 0.75, -0.25, -1.65]
        kep = VGroup(TB("x", 44, INK).move_to([kol[0], yb[0], 0]), TB("x²", 44, AI).move_to([kol[1], yb[0], 0]), TB("x", 44, LEAN).move_to([kol[2], yb[0], 0]))
        gh = Line([-4.0, yb[0] - 0.55, 0], [4.0, yb[0] - 0.55, 0], color=GARIS, stroke_width=3)
        jud = T("dua rumus yang berbeda", 28, INK2).move_to([1.3, yb[0] + 0.75, 0])

        def baris(i, a, c, d, sama):
            g = VGroup(TB(a, 44, INK).move_to([kol[0], yb[i], 0]), TB(c, 44, AI).move_to([kol[1], yb[i], 0]), TB(d, 44, LEAN).move_to([kol[2], yb[i], 0]))
            tanda = (centang(0.24) if sama else silang(0.24)).move_to([4.5, yb[i], 0])
            ket = T("sama" if sama else "berbeda", 26, LEAN if sama else NOL).next_to(tanda, RIGHT, buff=0.2)
            return VGroup(g, tanda, ket)
        r0 = baris(1, "0", "0", "0", True); r1 = baris(2, "1", "1", "1", True); r3 = baris(3, "3", "9", "3", False)
        tabel = VGroup(kep, gh, jud, r0, r1, r3).shift(UP * 0.9 + LEFT * 0.8)
        self.play_at(b.at("banyak rumus"), FadeIn(kep), FadeIn(gh), FadeIn(jud), dur=0.6)
        self.play_at(b.at("hasil yang sama"), FadeIn(r0[0]), FadeIn(r1[0]), dur=0.6)
        self.play_at(b.at("x kuadrat selalu sama"), Indicate(kep[1], color=AI), Indicate(kep[2], color=LEAN), FadeIn(r0[1:]), FadeIn(r1[1:]), dur=0.8)
        blh = TB("komputer boleh menghitung rumus yang lebih mudah", 32, LEAN).move_to(DOWN * 3.2)
        kt = SurroundingRectangle(VGroup(r0[0], r1[0]), color=LEAN, buff=0.2, stroke_width=4, corner_radius=0.12)
        self.play_at(b.at("komputer boleh"), FadeIn(blh, shift=UP * 0.15), dur=0.6)
        self.play_at(b.at("asalkan"), Create(kt), dur=0.6)
        r3.set_opacity(0.55); lr = T("di luar 0 dan 1, hasilnya berbeda", 24, INK2).next_to(r3[0], DOWN, buff=0.22)
        self.play_at(b.at("cocok pada nol dan satu"), FadeIn(r3, shift=UP * 0.15), FadeIn(lr), dur=0.7)
        self.r4 = VGroup(tabel, blh, kt, lr)

    def beat_b6_5(self, b):
        n = 8
        peta = VGroup(*[RoundedRectangle(width=1.25, height=1.0, corner_radius=0.14, fill_color=PANEL, fill_opacity=1, stroke_color=LEAN, stroke_width=4) for _ in range(n)]).arrange(RIGHT, buff=0.32).move_to(UP * 0.5)
        sam = VGroup(*[Line(peta[i].get_right(), peta[i + 1].get_left(), color=INK2, stroke_width=4) for i in range(n - 1)])
        ck = VGroup(*[centang(0.2).move_to(p) for p in peta])
        jud = TB("bukti, untuk sirkuit aritmetika", 36, AI).move_to(UP * 2.4)
        lp = T("langkah-langkah bukti (ilustrasi)", 22, DIM).next_to(peta, UP, buff=0.3)
        self.play_at(b.at("Sirkuit aritmetika"), FadeOut(self.r4), FadeIn(peta), FadeIn(sam), FadeIn(ck), FadeIn(jud), FadeIn(lp), dur=0.8)
        jud2 = TB("bukti yang sama, untuk komputer biasa (0 dan 1)", 36, LEAN).move_to(UP * 2.4)
        self.play_at(b.at("tidak berlaku untuk komputer biasa"), FadeOut(jud), FadeIn(jud2), ck.animate.set_opacity(0.35), dur=0.7)
        rusak = [2, 5]; an = []; xs = VGroup(); retak = VGroup()
        for i in rusak:
            p = peta[i]; c = p.get_center()
            z = VMobject(color=NOL, stroke_width=5).set_points_as_corners([c + UP * 0.5 + LEFT * 0.15, c + UP * 0.18 + RIGHT * 0.12, c + LEFT * 0.1, c + DOWN * 0.22 + RIGHT * 0.15, c + DOWN * 0.5 + LEFT * 0.05])
            x = silang(0.22).next_to(p, DOWN, buff=0.2); retak.add(z); xs.add(x)
            an += [p.animate.set_stroke(NOL).set_fill("#2A1517").rotate(-5 * DEGREES).shift(DOWN * 0.12), FadeOut(ck[i]), Create(z), FadeIn(x, scale=1.6)]
        dua = TB("dua langkah runtuh", 44, NOL).move_to(DOWN * 1.9)
        self.play_at(b.at("dua langkah yang runtuh"), *an, FadeIn(dua, shift=UP * 0.15), dur=0.9)
        sb = T("ketika cukup benar pada 0 dan 1 saja", 28, INK2).next_to(dua, DOWN, buff=0.2)
        self.play_at(b.at("kelonggaran"), FadeIn(sb), dur=0.5)
        self.r5 = VGroup(peta, sam, ck, jud2, lp, retak, xs, dua, sb)

    def beat_b6_6(self, b):
        jud = TB("hubungannya hanya berjalan satu arah", 36, INK).move_to(UP * 3.1)
        self.play_at(b.at("Hubungan"), FadeOut(self.r5), FadeIn(jud, shift=DOWN * 0.15), dur=0.7)
        a1 = TB("VP = VNP", 54, INK).move_to(LEFT * 4.3 + UP * 1.2)
        c1 = VGroup(TB("versi P = NP", 54, INK), T("versi sirkuit: P/poly = NP/poly", 24, INK2)).arrange(DOWN, buff=0.15).move_to(RIGHT * 3.9 + UP * 1.1)
        p1 = Arrow(a1.get_right(), [c1.get_left()[0], a1.get_center()[1], 0], buff=0.3, color=LEAN, stroke_width=8)
        ok = T("sudah diketahui", 24, LEAN).next_to(p1, UP, buff=0.1)
        self.play_at(b.at("Seandainya"), FadeIn(a1, shift=RIGHT * 0.2), dur=0.5)
        self.play_at(b.at("sebuah versi"), GrowArrow(p1), FadeIn(c1, shift=LEFT * 0.2), FadeIn(ok), dur=0.8)
        a2 = TB("VP ≠ VNP", 54, PRIMA).move_to(LEFT * 4.3 + DOWN * 1.6)
        c2 = TB("P vs NP", 54, INK).move_to(RIGHT * 3.9 + DOWN * 1.6)
        p2 = DashedLine(a2.get_right() + RIGHT * 0.3, c2.get_left() + LEFT * 0.3, color=DIM, stroke_width=7, dash_length=0.18).add_tip(tip_length=0.3)
        q = VGroup(Circle(radius=0.36, fill_color=NOL, fill_opacity=1, stroke_width=0), TB("?", 40, BG)); q.move_to(p2)
        no = T("belum ada jalan yang diketahui", 24, NOL).next_to(p2, DOWN, buff=0.45)
        self.play_at(b.at("Namun"), FadeIn(a2, shift=RIGHT * 0.2), dur=0.5)
        self.play_at(b.at("belum ada jalan"), Create(p2), FadeIn(q, scale=1.5), FadeIn(no), dur=0.8)
        self.play_at(b.at("menuju P versus NP"), FadeIn(c2, shift=LEFT * 0.2), dur=0.5)
        self.r6 = VGroup(jud, a1, c1, p1, ok, a2, c2, p2, q, no)

    def beat_b6_7(self, b):
        gunung = Polygon([-6.2, -3.2, 0], [-2.6, 2.9, 0], [-1.7, 1.6, 0], [-1.0, 2.2, 0], [1.6, -3.2, 0], fill_color="#1B2433", fill_opacity=1, stroke_color=INK2, stroke_width=4)
        salju = Polygon([-2.6, 2.9, 0], [-3.25, 1.8, 0], [-2.7, 2.05, 0], [-2.2, 1.7, 0], [-1.95, 1.95, 0], fill_color=INK, fill_opacity=0.9, stroke_width=0)
        l1 = VGroup(TB("P vs NP", 44, INK), TB("US$1.000.000", 34, PRIMA)).arrange(DOWN, buff=0.15).move_to([-2.4, -1.1, 0])
        bukit = Polygon([1.0, -3.2, 0], [3.9, -0.4, 0], [6.6, -3.2, 0], fill_color="#1D2B22", fill_opacity=1, stroke_color=LEAN, stroke_width=4)
        l2 = VGroup(TB("VP vs VNP", 34, LEAN), T("klaim, belum diperiksa ahli", 22, INK2)).arrange(DOWN, buff=0.1).move_to([3.9, -2.3, 0])
        tiang = Line([3.9, -0.4, 0], [3.9, 0.9, 0], color=INK, stroke_width=5)
        bend = DashedVMobject(Polygon([3.9, 0.9, 0], [4.9, 0.6, 0], [3.9, 0.3, 0], stroke_color=PRIMA, stroke_width=4), num_dashes=16)
        tanah = Line(LEFT * 7.2 + DOWN * 3.2, RIGHT * 7.2 + DOWN * 3.2, color=GARIS, stroke_width=4)
        self.play_at(b.at("Jadi"), FadeOut(self.r6), FadeIn(VGroup(tanah, gunung, salju, bukit, l2, tiang, bend), shift=UP * 0.3), dur=0.9)
        bb = TB("masih belum bertuan", 40, PRIMA).move_to([3.2, 2.6, 0])
        self.play_at(b.at("hadiah satu juta dolar"), FadeIn(l1, scale=1.1), dur=0.6)
        self.play_at(b.at("masih belum bertuan"), FadeIn(bb, shift=UP * 0.2), dur=0.6)
