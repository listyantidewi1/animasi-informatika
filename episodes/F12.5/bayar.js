/* Pembantu gambar F12.5: kode QR (digambar dengan kode, bukan kode asli), dudukan QR di meja kasir, layar aplikasi pembayaran
   (pindai, konfirmasi, PIN, berhasil), alur kotak berpanah, gelembung chat. Semua nama, nomor, dan pesan fiktif.
   Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C, D = K.devices;
  const { rr, text, para, card } = H;
  const Bx = {};
  const rnd = seed => () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  // pola mirip kode QR: s ukuran, seed pola
  Bx.qr = function (ctx, x, y, s, seed = 7, opt = {}) {
    const n = 21, c = s / n, r = rnd(seed); ctx.fillStyle = "#fff"; ctx.fillRect(x - c, y - c, s + 2 * c, s + 2 * c); ctx.fillStyle = opt.col || "#1F2A33";
    const finder = (fx, fy) => { ctx.fillRect(x + fx * c, y + fy * c, 7 * c, 7 * c); ctx.fillStyle = "#fff"; ctx.fillRect(x + (fx + 1) * c, y + (fy + 1) * c, 5 * c, 5 * c); ctx.fillStyle = opt.col || "#1F2A33"; ctx.fillRect(x + (fx + 2) * c, y + (fy + 2) * c, 3 * c, 3 * c); };
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const inF = (i < 8 && j < 8) || (i > 12 && j < 8) || (i < 8 && j > 12); if (!inF && r() > 0.52) ctx.fillRect(x + i * c, y + j * c, c, c); }
    finder(0, 0); finder(14, 0); finder(0, 14);
  };
  // dudukan QR kasir: nama toko; opt {palsu: true -> stiker miring di atasnya}
  Bx.stand = function (ctx, x, y, name, opt = {}) {
    card(ctx, x, y, 260, 330, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 16 }); ctx.fillStyle = "#C0392B"; rr(ctx, x, y, 260, 56, 16); ctx.fill(); ctx.fillRect(x, y + 28, 260, 28);
    text(ctx, "QRIS", x + 130, y + 40, 28, { align: "center", weight: 900, color: "#fff" }); Bx.qr(ctx, x + 45, y + 80, 170, opt.seed || 7);
    text(ctx, name, x + 130, y + 300, 22, { align: "center", weight: 900 });
    if (opt.palsu) { ctx.save(); ctx.translate(x + 140, y + 165); ctx.rotate(-0.06); ctx.fillStyle = "#FFFDF5"; ctx.fillRect(-100, -100, 200, 200); ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 3; ctx.setLineDash([6, 4]); ctx.strokeRect(-100, -100, 200, 200); ctx.setLineDash([]); Bx.qr(ctx, -85, -85, 170, 31, { col: "#3A2A1A" }); ctx.restore(); if (opt.label) text(ctx, opt.label, x + 130, y - 16, 20, { align: "center", weight: 900, color: C.bad }); }
  };
  // layar aplikasi bayar di HP: mode "pindai" | "konfirmasi" | "pin" | "berhasil"; opt {nama, nominal, warn}
  Bx.app = function (ctx, cx, cy, mode, opt = {}) {
    const sc = D.phone(ctx, cx, cy, 300, 540); ctx.fillStyle = "#fff"; rr(ctx, sc.x, sc.y, sc.w, sc.h, 24); ctx.fill();
    ctx.fillStyle = "#2E7E9A"; rr(ctx, sc.x, sc.y, sc.w, 60, 24); ctx.fill(); ctx.fillRect(sc.x, sc.y + 30, sc.w, 30); text(ctx, "Dompet Digital", cx, sc.y + 40, 22, { align: "center", weight: 900, color: "#fff" });
    if (mode === "pindai") { ctx.strokeStyle = "#2E7E9A"; ctx.lineWidth = 6; const s = 180, x0 = cx - s / 2, y0 = sc.y + 120; [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(x0 + a * s + (a ? -30 : 30), y0 + b * s); ctx.lineTo(x0 + a * s, y0 + b * s); ctx.lineTo(x0 + a * s, y0 + b * s + (b ? -30 : 30)); ctx.stroke(); }); Bx.qr(ctx, x0 + 30, y0 + 30, 120, opt.seed || 7); text(ctx, "arahkan ke kode QR", cx, y0 + s + 50, 18, { align: "center", weight: 800, color: C.ink2 }); }
    if (mode === "konfirmasi") { text(ctx, "bayar ke", cx, sc.y + 120, 18, { align: "center", weight: 800, color: C.ink2 }); card(ctx, sc.x + 20, sc.y + 136, sc.w - 40, 70, { fill: opt.warn ? C.badBg : "#FFF3D6", stroke: opt.warn ? C.bad : C.accent, lw: 4, r: 12 }); text(ctx, opt.nama || "Kedai Sari", cx, sc.y + 181, 24, { align: "center", weight: 900, color: opt.warn ? C.bad : C.ink }); text(ctx, "nominal", cx, sc.y + 250, 18, { align: "center", weight: 800, color: C.ink2 }); text(ctx, opt.nominal || "Rp15.000", cx, sc.y + 296, 36, { align: "center", weight: 900 }); ctx.fillStyle = "#2E7E9A"; rr(ctx, sc.x + 30, sc.y + sc.h - 90, sc.w - 60, 56, 14); ctx.fill(); text(ctx, "Bayar", cx, sc.y + sc.h - 53, 24, { align: "center", weight: 900, color: "#fff" }); }
    if (mode === "pin") { text(ctx, "masukkan PIN", cx, sc.y + 120, 22, { align: "center", weight: 900 }); for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(cx - 75 + i * 30, sc.y + 160, 9, 0, Math.PI * 2); ctx.fillStyle = i < (opt.n || 4) ? "#2E7E9A" : "#DCE6EC"; ctx.fill(); } for (let k = 0; k < 9; k++) { const bx = sc.x + 45 + (k % 3) * 75, by = sc.y + 200 + Math.floor(k / 3) * 70; ctx.fillStyle = "#EEF3F6"; ctx.beginPath(); ctx.arc(bx + 30, by + 30, 28, 0, Math.PI * 2); ctx.fill(); text(ctx, String(k + 1), bx + 30, by + 40, 24, { align: "center", weight: 800 }); } text(ctx, "jangan perlihatkan ke siapa pun", cx, sc.y + sc.h - 24, 15, { align: "center", weight: 800, color: C.bad }); }
    if (mode === "berhasil") { ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(cx, sc.y + 170, 56, 0, Math.PI * 2); ctx.fill(); text(ctx, "✓", cx, sc.y + 192, 64, { align: "center", weight: 900, color: "#fff" }); text(ctx, "pembayaran berhasil", cx, sc.y + 270, 22, { align: "center", weight: 900 }); text(ctx, (opt.nama || "Kedai Sari") + " · " + (opt.nominal || "Rp15.000"), cx, sc.y + 306, 18, { align: "center", weight: 800, color: C.ink2 }); }
    return sc;
  };
  // alur kotak berpanah: steps [[ikon, teks]], active indeks; opt {w, gap}
  Bx.flow = function (ctx, x, y, steps, active, opt = {}) {
    const w = opt.w || 230, gap = opt.gap || 50, h = opt.h || 130;
    steps.forEach(([ic, t], i) => { const bx = x + i * (w + gap); const on = i === active, done = active != null && i < active; ctx.save(); if (active != null && i > active) ctx.globalAlpha = 0.25; card(ctx, bx, y, w, h, { fill: on ? "#FFF3D6" : done ? C.goodBg : C.bg2, stroke: on ? C.accent : done ? C.good : undefined, lw: 4, r: 16 }); text(ctx, ic, bx + w / 2, y + 56, 40, { align: "center" }); para(ctx, t, bx + w / 2, y + 96, 19, w - 20, { align: "center", weight: 900 }); ctx.restore();
      if (i < steps.length - 1) { ctx.fillStyle = "#7B8B95"; ctx.beginPath(); const ax = bx + w + 8, ay = y + h / 2; ctx.moveTo(ax, ay - 12); ctx.lineTo(ax + gap - 16, ay); ctx.lineTo(ax, ay + 12); ctx.closePath(); ctx.fill(); } });
  };
  // gelembung chat masuk: msgs [teks]; opt {from, warn}
  Bx.chat = function (ctx, x, y, w, from, msgs, opt = {}) {
    card(ctx, x, y, w, 60 + msgs.length * 92, { fill: "#EAF2EE", r: 16 }); text(ctx, from, x + 20, y + 38, 20, { weight: 900, color: C.ink2 });
    msgs.forEach((m, i) => { card(ctx, x + 16, y + 56 + i * 92, w - 60, 80, { fill: "#fff", stroke: opt.warn && opt.warn.includes(i) ? C.bad : "#D7E2DC", lw: opt.warn && opt.warn.includes(i) ? 4 : 2, r: 14 }); para(ctx, m, x + 32, y + 88 + i * 92, 18, w - 100, { weight: 800 }); });
  };
  K.bayar = Bx;
})(typeof window !== "undefined" ? window : globalThis);
