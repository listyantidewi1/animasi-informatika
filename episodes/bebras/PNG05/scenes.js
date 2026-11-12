/* PNG05 Pembahasan Soal Bebras 2025-TW-03 "Mesin Klasifikasi Apel" (Taiwan), kategori Penggalang (SMP).
   Gaya papan tulis putih dengan coretan spidol (sama dengan seri Bebras) + simulasi: mesin pemilah bertingkat (7 sensor,
   8 kotak); apel menggelinding: berat >= angka sensor ke kanan, lebih kecil ke kiri.
   Isi kotak dibaca dari gambar soal yang diperbesar: [1,3] [6,5] [8] [9,9] [12,13] [14,14,15] [17,18] [20].
   Jawaban: pilihan C (sensor A 12, B 7, C 20). Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", FUR = "#8E5B3A", FUR2 = "#B98458";
  const ARROW = "#E0302A";
  const CAPS = ["#F07A1A", "#F2BE16", "#2FA55A", "#2E6FD8"];
  const META = { judul: "Mesin Klasifikasi Apel", tahun: "2025", negara: "Taiwan", kode: "2025-TW-03" };

  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const atI = (b, i) => lead(b) + Math.max(0, i) / TXT(b).length * (b.audio || b.dur);
  const at = (b, s, from = 0) => {
    const T = TXT(b); let i = T.indexOf(s, from);
    if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); i = 0; }
    return atI(b, i);
  };
  const atEnd = (b, s) => { const T = TXT(b); const i = T.indexOf(s); if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); return 0; } return atI(b, i + s.length); };
  const P = (l, t0, d) => ease((l - t0) / (d || 0.6));

  // ---------- papan dan spidol ----------
  function board(ctx) {
    ctx.fillStyle = "#C3CDD4"; rr(ctx, 40, 118, 1840, 724, 22); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 52, 130, 1816, 700, 14); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.03)"; rr(ctx, 52, 130, 1816, 18, 8); ctx.fill();
  }
  function plen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
  function pointAt(pts, d) {
    let s = 0;
    for (let i = 1; i < pts.length; i++) {
      const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (s + L >= d) { const k = L ? (d - s) / L : 0; return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; }
      s += L;
    }
    return pts[pts.length - 1].slice();
  }
  function mline(ctx, pts, u, color, w, head) {
    if (u <= 0) return;
    const L = plen(pts) * clamp(u, 0, 1); let s = 0;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); let end = pts[0], prev = pts[0];
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (s + d >= L) { const k = d ? (L - s) / d : 0; end = [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; prev = pts[i - 1]; ctx.lineTo(end[0], end[1]); break; }
      ctx.lineTo(pts[i][0], pts[i][1]); s += d; end = pts[i]; prev = pts[i - 1];
    }
    ctx.stroke();
    if (head && u >= 0.98) {
      const a = Math.atan2(end[1] - prev[1], end[0] - prev[0]), hs = w * 3.2;
      ctx.beginPath(); ctx.moveTo(end[0] - hs * Math.cos(a - 0.5), end[1] - hs * Math.sin(a - 0.5)); ctx.lineTo(end[0], end[1]);
      ctx.lineTo(end[0] - hs * Math.cos(a + 0.5), end[1] - hs * Math.sin(a + 0.5)); ctx.stroke();
    }
    ctx.restore();
  }
  function tick(ctx, x, y, s, u = 1, color = GREEN, w) { mline(ctx, [[x - s * 0.45, y], [x - s * 0.12, y + s * 0.33], [x + s * 0.48, y - s * 0.38]], u, color, w || Math.max(4, s * 0.16)); }
  function strike(ctx, x, y, s, u = 1, color = RED, w) {
    const lw = w || Math.max(4, s * 0.12);
    mline(ctx, [[x - s * 0.4, y - s * 0.4], [x + s * 0.4, y + s * 0.4]], u * 2, color, lw);
    mline(ctx, [[x + s * 0.4, y - s * 0.4], [x - s * 0.4, y + s * 0.4]], u * 2 - 1, color, lw);
  }
  function ring(ctx, x, y, rx, ry, u, color = ORANGE, w = 6) {
    if (u <= 0) return;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, -0.04, -Math.PI * 0.6, -Math.PI * 0.6 + Math.PI * 2.15 * clamp(u, 0, 1)); ctx.stroke(); ctx.restore();
  }
  function hand(ctx, s, x, y, size, opt = {}) {
    ctx.save(); ctx.font = `italic 800 ${size}px ${K.FONT}`; ctx.fillStyle = opt.color || ORANGE; ctx.textAlign = opt.align || "center";
    ctx.textBaseline = "alphabetic"; if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1); ctx.fillText(s, x, y); ctx.restore();
  }
  function tw(ctx, s, size, weight = 800, italic) { ctx.font = `${italic ? "italic " : ""}${weight} ${size}px ${K.FONT}`; return ctx.measureText(s).width; }
  function alpha(ctx, a, fn) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1); fn(); ctx.restore(); }
  function hourglass(ctx, cx, cy, l, d, R = 54) {
    const frac = clamp(l / Math.max(1, d - 0.3), 0, 1);
    ctx.strokeStyle = "#E9DDBF"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    ctx.save(); ctx.translate(cx, cy); ctx.scale(R / 68, R / 68); ctx.fillStyle = "#F4D58D"; ctx.strokeStyle = INK; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-24, -36); ctx.lineTo(24, -36); ctx.lineTo(4, 0); ctx.lineTo(24, 36); ctx.lineTo(-24, 36); ctx.lineTo(-4, 0); ctx.closePath(); ctx.stroke();
    const top = 1 - frac; ctx.beginPath(); ctx.moveTo(-20 * top, -32 + 28 * (1 - top)); ctx.lineTo(20 * top, -32 + 28 * (1 - top)); ctx.lineTo(0, -2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-20 * frac - 2, 34); ctx.lineTo(20 * frac + 2, 34); ctx.lineTo(0, 34 - 28 * frac); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function thinkBadge(ctx, x, y, w, h, l, d, q) {
    card(ctx, x, y, w, h, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
    hourglass(ctx, x + h / 2 + 6, y + h / 2, l, d, h * 0.34);
    text(ctx, "PIKIRKAN DULU", x + h + 20, y + h * 0.42, 36, { weight: 900, color: C.accentDark });
    text(ctx, q, x + h + 20, y + h * 0.8, 28, { weight: 800, color: INK, fit: w - h - 40 });
  }
  function letter(ctx, L, cx, cy, r, good) {
    ctx.fillStyle = good ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    text(ctx, L, cx, cy + r * 0.42, r * 1.2, { align: "center", weight: 900, color: "#fff" });
  }

  function beaver(ctx, x, y, s, o = {}) {   // berang-berang maskot Bebras; o.cap = warna topi
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); if (o.alpha != null) ctx.globalAlpha *= clamp(o.alpha, 0, 1);
    ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2.5;
    if (!o.headOnly) {
      ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(0, 24, 32, 27, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = FUR2; ctx.beginPath(); ctx.ellipse(0, 30, 19, 17, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = FUR; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * 15, 49, 9, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    }
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -37, 7.5, 0, Math.PI * 2); ctx.fillStyle = FUR; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#5E3B24"; ctx.beginPath(); ctx.arc(k * 23, -37, 3.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.arc(0, -14, 29, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#D7AE84"; ctx.beginPath(); ctx.ellipse(0, -3, 15, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2A1B12"; ctx.beginPath(); ctx.ellipse(0, -10, 6.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 1.5; rr(ctx, -5, -1, 10, 9, 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 8); ctx.stroke();
    ctx.fillStyle = "#1B120C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12, -23, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#fff"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12 + 1.3, -24.4, 1.4, 0, Math.PI * 2); ctx.fill(); }
    if (o.cap) {   // topi
      ctx.fillStyle = o.cap; ctx.strokeStyle = "#2A1B12"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, -36, 20, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      rr(ctx, -4, -40, 34, 8, 4); ctx.fill(); ctx.stroke();
    }
    if (o.camera) {   // kamera di depan dada
      ctx.fillStyle = "#3A3F6B"; ctx.strokeStyle = "#1B1E33"; ctx.lineWidth = 2.5; rr(ctx, -30, 8, 60, 38, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#1B1E33"; ctx.beginPath(); ctx.arc(0, 27, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#8FB6E8"; ctx.beginPath(); ctx.arc(0, 27, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#E8EEF6"; ctx.fillRect(14, 11, 10, 6);
      ctx.strokeStyle = "#C34FB0"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-26, 10); ctx.lineTo(-14, -4); ctx.moveTo(26, 10); ctx.lineTo(14, -4); ctx.stroke();
    }
    ctx.restore();
  }
  function flagTW(ctx, x, y, w) {   // bendera seperti di gambar soal: merah, kanton biru dengan matahari putih 12 sinar
    const h = w * 2 / 3;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#FE0000"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#000095"; ctx.fillRect(x, y, w / 2, h / 2);
    const cx = x + w / 4, cy = y + h / 4, R = h * 0.19;
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath();
    for (let k = 0; k < 24; k++) { const a = -Math.PI / 2 + k * Math.PI / 12, r = k % 2 ? R * 0.62 : R; ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#000095"; ctx.beginPath(); ctx.arc(cx, cy, R * 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(cx, cy, R * 0.42, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  // ---------- mesin pemilah apel ----------
  // sensor: 0 = A (puncak), 1 = B, 2 = 16, 3 = 4, 4 = 9, 5 = 14, 6 = C; kotak 0–7 dari kiri
  const PURPLE = "#3B2F9E", APPLE = "#D8312B", TAN = "#E9C98F", TAN2 = "#C9A266", GRAY = "#9EA4AA", GRAY2 = "#6E757C";
  const TRUE = [12, 7, 16, 4, 9, 14, 20];
  const NAME = ["A", "B", null, null, null, null, "C"];
  const KIDS = [[1, 2], [3, 4], [5, 6], ["b0", "b1"], ["b2", "b3"], ["b4", "b5"], ["b6", "b7"]];
  const BOX = [[1, 3], [6, 5], [8], [9, 9], [12, 13], [14, 15, 14], [17, 18], [20]];
  const SPOS = [[0.5, 0.13], [0.25, 0.40], [0.75, 0.40], [0.125, 0.665], [0.375, 0.665], [0.625, 0.665], [0.875, 0.665]];
  const OPTS = [["A", 10, 5, 18], ["B", 11, 6, 17], ["C", 12, 7, 20], ["D", 13, 8, 19]];

  function geo(R) {
    const s = i => [R.x + SPOS[i][0] * R.w, R.y + SPOS[i][1] * R.h];
    const r = R.w * 0.052, bw = R.w * 0.105, bh = R.h * 0.07, by = R.y + R.h * 0.92;
    const bx = k => R.x + (0.0625 + 0.125 * k) * R.w;
    const ar = R.w * 0.0215;
    // posisi apel di kotak k
    const apos = k => {
      const n = BOX[k].length, cx = bx(k), y = by - ar * 0.95;
      if (n === 1) return [[cx, y]];
      if (n === 2) return [[cx - ar * 1.02, y], [cx + ar * 1.02, y]];
      return [[cx - ar * 1.02, y], [cx + ar * 1.02, y], [cx, y - ar * 1.6]];
    };
    return { R, s, r, bw, bh, by, bx, ar, apos };
  }
  // jalur apel seberat w dengan angka sensor vals (null = tidak diketahui, pakai TRUE)
  function route(w, vals) {
    const out = []; let i = 0;
    while (typeof i === "number") { const v = vals[i] != null ? vals[i] : TRUE[i]; const right = w >= v ? 1 : 0; out.push([i, right]); i = KIDS[i][right]; }
    return { steps: out, box: +String(i).slice(1) };
  }
  function routePts(G, w, vals) {
    const r = route(w, vals), pts = [];
    const [x0, y0] = G.s(0); pts.push([x0, y0 - G.r * 2.2]);
    r.steps.forEach(([i]) => { const [x, y] = G.s(i); pts.push([x, y - G.r * 0.15]); });
    const bx = G.bx(r.box); pts.push([bx, G.by - G.ar * 0.95]);
    return { pts, box: r.box, steps: r.steps };
  }

  function apple(ctx, x, y, r, n, o = {}) {
    ctx.save(); if (o.alpha != null) ctx.globalAlpha *= clamp(o.alpha, 0, 1);
    ctx.fillStyle = o.dim ? "#E7A3A0" : APPLE; ctx.strokeStyle = "#8E1C17"; ctx.lineWidth = Math.max(1.5, r * 0.07);
    ctx.beginPath(); ctx.arc(x - r * 0.28, y, r * 0.78, 0, Math.PI * 2); ctx.arc(x + r * 0.28, y, r * 0.78, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x, y + r * 0.02, r * 1.05, r * 0.86, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#5B3A1E"; ctx.lineWidth = Math.max(2, r * 0.1); ctx.beginPath(); ctx.moveTo(x, y - r * 0.7); ctx.lineTo(x + r * 0.08, y - r * 1.05); ctx.stroke();
    ctx.fillStyle = "#3E9B3A"; ctx.beginPath(); ctx.ellipse(x + r * 0.32, y - r * 0.98, r * 0.3, r * 0.14, -0.4, 0, Math.PI * 2); ctx.fill();
    if (n != null) text(ctx, String(n), x, y + r * 0.34, r * (String(n).length > 1 ? 0.86 : 0.98), { align: "center", weight: 900, color: "#fff" });
    ctx.restore();
  }
  function crate(ctx, x, y, w, h, o = {}) {   // kotak (x = tengah, y = atas)
    ctx.save(); if (o.alpha != null) ctx.globalAlpha *= clamp(o.alpha, 0, 1);
    ctx.fillStyle = o.hi ? "#FFE3A6" : TAN; ctx.strokeStyle = TAN2; ctx.lineWidth = 3;
    ctx.fillRect(x - w / 2, y, w, h); ctx.strokeRect(x - w / 2, y, w, h);
    ctx.fillStyle = TAN2; ctx.fillRect(x + w / 2 - w * 0.08, y, w * 0.08, h);
    ctx.restore();
  }
  function chute(ctx, p, q, wd, u = 1) {
    if (u <= 0) return;
    const e = [lerp(p[0], q[0], clamp(u, 0, 1)), lerp(p[1], q[1], clamp(u, 0, 1))];
    ctx.save(); ctx.lineCap = "butt";
    ctx.strokeStyle = GRAY2; ctx.lineWidth = wd + 4; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
    ctx.strokeStyle = GRAY; ctx.lineWidth = wd; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
    // garis sambungan
    const L = Math.hypot(e[0] - p[0], e[1] - p[1]), n = Math.floor(L / (wd * 1.1)), a = Math.atan2(e[1] - p[1], e[0] - p[0]);
    ctx.strokeStyle = GRAY2; ctx.lineWidth = 2;
    for (let k = 1; k <= n; k++) { const cx = p[0] + Math.cos(a) * k * wd * 1.1, cy = p[1] + Math.sin(a) * k * wd * 1.1, nx = -Math.sin(a) * wd / 2, ny = Math.cos(a) * wd / 2; ctx.beginPath(); ctx.moveTo(cx - nx, cy - ny); ctx.lineTo(cx + nx, cy + ny); ctx.stroke(); }
    ctx.restore();
  }
  // sensor: busur setengah lingkaran dengan layar angka. val: angka, "?" = rusak, null = kosong
  function dial(ctx, x, y, r, val, o = {}) {
    ctx.save(); if (o.alpha != null) ctx.globalAlpha *= clamp(o.alpha, 0, 1);
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = o.ring || GRAY2; ctx.lineWidth = o.ring ? 6 : 3.5;
    ctx.beginPath(); ctx.arc(x, y + r * 0.35, r, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#B4BAC0"; ctx.lineWidth = 2;
    for (let k = 0; k <= 12; k++) { const a = Math.PI + k * Math.PI / 12; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.82, y + r * 0.35 + Math.sin(a) * r * 0.82); ctx.lineTo(x + Math.cos(a) * r * 0.95, y + r * 0.35 + Math.sin(a) * r * 0.95); ctx.stroke(); }
    // layar
    const dw = r * 1.15, dh = r * 0.64, dx = x - dw / 2, dy = y - r * 0.32;
    const broken = val === "?";
    ctx.fillStyle = o.screen || (broken ? "#D9DDE1" : "#FFFFFF"); ctx.strokeStyle = o.screen ? GREEN : "#C3C9CF"; ctx.lineWidth = o.screen ? 4 : 2; rr(ctx, dx, dy, dw, dh, r * 0.1); ctx.fill(); ctx.stroke();
    if (broken) {
      ctx.strokeStyle = "#7B848C"; ctx.lineWidth = 2.5; ctx.beginPath();
      ctx.moveTo(dx + dw * 0.15, dy + dh * 0.1); ctx.lineTo(dx + dw * 0.42, dy + dh * 0.55); ctx.lineTo(dx + dw * 0.3, dy + dh * 0.95);
      ctx.moveTo(dx + dw * 0.42, dy + dh * 0.55); ctx.lineTo(dx + dw * 0.8, dy + dh * 0.35); ctx.lineTo(dx + dw * 0.95, dy + dh * 0.7); ctx.stroke();
      text(ctx, "?", x, dy + dh * 0.82, dh * 0.85, { align: "center", weight: 900, color: "#58626B" });
    } else if (val != null) text(ctx, String(val), x, dy + dh * 0.82, dh * 0.86, { align: "center", weight: 900, color: o.valColor || INK });
    ctx.fillStyle = ARROW; ctx.beginPath(); ctx.arc(x, y + r * 0.35, r * 0.09, 0, Math.PI * 2); ctx.fill();
    if (o.name) text(ctx, o.name, x - r * 1.05, y - r * 0.72, r * 0.62, { align: "center", weight: 900, color: PURPLE });
    ctx.restore();
  }

  // gambar mesin utuh. o: grow (0..1), vals (angka layar per sensor; default TRUE dengan A/B/C "?"), apples (0..1),
  // boxHi [k], appleHi {"k,i": warna}, appleDim, sensHi {i: warna}, side (0 kiri / 1 kanan disorot)
  function machine(ctx, R, o = {}) {
    const G = geo(R), grow = o.grow == null ? 1 : o.grow, wd = R.w * 0.03;
    const show = k => clamp(grow * 3 - k, 0, 1);   // 0: sensor, 1: saluran, 2: kotak
    if (o.side != null) alpha(ctx, o.sideU == null ? 1 : o.sideU, () => {
      ctx.fillStyle = "rgba(242,177,52,0.16)"; const x0 = o.side ? R.x + R.w * 0.5 + 6 : R.x - 10;
      rr(ctx, x0, R.y + R.h * 0.28, R.w * 0.5 + 4, R.h * 0.76, 20); ctx.fill();
    });
    // saluran
    const su = show(1);
    for (let i = 0; i < 7; i++) {
      const p = G.s(i); const base = [p[0], p[1] + G.r * 0.35];
      KIDS[i].forEach(c => {
        const q = typeof c === "number" ? (() => { const s = G.s(c); return [s[0], s[1] - G.r * 0.4]; })() : [G.bx(+c.slice(1)), G.by - G.ar * 0.4];
        chute(ctx, base, q, wd, su);
      });
    }
    { const [x, y] = G.s(0); chute(ctx, [x, Math.max(134, y - G.r * 2.4)], [x, y - G.r * 0.5], wd, su); }
    // kotak
    for (let k = 0; k < 8; k++) crate(ctx, G.bx(k), G.by, G.bw, G.bh, { alpha: show(2), hi: (o.boxHi || []).includes(k) });
    // sensor
    const vals = o.vals || TRUE.map((v, i) => NAME[i] ? "?" : v);
    for (let i = 0; i < 7; i++) {
      const [x, y] = G.s(i);
      dial(ctx, x, y, G.r, vals[i], { alpha: show(0), name: NAME[i], ring: (o.sensHi || {})[i], screen: (o.screen || {})[i], valColor: (o.valColor || {})[i] });
    }
    // apel di kotak
    const au = o.apples == null ? 1 : o.apples;
    if (au > 0) for (let k = 0; k < 8; k++) G.apos(k).forEach(([x, y], i) => {
      const key = k + "," + i; if ((o.hideApple || []).includes(key)) return;
      apple(ctx, x, y, G.ar, BOX[k][i], { alpha: clamp(au * 8 - k, 0, 1), dim: o.appleDim && !(o.appleHi || {})[key] });
      const hc = (o.appleHi || {})[key]; if (hc) ring(ctx, x, y, G.ar * 1.45, G.ar * 1.35, 1, hc, 5);
    });
    return G;
  }
  // apel yang menggelinding sepanjang jalur; mengembalikan posisi
  function runApple(ctx, G, w, vals, t0, l, o = {}) {
    if (l < t0) return null;
    const R = routePts(G, w, vals), d = o.d || 2.2, u = clamp((l - t0) / d, 0, 1);
    if (o.trail) mline(ctx, R.pts, u, o.trail, G.r * 0.16, u >= 1);
    const p = pointAt(R.pts, plen(R.pts) * ease(u));
    if (!(o.hideEnd && u >= 1)) apple(ctx, p[0], p[1], G.ar * 1.05, w);
    return { u, R, p };
  }

  // pilihan jawaban: 4 baris × 3 sensor kecil. o: rows (urutan baris yang tampil, u), strike {row: u}, colHi, mark {"r,c": "ok"/"x"}, keep
  function options(ctx, x, y, w, o = {}) {
    const rh = o.rh || 92, r = rh * 0.36;
    text(ctx, "Pilihan jawaban", x, y + 34, 32, { weight: 900, color: C.accentDark });
    ["sensor A", "sensor B", "sensor C"].forEach((s, c) => text(ctx, s, x + 150 + c * (w - 170) / 3 + (w - 170) / 6, y + 74, 24, { align: "center", weight: 800, color: PURPLE }));
    OPTS.forEach(([L, ...v], ri) => {
      const yy = y + 90 + ri * rh, a = o.rows ? o.rows[ri] : 1; if (a <= 0) return;
      alpha(ctx, a, () => {
        const keep = o.keep && o.keep.includes(ri);
        card(ctx, x, yy, w, rh - 12, { fill: keep ? "#EAF7EE" : "#F7F9FA", stroke: keep ? GREEN : "#D3DAE0", lw: keep ? 4 : 2, r: 16 });
        text(ctx, "Pilihan " + L, x + 20, yy + rh * 0.56, 30, { weight: 900, color: INK });
        v.forEach((n, c) => {
          const cx = x + 150 + c * (w - 170) / 3 + (w - 170) / 6, cy = yy + rh * 0.42;
          if (o.colHi === c) { ctx.fillStyle = "rgba(242,177,52,0.28)"; rr(ctx, cx - r * 1.5, yy + 4, r * 3, rh - 20, 10); ctx.fill(); }
          ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#9AA4AD"; ctx.lineWidth = 2.5; rr(ctx, cx - r * 1.25, cy - r * 0.95, r * 2.5, r * 1.9, 10); ctx.fill(); ctx.stroke();
          text(ctx, String(n), cx, cy + r * 0.55, r * 1.45, { align: "center", weight: 900, color: INK });
          const m = (o.mark || {})[ri + "," + c];
          if (m) alpha(ctx, m[1], () => m[0] === "ok" ? tick(ctx, cx + r * 1.75, cy, r * 0.9, 1) : strike(ctx, cx + r * 1.75, cy, r * 0.75, 1, RED, 5));
        });
        const s = (o.strike || {})[ri]; if (s) mline(ctx, [[x + 10, yy + rh * 0.45], [x + w - 10, yy + rh * 0.45]], s, RED, 7);
      });
    });
    return y + 90 + 4 * rh;
  }
  function note(ctx, s, x, y, size, a, color) { if (a > 0) alpha(ctx, a, () => text(ctx, s, x, y, size, { weight: 900, color: color || INK, fit: 600 })); }

  // ---------- adegan contoh: satu sensor ----------
  function contoh(ctx, b, l) {
    board(ctx);
    if (b.id === "soal1") {
      // delapan kotak tingkatan; apel makin besar
      hand(ctx, "8 tingkatan menurut berat", 960, 250, 56, { color: INK, alpha: P(l, at(b, "delapan tingkatan"), 0.6) });
      for (let k = 0; k < 8; k++) {
        const x = 220 + k * 211, a = P(l, at(b, "delapan tingkatan") + k * 0.18, 0.4);
        alpha(ctx, a, () => { crate(ctx, x, 560, 160, 90); apple(ctx, x, 560 - (18 + k * 3) * 0.95, 18 + k * 3, null); text(ctx, "tingkat " + (k + 1), x, 700, 30, { align: "center", weight: 800, color: C.ink2 }); });
      }
      mline(ctx, [[220, 760], [1700, 760]], P(l, at(b, "delapan tingkatan") + 1.2, 1.0), ORANGE, 6, true);
      hand(ctx, "ringan", 220, 810, 38, { color: ORANGE, alpha: P(l, at(b, "delapan tingkatan") + 1.2, 0.5) });
      hand(ctx, "berat", 1700, 810, 38, { color: ORANGE, alpha: P(l, at(b, "delapan tingkatan") + 2, 0.5) });
      hand(ctx, "tingkat sama → tempat pengemasan sama", 960, 380, 44, { color: GREEN, alpha: P(l, at(b, "Apel yang tingkatannya"), 0.6) });
      return;
    }
    const sx = 620, sy = 360, r = 120, L = [380, 640], Rr = [860, 640];
    const showVal = b.id !== "soal2" || l > at(b, "layar");
    chute(ctx, [sx, 150], [sx, sy - r * 0.4], 46);
    chute(ctx, [sx, sy + r * 0.35], [L[0], L[1] - 20], 46); chute(ctx, [sx, sy + r * 0.35], [Rr[0], Rr[1] - 20], 46);
    crate(ctx, L[0], L[1], 200, 90); crate(ctx, Rr[0], Rr[1], 200, 90);
    dial(ctx, sx, sy, r, showVal ? 12 : null, {});
    hand(ctx, "kiri", L[0], 790, 46, { color: INK }); hand(ctx, "kanan", Rr[0], 790, 46, { color: INK });
    const pts = (side) => [[sx, 170], [sx, sy - 10], side ? [Rr[0], Rr[1] - 34] : [L[0], L[1] - 34]];
    const run = (w, side, t0, out) => {
      if (l < t0) return; const u = clamp((l - t0) / 1.6, 0, 1), P2 = pts(side);
      const p = pointAt(P2, plen(P2) * ease(u));
      if (u >= 1 && out != null) { apple(ctx, (side ? Rr[0] : L[0]) + out, L[1] - 34, 34, w); return; }
      apple(ctx, p[0], p[1], 34, w);
    };
    if (b.id === "soal2") {
      run(null, 1, at(b, "menggelinding"), 0);
      alpha(ctx, P(l, at(b, "sensor berat"), 0.6), () => { mline(ctx, [[sx + 420, sy - 120], [sx + r + 20, sy - 10]], 1, INK, 5, true); hand(ctx, "sensor berat", sx + 430, sy - 130, 46, { color: INK, align: "left" }); });
      alpha(ctx, P(l, at(b, "layar"), 0.6), () => { mline(ctx, [[sx + 420, sy + 60], [sx + 75, sy + 0]], 1, ARROW, 5, true); hand(ctx, "layar angka", sx + 430, sy + 80, 46, { color: ARROW, align: "left" }); });
      return;
    }
    // kartu aturan
    const ru = b.id === "soal3" ? P(l, at(b, "Kalau berat apel sama"), 0.6) : 1, rl = b.id === "soal3" ? P(l, at(b, "Kalau berat apel lebih kecil"), 0.6) : 1;
    alpha(ctx, ru, () => { card(ctx, 1110, 200, 720, 170, { fill: "#EAF7EE", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "berat ≥ angka sensor", 1140, 268, 48, { weight: 900, color: INK }); text(ctx, "(sama atau lebih besar) → KANAN", 1140, 335, 34, { weight: 800, color: GREEN }); });
    alpha(ctx, rl, () => { card(ctx, 1110, 400, 720, 170, { fill: "#EEF4FB", stroke: "#2E6FD8", lw: 4, r: 18 }); text(ctx, "berat < angka sensor", 1140, 468, 48, { weight: 900, color: INK }); text(ctx, "(lebih kecil) → KIRI", 1140, 535, 34, { weight: 800, color: "#2E6FD8" }); });
    if (b.id === "soal3") return;
    if (b.id === "soal4") {
      run(9, 0, at(b, "Apel seberat sembilan"), 0);
      run(13, 1, at(b, "Apel seberat tiga belas"), 0);
      hand(ctx, "9 < 12 → kiri", 1470, 660, 46, { color: "#2E6FD8", alpha: P(l, at(b, "jatuh ke kiri"), 0.5) });
      hand(ctx, "13 > 12 → kanan", 1470, 740, 46, { color: GREEN, alpha: P(l, at(b, "jatuh ke kanan"), 0.5) });
      return;
    }
    // soal5: 9 dan 13 sudah di kotak; apel 12 ragu lalu ke kanan
    apple(ctx, L[0], L[1] - 34, 34, 9); apple(ctx, Rr[0] + 40, L[1] - 34, 34, 13);
    const t0 = at(b, "Jadi, apel itu");
    if (l < t0) { const u = P(l, at(b, "apel seberat dua belas"), 0.8); apple(ctx, sx, lerp(120, sy - 150, u), 34, 12); if (l > at(b, "Beratnya sama")) hand(ctx, "12 = 12 ?", sx + 160, sy - 140, 46, { color: ARROW, align: "left" }); }
    else run(12, 1, t0, -40);
    alpha(ctx, P(l, t0 + 1.2, 0.6), () => { card(ctx, 1110, 610, 720, 150, { fill: "#FFF1E2", stroke: ORANGE, lw: 5, r: 18 }); text(ctx, "12 = 12 → KANAN!", 1470, 705, 58, { align: "center", weight: 900, color: ORANGE }); });
    ring(ctx, 1480, 300, 380, 110, P(l, at(b, "Ingat baik-baik"), 0.8), ORANGE, 6);
  }

  // ---------- adegan mesin utuh ----------
  const RM = { x: 90, y: 145, w: 1110, h: 600 };   // mesin di kiri papan
  const PX = 1240, PW = 600;                       // panel kanan
  const ON = (b, l, s, d) => P(l, at(b, s), d || 0.5);
  function mesin(ctx, b, l) {
    board(ctx);
    const id = b.id, o = {};
    const unk = TRUE.map((v, i) => NAME[i] ? "?" : v);
    o.vals = unk.slice();
    // ---- pembuka soal ----
    if (id === "soal6") {
      o.grow = P(l, 0.2, 2.2); o.apples = 0;
      o.vals = TRUE.map((v, i) => NAME[i] ? null : v);
      const G = machine(ctx, RM, o);
      runApple(ctx, G, null, [12, 7, 16, 4, 9, 14, 20], at(b, "Setiap apel masuk"), l, { d: 3.2, trail: "rgba(238,122,18,0.55)" });
      hand(ctx, "7 sensor", PX + 300, 300, 56, { color: INK, alpha: ON(b, l, "tujuh sensor") });
      hand(ctx, "3 sensor per apel", PX + 300, 420, 50, { color: ORANGE, alpha: ON(b, l, "melewati tiga sensor") });
      hand(ctx, "8 kotak", PX + 300, 540, 56, { color: INK, alpha: ON(b, l, "delapan kotak") });
      return;
    }
    if (id === "soal7") {
      o.apples = P(l, at(b, "hasilnya terlihat"), 1.6);
      const br = ON(b, l, "layar pada tiga sensor", 0.6);
      o.vals = TRUE.map((v, i) => NAME[i] ? (br > 0.5 ? "?" : v) : v);
      o.sensHi = br > 0.5 ? { 0: ARROW, 1: ARROW, 6: ARROW } : {};
      machine(ctx, RM, o);
      hand(ctx, "angka di apel = berat", PX + 300, 300, 46, { color: INK, alpha: ON(b, l, "Angka pada setiap apel") });
      hand(ctx, "layar A, B, C rusak", PX + 300, 440, 50, { color: ARROW, alpha: br });
      hand(ctx, "berapa angkanya?", PX + 300, 540, 50, { color: ORANGE, alpha: ON(b, l, "Kita perlu mencari") });
      return;
    }
    if (id === "soal8" || id === "soal9" || id === "soal10") {
      machine(ctx, RM, o);
      const rows = id === "soal8" ? ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"].map(s => ON(b, l, s)) : null;
      options(ctx, PX, 160, PW, { rows });
      if (id === "soal8") note(ctx, "Angka sensor A, B, C?", PX, 690, 40, ON(b, l, "Manakah"), ORANGE);
      if (id === "soal9") {
        const u = ON(b, l, "Ada sensor A", 0.7), v = ON(b, l, "pilihan jawaban A", 0.7);
        const G = geo(RM);
        [0, 1, 6].forEach(i => { const [x, y] = G.s(i); ring(ctx, x - G.r * 1.05, y - G.r * 0.9, 34, 34, u, PURPLE, 5); });
        for (let r = 0; r < 4; r++) ring(ctx, PX + 75, 160 + 90 + r * 92 + 46, 85, 30, v, ORANGE, 5);
        note(ctx, "sensor A ≠ pilihan A", PX + 20, 690, 46, ON(b, l, "selalu menyebut"), ARROW);
      }
      if (id === "soal10") thinkBadge(ctx, PX, 640, PW, 130, l, b.dur, "Sensor A, B, C = ?");
      return;
    }
    // ---- membaca petunjuk ----
    if (id === "t1") {
      o.boxHi = l > at(b, "di kotak mana") ? [0, 1, 2, 3, 4, 5, 6, 7] : [];
      machine(ctx, RM, o);
      note(ctx, "angka sensor A, B, C: belum tahu", PX, 300, 36, ON(b, l, "Kita belum tahu"), C.ink2);
      note(ctx, "kotak tempat apel: tahu!", PX, 400, 40, ON(b, l, "di kotak mana"), GREEN);
      hand(ctx, "= petunjuk", PX + 300, 520, 56, { alpha: ON(b, l, "itulah petunjuknya") });
      return;
    }
    if (id === "t2" || id === "t3") {
      o.appleHi = { "2,0": ORANGE }; o.appleDim = true;
      const G = machine(ctx, RM, o);
      const Rt = routePts(G, 8, TRUE);
      const tA = id === "t2" ? at(b, "belok ke kiri di sensor A") : 0, tB = id === "t2" ? at(b, "belok ke kanan di sensor B") : 0, t9 = id === "t2" ? at(b, "belok ke kiri di sensor sembilan") : 0;
      // jalur bertahap
      const seg = [[0, 1, tA], [1, 2, tB], [2, 3, t9]];
      seg.forEach(([a, z, t]) => mline(ctx, [Rt.pts[a], Rt.pts[z]].concat(z === 3 ? [Rt.pts[4]] : []), P(l, t, 0.8), ORANGE, 10, z === 3));
      if (id === "t2") mline(ctx, [Rt.pts[0], Rt.pts[1]], P(l, at(b, "Untuk sampai"), 0.6), ORANGE, 10);
      const lab = [[0, "kiri", tA, -1], [1, "kanan", tB, 1], [4, "kiri", t9, -1]];
      lab.forEach(([i, s, t, side]) => { const [x, y] = G.s(i); hand(ctx, s, x + side * G.r * 1.6, y + G.r * 1.25, 38, { color: ORANGE, alpha: P(l, t + 0.4, 0.4) }); });
      if (id === "t2") { note(ctx, "apel 8 → kotak ke-3", PX, 300, 44, ON(b, l, "apel seberat delapan")); return; }
      note(ctx, "kanan: berat ≥ angka sensor", PX, 260, 38, ON(b, l, "Belok ke kanan"), GREEN);
      note(ctx, "kiri: berat < angka sensor", PX, 330, 38, ON(b, l, "Belok ke kiri"), "#2E6FD8");
      alpha(ctx, ON(b, l, "Angka sensor B"), () => { card(ctx, PX, 420, PW, 120, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 }); text(ctx, "8 ≥ B → B ≤ 8", PX + PW / 2, 500, 54, { align: "center", weight: 900, color: INK }); });
      alpha(ctx, ON(b, l, "angka sensor A lebih"), () => { card(ctx, PX, 570, PW, 120, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 }); text(ctx, "8 < A → A > 8", PX + PW / 2, 650, 54, { align: "center", weight: 900, color: INK }); });
      return;
    }
    // ---- sensor C ----
    if (id[0] === "c") {
      const G0 = geo(RM);
      o.sensHi = { 6: ORANGE };
      if (id !== "c4") {
        o.appleDim = true; o.appleHi = {};
        if (id === "c1") { if (l > at(b, "Kotak kiri")) { o.appleHi["6,0"] = "#2E6FD8"; o.appleHi["6,1"] = "#2E6FD8"; } if (l > at(b, "Kotak kanan")) o.appleHi["7,0"] = GREEN; o.boxHi = l > at(b, "ada dua kotak") ? [6, 7] : []; }
        if (id === "c2") o.appleHi["6,1"] = "#2E6FD8";
        if (id === "c3") { o.appleHi["6,1"] = "#2E6FD8"; o.appleHi["7,0"] = GREEN; }
      }
      machine(ctx, RM, o);
      const [cx, cy] = G0.s(6);
      if (id === "c2" || id === "c3") { mline(ctx, [[cx, cy + G0.r * 0.4], [G0.bx(6) + 10, G0.by - G0.ar * 2.6]], 1, "#2E6FD8", 8, true); }
      if (id === "c3") mline(ctx, [[cx, cy + G0.r * 0.4], [G0.bx(7) - 10, G0.by - G0.ar * 2.6]], P(l, at(b, "Apel dua puluh"), 0.6), GREEN, 8, true);
      if (id === "c1") { note(ctx, "kiri: 17, 18", PX, 320, 50, ON(b, l, "Kotak kiri"), "#2E6FD8"); note(ctx, "kanan: 20", PX, 410, 50, ON(b, l, "Kotak kanan"), GREEN); return; }
      if (id === "c2" || id === "c3") {
        alpha(ctx, id === "c2" ? ON(b, l, "Apel delapan belas") : 1, () => { card(ctx, PX, 200, PW, 120, { fill: "#EEF4FB", stroke: "#2E6FD8", lw: 4, r: 18 }); text(ctx, "18 < C → C > 18", PX + PW / 2, 280, 54, { align: "center", weight: 900, color: INK }); });
        if (id === "c3") {
          alpha(ctx, ON(b, l, "Apel dua puluh"), () => { card(ctx, PX, 350, PW, 120, { fill: "#EAF7EE", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "20 ≥ C → C ≤ 20", PX + PW / 2, 430, 54, { align: "center", weight: 900, color: INK }); });
          alpha(ctx, ON(b, l, "Kesimpulannya"), () => { card(ctx, PX, 520, PW, 140, { fill: "#FFF1E2", stroke: ORANGE, lw: 5, r: 18 }); text(ctx, "C = 19 atau 20", PX + PW / 2, 612, 62, { align: "center", weight: 900, color: ORANGE }); });
        }
        return;
      }
      // c4
      options(ctx, PX, 160, PW, { colHi: 2, strike: { 0: ON(b, l, "Jadi, pilihan A", 0.6), 1: ON(b, l, "Jadi, pilihan A", 0.6) + 0 * 1 } });
      note(ctx, "C harus 19 atau 20", PX, 675, 44, 1, ORANGE);
      note(ctx, "C = 18 → apel 18 ke kanan ✗", PX, 735, 36, ON(b, l, "Dengan angka delapan belas"), RED);
      return;
    }
    // ---- sensor A ----
    if (id[0] === "a") {
      const G0 = geo(RM);
      o.sensHi = { 0: ORANGE };
      const strikeAB = { 0: 1, 1: 1 };
      if (id === "a1") {
        machine(ctx, RM, o);
        options(ctx, PX, 160, PW, { colHi: 0, strike: strikeAB });
        return;
      }
      if (id === "a2") {
        o.side = 1; o.sideU = ON(b, l, "Semua apel", 0.6); o.appleDim = l > at(b, "paling ringan"); o.appleHi = l > at(b, "paling ringan") ? { "4,0": GREEN } : {};
        machine(ctx, RM, o);
        hand(ctx, "kanan dari A", RM.x + RM.w * 0.75, RM.y + RM.h * 0.27, 40, { color: ORANGE, alpha: o.sideU });
        note(ctx, "teringan di kanan: 12", PX, 300, 44, ON(b, l, "paling ringan"), INK);
        alpha(ctx, ON(b, l, "Karena apel dua belas"), () => { card(ctx, PX, 360, PW, 120, { fill: "#EAF7EE", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "12 ≥ A → A ≤ 12", PX + PW / 2, 440, 54, { align: "center", weight: 900, color: INK }); });
        return;
      }
      if (id === "a3") {
        const vals = o.vals.slice(); vals[0] = 13; o.vals = vals; o.valColor = { 0: RED }; o.hideApple = ["4,0"]; o.appleDim = true;
        const G = machine(ctx, RM, o);
        const t0 = at(b, "apel dua belas lebih kecil");
        const run = runApple(ctx, G, 12, [13, 7, 16, 4, 9, 14, 20], t0, l, { d: 2.6, trail: "rgba(217,68,59,0.6)" });
        if (!run) { const [x, y] = G.apos(4)[0]; apple(ctx, x, y, G.ar, 12); }
        hand(ctx, "kalau A = 13 …", PX + 300, 205, 50, { color: RED });
        note(ctx, "12 < 13 → apel 12 ke kiri", PX, 270, 40, ON(b, l, "jadi apel itu akan belok"), RED);
        note(ctx, "padahal apel 12 ada di kanan", PX, 325, 40, ON(b, l, "padahal"), INK);
        alpha(ctx, ON(b, l, "Jadi, pilihan D salah"), () => {
          options(ctx, PX, 345, PW, { rh: 74, strike: { 0: 1, 1: 1, 3: P(l, at(b, "kita coret"), 0.6) } });
        });
        return;
      }
      // a4
      o.side = 0; o.appleDim = true; o.appleHi = { "3,0": "#2E6FD8", "3,1": "#2E6FD8", "4,0": GREEN };
      machine(ctx, RM, o);
      note(ctx, "terberat di kiri: 9", PX, 260, 44, ON(b, l, "paling berat"), INK);
      alpha(ctx, ON(b, l, "Apel sembilan belok"), () => { card(ctx, PX, 310, PW, 120, { fill: "#EEF4FB", stroke: "#2E6FD8", lw: 4, r: 18 }); text(ctx, "9 < A → A > 9", PX + PW / 2, 390, 54, { align: "center", weight: 900, color: INK }); });
      card(ctx, PX, 460, PW, 120, { fill: "#EAF7EE", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "A ≤ 12", PX + PW / 2, 540, 54, { align: "center", weight: 900, color: INK });
      alpha(ctx, ON(b, l, "Angka dua belas"), () => { card(ctx, PX, 600, PW, 140, { fill: "#FFF1E2", stroke: ORANGE, lw: 5, r: 18 }); text(ctx, "9 < A ≤ 12 → 12 ✓", PX + PW / 2, 692, 56, { align: "center", weight: 900, color: ORANGE }); });
      return;
    }
    // ---- periksa & jawaban ----
    const fill = (u) => { const v = o.vals.slice(); if (u > 0) { v[0] = 12; v[1] = 7; v[6] = 20; o.screen = { 0: "#EAF7EE", 1: "#EAF7EE", 6: "#EAF7EE" }; } o.vals = v; };
    if (id === "k1") {
      fill(l > at(b, "yaitu sensor A") ? 1 : 0);
      machine(ctx, RM, o);
      options(ctx, PX, 160, PW, { strike: { 0: 1, 1: 1, 3: 1 }, keep: [2] });
      note(ctx, "periksa sensor B juga!", PX, 690, 46, ON(b, l, "Kita periksa"), ORANGE);
      return;
    }
    if (id === "k2") {
      fill(1); o.sensHi = { 1: ORANGE }; o.appleDim = true; o.appleHi = { "1,0": "#2E6FD8", "2,0": GREEN };
      machine(ctx, RM, o);
      note(ctx, "terberat di kiri B: 6", PX, 250, 42, ON(b, l, "paling berat"), INK);
      alpha(ctx, ON(b, l, "Apel enam belok"), () => { card(ctx, PX, 290, PW, 110, { fill: "#EEF4FB", stroke: "#2E6FD8", lw: 4, r: 18 }); text(ctx, "6 < B → B > 6", PX + PW / 2, 365, 50, { align: "center", weight: 900, color: INK }); });
      alpha(ctx, ON(b, l, "Apel delapan belok"), () => { card(ctx, PX, 420, PW, 110, { fill: "#EAF7EE", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "8 ≥ B → B ≤ 8", PX + PW / 2, 495, 50, { align: "center", weight: 900, color: INK }); });
      alpha(ctx, ON(b, l, "Angka tujuh"), () => { card(ctx, PX, 560, PW, 140, { fill: "#FFF1E2", stroke: ORANGE, lw: 5, r: 18 }); text(ctx, "6 < B ≤ 8 → 7 ✓", PX + PW / 2, 652, 56, { align: "center", weight: 900, color: ORANGE }); });
      return;
    }
    if (id === "k3") {
      fill(1);
      const runs = [[8, "Apel delapan", "2,0"], [12, "apel dua belas", "4,0"], [18, "apel delapan belas", "6,1"]];
      o.hideApple = runs.map(r => r[2]);
      const G = machine(ctx, RM, o);
      const V = [12, 7, 16, 4, 9, 14, 20];
      runs.forEach(([w, ph, key], i) => {
        const t0 = at(b, ph), [k, j] = key.split(",").map(Number), [x, y] = G.apos(k)[j];
        const r = runApple(ctx, G, w, V, t0, l, { d: 2.0, trail: "rgba(35,150,79,0.45)", hideEnd: true });
        if (r && r.u >= 1) { apple(ctx, x, y, G.ar, w); tick(ctx, x + G.ar * 1.2, y - G.ar * 1.5, G.ar * 1.3, P(l, t0 + 2.0, 0.4)); }
        else if (!r) apple(ctx, x, y, G.ar, w, { dim: true });
        note(ctx, "apel " + w + " → kotak benar ✓", PX, 300 + i * 90, 42, P(l, t0 + 2.0, 0.4), GREEN);
      });
      return;
    }
    if (id === "j1") {
      fill(1);
      machine(ctx, RM, o);
      alpha(ctx, P(l, 0.3, 0.6), () => {
        card(ctx, PX, 220, PW, 420, { fill: "#EAF7EE", stroke: GREEN, lw: 5, r: 22 });
        text(ctx, "Jawaban: pilihan C", PX + PW / 2, 310, 54, { align: "center", weight: 900, color: GREEN });
        [["A", 12, "sensor A bernilai dua belas"], ["B", 7, "sensor B bernilai tujuh"], ["C", 20, "sensor C bernilai dua puluh"]].forEach(([s, v, ph], i) => {
          const cx = PX + 110 + i * 190; alpha(ctx, ON(b, l, ph), () => { dial(ctx, cx, 470, 64, v, { name: s, screen: "#FFFFFF" }); });
        });
      });
      return;
    }
    if (id === "j2") {
      fill(1);
      machine(ctx, RM, o);
      const M = { "0,0": ["ok"], "0,1": ["x"], "0,2": ["x"], "1,0": ["ok"], "1,1": ["x"], "1,2": ["x"], "2,0": ["ok"], "2,1": ["ok"], "2,2": ["ok"], "3,0": ["x"], "3,1": ["ok"], "3,2": ["ok"] };
      const u = ON(b, l, "setiap pilihan", 0.6), uD = ON(b, l, "Misalnya, pilihan D", 0.6);
      const mark = {}; Object.entries(M).forEach(([k, [m]]) => mark[k] = [m, k[0] === "3" ? uD : u]);
      options(ctx, PX, 160, PW, { mark, keep: [2] });
      if (uD > 0) ring(ctx, PX + PW / 2, 160 + 90 + 3 * 92 + 40, PW / 2 + 10, 50, uD, ORANGE, 5);
      note(ctx, "periksa ketiga sensor!", PX, 690, 48, ON(b, l, "Karena itu"), ORANGE);
      return;
    }
  }

  // Short: mesin di tengah (potongan [430, 135, 1060, 720])
  const RV = { x: 450, y: 140, w: 1020, h: 620 };
  function mesin_v(ctx, b, l) {
    board(ctx);
    const id = b.id, o = { vals: TRUE.map((v, i) => NAME[i] ? "?" : v) };
    const strip = (opt) => {   // pilihan dalam satu baris di bawah mesin
      OPTS.forEach(([L, ...v], ri) => {
        const x = 455 + ri * 255, y = 762, s = (opt.strike || {})[ri] || 0, keep = (opt.keep || []).includes(ri);
        card(ctx, x, y, 240, 80, { fill: keep ? "#EAF7EE" : "#F7F9FA", stroke: keep ? GREEN : "#D3DAE0", lw: keep ? 4 : 2, r: 14 });
        text(ctx, L + ")", x + 14, y + 52, 30, { weight: 900, color: PURPLE });
        text(ctx, v.join(", "), x + 140, y + 52, 34, { align: "center", weight: 900, color: INK });
        if (s > 0) mline(ctx, [[x + 8, y + 40], [x + 232, y + 40]], s, RED, 6);
      });
    };
    if (id === "h1") { o.sensHi = { 0: ARROW, 1: ARROW, 6: ARROW }; machine(ctx, RV, o); strip({}); return; }
    if (id === "h2") {
      o.sensHi = { 6: ORANGE }; o.appleDim = true; o.appleHi = { "6,1": "#2E6FD8", "7,0": GREEN };
      machine(ctx, RV, o);
      strip({ strike: { 0: ON(b, l, "Pilihan A dan B"), 1: ON(b, l, "Pilihan A dan B") } });
      return;
    }
    if (id === "h3") {
      o.sensHi = { 0: ORANGE }; o.appleDim = true; o.appleHi = { "4,0": GREEN }; o.side = 1;
      machine(ctx, RV, o);
      strip({ strike: { 0: 1, 1: 1, 3: ON(b, l, "Pilihan D") } });
      return;
    }
    // h4: jawaban
    o.vals = [12, 7, 16, 4, 9, 14, 20]; o.screen = { 0: "#EAF7EE", 1: "#EAF7EE", 6: "#EAF7EE" };
    if (l > at(b, "Sensor B juga")) { o.appleDim = true; o.appleHi = { "1,0": "#2E6FD8", "2,0": GREEN }; o.sensHi = { 1: ORANGE }; }
    machine(ctx, RV, o);
    strip({ strike: { 0: 1, 1: 1, 3: 1 }, keep: [2] });
  }

  // penutup: pohon pencarian biner
  function pohon(ctx, b, l) {
    board(ctx);
    const o = { vals: [12, 7, 16, 4, 9, 14, 20] };
    const G = machine(ctx, { x: 90, y: 145, w: 1110, h: 560 }, o);
    if (b.id === "p1") {
      mline(ctx, [[G.bx(0) - 40, G.by + G.bh + 22], [G.bx(7) + 40, G.by + G.bh + 22]], ON(b, l, "makin besar", 1.4), ORANGE, 7, true);
      hand(ctx, "ringan → berat", PX + 300, 260, 44, { color: ORANGE, alpha: ON(b, l, "makin besar") });
      hand(ctx, "pohon pencarian biner", PX + 300, 360, 50, { color: INK, alpha: ON(b, l, "pohon pencarian biner") });
      hand(ctx, "(binary search tree)", PX + 300, 440, 46, { color: ORANGE, alpha: ON(b, l, "binary search tree") });
      hand(ctx, "mencari data dengan cepat", PX + 300, 580, 40, { color: GREEN, alpha: ON(b, l, "Komputer memakainya") });
      return;
    }
    // p2: tiga pertanyaan → 8 kotak; 20 pertanyaan → sejuta
    const u = ON(b, l, "tiga pertanyaan");
    [0, 1, 4].forEach((i, k) => { const [x, y] = G.s(i); ring(ctx, x, y, G.r * 1.25, G.r * 0.95, P(l, at(b, "tiga pertanyaan") + k * 0.4, 0.5), ORANGE, 5); });
    alpha(ctx, u, () => { card(ctx, PX, 220, PW, 130, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 }); text(ctx, "3 pertanyaan → 8 kotak", PX + PW / 2, 302, 46, { align: "center", weight: 900, color: INK, fit: 560 }); });
    alpha(ctx, ON(b, l, "Dengan cara yang sama"), () => { card(ctx, PX, 390, PW, 200, { fill: "#EAF7EE", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "±20 pertanyaan", PX + PW / 2, 470, 50, { align: "center", weight: 900, color: INK }); text(ctx, "→ 1 dari sejuta data", PX + PW / 2, 545, 46, { align: "center", weight: 900, color: GREEN }); });
    hand(ctx, "2 × 2 × 2 = 8", PX + 300, 680, 46, { color: ORANGE, alpha: ON(b, l, "memilah apel") });
  }

  function langkah(ctx, b, l) {
    board(ctx);
    const T = [at(b, "Pertama"), at(b, "Kedua"), at(b, "Ketiga")];
    const S = ["Cari apel di batas: terberat ke kiri, teringan ke kanan.", "Berat sama dengan angka sensor → belok kanan.", "Coret pilihan yang salah, periksa yang tersisa."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 44, { weight: 900, color: INK, fit: 1180 });
        const ix = 1640, iy = y + 80;
        if (i === 0) { apple(ctx, ix - 40, iy + 10, 30, 9); apple(ctx, ix + 40, iy + 10, 30, 12); }
        if (i === 1) dial(ctx, ix, iy - 10, 58, 12, {});
        if (i === 2) { tick(ctx, ix - 40, iy, 60, 1); strike(ctx, ix + 40, iy, 50, 1); }
      });
    });
  }

  Object.assign(K.SCENES, {
    contoh, mesin, mesin_v, pohon, langkah,
    buka(ctx, b, l) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "pembahasan"), 0.8) : 1;
      [880, 1110, 1340, 1570].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v, cap: CAPS[i] }); });
      if (first) hand(ctx, "tingkat SMP (Penggalang)", 1230, 770, 44, { alpha: P(l, at(b, "tingkat SMP"), 0.6) });
      else hand(ctx, "pelan-pelan, satu langkah demi satu langkah", 1230, 770, 40, { alpha: P(l, at(b, "pelan"), 0.6) });
      kiko(ctx, 380, 560, 230, 0, { wave: l, mood: "happy" });
    },
    kredit(ctx, b, l) {
      board(ctx);
      const u = P(l, 0.2, 0.6);
      ctx.save(); ctx.globalAlpha = u;
      const gx = 380, gy = 500, gr = 160;
      ctx.fillStyle = "#DCEEFB"; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#2F6FA8"; ctx.lineWidth = 5; ctx.stroke();
      ctx.lineWidth = 3; for (const k of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.ellipse(gx, gy, gr * Math.abs(Math.cos(k * 1.6)) || 2, gr, 0, 0, Math.PI * 2); ctx.stroke(); }
      for (const k of [-0.5, 0, 0.5]) { const yy = gy + k * gr * 1.3, w = Math.sqrt(Math.max(0, gr * gr - (yy - gy) ** 2)); ctx.beginPath(); ctx.moveTo(gx - w, yy); ctx.lineTo(gx + w, yy); ctx.stroke(); }
      ctx.restore();
      const fu = P(l, at(b, "Taiwan"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagTW(ctx, 470, 230, 170); ctx.restore(); }
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      const ys = [290, 380, 470, 560];
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        if (k) text(ctx, k, 720, ys[i], 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, ys[i], k ? 44 : 36, { weight: k ? 900 : 700, color: k === "Dibuat oleh" ? ORANGE : k ? INK : C.ink2, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Taiwan"), 0.8);
      if (au > 0) ring(ctx, 1160, 470 - 14, 190, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
      beaver(ctx, 640, 470 + Math.sin(l * 3) * 8, 170, { cap: CAPS[1] });
      [[830, 560, 12], [900, 610, 7], [960, 540, 20]].forEach(([x, y, n]) => apple(ctx, x, y, 36, n));
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      const ys = [320, 410, 490, 570];
      L.forEach(([k, v], i) => { const y = ys[i]; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1330, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 470 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 650, 760, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 70, { align: "center", weight: 900, color: INK, fit: 980 });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Petunjuk dari setiap kotak, langkah demi langkah", 960, 500, 38, { align: "center", weight: 800, color: ORANGE, fit: 980 });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
