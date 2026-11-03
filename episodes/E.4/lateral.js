/* Pembantu gambar E.4: jendela peramban dengan tab, halaman situs fiktif, kueri pencarian beroperator, kartu hasil,
   kartu tab lateral, lencana tanda bahaya, kartu konten negatif. Gaya diagram Fase E. Semua situs fiktif. Muat setelah kiko-core.js, kiko-devices.js, pencari.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices, Pc = K.pencari;
  const { rr, text, wrap, card, clamp } = H;
  const L = {};
  // jendela peramban dengan deretan tab; tabs = [{title, active}]; mengembalikan area isi
  L.browser = function (ctx, x, y, w, h, tabs, url, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#fff", stroke: "#C9D4DB", lw: 3, r: 14 });
    ctx.fillStyle = "#E6EDF2"; rr(ctx, x, y, w, 50, 14); ctx.fill(); ctx.fillRect(x, y + 25, w, 25);
    let tx = x + 12; tabs.forEach(t => { const tw = Math.min(260, t.title.length * 11 + 40); ctx.fillStyle = t.active ? "#fff" : "#D5DEE4"; rr(ctx, tx, y + 10, tw, 40, 8); ctx.fill(); if (t.hl) { ctx.strokeStyle = C.accent; ctx.lineWidth = 4; rr(ctx, tx, y + 10, tw, 40, 8); ctx.stroke(); } ctx.font = `${t.active ? 900 : 700} 17px ${K.FONT}`; let tt = t.title; if (ctx.measureText(tt).width > tw - 22) { while (tt.length > 1 && ctx.measureText(tt + "…").width > tw - 22) tt = tt.slice(0, -1); tt = tt.trimEnd() + "…"; } text(ctx, tt, tx + 12, y + 36, 17, { weight: t.active ? 900 : 700, color: t.active ? C.ink : C.ink2 }); tx += tw + 6; });
    if (opt.plus) { ctx.fillStyle = "#D5DEE4"; rr(ctx, tx, y + 10, 40, 40, 8); ctx.fill(); text(ctx, "+", tx + 20, y + 38, 26, { align: "center", weight: 900, color: C.ink2 }); }
    ctx.fillStyle = "#F4F8FB"; rr(ctx, x + 12, y + 60, w - 24, 36, 10); ctx.fill(); text(ctx, (opt.https !== false ? "🔒 " : "⚠ ") + url, x + 26, y + 85, 17, { weight: 700, color: opt.https === false ? C.bad : C.ink2 });
    return { x: x + 12, y: y + 108, w: w - 24, h: h - 120 };
  };
  // halaman situs fiktif: logo + judul + paragraf palsu + kutipan; opt.flags = [{x,y,label}] tanda bahaya
  L.site = function (ctx, a, opt = {}) {
    ctx.fillStyle = opt.color || "#1F5A6E"; rr(ctx, a.x, a.y, a.w, 54, 8); ctx.fill(); text(ctx, opt.logo || "🏛️ Institut Sehat Nusantara", a.x + 16, a.y + 36, 20, { weight: 900, color: "#fff" });
    const lines = wrap(ctx, opt.title || "Vaksin X Terbukti Berbahaya, Kata Dewan Pakar", 24, 900, a.w - 32); let cy = a.y + 94; lines.forEach(ln => { text(ctx, ln, a.x + 16, cy, 24, { weight: 900 }); cy += 30; });
    text(ctx, opt.by || "oleh: Tim Redaksi · tanpa tanggal", a.x + 16, cy + 6, 15, { weight: 700, color: C.muted }); cy += 28;
    for (let i = 0; i < (opt.paras || 6); i++) { ctx.fillStyle = "#D7E2DC"; rr(ctx, a.x + 16, cy + i * 20, (a.w - 32) * (0.55 + ((i * 7) % 5) * 0.09), 10, 5); ctx.fill(); }
    cy += (opt.paras || 6) * 20 + 10;
    if (opt.quote) { ctx.fillStyle = "#FFF9E0"; rr(ctx, a.x + 16, cy, a.w - 32, 46, 8); ctx.fill(); text(ctx, "“" + opt.quote + "”", a.x + 28, cy + 30, 16, { weight: 800, color: C.ink2 }); cy += 56; }
    if (opt.share) { ctx.fillStyle = C.bad; rr(ctx, a.x + 16, cy, 220, 40, 8); ctx.fill(); text(ctx, "BAGIKAN SEKARANG!", a.x + 126, cy + 27, 16, { align: "center", weight: 900, color: "#fff" }); }
    return cy;
  };
  // kueri dengan operator disorot: parts = [[teks, jenis]] jenis: "kw"|"op"
  L.query = function (ctx, x, y, w, parts, opt = {}) {
    card(ctx, x, y, w, 70, { fill: C.panel, stroke: opt.stroke || "#B7C4CC", lw: 4, r: 35 }); text(ctx, "🔍", x + 22, y + 47, 26);
    let cx = x + 70; parts.forEach(([t, k]) => { ctx.font = `${k === "op" ? 900 : 700} 26px Inter, sans-serif`; const tw = ctx.measureText(t).width; if (k === "op") { ctx.fillStyle = "#FFF3D6"; rr(ctx, cx - 6, y + 16, tw + 12, 40, 8); ctx.fill(); } text(ctx, t, cx, y + 45, 26, { weight: k === "op" ? 900 : 700, color: k === "op" ? C.accentDark : C.ink }); cx += tw + 14; });
  };
  // lencana tanda bahaya kecil
  L.flag = function (ctx, x, y, label) { ctx.fillStyle = C.badBg; ctx.strokeStyle = C.bad; ctx.lineWidth = 3; const w = label.length * 10 + 40; rr(ctx, x, y, w, 34, 8); ctx.fill(); ctx.stroke(); text(ctx, "⚠ " + label, x + 10, y + 24, 16, { weight: 900, color: C.bad }); return w; };
  // kartu konten negatif / tindakan
  L.action = function (ctx, x, y, w, icon, title, sub, opt = {}) { ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2; card(ctx, x, y, w, 120, { fill: opt.on ? "#FFF3D6" : C.bg2, stroke: opt.on ? C.accent : undefined, lw: 4, r: 16 }); text(ctx, icon, x + 50, y + 75, 44, { align: "center" }); text(ctx, title, x + 100, y + 52, 26, { weight: 900 }); text(ctx, sub, x + 100, y + 88, 19, { weight: 700, color: C.ink2 }); ctx.restore(); };
  K.lateral = L;
})(typeof window !== "undefined" ? window : globalThis);
