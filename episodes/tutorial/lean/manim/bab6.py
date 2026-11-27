from kit import *

W, H = 12.6, 6.2


def bingkai():
    """Jendela editor kode generik (ilustrasi tampilan VS Code, digambar dengan kode)."""
    badan = RoundedRectangle(width=W, height=H, corner_radius=0.16, fill_color="#1B2130", fill_opacity=1, stroke_color=GARIS, stroke_width=2)
    bar = Rectangle(width=W, height=0.46, fill_color="#232A3B", fill_opacity=1, stroke_width=0).align_to(badan, UP)
    titik = VGroup(*[Dot(radius=0.06, color=c) for c in ("#FF5F57", "#FEBC2E", "#28C840")]).arrange(RIGHT, buff=0.12).next_to(bar.get_left(), RIGHT, buff=0.25)
    jud = T("Visual Studio Code", 20, INK2).move_to(bar)
    sisi = Rectangle(width=0.7, height=H - 0.46, fill_color="#151A26", fill_opacity=1, stroke_width=0).align_to(badan, LEFT).align_to(badan, DOWN)
    ik = VGroup()
    for i in range(4):
        ik.add(RoundedRectangle(width=0.34, height=0.34, corner_radius=0.06, stroke_color=DIM, stroke_width=3).move_to(sisi.get_top() + DOWN * (0.5 + i * 0.62)))
    # ikon Extensions: empat kotak kecil, satu terangkat
    e = ik[3]; kot = VGroup(*[Square(side_length=0.13, stroke_color=DIM, stroke_width=3) for _ in range(4)])
    kot[0].move_to(e.get_center() + LEFT * 0.08 + DOWN * 0.08); kot[1].move_to(e.get_center() + LEFT * 0.08 + UP * 0.08); kot[2].move_to(e.get_center() + RIGHT * 0.08 + DOWN * 0.08); kot[3].move_to(e.get_center() + RIGHT * 0.13 + UP * 0.13)
    ik.remove(e); ik.add(kot)
    return VGroup(badan, bar, titik, jud, sisi, ik)


