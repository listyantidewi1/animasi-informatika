from kit import *

HURUF = [["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"]]
# (kolom yang dipilih di baris 0,1,2), tanda pada determinan
PERM = [((0, 1, 2), +1), ((0, 2, 1), -1), ((1, 0, 2), -1), ((1, 2, 0), +1), ((2, 0, 1), +1), ((2, 1, 0), -1)]


def suku(tanda_det=True, size=32, pisah=True):
    """Daftar suku: VGroup berisi (tanda, hasil kali) per permutasi."""
    g = VGroup()
    for p, s in PERM:
        sg = "+" if (s > 0 or not tanda_det) else "−"
        t = TB(sg, size, LEAN if sg == "+" else NOL)
        h = T("".join(HURUF[r][p[r]] for r in range(3)), size, INK)
        g.add(VGroup(t, h).arrange(RIGHT, buff=0.1))
    if pisah:
        VGroup(VGroup(*g[:3]).arrange(RIGHT, buff=0.3), VGroup(*g[3:]).arrange(RIGHT, buff=0.3)).arrange(DOWN, buff=0.22)
    else:
        g.arrange(RIGHT, buff=0.28)
    return g


def kisi(n=20, sisi=3.0):
    kot = Square(side_length=sisi, stroke_color=INK2, stroke_width=3, fill_color=PANEL, fill_opacity=1)
    gr = VGroup(*[Line([-sisi / 2 + i * sisi / n, -sisi / 2, 0], [-sisi / 2 + i * sisi / n, sisi / 2, 0], color=GARIS, stroke_width=1) for i in range(1, n)],
                *[Line([-sisi / 2, -sisi / 2 + i * sisi / n, 0], [sisi / 2, -sisi / 2 + i * sisi / n, 0], color=GARIS, stroke_width=1) for i in range(1, n)])
    return VGroup(kot, gr)


def simpul(teks, warna=INK, r=0.42, size=34):
    c = Circle(radius=r, stroke_color=warna, stroke_width=4, fill_color=PANEL, fill_opacity=1)
    return VGroup(c, TB(teks, size, warna).move_to(c))


