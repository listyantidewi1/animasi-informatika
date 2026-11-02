/* Pembantu gambar E.7: kotak tipe data, blok deklarasi, kartu operator, panel BACA/TULIS, bingkai fungsi dengan parameter
   dan nilai balik, kode Python berdampingan. Gaya diagram Fase E. Muat setelah kiko-core.js, kiko-devices.js, alur.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, clamp } = H;
  const Kd = {};
  Kd.TYPES = [["bulat", "#2E7E9A", "17, −3"], ["pecahan", "#8E6BBF", "3,5"], ["teks", "#2E9E5B", "\"Sinta\", \"0812…\""], ["boolean", "#B57A12", "benar / salah"]];
  // kotak tipe: nama + contoh + kartu yang sudah masuk
  Kd.typeBox = function (ctx, x, y, w, h, i, items = [], opt = {}) {
    const [name, col, ex] = Kd.TYPES[i]; ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2;
    card(ctx, x, y, w, h, { fill: "#fff", stroke: col, lw: opt.on ? 6 : 3, r: 16 }); ctx.fillStyle = col; rr(ctx, x, y, w, 46, 16); ctx.fill(); ctx.fillRect(x, y + 23, w, 23); text(ctx, name, x + w / 2, y + 31, 24, { align: "center", weight: 900, color: "#fff" });
    text(ctx, ex, x + w / 2, y + 78, 20, { align: "center", weight: 700, color: C.ink2 });
    items.forEach((it, k) => { ctx.fillStyle = "#FFF9E0"; ctx.strokeStyle = "#E0B04B"; ctx.lineWidth = 2; rr(ctx, x + 16, y + 96 + k * 46, w - 32, 38, 8); ctx.fill(); ctx.stroke(); text(ctx, it, x + w / 2, y + 122 + k * 46, 22, { align: "center", weight: 900 }); });
    ctx.restore();
  };
  // blok kode bergaya pseudocode ketat: lines [{t, ind, hl, kind:"kw"}]; kata kunci disorot otomatis
  Kd.code = function (ctx, x, y, w, lines, opt = {}) {
    const rh = opt.rh || 44, size = opt.size || 22; card(ctx, x, y, w, 50 + rh * lines.length, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 14 });
    text(ctx, opt.title || "PSEUDOCODE", x + 18, y + 32, 18, { weight: 900, color: C.ink2 });
    const KW = /^(PROGRAM|DEKLARASI|ALGORITMA|FUNGSI|PROSEDUR|KEMBALIKAN|BACA|TULIS|UNTUK|SELAMA|JIKA|MAKA|LAINNYA|ULANGI|SAMPAI|DIV|MOD|DAN|ATAU|TIDAK|dari|sampai)$/;
    lines.forEach((ln, i) => { const ly = y + 50 + i * rh; if (ln.hl) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 8, ly + 2, w - 16, rh - 4, 8); ctx.fill(); } if (ln.bad) { ctx.fillStyle = C.badBg; rr(ctx, x + 8, ly + 2, w - 16, rh - 4, 8); ctx.fill(); }
      text(ctx, String(i + 1), x + 30, ly + rh / 2 + 8, 16, { align: "center", weight: 800, color: C.muted });
      let cx = x + 56 + (ln.ind || 0) * 34; (ln.t || "").split(/(\s+)/).forEach(tok => { if (!tok) return; const kw = KW.test(tok); const col = kw ? C.kiko : /^(bulat|pecahan|teks|boolean|larik)$/.test(tok) ? "#8E6BBF" : ln.bad ? C.bad : C.ink; text(ctx, tok, cx, ly + rh / 2 + 8, size, { weight: kw ? 900 : 700, color: col }); ctx.font = `${kw ? 900 : 700} ${size}px Inter, sans-serif`; cx += ctx.measureText(tok).width; }); });
    return 50 + rh * lines.length;
  };
  // kartu operator
  Kd.opCard = function (ctx, x, y, w, sym, name, ex, opt = {}) { ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2; card(ctx, x, y, w, 110, { fill: opt.on ? "#FFF3D6" : C.bg2, stroke: opt.on ? C.accent : undefined, lw: 4, r: 14 }); text(ctx, sym, x + 20, y + 50, 30, { weight: 900, color: C.kiko }); text(ctx, name, x + 20, y + 84, 18, { weight: 800, color: C.ink2 }); text(ctx, ex, x + w - 20, y + 66, 22, { align: "right", weight: 900 }); ctx.restore(); };
  // konsol: baris masukan/keluaran
  Kd.console = function (ctx, x, y, w, lines, opt = {}) { card(ctx, x, y, w, 40 + lines.length * 40 + 20, { fill: "#1F2A33", r: 14 }); text(ctx, "LAYAR", x + 16, y + 28, 16, { weight: 900, color: "#8FD0E6" }); lines.forEach(([t, kind], i) => text(ctx, (kind === "in" ? "> " : "") + t, x + 20, y + 68 + i * 40, 24, { weight: 900, color: kind === "in" ? C.accent : "#fff" })); };
  // bingkai pemanggilan fungsi: nama, param [[nama, nilai]], lokal, hasil
  Kd.frame = function (ctx, x, y, w, name, params, opt = {}) {
    const h = 70 + params.length * 44 + (opt.ret != null ? 60 : 20); card(ctx, x, y, w, h, { fill: "#F4F0FA", stroke: "#8E6BBF", lw: 4, r: 16 }); text(ctx, "bingkai: " + name, x + 18, y + 36, 20, { weight: 900, color: "#8E6BBF" });
    params.forEach(([k, v], i) => { ctx.fillStyle = "#fff"; rr(ctx, x + 16, y + 52 + i * 44, w - 32, 36, 8); ctx.fill(); text(ctx, k + " (lokal)", x + 28, y + 76 + i * 44, 18, { weight: 800, color: C.ink2 }); text(ctx, String(v), x + w - 28, y + 77 + i * 44, 22, { align: "right", weight: 900 }); });
    if (opt.ret != null) { ctx.fillStyle = C.goodBg; rr(ctx, x + 16, y + h - 52, w - 32, 36, 8); ctx.fill(); text(ctx, "KEMBALIKAN " + opt.ret, x + w / 2, y + h - 28, 20, { align: "center", weight: 900, color: C.good }); }
    return h;
  };
  K.kode = Kd;
})(typeof window !== "undefined" ? window : globalThis);
