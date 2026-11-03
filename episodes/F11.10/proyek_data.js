/* Pembantu gambar F11.10: pipa fungsi (kotak fungsi + data yang diserahkan), kartu baris CSV, tampilan dictionary,
   kartu README, kartu peran kelompok. Gaya diagram Fase F. Data fiktif. Muat setelah kiko-core.js, py.js, alur_dev.js, terbuka.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, clamp } = H;
  const Pd = {};
  Pd.FUNCS = [["baca_data()", "file CSV → list baris", "#2E7E9A"], ["bersihkan()", "lewati kosong, 999, kembar", "#B57A12"], ["rangkum()", "hari hujan per bulan", "#8E6BBF"], ["rekomendasi()", "bulan terbaik", "#2E9E5B"]];
  // pipa: n kotak tampil, active disorot; data[] label di panah
  Pd.pipe = function (ctx, x, y, w, n, opt = {}) {
    const bw = (w - 3 * 70) / 4, h = opt.h || 130, data = opt.data || ["list mentah", "list bersih", "dictionary"];
    Pd.FUNCS.forEach(([t, s, col], i) => { const cx = x + i * (bw + 70); ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; card(ctx, cx, y, bw, h, { fill: opt.active === i ? "#FFF3D6" : "#fff", stroke: col, lw: opt.active === i ? 6 : 4, r: 14 }); ctx.fillStyle = col; rr(ctx, cx, y, bw, 40, 14); ctx.fill(); ctx.fillRect(cx, y + 20, bw, 20); text(ctx, t, cx + bw / 2, y + 28, 19, { align: "center", weight: 900, color: "#fff" }); para(ctx, s, cx + bw / 2, y + 74, 17, bw - 20, { align: "center", weight: 800, color: C.ink2 }); ctx.restore();
      if (i < 3 && i + 1 < n) { const ax = cx + bw + 6; ctx.strokeStyle = C.accent; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ax, y + h / 2); ctx.lineTo(ax + 56, y + h / 2); ctx.stroke(); ctx.fillStyle = C.accent; ctx.beginPath(); ctx.moveTo(ax + 58, y + h / 2); ctx.lineTo(ax + 46, y + h / 2 - 9); ctx.lineTo(ax + 46, y + h / 2 + 9); ctx.fill(); text(ctx, data[i], ax + 30, y + h + 28, 15, { align: "center", weight: 900, color: C.accentDark }); } });
  };
  // kartu baris CSV: rows [[tanggal, mm, status]] status: null|"bad"|"dup"|"ok"
  Pd.rows = function (ctx, x, y, w, rows, opt = {}) {
    const rh = opt.rh || 40, h = 50 + rows.length * rh; card(ctx, x, y, w, h, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 12 }); text(ctx, opt.title || "hujan_sukamaju.csv", x + 16, y + 32, 17, { weight: 900, color: C.kiko });
    rows.forEach(([d, mm, st], i) => { const ry = y + 46 + i * rh; if (st) { ctx.fillStyle = st === "ok" ? C.goodBg : C.badBg; ctx.fillRect(x + 3, ry, w - 6, rh - 2); } text(ctx, d, x + 16, ry + rh / 2 + 7, 18, { weight: 800 }); text(ctx, mm === "" ? "(kosong)" : mm, x + w * 0.62, ry + rh / 2 + 7, 18, { weight: 900, color: st === "bad" || st === "dup" ? C.bad : C.ink }); if (st && st !== "ok") text(ctx, st === "dup" ? "kembar" : "lewati", x + w - 14, ry + rh / 2 + 7, 15, { align: "right", weight: 900, color: C.bad }); });
    return h;
  };
  // dictionary: pairs [[kunci, nilai]], hl kunci
  Pd.dict = function (ctx, x, y, w, pairs, opt = {}) {
    const rh = 40, h = 54 + (pairs.length + 1) * rh; card(ctx, x, y, w, h, { fill: "#1F2A33", r: 12 }); text(ctx, opt.title || "hari_hujan = {", x + 16, y + 32, 18, { weight: 900, color: "#8FD0E6" });
    pairs.forEach(([k, v], i) => { const ry = y + 50 + i * rh; if (opt.hl === k) { ctx.fillStyle = "rgba(242,177,52,0.35)"; rr(ctx, x + 8, ry, w - 16, rh - 4, 8); ctx.fill(); } const ks = "\"" + k + "\":"; text(ctx, ks, x + 36, ry + 26, 19, { weight: 800, color: "#A5D6A7" }); ctx.font = `800 19px ${K.FONT}`; text(ctx, String(v) + ",", x + 36 + ctx.measureText(ks).width + 12, ry + 26, 19, { weight: 900, color: "#8FD0E6" }); });
    text(ctx, "}", x + 16, y + 50 + pairs.length * rh + 26, 18, { weight: 900, color: "#8FD0E6" }); return h;
  };
  // kartu README
  Pd.readme = function (ctx, x, y, w, lines, opt = {}) {
    const h = 60 + lines.length * 36; card(ctx, x, y, w, h, { fill: "#fff", stroke: C.kiko, lw: 4, r: 14 }); text(ctx, "📄 README.md", x + 18, y + 38, 22, { weight: 900, color: C.kiko });
    lines.forEach((s, i) => { if (opt.n != null && i >= opt.n) return; text(ctx, s, x + 22, y + 76 + i * 36, 18, { weight: 800, color: s.startsWith("#") ? C.accentDark : C.ink }); }); return h;
  };
  K.proyekdata = Pd;
})(typeof window !== "undefined" ? window : globalThis);
