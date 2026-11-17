/* SG04 Pembahasan Soal Bebras 2025-JP-05 "Membawa Tongkat" (Jepang), kategori Siaga.
   Gaya papan tulis putih dengan coretan spidol (sama dengan SG01–SG03) + simulasi:
   tiga lampu bohlam (kiri 4, tengah 2, kanan 1 tongkat), tongkat kayu, kartu titik 4-2-1 yang dibuka/ditutup,
   tabel delapan pola lampu (0–7) dan bilangan biner. Lampu menyala kuning bersinar, mati abu-abu; nilai lampu ditulis spidol biru.
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
  // ---------- SG04: lampu, tongkat, kartu titik ----------
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", BLUE = "#2F7FD1",
        GRAYT = "#8A96A0", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Membawa Tongkat", tahun: "2025", negara: "Jepang", kode: "2025-JP-05" };
  const VAL = [4, 2, 1], POS = ["kiri", "tengah", "kanan"];
  const Q = [1, 1, 0];   // pola pertanyaan: kiri dan tengah menyala, kanan mati

  // lampu bohlam; cx,cy = pusat kaca; r = jari-jari kaca. on 0..1 (boleh pecahan untuk transisi)
  function bulb(ctx, cx, cy, r, on, opt = {}) {
    on = clamp(on, 0, 1);
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    if (on > 0 && opt.glow) { const g = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 2); g.addColorStop(0, `rgba(255,226,64,${0.55 * on * opt.glow})`); g.addColorStop(1, "rgba(255,226,64,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r * 2, 0, Math.PI * 2); ctx.fill(); }
    // dudukan (ulir)
    const bw = r * 0.78, by = cy + r * 0.78;
    ctx.fillStyle = "#C9CED3"; ctx.strokeStyle = "#5E666D"; ctx.lineWidth = Math.max(2, r * 0.05);
    rr(ctx, cx - bw / 2, by, bw, r * 0.5, r * 0.08); ctx.fill(); ctx.stroke();
    for (let k = 1; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(cx - bw / 2, by + k * r * 0.16); ctx.lineTo(cx + bw / 2, by + k * r * 0.16); ctx.stroke(); }
    ctx.fillStyle = "#5E666D"; ctx.beginPath(); ctx.arc(cx, by + r * 0.55, r * 0.16, 0, Math.PI); ctx.fill();
    // kaca
    const off = [217, 220, 223], onc = [255, 236, 64];
    const col = off.map((v, i) => Math.round(lerp(v, onc[i], on)));
    ctx.fillStyle = `rgb(${col})`; ctx.strokeStyle = on > 0.5 ? "#9C7E00" : "#6F777E"; ctx.lineWidth = Math.max(2.5, r * 0.06);
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI * 0.72, Math.PI * 2.28); ctx.lineTo(cx + bw / 2, by); ctx.lineTo(cx - bw / 2, by); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = on > 0.5 ? "#B08A00" : "#9AA2A8"; ctx.lineWidth = Math.max(2, r * 0.04);
    ctx.beginPath(); ctx.moveTo(cx - r * 0.2, by); ctx.lineTo(cx - r * 0.2, cy + r * 0.1); ctx.lineTo(cx - r * 0.1, cy - r * 0.05); ctx.lineTo(cx, cy + r * 0.1); ctx.lineTo(cx + r * 0.1, cy - r * 0.05); ctx.lineTo(cx + r * 0.2, cy + r * 0.1); ctx.lineTo(cx + r * 0.2, by); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.beginPath(); ctx.ellipse(cx - r * 0.45, cy - r * 0.35, r * 0.12, r * 0.28, 0.5, 0, Math.PI * 2); ctx.fill();
    // sinar (seperti di soal: garis pendek di atas lampu)
    if (on > 0.5) {
      ctx.strokeStyle = "#F2A81D"; ctx.lineWidth = Math.max(3, r * 0.08); ctx.lineCap = "round"; ctx.globalAlpha *= (on - 0.5) * 2;
      [-0.6, 0, 0.6].forEach(f => { const a = -Math.PI / 2 + f, r1 = r * 1.22, r2 = r * 1.55; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); ctx.stroke(); });
    }
    ctx.restore();
  }
  // tiga lampu berjajar; st = [kiri, tengah, kanan] (0..1); gap = jarak pusat
  function bulbs(ctx, st, cx, cy, r, gap, opt = {}) { st.forEach((o, i) => bulb(ctx, cx + (i - (st.length - 1) / 2) * gap, cy, r, o, { glow: opt.glow ? opt.glow[i] : 0, alpha: opt.alpha })); }
  // tongkat kayu tegak; x,y = tengah atas; h tinggi
  function stick(ctx, x, y, h, opt = {}) {
    const w = h * 0.2;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = "#8B4A1C"; ctx.strokeStyle = "#4A2610"; ctx.lineWidth = Math.max(2, h * 0.025);
    rr(ctx, x - w / 2, y, w, h, w * 0.35); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "rgba(60,28,8,0.55)"; ctx.lineWidth = Math.max(1.5, h * 0.015);
    ctx.beginPath(); ctx.moveTo(x - w * 0.12, y + h * 0.12); ctx.lineTo(x - w * 0.12, y + h * 0.5); ctx.moveTo(x + w * 0.18, y + h * 0.45); ctx.lineTo(x + w * 0.18, y + h * 0.88); ctx.stroke();
    ctx.fillStyle = "#B97A45"; ctx.beginPath(); ctx.ellipse(x, y + h * 0.03, w * 0.38, h * 0.025, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // n tongkat berjajar mulai x (pusat tongkat pertama); show(i) = alpha tiap tongkat
  function sticks(ctx, n, x, y, h, gap, show) { for (let i = 0; i < n; i++) { const a = show ? show(i) : 1; if (a > 0) stick(ctx, x + i * gap, y - (1 - a) * 20, h, { alpha: a }); } }
  function arrowR(ctx, x1, x2, y, color = INK, w = 5) { mline(ctx, [[x1, y], [x2, y]], 1, color, w, true); }
  function valTxt(ctx, s, x, y, size, a = 1, color = BLUE) { hand(ctx, s, x, y, size, { color, alpha: a }); }
  // Bi-taro: berang-berang memeluk tongkat
  function bitaro(ctx, x, y, s, opt = {}) {
    beaver(ctx, x, y, s, { alpha: opt.alpha });
    const k = s / 100;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1); ctx.translate(x, y); ctx.scale(k, k);
    const n = opt.n || 1;
    for (let i = 0; i < n; i++) {
      const yy = 22 - (n - 1) * 4.5 + i * 9;
      ctx.save(); ctx.translate(0, yy); ctx.rotate(-0.08);
      ctx.fillStyle = "#8B4A1C"; ctx.strokeStyle = "#4A2610"; ctx.lineWidth = 2; rr(ctx, -46, -5, 92, 10, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#B97A45"; ctx.beginPath(); ctx.ellipse(46, 0, 2.5, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    ctx.fillStyle = FUR; ctx.strokeStyle = "#3A2618"; ctx.lineWidth = 2;
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 22, 20, 8, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  }
  function flagJP(ctx, x, y, w) {   // bendera Jepang: lingkaran merah di atas putih
    const h = w * 2 / 3;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#BC002D"; ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, h * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }
  function blink(l, t0) { return l >= t0 && l < t0 + 1.6 ? 0.5 + 0.5 * Math.sin((l - t0) * 9) : 0; }

  // ---------- soal utuh ----------
  // baris contoh: [pola lampu, banyak tongkat]
  const EX = [[[0, 0, 1], 1], [[0, 1, 0], 2], [[1, 0, 0], 4], [[0, 1, 1], 3]];
  function exRow(ctx, i, x, y, a = 1, sc = 1) {   // x = pusat lampu kiri, y = pusat kaca
    alpha(ctx, a, () => {
      bulbs(ctx, EX[i][0], x + 90 * sc, y, 36 * sc, 90 * sc);
      arrowR(ctx, x + 250 * sc, x + 320 * sc, y + 10 * sc, INK, 5 * sc);
      sticks(ctx, EX[i][1], x + 370 * sc, y - 50 * sc, 110 * sc, 32 * sc);
    });
  }
  function qPanel(ctx, x, y, w, h, l, opt = {}) {
    card(ctx, x, y, w, h, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
    text(ctx, "TANTANGAN", x + w / 2, y + 58, 34, { align: "center", weight: 900, color: C.accentDark });
    bulbs(ctx, Q, x + w / 2, y + 180, 58, 150);
    text(ctx, "Berapa tongkat?", x + w / 2, y + 340, 36, { align: "center", weight: 800, color: INK });
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 3; rr(ctx, x + w / 2 - 150, y + 375, 300, 100, 14); ctx.fill(); ctx.stroke();
    text(ctx, opt.ans || "? tongkat", x + w / 2, y + 443, 46, { align: "center", weight: 900, color: opt.ans ? GREEN : GRAYT });
  }
  function soal(ctx, b, l) {
    board(ctx);
    const ord = prog(["soal1", "soal2", "soal3", "soal4", "soal5", "soal6"], b, l);
    alpha(ctx, ord("soal1", () => P(l, at(b, "Ini adalah"), 0.8)), () => {
      bitaro(ctx, 290, 470, 300);
      text(ctx, "Bi-taro", 290, 720, 44, { align: "center", weight: 900, color: FUR });
    });
    if (b.id === "soal2") {   // tiga lampu besar dengan nama posisinya
      const a = P(l, at(b, "tiga lampu"), 0.6);
      alpha(ctx, a, () => bulbs(ctx, [0, 0, 0], 960, 380, 80, 230));
      POS.forEach((p, i) => hand(ctx, p, 960 + (i - 1) * 230, 560, 46, { color: INK, alpha: P(l, at(b, "lampu " + p), 0.5) }));
      hand(ctx, "berapa tongkat?", 960, 680, 46, { color: ORANGE, alpha: P(l, at(b, "berapa tongkat"), 0.6) });
      return;
    }
    if (ord("soal3") <= 0) return;
    // kolom contoh
    POS.forEach((p, i) => text(ctx, p, 650 + (i - 1) * 90, 200, 21, { align: "center", weight: 800, color: GRAYT }));
    const T3 = b.id === "soal3" ? atSeq(b, ["lampu kanan", "lampu tengah", "lampu kiri"]) : null;
    for (let i = 0; i < 4; i++) {
      const a = i < 3 ? ord("soal3", () => P(l, T3[i], 0.5)) : ord("soal4", () => P(l, at(b, "Contohnya"), 0.5));
      exRow(ctx, i, 560, 270 + i * 135, a, 1);
    }
    const qa = ord("soal5", () => P(l, 0.3, 0.6));
    alpha(ctx, qa, () => qPanel(ctx, 1240, 170, 580, 520, l));
    if (b.id === "soal6") hand(ctx, "tanpa menebak!", 1530, 760, 42, { color: ORANGE, alpha: P(l, at(b, "tanpa"), 0.5) });
  }

  // ---------- memahami aturan ----------
  const BX = [660, 960, 1260];
  function nilai(ctx, b, l) {
    board(ctx);
    const off = b.id === "a2" ? P(l, at(b, "Kalau sebuah lampu mati"), 0.6) : 0;
    bulbs(ctx, [1, 1, 1 - off], 960, 360, 95, 300);
    POS.forEach((p, i) => text(ctx, p, BX[i], 540, 30, { align: "center", weight: 800, color: GRAYT }));
    const T = b.id === "a1" ? atSeq(b, ["Lampu kanan", "lampu tengah", "lampu kiri"]) : null;
    [2, 1, 0].forEach((i, k) => {
      const a = b.id === "a1" ? P(l, T[k], 0.5) : 1;
      valTxt(ctx, String(VAL[i]), BX[i], 650, 92, a * (i === 2 ? 1 - off : 1));
    });
    if (off > 0) { valTxt(ctx, "0", BX[2], 650, 92, off, GRAYT); hand(ctx, "mati = tidak menambah", 1590, 470, 40, { color: RED, alpha: off }); }
    if (b.id === "a2") { const a = P(l, at(b, "selalu bernilai empat"), 0.5); ring(ctx, BX[0], 620, 70, 64, a, ORANGE, 6); hand(ctx, "selalu 4", BX[0] - 190, 640, 40, { alpha: a }); }
    kiko(ctx, 1660, 650, 170, 0, { mood: "happy" });
    text(ctx, "tongkat", 960, 730, 30, { align: "center", weight: 700, color: GRAYT });
  }
  function contoh4(ctx, b, l) {
    board(ctx);
    const ord = prog(["a3", "a4", "a5"], b, l);
    card(ctx, 90, 170, 470, 230, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 16 });
    text(ctx, "Contoh keempat di soal", 325, 215, 26, { align: "center", weight: 800, color: C.ink2 });
    exRow(ctx, 3, 135, 300, 1, 0.85);
    const X = [760, 960, 1160];
    bulbs(ctx, [0, 1, 1], 960, 260, 78, 200);
    const T = b.id === "a3" ? atSeq(b, ["dua tongkat", "satu tongkat lagi", "Dua ditambah"]) : [0, 0, 0];
    valTxt(ctx, "0", X[0], 455, 60, 1, GRAYT);
    const s2 = ord("a3", () => P(l, T[0], 0.5)), s1 = ord("a3", () => P(l, T[1], 0.5)), eq = ord("a3", () => P(l, T[2], 0.5));
    valTxt(ctx, "2", X[1], 455, 60, s2); valTxt(ctx, "1", X[2], 455, 60, s1);
    sticks(ctx, 2, X[1] - 20, 480, 130, 40, () => s2); sticks(ctx, 1, X[2], 480, 130, 40, () => s1);
    hand(ctx, "2 + 1 = 3", 960, 730, 56, { color: INK, alpha: eq });
    if (b.id === "a4" || ord("a4") === 1) {
      const T4 = b.id === "a4" ? at(b, "memang") : 0;
      [[X[1] - 20, 1], [X[1] + 20, 2], [X[2], 3]].forEach(([x, n], k) => text(ctx, String(n), x, 655, 34, { align: "center", weight: 900, color: ORANGE }));
      const tk = ord("a4", () => P(l, at(b, "sudah benar"), 0.5));
      tick(ctx, 600, 300, 70, tk, GREEN, 10);
      void T4;
    }
    const a5 = b.id === "a5";
    if (a5) {
      const c1 = P(l, at(b, "tidak menghitung"), 0.5), c2 = P(l, at(b, "Yang kita jumlahkan"), 0.5);
      alpha(ctx, c1, () => { hand(ctx, "2 lampu menyala", 1560, 330, 40, { color: INK }); mline(ctx, [[1395, 318], [1725, 318]], P(l, at(b, "tidak menghitung") + 0.5, 0.5), RED, 7); hand(ctx, "→ 2 tongkat? ✗", 1560, 390, 34, { color: RED }); });
      alpha(ctx, c2, () => { para(ctx, "jumlahkan angka lampu yang menyala", 1560, 520, 36, 380, { align: "center", weight: 800, color: GREEN }); ring(ctx, 1560, 540, 220, 90, P(l, at(b, "Yang kita jumlahkan") + 0.4, 0.8), GREEN, 6); });
    }
  }

  // ---------- pemanasan: kartu titik ----------
  const DOTS = { 4: [[-0.25, -0.22], [0.25, -0.22], [-0.25, 0.22], [0.25, 0.22]], 2: [[0, -0.22], [0, 0.22]], 1: [[0, 0]] };
  function dotCard(ctx, cx, cy, w, h, n, open) {   // open 0..1: 1 = terbuka, 0 = tertutup; transisi = kartu berbalik
    const face = open >= 0.5, sx = Math.max(0.04, Math.abs(open * 2 - 1));
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sx, 1);
    ctx.fillStyle = "rgba(0,0,0,0.12)"; rr(ctx, -w / 2 + 6, -h / 2 + 8, w, h, 18); ctx.fill();
    if (face) {
      ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = INK; ctx.lineWidth = 4; rr(ctx, -w / 2, -h / 2, w, h, 18); ctx.fill(); ctx.stroke();
      ctx.fillStyle = ORANGE; DOTS[n].forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(dx * w * 1.25, dy * h, w * 0.13, 0, Math.PI * 2); ctx.fill(); });
    } else {
      ctx.fillStyle = "#4F6B8A"; ctx.strokeStyle = INK; ctx.lineWidth = 4; rr(ctx, -w / 2, -h / 2, w, h, 18); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 3; rr(ctx, -w / 2 + 16, -h / 2 + 16, w - 32, h - 32, 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-w / 2 + 16, -h / 2 + 16); ctx.lineTo(w / 2 - 16, h / 2 - 16); ctx.moveTo(w / 2 - 16, -h / 2 + 16); ctx.lineTo(-w / 2 + 16, h / 2 - 16); ctx.stroke();
    }
    ctx.restore();
  }
  const KSTART = { w1: [1, 1, 1], w2: [1, 1, 1], w3: [1, 0, 1], w4: [0, 1, 1], w5: [1, 0, 1] };
  const KEV = { w2: [["Kalau kartu ditutup", 1, 0]], w3: [["Kartu kiri tertutup", 0, 0], ["Kartu tengah terbuka", 1, 1]],
                w4: [["kartu kiri terbuka", 0, 1], ["kartu tengah tertutup", 1, 0]] };
  function kartuState(b, l) {
    const s = KSTART[b.id].slice();
    (KEV[b.id] || []).forEach(([ph, i, to]) => { const p = P(l, at(b, ph), 0.7); s[i] = lerp(s[i], to, p); });
    return s;
  }
  function kartu(ctx, b, l) {
    board(ctx);
    const st = kartuState(b, l), w5 = b.id === "w5";
    const mv = w5 ? P(l, at(b, "Kartu yang terbuka"), 0.9) : 0;
    const cy = lerp(390, 285, mv), sc = lerp(1, 0.62, mv);
    const T1 = b.id === "w1" ? atSeq(b, ["Kartu pertama", "kartu kedua", "kartu ketiga"]) : null;
    VAL.forEach((n, i) => {
      const a = T1 ? P(l, T1[i], 0.5) : 1;
      alpha(ctx, a, () => dotCard(ctx, BX[i], cy, 230 * sc, 300 * sc, n, st[i]));
    });
    if (b.id === "w2") {
      hand(ctx, "terbuka = dihitung", 1640, 330, 38, { color: GREEN, alpha: P(l, at(b, "Kalau kartu dibuka"), 0.5) });
      hand(ctx, "tertutup =", 1640, 430, 38, { color: RED, alpha: P(l, at(b, "Kalau kartu ditutup"), 0.5) });
      hand(ctx, "tidak dihitung", 1640, 480, 38, { color: RED, alpha: P(l, at(b, "Kalau kartu ditutup"), 0.5) });
    }
    if (b.id === "w3" || b.id === "w4") {
      const ph = b.id === "w3" ? ["dua titik dan", "satu titik", "semuanya"] : ["empat titik dan", "satu titik", "semuanya"];
      const T = atSeq(b, ph);
      const opens = b.id === "w3" ? [1, 2] : [0, 2];
      opens.forEach((i, k) => valTxt(ctx, String(VAL[i]), BX[i], 630, 72, P(l, T[k], 0.4), ORANGE));
      hand(ctx, b.id === "w3" ? "2 + 1 = 3 titik" : "4 + 1 = 5 titik", 960, 740, 56, { color: INK, alpha: P(l, T[2], 0.5) });
    }
    if (w5) {
      const la = P(l, at(b, "Kartu yang terbuka") + 0.6, 0.6);
      alpha(ctx, la, () => bulbs(ctx, [1, 0, 1], 960, 560, 70, 300));
      hand(ctx, "terbuka = menyala", 1620, 330, 38, { color: GREEN, alpha: P(l, at(b, "sama seperti lampu yang menyala"), 0.5) });
      hand(ctx, "tertutup = mati", 1620, 420, 38, { color: RED, alpha: P(l, at(b, "sama seperti lampu yang mati"), 0.5) });
    }
  }

  // ---------- menjawab ----------
  const JX = [640, 960, 1280];
  function jawab(ctx, b, l) {
    board(ctx);
    const ord = prog(["j1", "j2", "j3", "j4", "j5", "j6"], b, l);
    const g2 = b.id === "j2" ? blink(l, at(b, "Lampu kiri")) : 0, g3 = b.id === "j3" ? blink(l, 0.3) : 0;
    bitaro(ctx, 260, 430, 220); bulbs(ctx, Q, 960, 245, 80, 320, { glow: [g2 + (b.id === "j1" || b.id === "j2" ? 0 : 0), g3, 0] });
    POS.forEach((p, i) => text(ctx, p, JX[i], 400, 28, { align: "center", weight: 800, color: GRAYT }));
    // nilai
    const zero = ord("j4", () => P(l, at(b, "tidak menambah"), 0.5));
    valTxt(ctx, "4", JX[0], 478, 70); valTxt(ctx, "2", JX[1], 478, 70); valTxt(ctx, "1", JX[2], 478, 70, 1 - zero, GRAYT);
    if (zero > 0) { valTxt(ctx, "0", JX[2], 478, 70, zero, INK); }
    if (b.id === "j1") thinkBadge(ctx, 520, 540, 880, 150, l, b.dur, "Berapa tongkat yang dibawa Bi-taro?");
    const s4 = ord("j2", () => P(l, at(b, "empat tongkat"), 0.2)), s2 = ord("j3", () => P(l, at(b, "dua tongkat"), 0.2));
    const t4 = b.id === "j2" ? at(b, "empat tongkat") : -9, t2 = b.id === "j3" ? at(b, "dua tongkat") : -9;
    const showS = (base, t0) => i => base >= 1 && t0 < 0 ? 1 : P(l, t0 + i * 0.25, 0.3);
    if (s4 > 0) sticks(ctx, 4, JX[0] - 72, 510, 120, 48, b.id === "j2" ? showS(0, t4) : () => 1);
    if (s2 > 0) sticks(ctx, 2, JX[1] - 24, 510, 120, 48, b.id === "j3" ? showS(0, t2) : () => 1);
    const eq = ord("j5", () => P(l, 0.3, 0.6));
    hand(ctx, "4 + 2 + 0 = 6", 960, 720, 60, { color: INK, alpha: eq });
    if (b.id === "j5") {   // hitung tongkat 1..6
      const t0 = at(b, "Bi-taro membawa enam") - 1.4;
      [JX[0] - 72, JX[0] - 24, JX[0] + 24, JX[0] + 72, JX[1] - 24, JX[1] + 24].forEach((x, k) => text(ctx, String(k + 1), x, 662, 30, { align: "center", weight: 900, color: ORANGE, alpha: P(l, t0 + k * 0.22, 0.2) }));
    }
    // kotak jawaban
    const ans = ord("j5", () => P(l, at(b, "Bi-taro membawa enam"), 0.5));
    card(ctx, 1520, 190, 320, 260, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 18 });
    text(ctx, "JAWABAN", 1680, 245, 30, { align: "center", weight: 900, color: C.accentDark });
    text(ctx, ans > 0.5 ? "6 tongkat" : "? tongkat", 1680, 345, 48, { align: "center", weight: 900, color: ans > 0.5 ? GREEN : GRAYT });
    if (ans > 0) ring(ctx, 1680, 330, 140, 60, ans, GREEN, 6);
    if (b.id === "j6") {
      const a = P(l, at(b, "bukan dua"), 0.5);
      hand(ctx, "2 tongkat?", 1680, 560, 46, { color: RED, alpha: a });
      cross(ctx, 1680, 545, 90, P(l, at(b, "bukan dua") + 0.4, 0.6), RED, 8);
      hand(ctx, "kiri = 4, tengah = 2", 1680, 650, 34, { color: BLUE, alpha: P(l, at(b, "tetapi lampu kiri"), 0.5) });
    }
  }

  // ---------- semua pola ----------
  const PAT = n => [(n >> 2) & 1, (n >> 1) & 1, n & 1];
  function polaRow(ctx, n, x, y, opt = {}) {   // x kiri baris, y pusat
    const hl = opt.hl || 0;
    if (hl > 0) { ctx.save(); ctx.globalAlpha *= hl; ctx.fillStyle = "#E3F5E8"; ctx.strokeStyle = GREEN; ctx.lineWidth = 4; rr(ctx, x - 10, y - 58, 770, 116, 16); ctx.fill(); ctx.stroke(); ctx.restore(); }
    bulbs(ctx, PAT(n), x + 120, y - 6, 34, 86);
    if (opt.bits > 0) text(ctx, PAT(n).join(" "), x + 330, y + 14, 40, { align: "center", weight: 900, color: BLUE, alpha: opt.bits });
    arrowR(ctx, x + 400, x + 450, y, INK, 4);
    text(ctx, n + " tongkat", x + 475, y + 14, 40, { weight: 900, color: hl > 0.5 ? GREEN : INK });
    if (opt.sum) hand(ctx, opt.sum, x + 700, y + 12, 28, { color: ORANGE, align: "center", alpha: opt.sumA });
  }
  function polaPos(n) { return n < 4 ? [130, 220 + n * 135] : [1010, 220 + (n - 4) * 135]; }
  function pola(ctx, b, l) {
    board(ctx);
    const ord = prog(["q1", "q2", "q3", "q4"], b, l);
    if (b.id === "q1") {
      bulbs(ctx, [0, 0, 0], 960, 330, 80, 230);
      hand(ctx, "?", 1300, 360, 140, { color: ORANGE });
      thinkBadge(ctx, 470, 520, 980, 150, l, b.dur, "Paling sedikit berapa? Paling banyak berapa?");
      return;
    }
    const T2 = b.id === "q2" ? atSeq(b, ["semua lampu mati", "semua lampu menyala"]) : null;
    const T3 = b.id === "q3" ? at(b, "Mari kita susun") + 0.6 : 0;
    const hl = ord("q3", () => P(l, at(b, "Lihat"), 0.5));
    const bitsT = b.id === "q4" ? at(b, "kita ganti") : 0;
    for (let n = 0; n < 8; n++) {
      let a;
      if (n === 0) a = ord("q2", () => P(l, T2[0], 0.5));
      else if (n === 7) a = ord("q2", () => P(l, T2[1], 0.5));
      else a = ord("q3", () => P(l, T3 + (n - 1) * 0.45, 0.4));
      const [x, y] = polaPos(n);
      const bits = ord("q4", () => P(l, bitsT + n * 0.35, 0.4));
      alpha(ctx, a, () => polaRow(ctx, n, x, y, { hl: n === 6 ? hl : 0, bits, }));
    }
    if (b.id === "q4") {
      const a = P(l, at(b, "Pola jawaban kita"), 0.5), [x, y] = polaPos(6);
      ring(ctx, x + 330, y + 2, 66, 40, a, ORANGE, 5);
      hand(ctx, "1 1 0 = 6", x + 330, y - 62, 34, { color: ORANGE, alpha: P(l, at(b, "ditulis menjadi"), 0.5) });
    }
  }
  function komputer(ctx, b, l) {
    board(ctx);
    const a = P(l, at(b, "bilangan biner"), 0.5);
    hand(ctx, "bilangan biner", 460, 260, 64, { color: BLUE, alpha: a });
    ring(ctx, 460, 238, 250, 62, P(l, at(b, "bilangan biner") + 0.4, 0.8), ORANGE, 6);
    bulbs(ctx, Q, 460, 420, 50, 130, { alpha: a });
    text(ctx, "1   1   0", 460, 560, 54, { align: "center", weight: 900, color: BLUE, alpha: a });
    text(ctx, "= 6", 460, 640, 50, { align: "center", weight: 900, color: INK, alpha: a });
    const ca = P(l, at(b, "Komputer menyimpan"), 0.6);
    alpha(ctx, ca, () => {
      const X = 860, Y = 170, W = 800, Hh = 480;
      ctx.fillStyle = "#3B4652"; rr(ctx, X, Y, W, Hh, 24); ctx.fill();
      ctx.fillStyle = "#1E2730"; rr(ctx, X + 24, Y + 24, W - 48, Hh - 60, 10); ctx.fill();
      ctx.fillStyle = "#3B4652"; ctx.fillRect(X + W / 2 - 40, Y + Hh, 80, 50); rr(ctx, X + W / 2 - 160, Y + Hh + 46, 320, 20, 10); ctx.fill();
      for (let r = 0; r < 7; r++) for (let c = 0; c < 14; c++) {
        const seed = (r * 37 + c * 11 + Math.floor(l * 2) * (r % 3 === 0 ? 1 : 0)) % 7;
        const on = seed < 3;
        ctx.fillStyle = on ? "#FFE240" : "#55606A"; ctx.beginPath(); ctx.arc(X + 70 + c * 51, Y + 75 + r * 52, 15, 0, Math.PI * 2); ctx.fill();
        if (on) { ctx.fillStyle = "rgba(255,226,64,0.25)"; ctx.beginPath(); ctx.arc(X + 70 + c * 51, Y + 75 + r * 52, 22, 0, Math.PI * 2); ctx.fill(); }
      }
    });
    hand(ctx, "menyala = 1, mati = 0", 1260, 770, 40, { color: ORANGE, alpha: P(l, at(b, "menyala atau mati"), 0.5) });
  }
  function delapan(ctx, b, l) {
    board(ctx);
    const nw = P(l, at(b, "ditambah satu lagi"), 0.6), x2 = P(l, at(b, "dua kali lipat"), 0.6);
    const X = [510, 810, 1110, 1410];
    bulb(ctx, X[0], 330, 85, 1, { alpha: nw });
    [1, 1, 1].forEach((o, i) => bulb(ctx, X[i + 1], 330, 85, o));
    valTxt(ctx, "8", X[0], 560, 96, P(l, at(b, "bernilai delapan"), 0.5), ORANGE);
    [4, 2, 1].forEach((v, i) => valTxt(ctx, String(v), X[i + 1], 560, 96));
    hand(ctx, "lampu baru", X[0], 205, 38, { color: ORANGE, alpha: nw });
    for (let i = 0; i < 3; i++) {
      const a = clamp(x2 * 3 - (2 - i), 0, 1), xa = X[i + 1] - 60, xb = X[i] + 60;
      mline(ctx, [[xa, 640], [(xa + xb) / 2, 690], [xb, 640]], a, BLUE, 5, true);
      hand(ctx, "×2", (xa + xb) / 2, 740, 40, { color: BLUE, alpha: a });
    }
    kiko(ctx, 1700, 600, 160, 0, { mood: "happy" });
  }

  // ---------- penutup ----------
  function langkah(ctx, b, l) {
    board(ctx);
    const T = atSeq(b, ["Pertama", "Kedua", "Ketiga"]);
    const S = ["Cari angka setiap lampu dari contoh.", "Lihat lampu mana saja yang menyala.", "Jumlahkan angka lampu yang menyala saja."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 48, { weight: 900, color: INK, fit: 1050 });
        const ix = 1560, iy = y + 70;
        bulbs(ctx, i === 0 ? [1, 1, 1] : Q, ix, iy - 4, 26, 70);
        if (i === 0) [4, 2, 1].forEach((v, k) => text(ctx, String(v), ix + (k - 1) * 70, iy + 70, 26, { align: "center", weight: 900, color: BLUE }));
        if (i === 1) { ring(ctx, ix - 35, iy - 4, 80, 40, 1, GREEN, 4); }
        if (i === 2) text(ctx, "4 + 2 = 6", ix, iy + 72, 28, { align: "center", weight: 900, color: GREEN });
      });
    });
  }
  function enam(ctx, b, l) {
    board(ctx);
    bitaro(ctx, 400, 470, 300); sticks(ctx, 6, 640, 330, 220, 58);
    hand(ctx, "6 tongkat", 640 + 145, 610, 56, { color: GREEN, alpha: P(l, at(b, "enam tongkat"), 0.5) });
    bulbs(ctx, Q, 1300, 330, 80, 230);
    valTxt(ctx, "4", 1070, 520, 80, P(l, at(b, "bernilai empat"), 0.5));
    valTxt(ctx, "2", 1300, 520, 80, P(l, at(b, "bernilai dua"), 0.5));
    valTxt(ctx, "0", 1530, 520, 80, 1, GRAYT);
    hand(ctx, "4 + 2 = 6", 1300, 660, 60, { color: INK, alpha: P(l, at(b, "bernilai dua") + 0.6, 0.5) });
  }

  // ---------- versi tegak untuk Short (area 1000×700, x 460–1460) ----------
  function soal_v(ctx, b, l) {
    board(ctx);
    bitaro(ctx, 620, 430, 220);
    text(ctx, "Bi-taro", 620, 610, 38, { align: "center", weight: 900, color: FUR });
    if (b.id === "soal2") {
      bulbs(ctx, [0, 0, 0], 1120, 330, 66, 170, { alpha: P(l, at(b, "tiga lampu"), 0.5) });
      POS.forEach((p, i) => hand(ctx, p, 1120 + (i - 1) * 170, 480, 40, { color: INK, alpha: P(l, at(b, "lampu " + p), 0.5) }));
      hand(ctx, "berapa tongkat?", 1120, 600, 42, { color: ORANGE, alpha: P(l, at(b, "berapa tongkat"), 0.5) });
      return;
    }
    for (let i = 0; i < 4; i++) exRow(ctx, i, 790, 215 + i * 150, i < 3 ? 1 : P(l, at(b, "Contohnya"), 0.5), 0.95);
    hand(ctx, "kiri 4 · tengah 2 · kanan 1", 960, 800, 40, { color: BLUE });
  }
  function tanya_v(ctx, b, l) {
    board(ctx);
    qPanel(ctx, 640, 170, 640, 520, l);
    hand(ctx, "Coba pikirkan dulu!", 960, 770, 44, { color: ORANGE });
  }

  function biner_v(ctx, b, l) {   // Short: pola jawaban sebagai bilangan biner (area x 460–1460)
    board(ctx);
    bulbs(ctx, Q, 960, 280, 85, 250);
    ["1", "1", "0"].forEach((d, i) => text(ctx, d, 960 + (i - 1) * 250, 500, 96, { align: "center", weight: 900, color: BLUE }));
    text(ctx, "= 6 tongkat", 960, 610, 60, { align: "center", weight: 900, color: GREEN });
    const a = P(l, at(b, "bilangan biner"), 0.5);
    hand(ctx, "bilangan biner", 960, 740, 64, { color: ORANGE, alpha: a });
    ring(ctx, 960, 718, 250, 60, P(l, at(b, "bilangan biner") + 0.4, 0.8), ORANGE, 6);
  }

  Object.assign(K.SCENES, {
    soal, biner_v, nilai, contoh4, kartu, jawab, pola, komputer, delapan, langkah, enam, soal_v, tanya_v,
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
      const fu = P(l, at(b, "Jepang"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagJP(ctx, 470, 230, 170); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Jepang"), 0.8);
      if (au > 0) ring(ctx, 1170, 300 + 2 * 92 - 14, 200, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
      bitaro(ctx, 700, 470 + Math.sin(l * 3) * 8, 220);
      bulbs(ctx, Q, 700, 700, 34, 90);
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 520, 800, 50, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Membaca lampu menyala dan mati, langkah demi langkah", 960, 500, 38, { align: "center", weight: 800, color: ORANGE, fit: 1000 });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
