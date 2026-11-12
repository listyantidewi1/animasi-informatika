/* PG07 Pembahasan Soal Bebras 2025-KR-05 "Tempat Parkir yang Tersedia" (Korea Selatan), kategori Penegak (SMA).
   Gaya papan tulis putih dengan coretan spidol (sama dengan seri Bebras) + simulasi mobil parkir dilihat dari atas.
   Zona: D disabilitas (abu-abu, kursi roda), S staf (oranye kotak-kotak), O orang tua (biru bergaris), U semua orang (kuning).
   Papan awal 3 1 3 2. Antrean: 1 staf disabilitas (D/S/U), 2–3 staf (S/U), 4–5 orang tua (O/U).
   Semua tampilan akhir yang mungkin (diperiksa dengan enumerasi di kode, lihat CEK): 2011, 2020, 2110 (B), 3010 (C).
   Papan: x 52–1868, y 130–830 (kartu narasi mulai y≈840). Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Tempat Parkir yang Tersedia", tahun: "2025", negara: "Korea Selatan", kode: "2025-KR-05" };
  // ---------- waktu ----------
  const TXT = b => b.src_text || b.text;
  const lead = b => b.src_lead != null ? b.src_lead : (b.speech != null && b.start != null ? b.speech - b.start : 0.4);
  const atI = (b, i) => lead(b) + Math.max(0, i) / TXT(b).length * (b.audio || b.dur);
  const at = (b, s, from = 0) => {
    const T = TXT(b); let i = T.indexOf(s, from);
    if (i < 0) { (K._warn = K._warn || []).push(b.id + ": " + s); i = 0; }
    return atI(b, i);
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
    text(ctx, q, x + h + 20, y + h * 0.8, 28, { weight: 800, color: INK, fit: w - h - 40 });
  }
  function letter(ctx, L, cx, cy, r, good) {
    ctx.fillStyle = good ? GREEN : C.kiko; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    text(ctx, L, cx, cy + r * 0.42, r * 1.2, { align: "center", weight: 900, color: "#fff" });
  }
  function beaver(ctx, x, y, s, o = {}) {   // berang-berang maskot Bebras (sama dengan seri Bebras SD)
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

  // ---------- zona, tanda, papan ----------
  const ZK = ["D", "S", "O", "U"];
  const ZNAME = { D: "disabilitas", S: "staf", O: "orang tua", U: "kuning (semua)" };
  const ZRULE = { D: "Hanya penyandang disabilitas", S: "Hanya staf", O: "Hanya orang tua murid", U: "Setiap orang" };
  const START = [3, 1, 3, 2];
  // pilihan jawaban dari soal
  const OPT = { A: [2, 1, 0, 1], B: [2, 1, 1, 0], C: [3, 0, 1, 0], D: [3, 0, 0, 1] };
  // pemeriksaan: semua tampilan akhir yang mungkin (enumerasi), harus 2011, 2020, 2110, 3010
  const CAN = [["D", "S", "U"], ["S", "U"], ["S", "U"], ["O", "U"], ["O", "U"]];
  const CEK = (() => {
    const out = new Set();
    const go = (i, f) => {
      if (i === 5) { out.add(f.join("")); return; }
      let any = false;
      CAN[i].forEach(z => { const k = ZK.indexOf(z); if (f[k] > 0) { any = true; const g = f.slice(); g[k]--; go(i + 1, g); } });
      if (!any) out.add("gagal");
    };
    go(0, START.slice()); return [...out].sort();
  })();
  if (CEK.join() !== "2011,2020,2110,3010") (K._warn = K._warn || []).push("enumerasi parkir: " + CEK.join());

  function pattern(ctx, z, x, y, w, h) {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (z === "D") { ctx.fillStyle = "#8F979F"; ctx.fillRect(x, y, w, h); }
    if (z === "S") {
      ctx.fillStyle = "#F6A04D"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "#E86A12"; const q = 14;
      for (let i = 0; i * q < w + q; i++) for (let j = 0; j * q < h + q; j++) if ((i + j) % 2 === 0) ctx.fillRect(x + i * q, y + j * q, q, q);
    }
    if (z === "O") {
      ctx.fillStyle = "#BFE8FB"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "#2AAAE6"; const q = 10;
      for (let j = 0; j * q < h; j += 2) ctx.fillRect(x, y + j * q, w, q);
    }
    if (z === "U") { ctx.fillStyle = "#FFE512"; ctx.fillRect(x, y, w, h); }
    ctx.restore();
  }
  function wheel(ctx, cx, cy, s, col = "#FFFFFF") {   // tanda kursi roda sederhana
    ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = s * 0.09;
    ctx.beginPath(); ctx.arc(cx - s * 0.02, cy - s * 0.34, s * 0.085, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx - s * 0.06, cy - s * 0.2); ctx.lineTo(cx - s * 0.08, cy + s * 0.05); ctx.lineTo(cx + s * 0.16, cy + s * 0.05); ctx.lineTo(cx + s * 0.27, cy + s * 0.3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - s * 0.07, cy - s * 0.09); ctx.lineTo(cx + s * 0.12, cy - s * 0.09); ctx.stroke();
    ctx.lineWidth = s * 0.07; ctx.beginPath(); ctx.arc(cx - s * 0.08, cy + s * 0.18, s * 0.23, -Math.PI * 0.35, Math.PI * 1.25); ctx.stroke();
    ctx.restore();
  }
  function sign(ctx, z, x, y, s, opt = {}) {
    pattern(ctx, z, x, y, s, s);
    if (z === "D") wheel(ctx, x + s / 2, y + s / 2, s * 0.9);
    ctx.strokeStyle = opt.stroke || "#5B6670"; ctx.lineWidth = opt.lw || Math.max(2, s * 0.04); ctx.strokeRect(x, y, s, s);
  }
  // papan "Ruang Parkir yang Tersedia" (lebar w, tinggi w*0.375); opt.flash[i], opt.ring[i] 0..1
  function display(ctx, x, y, w, nums, opt = {}) {
    const s = w / 560, h = 210 * s;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.fillStyle = "#111417"; rr(ctx, x, y, w, h, 18 * s); ctx.fill();
    if (opt.dim) { ctx.globalAlpha *= 1 - 0.55 * opt.dim; }
    text(ctx, "Ruang Parkir yang Tersedia", x + w / 2, y + 40 * s, 32 * s, { align: "center", weight: 800, color: "#35E04A" });
    const cols = [0.14, 0.38, 0.62, 0.86].map(f => x + w * f);
    ZK.forEach((z, i) => {
      sign(ctx, z, cols[i] - 30 * s, y + 56 * s, 60 * s, { stroke: "#EEE", lw: 2 * s });
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(cols[i] - 34 * s, y + 124 * s, 68 * s, 72 * s);
      const fl = opt.flash ? opt.flash[i] || 0 : 0;
      if (fl > 0) { ctx.save(); ctx.globalAlpha *= fl; ctx.fillStyle = "#FFE7C2"; ctx.fillRect(cols[i] - 34 * s, y + 124 * s, 68 * s, 72 * s); ctx.restore(); }
      text(ctx, String(nums[i]), cols[i], y + 180 * s, 58 * s, { align: "center", weight: 900, color: "#111" });
    });
    ctx.restore();
    return { x, y, w, h, cx: i => cols[i], ny: y + 160 * s, s };
  }
  // ring merah/oranye di sekitar kotak angka kolom i
  function numRing(ctx, d, i, u, color = ORANGE) { if (u > 0) ring(ctx, d.cx(i), d.ny, 52 * d.s, 52 * d.s, u, color, Math.max(4, 7 * d.s)); }

  // ---------- mobil (dilihat dari atas) ----------
  const CARCOL = ["#E0712B", "#E0712B", "#E0712B", "#2F78C8", "#2F78C8"];
  const WHO = [["staf +", "disabilitas"], ["staf", ""], ["staf", ""], ["orang tua", ""], ["orang tua", ""]];
  function car(ctx, x, y, ang, i, opt = {}) {
    const s = opt.s || 1;
    ctx.save(); if (opt.alpha != null) ctx.globalAlpha *= clamp(opt.alpha, 0, 1);
    ctx.translate(x, y); ctx.scale(s, s);
    ctx.save(); ctx.rotate(ang);
    ctx.fillStyle = "rgba(0,0,0,0.15)"; rr(ctx, -54, -28, 112, 62, 16); ctx.fill();
    ctx.fillStyle = "#222"; [[-38, -33], [24, -33], [-38, 27], [24, 27]].forEach(([a, c]) => { rr(ctx, a, c, 20, 7, 3); ctx.fill(); });
    ctx.fillStyle = CARCOL[i]; rr(ctx, -56, -30, 112, 60, 16); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = "#2E3A46"; rr(ctx, 14, -23, 20, 46, 6); ctx.fill(); rr(ctx, -42, -21, 13, 42, 5); ctx.fill();
    ctx.fillStyle = "#FFF4B0"; ctx.fillRect(50, -24, 5, 10); ctx.fillRect(50, 14, 5, 10);
    ctx.restore();
    if (opt.num !== false) {
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(0, 0, 19, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke();
      text(ctx, String(i + 1), 0, 10, 28, { align: "center", weight: 900, color: INK });
    }
    if (i === 0 || opt.wc) {   // tanda kursi roda di atap
      const up = Math.abs(Math.sin(ang)) > 0.7, nn = opt.num === false;
      const bx = nn ? -15 : up ? -15 : 22, by = nn ? -15 : up ? 24 : -15;
      ctx.fillStyle = "#6E7880"; rr(ctx, bx, by, 30, 30, 5); ctx.fill(); wheel(ctx, bx + 15, by + 15, 28);
    }
    ctx.restore();
  }

  // ---------- tempat parkir ----------
  const SLOTW = 100, SY0 = 300, SY1 = 505, LANE = 562, CARY = 402;
  const ZX = { D: 90, S: 434, O: 578, U: 922 }, ZN = { D: 3, S: 1, O: 3, U: 2 };
  const zw = z => ZN[z] * SLOTW + 20;
  const slotX = (z, k) => ZX[z] + 10 + SLOTW / 2 + k * SLOTW;
  const QX = [1250, 1380, 1510, 1640, 1770];
  // jalur mobil i dari antrean ke tempat (z, k); u = 0..1
  function carAt(i, z, k, u) {
    const sx = slotX(z, k), L1 = QX[i] - sx, L2 = LANE - CARY, s = ease(clamp(u, 0, 1)) * (L1 + L2);
    const R = 45;
    if (s < L1) {
      const k2 = clamp((s - (L1 - R)) / (2 * R), 0, 1);
      return [QX[i] - s, LANE, lerp(Math.PI, Math.PI * 1.5, k2 * 0.5)];
    }
    const k2 = clamp((s - L1 + R) / (2 * R), 0, 1);
    return [sx, LANE - (s - L1), lerp(Math.PI, Math.PI * 1.5, 0.5 + k2 * 0.5)];
  }
  function lot(ctx, o = {}) {
    const za = o.zalpha || (() => 1), zr = o.zring || (() => 0);
    // jalan
    ctx.fillStyle = "#CBD1D6"; ctx.fillRect(70, 515, 1800, 96);
    ctx.save(); ctx.setLineDash([26, 20]); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(80, LANE); ctx.lineTo(1860, LANE); ctx.stroke(); ctx.restore();
    ctx.fillStyle = "#DDE2E6"; ctx.fillRect(70, SY0 - 8, 1095, SY1 - SY0 + 16);
    // gerbang masuk
    ctx.fillStyle = "#6B7780"; ctx.fillRect(1176, 470, 12, 46); ctx.fillStyle = "#D9443B"; ctx.fillRect(1182, 478, 6, 30);
    ZK.forEach((z, zi) => {
      const a = za(zi); if (a <= 0) return;
      alpha(ctx, a, () => {
        const x = ZX[z], w = zw(z);
        pattern(ctx, z, x, SY0, w, SY1 - SY0);
        ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 6;
        for (let k = 0; k <= ZN[z]; k++) { ctx.beginPath(); ctx.moveTo(x + 10 + k * SLOTW, SY0 + 8); ctx.lineTo(x + 10 + k * SLOTW, SY1); ctx.stroke(); }
        ctx.strokeStyle = "#5B6670"; ctx.lineWidth = 3; ctx.strokeRect(x, SY0, w, SY1 - SY0);
        sign(ctx, z, x + w / 2 - 34, 158, 68);
        text(ctx, ZNAME[z], x + w / 2, 272, 28, { align: "center", weight: 800, color: INK, fit: w + 10 });
      });
      const r = zr(zi); if (r > 0) { const x = ZX[z], w = zw(z); ring(ctx, x + w / 2, 402, w / 2 + 26, 125, r, ORANGE, 7); }
    });
  }
  // keadaan papan: nums dari mobil yang sudah sampai; flash untuk angka yang baru berubah
  function lotScene(ctx, b, l, cfg) {
    board(ctx);
    lot(ctx, cfg.lot || {});
    const nums = START.slice(), flash = [0, 0, 0, 0];
    const plan = cfg.plan || [];
    // mobil di antrean / bergerak / parkir
    for (let i = 0; i < 5; i++) {
      const showQ = cfg.queue ? cfg.queue(i) : 0;
      const p = plan[i]; let u = 0;
      if (p) { u = p.done ? 1 : p.t0 != null ? clamp((l - p.t0) / 1.8, 0, 1) : 0; }
      if (p && u > 0) {
        const [x, y, a] = carAt(i, p.z, p.k, u); car(ctx, x, y, a, i);
        if (u >= 1) { nums[ZK.indexOf(p.z)]--; const since = p.done ? 99 : l - (p.t0 + 1.8); if (since < 1.2) flash[ZK.indexOf(p.z)] = Math.max(flash[ZK.indexOf(p.z)], 1 - since / 1.2); }
      } else if (showQ > 0) car(ctx, QX[i], LANE, Math.PI, i, { alpha: showQ });
      const la = cfg.labels ? cfg.labels(i) : 0;
      if (la > 0) alpha(ctx, la, () => {
        text(ctx, WHO[i][0], QX[i], 650, 25, { align: "center", weight: 800, color: CARCOL[i] === "#2F78C8" ? "#1F5FA8" : "#B4521A" });
        if (WHO[i][1]) text(ctx, WHO[i][1], QX[i], 679, 25, { align: "center", weight: 800, color: "#B4521A" });
      });
    }
    const da = cfg.dalpha != null ? cfg.dalpha : 1;
    const d = display(ctx, 1270, 165, 560, nums, { alpha: da, flash });
    return { d, nums };
  }
  // target (pilihan yang sedang dibuktikan) di kiri bawah
  function target(ctx, L, x, y, w, u, ok) {
    alpha(ctx, u, () => {
      letter(ctx, L, x - 34, y + w * 0.1875, 26, ok);
      display(ctx, x, y, w, OPT[L]);
    });
  }
  const PLAN = { B: [["D", 0], ["U", 0], ["U", 1], ["O", 0], ["O", 1]], C: [["S", 0], ["U", 0], ["U", 1], ["O", 0], ["O", 1]] };
  const SIM = {   // beat: [skenario, mobil yang sudah parkir, [[mobil, frasa, tambahan detik]]]
    b1: ["B", 0, [[0, "Mobil pertama parkir", 0]]],
    b2: ["B", 1, [[1, "Keduanya parkir", 0], [2, "Keduanya parkir", 1.1]]],
    b3: ["B", 3, [[3, "kedua orang tua", 0], [4, "kedua orang tua", 1.1]]],
    c1: ["C", 0, [[0, "mobil pertama parkir", 0]]],
    c2: ["C", 1, [[1, "mereka parkir", 0], [2, "mereka parkir", 1.1]]],
    c3: ["C", 3, [[3, "Kedua orang tua", 0], [4, "Kedua orang tua", 1.1]]],
  };
  function parkir(ctx, b, l) {
    const id = b.id;
    if (id === "soal1") {
      const t0 = at(b, "empat zona"), tz = at(b, "tanda sendiri");
      lotScene(ctx, b, l, { dalpha: 0, lot: { zalpha: zi => P(l, t0 + zi * 0.45, 0.5), zring: () => 0 } });
      // tanda zona berdenyut
      const u = P(l, tz, 0.5) * (1 - P(l, tz + 2.6, 0.5));
      ZK.forEach(z => { if (u > 0) ring(ctx, ZX[z] + zw(z) / 2, 192, 50, 46, u, ORANGE, 6); });
      hand(ctx, "Kita hanya menggambar tempat yang masih kosong.", 600, 740, 36, { color: INK, alpha: P(l, at(b, "Sekolah"), 0.6) });
      return;
    }
    if (id === "soal4") {
      const T = [at(b, "tiga tempat kosong"), at(b, "satu di zona"), at(b, "tiga di zona"), at(b, "dua di zona")];
      const cur = T.reduce((a, t, i) => (l >= t ? i : a), -1);
      const r = lotScene(ctx, b, l, { dalpha: P(l, at(b, "papan"), 0.6), lot: { zring: zi => zi === cur ? P(l, T[zi], 0.4) : 0 } });
      if (cur >= 0) numRing(ctx, r.d, cur, P(l, T[cur], 0.4));
      hand(ctx, "papan di pintu masuk", 1550, 430, 36, { color: INK, alpha: P(l, at(b, "papan"), 0.6) });
      hand(ctx, "angka = banyaknya tempat yang masih kosong", 600, 740, 36, { color: ORANGE, alpha: P(l, at(b, "Saat ini"), 0.6) });
      return;
    }
    if (id === "soal5") {
      const T = [at(b, "Mobil pertama"), at(b, "Mobil kedua"), at(b, "Mobil kedua"), at(b, "Mobil keempat"), at(b, "Mobil keempat")];
      lotScene(ctx, b, l, { queue: i => P(l, (i === 0 ? at(b, "Lima mobil") : T[i]) + (i === 2 || i === 4 ? 0.4 : 0), 0.5), labels: i => P(l, T[i] + (i === 2 || i === 4 ? 0.4 : 0), 0.5) });
      hand(ctx, "antrean: mobil 1 masuk paling dulu", 600, 740, 36, { color: INK, alpha: P(l, at(b, "Lima mobil"), 0.6) });
      return;
    }
    if (id === "b0") {
      lotScene(ctx, b, l, { queue: () => 1, labels: () => 1 });
      thinkBadge(ctx, 70, 655, 540, 150, l, b.dur, "Cari urutan untuk B dan C.");
      const u = P(l, at(b, "tampilan itu"), 0.6);
      target(ctx, "B", 680, 690, 210, u); target(ctx, "C", 950, 690, 210, u);
      return;
    }
    // simulasi B dan C (juga mode Short: b.mode = "B" / "C", semua mobil dalam satu beat)
    let sc, done, moves;
    if (b.mode) { sc = b.mode; done = 0; const D = b.dur; moves = [0, 1, 2, 3, 4].map(i => [i, null, 0.08 * D + i * 0.15 * D]); }
    else[sc, done, moves] = SIM[id];
    const plan = PLAN[sc].map(([z, k], i) => ({ z, k, done: i < done }));
    moves.forEach(([i, ph, dt]) => { plan[i].t0 = (ph ? at(b, ph) : 0) + dt; });
    const r = lotScene(ctx, b, l, { plan, queue: () => 1, labels: () => 1 });
    const fin = r.nums.join() === OPT[sc].join();
    const tEnd = Math.max(...moves.map(m => plan[m[0]].t0)) + 1.9;
    const okU = fin ? P(l, tEnd + 0.3, 0.5) : 0;
    text(ctx, "Target:", 110, 760, 34, { weight: 900, color: C.accentDark });
    target(ctx, sc, 300, 690, 280, 1, okU > 0.5);
    if (okU > 0) {
      ring(ctx, 1550, 270, 310, 130, okU, GREEN, 7);
      hand(ctx, "= pilihan " + sc + "  ✓", 760, 760, 44, { color: GREEN, align: "left", alpha: okU });
    }
    // catatan kecil
    if (id === "b2") hand(ctx, "satu tempat di zona staf tetap kosong", 760, 645, 30, { color: ORANGE, alpha: P(l, at(b, "Satu tempat"), 0.5) });
    if (id === "c1") hand(ctx, "staf + disabilitas boleh di zona staf", 760, 640, 30, { color: ORANGE, alpha: P(l, at(b, "Ingat"), 0.5) });
    if (id === "c2") hand(ctx, "zona staf sudah penuh", 760, 645, 30, { color: RED, alpha: P(l, at(b, "tidak bisa"), 0.5) });
  }

  // ---------- tabel zona dan contoh ----------
  function zona(ctx, b, l) {
    board(ctx);
    if (b.id === "soal2") {
      const T = [at(b, "Zona abu-abu"), at(b, "Zona oranye"), at(b, "Zona biru"), at(b, "Zona kuning")];
      card(ctx, 300, 160, 1320, 70, { fill: "#EEF1F4", stroke: "#2B3440", lw: 2.5, r: 4 });
      text(ctx, "Zona", 400, 207, 32, { align: "center", weight: 900, color: INK });
      text(ctx, "Siapa yang boleh parkir di zona ini", 560, 207, 32, { weight: 900, color: INK });
      ZK.forEach((z, i) => {
        const y = 240 + i * 145, u = P(l, T[i], 0.5);
        alpha(ctx, u, () => {
          card(ctx, 300, y, 1320, 135, { fill: "#FFFFFF", stroke: "#2B3440", lw: 2.5, r: 4 });
          sign(ctx, z, 345, y + 18, 100);
          text(ctx, ZRULE[z], 560, y + 84, 44, { weight: 800, color: INK });
        });
      });
      return;
    }
    // soal3: contoh orang tua penyandang disabilitas
    const u0 = P(l, at(b, "Misalnya"), 0.6);
    alpha(ctx, u0, () => {
      CARCOL.push("#2F78C8"); car(ctx, 330, 470, -Math.PI / 2, 5, { s: 1.8, wc: true, num: false }); CARCOL.pop();
      hand(ctx, "orang tua murid", 330, 650, 36, { color: "#1F5FA8" });
      hand(ctx, "+ penyandang disabilitas", 330, 695, 32, { color: "#5B6670" });
    });
    hand(ctx, "boleh parkir di lebih dari satu zona", 960, 200, 42, { color: ORANGE, alpha: P(l, 0.3, 0.6) });
    const ok = { D: 1, S: 0, O: 1, U: 1 }, TT = { D: at(b, "zona disabilitas"), S: at(b, "zona orang tua") + 0.6, O: at(b, "zona orang tua"), U: at(b, "zona kuning") };
    ZK.forEach((z, i) => {
      const x = 800 + i * 260, y = 300, u = P(l, at(b, "Misalnya") + 0.3, 0.6);
      alpha(ctx, u, () => { sign(ctx, z, x, y, 150); text(ctx, ZNAME[z], x + 75, y + 195, 30, { align: "center", weight: 800, color: INK }); });
      const v = P(l, TT[z], 0.5);
      if (ok[z]) { mline(ctx, [[470, 470], [x + 75, y + 240]], v, GREEN, 5, true); tick(ctx, x + 75, y + 285, 60, v); }
      else cross(ctx, x + 75, y + 285, 60, P(l, at(b, "zona kuning") + 0.8, 0.5));
    });
  }

  // ---------- pilihan jawaban ----------
  const OPOS = [[300, 250], [1060, 250], [300, 520], [1060, 520]];
  function options(ctx, st = {}) {
    "ABCD".split("").forEach((L, i) => {
      const [x, y] = OPOS[i];
      alpha(ctx, st.show ? st.show(i) : 1, () => {
        ctx.save(); if (st.dim && st.dim[i]) ctx.globalAlpha *= 1 - 0.5 * st.dim[i];
        letter(ctx, L, x - 60, y + 94, 36, st.good && st.good[i]);
        display(ctx, x, y, 500, OPT[L]);
        ctx.restore();
      });
    });
  }
  const Q = ["Pilihlah ", "semua kemungkinan", " tampilan papan setelah semua mobil parkir."];
  function question(ctx) {
    const sz = 40, w = tw(ctx, Q.join(""), sz, 900), x0 = 960 - w / 2;
    text(ctx, Q.join(""), 960, 205, sz, { align: "center", weight: 900, color: INK });
    const u0 = x0 + tw(ctx, Q[0], sz, 900); return { u0, u1: u0 + tw(ctx, Q[1], sz, 900) };
  }
  function pilihan(ctx, b, l) {
    board(ctx);
    question(ctx);
    const t0 = b.id === "soal6" ? at(b, "Pilihlah") : -9;
    options(ctx, { show: i => b.id === "soal6" ? P(l, t0 + i * 0.35, 0.5) : 1 });
    if (b.id === "soal6") hand(ctx, "mobil parkir satu per satu, sesuai urutan antrean", 960, 800, 34, { color: INK, alpha: P(l, at(b, "satu per satu"), 0.6) * (1 - P(l, t0, 0.5)) });
    if (b.id === "soal7") {
      const u = P(l, at(b, "semua kemungkinan"), 0.6);
      const q = question(ctx); mline(ctx, [[q.u0, 222], [q.u1, 222]], u, ORANGE, 6);
      hand(ctx, "\"semua kemungkinan\": jawaban bisa lebih dari satu", 960, 800, 38, { color: ORANGE, alpha: P(l, at(b, "Artinya"), 0.6) });
    }
  }
  function jawab(ctx, b, l) {
    board(ctx);
    question(ctx);
    const ug = P(l, at(b, "pilihan B dan"), 0.6), ux = P(l, at(b, "Pilihan A dan"), 0.6);
    options(ctx, { good: [0, ug > 0.5, ug > 0.5, 0], dim: [ux, 0, 0, ux] });
    [[1, ug], [2, ug]].forEach(([i, u]) => { const [x, y] = OPOS[i]; ring(ctx, x + 220, y + 94, 330, 130, u, GREEN, 7); });
    [0, 3].forEach(i => { const [x, y] = OPOS[i]; cross(ctx, x + 250, y + 94, 170, ux, RED, 10); });
    hand(ctx, "Jawaban: B dan C", 960, 800, 52, { color: GREEN, alpha: ug });
  }

  // ---------- siapa boleh parkir di mana ----------
  const TCX = [860, 1110, 1360, 1610], TROW = [345, 450, 555];
  const ALLOW = [[1, 1, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1]];
  const RLAB = [["Mobil 1", "staf + disabilitas"], ["Mobil 2 dan 3", "staf"], ["Mobil 4 dan 5", "orang tua murid"]];
  function siapa(ctx, b, l) {
    board(ctx);
    const ord = prog(["s1", "s2", "s3", "s4", "s5", "s6", "s7"], b);
    ZK.forEach((z, i) => { sign(ctx, z, TCX[i] - 40, 160, 80); text(ctx, ZNAME[z], TCX[i], 280, 26, { align: "center", weight: 800, color: INK, fit: 230 }); });
    TROW.forEach((y, r) => {
      card(ctx, 100, y - 48, 1650, 96, { fill: r % 2 ? "#F7F9FA" : "#FFFFFF", stroke: "#C9D2D8", lw: 2, r: 12 });
      const ci = [0, 1, 3][r];
      car(ctx, 170, y, -Math.PI / 2, ci, { s: 0.62 });
      text(ctx, RLAB[r][0], 230, y - 6, 32, { weight: 900, color: INK });
      text(ctx, RLAB[r][1], 230, y + 32, 26, { weight: 700, color: r === 2 ? "#1F5FA8" : "#B4521A" });
      const id = ["s2", "s3", "s4"][r];
      const T0 = ord(id, () => P(l, at(b, ["Jadi, mobil ini", "Keduanya boleh", "Keduanya boleh"][r]), 0.5));
      const TX = ord(id, () => P(l, at(b, r === 1 ? "tidak boleh" : r === 0 ? "tiga pilihan" : "zona kuning"), 0.5));
      ALLOW[r].forEach((v, c) => {
        if (v) { const u = clamp(T0 * 4 - c * 0.6, 0, 1); tick(ctx, TCX[c], y + 4, 60, u); }
        else cross(ctx, TCX[c], y, 52, TX, "#C4CBD1", 8);
      });
    });
    if (b.id === "s1") { thinkBadge(ctx, 100, 668, 760, 140, l, b.dur, "Mobil mana boleh parkir di zona mana?"); return; }
    if (b.id === "s5") {
      const u = P(l, at(b, "kolom zona kuning"), 0.6);
      ring(ctx, TCX[3], 395, 120, 255, u, ORANGE, 7); hand(ctx, "semua boleh", TCX[3], 700, 40, { color: ORANGE, alpha: u });
      hand(ctx, "siapa cepat, dia dapat", 1000, 700, 34, { color: INK, alpha: P(l, at(b, "lebih dulu"), 0.6) });
    }
    if (b.id === "s6" || b.id === "s7") {
      const s6 = b.id === "s6";
      hand(ctx, "Staf bisa memakai 1 tempat staf + 2 tempat kuning = 3 tempat.", 110, 655, 32, { color: "#B4521A", align: "left", alpha: s6 ? P(l, at(b, "Staf bisa"), 0.6) : 1 });
      hand(ctx, "Mobil 1 memakai paling banyak 1, jadi 2 staf pasti kebagian.", 110, 700, 32, { color: "#B4521A", align: "left", alpha: s6 ? P(l, at(b, "Mobil pertama paling"), 0.6) : 1 });
      if (s6) return;
      hand(ctx, "Orang tua: 3 tempat untuk 2 mobil.", 110, 745, 32, { color: "#1F5FA8", align: "left", alpha: P(l, at(b, "Orang tua juga"), 0.6) });
      const u = P(l, at(b, "Jadi, kelima"), 0.6);
      alpha(ctx, u, () => { card(ctx, 1240, 640, 580, 110, { fill: "#EAF7EE", stroke: GREEN, lw: 4, r: 18 }); text(ctx, "Kelima mobil pasti bisa parkir", 1530, 708, 34, { align: "center", weight: 900, color: GREEN, fit: 540 }); });
    }
  }

  // ---------- menghitung jumlah ----------
  function hitung(ctx, b, l) {
    board(ctx);
    if (b.id === "m1") {
      const d = display(ctx, 400, 170, 880, START);
      const T = [at(b, "Tiga ditambah"), at(b, "ditambah tiga"), at(b, "ditambah dua")];
      [0, 1, 2].forEach(i => hand(ctx, "+", (d.cx(i) + d.cx(i + 1)) / 2, d.ny + 22, 64, { color: ORANGE, alpha: P(l, T[i], 0.4) }));
      hand(ctx, "= 9", 1420, d.ny + 24, 80, { color: ORANGE, align: "left", alpha: P(l, at(b, "sembilan"), 0.5) });
      hand(ctx, "9 tempat kosong − 5 mobil = 4 tempat kosong", 960, 620, 50, { color: INK, alpha: P(l, at(b, "Ada lima"), 0.6) });
      hand(ctx, "di akhir: jumlah angka di papan = 4", 960, 720, 44, { color: GREEN, alpha: P(l, at(b, "pasti tersisa"), 0.6) });
      return;
    }
    const xs = [110, 545, 980, 1415];
    "ABCD".split("").forEach((L, i) => {
      const d = display(ctx, xs[i], 260, 395, OPT[L]); letter(ctx, L, xs[i] + 197, 215, 28);
      const u = P(l, at(b, "jumlahkan") + 0.6 + i * 0.5, 0.5);
      hand(ctx, OPT[L].join(" + ") + " = 4", xs[i] + 197, 470, 36, { color: INK, alpha: u });
    });
    hand(ctx, "Jumlahnya selalu 4.", 960, 600, 48, { color: GREEN, alpha: P(l, at(b, "selalu empat"), 0.6) });
    hand(ctx, "Belum ada pilihan yang bisa dicoret.", 960, 690, 44, { color: RED, alpha: P(l, at(b, "belum bisa"), 0.6) });
  }

  // ---------- zona orang tua ----------
  function ortu(ctx, b, l) {
    board(ctx);
    const ord = prog(["m3", "m4", "m5"], b);
    const ox = 130, sw = 150, sy0 = 300, sy1 = 520;
    sign(ctx, "O", ox + 225 - 45, 160, 90); text(ctx, "zona orang tua", ox + 225, 283, 30, { align: "center", weight: 800, color: INK });
    pattern(ctx, "O", ox, sy0, 450, sy1 - sy0);
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 7; for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(ox + k * sw, sy0 + 8); ctx.lineTo(ox + k * sw, sy1); ctx.stroke(); }
    ctx.strokeStyle = "#5B6670"; ctx.lineWidth = 3; ctx.strokeRect(ox, sy0, 450, sy1 - sy0);
    ctx.fillStyle = "#CBD1D6"; ctx.fillRect(70, 535, 950, 90);
    hand(ctx, "3 tempat", ox + 225, 680, 36, { color: "#1F5FA8", alpha: b.id === "m3" ? P(l, at(b, "zona orang tua"), 0.6) : 1 });
    // mobil 4 dan 5
    const tIn = ord("m4", () => at(b, "paling banyak"));
    [3, 4].forEach((i, j) => {
      const sx = ox + sw / 2 + j * sw, qx = 760 + j * 140;
      const u = ord("m4", () => clamp((l - tIn - j * 0.9) / 1.6, 0, 1));
      let x, y, a;
      if (u <= 0) { x = qx; y = 580; a = Math.PI; }
      else { const L1 = qx - sx, L2 = 580 - 410, s = ease(u) * (L1 + L2); if (s < L1) { x = qx - s; y = 580; a = Math.PI; } else { x = sx; y = 580 - (s - L1); a = Math.PI * 1.5; } }
      car(ctx, x, y, a, i, { alpha: b.id === "m3" ? P(l, at(b, "hanya ada dua"), 0.5) : 1 });
    });
    const ue = ord("m4", () => P(l, at(b, "paling sedikit"), 0.6));
    if (ue > 0) { ring(ctx, ox + 2.5 * sw, 410, 92, 128, ue, GREEN, 7); hand(ctx, "selalu kosong", ox + 2.5 * sw, 742, 34, { color: GREEN, alpha: ue }); }
    if (b.id !== "m5") {
      hand(ctx, "Zona ini hanya untuk orang tua murid.", 1430, 320, 36, { color: INK, alpha: b.id === "m3" ? P(l, at(b, "hanya boleh"), 0.6) : 1 });
      hand(ctx, "Di antrean, orang tua hanya 2.", 1430, 400, 36, { color: "#1F5FA8", alpha: b.id === "m3" ? P(l, at(b, "hanya ada dua"), 0.6) : 1 });
      if (b.id === "m4") {
        hand(ctx, "Terisi paling banyak 2.", 1430, 500, 40, { color: INK, alpha: P(l, at(b, "paling banyak"), 0.6) });
        hand(ctx, "Sisa paling sedikit 1.", 1430, 570, 44, { color: GREEN, alpha: ue });
        hand(ctx, "Angka zona orang tua ≥ 1", 1430, 680, 44, { color: GREEN, alpha: P(l, at(b, "paling sedikit") + 1.2, 0.6) });
      }
      return;
    }
    // m5: pilihan A dan D dicoret
    const pos = { A: [1105, 200], B: [1515, 200], C: [1105, 450], D: [1515, 450] };
    const ur = P(l, at(b, "angka nol"), 0.6), ux = P(l, at(b, "kita coret"), 0.6);
    Object.entries(pos).forEach(([L, [x, y]]) => {
      const bad = L === "A" || L === "D";
      ctx.save(); if (!bad) ctx.globalAlpha *= 1 - 0.4 * P(l, at(b, "Keduanya"), 0.6);
      const d = display(ctx, x, y, 330, OPT[L]); letter(ctx, L, x - 26, y + 30, 24);
      ctx.restore();
      if (bad) { numRing(ctx, d, 2, ur, RED); cross(ctx, x + 165, y + 62, 150, ux, RED, 10); }
    });
    hand(ctx, "0 berarti 3 mobil orang tua.", 1460, 690, 36, { color: RED, alpha: P(l, at(b, "Artinya"), 0.6) });
    hand(ctx, "Padahal, orang tuanya hanya 2.", 1460, 745, 36, { color: RED, alpha: P(l, at(b, "Itu tidak mungkin"), 0.6) });
  }

  // ---------- pohon semua kemungkinan ----------
  const LEAFY = [175, 305, 435, 565, 695], LEAFC = LEAFY.map(y => y + 52);
  const TREE = {   // [kolom, baris tengah, tanda]
    l1: [["S", LEAFC[0]], ["U", LEAFC[1]], ["D", LEAFC[3]]],
    l2: [[["U", "U"], LEAFC[0]], [["S", "U"], LEAFC[1]], [["S", "U"], (LEAFC[2] + LEAFC[3]) / 2], [["U", "U"], LEAFC[4]]],
    l3: [["O", "O"], ["O", "O"], ["O", "O"], ["O", "U"], ["O", "O"]],
    leaf: [[3, 0, 1, 0], [3, 0, 1, 0], [2, 0, 1, 1], [2, 0, 2, 0], [2, 1, 1, 0]],
    lab: ["C", "C", null, null, "B"],
    par2: [0, 1, 2, 2, 3], par1: [0, 1, 2, 2],
  };
  const COLX = { root: 170, l1: 420, l2: 690, l3: 1010, leaf: 1320 };
  function chip(ctx, zs, cx, cy, s = 44) {
    const w = zs.length * (s + 8) + 12;
    card(ctx, cx - w / 2, cy - s / 2 - 8, w, s + 16, { fill: "#FFFFFF", stroke: "#9AA4AC", lw: 2.5, r: 10 });
    zs.forEach((z, i) => sign(ctx, z, cx - w / 2 + 10 + i * (s + 8), cy - s / 2, s));
    return w;
  }
  function edge(ctx, x0, y0, x1, y1, u, col = "#7D8790") { mline(ctx, [[x0, y0], [x0 + (x1 - x0) * 0.5, y0], [x0 + (x1 - x0) * 0.5, y1], [x1, y1]], u, col, 4, true); }
  // vis: {root, l1:[i], l2:[i], l3:[i], leaf:[i], lab:[i], hi:[rows]} nilai 0..1
  function tree(ctx, vis) {
    const g = (k, i) => (vis[k] ? (typeof vis[k] === "function" ? vis[k](i) : vis[k]) : 0);
    text(ctx, "mobil 1", COLX.l1, 158, 24, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, "mobil 2 dan 3", COLX.l2, 158, 24, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, "mobil 4 dan 5", COLX.l3, 158, 24, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, "papan akhir", COLX.leaf + 140, 158, 24, { align: "center", weight: 800, color: C.ink2 });
    alpha(ctx, g("root", 0), () => {
      card(ctx, 75, LEAFC[2] - 50, 190, 100, { fill: "#FFF8E8", stroke: C.accent, lw: 3, r: 16 });
      car(ctx, 120, LEAFC[2], -Math.PI / 2, 0, { s: 0.55 }); text(ctx, "Mobil 1", 195, LEAFC[2] + 10, 26, { align: "center", weight: 900, color: INK });
    });
    TREE.l1.forEach(([z, y], i) => {
      const u = g("l1", i); if (u <= 0) return;
      edge(ctx, 265, LEAFC[2], COLX.l1 - 34, y, u);
      alpha(ctx, u, () => chip(ctx, [z], COLX.l1, y, 52));
    });
    TREE.l2.forEach(([zs, y], i) => {
      const u = g("l2", i); if (u <= 0) return;
      edge(ctx, COLX.l1 + 36, TREE.l1[TREE.par1[i]][1], COLX.l2 - 62, y, u);
      alpha(ctx, u, () => chip(ctx, zs, COLX.l2, y));
    });
    TREE.l3.forEach((zs, i) => {
      const u = g("l3", i); if (u <= 0) return;
      edge(ctx, COLX.l2 + 62, TREE.l2[TREE.par2[i]][1], COLX.l3 - 62, LEAFC[i], u);
      alpha(ctx, u, () => chip(ctx, zs, COLX.l3, LEAFC[i]));
    });
    TREE.leaf.forEach((nums, i) => {
      const u = g("leaf", i); if (u <= 0) return;
      edge(ctx, COLX.l3 + 62, LEAFC[i], COLX.leaf - 6, LEAFC[i], u);
      alpha(ctx, u, () => display(ctx, COLX.leaf, LEAFY[i], 278, nums));
      const lu = g("lab", i); if (lu <= 0) return;
      const L = TREE.lab[i];
      alpha(ctx, lu, () => {
        if (L) { letter(ctx, L, 1660, LEAFC[i], 30, true); }
        else { text(ctx, "tidak ada di", 1722, LEAFC[i] - 6, 24, { align: "center", weight: 800, color: C.ink2 }); text(ctx, "pilihan", 1722, LEAFC[i] + 24, 24, { align: "center", weight: 800, color: C.ink2 }); }
      });
    });
  }
  function pohon(ctx, b, l) {
    board(ctx);
    const ord = prog(["j2", "j3", "j4", "j4b", "j5"], b);
    const tj2 = ord("j2", () => at(b, "Kita mulai"));
    const r1 = ord("j3", () => P(l, at(b, "kedua staf"), 0.6)), r2 = ord("j3", () => P(l, at(b, "kedua orang tua"), 0.6)), r3 = ord("j3", () => P(l, at(b, "Hasilnya"), 0.6));
    const d2 = ord("j4", () => P(l, at(b, "dua cara"), 0.6)), d3 = ord("j4b", () => P(l, at(b, "orang tua boleh"), 0.6));
    const lf = [r3, r3, ord("j4b", () => P(l, at(b, "dua, nol, satu, satu"), 0.5)), ord("j4b", () => P(l, at(b, "dua, nol, dua, nol"), 0.5)), ord("j4b", () => P(l, at(b, "dua, satu, satu, nol"), 0.5))];
    const j5 = ord("j5", () => P(l, at(b, "Dua di antaranya"), 0.6)), j5b = ord("j5", () => P(l, at(b, "Dua tampilan lainnya"), 0.6));
    tree(ctx, {
      root: b.id === "j2" ? P(l, 0.3, 0.6) : 1,
      l1: i => b.id === "j2" ? P(l, tj2 + 0.8 + i * 0.5, 0.5) : 1,
      l2: i => i < 2 ? r1 : d2, l3: i => i < 2 ? r2 : d3, leaf: i => lf[i],
      lab: i => i < 2 ? (b.id === "j3" ? P(l, at(b, "pilihan C"), 0.5) : 1) : i === 4 ? j5 : j5b,
    });
  }

  // ---------- penutup ----------
  function komputer(ctx, b, l) {
    board(ctx);
    const X = 150, Y = 150, Wm = 1380, Hm = 600;
    ctx.fillStyle = "#3B4652"; rr(ctx, X, Y, Wm, Hm, 24); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; rr(ctx, X + 24, Y + 24, Wm - 48, Hm - 48, 10); ctx.fill();
    ctx.fillStyle = "#3B4652"; ctx.fillRect(X + Wm / 2 - 40, Y + Hm, 80, 30); rr(ctx, X + Wm / 2 - 180, Y + Hm + 26, 360, 18, 9); ctx.fill();
    ctx.fillStyle = "#E7EEF2"; ctx.fillRect(X + 24, Y + 24, Wm - 48, 50);
    text(ctx, b.id === "c4" ? "Sistem Parkir" : "Penelusur Kemungkinan", X + 50, Y + 58, 28, { weight: 800, color: INK });
    ctx.save(); rr(ctx, X + 24, Y + 74, Wm - 48, Hm - 98, 10); ctx.clip();
    if (b.id === "c4") {
      ctx.translate(X + 30, Y + 60); ctx.scale(0.7, 0.7); ctx.translate(-60, 0);
      const t0 = at(b, "setiap kali");
      const plan = PLAN.B.map(([z, k]) => ({ z, k }));
      plan.forEach((p, i) => { p.t0 = t0 - 2 + i * 1.3; });
      const nums = START.slice(), flash = [0, 0, 0, 0];
      lot(ctx, {});
      for (let i = 0; i < 5; i++) {
        const u = clamp((l - plan[i].t0) / 1.8, 0, 1);
        if (u > 0) { const [x, y, a] = carAt(i, plan[i].z, plan[i].k, u); car(ctx, x, y, a, i); } else car(ctx, QX[i], LANE, Math.PI, i);
        if (u >= 1) { const zi = ZK.indexOf(plan[i].z); nums[zi]--; const s = l - plan[i].t0 - 1.8; if (s < 1) flash[zi] = 1 - s; }
      }
      display(ctx, 1270, 165, 560, nums, { flash });
    } else {
      ctx.translate(X + 40, Y + 84); ctx.scale(0.62, 0.62); ctx.translate(-60, -140);
      const k = clamp((l - 0.6) / ((b.audio || b.dur) * 0.8), 0, 1) * 5;
      tree(ctx, { root: 1, l1: i => clamp(k * 1.6 - [0, 1, 1.6][i], 0, 1), l2: i => clamp(k - [0.4, 1.4, 2.4, 3.4][i], 0, 1), l3: i => clamp(k - 0.6 - i * 0.9, 0, 1), leaf: i => clamp(k - 1 - i * 0.9, 0, 1) });
    }
    ctx.restore();
    if (b.id === "c5") hand(ctx, "cabang demi", 1700, 260, 36, { color: ORANGE, alpha: P(l, at(b, "cabang demi"), 0.6) });
    if (b.id === "c5") hand(ctx, "cabang", 1700, 305, 36, { color: ORANGE, alpha: P(l, at(b, "cabang demi"), 0.6) });
    kiko(ctx, 1700, 620, 150, 0, { mood: "happy" });
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = [at(b, "Pertama"), at(b, "Kedua"), at(b, "Ketiga")];
    const S = ["Tentukan pilihan setiap orang.", "Cari batasan yang membuat pilihan tidak mungkin.", "Buktikan sisanya dengan urutan yang nyata."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 46, { weight: 900, color: INK, fit: 1080 });
        if (i === 0) { car(ctx, 1490, y + 80, -Math.PI / 2, 0, { s: 0.75 }); ["D", "S", "U"].forEach((z, j) => sign(ctx, z, 1550 + j * 62, y + 54, 52)); }
        if (i === 1) { display(ctx, 1440, y + 28, 280, OPT.A); cross(ctx, 1580, y + 80, 100, 1, RED, 8); }
        if (i === 2) { display(ctx, 1420, y + 28, 280, OPT.B); tick(ctx, 1735, y + 82, 50, 1); }
      });
    });
  }
  function flagKR(ctx, x, y, w) {   // bendera Korea Selatan
    const h = w * 2 / 3, cx = x + w / 2, cy = y + h / 2, r = h / 4;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x, y, w, h); ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
    const ang = Math.atan2(2, 3);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
    ctx.fillStyle = "#0047A0"; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#CD2E3A"; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(r / 2, 0, r / 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#0047A0"; ctx.beginPath(); ctx.arc(-r / 2, 0, r / 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // trigram: [arah dari pusat, pola garis (1 utuh, 0 putus)]
    const tri = [[Math.PI + ang, [1, 1, 1]], [-ang, [1, 0, 1]], [ang, [0, 1, 0]], [Math.PI - ang, [0, 0, 0]]];
    const d = r * 1.62, bw = r * 0.5, bh = r / 12;
    tri.forEach(([a, pat]) => {
      ctx.save(); ctx.translate(cx + Math.cos(a) * d, cy + Math.sin(a) * d); ctx.rotate(a + Math.PI / 2); ctx.fillStyle = "#000";
      pat.forEach((p, k) => { const yy = (k - 1) * bh * 1.6 - bh / 2; if (p) ctx.fillRect(-bw / 2, yy, bw, bh); else { ctx.fillRect(-bw / 2, yy, bw * 0.45, bh); ctx.fillRect(bw * 0.05, yy, bw * 0.45, bh); } });
      ctx.restore();
    });
  }

  // ---------- versi Short ----------
  Object.assign(K.SCENES, {
    parkir, zona, pilihan, jawab, siapa, hitung, ortu, pohon, komputer, langkah,
    buka(ctx, b, l) {
      board(ctx);
      const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
      text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
      mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
      const bu = first ? P(l, at(b, "pembahasan"), 0.8) : 1;
      [880, 1110, 1340, 1570].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v }); });
      if (first) hand(ctx, "tingkat SMA (Penegak)", 1230, 770, 44, { alpha: P(l, at(b, "tingkat SMA"), 0.6) });
      else hand(ctx, "pelan-pelan, satu langkah demi satu langkah", 1230, 770, 40, { alpha: P(l, at(b, "pelan"), 0.6) });
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
      const fu = P(l, at(b, "Korea"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagKR(ctx, 470, 220, 190); ctx.restore(); }
      const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
      text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
      rows.forEach(([k, v, ph], i) => {
        const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha = a;
        text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
        text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
        ctx.restore();
      });
      const au = P(l, at(b, "Korea"), 0.8);
      if (au > 0) ring(ctx, 1250, 300 + 2 * 92 - 14, 270, 44, au);
    },
    akhir(ctx, b, l) {
      board(ctx);
      kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
      [640, 860].forEach((x, i) => beaver(ctx, x, 470 + Math.sin(l * 3 + i) * 8, 160));
      display(ctx, 580, 585, 360, OPT.B);
      card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
      text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
      const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
      L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1330, y, 34, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 470 }); });
      para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
      hand(ctx, "Semoga sukses!", 750, 800, 54, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
    },
    cta_bebras(ctx, b, l) {
      board(ctx);
      text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
      text(ctx, META.judul, 960, 330, 66, { align: "center", weight: 900, color: INK, fit: 1000 });
      text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 410, 38, { align: "center", weight: 800, color: C.ink2 });
      text(ctx, "Semua kemungkinan, cabang demi cabang", 960, 490, 40, { align: "center", weight: 800, color: ORANGE });
      kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
