/* Pembantu gambar E.9: peta kampung dengan tempelan budaya, kartu narasumber dan formulir izin, kartu perangkat rekam,
   tabel metadata, lencana lisensi CC, kartu atribusi, kartu profesi, garis rencana. Gaya diagram Fase E. Muat setelah kiko-core.js, kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, kid, clamp } = H;
  const B = {};
  // peta sederhana dengan jalan dan tempelan; notes [[x,y,icon,teks]]
  B.map = function (ctx, x, y, w, h, notes = [], opt = {}) {
    card(ctx, x, y, w, h, { fill: "#F3F0E6", stroke: "#C9B98A", lw: 4, r: 14 });
    ctx.strokeStyle = "#D9C9A0"; ctx.lineWidth = 18; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + 40, y + h * 0.3); ctx.lineTo(x + w - 40, y + h * 0.45); ctx.moveTo(x + w * 0.35, y + 30); ctx.lineTo(x + w * 0.5, y + h - 30); ctx.stroke();
    ctx.fillStyle = "#9FD6EA"; ctx.beginPath(); ctx.ellipse(x + w * 0.8, y + h * 0.78, w * 0.12, h * 0.1, 0, 0, Math.PI * 2); ctx.fill();
    notes.forEach(([nx, ny, ic, t], i) => { if (opt.n != null && i >= opt.n) return; ctx.save(); ctx.translate(x + nx, y + ny); ctx.rotate((i % 3 - 1) * 0.08); ctx.fillStyle = ["#FFF59D", "#FFCCBC", "#C8E6C9", "#BBDEFB"][i % 4]; rr(ctx, -70, -34, 140, 68, 6); ctx.fill(); text(ctx, ic, 0, -4, 24, { align: "center" }); text(ctx, t, 0, 22, 15, { align: "center", weight: 900 }); ctx.restore(); });
  };
  // formulir izin
  B.consent = function (ctx, x, y, w, rows, opt = {}) {
    const h = 60 + rows.length * 40 + 60; card(ctx, x, y, w, h, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 12 }); text(ctx, "SURAT IZIN REKAM DAN SEBAR", x + w / 2, y + 36, 18, { align: "center", weight: 900, color: C.ink2 });
    rows.forEach(([k, v], i) => { text(ctx, k, x + 20, y + 76 + i * 40, 17, { weight: 800, color: C.ink2 }); text(ctx, v, x + w - 20, y + 76 + i * 40, 17, { align: "right", weight: 900 }); });
    text(ctx, "tanda tangan narasumber", x + 20, y + h - 22, 15, { weight: 700, color: C.muted }); if (opt.signed) { ctx.strokeStyle = C.kiko; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + w - 160, y + h - 30); ctx.bezierCurveTo(x + w - 120, y + h - 60, x + w - 90, y + h - 10, x + w - 40, y + h - 36); ctx.stroke(); }
  };
  // kartu perangkat: icon, nama, cocok untuk
  B.device = function (ctx, x, y, w, icon, name, forWhat, fmt, opt = {}) { ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2; card(ctx, x, y, w, 130, { fill: opt.on ? "#FFF3D6" : C.bg2, stroke: opt.on ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, icon, x + 50, y + 80, 44, { align: "center" }); text(ctx, name, x + 100, y + 50, 24, { weight: 900 }); text(ctx, forWhat, x + 100, y + 82, 18, { weight: 700, color: C.ink2 }); ctx.fillStyle = "#EDE6F7"; rr(ctx, x + 100, y + 95, fmt.length * 9 + 20, 24, 6); ctx.fill(); text(ctx, fmt, x + 110, y + 112, 14, { weight: 900, color: "#8E6BBF" }); ctx.restore(); };
  // lencana lisensi
  B.badge = function (ctx, x, y, code, opt = {}) { const w = code.length * 15 + 40; ctx.fillStyle = opt.color || "#1F2A33"; rr(ctx, x, y, w, 40, 8); ctx.fill(); text(ctx, code, x + w / 2, y + 27, 20, { align: "center", weight: 900, color: "#fff" }); return w; };
  // kartu unsur CC
  B.ccCard = function (ctx, x, y, w, code, name, desc, opt = {}) { ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2; card(ctx, x, y, w, 150, { fill: opt.on ? "#FFF3D6" : "#fff", stroke: opt.on ? C.accent : "#B7C4CC", lw: opt.on ? 6 : 3, r: 16 }); ctx.fillStyle = "#1F2A33"; ctx.beginPath(); ctx.arc(x + 60, y + 60, 36, 0, Math.PI * 2); ctx.fill(); text(ctx, code, x + 60, y + 69, 22, { align: "center", weight: 900, color: "#fff" }); text(ctx, name, x + 115, y + 52, 24, { weight: 900 }); const lines = wrap(ctx, desc, 18, 700, w - 130); lines.forEach((ln, i) => text(ctx, ln, x + 115, y + 82 + i * 24, 18, { weight: 700, color: C.ink2 })); ctx.restore(); };
  // kartu atribusi: parts [[label, value]]
  B.attribution = function (ctx, x, y, w, parts, opt = {}) { const h = 50 + parts.length * 44 + 70; card(ctx, x, y, w, h, { fill: "#fff", stroke: C.kiko, lw: 4, r: 14 }); text(ctx, "ATRIBUSI", x + 20, y + 34, 18, { weight: 900, color: C.kiko }); parts.forEach(([k, v], i) => { if (opt.n != null && i >= opt.n) return; ctx.fillStyle = ["#DCEBF2", "#DDF3E4", "#FFF3D6", "#EDE6F7"][i % 4]; rr(ctx, x + 16, y + 50 + i * 44, w - 32, 36, 8); ctx.fill(); text(ctx, k, x + 28, y + 74 + i * 44, 16, { weight: 800, color: C.ink2 }); text(ctx, v, x + w - 28, y + 74 + i * 44, 18, { align: "right", weight: 900 }); }); if (opt.n == null || opt.n >= parts.length) { const s = parts.map(p => p[1]).join(" · "); const lines = wrap(ctx, s, 16, 800, w - 40); lines.slice(0, 2).forEach((ln, i) => text(ctx, ln, x + 20, y + h - 42 + i * 20, 16, { weight: 800, color: C.ink })); } return h; };
  // kartu profesi
  B.job = function (ctx, x, y, w, icon, name, does, opt = {}) { ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2; card(ctx, x, y, w, 120, { fill: opt.on ? "#FFF3D6" : C.bg2, stroke: opt.on ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, icon, x + 50, y + 74, 44, { align: "center" }); text(ctx, name, x + 100, y + 50, 22, { weight: 900 }); const lines = wrap(ctx, does, 17, 700, w - 120); lines.forEach((ln, i) => text(ctx, ln, x + 100, y + 78 + i * 20, 17, { weight: 700, color: C.ink2 })); ctx.restore(); };
  K.budaya = B;
})(typeof window !== "undefined" ? window : globalThis);
