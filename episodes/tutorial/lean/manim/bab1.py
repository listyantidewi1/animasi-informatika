from kit import *


class Bab1(BabScene):
    SEG = 1

    def beat_b1_1(self, b):
        nama = ["Langkah 1", "Langkah 2", "Langkah 3", "Terbukti"]
        kot = VGroup(*[kartu_teks(n, None, 2.6, 1.1, LEAN if n == "Terbukti" else AI, 28) for n in nama]).arrange(RIGHT, buff=0.9).move_to(UP * 0.4)
        pan = VGroup(*[panah(kot[i].get_right(), kot[i + 1].get_left(), INK2, 5, 0.08) for i in range(3)])
        jud = TB("Bukti = rangkaian langkah", 44, INK).to_edge(UP, buff=0.8)
        aturan = T("setiap langkah mengikuti aturan logika dari langkah sebelumnya", 30, INK2).next_to(kot, DOWN, buff=0.8)
        self.play_at(b.at("sebuah pernyataan"), FadeIn(kot[3], scale=0.9), dur=0.5)
        self.play_at(b.at("Bukti adalah"), FadeIn(jud), dur=0.4)
        self.play_at(b.at("rangkaian langkah"), LaggedStart(*[FadeIn(k, shift=RIGHT * 0.2) for k in kot[:3]], lag_ratio=0.35), dur=1.2)
        self.play_at(b.at("setiap langkah"), LaggedStart(*[GrowArrow(p) for p in pan], lag_ratio=0.3), FadeIn(aturan), dur=1.2)
        self.kot = kot; self.pan = pan; self.jud = jud; self.aturan = aturan

    def beat_b1_2(self, b):
        og = orang(PRIMA, 1.2); kc = kaca(0.3).next_to(og, RIGHT, buff=0.05).shift(UP * 0.1); pem = VGroup(og, kc).next_to(self.kot[0], UP, buff=0.5)
        lab = T("pemeriksa: manusia", 26, PRIMA).next_to(pem, UP, buff=0.15)
        self.play_at(b.at("yang memeriksa"), FadeOut(self.jud), FadeIn(pem), FadeIn(lab), dur=0.5)
        retak = VGroup(Line(UP * 0.28 + LEFT * 0.1, ORIGIN + RIGHT * 0.08, color=NOL, stroke_width=7), Line(ORIGIN + RIGHT * 0.08, DOWN * 0.28 + LEFT * 0.06, color=NOL, stroke_width=7)).move_to(self.pan[1])
        g = VGroup(pem, lab)
        self.play_at(b.at("Manusia bisa lelah"), g.animate.shift(RIGHT * (self.kot[1].get_x() - self.kot[0].get_x())), dur=0.8)
        ch = VGroup(chip("lelah", ORANYE, 28), chip("terburu-buru", ORANYE, 28), chip("sungkan membantah nama besar", ORANYE, 28)).arrange(RIGHT, buff=0.4).move_to(DOWN * 2.6)
        self.play(FadeIn(ch[0]), self.pan[1].animate.set_color(NOL), FadeIn(retak), run_time=0.4)
        self.play_at(b.at("bisa terburu-buru"), FadeIn(ch[1]), g.animate.shift(RIGHT * (self.kot[3].get_x() - self.kot[1].get_x())), dur=0.8)
        self.play_at(b.at("bisa sungkan"), FadeIn(ch[2]), dur=0.4)
        lolos = T("lubang terlewat", 26, NOL).next_to(retak, DOWN, buff=0.75)
        self.play(FadeIn(lolos), FadeOut(self.aturan), run_time=0.4)
        self.s2 = VGroup(g, ch, retak, lolos, self.kot, self.pan)

    def beat_b1_3(self, b):
        garis = Line(LEFT * 5, RIGHT * 5, color=GARIS, stroke_width=6).shift(UP * 0.2)
        ttk = [("Terbit", LEFT * 4.2, AI), ("Dipakai banyak orang", ORIGIN, AI), ("Lubang ditemukan", RIGHT * 4.2, NOL)]
        garis.shift(UP * 0.6)
        ob = VGroup()
        for n, p, w in ttk:
            d = Dot(p + UP * 0.8, radius=0.16, color=w); t = TB(n, 28, w if w == NOL else INK).next_to(d, UP, buff=0.3); ob.add(VGroup(d, t))
        kur = BraceBetweenPoints(LEFT * 4.2 + UP * 0.5, RIGHT * 4.2 + UP * 0.5, color=INK2); kt = T("bertahun-tahun", 36, PRIMA).next_to(kur, DOWN, buff=0.2)
        self.play_at(b.at("Sejarah mencatat"), FadeOut(self.s2), FadeIn(garis), dur=0.6)
        self.play_at(b.at("sudah diterbitkan"), FadeIn(ob[0]), dur=0.4)
        self.play(FadeIn(ob[1]), run_time=0.4)
        self.play_at(b.at("mengandung lubang"), FadeIn(ob[2], scale=1.2), dur=0.4)
        self.play_at(b.at("bertahun-tahun kemudian"), FadeIn(kur), FadeIn(kt), dur=0.5)
        self.s3 = VGroup(garis, ob, kur, kt)

    def beat_b1_4(self, b):
        def tumpuk(n, dy=0.085):
            g = VGroup()
            for i in range(n):
                g.add(Rectangle(width=2.4, height=dy * 0.78, fill_color="#F4F1E8", fill_opacity=1, stroke_color="#C9C2B0", stroke_width=1).move_to([0.03 * ((i * 7) % 5 - 2), i * dy, 0]))
            return g
        kecil = tumpuk(4).move_to(LEFT * 4 + DOWN * 2.6, aligned_edge=DOWN); lk = T("20 halaman", 30, INK2).next_to(kecil, DOWN, buff=0.25)
        besar = tumpuk(95).move_to(LEFT * 0.6 + DOWN * 2.6, aligned_edge=DOWN); lb = TB("ratusan ribu\nhalaman", 44, PRIMA, line_spacing=0.9).move_to(RIGHT * 3.9 + UP * 1.0)
        ai = chip("ditulis oleh AI", AI, 28).next_to(lb, DOWN, buff=0.3)
        self.play_at(b.at("Sekarang bayangkan"), FadeOut(self.s3), FadeIn(kecil), FadeIn(lk), dur=0.5)
        self.play_at(b.at("melainkan ratusan"), LaggedStart(*[FadeIn(h, shift=DOWN * 0.2) for h in besar], lag_ratio=0.02), FadeIn(lb), FadeIn(ai), dur=2.2)
        must = T("mustahil dibaca habis,\napalagi diperiksa satu per satu", 30, INK, line_spacing=0.9).next_to(ai, DOWN, buff=0.45)
        self.play_at(b.at("Membacanya saja"), FadeIn(must), dur=0.5)
        self.s4 = VGroup(kecil, lk, besar, lb, ai, must)

    def beat_b1_5(self, b):
        jud = TB("Pemeriksa yang kita butuhkan", 46, INK).to_edge(UP, buff=0.9)
        isi = ["tidak pernah lelah", "tidak bisa dirayu", "tidak peduli siapa penulis buktinya"]
        brs = VGroup(*[VGroup(centang(0.26), T(s, 38, INK)).arrange(RIGHT, buff=0.35) for s in isi]).arrange(DOWN, buff=0.5, aligned_edge=LEFT).move_to(UP * 0.2)
        self.play_at(b.at("kita membutuhkan"), FadeOut(self.s4), FadeIn(jud), dur=0.5)
        for s, r in zip(isi, brs):
            self.play_at(b.at(s if s != isi[2] else "tidak peduli"), FadeIn(r, shift=RIGHT * 0.2), dur=0.4)
        ada = TB("Pemeriksa seperti itu sudah ada.", 42, LEAN).next_to(brs, DOWN, buff=0.9)
        self.play_at(b.at("Pemeriksa seperti itu"), FadeIn(ada, shift=UP * 0.2), dur=0.5)
