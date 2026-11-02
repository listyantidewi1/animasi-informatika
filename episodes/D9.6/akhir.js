/* Pembantu gambar D9.6: antrean murid di kantin, jam/stopwatch menit, kartu nomor pesan, kasir, kartu sebelum-sesudah,
   kartu masalah yang dicoret. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, kid, clamp } = H;
  const Q = {};
  // warung kantin: nama + meja; opt.busy = banyak antrean
  Q.stall = function (ctx, cx, cy, w, name, opt = {}) {
    ctx.fillStyle = opt.color || C.tableTop; rr(ctx, cx - w / 2, cy - 90, w, 70, 10); ctx.fill(); text(ctx, name, cx, cy - 45, 26, { align: "center", weight: 900, color: "#fff" });
    ctx.fillStyle = C.table; rr(ctx, cx - w / 2, cy - 20, w, 40, 8); ctx.fill();
    if (opt.cashier) { text(ctx, "💵 kasir", cx, cy + 60, 22, { align: "center", weight: 900, color: C.ink2 }); }
  };
  // antrean n murid ke arah kanan dari (x,y); opt.s ukuran
  Q.queue = function (ctx, x, y, n, opt = {}) {
    const s = opt.s || 60, gap = opt.gap || s * 0.9;
    for (let i = 0; i < n; i++) kid(ctx, x + i * gap, y, s, { hair: i % 2 ? "long" : null });
    if (opt.label) text(ctx, opt.label, x + (n - 1) * gap / 2, y + s * 1.3, 22, { align: "center", weight: 900, color: opt.color || C.ink2 });
  };
  // stopwatch menit; v menit, max skala
  Q.clock = function (ctx, cx, cy, r, v, opt = {}) {
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = opt.color || C.ink; ctx.lineWidth = r * 0.1; ctx.stroke();
    ctx.strokeStyle = opt.color || C.bad; ctx.lineWidth = r * 0.16; ctx.beginPath(); ctx.arc(cx, cy, r * 0.7, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(v / (opt.max || 15), 0, 1)); ctx.stroke();
    text(ctx, v + "", cx, cy + r * 0.15, r * 0.6, { align: "center", weight: 900 }); text(ctx, "menit", cx, cy + r * 0.5, r * 0.22, { align: "center", weight: 800, color: C.ink2 });
    if (opt.label) text(ctx, opt.label, cx, cy + r + 36, 24, { align: "center", weight: 900, color: opt.color || C.ink2 });
  };
  // kartu nomor pesan
  Q.ticket = function (ctx, cx, cy, w, n, opt = {}) {
    const h = w * 1.25; card(ctx, cx - w / 2, cy - h / 2, w, h, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 10 });
    text(ctx, "NOMOR", cx, cy - h / 2 + w * 0.22, w * 0.14, { align: "center", weight: 900, color: C.ink2 });
    text(ctx, String(n), cx, cy + w * 0.12, w * 0.5, { align: "center", weight: 900, color: C.accentDark });
    if (opt.order) text(ctx, opt.order, cx, cy + h / 2 - w * 0.14, w * 0.13, { align: "center", weight: 800, color: C.ink2 });
  };
  // kartu masalah; opt.cross = dicoret, opt.pick = dipilih
  Q.problem = function (ctx, x, y, w, h, s, opt = {}) {
    card(ctx, x, y, w, h, { fill: opt.pick ? C.goodBg : "#FFF9E0", stroke: opt.pick ? C.good : "#E0B04B", lw: opt.pick ? 5 : 3, r: 12 });
    const lines = wrap(ctx, s, 24, 800, w - 30); lines.forEach((ln, i) => text(ctx, ln, x + w / 2, y + h / 2 + 9 + (i - (lines.length - 1) / 2) * 30, 24, { align: "center", weight: 800, color: opt.cross ? C.muted : C.ink }));
    if (opt.cross) { ctx.strokeStyle = C.bad; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x + 20, y + h / 2); ctx.lineTo(x + w - 20, y + h / 2); ctx.stroke(); if (opt.why) text(ctx, opt.why, x + w / 2, y + h + 24, 18, { align: "center", weight: 800, color: C.bad }); }
    if (opt.pick) text(ctx, "✓ bisa diukur, bisa diubah", x + w / 2, y + h + 24, 18, { align: "center", weight: 900, color: C.good });
  };
  K.akhir = Q;
})(typeof window !== "undefined" ? window : globalThis);
