/* Pembantu gambar F11.6: koin, daftar kombinasi, garis bilangan tebak angka, pohon merge sort, tumpukan bingkai rekursi,
   tabel justifikasi. Gaya diagram Fase F. Muat setelah kiko-core.js, kiko-devices.js, kartu.js, urut.js, py.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, clamp } = H;
  const St = {};
  const COL = { 1: "#C98A57", 3: "#2E7E9A", 4: "#8E6BBF", 100: "#C98A57", 200: "#2E7E9A", 500: "#B57A12" };
  // deretan koin: values[]; opt.r jari-jari, opt.dim, opt.hl indeks
  St.coins = function (ctx, x, y, values, opt = {}) {
    const r = opt.r || 34, gap = opt.gap || 12; values.forEach((v, i) => { const cx = x + r + i * (2 * r + gap); ctx.save(); if (opt.dim) ctx.globalAlpha = 0.25; ctx.fillStyle = COL[v] || C.kiko; ctx.beginPath(); ctx.arc(cx, y + r, r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, y + r, r - 5, 0, Math.PI * 2); ctx.stroke(); if (opt.hl === i) { ctx.strokeStyle = C.accent; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, y + r, r + 5, 0, Math.PI * 2); ctx.stroke(); } text(ctx, String(v), cx, y + r + (r > 30 ? 10 : 7), r > 30 ? 26 : 18, { align: "center", weight: 900, color: "#fff" }); ctx.restore(); });
    return x + values.length * (2 * r + gap);
  };
  // daftar kombinasi: combos = [{c:[koin], ok:bool}], n tampil, best = indeks terbaik
  St.combos = function (ctx, x, y, w, combos, n, opt = {}) {
    const rh = opt.rh || 56; combos.forEach((cb, i) => { if (i >= n) return; const ry = y + i * rh; const best = opt.best === i; card(ctx, x, ry, w, rh - 8, { fill: best ? C.goodBg : "#fff", stroke: best ? C.good : "#D7E2DC", lw: best ? 4 : 2, r: 10 }); St.coins(ctx, x + 12, ry + 6, cb.c, { r: 18, gap: 6 }); text(ctx, cb.c.length + " koin", x + w - 16, ry + rh / 2 + 4, 22, { align: "right", weight: 900, color: best ? C.good : C.ink2 }); if (best) text(ctx, "★ paling sedikit", x + w - 120, ry + rh / 2 + 4, 20, { align: "right", weight: 900, color: C.good }); });
  };
  // garis bilangan 1..N dengan rentang tersisa dan tebakan
  St.range = function (ctx, x, y, w, N, lo, hi, guess, opt = {}) {
    const px = v => x + (v - 1) / (N - 1) * w; ctx.fillStyle = "#E6EDF2"; rr(ctx, x - 6, y - 10, w + 12, 20, 10); ctx.fill(); ctx.fillStyle = opt.color || "#FFF3D6"; rr(ctx, px(lo) - 6, y - 10, px(hi) - px(lo) + 12, 20, 10); ctx.fill(); ctx.strokeStyle = C.accent; ctx.lineWidth = 3; rr(ctx, px(lo) - 6, y - 10, px(hi) - px(lo) + 12, 20, 10); ctx.stroke();
    [1, 25, 50, 75, 100].forEach(v => text(ctx, String(v), px(v), y + 34, 16, { align: "center", weight: 800, color: C.ink2 }));
    if (guess != null) { ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.moveTo(px(guess), y - 16); ctx.lineTo(px(guess) - 10, y - 34); ctx.lineTo(px(guess) + 10, y - 34); ctx.fill(); text(ctx, "tebak " + guess, px(guess), y - 42, 18, { align: "center", weight: 900, color: C.kiko }); }
    if (opt.secret != null) { ctx.fillStyle = C.good; ctx.beginPath(); ctx.arc(px(opt.secret), y, 7, 0, Math.PI * 2); ctx.fill(); }
  };
  // pohon merge sort untuk 4 angka: level 0 utuh, 1 dua bagian, 2 empat tunggal, 3 gabung dua, 4 gabung semua; n = langkah tampil (0..4)
  St.mergeTree = function (ctx, x, y, w, arr, n, opt = {}) {
    const box = (cx, cy, vals, col) => { const bw = vals.length * 46 + 12; card(ctx, cx - bw / 2, cy, bw, 44, { fill: col ? C.goodBg : "#fff", stroke: col ? C.good : "#B7C4CC", lw: 3, r: 8 }); vals.forEach((v, i) => text(ctx, String(v), cx - bw / 2 + 29 + i * 46, cy + 30, 22, { align: "center", weight: 900 })); };
    const s = arr.slice().sort((a, b) => a - b), L = arr.slice(0, 2), R = arr.slice(2), Ls = L.slice().sort((a, b) => a - b), Rs = R.slice().sort((a, b) => a - b);
    const line = (x1, y1, x2, y2) => { ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
    const cx = x + w / 2; box(cx, y, arr, false); 
    if (n >= 1) { line(cx, y + 44, cx - w / 4, y + 90); line(cx, y + 44, cx + w / 4, y + 90); box(cx - w / 4, y + 90, L, false); box(cx + w / 4, y + 90, R, false); }
    if (n >= 2) { [0, 1, 2, 3].forEach(i => { const px = cx - w * 3 / 8 + i * w / 4, parent = i < 2 ? cx - w / 4 : cx + w / 4; line(parent, y + 134, px, y + 180); box(px, y + 180, [arr[i]], true); }); }
    if (n >= 3) { line(cx - w * 3 / 8, y + 224, cx - w / 4, y + 270); line(cx - w / 8, y + 224, cx - w / 4, y + 270); line(cx + w / 8, y + 224, cx + w / 4, y + 270); line(cx + w * 3 / 8, y + 224, cx + w / 4, y + 270); box(cx - w / 4, y + 270, Ls, true); box(cx + w / 4, y + 270, Rs, true); }
    if (n >= 4) { line(cx - w / 4, y + 314, cx, y + 360); line(cx + w / 4, y + 314, cx, y + 360); box(cx, y + 360, s, true); }
  };
  // tumpukan bingkai rekursi: frames = [{call, ret}], n tampil; opt.closing = berapa yang sudah kembali (dari atas)
  St.stack = function (ctx, x, y, w, frames, n, opt = {}) {
    const fh = 54; const closing = opt.closing || 0;
    frames.forEach((f, i) => { if (i >= n) return; const fy = y + (frames.length - 1 - i) * fh; const closed = i >= n - closing; card(ctx, x + i * 16, fy, w - i * 32, fh - 8, { fill: closed ? C.goodBg : i === n - 1 ? "#FFF3D6" : "#F4F0FA", stroke: closed ? C.good : i === n - 1 ? C.accent : "#8E6BBF", lw: 3, r: 10 }); text(ctx, f.call, x + i * 16 + 14, fy + fh / 2 + 3, 20, { weight: 900, color: closed ? C.good : "#5B3F8E" }); if (closed) text(ctx, "→ " + f.ret, x + w - i * 16 - 14, fy + fh / 2 + 3, 20, { align: "right", weight: 900, color: C.good }); });
  };
  // tabel justifikasi: rows [[strategi, benar, cepat, mudah]] nilai "✓"|"△"|"✕"; n tampil
  St.table = function (ctx, x, y, cw, rows, n, opt = {}) {
    const W = cw.reduce((a, b) => a + b, 0), rh = 60; card(ctx, x, y, W, rh * (rows.length + 1), { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 12 }); ctx.fillStyle = C.bg2; rr(ctx, x, y, W, rh, 12); ctx.fill(); ctx.fillRect(x, y + rh / 2, W, rh / 2);
    ["strategi", "benar untuk semua kasus?", "cepat saat data besar?", "mudah ditulis?"].forEach((h, c) => text(ctx, h, x + cw.slice(0, c).reduce((a, b) => a + b, 0) + cw[c] / 2, y + rh / 2 + 8, 20, { align: "center", weight: 900, color: C.ink2 }));
    rows.forEach((r, i) => { if (i >= n) return; const ry = y + rh * (i + 1); if (opt.hlRow === i) { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 2, ry, W - 4, rh); } r.forEach((v, c) => { const col = v === "✓" ? C.good : v === "✕" ? C.bad : v === "△" ? C.accentDark : C.ink; text(ctx, v, x + cw.slice(0, c).reduce((a, b) => a + b, 0) + cw[c] / 2, ry + rh / 2 + 10, c ? 30 : 22, { align: "center", weight: 900, color: col }); }); ctx.strokeStyle = "#E1E8E4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, ry); ctx.lineTo(x + W, ry); ctx.stroke(); });
  };
  K.strategi = St;
})(typeof window !== "undefined" ? window : globalThis);
