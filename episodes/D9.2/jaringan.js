/* Pembantu gambar D9.2: router, titik akses Wi-Fi dengan gelombang, server/rak pusat data, awan ISP, kabel, paket data berjalan,
   kartu alamat IP, rumah/gedung sekolah, laptop, printer. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, wrap, card, clamp, lerp } = H;
  const Q = {};
  Q.router = function (ctx, cx, cy, s, opt = {}) {
    ctx.fillStyle = "#2F3B45"; rr(ctx, cx - s * 0.6, cy - s * 0.18, s * 1.2, s * 0.36, s * 0.08); ctx.fill();
    [-0.35, 0.35].forEach(dx => { ctx.strokeStyle = "#2F3B45"; ctx.lineWidth = s * 0.06; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(cx + dx * s, cy - s * 0.18); ctx.lineTo(cx + dx * s * 1.2, cy - s * 0.6); ctx.stroke(); });
    [0, 1, 2, 3].forEach(i => { ctx.fillStyle = opt.off ? "#7B8B95" : i === 2 && opt.alert ? C.bad : C.good; ctx.beginPath(); ctx.arc(cx - s * 0.3 + i * s * 0.2, cy, s * 0.04, 0, Math.PI * 2); ctx.fill(); });
    if (opt.label !== false) text(ctx, opt.label || "router", cx, cy + s * 0.5, 22, { align: "center", weight: 800, color: C.ink2 });
  };
  Q.waves = function (ctx, cx, cy, r, n, opt = {}) { for (let i = 1; i <= n; i++) { ctx.strokeStyle = opt.color || C.kiko; ctx.globalAlpha = opt.alpha != null ? opt.alpha : 1 - (i - 1) / (n + 1); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, r * i, -Math.PI * 0.75, -Math.PI * 0.25); ctx.stroke(); } ctx.globalAlpha = 1; };
  Q.server = function (ctx, cx, cy, w, h, opt = {}) {
    ctx.fillStyle = "#2F3B45"; rr(ctx, cx - w / 2, cy - h / 2, w, h, 10); ctx.fill();
    const rows = Math.floor(h / 40); for (let i = 0; i < rows; i++) { ctx.fillStyle = "#4A5A66"; rr(ctx, cx - w / 2 + 10, cy - h / 2 + 10 + i * 40, w - 20, 28, 5); ctx.fill(); ctx.fillStyle = (i + (opt.tick || 0)) % 3 === 0 ? C.good : "#8FD0E6"; ctx.beginPath(); ctx.arc(cx + w / 2 - 24, cy - h / 2 + 24 + i * 40, 5, 0, Math.PI * 2); ctx.fill(); }
    if (opt.label !== false) text(ctx, opt.label || "server", cx, cy + h / 2 + 30, 24, { align: "center", weight: 800, color: C.ink2 });
  };
  Q.cloud = function (ctx, cx, cy, s, label, opt = {}) {
    const circ = [[-0.5, 0.1, 0.35], [-0.1, -0.2, 0.45], [0.4, 0, 0.4], [0, 0.25, 0.4]];
    const path = () => { ctx.beginPath(); circ.forEach(([dx, dy, r]) => { ctx.moveTo(cx + dx * s + r * s, cy + dy * s); ctx.arc(cx + dx * s, cy + dy * s, r * s, 0, Math.PI * 2); }); };
    ctx.strokeStyle = opt.stroke || C.kiko; ctx.lineWidth = 8; path(); ctx.stroke();
    ctx.fillStyle = opt.fill || "#DCEBF2"; path(); ctx.fill();
    if (label) { const lines = wrap(ctx, label, opt.size || 26, 900, s * 1.6); lines.forEach((ln, i) => text(ctx, ln, cx, cy + 8 + (i - (lines.length - 1) / 2) * 30, opt.size || 26, { align: "center", weight: 900, color: opt.color || C.kiko })); }
  };
  Q.cable = function (ctx, pts, opt = {}) { ctx.strokeStyle = opt.color || "#7B8B95"; ctx.lineWidth = opt.lw || 6; ctx.lineJoin = "round"; ctx.setLineDash(opt.dash ? [12, 10] : []); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.setLineDash([]); };
  Q.along = function (path, u) { const segs = []; let total = 0; for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); segs.push(d); total += d; } let t = clamp(u, 0, 1) * total; for (let i = 1; i < path.length; i++) { if (t <= segs[i - 1] || i === path.length - 1) { const f = segs[i - 1] ? Math.min(1, t / segs[i - 1]) : 1; return [lerp(path[i - 1][0], path[i][0], f), lerp(path[i - 1][1], path[i][1], f)]; } t -= segs[i - 1]; } return path[path.length - 1]; };
  Q.packet = function (ctx, x, y, n, opt = {}) { ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.25)"; ctx.shadowBlur = 8; ctx.fillStyle = opt.color || C.accent; rr(ctx, x - 22, y - 16, 44, 32, 6); ctx.fill(); ctx.restore(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; rr(ctx, x - 22, y - 16, 44, 32, 6); ctx.stroke(); if (n != null) text(ctx, String(n), x, y + 7, 18, { align: "center", weight: 900, color: "#fff" }); };
  Q.ipTag = function (ctx, cx, cy, ip, opt = {}) { const w = opt.w || 190; card(ctx, cx - w / 2, cy - 18, w, 36, { fill: opt.fill || "#FFF9E0", stroke: opt.stroke || "#E0B04B", lw: 2, r: 8 }); text(ctx, ip, cx, cy + 7, 20, { align: "center", weight: 900, color: C.ink }); };
  Q.house = function (ctx, cx, baseY, w, h, label, opt = {}) { ctx.fillStyle = opt.fill || "#FFF9E0"; ctx.strokeStyle = opt.stroke || "#E0B04B"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - w / 2, baseY); ctx.lineTo(cx - w / 2, baseY - h); ctx.lineTo(cx, baseY - h - w * 0.3); ctx.lineTo(cx + w / 2, baseY - h); ctx.lineTo(cx + w / 2, baseY); ctx.closePath(); ctx.fill(); ctx.stroke(); if (label) text(ctx, label, cx, baseY + 30, 24, { align: "center", weight: 800, color: C.ink2 }); };
  Q.laptop = function (ctx, cx, cy, s) { ctx.fillStyle = "#2F3B45"; rr(ctx, cx - s * 0.5, cy - s * 0.4, s, s * 0.62, 6); ctx.fill(); ctx.fillStyle = "#DCEBF2"; rr(ctx, cx - s * 0.44, cy - s * 0.34, s * 0.88, s * 0.5, 4); ctx.fill(); ctx.fillStyle = "#4A5A66"; rr(ctx, cx - s * 0.6, cy + s * 0.22, s * 1.2, s * 0.08, 3); ctx.fill(); };
  Q.printer = function (ctx, cx, cy, s) { ctx.fillStyle = "#7B8B95"; rr(ctx, cx - s * 0.5, cy - s * 0.2, s, s * 0.4, 6); ctx.fill(); ctx.fillStyle = "#4A5A66"; rr(ctx, cx - s * 0.35, cy - s * 0.4, s * 0.7, s * 0.22, 4); ctx.fill(); ctx.fillStyle = "#fff"; rr(ctx, cx - s * 0.3, cy + s * 0.15, s * 0.6, s * 0.3, 3); ctx.fill(); };
  Q.phoneSmall = function (ctx, cx, cy, s, opt = {}) { ctx.fillStyle = "#2F3B45"; rr(ctx, cx - s * 0.28, cy - s * 0.5, s * 0.56, s, s * 0.1); ctx.fill(); ctx.fillStyle = opt.screen || "#DCEBF2"; rr(ctx, cx - s * 0.23, cy - s * 0.42, s * 0.46, s * 0.84, s * 0.06); ctx.fill(); if (opt.label) text(ctx, opt.label, cx, cy + s * 0.5 + 28, 22, { align: "center", weight: 800, color: C.ink2 }); };
  Q.tower = function (ctx, cx, baseY, h) { ctx.strokeStyle = "#7B8B95"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx - 24, baseY); ctx.lineTo(cx, baseY - h); ctx.lineTo(cx + 24, baseY); ctx.moveTo(cx - 14, baseY - h * 0.4); ctx.lineTo(cx + 14, baseY - h * 0.4); ctx.moveTo(cx - 8, baseY - h * 0.7); ctx.lineTo(cx + 8, baseY - h * 0.7); ctx.stroke(); Q.waves(ctx, cx, baseY - h, 18, 3, { color: C.accent }); };
  K.jaringan = Q;
})(typeof window !== "undefined" ? window : globalThis);
