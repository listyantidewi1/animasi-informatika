from kit import *
import random

LEAN_BARIS = [
    "theorem zeta_nol_kritis (s : ℂ) (h : ζ s = 0) :",
    "  s.re = 1/2 ∨ s ∈ nol_trivial := by",
    "  have h1 := fungsi_L_simetri s",
    "  rcases batas_nol h with ⟨σ, hσ, hσ'⟩",
    "  simp only [re_add_im, mul_comm] at hσ",
    "  exact lemma_4821 hσ hσ'",
    "lemma lemma_4822 {x : ℝ} (hx : 1 < x) :",
    "  ψ x - x = O (x ^ (1/2 + ε)) := by",
    "  refine rumus_eksplisit x hx ?_",
    "  linarith [jumlah_nol_konvergen hx]",
    "theorem lemma_4823 : ∀ n ≥ 2, Λ n ≥ 0 := by",
    "  intro n hn; positivity",
]


def baris_kode(n, lebar=6.6, seed=1):
    r = random.Random(seed); g = VGroup()
    for i in range(n):
        s = LEAN_BARIS[i % len(LEAN_BARIS)]
        warna = LEAN if s.startswith(("theorem", "lemma")) else INK2
        g.add(kode(s, 17, warna))
    g.arrange(DOWN, aligned_edge=LEFT, buff=0.13)
    return g


class Bab0(BabScene):
    SEG = 0

    def beat_b0_1(self, b):
        random.seed(3)
        prima = [p for p in range(2, 400) if all(p % d for d in range(2, int(p ** 0.5) + 1))]
        titik = VGroup(*[T(str(p), random.choice([16, 20, 24]), PRIMA).set_opacity(0.10 + 0.14 * random.random())
                         .move_to([random.uniform(-6.8, 6.8), random.uniform(-3.7, 3.7), 0]) for p in prima[:70]])
        th = ValueTracker(1859)
        tahun = always_redraw(lambda: TB(str(int(th.get_value())), 150, INK))
        self.tahun, self.titik = tahun, titik
        self.play(LaggedStart(*[FadeIn(x, scale=0.6) for x in titik], lag_ratio=0.02), FadeIn(tahun), run_time=1.2)
        self.play_at(b.at("seratus"), th.animate.set_value(2026), dur=2.4, rate_func=rate_functions.ease_in_out_cubic, sebelum=b.at("matematikawan"))
        lbl = TB("167 tahun", 56, PRIMA).shift(DOWN * 1.6)
        self.play_at(b.at("matematikawan"), FadeIn(lbl, shift=UP * 0.3), dur=0.6)
        self.lbl = lbl

    def beat_b0_2(self, b):
        self.tahun.clear_updaters()
        uang = TB("US$1.000.000", 120, PRIMA)
        ket = T("Millennium Prize Problem · Clay Mathematics Institute", 28, INK2).next_to(uang, DOWN, buff=0.45)
        self.play_at(b.at("Hadiah"), FadeOut(self.tahun, shift=UP), FadeOut(self.lbl, shift=UP), FadeIn(uang, scale=1.25), dur=0.8)
        self.play(FadeIn(ket, shift=UP * 0.2), run_time=0.5)
        self.uang = VGroup(uang, ket)

    def beat_b0_3(self, b):
        kertas = Rectangle(width=3.4, height=4.4, fill_color="#F4F1E8", fill_opacity=1, stroke_width=0)
        garis = VGroup(*[Line(LEFT * 1.3, RIGHT * (1.3 - (i % 3) * 0.4), color="#C9C2B0", stroke_width=3).shift(UP * (1.7 - i * 0.32)) for i in range(11)])
        doc = VGroup(kertas, garis)
        self.play_at(b.at("muncul"), FadeOut(self.uang, shift=UP * 0.5), FadeIn(doc, shift=UP * 0.3), dur=0.8)
        silang = Cross(doc, stroke_color=NOL, stroke_width=10).scale(0.6)
        self.play_at(b.at("tidak ditulis"), Create(silang), dur=0.6)
        win = jendela("bukti.lean (ilustrasi)", 9.2, 5.6)
        kd = baris_kode(12).next_to(win[1], DOWN, buff=0.3).align_to(win[0], LEFT).shift(RIGHT * 0.35)
        self.play_at(b.at("kode program"), FadeOut(VGroup(doc, silang), scale=0.7), FadeIn(win, scale=0.9), dur=0.7)
        self.play(LaggedStart(*[AddTextLetterByLetter(x, time_per_char=0.008) for x in kd], lag_ratio=0.12), run_time=1.0)
        self.win, self.kd = win, kd

    def beat_b0_4(self, b):
        # halaman menumpuk jadi menara
        self.play_at(b.at("Kalau"), VGroup(self.win, self.kd).animate.scale(0.45).to_edge(LEFT, buff=0.6), dur=0.8)
        tumpuk = VGroup(); n = 46
        for i in range(n):
            h = Rectangle(width=2.6, height=0.12, fill_color="#F4F1E8", fill_opacity=1, stroke_color="#C9C2B0", stroke_width=1)
            h.move_to([0.6 + 0.03 * ((i * 7) % 5 - 2), -3.4 + i * 0.16, 0]); tumpuk.add(h)
        self.play(LaggedStart(*[FadeIn(h, shift=DOWN * 0.6) for h in tumpuk], lag_ratio=0.06), run_time=2.2)
        self.play(self.camera.frame.animate.shift(UP * 2.2), tumpuk.animate.stretch(2.4, 1, about_edge=DOWN), run_time=1.2)
        ang = TB("250.000+", 72, INK).move_to(self.camera.frame.get_center() + RIGHT * 3.9 + UP * 0.6)
        hal = T("halaman (perkiraan)", 34, INK2).next_to(ang, DOWN, buff=0.25)
        self.play_at(b.at("dua ratus"), FadeIn(ang, scale=1.3), FadeIn(hal), dur=0.7)
        self.tumpuk = VGroup(tumpuk, ang, hal)

    def beat_b0_5(self, b):
        self.play_at(b.at("Tidak ada"), FadeOut(self.tumpuk), self.camera.frame.animate.shift(DOWN * 2.2),
                     VGroup(self.win, self.kd).animate.scale(1 / 0.45).move_to(ORIGIN), dur=1.0)
        cek = VGroup(*[T("✓", 22, LEAN).next_to(x, LEFT, buff=0.12) for x in self.kd])
        self.play_at(b.at("komputer"), LaggedStart(*[FadeIn(c, scale=1.6) for c in cek], lag_ratio=0.35), dur=2.4)
        self.cek = cek

    def beat_b0_6(self, b):
        j1 = TB("Hipotesis Riemann", 84, INK)
        j2 = TB("Dipecahkan oleh AI?", 84, PRIMA).next_to(j1, DOWN, buff=0.25)
        judul = VGroup(j1, j2).move_to(UP * 0.4)
        stat = T("Status: klaim, per 21 November 2026", 28, INK2)
        box = SurroundingRectangle(stat, color=DIM, buff=0.18, corner_radius=0.12)
        st = VGroup(box, stat).next_to(judul, DOWN, buff=0.7)
        self.play_at(b.at("Di video"), FadeOut(VGroup(self.win, self.kd, self.cek), scale=0.9), self.titik.animate.set_opacity(0.05), dur=0.6)
        self.play(Write(j1), run_time=0.9)
        self.play(FadeIn(j2, shift=UP * 0.2), run_time=0.6)
        self.play_at(b.at("apakah"), FadeIn(st, shift=UP * 0.2), dur=0.6)
