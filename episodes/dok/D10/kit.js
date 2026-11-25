/* D10 — perangkat bersama (di atas K.d08 dari ../D08/umum.js): tata letak aman (kolom, kartu, daftar), ikon neon generik,
   panel kode monospace, tangga, garis waktu. Semua teks memakai `fit` sehingga tidak keluar dari wadahnya.
   Zona isi: x 110..1810, y 250..820. Judul di y=178 (di bawah HUD), keterangan bawah di y=868. Tanpa logo/merek. */
(function (g) {
  const K = g.Kiko, D = K.dok, H = K.helpers, U = K.d08, N = U.N;
  const { clamp, lerp, eio, eout, spring } = D, { ramp, txt, RR } = U;
  const W = 1920, HH = 1080, TAU = Math.PI * 2, MONO = "'DejaVu Sans Mono', 'Liberation Mono', monospace";
  const X = K.d10 = { MONO };
  X.reg = (seg, S) => { K.SCENES["d10_b" + seg] = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else U.ruang(ctx, t); }; };
  // ---------- teks tetap ----------
  X.judul = (ctx, s, l, t0, col, o = {}) => D.post(c => U.judulPop(c, s, W / 2, 178, o.size || 58, l, t0, { col: col || N.cyan, fit: 1480, ...o }));
  X.bawah = (ctx, s, l, t0, col, o = {}) => D.post(c => { const p = U.pop(l, t0); if (p.a <= 0.01) return; U.judul(c, s, o.x || W / 2, o.y || 868, o.size || 48, p.a * (o.a == null ? 1 : o.a), { col: col || N.gold, sp: p.sp, fit: o.fit || 1500 }); });
  X.status = (ctx, l, t0) => D.post(c => { const k = ramp(l, t0, 0.4); if (k <= 0.01) return; c.save(); c.globalAlpha *= k; c.font = `700 40px ${K.FONT}`; const s = "Status per 25 November 2026", w = c.measureText(s).width + 48; c.fillStyle = "rgba(10,4,26,0.82)"; RR(c, 96, 822, w, 66, 18); c.fill(); txt(c, s, 120, 868, 40, { weight: 700, color: N.ink2 }); c.restore(); });
  X.sumber = (ctx, l, t0, s) => D.post(c => U.sumber(c, l, t0, s));
  // paragraf terbungkus, rata tengah/kiri; mengembalikan tinggi
  X.para = function (ctx, s, x, y, size, maxW, o = {}) { const lines = H.wrap(ctx, s, size, o.weight || 800, maxW), lh = size * (o.lh || 1.28);
    lines.forEach((ln, i) => txt(ctx, ln, x, y + i * lh, size, { weight: o.weight || 800, color: o.color || N.ink, align: o.align || "left", fit: maxW })); return lines.length * lh; };
  X.mono = function (ctx, s, x, y, size, o = {}) { ctx.save(); ctx.font = `${o.weight || 700} ${size}px ${MONO}`; let sz = size; while (o.fit && sz > 24 && ctx.measureText(s).width > o.fit) { sz -= 2; ctx.font = `${o.weight || 700} ${sz}px ${MONO}`; }
    ctx.fillStyle = o.color || N.ink; ctx.textAlign = o.align || "left"; ctx.textBaseline = "alphabetic"; if (o.a != null) ctx.globalAlpha *= o.a; ctx.fillText(s, x, y); ctx.restore(); };
  // ---------- tata letak ----------
  X.cols = function (n, o = {}) { const x0 = o.x0 == null ? 110 : o.x0, x1 = o.x1 == null ? 1810 : o.x1, gap = o.gap == null ? 44 : o.gap, w = (x1 - x0 - gap * (n - 1)) / n, y = o.y == null ? 270 : o.y, h = o.h == null ? 520 : o.h;
    return Array.from({ length: n }, (_, i) => ({ x: x0 + i * (w + gap), y, w, h, cx: x0 + i * (w + gap) + w / 2 })); };
  // kartu: ikon di atas, judul, lalu baris keterangan (dibungkus). o: col, judul, sub, ikon(ctx,cx,cy,s,col,t), a, sp, redup, nomor
  X.kartu = function (ctx, r, o = {}) {
    const a = o.a == null ? 1 : o.a; if (a <= 0.01) return; const col = o.col || N.cyan, sp = o.sp == null ? 1 : o.sp, rd = o.redup ? 0.45 : 1;
    ctx.save(); ctx.globalAlpha *= a * rd; ctx.translate(r.cx, r.y + r.h / 2); const k = lerp(0.9, 1, sp); ctx.scale(k, k); ctx.translate(-r.cx, -(r.y + r.h / 2));
    U.panel(ctx, r.x, r.y, r.w, r.h, { col, blur: o.redup ? 6 : 22, la: o.redup ? 0.5 : 0.9 });
    const ih = o.ih == null ? Math.min(r.h * 0.4, r.w * 0.5) : o.ih; let y = r.y + 36;
    if (o.nomor != null) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(r.x + 58, r.y + 58, 34, 0, TAU); ctx.fill(); txt(ctx, String(o.nomor), r.x + 58, r.y + 74, 46, { align: "center", weight: 900, color: "#120826" }); }
    if (o.ikon) { o.ikon(ctx, r.cx, y + ih / 2, ih, col, o.t || 0); y += ih + 24; }
    if (o.judul) { y += 50; txt(ctx, o.judul, r.cx, y, o.js || 52, { align: "center", weight: 900, color: o.jcol || N.ink, fit: r.w - 44 }); y += 22; }
    if (o.sub) { (Array.isArray(o.sub) ? o.sub : [o.sub]).forEach(s => { y += 50; y += X.para(ctx, s, r.cx, y, o.ss || 42, r.w - 56, { align: "center", weight: 700, color: o.scol || N.ink2 }) - 50 * 1.0 + 8; }); }
    if (y > r.y + r.h - 14 && a > 0.9) { const m = g.__missing = g.__missing || [], id = "LUAP-KARTU:" + (o.judul || ""); if (!m.includes(id)) m.push(id); }
    ctx.restore();
  };
  // deretan kartu yang muncul pada frasa narasi. items: {ph|t0, judul, sub, ikon, col}; kartu terbaru menyala, yang lama meredup bila o.redup
  X.deret = function (ctx, b, l, t, items, o = {}) { const rs = X.cols(items.length, o); let last = -1; const ts = items.map(it => it.t0 != null ? it.t0 : D.at(b, it.ph, it.off || -0.15));
    ts.forEach((t0, i) => { if (l >= t0) last = i; });
    items.forEach((it, i) => { const p = U.pop(l, ts[i]); X.kartu(ctx, rs[i], { js: o.js, ss: o.ss, ih: o.ih, ...it, a: p.a, sp: p.sp, t, redup: o.redup && i !== last && last >= 0, nomor: o.nomor ? i + 1 : it.nomor }); }); return rs; };
  // daftar baris (ceklis): items {ph|t0, s, col, tanda: "cek"|"silang"|"titik"}
  X.daftar = function (ctx, b, l, x, y, w, items, o = {}) { const rh = o.rh || 96, size = o.size || 46;
    items.forEach((it, i) => { const t0 = it.t0 != null ? it.t0 : D.at(b, it.ph, -0.15), p = U.pop(l, t0); if (p.a <= 0.01) return; const yy = y + i * rh, col = it.col || N.cyan;
      ctx.save(); ctx.globalAlpha *= p.a; ctx.translate((1 - p.sp) * -30, 0); ctx.fillStyle = "rgba(16,8,38,0.86)"; RR(ctx, x, yy, w, rh - 16, 18); ctx.fill(); ctx.strokeStyle = D.hexA(col, 0.8); ctx.lineWidth = 3; ctx.stroke();
      const k = ramp(l, t0 + 0.15, 0.35); if (it.tanda === "silang") U.silang(ctx, x + 50, yy + (rh - 16) / 2, 30, k, N.red); else if (it.tanda === "titik") { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + 50, yy + (rh - 16) / 2, 12, 0, TAU); ctx.fill(); } else U.centang(ctx, x + 50, yy + (rh - 16) / 2, 28, k, col);
      txt(ctx, it.s, x + 100, yy + (rh - 16) / 2 + size * 0.35, size, { weight: 800, fit: w - 130 }); ctx.restore(); }); };
  // panel kode monospace. lines: [{s, col, t0, hl}] ; o.size
  X.kode = function (ctx, x, y, w, lines, l, o = {}) { const size = o.size || 44, lh = size * 1.55, h = lines.length * lh + 96;
    U.panel(ctx, x, y, w, h, { col: o.col || N.cyan, fill: "rgba(10,6,26,0.94)" }); if (o.judul) txt(ctx, o.judul, x + 30, y + 52, 40, { weight: 800, color: N.ink2, fit: w - 60 });
    lines.forEach((ln, i) => { const a = ln.t0 == null ? 1 : ramp(l, ln.t0, 0.3); if (a <= 0) return; const yy = y + 70 + i * lh;
      if (ln.hl) { ctx.fillStyle = D.hexA(ln.hlCol || N.gold, 0.22 * ln.hl); RR(ctx, x + 14, yy + 4, w - 28, lh - 6, 10); ctx.fill(); }
      X.mono(ctx, ln.s, x + 36, yy + lh * 0.72, size, { color: ln.col || N.ink, a, fit: w - 72 }); }); return h; };
  // langkah bernomor di atas (bonus A): 4 keping, aktif menyala
  X.langkah = function (ctx, l, aktif, names) { const n = names.length, w = 408, gap = 16, x0 = (W - (w * n + gap * (n - 1))) / 2, y = 236;
    names.forEach((s, i) => { const on = i === aktif, done = i < aktif, col = on ? N.gold : done ? N.green : N.dim; ctx.save(); ctx.globalAlpha *= on ? 1 : 0.7;
      ctx.fillStyle = on ? "rgba(40,24,6,0.92)" : "rgba(16,8,38,0.86)"; RR(ctx, x0 + i * (w + gap), y, w, 70, 20); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = on ? 5 : 3; if (on) { ctx.shadowColor = col; ctx.shadowBlur = 16; } ctx.stroke(); ctx.shadowBlur = 0;
      txt(ctx, (i + 1) + ". " + s, x0 + i * (w + gap) + w / 2, y + 48, 40, { align: "center", weight: 900, color: on ? N.gold : N.ink2, fit: w - 14 }); ctx.restore(); }); };
  // ---------- ikon (cx, cy = tengah; s = tinggi kira-kira) ----------
  const I = X.ikon = {};
  const base = (ctx, col, s) => { ctx.lineWidth = Math.max(4, s * 0.035); ctx.strokeStyle = col; ctx.fillStyle = "#1A0E36"; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.lineJoin = "round"; ctx.lineCap = "round"; };
  I.chip = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const a = s * 0.3; for (let i = -1; i <= 1; i++) { [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => { ctx.beginPath(); if (dx) { ctx.moveTo(dx * a, i * a * 0.55); ctx.lineTo(dx * (a + s * 0.14), i * a * 0.55); } else { ctx.moveTo(i * a * 0.55, dy * a); ctx.lineTo(i * a * 0.55, dy * (a + s * 0.14)); } ctx.stroke(); }); }
    RR(ctx, -a, -a, a * 2, a * 2, s * 0.05); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; ctx.strokeStyle = D.hexA(col, 0.6); RR(ctx, -a * 0.5, -a * 0.5, a, a, 6); ctx.stroke(); ctx.restore(); };
  I.os = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const w = s * 0.9, h = s * 0.66; RR(ctx, -w / 2, -h / 2, w, h, s * 0.05); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + h * 0.24); ctx.lineTo(w / 2, -h / 2 + h * 0.24); ctx.stroke();
    ctx.fillStyle = col; [0, 1, 2].forEach(i => { ctx.beginPath(); ctx.arc(-w / 2 + s * 0.09 + i * s * 0.09, -h / 2 + h * 0.12, s * 0.025, 0, TAU); ctx.fill(); }); [0, 1].forEach(i => { ctx.fillStyle = D.hexA(col, 0.5); ctx.fillRect(-w * 0.36, -h * 0.08 + i * h * 0.22, w * (i ? 0.5 : 0.72), h * 0.09); }); ctx.restore(); };
  I.gpu = (ctx, x, y, s, col, t = 0) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const w = s * 1.0, h = s * 0.5; RR(ctx, -w / 2, -h / 2, w, h, s * 0.05); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    [-1, 1].forEach(k => { ctx.beginPath(); ctx.arc(k * w * 0.24, 0, h * 0.34, 0, TAU); ctx.stroke(); for (let i = 0; i < 4; i++) { const an = t * 3 * k + i * TAU / 4; ctx.beginPath(); ctx.moveTo(k * w * 0.24, 0); ctx.lineTo(k * w * 0.24 + Math.cos(an) * h * 0.3, Math.sin(an) * h * 0.3); ctx.stroke(); } });
    ctx.fillStyle = col; ctx.fillRect(-w * 0.4, h / 2, w * 0.5, s * 0.07); ctx.restore(); };
  I.kue = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const w = s * 0.8; ctx.fillStyle = "#3A1B4E"; RR(ctx, -w / 2, -s * 0.02, w, s * 0.38, s * 0.05); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#5A2A62"; RR(ctx, -w * 0.38, -s * 0.28, w * 0.76, s * 0.28, s * 0.05); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    ctx.strokeStyle = N.gold; ctx.beginPath(); ctx.moveTo(0, -s * 0.28); ctx.lineTo(0, -s * 0.42); ctx.stroke(); ctx.fillStyle = N.sun; ctx.beginPath(); ctx.ellipse(0, -s * 0.47, s * 0.035, s * 0.055, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = D.hexA(N.pink, 0.9); ctx.beginPath(); for (let i = 0; i <= 8; i++) { const xx = -w / 2 + i * w / 8, yy = s * 0.1 + (i % 2 ? s * 0.05 : 0); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore(); };
  I.resep = (ctx, x, y, s, col, t, o = {}) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const w = s * 0.66, h = s * 0.86; RR(ctx, -w / 2, -h / 2, w, h, s * 0.04); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    const cols = [N.pink, N.cyan, N.gold, N.cyan, N.green, N.pink]; for (let i = 0; i < 6; i++) { ctx.fillStyle = D.hexA(cols[i], 0.85); ctx.fillRect(-w * 0.36 + (i % 3 === 1 ? w * 0.1 : 0), -h * 0.36 + i * h * 0.125, w * [0.5, 0.56, 0.4, 0.62, 0.34, 0.5][i], h * 0.05); } ctx.restore(); };
  I.mesin = (ctx, x, y, s, col, t = 0) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const w = s * 0.9, h = s * 0.7; RR(ctx, -w / 2, -h / 2, w, h, s * 0.06); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    [[-w * 0.16, 0, s * 0.17, 1], [w * 0.17, s * 0.04, s * 0.12, -1]].forEach(([gx, gy, r, k]) => { ctx.save(); ctx.translate(gx, gy); ctx.rotate(t * 1.6 * k); ctx.beginPath(); ctx.arc(0, 0, r * 0.62, 0, TAU); ctx.stroke(); for (let i = 0; i < 8; i++) { ctx.rotate(TAU / 8); ctx.beginPath(); ctx.moveTo(r * 0.62, 0); ctx.lineTo(r, 0); ctx.stroke(); } ctx.restore(); }); ctx.restore(); };
  I.buku = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const w = s * 0.62, h = s * 0.8; RR(ctx, -w / 2, -h / 2, w, h, s * 0.04); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; ctx.beginPath(); ctx.moveTo(-w * 0.32, -h / 2); ctx.lineTo(-w * 0.32, h / 2); ctx.stroke();
    for (let i = 0; i < 4; i++) { ctx.fillStyle = D.hexA(col, 0.55); ctx.fillRect(-w * 0.18, -h * 0.28 + i * h * 0.15, w * (i % 2 ? 0.4 : 0.52), h * 0.05); } ctx.restore(); };
  I.balon = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); RR(ctx, -s * 0.42, -s * 0.3, s * 0.84, s * 0.5, s * 0.14); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * 0.16, s * 0.2); ctx.lineTo(-s * 0.26, s * 0.4); ctx.lineTo(s * 0.02, s * 0.2); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = col; [-1, 0, 1].forEach(i => { ctx.beginPath(); ctx.arc(i * s * 0.18, -s * 0.05, s * 0.04, 0, TAU); ctx.fill(); }); ctx.restore(); };
  I.peti = (ctx, x, y, s, col, t, o = {}) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const w = s * 1.0, h = s * 0.62; RR(ctx, -w / 2, -h * 0.2, w, h * 0.7, s * 0.04); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-w / 2, -h * 0.2); ctx.quadraticCurveTo(0, -h * 0.95, w / 2, -h * 0.2); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = "#0B0620"; ctx.strokeStyle = o.kunci ? N.green : N.red; RR(ctx, -s * 0.09, -h * 0.08, s * 0.18, s * 0.22, 6); ctx.fill(); ctx.stroke(); ctx.fillStyle = o.kunci ? N.green : N.red; ctx.beginPath(); ctx.arc(0, h * 0.04, s * 0.035, 0, TAU); ctx.fill(); ctx.fillRect(-s * 0.012, h * 0.04, s * 0.024, s * 0.07); ctx.restore(); };
  I.kunci = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); ctx.fillStyle = "transparent"; ctx.beginPath(); ctx.arc(-s * 0.24, 0, s * 0.18, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * 0.06, 0); ctx.lineTo(s * 0.42, 0); ctx.moveTo(s * 0.26, 0); ctx.lineTo(s * 0.26, s * 0.14); ctx.moveTo(s * 0.4, 0); ctx.lineTo(s * 0.4, s * 0.18); ctx.stroke(); ctx.restore(); };
  I.monitor = (ctx, x, y, s, col, t = 0, o = {}) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const w = s * 1.3, h = s * 0.78; RR(ctx, -w / 2, -h / 2 - s * 0.08, w, h, s * 0.04); ctx.fillStyle = o.layar || "#05030C"; ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.moveTo(0, h / 2 - s * 0.08); ctx.lineTo(0, h / 2 + s * 0.06); ctx.moveTo(-s * 0.26, h / 2 + s * 0.08); ctx.lineTo(s * 0.26, h / 2 + s * 0.08); ctx.stroke();
    if (o.kursor !== false && Math.floor(t * 2) % 2 === 0) { ctx.fillStyle = N.ink; ctx.fillRect(-w / 2 + s * 0.1, -h / 2 + s * 0.02, s * 0.05, s * 0.09); } ctx.restore(); return { x: x - w / 2, y: y - h / 2 - s * 0.08, w, h }; };
  I.konsol = (ctx, x, y, s, col) => U.perangkat(ctx, x, y, s, "konsol", { col });
  I.pc = (ctx, x, y, s, col) => U.perangkat(ctx, x + s * 0.03, y + s * 0.08, s, "pc", { col });
  I.gir = (ctx, x, y, s, col, t = 0) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); ctx.rotate(t * 0.8); const r = s * 0.36; ctx.beginPath(); ctx.arc(0, 0, r * 0.62, 0, TAU); ctx.fill(); ctx.stroke(); for (let i = 0; i < 8; i++) { ctx.rotate(TAU / 8); ctx.beginPath(); ctx.moveTo(r * 0.62, 0); ctx.lineTo(r, 0); ctx.stroke(); } ctx.restore(); };
  I.lup = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); ctx.beginPath(); ctx.arc(-s * 0.08, -s * 0.08, s * 0.26, 0, TAU); ctx.fill(); ctx.stroke(); ctx.lineWidth *= 1.6; ctx.beginPath(); ctx.moveTo(s * 0.12, s * 0.12); ctx.lineTo(s * 0.36, s * 0.36); ctx.stroke(); ctx.restore(); };
  I.hilang = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const w = s * 0.9, h = s * 0.66; ctx.setLineDash([14, 10]); RR(ctx, -w / 2, -h / 2, w, h, s * 0.05); ctx.fill(); ctx.stroke(); ctx.setLineDash([]); ctx.shadowBlur = 0; txt(ctx, "404", 0, s * 0.11, s * 0.32, { align: "center", weight: 900, color: col }); ctx.restore(); };
  I.tanya = (ctx, x, y, s, col) => U.tanya(ctx, x, y, s * 0.8, col);
  I.orang = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); ctx.beginPath(); ctx.arc(0, -s * 0.2, s * 0.15, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * 0.28, s * 0.36); ctx.quadraticCurveTo(-s * 0.28, 0, 0, 0); ctx.quadraticCurveTo(s * 0.28, 0, s * 0.28, s * 0.36); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); };
  I.palu = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); ctx.rotate(-0.6); RR(ctx, -s * 0.26, -s * 0.34, s * 0.52, s * 0.22, 8); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -s * 0.12); ctx.lineTo(0, s * 0.36); ctx.stroke(); ctx.restore(); };
  I.jabat = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); [-1, 1].forEach(k => { ctx.beginPath(); ctx.moveTo(k * s * 0.42, s * 0.14); ctx.lineTo(k * s * 0.12, -s * 0.06); ctx.lineTo(-k * s * 0.08, s * 0.08); ctx.stroke(); }); ctx.beginPath(); ctx.arc(0, 0, s * 0.1, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); };
  I.kalender = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const w = s * 0.8, h = s * 0.76; RR(ctx, -w / 2, -h / 2, w, h, s * 0.05); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = col; RR(ctx, -w / 2, -h / 2, w, h * 0.24, s * 0.05); ctx.fill(); ctx.restore(); };
  I.pintu = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const w = s * 0.5, h = s * 0.86; RR(ctx, -w / 2, -h / 2, w, h, s * 0.04); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(w * 0.28, 0, s * 0.04, 0, TAU); ctx.fill(); ctx.restore(); };
  I.db = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const w = s * 0.6, h = s * 0.7; ctx.beginPath(); ctx.moveTo(-w / 2, -h * 0.34); ctx.lineTo(-w / 2, h * 0.34); ctx.ellipse(0, h * 0.34, w / 2, h * 0.14, 0, Math.PI, 0, true); ctx.lineTo(w / 2, -h * 0.34); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, -h * 0.34, w / 2, h * 0.14, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; ctx.beginPath(); ctx.ellipse(0, 0, w / 2, h * 0.14, 0, 0, Math.PI); ctx.stroke(); ctx.restore(); };
  I.keyboard = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); base(ctx, col, s); const w = s * 1.0, h = s * 0.42; RR(ctx, -w / 2, -h / 2, w, h, s * 0.05); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = D.hexA(col, 0.7); for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) ctx.fillRect(-w * 0.4 + c * w * 0.137, -h * 0.26 + r * h * 0.3, w * 0.09, h * 0.18); ctx.fillRect(-w * 0.22, h * 0.24, w * 0.44, h * 0.12); ctx.restore(); };
  // kotak berlabel (lapisan, modul). o: a, size, fill, sub
  X.kotak = function (ctx, x, y, w, h, s, col, o = {}) { const a = o.a == null ? 1 : o.a; if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; U.panel(ctx, x, y, w, h, { col, fill: o.fill || "rgba(16,8,38,0.92)", blur: o.blur == null ? 16 : o.blur });
    const size = o.size || 46; txt(ctx, s, x + w / 2, y + h / 2 + size * 0.35, size, { align: "center", weight: 900, color: o.tcol || N.ink, fit: w - 44 }); ctx.restore(); };
  // stempel miring
  X.stempel = function (ctx, s, x, y, l, t0, col, o = {}) { const st = U.pop(l, t0); if (st.a <= 0) return; ctx.save(); ctx.globalAlpha *= st.a; ctx.translate(x, y); ctx.rotate(o.rot == null ? -0.08 : o.rot); const k = lerp(1.5, 1, st.sp); ctx.scale(k, k);
    const size = o.size || 52; ctx.font = `900 ${size}px ${K.FONT}`; const w = Math.min(o.fit || 900, ctx.measureText(s).width) + 70; ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.shadowColor = col; ctx.shadowBlur = 16; RR(ctx, -w / 2, -size * 0.95, w, size * 1.7, 16); ctx.fillStyle = "rgba(20,4,20,0.9)"; ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    txt(ctx, s, 0, size * 0.22, size, { align: "center", weight: 900, color: col, fit: o.fit || 900 }); ctx.restore(); };
  // garis waktu mendatar: pts [{x, lab, sub, col, t0}]
  X.garisWaktu = function (ctx, l, y, x0, x1, pts, o = {}) { ctx.save(); ctx.strokeStyle = D.hexA(N.ink2, 0.4); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
    pts.forEach(p => { const pp = U.pop(l, p.t0); if (pp.a <= 0.01) return; ctx.save(); ctx.globalAlpha *= pp.a; ctx.fillStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(p.x, y, 18 * lerp(0.5, 1, pp.sp), 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
      txt(ctx, p.lab, p.x, y - 44, o.size || 56, { align: "center", weight: 900, color: p.col, fit: p.fit || 420 }); if (p.sub) X.para(ctx, p.sub, p.x, y + 76, 42, p.fit || 420, { align: "center", weight: 700, color: N.ink2 }); ctx.restore(); }); };
})(typeof window !== "undefined" ? window : globalThis);
