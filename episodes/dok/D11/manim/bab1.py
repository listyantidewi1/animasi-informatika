from kit import *
import random

GURU = ["A", "B", "C", "D", "E", "F", "G", "H"]
WARNA = [AI, PRIMA, LEAN, UNGU, ORANYE, "#F28FB1", "#8FD3F2", "#C9D46A"]
KELAS = ["7A", "7B", "7C", "8A", "8B", "8C"]
NJ, NK, SW, SH = 5, 6, 1.0, 0.72
SX = 4.3   # pusat kolom keterangan di kanan


def muat(m, w=5.0):
    if m.width > w: m.scale_to_fit_width(w)
    return m


def jadwal_benar(seed=5):
    """Jadwal tanpa bentrok: tiap baris (jam) berisi guru yang berbeda."""
    r = random.Random(seed); out = []
    for j in range(NJ):
        out.append(r.sample(range(len(GURU)), NK))
    return out


def kartu_guru(g, pos):
    k = RoundedRectangle(width=SW - 0.14, height=SH - 0.14, corner_radius=0.1, fill_color=WARNA[g], fill_opacity=0.92, stroke_width=0)
    t = TB("Guru " + GURU[g], 18, BG).move_to(k)
    return VGroup(k, t).move_to(pos)


class Grid(VGroup):
    def __init__(self):
        super().__init__()
        self.sel = [[Rectangle(width=SW, height=SH, stroke_color=GARIS, stroke_width=2, fill_color=PANEL, fill_opacity=1)
                     .move_to([(k - (NK - 1) / 2) * SW, ((NJ - 1) / 2 - j) * SH, 0]) for k in range(NK)] for j in range(NJ)]
        self.kot = VGroup(*[c for row in self.sel for c in row])
        self.kol = VGroup(*[T(KELAS[k], 24, INK2).next_to(self.sel[0][k], UP, buff=0.15) for k in range(NK)])
        self.bar = VGroup(*[T(f"Jam {j + 1}", 24, INK2).next_to(self.sel[j][0], LEFT, buff=0.25) for j in range(NJ)])
        self.add(self.kot, self.kol, self.bar)

    def pos(self, j, k):
        return self.sel[j][k].get_center()


