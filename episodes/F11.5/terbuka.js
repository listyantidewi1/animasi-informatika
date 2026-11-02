/* Pembantu gambar F11.5: alur enam langkah, kartu portal data terbuka fiktif, lencana syarat, catatan pembersihan,
   grafik batang dengan sumbu dipotong (contoh menyesatkan), petak hujan harian, meter keyakinan. Gaya diagram Fase F.
   Semua portal dan angka fiktif. Muat setelah kiko-core.js, kiko-devices.js, lembar.js, data.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, clamp } = H;
  const Tb = {};
  Tb.STEPS = [["pertanyaan", "yang bisa dijawab data"], ["cari data", "terbuka, terpercaya, legal"], ["bersihkan", "tandai, jangan hapus"], ["olah", "ukuran yang tepat"], ["gambarkan", "grafik yang jujur"], ["putuskan", "dengan keyakinan"]];
  Tb.BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  Tb.HARI_HUJAN = [22, 20, 18, 15, 11, 7, 5, 3, 6, 12, 17, 21];
  // alur bernomor mendatar; n tampil, active disorot
  Tb.flow = function (ctx, x, y, w, items, n, opt = {}) {
    const bw = (w - (items.length - 1) * 20) / items.length, h = opt.h || 170;
    items.forEach(([t, s], i) => { const cx = x + i * (bw + 20); ctx.save(); if (i >= n) ctx.globalAlpha = 0.2; const on = opt.active != null ? opt.active === i : i === n - 1; card(ctx, cx, y, bw, h, { fill: on ? "#FFF3D6" : C.bg2, stroke: on ? C.accent : undefined, lw: 4, r: 16 }); ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(cx + 28, y + 30, 18, 0, Math.PI * 2); ctx.fill(); text(ctx, String(i + 1), cx + 28, y + 37, 18, { align: "center", weight: 900, color: "#fff" }); para(ctx, t, cx + 12, y + 84, 22, bw - 24, { weight: 900 }); para(ctx, s, cx + 12, y + 122, 17, bw - 24, { weight: 700, color: C.ink2 }); ctx.restore(); });
  };
  // kartu portal data terbuka fiktif
  Tb.portal = function (ctx, x, y, w, h, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#fff", stroke: "#C9D4DB", lw: 3, r: 14 }); ctx.fillStyle = "#1F5A6E"; rr(ctx, x, y, w, 56, 14); ctx.fill(); ctx.fillRect(x, y + 28, w, 28); text(ctx, "🏛️ Portal Data Terbuka Kota Sukamaju (fiktif)", x + 18, y + 36, 20, { weight: 900, color: "#fff" });
    text(ctx, opt.title || "Curah hujan harian 2023–2025", x + 20, y + 100, 26, { weight: 900 }); text(ctx, opt.sub || "Stasiun Sukamaju · 1.095 baris · diperbarui Jan 2026", x + 20, y + 132, 18, { weight: 700, color: C.ink2 });
    [["CSV", C.good], ["XLSX", C.kiko], ["JSON", "#8E6BBF"]].forEach(([f, col], i) => { ctx.fillStyle = col; rr(ctx, x + 20 + i * 90, y + 150, 78, 32, 8); ctx.fill(); text(ctx, "⬇ " + f, x + 59 + i * 90, y + 172, 16, { align: "center", weight: 900, color: "#fff" }); });
    const meta = [["pengukur", "Lembaga Cuaca Daerah"], ["satuan", "mm per hari; 999 = tidak terukur"], ["lisensi", "terbuka, sebut sumber"]];
    meta.forEach(([k, v], i) => { if (opt.metaN != null && i >= opt.metaN) return; const ry = y + 206 + i * 36; text(ctx, k, x + 20, ry, 17, { weight: 800, color: C.ink2 }); text(ctx, v, x + 130, ry, 17, { weight: 900 }); });
  };
  // lencana syarat: ok true/false/null
  Tb.check = function (ctx, x, y, w, label, sub, ok, opt = {}) {
    ctx.save(); if (opt.dim) ctx.globalAlpha = 0.2; const col = ok == null ? "#B7C4CC" : ok ? C.good : C.bad; card(ctx, x, y, w, 90, { fill: ok == null ? C.bg2 : ok ? C.goodBg : C.badBg, stroke: col, lw: 3, r: 12 }); text(ctx, (ok == null ? "○ " : ok ? "✓ " : "✕ ") + label, x + 18, y + 38, 24, { weight: 900, color: col }); text(ctx, sub, x + 18, y + 68, 17, { weight: 700, color: C.ink2 }); ctx.restore();
  };
  // catatan pembersihan
  Tb.note = function (ctx, x, y, w, lines, opt = {}) {
    const h = 56 + lines.length * 32 + 10; card(ctx, x, y, w, h, { fill: "#FFF9E0", stroke: "#E0B04B", lw: 3, r: 12 }); text(ctx, "📝 " + (opt.title || "CATATAN PEMBERSIHAN"), x + 16, y + 34, 18, { weight: 900, color: C.accentDark });
    lines.forEach((s, i) => { if (opt.n != null && i >= opt.n) return; text(ctx, "• " + s, x + 16, y + 70 + i * 32, 19, { weight: 800 }); }); return h;
  };
  // grafik batang dengan sumbu dimulai dari `base` (bukan nol): untuk contoh menyesatkan
  Tb.cutBars = function (ctx, x, y, w, h, items, base, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#fff", stroke: opt.bad ? C.bad : "#B7C4CC", lw: 3, r: 12 }); const max = Math.max(...items.map(i => i[1])) + 1, bw = (w - 80) / items.length, bottom = y + h - 56, top = y + 44;
    text(ctx, opt.title || "", x + w / 2, y + 28, 20, { align: "center", weight: 900, color: opt.bad ? C.bad : C.ink2 });
    for (let k = 0; k <= 2; k++) { const v = base + (max - base) * k / 2, gy = bottom - (bottom - top) * k / 2; ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 50, gy); ctx.lineTo(x + w - 16, gy); ctx.stroke(); text(ctx, String(Math.round(v)), x + 44, gy + 7, 15, { align: "right", weight: 700, color: C.ink2 }); }
    items.forEach(([lab, v], i) => { const bx = x + 60 + i * bw + bw * 0.2, bh = (bottom - top) * clamp((v - base) / (max - base), 0, 1); ctx.fillStyle = opt.bad ? C.bad : C.kiko; rr(ctx, bx, bottom - bh, bw * 0.6, bh, 6); ctx.fill(); text(ctx, lab, bx + bw * 0.3, bottom + 24, 17, { align: "center", weight: 800, color: C.ink2 }); text(ctx, String(v), bx + bw * 0.3, bottom - bh - 8, 16, { align: "center", weight: 900 }); });
  };
  // petak hujan harian: 30 kotak, nilai mm; opt.hlMax
  Tb.days = function (ctx, x, y, w, vals, opt = {}) {
    const cw = (w - 29 * 3) / 30; vals.forEach((v, i) => { const cx = x + i * (cw + 3); const hh = v === 0 ? 6 : clamp(10 + v * 0.35, 10, 80); ctx.fillStyle = v === 0 ? "#E1E8E4" : v > 100 ? C.bad : C.kiko; rr(ctx, cx, y + 80 - hh, cw, hh, 2); ctx.fill(); });
    text(ctx, opt.label || "", x, y + 104, 16, { weight: 800, color: C.ink2 });
  };
  // meter keyakinan: level 0..1
  Tb.confidence = function (ctx, x, y, w, level, opt = {}) {
    text(ctx, "keyakinan", x, y - 10, 18, { weight: 900, color: C.ink2 }); ctx.fillStyle = "#E6EDF2"; rr(ctx, x, y, w, 26, 13); ctx.fill(); ctx.fillStyle = level > 0.66 ? C.good : level > 0.33 ? C.accent : C.bad; rr(ctx, x, y, w * level, 26, 13); ctx.fill();
    ["belum pasti", "cukup yakin", "yakin"].forEach((s, i) => text(ctx, s, x + w * (i + 0.5) / 3, y + 48, 15, { align: "center", weight: 800, color: C.ink2 }));
  };
  K.terbuka = Tb;
})(typeof window !== "undefined" ? window : globalThis);
