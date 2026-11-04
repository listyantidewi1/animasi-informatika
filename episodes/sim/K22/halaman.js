/* Tiruan halaman latihan episode di layar HP (digambar dengan kode) untuk beat `latihan` simulasi konsep.
   Kiko.halaman(ctx, x, y, s, spec, l): x,y pojok kiri atas layar, s skala (1 = 1 px CSS), spec = {judul, rows:[…], taps:[…]}.
   rows: {tabs:[…], on}, {task:"…"}, {label:"…"}, {buttons:[…], on, cols}, {bars:[[label, nilai, warna]]}, {note:"…"}.
   taps: [[baris, tombol, detik]] → tombol ditekan (lingkaran ketuk berdenyut) dan menjadi aktif mulai detik itu. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap } = H;
  const W = 400;
  K.halaman = function (ctx, x0, y0, s, spec, l, opt = {}) {
    const hgt = opt.h || 640;
    ctx.save(); ctx.translate(x0, y0); ctx.scale(s, s);
    // bingkai HP
    ctx.fillStyle = "#1F2A33"; rr(ctx, -16, -40, W + 32, hgt + 70, 34); ctx.fill();
    ctx.fillStyle = "#3A4954"; rr(ctx, W / 2 - 40, -26, 80, 8, 4); ctx.fill();
    ctx.save(); rr(ctx, 0, 0, W, hgt, 14); ctx.clip();
    ctx.fillStyle = "#EAF2EE"; ctx.fillRect(0, 0, W, hgt);
    // bilah alamat
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, W, 34); text(ctx, "🔒 " + spec.url, W / 2, 22, 12, { align: "center", weight: 700, color: C.ink2 });
    let y = 46 - (spec.scroll || 0);
    // kartu
    const cx = 16, cw = W - 32; const top = y;
    ctx.fillStyle = "#FFFFFF"; rr(ctx, cx, y, cw, hgt + 400, 16); ctx.fill(); ctx.strokeStyle = "#D7E2DC"; ctx.lineWidth = 1.5; ctx.stroke();
    y += 34; wrap(ctx, spec.judul, 19, 800, cw - 36).forEach(ln => { text(ctx, ln, cx + 18, y, 19, { weight: 800 }); y += 25; });
    y += 4;
    const taps = spec.taps || []; const pos = {};
    const state = ri => { let on = spec.rows[ri].on; taps.forEach(([r, i, t]) => { if (r === ri && l >= t) on = i; }); return on; };
    spec.rows.forEach((row, ri) => {
      const on = state(ri);
      if (row.tabs || (row.buttons && !row.cols)) {
        const items = row.tabs || row.buttons; let bx = cx + 18; y += 6;
        items.forEach((t, i) => { ctx.font = "800 12px Inter"; const bw = ctx.measureText(t).width + 22; if (bx + bw > cx + cw - 18) { bx = cx + 18; y += 40; }
          const act = i === on; ctx.fillStyle = act ? "#FFF3D6" : C.bg2; rr(ctx, bx, y, bw, 32, 8); ctx.fill(); if (act) { ctx.strokeStyle = C.kiko; ctx.lineWidth = 2.5; ctx.stroke(); }
          text(ctx, t, bx + 11, y + 21, 12, { weight: 800 }); pos[ri + ":" + i] = [bx + bw / 2, y + 16]; bx += bw + 8; });
        y += 44;
      } else if (row.buttons) {
        const n = row.cols, gw = (cw - 36 - (n - 1) * 8) / n; y += 4;
        row.buttons.forEach((t, i) => { const bx = cx + 18 + (i % n) * (gw + 8), by = y + Math.floor(i / n) * 44; const act = i === on;
          ctx.fillStyle = act ? "#FFF3D6" : "#FFFFFF"; rr(ctx, bx, by, gw, 38, 9); ctx.fill(); ctx.strokeStyle = act ? C.kiko : "#C9D4DB"; ctx.lineWidth = act ? 2.5 : 1.5; ctx.stroke();
          text(ctx, t, bx + gw / 2, by + 24, 13, { align: "center", weight: 800 }); pos[ri + ":" + i] = [bx + gw / 2, by + 19]; });
        y += Math.ceil(row.buttons.length / n) * 44 + 4;
      } else if (row.task) {
        const lines = wrap(ctx, row.task, 13, 700, cw - 60); ctx.fillStyle = C.bg2; rr(ctx, cx + 18, y + 4, cw - 36, lines.length * 18 + 20, 10); ctx.fill();
        lines.forEach((ln, i) => text(ctx, ln, cx + 30, y + 24 + i * 18, 13, { weight: 700 })); y += lines.length * 18 + 32;
      } else if (row.label) { text(ctx, row.label, cx + 18, y + 14, 11, { weight: 800, color: C.ink2 }); y += 20; }
      else if (row.note) { wrap(ctx, row.note, 11, 600, cw - 36).forEach(ln => { text(ctx, ln, cx + 18, y + 12, 11, { weight: 600, color: C.ink2 }); y += 15; }); y += 6; }
      else if (row.bars) {
        const show = row.after == null || l >= row.after; const max = Math.max(...row.bars.map(b => b[1]));
        row.bars.forEach(([lab, v, col]) => { ctx.save(); if (!show) ctx.globalAlpha = 0.25; text(ctx, lab, cx + 18, y + 12, 12, { weight: 800 }); ctx.fillStyle = "#E1E8E4"; rr(ctx, cx + 18, y + 18, cw - 36, 14, 7); ctx.fill(); ctx.fillStyle = col; rr(ctx, cx + 18, y + 18, Math.max(10, (cw - 36) * v / max), 14, 7); ctx.fill(); ctx.restore(); y += 42; });
      } else if (row.custom) { y = row.custom(ctx, cx + 18, y, cw - 36, l) || y; }
    });
    // lingkaran ketuk
    taps.forEach(([r, i, t]) => { const u = (l - t + 0.35) / 0.9; const p = pos[r + ":" + i]; if (!p || u < 0 || u > 1) return;
      ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.globalAlpha = 1 - u; ctx.beginPath(); ctx.arc(p[0], p[1], 10 + 26 * u, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(242,177,52,0.45)"; ctx.beginPath(); ctx.arc(p[0], p[1], 12, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore(); ctx.restore();
    return { pos: Object.fromEntries(Object.entries(pos).map(([k, [px, py]]) => [k, [x0 + px * s, y0 + py * s]])) };
  };
  // panel langkah di samping HP: items [teks], n = langkah aktif
  K.halaman.steps = function (ctx, x, y, w, title, items, n) {
    let hh = 70; const rows = items.map(s => wrap(ctx, s, 26, 700, w - 90)); rows.forEach(r => hh += r.length * 34 + 20);
    H.card(ctx, x, y, w, hh, { fill: "#FFFFFF", stroke: "#D7E2DC", lw: 3, r: 18 }); text(ctx, title, x + 26, y + 46, 26, { weight: 900, color: C.accentDark });
    let yy = y + 76;
    rows.forEach((lines, i) => { const done = i < n, now = i === n;
      if (now) { ctx.fillStyle = "#FFF3D6"; rr(ctx, x + 10, yy - 8, w - 20, lines.length * 34 + 14, 10); ctx.fill(); }
      ctx.fillStyle = done ? C.good : now ? C.accent : "#C9D4DB"; ctx.beginPath(); ctx.arc(x + 40, yy + 14, 15, 0, Math.PI * 2); ctx.fill();
      text(ctx, done ? "✓" : String(i + 1), x + 40, yy + 22, 18, { align: "center", weight: 900, color: "#FFFFFF" });
      lines.forEach((ln, j) => text(ctx, ln, x + 68, yy + 24 + j * 34, 26, { weight: 700, color: done ? C.ink2 : C.ink })); yy += lines.length * 34 + 20; });
    return y + hh;
  };
})(typeof window !== "undefined" ? window : globalThis);
