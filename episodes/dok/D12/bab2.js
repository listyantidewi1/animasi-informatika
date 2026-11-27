/* D12 bab 2 — sandbox (b2_1 … b2_5): kode dari orang asing, ruang kaca per tab, boleh/tidak boleh, dua celah berantai, dinding terluar. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d12, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U;
  const S = {};

  S.b2_1 = function (ctx, b, l, t) {
    const tK = U.at(b, "mengirim program kecil"), tJ = U.at(b, "menjalankannya");
    U.judul(ctx, "Kode dari orang yang tidak kamu kenal", l, 0.3, { y: 150, col: C.php });
    [0, 1, 2].forEach(i => { const y = 330 + i * 230; U.geser(ctx, l, 0.2 + i * 0.2, -200, 0, () => { U.server(ctx, 300, y, 190, { glow: 0.2 }); T(ctx, ["situs berita", "situs video", "situs toko"][i], 420, y + 14, 40, { weight: 700, color: C.text2 }); }); });
    U.muncul(ctx, l, 0.5, 1430, 560, () => { U.laptop(ctx, 1430, 560, 620, C.text2); T(ctx, "perangkatmu", 1430, 870, 44, { align: "center", weight: 800 }); });
    if (l > tK - 0.3) for (let i = 0; i < 9; i++) { const u = ((l - tK) * 0.45 + i / 9) % 1, row = i % 3, x = lerp(700, 1260, u), y = lerp(330 + row * 230, 520, eio(u)); if (l - tK < i * 0.12) continue;
      ctx.save(); ctx.globalAlpha *= Math.sin(u * Math.PI); U.kotak(ctx, x - 44, y - 30, 88, 60, "{ }", { col: C.amber, size: 32, mono: true, r: 10 }); ctx.restore(); }
    U.muncul(ctx, l, tJ - 0.1, 1430, 520, () => T(ctx, "▶ berjalan", 1430, 540, 48, { align: "center", weight: 800, color: C.amber }));
  };

  S.b2_2 = function (ctx, b, l, t) {
    const tR = U.at(b, "ruang tertutup"), tS = U.at(b, "sandbox"), tK = U.at(b, "ruang kaca");
    U.denah(ctx, { tab: ramp(l, 0.2, 0.5), kaca: ramp(l, tR - 0.2, 0.7), labelKaca: l > tS });
    U.muncul(ctx, l, tK, 575, 120, () => U.pill(ctx, "ruang kaca tanpa pintu ke ruangan lain", 575, 110, { size: 38, col: "#BFE9F2" }));
  };

  S.b2_3 = function (ctx, b, l, t) {
    const boleh = [["menggambar", "menggambar"], ["memutar video", "memutar video"], ["berhitung", "berhitung"]], tidak = [["file", "membaca file kamu", "membaca file"], ["kamera", "menyalakan kamera", "menyalakan kamera"], ["pasang", "memasang program", "memasang program"]];
    U.kaca(ctx, 170, 230, 760, 640, { label: "DI DALAM SANDBOX" });
    boleh.forEach(([s, ph], i) => { const t0 = U.at(b, ph), y = 380 + i * 160; U.muncul(ctx, l, t0 - 0.15, 550, y, () => { U.centang(ctx, 290, y, 64, ramp(l, t0, 0.3), C.term); T(ctx, s, 370, y + 18, 56, { weight: 800 }); }); });
    T(ctx, "DI LUAR", 1380, 212, 34, { align: "center", weight: 800, color: C.red, spacing: 4 });
    tidak.forEach(([ik, s, ph], i) => { const t0 = U.at(b, ph), y = 320 + i * 190; U.muncul(ctx, l, t0 - 0.15, 1380, y, () => { U.kotak(ctx, 1040, y - 75, 700, 150, "", { col: C.red }); U.ikon(ctx, ik, 1120, y, 90, C.text2); T(ctx, s, 1200, y + 16, 44, { weight: 800 }); });
      const u = ramp(l, t0 + 0.2, 0.3); if (u > 0) { ctx.save(); ctx.globalAlpha *= u; U.panah(ctx, 940, y, 990, y, C.red, 1, { lw: 7, head: 20 }); U.ikon(ctx, "larang", 1010, y, 60, C.red); ctx.restore(); } });
  };

  S.b2_4 = function (ctx, b, l, t) {
    const tD = U.at(b, "dua celah"), t1 = U.at(b, "satu untuk"), t2 = U.at(b, "satu lagi");
    U.judul(ctx, "Biasanya penyerang butuh dua celah", l, tD - 0.3, { y: 170, col: C.amber });
    U.muncul(ctx, l, 0.3, 230, 540, () => { U.kotak(ctx, 90, 450, 280, 180, "halaman\njahat", { col: C.red, size: 42 }); });
    U.muncul(ctx, l, 0.6, 1690, 540, () => { U.kotak(ctx, 1550, 450, 280, 180, "perangkat\nkamu", { col: C.term, size: 42 }); });
    U.muncul(ctx, l, t1 - 0.2, 690, 540, () => { U.kotak(ctx, 480, 380, 420, 420, "", { col: C.amber }); U.gembok(ctx, 690, 510, 170, 0, C.amber); T(ctx, "celah 1", 690, 670, 44, { align: "center", weight: 900, color: C.amber }); T(ctx, "menguasai isi tab", 690, 730, 36, { align: "center", weight: 700, color: C.text2 }); });
    U.muncul(ctx, l, t2 - 0.2, 1230, 540, () => { U.kotak(ctx, 1020, 380, 420, 420, "", { col: "#BFE9F2" }); U.gembok(ctx, 1230, 510, 170, 0, "#BFE9F2"); T(ctx, "celah 2", 1230, 670, 44, { align: "center", weight: 900, color: "#BFE9F2" }); T(ctx, "keluar dari sandbox", 1230, 730, 36, { align: "center", weight: 700, color: C.text2 }); });
    U.panah(ctx, 380, 540, 470, 540, C.text2, eio(ramp(l, t1 - 0.4, 0.4)), { lw: 7 }); U.panah(ctx, 910, 540, 1010, 540, C.text2, eio(ramp(l, t2 - 0.4, 0.4)), { lw: 7 }); U.panah(ctx, 1450, 540, 1540, 540, C.text2, eio(ramp(l, t2 + 0.6, 0.4)), { lw: 7 });
  };

  S.b2_5 = function (ctx, b, l, t) {
    const tQ = U.at(b, "menjalankan kode"), tD = U.at(b, "dinding terluar"), tC = U.at(b, "Critical"), m = ramp(l, tD - 0.2, 0.5);
    U.denah(ctx, { kaca: 1, dinding: m * (0.6 + 0.4 * Math.sin(t * 5)), larang: 0 });
    U.muncul(ctx, l, tQ - 0.2, 960, 110, () => U.pill(ctx, "“menjalankan kode di luar sandbox”", 1180, 110, { size: 42, col: C.red }));
    U.muncul(ctx, l, tD + 0.3, 575, 950, () => U.pill(ctx, "lapisan pelindung terakhir", 575, 950, { size: 42, col: C.red }));
    U.muncul(ctx, l, tC - 0.1, 1420, 950, () => X.cap(ctx, "CRITICAL", 1420, 950, -0.05, C.red, 64), { k0: 1.7 });
  };

  U.reg(2, S);
})(typeof window !== "undefined" ? window : globalThis);
