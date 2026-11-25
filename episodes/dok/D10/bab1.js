/* D10 bab 1 — LEVEL 1: Apa yang sebenarnya bocor? (b1_1 … b1_5). Garis waktu 19 → 23 November, peti 209 GB tanpa kunci
   (executable), kunci menyusul, perlombaan dimulai, versi Xbox bukan versi PC. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080;

  S.b1_1 = function (ctx, b, l, t) {
    const tTgl = D.at(b, "sembilan belas November"), tPS = D.at(b, "PlayStation 5"), tXb = D.at(b, "Xbox Series");
    U.senja(ctx, t, { dim: 0.5, sunX: 960 });
    const pt = U.pop(l, tTgl - 0.2); if (pt.a > 0) { ctx.save(); ctx.globalAlpha *= pt.a; U.panel(ctx, 660, 270, 600, 150, { col: N.pink }); txt(ctx, "19 November 2026", 960, 366, 64, { align: "center", weight: 900, fit: 540 }); ctx.restore(); }
    const rs = X.cols(2, { x0: 380, x1: 1540, y: 470, h: 360, gap: 80 });
    [[tPS, "PlayStation 5"], [tXb, "Xbox Series"]].forEach(([t0, s], i) => { const p = U.pop(l, t0 - 0.2); X.kartu(ctx, rs[i], { col: N.cyan, ikon: I.konsol, ih: 170, judul: s, a: p.a, sp: p.sp }); });
    X.judul(ctx, "GTA 6 rilis hanya untuk konsol", l, 1.9, N.cyan);
  };

  // peti besar + label
  function peti(ctx, x, y, s, l, t, o = {}) { I.peti(ctx, x, y, s, o.col || N.violet, t, { kunci: o.kunci }); }

  S.b1_2 = function (ctx, b, l, t) {
    const tCy = D.at(b, "Cyberleek"), tUk = D.at(b, "dua ratus sembilan"), tTah = D.at(b, "sengaja ditahan"), tEx = D.at(b, "executable utamanya");
    U.ruang(ctx, t, { col: N.violet, gx: 700, gy: 320 });
    const pp = U.pop(l, tCy - 0.1); if (pp.a > 0) { ctx.save(); ctx.globalAlpha *= pp.a; peti(ctx, 620, 480, 440 * lerp(0.8, 1, pp.sp), l, t);
      txt(ctx, "salinan versi Xbox", 620, 700, 54, { align: "center", weight: 900 }); if (l > tUk - 0.2) txt(ctx, "±209 GB", 620, 772, 60, { align: "center", weight: 900, color: N.gold }); ctx.restore(); }
    const pk = U.pop(l, tTah - 0.2); if (pk.a > 0) { ctx.save(); ctx.globalAlpha *= pk.a; const x = 1380, y = 440; ctx.setLineDash([18, 12]); ctx.strokeStyle = D.hexA(N.red, 0.6 + 0.4 * Math.sin(t * 6)); ctx.lineWidth = 6; RR(ctx, x - 190, y - 150, 380, 300, 26); ctx.stroke(); ctx.setLineDash([]);
      ctx.globalAlpha *= 0.45; I.kunci(ctx, x, y, 260, N.red); ctx.globalAlpha /= 0.45; txt(ctx, "ditahan", x, y + 220, 54, { align: "center", weight: 900, color: N.red });
      if (l > tEx - 0.2) txt(ctx, "executable utama", x, y + 290, 50, { align: "center", weight: 800, color: N.ink }); ctx.restore(); }
    X.judul(ctx, "Cyberleek membagikan salinan lewat torrent", l, tCy - 0.3, N.violet);
    X.sumber(ctx, l, tUk, "XDA Developers, Decrypt");
  };

  S.b1_3 = function (ctx, b, l, t) {
    const tDef = D.at(b, "program inti"), tTan = D.at(b, "Tanpa berkas itu"), tG = D.at(b, "gambar"), tS = D.at(b, "suara"), tP = D.at(b, "peta"), tX = D.at(b, "tidak bisa dijalankan");
    U.ruang(ctx, t, { col: N.red, gx: 400, gy: 320 });
    const rs = X.cols(4, { y: 290, h: 470, gap: 36 });
    const p0 = U.pop(l, 0.3); X.kartu(ctx, rs[0], { col: N.red, ikon: I.kunci, judul: "Executable", sub: l > tDef - 0.2 ? "program inti game" : "", a: p0.a, sp: p0.sp });
    [[tG, "Gambar", I.os], [tS, "Suara", I.balon], [tP, "Peta", I.kalender]].forEach(([t0, s, ik], i) => { const p = U.pop(l, t0 - 0.15); X.kartu(ctx, rs[i + 1], { col: N.cyan, ikon: ik, judul: s, sub: "hanya data", a: p.a, sp: p.sp }); });
    if (l > tTan) U.silang(ctx, rs[0].cx, rs[0].y + 130, 160, ramp(l, tTan, 0.4));
    X.judul(ctx, "Executable = program inti game", l, 0.2, N.red, { a: 1 - ramp(l, tTan - 0.2, 0.3) });
    X.judul(ctx, "Tanpa executable, 209 GB itu hanya tumpukan data", l, tTan, N.gold);
    X.bawah(ctx, "tidak bisa dijalankan", l, tX - 0.1, N.red);
  };

  S.b1_4 = function (ctx, b, l, t) {
    const tEmp = D.at(b, "Empat hari kemudian"), tTgl = D.at(b, "dua puluh tiga November"), tRil = D.at(b, "merilis berkas executable"), tLom = D.at(b, "perlombaan dimulai"), tWin = D.at(b, "di Windows");
    U.ruang(ctx, t, { col: N.gold, gx: 1300, gy: 300 });
    const out = eio(ramp(l, tLom - 0.4, 0.6));
    ctx.save(); ctx.globalAlpha *= 1 - out;
    X.garisWaktu(ctx, l, 430, 360, 1560, [{ x: 420, lab: "19 November", sub: "salinan 209 GB, tanpa executable", col: N.violet, t0: 0.3 }, { x: 1500, lab: "23 November", sub: "executable dirilis", col: N.gold, t0: tTgl - 0.2 }]);
    const k = eio(ramp(l, tEmp, Math.max(0.8, tTgl - tEmp))); if (k > 0) { ctx.save(); ctx.strokeStyle = N.gold; ctx.lineWidth = 8; ctx.shadowColor = N.gold; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(420, 430); ctx.lineTo(lerp(420, 1500, k), 430); ctx.stroke(); ctx.restore();
      txt(ctx, "4 hari", 960, 400, 48, { align: "center", weight: 900, color: N.gold }); }
    const pk = U.pop(l, tRil); if (pk.a > 0) { ctx.save(); ctx.globalAlpha *= pk.a; I.kunci(ctx, 960, 700, 240 * lerp(0.7, 1, pk.sp), N.gold); ctx.restore(); }
    ctx.restore();
    if (out > 0.01) { ctx.save(); ctx.globalAlpha *= out; const xe = 1500; I.pc(ctx, xe, 500, 300, N.cyan); if (l > tWin - 0.3) txt(ctx, "Windows", xe, 730, 52, { align: "center", weight: 900 });
      [0, 1, 2].forEach(i => { const y = 360 + i * 150, u = eio(ramp(l, tLom + i * 0.15, 2.4)) * [0.9, 0.72, 0.8][i], x = lerp(200, 1180, u), col = [N.pink, N.gold, N.green][i];
        ctx.save(); ctx.strokeStyle = D.hexA(col, 0.35); ctx.lineWidth = 6; ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.moveTo(200, y); ctx.lineTo(1180, y); ctx.stroke(); ctx.restore();
        I.orang(ctx, x, y - 20, 120, col); txt(ctx, "tim " + "ABC"[i], x, y + 76, 42, { align: "center", weight: 800, color: col }); }); ctx.restore(); }
    X.judul(ctx, "Empat hari kemudian, executable dirilis", l, tEmp - 0.2, N.gold, { a: 1 - out });
    X.judul(ctx, "Perlombaan dimulai", l, tLom - 0.1, N.pink);
    X.sumber(ctx, l, tRil + 0.5, "XDA Developers, Decrypt");
  };

  S.b1_5 = function (ctx, b, l, t) {
    const tXb = D.at(b, "versi Xbox"), tPC = D.at(b, "bukan versi PC"), tTid = D.at(b, "tidak bisa dibuka"), tMen = D.at(b, "Mengapa begitu"), tMs = D.at(b, "Microsoft");
    U.ruang(ctx, t, { col: N.cyan, gx: 960, gy: 300 });
    const rs = X.cols(2, { x0: 250, x1: 1670, y: 300, h: 440, gap: 300 });
    const p1 = U.pop(l, tXb - 0.2), p2 = U.pop(l, tPC - 0.2);
    X.kartu(ctx, rs[0], { col: N.pink, ikon: I.konsol, judul: "Versi Xbox", sub: "inilah yang bocor", a: p1.a, sp: p1.sp });
    X.kartu(ctx, rs[1], { col: N.cyan, ikon: I.pc, judul: "Versi PC", sub: "belum ada", a: p2.a, sp: p2.sp });
    const pn = U.pop(l, tTid - 0.1); if (pn.a > 0) { ctx.save(); ctx.globalAlpha *= pn.a * (1 - ramp(l, tMen - 0.3, 0.3)); txt(ctx, "≠", 960, 560, 170, { align: "center", weight: 900, color: N.red }); ctx.restore(); }
    U.tanya(ctx, 960, 400, 130, N.gold, ramp(l, tMen, 0.4) * (0.7 + 0.3 * Math.sin(t * 4)));
    X.judul(ctx, "Yang bocor adalah versi Xbox, bukan versi PC", l, tXb - 0.3, N.pink);
    X.bawah(ctx, "Padahal Xbox dan Windows sama-sama buatan Microsoft", l, tMs - 1.2, N.gold);
  };

  X.reg(1, S);
})(typeof window !== "undefined" ? window : globalThis);
