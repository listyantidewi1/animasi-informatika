from kit import *

BERKAS = open(os.path.join(D, "Statement.lean"), encoding="utf-8").read().split("\n")
if BERKAS[-1] == "": BERKAS = BERKAS[:-1]
ALAMAT = "github.com/anthropics/formal-math/blob/main/vp-vnp/Statement.lean"


def kotak(teks, warna, w=3.6, h=1.3, size=30, sub=None):
    k = RoundedRectangle(width=w, height=h, corner_radius=0.18, fill_color=PANEL, fill_opacity=1, stroke_color=warna, stroke_width=4)
    t = TB(teks, size, warna)
    if sub:
        t = VGroup(t, T(sub, int(size * 0.72), INK2)).arrange(DOWN, buff=0.1)
    if t.width > w - 0.3: t.scale_to_fit_width(w - 0.3)
    return VGroup(k, t.move_to(k))


def berkas_kode(lebar=11.6):
    """Seluruh Statement.lean (asli) + nomor baris. Mengembalikan (grup, tinggi_baris, daftar_baris)."""
    cw30 = kode("x" * 10, 30).width / 10
    size = 30 * (lebar / max(len(s) for s in BERKAS)) / cw30
    cw = cw30 * size / 30; h = kode("Xg", size).height * 1.5
    g = VGroup(); baris = []; dalam = False
    for i, s in enumerate(BERKAS):
        if s.lstrip().startswith("/-"): dalam = True
        warna = DIM if dalam else (INK if s.startswith(("def", "noncomputable", "structure")) else INK2)
        if dalam: warna = "#7C879C"
        if "-/" in s: dalam = False
        isi = s.lstrip(" "); n = len(s) - len(isi)
        no = kode(str(i + 1), size, DIM).move_to(LEFT * 0.25 + DOWN * i * h, aligned_edge=RIGHT)
        if isi:
            t = kode(isi, size, warna).move_to(RIGHT * n * cw + DOWN * i * h, aligned_edge=LEFT)
            t.shift(UP * (t.get_center()[1] + i * h) * -1)   # ratakan garis tengah
        else:
            t = VGroup()
        r = VGroup(no, t); g.add(r); baris.append(r)
    return g, h, baris


