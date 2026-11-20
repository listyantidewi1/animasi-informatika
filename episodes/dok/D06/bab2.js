/* D06 bab 2 — Ramalan besar: hilang atau bertambah? (b2_1 … b2_8). Angka: WEF Future of Jobs Report 2025; ILO Working Paper 140 (2025). */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d06, P = D.P;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {};

  function gedung(ctx, x, y, s, col) { ctx.fillStyle = col; RR(ctx, x - s * 0.3, y - s, s * 0.6, s, 8); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.75)"; for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) ctx.fillRect(x - s * 0.18 + c * s * 0.22, y - s * 0.86 + r * s * 0.2, s * 0.12, s * 0.1); }
  function statKartu(ctx, x, y, w, big, small, col, p) { if (p.a <= 0) return; ctx.save(); ctx.globalAlpha *= p.a; ctx.translate(x + w / 2, y); const k = lerp(0.85, 1, p.sp); ctx.scale(k, k); U.panel(ctx, -w / 2, 0, w, 330, { stroke: D.hexA(col, 0.8) });
    U.angka(ctx, big, 0, 170, 110, col, 1); txt(ctx, small, 0, 262, 46, { align: "center", weight: 800, color: P.ink, fit: w - 50 }); ctx.restore(); }
  S.b2_1 = function (ctx, b, l, t) {
    const tW = D.at(b, "World Economic Forum"), tL = D.at(b, "Future of Jobs"), t1 = D.at(b, "seribu perusahaan"), t14 = D.at(b, "empat belas juta"), t55 = D.at(b, "lima puluh lima");
    U.latar(ctx, t, { col: P.green, gx: 400, gy: 300 });
    for (let i = 0; i < 9; i++) { const a = ramp(l, tW + i * 0.1, 0.4); if (a > 0) { ctx.save(); ctx.globalAlpha *= a * 0.5; gedung(ctx, 200 + i * 190, 760 + (i % 2) * 14, 110 + (i * 37 % 60), [P.blue, P.teal, P.violet][i % 3]); ctx.restore(); } }
    statKartu(ctx, 150, 290, 500, "1.000+", "perusahaan", P.green, U.pop(l, t1 - 0.2));
    statKartu(ctx, 710, 290, 500, "14 juta+", "pekerja", P.blue, U.pop(l, t14 - 0.2));
    statKartu(ctx, 1270, 290, 500, "55", "negara", P.amber, U.pop(l, t55 - 0.2));
    D.post(c => { U.judulPop(c, "Future of Jobs Report 2025", 960, 160, 72, l, tL - 0.3, { col: P.green }); U.sumber(c, l, tW, "World Economic Forum, Future of Jobs Report 2025"); });
  };

  S.b2_2 = function (ctx, b, l, t) {
    const t170 = D.at(b, "seratus tujuh puluh juta"), t92 = D.at(b, "sembilan puluh dua juta"), t78 = D.at(b, "tujuh puluh delapan juta");
    U.latar(ctx, t, { col: P.blue, gx: 500, gy: 300 });
    U.panel(ctx, 150, 230, 1000, 560); const y0 = 570, sc = 1.3;   // 1 juta = 1,6 px
    ctx.strokeStyle = "rgba(242,246,255,0.5)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(210, y0); ctx.lineTo(1090, y0); ctx.stroke();
    const k1 = (l - t170 + 0.3) / 1.2, k2 = (l - t92 + 0.3) / 1.2;
    U.batang(ctx, 300, y0, 240, 170 * sc, P.blue, k1); U.batang(ctx, 700, y0, 240, -92 * sc, P.violet, k2);
    if (k1 > 0) txt(ctx, "pekerjaan baru", 420, y0 + 56, 44, { align: "center", weight: 800, color: P.blue });
    if (k2 > 0) txt(ctx, "tergeser", 820, y0 - 30, 44, { align: "center", weight: 800, color: P.violet });
    const p = U.pop(l, t78 - 0.2);
    if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; ctx.translate(1500, 500); const k = lerp(0.8, 1, p.sp); ctx.scale(k, k); U.panel(ctx, -290, -210, 580, 420, { stroke: D.hexA(P.green, 0.9), lw: 5 });
      txt(ctx, "bersih", 0, -120, 50, { align: "center", weight: 800, color: P.ink2 }); U.angka(ctx, "+" + Math.round(U.hitung(l, t78, 0, 78)) + " juta", 0, 20, 120, P.green); txt(ctx, "pekerjaan (7%)", 0, 120, 50, { align: "center", weight: 800 }); ctx.restore(); }
    D.post(c => {
      U.judulPop(c, "Perkiraan 2025–2030", 650, 130, 64, l, 0.3, { col: P.blue });
      U.tagPop(c, "+" + Math.round(U.hitung(l, t170, 0, 170)) + " juta", 420, y0 - 170 * sc - 56, l, t170 + 0.3, { col: P.blue, size: 60 });
      U.tagPop(c, "−" + Math.round(U.hitung(l, t92, 0, 92)) + " juta", 820, y0 + 92 * sc + 60, l, t92 + 0.3, { col: P.violet, size: 60 });
      U.sumber(c, l, t170, "WEF Future of Jobs Report 2025 (perkiraan survei)");
    });
  };

  S.b2_3 = function (ctx, b, l, t) {
    const tA = D.at(b, "administrasi"), ts = [D.at(b, "petugas entri data"), D.at(b, "kasir bank"), D.at(b, "petugas pos")];
    U.latar(ctx, t, { col: P.violet, gx: 1400, gy: 600 });
    ["Petugas entri data", "Kasir bank", "Petugas pos"].forEach((s, i) => { const p = U.pop(l, ts[i] - 0.2); if (p.a <= 0) return; const x = 170 + i * 540, w = 500; ctx.save(); ctx.globalAlpha *= p.a; ctx.translate(x + w / 2, 300); const k = lerp(0.85, 1, p.sp); ctx.scale(k, k);
      U.panel(ctx, -w / 2, 0, w, 400, { stroke: D.hexA(P.violet, 0.8) });
      // ikon sederhana
      ctx.translate(0, 150);
      if (i === 0) { ctx.fillStyle = "#DDE6FF"; RR(ctx, -110, -80, 220, 140, 12); ctx.fill(); ctx.fillStyle = "#3A4680"; for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) ctx.fillRect(-92 + q * 48, -64 + r * 30, 40, 20); }
      if (i === 1) { ctx.fillStyle = "#DDE6FF"; ctx.beginPath(); ctx.moveTo(-120, -30); ctx.lineTo(0, -100); ctx.lineTo(120, -30); ctx.closePath(); ctx.fill(); for (let q = 0; q < 4; q++) ctx.fillRect(-100 + q * 60, -20, 24, 80); ctx.fillRect(-124, 62, 248, 20); }
      if (i === 2) { ctx.fillStyle = "#DDE6FF"; RR(ctx, -120, -70, 240, 150, 12); ctx.fill(); ctx.strokeStyle = "#3A4680"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-120, -66); ctx.lineTo(0, 20); ctx.lineTo(120, -66); ctx.stroke(); }
      ctx.translate(0, -150); txt(ctx, s, 0, 330, 50, { align: "center", weight: 900, fit: w - 40 }); ctx.restore();
      U.panah(ctx, x + w - 120, 330, x + w - 60, 400, P.red, (l - ts[i]) / 0.5, 8); });
    D.post(c => { U.judulPop(c, "Paling banyak tergeser: pekerjaan administrasi", 960, 160, 62, l, tA - 0.6, { col: P.violet }); U.sumber(c, l, tA, "WEF Future of Jobs Report 2025"); });
  };

  S.b2_4 = function (ctx, b, l, t) {
    const tT = D.at(b, "tumbuh paling cepat"), tDev = D.at(b, "lalu software developer"), tJ = D.at(b, "paling banyak menambah");
    U.latar(ctx, t, { col: P.green, gx: 400, gy: 300 });
    U.daftarTumbuh(ctx, l, tT - 0.3, tDev + 0.4, { y: 230 });
    D.post(c => {
      U.judulPop(c, "Tumbuh paling cepat: pekerjaan teknologi", 960, 120, 60, l, tT - 0.5, { col: P.green });
      U.tagPop(c, "juga penambah lapangan kerja terbesar (jumlah)", 1010, 742, l, tJ, { col: P.amber, size: 46 });
      U.sumber(c, l, tT, "WEF Future of Jobs Report 2025, gambar 2.2");
    });
  };

  S.b2_5 = function (ctx, b, l, t) {
    const tI = D.at(b, "ILO"), tN = D.at(b, "tiga puluh ribu"), tS = D.at(b, "satu per satu");
    U.latar(ctx, t, { col: P.blue, gx: 960, gy: 500 });
    const cols = 30, rows = 9, sz = 38, x0 = 960 - cols * (sz + 8) / 2, y0 = 300; const k = clamp((l - tN + 0.5) / 1.5), sc = clamp((l - tS) / (b.dur - tS - 0.5));
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) { const i = r * cols + q, a = clamp(k * 3 - (q + r) / (cols + rows) * 2); if (a <= 0) continue; const done = i < sc * cols * rows;
      ctx.fillStyle = D.hexA(done ? P.teal : P.ink2, (done ? 0.85 : 0.3) * a); RR(ctx, x0 + q * (sz + 8), y0 + r * (sz + 8), sz, sz, 8); ctx.fill(); }
    const sx = x0 + ((sc * cols * rows) % cols) * (sz + 8), sy = y0 + Math.min(rows - 1, Math.floor(sc * rows)) * (sz + 8); if (sc > 0 && sc < 1) U.sorot(ctx, sx - 6, sy - 6, sz + 12, sz + 12, 1, P.amber);
    D.post(c => { U.judulPop(c, "ILO: Organisasi Buruh Internasional", 960, 160, 64, l, tI - 0.8, { col: P.blue }); U.tagPop(c, "hampir 30.000 tugas pekerjaan dinilai", 960, 770, l, tN, { col: P.teal, size: 52 }); U.sumber(c, l, tI, "ILO Working Paper 140 (Mei 2025)"); });
  };

  S.b2_6 = function (ctx, b, l, t) {
    const t14 = D.at(b, "satu dari empat"), tH = D.at(b, "hanya tiga koma tiga");
    U.latar(ctx, t, { col: P.amber, gx: 500, gy: 400, ga: 0.18 });
    U.panel(ctx, 130, 250, 800, 520); for (let i = 0; i < 4; i++) { const a = ramp(l, 0.3 + i * 0.15, 0.4), hi = i === 0 ? eio(ramp(l, t14, 0.5)) : 0; U.orang(ctx, 260 + i * 180, 640, 290, hi > 0.5 ? P.amber : D.hexA(P.ink2, 0.75), a); if (hi > 0) D.glow(ctx, 260, 500, 220, P.amber, 0.25 * hi); }
    U.panel(ctx, 1000, 250, 800, 520); const kg = clamp((l - tH + 0.8) / 0.8);
    for (let i = 0; i < 100; i++) { const q = i % 10, r = Math.floor(i / 10), a = clamp(kg * 2 - i / 100), red = i < 3 && l > tH; ctx.fillStyle = D.hexA(red ? P.red : P.ink2, (red ? 1 : 0.35) * a); ctx.beginPath(); ctx.arc(1195 + q * 46, 310 + r * 40, 15, 0, U.TAU); ctx.fill(); }
    if (l > tH) { ctx.fillStyle = D.hexA(P.red, 0.35 * ramp(l, tH, 0.3)); ctx.beginPath(); ctx.arc(1195 + 3 * 46, 310, 15, 0, U.TAU); ctx.fill(); }
    D.post(c => {
      U.judulPop(c, "Berapa pekerja yang terpapar AI generatif?", 960, 150, 62, l, 0.3, { col: P.amber });
      U.tagPop(c, "1 dari 4 pekerja terpapar", 530, 722, l, t14, { col: P.amber, size: 50 });
      U.tagPop(c, "hanya 3,3% paparan tertinggi", 1400, 722, l, tH, { col: P.red, size: 50 });
      U.sumber(c, l, t14, "ILO Working Paper 140 (Mei 2025)");
    });
  };

  S.b2_7 = function (ctx, b, l, t) {
    const tU = D.at(b, "perubahan pekerjaan"), tB = D.at(b, "bukan hilangnya"), tM = D.at(b, "masih butuh manusia");
    U.latar(ctx, t, { col: P.teal, gx: 960, gy: 450 });
    const a1 = U.pop(l, tU - 0.2), a2 = U.pop(l, tB - 0.2), dim = 0.3 * ramp(l, 0.7, 0.5); a1.a = Math.max(a1.a, dim); a2.a = Math.max(a2.a, dim);
    if (a1.a > 0) { ctx.save(); ctx.globalAlpha *= a1.a; U.panel(ctx, 170, 290, 740, 400, { stroke: D.hexA(P.teal, 0.9), lw: 5 }); txt(ctx, "pekerjaan berubah", 540, 380, 58, { align: "center", weight: 900, color: P.teal });
      U.orang(ctx, 400, 640, 200, P.ink2, 1, { laptop: true }); U.panah(ctx, 470, 540, 610, 540, P.teal, (l - tU) / 0.6); U.orang(ctx, 690, 640, 200, P.teal, ramp(l, tU + 0.5, 0.4), { laptop: true }); ctx.restore(); U.centang(ctx, 850, 350, 34, (l - tU - 0.6) / 0.4, P.teal); }
    if (a2.a > 0) { ctx.save(); ctx.globalAlpha *= a2.a * lerp(1, 0.55, ramp(l, tB + 1, 0.6)); U.panel(ctx, 1010, 290, 740, 400, { stroke: D.hexA(P.red, 0.6) }); txt(ctx, "pekerjaan hilang", 1380, 380, 58, { align: "center", weight: 900, color: P.red });
      U.orang(ctx, 1380, 640, 200, D.hexA(P.ink2, 0.4), 1); ctx.restore(); U.silang(ctx, 1380, 540, 60, (l - tB - 0.3) / 0.4); }
    D.post(c => { U.judulPop(c, "Dampak yang paling mungkin menurut ILO", 960, 160, 62, l, 0.3, { col: P.teal }); U.tagPop(c, "sebagian besar pekerjaan masih butuh manusia", 960, 770, l, tM - 0.6, { col: P.amber, size: 50 }); });
  };

  S.b2_8 = function (ctx, b, l, t) {
    const tT = D.at(b, "terpapar tidak sama"), tR = D.at(b, "ramalan tetaplah"), tD = D.at(b, "sudah benar-benar terjadi");
    U.latar(ctx, t, { col: P.amber, gx: 960, gy: 400, ga: 0.28 });
    const p = U.pop(l, tT - 0.2), fadeOut = 1 - 0.6 * ramp(l, tD - 0.3, 0.5);
    if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a * fadeOut; ctx.translate(960, 400); const k = lerp(0.8, 1, p.sp); ctx.scale(k, k);
      txt(ctx, "terpapar", -180, 30, 120, { align: "right", weight: 900, color: P.amber }); txt(ctx, "≠", 0, 34, 150, { align: "center", weight: 900 }); txt(ctx, "hilang", 180, 30, 120, { weight: 900, color: P.red }); ctx.restore(); }
    D.post(c => { U.tagPop(c, "ramalan tetap ramalan", 600, 640, l, tR, { col: P.violet, size: 54, a: fadeOut }); U.tagPop(c, "sekarang: data yang sudah terjadi →", 1220, 760, l, tD - 0.9, { col: P.teal, size: 56 }); });
    U.bip(ctx, 300, 880, 170, t, { pose: "tunjuk", mood: "happy" });
  };

  U.reg(2, S);
})(typeof window !== "undefined" ? window : globalThis);
