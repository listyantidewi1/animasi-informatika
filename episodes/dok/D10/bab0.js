/* D10 bab 0 — pembuka (b0_1 … b0_4): konsol sudah, PC belum; layar hitam "hampir menyala"; tanpa kode sumber;
   tiga hal yang akan dibedah; tiga slot misteri (satu sudah cocok). Tidak membocorkan kesimpulan. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = Math.PI * 2;

  S.b0_1 = function (ctx, b, l, t) {
    const tPC = D.at(b, "belum mengumumkan"), tTapi = D.at(b, "Tapi minggu ini"), tHam = D.at(b, "hampir menyala");
    const dm = ramp(l, tTapi - 0.2, 0.8);
    K.kota3d.draw(ctx, t, { z: t * 9, dim: 0.3 + 0.45 * dm });
    const a1 = 1 - dm;
    if (a1 > 0.01) { ctx.save(); ctx.globalAlpha *= a1;
      const rs = X.cols(2, { x0: 300, x1: 1620, y: 300, h: 480, gap: 120 });
      const p1 = U.pop(l, 0.3), p2 = U.pop(l, tPC - 0.2);
      X.kartu(ctx, rs[0], { col: N.green, ikon: I.konsol, judul: "Konsol", sub: "sudah rilis", a: p1.a, sp: p1.sp, t });
      U.centang(ctx, rs[0].x + rs[0].w - 70, rs[0].y + 70, 44, ramp(l, 0.8, 0.4));
      X.kartu(ctx, rs[1], { col: N.gold, ikon: I.pc, judul: "PC", sub: "belum ada rencana rilis", a: p2.a, sp: p2.sp, t });
      if (p2.a > 0) U.tanya(ctx, rs[1].x + rs[1].w - 70, rs[1].y + 70, 80, N.gold, p2.a);
      ctx.restore(); X.judul(ctx, "GTA 6 baru saja dirilis", l, 0.2, N.pink, { a: a1 }); }
    if (dm > 0.01) { ctx.save(); ctx.globalAlpha *= dm; D.glow(ctx, W / 2, 520, 620, N.cyan, 0.18);
      const r = I.monitor(ctx, W / 2, 540, 520, N.cyan, t);
      const ph = ramp(l, tHam, 0.4); if (ph > 0) { ctx.globalAlpha *= ph; txt(ctx, "Windows", W / 2, r.y + r.h / 2 + 14, 60, { align: "center", weight: 800, color: D.hexA(N.ink2, 0.5) }); }
      ctx.restore();
      X.judul(ctx, "Modder: “hampir menyala di Windows”", l, tHam - 0.2, N.cyan); X.status(ctx, l, tTapi + 0.5); }
  };
  S.b0_1.noCam = true;

  S.b0_2 = function (ctx, b, l, t) {
    const tKode = D.at(b, "tidak punya kode"), tBan = D.at(b, "tidak dibantu"), tLalu = D.at(b, "bagaimana mungkin");
    U.senja(ctx, t, { dim: 0.45, sunX: 1520 });
    U.raka(ctx, 1560, 1010, 700, { t, pose: l > tLalu ? "garuk" : "berdiri", face: "bingung", look: [-0.7, 0], flip: true });
    const sh = eio(ramp(l, tLalu - 0.3, 0.7));
    ctx.save(); ctx.globalAlpha *= 1 - sh;
    const rs = X.cols(2, { x0: 130, x1: 1230, y: 290, h: 460, gap: 60 });
    const p1 = U.pop(l, tKode - 0.2), p2 = U.pop(l, tBan - 0.2);
    X.kartu(ctx, rs[0], { col: N.cyan, ikon: I.resep, judul: "Kode sumber", sub: "tidak punya", scol: N.red, a: p1.a, sp: p1.sp });
    U.silang(ctx, rs[0].cx, rs[0].y + 150, 150, ramp(l, tKode + 0.5, 0.4));
    X.kartu(ctx, rs[1], { col: N.violet, ikon: I.jabat, judul: "Bantuan Rockstar", sub: "tidak ada", scol: N.red, a: p2.a, sp: p2.sp });
    U.silang(ctx, rs[1].cx, rs[1].y + 150, 150, ramp(l, tBan + 0.5, 0.4));
    ctx.restore();
    if (sh > 0.01) { ctx.save(); ctx.globalAlpha *= sh; I.konsol(ctx, 330, 520, 300, N.pink); I.pc(ctx, 1030, 500, 300, N.cyan);
      U.panah(ctx, 500, 520, 850, 520, N.gold, ramp(l, tLalu, 0.6), 10, { dash: [22, 16] }); U.tanya(ctx, 675, 420, 150, N.gold, ramp(l, tLalu + 0.3, 0.4));
      txt(ctx, "game konsol", 330, 760, 50, { align: "center", weight: 900 }); txt(ctx, "komputer", 1030, 760, 50, { align: "center", weight: 900 }); ctx.restore(); }
    X.judul(ctx, "Tanpa kode sumber, tanpa bantuan Rockstar", l, tKode - 0.3, N.red, { a: 1 - sh });
    X.judul(ctx, "Bagaimana bisa dipindahkan oleh orang luar?", l, tLalu - 0.1, N.gold);
  };

  S.b0_3 = function (ctx, b, l, t) {
    const tRek = D.at(b, "rekompilasi statis"), tVid = D.at(b, "Di video ini");
    U.ruang(ctx, t, { col: N.pink, gx: 960, gy: 320 });
    const up = eio(ramp(l, tVid - 0.2, 0.7)), pa = U.pop(l, tRek - 0.1);
    if (pa.a > 0) { ctx.save(); ctx.translate(W / 2, lerp(520, 200, up)); const k = lerp(0.7, 1, pa.sp) * lerp(1, 0.6, up); ctx.scale(k, k); U.neon(ctx, "REKOMPILASI STATIS", 0, 0, 120, N.pink, { align: "center", a: pa.a, fit: 1700 }); ctx.restore(); }
    X.deret(ctx, b, l, t, [
      { ph: "membedah cara kerjanya", ikon: I.gir, judul: "Cara kerjanya", sub: "apa yang sebenarnya dilakukan", col: N.cyan },
      { ph: "memeriksa klaim", ikon: I.lup, judul: "Klaim dan bukti", sub: "mana yang benar-benar terbukti", col: N.gold },
      { ph: "tiba-tiba menghilang", ikon: I.hilang, judul: "Proyeknya hilang", sub: "mengapa tiba-tiba menghilang", col: N.red }], { y: 310, h: 500 });
  };

  S.b0_4 = function (ctx, b, l, t) {
    const tTiga = D.at(b, "tiga hal"), tSatu = D.at(b, "satu di antaranya"), tDua = D.at(b, "Dua hal sisanya");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 300 });
    const rs = X.cols(3, { x0: 260, x1: 1660, y: 320, h: 430, gap: 70 });
    rs.forEach((r, i) => { const p = U.pop(l, tTiga - 0.2 + i * 0.25); if (p.a <= 0) return; const ok = i === 0 && l > tSatu, bad = i > 0 && l > tDua, col = ok ? N.green : bad ? N.red : N.gold;
      const pul = bad ? 1 + 0.03 * Math.sin(t * 6 + i) : 1; ctx.save(); ctx.translate(r.cx, r.y + r.h / 2); ctx.scale(pul, pul); ctx.translate(-r.cx, -(r.y + r.h / 2));
      X.kartu(ctx, r, { col, a: p.a, sp: p.sp, nomor: i + 1 }); ctx.globalAlpha *= p.a;
      if (ok) U.centang(ctx, r.cx, r.y + 190, 110, ramp(l, tSatu, 0.5)); else U.tanya(ctx, r.cx, r.y + 190, 200, col);
      txt(ctx, ok ? "sudah cocok" : bad ? "belum cocok" : "hal ke-" + (i + 1), r.cx, r.y + r.h - 50, 48, { align: "center", weight: 900, color: col, fit: r.w - 40 }); ctx.restore(); });
    X.judul(ctx, "Sebuah game butuh tiga hal dari mesinnya", l, tTiga - 0.4, N.gold, { a: 1 - ramp(l, tDua - 0.2, 0.3) });
    X.judul(ctx, "Dua hal inilah penentunya", l, tDua, N.red);
  };

  X.reg(0, S);
})(typeof window !== "undefined" ? window : globalThis);
