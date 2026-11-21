"""Short vertikal D07 (1080x1920), sinkron dengan short/timeline.json.
  D07_TL=../short/timeline.json manim -qh -r 1080,1920 --fps 30 short.py ShortD07
(dipanggil oleh render_short.py di folder ini)"""
import os, re
os.environ.setdefault("D07_TL", os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "short", "timeline.json"))
from kit import *
from bab0 import baris_kode
from subtitle import tampil, klausa

config.frame_width = 9.0
config.frame_height = 16.0

KAIT = "Siapa yang Memeriksa Bukti\nSepanjang 250.000 Halaman?"


def cues_beat(b):
    """(mulai, teks) per klausa, waktu relatif awal Short."""
    out = []; i = 0
    for s, t in zip(klausa(b.text), klausa(tampil(b.text))):
        n = len(s.split())
        if i < len(b.words): out.append((b.t0 + b.words[i][1], t))
        i += n
    return out


def teks_cap(t):
    t = re.sub(r"(\d) \+ (\d) = (\d)", "\\1\u00a0+\u00a0\\2\u00a0=\u00a0\\3", t)   # rumus tidak dipecah
    w = t.split(" "); baris = [""]
    for x in w:
        if len(baris[-1]) + len(x) + 1 > 28 and baris[-1]: baris.append(x)
        else: baris[-1] = (baris[-1] + " " + x).strip()
    g = VGroup(*[TB(s, 36, INK) for s in baris]).arrange(DOWN, buff=0.14)
    bg = BackgroundRectangle(g, color=BG, fill_opacity=0.85, buff=0.2)
    return VGroup(bg, g).move_to(DOWN * 3.6, aligned_edge=UP)


