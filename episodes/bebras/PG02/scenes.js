/* PG02 Pembahasan Soal Bebras 2025-PK-04 "Berang-Berang dan Beruang" (Pakistan), kategori Penegak (SMA).
   Gaya papan tulis putih dengan coretan spidol (sama dengan B01–B03, SG01–SG03) + simulasi:
   batang kayu 7 m yang dipotong (garis potong merah, potongan merenggang), truk, tabel jadwal menit demi menit.
   Warna tetap: Batang 1 hijau, Batang 2 merah muda, Batang 3 biru kehijauan; potongan Beruang oranye, potongan Berang-berang biru.
   Papan: x 52–1868, y 130–830 (kartu narasi 3 baris mulai y≈840, 4 baris y≈783).
   Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F6FD1", GRAY = "#8A96A0";
  const META = { judul: "Berang-Berang dan Beruang", tahun: "2025", negara: "Pakistan", kode: "2025-PK-04" };
  const LOGC = ["#23964F", "#D0457A", "#16808F"], LOGL = ["#DDF2E4", "#FBE3EC", "#DDF1F3"];
  const WHO = { bear: "#E07A12", beaver: "#2F6FD1" };
  const WOOD = "#7A4B2A", WOOD2 = "#4E2E17", WOODEND = "#C99A6B";
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
  const logChip = (ctx, i, cx, cy, size = 28, opt) => chip(ctx, "Batang " + (i + 1), cx, cy, size, LOGC[i], opt);

  // ---------- kayu ----------
  // satu potongan kayu: x kiri, y pusat, w lebar, h tinggi; label angka panjang (meter) di tengah
  function piece(ctx, x, y, w, h, label, opt = {}) {
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    const r = Math.min(h * 0.3, w / 2);
    ctx.fillStyle = WOOD; rr(ctx, x, y - h / 2, w, h, r); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.13)"; rr(ctx, x + 3, y - h / 2 + 4, w - 6, h * 0.22, r * 0.6); ctx.fill();
    ctx.strokeStyle = WOOD2; ctx.lineWidth = Math.max(2, h * 0.05); rr(ctx, x, y - h / 2, w, h, r); ctx.stroke();
    if (opt.end !== false && w > h * 0.5) {   // ujung kayu (lingkar tahun) di kiri
      ctx.fillStyle = WOODEND; ctx.beginPath(); ctx.ellipse(x + h * 0.16, y, h * 0.14, h * 0.42, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#8E6038"; ctx.lineWidth = Math.max(1.5, h * 0.025); ctx.beginPath(); ctx.ellipse(x + h * 0.16, y, h * 0.07, h * 0.22, 0, 0, Math.PI * 2); ctx.stroke();
    }
    if (label != null && opt.label !== false) {
      const s = opt.size || h * 0.56;
      const lx = x + w / 2 + (w > h * 1.2 ? h * 0.08 : 0);
      if (w >= s * 0.9) text(ctx, String(label), lx, y + s * 0.36, s, { align: "center", weight: 900, color: "#FFFFFF" });
    }
    ctx.restore();
  }
  // batang 7 m dengan potongan. cuts: [{pos, u, who}] (u 0..1: 0–0.55 garis potong turun, 0.55–1 potongan merenggang)
  // x kiri, y pusat, ppm = piksel per meter. Mengembalikan posisi x setiap batas (untuk anotasi).
  function logDraw(ctx, x, y, ppm, h, cuts = [], opt = {}) {
    const gap = opt.gap != null ? opt.gap : Math.max(8, h * 0.2), len = opt.len || 7;
    const act = cuts.filter(c => c.u > 0).sort((a, b) => a.pos - b.pos);
    const done = act.filter(c => c.u >= 0.55);
    const sp = c => ease(clamp((c.u - 0.55) / 0.45, 0, 1));
    const bounds = [0, ...done.map(c => c.pos), len];
    const xOf = pos => x + pos * ppm + done.filter(c => c.pos <= pos).reduce((s, c) => s + sp(c) * gap, 0);
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    for (let k = 0; k < bounds.length - 1; k++) {
      const a = bounds[k], z = bounds[k + 1];
      const px = k === 0 ? x : xOf(a), w = (z - a) * ppm;
      piece(ctx, px, y, w, h, opt.labels === false ? null : z - a, { size: opt.size, end: k === 0 || done[k - 1] && sp(done[k - 1]) > 0.3 });
    }
    act.filter(c => c.u < 1).forEach(c => {   // garis potong
      const d = clamp(c.u / 0.55, 0, 1), cx = xOf(c.pos) - (c.u >= 0.55 ? sp(c) * gap / 2 : 0);
      const col = c.who ? WHO[c.who] : RED;
      ctx.save(); ctx.globalAlpha *= c.u >= 0.55 ? 1 - sp(c) : 1;
      mline(ctx, [[cx, y - h / 2 - 16], [cx, y - h / 2 - 16 + (h + 32) * d]], 1, col, 5);
      ctx.restore();
    });
    ctx.restore();
    return xOf;
  }
  // tanda rencana potong (garis putus-putus berwarna) di atas batang utuh
  function planMark(ctx, x, y, ppm, h, pos, who, u) {
    if (u <= 0) return;
    const cx = x + pos * ppm;
    ctx.save(); ctx.globalAlpha *= clamp(u * 1.5, 0, 1); ctx.strokeStyle = WHO[who]; ctx.lineWidth = 6; ctx.setLineDash([10, 7]);
    ctx.beginPath(); ctx.moveTo(cx, y - h / 2 - 18); ctx.lineTo(cx, y + h / 2 + 18); ctx.stroke(); ctx.restore();
  }

  // ---------- tokoh ----------
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
    if (o.saw) chainsaw(ctx, 30, 18, 1);
    ctx.restore();
  }
  function chainsaw(ctx, x, y, k) {   // gergaji mesin merah (satu bilah), dipegang di kanan
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(-0.5);
    ctx.fillStyle = "#AEB6BC"; ctx.strokeStyle = "#5B636B"; ctx.lineWidth = 2; rr(ctx, 14, -6, 46, 12, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#5B636B"; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(18 + i * 6, 6); ctx.lineTo(21 + i * 6, 10); ctx.lineTo(24 + i * 6, 6); ctx.fill(); }
    ctx.fillStyle = "#D9443B"; ctx.strokeStyle = "#8E201C"; rr(ctx, -10, -12, 28, 24, 6); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  function bear(ctx, x, y, s, o = {}) {   // beruang cokelat tua, telinga bulat, moncong terang
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    const F = "#6B4024", F2 = "#A97A52", L = "#2E1C10";
    ctx.strokeStyle = L; ctx.lineWidth = 2.5;
    ctx.fillStyle = F; ctx.beginPath(); ctx.ellipse(0, 28, 40, 34, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = F2; ctx.beginPath(); ctx.ellipse(0, 34, 24, 22, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = F; for (const k of [-1, 1]) { ctx.beginPath(); ctx.ellipse(k * 20, 60, 13, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    for (const k of [-1, 1]) { ctx.fillStyle = F; ctx.beginPath(); ctx.arc(k * 25, -42, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = F2; ctx.beginPath(); ctx.arc(k * 25, -42, 6, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = F; ctx.beginPath(); ctx.arc(0, -14, 33, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#D9B48A"; ctx.beginPath(); ctx.ellipse(0, -1, 16, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1B120C"; ctx.beginPath(); ctx.ellipse(0, -6, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#1B120C"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(0, 4); ctx.moveTo(-6, 6); ctx.quadraticCurveTo(0, 10, 6, 6); ctx.stroke();
    ctx.fillStyle = "#1B120C"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 13, -22, 4.2, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#fff"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 13 + 1.3, -23.4, 1.4, 0, Math.PI * 2); ctx.fill(); }
    if (o.saw) doubleSaw(ctx, 38, 20, 1);
    ctx.restore();
  }
  function doubleSaw(ctx, x, y, k) {   // dua gergaji pada satu pegangan, jarak tetap
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = "#D9443B"; ctx.strokeStyle = "#8E201C"; ctx.lineWidth = 2; rr(ctx, -6, -14, 44, 12, 5); ctx.fill(); ctx.stroke();
    for (const dx of [2, 28]) {
      ctx.fillStyle = "#AEB6BC"; ctx.strokeStyle = "#5B636B"; rr(ctx, dx - 3, -4, 8, 46, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#5B636B"; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(dx + 5, i * 7); ctx.lineTo(dx + 9, i * 7 + 3); ctx.lineTo(dx + 5, i * 7 + 6); ctx.fill(); }
    }
    ctx.restore();
  }
  function truck(ctx, x, y, s, loads = [], opt = {}) {   // x kiri, y dasar roda; s skala (1 = lebar 420)
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
    ctx.fillStyle = "#5B636B"; rr(ctx, 0, -70, 300, 26, 6); ctx.fill();                 // bak
    ctx.fillStyle = "#8C969E"; ctx.fillRect(0, -150, 10, 80); ctx.fillRect(290, -150, 10, 80);
    ctx.fillStyle = "#2F6FA8"; rr(ctx, 305, -150, 110, 106, 14); ctx.fill();             // kabin
    ctx.fillStyle = "#CFE6F5"; rr(ctx, 340, -138, 62, 44, 6); ctx.fill();
    ctx.fillStyle = "#2A3138"; for (const wx of [70, 230, 360]) { ctx.beginPath(); ctx.arc(wx, -30, 30, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#AEB6BC"; ctx.beginPath(); ctx.arc(wx, -30, 11, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#2A3138"; }
    loads.forEach((ld, i) => {   // ikatan potongan kayu satu batang
      if (!ld || ld.a <= 0) return;
      const by = -70 - 24 - i * 30 - (1 - ld.a) * 40;
      ctx.save(); ctx.globalAlpha *= ld.a;
      ctx.fillStyle = WOOD; rr(ctx, 14, by - 12, 272, 24, 8); ctx.fill(); ctx.strokeStyle = WOOD2; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = WOODEND; ctx.beginPath(); ctx.ellipse(22, by, 5, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = ld.color; ctx.fillRect(130, by - 12, 18, 24); ctx.fillRect(200, by - 12, 18, 24);
      ctx.restore();
    });
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

  // ---------- tabel jadwal (Gantt) ----------
  // G = {x, y, lw (lebar kolom label), cw, hh (tinggi kepala), rh (tinggi baris), n}
  // cells[row][m] = {t1, t2, log (indeks batang) | null, kind: "cut"|"load"|"rest", a, x (silang 0..1)}
  function gantt(ctx, G, cells, opt = {}) {
    const { x, y, lw, cw, hh, rh, n } = G, fs = opt.fs || 28;
    for (let m = 0; m < n; m++) {
      const cx = x + lw + m * cw;
      const hl = opt.hl ? opt.hl(m) : 0;
      if (hl > 0) { ctx.save(); ctx.globalAlpha *= hl; ctx.fillStyle = "rgba(242,177,52,0.28)"; rr(ctx, cx + 2, y - 4, cw - 4, hh + rh * 2 + 18, 12); ctx.fill(); ctx.restore(); }
      text(ctx, "Menit " + (m + 1), cx + cw / 2, y + hh * 0.68, fs * 0.95, { align: "center", weight: 900, color: INK });
    }
    const rows = [["Beruang", "bear"], ["Berang-berang", "beaver"]];
    rows.forEach(([nm, who], r) => {
      const ry = y + hh + 6 + r * (rh + 6);
      ctx.fillStyle = "#F3F6F8"; rr(ctx, x, ry, lw - 10, rh, 12); ctx.fill();
      const ic = opt.noIcon ? 0 : Math.min(rh * 0.75, 76);
      if (opt.noIcon) {} else if (who === "bear") bear(ctx, x + ic * 0.62, ry + rh * 0.5, ic * 0.9); else beaver(ctx, x + ic * 0.62, ry + rh * 0.5, ic);
      text(ctx, nm, x + ic * 1.25 + (opt.noIcon ? 14 : 0), ry + rh / 2 + fs * 0.36, fs, { weight: 900, color: WHO[who], fit: lw - ic * 1.25 - 18 });
      for (let m = 0; m < n; m++) {
        const cx = x + lw + m * cw + 4, cell = cells[r] && cells[r][m];
        ctx.strokeStyle = "#D5DCE1"; ctx.lineWidth = 2; ctx.setLineDash([8, 6]); rr(ctx, cx, ry, cw - 8, rh, 12); ctx.stroke(); ctx.setLineDash([]);
        if (!cell || cell.a <= 0) continue;
        ctx.save(); ctx.globalAlpha *= clamp(cell.a, 0, 1);
        const col = cell.log != null ? LOGC[cell.log] : cell.color || GRAY, bg = cell.log != null ? LOGL[cell.log] : cell.bg || "#EEF1F3";
        ctx.fillStyle = bg; ctx.strokeStyle = col; ctx.lineWidth = 4; rr(ctx, cx, ry, cw - 8, rh, 12); ctx.fill(); ctx.stroke();
        const tc = cell.kind === "rest" ? GRAY : INK;
        if (cell.t2) {
          text(ctx, cell.t1, cx + (cw - 8) / 2, ry + rh * 0.44, fs * 0.9, { align: "center", weight: 800, color: tc, fit: cw - 20 });
          text(ctx, cell.t2, cx + (cw - 8) / 2, ry + rh * 0.44 + fs * 1.05, fs * 0.9, { align: "center", weight: 900, color: cell.log != null ? col : tc, fit: cw - 20 });
        } else text(ctx, cell.t1, cx + (cw - 8) / 2, ry + rh / 2 + fs * 0.33, fs * 0.9, { align: "center", weight: 800, color: tc, fit: cw - 20 });
        ctx.restore();
        if (cell.x) cross(ctx, cx + (cw - 8) / 2, ry + rh / 2, rh * 0.8, cell.x, RED, 7);
      }
    });
  }
  const gCell = (G, r, m) => ({ x: G.x + G.lw + m * G.cw + 4, y: G.y + G.hh + 6 + r * (G.rh + 6), w: G.cw - 8, h: G.rh });

  // ---------- jadwal 6 menit ----------
  // tiap menit: bear {log, cuts:[p,q]} atau null; beaver {log, cut} | {load} | null
  const SCHED = [
    { bear: { log: 0, cuts: [3, 4] }, beaver: { log: 2, cut: 6 } },
    { bear: { log: 1, cuts: [2, 3] }, beaver: { load: 0 } },
    { bear: { log: 1, cuts: [5, 6] }, beaver: null },
    { bear: { log: 2, cuts: [2, 3] }, beaver: { load: 1 } },
    { bear: { log: 2, cuts: [4, 5] }, beaver: null },
    { bear: null, beaver: { load: 2 } },
  ];
  const JB = ["j6", "j7", "j8", "j9", "j10", "j11"];
  const PH = {   // frasa pemicu di narasi: [sel Beruang, sel Berang-berang]
    j6: ["Beruang memotong", "Berang-berang memotong"], j7: ["Beruang mulai", "Berang-berang memuat"], j8: ["Beruang memotong", "Berang-berang beristirahat"],
    j9: ["Beruang memotong", "Berang-berang memuat"], j10: ["Beruang memotong", "Berang-berang beristirahat"], j11: ["Sekarang", "Berang-berang memuat"],
  };
  // keadaan pada (beat, l): u per menit untuk Beruang dan Berang-berang (0..1)
  function schedState(b, l) {
    const k = JB.indexOf(b.id), fin = b.id === "j12" || !["jadwal"].includes(b.scene) && k < 0;
    const uB = [], uV = [];
    for (let m = 0; m < 6; m++) {
      if (fin || m < k) { uB.push(1); uV.push(1); continue; }
      if (m > k) { uB.push(0); uV.push(0); continue; }
      const ph = PH[b.id];
      uB.push(P(l, at(b, ph[0]), 1.6)); uV.push(P(l, at(b, ph[1]), 1.6));
    }
    return { uB, uV, k: fin ? 6 : k };
  }
  function schedCells(st) {
    const bearRow = [], beavRow = [];
    SCHED.forEach((s, m) => {
      const a1 = clamp(st.uB[m] * 3, 0, 1), a2 = clamp(st.uV[m] * 3, 0, 1);
      bearRow.push(s.bear ? { t1: "potong", t2: "batang " + (s.bear.log + 1), log: s.bear.log, kind: "cut", a: a1 } : { t1: "istirahat", kind: "rest", a: a1, color: "#B8C2C9" });
      const v = s.beaver;
      beavRow.push(!v ? { t1: "istirahat", kind: "rest", a: a2, color: "#B8C2C9" } : v.load != null ? { t1: "muat", t2: "batang " + (v.load + 1), log: v.load, kind: "load", a: a2 } : { t1: "potong", t2: "batang " + (v.log + 1), log: v.log, kind: "cut", a: a2 });
    });
    return [bearRow, beavRow];
  }
  function logCuts(st) {   // potongan per batang dan muatan
    const cuts = [[], [], []], load = [0, 0, 0];
    SCHED.forEach((s, m) => {
      const ub = clamp((st.uB[m] - 0.15) / 0.85, 0, 1), uv = clamp((st.uV[m] - 0.15) / 0.85, 0, 1);
      if (s.bear) s.bear.cuts.forEach(p => cuts[s.bear.log].push({ pos: p, u: ub, who: "bear" }));
      if (s.beaver && s.beaver.cut != null) cuts[s.beaver.log].push({ pos: s.beaver.cut, u: uv, who: "beaver" });
      if (s.beaver && s.beaver.load != null) load[s.beaver.load] = uv;
    });
    return { cuts, load };
  }

  // ---------- soal ----------
  function soal(ctx, b, l) {
    board(ctx);
    const ord = prog(["soal1", "soal2", "soal3"], b);
    // baris atas: batang 7 m → dipotong → dimuat
    const a0 = ord("soal1", () => P(l, 0.2, 0.6));
    alpha(ctx, a0, () => {
      logDraw(ctx, 330, 215, 60, 46, []);
      hand(ctx, "7 meter", 540, 178, 30, { color: INK });
      arrow(ctx, 790, 215, 900, 215, ord("soal1", () => P(l, at(b, "memotong"), 0.6)), ORANGE, 5);
      hand(ctx, "dipotong", 845, 190, 26, { alpha: ord("soal1", () => P(l, at(b, "memotong"), 0.6)) });
      alpha(ctx, ord("soal1", () => P(l, at(b, "memotong"), 0.6)), () => logDraw(ctx, 925, 215, 60, 46, [{ pos: 2, u: 1 }, { pos: 3, u: 1 }], { labels: false }));
      const ld = ord("soal1", () => P(l, at(b, "dimuat"), 0.6));
      arrow(ctx, 1385, 215, 1490, 215, ld, ORANGE, 5); hand(ctx, "dimuat", 1437, 190, 26, { alpha: ld });
      truck(ctx, 1510, 270, 0.62, [{ a: ld, color: WOOD }], { alpha: ld });
    });
    // Berang-berang
    const a1 = ord("soal2", () => P(l, 0.2, 0.6));
    alpha(ctx, a1, () => {
      ctx.fillStyle = "#F7F9FA"; rr(ctx, 80, 300, 1760, 200, 18); ctx.fill();
      beaver(ctx, 190, 395, 120, { saw: true }); text(ctx, "Berang-berang", 190, 485, 26, { align: "center", weight: 900, color: WHO.beaver });
      hand(ctx, "1 gergaji", 450, 350, 30, { color: WHO.beaver, alpha: ord("soal2", () => P(l, at(b, "satu gergaji"), 0.5)) });
      const ex = ord("soal2", () => P(l, at(b, "Misalnya"), 0.5));
      alpha(ctx, ex, () => {
        logDraw(ctx, 340, 420, 62, 50, []);
        arrow(ctx, 805, 420, 905, 420, 1, INK, 5);
        logDraw(ctx, 930, 420, 62, 50, [{ pos: 1, u: ord("soal2", () => P(l, at(b, "dipotong menjadi"), 1.4)), who: "beaver" }]);
      });
      const nt = ord("soal2", () => P(l, at(b, "satu potongan"), 0.6));
      hand(ctx, "1 potongan dalam 1 menit", 1640, 430, 32, { color: WHO.beaver, alpha: nt });
    });
    // Beruang
    const a2 = ord("soal3", () => P(l, 0.2, 0.6));
    alpha(ctx, a2, () => {
      ctx.fillStyle = "#F7F9FA"; rr(ctx, 80, 520, 1760, 230, 18); ctx.fill();
      bear(ctx, 190, 625, 110, { saw: true }); text(ctx, "Beruang", 190, 728, 26, { align: "center", weight: 900, color: WHO.bear });
      hand(ctx, "2 gergaji, berjarak 1 meter", 560, 572, 30, { color: WHO.bear, alpha: ord("soal3", () => P(l, at(b, "dua gergaji"), 0.5)) });
      const ex = ord("soal3", () => P(l, at(b, "Misalnya"), 0.5));
      alpha(ctx, ex, () => {
        logDraw(ctx, 340, 660, 62, 50, []);
        arrow(ctx, 805, 660, 905, 660, 1, INK, 5);
        const u = ord("soal3", () => P(l, at(b, "dipotong menjadi"), 1.4));
        const xOf = logDraw(ctx, 930, 660, 62, 50, [{ pos: 2, u, who: "bear" }, { pos: 3, u, who: "bear" }]);
        if (u >= 1) { const x0 = xOf(2), x1 = xOf(3); mline(ctx, [[x0 - 4, 612], [x0 - 4, 600], [x1 - 4, 600], [x1 - 4, 612]], 1, WHO.bear, 4); hand(ctx, "1 m", (x0 + x1) / 2 - 4, 590, 24, { color: WHO.bear }); }
      });
      hand(ctx, "2 potongan sekaligus", 1640, 650, 32, { color: WHO.bear, alpha: ord("soal3", () => P(l, at(b, "dua potongan"), 0.6)) });
      hand(ctx, "dalam 1 menit", 1640, 692, 32, { color: WHO.bear, alpha: ord("soal3", () => P(l, at(b, "dua potongan"), 0.6)) });
    });
  }
  function aturan_soal(ctx, b, l) {
    board(ctx);
    const ord = prog(["soal4", "soal5"], b);
    // kiri: kayu berbeda boleh, kayu sama tidak
    card(ctx, 80, 150, 860, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    const a = ord("soal4", () => P(l, at(b, "kayu yang berbeda"), 0.6));
    alpha(ctx, a, () => {
      text(ctx, "Kayu berbeda, bersamaan", 110, 205, 32, { weight: 900, color: GREEN });
      beaver(ctx, 160, 290, 80, { saw: true }); logDraw(ctx, 230, 290, 56, 38, [], { labels: false });
      bear(ctx, 160, 395, 76, { saw: true }); logDraw(ctx, 230, 395, 56, 38, [], { labels: false });
      tick(ctx, 760, 340, 80, P(l, at(b, "saat yang sama") + 0.3, 0.6), GREEN, 10);
      hand(ctx, "boleh", 860, 350, 34, { color: GREEN, alpha: P(l, at(b, "saat yang sama") + 0.3, 0.6) });
    });
    const c = ord("soal4", () => P(l, at(b, "tidak boleh"), 0.6));
    alpha(ctx, c, () => {
      text(ctx, "Kayu yang sama, bersamaan", 110, 500, 32, { weight: 900, color: RED });
      beaver(ctx, 160, 600, 80, { saw: true }); logDraw(ctx, 230, 600, 56, 38, [], { labels: false }); bear(ctx, 690, 590, 76, { saw: true });
      cross(ctx, 760, 600, 80, P(l, at(b, "tidak boleh") + 0.6, 0.6), RED, 10);
      hand(ctx, "tidak boleh", 840, 680, 30, { color: RED, alpha: P(l, at(b, "tidak boleh") + 0.6, 0.6) });
    });
    hand(ctx, "1 kali potong = 1 menit", 510, 735, 32, { color: INK, alpha: ord("soal4", () => P(l, at(b, "Setiap kali"), 0.6)) });
    // kanan: memuat
    const m = ord("soal5", () => P(l, 0.2, 0.6));
    alpha(ctx, m, () => {
      card(ctx, 980, 150, 860, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
      text(ctx, "Memuat ke truk", 1010, 205, 32, { weight: 900, color: INK });
      logDraw(ctx, 1010, 280, 52, 38, [{ pos: 2, u: 1 }, { pos: 3, u: 1 }, { pos: 5, u: 1 }]);
      hand(ctx, "semua potongan satu batang", 1210, 340, 26, { color: INK });
      const mv = ord("soal5", () => P(l, at(b, "Memuat satu batang"), 1.0));
      beaver(ctx, 1500, 290, 80);
      arrow(ctx, 1430, 360, 1430, 420, mv, ORANGE, 5);
      truck(ctx, 1170, 600, 0.95, [{ a: mv, color: WOOD }]);
      hand(ctx, "muat 1 batang = 1 menit", 1410, 650, 34, { color: WHO.beaver, alpha: mv });
      const nb = ord("soal5", () => P(l, at(b, "Beruang tidak"), 0.6));
      alpha(ctx, nb, () => { bear(ctx, 1080, 700, 60); cross(ctx, 1080, 700, 70, nb, RED, 7); hand(ctx, "Beruang tidak memuat", 1410, 712, 28, { color: RED }); });
    });
  }
  function pesanan(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["tiga batang", "sembilan potongan", "tiga potongan", "dua potongan"]);
    const a0 = P(l, T[0], 0.6);
    alpha(ctx, a0, () => {
      text(ctx, "DITERIMA", 110, 200, 30, { weight: 900, color: C.accentDark });
      for (let i = 0; i < 3; i++) logDraw(ctx, 110, 280 + i * 120, 66, 52, []);
      hand(ctx, "3 batang × 7 meter", 340, 680, 36, { color: INK });
    });
    arrow(ctx, 620, 450, 740, 450, P(l, T[1] - 0.4, 0.6), ORANGE, 6);
    alpha(ctx, P(l, T[1] - 0.4, 0.6), () => {
      card(ctx, 770, 160, 1070, 580, { fill: "#FFF8EE", stroke: ORANGE, lw: 4, r: 18 });
      text(ctx, "PESANAN", 800, 215, 32, { weight: 900, color: C.accentDark });
    });
    const rows = [[9, 1, 290], [3, 2, 450], [2, 3, 610]];
    rows.forEach(([n, len, y], r) => {
      const a = P(l, T[1 + r], 0.6); if (a <= 0) return;
      alpha(ctx, a, () => {
        const ppm = 62, g = 12; for (let i = 0; i < n; i++) { const w = len * ppm; piece(ctx, 800 + i * (w + g), y, w, 50, len); }
        text(ctx, n + " potongan " + len + " meter", 1820, y + 70, 30, { align: "right", weight: 900, color: INK });
      });
    });
  }

  // ---------- pilihan ----------
  const OPTS = [5, 6, 7, 8];
  function optCard(ctx, i, x, y, w, h, st = {}, fs = 64) {
    ctx.save(); if (st.dim) ctx.globalAlpha *= 1 - 0.55 * st.dim;
    card(ctx, x, y, w, h, { fill: st.good ? "#E8F6EC" : "#F7F9FA", stroke: st.good ? GREEN : "#C9D2D8", lw: st.good ? 6 : 3, r: 20 });
    ctx.strokeStyle = st.good ? GREEN : "#9AA6AE"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x + h * 0.32, y + h / 2, h * 0.13, 0, Math.PI * 2); ctx.stroke();
    if (st.good) { ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x + h * 0.32, y + h / 2, h * 0.07, 0, Math.PI * 2); ctx.fill(); }
    text(ctx, OPTS[i] + " menit", x + h * 0.55, y + h / 2 + fs * 0.36, fs, { weight: 900, color: INK });
    ctx.restore();
    const bx = x + w - 6, by = y + 6, br = h * 0.24;
    if (st.strike || st.tick) { ctx.save(); ctx.globalAlpha *= clamp((st.strike || st.tick) * 3, 0, 1); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = st.tick ? GREEN : RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore(); }
    if (st.strike) cross(ctx, bx, by, br * 1.5, st.strike, RED, 8);
    if (st.tick) tick(ctx, bx, by + 2, br * 1.4, st.tick, GREEN, 8);
    if (st.ring) ring(ctx, x + w / 2, y + h / 2, w / 2 + 22, h * 0.72, st.ring, GREEN, 7);
  }
  function pilihan(ctx, b, l) {
    board(ctx);
    text(ctx, "Berapa waktu paling sedikit untuk memotong dan memuat semua kayu?", 960, 215, 42, { align: "center", weight: 900, color: INK, fit: 1700 });
    const ord = prog(["p1", "p2", "p3", "p4"], b);
    const isP = b.id[0] === "p";
    const X = i => 120 + i * 430, Y = 290, W = 390, Hc = 170;
    const st = [{}, {}, {}, {}];
    if (isP) {
      const s5 = ord("p1", () => P(l, at(b, "Lima menit tidak"), 0.6));
      st[0] = { strike: s5, dim: s5 };
      const t6 = ord("p2", () => P(l, at(b, "Enam menit"), 0.6));
      st[1] = { tick: t6, good: ord("p3", () => P(l, at(b, "enam menit."), 0.4)) > 0.5, ring: ord("p3", () => P(l, at(b, "enam menit."), 0.8)) };
      const d78 = ord("p2", () => P(l, at(b, "bukan waktu"), 0.6));
      st[2] = { dim: d78 }; st[3] = { dim: d78 };
    }
    for (let i = 0; i < 4; i++) {
      const a = b.id === "soal7" ? P(l, at(b, "Pilihannya") + i * 0.5, 0.5) : 1;
      alpha(ctx, a, () => optCard(ctx, i, X(i), Y, W, Hc, st[i]));
    }
    if (!isP) { if (b.id === "soal8") kiko(ctx, 960, 650, 150, 0, { mood: "happy", wave: l }); return; }
    const n1 = ord("p1", () => P(l, at(b, "karena"), 0.6));
    hand(ctx, "paling banyak 10", X(0) + W / 2, 530, 30, { color: RED, alpha: n1 }); hand(ctx, "potongan berguna", X(0) + W / 2, 568, 30, { color: RED, alpha: n1 });
    const n2 = ord("p2", () => P(l, at(b, "sudah menyusun"), 0.6));
    hand(ctx, "ada jadwalnya", X(1) + W / 2, 530, 30, { color: GREEN, alpha: n2 });
    const n3 = ord("p2", () => P(l, at(b, "Tujuh menit"), 0.6));
    hand(ctx, "bisa, tetapi", (X(2) + X(3) + W) / 2, 530, 30, { color: GRAY, alpha: n3 }); hand(ctx, "bukan yang paling sedikit", (X(2) + X(3) + W) / 2, 568, 30, { color: GRAY, alpha: n3 });
    if (b.id === "p4") {
      const T = atSeq(b, ["Pertama", "Kedua"]);
      [["BUKTI", "5 menit pasti tidak cukup", RED, 120], ["CONTOH", "jadwal nyata 6 menit", GREEN, 980]].forEach(([h, s, col, x], i) => {
        alpha(ctx, P(l, T[i], 0.6), () => {
          card(ctx, x, 620, 820, 130, { fill: "#FFFFFF", stroke: col, lw: 4, r: 18 });
          text(ctx, h, x + 30, 668, 26, { weight: 900, color: col });
          text(ctx, s, x + 30, 722, 40, { weight: 900, color: INK, fit: 760 });
        });
      });
    }
  }

  // ---------- aturan ----------
  function aturan(ctx, b, l) {
    board(ctx);
    const ord = prog(["a1", "a2", "a3", "a4", "a5"], b);
    hand(ctx, "1 pekerjaan = 1 menit", 960, 200, 52, { color: ORANGE, alpha: ord("a1", () => P(l, at(b, "Setiap pekerjaan"), 0.6)) });
    // kartu Berang-berang
    alpha(ctx, ord("a2", () => P(l, 0.2, 0.6)), () => {
      card(ctx, 80, 235, 860, 330, { fill: "#F2F7FD", stroke: WHO.beaver, lw: 4, r: 18 });
      beaver(ctx, 170, 330, 110, { saw: true });
      text(ctx, "Berang-berang", 260, 300, 38, { weight: 900, color: WHO.beaver });
      text(ctx, "setiap menit, pilih satu:", 260, 345, 28, { weight: 700, color: C.ink2 });
      const u1 = ord("a2", () => P(l, at(b, "Ia memotong"), 0.5)), u2 = ord("a2", () => P(l, at(b, "ia memuat"), 0.5));
      alpha(ctx, u1, () => { logDraw(ctx, 130, 455, 36, 34, [{ pos: 3, u: 1, who: "beaver" }], { labels: false }); text(ctx, "potong 1 kali", 130, 530, 30, { weight: 900, color: INK }); });
      hand(ctx, "ATAU", 490, 470, 36, { alpha: u2 });
      alpha(ctx, u2, () => { truck(ctx, 620, 485, 0.5, [{ a: 1, color: WOOD }]); text(ctx, "muat 1 batang", 600, 530, 30, { weight: 900, color: INK }); });
    });
    // kartu Beruang
    alpha(ctx, ord("a3", () => P(l, 0.2, 0.6)), () => {
      card(ctx, 980, 235, 860, 330, { fill: "#FEF4EA", stroke: WHO.bear, lw: 4, r: 18 });
      bear(ctx, 1070, 330, 100, { saw: true });
      text(ctx, "Beruang", 1160, 300, 38, { weight: 900, color: WHO.bear });
      text(ctx, "hanya memotong", 1160, 345, 28, { weight: 700, color: C.ink2 });
      const u = ord("a3", () => P(l, at(b, "kedua gergajinya"), 1.2));
      const xOf = logDraw(ctx, 1030, 455, 52, 40, [{ pos: 3, u, who: "bear" }, { pos: 4, u, who: "bear" }], { labels: u >= 1 });
      text(ctx, "potong 2 kali sekaligus", 1030, 530, 30, { weight: 900, color: INK });
      const one = ord("a3", () => P(l, at(b, "terbentuk"), 0.6));
      alpha(ctx, one, () => { const x0 = xOf(3), x1 = xOf(4); ring(ctx, (x0 + x1) / 2 - 6, 455, 40, 36, one, ORANGE, 5); hand(ctx, "selalu ada potongan 1 m", 1620, 470, 28, { color: WHO.bear }); });
    });
    // aturan tambahan / catatan muat
    if (b.id === "a4" || (ord("a4") && b.id !== "a5")) {
      const T = atSeq(b, ["Sebatang", "Selain itu"]);
      [["1", "Batang baru boleh dimuat setelah semua potongannya selesai."], ["2", "Tidak boleh berdua di batang yang sama pada menit yang sama."]].forEach(([n, s], i) => {
        alpha(ctx, P(l, T[i], 0.6), () => {
          const y = 625 + i * 72;
          ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(120, y - 12, 26, 0, Math.PI * 2); ctx.fill();
          text(ctx, n, 120, y, 32, { align: "center", weight: 900, color: "#fff" });
          text(ctx, s, 165, y, 36, { weight: 800, color: INK, fit: 1660 });
        });
      });
    }
    if (b.id === "a5") {
      const T = atSeq(b, ["Memuat satu batang", "Kalau setiap", "Padahal"]);
      alpha(ctx, P(l, T[0], 0.6), () => {
        card(ctx, 80, 590, 1000, 160, { fill: "#F2F7FD", stroke: WHO.beaver, lw: 3, r: 18 });
        text(ctx, "Muat 1 batang = semua potongannya", 110, 650, 36, { weight: 900, color: INK, fit: 940 });
        text(ctx, "sekaligus, dalam 1 menit", 110, 705, 36, { weight: 900, color: WHO.beaver });
      });
      const u = P(l, T[1], 0.6);
      hand(ctx, "1 menit per potongan?", 1460, 640, 36, { color: GRAY, alpha: u });
      hand(ctx, "14 potongan = 14 menit", 1460, 690, 36, { color: GRAY, alpha: u });
      const v = P(l, T[2], 0.6);
      strike(ctx, 1240, 1680, 676, v); hand(ctx, "pilihan paling lama 8 menit", 1460, 740, 30, { color: RED, alpha: v });
    }
  }

  // ---------- pemanasan: kue bolu gulung ----------
  function cake(ctx, x, y, len, h, cuts, opt = {}) {   // bolu gulung: x kiri, y pusat; cuts = posisi 0..1 dengan u
    const gap = opt.gap || 16, act = cuts.filter(c => c.u > 0).sort((a, b) => a.pos - b.pos);
    const sp = c => ease(clamp((c.u - 0.5) / 0.5, 0, 1));
    const bounds = [0, ...act.filter(c => c.u >= 0.5).map(c => c.pos), 1], done = act.filter(c => c.u >= 0.5);
    const xOf = p => x + p * len + done.filter(c => c.pos <= p).reduce((s, c) => s + sp(c) * gap, 0);
    for (let k = 0; k < bounds.length - 1; k++) {
      const px = k === 0 ? x : xOf(bounds[k]), w = (bounds[k + 1] - bounds[k]) * len;
      ctx.fillStyle = "#F2C46D"; rr(ctx, px, y - h / 2, w, h, Math.min(16, w / 2)); ctx.fill();
      ctx.fillStyle = "#C9853A"; rr(ctx, px, y - h / 2, w, h * 0.16, Math.min(8, w / 2)); ctx.fill();
      ctx.strokeStyle = "#A8692A"; ctx.lineWidth = 3; rr(ctx, px, y - h / 2, w, h, Math.min(16, w / 2)); ctx.stroke();
    }
    act.filter(c => c.u < 1).forEach(c => {
      const d = clamp(c.u / 0.5, 0, 1), cx = xOf(c.pos) - (c.u >= 0.5 ? sp(c) * gap / 2 : 0);
      ctx.save(); ctx.globalAlpha *= c.u >= 0.5 ? 1 - sp(c) : 1; mline(ctx, [[cx, y - h / 2 - 14], [cx, y - h / 2 - 14 + (h + 28) * d]], 1, RED, 5); ctx.restore();
    });
  }
  function bolu(ctx, b, l) {
    board(ctx);
    const ord = prog(["w1", "w2", "w3", "w4"], b);
    if (b.id !== "w4") {
      const rows = [[1, "w1", "memotongnya satu kali"], [2, "w2", "dipotong dua kali"], [3, "w2", "dipotong tiga kali"]];
      rows.forEach(([n, id, ph], r) => {
        const y = 230 + r * 125, a = ord(id, () => P(l, at(b, ph) - 0.3, 0.5)); if (a <= 0) return;
        alpha(ctx, a, () => {
          const cuts = []; for (let k = 1; k <= n; k++) cuts.push({ pos: k / (n + 1), u: ord(id, () => P(l, at(b, ph) + 0.2 + k * 0.25, 0.8)) });
          cake(ctx, 140, y, 620, 80, cuts);
          text(ctx, n + " kali potong", 900, y + 14, 40, { weight: 900, color: RED });
          arrow(ctx, 1170, y, 1270, y, 1, INK, 5);
          const ans = r === 0 ? ord("w2", () => P(l, at(b, "Benar"), 0.5)) : 1;
          if (r === 0 && ans <= 0 && b.id === "w1") text(ctx, "? bagian", 1300, y + 14, 40, { weight: 900, color: GRAY });
          else text(ctx, (n + 1) + " bagian", 1300, y + 14, 40, { weight: 900, color: GREEN, alpha: 1 });
        });
      });
      if (b.id === "w1") kiko(ctx, 1680, 600, 150, 0, { mood: "happy" });
      if (b.id === "w3") {
        const T = atSeq(b, ["bertambah satu", "tujuh bagian"]);
        hand(ctx, "bagian = potong + 1", 960, 640, 52, { alpha: P(l, T[0], 0.6) });
        alpha(ctx, P(l, T[1], 0.6), () => {
          ctx.fillStyle = "rgba(255,255,255,0.94)"; rr(ctx, 90, 660, 1740, 110, 16); ctx.fill();
          const cuts = []; for (let k = 1; k <= 6; k++) cuts.push({ pos: k / 7, u: P(l, T[1] + 0.6 + k * 0.2, 0.7) });
          cake(ctx, 140, 715, 820, 70, cuts, { gap: 12 });
          hand(ctx, "7 bagian = 6 kali potong", 1440, 732, 40, { color: GREEN });
        });
      }
      return;
    }
    // w4: tiga kue utuh menjadi sepuluh bagian
    const T = atSeq(b, ["Tiga kue utuh", "sepuluh bagian", "tujuh kali"]);
    const plan = [[1 / 4, 2 / 4, 3 / 4], [1 / 3, 2 / 3], [1 / 3, 2 / 3]];
    let k = 0;
    plan.forEach((ps, r) => {
      const y = 230 + r * 130;
      const cuts = ps.map(p => ({ pos: p, u: P(l, T[1] + 0.4 + (k++) * 0.35, 0.7) }));
      cake(ctx, 140, y, 620, 80, cuts);
      alpha(ctx, P(l, T[0], 0.5), () => text(ctx, "kue " + (r + 1), 110, y - 52, 26, { weight: 800, color: C.ink2 }));
    });
    hand(ctx, "3 kue utuh = 3 bagian", 1350, 260, 44, { color: INK, alpha: P(l, T[0], 0.6) });
    hand(ctx, "ingin 10 bagian", 1350, 360, 44, { color: INK, alpha: P(l, T[1], 0.6) });
    hand(ctx, "10 − 3 = 7 kali potong", 1350, 470, 54, { color: ORANGE, alpha: P(l, T[2], 0.6) });
    const tot = P(l, T[2] + 0.8, 0.6);
    hand(ctx, "4 + 3 + 3 = 10 bagian", 1350, 570, 40, { color: GREEN, alpha: tot });
  }

  // ---------- menghitung pekerjaan ----------
  function hitung(ctx, b, l) {
    board(ctx);
    const ord = prog(["h1", "h2", "h3", "h4", "h5", "h6"], b);
    text(ctx, "PANJANG", 110, 195, 28, { weight: 900, color: C.accentDark });
    const T1 = b.id === "h1" ? atSeq(b, ["Sembilan potongan", "Tiga potongan", "dua potongan"]) : [0, 0, 0];
    [[9, 1, 9], [3, 2, 6], [2, 3, 6]].forEach(([n, len, tot], r) => {
      const y = 265 + r * 95, a = ord("h1", () => P(l, T1[r], 0.6));
      alpha(ctx, a, () => {
        piece(ctx, 110, y, len * 56, 46, len);
        text(ctx, n + " × " + len + " m = " + tot + " m", 330, y + 15, 42, { weight: 900, color: INK });
      });
    });
    const a2 = ord("h2", () => P(l, at(b, "Jumlahnya"), 0.6));
    alpha(ctx, a2, () => { ctx.fillStyle = INK; ctx.fillRect(110, 525, 720, 5); text(ctx, "Jumlah: 21 m", 330, 580, 42, { weight: 900, color: INK }); });
    const a3 = ord("h2", () => P(l, at(b, "Tiga batang"), 0.6));
    alpha(ctx, a3, () => { text(ctx, "3 batang × 7 m = 21 m", 330, 650, 42, { weight: 900, color: GREEN }); tick(ctx, 840, 635, 60, a3, GREEN, 9); });
    hand(ctx, "tidak ada sisa", 480, 720, 34, { color: GREEN, alpha: ord("h2", () => P(l, at(b, "tidak ada"), 0.6)) });
    // kanan
    ctx.fillStyle = "#E3E8EC"; ctx.fillRect(960, 170, 4, 580);
    alpha(ctx, ord("h3", () => P(l, 0.2, 0.5)), () => text(ctx, "BANYAK POTONGAN", 1010, 195, 28, { weight: 900, color: C.accentDark }));
    alpha(ctx, ord("h3", () => P(l, at(b, "Sembilan ditambah"), 0.6)), () => text(ctx, "9 + 3 + 2 = 14 potongan", 1010, 270, 46, { weight: 900, color: INK }));
    const T4 = b.id === "h4" ? atSeq(b, ["tiga batang", "empat belas potongan", "sebelas kali"]) : [0, 0, 0];
    alpha(ctx, ord("h4", () => P(l, T4[0], 0.6)), () => text(ctx, "mulai dari 3 batang utuh", 1010, 345, 36, { weight: 800, color: C.ink2 }));
    alpha(ctx, ord("h4", () => P(l, T4[2], 0.6)), () => { text(ctx, "14 − 3 = 11 kali potong", 1010, 420, 46, { weight: 900, color: RED }); });
    alpha(ctx, ord("h5", () => P(l, 0.2, 0.5)), () => text(ctx, "MEMUAT", 1010, 500, 28, { weight: 900, color: C.accentDark }));
    alpha(ctx, ord("h5", () => P(l, at(b, "harus memuat"), 0.6)), () => text(ctx, "3 batang = 3 kali muat", 1010, 570, 46, { weight: 900, color: WHO.beaver }));
    alpha(ctx, ord("h5", () => P(l, at(b, "tiga menit"), 0.6)), () => text(ctx, "memakai 3 menit Berang-berang", 1010, 625, 34, { weight: 800, color: C.ink2 }));
    const s = ord("h6", () => P(l, 0.3, 0.6));
    alpha(ctx, s, () => {
      card(ctx, 990, 660, 840, 100, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
      text(ctx, "Pekerjaan: 11 kali potong + 3 kali muat", 1410, 725, 38, { align: "center", weight: 900, color: INK, fit: 800 });
    });
  }

  // ---------- batas bawah: 5 menit ----------
  const GB = { x: 80, y: 150, lw: 320, cw: 240, hh: 50, rh: 96, n: 5 };
  function batasCells(b, l, ord) {
    const naive = ord("b2", () => 1);
    const T = b.id === "b2" ? atSeq(b, ["Beruang membuat", "Berang-berang memakai", "dua menit untuk"]) : [0, 0, 0];
    const cut5 = ord("b4", () => P(l, at(b, "Jadi, waktunya"), 0.6));
    const bearRow = [], beavRow = [];
    for (let m = 0; m < 5; m++) {
      const a = b.id === "b2" ? P(l, T[0] + m * 0.3, 0.4) : naive;
      bearRow.push({ t1: "2 potongan", kind: "cut", a, color: WHO.bear, bg: "#FEF1E4", x: m === 4 ? cut5 : 0 });
      const av = b.id === "b2" ? (m >= 2 ? P(l, T[1] + (m - 2) * 0.3, 0.4) : P(l, T[2] + m * 0.3, 0.4)) : naive;
      beavRow.push(m >= 2 ? { t1: "muat", kind: "load", a: av, color: WHO.beaver, bg: "#E9F1FC" } : { t1: "1 potongan", kind: "cut", a: av, color: WHO.beaver, bg: "#E9F1FC" });
    }
    return [bearRow, beavRow];
  }
  function batas(ctx, b, l) {
    board(ctx);
    const ord = prog(["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"], b);
    const hl = ord("b3", () => P(l, at(b, "menit kelima"), 0.6)) * (b.id === "b3" || b.id === "b4" ? 1 : 0);
    gantt(ctx, GB, batasCells(b, l, ord), { hl: m => m === 4 ? hl : 0 });
    const rx = GB.x + GB.lw + 5 * GB.cw + 20, c0 = gCell(GB, 0, 0), c1 = gCell(GB, 1, 0);
    // jumlah per baris
    const n5 = ord("b5", () => P(l, at(b, "dua kali empat"), 0.6)), hideT = b.id === "b4" ? 0 : 1;
    alpha(ctx, ord("b2", () => P(l, at(b, "sepuluh potongan"), 0.5)) * (1 - n5) * hideT, () => text(ctx, "= 10", rx, c0.y + 62, 46, { weight: 900, color: WHO.bear }));
    alpha(ctx, n5, () => text(ctx, "= 8", rx, c0.y + 62, 46, { weight: 900, color: WHO.bear }));
    alpha(ctx, ord("b2", () => P(l, at(b, "dua potongan"), 0.5)) * hideT, () => text(ctx, "= 2", rx, c1.y + 62, 46, { weight: 900, color: WHO.beaver }));
    if (b.id === "b1") { thinkBadge(ctx, 420, 520, 1080, 150, l, b.dur, "Bisakah 11 potongan + 3 muatan selesai dalam 5 menit?"); return; }
    // hitungan sekilas
    const nv = ord("b2", () => P(l, at(b, "Jumlahnya"), 0.6));
    const struck = ord("b4", () => P(l, at(b, "Jadi, waktunya"), 0.6));
    alpha(ctx, nv, () => {
      text(ctx, "Hitungan sekilas:", 110, 520, 34, { weight: 800, color: C.ink2 });
      text(ctx, "10 + 2 = 12 potongan, cukup?", 420, 520, 40, { weight: 900, color: struck > 0 ? GRAY : INK });
    });
    strike(ctx, 410, 1010, 507, struck);
    // penjelasan menit 5
    if (b.id === "b4") {
      const c = gCell(GB, 0, 4), g = gCell(GB, 1, 5), u = P(l, at(b, "Batang itu masih"), 0.8);
      alpha(ctx, u, () => {
        text(ctx, "Menit 6?", g.x + g.w / 2, GB.y + GB.hh * 0.68, 27, { align: "center", weight: 900, color: RED });
        ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.setLineDash([10, 7]); rr(ctx, g.x, g.y, g.w, g.h, 12); ctx.stroke(); ctx.setLineDash([]);
        text(ctx, "muat", g.x + g.w / 2, g.y + 40, 26, { align: "center", weight: 800, color: RED });
        text(ctx, "batang itu", g.x + g.w / 2, g.y + 72, 26, { align: "center", weight: 900, color: RED });
      });
      arrow(ctx, c.x + c.w - 30, c.y + c.h - 10, g.x + 30, g.y + 14, u, RED, 5);
      alpha(ctx, P(l, at(b, "baru selesai"), 0.6), () => text(ctx, "Batang yang dipotong di menit 5 baru bisa dimuat di menit 6.", 110, 595, 36, { weight: 800, color: RED, fit: 1500 }));
    }
    const L1 = ord("b5", () => P(l, at(b, "sampai menit keempat"), 0.6));
    alpha(ctx, L1, () => text(ctx, "Beruang berguna sampai menit 4:  2 × 4 = 8", 110, 595, 38, { weight: 900, color: WHO.bear, fit: 1300 }));
    const L2 = ord("b6", () => P(l, at(b, "Delapan ditambah"), 0.6));
    alpha(ctx, ord("b6", () => P(l, at(b, "dua potongan"), 0.6)), () => text(ctx, "Berang-berang: 5 − 3 muat = 2 potongan", 110, 660, 38, { weight: 900, color: WHO.beaver, fit: 1000 }));
    alpha(ctx, L2, () => { text(ctx, "8 + 2 = 10 < 11", 1180, 660, 50, { weight: 900, color: RED }); });
    cross(ctx, 1640, 645, 70, ord("b6", () => P(l, at(b, "Padahal"), 0.6)), RED, 9);
    const L3 = ord("b7", () => P(l, at(b, "lima menit pasti"), 0.6));
    alpha(ctx, L3, () => {
      card(ctx, 100, 690, 1720, 80, { fill: "#FFF8E8", stroke: C.accent, lw: 3, r: 16 });
      text(ctx, "5 menit pasti tidak cukup  →  paling sedikit 6 menit", 960, 745, 40, { align: "center", weight: 900, color: INK });
    });
    if (b.id === "b8") { alpha(ctx, P(l, 0.3, 0.6), () => { ctx.fillStyle = "#FFFFFF"; rr(ctx, 60, 470, 1790, 215, 16); ctx.fill(); hand(ctx, "Apakah 6 menit benar-benar cukup?", 860, 600, 56, { color: ORANGE }); kiko(ctx, 1640, 590, 110, 0, { mood: "happy" }); }); }
  }

  // ---------- rencana potong ----------
  const PLAN = [
    { bear: [[3, 4]], beaver: [] },
    { bear: [[2, 3], [5, 6]], beaver: [] },
    { bear: [[2, 3], [4, 5]], beaver: [6] },
  ];
  function rencana(ctx, b, l) {
    board(ctx);
    const ord = prog(["j1", "j2", "j3", "j4", "j5"], b);
    const X = 340, ppm = 150, Hh = 64, Ys = [290, 455, 620];
    // keterangan warna
    alpha(ctx, ord("j2", () => P(l, at(b, "Beruang"), 0.6)), () => {
      ctx.strokeStyle = WHO.bear; ctx.lineWidth = 6; ctx.setLineDash([10, 7]); ctx.beginPath(); ctx.moveTo(360, 160); ctx.lineTo(360, 205); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "potong Beruang (dua sekaligus)", 380, 197, 30, { weight: 800, color: WHO.bear });
    });
    alpha(ctx, ord("j4", () => P(l, at(b, "Berang-berang memotongnya"), 0.6)), () => {
      ctx.strokeStyle = WHO.beaver; ctx.lineWidth = 6; ctx.setLineDash([10, 7]); ctx.beginPath(); ctx.moveTo(1030, 160); ctx.lineTo(1030, 205); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "potong Berang-berang", 1050, 197, 30, { weight: 800, color: WHO.beaver });
    });
    const ids = ["j2", "j3", "j4"];
    PLAN.forEach((p, i) => {
      const y = Ys[i], a = ord("j1", () => P(l, at(b, ["batang satu", "batang dua", "batang tiga"][i]), 0.5));
      if (a <= 0) return;
      alpha(ctx, a, () => {
        logChip(ctx, i, 190, y, 28);
        const mk = ord(ids[i], () => P(l, at(b, i === 2 ? "Beruang memotongnya" : "Beruang"), 0.6));
        const mkV = ord(ids[i], () => P(l, at(b, "Berang-berang memotongnya"), 0.6));
        const sp = ord(ids[i], () => P(l, at(b, "dipotong menjadi") + 0.4, 1.2));
        const cuts = [];
        p.bear.forEach(pr => pr.forEach(q => cuts.push({ pos: q, u: sp >= 1 ? 1 : 0.5 + 0.5 * sp, who: "bear" })));
        p.beaver.forEach(q => cuts.push({ pos: q, u: sp >= 1 ? 1 : 0.5 + 0.5 * sp, who: "beaver" }));
        const xOf = logDraw(ctx, X, y, ppm, Hh, sp > 0 ? cuts : [], { gap: 14, labels: sp > 0.3 || ord(ids[i]) >= 1 });
        // tanda rencana di atas batang (setelah dipotong tetap ditunjukkan di atasnya)
        p.bear.forEach(([q0, q1]) => {
          const x0 = sp > 0 ? xOf(q0) - 7 : X + q0 * ppm, x1 = sp > 0 ? xOf(q1) - 7 : X + q1 * ppm;
          alpha(ctx, mk, () => { mline(ctx, [[x0, y - Hh / 2 - 6], [x0, y - Hh / 2 - 22], [x1, y - Hh / 2 - 22], [x1, y - Hh / 2 - 6]], 1, WHO.bear, 5); });
          if (sp <= 0) { planMark(ctx, X, y, ppm, Hh, q0, "bear", mk); planMark(ctx, X, y, ppm, Hh, q1, "bear", mk); }
        });
        p.beaver.forEach(q => {
          const x0 = sp > 0 ? xOf(q) - 7 : X + q * ppm;
          alpha(ctx, mkV, () => { mline(ctx, [[x0, y - Hh / 2 - 6], [x0, y - Hh / 2 - 24]], 1, WHO.beaver, 6); ctx.fillStyle = WHO.beaver; ctx.beginPath(); ctx.arc(x0, y - Hh / 2 - 28, 7, 0, Math.PI * 2); ctx.fill(); });
          if (sp <= 0) planMark(ctx, X, y, ppm, Hh, q, "beaver", mkV);
        });
      });
    });
    if (b.id === "j5") {
      const T = atSeq(b, ["Potongan satu meter", "Potongan dua meter", "potongan tiga meter", "Semuanya"]);
      alpha(ctx, P(l, T[0] - 0.2, 0.5), () => card(ctx, 1480, 230, 360, 450, { fill: "#FFFFFF", stroke: "#C9D2D8", lw: 3, r: 16 }));
      [["1 m:", "1 + 3 + 5 = 9"], ["2 m:", "2 + 1 = 3"], ["3 m:", "2"]].forEach(([k, v], i) => {
        alpha(ctx, P(l, T[i], 0.5), () => { text(ctx, k, 1505, 300 + i * 110, 32, { weight: 900, color: C.ink2 }); text(ctx, v, 1590, 300 + i * 110, 34, { weight: 900, color: INK, fit: 230 }); });
      });
      alpha(ctx, P(l, T[3], 0.5), () => { tick(ctx, 1600, 620, 60, P(l, T[3], 0.6), GREEN, 9); hand(ctx, "sesuai", 1720, 635, 34, { color: GREEN }); });
    }
  }

  // ---------- jadwal 6 menit ----------
  const GJ = { x: 60, y: 140, lw: 300, cw: 250, hh: 48, rh: 88, n: 6 };
  function jadwal(ctx, b, l) {
    board(ctx);
    const st = schedState(b, l);
    gantt(ctx, GJ, schedCells(st), { hl: m => (m === st.k ? 1 : 0) * 0.9 });
    const { cuts, load } = logCuts(st);
    const Ys = [478, 590, 702], X = 250, ppm = 108, Hh = 60;
    Ys.forEach((y, i) => {
      const gone = load[i];
      logChip(ctx, i, 145, y, 24, { alpha: 1 - 0.6 * gone });
      logDraw(ctx, X, y, ppm, Hh, cuts[i], { alpha: 1 - 0.78 * gone, gap: 12 });
      if (gone > 0.5) hand(ctx, "di truk", X + 7 * ppm + 140, y + 12, 30, { color: LOGC[i], alpha: (gone - 0.5) * 2 });
    });
    truck(ctx, 1330, 770, 1.12, load.map((a, i) => ({ a, color: LOGC[i] })));
    if (b.id === "j11" || b.id === "j12") {
      const u = b.id === "j12" ? 1 : P(l, at(b, "pekerjaan selesai"), 0.6);
      alpha(ctx, u, () => { card(ctx, 1330, 440, 470, 92, { fill: "#E8F6EC", stroke: GREEN, lw: 4, r: 16 }); text(ctx, "Selesai: 6 menit", 1565, 500, 42, { align: "center", weight: 900, color: GREEN }); });
    }
    if (b.id === "j12") {
      const T = atSeq(b, ["tidak pernah", "Setiap batang", "semua potongan"]);
      alpha(ctx, P(l, T[0] - 0.3, 0.5), () => { ctx.fillStyle = "#FFFFFF"; rr(ctx, 60, 425, 1240, 345, 16); ctx.fill(); ctx.strokeStyle = "#C9D2D8"; ctx.lineWidth = 3; ctx.stroke(); });
      ["Tidak pernah berdua di batang yang sama pada menit yang sama.", "Setiap batang dimuat setelah selesai dipotong.", "Potongan: 9 × 1 m, 3 × 2 m, 2 × 3 m, sesuai pesanan."].forEach((s, i) => {
        const u = P(l, T[i], 0.6);
        alpha(ctx, u, () => { tick(ctx, 120, 490 + i * 105, 54, u, GREEN, 8); text(ctx, s, 170, 505 + i * 105, 34, { weight: 800, color: INK, fit: 1100 }); });
      });
    }
  }

  // ---------- penutup ----------
  function komputer(ctx, b, l) {
    board(ctx);
    const X = 200, Y = 165, W = 1120, Hh = 540;
    ctx.fillStyle = "#3B4652"; rr(ctx, X, Y, W, Hh, 24); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, X + 24, Y + 24, W - 48, Hh - 70, 10); ctx.fill();
    ctx.fillStyle = "#3B4652"; ctx.fillRect(X + W / 2 - 40, Y + Hh, 80, 46); rr(ctx, X + W / 2 - 180, Y + Hh + 42, 360, 20, 10); ctx.fill();
    ctx.fillStyle = "#E7EEF2"; ctx.fillRect(X + 24, Y + 24, W - 48, 56);
    text(ctx, "Jadwal Tugas Prosesor", X + 50, Y + 62, 28, { weight: 800, color: INK });
    const tasks = [[["Musik", 0, 2, "#2F6FD1"], ["Browser", 2, 5, "#23964F"], ["Game", 5, 8, "#D0457A"]], [["Unduh", 0, 3, "#E07A12"], ["Foto", 3, 4, "#16808F"], ["Ketik", 4, 7, "#9B45C4"]]];
    const u = P(l, b.id === "c1" ? at(b, "bekerja bersamaan") : 0, 2.0);
    tasks.forEach((row, r) => {
      const y = Y + 150 + r * 150;
      text(ctx, "Core " + (r + 1), X + 60, y + 50, 32, { weight: 900, color: INK });
      ctx.fillStyle = "#F1F4F6"; rr(ctx, X + 220, y, 840, 80, 10); ctx.fill();
      row.forEach(([nm, a, z, col]) => {
        const v = clamp(u * 8 - a, 0, 1); if (v <= 0) return;
        ctx.save(); ctx.globalAlpha *= v; ctx.fillStyle = col; rr(ctx, X + 224 + a * 104, y + 4, (z - a) * 104 - 8, 72, 10); ctx.fill();
        text(ctx, nm, X + 224 + (a + z) / 2 * 104 - 4, y + 50, 28, { align: "center", weight: 800, color: "#fff" }); ctx.restore();
      });
    });
    kiko(ctx, 1600, 520, 210, 0, { mood: "happy" });
    alpha(ctx, b.id === "c2" ? P(l, at(b, "disebut penjadwalan"), 0.6) : 0, () => { hand(ctx, "penjadwalan", 1600, 730, 46, { color: ORANGE }); hand(ctx, "(scheduling)", 1600, 778, 34, { color: INK }); });
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Pertama", "Kedua", "Ketiga"]);
    const S = [["Hitung semua pekerjaan.", "11 potong + 3 muat"], ["Buktikan waktu yang lebih singkat tidak cukup.", "5 menit: 10 < 11"], ["Susun jadwal nyata dengan waktu itu.", "jadwal 6 menit"]];
    S.forEach(([s, ic], i) => {
      const y = 165 + i * 190, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 120, y, 1680, 165, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(210, y + 82, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 210, y + 100, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 290, y + 98, 46, { weight: 900, color: INK, fit: 1050 });
        hand(ctx, ic, 1560, y + 98, 38, { color: ORANGE });
      });
    });
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–860) ----------
  function soal_v(ctx, b, l) {
    board(ctx);
    ctx.fillStyle = "#F2F7FD"; rr(ctx, 470, 150, 980, 245, 18); ctx.fill();
    beaver(ctx, 560, 265, 110, { saw: true }); text(ctx, "Berang-berang", 560, 360, 24, { align: "center", weight: 900, color: WHO.beaver });
    logDraw(ctx, 680, 245, 100, 60, [{ pos: 1, u: 1, who: "beaver" }], { size: 34 });
    text(ctx, "1 potongan / menit", 1440, 360, 36, { align: "right", weight: 900, color: WHO.beaver });
    ctx.fillStyle = "#FEF4EA"; rr(ctx, 470, 410, 980, 255, 18); ctx.fill();
    bear(ctx, 560, 520, 100, { saw: true }); text(ctx, "Beruang", 560, 630, 24, { align: "center", weight: 900, color: WHO.bear });
    const xOf = logDraw(ctx, 680, 520, 100, 60, [{ pos: 2, u: 1, who: "bear" }, { pos: 3, u: 1, who: "bear" }], { size: 34 });
    const x0 = xOf(2), x1 = xOf(3); mline(ctx, [[x0 - 5, 482], [x0 - 5, 466], [x1 - 5, 466], [x1 - 5, 482]], 1, WHO.bear, 4); hand(ctx, "1 m", (x0 + x1) / 2 - 5, 456, 26, { color: WHO.bear });
    text(ctx, "2 potongan sekaligus / menit", 1440, 630, 36, { align: "right", weight: 900, color: WHO.bear, fit: 700 });
    if (b.id === "soal5" || b.id === "soal4") {
      ctx.fillStyle = "#F7F9FA"; rr(ctx, 470, 680, 980, 170, 18); ctx.fill();
      truck(ctx, 490, 830, 0.42, [{ a: 1, color: WOOD }]);
      text(ctx, "muat 1 batang = 1 menit", 690, 735, 36, { weight: 900, color: WHO.beaver });
      text(ctx, "(hanya Berang-berang)", 690, 780, 28, { weight: 800, color: C.ink2 });
      text(ctx, "tidak boleh berdua di batang yang sama", 690, 830, 28, { weight: 800, color: RED, fit: 740 });
    }
  }
  function pesanan_v(ctx, b, l) {
    board(ctx);
    text(ctx, "DITERIMA", 490, 195, 28, { weight: 900, color: C.accentDark });
    for (let i = 0; i < 3; i++) logDraw(ctx, 490, 245 + i * 70, 50, 44, [], { size: 28 });
    text(ctx, "3 batang × 7 m", 1440, 320, 40, { align: "right", weight: 900, color: INK });
    card(ctx, 470, 430, 980, 420, { fill: "#FFF8EE", stroke: ORANGE, lw: 4, r: 18 });
    text(ctx, "PESANAN", 495, 480, 28, { weight: 900, color: C.accentDark });
    const T = atSeq(b, ["sembilan potongan", "tiga potongan", "dua potongan"]);
    [[9, 1, 545], [3, 2, 665], [2, 3, 785]].forEach(([n, len, y], r) => {
      alpha(ctx, P(l, T[r], 0.5), () => {
        const ppm = 62, g = 10; for (let i = 0; i < n; i++) piece(ctx, 495 + i * (len * ppm + g), y, len * ppm, 46, len, { size: 28 });
        text(ctx, n + " × " + len + " m", 1430, y + 14, 40, { align: "right", weight: 900, color: INK });
      });
    });
  }
  function pilihan_v(ctx, b, l) {
    board(ctx);
    para(ctx, "Berapa menit paling sedikit untuk memotong dan memuat semuanya?", 960, 215, 44, 900, { align: "center", weight: 900, lh: 1.2 });
    const done = b.id === "p3";
    const good = done ? P(l, at(b, "enam menit."), 0.5) : 0;
    const pos = [[475, 360], [985, 360], [475, 590], [985, 590]];
    for (let i = 0; i < 4; i++) {
      const st = done ? (i === 0 ? { strike: 1, dim: 1 } : i === 1 ? { tick: 1, good: good > 0.5, ring: good } : { dim: 1 }) : {};
      optCard(ctx, i, pos[i][0], pos[i][1], 430, 170, st, 60);
    }
  }
  function hitung_v(ctx, b, l) {
    board(ctx);
    text(ctx, "9 + 3 + 2 = 14 potongan", 960, 260, 56, { align: "center", weight: 900, color: INK });
    text(ctx, "dari 3 batang utuh", 960, 330, 40, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, "14 − 3 = 11 kali potong", 960, 470, 60, { align: "center", weight: 900, color: RED });
    hand(ctx, "(seperti memotong kue: bagian = potong + 1)", 960, 535, 30, { color: GRAY });
    text(ctx, "+ 3 kali muat", 960, 680, 60, { align: "center", weight: 900, color: WHO.beaver });
    text(ctx, "(3 menit Berang-berang)", 960, 745, 36, { align: "center", weight: 800, color: C.ink2 });
  }
  function batas_v(ctx, b, l) {
    board(ctx);
    const G = { x: 465, y: 150, lw: 225, cw: 150, hh: 46, rh: 92, n: 5 };
    const bearRow = [], beavRow = [];
    for (let m = 0; m < 5; m++) {
      bearRow.push({ t1: "2", t2: "potongan", kind: "cut", a: 1, color: WHO.bear, bg: "#FEF1E4", x: m === 4 ? 1 : 0 });
      beavRow.push(m >= 2 ? { t1: "muat", kind: "load", a: 1, color: WHO.beaver, bg: "#E9F1FC" } : { t1: "1", t2: "potongan", kind: "cut", a: 1, color: WHO.beaver, bg: "#E9F1FC" });
    }
    gantt(ctx, G, [bearRow, beavRow], { fs: 26, noIcon: true });
    text(ctx, "Potongan di menit 5 masih harus dimuat.", 960, 470, 34, { align: "center", weight: 800, color: RED, fit: 960 });
    text(ctx, "Beruang: 2 × 4 = 8", 960, 560, 48, { align: "center", weight: 900, color: WHO.bear });
    text(ctx, "Berang-berang: 2", 960, 630, 48, { align: "center", weight: 900, color: WHO.beaver });
    const u = P(l, at(b, "Delapan ditambah"), 0.6);
    alpha(ctx, u, () => { text(ctx, "8 + 2 = 10 < 11", 960, 730, 64, { align: "center", weight: 900, color: RED }); });
    hand(ctx, "5 menit tidak cukup", 960, 810, 44, { color: RED, alpha: P(l, at(b, "Padahal"), 0.6) });
  }
  function jadwal_v(ctx, b, l) {
    board(ctx);
    const st = schedState(b, l);
    const G = { x: 465, y: 150, lw: 225, cw: 125, hh: 44, rh: 96, n: 6 };
    gantt(ctx, G, schedCells(st), { fs: 24, noIcon: true });
    const { load } = logCuts(st);
    truck(ctx, 500, 820, 1.05, load.map((a, i) => ({ a, color: LOGC[i] })));
    const u = P(l, at(b, "pekerjaan selesai"), 0.6);
    alpha(ctx, u, () => { card(ctx, 990, 560, 450, 100, { fill: "#E8F6EC", stroke: GREEN, lw: 4, r: 16 }); text(ctx, "Selesai: 6 menit", 1215, 625, 42, { align: "center", weight: 900, color: GREEN }); });
  }

  Object.assign(K.SCENES, {
    soal, aturan_soal, pesanan, pilihan, aturan, bolu, hitung, batas, rencana, jadwal, komputer, langkah,
    soal_v, pesanan_v, pilihan_v, hitung_v, batas_v, jadwal_v,
    buka(ctx, b, l) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "lomba"), 0.8) : 1;
      alpha(ctx, bu, () => {
        beaver(ctx, 900, 540, 170, { saw: true }); bear(ctx, 1560, 530, 160, { saw: true });
        logDraw(ctx, 1010, 620, 60, 46, [], { labels: false });
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
      beaver(ctx, 600, 470 + Math.sin(l * 3) * 8, 140, { saw: true }); bear(ctx, 860, 465 + Math.sin(l * 3 + 1) * 8, 130, { saw: true });
      logDraw(ctx, 560, 660, 52, 40, [{ pos: 3, u: 1 }, { pos: 4, u: 1 }]);
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1330, y, 34, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 470 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 640, 790, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 72, { align: "center", weight: 900, color: INK, fit: 1000 });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Jadwal tercepat, menit demi menit", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
