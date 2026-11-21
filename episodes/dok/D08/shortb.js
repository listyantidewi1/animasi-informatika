/* D08 Short B — "Benarkah biaya membuat GTA 6 lebih mahal dari Burj Khalifa?" Adegan sendiri (tidak dipotong dari video),
   digambar di kanvas 1920×1080 dengan isi di kotak potong [360,120,1200,860] supaya terbaca di Short tegak. Hanya dimuat oleh dok/D08B. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, TAU = U.TAU, CX = 960;

  // gedung tertinggi: siluet menara bertingkat yang meruncing (digambar sendiri, tanpa logo)
  function menara(ctx, x, yBase, h, k, col) {
    const hh = h * eout(k); if (hh <= 2) return; ctx.save(); ctx.beginPath(); ctx.rect(x - h * 0.3, yBase - hh, h * 0.6, hh); ctx.clip();
    ctx.fillStyle = "#1A0E36"; ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.shadowColor = col; ctx.shadowBlur = 18;
    const tiers = [[0.16, 0.0], [0.13, 0.22], [0.1, 0.42], [0.075, 0.6], [0.05, 0.74], [0.03, 0.86]];
    ctx.beginPath(); tiers.forEach(([w, y0], i) => { const y1 = i + 1 < tiers.length ? tiers[i + 1][1] : 0.92; ctx.rect(x - w * h, yBase - y1 * h, w * h * 2, (y1 - y0) * h); }); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 0.012 * h, yBase - 0.92 * h); ctx.lineTo(x, yBase - h); ctx.lineTo(x + 0.012 * h, yBase - 0.92 * h); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.fillStyle = D.hexA(N.gold, 0.7); for (let i = 0; i < 40; i++) { const y = yBase - (0.03 + i * 0.022) * h; const w = (tiers.find(([, y0], j) => (tiers[j + 1] ? tiers[j + 1][1] : 0.92) * h > (yBase - y)) || tiers[5])[0] * h; if ((i * 7) % 3) ctx.fillRect(x - w * 0.6, y, w * 1.2, 3); }
    ctx.restore();
  }
  function uang(ctx, x, yBase, n, k, t) {   // tumpukan uang kertas
    for (let i = 0; i < n; i++) { const a = clamp(k * n - i); if (a <= 0) break; const y = yBase - i * 26 - (1 - eout(a)) * 120; ctx.save(); ctx.globalAlpha *= a;
      ctx.fillStyle = i % 2 ? "#2FBF7A" : "#3DDC8E"; ctx.strokeStyle = "#0E5A36"; ctx.lineWidth = 3; RR(ctx, x - 150 + (i % 3) * 6, y - 24, 300, 24, 5); ctx.fill(); ctx.stroke(); ctx.restore(); }
  }

  S.sb1 = function (ctx, b, l, t) {
    const tGed = D.at(b, "gedung tertinggi"), tBen = D.at(b, "Benarkah");
    U.senja(ctx, t, { sunX: 960, dim: 0.25, palms: false });
    menara(ctx, 700, 870, 700, ramp(l, Math.max(0.2, tGed - 0.6), 1.2), N.cyan);
    uang(ctx, 1230, 860, 20, ramp(l, 0.3, 2.0), t); U.neon(ctx, "$", 1230, 400, 150, N.green, { align: "center", a: ramp(l, 1.0, 0.4) });
    txt(ctx, "membuat GTA 6", 1230, 935, 52, { align: "center", weight: 900 }); txt(ctx, "gedung tertinggi", 700, 935, 52, { align: "center", weight: 900 });
    U.neonPop(ctx, "LEBIH MAHAL?", CX, 230, 110, N.gold, l, tBen - 0.2, { align: "center" });
  };

  // batang biaya: nilai dalam miliar dolar; rentang = [lo, hi] digambar padat sampai lo lalu putus-putus sampai hi
  function batang(ctx, x, yBase, w, skala, lo, hi, col, k, lab, nilai, perkiraan) {
    const hLo = lo * skala * eout(k), hHi = hi * skala * eout(k);
    ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 22; ctx.fillStyle = D.hexA(col, 0.85); RR(ctx, x, yBase - hLo, w, hLo, 12); ctx.fill(); ctx.shadowBlur = 0;
    if (hi > lo) { ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.setLineDash([16, 10]); RR(ctx, x, yBase - hHi, w, hHi - hLo, 12); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = D.hexA(col, 0.18); RR(ctx, x, yBase - hHi, w, hHi - hLo, 12); ctx.fill(); }
    ctx.restore();
    txt(ctx, lab, x + w / 2, yBase + 64, 52, { align: "center", weight: 900 });
    if (k > 0.5) { ctx.save(); ctx.globalAlpha *= clamp((k - 0.5) * 2); txt(ctx, nilai, x + w / 2, yBase - hHi - 30, 58, { align: "center", weight: 900, color: col }); if (perkiraan) txt(ctx, "perkiraan", x + w / 2, yBase - hHi - 96, 44, { align: "center", weight: 800, color: N.ink2 }); ctx.restore(); }
  }
  S.sb2 = function (ctx, b, l, t) {
    const tBur = D.at(b, "Burj Khalifa"), tGta = D.at(b, "Biaya GTA 6"), tMed = D.at(b, "media memperkirakannya"), tSam = D.at(b, "kurang lebih sama");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 400 });
    const sk = 300;
    batang(ctx, 560, 870, 260, sk, 1.5, 1.5, N.cyan, ramp(l, tBur - 0.2, 1.0), "Burj Khalifa", "$1,5 M", false);
    batang(ctx, 1100, 870, 260, sk, 1.0, 1.5, N.pink, ramp(l, tMed - 0.2, 1.2), "GTA 6", "$1–1,5 M", true);
    const ta = ramp(l, tGta, 0.4) * (1 - ramp(l, tMed - 0.3, 0.3)); if (ta > 0) { ctx.save(); ctx.globalAlpha *= ta; U.tanya(ctx, 1230, 640, 220, N.pink, 1); txt(ctx, "tidak diumumkan", 1230, 820, 46, { align: "center", weight: 900, color: N.ink2 }); ctx.restore(); }
    txt(ctx, "M = miliar dolar AS", CX, 172, 44, { align: "center", weight: 800, color: N.ink2 });
    const sa = U.pop(l, tSam - 0.2); if (sa.a > 0) { ctx.save(); ctx.globalAlpha *= sa.a; ctx.translate(CX, 252); const s = lerp(0.6, 1, sa.sp); ctx.scale(s, s); U.neon(ctx, "KURANG LEBIH SAMA", 0, 0, 84, N.gold, { align: "center" }); ctx.restore(); }
  };

  S.sb3 = function (ctx, b, l, t) {
    const tOr = D.at(b, "membayar orang"), R = ["programmer", "seniman", "animator", "penguji", "pengisi suara"], T = R.map(s => D.at(b, s)), tSep = D.at(b, "lebih dari sepuluh tahun");
    U.ruang(ctx, t, { col: N.violet, gx: 960, gy: 400 });
    // kerumunan yang berlipat ganda
    const c0 = Math.min(tOr - 0.3, 2.0), n = l < c0 ? 0 : Math.floor(lerp(1, 40, eio(ramp(l, c0, Math.max(1.5, tSep - c0))))); for (let i = 0; i < n; i++) { const c = i % 10, r = Math.floor(i / 10);
      K.kit.orang.kepala(ctx, 480 + c * 106, 380 + r * 100, 34, { skin: i % 6, hair: ["pendek", "hijab", "kuncir", "pendek", "panjang", "hood"][i % 6], face: "senang", t: t + i, bahu: 0.9 }); }
    R.forEach((s, i) => { const p = U.pop(l, T[i] - 0.1); if (p.a <= 0) return; ctx.save(); ctx.globalAlpha *= p.a; ctx.translate(560 + (i % 3) * 400, 820 + Math.floor(i / 3) * 90); const k = lerp(0.7, 1, p.sp); ctx.scale(k, k);
      D.label(ctx, s, 0, 0, { size: 46, col: [N.cyan, N.pink, N.gold, N.green, N.violet][i], fill: "rgba(14,6,34,0.92)" }); ctx.restore(); });
    const ta = U.pop(l, tSep - 0.2); if (ta.a > 0) { ctx.save(); ctx.globalAlpha *= ta.a; U.neon(ctx, "10+ TAHUN", CX, 270, 96, N.gold, { align: "center" }); ctx.restore(); }
    else txt(ctx, "Ke mana uangnya?", CX, 260, 70, { align: "center", weight: 900, color: N.ink });
  };

  S.sb4 = function (ctx, b, l, t) {
    const tKej = D.at(b, "kejutannya"), tHar = D.at(b, "satu hari pertama"), tDua = D.at(b, "dua koma empat"), tSeh = D.at(b, "hanya dalam sehari");
    U.ruang(ctx, t, { col: N.green, gx: 960, gy: 400 });
    const sk = 125;
    batang(ctx, 560, 870, 260, sk, 1.0, 1.5, N.pink, 1, "biaya", "$1–1,5 M", false);
    batang(ctx, 1100, 870, 260, sk, 2.4, 3.8, N.green, ramp(l, tDua - 0.3, 1.4), "hari pertama", "$2,4–3,8 M", true);
    // penghitung uang
    const u = ramp(l, tHar - 0.2, Math.max(0.8, tDua - tHar + 0.6)); if (u > 0 && l < tDua + 1) { const v = (eio(u) * 3.8).toFixed(1).replace(".", ","); U.neon(ctx, "$" + v + " M", CX, 260, 96, N.green, { align: "center" }); }
    const sa = U.pop(l, tSeh - 0.2); if (sa.a > 0) { ctx.save(); ctx.globalAlpha *= sa.a; ctx.translate(CX, 250); const s = lerp(0.6, 1, sa.sp); ctx.scale(s, s); U.neon(ctx, "BALIK MODAL SEHARI", 0, 0, 84, N.gold, { align: "center" }); ctx.restore(); }
    else if (l < tHar - 0.2) U.neonPop(ctx, "TAPI...", CX, 260, 96, N.gold, l, tKej - 0.2, { align: "center" });
  };

  S.sb5 = function (ctx, b, l, t) {
    const tHat = D.at(b, "hati-hati"), tUmp = D.at(b, "umpan favorit");
    U.ruang(ctx, t, { col: N.red, gx: 960, gy: 450 });
    const r = U.laptop(ctx, CX, 860, 820); ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip(); ctx.fillStyle = "#2A0F45"; ctx.fillRect(r.x, r.y, r.w, r.h);
    U.neon(ctx, "GTA 6 PC FULL", CX, r.y + 110, 64, N.gold, { align: "center" }); U.tombol(ctx, "DOWNLOAD", CX, r.y + 250, 420, 110, N.red, { pulse: true, t, size: 54 }); ctx.restore();
    U.bahaya(ctx, CX + 330, r.y + 40, 120 * (1 + 0.05 * Math.sin(t * 6)), N.red, ramp(l, tHat - 0.2, 0.3));
    const ua = U.pop(l, tUmp - 0.2); if (ua.a > 0) { ctx.save(); ctx.globalAlpha *= ua.a; ctx.translate(CX, 230); const s = lerp(0.7, 1, ua.sp); ctx.scale(s, s); U.neon(ctx, "UMPAN PENIPU", 0, 0, 96, N.red, { align: "center" }); ctx.restore(); }
  };

  K.SCENES.d08_sb = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else U.ruang(ctx, t); };
})(typeof window !== "undefined" ? window : globalThis);
