/* Pembantu gambar D7.2: bagian dalam komputer (prosesor, RAM, hard disk), alat input/output (mikrofon, kamera, speaker, printer),
   dan papan alur input → proses → output → penyimpanan dengan denyut "H" yang berjalan. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, card, ease, clamp, lerp } = H;
  const M = {};
  const DARK = "#2B3A46", CHIP = "#3E4C59", GOLD = "#E0B04B", GREEN_PCB = "#2E6B4F";

  // prosesor (chip persegi dengan kaki)
  M.chip = function (ctx, cx, cy, s, opt = {}) {
    ctx.save(); ctx.translate(cx, cy);
    ctx.strokeStyle = "#9AAFA6"; ctx.lineWidth = s * 0.05; for (let i = -3; i <= 3; i++) { const p = i * s * 0.14; ctx.beginPath(); ctx.moveTo(p, -s * 0.62); ctx.lineTo(p, -s * 0.5); ctx.moveTo(p, s * 0.5); ctx.lineTo(p, s * 0.62); ctx.moveTo(-s * 0.62, p); ctx.lineTo(-s * 0.5, p); ctx.moveTo(s * 0.5, p); ctx.lineTo(s * 0.62, p); ctx.stroke(); }
    ctx.fillStyle = opt.hot ? "#F2B134" : CHIP; rr(ctx, -s / 2, -s / 2, s, s, s * 0.12); ctx.fill();
    ctx.fillStyle = opt.hot ? "#FFF3D6" : "#6B7B88"; rr(ctx, -s * 0.3, -s * 0.3, s * 0.6, s * 0.6, s * 0.08); ctx.fill();
    text(ctx, opt.label || "CPU", 0, s * 0.12, s * 0.3, { align: "center", weight: 900, color: opt.hot ? C.accentDark : "#fff" });
    ctx.restore();
  };
  // RAM (keping memanjang dengan chip kecil); opt.cells = teks di sel (isi sementara)
  M.ram = function (ctx, x, y, w, h, opt = {}) {
    ctx.fillStyle = GREEN_PCB; rr(ctx, x, y, w, h, 10); ctx.fill();
    ctx.fillStyle = GOLD; for (let i = 0; i < 12; i++) ctx.fillRect(x + 14 + i * (w - 28) / 12, y + h - 10, (w - 28) / 12 - 6, 10);
    const n = 6, cw = (w - 40) / n;
    for (let i = 0; i < n; i++) { const c = (opt.cells || [])[i]; ctx.fillStyle = c ? "#FFF3D6" : DARK; rr(ctx, x + 20 + i * cw, y + 14, cw - 8, h - 40, 6); ctx.fill(); if (c) text(ctx, c, x + 20 + i * cw + (cw - 8) / 2, y + 14 + (h - 40) / 2 + 12, Math.min(34, h * 0.45), { align: "center", weight: 900, color: C.ink }); }
    if (opt.label !== false) text(ctx, opt.label || "RAM", x + w / 2, y - 14, 28, { align: "center", weight: 900, color: C.ink2 });
  };
  // hard disk / SSD (kotak dengan piringan)
  M.disk = function (ctx, cx, cy, s, opt = {}) {
    ctx.save(); ctx.translate(cx, cy);
    ctx.fillStyle = "#6B7B88"; rr(ctx, -s * 0.6, -s * 0.45, s * 1.2, s * 0.9, s * 0.1); ctx.fill();
    ctx.fillStyle = "#B7C4CC"; ctx.beginPath(); ctx.arc(-s * 0.12, 0, s * 0.32, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#6B7B88"; ctx.beginPath(); ctx.arc(-s * 0.12, 0, s * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#E6EDF2"; ctx.lineWidth = s * 0.05; ctx.beginPath(); ctx.moveTo(s * 0.4, -s * 0.3); ctx.lineTo(0, -s * 0.05); ctx.stroke();
    if (opt.full !== undefined) { ctx.fillStyle = C.good; rr(ctx, -s * 0.55, s * 0.3, s * 1.1 * opt.full, s * 0.1, 4); ctx.fill(); }
    ctx.restore();
    if (opt.label) text(ctx, opt.label, cx, cy + s * 0.75, 28, { align: "center", weight: 900, color: C.ink2 });
  };
  M.ssd = function (ctx, cx, cy, s) { ctx.fillStyle = GREEN_PCB; rr(ctx, cx - s * 0.7, cy - s * 0.2, s * 1.4, s * 0.4, 8); ctx.fill(); ctx.fillStyle = CHIP; for (let i = 0; i < 4; i++) { rr(ctx, cx - s * 0.6 + i * s * 0.33, cy - s * 0.12, s * 0.26, s * 0.24, 4); ctx.fill(); } ctx.fillStyle = GOLD; ctx.fillRect(cx + s * 0.5, cy - s * 0.1, s * 0.2, s * 0.2); };
  M.flashdisk = function (ctx, cx, cy, s) { ctx.fillStyle = C.kiko; rr(ctx, cx - s * 0.5, cy - s * 0.22, s * 0.7, s * 0.44, 8); ctx.fill(); ctx.fillStyle = "#B7C4CC"; rr(ctx, cx + s * 0.2, cy - s * 0.14, s * 0.3, s * 0.28, 3); ctx.fill(); };
  M.sdcard = function (ctx, cx, cy, s) { ctx.fillStyle = "#1F2A33"; ctx.beginPath(); ctx.moveTo(cx - s * 0.3, cy - s * 0.4); ctx.lineTo(cx + s * 0.2, cy - s * 0.4); ctx.lineTo(cx + s * 0.3, cy - s * 0.3); ctx.lineTo(cx + s * 0.3, cy + s * 0.4); ctx.lineTo(cx - s * 0.3, cy + s * 0.4); ctx.closePath(); ctx.fill(); ctx.fillStyle = GOLD; for (let i = 0; i < 4; i++) ctx.fillRect(cx - s * 0.22 + i * s * 0.12, cy - s * 0.34, s * 0.07, s * 0.14); };
  M.cloud = function (ctx, cx, cy, s) { ctx.fillStyle = "#8FD0E6"; [[0, 0, 0.5], [-0.5, 0.15, 0.35], [0.5, 0.15, 0.35], [-0.2, -0.25, 0.35], [0.25, -0.2, 0.3]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(cx + dx * s, cy + dy * s, r * s, 0, Math.PI * 2); ctx.fill(); }); ctx.fillRect(cx - s * 0.75, cy + s * 0.1, s * 1.5, s * 0.4); };
  // alat input/output kecil
  M.mic = function (ctx, cx, cy, s) { ctx.fillStyle = "#4A5A66"; rr(ctx, cx - s * 0.22, cy - s * 0.55, s * 0.44, s * 0.8, s * 0.22); ctx.fill(); ctx.strokeStyle = "#4A5A66"; ctx.lineWidth = s * 0.08; ctx.beginPath(); ctx.arc(cx, cy, s * 0.4, 0, Math.PI); ctx.moveTo(cx, cy + s * 0.4); ctx.lineTo(cx, cy + s * 0.65); ctx.moveTo(cx - s * 0.3, cy + s * 0.65); ctx.lineTo(cx + s * 0.3, cy + s * 0.65); ctx.stroke(); };
  M.camera = function (ctx, cx, cy, s) { ctx.fillStyle = "#4A5A66"; rr(ctx, cx - s * 0.6, cy - s * 0.35, s * 1.2, s * 0.8, s * 0.12); ctx.fill(); ctx.fillStyle = "#1F2A33"; ctx.beginPath(); ctx.arc(cx, cy + s * 0.05, s * 0.28, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#8FD0E6"; ctx.beginPath(); ctx.arc(cx, cy + s * 0.05, s * 0.14, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#4A5A66"; rr(ctx, cx - s * 0.2, cy - s * 0.5, s * 0.4, s * 0.2, 4); ctx.fill(); };
  M.speaker = function (ctx, cx, cy, s, opt = {}) { ctx.fillStyle = "#4A5A66"; rr(ctx, cx - s * 0.35, cy - s * 0.6, s * 0.7, s * 1.2, s * 0.1); ctx.fill(); ctx.fillStyle = "#1F2A33"; ctx.beginPath(); ctx.arc(cx, cy + s * 0.15, s * 0.26, 0, Math.PI * 2); ctx.arc(cx, cy - s * 0.32, s * 0.13, 0, Math.PI * 2); ctx.fill(); if (opt.on) { ctx.strokeStyle = C.accent; ctx.lineWidth = s * 0.07; for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(cx + s * 0.4, cy, s * 0.25 * i, -0.6, 0.6); ctx.stroke(); } } };
  M.printer = function (ctx, cx, cy, s, opt = {}) { ctx.fillStyle = "#B7C4CC"; rr(ctx, cx - s * 0.7, cy - s * 0.25, s * 1.4, s * 0.6, s * 0.1); ctx.fill(); ctx.fillStyle = "#6B7B88"; rr(ctx, cx - s * 0.5, cy - s * 0.55, s, s * 0.35, s * 0.06); ctx.fill(); ctx.fillStyle = "#fff"; rr(ctx, cx - s * 0.4, cy + s * 0.2, s * 0.8, s * (opt.out || 0.4), 4); ctx.fill(); if (opt.text) text(ctx, opt.text, cx, cy + s * 0.5, s * 0.3, { align: "center", weight: 900, color: C.ink }); };
  M.scanner = function (ctx, cx, cy, s) { ctx.fillStyle = "#B7C4CC"; rr(ctx, cx - s * 0.7, cy - s * 0.2, s * 1.4, s * 0.4, s * 0.08); ctx.fill(); ctx.fillStyle = "#8FD0E6"; rr(ctx, cx - s * 0.6, cy - s * 0.12, s * 1.2, s * 0.2, 4); ctx.fill(); ctx.fillStyle = C.accent; ctx.fillRect(cx - s * 0.1, cy - s * 0.12, s * 0.06, s * 0.2); };
  // kartu stasiun (kotak berjudul) untuk papan alur
  M.station = function (ctx, x, y, w, h, title, opt = {}) {
    card(ctx, x, y, w, h, { fill: opt.on ? "#FFF3D6" : opt.dim ? "#F4F6F5" : C.panel, stroke: opt.on ? C.accent : opt.done ? C.good : "#D7E2DC", lw: opt.on || opt.done ? 5 : 3, r: 20 });
    text(ctx, title, x + w / 2, y + 44, 30, { align: "center", weight: 900, color: opt.on ? C.accentDark : opt.dim ? C.muted : C.ink });
    if (opt.sub) text(ctx, opt.sub, x + w / 2, y + h - 18, 24, { align: "center", weight: 700, color: C.ink2 });
  };
  // panah tebal mendatar/menurun antar stasiun
  M.arrow = function (ctx, x1, y1, x2, y2, opt = {}) {
    ctx.strokeStyle = opt.color || "#9AAFA6"; ctx.fillStyle = opt.color || "#9AAFA6"; ctx.lineWidth = opt.lw || 10; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const a = Math.atan2(y2 - y1, x2 - x1), s = (opt.lw || 10) * 2.2; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - s * Math.cos(a - 0.5), y2 - s * Math.sin(a - 0.5)); ctx.lineTo(x2 - s * Math.cos(a + 0.5), y2 - s * Math.sin(a + 0.5)); ctx.closePath(); ctx.fill();
  };
  // denyut "H" berjalan di sepanjang titik-titik path pada u (0..n-1)
  M.pulse = function (ctx, path, u, label = "H") {
    if (u <= 0) return; const i = Math.min(Math.floor(u), path.length - 2), f = u - i; const x = lerp(path[i][0], path[i + 1][0], f), y = lerp(path[i][1], path[i + 1][1], f);
    ctx.fillStyle = "rgba(242,177,52,0.35)"; ctx.beginPath(); ctx.arc(x, y, 36, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.fill(); text(ctx, label, x, y + 10, 28, { align: "center", weight: 900, color: "#fff" });
  };
  // papan alur lengkap: stasiun INPUT → PROSES → OUTPUT dan PENYIMPANAN di bawah proses.
  // opt.stage: indeks stasiun yang disorot (0 input,1 proses,2 output,3 simpan); opt.show: jumlah stasiun yang tampak; opt.u: posisi denyut (0..4)
  M.board = function (ctx, opt = {}) {
    const show = opt.show === undefined ? 4 : opt.show, st = opt.stage;
    const X = [160, 700, 1240], Y = 250, W = 520, Hh = 300;
    const titles = ["MASUKAN (input)", "PROSES", "KELUARAN (output)"];
    for (let i = 0; i < 3; i++) if (i < show) M.station(ctx, X[i], Y, W, Hh, titles[i], { on: st === i, done: st !== undefined && i < st });
    if (show >= 1) { D.keyboard(ctx, X[0] + 40, Y + 90, 300, { pressed: opt.key ? ["H"] : [] }); D.mouse(ctx, X[0] + 430, Y + 190, 60, {}); }
    if (show >= 2) { M.chip(ctx, X[1] + 150, Y + 170, 110, { hot: st === 1 }); M.ram(ctx, X[1] + 260, Y + 110, 230, 110, { cells: opt.ramCells }); }
    if (show >= 3) { const sc = D.monitor(ctx, X[2] + 60, Y + 80, 260, 150); if (opt.screen) text(ctx, opt.screen, sc.x + 20, sc.y + 80, 64, { weight: 900 }); M.speaker(ctx, X[2] + 420, Y + 170, 60, { on: opt.sound }); }
    if (show >= 1 && show >= 2) M.arrow(ctx, X[0] + W + 6, Y + Hh / 2, X[1] - 6, Y + Hh / 2);
    if (show >= 3) M.arrow(ctx, X[1] + W + 6, Y + Hh / 2, X[2] - 6, Y + Hh / 2);
    if (show >= 4) { M.station(ctx, X[1], Y + Hh + 90, W, 200, "PENYIMPANAN (storage)", { on: st === 3, done: st !== undefined && st > 3 }); M.disk(ctx, X[1] + 170, Y + Hh + 200, 80); M.sdcard(ctx, X[1] + 330, Y + Hh + 200, 70); M.flashdisk(ctx, X[1] + 430, Y + Hh + 200, 70); M.arrow(ctx, X[1] + W / 2 - 30, Y + Hh + 6, X[1] + W / 2 - 30, Y + Hh + 84); M.arrow(ctx, X[1] + W / 2 + 30, Y + Hh + 84, X[1] + W / 2 + 30, Y + Hh + 6); }
    if (opt.u !== undefined) M.pulse(ctx, [[X[0] + 190, Y + 150], [X[0] + W, Y + Hh / 2], [X[1] + 150, Y + 170], [X[1] + 375, Y + 165], [X[2] + 190, Y + 160]], opt.u, opt.label || "H");
    return { X, Y, W, H: Hh };
  };
  K.komp = M;
})(typeof window !== "undefined" ? window : globalThis);
