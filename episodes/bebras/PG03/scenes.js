/* PG03 Pembahasan Soal Bebras 2025-DE-06 "Peta Kecerahan" (Jerman), kategori Penegak (SMA).
   Gaya papan tulis putih dengan coretan spidol (sama dengan seri Bebras SD) + simulasi:
   gambar piksel dikelilingi piksel putih, sorotan "piksel + tetangga kanan", peta angka yang terisi sel demi sel.
   Warna piksel diambil dari gambar soal (RGB diukur dari tangkapan layar soal), jangan diganti.
   Papan: x 52–1868, y 130–830 (kartu narasi 3 baris mulai y≈840, 4 baris y≈783).
   Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Peta Kecerahan", tahun: "2025", negara: "Jerman", kode: "2025-DE-06" };

  // ---------- warna soal (diukur dari gambar soal) ----------
  const W = "#FFFFFF";
  const COL = {
    exL: "#DDDDEE", exD: "#8080BC",                     // contoh: ungu muda, ungu
    lg1: "#DDDDEE", lg2: "#9F9FD3", lg3: "#77779E",       // kotak aturan di soal
    aL: "#B5D5FF", aD: "#2779E4",                        // A: biru muda, biru tua
    bD: "#813EAB", bL: "#E5BDFF",                        // B: ungu tua, ungu muda
    c: "#FF0505",                                         // C: merah
    dD: "#217157", dL: "#16F1AB",                        // D: hijau tua, hijau terang
  };
  const NAME = { [W]: "putih", [COL.exL]: "ungu muda", [COL.exD]: "ungu", [COL.aL]: "biru muda", [COL.aD]: "biru tua",
                 [COL.bD]: "ungu tua", [COL.bL]: "ungu muda", [COL.c]: "merah", [COL.dD]: "hijau tua", [COL.dL]: "hijau terang" };
  const row3 = a => [a, a, a];
  const PIC = {
    EX: [[COL.exL, COL.exD], [COL.exD, COL.exD]],
    A: [row3(COL.aL), row3(COL.aD), row3(COL.aD)],
    B: [[COL.bD, COL.bD, COL.bL], [COL.bD, COL.bD, COL.bL], [COL.bD, COL.bD, COL.bL]],
    C: [row3(COL.c), row3(COL.c), row3(COL.c)],
    D: [row3(COL.dD), row3(COL.dL), row3(COL.dD)],
  };
  // kecerahan (luma) untuk menghitung peta; putih paling cerah
  const lum = h => { const n = parseInt(h.slice(1), 16); return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255); };
  const right = (pic, r, c) => c + 1 < pic[r].length ? pic[r][c + 1] : W;
  const mapOf = pic => pic.map((row, r) => row.map((p, c) => { const a = lum(p), b2 = lum(right(pic, r, c)); return Math.abs(a - b2) < 0.5 ? 0 : a > b2 ? 1 : -1; }));
  const MAP = {}; Object.keys(PIC).forEach(k => MAP[k] = mapOf(PIC[k]));
  // pemeriksaan: peta contoh harus 1, −1 / 0, −1 seperti di soal
  if (MAP.EX.flat().join() !== "1,-1,0,-1") (K._warn = K._warn || []).push("peta contoh salah: " + MAP.EX.flat().join());
  const NUM = v => v === 1 ? "1" : v === 0 ? "0" : "−1";
  const VCOL = v => v === 1 ? "#1E8C4E" : v === 0 ? "#4A5560" : "#B5462F";

  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const atI = (b, i) => lead(b) + Math.max(0, i) / TXT(b).length * (b.audio || b.dur);
  const at = (b, s, from = 0) => {
    const T = TXT(b); let i = T.indexOf(s, from);
    if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); i = 0; }
    return atI(b, i);
  };
  const P = (l, t0, d) => ease((l - t0) / (d || 0.6));
  function prog(order, b) {
    const k = order.indexOf(b.id);
    return (id, fn) => { const j = order.indexOf(id); if (j < 0) return 0; if (j < k) return 1; if (j > k) return 0; return fn ? fn() : 1; };
  }

  // ---------- papan dan spidol ----------
  function board(ctx) {
    ctx.fillStyle = "#C3CDD4"; rr(ctx, 40, 118, 1840, 724, 22); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 52, 130, 1816, 700, 14); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.03)"; rr(ctx, 52, 130, 1816, 18, 8); ctx.fill();
  }
  function plen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
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
  function cross(ctx, x, y, s, u = 1, color = RED, w) {
    const lw = w || Math.max(4, s * 0.16);
    mline(ctx, [[x - s * 0.36, y - s * 0.36], [x + s * 0.36, y + s * 0.36]], u * 2, color, lw);
    mline(ctx, [[x + s * 0.36, y - s * 0.36], [x - s * 0.36, y + s * 0.36]], u * 2 - 1, color, lw);
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
  function tw(ctx, s, size, weight = 800) { ctx.font = `${weight} ${size}px ${K.FONT}`; return ctx.measureText(s).width; }
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

  // ---------- piksel dan peta ----------
  // gambar piksel: isi (pic) dikelilingi satu lapis piksel putih; x,y = pojok kiri atas termasuk pinggiran putih
  function pgrid(ctx, x, y, cs, pic, opt = {}) {
    const R = pic.length + 2, Cc = pic[0].length + 2;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = W; ctx.fillRect(x, y, Cc * cs, R * cs);
    pic.forEach((row, r) => row.forEach((p, c) => { ctx.fillStyle = p; ctx.fillRect(x + (c + 1) * cs, y + (r + 1) * cs, cs, cs); }));
    ctx.strokeStyle = opt.line || "#BFC6CC"; ctx.lineWidth = opt.lw || Math.max(1.5, cs * 0.035);
    ctx.beginPath();
    for (let i = 0; i <= R; i++) { ctx.moveTo(x, y + i * cs); ctx.lineTo(x + Cc * cs, y + i * cs); }
    for (let j = 0; j <= Cc; j++) { ctx.moveTo(x + j * cs, y); ctx.lineTo(x + j * cs, y + R * cs); }
    ctx.stroke(); ctx.restore();
    return { x, y, cs, R, C: Cc, cx: c => x + (c + 1.5) * cs, cy: r => y + (r + 1.5) * cs, w: Cc * cs, h: R * cs };
  }
  // peta angka: vals[r][c]; show(r,c) = 0..1
  function mgrid(ctx, x, y, cs, rows, cols, vals, show, opt = {}) {
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = opt.fill || "#F7F9FA"; ctx.fillRect(x, y, cols * cs, rows * cs);
    ctx.strokeStyle = INK; ctx.lineWidth = Math.max(2, cs * 0.035); ctx.beginPath();
    for (let i = 0; i <= rows; i++) { ctx.moveTo(x, y + i * cs); ctx.lineTo(x + cols * cs, y + i * cs); }
    for (let j = 0; j <= cols; j++) { ctx.moveTo(x + j * cs, y); ctx.lineTo(x + j * cs, y + rows * cs); }
    ctx.stroke();
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const a = show ? show(r, c) : 1; if (a <= 0) continue;
      ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1);
      const v = vals[r][c];
      text(ctx, NUM(v), x + (c + 0.5) * cs, y + (r + 0.5) * cs + cs * 0.17, cs * 0.48, { align: "center", weight: 900, color: opt.ink || VCOL(v) });
      ctx.restore();
    }
    ctx.restore();
    return { x, y, cs, w: cols * cs, h: rows * cs, cx: c => x + (c + 0.5) * cs, cy: r => y + (r + 0.5) * cs };
  }
  // sorotan piksel (r,c) dan tetangga kanannya, dengan panah ke kanan
  function hiPair(ctx, g, r, c, u) {
    if (u <= 0) return;
    const cs = g.cs, x0 = g.x + (c + 1) * cs, y0 = g.y + (r + 1) * cs;
    ctx.save(); ctx.globalAlpha *= clamp(u, 0, 1);
    ctx.strokeStyle = ORANGE; ctx.lineWidth = Math.max(5, cs * 0.07); rr(ctx, x0 - 3, y0 - 3, cs * 2 + 6, cs + 6, 8); ctx.stroke();
    const ay = y0 + cs / 2, ax0 = x0 + cs * 0.55, ax1 = x0 + cs * 1.45;
    mline(ctx, [[ax0, ay], [ax1, ay]], 1, "#FFFFFF", Math.max(10, cs * 0.13), true);
    mline(ctx, [[ax0, ay], [ax1, ay]], 1, INK, Math.max(5, cs * 0.06), true);
    ctx.restore();
  }
  function swatch(ctx, col, x, y, s) { ctx.fillStyle = col; ctx.fillRect(x, y, s, s); ctx.strokeStyle = "#9AA4AC"; ctx.lineWidth = 2; ctx.strokeRect(x, y, s, s); }
  // kartu perbandingan: [warna] lebih cerah/sama/lebih gelap [warna] → angka (x = tengah)
  function cmpCard(ctx, cx, y, a, b2, u, size = 34) {
    if (u <= 0) return;
    const va = lum(a), vb = lum(b2), v = Math.abs(va - vb) < 0.5 ? 0 : va > vb ? 1 : -1;
    const rel = v === 1 ? "lebih cerah dari" : v === 0 ? "sama cerah dengan" : "lebih gelap dari";
    const s = size, sw = s * 1.3, parts = [NAME[a], rel, NAME[b2]];
    const w = sw * 2 + tw(ctx, parts[0], s, 800) + tw(ctx, parts[1], s, 700) + tw(ctx, parts[2], s, 800) + tw(ctx, "→ " + NUM(v), s * 1.2, 900) + s * 3.4;
    alpha(ctx, u, () => {
      card(ctx, cx - w / 2 - 20, y, w + 40, s * 2.3, { fill: "#FFFDF7", stroke: ORANGE, lw: 3, r: 16 });
      let x = cx - w / 2; const my = y + s * 1.15;
      swatch(ctx, a, x, my - sw / 2, sw); x += sw + s * 0.4;
      text(ctx, parts[0], x, my + s * 0.36, s, { weight: 800, color: INK }); x += tw(ctx, parts[0], s, 800) + s * 0.4;
      text(ctx, parts[1], x, my + s * 0.36, s, { weight: 700, color: C.ink2 }); x += tw(ctx, parts[1], s, 700) + s * 0.4;
      swatch(ctx, b2, x, my - sw / 2, sw); x += sw + s * 0.4;
      text(ctx, parts[2], x, my + s * 0.36, s, { weight: 800, color: INK }); x += tw(ctx, parts[2], s, 800) + s * 0.6;
      text(ctx, "→ " + NUM(v), x, my + s * 0.42, s * 1.2, { weight: 900, color: VCOL(v) });
    });
  }
  // panah atas-bawah yang dicoret (tidak dibandingkan)
  function vNo(ctx, x, y, s, u) {
    if (u <= 0) return;
    alpha(ctx, u, () => {
      mline(ctx, [[x, y], [x, y - s]], 1, "#FFFFFF", 12, true); mline(ctx, [[x, y], [x, y + s]], 1, "#FFFFFF", 12, true);
      mline(ctx, [[x, y], [x, y - s]], 1, "#6B7780", 6, true); mline(ctx, [[x, y], [x, y + s]], 1, "#6B7780", 6, true);
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x + s * 0.55, y, s * 0.42, 0, Math.PI * 2); ctx.fill();
      cross(ctx, x + s * 0.55, y, s * 0.6, 1, RED, 7);
    });
  }
  function letter(ctx, L, cx, cy, r, good) {
    ctx.fillStyle = good ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    text(ctx, L, cx, cy + r * 0.42, r * 1.2, { align: "center", weight: 900, color: "#fff" });
  }

  // ---------- jalan-jalan sel demi sel (contoh, gambar A, gambar B) ----------
  // steps: [beat, frasa sorotan, frasa angka, baris, kolom]
  function walk(ctx, b, l, cfg) {
    const ord = prog(cfg.order, b);
    const g = pgrid(ctx, cfg.gx, cfg.gy, cfg.cs, cfg.pic, cfg.gopt || {});
    const rows = cfg.pic.length, cols = cfg.pic[0].length;
    const shown = {}; let cur = null;
    cfg.steps.forEach(([id, hph, vph, r, c]) => {
      const tv = ord(id, () => P(l, at(b, vph) + 0.3, 0.4)); const th = ord(id, () => (l >= at(b, hph) ? 1 : 0));
      shown[r + "," + c] = Math.max(shown[r + "," + c] || 0, tv);
      if (id === b.id && th > 0) cur = [r, c, P(l, at(b, hph), 0.35), (at(b, hph) + at(b, vph)) / 2];
    });
    const m = mgrid(ctx, cfg.mx, cfg.my, cfg.mcs, rows, cols, MAP[cfg.key], (r, c) => shown[r + "," + c] || 0);
    if (cfg.mlabel) text(ctx, cfg.mlabel, m.x + m.w / 2, m.y - 22, 30, { align: "center", weight: 900, color: C.accentDark });
    if (cur && cfg.pair !== false) {
      hiPair(ctx, g, cur[0], cur[1], cur[2]);
      // sel peta yang sedang diisi
      ctx.save(); ctx.globalAlpha *= cur[2]; ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; rr(ctx, m.x + cur[1] * m.cs + 4, m.y + cur[0] * m.cs + 4, m.cs - 8, m.cs - 8, 8); ctx.stroke(); ctx.restore();
      if (cfg.card !== false) cmpCard(ctx, cfg.cardX || 960, cfg.cardY || 640, cfg.pic[cur[0]][cur[1]], right(cfg.pic, cur[0], cur[1]), P(l, cur[3] - 0.2, 0.4), cfg.cardS || 32);
    }
    return { g, m };
  }

  // ---------- tokoh ----------
  function sandra(ctx, cx, cy, s, opt = {}) {   // gadis seniman dengan palet; cy = pusat badan
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1); ctx.translate(cx, cy);
    ctx.fillStyle = "rgba(0,0,0,0.10)"; ctx.beginPath(); ctx.ellipse(0, s * 0.62, s * 0.5, s * 0.09, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3C4652"; rr(ctx, -s * 0.28, s * 0.2, s * 0.56, s * 0.42, s * 0.08); ctx.fill();
    ctx.fillStyle = "#1F9AA6"; rr(ctx, -s * 0.4, -s * 0.3, s * 0.8, s * 0.62, s * 0.16); ctx.fill();
    ctx.fillStyle = C.hair; ctx.beginPath(); ctx.ellipse(s * 0.34, -s * 0.5, s * 0.1, s * 0.24, 0.5, 0, Math.PI * 2); ctx.fill();   // kuncir
    ctx.fillStyle = C.skin; ctx.beginPath(); ctx.arc(0, -s * 0.58, s * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(0, -s * 0.64, s * 0.32, Math.PI, 0); ctx.fill();
    ctx.fillStyle = C.pupil; ctx.beginPath(); ctx.arc(-s * 0.1, -s * 0.56, s * 0.032, 0, Math.PI * 2); ctx.arc(s * 0.1, -s * 0.56, s * 0.032, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.pupil; ctx.lineWidth = s * 0.025; ctx.beginPath(); ctx.arc(0, -s * 0.5, s * 0.08, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    // palet
    ctx.fillStyle = "#E9C995"; ctx.strokeStyle = "#9C7A48"; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(s * 0.55, s * 0.05, s * 0.32, s * 0.22, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    [COL.aD, COL.c, COL.dL, COL.bD].forEach((cc, i) => { ctx.fillStyle = cc; ctx.beginPath(); ctx.arc(s * (0.4 + i * 0.1), s * (0.0 - i * 0.03 + (i % 2) * 0.08), s * 0.05, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore();
  }
  function beaver(ctx, x, y, s, o = {}) {   // berang-berang maskot Bebras (sama dengan seri Bebras SD)
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); if (o.alpha != null) ctx.globalAlpha = o.alpha;
    ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2.5;
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(0, 24, 32, 27, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = FUR2; ctx.beginPath(); ctx.ellipse(0, 30, 19, 17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = FUR; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * 15, 49, 9, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -37, 7.5, 0, Math.PI * 2); ctx.fillStyle = FUR; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#5E3B24"; ctx.beginPath(); ctx.arc(k * 23, -37, 3.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.arc(0, -14, 29, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#D7AE84"; ctx.beginPath(); ctx.ellipse(0, -3, 15, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2A1B12"; ctx.beginPath(); ctx.ellipse(0, -10, 6.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 1.5; rr(ctx, -5, -1, 10, 9, 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 8); ctx.stroke();
    ctx.fillStyle = "#1B120C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12, -23, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#fff"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12 + 1.3, -24.4, 1.4, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function flagDE(ctx, x, y, w) {   // bendera Jerman: hitam, merah, emas (atas ke bawah)
    const h = w * 0.6;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#000000"; ctx.fillRect(x, y, w, h / 3 + 0.5);
    ctx.fillStyle = "#DD0000"; ctx.fillRect(x, y + h / 3, w, h / 3 + 0.5);
    ctx.fillStyle = "#FFCE00"; ctx.fillRect(x, y + h * 2 / 3, w, h / 3);
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  // ---------- soal ----------
  function soal(ctx, b, l) {
    board(ctx);
    const first = b.id === "soal1";
    sandra(ctx, 330, 480, 230, { alpha: first ? P(l, at(b, "Sandra"), 0.6) : 1 });
    alpha(ctx, first ? P(l, at(b, "Sandra"), 0.6) : 1, () => { hand(ctx, "Sandra", 330, 700, 44, { color: "#1F9AA6" }); });
    const a = first ? P(l, at(b, "peta kecerahan"), 0.6) : 1;
    const g = { x: 780, y: 200, cs: 120 };
    alpha(ctx, a, () => {
      pgrid(ctx, g.x, g.y, g.cs, PIC.EX, { line: "#222", lw: 3 });
      hand(ctx, "gambar dari piksel", g.x + 240, 790, 40, { color: INK });
    });
    if (b.id === "soal1b") {
      const u1 = P(l, at(b, "Piksel adalah"), 0.6);
      alpha(ctx, u1, () => {
        mline(ctx, [[1430, 330], [g.x + 300, g.y + 180]], 1, ORANGE, 6, true);
        hand(ctx, "1 piksel", 1480, 320, 46, { color: ORANGE, align: "left" });
        hand(ctx, "= 1 kotak kecil berwarna", 1480, 372, 34, { color: ORANGE, align: "left" });
      });
      const u2 = P(l, at(b, "dikelilingi"), 0.6);
      alpha(ctx, u2, () => {
        ctx.save(); ctx.setLineDash([14, 10]); ctx.strokeStyle = "#16808F"; ctx.lineWidth = 6;
        rr(ctx, g.x - 14, g.y - 14, 480 + 28, 480 + 28, 14); ctx.stroke(); ctx.restore();
        hand(ctx, "piksel putih", 1480, 560, 46, { color: "#16808F", align: "left" });
        hand(ctx, "di sekeliling gambar", 1480, 610, 34, { color: "#16808F", align: "left" });
        mline(ctx, [[1470, 590], [g.x + 490, g.y + 420]], 1, "#16808F", 5, true);
      });
    }
  }
  // tabel aturan seperti di soal: teks | kotak contoh (angka di piksel kiri)
  const RULES = [
    ["1", "jika piksel lebih cerah dari tetangga kanannya", COL.lg1, COL.lg2],
    ["0", "jika piksel sama cerah dengan tetangga kanannya", COL.lg2, COL.lg2],
    ["−1", "jika piksel lebih gelap dari tetangga kanannya", COL.lg3, COL.lg1],
  ];
  function legendBox(ctx, x, y, s, num, c1, c2) {
    ctx.fillStyle = c1; ctx.fillRect(x, y, s, s); ctx.fillStyle = c2; ctx.fillRect(x + s, y, s, s);
    ctx.strokeStyle = "#333"; ctx.lineWidth = 3; ctx.strokeRect(x, y, s, s); ctx.strokeRect(x + s, y, s, s);
    text(ctx, num, x + s / 2, y + s * 0.68, s * 0.5, { align: "center", weight: 900, color: "#111" });
  }
  function aturan(ctx, b, l) {
    board(ctx);
    if (b.id === "soal2") {
      const s = 190, x = 760, y = 260;
      const u = P(l, 0.3, 0.6);
      alpha(ctx, u, () => {
        ctx.fillStyle = COL.exL; ctx.fillRect(x, y, s, s); ctx.fillStyle = COL.exD; ctx.fillRect(x + s, y, s, s);
        ctx.strokeStyle = "#333"; ctx.lineWidth = 3; ctx.strokeRect(x, y, s, s); ctx.strokeRect(x + s, y, s, s);
        text(ctx, "piksel", x + s / 2, y + s + 44, 32, { align: "center", weight: 800, color: INK });
        text(ctx, "tetangga kanan", x + s * 1.5 + 20, y + s + 44, 32, { align: "center", weight: 800, color: INK });
      });
      const ua = P(l, at(b, "membandingkan"), 0.6);
      mline(ctx, [[x + s * 0.55, y + s / 2], [x + s * 1.45, y + s / 2]], ua, "#FFFFFF", 16, true);
      mline(ctx, [[x + s * 0.55, y + s / 2], [x + s * 1.45, y + s / 2]], ua, INK, 8, true);
      hand(ctx, "bandingkan dengan tetangga kanan", 950, 620, 46, { alpha: ua });
      const un = P(l, at(b, "sebuah angka"), 0.6);
      alpha(ctx, un, () => { mgrid(ctx, 1420, y + 20, 150, 1, 1, [[1]], () => 0); text(ctx, "?", 1495, y + 125, 80, { align: "center", weight: 900, color: ORANGE }); text(ctx, "angka", 1495, y + s + 44, 32, { align: "center", weight: 800, color: INK }); });
      return;
    }
    if (b.id === "soal3") {
      const T = [at(b, "Angkanya satu"), at(b, "Angkanya nol"), at(b, "Angkanya minus")];
      text(ctx, "Angka kecerahan setiap piksel:", 120, 200, 38, { weight: 900, color: INK });
      RULES.forEach(([n, t, c1, c2], i) => {
        const y = 240 + i * 170, u = P(l, T[i], 0.5);
        alpha(ctx, u, () => {
          card(ctx, 110, y, 1700, 150, { fill: "#F7F9FA", stroke: "#2B3440", lw: 3, r: 6 });
          text(ctx, n, 200, y + 98, 64, { align: "center", weight: 900, color: VCOL(n === "1" ? 1 : n === "0" ? 0 : -1) });
          text(ctx, t, 290, y + 92, 42, { weight: 700, color: INK, fit: 1120 });
          legendBox(ctx, 1500, y + 25, 100, n, c1, c2);
        });
      });
      return;
    }
    // soal4: contoh dari soal
    text(ctx, "Contoh dari soal", 960, 200, 40, { align: "center", weight: 900, color: INK });
    pgrid(ctx, 330, 250, 115, PIC.EX, { line: "#222", lw: 3 });
    const ua = P(l, at(b, "Peta kecerahannya"), 0.6);
    mline(ctx, [[930, 480], [1110, 480]], ua, ORANGE, 8, true);
    const T = [at(b, "yaitu satu"), at(b, "minus satu, nol"), at(b, "nol, dan"), at(b, "dan minus satu")];
    const order = [[0, 0], [0, 1], [1, 0], [1, 1]];
    alpha(ctx, ua, () => {
      mgrid(ctx, 1200, 335, 145, 2, 2, MAP.EX, (r, c) => { const k = order.findIndex(([rr2, cc]) => rr2 === r && cc === c); return P(l, T[k], 0.4); });
      text(ctx, "peta kecerahan", 1345, 300, 34, { align: "center", weight: 900, color: C.accentDark });
    });
    hand(ctx, "1 ungu muda + 3 ungu", 560, 760, 36, { color: INK, alpha: P(l, at(b, "satu piksel ungu"), 0.6) });
  }

  // ---------- pilihan jawaban ----------
  const OPTX = [170, 600, 1030, 1460];
  function options(ctx, x0s, y, cs, st = {}) {
    ["A", "B", "C", "D"].forEach((L, i) => {
      const x = x0s[i];
      alpha(ctx, st.show ? st.show(i) : 1, () => {
        ctx.save(); if (st.dim && st.dim[i]) ctx.globalAlpha *= 1 - 0.55 * st.dim[i];
        const g = pgrid(ctx, x, y, cs, PIC[L]);
        letter(ctx, L, x + g.w / 2, y + g.h + 50, 34, st.good === i);
        if (st.inner) { ctx.save(); ctx.globalAlpha *= st.inner; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.strokeRect(x + cs - 5, y + cs - 5, cs * 3 + 10, cs * 3 + 10); ctx.restore(); }
        ctx.restore();
      });
    });
  }
  function pilihan(ctx, b, l) {
    board(ctx);
    text(ctx, "Gambar mana yang peta kecerahannya berbeda?", 960, 215, 46, { align: "center", weight: 900, color: INK });
    const t0 = b.id === "soal5" ? at(b, "Pilihlah") : -9;
    options(ctx, OPTX, 290, 58, { show: i => b.id === "soal5" ? P(l, t0 + i * 0.3, 0.5) : 1, inner: b.id === "soal6" ? P(l, at(b, "tiga baris"), 0.6) * (1 - P(l, at(b, "Ayo kita"), 0.6)) : 0 });
    if (b.id === "soal6") {
      const u = P(l, at(b, "tiga baris"), 0.6) * (1 - P(l, at(b, "Ayo kita"), 0.6));
      hand(ctx, "3 baris × 3 kolom piksel berwarna", 960, 760, 40, { alpha: u });
    }
    if (b.id === "soal5") hand(ctx, "beberapa gambar berbeda bisa punya peta yang sama", 960, 760, 38, { alpha: P(l, at(b, "Beberapa gambar"), 0.6) * (1 - P(l, t0, 0.5)) });
  }

  // ---------- cerah dan gelap ----------
  function cerah(ctx, b, l) {
    board(ctx);
    const x = 260, y = 230, w = 1400, h = 110;
    const gr = ctx.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, "#000"); gr.addColorStop(1, "#FFF");
    ctx.fillStyle = gr; ctx.fillRect(x, y, w, h); ctx.strokeStyle = "#7D8790"; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
    const ok1 = b.id === "k1";
    hand(ctx, "← lebih gelap", x + 40, y + h + 70, 44, { color: INK, align: "left", alpha: ok1 ? P(l, at(b, "yang gelap"), 0.6) : 1 });
    hand(ctx, "lebih cerah →", x + w - 40, y + h + 70, 44, { color: ORANGE, align: "right", alpha: ok1 ? P(l, at(b, "yang cerah"), 0.6) : 1 });
    text(ctx, "hitam", x, y - 20, 32, { weight: 800, color: C.ink2 }); text(ctx, "putih", x + w, y - 20, 32, { align: "right", weight: 800, color: C.ink2 });
    if (b.id === "k2") {
      const u = P(l, 0.3, 0.6);
      alpha(ctx, u, () => { ring(ctx, x + w - 30, y + h / 2, 52, 74, 1, ORANGE, 6); hand(ctx, "putih =", x + w + 60, 560, 40, { color: ORANGE, align: "right" }); hand(ctx, "paling cerah", x + w + 60, 610, 40, { color: ORANGE, align: "right" }); mline(ctx, [[x + w - 40, 520], [x + w - 30, y + h + 30]], 1, ORANGE, 5, true); });
      const u2 = P(l, at(b, "piksel berwarna apa pun"), 0.6);
      alpha(ctx, u2, () => {
        [[COL.exL, 330], [COL.aL, 860]].forEach(([c, px]) => {
          const s = 150, py = 460;
          ctx.fillStyle = c; ctx.fillRect(px, py, s, s); ctx.fillStyle = W; ctx.fillRect(px + s, py, s, s);
          ctx.strokeStyle = "#555"; ctx.lineWidth = 3; ctx.strokeRect(px, py, s, s); ctx.strokeRect(px + s, py, s, s);
          text(ctx, NAME[c], px + s / 2, py + s + 40, 28, { align: "center", weight: 800, color: INK });
          text(ctx, "putih", px + s * 1.5, py + s + 40, 28, { align: "center", weight: 800, color: INK });
          text(ctx, "−1", px + s / 2, py + s * 0.66, 56, { align: "center", weight: 900, color: VCOL(-1) });
        });
        hand(ctx, "lebih gelap dari putih", 780, 740, 40, { color: VCOL(-1) });
      });
    }
  }

  // ---------- contoh, sel demi sel ----------
  const EX_STEPS = [["e1", "piksel kiri atas", "jadi angkanya satu", 0, 0], ["e2", "Berikutnya", "jadi angkanya minus", 0, 1],
                    ["e3", "Di baris bawah", "jadi angkanya nol", 1, 0], ["e4", "Piksel terakhir", "angkanya minus", 1, 1]];
  function contoh(ctx, b, l) {
    board(ctx);
    const order = ["e1", "e2", "e3", "e4", "e5"];
    if (b.id !== "e5") {
      const { m } = walk(ctx, b, l, { order, steps: EX_STEPS, key: "EX", pic: PIC.EX, gx: 170, gy: 165, cs: 112, gopt: { line: "#222", lw: 3 },
        mx: 900, my: 230, mcs: 150, mlabel: "peta kita", cardX: 1300, cardY: 640, cardS: 30 });
      if (b.id === "e4") {
        const u = P(l, at(b, "Hasil kita"), 0.6);
        alpha(ctx, u, () => {
          text(ctx, "peta di soal", 1520, 208, 30, { align: "center", weight: 900, color: C.ink2 });
          mgrid(ctx, 1400, 230, 120, 2, 2, MAP.EX, null, { ink: INK, fill: "#FFFFFF" });
          text(ctx, "=", 1352, 395, 70, { align: "center", weight: 900, color: INK });
          tick(ctx, 1460, 560, 70, u, GREEN, 10);
        });
      }
      return;
    }
    // e5: hanya ke kanan
    const g = pgrid(ctx, 170, 165, 112, PIC.EX, { line: "#222", lw: 3 });
    mgrid(ctx, 900, 230, 150, 2, 2, MAP.EX, null);
    text(ctx, "peta kita", 1050, 208, 30, { align: "center", weight: 900, color: C.accentDark });
    const u1 = P(l, at(b, "hanya dibandingkan"), 0.6);
    [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(([r, c], i) => {
      const x = g.cx(c), y = g.cy(r), uu = clamp(u1 * 4 - i, 0, 1);
      mline(ctx, [[x + 10, y], [x + 92, y]], uu, "#FFFFFF", 14, true); mline(ctx, [[x + 10, y], [x + 92, y]], uu, GREEN, 7, true);
    });
    const u2 = P(l, at(b, "Piksel di atas"), 0.6);
    // diagram kecil: satu piksel dengan tetangga kanan (dibandingkan) dan tetangga atas-bawah (tidak)
    const s = 96, cx0 = 1480, cy0 = 420;
    const sq = (x, y, col, dash) => { ctx.save(); ctx.fillStyle = col; ctx.fillRect(x - s / 2, y - s / 2, s, s); ctx.strokeStyle = "#555"; ctx.lineWidth = 3; if (dash) ctx.setLineDash([8, 7]); ctx.strokeRect(x - s / 2, y - s / 2, s, s); ctx.restore(); };
    alpha(ctx, u1, () => {
      sq(cx0, cy0, COL.exD); sq(cx0 + s, cy0, COL.exD);
      mline(ctx, [[cx0 + 8, cy0], [cx0 + s - 8, cy0]], 1, "#FFFFFF", 14, true); mline(ctx, [[cx0 + 8, cy0], [cx0 + s - 8, cy0]], 1, GREEN, 7, true);
      tick(ctx, cx0 + s * 1.9, cy0, 60, 1, GREEN, 9);
      hand(ctx, "hanya ke kanan", 1560, 250, 48, { color: GREEN });
    });
    alpha(ctx, u2, () => {
      sq(cx0, cy0 - s, COL.exL, true); sq(cx0, cy0 + s, COL.exD, true);
      mline(ctx, [[cx0, cy0 - 8], [cx0, cy0 - s + 10]], 1, "#9AA4AC", 6, true); mline(ctx, [[cx0, cy0 + 8], [cx0, cy0 + s - 10]], 1, "#9AA4AC", 6, true);
      cross(ctx, cx0 - s * 0.95, cy0 - s, 54, 1, RED, 8); cross(ctx, cx0 - s * 0.95, cy0 + s, 54, 1, RED, 8);
      hand(ctx, "atas dan bawah: tidak dibandingkan", 1500, 690, 34, { color: RED });
    });
  }

  // ---------- gambar A ----------
  const A_STEPS = [["a1", "Piksel pertama", "jadi angkanya nol", 0, 0], ["a1", "Piksel kedua dan", "jadi angkanya juga", 0, 1],
                   ["a2", "Piksel ketiga", "angkanya minus", 0, 2],
                   ["a3", "Caranya sama", "nol, nol", 1, 0], ["a3", "Caranya sama", "nol, dan", 1, 1], ["a3", "Caranya sama", "dan minus satu", 1, 2],
                   ["a3", "Caranya sama", "nol, nol", 2, 0], ["a3", "Caranya sama", "nol, dan", 2, 1], ["a3", "Caranya sama", "dan minus satu", 2, 2]];
  function petaA(ctx, b, l) {
    board(ctx);
    letter(ctx, "A", 120, 190, 34);
    const cfg = { order: ["a0", "a1", "a2", "a3", "a4"], steps: A_STEPS, key: "A", pic: PIC.A, gx: 190, gy: 160, cs: 104,
      mx: 1000, my: 215, mcs: 130, mlabel: "peta gambar A", cardX: 1195, cardY: 650, cardS: 30, pair: b.id !== "a3" };
    const { g, m } = walk(ctx, b, l, cfg);
    if (b.id === "a3") {   // dua baris bawah sekaligus: sorot kedua baris
      const u = P(l, at(b, "Caranya sama"), 0.5);
      alpha(ctx, u, () => { ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; rr(ctx, g.x + g.cs - 4, g.y + 2 * g.cs - 4, 3 * g.cs + 8, 2 * g.cs + 8, 10); ctx.stroke(); });
      hand(ctx, "biru tua: sama seperti baris atas", 1195, 700, 36, { alpha: P(l, at(b, "Baris kedua"), 0.6), color: INK });
    }
    if (b.id === "a0") thinkBadge(ctx, 1000, 640, 790, 112, l, b.dur, "Isi peta gambar A, baris demi baris.");
    if (b.id === "a4") {
      const u = P(l, at(b, "Perhatikan"), 0.6);
      alpha(ctx, u, () => { ctx.save(); ctx.setLineDash([14, 10]); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(g.x + g.cs - 10, g.y + 2 * g.cs); ctx.lineTo(g.x + 4 * g.cs + 10, g.y + 2 * g.cs); ctx.stroke(); ctx.restore(); });
      vNo(ctx, g.x + g.w + 40, g.y + 2 * g.cs, 50, u);
      hand(ctx, "biru muda dan biru tua tidak pernah dibandingkan", 1195, 700, 34, { color: RED, alpha: u });
      const u0 = P(l, 0.3, 0.6);
      alpha(ctx, u0, () => { for (let r = 0; r < 3; r++) { ctx.strokeStyle = GREEN; ctx.lineWidth = 4; rr(ctx, m.x - 6, m.y + r * m.cs + 6, m.w + 12, m.cs - 12, 10); ctx.stroke(); } hand(ctx, "0  0  −1", m.x + m.w + 140, m.y + m.h / 2 + 14, 40, { color: INK }); });
    }
  }

  // ---------- gambar B, C, D ----------
  const HX = [300, 790, 1280];   // kiri gambar (cs 60 → 300 px)
  function hitung(ctx, b, l) {
    board(ctx);
    if (["h3", "h4", "h5"].includes(b.id)) return hitungB(ctx, b, l);
    const keys = ["B", "C", "D"];
    const fill = { C: b.id === "h1" ? P(l, at(b, "Jadi, setiap"), 0.5) : b.id === "h2" ? 1 : 0, D: b.id === "h2" ? P(l, at(b, "Jadi, setiap"), 0.5) : 0, B: 0 };
    keys.forEach((k, i) => {
      const x = HX[i], act = (b.id === "h1" && k === "C") || (b.id === "h2" && k === "D");
      const g = pgrid(ctx, x, 160, 54, PIC[k]);
      letter(ctx, k, x - 40, 190, 28);
      if (act) { ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; rr(ctx, x - 10, 150, g.w + 20, g.h + 20, 12); ctx.stroke(); }
      const m = mgrid(ctx, x + 36, 460, 66, 3, 3, MAP[k], () => fill[k]);
      if (fill[k] > 0.5 && k !== "B") hand(ctx, "= peta A", m.x + m.w / 2, 720, 40, { color: GREEN, alpha: b.id === "h1" ? P(l, at(b, "Petanya sama"), 0.5) : (k === "D" ? P(l, at(b, "Jadi, setiap"), 0.5) : 1) });
      if (k === "D" && b.id === "h2") {
        const u = P(l, at(b, "Di setiap baris"), 0.5);
        [0, 1, 2].forEach(r => alpha(ctx, u, () => { mline(ctx, [[g.cx(0) - 18, g.cy(r)], [g.cx(2) + 18, g.cy(r)]], 1, "#FFFFFF", 10, true); mline(ctx, [[g.cx(0) - 18, g.cy(r)], [g.cx(2) + 18, g.cy(r)]], 1, INK, 5, true); }));
        hand(ctx, "satu baris", 1580, 280, 30, { color: ORANGE, align: "left", alpha: u }); hand(ctx, "= satu warna", 1580, 320, 30, { color: ORANGE, align: "left", alpha: u });
      }
    });
    if (b.id === "h0") thinkBadge(ctx, 560, 690, 800, 112, l, b.dur, "Isi peta B, C, dan D.");
  }
  const B_STEPS = [["h4", "Piksel pertama", "jadi angkanya nol", 0, 0], ["h4", "Piksel kedua berwarna", "jadi angkanya minus", 0, 1],
                   ["h5", "Piksel ketiga", "jadi angkanya minus", 0, 2]];
  function hitungB(ctx, b, l) {
    letter(ctx, "B", 120, 190, 34);
    const { g, m } = walk(ctx, b, l, { order: ["h3", "h4", "h5"], steps: B_STEPS, key: "B", pic: PIC.B, gx: 190, gy: 160, cs: 104,
      mx: 1000, my: 215, mcs: 130, mlabel: "peta gambar B", cardX: 1195, cardY: 650, cardS: 30 });
    if (b.id === "h3") {
      const u1 = P(l, at(b, "dua piksel kiri"), 0.5), u2 = P(l, at(b, "piksel kanan"), 0.5);
      alpha(ctx, u1, () => { ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; rr(ctx, g.x + g.cs - 4, g.y + g.cs - 4, 2 * g.cs + 8, 3 * g.cs + 8, 10); ctx.stroke(); });
      alpha(ctx, u1, () => text(ctx, "ungu tua", 1000, 660, 40, { weight: 900, color: COL.bD }));
      alpha(ctx, u2, () => { ctx.strokeStyle = "#16808F"; ctx.lineWidth = 6; rr(ctx, g.x + 3 * g.cs - 4, g.y + g.cs - 4, g.cs + 8, 3 * g.cs + 8, 10); ctx.stroke(); });
      alpha(ctx, u2, () => { text(ctx, "ungu muda", 1300, 660, 40, { weight: 900, color: "#9B5CC4" }); swatch(ctx, COL.bL, 1250, 625, 40); });
      alpha(ctx, u1, () => swatch(ctx, COL.bD, 950, 625, 40));
    }
    if (b.id === "h5") {
      const u = P(l, at(b, "Jadi, setiap baris"), 0.5);
      alpha(ctx, u, () => {
        mgrid(ctx, m.x, m.y, m.cs, 3, 3, MAP.B, null);
        ctx.strokeStyle = GREEN; ctx.lineWidth = 6; rr(ctx, m.x + m.cs + 6, m.y - 10, m.cs - 12, m.h + 20, 14); ctx.stroke();
        hand(ctx, "0  −1  −1", m.x + m.w + 150, m.y + m.h / 2 + 14, 40, { color: INK });
      });
    }
  }

  // ---------- membandingkan peta ----------
  const BX = [150, 585, 1020, 1455];
  function banding(ctx, b, l) {
    board(ctx);
    const good = b.id === "p2" ? P(l, at(b, "adalah B"), 0.5) : 0;
    const T = b.id === "p1" ? [at(b, "Peta gambar A"), at(b, "Hanya peta")] : [-9, -9];
    ["A", "B", "C", "D"].forEach((k, i) => {
      const x = BX[i];
      ctx.save();
      pgrid(ctx, x + 15, 150, 44, PIC[k]);
      letter(ctx, k, x - 5, 175, 26, k === "B" && good > 0.5);
      const m = mgrid(ctx, x + 30, 410, 64, 3, 3, MAP[k], null);
      mline(ctx, [[x + 125, 380], [x + 125, 400]], 1, "#9AA4AC", 4, false);
      ctx.restore();
      if (k !== "B") { const u = P(l, T[0], 0.5); if (b.id === "p1" && u > 0) { tick(ctx, m.x + m.w / 2, 700, 56, u, GREEN, 9); hand(ctx, "sama", m.x + m.w / 2, 770, 36, { color: GREEN, alpha: u }); } }
      else {
        const u = b.id === "p1" ? P(l, T[1], 0.6) : 1;
        ring(ctx, m.x + m.cs * 1.5, m.y + m.h / 2, m.cs * 0.75, m.h * 0.62, u, RED, 6);
        if (b.id === "p1") hand(ctx, "berbeda!", m.x + m.w / 2, 760, 40, { color: RED, alpha: u });
      }
    });
    if (good > 0) {
      alpha(ctx, good, () => { ctx.strokeStyle = GREEN; ctx.lineWidth = 8; rr(ctx, BX[1] - 40, 140, 330, 490, 20); ctx.stroke(); });
      hand(ctx, "Jawaban: B", BX[1] + 125, 710, 56, { color: GREEN, alpha: good });
    }
  }
  function alasan(ctx, b, l) {
    board(ctx);
    if (b.id === "p3") {
      const u = P(l, at(b, "Pada gambar A dan D"), 0.6), u2 = P(l, at(b, "hanya membandingkan"), 0.6), u3 = P(l, at(b, "tidak tercatat"), 0.6);
      [["A", 200], ["D", 640]].forEach(([k, x]) => {
        alpha(ctx, u, () => {
          const g = pgrid(ctx, x, 175, 62, PIC[k]); letter(ctx, k, x - 30, 200, 28);
          mline(ctx, [[x + g.w + 40, g.cy(0)], [x + g.w + 40, g.cy(2)]], 1, ORANGE, 7, true);
          mline(ctx, [[x + g.w + 40, g.cy(2)], [x + g.w + 40, g.cy(0)]], 1, ORANGE, 7, true);
          [0, 1, 2].forEach(r => { mline(ctx, [[g.cx(0) - 16, g.cy(r)], [g.cx(2) + 16, g.cy(r)]], u2, "#FFFFFF", 10, true); mline(ctx, [[g.cx(0) - 16, g.cy(r)], [g.cx(2) + 16, g.cy(r)]], u2, INK, 5, true); });
          if (u3 > 0) cross(ctx, x + g.w + 40, g.cy(1), 56, u3, RED, 8);
        });
      });
      hand(ctx, "warna berubah dari atas ke bawah", 1440, 290, 38, { color: ORANGE, alpha: u });
      hand(ctx, "peta hanya membandingkan ke kanan →", 1440, 380, 36, { color: INK, alpha: u2 });
      hand(ctx, "perubahan atas–bawah tidak tercatat", 1440, 470, 36, { color: RED, alpha: u3 });
      return;
    }
    if (b.id === "p4") {
      const u = P(l, 0.3, 0.6), u2 = P(l, at(b, "Merah, biru"), 0.6), u3 = P(l, at(b, "Yang tersisa"), 0.6);
      ["A", "C", "D"].forEach((k, i) => {
        const x = 150 + i * 300; alpha(ctx, u, () => { pgrid(ctx, x, 190, 48, PIC[k]); letter(ctx, k, x + 120, 480, 26); });
      });
      mline(ctx, [[960, 400], [1080, 400]], u2, ORANGE, 8, true);
      alpha(ctx, u2, () => { mgrid(ctx, 1110, 300, 110, 3, 3, MAP.A, null); text(ctx, "satu peta yang sama", 1275, 270, 32, { align: "center", weight: 900, color: C.accentDark }); });
      hand(ctx, "warna asli hilang", 520, 640, 46, { color: RED, alpha: u2 });
      hand(ctx, "yang tersisa: cerah atau gelap", 1275, 720, 38, { color: INK, alpha: u3 });
      return;
    }
    // p5: B
    const u = P(l, 0.3, 0.6), u2 = P(l, at(b, "tercatat di peta"), 0.6);
    alpha(ctx, u, () => {
      const g = pgrid(ctx, 230, 175, 100, PIC.B); letter(ctx, "B", 190, 205, 30);
      [0, 1, 2].forEach(r => { mline(ctx, [[g.cx(1) + 6, g.cy(r)], [g.cx(2) - 6, g.cy(r)]], 1, "#FFFFFF", 14, true); mline(ctx, [[g.cx(1) + 6, g.cy(r)], [g.cx(2) - 6, g.cy(r)]], 1, GREEN, 7, true); });
      hand(ctx, "warna berubah dari kiri ke kanan", 1300, 260, 40, { color: ORANGE });
    });
    alpha(ctx, u2, () => {
      const m = mgrid(ctx, 1110, 330, 120, 3, 3, MAP.B, null);
      ctx.strokeStyle = GREEN; ctx.lineWidth = 6; rr(ctx, m.x + m.cs + 6, m.y - 10, m.cs - 12, m.h + 20, 14); ctx.stroke();
      hand(ctx, "tercatat!", 1640, 520, 44, { color: GREEN });
    });
  }

  // ---------- penutup: mencari tepi ----------
  const EDGE = (() => {   // 8×6: latar putih, kotak gelap di kolom 2–5, baris 1–4
    const D = "#3A3F46", pic = [];
    for (let r = 0; r < 6; r++) { const row = []; for (let c = 0; c < 8; c++) row.push(r >= 1 && r <= 4 && c >= 2 && c <= 5 ? D : W); pic.push(row); }
    return pic;
  })();
  const EDGE_MAP = mapOf(EDGE);
  function komputer(ctx, b, l) {
    board(ctx);
    const X = 180, Y = 160, Wm = 1300, Hm = 560;
    ctx.fillStyle = "#3B4652"; rr(ctx, X, Y, Wm, Hm, 24); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, X + 24, Y + 24, Wm - 48, Hm - 48, 10); ctx.fill();
    ctx.fillStyle = "#3B4652"; ctx.fillRect(X + Wm / 2 - 40, Y + Hm, 80, 40); rr(ctx, X + Wm / 2 - 180, Y + Hm + 36, 360, 20, 10); ctx.fill();
    ctx.fillStyle = "#E7EEF2"; ctx.fillRect(X + 24, Y + 24, Wm - 48, 52);
    text(ctx, "Pengolah Gambar", X + 50, Y + 60, 28, { weight: 800, color: INK });
    const cs = 52, gx = X + 60, gy = Y + 130;
    // gambar (tanpa pinggiran tambahan: latarnya sudah putih)
    ctx.fillStyle = W; ctx.fillRect(gx, gy, 8 * cs, 6 * cs);
    EDGE.forEach((row, r) => row.forEach((p, c) => { ctx.fillStyle = p; ctx.fillRect(gx + c * cs, gy + r * cs, cs, cs); }));
    ctx.strokeStyle = "#C9CED3"; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let i = 0; i <= 6; i++) { ctx.moveTo(gx, gy + i * cs); ctx.lineTo(gx + 8 * cs, gy + i * cs); }
    for (let j = 0; j <= 8; j++) { ctx.moveTo(gx + j * cs, gy); ctx.lineTo(gx + j * cs, gy + 6 * cs); }
    ctx.stroke();
    text(ctx, "gambar", gx + 4 * cs, gy - 20, 28, { align: "center", weight: 800, color: C.ink2 });
    const u = b.id === "c1" ? P(l, at(b, "mencari tepi"), 0.8) : 1;
    mline(ctx, [[gx + 8 * cs + 20, gy + 3 * cs], [gx + 8 * cs + 90, gy + 3 * cs]], u, ORANGE, 7, true);
    const mx = gx + 8 * cs + 120;
    alpha(ctx, u, () => {
      ctx.fillStyle = "#F7F9FA"; ctx.fillRect(mx, gy, 8 * cs, 6 * cs);
      ctx.strokeStyle = "#C9CED3"; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let i = 0; i <= 6; i++) { ctx.moveTo(mx, gy + i * cs); ctx.lineTo(mx + 8 * cs, gy + i * cs); }
      for (let j = 0; j <= 8; j++) { ctx.moveTo(mx + j * cs, gy); ctx.lineTo(mx + j * cs, gy + 6 * cs); }
      ctx.stroke();
      EDGE_MAP.forEach((row, r) => row.forEach((v, c) => {
        if (v !== 0) { ctx.fillStyle = v === 1 ? "#DDF2E4" : "#F8E1DA"; ctx.fillRect(mx + c * cs + 2, gy + r * cs + 2, cs - 4, cs - 4); }
        text(ctx, NUM(v), mx + (c + 0.5) * cs, gy + (r + 0.5) * cs + 9, v === 0 ? 22 : 26, { align: "center", weight: v === 0 ? 600 : 900, color: v === 0 ? "#B4BEC5" : VCOL(v) });
      }));
      text(ctx, "peta kecerahan", mx + 4 * cs, gy - 20, 28, { align: "center", weight: 800, color: C.ink2 });
    });
    const ue = b.id === "c1" ? P(l, at(b, "berubah tiba-tiba"), 0.6) : 1;
    alpha(ctx, ue, () => { hand(ctx, "tepi kiri dan kanan:", 1680, 260, 30, { color: GREEN }); hand(ctx, "tercatat", 1680, 300, 30, { color: GREEN }); });
    if (b.id === "c2") {
      const u2 = P(l, at(b, "kehilangan"), 0.6);
      alpha(ctx, u2, () => {
        ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = RED; ctx.lineWidth = 4;
        ctx.strokeRect(mx + 2 * cs, gy + cs - 3, 4 * cs, 6); ctx.strokeRect(mx + 2 * cs, gy + 5 * cs - 3, 4 * cs, 6); ctx.restore();
        hand(ctx, "tepi atas dan bawah:", 1680, 370, 30, { color: RED }); hand(ctx, "hilang", 1680, 410, 30, { color: RED });
      });
      const u3 = P(l, at(b, "informasi apa yang disimpan"), 0.6);
    }
    kiko(ctx, 1680, 640, 150, 0, { mood: "happy" });
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = [at(b, "Pertama"), at(b, "Kedua"), at(b, "Ketiga")];
    const S = ["Pahami aturan dengan mencoba contoh.", "Hitung peta setiap pilihan, baris demi baris.", "Bandingkan petanya, cari yang berbeda."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 48, { weight: 900, color: INK, fit: 1080 });
        const ix = 1530, iy = y + 30;
        if (i === 0) legendBox(ctx, ix, iy, 100, "1", COL.lg1, COL.lg2);
        if (i === 1) { pgrid(ctx, ix - 10, iy - 5, 22, PIC.A); mgrid(ctx, ix + 110, iy + 17, 22 * 1.4, 3, 3, MAP.A, null); }
        if (i === 2) { mgrid(ctx, ix - 10, iy + 10, 26, 3, 3, MAP.A, null); text(ctx, "≠", ix + 90, iy + 68, 54, { align: "center", weight: 900, color: RED }); mgrid(ctx, ix + 120, iy + 10, 26, 3, 3, MAP.B, null); }
      });
    });
  }

  // ---------- versi tegak untuk Short (area ±1000×700, x 460–1460) ----------
  function soal_v(ctx, b, l) {
    board(ctx);
    text(ctx, "Bandingkan setiap piksel dengan tetangga kanannya.", 960, 200, 34, { align: "center", weight: 900, color: INK, fit: 980 });
    RULES.forEach(([n, t, c1, c2], i) => {
      const y = 235 + i * 92;
      card(ctx, 470, y, 980, 80, { fill: "#F7F9FA", stroke: "#2B3440", lw: 2.5, r: 6 });
      text(ctx, n, 530, y + 56, 46, { align: "center", weight: 900, color: VCOL(n === "1" ? 1 : n === "0" ? 0 : -1) });
      text(ctx, t.replace("jika piksel ", ""), 590, y + 52, 30, { weight: 700, color: INK, fit: 700 });
      legendBox(ctx, 1310, y + 8, 64, n, c1, c2);
    });
    const show = b.id === "soal4" || b.id === "h1";
    alpha(ctx, show ? 1 : 0, () => {
      text(ctx, "Contoh:", 480, 560, 32, { weight: 900, color: C.accentDark });
      pgrid(ctx, 640, 520, 68, PIC.EX, { line: "#222", lw: 3 });
      mline(ctx, [[935, 656], [1040, 656]], 1, ORANGE, 7, true);
      mgrid(ctx, 1080, 566, 90, 2, 2, MAP.EX, null);
    });
  }
  function pilihan_v(ctx, b, l) {
    board(ctx);
    text(ctx, "Gambar mana yang petanya berbeda?", 960, 200, 40, { align: "center", weight: 900, color: INK });
    [[500, 235], [1000, 235], [500, 530], [1000, 530]].forEach(([x, y], i) => {
      const k = "ABCD"[i]; pgrid(ctx, x + 80, y, 40, PIC[k]); letter(ctx, k, x + 40, y + 30, 28);
    });
  }
  // Short: empat gambar + peta, terisi bertahap (h3: A; h4: + C, D; h5: + B dan jawaban)
  function banding_v(ctx, b, l) {
    board(ctx);
    const stage = { a4: 1, h2: 2, h5: 3 }[b.id] || 3;
    const u = P(l, 0.6, 0.6);
    [[470, 160, "A"], [970, 160, "B"], [470, 500, "C"], [970, 500, "D"]].forEach(([x, y, k]) => {
      const on = k === "A" ? 1 : k === "B" ? (stage >= 3 ? 1 : 0) : (stage >= 2 ? 1 : 0);
      const fresh = (k === "A" && stage === 1) || ((k === "C" || k === "D") && stage === 2) || (k === "B" && stage === 3);
      ctx.save();
      pgrid(ctx, x + 50, y + 15, 42, PIC[k]); letter(ctx, k, x + 26, y + 40, 24, k === "B" && stage === 3 && u > 0.5);
      const m = mgrid(ctx, x + 290, y + 57, 62, 3, 3, MAP[k], () => on * (fresh ? u : 1));
      ctx.restore();
      if (k === "B" && stage === 3) { ring(ctx, m.x + m.cs * 1.5, m.y + m.h / 2, m.cs * 0.75, m.h * 0.62, u, RED, 6); }
      if ((k === "C" || k === "D") && stage === 2) hand(ctx, "= A", x + 400, y + 300, 34, { color: GREEN, alpha: u });
    });
    if (stage === 3) ring(ctx, 1210, 315, 250, 170, P(l, 1.6, 0.6), GREEN, 7);
  }

  Object.assign(K.SCENES, {
    soal, aturan, pilihan, cerah, contoh, petaA, hitung, banding, alasan, komputer, langkah, soal_v, pilihan_v, banding_v,
    buka(ctx, b, l) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "pembahasan"), 0.8) : 1;
      [880, 1110, 1340, 1570].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v }); });
      if (first) hand(ctx, "tingkat SMA (Penegak)", 1230, 770, 44, { alpha: P(l, at(b, "tingkat SMA"), 0.6) });
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
      const fu = P(l, at(b, "Jerman"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagDE(ctx, 470, 230, 170); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Jerman"), 0.8);
      if (au > 0) ring(ctx, 1160, 300 + 2 * 92 - 14, 190, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
      [640, 860].forEach((x, i) => beaver(ctx, x, 470 + Math.sin(l * 3 + i) * 8, 160));
      pgrid(ctx, 600, 610, 26, PIC.B); mgrid(ctx, 770, 636, 28, 3, 3, MAP.B, null);
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 750, 800, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Menghitung peta kecerahan, sel demi sel", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
