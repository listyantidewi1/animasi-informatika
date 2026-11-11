/* PG06 Pembahasan Soal Bebras 2025-BR-02 "Batu, Kertas, Gunting dan Tukar" (Brasil), kategori Penegak (SMA).
   Gaya papan tulis putih dengan coretan spidol (sama dengan PG01–PG03) + simulasi pertukaran kartu.
   Susunan kartu = larik 3 huruf untuk [Anna, Bert, Corry]: R batu, S gunting, P kertas. Susunan awal R S P.
   Warna tetap: Anna ungu, Bert biru, Corry hijau tosca; garis pertukaran Anna↔Bert oranye, Bert↔Corry merah muda, Anna↔Corry hijau.
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F6FD1", GRAY = "#8A96A0";
  const META = { judul: "Batu, Kertas, Gunting dan Tukar", tahun: "2025", negara: "Brasil", kode: "2025-BR-02" };
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

  // ---------- kayu ----------
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

  // ---------- kartu batu / gunting / kertas ----------
  const NAMA = ["Anna", "Bert", "Corry"], PC = ["#8E44AD", "#2F6FD1", "#0F8A8A"];
  const KATA = { R: "batu", S: "gunting", P: "kertas" };
  const MENANG = (a, b) => (a === "R" && b === "S") || (a === "S" && b === "P") || (a === "P" && b === "R");
  const AWAL = ["R", "S", "P"];
  const swp = (A, i, j) => { const B = A.slice(); [B[i], B[j]] = [B[j], B[i]]; return B; };
  const winBC = A => MENANG(A[1], A[2]) ? 1 : 2;   // indeks pemenang Bert lawan Corry
  const SWC = { "0-1": ORANGE, "1-2": "#D0457A", "0-2": "#4E9A2E" };
  const swLabel = (i, j) => NAMA[i] + " ↔ " + NAMA[j];

  function icon(ctx, k, cx, cy, s) {   // ikon di kotak s×s
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s / 100, s / 100); ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (k === "R") {   // batu abu-abu
      ctx.fillStyle = "#8D949B"; ctx.strokeStyle = "#4B5259"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-40, 22); ctx.lineTo(-36, -8); ctx.lineTo(-16, -30); ctx.lineTo(12, -34); ctx.lineTo(36, -16); ctx.lineTo(42, 14); ctx.lineTo(28, 32); ctx.lineTo(-24, 34); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#B3BAC0"; ctx.beginPath(); ctx.moveTo(-26, -6); ctx.lineTo(-12, -22); ctx.lineTo(8, -24); ctx.lineTo(-4, -8); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#5E666D"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(10, 4); ctx.lineTo(24, 18); ctx.moveTo(-14, 14); ctx.lineTo(-4, 22); ctx.stroke();
    } else if (k === "S") {   // gunting: dua bilah perak, dua pegangan merah
      ctx.strokeStyle = "#5B636B"; ctx.fillStyle = "#D5DBE0"; ctx.lineWidth = 3;
      for (const sg of [-1, 1]) {
        ctx.save(); ctx.rotate(sg * 0.42);
        ctx.beginPath(); ctx.moveTo(-5, 6); ctx.lineTo(0, -46); ctx.lineTo(6, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      for (const sg of [-1, 1]) {
        ctx.save(); ctx.rotate(-sg * 0.42);
        ctx.strokeStyle = "#C0392B"; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(0, 26, 9, 13, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = "#4B5259"; ctx.beginPath(); ctx.arc(0, 4, 4.5, 0, Math.PI * 2); ctx.fill();
    } else {   // kertas: lembar putih bergaris, sudut terlipat
      ctx.rotate(-0.06); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#5B636B"; ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(-30, -38); ctx.lineTo(16, -38); ctx.lineTo(32, -22); ctx.lineTo(32, 38); ctx.lineTo(-30, 38); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#DCE3E8"; ctx.beginPath(); ctx.moveTo(16, -38); ctx.lineTo(16, -22); ctx.lineTo(32, -22); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#8FB3D9"; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-20, -12 + i * 13); ctx.lineTo(22, -12 + i * 13); ctx.stroke(); }
    }
    ctx.restore();
  }
  // kartu permainan: pusat (cx, cy), lebar w, tinggi 1.25w; opt.hl = warna bingkai sorotan, opt.word=false tanpa kata
  function gcard(ctx, k, cx, cy, w, opt = {}) {
    const h = w * 1.25;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = "rgba(0,0,0,0.10)"; rr(ctx, cx - w / 2 + 4, cy - h / 2 + 6, w, h, w * 0.1); ctx.fill();
    ctx.fillStyle = "#FFFDF6"; ctx.strokeStyle = opt.hl || "#6B5B45"; ctx.lineWidth = opt.hl ? Math.max(5, w * 0.06) : Math.max(2.5, w * 0.025);
    rr(ctx, cx - w / 2, cy - h / 2, w, h, w * 0.1); ctx.fill(); ctx.stroke();
    icon(ctx, k, cx, cy - (opt.word === false ? 0 : h * 0.1), w * 0.72);
    if (opt.word !== false) text(ctx, KATA[k], cx, cy + h * 0.39, Math.max(16, w * 0.17), { align: "center", weight: 900, color: INK });
    ctx.restore();
  }
  // satu baris kartu (susunan A) di posisi xs; swap = {i, j, u}: kartu i dan j bertukar tempat melengkung
  function cardsRow(ctx, A, xs, y, w, opt = {}) {
    const sw = opt.swap, order = [0, 1, 2].sort((p, q) => (sw && (p === sw.i || p === sw.j) ? 1 : 0) - (sw && (q === sw.i || q === sw.j) ? 1 : 0));
    order.forEach(k => {
      let x = xs[k], yy = y;
      if (sw && sw.u > 0 && (k === sw.i || k === sw.j)) {
        const o = k === sw.i ? sw.j : sw.i, u = ease(clamp(sw.u, 0, 1));
        x = lerp(xs[k], xs[o], u); yy = y + (k === sw.i ? -1 : 1) * Math.sin(Math.PI * u) * w * 0.55;
      }
      gcard(ctx, A[k], x, yy, w, { hl: opt.hl && opt.hl[k], word: opt.word, alpha: opt.alpha });
    });
  }
  // susunan kecil dengan nama di bawah; mengembalikan posisi x
  function arrMini(ctx, A, cx, cy, w, opt = {}) {
    const g = w * 0.14, xs = [cx - w - g, cx, cx + w + g];
    cardsRow(ctx, A, xs, cy, w, opt);
    if (opt.names !== false) xs.forEach((x, i) => text(ctx, NAMA[i], x, cy + w * 0.625 + w * 0.3, Math.max(18, w * 0.24), { align: "center", weight: 900, color: PC[i] }));
    return xs;
  }
  function winChip(ctx, who, cx, cy, size = 30, a = 1) {   // who: 1 Bert, 2 Corry
    if (a <= 0) return;
    chip(ctx, NAMA[who] + " menang", cx, cy, size, PC[who], { alpha: a });
  }
  // berang-berang duduk di kursi memegang kartu (kartu boleh null: digambar terpisah)
  function seat(ctx, i, cx, cy, s, k, opt = {}) {
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    // kursi
    ctx.fillStyle = "#9A6A3F"; ctx.strokeStyle = "#5E3B24"; ctx.lineWidth = 3;
    rr(ctx, cx - s * 0.55, cy - s * 0.25, s * 1.1, s * 0.5, s * 0.06); ctx.fill(); ctx.stroke();      // sandaran
    rr(ctx, cx - s * 0.6, cy + s * 0.62, s * 1.2, s * 0.13, s * 0.04); ctx.fill(); ctx.stroke();      // dudukan
    ctx.fillStyle = "#3B4652"; for (const k2 of [-0.48, 0.48]) ctx.fillRect(cx + k2 * s - s * 0.04, cy + s * 0.75, s * 0.08, s * 0.32);
    beaver(ctx, cx, cy + s * 0.06, s);
    ctx.restore();
    if (k) heldCard(ctx, k, cx, cy, s, opt);
    if (opt.name !== false) text(ctx, NAMA[i], cx, cy + s * 1.32, Math.max(22, s * 0.24), { align: "center", weight: 900, color: PC[i] });
  }
  function heldCard(ctx, k, cx, cy, s, opt = {}) {
    gcard(ctx, k, cx, cy + s * 0.38, s * 0.62, { hl: opt.hl, alpha: opt.cardAlpha });
    ctx.save(); if (opt.cardAlpha != null) ctx.globalAlpha *= clamp(opt.cardAlpha, 0, 1);
    ctx.fillStyle = FUR; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2;
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + sg * s * 0.31, cy + s * 0.36, s * 0.07, s * 0.09, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  }
  function flagBR(ctx, x, y, w) {   // bendera Brasil: hijau, belah ketupat kuning, lingkaran biru dengan pita putih
    const h = w * 0.7;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#009C3B"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#FFDF00"; ctx.beginPath(); ctx.moveTo(x + w * 0.085, y + h / 2); ctx.lineTo(x + w / 2, y + h * 0.12); ctx.lineTo(x + w * 0.915, y + h / 2); ctx.lineTo(x + w / 2, y + h * 0.88); ctx.closePath(); ctx.fill();
    const cx = x + w / 2, cy = y + h / 2, R = h * 0.25;
    ctx.fillStyle = "#002776"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = R * 0.16; ctx.beginPath(); ctx.arc(cx - R * 0.3, cy + R * 2.1, R * 2.3, -Math.PI * 0.68, -Math.PI * 0.25); ctx.stroke();
    ctx.fillStyle = "#FFFFFF"; [[0.3, 0.45], [-0.35, 0.5], [0.05, 0.62], [0.5, 0.2], [-0.15, 0.35]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(cx + dx * R, cy + dy * R, R * 0.05, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore();
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }
  function arrow(ctx, x0, y0, x1, y1, u = 1, color = INK, w = 6) { mline(ctx, [[x0, y0], [x1, y1]], u, color, w, true); }
  function curve(x0, y0, cx, cy, x1, y1, n = 24) { const p = []; for (let i = 0; i <= n; i++) { const t = i / n; p.push([(1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * cx + t * t * x1, (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * cy + t * t * y1]); } return p; }

  // ---------- soal ----------
  const SX = [300, 570, 840];
  function rules(ctx, x, y, w, a, size = 1) {   // a = [a1, a2, a3] kemunculan tiap aturan
    const pairs = [["R", "S"], ["S", "P"], ["P", "R"]], rh = 150 * size, cw = 92 * size;
    pairs.forEach(([p, q], i) => alpha(ctx, a[i], () => {
      const yy = y + i * rh;
      gcard(ctx, p, x + cw * 0.7, yy, cw);
      text(ctx, "mengalahkan", x + w / 2, yy + 10 * size, 30 * size, { align: "center", weight: 900, color: ORANGE });
      arrow(ctx, x + cw * 1.35, yy + 30 * size, x + w - cw * 1.35, yy + 30 * size, 1, ORANGE, 5 * size);
      gcard(ctx, q, x + w - cw * 0.7, yy, cw);
    }));
  }
  function soal(ctx, b, l) {
    board(ctx);
    const ord = prog(["soal1", "soal2", "soal3"], b);
    SX.forEach((x, i) => {
      const a = ord("soal1", () => P(l, at(b, NAMA[i]), 0.5));
      const ca = ord("soal3", () => P(l, at(b, NAMA[i] + " memegang"), 0.5));
      seat(ctx, i, x, 330, 170, null, { alpha: a, name: false });
      alpha(ctx, a, () => text(ctx, NAMA[i], x, 560, 36, { align: "center", weight: 900, color: PC[i] }));
      if (ca > 0) heldCard(ctx, AWAL[i], x, 330, 170, { cardAlpha: ca });
    });
    const ra = ord("soal2", () => P(l, 0.1, 0.5));
    alpha(ctx, ra, () => { card(ctx, 1060, 160, 780, 620, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 }); text(ctx, "ATURAN", 1090, 210, 30, { weight: 900, color: C.accentDark }); });
    const T = b.id === "soal2" ? atSeq(b, ["Batu mengalahkan", "gunting mengalahkan", "kertas mengalahkan"]) : [0, 0, 0];
    rules(ctx, 1100, 300, 700, [0, 1, 2].map(i => ord("soal2", () => P(l, T[i], 0.5))));
    hand(ctx, "semua pemain dapat melihat kartunya", 570, 660, 32, { alpha: ord("soal3", () => P(l, at(b, "menghadap"), 0.6)) });
  }
  function tukar(ctx, b, l) {
    board(ctx);
    const ord = prog(["soal4", "soal5"], b);
    // kartu: soal5 menganimasikan dua pertukaran
    let A = AWAL, sw = null;
    if (b.id === "soal5") {
      const u1 = P(l, at(b, "pertukaran pertama") + 0.6, 1.2), u2 = P(l, at(b, "pertukaran kedua") + 0.6, 1.2);
      if (u1 < 1) sw = { i: 0, j: 1, u: u1 }; else { A = swp(AWAL, 0, 1); sw = { i: 1, j: 2, u: u2 }; if (u2 >= 1) { A = swp(A, 1, 2); sw = null; } }
    }
    SX.forEach((x, i) => seat(ctx, i, x, 330, 170, null, { name: false }));
    SX.forEach((x, i) => text(ctx, NAMA[i], x, 560, 36, { align: "center", weight: 900, color: PC[i] }));
    cardsRow(ctx, A, SX, 330 + 170 * 0.38, 170 * 0.62, { swap: sw });
    card(ctx, 1060, 160, 780, 620, { fill: "#FFF8EE", stroke: ORANGE, lw: 4, r: 18 });
    text(ctx, "RENCANA SEBELUM BERMAIN", 1090, 212, 30, { weight: 900, color: C.accentDark });
    alpha(ctx, ord("soal4", () => P(l, at(b, "berapa kali"), 0.5)), () => {
      text(ctx, "Berapa kali pertukaran?", 1100, 290, 38, { weight: 900, color: INK });
      ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); rr(ctx, 1560, 245, 110, 64, 10); ctx.stroke(); ctx.setLineDash([]);
    });
    alpha(ctx, ord("soal4", () => P(l, at(b, "Satu pertukaran"), 0.5)), () => {
      text(ctx, "1 pertukaran =", 1100, 380, 34, { weight: 800, color: INK });
      text(ctx, "2 pemain saling menukar kartu", 1100, 428, 34, { weight: 800, color: INK });
    });
    if (b.id === "soal4") {
      const u = P(l, at(b, "saling menukar"), 0.8);
      mline(ctx, curve(SX[0] + 30, 610, (SX[0] + SX[1]) / 2, 700, SX[1] - 30, 610), u, ORANGE, 6, true);
      mline(ctx, curve(SX[1] - 30, 600, (SX[0] + SX[1]) / 2, 660, SX[0] + 30, 600), u, ORANGE, 6, true);
    }
    alpha(ctx, ord("soal5", () => P(l, at(b, "pemain mana"), 0.5)), () => text(ctx, "Siapa yang bertukar?", 1100, 520, 38, { weight: 900, color: INK }));
    const s1 = ord("soal5", () => P(l, at(b, "pertukaran pertama"), 0.5)), s2 = ord("soal5", () => P(l, at(b, "pertukaran kedua"), 0.5));
    alpha(ctx, s1, () => { text(ctx, "1.", 1110, 600, 36, { weight: 900, color: INK }); text(ctx, swLabel(0, 1), 1160, 600, 38, { weight: 900, color: SWC["0-1"] }); });
    alpha(ctx, s2, () => { text(ctx, "2.", 1110, 670, 36, { weight: 900, color: INK }); text(ctx, swLabel(1, 2), 1160, 670, 38, { weight: 900, color: SWC["1-2"] }); });
    hand(ctx, "contoh", 1700, 600, 30, { alpha: s1, color: GRAY });
  }

  // ---------- pilihan ----------
  const OPT = [
    "Bert hanya perlu memastikan jumlah pertukaran genap, tidak peduli pertukaran mana yang dilakukan.",
    "Berapa pun banyaknya pertukaran, Bert harus selalu bertukar kartu dengan Corry.",
    "Bert hanya perlu menjamin jumlah pertukaran ganjil dengan Corry.",
    "Berapa pun banyaknya pertukaran, Bert tidak boleh bertukar kartu dengan Corry.",
  ];
  function optRow(ctx, i, x, y, w, h, st = {}, fs = 32) {
    ctx.save(); if (st.dim) ctx.globalAlpha *= 1 - 0.55 * st.dim; if (st.alpha != null) ctx.globalAlpha *= clamp(st.alpha, 0, 1);
    card(ctx, x, y, w, h, { fill: st.good ? "#E8F6EC" : st.hl ? "#FFF6E0" : "#F7F9FA", stroke: st.good ? GREEN : st.hl ? ORANGE : "#C9D2D8", lw: st.good || st.hl ? 5 : 2.5, r: 18 });
    ctx.fillStyle = st.good ? GREEN : INK; ctx.beginPath(); ctx.arc(x + 50, y + h / 2, 30, 0, Math.PI * 2); ctx.fill();
    text(ctx, "ABCD"[i], x + 50, y + h / 2 + 13, 36, { align: "center", weight: 900, color: "#FFFFFF" });
    ctx.font = `700 ${fs}px ${K.FONT}`;
    const n = (() => { const words = OPT[i].split(" "); let c = "", k = 1; for (const wd of words) { const t2 = c ? c + " " + wd : wd; if (ctx.measureText(t2).width > w - 130 && c) { k++; c = wd; } else c = t2; } return k; })();
    para(ctx, OPT[i], x + 100, y + h / 2 + fs * 0.36 - (n - 1) * fs * 0.62, fs, w - 130, { weight: 700, color: INK, lh: 1.24 });
    ctx.restore();
    const bx = x + w - 8, by = y + 8, br = 26;
    if (st.strike || st.tick) { ctx.save(); ctx.globalAlpha *= clamp((st.strike || st.tick) * 3, 0, 1); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = st.tick ? GREEN : RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore(); }
    if (st.strike) cross(ctx, bx, by, br * 1.5, st.strike, RED, 7);
    if (st.tick) tick(ctx, bx, by + 2, br * 1.4, st.tick, GREEN, 7);
    if (st.ring) ring(ctx, x + w / 2, y + h / 2, w / 2 + 16, h * 0.64, st.ring, GREEN, 6);
  }
  function pilihan(ctx, b, l) {
    board(ctx);
    const ord = prog(["soal6", "soal7", "soal8"], b);
    alpha(ctx, ord("soal6", () => P(l, at(b, "Satu-satunya"), 0.5)), () => text(ctx, "Satu-satunya tujuan Bert: membuat Corry kalah.", 960, 205, 44, { align: "center", weight: 900, color: INK, fit: 1700 }));
    alpha(ctx, ord("soal6", () => P(l, at(b, "Strategi"), 0.5)), () => text(ctx, "Strategi apa yang menjamin keberhasilan Bert?", 960, 260, 38, { align: "center", weight: 800, color: ORANGE, fit: 1700 }));
    const cue = { soal7: [["Pilihan A", 0], ["Pilihan B", 1]], soal8: [["Pilihan C", 2], ["Pilihan D", 3]] };
    let hlI = -1;
    (cue[b.id] || []).forEach(([s, i]) => { if (l >= at(b, s) - 0.2) hlI = i; });
    for (let i = 0; i < 4; i++) {
      const a = b.id === "soal6" ? P(l, at(b, "Strategi") + 0.4 + i * 0.35, 0.5) : 1;
      optRow(ctx, i, 110, 300 + i * 125, 1700, 110, { alpha: a, hl: i === hlI }, 32);
    }
  }

  // ---------- memahami tujuan ----------
  const BX = [400, 960, 1520];
  function siapa(ctx, b, l) {
    board(ctx);
    const ord = prog(["m1", "m2", "m3", "m4"], b);
    const focus = ord("m3", () => P(l, at(b, "tujuan Bert"), 0.6));
    const T1 = b.id === "m1" ? atSeq(b, ["Batu milik Anna", "Gunting milik Bert"]) : [0, 0];
    const aAB = ord("m1", () => P(l, T1[0] + 0.5, 0.8)), aBC = ord("m1", () => P(l, T1[1] + 0.5, 0.8)), aCA = ord("m2", () => P(l, at(b, "kertas milik Corry") + 0.5, 1.0));
    BX.forEach((x, i) => {
      const dim = i === 0 ? 0.65 * focus : 0;
      ctx.save(); ctx.globalAlpha *= 1 - dim;
      beaver(ctx, x, 300, 150);
      heldCard(ctx, AWAL[i], x, 300, 150, { hl: focus > 0.5 && i > 0 ? PC[i] : null });
      text(ctx, NAMA[i], x, 530, 38, { align: "center", weight: 900, color: PC[i] });
      ctx.restore();
    });
    // panah "mengalahkan" dari pemenang ke yang kalah
    const yA = 360;
    ctx.save(); ctx.globalAlpha *= 1 - 0.65 * focus;
    arrow(ctx, BX[0] + 80, yA, BX[1] - 80, yA, aAB, ORANGE, 7); hand(ctx, "mengalahkan", (BX[0] + BX[1]) / 2, yA - 22, 30, { alpha: aAB });
    ctx.restore();
    const w4c = ord("m4", () => P(l, at(b, "kalau tidak ada"), 0.6));
    ctx.save(); ctx.globalAlpha *= (1 - 0.65 * focus) * (1 - w4c);
    mline(ctx, curve(BX[2], 565, 960, 800, BX[0], 565), aCA, ORANGE, 7, true); hand(ctx, "mengalahkan", 960, 660, 30, { alpha: aCA });
    ctx.restore();
    arrow(ctx, BX[1] + 80, yA, BX[2] - 80, yA, aBC, ORANGE, 7); hand(ctx, "mengalahkan", (BX[1] + BX[2]) / 2, yA - 22, 30, { alpha: aBC });
    hand(ctx, "Setiap pemain: 1 kali menang, 1 kali kalah", 960, 195, 40, { color: INK, alpha: ord("m2", () => P(l, at(b, "setiap pemain"), 0.6)) * (1 - focus) });
    if (focus > 0) {
      alpha(ctx, focus, () => { ctx.strokeStyle = BLUE; ctx.lineWidth = 5; ctx.setLineDash([14, 10]); rr(ctx, BX[1] - 150, 225, BX[2] - BX[1] + 300, 345, 26); ctx.stroke(); ctx.setLineDash([]); });
      hand(ctx, "Yang penting: Bert lawan Corry", 1240, 200, 40, { color: BLUE, alpha: focus });
    }
    const w4 = ord("m4", () => P(l, at(b, "kalau tidak ada"), 0.6));
    alpha(ctx, w4, () => {
      card(ctx, 700, 640, 1120, 120, { fill: "#EAF2FC", stroke: BLUE, lw: 4, r: 18 });
      text(ctx, "0 pertukaran:", 740, 715, 38, { weight: 900, color: INK });
      winChip(ctx, 1, 1180, 700, 34);
      tick(ctx, 1720, 700, 70, w4, GREEN, 9);
      hand(ctx, "Bert berhasil", 1540, 715, 34, { color: GREEN });
    });
  }

  // ---------- satu pertukaran ----------
  const ONE = [[0, 1], [1, 2], [0, 2]];
  function satu(ctx, b, l) {
    board(ctx);
    const ord = prog(["t0", "t1", "t2", "t3", "t4"], b);
    card(ctx, 75, 160, 440, 560, { fill: "#EAF2FC", stroke: BLUE, lw: 3, r: 18 });
    text(ctx, "AWAL", 295, 215, 32, { align: "center", weight: 900, color: C.accentDark });
    arrMini(ctx, AWAL, 295, 400, 105, { hl: [null, PC[1], PC[2]] });
    winChip(ctx, 1, 295, 600, 30);
    const cues = { t1: "Anna dan Bert bertukar", t2: "Bert dan Corry bertukar", t3: "Anna dan Corry bertukar" };
    ONE.forEach(([i, j], c) => {
      const id = "t" + (c + 1), x0 = 545 + c * 440, cx = x0 + 210;
      ctx.strokeStyle = "#D5DCE1"; ctx.lineWidth = 2.5; ctx.setLineDash([10, 8]); rr(ctx, x0, 160, 420, 560, 18); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "Kemungkinan " + (c + 1), cx, 210, 28, { align: "center", weight: 800, color: GRAY });
      text(ctx, swLabel(i, j), cx, 260, 36, { align: "center", weight: 900, color: SWC[i + "-" + j] });
      const u = ord(id, () => P(l, at(b, cues[id]) + 0.4, 1.2));
      const app = ord(id, () => P(l, at(b, cues[id]) - 0.3, 0.5));
      if (app <= 0) { text(ctx, "?", cx, 460, 120, { align: "center", weight: 900, color: "#D5DCE1" }); return; }
      const A = u >= 1 ? swp(AWAL, i, j) : AWAL;
      const fin = u >= 1;
      alpha(ctx, app, () => arrMini(ctx, A, cx, 400, 105, { swap: fin ? null : { i, j, u }, hl: fin ? [null, PC[1], PC[2]] : null }));
      const wa = ord(id, () => P(l, at(b, "jadi Corry") , 0.5));
      winChip(ctx, 2, cx, 600, 30, wa);
      hand(ctx, KATA[A[2]] + " mengalahkan " + KATA[A[1]], cx, 670, 28, { color: PC[2], alpha: wa });
    });
    if (b.id === "t0") thinkBadge(ctx, 545, 735, 900, 90, l, b.dur, "1 pertukaran: siapa yang menang?");
    const r4 = ord("t4", () => P(l, at(b, "selalu membuat"), 0.8));
    if (r4 > 0) {
      [0, 1, 2].forEach(c => ring(ctx, 755 + c * 440, 600, 150, 46, r4, ORANGE, 5));
      hand(ctx, "1 pertukaran apa pun → Corry menang", 1200, 790, 38, { color: ORANGE, alpha: r4 });
    }
  }

  // ---------- rantai beberapa pertukaran ----------
  const CHAIN = [[0, 1], [0, 2], [1, 2]];
  const chainStates = () => { const S = [AWAL]; CHAIN.forEach(([i, j]) => S.push(swp(S[S.length - 1], i, j))); return S; };
  function dua(ctx, b, l) {
    board(ctx);
    const ord = prog(["t5", "t6", "t7"], b), S = chainStates(), CX = [240, 713, 1186, 1659], cw = 92, cy = 380;
    const T5 = b.id === "t5" ? atSeq(b, ["Anna dan Bert bertukar", "Corry menang", "Anna dan Corry bertukar", "Bert menang"]) : [0, 0, 0, 0];
    const st = [
      { app: 1, u: 1, win: 1 },
      { app: ord("t5", () => P(l, T5[0] - 0.3, 0.5)), u: ord("t5", () => P(l, T5[0] + 0.4, 1.2)), win: ord("t5", () => P(l, T5[1], 0.5)) },
      { app: ord("t5", () => P(l, T5[2] - 0.3, 0.5)), u: ord("t5", () => P(l, T5[2] + 0.4, 1.2)), win: ord("t5", () => P(l, T5[3], 0.5)) },
      { app: ord("t6", () => P(l, at(b, "antara Bert dan Corry") - 0.3, 0.5)), u: ord("t6", () => P(l, at(b, "antara Bert dan Corry") + 0.4, 1.2)), win: ord("t6", () => P(l, at(b, "Corry menang"), 0.5)) },
    ];
    S.forEach((A, k) => {
      const s = st[k]; if (s.app <= 0) return;
      alpha(ctx, s.app, () => {
        text(ctx, k + " pertukaran", CX[k], 215, 32, { align: "center", weight: 900, color: INK });
        if (k > 0) {
          const [i, j] = CHAIN[k - 1];
          arrow(ctx, CX[k - 1] + 170, cy, CX[k] - 170, cy, 1, SWC[i + "-" + j], 6);
          text(ctx, NAMA[i] + " ↔", (CX[k - 1] + CX[k]) / 2, cy - 62, 24, { align: "center", weight: 900, color: SWC[i + "-" + j] });
          text(ctx, NAMA[j], (CX[k - 1] + CX[k]) / 2, cy - 32, 24, { align: "center", weight: 900, color: SWC[i + "-" + j] });
        }
        const done = s.u >= 1;
        const base = k === 0 ? A : (done ? A : S[k - 1]);
        arrMini(ctx, base, CX[k], cy, cw, { swap: k > 0 && !done ? { i: CHAIN[k - 1][0], j: CHAIN[k - 1][1], u: s.u } : null, hl: done ? [null, PC[1], PC[2]] : null });
      });
      winChip(ctx, winBC(A), CX[k], 560, 28, s.win);
    });
    if (b.id === "t7") {
      const T = atSeq(b, ["berbalik", "Mula-mula"]);
      for (let k = 0; k < 3; k++) {
        const u = P(l, T[0] + k * 0.5, 0.6);
        mline(ctx, curve(CX[k] + 40, 600, (CX[k] + CX[k + 1]) / 2, 690, CX[k + 1] - 40, 600), u, ORANGE, 5, true);
        hand(ctx, "berbalik", (CX[k] + CX[k + 1]) / 2, 700, 28, { alpha: u });
      }
      hand(ctx, "Setiap pertukaran membalik pemenang.", 960, 790, 42, { color: INK, alpha: P(l, T[1], 0.6) });
    }
  }

  // ---------- enam susunan ----------
  const LG = [["R", "S", "P"], ["P", "R", "S"], ["S", "P", "R"]];   // Bert menang
  const RG = [["S", "R", "P"], ["R", "P", "S"], ["P", "S", "R"]];   // Corry menang
  const key = A => A.join("");
  const EDGES = [];   // {l, r, i, j}
  LG.forEach((A, li) => ONE.forEach(([i, j]) => { const B2 = swp(A, i, j); const ri = RG.findIndex(R => key(R) === key(B2)); EDGES.push({ l: li, r: ri, i, j }); }));
  const GY = [300, 480, 660], LX = 400, RX = 1520, gw = 80;
  function enam(ctx, b, l) {
    board(ctx);
    const ord = prog(["g1", "g2", "g3", "g4"], b);
    if (b.id === "g1") {
      kiko(ctx, 520, 520, 230, 0, { mood: "confused" });
      hand(ctx, "Apakah selalu benar?", 1180, 380, 64, { color: ORANGE, alpha: P(l, 0.3, 0.6) });
      hand(ctx, "Beberapa contoh belum tentu cukup.", 1180, 480, 40, { color: INK, alpha: P(l, at(b, "Kita tidak boleh"), 0.6) });
      hand(ctx, "→ periksa semua kemungkinan", 1180, 560, 40, { color: GREEN, alpha: P(l, at(b, "periksa semua"), 0.6) });
      return;
    }
    const T2 = b.id === "g2" ? atSeq(b, ["enam cara", "Di kiri", "di kanan"]) : [0, 0, 0];
    const aL = ord("g2", () => P(l, T2[1], 0.6)), aR = ord("g2", () => P(l, T2[2], 0.6)), a6 = ord("g2", () => P(l, T2[0], 0.6));
    const boxes = [[LX, LG, 1, aL], [RX, RG, 2, aR]];
    boxes.forEach(([cx, G, who, a]) => {
      alpha(ctx, Math.max(a, a6 * 0.999), () => {
        card(ctx, cx - 250, 165, 500, 645, { fill: a > 0.5 ? (who === 1 ? "#EAF2FC" : "#E6F4F4") : "#F7F9FA", stroke: a > 0.5 ? PC[who] : "#C9D2D8", lw: 4, r: 20 });
        G.forEach((A, r) => arrMini(ctx, A, cx, GY[r] - 25, gw, { word: false }));
      });
      alpha(ctx, a, () => winChip(ctx, who, cx, 205, 28));
    });
    // garis pertukaran
    const pt = (side, r, k) => [side === 0 ? LX + gw * 1.6 + 20 : RX - gw * 1.6 - 20, GY[r] - 25 + (k - 1) * 22];
    const kOf = e => ONE.findIndex(([i, j]) => i === e.i && j === e.j);
    const g3 = ord("g3", () => P(l, at(b, "tiga garis"), 1.0));
    const g4 = ord("g4", () => P(l, 0.3, 2.4));
    EDGES.forEach((e, n) => {
      const k = kOf(e);
      const u = e.l === 0 ? g3 : clamp(g4 * 3 - (n - 3) / 6 * 2, 0, 1);
      if (u <= 0) return;
      const p0 = pt(0, e.l, k), p1 = pt(1, e.r, k);
      mline(ctx, [p0, p1], u, SWC[e.i + "-" + e.j], 5);
      if (u >= 1) { ctx.fillStyle = SWC[e.i + "-" + e.j]; for (const p of [p0, p1]) { ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, Math.PI * 2); ctx.fill(); } }
    });
    const lg = ord("g3", () => P(l, at(b, "garis"), 0.6));
    alpha(ctx, lg, () => ONE.forEach(([i, j], k) => {
      const y = 715 + k * 34;
      mline(ctx, [[790, y - 9], [850, y - 9]], 1, SWC[i + "-" + j], 6);
      text(ctx, swLabel(i, j), 870, y, 26, { weight: 900, color: SWC[i + "-" + j] });
    }));
    const h4 = ord("g4", () => P(l, at(b, "menyeberang"), 0.6));
    alpha(ctx, h4, () => { ctx.fillStyle = "rgba(255,255,255,0.92)"; rr(ctx, 690, 168, 540, 60, 12); ctx.fill(); });
    hand(ctx, "semua garis menyeberang!", 960, 212, 38, { color: ORANGE, alpha: h4 });
  }

  // ---------- saklar ----------
  function saklar(ctx, b, l) {
    board(ctx);
    if (b.id === "g5") {
      const T = atSeq(b, ["Sekali ditekan", "Dua kali ditekan"]);
      const n = (l >= T[0] + 0.4 ? 1 : 0) + (l >= T[1] + 0.4 ? 1 : 0);
      const press = Math.max(P(l, T[0] + 0.1, 0.3) * (1 - P(l, T[0] + 0.45, 0.3)), P(l, T[1] + 0.1, 0.3) * (1 - P(l, T[1] + 0.45, 0.3)));
      // saklar
      ctx.fillStyle = "#F3F6F8"; ctx.strokeStyle = "#9AA6AE"; ctx.lineWidth = 4; rr(ctx, 330, 300, 220, 330, 24); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#5B636B"; rr(ctx, 380, 360, 120, 210, 16); ctx.fill(); ctx.stroke();
      const up = n % 2 === 0; ctx.fillStyle = "#D5DCE1"; rr(ctx, 392, up ? 372 : 466, 96, 92, 12); ctx.fill(); ctx.stroke();
      // tangan menekan
      ctx.fillStyle = "#E8B98E"; ctx.strokeStyle = "#8E5B3A"; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(600 - press * 70, 470, 50, 24, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      text(ctx, "ditekan: " + n + " kali", 440, 700, 36, { align: "center", weight: 900, color: INK });
      // lampu pemenang
      const who = n % 2 === 0 ? 1 : 2;
      ctx.fillStyle = PC[who] + "33"; ctx.beginPath(); ctx.arc(1200, 420, 170, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = PC[who]; ctx.beginPath(); ctx.arc(1200, 420, 110, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#9AA6AE"; rr(ctx, 1160, 525, 80, 60, 10); ctx.fill();
      text(ctx, NAMA[who], 1200, 440, 54, { align: "center", weight: 900, color: "#FFFFFF" });
      winChip(ctx, who, 1200, 680, 36);
      hand(ctx, n === 1 ? "berbalik!" : n === 2 ? "kembali seperti semula" : "", 1200, 780, 40, { color: ORANGE });
      return;
    }
    const T = atSeq(b, ["dimulai", "genap, Bert", "ganjil, Corry", "Siapa yang bertukar"]);
    text(ctx, "Jumlah pertukaran", 120, 250, 34, { weight: 900, color: INK });
    text(ctx, "Pemenang", 120, 360, 34, { weight: 900, color: INK });
    for (let n = 0; n < 6; n++) {
      const x = 600 + n * 215, a = P(l, T[0] + n * 0.35, 0.4);
      const ev = n % 2 === 0, hlE = P(l, T[1], 0.5) * (ev ? 1 : 0) + P(l, T[2], 0.5) * (ev ? 0 : 1);
      alpha(ctx, a, () => {
        if (hlE > 0) { ctx.save(); ctx.globalAlpha *= hlE; ctx.fillStyle = ev ? "#EAF2FC" : "#E6F4F4"; rr(ctx, x - 100, 190, 200, 230, 14); ctx.fill(); ctx.restore(); }
        text(ctx, String(n), x, 262, 50, { align: "center", weight: 900, color: INK });
        chip(ctx, NAMA[ev ? 1 : 2], x, 345, 30, PC[ev ? 1 : 2]);
      });
    }
    alpha(ctx, P(l, T[1], 0.5), () => { text(ctx, "genap", 160, 540, 54, { weight: 900, color: PC[1] }); text(ctx, "→  Bert menang", 420, 540, 54, { weight: 900, color: PC[1] }); });
    alpha(ctx, P(l, T[2], 0.5), () => { text(ctx, "ganjil", 160, 630, 54, { weight: 900, color: PC[2] }); text(ctx, "→  Corry menang", 420, 630, 54, { weight: 900, color: PC[2] }); });
    hand(ctx, "Siapa yang bertukar? Tidak penting!", 1350, 760, 44, { color: ORANGE, alpha: P(l, T[3], 0.6) });
  }

  // ---------- memeriksa pilihan ----------
  function cek(ctx, b, l) {
    board(ctx);
    const ord = prog(["p0", "p1", "p2", "p3", "p4", "p5"], b);
    const sD = ord("p1", () => P(l, at(b, "Jadi, pilihan D"), 0.6)), sB = ord("p2", () => P(l, at(b, "Jadi, pilihan B"), 0.6)), sC = ord("p3", () => P(l, at(b, "Jadi, pilihan C"), 0.6));
    const tA = ord("p4", () => P(l, at(b, "Ini sesuai"), 0.6)), rA = ord("p5", () => P(l, at(b, "pilihan A"), 0.8));
    const hl = { p1: 3, p2: 1, p3: 2, p4: 0 }[b.id];
    const st = [{ tick: tA, good: tA > 0.5, ring: rA, hl: hl === 0 }, { strike: sB, dim: sB, hl: hl === 1 && sB < 0.5 }, { strike: sC, dim: sC, hl: hl === 2 && sC < 0.5 }, { strike: sD, dim: sD, hl: hl === 3 && sD < 0.5 }];
    for (let i = 0; i < 4; i++) optRow(ctx, i, 85, 165 + i * 150, 1000, 130, st[i], 28);
    // panel kanan
    const PX = 1130, PW = 710;
    if (b.id === "p0") { thinkBadge(ctx, PX, 400, PW, 120, l, b.dur, "Periksa dengan aturan genap dan ganjil."); return; }
    card(ctx, PX, 165, PW, 580, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    const cx = PX + PW / 2;
    const ex = { p1: [0, 1], p2: [1, 2], p3: [1, 2] }[b.id];
    if (ex) {
      const [i, j] = ex;
      text(ctx, "CONTOH", PX + 30, 215, 28, { weight: 900, color: C.accentDark });
      text(ctx, "1 pertukaran: " + swLabel(i, j), cx, 275, 34, { align: "center", weight: 900, color: SWC[i + "-" + j], fit: PW - 40 });
      const u = P(l, at(b, "satu pertukaran") + 0.5, 1.2);
      arrMini(ctx, u >= 1 ? swp(AWAL, i, j) : AWAL, cx, 430, 110, { swap: u >= 1 ? null : { i, j, u }, hl: u >= 1 ? [null, PC[1], PC[2]] : null });
      text(ctx, "1 = ganjil", cx, 620, 34, { align: "center", weight: 900, color: INK });
      winChip(ctx, 2, cx, 690, 32, P(l, at(b, "Corry menang"), 0.5));
      return;
    }
    text(ctx, b.id === "p5" ? "JAWABAN" : "TEMUAN KITA", PX + 30, 215, 28, { weight: 900, color: C.accentDark });
    text(ctx, "genap", PX + 50, 330, 50, { weight: 900, color: PC[1] }); text(ctx, "→ Bert menang", PX + 220, 330, 50, { weight: 900, color: PC[1], fit: 460 });
    text(ctx, "ganjil", PX + 50, 420, 50, { weight: 900, color: PC[2] }); text(ctx, "→ Corry menang", PX + 220, 420, 50, { weight: 900, color: PC[2], fit: 460 });
    hand(ctx, "siapa pun yang bertukar", cx, 500, 34, { color: GRAY });
    alpha(ctx, b.id === "p5" ? P(l, at(b, "pilihan A"), 0.6) : 0, () => {
      card(ctx, PX + 60, 560, PW - 120, 150, { fill: "#E8F6EC", stroke: GREEN, lw: 5, r: 20 });
      text(ctx, "Jawaban: A", cx, 660, 64, { align: "center", weight: 900, color: GREEN });
    });
  }

  // ---------- penutup ----------
  function invarian(ctx, b, l) {
    board(ctx);
    const ord = prog(["c1", "c2"], b);
    card(ctx, 120, 160, 1680, 200, { fill: "#FFF8EE", stroke: ORANGE, lw: 4, r: 20 });
    text(ctx, "SELALU BENAR SETELAH SETIAP PERTUKARAN", 160, 220, 30, { weight: 900, color: C.accentDark });
    alpha(ctx, ord("c1", () => P(l, at(b, "Bert menang tepat"), 0.6)), () => text(ctx, "Bert menang tepat ketika jumlah pertukaran genap.", 960, 290, 50, { align: "center", weight: 900, color: INK, fit: 1600 }));
    const iv = ord("c1", () => P(l, at(b, "disebut invarian"), 0.6));
    hand(ctx, "= invarian", 1640, 340, 40, { alpha: iv });
    // programmer
    alpha(ctx, ord("c2", () => P(l, at(b, "Programmer"), 0.6)), () => {
      const X = 140, Y = 400; ctx.fillStyle = "#3B4652"; rr(ctx, X, Y, 620, 330, 20); ctx.fill();
      ctx.fillStyle = "#1F2830"; rr(ctx, X + 18, Y + 18, 584, 294, 10); ctx.fill();
      const lines = [["urutkan(data):", "#F2B134"], ["  # invarian: bagian kiri", "#7FB069"], ["  # selalu sudah urut", "#7FB069"], ["  ...", "#E7EEF2"]];
      lines.forEach(([s, col], i) => text(ctx, s, X + 50, Y + 80 + i * 56, 32, { weight: 700, color: col }));
      tick(ctx, X + 540, Y + 250, 70, 1, GREEN, 10);
    });
    // puzzle geser 15
    alpha(ctx, ord("c2", () => P(l, at(b, "puzzle geser"), 0.6)), () => {
      const X = 1000, Y = 425, s = 74;
      ctx.fillStyle = "#7A4B2A"; rr(ctx, X - 12, Y - 12, s * 4 + 24, s * 4 + 24, 14); ctx.fill();
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        let n = r * 4 + c + 1; if (n === 16) continue; if (n === 14) n = 15; else if (n === 15) n = 14;
        const sw2 = n === 14 || n === 15;
        ctx.fillStyle = sw2 ? "#FDE7C8" : "#F6E6CF"; rr(ctx, X + c * s + 3, Y + r * s + 3, s - 6, s - 6, 10); ctx.fill();
        text(ctx, String(n), X + c * s + s / 2, Y + r * s + s / 2 + 14, 38, { align: "center", weight: 900, color: sw2 ? RED : INK });
      }
      text(ctx, "puzzle geser angka", X + s * 2, Y - 22, 30, { align: "center", weight: 900, color: INK });
      hand(ctx, "14 dan 15 tertukar:", 1360, 540, 32, { align: "left", color: RED });
      hand(ctx, "tidak bisa diselesaikan", 1360, 590, 36, { align: "left", color: RED });
    });
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Pertama", "Kedua", "Ketiga"]);
    const S = [["Baca tujuannya dengan teliti.", "Bert lawan Corry"], ["Coba langkah kecil, cari polanya.", "1 tukar → berbalik"], ["Buktikan polanya, periksa pilihan.", "6 susunan"]];
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
    [640, 960, 1280].forEach((x, i) => { beaver(ctx, x, 260, 130); heldCard(ctx, AWAL[i], x, 260, 130); text(ctx, NAMA[i], x, 440, 34, { align: "center", weight: 900, color: PC[i] }); });
    if (b.id === "h1" || b.id === "soal4") {
      card(ctx, 480, 480, 960, 360, { fill: "#FFF8EE", stroke: ORANGE, lw: 4, r: 18 });
      text(ctx, "1 pertukaran =", 960, 560, 44, { align: "center", weight: 900, color: INK });
      text(ctx, "2 pemain saling menukar kartu", 960, 620, 44, { align: "center", weight: 900, color: INK, fit: 900 });
      mline(ctx, curve(660, 700, 800, 790, 940, 700), 1, ORANGE, 6, true);
      mline(ctx, curve(940, 690, 800, 750, 660, 690), 1, ORANGE, 6, true);
      text(ctx, "Berapa kali? Siapa saja?", 1180, 770, 34, { align: "center", weight: 900, color: ORANGE });
      return;
    }
    card(ctx, 480, 480, 960, 360, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 2.5, r: 18 });
    rules(ctx, 560, 560, 800, [1, 1, 1], 0.72);
  }
  function pilihan_v(ctx, b, l) {
    board(ctx);
    text(ctx, "Tujuan Bert: membuat Corry kalah.", 960, 200, 44, { align: "center", weight: 900, color: INK, fit: 960 });
    text(ctx, "Strategi mana yang pasti berhasil?", 960, 255, 38, { align: "center", weight: 800, color: ORANGE, fit: 960 });
    const done = b.id === "h5" || b.id === "p5";
    for (let i = 0; i < 4; i++) optRow(ctx, i, 475, 295 + i * 140, 970, 125, done ? (i === 0 ? { tick: 1, good: true, ring: 1 } : { strike: 1, dim: 1 }) : {}, 27);
  }
  function satu_v(ctx, b, l) {
    board(ctx);
    text(ctx, "Awal", 520, 250, 34, { weight: 900, color: INK });
    arrMini(ctx, AWAL, 860, 250, 66, { word: false, hl: [null, PC[1], PC[2]] });
    winChip(ctx, 1, 1270, 250, 26);
    text(ctx, "Setelah 1 pertukaran:", 520, 380, 34, { weight: 900, color: INK });
    ONE.forEach(([i, j], r) => {
      const y = 480 + r * 125, A = swp(AWAL, i, j);
      text(ctx, NAMA[i] + " ↔", 510, y - 6, 28, { weight: 900, color: SWC[i + "-" + j] });
      text(ctx, NAMA[j], 510, y + 28, 28, { weight: 900, color: SWC[i + "-" + j] });
      arrMini(ctx, A, 860, y, 66, { word: false, hl: [null, PC[1], PC[2]] });
      winChip(ctx, 2, 1270, y, 26);
    });
  }
  function dua_v(ctx, b, l) {
    board(ctx);
    const S = chainStates();
    S.forEach((A, k) => {
      const y = 215 + k * 172;
      text(ctx, k + " tukar", 500, y + 12, 34, { weight: 900, color: INK });
      if (k > 0) { const [i, j] = CHAIN[k - 1]; text(ctx, "(" + NAMA[i] + " ↔ " + NAMA[j] + ")", 500, y + 50, 22, { weight: 800, color: SWC[i + "-" + j] }); }
      arrMini(ctx, A, 900, y, 66, { word: false, hl: [null, PC[1], PC[2]] });
      winChip(ctx, winBC(A), 1290, y, 26);
      if (k < 3) mline(ctx, curve(1400, y + 25, 1440, y + 86, 1400, y + 147), 1, ORANGE, 4, true);
    });
  }

  Object.assign(K.SCENES, {
    soal, tukar, pilihan, siapa, satu, dua, enam, saklar, cek, invarian, langkah,
    soal_v, pilihan_v, satu_v, dua_v,
    buka(ctx, b, l) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "Selamat datang"), 0.8) : 1;
      alpha(ctx, bu, () => [960, 1230, 1500].forEach((x, i) => { beaver(ctx, x, 470, 130); heldCard(ctx, AWAL[i], x, 470, 130); text(ctx, NAMA[i], x, 650, 30, { align: "center", weight: 900, color: PC[i] }); }));
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
      const fu = P(l, at(b, "Brasil"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagBR(ctx, 470, 230, 180); ctx.restore(); }
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
      const rw = tw(ctx, "Tim Bebras " + META.negara, 44, 900);
      if (au > 0) ring(ctx, 1000 + rw / 2, 300 + 2 * 92 - 14, rw / 2 + 40, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 230, 520, 200, 0, { wave: l, mood: "happy" });
      [470, 690, 910].forEach((x, i) => { const y = 440 + Math.sin(l * 3 + i) * 8; beaver(ctx, x, y, 115); heldCard(ctx, AWAL[i], x, y, 115); text(ctx, NAMA[i], x, 610, 28, { align: "center", weight: 900, color: PC[i] }); });
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1330, y, 34, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 470 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 640, 760, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 64, { align: "center", weight: 900, color: INK, fit: 1000 });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Mengapa genap selalu berhasil?", 960, 500, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
