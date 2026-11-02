/* Pembantu gambar E.5: larik berindeks, kartu rekaman, tumpukan vertikal dengan push/pop, antrean horizontal dengan enqueue/dequeue,
   kartu operasi, tabel pemilihan. Gaya diagram Fase E. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, clamp, lerp } = H;
  const S = {};
  // larik: sel bernomor; opt.hl indeks (1-based), opt.bad indeks galat, opt.name, opt.w, opt.from0
  S.array = function (ctx, x, y, values, opt = {}) {
    const w = opt.w || 120, h = opt.h || 70;
    if (opt.name) text(ctx, opt.name, x, y - 16, 26, { weight: 900, color: C.kiko });
    values.forEach((v, i) => { const cx = x + i * (w + 6); const idx = (opt.from0 ? i : i + 1); const on = opt.hl === idx, bad = opt.bad === idx; ctx.fillStyle = bad ? C.badBg : on ? "#FFF3D6" : "#fff"; rr(ctx, cx, y, w, h, 10); ctx.fill(); ctx.strokeStyle = bad ? C.bad : on ? C.accent : "#7B8B95"; ctx.lineWidth = on || bad ? 5 : 3; rr(ctx, cx, y, w, h, 10); ctx.stroke(); text(ctx, v === undefined ? "?" : String(v), cx + w / 2, y + h / 2 + 11, 30, { align: "center", weight: 900, color: bad ? C.bad : C.ink }); text(ctx, String(idx), cx + w / 2, y + h + 26, 20, { align: "center", weight: 800, color: on ? C.accentDark : C.ink2 }); });
    if (opt.bad != null && opt.bad > values.length) { const cx = x + values.length * (w + 6); ctx.setLineDash([8, 6]); ctx.strokeStyle = C.bad; ctx.lineWidth = 3; rr(ctx, cx, y, w, h, 10); ctx.stroke(); ctx.setLineDash([]); text(ctx, "✕", cx + w / 2, y + h / 2 + 12, 34, { align: "center", weight: 900, color: C.bad }); text(ctx, String(opt.bad), cx + w / 2, y + h + 26, 20, { align: "center", weight: 800, color: C.bad }); }
  };
  // kartu rekaman: name, fields [[label, value, type]]
  S.record = function (ctx, x, y, w, name, fields, opt = {}) {
    const h = 56 + fields.length * 46 + 14; card(ctx, x, y, w, h, { fill: "#fff", stroke: opt.stroke || "#8E6BBF", lw: opt.on ? 6 : 3, r: 14 });
    ctx.fillStyle = "#8E6BBF"; rr(ctx, x, y, w, 44, 14); ctx.fill(); ctx.fillRect(x, y + 22, w, 22); text(ctx, name, x + 16, y + 30, 22, { weight: 900, color: "#fff" });
    fields.forEach(([k, v, t], i) => { const ry = y + 56 + i * 46; const hl = opt.hl === k; if (hl) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 8, ry, w - 16, 40, 8); ctx.fill(); } text(ctx, "." + k, x + 20, ry + 27, 22, { weight: 900, color: C.kiko }); text(ctx, String(v), x + w - 20 - (t ? 70 : 0), ry + 27, 22, { align: "right", weight: 800 }); if (t) { ctx.fillStyle = "#E6EDF2"; rr(ctx, x + w - 78, ry + 8, 62, 24, 6); ctx.fill(); text(ctx, t, x + w - 47, ry + 25, 13, { align: "center", weight: 900, color: C.ink2 }); } });
    return h;
  };
  // tumpukan: items bawah→atas; opt.moving {label, u, dir:"in"|"out"} animasi; opt.cap kapasitas gambar
  S.stack = function (ctx, cx, baseY, items, opt = {}) {
    const w = opt.w || 200, h = opt.h || 54, cap = opt.cap || 5;
    ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx - w / 2 - 16, baseY - cap * (h + 6) - 10); ctx.lineTo(cx - w / 2 - 16, baseY + 10); ctx.lineTo(cx + w / 2 + 16, baseY + 10); ctx.lineTo(cx + w / 2 + 16, baseY - cap * (h + 6) - 10); ctx.stroke();
    items.forEach((it, i) => { const y = baseY - (i + 1) * (h + 6) + 6; const top = i === items.length - 1; ctx.fillStyle = top && opt.hlTop ? "#FFF3D6" : C.bg2; rr(ctx, cx - w / 2, y, w, h, 10); ctx.fill(); ctx.strokeStyle = top && opt.hlTop ? C.accent : "#9AAFA6"; ctx.lineWidth = 3; rr(ctx, cx - w / 2, y, w, h, 10); ctx.stroke(); text(ctx, String(it), cx, y + h / 2 + 10, 28, { align: "center", weight: 900 }); });
    if (opt.moving) { const m = opt.moving; const yTop = baseY - (items.length + 1) * (h + 6) + 6; const yOut = baseY - cap * (h + 6) - 90; const y = m.dir === "in" ? lerp(yOut, yTop, m.u) : lerp(yTop, yOut, m.u); ctx.fillStyle = C.accent; rr(ctx, cx - w / 2, y, w, h, 10); ctx.fill(); text(ctx, String(m.label), cx, y + h / 2 + 10, 28, { align: "center", weight: 900, color: "#fff" }); }
    if (opt.label) text(ctx, opt.label, cx, baseY + 48, 22, { align: "center", weight: 900, color: C.ink2 });
    text(ctx, "atas ↑", cx + w / 2 + 50, baseY - cap * (h + 6) + 10, 18, { weight: 800, color: C.ink2 });
  };
  // antrean: items depan→belakang; opt.moving {label,u,dir:"in"|"out"}
  S.queue = function (ctx, x, y, items, opt = {}) {
    const w = opt.w || 120, h = opt.h || 64, cap = opt.cap || 6;
    ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - 10, y - 14); ctx.lineTo(x + cap * (w + 6) + 4, y - 14); ctx.moveTo(x - 10, y + h + 14); ctx.lineTo(x + cap * (w + 6) + 4, y + h + 14); ctx.stroke();
    items.forEach((it, i) => { const cx = x + i * (w + 6); const front = i === 0; ctx.fillStyle = front && opt.hlFront ? "#FFF3D6" : C.bg2; rr(ctx, cx, y, w, h, 10); ctx.fill(); ctx.strokeStyle = front && opt.hlFront ? C.accent : "#9AAFA6"; ctx.lineWidth = 3; rr(ctx, cx, y, w, h, 10); ctx.stroke(); text(ctx, String(it), cx + w / 2, y + h / 2 + 11, 28, { align: "center", weight: 900 }); });
    if (opt.moving) { const m = opt.moving; const xIn = x + cap * (w + 6) + 60, xBack = x + items.length * (w + 6), xOut = x - w - 70; const cx = m.dir === "in" ? lerp(xIn, xBack, m.u) : lerp(x, xOut, m.u); ctx.fillStyle = C.accent; rr(ctx, cx, y, w, h, 10); ctx.fill(); text(ctx, String(m.label), cx + w / 2, y + h / 2 + 11, 28, { align: "center", weight: 900, color: "#fff" }); }
    if (!opt.noLabels) { text(ctx, "depan ← keluar", x, y - 28, 18, { weight: 800, color: C.good }); text(ctx, "masuk → belakang", x + cap * (w + 6), y - 28, 18, { align: "right", weight: 800, color: C.kiko }); }
  };
  // kartu operasi
  S.op = function (ctx, x, y, w, name, desc, opt = {}) { ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2; card(ctx, x, y, w, 80, { fill: opt.on ? "#FFF3D6" : C.bg2, stroke: opt.on ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, name, x + 20, y + 36, 24, { weight: 900, color: C.kiko }); text(ctx, desc, x + 20, y + 64, 18, { weight: 700, color: C.ink2 }); ctx.restore(); };
  K.sd = S;
})(typeof window !== "undefined" ? window : globalThis);
