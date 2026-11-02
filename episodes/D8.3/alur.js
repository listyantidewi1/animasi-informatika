/* Pembantu gambar D8.3: bentuk flowchart (oval, kotak, jajar genjang, belah ketupat), panah berlabel, token berjalan,
   panel pseudocode dengan indentasi dan sorotan. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, clamp, lerp } = H;
  const Q = {};
  function fillStroke(ctx, hl, kind) { ctx.fillStyle = hl ? "#FFF3D6" : kind === "term" ? "#DCEBF2" : kind === "dec" ? "#FFF9E0" : kind === "io" ? "#EDE6F7" : "#FFFFFF"; ctx.strokeStyle = hl ? C.accent : kind === "dec" ? "#E0B04B" : kind === "term" ? C.kiko : kind === "io" ? "#8E6BBF" : "#7B8B95"; ctx.lineWidth = hl ? 6 : 4; }
  // simpul: kind "term" | "proc" | "io" | "dec"; (cx, cy) pusat; w,h; label
  Q.node = function (ctx, kind, cx, cy, w, h, label, opt = {}) {
    ctx.save(); if (opt.dim) ctx.globalAlpha = 0.25; fillStroke(ctx, opt.hl, kind); ctx.beginPath();
    if (kind === "term") { rr(ctx, cx - w / 2, cy - h / 2, w, h, h / 2); }
    else if (kind === "proc") { rr(ctx, cx - w / 2, cy - h / 2, w, h, 8); }
    else if (kind === "io") { const k = w * 0.12; ctx.moveTo(cx - w / 2 + k, cy - h / 2); ctx.lineTo(cx + w / 2, cy - h / 2); ctx.lineTo(cx + w / 2 - k, cy + h / 2); ctx.lineTo(cx - w / 2, cy + h / 2); ctx.closePath(); }
    else { ctx.moveTo(cx, cy - h / 2); ctx.lineTo(cx + w / 2, cy); ctx.lineTo(cx, cy + h / 2); ctx.lineTo(cx - w / 2, cy); ctx.closePath(); }
    ctx.fill(); ctx.stroke();
    const size = opt.size || 24; const lines = wrap(ctx, label, size, 800, w - (kind === "dec" ? w * 0.3 : 30));
    lines.forEach((ln, i) => text(ctx, ln, cx, cy + size * 0.36 + (i - (lines.length - 1) / 2) * size * 1.2, size, { align: "center", weight: 800, color: C.ink }));
    ctx.restore();
    return { cx, cy, w, h, top: [cx, cy - h / 2], bottom: [cx, cy + h / 2], left: [cx - w / 2, cy], right: [cx + w / 2, cy] };
  };
  // panah antar titik dengan belokan siku: pts = [[x,y],...]; opt.label, opt.on (aktif)
  Q.arrow = function (ctx, pts, opt = {}) {
    ctx.save(); ctx.strokeStyle = opt.on ? C.accent : "#7B8B95"; ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = opt.on ? 6 : 4; ctx.lineJoin = "round";
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
    const a = pts[pts.length - 2], b = pts[pts.length - 1]; const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(b[0] - 16 * Math.cos(ang - 0.45), b[1] - 16 * Math.sin(ang - 0.45)); ctx.lineTo(b[0] - 16 * Math.cos(ang + 0.45), b[1] - 16 * Math.sin(ang + 0.45)); ctx.closePath(); ctx.fill();
    if (opt.label) { const m = pts[Math.min(1, pts.length - 1)]; text(ctx, opt.label, (pts[0][0] + m[0]) / 2 + (opt.dx || 0), (pts[0][1] + m[1]) / 2 + (opt.dy || -10), 22, { align: "center", weight: 900, color: opt.on ? C.accentDark : C.ink2 }); }
    ctx.restore();
  };
  // token (bulatan) di titik
  Q.token = function (ctx, x, y, opt = {}) {
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.25)"; ctx.shadowBlur = 10; ctx.fillStyle = opt.color || C.accent; ctx.beginPath(); ctx.arc(x, y, opt.r || 18, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, (opt.r || 18) - 4, 0, Math.PI * 2); ctx.stroke();
  };
  // jalur token: path = daftar titik; u = 0..1 sepanjang jalur
  Q.along = function (path, u) {
    const segs = []; let total = 0; for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); segs.push(d); total += d; }
    let t = clamp(u, 0, 1) * total; for (let i = 1; i < path.length; i++) { if (t <= segs[i - 1] || i === path.length - 1) { const f = segs[i - 1] ? t / segs[i - 1] : 1; return [lerp(path[i - 1][0], path[i][0], Math.min(1, f)), lerp(path[i - 1][1], path[i][1], Math.min(1, f))]; } t -= segs[i - 1]; }
    return path[path.length - 1];
  };
  // panel pseudocode: lines [{t, ind, hl, kw}] ; kw = baris kata kunci (JIKA/MAKA/LAINNYA) berwarna
  Q.pseudo = function (ctx, x, y, w, lines, opt = {}) {
    const rh = opt.rh || 50; card(ctx, x, y, w, 60 + rh * lines.length, { fill: "#FFFFFF", stroke: "#B7C4CC", lw: 3, r: 14 });
    text(ctx, opt.title || "PSEUDOCODE", x + 20, y + 38, 22, { weight: 900, color: C.ink2 });
    lines.forEach((ln, i) => { const ly = y + 60 + i * rh; if (ln.hl) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 8, ly + 4, w - 16, rh - 8, 8); ctx.fill(); } if (ln.bad) { ctx.fillStyle = C.badBg; rr(ctx, x + 8, ly + 4, w - 16, rh - 8, 8); ctx.fill(); } if (ln.good) { ctx.fillStyle = C.goodBg; rr(ctx, x + 8, ly + 4, w - 16, rh - 8, 8); ctx.fill(); }
      text(ctx, String(i + 1), x + 34, ly + rh / 2 + 9, 22, { align: "center", weight: 900, color: C.ink2 });
      const parts = ln.t.split(/(JIKA|MAKA|LAINNYA)/); let cx = x + 60 + (ln.ind || 0) * 40; parts.forEach(p => { if (!p) return; const kw = /^(JIKA|MAKA|LAINNYA)$/.test(p); text(ctx, p, cx, ly + rh / 2 + 9, opt.size || 26, { weight: kw ? 900 : 700, color: kw ? C.kiko : ln.bad ? C.bad : ln.good ? C.good : C.ink }); ctx.font = `${kw ? 900 : 700} ${opt.size || 26}px Inter, sans-serif`; cx += ctx.measureText(p).width; }); });
  };
  // kartu langkah (unplugged)
  Q.stepCard = function (ctx, x, y, w, h, n, label, opt = {}) {
    card(ctx, x, y, w, h, { fill: opt.hl ? "#FFF3D6" : "#FFF9E0", stroke: opt.hl ? C.accent : "#E0B04B", lw: 3, r: 12 });
    if (n != null) { ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(x + 28, y + 28, 18, 0, Math.PI * 2); ctx.fill(); text(ctx, String(n), x + 28, y + 36, 20, { align: "center", color: "#fff", weight: 900 }); }
    const lines = wrap(ctx, label, 24, 800, w - 30); lines.forEach((ln, i) => text(ctx, ln, x + w / 2, y + h / 2 + 8 + (i - (lines.length - 1) / 2) * 30, 24, { align: "center", weight: 800 }));
  };
  K.alur = Q;
})(typeof window !== "undefined" ? window : globalThis);
