from kit import *


class Bab2(BabScene):
    SEG = 2

    def beat_b2_1(self, b):
        k1 = kartu_teks("Bahasa pemrograman", "seperti Python atau JavaScript", 5.4, 1.8, AI, 34).move_to(LEFT * 3.6 + DOWN * 0.6)
        k2 = kartu_teks("Pemeriksa bukti", "untuk matematika", 5.4, 1.8, PRIMA, 34).move_to(RIGHT * 3.6 + DOWN * 0.6)
        nama = TB("LEAN", 120, LEAN).move_to(UP * 2.0)
        g1 = Line(nama.get_bottom() + LEFT * 0.6, k1.get_top(), color=GARIS, stroke_width=5); g2 = Line(nama.get_bottom() + RIGHT * 0.6, k2.get_top(), color=GARIS, stroke_width=5)
        self.play_at(b.at("Lean adalah dua hal"), FadeIn(nama, scale=0.8), dur=0.5)
        self.play_at(b.at("bahasa pemrograman"), Create(g1), FadeIn(k1, shift=DOWN * 0.2), dur=0.5)
        self.play_at(b.at("pemeriksa bukti"), Create(g2), FadeIn(k2, shift=DOWN * 0.2), dur=0.5)
        self.nama = nama; self.s1 = VGroup(k1, k2, g1, g2)

    def beat_b2_2(self, b):
        tanya = T("Bagaimana satu alat bisa menjadi keduanya?", 36, INK2).move_to(DOWN * 2.6)
        self.play_at(b.at("Bagaimana"), FadeIn(tanya), dur=0.4)
        gag = TB("Satu gagasan", 56, PRIMA).move_to(DOWN * 0.6)
        self.play_at(b.at("Rahasianya"), FadeOut(self.s1), FadeOut(tanya), FadeIn(gag, scale=0.8), dur=0.6)
        self.gag = gag

    def beat_b2_3(self, b):
        kiri = VGroup(T("pernyataan matematika", 32, INK2), TB("=", 44, DIM), TB("tipe", 60, AI)).arrange(DOWN, buff=0.25).move_to(LEFT * 3.6 + UP * 0.2)
        kanan = VGroup(T("bukti", 32, INK2), TB("=", 44, DIM), TB("program", 60, PRIMA)).arrange(DOWN, buff=0.25).move_to(RIGHT * 3.6 + UP * 0.2)
        c1 = kode("2 + 2 = 4", 40, AI).next_to(kiri, DOWN, buff=0.55); c2 = kode("rfl", 40, PRIMA).next_to(kanan, DOWN, buff=0.55)
        p1 = SurroundingRectangle(c1, color=GARIS, buff=0.25, corner_radius=0.12); p2 = SurroundingRectangle(c2, color=GARIS, buff=0.25, corner_radius=0.12)
        self.play_at(b.at("Di Lean"), FadeOut(self.gag), self.nama.animate.scale(0.45).to_edge(UP, buff=0.5), dur=0.5)
        self.play_at(b.at("sebuah pernyataan"), FadeIn(kiri[0]), dur=0.4)
        self.play_at(b.at("sebagai tipe"), FadeIn(kiri[1:]), FadeIn(c1), Create(p1), dur=0.5)
        self.play_at(b.at("bukti dari"), FadeIn(kanan[0]), dur=0.4)
        self.play_at(b.at("sebagai program"), FadeIn(kanan[1:]), FadeIn(c2), Create(p2), dur=0.5)
        cocok = panah(p2.get_left(), p1.get_right(), LEAN, 6); lc = T("program ini bertipe pernyataan itu", 28, LEAN).next_to(VGroup(p1, p2), DOWN, buff=0.4)
        self.play_at(b.at("yang memiliki tipe"), GrowArrow(cocok), FadeIn(lc), dur=0.6)
        self.s3 = VGroup(kiri, kanan, c1, c2, p1, p2, cocok, lc)

    def beat_b2_4(self, b):
        c = kode('"umur: " + 15', 44, INK).move_to(UP * 1.2); x = silang(0.34).next_to(c, RIGHT, buff=0.5)
        ket = T("tipe tidak cocok: teks + angka", 30, NOL).next_to(c, DOWN, buff=0.35)
        self.play_at(b.at("Kamu pasti pernah"), FadeOut(self.s3), FadeIn(c), dur=0.5)
        self.play_at(b.at("tipenya tidak cocok"), FadeIn(x, scale=1.3), FadeIn(ket), dur=0.4)
        s1 = VGroup(c, x, ket)
        lang = ["langkah 1", "langkah 2", "langkah 3", "langkah 4"]
        def daftar(buruk=None):
            g = VGroup()
            for i, s in enumerate(lang):
                ik = silang(0.22) if i == buruk else centang(0.22)
                g.add(VGroup(ik, kode(s, 30, NOL if i == buruk else INK)).arrange(RIGHT, buff=0.3))
            return g.arrange(DOWN, buff=0.28, aligned_edge=LEFT)
        d1 = daftar().move_to(LEFT * 3.4 + DOWN * 0.4); st1 = TB("BUKTI SAH", 40, LEAN).next_to(d1, DOWN, buff=0.5)
        d2 = daftar(2).move_to(RIGHT * 3.4 + DOWN * 0.4); st2 = TB("DITOLAK", 40, NOL).next_to(d2, DOWN, buff=0.5)
        jud = T("Lean memakai mekanisme yang sama untuk bukti", 34, INK2).move_to(UP * 2.1)
        self.play_at(b.at("Lean memakai mekanisme"), FadeOut(s1), FadeIn(jud), dur=0.5)
        self.play_at(b.at("Kalau programnya lolos"), LaggedStart(*[FadeIn(r) for r in d1], lag_ratio=0.25), dur=1.2)
        self.play_at(b.at("buktinya sah"), FadeIn(st1, scale=1.2), dur=0.4)
        self.play_at(b.at("Kalau ada satu langkah"), LaggedStart(*[FadeIn(r) for r in d2], lag_ratio=0.25), dur=1.2)
        self.play_at(b.at("Lean menolaknya"), FadeIn(st2, scale=1.2), dur=0.4)
        self.s4 = VGroup(jud, d1, d2, st1, st2)

    def beat_b2_5(self, b):
        luar = RoundedRectangle(width=10.5, height=5.0, corner_radius=0.3, stroke_color=GARIS, stroke_width=3, fill_color=PANEL, fill_opacity=0.6).move_to(DOWN * 0.5)
        alat = VGroup(*[chip(s, INK2, 24) for s in ["editor", "taktik", "otomasi", "perpustakaan", "AI"]])
        pos = [UP * 1.6 + LEFT * 3.6, UP * 1.6 + RIGHT * 3.4, DOWN * 2.5 + LEFT * 3.4, DOWN * 2.5 + RIGHT * 3.2, LEFT * 4.0 + DOWN * 0.5]
        for a, p in zip(alat, pos): a.move_to(p)
        ker = RoundedRectangle(width=2.6, height=1.5, corner_radius=0.2, stroke_color=LEAN, stroke_width=6, fill_color=BG, fill_opacity=1).move_to(DOWN * 0.5)
        lk = TB("kernel", 40, LEAN).move_to(ker); ket = T("pemeriksa inti, sengaja dibuat kecil", 28, INK2).next_to(ker, UP, buff=0.3)
        self.play_at(b.at("Bagian yang melakukan"), FadeOut(self.s4), FadeIn(luar), FadeIn(alat, lag_ratio=0.1), dur=0.7)
        self.play_at(b.at("disebut kernel"), FadeIn(ker, scale=0.7), FadeIn(lk), dur=0.5)
        self.play_at(b.at("sengaja dibuat kecil"), FadeIn(ket), dur=0.4)
        k = kaca(0.26).move_to(ker.get_corner(UR) + RIGHT * 0.5 + UP * 0.1)
        self.play_at(b.at("orang lain bisa membacanya"), FadeIn(k, shift=LEFT * 0.3), dur=0.5)
        ker2 = RoundedRectangle(width=2.6, height=1.5, corner_radius=0.2, stroke_color=UNGU, stroke_width=6, fill_color=BG, fill_opacity=1).move_to(DOWN * 0.5 + RIGHT * 3.3)
        l2 = T("pemeriksa\ntandingan", 26, UNGU, line_spacing=0.85).move_to(ker2); sama = TB("=", 50, INK).move_to(DOWN * 0.5 + RIGHT * 1.65)
        self.play_at(b.at("menulis ulang pemeriksa"), FadeOut(alat[1]), FadeOut(alat[3]), FadeOut(k), FadeIn(ker2), FadeIn(l2), dur=0.6)
        self.play_at(b.at("membandingkan hasilnya"), FadeIn(sama, scale=1.4), dur=0.4)
        self.s5 = VGroup(luar, alat[0], alat[2], alat[4], ker, lk, ket, ker2, l2, sama)

    def beat_b2_7(self, b):
        rak = VGroup(); judul = ["aritmetika", "aljabar", "geometri", "analisis", "teori bilangan", "topologi", "peluang", "riset"]
        warna = [AI, PRIMA, LEAN, UNGU, ORANYE, "#F28FB1", "#8FD3F2", NOL]
        for i, (j, w) in enumerate(zip(judul, warna)):
            bk = RoundedRectangle(width=1.0, height=3.4 + 0.25 * ((i * 3) % 4), corner_radius=0.08, fill_color=w, fill_opacity=0.9, stroke_width=0)
            t = TB(j, 24, BG).rotate(PI / 2).move_to(bk); rak.add(VGroup(bk, t))
        rak.arrange(RIGHT, buff=0.14, aligned_edge=DOWN).move_to(DOWN * 0.1)
        papan = Rectangle(width=rak.width + 1.0, height=0.16, fill_color=INK2, fill_opacity=1, stroke_width=0).next_to(rak, DOWN, buff=0)
        nama = TB("Mathlib", 64, INK).to_edge(UP, buff=0.55); sub = T("teorema yang sudah lolos pemeriksaan", 30, INK2).next_to(papan, DOWN, buff=0.35)
        self.play_at(b.at("perpustakaan bernama"), FadeOut(self.s5), FadeOut(self.nama), FadeIn(papan), dur=0.5)
        self.play_at(b.at("Mathlib"), FadeIn(nama), dur=0.4)
        self.play_at(b.at("Isinya teorema"), LaggedStart(*[FadeIn(k, shift=DOWN * 0.3) for k in rak[:4]], lag_ratio=0.2), FadeIn(sub), dur=1.0)
        self.play_at(b.at("mulai dari aritmetika"), Indicate(rak[0], color=INK, scale_factor=1.06), dur=0.6)
        self.play_at(b.at("sampai matematika"), LaggedStart(*[FadeIn(k, shift=DOWN * 0.3) for k in rak[4:]], lag_ratio=0.2), dur=1.0)
        pakai = chip("bisa kamu pakai ulang", LEAN, 28).next_to(sub, DOWN, buff=0.3)
        self.play_at(b.at("bisa kamu pakai ulang"), FadeIn(pakai), dur=0.4)
        self.s7 = VGroup(rak, papan, nama, sub, pakai)

    def beat_b2_8(self, b):
        t = TB("Sekarang, mari kita coba sendiri.", 54, INK)
        self.play_at(b.at("Sekarang"), FadeOut(self.s7), FadeIn(t, shift=UP * 0.2), dur=0.6)
