/* Pembantu gambar F11.0: blok kode Python dengan pewarnaan kata kunci, konsol keluaran, kotak galat, tabel kebenaran,
   kartu berdiri/duduk. Gaya diagram Fase F. Muat setelah kiko-core.js dan kiko-devices.js. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, wrap, card, clamp } = H;
  const Py = {};
  const KW = /^(if|else|elif|for|in|while|def|return|print|input|int|str|and|or|not|True|False|range|len)$/;
  // blok kode python: lines [{t, hl, bad}] ; opt.title, rh, size
  Py.code = function (ctx, x, y, w, lines, opt = {}) {
    const rh = opt.rh || 44, size = opt.size || 22; card(ctx, x, y, w, 50 + rh * lines.length, { fill: "#1F2A33", r: 14 });
    text(ctx, opt.title || "PYTHON", x + 18, y + 32, 16, { weight: 900, color: "#8FD0E6" });
    lines.forEach((ln, i) => { const ly = y + 50 + i * rh; if (ln.hl) { ctx.fillStyle = "rgba(242,177,52,0.35)"; rr(ctx, x + 8, ly + 2, w - 16, rh - 4, 8); ctx.fill(); } if (ln.bad) { ctx.fillStyle = "rgba(217,68,59,0.45)"; rr(ctx, x + 8, ly + 2, w - 16, rh - 4, 8); ctx.fill(); }
      text(ctx, String(i + 1), x + 30, ly + rh / 2 + 7, 15, { align: "center", weight: 800, color: "#7B8B95" });
      const t = ln.t || ""; const lead = t.match(/^ */)[0].length; let cx = x + 56 + lead * 11; const body = t.slice(lead);
      body.split(/(\s+|\(|\)|:|,|\[|\]|"[^"]*"|'[^']*')/).forEach(tok => { if (!tok) return; const kw = KW.test(tok); const str = /^["'].*["']$/.test(tok); const num = /^\d+$/.test(tok); const col = kw ? "#F2B134" : str ? "#A5D6A7" : num ? "#8FD0E6" : "#FFFFFF"; text(ctx, tok, cx, ly + rh / 2 + 7, size, { weight: kw ? 900 : 700, color: col }); ctx.font = `${kw ? 900 : 700} ${size}px Inter, sans-serif`; cx += ctx.measureText(tok).width; }); });
    return 50 + rh * lines.length;
  };
  Py.console = function (ctx, x, y, w, lines, opt = {}) { const h = 40 + lines.length * 36 + 16; card(ctx, x, y, w, h, { fill: "#0E1418", stroke: "#4A5A66", lw: 3, r: 12 }); text(ctx, "LAYAR", x + 14, y + 26, 14, { weight: 900, color: "#8FD0E6" }); lines.forEach(([t, kind], i) => text(ctx, t, x + 16, y + 60 + i * 36, 20, { weight: 800, color: kind === "in" ? C.accent : kind === "err" ? "#FF8A80" : "#fff" })); return h; };
  Py.error = function (ctx, x, y, w, title, lines) { card(ctx, x, y, w, 60 + lines.length * 30, { fill: C.badBg, stroke: C.bad, lw: 4, r: 12 }); text(ctx, "⚠ " + title, x + 16, y + 36, 22, { weight: 900, color: C.bad }); lines.forEach((s, i) => text(ctx, s, x + 16, y + 70 + i * 30, 18, { weight: 800, color: C.ink })); };
  // tabel kebenaran: op "DAN"|"ATAU"; opt.hlRow
  Py.truth = function (ctx, x, y, op, opt = {}) {
    const rows = [[true, true], [true, false], [false, true], [false, false]]; const f = (a, b) => op === "DAN" ? a && b : a || b; const cw = 120, rh = 46;
    card(ctx, x, y, cw * 3, rh * 5, { fill: "#fff", stroke: "#B7C4CC", lw: 3, r: 10 }); ctx.fillStyle = C.bg2; rr(ctx, x, y, cw * 3, rh, 10); ctx.fill(); ctx.fillRect(x, y + rh / 2, cw * 3, rh / 2);
    ["A", "B", "A " + op + " B"].forEach((h, c) => text(ctx, h, x + c * cw + cw / 2, y + rh / 2 + 7, 18, { align: "center", weight: 900, color: C.ink2 }));
    rows.forEach((r, i) => { const ry = y + rh * (i + 1); if (opt.hlRow === i) { ctx.fillStyle = "#FFF3D6"; ctx.fillRect(x + 2, ry, cw * 3 - 4, rh); } [r[0], r[1], f(r[0], r[1])].forEach((v, c) => text(ctx, v ? "benar" : "salah", x + c * cw + cw / 2, ry + rh / 2 + 7, 18, { align: "center", weight: c === 2 ? 900 : 700, color: v ? C.good : C.bad })); });
  };
  K.py = Py;
})(typeof window !== "undefined" ? window : globalThis);
