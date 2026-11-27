/* D13 bab 1 — Level 1: garis waktu (rilis konsol, build Xbox bocor, modder mencoba di PC, video 4K 120 FPS), lalu alat pertama: FPS. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon, Z = K.d13;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080;
  const PTS = [{ x: 330, lab: "19 Nov", sub: "Rilis: PS5 dan Xbox Series", col: N.green }, { x: 760, lab: "Beberapa hari", sub: "Berkas game Xbox bocor", col: N.red },
    { x: 1190, lab: "Lalu", sub: "Modder mencoba di PC", col: N.violet }, { x: 1600, lab: "26 Nov", sub: "Video 4K 120 FPS", col: N.pink }];
  function garis(ctx, l, ts, a = 1) { ctx.save(); ctx.globalAlpha *= a; X.garisWaktu(ctx, l, 470, 190, 1740, PTS.map((p, i) => ({ ...p, t0: ts[i], fit: 390 })), { size: 52 }); ctx.restore(); }

  S.b1_1 = function (ctx, b, l, t) {
    const tRil = D.at(b, "19 November"), tPC = D.at(b, "Sampai sekarang");
    U.ruang(ctx, t, { col: N.cyan });
    garis(ctx, l, [tRil - 0.2, 99, 99, 99]);
    if (l > tPC - 0.2) { const p = U.pop(l, tPC - 0.2); const r = { x: 1110, y: 590, w: 600, h: 230, cx: 1410 };
      X.kartu(ctx, r, { col: N.gold, judul: "Versi PC", sub: "belum diumumkan", a: p.a, sp: p.sp, ih: 0 }); }
    X.judul(ctx, "Apa yang sedang terjadi?", l, 0.1, N.cyan);
  };
  S.b1_2 = function (ctx, b, l, t) {
    const tBoc = D.at(b, "bocor ke internet"), tMod = D.at(b, "Para modder"), tVid = D.at(b, "video sebelumnya");
    U.ruang(ctx, t, { col: N.red });
    garis(ctx, l, [-1, tBoc - 0.3, tMod - 0.2, 99]);
    X.bawah(ctx, "Tanpa kode sumber", l, D.at(b, "tanpa kode sumber") - 0.1, N.red, { y: 740 });
    X.bawah(ctx, "Cara kerjanya: video sebelumnya, “GTA 6 Sudah Bisa Jalan di PC?”", l, tVid - 0.3, N.cyan);
  };
  S.b1_3 = function (ctx, b, l, t) {
    const tMun = D.at(b, "muncullah"), tAlat = D.at(b, "satu alat"), tFPS = D.at(b, "tentang FPS");
    U.ruang(ctx, t, { col: N.pink });
    const sh = eio(ramp(l, tAlat - 0.3, 0.7));
    garis(ctx, l, [-1, -1, -1, tMun - 0.2], 1 - sh);
    if (l < tAlat + 0.5) { const p = U.pop(l, tMun + 0.3); Z.tweet(ctx, "tweet_klaim_repost", 1560, 700, 250, { a: p.a * (1 - sh), sp: p.sp, col: N.pink }); }
    if (sh > 0) { ctx.save(); ctx.globalAlpha *= sh; D.glow(ctx, 960, 520, 520, N.cyan, 0.2); Z.kaca(ctx, 820, 500, 380, N.cyan, { rot: 0.1 * Math.sin(t) });
      U.neonPop(ctx, "FPS", 820, 540, 110, N.gold, l, tFPS - 0.2, { align: "center" }); ctx.restore();
      X.judul(ctx, "Alat detektif pertama", l, tAlat, N.cyan); }
  };
  Z.reg(1, S);
})(typeof window !== "undefined" ? window : globalThis);
