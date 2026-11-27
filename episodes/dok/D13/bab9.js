/* D13 bab 9 — Bonus Stage: kabar "3-5 FPS lewat emulator Xbox". Postingan asli (akun media), laporan media,
   emulator vs rekompilasi statis, 3 FPS vs 30 FPS, DMCA 3.007 repository. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon, Z = K.d13;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = Math.PI * 2;

  S.b9_1 = function (ctx, b, l, t) {
    const tEmu = D.at(b, "emulator Xbox");
    U.ruang(ctx, t, { col: N.pink });
    const p = U.pop(l, 0.1); Z.tweet(ctx, "tweet_pubity", 960, 470, 460, { a: p.a, sp: p.sp, col: N.pink });
    U.tag(ctx, "3-5 FPS", 640, 762, l, D.at(b, "3 sampai 5") - 0.2, { col: N.gold, size: 52 });
    U.tag(ctx, "emulator Xbox?", 1280, 762, l, tEmu - 0.2, { col: N.cyan, size: 52 });
    X.sumber(ctx, l, 0.6, "unggahan akun media di X, 25 Nov 2026");
  };
  S.b9_2 = function (ctx, b, l, t) {
    const tBen = D.at(b, "memang benar"), tNb = D.at(b, "Notebookcheck"), tDe = D.at(b, "Decrypt"), tBel = D.at(b, "belum ada yang");
    U.ruang(ctx, t, { col: N.green });
    U.neonPop(ctx, "SEBAGIAN BENAR", 960, 330, 110, N.green, l, tBen - 0.3, { align: "center", fit: 1500 });
    X.deret(ctx, b, l, t, [{ t0: tNb - 0.2, judul: "Notebookcheck", sub: "proyek tercepat 1-5 FPS", col: N.cyan, ikon: I.lup }, { t0: tDe - 0.2, judul: "Decrypt", sub: "rekaman dan angka belum diverifikasi", col: N.gold, ikon: I.buku }], { x0: 260, x1: 1660, y: 400, h: 390, gap: 80, ih: 110 });
    X.bawah(ctx, "Banyak tim mengaku, belum ada yang diperiksa secara mandiri", l, tBel - 0.2, N.gold, { size: 46 });
  };
  S.b9_3 = function (ctx, b, l, t) {
    const tBuk = D.at(b, "bukan emulator"), tRek = D.at(b, "rekompilasi statis"), tSeb = D.at(b, "sebelum dijalankan");
    U.ruang(ctx, t, { col: N.violet });
    const rs = X.cols(2, { x0: 160, x1: 1760, y: 280, h: 480, gap: 120 });
    const p1 = U.pop(l, 0.1), p2 = U.pop(l, tRek - 0.3);
    X.kartu(ctx, rs[0], { col: N.cyan, judul: "Emulator", sub: "menerjemahkan sambil game berjalan", ikon: I.mesin, a: p1.a, sp: p1.sp, redup: l > tBuk + 0.4, t });
    U.silang(ctx, rs[0].cx, rs[0].y + 120, 130, ramp(l, tBuk, 0.4));
    X.kartu(ctx, rs[1], { col: N.gold, judul: "Rekompilasi statis", sub: "menerjemahkan dulu, baru dijalankan", ikon: I.buku, a: p2.a, sp: p2.sp, t });
    if (l > tSeb) U.centang(ctx, rs[1].x + rs[1].w - 70, rs[1].y + 70, 44, ramp(l, tSeb, 0.4), N.gold);
    X.bawah(ctx, "Dibahas lengkap di video sebelumnya", l, D.at(b, "video sebelumnya") - 0.3, N.violet);
  };
  S.b9_4 = function (ctx, b, l, t) {
    const t3 = D.at(b, "3 FPS"), tSli = D.at(b, "tayangan slide");
    U.ruang(ctx, t, { col: N.orange });
    const jalan = tt => 300 + ((tt * 260) % 1100);
    [[3, 330, N.red], [30, 600, N.green]].forEach(([fps, y, col], i) => { const a = ramp(l, i ? t3 + 1.2 : t3 - 0.3, 0.4); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
      txt(ctx, fps + " FPS", 160, y + 14, 60, { weight: 900, color: col }); const tt = Math.floor(t * fps) / fps; Z.bola(ctx, jalan(tt) + 150, y, 46, col);
      ctx.strokeStyle = D.hexA(N.ink2, 0.3); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(450, y + 60); ctx.lineTo(1760, y + 60); ctx.stroke(); ctx.restore(); });
    X.bawah(ctx, "3 FPS: lebih mirip tayangan slide", l, tSli - 0.3, N.red);
  };
  S.b9_5 = function (ctx, b, l, t) {
    const tBoc = D.at(b, "berkas bocoran"), tTur = D.at(b, "menurunkan proyek"), t3007 = D.at(b, "3.007");
    U.ruang(ctx, t, { col: N.red });
    U.tag(ctx, "Semua memakai berkas bocoran", 740, 280, l, tBoc - 0.2, { col: N.red, size: 50 });
    const cols = 97, rows = 31, x0 = 110, y0 = 350, s = 12, gp = 1, u = ramp(l, tTur, 2.6);
    if (l > tTur - 0.6) { ctx.save(); ctx.globalAlpha *= ramp(l, tTur - 0.6, 0.4); const r = U.rng(5);
      for (let i = 0; i < 3007; i++) { const c = i % cols, rr = Math.floor(i / cols), off = r() < u ? 1 : 0; ctx.fillStyle = off ? "rgba(255,59,92,0.25)" : (i === 0 ? N.gold : N.green); ctx.fillRect(x0 + c * (s + gp), y0 + rr * (s + gp), s, s); }
      ctx.restore(); }
    if (l > t3007 - 0.3) { ctx.save(); ctx.globalAlpha *= ramp(l, t3007 - 0.3, 0.4); Z.angkaGulir(ctx, 1610, 560, 110, N.red, 0, 3007, ramp(l, t3007 - 0.3, 1.2), { fit: 380 }); txt(ctx, "repository", 1610, 650, 54, { align: "center", weight: 900, color: N.ink }); ctx.restore(); }
    X.sumber(ctx, l, tTur + 0.3, "pemberitahuan DMCA di GitHub, 24 Nov 2026 (Decrypt, heise)");
  };
  Z.reg(9, S);
})(typeof window !== "undefined" ? window : globalThis);
