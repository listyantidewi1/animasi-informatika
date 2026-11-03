/* Pembantu gambar F11.1: lingkaran enam tahap, kartu kebutuhan, alur layar (wireframe), tabel kasus uji, kartu versi/catatan perubahan,
   kartu bug. Gaya diagram Fase F. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, wrap, card, clamp } = H;
  const A = {};
  A.STAGES = [["1", "Kebutuhan", "📋"], ["2", "Desain", "✏️"], ["3", "Implementasi", "💻"], ["4", "Pengujian", "🧪"], ["5", "Rilis", "🚀"], ["6", "Pemeliharaan", "🔧"]];
  // lingkaran enam tahap; active indeks; opt.r
  A.cycle = function (ctx, cx, cy, r, active, opt = {}) {
    ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i + 0.5) * Math.PI / 3; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2); ctx.fillStyle = "#7B8B95"; ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(12, 10); ctx.lineTo(-12, 10); ctx.closePath(); ctx.fill(); ctx.restore(); }
    A.STAGES.forEach(([n, t, ic], i) => { const a = -Math.PI / 2 + i * Math.PI / 3; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; const on = active === i, dim = opt.n != null && i >= opt.n; ctx.save(); if (dim) ctx.globalAlpha = 0.2; card(ctx, x - 120, y - 40, 240, 80, { fill: on ? "#FFF3D6" : "#fff", stroke: on ? C.accent : "#B7C4CC", lw: on ? 6 : 3, r: 14 }); text(ctx, ic, x - 90, y + 12, 30, { align: "center" }); text(ctx, n + ". " + t, x + 10, y + 9, 22, { align: "center", weight: 900 }); ctx.restore(); });
    if (opt.center) text(ctx, opt.center, cx, cy + 10, 26, { align: "center", weight: 900, color: C.kiko });
  };
  // kartu kebutuhan: kind "wajib"|"tambahan"
  A.need = function (ctx, x, y, w, s, kind, opt = {}) { ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2; const col = kind === "wajib" ? C.good : C.accentDark, bg = kind === "wajib" ? C.goodBg : "#FFF3D6"; card(ctx, x, y, w, 60, { fill: kind ? bg : "#fff", stroke: kind ? col : "#B7C4CC", lw: 3, r: 12 }); text(ctx, s, x + 16, y + 38, 22, { weight: 800 }); if (kind) { ctx.fillStyle = col; rr(ctx, x + w - 120, y + 14, 106, 32, 8); ctx.fill(); text(ctx, kind.toUpperCase(), x + w - 67, y + 36, 15, { align: "center", weight: 900, color: "#fff" }); } ctx.restore(); };
  // wireframe layar HP sederhana: title, rows [[label, kind]] kind "big"|"btn"|"field"|"row"
  A.wire = function (ctx, cx, cy, title, rows, opt = {}) {
    const sc = D.phone(ctx, cx, cy, 260, 420); ctx.fillStyle = "#fff"; rr(ctx, sc.x, sc.y, sc.w, sc.h, 26); ctx.fill();
    text(ctx, title, cx, sc.y + 50, 20, { align: "center", weight: 900 }); let y = sc.y + 80;
    rows.forEach(([lab, kind]) => { if (kind === "big") { text(ctx, lab, cx, y + 40, 36, { align: "center", weight: 900, color: C.kiko }); y += 70; } else if (kind === "btn") { ctx.fillStyle = C.kiko; rr(ctx, sc.x + 30, y, sc.w - 60, 46, 12); ctx.fill(); text(ctx, lab, cx, y + 30, 18, { align: "center", weight: 900, color: "#fff" }); y += 60; } else if (kind === "field") { ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 2; ctx.fillStyle = "#F4F8FB"; rr(ctx, sc.x + 20, y, sc.w - 40, 40, 8); ctx.fill(); ctx.stroke(); text(ctx, lab, sc.x + 32, y + 26, 15, { weight: 700, color: C.ink2 }); y += 50; } else { ctx.fillStyle = "#EAF2EE"; rr(ctx, sc.x + 20, y, sc.w - 40, 34, 6); ctx.fill(); text(ctx, lab, sc.x + 30, y + 23, 14, { weight: 800 }); y += 42; } });
    return sc;
  };
  // tabel kasus uji: rows [[kasus, masukan, harapan, hasil]] hasil "ok"|"bug"|""
  A.tests = function (ctx, x, y, rows, opt = {}) {
    const cw = [150, 240, 320, 110], rh = 50, W = cw.reduce((a, b) => a + b, 0); card(ctx, x, y, W, rh * (rows.length + 1), { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 10 }); ctx.fillStyle = C.bg2; rr(ctx, x, y, W, rh, 10); ctx.fill(); ctx.fillRect(x, y + rh / 2, W, rh / 2);
    let cx = x; ["kasus", "input", "harapan", "hasil"].forEach((h, c) => { text(ctx, h, cx + 12, y + rh / 2 + 7, 18, { weight: 900, color: C.ink2 }); cx += cw[c]; });
    rows.forEach((r, i) => { if (opt.n != null && i >= opt.n) return; const ry = y + rh * (i + 1); let cx = x; r.forEach((v, c) => { if (c === 3) { if (v) { ctx.fillStyle = v === "ok" ? C.goodBg : C.badBg; ctx.fillRect(cx + 1, ry + 1, cw[c] - 2, rh - 2); text(ctx, v === "ok" ? "✓ lolos" : "✕ bug", cx + cw[c] / 2, ry + rh / 2 + 7, 18, { align: "center", weight: 900, color: v === "ok" ? C.good : C.bad }); } } else text(ctx, v, cx + 12, ry + rh / 2 + 7, 18, { weight: c === 0 ? 900 : 700 }); cx += cw[c]; }); });
  };
  // kartu versi / catatan perubahan
  A.version = function (ctx, x, y, w, ver, lines, opt = {}) { const h = 60 + lines.length * 32 + 10; card(ctx, x, y, w, h, { fill: opt.fill || "#fff", stroke: opt.stroke || C.kiko, lw: 4, r: 14 }); ctx.fillStyle = C.kiko; rr(ctx, x + 14, y + 14, 110, 34, 8); ctx.fill(); text(ctx, "v" + ver, x + 69, y + 38, 20, { align: "center", weight: 900, color: "#fff" }); text(ctx, opt.title || "catatan perubahan", x + 140, y + 38, 18, { weight: 800, color: C.ink2 }); lines.forEach((s, i) => text(ctx, s, x + 20, y + 84 + i * 32, 19, { weight: 800 })); return h; };
  A.bug = function (ctx, x, y, w, title, lines) { card(ctx, x, y, w, 56 + lines.length * 28, { fill: C.badBg, stroke: C.bad, lw: 3, r: 12 }); text(ctx, "🐞 " + title, x + 16, y + 34, 20, { weight: 900, color: C.bad }); lines.forEach((s, i) => text(ctx, s, x + 16, y + 66 + i * 28, 17, { weight: 800 })); };
  K.alurdev = A;
})(typeof window !== "undefined" ? window : globalThis);
