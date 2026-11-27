/* D13 bab 8 — Jawaban: lima kartu petunjuk, klip asli redup dengan stempel di atas lapisan angka, timbangan bukti. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, Z = K.d13;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080;

  S.b8_1 = function (ctx, b, l, t) {
    U.ruang(ctx, t, { col: N.green });
    const it = [["tidak bisa menampilkan", "Video", "60 FPS"], ["catatan Git", "Baris Git", "di log"], ["barisnya berulang", "Log", "berulang"], ["tidak akur", "Angka", "tidak akur"], ["terlalu jauh", "Lompatan", "terlalu jauh"]];
    const rs = X.cols(5, { x0: 110, x1: 1810, y: 300, h: 440, gap: 26 });
    it.forEach(([ph, j, s], i) => { const p = U.pop(l, D.at(b, ph, -0.3)); Z.kartuPetunjuk(ctx, rs[i], i + 1, j, s, { a: p.a, sp: p.sp, js: 46, ss: 42 }); });
    X.judul(ctx, "Kelima petunjuk", l, 0.1, N.green);
  };
  S.b8_2 = function (ctx, b, l, t) {
    const tTid = D.at(b, "tidak bisa dipercaya"), tRek = D.at(b, "Rekaman perjalanannya"), tLap = D.at(b, "lapisan angka");
    Z.latar(ctx, l + 3, { dim: 0.55 });
    // kotak lapisan angka (kiri atas, koordinat layar penuh) ditandai
    const k = ramp(l, tTid - 0.2, 0.4); if (k > 0) { ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = N.red; ctx.lineWidth = 6; ctx.shadowColor = N.red; ctx.shadowBlur = 20; RR(ctx, 24, 24, 880, 530, 18); ctx.stroke(); ctx.restore(); }
    X.stempel(ctx, "ANGKANYA TIDAK TERBUKTI", 500, 300, l, tTid, N.red, { size: 56, fit: 700 });
    U.tag(ctx, "Rekaman: mungkin dari konsol", 1340, 680, l, tRek - 0.2, { col: N.cyan, size: 48 });
    U.tag(ctx, "Lapisan angka: tidak membuktikan apa pun", 960, 800, l, tLap - 0.2, { col: N.red, size: 48 });
    Z.labelAsli(ctx, "Klip asli, diredupkan", 1 - ramp(l, tRek - 0.4, 0.3));
  };
  S.b8_3 = function (ctx, b, l, t) {
    const tTud = D.at(b, "menuduh"), tBuk = D.at(b, "buktinya tidak cukup");
    U.ruang(ctx, t, { col: N.gold });
    // timbangan: piring kiri "klaim" berat ke bawah, piring kanan "bukti" ringan
    const mir = 0.18 * eio(ramp(l, tBuk - 0.6, 1.2)), cx = 960, cy = 420;
    ctx.save(); ctx.strokeStyle = N.gold; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.shadowColor = N.gold; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, 760); ctx.moveTo(cx - 160, 760); ctx.lineTo(cx + 160, 760); ctx.stroke();
    ctx.translate(cx, cy); ctx.rotate(-mir); ctx.beginPath(); ctx.moveTo(-460, 0); ctx.lineTo(460, 0); ctx.stroke(); ctx.restore();
    [[-1, "Klaim", N.pink], [1, "Bukti", N.cyan]].forEach(([s, lab, col]) => { const x = cx + s * 460 * Math.cos(mir), y = cy - s * 460 * Math.sin(mir) + 150;
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y - 150); ctx.lineTo(x - 120, y); ctx.moveTo(x, y - 150); ctx.lineTo(x + 120, y); ctx.stroke();
      ctx.fillStyle = "rgba(16,8,38,0.92)"; RR(ctx, x - 170, y, 340, 90, 30); ctx.fill(); ctx.strokeStyle = col; ctx.stroke(); txt(ctx, lab, x, y + 62, 50, { align: "center", weight: 900, color: col }); ctx.restore(); });
    X.judul(ctx, "Bukan tuduhan", l, tTud - 0.2, N.gold);
    X.bawah(ctx, "Buktinya tidak cukup", l, tBuk - 0.2, N.cyan);
  };
  Z.reg(8, S);
})(typeof window !== "undefined" ? window : globalThis);
