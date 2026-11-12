/* B09 Pembahasan Soal Bebras 2024-LT-01 "Peralatan Makan di Rak" (Lituania), kategori SiKecil.
   Gaya papan tulis putih dengan coretan spidol (sama dengan B01–B04) + simulasi:
   robot mengikuti gambar langkah mangkuk → teko bawah ⇄ teko atas → cangkir, dan meletakkan benda di rak.
   Setiap benda selalu diberi label tulisan. Papan: x 52–1868, y 130–830. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F7FD1",
        FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Peralatan Makan di Rak", tahun: "2024", negara: "Lituania", kode: "2024-LT-01" };
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
  // ---------- pembuka dan penutup ----------
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

  function flagLT(ctx, x, y, w) {   // bendera Lituania: kuning, hijau, merah
    const h = w * 0.6;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    [["#FDB913", 0], ["#006A44", 1], ["#C1272D", 2]].forEach(([c, i]) => { ctx.fillStyle = c; ctx.fillRect(x, y + i * h / 3, w, h / 3 + 0.5); });
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  // ---------- peralatan makan (kuning bertotol, digambar ulang) ----------
  const YEL = "#F6C431", YEL2 = "#D99A12", DOT = "#5A4214";
  const NAMA = { m: "mangkuk", t: "teko", c: "cangkir" };
  function dots(ctx, pts, s) { ctx.fillStyle = DOT; pts.forEach(([x, y]) => { ctx.beginPath(); ctx.ellipse(x * s, y * s, s * 0.035, s * 0.022, 0.6, 0, Math.PI * 2); ctx.fill(); }); }
  // cx, cy = pusat benda; s = ukuran (lebar ±s); opt.label: tulis nama di bawah
  function dish(ctx, kind, cx, cy, s, opt = {}) {
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.save(); ctx.translate(cx, cy);
    ctx.strokeStyle = "#3A2A0A"; ctx.lineWidth = Math.max(2, s * 0.028); ctx.lineJoin = "round";
    if (kind === "m") {
      ctx.fillStyle = YEL; ctx.beginPath(); ctx.moveTo(-s * 0.5, -s * 0.12); ctx.bezierCurveTo(-s * 0.46, s * 0.26, s * 0.46, s * 0.26, s * 0.5, -s * 0.12); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = YEL2; ctx.beginPath(); ctx.ellipse(0, -s * 0.12, s * 0.5, s * 0.1, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = YEL; rr(ctx, -s * 0.16, s * 0.12, s * 0.32, s * 0.08, s * 0.03); ctx.fill(); ctx.stroke();
      dots(ctx, [[-0.3, 0], [-0.1, 0.06], [0.12, 0.02], [0.3, -0.01], [0, 0.12], [-0.2, 0.1], [0.22, 0.1]], s);
    } else if (kind === "t") {
      ctx.fillStyle = YEL;
      ctx.beginPath(); ctx.moveTo(-s * 0.26, s * 0.02); ctx.quadraticCurveTo(-s * 0.42, -s * 0.06, -s * 0.5, -s * 0.24); ctx.lineTo(-s * 0.42, -s * 0.24); ctx.quadraticCurveTo(-s * 0.36, -s * 0.12, -s * 0.24, -s * 0.1); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(s * 0.3, -s * 0.02, s * 0.15, -Math.PI * 0.5, Math.PI * 0.5); ctx.lineWidth = Math.max(4, s * 0.07); ctx.stroke();
      ctx.strokeStyle = YEL; ctx.lineWidth = Math.max(2, s * 0.04); ctx.stroke();
      ctx.strokeStyle = "#3A2A0A"; ctx.lineWidth = Math.max(2, s * 0.028);
      ctx.beginPath(); ctx.ellipse(0, s * 0.02, s * 0.32, s * 0.26, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = YEL2; ctx.beginPath(); ctx.ellipse(0, -s * 0.22, s * 0.18, s * 0.05, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = YEL; ctx.beginPath(); ctx.arc(0, -s * 0.3, s * 0.06, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      dots(ctx, [[-0.18, -0.06], [0.04, -0.1], [0.2, 0], [-0.06, 0.08], [0.12, 0.16], [-0.2, 0.14], [0, 0.22]], s);
    } else {
      ctx.fillStyle = YEL;
      ctx.beginPath(); ctx.arc(s * 0.22, s * 0.0, s * 0.13, -Math.PI * 0.5, Math.PI * 0.5); ctx.lineWidth = Math.max(4, s * 0.07); ctx.stroke();
      ctx.strokeStyle = YEL; ctx.lineWidth = Math.max(2, s * 0.04); ctx.stroke();
      ctx.strokeStyle = "#3A2A0A"; ctx.lineWidth = Math.max(2, s * 0.028);
      rr(ctx, -s * 0.24, -s * 0.28, s * 0.46, s * 0.56, s * 0.06); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#4A3510"; ctx.beginPath(); ctx.ellipse(-s * 0.01, -s * 0.24, s * 0.19, s * 0.035, 0, 0, Math.PI * 2); ctx.fill();
      dots(ctx, [[-0.14, -0.1], [0.06, -0.14], [0.1, 0.04], [-0.08, 0.08], [0.02, 0.2], [-0.16, 0.2]], s);
    }
    ctx.restore();
    if (opt.label) { const ls = opt.ls || Math.max(22, s * 0.24); text(ctx, opt.label === true ? NAMA[kind] : opt.label, cx, cy + s * 0.32 + ls * 1.05, ls, { align: "center", weight: 800, color: opt.lc || INK }); }
    ctx.restore();
  }
  // robot penyusun (abu-abu, berbeda dari Kiko); cx, cy = pusat badan
  function robot(ctx, cx, cy, s, opt = {}) {
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.translate(cx, cy); const bob = opt.t != null ? Math.sin(opt.t * 4) * s * 0.02 : 0; ctx.translate(0, bob);
    ctx.strokeStyle = "#39434C"; ctx.lineWidth = Math.max(2, s * 0.025);
    ctx.fillStyle = "rgba(0,0,0,0.10)"; ctx.beginPath(); ctx.ellipse(0, s * 0.62, s * 0.36, s * 0.06, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#7E8C97"; rr(ctx, -s * 0.2, s * 0.36, s * 0.12, s * 0.24, s * 0.03); ctx.fill(); rr(ctx, s * 0.08, s * 0.36, s * 0.12, s * 0.24, s * 0.03); ctx.fill();
    ctx.strokeStyle = "#7E8C97"; ctx.lineCap = "round"; ctx.lineWidth = s * 0.08;
    ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.02); ctx.lineTo(-s * 0.44, opt.wave ? -s * 0.34 + Math.sin(opt.wave * 6) * s * 0.06 : s * 0.24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.3, -s * 0.02); ctx.lineTo(s * 0.44, s * 0.24); ctx.stroke();
    ctx.strokeStyle = "#39434C"; ctx.lineWidth = Math.max(2, s * 0.025);
    ctx.fillStyle = "#B7C3CC"; rr(ctx, -s * 0.3, -s * 0.1, s * 0.6, s * 0.48, s * 0.08); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#F6C431"; ctx.beginPath(); ctx.arc(0, s * 0.14, s * 0.07, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#CFD8DE"; rr(ctx, -s * 0.26, -s * 0.5, s * 0.52, s * 0.36, s * 0.08); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.5); ctx.lineTo(0, -s * 0.62); ctx.stroke();
    ctx.fillStyle = "#E8618C"; ctx.beginPath(); ctx.arc(0, -s * 0.65, s * 0.045, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2B3440"; rr(ctx, -s * 0.19, -s * 0.43, s * 0.38, s * 0.2, s * 0.05); ctx.fill();
    ctx.fillStyle = "#6FE3FF"; ctx.beginPath(); ctx.arc(-s * 0.08, -s * 0.33, s * 0.035, 0, Math.PI * 2); ctx.arc(s * 0.08, -s * 0.33, s * 0.035, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // rak kayu (satu papan): x, y = kiri atas; w lebar; h tinggi
  function shelfRow(ctx, x, y, w, h) {
    ctx.save(); ctx.fillStyle = "#FFF3DC"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#C98A3A"; ctx.fillRect(x, y + h - 14, w, 14); ctx.fillRect(x - 12, y - 6, 12, h + 6); ctx.fillRect(x + w, y - 6, 12, h + 6);
    ctx.fillStyle = "#A86E26"; ctx.fillRect(x - 12, y - 10, w + 24, 10); ctx.restore();
  }

  // ---------- gambar langkah robot (diagram panah) ----------
  // koordinat dasar 1000 × 560; T(...) memindahkan ke papan
  const NODE = { m: [90, 330], tb: [380, 470], ta: [700, 110], c: [960, 380] };
  const NK = { m: "m", tb: "t", ta: "t", c: "c" };
  const NL = { m: "mangkuk", tb: "teko bawah", ta: "teko atas", c: "cangkir" };
  function bez(p0, p1, p2, n = 24) { const o = []; for (let i = 0; i <= n; i++) { const s = i / n; o.push([(1 - s) * (1 - s) * p0[0] + 2 * (1 - s) * s * p1[0] + s * s * p2[0], (1 - s) * (1 - s) * p0[1] + 2 * (1 - s) * s * p1[1] + s * s * p2[1]]); } return o; }
  const EDGE = {   // jalur panah (dasar), dari tepi benda ke tepi benda
    "m-tb": bez([100, 410], [140, 500], [290, 490]),
    "tb-ta": bez([460, 450], [620, 380], [690, 205]),
    "ta-tb": bez([600, 130], [450, 220], [370, 385]),
    "ta-c": bez([790, 120], [920, 160], [950, 285]),
  };
  function ptAt(pts, u) {
    const L = plen(pts) * clamp(u, 0, 1); let s = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (s + d >= L) { const k = d ? (L - s) / d : 0; return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; } s += d; }
    return pts[pts.length - 1];
  }
  // g = {ox, oy, sc}; st = {items:0..1, arrows:{edge:u}, hi:{edge:color}, ring:{node:u}, label:0..1, start:0..1, tok:{x,y} dasar}
  function diagram(ctx, g, st = {}) {
    const T = p => [g.ox + p[0] * g.sc, g.oy + p[1] * g.sc];
    const S = 150 * g.sc, ls = Math.max(24, 30 * g.sc);
    // tanda mulai
    alpha(ctx, st.start ?? 1, () => {
      const a = T([-60, 250]), b2 = T([30, 300]);
      mline(ctx, [a, b2], 1, GREEN, Math.max(5, 7 * g.sc), true);
      hand(ctx, "MULAI", a[0] + 4, a[1] - 16 * g.sc, Math.max(26, 34 * g.sc), { color: GREEN });
    });
    Object.entries(EDGE).forEach(([k, pts]) => {
      const u = st.arrows ? (st.arrows[k] ?? 1) : 1; if (u <= 0) return;
      const col = (st.hi && st.hi[k]) || INK;
      mline(ctx, pts.map(T), u, col, Math.max(5, (col === INK ? 6 : 9) * g.sc), true);
    });
    if (st.tok) { const [x, y] = T(st.tok); ctx.save(); ctx.fillStyle = "rgba(47,127,209,0.14)"; ctx.strokeStyle = BLUE; ctx.lineWidth = Math.max(4, 6 * g.sc); ctx.beginPath(); ctx.arc(x, y, 80 * g.sc, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore(); }
    Object.entries(NODE).forEach(([k, p]) => {
      const a = st.items != null ? (typeof st.items === "object" ? (st.items[k] ?? 1) : st.items) : 1; if (a <= 0) return;
      const [x, y] = T(p);
      if (st.glow && st.glow[k] > 0) alpha(ctx, st.glow[k], () => { ctx.save(); ctx.fillStyle = "#FFF0C2"; ctx.beginPath(); ctx.arc(x, y + 6 * g.sc, 98 * g.sc, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
      dish(ctx, NK[k], x, y, S, { alpha: a });
      alpha(ctx, a * (st.label ?? 1), () => { const ly = y + S * 0.32 + ls * 1.25; ctx.save(); ctx.font = `800 ${ls}px ${K.FONT}`; const w = ctx.measureText(NL[k]).width; ctx.fillStyle = "rgba(255,255,255,0.85)"; rr(ctx, x - w / 2 - 6, ly - ls * 0.9, w + 12, ls * 1.15, 6); ctx.fill(); ctx.restore(); text(ctx, NL[k], x, ly, ls, { align: "center", weight: 800, color: (st.lcol && st.lcol[k]) || INK }); });
      if (st.ring && st.ring[k] > 0) ring(ctx, x, y + 14 * g.sc, 110 * g.sc, 112 * g.sc, st.ring[k], ORANGE, Math.max(5, 7 * g.sc));
    });
    if (st.tok) { const [x, y] = T(st.tok); robot(ctx, x + 88 * g.sc, y - 78 * g.sc, 100 * g.sc, {}); }
  }
  // perjalanan robot: daftar langkah {e: edge, t: waktu mulai}; mengembalikan posisi token (dasar) dan simpul terakhir
  function travel(steps, l, start = "m", dur = 0.9) {
    let pos = NODE[start], node = start;
    for (const s of steps) {
      if (s.u == null) s.u = 0;
      if (s.u <= 0) break;
      const [a, b] = s.e.split("-");
      if (s.u < 1) { pos = ptAt(EDGE[s.e], s.u); node = null; break; }
      pos = NODE[b]; node = b;
    }
    return { pos, node };
  }

  // ---------- adegan soal ----------
  function soal(ctx, b, l) {
    board(ctx);
    const ra = P(l, at(b, "sebuah robot"), 0.6);
    robot(ctx, 300, 470, 300, { alpha: ra, t: l });
    hand(ctx, "robot", 300, 790, 44, { color: BLUE, alpha: ra });
    const sa = P(l, at(b, "di rak"), 0.6);
    alpha(ctx, sa, () => { shelfRow(ctx, 640, 600, 1120, 170); hand(ctx, "rak", 1200, 820, 40, { color: C.ink2 }); });
    const T = atSeq(b, ["mangkuk", "teko", "cangkir"], "yaitu");
    [["m", 800], ["t", 1200], ["c", 1600]].forEach(([k, x], i) => dish(ctx, k, x, 330, 230, { alpha: P(l, T[i], 0.5), label: true, ls: 44 }));
    alpha(ctx, P(l, at(b, "tiga macam"), 0.6), () => hand(ctx, "3 macam peralatan makan", 1200, 200, 44, { color: ORANGE }));
  }
  const PETA = ["soal2", "soal3", "j0"];
  function peta(ctx, b, l) {
    board(ctx);
    const o = prog(PETA, b, l);
    const g = { ox: 300, oy: 200, sc: 1.02 };
    const st = {
      start: o("soal2", () => P(l, at(b, "mulai dari mangkuk"), 0.6)),
      items: o("soal2", () => P(l, 0.1, 0.6)),
      arrows: {},
      hi: {}, ring: {}, glow: {},
    };
    const aT = o("soal2", () => P(l, at(b, "Setiap panah"), 1.4));
    Object.keys(EDGE).forEach((k, i) => st.arrows[k] = clamp(aT * 4 - i, 0, 1));
    if (b.id === "soal2") st.glow.m = P(l, at(b, "mulai dari mangkuk"), 0.5);
    if (b.id === "soal3") {
      st.ring.tb = P(l, at(b, "Ada teko bawah"), 0.7); st.ring.ta = P(l, at(b, "ada teko atas"), 0.7);
      if (l > at(b, "panah yang pergi")) st.hi["tb-ta"] = ORANGE;
      if (l > at(b, "panah yang kembali")) st.hi["ta-tb"] = BLUE;
      alpha(ctx, P(l, at(b, "panah yang pergi"), 0.5), () => hand(ctx, "pergi", g.ox + 640 * g.sc, g.oy + 370 * g.sc, 40, { color: ORANGE }));
      alpha(ctx, P(l, at(b, "panah yang kembali"), 0.5), () => hand(ctx, "kembali", g.ox + 380 * g.sc, g.oy + 200 * g.sc, 40, { color: BLUE }));
    }
    if (b.id === "j0") { st.glow.m = 1; }
    diagram(ctx, g, st);
    robot(ctx, 1640, 560, 260, { t: l });
    if (b.id === "soal2") alpha(ctx, P(l, at(b, "Setiap panah"), 0.6), () => hand(ctx, "panah = benda berikutnya", 1500, 210, 40, { color: ORANGE }));
    if (b.id === "j0") thinkBadge(ctx, 1290, 160, 560, 130, l, b.dur, "Sesudah mangkuk, boleh apa?");
  }

  // ---------- menjalankan robot (j1–j4) ----------
  const JALAN = ["j1", "j2", "j3", "j4"];
  const SEQ = ["m", "t", "t", "t", "t", "c"];
  function jalanState(b, l) {
    const o = prog(JALAN, b, l);
    const steps = [
      { e: "m-tb", u: o("j1", () => P(l, at(b, "ke teko bawah"), 1.0)) },
      { e: "tb-ta", u: o("j2", () => P(l, at(b, "menuju teko atas"), 1.0)) },
      { e: "ta-tb", u: o("j3", () => P(l, at(b, "Kalau robot kembali"), 1.0)) },
      { e: "tb-ta", u: o("j3", () => P(l, at(b, "lalu teko lagi"), 1.0)) },
      { e: "ta-c", u: o("j3", () => P(l, at(b, "pergi ke cangkir"), 1.0)) },
    ];
    const put = [
      o("j1", () => P(l, at(b, "mangkuk diletakkan"), 0.5)),
      o("j1", () => P(l, at(b, "pasti teko"), 0.5)),
      o("j2", () => P(l, at(b, "teko lagi"), 0.5)),
      o("j3", () => P(l, at(b, "meletakkan teko lagi"), 0.5)),
      o("j3", () => P(l, at(b, "lalu teko lagi"), 0.5)),
      o("j3", () => P(l, at(b, "meletakkan cangkir"), 0.5)),
    ];
    return { o, steps, put, tokA: o("j1", () => P(l, at(b, "Robot mulai"), 0.5)) };
  }
  function jalan(ctx, b, l) {
    board(ctx);
    const S = jalanState(b, l), o = S.o;
    const g = { ox: 190, oy: 170, sc: 0.78 };
    const tr = travel(S.steps, l);
    const st = { hi: {}, glow: {}, lcol: {} };
    if (b.id === "j1") st.hi["m-tb"] = l > at(b, "hanya ada satu panah") ? ORANGE : undefined;
    if (b.id === "j2" && l > at(b, "ada dua panah") && l < at(b, "ada dua panah") + 99) { const pul = 0.5 + 0.5 * Math.sin(l * 6); if (pul > 0.3) { st.hi["ta-tb"] = BLUE; st.hi["ta-c"] = BLUE; } }
    if (b.id === "j4") { st.hi = {}; }
    if (S.tokA > 0) st.tok = tr.pos;
    diagram(ctx, g, st);
    // rak contoh di bawah
    const RX = 160, RY = 640, RW = 1600, RH = 160;
    shelfRow(ctx, RX, RY, RW, RH);
    text(ctx, "rak", RX + RW - 60, RY - 18, 30, { weight: 800, color: C.ink2 });
    SEQ.forEach((k, i) => { if (S.put[i] > 0) dish(ctx, k, RX + 120 + i * 170, RY + 78, 120, { alpha: S.put[i], label: true, ls: 24 }); });
    if (b.id === "j3") alpha(ctx, P(l, at(b, "tugasnya selesai"), 0.5), () => { hand(ctx, "SELESAI", 1500, 460, 56, { color: GREEN }); hand(ctx, "tidak ada panah dari cangkir", 1500, 520, 32, { color: C.ink2 }); });
    if (b.id === "j2" && l > at(b, "ada dua panah")) alpha(ctx, P(l, at(b, "ada dua panah"), 0.5), () => { hand(ctx, "2 pilihan:", 1500, 300, 44, { color: BLUE }); hand(ctx, "kembali ke teko bawah,", 1500, 360, 36, { color: BLUE }); hand(ctx, "atau pergi ke cangkir", 1500, 410, 36, { color: BLUE }); });
    if (b.id === "j4") {
      const r = atSeq(b, ["satu mangkuk", "beberapa teko", "satu cangkir"]);
      const grp = [[0, 0], [1, 4], [5, 5]];
      grp.forEach(([a, z], i) => alpha(ctx, P(l, r[i], 0.5), () => { ctx.save(); ctx.strokeStyle = [ORANGE, BLUE, ORANGE][i]; ctx.lineWidth = 6; rr(ctx, RX + 120 + a * 170 - 78, RY - 2, (z - a) * 170 + 156, RH - 10, 18); ctx.stroke(); ctx.restore();
        hand(ctx, ["1 mangkuk", "beberapa teko", "1 cangkir"][i], RX + 120 + (a + z) / 2 * 170, RY - 22, 32, { color: [ORANGE, BLUE, ORANGE][i] }); }));
      const nt = at(b, "Tidak ada panah");
      alpha(ctx, P(l, nt, 0.6), () => {
        card(ctx, 1080, 180, 720, 300, { fill: "#FDF0EF", stroke: RED, lw: 4, r: 20 });
        para(ctx, "Tidak ada panah yang kembali ke mangkuk.", 1440, 260, 42, 640, { align: "center", weight: 900, color: RED });
        para(ctx, "Mangkuk hanya ada 1 kali, di paling depan.", 1440, 390, 36, 640, { align: "center", weight: 800, color: INK });
      });
    }
  }

  // ---------- rak pilihan jawaban ----------
  const OPT = ["mttttmc", "mttmc", "mttttc", "mttttttmc"];
  const RAK = ["soal4", "p1", "p2", "p3"];
  const RY0 = 160, RRH = 162, IX0 = 300, IDX = 104, IS = 92;
  function rak(ctx, b, l) {
    board(ctx);
    const o = prog(RAK, b, l);
    const show = b.id === "soal4" && !b.src_text ? [0, 1, 2, 3].map(i => P(l, at(b, "empat pilihan") + i * 0.4, 0.5)) : [1, 1, 1, 1];
    const live = { p1: [0], p2: [1, 3], p3: [2] }[b.id] || [];
    const X = {
      0: o("p1", () => P(l, at(b, "mangkuk lagi"), 0.5)),
      1: o("p2", () => P(l, at(b, "Rak B dan rak D"), 0.5)),
      3: o("p2", () => P(l, at(b, "mangkuk kedua"), 0.5)),
    };
    const SK = {
      0: o("p1", () => P(l, at(b, "Jadi, rak A"), 0.5)),
      1: o("p2", () => P(l, at(b, "Jadi, rak B"), 0.5)),
      3: o("p2", () => P(l, at(b, "dan rak D juga salah"), 0.5)),
    };
    const ticks = b.id === "p3" ? atSeq(b, ["dari mangkuk", "ke teko bawah", "ke teko atas", "ke teko bawah", "ke teko atas", "lalu ke cangkir"]) : null;
    const ringC = o("p3", () => P(l, at(b, "adalah C"), 0.8));
    for (let i = 0; i < 4; i++) {
      if (show[i] <= 0) continue;
      const y0 = RY0 + i * RRH;
      ctx.save(); ctx.globalAlpha *= show[i];
      shelfRow(ctx, 260, y0 + 8, 1000, RRH - 16);
      if (live.includes(i)) { ctx.save(); ctx.strokeStyle = "#F2B134"; ctx.lineWidth = 6; rr(ctx, 120, y0, 1160, RRH - 4, 16); ctx.stroke(); ctx.restore(); }
      const dim = SK[i] ? 1 - 0.45 * SK[i] : 1;
      ctx.save(); ctx.globalAlpha *= dim;
      ctx.fillStyle = i === 2 && ringC > 0.5 ? GREEN : C.kiko; rr(ctx, 140, y0 + 28, 90, 96, 14); ctx.fill();
      text(ctx, "ABCD"[i], 185, y0 + 96, 60, { align: "center", weight: 900, color: "#fff" });
      [...OPT[i]].forEach((k, j) => dish(ctx, k, IX0 + j * IDX, y0 + 76, IS, {}));
      ctx.restore();
      if (X[i] > 0) { const j = OPT[i].lastIndexOf("m"); cross(ctx, IX0 + j * IDX, y0 + 72, 86, X[i], RED, 9); }
      if (SK[i] > 0) mline(ctx, [[130, y0 + 76], [240, y0 + 76]], SK[i], RED, 9);
      if (i === 2 && ticks) [...OPT[2]].forEach((k, j) => { const u = P(l, ticks[j], 0.4); if (u > 0) tick(ctx, IX0 + j * IDX + 30, y0 + 22, 46, u, GREEN, 8); });
      if (i === 2 && ringC > 0) ring(ctx, 185, y0 + 76, 72, 66, ringC, GREEN, 7);
      ctx.restore();
    }
    if (b.id === "soal4") {
      alpha(ctx, P(l, 0.3, 0.6), () => {
        card(ctx, 1320, 220, 500, 420, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
        text(ctx, "PERTANYAAN", 1570, 290, 32, { align: "center", weight: 900, color: C.accentDark });
        para(ctx, "Rak manakah yang tersusun dengan tepat?", 1570, 380, 44, 440, { align: "center", weight: 900, color: INK });
      });
      return;
    }
    // gambar langkah kecil sebagai pegangan
    const g = { ox: 1370, oy: 200, sc: 0.42 };
    const st = { label: 0, hi: {} };
    if (b.id === "p3") {
      const steps = [["m-tb", 1], ["tb-ta", 2], ["ta-tb", 3], ["tb-ta", 4], ["ta-c", 5]].map(([e, k]) => ({ e, u: P(l, ticks[k] - 0.5, 0.5) }));
      st.tok = travel(steps, l).pos;
    }
    card(ctx, 1320, 150, 520, 330, { fill: "#FFFFFF", stroke: "#C9D2D8", lw: 3, r: 20 });
    diagram(ctx, g, st);
    const R = { p1: [["tidak ada panah", "dari teko ke mangkuk"], "Padahal", RED], p2: [["mangkuk kedua", "tidak boleh ada"], "mangkuk kedua", RED], p3: [["semua langkah", "mengikuti panah!"], "Semua langkahnya", GREEN] }[b.id];
    if (R) alpha(ctx, P(l, at(b, R[1]), 0.6), () => R[0].forEach((s, k) => hand(ctx, s, 1580, 580 + k * 60, 42, { color: R[2] })));
  }

  // ---------- pemanasan ----------
  function icon(ctx, k, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (k === "bangun") { ctx.fillStyle = "#FBE7A1"; ctx.beginPath(); ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -s * 0.26); ctx.lineTo(0, 0); ctx.lineTo(s * 0.18, s * 0.1); ctx.stroke();
      for (const d of [-1, 1]) { ctx.beginPath(); ctx.arc(d * s * 0.32, -s * 0.4, s * 0.12, 0, Math.PI * 2); ctx.fillStyle = "#F2B134"; ctx.fill(); ctx.stroke(); } }
    if (k === "mandi") { ctx.fillStyle = "#9FD3F2"; for (const [dx, dy] of [[-0.2, -0.1], [0.15, -0.25], [0.05, 0.2], [-0.25, 0.3], [0.3, 0.12]]) { ctx.beginPath(); ctx.moveTo(dx * s, dy * s - s * 0.14); ctx.quadraticCurveTo(dx * s + s * 0.1, dy * s + s * 0.02, dx * s, dy * s + s * 0.06); ctx.quadraticCurveTo(dx * s - s * 0.1, dy * s + s * 0.02, dx * s, dy * s - s * 0.14); ctx.fill(); ctx.stroke(); } }
    if (k === "sarapan") { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.ellipse(0, s * 0.12, s * 0.46, s * 0.16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#F7F3E8"; ctx.beginPath(); ctx.arc(0, s * 0.06, s * 0.24, Math.PI, 0); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#F2B134"; ctx.beginPath(); ctx.ellipse(s * 0.2, -s * 0.02, s * 0.1, s * 0.06, 0, 0, Math.PI * 2); ctx.fill(); }
    if (k === "berangkat") { ctx.fillStyle = "#E8618C"; rr(ctx, -s * 0.3, -s * 0.28, s * 0.6, s * 0.66, s * 0.1); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -s * 0.28, s * 0.14, Math.PI, 0); ctx.stroke(); ctx.fillStyle = "#FFFFFF"; rr(ctx, -s * 0.18, s * 0.02, s * 0.36, s * 0.16, s * 0.04); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  }
  function stick(ctx, pose, x, y, s) {   // orang lidi: lompat, tepuk, duduk
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const hy = pose === "duduk" ? -s * 0.2 : pose === "lompat" ? -s * 0.5 : -s * 0.42;
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(0, hy, s * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    const sy = hy + s * 0.1, hip = sy + s * 0.32;
    ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(0, hip); ctx.stroke();
    if (pose === "lompat") { ctx.beginPath(); ctx.moveTo(-s * 0.22, sy - s * 0.12); ctx.lineTo(0, sy + s * 0.06); ctx.lineTo(s * 0.22, sy - s * 0.12); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * 0.18, hip + s * 0.22); ctx.lineTo(0, hip); ctx.lineTo(s * 0.18, hip + s * 0.22); ctx.stroke();
      ctx.strokeStyle = "#9AA6AE"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-s * 0.2, s * 0.32); ctx.lineTo(s * 0.2, s * 0.32); ctx.stroke(); }
    if (pose === "tepuk") { ctx.beginPath(); ctx.moveTo(-s * 0.02, sy - s * 0.2); ctx.lineTo(-s * 0.14, sy + s * 0.06); ctx.lineTo(0, sy + s * 0.08); ctx.moveTo(s * 0.02, sy - s * 0.2); ctx.lineTo(s * 0.14, sy + s * 0.06); ctx.lineTo(0, sy + s * 0.08); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * 0.12, hip + s * 0.3); ctx.lineTo(0, hip); ctx.lineTo(s * 0.12, hip + s * 0.3); ctx.stroke();
      ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(d * s * 0.1, sy - s * 0.3); ctx.lineTo(d * s * 0.18, sy - s * 0.38); ctx.stroke(); } }
    if (pose === "duduk") { ctx.beginPath(); ctx.moveTo(-s * 0.16, sy + s * 0.2); ctx.lineTo(0, sy + s * 0.06); ctx.lineTo(s * 0.16, sy + s * 0.2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, hip); ctx.lineTo(s * 0.22, hip); ctx.lineTo(s * 0.22, hip + s * 0.24); ctx.stroke();
      ctx.strokeStyle = "#A86E26"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-s * 0.1, hip + s * 0.04); ctx.lineTo(s * 0.12, hip + s * 0.04); ctx.moveTo(-s * 0.08, hip + s * 0.04); ctx.lineTo(-s * 0.08, hip + s * 0.26); ctx.stroke(); }
    ctx.restore();
  }
  function kartu(ctx, x, y, w, h, lab, drawIcon, opt = {}) {
    card(ctx, x - w / 2, y - h / 2, w, h, { fill: opt.fill || "#F7F9FA", stroke: opt.stroke || "#9AA6AE", lw: opt.lw || 4, r: 22 });
    drawIcon(x, y - h * 0.12);
    text(ctx, lab, x, y + h / 2 - 26, 38, { align: "center", weight: 900, color: INK });
  }
  function pagi(ctx, b, l) {
    board(ctx);
    const w1 = b.id === "w1";
    const L = ["bangun", "mandi", "sarapan", "berangkat"], X = [330, 750, 1170, 1590], Y = 430;
    const tt = w1 ? atSeq(b, ["Bangun", "lalu mandi", "lalu sarapan", "lalu berangkat"]) : [0, 0, 0, 0];
    L.forEach((k, i) => {
      const a = w1 ? P(l, tt[i], 0.5) : 1;
      alpha(ctx, a, () => kartu(ctx, X[i], Y, 300, 270, k === "berangkat" ? "berangkat" : k, (x, y) => icon(ctx, k, x, y, 150)));
      if (i > 0) mline(ctx, [[X[i - 1] + 160, Y], [X[i] - 160, Y]], w1 ? P(l, tt[i] - 0.3, 0.5) : 1, INK, 7, true);
    });
    alpha(ctx, w1 ? P(l, at(b, "Lihat panah"), 0.6) : 1, () => hand(ctx, "kegiatan pagi", 960, 230, 52, { color: ORANGE }));
    if (w1) return;
    alpha(ctx, P(l, at(b, "Sesudah bangun"), 0.5), () => tick(ctx, (X[0] + X[1]) / 2, Y - 50, 60, 1, GREEN));
    const nu = P(l, at(b, "tidak boleh langsung"), 1.0);
    const arc = bez([X[0], Y + 140], [(X[0] + X[2]) / 2, Y + 420], [X[2], Y + 140]);
    if (nu > 0) { ctx.save(); ctx.setLineDash([16, 14]); mline(ctx, arc, nu, RED, 6, true); ctx.restore(); }
    alpha(ctx, P(l, at(b, "tidak ada panah"), 0.5), () => { cross(ctx, (X[0] + X[2]) / 2, Y + 280, 70, 1, RED, 10); hand(ctx, "tidak ada panah!", (X[0] + X[2]) / 2 + 300, Y + 300, 40, { color: RED }); });
  }
  function ulang(ctx, b, l) {
    board(ctx);
    const P0 = { l: [420, 420], t: [960, 420], d: [1500, 420] };
    const lab = { l: "lompat", t: "tepuk tangan", d: "duduk" };
    const show = P(l, at(b, "Lihat gerakan"), 0.6);
    const ed = { "l-t": bez([570, 350], [690, 250], [810, 350]), "t-l": bez([810, 500], [690, 600], [570, 500]), "t-d": bez([1110, 420], [1230, 420], [1350, 420]) };
    const aT = [P(l, at(b, "lalu tepuk"), 0.6), P(l, at(b, "kembali ke lompat"), 0.6), P(l, at(b, "panah ke duduk"), 0.6)];
    const seq = atSeq(b, ["lompat", "tepuk", "lompat", "tepuk", "duduk"], "mengulang");
    const order = ["l", "t", "l", "t", "d"];
    let cur = null; seq.forEach((t, i) => { if (l >= t) cur = order[i]; });
    Object.entries(P0).forEach(([k, [x, y]]) => alpha(ctx, show, () => kartu(ctx, x, y, 300, 260, lab[k], (cx, cy) => stick(ctx, k === "l" ? "lompat" : k === "t" ? "tepuk" : "duduk", cx, cy + (k === "d" ? 0 : 20), 190),
      cur === k ? { fill: "#FFF4D6", stroke: C.accent, lw: 7 } : {})));
    mline(ctx, ed["l-t"], aT[0], INK, 7, true);
    mline(ctx, ed["t-l"], aT[1], BLUE, 7, true);
    mline(ctx, ed["t-d"], aT[2], INK, 7, true);
    alpha(ctx, aT[1], () => hand(ctx, "kembali", 690, 625, 38, { color: BLUE }));
    alpha(ctx, P(l, at(b, "panah yang kembali ke belakang"), 0.6), () => hand(ctx, "panah yang kembali = boleh diulang", 960, 205, 46, { color: ORANGE }));
    // urutan yang terbentuk
    const words = ["lompat", "tepuk", "lompat", "tepuk", "duduk"];
    let x = 560; words.forEach((w, i) => { const a = P(l, seq[i], 0.4); if (a > 0) { hand(ctx, w + (i < 4 ? "," : ""), x, 725, 44, { color: INK, alpha: a, align: "left" }); } x += tw(ctx, w + ", ", 44, 800) + 8; });
  }

  // ---------- penutup ----------
  function langkah(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Mulai dari", "ikuti panahnya", "periksa setiap"]);
    const S = ["Mulai dari tempat MULAI.", "Ikuti panahnya satu per satu.", "Periksa setiap benda di rak."];
    S.forEach((s, i) => {
      const y = 170 + i * 185;
      alpha(ctx, P(l, T[i], 0.5), () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 50, { weight: 900, color: INK, fit: 1060 });
        const ix = 1560, iy = y + 80;
        if (i === 0) { mline(ctx, [[ix - 90, iy - 30], [ix - 30, iy + 10]], 1, GREEN, 7, true); hand(ctx, "MULAI", ix - 110, iy - 40, 28, { color: GREEN }); dish(ctx, "m", ix + 40, iy + 16, 100); }
        if (i === 1) { dish(ctx, "t", ix - 80, iy, 90); dish(ctx, "t", ix + 80, iy, 90); mline(ctx, [[ix - 30, iy - 10], [ix + 30, iy - 10]], 1, ORANGE, 6, true); }
        if (i === 2) { shelfRow(ctx, ix - 100, iy - 40, 200, 80); dish(ctx, "c", ix, iy, 70); tick(ctx, ix + 70, iy - 40, 50, 1, GREEN, 8); }
      });
    });
  }

  // ---------- versi tegak untuk Short (area x 460–1460) ----------
  function soal_v(ctx, b, l) {
    board(ctx);
    hand(ctx, "Robot harus mengikuti panah.", 960, 200, 44, { color: ORANGE });
    diagram(ctx, { ox: 590, oy: 270, sc: 0.82 }, {});
    robot(ctx, 1400, 770, 120, { t: l });
  }

  Object.assign(K.SCENES, {
    soal, peta, jalan, rak, pagi, ulang, langkah, soal_v,
    buka(ctx, b, l) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "satu soal"), 0.8) : 1;
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
      const fu = P(l, at(b, "Lituania"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagLT(ctx, 470, 230, 170); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Lituania"), 0.8);
      if (au > 0) ring(ctx, 1190, 300 + 2 * 92 - 14, 220, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
      robot(ctx, 740, 520, 280, { wave: l, t: l });
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Sampai jumpa!", 540, 800, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 72, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Robot mengikuti panah, langkah demi langkah", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 860, 680, 170, 0, { wave: l, mood: "happy" });
      robot(ctx, 1080, 680, 170, { wave: l, t: l });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
