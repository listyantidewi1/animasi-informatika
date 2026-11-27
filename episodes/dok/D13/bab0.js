/* D13 bab 0 — pembuka: video asli yang beredar, postingan aslinya (akun diburamkan), jumlah tayangan,
   perbesar ke catatan di pojok layar, lima slot petunjuk. Tidak membocorkan kesimpulan. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, Z = K.d13;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080;

  S.b0_1 = function (ctx, b, l, t) {
    const t4k = D.at(b, "resolusi 4K"), t120 = D.at(b, "kecepatan 120"), tKat = D.at(b, "Katanya"), tAI = D.at(b, "oleh AI");
    const dm = ramp(l, tKat - 0.3, 0.8);
    Z.latar(ctx, l, { dim: lerp(0.12, 0.62, dm) });
    const p = U.pop(l, tKat - 0.1);
    Z.tweet(ctx, "tweet_klaim_repost", lerp(2300, 1420, eout(p.sp)), 520, 800, { a: p.a, col: N.cyan });
    const tg = [[t4k, "Resolusi 4K", N.cyan], [t120, "120 FPS", N.pink], [tAI, "Ditambal oleh AI?", N.gold]];
    tg.forEach(([t0, s, col], i) => U.tag(ctx, s, 470, 470 + i * 130, l, t0, { col, size: 60 }));
    Z.labelAsli(ctx, "Video asli yang beredar di X", 1 - dm);
    X.sumber(ctx, l, tKat + 0.4, "unggahan di X, 26 November 2026");
  };

  S.b0_2 = function (ctx, b, l, t) {
    const tSeh = D.at(b, "Dalam sehari"), tRat = D.at(b, "ratusan ribu");
    Z.latar(ctx, l + 12.5, { dim: 0.7 });
    const p1 = U.pop(l, 0.1), p2 = U.pop(l, tSeh + 0.2);
    Z.tweet(ctx, "tweet_klaim_asli", 560, 560, 640, { a: p1.a, sp: p1.sp, col: N.violet, rot: -0.03 });
    Z.tweet(ctx, "tweet_klaim_repost", 1360, 580, 640, { a: p2.a, sp: p2.sp, col: N.cyan, rot: 0.025 });
    D.post(c => { const k = ramp(l, tRat - 0.3, 0.4); if (k <= 0) return; c.save(); c.globalAlpha *= k; c.fillStyle = "rgba(10,4,26,0.9)"; RR(c, 460, 120, 1000, 150, 30); c.fill();
      c.strokeStyle = N.gold; c.lineWidth = 4; c.stroke(); Z.angkaGulir(c, 960, 222, 92, N.gold, 0, 734000, ramp(l, tRat - 0.3, 1.6), { pre: "± ", suf: " tayangan" }); c.restore(); });
    X.sumber(ctx, l, tRat + 0.6, "dua unggahan di X, dihitung 27 Nov pagi");
  };

  S.b0_3 = function (ctx, b, l, t) {
    const tPoj = D.at(b, "pojok layarnya"), tLima = D.at(b, "lima petunjuk");
    // perbesar dari layar penuh ke kotak catatan di kiri atas (koordinat frame 1280x720)
    const z = eio(ramp(l, tPoj - 0.2, 1.6)), sx = 0, sy = 0, sw = lerp(1280, 640, z), sh = lerp(720, 360, z);
    Z.foto(ctx, "f" + Z.frameKlip(l + 18), 0, 0, W, HH, { r: 0.01, src: [sx, sy, sw, sh], dim: lerp(0.2, 0.1, z) });
    const lm = ramp(l, tLima - 0.3, 0.5);
    if (lm > 0) { ctx.fillStyle = `rgba(8,3,22,${0.55 * lm})`; ctx.fillRect(0, 0, W, HH); }
    const k = ramp(l, tPoj + 0.4, 0.6); if (k > 0 && lm < 1) { ctx.save(); ctx.globalAlpha *= k * (1 - lm); Z.kaca(ctx, 700 + 260 * Math.sin(l * 1.3), 520 + 140 * Math.cos(l * 1.1), 360, N.cyan); ctx.restore(); }
    for (let i = 0; i < 5; i++) { const p = U.pop(l, tLima + 0.1 + i * 0.18); if (p.a <= 0) continue; ctx.save(); ctx.globalAlpha *= p.a; const x = 560 + i * 200, s = lerp(60, 150, p.sp);
      Z.slot(ctx, x, 560, s, i + 1, 0, t); ctx.restore(); }
    X.judul(ctx, "Lima petunjuk tersembunyi di sini", l, tLima - 0.1, N.gold);
    Z.labelAsli(ctx, "Video asli, diperbesar", 1 - lm);
  };

  S.b0_4 = function (ctx, b, l, t) {
    const tKam = D.at(b, "kamu yang"), tCoba = D.at(b, "Coba temukan"), tEnd = D.speechEnd(b);
    Z.foto(ctx, "utuh5", 0, 0, W, HH, { r: 0.01, dim: 0.78 });
    D.glow(ctx, 960, 420, 700, N.gold, 0.18);
    U.neonPop(ctx, "KAMU DETEKTIFNYA", 960, 400, 130, N.gold, l, tKam - 0.1, { align: "center", fit: 1600 });
    for (let i = 0; i < 5; i++) { const x = 560 + i * 200; Z.slot(ctx, x, 600, 130, i + 1, l > tCoba ? 1 : 0, t + i * 0.4); }
    // jeda "cari sendiri": cincin hitung mundur selama jeda
    const u = clamp((l - tEnd) / Math.max(1, b.dur - tEnd - 0.4));
    if (l > tEnd) { ctx.save(); ctx.globalAlpha *= ramp(l, tEnd, 0.4); ctx.strokeStyle = D.hexA(N.cyan, 0.25); ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(960, 800, 50, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = N.cyan; ctx.shadowColor = N.cyan; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(960, 800, 50, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - u)); ctx.stroke(); ctx.restore(); }
    X.bawah(ctx, "Jeda videonya dulu, lalu cari sendiri", l, tEnd - 0.2, N.cyan, { y: 900 });
  };

  Z.reg(0, S);
})(typeof window !== "undefined" ? window : globalThis);
