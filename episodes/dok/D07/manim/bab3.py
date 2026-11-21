from kit import *
import random


def agen(s=0.32, warna=AI):
    kepala = RoundedRectangle(width=s, height=s * 0.82, corner_radius=s * 0.22, fill_color=warna, fill_opacity=1, stroke_width=0)
    mata = VGroup(Dot(radius=s * 0.08, color=BG).shift(LEFT * s * 0.18), Dot(radius=s * 0.08, color=BG).shift(RIGHT * s * 0.18))
    antena = Line(UP * s * 0.41, UP * s * 0.62, color=warna, stroke_width=2)
    return VGroup(kepala, mata, antena)


def kartu_peristiwa(tgl, isi, warna):
    bg = panel(3.9, 2.0)
    t1 = T(tgl, 24, warna); t2 = T(isi, 28, INK, line_spacing=0.9)
    if t2.width > 3.5: t2.scale_to_fit_width(3.5)
    return VGroup(bg, VGroup(t1, t2).arrange(DOWN, buff=0.22).move_to(bg))


class Bab3(BabScene):
    SEG = 3

    def beat_b3_1(self, b):
        k = VGroup(kartu_peristiwa("Agustus 2026", "Batas nol zeta", AI),
                   kartu_peristiwa("September 2026", "Teorema\nTerakhir Fermat", AI),
                   kartu_peristiwa("20 November 2026", "Klaim Hipotesis\nRiemann", PRIMA)).arrange(RIGHT, buff=0.4)
        self.play_at(b.at("Klaim"), LaggedStart(*[FadeIn(x, shift=UP * 0.3) for x in k], lag_ratio=0.25), dur=1.2)
        self.play_at(b.at("berlatih"), k[0][0].animate.set_stroke(AI, 4), k[1][0].animate.set_stroke(AI, 4), k[2].animate.set_opacity(0.35), dur=0.6)
        self.kartu3 = k

    def beat_b3_2(self, b):
        self.play_at(b.at("Pada"), self.kartu3.animate.scale(0.5).to_edge(UP, buff=0.25), dur=0.6)
        ax = Axes(x_range=[0, 2, 1], y_range=[0, 100, 25], x_length=5.0, y_length=4.6, axis_config={"color": DIM, "include_ticks": False}, tips=False).shift(DOWN * 0.7 + LEFT * 0.5)
        garis100 = DashedLine(ax.c2p(0, 100), ax.c2p(2, 100), color=DIM)
        l100 = T("100%: semua nol", 22, DIM).next_to(garis100, RIGHT, buff=0.15)
        judul = T("bagian nol zeta yang terbukti berada di garis 1/2", 28, INK2).next_to(ax, UP, buff=0.45)
        self.play(Create(ax), FadeIn(garis100), FadeIn(l100), FadeIn(judul), run_time=0.7)
        lama = Rectangle(width=1.3, height=0.01, fill_color=DIM, fill_opacity=1, stroke_width=0).move_to(ax.c2p(0.5, 0), aligned_edge=DOWN)
        self.add(lama)
        self.play_at(b.at("empat puluh"), lama.animate.stretch_to_fit_height(ax.c2p(0, 41.6)[1] - ax.c2p(0, 0)[1]).move_to(ax.c2p(0.5, 0), aligned_edge=DOWN), dur=0.9)
        tl = TB("41,6%", 40, INK2).next_to(lama, UP, buff=0.15); sl = T("sebelumnya", 24, INK2).next_to(lama, DOWN, buff=0.2)
        self.play(FadeIn(tl), FadeIn(sl), run_time=0.3)
        baru = Rectangle(width=1.3, height=0.01, fill_color=AI, fill_opacity=1, stroke_width=0).move_to(ax.c2p(1.5, 0), aligned_edge=DOWN)
        self.add(baru)
        self.play_at(b.at("enam puluh tujuh"), baru.animate.stretch_to_fit_height(ax.c2p(0, 67.2)[1] - ax.c2p(0, 0)[1]).move_to(ax.c2p(1.5, 0), aligned_edge=DOWN), dur=1.1, rate_func=rate_functions.ease_out_back)
        tb = TB("67,2%", 48, AI).next_to(baru, UP, buff=0.15); sb = T("dengan Claude", 24, AI).next_to(baru, DOWN, buff=0.2)
        self.play(FadeIn(tb, scale=1.3), FadeIn(sb), run_time=0.4)
        self.r2 = VGroup(ax, garis100, l100, judul, lama, tl, sl, baru, tb, sb)

    def beat_b3_3(self, b):
        self.play_at(b.at("Yang menarik"), FadeOut(self.r2), dur=0.5)
        lampu = VGroup(*[Circle(radius=0.085, fill_color=GARIS, fill_opacity=1, stroke_width=0) for _ in range(650)]).arrange_in_grid(25, 26, buff=0.09).shift(DOWN * 0.45 + LEFT * 2.0)
        self.play(FadeIn(lampu), run_time=0.4)
        cnt = ValueTracker(0)
        lab = always_redraw(lambda: VGroup(TB(angka(cnt.get_value()), 80, NOL), T("ide dicoba, gagal", 30, INK2)).arrange(DOWN, buff=0.2).move_to(RIGHT * 4.6 + DOWN * 0.3))
        self.add(lab)
        urut = list(range(650)); random.Random(5).shuffle(urut)
        anims = [Succession(lampu[i].animate(run_time=0.05).set_fill(PRIMA), lampu[i].animate(run_time=0.15).set_fill("#3B1E24")) for i in urut]
        self.play_at(b.at("enam ratus"), LaggedStart(*anims, lag_ratio=0.006), cnt.animate.set_value(650), dur=3.2, rate_func=linear)
        lab.clear_updaters()
        self.lampu, self.lab3 = lampu, lab

    def beat_b3_4(self, b):
        satu = self.lampu[12 * 26 + 13]
        self.play_at(b.at("Ide yang berhasil"), satu.animate.set_fill(LEAN).scale(2.6), Flash(satu, color=LEAN, line_length=0.3), dur=0.8)
        ok = T("1 ide berhasil", 34, LEAN).next_to(self.lab3, DOWN, buff=0.5)
        self.play(FadeIn(ok, shift=UP * 0.2), run_time=0.4)
        self.ok = ok

    def beat_b3_4x(self, b):
        self.play_at(b.at("Dalam"), FadeOut(VGroup(self.lampu, self.lab3, self.ok)), dur=0.5)
        ag = VGroup(*[agen(0.36) for _ in range(60)]).arrange_in_grid(6, 10, buff=0.2).shift(LEFT * 3.6 + DOWN * 0.4)
        k1 = VGroup(TB("± 60", 64, AI), T("subagen", 28, INK2)).arrange(DOWN, buff=0.1)
        k2 = VGroup(TB("31 juta", 64, INK), T("token ditulis", 28, INK2)).arrange(DOWN, buff=0.1)
        k3 = VGroup(TB("2.000+", 64, LEAN), T("perintah di terminal", 28, INK2)).arrange(DOWN, buff=0.1)
        kol = VGroup(k1, k2, k3).arrange(DOWN, buff=0.5, aligned_edge=LEFT).shift(RIGHT * 3.4 + DOWN * 0.3)
        self.play_at(b.at("enam puluh"), LaggedStart(*[FadeIn(a, scale=0.5) for a in ag], lag_ratio=0.02), FadeIn(k1, shift=LEFT * 0.2), dur=1.1)
        self.play_at(b.at("tiga puluh satu"), FadeIn(k2, shift=LEFT * 0.2), dur=0.5)
        self.play_at(b.at("menjalankan"), FadeIn(k3, shift=LEFT * 0.2), dur=0.5)
        self.r4x = VGroup(ag, kol)

    def beat_b3_5(self, b):
        self.play_at(b.at("Meski"), FadeOut(self.r4x), dur=0.5)
        q = T("“Kami tidak berharap teknik yang dipakai Claude\nakan membawa ke bukti Hipotesis Riemann.”", 38, INK, line_spacing=1.1)
        src = T("Anthropic, Agustus 2026 (diterjemahkan)", 24, DIM).next_to(q, DOWN, buff=0.4)
        self.play_at(b.at("Anthropic menulis"), FadeIn(q, shift=UP * 0.2), FadeIn(src), dur=0.8)
        self.r5 = VGroup(q, src)

    def beat_b3_6(self, b):
        self.play_at(b.at("Di proyek"), FadeOut(self.r5), self.kartu3[0].animate.set_opacity(0.35), self.kartu3[1][0].animate.set_stroke(PRIMA, 5), dur=0.6)
        dasar = Line(LEFT * 6.5, RIGHT * 6.5, color=DIM).shift(DOWN * 3.0)
        menara = VGroup()
        for i in range(8):
            for j in range(7 - i // 2):
                bx = Square(0.34, fill_color=LEAN, fill_opacity=0.85, stroke_color=BG, stroke_width=2)
                bx.move_to([2.2 + (j - (6 - i // 2) / 2) * 0.36, -2.82 + i * 0.36, 0]); menara.add(bx)
        ag = VGroup(*[agen(0.3) for _ in range(24)])
        rnd = random.Random(2)
        for a in ag: a.move_to([rnd.uniform(-6.3, -1.0), rnd.uniform(-2.6, 1.8), 0])
        self.play(Create(dasar), LaggedStart(*[FadeIn(a, scale=0.5) for a in ag], lag_ratio=0.03), run_time=0.9)
        lean = T("bahasa Lean", 28, LEAN).next_to(dasar, DOWN, buff=0.15).shift(RIGHT * 2.2)
        # agen membawa balok ke menara
        anims = []
        for k, bx in enumerate(menara):
            a = ag[k % len(ag)]; c = bx.copy().scale(0.6).next_to(a, UP, buff=0.02)
            anims.append(Succession(FadeIn(c, run_time=0.01), Transform(c, bx, run_time=0.6)))
        self.play_at(b.at("menulis"), LaggedStart(*anims, lag_ratio=0.05), FadeIn(lean), dur=3.0)
        self.r6 = Group(*[m for m in self.mobjects if m is not self.kartu3])

    def beat_b3_7(self, b):
        k1 = VGroup(TB("13 juta", 60, LEAN), T("baris kode Lean", 26, INK2)).arrange(DOWN, buff=0.1)
        k2 = VGroup(TB("30.000+", 60, INK), T("teorema", 26, INK2)).arrange(DOWN, buff=0.1)
        hari = ValueTracker(0)
        k3 = always_redraw(lambda: VGroup(TB(f"{int(hari.get_value())} hari", 60, PRIMA), T("waktu kerja", 26, INK2)).arrange(DOWN, buff=0.1).move_to(RIGHT * 4.6 + DOWN * 1.9))
        k1.move_to(RIGHT * 4.6 + UP * 1.3); k2.move_to(RIGHT * 4.6 + DOWN * 0.3)
        self.play_at(b.at("tiga belas"), self.r6.animate.shift(LEFT * 2.2), FadeIn(k1, shift=LEFT * 0.2), dur=0.7)
        self.play_at(b.at("tiga puluh ribu"), FadeIn(k2, shift=LEFT * 0.2), dur=0.5)
        self.until(b.at("sebelas") - 0.3); self.add(k3)
        self.play_at(b.at("sebelas"), hari.animate.set_value(11), dur=1.0, rate_func=linear)
        k3.clear_updaters()
        self.r7 = VGroup(k1, k2, k3)

    def beat_b3_8(self, b):
        self.play_at(b.at("Para agen"), FadeOut(self.r6), FadeOut(self.r7), FadeOut(self.kartu3), dur=0.6)
        # pohon bukti: daun (teorema kecil) -> lemma -> teorema utama
        puncak = VGroup(panel(3.4, 0.8, "#1E2A20", LEAN), T("Teorema utama", 26, LEAN)).shift(UP * 2.6)
        puncak[1].move_to(puncak[0])
        lem = VGroup(*[VGroup(panel(2.0, 0.6), T(f"lemma {i+1}", 22, INK)) for i in range(4)]).arrange(RIGHT, buff=0.55).shift(UP * 0.7)
        for l in lem: l[1].move_to(l[0])
        daun = VGroup(*[VGroup(RoundedRectangle(width=0.9, height=0.42, corner_radius=0.1, fill_color=PANEL, fill_opacity=1, stroke_color=GARIS), T("teorema", 14, INK2)) for _ in range(12)]).arrange(RIGHT, buff=0.16).shift(DOWN * 1.3)
        for d_ in daun: d_[1].move_to(d_[0])
        defs = VGroup(*[VGroup(RoundedRectangle(width=0.9, height=0.42, corner_radius=0.1, fill_color="#251E33", fill_opacity=1, stroke_color=UNGU), T("definisi", 14, UNGU)) for _ in range(12)]).arrange(RIGHT, buff=0.16).shift(DOWN * 2.9)
        for d_ in defs: d_[1].move_to(d_[0])
        p1 = VGroup(*[Line(defs[i].get_top(), daun[i].get_bottom(), color=GARIS, stroke_width=2) for i in range(12)])
        p2 = VGroup(*[Line(daun[i].get_top(), lem[i // 3].get_bottom(), color=GARIS, stroke_width=2) for i in range(12)])
        p3 = VGroup(*[Line(l.get_top(), puncak.get_bottom(), color=GARIS, stroke_width=2) for l in lem])
        self.play_at(b.at("mendefinisikan"), LaggedStart(*[FadeIn(d_, shift=UP * 0.2) for d_ in defs], lag_ratio=0.05), dur=1.0)
        self.play_at(b.at("membuktikan teorema kecil"), Create(p1), LaggedStart(*[FadeIn(d_, shift=UP * 0.2) for d_ in daun], lag_ratio=0.05), dur=1.0)
        self.play_at(b.at("dipakai"), Create(p2), LaggedStart(*[FadeIn(l, shift=UP * 0.2) for l in lem], lag_ratio=0.1), dur=1.0)
        self.play_at(b.at("lebih besar"), Create(p3), FadeIn(puncak, scale=1.2), dur=0.8)
        self.pohon = dict(puncak=puncak, lem=lem, daun=daun, defs=defs, p=VGroup(p1, p2, p3))

    def beat_b3_9(self, b):
        p = self.pohon
        ganti = [(p["puncak"][1], "aplikasi", AI), *[(l[1], f"modul {i+1}", INK) for i, l in enumerate(p["lem"])]]
        anims = [Transform(t, T(s, t.font_size if hasattr(t, "font_size") else 22, w).move_to(t)) for t, s, w in ganti]
        anims += [Transform(d_[1], T("fungsi", 14, INK2).move_to(d_[1])) for d_ in p["daun"]]
        anims += [Transform(d_[1], T("data", 14, UNGU).move_to(d_[1])) for d_ in p["defs"]]
        self.play_at(b.at("tim pengembang"), *anims, p["puncak"][0].animate.set_stroke(AI), dur=1.2)
        lb = T("proyek perangkat lunak", 28, AI).to_edge(UP, buff=0.25)
        self.play(FadeIn(lb), run_time=0.4)
