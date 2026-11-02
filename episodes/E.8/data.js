/* Pembantu gambar E.8: formulir dengan kolom bertipe, kartu gambar sketsa buah/sayur berlabel, kartu panduan label,
   pengukur kesepakatan, tabel dengan sel bertanda, kartu aturan validasi, log perubahan. Gaya diagram Fase E. Muat setelah kiko-core.js, kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, clamp } = H;
  const Dq = {};
  // formulir: fields [[label, tipe, contoh, wajib]]; opt.n
  Dq.form = function (ctx, x, y, w, fields, opt = {}) {
    const h = 60 + fields.length * 64 + 16; card(ctx, x, y, w, h, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 }); ctx.fillStyle = C.kiko; rr(ctx, x, y, w, 46, 14); ctx.fill(); ctx.fillRect(x, y + 23, w, 23); text(ctx, opt.title || "FORMULIR", x + 16, y + 31, 20, { weight: 900, color: "#fff" });
    fields.forEach(([lab, tipe, ex, req], i) => { if (opt.n != null && i >= opt.n) return; const ry = y + 60 + i * 64; text(ctx, lab + (req ? " *" : ""), x + 16, ry + 18, 17, { weight: 900, color: req ? C.bad : C.ink2 }); ctx.fillStyle = "#F4F8FB"; ctx.strokeStyle = "#C9D4DB"; ctx.lineWidth = 2; rr(ctx, x + 16, ry + 26, w - 32, 32, 8); ctx.fill(); ctx.stroke(); text(ctx, ex, x + 28, ry + 48, 17, { weight: 700, color: C.ink }); ctx.fillStyle = "#EDE6F7"; rr(ctx, x + w - 110, ry + 2, 94, 22, 6); ctx.fill(); text(ctx, tipe, x + w - 63, ry + 18, 13, { align: "center", weight: 900, color: "#8E6BBF" }); });
    return h;
  };
  // sketsa buah/sayur sederhana: kind "tomat"|"apel"|"wortel"|"jagung"|"pisang"|"bayam"
  Dq.sketch = function (ctx, cx, cy, s, kind) {
    ctx.save(); ctx.translate(cx, cy);
    if (kind === "apel") { ctx.fillStyle = "#D9443B"; ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#2E9E5B"; ctx.beginPath(); ctx.ellipse(s * 0.12, -s * 0.42, s * 0.14, s * 0.07, -0.6, 0, Math.PI * 2); ctx.fill(); }
    else if (kind === "tomat") { ctx.fillStyle = "#E0463B"; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.42, s * 0.36, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#2E9E5B"; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(Math.cos(i * 1.26) * s * 0.12, -s * 0.3 + Math.sin(i * 1.26) * s * 0.06, s * 0.14, s * 0.05, i * 1.26, 0, Math.PI * 2); ctx.fill(); } }
    else if (kind === "wortel") { ctx.fillStyle = "#F28A1E"; ctx.beginPath(); ctx.moveTo(-s * 0.18, -s * 0.3); ctx.lineTo(s * 0.18, -s * 0.3); ctx.lineTo(0, s * 0.45); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#2E9E5B"; ctx.fillRect(-s * 0.04, -s * 0.5, s * 0.08, s * 0.22); }
    else if (kind === "jagung") { ctx.fillStyle = "#F2C94C"; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.18, s * 0.42, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#2E9E5B"; ctx.beginPath(); ctx.ellipse(-s * 0.2, s * 0.1, s * 0.1, s * 0.35, 0.3, 0, Math.PI * 2); ctx.fill(); }
    else if (kind === "pisang") { ctx.strokeStyle = "#F2C94C"; ctx.lineWidth = s * 0.16; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, -s * 0.1, s * 0.35, 0.3, Math.PI - 0.3); ctx.stroke(); }
    else { ctx.fillStyle = "#2E9E5B"; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse((i - 1) * s * 0.22, 0, s * 0.14, s * 0.36, (i - 1) * 0.3, 0, Math.PI * 2); ctx.fill(); } }
    ctx.restore();
  };
  // kartu gambar dengan label-label dari pelabel: labels [[nama, teks]]; opt.agree
  Dq.photo = function (ctx, x, y, w, kind, labels = [], opt = {}) {
    const h = 100 + labels.length * 26 + 10; card(ctx, x, y, w, h, { fill: "#fff", stroke: opt.agree === true ? C.good : opt.agree === false ? C.bad : "#B7C4CC", lw: opt.agree == null ? 3 : 5, r: 12 });
    ctx.fillStyle = "#EAF2EE"; rr(ctx, x + 8, y + 8, w - 16, 80, 8); ctx.fill(); Dq.sketch(ctx, x + w / 2, y + 48, 70, kind);
    labels.forEach(([who, t], i) => text(ctx, who + ": " + t, x + 12, y + 110 + i * 26, 16, { weight: 800, color: opt.agree === false && i && t !== labels[0][1] ? C.bad : C.ink }));
    return h;
  };
  // pengukur kesepakatan
  Dq.agree = function (ctx, x, y, w, pct, opt = {}) { text(ctx, (opt.label || "kesepakatan") + ": " + pct + "%", x, y - 10, 20, { weight: 900, color: C.ink2 }); ctx.fillStyle = "#E6EDF2"; rr(ctx, x, y, w, 24, 12); ctx.fill(); ctx.fillStyle = pct >= 80 ? C.good : pct >= 60 ? C.accent : C.bad; rr(ctx, x, y, w * pct / 100, 24, 12); ctx.fill(); };
  // tabel sederhana dengan sel bertanda: head[], rows[][], marks {"r,c": "bad"}; opt.cw
  Dq.table = function (ctx, x, y, cw, head, rows, marks = {}, opt = {}) {
    const W = cw.reduce((a, b) => a + b, 0), rh = opt.rh || 44; card(ctx, x, y, W, rh * (rows.length + 1), { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 10 });
    ctx.fillStyle = C.bg2; rr(ctx, x, y, W, rh, 10); ctx.fill(); ctx.fillRect(x, y + rh / 2, W, rh / 2); let cx = x; head.forEach((hd, c) => { text(ctx, hd, cx + 10, y + rh / 2 + 7, 18, { weight: 900, color: C.ink2 }); cx += cw[c]; });
    rows.forEach((r, i) => { const ry = y + rh * (i + 1); let cx = x; r.forEach((v, c) => { const m = marks[i + "," + c]; if (m) { ctx.fillStyle = m === "bad" ? C.badBg : m === "fix" ? C.goodBg : "#FFF3D6"; ctx.fillRect(cx + 1, ry + 1, cw[c] - 2, rh - 2); } text(ctx, v === "" ? (m ? "(kosong)" : "") : String(v), cx + 10, ry + rh / 2 + 7, 18, { weight: m ? 900 : 700, color: m === "bad" ? C.bad : C.ink }); cx += cw[c]; }); ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, ry); ctx.lineTo(x + W, ry); ctx.stroke(); });
  };
  Dq.rule = function (ctx, x, y, w, name, desc, ex, opt = {}) { ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2; card(ctx, x, y, w, 110, { fill: opt.on ? "#FFF3D6" : C.bg2, stroke: opt.on ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, name, x + 20, y + 42, 26, { weight: 900, color: C.kiko }); text(ctx, desc, x + 20, y + 76, 19, { weight: 700, color: C.ink2 }); text(ctx, ex, x + w - 20, y + 60, 20, { align: "right", weight: 900 }); ctx.restore(); };
  K.dataq = Dq;
})(typeof window !== "undefined" ? window : globalThis);
