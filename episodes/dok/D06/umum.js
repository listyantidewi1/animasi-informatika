/* D06 — perangkat bersama: latar studio data, label, kartu sumber, grafik batang/garis, piktogram orang, jendela kode.
   Semua angka di layar berasal dari laporan asli (lihat youtube.md); jangan menambah angka yang tidak ada di naskah. */
(function (g) {
  const K = g.Kiko, D = K.dok, P = D.P, H = K.helpers, KB = K.kit.bipkit;
  const W = 1920, HH = 1080, TAU = Math.PI * 2, FONT = K.FONT;
  const { clamp, lerp, eio, eout, spring } = D;
  const RR = (...a) => H.rr(...a);
  const U = K.d06 = {};
  const txt = U.txt = (ctx, s, x, y, size, opt = {}) => D.txt(ctx, s, x, y, size, opt);
  const ramp = U.ramp = (l, t0, d = 0.5) => clamp((l - t0) / d);
  U.pop = (l, t0) => ({ a: ramp(l, t0, 0.25), sp: clamp(spring(l - t0, 10, 0.55)) });
  U.ease = (l, t0, d = 0.8) => eio(clamp((l - t0) / d));
  U.reg = (seg, S) => { K.SCENES["d06_b" + seg] = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); }; };
  U.beatOf = (TL, id) => TL.beats.find(x => x.id === id);

  // latar: gradien malam + kisi halus + cahaya warna bab
  U.latar = function (ctx, t, o = {}) {
    D.bg(ctx, t, { top: o.top || "#16224F", bot: o.bot || "#2A3D7C", stars: o.stars == null ? 0.18 : o.stars });
    ctx.save(); ctx.strokeStyle = "rgba(242,246,255,0.045)"; ctx.lineWidth = 2;
    const dx = (t * 6) % 120; for (let x = -dx; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HH); ctx.stroke(); }
    for (let y = 60; y < HH; y += 120) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
    D.glow(ctx, o.gx == null ? 1500 : o.gx, o.gy == null ? 260 : o.gy, 900, o.col || P.violet, o.ga == null ? 0.22 : o.ga);
  };
  U.tag = function (ctx, s, x, y, a, opt = {}) {
    if (a <= 0.01) return; const sp = opt.sp == null ? 1 : opt.sp; ctx.save(); ctx.globalAlpha *= clamp(a);
    ctx.translate(x, y); const k = lerp(0.82, 1, sp); ctx.scale(k, k); D.label(ctx, s, 0, 0, { size: opt.size || 48, col: opt.col || P.amber, color: opt.color }); ctx.restore();
  };
  U.tagPop = (ctx, s, x, y, l, t0, opt = {}) => { const p = U.pop(l, t0); U.tag(ctx, s, x, y, p.a * (opt.a == null ? 1 : opt.a), { ...opt, sp: p.sp }); };
  U.judul = function (ctx, s, x, y, size, a, opt = {}) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= clamp(a); const k = lerp(0.9, 1, opt.sp == null ? 1 : opt.sp);
    ctx.translate(x, y); ctx.scale(k, k);
    ctx.font = `900 ${size}px ${FONT}`; const w = Math.min(opt.fit || 1700, ctx.measureText(s).width) + size * 0.9, h = size * 1.55;
    if (opt.panel !== false) { ctx.fillStyle = opt.fill || "rgba(10,18,52,0.88)"; RR(ctx, -w / 2, -h * 0.68, w, h, h * 0.3); ctx.fill(); ctx.strokeStyle = D.hexA(opt.col || P.amber, 0.9); ctx.lineWidth = 4; ctx.stroke(); }
    txt(ctx, s, 0, size * 0.1, size, { align: "center", weight: 900, color: opt.color || P.ink, fit: opt.fit || 1700 }); ctx.restore();
  };
  U.judulPop = (ctx, s, x, y, size, l, t0, opt = {}) => { const p = U.pop(l, t0); U.judul(ctx, s, x, y, size, p.a * (opt.a == null ? 1 : opt.a), { ...opt, sp: p.sp }); };
  // kartu sumber di kiri bawah (di dalam D.post)
  U.sumber = function (ctx, l, t0, s, a = 1) {
    const k = ramp(l, t0, 0.4) * a; if (k <= 0.01) return; ctx.save(); ctx.globalAlpha *= k;
    const size = 40; ctx.font = `700 ${size}px ${FONT}`; const w = ctx.measureText("Sumber: " + s).width + 64, x = 96, y = 842;
    ctx.fillStyle = "rgba(8,14,44,0.92)"; RR(ctx, x, y - 38, w, 62, 14); ctx.fill(); ctx.fillStyle = P.teal; RR(ctx, x, y - 38, 10, 62, 5); ctx.fill();
    txt(ctx, "Sumber: " + s, x + 34, y + 8, size, { weight: 700, color: P.ink2 }); ctx.restore();
  };
  U.panel = function (ctx, x, y, w, h, o = {}) {
    ctx.save(); ctx.fillStyle = "rgba(0,0,0,0.25)"; RR(ctx, x + 8, y + 12, w, h, o.r || 28); ctx.fill();
    ctx.fillStyle = o.fill || "rgba(14,22,60,0.92)"; RR(ctx, x, y, w, h, o.r || 28); ctx.fill();
    ctx.strokeStyle = o.stroke || "rgba(242,246,255,0.16)"; ctx.lineWidth = o.lw || 3; ctx.stroke(); ctx.restore();
  };
  // batang tegak tumbuh dari yBase; k 0..1
  U.batang = function (ctx, x, yBase, w, h, col, k = 1, o = {}) {
    const hh = h * eout(clamp(k)); if (Math.abs(hh) < 1) return;
    const gr = ctx.createLinearGradient(0, yBase - hh, 0, yBase); gr.addColorStop(0, col); gr.addColorStop(1, D.hexA(col, 0.55));
    ctx.fillStyle = gr; if (hh > 0) RR(ctx, x, yBase - hh, w, hh, Math.min(o.r == null ? 16 : o.r, Math.abs(hh) / 2)); else RR(ctx, x, yBase, w, -hh, Math.min(16, -hh / 2)); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.14)"; ctx.fillRect(x + w * 0.1, hh > 0 ? yBase - hh + 8 : yBase + 4, w * 0.16, Math.max(0, Math.abs(hh) - 16));
  };
  // batang mendatar
  U.batangH = function (ctx, x, y, w, h, col, k = 1) {
    const ww = w * eout(clamp(k)); if (ww < 1) return; const gr = ctx.createLinearGradient(x, 0, x + ww, 0); gr.addColorStop(0, D.hexA(col, 0.6)); gr.addColorStop(1, col);
    ctx.fillStyle = gr; RR(ctx, x, y, ww, h, Math.min(h / 2, ww / 2)); ctx.fill();
  };
  // sumbu grafik: kotak (x, y, w, h), garis kisi mendatar pada nilai ticks (0..1 relatif), label kiri
  U.sumbu = function (ctx, x, y, w, h, ticks, a = 1) {
    ctx.save(); ctx.globalAlpha *= a; ctx.lineWidth = 2;
    ticks.forEach(([v, s]) => { const yy = y + h - v * h; ctx.strokeStyle = v === 0 ? "rgba(242,246,255,0.5)" : "rgba(242,246,255,0.14)"; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke();
      if (s) txt(ctx, s, x - 20, yy + 14, 40, { align: "right", weight: 700, color: P.ink2 }); });
    ctx.restore();
  };
  // garis bertahap: pts [[x,y],...], k 0..1; mengembalikan titik ujung
  U.garis = function (ctx, pts, k, col, lw = 10, o = {}) {
    k = clamp(k); if (k <= 0) return pts[0]; const n = pts.length - 1, f = k * n, i = Math.min(n - 1, Math.floor(f)), u = f - i;
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.lineJoin = "round"; if (o.dash) ctx.setLineDash(o.dash);
    if (o.glow !== false) { ctx.shadowColor = col; ctx.shadowBlur = 24; }
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let j = 1; j <= i; j++) ctx.lineTo(pts[j][0], pts[j][1]);
    const ex = lerp(pts[i][0], pts[i + 1][0], u), ey = lerp(pts[i][1], pts[i + 1][1], u); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();
    return [ex, ey];
  };
  U.titik = function (ctx, x, y, r, col) { D.glow(ctx, x, y, r * 4, col, 0.6); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r * 0.62, 0, TAU); ctx.fill(); };
  // piktogram orang: (x, y) = kaki; s = tinggi
  U.orang = function (ctx, x, y, s, col, a = 1, o = {}) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -s * 0.8, s * 0.19, 0, TAU); ctx.fill();
    RR(ctx, -s * 0.24, -s * 0.57, s * 0.48, s * 0.57, s * 0.2); ctx.fill();
    if (o.laptop) { ctx.fillStyle = "#DDE6FF"; RR(ctx, -s * 0.2, -s * 0.36, s * 0.4, s * 0.25, 5); ctx.fill(); ctx.fillStyle = D.hexA("#3A4680", 0.9); RR(ctx, -s * 0.16, -s * 0.32, s * 0.32, s * 0.17, 3); ctx.fill(); }
    ctx.restore();
  };
  // jendela (editor/terminal) generik
  U.jendela = function (ctx, x, y, w, h, title, o = {}) {
    ctx.save(); ctx.fillStyle = "rgba(0,0,0,0.3)"; RR(ctx, x + 10, y + 14, w, h, 22); ctx.fill();
    ctx.fillStyle = o.fill || "#0F1738"; RR(ctx, x, y, w, h, 22); ctx.fill(); ctx.strokeStyle = o.stroke || "rgba(242,246,255,0.2)"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "#1B2656"; RR(ctx, x, y, w, 64, 22); ctx.fill(); ctx.fillRect(x, y + 40, w, 24);
    ["#FF5A5F", "#FFB547", "#5BD68A"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 36 + i * 34, y + 32, 10, 0, TAU); ctx.fill(); });
    if (title) txt(ctx, title, x + w / 2, y + 46, 40, { align: "center", weight: 700, color: P.ink2 });
    ctx.restore();
  };
  // baris kode tiruan (batang warna); k = berapa bagian yang sudah "diketik"
  U.kode = function (ctx, x, y, w, n, seed, k = 1, o = {}) {
    const r = D.rng(seed), lh = o.lh || 46, cols = [P.blue, P.teal, P.violet, P.amber, P.ink2, P.pink]; const tot = k * n;
    for (let i = 0; i < n; i++) { const ind = Math.floor(r() * 3) * 44; let xx = x + ind; const segs = 2 + Math.floor(r() * 3); const part = clamp(tot - i);
      for (let j = 0; j < segs; j++) { const ww = (60 + r() * 190) * (w / 800); const c = cols[Math.floor(r() * cols.length)];
        if (part > 0 && xx + ww < x + w) { ctx.fillStyle = D.hexA(o.col && o.col[i] ? o.col[i] : c, o.alpha == null ? 0.85 : o.alpha); const vis = Math.min(ww, Math.max(0, part * (w - ind) - (xx - x - ind))); if (vis > 2) { RR(ctx, xx, y + i * lh, vis, 20, 10); ctx.fill(); } }
        xx += ww + 18; } }
  };
  U.centang = function (ctx, x, y, r, k, col = P.green) {
    k = clamp(k); if (k <= 0) return; ctx.save(); ctx.translate(x, y); const s = lerp(0.4, 1, clamp(spring(k, 10, 0.5))); ctx.scale(s, s); ctx.globalAlpha *= clamp(k * 4);
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = "#0B1236"; ctx.lineWidth = r * 0.24; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-r * 0.45, 0); ctx.lineTo(-r * 0.12, r * 0.34); ctx.lineTo(r * 0.48, -r * 0.34); ctx.stroke(); ctx.restore();
  };
  U.silang = function (ctx, x, y, r, k, col = P.red) {
    k = clamp(k); if (k <= 0) return; ctx.save(); ctx.translate(x, y); const s = lerp(0.4, 1, clamp(spring(k, 10, 0.5))); ctx.scale(s, s); ctx.globalAlpha *= clamp(k * 4);
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = r * 0.24; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-r * 0.4, -r * 0.4); ctx.lineTo(r * 0.4, r * 0.4); ctx.moveTo(r * 0.4, -r * 0.4); ctx.lineTo(-r * 0.4, r * 0.4); ctx.stroke(); ctx.restore();
  };
  U.panah = function (ctx, x0, y0, x1, y1, col, k = 1, lw = 8) {
    k = clamp(k); if (k <= 0) return; const ex = lerp(x0, x1, eio(k)), ey = lerp(y0, y1, eio(k)), an = Math.atan2(y1 - y0, x1 - x0);
    ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.translate(ex, ey); ctx.rotate(an); ctx.beginPath(); ctx.moveTo(lw * 2.4, 0); ctx.lineTo(-lw * 1.2, -lw * 1.8); ctx.lineTo(-lw * 1.2, lw * 1.8); ctx.closePath(); ctx.fill(); ctx.restore();
  };
  // angka besar dengan hitung naik: v0 -> v1 selama d sejak t0
  U.hitung = (l, t0, v0, v1, d = 1.2) => lerp(v0, v1, eout(clamp((l - t0) / d)));
  U.angka = function (ctx, s, x, y, size, col, a = 1, o = {}) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.translate(x, y); const k = lerp(0.8, 1, o.sp == null ? 1 : o.sp); ctx.scale(k, k);
    ctx.shadowColor = D.hexA(col, 0.6); ctx.shadowBlur = 30; txt(ctx, s, 0, 0, size, { align: o.align || "center", weight: 900, color: col }); ctx.restore();
  };
  U.bip = function (ctx, x, y, s, t, o = {}) { KB.draw(ctx, x, y, s, { pose: "diam", mood: "happy", t, ...o }); };
  // sorot: kotak bercahaya di sekitar area yang sedang dibahas
  U.sorot = function (ctx, x, y, w, h, a, col = P.amber) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.shadowColor = col; ctx.shadowBlur = 26; RR(ctx, x, y, w, h, 22); ctx.stroke(); ctx.restore();
  };
  U.RR = RR; U.TAU = TAU; U.W = W; U.HH = HH;
})(typeof window !== "undefined" ? window : globalThis);
