/* D13 bab 7 — Petunjuk 5: lompatan yang terlalu jauh. Kalender, grafik batang FPS (3-5 pelacak proyek, 25-30 klaim belum
   terverifikasi, 120 klaim video menembus grafik), (opsional) kutipan README proyek, daftar yang tidak ada, ajakan komentar. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon, Z = K.d13;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080;

  S.b7_1 = function (ctx, b, l, t) {
    const tKal = D.at(b, "di kalender");
    U.ruang(ctx, t, { col: N.gold });
    const p = U.pop(l, tKal - 0.4); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; I.kalender(ctx, 960, 520, 420, N.gold);
      const f = eio(ramp(l, tKal + 0.3, 0.6)); txt(ctx, f < 0.5 ? "25" : "26", 960, 610, 170, { align: "center", weight: 900, color: N.ink }); txt(ctx, "NOV", 960, 400, 54, { align: "center", weight: 900, color: "#120826" }); ctx.restore(); }
    X.judul(ctx, "Petunjuk terakhir ada di kalender", l, 0.2, N.gold);
  };
  // grafik batang FPS; skala 0..60 di dalam grafik, batang 120 menembus atas
  const GX = 300, GY = 680, GH = 380, SK = GH / 60;
  function grafik(ctx, l, bars) {
    ctx.save(); ctx.strokeStyle = D.hexA(N.ink2, 0.5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(GX, GY - GH - 10); ctx.lineTo(GX, GY); ctx.lineTo(1780, GY); ctx.stroke();
    [0, 30, 60].forEach(v => { const y = GY - v * SK; ctx.strokeStyle = D.hexA(N.ink2, 0.15); ctx.beginPath(); ctx.moveTo(GX, y); ctx.lineTo(1780, y); ctx.stroke(); txt(ctx, v + " FPS", GX - 20, y + 14, 40, { align: "right", weight: 800, color: N.ink2 }); });
    bars.forEach(br => { const a = ramp(l, br.t0, 0.3); if (a <= 0) return; const u = eio(ramp(l, br.t0, br.dur || 0.8)), x = br.x, w = 300, lo = br.lo * SK, hi = br.hi * SK * u;
      ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = D.hexA(br.col, br.ragu ? 0.35 : 0.85); ctx.shadowColor = br.col; ctx.shadowBlur = 18; const top = Math.max(GY - hi, 196);
      RR(ctx, x, top, w, GY - top, 12); ctx.fill(); ctx.shadowBlur = 0; if (br.ragu) { ctx.setLineDash([14, 10]); ctx.strokeStyle = br.col; ctx.lineWidth = 4; RR(ctx, x, top, w, GY - top, 12); ctx.stroke(); ctx.setLineDash([]); }
      U.neon(ctx, br.lab, x + w / 2, top - 24, 60, br.col, { align: "center", fit: 420 });
      X.para(ctx, br.sub, x + w / 2, GY + 52, 40, 440, { align: "center", color: N.ink2, weight: 800 }); ctx.restore(); });
    ctx.restore(); }
  const B1 = { x: 420, lo: 3, hi: 5, lab: "3-5", sub: "Pelacak proyek, 25 Nov", col: N.cyan }, B2 = { x: 900, lo: 25, hi: 30, lab: "25-30", sub: "Klaim lain, belum terverifikasi", col: N.gold, ragu: true },
    B3 = { x: 1380, lo: 120, hi: 120, lab: "120?", sub: "Video ini, 26 Nov", col: N.pink, dur: 1.4 };
  S.b7_2 = function (ctx, b, l, t) {
    const t35 = D.at(b, "3 sampai 5"), t2530 = D.at(b, "25 sampai 30"), tBel = D.at(b, "belum terverifikasi");
    U.ruang(ctx, t, { col: N.cyan });
    grafik(ctx, l, [{ ...B1, t0: t35 - 0.3 }, { ...B2, t0: t2530 - 0.3 }]);
    X.judul(ctx, "Sehari sebelumnya", l, 0.1, N.cyan);
    X.sumber(ctx, l, t35 + 0.5, "Notebookcheck dan XDA, 25-26 Nov 2026");
  };
  // (beat tambahan, bila disetujui) kutipan README proyek keluarga VIctory
  S.b7_2a = function (ctx, b, l, t) {
    const t30 = D.at(b, "30 FPS stabil"), tBer = D.at(b, "berkendara"), tRes = D.at(b, "dirender");
    U.ruang(ctx, t, { col: N.violet });
    const h = Z.kutipan(ctx, 140, 250, 1640, ["“Goal: a stable 30 frames a second …", " It is not there yet.”", "“driving … 50-90 ms a frame”", "“renders at 2560x1440 and upscales", " to 3840x2160”"],
      { size: 48, judul: "README proyek port victory-scarlett, 26 Nov 2026", col: N.violet, l, t0s: [t30 - 0.4, t30 + 0.6, tBer - 0.3, tRes - 0.3, tRes] });
    U.tag(ctx, "30 FPS pun belum", 420, 868, l, t30 + 1.2, { col: N.gold, size: 46 });
    U.tag(ctx, "berkendara ±11-20 FPS", 960, 868, l, tBer + 0.6, { col: N.pink, size: 46 });
    U.tag(ctx, "1440p diperbesar", 1500, 868, l, tRes + 0.8, { col: N.cyan, size: 46 });
  };
  S.b7_3 = function (ctx, b, l, t) {
    const t120 = D.at(b, "menjadi 120"), tKod = D.at(b, "tanpa kode"), tNam = D.at(b, "tanpa nama"), tAja = D.at(b, "ajakan");
    U.ruang(ctx, t, { col: N.pink });
    const sh = eio(ramp(l, tAja - 0.5, 0.6));
    if (sh < 1) { ctx.save(); ctx.globalAlpha *= 1 - sh; grafik(ctx, 99, [{ ...B1, t0: -9 }, { ...B2, t0: -9 }]); grafik(ctx, l, [{ ...B3, t0: t120 - 0.3 }]);
      X.daftar(ctx, b, l, 370, 330, 460, [{ t0: tKod - 0.1, s: "Kode?", tanda: "silang", col: N.red }, { t0: tNam - 0.1, s: "Nama proyek?", tanda: "silang", col: N.red }], { size: 44, rh: 96 }); ctx.restore(); }
    if (sh > 0) { ctx.save(); ctx.globalAlpha *= sh; Z.kutipan(ctx, 260, 340, 1400, ["“Drop your GPU below …", " could your rig survive", " GTA 6 at 4K 120 FPS?”"], { size: 54, judul: "Kalimat penutup postingan aslinya", col: N.pink });
      X.bawah(ctx, "Ajakan menulis kartu grafis di kolom komentar", l, tAja, N.pink, { y: 760 }); ctx.restore(); }
  };
  Z.reg(7, S);
})(typeof window !== "undefined" ? window : globalThis);
