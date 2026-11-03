/* Pembantu gambar F12.4: kartu undang-undang, kartu dilema bercabang (pilihan ✓/✕ beserta akibat), papan tiga kolom,
   kartu kecil, daftar centang. Gaya diagram Fase F. Semua contoh fiktif. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card } = H;
  const Hk = {};
  // kartu undang-undang: judul, nomor, baris poin; opt {w, col, ic, n}
  Hk.law = function (ctx, x, y, w, title, nomor, opt = {}) {
    const col = opt.col || "#5B4B8A"; card(ctx, x, y, w, 120, { fill: "#F4F0FA", stroke: col, lw: 4, r: 16 });
    ctx.fillStyle = col; rr(ctx, x + 16, y + 16, 88, 88, 14); ctx.fill(); text(ctx, opt.ic || "⚖️", x + 60, y + 76, 44, { align: "center" });
    text(ctx, title, x + 124, y + 52, 28, { weight: 900, color: col }); text(ctx, nomor, x + 124, y + 90, 20, { weight: 800, color: C.ink2 });
  };
  // daftar poin bertanda; items [[teks, kind]] kind "ok"|"no"|"info"; opt {n, size, gap}
  Hk.list = function (ctx, x, y, w, items, opt = {}) {
    const gap = opt.gap || 64, n = opt.n == null ? items.length : opt.n;
    items.forEach(([s, kind], i) => { ctx.save(); if (i >= n) ctx.globalAlpha = 0.18; const bg = kind === "ok" ? C.goodBg : kind === "no" ? C.badBg : C.bg2, col = kind === "ok" ? C.good : kind === "no" ? C.bad : C.kiko; card(ctx, x, y + i * gap, w, gap - 10, { fill: bg, r: 12 }); text(ctx, kind === "ok" ? "✓" : kind === "no" ? "✕" : "•", x + 26, y + i * gap + (gap - 10) / 2 + 10, 26, { align: "center", weight: 900, color: col }); text(ctx, s, x + 52, y + i * gap + (gap - 10) / 2 + 8, opt.size || 22, { weight: 800 }); ctx.restore(); });
  };
  // cabang pilihan: dari titik (x0,y0) ke dua/tiga kartu; opts [[label, akibat, ok]]; opt {on: indeks dipilih, w}
  Hk.branch = function (ctx, x0, y0, x, y, opts, opt = {}) {
    const w = opt.w || 520, h = opt.h || 120, gap = opt.gap || 20;
    opts.forEach(([lab, akibat, ok], i) => { const by = y + i * (h + gap); const show = opt.reveal == null || i < opt.reveal; ctx.strokeStyle = "#B7C4CC"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0 + 60, y0, x - 60, by + h / 2, x, by + h / 2); ctx.stroke();
      if (!show) { card(ctx, x, by, w, h, { fill: "#F4F6F5", stroke: "#D7E2DC", lw: 2, r: 14 }); return; }
      const res = opt.judged; const bg = res ? (ok ? C.goodBg : C.badBg) : "#fff", st = res ? (ok ? C.good : C.bad) : C.kiko;
      card(ctx, x, by, w, h, { fill: bg, stroke: st, lw: 4, r: 14 }); text(ctx, String.fromCharCode(65 + i), x + 30, by + 44, 26, { align: "center", weight: 900, color: st }); para(ctx, lab, x + 56, by + 40, 22, w - 76, { weight: 900 });
      if (res) text(ctx, (ok ? "✓ " : "✕ ") + akibat, x + 56, by + h - 18, 18, { weight: 900, color: st }); });
  };
  // papan tiga kolom; cards [[teks, kolom 0..2]]; opt {n}
  Hk.board = function (ctx, x, y, w, h, cards, opt = {}) {
    const cols = [["boleh", C.good, C.goodBg], ["tidak boleh", C.bad, C.badBg], ["tergantung", C.accentDark, "#FFF3D6"]], cw = (w - 40) / 3;
    cols.forEach(([t, col, bg], i) => { const cx = x + i * (cw + 20); card(ctx, cx, y, cw, h, { fill: bg, stroke: col, lw: 3, r: 16 }); text(ctx, t, cx + cw / 2, y + 42, 26, { align: "center", weight: 900, color: col }); });
    const cnt = [0, 0, 0]; cards.slice(0, opt.n == null ? cards.length : opt.n).forEach(([s, c]) => { const cx = x + c * (cw + 20) + 16, cy = y + 70 + cnt[c] * 124; cnt[c]++; card(ctx, cx, cy, cw - 32, 110, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 2, r: 12 }); para(ctx, s, cx + (cw - 32) / 2, cy + 40, 23, cw - 64, { align: "center", weight: 800 }); });
  };
  K.hukum = Hk;
})(typeof window !== "undefined" ? window : globalThis);
