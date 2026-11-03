/* Pembantu gambar E.2: kartu proses, prosesor dengan irisan waktu, antrean berputar, peta memori, blok penyimpanan,
   jendela pengelola tugas, steker driver. Gaya diagram Fase E. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, wrap, card, clamp, lerp } = H;
  const O = {};
  O.APPS = [["🎵", "Musik", "#8E6BBF"], ["💬", "Chat", "#2E9E5B"], ["🌐", "Browser", "#2E7E9A"], ["🎮", "Game", "#D9443B"]];
  // kartu proses kecil
  O.proc = function (ctx, cx, cy, w, app, opt = {}) {
    const [ic, name, col] = app; ctx.save(); if (opt.dim) ctx.globalAlpha = 0.25;
    card(ctx, cx - w / 2, cy - 36, w, 72, { fill: opt.on ? "#FFF3D6" : "#fff", stroke: opt.on ? C.accent : col, lw: opt.on ? 6 : 3, r: 14 });
    text(ctx, ic, cx - w / 2 + 34, cy + 12, 32, { align: "center" }); text(ctx, name, cx - w / 2 + 66, cy + 8, 22, { weight: 900 });
    if (opt.sub) text(ctx, opt.sub, cx + w / 2 - 14, cy + 8, 18, { align: "right", weight: 800, color: C.ink2 });
    ctx.restore();
  };
  // prosesor: kotak dengan proses yang sedang dilayani dan bilah irisan waktu (u 0..1)
  O.cpu = function (ctx, cx, cy, app, u, opt = {}) {
    card(ctx, cx - 130, cy - 110, 260, 220, { fill: "#F7FAF8", stroke: C.kiko, lw: 4, r: 18 }); text(ctx, "PROSESOR", cx, cy - 74, 20, { align: "center", weight: 900, color: C.kiko });
    if (app) { text(ctx, app[0], cx, cy + 4, 56, { align: "center" }); text(ctx, app[1], cx, cy + 44, 22, { align: "center", weight: 900 }); }
    else text(ctx, "kosong", cx, cy + 10, 22, { align: "center", weight: 800, color: C.muted });
    ctx.fillStyle = "#E6EDF2"; rr(ctx, cx - 100, cy + 70, 200, 16, 8); ctx.fill(); ctx.fillStyle = C.accent; rr(ctx, cx - 100, cy + 70, 200 * clamp(u, 0, 1), 16, 8); ctx.fill();
    if (opt.label) text(ctx, opt.label, cx, cy + 112 + 20, 18, { align: "center", weight: 800, color: C.ink2 });
  };
  // peta memori: blocks = [{app, size}] dalam total n blok; opt.free label
  O.memmap = function (ctx, x, y, w, h, n, alloc, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#fff", stroke: "#8E6BBF", lw: 4, r: 14 }); const bw = w / n;
    for (let i = 0; i < n; i++) { ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + i * bw, y); ctx.lineTo(x + i * bw, y + h); ctx.stroke(); }
    alloc.forEach(a => { const [ic, name, col] = a.app; ctx.fillStyle = a.swap ? "#B7C4CC" : col; rr(ctx, x + a.start * bw + 3, y + 6, a.size * bw - 6, h - 12, 8); ctx.fill(); if (a.hl) { ctx.strokeStyle = C.accent; ctx.lineWidth = 5; rr(ctx, x + a.start * bw + 3, y + 6, a.size * bw - 6, h - 12, 8); ctx.stroke(); } text(ctx, ic + " " + name, x + (a.start + a.size / 2) * bw, y + h / 2 + 8, Math.min(22, a.size * bw / 5), { align: "center", weight: 900, color: "#fff" }); });
    if (opt.title) text(ctx, opt.title, x, y - 14, 20, { weight: 900, color: "#8E6BBF" });
    for (let i = 0; i < n; i++) text(ctx, String(i), x + (i + 0.5) * bw, y + h + 22, 15, { align: "center", weight: 800, color: C.muted });
  };
  // penyimpanan: blok-blok dengan potongan berkas (warna) ; pieces = [{idx, col, label}]
  O.disk = function (ctx, x, y, cols, rows, cell, pieces, opt = {}) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { ctx.fillStyle = "#E6EDF2"; rr(ctx, x + c * cell, y + r * cell, cell - 4, cell - 4, 4); ctx.fill(); }
    pieces.forEach(p => { const c = p.idx % cols, r = Math.floor(p.idx / cols); ctx.fillStyle = p.col; rr(ctx, x + c * cell, y + r * cell, cell - 4, cell - 4, 4); ctx.fill(); if (p.label) text(ctx, p.label, x + c * cell + cell / 2 - 2, y + r * cell + cell / 2 + 6, 15, { align: "center", weight: 900, color: "#fff" }); });
    if (opt.title) text(ctx, opt.title, x, y - 14, 20, { weight: 900, color: C.ink2 });
  };
  // jendela pengelola tugas: rows [[nama, cpu%, ram]], opt.hl
  O.taskman = function (ctx, x, y, w, rows, opt = {}) {
    const sc = D.windowFrame(ctx, x, y, w, 90 + rows.length * 44 + 20, "Pengelola Tugas");
    text(ctx, "Proses", sc.x + 10, sc.y + 22, 18, { weight: 900, color: C.ink2 }); text(ctx, "CPU", sc.x + sc.w - 130, sc.y + 22, 18, { align: "right", weight: 900, color: C.ink2 }); text(ctx, "RAM", sc.x + sc.w - 20, sc.y + 22, 18, { align: "right", weight: 900, color: C.ink2 });
    rows.forEach(([n, cpu, ram], i) => { const ry = sc.y + 36 + i * 44; if (opt.hl === i) { ctx.fillStyle = C.badBg; rr(ctx, sc.x, ry, sc.w, 40, 8); ctx.fill(); } text(ctx, n, sc.x + 10, ry + 27, 20, { weight: 800, color: opt.hl === i ? C.bad : C.ink }); text(ctx, cpu, sc.x + sc.w - 130, ry + 27, 20, { align: "right", weight: 800 }); text(ctx, ram, sc.x + sc.w - 20, ry + 27, 20, { align: "right", weight: 800 }); });
    return sc;
  };
  // steker / driver
  O.plug = function (ctx, cx, cy, s, opt = {}) { ctx.fillStyle = opt.color || C.kiko; rr(ctx, cx - s * 0.5, cy - s * 0.3, s, s * 0.6, s * 0.12); ctx.fill(); ctx.fillStyle = "#7B8B95"; ctx.fillRect(cx + s * 0.5, cy - s * 0.18, s * 0.3, s * 0.1); ctx.fillRect(cx + s * 0.5, cy + s * 0.08, s * 0.3, s * 0.1); if (opt.label) text(ctx, opt.label, cx, cy + 8, s * 0.3, { align: "center", weight: 900, color: "#fff" }); };
  K.os = O;
})(typeof window !== "undefined" ? window : globalThis);
