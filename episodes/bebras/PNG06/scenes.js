/* PNG06 Pembahasan Soal Bebras 2025-IE-04 "Menghindari Awan" (Irlandia), kategori Penggalang (SMP).
   Gaya papan tulis putih dengan coretan spidol (sama dengan seri Bebras) + simulasi:
   kotak awan 3x3x3 bertumpuk (meniru gambar soal), lapisan dipisah menjadi tiga peta datar, pesawat bergerak
   lapis demi lapis mengikuti panah, tabrakan ditandai.
   Jawaban dihitung ulang di kode (hanya C yang selamat, jalan aman tunggal) dan dilaporkan lewat K._warn bila salah.
   Papan: x 52–1868, y 130–830. Waktu kejadian diambil dari posisi frasa di narasi (at). */
(function (global) {
  const K = global.Kiko, H = K.helpers, C = K.C;
  const { rr, text, para, card, kiko, ease, clamp, lerp } = H;
  const INK = "#2B3440", ORANGE = "#EE7A12", GREEN = "#23964F", RED = "#D9443B", FUR = "#8E5B3A", FUR2 = "#B98458";
  const META = { judul: "Menghindari Awan", tahun: "2025", negara: "Irlandia", kode: "2025-IE-04" };

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

  function flagIE(ctx, x, y, w) {   // bendera Irlandia: hijau, putih, oranye (kiri ke kanan)
    const h = w * 0.5;
    ctx.fillStyle = "#6B7780"; ctx.fillRect(x - 8, y - 10, 8, h + 140);
    ctx.fillStyle = "#169B62"; ctx.fillRect(x, y, w / 3 + 0.5, h);
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + w / 3, y, w / 3 + 0.5, h);
    ctx.fillStyle = "#FF883E"; ctx.fillRect(x + w * 2 / 3, y, w / 3, h);
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  }

  // ---------- data soal ----------
  // CL[k][baris][kolom] = 1 bila ada awan. k 0 = lapis 1 (awan putih, paling dekat), k 1 = lapis 2 (abu-abu muda), k 2 = lapis 3 (gelap).
  // Dibaca dari gambar soal yang diperbesar (12 Nov 2026).
  const CL = [
    [[1, 1, 1], [0, 1, 1], [1, 1, 1]],
    [[1, 1, 1], [1, 1, 1], [1, 0, 1]],
    [[1, 1, 0], [1, 1, 0], [1, 1, 1]],
  ];
  const START = [0, 1];   // pesawat di depan petak tengah baris atas
  const DIR = { atas: [-1, 0], bawah: [1, 0], kiri: [0, -1], kanan: [0, 1], "kiri atas": [-1, -1], "kanan atas": [-1, 1], "kiri bawah": [1, -1], "kanan bawah": [1, 1], lurus: [0, 0] };
  const OPT = { A: ["bawah", "kanan atas", "atas"], B: ["kiri bawah", "kanan atas", "kanan bawah"], C: ["kiri bawah", "kanan bawah", "kanan atas"], D: ["bawah", "kanan bawah", "atas"] };
  function fly(seq) {   // posisi [awal, lapis 1, lapis 2, lapis 3] dan lapis tempat menabrak (-1 bila selamat)
    let p = START.slice(); const path = [p];
    for (let k = 0; k < seq.length; k++) {
      const d = DIR[seq[k]]; p = [p[0] + d[0], p[1] + d[1]]; path.push(p);
      if (p[0] < 0 || p[0] > 2 || p[1] < 0 || p[1] > 2 || CL[k][p[0]][p[1]]) return { path, crash: k };
    }
    return { path, crash: -1 };
  }
  const RES = {}; Object.keys(OPT).forEach(o => RES[o] = fly(OPT[o]));
  const SAFE = RES.C.path;
  (function cek() {
    const W = m => (K._warn = K._warn || []).push(m);
    if (RES.A.crash !== 0 || RES.D.crash !== 0 || RES.B.crash !== 1 || RES.C.crash !== -1) W("hasil pilihan salah: " + JSON.stringify(RES));
    // semua jalan aman (boleh lurus): harus tepat satu, yaitu jalan pilihan C
    const all = []; const names = Object.keys(DIR);
    names.forEach(a => names.forEach(b2 => names.forEach(c => { const r = fly([a, b2, c]); if (r.crash < 0) all.push([a, b2, c].join("/")); })));
    if (all.length !== 1 || all[0] !== OPT.C.join("/")) W("jalan aman tidak tunggal: " + all.join(" | "));
  })();

  // ---------- gambar dasar ----------
  const SKY = "#56C6EA";
  const CLOUD = [{ f: "#FFFFFF", s: "#9FB2BF" }, { f: "#A6B0B7", s: "#7D878E" }, { f: "#2E5D6B", s: "#1B3C48" }];
  const FRAME = ["#8FA1AD", "#6F7B83", "#1F3F4A"];
  const LABC = ["#5F707C", "#4E5A63", "#1F3F4A", "#111111"];
  const LNAME = ["awan putih", "awan abu-abu muda", "awan gelap"];
  function cloud(ctx, cx, cy, w, k, a = 1) {
    if (a <= 0) return; const c = CLOUD[k];
    const puffs = [[-0.3, 0.08, 0.2], [-0.1, -0.1, 0.25], [0.17, -0.05, 0.22], [0.33, 0.1, 0.16], [0.02, 0.12, 0.21], [-0.38, 0.14, 0.12]];
    ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1);
    ctx.fillStyle = c.s; puffs.forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(cx + x * w, cy + y * w, r * w + Math.max(2, w * 0.025), 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = c.f; puffs.forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(cx + x * w, cy + y * w, r * w, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore();
  }
  function plane(ctx, x, y, s, a = 1) {   // pesawat dilihat dari belakang
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1); ctx.translate(x, y);
    ctx.strokeStyle = "#2B2F33"; ctx.lineWidth = s * 0.07; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-s * 0.5, 0); ctx.lineTo(s * 0.5, 0); ctx.stroke();
    ctx.strokeStyle = "#C8302C"; ctx.lineWidth = s * 0.05;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.06); ctx.lineTo(0, -s * 0.3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.13, -s * 0.2); ctx.lineTo(s * 0.13, -s * 0.2); ctx.stroke();
    for (const k of [-1, 1]) {
      ctx.fillStyle = "#4E555B"; ctx.beginPath(); ctx.arc(k * s * 0.24, s * 0.08, s * 0.07, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#E8ECEF"; ctx.beginPath(); ctx.arc(k * s * 0.24, s * 0.08, s * 0.032, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "#B9BFC4"; ctx.strokeStyle = "#2B2F33"; ctx.lineWidth = s * 0.025;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#C8302C"; ctx.beginPath(); ctx.arc(0, 0, s * 0.045, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function boom(ctx, x, y, s, u) {
    if (u <= 0) return; const k = ease(clamp(u, 0, 1));
    ctx.save(); ctx.translate(x, y); ctx.scale(0.4 + 0.6 * k, 0.4 + 0.6 * k); ctx.globalAlpha *= clamp(u * 2, 0, 1);
    ctx.fillStyle = "#FFD23F"; ctx.strokeStyle = RED; ctx.lineWidth = s * 0.05; ctx.lineJoin = "round";
    ctx.beginPath(); for (let i = 0; i < 16; i++) { const r = i % 2 ? s * 0.3 : s * 0.52, a = i * Math.PI / 8 - Math.PI / 2; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.stroke();
    text(ctx, "BRAK!", 0, s * 0.09, s * 0.25, { align: "center", weight: 900, color: RED });
    ctx.restore();
  }
  function arrowOut(ctx, cx, cy, s, dir, o = {}) {   // panah bergaris tepi seperti di soal
    const d = DIR[dir], ang = Math.atan2(d[0], d[1]);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); if (o.alpha != null) ctx.globalAlpha *= clamp(o.alpha, 0, 1);
    ctx.beginPath(); ctx.moveTo(-s * 0.45, -s * 0.13); ctx.lineTo(s * 0.05, -s * 0.13); ctx.lineTo(s * 0.05, -s * 0.32); ctx.lineTo(s * 0.5, 0);
    ctx.lineTo(s * 0.05, s * 0.32); ctx.lineTo(s * 0.05, s * 0.13); ctx.lineTo(-s * 0.45, s * 0.13); ctx.closePath();
    ctx.fillStyle = o.fill || "#FFFFFF"; ctx.fill(); ctx.strokeStyle = o.stroke || INK; ctx.lineWidth = o.lw || Math.max(3, s * 0.055); ctx.lineJoin = "round"; ctx.stroke();
    ctx.restore();
  }
  const cellC = (G, r, c) => [G.x + (c + 0.5) * G.cell, G.y + (r + 0.5) * G.cell];
  // satu lapis sebagai peta datar. k -1 = kotak "Awal" (tanpa awan).
  function drawGrid(ctx, G, k, o = {}) {
    const { x, y, cell } = G, S = cell * 3, a = o.a == null ? 1 : o.a; if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1);
    const bgA = o.bg == null ? 1 : o.bg;
    if (bgA > 0) { ctx.save(); ctx.globalAlpha *= bgA; ctx.fillStyle = k < 0 ? "#DDF1F8" : SKY; ctx.fillRect(x, y, S, S); ctx.restore(); }
    if (k >= 0 && o.free) for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (!CL[k][r][c]) {
      const fa = typeof o.free === "function" ? o.free(r, c) : o.free;
      if (fa > 0) { ctx.save(); ctx.globalAlpha *= clamp(fa, 0, 1); ctx.fillStyle = "#86D9A0"; ctx.fillRect(x + c * cell + 4, y + r * cell + 4, cell - 8, cell - 8); ctx.restore(); }
    }
    if (bgA > 0) {
      ctx.save(); ctx.globalAlpha *= bgA; ctx.strokeStyle = k < 0 ? "rgba(90,140,160,0.6)" : "rgba(255,255,255,0.9)"; ctx.lineWidth = Math.max(2, cell * 0.025); ctx.setLineDash([cell * 0.09, cell * 0.07]);
      for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x + i * cell, y); ctx.lineTo(x + i * cell, y + S); ctx.moveTo(x, y + i * cell); ctx.lineTo(x + S, y + i * cell); ctx.stroke(); }
      ctx.restore();
    }
    if (k >= 0) for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (CL[k][r][c] || (o.ghostCloud && o.ghostCloud(r, c) > 0)) {
      const [cx, cy] = cellC(G, r, c);
      if (CL[k][r][c]) cloud(ctx, cx, cy + cell * 0.04, cell * 0.82, k, o.cloudA ? o.cloudA(r, c) : 1);
      else cloud(ctx, cx, cy + cell * 0.04, cell * 0.82, 2, o.ghostCloud(r, c) * 0.45);
    }
    ctx.strokeStyle = o.frame || (k < 0 ? "#7FA9B8" : FRAME[k]); ctx.lineWidth = o.flw || Math.max(3, cell * 0.04); ctx.strokeRect(x, y, S, S);
    if (o.label !== false) {
      const ls = o.ls || Math.max(24, cell * 0.28);
      text(ctx, k < 0 ? "Awal" : "Lapis " + (k + 1), x + S / 2, y - ls * 0.5, ls, { align: "center", weight: 900, color: k < 0 ? INK : LABC[k] });
    }
    ctx.restore();
  }
  function cellRing(ctx, G, r, c, u, color = ORANGE) {
    if (u <= 0) return; const [cx, cy] = cellC(G, r, c);
    ring(ctx, cx, cy, G.cell * 0.56, G.cell * 0.56, u, color, Math.max(4, G.cell * 0.06));
  }
  function rowBox(ctx, G, r, u) {   // sorotan satu baris
    if (u <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(u, 0, 1); ctx.strokeStyle = ORANGE; ctx.lineWidth = 7;
    rr(ctx, G.x - 8, G.y + r * G.cell - 4, G.cell * 3 + 16, G.cell + 8, 12); ctx.stroke(); ctx.restore();
  }
  function tickMark(ctx, G, r, c, u) { if (u <= 0) return; const [cx, cy] = cellC(G, r, c); tick(ctx, cx, cy, G.cell * 0.55, u, "#13703A", Math.max(5, G.cell * 0.07)); }
  // kotak awan bertumpuk seperti gambar soal; (X, Y) = pojok kiri atas lapis 1 (paling depan)
  function stack(ctx, X, Y, cell, o = {}) {
    const off = cell * 0.3, S = cell * 3;
    const la = o.sky == null ? 1 : o.sky;
    if (la > 0) alpha(ctx, la, () => { const x = X - 3 * off, y = Y - 3 * off; ctx.fillStyle = SKY; ctx.fillRect(x, y, S, S); ctx.strokeStyle = "#111"; ctx.lineWidth = Math.max(4, cell * 0.05); ctx.strokeRect(x, y, S, S); });
    for (let k = 2; k >= 0; k--) {
      const x = X - k * off, y = Y - k * off, hl = o.hl ? o.hl(k) : 0;
      ctx.save(); ctx.fillStyle = "rgba(215,242,252,0.18)"; ctx.fillRect(x, y, S, S); ctx.strokeStyle = FRAME[k]; ctx.lineWidth = Math.max(3, cell * 0.035); ctx.strokeRect(x, y, S, S); ctx.restore();
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (CL[k][r][c]) cloud(ctx, x + (c + 0.5) * cell, y + (r + 0.55) * cell, cell * 0.82, k);
      if (hl > 0) alpha(ctx, hl, () => { ctx.strokeStyle = ORANGE; ctx.lineWidth = Math.max(6, cell * 0.07); ctx.strokeRect(x - 3, y - 3, S + 6, S + 6); });
    }
    if (o.grid) alpha(ctx, o.grid, () => {
      ctx.strokeStyle = RED; ctx.lineWidth = Math.max(2, cell * 0.022); ctx.setLineDash([cell * 0.09, cell * 0.065]);
      for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(X + i * cell, Y); ctx.lineTo(X + i * cell, Y + S); ctx.moveTo(X, Y + i * cell); ctx.lineTo(X + S, Y + i * cell); ctx.stroke(); }
      ctx.setLineDash([]);
    });
    if (o.labels !== false) {
      const L = ["Lapis 1", "Lapis 2", "Lapis 3", "Langit"], fs = cell * 0.2;
      for (let k = 3; k >= 0; k--) { const a = o.lab ? o.lab(k) : 1; if (a > 0) alpha(ctx, a, () => text(ctx, L[k], X + S - k * off + cell * 0.1, Y - k * off + cell * 0.22, fs, { weight: 900, color: LABC[k] })); }
    }
    if (o.plane) {   // z: -0.6 di depan lapis 1, 0 = lapis 1, 1 = lapis 2 ...
      const p = o.plane, z = p.z == null ? -0.6 : p.z;
      plane(ctx, X + (p.c + 0.5) * cell - z * off, Y + (p.r + 0.5) * cell - z * off, cell * (p.s || 0.95) * (1 - 0.08 * (z + 0.6)), p.a == null ? 1 : p.a);
    }
  }
  function skyBadge(ctx, x, y, w, h, u = 1, lab = true) {   // langit cerah sesudah lapis 3
    alpha(ctx, u, () => {
      ctx.fillStyle = "#BFE9F8"; rr(ctx, x, y, w, h, 14); ctx.fill(); ctx.strokeStyle = "#7CC4DE"; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = "#FFD23F"; ctx.beginPath(); ctx.arc(x + w * 0.7, y + h * 0.28, w * 0.14, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#FFD23F"; ctx.lineWidth = 3; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(x + w * 0.7 + Math.cos(a) * w * 0.19, y + h * 0.28 + Math.sin(a) * w * 0.19); ctx.lineTo(x + w * 0.7 + Math.cos(a) * w * 0.25, y + h * 0.28 + Math.sin(a) * w * 0.25); ctx.stroke(); }
      if (lab) text(ctx, "Langit", x + w / 2, y + h - 14, Math.min(28, w * 0.2), { align: "center", weight: 900, color: "#1F5A6E" });
    });
  }

  // ---------- baris peta: Awal, Lapis 1, Lapis 2, Lapis 3 (+ langit) dengan pesawat ----------
  const gridG = (L, i) => ({ x: L.x0 + i * (3 * L.cell + L.gap), y: L.y, cell: L.cell });
  function skyRect(L) { const x = L.x0 + 4 * (3 * L.cell + L.gap) - L.gap + L.gap * 0.5; return [x, L.y + L.cell * 0.3, L.skyW || L.cell * 1.6, L.cell * 2.4]; }
  function ppos(L, path, i) {
    if (i >= 4) { const [x, y, w, h] = skyRect(L); return [x + w / 2, y + h * 0.62]; }
    return cellC(gridG(L, i), path[i][0], path[i][1]);
  }
  function planeAt(L, path, n) {   // n = jumlah langkah (pecahan)
    const max = path.length - 1 + (L.sky && path.length === 4 ? 1 : 0); n = clamp(n, 0, max);
    const i = Math.floor(n), f = n - i; if (f < 1e-4) return ppos(L, path, i);
    const p = ppos(L, path, i), q = ppos(L, path, i + 1), e = ease(f);
    return [lerp(p[0], q[0], e), lerp(p[1], q[1], e) - Math.sin(Math.PI * e) * L.cell * 0.55];
  }
  function pathRow(ctx, L, o = {}) {
    for (let i = 0; i < 4; i++) drawGrid(ctx, gridG(L, i), i - 1, { free: o.free == null ? 1 : o.free, ls: L.ls });
    if (L.sky) { const [x, y, w, h] = skyRect(L); skyBadge(ctx, x, y, w, h, 1, L.skyLab !== false); }
    const path = o.path || SAFE, n = o.n || 0;
    (o.rings || []).forEach(g => cellRing(ctx, gridG(L, g.i), g.r, g.c, g.u, g.color));
    if (o.ghost && o.ghost.a > 0) {   // tempat pesawat sebelumnya, dipindah ke lapis berikutnya
      const G = gridG(L, o.ghost.i), [cx, cy] = cellC(G, o.ghost.r, o.ghost.c);
      alpha(ctx, o.ghost.a, () => { ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.setLineDash([8, 7]); ctx.beginPath(); ctx.arc(cx, cy, L.cell * 0.42, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); plane(ctx, cx, cy, L.cell * 0.7, 0.35); });
      if (o.ghost.to) o.ghost.to.forEach(t => { if (t.u > 0) { const [tx, ty] = cellC(G, t.r, t.c); const k = 0.36; mline(ctx, [[lerp(cx, tx, k), lerp(cy, ty, k)], [lerp(cx, tx, 1 - k * 0.8), lerp(cy, ty, 1 - k * 0.8)]], t.u, t.color || ORANGE, Math.max(5, L.cell * 0.07), true); } });
    }
    (o.arrows || []).forEach((ar, j) => {
      if (!ar || ar.a <= 0) return; const G = gridG(L, j), S = 3 * L.cell;
      const cx = L.below ? G.x + S + L.gap + S / 2 : G.x + S + L.gap / 2, cy = L.below ? L.y + S + L.cell * 0.62 : L.y + (L.chipY != null ? L.chipY : S / 2);
      arrowOut(ctx, cx, cy, L.asz || L.gap * 0.62, ar.dir, { alpha: ar.a, fill: ar.fill, stroke: ar.stroke });
      if (L.alab) alpha(ctx, ar.a, () => text(ctx, ar.dir, cx, L.below ? cy + (L.asz || L.gap * 0.62) * 0.75 + 8 : L.y + S + L.alab * 1.4, L.alab, { align: "center", weight: 800, color: ar.stroke || INK }));
    });
    if (o.trail !== false && n > 0) {
      const pts = [ppos(L, path, 0)]; for (let i = 1; i <= Math.floor(n); i++) pts.push(ppos(L, path, i)); if (n % 1) pts.push(planeAt(L, path, n));
      ctx.save(); ctx.strokeStyle = "rgba(238,122,18,0.75)"; ctx.lineWidth = Math.max(4, L.cell * 0.06); ctx.setLineDash([L.cell * 0.12, L.cell * 0.09]); ctx.lineCap = "round";
      ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
    }
    const pp = planeAt(L, path, n);
    plane(ctx, pp[0], pp[1], L.cell * 0.82, o.pa == null ? 1 : o.pa);
    if (o.boom > 0) boom(ctx, pp[0], pp[1], L.cell * 1.2, o.boom);
  }
  // langkah pesawat pada waktu l: daftar waktu mulai tiap langkah
  const stepsAt = (l, times, d = 1.0) => times.reduce((s, t) => s + clamp((l - t) / d, 0, 1), 0);

  // ---------- 0. pembuka ----------
  function buka(ctx, b, l) {
    board(ctx);
    const first = b.id === "intro1", u = first ? P(l, 0.4, 1.6) : 1;
    ctx.save(); ctx.beginPath(); ctx.rect(620, 180, 1200 * u, 160); ctx.clip();
    text(ctx, "Tantangan Bebras", 1230, 300, 104, { align: "center", weight: 900, color: INK }); ctx.restore();
    mline(ctx, [[700, 330], [1760, 330]], first ? P(l, 1.6, 0.8) : 1, ORANGE, 8);
    const bu = first ? P(l, at(b, "pembahasan"), 0.8) : 1;
    [880, 1110, 1340, 1570].forEach((x, i) => { const v = clamp(bu * 4 - i, 0, 1); if (v > 0) beaver(ctx, x, 560 + (1 - v) * 30, 190, { alpha: v }); });
    if (first) hand(ctx, "tingkat SMP (Penggalang)", 1230, 770, 44, { alpha: P(l, at(b, "tingkat SMP"), 0.6) });
    else hand(ctx, "pelan-pelan, satu langkah demi satu langkah", 1230, 770, 40, { alpha: P(l, at(b, "pelan"), 0.6) });
    kiko(ctx, 380, 560, 230, 0, { wave: l, mood: "happy" });
  }
  function kredit(ctx, b, l) {
    board(ctx);
    const u = P(l, 0.2, 0.6);
    ctx.save(); ctx.globalAlpha = u;
    const gx = 380, gy = 500, gr = 160;
    ctx.fillStyle = "#DCEEFB"; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "#2F6FA8"; ctx.lineWidth = 5; ctx.stroke();
    ctx.lineWidth = 3; for (const k of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.ellipse(gx, gy, gr * Math.abs(Math.cos(k * 1.6)) || 2, gr, 0, 0, Math.PI * 2); ctx.stroke(); }
    for (const k of [-0.5, 0, 0.5]) { const yy = gy + k * gr * 1.3, w = Math.sqrt(Math.max(0, gr * gr - (yy - gy) ** 2)); ctx.beginPath(); ctx.moveTo(gx - w, yy); ctx.lineTo(gx + w, yy); ctx.stroke(); }
    ctx.restore();
    const fu = P(l, at(b, "Irlandia"), 0.6); if (fu > 0) { ctx.save(); ctx.globalAlpha = fu; flagIE(ctx, 470, 240, 170); ctx.restore(); }
    const rows = [["Judul soal", META.judul, "berjudul"], ["Tahun", "Bebras " + META.tahun, "berasal"], ["Dibuat oleh", "Tim Bebras " + META.negara, "dibuat oleh"], ["Kode soal", META.kode, "dibuat oleh"]];
    text(ctx, "ASAL SOAL", 720, 220, 32, { weight: 900, color: C.accentDark });
    rows.forEach(([k, v, ph], i) => {
      const a = P(l, at(b, ph) + (k === "Kode soal" ? 0.8 : 0), 0.5); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      text(ctx, k, 720, 300 + i * 92, 34, { weight: 700, color: C.ink2 });
      text(ctx, v, 1000, 300 + i * 92, 44, { weight: 900, color: k === "Dibuat oleh" ? ORANGE : INK, fit: 820 });
      ctx.restore();
    });
    const au = P(l, at(b, "Irlandia"), 0.8);
    if (au > 0) ring(ctx, 1210, 300 + 2 * 92 - 14, 240, 44, au);
  }

  // ---------- 0. soal ----------
  const SX = 250, SY = 300, SC = 135;   // kotak awan bertumpuk di kiri papan
  function compass(ctx, x, y, cell, show, opt = {}) {   // kotak 3x3, pesawat di tengah, panah ke delapan tetangga
    const G = { x, y, cell };
    drawGrid(ctx, G, -1, { label: false });
    const [cx, cy] = cellC(G, 1, 1);
    plane(ctx, cx, cy, cell * 0.8, opt.pa == null ? 1 : opt.pa);
    Object.entries(DIR).forEach(([n, d]) => {
      if (n === "lurus") return; const a = show(n); if (a <= 0) return;
      const hl = opt.hl && opt.hl(n);
      arrowOut(ctx, cx + d[1] * cell, cy + d[0] * cell, cell * 0.72, n, { alpha: a, fill: hl ? "#FFE3C4" : "#FFFFFF", stroke: hl ? ORANGE : INK });
    });
    return G;
  }
  function langit(ctx, b, l) {
    board(ctx);
    const id = b.id, o = { labels: true };
    let pz = -0.6, pa = 1, bm = 0;
    if (id === "soal1") { o.sky = P(l, at(b, "Di depan"), 0.8); o.lab = () => o.sky; pa = P(l, at(b, "Seorang pilot"), 0.6); }
    if (id === "soal2") o.grid = P(l, at(b, "tiga baris"), 0.6);
    if (id === "soal3") {
      const T = [at(b, "Lapis pertama"), at(b, "Lapis kedua"), at(b, "Lapis ketiga"), at(b, "Di belakang")];
      o.hl = k => (l > T[k] && l < T[k + 1] + 0.2) ? 1 : 0;
      o.lab = k => k === 3 ? P(l, T[3], 0.4) * 0.6 + 0.4 : 1;
    }
    if (id === "soal6") {
      const t = at(b, "maju lurus"), tb = at(b, "menabrak");
      pz = lerp(-0.6, 0, P(l, t, Math.max(0.6, tb - t)));
      bm = P(l, tb, 0.4);
      if (l > at(b, "Tentu saja") + 0.6) { pz = -0.6; bm = 0; }
    }
    o.plane = { r: 0, c: 1, z: pz, a: pa };
    stack(ctx, SX, SY, SC, o);
    if (bm > 0) boom(ctx, SX + 1.5 * SC, SY + 0.5 * SC, SC * 1.15, bm);
    if (id === "soal4") cellRing(ctx, { x: SX + SC * 0.18, y: SY + SC * 0.18, cell: SC }, 0, 1, P(l, at(b, "Pesawat itu berada"), 0.6));
    // panel kanan
    const PX = 900;
    if (id === "soal1") {
      hand(ctx, "Pilot dan pesawatnya", PX + 460, 330, 54, { color: INK, alpha: P(l, at(b, "Seorang pilot"), 0.5) });
      hand(ctx, "Awan tersusun di dalam kotak", PX + 460, 450, 50, { color: "#2F6FA8", alpha: P(l, at(b, "Di depan"), 0.5) });
      alpha(ctx, P(l, at(b, "kotak besar"), 0.5), () => text(ctx, "Tugas pilot: jangan menabrak awan!", PX + 460, 580, 40, { align: "center", weight: 900, color: RED }));
    }
    if (id === "soal2") {
      alpha(ctx, P(l, at(b, "tiga kali tiga"), 0.5), () => text(ctx, "3 × 3 × 3", PX + 460, 330, 110, { align: "center", weight: 900, color: INK }));
      hand(ctx, "3 lapis awan", PX + 460, 450, 52, { color: ORANGE, alpha: P(l, at(b, "tiga lapis"), 0.5) });
      hand(ctx, "tiap lapis: 3 baris × 3 kolom", PX + 460, 545, 48, { color: INK, alpha: P(l, at(b, "tiga baris"), 0.5) });
      hand(ctx, "= 9 petak", PX + 460, 635, 52, { color: GREEN, alpha: P(l, at(b, "sembilan petak"), 0.5) });
    }
    if (id === "soal3") {
      const R = [["Lapis 1", "awan putih", "paling dekat", "Lapis pertama", 0], ["Lapis 2", "awan abu-abu muda", "lebih jauh", "Lapis kedua", 1], ["Lapis 3", "awan gelap", "paling jauh", "Lapis ketiga", 2]];
      R.forEach(([n, w, d, ph, k], i) => alpha(ctx, P(l, at(b, ph), 0.5), () => {
        const y = 250 + i * 135; card(ctx, PX, y, 920, 115, { fill: "#F3F6F8", stroke: "#C9D2D8", lw: 2, r: 18 });
        ctx.fillStyle = SKY; rr(ctx, PX + 18, y + 14, 120, 88, 12); ctx.fill(); cloud(ctx, PX + 78, y + 62, 100, k);
        text(ctx, n + ": " + w, PX + 160, y + 52, 40, { weight: 900, color: LABC[k], fit: 740 });
        text(ctx, d + " dari pesawat", PX + 160, y + 95, 32, { weight: 700, color: C.ink2 });
      }));
      alpha(ctx, P(l, at(b, "Di belakang"), 0.5), () => { skyBadge(ctx, PX, 660, 150, 120, 1, false); text(ctx, "Langit cerah di paling belakang", PX + 180, 735, 40, { weight: 900, color: "#1F5A6E" }); });
    }
    if (id === "soal4") {
      alpha(ctx, P(l, at(b, "Pesawat itu berada"), 0.5), () => {
        const G = { x: PX + 40, y: 250, cell: 90 }; drawGrid(ctx, G, -1, { label: false }); const [cx, cy] = cellC(G, 0, 1); plane(ctx, cx, cy, 70);
        text(ctx, "Posisi awal:", PX + 360, 310, 40, { weight: 900, color: INK }); text(ctx, "petak tengah,", PX + 360, 370, 40, { weight: 800, color: ORANGE }); text(ctx, "baris atas", PX + 360, 425, 40, { weight: 800, color: ORANGE });
      });
      alpha(ctx, P(l, at(b, "Jadi, kiri"), 0.5), () => {
        text(ctx, "Dilihat dari belakang pesawat:", PX + 460, 600, 38, { align: "center", weight: 800, color: INK });
        mline(ctx, [[PX + 400, 690], [PX + 160, 690]], 1, "#2F6FA8", 8, true); text(ctx, "kiri", PX + 160, 750, 40, { align: "center", weight: 900, color: "#2F6FA8" });
        mline(ctx, [[PX + 520, 690], [PX + 760, 690]], 1, "#2F6FA8", 8, true); text(ctx, "kanan", PX + 760, 750, 40, { align: "center", weight: 900, color: "#2F6FA8" });
        plane(ctx, PX + 460, 690, 90);
      });
    }
    if (id === "soal5") {
      const T = { atas: at(b, "ke atas"), bawah: at(b, "ke bawah"), kiri: at(b, "ke kiri"), kanan: at(b, "ke kanan") }, td = at(b, "diagonal");
      compass(ctx, PX + 30, 230, 150, n => P(l, T[n] != null ? T[n] : td, 0.4), { hl: n => n === "kiri bawah" && l > at(b, "misalnya") });
      alpha(ctx, P(l, at(b, "maju satu lapis"), 0.5), () => { hand(ctx, "Setiap gerakan:", PX + 710, 300, 40, { color: INK }); hand(ctx, "maju 1 lapis", PX + 710, 370, 50, { color: ORANGE }); });
      alpha(ctx, P(l, at(b, "Diagonal artinya"), 0.5), () => { hand(ctx, "diagonal = miring", PX + 710, 520, 42, { color: INK }); hand(ctx, "kiri + bawah", PX + 710, 590, 46, { color: ORANGE }); hand(ctx, "sekaligus", PX + 710, 650, 42, { color: ORANGE }); });
    }
    if (id === "soal6") {
      alpha(ctx, P(l, at(b, "maju lurus"), 0.5), () => { compass(ctx, PX + 40, 250, 110, () => 0, {}); const G = { x: PX + 40, y: 250, cell: 110 }, [cx, cy] = cellC(G, 1, 1); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(cx, cy - 55, 9, 0, Math.PI * 2); ctx.fill(); });
      hand(ctx, "Tidak berbelok = maju lurus", 1300, 330, 40, { color: INK, align: "left", alpha: P(l, at(b, "maju lurus"), 0.5) });
      hand(ctx, "→ menabrak awan putih", 1300, 420, 42, { color: RED, align: "left", alpha: P(l, at(b, "menabrak"), 0.5) });
      hand(ctx, "di tengah baris atas", 1300, 490, 40, { color: RED, align: "left", alpha: P(l, at(b, "menabrak"), 0.5) });
    }
  }

  // ---------- 0. pertanyaan dan pilihan ----------
  const OPTY = [420, 520, 620, 720];
  function optRows(ctx, x, y0, dy, s, o = {}) {   // daftar pilihan A–D: huruf + tiga panah
    "ABCD".split("").forEach((L, i) => {
      const y = y0 + i * dy, a = o.rowA ? o.rowA(L) : 1; if (a <= 0) return;
      alpha(ctx, a, () => {
        const hl = o.hl ? o.hl(L) : 0;
        if (hl > 0) alpha(ctx, hl, () => { ctx.fillStyle = "#FFF1DD"; rr(ctx, x - s * 0.5, y - s * 0.62, s * (o.w || 4.6), s * 1.24, 16); ctx.fill(); });
        const st = o.state ? o.state(L) : null;
        ctx.fillStyle = st === "v" ? GREEN : st === "x" ? "#A3ADB5" : C.kiko; ctx.beginPath(); ctx.arc(x, y, s * 0.36, 0, Math.PI * 2); ctx.fill();
        text(ctx, L, x, y + s * 0.15, s * 0.42, { align: "center", weight: 900, color: "#fff" });
        OPT[L].forEach((d, j) => {
          const em = o.em ? o.em(L, j) : 0;
          arrowOut(ctx, x + s * (1.05 + j * 1.05), y, s * 0.82, d, { fill: em > 0 ? "#FFE3C4" : "#FFFFFF", stroke: em > 0 ? ORANGE : INK, alpha: st === "x" ? 0.5 : 1 });
        });
        if (o.words && o.words(L) > 0) alpha(ctx, o.words(L), () => text(ctx, OPT[L].join(", "), x + s * 4.2, y + s * 0.14, s * 0.36, { weight: 800, color: INK }));
        if (st === "v") tick(ctx, x + s * (o.markX || 4.0), y, s * 0.7, o.markU ? o.markU(L) : 1, GREEN, s * 0.12);
        if (st === "x") cross(ctx, x + s * (o.markX || 4.0), y, s * 0.6, o.markU ? o.markU(L) : 1, RED, s * 0.11);
      });
    });
  }
  function pilihan(ctx, b, l) {
    board(ctx);
    const id = b.id;
    stack(ctx, 210, 400, 82, { plane: { r: 0, c: 1 }, labels: false });
    const tq = id === "soal8" ? at(b, "Coba pikirkan") : 1e9;
    if (l < tq) {
      card(ctx, 640, 165, 1180, 150, { fill: "#FFF8E8", stroke: C.accent, lw: 4, r: 20 });
      text(ctx, "Perintah manakah yang dapat membawa pesawat", 1230, 230, 42, { align: "center", weight: 900, color: INK, fit: 1120 });
      text(ctx, "melewati kotak itu tanpa menabrak awan?", 1230, 288, 42, { align: "center", weight: 900, color: INK, fit: 1120 });
    } else thinkBadge(ctx, 640, 170, 1180, 140, l - tq, b.dur - tq, "Ikuti panahnya lapis demi lapis. Mana yang aman?");
    const RD = id === "soal8" ? { A: at(b, "Pilihan A"), B: at(b, "Pilihan B"), C: at(b, "Pilihan C"), D: at(b, "Pilihan D") } : null;
    const nextT = L => ({ A: RD.B, B: RD.C, C: RD.D, D: tq })[L];
    if (id === "soal7") {
      const ta = at(b, "Panah pertama");
      ["lapis 1", "lapis 2", "lapis 3"].forEach((s, j) => alpha(ctx, P(l, ta + j * 1.6, 0.4), () => text(ctx, s, 820 + j * 105, 372, 28, { align: "center", weight: 900, color: LABC[j] })));
    }
    optRows(ctx, 720, OPTY[0], 100, 100, {
      rowA: L => id === "soal7" ? P(l, at(b, "Setiap pilihan") + "ABCD".indexOf(L) * 0.25, 0.4) : 1,
      hl: L => RD ? (l > RD[L] - 0.2 && l < nextT(L) - 0.2 ? 1 : 0) : 0,
      em: (L, j) => id === "soal7" && l > at(b, "Panah pertama") + j * 1.6 && l < at(b, "Panah pertama") + j * 1.6 + 1.6 ? 1 : 0,
      words: L => RD ? P(l, RD[L] + 0.3, 0.4) : 0
    });
  }

  // ---------- 1. memisahkan lapisan ----------
  const PL = { x0: 190, y: 230, cell: 140, gap: 140 };
  const PS = { X: 820, Y: 330, cell: 135 };
  function pisah(ctx, b, l) {
    board(ctx);
    const id = b.id, order = ["s1a", "s1b", "s1c", "s1d", "s1e", "s1f", "s1g", "s1h"], k0 = order.indexOf(id);
    const u = id === "s1a" ? 0 : id === "s1b" ? P(l, at(b, "memisahkan"), 2.2) : 1;
    const off = PS.cell * 0.3;
    alpha(ctx, 1 - u, () => { const x = PS.X - 3 * off, y = PS.Y - 3 * off, S = PS.cell * 3; ctx.fillStyle = SKY; ctx.fillRect(x, y, S, S); ctx.strokeStyle = "#111"; ctx.lineWidth = 6; ctx.strokeRect(x, y, S, S); });
    // tanda sudah selesai per lapis
    const done = [k0 >= 3 ? 1 : 0, k0 >= 6 ? 1 : 0, k0 >= 7 ? 1 : 0];
    if (id === "s1d") done[0] = P(l, at(b, "warna hijau"), 0.5);
    if (id === "s1f") done[1] = P(l, at(b, "Di petak itu") + 0.2, 0.5);
    if (id === "s1g") done[2] = P(l, at(b, "dua petak yang kosong"), 0.5);
    for (let k = 2; k >= 0; k--) {
      const cell = lerp(PS.cell, PL.cell, u), x = lerp(PS.X - k * off, PL.x0 + k * (3 * PL.cell + PL.gap), u), y = lerp(PS.Y - k * off, PL.y, u);
      const G = { x, y, cell }, o = { bg: u, label: false, frame: FRAME[k], free: (r, c) => done[k], flw: 5 };
      if (id === "s1f" && k === 1) o.ghostCloud = (r, c) => (r === 2 && c === 1) ? P(l, at(b, "awan gelap"), 0.5) * (1 - P(l, at(b, "yang letaknya") + 0.6, 0.6)) : 0;
      drawGrid(ctx, G, k, o);
      if (u > 0.9) alpha(ctx, (u - 0.9) * 10, () => {
        text(ctx, "Lapis " + (k + 1), x + 1.5 * cell, y - 22, 38, { align: "center", weight: 900, color: LABC[k] });
      });
    }
    if (u < 0.2) alpha(ctx, 1 - u * 5, () => {
      const L = ["Lapis 1", "Lapis 2", "Lapis 3", "Langit"]; for (let k = 3; k >= 0; k--) text(ctx, L[k], PS.X + 3 * PS.cell - k * off + 14, PS.Y - k * off + 30, 27, { weight: 900, color: LABC[k] });
    });
    const Gk = k => ({ x: PL.x0 + k * (3 * PL.cell + PL.gap), y: PL.y, cell: PL.cell });
    if (id === "s1a") {
      [[540, 450], [1420, 450], [1390, 620]].forEach(([x, y], i) => hand(ctx, "?", x, y, 90, { color: ORANGE, alpha: P(l, at(b, "saling bertumpuk") + i * 0.3, 0.4) }));
      hand(ctx, "Awan di depan menutupi awan di belakangnya.", 960, 735, 40, { color: INK, alpha: P(l, at(b, "Awan di depan"), 0.5) });
    }
    if (id === "s1b") hand(ctx, "Pisahkan: satu lapis = satu peta 3 × 3", 960, 735, 42, { color: ORANGE, alpha: P(l, at(b, "Kita gambar"), 0.5) });
    if (id === "s1c") {
      const G = Gk(0);
      rowBox(ctx, G, 0, l > at(b, "Di baris atas") && l < at(b, "Di baris tengah") ? 1 : 0);
      rowBox(ctx, G, 1, l > at(b, "Di baris tengah") && l < at(b, "Di baris bawah") ? 1 : 0);
      rowBox(ctx, G, 2, l > at(b, "Di baris bawah") ? 1 : 0);
      cellRing(ctx, G, 1, 0, P(l, at(b, "petak kiri kosong"), 0.6), GREEN);
      hand(ctx, "Lapis 1: periksa baris demi baris", 960, 735, 42, { color: INK, alpha: P(l, at(b, "Kita mulai"), 0.5) });
    }
    if (id === "s1d") { const G = Gk(0); tickMark(ctx, G, 1, 0, P(l, at(b, "warna hijau") + 0.3, 0.5)); hand(ctx, "Lapis 1: hanya 1 petak kosong (kiri, baris tengah)", 960, 735, 40, { color: GREEN, alpha: P(l, at(b, "hanya ada satu"), 0.5) }); }
    if (id === "s1e") thinkBadge(ctx, 420, 680, 1080, 108, l, b.dur, "Petak mana yang kosong di lapis 2 dan lapis 3?");
    if (id === "s1f") {
      const G = Gk(1), t = at(b, "Hanya petak tengah");
      rowBox(ctx, G, 0, l > at(b, "Pada lapis kedua") && l < t ? 0.6 : 0); rowBox(ctx, G, 1, l > at(b, "Pada lapis kedua") && l < t ? 0.6 : 0);
      cellRing(ctx, G, 2, 1, P(l, t, 0.6), GREEN);
      const ga = P(l, at(b, "awan gelap"), 0.5) * (1 - P(l, at(b, "yang letaknya") + 0.6, 0.6));
      if (ga > 0) { const [x1, y1] = cellC(G, 2, 1), [x2, y2] = cellC(Gk(2), 2, 1); mline(ctx, [[x1 + 30, y1 + 60], [(x1 + x2) / 2, y1 + 105], [x2 - 30, y2 + 60]], ga, "#1F3F4A", 5, true); alpha(ctx, ga, () => hand(ctx, "awan gelap ini milik lapis 3", (x1 + x2) / 2, y1 + 160, 36, { color: "#1F3F4A" })); }
      if (l > at(b, "yang letaknya") + 1.2) { tickMark(ctx, G, 2, 1, P(l, at(b, "yang letaknya") + 1.2, 0.5)); hand(ctx, "Lapis 2: hanya 1 petak kosong (tengah, baris bawah)", 960, 735, 40, { color: GREEN, alpha: P(l, at(b, "yang letaknya") + 1.2, 0.5) }); }
    }
    if (id === "s1g") {
      const G = Gk(2);
      [0, 1, 2].forEach(r => [0, 1].forEach(c => cellRing(ctx, G, r, c, P(l, at(b, "awan gelap ada") + 0.3 + r * 0.2, 0.4) * (1 - P(l, at(b, "Awan gelap juga"), 0.4)), RED)));
      cellRing(ctx, G, 2, 2, P(l, at(b, "Awan gelap juga") + 0.5, 0.4) * (1 - P(l, at(b, "Jadi, ada dua"), 0.4)), RED);
      tickMark(ctx, G, 0, 2, P(l, at(b, "baris atas dan") - 0.3, 0.5)); tickMark(ctx, G, 1, 2, P(l, at(b, "baris tengah."), 0.5));
      hand(ctx, "Lapis 3: 2 petak kosong (kanan, baris atas dan tengah)", 960, 735, 40, { color: GREEN, alpha: P(l, at(b, "Jadi, ada dua"), 0.5) });
    }
    if (id === "s1h") {
      alpha(ctx, P(l, at(b, "Petak hijau"), 0.5), () => { ctx.fillStyle = "#86D9A0"; rr(ctx, 470, 690, 70, 70, 8); ctx.fill(); text(ctx, "kosong, aman", 560, 740, 40, { weight: 900, color: GREEN }); });
      alpha(ctx, P(l, at(b, "Petak berawan"), 0.5), () => { ctx.fillStyle = SKY; rr(ctx, 1030, 690, 70, 70, 8); ctx.fill(); cloud(ctx, 1065, 727, 60, 0); text(ctx, "berawan, hindari", 1120, 740, 40, { weight: 900, color: RED }); });
    }
  }

  // ---------- 2. arti panah ----------
  function arah(ctx, b, l) {
    board(ctx);
    const id = b.id, G = { x: 200, y: 200, cell: 190 }, PX = 900;
    if (id === "g4") {
      drawGrid(ctx, G, -1, { label: false });
      const [sx, sy] = cellC(G, 2, 1), [tx, ty] = cellC(G, 0, 2);
      plane(ctx, sx, sy, 150);
      const u1 = P(l, at(b, "sejauh satu petak"), 0.5);
      ["kiri", "kanan", "atas", "kiri atas", "kanan atas"].forEach(n => { const d = DIR[n]; arrowOut(ctx, sx + d[1] * G.cell, sy + d[0] * G.cell, 130, n, { alpha: u1 }); });
      const u2 = P(l, at(b, "tidak bisa melompati"), 0.6);
      if (u2 > 0) { ctx.save(); ctx.setLineDash([14, 12]); mline(ctx, [[sx + 30, sy - 60], [tx - 20, ty + 60]], u2, RED, 6, true); ctx.restore(); cross(ctx, tx, ty, 110, P(l, at(b, "tidak bisa melompati") + 0.6, 0.5)); }
      hand(ctx, "1 panah = pindah 1 petak saja", PX + 460, 360, 52, { color: ORANGE, alpha: u1 });
      hand(ctx, "tidak bisa melompati petak", PX + 460, 480, 48, { color: RED, alpha: u2 });
      return;
    }
    const T = id === "g2" ? { atas: at(b, "Panah ke atas"), bawah: at(b, "panah ke bawah"), kiri: at(b, "Panah ke kiri"), kanan: at(b, "panah ke kanan") } : {};
    const tg = id === "g3" ? at(b, "Panah miring") : 0;
    const show = n => {
      const diag = n.includes(" ");
      if (id === "g1") return P(l, at(b, "delapan petak"), 0.6) * 0.35;
      if (id === "g2") return diag ? 0.25 : P(l, T[n], 0.4);
      if (id === "g3") return diag ? P(l, tg, 0.5) : 1;
      return 1;
    };
    const hl = n => id === "g3" && n === "kiri bawah" && l > at(b, "Misalnya");
    const tmv = id === "g3" ? at(b, "Misalnya") + 0.6 : 1e9;
    compass(ctx, G.x, G.y, G.cell, n => show(n) * (n === "kiri bawah" ? 1 - P(l, tmv + 0.6, 0.5) : 1), { hl });
    if (id === "g3") {   // pesawat bayangan pindah ke kiri bawah
      const tm = at(b, "Misalnya") + 0.6, u = P(l, tm, 1.2);
      if (u > 0) { const [cx, cy] = cellC(G, 1, 1), [tx, ty] = cellC(G, 2, 0); plane(ctx, lerp(cx, tx, u), lerp(cy, ty, u), 140, 0.6); }
      alpha(ctx, P(l, at(b, "satu kolom ke kiri"), 0.4), () => { text(ctx, "1 kolom ke kiri", PX + 120, 480, 44, { weight: 900, color: ORANGE }); });
      alpha(ctx, P(l, at(b, "satu baris ke bawah"), 0.4), () => { text(ctx, "+ 1 baris ke bawah", PX + 120, 550, 44, { weight: 900, color: ORANGE }); });
      hand(ctx, "panah miring: 1 baris dan 1 kolom", PX + 460, 340, 46, { color: INK, alpha: P(l, tg, 0.5) });
    }
    if (id === "g1") hand(ctx, "pesawat di tengah, 8 petak tetangga", PX + 460, 360, 46, { color: INK, alpha: P(l, at(b, "Bayangkan"), 0.5) });
    if (id === "g2") {
      hand(ctx, "atas / bawah: pindah 1 baris", PX + 460, 360, 46, { color: INK, alpha: P(l, T.atas, 0.5) });
      hand(ctx, "kiri / kanan: pindah 1 kolom", PX + 460, 460, 46, { color: INK, alpha: P(l, T.kiri, 0.5) });
    }
    if (id === "g5") {
      const t0 = at(b, "maju satu lapis"), x0 = PX + 20, y = 300;
      const items = ["Awal", "Lapis 1", "Lapis 2", "Lapis 3", "Langit"];
      items.forEach((s, i) => alpha(ctx, P(l, t0 + i * 0.25, 0.4), () => {
        const x = x0 + i * 190; ctx.fillStyle = i === 0 ? "#DDF1F8" : i === 4 ? "#BFE9F8" : SKY; rr(ctx, x, y, 140, 110, 14); ctx.fill();
        if (i >= 1 && i <= 3) cloud(ctx, x + 70, y + 58, 90, i - 1); if (i === 0) plane(ctx, x + 70, y + 55, 90);
        if (i === 4) { ctx.fillStyle = "#FFD23F"; ctx.beginPath(); ctx.arc(x + 95, y + 40, 20, 0, Math.PI * 2); ctx.fill(); }
        text(ctx, s, x + 70, y + 150, 30, { align: "center", weight: 900, color: i >= 1 && i <= 3 ? LABC[i - 1] : INK });
      }));
      const TP = [at(b, "panah pertama"), at(b, "Panah kedua"), at(b, "panah ketiga")];
      TP.forEach((t, j) => alpha(ctx, P(l, t, 0.4), () => {
        const x = x0 + j * 190 + 165; mline(ctx, [[x - 14, y + 55], [x + 14, y + 55]], 1, ORANGE, 6, true);
        text(ctx, "panah " + (j + 1), x, y + 235 + (j % 2) * 50, 32, { align: "center", weight: 900, color: ORANGE });
        mline(ctx, [[x, y + 195 + (j % 2) * 50], [x, y + 120]], 1, ORANGE, 4, false);
      }));
      hand(ctx, "1 panah = maju 1 lapis + pindah 1 petak", PX + 460, 660, 42, { color: INK, alpha: P(l, t0, 0.5) });
    }
  }

  // ---------- 3. mencari jalan ----------
  const JL = { x0: 100, y: 270, cell: 95, gap: 130, sky: true, skyW: 140, ls: 30, alab: 26, asz: 84, chipY: 228 };
  function jalan(ctx, b, l) {
    board(ctx);
    const id = b.id, o = { path: SAFE, rings: [], arrows: [] };
    const order = ["r1", "r2", "r3", "r4", "r5", "r6", "r7"], k = order.indexOf(id);
    let n = k >= 2 ? 1 : 0; if (k >= 3) n = 2; if (k >= 6) n = 4;
    const t1 = id === "r2" ? at(b, "Jadi, panah pertama") : 0, t2 = id === "r3" ? at(b, "Jadi, panah kedua") : 0;
    if (id === "r2") n = P(l, t1, 1.1);
    if (id === "r3") n = 1 + P(l, t2, 1.1);
    if (id === "r6") n = 2 + P(l, at(b, "Jadi, panah ketiga"), 1.1) + P(l, at(b, "keluar dari kotak"), 1.1);
    o.n = n;
    const arA = j => (k > j + 1) ? 1 : (id === order[j + 1] ? P(l, [t1, t2, at(b, "Jadi, panah ketiga")][j] + 0.9, 0.4) : 0);
    o.arrows = OPT.C.map((d, j) => ({ dir: d, a: id === "r1" ? 0 : arA(j), stroke: ORANGE, fill: "#FFE3C4" }));
    if (id === "r1") { o.rings.push({ i: 0, r: 0, c: 1, u: P(l, at(b, "tempat pesawat di awal"), 0.6) }, { i: 1, r: 1, c: 0, u: P(l, at(b, "hanya ada satu petak kosong"), 0.6), color: GREEN }); }
    if (id === "r2") o.ghost = { i: 1, r: 0, c: 1, a: P(l, at(b, "Dari petak tengah"), 0.5) * (1 - P(l, t1 + 1.2, 0.4)), to: [{ r: 1, c: 0, u: P(l, at(b, "satu kolom ke kiri"), 0.8) }] };
    if (id === "r3") o.ghost = { i: 2, r: 1, c: 0, a: P(l, at(b, "Di lapis kedua"), 0.5) * (1 - P(l, t2 + 1.2, 0.4)), to: [{ r: 2, c: 1, u: P(l, at(b, "satu kolom ke kanan"), 0.8) }] };
    if (id === "r4" || id === "r5") o.ghost = { i: 3, r: 2, c: 1, a: 1, to: id === "r5" ? [{ r: 0, c: 2, u: P(l, at(b, "terlalu jauh"), 0.8), color: RED }] : [] };
    if (id === "r6") o.ghost = { i: 3, r: 2, c: 1, a: 1 - P(l, at(b, "Jadi, panah ketiga") + 1.2, 0.4), to: [{ r: 1, c: 2, u: P(l, at(b, "satu kolom ke kanan"), 0.8) }] };
    pathRow(ctx, JL, o);
    const G3 = gridG(JL, 3);
    if (id === "r4") {
      [[0, 2], [1, 2]].forEach(([r, c], i) => { const [x, y] = cellC(G3, r, c); hand(ctx, "?", x, y + 22, 64, { color: ORANGE, alpha: 0.6 + 0.4 * Math.sin(l * 3 + i) }); });
      thinkBadge(ctx, 420, 650, 1080, 108, l, b.dur, "Panah ketiga: petak kosong mana yang bisa dicapai?");
    }
    if (id === "r5") { cross(ctx, ...cellC(G3, 0, 2), 70, P(l, at(b, "terlalu jauh") + 0.6, 0.5)); hand(ctx, "2 baris di atas pesawat: terlalu jauh", 960, 700, 44, { color: RED, alpha: P(l, at(b, "terlalu jauh"), 0.5) }); }
    const notes = {
      r1: ["Lapis 1 hanya punya 1 petak kosong.", GREEN, "hanya ada satu"],
      r2: ["1 kolom ke kiri + 1 baris ke bawah = kiri bawah", ORANGE, "satu kolom ke kiri"],
      r3: ["1 kolom ke kanan + 1 baris ke bawah = kanan bawah", ORANGE, "satu kolom ke kanan"],
      r6: ["1 kolom ke kanan + 1 baris ke atas = kanan atas", ORANGE, "satu kolom ke kanan"],
    };
    if (notes[id]) hand(ctx, notes[id][0], 960, 700, 44, { color: notes[id][1], alpha: P(l, at(b, notes[id][2]), 0.5) });
    if (id === "r7") {
      alpha(ctx, P(l, 0.3, 0.5), () => {
        card(ctx, 360, 630, 1200, 150, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 22 });
        OPT.C.forEach((d, j) => { arrowOut(ctx, 470 + j * 140, 705, 100, d, { fill: "#FFFFFF", stroke: GREEN }); });
        text(ctx, "kiri bawah, kanan bawah, kanan atas", 1170, 695, 40, { align: "center", weight: 900, color: GREEN, fit: 640 });
      });
      alpha(ctx, P(l, at(b, "satu-satunya"), 0.5), () => text(ctx, "satu-satunya jalan yang aman", 1170, 750, 34, { align: "center", weight: 800, color: INK }));
    }
  }

  // ---------- 4. memeriksa pilihan ----------
  const CL4 = { x0: 640, y: 300, cell: 75, gap: 55, sky: true, skyW: 110, ls: 26, skyLab: true, below: true, asz: 64 };
  function cek(ctx, b, l) {
    board(ctx);
    const id = b.id, order = ["p1", "p2", "p3", "p4", "p5"], k = order.indexOf(id);
    const tv = id === "p1" ? at(b, "jawabannya adalah C") : -1, tAD = id === "p2" ? at(b, "pesawat langsung menabrak") : -1, tB = id === "p3" ? at(b, "Jadi, pesawat menabrak") : -1;
    const state = L => {
      if (L === "C") return (k > 0 || (tv >= 0 && l > tv)) ? "v" : null;
      if (L === "A" || L === "D") return (k > 1 || (tAD >= 0 && l > tAD)) ? "x" : null;
      if (L === "B") return (k > 2 || (tB >= 0 && l > tB)) ? "x" : null;
    };
    const markU = L => { const t = { C: tv, A: tAD, D: tAD, B: tB }[L]; return t >= 0 ? P(l, t, 0.5) : 1; };
    const hl = L => {
      if (id === "p1") return L === "C" ? 1 : 0;
      if (id === "p2") return L === "A" || L === "D" ? 1 : 0;
      if (id === "p3") return L === "B" ? 1 : 0;
      if (id === "p4") return L === "B" || L === "C" ? 1 : 0;
      return 0;
    };
    const em = (L, j) => (id === "p4" && (L === "B" || L === "C") && j >= 1 && l > at(b, "Bedanya")) ? 1 : (id === "p2" && (L === "A" || L === "D") && j === 0 && l > at(b, "panah ke bawah")) ? 1 : (id === "p3" && L === "B" && ((j === 0 && l > at(b, "dimulai dengan benar") && l < at(b, "Tetapi")) || (j === 1 && l > at(b, "Tetapi")))) ? 1 : 0;
    optRows(ctx, 120, 300, 115, 86, { state, markU, hl, em, markX: 4.3, w: 5.2 });
    // simulasi di peta
    let sim = null;
    if (id === "p1") sim = { L: "C", t0: at(b, "Pilihan C berisi") };
    if (id === "p2") sim = { L: "A", t0: at(b, "panah ke bawah") };
    if (id === "p3") sim = { L: "B", t0: at(b, "dimulai dengan benar") };
    const o = { arrows: [] };
    if (sim) {
      const R = RES[sim.L], steps = R.crash < 0 ? 4 : R.crash + 1;
      const times = [];
      if (id === "p1") { const t = sim.t0 + 0.6; for (let i = 0; i < 4; i++) times.push(t + i * 1.3); }
      if (id === "p2") times.push(at(b, "pindah ke petak"));
      if (id === "p3") { times.push(at(b, "kiri bawah") + 0.2, at(b, "kanan atas") + 0.4); }
      o.path = R.path; o.n = Math.min(steps, stepsAt(l, times, 1.0));
      if (R.crash >= 0) o.boom = P(l, (times[times.length - 1] || 0) + 1.0, 0.4);
      o.arrows = OPT[sim.L].map((d, j) => ({ dir: d, a: P(l, (times[j] != null ? times[j] : 1e9) - 0.2, 0.3), stroke: R.crash === j ? RED : ORANGE, fill: R.crash === j ? "#FBE1DF" : "#FFE3C4" }));
    } else { o.path = SAFE; o.n = 4; o.arrows = OPT.C.map(d => ({ dir: d, a: 1, stroke: GREEN, fill: "#E9F6EE" })); }
    pathRow(ctx, CL4, o);
    const PXn = 1240;
    if (id === "p1") alpha(ctx, P(l, tv, 0.5), () => { card(ctx, 900, 645, 680, 110, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 20 }); text(ctx, "Jawaban: C", PXn, 722, 60, { align: "center", weight: 900, color: GREEN }); });
    if (id === "p2") hand(ctx, "A dan D: menabrak di lapis 1", PXn, 705, 50, { color: RED, alpha: P(l, tAD, 0.5) });
    if (id === "p3") hand(ctx, "B: menabrak di lapis 2", PXn, 705, 50, { color: RED, alpha: P(l, tB, 0.5) });
    if (id === "p4") { hand(ctx, "Panahnya sama, urutannya berbeda.", PXn, 680, 46, { color: ORANGE, alpha: P(l, at(b, "Bedanya"), 0.5) }); hand(ctx, "Urutan perintah itu penting!", PXn, 750, 46, { color: INK, alpha: P(l, at(b, "Jadi, urutan"), 0.5) }); }
    if (id === "p5") { hand(ctx, "Menabrak sekali → pilihan langsung gugur", PXn, 705, 46, { color: RED, alpha: P(l, at(b, "Begitu satu panah"), 0.5) }); }
  }

  // ---------- 5. penutup ----------
  function dekom(ctx, b, l) {
    board(ctx);
    const u = P(l, at(b, "Gambar tiga dimensi"), 1.6);
    stack(ctx, 260, 450, 95, { plane: { r: 0, c: 1 }, labels: false });
    hand(ctx, "dekomposisi", 960, 235, 72, { color: C.kiko, alpha: P(l, at(b, "dekomposisi"), 0.5) });
    alpha(ctx, P(l, at(b, "memecah masalah"), 0.5), () => text(ctx, "memecah masalah besar menjadi bagian-bagian kecil", 960, 300, 38, { align: "center", weight: 800, color: INK }));
    mline(ctx, [[720, 570], [860, 570]], u, ORANGE, 8, true);
    [0, 1, 2].forEach(k => { const x = lerp(260, 920 + k * 310, u), y = lerp(450, 460, u); if (u > 0) drawGrid(ctx, { x, y, cell: 80 }, k, { a: u, free: 1, ls: 28 }); });
    hand(ctx, "1 gambar 3D yang ramai → 3 peta datar", 1340, 750, 42, { color: ORANGE, alpha: P(l, at(b, "tiga peta datar"), 0.5) });
  }
  function drone(ctx, b, l) {
    board(ctx);
    const G = { x: 140, y: 200, cell: 88 }, NX = 9, NY = 6;
    const BLK = ["1,1", "1,2", "2,4", "3,4", "4,1", "4,2", "0,6", "1,6", "3,7", "4,7", "5,4", "2,0"];
    for (let r = 0; r < NY; r++) for (let c = 0; c < NX; c++) {
      const x = G.x + c * G.cell, y = G.y + r * G.cell, blk = BLK.includes(r + "," + c);
      ctx.fillStyle = blk ? "#8E99A1" : "#E7F4FA"; ctx.fillRect(x + 2, y + 2, G.cell - 4, G.cell - 4);
      if (blk) { ctx.fillStyle = "#6E7A82"; ctx.fillRect(x + 2, y + G.cell - 18, G.cell - 4, 16); }
    }
    const route = [[5, 0], [4, 0], [3, 1], [2, 2], [2, 3], [1, 4], [1, 5], [2, 6], [2, 7], [1, 8], [0, 8]];
    const ru = P(l, at(b, "lalu mencari"), 1) * (route.length - 1) * clamp((l - at(b, "lalu mencari")) / 5, 0, 1);
    const pu = P(l, at(b, "petak-petak kecil"), 0.5);
    route.forEach(([r, c], i) => { if (i <= ru + 0.01) alpha(ctx, pu, () => { ctx.fillStyle = "rgba(134,217,160,0.85)"; ctx.fillRect(G.x + c * G.cell + 6, G.y + r * G.cell + 6, G.cell - 12, G.cell - 12); }); });
    const i0 = Math.floor(clamp(ru, 0, route.length - 1)), f = clamp(ru - i0, 0, 1), p = route[i0], q = route[Math.min(route.length - 1, i0 + 1)];
    const dx = G.x + (lerp(p[1], q[1], f) + 0.5) * G.cell, dy = G.y + (lerp(p[0], q[0], f) + 0.5) * G.cell;
    // drone sederhana
    ctx.save(); ctx.translate(dx, dy);
    ctx.strokeStyle = INK; ctx.lineWidth = 5; [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, c]) => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(a * 28, c * 22); ctx.stroke(); ctx.fillStyle = "rgba(43,52,64,0.35)"; ctx.beginPath(); ctx.ellipse(a * 28, c * 22, 18, 5 + 3 * Math.abs(Math.sin(l * 20)), 0, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = C.kiko; rr(ctx, -18, -12, 36, 24, 8); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    const PX = 1000;
    hand(ctx, "drone dan robot", PX + 420, 280, 56, { color: C.kiko, alpha: P(l, at(b, "Drone"), 0.5) });
    hand(ctx, "menghindari rintangan", PX + 420, 370, 46, { color: INK, alpha: P(l, at(b, "menghindari"), 0.5) });
    hand(ctx, "ruang dibagi menjadi petak", PX + 420, 500, 44, { color: INK, alpha: P(l, at(b, "petak-petak kecil"), 0.5) });
    hand(ctx, "cari petak kosong yang aman", PX + 420, 590, 44, { color: GREEN, alpha: P(l, at(b, "lalu mencari"), 0.5) });
  }
  function langkah(ctx, b, l) {
    board(ctx);
    const T = [at(b, "Pertama"), at(b, "Kedua"), at(b, "Ketiga")];
    const S = ["Pisahkan menjadi lapisan, tandai petak kosong.", "Cari jalan lapis demi lapis, satu petak saja.", "Cocokkan dengan pilihan, periksa urutan panah."];
    S.forEach((s, i) => {
      const y = 170 + i * 185, a = P(l, T[i], 0.5);
      alpha(ctx, a, () => {
        card(ctx, 160, y, 1600, 160, { fill: "#F3F6F8", stroke: "#B8C3CA", lw: 2.5, r: 24 });
        ctx.fillStyle = C.kiko; ctx.beginPath(); ctx.arc(250, y + 80, 46, 0, Math.PI * 2); ctx.fill();
        text(ctx, String(i + 1), 250, y + 98, 52, { align: "center", color: "#fff", weight: 900 });
        text(ctx, s, 330, y + 96, 46, { weight: 900, color: INK, fit: 1140 });
        const ix = 1600, iy = y + 80;
        if (i === 0) [2, 1, 0].forEach(k => { ctx.fillStyle = SKY; ctx.fillRect(ix - 40 + (k - 1) * 30, iy - 40 + (k - 1) * 8, 70, 70); ctx.strokeStyle = FRAME[k]; ctx.lineWidth = 3; ctx.strokeRect(ix - 40 + (k - 1) * 30, iy - 40 + (k - 1) * 8, 70, 70); });
        if (i === 1) arrowOut(ctx, ix, iy, 100, "kanan bawah", { fill: "#FFE3C4", stroke: ORANGE });
        if (i === 2) tick(ctx, ix, iy, 90, 1, GREEN, 12);
      });
    });
  }
  function akhir(ctx, b, l) {
    board(ctx);
    kiko(ctx, 330, 520, 220, 0, { wave: l, mood: "happy" });
    [640, 860].forEach((x, i) => beaver(ctx, x, 470 + Math.sin(l * 3 + i) * 8, 160));
    stack(ctx, 700, 640, 45, { plane: { r: 0, c: 1 }, labels: false });
    card(ctx, 1080, 170, 750, 600, { fill: "#F7F9FA", stroke: "#C9D2D8", lw: 3, r: 20 });
    text(ctx, "TERIMA KASIH", 1455, 230, 34, { align: "center", weight: 900, color: C.accentDark });
    const L = [["Soal:", META.judul], ["Bebras:", META.tahun], ["Kontributor:", META.negara], ["Kode soal:", META.kode]];
    L.forEach(([k, v], i) => { const y = 320 + i * 72; text(ctx, k, 1120, y, 30, { weight: 700, color: C.ink2 }); text(ctx, v, 1350, y, 36, { weight: 900, color: k === "Kontributor:" ? ORANGE : INK, fit: 450 }); });
    para(ctx, "Gambar soal digambar ulang untuk video ini.", 1455, 680, 26, 640, { align: "center", weight: 600, color: C.ink2 });
    hand(ctx, "Semoga sukses!", 330, 790, 50, { alpha: P(l, at(b, "Selamat berlatih"), 0.6) });
  }
  function cta_bebras(ctx, b, l) {
    board(ctx);
    text(ctx, "TONTON PEMBAHASAN LENGKAPNYA", 960, 230, 44, { align: "center", weight: 900, color: C.accentDark });
    text(ctx, META.judul, 960, 340, 76, { align: "center", weight: 900, color: INK });
    text(ctx, "Soal Bebras " + META.kode + " · " + META.negara, 960, 420, 40, { align: "center", weight: 800, color: C.ink2 });
    text(ctx, "Pisahkan lapisannya, lalu cari jalan lapis demi lapis", 960, 500, 38, { align: "center", weight: 800, color: ORANGE });
    kiko(ctx, 960, 680, 170, 0, { wave: l, mood: "happy" });
  }

  // ---------- versi tegak untuk Short (area x 440–1480, y 118–830) ----------
  function awan_v(ctx, b, l) {
    board(ctx);
    const id = b.id;
    let note = "", nc = INK;
    if (id === "h0") {
      stack(ctx, 790, 350, 115, { plane: { r: 0, c: 1 } });
      note = "Kotak awan 3 × 3 × 3 · maju 1 lapis tiap langkah";
      alpha(ctx, P(l, at(b, "boleh berbelok"), 0.5), () => compass(ctx, 1190, 250, 60, () => 1, {}));
    }
    if (id === "h1") {
      stack(ctx, 560, 400, 70, { plane: { r: 0, c: 1 }, labels: false });
      optRows(ctx, 880, 300, 105, 78, { rowA: L => P(l, at(b, "Pilihannya") + "ABCD".indexOf(L) * 0.25, 0.4) });
      note = "Mana yang tidak menabrak awan?"; nc = ORANGE;
      if (l > at(b, "Coba pikirkan")) { const tq = at(b, "Coba pikirkan"); hourglass(ctx, 960, 735, l - tq, b.dur - tq, 34); note = ""; }
    }
    if (id === "h2") {
      const L = { x0: 492, y: 330, cell: 95 }, T = [at(b, "Di lapis pertama"), at(b, "Di lapis kedua"), at(b, "Di lapis ketiga")];
      [0, 1, 2].forEach(k => drawGrid(ctx, { x: L.x0 + k * 325, y: L.y, cell: L.cell }, k, { free: P(l, T[k] + 0.8, 0.5), ls: 34 }));
      note = "Petak hijau = kosong dan aman"; nc = GREEN;
      hand(ctx, "Pisahkan lapisannya!", 960, 230, 48, { color: ORANGE, alpha: P(l, 0.2, 0.5) });
    }
    if (id === "h3" || id === "h4") {
      const L = { x0: 474, y: 300, cell: 72, gap: 36, ls: 26, below: true, asz: 70 };
      const t = id === "h3" ? [at(b, "kiri bawah") - 0.3, at(b, "kanan bawah") - 0.3, at(b, "kanan atas") - 0.3] : [-9, -9, -9];
      const n = stepsAt(l, t, 0.9);
      pathRow(ctx, L, { n, arrows: OPT.C.map((d, j) => ({ dir: d, a: P(l, t[j] + 0.6, 0.3), stroke: ORANGE, fill: "#FFE3C4" })) });
      if (id === "h3") { note = "kiri bawah → kanan bawah → kanan atas"; nc = ORANGE; }
      if (id === "h4") {
        card(ctx, 560, 680, 800, 96, { fill: "#E9F6EE", stroke: GREEN, lw: 5, r: 18 });
        text(ctx, "Jawaban: C", 960, 745, 54, { align: "center", weight: 900, color: GREEN });
        hand(ctx, "A, D: menabrak di lapis 1 · B: menabrak di lapis 2", 960, 230, 34, { color: RED, alpha: P(l, at(b, "Pilihan A"), 0.5) });
      }
    }
    if (note) text(ctx, note, 960, 805, 38, { align: "center", weight: 900, color: nc, fit: 1000 });
  }

  Object.assign(K.SCENES, { buka, kredit, langit, pilihan, pisah, arah, jalan, cek, dekom, drone, langkah, akhir, awan_v, cta_bebras });
})(typeof window !== "undefined" ? window : globalThis);
