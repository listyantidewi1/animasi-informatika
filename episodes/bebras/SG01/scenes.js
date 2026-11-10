/* SG01 Pembahasan Soal Bebras Siaga 2024-KR-02 "Pesta BBQ" (Korea Selatan), kategori Siaga (kelas 4–6 SD).
   Gaya papan tulis putih + coretan spidol, simulasi "meja panggangan": potongan sate menyala saat dihitung,
   angka ditulis di tabel, lalu tusuk sate digeser ke piring berang-berang.
   Isi sate (dari atas): 1 = d d w d p, 2 = w d d p w, 3 = w d m p d, 4 = p d p d m
   (d daging, w wortel, m bawang merah, p bawang putih). Jawaban: 1→D, 2→B, 3→A, 4→C.
   Papan: x 52–1868, y 130–830 (kartu narasi di bawahnya). Waktu kejadian diambil dari posisi kata di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, kid, ease, clamp, lerp, wrap } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", GRAYL = "#AEB8BF",
        FUR = "#8E5B3A", FUR2 = "#B98458";

  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const dur = b => b.audio || b.dur;
  const posT = (b, i) => lead(b) + Math.max(0, i) / TXT(b).length * dur(b);
  const at = (b, s, from) => { const T = TXT(b); let i0 = 0; if (from) { const f = T.indexOf(from); if (f >= 0) i0 = f; } return posT(b, T.indexOf(s, i0)); };
  const P = (l, t0, d) => ease((l - t0) / (d || 0.6));
  // waktu tiap nama bahan yang disebut berurutan setelah frasa `anchor`
  const NAMA = { d: "daging", w: "wortel", m: "bawang merah", p: "bawang putih" };
  function listTimes(b, anchor, seq) {
    const T = TXT(b); let i = Math.max(0, T.indexOf(anchor)); const out = [];
    for (const k of seq) { const j = T.indexOf(NAMA[k], i); out.push(posT(b, j)); i = j + 1; }
    return out;
  }

  // ---------- papan dan spidol ----------
  function board(ctx) {
    ctx.fillStyle = "#C3CDD4"; rr(ctx, 40, 118, 1840, 724, 22); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, 52, 130, 1816, 700, 14); ctx.fill();
  }
  function plen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
  function mline(ctx, pts, u, color, w) {
    if (u <= 0) return;
    const L = plen(pts) * clamp(u, 0, 1); let s = 0;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (s + d >= L) { const k = d ? (L - s) / d : 0; ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)); break; }
      ctx.lineTo(pts[i][0], pts[i][1]); s += d;
    }
    ctx.stroke(); ctx.restore();
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
    ctx.ellipse(x, y, rx, ry, -0.06, -Math.PI * 0.6, -Math.PI * 0.6 + Math.PI * 2.15 * clamp(u, 0, 1)); ctx.stroke(); ctx.restore();
  }
  function strike(ctx, x0, y0, x1, y1, u, color = ORANGE, w = 6) { mline(ctx, [[x0, y0], [x1, y1]], u, color, w); }
  function hand(ctx, s, x, y, size, opt = {}) {
    ctx.save(); ctx.font = `italic 800 ${size}px ${K.FONT}`; ctx.fillStyle = opt.color || ORANGE; ctx.textAlign = opt.align || "center";
    if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1); ctx.fillText(s, x, y); ctx.restore();
  }
  function timer(ctx, x, y, w, h, l, d, note) {   // jam pasir + "Pikirkan dulu"
    card(ctx, x, y, w, h, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
    const cx = x + w / 2, frac = clamp(l / d, 0, 1), cy = y + h * 0.55;
    text(ctx, "PIKIRKAN DULU", cx, y + 48, 32, { align: "center", weight: 900, color: C.accentDark });
    ctx.strokeStyle = "#E9DDBF"; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(cx, cy, 58, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = C.accent; ctx.beginPath(); ctx.arc(cx, cy, 58, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = "#F4D58D"; ctx.strokeStyle = INK; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-22, -32); ctx.lineTo(22, -32); ctx.lineTo(3, 0); ctx.lineTo(22, 32); ctx.lineTo(-22, 32); ctx.lineTo(-3, 0); ctx.closePath(); ctx.stroke();
    const top = 1 - frac; ctx.beginPath(); ctx.moveTo(-18 * top, -28 + 25 * (1 - top)); ctx.lineTo(18 * top, -28 + 25 * (1 - top)); ctx.lineTo(0, -2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-18 * frac - 2, 30); ctx.lineTo(18 * frac + 2, 30); ctx.lineTo(0, 30 - 25 * frac); ctx.closePath(); ctx.fill();
    ctx.restore();
    if (note) text(ctx, note, cx, y + h - 22, 24, { align: "center", weight: 700, color: C.ink2, fit: w - 30 });
  }

  // ---------- bahan sate ----------
  // s = lebar bahan; digambar berpusat di (x, y)
  function bahan(ctx, k, x, y, s, opt = {}) {
    ctx.save(); ctx.translate(x, y); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    const sc = s / 100; ctx.scale(sc, sc); ctx.lineJoin = "round";
    const OL = "#3A2618";
    if (k === "d") {          // daging: kubus cokelat
      ctx.lineWidth = 3.5; ctx.strokeStyle = OL;
      ctx.fillStyle = "#9A5F33"; ctx.beginPath(); ctx.moveTo(-34, -22); ctx.lineTo(-18, -38); ctx.lineTo(40, -38); ctx.lineTo(24, -22); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#6B3E1E"; ctx.beginPath(); ctx.moveTo(24, -22); ctx.lineTo(40, -38); ctx.lineTo(40, 22); ctx.lineTo(24, 38); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#86512A"; ctx.beginPath(); ctx.rect(-34, -22, 58, 60); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "rgba(255,230,200,0.35)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-26, -8); ctx.lineTo(14, -8); ctx.moveTo(-26, 12); ctx.lineTo(8, 12); ctx.stroke();
    } else if (k === "w") {   // wortel: irisan bulat oranye (dilihat miring)
      ctx.lineWidth = 3.5; ctx.strokeStyle = "#8A3D05";
      ctx.fillStyle = "#D2600A"; ctx.beginPath(); ctx.ellipse(0, 9, 48, 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#F58A1F"; ctx.beginPath(); ctx.ellipse(0, -5, 48, 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#FFB45E"; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, -5, 26, 11, 0, 0, Math.PI * 2); ctx.stroke();
    } else if (k === "m") {   // bawang merah: setengah lingkaran merah muda bergaris
      ctx.fillStyle = "#FBE3EF"; ctx.strokeStyle = "#B52C7A"; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(-48, 26); ctx.arc(0, 26, 48, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#D63A97"; ctx.lineWidth = 4.5;
      for (const r of [38, 27, 16]) { ctx.beginPath(); ctx.arc(0, 26, r, Math.PI, 0); ctx.stroke(); }
    } else {                  // bawang putih: siung putih
      ctx.fillStyle = "#FFF8E4"; ctx.strokeStyle = "#A8946A"; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(-44, 14); ctx.bezierCurveTo(-40, -26, 26, -34, 44, -10); ctx.bezierCurveTo(30, 0, 8, 26, -44, 14); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#D9CBA5"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-30, 6); ctx.bezierCurveTo(-18, -14, 14, -20, 34, -10); ctx.stroke();
    }
    ctx.restore();
  }
  const SATE = { 1: ["d", "d", "w", "d", "p"], 2: ["w", "d", "d", "p", "w"], 3: ["w", "d", "m", "p", "d"], 4: ["p", "d", "p", "d", "m"] };
  const COLS = ["d", "w", "m", "p"];
  const COLNAMA = { d: "daging", w: "wortel", m: "b. merah", p: "b. putih" };
  const CNT = {}; for (const n in SATE) { CNT[n] = {}; COLS.forEach(c => CNT[n][c] = SATE[n].filter(x => x === c).length); }

  // tusuk sate tegak: x = tengah, y = ujung atas tusuk, s = lebar potongan. Tinggi total ±5,4 s.
  // opt: lit (indeks potongan yang menyala → 0..1), dim (0..1), label (teks di bawah), glowAll, ringPiece {i:u}
  const SL = 0.74;   // jarak antarpotongan (× s)
  function sateLen(s) { return s * (0.35 + 5 * SL + 1.5); }
  function sate(ctx, n, x, y, s, opt = {}) {
    const items = Array.isArray(n) ? n : SATE[n];
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    if (opt.dim) ctx.globalAlpha *= 1 - 0.6 * opt.dim;
    const y0 = y + s * 0.35, yEnd = y0 + items.length * s * SL;
    if (opt.glowAll) { ctx.fillStyle = `rgba(238,122,18,${0.16 * opt.glowAll})`; rr(ctx, x - s * 0.75, y - s * 0.15, s * 1.5, sateLen(s) + s * 0.1, s * 0.3); ctx.fill(); }
    // tusuk + pegangan
    ctx.fillStyle = "#E9C9A0"; ctx.strokeStyle = "#B8946A"; ctx.lineWidth = 2;
    rr(ctx, x - s * 0.05, y, s * 0.1, yEnd - y + s * 0.6, s * 0.05); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - s * 0.06, yEnd + s * 0.5); ctx.lineTo(x + s * 0.06, yEnd + s * 0.5); ctx.lineTo(x + s * 0.2, yEnd + s * 1.45); ctx.lineTo(x - s * 0.2, yEnd + s * 1.45); ctx.closePath(); ctx.fill(); ctx.stroke();
    items.forEach((k, i) => {
      const cy = y0 + (i + 0.5) * s * SL, lit = opt.lit ? (opt.lit[i] || 0) : 0;
      if (lit > 0) { ctx.save(); ctx.fillStyle = `rgba(242,177,52,${0.55 * lit})`; ctx.beginPath(); ctx.ellipse(x, cy, s * 0.72, s * 0.42, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      bahan(ctx, k, x, cy, s * (k === "d" ? 0.86 : 0.98));
      if (opt.ringPiece && opt.ringPiece[i] > 0) ring(ctx, x, cy, s * 0.7, s * 0.44, opt.ringPiece[i], opt.ringColor || ORANGE, 5);
    });
    ctx.restore();
    if (opt.label !== false) {
      ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha; if (opt.dim) ctx.globalAlpha *= 1 - 0.6 * opt.dim;
      text(ctx, opt.label || ("Sate " + (Array.isArray(n) ? "" : n)), x, y + sateLen(s) + s * 0.55, opt.labelSize || Math.max(24, s * 0.52), { align: "center", weight: 900, color: INK });
      ctx.restore();
    }
  }
  // tusuk sate mendatar (untuk contoh kecil): potongan pertama di kiri
  function sateH(ctx, items, x, y, s, opt = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.PI / 2); sate(ctx, items, 0, 0, s, { ...opt, label: false }); ctx.restore();
  }

  // ---------- berang-berang berkaus ----------
  const SHIRT = { A: "#D9443B", B: "#2F6FC9", C: "#3DA34E", D: "#EE8DB8" };
  function beaver(ctx, x, y, s, who, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100);
    if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2.5;
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.ellipse(30, 40, 16, 10, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();   // ekor
    ctx.fillStyle = FUR; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * 15, 49, 9, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    // kaus
    ctx.fillStyle = who ? SHIRT[who] : FUR; ctx.beginPath(); ctx.ellipse(0, 22, 31, 26, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (who) {   // lengan kaus
      ctx.beginPath(); ctx.ellipse(-30, 12, 9, 7, 0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(30, 12, 9, 7, -0.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.font = `900 30px ${K.FONT}`; ctx.textAlign = "center"; ctx.lineWidth = 4; ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.strokeText(who, 0, 36); ctx.fillStyle = "#FFFFFF"; ctx.fillText(who, 0, 36); ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2.5;
    }
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -37, 7.5, 0, Math.PI * 2); ctx.fillStyle = FUR; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#5E3B24"; ctx.beginPath(); ctx.arc(k * 23, -37, 3.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = FUR; ctx.beginPath(); ctx.arc(0, -14, 29, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#D7AE84"; ctx.beginPath(); ctx.ellipse(0, -3, 15, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2A1B12"; ctx.beginPath(); ctx.ellipse(0, -10, 6.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 1.5; rr(ctx, -5, -1, 10, 9, 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 8); ctx.stroke();
    ctx.fillStyle = "#1B120C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12, -23, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#fff"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12 + 1.3, -24.4, 1.4, 0, Math.PI * 2); ctx.fill(); }
    if (o.sad) { ctx.strokeStyle = "#2A1B12"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 18, 7, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    ctx.restore();
  }

  // permintaan setiap berang-berang
  const REQ = {
    A: { k: "w", txt: "Aku butuh", short: "butuh", rule: "harus ada" },
    B: { k: "m", txt: "Aku tidak bisa makan", short: "tidak boleh", rule: "tidak boleh ada" },
    C: { k: "p", txt: "Sebanyak mungkin", short: "paling banyak", rule: "paling banyak" },
    D: { k: "d", txt: "Sebanyak mungkin", short: "paling banyak", rule: "paling banyak" },
  };
  // gelembung kata: x,y = kiri atas, ekor ke kiri
  function reqBubble(ctx, who, x, y, w, h, u = 1) {
    if (u <= 0) return;
    ctx.save(); ctx.globalAlpha *= u;
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 3.5; rr(ctx, x, y, w, h, 30); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 2, y + h * 0.55); ctx.lineTo(x - 30, y + h * 0.8); ctx.lineTo(x + 2, y + h * 0.75); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x - 1, y + h * 0.56, 6, h * 0.18);
    const r = REQ[who], lines = wrap(ctx, r.txt, 30, 800, w - 36);
    lines.forEach((ln, i) => text(ctx, ln, x + w / 2, y + 42 + i * 36, 30, { align: "center", weight: 800, color: INK }));
    bahan(ctx, r.k, x + w / 2, y + h - 52, 76);
    ctx.restore();
  }
  // label permintaan kecil di bawah berang-berang: ikon + kata kunci
  function reqTag(ctx, who, x, y, u = 1, hi = 0) {
    if (u <= 0) return;
    const r = REQ[who];
    ctx.save(); ctx.globalAlpha *= u;
    card(ctx, x - 104, y, 208, 76, { fill: hi ? "#FFF1DF" : "#F3F6F8", stroke: hi ? ORANGE : "#C9D2D8", lw: hi ? 4 : 2.5, r: 16 });
    bahan(ctx, r.k, x - 64, y + 38, 58);
    text(ctx, r.short, x + 30, y + 47, 24, { align: "center", weight: 900, color: who === "B" ? RED : INK, fit: 118 });
    ctx.restore();
  }

  // ---------- tabel hitung ----------
  // g: {x, y, lw (lebar kolom label), cw (kolom bahan), hh (tinggi tajuk), rh (tinggi baris), sum (kolom jumlah 0..1)}
  // st: {val(r,c)→alpha angka, sumVal(r)→alpha, hiCol, hiRow, rowGlow{r:u}, rings[[r,c,u,color]], strikes[[r,c,u]], done{r: who}}
  function tableGeo(x, y, sc = 1, sum = false) {
    return { x, y, lw: 150 * sc, cw: 132 * sc, hh: 104 * sc, rh: 88 * sc, sc, sum };
  }
  const colX = (g, c) => g.x + g.lw + (c + 0.5) * g.cw;            // c: 0..3 bahan, 4 jumlah
  const rowY = (g, r) => g.y + g.hh + (r - 0.5) * g.rh;            // r: 1..4
  function hitTable(ctx, g, st = {}) {
    const ncol = g.sum ? 5 : 4, W = g.lw + ncol * g.cw, Ht = g.hh + 4 * g.rh, sc = g.sc;
    const draw = st.draw == null ? 1 : st.draw;
    ctx.save(); ctx.globalAlpha *= draw;
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 3.5; rr(ctx, g.x, g.y, W, Ht, 14); ctx.fill();
    ctx.fillStyle = "#F3F6F8"; rr(ctx, g.x, g.y, W, g.hh, 14); ctx.fill(); ctx.fillRect(g.x, g.y + g.hh - 14, W, 14);
    if (st.hiCol != null) { const c = st.hiCol; ctx.fillStyle = "rgba(238,122,18,0.15)"; ctx.fillRect(g.x + g.lw + c * g.cw + 3, g.y + 3, g.cw - 6, Ht - 6); }
    for (const r in (st.rowGlow || {})) { const u = st.rowGlow[r]; if (u > 0) { ctx.fillStyle = `rgba(242,177,52,${0.28 * u})`; ctx.fillRect(g.x + 3, g.y + g.hh + (r - 1) * g.rh + 2, W - 6, g.rh - 4); } }
    for (const r in (st.done || {})) { ctx.fillStyle = "rgba(170,180,188,0.30)"; ctx.fillRect(g.x + 3, g.y + g.hh + (r - 1) * g.rh + 2, W - 6, g.rh - 4); }
    ctx.strokeStyle = INK; ctx.lineWidth = 3.5; rr(ctx, g.x, g.y, W, Ht, 14); ctx.stroke();
    ctx.strokeStyle = GRAYL; ctx.lineWidth = 2;
    for (let r = 0; r <= 3; r++) { const yy = g.y + g.hh + r * g.rh; ctx.beginPath(); ctx.moveTo(g.x, yy); ctx.lineTo(g.x + W, yy); ctx.stroke(); }
    for (let c = 0; c < ncol; c++) { const xx = g.x + g.lw + c * g.cw; ctx.beginPath(); ctx.moveTo(xx, g.y); ctx.lineTo(xx, g.y + Ht); ctx.stroke(); }
    if (st.hiCol != null) { const c = st.hiCol; ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; rr(ctx, g.x + g.lw + c * g.cw + 3, g.y + 3, g.cw - 6, Ht - 6, 10); ctx.stroke(); }
    // tajuk
    COLS.forEach((k, c) => { bahan(ctx, k, colX(g, c), g.y + 42 * sc, 66 * sc); text(ctx, COLNAMA[k], colX(g, c), g.y + g.hh - 12 * sc, 22 * sc, { align: "center", weight: 800, color: C.ink2 }); });
    if (g.sum) { ctx.save(); ctx.globalAlpha *= g.sum; text(ctx, "Jumlah", colX(g, 4), g.y + g.hh / 2 + 10 * sc, 28 * sc, { align: "center", weight: 900, color: INK }); ctx.restore(); }
    for (let r = 1; r <= 4; r++) {
      text(ctx, "Sate " + r, g.x + g.lw / 2, rowY(g, r) + 12 * sc, 34 * sc, { align: "center", weight: 900, color: INK });
      if (st.done && st.done[r]) hand(ctx, "→ " + st.done[r], g.x + g.lw / 2, rowY(g, r) + 40 * sc, 22 * sc, { color: GREEN });
      COLS.forEach((k, c) => {
        const a = st.val ? st.val(r, c) : 1; if (a <= 0) return;
        const v = typeof a === "object" ? a.v : CNT[r][k], al = typeof a === "object" ? a.a : a;
        hand(ctx, String(v), colX(g, c), rowY(g, r) + 16 * sc, 48 * sc, { color: v === 0 ? "#7A8790" : INK, alpha: al });
      });
      if (g.sum && st.sumVal) { const a = st.sumVal(r); if (a > 0) hand(ctx, "5", colX(g, 4), rowY(g, r) + 16 * sc, 48 * sc, { color: GREEN, alpha: a }); }
    }
    for (const [r, c, u, col] of (st.rings || [])) ring(ctx, colX(g, c), rowY(g, r), g.cw * 0.36, g.rh * 0.4, u, col || GREEN, 5);
    for (const [r, c, u] of (st.strikes || [])) strike(ctx, colX(g, c) - g.cw * 0.32, rowY(g, r) + g.rh * 0.3, colX(g, c) + g.cw * 0.32, rowY(g, r) - g.rh * 0.3, u, ORANGE, 6);
    ctx.restore();
    return { W, H: Ht };
  }

  // ---------- adegan pembuka ----------
  function buka(ctx, b, l) {
    board(ctx);
    const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
    ctx.save(); ctx.beginPath(); ctx.rect(560, 180, 1200 * u, 160); ctx.clip();
    text(ctx, "Tantangan Bebras", 1180, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
    mline(ctx, [[640, 330], [1720, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
    const bu = first ? P(l, at(b, "lomba"), 0.8) : 1;
    ["A", "B", "C", "D"].forEach((w, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, 820 + i * 240, 560 + (1 - v) * 30, 190, w, { alpha: v }); });
    if (!first) hand(ctx, "pelan-pelan, satu langkah demi satu langkah", 1180, 770, 40, { alpha: P(l, at(b, "pelan"), 0.6) });
    if (!first) { const ku = P(l, at(b, "kelas empat"), 0.6); if (ku > 0) { ctx.save(); ctx.globalAlpha = ku; card(ctx, 1490, 160, 340, 70, { fill: "#FFF1DF", stroke: ORANGE, lw: 4, r: 35 }); text(ctx, "Kelas 4, 5, dan 6", 1660, 207, 32, { align: "center", weight: 900, color: ORANGE }); ctx.restore(); } }
    kiko(ctx, 300, 520, 230, 0, { wave: l, mood: "happy" });
  }
  function kredit(ctx, b, l) {
    board(ctx);
    const u = P(l, 0.2, 0.6);
    ctx.save(); ctx.globalAlpha = u;
    const gx = 420, gy = 470, gr = 170;
    ctx.fillStyle = "#DCEEFB"; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#2F6FA8"; ctx.lineWidth = 5; ctx.stroke();
    ctx.lineWidth = 3; for (const k of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.ellipse(gx, gy, gr * Math.abs(Math.cos(k * 1.6)) || 2, gr, 0, 0, Math.PI * 2); ctx.stroke(); }
    for (const k of [-0.5, 0, 0.5]) { const yy = gy + k * gr * 1.3, w = Math.sqrt(Math.max(0, gr * gr - (yy - gy) ** 2)); ctx.beginPath(); ctx.moveTo(gx - w, yy); ctx.lineTo(gx + w, yy); ctx.stroke(); }
    ctx.restore();
    const rows = [["Judul soal", "Pesta BBQ"], ["Tahun", "Bebras 2024"], ["Dibuat oleh", "Tim Bebras Korea Selatan"], ["Kode soal", "2024-KR-02"]];
    const keys = ["berjudul", "berasal", "dibuat oleh", "dibuat oleh"];
    text(ctx, "ASAL SOAL", 720, 230, 32, { weight: 900, color: C.accentDark });
    rows.forEach(([k, v], i) => {
      const a = P(l, at(b, keys[i]) + (i === 3 ? 0.8 : 0), 0.5); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      text(ctx, k, 720, 330 + i * 110, 34, { weight: 700, color: C.ink2 });
      text(ctx, v, 1000, 330 + i * 110, 48, { weight: 900, color: i === 2 ? ORANGE : INK });
      ctx.restore();
    });
    const au = P(l, at(b, "Korea Selatan"), 0.8); if (au > 0) ring(ctx, 1290, 535, 310, 48, au);
  }

  // ---------- soal utuh ----------
  const GRID = { A: [80, 160], B: [545, 160], C: [80, 495], D: [545, 495] };   // kiri atas tiap sel 455×325
  function beaverCell(ctx, who, u, bu, hi) {
    const [x, y] = GRID[who];
    if (u <= 0) return;
    ctx.save(); ctx.globalAlpha *= u;
    ctx.strokeStyle = hi ? ORANGE : "#D5DCE1"; ctx.lineWidth = hi ? 5 : 2.5; rr(ctx, x, y, 445, 320, 16); ctx.stroke();
    beaver(ctx, x + 100, y + 175, 160, who);
    ctx.restore();
    reqBubble(ctx, who, x + 205, y + 40, 225, 210, bu * u);
  }
  function soalSkewers(ctx, u, opt = {}) {
    [1, 2, 3, 4].forEach((n, i) => { const v = clamp(u * 4 - i, 0, 1); if (v > 0) sate(ctx, n, 1140 + i * 200, 160 - (1 - v) * 20, 62, { alpha: v, labelSize: 32 }); });
  }
  function soal(ctx, b, l) {
    board(ctx);
    const id = b.id, step = +id.slice(4);
    const appear = w => step > 1 ? 1 : P(l, at(b, "Mereka adalah") + "ABCD".indexOf(w) * 0.5, 0.5);
    const bub = w => step > 4 ? 1 : step === 3 ? (w === "A" ? P(l, at(b, "Berang-berang A"), 0.5) : w === "B" ? P(l, at(b, "Berang-berang B"), 0.5) : 0)
                       : step === 4 ? (w === "A" || w === "B" ? 1 : w === "C" ? P(l, at(b, "Berang-berang C"), 0.5) : P(l, at(b, "Berang-berang D"), 0.5)) : 0;
    const hi = w => (step === 3 && ((w === "A" && l > at(b, "Berang-berang A") && l < at(b, "Berang-berang B")) || (w === "B" && l > at(b, "Berang-berang B")))) ||
                    (step === 4 && ((w === "C" && l > at(b, "Berang-berang C") && l < at(b, "Berang-berang D")) || (w === "D" && l > at(b, "Berang-berang D"))));
    ["A", "B", "C", "D"].forEach(w => beaverCell(ctx, w, appear(w), bub(w), hi(w)));
    const su = step < 2 ? 0 : step === 2 ? P(l, at(b, "empat tusuk"), 1.6) : 1;
    if (su > 0) {
      soalSkewers(ctx, su);
      if (step === 2) hand(ctx, "1 berang-berang = 1 tusuk sate", 1440, 640, 38, { alpha: P(l, at(b, "Setiap berang"), 0.6) });
    }
    if (step >= 5) {
      const qu = step === 5 ? P(l, 0.3, 0.6) : 1;
      ctx.save(); ctx.globalAlpha = qu;
      card(ctx, 1060, 560, 780, 255, { fill: "#FFFFFF", stroke: ORANGE, lw: 4, r: 18 });
      text(ctx, "PERTANYAAN", 1450, 598, 24, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "Sate mana untuk siapa,", 1450, 640, 32, { align: "center", weight: 800, color: INK });
      text(ctx, "supaya semuanya puas?", 1450, 680, 32, { align: "center", weight: 800, color: INK });
      [1, 2, 3, 4].forEach((n, i) => { const x = 1110 + i * 182; text(ctx, `Sate ${n} =`, x, 765, 30, { weight: 800, color: INK }); text(ctx, "?", x + 140, 767, 36, { align: "center", weight: 900, color: "#9AA6AE" }); });
      ctx.restore();
    }
  }

  // ---------- bahan dan permintaan ----------
  function bahanScene(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "k1" || id === "k2" || id === "k3") {
      text(ctx, "Bahan sate", 960, 200, 44, { align: "center", weight: 900, color: INK });
      const xs = [390, 770, 1150, 1530];
      const show = [
        id === "k1" ? P(l, at(b, "isi tusuk"), 0.5) : 1,
        id === "k1" ? P(l, at(b, "isi tusuk") + 0.4, 0.5) : 1,
        id === "k1" ? P(l, at(b, "isi tusuk") + 0.8, 0.5) : 1,
        id === "k1" ? P(l, at(b, "isi tusuk") + 1.2, 0.5) : 1];
      const lab = [
        id === "k1" ? 0 : id === "k2" ? P(l, at(b, "adalah daging"), 0.5) : 1,
        id === "k1" ? 0 : id === "k2" ? P(l, at(b, "irisan wortel"), 0.5) : 1,
        id === "k3" ? P(l, at(b, "bawang merah"), 0.5) : 0,
        id === "k3" ? P(l, at(b, "bawang putih"), 0.5) : 0];
      const focus = id === "k2" ? (l < at(b, "Yang bulat") ? 0 : 1) : id === "k3" ? (l < at(b, "Yang kecil") ? 2 : 3) : -1;
      COLS.forEach((k, i) => {
        if (show[i] <= 0) return;
        ctx.save(); ctx.globalAlpha = show[i];
        if (focus === i) { ctx.fillStyle = "rgba(242,177,52,0.22)"; rr(ctx, xs[i] - 170, 260, 340, 420, 24); ctx.fill(); }
        bahan(ctx, k, xs[i], 430, k === "d" ? 200 : 230);
        ctx.restore();
        if (lab[i] > 0) { hand(ctx, ["daging", "wortel", "bawang merah", "bawang putih"][i], xs[i], 650, 48, { color: ORANGE, alpha: lab[i] }); }
      });
      return;
    }
    // tiga macam permintaan
    text(ctx, "Tiga macam permintaan", 960, 200, 44, { align: "center", weight: 900, color: INK });
    const rows = [
      { y: 250, kata: "\"aku butuh\"", arti: "harus ada (1 saja cukup)", show: "k5", items: ["d", "w", "d"], mark: "tick" },
      { y: 445, kata: "\"aku tidak bisa makan\"", arti: "tidak boleh ada sama sekali", show: "k6", items: ["d", "m", "d"], mark: "cross" },
      { y: 640, kata: "\"sebanyak mungkin\"", arti: "pilih yang paling banyak", show: "k7", items: null },
    ];
    const order = ["k4", "k5", "k6", "k7"], cur = order.indexOf(id);
    rows.forEach((r, i) => {
      const ri = order.indexOf(r.show); if (cur < ri) return;
      const u = cur === ri ? P(l, 0.3, 0.6) : 1, act = cur === ri;
      ctx.save(); ctx.globalAlpha = u;
      card(ctx, 110, r.y, 1700, 170, { fill: act ? "#FFF8EC" : "#F7F9FA", stroke: act ? ORANGE : "#C9D2D8", lw: act ? 4 : 2.5, r: 22 });
      text(ctx, r.kata, 150, r.y + 72, 40, { weight: 900, color: INK });
      text(ctx, "artinya " + r.arti, 150, r.y + 128, 32, { weight: 700, color: C.ink2 });
      if (r.items) {
        sateH(ctx, r.items, 1180, r.y + 85, 84, { ringPiece: { 1: act ? P(l, at(b, "artinya"), 0.6) : 1 }, ringColor: r.mark === "tick" ? GREEN : RED });
        const mu = act ? P(l, at(b, "artinya") + 0.6, 0.6) : 1;
        if (r.mark === "tick") tick(ctx, 1690, r.y + 85, 80, mu, GREEN, 12); else cross(ctx, 1690, r.y + 85, 64, mu, RED, 12);
      } else {
        const t0 = act ? at(b, "artinya") : -9;
        sateH(ctx, ["d", "d", "w", "d", "p"], 1010, r.y + 48, 52, {});
        sateH(ctx, ["w", "d", "d", "p", "w"], 1010, r.y + 124, 52, {});
        text(ctx, "3 daging", 1440, r.y + 60, 34, { weight: 900, color: INK }); text(ctx, "2 daging", 1440, r.y + 136, 34, { weight: 900, color: INK });
        ring(ctx, 1510, r.y + 48, 95, 34, P(l, t0 + 0.4, 0.7), GREEN, 5);
        tick(ctx, 1690, r.y + 60, 56, P(l, t0 + 1.0, 0.6), GREEN, 10);
      }
      ctx.restore();
    });
    if (id === "k4") hand(ctx, "artinya berbeda-beda", 960, 430, 48, { alpha: P(l, at(b, "artinya berbeda"), 0.6) });
  }

  // ---------- pemanasan: roti ----------
  function roti(ctx, kind, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    ctx.fillStyle = "#E3A75C"; ctx.strokeStyle = "#8A5A22"; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.ellipse(0, 0, 50, 30, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#F2C27E"; ctx.beginPath(); ctx.ellipse(-6, -8, 30, 13, -0.2, 0, Math.PI * 2); ctx.fill();
    if (kind === "cokelat") { ctx.strokeStyle = "#5A3317"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-34, -4); ctx.quadraticCurveTo(-12, -22, 6, -2); ctx.quadraticCurveTo(22, 14, 36, -6); ctx.stroke(); }
    else { ctx.fillStyle = "#FFD84A"; ctx.strokeStyle = "#C79A16"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-26, 10); ctx.lineTo(26, 10); ctx.lineTo(0, -26); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#E8B923"; for (const [cx, cy] of [[-6, 0], [8, -8], [4, 5]]) { ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, Math.PI * 2); ctx.fill(); } }
    ctx.restore();
  }
  function rotiScene(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "p7") {   // papan berganti: roti → empat tusuk sate
      const w = P(l, at(b, "Bedanya"), 1.2);
      ctx.save(); ctx.globalAlpha = 1 - w; kid(ctx, 620, 380, 140, {}); kid(ctx, 1300, 380, 140, { hair: "long" }); roti(ctx, "keju", 620, 660, 150); roti(ctx, "cokelat", 1300, 660, 150); ctx.restore();
      if (w > 0) { ["A", "B", "C", "D"].forEach((who, i) => beaver(ctx, 300 + i * 160, 330, 120, who, { alpha: w })); [1, 2, 3, 4].forEach((n, i) => sate(ctx, n, 1100 + i * 190, 190, 50, { alpha: w, labelSize: 28 })); }
      kiko(ctx, 200, 640, 150, 0, { mood: "happy" });
      return;
    }
    const DX = 520, SX = 1400;   // posisi Dito dan Sinta
    kid(ctx, DX, 350, 190, {}); text(ctx, "Dito", DX, 610, 44, { align: "center", weight: 900, color: INK });
    kid(ctx, SX, 350, 190, { hair: "long" }); text(ctx, "Sinta", SX, 610, 44, { align: "center", weight: 900, color: INK });
    if (id !== "p1") {   // gelembung permintaan
      const du = id === "p2" ? P(l, 0.3, 0.5) : 1, su = id === "p2" ? P(l, at(b, "Sinta berkata"), 0.5) : 1;
      ctx.save(); ctx.globalAlpha = du; card(ctx, 90, 170, 300, 170, { fill: "#FFFFFF", stroke: INK, lw: 3.5, r: 26 });
      text(ctx, "Aku mau", 240, 225, 34, { align: "center", weight: 800, color: INK }); roti(ctx, "keju", 240, 285, 100); ctx.restore();
      ctx.save(); ctx.globalAlpha = su; card(ctx, 1530, 170, 300, 170, { fill: "#FFFFFF", stroke: INK, lw: 3.5, r: 26 });
      text(ctx, "Apa saja boleh", 1680, 225, 32, { align: "center", weight: 800, color: INK }); roti(ctx, "keju", 1625, 285, 84); roti(ctx, "cokelat", 1740, 285, 84); ctx.restore();
    }
    // meja kantin + roti
    ctx.fillStyle = C.tableTop; rr(ctx, 760, 700, 400, 26, 8); ctx.fill(); ctx.fillStyle = C.table; ctx.fillRect(790, 726, 18, 100); ctx.fillRect(1112, 726, 18, 100);
    const home = { keju: [880, 660], cokelat: [1040, 660] };
    let pos = { keju: home.keju, cokelat: home.cokelat }, faceD = 0, marks = null;
    const toD = [DX, 740], toS = [SX, 740];
    const mv = (a, bb, u) => [lerp(a[0], bb[0], u), lerp(a[1], bb[1], u) - Math.sin(u * Math.PI) * 60];
    if (id === "p3") {
      const u1 = P(l, at(b, "kepada Sinta"), 0.9), u2 = P(l, at(b, "Lalu"), 0.9);
      pos = { keju: mv(home.keju, toS, u1), cokelat: mv(home.cokelat, toD, u2) };
      faceD = P(l, at(b, "Wah"), 0.4); marks = { d: ["x", faceD] };
    }
    if (id === "p4" || id === "p4b") {
      const u = id === "p4" ? P(l, at(b, "Dito hanya"), 0.6) : 1;
      ctx.save(); ctx.globalAlpha = u;
      card(ctx, DX - 120, 650, 240, 64, { fill: "#FFF1DF", stroke: ORANGE, lw: 4, r: 32 }); text(ctx, "1 pilihan", DX, 694, 34, { align: "center", weight: 900, color: ORANGE });
      ctx.restore();
      const v = id === "p4b" ? P(l, 0.3, 0.6) : 0;
      ctx.save(); ctx.globalAlpha = v; card(ctx, SX - 120, 650, 240, 64, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 3, r: 32 }); text(ctx, "2 pilihan", SX, 694, 34, { align: "center", weight: 900, color: INK }); ctx.restore();
      if (id === "p4b") ring(ctx, DX, 440, 180, 280, P(l, at(b, "kita bagikan"), 0.8));
    }
    if (id === "p5" || id === "p6") {
      const u1 = id === "p5" ? P(l, 0.3, 0.9) : 1, u2 = id === "p5" ? P(l, at(b, "Jadi, Sinta"), 0.9) : 1;
      pos = { keju: mv(home.keju, toD, u1), cokelat: mv(home.cokelat, toS, u2) };
      marks = { d: ["v", u1 >= 1 ? 1 : 0], s: ["v", id === "p5" ? P(l, at(b, "Sekarang"), 0.5) : 1] };
      if (id === "p6") {
        const u = P(l, at(b, "Kita melihat"), 0.6);
        ctx.save(); ctx.globalAlpha = u; card(ctx, 480, 160, 960, 84, { fill: "#FFF1DF", stroke: ORANGE, lw: 4, r: 42 });
        text(ctx, "Mulai dari yang pilihannya paling sedikit", 960, 216, 38, { align: "center", weight: 900, color: ORANGE }); ctx.restore();
      }
    }
    roti(ctx, "keju", pos.keju[0], pos.keju[1], 150); roti(ctx, "cokelat", pos.cokelat[0], pos.cokelat[1], 150);
    if (marks) {
      if (marks.d) { const [k, u] = marks.d; if (k === "x") cross(ctx, DX + 160, 260, 80, u, RED, 12); else tick(ctx, DX + 160, 260, 90, u, GREEN, 13); }
      if (marks.s) { const [k, u] = marks.s; tick(ctx, SX - 160, 260, 90, u, GREEN, 13); }
    }
    if (faceD > 0) hand(ctx, "tidak puas", DX + 250, 560, 44, { color: RED, alpha: faceD, align: "left" });
    kiko(ctx, 960, 420, 170, 0, { mood: id === "p3" && faceD > 0 ? "confused" : "happy" });
  }

  // ---------- tabel hitung ----------
  // untuk tiap sate: beat daftar, frasa awal daftar, beat ringkasan ("Jadi"), frasa nol
  const COUNTB = {
    1: { list: "t2", anchor: "Ada daging", sum: "t3", zero: [["m", "angka nol"]] },
    2: { list: "t4", anchor: "Ada wortel", sum: "t4b", zero: [["m", "tidak punya bawang merah"]] },
    3: { list: "t5", anchor: "Sate tiga berisi", sum: "t5", sumAt: "Jadi", zero: [] },
    4: { list: "t6", anchor: "Sate empat berisi", sum: "t6", sumAt: "Jadi", zero: [["w", "tidak punya wortel"]] },
  };
  const TORDER = ["t1", "t2", "t3", "t4", "t4b", "t5", "t6", "t7", "t8"];
  function tabelScene(ctx, b, l) {
    board(ctx);
    const id = b.id, cur = TORDER.indexOf(id);
    const sumCol = id === "t7" ? P(l, at(b, "Kalau angka"), 0.6) : id === "t8" ? 1 : 0;
    const g = tableGeo(80, 160, 1.12, sumCol > 0 ? sumCol : false);
    // sate mana yang sedang dihitung
    let active = 0; for (const n of [1, 2, 3, 4]) { const cb = COUNTB[n]; if (id === cb.list || id === cb.sum) active = n; }
    // nilai sel
    const val = (r, c) => {
      const cb = COUNTB[r], k = COLS[c], li = TORDER.indexOf(cb.list), si = TORDER.indexOf(cb.sum);
      const zeroPh = cb.zero.find(z => z[0] === k);
      if (cur > si) return 1;
      if (CNT[r][k] === 0) { if (cur === si && zeroPh) { const a = P(l, at(b, zeroPh[1]), 0.5); return a; } return 0; }
      if (cur < li) return 0;
      if (cur > li) return 1;
      // sedang menghitung: angka naik setiap kali bahan disebut
      const times = listTimes(b, cb.anchor, SATE[r]);
      let n = 0, last = -9; SATE[r].forEach((x, i) => { if (x === k && l >= times[i]) { n++; last = times[i]; } });
      if (!n) return 0;
      return { v: n, a: 1 };
    };
    const rowGlow = {}; if (active) rowGlow[active] = 1;
    const rings = [];
    if (active) { const cb = COUNTB[active]; if (id === cb.sum) { const t0 = cb.sumAt ? at(b, cb.sumAt) : 0.2; rowGlow[active] = 1; rings.push(); } }
    const sumVal = r => id === "t8" ? 1 : id === "t7" ? P(l, at(b, "hasilnya") + (r - 1) * 0.5, 0.5) : 0;
    hitTable(ctx, g, { draw: id === "t1" ? P(l, at(b, "kita hitung"), 0.8) : 1, val, rowGlow, sumVal });
    if (id === "t8") for (let r = 1; r <= 4; r++) tick(ctx, colX(g, 4) + 105, rowY(g, r), 50, P(l, 0.3 + r * 0.35, 0.4), GREEN, 8);
    // penjumlahan di bawah tabel
    if (id === "t7" || id === "t8") {
      const u = id === "t7" ? P(l, at(b, "hasilnya"), 0.6) : 1;
      hand(ctx, "3 + 1 + 0 + 1 = 5", 460, 725, 44, { color: INK, alpha: u });
      if (id === "t7") hand(ctx, "setiap tusuk: 5 potong", 460, 795, 36, { alpha: P(l, at(b, "lima potong"), 0.6) });
      if (id === "t8") hand(ctx, "tidak ada yang terlewat!", 460, 795, 40, { color: GREEN, alpha: P(l, at(b, "Berarti"), 0.6) });
    }
    // empat tusuk sate di kanan; yang sedang dihitung menyala
    const xs = sumCol > 0 ? [1170, 1350, 1530, 1710] : [1120, 1310, 1500, 1690];
    [1, 2, 3, 4].forEach((n, i) => {
      let lit = null, dim = active && active !== n ? 1 : 0, glow = 0;
      if (active === n) {
        const cb = COUNTB[n];
        if (id === cb.list) { const times = listTimes(b, cb.anchor, SATE[n]); lit = SATE[n].map((_, j) => l >= times[j] ? (l < (times[j + 1] ?? times[j] + 0.9) ? 1 : 0.35) : 0); }
        else glow = 1;
      }
      if (id === "t7") { const k = clamp((l - at(b, "lima potong")) / 1.2, 0, 1); if (k > 0) lit = SATE[n].map((_, j) => (k * 5 > j ? 0.6 : 0)); }
      sate(ctx, n, xs[i], 175, 66, { lit, dim, glowAll: glow, labelSize: 34 });
      if (id === "t7") { const k = P(l, at(b, "lima potong") + 1.2, 0.5); hand(ctx, "5", xs[i] + 62, 200, 40, { color: GREEN, alpha: k }); }
    });
    if (id === "t1") hand(ctx, "hitung, lalu tulis", 1400, 790, 40, { alpha: P(l, at(b, "kita hitung"), 0.6) });
  }

  // ---------- mencari pilihan ----------
  const RX = { A: 1085, B: 1305, C: 1525, D: 1745 };
  const OPTS = { A: [1, 2, 3], B: [1, 2], C: [4], D: [1] };
  const COLOF = { A: 1, B: 2, C: 3, D: 0 };
  function beaversRow(ctx, y, s, opt = {}) {
    for (const w of "ABCD") {
      const dim = opt.focus && opt.focus !== w ? 0.45 : 1;
      ctx.save(); ctx.globalAlpha *= dim;
      if (opt.focus === w) { ctx.fillStyle = "rgba(242,177,52,0.22)"; rr(ctx, RX[w] - 108, y - s * 0.8, 216, s * 1.55 + 100, 18); ctx.fill(); }
      beaver(ctx, RX[w], y, s, w);
      reqTag(ctx, w, RX[w], y + s * 0.62, 1, opt.focus === w);
      ctx.restore();
    }
  }
  function optBox(ctx, w, y, val, u, opt = {}) {   // kotak "Pilihan" di bawah berang-berang
    const x = RX[w];
    ctx.save();
    card(ctx, x - 104, y, 208, 120, { fill: "#FFFFFF", stroke: opt.hi ? ORANGE : "#B8C3CA", lw: opt.hi ? 4 : 2.5, r: 16 });
    text(ctx, "pilihan sate", x, y + 32, 24, { align: "center", weight: 800, color: C.ink2 });
    if (val && u > 0) {
      const s = val.join(", ");
      hand(ctx, s, x, y + 98, s.length > 4 ? 50 : 58, { color: INK, alpha: u });
    } else text(ctx, "?", x, y + 98, 50, { align: "center", weight: 900, color: "#9AA6AE" });
    if (opt.count && opt.count > 0) { ctx.globalAlpha *= opt.count; const n = val.length; card(ctx, x - 80, y + 135, 160, 50, { fill: n === 1 ? "#FFF1DF" : "#F3F6F8", stroke: n === 1 ? ORANGE : "#C9D2D8", lw: n === 1 ? 4 : 2, r: 25 }); text(ctx, `${n} pilihan`, x, y + 170, 26, { align: "center", weight: 900, color: n === 1 ? ORANGE : INK }); }
    ctx.restore();
  }
  // tiap beat: berang-berang yang dibahas, kapan pilihannya ditulis
  const CORDER = ["c1", "c2", "c2b", "c3", "c3b", "c4", "c4b", "c5", "c5b", "c6", "c6b", "c7"];
  const CBEAT = { A: ["c2", "c2b", "Jadi, A"], B: ["c3", "c3b", "Jadi, B"], C: ["c4", "c5b", "C hanya"], D: ["c6", "c6b", "Jadi, D"] };
  function hint(ctx, lines, u) {   // kartu petunjuk di bawah tabel
    if (u <= 0) return;
    ctx.save(); ctx.globalAlpha *= u;
    card(ctx, 80, 640, 830, 170, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    lines.forEach((s, i) => text(ctx, s, 110, 703 + i * 60, 36, { weight: 800, color: i ? ORANGE : INK, fit: 780 }));
    ctx.restore();
  }
  function pilihanScene(ctx, b, l) {
    board(ctx);
    const id = b.id, cur = CORDER.indexOf(id);
    let focus = null; for (const w of "ABCD") { const [a, z] = CBEAT[w]; if (cur >= CORDER.indexOf(a) && cur <= CORDER.indexOf(z)) focus = w; }
    const g = tableGeo(80, 160, 1.0);
    const st = { rings: [], strikes: [] };
    if (focus) st.hiCol = COLOF[focus];
    const R = (r, c, t0, col) => st.rings.push([r, c, P(l, t0, 0.5), col]);
    const S = (r, c, t0) => st.strikes.push([r, c, P(l, t0, 0.5)]);
    const pre = (ph) => -9;
    if (focus === "A") {
      const t1 = id === "c2" ? at(b, "Sate satu") : -9;
      [1, 2, 3].forEach((r, i) => R(r, 1, t1 + i * 0.5, GREEN));
      S(4, 1, id === "c2b" ? at(b, "Sate empat") : 99);
    }
    if (focus === "B") {
      const t1 = id === "c3b" ? at(b, "Sate tiga") : 99, t2 = id === "c3b" ? at(b, "Yang boleh") : 99;
      [3, 4].forEach((r, i) => S(r, 2, t1 + i * 0.5)); [1, 2].forEach((r, i) => R(r, 2, t2 + i * 0.5, GREEN));
    }
    if (focus === "C") {
      const t1 = id === "c5" ? at(b, "sate satu") : id === "c5b" ? -9 : 99, t2 = id === "c5b" ? at(b, "Sate empat") : 99;
      [1, 2, 3].forEach((r, i) => R(r, 3, t1 + i * 0.4, "#9AA6AE")); R(4, 3, t2, GREEN);
    }
    if (focus === "D") {
      const t1 = id === "c6" ? at(b, "sate satu punya") : -9, t2 = id === "c6b" ? at(b, "Sate yang lain") : 99;
      R(1, 0, t1, GREEN); [2, 3, 4].forEach((r, i) => R(r, 0, t2 + i * 0.4, "#9AA6AE"));
    }
    hitTable(ctx, g, st);
    // petunjuk di bawah tabel
    const H = { A: ["A butuh wortel:", "cari angka lebih dari 0 di kolom wortel"], B: ["B tidak bisa makan bawang merah:", "hanya boleh angka 0 di kolom bawang merah"],
                C: ["C: bawang putih sebanyak mungkin:", "cari angka paling besar di kolom bawang putih"], D: ["D: daging sebanyak mungkin:", "cari angka paling besar di kolom daging"] };
    if (focus) hint(ctx, H[focus], P(l, 0.2, 0.5));
    else if (id === "c1") hint(ctx, ["Lihat tabelnya,", "lalu cocokkan dengan permintaan"], P(l, at(b, "Kita lihat"), 0.5));
    else if (id === "c7") hint(ctx, ["Pilihan paling sedikit:", "C dan D (masing-masing 1 pilihan)"], P(l, at(b, "C dan D"), 0.5));
    beaversRow(ctx, 250, 150, { focus });
    for (const w of "ABCD") {
      const [a, z, ph] = CBEAT[w], zi = CORDER.indexOf(z);
      const u = cur > zi ? 1 : cur === zi ? P(l, at(b, ph), 0.6) : 0;
      const cnt = id === "c7" ? P(l, at(b, w === "A" ? "A punya" : w === "B" ? "B punya" : "C dan D"), 0.5) : 0;
      optBox(ctx, w, 450, OPTS[w], u, { hi: focus === w, count: cnt });
    }
    if (id === "c4b") { const t0 = at(b, "Hentikan"); timer(ctx, 985, 600, 860, 215, l - t0, Math.max(4, b.dur - t0 - 0.3), "Lihat kolom bawang putih."); }
    if (id === "c7") { for (const w of "CD") ring(ctx, RX[w], 610, 96, 36, P(l, at(b, "C dan D") + 0.5, 0.6)); }
  }

  // ---------- membagikan sate ----------
  const MEJA = { 1: 200, 2: 380, 3: 560, 4: 740 };   // x tusuk di meja
  const OWNER = { 1: "D", 2: "B", 3: "A", 4: "C" };
  const GIVE = { 4: ["b2", "Jadi, sate empat"], 1: ["b3", "Jadi, sate satu"], 2: ["b5", "yaitu sate dua"], 3: ["b6b", "Jadi, A"] };
  const BORDER = ["b1", "b2", "b3", "b4", "b5", "b6", "b6b"];
  function bagiScene(ctx, b, l) {
    board(ctx);
    const id = b.id, cur = BORDER.indexOf(id);
    const given = n => { const [bb, ph] = GIVE[n], gi = BORDER.indexOf(bb); return cur > gi ? 1 : cur === gi ? clamp((l - at(b, ph)) / 1.3, 0, 1) : 0; };
    // tabel kecil
    const g = tableGeo(80, 150, 0.8);
    const done = {}; for (const n of [1, 2, 3, 4]) if (given(n) >= 1) done[n] = OWNER[n];
    const st = { done, rings: [] };
    if (id === "b5") { st.hiCol = 2; st.rings.push([2, 2, P(l, at(b, "tidak punya bawang"), 0.5), GREEN]); }
    if (id === "b6b") { st.hiCol = 1; st.rings.push([3, 1, P(l, at(b, "Sate tiga punya"), 0.5), GREEN]); }
    hitTable(ctx, g, st);
    // meja panggangan
    ctx.fillStyle = "#F4EDE2"; rr(ctx, 80, 540, 760, 280, 18); ctx.fill(); ctx.strokeStyle = "#D8C7AE"; ctx.lineWidth = 3; ctx.stroke();
    text(ctx, "meja panggangan", 830, 570, 22, { align: "right", weight: 800, color: "#9A8466" });
    const focus = id === "b2" ? "C" : id === "b3" ? "D" : (id === "b4" || id === "b5") ? "B" : (id === "b6" || id === "b6b") ? "A" : null;
    for (const w of "ABCD") {
      const x = RX[w], dim = focus && focus !== w ? 0.55 : 1;
      ctx.save(); ctx.globalAlpha = dim;
      if (focus === w) { ctx.fillStyle = "rgba(242,177,52,0.20)"; rr(ctx, x - 108, 145, 216, 680, 18); ctx.fill(); }
      beaver(ctx, x, 225, 120, w);
      reqTag(ctx, w, x, 305, 1, focus === w);
      card(ctx, x - 90, 392, 180, 60, { fill: "#FFFFFF", stroke: "#B8C3CA", lw: 2.5, r: 14 });
      hand(ctx, OPTS[w].join(", "), x, 436, 36, { color: INK });
      if (w === "B" && cur >= BORDER.indexOf("b5")) strike(ctx, x - 58, 440, x - 26, 410, id === "b5" ? P(l, at(b, "sudah diberikan"), 0.5) : 1, ORANGE, 6);
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#B8C3CA"; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, 774, 90, 20, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();   // piring
      ctx.restore();
    }
    if (id === "b1") for (const w of "CD") ring(ctx, RX[w], 422, 104, 44, P(l, at(b, "yaitu C"), 0.6));
    // tusuk sate: dari meja ke piring
    for (const n of [1, 2, 3, 4]) {
      const u = ease(given(n)), w = OWNER[n], s = lerp(42, 48, u);
      const x = lerp(MEJA[n], RX[w], u), y = lerp(552, 772 - sateLen(48), u) - Math.sin(u * Math.PI) * 80;
      sate(ctx, n, x, y, s, { label: false });
      text(ctx, "Sate " + n, x, u >= 1 ? 820 : y + sateLen(s) + 26, 28, { align: "center", weight: 900, color: u >= 1 ? ORANGE : INK });
      if (u >= 1) tick(ctx, RX[w] + 66, 560, 46, 1, GREEN, 8);
    }
    if (id === "b4") { const t0 = at(b, "Sate mana"); timer(ctx, 975, 480, 440, 250, l - t0, Math.max(4, b.dur - t0 - 0.3), "Sate 1 atau sate 2?"); }
  }

  // ---------- memeriksa jawaban ----------
  const PX = { A: 760, B: 1050, C: 1340, D: 1630 };
  const OF = { A: 3, B: 2, C: 4, D: 1 };
  function periksaScene(ctx, b, l) {
    board(ctx);
    const id = b.id;
    // kartu jawaban
    card(ctx, 80, 160, 470, 400, { fill: "#FFFFFF", stroke: "#B8C3CA", lw: 3, r: 18 });
    text(ctx, "JAWABAN", 315, 210, 26, { align: "center", weight: 900, color: C.ink2 });
    [1, 2, 3, 4].forEach((n, i) => {
      const y = 290 + i * 74, hi = id === "r1" ? clamp(1 - Math.abs(l - at(b, `Sate ${["satu", "dua", "tiga", "empat"][i]} diberikan`) - 0.8) / 1.0, 0, 1) : 0;
      if (hi > 0) { ctx.fillStyle = `rgba(242,177,52,${0.3 * hi})`; rr(ctx, 100, y - 50, 430, 66, 12); ctx.fill(); }
      text(ctx, `Sate ${n} =`, 130, y, 40, { weight: 800, color: INK }); hand(ctx, OWNER[n], 420, y + 2, 50, { color: ORANGE });
    });
    // berang-berang dengan satenya
    const chk = {
      A: id === "r2" ? P(l, at(b, "sate tiga punya"), 0.5) : ["r3", "r3b", "r4", "r5"].includes(id) ? 1 : 0,
      B: id === "r2" ? P(l, at(b, "sate dua tidak"), 0.5) : ["r3", "r3b", "r4", "r5"].includes(id) ? 1 : 0,
      C: id === "r3" ? P(l, at(b, "paling banyak di antara"), 0.5) : ["r3b", "r4", "r5"].includes(id) ? 1 : 0,
      D: id === "r3b" ? P(l, at(b, "juga paling"), 0.5) : ["r4", "r5"].includes(id) ? 1 : 0,
    };
    const focus = id === "r2" ? (l < at(b, "B tidak") ? "A" : "B") : id === "r3" ? "C" : id === "r3b" ? "D" : null;
    for (const w of "ABCD") {
      const x = PX[w], n = OF[w], items = SATE[n];
      if (focus === w) { ctx.fillStyle = "rgba(242,177,52,0.18)"; rr(ctx, x - 125, 150, 250, 670, 18); ctx.fill(); }
      beaver(ctx, x, 240, 120, w);
      reqTag(ctx, w, x, 318, 1, focus === w);
      const k = REQ[w].k, rp = {};
      if (focus === w) items.forEach((it, j) => { if (it === k) rp[j] = P(l, at(b, w === "A" ? "sate tiga" : w === "B" ? "sate dua" : w === "C" ? "sate empat" : "sate satu") + 0.2, 0.5); });
      sate(ctx, n, x, 405, 64, { labelSize: 30, ringPiece: rp, ringColor: w === "B" ? RED : GREEN });
      if (w === "B" && focus === "B") hand(ctx, "tanpa bawang merah", x, 818, 26, { color: GREEN, alpha: P(l, at(b, "sate dua tidak"), 0.5) });
      if (chk[w] > 0) tick(ctx, x + 70, 190, 56, chk[w], GREEN, 10);
    }
    if (id === "r4") { const u = P(l, at(b, "Keempat"), 0.6); ctx.save(); ctx.globalAlpha = u; card(ctx, 80, 600, 470, 200, { fill: C.goodBg, stroke: GREEN, lw: 4, r: 18 }); text(ctx, "1 sate untuk", 315, 680, 40, { align: "center", weight: 900, color: GREEN }); text(ctx, "setiap berang-berang", 315, 735, 36, { align: "center", weight: 900, color: GREEN }); ctx.restore(); }
    if (id === "r5") { const u = P(l, 0.3, 0.6); ctx.save(); ctx.globalAlpha = u; card(ctx, 80, 600, 470, 200, { fill: C.goodBg, stroke: GREEN, lw: 4, r: 18 }); tick(ctx, 170, 700, 80, u, GREEN, 12); text(ctx, "Pasti benar!", 360, 715, 44, { align: "center", weight: 900, color: GREEN }); ctx.restore(); }
  }

  // ---------- penutup ----------
  function jadwal(ctx, b, l) {
    board(ctx);
    kiko(ctx, 230, 520, 200, 0, { mood: "happy" });
    const days = ["Senin", "Selasa", "Rabu"], X0 = 560, Y0 = 220, cw = 400, rh = 125;
    text(ctx, "JADWAL PELAJARAN", X0 + cw * 1.5, 190, 32, { align: "center", weight: 900, color: C.accentDark });
    const gu = b.id === "e1" ? P(l, at(b, "Contohnya"), 0.8) : 1;
    ctx.save(); ctx.globalAlpha = gu;
    days.forEach((d, i) => { card(ctx, X0 + i * cw, Y0, cw - 12, 60, { fill: "#F3F6F8", stroke: "#C9D2D8", lw: 2, r: 12 }); text(ctx, d, X0 + i * cw + (cw - 12) / 2, Y0 + 42, 30, { align: "center", weight: 900, color: INK }); });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { ctx.strokeStyle = "#C9D2D8"; ctx.lineWidth = 2.5; rr(ctx, X0 + c * cw, Y0 + 75 + r * rh, cw - 12, rh - 14, 12); ctx.stroke(); }
    ctx.restore();
    const cell = (c, r, s, col, u) => { if (u <= 0) return; ctx.save(); ctx.globalAlpha = u; card(ctx, X0 + c * cw + 4, Y0 + 79 + r * rh, cw - 20, rh - 22, { fill: col, r: 10 }); text(ctx, s, X0 + c * cw + (cw - 12) / 2, Y0 + 75 + r * rh + 66, 30, { align: "center", weight: 800, color: "#FFFFFF", fit: cw - 40 }); ctx.restore(); };
    if (b.id === "e1b") {
      const u1 = P(l, at(b, "Ada guru"), 0.5), u2 = P(l, at(b, "Ada kelas"), 0.5);
      for (let r = 0; r < 3; r++) { cross(ctx, X0 + 70, Y0 + 75 + r * rh + 55, 44, u1, RED, 8); ctx.save(); ctx.globalAlpha = u1; text(ctx, "Bu Ani", X0 + 110, Y0 + 75 + r * rh + 66, 28, { weight: 800, color: RED }); ctx.restore(); }
      hand(ctx, "lab kosong", X0 + 2 * cw + (cw - 12) / 2, Y0 + 75 + 66, 32, { color: GREEN, alpha: u2 });
      hand(ctx, "Bu Ani: tidak bisa hari Senin", X0 + 590, 720, 36, { color: RED, alpha: u1 });
      hand(ctx, "Kelas 5: butuh lab komputer", X0 + 590, 780, 36, { color: INK, alpha: u2 });
    }
    if (b.id === "e2") {
      const t0 = at(b, "mengisi dulu");
      ring(ctx, X0 + cw * 2 + (cw - 12) / 2, Y0 + 75 + 55, 190, 64, P(l, t0, 0.6));
      cell(2, 0, "Lab · Kelas 5", ORANGE, P(l, t0 + 0.8, 0.5));
      cell(1, 1, "Matematika · Bu Ani", C.kiko, P(l, t0 + 1.8, 0.5));
      cell(0, 0, "IPA", "#3DA34E", P(l, t0 + 2.6, 0.5));
      cell(0, 2, "Bahasa", "#7A5AC9", P(l, t0 + 3.2, 0.5));
      hand(ctx, "isi dulu yang pilihannya paling sedikit", X0 + 590, 760, 38, { alpha: P(l, t0, 0.6) });
    }
  }
  function langkah(ctx, b, l) {
    board(ctx);
    text(ctx, "TIGA LANGKAH", 960, 210, 40, { align: "center", weight: 900, color: C.accentDark });
    const L3 = [["Hitung isinya dan tulis di tabel.", "Pertama", "e3"], ["Cari pilihan untuk setiap teman.", "Kedua", "e3b"], ["Mulai dari yang pilihannya paling sedikit.", "Ketiga", "e3b"]];
    L3.forEach(([s, ph, bid], i) => {
      const u = b.id === "e3" && bid === "e3b" ? 0 : b.id === bid ? P(l, at(b, ph), 0.6) : 1; if (u <= 0) return;
      const y = 260 + i * 175;
      ctx.save(); ctx.globalAlpha = u; card(ctx, 200, y, 1520, 140, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 3, r: 70 });
      ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(275, y + 70, 48, 0, Math.PI * 2); ctx.fill();
      text(ctx, String(i + 1), 275, y + 90, 56, { align: "center", color: "#fff", weight: 900 });
      text(ctx, s, 360, y + 88, 48, { weight: 900, color: INK, fit: 1120 });
      if (i === 0) { const g = tableGeo(1530, y + 18, 0.2); hitTable(ctx, g, {}); }
      if (i === 1) { card(ctx, 1560, y + 30, 110, 80, { fill: "#FFFFFF", stroke: "#B8C3CA", lw: 2.5, r: 12 }); hand(ctx, "1, 2", 1615, y + 86, 34, { color: INK }); }
      if (i === 2) { ctx.fillStyle = "#FFF1DF"; ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(1615, y + 70, 44, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); text(ctx, "1", 1615, y + 90, 54, { align: "center", weight: 900, color: ORANGE }); }
      ctx.restore();
    });
  }
  function akhir(ctx, b, l) {
    board(ctx);
    kiko(ctx, 230, 470, 200, 0, { wave: l, mood: "happy" });
    for (const w of "ABCD") { const i = "ABCD".indexOf(w), x = 450 + i * 180, y = 330 + Math.sin(l * 3 + i) * 8; beaver(ctx, x, y, 140, w); sate(ctx, OF[w], x + 78, y - 60, 30, { label: false }); }
    card(ctx, 1200, 170, 630, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
    text(ctx, "TERIMA KASIH", 1515, 230, 34, { align: "center", weight: 900, color: C.accentDark });
    const L = [["Soal:", "Pesta BBQ"], ["Bebras:", "2024"], ["Kontributor:", "Korea Selatan"], ["Kategori:", "Siaga (kelas 4–6)"], ["Kode soal:", "2024-KR-02"]];
    L.forEach(([k, v], i) => { const y = 310 + i * 66; text(ctx, k, 1240, y, 28, { weight: 700, color: C.ink2 }); text(ctx, v, 1450, y, 32, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 360 }); });
    para(ctx, "Gambar soal digambar ulang untuk video ini.", 1515, 680, 26, 580, { align: "center", weight: 600, color: C.ink2 });
    hand(ctx, "Semoga sukses!", 720, 720, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
  }
  function cta_bebras(ctx, b, l) {
    board(ctx);
    text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
    text(ctx, "Pesta BBQ", 960, 340, 80, { align: "center", weight: 900, color: INK });
    text(ctx, "Soal Bebras Siaga 2024-KR-02 · Korea Selatan", 960, 420, 38, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, "Tabel hitung, langkah demi langkah", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
    for (const w of "ABCD") beaver(ctx, 660 + "ABCD".indexOf(w) * 200, 650, 140, w);
  }

  // soal untuk layar vertikal (Short): empat tusuk sate di atas, empat berang-berang + permintaan di bawah; potong [460, 130, 1000, 700]
  function soal_v(ctx, b, l) {
    board(ctx);
    [1, 2, 3, 4].forEach((n, i) => sate(ctx, n, 600 + i * 240, 150, 52, { labelSize: 30 }));
    const cells = { A: [470, 495], B: [960, 495], C: [470, 665], D: [960, 665] };
    for (const w of "ABCD") {
      const [x, y] = cells[w];
      beaver(ctx, x + 70, y + 75, 120, w);
      const r = REQ[w];
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 3; rr(ctx, x + 145, y + 18, 330, 120, 24); ctx.fill(); ctx.stroke();
      const lines = wrap(ctx, r.txt, 28, 800, 210);
      lines.forEach((ln, i) => text(ctx, ln, x + 165, y + 78 - (lines.length - 1) * 17 + i * 34, 28, { weight: 800, color: INK }));
      bahan(ctx, r.k, x + 425, y + 78, 70);
    }
  }

  Object.assign(K.SCENES, { buka, kredit, soal, bahan: bahanScene, roti: rotiScene, tabel: tabelScene, pilihan: pilihanScene, bagi: bagiScene, periksa: periksaScene, jadwal, langkah, akhir, cta_bebras, soal_v });
  K.bebrasSG = { beaver, sate, bahan, hitTable, tableGeo, SATE };
})(typeof window !== "undefined" ? window : globalThis);
