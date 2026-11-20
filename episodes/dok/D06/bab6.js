/* D06 bab 6 — Bagaimana dengan Indonesia? (b6_1 … b6_4).
   Sumber: WEF Future of Jobs Report 2025, profil ekonomi Indonesia (83% perusahaan memperkirakan digitalisasi mengubah organisasinya, rata-rata global 60%). */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d06, P = D.P;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, TAU = U.TAU;

  function bendera(ctx, x, y, w, t) { ctx.fillStyle = "#C9B27A"; RR(ctx, x - 8, y - 20, 12, w * 1.5, 6); ctx.fill();
    for (let i = 0; i < 24; i++) { const u = i / 24, dy = Math.sin(t * 3 + u * 5) * 10 * u, xx = x + 4 + u * w, ww = w / 24 + 1, h = w * 0.33; ctx.fillStyle = "#E5484D"; ctx.fillRect(xx, y + dy, ww, h); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(xx, y + dy + h, ww, h); } }
  S.b6_1 = function (ctx, b, l, t) {
    const tA = D.at(b, "Amerika Serikat"), tG = D.at(b, "survei global"), tI = D.at(b, "Bagaimana dengan Indonesia");
    U.latar(ctx, t, { col: P.red, gx: 1300, gy: 400, ga: 0.2 });
    const fo = 1 - 0.6 * ramp(l, tI - 0.2, 0.5);
    const a = eout(ramp(l, tI - 0.3, 0.6)); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - a) * 40); bendera(ctx, 830, 300, 250, t); ctx.restore(); U.bip(ctx, 1400, 500, 160, t, { pose: "tunjuk", target: [960, 400], mood: "think" }); }
    D.post(c => { U.tagPop(c, "data dari Amerika Serikat", 430, 250, l, tA, { col: P.blue, size: 48, a: fo }); U.tagPop(c, "survei global", 1500, 250, l, tG, { col: P.violet, size: 48, a: fo });
      U.judulPop(c, "Bagaimana dengan Indonesia?", 960, 740, 88, l, tI, { col: P.amber }); });
  };

  S.b6_2 = function (ctx, b, l, t) {
    const tD = D.at(b, "digitalisasi"), t83 = D.at(b, "delapan puluh tiga persen"), t60 = D.at(b, "enam puluh persen");
    U.latar(ctx, t, { col: P.amber, gx: 700, gy: 400, ga: 0.2 });
    U.panel(ctx, 380, 210, 1160, 580);
    ctx.strokeStyle = "rgba(242,246,255,0.5)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(460, 700); ctx.lineTo(1460, 700); ctx.stroke();
    [[620, 83, t83, P.amber, "Indonesia"], [1080, 60, t60, P.blue, "rata-rata global"]].forEach(([x, v, t0, col, s]) => { const k = ramp(l, t0 - 0.1, 1.2); ctx.save(); ctx.globalAlpha *= 0.35 + 0.65 * ramp(l, t0 - 0.3, 0.3); txt(ctx, s, x + 110, 760, 46, { align: "center", weight: 800 }); ctx.restore();
      if (k <= 0) return; U.batang(ctx, x, 700, 220, v * 4.4, col, k); U.angka(ctx, Math.round(v * eout(k)) + "%", x + 110, 700 - v * 4.4 * eout(k) - 22, 84, col, 1); });
    U.bip(ctx, 1700, 640, 150, t, { pose: l > t83 && l < t60 ? "kaget" : "diam", mood: "wow" });
    D.post(c => { U.judulPop(c, "\"Digitalisasi akan mengubah organisasi kami\" (sampai 2030)", 960, 130, 54, l, tD - 0.6, { col: P.amber }); U.sumber(c, l, 0.5, "WEF Future of Jobs Report 2025, survei perusahaan"); });
  };

  const ROW = [["Asia Tenggara: lebih banyak rencana melatih ulang karyawan", P.teal, "melatih ulang"], ["Hambatan utama: menemukan pekerja yang terampil", P.red, "hambatan utama"], ["Kebutuhan orang yang paham teknologi di Indonesia: naik", P.amber, "kebutuhan akan orang"]];
  S.b6_3 = function (ctx, b, l, t) {
    U.latar(ctx, t, { col: P.teal, gx: 500, gy: 400 });
    ROW.forEach(([s, col, key], i) => { const t0 = D.at(b, key), k = eout(ramp(l, t0 - 0.3, 0.6)); if (k <= 0) return; const y = 250 + i * 176; ctx.save(); ctx.globalAlpha *= k; ctx.translate((1 - k) * -80, 0);
      U.panel(ctx, 160, y, 1600, 148, { stroke: D.hexA(col, 0.9), lw: i === 2 ? 6 : 4 }); ctx.fillStyle = col; RR(ctx, 160, y, 16, 148, 8); ctx.fill(); txt(ctx, s, 220, y + 92, 50, { weight: 900, color: i === 2 ? col : P.ink, fit: 1400 });
      if (i === 2) U.panah(ctx, 1660, y + 120, 1700, y + 30, col, ramp(l, D.at(b, "sedang naik"), 0.6), 9); ctx.restore(); });
    D.post(c => { U.judulPop(c, "Asia Tenggara dan Indonesia", 960, 140, 64, l, 0.3, { col: P.teal }); U.sumber(c, l, 0.5, "WEF Future of Jobs Report 2025"); });
  };

  S.b6_4 = function (ctx, b, l, t) {
    const tJ = D.at(b, "harus jujur"), tB = D.at(b, "belum kami temukan"), tT = D.at(b, "belum tahu pasti"), tS = D.at(b, "bersiap");
    U.latar(ctx, t, { col: P.violet, gx: 500, gy: 500 });
    U.panel(ctx, 150, 250, 820, 530); txt(ctx, "Software engineer muda di Indonesia", 560, 320, 40, { align: "center", weight: 800, color: P.ink2 });
    U.sumbu(ctx, 230, 360, 660, 340, [[0, ""], [0.5, ""], [1, ""]]); ctx.save(); ctx.strokeStyle = "rgba(242,246,255,0.35)"; ctx.lineWidth = 8; ctx.setLineDash([18, 16]); ctx.beginPath(); ctx.moveTo(250, 540); ctx.lineTo(870, 540); ctx.stroke(); ctx.restore();
    U.angka(ctx, "?", 560, 600, 220 + 10 * Math.sin(t * 2), P.amber, ramp(l, 0.4, 0.4));
    const a1 = eout(ramp(l, tT - 0.3, 0.5)), a2 = eout(ramp(l, tS - 1.6, 0.5));
    [[a1, 270, "Pintu masuk di Indonesia:", "belum tahu pasti", P.amber], [a2, 540, "Tanda dari negara lain:", "cukup untuk bersiap", P.green]].forEach(([a, y, s1, s2, col]) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate((1 - a) * 60, 0); U.panel(ctx, 1040, y, 740, 230, { stroke: D.hexA(col, 0.9), lw: 5 }); txt(ctx, s1, 1410, y + 90, 46, { align: "center", weight: 800 }); txt(ctx, s2, 1410, y + 170, 60, { align: "center", weight: 900, color: col }); ctx.restore(); });
    D.post(c => { U.judulPop(c, "Kami juga harus jujur", 960, 140, 66, l, tJ - 0.5, { col: P.violet }); U.tagPop(c, "data rinci belum kami temukan", 560, 740, l, tB, { col: P.red, size: 44 }); });
  };

  U.reg(6, S);
})(typeof window !== "undefined" ? window : globalThis);
