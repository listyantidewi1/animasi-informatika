/* D06 bab 5 — Pekerjaan yang berubah bentuk (b5_1 … b5_6).
   Sumber: WEF Future of Jobs Report 2025 (39% keterampilan berubah sampai 2030; berpikir analitis penting bagi 7 dari 10 perusahaan;
   keterampilan tercepat naik: AI dan big data, lalu jaringan dan keamanan siber); Brynjolfsson, Chandar, Chen (2026). */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d06, P = D.P;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, TAU = U.TAU;

  const TEMU = [["AI sangat pandai", "menulis kode", P.amber, "sangat pandai"], ["Lowongan developer", "tetap tumbuh", P.green, "tetap tumbuh"], ["Pintu masuk untuk pemula", "menyempit", P.red, "Pintu masuk"], ["Kode buatan AI sering", "hampir benar", P.violet, "hampir benar"]];
  S.b5_1 = function (ctx, b, l, t) {
    U.latar(ctx, t, { col: P.violet, gx: 960, gy: 500 });
    TEMU.forEach(([s1, s2, col, key], i) => { const t0 = D.at(b, key) - 0.3, p = U.pop(l, t0); if (p.a <= 0) return; const x = i % 2 ? 990 : 150, y = i < 2 ? 250 : 520;
      ctx.save(); ctx.globalAlpha *= p.a; ctx.translate(x + 390, y + 115); const k = lerp(0.88, 1, p.sp); ctx.scale(k, k); ctx.translate(-390, -115);
      U.panel(ctx, 0, 0, 780, 230, { stroke: D.hexA(col, 0.9), lw: 5 }); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(96, 115, 54, 0, TAU); ctx.fill(); txt(ctx, String(i + 1), 96, 137, 62, { align: "center", weight: 900, color: "#10142E" });
      txt(ctx, s1, 184, 100, 46, { weight: 800, fit: 570 }); txt(ctx, s2, 184, 168, 56, { weight: 900, color: col }); ctx.restore(); });
    TEMU.forEach(([s1, s2, col, key], i) => { const a = 0.35 * ramp(l, 0.6 + i * 0.15, 0.4) * (1 - U.pop(l, D.at(b, key) - 0.3).a); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; U.panel(ctx, i % 2 ? 990 : 150, i < 2 ? 250 : 520, 780, 230, { stroke: D.hexA(col, 0.9), lw: 4 }); ctx.restore(); });
    D.post(c => U.judulPop(c, "Sekarang kita gabungkan semua temuan", 960, 140, 62, l, 0.3, { col: P.amber }));
  };

  const BESAR = [["memahami masalah", P.teal], ["merancang sistem", P.blue], ["memeriksa hasil", P.green], ["bertanggung jawab atas hasil", P.amber]];
  S.b5_2 = function (ctx, b, l, t) {
    const tT = D.at(b, "tidak hilang"), tK = D.at(b, "Bagian mengetik kode"), tKecil = D.at(b, "makin kecil"), ts = [D.at(b, "memahami masalah"), D.at(b, "merancang sistem"), D.at(b, "memeriksa hasil"), D.at(b, "bertanggung jawab")], tB = D.at(b, "makin besar");
    U.latar(ctx, t, { col: P.teal, gx: 1300, gy: 500 });
    const am = ramp(l, 0.4, 0.4) * (1 - ramp(l, tK - 0.6, 0.4)); if (am > 0) { const kc = eio(ramp(l, 1.0, 2.2)); ctx.save(); ctx.globalAlpha *= am;
      TEMU.forEach(([s1, s2, col], i) => { const x0 = 960 + (i % 2 ? 420 : -420), y0 = i < 2 ? 380 : 640, x = lerp(x0, 960, kc), y = lerp(y0, 510, kc); D.glow(ctx, x, y, 160, col, 0.3); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 70, 0, TAU); ctx.fill(); if (kc < 0.9) txt(ctx, String(i + 1), x, y + 26, 76, { align: "center", weight: 900, color: "#10142E" }); });
      if (kc > 0.9) { D.glow(ctx, 960, 510, 420, P.amber, 0.5); ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(960, 510, 110 + 6 * Math.sin(t * 3), 0, TAU); ctx.fill(); txt(ctx, "satu gambaran", 960, 720, 60, { align: "center", weight: 900 }); } ctx.restore(); }
    const a = ramp(l, tK - 0.4, 0.5), sc = lerp(1, 0.5, eio(ramp(l, tKecil - 0.6, 1.6)));
    if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.translate(430, 500); ctx.save(); ctx.scale(sc, sc); U.jendela(ctx, -250, -190, 500, 380, ""); U.kode(ctx, -210, -100, 420, 6, 9, 1, { lh: 44 }); ctx.restore(); txt(ctx, "mengetik kode", 0, 256, 50, { align: "center", weight: 900, color: P.red }); ctx.restore();
      BESAR.forEach(([s, col], i) => { const w = lerp(760, 980, eio(ramp(l, ts[i] - 0.2, 1))), y = 270 + i * 124; ctx.save(); ctx.globalAlpha *= a * (0.45 + 0.55 * ramp(l, ts[i] - 0.2, 0.4));
        ctx.fillStyle = D.hexA(col, 0.3); RR(ctx, 800, y, w, 100, 24); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.stroke(); txt(ctx, s, 836, y + 66, 48, { weight: 900 }); ctx.restore(); }); }
    D.post(c => { U.judulPop(c, "Tidak hilang, tetapi berubah bentuk", 960, 140, 66, l, tT - 0.3, { col: P.amber });
      U.tagPop(c, "makin kecil", 430, 826, l, tKecil, { col: P.red, size: 48 }); U.tagPop(c, "makin besar", 1290, 826, l, tB, { col: P.green, size: 48 }); });
  };

  function gedung(ctx, x, y, s, col, on) { ctx.fillStyle = on ? col : "rgba(242,246,255,0.16)"; RR(ctx, x - s * 0.36, y - s * 1.3, s * 0.72, s * 1.3, 6); ctx.fill(); ctx.fillStyle = on ? "#10142E" : "rgba(10,18,52,0.6)"; for (let i = 0; i < 6; i++) ctx.fillRect(x - s * 0.22 + (i % 2) * s * 0.28, y - s * 1.15 + Math.floor(i / 2) * s * 0.34, s * 0.16, s * 0.2); }
  S.b5_3 = function (ctx, b, l, t) {
    const t39 = D.at(b, "tiga puluh sembilan persen"), tA = D.at(b, "berpikir analitis"), t7 = D.at(b, "tujuh dari sepuluh");
    U.latar(ctx, t, { col: P.amber, gx: 400, gy: 400, ga: 0.2 });
    U.panel(ctx, 130, 240, 700, 540); U.donat(ctx, 480, 440, 150, 0.39, P.amber, (l - t39) / 1.2);
    ctx.save(); ctx.globalAlpha *= ramp(l, t39 + 0.6, 0.4); txt(ctx, "keterampilan pekerja akan", 480, 676, 42, { align: "center", weight: 800 }); txt(ctx, "berubah atau usang sampai 2030", 480, 730, 42, { align: "center", weight: 800 }); ctx.restore();
    const a = eout(ramp(l, tA - 0.4, 0.5)); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; U.panel(ctx, 890, 240, 900, 540, { stroke: D.hexA(P.teal, 0.8), lw: 4 }); txt(ctx, "Keterampilan inti paling dicari", 1340, 320, 42, { align: "center", weight: 700, color: P.ink2 }); txt(ctx, "berpikir analitis", 1340, 410, 80, { align: "center", weight: 900, color: P.teal });
      for (let i = 0; i < 10; i++) gedung(ctx, 980 + i * 80, 620, 62, P.teal, i < 7 && l > t7 + i * 0.12);
      ctx.globalAlpha *= ramp(l, t7, 0.4); txt(ctx, "penting bagi 7 dari 10 perusahaan", 1340, 716, 44, { align: "center", weight: 800 }); ctx.restore(); }
        D.post(c => { U.judulPop(c, "Keterampilan yang berubah", 960, 140, 64, l, 0.3, { col: P.amber }); U.sumber(c, l, 0.5, "WEF Future of Jobs Report 2025"); });
  };

  S.b5_4 = function (ctx, b, l, t) {
    const ts = [D.at(b, "AI dan big data"), D.at(b, "jaringan dan keamanan")];
    U.latar(ctx, t, { col: P.green, gx: 1400, gy: 400 });
    [["AI dan big data", P.amber], ["Jaringan dan keamanan siber", P.teal]].forEach(([s, col], i) => { const k = eout(ramp(l, ts[i] - 0.3, 0.6)); if (k <= 0) return; const y = 270 + i * 240;
      ctx.save(); ctx.globalAlpha *= k; ctx.translate((1 - k) * -80, 0); U.panel(ctx, 200, y, 1520, 200, { stroke: D.hexA(col, 0.9), lw: 5 }); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(310, y + 100, 60, 0, TAU); ctx.fill();
      txt(ctx, String(i + 1), 310, y + 124, 70, { align: "center", weight: 900, color: "#10142E" }); txt(ctx, s, 420, y + 124, 72, { weight: 900 }); U.panah(ctx, 1560, y + 160, 1650, y + 50, col, ramp(l, ts[i], 0.6), 10); ctx.restore(); });
    D.post(c => { U.judulPop(c, "Keterampilan yang paling cepat naik", 960, 150, 64, l, 0.2, { col: P.green }); U.sumber(c, l, 0.4, "WEF Future of Jobs Report 2025"); });
  };

  S.b5_5 = function (ctx, b, l, t) {
    const tG = D.at(b, "turun di pekerjaan"), tB = D.at(b, "bertahan");
    U.latar(ctx, t, { col: P.violet, gx: 960, gy: 300 });
    U.duaJalur(ctx, l, tG, tB);
    D.post(c => { U.judulPop(c, "Ingat temuan Stanford tadi", 960, 150, 66, l, 0.2, { col: P.amber }); U.tagPop(c, "turun", 720, 470, l, tG + 1, { col: P.red, size: 50 }); U.tagPop(c, "bertahan, bahkan naik", 1500, 650, l, tB + 0.4, { col: P.green, size: 46 }); U.sumber(c, l, tG, "Brynjolfsson, Chandar, Chen (2026); skematis"); });
  };

  S.b5_6 = function (ctx, b, l, t) {
    const tA = D.at(b, "apakah AI akan dipakai"), tP = D.at(b, "AI pasti dipakai"), tK = D.at(b, "kamu yang memakai AI"), tD = D.at(b, "digantikan oleh orang lain");
    U.latar(ctx, t, { col: P.amber, gx: 960, gy: 500, ga: 0.22 });
    const a1 = eout(ramp(l, tK - 0.3, 0.5)), a2 = eout(ramp(l, tD - 0.3, 0.5));
    if (a1 > 0) { ctx.save(); ctx.globalAlpha *= a1; U.panel(ctx, 150, 260, 760, 520, { stroke: D.hexA(P.green, 0.9), lw: 5 }); U.orang(ctx, 440, 660, 300, P.amber, 1, { laptop: true }); U.bip(ctx, 740, 560, 130, t, { mood: "happy" }); txt(ctx, "kamu yang memakai AI", 530, 740, 52, { align: "center", weight: 900, color: P.green }); ctx.restore(); }
    if (a2 > 0) { ctx.save(); ctx.globalAlpha *= a2; U.panel(ctx, 1010, 260, 760, 520, { stroke: D.hexA(P.red, 0.9), lw: 5 }); U.orang(ctx, 1190, 660, 240, D.hexA(P.ink2, 0.35), 1); U.panah(ctx, 1260, 520, 1330, 520, P.red, ramp(l, tD + 0.2, 0.5), 8);
      U.orang(ctx, 1470, 660, 300, P.blue, 1, { laptop: true }); U.bip(ctx, 1680, 540, 120, t, { mood: "happy" }); txt(ctx, "digantikan orang yang memakai", 1390, 716, 42, { align: "center", weight: 900, color: P.red }); txt(ctx, "AI dengan lebih baik", 1390, 764, 42, { align: "center", weight: 900, color: P.red }); ctx.restore(); }
    if (a1 > 0 && a2 > 0) { ctx.save(); ctx.globalAlpha *= a2; ctx.fillStyle = "#10142E"; ctx.beginPath(); ctx.arc(960, 520, 56, 0, TAU); ctx.fill(); ctx.strokeStyle = P.amber; ctx.lineWidth = 4; ctx.stroke(); txt(ctx, "atau", 960, 534, 40, { align: "center", weight: 900, color: P.amber }); ctx.restore(); }
    const ab = ramp(l, 0.4, 0.4) * (1 - ramp(l, tK - 0.6, 0.4)); if (ab > 0) { ctx.save(); ctx.globalAlpha *= ab; D.glow(ctx, 960, 520, 360, P.teal, 0.3); U.bip(ctx, 960, 520, 300, t, { mood: l > tP ? "happy" : "think" }); ctx.restore(); U.centang(ctx, 1160, 380, 54, ab * (l - tP - 0.2) / 0.4); }
    D.post(c => { U.judulPop(c, "Apakah AI akan dipakai?", 960, 150, 66, l, tA - 0.3, { col: P.ink2, a: 1 - ramp(l, tP - 0.2, 0.3) }); U.judulPop(c, "AI pasti dipakai. Pertanyaannya:", 960, 150, 66, l, tP, { col: P.amber }); });
  };

  U.reg(5, S);
})(typeof window !== "undefined" ? window : globalThis);
