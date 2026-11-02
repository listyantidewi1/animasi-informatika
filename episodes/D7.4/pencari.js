/* Pembantu gambar D7.4: halaman web mini, laba-laba perayap, tautan, lemari & kartu indeks, papan peringkat, kotak pencarian,
   daftar hasil, rak buku. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, wrap, card, ease, clamp, lerp } = H;
  const Q = {};
  // halaman web mini: judul + garis teks; opt.words = kata yang disorot
  Q.page = function (ctx, x, y, w, h, title, opt = {}) {
    card(ctx, x, y, w, h, { fill: opt.fill || "#FFFFFF", stroke: opt.stroke || "#C9D4DB", lw: opt.lw || 3, r: 12 });
    ctx.fillStyle = "#E6EDF2"; rr(ctx, x, y, w, 26, 12); ctx.fill(); ctx.fillRect(x, y + 14, w, 12);
    text(ctx, title, x + 12, y + 56, Math.min(24, w * 0.09), { weight: 900 });
    const lines = Math.floor((h - 80) / 18);
    for (let i = 0; i < lines; i++) { ctx.fillStyle = "#D7E2DC"; rr(ctx, x + 12, y + 72 + i * 18, (w - 24) * (0.6 + ((i * 7) % 5) * 0.08), 8, 4); ctx.fill(); }
    (opt.words || []).forEach((wd, i) => { ctx.fillStyle = "#FFF3B0"; rr(ctx, x + 12 + (i % 2) * (w / 2 - 10), y + 72 + Math.floor(i / 2) * 36, w / 2 - 24, 24, 6); ctx.fill(); text(ctx, wd, x + 16 + (i % 2) * (w / 2 - 10), y + 90 + Math.floor(i / 2) * 36, 18, { weight: 800 }); });
  };
  // laba-laba perayap
  Q.spider = function (ctx, cx, cy, s, opt = {}) {
    ctx.save(); ctx.translate(cx, cy); ctx.strokeStyle = C.kikoDark; ctx.lineWidth = s * 0.08; ctx.lineCap = "round";
    for (let i = 0; i < 4; i++) { const a = -0.9 + i * 0.6; [1, -1].forEach(sg => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(sg * s * 0.6 * Math.cos(a), s * 0.5 * Math.sin(a) + s * 0.1); ctx.lineTo(sg * s * 0.8 * Math.cos(a), s * 0.5 * Math.sin(a) + s * 0.45); ctx.stroke(); }); }
    ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.42, s * 0.34, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.kikoLight; ctx.beginPath(); ctx.arc(-s * 0.12, -s * 0.08, s * 0.08, 0, Math.PI * 2); ctx.arc(s * 0.12, -s * 0.08, s * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.pupil; ctx.beginPath(); ctx.arc(-s * 0.12, -s * 0.08, s * 0.04, 0, Math.PI * 2); ctx.arc(s * 0.12, -s * 0.08, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    if (opt.label) text(ctx, opt.label, cx, opt.above ? cy - s * 0.75 : cy + s * 0.85, 24, { align: "center", weight: 800, color: C.ink2 });
  };
  Q.link = function (ctx, x1, y1, x2, y2, on) { ctx.strokeStyle = on ? C.accent : "#B7C4CC"; ctx.lineWidth = on ? 6 : 4; ctx.setLineDash(on ? [] : [10, 10]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]); };
  // lemari indeks dengan laci berlabel
  Q.cabinet = function (ctx, x, y, w, h, labels, opt = {}) {
    ctx.fillStyle = "#A4653A"; rr(ctx, x, y, w, h, 14); ctx.fill();
    const rows = labels.length, dh = (h - 20) / rows;
    labels.forEach((lab, i) => { const dy = y + 10 + i * dh; const on = opt.open === i; ctx.fillStyle = on ? "#F2B134" : "#C98A57"; rr(ctx, x + 12 + (on ? 20 : 0), dy + 6, w - 24, dh - 12, 8); ctx.fill(); ctx.fillStyle = "#fff"; rr(ctx, x + w / 2 - 70 + (on ? 20 : 0), dy + dh / 2 - 16, 140, 32, 6); ctx.fill(); text(ctx, lab, x + w / 2 + (on ? 20 : 0), dy + dh / 2 + 9, 24, { align: "center", weight: 900 }); });
  };
  // kartu indeks: kata -> daftar halaman
  Q.indexCard = function (ctx, x, y, w, word, pages, opt = {}) {
    card(ctx, x, y, w, 60 + 44 * Math.ceil(pages.length / 1), { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 10 });
    text(ctx, word, x + 20, y + 40, 32, { weight: 900, color: C.accentDark });
    pages.forEach((p, i) => { const on = (opt.hl || []).includes(p); if (on) { ctx.fillStyle = C.goodBg; rr(ctx, x + 12, y + 56 + i * 44, w - 24, 40, 8); ctx.fill(); } text(ctx, "halaman " + p, x + 24, y + 84 + i * 44, 26, { weight: on ? 900 : 700, color: on ? C.good : C.ink }); });
  };
  // kotak pencarian
  Q.searchBox = function (ctx, x, y, w, s, opt = {}) {
    card(ctx, x, y, w, 80, { fill: C.panel, stroke: opt.stroke || "#B7C4CC", lw: 4, r: 40 });
    text(ctx, "🔍", x + 24, y + 54, 30);
    text(ctx, s, x + 80, y + 52, opt.size || 32, { weight: 700, color: opt.color || C.ink });
  };
  // daftar hasil pencarian; items: [{title, url, ad, date, bad}], hl = indeks disorot
  Q.results = function (ctx, x, y, w, items, opt = {}) {
    items.forEach((it, i) => {
      const ry = y + i * 118; const on = opt.hl === i;
      card(ctx, x, ry, w, 104, { fill: it.ad ? "#FFF9E0" : on ? C.goodBg : C.panel, stroke: on ? C.good : it.ad ? "#E0B04B" : "#D7E2DC", lw: on ? 5 : 3, r: 14 });
      if (it.ad) { ctx.fillStyle = "#E0B04B"; rr(ctx, x + 16, ry + 14, 70, 26, 6); ctx.fill(); text(ctx, "Iklan", x + 51, ry + 33, 18, { align: "center", weight: 900, color: "#fff" }); }
      text(ctx, it.title, x + (it.ad ? 100 : 20), ry + 40, 28, { weight: 900, color: it.bad ? C.ink2 : C.kiko });
      text(ctx, it.url + (it.date ? "  ·  " + it.date : ""), x + 20, ry + 78, 22, { weight: 700, color: C.ink2 });
      if (opt.scores) text(ctx, opt.scores[i], x + w - 20, ry + 60, 30, { align: "right", weight: 900, color: C.accentDark });
      if (it.mark) text(ctx, it.mark, x + w - 20, ry + 62, 36, { align: "right", weight: 900, color: it.mark === "✓" ? C.good : C.bad });
    });
  };
  // rak buku
  Q.shelf = function (ctx, x, y, w, rows, opt = {}) {
    for (let r = 0; r < rows; r++) { const ry = y + r * 120; ctx.fillStyle = "#A4653A"; ctx.fillRect(x, ry + 100, w, 14); let bx = x + 10; let i = 0; while (bx < x + w - 30) { const bw = 22 + ((i * 7) % 4) * 6, on = opt.hl && opt.hl.includes(r * 100 + i); ctx.fillStyle = on ? C.accent : ["#8E6BBF", "#2E7E9A", "#D9443B", "#2E9E5B", "#C98A57"][(i + r) % 5]; rr(ctx, bx, ry + 20 + ((i * 3) % 3) * 6, bw, 80 - ((i * 3) % 3) * 6, 3); ctx.fill(); bx += bw + 6; i++; } }
  };
  K.pencari = Q;
})(typeof window !== "undefined" ? window : globalThis);
