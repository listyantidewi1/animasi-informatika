/* D12 bab 6 — penutup (b6_1 … b6_4) + layar akhir (b6_99). */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d12, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U, W = 1920, HH = 1080, TAU = Math.PI * 2;
  const S = {};

  S.b6_1 = function (ctx, b, l, t) {
    const tB = U.at(b, "Browser adalah"), tS = U.at(b, "setiap beberapa minggu");
    U.judul(ctx, "Bukan yang pertama, bukan yang terakhir", l, 0.2, { y: 150, col: C.php });
    ctx.save(); ctx.beginPath(); ctx.rect(0, 210, W, 600); ctx.clip();
    for (let i = 0; i < 12; i++) { const x = 120 + ((i * 440 - l * 150) % (12 * 440) + 12 * 440) % (12 * 440) - 440, y = 300 + (i % 2) * 250; U.kotak(ctx, x, y, 400, 210, "", { col: i % 3 ? C.php : C.amber }); T(ctx, "PEMBARUAN KEAMANAN", x + 30, y + 60, 26, { weight: 800, color: i % 3 ? C.php : C.amber, spacing: 3 }); T(ctx, "versi baru", x + 30, y + 120, 44, { mono: true, weight: 700 }); T(ctx, "beberapa celah ditambal", x + 30, y + 170, 30, { weight: 600, color: C.text2 }); }
    ctx.restore();
    U.muncul(ctx, l, tB, 960, 900, () => U.pill(ctx, l > tS ? "setiap beberapa minggu ada lubang baru yang ditambal" : "browser: salah satu program paling rumit di perangkatmu", 960, 900, { size: 42, col: C.amber }));
  };

  S.b6_2 = function (ctx, b, l, t) {
    const tN = U.at(b, "nomor versi"), tK = U.at(b, "melainkan kebiasaan"), tR = U.at(b, "Ketika browser"), tJ = U.at(b, "jangan menundanya"), k = ramp(l, tK, 0.4);
    U.muncul(ctx, l, tN - 0.3, 960, 300, () => { ctx.save(); ctx.globalAlpha *= lerp(1, 0.3, k); U.versi(ctx, "158.0.8127.88", 960, 320, 110, null, 0); ctx.restore(); U.silang(ctx, 960, 290, 150, ramp(l, tK - 0.5, 0.3), C.text2); });
    U.judul(ctx, "Kebiasaan.", l, tK, { y: 520, size: 150, col: C.term });
    U.muncul(ctx, l, tR, 700, 800, () => U.tombol(ctx, "Luncurkan Ulang", 700, 800, { size: 52, col: C.amber, glow: 0.4 + 0.3 * Math.sin(t * 5) }));
    U.muncul(ctx, l, tJ - 0.2, 1300, 800, () => { U.tombol(ctx, "Nanti saja", 1300, 800, { size: 52, col: C.lokBebas, color: C.text2 }); U.silang(ctx, 1300, 800, 130, ramp(l, tJ + 0.2, 0.3)); });
  };

  S.b6_3 = function (ctx, b, l, t) {
    const tS = U.at(b, "Satu pemeriksaan"), tJ = U.at(b, "Jangan pernah percaya");
    U.judul(ctx, "Untuk yang sedang belajar membuat software", l, 0.3, { y: 150, col: C.php });
    U.loket(ctx, { masuk: ramp(l, 0.6, 0.8), sorot: ramp(l, tS, 0.4), cap: "DITOLAK", capCol: C.red, capU: l > tS + 1.2 ? 1 : 0, capL: l, capT: tS + 1.2 });
    U.muncul(ctx, l, tJ, 960, 920, () => U.pill(ctx, "jangan percaya begitu saja kepada data dari luar", 960, 920, { size: 44, col: C.term, fill: "rgba(11,11,13,0.96)" }));
  };

  S.b6_4 = function (ctx, b, l, t) {
    const tK = U.at(b, "grup keluarga"), tC = U.at(b, "grup kelasmu"), tS = U.at(b, "satu perangkat"), tJ = U.at(b, "Sampai jumpa");
    U.judul(ctx, "Bagikan video ini", l, 0.2, { y: 170, size: 80, col: C.amber });
    [[tK, "Grup Keluarga", 560], [tC, "Grup Kelas", 1360]].forEach(([t0, s, cx]) => U.muncul(ctx, l, t0 - 0.2, cx, 540, () => { U.kotak(ctx, cx - 320, 280, 640, 500, "", { col: C.php, fill: "rgba(18,17,21,0.96)" }); T(ctx, s, cx - 280, 350, 44, { weight: 900 }); ctx.fillStyle = C.line; ctx.fillRect(cx - 320, 380, 640, 3);
      ctx.fillStyle = C.termDim; U.rr(ctx, cx - 60, 420, 350, 230, 20); ctx.fill(); ctx.fillStyle = C.termBg; U.rr(ctx, cx - 40, 440, 310, 130, 12); ctx.fill(); ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(cx + 95, 480); ctx.lineTo(cx + 145, 505); ctx.lineTo(cx + 95, 530); ctx.closePath(); ctx.fill(); T(ctx, "Update Chrome-mu, ya", cx - 40, 620, 28, { weight: 700 }); }));
    U.muncul(ctx, l, tS, 960, 880, () => U.pill(ctx, "satu perangkat yang belum diperbarui = pintu masuk", 960, 880, { size: 42, col: C.red }));
  };

  const SUB = { x: 440, y: 300, r: 118 }, SLOT = { x: 1060, y: 236, w: 760, h: 428 };
  S.b6_99 = function (ctx, b, l, t) {
    const tAI = U.at(b, "bantuan AI"), tCl = U.at(b, "Claude"), tF = U.at(b, "diperiksa faktanya"), tS = U.at(b, "disunting"), tD = U.at(b, "Semua sumber"), tEnd = D.speechEnd(b) + 1.0;
    const ca = eout(ramp(l, 0.2, 0.6)) * (1 - ramp(l, tEnd, 0.6));
    if (ca > 0) { ctx.save(); ctx.globalAlpha *= ca; U.kotak(ctx, 360, 170, 1200, 660, "", { col: C.php, fill: "rgba(18,17,21,0.96)" });
      T(ctx, "// catatan tentang naskah", 960, 270, 52, { align: "center", mono: true, weight: 700, color: C.php });
      [[tAI, "disusun dengan bantuan AI", 390], [tF, "diperiksa faktanya", 530], [tS, "disunting oleh manusia", 630], [tD, "semua sumber ada di deskripsi", 730]].forEach(([t0, s, y], i) => { const a = ramp(l, t0 - 0.2, 0.4);
        ctx.save(); ctx.globalAlpha *= 0.3 + 0.7 * a; U.centang(ctx, 470, y - 16, 40, a, C.term); T(ctx, s, 530, y, 50, { weight: 800 });
        if (i === 0) { ctx.globalAlpha *= ramp(l, tCl - 0.1, 0.4); T(ctx, "termasuk Claude buatan Anthropic", 530, y + 58, 40, { weight: 600, color: C.text2 }); } ctx.restore(); });
      ctx.restore(); }
    const ea = eout(ramp(l, tEnd + 0.4, 0.8)); if (ea <= 0) return;
    ctx.save(); ctx.globalAlpha *= ea; ctx.translate(0, (1 - ea) * 30);
    X.glow(ctx, SUB.x, SUB.y, SUB.r * 2, C.php, 0.3 + 0.1 * Math.sin(t * 2));
    ctx.fillStyle = C.win; ctx.beginPath(); ctx.arc(SUB.x, SUB.y, SUB.r, 0, TAU); ctx.fill(); ctx.strokeStyle = C.php; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = C.panel; U.rr(ctx, SUB.x - 320, SUB.y + SUB.r + 22, 640, 154, 34); ctx.fill();
    T(ctx, "I Teach", SUB.x, SUB.y + SUB.r + 76, 56, { align: "center", weight: 900, color: C.amber }); T(ctx, "Software Engineering", SUB.x, SUB.y + SUB.r + 142, 52, { align: "center", weight: 900, color: C.white });
    U.kotak(ctx, SLOT.x, SLOT.y, SLOT.w, SLOT.h, "", { col: C.php, fill: "rgba(18,17,21,0.7)" }); T(ctx, "VIDEO BERIKUTNYA", SLOT.x + SLOT.w / 2, SLOT.y + SLOT.h / 2 + 20, 60, { align: "center", weight: 900, color: C.php });
    ctx.restore();
    if (l > tEnd + 1.2) U.pill(ctx, "youtube.com/@iTeachSWE", SUB.x, SUB.y + SUB.r + 250, { size: 44, col: C.php });
    if (l > tEnd + 1.6) U.pill(ctx, "sumber lengkap ada di deskripsi", SLOT.x + SLOT.w / 2, SLOT.y + SLOT.h + 90, { size: 40, col: C.text2 });
    if (l > tEnd + 2) T(ctx, "//", W / 2, 900, 64, { align: "center", mono: true, weight: 700, color: C.php });
  };
  S.b6_99.noCam = true;

  U.reg(6, S);
})(typeof window !== "undefined" ? window : globalThis);
