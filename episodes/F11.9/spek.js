/* Pembantu gambar F11.9: kartu profil pengguna, kartu komponen, lembar spesifikasi, brosur iklan fiktif,
   batang anggaran bertumpuk, lencana peringatan, tabel bandingan. Gaya diagram Fase F. Semua merek dan harga fiktif.
   Muat setelah kiko-core.js, kiko-devices.js, komputer.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, clamp } = H;
  const Sp = {};
  // kartu profil: {nama, peran, pakai[], beban}
  Sp.profile = function (ctx, x, y, w, p, opt = {}) {
    const h = opt.h || 300; ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2;
    card(ctx, x, y, w, h, { fill: opt.on ? "#FFF3D6" : "#fff", stroke: opt.on ? C.accent : (p.col || C.kiko), lw: opt.on ? 6 : 4, r: 16 });
    ctx.fillStyle = p.col || C.kiko; rr(ctx, x, y, w, 56, 16); ctx.fill(); ctx.fillRect(x, y + 28, w, 28);
    text(ctx, (p.ic || "👤") + " " + p.nama, x + 18, y + 38, 24, { weight: 900, color: "#fff" });
    text(ctx, p.peran, x + 18, y + 88, 19, { weight: 800, color: C.ink2 });
    (p.pakai || []).forEach((s, i) => text(ctx, "• " + s, x + 18, y + 124 + i * 32, 19, { weight: 800 }));
    if (p.beban) { ctx.fillStyle = C.bg2; rr(ctx, x + 14, y + h - 54, w - 28, 40, 10); ctx.fill(); text(ctx, "beban: " + p.beban, x + w / 2, y + h - 27, 18, { align: "center", weight: 900, color: p.col || C.kiko }); }
    ctx.restore();
  };
  // kartu komponen dengan gambar: kind "cpu"|"ram"|"ssd"|"gpu"|"layar"|"net"
  Sp.part = function (ctx, x, y, w, h, kind, title, sub, opt = {}) {
    const M = K.komp; ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2;
    card(ctx, x, y, w, h, { fill: opt.on ? "#FFF3D6" : C.bg2, stroke: opt.on ? C.accent : undefined, lw: 4, r: 16 });
    const cx = x + w / 2, cy = y + 80;
    if (kind === "cpu") M.chip(ctx, cx, cy, 80, { label: "CPU" });
    else if (kind === "ram") M.ram(ctx, cx - 90, cy - 35, 180, 70, { label: false });
    else if (kind === "ssd") M.ssd(ctx, cx, cy, 90);
    else if (kind === "gpu") { ctx.fillStyle = "#2F3B45"; rr(ctx, cx - 90, cy - 35, 180, 70, 10); ctx.fill(); ctx.fillStyle = "#4A5A66"; ctx.beginPath(); ctx.arc(cx - 40, cy, 24, 0, Math.PI * 2); ctx.arc(cx + 40, cy, 24, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#B57A12"; ctx.fillRect(cx - 80, cy + 35, 160, 8); }
    else if (kind === "layar") { ctx.fillStyle = "#2F3B45"; rr(ctx, cx - 70, cy - 50, 140, 82, 8); ctx.fill(); ctx.fillStyle = "#DCEBF2"; rr(ctx, cx - 63, cy - 44, 126, 68, 4); ctx.fill(); ctx.fillStyle = "#4A5A66"; ctx.fillRect(cx - 10, cy + 32, 20, 10); ctx.fillRect(cx - 34, cy + 41, 68, 5); }
    else if (kind === "net") { ctx.strokeStyle = C.kiko; ctx.lineWidth = 6; ctx.lineCap = "round"; [1, 2, 3].forEach(i => { ctx.beginPath(); ctx.arc(cx, cy + 30, i * 20, -Math.PI * 0.8, -Math.PI * 0.2); ctx.stroke(); }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(cx, cy + 30, 7, 0, Math.PI * 2); ctx.fill(); }
    text(ctx, title, cx, y + h - 66, 24, { align: "center", weight: 900 });
    para(ctx, sub, cx, y + h - 36, 17, w - 24, { align: "center", weight: 700, color: C.ink2 });
    ctx.restore();
  };
  // lembar spesifikasi: rows [[komponen, nilai, catatan, ok]]; opt.title
  Sp.sheet = function (ctx, x, y, w, rows, opt = {}) {
    const rh = opt.rh || 52, h = 60 + rows.length * rh; card(ctx, x, y, w, h, { fill: "#fff", stroke: opt.stroke || "#B7C4CC", lw: 3, r: 14 });
    text(ctx, opt.title || "SPESIFIKASI", x + 18, y + 38, 20, { weight: 900, color: opt.color || C.kiko });
    rows.forEach(([k, v, note, ok], i) => { if (opt.n != null && i >= opt.n) return; const ry = y + 60 + i * rh; if (opt.hl === i) { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 3, ry, w - 6, rh); } text(ctx, k, x + 18, ry + rh / 2 + 7, 19, { weight: 800, color: C.ink2 }); text(ctx, v, x + w * 0.38, ry + rh / 2 + 7, 20, { weight: 900 }); if (note) text(ctx, note, x + w - 18, ry + rh / 2 + 7, 16, { align: "right", weight: 800, color: ok === false ? C.bad : ok ? C.good : C.ink2 }); ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, ry); ctx.lineTo(x + w, ry); ctx.stroke(); });
    return h;
  };
  // brosur iklan fiktif dengan angka besar; marks: {i: "ok"|"?"|"x"}
  Sp.brochure = function (ctx, x, y, w, h, title, items, marks = {}, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 14 }); ctx.fillStyle = C.bad; rr(ctx, x + 14, y + 14, w - 28, 50, 10); ctx.fill(); text(ctx, title, x + w / 2, y + 48, 22, { align: "center", weight: 900, color: "#fff" });
    items.forEach((s, i) => { const iy = y + 104 + i * 46; text(ctx, s, x + 24, iy, 22, { weight: 900 }); const m = marks[i]; if (m) { const col = m === "ok" ? C.good : m === "x" ? C.bad : C.accentDark; text(ctx, m === "ok" ? "◯ paham" : m === "x" ? "✕ tak perlu" : "? belum paham", x + w - 20, iy, 17, { align: "right", weight: 900, color: col }); if (m === "x") { ctx.strokeStyle = C.bad; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 20, iy - 8); ctx.lineTo(x + w * 0.62, iy - 8); ctx.stroke(); } } });
  };
  // batang anggaran bertumpuk: parts [[label, nilai, warna]]; skala ke total maks opt.max
  Sp.budget = function (ctx, x, y, w, parts, opt = {}) {
    const total = parts.reduce((a, p) => a + p[1], 0), max = opt.max || total; let cx = x;
    ctx.fillStyle = "#E6EDF2"; rr(ctx, x, y, w, 60, 12); ctx.fill();
    parts.forEach(([lab, v, col], i) => { if (opt.n != null && i >= opt.n) return; const bw = w * v / max; ctx.fillStyle = col; ctx.fillRect(cx, y, bw, 60); if (bw > 70) text(ctx, lab, cx + bw / 2, y + 38, 16, { align: "center", weight: 900, color: "#fff" }); cx += bw; });
    if (opt.label) text(ctx, opt.label, x, y - 12, 20, { weight: 900, color: C.ink2 });
    if (opt.total !== false) text(ctx, "Rp " + (opt.shown != null ? opt.shown : total).toLocaleString("id-ID") + (opt.unit || " juta"), x + w, y - 12, 20, { align: "right", weight: 900, color: C.accentDark });
  };
  Sp.warn = function (ctx, x, y, w, s, opt = {}) { card(ctx, x, y, w, 56, { fill: opt.ok ? C.goodBg : C.badBg, stroke: opt.ok ? C.good : C.bad, lw: 3, r: 12 }); text(ctx, (opt.ok ? "✓ " : "⚠ ") + s, x + 16, y + 36, 19, { weight: 900, color: opt.ok ? C.good : C.bad }); };
  K.spek = Sp;
})(typeof window !== "undefined" ? window : globalThis);