class ShortD07(BabScene):
    SEG = 0

    def construct(self):
        # kait di atas, tetap sepanjang Short
        kait = TB(KAIT, 46, PRIMA, line_spacing=1.05)
        if kait.width > 8.4: kait.scale_to_fit_width(8.4)
        garis = Line(LEFT * 1.2, RIGHT * 1.2, color=PRIMA, stroke_width=6)
        atas = VGroup(kait, garis).arrange(DOWN, buff=0.3).move_to(UP * 6.6)
        stat = T("Status: klaim, per 21 November 2026", 24, INK2).next_to(atas, DOWN, buff=0.25)
        self.add(atas, stat)
        # subtitle besar (layar Short sering ditonton tanpa suara)
        semua = [c for b in self.B for c in cues_beat(b)]
        cap = teks_cap(semua[0][1]); cur = [0]

        def upd(m):
            t = self.renderer.time; k = max(i for i, (a, _) in enumerate(semua) if a <= t + 0.05) if t + 0.05 >= semua[0][0] else 0
            if k != cur[0]:
                cur[0] = k; m.become(teks_cap(semua[k][1]))
        cap.add_updater(upd); self.add(cap)
        super().construct()

    def beat_s1(self, b):
        tgl = TB("20 November 2026", 44, AI).move_to(UP * 3.4)
        self.play_at(b.at("Pada"), FadeIn(tgl, shift=DOWN * 0.2), dur=0.5)
        hr = TB("Hipotesis Riemann", 58, INK).move_to(UP * 1.8)
        sub = T("diklaim terbukti", 34, INK2).next_to(hr, DOWN, buff=0.25)
        self.play_at(b.at("klaim"), FadeIn(hr, scale=1.1), FadeIn(sub), dur=0.7)
        uang = TB("US$1.000.000", 72, PRIMA).move_to(DOWN * 0.7)
        self.play_at(b.at("satu juta"), FadeIn(uang, scale=1.2), dur=0.6)
        th = ValueTracker(1859)
        tahun = always_redraw(lambda: TB(f"{int(th.get_value())}", 54, INK).move_to(DOWN * 2.1))
        lbl = T("belum terpecahkan", 30, INK2).next_to(DOWN * 2.1, DOWN, buff=0.5)
        self.add(tahun)
        self.play_at(b.at("belum"), FadeIn(lbl), th.animate.set_value(2026), dur=1.8, rate_func=rate_functions.ease_in_out_cubic, sebelum=b.at("seratus") + 1.0)
        lama = TB("167 tahun", 54, PRIMA).move_to(DOWN * 2.1)
        self.play_at(b.at("seratus"), FadeOut(tahun), FadeIn(lama, scale=1.3), dur=0.5)
        self.r1 = VGroup(tgl, hr, sub, uang, lama, lbl); self.th = tahun

    def beat_s2(self, b):
        self.th.clear_updaters()
        self.play_at(b.at("Ia"), FadeOut(self.r1), dur=0.5)
        cl = VGroup(RoundedRectangle(width=4.6, height=1.0, corner_radius=0.5, fill_color=PANEL, fill_opacity=1, stroke_color=AI, stroke_width=4),
                    T("bersama Claude", 34, AI))
        cl[1].move_to(cl[0]); cl.move_to(UP * 3.6)
        self.play_at(b.at("Claude"), FadeIn(cl, scale=0.8), dur=0.5)
        win = jendela("bukti.lean (ilustrasi)", 8.2, 4.4).move_to(UP * 0.6)
        kd = baris_kode(10).scale(0.62).next_to(win[1], DOWN, buff=0.25).align_to(win[0], LEFT).shift(RIGHT * 0.3)
        self.play_at(b.at("kode Lean"), FadeIn(win, scale=0.95), LaggedStart(*[FadeIn(x, shift=RIGHT * 0.15) for x in kd], lag_ratio=0.08), dur=1.2)
        self.play_at(b.at("Kalau"), FadeOut(cl), VGroup(win, kd).animate.scale(0.5).move_to(UP * 3.2 + LEFT * 2.1), dur=0.7)
        tumpuk = VGroup()
        for i in range(30):
            h = Rectangle(width=2.6, height=0.13, fill_color="#F4F1E8", fill_opacity=1, stroke_color="#C9C2B0", stroke_width=1)
            h.move_to([2.2 + 0.03 * ((i * 7) % 5 - 2), -2.9 + i * 0.19, 0]); tumpuk.add(h)
        self.play(LaggedStart(*[FadeIn(h, shift=DOWN * 0.4) for h in tumpuk], lag_ratio=0.05), run_time=1.4)
        ang = TB("250.000+", 64, INK).move_to(LEFT * 1.9 + DOWN * 0.6)
        hal = T("halaman", 34, INK2).next_to(ang, DOWN, buff=0.2)
        src = T("perkiraan Thomas Bloom", 22, DIM).next_to(hal, DOWN, buff=0.2)
        self.play_at(b.at("dua ratus"), FadeIn(ang, scale=1.3), FadeIn(hal), FadeIn(src), dur=0.7)
        self.r2 = VGroup(win, kd, tumpuk, ang, hal, src); self.tumpuk = tumpuk

    def beat_s3(self, b):
        self.play_at(b.at("Tidak"), FadeOut(VGroup(self.r2[0], self.r2[1], self.r2[3], self.r2[4], self.r2[5])),
                     self.tumpuk.animate.move_to(UP * 0.5).stretch(1.15, 1), dur=0.8)
        tanya = TB("?", 200, PRIMA).move_to(UP * 0.3)
        self.play_at(b.at("siapa"), self.tumpuk.animate.set_opacity(0.2), FadeIn(tanya, scale=1.6), dur=0.6)
        self.r3 = VGroup(self.tumpuk, tanya)

    def beat_s4(self, b):
        self.play_at(b.at("Jawabannya"), FadeOut(self.r3), dur=0.4)
        c = Circle(radius=1.4, fill_color=PANEL, fill_opacity=1, stroke_color=LEAN, stroke_width=6).move_to(UP * 1.4)
        ck = T("✓", 90, LEAN, weight=BOLD).move_to(c)
        nm = TB("Lean", 64, LEAN).next_to(c, DOWN, buff=0.4)
        self.play_at(b.at("Lean"), GrowFromCenter(c), FadeIn(ck, scale=0.5), FadeIn(nm), dur=0.6)
        ket = T("compiler untuk\nbukti matematika", 38, INK, line_spacing=1.0).next_to(nm, DOWN, buff=0.4)
        self.play_at(b.at("compiler"), FadeIn(ket, shift=UP * 0.2), dur=0.5)
        self.r4 = VGroup(c, ck, nm, ket)

    def beat_s5(self, b):
        self.play_at(b.at("Kalau"), FadeOut(self.r4), dur=0.4)
        win = jendela("Editor Lean", 8.2, 3.0).move_to(UP * 2.4)
        kd = blok_kode(["theorem dua_tambah_dua :", "  2 + 2 = 4 := by rfl"], 30).move_to(win[0]).shift(DOWN * 0.2)
        self.play(FadeIn(win), run_time=0.3)
        self.play_at(b.at("dua tambah dua sama dengan empat"), AddTextLetterByLetter(kd[0], time_per_char=0.02), AddTextLetterByLetter(kd[1], time_per_char=0.03), dur=1.0)
        ok = VGroup(Circle(radius=0.8, fill_color=LEAN, fill_opacity=1, stroke_width=0), T("✓", 70, BG, weight=BOLD)).move_to(DOWN * 0.9)
        okl = T("diterima", 36, LEAN).next_to(ok, DOWN, buff=0.3)
        self.play_at(b.at("menerimanya"), GrowFromCenter(ok), FadeIn(okl), dur=0.5)
        empat = kd[1][4]
        lima = kode("5", 30, ORANYE).move_to(empat)
        self.play_at(b.at("lima"), FadeOut(ok), FadeOut(okl), Transform(empat, lima), dur=0.6)
        und = Line(kd[1].get_corner(DL), kd[1].get_corner(DR), color=NOL, stroke_width=5).shift(DOWN * 0.1)
        x = VGroup(Circle(radius=0.8, fill_color=NOL, fill_opacity=1, stroke_width=0), T("✗", 70, BG, weight=BOLD)).move_to(DOWN * 0.9)
        xl = T("bukti ditolak", 36, NOL, weight=BOLD).next_to(x, DOWN, buff=0.3)
        self.play_at(b.at("menolaknya"), Create(und), GrowFromCenter(x), FadeIn(xl), Wiggle(kd[1]), dur=0.8)
        self.r5 = VGroup(win, kd, und, x, xl)

    def beat_s6(self, b):
        self.play_at(b.at("Namun"), FadeOut(self.r5), dur=0.4)
        k1 = VGroup(panel(7.0, 1.6, "#16241C", LEAN), T("pernyataan di kode Lean", 34, LEAN))
        k2 = VGroup(panel(7.0, 1.6, "#2A2414", PRIMA), T("Hipotesis Riemann yang asli", 32, PRIMA))
        for k in (k1, k2): k[1].move_to(k[0])
        k1.move_to(UP * 2.6); k2.move_to(DOWN * 1.4)
        sama = TB("= ?", 80, INK).move_to(UP * 0.6)
        bukti = T("bukti ✓", 30, LEAN).next_to(k1, UP, buff=0.2)
        self.play_at(b.at("bukti cocok"), FadeIn(k1, shift=DOWN * 0.2), FadeIn(bukti), dur=0.6)
        self.play_at(b.at("bukan"), FadeIn(k2, shift=UP * 0.2), dur=0.6)
        self.play_at(b.at("benar-benar"), FadeIn(sama, scale=1.4), dur=0.5)
        self.r6 = VGroup(k1, k2, sama, bukti)

    def beat_s7(self, b):
        self.play_at(b.at("Pemeriksaan"), FadeOut(self.r6), dur=0.4)
        lampu = Circle(radius=0.22, fill_color=PRIMA, fill_opacity=1, stroke_width=0)
        st = T("pemeriksaan masih berjalan", 32, PRIMA)
        g = VGroup(lampu, st).arrange(RIGHT, buff=0.3).move_to(UP * 2.6)
        self.play(FadeIn(g), run_time=0.4)
        self.play(lampu.animate.set_opacity(0.2), run_time=0.4); self.play(lampu.animate.set_opacity(1), run_time=0.4)
        cta = VGroup(panel(7.6, 2.2, PANEL, PRIMA), TB("Tonton video lengkapnya", 38, INK))
        cta[1].move_to(cta[0]); cta.move_to(DOWN * 0.3)
        sub = T("I Teach Software Engineering", 28, INK2).next_to(cta, DOWN, buff=0.3)
        self.play_at(b.at("Tonton"), FadeIn(cta, scale=1.1), FadeIn(sub), dur=0.6)
