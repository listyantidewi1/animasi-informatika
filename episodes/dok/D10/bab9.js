/* D10 bab 9 — LEVEL 7: Pelajaran untuk programmer (b7_1 … b7_6, b7_99). Lapisan dan antarmuka, lapisan boleh diganti,
   seratus tempat vs satu pintu, rangkuman, pertanyaan komentar, catatan naskah + layar akhir. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, TAU = Math.PI * 2;

  S.b7_1 = function (ctx, b, l, t) {
    const tSatu = D.at(b, "satu pelajaran besar"), tCara = D.at(b, "tentang cara");
    K.kota3d.draw(ctx, t, { z: 200 + t * 5, dim: 0.5, sway: 0.4 });
    U.neonPop(ctx, "SATU PELAJARAN BESAR", W / 2, 480, 110, N.gold, l, tSatu - 0.3, { align: "center" });
    D.post(c => U.judulPop(c, "tentang cara perangkat lunak dibangun", W / 2, 620, 60, l, tCara - 0.2, { col: N.cyan }));
  };
  const LAP = [["Program", N.pink, "Sebuah program"], ["Sistem operasi", N.violet, "sistem operasi"], ["Driver", N.cyan, "driver"], ["Perangkat keras", N.green, "perangkat keras"]];
  S.b7_2 = function (ctx, b, l, t) {
    const tAnt = D.at(b, "antarmuka"), tGar = D.at(b, "Garis batas");
    U.ruang(ctx, t, { col: N.violet, gx: 860, gy: 480 });
    LAP.forEach(([s, col, ph], i) => { const p = U.pop(l, i ? D.at(b, ph) - 0.2 : 0.3); if (p.a <= 0.01) return; ctx.save(); ctx.translate(0, (1 - p.sp) * 30); X.kotak(ctx, 360, 264 + i * 138, 900, 104, s, col, { a: p.a, size: 50 }); ctx.restore(); });
    const k = ramp(l, tGar - 0.2, 0.5); if (k > 0) { ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = N.gold; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.shadowColor = N.gold; ctx.shadowBlur = 14; [0, 1, 2].forEach(i => { const y = 264 + i * 138 + 121; ctx.beginPath(); ctx.moveTo(330, y); ctx.lineTo(330 + 1000 * k, y); ctx.stroke(); }); ctx.restore(); }
    const pa = U.pop(l, tAnt - 0.2); if (pa.a > 0) { ctx.save(); ctx.globalAlpha *= pa.a; [0, 1, 2].forEach(i => U.panah(ctx, 1440, 540, 1344, 264 + i * 138 + 121, N.gold, 1, 6)); X.kotak(ctx, 1440, 480, 370, 120, "antarmuka", N.gold, { size: 56, tcol: N.gold }); ctx.restore(); }
    X.judul(ctx, "Sebuah program tidak pernah berdiri sendirian", l, 0.2, N.violet);
  };
  function tumpuk(ctx, x, l, atas, b1, b2, sw, colA, a, ket) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; X.kotak(ctx, x, 290, 740, 116, atas, colA, { size: 50 });
    ctx.strokeStyle = N.gold; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.moveTo(x - 10, 446); ctx.lineTo(x + 750, 446); ctx.stroke(); ctx.setLineDash([]);
    X.kotak(ctx, x - sw * 40, 486, 740, 116, b1, N.violet, { a: 1 - sw, size: 46 }); X.kotak(ctx, x + (1 - sw) * 40, 486, 740, 116, b2, N.green, { a: sw, size: 46 });
    txt(ctx, ket, x + 370, 682, 44, { align: "center", weight: 800, color: N.ink2, fit: 740 }); ctx.restore(); }
  S.b7_3 = function (ctx, b, l, t) {
    const tGan = D.at(b, "boleh diganti"), tMod = D.at(b, "dilakukan modder"), tKamu = D.at(b, "kamu lakukan");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 420 });
    tumpuk(ctx, 150, l, "Game", "sistem Xbox asli", "sistem Xbox tiruan", eio(ramp(l, tMod - 0.2, 0.8)), N.pink, ramp(l, 0.3, 0.4), "yang dilakukan modder");
    tumpuk(ctx, 1030, l, "Kode aplikasimu", "modul lama", "modul baru", eio(ramp(l, tKamu + 0.6, 0.8)), N.cyan, ramp(l, tKamu - 0.3, 0.4), "yang kamu lakukan di kode yang rapi");
    X.judul(ctx, "Selama antarmukanya tetap sama …", l, 0.2, N.gold, { a: 1 - ramp(l, tGan - 0.3, 0.3) });
    X.judul(ctx, "… lapisan di bawahnya boleh diganti", l, tGan - 0.1, N.gold);
    X.bawah(ctx, "garis putus-putus = antarmuka yang dijaga tetap sama", l, 1.2, N.gold, { size: 44 });
  };
  S.b7_4 = function (ctx, b, l, t) {
    const tSer = D.at(b, "seratus tempat yang berbeda"), tBong = D.at(b, "membongkar seratus"), tPin = D.at(b, "satu pintu"), tCuk = D.at(b, "kamu cukup");
    U.ruang(ctx, t, { col: N.cyan, gx: 960, gy: 440 });
    // kiri: banyak jalur langsung
    const a1 = ramp(l, 0.3, 0.4); ctx.save(); ctx.globalAlpha *= a1; X.kotak(ctx, 130, 330, 300, 320, "Aplikasi", N.pink, { size: 46 }); I.db(ctx, 760, 490, 210, l > tBong - 0.2 ? N.red : N.cyan);
    const n = 12, kk = ramp(l, tSer - 0.6, 1.2); for (let i = 0; i < n; i++) { if (i / n > kk) break; const y = 350 + i * 25.5; ctx.strokeStyle = D.hexA(l > tBong - 0.2 ? N.red : N.cyan, 0.75); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(432, y); ctx.lineTo(680, 440 + i * 9); ctx.stroke(); }
    ctx.restore();
    const pb = U.pop(l, tBong - 0.2); if (pb.a > 0) { ctx.save(); ctx.globalAlpha *= pb.a; txt(ctx, "seratus tempat harus dibongkar", 500, 740, 46, { align: "center", weight: 900, color: N.red, fit: 760 }); ctx.restore(); }
    // kanan: lewat satu pintu
    const a2 = ramp(l, tPin - 0.6, 0.4); if (a2 > 0) { ctx.save(); ctx.globalAlpha *= a2; X.kotak(ctx, 1010, 330, 300, 320, "Aplikasi", N.pink, { size: 46 }); I.pintu(ctx, 1470, 490, 240, N.gold); I.db(ctx, 1700, 490, 190, l > tCuk + 0.4 ? N.green : N.cyan);
      for (let i = 0; i < n; i++) { const y = 350 + i * 25.5; ctx.strokeStyle = D.hexA(N.gold, 0.7); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1312, y); ctx.lineTo(1404, 490); ctx.stroke(); }
      ctx.strokeStyle = N.gold; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1534, 490); ctx.lineTo(1636, 490); ctx.stroke(); ctx.restore();
      const pc = U.pop(l, tCuk - 0.1); if (pc.a > 0) { ctx.save(); ctx.globalAlpha *= pc.a; txt(ctx, "cukup ganti isi di balik pintu", 1410, 740, 46, { align: "center", weight: 900, color: N.green, fit: 760 }); ctx.restore(); } }
    const d = ramp(l, tPin - 0.6, 0.4); if (d > 0) { ctx.save(); ctx.globalAlpha *= d * 0.5; ctx.strokeStyle = N.ink2; ctx.lineWidth = 3; ctx.setLineDash([10, 12]); ctx.beginPath(); ctx.moveTo(960, 290); ctx.lineTo(960, 780); ctx.stroke(); ctx.restore(); }
    X.judul(ctx, "Seratus tempat, atau satu pintu?", l, 0.2, N.cyan);
  };
  S.b7_5 = function (ctx, b, l, t) {
    U.ruang(ctx, t, { col: N.green, gx: 960, gy: 420 });
    X.daftar(ctx, b, l, 310, 262, 1300, [{ ph: "belum bisa dimainkan", s: "Port GTA 6 untuk PC belum bisa dimainkan", col: N.red, tanda: "silang" }, { ph: "sudah menghilang", s: "Proyek terbesarnya sudah menghilang", col: N.red, tanda: "silang" }, { ph: "tekniknya memang ada", s: "Tetapi tekniknya memang ada", col: N.green }], { rh: 108 });
    [["compiler", N.cyan, 480], ["sistem operasi", N.pink, 960], ["antarmuka", N.gold, 1440]].forEach(([s, col, x]) => U.tag(ctx, s, x, 690, l, D.at(b, s === "compiler" ? "yaitu compiler" : s === "antarmuka" ? "dan antarmuka" : "sistem operasi") - 0.1, { col, size: 54 }));
    X.judul(ctx, "Jadi, apa yang kita bawa pulang?", l, 0.2, N.green);
    X.bawah(ctx, "Konsep yang dipelajari di setiap kelas pemrograman", l, D.at(b, "konsep yang dipelajari") - 0.2, N.ink2, { size: 44 });
  };
  S.b7_6 = function (ctx, b, l, t) {
    const tTul = D.at(b, "Tulis pendapatmu");
    K.kota3d.draw(ctx, t, { z: 260 + t * 4, dim: 0.6, sway: 0.4 });
    const p = U.pop(l, 0.3); D.post(c => { if (p.a <= 0.01) return; c.save(); c.globalAlpha *= p.a; U.panel(c, 260, 270, 1400, 440, { col: N.gold, fill: "rgba(16,8,38,0.94)" }); U.neon(c, "MENURUT KAMU?", 960, 360, 60, N.gold, { align: "center" });
      X.para(c, "Apakah rekompilasi game oleh penggemar seharusnya diperbolehkan kalau pemainnya sudah membeli game itu?", 960, 460, 54, 1280, { align: "center", weight: 900 }); c.restore(); });
    X.bawah(ctx, "Tulis pendapatmu di kolom komentar", l, tTul - 0.2, N.cyan, { y: 810, size: 54 });
  };
  const SUB = { x: 440, y: 300, r: 118 }, SLOT = { x: 1060, y: 236, w: 760, h: 428 }, COL = [N.cyan, N.green, N.gold, N.violet];
  S.b7_99 = function (ctx, b, l, t) {
    const tAI = D.at(b, "bantuan AI"), tCl = D.at(b, "Claude"), tF = D.at(b, "diperiksa faktanya"), tS = D.at(b, "disunting"), tD = D.at(b, "Semua sumber"), tEnd = D.speechEnd(b) + 1.0;
    K.kota3d.draw(ctx, t, { z: 300 + t * 4, dim: 0.55, sway: 0.4 });
    const ca = eout(ramp(l, 0.2, 0.6)) * (1 - ramp(l, tEnd, 0.6));
    if (ca > 0) D.post(c => { c.save(); c.globalAlpha *= ca; U.panel(c, 360, 170, 1200, 660, { col: N.violet, fill: "rgba(16,8,38,0.94)" });
      U.neon(c, "CATATAN TENTANG NASKAH", 960, 270, 60, N.violet, { align: "center" });
      [[tAI, "disusun dengan bantuan AI", 380], [tF, "diperiksa faktanya", 520], [tS, "disunting oleh manusia", 620], [tD, "semua sumber ada di deskripsi", 720]].forEach(([t0, s, y], i) => { const a = ramp(l, t0 - 0.2, 0.4); c.save(); c.globalAlpha *= 0.25 + 0.75 * a;
        U.centang(c, 470, y - 16, 40, a, COL[i]); txt(c, s, 530, y, 52, { weight: 900 }); if (i === 0) { c.globalAlpha *= ramp(l, tCl - 0.1, 0.4); txt(c, "termasuk Claude buatan Anthropic", 530, y + 60, 44, { weight: 700, color: N.ink2 }); } c.restore(); });
      c.restore(); });
    const ea = eout(ramp(l, tEnd + 0.4, 0.8)); if (ea <= 0) return;
    ctx.save(); ctx.globalAlpha *= ea; ctx.translate(0, (1 - ea) * 30);
    D.glow(ctx, SUB.x, SUB.y, SUB.r * 2, N.pink, 0.3 + 0.1 * Math.sin(t * 2)); for (let i = 0; i < 2; i++) { const ph = (t * 0.4 + i / 2) % 1; ctx.strokeStyle = D.hexA(N.pink, 0.5 * (1 - ph)); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(SUB.x, SUB.y, SUB.r * (1.08 + 0.35 * ph), 0, TAU); ctx.stroke(); }
    ctx.fillStyle = "#1A0E36"; ctx.beginPath(); ctx.arc(SUB.x, SUB.y, SUB.r, 0, TAU); ctx.fill(); ctx.strokeStyle = N.pink; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = "rgba(14,6,34,0.94)"; RR(ctx, SUB.x - 320, SUB.y + SUB.r + 22, 640, 154, 34); ctx.fill();
    txt(ctx, "I Teach", SUB.x, SUB.y + SUB.r + 76, 56, { align: "center", weight: 900, color: N.gold }); txt(ctx, "Software Engineering", SUB.x, SUB.y + SUB.r + 142, 52, { align: "center", weight: 900, color: "#FFFFFF" });
    U.panel(ctx, SLOT.x, SLOT.y, SLOT.w, SLOT.h, { col: N.cyan, fill: "rgba(14,6,34,0.7)" }); U.neon(ctx, "VIDEO SEBELUMNYA", SLOT.x + SLOT.w / 2, SLOT.y + SLOT.h / 2 + 20, 64, N.cyan, { align: "center" });
    ctx.restore();
    U.tag(ctx, "youtube.com/@iTeachSWE", SUB.x, SUB.y + SUB.r + 250, l, tEnd + 1.2, { col: N.pink, size: 46 });
    U.tag(ctx, "sumber lengkap ada di deskripsi", SLOT.x + SLOT.w / 2, SLOT.y + SLOT.h + 90, l, tEnd + 1.6, { col: N.violet, size: 40 });
    U.neon(ctx, "LEVEL SELESAI. SAMPAI JUMPA DI VIDEO BERIKUTNYA!", W / 2, 880, 50, N.gold, { align: "center", a: ramp(l, tEnd + 2, 0.6), fit: 1640 });
  };
  S.b7_99.noCam = true;
  X.reg(9, S);
})(typeof window !== "undefined" ? window : globalThis);
