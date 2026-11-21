from kit import *
import random


def graf_teorema(level=(7, 6, 4, 2, 1), seed=4):
    """DAG teorema: tiap level memakai teorema dari level di bawahnya."""
    rnd = random.Random(seed); lv = []; panah = VGroup()
    for i, n in enumerate(level):
        row = VGroup(*[VGroup(RoundedRectangle(width=1.1, height=0.5, corner_radius=0.1, fill_color=PANEL, fill_opacity=1, stroke_color=LEAN, stroke_width=2),
                              T("✓", 20, LEAN)) for _ in range(n)]).arrange(RIGHT, buff=0.45)
        row.move_to(DOWN * 3.0 + UP * i * 1.2)
        for x in row: x[1].move_to(x[0])
        lv.append(row)
    sisi = []
    for i in range(1, len(lv)):
        for j, atas in enumerate(lv[i]):
            bawah = lv[i - 1]
            pilih = sorted(set([min(len(bawah) - 1, int(j * len(bawah) / len(lv[i])) + k) for k in range(2)]))
            if len(bawah) > 3: pilih.append(rnd.randrange(len(bawah)))
            for k in sorted(set(pilih)):
                a = Arrow(bawah[k][0].get_top(), atas[0].get_bottom(), buff=0.05, stroke_width=2, color=GARIS, max_tip_length_to_length_ratio=0.08)
                panah.add(a); sisi.append(((i - 1, k), (i, j), a))
    return lv, panah, sisi