class Bab2(BabScene):
    SEG = 2

    def beat_b2_1(self, b):
        th = TB("1979", 170, INK).move_to(UP * 0.7)
        nm = TB("Leslie Valiant", 60, PRIMA).next_to(th, DOWN, buff=0.4)
        ket = T("ilmuwan komputer", 32, INK2).next_to(nm, DOWN, buff=0.2)
        self.play_at(b.at("seribu sembilan ratus"), FadeIn(th, scale=1.15), dur=0.7)
        self.play_at(b.at("Leslie Valiant"), FadeIn(nm, shift=UP * 0.2), FadeIn(ket), dur=0.6)
        self.r1 = VGroup(th, nm, ket)

    def beat_b2_2(self, b):
        badan = RoundedRectangle(width=3.6, height=5.0, corner_radius=0.3, fill_color=PANEL, fill_opacity=1, stroke_color=GARIS, stroke_width=3).move_to(LEFT * 4.6)
        layar = RoundedRectangle(width=3.0, height=1.1, corner_radius=0.12, fill_color="#0B0F15", fill_opacity=1, stroke_color=GARIS, stroke_width=2).move_to(badan.get_top() + DOWN * 1.0)
        tp = RoundedRectangle(width=1.3, height=1.3, corner_radius=0.2, fill_color="#14261D", fill_opacity=1, stroke_color=LEAN, stroke_width=4).move_to(badan.get_center() + LEFT * 0.8 + DOWN * 0.9)
        tk = RoundedRectangle(width=1.3, height=1.3, corner_radius=0.2, fill_color="#2A2414", fill_opacity=1, stroke_color=PRIMA, stroke_width=4).move_to(badan.get_center() + RIGHT * 0.8 + DOWN * 0.9)
        lp = TB("+", 80, LEAN).move_to(tp); lk = TB("×", 80, PRIMA).move_to(tk)
        self.kal = VGroup(badan, layar, tp, tk, lp, lk); self.layar = layar; self.tp = VGroup(tp, lp); self.tk = VGroup(tk, lk)
        self.play_at(b.at("Bayangkan"), FadeOut(self.r1), FadeIn(VGroup(badan, layar), shift=UP * 0.3), dur=0.8)
        self.play_at(b.at("dua tombol"), FadeIn(self.tp, scale=0.7), FadeIn(self.tk, scale=0.7), dur=0.5)
        self.play_at(b.at("tambah"), Indicate(self.tp, color=LEAN, scale_factor=1.15), dur=0.5)
        self.play_at(b.at("kali"), Indicate(self.tk, color=PRIMA, scale_factor=1.15), dur=0.5)

    def beat_b2_3(self, b):
        rumus = TB("x² + 2xy + y²", 50, INK).move_to(RIGHT * 2.3 + UP * 3.0)
        lr = T("rumus yang ingin dihitung", 24, INK2).next_to(rumus, UP, buff=0.15)
        self.play_at(b.at("menghitung sebuah rumus"), FadeIn(rumus, shift=DOWN * 0.2), FadeIn(lr), dur=0.6)
        x = simpul("x").move_to(RIGHT * 0.8 + DOWN * 2.0); y = simpul("y").move_to(RIGHT * 3.8 + DOWN * 2.0)
        plus = simpul("+", LEAN).move_to(RIGHT * 2.3 + DOWN * 0.6); kali = simpul("×", PRIMA).move_to(RIGHT * 2.3 + UP * 0.8)
        e1 = Line(x.get_top(), plus.get_bottom() + LEFT * 0.2, color=INK2, stroke_width=4); e2 = Line(y.get_top(), plus.get_bottom() + RIGHT * 0.2, color=INK2, stroke_width=4)
        e3 = ArcBetweenPoints(plus.get_top() + LEFT * 0.15, kali.get_bottom() + LEFT * 0.15, angle=-0.9, color=INK2, stroke_width=4)
        e4 = ArcBetweenPoints(plus.get_top() + RIGHT * 0.15, kali.get_bottom() + RIGHT * 0.15, angle=0.9, color=INK2, stroke_width=4)
        l1 = T("x + y", 26, LEAN).next_to(plus, LEFT, buff=0.3); l2 = T("(x + y) × (x + y)", 26, PRIMA).next_to(kali, LEFT, buff=0.3)
        n = ValueTracker(0)
        ctr = always_redraw(lambda: VGroup(T("langkah", 26, INK2), TB(str(int(round(n.get_value()))), 64, INK)).arrange(DOWN, buff=0.08).move_to(RIGHT * 6.15 + UP * 0.3))
        self.play_at(b.at("menekan tombol"), FadeIn(x), FadeIn(y), FadeIn(ctr), dur=0.5)
        self.play_at(b.at("sesedikit mungkin"), Indicate(self.tp, color=LEAN), Create(e1), Create(e2), FadeIn(plus, scale=0.6), FadeIn(l1), n.animate.set_value(1), dur=0.8)
        self.play(Indicate(self.tk, color=PRIMA), Create(e3), Create(e4), FadeIn(kali, scale=0.6), FadeIn(l2), n.animate.set_value(2), run_time=0.8)
        ctr.clear_updaters()
        sir = VGroup(x, y, plus, kali, e1, e2, e3, e4)
        kur = SurroundingRectangle(VGroup(sir, l2, Dot(RIGHT * 2.3 + DOWN * 3.0), Dot(RIGHT * 4.75 + DOWN * 2.0)), color=AI, buff=0.22, corner_radius=0.2, stroke_width=3)
        ls = TB("sirkuit aritmetika", 30, AI).next_to(kur, DOWN, buff=0.12)
        self.play_at(b.at("sirkuit aritmetika"), Create(kur), FadeIn(ls), dur=0.7)
        lu = T("ukuran sirkuit", 21, PRIMA).next_to(ctr, DOWN, buff=0.15)
        self.play_at(b.at("ukuran sirkuit"), FadeIn(lu), Indicate(ctr, color=PRIMA), dur=0.6)
        self.sir = sir; self.x, self.y, self.kali = x, y, kali
        self.r3 = VGroup(rumus, lr, l1, l2, ctr, kur, ls, lu, sir)

    def beat_b2_4(self, b):
        syarat = TB("harus benar untuk bilangan apa pun", 32, ORANYE).move_to(RIGHT * 2.3 + UP * 2.3)
        self.play_at(b.at("syarat yang berat"), FadeOut(self.r3[1]), self.r3[0].animate.shift(UP * 0.25), FadeIn(syarat, shift=UP * 0.2), dur=0.6)
        coba = [("3", "4", "49"), ("−2", "7", "25"), ("0,5", "1,5", "4"), ("120", "−20", "10.000")]
        t0 = b.at("untuk bilangan apa pun"); akhir = b.at("bukan hanya"); per = max(0.7, (akhir - t0) / len(coba)); lama = None
        for i, (vx, vy, h) in enumerate(coba):
            ax = TB("x = " + vx, 26, AI).next_to(self.x, DOWN, buff=0.12); ay = TB("y = " + vy, 26, AI).next_to(self.y, DOWN, buff=0.12)
            out = TB(h, 40, INK).move_to(self.layar)
            ck = centang(0.26).next_to(self.kali, RIGHT, buff=0.25)
            baru = VGroup(ax, ay, out, ck)
            an = [FadeIn(ax, shift=UP * 0.15), FadeIn(ay, shift=UP * 0.15)] + ([FadeOut(lama)] if lama else [])
            self.play_at(t0 + i * per, *an, dur=per * 0.3)
            self.play(FadeIn(out, scale=1.2), FadeIn(ck, scale=1.5), run_time=per * 0.3)
            lama = baru
        bukan = T("bukan hanya untuk bilangan tertentu", 26, INK2).next_to(syarat, DOWN, buff=0.12)
        self.play_at(akhir, FadeIn(bukan), dur=0.5)
        self.r4 = VGroup(self.r3[0], self.r3[2:], syarat, lama, bukan, self.kal)

    def beat_b2_5(self, b):
        m = matriks(HURUF, 1.0, INK, 40).move_to(ORIGIN)
        lab = T("matriks", 34, INK2).next_to(m, DOWN, buff=0.3)
        self.play_at(b.at("Sekarang"), FadeOut(self.r4), dur=0.5)
        self.play_at(b.at("tabel bilangan"), FadeIn(m, lag_ratio=0.05), dur=0.8)
        self.play_at(b.at("matriks"), FadeIn(lab, shift=UP * 0.15), dur=0.4)
        m2 = m.copy()
        self.play_at(b.at("dua rumus"), FadeOut(lab), m.animate.move_to(LEFT * 3.6 + UP * 1.1), m2.animate.move_to(RIGHT * 3.6 + UP * 1.1), dur=0.9)
        mirip = T("≈", 90, DIM).move_to(UP * 1.1)
        self.play_at(b.at("hampir sama"), FadeIn(mirip), dur=0.4)
        self.m1, self.m2, self.mirip = m, m2, mirip

    def _pilih(self, m, p, warna):
        return VGroup(*[SurroundingRectangle(m[0][r * 3 + p[r]], color=warna, buff=-0.04, stroke_width=6) for r in range(3)])

    def beat_b2_6(self, b):
        m = self.m1
        nama = TB("determinan", 44, AI).next_to(m, UP, buff=0.3)
        self.play_at(b.at("determinan"), FadeIn(nama, shift=DOWN * 0.2), dur=0.5)
        sk = suku(True, 40).next_to(m, DOWN, buff=0.45)
        netral = VGroup(*[s[0].copy().set_color(INK2) for s in sk])
        for s in sk: s[0].set_opacity(0)
        sel = self._pilih(m, PERM[0][0], PRIMA)
        self.play_at(b.at("memilih satu bilangan"), Create(sel), dur=0.8)
        self.play_at(b.at("mengalikannya"), FadeIn(sk[0][1], shift=DOWN * 0.2), dur=0.5)
        t0 = b.at("menjumlahkan"); t1 = b.at("sebagian dengan tanda tambah"); per = max(0.35, (t1 - t0 - 0.2) / 5)
        self.until(t0)
        for i in range(1, 6):
            baru = self._pilih(m, PERM[i][0], PRIMA)
            self.play(ReplacementTransform(sel, baru), FadeIn(sk[i][1], shift=DOWN * 0.2), run_time=per * 0.9); sel = baru
            self.wait(per * 0.1)
        plus = [i for i, (p, s) in enumerate(PERM) if s > 0]; minus = [i for i, (p, s) in enumerate(PERM) if s < 0]
        self.play_at(t1, FadeOut(sel), *[sk[i][0].animate.set_opacity(1) for i in plus], dur=0.6)
        self.play_at(b.at("tanda kurang"), *[sk[i][0].animate.set_opacity(1) for i in minus], dur=0.6)
        self.sk1 = sk; self.nama1 = nama

    def beat_b2_7(self, b):
        m = self.m2
        nama = TB("permanen", 44, ORANYE).next_to(m, UP, buff=0.3)
        self.play_at(b.at("permanen"), FadeIn(nama, shift=DOWN * 0.2), dur=0.5)
        sk = suku(False, 40).next_to(m, DOWN, buff=0.45)
        self.play_at(b.at("sama persis"), LaggedStart(*[FadeIn(s[1], shift=DOWN * 0.2) for s in sk], lag_ratio=0.12), dur=1.0)
        self.play_at(b.at("semua tandanya"), LaggedStart(*[FadeIn(s[0], scale=1.6) for s in sk], lag_ratio=0.1), dur=0.9)
        self.sk2 = sk; self.nama2 = nama

    def beat_b2_8(self, b):
        k1 = kisi().move_to(self.m1); k2 = kisi().move_to(self.m2)
        u1 = T("20 × 20", 30, INK2).next_to(k1, DOWN, buff=0.2); u2 = T("20 × 20", 30, INK2).next_to(k2, DOWN, buff=0.2)
        self.play_at(b.at("dua puluh kali dua puluh"), FadeOut(self.sk1), FadeOut(self.sk2), FadeOut(self.mirip), FadeOut(self.m1), FadeOut(self.m2), FadeIn(k1), FadeIn(k2), FadeIn(u1), FadeIn(u2), dur=0.9)
        ang = TB("2.432.902.008.176.640.000", 60, PRIMA).move_to(DOWN * 2.1)
        ket = T("suku yang dijumlahkan, pada masing-masing rumus", 30, INK2).next_to(ang, DOWN, buff=0.25)
        self.play_at(b.at("sekitar dua koma empat"), FadeIn(ang, scale=1.1), FadeIn(ket), dur=0.8)
        self.k = VGroup(k1, k2, u1, u2); self.ang = VGroup(ang, ket)

    def beat_b2_9(self, b):
        atas = VGroup(self.k, self.nama1, self.nama2)
        self.play_at(b.at("Anehnya"), FadeOut(self.ang), atas.animate.scale(0.42).to_edge(UP, buff=0.2), dur=0.8)
        ax = Axes(x_range=[0, 24, 4], y_range=[0, 20000, 5000], x_length=9.6, y_length=3.8, tips=False,
                  axis_config={"color": INK2, "stroke_width": 3, "include_ticks": True, "tick_size": 0.06}).move_to(DOWN * 0.95 + LEFT * 0.4)
        lx = T("ukuran tabel", 24, INK2).next_to(ax.x_axis, DOWN, buff=0.2); ly = T("jumlah langkah", 24, INK2).next_to(ax.y_axis, UP, buff=0.15)
        ang = VGroup(*[T(str(v), 20, DIM).next_to(ax.c2p(v, 0), DOWN, buff=0.1) for v in (4, 8, 12, 16, 20)])
        lx.shift(DOWN * 0.28)
        self.play_at(b.at("jalan pintas"), Create(ax), FadeIn(lx), FadeIn(ly), FadeIn(ang), dur=0.8)
        det = ax.plot(lambda m: m ** 3, x_range=[0, 24], color=AI, stroke_width=6)
        self.play_at(b.at("komputer bisa menghitungnya"), Create(det), dur=1.4)
        tt = Dot(ax.c2p(20, 8000), color=AI, radius=0.1)
        ld = VGroup(TB("determinan", 28, AI), T("beberapa ribu langkah", 26, INK)).arrange(DOWN, buff=0.08).next_to(tt, DOWN, buff=0.2).shift(RIGHT * 0.9)
        self.play_at(b.at("beberapa ribu"), FadeIn(tt, scale=2), FadeIn(ld, shift=UP * 0.15), dur=0.6)
        self.ax = ax; self.plot = VGroup(ax, lx, ly, ang, det, tt, ld)

    def beat_b2_10(self, b):
        ax = self.ax
        per = ax.plot(lambda m: m * 2 ** m, x_range=[0, 10.95], color=ORANYE, stroke_width=6)
        self.play_at(b.at("Cara terbaik"), Create(per, rate_func=rate_functions.ease_in_quad), dur=1.6)
        lp = VGroup(TB("permanen", 28, ORANYE), T("melesat keluar layar", 26, INK)).arrange(DOWN, buff=0.08).next_to(ax.c2p(10.9, 17500), RIGHT, buff=0.35)
        self.play_at(b.at("berlipat"), FadeIn(lp, shift=UP * 0.15), dur=0.5)
        pn = Arrow(ax.c2p(10.9, 19000), ax.c2p(11.3, 23800), buff=0, color=ORANYE, stroke_width=6)
        self.play_at(b.at("sangat cepat"), GrowArrow(pn), dur=0.5)
        self.plot.add(per, lp, pn)

    def beat_b2_11(self, b):
        d = VGroup(TB("determinan", 34, AI), suku(True, 40, False)).arrange(DOWN, buff=0.25)
        p = VGroup(TB("permanen", 34, ORANYE), suku(False, 40, False)).arrange(DOWN, buff=0.25)
        g = VGroup(d, p).arrange(DOWN, buff=0.9).move_to(DOWN * 0.3)
        self.play_at(b.at("Padahal"), FadeOut(self.plot), FadeOut(VGroup(self.k, self.nama1, self.nama2)), FadeIn(g, shift=UP * 0.2), dur=0.9)
        kot = VGroup(*[SurroundingRectangle(VGroup(d[1][i][0], p[1][i][0]), color=PRIMA, buff=0.12, stroke_width=4, corner_radius=0.1) for i in range(6) if PERM[i][1] < 0])
        self.play_at(b.at("tanda tambah"), *[Indicate(s[0], scale_factor=1.5, color=LEAN) for s in p[1]], dur=0.7)
        self.play_at(b.at("tanda kurang"), Create(kot), dur=0.7)
