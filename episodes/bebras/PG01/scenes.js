/* PG01 Pembahasan Soal Bebras 2025-DE-07 "Pohon Keluarga" (Jerman), kategori Penegak (SMA).
   Gaya papan tulis putih dengan coretan spidol (sama dengan seri Bebras B01–SG03) + simulasi:
   pohon keluarga berang-berang digambar ulang (pita = perempuan, topi = laki-laki, dua cincin = suami istri,
   panah dari pasangan ke anak), tulisan fungsi bertingkat ayah(X)/ibu(X) yang dikerjakan dari kurung paling dalam,
   penunjuk kuning yang berjalan MELAWAN arah panah (dari anak ke orang tua), dan pohon pilihan 2×2×2 untuk bukti.
   Warna keluarga mengikuti gambar soal: merah (Christina), biru tua (Emil–Gerda), hijau (Bernard), oranye, biru muda;
   Annika merah muda, Daniel ungu.
   Papan: x 52–1868, y 130–830 (kartu narasi 3 baris mulai y≈840, 4 baris y≈783).
   Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, bubble, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F7FD1",
        GRAYT = "#8A96A0", FUR = "#8E5B3A", FUR2 = "#B98458", HL = "rgba(242,177,52,0.80)";
  const META = { judul: "Pohon Keluarga", tahun: "2025", negara: "Jerman", kode: "2025-DE-07" };

  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const atI = (b, i) => lead(b) + Math.max(0, i) / TXT(b).length * (b.src_audio || b.audio || b.dur);
  const at = (b, s, from = 0) => {
    const T = TXT(b); let i = T.indexOf(s, typeof from === "string" ? Math.max(0, T.indexOf(from)) : from);
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
      const a = Math.atan2(end[1] - prev[1], end[0] - prev[0]), hs = typeof head === "number" ? head : w * 3.2;
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
    text(ctx, q, x + h + 20, y + h * 0.78, 28, { weight: 800, color: INK, fit: w - h - 40 });
  }

  // ---------- kepala berang-berang (pita = perempuan, topi = laki-laki) ----------
  const FAM = { red: "#E0322F", blue: "#2A35A8", green: "#2E8B2E", orange: "#F0A10E", lb: "#22A3DC", pink: "#E05AA6", purple: "#6A2CC4", lilac: "#A07CD6", teal: "#1F7FA6" };
  function bHead(ctx, x, y, r, sex, col, opt = {}) {
    ctx.save(); ctx.translate(x, y); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    const fur = sex === "m" ? "#D9A15E" : "#97603A", fur2 = sex === "m" ? "#F2CC94" : "#D3A274", edge = "#4A2E1C";
    ctx.lineWidth = Math.max(1.5, r * 0.06); ctx.strokeStyle = edge;
    for (const k of [-1, 1]) { ctx.fillStyle = fur; ctx.beginPath(); ctx.arc(k * r * 0.66, -r * 0.7, r * 0.24, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#5E3B24"; ctx.beginPath(); ctx.arc(k * r * 0.66, -r * 0.7, r * 0.11, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = fur; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.92, r, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = fur2; ctx.beginPath(); ctx.ellipse(0, r * 0.36, r * 0.56, r * 0.42, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1B120C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * r * 0.34, -r * 0.16, r * 0.12, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#fff"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * r * 0.34 + r * 0.04, -r * 0.2, r * 0.045, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#2A1B12"; ctx.beginPath(); ctx.ellipse(0, r * 0.14, r * 0.2, r * 0.13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.lineWidth = Math.max(1, r * 0.035); rr(ctx, -r * 0.17, r * 0.42, r * 0.34, r * 0.3, r * 0.06); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, r * 0.42); ctx.lineTo(0, r * 0.72); ctx.stroke();
    if (sex === "m") {   // topi: kubah berwarna dengan pelindung ke kiri
      ctx.fillStyle = col; ctx.strokeStyle = "rgba(0,0,0,0.45)"; ctx.lineWidth = Math.max(1.5, r * 0.05);
      ctx.beginPath(); ctx.ellipse(0, -r * 0.6, r * 0.86, r * 0.52, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(-r * 0.86, -r * 0.6, r * 0.62, r * 0.15, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.arc(0, -r * 1.1, r * 0.09, 0, Math.PI * 2); ctx.fill();
    } else {             // pita: ikat kepala + simpul dua kelopak di kanan atas
      ctx.strokeStyle = col; ctx.lineWidth = Math.max(2, r * 0.12); ctx.beginPath(); ctx.ellipse(0, -r * 0.12, r * 0.9, r * 0.82, 0, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
      ctx.save(); ctx.translate(r * 0.42, -r * 0.92); ctx.fillStyle = col; ctx.strokeStyle = "rgba(0,0,0,0.45)"; ctx.lineWidth = Math.max(1.2, r * 0.04);
      for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(k * r * 0.5, -r * 0.42, k * r * 0.56, 0); ctx.quadraticCurveTo(k * r * 0.5, r * 0.36, 0, 0); ctx.fill(); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    }
    ctx.restore();
  }
  function cincin(ctx, x, y, r, col) {
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = Math.max(2, r * 0.32);
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(x + k * r * 0.55, y, r, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  }
  function nameTag(ctx, s, cx, cy, size, bg, opt = {}) {
    const w = tw(ctx, s, size, 800) + size * 0.8, h = size * 1.4;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = opt.light ? "#FFFFFF" : bg; ctx.strokeStyle = bg; ctx.lineWidth = Math.max(2, size * 0.1); rr(ctx, cx - w / 2, cy - h / 2, w, h, size * 0.3); ctx.fill(); if (opt.light) ctx.stroke();
    text(ctx, s, cx, cy + size * 0.36, size, { align: "center", weight: 800, color: opt.light ? bg : "#FFFFFF" });
    ctx.restore(); return w;
  }

  // ---------- pohon keluarga (koordinat pohon; kepala berjari-jari 42) ----------
  const PP = {
    RM: { x: 80, y: 60, sex: "m", col: FAM.red, desc: "suami Christina" },
    CH: { x: 210, y: 60, sex: "f", col: FAM.red, name: "Christina", tag: FAM.red, lab: "up" },
    EM: { x: 560, y: 60, sex: "m", col: FAM.blue, name: "Emil", tag: FAM.blue, lab: "up" },
    GE: { x: 690, y: 60, sex: "f", col: FAM.blue, name: "Gerda", tag: FAM.blue, lab: "up" },
    BE: { x: 250, y: 250, sex: "m", col: FAM.green, name: "Bernard", tag: FAM.green, lab: "down", dx: -18 },
    IA: { x: 380, y: 250, sex: "f", col: FAM.green },
    OM: { x: 700, y: 250, sex: "m", col: FAM.orange },
    OF: { x: 830, y: 250, sex: "f", col: FAM.orange },
    AN: { x: 315, y: 430, sex: "f", col: FAM.pink, name: "Annika", tag: "#D6559B", lab: "down" },
    LM: { x: 635, y: 430, sex: "m", col: FAM.lb },
    LF: { x: 765, y: 430, sex: "f", col: FAM.lb },
    DA: { x: 530, y: 600, sex: "m", col: FAM.purple, name: "Daniel", tag: FAM.purple, lab: "down" },
    S1: { x: 700, y: 600, sex: "f", col: FAM.lilac },
    S2: { x: 870, y: 600, sex: "f", col: FAM.teal },
  };
  const GEN = { RM: 0, CH: 0, EM: 0, GE: 0, BE: 1, IA: 1, OM: 1, OF: 1, AN: 2, LM: 2, LF: 2, DA: 3, S1: 3, S2: 3 };
  const COUPLES = [["RM", "CH", FAM.red], ["EM", "GE", FAM.blue], ["BE", "IA", FAM.green], ["OM", "OF", FAM.orange], ["LM", "LF", FAM.lb]];
  const ARROWS = {
    red: { col: FAM.red, gen: 1, pts: [[145, 88], [145, 140], [250, 140], [250, 188]] },
    blueL: { col: FAM.blue, gen: 1, pts: [[625, 88], [625, 150], [380, 150], [380, 188]] },
    blueR: { col: FAM.blue, gen: 1, pts: [[625, 150], [830, 150], [830, 188]] },
    green: { col: FAM.green, gen: 2, pts: [[315, 280], [315, 368]] },
    orange: { col: FAM.orange, gen: 2, pts: [[765, 280], [765, 368]] },
    lbA: { col: FAM.lb, gen: 3, pts: [[700, 460], [700, 512], [530, 512], [530, 540]] },
    lbB: { col: FAM.lb, gen: 3, pts: [[700, 512], [700, 540]] },
    lbC: { col: FAM.lb, gen: 3, pts: [[700, 512], [870, 512], [870, 540]] },
  };
  const tp = (T, x, y) => [T.ox + x * T.s, T.oy + y * T.s];
  const pos = (T, id) => tp(T, PP[id].x, PP[id].y);
  // label tambahan (mis. "ibu Annika") tepat di bawah kepala tanpa nama
  const XTAG = { IA: { s: "ibu Annika", dx: 30, dy: 70 }, LF: { s: "ibu Daniel", dx: 118, dy: 4 } };

  /* opt: show(id)->alpha orang, arr(id)->alpha panah, glowA(id) panah disorot, glow(id) kepala disorot,
     dim(id) 0..1 meredupkan, names (alpha label nama), xtag(id)->alpha label tambahan, under(ctx) digambar di bawah kepala,
     blink {f, m} kedip pita/topi, ringsHl alpha cincin disorot */
  function tree(ctx, T, opt = {}) {
    const s = T.s, show = opt.show || (() => 1), arr = opt.arr || (() => 1), dim = opt.dim || (() => 0);
    // panah
    Object.keys(ARROWS).forEach(k => {
      const A = ARROWS[k], a = arr(k); if (a <= 0) return;
      const pts = A.pts.map(p => tp(T, p[0], p[1]));
      const g = opt.glowA ? opt.glowA(k) : 0;
      if (g > 0) alpha(ctx, g, () => mline(ctx, pts, 1, "rgba(242,177,52,0.55)", 20 * s));
      alpha(ctx, opt.arrDim ? 1 - 0.7 * opt.arrDim(k) : 1, () => mline(ctx, pts, a, A.col, Math.max(3, 4.5 * s), 16 * s));
    });
    // cincin pasangan
    COUPLES.forEach(([a1, a2, col]) => {
      const al = Math.min(show(a1), show(a2)); if (al <= 0) return;
      const [x1, y1] = pos(T, a1), [x2] = pos(T, a2);
      alpha(ctx, al * (1 - 0.7 * Math.min(dim(a1), dim(a2))), () => cincin(ctx, (x1 + x2) / 2, y1, 9 * s, col));
      const rh = opt.ringsHl ? opt.ringsHl(a1) : 0;
      if (rh > 0) ring(ctx, (x1 + x2) / 2, y1, 22 * s, 18 * s, rh, ORANGE, Math.max(3, 4 * s));
    });
    if (opt.under) opt.under(ctx);
    // kepala
    Object.keys(PP).forEach(id => {
      const p = PP[id], a = show(id); if (a <= 0) return;
      const [x, y] = pos(T, id), g = opt.glow ? opt.glow(id) : 0;
      if (g > 0) alpha(ctx, g, () => { ctx.fillStyle = "rgba(255,206,64,0.55)"; ctx.beginPath(); ctx.arc(x, y - 6 * s, 64 * s, 0, Math.PI * 2); ctx.fill(); });
      const bl = opt.blink ? (p.sex === "f" ? opt.blink.f : opt.blink.m) || 0 : 0;
      if (bl > 0) alpha(ctx, bl, () => { ctx.strokeStyle = p.sex === "f" ? "#D0457A" : "#2F7FD1"; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.arc(p.sex === "f" ? x + 18 * s : x - 10 * s, y - 40 * s, 34 * s, 0, Math.PI * 2); ctx.stroke(); });
      bHead(ctx, x, y, 42 * s, p.sex, p.col, { alpha: a * (1 - 0.72 * dim(id)) });
      if (p.name && (opt.names == null ? 1 : opt.names) > 0) {
        const ly = p.lab === "up" ? y - 76 * s : y + 70 * s, nb = opt.nameBoost ? opt.nameBoost(id) : 0;
        alpha(ctx, a * (opt.names == null ? 1 : opt.names) * (1 - 0.6 * dim(id)), () => {
          if (nb > 0) { ctx.save(); ctx.globalAlpha *= nb; ctx.fillStyle = "rgba(255,206,64,0.8)"; const w = tw(ctx, p.name, 27 * s, 800) + 50 * s; rr(ctx, x + (p.dx || 0) * s - w / 2, ly - 30 * s, w, 60 * s, 14 * s); ctx.fill(); ctx.restore(); }
          nameTag(ctx, p.name, x + (p.dx || 0) * s, ly, 27 * s, p.tag);
        });
      }
      const xt = opt.xtag ? opt.xtag(id) : 0;
      if (xt > 0 && XTAG[id]) alpha(ctx, xt * a, () => nameTag(ctx, XTAG[id].s, x + XTAG[id].dx * s, y + XTAG[id].dy * s, 25 * s, p.col, { light: true }));
    });
  }
  // penunjuk kuning: berjalan dari kepala ke kepala (melawan arah panah), u 0..1 untuk seluruh jalan
  function walk(ctx, T, ids, u, opt = {}) {
    if (u <= 0) return;
    const pts = ids.map(id => pos(T, id)), segs = pts.length - 1, s = T.s;
    const k = clamp(u, 0, 1) * segs, n = Math.floor(Math.min(k, segs - 1e-6)), f = k - n;
    const shorten = (a, c, r) => { const d = Math.hypot(c[0] - a[0], c[1] - a[1]); return [a[0] + (c[0] - a[0]) * r / d, a[1] + (c[1] - a[1]) * r / d]; };
    const col = opt.color || HL;
    for (let i = 0; i < segs; i++) {
      const uu = i < n ? 1 : i === n ? f : 0; if (uu <= 0) continue;
      const a = shorten(pts[i], pts[i + 1], 40 * s), c = shorten(pts[i + 1], pts[i], 48 * s);
      mline(ctx, [a, c], uu, col, 13 * s, 30 * s);
    }
  }
  function walkGlow(ids, u) {   // kepala yang sudah dilalui penunjuk
    const segs = ids.length - 1;
    return id => { const i = ids.indexOf(id); if (i < 0) return 0; return clamp(u * segs - i + 1, 0, 1); };
  }

  // ---------- tulisan fungsi bertingkat ----------
  const BRC = ["#7A8794", ORANGE, "#16808F", "#9B45C4"];
  /* expr: tulisan seperti "ayah(ibu(Annika))"; kotak kosong ditulis "#0", "#1", "#2".
     opt.fill[k] isi kotak (string atau ""), opt.fillA[k] alpha isi, opt.hl: [i0, i1] indeks token yang dikotaki kuning,
     opt.pillName: ganti nama dengan pil berkepala (mis. {"ibu Annika": "IA"}). Kembali: daftar token {s, x0, x1}. */
  function expr(ctx, src, x, y, size, opt = {}) {
    const toks = src.match(/#\d|ayah|ibu|\(|\)|=|≠|\?|\[[^\]]+\]|[A-Za-zé-]+|\s+/g) || [];
    let depth = 0; const items = [];
    toks.forEach(t => {
      if (/^\s+$/.test(t)) { items.push({ s: t, w: size * 0.3, kind: "sp" }); return; }
      if (t === "(") { depth++; items.push({ s: t, w: tw(ctx, t, size, 700), kind: "br", d: depth }); return; }
      if (t === ")") { items.push({ s: t, w: tw(ctx, t, size, 700), kind: "br", d: depth }); depth--; return; }
      if (t[0] === "#") { items.push({ s: t, w: size * 2.6, kind: "box", k: +t[1] }); return; }
      if (t[0] === "[") { const nm = t.slice(1, -1); items.push({ s: nm, w: tw(ctx, nm, size * 0.62, 800) + size * 1.45, kind: "pill", id: (opt.pill || {})[nm] }); return; }
      const fn = t === "ayah" || t === "ibu";
      items.push({ s: t, w: tw(ctx, t, size, fn ? 800 : 900), kind: fn ? "fn" : t === "=" || t === "≠" ? "op" : "name" });
    });
    const W = items.reduce((a, it) => a + it.w, 0);
    let cx = opt.align === "center" ? x - W / 2 : opt.align === "right" ? x - W : x;
    items.forEach(it => { it.x0 = cx; it.x1 = cx + it.w; cx += it.w; });
    if (opt.hl) {
      const [i0, i1] = opt.hl, a = opt.hlA == null ? 1 : opt.hlA, its = items.filter(i => i.kind !== "sp");
      if (a > 0 && its[i0] && its[i1]) alpha(ctx, a, () => { ctx.fillStyle = "rgba(255,214,90,0.55)"; rr(ctx, its[i0].x0 - 10, y - size * 0.98, its[i1].x1 - its[i0].x0 + 20, size * 1.32, 12); ctx.fill(); });
    }
    items.forEach(it => {
      if (it.kind === "sp") return;
      if (it.kind === "br") { text(ctx, it.s, it.x0, y, size, { weight: 700, color: BRC[(it.d - 1) % 4] }); return; }
      if (it.kind === "box") {
        const fill = opt.fill ? opt.fill[it.k] : "", fa = opt.fillA ? opt.fillA[it.k] : 1, bl = opt.boxHl ? opt.boxHl[it.k] || 0 : 0;
        const bx = it.x0 + size * 0.08, bw = it.w - size * 0.16, by = y - size * 0.9, bh = size * 1.18;
        ctx.save(); ctx.fillStyle = bl > 0 ? `rgba(255,214,90,${0.5 * bl})` : "#FFFFFF"; rr(ctx, bx, by, bw, bh, 10); ctx.fill();
        if (!fill || fa < 1) { ctx.setLineDash([8, 7]); } ctx.strokeStyle = fill && fa >= 1 ? GREEN : "#8A96A0"; ctx.lineWidth = 3; rr(ctx, bx, by, bw, bh, 10); ctx.stroke(); ctx.setLineDash([]);
        if (!fill || fa < 1) { alpha(ctx, 1 - (fill ? fa : 0), () => { ctx.fillStyle = "#8A96A0"; ctx.beginPath(); ctx.moveTo(bx + bw - size * 0.55, by + bh * 0.42); ctx.lineTo(bx + bw - size * 0.25, by + bh * 0.42); ctx.lineTo(bx + bw - size * 0.4, by + bh * 0.62); ctx.closePath(); ctx.fill(); }); }
        if (fill) alpha(ctx, fa, () => text(ctx, fill, bx + bw / 2, y - size * 0.06, size * 0.82, { align: "center", weight: 800, color: GREEN }));
        ctx.restore(); return;
      }
      if (it.kind === "pill") {
        const p = PP[it.id] || { sex: "f", col: FAM.green }, h = size * 1.12, py = y - size * 0.86;
        ctx.save(); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = p.col; ctx.lineWidth = 3.5; rr(ctx, it.x0 + 4, py, it.w - 8, h, h / 2); ctx.fill(); ctx.stroke(); ctx.restore();
        bHead(ctx, it.x0 + 4 + h * 0.5, py + h * 0.56, h * 0.34, p.sex, p.col);
        text(ctx, it.s, it.x0 + h + 2, y - size * 0.12, size * 0.62, { weight: 800, color: INK });
        return;
      }
      text(ctx, it.s, it.x0, y, size, { weight: it.kind === "fn" ? 800 : 900, color: it.kind === "name" ? INK : it.kind === "op" ? GRAYT : "#1F4E79" });
    });
    return items.filter(i => i.kind !== "sp");
  }

  // ---------- soal utuh ----------
  const TM = { ox: 108, oy: 158, s: 0.95 };        // pohon besar di kiri
  const TS = { ox: 1042, oy: 190, s: 0.8 };        // pohon kecil di kanan
  function legendRow(ctx, kind, x, y, s1, s2, a) {
    alpha(ctx, a, () => {
      if (kind === "f") bHead(ctx, x + 40, y + 6, 34, "f", FAM.pink);
      if (kind === "m") bHead(ctx, x + 40, y + 6, 34, "m", FAM.purple);
      if (kind === "ring") cincin(ctx, x + 40, y, 16, FAM.blue);
      if (kind === "arrow") mline(ctx, [[x + 40, y - 34], [x + 40, y + 34]], 1, FAM.blue, 5, 16);
      text(ctx, s1, x + 110, y + 4, 36, { weight: 900, color: INK });
      text(ctx, s2, x + 110, y + 44, 28, { weight: 700, color: C.ink2 });
    });
  }
  function soal(ctx, b, l) {
    board(ctx);
    if (b.id === "soal1") {
      const a1 = P(l, at(b, "Annika dan"), 0.6), a2 = P(l, at(b, "dan Daniel"), 0.6);
      alpha(ctx, a1, () => { bHead(ctx, 760, 520, 120, "f", FAM.pink); nameTag(ctx, "Annika", 760, 700, 40, "#D6559B"); });
      alpha(ctx, a2, () => { bHead(ctx, 1160, 520, 120, "m", FAM.purple); nameTag(ctx, "Daniel", 1160, 700, 40, FAM.purple); });
      alpha(ctx, P(l, at(b, "acara keluarga"), 0.6), () => hand(ctx, "acara keluarga", 960, 230, 44, { color: ORANGE }));
      alpha(ctx, P(l, at(b, "Seseorang"), 0.6), () => bubble(ctx, 1330, 330, 470, "\"Bagaimana hubungan kalian berdua?\"", 36, { tailX: 1400, tailDir: -40 }));
      kiko(ctx, 260, 560, 200, 0, { mood: "happy" });
      return;
    }
    const ord = prog(["soal2", "soal3", "soal4", "soal4b"], b);
    const t0 = b.id === "soal2" ? at(b, "menggambar") : 0;
    const gA = g => ord("soal2", () => P(l, t0 + g * 0.9, 0.6));
    const arA = g => ord("soal2", () => P(l, t0 + g * 0.9 - 0.3, 0.6));
    let blink = null, glowA = null, ringsHl = null, nameBoost = null;
    if (b.id === "soal3") { const f = P(l, at(b, "perempuan memakai"), 0.4), m = P(l, at(b, "laki-laki memakai"), 0.4); blink = { f: f * (1 - m), m }; }
    if (b.id === "soal4") { ringsHl = () => P(l, at(b, "Dua cincin"), 0.8); const g = P(l, at(b, "Panah yang"), 0.5); glowA = () => g * (0.6 + 0.4 * Math.sin(l * 5)); }
    if (b.id === "soal4b") {
      const nm = ["Christina", "Emil", "Gerda", "Bernard", "Annika", "Daniel"], ids = ["CH", "EM", "GE", "BE", "AN", "DA"];
      const T = atSeq(b, nm, "yaitu");
      nameBoost = id => { const i = ids.indexOf(id); return i < 0 ? 0 : P(l, T[i], 0.3); };
    }
    tree(ctx, TM, { show: id => gA(GEN[id]), arr: k => arA(ARROWS[k].gen), names: 1, blink, glowA, ringsHl, nameBoost });
    // keterangan di kanan
    const x = 1080;
    const la = ord("soal3", () => P(l, at(b, "berang-berang perempuan"), 0.5)), lb = ord("soal3", () => P(l, at(b, "laki-laki"), 0.5));
    const lc = ord("soal4", () => P(l, at(b, "Dua cincin"), 0.5)), ld = ord("soal4", () => P(l, at(b, "Panah yang"), 0.5));
    if (la > 0) { card(ctx, x, 165, 760, 470, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 }); text(ctx, "CARA MEMBACA GAMBAR", x + 28, 212, 26, { weight: 900, color: C.accentDark }); }
    legendRow(ctx, "f", x + 20, 275, "pita = perempuan", "", la);
    legendRow(ctx, "m", x + 20, 375, "topi = laki-laki", "", lb);
    legendRow(ctx, "ring", x + 20, 470, "dua cincin = suami istri", "", lc);
    legendRow(ctx, "arrow", x + 20, 565, "panah → menunjuk ke anak", "dari pasangan ke anak-anaknya", ld);
    if (b.id === "soal4b") alpha(ctx, P(l, at(b, "tidak diberi nama"), 0.6), () => { hand(ctx, "6 berang-berang punya nama,", x + 380, 700, 34, { color: INK }); hand(ctx, "yang lain tanpa nama", x + 380, 745, 34, { color: INK }); });
  }

  // ---------- aturan fungsi ----------
  function notasi(ctx, b, l) {
    board(ctx);
    const ord = prog(["soal5", "soal5b", "soal6", "soal7"], b);
    const small = b.id !== "soal5" && b.id !== "soal5b";
    // kartu aturan
    card(ctx, 90, 160, 900, small ? 190 : 330, { fill: "#F7F9FA", stroke: "#1F4E79", lw: 3, r: 18 });
    text(ctx, "ATURAN ANNIKA", 118, 205, 26, { weight: 900, color: C.accentDark });
    const r1 = ord("soal5", () => P(l, at(b, "Tulisan ayah X"), 0.5)), r2 = ord("soal5", () => P(l, at(b, "Tulisan ibu X"), 0.5));
    const ry = small ? [262, 325] : [290, 400], sz = small ? 40 : 56;
    alpha(ctx, r1, () => { expr(ctx, "ayah(X)", 120, ry[0], sz); text(ctx, "= ayah dari berang-berang X", small ? 320 : 400, ry[0], small ? 30 : 36, { weight: 700, color: INK }); });
    alpha(ctx, r2, () => { expr(ctx, "ibu(X)", 120, ry[1], sz); text(ctx, "= ibu dari berang-berang X", small ? 320 : 400, ry[1], small ? 30 : 36, { weight: 700, color: INK }); });
    if (b.id === "soal5b") {
      const f = P(l, at(b, "seperti fungsi"), 0.6), g = P(l, at(b, "menerima satu nama"), 0.6);
      alpha(ctx, f, () => hand(ctx, "seperti fungsi:", 300, 560, 44, { color: ORANGE }));
      alpha(ctx, g, () => {
        nameTag(ctx, "Annika", 200, 660, 34, "#D6559B");
        mline(ctx, [[290, 660], [400, 660]], 1, INK, 5, 18);
        ctx.fillStyle = "#1F4E79"; rr(ctx, 410, 610, 200, 100, 16); ctx.fill(); text(ctx, "ayah", 510, 675, 44, { align: "center", weight: 900, color: "#fff" });
        mline(ctx, [[620, 660], [730, 660]], 1, INK, 5, 18);
        hand(ctx, "1 nama masuk", 300, 765, 30, { color: GRAYT });
      });
      alpha(ctx, P(l, at(b, "satu nama sebagai"), 0.5), () => { nameTag(ctx, "Bernard", 840, 660, 34, FAM.green); hand(ctx, "1 nama keluar", 780, 765, 30, { color: GRAYT }); });
    }
    // contoh
    let walkIds = null, wu = 0;
    if (small) {
      const e1 = ord("soal6", () => P(l, at(b, "Jadi, kita menulis ayah"), 0.5)), e2 = ord("soal6", () => P(l, at(b, "Jadi, kita menulis ibu"), 0.5));
      text(ctx, "CONTOH", 118, 420, 26, { weight: 900, color: C.accentDark });
      alpha(ctx, e1, () => expr(ctx, "ayah(Annika) = Bernard", 120, 495, 50));
      alpha(ctx, e2, () => expr(ctx, "ibu(Bernard) = Christina", 120, 585, 50));
      const e3 = ord("soal7", () => P(l, at(b, "Ibu dari ayah"), 0.5)), hb = ord("soal7", () => P(l, at(b, "masuk ke dalam"), 0.5));
      alpha(ctx, e3, () => expr(ctx, "ibu(ayah(Annika)) = Christina", 120, 700, 50, { hl: [2, 5], hlA: hb }));
      alpha(ctx, hb, () => hand(ctx, "ayah(Annika) di dalam kurung milik ibu", 560, 780, 32, { color: ORANGE }));
      if (b.id === "soal6") {
        const w1 = P(l, at(b, "ayah Annika adalah"), 1.0), w2 = P(l, at(b, "Ibu Bernard adalah"), 1.0);
        walkIds = w2 > 0 ? ["AN", "BE", "CH"] : ["AN", "BE"]; wu = w2 > 0 ? 0.5 + 0.5 * w2 : w1;
      }
      if (b.id === "soal7") { walkIds = ["AN", "BE", "CH"]; wu = P(l, at(b, "Ibu dari ayah"), 1.6); }
    }
    const gl = walkIds ? walkGlow(walkIds, wu) : null;
    tree(ctx, TS, { under: c => walkIds && walk(c, TS, walkIds, wu), glow: gl || undefined });
  }

  // ---------- tantangan ----------
  function tantangan(ctx, b, l) {
    board(ctx);
    text(ctx, "TANTANGAN", 118, 210, 30, { weight: 900, color: C.accentDark });
    para(ctx, "Isi setiap kotak dengan ayah atau ibu, supaya kedua sisi menunjuk ke berang-berang yang sama.", 118, 262, 30, 880, { weight: 700, color: INK });
    const lhs = b.id === "soal8" ? P(l, at(b, "bagian kirinya"), 0.6) : 0;
    const bx = b.id === "soal9" ? P(l, at(b, "tiga kotak"), 0.4) * (0.6 + 0.4 * Math.sin(l * 5)) : 0;
    expr(ctx, "ayah(ibu(Annika))", 130, 430, 58, { hl: [0, 5], hlA: lhs });
    expr(ctx, "= #0(#1(#2(Daniel)))", 130, 545, 58, { boxHl: [bx, bx, bx] });
    if (b.id === "soal8") alpha(ctx, P(l, at(b, "harus segera pergi"), 0.6), () => hand(ctx, "Annika harus pergi…", 760, 360, 34, { color: GRAYT }));
    if (b.id === "soal9") {
      alpha(ctx, P(l, at(b, "ayah atau ibu"), 0.5), () => {
        text(ctx, "Pilihan untuk setiap kotak:", 130, 640, 30, { weight: 700, color: C.ink2 });
        nameTag(ctx, "ayah", 560, 630, 32, "#1F4E79"); nameTag(ctx, "ibu", 700, 630, 32, "#1F4E79");
      });
      const tb = P(l, at(b, "Coba pikirkan"), 0.5);
      alpha(ctx, tb, () => thinkBadge(ctx, 110, 680, 880, 120, l - at(b, "Coba pikirkan"), b.dur - at(b, "Coba pikirkan"), "Siapa yang ditunjuk bagian kiri?"));
    }
    tree(ctx, TS, {});
  }

  // ---------- membaca pohon ----------
  const NOTE = { x: 1090, w: 740 };
  function noteCard(ctx, title, lines, a, y0 = 170) {
    alpha(ctx, a, () => {
      const h = 90 + lines.length * 72;
      card(ctx, NOTE.x, y0, NOTE.w, h, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
      text(ctx, title, NOTE.x + 28, y0 + 48, 26, { weight: 900, color: C.accentDark });
      lines.forEach((ln, i) => { const y = y0 + 112 + i * 72; if (typeof ln === "function") ln(y); else text(ctx, ln, NOTE.x + 28, y, 36, { weight: 800, color: INK, fit: NOTE.w - 56 }); });
    });
  }
  function pohon(ctx, b, l) {
    board(ctx);
    const ord = prog(["t1", "t2", "t3", "t4", "t5", "t6", "t7"], b);
    const id = b.id, pulse = 0.65 + 0.35 * Math.sin(l * 5);
    const glowA = k => {
      if (id === "t1" && k === "green") return P(l, at(b, "Panah yang"), 0.5) * pulse;
      if (id === "t3" && k === "red") return P(l, at(b, "Panah merah"), 0.5) * pulse;
      if (id === "t4" && (k === "blueL" || k === "blueR")) return P(l, at(b, k === "blueL" ? "Anak yang pertama" : "Anak yang kedua"), 0.5) * pulse;
      if (id === "t5" && k === "orange") return P(l, at(b, "Panah oranye"), 0.5) * pulse;
      if (id === "t6" && k.startsWith("lb")) return P(l, at(b, "tiga anak"), 0.5) * pulse;
      return 0;
    };
    const glow = p => {
      if (id === "t1" && p === "AN") return P(l, at(b, "dari Annika"), 0.5);
      if (id === "t2" && p === "BE") return P(l, at(b, "ayah Annika adalah"), 0.5);
      if (id === "t2" && p === "IA") return P(l, at(b, "ibu Annika adalah"), 0.5);
      if (id === "t4" && p === "IA") return P(l, at(b, "Anak yang pertama"), 0.5);
      if (id === "t4" && p === "OF") return P(l, at(b, "Anak yang kedua"), 0.5);
      if (id === "t5" && p === "LF") return P(l, at(b, "yaitu berang-berang berpita"), 0.5);
      if (id === "t6" && p === "DA") return P(l, at(b, "Salah satunya"), 0.5);
      return 0;
    };
    const ringsHl = a1 => {
      if (id === "t1" && a1 === "BE") return P(l, at(b, "pasangan berwarna hijau"), 0.8);
      if (id === "t3" && a1 === "RM") return P(l, at(b, "pasangan Christina"), 0.8);
      if (id === "t4" && a1 === "EM") return P(l, at(b, "Emil dan Gerda"), 0.8);
      if (id === "t5" && a1 === "OM") return P(l, at(b, "menikah"), 0.8);
      if (id === "t6" && a1 === "LM") return P(l, at(b, "menikah"), 0.8);
      return 0;
    };
    const xtag = p => p === "IA" ? ord("t2", () => P(l, at(b, "ibu Annika adalah"), 0.5)) : 0;
    let wIds = null, wu = 0;
    if (id === "t7") { wIds = ["AN", "BE"]; wu = P(l, at(b, "kita berjalan melawan"), 1.0); }
    tree(ctx, TM, { glowA, glow, ringsHl, xtag, under: c => wIds && walk(c, TM, wIds, wu) });
    if (id === "t2") alpha(ctx, P(l, at(b, "ayah Annika adalah"), 0.5), () => { const [x, y] = pos(TM, "BE"); hand(ctx, "ayah Annika", x - 125, y + 10, 28, { color: FAM.green }); });
    // catatan kanan
    const pill = (s, idp) => y => { const p = PP[idp]; nameTag(ctx, s, NOTE.x + 28 + tw(ctx, s, 30, 800) / 2 + 12, y - 12, 30, p.tag || p.col, { light: !p.name }); };
    if (id === "t1") noteCard(ctx, "DARI ANNIKA", ["Panah ke Annika datang", "dari pasangan hijau."], P(l, at(b, "Panah yang"), 0.5));
    if (id === "t2") noteCard(ctx, "ORANG TUA ANNIKA", [
      y => { expr(ctx, "ayah(Annika) = Bernard", NOTE.x + 28, y + 8, 40); },
      y => { const it = expr(ctx, "ibu(Annika) = [ibu Annika]", NOTE.x + 28, y + 8, 40, { pill: { "ibu Annika": "IA" } }); },
      "(berang-berang berpita hijau)",
    ], P(l, at(b, "Jadi, ayah"), 0.5));
    if (id === "t3") noteCard(ctx, "ORANG TUA BERNARD", ["Christina dan suaminya", "(pasangan merah)"], P(l, at(b, "Jadi, orang tua"), 0.5));
    if (id === "t4") noteCard(ctx, "ANAK EMIL DAN GERDA", ["1. ibu Annika (pita hijau)", "2. berpita oranye"], P(l, at(b, "Anak yang pertama"), 0.5));
    if (id === "t5") noteCard(ctx, "ANAK PASANGAN ORANYE", ["berang-berang berpita", "biru muda (perempuan)"], P(l, at(b, "Panah oranye"), 0.5));
    if (id === "t6") noteCard(ctx, "ANAK PASANGAN BIRU MUDA", ["Daniel (topi ungu)", "dan dua saudaranya"], P(l, at(b, "tiga anak"), 0.5));
    if (id === "t7") {
      noteCard(ctx, "PENTING", ["Panah menunjuk ke anak.", "Cari ayah atau ibu:", "jalan MELAWAN panah,", "dari anak ke orang tua."], P(l, 0.3, 0.6));
    }
  }

  // ---------- dalam ke luar ----------
  function fungsi(ctx, b, l) {
    board(ctx);
    const ord = prog(["f1", "f2", "f3", "f4", "f5"], b);
    const X = 120;
    if (b.id !== "f5") {
      const hlA = ord("f2", () => P(l, at(b, "Kurung yang paling dalam"), 0.5));
      const items = expr(ctx, "ibu(ayah(Annika))", X, 300, 76, { hl: [2, 5], hlA });
      if (b.id === "f2") {
        const la = P(l, at(b, "dua lapis"), 0.5);
        alpha(ctx, la, () => {
          const o0 = items[1].x0, o1 = items[6].x1, i0 = items[3].x0, i1 = items[5].x1;
          mline(ctx, [[o0, 335], [o0, 395], [o1, 395], [o1, 335]], 1, BRC[0], 4); hand(ctx, "kurung luar", (o0 + o1) / 2 + 60, 438, 30, { color: BRC[0] });
          mline(ctx, [[i0, 330], [i0, 355], [i1, 355], [i1, 330]], 1, BRC[1], 4);
        });
        alpha(ctx, hlA, () => hand(ctx, "kurung paling dalam → kerjakan dulu", X + 420, 200, 32, { color: ORANGE }));
      }
      const s2 = ord("f3", () => P(l, at(b, "Sekarang, tulisannya"), 0.5)), s3 = ord("f4", () => P(l, at(b, "Jadi, ibu dari"), 0.5));
      alpha(ctx, ord("f3", () => P(l, at(b, "kita ganti"), 0.5)), () => hand(ctx, "ayah(Annika) = Bernard", X + 420, 200, 32, { color: FAM.green }));
      alpha(ctx, s2, () => expr(ctx, "= ibu(Bernard)", X, 450, 70));
      alpha(ctx, s3, () => { expr(ctx, "= Christina", X, 600, 70); tick(ctx, X + 520, 580, 70, s3, GREEN, 10); });
      alpha(ctx, ord("f4", () => P(l, at(b, "Hasilnya sama"), 0.5)), () => hand(ctx, "sama dengan contoh Annika", X + 400, 720, 34, { color: GREEN }));
    } else {
      const a1 = P(l, at(b, "Fungsi yang paling dekat"), 0.5), a2 = P(l, at(b, "Kalau urutannya"), 0.5);
      hand(ctx, "Urutan penting!", 520, 215, 52, { color: RED, alpha: P(l, 0.3, 0.5) });
      expr(ctx, "ibu(ayah(Annika)) = Christina", X, 330, 52, { hl: [2, 2], hlA: a1 });
      alpha(ctx, a1, () => hand(ctx, "yang paling dekat dengan nama dikerjakan dulu", 520, 400, 28, { color: ORANGE }));
      alpha(ctx, a2, () => {
        text(ctx, "≠", X + 230, 500, 70, { align: "center", weight: 900, color: RED });
        hand(ctx, "urutannya dibalik", X + 520, 492, 32, { color: GRAYT });
        expr(ctx, "ayah(ibu(Annika)) = ?", X, 600, 52, { hl: [2, 2] });
        hand(ctx, "hasilnya berang-berang yang lain", 520, 680, 30, { color: GRAYT });
      });
    }
    let wIds = null, wu = 0;
    if (b.id === "f3") { wIds = ["AN", "BE"]; wu = P(l, at(b, "Ayah Annika adalah"), 1.0); }
    if (b.id === "f4" || b.id === "f5") { wIds = ["AN", "BE", "CH"]; wu = b.id === "f5" ? 1 : 0.5 + 0.5 * P(l, at(b, "Ibu Bernard adalah"), 1.0); }
    tree(ctx, TS, { under: c => wIds && walk(c, TS, wIds, wu), glow: wIds ? walkGlow(wIds, wu) : undefined });
  }

  // ---------- bagian kiri ----------
  function kiri(ctx, b, l) {
    board(ctx);
    const ord = prog(["k1", "k2", "k3", "k4"], b), X = 120;
    text(ctx, "BAGIAN KIRI", X, 205, 28, { weight: 900, color: C.accentDark });
    const hlA = ord("k1", () => P(l, at(b, "Kurung yang paling dalam"), 0.5)) * (b.id === "k1" || b.id === "k2" ? 1 : 0);
    expr(ctx, "ayah(ibu(Annika))", X, 310, 72, { hl: [2, 5], hlA });
    const s2 = ord("k2", () => P(l, at(b, "Dari Annika"), 0.5)), s3 = ord("k3", () => P(l, at(b, "Jadi, ayah dari"), 0.5));
    alpha(ctx, s2, () => expr(ctx, "= ayah([ibu Annika])", X, 450, 66, { pill: { "ibu Annika": "IA" } }));
    alpha(ctx, s3, () => { expr(ctx, "= Emil", X, 590, 66); tick(ctx, X + 330, 570, 64, s3, GREEN, 10); });
    if (b.id === "k4") {
      alpha(ctx, P(l, at(b, "Bagian kanan"), 0.5), () => { card(ctx, 100, 650, 900, 150, { fill: "#FFF8E8", stroke: C.accent, lw: 3, r: 16 }); expr(ctx, "#0(#1(#2(Daniel))) = Emil", 130, 740, 46); });
      alpha(ctx, P(l, at(b, "tiga langkah"), 0.5), () => hand(ctx, "3 langkah", 880, 690, 30, { color: ORANGE }));
    }
    let wIds = null, wu = 0;
    if (b.id === "k2") { wIds = ["AN", "IA"]; wu = P(l, at(b, "kita berjalan"), 1.0); }
    if (b.id === "k3") { wIds = ["AN", "IA", "EM"]; wu = 0.5 + 0.5 * P(l, at(b, "Panah biru"), 1.2); }
    if (b.id === "k4") { wIds = ["AN", "IA", "EM"]; wu = 1; }
    const glow = id => {
      if (b.id === "k4" && (id === "EM" || id === "DA")) return P(l, at(b, id === "EM" ? "ke Emil" : "dari Daniel"), 0.5);
      return wIds ? walkGlow(wIds, wu)(id) : 0;
    };
    tree(ctx, TS, { under: c => wIds && walk(c, TS, wIds, wu), glow, xtag: id => id === "IA" ? 1 : 0, glowA: k => b.id === "k3" && k === "blueL" ? P(l, at(b, "Panah biru"), 0.5) : 0 });
    if (b.id === "k3") alpha(ctx, P(l, at(b, "Yang memakai topi"), 0.5), () => { const [x, y] = pos(TS, "EM"); ring(ctx, x, y - 10, 58, 62, P(l, at(b, "Yang memakai topi"), 0.8), GREEN, 5); });
  }

  // ---------- bagian kanan ----------
  const PATH_R = ["DA", "LF", "OF", "EM"];
  function kanan(ctx, b, l) {
    board(ctx);
    const ord = prog(["r1", "r2", "r3", "r4", "r5", "r6"], b), X = 120;
    const f3 = ord("r3", () => P(l, at(b, "Kotak ketiga kita isi"), 0.5)), f2 = ord("r4", () => P(l, at(b, "Kotak kedua"), 0.5)), f1 = ord("r5", () => P(l, at(b, "Kotak pertama"), 0.5));
    if (b.id !== "r6") {
      text(ctx, "BAGIAN KANAN", X, 205, 28, { weight: 900, color: C.accentDark });
      expr(ctx, "ayah(ibu(Annika)) = Emil", X, 290, 44);
      const items = expr(ctx, "#0(#1(#2(Daniel)))", X, 440, 74, { fill: ["ayah", "ibu", "ibu"], fillA: [f1, f2, f3],
        boxHl: [b.id === "r5" ? P(l, at(b, "Langkah ketiga"), 0.4) : 0, b.id === "r4" ? P(l, at(b, "Langkah kedua"), 0.4) : 0, b.id === "r3" ? P(l, at(b, "Langkah pertama"), 0.4) : 0] });
      alpha(ctx, ord("r1", () => P(l, at(b, "Kotak ketiga"), 0.5)), () => {
        const boxes = items.filter(i => i.kind === "box");
        [3, 2, 1].forEach((n, k) => { const bx = boxes[k]; const a = b.id === "r1" ? P(l, at(b, n === 1 ? "Kotak ketiga" : "Kotak pertama") + (n === 2 ? 0.8 : 0), 0.5) : 1; alpha(ctx, a, () => hand(ctx, "langkah " + n, (bx.x0 + bx.x1) / 2, 520, 28, { color: n === 1 ? ORANGE : GRAYT })); });
        if (b.id === "r1") alpha(ctx, P(l, at(b, "Kotak ketiga"), 0.5), () => mline(ctx, [[boxes[2].x1 + 260, 580], [boxes[0].x0 + 20, 580]], 1, ORANGE, 5, 18));
        if (b.id === "r1") alpha(ctx, P(l, at(b, "Kotak ketiga"), 0.5), () => hand(ctx, "dari dalam ke luar", (boxes[0].x0 + boxes[2].x1) / 2 + 120, 630, 30, { color: ORANGE }));
      });
      if (["r3", "r4", "r5"].includes(b.id)) {
        const lines = { r3: "pita → ibu Daniel", r4: "pita → ibu dari ibu Daniel", r5: "topi → ayah" };
        alpha(ctx, P(l, at(b, b.id === "r5" ? "Emil memakai topi" : "memakai pita"), 0.5), () => hand(ctx, lines[b.id], X + 400, 650, 40, { color: GREEN }));
      }
    } else {
      text(ctx, "JAWABAN", X, 205, 28, { weight: 900, color: C.accentDark });
      expr(ctx, "ayah(ibu(Annika))", X, 320, 60);
      expr(ctx, "= #0(#1(#2(Daniel)))", X, 440, 60, { fill: ["ayah", "ibu", "ibu"], fillA: [1, 1, 1] });
      alpha(ctx, P(l, at(b, "Keduanya menunjuk"), 0.5), () => { expr(ctx, "= Emil", X, 570, 60); tick(ctx, X + 300, 550, 60, 1, GREEN, 10); });
      alpha(ctx, P(l, at(b, "ayah, ibu, ibu"), 0.5), () => hand(ctx, "ayah, ibu, ibu", X + 420, 690, 50, { color: GREEN }));
    }
    // pohon dan jalan
    let under = null, glow = null, glowA = null, xtag = id => (id === "IA" ? 1 : 0);
    if (b.id === "r2") {
      const T = atSeq(b, ["Dari Emil", "Dari pasangan oranye", "dari pasangan biru muda"]);
      glowA = k => k === "blueR" ? P(l, T[0], 0.5) : k === "orange" ? P(l, T[1], 0.5) : k === "lbA" ? P(l, T[2], 0.5) : 0;
      glow = id => id === "EM" ? P(l, T[0], 0.4) : id === "OF" ? P(l, T[0] + 1.0, 0.4) : id === "LF" ? P(l, T[1] + 1.0, 0.4) : id === "DA" ? P(l, T[2] + 1.0, 0.4) : 0;
    } else if (b.id !== "r1") {
      const wu = b.id === "r3" ? P(l, at(b, "Langkah pertama"), 1.0) / 3 : b.id === "r4" ? (1 + P(l, at(b, "Langkah kedua"), 1.0)) / 3 : b.id === "r5" ? (2 + P(l, at(b, "Langkah ketiga"), 1.0)) / 3 : 1;
      under = c => { walk(c, TS, PATH_R, wu); if (b.id === "r6") walk(c, TS, ["AN", "IA", "EM"], 1, { color: "rgba(46,139,46,0.55)" }); };
      const g = walkGlow(PATH_R, wu); glow = id => Math.max(g(id), b.id === "r6" && (id === "AN") ? 1 : 0);
      xtag = id => id === "IA" ? 1 : id === "LF" ? (b.id === "r3" ? P(l, at(b, "ibu Daniel"), 0.5) : 1) : 0;
    }
    tree(ctx, TS, { under, glow: glow || undefined, glowA: glowA || undefined, xtag });
    if (["r4", "r5", "r6"].includes(b.id)) { const [x, y] = pos(TS, "OF"); alpha(ctx, b.id === "r4" ? P(l, at(b, "ibu dari ibu Daniel"), 0.5) : 1, () => nameTag(ctx, "nenek Daniel", x + 92, y + 4, 20, FAM.orange, { light: true })); }
    if (b.id === "r6") { const [x, y] = pos(TS, "EM"); ring(ctx, x, y - 8, 58, 62, P(l, at(b, "Keduanya menunjuk"), 0.8), GREEN, 6); }
  }

  // ---------- bukti: pohon pilihan 2×2×2 ----------
  const DX = { root: 150, l1: 470, l2: 790, leaf: 1110 };
  const LEAFY = [196, 276, 366, 446, 536, 616, 706, 786];
  function bukti(ctx, b, l) {
    board(ctx);
    const ord = prog(["b1", "b2", "b2b", "b3", "b4"], b);
    const grow = ord("b1", () => P(l, at(b, "Setiap kotak"), 2.2));
    const yRoot = 491, y1 = [(LEAFY[0] + LEAFY[3]) / 2, (LEAFY[4] + LEAFY[7]) / 2], y2 = [(LEAFY[0] + LEAFY[1]) / 2, (LEAFY[2] + LEAFY[3]) / 2, (LEAFY[4] + LEAFY[5]) / 2, (LEAFY[6] + LEAFY[7]) / 2];
    // isi node setelah diperiksa
    const n1a = ord("b2", () => P(l, at(b, "kita sampai di ayah Daniel"), 0.5));
    const n1b = ord("b3", () => P(l, at(b, "Jadi, kotak ketiga harus ibu"), 0.5));
    const n2c = ord("b3", () => P(l, at(b, "kita sampai di berang-berang bertopi"), 0.5));
    const n2d = ord("b4", () => P(l, at(b, "Ibu dari ibu dari ibu"), 0.5));
    const deadA = ord("b2b", () => P(l, at(b, "Jadi, empat kemungkinan"), 0.6)), deadC = ord("b3", () => P(l, at(b, "dua kemungkinan lagi"), 0.6));
    const gerda = ord("b4", () => P(l, at(b, "adalah Gerda"), 0.5)), emil = ord("b4", () => P(l, at(b, "adalah Emil."), 0.5));
    const W = ["ayah", "ibu"];
    const edge = (x0, y0, x1, y1, word, u, dead) => {
      if (u <= 0) return;
      alpha(ctx, 1 - 0.65 * (dead || 0), () => {
        mline(ctx, [[x0 + 60, y0], [x0 + 110, y0], [x1 - 110, y1], [x1 - 60, y1]], u, "#7A8794", 4);
        if (u > 0.6) nameTag(ctx, word, (x0 + x1) / 2, (y0 + y1) / 2 - 2, 24, "#1F4E79");
      });
    };
    // akar
    bHead(ctx, DX.root, yRoot - 10, 44, "m", FAM.purple); nameTag(ctx, "Daniel", DX.root, yRoot + 62, 26, FAM.purple);
    text(ctx, "kotak 3", DX.l1 - 160, 172, 24, { align: "center", weight: 800, color: GRAYT });
    text(ctx, "kotak 2", DX.l2 - 160, 172, 24, { align: "center", weight: 800, color: GRAYT });
    text(ctx, "kotak 1", DX.leaf - 160, 172, 24, { align: "center", weight: 800, color: GRAYT });
    for (let i = 0; i < 2; i++) edge(DX.root, yRoot, DX.l1, y1[i], W[i], clamp(grow * 3, 0, 1), i === 0 ? deadA : 0);
    for (let j = 0; j < 4; j++) edge(DX.l1, y1[j >> 1], DX.l2, y2[j], W[j & 1], clamp(grow * 3 - 1, 0, 1), j < 2 ? deadA : j === 2 ? deadC : 0);
    for (let k = 0; k < 8; k++) edge(DX.l2, y2[k >> 1], DX.leaf, LEAFY[k], W[k & 1], clamp(grow * 3 - 2, 0, 1), k < 4 ? deadA : (k >> 1) === 2 ? deadC : 0);
    // titik kosong
    const dot = (x, y, u, dead) => alpha(ctx, u * (1 - 0.6 * (dead || 0)), () => { ctx.fillStyle = "#C9D2D8"; ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill(); });
    // level 1
    if (n1a <= 0) dot(DX.l1, y1[0], clamp(grow * 3, 0, 1)); else alpha(ctx, n1a * (1 - 0.35 * deadA), () => { bHead(ctx, DX.l1, y1[0] - 8, 40, "m", FAM.lb); text(ctx, "ayah Daniel", DX.l1, y1[0] + 58, 22, { align: "center", weight: 800, color: INK }); });
    if (n1b <= 0) dot(DX.l1, y1[1], clamp(grow * 3, 0, 1)); else alpha(ctx, n1b, () => { bHead(ctx, DX.l1, y1[1] - 8, 40, "f", FAM.lb); text(ctx, "ibu Daniel", DX.l1, y1[1] + 58, 22, { align: "center", weight: 800, color: INK }); });
    // level 2
    for (let j = 0; j < 4; j++) {
      const x = DX.l2, y = y2[j], g = clamp(grow * 3 - 1, 0, 1);
      if (j < 2) { if (deadA > 0) alpha(ctx, deadA, () => text(ctx, "tidak ada", x, y + 8, 24, { align: "center", weight: 800, color: RED })); else dot(x, y, g); }
      else if (j === 2) { if (n2c > 0) alpha(ctx, n2c * (1 - 0.35 * deadC), () => { bHead(ctx, x, y - 8, 38, "m", FAM.orange); text(ctx, "bertopi oranye", x, y + 54, 20, { align: "center", weight: 800, color: INK }); }); else dot(x, y, g); }
      else { if (n2d > 0) alpha(ctx, n2d, () => { bHead(ctx, x, y - 8, 38, "f", FAM.orange); text(ctx, "nenek Daniel", x, y + 54, 20, { align: "center", weight: 800, color: INK }); }); else dot(x, y, g); }
    }
    // daun: tulisan lengkap + hasil
    for (let k = 0; k < 8; k++) {
      const a = clamp(grow * 3 - 2, 0, 1); if (a <= 0) continue;
      const w3 = W[k >> 2], w2 = W[(k >> 1) & 1], w1 = W[k & 1], y = LEAFY[k];
      const dead = k < 4 ? deadA : (k >> 1) === 2 ? deadC : k === 7 ? gerda : 0;
      alpha(ctx, a * (1 - 0.6 * dead), () => expr(ctx, `${w1}(${w2}(${w3}(Daniel)))`, DX.leaf - 40, y + 11, 30));
      if (dead > 0) alpha(ctx, dead, () => mline(ctx, [[DX.leaf - 50, y], [DX.leaf + 300, y]], 1, RED, 4));
      if (k === 7 && gerda > 0) alpha(ctx, gerda, () => { nameTag(ctx, "Gerda", DX.leaf + 400, y, 24, FAM.blue); text(ctx, "≠ Emil", DX.leaf + 540, y + 9, 26, { align: "center", weight: 900, color: RED }); });
      if (k === 6 && emil > 0) alpha(ctx, emil, () => { nameTag(ctx, "Emil", DX.leaf + 400, y, 26, FAM.blue); tick(ctx, DX.leaf + 500, y, 44, emil, GREEN, 8); ring(ctx, DX.leaf + 180, y, 290, 34, emil, GREEN, 5); });
    }
    if (b.id === "b1") alpha(ctx, P(l, at(b, "dua kali dua"), 0.5), () => hand(ctx, "2 × 2 × 2 = 8", 1640, 470, 52, { color: ORANGE }));
    if (b.id === "b2b") alpha(ctx, P(l, at(b, "tidak digambar"), 0.5), () => { hand(ctx, "orang tuanya tidak", 1640, 300, 30, { color: RED }); hand(ctx, "ada di pohon", 1640, 340, 30, { color: RED }); });
    if (b.id === "b3") alpha(ctx, P(l, at(b, "Orang tuanya juga"), 0.5), () => { hand(ctx, "orang tuanya juga", 1640, 560, 28, { color: RED }); hand(ctx, "tidak ada", 1640, 598, 28, { color: RED }); });
    if (b.id === "b4") alpha(ctx, P(l, at(b, "hanya ada satu"), 0.5), () => { hand(ctx, "satu-satunya", 1650, 300, 40, { color: GREEN }); hand(ctx, "jawaban!", 1650, 350, 40, { color: GREEN }); });
  }

  // ---------- makna hubungan ----------
  function makna(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Emil adalah kakek Annika", "kakek buyut", "Ibu Annika dan nenek", "Artinya"]);
    const a = T.map(t => P(l, t, 0.5));
    const glow = id => id === "EM" ? a[0] : 0;
    tree(ctx, TM, { glow, xtag: id => id === "IA" || id === "LF" ? 1 : 0,
      under: c => { walk(c, TM, ["AN", "IA", "EM"], a[0], { color: "rgba(46,139,46,0.5)" }); walk(c, TM, ["DA", "LF", "OF", "EM"], a[1]); } });
    const rg = (id, u, col) => { const [x, y] = pos(TM, id); ring(ctx, x, y - 6, 62, 64, u, col, 6); };
    rg("IA", a[2], "#9B45C4"); rg("OF", a[2], "#9B45C4");
    rg("AN", a[3], "#D6559B"); rg("LF", a[3], "#D6559B");
    noteCard(ctx, "HUBUNGAN MEREKA", [
      y => alpha(ctx, a[0], () => text(ctx, "Emil = kakek Annika", NOTE.x + 28, y, 34, { weight: 800, color: INK })),
      y => alpha(ctx, a[1], () => text(ctx, "Emil = kakek buyut Daniel", NOTE.x + 28, y, 34, { weight: 800, color: INK })),
      y => alpha(ctx, a[2], () => text(ctx, "ibu Annika & nenek Daniel", NOTE.x + 28, y, 34, { weight: 800, color: INK })),
      y => alpha(ctx, a[2], () => text(ctx, "= kakak beradik", NOTE.x + 28, y - 14, 34, { weight: 800, color: "#9B45C4" })),
      y => alpha(ctx, a[3], () => text(ctx, "Annika = sepupu ibu Daniel", NOTE.x + 28, y - 10, 34, { weight: 900, color: "#D6559B", fit: NOTE.w - 56 })),
    ], P(l, 0.2, 0.5));
  }

  // ---------- penutup ----------
  function komputer(ctx, b, l) {
    board(ctx);
    const T = b.id === "c1" ? atSeq(b, ["pemrograman", "lembar kerja"]).concat([1e9, 1e9]) : [-9, -9].concat(atSeq(b, ["paling dalam", "hasilnya dipakai"]));
    const win = (x, y, w, h, title) => { ctx.fillStyle = "#3B4652"; rr(ctx, x, y, w, h, 18); ctx.fill(); ctx.fillStyle = "#FFFFFF"; rr(ctx, x + 14, y + 56, w - 28, h - 70, 8); ctx.fill(); text(ctx, title, x + 28, y + 38, 24, { weight: 800, color: "#fff" }); };
    // editor
    alpha(ctx, P(l, T[0], 0.5), () => {
      win(90, 160, 860, 470, "Editor Python");
      ctx.fillStyle = "#F4F7F9"; ctx.fillRect(104, 216, 832, 70);
      text(ctx, 'ayah(ibu(ibu("Daniel")))', 130, 266, 40, { weight: 800, color: "#1F4E79" });
      const st = [['1.  ibu("Daniel")', "ibu Daniel"], ["2.  ibu(...)", "nenek Daniel"], ["3.  ayah(...)", "Emil"]];
      st.forEach(([s1, s2], i) => alpha(ctx, P(l, T[2] + i * 0.9, 0.5), () => { const y = 360 + i * 80; text(ctx, s1, 140, y, 32, { weight: 800, color: INK }); text(ctx, "→ " + s2, 520, y, 32, { weight: 800, color: i === 2 ? GREEN : C.ink2 }); }));
    });
    // lembar kerja
    alpha(ctx, P(l, T[1], 0.5), () => {
      win(1000, 160, 830, 470, "Lembar Kerja");
      ctx.fillStyle = "#F4F7F9"; ctx.fillRect(1014, 216, 802, 70); text(ctx, "fx", 1034, 262, 28, { weight: 800, color: GRAYT });
      text(ctx, "=ROUND(AVERAGE(B2:B4); 1)", 1090, 264, 34, { weight: 800, color: "#1F4E79" });
      const st = [["1.  AVERAGE(B2:B4)", "rata-rata"], ["2.  ROUND(…; 1)", "dibulatkan"]];
      st.forEach(([s1, s2], i) => alpha(ctx, P(l, T[2] + i * 0.9, 0.5), () => { const y = 360 + i * 80; text(ctx, s1, 1040, y, 30, { weight: 800, color: INK }); text(ctx, "→ " + s2, 1480, y, 30, { weight: 800, color: C.ink2 }); }));
    });
    alpha(ctx, P(l, T[3], 0.6), () => hand(ctx, "yang paling dalam dikerjakan dulu, hasilnya dipakai fungsi di luarnya", 960, 720, 38, { color: ORANGE }));
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const ord = prog(["c2", "c2b", "c2c"], b);
    const T = [ord("c2", () => P(l, at(b, "Pertama"), 0.5)), ord("c2b", () => P(l, 0.2, 0.5)), ord("c2c", () => P(l, 0.2, 0.5))];
    const S = [["Baca dari kurung yang paling dalam.", "kurung"], ["Cari orang tua: jalan melawan arah panah.", "panah"], ["Periksa semua kemungkinan.", "pilihan"]];
    S.forEach(([s, ic], i) => {
      const y = 170 + i * 185, a = T[i];
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 48, { weight: 900, color: INK, fit: 1060 });
        const ix = 1560, iy = y + 80;
        if (ic === "kurung") expr(ctx, "ayah(ibu(X))", ix - 130, iy + 16, 44, { hl: [2, 5] });
        if (ic === "panah") { bHead(ctx, ix, iy - 40, 26, "m", FAM.green); bHead(ctx, ix, iy + 46, 22, "f", FAM.pink); mline(ctx, [[ix + 50, iy - 30], [ix + 50, iy + 40]], 1, FAM.green, 4, 14); mline(ctx, [[ix - 50, iy + 40], [ix - 50, iy - 30]], 1, HL, 10, 24); }
        if (ic === "pilihan") { hand(ctx, "2 × 2 × 2 = 8", ix, iy + 14, 40, { color: ORANGE }); }
      });
    });
  }
  function beaver(ctx, x, y, s, o = {}) {   // berang-berang maskot Bebras (sama dengan B01–SG03)
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
  function flagDE(ctx, x, y, w) {   // bendera Jerman: hitam, merah, emas
    const h = w * 0.6;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#000000"; ctx.fillRect(x, y, w, h / 3 + 0.5);
    ctx.fillStyle = "#DD0000"; ctx.fillRect(x, y + h / 3, w, h / 3 + 0.5);
    ctx.fillStyle = "#FFCE00"; ctx.fillRect(x, y + 2 * h / 3, w, h / 3);
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  // ---------- versi tegak untuk Short (area x 460–1460) ----------
  const TV = { ox: 545, oy: 175, s: 0.86 };
  function pohon_v(ctx, b, l) {   // pohon besar di tengah, dengan keterangan pita/topi/cincin/panah
    board(ctx);
    tree(ctx, TV, {});
    const y = 790;
    bHead(ctx, 520, y - 6, 22, "f", FAM.pink); text(ctx, "perempuan", 552, y + 6, 26, { weight: 800, color: INK });
    bHead(ctx, 735, y - 6, 22, "m", FAM.purple); text(ctx, "laki-laki", 767, y + 6, 26, { weight: 800, color: INK });
    cincin(ctx, 945, y, 9, FAM.blue); text(ctx, "suami istri", 972, y + 6, 26, { weight: 800, color: INK });
    mline(ctx, [[1170, y - 20], [1170, y + 16]], 1, FAM.blue, 4, 12); text(ctx, "ke anak", 1190, y + 6, 26, { weight: 800, color: INK });
  }
  // Short: waktu adegan dihitung dari durasi beat Short sendiri (l, b.dur), bukan dari beat asal
  function aturan_v(ctx, b, l) {
    board(ctx);
    text(ctx, "ATURAN ANNIKA", 960, 205, 32, { align: "center", weight: 900, color: C.accentDark });
    expr(ctx, "ayah(X)", 500, 300, 52); text(ctx, "= ayah dari X", 720, 300, 40, { weight: 800, color: INK });
    expr(ctx, "ibu(X)", 500, 390, 52); text(ctx, "= ibu dari X", 720, 390, 40, { weight: 800, color: INK });
    text(ctx, "CONTOH", 500, 490, 28, { weight: 900, color: C.accentDark });
    alpha(ctx, P(l, b.dur * 0.42, 0.5), () => expr(ctx, "ayah(Annika) = Bernard", 500, 565, 46));
    alpha(ctx, P(l, b.dur * 0.62, 0.5), () => { expr(ctx, "ibu(ayah(Annika)) = Christina", 500, 660, 46, { hl: [2, 5] }); hand(ctx, "kurung paling dalam dikerjakan dulu", 960, 750, 30, { color: ORANGE }); });
  }
  function tantangan_v(ctx, b, l) {
    board(ctx);
    text(ctx, "TANTANGAN", 960, 205, 34, { align: "center", weight: 900, color: C.accentDark });
    text(ctx, "Isi kotak dengan ayah atau ibu", 960, 260, 34, { align: "center", weight: 800, color: INK });
    expr(ctx, "ayah(ibu(Annika))", 960, 390, 66, { align: "center" });
    const bx = 0.6 + 0.4 * Math.sin(l * 5);
    expr(ctx, "= #0(#1(#2(Daniel)))", 960, 520, 66, { align: "center", boxHl: [bx, bx, bx] });
    const t = Math.max(0, b.dur - 5.2);
    alpha(ctx, P(l, t, 0.5), () => thinkBadge(ctx, 520, 610, 880, 130, Math.max(0, l - t), b.dur - t, "Ikuti panahnya di pohon"));
  }
  function jalan_v(ctx, b, l) {   // pohon + jalan: bagian kiri (hijau) lalu kanan (kuning), dengan tulisan di bawah
    board(ctx);
    const right = b.src !== "k3", fin = b.src === "r6";
    const wl = right ? 1 : P(l, 1.0, b.dur * 0.55);
    const wr = !right ? 0 : fin ? 1 : clamp((l - 0.6) / (b.dur * 0.6), 0, 1);
    const gL = walkGlow(["AN", "IA", "EM"], wl), gR = walkGlow(PATH_R, wr);
    const TV2 = { ox: 560, oy: 165, s: 0.82 };
    tree(ctx, TV2, { xtag: id => id === "IA" ? 1 : id === "LF" && right ? clamp(wr * 3, 0, 1) : 0, glow: id => Math.max(gL(id), gR(id)),
      under: c => { walk(c, TV2, ["AN", "IA", "EM"], wl, { color: right ? "rgba(46,139,46,0.5)" : HL }); if (right) walk(c, TV2, PATH_R, wr); } });
    if (!right) alpha(ctx, P(l, b.dur * 0.6, 0.5), () => expr(ctx, "ayah(ibu(Annika)) = Emil", 960, 790, 44, { align: "center" }));
    else expr(ctx, "= #0(#1(#2(Daniel)))", 960, 790, 44, { align: "center", fill: ["ayah", "ibu", "ibu"],
      fillA: [clamp(wr * 3 - 2, 0, 1), clamp(wr * 3 - 1, 0, 1), clamp(wr * 3, 0, 1)] });
    if (fin) alpha(ctx, P(l, 0.8, 0.5), () => { const [x, y] = pos(TV2, "EM"); ring(ctx, x, y - 8, 60, 64, P(l, 0.8, 0.8), GREEN, 6); });
  }

  Object.assign(K.SCENES, {
    soal, notasi, tantangan, pohon, fungsi, kiri, kanan, bukti, makna, komputer, langkah, pohon_v, aturan_v, tantangan_v, jalan_v,
    buka(ctx, b, l) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "Penegak"), 0.8) : 1;
      [880, 1110, 1340, 1570].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v }); });
      if (first) hand(ctx, "Kategori Penegak (SMA)", 1230, 770, 44, { alpha: P(l, at(b, "Penegak"), 0.6) });
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
      kiko(ctx, 300, 520, 220, 0, { wave: l, mood: "happy" });
      bHead(ctx, 620, 470 + Math.sin(l * 3) * 8, 80, "f", FAM.pink); nameTag(ctx, "Annika", 620, 600, 30, "#D6559B");
      bHead(ctx, 860, 470 + Math.sin(l * 3 + 1) * 8, 80, "m", FAM.purple); nameTag(ctx, "Daniel", 860, 600, 30, FAM.purple);
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 740, 760, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Fungsi bertingkat, dibaca dari dalam ke luar", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