class Bab5(BabScene):
    SEG = 5

    def beat_b5_1(self, b):
        win = jendela("Editor Kode", 11, 4.2).shift(UP * 0.4)
        ln = kode('let umur: number = "tujuh belas";', 30).move_to(win[0]).shift(UP * 0.5)
        self.play_at(b.at("Kalau"), FadeIn(win, scale=0.95), dur=0.5)
        self.play(AddTextLetterByLetter(ln, time_per_char=0.03), run_time=1.0)
        und = Line(ln[15].get_corner(DL), ln[-2].get_corner(DR), color=NOL, stroke_width=4).shift(DOWN * 0.08)
        err = kode("error: Type 'string' is not assignable to type 'number'.", 22, NOL).next_to(ln, DOWN, buff=0.5)
        if err.width > 10.2: err.scale_to_fit_width(10.2)
        err.align_to(win[0], LEFT).shift(RIGHT * 0.4)
        self.play_at(b.at("menolak"), Create(und), FadeIn(err, shift=UP * 0.1), dur=0.6)
        self.r1 = VGroup(ln, und, err); self.win = win

    def beat_b5_2(self, b):
        win2 = jendela("Editor Lean", 11, 4.2).shift(UP * 0.4)
        self.play_at(b.at("Lean"), FadeOut(self.r1), Transform(self.win, win2), dur=0.7)
        sub = T("yang diperiksa: bukti matematika", 30, LEAN).next_to(self.win, DOWN, buff=0.35)
        self.play_at(b.at("bukti matematika"), FadeIn(sub, shift=UP * 0.2), dur=0.5)
        self.sub = sub

    def beat_b5_3(self, b):
        self.play_at(b.at("Mari"), FadeOut(self.sub), self.win.animate.shift(LEFT * 2.2).stretch_to_fit_width(8.4), dur=0.6)
        info = panel(4.0, 4.2).next_to(self.win, RIGHT, buff=0.2)
        it = T("Hasil pemeriksaan", 22, INK2).next_to(info.get_top(), DOWN, buff=0.25)
        self.play(FadeIn(info), FadeIn(it), run_time=0.4)
        ln = kode("theorem dua_tambah_dua :", 28).move_to(self.win[0].get_corner(UL) + RIGHT * 0.5 + DOWN * 1.0, aligned_edge=LEFT)
        ln2 = kode("  2 + 2 = 4 := by rfl", 28)
        ln2 = blok_kode(["  2 + 2 = 4 := by rfl"], 28)[0].next_to(ln, DOWN, buff=0.3).align_to(ln, LEFT).shift(RIGHT * 0.35)
        self.play_at(b.at("contoh kecil"), AddTextLetterByLetter(ln, time_per_char=0.04), dur=1.0)
        self.play_at(b.at("dua tambah dua"), AddTextLetterByLetter(ln2, time_per_char=0.05), dur=1.0)
        self.r3 = dict(info=info, it=it, ln=ln, ln2=ln2)

    def beat_b5_4(self, b):
        r = self.r3
        cek = VGroup(Circle(radius=0.6, fill_color=LEAN, fill_opacity=1, stroke_width=0), T("✓", 54, BG, weight=BOLD)).move_to(r["info"]).shift(UP * 0.2)
        ng = kode("No goals", 26, LEAN).next_to(cek, DOWN, buff=0.35)
        self.play_at(b.at("memeriksa"), Indicate(r["ln2"], color=LEAN, scale_factor=1.05), dur=0.7)
        self.play_at(b.at("centang"), GrowFromCenter(cek), FadeIn(ng), dur=0.6)
        self.r3.update(cek=cek, ng=ng)

    def beat_b5_5(self, b):
        r = self.r3
        empat = r["ln2"][4]
        lima = kode("5", 28, ORANYE).move_to(empat)
        self.play_at(b.at("Sekarang"), FadeOut(r["cek"]), FadeOut(r["ng"]), dur=0.4)
        self.play_at(b.at("lima"), Transform(empat, lima), dur=0.6)

    def beat_b5_6(self, b):
        r = self.r3
        und = Line(r["ln2"][0].get_corner(DL), r["ln2"][-1].get_corner(DR), color=NOL, stroke_width=4).shift(DOWN * 0.08)
        x = VGroup(Circle(radius=0.6, fill_color=NOL, fill_opacity=1, stroke_width=0), T("✗", 54, BG, weight=BOLD)).move_to(r["info"]).shift(UP * 0.2)
        er = kode("error: rfl gagal", 24, NOL).next_to(x, DOWN, buff=0.35)
        self.play_at(b.at("menolak"), Create(und), GrowFromCenter(x), FadeIn(er), Wiggle(r["ln2"]), dur=0.9)
        self.r6 = VGroup(self.win, r["info"], r["it"], r["ln"], r["ln2"], und, x, er)

    def beat_b5_7(self, b):
        self.play_at(b.at("Bukti"), FadeOut(self.r6), dur=0.5)
        lv, panah, sisi = graf_teorema()
        self.lv, self.panah, self.sisi = lv, panah, sisi
        for i, row in enumerate(lv):
            pr = VGroup(*[a for (lo, hi, a) in sisi if hi[0] == i])
            self.play(LaggedStart(*[FadeIn(x, shift=UP * 0.15) for x in row], lag_ratio=0.08), Create(pr), run_time=0.7)
        lb = T("setiap teorema hanya memakai teorema yang sudah diperiksa", 26, INK2).to_edge(UP, buff=0.3)
        self.play_at(b.at("hanya boleh"), FadeIn(lb), dur=0.5)
        self.lb7 = lb

    def beat_b5_8(self, b):
        lv, sisi = self.lv, self.sisi
        mati = {(1, 2)}
        self.play_at(b.at("Kalau satu"), lv[1][2][0].animate.set_stroke(NOL, 4).set_fill("#3B1E24"), Transform(lv[1][2][1], T("✗", 20, NOL).move_to(lv[1][2][1])), dur=0.6)
        for lvl in range(2, len(lv)):
            kena = {(hi) for (lo, hi, a) in sisi if lo in mati and hi[0] == lvl}
            if not kena: continue
            ar = [a for (lo, hi, a) in sisi if lo in mati and hi in kena]
            self.play(*[a.animate.set_color(NOL) for a in ar],
                      *[lv[l][j][0].animate.set_stroke(NOL, 4).set_fill("#3B1E24") for (l, j) in kena],
                      *[Transform(lv[l][j][1], T("✗", 20, NOL).move_to(lv[l][j][1])) for (l, j) in kena], run_time=0.5)
            mati |= kena
        gagal = TB("BUILD GAGAL", 40, NOL).next_to(lv[-1], RIGHT, buff=0.6)
        self.play_at(b.at("build"), FadeIn(gagal, scale=1.3), dur=0.4)
        self.gagal = gagal

    def beat_b5_9(self, b):
        semua = VGroup(*self.lv, self.panah, self.gagal, self.lb7)
        self.play_at(b.at("Karena"), FadeOut(semua, scale=0.6), dur=0.7)
        # graf raksasa (titik-titik) mengelilingi inti kecil
        rnd = random.Random(9)
        titik = VGroup(*[Dot([rnd.uniform(-6.8, 6.8), rnd.uniform(-3.6, 3.6), 0], radius=0.03, color=LEAN).set_opacity(0.5) for _ in range(900)])
        inti = VGroup(RoundedRectangle(width=3.6, height=1.0, corner_radius=0.15, fill_color=BG, fill_opacity=1, stroke_color=PRIMA, stroke_width=4),
                      T("inti Lean (kernel)", 26, PRIMA))
        inti[1].move_to(inti[0])
        self.play(FadeIn(titik, lag_ratio=0.002), run_time=1.2)
        self.play_at(b.at("pemeriksanya"), FadeIn(inti, scale=0.6), dur=0.6)
        gel = [Circle(radius=0.8, color=PRIMA, stroke_width=3).move_to(inti) for _ in range(3)]
        self.play(LaggedStart(*[c.animate(rate_func=rate_functions.ease_out_sine).scale(9).set_stroke(opacity=0) for c in gel], lag_ratio=0.35),
                  titik.animate.set_color(LEAN).set_opacity(0.9), run_time=1.8)
        kecil = T("program kecil yang memeriksa setiap langkah", 26, INK2).next_to(inti, DOWN, buff=0.35)
        self.play(FadeIn(kecil), run_time=0.4)
        self.r9 = VGroup(titik, inti, kecil, *gel)

    def beat_b5_10(self, b):
        self.play_at(b.at("Itulah"), FadeOut(self.r9), dur=0.6)
        q = TB("“Peluang ada yang janggal\ndi sini hampir nol.”", 60, INK, line_spacing=1.1)
        en = T("“The chance that anything is fishy here is approximately zero.”", 24, INK2).next_to(q, DOWN, buff=0.4)
        src = T("Andrew Sutherland, MIT", 24, DIM).next_to(en, DOWN, buff=0.2)
        self.play_at(b.at("peluang"), FadeIn(q, scale=1.05), FadeIn(en), FadeIn(src), dur=0.8)
