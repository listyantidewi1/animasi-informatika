/* B04 Pembahasan Soal Bebras 2023-ID-01 "Melempar Koin" (Indonesia), kategori SiKecil.
   Gaya papan tulis putih dengan coretan spidol (sama dengan B01–B03, SG03) + simulasi:
   Delia melempar koin; koin punya dua sisi, Angka (tulisan 500) dan Gambar (bintang); setiap koin selalu diberi label tulisan.
   Tiga kotak (koin 1, 2, 3) diisi satu per satu dengan petunjuk "berbeda" dan "sama", lalu dicocokkan dengan pilihan A–D.
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F7FD1",
        GRAYT = "#8A96A0", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Melempar Koin", asli: "", tahun: "2023", negara: "Indonesia", kode: "2023-ID-01" };

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

  const SIDE = { A: "Angka", G: "Gambar" };
  // ---------- benda: koin, Delia, sendal ----------
  function star(ctx, cx, cy, R, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r : R; ctx.lineTo(cx + q * Math.cos(a), cy + q * Math.sin(a)); }
    ctx.closePath();
  }
  // koin: side "A" (tulisan 500) atau "G" (bintang); label tulisan di bawahnya selalu ada kecuali opt.label === false
  function coin(ctx, side, cx, cy, r, opt = {}) {
    const sx = opt.flip != null ? Math.max(0.05, Math.abs(opt.flip)) : 1;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sx, 1);
    ctx.fillStyle = "#F39A1E"; ctx.strokeStyle = "#B8650C"; ctx.lineWidth = Math.max(2, r * 0.05);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#FBBF2E"; ctx.strokeStyle = "#DC8A16"; ctx.lineWidth = Math.max(1.5, r * 0.04);
    ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.28)"; ctx.beginPath(); ctx.ellipse(-r * 0.32, -r * 0.4, r * 0.28, r * 0.12, -0.6, 0, Math.PI * 2); ctx.fill();
    if (side === "A") text(ctx, "500", 0, r * 0.22, r * 0.6, { align: "center", weight: 900, color: "#B55F08" });
    else { star(ctx, 0, 0, r * 0.56, r * 0.24); ctx.fillStyle = "#FFE27A"; ctx.fill(); ctx.strokeStyle = "#C97A10"; ctx.lineWidth = Math.max(1.5, r * 0.05); ctx.lineJoin = "round"; ctx.stroke(); }
    ctx.restore();
    if (opt.label !== false) {
      const ls = opt.ls || Math.max(22, r * 0.36);
      text(ctx, SIDE[side], cx, cy + r + ls * 1.05, ls, { align: "center", weight: 800, color: opt.lc || INK });
    }
    ctx.restore();
  }
  // Delia (anak perempuan, digambar ulang); cx, cy = pusat badan; s = ukuran. opt.up = tangan kanan terangkat.
  function delia(ctx, cx, cy, s, opt = {}) {
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.translate(cx, cy);
    ctx.fillStyle = "rgba(0,0,0,0.10)"; ctx.beginPath(); ctx.ellipse(0, s * 0.95, s * 0.42, s * 0.07, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.skin; ctx.fillRect(-s * 0.16, s * 0.45, s * 0.1, s * 0.44); ctx.fillRect(s * 0.06, s * 0.45, s * 0.1, s * 0.44);
    ctx.fillStyle = "#3C4652"; ctx.beginPath(); ctx.ellipse(-s * 0.12, s * 0.91, s * 0.1, s * 0.05, 0, 0, Math.PI * 2); ctx.ellipse(s * 0.12, s * 0.91, s * 0.1, s * 0.05, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3F6FB5"; ctx.beginPath(); ctx.moveTo(-s * 0.25, s * 0.2); ctx.lineTo(s * 0.25, s * 0.2); ctx.lineTo(s * 0.36, s * 0.55); ctx.lineTo(-s * 0.36, s * 0.55); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.skin; ctx.lineCap = "round"; ctx.lineWidth = s * 0.1;
    ctx.beginPath(); ctx.moveTo(-s * 0.26, -s * 0.12); ctx.lineTo(-s * 0.36, s * 0.24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.26, -s * 0.12);
    if (opt.up) ctx.lineTo(s * 0.5, -s * 0.46); else ctx.lineTo(s * 0.36, s * 0.24);
    ctx.stroke();
    ctx.fillStyle = "#E8618C"; rr(ctx, -s * 0.28, -s * 0.24, s * 0.56, s * 0.5, s * 0.12); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.24); ctx.lineTo(0, -s * 0.12); ctx.lineTo(s * 0.1, -s * 0.24); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.hair;
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * s * 0.33, -s * 0.5, s * 0.11, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#E8618C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * s * 0.25, -s * 0.56, s * 0.04, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = C.skin; ctx.beginPath(); ctx.arc(0, -s * 0.52, s * 0.26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(0, -s * 0.57, s * 0.28, Math.PI * 1.02, -0.02); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-s * 0.08, -s * 0.7, s * 0.16, s * 0.07, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.pupil; ctx.beginPath(); ctx.arc(-s * 0.09, -s * 0.5, s * 0.03, 0, Math.PI * 2); ctx.arc(s * 0.09, -s * 0.5, s * 0.03, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(232,97,140,0.35)"; ctx.beginPath(); ctx.arc(-s * 0.16, -s * 0.42, s * 0.04, 0, Math.PI * 2); ctx.arc(s * 0.16, -s * 0.42, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.pupil; ctx.lineWidth = s * 0.022; ctx.beginPath(); ctx.arc(0, -s * 0.45, s * 0.07, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    ctx.restore();
    return { x: cx + s * 0.52, y: cy - s * 0.5 };
  }
  // sendal jepit tampak atas
  function sandal(ctx, cx, cy, s, col, flipX) {
    ctx.save(); ctx.translate(cx, cy); if (flipX) ctx.scale(-1, 1);
    ctx.fillStyle = col; ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, -s * 0.22, s * 0.36, s * 0.42, 0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-s * 0.02, s * 0.32, s * 0.3, s * 0.36, -0.05, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillRect(-s * 0.3, -s * 0.2, s * 0.6, s * 0.5);
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = s * 0.09; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-s * 0.3, s * 0.02); ctx.lineTo(-s * 0.05, -s * 0.42); ctx.lineTo(s * 0.32, s * 0.02); ctx.stroke();
    ctx.restore();
  }
  function flagID(ctx, x, y, w) {   // bendera Merah Putih
    const h = w * 0.66;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#E1251B"; ctx.fillRect(x, y, w, h / 2 + 0.5);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y + h / 2, w, h / 2);
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }
  function qbox(ctx, cx, top, w, h, lab, ls = 34) {   // kotak kosong dengan tanda tanya dan label "koin n"
    text(ctx, lab, cx, top - 14, ls, { align: "center", weight: 900, color: C.ink2 });
    ctx.save(); ctx.fillStyle = "#F7F9FA"; ctx.strokeStyle = "#8D99A3"; ctx.lineWidth = 4; rr(ctx, cx - w / 2, top, w, h, 18); ctx.fill(); ctx.stroke(); ctx.restore();
  }

  // ---------- adegan soal ----------
  function soal(ctx, b, l) {
    board(ctx);
    const first = b.id === "soal1";
    const dA = first ? P(l, at(b, "Ini adalah Delia"), 0.6) : 1;
    const hp = delia(ctx, 430, 500, 270, { up: true, alpha: dA });
    hand(ctx, "Delia", 430, 800, 46, { alpha: dA, color: BLUE });
    const cA = first ? P(l, at(b, "sebuah koin"), 0.5) : 1;
    coin(ctx, "G", hp.x + 10, hp.y - 40, 52, { flip: Math.cos(l * 3.2), label: false, alpha: cA });
    alpha(ctx, first ? P(l, at(b, "dua sisi"), 0.6) : 1, () => hand(ctx, "punya 2 sisi", 980, 300, 52, { color: ORANGE }));
    const a1 = first ? 0 : P(l, at(b, "lima ratus"), 0.6), a2 = first ? 0 : P(l, at(b, "bintang"), 0.6);
    coin(ctx, "A", 1010, 500, 150, { alpha: a1, ls: 54 });
    coin(ctx, "G", 1480, 500, 150, { alpha: a2, ls: 54 });
  }
  function lempar(ctx, b, l) {
    board(ctx);
    const hp = delia(ctx, 360, 520, 250, { up: true });
    const L1 = [1060, 520], L2 = [1500, 520], R = 120;
    const t1 = at(b, "dilempar"), d1 = 1.4;
    const t2 = at(b, "Hasilnya"), d2 = Math.max(0.9, at(b, "atau Gambar") + 0.6 - t2);
    function toss(t0, d, land, turns) {
      const u = clamp((l - t0) / d, 0, 1);
      if (l < t0) return -1;
      const x = lerp(hp.x, land[0], u), y = lerp(hp.y, land[1], u) - 230 * Math.sin(Math.PI * u), r = lerp(46, R, u);
      const f = Math.cos(u * Math.PI * turns);
      if (u < 1) coin(ctx, f >= 0 ? "A" : "G", x, y, r, { flip: f, label: false });
      return u;
    }
    if (l < t1) coin(ctx, "G", hp.x + 10, hp.y - 40, 46, { label: false });
    const u1 = toss(t1, d1, L1, 6);
    if (u1 >= 1) coin(ctx, "A", L1[0], L1[1], R, { ls: 48 });
    if (u1 >= 1 && l < t2) coin(ctx, "G", hp.x + 10, hp.y - 40, 46, { label: false, alpha: P(l, t1 + d1, 0.3) });
    const u2 = toss(t2, d2, L2, 7);
    if (u2 >= 1) coin(ctx, "G", L2[0], L2[1], R, { ls: 48 });
    alpha(ctx, P(l, at(b, "pasti"), 0.6), () => hand(ctx, "hasilnya pasti salah satu", 1280, 250, 46, { color: ORANGE }));
    alpha(ctx, P(l, at(b, "atau Gambar"), 0.6), () => hand(ctx, "atau", 1280, 540, 44, { color: C.ink2 }));
  }

  // ---------- tiga kotak + petunjuk (soal3, soal3b, j0–j4) ----------
  const BX = [620, 1010, 1400], BT = 215, BW = 280, BH = 260;
  const CLUE = [["Koin 1 hasilnya ", "Gambar", "."], ["Koin 2 ", "berbeda", " dengan koin 1."], ["Koin 3 ", "sama", " dengan koin 2."]];
  const CY = [660, 724, 788], CX = 540;
  function clueLine(ctx, i, a, opt = {}) {
    if (a <= 0) return;
    const [p, k, s] = CLUE[i], sz = 38, y = CY[i];
    ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1);
    ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(CX - 40, y - 13, 22, 0, Math.PI * 2); ctx.fill();
    text(ctx, String(i + 1), CX - 40, y - 1, 28, { align: "center", weight: 900, color: "#fff" });
    const w1 = tw(ctx, p, sz, 800), w2 = tw(ctx, k, sz, 900);
    text(ctx, p, CX, y, sz, { weight: 800, color: INK });
    text(ctx, k, CX + w1, y, sz, { weight: 900, color: i === 0 ? INK : ORANGE });
    text(ctx, s, CX + w1 + w2, y, sz, { weight: 800, color: INK });
    if (i > 0 && opt.under > 0) mline(ctx, [[CX + w1, y + 9], [CX + w1 + w2, y + 9]], opt.under, ORANGE, 5);
    if (opt.ring > 0) { const W = w1 + w2 + tw(ctx, s, sz, 800); ring(ctx, CX - 20 + W / 2, y - 13, W / 2 + 60, 34, opt.ring, BLUE, 5); }
    if (opt.red > 0) { const wk = tw(ctx, " dengan ", sz, 800), wc = tw(ctx, "koin 2", sz, 800); const x0 = CX + w1 + w2 + wk; mline(ctx, [[x0, y + 10], [x0 + wc, y + 10]], opt.red, RED, 6); }
    ctx.restore();
  }
  const ISI = ["soal3", "soal3b", "j0", "j1", "j2", "j3", "j4"];
  function curved(ctx, x0, x1, y, u, lab) {
    const pts = []; for (let k = 0; k <= 20; k++) { const s = k / 20; pts.push([lerp(x0, x1, s), y + Math.sin(Math.PI * s) * 48]); }
    mline(ctx, pts, u, ORANGE, 6, true);
    if (u > 0.6) hand(ctx, lab, (x0 + x1) / 2, y + 96, 34, { alpha: (u - 0.6) / 0.4 });
  }
  function isi(ctx, b, l) {
    board(ctx);
    const o = prog(ISI, b, l);
    if (b.id.startsWith("soal")) delia(ctx, 230, 470, 190, {}); else kiko(ctx, 230, 520, 170, 0, { mood: "happy" });
    const F = [
      o("j1", () => P(l, at(b, "Jadi, kita tulis"), 0.5)),
      o("j2", () => P(l, at(b, "Jadi, koin kedua"), 0.5)),
      o("j3", () => P(l, at(b, "jadi koin ketiga"), 0.5)),
    ];
    const SIDES = ["G", "A", "A"];
    BX.forEach((x, i) => {
      qbox(ctx, x, BT, BW, BH, "koin " + (i + 1));
      if (F[i] < 1) text(ctx, "?", x, BT + BH / 2 + 40, 120, { align: "center", weight: 900, color: "#C2CBD1", alpha: 1 - F[i] });
      if (F[i] > 0) coin(ctx, SIDES[i], x, BT + 100, 80, { alpha: F[i], ls: 34 });
    });
    curved(ctx, BX[0] + 40, BX[1] - 40, BT + BH + 14, o("j2", () => P(l, at(b, "berbeda dengan koin pertama"), 0.8)), "berbeda");
    curved(ctx, BX[1] + 40, BX[2] - 40, BT + BH + 14, o("j3", () => P(l, at(b, "sama dengan koin kedua"), 0.8)), "sama");
    const ap = b.id === "soal3" ? [0, 0, 0] : b.id === "soal3b" ? atSeq(b, ["Pertama", "Kedua", "Ketiga"]).map(t => P(l, t, 0.5)) : [1, 1, 1];
    const un = b.id === "soal3b" ? [0, P(l, at(b, "berbeda"), 0.5), P(l, at(b, "sama dengan"), 0.5)] : (b.id === "soal3" ? [0, 0, 0] : [1, 1, 1]);
    const cur = { j1: 0, j2: 1, j3: 2 }[b.id];
    for (let i = 0; i < 3; i++) clueLine(ctx, i, ap[i], {
      under: un[i], ring: cur === i ? P(l, at(b, "Petunjuk"), 0.6) : 0,
      red: i === 2 ? o("j3", () => P(l, at(b, "bukan dengan koin pertama"), 0.6)) : 0 });
    alpha(ctx, o("j3", () => P(l, at(b, "bukan dengan koin pertama"), 0.6)), () => hand(ctx, "bukan koin 1!", 1440, 788, 40, { color: RED }));
    if (b.id === "j0") thinkBadge(ctx, 640, 492, 740, 110, l, b.dur, "Isi kotak koin 1, 2, dan 3.");
    if (b.id === "j4") alpha(ctx, P(l, at(b, "Gambar, Angka"), 0.6), () => { ctx.save(); ctx.strokeStyle = GREEN; ctx.lineWidth = 7; rr(ctx, BX[0] - BW / 2 - 24, BT - 62, BX[2] - BX[0] + BW + 48, BH + 80, 26); ctx.stroke(); ctx.restore(); });
  }

  // ---------- pilihan jawaban ----------
  const OPTS = [["G", "G", "G"], ["A", "A", "A"], ["G", "A", "A"], ["G", "G", "A"]];
  const PIL = ["soal4", "p1", "p2", "p3", "p4"];
  const ROWY = i => 160 + i * 165, OCX = [400, 540, 680], OR = 46;
  function pilihan(ctx, b, l) {
    board(ctx);
    const o = prog(PIL, b, l);
    const show = b.id === "soal4" ? [0, 1, 2, 3].map(i => P(l, at(b, "empat pilihan") + i * 0.45, 0.5)) : [1, 1, 1, 1];
    const live = { p1: 0, p2: 1, p3: 3, p4: 2 }[b.id];
    // waktu silang/coret per baris
    const st = [
      { x: { 1: o("p1", () => P(l, at(b, "Padahal"), 0.5)) }, s: o("p1", () => P(l, at(b, "Jadi, pilihan A"), 0.5)) },
      { x: { 0: o("p2", () => P(l, at(b, "Padahal"), 0.5)) }, s: o("p2", () => P(l, at(b, "Jadi, pilihan B"), 0.5)) },
      { t: o("p4", () => P(l, at(b, "Semua koinnya"), 0.6)), r: o("p4", () => P(l, at(b, "adalah C"), 0.8)) },
      { x: { 1: o("p3", () => P(l, at(b, "koin kedua sama"), 0.5)), 2: o("p3", () => P(l, at(b, "koin ketiga berbeda"), 0.5)) }, s: o("p3", () => P(l, at(b, "Jadi, pilihan D"), 0.5)) },
    ];
    for (let i = 0; i < 4; i++) {
      if (show[i] <= 0) continue;
      const y0 = ROWY(i), cy = y0 + 58, S = st[i];
      ctx.save(); ctx.globalAlpha *= show[i];
      if (live === i) { ctx.fillStyle = "#FFF4D6"; rr(ctx, 160, y0 - 6, 600, 160, 18); ctx.fill(); }
      const dim = S.s ? 1 - 0.45 * S.s : 1;
      ctx.save(); ctx.globalAlpha *= dim;
      ctx.fillStyle = i === 2 && S.r > 0.5 ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(240, cy, 40, 0, Math.PI * 2); ctx.fill();
      text(ctx, "ABCD"[i], 240, cy + 17, 48, { align: "center", weight: 900, color: "#fff" });
      OPTS[i].forEach((sd, k) => coin(ctx, sd, OCX[k], cy, OR, { ls: 24 }));
      ctx.restore();
      if (S.x) Object.entries(S.x).forEach(([k, u]) => cross(ctx, OCX[k] + OR * 0.75, cy - OR * 0.7, 44, u, RED, 8));
      if (S.s > 0) mline(ctx, [[195, cy], [285, cy]], S.s, RED, 8);
      if (S.t > 0) OPTS[i].forEach((sd, k) => tick(ctx, OCX[k] + OR * 0.8, cy - OR * 0.7, 46, clamp(S.t * 3 - k, 0, 1)));
      if (S.r > 0) ring(ctx, 240, cy, 62, 62, S.r, GREEN, 7);
      ctx.restore();
    }
    if (b.id === "soal4") {
      alpha(ctx, P(l, 0.3, 0.6), () => {
        card(ctx, 900, 230, 880, 300, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
        text(ctx, "PERTANYAAN", 1340, 300, 32, { align: "center", weight: 900, color: C.accentDark });
        para(ctx, "Apa hasil koin 1, koin 2, dan koin 3, secara berurutan?", 1340, 380, 46, 800, { align: "center", weight: 900, color: INK });
      });
      return;
    }
    card(ctx, 900, 170, 880, 320, { fill: "#EFF8F2", stroke: GREEN, lw: 4, r: 20 });
    text(ctx, "Jawaban kita", 1340, 228, 34, { align: "center", weight: 900, color: GREEN });
    ["G", "A", "A"].forEach((sd, k) => coin(ctx, sd, 1120 + k * 220, 330, 62, { ls: 30 }));
    const R = {
      p1: [["koin 2 harus berbeda", "dengan koin 1"], "Padahal", RED],
      p2: [["koin 1 harus Gambar"], "Padahal", RED],
      p3: [["koin 2 harus berbeda dengan koin 1,", "koin 3 harus sama dengan koin 2"], "Di sini", RED],
      p4: [["semua cocok!"], "Semua koinnya", GREEN],
    }[b.id];
    if (R) alpha(ctx, P(l, at(b, R[1]), 0.6), () => R[0].forEach((s, k) => hand(ctx, s, 1340, 600 + k * 62, R[0].length > 1 ? 40 : 48, { color: R[2] })));
  }

  // ---------- pemanasan ----------
  function sendal(ctx, b, l) {
    board(ctx);
    const w1 = b.id === "w1";
    mline(ctx, [[960, 190], [960, 780]], 1, "#D5DCE1", 4);
    const aL = w1 ? P(l, at(b, "dua sendal"), 0.6) : 1;
    alpha(ctx, aL, () => { sandal(ctx, 420, 430, 300, "#D9443B", false); sandal(ctx, 640, 430, 300, "#D9443B", true); });
    alpha(ctx, w1 ? P(l, at(b, "ini sama"), 0.6) : 1, () => { hand(ctx, "sama", 500, 740, 64, { color: GREEN }); tick(ctx, 650, 718, 60, 1, GREEN); });
    if (w1) return;
    const aR = P(l, at(b, "dua sendal"), 0.6), blue = P(l, at(b, "satu biru"), 0.5);
    alpha(ctx, aR, () => { sandal(ctx, 1280, 430, 300, "#D9443B", false); });
    alpha(ctx, aR * (1 - blue), () => sandal(ctx, 1500, 430, 300, "#D9443B", true));
    alpha(ctx, blue, () => sandal(ctx, 1500, 430, 300, BLUE, true));
    alpha(ctx, P(l, at(b, "warnanya berbeda"), 0.6), () => hand(ctx, "berbeda", 1390, 740, 64, { color: ORANGE }));
  }
  function duasisi(ctx, b, l) {
    board(ctx);
    kiko(ctx, 250, 520, 170, 0, { mood: "happy" });
    alpha(ctx, P(l, at(b, "dua sisi"), 0.6), () => { hand(ctx, "koin hanya punya 2 sisi", 1060, 225, 50, { color: ORANGE }); });
    const rows = [["G", "A", "kalau sebuah koin", "pasti Angka", 365], ["A", "G", "Kalau berbeda", "pasti Gambar", 590]];
    rows.forEach(([s1, s2, p1, p2, cy]) => {
      const a = P(l, at(b, p1), 0.6), r = P(l, at(b, p2), 0.6);
      alpha(ctx, a, () => {
        coin(ctx, s1, 640, cy, 78, { ls: 32 });
        mline(ctx, [[760, cy], [1230, cy]], clamp(a * 1.4 - 0.4, 0, 1), ORANGE, 7, true);
        text(ctx, "berbeda", 995, cy - 22, 38, { align: "center", weight: 900, color: ORANGE });
      });
      alpha(ctx, r, () => { coin(ctx, s2, 1360, cy, 78, { ls: 32 }); hand(ctx, "pasti", 1540, cy + 14, 40, { color: GREEN }); });
    });
  }

  // ---------- penutup ----------
  function langkah(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Baca petunjuknya", "isi kotaknya", "perhatikan koin"]);
    const S = ["Baca petunjuknya satu per satu.", "Isi kotaknya satu per satu.", "Perhatikan koin mana yang dibandingkan."];
    S.forEach((s, i) => {
      const y = 170 + i * 185;
      alpha(ctx, P(l, T[i], 0.5), () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 50, { weight: 900, color: INK, fit: 1060 });
        const ix = 1560, iy = y + 80;
        if (i === 0) { ctx.save(); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#8D99A3"; ctx.lineWidth = 3; rr(ctx, ix - 55, iy - 60, 110, 120, 10); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = "#B8C3CA"; ctx.lineWidth = 6; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(ix - 35, iy - 28 + k * 28); ctx.lineTo(ix + 35, iy - 28 + k * 28); ctx.stroke(); } ctx.restore(); }
        if (i === 1) { ctx.save(); ctx.fillStyle = "#F7F9FA"; ctx.strokeStyle = "#8D99A3"; ctx.lineWidth = 3; rr(ctx, ix - 60, iy - 62, 120, 124, 12); ctx.fill(); ctx.stroke(); ctx.restore(); coin(ctx, "G", ix, iy, 46, { label: false }); }
        if (i === 2) { coin(ctx, "G", ix - 80, iy, 38, { label: false }); coin(ctx, "A", ix + 80, iy, 38, { label: false }); mline(ctx, [[ix - 36, iy], [ix + 36, iy]], 1, ORANGE, 6, true); hand(ctx, "?", ix, iy - 20, 36, { color: ORANGE }); }
      });
    });
  }

  // ---------- versi tegak untuk Short: Delia, dua sisi koin, tiga kotak (area x 460–1460) ----------
  function soal_v(ctx, b, l) {
    board(ctx);
    delia(ctx, 590, 300, 165, { up: true });
    hand(ctx, "Delia", 590, 500, 34, { color: BLUE });
    coin(ctx, "A", 960, 320, 95, { ls: 38 });
    coin(ctx, "G", 1270, 320, 95, { ls: 38 });
    const t = atSeq(b, ["Koin pertama", "Koin kedua", "Koin ketiga"]);
    [700, 960, 1220].forEach((x, i) => {
      qbox(ctx, x, 590, 210, 170, "koin " + (i + 1), 30);
      text(ctx, "?", x, 708, 84, { align: "center", weight: 900, color: "#C2CBD1" });
      const lab = ["Gambar", "berbeda", "sama"][i];
      alpha(ctx, P(l, t[i], 0.5), () => hand(ctx, lab, x, 806, 34, { color: i ? ORANGE : INK }));
    });
  }

  Object.assign(K.SCENES, {
    soal, lempar, isi, pilihan, sendal, duasisi, langkah, soal_v,
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
      const fu = P(l, at(b, "Indonesia"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagID(ctx, 470, 230, 170); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Indonesia"), 0.8);
      if (au > 0) ring(ctx, 1190, 300 + 2 * 92 - 14, 220, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
      const hp = delia(ctx, 720, 500, 230, { up: true });
      coin(ctx, "G", hp.x + 10, hp.y - 40 + Math.sin(l * 3) * 6, 46, { label: false, flip: Math.cos(l * 2.5) });
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Sampai jumpa!", 560, 800, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Petunjuk “sama” dan “berbeda”, langkah demi langkah", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
