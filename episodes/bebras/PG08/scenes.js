/* PG08 Pembahasan Soal Bebras 2025-PK-03 "Mesin Makanan Bebravy" (Pakistan), kategori Penegak (SMA).
   Gaya papan tulis putih dengan coretan spidol (sama dengan PG01–PG03) + simulasi ban berjalan dan kurung resep.
   Bahan (kode): N nasi, C cabai, B bawang, T tomat, D daging, Ti timun, S selada, K keju, R roti.
   Hidangan: NG nasi goreng, SA sate, BG burger, RL roti lapis, SL salad (warna tetap per hidangan).
   Ban soal (22 bahan, dibaca dari gambar soal yang diperbesar): N C B T D Ti S T T K D R T N C B Ti S T K D R.
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F6FD1", GRAY = "#8A96A0";
  const META = { judul: "Mesin Makanan Bebravy", tahun: "2025", negara: "Pakistan", kode: "2025-PK-03" };
  const FUR = "#8E5B3A", FUR2 = "#B98458";
  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const atI = (b, i) => lead(b) + Math.max(0, i) / TXT(b).length * (b.audio || b.dur);
  const at = (b, s, from = 0) => {
    const T = TXT(b); let i = T.indexOf(s, from);
    if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); i = 0; }
    return atI(b, i);
  };
  const atSeq = (b, list, from = "") => {
    const T = TXT(b); let p = from ? Math.max(0, T.indexOf(from)) : 0; const out = [];
    list.forEach(s => { const i = T.indexOf(s, p); if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); out.push(atI(b, p)); } else { out.push(atI(b, i)); p = i + s.length; } });
    return out;
  };
  const P = (l, t0, d) => ease((l - t0) / (d || 0.6));
  function prog(order, b) {
    const k = order.indexOf(b.id);
    return (id, fn) => { const j = order.indexOf(id); if (j < 0 || k < 0) return 0; if (j < k) return 1; if (j > k) return 0; return fn ? fn() : 1; };
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
  function strike(ctx, x0, x1, y, u, color = RED) { mline(ctx, [[x0, y], [x1, y]], u, color, 6); }
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
    text(ctx, q, x + h + 20, y + h * 0.8, 30, { weight: 800, color: INK, fit: w - h - 40 });
  }
  function chip(ctx, s, cx, cy, size, color, opt = {}) {
    const w = tw(ctx, s, size, 900) + size * 1.1, h = size * 1.55;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = opt.light ? "#FFFFFF" : color; ctx.strokeStyle = color; ctx.lineWidth = 4; rr(ctx, cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
    text(ctx, s, cx, cy + size * 0.36, size, { align: "center", weight: 900, color: opt.light ? color : "#FFFFFF" });
    ctx.restore(); return w;
  }
  function beaver(ctx, x, y, s, o = {}) {   // berang-berang maskot Bebras (sama dengan B01–SG03)
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2.5;
    ctx.fillStyle = "#5E3B24"; ctx.beginPath(); ctx.ellipse(-30, 46, 22, 9, -0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();   // ekor pipih
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
  function arrow(ctx, x0, y0, x1, y1, u = 1, color = INK, w = 6) { mline(ctx, [[x0, y0], [x1, y1]], u, color, w, true); }
  function flagPK(ctx, x, y, w) {   // bendera Pakistan: pita putih di sisi tiang, hijau tua dengan bulan sabit dan bintang putih
    const h = w * 2 / 3, band = w / 4;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, band, h);
    ctx.fillStyle = "#01411C"; ctx.fillRect(x + band, y, w - band, h);
    const cx = x + band + (w - band) / 2, cy = y + h / 2, R = h * 0.3;
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#01411C"; ctx.beginPath(); ctx.arc(cx + R * 0.28, cy - R * 0.22, R * 0.86, 0, Math.PI * 2); ctx.fill();
    const sx = cx + R * 0.52, sy = cy - R * 0.42, sr = R * 0.24;
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5 + 0.5, r = i % 2 ? sr * 0.4 : sr; ctx.lineTo(sx + r * Math.cos(a), sy + r * Math.sin(a)); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }


  // ---------- bahan dan hidangan (digambar dengan kode) ----------
  const NAMA = { N: "nasi", C: "cabai", B: "bawang", T: "tomat", D: "daging", Ti: "timun", S: "selada", K: "keju", R: "roti",
    NG: "nasi goreng", SA: "sate", BG: "burger", RL: "roti lapis", SL: "salad" };
  const DC = { NG: "#E07A12", SA: "#C0392B", BG: "#7D4FB0", RL: "#2F6FD1", SL: "#23964F" };   // warna kurung hidangan
  const DL = { NG: "#FDEBD8", SA: "#F8DEDB", BG: "#EDE3F6", RL: "#E1EBFA", SL: "#DDF2E4" };
  const RESEP = [["NG", ["N", "C", "B"]], ["SA", ["C", "B", "T", "D"]], ["BG", ["Ti", "S", "T", "K", "D", "R"]], ["RL", ["K", "D", "R"]], ["SL", ["Ti", "S", "T"]]];
  const HEMAT = { NG: 2, SA: 3, BG: 5, RL: 2, SL: 2 };
  const BELT = ["N", "C", "B", "T", "D", "Ti", "S", "T", "T", "K", "D", "R", "T", "N", "C", "B", "Ti", "S", "T", "K", "D", "R"];
  const CONTOH = ["N", "C", "B", "B", "Ti", "S", "T"];
  // semua kecocokan (nomor bahan 1..22) dan jalurnya di adegan "cocok"
  const MATCH = [["NG", 1, 3, 0], ["SA", 2, 5, 1], ["SL", 6, 8, 0], ["RL", 10, 12, 0], ["NG", 14, 16, 0], ["SL", 17, 19, 0], ["RL", 20, 22, 0], ["BG", 17, 22, 1]];
  const GREEDY = [["NG", 1, 3], [null, 4, 4], [null, 5, 5], ["SL", 6, 8], [null, 9, 9], ["RL", 10, 12], [null, 13, 13], ["NG", 14, 16], ["BG", 17, 22]];
  const BEST = [[null, 1, 1], ["SA", 2, 5], ["SL", 6, 8], [null, 9, 9], ["RL", 10, 12], [null, 13, 13], ["NG", 14, 16], ["BG", 17, 22]];

  function blob(ctx, pts, fill, stroke, lw = 2) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } }
  function ell(ctx, x, y, rx, ry, rot, fill, stroke, lw = 2) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } }
  // ikon di kotak 100×100 berpusat (0,0); s = ukuran piksel
  const ICON = {
    N(ctx) {   // semangkuk nasi
      ell(ctx, 0, -6, 34, 24, 0, "#FFFFFF", "#B9C3CA", 2.5);
      ctx.fillStyle = "#E9EEF1"; for (const [x, y] of [[-14, -14], [6, -20], [18, -8], [-4, -4], [-22, -2]]) ell(ctx, x, y, 5, 3, 0.4, "#E3E9ED");
      ctx.beginPath(); ctx.moveTo(-40, -2); ctx.lineTo(40, -2); ctx.quadraticCurveTo(36, 36, 0, 38); ctx.quadraticCurveTo(-36, 36, -40, -2); ctx.closePath();
      ctx.fillStyle = "#9CC3D6"; ctx.fill(); ctx.strokeStyle = "#4F7F96"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = "#7EAEC4"; rr(ctx, -16, 36, 32, 6, 3); ctx.fill();
    },
    C(ctx) {   // cabai merah melengkung
      ctx.beginPath(); ctx.moveTo(-30, 30); ctx.quadraticCurveTo(-6, 34, 14, 10); ctx.quadraticCurveTo(26, -6, 26, -24);
      ctx.quadraticCurveTo(10, -22, 4, -6); ctx.quadraticCurveTo(-8, 16, -34, 22); ctx.quadraticCurveTo(-40, 26, -30, 30); ctx.closePath();
      ctx.fillStyle = "#E0302A"; ctx.fill(); ctx.strokeStyle = "#8E1712"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-16, 22); ctx.quadraticCurveTo(4, 16, 12, -2); ctx.stroke();
      ctx.fillStyle = "#2E8B3A"; ctx.strokeStyle = "#1C5A24"; ctx.lineWidth = 2; rr(ctx, 12, -30, 18, 9, 4); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#2E8B3A"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(22, -30); ctx.quadraticCurveTo(22, -42, 32, -44); ctx.stroke();
    },
    B(ctx) {   // bawang bombai
      ctx.beginPath(); ctx.moveTo(0, -40); ctx.quadraticCurveTo(6, -24, 26, -14); ctx.quadraticCurveTo(44, 6, 26, 30); ctx.quadraticCurveTo(0, 44, -26, 30);
      ctx.quadraticCurveTo(-44, 6, -26, -14); ctx.quadraticCurveTo(-6, -24, 0, -40); ctx.closePath();
      ctx.fillStyle = "#E6B47A"; ctx.fill(); ctx.strokeStyle = "#9A6430"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.strokeStyle = "rgba(154,100,48,0.55)"; ctx.lineWidth = 2;
      for (const k of [-0.55, 0, 0.55]) { ctx.beginPath(); ctx.moveTo(0, -30); ctx.quadraticCurveTo(k * 48, 4, k * 14, 36); ctx.stroke(); }
      ctx.strokeStyle = "#C7A07A"; ctx.lineWidth = 2; ctx.beginPath(); for (const dx of [-6, 0, 6]) { ctx.moveTo(dx * 0.6, 37); ctx.lineTo(dx, 44); } ctx.stroke();
    },
    T(ctx) {   // tomat
      ell(ctx, 0, 6, 38, 33, 0, "#E5322B", "#8E1712", 2.5);
      ell(ctx, -14, -6, 9, 6, -0.5, "rgba(255,255,255,0.45)");
      ctx.fillStyle = "#2E9A3E"; ctx.strokeStyle = "#1C5A24"; ctx.lineWidth = 1.8; ctx.beginPath();
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 7 : 20; ctx.lineTo(r * Math.cos(a), -24 + r * Math.sin(a) * 0.55); }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#2E9A3E"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(3, -38); ctx.stroke();
    },
    D(ctx) {   // daging steak dengan lemak dan tulang
      blob(ctx, [[-36, -10], [-20, -30], [10, -30], [34, -18], [38, 6], [24, 28], [-6, 32], [-30, 22], [-40, 6]], "#F4C7C3", "#A2332B", 2.5);
      blob(ctx, [[-28, -8], [-16, -22], [8, -22], [26, -12], [30, 4], [18, 20], [-6, 24], [-24, 16], [-32, 4]], "#D6453C");
      ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-18, -4); ctx.quadraticCurveTo(-2, -14, 8, 2); ctx.moveTo(-8, 12); ctx.quadraticCurveTo(6, 6, 18, 12); ctx.stroke();
      ell(ctx, 18, -8, 7, 7, 0, "#FFFFFF", "#B9A9A6", 2);
    },
    Ti(ctx) {   // timun
      ctx.save(); ctx.rotate(-0.7); ctx.fillStyle = "#2E8B3A"; ctx.strokeStyle = "#1B5A22"; ctx.lineWidth = 2.5; rr(ctx, -44, -14, 88, 28, 14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.28)"; rr(ctx, -36, -10, 70, 7, 4); ctx.fill();
      ctx.fillStyle = "#A6D86E"; for (const x of [-26, -8, 10, 28]) ell(ctx, x, 5, 2.5, 2, 0, "#A6D86E");
      ctx.restore();
    },
    S(ctx) {   // selada
      blob(ctx, [[-6, 40], [-30, 26], [-38, 2], [-30, -22], [-12, -38], [10, -36], [30, -22], [38, 0], [30, 26], [8, 40]], "#9BD36A", "#4E8F2A", 2.5);
      blob(ctx, [[-2, 38], [-20, 22], [-22, -2], [-10, -26], [8, -24], [20, -4], [16, 22]], "#C4E79C");
      ctx.strokeStyle = "#F4FBEA"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-2, 40); ctx.quadraticCurveTo(-4, 6, 0, -26); ctx.stroke();
      ctx.lineWidth = 2.5; ctx.strokeStyle = "#E7F6D6"; ctx.beginPath(); ctx.moveTo(-3, 18); ctx.lineTo(-18, 6); ctx.moveTo(-2, 2); ctx.lineTo(14, -10); ctx.stroke();
    },
    K(ctx) {   // keju segitiga berlubang
      blob(ctx, [[-40, 26], [-40, 2], [30, -28], [40, 2], [40, 26]], "#F9C934", "#B88710", 2.5);
      blob(ctx, [[-40, 2], [30, -28], [40, 2]], "#FFE07A", "#B88710", 2);
      for (const [x, y, r] of [[-22, 14, 6], [2, 18, 4.5], [24, 12, 7], [10, -6, 3.5]]) ell(ctx, x, y, r, r * 0.8, 0, "#E9A21B");
    },
    R(ctx) {   // roti tawar
      ctx.beginPath(); ctx.moveTo(-32, 36); ctx.lineTo(-32, -6); ctx.arc(-14, -14, 20, Math.PI * 0.9, Math.PI * 1.6); ctx.arc(14, -14, 20, Math.PI * 1.4, Math.PI * 0.1); ctx.lineTo(32, 36); ctx.closePath();
      ctx.fillStyle = "#D08B3C"; ctx.fill(); ctx.strokeStyle = "#8A5418"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-24, 30); ctx.lineTo(-24, -4); ctx.arc(-12, -11, 13, Math.PI * 0.9, Math.PI * 1.6); ctx.arc(12, -11, 13, Math.PI * 1.4, Math.PI * 0.1); ctx.lineTo(24, 30); ctx.closePath();
      ctx.fillStyle = "#F8E6C2"; ctx.fill();
    },
    NG(ctx) {   // sepiring nasi goreng dengan telur dan irisan cabai
      ell(ctx, 0, 16, 46, 18, 0, "#FFFFFF", "#9AA6AE", 2.5); ell(ctx, 0, 14, 36, 12, 0, "#EEF2F4");
      ctx.beginPath(); ctx.moveTo(-34, 14); ctx.quadraticCurveTo(-30, -24, 0, -26); ctx.quadraticCurveTo(30, -24, 34, 14); ctx.closePath();
      ctx.fillStyle = "#D9893A"; ctx.fill(); ctx.strokeStyle = "#8F5320"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#B8682A"; for (const [x, y] of [[-18, 0], [-6, -14], [10, -4], [22, 4], [-24, 8], [4, 8]]) ell(ctx, x, y, 3.5, 2.2, 0.5, "#B8682A");
      ell(ctx, 6, -18, 16, 10, -0.15, "#FFFFFF", "#C9C2B5", 1.5); ell(ctx, 7, -18, 6, 5, 0, "#F6B91E");
      ell(ctx, -18, -10, 4, 3, 0.4, "#E0302A"); ell(ctx, 22, -6, 4, 3, -0.4, "#2E9A3E");
    },
    SA(ctx) {   // tiga tusuk sate
      ctx.lineCap = "round";
      for (const k of [-1, 0, 1]) {
        ctx.save(); ctx.translate(k * 16, k * 4); ctx.rotate(-0.75);
        ctx.strokeStyle = "#C9A26A"; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(-46, 0); ctx.lineTo(40, 0); ctx.stroke();
        for (const x of [-22, -6, 10]) { ctx.fillStyle = "#8A4B22"; ctx.strokeStyle = "#5A2E12"; ctx.lineWidth = 1.8; rr(ctx, x - 7, -8, 14, 16, 5); ctx.fill(); ctx.stroke(); }
        ctx.restore();
      }
      ctx.fillStyle = "#B5651D"; ell(ctx, 0, 30, 30, 8, 0, "#B5651D", "#7A4212", 1.5);
    },
    BG(ctx) {   // burger
      ctx.beginPath(); ctx.moveTo(-40, -6); ctx.quadraticCurveTo(-40, -40, 0, -40); ctx.quadraticCurveTo(40, -40, 40, -6); ctx.closePath();
      ctx.fillStyle = "#E1A04C"; ctx.fill(); ctx.strokeStyle = "#91591B"; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = "#FFF4D6"; for (const [x, y] of [[-14, -26], [4, -32], [18, -22], [-2, -18]]) ell(ctx, x, y, 3, 1.8, 0.3, "#FFF4D6");
      blob(ctx, [[-44, -4], [-32, 2], [-20, -4], [-8, 2], [4, -4], [16, 2], [28, -4], [44, -2], [40, 4], [-40, 4]], "#7CC24E", "#3E7A22", 1.5);
      ctx.fillStyle = "#F9C934"; blob(ctx, [[-38, 4], [38, 4], [30, 14], [-30, 14]], "#F9C934");
      ctx.fillStyle = "#6B3A1E"; rr(ctx, -40, 6, 80, 14, 7); ctx.fill();
      ctx.fillStyle = "#E5322B"; rr(ctx, -36, 18, 72, 5, 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-40, 24); ctx.lineTo(40, 24); ctx.quadraticCurveTo(40, 38, 28, 38); ctx.lineTo(-28, 38); ctx.quadraticCurveTo(-40, 38, -40, 24); ctx.closePath();
      ctx.fillStyle = "#D99547"; ctx.fill(); ctx.strokeStyle = "#91591B"; ctx.lineWidth = 2.5; ctx.stroke();
    },
    RL(ctx) {   // roti lapis segitiga
      const tri = (dy, fill) => blob(ctx, [[-40, 28 + dy], [40, 28 + dy], [0, -38 + dy]], fill, "#8A5418", 2.5);
      tri(4, "#F8E6C2");
      ctx.fillStyle = "#7CC24E"; blob(ctx, [[-36, 22], [36, 22], [32, 16], [-32, 16]], "#7CC24E");
      blob(ctx, [[-32, 16], [32, 16], [28, 10], [-28, 10]], "#F9C934");
      blob(ctx, [[-28, 10], [28, 10], [24, 4], [-24, 4]], "#D6453C");
      blob(ctx, [[-24, 4], [24, 4], [0, -36]], "#F8E6C2", "#8A5418", 2.5);
      ctx.strokeStyle = "#D08B3C"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-40, 32); ctx.lineTo(0, -34); ctx.lineTo(40, 32); ctx.stroke();
    },
    SL(ctx) {   // semangkuk salad
      for (const [x, y, r] of [[-22, -8, 16], [0, -16, 18], [22, -8, 16], [-10, -2, 14], [12, -2, 14]]) ell(ctx, x, y, r, r * 0.8, 0, "#7CC24E", "#3E7A22", 1.5);
      for (const [x, y] of [[-14, -12], [8, -20], [20, -4], [-2, -4]]) ell(ctx, x, y, 5, 5, 0, "#E5322B", "#8E1712", 1.2);
      ell(ctx, -24, -2, 7, 3, 0.5, "#2E8B3A");
      ctx.beginPath(); ctx.moveTo(-44, 0); ctx.lineTo(44, 0); ctx.quadraticCurveTo(40, 36, 0, 38); ctx.quadraticCurveTo(-40, 36, -44, 0); ctx.closePath();
      ctx.fillStyle = "#FFFFFF"; ctx.fill(); ctx.strokeStyle = "#9AA6AE"; ctx.lineWidth = 2.5; ctx.stroke();
    },
  };
  function icon(ctx, k, x, y, s, opt = {}) {
    if (!ICON[k]) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.lineJoin = "round"; ICON[k](ctx); ctx.restore();
  }
  function label(ctx, k, x, y, size, color = INK, opt = {}) { text(ctx, NAMA[k], x, y, size, Object.assign({ align: "center", weight: 800, color }, opt)); }

  // ---------- ban berjalan ----------
  // L = {x, y, dx, s, perRow, rowGap}; posisi bahan ke-i (0-based)
  function bpos(L, i) { const per = L.perRow || 99, r = Math.floor(i / per), c = i % per; return [L.x + c * L.dx, L.y + r * (L.rowGap || 0)]; }
  function beltBand(ctx, x0, x1, y, s) {
    const h = s * 0.42;
    ctx.fillStyle = "#AEB6BC"; rr(ctx, x0 - s * 0.6, y + s * 0.34, x1 - x0 + s * 1.2, h * 0.55, h * 0.27); ctx.fill();
    ctx.fillStyle = "#86A9D8"; rr(ctx, x0 - s * 0.6, y + s * 0.14, x1 - x0 + s * 1.2, h * 0.6, h * 0.3); ctx.fill();
    ctx.strokeStyle = "#4F6E9A"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#4F6E9A"; for (const xx of [x0 - s * 0.6 + h * 0.3, x1 + s * 0.6 - h * 0.3]) { ctx.beginPath(); ctx.arc(xx, y + s * 0.26, h * 0.26, 0, Math.PI * 2); ctx.fill(); }
  }
  // opt: items (array), nums (alpha nomor), alpha(i), ring(i)->u, dim(i)
  function belt(ctx, L, opt = {}) {
    const items = opt.items || BELT, n = items.length, per = L.perRow || n;
    for (let r = 0; r * per < n; r++) {
      const a = bpos(L, r * per), z = bpos(L, Math.min(n, (r + 1) * per) - 1);
      beltBand(ctx, a[0], z[0], a[1], L.s);
    }
    items.forEach((k, i) => {
      const [x, y] = bpos(L, i), a = opt.alpha ? opt.alpha(i) : 1; if (a <= 0) return;
      const d = opt.dim ? opt.dim(i) : 0;
      icon(ctx, k, x, y - L.s * 0.08, L.s, { alpha: a * (1 - 0.65 * d) });
      if (opt.nums) text(ctx, String(i + 1), x, y + L.s * 0.98, Math.round(L.s * 0.36), { align: "center", weight: 800, color: C.ink2, alpha: opt.nums });
    });
  }
  // kurung hidangan di bawah bahan a..b (nomor 1-based): batang berwarna + ikon hidangan di tengah
  function bracket(ctx, L, k, a, b, y, u = 1, opt = {}) {
    if (u <= 0) return;
    const [x0] = bpos(L, a - 1), [x1] = bpos(L, b - 1), half = L.dx * 0.44, col = k ? DC[k] : GRAY;
    ctx.save(); ctx.globalAlpha *= clamp(u * 1.6, 0, 1) * (opt.alpha != null ? opt.alpha : 1);
    ctx.strokeStyle = col; ctx.lineWidth = opt.lw || 5; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (opt.dash) ctx.setLineDash([10, 8]);
    const xa = x0 - half, xb = lerp(x0 - half, x1 + half, clamp(u, 0, 1)), h = opt.h || 14;
    ctx.beginPath(); ctx.moveTo(xa, y - h); ctx.lineTo(xa, y); ctx.lineTo(xb, y); if (u >= 1) ctx.lineTo(xb, y - h); ctx.stroke();
    ctx.setLineDash([]);
    const cx = (x0 + x1) / 2, is = opt.icon || 46;
    if (u >= 0.6 && opt.noIcon !== true) {
      const q = clamp((u - 0.6) / 0.4, 0, 1);
      ctx.globalAlpha *= q;
      if (k) { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(cx, y + is * 0.12, is * 0.56, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke(); icon(ctx, k, cx, y + is * 0.12, is * 0.9); }
      else { chip(ctx, "sisa", cx, y + 2, Math.round(is * 0.42), GRAY, { light: true }); }
    }
    ctx.restore();
  }
  // kotak latar di belakang bahan a..b
  function tint(ctx, L, a, b, color, u = 1, pad = 0) {
    if (u <= 0) return;
    const [x0, y] = bpos(L, a - 1), [x1] = bpos(L, b - 1), half = L.dx * 0.5;
    ctx.save(); ctx.globalAlpha *= clamp(u, 0, 1); ctx.fillStyle = color; rr(ctx, x0 - half + 3, y - L.s * 0.66 - pad, x1 - x0 + half * 2 - 6, L.s * 1.88 + pad * 2, 14); ctx.fill(); ctx.restore();
  }
  const LBIG = { x: 128, y: 0, dx: 79, s: 64 };   // 22 bahan dalam satu baris (lebar papan)
  const Lrow = y => Object.assign({}, LBIG, { y });
  const LV = y => ({ x: 497, y, dx: 76, s: 60 });   // Short: baris 1 = bahan 1–13, baris 2 = bahan 14–22

  // daftar resep ringkas (satu baris) di atas papan
  function recipeStrip(ctx, x, y, s, opt = {}) {
    let cx = x;
    const gap = s * 0.98, sep = s * 0.85;
    RESEP.forEach(([d, ing], r) => {
      const w = ing.length * gap + s * 0.6 + s * 1.2;
      const hl = opt.hl ? opt.hl(d) : 0;
      ctx.save(); ctx.fillStyle = hl ? DL[d] : "#F7F9FA"; ctx.strokeStyle = DC[d]; ctx.lineWidth = hl ? 4 : 2.5; rr(ctx, cx - s * 0.55, y - s * 0.66, w + s * 0.2, s * 1.32, 12); ctx.fill(); ctx.stroke(); ctx.restore();
      ing.forEach((k, j) => icon(ctx, k, cx + j * gap, y, s * 0.92));
      const ex = cx + ing.length * gap - s * 0.2;
      text(ctx, "=", ex, y + s * 0.2, s * 0.6, { align: "center", weight: 900, color: INK });
      icon(ctx, d, ex + s * 0.75, y, s * 1.05);
      cx += w + sep;
    });
    return cx;
  }

  // ---------- mesin ----------
  function machine(ctx, x, y, w, h, opt = {}) {
    ctx.save();
    ctx.fillStyle = "#C9D3DB"; rr(ctx, x, y, w, h, 18); ctx.fill(); ctx.strokeStyle = "#6B7780"; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = "#AEB9C2"; rr(ctx, x - 10, y - 26, w + 20, 40, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#4D7FC4"; rr(ctx, x + 18, y + 30, w * 0.24, h - 60, 10); ctx.fill(); ctx.strokeStyle = "#2F5A92"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "#2F5A92"; for (let i = 0; i < 3; i++) rr(ctx, x + 18 + w * 0.12 - 18, y + 70 + i * (h - 120) / 2.4, 36, 8, 4), ctx.fill();
    const cols = ["#E5322B", "#F2B134", "#23964F", "#2F6FD1", "#7D4FB0"];
    cols.forEach((c, i) => ell(ctx, x + 18 + w * 0.04 + i * w * 0.04, y + 46, w * 0.012, w * 0.012, 0, c));
    ctx.fillStyle = "#EEF3F8"; rr(ctx, x + w * 0.32, y + 30, w * 0.64, h - 60, 12); ctx.fill(); ctx.strokeStyle = "#8A96A0"; ctx.lineWidth = 3; ctx.stroke();
    if (opt.title) text(ctx, opt.title, x + w * 0.64, y + h - 60, Math.min(44, w * 0.06), { align: "center", weight: 900, color: INK, fit: w * 0.58 });
    ctx.restore();
  }

  // ---------- pilihan ----------
  const OPTS = [7, 10, 9, 8];
  function optCard(ctx, i, x, y, w, h, st = {}, fs = 72) {
    ctx.save(); if (st.dim) ctx.globalAlpha *= 1 - 0.55 * st.dim;
    card(ctx, x, y, w, h, { fill: st.good ? "#E8F6EC" : "#F7F9FA", stroke: st.good ? GREEN : "#C9D2D8", lw: st.good ? 6 : 3, r: 20 });
    ctx.strokeStyle = st.good ? GREEN : "#9AA6AE"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x + h * 0.36, y + h / 2, h * 0.13, 0, Math.PI * 2); ctx.stroke();
    if (st.good) { ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x + h * 0.36, y + h / 2, h * 0.07, 0, Math.PI * 2); ctx.fill(); }
    text(ctx, String(OPTS[i]), x + w * 0.58, y + h / 2 + fs * 0.36, fs, { align: "center", weight: 900, color: INK });
    ctx.restore();
    const bx = x + w - 6, by = y + 6, br = h * 0.24;
    if (st.strike || st.tick) { ctx.save(); ctx.globalAlpha *= clamp((st.strike || st.tick) * 3, 0, 1); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = st.tick ? GREEN : RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore(); }
    if (st.strike) cross(ctx, bx, by, br * 1.5, st.strike, RED, 8);
    if (st.tick) tick(ctx, bx, by + 2, br * 1.4, st.tick, GREEN, 8);
    if (st.ring) ring(ctx, x + w / 2, y + h / 2, w / 2 + 22, h * 0.72, st.ring, GREEN, 7);
  }
  function pilihan(ctx, b, l) {
    board(ctx);
    text(ctx, "Berapa jumlah keluaran paling sedikit?", 960, 205, 50, { align: "center", weight: 900, color: INK, fit: 1700 });
    text(ctx, "(hidangan + bahan yang tidak diolah)", 960, 258, 32, { align: "center", weight: 800, color: C.ink2 });
    const ord = prog(["p1", "p2", "p3", "p4"], b);
    const isP = b.id[0] === "p";
    const X = i => 120 + i * 430, Y = 300, W = 390, Hc = 170;
    const st = [{}, {}, {}, {}];
    if (isP) {
      const s7 = ord("p1", () => P(l, at(b, "Tujuh tidak"), 0.6));
      st[0] = { strike: s7, dim: s7 };
      const d = ord("p2", () => P(l, at(b, "bukan jumlah"), 0.6));
      st[1] = { dim: d }; st[2] = { dim: d };
      const g = ord("p3", () => P(l, at(b, "delapan."), 0.5));
      st[3] = { tick: g, good: g > 0.5, ring: ord("p3", () => P(l, at(b, "delapan."), 0.8)) };
    }
    for (let i = 0; i < 4; i++) {
      const a = b.id === "soal8" ? P(l, at(b, "Pilihannya") + i * 0.55, 0.5) : 1;
      alpha(ctx, a, () => optCard(ctx, i, X(i), Y, W, Hc, st[i]));
    }
    if (!isP) {
      belt(ctx, { x: 175, y: 640, dx: 75, s: 58 });
      if (b.id === "soal9") kiko(ctx, 1770, 730, 120, 0, { mood: "happy", wave: l });
      return;
    }
    const n1 = ord("p1", () => P(l, at(b, "karena"), 0.6));
    hand(ctx, "paling sedikit 8", X(0) + W / 2, 545, 32, { color: RED, alpha: n1 });
    const n2 = ord("p2", () => P(l, at(b, "Sembilan dan"), 0.6));
    hand(ctx, "bisa terjadi, tetapi", (X(1) + X(2) + W) / 2, 545, 32, { color: GRAY, alpha: n2 }); hand(ctx, "bukan yang paling sedikit", (X(1) + X(2) + W) / 2, 585, 32, { color: GRAY, alpha: ord("p2", () => P(l, at(b, "bukan jumlah"), 0.6)) });
    hand(ctx, "ada caranya", X(3) + W / 2, 545, 32, { color: GREEN, alpha: ord("p3", () => P(l, at(b, "delapan."), 0.6)) });
    if (b.id === "p4") {
      const T = atSeq(b, ["Pertama", "Kedua"]);
      [["CONTOH", "cara yang menghasilkan 8 keluaran", GREEN, 120], ["BUKTI", "7 keluaran tidak mungkin", RED, 980]].forEach(([h, s, col, x], i) => {
        alpha(ctx, P(l, T[i], 0.6), () => {
          card(ctx, x, 640, 820, 130, { fill: "#FFFFFF", stroke: col, lw: 4, r: 18 });
          text(ctx, h, x + 30, 688, 26, { weight: 900, color: col });
          text(ctx, s, x + 30, 742, 40, { weight: 900, color: INK, fit: 760 });
        });
      });
    }
  }

  // ---------- soal ----------
  function mesin(ctx, b, l) {
    board(ctx);
    machine(ctx, 640, 250, 640, 400, { title: "MESIN MAKANAN" });
    // ban masuk (kiri) dan keluar (kanan)
    beltBand(ctx, 140, 560, 560, 70); beltBand(ctx, 1360, 1760, 560, 70);
    const seq = ["N", "C", "B"], t = (l * 0.45) % 3.2;
    seq.forEach((k, i) => { const x = 180 + i * 110 + t * 120; if (x < 600) icon(ctx, k, x, 552, 72); });
    const out = clamp((t - 2.2) / 0.6, 0, 1);
    if (out > 0) icon(ctx, "NG", 1400 + out * 220, 548, 86, { alpha: out });
    hand(ctx, "bahan masuk", 330, 450, 40, { color: BLUE, alpha: P(l, at(b, "memeriksa bahan"), 0.6) });
    hand(ctx, "hidangan keluar", 1580, 450, 40, { color: GREEN, alpha: P(l, at(b, "mencocokkannya"), 0.6) });
    arrow(ctx, 200, 690, 520, 690, P(l, at(b, "memeriksa bahan"), 0.8), BLUE, 6);
    arrow(ctx, 1400, 690, 1720, 690, P(l, at(b, "mencocokkannya"), 0.8), GREEN, 6);
    alpha(ctx, P(l, at(b, "dengan resep"), 0.6), () => {
      text(ctx, "RESEP", 1050, 345, 30, { align: "center", weight: 900, color: C.accentDark });
      RESEP.forEach(([d], i) => { ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = DC[d]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(890 + i * 80, 430, 34, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); icon(ctx, d, 890 + i * 80, 430, 56); });
    });
  }
  function resep(ctx, b, l) {
    board(ctx);
    text(ctx, "BAHAN", 90, 178, 26, { weight: 900, color: C.accentDark });
    const ING = ["N", "C", "B", "T", "D", "Ti", "S", "K", "R"];
    ING.forEach((k, i) => { const x = 130 + i * 196 + 60, a = P(l, 0.2 + i * 0.12, 0.4); alpha(ctx, a, () => { icon(ctx, k, x, 205, 62); label(ctx, k, x, 272, 28); }); });
    mline(ctx, [[90, 298], [1830, 298]], 1, "#D5DCE1", 3);
    text(ctx, "RESEP", 90, 335, 26, { weight: 900, color: C.accentDark });
    const T = atSeq(b, ["Nasi, cabai", "Cabai, bawang", "Timun, selada, tomat, keju", "Keju, daging", "Terakhir"]);
    RESEP.forEach(([d, ing], r) => {
      const y = 380 + r * 84, a = P(l, T[r] - 0.2, 0.5);
      const cur = l >= T[r] && (r === 4 || l < T[r + 1]);
      alpha(ctx, a, () => {
        if (cur) { ctx.fillStyle = DL[d]; rr(ctx, 110, y - 42, 1180, 84, 14); ctx.fill(); }
        ing.forEach((k, j) => icon(ctx, k, 170 + j * 92, y, 64));
        arrow(ctx, 740, y, 820, y, 1, INK, 5);
        icon(ctx, d, 880, y, 76);
        text(ctx, NAMA[d], 940, y + 14, 40, { weight: 900, color: DC[d] });
      });
    });
    kiko(ctx, 1600, 640, 190, 0, { mood: "happy", wave: l * 0.5 });
  }
  function ruleCard(ctx, x, y, w, h, n, title, a) {
    alpha(ctx, a, () => {
      card(ctx, x, y, w, h, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 18 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(x + 40, y + 42, 22, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(n), x + 40, y + 53, 30, { align: "center", weight: 900, color: "#FFFFFF" });
      text(ctx, title, x + 76, y + 54, 36, { weight: 900, color: INK, fit: w - 100 });
    });
  }
  function rowIcons(ctx, list, x, y, s, gap) { list.forEach((k, j) => k && icon(ctx, k, x + j * gap, y, s)); }
  function aturan_soal(ctx, b, l) {
    board(ctx);
    const ord = prog(["soal3", "soal4"], b);
    const a1 = ord("soal3", () => P(l, at(b, "Bahan-bahannya"), 0.5)), a2 = ord("soal3", () => P(l, at(b, "tidak boleh melewatkan"), 0.5));
    const a3 = ord("soal3", () => P(l, at(b, "Setelah dipakai"), 0.5)), a4 = ord("soal4", () => P(l, 0.2, 0.5));
    const X0 = 80, X1 = 980, Y0 = 150, Y1 = 495, W = 860, Hh = 325;
    ruleCard(ctx, X0, Y0, W, Hh, 1, "Urutannya harus persis", a1);
    alpha(ctx, a1, () => {
      rowIcons(ctx, ["Ti", "S", "T"], X0 + 90, Y0 + 145, 60, 78); arrow(ctx, X0 + 300, Y0 + 145, X0 + 370, Y0 + 145, 1, INK, 5); icon(ctx, "SL", X0 + 425, Y0 + 145, 70); tick(ctx, X0 + 520, Y0 + 145, 50);
      rowIcons(ctx, ["T", "S", "Ti"], X0 + 90, Y0 + 250, 60, 78); arrow(ctx, X0 + 300, Y0 + 250, X0 + 370, Y0 + 250, 1, INK, 5); icon(ctx, "SL", X0 + 425, Y0 + 250, 70, { alpha: 0.35 }); cross(ctx, X0 + 520, Y0 + 250, 50);
      hand(ctx, "urutan terbalik", X0 + 700, Y0 + 262, 30, { color: RED });
    });
    ruleCard(ctx, X1, Y0, W, Hh, 2, "Tidak boleh melewati bahan", a2);
    alpha(ctx, a2, () => {
      rowIcons(ctx, ["Ti", "S", "B", "T"], X1 + 90, Y0 + 190, 64, 92);
      ring(ctx, X1 + 90 + 2 * 92, Y0 + 190, 46, 46, a2, RED, 5);
      arrow(ctx, X1 + 420, Y0 + 190, X1 + 480, Y0 + 190, 1, INK, 5); icon(ctx, "SL", X1 + 540, Y0 + 190, 70, { alpha: 0.35 }); cross(ctx, X1 + 630, Y0 + 190, 50);
      hand(ctx, "bawang tidak boleh dilompati", X1 + 430, Y0 + 290, 30, { color: RED });
    });
    ruleCard(ctx, X0, Y1, W, Hh, 3, "Setiap bahan dipakai sekali", a3);
    alpha(ctx, a3, () => {
      const L = { x: X0 + 110, y: Y1 + 150, dx: 86, s: 60 };
      rowIcons(ctx, ["N", "C", "B", "T", "D"], L.x, L.y, 60, L.dx);
      bracket(ctx, L, "NG", 1, 3, L.y + 50, 1, { icon: 40, h: 10 });
      bracket(ctx, L, "SA", 2, 5, L.y + 120, 1, { icon: 40, h: 10, alpha: 0.5 });
      cross(ctx, L.x + 4 * L.dx + 90, L.y + 120, 44);
      hand(ctx, "cabai dan bawang", X0 + 700, Y1 + 160, 28, { color: RED }); hand(ctx, "sudah terpakai", X0 + 700, Y1 + 196, 28, { color: RED });
    });
    ruleCard(ctx, X1, Y1, W, Hh, 4, "Bahan sisa keluar apa adanya", a4);
    alpha(ctx, a4, () => {
      icon(ctx, "B", X1 + 130, Y1 + 170, 70); arrow(ctx, X1 + 200, Y1 + 170, X1 + 300, Y1 + 170, 1, INK, 5);
      ctx.strokeStyle = "#6B7780"; ctx.lineWidth = 4; rr(ctx, X1 + 320, Y1 + 120, 120, 100, 14); ctx.stroke(); text(ctx, "mesin", X1 + 380, Y1 + 245, 24, { align: "center", weight: 800, color: GRAY });
      arrow(ctx, X1 + 460, Y1 + 170, X1 + 560, Y1 + 170, 1, INK, 5); icon(ctx, "B", X1 + 620, Y1 + 170, 70);
      const u = ord("soal4", () => P(l, at(b, "Jadi"), 0.6));
      hand(ctx, "= 1 keluaran", X1 + 640, Y1 + 270, 38, { color: ORANGE, alpha: u });
    });
  }
  function contoh(ctx, b, l) {
    board(ctx);
    const ord = prog(["soal5", "soal6"], b);
    const L = { x: 560, y: 270, dx: 132, s: 92 };
    text(ctx, "Masukan", 100, 285, 40, { weight: 900, color: C.ink2 });
    text(ctx, "Keluaran", 100, 585, 40, { weight: 900, color: C.ink2 });
    belt(ctx, L, { items: CONTOH, alpha: i => ord("soal5", () => P(l, at(b, "Masukannya") + i * 0.35, 0.4)) });
    const G = [["NG", 1, 3, "Nasi, cabai, dan bawang yang"], [null, 4, 4, "Bawang kedua"], ["SL", 5, 7, "Timun, selada, dan tomat menjadi"]];
    G.forEach(([d, a, z, ph], gi) => {
      const u = ord("soal5", () => P(l, at(b, ph), 1.0));
      const [x0] = bpos(L, a - 1), [x1] = bpos(L, z - 1);
      if (u > 0) {
        ctx.save(); ctx.globalAlpha *= clamp(u * 1.5, 0, 1); ctx.strokeStyle = d ? DC[d] : GRAY; ctx.lineWidth = 5; if (!d) ctx.setLineDash([10, 8]);
        rr(ctx, x0 - 62, 200, x1 - x0 + 124, 170, 16); ctx.stroke(); ctx.restore();
      }
      const cx = (x0 + x1) / 2, v = clamp((u - 0.4) / 0.6, 0, 1);
      arrow(ctx, cx, 385, cx, 480, v, d ? DC[d] : GRAY, 5);
      alpha(ctx, v, () => {
        icon(ctx, d || "B", cx, 560, d ? 104 : 88);
        text(ctx, d ? NAMA[d] : "bawang (sisa)", cx, 660, 34, { align: "center", weight: 900, color: d ? DC[d] : GRAY });
      });
      const nu = ord("soal6", () => P(l, at(b, "tiga keluaran") + gi * 0.4, 0.4));
      if (nu > 0) { chip(ctx, String(gi + 1), cx + 72, 500, 30, ORANGE, { alpha: nu }); }
    });
    const s = ord("soal6", () => P(l, at(b, "tiga keluaran"), 0.6));
    hand(ctx, "7 bahan → 3 keluaran", 960, 775, 54, { alpha: s });
  }
  function tantangan(ctx, b, l) {
    board(ctx);
    alpha(ctx, P(l, 0.2, 0.6), () => recipeStrip(ctx, 140, 205, 52));
    text(ctx, "Ban berjalan", 90, 360, 30, { weight: 900, color: C.accentDark });
    const L = Lrow(470);
    belt(ctx, L, { alpha: i => P(l, at(b, "dua puluh dua") + i * 0.07, 0.3) });
    const u = P(l, at(b, "Kita membacanya"), 0.9);
    arrow(ctx, 300, 640, 1620, 640, u, ORANGE, 7);
    hand(ctx, "dibaca dari kiri ke kanan", 960, 710, 44, { alpha: u });
    hand(ctx, "22 bahan", 1720, 370, 44, { color: INK, alpha: P(l, at(b, "dua puluh dua"), 0.6) });
  }

  // ---------- menghitung keluaran ----------
  function hitung(ctx, b, l) {
    board(ctx);
    const ord = prog(["a1", "a2", "a3", "a4", "a5", "a6"], b);
    const u1 = ord("a1", () => P(l, at(b, "Setiap keluaran"), 0.6));
    alpha(ctx, u1, () => {
      icon(ctx, "BG", 140, 205, 70); text(ctx, "1 hidangan = 1 keluaran", 200, 222, 40, { weight: 900, color: INK });
      icon(ctx, "T", 140, 295, 62); text(ctx, "1 bahan sisa = 1 keluaran", 200, 312, 40, { weight: 900, color: INK });
    });
    const u2 = ord("a2", () => P(l, at(b, "Kalau tidak"), 0.6));
    alpha(ctx, u2, () => { text(ctx, "Tanpa resep: 22 bahan → 22 keluaran", 100, 410, 38, { weight: 900, color: C.ink2, fit: 860 }); });
    const u3 = ord("a3", () => P(l, at(b, "Kalau resepnya"), 0.6));
    alpha(ctx, u3, () => {
      rowIcons(ctx, ["Ti", "S", "T"], 150, 520, 66, 84);
      [0, 1, 2].forEach(j => chip(ctx, "1", 150 + j * 84, 590, 22, GRAY, { light: true }));
      const v = ord("a3", () => P(l, at(b, "berubah menjadi"), 0.8));
      arrow(ctx, 360, 520, 470, 520, v, INK, 6);
      alpha(ctx, v, () => { icon(ctx, "SL", 540, 520, 84); chip(ctx, "1", 540, 590, 22, GREEN, { light: true }); });
      hand(ctx, "3 → 1: berkurang 2", 620, 532, 40, { align: "left",  color: ORANGE, alpha: ord("a3", () => P(l, at(b, "berkurang dua"), 0.6)) });
    });
    const u5 = ord("a5", () => P(l, at(b, "Jumlah keluaran sama"), 0.6));
    alpha(ctx, u5, () => {
      card(ctx, 90, 650, 860, 92, { fill: "#FFF8EE", stroke: ORANGE, lw: 4, r: 16 });
      text(ctx, "keluaran = 22 − total hemat", 520, 712, 44, { align: "center", weight: 900, color: INK });
    });
    const u6 = ord("a6", () => P(l, at(b, "Ada tujuh"), 0.6));
    alpha(ctx, u6, () => {
      text(ctx, "Contoh: 7 − (2 + 2) = 3", 120, 800, 40, { weight: 900, color: GREEN });
      tick(ctx, 640, 786, 44, ord("a6", () => P(l, at(b, "cocok"), 0.5)));
    });
    // tabel penghematan
    const u4 = ord("a4", () => P(l, at(b, "penghematan"), 0.6));
    alpha(ctx, u4, () => {
      card(ctx, 1010, 160, 830, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 18 });
      text(ctx, "Hidangan", 1050, 215, 30, { weight: 900, color: C.ink2 }); text(ctx, "Bahan", 1520, 215, 30, { align: "center", weight: 900, color: C.ink2 }); text(ctx, "Hemat", 1720, 215, 30, { align: "center", weight: 900, color: C.ink2 });
      const rows = [["NG", 3, "Nasi goreng"], ["RL", 3, "roti lapis"], ["SL", 3, "dan salad"], ["SA", 4, "Sate memakai"], ["BG", 6, "Burger memakai"]];
      rows.forEach(([d, n, ph], r) => {
        const y = 290 + r * 98, a = ord("a4", () => P(l, at(b, ph), 0.5));
        alpha(ctx, a, () => {
          icon(ctx, d, 1080, y, 64); text(ctx, NAMA[d], 1130, y + 14, 38, { weight: 900, color: DC[d] });
          text(ctx, String(n), 1520, y + 16, 46, { align: "center", weight: 900, color: INK });
        });
        const h = ord("a4", () => P(l, at(b, r < 3 ? "penghematannya dua" : r === 3 ? "penghematannya tiga" : "penghematannya lima"), 0.5));
        alpha(ctx, h, () => text(ctx, "−" + HEMAT[d], 1720, y + 16, 50, { align: "center", weight: 900, color: ORANGE }));
      });
    });
  }

  // ---------- cara cepat (greedy) ----------
  const GT = { g2: [["cocok dengan", 0], ["tomat dan daging", 1], ["tomat dan daging", 2]], g3: [["timun, selada, dan tomat menjadi", 3], ["Tomat yang", 4], ["Keju, daging", 5], ["satu tomat", 6]], g4: [["nasi, cabai, dan bawang", 7], ["Burger lebih", 8]] };
  function greedyU(b, l) {   // u per kelompok GREEDY
    const order = ["g1", "g2", "g3", "g4", "g5"], k = order.indexOf(b.id);
    const u = GREEDY.map(() => 0);
    order.forEach((id, j) => { (GT[id] || []).forEach(([ph, gi]) => { u[gi] = j < k ? 1 : j > k ? 0 : P(l, at(b, ph), 0.9); }); });
    if (b.id === "g5") u.fill(1);
    return u;
  }
  function rakus(ctx, b, l) {
    board(ctx);
    recipeStrip(ctx, 140, 195, 50);
    const L = Lrow(370);
    belt(ctx, L, { nums: 1 });
    const u = greedyU(b, l);
    GREEDY.forEach(([d, a, z], gi) => bracket(ctx, L, d, a, z, 480, u[gi], { icon: 50 }));
    // penunjuk baca
    const done = GREEDY.filter((g, gi) => u[gi] >= 0.5), pos = done.length ? done[done.length - 1][2] : 0;
    if (b.id !== "g5") { const [px] = bpos(L, Math.min(21, pos)); hand(ctx, "▼", px, 300, 34, { color: ORANGE }); }
    if (b.id === "g4") {
      const v = P(l, at(b, "bisa menjadi salad"), 0.8), w = P(l, at(b, "hasilnya malah"), 0.6);
      bracket(ctx, L, "SL", 17, 19, 600, v, { icon: 44, dash: true, alpha: 0.75 }); bracket(ctx, L, "RL", 20, 22, 600, v, { icon: 44, dash: true, alpha: 0.75 });
      hand(ctx, "salad + roti lapis → total 10", 1380, 700, 32, { color: GRAY, alpha: w });
      if (P(l, at(b, "Burger lebih"), 0.6) > 0) cross(ctx, 1560, 600, 50, P(l, at(b, "Burger lebih"), 0.6));
    }
    const n = GREEDY.filter((g, gi) => u[gi] >= 0.6).length;
    if (b.id !== "g1") {
      card(ctx, 90, 610, 400, 120, { fill: "#FFF8EE", stroke: ORANGE, lw: 4, r: 18 });
      text(ctx, "keluaran:", 120, 688, 40, { weight: 900, color: C.ink2 }); text(ctx, String(n), 420, 698, 72, { align: "center", weight: 900, color: ORANGE });
    } else hand(ctx, "langsung pakai resep pertama yang cocok", 960, 640, 44, { alpha: P(l, at(b, "setiap kali"), 0.6) });
    if (b.id === "g5") {
      hand(ctx, "Apakah 9 sudah paling sedikit?", 1150, 660, 44, { color: INK, alpha: P(l, at(b, "Apakah"), 0.6) });
      const t0 = at(b, "Hentikan");
      if (l > t0) thinkBadge(ctx, 640, 700, 640, 120, l - t0, b.dur - t0, "Cari cara yang lebih baik");
    }
  }

  // ---------- menandai semua kecocokan ----------
  function cocok(ctx, b, l) {
    board(ctx);
    recipeStrip(ctx, 140, 195, 50);
    const L = Lrow(345);
    const ord = prog(["m1", "m2", "m3", "m4", "m5"], b);
    const parts = ord("m5", () => P(l, at(b, "Bagian kiri"), 0.6));
    tint(ctx, L, 1, 8, "#FFF1E0", parts); tint(ctx, L, 10, 12, "#E3EEFB", ord("m5", () => P(l, at(b, "Bagian tengah"), 0.6))); tint(ctx, L, 14, 22, "#E6F5EA", ord("m5", () => P(l, at(b, "Bagian kanan"), 0.6)));
    belt(ctx, L, { nums: ord("m1", () => P(l, at(b, "setiap bahan diberi"), 0.8)) });
    const MT = { m2: ["Nasi goreng cocok", "Nasi goreng cocok", "Sate cocok"], m3: ["Salad cocok", "Roti lapis cocok", "Burger hanya"] };
    const MU = [ord("m2", () => P(l, at(b, "satu sampai tiga"), 0.9)), ord("m2", () => P(l, at(b, "Sate cocok"), 0.9)), ord("m3", () => P(l, at(b, "enam sampai"), 0.9)),
      ord("m3", () => P(l, at(b, "sepuluh sampai"), 0.9)), ord("m2", () => P(l, at(b, "empat belas"), 0.9)), ord("m3", () => P(l, at(b, "tujuh belas"), 0.9)),
      ord("m3", () => P(l, at(b, "dua puluh sampai"), 0.9)), ord("m3", () => P(l, at(b, "Burger hanya"), 0.9))];
    MATCH.forEach(([d, a, z, lane], i) => bracket(ctx, L, d, a, z, 460 + lane * 92, MU[i], { icon: 46 }));
    const r = ord("m4", () => P(l, at(b, "perhatikan tomat"), 0.8));
    [9, 13].forEach(n => { const [x, y] = bpos(L, n - 1); ring(ctx, x, y - 6, 44, 44, r, RED, 6); });
    const r2 = ord("m4", () => P(l, at(b, "pasti keluar"), 0.6));
    [9, 13].forEach(n => { const [x] = bpos(L, n - 1); hand(ctx, "pasti sisa", x, 268, 30, { color: RED, alpha: r2 }); });
    if (parts > 0) {
      [9, 13].forEach(n => { const [x] = bpos(L, n - 1); ctx.save(); ctx.globalAlpha *= parts; ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.setLineDash([12, 9]); ctx.beginPath(); ctx.moveTo(x - 30, 640); ctx.lineTo(x - 30, 770); ctx.moveTo(x + 30, 640); ctx.lineTo(x + 30, 770); ctx.stroke(); ctx.restore(); });
      const lab = (a, z, s, col, u) => { const [x0] = bpos(L, a - 1), [x1] = bpos(L, z - 1); hand(ctx, s, (x0 + x1) / 2, 700, 34, { color: col, alpha: u }); hand(ctx, "(" + a + "–" + z + ")", (x0 + x1) / 2, 745, 30, { color: col, alpha: u }); };
      lab(1, 8, "bagian kiri", ORANGE, parts); lab(10, 12, "tengah", BLUE, ord("m5", () => P(l, at(b, "Bagian tengah"), 0.6))); lab(14, 22, "bagian kanan", GREEN, ord("m5", () => P(l, at(b, "Bagian kanan"), 0.6)));
    }
  }

  // ---------- menyusun pilihan terbaik ----------
  function outRow(ctx, list, x, y, s, gap, u = 1) {   // deretan keluaran (hidangan / bahan sisa)
    list.forEach((k, i) => alpha(ctx, typeof u === "function" ? u(i) : u, () => {
      const isDish = !!DC[k];
      ctx.fillStyle = isDish ? DL[k] : "#F1F3F5"; ctx.strokeStyle = isDish ? DC[k] : GRAY; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + i * gap, y, s * 0.62, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      icon(ctx, k, x + i * gap, y, s * 0.92);
    }));
  }
  function susun(ctx, b, l) {
    board(ctx);
    const ord = prog(["s1", "s2", "s3", "s4", "s5", "s6", "s7"], b);
    const L = { x: 128, y: 200, dx: 79, s: 54 };
    tint(ctx, L, 1, 8, "#FFF1E0"); tint(ctx, L, 10, 12, "#E3EEFB"); tint(ctx, L, 14, 22, "#E6F5EA");
    belt(ctx, L, { nums: 1, dim: i => (i === 8 || i === 12) ? 0.6 : 0 });
    const rv = ord("s1", () => P(l, at(b, "cabai dan bawang nomor"), 0.8));
    [2, 3].forEach(n => { const [x, y] = bpos(L, n - 1); ring(ctx, x, y - 4, 36, 36, rv, ORANGE, 5); });
    hand(ctx, "rebutan cabai dan bawang", 420, 318, 30, { color: ORANGE, alpha: rv, align: "left" });
    // bagian kiri: dua pilihan
    text(ctx, "Bagian kiri (1–8)", 90, 318, 30, { weight: 900, color: ORANGE });
    const LA = { x: 175, y: 395, dx: 70, s: 50 }, LB = { x: 175, y: 525, dx: 70, s: 50 };
    const ua = ord("s2", () => P(l, at(b, "Kalau kita memilih nasi"), 0.6)), ub = ord("s3", () => P(l, at(b, "Kalau kita memilih sate"), 0.6));
    const left = BELT.slice(0, 8), base = ord("s1", () => P(l, 0.3, 0.6)), bo = { icon: 36, h: 8, lw: 4 };
    alpha(ctx, base, () => {
      text(ctx, "A", 95, 408, 36, { weight: 900, color: INK });
      left.forEach((k, i) => icon(ctx, k, LA.x + i * LA.dx, LA.y, LA.s));
      bracket(ctx, LA, "NG", 1, 3, 445, ua, bo); bracket(ctx, LA, null, 4, 4, 445, ua, bo); bracket(ctx, LA, null, 5, 5, 445, ua, bo); bracket(ctx, LA, "SL", 6, 8, 445, ua, bo);
      const v = ord("s2", () => P(l, at(b, "empat keluaran"), 0.6));
      outRow(ctx, ["NG", "T", "D", "SL"], 790, 405, 50, 70, v);
      text(ctx, "= 4", 1080, 421, 46, { weight: 900, color: RED, alpha: v });
      text(ctx, "B", 95, 538, 36, { weight: 900, color: INK });
      left.forEach((k, i) => icon(ctx, k, LB.x + i * LB.dx, LB.y, LB.s));
      bracket(ctx, LB, null, 1, 1, 575, ub, bo); bracket(ctx, LB, "SA", 2, 5, 575, ub, bo); bracket(ctx, LB, "SL", 6, 8, 575, ub, bo);
      const w = ord("s3", () => P(l, at(b, "tiga keluaran"), 0.6));
      outRow(ctx, ["N", "SA", "SL"], 790, 535, 50, 70, w);
      text(ctx, "= 3", 1010, 551, 46, { weight: 900, color: GREEN, alpha: w });
      tick(ctx, 1110, 535, 50, ord("s3", () => P(l, at(b, "lebih baik"), 0.6)));
    });
    // kanan: bagian tengah dan kanan
    const um = ord("s4", () => P(l, 0.2, 0.6)), ur = ord("s5", () => P(l, 0.2, 0.6));
    alpha(ctx, um, () => {
      card(ctx, 1200, 290, 640, 120, { fill: "#F2F7FD", stroke: BLUE, lw: 3, r: 16 });
      text(ctx, "Tengah (10–12)", 1225, 330, 28, { weight: 900, color: BLUE });
      rowIcons(ctx, ["K", "D", "R"], 1250, 375, 44, 54); arrow(ctx, 1400, 375, 1460, 375, 1, INK, 4); outRow(ctx, ["RL"], 1520, 372, 50, 70);
      text(ctx, "= 1", 1700, 390, 46, { weight: 900, color: BLUE });
    });
    alpha(ctx, ur, () => {
      card(ctx, 1200, 425, 640, 145, { fill: "#F1FAF3", stroke: GREEN, lw: 3, r: 16 });
      text(ctx, "Kanan (14–22)", 1225, 465, 28, { weight: 900, color: GREEN });
      outRow(ctx, ["NG", "BG"], 1270, 520, 50, 80, i => i === 0 ? ord("s5", () => P(l, at(b, "menjadi nasi goreng"), 0.5)) : ord("s5", () => P(l, at(b, "menjadi burger"), 0.5)));
      text(ctx, "9 bahan → 2 hidangan", 1400, 532, 30, { weight: 800, color: INK, fit: 300 });
      text(ctx, "= 2", 1760, 537, 46, { weight: 900, color: GREEN });
    });
    // ringkasan
    const s6 = ord("s6", () => P(l, 0.2, 0.6));
    alpha(ctx, s6, () => {
      card(ctx, 90, 615, 1090, 150, { fill: "#FFFFFF", stroke: ORANGE, lw: 4, r: 18 });
      const T = atSeq(b, ["Bagian kiri", "tomat nomor sembilan", "Bagian tengah", "tomat nomor tiga belas", "bagian kanan", "Tiga ditambah"]);
      const grp = [[0, 3], [3, 4], [4, 5], [5, 6], [6, 8]];
      outRow(ctx, BEST.map(g => g[0] || BELT[g[1] - 1]), 150, 690, 50, 70, i => {
        if (b.id !== "s6") return 1; const gi = grp.findIndex(g => i >= g[0] && i < g[1]); return P(l, T[gi], 0.5);
      });
      const e = b.id === "s6" ? P(l, T[5], 0.6) : 1;
      text(ctx, "3 + 1 + 1 + 1 + 2 = 8", 900, 690, 44, { align: "center", weight: 900, color: ORANGE, alpha: e });
      text(ctx, "8 keluaran", 900, 742, 32, { align: "center", weight: 900, color: INK, alpha: e });
    });
    const s7 = ord("s7", () => P(l, 0.2, 0.6));
    alpha(ctx, s7, () => {
      card(ctx, 1200, 590, 640, 175, { fill: "#FFF8EE", stroke: ORANGE, lw: 3, r: 16 });
      text(ctx, "Cek dengan penghematan", 1225, 630, 28, { weight: 900, color: C.accentDark });
      text(ctx, "3 + 2 + 2 + 2 + 5 = 14", 1520, 688, 40, { align: "center", weight: 900, color: INK, alpha: P(l, at(b, "Sate menghemat"), 0.6) });
      text(ctx, "22 − 14 = 8", 1520, 745, 44, { align: "center", weight: 900, color: GREEN, alpha: P(l, at(b, "Totalnya"), 0.6) });
    });
  }

  // ---------- bukti: 7 tidak mungkin ----------
  function bukti(ctx, b, l) {
    board(ctx);
    const ord = prog(["t1", "t2", "t3", "t4"], b);
    text(ctx, "Bisakah hanya 7 keluaran?", 960, 205, 50, { align: "center", weight: 900, color: INK });
    const cols = [["Kiri (1–8)", 410, ORANGE, "≥ 3", "nasi goreng atau sate:", "terbaik 3"], ["Tomat 9", 220, RED, "= 1", "pasti", "sisa"], ["Tengah", 280, BLUE, "≥ 1", "", "roti lapis"], ["Tomat 13", 220, RED, "= 1", "pasti", "sisa"], ["Kanan (14–22)", 420, GREEN, "≥ 2", "9 bahan, resep", "terpanjang 6"]];
    const T2 = atSeq(b, ["Dua tomat", "Bagian tengah", "Bagian kanan"]);
    const show = [ord("t3", () => P(l, 0.2, 0.6)), ord("t2", () => P(l, T2[0], 0.6)), ord("t2", () => P(l, T2[1], 0.6)), ord("t2", () => P(l, T2[0], 0.6)), ord("t2", () => P(l, T2[2], 0.6))];
    let x = 90;
    cols.forEach(([h, w, col, v, n1, n2], i) => {
      const xx = x; x += w + 30;
      alpha(ctx, show[i], () => {
        card(ctx, xx, 260, w, 360, { fill: "#FFFFFF", stroke: col, lw: 4, r: 18 });
        text(ctx, h, xx + w / 2, 310, 30, { align: "center", weight: 900, color: col, fit: w - 20 });
        text(ctx, v, xx + w / 2, 450, 96, { align: "center", weight: 900, color: INK });
        hand(ctx, n1, xx + w / 2, 545, 26, { color: C.ink2 }); hand(ctx, n2, xx + w / 2, 582, 26, { color: C.ink2 });
      });
    });
    const s = ord("t4", () => P(l, 0.2, 0.6));
    alpha(ctx, s, () => {
      text(ctx, "paling sedikit 3 + 1 + 1 + 1 + 2 = 8", 960, 710, 56, { align: "center", weight: 900, color: ORANGE });
    });
    const c = ord("t4", () => P(l, at(b, "Tujuh keluaran"), 0.6));
    alpha(ctx, c, () => { text(ctx, "7 keluaran", 820, 795, 48, { align: "center", weight: 900, color: RED }); });
    cross(ctx, 820, 780, 70, c);
    hand(ctx, "tidak mungkin", 1180, 800, 44, { color: RED, alpha: c });
  }

  // ---------- penutup ----------
  function komputer(ctx, b, l) {
    board(ctx);
    if (b.id === "c1") {
      const S = "MAKANMAKANMINUMMAKAN".split("");
      const u = P(l, at(b, "mengganti"), 1.0), v = P(l, at(b, "sependek"), 0.6);
      text(ctx, "Data asli (20 huruf)", 110, 210, 32, { weight: 900, color: C.ink2 });
      S.forEach((ch, i) => { const x = 130 + i * 84, inM = !(i >= 10 && i < 15); ctx.fillStyle = inM ? lerp(0, 1, u) > 0.5 ? "#FDEBD8" : "#F7F9FA" : "#F7F9FA"; ctx.strokeStyle = "#C9D2D8"; ctx.lineWidth = 2; rr(ctx, x - 36, 250, 72, 80, 10); ctx.fill(); ctx.stroke(); text(ctx, ch, x, 308, 44, { align: "center", weight: 900, color: INK }); });
      alpha(ctx, u, () => {
        card(ctx, 110, 400, 520, 110, { fill: "#FFF8EE", stroke: ORANGE, lw: 3, r: 16 });
        text(ctx, "Kamus:  ①  = MAKAN", 140, 470, 40, { weight: 900, color: ORANGE });
        text(ctx, "Hasil kompresi (8 tanda)", 110, 590, 32, { weight: 900, color: C.ink2 });
        ["①", "①", "M", "I", "N", "U", "M", "①"].forEach((ch, i) => { const x = 130 + i * 84; ctx.fillStyle = ch === "①" ? "#FDEBD8" : "#F7F9FA"; ctx.strokeStyle = ch === "①" ? ORANGE : "#C9D2D8"; ctx.lineWidth = 2; rr(ctx, x - 36, 630, 72, 80, 10); ctx.fill(); ctx.stroke(); text(ctx, ch, x, 688, 44, { align: "center", weight: 900, color: ch === "①" ? ORANGE : INK }); });
      });
      hand(ctx, "sependek mungkin", 1380, 690, 46, { alpha: v });
      kiko(ctx, 1600, 430, 180, 0, { mood: "happy", wave: l * 0.4 });
    } else {
      const u = P(l, 0.2, 0.6), v = P(l, at(b, "algoritma greedy"), 0.6), w = P(l, at(b, "membandingkan"), 0.6);
      alpha(ctx, u, () => {
        card(ctx, 110, 200, 800, 460, { fill: "#FFF5F4", stroke: RED, lw: 4, r: 20 });
        text(ctx, "Langsung ambil yang pertama", 510, 270, 40, { align: "center", weight: 900, color: INK, fit: 740 });
        text(ctx, "9 keluaran", 510, 450, 96, { align: "center", weight: 900, color: RED });
        hand(ctx, "algoritma greedy", 510, 590, 46, { color: RED, alpha: v });
      });
      alpha(ctx, w, () => {
        card(ctx, 1010, 200, 800, 460, { fill: "#F1FAF3", stroke: GREEN, lw: 4, r: 20 });
        text(ctx, "Bandingkan pilihan yang berebut", 1410, 270, 40, { align: "center", weight: 900, color: INK, fit: 740 });
        text(ctx, "8 keluaran", 1410, 450, 96, { align: "center", weight: 900, color: GREEN });
        hand(ctx, "nasi goreng atau sate?", 1410, 590, 40, { color: GREEN });
      });
    }
  }
  function langkah(ctx, b, l) {
    board(ctx);
    text(ctx, "Tiga langkah", 960, 205, 48, { align: "center", weight: 900, color: INK });
    const T = atSeq(b, ["Pertama", "Kedua", "Ketiga"]);
    const L = [["1", "Tandai semua tempat", "yang cocok dengan pola"], ["2", "Bandingkan pilihan", "yang saling berebut"], ["3", "Buktikan jawaban yang", "lebih kecil tidak mungkin"]];
    L.forEach(([n, s1, s2], i) => alpha(ctx, P(l, T[i], 0.6), () => {
      const x = 110 + i * 580;
      card(ctx, x, 270, 540, 420, { fill: "#F7F9FA", stroke: C.accent, lw: 4, r: 22 });
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(x + 270, 360, 50, 0, Math.PI * 2); ctx.fill();
      text(ctx, n, x + 270, 384, 64, { align: "center", weight: 900, color: "#FFFFFF" });
      text(ctx, s1, x + 270, 500, 38, { align: "center", weight: 900, color: INK, fit: 500 });
      text(ctx, s2, x + 270, 555, 38, { align: "center", weight: 900, color: INK, fit: 500 });
      if (i === 0) rowIcons(ctx, ["Ti", "S", "T"], x + 190, 630, 46, 80);
      if (i === 1) { icon(ctx, "NG", x + 210, 630, 56); text(ctx, "atau", x + 270, 642, 28, { align: "center", weight: 800, color: C.ink2 }); icon(ctx, "SA", x + 330, 630, 56); }
      if (i === 2) text(ctx, "7 ✗   8 ✓", x + 270, 648, 40, { align: "center", weight: 900, color: ORANGE });
    }));
  }

  // ---------- versi vertikal (Short) ----------
  function resep_v(ctx, b, l) {
    board(ctx);
    text(ctx, "Lima resep mesin", 960, 200, 44, { align: "center", weight: 900, color: INK });
    RESEP.forEach(([d, ing], r) => {
      const y = 270 + r * 98;
      ing.forEach((k, j) => icon(ctx, k, 520 + j * 78, y, 62));
      arrow(ctx, 990, y, 1050, y, 1, INK, 5);
      icon(ctx, d, 1105, y, 76); text(ctx, NAMA[d], 1160, y + 13, 34, { weight: 900, color: DC[d], fit: 280 });
    });
    text(ctx, "urutan persis · tidak dilewati · sekali pakai", 960, 790, 34, { align: "center", weight: 900, color: ORANGE, fit: 960 });
  }
  function contoh_v(ctx, b, l) {
    board(ctx);
    const L = { x: 575, y: 260, dx: 128, s: 92 };
    belt(ctx, L, { items: CONTOH });
    const G = [["NG", 1, 3], [null, 4, 4], ["SL", 5, 7]];
    G.forEach(([d, a, z], gi) => {
      const [x0] = bpos(L, a - 1), [x1] = bpos(L, z - 1), cx = (x0 + x1) / 2;
      ctx.save(); ctx.strokeStyle = d ? DC[d] : GRAY; ctx.lineWidth = 5; if (!d) ctx.setLineDash([10, 8]); rr(ctx, x0 - 60, 185, x1 - x0 + 120, 170, 16); ctx.stroke(); ctx.restore();
      arrow(ctx, cx, 370, cx, 450, 1, d ? DC[d] : GRAY, 5);
      icon(ctx, d || "B", cx, 530, d ? 110 : 92);
      text(ctx, d ? NAMA[d] : "bawang (sisa)", cx, 635, 34, { align: "center", weight: 900, color: d ? DC[d] : GRAY });
      chip(ctx, String(gi + 1), cx + 76, 470, 30, ORANGE);
    });
    hand(ctx, "7 bahan → 3 keluaran", 960, 770, 56);
  }
  function tantangan_v(ctx, b, l) {
    board(ctx);
    text(ctx, "22 bahan masuk ke mesin", 960, 205, 44, { align: "center", weight: 900, color: INK });
    twoRows(ctx, [], 320, 520);
    const t0 = 0.6;
    thinkBadge(ctx, 520, 680, 880, 130, Math.max(0, l - t0), b.dur - t0, "Berapa keluaran paling sedikit?");
  }
  // dua baris (1–13, 14–22) dengan kurung; tidak ada kurung yang terpotong baris
  function twoRows(ctx, groups, y1, y2) {
    const LA = LV(y1), LB = LV(y2);
    belt(ctx, LA, { nums: 1, items: BELT.slice(0, 13) });
    belt(ctx, LB, { items: BELT.slice(13) });
    BELT.slice(13).forEach((k, i) => text(ctx, String(i + 14), LB.x + i * LB.dx, y2 + LB.s * 0.98, Math.round(LB.s * 0.36), { align: "center", weight: 800, color: C.ink2 }));
    groups.forEach(([d, a, z, lane = 0]) => {
      if (z <= 13) bracket(ctx, LA, d, a, z, y1 + 100 + lane * 72, 1, { icon: 42, h: 10 });
      else bracket(ctx, LB, d, a - 13, z - 13, y2 + 100 + lane * 72, 1, { icon: 42, h: 10 });
    });
    return [LA, LB];
  }
  function rakus_v(ctx, b, l) {
    board(ctx);
    text(ctx, "Langsung pakai resep pertama yang cocok", 960, 195, 36, { align: "center", weight: 900, color: INK, fit: 960 });
    twoRows(ctx, GREEDY.map(g => [g[0], g[1], g[2], 0]), 290, 520);
    card(ctx, 700, 730, 520, 110, { fill: "#FFF8EE", stroke: ORANGE, lw: 4, r: 18 });
    text(ctx, "9 keluaran", 960, 805, 60, { align: "center", weight: 900, color: ORANGE });
  }
  function cocok_v(ctx, b, l) {
    board(ctx);
    text(ctx, "Tandai semua yang cocok", 960, 195, 40, { align: "center", weight: 900, color: INK });
    const [LA, LB] = twoRows(ctx, MATCH.map(m => [m[0], m[1], m[2], m[3]]), 300, 590);
    [8, 12].forEach(i => { const [x, y] = bpos(LA, i); ring(ctx, x, y - 4, 40, 40, 1, RED, 6); hand(ctx, "pasti sisa", i === 12 ? x - 30 : x, y - 52, 26, { color: RED }); });
  }
  function susun_v(ctx, b, l) {
    board(ctx);
    text(ctx, "Pilihan terbaik", 960, 195, 40, { align: "center", weight: 900, color: INK });
    twoRows(ctx, BEST.map(g => [g[0], g[1], g[2], 0]), 280, 490);
    const fin = b.id === "h6";
    outRow(ctx, BEST.map(g => g[0] || BELT[g[1] - 1]), 600, 720, 56, 104);
    alpha(ctx, fin ? 1 : 0, () => text(ctx, "3 + 1 + 1 + 1 + 2 = 8", 960, 825, 52, { align: "center", weight: 900, color: ORANGE }));
    if (!fin) text(ctx, "sate lebih hemat dari nasi goreng", 960, 825, 38, { align: "center", weight: 900, color: GREEN, fit: 960 });
  }

  Object.assign(K.SCENES, {
    mesin, resep, aturan_soal, contoh, tantangan, pilihan, hitung, rakus, cocok, susun, bukti, komputer, langkah,
    resep_v, contoh_v, tantangan_v, rakus_v, cocok_v, susun_v,
    buka(ctx, b, l) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "lomba"), 0.8) : 1;
      alpha(ctx, bu, () => {
        machine(ctx, 1080, 430, 420, 240, {});
        beltBand(ctx, 760, 1040, 610, 54); ["N", "C", "B"].forEach((k, i) => icon(ctx, k, 790 + i * 90, 604, 56));
        icon(ctx, "NG", 1600, 604, 80);
        beaver(ctx, 1700, 470, 110);
      });
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
      const fu = P(l, at(b, "Pakistan"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagPK(ctx, 470, 230, 180); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Pakistan"), 0.8);
      if (au > 0) ring(ctx, 1175, 300 + 2 * 92 - 14, 210, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 300, 520, 210, 0, { wave: l, mood: "happy" });
      machine(ctx, 520, 380, 360, 220, {});
      beaver(ctx, 960, 470 + Math.sin(l * 3) * 8, 110);
      outRow(ctx, ["NG", "SA", "BG", "RL", "SL"], 560, 720, 60, 82);
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1330, y, 34, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 470 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 640, 820, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 72, { align: "center", weight: 900, color: INK, fit: 1000 });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Mengapa 7 keluaran tidak mungkin?", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
