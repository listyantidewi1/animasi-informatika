/* D12 bab 4 — seberapa gawat (b4_1 … b4_7): laporan dikunci, membandingkan versi, perlombaan, kabar baik, tautan mencurigakan, tiga bulan, tidak panik + tidak menunda. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d12, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U, TAU = Math.PI * 2;
  const S = {};

  S.b4_1 = function (ctx, b, l, t) {
    const tB = U.at(b, "setelah sebagian besar"), u = eio(ramp(l, tB - 0.2, 2.6));
    const f = U.browser(ctx, 260, 140, 1400, 520, { tabs: ["Laporan teknis"], url: "issue 554051967" });
    U.gembok(ctx, f.x + 160, f.y + 200, 220, 0, C.red); T(ctx, "Akses dibatasi", f.x + 340, f.y + 180, 72, { weight: 900, color: C.red });
    T(ctx, "detail teknis belum dibuka untuk umum", f.x + 340, f.y + 250, 38, { weight: 600, color: C.text2 });
    U.muncul(ctx, l, tB - 0.5, 960, 830, () => { T(ctx, "pengguna yang sudah memasang patch", 360, 770, 40, { weight: 800 }); ctx.fillStyle = C.lokBebas; U.rr(ctx, 360, 800, 1200, 54, 27); ctx.fill(); ctx.fillStyle = C.term; U.rr(ctx, 360, 800, Math.max(54, 1200 * 0.42 * u), 54, 27); ctx.fill();
      ctx.save(); ctx.strokeStyle = C.amber; ctx.lineWidth = 5; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(360 + 1200 * 0.72, 780); ctx.lineTo(360 + 1200 * 0.72, 880); ctx.stroke(); ctx.restore(); T(ctx, "baru dibuka setelah sebagian besar memperbarui", 360 + 1200 * 0.72, 930, 36, { align: "center", weight: 700, color: C.amber }); });
    U.sumber(ctx, "Sumber: Chrome Releases · batang hanya ilustrasi");
  };

  const LAMA = ["function terima(data) {", "  simpan(data);", "  return true;", "}"], BARU = ["function terima(data) {", "  if (!wajar(data)) return false;", "  simpan(data);", "  return true;", "}"];
  S.b4_2 = function (ctx, b, l, t) {
    const tK = U.at(b, "kode terbuka"), tB = U.at(b, "membandingkan"), tC = U.at(b, "bagian mana"), hi = ramp(l, tC - 0.2, 0.4);
    U.judul(ctx, "Kode Chrome terbuka untuk siapa pun", l, tK - 0.3, { y: 150, col: C.php });
    U.geser(ctx, l, tB - 0.5, -200, 0, () => { const f = X.windowFrame(ctx, 110, 230, 820, 560, { tab: "versi lama" }); X.code(ctx, f.x + 30, f.y + 100, LAMA, { size: 34, lh: 70 }); });
    U.geser(ctx, l, tB - 0.2, 200, 0, () => { const f = X.windowFrame(ctx, 990, 230, 820, 560, { tab: "versi baru" }); X.code(ctx, f.x + 30, f.y + 100, BARU.map((s, i) => i === 1 ? { t: s, bg: U.rgba(C.term, 0.2 * hi), color: hi > 0.5 ? C.term : undefined } : s), { size: 34, lh: 70, w: 780 }); });
    U.muncul(ctx, l, tC, 1400, 880, () => U.pill(ctx, "di sini yang diperbaiki", 1400, 870, { size: 42, col: C.term }));
    T(ctx, "contoh buatan, bukan kode asli Chrome", 110, 850, 30, { weight: 600, color: C.dim });
  };

  S.b4_3 = function (ctx, b, l, t) {
    const tR = U.at(b, "sebuah perlombaan"), t1 = U.at(b, "Di satu sisi"), t2 = U.at(b, "di sisi lain"), ua = ramp(l, t1, 9) , ub = ramp(l, t2, 7);
    U.muncul(ctx, l, 0.3, 330, 250, () => { U.kotak(ctx, 150, 180, 360, 110, "patch dirilis", { col: C.amber, size: 44 }); });
    U.judul(ctx, "Perlombaan dimulai", l, tR - 0.2, { x: 1160, y: 250, size: 72, col: C.amber });
    [[t1, "pengguna yang memperbarui browser", C.term, 0.25 + 0.5 * ua, 430], [t2, "orang yang mempelajari patch untuk menyerang", C.red, 0.1 + 0.62 * ub, 690]].forEach(([t0, s, col, u, y]) => { const a = ramp(l, t0 - 0.2, 0.4); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
      T(ctx, s, 150, y, 44, { weight: 800, color: col }); ctx.fillStyle = C.lokBebas; U.rr(ctx, 150, y + 34, 1500, 70, 35); ctx.fill(); ctx.fillStyle = col; U.rr(ctx, 150, y + 34, Math.max(70, 1500 * u), 70, 35); ctx.fill(); X.glow(ctx, 150 + 1500 * u, y + 69, 60, col, 0.6); ctx.restore(); });
    ctx.save(); ctx.strokeStyle = C.text2; ctx.lineWidth = 5; ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.moveTo(1650, 400); ctx.lineTo(1650, 830); ctx.stroke(); ctx.restore(); T(ctx, "garis akhir", 1650, 880, 34, { align: "center", weight: 700, color: C.text2 });
  };

  S.b4_4 = function (ctx, b, l, t) {
    const tG = U.at(b, "tim Google sendiri"), tB = U.at(b, "belum ada laporan");
    U.judul(ctx, "Kabar baiknya", l, 0.2, { y: 170, size: 72, col: C.term });
    U.muncul(ctx, l, tG - 0.3, 560, 520, () => { U.kotak(ctx, 170, 300, 780, 440, "", { col: C.term, glow: 0.3 }); T(ctx, "PENEMU", 230, 380, 34, { weight: 800, color: C.term, spacing: 5 }); T(ctx, "Reported by Google", 230, 480, 62, { weight: 900 }); T(ctx, "ditemukan tim Google sendiri,", 230, 580, 40, { weight: 600, color: C.text2 }); T(ctx, "bukan oleh penjahat", 230, 634, 40, { weight: 600, color: C.text2 }); });
    U.muncul(ctx, l, tB - 0.3, 1360, 520, () => { U.kotak(ctx, 970, 300, 780, 440, "", { col: C.term, glow: 0.3 }); T(ctx, "DIPAKAI MENYERANG?", 1030, 380, 34, { weight: 800, color: C.term, spacing: 5 }); T(ctx, "belum ada laporan", 1030, 480, 62, { weight: 900 }); U.perisai(ctx, 1360, 620, 150, C.term, {}); });
    U.muncul(ctx, l, tB + 0.6, 960, 860, () => U.pill(ctx, "keadaan saat video ini dibuat", 960, 850, { size: 36, col: C.dim, color: C.text2 }));
    U.sumber(ctx, "Sumber: Chrome Releases, NVD");
  };

  S.b4_5 = function (ctx, b, l, t) {
    const tM = U.at(b, "membuka halaman"), tH = U.at(b, "berhati-hati");
    U.judul(ctx, "Korban tetap harus membuka halamannya", l, tM - 0.4, { y: 150, col: C.amber });
    const f = U.hp(ctx, 620, 580, 520, 800); T(ctx, "Grup Alumni", f.x + 10, f.y + 40, 38, { weight: 800 }); ctx.fillStyle = C.line; ctx.fillRect(f.x, f.y + 62, f.w, 3);
    U.muncul(ctx, l, 0.4, f.x + 200, f.y + 150, () => { ctx.fillStyle = C.row1; U.rr(ctx, f.x, f.y + 100, 400, 90, 20); ctx.fill(); T(ctx, "Ada kabar bagus nih!", f.x + 24, f.y + 156, 32, { weight: 600 }); });
    U.muncul(ctx, l, 1.0, f.x + 220, f.y + 320, () => { ctx.fillStyle = C.row1; U.rr(ctx, f.x, f.y + 220, 440, 190, 20); ctx.fill(); T(ctx, "Klik sekarang juga:", f.x + 24, f.y + 276, 32, { weight: 600 }); T(ctx, "hadiah-gratis", f.x + 24, f.y + 330, 32, { mono: true, weight: 700, color: "#82AAFF" }); T(ctx, ".example/klaim", f.x + 24, f.y + 376, 32, { mono: true, weight: 700, color: "#82AAFF" }); });
    const [kx, ky] = U.jalan(l, tM - 0.3, 1.0, 760, 900, 640, 520); if (l > 1.2) U.kursor(ctx, kx, ky + Math.sin(t * 3) * 6, 1.3);
    U.muncul(ctx, l, tH - 0.2, 1340, 500, () => { U.ikon(ctx, "segitiga", 1340, 420, 280, C.amber); T(ctx, "tautan mencurigakan?", 1340, 660, 56, { align: "center", weight: 900, color: C.amber }); T(ctx, "jangan dibuka", 1340, 740, 56, { align: "center", weight: 900 }); });
  };

  S.b4_6 = function (ctx, b, l, t) {
    const t3 = U.at(b, "hampir tiga bulan"), tM = U.at(b, "miliaran orang"), u = eio(ramp(l, 0.4, t3 - 0.2));
    U.garisWaktu(ctx, 260, 1660, 420, u, C.text2); U.titik(ctx, 260, 420, C.amber, 20); T(ctx, "celah dilaporkan", 260, 340, 44, { align: "center", weight: 800, color: C.amber });
    if (u > 0.98) { U.titik(ctx, 1660, 420, C.term, 20); T(ctx, "patch dirilis", 1660, 340, 44, { align: "center", weight: 800, color: C.term }); }
    U.muncul(ctx, l, t3 - 0.1, 960, 520, () => U.pill(ctx, "hampir 3 bulan", 960, 520, { size: 60, col: C.amber }));
    const m = ramp(l, tM - 0.6, 1.6); if (m > 0) { for (let i = 0; i < 96; i++) { if (i / 96 > m) break; const x = 200 + (i % 24) * 66, y = 680 + Math.floor(i / 24) * 66; ctx.fillStyle = U.rgba(C.php, 0.8); U.rr(ctx, x - 20, y - 14, 40, 28, 5); ctx.fill(); }
      U.muncul(ctx, l, tM, 960, 990, () => U.pill(ctx, "dipakai miliaran orang", 960, 985, { size: 40, col: C.php, fill: "rgba(11,11,13,0.96)" })); }
  };

  S.b4_7 = function (ctx, b, l, t) {
    const t1 = U.at(b, "tidak perlu panik"), t2 = U.at(b, "tidak boleh menunda"), t3 = U.at(b, "Sekarang");
    U.judul(ctx, "Tidak perlu panik.", l, t1 - 0.1, { y: 400, size: 120, col: C.term });
    U.judul(ctx, "Jangan menunda.", l, t2 - 0.1, { y: 590, size: 120, col: C.amber });
    U.muncul(ctx, l, t3, 960, 800, () => U.pill(ctx, "periksa Chrome di perangkatmu", 960, 800, { size: 48, col: C.php }));
  };

  U.reg(4, S);
})(typeof window !== "undefined" ? window : globalThis);
