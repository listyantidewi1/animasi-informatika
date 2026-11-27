/* D13 bab 2 — Level 2: apa itu FPS. Buku gambar yang dibalik, pita satu detik (30 dan 120 kotak), frame time,
   soal "pikirkan dulu" 60 FPS, lalu tabel kecil 30/60/120. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, Z = K.d13;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = Math.PI * 2;
  // posisi bola memantul pada gambar ke-i (12 gambar satu pantulan)
  const bolaY = i => { const u = (i % 12) / 12; return 640 - 300 * Math.sin(u * Math.PI); };
  function buku(ctx, x, y, w, h, i, t) {
    ctx.save(); for (let k = 3; k >= 1; k--) { ctx.fillStyle = `rgba(240,232,255,${0.18 + 0.06 * k})`; RR(ctx, x + k * 10, y + k * 10, w, h, 16); ctx.fill(); }
    ctx.fillStyle = "#F4EEFF"; RR(ctx, x, y, w, h, 16); ctx.fill(); ctx.strokeStyle = N.violet; ctx.lineWidth = 4; ctx.stroke();
    ctx.strokeStyle = "rgba(60,30,90,0.35)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 30, y + h - 60); ctx.lineTo(x + w - 30, y + h - 60); ctx.stroke();
    const by = y + (bolaY(i) - 340) * (h - 120) / 300 + 40; Z.bola(ctx, x + 60 + ((i % 24) / 24) * (w - 120), Math.min(by, y + h - 90), 34, N.pink);
    // halaman yang sedang terbalik
    const f = (t * 8) % 1; ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - f)})`; ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w - w * f, y + 20 * Math.sin(f * Math.PI)); ctx.lineTo(x + w - w * f, y + h); ctx.lineTo(x + w, y + h); ctx.fill();
    ctx.restore(); }

  S.b2_1 = function (ctx, b, l, t) {
    const tHal = D.at(b, "Setiap halaman"), tFr = D.at(b, "disebut frame");
    U.ruang(ctx, t, { col: N.violet });
    buku(ctx, 200, 280, 620, 480, Math.floor(l * 8), t);
    for (let k = 0; k < 6; k++) { const p = U.pop(l, tHal + k * 0.2); if (p.a <= 0) continue; const x = 940 + (k % 3) * 300, y = 280 + Math.floor(k / 3) * 270;
      ctx.save(); ctx.globalAlpha *= p.a; ctx.fillStyle = "#F4EEFF"; RR(ctx, x, y, 260, 190, 12); ctx.fill(); ctx.strokeStyle = N.cyan; ctx.lineWidth = 4; ctx.stroke();
      Z.bola(ctx, x + 40 + k * 34, y + 30 + (bolaY(k * 2) - 340) * 0.42, 20, N.pink); txt(ctx, "frame " + (k + 1), x + 130, y + 245, 42, { align: "center", weight: 800, color: N.cyan }); ctx.restore(); }
    X.judul(ctx, "Satu halaman = satu frame", l, tFr - 0.2, N.cyan);
  };
  S.b2_2 = function (ctx, b, l, t) {
    const tFPS = D.at(b, "frames per second"), tDet = D.at(b, "satu detik"), tKon = D.at(b, "Di konsol");
    U.ruang(ctx, t, { col: N.cyan });
    U.neonPop(ctx, "FPS", 960, 380, 150, N.gold, l, 0.1, { align: "center" });
    if (l > tFPS - 0.2) { const p = U.pop(l, tFPS - 0.2); ctx.save(); ctx.globalAlpha *= p.a; txt(ctx, "Frames Per Second", 960, 480, 64, { align: "center", weight: 900, color: N.ink }); ctx.restore(); }
    X.bawah(ctx, "jumlah gambar dalam satu detik", l, tDet - 0.2, N.cyan, { y: 560 });
    if (l > tKon - 0.2) { const u = ((l - tKon) % 1.4) / 1; ctx.save(); ctx.globalAlpha *= ramp(l, tKon - 0.2, 0.4);
      txt(ctx, "Konsol: 30 FPS", 160, 690, 52, { weight: 900, color: N.green }); Z.pita(ctx, 160, 720, 1600, 70, 30, Math.floor(clamp(u) * 30), { col: N.green });
      txt(ctx, "1 detik", 1760, 840, 42, { align: "right", weight: 800, color: N.ink2 }); ctx.restore(); }
  };
  S.b2_3 = function (ctx, b, l, t) {
    const t120 = D.at(b, "berjalan 120"), tSer = D.at(b, "seribu dibagi"), t83 = D.at(b, "sekitar 8,3"), tFT = D.at(b, "frame time");
    U.ruang(ctx, t, { col: N.pink });
    const u = ((Math.max(0, l - t120)) % 1.4) / 1;
    ctx.save(); ctx.globalAlpha *= ramp(l, t120 - 0.3, 0.4); txt(ctx, "120 FPS", 160, 330, 56, { weight: 900, color: N.pink }); Z.pita(ctx, 160, 360, 1600, 70, 120, Math.floor(clamp(u) * 120), { col: N.pink }); ctx.restore();
    if (l > tSer - 0.3) { const p = U.pop(l, tSer - 0.3); ctx.save(); ctx.globalAlpha *= p.a; ctx.translate(960, 600); ctx.scale(lerp(0.9, 1, p.sp), lerp(0.9, 1, p.sp));
      txt(ctx, "1.000 milidetik ÷ 120", 0, 0, 84, { align: "center", weight: 900, color: N.ink }); ctx.restore(); }
    U.neonPop(ctx, "≈ 8,3 ms", 960, 740, 110, N.gold, l, t83, { align: "center" });
    X.bawah(ctx, "waktu untuk setiap gambar = frame time", l, tFT - 0.2, N.gold);
  };
  S.b2_4 = function (ctx, b, l, t) {
    const t60 = D.at(b, "Kalau 60"), tEnd = D.speechEnd(b);
    U.ruang(ctx, t, { col: N.gold });
    X.judul(ctx, "Pikirkan dulu", l, 0.1, N.gold);
    if (l > t60 - 0.2) { const p = U.pop(l, t60 - 0.2); ctx.save(); ctx.globalAlpha *= p.a; txt(ctx, "1.000 ms ÷ 60 = ?", 960, 520, 120, { align: "center", weight: 900, color: N.ink }); ctx.restore(); }
    const u = clamp((l - tEnd) / Math.max(1, b.dur - tEnd - 0.3)); if (l > tEnd) { ctx.save(); ctx.globalAlpha *= ramp(l, tEnd, 0.3); ctx.strokeStyle = D.hexA(N.gold, 0.25); ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(960, 720, 70, 0, TAU); ctx.stroke();
      ctx.strokeStyle = N.gold; ctx.shadowColor = N.gold; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(960, 720, 70, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - u)); ctx.stroke(); ctx.restore(); }
  };
  S.b2_5 = function (ctx, b, l, t) {
    const tLeng = D.at(b, "alat kita");
    U.ruang(ctx, t, { col: N.green });
    U.neonPop(ctx, "≈ 16,7 ms", 960, 380, 120, N.green, l, 0.15, { align: "center" });
    X.daftar(ctx, b, l, 560, 470, 800, [{ t0: 1.2, s: "30 FPS → 33,3 ms per gambar", col: N.cyan, tanda: "titik" }, { t0: 1.5, s: "60 FPS → 16,7 ms per gambar", col: N.green, tanda: "titik" },
      { t0: 1.8, s: "120 FPS → 8,3 ms per gambar", col: N.pink, tanda: "titik" }], { size: 46, rh: 100 });
    X.bawah(ctx, "Alat detektif siap dipakai", l, tLeng, N.green);
  };
  Z.reg(2, S);
})(typeof window !== "undefined" ? window : globalThis);
