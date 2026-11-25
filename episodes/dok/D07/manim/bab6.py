from kit import *

TES = ["test_login_berhasil", "test_login_gagal", "test_keranjang_kosong", "test_tambah_barang", "test_hapus_barang", "test_hitung_total",
       "test_hitung_diskon", "test_ongkir", "test_voucher", "test_stok_habis", "test_bayar", "test_struk"]


class Bab6(BabScene):
    SEG = 6

    def beat_b6_1(self, b):
        sorot = Circle(radius=2.6, fill_color="#1A2030", fill_opacity=1, stroke_width=0)
        glow = VGroup(*[Circle(radius=2.6 + i * 0.25, fill_color="#1A2030", fill_opacity=0.25 - i * 0.04, stroke_width=0) for i in range(5)])
        j = TB("Jebakan", 72, ORANYE)
        self.play_at(b.at("Namun"), FadeIn(glow), FadeIn(sorot), dur=0.7)
        self.play_at(b.at("jebakan"), FadeIn(j, scale=1.2), dur=0.6)
        self.r1 = VGroup(glow, sorot, j)

    def beat_b6_2(self, b):
        self.play_at(b.at("Bayangkan"), FadeOut(self.r1), dur=0.5)
        baris = VGroup(*[VGroup(kode(t, 22, INK2), T("✓ LULUS", 20, LEAN)) for t in TES])
        for x in baris: x[1].next_to(x[0], RIGHT, buff=0.4)
        for x in baris: x[1].align_to(baris[2][0].get_right() + RIGHT * 0.4, LEFT)
        baris.arrange(DOWN, aligned_edge=LEFT, buff=0.12).move_to(ORIGIN)
        for x in baris: x[1].set_x(baris.get_right()[0] - x[1].width / 2)
        win = jendela("Hasil test", baris.width + 1.2, baris.height + 1.2).move_to(baris).shift(UP * 0.25)
        self.play(FadeIn(win), run_time=0.4)
        self.play_at(b.at("semua test"), LaggedStart(*[FadeIn(x, shift=RIGHT * 0.1) for x in baris], lag_ratio=0.1), dur=1.6)
        ok = TB("12 dari 12 lulus", 34, LEAN).next_to(win, DOWN, buff=0.2)
        self.play(FadeIn(ok), run_time=0.3)
        self.r2 = VGroup(win, baris, ok); self.baris = baris

    def beat_b6_3(self, b):
        self.play_at(b.at("Kalau"), FadeOut(self.r2), dur=0.5)
        f = blok_kode(["def hitung_diskon(harga):", "    return harga        # lupa diskon 10%"], 26, [INK, INK2])
        t = blok_kode(["def test_hitung_diskon():", "    assert hitung_diskon(100) == 100"], 26, [INK, INK])
        wf = jendela("program.py", 11.5, 1.9); wt = jendela("test_program.py", 11.5, 1.9)
        VGroup(wf, wt).arrange(DOWN, buff=0.5).shift(UP * 0.3)
        f.move_to(wf[0]).shift(DOWN * 0.15).align_to(wf[0], LEFT).shift(RIGHT * 0.4)
        t.move_to(wt[0]).shift(DOWN * 0.15).align_to(wt[0], LEFT).shift(RIGHT * 0.4)
        self.play(FadeIn(wt), FadeIn(t), run_time=0.5)
        angka100 = t[1][-3:]
        box = SurroundingRectangle(angka100, color=ORANYE, buff=0.06)
        seh = T("seharusnya 90", 26, ORANYE).next_to(box, RIGHT, buff=0.2)
        self.play_at(b.at("salah tulis"), Create(box), FadeIn(seh), dur=0.6)
        self.play_at(b.at("program yang keliru"), FadeIn(wf), FadeIn(f), dur=0.6)
        bug = SurroundingRectangle(f[1], color=NOL, buff=0.06)
        lulus = TB("✓ LULUS", 40, LEAN).next_to(VGroup(wf, wt), DOWN, buff=0.3)
        self.play_at(b.at("tetap bisa lulus"), Create(bug), FadeIn(lulus, scale=1.3), dur=0.6)
        self.r3 = VGroup(wf, wt, f, t, box, seh, bug, lulus)

    def beat_b6_4(self, b):
        s = TB("masalah spesifikasi", 80, ORANYE)
        sub = T("apakah yang dibuktikan memang hal yang kita maksud?", 30, INK2).next_to(s, DOWN, buff=0.4)
        di = TB("Di Lean:", 44, LEAN).next_to(s, UP, buff=0.6)
        self.play_at(b.at("Di Lean"), FadeOut(self.r3), FadeIn(di, shift=DOWN * 0.2), dur=0.5)
        self.play_at(b.at("masalah yang sama"), FadeIn(sub), dur=0.6)
        self.play_at(b.at("spesifikasi"), FadeIn(s, scale=1.2), dur=0.7)
        self.r4 = VGroup(s, sub, di)

    def beat_b6_5(self, b):
        self.play_at(b.at("Lean hanya"), FadeOut(self.r4), dur=0.5)
        k1 = VGroup(panel(4.6, 2.4, "#16241C", LEAN), T("pernyataan\ndi kode Lean", 32, LEAN, line_spacing=1.0))
        k2 = VGroup(panel(4.6, 2.4, "#2A2414", PRIMA), T("Hipotesis Riemann\nyang asli", 32, PRIMA, line_spacing=1.0))
        for k in (k1, k2): k[1].move_to(k[0])
        VGroup(k1, k2).arrange(RIGHT, buff=2.2)
        sama = TB("= ?", 72, INK).move_to(VGroup(k1, k2))
        bukti = T("bukti ✓", 28, LEAN).next_to(k1, DOWN, buff=0.3)
        self.play_at(b.at("bukti cocok"), FadeIn(k1, shift=RIGHT * 0.2), FadeIn(bukti), dur=0.6)
        self.play_at(b.at("bukan bahwa"), FadeIn(k2, shift=LEFT * 0.2), dur=0.6)
        self.play_at(b.at("benar-benar"), FadeIn(sama, scale=1.4), dur=0.5)
        self.r5 = dict(k1=k1, k2=k2, sama=sama, bukti=bukti)

    def beat_b6_6(self, b):
        r = self.r5
        nama = T("Kevin Buzzard, Imperial College London", 26, INK2).to_edge(UP, buff=0.5)
        self.play_at(b.at("Kevin"), FadeIn(nama, shift=DOWN * 0.2), dur=0.5)
        self.play_at(b.at("Apakah"), Indicate(r["sama"], color=ORANYE, scale_factor=1.3), dur=0.9)
        self.nama6 = nama

    def beat_b6_7(self, b):
        r = self.r5
        mesin = VGroup(RoundedRectangle(width=3.4, height=1.5, corner_radius=0.2, fill_color=PANEL, fill_opacity=1, stroke_color=AI, stroke_width=4),
                       T("comparator", 32, AI)).shift(DOWN * 1.9)
        mesin[1].move_to(mesin[0])
        lampu = Circle(radius=0.18, fill_color=PRIMA, fill_opacity=1, stroke_width=0).next_to(mesin, RIGHT, buff=0.3)
        tunggu = T("hasil masih ditunggu", 26, PRIMA).next_to(lampu, RIGHT, buff=0.2)
        self.play_at(b.at("alat"), FadeOut(r["bukti"]), FadeOut(self.nama6), VGroup(r["k1"], r["k2"], r["sama"]).animate.scale(0.75).shift(UP * 1.2), FadeIn(mesin, shift=UP * 0.3), dur=0.8)
        a1 = Arrow(r["k1"].get_bottom(), mesin.get_left() + UP * 0.2, color=LEAN, buff=0.1)
        a2 = Arrow(r["k2"].get_bottom(), mesin.get_right() + UP * 0.2, color=PRIMA, buff=0.1)
        self.play_at(b.at("membandingkan"), GrowArrow(a1), GrowArrow(a2), dur=0.7)
        self.play_at(b.at("masih ditunggu"), FadeIn(lampu), FadeIn(tunggu), dur=0.4)
        self.play(lampu.animate.set_opacity(0.2), run_time=0.4)
        self.play(lampu.animate.set_opacity(1), run_time=0.4)
        self.r7 = VGroup(r["k1"], r["k2"], r["sama"], mesin, lampu, tunggu, a1, a2)

    def beat_b6_8(self, b):
        self.play_at(b.at("Sampai"), FadeOut(self.r7), dur=0.5)
        item = [("Kode Lean lolos compile", "sudah", LEAN, "✓"), ("Dikompilasi ulang secara independen", "sudah", LEAN, "✓"),
                ("Pernyataan dicek dengan comparator", "menunggu", PRIMA, "…"), ("Makalah lolos peer review", "belum", INK2, "–"),
                ("Keputusan Clay Institute", "belum", INK2, "–")]
        rows = VGroup()
        for s, st, w, ic in item:
            rows.add(VGroup(T(ic, 34, w, weight=BOLD), T(s, 32, INK), T(st, 30, w)))
        for r in rows:
            r[1].next_to(r[0], RIGHT, buff=0.4)
        rows.arrange(DOWN, aligned_edge=LEFT, buff=0.38).move_to(LEFT * 0.8)
        xt = max(r[0].get_right()[0] for r in rows) + 0.4   # kolom teks rata kiri meski lebar ikon berbeda
        for r in rows: r[0].set_x(xt - 0.4 - 0.25); r[1].set_x(xt + r[1].width / 2)
        xr = rows.get_right()[0] + 0.8
        for r in rows: r[2].move_to([xr, r[1].get_y(), 0], aligned_edge=LEFT)
        VGroup(rows).move_to(DOWN * 0.3)
        jud = TB("Status per 21 November 2026", 40, INK).to_edge(UP, buff=0.5)
        self.play(FadeIn(jud), run_time=0.4)
        self.play_at(b.at("belum ada makalah"), LaggedStart(*[FadeIn(r, shift=RIGHT * 0.2) for r in rows], lag_ratio=0.25), dur=2.0)
