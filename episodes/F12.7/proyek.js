/* Pembantu gambar F12.7: kartu masalah, papan tugas tiga kolom, garis tahap proyek beserta episode rujukannya,
   daftar periksa portofolio. Tim dan produk fiktif. Muat setelah kiko-core.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card } = H;
  const Pr = {};
  Pr.TAHAP = [["🔍", "masalah", "F11.4"], ["📋", "kebutuhan", "F11.1"], ["🗂️", "desain data", "F12.1"], ["💻", "membangun", "F11.2"], ["🧪", "menguji", "F11.3"], ["🔧", "memelihara", "F11.1"], ["🎤", "pameran", "F12.6"]];
  // garis tahap: active indeks, opt {n}
  Pr.steps = function (ctx, x, y, w, active, opt = {}) {
    const n = Pr.TAHAP.length, gap = (w - 140) / (n - 1);
    ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x + 70, y + 60); ctx.lineTo(x + 70 + gap * (n - 1), y + 60); ctx.stroke();
    Pr.TAHAP.forEach(([ic, t, ep], i) => { const cx = x + 70 + i * gap; const on = i === active, done = active != null && i < active; ctx.save(); if (opt.n != null && i >= opt.n) ctx.globalAlpha = 0.2; ctx.beginPath(); ctx.arc(cx, y + 60, 50, 0, Math.PI * 2); ctx.fillStyle = on ? "#FFF3D6" : done ? C.goodBg : "#fff"; ctx.fill(); ctx.strokeStyle = on ? C.accent : done ? C.good : C.kiko; ctx.lineWidth = on ? 6 : 4; ctx.stroke(); text(ctx, ic, cx, y + 76, 40, { align: "center" }); text(ctx, t, cx, y + 145, 21, { align: "center", weight: 900 }); if (opt.ep !== false) text(ctx, ep, cx, y + 175, 18, { align: "center", weight: 800, color: C.kiko }); ctx.restore(); });
  };
  // kartu masalah (kertas tempel): teks, warna, nilai [✓/✕ ×3]
  Pr.note = function (ctx, x, y, s, opt = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(opt.rot || 0); ctx.fillStyle = opt.fill || "#FFF3B0"; ctx.shadowColor = "rgba(0,0,0,0.12)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4; ctx.fillRect(-120, -80, 240, 160); ctx.shadowColor = "transparent";
    para(ctx, s, 0, -30, 22, 210, { align: "center", weight: 900 }); if (opt.marks) text(ctx, opt.marks, 0, 60, 24, { align: "center", weight: 900, color: opt.win ? C.good : C.bad });
    if (opt.win) { ctx.strokeStyle = C.good; ctx.lineWidth = 6; ctx.strokeRect(-126, -86, 252, 172); }
    ctx.restore();
  };
  // papan tugas: cols [[judul, [kartu]]]; opt {hl: [kolom, indeks]}
  Pr.kanban = function (ctx, x, y, w, h, cols, opt = {}) {
    const cw = (w - 40) / 3, col = [C.ink2, C.accentDark, C.good], bg = ["#F4F8FB", "#FFF8E6", C.goodBg];
    cols.forEach(([t, cards], i) => { const cx = x + i * (cw + 20); card(ctx, cx, y, cw, h, { fill: bg[i], stroke: col[i], lw: 3, r: 16 }); text(ctx, t, cx + cw / 2, y + 42, 26, { align: "center", weight: 900, color: col[i] });
      cards.forEach((c, j) => { const on = opt.hl && opt.hl[0] === i && opt.hl[1] === j; card(ctx, cx + 16, y + 64 + j * 72, cw - 32, 60, { fill: "#fff", stroke: on ? C.accent : "#D7E2DC", lw: on ? 4 : 2, r: 10 }); text(ctx, c, cx + 34, y + 102 + j * 72, 20, { weight: 800 }); }); });
  };
  // daftar periksa: items [teks]; n tercentang
  Pr.check = function (ctx, x, y, w, items, n, opt = {}) {
    const gap = opt.gap || 62; items.forEach((s, i) => { const on = i < n; card(ctx, x, y + i * gap, w, gap - 10, { fill: on ? C.goodBg : "#fff", stroke: on ? C.good : "#D7E2DC", lw: 2, r: 10 }); ctx.strokeStyle = on ? C.good : "#B7C4CC"; ctx.lineWidth = 3; rr(ctx, x + 16, y + i * gap + (gap - 10) / 2 - 13, 26, 26, 6); ctx.stroke(); if (on) text(ctx, "✓", x + 29, y + i * gap + (gap - 10) / 2 + 10, 24, { align: "center", weight: 900, color: C.good }); text(ctx, s, x + 58, y + i * gap + (gap - 10) / 2 + 8, opt.size || 22, { weight: 800 }); });
  };
  K.proyek = Pr;
})(typeof window !== "undefined" ? window : globalThis);
