from kit import *
from bab0 import halaman_judul


def pangkat(basis, eks, size=40, warna=INK, warna_eks=None):
    """Tulisan berpangkat dari Text (tanpa LaTeX)."""
    a = TB(basis, size, warna); e = TB(eks, int(size * 0.55), warna_eks or warna)
    e.next_to(a.get_corner(UR), RIGHT, buff=0.04).shift(UP * a.height * 0.18)
    return VGroup(a, e)


class Bab4(BabScene):
    SEG = 4

    def beat_b4_1(self, b):
        tgl = TB("±23 November 2026", 60, INK).move_to(UP * 2.9)
        self.play_at(b.at("dua puluh tiga November"), FadeIn(tgl, shift=DOWN * 0.2), dur=0.6)
        g = Line(LEFT * 3.2, RIGHT * 3.2, color=INK2, stroke_width=4).move_to(UP * 1.5)
        d1 = Dot(g.get_left(), color=AI, radius=0.13); d2 = Dot(g.get_right(), color=PRIMA, radius=0.13)
        l1 = VGroup(TB("20 Nov", 28, AI), T("klaim bukti Hipotesis Riemann", 24, INK2)).arrange(DOWN, buff=0.08).next_to(d1, DOWN, buff=0.2)
        l2 = VGroup(TB("23 Nov", 28, PRIMA), T("folder baru", 24, INK2)).arrange(DOWN, buff=0.08).next_to(d2, DOWN, buff=0.2)
        tiga = T("3 hari", 26, INK).next_to(g, UP, buff=0.12)
        self.play_at(b.at("tiga hari setelah"), FadeIn(d1), FadeIn(l1), Create(g), FadeIn(tiga), dur=0.9)
        self.play(FadeIn(d2, scale=1.5), FadeIn(l2[0]), run_time=0.4)
        win = jendela("github.com/anthropics/formal-math", 8.6, 3.3).move_to(DOWN * 1.9)
        nama = ["zeta23/", "3sum-apsp/", "eth/", "vp-vnp/"]
        baris = VGroup()
        for i, n in enumerate(nama):
            ik = RoundedRectangle(width=0.42, height=0.3, corner_radius=0.05, fill_color=PRIMA if i == 3 else DIM, fill_opacity=1, stroke_width=0)
            baris.add(VGroup(ik, kode(n, 26, INK if i == 3 else INK2)).arrange(RIGHT, buff=0.25))
        baris.arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to(win[0]).shift(DOWN * 0.2 + LEFT * 2.2)
        self.play_at(b.at("sebuah folder baru"), tgl.animate.scale(0.6).to_edge(UP, buff=0.25), VGroup(g, d1, d2, l1, l2[0], tiga).animate.shift(UP * 0.55), FadeIn(win), FadeIn(baris[:3]), dur=0.8)
        l2[1].shift(UP * 0.55)
        sorot = SurroundingRectangle(baris[3], color=PRIMA, buff=0.14, stroke_width=4, corner_radius=0.08)
        baru = chip("baru", PRIMA, 24).next_to(sorot, RIGHT, buff=0.3)
        self.play_at(b.at("muncul"), FadeIn(baris[3], shift=RIGHT * 0.3), Create(sorot), FadeIn(baru), FadeIn(l2[1]), dur=0.7)
        self.r1 = VGroup(tgl, g, d1, d2, l1, l2, tiga, win, baris, sorot, baru)

    def beat_b4_2(self, b):
        hal = halaman_judul().move_to(LEFT * 3.6)
        self.play_at(b.at("Isinya"), FadeOut(self.r1), FadeIn(hal, shift=UP * 0.3), dur=0.8)
        jd = VGroup(T("judul makalah:", 28, INK2), TB("“VP ≠ VNP di setiap field”", 42, INK)).arrange(DOWN, buff=0.18, aligned_edge=LEFT).move_to(RIGHT * 3.3 + UP * 1.6)
        self.play_at(b.at("makalah berjudul"), FadeIn(jd, shift=UP * 0.15), dur=0.6)
        kot = SurroundingRectangle(hal.pen, color=PRIMA, buff=0.14, stroke_width=5, corner_radius=0.08)
        pn = VGroup(T("kolom penulis:", 28, INK2), TB("Claude", 64, PRIMA), T("hanya satu nama", 28, INK2)).arrange(DOWN, buff=0.16, aligned_edge=LEFT).move_to(RIGHT * 3.3 + DOWN * 1.2).align_to(jd, LEFT)
        self.play_at(b.at("Di kolom penulis"), Create(kot), FadeIn(pn[0]), dur=0.6)
        self.play_at(b.at("yaitu Claude"), FadeIn(pn[1], scale=1.2), FadeIn(pn[2]), dur=0.6)
        self.r2 = VGroup(hal, jd, kot, pn)

    def beat_b4_3(self, b):
        win = jendela("README.md  ·  github.com/anthropics/formal-math/vp-vnp", 12.6, 5.6).move_to(UP * 0.2)
        e1 = T("“The result was discovered by an internal research Claude model.”", 28, INK2, slant=ITALIC)
        i1 = TB("Hasil ini ditemukan oleh sebuah model Claude riset internal.", 34, INK)
        e2 = T("“Both were written by AI models …”", 28, INK2, slant=ITALIC)
        c1 = chip("makalah: ditulis model AI", AI, 30); c2 = chip("bukti Lean: ditulis model AI", AI, 30)
        g = VGroup(e1, i1, e2, VGroup(c1, c2).arrange(RIGHT, buff=0.4)).arrange(DOWN, buff=0.42).move_to(win[0]).shift(DOWN * 0.15)
        if g.width > 11.8: g.scale_to_fit_width(11.8)
        st = status_chip().to_edge(DOWN, buff=0.22)
        self.play_at(b.at("Menurut keterangannya"), FadeOut(self.r2), FadeIn(win, scale=0.96), dur=0.8)
        self.play_at(b.at("hasil ini ditemukan"), FadeIn(e1), FadeIn(i1, shift=UP * 0.15), dur=0.7)
        self.play_at(b.at("baik makalah"), FadeIn(e2), FadeIn(c1, shift=UP * 0.15), dur=0.6)
        self.play_at(b.at("buktinya"), FadeIn(c2, shift=UP * 0.15), FadeIn(st), dur=0.6)
        self.r3 = VGroup(win, g, st)

    def beat_b4_4(self, b):
        jud = T("isi klaimnya", 30, INK2).move_to(UP * 3.2)
        self.play_at(b.at("Klaimnya begini"), FadeOut(self.r3), FadeIn(jud), dur=0.6)
        kiri = VGroup(T("jumlah langkah", 34, INK), T("untuk permanen", 34, ORANYE)).arrange(DOWN, buff=0.1)
        lb = TB(">", 90, INK)
        m = TB("m", 130, PRIMA)
        eks = VGroup(TB("c · (log m)", 44, PRIMA), TB("1/3", 26, PRIMA))
        eks[1].next_to(eks[0].get_corner(UR), RIGHT, buff=0.03).shift(UP * 0.12)
        eks.next_to(m.get_corner(UR), RIGHT, buff=0.08).shift(UP * 0.3)
        kanan = VGroup(m, eks)
        rumus = VGroup(kiri, lb, kanan).arrange(RIGHT, buff=0.55).move_to(UP * 0.9)
        lm = T("m = ukuran tabel", 28, INK2).next_to(m, DOWN, buff=0.35)
        self.play_at(b.at("Untuk tabel"), FadeIn(lm), FadeIn(m, scale=0.8), dur=0.6)
        self.play_at(b.at("setiap sirkuit"), FadeIn(kiri, shift=RIGHT * 0.2), dur=0.6)
        self.play_at(b.at("pasti membutuhkan"), FadeIn(lb, scale=1.4), FadeIn(eks, shift=UP * 0.15), dur=0.7)
        kot = SurroundingRectangle(eks, color=ORANYE, buff=0.14, stroke_width=4, corner_radius=0.1)
        kt = VGroup(TB("pangkatnya ikut membesar bersama ukuran tabel", 32, ORANYE), T("jadi lebih cepat daripada pangkat tetap mana pun", 30, INK)).arrange(DOWN, buff=0.15).move_to(DOWN * 2.0)
        self.play_at(b.at("tumbuh lebih cepat"), Create(kot), FadeIn(kt[0], shift=UP * 0.15), dur=0.7)
        self.play_at(b.at("pangkat tetap mana pun"), FadeIn(kt[1], shift=UP * 0.15), dur=0.6)
        self.rumus = VGroup(rumus, kot); self.r4 = VGroup(jud, lm, kt)

    def beat_b4_5(self, b):
        ax = Axes(x_range=[0, 10, 10], y_range=[0, 26, 26], x_length=9.4, y_length=5.0, tips=True,
                  axis_config={"color": INK2, "stroke_width": 3, "include_ticks": False, "tip_width": 0.2, "tip_height": 0.2}).move_to(DOWN * 0.75 + LEFT * 1.3)
        lx = T("ukuran tabel (m)", 24, INK2).next_to(ax.x_axis, DOWN, buff=0.15); ly = T("jumlah langkah", 24, INK2).next_to(ax.y_axis.get_top(), RIGHT, buff=0.25)
        cat = T("ilustrasi, tidak berskala", 20, DIM).to_corner(DR, buff=0.25)
        self.play_at(b.start + 0.02, FadeOut(self.r4), self.rumus.animate.scale(0.42).to_corner(UR, buff=0.3), FadeIn(ax), FadeIn(lx), FadeIn(ly), FadeIn(cat), dur=0.42)
        f = lambda x: 0.16 * x ** 2.2
        data = [(0.5, "2", "Pangkat dua", 2.57), (1.2, "100", "pangkat seratus", 5.36), (2.2, "1.000.000", "pangkat sejuta", 8.9)]
        x_lalu = 0; semua = VGroup()
        for i, (k, e, kata, xs) in enumerate(data):
            gr = ax.plot(lambda x, k=k: k * x, x_range=[0, 10], color=INK2, stroke_width=4)
            lab = pangkat("m", e, 34, INK2).next_to(ax.c2p(10, k * 10), RIGHT, buff=0.2)
            t = b.at(kata); nxt = b.at(data[i + 1][2]) if i < 2 else b.at("terlampaui")
            self.play_at(t, Create(gr), FadeIn(lab), dur=0.4)
            x_akhir = xs + 0.9 if i < 2 else 10
            ku = ax.plot(f, x_range=[x_lalu, min(10, x_akhir)], color=ORANYE, stroke_width=7)
            tt = Dot(ax.c2p(xs, f(xs)), color=ORANYE, radius=0.12)
            ts = t + 0.45 if i < 2 else b.at("terlampaui")
            self.play_at(max(ts, self.now), Create(ku, rate_func=linear), dur=0.45)
            self.play(Flash(tt, color=ORANYE, flash_radius=0.35), FadeIn(tt, scale=2), lab.animate.set_opacity(0.45), gr.animate.set_stroke(opacity=0.45), run_time=0.25)
            x_lalu = min(10, x_akhir); semua.add(gr, lab, ku, tt)
        lk = TB("klaim baru", 30, ORANYE).next_to(ax.c2p(10, f(10)), UP, buff=0.15)
        self.play(FadeIn(lk), run_time=0.4)
        self.r5 = VGroup(ax, lx, ly, cat, semua, lk, self.rumus)

    def beat_b4_6(self, b):
        k = T("kalau klaim ini benar:", 34, INK2).move_to(UP * 2.6)
        self.play_at(b.at("Kalau klaim ini benar"), FadeOut(self.r5), FadeIn(k), dur=0.6)
        jp = VGroup(T("jalan pintas untuk permanen", 40, INK), silang(0.34)).arrange(RIGHT, buff=0.4).move_to(UP * 1.3)
        self.play_at(b.at("jalan pintas"), FadeIn(jp[0], shift=UP * 0.15), dur=0.5)
        self.play_at(b.at("mustahil"), FadeIn(jp[1], scale=1.8), dur=0.4)
        vv = TB("VP ≠ VNP", 130, PRIMA).move_to(DOWN * 0.6)
        tv = T("tebakan Valiant, 1979", 34, INK2).next_to(vv, DOWN, buff=0.3)
        self.play_at(b.at("tebakan Valiant"), FadeIn(vv, scale=1.1), FadeIn(tv), dur=0.7)
        st = status_chip().to_edge(DOWN, buff=0.3)
        self.play_at(b.at("terbukti"), FadeIn(st, shift=UP * 0.15), dur=0.5)
        self.r6 = VGroup(k, jp, vv, tv, st)

    def beat_b4_7(self, b):
        g = Arrow(LEFT * 6.4, RIGHT * 6.6, buff=0, color=INK2, stroke_width=4, max_tip_length_to_length_ratio=0.02).move_to(DOWN * 0.2)
        lg = T("jumlah langkah untuk menghitung permanen", 26, INK2).next_to(g, DOWN, buff=1.9)
        self.play_at(b.at("Makalah itu sendiri"), FadeOut(self.r6), GrowArrow(g), FadeIn(lg), dur=0.8)

        def tanda(x, warna, baris, atas=True):
            d = Dot(g.get_left() + RIGHT * x, color=warna, radius=0.15)
            t = VGroup(*[(TB if i == 0 else T)(s, 28 if i == 0 else 24, warna if i == 0 else INK2) for i, s in enumerate(baris)]).arrange(DOWN, buff=0.08).next_to(d, UP if atas else DOWN, buff=0.3)
            return VGroup(d, t)
        t1 = tanda(1.3, DIM, ["batas lama", "yang sudah terbukti"], False)
        t2 = tanda(4.0, ORANYE, ["batas baru", "menurut klaim ini"])
        t3 = tanda(11.6, AI, ["cara terbaik", "yang kita punya"])
        t1[1][0].set_color(INK2)
        self.play_at(b.at("batasnya"), FadeIn(t1, shift=UP * 0.15), FadeIn(t2, shift=DOWN * 0.15), dur=0.7)
        self.play_at(b.at("cara terbaik"), FadeIn(t3, shift=DOWN * 0.15), dur=0.6)
        dp = DoubleArrow(t2[0].get_center() + DOWN * 0.75, t3[0].get_center() + DOWN * 0.75, buff=0.1, color=PRIMA, stroke_width=5, max_tip_length_to_length_ratio=0.03)
        ld = TB("masih banyak ruang", 34, PRIMA).next_to(dp, DOWN, buff=0.15)
        self.play_at(b.at("masih banyak ruang"), GrowFromCenter(dp), FadeIn(ld), dur=0.7)
        cat = T("ilustrasi, tidak berskala", 20, DIM).to_corner(DR, buff=0.25)
        self.add(cat)
        self.r7 = VGroup(g, lg, t1, t2, t3, dp, ld, cat)

    def beat_b4_8(self, b):
        tp = tumpukan(38).move_to(LEFT * 4.4 + UP * 0.55)
        lab = VGroup(TB("70", 80, INK), T("halaman", 32, INK2)).arrange(DOWN, buff=0.08).next_to(tp, DOWN, buff=0.3)
        self.play_at(b.at("Namun"), FadeOut(self.r7), dur=0.5)
        pt = TB("Pertanyaan yang jauh lebih mendesak", 40, PRIMA).move_to(UP * 3.3)
        self.play_at(b.at("pertanyaan"), FadeIn(pt, shift=DOWN * 0.15), dur=0.5)
        self.play_at(b.at("Bukti setebal itu"), LaggedStart(*[FadeIn(h, shift=DOWN * 0.6) for h in tp], lag_ratio=0.03), FadeIn(lab), dur=1.0, sebelum=b.at("ditulis oleh mesin"))
        c = chip("ditulis oleh mesin", AI, 32).move_to(RIGHT * 2.6 + UP * 2.0)
        self.play_at(b.at("ditulis oleh mesin"), FadeIn(c, shift=UP * 0.15), dur=0.5)
        s = stempel("Diperiksa oleh", kosong=True, size=44).move_to(RIGHT * 2.6 + UP * 0.1)
        q = TB("?", 130, PRIMA).next_to(s, DOWN, buff=0.35)
        self.play_at(b.at("siapa yang memeriksanya"), FadeIn(s, scale=1.3), FadeIn(q, scale=0.6), dur=0.7)
