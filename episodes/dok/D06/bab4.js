/* D06 bab 4 — Merasa cepat, ternyata lambat (b4_1 … b4_8).
   Sumber: METR, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity" (Juli 2025): 16 developer, 246 tugas,
   perkiraan +24%, kenyataan 19% lebih lambat, perasaan sesudahnya +20%; Stack Overflow Developer Survey 2025: 84%, 46%, 66%. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d06, P = D.P;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, TAU = U.TAU;

  // cincin persen (dipakai lagi di bab 5)
  U.donat = function (ctx, x, y, r, frac, col, k) {
    const e = eout(clamp(k)), f = frac * e; ctx.save(); ctx.lineWidth = r * 0.3; ctx.strokeStyle = "rgba(242,246,255,0.14)"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    if (f > 0) { ctx.strokeStyle = col; ctx.lineCap = "round"; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(x, y, r, -TAU / 4, -TAU / 4 + f * TAU); ctx.stroke(); }
    ctx.restore(); if (k > 0) U.angka(ctx, Math.round(frac * 100 * e) + "%", x, y + r * 0.2, r * 0.58, col, clamp(k * 4));
  };
  // stopwatch
  U.jam = function (ctx, x, y, r, t, col = P.amber) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; RR(ctx, -r * 0.14, -r * 1.3, r * 0.28, r * 0.3, 6); ctx.fill();
    ctx.fillStyle = "#0F1738"; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = r * 0.12; ctx.stroke();
    ctx.strokeStyle = "rgba(242,246,255,0.5)"; ctx.lineWidth = 4; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.7); ctx.lineTo(Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82); ctx.stroke(); }
    ctx.rotate(t * 1.6); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = r * 0.07; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r * 0.62); ctx.stroke(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(0, 0, r * 0.09, 0, TAU); ctx.fill(); ctx.restore();
  };

  S.b4_1 = function (ctx, b, l, t) {
    const tC = D.at(b, "jauh lebih cepat"), tM = D.at(b, "lembaga riset METR"), tK = D.at(b, "cara yang ketat");
    U.latar(ctx, t, { col: P.violet, gx: 500, gy: 400 });
    const a = ramp(l, 0.3, 0.5), sp = ramp(l, tC - 0.3, 0.5) * (1 - ramp(l, tM - 0.3, 0.5));
    if (sp > 0) for (let i = 0; i < 7; i++) { const u = (t * 1.4 + i / 7) % 1; ctx.save(); ctx.globalAlpha *= sp * (1 - u); ctx.strokeStyle = P.amber; ctx.lineWidth = 8; ctx.lineCap = "round"; const y = 400 + i * 50; ctx.beginPath(); ctx.moveTo(360 - u * 200, y); ctx.lineTo(260 - u * 200, y); ctx.stroke(); ctx.restore(); }
    U.orang(ctx, 560, 770, 400, P.blue, a, { laptop: true }); if (a > 0.5) U.bip(ctx, 850, 780, 180, t, { pose: "tunjuk", target: [560, 560], mood: "happy" });
    const am = eout(ramp(l, tM - 0.3, 0.6)); if (am > 0) { ctx.save(); ctx.globalAlpha *= am; ctx.translate(0, (1 - am) * 40); U.panel(ctx, 1080, 260, 700, 500, { stroke: D.hexA(P.violet, 0.85), lw: 4 });
      txt(ctx, "METR", 1430, 360, 84, { align: "center", weight: 900 }); txt(ctx, "lembaga riset, 2025", 1430, 424, 44, { align: "center", weight: 700, color: P.ink2 }); U.jam(ctx, 1430, 590, 96, l); ctx.restore(); }
    D.post(c => { U.judulPop(c, "Pakai AI, pasti jauh lebih cepat?", 960, 150, 68, l, tC - 0.6, { col: P.amber }); U.tagPop(c, "diuji dengan cara yang ketat", 1430, 800, l, tK, { col: P.violet, size: 46 }); });
  };

  S.b4_2 = function (ctx, b, l, t) {
    const t16 = D.at(b, "enam belas"), t246 = D.at(b, "dua ratus empat puluh enam"), tU = D.at(b, "diundi"), tA = D.at(b, "boleh memakai AI"), tT = D.at(b, "ada yang tidak");
    U.latar(ctx, t, { col: P.blue, gx: 400, gy: 300 });
    U.panel(ctx, 110, 240, 820, 530);
    for (let i = 0; i < 16; i++) U.orang(ctx, 200 + (i % 8) * 92, 440 + Math.floor(i / 8) * 170, 130, P.blue, ramp(l, t16 - 0.2 + i * 0.05, 0.25), { laptop: true });
    U.panel(ctx, 990, 240, 820, 530);
    const k = ramp(l, t246 - 0.2, 0.3); if (k > 0) { U.angka(ctx, String(Math.round(U.hitung(l, t246 - 0.2, 0, 246, 1.4))), 1400, 390, 130, P.amber, k); ctx.save(); ctx.globalAlpha *= k; txt(ctx, "tugas nyata", 1400, 452, 46, { align: "center", weight: 800 }); ctx.restore(); }
    // kartu tugas diundi ke dua tumpukan
    for (let i = 0; i < 12; i++) { const u = eio(ramp(l, tU + i * 0.22, 0.5)); if (u <= 0) continue; const ai = i % 2 === 0, n = Math.floor(i / 2), tx = (ai ? 1130 : 1540) + n * 26, ty = 560 + n * 6; const x = lerp(1370, tx, u), y = lerp(480, ty, u) - Math.sin(u * Math.PI) * 50;
      ctx.save(); ctx.translate(x, y); ctx.rotate((1 - u) * 1.5); ctx.fillStyle = ai ? P.amber : P.blue; RR(ctx, 0, 0, 64, 84, 10); ctx.fill(); ctx.fillStyle = "rgba(10,18,52,0.5)"; RR(ctx, 10, 14, 44, 8, 4); ctx.fill(); RR(ctx, 10, 32, 30, 8, 4); ctx.fill(); ctx.restore(); }
    D.post(c => {
      U.judulPop(c, "Percobaan METR", 960, 140, 66, l, 0.3, { col: P.violet });
      U.tagPop(c, "16 developer berpengalaman", 520, 716, l, t16 + 0.6, { col: P.blue, size: 40 });
      U.tagPop(c, "diundi", 1400, 530, l, tU, { col: P.violet, size: 44, a: 1 - ramp(l, tA - 0.2, 0.3) });
      U.tagPop(c, "boleh memakai AI", 1200, 716, l, tA, { col: P.amber, size: 40 }); U.tagPop(c, "tanpa AI", 1620, 716, l, tT, { col: P.blue, size: 40 });
      U.sumber(c, l, t16, "METR (Juli 2025)");
    });
  };

  const BAR = [["Perkiraan sebelum mulai", 24, "24% lebih cepat", P.blue], ["Kenyataan saat memakai AI", -19, "19% lebih lambat", P.red], ["Perasaan setelah selesai", 20, "20% lebih cepat", P.amber]];
  function tigaBatang(ctx, l, ts, hi) {
    const ax = 1050, sc = 9; U.panel(ctx, 140, 230, 1640, 560);
    txt(ctx, "lebih lambat", ax - 24, 296, 40, { align: "right", weight: 700, color: P.ink2 }); txt(ctx, "lebih cepat", ax + 24, 296, 40, { weight: 700, color: P.ink2 });
    ctx.strokeStyle = "rgba(242,246,255,0.5)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ax, 320); ctx.lineTo(ax, 750); ctx.stroke();
    BAR.forEach(([s, v, lab, col], i) => { const a = ramp(l, ts[i] - 0.3, 0.4); if (a <= 0) return; const y = 390 + i * 140, k = eout(ramp(l, ts[i], 0.9)), w = Math.abs(v) * sc * k;
      ctx.save(); ctx.globalAlpha *= a; if (hi === i) { ctx.fillStyle = D.hexA(col, 0.12); RR(ctx, 164, y - 62, 1592, 124, 22); ctx.fill(); }
      txt(ctx, s, 196, y + 16, 44, { weight: 800, color: P.ink });
      const gr = ctx.createLinearGradient(ax - 220, 0, ax + 220, 0); gr.addColorStop(0, col); gr.addColorStop(1, col); ctx.fillStyle = gr; if (w > 2) { RR(ctx, v > 0 ? ax : ax - w, y - 40, w, 80, Math.min(16, w / 2)); ctx.fill(); }
      ctx.globalAlpha *= ramp(l, ts[i] + 0.3, 0.4); txt(ctx, lab, 1300, y + 18, 52, { weight: 900, color: col }); ctx.restore(); });
  }
  S.b4_3 = function (ctx, b, l, t) {
    const t24 = D.at(b, "dua puluh empat persen"), t19 = D.at(b, "sembilan belas persen");
    U.latar(ctx, t, { col: P.red, gx: 1400, gy: 500, ga: 0.2 });
    tigaBatang(ctx, l, [t24, t19, 1e9], l > t19 - 0.3 ? 1 : -1);
    D.post(c => { U.judulPop(c, "Perkiraan dan kenyataan", 960, 140, 66, l, 0.3, { col: P.violet }); U.sumber(c, l, 0.4, "METR (Juli 2025), 16 developer, 246 tugas"); });
  };
  S.b4_4 = function (ctx, b, l, t) {
    const t20 = D.at(b, "dua puluh persen"), tM = D.at(b, "masih merasa");
    U.latar(ctx, t, { col: P.amber, gx: 1400, gy: 600, ga: 0.2 });
    tigaBatang(ctx, l, [-9, -9, t20], l > tM - 0.3 ? 2 : -1);
    D.post(c => { U.judulPop(c, "Yang paling mengejutkan", 960, 140, 66, l, 0.2, { col: P.amber }); U.sumber(c, l, -1, "METR (Juli 2025), 16 developer, 246 tugas"); });
  };

  S.b4_5 = function (ctx, b, l, t) {
    const tU = D.at(b, "sudah usang"), tG = D.at(b, "generasi awal"), tP = D.at(b, "perasaan cepat"), tB = D.at(b, "benar-benar cepat"), tM = D.at(b, "mengukur");
    U.latar(ctx, t, { col: P.teal, gx: 1400, gy: 400 });
    const a = eout(ramp(l, 0.3, 0.6)); ctx.save(); ctx.globalAlpha *= a; ctx.translate(500, 510 + (1 - a) * 40); ctx.rotate(-0.02);
    ctx.fillStyle = "rgba(0,0,0,0.3)"; RR(ctx, -350, -240, 720, 500, 16); ctx.fill(); ctx.fillStyle = "#F4F1E8"; RR(ctx, -360, -250, 720, 500, 16); ctx.fill();
    txt(ctx, "Catatan dari METR", 0, -160, 56, { align: "center", weight: 900, color: "#1A1A2E" }); ctx.fillStyle = "#6A4FD0"; ctx.fillRect(-120, -130, 240, 6);
    ctx.globalAlpha *= 0.3 + 0.7 * ramp(l, tG - 0.2, 0.4); txt(ctx, "Alat AI yang diuji:", 0, -30, 46, { align: "center", weight: 700, color: "#5A5A72" }); txt(ctx, "generasi awal 2025", 0, 40, 58, { align: "center", weight: 900, color: "#2A2A44" }); ctx.restore();
    const p = U.pop(l, tU); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; ctx.translate(500, 660); ctx.rotate(-0.1); const k = lerp(1.5, 1, p.sp); ctx.scale(k, k); ctx.strokeStyle = "#D8342A"; ctx.lineWidth = 8; RR(ctx, -260, -52, 520, 104, 14); ctx.stroke(); txt(ctx, "SUDAH USANG", 0, 24, 66, { align: "center", weight: 900, color: "#D8342A" }); ctx.restore(); }
    const ar = eout(ramp(l, tP - 0.4, 0.5)); if (ar > 0) { ctx.save(); ctx.globalAlpha *= ar; U.panel(ctx, 990, 260, 800, 440, { stroke: D.hexA(P.teal, 0.8), lw: 4 });
      txt(ctx, "merasa cepat", 1390, 370, 66, { align: "center", weight: 900, color: P.amber });
      ctx.globalAlpha *= ramp(l, tB - 0.4, 0.3); txt(ctx, "≠", 1390, 490, 110, { align: "center", weight: 900 }); txt(ctx, "benar-benar cepat", 1390, 620, 66, { align: "center", weight: 900, color: P.green }); ctx.restore(); }
    const tX = D.at(b, "pelajarannya bukan"), ax = U.pop(l, tX).a * (1 - ramp(l, tP - 0.5, 0.4)); if (ax > 0) { ctx.save(); ctx.globalAlpha *= ax; U.panel(ctx, 1010, 400, 760, 150, { stroke: D.hexA(P.red, 0.8), lw: 4 }); txt(ctx, "\"AI membuat kita lambat\"", 1390, 492, 52, { align: "center", weight: 900 }); ctx.restore(); U.silang(ctx, 1770, 400, 40, ax * (l - tX - 0.8) / 0.3); }
    D.post(c => { U.judulPop(c, "Kita harus jujur di sini", 960, 140, 64, l, 0.3, { col: P.teal }); U.tagPop(c, "ukur, jangan hanya merasa", 1390, 780, l, tM, { col: P.amber, size: 54 }); });
    U.jam(ctx, 1700, 790, 50, l);
  };

  S.b4_6 = function (ctx, b, l, t) {
    const tS = D.at(b, "Survei Stack Overflow"), t84 = D.at(b, "Delapan puluh empat"), t46 = D.at(b, "empat puluh enam persen");
    U.latar(ctx, t, { col: P.amber, gx: 960, gy: 300, ga: 0.2 });
    U.panel(ctx, 150, 240, 780, 540); U.panel(ctx, 990, 240, 780, 540);
    U.donat(ctx, 540, 460, 150, 0.84, P.blue, (l - t84) / 1.2); U.donat(ctx, 1380, 460, 150, 0.46, P.red, (l - t46) / 1.2);
    D.post(c => {
      U.judulPop(c, "Survei Stack Overflow 2025", 960, 140, 64, l, tS - 0.3, { col: P.amber });
      U.tagPop(c, "memakai atau berencana memakai AI", 540, 716, l, t84 + 0.5, { col: P.blue, size: 40 });
      U.tagPop(c, "tidak percaya pada akurasinya", 1380, 716, l, t46 + 0.5, { col: P.red, size: 40 });
      U.sumber(c, l, tS, "Stack Overflow Developer Survey 2025");
    });
  };
  S.b4_7 = function (ctx, b, l, t) {
    const t66 = D.at(b, "enam puluh enam persen"), tH = D.at(b, "hampir benar"), tT = D.at(b, "tidak sepenuhnya"), tS = D.at(b, "Hampir separuh");
    U.latar(ctx, t, { col: P.violet, gx: 400, gy: 500 });
    U.panel(ctx, 150, 240, 1620, 400);
    U.donat(ctx, 400, 440, 140, 0.66, P.amber, (l - t66) / 1.2);
    ctx.save(); ctx.globalAlpha *= ramp(l, 0.4, 0.4); txt(ctx, "Keluhan nomor satu:", 640, 370, 48, { weight: 700, color: P.ink2 });
    ctx.globalAlpha *= ramp(l, tH - 0.4, 0.4); txt(ctx, "jawaban AI yang hampir benar,", 640, 460, 60, { weight: 900, color: P.amber }); ctx.restore();
    ctx.save(); ctx.globalAlpha *= ramp(l, tT - 0.3, 0.4); txt(ctx, "tetapi tidak sepenuhnya benar", 640, 540, 60, { weight: 900 }); ctx.restore();
    D.post(c => { U.judulPop(c, "Apa keluhan para developer?", 960, 140, 64, l, 0.3, { col: P.violet });
      U.tagPop(c, "hampir separuh: memperbaiki kode buatan AI lebih memakan waktu", 960, 730, l, tS, { col: P.red, size: 44 });
      U.sumber(c, l, 0.4, "Stack Overflow Developer Survey 2025"); });
  };

  S.b4_8 = function (ctx, b, l, t) {
    const tB = D.at(b, "paling berbahaya"), tT = D.at(b, "terlihat benar"), tH = D.at(b, "Hanya orang yang paham"), tS = D.at(b, "bagian yang salah");
    U.latar(ctx, t, { col: P.red, gx: 600, gy: 500, ga: 0.2 });
    U.jendela(ctx, 240, 240, 940, 540, "kode buatan AI"); U.kode(ctx, 290, 346, 760, 8, 31, clamp(l / 2), { lh: 52 });
    for (let i = 0; i < 8; i++) U.centang(ctx, 1120, 356 + i * 52, 18, i === 5 && l > tS ? 0 : (l - tT - i * 0.1) / 0.3);
    const ks = ramp(l, tS, 0.4); if (ks > 0) { U.sorot(ctx, 270, 356 + 5 * 52 - 24, 880, 48, ks, P.red); U.silang(ctx, 1120, 356 + 5 * 52, 20, (l - tS) / 0.3);
      ctx.save(); ctx.globalAlpha *= ks; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(900, 616, 54, 0, TAU); ctx.stroke(); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(940, 656); ctx.lineTo(990, 706); ctx.stroke(); ctx.restore(); }
    U.orang(ctx, 1540, 740, 260, P.amber, ramp(l, tH - 0.2, 0.4), { laptop: true });
    D.post(c => { U.judulPop(c, "Hampir benar = paling berbahaya", 960, 140, 64, l, tB - 0.8, { col: P.red });
      U.tagPop(c, "terlihat benar", 1540, 300, l, tT, { col: P.green, size: 50, a: 1 - ramp(l, tS, 0.3) }); U.tagPop(c, "ada bagian yang salah", 1540, 300, l, tS, { col: P.red, size: 46 });
      U.tagPop(c, "yang paham bisa menemukannya", 1440, 812, l, tH, { col: P.amber, size: 40 }); });
  };

  U.reg(4, S);
})(typeof window !== "undefined" ? window : globalThis);
