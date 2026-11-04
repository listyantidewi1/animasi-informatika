/* T28 Mengurutkan kartu: cara cepat lawan cara lambat — adegan khusus.
   Angka: selection sort 1.000 kartu = 999 + … + 1 = 499.500 perbandingan; merge sort paling banyak 8.977 (< 10.000). */
(function () {
  const T = TikTok, C = T.C, { rr, font, text, card, pill, arrow, check, bip, rnd, fmt, ease, clamp, lerp, back, cue, ph, pop } = T.helpers;
  const START = [5, 2, 8, 1, 7, 3, 6, 4];
  const VCOL = v => [C.pink, C.kuning, C.tosca, C.biru][v % 4];

  function kartu(ctx, v, x, y, w, h, opt = {}) {
    card(ctx, x, y, w, h, { fill: opt.fill || "#F4F6FF", r: w * 0.14, stroke: opt.stroke, lw: opt.lw || 5, glow: opt.glow });
    ctx.fillStyle = VCOL(v); rr(ctx, x + w * 0.12, y + h * 0.1, w * 0.76, h * 0.12, 4); ctx.fill();
    text(ctx, String(v), x + w / 2, y + h * 0.75, h * 0.48, { align: "center", weight: 900, color: opt.color || C.bg });
  }
  // langkah selection sort: keadaan awal tiap putaran dan posisi kartu terkecil
  const SEL = (() => { const out = []; let a = START.slice();
    for (let k = 0; k < 8; k++) { let m = k; for (let i = k + 1; i < 8; i++) if (a[i] < a[m]) m = i; out.push({ a: a.slice(), m }); const t = a[k]; a[k] = a[m]; a[m] = t; }
    out.push({ a: a.slice(), m: 8 }); return out; })();
  function groups(ctx, gs, y, cw, ch, gap, u, opt = {}) {   // deretan kelompok kartu, dipusatkan
    const total = gs.reduce((s, g) => s + g.length * cw + (g.length - 1) * 6, 0) + gap * (gs.length - 1);
    let x = 480 - total / 2; const centers = [];
    gs.forEach(g => { const gw = g.length * cw + (g.length - 1) * 6;
      if (opt.box) card(ctx, x - 8, y - 8, gw + 16, ch + 16, { fill: "rgba(37,46,110,0.6)", r: 14, stroke: opt.box, lw: 3 });
      g.forEach((v, i) => { ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); kartu(ctx, v, x + i * (cw + 6), y + (1 - clamp(u, 0, 1)) * 30, cw, ch); ctx.restore(); });
      centers.push(x + gw / 2); x += gw + gap; });
    return centers;
  }

  Object.assign(T.SCENES, {
    // di bawah kait: dua penghitung perbandingan berlomba
    t28_kait(ctx, b, l, t, TL, A) {
      const y = A.y + 10, rows = [["Cara lambat", 499500, C.bad, 3.6], ["Cara cepat", 8977, C.good, 0.9]];
      rows.forEach(([nm, n, col, d], i) => {
        const yy = y + i * 200, k = ease(clamp((l - 0.3) / d, 0, 1));
        card(ctx, 80, yy, 800, 170, { fill: C.panel, stroke: col, lw: 5 });
        text(ctx, nm, 120, yy + 62, 40, { weight: 800, color: C.ink2 });
        text(ctx, fmt(n * k), 120, yy + 140, 74, { weight: 900, color: col });
        card(ctx, 520, yy + 100, 320, 26, { fill: C.panel2, r: 13 }); card(ctx, 520, yy + 100, Math.max(26, 320 * (n * k) / 499500), 26, { fill: col, r: 13 });
        if (k >= 1 && i === 1) check(ctx, 800, yy + 60, 50, C.good);
      });
      text(ctx, "perbandingan untuk 1.000 kartu", 480, y + 440, 36, { align: "center", weight: 700, color: C.ink2 });
      const by = y + 470; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(200, A.bot - by - 10), { mood: "wow", t });
    },

    // selection sort: cari yang terkecil, tukar ke depan, ulangi
    t28_pilih(ctx, b, l, t, TL, A) {
      const cw = 92, ch = 130, gx = 480 - (8 * cw + 7 * 10) / 2, y = A.y + 200, per = 1.0;
      const st = Math.max(0, cue(b, l, "mencari")), k = Math.min(7, Math.floor(st / per)), f = st <= 0 ? 0 : (st % per) / per;
      const s = SEL[k], a = s.a, m = s.m, scanEnd = 0.55, sw = ease(clamp((f - 0.6) / 0.35, 0, 1));
      text(ctx, k >= 7 ? "selesai, sudah urut!" : "putaran " + (k + 1), 480, A.y + 70, 50, { align: "center", weight: 900, color: C.kuning });
      for (let i = 0; i < 8; i++) {
        let x = gx + i * (cw + 10), yy = y;
        if (st > 0 && sw > 0 && (i === k || i === m) && m !== k) { const to = i === k ? m : k; x = lerp(x, gx + to * (cw + 10), sw); yy = y - Math.sin(sw * Math.PI) * (i === m ? 120 : -60); }
        const sorted = i < k, isMin = st > 0 && i === m && f > scanEnd;
        kartu(ctx, a[i], x, yy, cw, ch, { fill: sorted ? "#BFF5EA" : "#F4F6FF", stroke: isMin ? C.pink : null, lw: 7 });
      }
      // penunjuk pemindai
      if (st > 0 && f < scanEnd && k < 7) { const j = k + Math.min(7 - k, Math.floor((f / scanEnd) * (8 - k))); const px = gx + j * (cw + 10) + cw / 2;
        ctx.fillStyle = C.kuning; ctx.beginPath(); ctx.moveTo(px, y + ch + 20); ctx.lineTo(px - 22, y + ch + 60); ctx.lineTo(px + 22, y + ch + 60); ctx.fill(); }
      if (k > 0) { ctx.save(); ctx.strokeStyle = C.tosca; ctx.lineWidth = 6; const ex = gx + k * (cw + 10) - 5; ctx.beginPath(); ctx.moveTo(gx, y - 30); ctx.lineTo(ex, y - 30); ctx.stroke(); ctx.restore();
        text(ctx, "sudah urut", gx, y - 46, 32, { weight: 800, color: C.tosca }); }
      const ul = ph(b, l, "terkecil", 0.4);
      if (ul > 0) { ctx.save(); ctx.globalAlpha = ul; pill(ctx, "cari terkecil → pindah ke depan → ulangi", 480, y + ch + 140, 34, { fill: C.panel2, color: C.ink }); ctx.restore(); }
      const by = y + ch + 200; if (A.bot - by > 140) bip(ctx, 480, (by + A.bot) / 2, Math.min(200, A.bot - by - 10), { mood: "think", t });
    },

    // jumlah perbandingan tiap putaran: 7 + 6 + ... + 1; untuk 1.000 kartu 499.500
    t28_hitung(ctx, b, l, t, TL, A) {
      const y = A.y + 30, s = 52;
      text(ctx, "8 kartu", 80, y + 30, 44, { weight: 900, color: C.kuning });
      for (let r = 0; r < 7; r++) {
        const u = ph(b, l, 0.03 + r * 0.06, 0.3); if (u <= 0) continue; const yy = y + 60 + r * (s + 12), n = 7 - r;
        text(ctx, "putaran " + (r + 1), 80, yy + 32, 32, { weight: 700, color: C.ink2 });
        for (let i = 0; i < n; i++) { const ui = clamp(u * n - i, 0, 1); if (ui <= 0) continue; card(ctx, 260 + i * (s + 8), yy, s, s, { fill: C.pink, r: 8 }); }
        text(ctx, String(n), 260 + n * (s + 8) + 20, yy + 32, 36, { weight: 900, color: C.ink });
      }
      const ut = ph(b, l, 0.5, 0.4), ty = y + 60 + 7 * (s + 12) + 50;
      if (ut > 0) { ctx.save(); ctx.globalAlpha = ut; text(ctx, "7 + 6 + 5 + 4 + 3 + 2 + 1 = 28", 80, ty, 44, { weight: 900, color: C.ink }); ctx.restore(); }
      const ub = pop(b, l, "membengkak"), by = ty + 70;
      if (ub > 0) { ctx.save(); ctx.translate(480, by + 80); ctx.scale(ub, ub); card(ctx, -400, -90, 800, 190, { fill: C.badBg, stroke: C.bad, lw: 5 });
        text(ctx, "1.000 kartu: 999 + 998 + … + 1", 0, -20, 42, { align: "center", weight: 800, color: C.ink, fit: 740 });
        text(ctx, "= 499.500", 0, 60, 70, { align: "center", weight: 900, color: C.bad }); ctx.restore(); }
    },

    // merge sort: bagi dua terus sampai satu kartu
    t28_bagi(ctx, b, l, t, TL, A) {
      const lv = [[START], [[5, 2, 8, 1], [7, 3, 6, 4]], [[5, 2], [8, 1], [7, 3], [6, 4]], START.map(v => [v])];
      const cw = 76, ch = 106, y0 = A.y + 30, dy = 225, at = ["membagi", "jadi dua", "terus", "satu kartu"];
      let prev = null;
      lv.forEach((gs, i) => {
        const u = i === 0 ? 1 : ph(b, l, at[i], 0.4); if (u <= 0) return;
        const gap = [0, 60, 40, 22][i], c = groups(ctx, gs, y0 + i * dy, cw, ch, gap, u, { box: i === 3 ? C.tosca : C.line });
        if (prev) { ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); c.forEach((cx, j) => arrow(ctx, prev[Math.floor(j / 2)], y0 + (i - 1) * dy + ch + 14, cx, y0 + i * dy - 14, C.ink2, 5, 18)); ctx.restore(); }
        prev = c;
      });
      const ub = pop(b, l, "satu kartu"), by = y0 + 3 * dy + ch + 80;
      if (ub > 0 && by + 40 < A.bot) { ctx.save(); ctx.translate(480, by); ctx.scale(ub, ub); pill(ctx, "satu kartu pasti sudah urut", 0, 0, 42, { fill: C.tosca }); ctx.restore(); }
    },

    // merge sort: gabungkan berpasangan sambil mengurutkan
    t28_gabung(ctx, b, l, t, TL, A) {
      const lv = [START.map(v => [v]), [[2, 5], [1, 8], [3, 7], [4, 6]], [[1, 2, 5, 8], [3, 4, 6, 7]], [[1, 2, 3, 4, 5, 6, 7, 8]]];
      const cw = 76, ch = 106, y0 = A.bot - ch - 50, dy = 220, at = [0, "digabung", "berpasangan", "jadi satu"];
      let prev = null;
      lv.forEach((gs, i) => {
        const u = i === 0 ? 1 : ph(b, l, at[i], 0.45); if (u <= 0) return;
        const gap = [22, 40, 60, 0][i], c = groups(ctx, gs, y0 - i * dy, cw, ch, gap, u, { box: i === 3 ? C.good : C.line });
        if (prev) { ctx.save(); ctx.globalAlpha = clamp(u, 0, 1); prev.forEach((px, j) => arrow(ctx, px, y0 - (i - 1) * dy - 14, c[Math.floor(j / 2)], y0 - i * dy + ch + 14, C.ink2, 5, 18)); ctx.restore(); }
        prev = c;
      });
      if (cue(b, l, "jadi satu") > 0.5) { const u = pop(b, l, "jadi satu", 0.5); ctx.save(); ctx.translate(480, y0 - 3 * dy - 60); ctx.scale(u, u); pill(ctx, "Urut!", 0, 0, 48, { fill: C.good }); ctx.restore(); }
    }
  });
})();
