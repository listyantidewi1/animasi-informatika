/* Pembantu gambar D8.5: kartu kalimat (fakta/opini/hoaks), gelembung pesan, daftar lima ciri, pohon penyebaran (jaringan pertemanan),
   penghitung orang. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, clamp } = H;
  const Q = {};
  const COL = { fakta: C.good, opini: C.kiko, hoaks: C.bad };
  // kartu kalimat; kind null = belum dipilah
  Q.sentence = function (ctx, x, y, w, s, kind, opt = {}) {
    const col = kind ? COL[kind] : "#B7C4CC"; const size = opt.size || 24; const lines = wrap(ctx, s, size, 800, w - 40); const h = opt.h || 40 + lines.length * size * 1.3;
    card(ctx, x, y, w, h, { fill: kind === "fakta" ? C.goodBg : kind === "opini" ? "#DCEBF2" : kind === "hoaks" ? C.badBg : "#FFFFFF", stroke: col, lw: kind ? 5 : 3, r: 14 });
    lines.forEach((ln, i) => text(ctx, ln, x + 20, y + 32 + i * size * 1.3, size, { weight: 800 }));
    if (kind && opt.label !== false) { ctx.fillStyle = col; rr(ctx, x + w - 96, y - 14, 86, 28, 8); ctx.fill(); text(ctx, kind.toUpperCase(), x + w - 53, y + 6, 16, { align: "center", weight: 900, color: "#fff" }); }
    return h;
  };
  // gelembung pesan chat
  Q.msg = function (ctx, x, y, w, s, opt = {}) {
    const size = opt.size || 24; const lines = wrap(ctx, s, size, 700, w - 40); const h = 36 + lines.length * size * 1.3;
    ctx.fillStyle = opt.fill || "#FFFFFF"; ctx.strokeStyle = opt.stroke || "#D7E2DC"; ctx.lineWidth = 3; rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.stroke();
    if (opt.who) text(ctx, opt.who, x + 16, y + 22, 16, { weight: 900, color: C.ink2 });
    lines.forEach((ln, i) => text(ctx, ln, x + 16, y + (opt.who ? 48 : 36) + i * size * 1.3, size, { weight: 700, color: opt.color || C.ink }));
    return h + (opt.who ? 12 : 0);
  };
  // lima ciri hoaks; checks = [bool], hl indeks
  Q.signs = function (ctx, x, y, w, checks = [], opt = {}) {
    const S = ["Mendesak: sekarang juga!", "Tanpa sumber yang jelas", "Menyentuh emosi: takut, marah, senang", "Minta disebarkan", "Tidak bisa dicek"];
    S.forEach((s, i) => { const ry = y + i * 74; const on = opt.hl === i; const dim = opt.n != null && i >= opt.n; ctx.save(); if (dim) ctx.globalAlpha = 0.2; card(ctx, x, ry, w, 62, { fill: on ? "#FFF3D6" : C.bg2, stroke: on ? C.accent : undefined, lw: 4, r: 14 }); ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(x + 32, ry + 31, 18, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), x + 32, ry + 39, 18, { align: "center", color: "#fff", weight: 900 }); text(ctx, s, x + 62, ry + 39, 24, { weight: 900 }); if (checks[i] != null) { ctx.fillStyle = checks[i] ? C.bad : C.good; ctx.beginPath(); ctx.arc(x + w - 32, ry + 31, 18, 0, Math.PI * 2); ctx.fill(); text(ctx, checks[i] ? "✓" : "–", x + w - 32, ry + 40, 22, { align: "center", weight: 900, color: "#fff" }); } ctx.restore(); });
  };
  // pohon penyebaran: levels aktif n (0..4), branching 3; opt.stopAt = {level, index} cabang yang berhenti; opt.checkers = set level (semua periksa dulu)
  Q.spreadTree = function (ctx, x, y, w, h, n, opt = {}) {
    const L = 5; const rows = [1, 3, 9, 27, 81]; const dy = h / (L - 1);
    const pos = (lvl, i) => [x + (i + 0.5) * (w / rows[lvl]), y + lvl * dy];
    const dead = new Set(); // "lvl:i" yang tidak menerima
    if (opt.stop) { const [sl, si] = opt.stop; for (let lvl = sl + 1; lvl < L; lvl++) { const span = Math.pow(3, lvl - sl); for (let k = 0; k < span; k++) dead.add(lvl + ":" + (si * span + k)); } }
    for (let lvl = 1; lvl < L; lvl++) { if (lvl > n) break; for (let i = 0; i < rows[lvl]; i++) { const p = pos(lvl, i), q = pos(lvl - 1, Math.floor(i / 3)); const isDead = dead.has(lvl + ":" + i); ctx.strokeStyle = isDead ? "#E1E8E4" : opt.color || C.bad; ctx.lineWidth = isDead ? 1 : lvl < 3 ? 3 : 1.5; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); } }
    for (let lvl = 0; lvl < L; lvl++) { if (lvl > n) break; for (let i = 0; i < rows[lvl]; i++) { const p = pos(lvl, i); const isDead = dead.has(lvl + ":" + i); const r = lvl === 0 ? 16 : lvl === 1 ? 12 : lvl === 2 ? 9 : lvl === 3 ? 6 : 4; const isStop = opt.stop && opt.stop[0] === lvl && opt.stop[1] === i; ctx.fillStyle = isDead ? "#E1E8E4" : isStop ? C.good : opt.color || C.bad; ctx.beginPath(); ctx.arc(p[0], p[1], isStop ? r + 6 : r, 0, Math.PI * 2); ctx.fill(); if (isStop) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.stroke(); } } }
    if (opt.counts) for (let lvl = 0; lvl <= Math.min(n, L - 1); lvl++) { const alive = rows[lvl] - [...dead].filter(k => k.startsWith(lvl + ":")).length; text(ctx, String(alive), x - 30, y + lvl * dy + 8, 24, { align: "right", weight: 900, color: alive ? (opt.color || C.bad) : C.muted }); }
    return { rows, dead };
  };
  // penghitung besar
  Q.counter = function (ctx, x, y, w, n, label, color) { card(ctx, x, y, w, 120, { fill: "#FFFFFF", stroke: color, lw: 5, r: 16 }); text(ctx, String(n), x + w / 2, y + 66, 56, { align: "center", weight: 900, color }); text(ctx, label, x + w / 2, y + 104, 22, { align: "center", weight: 800, color: C.ink2 }); };
  K.hoaks = Q;
})(typeof window !== "undefined" ? window : globalThis);