class Bab1(BabScene):
    SEG = 1

    def beat_b1_1(self, b):
        g = Grid().move_to(LEFT * 3.0 + DOWN * 0.2); self.g = g
        jud = TB("Jadwal pelajaran", 40, INK).next_to(g, UP, buff=0.35)
        self.play_at(b.at("jadwal pelajaran"), FadeIn(g.kot, lag_ratio=0.02), FadeIn(g.kol), FadeIn(g.bar), FadeIn(jud), dur=1.0)
        a1 = VGroup(TB("40", 90, AI), T("guru", 34, INK2)).arrange(RIGHT, buff=0.25, aligned_edge=DOWN).move_to(RIGHT * SX + UP * 1.4)
        a2 = VGroup(TB("30", 90, PRIMA), T("kelas", 34, INK2)).arrange(RIGHT, buff=0.25, aligned_edge=DOWN).move_to(RIGHT * SX + DOWN * 0.1)
        self.play_at(b.at("empat puluh guru"), FadeIn(a1, shift=LEFT * 0.3), dur=0.5)
        self.play_at(b.at("tiga puluh kelas"), FadeIn(a2, shift=LEFT * 0.3), dur=0.5)
        k1 = kartu_guru(0, g.pos(1, 1)); k2 = kartu_guru(0, g.pos(1, 4))
        self.play_at(b.at("tidak boleh"), FadeIn(k1, shift=DOWN * 0.4), FadeIn(k2, shift=DOWN * 0.4), dur=0.6)
        m1 = SurroundingRectangle(k1, color=NOL, buff=0.03, stroke_width=6); m2 = SurroundingRectangle(k2, color=NOL, buff=0.03, stroke_width=6)
        bt = TB("bentrok", 40, NOL).move_to(RIGHT * SX + DOWN * 1.7)
        self.play_at(b.at("dua kelas"), Create(m1), Create(m2), FadeIn(bt, scale=1.2), dur=0.6)
        self.jud = jud; self.sisi = VGroup(a1, a2); self.r1 = VGroup(k1, k2, m1, m2, bt)

    def beat_b1_2(self, b):
        g = self.g; rnd = random.Random(2)
        hit = ValueTracker(1)
        ctr = always_redraw(lambda: VGroup(T("percobaan ke", 28, INK2), TB(angka(int(hit.get_value())), 60, INK)).arrange(DOWN, buff=0.15).move_to(RIGHT * SX + DOWN * 0.2))
        self.play_at(b.at("Menyusun"), FadeOut(self.r1), FadeOut(self.sisi), FadeIn(ctr), dur=0.5)
        t_akhir = b.speech_end; ronde = 0; lama = None
        while self.now < t_akhir - 1.2:
            isi = [[rnd.randrange(len(GURU)) for _ in range(NK)] for _ in range(NJ)]
            kartu = VGroup(*[kartu_guru(isi[j][k], g.pos(j, k)) for j in range(NJ) for k in range(NK)])
            merah = VGroup()
            for j in range(NJ):
                for k in range(NK):
                    if isi[j].count(isi[j][k]) > 1:
                        merah.add(SurroundingRectangle(kartu[j * NK + k], color=NOL, buff=0.02, stroke_width=5))
            an = [FadeIn(kartu, lag_ratio=0.01)] + ([FadeOut(lama)] if lama else [])
            self.play(*an, hit.animate.set_value(hit.get_value() * 7 + 3), run_time=0.45)
            self.play(Create(merah, lag_ratio=0), run_time=0.3)
            self.wait(0.25)
            lama = VGroup(kartu, merah); ronde += 1
        banyak = muat(TB("pilihannya sangat banyak", 34, NOL)).move_to(RIGHT * SX + DOWN * 1.9)
        self.play(FadeIn(banyak, shift=UP * 0.2), run_time=0.4)
        ctr.clear_updaters()
        self.r2 = VGroup(lama, ctr, banyak)

    def beat_b1_3(self, b):
        g = self.g; isi = jadwal_benar()
        kartu = VGroup(*[kartu_guru(isi[j][k], g.pos(j, k)) for j in range(NJ) for k in range(NK)])
        self.play_at(b.at("jadwal yang sudah jadi"), FadeOut(self.r2), FadeIn(kartu, lag_ratio=0.02), dur=0.9)
        lab = VGroup(T("memeriksa:", 30, INK2), TB("beberapa menit", 46, LEAN)).arrange(DOWN, buff=0.15).move_to(RIGHT * SX + UP * 0.6)
        self.play_at(b.at("memeriksanya"), FadeIn(lab, shift=UP * 0.2), dur=0.5)
        t0 = b.at("baris demi baris"); cek = VGroup()
        sorot = Rectangle(width=NK * SW + 0.1, height=SH, stroke_color=LEAN, stroke_width=5, fill_color=LEAN, fill_opacity=0.12).move_to(g.pos(0, 0), aligned_edge=LEFT).shift(LEFT * (SW / 2 + 0.05))
        self.play_at(t0, FadeIn(sorot), dur=0.25)
        per = max(0.2, (b.at("memastikan") - t0 - 0.4) / NJ)
        for j in range(NJ):
            c = centang(0.24).next_to(g.sel[j][NK - 1], RIGHT, buff=0.25); cek.add(c)
            self.play(sorot.animate.move_to([sorot.get_x(), g.pos(j, 0)[1], 0]), run_time=per * 0.55)
            self.play(FadeIn(c, scale=1.6), run_time=per * 0.45)
        ok = muat(TB("tidak ada yang bentrok", 34, LEAN)).move_to(RIGHT * SX + DOWN * 1.2)
        self.play_at(b.at("memastikan"), FadeOut(sorot), FadeIn(ok, shift=UP * 0.2), dur=0.5)
        self.r3 = VGroup(g, self.jud, kartu, cek); self.sisi3 = VGroup(lab, ok)

    def beat_b1_4(self, b):
        np_ = Ellipse(width=11.6, height=6.4, stroke_color=AI, stroke_width=5, fill_color="#13202B", fill_opacity=1).move_to(DOWN * 0.1)
        lnp = TB("NP", 80, AI).move_to(np_.get_top() + DOWN * 1.05 + RIGHT * 1.6)
        ket = T("jawabannya cepat diperiksa", 30, AI).next_to(lnp, DOWN, buff=0.12)
        mini = self.r3
        self.play_at(b.at("Soal yang jawabannya"), FadeOut(self.sisi3), mini.animate.scale(0.36).move_to(RIGHT * 2.9 + DOWN * 1.3), dur=0.9)
        self.play_at(b.at("dikumpulkan"), FadeIn(np_), dur=0.6)
        self.bring_to_front(mini)
        self.play_at(b.at("diberi nama"), FadeIn(lnp, scale=1.3), FadeIn(ket), dur=0.6)
        mlab = T("menyusun jadwal", 22, INK2).next_to(mini, DOWN, buff=0.12)
        self.play(FadeIn(mlab), run_time=0.3)
        self.np_ = np_; self.lnp = VGroup(lnp, ket); self.mini = VGroup(mini, mlab)

    def beat_b1_5(self, b):
        p = Ellipse(width=4.6, height=3.5, stroke_color=LEAN, stroke_width=5, fill_color="#14261D", fill_opacity=1).move_to(LEFT * 2.7 + DOWN * 0.5)
        lp = TB("P", 70, LEAN).move_to(p.get_top() + DOWN * 0.62)
        ket = T("cepat dicari", 28, LEAN).next_to(lp, DOWN, buff=0.08)
        self.play_at(b.at("cepat dicari"), FadeIn(p), dur=0.6)
        tinggi = [0.9, 0.4, 1.1, 0.6, 0.25, 0.75]
        bars = VGroup(*[Rectangle(width=0.22, height=h, fill_color=INK, fill_opacity=0.9, stroke_width=0) for h in tinggi]).arrange(RIGHT, buff=0.1, aligned_edge=DOWN).move_to(p.get_center() + DOWN * 0.45)
        sl = T("mengurutkan nama", 22, INK2).next_to(bars, DOWN, buff=0.12)
        self.play_at(b.at("mengurutkan"), FadeIn(bars), FadeIn(sl), dur=0.4)
        urut = sorted(range(6), key=lambda i: tinggi[i]); xs = sorted(x.get_x() for x in bars)
        self.play(*[bars[i].animate.set_x(xs[r]) for r, i in enumerate(urut)], run_time=0.9)
        self.play_at(b.at("bernama"), FadeIn(lp, scale=1.3), FadeIn(ket), dur=0.6)
        self.p = p; self.lp = VGroup(lp, ket); self.srt = VGroup(bars, sl)

    def beat_b1_6(self, b):
        p = self.p
        tanya = TB("P = NP ?", 60, PRIMA).to_edge(UP, buff=0.25)
        self.play_at(b.at("Apakah setiap soal"), FadeOut(self.srt), FadeOut(self.lp[1]), dur=0.4)
        besar = Ellipse(width=11.2, height=6.0, stroke_color=LEAN, stroke_width=5, fill_color="#14261D", fill_opacity=0.55).move_to(self.np_)
        asli = p.copy()
        self.play_at(b.at("sebenarnya juga cepat dicari"), Transform(p, besar), self.lp[0].animate.move_to(LEFT * 3.4 + UP * 1.6), dur=1.6, rate_func=rate_functions.ease_in_out_sine)
        self.play_at(b.at("hanya saja"), FadeIn(tanya, scale=1.2), dur=0.5)
        self.play_at(b.at("belum menemukan"), Transform(p, asli), self.lp[0].animate.move_to(asli.get_top() + DOWN * 0.62), dur=1.2, rate_func=rate_functions.ease_in_out_sine)
        self.tanya = tanya

    def beat_b1_7(self, b):
        semua = VGroup(self.np_, self.lnp, self.mini, self.p, self.lp[0])
        besar = TB("P = NP ?", 150, INK).move_to(UP * 0.9)
        self.play_at(b.at("Itulah"), FadeOut(semua), ReplacementTransform(self.tanya, besar), dur=0.8)
        th = T("terbuka sejak 1971", 36, INK2).next_to(besar, DOWN, buff=0.45)
        self.play_at(b.at("lebih dari lima puluh tahun"), FadeIn(th, shift=UP * 0.2), dur=0.5)
        uang = TB("US$1.000.000", 80, PRIMA).next_to(th, DOWN, buff=0.5)
        ku = T("Millennium Prize Problem", 26, DIM).next_to(uang, DOWN, buff=0.2)
        self.play_at(b.at("hadiahnya"), FadeIn(uang, scale=1.2), FadeIn(ku), dur=0.6)
        self.r7 = VGroup(besar, th, uang, ku)

    def beat_b1_8(self, b):
        gunung = Polygon([-6.2, -3.2, 0], [-2.6, 2.9, 0], [-1.7, 1.6, 0], [-1.0, 2.2, 0], [1.6, -3.2, 0], fill_color="#1B2433", fill_opacity=1, stroke_color=INK2, stroke_width=4)
        salju = Polygon([-2.6, 2.9, 0], [-3.25, 1.8, 0], [-2.7, 2.05, 0], [-2.2, 1.7, 0], [-1.95, 1.95, 0], fill_color=INK, fill_opacity=0.9, stroke_width=0)
        l1 = TB("P vs NP", 44, INK).move_to([-2.4, -1.0, 0])
        bukit = Polygon([1.0, -3.2, 0], [3.9, -0.4, 0], [6.6, -3.2, 0], fill_color="#1D2B22", fill_opacity=1, stroke_color=LEAN, stroke_width=4)
        l2 = TB("versi yang\nlebih jinak", 34, LEAN, line_spacing=1.0).move_to([3.9, -2.2, 0])
        tanah = Line(LEFT * 7.2 + DOWN * 3.2, RIGHT * 7.2 + DOWN * 3.2, color=GARIS, stroke_width=4)
        self.play_at(b.at("Karena soal ini"), FadeOut(self.r7), FadeIn(VGroup(tanah, gunung, salju), shift=UP * 0.4), FadeIn(l1), dur=0.9)
        self.play_at(b.at("versi yang lebih jinak"), FadeIn(bukit, shift=UP * 0.4), FadeIn(l2), dur=0.8)
        tanya = TB("?", 80, LEAN).next_to(bukit, UP, buff=0.2)
        self.play_at(b.at("didalami"), FadeIn(tanya, scale=1.4), dur=0.5)
