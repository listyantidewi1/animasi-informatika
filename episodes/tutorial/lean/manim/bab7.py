from kit import *

POS = [LEFT * 5.2 + DOWN * 2.6, LEFT * 1.9 + DOWN * 2.6, RIGHT * 1.6 + DOWN * 2.6, RIGHT * 5.0 + DOWN * 2.6]


class Bab7(BabScene):
    SEG = 7

    def simpul(self, i, aktif=False):
        c = Circle(radius=0.36, fill_color=PRIMA if aktif else PANEL, fill_opacity=1, stroke_color=PRIMA, stroke_width=4).move_to(POS[i])
        return VGroup(c, TB(str(i + 1), 34, BG if aktif else PRIMA).move_to(c))

    def aktifkan(self, i):
        baru = self.simpul(i, True); lama = self.sp[i]; self.sp[i] = baru
        return [FadeOut(lama), FadeIn(baru, scale=1.2)]

    def beat_b7_1(self, b):
        jalan = Line(POS[0], POS[3], color=GARIS, stroke_width=8)
        self.sp = [self.simpul(i) for i in range(4)]
        jud = TB("Peta belajar Lean", 46, INK).to_edge(UP, buff=0.6)
        gratis = chip("semuanya gratis, tautan di deskripsi", LEAN, 28).next_to(jud, DOWN, buff=0.35)
        self.play_at(b.start + 0.3, FadeIn(jud), dur=0.5)
        self.play_at(b.at("ke mana setelah ini"), Create(jalan), LaggedStart(*[FadeIn(s) for s in self.sp], lag_ratio=0.2), dur=1.0)
        self.play_at(b.at("gratis"), FadeIn(gratis), dur=0.4)
        self.jud = jud; self.gratis = gratis; self.isi = None

    def tampil(self, t, i, m, extra=()):
        an = self.aktifkan(i) + [FadeIn(m, shift=UP * 0.15)] + ([FadeOut(self.isi)] if self.isi else []) + list(extra)
        self.play_at(t, *an, dur=0.6); self.isi = m

    def beat_b7_2(self, b):
        gbr = ImageMobject(os.path.join(D, "aset", "nng.png")); gbr.height = 3.5
        bk = SurroundingRectangle(gbr, color=GARIS, buff=0.04, stroke_width=3)
        jd = TB("Natural Number Game", 40, PRIMA); sub = T("permainan di browser:\nmembangun aritmetika dari nol,\nlevel demi level", 28, INK, line_spacing=0.9)
        al = kode("adam.math.hhu.de", 24, LEAN)
        teks = VGroup(jd, sub, al).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        Group(gbr, teks).arrange(RIGHT, buff=0.6).move_to(UP * 0.35); bk.move_to(gbr)
        self.play_at(b.at("Pos pertama"), *self.aktifkan(0), FadeOut(self.gratis), FadeOut(self.jud), dur=0.5)
        self.play_at(b.at("Natural Number Game"), FadeIn(gbr), FadeIn(bk), FadeIn(jd), dur=0.5)
        self.play_at(b.at("permainan di browser"), FadeIn(sub), FadeIn(al), dur=0.5)
        terbaik = chip("tempat terbaik untuk memulai", LEAN, 28).next_to(teks, DOWN, buff=0.3, aligned_edge=LEFT)
        self.play_at(b.at("tempat terbaik"), FadeIn(terbaik), dur=0.4)
        self.gbr = Group(gbr); self.isi = VGroup(bk, teks, terbaik)

    def buku(self, judul, warna, sub):
        k = RoundedRectangle(width=3.3, height=4.2, corner_radius=0.12, fill_color=PANEL, fill_opacity=1, stroke_color=warna, stroke_width=5)
        pg = Rectangle(width=0.22, height=4.2, fill_color=warna, fill_opacity=1, stroke_width=0).align_to(k, LEFT)
        t = TB(judul, 30, INK, line_spacing=0.9).move_to(k.get_center() + RIGHT * 0.1 + UP * 0.5)
        if t.width > 2.7: t.scale_to_fit_width(2.7)
        s = T(sub, 20, INK2).move_to(k.get_bottom() + UP * 0.5 + RIGHT * 0.1)
        return VGroup(k, pg, t, s)

    def beat_b7_3(self, b):
        bk = self.buku("Theorem\nProving\nin Lean 4", AI, "buku daring"); ket = T("dasar-dasarnya, berurutan;\nsetiap contoh bisa langsung\ndijalankan", 30, INK, line_spacing=0.9)
        g = VGroup(bk, ket).arrange(RIGHT, buff=0.8).move_to(UP * 0.35)
        self.play_at(b.at("Pos kedua"), *self.aktifkan(1), FadeOut(self.gbr), FadeOut(self.isi), FadeIn(bk), dur=0.6)
        self.play_at(b.at("menjelaskan dasar-dasarnya"), FadeIn(ket), dur=0.4)
        self.isi = g

    def beat_b7_4(self, b):
        b1 = self.buku("Mathematics\nin Lean", UNGU, "buku daring"); b2 = self.buku("Functional\nProgramming\nin Lean", ORANYE, "buku daring")
        l1 = T("kalau kamu suka matematika", 26, UNGU); l2 = T("kalau kamu suka pemrograman", 26, ORANYE)
        g1 = VGroup(l1, b1).arrange(DOWN, buff=0.25); g2 = VGroup(l2, b2).arrange(DOWN, buff=0.25)
        g = VGroup(g1, g2).arrange(RIGHT, buff=1.2).move_to(UP * 0.55).scale(0.92)
        self.play_at(b.at("Di pos ketiga"), *self.aktifkan(2), FadeOut(self.isi), dur=0.5)
        self.play_at(b.at("menyukai matematika"), FadeIn(g1), dur=0.5)
        self.play_at(b.at("lebih menyukai pemrograman"), FadeIn(g2), dur=0.5)
        self.isi = g

    def beat_b7_5(self, b):
        jd = TB("Lean Zulip", 48, PRIMA); sub = T("forum komunitas Lean", 30, INK2)
        def balon(s, w, kanan):
            t = T(s, 26, INK); k = RoundedRectangle(width=t.width + 0.6, height=t.height + 0.45, corner_radius=0.2, fill_color=PANEL, fill_opacity=1, stroke_color=w, stroke_width=3)
            return VGroup(k, t.move_to(k))
        q = balon("Pemula: kenapa bukti saya ditolak?", AI, False); a = balon("Coba baca goal-nya dulu, lalu pakai rw.", LEAN, True)
        a.next_to(q, DOWN, buff=0.3).shift(RIGHT * 1.2)
        g = VGroup(VGroup(jd, sub).arrange(DOWN, buff=0.2), VGroup(q, a)).arrange(DOWN, buff=0.5).move_to(UP * 0.5)
        self.play_at(b.at("Pos keempat"), *self.aktifkan(3), FadeOut(self.isi), FadeIn(g[0]), dur=0.6)
        self.play_at(b.at("pemula bebas bertanya"), FadeIn(q, shift=RIGHT * 0.2), dur=0.4)
        self.play_at(b.at("yang menjawab"), FadeIn(a, shift=LEFT * 0.2), dur=0.4)
        self.isi = g

    def beat_b7_6(self, b):
        t = VGroup(TB("20 menit", 96, PRIMA), T("setiap hari", 44, INK)).arrange(DOWN, buff=0.25).move_to(UP * 0.7)
        self.play_at(b.at("luangkan"), FadeOut(self.isi), FadeIn(t, scale=0.9), dur=0.6)
        pn = Arrow(POS[0] + UP * 1.6, POS[0] + UP * 0.5, buff=0, color=LEAN, stroke_width=8); mu = TB("mulai di sini", 30, LEAN).next_to(pn, UP, buff=0.15)
        self.play_at(b.at("mulailah dari permainan"), GrowArrow(pn), FadeIn(mu), Indicate(self.sp[0], color=LEAN), dur=0.6)
