/* Pembantu bersama seri "Pembahasan Soal Bebras" (dipakai mulai SG08, SG09, PNG09, PNG10, PG09, PG10).
   Isinya sama dengan pembantu yang dulu disalin di setiap scenes.js Bebras: papan tulis putih, coretan spidol
   (garis, centang, silang, lingkaran), tulisan tangan, jam pasir "PIKIRKAN DULU", berang-berang maskot, kartu catatan,
   bendera negara kontributor, dan adegan umum (buka, kredit, akhir, langkah, cta_bebras) yang dibuat dari META soal.
   Pemakaian di scenes.js:  const B = K.BEBRAS; const { at, P, board, ... } = B;  Object.assign(K.SCENES, B.umum(META), {...}). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F6FD0", FUR = "#8E5B3A", FUR2 = "#B98458", GREY = "#9AA4AC";

  // ---------- waktu: kejadian diambil dari posisi frasa di narasi ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const atI = (b, i) => lead(b) + Math.max(0, i) / TXT(b).length * (b.audio || b.dur);
  const at = (b, s, from = 0) => {
    const T = TXT(b); let i = typeof from === "string" ? T.indexOf(s, Math.max(0, T.indexOf(from))) : T.indexOf(s, from);
    if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); i = 0; }
    return atI(b, i);
  };
  const P = (l, t0, d) => ease((l - t0) / (d || 0.6));

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
    ctx.save(); let sz = size; ctx.font = `italic 800 ${sz}px ${K.FONT}`;
    while (opt.fit && sz > 20 && ctx.measureText(s).width > opt.fit) { sz -= 2; ctx.font = `italic 800 ${sz}px ${K.FONT}`; }
    ctx.fillStyle = opt.color || ORANGE; ctx.textAlign = opt.align || "center";
    ctx.textBaseline = "alphabetic"; if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1); ctx.fillText(s, x, y); ctx.restore();
  }
  function tw(ctx, s, size, weight = 800) { ctx.font = `${weight} ${size}px ${K.FONT}`; return ctx.measureText(s).width; }
  function alpha(ctx, a, fn) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1); fn(); ctx.restore(); }
  function arrow(ctx, x1, y1, x2, y2, u, color = INK, w = 6) { mline(ctx, [[x1, y1], [x2, y2]], u, color, w, true); }
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
  // jam pasir dengan durasi beat (b.hold + sedikit), pertanyaan pendek di bawah judul
  function thinkBadge(ctx, x, y, w, h, l, d, q) {
    card(ctx, x, y, w, h, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
    hourglass(ctx, x + h / 2 + 6, y + h / 2, l, d, h * 0.34);
    text(ctx, "PIKIRKAN DULU", x + h + 20, y + h * 0.42, 36, { weight: 900, color: C.accentDark, fit: w - h - 36 });
    if (q) text(ctx, q, x + h + 20, y + h * 0.8, 28, { weight: 800, color: INK, fit: w - h - 40 });
  }
  function noteCard(ctx, x, y, w, lines, a = 1, opt = {}) {
    if (a <= 0) return 0;
    const lh = opt.size ? opt.size * 1.3 : 48, h = lines.length * lh + 44;
    alpha(ctx, a, () => {
      card(ctx, x, y, w, h, { fill: opt.fill || "#FFFDF7", stroke: opt.stroke || ORANGE, lw: 3, r: 18 });
      lines.forEach((s, i) => text(ctx, s, opt.center ? x + w / 2 : x + 30, y + 22 + lh * (i + 0.78), opt.size || 36, { align: opt.center ? "center" : "left", weight: i === 0 ? 900 : 700, color: i === 0 ? (opt.head || INK) : C.ink2, fit: w - 60 }));
    });
    return h;
  }
  function beaver(ctx, x, y, s, o = {}) {   // berang-berang maskot Bebras (sama dengan seri Bebras sebelumnya)
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    if (o.flip) ctx.scale(-1, 1);
    ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2.5;
    ctx.fillStyle = o.fur || FUR; ctx.beginPath(); ctx.ellipse(0, 24, 32, 27, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = FUR2; ctx.beginPath(); ctx.ellipse(0, 30, 19, 17, 0, 0, Math.PI * 2); ctx.fill();
    if (o.shirt) { ctx.fillStyle = o.shirt; ctx.beginPath(); ctx.ellipse(0, 26, 30, 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    ctx.fillStyle = o.fur || FUR; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * 15, 49, 9, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 23, -37, 7.5, 0, Math.PI * 2); ctx.fillStyle = o.fur || FUR; ctx.fill(); ctx.stroke(); ctx.fillStyle = "#5E3B24"; ctx.beginPath(); ctx.arc(k * 23, -37, 3.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = o.fur || FUR; ctx.beginPath(); ctx.arc(0, -14, 29, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#D7AE84"; ctx.beginPath(); ctx.ellipse(0, -3, 15, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2A1B12"; ctx.beginPath(); ctx.ellipse(0, -10, 6.5, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 1.5; rr(ctx, -5, -1, 10, 9, 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 8); ctx.stroke();
    ctx.fillStyle = "#1B120C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12, -23, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#fff"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 12 + 1.3, -24.4, 1.4, 0, Math.PI * 2); ctx.fill(); }
    if (o.hat) { ctx.fillStyle = o.hat; ctx.beginPath(); ctx.ellipse(0, -40, 30, 7, 0, 0, Math.PI * 2); ctx.fill(); rr(ctx, -18, -62, 36, 24, 6); ctx.fill(); }
    ctx.restore();
  }
  function letter(ctx, L, cx, cy, r, good, col) {
    ctx.fillStyle = col || (good ? GREEN : C.kiko); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    text(ctx, L, cx, cy + r * 0.42, r * 1.2, { align: "center", weight: 900, color: "#fff" });
  }

  // ---------- bendera negara kontributor (digambar dengan kode) ----------
  function pole(ctx, x, y, h) { ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140); }
  function frame(ctx, x, y, w, h) { ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h); }
  function stripesH(ctx, x, y, w, h, cols) { cols.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(x, y + i * h / cols.length, w, h / cols.length + 0.5); }); }
  const FLAGS = {
    // Slowakia: putih, biru, merah + perisai merah berpalang ganda putih di atas tiga bukit biru
    SK(ctx, x, y, w) {
      const h = w * 2 / 3; pole(ctx, x, y, h); stripesH(ctx, x, y, w, h, ["#FFFFFF", "#0B4EA2", "#EE1C25"]);
      const sx = x + w * 0.2, sy = y + h * 0.2, sw = w * 0.3, sh = h * 0.6;
      ctx.save(); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + sw, sy); ctx.lineTo(sx + sw, sy + sh * 0.62);
      ctx.quadraticCurveTo(sx + sw, sy + sh * 0.95, sx + sw / 2, sy + sh); ctx.quadraticCurveTo(sx, sy + sh * 0.95, sx, sy + sh * 0.62); ctx.closePath();
      ctx.fillStyle = "#EE1C25"; ctx.fill(); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = w * 0.012; ctx.stroke(); ctx.clip();
      ctx.fillStyle = "#0B4EA2"; [[0.22, 0.86, 0.26], [0.5, 0.8, 0.3], [0.78, 0.86, 0.26]].forEach(([fx, fy, r]) => { ctx.beginPath(); ctx.arc(sx + sw * fx, sy + sh * fy + sw * r * 0.6, sw * r, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = "#FFFFFF"; const cxm = sx + sw / 2, bw = sw * 0.09;
      ctx.fillRect(cxm - bw / 2, sy + sh * 0.12, bw, sh * 0.58); ctx.fillRect(cxm - sw * 0.26, sy + sh * 0.25, sw * 0.52, bw); ctx.fillRect(cxm - sw * 0.34, sy + sh * 0.42, sw * 0.68, bw);
      ctx.restore(); frame(ctx, x, y, w, h);
    },
    // Iran: hijau, putih, merah + lambang merah sederhana di tengah
    IR(ctx, x, y, w) {
      const h = w * 4 / 7; pole(ctx, x, y, h); stripesH(ctx, x, y, w, h, ["#239F40", "#FFFFFF", "#DA0000"]);
      const cx = x + w / 2, cy = y + h / 2, r = h * 0.12; ctx.strokeStyle = "#DA0000"; ctx.lineWidth = w * 0.014;
      ctx.beginPath(); ctx.arc(cx - r * 0.45, cy, r, Math.PI * 0.55, Math.PI * 1.45); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + r * 0.45, cy, r, -Math.PI * 0.45, Math.PI * 0.45); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - r * 1.1); ctx.lineTo(cx, cy + r * 1.1); ctx.stroke();
      ctx.fillStyle = "#FFFFFF"; for (let i = 0; i < 11; i++) { ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.fillRect(x + w * (0.08 + i * 0.077), y + h / 3 - 3, w * 0.05, 3); ctx.fillRect(x + w * (0.08 + i * 0.077), y + h * 2 / 3, w * 0.05, 3); }
      frame(ctx, x, y, w, h);
    },
    // Siprus: putih, siluet pulau berwarna tembaga, dua ranting zaitun hijau
    CY(ctx, x, y, w) {
      const h = w * 2 / 3; pole(ctx, x, y, h); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h);
      const pts = [[0.16, 0.42], [0.26, 0.37], [0.4, 0.38], [0.5, 0.33], [0.6, 0.3], [0.7, 0.26], [0.86, 0.17], [0.8, 0.27], [0.74, 0.36], [0.66, 0.44], [0.6, 0.52], [0.5, 0.6], [0.38, 0.62], [0.27, 0.58], [0.2, 0.5]];
      ctx.fillStyle = "#D57800"; ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(x + px * w, y + py * h) : ctx.moveTo(x + px * w, y + py * h)); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#4E5B31"; ctx.lineWidth = w * 0.012; ctx.fillStyle = "#4E5B31";
      for (const k of [-1, 1]) {
        const bx = x + w / 2 + k * w * 0.03; ctx.beginPath(); ctx.moveTo(bx, y + h * 0.86); ctx.quadraticCurveTo(x + w / 2 + k * w * 0.2, y + h * 0.84, x + w / 2 + k * w * 0.26, y + h * 0.7); ctx.stroke();
        for (let i = 0; i < 4; i++) { const t = 0.2 + i * 0.22, lx = lerp(bx, x + w / 2 + k * w * 0.25, t), ly = lerp(y + h * 0.86, y + h * 0.72, t * t); ctx.beginPath(); ctx.ellipse(lx, ly - h * 0.03, w * 0.025, w * 0.011, -0.6 * k, 0, Math.PI * 2); ctx.fill(); }
      }
      frame(ctx, x, y, w, h);
    },
    // Kanada: merah, putih, merah + daun maple merah
    CA(ctx, x, y, w) {
      const h = w / 2; pole(ctx, x, y, h); ctx.fillStyle = "#D52B1E"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + w / 4, y, w / 2, h);
      const cx = x + w / 2, cy = y + h * 0.52, s = h * 0.42;
      const leaf = [[0, -1], [0.12, -0.72], [0.28, -0.8], [0.22, -0.38], [0.5, -0.62], [0.46, -0.48], [0.72, -0.5], [0.62, -0.3], [0.78, -0.22], [0.42, 0.06], [0.48, 0.24], [0.06, 0.18], [0.06, 0.62], [-0.06, 0.62], [-0.06, 0.18], [-0.48, 0.24], [-0.42, 0.06], [-0.78, -0.22], [-0.62, -0.3], [-0.72, -0.5], [-0.46, -0.48], [-0.5, -0.62], [-0.22, -0.38], [-0.28, -0.8], [-0.12, -0.72]];
      ctx.fillStyle = "#D52B1E"; ctx.beginPath(); leaf.forEach(([px, py], i) => i ? ctx.lineTo(cx + px * s, cy + py * s) : ctx.moveTo(cx + px * s, cy + py * s)); ctx.closePath(); ctx.fill();
      frame(ctx, x, y, w, h);
    },
    // Belgia: hitam, kuning, merah (kiri ke kanan)
    BE(ctx, x, y, w) {
      const h = w * 13 / 15; pole(ctx, x, y, h); ["#000000", "#FDDA24", "#EF3340"].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(x + i * w / 3, y, w / 3 + 0.5, h); });
      frame(ctx, x, y, w, h);
    },
    // India: jingga, putih, hijau + roda biru (Ashoka Chakra) di tengah
    IN(ctx, x, y, w) {
      const h = w * 2 / 3; pole(ctx, x, y, h); stripesH(ctx, x, y, w, h, ["#FF9933", "#FFFFFF", "#138808"]);
      const cx = x + w / 2, cy = y + h / 2, r = h / 3 * 0.42; ctx.strokeStyle = "#000080"; ctx.lineWidth = w * 0.008;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.stroke(); }
      frame(ctx, x, y, w, h);
    },
    // Swiss: merah dengan palang putih (bendera persegi)
    CH(ctx, x, y, w) {
      const h = w; pole(ctx, x, y, h); ctx.fillStyle = "#DA291C"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(x + w * 0.4, y + h * 0.19, w * 0.2, h * 0.62); ctx.fillRect(x + w * 0.19, y + h * 0.4, w * 0.62, h * 0.2);
      frame(ctx, x, y, w, h);
    },
    // Hungaria: merah, putih, hijau (atas ke bawah)
    HU(ctx, x, y, w) { const h = w / 2; pole(ctx, x, y, h); stripesH(ctx, x, y, w, h, ["#CD2A3E", "#FFFFFF", "#436F4D"]); frame(ctx, x, y, w, h); },
    // Irlandia: hijau, putih, jingga (kiri ke kanan)
    IE(ctx, x, y, w) {
      const h = w / 2; pole(ctx, x, y, h); ["#169B62", "#FFFFFF", "#FF883E"].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(x + i * w / 3, y, w / 3 + 0.5, h); });
      frame(ctx, x, y, w, h);
    },
    // Amerika Serikat: 13 garis merah-putih + kanton biru dengan bintang
    US(ctx, x, y, w) {
      const h = w * 10 / 19; pole(ctx, x, y, h);
      for (let i = 0; i < 13; i++) { ctx.fillStyle = i % 2 ? "#FFFFFF" : "#B22234"; ctx.fillRect(x, y + i * h / 13, w, h / 13 + 0.5); }
      const cw = w * 0.4, ch = h * 7 / 13; ctx.fillStyle = "#3C3B6E"; ctx.fillRect(x, y, cw, ch); ctx.fillStyle = "#FFFFFF";
      for (let r = 0; r < 9; r++) for (let c = 0; c < (r % 2 ? 5 : 6); c++) { const sx = x + cw * ((r % 2 ? 1 : 0.5) + c * 2) / 12, sy = y + ch * (r + 0.5) / 9; ctx.beginPath(); ctx.arc(sx, sy, w * 0.008, 0, Math.PI * 2); ctx.fill(); }
      frame(ctx, x, y, w, h);
    },
    // Britania Raya: biru, salib diagonal putih-merah, salib tegak putih-merah
    UK(ctx, x, y, w) {
      const h = w / 2; pole(ctx, x, y, h); ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      ctx.fillStyle = "#012169"; ctx.fillRect(x, y, w, h); ctx.lineCap = "butt";
      const L = (w2, c) => { ctx.strokeStyle = c; ctx.lineWidth = w2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y + h); ctx.moveTo(x + w, y); ctx.lineTo(x, y + h); ctx.stroke(); };
      L(h * 0.2, "#FFFFFF"); L(h * 0.067, "#C8102E");
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + w / 2 - h / 6, y, h / 3, h); ctx.fillRect(x, y + h / 3, w, h / 3);
      ctx.fillStyle = "#C8102E"; ctx.fillRect(x + w / 2 - h / 10, y, h / 5, h); ctx.fillRect(x, y + h * 0.4, w, h / 5);
      ctx.restore(); frame(ctx, x, y, w, h);
    },
    // Lituania: kuning, hijau, merah (atas ke bawah)
    LT(ctx, x, y, w) { const h = w * 3 / 5; pole(ctx, x, y, h); stripesH(ctx, x, y, w, h, ["#FDB913", "#006A44", "#C1272D"]); frame(ctx, x, y, w, h); },
  };
  function globe(ctx, gx, gy, gr) {
    ctx.fillStyle = "#DCEEFB"; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#2F6FA8"; ctx.lineWidth = 5; ctx.stroke();
    ctx.lineWidth = 3; for (const k of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.ellipse(gx, gy, gr * Math.abs(Math.cos(k * 1.6)) || 2, gr, 0, 0, Math.PI * 2); ctx.stroke(); }
    for (const k of [-0.5, 0, 0.5]) { const yy = gy + k * gr * 1.3, w = Math.sqrt(Math.max(0, gr * gr - (yy - gy) ** 2)); ctx.beginPath(); ctx.moveTo(gx - w, yy); ctx.lineTo(gx + w, yy); ctx.stroke(); }
  }

  /* ---------- adegan umum dari META ----------
     META = { judul, tahun, negara, kode, flag: "SK", sumber: "Buku Tantangan Bebras Indonesia 2017",
              tingkat: "kelas 4, 5, dan 6 SD (Siaga)", bukaFrasa: "lomba", art(ctx, l) (gambar kecil di buka/akhir, opsional),
              langkah: [3 kalimat], cta: "kalimat oranye di kartu ajakan", gambarUlang: "Gambar soal digambar ulang untuk video ini." } */
  function umum(META) {
    const flag = FLAGS[META.flag];
    return {
      buka(ctx, b, l) {
        board(ctx);
        const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
        ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
        text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
        mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
        const bu = first ? P(l, at(b, META.bukaFrasa || "Bebras", 30), 0.8) : 1;
        if (META.art) alpha(ctx, bu, () => META.art(ctx, l));
        else [880, 1110, 1340, 1570].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v }); });
        if (!first) hand(ctx, META.tingkat ? META.tingkat : "pelan-pelan, satu langkah demi satu langkah", 1230, 790, 40, { alpha: P(l, 0.6, 0.6) });
        kiko(ctx, 380, 560, 230, 0, { wave: l, mood: "happy" });
      },
      kredit(ctx, b, l) {
        board(ctx);
        alpha(ctx, P(l, 0.2, 0.6), () => globe(ctx, 380, 520, 160));
        const tn = Math.min(at(b, META.negara), at(b, "dibuat oleh") + 1.2), fu = P(l, tn, 0.6); if (fu > 0 && flag) alpha(ctx, fu, () => flag(ctx, 450, 230, 200));
        const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"], ["Sumber", META.sumber, "dibuat oleh"]];
        text(ctx, "ASAL SOAL", 720, 210, 32, { weight: 900, color: C.accentDark });
        rows.forEach(([k, v, ph], i) => {
          const a = P(l, at(b, ph) + (i >= 3 ? 0.8 + (i - 3) * 0.5 : 0), 0.5); if (a <= 0) return;
          alpha(ctx, a, () => {
            text(ctx, k, 720, 285 + i * 86, 32, { weight: 700, color: C.ink2 });
            text(ctx, v, 960, 285 + i * 86, i === 4 ? 34 : 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 860 });
          });
        });
        const au = P(l, tn + 0.3, 0.8);
        if (au > 0) ring(ctx, 960 + tw(ctx, "Tim Bebras " + META.negara, 44, 900) / 2, 285 + 2 * 86 - 14, tw(ctx, "Tim Bebras " + META.negara, 44, 900) / 2 + 40, 44, au);
      },
      langkah(ctx, b, l) {
        board(ctx);
        const keys = META.langkahFrasa || ["Pertama", "Kedua", "Ketiga"];
        META.langkah.forEach((s, i) => {
          const y = 170 + i * 185, a = P(l, at(b, keys[i]), 0.5);
          alpha(ctx, a, () => {
            card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
            ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
            text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
            text(ctx, s, 330, y + 96, 42, { weight: 900, color: INK, fit: 1380 });
          });
        });
      },
      akhir(ctx, b, l) {
        board(ctx);
        kiko(ctx, 300, 520, 210, 0, { wave: l, mood: "happy" });
        if (META.art) { ctx.save(); ctx.translate(560, 330); ctx.scale(0.42, 0.42); ctx.translate(-760, -330); META.art(ctx, l); ctx.restore(); }
        else [620, 860].forEach((x, i) => beaver(ctx, x, 480 + Math.sin(l * 3 + i) * 8, 160));
        card(ctx, 1040, 160, 790, 630, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
        text(ctx, "TERIMA KASIH", 1435, 220, 34, { align: "center", weight: 900, color: C.accentDark });
        const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode], ["Sumber:", META.sumber]];
        L.forEach(([k, v], i) => { const y = 300 + i * 70; text(ctx, k, 1080, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1290, y, i === 4 ? 26 : 34, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 510 }); });
        para(ctx, META.gambarUlang || "Gambar soal digambar ulang untuk video ini.", 1435, 700, 26, 700, { align: "center", weight: 600, color: C.ink2 });
        hand(ctx, "Semoga sukses!", 560, 800, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
      },
      cta_bebras(ctx, b, l) {
        board(ctx);
        text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
        text(ctx, META.judul, 960, 340, 72, { align: "center", weight: 900, color: INK, fit: 1000 });
        text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
        text(ctx, META.cta || "", 960, 500, 38, { align: "center", weight: 800, color: ORANGE, fit: 1000 });
        kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
      },
    };
  }

  K.BEBRAS = { INK, ORANGE, GREEN, RED, BLUE, FUR, FUR2, GREY, TXT, lead, atI, at, P, board, plen, mline, tick, cross, ring, hand, tw, alpha, arrow, hourglass, thinkBadge, noteCard, beaver, letter, FLAGS, globe, umum };
})(typeof window !== "undefined" ? window : globalThis);
