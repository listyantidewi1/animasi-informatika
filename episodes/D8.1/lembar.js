/* Pembantu gambar D8.1: lembar kerja (kisi sel berhuruf/bernomor, bilah rumus, sorotan, panah ketergantungan, gagang isi),
   grafik batang dan garis, tabel kertas. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, card, clamp } = H;
  const Q = {};
  const COLS = "ABCDEFGH";
  // lembar kerja: data = array baris (array sel: angka/teks/null); opt.cw, rh, hl {A1: warna}, sel aktif opt.active "B3", opt.formulas {B5: "=B2+B3+B4"} tampil kecil, opt.changed [alamat], opt.title
  Q.sheet = function (ctx, x, y, data, opt = {}) {
    const cw = opt.cw || 150, rh = opt.rh || 52, hw = 56, cols = opt.cols || Math.max(...data.map(r => r.length));
    const W = hw + cw * cols, Hh = rh * (data.length + 1);
    card(ctx, x, y, W, Hh, { fill: "#FFFFFF", stroke: "#B7C4CC", lw: 3, r: 10 });
    ctx.fillStyle = "#E6EDF2"; rr(ctx, x, y, W, rh, 10); ctx.fill(); ctx.fillRect(x, y + rh / 2, W, rh / 2); ctx.fillRect(x, y, hw, Hh);
    for (let c = 0; c < cols; c++) text(ctx, COLS[c], x + hw + c * cw + cw / 2, y + rh / 2 + 9, 24, { align: "center", weight: 900, color: C.ink2 });
    for (let r = 0; r < data.length; r++) text(ctx, String(r + 1), x + hw / 2, y + rh * (r + 1) + rh / 2 + 9, 24, { align: "center", weight: 900, color: C.ink2 });
    data.forEach((row, r) => row.forEach((v, c) => {
      const addr = COLS[c] + (r + 1); const cx = x + hw + c * cw, cy = y + rh * (r + 1);
      const hl = opt.hl && opt.hl[addr]; const changed = (opt.changed || []).includes(addr); const active = opt.active === addr;
      if (hl || changed) { ctx.fillStyle = hl || C.goodBg; ctx.fillRect(cx + 1, cy + 1, cw - 2, rh - 2); }
      if (v != null && v !== "") { const isNum = typeof v === "number"; text(ctx, isNum ? v.toLocaleString("id-ID") : String(v), isNum ? cx + cw - 14 : cx + 12, cy + rh / 2 + 9, opt.size || 24, { align: isNum ? "right" : "left", weight: r === 0 || c === 0 ? 800 : 700, color: changed ? C.good : C.ink }); }
      if (opt.formulas && opt.formulas[addr] && opt.showFormula) text(ctx, opt.formulas[addr], cx + 8, cy + rh - 8, 14, { weight: 700, color: C.kiko });
      if (active) { ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.strokeRect(cx + 2, cy + 2, cw - 4, rh - 4); ctx.fillStyle = C.accent; ctx.fillRect(cx + cw - 10, cy + rh - 10, 10, 10); }
    }));
    ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 1.5;
    for (let r = 1; r <= data.length; r++) { ctx.beginPath(); ctx.moveTo(x, y + rh * r); ctx.lineTo(x + W, y + rh * r); ctx.stroke(); }
    for (let c = 0; c <= cols; c++) { ctx.beginPath(); ctx.moveTo(x + hw + c * cw, y); ctx.lineTo(x + hw + c * cw, y + Hh); ctx.stroke(); }
    return { W, H: Hh, cell: (addr) => { const c = COLS.indexOf(addr[0]), r = parseInt(addr.slice(1)) - 1; return { x: x + hw + c * cw, y: y + rh * (r + 1), w: cw, h: rh, cx: x + hw + c * cw + cw / 2, cy: y + rh * (r + 1) + rh / 2 }; } };
  };
  // bilah rumus: alamat aktif + isi
  Q.formulaBar = function (ctx, x, y, w, addr, content, opt = {}) {
    card(ctx, x, y, 110, 54, { fill: "#F4F8FB", stroke: "#B7C4CC", lw: 2, r: 8 }); text(ctx, addr, x + 55, y + 36, 26, { align: "center", weight: 900 });
    card(ctx, x + 120, y, w - 120, 54, { fill: "#FFFFFF", stroke: opt.stroke || "#B7C4CC", lw: 3, r: 8 }); text(ctx, "fx", x + 134, y + 36, 22, { weight: 900, color: C.ink2 });
    text(ctx, content, x + 176, y + 36, 26, { weight: 800, color: opt.color || C.kiko });
    if (opt.cursor) { const wdt = ctx.measureText(content).width; ctx.fillStyle = C.ink; ctx.fillRect(x + 180 + wdt, y + 14, 3, 28); }
  };
  // panah ketergantungan antar sel
  Q.depArrow = function (ctx, from, to, color = C.accent) {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(from.cx, from.cy); ctx.lineTo(to.cx, to.cy); ctx.stroke();
    const a = Math.atan2(to.cy - from.cy, to.cx - from.cx); ctx.beginPath(); ctx.moveTo(to.cx, to.cy); ctx.lineTo(to.cx - 14 * Math.cos(a - 0.4), to.cy - 14 * Math.sin(a - 0.4)); ctx.lineTo(to.cx - 14 * Math.cos(a + 0.4), to.cy - 14 * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
  };
  // grafik batang: items [[label, nilai]], opt.hl indeks, opt.color
  Q.barChart = function (ctx, x, y, w, h, items, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#B7C4CC", lw: 3, r: 12 });
    const max = Math.max(...items.map(i => i[1])) * 1.15, bw = (w - 80) / items.length, base = y + h - 60, top = y + 40;
    ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 2; for (let k = 0; k <= 4; k++) { const gy = base - (base - top) * k / 4; ctx.beginPath(); ctx.moveTo(x + 50, gy); ctx.lineTo(x + w - 20, gy); ctx.stroke(); text(ctx, String(Math.round(max * k / 4)), x + 44, gy + 7, 16, { align: "right", color: C.ink2, weight: 700 }); }
    items.forEach(([lab, v], i) => { const bx = x + 60 + i * bw + bw * 0.15, bh = (base - top) * (v / max) * (opt.grow == null ? 1 : opt.grow); ctx.fillStyle = opt.hl === i ? C.accent : opt.color || C.kiko; rr(ctx, bx, base - bh, bw * 0.7, bh, 8); ctx.fill(); text(ctx, lab, bx + bw * 0.35, base + 28, 20, { align: "center", weight: 800, color: C.ink2 }); if (opt.values) text(ctx, String(v), bx + bw * 0.35, base - bh - 8, 20, { align: "center", weight: 900 }); });
    if (opt.title) text(ctx, opt.title, x + w / 2, y + 26, 22, { align: "center", weight: 900, color: C.ink2 });
  };
  // grafik garis: series [[label, nilai]]
  Q.lineChart = function (ctx, x, y, w, h, items, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#FFFFFF", stroke: "#B7C4CC", lw: 3, r: 12 });
    const max = Math.max(...items.map(i => i[1])) * 1.15, base = y + h - 60, top = y + 40, step = (w - 100) / (items.length - 1);
    ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 2; for (let k = 0; k <= 4; k++) { const gy = base - (base - top) * k / 4; ctx.beginPath(); ctx.moveTo(x + 50, gy); ctx.lineTo(x + w - 20, gy); ctx.stroke(); }
    const n = opt.n == null ? items.length : clamp(opt.n, 1, items.length);
    ctx.strokeStyle = opt.color || C.kiko; ctx.lineWidth = 6; ctx.lineJoin = "round"; ctx.beginPath();
    items.slice(0, n).forEach(([lab, v], i) => { const px = x + 60 + i * step, py = base - (base - top) * v / max; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }); ctx.stroke();
    items.forEach(([lab, v], i) => { const px = x + 60 + i * step, py = base - (base - top) * v / max; if (i < n) { ctx.fillStyle = opt.color || C.kiko; ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill(); if (opt.unit != null) text(ctx, v + (opt.unit ? " " + opt.unit : ""), px, py - 16, 18, { align: "center", weight: 900, color: opt.color || C.kikoDark }); } text(ctx, lab, px, base + 28, 20, { align: "center", weight: 800, color: C.ink2 }); });
    if (opt.title) text(ctx, opt.title, x + w / 2, y + 26, 22, { align: "center", weight: 900, color: C.ink2 });
  };
  // tabel kertas (ditulis tangan): header + rows; opt.erase [ [r,c] ] dicoret
  Q.paper = function (ctx, x, y, header, rows, opt = {}) {
    const cw = opt.cw || 150, rh = opt.rh || 56, W = cw * header.length, Hh = rh * (rows.length + 1);
    ctx.fillStyle = "#FFF9E0"; rr(ctx, x - 20, y - 20, W + 40, Hh + 40, 10); ctx.fill(); ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 3; rr(ctx, x - 20, y - 20, W + 40, Hh + 40, 10); ctx.stroke();
    ctx.strokeStyle = "#8B7A4E"; ctx.lineWidth = 2;
    for (let r = 0; r <= rows.length + 1; r++) { ctx.beginPath(); ctx.moveTo(x, y + r * rh); ctx.lineTo(x + W, y + r * rh); ctx.stroke(); }
    for (let c = 0; c <= header.length; c++) { ctx.beginPath(); ctx.moveTo(x + c * cw, y); ctx.lineTo(x + c * cw, y + Hh); ctx.stroke(); }
    header.forEach((hd, c) => text(ctx, hd, x + c * cw + cw / 2, y + rh / 2 + 9, 24, { align: "center", weight: 900 }));
    rows.forEach((row, r) => row.forEach((v, c) => { const er = (opt.erase || []).some(([er_, ec]) => er_ === r && ec === c); const cx = x + c * cw + cw / 2, cy = y + rh * (r + 1) + rh / 2 + 9; text(ctx, String(v), cx, cy, 24, { align: "center", weight: c ? 700 : 800, color: er ? C.muted : C.ink }); if (er) { ctx.strokeStyle = C.bad; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - 30, cy - 20); ctx.lineTo(cx + 30, cy + 4); ctx.moveTo(cx + 30, cy - 20); ctx.lineTo(cx - 30, cy + 4); ctx.stroke(); } }));
    return { W, H: Hh };
  };
  K.lembar = Q;
})(typeof window !== "undefined" ? window : globalThis);
