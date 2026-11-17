/* SG05 Pembahasan Soal Bebras 2025-DE-05 "Gambar yang Diperindah" (Jerman), kategori Siaga.
   Gaya papan tulis putih dengan coretan spidol (sama dengan SG01–SG04) + simulasi:
   empat gambar bunga pensil (digambar ulang), empat gambar yang dicat jari (A–D). Gambar dicat selalu digambar sebagai
   garis bunga aslinya + bentuk cat di atasnya, jadi bagian yang kelihatan pasti konsisten. "Cat tembus pandang" dan
   garis yang tidak tertutup cat (merah) dihitung tepat dengan kanvas bayangan (destination-out).
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const WORD = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"];

  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const atI = (b, i) => lead(b) + Math.max(0, i) / TXT(b).length * (b.audio || b.dur);
  const at = (b, s, from = 0) => {
    const T = TXT(b); let i = T.indexOf(s, from);
    if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); i = 0; }
    return atI(b, i);
  };
  // frasa berurutan: waktu tiap frasa dicari setelah frasa sebelumnya
  const atSeq = (b, list, from = "") => {
    const T = TXT(b); let p = from ? Math.max(0, T.indexOf(from)) : 0; const out = [];
    list.forEach(s => { const i = T.indexOf(s, p); if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); out.push(atI(b, p)); } else { out.push(atI(b, i)); p = i + s.length; } });
    return out;
  };
  const P = (l, t0, d) => ease((l - t0) / (d || 0.6));
  // urutan beat: beat sebelumnya dalam satu adegan dianggap selesai (nilai 1)
  function prog(order, b, l) {
    const k = order.indexOf(b.id);
    return (id, fn) => { const j = order.indexOf(id); if (j < 0) return 0; if (j < k) return 1; if (j > k) return 0; return fn ? fn() : 1; };
  }

  // ---------- papan dan spidol (sama dengan B02) ----------
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
  function circleDraw(ctx, x, y, r, u, color, w = 7) {   // lingkaran digambar spidol dari atas searah jarum jam
    if (u <= 0) return;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(u, 0, 1)); ctx.stroke(); ctx.restore();
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
    text(ctx, "PIKIRKAN DULU", x + h + 20, y + h * 0.42, 38, { weight: 900, color: C.accentDark });
    text(ctx, q, x + h + 20, y + h * 0.78, 30, { weight: 800, color: INK, fit: w - h - 40 });
  }
  function beaver(ctx, x, y, s, o = {}) {   // berang-berang maskot Bebras (sama dengan B01–B02)
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
  // ---------- SG05: gambar bunga dan cat jari ----------
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F7FD1",
        GRAYT = "#8A96A0", FUR = "#8E5B3A", FUR2 = "#B98458", PENCIL = "#262626", PAPER = "#FCF8F0";
  const META = { judul: "Gambar yang Diperindah", tahun: "2025", negara: "Jerman", kode: "2025-DE-05" };
  const KEYS = ["A", "B", "C", "D"], ANS = { A: 2, B: 1, C: 3, D: 4 };

  // geometri gambar (koordinat 0..1 di dalam kertas persegi)
  function bez(p0, p1, p2, p3, n = 24) {
    const o = [];
    for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t, a = u * u * u, b2 = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
      o.push([a * p0[0] + b2 * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b2 * p1[1] + c * p2[1] + d * p3[1]]); }
    return o;
  }
  function circ(cx, cy, rx, ry = rx, n = 22) { const o = []; for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + i / n * Math.PI * 2; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; }
  const join = (...ps) => ps.reduce((a, p) => a.concat(a.length ? p.slice(1) : p), []);
  const chevron = (cx, cy, s) => [[cx - s, cy - s * 0.95], [cx, cy], [cx + s, cy - s * 0.95]];
  function leaf(x0, y0, x1, y1, wd) {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L * wd, ny = dx / L * wd;
    return join(bez([x0, y0], [mx + nx * 1.3 - dx * 0.2, my + ny * 1.3 - dy * 0.2], [mx + nx * 1.3 + dx * 0.2, my + ny * 1.3 + dy * 0.2], [x1, y1], 16),
                bez([x1, y1], [mx - nx * 1.3 + dx * 0.2, my - ny * 1.3 + dy * 0.2], [mx - nx * 1.3 - dx * 0.2, my - ny * 1.3 - dy * 0.2], [x0, y0], 16));
  }
  function cloud(cx, cy, rx, ry, k = 9) {
    const o = [];
    for (let i = 0; i <= 144; i++) { const a = -Math.PI / 2 + i / 144 * Math.PI * 2, j = Math.floor(((a + Math.PI / 2) / (Math.PI * 2)) * k);
      const amp = 0.11 + 0.05 * Math.sin(j * 2.3), r = 1 - amp + amp * Math.abs(Math.sin((a + Math.PI / 2) * k / 2));
      o.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); }
    return o;
  }
  const FL = {
    1: [join([[0.5, 0.86], [0.5, 0.56]], bez([0.5, 0.56], [0.5, 0.42], [0.53, 0.32], [0.535, 0.245])), circ(0.535, 0.222, 0.02, 0.024),
        bez([0.5, 0.47], [0.47, 0.40], [0.42, 0.36], [0.335, 0.365]), circ(0.312, 0.365, 0.023, 0.019),
        bez([0.5, 0.60], [0.53, 0.55], [0.58, 0.52], [0.645, 0.53]), circ(0.668, 0.53, 0.023, 0.019)],
    2: [join(bez([0.48, 0.74], [0.50, 0.50], [0.55, 0.33], [0.66, 0.31]), bez([0.66, 0.31], [0.73, 0.30], [0.78, 0.33], [0.785, 0.38])), circ(0.785, 0.43, 0.028, 0.05),
        bez([0.48, 0.74], [0.38, 0.66], [0.28, 0.64], [0.22, 0.69]), bez([0.48, 0.74], [0.40, 0.70], [0.32, 0.72], [0.27, 0.77]),
        bez([0.48, 0.74], [0.42, 0.64], [0.36, 0.60], [0.30, 0.61]), bez([0.48, 0.74], [0.54, 0.68], [0.60, 0.66], [0.64, 0.66])],
    3: [join(bez([0.46, 0.87], [0.44, 0.6], [0.40, 0.30], [0.27, 0.27]), bez([0.27, 0.27], [0.20, 0.26], [0.17, 0.32], [0.18, 0.39])), circ(0.18, 0.415, 0.022, 0.026),
        join(bez([0.46, 0.87], [0.50, 0.6], [0.56, 0.30], [0.68, 0.27]), bez([0.68, 0.27], [0.76, 0.25], [0.80, 0.32], [0.80, 0.39])), circ(0.80, 0.415, 0.022, 0.026),
        bez([0.52, 0.55], [0.53, 0.50], [0.545, 0.45], [0.55, 0.42]), circ(0.553, 0.405, 0.012, 0.014),
        chevron(0.435, 0.627, 0.03), chevron(0.5025, 0.627, 0.03), chevron(0.449, 0.752, 0.03), chevron(0.479, 0.752, 0.03)],
    4: [cloud(0.49, 0.45, 0.18, 0.20), bez([0.43, 0.64], [0.40, 0.72], [0.36, 0.80], [0.34, 0.88]), leaf(0.34, 0.88, 0.235, 0.745, 0.035), leaf(0.34, 0.88, 0.47, 0.75, 0.035)],
    // pemanasan: rumah, dan rumah dengan pohon di kanan
    H: [[[0.12, 0.45], [0.40, 0.20], [0.68, 0.45]], [[0.17, 0.45], [0.63, 0.45], [0.63, 0.85], [0.17, 0.85], [0.17, 0.45]], [[0.34, 0.85], [0.34, 0.62], [0.46, 0.62], [0.46, 0.85]]],
  };
  FL.T = FL.H.concat([[[0.87, 0.86], [0.87, 0.60]], circ(0.87, 0.52, 0.08, 0.085)]);
  // cat: e = elips [cx, cy, rx, ry], s = sapuan jari [titik], w = lebar sapuan; D = persegi dengan lubang
  const PAINT = {
    A: { col: "#6BBBC9", of: 2, shapes: [{ s: [[0.15, 0.62], [0.35, 0.58], [0.6, 0.62], [0.68, 0.72]], w: 0.2 }, { s: [[0.12, 0.78], [0.4, 0.82], [0.62, 0.85]], w: 0.22 },
        { s: [[0.32, 0.9], [0.5, 0.92]], w: 0.14 }, { e: [0.40, 0.74, 0.27, 0.13] }, { s: [[0.5, 0.24], [0.5, 0.6]], w: 0.11 }, { e: [0.825, 0.46, 0.10, 0.18] }] },
    B: { col: "#C0201E", of: 1, shapes: [{ e: [0.35, 0.33, 0.31, 0.30] }, { s: [[0.40, 0.55], [0.56, 0.60], [0.66, 0.56]], w: 0.12 },
        { s: [[0.5, 0.3], [0.68, 0.22], [0.84, 0.14]], w: 0.12 }, { s: [[0.60, 0.40], [0.70, 0.58], [0.80, 0.85]], w: 0.12 }] },
    C: { col: "#A400D0", of: 3, shapes: [{ e: [0.24, 0.33, 0.17, 0.23] }, { s: [[0.17, 0.10], [0.22, 0.30]], w: 0.14 }, { s: [[0.30, 0.40], [0.45, 0.46]], w: 0.11 }, { s: [[0.5, 0.34], [0.5, 0.9]], w: 0.22 }, { e: [0.84, 0.40, 0.11, 0.19] }] },
    D: { col: "#0A16F2", of: 4, rect: [0.05, 0.04, 0.95, 0.95], hole: [0.40, 0.38, 0.55, 0.53] },
    H: { col: "#3DAA4A", of: "H", shapes: [{ e: [0.40, 0.64, 0.40, 0.33] }] },
  };
  const HOLE = PAINT.D.hole;

  function lw(s) { return Math.max(2.4, s * 0.011); }
  function paper(ctx, x, y, s, opt = {}) {
    ctx.save(); ctx.fillStyle = "rgba(0,0,0,0.10)"; ctx.fillRect(x + 5, y + 7, s, s);
    ctx.fillStyle = opt.fill || PAPER; ctx.fillRect(x, y, s, s);
    ctx.strokeStyle = opt.stroke || "#8E979C"; ctx.lineWidth = opt.slw || 2; ctx.strokeRect(x, y, s, s); ctx.restore();
  }
  // garis bunga; u = kemajuan menggambar (0..1)
  function flower(ctx, F, x, y, s, opt = {}) {
    const segs = FL[F], lens = segs.map(plen), tot = lens.reduce((a, c) => a + c, 0);
    let rem = tot * clamp(opt.u == null ? 1 : opt.u, 0, 1);
    segs.forEach((p, i) => {
      if (rem <= 0) return; const f = Math.min(1, rem / lens[i]); rem -= lens[i];
      mline(ctx, p.map(([a, b2]) => [x + a * s, y + b2 * s]), f, opt.color || PENCIL, opt.lw || lw(s));
    });
  }
  function wob(i, a) { return 1 + 0.045 * Math.sin(a * 5 + i * 1.7) + 0.03 * Math.sin(a * 11 + i * 3.1); }
  function paintDraw(ctx, key, x, y, s, col) {
    const Pn = PAINT[key];
    ctx.save(); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (Pn.rect) {
      const [a, b2, c, d] = Pn.rect, [e, f, g, h] = Pn.hole;
      ctx.beginPath();
      const edge = [[a, b2], [c, b2], [c, d], [a, d]];
      edge.forEach(([px, py], i) => {
        const [qx, qy] = edge[(i + 1) % 4];
        for (let k = 0; k < 12; k++) { const t = k / 12, X = px + (qx - px) * t, Y = py + (qy - py) * t, n = 0.012 * Math.sin(k * 2.1 + i * 1.3) + 0.008 * Math.sin(k * 5.3 + i);
          const ox = i === 1 ? n : i === 3 ? -n : 0, oy = i === 0 ? -n : i === 2 ? n : 0;
          if (i === 0 && k === 0) ctx.moveTo(x + (X + ox) * s, y + (Y + oy) * s); else ctx.lineTo(x + (X + ox) * s, y + (Y + oy) * s); }
      });
      ctx.closePath();
      ctx.moveTo(x + e * s, y + f * s); ctx.lineTo(x + e * s, y + h * s); ctx.lineTo(x + g * s, y + h * s); ctx.lineTo(x + g * s, y + f * s); ctx.closePath();
      ctx.fill("evenodd");
    }
    (Pn.shapes || []).forEach((sh, i) => {
      if (sh.e) {
        const [cx, cy, rx, ry] = sh.e; ctx.beginPath();
        for (let k = 0; k <= 60; k++) { const a = k / 60 * Math.PI * 2, r = wob(i, a); const X = x + (cx + Math.cos(a) * rx * r) * s, Y = y + (cy + Math.sin(a) * ry * r) * s; k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.closePath(); ctx.fill();
      } else {
        ctx.lineWidth = sh.w * s; ctx.beginPath(); sh.s.forEach(([a, b2], k) => k ? ctx.lineTo(x + a * s, y + b2 * s) : ctx.moveTo(x + a * s, y + b2 * s)); ctx.stroke();
      }
    });
    ctx.restore();
  }
  // gambar dicat: kertas + garis bunga aslinya + cat. pa = kepekatan cat (1 = penuh, 0,35 = tembus pandang)
  function painted(ctx, key, x, y, s, opt = {}) {
    const Pn = PAINT[key], F = opt.on || Pn.of;
    paper(ctx, x, y, s, opt);
    flower(ctx, F, x, y, s);
    alpha(ctx, opt.pa == null ? 1 : opt.pa, () => paintDraw(ctx, key, x, y, s, opt.col || Pn.col));
    if (opt.red) alpha(ctx, opt.red, () => uncovered(ctx, F, key, x, y, s, RED));
  }
  // garis bunga F yang TIDAK tertutup cat key (dihitung tepat dengan kanvas bayangan)
  const CACHE = {};
  function uncovered(ctx, F, key, x, y, s, color) {
    const id = F + key + Math.round(s) + color; let cv = CACHE[id];
    if (!cv) {
      const W = Math.ceil(s) + 4; cv = document.createElement("canvas"); cv.width = cv.height = W;
      const c = cv.getContext("2d"); flower(c, F, 0, 0, s, { color, lw: Math.max(5, s * 0.024) });
      c.globalCompositeOperation = "destination-out"; paintDraw(c, key, 0, 0, s, "#000"); CACHE[id] = cv;
    }
    ctx.drawImage(cv, x, y);
  }
  function holeBox(ctx, x, y, s, a = 1, color = ORANGE) {   // bingkai putus-putus di posisi lubang gambar D
    if (a <= 0) return; const [e, f, g, h] = HOLE;
    ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1); ctx.strokeStyle = color; ctx.lineWidth = Math.max(3, s * 0.014); ctx.setLineDash([s * 0.03, s * 0.022]);
    ctx.strokeRect(x + e * s, y + f * s, (g - e) * s, (h - f) * s); ctx.restore();
  }
  function inHole(ctx, F, x, y, s, a = 1) {   // garis bunga di dalam lubang, ditebalkan merah
    if (a <= 0) return; const [e, f, g, h] = HOLE;
    ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1); ctx.beginPath(); ctx.rect(x + e * s, y + f * s, (g - e) * s, (h - f) * s); ctx.clip();
    flower(ctx, F, x, y, s, { color: RED, lw: Math.max(5, s * 0.024) }); ctx.restore();
  }
  function label(ctx, s, x, y, size = 30, color = INK) { text(ctx, s, x, y, size, { align: "center", weight: 900, color }); }
  function chip(ctx, s, x, y, a = 1, color = GREEN) {   // catatan pasangan yang sudah ketemu
    alpha(ctx, a, () => { ctx.fillStyle = "#E3F5E8"; ctx.strokeStyle = color; ctx.lineWidth = 3; rr(ctx, x, y, 250, 58, 14); ctx.fill(); ctx.stroke();
      text(ctx, s, x + 125, y + 40, 30, { align: "center", weight: 900, color }); });
  }
  function dimmed(ctx, a, fn) { alpha(ctx, a, fn); }
  function flagDE(ctx, x, y, w) {   // bendera Jerman: hitam, merah, emas (atas ke bawah)
    const h = w * 0.6;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#000000"; ctx.fillRect(x, y, w, h / 3 + 0.5);
    ctx.fillStyle = "#DD0000"; ctx.fillRect(x, y + h / 3, w, h / 3 + 0.5);
    ctx.fillStyle = "#FFCE00"; ctx.fillRect(x, y + h * 2 / 3, w, h / 3);
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }
  function pencil(ctx, x, y, len, ang) {   // pensil kuning
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); const w = len * 0.13;
    ctx.fillStyle = "#F4C430"; ctx.strokeStyle = "#7A5C00"; ctx.lineWidth = 2; ctx.fillRect(0, -w / 2, len * 0.78, w); ctx.strokeRect(0, -w / 2, len * 0.78, w);
    ctx.fillStyle = "#F2C9A0"; ctx.beginPath(); ctx.moveTo(len * 0.78, -w / 2); ctx.lineTo(len, 0); ctx.lineTo(len * 0.78, w / 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = PENCIL; ctx.beginPath(); ctx.moveTo(len * 0.93, -w * 0.16); ctx.lineTo(len, 0); ctx.lineTo(len * 0.93, w * 0.16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#E58FA0"; ctx.fillRect(-len * 0.1, -w / 2, len * 0.1, w); ctx.restore();
  }
  function finger(ctx, x, y, s, col) {   // jari telunjuk dengan cat di ujungnya (ujung jari di x,y)
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.6); const w = s * 0.32;
    ctx.fillStyle = "#F0C29A"; ctx.strokeStyle = "#9A6A45"; ctx.lineWidth = 3; rr(ctx, -w / 2, 0, w, s, w / 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#F8DCC4"; rr(ctx, -w * 0.32, w * 0.15, w * 0.64, w * 0.7, w * 0.25); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, w * 0.15, w * 0.52, w * 0.32, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  // ---------- soal utuh: baris gambar asli dan baris gambar dicat ----------
  const GX = [110, 345, 580, 815], GS = 200;
  function gridOrig(ctx, y, opt = {}) {
    for (let i = 0; i < 4; i++) {
      const a = opt.a ? opt.a(i) : 1; if (a <= 0) continue;
      alpha(ctx, Math.min(1, a * 3), () => { paper(ctx, GX[i], y, GS); flower(ctx, i + 1, GX[i], y, GS, { u: opt.u ? opt.u(i) : 1 }); });
      alpha(ctx, opt.la ? opt.la(i) : 1, () => label(ctx, "Bunga " + (i + 1), GX[i] + GS / 2, y + GS + 40, 30));
    }
  }
  function gridPaint(ctx, y, opt = {}) {
    KEYS.forEach((k, i) => {
      const a = opt.a ? opt.a(i) : 1; if (a <= 0) return;
      alpha(ctx, a, () => { painted(ctx, k, GX[i], y, GS); label(ctx, k, GX[i] + GS / 2, y + GS + 42, 36); });
    });
  }
  function soal(ctx, b, l) {
    board(ctx);
    const ord = prog(["soal1", "soal2", "soal3", "soal4", "soal5", "soal6"], b, l);
    const RY = 185, PY = 495;
    text(ctx, "Gambar asli (pensil)", GX[0], 172, 24, { weight: 800, color: GRAYT });
    if (b.id === "soal1") {
      const t0 = at(b, "Dia membuat"), TB = atSeq(b, ["Bunga satu", "Bunga dua", "Bunga tiga", "Bunga empat"]);
      gridOrig(ctx, RY, { a: i => P(l, t0 + i * 0.9, 0.4), u: i => clamp((l - t0 - i * 0.9) / 1.6, 0, 1), la: i => P(l, TB[i], 0.4) });
      alpha(ctx, P(l, at(b, "Lars suka"), 0.6), () => { pencil(ctx, 1320, 470, 230, -0.5); hand(ctx, "Lars menggambar", 1450, 330, 46, { color: INK }); hand(ctx, "dengan pensil hitam", 1450, 390, 40, { color: GRAYT }); });
      return;
    }
    gridOrig(ctx, RY);
    if (b.id === "soal2") {
      const T = atSeq(b, ["Bunga satu", "Bunga dua", "Bunga tiga", "Bunga empat"]);
      const D = ["batang lurus, 3 kuncup", "rumput + batang melengkung", "2 batang melengkung", "kelopak seperti awan"];
      T.forEach((t, i) => {
        const a = P(l, t, 0.4), on = l >= t && (i === 3 || l < T[i + 1]);
        if (on) { ctx.save(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; rr(ctx, GX[i] - 10, RY - 10, GS + 20, GS + 20, 14); ctx.stroke(); ctx.restore(); }
        hand(ctx, (i + 1) + ". " + D[i], 1100, 300 + i * 95, 40, { color: on ? ORANGE : INK, align: "left", alpha: a });
      });
      return;
    }
    if (b.id === "soal3") {
      const cols = ["#6BBBC9", "#C0201E", "#A400D0", "#0A16F2"], a0 = P(l, at(b, "Carlotta"), 0.5);
      alpha(ctx, a0, () => { hand(ctx, "Carlotta mengecat", 1420, 300, 50, { color: INK }); hand(ctx, "dengan jarinya", 1420, 365, 42, { color: GRAYT }); });
      cols.forEach((c, i) => alpha(ctx, P(l, at(b, "memakai cat") + i * 0.3, 0.4), () => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(1200 + i * 125, 520, 52, 40, 0.2 * i, 0, Math.PI * 2); ctx.fill(); }));
      alpha(ctx, P(l, at(b, "dengan jarinya"), 0.5), () => finger(ctx, 1320 + Math.sin(l * 3) * 30, 640, 170, cols[1]));
      return;
    }
    text(ctx, "Gambar yang diperindah (dicat)", GX[0], 482, 24, { weight: 800, color: GRAYT });
    gridPaint(ctx, PY, { a: i => ord("soal4", () => P(l, at(b, "Namanya") + i * 0.5, 0.5)) });
    if (b.id === "soal4") {
      alpha(ctx, P(l, at(b, "tertutup cat"), 0.5), () => { hand(ctx, "banyak bagian", 1450, 330, 44, { color: INK }); hand(ctx, "tertutup cat", 1450, 390, 44, { color: INK }); });
      alpha(ctx, P(l, at(b, "diacak"), 0.5), () => hand(ctx, "urutannya diacak!", 1450, 520, 44, { color: ORANGE }));
      return;
    }
    // soal5, soal6: kotak pertanyaan
    answerPanel(ctx, 1100, 190, 720, 560, {}, P(l, 0.2, 0.5));
    if (b.id === "soal6") hand(ctx, "tanpa menebak!", 1460, 800, 40, { color: ORANGE, alpha: P(l, at(b, "tanpa"), 0.5) });
  }
  function answerPanel(ctx, x, y, w, h, filled, a = 1) {
    alpha(ctx, a, () => {
      card(ctx, x, y, w, h, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
      text(ctx, "PASANGKAN!", x + w / 2, y + 62, 36, { align: "center", weight: 900, color: C.accentDark });
      KEYS.forEach((k, i) => {
        const yy = y + 150 + i * 102, f = filled[k] || 0;
        painted(ctx, k, x + 60, yy - 42, 80);
        text(ctx, k, x + 185, yy + 14, 44, { weight: 900, color: INK });
        arrowR(ctx, x + 235, x + 320, yy, INK, 5);
        text(ctx, f > 0.5 ? "Bunga " + ANS[k] : "Bunga ?", x + 350, yy + 16, 44, { weight: 900, color: f > 0.5 ? GREEN : GRAYT });
      });
    });
  }
  function arrowR(ctx, x1, x2, y, color = INK, w = 5) { mline(ctx, [[x1, y], [x2, y]], 1, color, w, true); }

  // ---------- pemanasan: rumah ----------
  function rumah(ctx, b, l) {
    board(ctx);
    const ord = prog(["p1", "p2", "p3", "p4", "p5", "p6"], b, l);
    const X = 150, Y = 200, S = 440;
    paper(ctx, X, Y, S);
    const draw = ord("p1", () => clamp((l - at(b, "Kiko menggambar")) / 3.0, 0, 1));
    flower(ctx, "H", X, Y, S, { u: draw });
    if (b.id === "p1") { pencil(ctx, X + S * 0.4 + 40, Y + S * 0.2 - 60 + draw * 200, 200, 2.3); kiko(ctx, 1600, 600, 190, 0, { mood: "happy" }); }
    // sapuan cat (wipe dari kiri ke kanan)
    const wipe = ord("p2", () => P(l, at(b, "mengecat"), 1.6));
    let col = PAINT.H.col;
    if (b.id === "p6") { const k = Math.floor(clamp((l - at(b, "Warna catnya")) / 1.2, 0, 3)); col = ["#3DAA4A", "#C0201E", "#A400D0", "#3DAA4A"][Math.min(3, k)]; }
    if (wipe > 0) { ctx.save(); ctx.beginPath(); ctx.rect(X, Y, S * wipe, S); ctx.clip(); paintDraw(ctx, "H", X, Y, S, col); ctx.restore();
      if (b.id === "p2" && wipe < 1) finger(ctx, X + S * wipe, Y + S * 0.62, 170, col); }
    label(ctx, b.id === "p1" ? "Gambar Kiko" : "Gambar yang dicat", X + S / 2, Y + S + 50, 32);
    if (b.id === "p2") hand(ctx, "ujung atap masih kelihatan", 1000, 300, 42, { color: INK, alpha: P(l, at(b, "ujung atapnya"), 0.5) });
    // petunjuk 1
    const c1 = ord("p3", () => P(l, 0.3, 0.5));
    if (c1 > 0) {
      ring(ctx, X + 0.40 * S, Y + 0.25 * S, 90, 62, b.id === "p3" ? P(l, at(b, "Garis yang masih"), 0.8) : 1, ORANGE, 6);
      alpha(ctx, c1, () => { hand(ctx, "1. Garis yang kelihatan", 690, 290, 40, { color: ORANGE, align: "left" }); hand(ctx, "pasti ada di gambar asli.", 725, 340, 36, { color: INK, align: "left" }); });
    }
    const c2 = ord("p4", () => P(l, 0.3, 0.5));
    if (c2 > 0) {
      const hs = b.id === "p4" ? P(l, at(b, "masih putih"), 0.6) : 1;
      alpha(ctx, hs * 0.9, () => { ctx.save(); ctx.beginPath(); ctx.rect(X + 0.81 * S, Y + 0.08 * S, 0.17 * S, 0.88 * S); ctx.clip(); ctx.strokeStyle = "rgba(238,122,18,0.55)"; ctx.lineWidth = 3;
        for (let k = -20; k < 30; k++) { ctx.beginPath(); ctx.moveTo(X + 0.81 * S + k * 18, Y); ctx.lineTo(X + 0.81 * S + k * 18 + S, Y + S); ctx.stroke(); } ctx.restore(); });
      alpha(ctx, c2, () => { hand(ctx, "2. Bagian yang putih", 690, 440, 40, { color: ORANGE, align: "left" }); hand(ctx, "di gambar asli juga kosong.", 725, 490, 36, { color: INK, align: "left" }); });
    }
    if (b.id === "p5" || ord("p5") === 1) {
      const a = b.id === "p5" ? P(l, at(b, "rumah yang punya pohon"), 0.6) : 1, X2 = 1330, S2 = 400;
      alpha(ctx, a, () => {
        const ov = b.id === "p5" ? P(l, at(b, "dicat seperti tadi"), 0.8) : 1;
        painted(ctx, "H", X2, Y, S2, { on: "T", pa: 0.4 * ov, red: b.id === "p5" ? P(l, at(b, "pasti masih kelihatan"), 0.5) : 1 });
        label(ctx, "Rumah dengan pohon", X2 + S2 / 2, Y + S2 + 50, 30);
        cross(ctx, X2 + S2 - 20, Y + 30, 90, b.id === "p5" ? P(l, at(b, "bukan berasal"), 0.6) : 1, RED, 10);
      });
    }
    if (b.id === "p6") {
      hand(ctx, "warna cat tidak penting", 900, 640, 46, { color: RED, alpha: P(l, at(b, "tidak penting"), 0.5) });
      hand(ctx, "yang penting: garis dan bagian putih", 900, 720, 38, { color: GREEN, alpha: P(l, at(b, "Yang penting"), 0.5) });
    }
  }

  // ---------- menjawab ----------
  function jawab(ctx, b, l) {   // j0: semua gambar + jeda pikirkan dulu
    board(ctx);
    text(ctx, "Gambar asli", GX[0], 172, 24, { weight: 800, color: GRAYT }); gridOrig(ctx, 185);
    text(ctx, "Gambar yang dicat", GX[0], 482, 24, { weight: 800, color: GRAYT }); gridPaint(ctx, 495);
    thinkBadge(ctx, 1090, 330, 760, 160, l, b.dur, "Pasangan mana yang paling mudah?");
  }
  const RX = [720, 1000, 1280, 1560], RS = 240, RY2 = 250;
  function jawabD(ctx, b, l) {
    board(ctx);
    const ord = prog(["d1", "d2", "d3", "d4"], b, l);
    const DX = 90, DY = 210, DS = 420;
    painted(ctx, "D", DX, DY, DS); label(ctx, "Gambar D", DX + DS / 2, DY + DS + 50, 36);
    const r1 = ord("d1", () => P(l, at(b, "kotak putih"), 0.8));
    ring(ctx, DX + 0.475 * DS, DY + 0.455 * DS, 70, 70, r1, ORANGE, 6);
    const showR = ord("d2", () => P(l, at(b, "Ingat"), 0.6));
    if (showR <= 0) { hand(ctx, "hampir semua tertutup cat", 1180, 400, 46, { color: INK, alpha: P(l, at(b, "Hampir semua"), 0.5) });
      hand(ctx, "hanya kotak putih di tengah", 1180, 480, 46, { color: ORANGE, alpha: P(l, at(b, "Hanya ada"), 0.5) }); return; }
    const hb = ord("d2", () => P(l, at(b, "Jadi, kita"), 0.6));
    const T3 = b.id === "d3" ? atSeq(b, ["Bunga satu", "Bunga dua", "Bunga tiga", "pasti kelihatan"]) : null;
    for (let i = 0; i < 4; i++) {
      alpha(ctx, showR, () => { paper(ctx, RX[i] - RS / 2, RY2, RS); flower(ctx, i + 1, RX[i] - RS / 2, RY2, RS); label(ctx, "Bunga " + (i + 1), RX[i], RY2 + RS + 42, 30); });
      holeBox(ctx, RX[i] - RS / 2, RY2, RS, hb);
      if (i < 3) {
        const red = ord("d3", () => P(l, T3[i], 0.5));
        inHole(ctx, i + 1, RX[i] - RS / 2, RY2, RS, red);
        cross(ctx, RX[i] + RS / 2 - 26, RY2 + 26, 64, ord("d3", () => P(l, T3[3], 0.6)), RED, 9);
      }
    }
    holeBox(ctx, DX, DY, DS, hb);
    if (b.id === "d2") hand(ctx, "cari bunga yang tengahnya kosong", 1090, 690, 42, { color: ORANGE, alpha: hb });
    if (b.id === "d3") hand(ctx, "batangnya lewat di tengah", 940, 690, 42, { color: RED, alpha: P(l, T3[0], 0.5) });
    const ok = ord("d4", () => P(l, at(b, "Hanya Bunga empat"), 0.6));
    if (ok > 0) {
      ctx.save(); ctx.globalAlpha *= ok; ctx.strokeStyle = GREEN; ctx.lineWidth = 7; rr(ctx, RX[3] - RS / 2 - 12, RY2 - 12, RS + 24, RS + 24, 16); ctx.stroke(); ctx.restore();
      tick(ctx, RX[3] + RS / 2 - 26, RY2 + 30, 70, ok, GREEN, 10);
      hand(ctx, "kosong!", RX[3], RY2 - 25, 38, { color: GREEN, alpha: ok });
    }
    const fin = ord("d4", () => P(l, at(b, "Jadi, gambar D"), 0.5));
    if (fin > 0) hand(ctx, "D = Bunga 4", 1240, 740, 64, { color: GREEN, alpha: fin });
  }
  function jawabB(ctx, b, l) {
    board(ctx);
    const ord = prog(["b1", "b2", "b3"], b, l);
    const DX = 110, DY = 210, DS = 420;
    painted(ctx, "B", DX, DY, DS); label(ctx, "Gambar B", DX + DS / 2, DY + DS + 50, 36);
    ring(ctx, DX + 0.5 * DS, DY + 0.76 * DS, 50, 105, ord("b1", () => P(l, at(b, "garis lurus"), 0.8)), ORANGE, 6);
    chip(ctx, "D = Bunga 4", 1580, 165);
    const X3 = [600, 930, 1260], S3 = 280, Y3 = 250;
    const T2 = b.id === "b2" ? atSeq(b, ["Bunga dua dan Bunga tiga", "hampir semuanya putih", "pasti kelihatan"]) : [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      const F = i + 1, x = X3[i];
      if (F === 1) { paper(ctx, x, Y3, S3); flower(ctx, 1, x, Y3, S3); }
      else { const ov = ord("b2", () => P(l, T2[1], 0.8)); painted(ctx, "B", x, Y3, S3, { on: F, pa: 0.4 * ov, red: ord("b2", () => P(l, T2[2], 0.5)) });
        if (ov <= 0) { paper(ctx, x, Y3, S3); flower(ctx, F, x, Y3, S3); }
        cross(ctx, x + S3 - 26, Y3 + 26, 64, ord("b2", () => P(l, T2[2] + 0.6, 0.6)), RED, 9); }
      label(ctx, "Bunga " + F, x + S3 / 2, Y3 + S3 + 44, 30);
    }
    if (b.id === "b1") hand(ctx, "garis lurus, tegak", 1100, 690, 46, { color: ORANGE, alpha: P(l, at(b, "Garis itu tegak"), 0.5) });
    if (b.id === "b2") hand(ctx, "cat B tembus pandang: daunnya kelihatan", 1100, 690, 40, { color: RED, alpha: P(l, T2[2], 0.5) });
    if (b.id === "b3") {
      const a = P(l, at(b, "batang lurus"), 0.6);
      ring(ctx, X3[0] + 0.5 * S3, Y3 + 0.72 * S3, 40, 70, a, GREEN, 6);
      tick(ctx, X3[0] + S3 - 26, Y3 + 30, 70, a, GREEN, 10);
      hand(ctx, "B = Bunga 1", 1100, 720, 64, { color: GREEN, alpha: P(l, at(b, "Jadi, gambar B"), 0.5) });
    }
  }
  function jawabAC(ctx, b, l) {
    board(ctx);
    const ord = prog(["ac1", "ac2", "ac3"], b, l);
    const S = 300, Y = 190, AX = 100, CX = 430, F2X = 880, F3X = 1210;
    painted(ctx, "A", AX, Y, S); label(ctx, "Gambar A", AX + S / 2, Y + S + 44, 32);
    painted(ctx, "C", CX, Y, S); label(ctx, "Gambar C", CX + S / 2, Y + S + 44, 32);
    paper(ctx, F2X, Y, S); flower(ctx, 2, F2X, Y, S); label(ctx, "Bunga 2", F2X + S / 2, Y + S + 44, 32);
    paper(ctx, F3X, Y, S); flower(ctx, 3, F3X, Y, S); label(ctx, "Bunga 3", F3X + S / 2, Y + S + 44, 32);
    chip(ctx, "D = Bunga 4", 1580, 200); chip(ctx, "B = Bunga 1", 1580, 280);
    if (b.id === "ac1") {
      const a = P(l, at(b, "garis melengkung"), 0.8);
      ring(ctx, AX + 0.65 * S, Y + 0.36 * S, 50, 34, a, ORANGE, 5); ring(ctx, CX + 0.68 * S, Y + 0.30 * S, 50, 34, a, ORANGE, 5);
      hand(ctx, "keduanya punya lengkungan kecil → belum cukup", 760, 640, 40, { color: ORANGE, alpha: P(l, at(b, "belum cukup"), 0.5) });
    }
    const ac2 = ord("ac2", () => P(l, at(b, "kiri bawah masih putih"), 0.6));
    if (ac2 > 0) {
      ctx.save(); ctx.globalAlpha *= ac2; ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; ctx.setLineDash([12, 9]); ctx.strokeRect(CX + 0.03 * S, Y + 0.6 * S, 0.34 * S, 0.37 * S); ctx.restore();
      const ov = ord("ac2", () => P(l, at(b, "Padahal"), 0.6));
      if (ov > 0) {
        painted(ctx, "C", F2X, Y, S, { on: 2, pa: 0.4 * ov, red: ord("ac2", () => P(l, at(b, "rumputnya pasti"), 0.5)) });
        ring(ctx, F2X + 0.36 * S, Y + 0.70 * S, 80, 50, ord("ac2", () => P(l, at(b, "punya rumput"), 0.6)), RED, 5);
      }
      cross(ctx, F2X + S - 26, Y + 26, 64, ord("ac2", () => P(l, at(b, "bukan Bunga dua"), 0.6)), RED, 9);
      hand(ctx, "C bukan Bunga 2", 760, 660, 50, { color: RED, alpha: ord("ac2", () => P(l, at(b, "bukan Bunga dua"), 0.5)) });
    }
    if (b.id === "ac3") {
      const T = atSeq(b, ["gambar C adalah", "gambar A adalah", "lebar di kiri bawah"]);
      hand(ctx, "C = Bunga 3", 1360, 740, 52, { color: GREEN, alpha: P(l, T[0], 0.5) });
      hand(ctx, "A = Bunga 2", 980, 740, 52, { color: GREEN, alpha: P(l, T[1], 0.5) });
      tick(ctx, F3X + S - 26, Y + 30, 70, P(l, T[0], 0.6), GREEN, 10);
      ring(ctx, AX + 0.38 * S, Y + 0.74 * S, 130, 70, P(l, T[2], 0.8), GREEN, 6);
    }
  }
  // ---------- memeriksa: cat tembus pandang ----------
  function cek(ctx, b, l) {
    board(ctx);
    const ord = prog(["k1", "k2", "k3"], b, l);
    const S = 330, Y = 200, XS = [140, 555, 970, 1385];
    let pa = 1;
    if (b.id === "k1") pa = 1 - 0.62 * P(l, at(b, "tembus pandang"), 1.2);
    else if (b.id === "k2") pa = 0.38 + 0.62 * Math.max(0, Math.sin(clamp((l - at(b, "Bagian yang putih")) / 2.4, 0, 1) * Math.PI));
    else pa = 0.38;
    const pairT = b.id === "k1" ? at(b, "Lalu, kita") : 0;
    KEYS.forEach((k, i) => {
      const x = XS[i];
      painted(ctx, k, x, Y, S, { pa });
      text(ctx, k, x + S / 2, Y - 18, 40, { align: "center", weight: 900, color: INK });
      const la = ord("k1", () => P(l, pairT + i * 0.5, 0.5));
      alpha(ctx, la, () => label(ctx, k + " = Bunga " + ANS[k], x + S / 2, Y + S + 50, 36, ord("k3", () => P(l, at(b, "gambar " + k + " dengan"), 0.4)) > 0.5 ? GREEN : INK));
      const tk = ord("k2", () => P(l, at(b, "Semuanya cocok") + i * 0.25 - 0.4, 0.5));
      tick(ctx, x + S - 30, Y + 34, 70, tk, GREEN, 10);
    });
    if (b.id === "k1") hand(ctx, "cat tembus pandang, seperti kaca berwarna", 960, 680, 40, { color: ORANGE, alpha: P(l, at(b, "seperti kaca"), 0.5) });
    if (b.id === "k2") hand(ctx, "garis yang tertutup cat + garis yang kelihatan = cocok", 960, 680, 38, { color: GREEN, alpha: P(l, at(b, "kecuali"), 0.5) });
    if (b.id === "k3") ring(ctx, 960, 610, 860, 60, P(l, at(b, "Bunga empat"), 0.8), GREEN, 6);
  }

  // ---------- penutup ----------
  function langkah(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Pertama", "Kedua", "Ketiga"]);
    const S = ["Cari garis yang masih kelihatan.", "Bagian yang putih di gambar asli juga kosong.", "Mulai dari pasangan yang paling mudah."];
    S.forEach((s, i) => {
      const y = 165 + i * 190, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 165, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 82, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 100, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 98, 46, { weight: 900, color: INK, fit: 1080 });
        const ix = 1520, iy = y + 18, is = 130;
        if (i === 0) { painted(ctx, "B", ix, iy, is); ring(ctx, ix + 0.5 * is, iy + 0.76 * is, 22, 34, 1, ORANGE, 4); }
        if (i === 1) { painted(ctx, "D", ix, iy, is); holeBox(ctx, ix, iy, is, 1); }
        if (i === 2) { text(ctx, "D → B → C → A", ix + 65, iy + 82, 34, { align: "center", weight: 900, color: GREEN }); }
      });
    });
  }
  function face(ctx, x, y, s, mask) {   // wajah sederhana; mask = masker menutupi hidung dan mulut
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100);
    ctx.fillStyle = "#3A2A1E"; ctx.beginPath(); ctx.ellipse(0, -18, 46, 44, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#F0C29A"; ctx.strokeStyle = "#9A6A45"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(0, 2, 40, 48, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#3A2A1E"; ctx.beginPath(); ctx.ellipse(0, -36, 40, 16, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#1B120C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 15, -6, 4.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = "#3A2A1E"; ctx.lineWidth = 3; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 8, -20); ctx.lineTo(k * 22, -18); ctx.stroke(); }
    if (mask) { ctx.fillStyle = "#9ED3E8"; ctx.strokeStyle = "#4C8CA8"; ctx.lineWidth = 2; rr(ctx, -34, 4, 68, 38, 12); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-34, 12); ctx.lineTo(-42, 2); ctx.moveTo(34, 12); ctx.lineTo(42, 2); ctx.stroke();
      ctx.strokeStyle = "rgba(76,140,168,0.6)"; for (const yy of [16, 26]) { ctx.beginPath(); ctx.moveTo(-26, yy); ctx.lineTo(26, yy); ctx.stroke(); } }
    ctx.restore();
  }
  function pola(ctx, b, l) {
    board(ctx);
    const a1 = P(l, at(b, "petunjuk yang penting"), 0.5);
    hand(ctx, "warna cat? tidak penting", 520, 300, 46, { color: GRAYT, alpha: P(l, 0.3, 0.5) });
    mline(ctx, [[300, 288], [740, 288]], P(l, at(b, "tetapi kita"), 0.5), RED, 6);
    hand(ctx, "cari petunjuk yang penting", 520, 420, 52, { color: GREEN, alpha: a1 });
    const fa = P(l, at(b, "komputer"), 0.6);
    alpha(ctx, fa, () => {
      ctx.fillStyle = "#3B4652"; rr(ctx, 980, 190, 720, 470, 24); ctx.fill();
      ctx.fillStyle = "#EAF2F7"; rr(ctx, 1004, 214, 672, 410, 10); ctx.fill();
      face(ctx, 1340, 430, 270, true);
      ctx.fillStyle = "#3B4652"; ctx.fillRect(1300, 660, 80, 50); rr(ctx, 1200, 705, 280, 20, 10); ctx.fill();
    });
    const ra = P(l, at(b, "sebagian tertutup"), 0.7);
    ring(ctx, 1340, 405, 120, 40, ra, ORANGE, 5);
    hand(ctx, "mata dan rambut masih kelihatan", 1340, 790, 38, { color: ORANGE, alpha: ra });
    kiko(ctx, 520, 640, 170, 0, { mood: "happy" });
  }

  // ---------- versi tegak untuk Short (area 1000×700, x 460–1460) ----------
  const VX = [500, 740, 980, 1220], VS = 200;
  function soal_v(ctx, b, l) {
    board(ctx);
    const late = b.id === "soal1" ? P(l, at(b, "Kita sebut"), 0.6) : 1;
    for (let i = 0; i < 4; i++) { paper(ctx, VX[i], 175, VS); flower(ctx, i + 1, VX[i], 175, VS, { u: b.id === "soal1" ? clamp((l - 0.4 - i * 0.5) / 1.2, 0, 1) : 1 }); label(ctx, "Bunga " + (i + 1), VX[i] + VS / 2, 175 + VS + 40, 30); }
    KEYS.forEach((k, i) => alpha(ctx, late, () => { painted(ctx, k, VX[i], 480, VS); label(ctx, k, VX[i] + VS / 2, 480 + VS + 44, 38); }));
    if (b.id === "soal4") hand(ctx, "urutannya diacak", 960, 805, 40, { color: ORANGE });
  }
  function tanya_v(ctx, b, l) {
    board(ctx);
    for (let i = 0; i < 4; i++) { paper(ctx, VX[i], 175, VS); flower(ctx, i + 1, VX[i], 175, VS); label(ctx, "Bunga " + (i + 1), VX[i] + VS / 2, 175 + VS + 40, 30); }
    KEYS.forEach((k, i) => { painted(ctx, k, VX[i], 480, VS); label(ctx, k + " = ?", VX[i] + VS / 2, 480 + VS + 44, 38, ORANGE); });
  }
  function d_v(ctx, b, l) {
    board(ctx);
    const S = 320, Y = 190;
    painted(ctx, "D", 500, Y, S); holeBox(ctx, 500, Y, S, 1); label(ctx, "Gambar D", 500 + S / 2, Y + S + 44, 32);
    paper(ctx, 870, Y, S); flower(ctx, 4, 870, Y, S); holeBox(ctx, 870, Y, S, 1, GREEN); label(ctx, "Bunga 4", 870 + S / 2, Y + S + 44, 32);
    tick(ctx, 870 + S - 30, Y + 34, 70, 1, GREEN, 10);
    for (let i = 0; i < 3; i++) { const yy = 175 + i * 165, s = 140; paper(ctx, 1260, yy, s); flower(ctx, i + 1, 1260, yy, s); holeBox(ctx, 1260, yy, s, 1); inHole(ctx, i + 1, 1260, yy, s, 1); cross(ctx, 1260 + s + 40, yy + s / 2, 50, 1, RED, 7); }
    hand(ctx, "D = Bunga 4", 870, 790, 60, { color: GREEN });
  }
  function ac_v(ctx, b, l) {
    board(ctx);
    const S = 250;
    painted(ctx, "B", 520, 160, S); paper(ctx, 800, 160, S); flower(ctx, 1, 800, 160, S); ring(ctx, 800 + 0.5 * S, 160 + 0.72 * S, 34, 60, 1, GREEN, 5);
    hand(ctx, "B = Bunga 1", 1250, 300, 50, { color: GREEN });
    painted(ctx, "C", 520, 460, S); ctx.save(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; ctx.setLineDash([12, 9]); ctx.strokeRect(520 + 0.03 * S, 460 + 0.6 * S, 0.34 * S, 0.37 * S); ctx.restore();
    painted(ctx, "C", 800, 460, S, { on: 2, pa: 0.4, red: 1 }); cross(ctx, 800 + S - 24, 460 + 24, 56, 1, RED, 8);
    hand(ctx, "C bukan", 1250, 580, 46, { color: RED }); hand(ctx, "Bunga 2", 1250, 640, 46, { color: RED });
    label(ctx, "B", 520 - 30, 160 + S / 2 + 12, 40); label(ctx, "C", 520 - 30, 460 + S / 2 + 12, 40);
  }
  function cek_v(ctx, b, l) {
    board(ctx);
    const S = 215, XS = [490, 735, 980, 1225];
    const pa = 0.38 + 0.62 * Math.max(0, Math.sin(clamp(l / 3, 0, 1) * Math.PI));
    KEYS.forEach((k, i) => { painted(ctx, k, XS[i], 250, S, { pa }); label(ctx, k, XS[i] + S / 2, 228, 40);
      label(ctx, "Bunga " + ANS[k], XS[i] + S / 2, 250 + S + 50, 34, GREEN); tick(ctx, XS[i] + S - 24, 250 + 28, 54, 1, GREEN, 8); });
    hand(ctx, "semuanya cocok!", 960, 690, 60, { color: GREEN });
  }

  Object.assign(K.SCENES, {
    soal, rumah, jawab, jawabD, jawabB, jawabAC, cek, langkah, pola, soal_v, tanya_v, d_v, ac_v, cek_v,
    buka(ctx, b, l) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "lomba"), 0.8) : 1;
      [880, 1110, 1340, 1570].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v }); });
      if (!first) hand(ctx, "pelan-pelan, satu langkah demi satu langkah", 1230, 770, 40, { alpha: P(l, at(b, "pelan"), 0.6) });
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
      if (au > 0) ring(ctx, 1170, 300 + 2 * 92 - 14, 200, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
      paper(ctx, 560, 300, 170); flower(ctx, 4, 560, 300, 170);
      painted(ctx, "D", 760, 300, 170, { pa: 0.4 });
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 640, 800, 50, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK, fit: 1000 });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Mencari petunjuk di gambar yang tertutup cat", 960, 500, 38, { align: "center", weight: 800, color: ORANGE, fit: 1000 });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
