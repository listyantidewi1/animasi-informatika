/* Pembantu gambar D8.2: kartu nilai (terbuka/tertutup/disorot), deretan kartu, tumpukan kelompok, penghitung langkah,
   kotak syarat saringan, tabel saring. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, card, clamp } = H;
  const Q = {};
  // satu kartu nilai; opt.face false = tertutup; opt.hl warna bingkai; opt.name teks kecil; opt.dim
  Q.card = function (ctx, x, y, w, h, value, opt = {}) {
    ctx.save(); if (opt.dim) ctx.globalAlpha = 0.3;
    if (opt.face === false) { ctx.fillStyle = C.kiko; rr(ctx, x, y, w, h, 12); ctx.fill(); ctx.strokeStyle = C.kikoDark; ctx.lineWidth = 3; rr(ctx, x, y, w, h, 12); ctx.stroke(); ctx.fillStyle = C.kikoLight; for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.arc(x + w * (0.25 + i * 0.25), y + h * (0.2 + j * 0.2), 4, 0, Math.PI * 2); ctx.fill(); } }
    else { ctx.fillStyle = opt.fill || "#FFFFFF"; rr(ctx, x, y, w, h, 12); ctx.fill(); ctx.strokeStyle = opt.hl || "#B7C4CC"; ctx.lineWidth = opt.hl ? 6 : 3; rr(ctx, x, y, w, h, 12); ctx.stroke(); text(ctx, String(value), x + w / 2, y + h / 2 + (opt.name ? 4 : 14), opt.size || Math.min(44, w * 0.45), { align: "center", weight: 900, color: opt.color || C.ink }); if (opt.name) text(ctx, opt.name, x + w / 2, y + h - 14, Math.min(20, w * 0.2), { align: "center", weight: 700, color: C.ink2 }); }
    ctx.restore();
  };
  // deretan kartu; values[], opt.open = Set/array indeks terbuka (bawaan semua), opt.hl {i: warna}, opt.dim [i], opt.w, gap, opt.names[]
  Q.row = function (ctx, x, y, values, opt = {}) {
    const w = opt.w || 110, h = opt.h || 140, gap = opt.gap || 16;
    values.forEach((v, i) => { const open = opt.open ? (opt.open.has ? opt.open.has(i) : opt.open.includes(i)) : true; Q.card(ctx, x + i * (w + gap), y, w, h, v, { face: open, hl: opt.hl && opt.hl[i], dim: opt.dim && opt.dim.includes(i), name: opt.names && opt.names[i], fill: opt.fills && opt.fills[i] }); if (opt.index) text(ctx, String(i + 1), x + i * (w + gap) + w / 2, y + h + 30, 22, { align: "center", weight: 800, color: C.ink2 }); });
    return { w, h, gap, cx: i => x + i * (w + gap) + w / 2 };
  };
  // penghitung langkah
  Q.counter = function (ctx, x, y, n, label = "langkah", opt = {}) {
    card(ctx, x, y, opt.w || 260, 110, { fill: opt.fill || "#FFF3D6", stroke: opt.stroke || C.accent, lw: 4, r: 16 });
    text(ctx, String(n), x + (opt.w || 260) / 2, y + 62, 54, { align: "center", weight: 900, color: opt.color || C.accentDark });
    text(ctx, label, x + (opt.w || 260) / 2, y + 96, 22, { align: "center", weight: 800, color: C.ink2 });
  };
  // tumpukan kelompok: label, kartu-kartu tertumpuk (n), opt.hl
  Q.pile = function (ctx, x, y, w, label, n, opt = {}) {
    card(ctx, x, y, w, 300, { fill: opt.hl ? "#FFF3D6" : C.bg2, stroke: opt.hl ? C.accent : undefined, lw: 4, r: 16 });
    text(ctx, label, x + w / 2, y + 40, 24, { align: "center", weight: 900, color: C.ink2 });
    const show = Math.min(n, 8); for (let i = 0; i < show; i++) { ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 2; rr(ctx, x + w / 2 - 50 + i * 3, y + 200 - i * 12, 100, 70, 8); ctx.fill(); ctx.stroke(); }
    text(ctx, String(n), x + w / 2, y + 290, 36, { align: "center", weight: 900, color: opt.hl ? C.accentDark : C.kiko });
  };
  // kotak syarat
  Q.condition = function (ctx, x, y, w, parts, opt = {}) {
    card(ctx, x, y, w, 70 + 50 * parts.length, { fill: "#FFFFFF", stroke: C.kiko, lw: 4, r: 14 });
    text(ctx, "SYARAT", x + 20, y + 40, 22, { weight: 900, color: C.kiko });
    parts.forEach((p, i) => text(ctx, p, x + 20, y + 90 + i * 50, 26, { weight: i % 2 ? 900 : 700, color: i % 2 ? C.accentDark : C.ink }));
  };
  // tabel sederhana dengan baris disembunyikan: rows [[nama, nilai, remedi]], opt.hide [i], opt.hl [i]
  Q.table = function (ctx, x, y, rows, opt = {}) {
    const cw = opt.cw || [220, 120, 160], rh = 44; const W = cw.reduce((a, b) => a + b, 0);
    const head = ["Nama", "Nilai", "Remedi"]; let cy = y;
    card(ctx, x, y, W, rh * (rows.length + 1), { fill: "#FFFFFF", stroke: "#B7C4CC", lw: 3, r: 10 });
    ctx.fillStyle = C.bg2; rr(ctx, x, y, W, rh, 10); ctx.fill(); ctx.fillRect(x, y + rh / 2, W, rh / 2);
    let cx = x; head.forEach((h, c) => { text(ctx, h + (opt.filterCol === c ? " ▼" : ""), cx + 12, y + 30, 22, { weight: 900, color: opt.filterCol === c ? C.accentDark : C.ink2 }); cx += cw[c]; });
    rows.forEach((r, i) => { cy += rh; const hide = (opt.hide || []).includes(i), hl = (opt.hl || []).includes(i); ctx.save(); if (hide) ctx.globalAlpha = 0.18; if (hl) { ctx.fillStyle = C.goodBg; ctx.fillRect(x + 1, cy + 1, W - 2, rh - 2); } let cx2 = x; r.forEach((v, c) => { text(ctx, String(v), cx2 + 12, cy + 30, 22, { weight: c ? 700 : 800, color: hl ? C.good : C.ink }); cx2 += cw[c]; }); ctx.restore(); });
  };
  K.kartu = Q;
})(typeof window !== "undefined" ? window : globalThis);
