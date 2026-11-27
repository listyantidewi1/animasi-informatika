from kit import *
import random


class Bab0(BabScene):
    SEG = 0

    def beat_b0_1(self, b):
        r = random.Random(3)
        kertas = Rectangle(width=6.2, height=9.5, fill_color=PANEL, fill_opacity=1, stroke_color=GARIS, stroke_width=2).move_to(LEFT * 3.2)
        baris = VGroup()
        for i in range(70):
            w = r.uniform(2.2, 5.2)
            baris.add(RoundedRectangle(width=w, height=0.11, corner_radius=0.05, fill_color=DIM, fill_opacity=1, stroke_width=0).move_to([-3.2 - 2.7 + w / 2, 4.2 - i * 0.3, 0]))
        self.kertas = kertas; self.baris = baris
        hit = ValueTracker(1)
        ctr = always_redraw(lambda: VGroup(TB(angka(int(hit.get_value())), 84, PRIMA), T("baris bukti", 34, INK2)).arrange(DOWN, buff=0.2).move_to(RIGHT * 3.4 + UP * 1.0))
        self.add(kertas); self.play(FadeIn(kertas), FadeIn(baris[:30], lag_ratio=0.03), FadeIn(ctr), run_time=0.6)
        self.add(baris)
        t_ai = b.at("Bukti itu ditulis")
        self.play(baris.animate(rate_func=linear).shift(UP * 4.0), hit.animate(rate_func=rush_into).set_value(3_400_000), run_time=max(1.0, t_ai - self.now))
        c = chip("ditulis oleh AI", AI, 30).move_to(RIGHT * 3.4 + DOWN * 0.9)
        self.play(FadeIn(c, shift=UP * 0.2), baris.animate(rate_func=linear).shift(UP * 0.5), run_time=0.5)
        t_m = b.at("tidak ada satu pun")
        self.play(baris.animate(rate_func=linear).shift(UP * 2.2), run_time=max(0.5, t_m - self.now))
        og = orang(INK2, 1.3); x = VGroup(Line(UL * 0.5, DR * 0.5, color=NOL, stroke_width=9), Line(UR * 0.5, DL * 0.5, color=NOL, stroke_width=9)).move_to(og)
        ket = T("tidak ada manusia yang\nmembacanya sampai habis", 28, INK, line_spacing=0.9)
        g = VGroup(VGroup(og, x), ket).arrange(RIGHT, buff=0.35).move_to(RIGHT * 3.4 + DOWN * 2.4)
        self.play(FadeIn(g), baris.animate(rate_func=linear).shift(UP * 0.5), run_time=0.5)
        self.play(baris.animate(rate_func=linear).shift(UP * 2.0), run_time=max(0.5, b.end - self.now))
        self.ctr = ctr; self.sisi = VGroup(c, g); self.hit = hit

    def beat_b0_2(self, b):
        tanya = TB("?", 260, PRIMA).move_to(RIGHT * 3.4 + UP * 0.6)
        kal = TB("Mengapa bukti itu tetap\nberani dipercaya?", 40, INK, line_spacing=0.9).next_to(tanya, DOWN, buff=0.4)
        self.ctr.clear_updaters()
        self.play_at(b.at("mengapa"), FadeOut(self.sisi), FadeOut(self.ctr), self.baris.animate.set_opacity(0.45), FadeIn(tanya, scale=0.6), dur=0.7)
        self.play_at(b.at("tetap berani"), FadeIn(kal, shift=UP * 0.2), dur=0.5)
        self.tanya = VGroup(tanya, kal)

    def beat_b0_3(self, b):
        nama = TB("LEAN 4", 150, LEAN).move_to(UP * 0.3)
        sub = T("bahasa pemrograman dan pemeriksa bukti", 34, INK2).next_to(nama, DOWN, buff=0.35)
        self.play_at(b.at("sebuah program"), FadeOut(self.tanya), FadeOut(self.kertas), FadeOut(self.baris), dur=0.5)
        self.play_at(b.at("Lean."), FadeIn(nama, scale=0.8), dur=0.6)
        self.play(FadeIn(sub), run_time=0.4)
        j = jendela("Lean di browser", 8.6, 4.4).move_to(LEFT * 1.9 + DOWN * 0.5)
        kd = blok_kode(["theorem tukar (p q : Prop) :", "    p ∧ q → q ∧ p := by", "  intro h", "  ..."], 28, [AI, INK, INK, DIM]).move_to(j[0].get_center() + DOWN * 0.15)
        kanan = panel(3.6, 4.4).next_to(j, RIGHT, buff=0.3)
        tq = TB("?", 120, PRIMA).move_to(kanan); lab = T("hasil pemeriksaan", 22, INK2).next_to(kanan.get_top(), DOWN, buff=0.25)
        self.play_at(b.at("menulis bukti pertamamu"), VGroup(nama, sub).animate.scale(0.42).to_edge(UP, buff=0.5), FadeIn(j), dur=0.7)
        self.play(AddTextLetterByLetter(kd[0], time_per_char=0.03), run_time=0.9)
        self.play(FadeIn(kd[1:], lag_ratio=0.3), run_time=0.8)
        self.play_at(b.at("diperiksa oleh pemeriksa"), FadeIn(kanan), FadeIn(lab), FadeIn(tq, scale=0.6), dur=0.6)
        self.b3 = VGroup(nama, sub, j, kd, kanan, tq, lab)

    def beat_b0_4(self, b):
        br = jendela("Browser", 7.0, 3.6).move_to(UP * 0.3)
        almt = RoundedRectangle(width=5.6, height=0.6, corner_radius=0.3, fill_color="#0B0E14", fill_opacity=1, stroke_color=GARIS, stroke_width=2).move_to(br[0].get_center() + UP * 0.75)
        url = kode("live.lean-lang.org", 26, LEAN).move_to(almt)
        ket = TB("Tanpa memasang apa pun", 44, INK).move_to(br[0].get_center() + DOWN * 0.5)
        self.play_at(b.at("Kamu tidak perlu"), FadeOut(self.b3), FadeIn(br), FadeIn(almt), dur=0.6)
        self.play_at(b.at("memasang apa pun"), FadeIn(ket), dur=0.4)
        self.play_at(b.at("membuka browser"), AddTextLetterByLetter(url, time_per_char=0.04), dur=0.8)
        jud = VGroup(TB("Apa Itu Lean 4?", 76, INK), T("dan cara menulis bukti pertamamu", 40, PRIMA)).arrange(DOWN, buff=0.3)
        self.play_at(b.speech_end + 0.5, FadeOut(VGroup(br, almt, url, ket)), FadeIn(jud, shift=UP * 0.2), dur=0.6)
