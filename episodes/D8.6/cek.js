/* Pembantu gambar D8.6: kartu klaim, kartu langkah proyek, lembar data (memakai gaya D8.1), grafik batang/garis kecil, kartu kesimpulan.
   Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, clamp } = H;
  const Q = {};
  const COLS = "ABCDEFGH";
  Q.claim = function (ctx, x, y, w, s, kind, opt = {}) {
    const col = kind === "uji" ? C.good : kind === "opini" ? C.kiko : C.accent; const size = opt.size || 26; const lines = wrap(ctx, s, size, 800, w - 40); const h = opt.h || 40 + lines.length * size * 1.3;
    card(ctx, x, y, w, h, { fill: kind === "uji" ? C.goodBg : kind === "opini" ? "#DCEBF2" : "#FFF3D6", stroke: col, lw: kind ? 5 : 3, r: 14 });
    lines.forEach((ln, i) => text(ctx, ln, x + 20, y + 34 + i * size * 1.3, size, { weight: 800 }));
    if (opt.tag) { ctx.fillStyle = col; rr(ctx, x + w - 160, y - 14, 150, 28, 8); ctx.fill(); text(ctx, opt.tag, x + w - 85, y + 6, 16, { align: "center", weight: 900, color: "#fff" }); }
    return h;
  };
  Q.step = function (ctx, x, y, w, h, n, title, sub, opt = {}) {
    ctx.save(); if (opt.dim) ctx.globalAlpha = 0.25;
    card(ctx, x, y, w, h, { fill: opt.on ? "#FFF3D6" : C.bg2, stroke: opt.on ? C.accent : undefined, lw: 5, r: 16 });
    ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 40, y + 40, 26, 0, Math.PI * 2); ctx.fill(); text(ctx, String(n), x + 40, y + 50, 26, { align: "center", color: "#fff", weight: 900 });
    const lines = wrap(ctx, title, 26, 900, w - 30); lines.forEach((ln, i) => text(ctx, ln, x + w / 2, y + 100 + i * 32, 26, { align: "center", weight: 900 }));
    if (sub) { const sl = wrap(ctx, sub, 20, 700, w - 30); sl.forEach((ln, i) => text(ctx, ln, x + w / 2, y + h - 20 - (sl.length - 1 - i) * 26, 20, { align: "center", weight: 700, color: C.ink2 })); }
    ctx.restore();
  };
  // lembar data: data baris; opt.cw, rh, hl {A1}, changed [], formulas tampil di bilah
  Q.sheet = function (ctx, x, y, data, opt = {}) {
    const cw = opt.cw || [150, 110, 110, 220], rh = opt.rh || 44, hw = 44; const cols = data[0].length; const W = hw + cw.slice(0, cols).reduce((a, b) => a + b, 0), Hh = rh * (data.length + 1);
    card(ctx, x, y, W, Hh, { fill: "#FFFFFF", stroke: "#B7C4CC", lw: 3, r: 10 });
    ctx.fillStyle = "#E6EDF2"; rr(ctx, x, y, W, rh, 10); ctx.fill(); ctx.fillRect(x, y + rh / 2, W, rh / 2); ctx.fillRect(x, y, hw, Hh);
    let cx = x + hw; const colX = []; for (let c = 0; c < cols; c++) { colX.push(cx); text(ctx, COLS[c], cx + cw[c] / 2, y + rh / 2 + 8, 20, { align: "center", weight: 900, color: C.ink2 }); cx += cw[c]; }
    for (let r = 0; r < data.length; r++) text(ctx, String(r + 1), x + hw / 2, y + rh * (r + 1) + rh / 2 + 8, 20, { align: "center", weight: 900, color: C.ink2 });
    data.forEach((row, r) => row.forEach((v, c) => { const addr = COLS[c] + (r + 1); const px = colX[c], py = y + rh * (r + 1); const hl = opt.hl && opt.hl[addr]; const chg = (opt.changed || []).includes(addr); if (hl || chg) { ctx.fillStyle = hl || C.goodBg; ctx.fillRect(px + 1, py + 1, cw[c] - 2, rh - 2); } if (v != null && v !== "") { const num = typeof v === "number"; text(ctx, num ? String(v).replace(".", ",") : String(v), num ? px + cw[c] - 12 : px + 10, py + rh / 2 + 8, opt.size || 20, { align: num ? "right" : "left", weight: r === 0 ? 900 : 700, color: chg ? C.good : C.ink }); } if (opt.active === addr) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.strokeRect(px + 2, py + 2, cw[c] - 4, rh - 4); } }));
    ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 1.5; for (let r = 1; r <= data.length; r++) { ctx.beginPath(); ctx.moveTo(x, y + rh * r); ctx.lineTo(x + W, y + rh * r); ctx.stroke(); } colX.concat([x + W]).forEach(px => { ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(px, y + Hh); ctx.stroke(); });
    return { W, H: Hh };
  };
  Q.formulaBar = function (ctx, x, y, w, addr, content) { card(ctx, x, y, 90, 46, { fill: "#F4F8FB", stroke: "#B7C4CC", lw: 2, r: 8 }); text(ctx, addr, x + 45, y + 31, 22, { align: "center", weight: 900 }); card(ctx, x + 100, y, w - 100, 46, { fill: "#FFFFFF", stroke: "#B7C4CC", lw: 3, r: 8 }); text(ctx, "fx", x + 112, y + 31, 18, { weight: 900, color: C.ink2 }); text(ctx, content, x + 146, y + 31, 22, { weight: 800, color: C.kiko }); };
  Q.bars = function (ctx, x, y, w, h, items, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#B7C4CC", lw: 3, r: 12 }); const max = (opt.max || Math.max(...items.map(i => i[1]))) * 1.2, bw = (w - 60) / items.length, base = y + h - 50, top = y + 50;
    items.forEach(([lab, v, col], i) => { const bx = x + 40 + i * bw + bw * 0.2, bh = (base - top) * v / max * (opt.grow == null ? 1 : opt.grow); ctx.fillStyle = col || C.kiko; rr(ctx, bx, base - bh, bw * 0.6, bh, 8); ctx.fill(); text(ctx, lab, bx + bw * 0.3, base + 28, 20, { align: "center", weight: 800, color: C.ink2 }); text(ctx, String(v).replace(".", ","), bx + bw * 0.3, base - bh - 10, 22, { align: "center", weight: 900 }); });
    if (opt.title) text(ctx, opt.title, x + w / 2, y + 28, 20, { align: "center", weight: 900, color: C.ink2 });
  };
  Q.lines = function (ctx, x, y, w, h, series, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#B7C4CC", lw: 3, r: 12 }); const all = series.flatMap(s => s.v); const max = Math.max(...all) * 1.2, base = y + h - 50, top = y + 50, n = series[0].v.length, step = (w - 80) / (n - 1);
    series.forEach(s => { ctx.strokeStyle = s.col; ctx.lineWidth = 5; ctx.lineJoin = "round"; ctx.beginPath(); s.v.forEach((v, i) => { const px = x + 40 + i * step, py = base - (base - top) * v / max; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke(); s.v.forEach((v, i) => { ctx.fillStyle = s.col; ctx.beginPath(); ctx.arc(x + 40 + i * step, base - (base - top) * v / max, 6, 0, Math.PI * 2); ctx.fill(); }); });
    for (let i = 0; i < n; i++) text(ctx, "H" + (i + 1), x + 40 + i * step, base + 28, 16, { align: "center", weight: 800, color: C.ink2 });
    if (opt.mark != null) { ctx.fillStyle = "rgba(242,177,52,0.25)"; ctx.fillRect(x + 40 + opt.mark * step - step / 2, top - 10, step, base - top + 10); text(ctx, "hujan", x + 40 + opt.mark * step, top - 16, 18, { align: "center", weight: 900, color: C.accentDark }); }
    series.forEach((s, i) => { ctx.fillStyle = s.col; ctx.fillRect(x + w - 200, y + 20 + i * 26, 20, 12); text(ctx, s.name, x + w - 172, y + 32 + i * 26, 18, { weight: 800, color: C.ink2 }); });
  };
  Q.verdict = function (ctx, x, y, w, kind, title, sub, opt = {}) {
    const col = kind === "benar" ? C.good : kind === "salah" ? C.bad : C.accentDark; const bg = kind === "benar" ? C.goodBg : kind === "salah" ? C.badBg : "#FFF3D6";
    ctx.save(); if (opt.dim) ctx.globalAlpha = 0.3; card(ctx, x, y, w, 130, { fill: opt.on ? bg : C.bg2, stroke: opt.on ? col : undefined, lw: 5, r: 16 }); text(ctx, title, x + w / 2, y + 55, 30, { align: "center", weight: 900, color: opt.on ? col : C.ink }); text(ctx, sub, x + w / 2, y + 98, 20, { align: "center", weight: 700, color: C.ink2 }); ctx.restore();
  };
  K.cek = Q;
})(typeof window !== "undefined" ? window : globalThis);