class Bab6(BabScene):
    SEG = 6

    def beat_b6_1(self, b):
        jud = TB("Memasang Lean dalam 3 langkah", 46, INK).to_edge(UP, buff=0.8)
        isi = ["Pasang Visual Studio Code", "Pasang ekstensi Lean 4", "Buat berkas berakhiran .lean"]
        brs = VGroup()
        for i, s in enumerate(isi):
            n = VGroup(Circle(radius=0.36, fill_color=PRIMA, fill_opacity=1, stroke_width=0), TB(str(i + 1), 36, BG)); brs.add(VGroup(n, T(s, 40, INK)).arrange(RIGHT, buff=0.4))
        brs.arrange(DOWN, buff=0.55, aligned_edge=LEFT).move_to(DOWN * 0.3)
        self.play_at(b.start + 0.3, FadeIn(jud), dur=0.5)
        self.play_at(b.at("pasang Lean di komputermu"), LaggedStart(*[FadeIn(r, shift=RIGHT * 0.2) for r in brs], lag_ratio=0.3), dur=1.4)
        self.s1 = VGroup(jud, brs)

    def beat_b6_2(self, b):
        self.w = bingkai().move_to(DOWN * 0.35)
        self.cap = TB("1. Pasang Visual Studio Code", 34, PRIMA).to_edge(UP, buff=0.35)
        url = kode("code.visualstudio.com", 30, LEAN); ket = T("gratis, untuk Windows, macOS, dan Linux", 26, INK2)
        self.tengah = VGroup(url, ket).arrange(DOWN, buff=0.3).move_to(self.w[0].get_center() + RIGHT * 0.35)
        ilu = T("Ilustrasi tampilan. Nama menu sama dengan aplikasi aslinya.", 20, DIM).to_edge(DOWN, buff=0.18)
        self.play_at(b.at("pasang Visual Studio Code"), FadeOut(self.s1), FadeIn(self.w), FadeIn(self.cap), FadeIn(ilu), dur=0.6)
        self.play(FadeIn(self.tengah), run_time=0.4)

    def ganti_cap(self, s):
        baru = TB(s, 34, PRIMA).to_edge(UP, buff=0.35); lama = self.cap; self.cap = baru
        return [FadeOut(lama), FadeIn(baru)]

    def beat_b6_3(self, b):
        w = self.w; ext = w[5][-1]
        sor = SurroundingRectangle(ext, color=PRIMA, buff=0.12, stroke_width=5, corner_radius=0.08)
        self.play_at(b.at("buka menu Extensions"), FadeOut(self.tengah), *self.ganti_cap("2. Pasang ekstensi Lean 4"), Create(sor), ext.animate.set_stroke(INK), dur=0.6)
        lab = T("Extensions", 24, PRIMA).next_to(sor, RIGHT, buff=0.2)
        pan = Rectangle(width=4.6, height=H - 0.46, fill_color="#171C28", fill_opacity=1, stroke_color=GARIS, stroke_width=1).next_to(w[4], RIGHT, buff=0).align_to(w[4], DOWN)
        cari = RoundedRectangle(width=4.1, height=0.56, corner_radius=0.1, fill_color="#0B0E14", fill_opacity=1, stroke_color=AI, stroke_width=2).move_to(pan.get_top() + DOWN * 0.95)
        jp = T("EXTENSIONS", 18, INK2).move_to(pan.get_top() + DOWN * 0.38).align_to(cari, LEFT)
        self.play(FadeIn(lab), run_time=0.3)
        self.play_at(b.at("lalu cari"), FadeOut(lab), FadeIn(pan), FadeIn(cari), FadeIn(jp), dur=0.5)
        q = kode("Lean 4", 26, INK).move_to(cari).align_to(cari, LEFT).shift(RIGHT * 0.2)
        self.play(AddTextLetterByLetter(q, time_per_char=0.12), run_time=0.8)
        hasil = RoundedRectangle(width=4.3, height=1.25, corner_radius=0.08, fill_color="#232A3B", fill_opacity=1, stroke_width=0).next_to(cari, DOWN, buff=0.3)
        logo = RoundedRectangle(width=0.8, height=0.8, corner_radius=0.1, fill_color=BG, fill_opacity=1, stroke_color=LEAN, stroke_width=3).move_to(hasil.get_left() + RIGHT * 0.65)
        lg = TB("L∃∀N", 15, LEAN).move_to(logo)
        nm = TB("Lean 4", 26, INK).move_to(hasil.get_left() + RIGHT * 1.75 + UP * 0.28); pb = T("leanprover", 22, INK2).next_to(nm, DOWN, buff=0.12, aligned_edge=LEFT)
        tb = RoundedRectangle(width=1.15, height=0.44, corner_radius=0.06, fill_color="#2F6FE4", fill_opacity=1, stroke_width=0).move_to(hasil.get_right() + LEFT * 0.78 + DOWN * 0.25); tt = TB("Install", 20, WHITE).move_to(tb)
        self.play(FadeIn(VGroup(hasil, logo, lg, nm, pb, tb, tt)), run_time=0.4)
        s2 = SurroundingRectangle(pb, color=PRIMA, buff=0.08, stroke_width=4, corner_radius=0.06)
        self.play_at(b.at("diterbitkan oleh leanprover"), Create(s2), dur=0.4)
        s3 = SurroundingRectangle(VGroup(tb, tt), color=PRIMA, buff=0.1, stroke_width=5, corner_radius=0.08)
        self.play_at(b.at("klik Install"), FadeOut(s2), Create(s3), dur=0.4)
        self.s3 = VGroup(sor, s3); self.pan = VGroup(pan, cari, jp, q, hasil, logo, lg, nm, pb, tb, tt)

    def beat_b6_4(self, b):
        w = self.w; x0 = self.pan[0].get_right()[0]; lebar = w[0].get_right()[0] - x0
        area = Rectangle(width=lebar, height=H - 0.46, stroke_width=0, fill_opacity=0).align_to(w[0], RIGHT).align_to(w[0], DOWN)
        jd = TB("Lean 4 Setup", 34, INK).move_to(area.get_top() + DOWN * 0.6)
        langkah = ["Books and Documentation", "Install Lean", "Set Up Lean 4 Project", "Questions and Troubleshooting"]
        ls = VGroup(*[VGroup(Circle(radius=0.13, stroke_color=INK2, stroke_width=3), T(s, 26, INK)).arrange(RIGHT, buff=0.25) for s in langkah]).arrange(DOWN, buff=0.36, aligned_edge=LEFT).next_to(jd, DOWN, buff=0.45)
        self.play_at(b.at("membuka panduan pemasangan"), FadeOut(self.s3), *self.ganti_cap("2. Ikuti panduan Lean 4 Setup"), FadeIn(jd), FadeIn(ls, lag_ratio=0.15), dur=0.9)
        pn = Arrow(ls[0].get_left() + LEFT * 0.5 + UP * 0.2, ls[-1].get_left() + LEFT * 0.5 + DOWN * 0.2, buff=0, color=PRIMA, stroke_width=6)
        self.play_at(b.at("dari atas ke bawah"), GrowArrow(pn), dur=0.8)
        s = SurroundingRectangle(ls[1], color=PRIMA, buff=0.14, stroke_width=5, corner_radius=0.08)
        self.play_at(b.at("klik tombol untuk memasang"), FadeOut(pn), Create(s), dur=0.5)
        rel = RoundedRectangle(width=lebar - 1.2, height=0.22, corner_radius=0.11, fill_color="#0B0E14", fill_opacity=1, stroke_color=GARIS, stroke_width=2).next_to(ls, DOWN, buff=0.55)
        isi = RoundedRectangle(width=lebar - 1.2, height=0.22, corner_radius=0.11, fill_color=LEAN, fill_opacity=1, stroke_width=0).move_to(rel)
        lt = T("mengunduh Lean…", 22, INK2).next_to(rel, DOWN, buff=0.18)
        self.play_at(b.at("Ekstensi akan mengunduh"), FadeIn(rel), FadeIn(lt), dur=0.3)
        self.play(GrowFromEdge(isi, LEFT), run_time=max(1.0, b.at("pastikan internetmu") - self.now + 1.2), rate_func=linear)
        self.s4 = VGroup(jd, ls, s, rel, isi, lt)

    def beat_b6_5(self, b):
        w = self.w
        tab = VGroup(Rectangle(width=2.6, height=0.5, fill_color="#1B2130", fill_opacity=1, stroke_color=AI, stroke_width=2), kode("pertama.lean", 22, INK))
        tab.move_to(w[4].get_corner(UR) + RIGHT * 1.35 + DOWN * 0.27)
        self.play_at(b.at("buat berkas baru"), FadeOut(self.s4), FadeOut(self.pan), *self.ganti_cap("3. Buat berkas pertama.lean"), dur=0.6)
        self.play_at(b.at("pertama titik lean"), FadeIn(tab), dur=0.4)
        no = kode("1", 26, DIM).move_to(w[4].get_corner(UR) + RIGHT * 0.4 + DOWN * 1.2)
        kd = VGroup(kode("theorem", 26, AI), kode("dua_tambah_dua : 2 + 2 = 4 := rfl", 26, INK)).arrange(RIGHT, buff=0.22).next_to(no, RIGHT, buff=0.35)
        self.play_at(b.at("Ketik lagi"), FadeIn(no), AddTextLetterByLetter(kd[0], time_per_char=0.06), dur=0.6)
        self.play(AddTextLetterByLetter(kd[1], time_per_char=0.06), run_time=2.2)
        self.tab = tab; self.kd = VGroup(no, kd)

    def beat_b6_6(self, b):
        w = self.w
        inf = Rectangle(width=4.3, height=H - 0.46, fill_color="#171C28", fill_opacity=1, stroke_color=GARIS, stroke_width=1).align_to(w[0], RIGHT).align_to(w[0], DOWN)
        ji = TB("Lean Infoview", 24, INK).move_to(inf.get_top() + DOWN * 0.4)
        isi = VGroup(T("▼ pertama.lean:1:41", 20, INK2), T("No info found.", 20, INK2)).arrange(DOWN, buff=0.2, aligned_edge=LEFT).next_to(ji, DOWN, buff=0.35)
        self.play_at(b.at("panel Lean Infoview"), self.kd.animate.scale(0.74, about_point=self.kd.get_left()), FadeIn(inf), FadeIn(ji), FadeIn(isi), dur=0.6)
        s = SurroundingRectangle(inf, color=PRIMA, buff=-0.06, stroke_width=5)
        self.play(Create(s), run_time=0.5)
        ok = VGroup(centang(0.3), TB("Pemasangan berhasil", 34, LEAN)).arrange(RIGHT, buff=0.3).move_to(w[0].get_center() + LEFT * 1.6 + DOWN * 1.2)
        self.play_at(b.at("pemasanganmu berhasil"), FadeOut(s), FadeIn(ok, scale=1.1), dur=0.5)
        self.inf = VGroup(inf, ji, isi); self.ok = ok

    def beat_b6_7(self, b):
        w = self.w
        sim = TB("∀", 30, INK).move_to(w[0].get_corner(UR) + LEFT * 0.5 + DOWN * 0.73)
        s = SurroundingRectangle(sim, color=PRIMA, buff=0.1, stroke_width=5, corner_radius=0.08)
        self.play_at(b.at("ingin memakai Mathlib"), FadeOut(self.ok), *self.ganti_cap("Proyek yang memakai Mathlib"), FadeIn(sim), dur=0.5)
        self.play_at(b.at("Klik simbol"), Create(s), dur=0.4)
        def menu(baris, aktif):
            g = VGroup(*[T(x, 24, INK) for x in baris]).arrange(DOWN, buff=0.26, aligned_edge=LEFT)
            k = RoundedRectangle(width=g.width + 0.7, height=g.height + 0.5, corner_radius=0.08, fill_color="#232A3B", fill_opacity=1, stroke_color=GARIS, stroke_width=2).move_to(g)
            h = RoundedRectangle(width=g.width + 0.5, height=0.5, corner_radius=0.06, fill_color="#2F6FE4", fill_opacity=0.9, stroke_width=0).move_to(g[aktif]).align_to(k, LEFT).shift(RIGHT * 0.1)
            return VGroup(k, h, g)
        m1 = menu(["New Project…", "Open Project…", "Project Actions…", "Documentation…"], 0).next_to(s, DOWN, buff=0.15).align_to(w[0], RIGHT).shift(LEFT * 0.25)
        self.play_at(b.at("pilih New Project"), FadeIn(m1, shift=DOWN * 0.1), dur=0.4)
        m2 = menu(["Create Standalone Project…", "Create Project Using Mathlib…"], 1).next_to(m1, LEFT, buff=0.1).align_to(m1, UP)
        self.play_at(b.at("lalu pilih proyek"), FadeIn(m2, shift=LEFT * 0.1), dur=0.4)
        unduh = chip("unduhan pertama cukup besar", ORANYE, 26).move_to(w[0].get_center() + LEFT * 2.2 + DOWN * 2.2)
        self.play_at(b.at("Unduhan pertamanya"), FadeIn(unduh), dur=0.4)
