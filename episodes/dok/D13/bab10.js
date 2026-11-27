/* D13 bab 10 — Misi selesai: lima pertanyaan detektif, ajakan ke video sebelumnya, keterbukaan AI. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon, Z = K.d13;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080;
  const Q = [["videonya bisa", "Bisakah videonya membuktikan angkanya?"], ["tulisannya masuk", "Masuk akalkah tulisannya bagi program?"], ["polanya berulang", "Apakah polanya berulang?"],
    ["saling cocok", "Apakah angkanya saling cocok?"], ["lompatannya masuk", "Masuk akalkah lompatannya, dan adakah sumbernya?"]];

  S.b10_1 = function (ctx, b, l, t) {
    U.ruang(ctx, t, { col: N.green });
    Z.kaca(ctx, 960, 430, 300, N.green);
    U.neonPop(ctx, "5 PERTANYAAN", 960, 720, 120, N.green, l, D.at(b, "lima pertanyaan") - 0.2, { align: "center", fit: 1500 });
  };
  S.b10_2 = function (ctx, b, l, t) {
    U.ruang(ctx, t, { col: N.green });
    X.daftar(ctx, b, l, 260, 250, 1400, Q.map(([ph, s], i) => ({ ph, s: (i + 1) + ". " + s, col: N.green, tanda: "titik" })), { size: 46, rh: 112 });
  };
  S.b10_3 = function (ctx, b, l, t) {
    const tVid = D.at(b, "video kami"), tJum = D.at(b, "Sampai jumpa");
    U.ruang(ctx, t, { col: N.cyan });
    const p = U.pop(l, tVid - 0.4); if (p.a > 0) { const r = { x: 460, y: 260, w: 1000, h: 400, cx: 960 }; X.kartu(ctx, r, { col: N.cyan, ikon: I.monitor, judul: "Video sebelumnya", sub: "GTA 6 Sudah Bisa Jalan di PC?", a: p.a, sp: p.sp, t, ih: 150 }); }
    U.neonPop(ctx, "SAMPAI JUMPA DI KASUS BERIKUTNYA", 960, 800, 70, N.gold, l, tJum - 0.2, { align: "center", fit: 1700 });
  };
  S.b10_99 = function (ctx, b, l, t) {
    U.ruang(ctx, t, { col: N.violet, debu: true });
    const a = ramp(l, 0.2, 0.6); ctx.save(); ctx.globalAlpha *= a;
    X.para(ctx, "Naskah video ini disusun dengan bantuan AI, termasuk Claude buatan Anthropic, lalu diperiksa faktanya dan disunting oleh manusia.", 960, 420, 52, 1400, { align: "center", color: N.ink });
    txt(ctx, "Semua sumber ada di deskripsi.", 960, 700, 48, { align: "center", weight: 800, color: N.gold }); ctx.restore();
  };
  Z.reg(10, S);
})(typeof window !== "undefined" ? window : globalThis);
