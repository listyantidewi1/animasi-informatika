/* Pembantu gambar F12.3: diagram titik dengan sumbu, garis tren y = a + bx, segmen error, kotak kuadrat error,
   garis rata-rata, titik prediksi, batang perbandingan. Gaya diagram Fase F. Data fiktif. Muat setelah kiko-core.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, card } = H;
  const Tr = {};
  Tr.DATA = [[1, 20], [2, 24], [3, 25], [4, 28], [5, 33], [6, 35]];
  // plot: opt {xmax, ymin, ymax, n titik tampil, data, line {a, b, col, upto, dash}, lines [...], errs (dari line utama), squares, mean, pred {x}, hl indeks, xlab, ylab, small}
  Tr.plot = function (ctx, x, y, w, h, opt = {}) {
    const data = opt.data || Tr.DATA, xmax = opt.xmax || 8, ymin = opt.ymin == null ? 0 : opt.ymin, ymax = opt.ymax || 50, n = opt.n == null ? data.length : opt.n;
    const px = v => x + (v / xmax) * w, py = v => y + h - ((v - ymin) / (ymax - ymin)) * h;
    card(ctx, x - 70, y - 30, w + 110, h + 100, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 });
    ctx.strokeStyle = "#E3EAEE"; ctx.lineWidth = 1.5; for (let v = ymin; v <= ymax; v += 10) { ctx.beginPath(); ctx.moveTo(x, py(v)); ctx.lineTo(x + w, py(v)); ctx.stroke(); text(ctx, String(v), x - 14, py(v) + 7, 18, { align: "right", weight: 700, color: C.ink2 }); }
    for (let v = 1; v <= xmax; v++) text(ctx, String(v), px(v), y + h + 28, 18, { align: "center", weight: 700, color: C.ink2 });
    ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.stroke();
    text(ctx, opt.xlab || "bulan", x + w, y + h + 58, 18, { align: "right", weight: 800, color: C.ink2 }); text(ctx, opt.ylab || "kg", x + 10, y - 6, 18, { align: "left", weight: 800, color: C.ink2 });
    if (opt.mean != null) { ctx.save(); ctx.setLineDash([12, 8]); ctx.strokeStyle = "#8E6BBF"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, py(opt.mean)); ctx.lineTo(x + w, py(opt.mean)); ctx.stroke(); ctx.restore(); text(ctx, "rata-rata " + String(opt.mean).replace(".", ","), x + w - 6, py(opt.mean) - 12, 20, { align: "right", weight: 900, color: "#8E6BBF" }); }
    const L = opt.line, all = (opt.lines || []).concat(L ? [L] : []);
    all.forEach(ln => { const x0 = 0, x1 = ln.upto || xmax; ctx.save(); if (ln.dash) ctx.setLineDash([12, 8]); ctx.strokeStyle = ln.col || C.accent; ctx.lineWidth = ln.lw || 5; ctx.beginPath(); ctx.moveTo(px(x0), py(ln.a + ln.b * x0)); ctx.lineTo(px(x1), py(ln.a + ln.b * x1)); ctx.stroke(); ctx.restore(); });
    if (L && (opt.errs || opt.squares)) data.slice(0, n).forEach(([dx, dy]) => { const fy = L.a + L.b * dx, e = dy - fy; if (opt.squares && Math.abs(e) > 0.01) { const s = Math.abs(py(fy) - py(dy)); ctx.fillStyle = e > 0 ? "rgba(46,158,91,0.18)" : "rgba(217,68,59,0.16)"; ctx.fillRect(px(dx), Math.min(py(fy), py(dy)), s, s); }
      ctx.strokeStyle = e >= 0 ? C.good : C.bad; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(px(dx), py(fy)); ctx.lineTo(px(dx), py(dy)); ctx.stroke(); if (opt.errs === "label" && Math.abs(e) > 0.01) text(ctx, (e > 0 ? "+" : "") + String(+e.toFixed(1)).replace(".", ",").replace("-", "−"), px(dx) - 10, (py(fy) + py(dy)) / 2 + 7, 18, { align: "right", weight: 900, color: e >= 0 ? C.good : C.bad }); });
    data.slice(0, n).forEach(([dx, dy], i) => { ctx.beginPath(); ctx.arc(px(dx), py(dy), opt.hl === i ? 14 : 11, 0, Math.PI * 2); ctx.fillStyle = opt.hl === i ? C.accent : C.kiko; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.stroke(); if (opt.values) text(ctx, String(dy), px(dx), py(dy) - 20, 18, { align: "center", weight: 900 }); });
    if (opt.pred) { const pv = opt.pred.y != null ? opt.pred.y : L.a + L.b * opt.pred.x; ctx.beginPath(); ctx.arc(px(opt.pred.x), py(pv), 14, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.stroke(); text(ctx, String(pv).replace(".", ","), px(opt.pred.x), py(pv) - 24, 22, { align: "center", weight: 900, color: C.accentDark }); }
    return { px, py };
  };
  Tr.sse = (a, b, data = Tr.DATA) => data.reduce((s, [x, y]) => s + (y - a - b * x) ** 2, 0);
  // batang perbandingan jumlah kuadrat error: rows [[label, nilai, hl]]
  Tr.bars = function (ctx, x, y, w, rows, opt = {}) {
    const max = opt.max || Math.max(...rows.map(r => r[1])), rh = opt.rh || 64;
    rows.forEach(([lab, v, hl], i) => { const by = y + i * rh; text(ctx, lab, x, by + 30, 20, { weight: 900, color: hl ? C.good : C.ink }); const bw = Math.max(6, (w - 260) * v / max); ctx.fillStyle = hl ? C.good : "#B7C4CC"; rr(ctx, x + 200, by + 8, bw, 32, Math.min(8, bw / 2)); ctx.fill(); text(ctx, String(v).replace(".", ","), x + 214 + bw, by + 32, 20, { weight: 900, color: hl ? C.good : C.ink2 }); });
  };
  K.tren = Tr;
})(typeof window !== "undefined" ? window : globalThis);
