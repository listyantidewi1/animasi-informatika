/* B06 Pembahasan Soal Bebras 2024-CH-03b "Kartu Ricca" (Swiss), kategori SiKecil.
   Gaya papan tulis (sama dengan B01–B04). Kartu monster Ricca punya tiga isian: nama (kata), tanduk (centang/silang), mata (angka).
   Empat kartu Lori A–D diperiksa satu per satu; jawaban B. Monster, Barbara, dan kartu digambar ulang dengan kode. */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F7FD1",
        GRAYT = "#8A96A0", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Kartu Ricca", asli: "", tahun: "2024", negara: "Swiss", kode: "2024-CH-03b" };

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

  // ---------- ikon isian (warna zaitun seperti soal asli) ----------
  const OLIVE = "#7C7A1C", HORN = "#E2CF8A", HORN2 = "#8C7A2E";
  function iconPerson(ctx, x, y, s) {
    const k = s / 40; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = OLIVE;
    ctx.beginPath(); ctx.arc(0, -8, 9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 16, 17, 12, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function hornShape(ctx, flip) {   // tanduk melengkung, pangkal (−12..12, 18), ujung (−10, −20)
    ctx.beginPath(); ctx.moveTo(-13, 18); ctx.quadraticCurveTo(-16, -4, -10 * flip - 0, -22); ctx.quadraticCurveTo(6, -2, 13, 18); ctx.closePath();
  }
  function hornDraw(ctx, x, y, s, flip = 1) {
    const k = s / 40; ctx.save(); ctx.translate(x, y); ctx.scale(k * flip, k);
    hornShape(ctx, 1); ctx.fillStyle = HORN; ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = HORN2; ctx.lineWidth = 5;
    for (const yy of [-8, 4, 15]) { ctx.beginPath(); ctx.moveTo(-20, yy + 4); ctx.lineTo(20, yy - 4); ctx.stroke(); }
    ctx.restore(); hornShape(ctx, 1); ctx.strokeStyle = HORN2; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  }
  function iconEye(ctx, x, y, s) {
    const k = s / 40; ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = "#fff"; ctx.strokeStyle = OLIVE; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#1E1E1E"; ctx.beginPath(); ctx.arc(-3, -2, 7, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  const ICON = { nama: iconPerson, tanduk: (ctx, x, y, s) => hornDraw(ctx, x, y, s), mata: iconEye };

  // nilai isian: "✓", "✗", atau teks/angka
  function val(ctx, v, x, y, s, color = INK) {
    if (v === "✓") tick(ctx, x + s * 0.05, y, s, 1, color, Math.max(4, s * 0.15));
    else if (v === "✗") cross(ctx, x, y, s * 0.9, 1, color, Math.max(4, s * 0.15));
    else text(ctx, v, x, y + s * 0.36, s, { align: "center", weight: 900, color });
  }

  // ---------- monster Ricca (digambar ulang, orisinal) ----------
  const MON = {
    JOSI: { col: "#5B8DEF", eyes: 3, horns: false },
    MONI: { col: "#6CC04A", eyes: 3, horns: false },
    BENI: { col: "#F2A33A", eyes: 2, horns: true },
    LORI: { col: "#B05BD6", eyes: 3, horns: true },
  };
  function monster(ctx, cx, cy, s, M, t = 0) {
    const k = s / 200; ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k);
    const dark = "rgba(0,0,0,0.35)";
    if (M.horns) { hornDraw(ctx, -42, -66, 70, 1); hornDraw(ctx, 42, -66, 70, -1); }
    ctx.fillStyle = M.col; ctx.strokeStyle = dark; ctx.lineWidth = 4;
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 30, 74, 18, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 76, 22 + Math.sin(t * 3 + sx) * 4, 13, 22, sx * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    ctx.beginPath(); ctx.ellipse(0, 10, 72, 64, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.beginPath(); ctx.ellipse(-26, -20, 24, 12, -0.5, 0, Math.PI * 2); ctx.fill();
    const ex = M.eyes === 2 ? [-24, 24] : M.eyes === 1 ? [0] : [-38, 0, 38];
    ex.forEach((x, i) => {
      const y = M.eyes === 3 && i === 1 ? -26 : -14;
      ctx.fillStyle = "#fff"; ctx.strokeStyle = "#222"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#1A1A1A"; ctx.beginPath(); ctx.arc(x + 2, y + 2, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x + 4, y - 1, 2.2, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = "#7A1F2B"; ctx.beginPath(); ctx.ellipse(0, 30, 36, 22, 0, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fff"; for (const x of [-20, 0, 20]) { ctx.beginPath(); ctx.moveTo(x - 7, 30); ctx.lineTo(x + 7, 30); ctx.lineTo(x, 40); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = "#F07A8A"; ctx.beginPath(); ctx.ellipse(6, 45, 13, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // ---------- kartu Ricca: ukuran dasar 300 × 430 ----------
  // D = { n, mon, name, horn, eye }; mengembalikan posisi isian di layar
  function rcard(ctx, x, y, w, D, opt = {}) {
    const k = w / 300;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = "rgba(0,0,0,0.10)"; rr(ctx, 6, 8, 300, 430, 18); ctx.fill();
    ctx.fillStyle = "#F8DC9A"; ctx.strokeStyle = "#C79A3E"; ctx.lineWidth = 4; rr(ctx, 0, 0, 300, 430, 18); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#FFFDF5"; ctx.strokeStyle = "#E0C27A"; ctx.lineWidth = 2; rr(ctx, 16, 16, 268, 250, 12); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#222"; rr(ctx, 238, 24, 38, 38, 6); ctx.fill();
    text(ctx, String(D.n), 257, 53, 28, { align: "center", weight: 900, color: "#fff" });
    monster(ctx, 150, 152, 165, MON[D.mon], opt.t || 0);
    ctx.strokeStyle = "#E3BF6E"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 352); ctx.lineTo(280, 352); ctx.stroke();
    iconPerson(ctx, 44, 308, 44);
    hornDraw(ctx, 42, 392, 40); iconEye(ctx, 180, 392, 40);
    ctx.restore();
    const S = { name: [x + 170 * k, y + 308 * k], horn: [x + 104 * k, y + 392 * k], eye: [x + 242 * k, y + 392 * k],
      horns: [x + 150 * k, y + 88 * k], eyes: [x + 150 * k, y + 132 * k], k };
    val(ctx, D.name, S.name[0], S.name[1], 46 * k);
    val(ctx, D.horn, S.horn[0], S.horn[1], 46 * k);
    val(ctx, D.eye, S.eye[0], S.eye[1], 46 * k);
    ctx.restore();
    return S;
  }
  const SLOT_W = { name: 110, horn: 42, eye: 42 };   // setengah lebar lingkaran penanda (satuan kartu)
  function mark(ctx, S, slot, u, color) { if (u > 0) ring(ctx, S[slot][0], S[slot][1], SLOT_W[slot] * S.k + 10, 36 * S.k + 8, u, color, 6); }
  function okTick(ctx, S, slot, u) { if (u > 0) tick(ctx, S[slot][0] + (SLOT_W[slot] + 34) * S.k, S[slot][1] - 30 * S.k, 40 * S.k + 8, u, GREEN, 6); }

  // Barbara (anak perempuan, digambar ulang); opt.up = tangan kanan terangkat
  function barbara(ctx, cx, cy, s, opt = {}) {
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.translate(cx, cy);
    ctx.fillStyle = "rgba(0,0,0,0.10)"; ctx.beginPath(); ctx.ellipse(0, s * 0.95, s * 0.42, s * 0.07, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.skin; ctx.fillRect(-s * 0.16, s * 0.45, s * 0.1, s * 0.44); ctx.fillRect(s * 0.06, s * 0.45, s * 0.1, s * 0.44);
    ctx.fillStyle = "#3C4652"; ctx.beginPath(); ctx.ellipse(-s * 0.12, s * 0.91, s * 0.1, s * 0.05, 0, 0, Math.PI * 2); ctx.ellipse(s * 0.12, s * 0.91, s * 0.1, s * 0.05, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#E5A11C"; ctx.beginPath(); ctx.moveTo(-s * 0.25, s * 0.2); ctx.lineTo(s * 0.25, s * 0.2); ctx.lineTo(s * 0.36, s * 0.55); ctx.lineTo(-s * 0.36, s * 0.55); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.skin; ctx.lineCap = "round"; ctx.lineWidth = s * 0.1;
    ctx.beginPath(); ctx.moveTo(-s * 0.26, -s * 0.12); ctx.lineTo(-s * 0.36, s * 0.24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.26, -s * 0.12); if (opt.up) ctx.lineTo(s * 0.5, -s * 0.46); else ctx.lineTo(s * 0.36, s * 0.24); ctx.stroke();
    ctx.fillStyle = "#2E9E6A"; rr(ctx, -s * 0.28, -s * 0.24, s * 0.56, s * 0.5, s * 0.12); ctx.fill();
    ctx.fillStyle = "#6B3E1F"; ctx.beginPath(); ctx.ellipse(-s * 0.3, -s * 0.36, s * 0.08, s * 0.2, 0.3, 0, Math.PI * 2); ctx.fill();   // kuncir
    ctx.fillStyle = C.skin; ctx.beginPath(); ctx.arc(0, -s * 0.52, s * 0.26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#6B3E1F"; ctx.beginPath(); ctx.arc(0, -s * 0.57, s * 0.28, Math.PI * 1.02, -0.02); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.06, -s * 0.71, s * 0.18, s * 0.07, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#E8618C"; ctx.beginPath(); ctx.arc(-s * 0.22, -s * 0.72, s * 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.pupil; ctx.beginPath(); ctx.arc(-s * 0.09, -s * 0.5, s * 0.03, 0, Math.PI * 2); ctx.arc(s * 0.09, -s * 0.5, s * 0.03, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(232,97,140,0.35)"; ctx.beginPath(); ctx.arc(-s * 0.16, -s * 0.42, s * 0.04, 0, Math.PI * 2); ctx.arc(s * 0.16, -s * 0.42, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.pupil; ctx.lineWidth = s * 0.022; ctx.beginPath(); ctx.arc(0, -s * 0.45, s * 0.07, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    ctx.restore();
    return { x: cx + s * 0.52, y: cy - s * 0.5 };
  }
  function flagCH(ctx, x, y, w) {   // bendera Swiss
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, w + 140);
    ctx.fillStyle = "#DA291C"; ctx.fillRect(x, y, w, w);
    ctx.fillStyle = "#FFFFFF"; const a = w * 0.2, b = w * 0.6; ctx.fillRect(x + (w - a) / 2, y + (w - b) / 2, a, b); ctx.fillRect(x + (w - b) / 2, y + (w - a) / 2, b, a);
  }

  const EX = [{ n: 1, mon: "JOSI", name: "JOSI", horn: "✗", eye: "3" }, { n: 2, mon: "MONI", name: "MONI", horn: "✗", eye: "3" }, { n: 3, mon: "BENI", name: "BENI", horn: "✓", eye: "2" }];
  const OPT = [{ n: 4, mon: "LORI", name: "LORI", horn: "2", eye: "✓" }, { n: 4, mon: "LORI", name: "LORI", horn: "✓", eye: "3" },
               { n: 4, mon: "LORI", name: "LORI", horn: "2", eye: "3" }, { n: 4, mon: "LORI", name: "✓", horn: "2", eye: "3" }];

  // ---------- adegan soal ----------
  function kartu(ctx, b, l) {
    board(ctx);
    if (b.id === "soal1") {
      const dA = P(l, at(b, "Ini adalah Barbara"), 0.6);
      const hp = barbara(ctx, 400, 500, 270, { up: true, alpha: dA });
      hand(ctx, "Barbara", 400, 800, 46, { alpha: dA, color: BLUE });
      const cA = P(l, at(b, "mengumpulkan kartu"), 0.8);
      EX.forEach((D, i) => rcard(ctx, 760 + i * 330, 210 + (i === 1 ? -20 : 10), 290, D, { alpha: clamp(cA * 3 - i, 0, 1), t: l }));
      alpha(ctx, P(l, at(b, "disebut Ricca"), 0.6), () => { hand(ctx, "monster Ricca", 1240, 760, 56, { color: ORANGE }); mline(ctx, [[1080, 720], [945, 560]], 1, ORANGE, 6, true); });
      return;
    }
    barbara(ctx, 250, 520, 200, {});
    const S = rcard(ctx, 560, 160, 460, EX[2], { t: l });   // 460 × 659: sampai y 819
    const k = S.k, IC = [[44, 308], [42, 392], [180, 392]].map(([a, c]) => [560 + a * k, 160 + c * k]);
    if (b.id === "soal2") { const u = P(l, at(b, "gambar kecil"), 0.8); IC.forEach(([x, y], i) => ring(ctx, x, y, 34, 34, clamp(u * 3 - i, 0, 1), ORANGE, 5));
      alpha(ctx, P(l, at(b, "tiga isian"), 0.6), () => hand(ctx, "3 isian", 1400, 300, 60, { color: ORANGE })); return; }
    const T = atSeq(b, ["Gambar orang", "Gambar tanduk", "Gambar mata"]);
    const L = [["nama monster", 0, 400, BLUE], ["punya tanduk?", 1, 560, ORANGE], ["berapa mata?", 2, 720, GREEN]];
    L.forEach(([s, i, ty, col]) => {
      const u = P(l, T[i], 0.7); if (u <= 0) return;
      ring(ctx, IC[i][0], IC[i][1], 34, 34, u, col, 5);
      alpha(ctx, u, () => hand(ctx, s, 1290, ty, 54, { color: col, align: "left" }));
      mline(ctx, [[1275, ty - 16], [IC[i][0] + (i === 0 ? 320 : i === 1 ? 110 : 120), IC[i][1] - 10]], u, col, 5, true);
    });
  }
  function contoh(ctx, b, l) {
    board(ctx);
    const xs = [230, 795, 1360], S = EX.map((D, i) => rcard(ctx, xs[i], 160, 330, D, { t: l }));
    const second = b.id === "soal3b";
    if (!second) {
      const t1 = at(b, "Josi dan Moni"), t2 = at(b, "Beni punya");
      [0, 1].forEach(i => { mark(ctx, S[i], "horn", P(l, t1 + 0.8, 0.7), ORANGE); alpha(ctx, P(l, t1 + 0.8, 0.6), () => hand(ctx, "tidak bertanduk", xs[i] + 165, 790, 44, { color: ORANGE })); });
      mark(ctx, S[2], "horn", P(l, t2 + 0.5, 0.7), BLUE);
      ring(ctx, S[2].horns[0], S[2].horns[1], 110, 50, P(l, t2, 0.7), BLUE, 5);
      alpha(ctx, P(l, t2 + 0.5, 0.6), () => hand(ctx, "bertanduk", xs[2] + 165, 790, 44, { color: BLUE }));
    } else {
      const t1 = at(b, "Josi dan Moni"), t2 = at(b, "Beni punya");
      [0, 1].forEach(i => { ring(ctx, S[i].eyes[0], S[i].eyes[1], 80, 34, P(l, t1, 0.7), GREEN, 5); mark(ctx, S[i], "eye", P(l, at(b, "angka tiga"), 0.7), GREEN);
        alpha(ctx, P(l, t1 + 0.5, 0.6), () => hand(ctx, "3 mata", xs[i] + 165, 790, 46, { color: GREEN })); });
      ring(ctx, S[2].eyes[0], S[2].eyes[1], 80, 34, P(l, t2, 0.7), GREEN, 5); mark(ctx, S[2], "eye", P(l, at(b, "angka dua"), 0.7), GREEN);
      alpha(ctx, P(l, t2 + 0.5, 0.6), () => hand(ctx, "2 mata", xs[2] + 165, 790, 46, { color: GREEN }));
    }
  }
  // tabel aturan: ikon → jenis isian
  const RULE = [["nama", "nama", "kata", "JOSI", "Isian nama"], ["tanduk", "tanduk", "tanda", null, "Isian tanduk"], ["mata", "mata", "angka", "1  2  3", "Isian mata"]];
  function ruleRow(ctx, i, x, y, s, a = 1) {   // s = skala (1 = besar)
    alpha(ctx, a, () => {
      const [ic, lab, jenis, ex] = RULE[i];
      card(ctx, x, y, 1100 * s, 130 * s, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 20 * s });
      ICON[ic](ctx, x + 75 * s, y + 65 * s, 70 * s);
      text(ctx, lab, x + 140 * s, y + 82 * s, 48 * s, { weight: 900, color: INK });
      mline(ctx, [[x + 330 * s, y + 65 * s], [x + 430 * s, y + 65 * s]], 1, C.ink2, 5 * s, true);
      text(ctx, jenis, x + 460 * s, y + 82 * s, 52 * s, { weight: 900, color: ORANGE });
      if (ex) text(ctx, "contoh: " + ex, x + 700 * s, y + 80 * s, 38 * s, { weight: 800, color: C.ink2 });
      else { text(ctx, "contoh:", x + 700 * s, y + 80 * s, 38 * s, { weight: 800, color: C.ink2 }); val(ctx, "✓", x + 900 * s, y + 66 * s, 50 * s); text(ctx, "atau", x + 985 * s, y + 80 * s, 32 * s, { weight: 700, color: C.ink2, align: "center" }); val(ctx, "✗", x + 1060 * s, y + 66 * s, 46 * s); }
    });
  }
  function aturan(ctx, b, l) {
    board(ctx);
    kiko(ctx, 250, 520, 170, 0, { mood: "happy" });
    alpha(ctx, P(l, 0.3, 0.6), () => hand(ctx, "setiap isian punya jenisnya sendiri", 1020, 225, 50, { color: ORANGE }));
    const T = atSeq(b, ["Isian nama", "Isian tanduk", "Isian mata"]);
    [0, 1, 2].forEach(i => ruleRow(ctx, i, 470, 290 + i * 170, 1, P(l, T[i], 0.6)));
  }

  // ---------- empat kartu Lori ----------
  const PIL = ["soal5", "j0", "j1", "j1b", "j2", "j3", "j4", "j4b"];
  function pilihanDraw(ctx, b, l, wide) {
    board(ctx);
    const o = prog(PIL, b, l);
    const POS = wide ? [[240, 212], [620, 212], [1000, 212], [1380, 212]].map(p => [p[0], p[1], 270])
                     : [[620, 175], [1100, 175], [620, 505], [1100, 505]].map(p => [p[0], p[1], 220]);
    const show = b.id === "soal5" ? [0, 1, 2, 3].map(i => P(l, at(b, "empat kartu") + i * 0.45, 0.5)) : [1, 1, 1, 1];
    const live = { j1: 0, j1b: 0, j2: 2, j3: 3, j4: 1, j4b: 1 }[b.id];
    const V = (id, ph) => o(id, () => P(l, at(b, ph), 0.6));
    // penanda tiap kartu: m = isian salah (merah), k = isian benar (centang hijau), s = huruf dicoret, r = huruf dilingkari hijau
    const st = [
      { k: { name: V("j1", "jadi benar") }, m: { horn: V("j1", "isian tanduknya"), eye: V("j1b", "Isian matanya") }, s: V("j1b", "Jadi, kartu A") },
      { k: { name: V("j4", "Namanya Lori"), horn: V("j4", "Isian tanduknya"), eye: V("j4", "isian matanya") }, r: V("j4b", "jawabannya adalah B"),
        h: V("j4b", "Lori memang punya tanduk"), e: V("j4b", "matanya ada tiga") },
      { k: { name: V("j2", "Namanya Lori"), eye: V("j2", "isian matanya") }, m: { horn: V("j2", "Tetapi") }, s: V("j2", "Jadi, kartu C") },
      { m: { name: V("j3", "Kartu D berisi"), horn: V("j3", "Isian tanduknya") }, s: V("j3", "Jadi, kartu D") },
    ];
    for (let i = 0; i < 4; i++) {
      if (show[i] <= 0) continue;
      const [x, y, w] = POS[i], S0 = st[i], h = w * 430 / 300;
      ctx.save(); ctx.globalAlpha *= show[i];
      if (live === i) { ctx.fillStyle = "#FFF1C9"; rr(ctx, x - 18, y - 18, w + 36, h + 36, 22); ctx.fill(); }
      const dim = S0.s ? 1 - 0.45 * S0.s : 1;
      ctx.save(); ctx.globalAlpha *= dim;
      const S = rcard(ctx, x, y, w, OPT[i], { t: l });
      if (S0.m) Object.entries(S0.m).forEach(([k, u]) => mark(ctx, S, k, u, RED));
      if (S0.k) Object.entries(S0.k).forEach(([k, u]) => mark(ctx, S, k, u, GREEN));
      ctx.restore();
      const lx = wide ? x + w / 2 : x - 42, ly = wide ? y - 44 : y + 34, lr = wide ? 34 : 30;
      ctx.fillStyle = S0.r > 0.5 ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(lx, ly, lr, 0, Math.PI * 2); ctx.fill();
      text(ctx, "ABCD"[i], lx, ly + lr * 0.42, lr * 1.2, { align: "center", weight: 900, color: "#fff" });
      if (S0.s > 0) cross(ctx, lx, ly, lr * 2.2, S0.s, RED, 7);
      if (S0.r > 0) ring(ctx, lx, ly, lr + 14, lr + 14, S0.r, GREEN, 7);
      if (S0.h > 0) ring(ctx, S.horns[0], S.horns[1], 92 * S.k, 46 * S.k, S0.h, GREEN, 5);
      if (S0.e > 0) ring(ctx, S.eyes[0], S.eyes[1], 72 * S.k, 30 * S.k, S0.e, GREEN, 5);
      ctx.restore();
    }
    if (!wide) return;
    if (b.id === "soal5") {
      alpha(ctx, P(l, 0.3, 0.6), () => { card(ctx, 260, 660, 1400, 110, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
        text(ctx, "Pada kartu manakah semua isian ditulis dengan benar?", 960, 732, 44, { align: "center", weight: 900, color: INK, fit: 1340 }); });
      return;
    }
    if (b.id === "j0") { thinkBadge(ctx, 520, 656, 880, 112, l, b.dur, "Periksa setiap isian pada kartu A, B, C, dan D."); return; }
    // pengingat aturan di bawah
    ctx.save(); card(ctx, 200, 664, 1520, 86, { fill: "#F3F6F8", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    const R = [["nama", "kata"], ["tanduk", "✓ atau ✗"], ["mata", "angka"]];
    R.forEach(([ic, s], k) => { const x0 = 260 + k * 500; ICON[ic](ctx, x0, 707, 50); text(ctx, "=", x0 + 50, 723, 40, { weight: 900, color: C.ink2 });
      if (ic === "tanduk") { val(ctx, "✓", x0 + 120, 707, 40); text(ctx, "atau", x0 + 200, 721, 32, { align: "center", weight: 800, color: C.ink2 }); val(ctx, "✗", x0 + 275, 707, 38); }
      else text(ctx, s, x0 + 90, 723, 42, { weight: 900, color: ORANGE }); });
    ctx.restore();
  }
  const pilihan = (ctx, b, l) => pilihanDraw(ctx, b, l, true);
  const pilihan_v = (ctx, b, l) => pilihanDraw(ctx, b, l, false);

  // ---------- pemanasan: tiga kotak ----------
  const BOX = [[560, "kata"], [960, "tanda"], [1360, "angka"]], BT = 450, BW = 330, BH = 300;
  function token(ctx, v, x, y, a = 1) {
    alpha(ctx, a, () => { ctx.save(); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#8D99A3"; ctx.lineWidth = 4; rr(ctx, x - 75, y - 50, 150, 100, 16); ctx.fill(); ctx.stroke(); ctx.restore();
      val(ctx, v, x, y, v.length > 1 ? 46 : 56); });
  }
  function fly(ctx, v, from, to, t0, t1, l) {
    if (l < t0) return; const u = ease(clamp((l - t1) / 0.8, 0, 1));
    token(ctx, v, lerp(from[0], to[0], u), lerp(from[1], to[1], u) - Math.sin(Math.PI * u) * 80, P(l, t0, 0.4));
  }
  function pilah(ctx, b, l) {
    board(ctx);
    kiko(ctx, 210, 560, 160, 0, { mood: "happy" });
    const w1 = b.id === "w1", T = w1 ? atSeq(b, ["Kotak pertama", "kotak kedua", "kotak ketiga"]) : [0, 0, 0];
    BOX.forEach(([x, lab], i) => alpha(ctx, w1 ? P(l, T[i], 0.6) : 1, () => {
      ctx.save(); ctx.fillStyle = "#F7F9FA"; ctx.strokeStyle = "#8D99A3"; ctx.lineWidth = 5; rr(ctx, x - BW / 2, BT, BW, BH, 22); ctx.fill(); ctx.stroke(); ctx.restore();
      text(ctx, "kotak " + lab, x, BT + BH + 56, 46, { align: "center", weight: 900, color: ORANGE });
      if (lab === "tanda") { val(ctx, "✓", x - 120, BT + BH - 30, 28, "#C2CBD1"); val(ctx, "✗", x + 120, BT + BH - 30, 26, "#C2CBD1"); }
      if (lab === "kata") text(ctx, "Aa", x + 120, BT + BH - 18, 30, { align: "center", weight: 900, color: "#C2CBD1" });
      if (lab === "angka") text(ctx, "123", x + 110, BT + BH - 18, 30, { align: "center", weight: 900, color: "#C2CBD1" });
    }));
    if (w1) return;
    const IN = [[560, BT + 80], [960, BT + 80], [1360, BT + 80]];
    if (b.id === "w2") {
      const t = atSeq(b, ["Kata Budi", "masuk ke kotak kata", "Tanda centang", "masuk ke kotak tanda", "Angka lima", "masuk ke kotak angka"]);
      fly(ctx, "Budi", [760, 250], IN[0], t[0], t[1], l);
      fly(ctx, "✓", [960, 250], IN[1], t[2], t[3], l);
      fly(ctx, "5", [1160, 250], IN[2], t[4], t[5], l);
      return;
    }
    token(ctx, "Budi", IN[0][0], IN[0][1]); token(ctx, "✓", IN[1][0], IN[1][1]); token(ctx, "5", IN[2][0], IN[2][1]);
    const t = atSeq(b, ["angka dua?", "dimasukkan ke kotak tanda", "salah tempat", "harus masuk"]);
    const toTanda = ease(clamp((l - t[1]) / 0.8, 0, 1)), toAngka = ease(clamp((l - t[3]) / 0.8, 0, 1));
    if (l >= t[0]) {
      let x = lerp(960, 960, toTanda), y = lerp(250, IN[1][1] + 115, toTanda) - Math.sin(Math.PI * toTanda) * 40;
      if (toAngka > 0) { x = lerp(960, IN[2][0], toAngka); y = lerp(IN[1][1] + 115, IN[2][1] + 115, toAngka) - Math.sin(Math.PI * toAngka) * 160; }
      token(ctx, "2", x, y, P(l, t[0], 0.4));
      if (toAngka <= 0) cross(ctx, 960, IN[1][1] + 115, 120, P(l, t[2], 0.6), RED, 10);
      if (toAngka >= 1) tick(ctx, IN[2][0] + 125, IN[2][1] + 115, 60, P(l, t[3] + 0.9, 0.5), GREEN, 8);
    }
    alpha(ctx, P(l, t[2], 0.6) * (1 - toAngka), () => hand(ctx, "salah tempat!", 960, 380, 48, { color: RED }));
  }

  // ---------- penutup ----------
  function komputer(ctx, b, l) {
    board(ctx);
    kiko(ctx, 230, 540, 160, 0, { mood: "happy" });
    const x0 = 470, y0 = 160, W = 1000, H = 520;
    ctx.save(); ctx.fillStyle = "#2B3440"; rr(ctx, x0, y0, W, H, 22); ctx.fill();
    ctx.fillStyle = "#F7FAFC"; rr(ctx, x0 + 24, y0 + 24, W - 48, H - 60, 10); ctx.fill();
    ctx.fillStyle = "#2B3440"; ctx.fillRect(x0 + W / 2 - 40, y0 + H, 80, 50); rr(ctx, x0 + W / 2 - 160, y0 + H + 46, 320, 20, 8); ctx.fill(); ctx.restore();
    const cols = [x0 + 200, x0 + 500, x0 + 790], hy = y0 + 90;
    ctx.fillStyle = "#DDE7EE"; ctx.fillRect(x0 + 24, y0 + 24, W - 48, 100);
    [["nama", "Nama"], ["tanduk", "Tanduk"], ["mata", "Mata"]].forEach(([ic, s], i) => { ICON[ic](ctx, cols[i] - 80, hy - 14, 44); text(ctx, s, cols[i] - 40, hy, 40, { weight: 900, color: INK }); });
    const rows = [["JOSI", "✗", "3"], ["MONI", "✗", "3"], ["BENI", "✓", "2"], ["LORI", "✓", "3"]];
    rows.forEach((r, j) => { const y = y0 + 170 + j * 78; ctx.strokeStyle = "#D5DCE1"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 40, y + 38); ctx.lineTo(x0 + W - 40, y + 38); ctx.stroke();
      r.forEach((v, i) => val(ctx, v, cols[i], y, 40)); });
    const T = atSeq(b, ["berupa kata", "ya atau tidak", "berupa angka"]);
    [["kata", BLUE], ["ya atau tidak", ORANGE], ["angka", GREEN]].forEach(([s, col], i) => alpha(ctx, P(l, T[i], 0.6), () => {
      const w = tw(ctx, s, 38, 900) + 50; ctx.save(); ctx.fillStyle = col; rr(ctx, cols[i] - w / 2, 770, w, 60, 30); ctx.fill(); ctx.restore();
      text(ctx, s, cols[i], 813, 38, { align: "center", weight: 900, color: "#fff" });
      mline(ctx, [[cols[i], 768], [cols[i], 740]], 1, col, 5, false);
    }));
    alpha(ctx, P(l, at(b, "jenis setiap isian"), 0.6), () => hand(ctx, "jenis isian", 1690, 300, 50, { color: ORANGE }));
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Lihat jenis", "periksa isiannya", "pilih kartu"]);
    const S = ["Lihat jenis setiap isian.", "Periksa isiannya satu per satu.", "Pilih kartu yang semua isiannya cocok."];
    S.forEach((s, i) => {
      const y = 170 + i * 185;
      alpha(ctx, P(l, T[i], 0.5), () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 50, { weight: 900, color: INK, fit: 1060 });
        const ix = 1560, iy = y + 80;
        if (i === 0) { iconPerson(ctx, ix - 90, iy, 54); hornDraw(ctx, ix, iy, 54); iconEye(ctx, ix + 90, iy, 54); }
        if (i === 1) { const S2 = rcard(ctx, ix - 50, iy - 72, 100, OPT[2]); mark(ctx, S2, "horn", 1, RED); }
        if (i === 2) { rcard(ctx, ix - 50, iy - 72, 100, OPT[1]); tick(ctx, ix + 90, iy, 60, 1, GREEN, 8); }
      });
    });
  }

  // ---------- versi tegak untuk Short (area x 460–1460) ----------
  function soal_v(ctx, b, l) {
    board(ctx);
    rcard(ctx, 500, 170, 300, EX[2], { t: l });
    hand(ctx, "contoh kartu", 650, 820, 38, { color: BLUE });
    const T = atSeq(b, ["Isian nama", "Isian tanduk", "Isian mata"]);
    const R = [["nama", "kata"], ["tanduk", null], ["mata", "angka"]];
    R.forEach(([ic, s], i) => alpha(ctx, P(l, T[i], 0.5), () => {
      const y = 230 + i * 180;
      card(ctx, 850, y, 590, 140, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 20 });
      ICON[ic](ctx, 920, y + 70, 76);
      mline(ctx, [[985, y + 70], [1060, y + 70]], 1, C.ink2, 5, true);
      if (s) text(ctx, s, 1090, y + 90, 60, { weight: 900, color: ORANGE });
      else { val(ctx, "✓", 1120, y + 70, 60); text(ctx, "atau", 1240, y + 86, 38, { align: "center", weight: 800, color: C.ink2 }); val(ctx, "✗", 1350, y + 70, 54); }
    }));
  }

  Object.assign(K.SCENES, {
    kartu, contoh, aturan, pilihan, pilihan_v, pilah, komputer, langkah, soal_v,
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
      const fu = P(l, at(b, "negara Swiss"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagCH(ctx, 470, 230, 130); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "negara Swiss"), 0.8);
      if (au > 0) ring(ctx, 1190, 300 + 2 * 92 - 14, 220, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 300, 520, 200, 0, { wave: l, mood: "happy" });
      const hp = barbara(ctx, 640, 500, 230, { up: true });
      rcard(ctx, hp.x - 20, hp.y - 120 + Math.sin(l * 3) * 6, 110, OPT[1], { t: l });
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Sampai jumpa!", 500, 800, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Memeriksa jenis isian, langkah demi langkah", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