class Bab5(BabScene):
    SEG = 5

    def beat_b5_1(self, b):
        a = kotak("AI", AI, 4.4, 2.1, 54, "menulis bukti").move_to(LEFT * 3.6 + UP * 0.4)
        m = kotak("mesin lain", LEAN, 4.4, 2.1, 44, "memeriksa bukti").move_to(RIGHT * 3.6 + UP * 0.4)
        pn = Arrow(a.get_right(), m.get_left(), buff=0.2, color=INK2, stroke_width=6)
        self.play(FadeIn(a, shift=UP * 0.2), run_time=0.4)
        self.play_at(b.at("mesin lain"), GrowArrow(pn), FadeIn(m, shift=UP * 0.2), dur=0.6)
        c = T("ceritanya mirip dengan menulis dan menguji program", 34, PRIMA).move_to(DOWN * 2.2)
        self.play_at(b.at("menarik bagi kita"), FadeIn(c, shift=UP * 0.15), dur=0.6)
        self.r1 = VGroup(a, m, pn, c)

    def beat_b5_2(self, b):
        win = jendela("Editor Lean", 12.8, 5.9).move_to(DOWN * 0.45)
        cap = VGroup(TB("Lean", 44, LEAN), T("bahasa pemrograman khusus untuk matematika", 32, INK)).arrange(RIGHT, buff=0.35).move_to(UP * 3.25)
        self.play_at(b.at("Seluruh bukti"), FadeOut(self.r1), FadeIn(win, scale=0.97), dur=0.7)
        self.play_at(b.at("Lean"), FadeIn(cap[0], scale=1.2), dur=0.4)
        self.play_at(b.at("bahasa pemrograman"), FadeIn(cap[1], shift=LEFT * 0.2), dur=0.5)
        asli = blok_kode([BERKAS[91], BERKAS[92]], 22, ["#7C879C", INK]).move_to(win[0].get_top() + DOWN * 1.35)
        la = T("pernyataan (asli, dari Statement.lean)", 20, DIM).next_to(asli, UP, buff=0.18).align_to(asli, LEFT)
        self.play_at(b.at("khusus untuk matematika"), FadeIn(asli), FadeIn(la), dur=0.6)
        pj = [7.2, 9.0, 6.1, 8.3, 5.4, 7.7]
        bar = VGroup(*[RoundedRectangle(width=p, height=0.24, corner_radius=0.08, fill_color=GARIS, fill_opacity=1, stroke_width=0) for p in pj]).arrange(DOWN, buff=0.22, aligned_edge=LEFT)
        bar.move_to(win[0].get_bottom() + UP * 1.75).align_to(asli, LEFT)
        lb = T("langkah-langkah bukti (ilustrasi)", 20, DIM).next_to(bar, UP, buff=0.18).align_to(bar, LEFT)
        self.play_at(b.at("setiap langkah bukti"), FadeIn(lb), LaggedStart(*[GrowFromEdge(x, LEFT) for x in bar], lag_ratio=0.15), dur=1.2)
        ck = VGroup(*[centang(0.15).next_to(x, RIGHT, buff=0.25) for x in bar])
        t0 = b.at("hanya lolos"); t1 = b.at("sah secara logika")
        self.play_at(t0, LaggedStart(*[AnimationGroup(FadeIn(c, scale=1.6), x.animate.set_fill(LEAN, 0.55)) for c, x in zip(ck, bar)], lag_ratio=0.5), dur=max(1.2, t1 - t0 + 0.6))
        self.win = VGroup(win, asli, la, bar, lb, ck); self.cap = cap

    def beat_b5_3(self, b):
        k1 = kotak("kernel Lean", LEAN, 4.6, 1.5, 36, "kernel bawaan").move_to(RIGHT * 3.6 + UP * 1.2)
        k2 = kotak("kernel kedua", UNGU, 4.6, 1.5, 36, "nanoda, ditulis terpisah").move_to(RIGHT * 3.6 + DOWN * 1.5)
        self.play_at(b.at("Pemeriksanya"), FadeOut(self.cap), self.win.animate.scale(0.5).move_to(LEFT * 3.7 + DOWN * 0.15), dur=0.8)
        lk = TB("kernel: program kecil pemeriksa", 34, INK).move_to(UP * 3.2)
        self.play_at(b.at("program kecil"), FadeIn(lk, shift=DOWN * 0.15), dur=0.5)
        p1 = Arrow(self.win.get_right(), k1.get_left(), buff=0.2, color=INK2, stroke_width=5)
        p2 = Arrow(self.win.get_right(), k2.get_left(), buff=0.2, color=INK2, stroke_width=5)
        c1 = centang(0.3).next_to(k1, RIGHT, buff=0.25); c2 = centang(0.3).next_to(k2, RIGHT, buff=0.25)
        self.play_at(b.at("kernel bawaan Lean"), GrowArrow(p1), FadeIn(k1, shift=LEFT * 0.2), dur=0.6)
        self.play(FadeIn(c1, scale=1.6), run_time=0.3)
        self.play_at(b.at("diperiksa lagi"), GrowArrow(p2), FadeIn(k2, shift=LEFT * 0.2), dur=0.6)
        self.play_at(b.at("ditulis secara terpisah"), FadeIn(c2, scale=1.6), dur=0.4)
        self.r3 = VGroup(self.win, lk, k1, k2, p1, p2, c1, c2)

    def beat_b5_4(self, b):
        s = stempel("Diperiksa mesin", LEAN, size=54).move_to(UP * 1.4)
        self.play_at(b.at("Menurut makalahnya"), FadeOut(self.r3), dur=0.5)
        self.play_at(b.at("lolos"), FadeIn(s, scale=1.5), dur=0.5)
        la = T("hanya bersandar pada tiga aksioma standar:", 32, INK2).move_to(DOWN * 0.6)
        ax = VGroup(*[VGroup(RoundedRectangle(width=3.9, height=0.9, corner_radius=0.14, fill_color=PANEL, fill_opacity=1, stroke_color=GARIS, stroke_width=3), kode(n, 26, INK)) for n in ("propext", "Classical.choice", "Quot.sound")]).arrange(RIGHT, buff=0.3).move_to(DOWN * 1.8)
        for a in ax: a[1].move_to(a[0])
        self.play_at(b.at("hanya bersandar"), FadeIn(la), dur=0.4)
        self.play_at(b.at("tiga aksioma"), LaggedStart(*[FadeIn(a, shift=UP * 0.2) for a in ax], lag_ratio=0.3), dur=0.9)
        self.r4 = VGroup(s, la, ax)

    def beat_b5_5(self, b):
        n = 7
        mata = VGroup(*[RoundedRectangle(width=1.5, height=0.8, corner_radius=0.4, stroke_color=LEAN, stroke_width=7, fill_opacity=0) for _ in range(n)])
        for i, m in enumerate(mata): m.move_to(RIGHT * (i * 1.22 - 2.9) + UP * 0.6)
        lr = T("rantai langkah bukti", 28, INK2).next_to(mata, UP, buff=0.35)
        self.play_at(b.at("Jadi"), FadeOut(self.r4), LaggedStart(*[FadeIn(m, shift=LEFT * 0.2) for m in mata], lag_ratio=0.08), FadeIn(lr), dur=0.9)
        ck = VGroup(*[centang(0.17).move_to(m) for m in mata])
        kecil = TB("salah logika di tengah: kemungkinannya sangat kecil", 32, LEAN).move_to(DOWN * 1.0)
        self.play_at(b.at("logika yang salah"), LaggedStart(*[FadeIn(c, scale=1.5) for c in ck], lag_ratio=0.12), dur=1.2)
        self.play_at(b.at("sangat kecil"), FadeIn(kecil, shift=UP * 0.15), dur=0.5)
        awal = DashedVMobject(RoundedRectangle(width=1.7, height=0.9, corner_radius=0.45, stroke_color=PRIMA, stroke_width=7), num_dashes=22).move_to(mata[0].get_center() + LEFT * 1.6)
        q = TB("?", 44, PRIMA).move_to(awal)
        lc = TB("satu celah", 34, PRIMA).next_to(awal, DOWN, buff=0.3)
        self.play_at(b.at("satu celah"), FadeIn(awal), FadeIn(q, scale=1.5), FadeIn(lc), dur=0.6)
        tm = TB("tidak bisa ditutup oleh mesin mana pun", 36, PRIMA).move_to(DOWN * 2.3)
        self.play_at(b.at("tidak bisa ditutup"), kecil.animate.set_opacity(0.35), FadeIn(tm, shift=UP * 0.15), Indicate(VGroup(awal, q), color=PRIMA, scale_factor=1.15), dur=0.8)
        self.r5 = VGroup(mata, lr, ck, kecil, awal, q, lc, tm)

    def beat_b5_6(self, b):
        soal = kotak("soal yang dimaksud", INK, 3.7, 1.9, 28, "oleh para matematikawan").move_to(LEFT * 5.0 + UP * 0.6)
        per = kotak("pernyataan", PRIMA, 3.3, 1.9, 30, "tertulis di dalam kode").move_to(UP * 0.6)
        buk = kotak("bukti", LEAN, 3.3, 1.9, 34, "ribuan langkah kode").move_to(RIGHT * 4.8 + UP * 0.6)
        buk[1][1].become(T("langkah-langkah kode", 22, INK2).move_to(buk[1][1]))
        self.play_at(b.at("Kernel hanya"), FadeOut(self.r5), FadeIn(per), FadeIn(buk), dur=0.7)
        g1 = Line(per.get_right(), buk.get_left(), color=LEAN, stroke_width=7)
        c1 = centang(0.26).move_to(g1); l1 = VGroup(TB("cocok", 28, LEAN), T("diperiksa kernel", 24, INK2)).arrange(DOWN, buff=0.06).next_to(g1, DOWN, buff=1.25)
        self.play_at(b.at("bukti cocok"), Create(g1), FadeIn(c1, scale=1.5), FadeIn(l1), dur=0.7)
        g2 = DashedLine(soal.get_right(), per.get_left(), color=PRIMA, stroke_width=7, dash_length=0.12)
        q = VGroup(Circle(radius=0.28, fill_color=PRIMA, fill_opacity=1, stroke_width=0), TB("?", 30, BG)); q.move_to(g2)
        l2 = VGroup(TB("sama?", 28, PRIMA), T("kernel tidak tahu", 24, INK2)).arrange(DOWN, buff=0.06).next_to(g2, DOWN, buff=1.25)
        self.play_at(b.at("Kernel tidak tahu"), FadeIn(soal, shift=RIGHT * 0.2), dur=0.6)
        self.play_at(b.at("benar-benar sama"), Create(g2), FadeIn(q, scale=1.5), FadeIn(l2), dur=0.7)
        self.r6 = VGroup(soal, per, buk, g1, c1, l1, g2, q, l2)

    def beat_b5_7(self, b):
        minta = VGroup(T("yang diminta:", 26, INK2), TB("urutkan nilai dari kecil ke besar", 32, INK)).arrange(RIGHT, buff=0.3).move_to(UP * 3.1)
        w1 = jendela("tes_urut.py", 6.4, 3.6).move_to(LEFT * 3.4 + UP * 0.35)
        kd = blok_kode(["hasil = urutkan([7, 2, 9])", "", "assert len(hasil) == 3"], 22, [INK, INK, PRIMA]).move_to(w1[0]).shift(DOWN * 0.2)
        w2 = jendela("Terminal", 6.4, 3.6).move_to(RIGHT * 3.4 + UP * 0.35)
        out = blok_kode(["$ python tes_urut.py", "✓ tes 1 lolos", "✓ tes 2 lolos", "✓ tes 3 lolos", "semua tes lolos"], 22, [INK2, LEAN, LEAN, LEAN, LEAN]).move_to(w2[0]).shift(DOWN * 0.2)
        self.play_at(b.at("Programmer"), FadeOut(self.r6), FadeIn(minta), FadeIn(w1), FadeIn(w2), FadeIn(kd), FadeIn(out[0]), dur=0.8)
        self.play_at(b.at("Semua tes"), LaggedStart(*[FadeIn(x, shift=RIGHT * 0.15) for x in out[1:]], lag_ratio=0.25), dur=1.0)
        sor = SurroundingRectangle(kd[2], color=NOL, buff=0.12, stroke_width=4, corner_radius=0.08)
        ls = T("tes ini hanya memeriksa jumlah datanya", 24, NOL).next_to(w1, DOWN, buff=0.2)
        self.play_at(b.at("menguji hal yang keliru"), Create(sor), FadeIn(ls), dur=0.7)
        hs = VGroup(T("hasil program:", 28, INK2), kode("[7, 2, 9]", 34, INK), TB("belum terurut, programnya tetap salah", 30, NOL)).arrange(RIGHT, buff=0.35).move_to(DOWN * 3.1)
        if hs.width > 13: hs.scale_to_fit_width(13)
        self.play_at(b.at("programnya tetap salah"), FadeIn(hs, shift=UP * 0.15), dur=0.6)
        self.r7 = VGroup(minta, w1, w2, kd, out, sor, ls, hs)

    def beat_b5_8(self, b):
        win = jendela("Statement.lean", 13.4, 6.4).move_to(DOWN * 0.6)
        g, h, baris = berkas_kode(11.6)
        atas = win[0].get_top()[1] - 0.48 - 0.35; kiri = win[0].get_left()[0] + 0.95
        g.shift(RIGHT * (kiri - baris[0][0].get_right()[0] - 0.25) + UP * (atas - baris[0][0].get_center()[1]))
        y_tengah = win[0].get_center()[1] - 0.2
        tutup = Rectangle(width=16, height=3, fill_color=BG, fill_opacity=1, stroke_width=0).move_to([0, win[0].get_top()[1] + 1.5, 0])
        al = chip(ALAMAT, AI, 24).move_to(UP * 3.25)
        g.set_z_index(1); tutup.set_z_index(2); win[1].set_z_index(3); win[2].set_z_index(3); win[3].set_z_index(3); al.set_z_index(3)
        self.play_at(b.at("Pada bukti ini"), FadeOut(self.r7), dur=0.4)
        self.add(tutup)
        self.play(FadeIn(win), FadeIn(g), FadeIn(al), run_time=0.6)

        def ke(no, maks=None):
            """Geser sehingga baris `no` (1-indeks) berada di tengah jendela."""
            dy = y_tengah - baris[no - 1][0].get_center()[1]
            return g.animate.shift(UP * dy)

        def sorot(a, z, warna):
            r = Rectangle(width=12.6, height=(z - a + 1) * h, fill_color=warna, fill_opacity=0.16, stroke_color=warna, stroke_width=3)
            r.move_to([win[0].get_center()[0], (baris[a - 1][0].get_center()[1] + baris[z - 1][0].get_center()[1]) / 2, 0]); r.set_z_index(1)
            return r
        t_s = b.at("definisi sirkuit")
        self.play_at(t_s - 0.7, ke(25), dur=0.7)
        s1 = sorot(23, 27, PRIMA); l1 = chip("sirkuit", PRIMA, 24).move_to([5.2, s1.get_top()[1] + 0.32, 0]).set_z_index(1)
        self.play(FadeIn(s1), FadeIn(l1), run_time=0.35)
        g.add(s1, l1)
        t_vp = b.at("VP")
        self.play_at(max(self.now, t_vp - 0.75), ke(83), dur=0.7)
        s2 = sorot(76, 78, AI); l2 = chip("VP", AI, 24).move_to([5.4, s2.get_top()[1] + 0.32, 0]).set_z_index(1)
        s3 = sorot(87, 90, ORANYE); l3 = chip("VNP", ORANYE, 24).move_to([5.4, s3.get_top()[1] + 0.32, 0]).set_z_index(1)
        self.play(FadeIn(s2), FadeIn(l2), run_time=0.3)
        self.play_at(b.at("VNP"), FadeIn(s3), FadeIn(l3), dur=0.3)
        g.add(s2, l2, s3, l3)
        dy = (win[0].get_bottom()[1] + 0.45) - baris[-1][0].get_center()[1]
        self.play_at(b.at("satu berkas"), g.animate.shift(UP * dy), dur=1.2)
        jml = VGroup(TB("98 baris", 54, PRIMA), T("satu berkas", 28, INK)).arrange(DOWN, buff=0.1)
        jb = BackgroundRectangle(jml, color=BG, fill_opacity=0.92, buff=0.3); jg = VGroup(jb, jml).move_to(RIGHT * 4.0 + UP * 1.0).set_z_index(4)
        no98 = SurroundingRectangle(baris[-1][0], color=PRIMA, buff=0.06, stroke_width=3).set_z_index(3)
        self.play_at(b.at("sembilan puluh delapan"), FadeIn(jg, scale=1.2), Create(no98), dur=0.6)
        self.r8 = VGroup(win, g, tutup, al, jg, no98)

    def beat_b5_9(self, b):
        k = kutipan("Lean checks the proofs, but no machine checks that this file says what is claimed.",
                    "Lean memeriksa bukti, tetapi tidak ada mesin yang memeriksa apakah berkas ini benar-benar menyatakan apa yang diklaim.",
                    "README.md  ·  github.com/anthropics/formal-math/vp-vnp").move_to(UP * 0.1)
        self.play_at(b.at("Di repositorinya"), FadeOut(self.r8), dur=0.5)
        self.play_at(b.at("tertulis"), FadeIn(k[0]), FadeIn(k[1], shift=UP * 0.1), dur=0.6)
        self.play_at(b.at("Lean memeriksa bukti"), FadeIn(k[2], shift=UP * 0.2), dur=0.7)
        self.r9 = k

    def beat_b5_10(self, b):
        k = kutipan("Whether the statements say what is meant was judged only by AI readers.",
                    "Apakah pernyataan itu sesuai dengan maksudnya, baru dinilai oleh pembaca AI.",
                    "paper.pdf  ·  “VP ≠ VNP over every field”").move_to(UP * 0.4)
        self.play_at(b.at("Makalahnya"), FadeOut(self.r9), FadeIn(k[0]), FadeIn(k[1], shift=UP * 0.1), dur=0.7)
        self.play_at(b.at("kecocokan itu"), FadeIn(k[2], shift=UP * 0.2), dur=0.7)
        bl = VGroup(T("matematikawan:", 32, INK2), TB("belum", 40, PRIMA)).arrange(RIGHT, buff=0.3).next_to(k, DOWN, buff=0.7)
        self.play_at(b.at("belum dilakukan"), FadeIn(bl, shift=UP * 0.15), dur=0.5)
        self.r10 = VGroup(k, bl)

    def beat_b5_11(self, b):
        tp = tumpukan(38).move_to(LEFT * 4.0 + UP * 0.5)
        l1 = VGroup(TB("70 halaman", 44, INK), T("makalah bukti", 28, INK2)).arrange(DOWN, buff=0.1).next_to(tp, DOWN, buff=0.35)
        kiri = VGroup(tp, l1)
        self.play_at(b.at("Kabar baiknya"), FadeOut(self.r10), dur=0.5)
        self.play_at(b.at("pekerjaan para ahli"), FadeIn(kiri, shift=UP * 0.2), dur=0.7)
        fl = RoundedRectangle(width=3.0, height=3.7, corner_radius=0.15, fill_color=PANEL, fill_opacity=1, stroke_color=PRIMA, stroke_width=5).move_to(RIGHT * 3.8 + UP * 0.9)
        gr = VGroup(*[Line(LEFT * 1.1, LEFT * 1.1 + RIGHT * (1.0 + ((i * 7) % 5) * 0.28), color=INK2, stroke_width=3) for i in range(11)]).arrange(DOWN, buff=0.2, aligned_edge=LEFT).move_to(fl).shift(DOWN * 0.15)
        nm = kode("Statement.lean", 22, PRIMA).next_to(fl, UP, buff=0.15)
        l2 = VGroup(TB("98 baris", 44, PRIMA), T("mulai dari sini", 28, INK)).arrange(DOWN, buff=0.1).next_to(fl, DOWN, buff=0.3)
        kanan = VGroup(fl, gr, nm, l2)
        self.play_at(b.at("tidak perlu menelusuri"), kiri.animate.set_opacity(0.3), dur=0.7)
        self.play_at(b.at("mulai dari"), FadeIn(VGroup(fl, gr, nm), scale=0.8), dur=0.6)
        self.play_at(b.at("sembilan puluh delapan baris"), FadeIn(l2, shift=UP * 0.15), dur=0.5)
        self.r11 = VGroup(kiri, kanan)

    def beat_b5_12(self, b):
        s2 = stempel("Diperiksa manusia", kosong=True, size=40).move_to(RIGHT * 3.4 + UP * 0.2)
        ket2 = T("belum ada ahli yang mengumumkan hasil", 26, INK2).next_to(s2, DOWN, buff=0.4)
        self.play_at(b.at("Sampai video ini dibuat"), FadeOut(self.r11), dur=0.5)
        self.play_at(b.at("belum ada ahli"), FadeIn(s2, scale=1.3), FadeIn(ket2), dur=0.6)
        jud = VGroup(T("klaim bukti", 34, INK2), TB("VP ≠ VNP", 70, INK)).arrange(RIGHT, buff=0.4).move_to(UP * 2.7)
        self.play_at(b.at("klaim bukti"), FadeIn(jud, shift=DOWN * 0.2), dur=0.6)
        s1 = stempel("Diperiksa mesin", LEAN, size=40).move_to(LEFT * 3.4 + UP * 0.2)
        ket1 = T("dua kernel, tiga aksioma standar", 26, INK2).next_to(s1, DOWN, buff=0.4)
        self.play_at(b.at("sudah diperiksa mesin"), FadeIn(s1, scale=1.3), FadeIn(ket1), dur=0.6)
        bt = TB("belum diterima sebagai teorema", 44, PRIMA).move_to(DOWN * 2.2)
        st = status_chip().next_to(bt, DOWN, buff=0.35)
        self.play_at(b.at("belum diterima"), FadeIn(bt, shift=UP * 0.2), FadeIn(st), dur=0.7)
