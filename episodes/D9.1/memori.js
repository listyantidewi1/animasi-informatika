/* Pembantu gambar D9.1: papan memori (kotak variabel bernama), daftar bernomor (larik), kotak kardus unplugged, kartu angka, gelas air,
   penanda putaran. Muat setelah kiko-core.js, kiko-devices.js, dan alur.js (D8.3). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, clamp } = H;
  const Q = {};
  // papan memori: vars = [{name, value, changed, hl}]
  Q.board = function (ctx, x, y, w, vars, opt = {}) {
    const bw = opt.bw || 180, bh = opt.bh || 120, gap = 24; const h = opt.h || bh + 90;
    card(ctx, x, y, w, h, { fill: "#1F2A33", r: 18 }); text(ctx, opt.title || "PAPAN MEMORI", x + 20, y + 36, 22, { weight: 900, color: "#8FD0E6" });
    vars.forEach((v, i) => { const bx = x + 20 + i * (bw + gap), by = y + 56; ctx.fillStyle = v.changed ? "#FFF3D6" : "#FFFFFF"; rr(ctx, bx, by, bw, bh, 12); ctx.fill(); ctx.strokeStyle = v.changed ? C.accent : v.hl ? C.kikoLight : "#4A5A66"; ctx.lineWidth = v.changed || v.hl ? 5 : 2; rr(ctx, bx, by, bw, bh, 12); ctx.stroke(); ctx.fillStyle = C.kiko; rr(ctx, bx, by, bw, 34, 12); ctx.fill(); ctx.fillRect(bx, by + 17, bw, 17); text(ctx, v.name, bx + bw / 2, by + 24, 20, { align: "center", weight: 900, color: "#fff" }); text(ctx, v.value == null ? "?" : String(v.value), bx + bw / 2, by + bh / 2 + 30, Math.min(44, bw * 0.3), { align: "center", weight: 900, color: v.changed ? C.accentDark : C.ink }); if (v.old != null && v.changed) text(ctx, "tadi " + v.old, bx + bw / 2, by + bh - 8, 16, { align: "center", weight: 700, color: C.ink2 }); });
  };
  // daftar bernomor (larik): values[], opt.name, hl indeks (1-based), opt.w lebar sel
  Q.list = function (ctx, x, y, values, opt = {}) {
    const w = opt.w || 110, h = opt.h || 64;
    if (opt.name) text(ctx, opt.name, x, y - 14, 24, { weight: 900, color: C.kiko });
    values.forEach((v, i) => { const cx = x + i * (w + 8); const on = opt.hl === i + 1; const done = opt.done != null && i + 1 <= opt.done; ctx.fillStyle = on ? "#FFF3D6" : done ? C.goodBg : "#FFFFFF"; rr(ctx, cx, y, w, h, 10); ctx.fill(); ctx.strokeStyle = on ? C.accent : "#B7C4CC"; ctx.lineWidth = on ? 5 : 3; rr(ctx, cx, y, w, h, 10); ctx.stroke(); text(ctx, String(v), cx + w / 2, y + h / 2 + 11, 30, { align: "center", weight: 900 }); text(ctx, "nomor " + (i + 1), cx + w / 2, y + h + 26, 18, { align: "center", weight: 800, color: on ? C.accentDark : C.ink2 }); });
  };
  // kotak kardus berlabel dengan kartu angka
  Q.box = function (ctx, cx, cy, s, label, value, opt = {}) {
    ctx.fillStyle = "#C98A57"; rr(ctx, cx - s / 2, cy - s * 0.35, s, s * 0.7, 10); ctx.fill(); ctx.fillStyle = "#A4653A"; rr(ctx, cx - s / 2 - 8, cy - s * 0.45, s + 16, s * 0.14, 6); ctx.fill();
    ctx.fillStyle = "#fff"; rr(ctx, cx - s * 0.3, cy - s * 0.2, s * 0.6, s * 0.2, 6); ctx.fill(); text(ctx, label, cx, cy - s * 0.06, 22, { align: "center", weight: 900 });
    if (value != null) { ctx.fillStyle = opt.changed ? "#FFF3D6" : "#FFF9E0"; ctx.strokeStyle = opt.changed ? C.accent : "#E0B04B"; ctx.lineWidth = 3; rr(ctx, cx - s * 0.2, cy + s * 0.02, s * 0.4, s * 0.28, 6); ctx.fill(); ctx.stroke(); text(ctx, String(value), cx, cy + s * 0.24, 30, { align: "center", weight: 900 }); }
  };
  Q.numCard = function (ctx, x, y, v, opt = {}) { ctx.fillStyle = opt.fill || "#FFF9E0"; ctx.strokeStyle = opt.stroke || "#E0B04B"; ctx.lineWidth = 3; rr(ctx, x, y, 70, 90, 8); ctx.fill(); ctx.stroke(); text(ctx, String(v), x + 35, y + 58, 30, { align: "center", weight: 900 }); };
  // gelas air: level 0..1
  Q.glass = function (ctx, cx, baseY, w, h, level, opt = {}) {
    ctx.fillStyle = "#5FA8D3"; ctx.fillRect(cx - w / 2 + 6, baseY - h * clamp(level, 0, 1) + 2, w - 12, h * clamp(level, 0, 1) - 2);
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx - w / 2, baseY - h); ctx.lineTo(cx - w / 2, baseY); ctx.lineTo(cx + w / 2, baseY); ctx.lineTo(cx + w / 2, baseY - h); ctx.stroke();
    if (opt.marks) for (let i = 1; i <= opt.marks; i++) { const my = baseY - h * i / opt.marks; ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx + w / 2 - 20, my); ctx.lineTo(cx + w / 2, my); ctx.stroke(); text(ctx, String(i), cx + w / 2 + 14, my + 8, 20, { weight: 800, color: C.ink2 }); }
  };
  // penanda putaran: n total, k aktif (1-based), label
  Q.rounds = function (ctx, x, y, n, k, opt = {}) {
    text(ctx, opt.label || "putaran", x, y - 12, 20, { weight: 800, color: C.ink2 });
    for (let i = 1; i <= n; i++) { const cx = x + (i - 1) * 54 + 20; ctx.fillStyle = i < k ? C.good : i === k ? C.accent : "#E1E8E4"; ctx.beginPath(); ctx.arc(cx, y + 22, 20, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i), cx, y + 30, 20, { align: "center", weight: 900, color: i <= k ? "#fff" : C.ink2 }); }
  };
  K.memori = Q;
})(typeof window !== "undefined" ? window : globalThis);
