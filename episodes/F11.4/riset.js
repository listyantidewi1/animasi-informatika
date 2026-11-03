/* Pembantu gambar F11.4: foto banjir fiktif yang digambar kode, kartu metadata, garis waktu jejak foto, rantai kutipan
   "telepon rusak", kartu jenis sumber, stempel putusan, deretan bingkai video, alur bernomor. Gaya diagram Fase F.
   Semua nama tempat, situs, dan lembaga fiktif. Muat setelah kiko-core.js, kiko-devices.js, lateral.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, wrap, card, clamp } = H;
  const R = {};
  // foto banjir: langit, gedung, air, papan nama jalan; opt.caption (bar bawah), opt.sign (teks papan), opt.hl = [ "sign" | "shadow" | "cloth" ]
  R.photo = function (ctx, x, y, w, h, opt = {}) {
    ctx.save(); rr(ctx, x, y, w, h, 12); ctx.clip();
    const g = ctx.createLinearGradient(0, y, 0, y + h * 0.5); g.addColorStop(0, "#9FC3D8"); g.addColorStop(1, "#D9E6EC"); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#B9A58A"; ctx.fillRect(x + w * 0.05, y + h * 0.18, w * 0.28, h * 0.4); ctx.fillStyle = "#CFC0A8"; ctx.fillRect(x + w * 0.38, y + h * 0.1, w * 0.3, h * 0.48); ctx.fillStyle = "#A99A82"; ctx.fillRect(x + w * 0.72, y + h * 0.22, w * 0.25, h * 0.36);
    ctx.fillStyle = "#8FB3C9"; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) ctx.fillRect(x + w * (0.41 + c * 0.07), y + h * (0.15 + r * 0.11), w * 0.04, h * 0.06);
    ctx.fillStyle = "#7A8C5C"; ctx.fillRect(x, y + h * 0.56, w, h * 0.06);
    ctx.fillStyle = "#8B7B4F"; ctx.fillRect(x, y + h * 0.6, w, h * 0.4); ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 2; for (let i = 0; i < 6; i++) { ctx.beginPath(); for (let px = 0; px <= w; px += 10) ctx.lineTo(x + px, y + h * (0.66 + i * 0.055) + Math.sin(px / 18 + i) * 3); ctx.stroke(); }
    // tiang papan nama
    const sx = x + w * 0.8, sy = y + h * 0.3; ctx.fillStyle = "#555"; ctx.fillRect(sx - 3, sy, 6, h * 0.42); ctx.fillStyle = "#2E7E5B"; rr(ctx, sx - w * 0.11, sy - 6, w * 0.22, h * 0.09, 4); ctx.fill(); text(ctx, opt.sign || "JL. MELATI", sx, sy + h * 0.055, Math.max(10, w * 0.028), { align: "center", weight: 900, color: "#fff" });
    // bayangan panjang ke kiri (matahari sore)
    ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.moveTo(sx - 3, y + h * 0.72); ctx.lineTo(sx - w * 0.2, y + h * 0.8); ctx.lineTo(sx - w * 0.19, y + h * 0.83); ctx.lineTo(sx + 3, y + h * 0.72); ctx.fill();
    // orang dengan jas hujan di air
    const px = x + w * 0.3, py = y + h * 0.7; ctx.fillStyle = "#E0B04B"; rr(ctx, px - w * 0.03, py - h * 0.14, w * 0.06, h * 0.16, 6); ctx.fill(); ctx.fillStyle = "#F1C9A5"; ctx.beginPath(); ctx.arc(px, py - h * 0.17, w * 0.022, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = opt.stroke || "#C9D4DB"; ctx.lineWidth = 3; rr(ctx, x, y, w, h, 12); ctx.stroke();
    if (opt.caption) { ctx.fillStyle = "rgba(20,30,36,0.82)"; rr(ctx, x, y + h - 40, w, 40, 0); ctx.fill(); ctx.fillRect(x, y + h - 40, w, 28); text(ctx, opt.caption, x + 12, y + h - 13, Math.max(12, w * 0.032), { weight: 800, color: "#fff" }); }
    const marks = { sign: [sx, sy - 6 + h * 0.045, "papan nama", Math.hypot(w * 0.11, h * 0.045) + 8], shadow: [sx - w * 0.1, y + h * 0.78, "bayangan: sore", w * 0.07], cloth: [px, py - h * 0.08, "jas hujan", w * 0.07] };
    (opt.hl || []).forEach(k => { const [mx, my, lab, mr] = marks[k]; ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = C.accent; rr(ctx, mx - 60, my + mr + 6, 120, 26, 6); ctx.fill(); text(ctx, lab, mx, my + mr + 25, 15, { align: "center", weight: 900, color: "#fff" }); });
  };
  // kartu metadata: rows [[kunci, nilai, hilang?]]
  R.exif = function (ctx, x, y, w, rows, opt = {}) {
    const h = 54 + rows.length * 36; card(ctx, x, y, w, h, { fill: "#1F2A33", r: 12 }); text(ctx, opt.title || "METADATA (EXIF)", x + 16, y + 32, 16, { weight: 900, color: "#8FD0E6" });
    rows.forEach(([k, v, gone], i) => { const ry = y + 66 + i * 36; text(ctx, k, x + 16, ry, 18, { weight: 800, color: "#B7C4CC" }); text(ctx, gone ? "— dihapus —" : v, x + w - 16, ry, 18, { align: "right", weight: 900, color: gone ? "#FF8A80" : "#fff" }); });
    return h;
  };
  // garis waktu: events [[label, sub, warna]]; n tampil
  R.timeline = function (ctx, x, y, w, events, n, opt = {}) {
    ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke();
    const step = w / Math.max(1, events.length - 1);
    events.forEach(([lab, sub, col], i) => { if (i >= n) return; const cx = x + i * step; ctx.fillStyle = col || C.kiko; ctx.beginPath(); ctx.arc(cx, y, 16, 0, Math.PI * 2); ctx.fill(); text(ctx, lab, cx, y - 30, 24, { align: "center", weight: 900, color: col || C.kiko }); para(ctx, sub, cx, y + 48, 19, 300, { align: "center", weight: 800, color: C.ink2 }); });
  };
  // rantai kutipan: items [[siapa, kalimat]]; n tampil; warna makin merah
  R.chain = function (ctx, x, y, w, items, n, opt = {}) {
    const bw = (w - (items.length - 1) * 40) / items.length; const cols = [C.good, "#B57A12", "#D9443B", "#8E2B24"];
    items.forEach(([who, s], i) => { if (i >= n) return; const cx = x + i * (bw + 40); card(ctx, cx, y, bw, 150, { fill: "#fff", stroke: cols[Math.min(i, 3)], lw: 4, r: 14 }); text(ctx, who, cx + 14, y + 32, 18, { weight: 900, color: cols[Math.min(i, 3)] }); para(ctx, "“" + s + "”", cx + 14, y + 68, 20, bw - 28, { weight: 800 }); if (i < items.length - 1 && i + 1 < n) { ctx.fillStyle = C.ink2; ctx.beginPath(); ctx.moveTo(cx + bw + 8, y + 65); ctx.lineTo(cx + bw + 32, y + 75); ctx.lineTo(cx + bw + 8, y + 85); ctx.fill(); } });
  };
  // kartu sumber: level "primer"|"sekunder"|"tersier"
  R.source = function (ctx, x, y, w, h, level, title, sub, opt = {}) {
    const col = { primer: C.good, sekunder: C.kiko, tersier: "#8E6BBF" }[level];
    ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2; card(ctx, x, y, w, h, { fill: opt.on ? "#FFF3D6" : "#fff", stroke: col, lw: opt.on ? 6 : 3, r: 14 }); ctx.fillStyle = col; rr(ctx, x, y, w, 40, 14); ctx.fill(); ctx.fillRect(x, y + 20, w, 20); text(ctx, level.toUpperCase(), x + w / 2, y + 28, 20, { align: "center", weight: 900, color: "#fff" });
    para(ctx, title, x + w / 2, y + 80, 22, w - 30, { align: "center", weight: 900 }); para(ctx, sub, x + w / 2, y + h - 50, 18, w - 30, { align: "center", weight: 700, color: C.ink2 }); ctx.restore();
  };
  R.VERDICTS = [["benar", C.good, C.goodBg], ["salah", C.bad, C.badBg], ["salah konteks", "#B57A12", "#FFF3D6"], ["belum pasti", "#5A6B75", "#E6EDF2"]];
  // empat stempel putusan; pick = indeks yang dipilih
  R.verdicts = function (ctx, x, y, w, pick, opt = {}) {
    // opt.cols = 2 -> kisi 2×2; ukuran huruf menyesuaikan lebar kotak agar label panjang tidak meluber
    const cols = opt.cols || 4, rows = Math.ceil(4 / cols), h = opt.h || 90, gap = 20, bw = (w - (cols - 1) * gap) / cols;
    R.VERDICTS.forEach(([t, col, bg], i) => { const cx = x + (i % cols) * (bw + gap), cy = y + Math.floor(i / cols) * (h + gap); const on = pick === i; ctx.save(); if (pick != null && !on) ctx.globalAlpha = 0.3; card(ctx, cx, cy, bw, h, { fill: bg, stroke: col, lw: on ? 7 : 3, r: 14 }); const T = t.toUpperCase(); text(ctx, T, cx + bw / 2, cy + h / 2 + 9, Math.min((opt.size || 22) + (on ? 4 : 0), (bw - 24) / (T.length * 0.72)), { align: "center", weight: 900, color: col }); ctx.restore(); });
    return rows * h + (rows - 1) * gap;
  };
  // deretan bingkai video
  R.frames = function (ctx, x, y, n, opt = {}) {
    const w = opt.w || 150, h = opt.h || 90; for (let i = 0; i < n; i++) { const cx = x + i * (w + 14); R.photo(ctx, cx, y, w, h, { sign: "JL. MELATI" }); text(ctx, "0:" + String(i * 7).padStart(2, "0"), cx + w / 2, y + h + 22, 16, { align: "center", weight: 800, color: C.ink2 }); if (opt.hl === i) { ctx.strokeStyle = C.accent; ctx.lineWidth = 6; rr(ctx, cx, y, w, h, 12); ctx.stroke(); } }
  };
  // alur bernomor mendatar: items [[judul, sub]]; n tampil
  R.flow = function (ctx, x, y, w, items, n, opt = {}) {
    const bw = (w - (items.length - 1) * 24) / items.length;
    items.forEach(([t, s], i) => { const cx = x + i * (bw + 24); ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, cx, y, bw, opt.h || 190, { fill: i === n - 1 ? "#FFF3D6" : C.bg2, stroke: i === n - 1 ? C.accent : undefined, lw: 4, r: 16 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(cx + 30, y + 32, 20, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), cx + 30, y + 40, 20, { align: "center", weight: 900, color: "#fff" }); para(ctx, t, cx + 14, y + 86, 22, bw - 28, { weight: 900 }); para(ctx, s, cx + 14, y + 150, 18, bw - 28, { weight: 700, color: C.ink2 }); ctx.restore(); });
  };
  K.riset = R;
})(typeof window !== "undefined" ? window : globalThis);
