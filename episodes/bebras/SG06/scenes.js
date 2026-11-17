/* SG06 Pembahasan Soal Bebras 2025-ID-01 "Waktunya Camilan" (Indonesia), kategori Siaga.
   Gaya papan tulis putih dengan coretan spidol (sama dengan SG01–SG04) + simulasi:
   empat camilan (apel, pir, mangga, permen), dua kartu aturan, tabel rencana A–D, bingkai dua hari yang digeser
   (oranye), centang hijau untuk pasangan aman, silang merah untuk pelanggaran.
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
  // ---------- SG06: camilan, aturan, tabel rencana, bingkai dua hari ----------
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F7FD1",
        GRAYT = "#8A96A0", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Waktunya Camilan", tahun: "2025", negara: "Indonesia", kode: "2025-ID-01" };
  const NAME = { a: "apel", p: "pir", m: "mangga", r: "permen" };
  const PLAN = { A: "rrapm", B: "rmarp", C: "mramr", D: "rammr" };
  const ROWS = ["A", "B", "C", "D"];

  // ----- camilan; cx,cy pusat, s = ukuran kira-kira (lebar) -----
  function leaf(ctx, x, y, w, h, rot, col = "#3E9B3A") {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = col; ctx.strokeStyle = "#245C22"; ctx.lineWidth = Math.max(1.5, w * 0.06);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(w * 0.5, -h, w, 0); ctx.quadraticCurveTo(w * 0.5, h, 0, 0); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  function apel(ctx, cx, cy, s) {
    const r = s * 0.42;
    ctx.fillStyle = "#D7262B"; ctx.strokeStyle = "#7E1014"; ctx.lineWidth = Math.max(2, s * 0.03);
    ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.62);
    ctx.bezierCurveTo(cx + r * 0.5, cy - r * 1.15, cx + r * 1.25, cy - r * 0.7, cx + r * 1.1, cy + r * 0.1);
    ctx.bezierCurveTo(cx + r * 1.0, cy + r * 0.8, cx + r * 0.5, cy + r * 1.1, cx, cy + r * 0.95);
    ctx.bezierCurveTo(cx - r * 0.5, cy + r * 1.1, cx - r * 1.0, cy + r * 0.8, cx - r * 1.1, cy + r * 0.1);
    ctx.bezierCurveTo(cx - r * 1.25, cy - r * 0.7, cx - r * 0.5, cy - r * 1.15, cx, cy - r * 0.62);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.beginPath(); ctx.ellipse(cx - r * 0.5, cy - r * 0.25, r * 0.16, r * 0.3, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#5B3A1E"; ctx.lineWidth = Math.max(2.5, s * 0.05); ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.6); ctx.quadraticCurveTo(cx + r * 0.05, cy - r * 1.05, cx + r * 0.2, cy - r * 1.25); ctx.stroke();
    leaf(ctx, cx + r * 0.12, cy - r * 1.0, r * 0.75, r * 0.32, -0.5);
  }
  function pir(ctx, cx, cy, s) {
    const r = s * 0.36;
    ctx.fillStyle = "#E9D23A"; ctx.strokeStyle = "#8D7A0E"; ctx.lineWidth = Math.max(2, s * 0.03);
    ctx.beginPath(); ctx.moveTo(cx, cy - r * 1.35);
    ctx.bezierCurveTo(cx + r * 0.55, cy - r * 1.35, cx + r * 0.6, cy - r * 0.6, cx + r * 0.75, cy - r * 0.2);
    ctx.bezierCurveTo(cx + r * 1.35, cy + r * 0.3, cx + r * 1.2, cy + r * 1.25, cx, cy + r * 1.25);
    ctx.bezierCurveTo(cx - r * 1.2, cy + r * 1.25, cx - r * 1.35, cy + r * 0.3, cx - r * 0.75, cy - r * 0.2);
    ctx.bezierCurveTo(cx - r * 0.6, cy - r * 0.6, cx - r * 0.55, cy - r * 1.35, cx, cy - r * 1.35);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.beginPath(); ctx.ellipse(cx - r * 0.45, cy + r * 0.3, r * 0.16, r * 0.34, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#5B3A1E"; ctx.lineWidth = Math.max(2.5, s * 0.05); ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx, cy - r * 1.3); ctx.lineTo(cx - r * 0.1, cy - r * 1.7); ctx.stroke();
    leaf(ctx, cx - r * 0.05, cy - r * 1.55, r * 0.8, r * 0.3, -0.25);
  }
  function mangga(ctx, cx, cy, s) {
    const r = s * 0.42;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.55);
    ctx.fillStyle = "#3C9A35"; ctx.strokeStyle = "#1E5A1A"; ctx.lineWidth = Math.max(2, s * 0.03);
    ctx.beginPath(); ctx.moveTo(-r * 1.05, -r * 0.05);
    ctx.bezierCurveTo(-r * 1.0, -r * 0.75, r * 0.3, -r * 0.85, r * 0.95, -r * 0.35);
    ctx.bezierCurveTo(r * 1.25, -r * 0.05, r * 1.0, r * 0.75, r * 0.2, r * 0.72);
    ctx.bezierCurveTo(-r * 0.4, r * 0.7, -r * 0.55, r * 0.3, -r * 0.75, r * 0.4);
    ctx.bezierCurveTo(-r * 1.0, r * 0.45, -r * 1.1, r * 0.25, -r * 1.05, -r * 0.05);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(190,230,120,0.55)"; ctx.beginPath(); ctx.ellipse(r * 0.2, -r * 0.35, r * 0.45, r * 0.14, 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "#5B3A1E"; ctx.lineWidth = Math.max(2.5, s * 0.045); ctx.lineCap = "round";
    const sx = cx + Math.cos(-0.55) * r * 1.0 - Math.sin(-0.55) * (-r * 0.3), sy = cy + Math.sin(-0.55) * r * 1.0 + Math.cos(-0.55) * (-r * 0.3);
    ctx.beginPath(); ctx.moveTo(sx - r * 0.05, sy + r * 0.05); ctx.lineTo(sx + r * 0.15, sy - r * 0.2); ctx.stroke();
    leaf(ctx, sx + r * 0.1, sy - r * 0.15, r * 0.7, r * 0.26, -1.1, "#7FA87A");
  }
  function permen(ctx, cx, cy, s) {
    const r = s * 0.3, top = cy - s * 0.12;
    ctx.fillStyle = "#EDEDED"; ctx.strokeStyle = "#8C8C8C"; ctx.lineWidth = Math.max(1.5, s * 0.02);
    rr(ctx, cx - s * 0.04, top + r * 0.8, s * 0.08, s * 0.5, s * 0.03); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#E7A9E6"; ctx.strokeStyle = "#7A2E86"; ctx.lineWidth = Math.max(2, s * 0.03);
    ctx.beginPath(); ctx.arc(cx, top, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#9B3FB0"; ctx.lineWidth = Math.max(2, s * 0.045); ctx.lineCap = "round"; ctx.beginPath();
    for (let k = 0; k <= 60; k++) { const t = k / 60, a = t * Math.PI * 5.2, rad = r * 0.85 * t; const x = cx + Math.cos(a) * rad, y = top + Math.sin(a) * rad; if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
  }
  const DRAW = { a: apel, p: pir, m: mangga, r: permen };
  function snack(ctx, k, cx, cy, s, a = 1) { alpha(ctx, a, () => DRAW[k](ctx, cx, cy, s)); }

  // ----- Lala (anak perempuan, sama dengan Delia di B04 tetapi baju oranye) -----
  function lala(ctx, cx, cy, s, opt = {}) {
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.translate(cx, cy);
    ctx.fillStyle = "rgba(0,0,0,0.10)"; ctx.beginPath(); ctx.ellipse(0, s * 0.95, s * 0.42, s * 0.07, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.skin; ctx.fillRect(-s * 0.16, s * 0.45, s * 0.1, s * 0.44); ctx.fillRect(s * 0.06, s * 0.45, s * 0.1, s * 0.44);
    ctx.fillStyle = "#3C4652"; ctx.beginPath(); ctx.ellipse(-s * 0.12, s * 0.91, s * 0.1, s * 0.05, 0, 0, Math.PI * 2); ctx.ellipse(s * 0.12, s * 0.91, s * 0.1, s * 0.05, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2E9C8F"; ctx.beginPath(); ctx.moveTo(-s * 0.25, s * 0.2); ctx.lineTo(s * 0.25, s * 0.2); ctx.lineTo(s * 0.36, s * 0.55); ctx.lineTo(-s * 0.36, s * 0.55); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.skin; ctx.lineCap = "round"; ctx.lineWidth = s * 0.1;
    ctx.beginPath(); ctx.moveTo(-s * 0.26, -s * 0.12); ctx.lineTo(-s * 0.36, s * 0.24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.26, -s * 0.12);
    if (opt.up) ctx.lineTo(s * 0.5, -s * 0.46); else ctx.lineTo(s * 0.36, s * 0.24);
    ctx.stroke();
    ctx.fillStyle = "#F29A3A"; rr(ctx, -s * 0.28, -s * 0.24, s * 0.56, s * 0.5, s * 0.12); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.24); ctx.lineTo(0, -s * 0.12); ctx.lineTo(s * 0.1, -s * 0.24); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.hair;   // rambut panjang sebahu
    ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.6); ctx.lineTo(-s * 0.34, -s * 0.22); ctx.lineTo(s * 0.34, -s * 0.22); ctx.lineTo(s * 0.3, -s * 0.6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.skin; ctx.beginPath(); ctx.arc(0, -s * 0.52, s * 0.26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(0, -s * 0.57, s * 0.28, Math.PI * 1.02, -0.02); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.06, -s * 0.7, s * 0.18, s * 0.07, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#E8618C"; ctx.beginPath(); ctx.ellipse(s * 0.2, -s * 0.76, s * 0.07, s * 0.045, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.pupil; ctx.beginPath(); ctx.arc(-s * 0.09, -s * 0.5, s * 0.03, 0, Math.PI * 2); ctx.arc(s * 0.09, -s * 0.5, s * 0.03, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(232,97,140,0.35)"; ctx.beginPath(); ctx.arc(-s * 0.16, -s * 0.42, s * 0.04, 0, Math.PI * 2); ctx.arc(s * 0.16, -s * 0.42, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.pupil; ctx.lineWidth = s * 0.022; ctx.beginPath(); ctx.arc(0, -s * 0.45, s * 0.07, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    ctx.restore();
  }
  function flagID(ctx, x, y, w) {   // bendera Merah Putih
    const h = w * 0.66;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#E1251B"; ctx.fillRect(x, y, w, h / 2 + 0.5);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y + h / 2, w, h / 2);
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }
  function arrowR(ctx, x1, x2, y, color = INK, w = 5) { mline(ctx, [[x1, y], [x2, y]], 1, color, w, true); }
  function sun(ctx, x, y, r) {
    ctx.fillStyle = "#F7B733"; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#F7B733"; ctx.lineWidth = 6; ctx.lineCap = "round";
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3); ctx.lineTo(x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6); ctx.stroke(); }
  }

  // ----- kartu aturan (koordinat lokal 1000×280, diskalakan sc) -----
  function ruleCard(ctx, n, x, y, sc, opt = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    card(ctx, 0, 0, 1000, 280, { fill: "#FFFDF6", stroke: opt.hl ? opt.hlColor || ORANGE : "#D9C9A3", lw: opt.hl ? 8 : 4, r: 22 });
    text(ctx, "ATURAN " + n, 36, 58, 36, { weight: 900, color: C.accentDark });
    text(ctx, "hari ini", 170, 262, 28, { align: "center", weight: 800, color: GRAYT });
    if (n === 1) {
      snack(ctx, "m", 170, 160, 120); arrowR(ctx, 245, 300, 160, INK, 5); snack(ctx, "m", 380, 160, 120);
      text(ctx, "besok", 380, 262, 28, { align: "center", weight: 800, color: GRAYT });
      cross(ctx, 380, 160, 130, opt.xu == null ? 1 : opt.xu, RED, 11);
      para(ctx, "Tidak boleh makan mangga dua hari berturut-turut.", 500, 120, 42, 470, { weight: 800, color: INK, lh: 1.2 });
    } else {
      snack(ctx, "r", 170, 160, 120); arrowR(ctx, 245, 300, 160, INK, 5);
      snack(ctx, "a", 355, 160, 100); text(ctx, "atau", 465, 172, 30, { align: "center", weight: 800, color: INK }); snack(ctx, "p", 575, 160, 100);
      text(ctx, "besok", 465, 262, 28, { align: "center", weight: 800, color: GRAYT });
      para(ctx, "Setelah permen, besok harus apel atau pir.", 665, 120, 38, 320, { weight: 800, color: INK, lh: 1.2 });
    }
    ctx.restore();
  }

  // ----- tabel rencana -----
  // g = {x, y, lw, cw, ch, hh}; opt: rowA {A: alpha}, hl (baris disorot), dim {A: 0..1}, res {A: [mark, u]}, pairs {A: [[i, mark, u]]},
  //       frame {row, i, n(1|2), a}
  function grid(x, y, lw, cw, ch, hh = 56) { return { x, y, lw, cw, ch, hh }; }
  const cellX = (g, d) => g.x + g.lw + d * g.cw + g.cw / 2;           // pusat kolom hari d (0..4)
  const rowY = (g, r) => g.y + g.hh + r * g.ch + g.ch / 2;             // pusat baris r (0..3)
  function planTable(ctx, g, opt = {}) {
    const W = g.lw + 5 * g.cw, rows = opt.rows || ROWS;
    ctx.fillStyle = "#EEF2F5"; rr(ctx, g.x, g.y, W, g.hh, 10); ctx.fill();
    text(ctx, "Pilihan", g.x + g.lw / 2, g.y + g.hh * 0.66, g.hh * 0.42, { align: "center", weight: 800, color: C.ink2 });
    for (let d = 0; d < 5; d++) text(ctx, "Hari " + (d + 1), cellX(g, d), g.y + g.hh * 0.66, g.hh * 0.46, { align: "center", weight: 900, color: INK });
    rows.forEach((R, r) => {
      const a = opt.rowA ? (opt.rowA[R] != null ? opt.rowA[R] : 1) : 1; if (a <= 0) return;
      const dim = opt.dim ? (opt.dim[R] || 0) : 0;
      alpha(ctx, a * (1 - 0.7 * dim), () => {
        const top = g.y + g.hh + r * g.ch;
        if (opt.hl === R) { ctx.fillStyle = "#FFF3C4"; rr(ctx, g.x, top + 4, W, g.ch - 8, 12); ctx.fill(); }
        ctx.strokeStyle = "#DCE2E7"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(g.x, top + g.ch); ctx.lineTo(g.x + W, top + g.ch); ctx.stroke();
        const rs = opt.res && opt.res[R];
        if (rs && rs[1] > 0) { ctx.save(); ctx.globalAlpha *= clamp(rs[1] * 2, 0, 1); ctx.fillStyle = rs[0] === "v" ? "#DDF3E4" : "#FBE1DF"; rr(ctx, g.x + 6, top + 8, g.lw - 12, g.ch - 16, 12); ctx.fill(); ctx.restore(); }
        text(ctx, "(" + R + ")", g.x + g.lw * 0.36, rowY(g, r) + g.ch * 0.15, g.ch * 0.36, { align: "center", weight: 900, color: rs && rs[1] > 0.5 ? (rs[0] === "v" ? GREEN : RED) : INK });
        for (let d = 0; d < 5; d++) snack(ctx, PLAN[R][d], cellX(g, d), rowY(g, r), g.ch * 0.62);
        if (rs && rs[1] > 0) {
          const mx = g.x + g.lw * 0.76, my = rowY(g, r), s = g.ch * 0.32;
          if (rs[0] === "v") tick(ctx, mx, my, s, rs[1], GREEN, 7); else cross(ctx, mx, my, s * 0.9, rs[1], RED, 7);
        }
        (opt.pairs && opt.pairs[R] || []).forEach(([i, mk, u]) => {
          if (u <= 0) return;
          const px = g.x + g.lw + (i + 1) * g.cw, py = top + g.ch / 2, s = Math.min(44, g.ch * 0.32);
          ctx.save(); ctx.fillStyle = mk === "v" ? "#E3F5E8" : "#FBE1DF"; ctx.globalAlpha *= clamp(u * 2, 0, 1); ctx.beginPath(); ctx.arc(px, py, s * 0.68, 0, Math.PI * 2); ctx.fill(); ctx.restore();
          if (mk === "v") tick(ctx, px, py, s, u, GREEN, 6); else cross(ctx, px, py, s * 0.85, u, RED, 7);
        });
      });
    });
    const f = opt.frame;
    if (f && f.a > 0) {
      const r = rows.indexOf(f.row), top = g.y + g.hh + r * g.ch, x0 = g.x + g.lw + f.i * g.cw;
      alpha(ctx, f.a, () => { ctx.strokeStyle = ORANGE; ctx.lineWidth = 9; rr(ctx, x0 + 4, top + 2, g.cw * (f.n || 2) - 8, g.ch - 4, 16); ctx.stroke(); });
    }
  }
  // posisi bingkai halus: daftar [waktu, pasangan]; dari pasangan sebelumnya bergeser 0,5 detik
  function slide(l, evs, first = 0) {
    let pos = first;
    for (const [t, i] of evs) { if (l < t) break; pos = lerp(pos, i, P(l, t, 0.5)); if (l >= t + 0.5) pos = i; }
    return pos;
  }

  // ---------- soal utuh ----------
  function soal(ctx, b, l) {
    board(ctx);
    const id = b.id;
    if (id === "soal1" || id === "soal2") {
      lala(ctx, 330, 440, 300, { alpha: id === "soal1" ? P(l, at(b, "Ini adalah"), 0.7) : 1 });
      text(ctx, "Lala", 330, 795, 44, { align: "center", weight: 900, color: "#C8601A" });
      if (id === "soal1") {
        alpha(ctx, P(l, at(b, "setiap sore"), 0.6), () => { sun(ctx, 1300, 330, 70); hand(ctx, "camilan setiap sore", 1300, 560, 60, { color: ORANGE }); });
        return;
      }
      const T = atSeq(b, ["apel", "pir", "mangga", "permen"], "yaitu");
      ["a", "p", "m", "r"].forEach((k, i) => {
        const x = 760 + i * 280, a = P(l, T[i], 0.5);
        alpha(ctx, a, () => { snack(ctx, k, x, 360, 190); text(ctx, NAME[k], x, 530, 44, { align: "center", weight: 900, color: INK }); });
      });
      hand(ctx, "hanya 1 camilan setiap hari", 1180, 700, 56, { color: ORANGE, alpha: P(l, at(b, "Setiap hari"), 0.6) });
      return;
    }
    if (id === "soal3" || id === "soal4") {
      lala(ctx, 250, 440, 270);
      text(ctx, "Lala", 250, 760, 40, { align: "center", weight: 900, color: "#C8601A" });
      hand(ctx, "2 aturan dari Ibu", 1170, 200, 46, { color: ORANGE, alpha: id === "soal3" ? P(l, 0.3, 0.6) : 1 });
      ruleCard(ctx, 1, 560, 235, 1.0, { alpha: id === "soal3" ? P(l, at(b, "Aturan pertama"), 0.6) : 1, xu: id === "soal3" ? P(l, at(b, "tidak boleh"), 0.7) : 1 });
      if (id === "soal4") ruleCard(ctx, 2, 560, 540, 1.0, { alpha: P(l, at(b, "Aturan kedua"), 0.6) });
      return;
    }
    // soal5, soal6: tabel + kartu aturan kecil
    const g = grid(80, 170, 150, 178, 135);
    const T5 = id === "soal5" ? at(b, "Ada empat rencana") : -9;
    const rowA = {}; ROWS.forEach((R, i) => rowA[R] = id === "soal5" ? P(l, T5 + i * 0.6, 0.5) : 1);
    alpha(ctx, id === "soal5" ? P(l, 0.3, 0.6) : 1, () => planTable(ctx, g, { rowA }));
    ruleCard(ctx, 1, 1160, 175, 0.68); ruleCard(ctx, 2, 1160, 380, 0.68);
    if (id === "soal5") {
      const a = P(l, at(b, "Setiap baris"), 0.5);
      if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = BLUE; ctx.lineWidth = 6; rr(ctx, g.x + g.lw - 6, rowY(g, 0) - g.ch / 2 + 6, 5 * g.cw + 12, g.ch - 12, 14); ctx.stroke(); ctx.restore();
        mline(ctx, [[cellX(g, 0), 145 + 0], [cellX(g, 4), 145]], P(l, at(b, "dari hari pertama"), 1.2), BLUE, 5, true); }
    }
    if (id === "soal6") {
      hand(ctx, "Rencana mana yang boleh?", 1500, 670, 46, { color: ORANGE, alpha: P(l, 0.3, 0.6) });
      hand(ctx, "tanpa menebak!", 1500, 760, 44, { color: GREEN, alpha: P(l, at(b, "tanpa"), 0.5) });
    }
  }

  // ---------- memahami aturan ----------
  function dayStrip(ctx, keys, cx, cy, cw, opt = {}) {   // kotak hari berjajar; opt.show(i) alpha; opt.labels
    const n = keys.length, x0 = cx - n * cw / 2;
    keys.forEach((k, i) => {
      const a = opt.show ? opt.show(i) : 1; if (a <= 0) return;
      alpha(ctx, a, () => {
        ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#B8C3CA"; ctx.lineWidth = 3; rr(ctx, x0 + i * cw + 8, cy - cw * 0.5, cw - 16, cw, 16); ctx.fill(); ctx.stroke();
        if (k) snack(ctx, k, x0 + i * cw + cw / 2, cy + 4, cw * 0.62);
        const lab = opt.labels ? opt.labels[i] : "Hari " + (i + 1);
        text(ctx, lab, x0 + i * cw + cw / 2, cy - cw * 0.5 - 16, 30, { align: "center", weight: 800, color: GRAYT });
      });
    });
    return i => x0 + i * cw + cw / 2;
  }
  function aturan1(ctx, b, l) {
    board(ctx);
    const r1 = b.id === "r1";
    hand(ctx, "Aturan 1", 220, 220, 54, { color: C.accentDark });
    // baris atas: mangga, mangga (berturut-turut)
    dayStrip(ctx, ["m", "m"], 700, 320, 200, { show: i => r1 ? (i === 0 ? P(l, at(b, "hari yang satu"), 0.5) : P(l, at(b, "langsung disusul"), 0.5)) : 1 });
    const arcU = r1 ? P(l, at(b, "langsung disusul"), 0.8) : 1;
    mline(ctx, [[600, 440], [700, 480], [800, 440]], arcU, BLUE, 5, true);
    hand(ctx, "langsung besoknya", 700, 530, 38, { color: BLUE, alpha: arcU });
    const cu = r1 ? P(l, at(b, "tidak boleh makan mangga lagi"), 0.7) : 1;
    cross(ctx, 800, 324, 160, cu, RED, 12);
    hand(ctx, "berturut-turut", 1250, 310, 52, { color: RED, alpha: r1 ? P(l, at(b, "Berturut-turut"), 0.5) : 1 });
    hand(ctx, "= tidak boleh", 1250, 380, 52, { color: RED, alpha: cu });
    if (r1) { kiko(ctx, 1700, 640, 170, 0, { mood: "happy" }); return; }
    // baris bawah: mangga, apel, mangga
    const T = atSeq(b, ["mangga, lalu", "lalu apel", "lalu mangga"], "Contohnya");
    dayStrip(ctx, ["m", "a", "m"], 700, 690, 170, { show: i => P(l, T[i], 0.4) });
    ring(ctx, 700, 694, 80, 80, P(l, at(b, "lalu apel") + 0.3, 0.7), ORANGE, 6);
    hand(ctx, "mangga lagi lusa", 1250, 660, 46, { color: INK, alpha: P(l, at(b, "lusa"), 0.5) });
    hand(ctx, "= boleh", 1250, 730, 52, { color: GREEN, alpha: P(l, at(b, "itu boleh"), 0.5) });
    tick(ctx, 1490, 705, 80, P(l, at(b, "tidak melanggar"), 0.6), GREEN, 10);
  }
  function optsRow(ctx, b, l, y, today, marks, times, label) {
    // today = huruf camilan hari ini (atau "ap"); marks = {a:'v'|'x',...}; times = {a: t}
    card(ctx, 110, y - 100, 1700, 200, { fill: "#F7F9FA", stroke: "#D3DBE0", lw: 2, r: 20 });
    text(ctx, "hari ini", 300, y - 66, 28, { align: "center", weight: 800, color: GRAYT });
    if (today.length === 2) { snack(ctx, "a", 245, y + 15, 100); text(ctx, "/", 300, y + 30, 50, { align: "center", weight: 800, color: INK }); snack(ctx, "p", 355, y + 15, 100); }
    else snack(ctx, today, 300, y + 15, 125);
    arrowR(ctx, 440, 540, y + 10, INK, 6);
    text(ctx, "besok", 1035, y - 66, 28, { align: "center", weight: 800, color: GRAYT });
    ["a", "p", "m", "r"].forEach((k, i) => {
      const x = 660 + i * 250;
      snack(ctx, k, x, y + 15, 120);
      const t = times[k]; if (t == null || !marks[k]) return;
      const u = P(l, t, 0.5);
      if (marks[k] === "v") tick(ctx, x + 70, y + 60, 60, u, GREEN, 9); else cross(ctx, x, y + 15, 140, u, RED, 10);
    });
    if (label) hand(ctx, label[0], 1690, y + 25, 50, { color: label[2] || GREEN, alpha: label[1] });
  }
  function aturan2(ctx, b, l) {
    board(ctx);
    const r3 = b.id === "r3";
    hand(ctx, "Aturan 2", 220, 200, 54, { color: C.accentDark });
    let tm;
    if (r3) { const T = atSeq(b, ["apel", "pir", "tidak boleh ada mangga", "tidak boleh ada permen"], "hanya boleh"); tm = { a: T[0], p: T[1], m: T[2], r: T[3] }; }
    else tm = { a: -9, p: -9, m: -9, r: -9 };
    optsRow(ctx, b, l, 360, "r", { a: "v", p: "v", m: "x", r: "x" }, tm, ["2 pilihan", r3 ? P(l, at(b, "tidak boleh ada permen") + 0.8, 0.5) : 1]);
    if (r3) return;
    const t0 = at(b, "Kalau hari ini"), t1 = at(b, "boleh memilih");
    alpha(ctx, P(l, t0, 0.5), () => optsRow(ctx, b, l, 660, "ap", { a: "v", p: "v", m: "v", r: "v" }, { a: t1, p: t1 + 0.2, m: t1 + 0.4, r: t1 + 0.6 }, ["semua boleh", P(l, t1 + 0.9, 0.5)]));
    hand(ctx, "hanya setelah permen", 1300, 200, 44, { color: ORANGE, alpha: P(l, at(b, "hanya berlaku"), 0.5) });
  }

  // ---------- pemanasan: bingkai dua hari ----------
  const SAMPLE = ["a", "m", "m", "p", "r"];
  function bingkai(ctx, b, l) {
    board(ctx);
    const cw = 230, cy = 400;
    const X = dayStrip(ctx, SAMPLE, 960, cy, cw);
    let pos = 0, fa = 1;
    if (b.id === "w1") { fa = P(l, at(b, "sebuah bingkai"), 0.6); }
    if (b.id === "w2") { const T = atSeq(b, ["Mula-mula", "lalu hari kedua", "dan seterusnya"]); pos = slide(l, [[T[1], 1], [T[2], 2], [T[2] + 1.0, 3]]); }
    if (b.id === "w3") pos = 0;
    if (b.id === "w4") pos = slide(l, [[at(b, "pasangan kedua"), 1]]);
    const x0 = X(0) - cw / 2 + pos * cw;
    alpha(ctx, fa, () => {
      ctx.strokeStyle = ORANGE; ctx.lineWidth = 10; rr(ctx, x0 + 2, cy - cw * 0.5 - 60, cw * 2 - 4, cw + 70, 20); ctx.stroke();
      if (b.id === "w1") {
        hand(ctx, "hari ini", x0 + cw / 2, cy + cw * 0.5 + 55, 36, { color: ORANGE }); hand(ctx, "besok", x0 + cw * 1.5, cy + cw * 0.5 + 55, 36, { color: ORANGE });
      }
    });
    if (b.id === "w1") { kiko(ctx, 1720, 690, 150, 0, { mood: "happy" }); return; }
    if (b.id === "w2") {
      const pa = P(l, at(b, "empat pasangan"), 0.5);
      for (let i = 0; i < 4; i++) {
        const a = clamp(pa * 4 - i, 0, 1), xa = X(i), xb = X(i + 1), yy = cy + cw * 0.5 + 40 + (i % 2) * 70;
        alpha(ctx, a, () => { ctx.strokeStyle = BLUE; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(xa + 12, yy - 20); ctx.lineTo(xa + 12, yy); ctx.lineTo(xb - 12, yy); ctx.lineTo(xb - 12, yy - 20); ctx.stroke(); });
        alpha(ctx, a, () => text(ctx, String(i + 1), (xa + xb) / 2, yy + 46, 38, { align: "center", weight: 900, color: BLUE }));
      }
      hand(ctx, "4 pasangan", 1700, 760, 48, { color: BLUE, alpha: P(l, at(b, "empat pasangan") + 1, 0.5) });
      return;
    }
    // w3, w4: tanda di bawah pasangan
    const mk = (i, m, u) => { const x = X(i) + cw / 2, y = cy + cw * 0.5 + 70; if (m === "v") tick(ctx, x, y, 70, u, GREEN, 10); else cross(ctx, x, y, 80, u, RED, 11); };
    const u1 = b.id === "w3" ? P(l, at(b, "pasangan ini aman"), 0.6) : 1;
    mk(0, "v", u1);
    if (b.id === "w3") { hand(ctx, "apel lalu mangga = aman", 960, 790, 44, { color: GREEN, alpha: P(l, at(b, "Tidak ada aturan"), 0.5) }); return; }
    const u2 = P(l, at(b, "melanggar"), 0.6);
    mk(1, "x", u2);
    hand(ctx, "melanggar aturan 1", X(2), 720, 40, { color: RED, alpha: u2 });
    const u3 = P(l, at(b, "Begitu"), 0.6);
    if (u3 > 0) {
      ctx.save(); ctx.globalAlpha *= u3 * 0.7; ctx.fillStyle = "#FFFFFF"; ctx.fillRect(X(3) - cw / 2 + 4, cy - cw * 0.5 - 50, cw * 2 - 8, cw + 60); ctx.restore();
      hand(ctx, "tidak perlu diperiksa", X(3) + cw / 2, cy + cw * 0.5 + 75, 34, { color: GRAYT, alpha: P(l, at(b, "tidak perlu"), 0.5) });
    }
    hand(ctx, "1 pelanggaran = tidak boleh", 960, 800, 50, { color: RED, alpha: P(l, at(b, "sudah pasti"), 0.5) });
  }

  // ---------- memeriksa rencana ----------
  const ORD = ["j1", "jA", "jB", "jC1", "jC2", "jC3", "jC4", "jD", "j6"];
  // tanda pasangan: [baris, pasangan, tanda, beat, frasa]
  const PM = [["A", 0, "x", "jA", "Jadi, rencana A"], ["B", 0, "x", "jB", "Jadi, rencana B"],
              ["C", 0, "v", "jC1", "pasangan pertama aman"], ["C", 1, "v", "jC2", "pasangan kedua aman"], ["C", 2, "v", "jC3", "Pasangan ketiga"], ["C", 3, "v", "jC3", "Pasangan keempat"],
              ["D", 0, "v", "jD", "itu aman"], ["D", 1, "v", "jD", "juga aman"], ["D", 2, "x", "jD", "mangga lagi"]];
  const RM = [["A", "x", "jA", "melanggar aturan kedua"], ["B", "x", "jB", "juga melanggar"], ["C", "v", "jC4", "tidak melanggar"], ["D", "x", "jD", "melanggar aturan pertama"]];
  const FR = { jA: ["A", [["Hari pertama", 0]]], jB: ["B", [["Hari pertama", 0]]], jC1: ["C", [["Hari pertama", 0]]], jC2: ["C", [["Hari kedua", 1]]],
               jC3: ["C", [["Hari ketiga", 2], ["Hari keempat", 3]]], jC4: ["C", [["Hari kelima", 4]]], jD: ["D", [["Permen lalu apel", 0], ["apel lalu mangga", 1], ["Tetapi", 2]]] };
  function checkState(b, l, ord) {
    const pairs = {}, res = {};
    PM.forEach(([R, i, m, bid, ph]) => { const u = ord(bid, () => P(l, at(b, ph), 0.6)); (pairs[R] = pairs[R] || []).push([i, m, u]); });
    RM.forEach(([R, m, bid, ph]) => { res[R] = [m, ord(bid, () => P(l, at(b, ph) + 0.6, 0.6))]; });
    let frame = null;
    const fr = FR[b.id];
    if (fr) {
      const ev = fr[1].map(([ph, i]) => [at(b, ph), i]);
      const pos = slide(l, ev.slice(1), ev[0][1]);
      const single = b.id === "jC4";
      frame = { row: fr[0], i: pos, n: single ? 1 : 2, a: P(l, ev[0][0] - 0.2, 0.4) };
    }
    return { pairs, res, frame, hl: fr ? fr[0] : null };
  }
  function periksa(ctx, b, l) {
    board(ctx);
    const ord = prog(ORD, b, l);
    const st = checkState(b, l, ord);
    const g = grid(80, 170, 150, 178, 135);
    const fin = ord("j6", () => P(l, 0.3, 0.6));
    const dim = fin > 0 ? { A: fin, B: fin, D: fin } : null;
    planTable(ctx, g, { hl: st.hl, pairs: st.pairs, res: st.res, frame: st.frame, dim });
    // kartu aturan, disorot saat dipakai
    const use = { jA: 2, jB: 2, jC2: 2, jD: 1 }[b.id];
    const hlA = use === 2 ? P(l, at(b, b.id === "jC2" ? "Ini sesuai" : "aturan kedua"), 0.4) : use === 1 ? P(l, at(b, "mangga lagi"), 0.4) : 0;
    ruleCard(ctx, 1, 1160, 175, 0.68, { hl: use === 1 && hlA > 0.5, hlColor: RED });
    ruleCard(ctx, 2, 1160, 380, 0.68, { hl: use === 2 && hlA > 0.5, hlColor: b.id === "jC2" ? GREEN : RED });
    const nx = 1500, ny = 650;
    if (b.id === "j1") { thinkBadge(ctx, 1150, 600, 700, 170, l, b.dur, "Rencana mana yang boleh?"); return; }
    const note = { jA: [["permen → permen", RED, "permen lagi"], ["melanggar aturan 2", RED, "Jadi, rencana A"]],
                   jB: [["permen → mangga", RED, "hari kedua mangga"], ["melanggar aturan 2", RED, "Jadi, rencana B"]],
                   jC1: [["mangga → permen", GREEN, "hari kedua permen"], ["aman", GREEN, "pasangan pertama aman"]],
                   jC2: [["permen → apel", GREEN, "hari ketiga apel"], ["sesuai aturan 2", GREEN, "Ini sesuai"]],
                   jC3: [["apel → mangga: aman", GREEN, "Pasangan ketiga"], ["mangga → permen: aman", GREEN, "Pasangan keempat"]],
                   jC4: [["tidak ada hari ke-6", BLUE, "Tidak ada hari keenam"], ["C tidak melanggar", GREEN, "tidak melanggar"]],
                   jD: [["mangga → mangga", RED, "mangga lagi"], ["melanggar aturan 1", RED, "Jadi, rencana D"]] }[b.id];
    if (note) note.forEach(([s, col, ph], k) => hand(ctx, s, nx, ny + k * 70, 44, { color: col, alpha: P(l, at(b, ph), 0.5) }));
    if (b.id === "j6") {
      const r = 2, cy = rowY(g, r);
      ring(ctx, g.x + (g.lw + 5 * g.cw) / 2, cy, (g.lw + 5 * g.cw) / 2 + 20, g.ch * 0.62, P(l, 0.5, 0.9), GREEN, 7);
      card(ctx, 1260, 610, 480, 160, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
      text(ctx, "JAWABAN", 1500, 665, 30, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, "C", 1500, 745, 70, { align: "center", weight: 900, color: GREEN });
    }
  }

  // ---------- bagaimana kalau ----------
  function lebih(ctx, b, l) {
    board(ctx);
    const ord = prog(["x1", "x2", "x3"], b, l);
    if (b.id === "x1") {
      card(ctx, 110, 250, 1700, 220, { fill: "#F7F9FA", stroke: "#D3DBE0", lw: 2, r: 20 });
      text(ctx, "hari ini", 300, 286, 28, { align: "center", weight: 800, color: GRAYT }); snack(ctx, "r", 300, 375, 140);
      arrowR(ctx, 440, 540, 370, INK, 6); text(ctx, "besok", 1035, 286, 28, { align: "center", weight: 800, color: GRAYT });
      for (let i = 0; i < 4; i++) { ctx.strokeStyle = "#B8C3CA"; ctx.lineWidth = 4; ctx.setLineDash([12, 10]); rr(ctx, 660 + i * 250 - 80, 300, 160, 150, 16); ctx.stroke(); ctx.setLineDash([]); hand(ctx, "?", 660 + i * 250, 405, 70, { color: GRAYT }); }
      thinkBadge(ctx, 470, 560, 980, 160, l, b.dur, "Setelah permen, ada berapa pilihan?");
      return;
    }
    const t2 = b.id === "x2" ? atSeq(b, ["apel", "pir", "Mangga tidak", "permen juga"]) : [-9, -9, -9, -9];
    optsRow(ctx, b, l, 245, "r", { a: "v", p: "v", m: "x", r: "x" }, { a: t2[0], p: t2[1], m: t2[2], r: t2[3] }, ["2 pilihan", ord("x2", () => P(l, at(b, "dua pilihan"), 0.5))]);
    if (b.id !== "x3") return;
    const T = atSeq(b, ["apel", "pir", "permen", "tiga pilihan"], "boleh makan");
    optsRow(ctx, b, l, 465, "m", { a: "v", p: "v", m: "x", r: "v" }, { a: T[0], p: T[1], m: T[1] + 0.6, r: T[2] }, ["3 pilihan", P(l, T[3], 0.5)]);
    const t4 = at(b, "keempat camilan");
    const a3 = P(l, at(b, "Kalau hari ini Lala makan apel"), 0.5);
    alpha(ctx, a3, () => optsRow(ctx, b, l, 685, "ap", { a: "v", p: "v", m: "v", r: "v" }, { a: t4, p: t4 + 0.2, m: t4 + 0.4, r: t4 + 0.6 }, ["4 pilihan", P(l, t4 + 0.8, 0.5)]));
  }
  function sandi(ctx, b, l) {
    board(ctx);
    kiko(ctx, 260, 560, 200, 0, { mood: "happy" });
    const X = 520, Y = 165, W = 1000, Hh = 560;
    ctx.fillStyle = "#3B4652"; rr(ctx, X, Y, W, Hh, 24); ctx.fill();
    ctx.fillStyle = "#F4F7FA"; rr(ctx, X + 24, Y + 24, W - 48, Hh - 60, 10); ctx.fill();
    ctx.fillStyle = "#3B4652"; ctx.fillRect(X + W / 2 - 40, Y + Hh, 80, 40); rr(ctx, X + W / 2 - 160, Y + Hh + 36, 320, 20, 10); ctx.fill();
    const fa = P(l, at(b, "membuat kata sandi"), 0.6);
    alpha(ctx, fa, () => {
      text(ctx, "Buat kata sandi", X + 80, Y + 110, 44, { weight: 900, color: INK });
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#9AA6B0"; ctx.lineWidth = 3; rr(ctx, X + 80, Y + 145, 640, 84, 12); ctx.fill(); ctx.stroke();
      const s = "kucingku", n = Math.round(clamp((l - at(b, "membuat kata sandi")) / 1.6, 0, 1) * s.length);
      text(ctx, s.slice(0, n), X + 110, Y + 203, 42, { weight: 700, color: INK });
    });
    const T = atSeq(b, ["memeriksa apakah", "semua aturannya", "dilanggar"]);
    const rules = [["Paling sedikit 8 huruf", "v", T[0] + 0.8], ["Ada angka", "x", T[1] + 0.4]];
    rules.forEach(([s, m, t], i) => {
      const y = Y + 300 + i * 80, a = P(l, T[0], 0.5);
      alpha(ctx, a, () => {
        text(ctx, s, X + 160, y + 14, 38, { weight: 800, color: INK });
        if (m === "v") tick(ctx, X + 110, y, 44, P(l, t, 0.5), GREEN, 7); else cross(ctx, X + 110, y, 44, P(l, t, 0.5), RED, 7);
      });
    });
    const da = P(l, at(b, "menolaknya"), 0.5);
    alpha(ctx, da, () => { ctx.fillStyle = "#FBE1DF"; rr(ctx, X + 640, Y + 300, 280, 110, 16); ctx.fill(); text(ctx, "Ditolak", X + 780, Y + 372, 48, { align: "center", weight: 900, color: RED }); });
  }

  // ---------- penutup ----------
  function langkah(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Pertama", "Kedua", "Ketiga"]);
    const S = ["Pahami setiap aturan dengan contoh.", "Periksa dua hari yang berdampingan.", "Satu pelanggaran saja berarti tidak boleh."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 48, { weight: 900, color: INK, fit: 1050 });
        const ix = 1560, iy = y + 80;
        if (i === 0) ruleCard(ctx, 1, ix - 160, iy - 45, 0.32);
        if (i === 1) { snack(ctx, "r", ix - 45, iy, 70); snack(ctx, "a", ix + 45, iy, 70); ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; rr(ctx, ix - 95, iy - 50, 190, 100, 12); ctx.stroke(); }
        if (i === 2) cross(ctx, ix, iy, 80, 1, RED, 10);
      });
    });
  }
  function jawabanC(ctx, b, l) {
    board(ctx);
    lala(ctx, 230, 470, 300, { up: true });
    const cw = 230, cy = 420;
    const X = dayStrip(ctx, PLAN.C.split(""), 1080, cy, cw);
    for (let i = 0; i < 4; i++) tick(ctx, X(i) + cw / 2, cy + cw * 0.5 + 50, 60, P(l, 0.4 + i * 0.35, 0.4), GREEN, 9);
    hand(ctx, "Jawaban: C", 1080, 210, 60, { color: GREEN, alpha: P(l, at(b, "adalah C"), 0.5) });
    hand(ctx, "tidak melanggar aturan apa pun", 1080, 780, 46, { color: GREEN, alpha: P(l, at(b, "tidak melanggar"), 0.5) });
  }

  // ---------- versi tegak untuk Short (area 1000×700, x 460–1460, y 140–840) ----------
  function soal_v(ctx, b, l) {
    board(ctx);
    lala(ctx, 640, 420, 240);
    text(ctx, "Lala", 640, 710, 40, { align: "center", weight: 900, color: "#C8601A" });
    const T = atSeq(b, ["apel", "pir", "mangga", "permen"], "yaitu");
    [["a", 1020, 300], ["p", 1290, 300], ["m", 1020, 560], ["r", 1290, 560]].forEach(([k, x, y], i) => alpha(ctx, P(l, T[i], 0.4), () => { snack(ctx, k, x, y, 150); text(ctx, NAME[k], x, y + 120, 36, { align: "center", weight: 900, color: INK }); }));
    hand(ctx, "2 aturan dari Ibu", 960, 800, 44, { color: ORANGE, alpha: P(l, at(b, "dua aturan"), 0.5) });
  }
  function aturan_v(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Pertama", "Kedua"]);
    ruleCard(ctx, 1, 470, 190, 0.98, { alpha: P(l, T[0], 0.5), xu: P(l, at(b, "tidak boleh") + 0.3, 0.6) });
    ruleCard(ctx, 2, 470, 510, 0.98, { alpha: P(l, T[1], 0.5) });
  }
  const GV = grid(470, 170, 140, 170, 130);
  function tabel_v(ctx, b, l) {
    board(ctx);
    const T = at(b, "empat rencana");
    const rowA = {}; ROWS.forEach((R, i) => rowA[R] = P(l, T + i * 0.4, 0.4));
    planTable(ctx, GV, { rowA });
    hand(ctx, "Rencana mana yang boleh?", 960, 790, 46, { color: ORANGE, alpha: P(l, at(b, "Rencana mana"), 0.5) });
  }
  function periksa_v(ctx, b, l) {
    board(ctx);
    const h = b.id;
    const k = ["h3", "h4", "h5"].indexOf(h);
    const u = (ph, d = 0.6) => P(l, at(b, ph), d);
    const pairs = { A: [[0, "x", h === "h3" ? u("permen lalu permen") : 1]], B: [[0, "x", h === "h3" ? u("permen lalu mangga") : 1]] };
    const res = { A: ["x", h === "h3" ? u("Keduanya") : 1], B: ["x", h === "h3" ? u("Keduanya") : 1] };
    let frame = null, hl = null;
    if (h === "h3") { const p = u("rencana B") > 0.5 ? "B" : "A"; frame = { row: p, i: 0, n: 2, a: 1 }; hl = p; }
    if (k >= 1) { pairs.D = [[2, "x", h === "h4" ? u("mangga dua hari") : 1]]; res.D = ["x", h === "h4" ? u("melanggar") : 1]; }
    if (h === "h4") { frame = { row: "D", i: 2, n: 2, a: 1 }; hl = "D"; }
    if (h === "h5") { pairs.C = [0, 1, 2, 3].map(i => [i, "v", P(l, 0.3 + i * 0.3, 0.4)]); res.C = ["v", u("tidak melanggar")]; hl = "C"; }
    planTable(ctx, GV, { pairs, res, frame, hl });
    if (h === "h3") hand(ctx, "melanggar aturan 2", 960, 790, 46, { color: RED, alpha: u("aturan kedua") });
    if (h === "h4") hand(ctx, "melanggar aturan 1", 960, 790, 46, { color: RED, alpha: u("aturan pertama") });
    if (h === "h5") { hand(ctx, "Jawaban: C", 960, 795, 56, { color: GREEN, alpha: u("jawabannya") }); ring(ctx, 960, rowY(GV, 2), 490, 82, u("tidak melanggar"), GREEN, 6); }
  }

  Object.assign(K.SCENES, {
    soal, aturan1, aturan2, bingkai, periksa, lebih, sandi, langkah, jawabanC, soal_v, aturan_v, tabel_v, periksa_v,
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
      if (au > 0) ring(ctx, 1200, 300 + 2 * 92 - 14, 230, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
      lala(ctx, 720, 470 + Math.sin(l * 3) * 6, 260, { up: true });
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 520, 810, 50, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Memeriksa rencana dengan aturan, langkah demi langkah", 960, 500, 38, { align: "center", weight: 800, color: ORANGE, fit: 1000 });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
