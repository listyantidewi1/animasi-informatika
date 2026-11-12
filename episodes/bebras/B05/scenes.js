/* B05 Pembahasan Soal Bebras 2024-BR-04 "Gelang" (Brasil), kategori SiKecil.
   Gaya papan tulis putih dengan coretan spidol (sama dengan B01–B04) + simulasi:
   kotak Victoria (tampak atas, 7 kotak kecil berpola warna), gelang manik-manik A–D dicocokkan satu per satu.
   Jawaban: C (gelang hitam-putih; tidak ada kotak bergaris hitam dan putih).
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F7FD1",
        GRAYT = "#8A96A0", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Gelang", asli: "", tahun: "2024", negara: "Brasil", kode: "2024-BR-04" };

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
  // Victoria (anak perempuan, digambar ulang); cx, cy = pusat badan; s = ukuran
  function victoria(ctx, cx, cy, s, opt = {}) {
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.translate(cx, cy);
    ctx.fillStyle = "rgba(0,0,0,0.10)"; ctx.beginPath(); ctx.ellipse(0, s * 0.95, s * 0.42, s * 0.07, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.skin; ctx.fillRect(-s * 0.16, s * 0.45, s * 0.1, s * 0.44); ctx.fillRect(s * 0.06, s * 0.45, s * 0.1, s * 0.44);
    ctx.fillStyle = "#3C4652"; ctx.beginPath(); ctx.ellipse(-s * 0.12, s * 0.91, s * 0.1, s * 0.05, 0, 0, Math.PI * 2); ctx.ellipse(s * 0.12, s * 0.91, s * 0.1, s * 0.05, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = (opt.skirt || "#2F6FA8"); ctx.beginPath(); ctx.moveTo(-s * 0.25, s * 0.2); ctx.lineTo(s * 0.25, s * 0.2); ctx.lineTo(s * 0.36, s * 0.55); ctx.lineTo(-s * 0.36, s * 0.55); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.skin; ctx.lineCap = "round"; ctx.lineWidth = s * 0.1;
    ctx.beginPath(); ctx.moveTo(-s * 0.26, -s * 0.12); ctx.lineTo(-s * 0.36, s * 0.24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.26, -s * 0.12);
    if (opt.up) ctx.lineTo(s * 0.5, -s * 0.46); else ctx.lineTo(s * 0.36, s * 0.24);
    ctx.stroke();
    ctx.fillStyle = opt.shirt || "#23964F"; rr(ctx, -s * 0.28, -s * 0.24, s * 0.56, s * 0.5, s * 0.12); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.24); ctx.lineTo(0, -s * 0.12); ctx.lineTo(s * 0.1, -s * 0.24); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.hair;
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * s * 0.33, -s * 0.5, s * 0.11, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#F5C518"; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * s * 0.25, -s * 0.56, s * 0.04, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = C.skin; ctx.beginPath(); ctx.arc(0, -s * 0.52, s * 0.26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(0, -s * 0.57, s * 0.28, Math.PI * 1.02, -0.02); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-s * 0.08, -s * 0.7, s * 0.16, s * 0.07, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.pupil; ctx.beginPath(); ctx.arc(-s * 0.09, -s * 0.5, s * 0.03, 0, Math.PI * 2); ctx.arc(s * 0.09, -s * 0.5, s * 0.03, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(232,97,140,0.35)"; ctx.beginPath(); ctx.arc(-s * 0.16, -s * 0.42, s * 0.04, 0, Math.PI * 2); ctx.arc(s * 0.16, -s * 0.42, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = C.pupil; ctx.lineWidth = s * 0.022; ctx.beginPath(); ctx.arc(0, -s * 0.45, s * 0.07, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    ctx.restore();
    return { x: cx + s * 0.52, y: cy - s * 0.5 };
  }

  // ---------- warna manik dan pola kotak ----------
  const MR = "#C62F33", MY = "#F5C518", MK = "#1F1F22", MW = "#FFFFFF";
  const NAMA = { [MR]: "merah", [MY]: "kuning", [MK]: "hitam", [MW]: "putih" };
  const PAT = { m: [MR], k: [MY], h: [MK], mk: [MR, MY], mp: [MR, MW], mh: [MR, MK], mhp: [MR, MK, MW] };
  const PNAME = { m: "merah", k: "kuning", h: "hitam", mk: "merah dan kuning", mp: "merah dan putih", mh: "merah dan hitam", mhp: "merah, hitam, putih" };
  // tata letak kotak Victoria (satuan: ruang dalam 660 x 600, bingkai 30)
  const CELLS = { m: [0, 0, 330, 200], mp: [330, 0, 330, 200], mk: [0, 200, 220, 200], mhp: [220, 200, 220, 200], mh: [440, 200, 220, 200], k: [0, 400, 330, 200], h: [330, 400, 330, 200] };
  const ORDER7 = ["m", "mp", "mk", "mhp", "mh", "k", "h"];
  const rep = (cols, n) => Array.from({ length: n }, (_, i) => cols[i % cols.length]);
  const BR = { A: rep([MK, MR], 16), B: rep([MR], 14), C: rep([MK, MW], 16), D: rep([MW, MK, MR], 15) };
  const BRPAT = { A: "mh", B: "m", C: null, D: "mhp" };

  function stripes(ctx, x, y, w, h, cols, sw) {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (cols.length === 1) { ctx.fillStyle = cols[0]; ctx.fillRect(x, y, w, h); }
    else { let i = 0; for (let xx = x; xx < x + w; xx += sw, i++) { ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(xx, y, sw + 0.6, h); } }
    ctx.restore();
  }
  // satu kotak kecil lepas (untuk tabel/pemanasan)
  function swatch(ctx, x, y, w, h, cols, opt = {}) {
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = "#D9A45B"; rr(ctx, x - 10, y - 10, w + 20, h + 20, 10); ctx.fill();
    stripes(ctx, x, y, w, h, cols, opt.sw || 18);
    ctx.strokeStyle = "#5B4127"; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }
  // kotak Victoria tampak atas; x, y = pojok kiri atas ruang dalam; s = skala
  // opt.hl: {id: [warna, u]}, opt.num: u (angka 1–7 muncul), opt.tick: {id: u}, opt.dim: u (redupkan semua kecuali hl)
  function vbox(ctx, x, y, s, opt = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = "rgba(0,0,0,0.10)"; rr(ctx, -24, -18, 720, 660, 26); ctx.fill();
    ctx.fillStyle = "#D9A45B"; rr(ctx, -30, -30, 720, 660, 24); ctx.fill();
    ctx.strokeStyle = "#9C6B33"; ctx.lineWidth = 4; rr(ctx, -30, -30, 720, 660, 24); ctx.stroke();
    ORDER7.forEach((id, n) => {
      const [cx, cy, w, h] = CELLS[id], g = 9;
      stripes(ctx, cx + g, cy + g, w - 2 * g, h - 2 * g, PAT[id], 22);
      ctx.strokeStyle = "#5B4127"; ctx.lineWidth = 3; ctx.strokeRect(cx + g, cy + g, w - 2 * g, h - 2 * g);
      // bayangan dalam supaya tampak seperti wadah
      ctx.fillStyle = "rgba(0,0,0,0.16)"; ctx.fillRect(cx + g, cy + g, w - 2 * g, 10); ctx.fillRect(cx + g, cy + g, 10, h - 2 * g);
      if (opt.dim && !(opt.hl && opt.hl[id])) { ctx.fillStyle = `rgba(255,255,255,${0.6 * clamp(opt.dim, 0, 1)})`; ctx.fillRect(cx + g, cy + g, w - 2 * g, h - 2 * g); }
      if (opt.num) { const u = clamp(opt.num * 7 - n, 0, 1); if (u > 0) { ctx.save(); ctx.globalAlpha *= u;
        ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx + w / 2, cy + h / 2, 38, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        text(ctx, String(n + 1), cx + w / 2, cy + h / 2 + 17, 48, { align: "center", weight: 900, color: INK }); ctx.restore(); } }
    });
    if (opt.hl) Object.entries(opt.hl).forEach(([id, [col, u]]) => {
      if (u <= 0) return; const [cx, cy, w, h] = CELLS[id];
      ctx.save(); ctx.globalAlpha *= clamp(u, 0, 1); ctx.strokeStyle = col; ctx.lineWidth = 14; rr(ctx, cx + 1, cy + 1, w - 2, h - 2, 14); ctx.stroke(); ctx.restore();
    });
    if (opt.tick) Object.entries(opt.tick).forEach(([id, u]) => {
      if (u <= 0) return; const [cx, cy, w, h] = CELLS[id];
      ctx.save(); ctx.fillStyle = "#FFFFFF"; ctx.globalAlpha *= clamp(u * 2, 0, 1); ctx.beginPath(); ctx.arc(cx + w / 2, cy + h / 2, 44, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      tick(ctx, cx + w / 2, cy + h / 2, 64, u, GREEN, 11);
    });
    if (opt.scan != null) {   // kaca pembesar menyusuri kotak satu per satu
      const k = Math.floor(clamp(opt.scan, 0, 0.999) * 7), [cx, cy, w, h] = CELLS[ORDER7[k]];
      ctx.save(); ctx.strokeStyle = "#7B8794"; ctx.lineWidth = 10; ctx.setLineDash([18, 12]); rr(ctx, cx + 2, cy + 2, w - 4, h - 4, 14); ctx.stroke(); ctx.restore();
    }
    ctx.restore();
  }
  const cellC = (id, x, y, s) => { const [cx, cy, w, h] = CELLS[id]; return [x + (cx + w / 2) * s, y + (cy + h / 2) * s]; };

  // gelang: manik-manik melingkar; mulai dari atas searah jarum jam. opt.hi = jumlah manik yang ditandai, opt.alpha
  function bracelet(ctx, cx, cy, R, cols, opt = {}) {
    const N = cols.length, r = R * Math.sin(Math.PI / N) * 0.98;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.strokeStyle = "#9AA5AE"; ctx.lineWidth = Math.max(2, r * 0.12); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    cols.forEach((c, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / N, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      ctx.fillStyle = c; ctx.strokeStyle = "#3B3F44"; ctx.lineWidth = Math.max(1.5, r * 0.09);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = c === MK ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.45)"; ctx.beginPath(); ctx.arc(x - r * 0.32, y - r * 0.32, r * 0.25, 0, Math.PI * 2); ctx.fill();
      if (opt.hi != null && i < opt.hi) { ctx.strokeStyle = ORANGE; ctx.lineWidth = Math.max(4, r * 0.22); ctx.beginPath(); ctx.arc(x, y, r * 1.32, 0, Math.PI * 2); ctx.stroke(); }
    });
    ctx.restore();
  }
  function bead(ctx, x, y, r, c) {
    ctx.fillStyle = c; ctx.strokeStyle = "#3B3F44"; ctx.lineWidth = Math.max(1.5, r * 0.09);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  // label huruf pilihan dalam lingkaran
  function letter(ctx, L, x, y, r, col) {
    ctx.fillStyle = col || C.kiko; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    text(ctx, L, x, y + r * 0.42, r * 1.2, { align: "center", weight: 900, color: "#fff" });
  }
  // deretan nama warna dengan bulatan kecil: [[warna, x]], dipakai di penjelasan
  function colorChip(ctx, c, x, y, size, opt = {}) {
    const name = NAMA[c], w = tw(ctx, name, size, 800) + size * 1.5 + 22;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = "#F3F6F8"; ctx.strokeStyle = "#C3CDD4"; ctx.lineWidth = 2.5; rr(ctx, x, y - size * 0.95, w, size * 1.45, size * 0.7); ctx.fill(); ctx.stroke();
    bead(ctx, x + size * 0.75, y - size * 0.25, size * 0.45, c);
    text(ctx, name, x + size * 1.4 + 6, y + size * 0.1, size, { weight: 800, color: INK });
    ctx.restore();
    return w;
  }
  function flagBR(ctx, x, y, w) {   // bendera Brasil sederhana
    const h = w * 0.7;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#1E9A48"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#F7D417"; ctx.beginPath(); ctx.moveTo(x + w / 2, y + h * 0.1); ctx.lineTo(x + w * 0.92, y + h / 2); ctx.lineTo(x + w / 2, y + h * 0.9); ctx.lineTo(x + w * 0.08, y + h / 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#1E3F8F"; ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, h * 0.24, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + w / 2 + h * 0.05, y + h / 2 + h * 0.5, h * 0.52, -Math.PI * 0.68, -Math.PI * 0.4); ctx.stroke();
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  // ---------- adegan soal ----------
  const SOAL = ["soal1", "soal1b", "soal1c"];
  function soal(ctx, b, l) {
    board(ctx);
    const o = prog(SOAL, b, l);
    const vA = o("soal1", () => P(l, at(b, "Ini adalah Victoria"), 0.6));
    victoria(ctx, 330, 470, 270, { alpha: vA });
    hand(ctx, "Victoria", 330, 790, 46, { alpha: vA, color: BLUE });
    const bA = o("soal1", () => P(l, at(b, "sebuah kotak"), 0.7));
    const bx = 820, by = 190, s = 0.92;
    const num = o("soal1b", () => clamp((l - at(b, "tujuh kotak kecil")) / 2.2, 0, 1));
    vbox(ctx, bx, by, s, { alpha: bA, num: b.id === "soal1b" ? num : 0 });
    alpha(ctx, o("soal1b", () => P(l, at(b, "tujuh kotak kecil"), 0.6)), () => { hand(ctx, "7 kotak", 1715, 330, 48, { color: ORANGE }); hand(ctx, "kecil", 1715, 386, 48, { color: ORANGE }); });
    alpha(ctx, o("soal1b", () => P(l, at(b, "pola warnanya"), 0.6)), () => { hand(ctx, "pola", 1715, 520, 44, { color: C.ink2 }); hand(ctx, "warnanya", 1715, 572, 44, { color: C.ink2 }); hand(ctx, "beda-beda", 1715, 624, 44, { color: C.ink2 }); });
    if (b.id === "soal1c") {
      const u1 = P(l, at(b, "satu saja"), 0.6), u2 = P(l, at(b, "yang bergaris"), 0.6);
      const hl = {}; ["m", "k", "h"].forEach(id => hl[id] = [BLUE, u1 * (1 - u2)]); ["mk", "mp", "mh", "mhp"].forEach(id => hl[id] = [ORANGE, u2]);
      vbox(ctx, bx, by, s, { hl });
      ctx.save(); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(1580, 140, 280, 680); ctx.restore();
      alpha(ctx, u1 * (1 - u2), () => { hand(ctx, "satu", 1715, 400, 50, { color: BLUE }); hand(ctx, "warna", 1715, 460, 50, { color: BLUE }); });
      alpha(ctx, u2, () => { hand(ctx, "bergaris", 1715, 400, 50, { color: ORANGE }); });
      const u3 = P(l, at(b, "berganti-ganti"), 0.6);
      alpha(ctx, u3, () => { hand(ctx, "warna", 1715, 480, 40, { color: C.ink2 }); hand(ctx, "berganti-", 1715, 528, 40, { color: C.ink2 }); hand(ctx, "ganti", 1715, 576, 40, { color: C.ink2 });
        stripes(ctx, 1630, 620, 170, 60, [MR, MW], 20); ctx.strokeStyle = "#5B4127"; ctx.lineWidth = 2; ctx.strokeRect(1630, 620, 170, 60); });
    }
  }
  function contoh(ctx, b, l) {
    board(ctx);
    const bx = 130, by = 190, s = 0.92, second = b.id === "soal2b";
    const go = second ? P(l, at(b, "Jadi, gelang ini"), 0.8) : 0;
    vbox(ctx, bx, by, s, { hl: { mp: [GREEN, go] } });
    const ap = second ? 1 : P(l, at(b, "menyimpan gelang"), 0.6);
    let hi = 0;
    if (second) {
      const T = atSeq(b, ["merah,", "putih,", "merah,", "putih,", "berganti-ganti"]);
      hi = T.slice(0, 4).filter(t => l >= t).length;
      alpha(ctx, P(l, T[0], 0.5), () => {
        [MR, MW, MR, MW].forEach((c, i) => alpha(ctx, P(l, T[i], 0.4), () => colorChip(ctx, c, 960 + i * 210, 240, 34)));
      });
      alpha(ctx, P(l, T[4], 0.5), () => hand(ctx, "berganti-ganti", 1360, 330, 40, { color: ORANGE }));
    } else {
      alpha(ctx, P(l, at(b, "pola warnanya sama"), 0.6), () => { hand(ctx, "gelang disimpan di kotak", 1360, 250, 42, { color: ORANGE }); hand(ctx, "yang pola warnanya sama", 1360, 306, 42, { color: ORANGE }); });
    }
    bracelet(ctx, 1360, 545, 165, BR_EX, { alpha: ap, hi: second ? hi : null });
    if (go > 0) {
      const [ex, ey] = cellC("mp", bx, by, s);
      const pts = []; for (let k = 0; k <= 24; k++) { const u = k / 24; pts.push([lerp(1140, ex + 120, u), lerp(545, ey, u) - Math.sin(Math.PI * u) * 120]); }
      mline(ctx, pts, go, GREEN, 8, true);
      alpha(ctx, P(l, at(b, "kotak bergaris merah dan putih"), 0.6), () => hand(ctx, "kotak merah dan putih", 1360, 808, 42, { color: GREEN }));
    }
  }
  const BR_EX = rep([MR, MW], 16);

  // ---------- pilihan jawaban ----------
  const BXS = [900, 1135, 1370, 1605], BYY = 320, BRR = 92;
  function fourBr(ctx, show, marks = {}) {
    "ABCD".split("").forEach((L, i) => {
      const a = show[i]; if (a <= 0) return;
      alpha(ctx, a, () => {
        if (marks.live === L) { ctx.fillStyle = "#FFF4D6"; rr(ctx, BXS[i] - 112, BYY - 112, 224, 300, 22); ctx.fill(); }
        bracelet(ctx, BXS[i], BYY, BRR, BR[L]);
        letter(ctx, L, BXS[i], BYY + BRR + 46, 30, marks.ans === L && marks.ansU > 0.5 ? GREEN : null);
        const m = marks[L];
        if (m && m.u > 0) alpha(ctx, m.u, () => hand(ctx, m.ok ? "cocok" : "tidak cocok", BXS[i], BYY - BRR - 26, m.ok ? 32 : 30, { color: m.ok ? GREEN : RED }));
        if (marks.ans === L && marks.ansU > 0) ring(ctx, BXS[i], BYY + BRR + 46, 50, 50, marks.ansU, GREEN, 7);
      });
    });
  }
  function pilihan(ctx, b, l) {
    board(ctx);
    const first = b.id === "soal3";
    vbox(ctx, 135, 205, 0.82, {});
    const T = first ? atSeq(b, ["gelang A", "B,", "C,", "dan D"]) : [0, 0, 0, 0];
    fourBr(ctx, T.map(t => first ? P(l, t, 0.5) : 1));
    const qa = first ? P(l, at(b, "Pertanyaannya"), 0.6) : 1;
    alpha(ctx, qa, () => {
      card(ctx, 790, 560, 1040, 230, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "PERTANYAAN", 1310, 612, 30, { align: "center", weight: 900, color: C.accentDark });
      const y1 = 682, s1 = "Gelang mana yang ", s2 = "TIDAK", s3 = " cocok", sz = 46;
      const W = tw(ctx, s1, sz, 900) + tw(ctx, s2, sz, 900) + tw(ctx, s3, sz, 900), x0 = 1310 - W / 2;
      text(ctx, s1, x0, y1, sz, { weight: 900, color: INK });
      text(ctx, s2, x0 + tw(ctx, s1, sz, 900), y1, sz, { weight: 900, color: RED });
      text(ctx, s3, x0 + tw(ctx, s1 + s2, sz, 900), y1, sz, { weight: 900, color: INK });
      text(ctx, "dengan kotak kecil mana pun?", 1310, 748, sz, { align: "center", weight: 900, color: INK });
      if (!first) { const xs = x0 + tw(ctx, s1, sz, 900); mline(ctx, [[xs, y1 + 12], [xs + tw(ctx, s2, sz, 900), y1 + 12]], P(l, at(b, "tidak punya tempat"), 0.6), RED, 6); }
    });
  }

  // ---------- pemanasan: pola ----------
  const POLA = ["w1", "w1b", "w2"];
  function pola(ctx, b, l) {
    board(ctx);
    const o = prog(POLA, b, l);
    kiko(ctx, 210, 560, 160, 0, { mood: "happy" });
    if (b.id !== "w2") {
      const RX = i => 470 + i * 128, RY = 360;
      const T = b.id === "w1" ? atSeq(b, ["merah,", "kuning,", "merah,", "kuning,", "seterusnya"]) : [0, 0, 0, 0, 0];
      for (let i = 0; i < 10; i++) {
        const u = b.id === "w1" ? (i < 4 ? P(l, T[i], 0.4) : P(l, T[4] + (i - 4) * 0.18, 0.3)) : 1;
        if (u <= 0) continue;
        alpha(ctx, u, () => { bead(ctx, RX(i), RY, 52, i % 2 ? MY : MR); });
        if (i < 4 && b.id === "w1") alpha(ctx, u, () => text(ctx, i % 2 ? "kuning" : "merah", RX(i), RY + 100, 30, { align: "center", weight: 800, color: C.ink2 }));
      }
      mline(ctx, [[RX(0) - 70, RY], [RX(9) + 70, RY]], 0, INK, 2);
      if (b.id === "w1b") {
        const u1 = P(l, at(b, "berganti-ganti"), 0.6);
        alpha(ctx, u1, () => hand(ctx, "berganti-ganti", 1050, 230, 46, { color: ORANGE }));
        const u2 = P(l, at(b, "terus berulang"), 1.2);
        for (let k = 0; k < 5; k++) { const v = clamp(u2 * 5 - k, 0, 1); if (v > 0) mline(ctx, [[RX(2 * k) - 50, RY + 76], [RX(2 * k) - 50, RY + 96], [RX(2 * k + 1) + 50, RY + 96], [RX(2 * k + 1) + 50, RY + 76]], v, BLUE, 5); }
        alpha(ctx, u2, () => hand(ctx, "berulang", 1050, 520, 42, { color: BLUE }));
        const u3 = P(l, at(b, "disebut pola"), 0.6);
        alpha(ctx, u3, () => { hand(ctx, "ini namanya POLA", 1050, 680, 64, { color: GREEN }); });
        if (u3 > 0) ring(ctx, 1050, 658, 330, 62, u3, GREEN, 6);
      }
      return;
    }
    // w2: gelang merah-kuning -> dua warna -> kotak merah-kuning
    const bxA = P(l, 0.2, 0.6);
    bracelet(ctx, 610, 470, 180, rep([MR, MY], 16), { alpha: bxA });
    hand(ctx, "gelang", 610, 760, 40, { alpha: bxA, color: C.ink2 });
    const u1 = P(l, at(b, "lihat dulu warna"), 0.6);
    alpha(ctx, u1, () => hand(ctx, "warna apa saja?", 1180, 240, 46, { color: ORANGE }));
    const u2 = P(l, at(b, "dua warna"), 0.6);
    alpha(ctx, u2, () => { hand(ctx, "2 warna", 1180, 330, 46, { color: INK }); const w = colorChip(ctx, MR, 960, 420, 36); colorChip(ctx, MY, 960 + w + 24, 420, 36); });
    const u3 = P(l, at(b, "cocok"), 0.6);
    alpha(ctx, u3, () => {
      swatch(ctx, 1080, 520, 300, 170, [MR, MY], { sw: 24 });
      mline(ctx, [[830, 600], [1040, 600]], 1, GREEN, 7, true);
      tick(ctx, 1460, 600, 80, P(l, at(b, "cocok") + 0.4, 0.6), GREEN, 12);
      hand(ctx, "kotak merah dan kuning", 1230, 760, 40, { color: GREEN });
    });
  }

  // ---------- tujuh kotak: daftar ----------
  const DAF = ["k1", "k2", "k3"];
  const ROWS = [["1 warna", ["m", "k", "h"], "k1", ["merah,", "kuning,", "hitam"]], ["2 warna", ["mk", "mp", "mh"], "k2", ["merah dan kuning", "merah dan putih", "merah dan hitam"]], ["3 warna", ["mhp"], "k3", ["merah, hitam"]]];
  function daftar(ctx, b, l) {
    board(ctx);
    const o = prog(DAF, b, l), hl = {};
    let cur = null;
    ROWS.forEach(([head, ids, bid, words], r) => {
      const y = 175 + r * 215;
      const T = b.id === bid ? atSeq(b, words, "yaitu") : null;
      const hu = o(bid, () => P(l, at(b, head === "1 warna" ? "satu warna" : head === "2 warna" ? "dua warna" : "tiga warna"), 0.5));
      alpha(ctx, hu, () => { hand(ctx, head, 1010, y + 92, 46, { color: [BLUE, ORANGE, RED][r] }); });
      ids.forEach((id, k) => {
        const u = o(bid, () => P(l, T[k], 0.5)); if (u <= 0) return;
        if (b.id === bid && l >= T[k]) cur = id;
        const x = 1180 + k * 225;
        swatch(ctx, x, y + 20, 180, 92, PAT[id], { alpha: u, sw: 18 });
        alpha(ctx, u, () => text(ctx, PNAME[id], ids.length === 1 ? x : x + 90, y + 160, 26, { align: ids.length === 1 ? "left" : "center", weight: 800, color: INK, fit: ids.length === 1 ? 420 : 222 }));
      });
    });
    if (cur) hl[cur] = [ORANGE, 1];
    vbox(ctx, 135, 195, 0.88, { hl });
  }

  // ---------- mencocokkan gelang ----------
  const COC = ["j0", "j1", "j2", "j3", "j4", "j5", "j6"];
  function cocok(ctx, b, l) {
    board(ctx);
    const o = prog(COC, b, l);
    const done = (id, ph) => o(id, () => P(l, at(b, ph), 0.6));
    const marks = {
      A: { ok: 1, u: done("j1", "Jadi, gelang A") }, B: { ok: 1, u: done("j2", "Jadi, gelang B") },
      D: { ok: 1, u: done("j3", "Jadi, gelang D") }, C: { ok: 0, u: done("j4", "Ternyata") },
      live: { j1: "A", j2: "B", j3: "D", j4: "C", j6: "C" }[b.id], ans: "C", ansU: done("j6", "Jawabannya adalah C"),
    };
    const hl = {}, tk = {};
    const cell = { j1: "mh", j2: "m", j3: "mhp" }[b.id];
    if (cell) { const u = P(l, at(b, "Ada kotak"), 0.6); hl[cell] = [GREEN, u]; tk[cell] = P(l, at(b, "Ada kotak") + 0.4, 0.6); }
    let scan = null;
    if (b.id === "j4") { const t0 = at(b, "Coba cari"), t1 = at(b, "Ternyata"); if (l >= t0 && l < t1) scan = (l - t0) / (t1 - t0); }
    vbox(ctx, 135, 205, 0.82, { hl, tick: tk, scan });
    fourBr(ctx, [1, 1, 1, 1], marks);
    if (b.id === "j0") { thinkBadge(ctx, 800, 600, 1000, 120, l, b.dur, "Gelang mana yang tidak punya kotak?"); return; }
    // penjelasan
    const EX = {
      j1: [["Gelang A:", [MR, MK], "berwarna merah"], ["ada kotaknya!", "Ada kotak", GREEN]],
      j2: [["Gelang B:", [MR], "semuanya merah"], ["ada kotaknya!", "Ada kotak", GREEN]],
      j3: [["Gelang D:", [MR, MK, MW], "tiga warna"], ["ada kotaknya!", "Ada kotak", GREEN]],
      j4: [["Gelang C:", [MK, MW], "berwarna hitam"], ["tidak ada kotaknya!", "Ternyata", RED]],
    }[b.id];
    if (EX) {
      const [[lab, cols, ph], [res, ph2, col]] = EX;
      alpha(ctx, P(l, at(b, ph), 0.5), () => {
        text(ctx, lab, 820, 640, 40, { weight: 900, color: INK });
        let x = 1030; cols.forEach(c => { x += colorChip(ctx, c, x, 640, 34) + 16; });
      });
      alpha(ctx, P(l, at(b, ph2), 0.5), () => hand(ctx, res, 1310, 760, 52, { color: col }));
    }
    if (b.id === "j6") alpha(ctx, P(l, at(b, "Jadi, gelang"), 0.6), () => {
      hand(ctx, "Tidak punya kotak: gelang C", 1310, 650, 46, { color: INK });
      alpha(ctx, P(l, at(b, "Jawabannya adalah C"), 0.5), () => hand(ctx, "Jawabannya: C", 1310, 760, 64, { color: GREEN }));
    });
  }
  // j5: gelang C dibandingkan dengan kotak tiga warna
  function beda(ctx, b, l) {
    board(ctx);
    const cx = 470, cy = 400;
    bracelet(ctx, cx, cy, 165, BR.C);
    hand(ctx, "gelang C", cx, 640, 44, { color: INK });
    const kx = 1240, ky = 250;
    swatch(ctx, kx, ky, 420, 260, PAT.mhp, { sw: 26 });
    hand(ctx, "kotak tiga warna", kx + 210, 580, 44, { color: INK });
    const u1 = P(l, at(b, "punya hitam dan putih"), 0.6), u2 = P(l, at(b, "juga punya merah"), 0.6), u3 = P(l, at(b, "tidak punya merah"), 0.6), u4 = P(l, at(b, "polanya berbeda"), 0.6);
    // chip warna
    const cw1 = 330, cw2 = 1110;
    alpha(ctx, u1, () => { colorChip(ctx, MK, cw1, 730, 34); colorChip(ctx, MW, cw1 + 170, 730, 34);
      colorChip(ctx, MK, cw2 + 190, 730, 34); colorChip(ctx, MW, cw2 + 360, 730, 34); });
    alpha(ctx, u2, () => { colorChip(ctx, MR, cw2, 730, 34); });
    if (u2 > 0) ring(ctx, cw2 + 82, 718, 110, 46, u2, RED, 5);
    alpha(ctx, u3, () => { hand(ctx, "tidak ada merah", cw1 + 150, 810, 38, { color: RED }); });
    alpha(ctx, u4, () => { text(ctx, "≠", 900, 430, 160, { align: "center", weight: 900, color: RED }); hand(ctx, "pola berbeda", 900, 540, 44, { color: RED }); });
  }

  // ---------- penutup ----------
  function langkah(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Lihat warna apa saja", "lihat urutannya", "lalu cari pola"]);
    const S = ["Lihat warna apa saja yang ada.", "Lihat urutannya yang berulang.", "Cari pola yang sama persis."];
    S.forEach((s, i) => {
      const y = 170 + i * 185;
      alpha(ctx, P(l, T[i], 0.5), () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 50, { weight: 900, color: INK, fit: 1000 });
        const ix = 1530, iy = y + 80;
        if (i === 0) [MR, MK, MW].forEach((c, k) => bead(ctx, ix - 70 + k * 70, iy, 28, c));
        if (i === 1) [MR, MW, MR, MW, MR].forEach((c, k) => bead(ctx, ix - 120 + k * 60, iy, 26, c));
        if (i === 2) { swatch(ctx, ix - 100, iy - 45, 150, 90, [MR, MK, MW], { sw: 16 }); tick(ctx, ix + 110, iy, 60, 1, GREEN, 10); }
      });
    });
  }

  // ---------- versi tegak untuk Short (area x 460–1460, y 140–840) ----------
  const VB = [507, 187, 0.58], VBR = [[1100, 285], [1330, 285], [1100, 535], [1330, 535]], VR = 78;
  function vfour(ctx, marks = {}) {
    "ABCD".split("").forEach((L, i) => {
      const [x, y] = VBR[i];
      if (marks.live === L) { ctx.fillStyle = "#FFF4D6"; rr(ctx, x - 104, y - 104, 208, 236, 20); ctx.fill(); }
      bracelet(ctx, x, y, VR, BR[L]);
      letter(ctx, L, x, y + VR + 34, 24, marks.ans === L && marks.ansU > 0.5 ? GREEN : null);
      const m = marks[L];
      if (m && m.u > 0) alpha(ctx, m.u, () => { if (m.ok) tick(ctx, x + 62, y + VR + 30, 46, m.u, GREEN, 9); });
      if (marks.ans === L && marks.ansU > 0) ring(ctx, x, y + 26, 108, 140, marks.ansU, GREEN, 7);
    });
  }
  function soal_v(ctx, b, l) {
    board(ctx);
    vbox(ctx, VB[0], VB[1], VB[2], { hl: { mp: [GREEN, P(l, at(b, "Misalnya"), 0.6)] } });
    vfour(ctx);
    hand(ctx, "Gelang disimpan di kotak", 960, 720, 40, { color: ORANGE });
    hand(ctx, "yang pola warnanya sama.", 960, 772, 40, { color: ORANGE });
  }
  function cocok_v(ctx, b, l) {
    board(ctx);
    const T = b.id === "h1" ? atSeq(b, ["Gelang A", "Gelang B", "Gelang D"]) : null;
    const marks = { A: { ok: 1, u: 1 }, B: { ok: 1, u: 1 }, D: { ok: 1, u: 1 }, C: { ok: 0, u: 0 }, ans: "C", ansU: 0 };
    const hl = {}, tk = {};
    if (T) {
      ["A", "B", "D"].forEach((L, k) => { const u = P(l, T[k] + 1.2, 0.5); marks[L].u = u; tk[BRPAT[L]] = u; const nx = T[k + 1] != null ? T[k + 1] : 1e9; if (l >= T[k] && l < nx) { marks.live = L; hl[BRPAT[L]] = [GREEN, P(l, T[k] + 0.6, 0.5)]; } });
    } else {
      ["A", "B", "D"].forEach(L => tk[BRPAT[L]] = 1);
      marks.live = "C"; marks.C.u = P(l, at(b, "tidak ada"), 0.5); marks.ansU = P(l, at(b, "jawabannya"), 0.6);
      const t0 = at(b, "Kotak bergaris"), t1 = at(b, "tidak ada");
      const scan = l >= t0 && l < t1 ? (l - t0) / (t1 - t0) : null;
      vbox(ctx, VB[0], VB[1], VB[2], { tick: tk, scan });
      vfour(ctx, marks);
      alpha(ctx, marks.C.u, () => hand(ctx, "hitam dan putih: tidak ada kotaknya!", 960, 740, 38, { color: RED }));
      alpha(ctx, marks.ansU, () => hand(ctx, "Jawabannya: C", 960, 806, 50, { color: GREEN }));
      return;
    }
    vbox(ctx, VB[0], VB[1], VB[2], { hl, tick: tk });
    vfour(ctx, marks);
    const L = marks.live; if (L) alpha(ctx, 1, () => hand(ctx, `gelang ${L} → kotak ${PNAME[BRPAT[L]]}`, 960, 760, 38, { color: GREEN }));
  }

  Object.assign(K.SCENES, {
    soal, contoh, pilihan, pola, daftar, cocok, beda, langkah, soal_v, cocok_v,
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
      const fu = P(l, at(b, "Brasil"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagBR(ctx, 470, 230, 170); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Brasil"), 0.8);
      if (au > 0) ring(ctx, 1190, 300 + 2 * 92 - 14, 220, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 300, 520, 220, 0, { wave: l, mood: "happy" });
      victoria(ctx, 660, 470, 230, {});
      bracelet(ctx, 840, 640, 70, BR_EX);
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Sampai jumpa!", 520, 810, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Membaca pola warna, langkah demi langkah", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
