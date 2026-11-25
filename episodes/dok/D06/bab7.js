/* D06 bab 7 — Lalu, apa yang harus kamu lakukan? (b7_1 … b7_9). Lima langkah, ajakan ke video peta, kalimat penutup,
   catatan keterbukaan AI, lalu layar akhir (±20 detik) dengan tempat untuk elemen layar akhir YouTube. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d06, P = D.P;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {}, TAU = U.TAU;
  const COL = [P.teal, P.green, P.amber, P.violet, P.blue];
  const kepala = (c, n, s, l) => U.judulPop(c, n + ". " + s, 960, 140, 64, l, 0.25, { col: COL[n - 1] });

  S.b7_1 = function (ctx, b, l, t) {
    const tL = D.at(b, "lima hal");
    U.latar(ctx, t, { col: P.amber, gx: 960, gy: 500, ga: 0.22 });
    ["dasar", "memeriksa", "dibantu AI", "bukti", "mengukur"].forEach((s, i) => { const p = U.pop(l, tL + i * 0.3), x = 300 + i * 330; if (p.a <= 0) return; ctx.save(); ctx.globalAlpha *= p.a; ctx.translate(x, 470); const k = lerp(0.5, 1, p.sp); ctx.scale(k, k);
      D.glow(ctx, 0, 0, 200, COL[i], 0.35); ctx.fillStyle = COL[i]; ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.fill(); txt(ctx, String(i + 1), 0, 38, 110, { align: "center", weight: 900, color: "#10142E" }); ctx.restore();
      ctx.save(); ctx.globalAlpha *= p.a; txt(ctx, s, x, 660, 46, { align: "center", weight: 800 }); ctx.restore(); });
    D.post(c => U.judulPop(c, "Lima hal yang bisa kamu lakukan mulai sekarang", 960, 150, 62, l, 0.3, { col: P.amber }));
  };

  const DASAR = [["logika", "logika"], ["struktur data", "struktur data"], ["database", "database"], ["cara kerja jaringan", "cara kerja jaringan"]];
  S.b7_2 = function (ctx, b, l, t) {
    const tA = D.at(b, "AI berubah"), tS = D.at(b, "tetap sama");
    U.latar(ctx, t, { col: P.teal, gx: 500, gy: 500 });
    const a = ramp(l, 0.6, 0.5); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; U.panel(ctx, 210, 236, 1500, 130); ctx.save(); RR(ctx, 210, 236, 1500, 130, 28); ctx.clip();
      ["alat AI baru", "alat AI lebih baru", "alat AI terbaru", "alat AI berikutnya"].forEach((s, i) => { const x = 210 + ((i * 520 - l * 170) % 2080 + 2080) % 2080 - 260; ctx.fillStyle = D.hexA(P.red, 0.22); RR(ctx, x, 262, 460, 78, 22); ctx.fill(); ctx.strokeStyle = D.hexA(P.red, 0.8); ctx.lineWidth = 3; ctx.stroke(); txt(ctx, s, x + 230, 316, 42, { align: "center", weight: 800 }); });
      ctx.restore(); ctx.restore(); }
    DASAR.forEach(([s, key], i) => { const p = U.pop(l, D.at(b, key) - 0.15); if (p.a <= 0) return; const x = i % 2 ? 980 : 210, y = i < 2 ? 470 : 630; ctx.save(); ctx.globalAlpha *= p.a; ctx.translate(0, (1 - p.sp) * 30);
      ctx.fillStyle = D.hexA(P.teal, 0.28); RR(ctx, x, y, 730, 136, 24); ctx.fill(); ctx.strokeStyle = P.teal; ctx.lineWidth = 5; ctx.stroke(); txt(ctx, s, x + 365, y + 88, 58, { align: "center", weight: 900 }); ctx.restore(); });
    D.post(c => { kepala(c, 1, "Kuasai dasarnya, bukan hanya alatnya", l); U.tagPop(c, "alat: berubah setiap beberapa bulan", 960, 416, l, tA + 0.8, { col: P.red, size: 40 }); U.tagPop(c, "dasar: tetap sama", 960, 826, l, tS, { col: P.green, size: 52 }); });
  };

  S.b7_3 = function (ctx, b, l, t) {
    const tU = D.at(b, "menguji kode"), tK = D.at(b, "kode buatanmu sendiri"), tAI = D.at(b, "kode buatan AI"), tH = D.at(b, "hampir benar");
    U.latar(ctx, t, { col: P.green, gx: 500, gy: 500 });
    U.jendela(ctx, 180, 240, 780, 540, "hasil tes");
    for (let i = 0; i < 5; i++) { const y = 372 + i * 82, a = ramp(l, tU - 0.3 + i * 0.25, 0.3); ctx.save(); ctx.globalAlpha *= a; txt(ctx, "tes " + (i + 1), 230, y + 14, 44, { weight: 800 }); ctx.fillStyle = "rgba(242,246,255,0.2)"; RR(ctx, 400, y - 14, 400, 22, 11); ctx.fill(); ctx.restore();
      if (i === 3 && l > tH) { U.silang(ctx, 890, y, 26, (l - tH) / 0.3); U.sorot(ctx, 206, y - 38, 728, 76, ramp(l, tH, 0.3), P.red); } else U.centang(ctx, 890, y, 26, (l - tU - 0.3 - i * 0.25) / 0.3); }
    [[tK, 280, "kode buatanmu sendiri", P.blue], [tAI, 470, "kode buatan AI", P.violet]].forEach(([t0, y, s, col], i) => { const a = eout(ramp(l, t0 - 0.2, 0.5)); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate((1 - a) * 60, 0); U.panel(ctx, 1100, y, 680, 150, { stroke: D.hexA(col, 0.9), lw: 5 });
      txt(ctx, s, 1440, y + 94, 52, { align: "center", weight: 900 }); U.panah(ctx, 1090, y + 75, 990, y + 75, col, ramp(l, t0, 0.5), 8); ctx.restore(); });
    D.post(c => { kepala(c, 2, "Latih kemampuan memeriksa", l); U.tagPop(c, "tes menangkap yang hampir benar", 1440, 716, l, tH, { col: P.red, size: 40 }); });
  };

  S.b7_4 = function (ctx, b, l, t) {
    const tM = D.at(b, "mempercepat"), ts = [D.at(b, "keputusan desain"), D.at(b, "keamanan"), D.at(b, "kebenaran hasilnya")];
    U.latar(ctx, t, { col: P.amber, gx: 500, gy: 500, ga: 0.22 });
    U.orang(ctx, 430, 780, 400, P.amber, ramp(l, 0.3, 0.4), { laptop: true }); if (l > 0.5) U.bip(ctx, 740, 790, 180, t, { pose: "tunjuk", target: [430, 600], mood: "happy" });
    const a = eout(ramp(l, ts[0] - 0.8, 0.5)); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; U.panel(ctx, 1000, 250, 780, 530, { stroke: D.hexA(P.amber, 0.85), lw: 4 }); txt(ctx, "Keputusan tetap kamu pegang", 1390, 330, 48, { align: "center", weight: 900, color: P.amber });
      ["desain", "keamanan", "kebenaran hasil"].forEach((s, i) => { const y = 440 + i * 116, k = ramp(l, ts[i] - 0.2, 0.3); ctx.save(); ctx.globalAlpha *= 0.3 + 0.7 * k; ctx.fillStyle = "rgba(242,246,255,0.08)"; RR(ctx, 1050, y - 50, 680, 96, 20); ctx.fill(); txt(ctx, s, 1160, y + 16, 54, { weight: 900 }); ctx.restore(); U.centang(ctx, 1100, y, 28, (l - ts[i]) / 0.3, P.amber); }); ctx.restore(); }
    D.post(c => { kepala(c, 3, "Dibantu AI, bukan digantikan AI", l); U.tagPop(c, "AI mempercepat pekerjaanmu", 560, 290, l, tM, { col: P.teal, size: 44 }); });
  };

  S.b7_5 = function (ctx, b, l, t) {
    const tB = D.at(b, "buatlah bukti"), tP = D.at(b, "Proyek nyata"), tO = D.at(b, "orang nyata"), tR = D.at(b, "ribuan pelamar");
    U.latar(ctx, t, { col: P.violet, gx: 1300, gy: 400 });
    const hi = eio(ramp(l, tB, 0.5));
    for (let i = 0; i < 18; i++) { const q = i % 6, r = Math.floor(i / 6), me = i === 11; U.orang(ctx, 190 + q * 110, 420 + r * 150, 130, me ? D.hexA(P.amber, 0.5 + 0.5 * hi) : D.hexA(P.ink2, 0.5), ramp(l, 0.3 + i * 0.03, 0.3)); }
    U.sorot(ctx, 190 + 5 * 110 - 54, 420 + 150 - 140, 108, 150, hi, P.amber);
    const a = eout(ramp(l, tP - 0.4, 0.5)); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.translate((1 - a) * 60, 0); U.panah(ctx, 810, 500, 960, 500, P.amber, a, 9); U.jendela(ctx, 1000, 250, 780, 400, "proyek nyata", { stroke: D.hexA(P.amber, 0.9) }); U.kode(ctx, 1040, 350, 700, 5, 17, 1, { lh: 44 });
      for (let i = 0; i < 6; i++) U.orang(ctx, 1090 + i * 120, 760, 96, P.green, ramp(l, tO - 0.2 + i * 0.1, 0.25)); ctx.restore(); }
    D.post(c => { kepala(c, 4, "Buat bukti", l); U.tagPop(c, "ribuan pelamar lain", 465, 800, l, tR, { col: P.ink2, size: 44 }); U.tagPop(c, "dipakai orang nyata", 1390, 820, l, tO + 0.5, { col: P.green, size: 44 }); });
  };

  S.b7_6 = function (ctx, b, l, t) {
    const tM = D.at(b, "merasa produktif"), tBug = D.at(b, "bugnya berkurang"), tF = D.at(b, "benar-benar selesai");
    U.latar(ctx, t, { col: P.blue, gx: 500, gy: 500 });
    const a = eout(ramp(l, 0.5, 0.5)); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; U.panel(ctx, 160, 250, 760, 530); const cx = 540, cy = 600, r = 230;
      ctx.lineWidth = 40; ctx.lineCap = "round"; [[Math.PI, Math.PI * 1.33, P.red], [Math.PI * 1.37, Math.PI * 1.63, P.amber], [Math.PI * 1.67, TAU, P.green]].forEach(([a0, a1, col]) => { ctx.strokeStyle = D.hexA(col, 0.8); ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1); ctx.stroke(); });
      const an = Math.PI * (1 + lerp(0.1, 0.9, eio(ramp(l, tM - 0.3, 1))) + 0.02 * Math.sin(t * 9)); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an) * r * 0.8, cy + Math.sin(an) * r * 0.8); ctx.stroke(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, TAU); ctx.fill();
      ctx.globalAlpha *= ramp(l, tM - 0.2, 0.4); txt(ctx, "terasa produktif", cx, 716, 52, { align: "center", weight: 900, color: P.amber }); ctx.restore(); }
    const a2 = eout(ramp(l, tBug - 1.2, 0.5)); if (a2 > 0) { ctx.save(); ctx.globalAlpha *= a2; U.panel(ctx, 1000, 250, 780, 530, { stroke: D.hexA(P.green, 0.85), lw: 4 }); txt(ctx, "Lihatlah hasilnya", 1390, 340, 54, { align: "center", weight: 900, color: P.green });
      [["Bug berkurang?", tBug], ["Fitur benar-benar selesai?", tF]].forEach(([s, t0], i) => { const y = 480 + i * 150; ctx.save(); ctx.globalAlpha *= 0.3 + 0.7 * ramp(l, t0 - 0.2, 0.3); ctx.strokeStyle = "rgba(242,246,255,0.6)"; ctx.lineWidth = 5; RR(ctx, 1060, y - 34, 68, 68, 14); ctx.stroke(); txt(ctx, s, 1160, y + 16, 46, { weight: 900, fit: 590 }); ctx.restore(); U.centang(ctx, 1094, y, 26, (l - t0 - 0.4) / 0.3); }); ctx.restore(); }
    D.post(c => kepala(c, 5, "Ukur, jangan hanya merasa", l));
  };

  function kartuPeta(ctx, x, y, w, h, l, t) {
    ctx.save(); RR(ctx, x, y, w, h, 30); ctx.clip(); const gr = ctx.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, "#1D2A66"); gr.addColorStop(1, "#3B2E78"); ctx.fillStyle = gr; ctx.fillRect(x, y, w, h);
    const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([x + w * 0.08 + u * w * 0.84, y + h * 0.8 - u * h * 0.16 + Math.sin(u * 9) * h * 0.05]); }
    U.garis(ctx, pts, eio(ramp(l, 0, 2.5)), P.amber, 8, { dash: [4, 18] }); for (let i = 0; i < 5; i++) { const p = pts[i * 10]; if (ramp(l, 0, 2.5) > i / 5) U.titik(ctx, p[0], p[1], 15, COL[i]); }
    txt(ctx, "Mau Jadi Software Engineer", x + w / 2, y + h * 0.24, w * 0.064, { align: "center", weight: 900 }); txt(ctx, "di Era AI?", x + w / 2, y + h * 0.4, w * 0.064, { align: "center", weight: 900, color: P.amber }); txt(ctx, "Ini Peta Lengkapnya", x + w / 2, y + h * 0.54, w * 0.056, { align: "center", weight: 800, color: P.ink2 });
    ctx.restore(); ctx.strokeStyle = D.hexA("#FFFFFF", 0.45); ctx.lineWidth = 4; RR(ctx, x, y, w, h, 30); ctx.stroke();
  }
  S.b7_7 = function (ctx, b, l, t) {
    const tP = D.at(b, "peta langkah"), tT = D.at(b, "tonton video"), tL = D.at(b, "Link-nya");
    U.latar(ctx, t, { col: P.amber, gx: 960, gy: 500, ga: 0.25 });
    const a = eout(ramp(l, tT - 0.5, 0.6)); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - a) * 40); kartuPeta(ctx, 480, 240, 960, 500, l - tT + 0.5, t); ctx.restore(); }
    U.bip(ctx, 1650, 800, 170, t, { pose: "tunjuk", target: [1200, 500], mood: "happy" });
    D.post(c => { U.judulPop(c, "Peta langkah demi langkah sampai kerja pertama", 960, 140, 58, l, tP - 0.3, { col: P.amber }); U.tagPop(c, "link ada di layar dan di deskripsi", 960, 808, l, tL, { col: P.teal, size: 48 }); });
  };

  S.b7_8 = function (ctx, b, l, t) {
    const tC = D.at(b, "paling cepat mengetik"), tM = D.at(b, "milik orang"), tP = D.at(b, "paling paham"), tB = D.at(b, "berani bertanggung jawab");
    U.latar(ctx, t, { col: P.amber, gx: 960, gy: 540, ga: 0.3 });
    const L = (s, y, size, col, t0, o = {}) => { const a = eout(ramp(l, t0 - 0.2, 0.6)) * (o.a == null ? 1 : o.a); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; txt(ctx, s, 960, y + (1 - eout(ramp(l, t0 - 0.2, 0.6))) * 24, size, { align: "center", weight: 900, color: col, fit: 1700 }); ctx.restore(); };
    const dim = 1 - 0.6 * ramp(l, tM - 0.2, 0.5);
    L("Masa depan software engineer", 240, 56, P.ink2, 0.3); L("bukan tentang siapa yang paling cepat mengetik kode.", 330, 58, P.ink, tC - 1.2, { a: dim });
    L("Masa depan itu milik orang yang", 480, 60, P.ink, tM); L("paling paham apa yang sedang dibangun,", 590, 84, P.amber, tP); L("dan berani bertanggung jawab atas hasilnya.", 720, 68, P.teal, tB);
  };

  // catatan naskah + layar akhir
  const SUB = { x: 440, y: 300, r: 118 }, SLOT = { x: 1060, y: 236, w: 760, h: 428 };
  S.b7_9 = function (ctx, b, l, t) {
    const tAI = D.at(b, "bantuan AI"), tCl = D.at(b, "Claude"), tF = D.at(b, "diperiksa faktanya"), tS = D.at(b, "disunting"), tD = D.at(b, "Semua sumber"), tEnd = D.speechEnd(b) + 1.0;
    U.latar(ctx, t, { col: P.violet, gx: 960, gy: 420, ga: 0.3 });
    const ca = eout(ramp(l, 0.2, 0.6)) * (1 - ramp(l, tEnd, 0.6));
    if (ca > 0) D.post(c => { c.save(); c.globalAlpha *= ca; c.fillStyle = "#FFF6E6"; RR(c, 360, 150, 1200, 690, 34); c.fill(); c.fillStyle = "#FFB547"; RR(c, 360, 150, 1200, 110, 34); c.fill(); c.fillRect(360, 220, 1200, 40);
      txt(c, "Catatan tentang naskah video ini", 960, 225, 52, { align: "center", weight: 900, color: "#2A2350" });
      [[tAI, "disusun dengan bantuan AI", 360], [tF, "diperiksa faktanya", 520], [tS, "disunting oleh manusia", 640], [tD, "semua sumber data ada di deskripsi", 760]].forEach(([t0, s, y], i) => { const a = ramp(l, t0 - 0.2, 0.4); c.save(); c.globalAlpha *= 0.25 + 0.75 * a; c.fillStyle = COL[i]; c.beginPath(); c.arc(470, y - 16, 22, 0, TAU); c.fill(); txt(c, s, 530, y, 52, { weight: 900, color: "#2A2350" }); c.restore();
        if (i === 0) { c.save(); c.globalAlpha *= ramp(l, tCl - 0.1, 0.4); txt(c, "termasuk Claude buatan Anthropic", 530, y + 60, 44, { weight: 700, color: "#5A5280" }); c.restore(); } });
      c.restore(); });
    const ea = eout(ramp(l, tEnd + 0.4, 0.8)); if (ea <= 0) return; const le = l - tEnd - 0.4;
    ctx.save(); ctx.globalAlpha *= ea; ctx.translate(0, (1 - ea) * 30);
    D.glow(ctx, SUB.x, SUB.y, SUB.r * 2, P.teal, 0.3 + 0.1 * Math.sin(t * 2)); for (let i = 0; i < 2; i++) { const ph = (t * 0.4 + i / 2) % 1; ctx.strokeStyle = D.hexA(P.teal, 0.5 * (1 - ph)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(SUB.x, SUB.y, SUB.r * (1.08 + 0.35 * ph), 0, TAU); ctx.stroke(); }
    ctx.fillStyle = "#1B2457"; ctx.beginPath(); ctx.arc(SUB.x, SUB.y, SUB.r, 0, TAU); ctx.fill(); ctx.strokeStyle = P.teal; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = "rgba(12,18,56,0.94)"; RR(ctx, SUB.x - 320, SUB.y + SUB.r + 22, 640, 154, 34); ctx.fill();
    txt(ctx, "I Teach", SUB.x, SUB.y + SUB.r + 76, 56, { align: "center", weight: 900, color: P.warm }); txt(ctx, "Software Engineering", SUB.x, SUB.y + SUB.r + 142, 52, { align: "center", weight: 900, color: "#FFFFFF" });
    D.label(ctx, "Tonton berikutnya: peta lengkapnya", SLOT.x + SLOT.w / 2, SLOT.y - 62, { size: 40, col: P.amber });
    kartuPeta(ctx, SLOT.x, SLOT.y, SLOT.w, SLOT.h, le, t); ctx.restore();
    U.tagPop(ctx, "youtube.com/@iTeachSWE", SUB.x, SUB.y + SUB.r + 250, l, tEnd + 1.2, { col: P.teal, size: 46 });
    U.tagPop(ctx, "semua sumber data ada di deskripsi", SLOT.x + SLOT.w / 2, SLOT.y + SLOT.h + 90, l, tEnd + 1.6, { col: P.violet, size: 40 });
    U.bip(ctx, 440, 800, 120, t, { pose: "diam", mood: "happy", wave: 1 });
  };

  U.reg(7, S);
})(typeof window !== "undefined" ? window : globalThis);
