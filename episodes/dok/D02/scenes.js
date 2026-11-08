/* D02 "Kenapa Harga HP Naik?" — adegan per bab (d02_b0 … d02_b9). Memakai K.dok (sinema.js) dan K.g3d (g3d.js, three.js).
   Beat pahlawan memakai panggung 3D (HP, wafer, tumpukan HBM, pusat data); sisanya ilustrasi 2D bergerak pegas.
   Waktu langkah memakai at(b, "potongan narasi") supaya gambar mengikuti suara. Semua merek hanya ditulis sebagai teks biasa, tanpa logo. */
(function (global) {
  const K = global.Kiko, H = K.helpers, D = K.dok, G = K.g3d;
  const { P, W, HH, clamp, lerp, sm, eio, eout, rng, A, fade, bg, glow, hexA, txt, pill, panel, bip } = D;
  const MISS = global.__missing = global.__missing || [];
  const at = (b, s, off = 0) => { if (b.text.indexOf(s) < 0 && !MISS.includes(b.id + ":" + s)) MISS.push(b.id + ":" + s); return D.at(b, s, off); };
  const spring = (t, k = 9, z = 0.45) => { if (t <= 0) return 0; const d = Math.exp(-z * k * t); return 1 - d * Math.cos(k * Math.sqrt(1 - z * z) * t); };
  const F = (l, t0, d = 0.4) => clamp((l - t0) / d);                       // muncul linear
  const OUT = (l, t1, d = 0.5) => clamp((t1 - l) / d);                     // hilang linear
  const rup = n => "Rp" + Math.round(n).toLocaleString("id-ID");

  // ---------- pembantu gambar ----------
  // muncul dengan pegas di titik (x, y): u = detik sejak isyarat
  function pop(ctx, u, x, y, fn, a = 1) { if (u <= 0 || a <= 0) return; const s = spring(u); ctx.save(); ctx.globalAlpha *= clamp(u / 0.2) * a; ctx.translate(x, y); ctx.scale(s, s); fn(); ctx.restore(); }
  function slide(ctx, u, dy, fn, a = 1) { if (u <= 0 || a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(u / 0.35) * a; ctx.translate(0, (1 - eout(u / 0.6)) * dy); fn(); ctx.restore(); }
  // judul kecil di pojok (kicker) dengan garis amber
  function kicker(ctx, l, t0, big, small, x = 110, y = 150, a = 1) {
    const u = l - t0; if (u <= 0 || a <= 0) return; const s = spring(u);
    ctx.save(); ctx.globalAlpha *= clamp(u / 0.25) * a; ctx.translate(x, y); ctx.scale(lerp(0.85, 1, s), lerp(0.85, 1, s));
    txt(ctx, big, 0, 0, 76, { weight: 900, color: P.ink }); if (small) txt(ctx, small, 2, 50, 32, { weight: 700, color: P.ink2 });
    ctx.fillStyle = P.amber; ctx.fillRect(2, small ? 74 : 26, 140 * clamp(u / 0.6), 6); ctx.restore();
  }
  function source(ctx, s, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a * 0.85; txt(ctx, s, W - 60, HH - 40, 24, { align: "right", weight: 600, color: P.ink2 }); ctx.restore(); }
  function strike(ctx, x1, x2, y, u, col = P.red) { if (u <= 0) return; ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(lerp(x1, x2, eout(u)), y); ctx.stroke(); }
  function crossMark(ctx, cx, cy, s, u, col = P.red) { if (u <= 0) return; ctx.strokeStyle = col; ctx.lineWidth = s * 0.16; ctx.lineCap = "round"; const k = eout(u);
    ctx.beginPath(); ctx.moveTo(cx - s / 2, cy - s / 2); ctx.lineTo(cx - s / 2 + s * clamp(k * 2), cy - s / 2 + s * clamp(k * 2)); ctx.stroke();
    if (k > 0.5) { ctx.beginPath(); ctx.moveTo(cx + s / 2, cy - s / 2); ctx.lineTo(cx + s / 2 - s * clamp(k * 2 - 1), cy - s / 2 + s * clamp(k * 2 - 1)); ctx.stroke(); } }
  function checkMark(ctx, cx, cy, s, col = P.green) { ctx.strokeStyle = col; ctx.lineWidth = s * 0.16; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(cx - s * 0.45, cy); ctx.lineTo(cx - s * 0.1, cy + s * 0.35); ctx.lineTo(cx + s * 0.5, cy - s * 0.4); ctx.stroke(); }
  function arrow(ctx, x1, y1, x2, y2, col, lw = 8, hd = 26, u = 1) {
    if (u <= 0) return; const x = lerp(x1, x2, u), y = lerp(y1, y2, u), a = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x - Math.cos(a) * hd * 0.6, y - Math.sin(a) * hd * 0.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(a - 0.45) * hd, y - Math.sin(a - 0.45) * hd); ctx.lineTo(x - Math.cos(a + 0.45) * hd, y - Math.sin(a + 0.45) * hd); ctx.closePath(); ctx.fill();
  }
  function spinner(ctx, cx, cy, r, t, col = P.ink) { ctx.lineWidth = r * 0.22; ctx.lineCap = "round"; for (let i = 0; i < 10; i++) { ctx.strokeStyle = hexA(col, ((i / 10 + t * 1.2) % 1) * 0.9 + 0.1); const a = i / 10 * 6.283; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55); ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.stroke(); } }

  // ikon aplikasi generik (tanpa merek)
  const APP = { chat: P.green, cam: P.pink, game: P.violet, map: P.teal, music: P.amber, photo: P.blue, video: P.red, book: "#5FD3F3", file: "#A9B8DC" };
  function app(ctx, x, y, s, kind) {
    ctx.save(); ctx.translate(x, y); const c = APP[kind] || P.blue, g = ctx.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2); g.addColorStop(0, c); g.addColorStop(1, hexA(c, 0.7));
    ctx.fillStyle = g; H.rr(ctx, -s / 2, -s / 2, s, s, s * 0.24); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = s * 0.07; ctx.lineCap = "round"; ctx.lineJoin = "round"; const k = s / 100;
    if (kind === "chat") { H.rr(ctx, -28 * k, -24 * k, 56 * k, 40 * k, 14 * k); ctx.fill(); ctx.beginPath(); ctx.moveTo(-14 * k, 14 * k); ctx.lineTo(-22 * k, 28 * k); ctx.lineTo(0, 14 * k); ctx.fill(); }
    else if (kind === "cam") { H.rr(ctx, -30 * k, -18 * k, 60 * k, 42 * k, 10 * k); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, 3 * k, 13 * k, 0, 6.283); ctx.fill(); ctx.fillStyle = "#FFF"; H.rr(ctx, -12 * k, -26 * k, 24 * k, 10 * k, 3 * k); ctx.fill(); }
    else if (kind === "game") { H.rr(ctx, -32 * k, -16 * k, 64 * k, 34 * k, 17 * k); ctx.fill(); ctx.fillStyle = c; ctx.fillRect(-22 * k, -2 * k, 16 * k, 5 * k); ctx.fillRect(-16.5 * k, -8 * k, 5 * k, 16 * k); ctx.beginPath(); ctx.arc(14 * k, -3 * k, 4 * k, 0, 6.283); ctx.arc(22 * k, 5 * k, 4 * k, 0, 6.283); ctx.fill(); }
    else if (kind === "map") { ctx.beginPath(); ctx.arc(0, -8 * k, 18 * k, Math.PI, 0); ctx.lineTo(0, 30 * k); ctx.closePath(); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, -8 * k, 7 * k, 0, 6.283); ctx.fill(); }
    else if (kind === "music") { ctx.beginPath(); ctx.arc(-12 * k, 18 * k, 10 * k, 0, 6.283); ctx.arc(18 * k, 12 * k, 10 * k, 0, 6.283); ctx.fill(); ctx.fillRect(-4 * k, -26 * k, 6 * k, 44 * k); ctx.fillRect(24 * k, -32 * k, 6 * k, 44 * k); ctx.beginPath(); ctx.moveTo(-4 * k, -26 * k); ctx.lineTo(30 * k, -32 * k); ctx.lineTo(30 * k, -22 * k); ctx.lineTo(-4 * k, -16 * k); ctx.fill(); }
    else if (kind === "photo") { H.rr(ctx, -30 * k, -24 * k, 60 * k, 48 * k, 8 * k); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-24 * k, 18 * k); ctx.lineTo(-6 * k, -4 * k); ctx.lineTo(6 * k, 8 * k); ctx.lineTo(14 * k, 0); ctx.lineTo(24 * k, 18 * k); ctx.fill(); ctx.beginPath(); ctx.arc(14 * k, -12 * k, 5 * k, 0, 6.283); ctx.fill(); }
    else if (kind === "video") { ctx.beginPath(); ctx.moveTo(-14 * k, -22 * k); ctx.lineTo(24 * k, 0); ctx.lineTo(-14 * k, 22 * k); ctx.closePath(); ctx.fill(); }
    else if (kind === "book") { H.rr(ctx, -28 * k, -24 * k, 26 * k, 48 * k, 4 * k); ctx.fill(); H.rr(ctx, 2 * k, -24 * k, 26 * k, 48 * k, 4 * k); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(-22 * k, -30 * k); ctx.lineTo(8 * k, -30 * k); ctx.lineTo(22 * k, -16 * k); ctx.lineTo(22 * k, 30 * k); ctx.lineTo(-22 * k, 30 * k); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  // HP 2D generik; draw(ctx, w, h) menggambar isi layar dalam koordinat layar
  function phone(ctx, cx, cy, h, opt = {}) {
    const w = h * 0.48, x = cx - w / 2, y = cy - h / 2;
    if (opt.glow !== false) glow(ctx, cx, cy, h * 0.7, opt.glowCol || P.blue, 0.2);
    ctx.fillStyle = "#1C2550"; H.rr(ctx, x - h * 0.03, y - h * 0.03, w + h * 0.06, h * 1.06, h * 0.09); ctx.fill();
    ctx.strokeStyle = "#3A4A8A"; ctx.lineWidth = Math.max(2, h * 0.008); ctx.stroke();
    ctx.save(); H.rr(ctx, x, y, w, h, h * 0.065); ctx.clip();
    const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, opt.s0 || "#24379A"); g.addColorStop(1, opt.s1 || "#6B3AA6"); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.translate(x, y); if (opt.draw) opt.draw(ctx, w, h); else { const kinds = ["chat", "cam", "game", "map", "music", "photo", "video", "book"]; const s = w * 0.2;
      kinds.forEach((k, i) => app(ctx, w * (0.2 + (i % 3) * 0.3), h * (0.32 + Math.floor(i / 3) * 0.17), s, k)); txt(ctx, "09.41", w / 2, h * 0.17, w * 0.17, { align: "center", weight: 800 }); }
    ctx.restore();
    ctx.fillStyle = "#0A0F24"; H.rr(ctx, cx - w * 0.13, y + h * 0.02, w * 0.26, h * 0.025, h * 0.012); ctx.fill();
  }
  function laptop(ctx, cx, cy, w, opt = {}) {
    const h = w * 0.62, x = cx - w / 2, y = cy - h;
    glow(ctx, cx, cy - h / 2, w * 0.7, P.blue, 0.18);
    ctx.fillStyle = "#1C2550"; H.rr(ctx, x, y, w, h, w * 0.03); ctx.fill(); ctx.strokeStyle = "#3A4A8A"; ctx.lineWidth = 4; ctx.stroke();
    const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, "#1F3C8E"); g.addColorStop(1, "#3A2A7E"); ctx.fillStyle = g; H.rr(ctx, x + w * 0.035, y + w * 0.035, w * 0.93, h - w * 0.07, w * 0.012); ctx.fill();
    if (opt.draw) { ctx.save(); ctx.translate(x + w * 0.035, y + w * 0.035); opt.draw(ctx, w * 0.93, h - w * 0.07); ctx.restore(); }
    ctx.fillStyle = "#2A3672"; ctx.beginPath(); ctx.moveTo(x - w * 0.08, cy); ctx.lineTo(x + w * 1.08, cy); ctx.lineTo(x + w * 1.02, cy + w * 0.05); ctx.lineTo(x - w * 0.02, cy + w * 0.05); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#1A2350"; H.rr(ctx, cx - w * 0.1, cy, w * 0.2, w * 0.016, 4); ctx.fill();
  }
  // meja kerja tampak samping; top = y permukaan meja
  function desk(ctx, cx, top, w, opt = {}) {
    const th = Math.max(16, w * 0.045), lg = opt.leg || w * 0.42;
    glow(ctx, cx, top, w * 0.7, P.amber, opt.light == null ? 0.18 : opt.light);
    ctx.fillStyle = "#5A3A28"; [cx - w / 2 + w * 0.06, cx + w / 2 - w * 0.06 - th].forEach(x => ctx.fillRect(x, top + th, th, lg));
    const g = ctx.createLinearGradient(0, top, 0, top + th); g.addColorStop(0, "#C88A55"); g.addColorStop(1, "#8A5A3A"); ctx.fillStyle = g; H.rr(ctx, cx - w / 2, top, w, th, th * 0.3); ctx.fill();
    ctx.fillStyle = "rgba(255,230,190,0.35)"; ctx.fillRect(cx - w / 2 + 8, top + 2, w - 16, 3);
    if (opt.label) txt(ctx, opt.label, cx, top + th + lg * 0.55, Math.min(40, w * 0.08), { align: "center", weight: 800, color: P.amber });
  }
  // lemari penyimpanan; open 0..1 membuka pintu
  function cupboard(ctx, x, y, w, h, open, opt = {}) {
    glow(ctx, x + w / 2, y + h / 2, w, P.blue, 0.12);
    ctx.fillStyle = "#2B356A"; H.rr(ctx, x, y, w, h, 14); ctx.fill(); ctx.strokeStyle = "#4A5AA0"; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = "#151C42"; ctx.fillRect(x + 14, y + 14, w - 28, h - 28);
    const rows = 4, kinds = ["photo", "file", "video", "music", "photo", "file", "book", "photo", "file", "video", "photo", "file"];
    for (let r = 0; r < rows; r++) { const sy = y + 14 + (r + 1) * (h - 28) / rows; ctx.fillStyle = "#3A4680"; ctx.fillRect(x + 14, sy - 6, w - 28, 6);
      for (let c = 0; c < 3; c++) app(ctx, x + 14 + (c + 0.5) * (w - 28) / 3, sy - 6 - (h - 28) / rows * 0.42, Math.min(56, (w - 28) / 4), kinds[(r * 3 + c) % kinds.length]); }
    const dw = (w - 4) / 2 * (1 - eio(open) * 0.88);
    ctx.fillStyle = "#33407E"; ctx.strokeStyle = "#5868B0"; ctx.lineWidth = 3;
    H.rr(ctx, x + 2, y + 2, dw, h - 4, 10); ctx.fill(); ctx.stroke(); H.rr(ctx, x + w - 2 - dw, y + 2, dw, h - 4, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = P.amber; if (dw > 30) { ctx.fillRect(x + dw - 16, y + h / 2 - 22, 6, 44); ctx.fillRect(x + w - dw + 10, y + h / 2 - 22, 6, 44); }
    if (opt.label) txt(ctx, opt.label, x + w / 2, y + h + 52, 36, { align: "center", weight: 800, color: P.ink2 });
  }
  function chip(ctx, cx, cy, s, opt = {}) {
    const col = opt.col || P.teal; glow(ctx, cx, cy, s * 1.2, col, 0.25 * (opt.glow == null ? 1 : opt.glow));
    ctx.strokeStyle = "#8A97BF"; ctx.lineWidth = Math.max(2, s * 0.03);
    for (let i = 0; i < 6; i++) { const o = -s * 0.36 + i * s * 0.144; [[cx + o, cy - s / 2, cx + o, cy - s * 0.62], [cx + o, cy + s / 2, cx + o, cy + s * 0.62], [cx - s / 2, cy + o, cx - s * 0.62, cy + o], [cx + s / 2, cy + o, cx + s * 0.62, cy + o]].forEach(([a, b, c, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }); }
    ctx.fillStyle = "#151B3C"; H.rr(ctx, cx - s / 2, cy - s / 2, s, s, s * 0.08); ctx.fill(); ctx.strokeStyle = hexA(col, 0.7); ctx.lineWidth = Math.max(2, s * 0.02); ctx.stroke();
    const g = ctx.createLinearGradient(cx - s * 0.3, cy - s * 0.3, cx + s * 0.3, cy + s * 0.3); g.addColorStop(0, hexA(col, 0.9)); g.addColorStop(1, hexA(col, 0.4)); ctx.fillStyle = g; H.rr(ctx, cx - s * 0.3, cy - s * 0.3, s * 0.6, s * 0.6, s * 0.05); ctx.fill();
    if (opt.label) txt(ctx, opt.label, cx, cy + s * 0.1, s * 0.22, { align: "center", weight: 900, color: "#FFFFFF", fit: s * 0.56 });
  }
  function wafer2(ctx, cx, cy, r, opt = {}) {
    ctx.save(); glow(ctx, cx, cy, r * 1.4, opt.glowCol || P.violet, 0.25 * (opt.glow == null ? 1 : opt.glow));
    const g = ctx.createConicGradient(opt.rot || 0, cx, cy); ["#8FA8FF", "#FF8FB8", "#FFD08F", "#7CF0FF", "#B48FFF", "#8FA8FF"].forEach((c, i) => g.addColorStop(i / 5, c));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.97, 0, 6.283); ctx.clip(); ctx.strokeStyle = "rgba(10,16,48,0.45)"; ctx.lineWidth = Math.max(1, r * 0.012);
    const st = r / 7; for (let k = -7; k <= 7; k++) { ctx.beginPath(); ctx.moveTo(cx + k * st, cy - r); ctx.lineTo(cx + k * st, cy + r); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - r, cy + k * st); ctx.lineTo(cx + r, cy + k * st); ctx.stroke(); }
    if (opt.slice) { ctx.fillStyle = hexA(opt.sliceCol || P.violet, 0.85); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + opt.slice * 6.283); ctx.closePath(); ctx.fill(); }
    if (opt.dim) { ctx.fillStyle = `rgba(7,11,36,${opt.dim})`; ctx.fillRect(cx - r, cy - r, r * 2, r * 2); }
    ctx.restore(); ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.stroke();
  }
  // gedung pabrik chip generik (atap bergerigi, jendela bercahaya)
  function factory(ctx, cx, base, s, opt = {}) {
    const w = s, h = s * 0.42, x = cx - w / 2, col = opt.col || P.teal;
    glow(ctx, cx, base - h / 2, s * 0.7, col, 0.15);
    ctx.fillStyle = "#26306A"; ctx.fillRect(x, base - h, w, h);
    ctx.beginPath(); ctx.moveTo(x, base - h); for (let i = 0; i < 4; i++) { ctx.lineTo(x + (i + 0.75) * w / 4, base - h - s * 0.16); ctx.lineTo(x + (i + 0.75) * w / 4, base - h); ctx.lineTo(x + (i + 1) * w / 4, base - h); } ctx.closePath(); ctx.fillStyle = "#313C80"; ctx.fill();
    for (let i = 0; i < 5; i++) { ctx.fillStyle = hexA(col, 0.55 + 0.35 * ((i * 37 + (opt.t || 0) * 2) % 3 > 1.5 ? 1 : 0.4)); ctx.fillRect(x + w * 0.08 + i * w * 0.175, base - h * 0.62, w * 0.11, h * 0.28); }
    ctx.fillStyle = "#1A2150"; ctx.fillRect(cx - w * 0.07, base - h * 0.3, w * 0.14, h * 0.3);
    if (opt.label) txt(ctx, opt.label, cx, base + s * 0.14, Math.min(40, s * 0.12), { align: "center", weight: 800, color: opt.labelCol || P.ink });
  }
  function rackIcon(ctx, x, y, w, h, t, ph = 0) {
    ctx.fillStyle = "#16204E"; H.rr(ctx, x, y, w, h, 6); ctx.fill(); ctx.strokeStyle = "#33408A"; ctx.lineWidth = 2; ctx.stroke();
    for (let i = 0; i < 7; i++) { const yy = y + 8 + i * (h - 16) / 7; ctx.fillStyle = "#0B1030"; ctx.fillRect(x + 6, yy, w - 12, (h - 16) / 7 - 4);
      const v = 0.5 + 0.5 * Math.sin(t * 5 + i * 1.7 + ph); ctx.fillStyle = hexA(i % 3 ? P.teal : P.blue, 0.5 + 0.5 * v); ctx.fillRect(x + 10, yy + 3, (w - 20) * (0.3 + 0.5 * v), 3); }
  }
  function priceTag(ctx, x, y, s, col = P.amber, size = 40) {
    ctx.font = `900 ${size}px ${K.FONT}`; const w = ctx.measureText(s).width + size * 1.1, h = size * 1.6;
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + h * 0.4, y - h / 2); ctx.lineTo(x + w + h * 0.4, y - h / 2); ctx.lineTo(x + w + h * 0.4, y + h / 2); ctx.lineTo(x + h * 0.4, y + h / 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#0A1030"; ctx.beginPath(); ctx.arc(x + h * 0.42, y, size * 0.13, 0, 6.283); ctx.fill();
    txt(ctx, s, x + h * 0.4 + size * 0.55, y + size * 0.36, size, { weight: 900, color: "#10142E" }); return w + h * 0.4;
  }
  function calendar(ctx, cx, cy, s, top, big) {
    ctx.fillStyle = "#EEF3FF"; H.rr(ctx, cx - s / 2, cy - s / 2, s, s, s * 0.1); ctx.fill(); ctx.fillStyle = P.red; H.rr(ctx, cx - s / 2, cy - s / 2, s, s * 0.28, s * 0.1); ctx.fill(); ctx.fillRect(cx - s / 2, cy - s / 2 + s * 0.18, s, s * 0.1);
    txt(ctx, top, cx, cy - s / 2 + s * 0.2, s * 0.14, { align: "center", weight: 800, color: "#FFFFFF" }); txt(ctx, big, cx, cy + s * 0.3, s * 0.36, { align: "center", weight: 900, color: "#10142E", fit: s * 0.9 });
  }
  function coin(ctx, x, y, r) { ctx.fillStyle = "#FFC94D"; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.strokeStyle = "#B8862A"; ctx.lineWidth = r * 0.15; ctx.stroke(); txt(ctx, "Rp", x, y + r * 0.3, r * 0.75, { align: "center", weight: 900, color: "#8A5A10" }); }
  function chili(ctx, x, y, s, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = "#E8343A"; ctx.beginPath(); ctx.moveTo(-s * 0.5, -s * 0.08); ctx.quadraticCurveTo(0, -s * 0.22, s * 0.5, s * 0.12); ctx.quadraticCurveTo(0, s * 0.12, -s * 0.5, s * 0.1); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#3DAA4A"; ctx.fillRect(-s * 0.62, -s * 0.06, s * 0.16, s * 0.1); ctx.restore(); }
  function aiCore(ctx, cx, cy, s, t, a = 1) {   // "AI": inti bercahaya dengan jalur sirkuit
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; glow(ctx, cx, cy, s * 2.2, P.violet, 0.45); glow(ctx, cx, cy, s * 1.1, P.teal, 0.35);
    ctx.strokeStyle = hexA(P.teal, 0.7); ctx.lineWidth = 4; const r = rng(77);
    for (let i = 0; i < 16; i++) { const an = i / 16 * 6.283, r1 = s * 0.62, r2 = s * (1.1 + r() * 0.8); const x1 = cx + Math.cos(an) * r1, y1 = cy + Math.sin(an) * r1, x2 = cx + Math.cos(an) * r2, y2 = cy + Math.sin(an) * r2;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y1 + (y2 - y1) * 0.5); ctx.lineTo(x2, y2); ctx.stroke(); ctx.fillStyle = P.teal; ctx.beginPath(); ctx.arc(x2, y2, 7, 0, 6.283); ctx.fill();
      const u = (t * 0.7 + i * 0.13) % 1; glow(ctx, lerp(x1, x2, u), lerp(y1, y2, u), 16, P.amber, 0.9); }
    chip(ctx, cx, cy, s, { col: P.violet, label: "AI" }); ctx.restore();
  }
  function bar(ctx, x, y, w, h, u, col, label, val) {
    ctx.fillStyle = "rgba(169,184,220,0.12)"; H.rr(ctx, x, y - h, w, h, 10); ctx.fill();
    const hh = h * eout(u); ctx.fillStyle = col; H.rr(ctx, x, y - hh, w, hh, 10); ctx.fill();
    if (label) txt(ctx, label, x + w / 2, y + 44, 30, { align: "center", weight: 700, color: P.ink2 });
    if (val && u > 0.2) txt(ctx, val, x + w / 2, y - hh - 18, 44, { align: "center", weight: 900, color: P.ink });
  }
  function numCard(ctx, l, n, title) {   // kartu tips bernomor (bab 8)
    pop(ctx, l - 0.1, 220, 200, () => { glow(ctx, 0, 0, 160, P.amber, 0.35); ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(0, 0, 70, 0, 6.283); ctx.fill(); txt(ctx, String(n), 0, 30, 86, { align: "center", weight: 900, color: "#10142E" }); });
    slide(ctx, l - 0.3, 30, () => txt(ctx, title, 330, 225, 64, { weight: 900, fit: 1450 }));
  }

  // ---------- butir film: grain + kedip halus di atas semua adegan ----------
  const GRAIN = (() => { const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d"), d = g.createImageData(256, 256), r = rng(3);
    for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (r() - 0.5) * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); return c; })();
  const baseDraw = K.draw;
  K.draw = function (ctx, t, TL) {
    const b = baseDraw(ctx, t, TL);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 0.05; ctx.globalCompositeOperation = "overlay";
    const ox = Math.floor((t * 977) % 256), oy = Math.floor((t * 613) % 256); for (let x = -ox; x < W; x += 256) for (let y = -oy; y < HH; y += 256) ctx.drawImage(GRAIN, x, y);
    ctx.restore();
    const f = clamp(t / 0.8) * clamp((TL.total - t) / 1.2); if (f < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - f})`; ctx.fillRect(0, 0, W, HH); }
    return b;
  };

  // ---------- isyarat efek suara (dibaca sfx_dok.py → sfx.json → musik_dok.py), waktu sama dengan gambar ----------
  K.sfx = function (TL) {
    const out = [], B = id => TL.beats.find(x => x.id === id);
    const ev = (id, phrase, off, kind, amp = 1) => { const b = B(id); if (b) out.push([+(b.start + (phrase ? at(b, phrase) : 0) + off).toFixed(3), kind, amp]); };
    ev("b0_1", "Salah satu HP murah", 0, "whoosh", 0.8); ev("b0_1", "Salah satu HP murah", 4.2, "pop"); ev("b0_1", "Model lain", 0, "pop", 0.8);
    ev("b0_2", "Beberapa produsen besar", 0.2, "riser", 0.7);
    ["bukan HP-nya", "bukan tokonya", "bukan nilai tukar saja"].forEach(c => ev("b0_3", c, 0.3, "clack", 0.5)); ev("b0_3", "yaitu kecerdasan buatan", 0, "shimmer", 0.7); ev("b0_3", "yaitu kecerdasan buatan", 0, "boom", 0.4);
    for (let i = 0; i < 4; i++) ev("b1_1", "Aplikasi yang sedang", i * 0.3 + 0.45, "clack", 0.35);
    ev("b2_1", "RAM delapan gigabyte", 0, "riser", 0.6); ev("b2_2", null, 0.5, "shimmer", 0.9);
    ["Samsung", "SK hynix", "dan Micron"].forEach(c => ev("b2_3", c, 0, "pop", 0.7));
    ev("b3_1", null, -1.3, "riser", 0.8); ev("b3_1", null, 0.5, "boom", 0.8); ev("b3_1", null, 0.5, "shimmer");
    ev("b3_4", "tiga belas ribu", 0, "shimmer", 0.8); ev("b3_5", null, 0.2, "whoosh", 0.7);
    { const b = B("b4_1"); if (b) { const l0 = at(b, "Chip-chip memorinya"); ev("b4_1", null, l0 - 0.2, "whoosh"); for (let i = 0; i < 8; i++) ev("b4_1", null, l0 + 1.6 + i * 0.42, "clack", 0.45 + i * 0.02);
      ev("b4_1", null, Math.max(l0 + 1.6 + 7 * 0.42 + 0.4, at(b, "lalu ditempel")), "shimmer", 0.8); } }
    for (let i = 0; i < 3; i++) ev("b4_2", "tiga kali lebih banyak", i * 0.35, "pop", 0.6);
    ev("b5_1", "naik sekitar sembilan puluh", 0, "riser", 0.7); ev("b5_1", "naik sekitar sembilan puluh", 1.6, "boom", 0.5); ev("b5_1", "naik lagi sekitar enam puluh", 1.6, "pop");
    ev("b5_2", "berhenti menjual", 0, "clack", 0.7);
    ["b8_1", "b8_2", "b8_3", "b8_4"].forEach(id => ev(id, null, 0.1, "pop", 0.8));
    ev("b8_5", null, 0.3, "whoosh", 0.7); ev("b8_5", "pusat data AI", 0, "shimmer", 0.8);
    return out.sort((a, b) => a[0] - b[0]);
  };

  // ======================================================================================================
  Object.assign(K.SCENES, {
    // ---------- 0. Pembuka ----------
    d02_b0(ctx, b, l, t) {
      if (b.id === "b0_1") {
        const tCard = at(b, "Salah satu HP murah"), tOther = at(b, "Model lain");
        G.render(ctx, l, (S, cam) => { S.phone.visible = true;
          S.phone.rotation.set(0.1 + 0.04 * Math.sin(l * 0.7), lerp(-0.95, 0.42, eio(l / 22)) + 0.05 * Math.sin(l * 0.9), -0.04);
          S.phone.position.y = 0.04 * Math.sin(l * 1.1);
          G.camPath([[0, 0, 0.1, 3.5, 0, 0, 0], [tCard - 0.3, 0.15, 0.15, 3.5, 0.1, 0, 0], [tCard + 1.2, 0.92, 0.18, 3.7, 0.92, 0.02, 0], [b.dur, 1.05, 0.25, 4.1, 1.0, 0.02, 0]], l); });
        kicker(ctx, l, 0.6, "Harga HP naik", "terasa di toko dan di toko online", 110, 150, OUT(l, tCard + 0.6));
        // kartu harga
        const u = l - tCard; if (u > 0) {
          const x0 = 1020, y0 = 330; slide(ctx, u, 40, () => {
            panel(ctx, x0, y0, 780, 420, { fill: "rgba(10,16,48,0.82)", stroke: "rgba(169,184,220,0.3)" });
            txt(ctx, "Salah satu HP murah yang populer", x0 + 50, y0 + 70, 34, { weight: 700, color: P.ink2 });
            txt(ctx, "Rp1.399.000", x0 + 50, y0 + 165, 64, { weight: 900, color: P.ink2 }); ctx.font = `900 64px ${K.FONT}`; strike(ctx, x0 + 45, x0 + 55 + ctx.measureText("Rp1.399.000").width, y0 + 143, (u - 2.2) / 0.5);
            const v = clamp((u - 2.6) / 1.4), price = 1399000 + 200000 * eio(v);
            if (u > 2.4) txt(ctx, rup(Math.round(price / 1000) * 1000), x0 + 50, y0 + 285, 92, { weight: 900, color: P.amber });
            pop(ctx, u - 4.2, x0 + 590, y0 + 360, () => pill(ctx, "+Rp200.000", 0, 0, { size: 34, fill: P.red, color: "#FFFFFF" }));
          });
        }
        pop(ctx, l - tOther, 1410, 860, () => pill(ctx, "Model lain: naik sampai Rp1.000.000", 0, 0, { size: 34, stroke: hexA(P.red, 0.9) }));
        source(ctx, "Harga contoh dari berita kenaikan harga HP 2026", F(l, tCard + 1, 0.6));
      } else if (b.id === "b0_2") {
        bg(ctx, t); kicker(ctx, l, 0.3, "Laptop juga", "ikut naik harga");
        const tW = at(b, "Beberapa produsen besar");
        pop(ctx, l - 0.2, 720, 760, () => laptop(ctx, 0, 0, 760, { draw: (c, w, h) => { const kinds = ["file", "book", "photo", "video", "chat"]; kinds.forEach((k, i) => app(c, w * (0.14 + i * 0.18), h * 0.55, w * 0.1, k)); txt(c, "Lembar kerja · Tugas · Foto", w / 2, h * 0.2, 34, { align: "center", weight: 700 }); } }));
        // termometer kenaikan 15–20%
        const u = fade(l, tW, 0.4), x = 1420, y0 = 820, hgt = 520, v = eio((l - tW - 0.4) / 2.2);
        if (u > 0) { ctx.save(); ctx.globalAlpha = u;
          ctx.fillStyle = "rgba(169,184,220,0.15)"; H.rr(ctx, x - 50, y0 - hgt, 100, hgt, 50); ctx.fill();
          const g = ctx.createLinearGradient(0, y0, 0, y0 - hgt); g.addColorStop(0, P.amber); g.addColorStop(1, P.red); ctx.fillStyle = g; const hh = hgt * lerp(0.1, 0.78, v); H.rr(ctx, x - 50, y0 - hh, 100, hh, 50); ctx.fill();
          glow(ctx, x, y0 - hh, 140, P.red, 0.4 * v);
          txt(ctx, "+15–20%", x + 90, y0 - hh + 24, 84, { weight: 900, color: P.ink });
          txt(ctx, "peringatan kenaikan harga", x + 92, y0 - hh + 74, 30, { weight: 700, color: P.ink2 });
          txt(ctx, "dari beberapa produsen besar", x + 92, y0 - hh + 112, 30, { weight: 700, color: P.ink2 }); ctx.restore(); }
      } else if (b.id === "b0_3") {
        bg(ctx, t);
        const cards = [["HP-nya", "bukan HP-nya", "phone"], ["Tokonya", "bukan tokonya", "store"], ["Nilai tukar", "bukan nilai tukar saja", "kurs"]];
        const tAI = at(b, "yaitu kecerdasan buatan"), tHidden = at(b, "sesuatu yang tidak pernah"), down = eio((l - tHidden) / 0.9);
        cards.forEach(([name, cue, kind], i) => {
          const cx = 420 + i * 540, cy = 470 + down * 520, tc = at(b, cue);
          pop(ctx, l - 0.3 - i * 0.18, cx, cy, () => {
            panel(ctx, -220, -190, 440, 380, { fill: "rgba(23,36,78,0.9)" });
            if (kind === "phone") phone(ctx, 0, -20, 220, { glow: false });
            else if (kind === "store") { ctx.fillStyle = "#33407E"; ctx.fillRect(-120, -60, 240, 150); ctx.fillStyle = P.red; for (let k = 0; k < 6; k++) { ctx.fillStyle = k % 2 ? "#FFFFFF" : P.red; ctx.beginPath(); ctx.moveTo(-130 + k * 43.3, -60); ctx.lineTo(-130 + (k + 1) * 43.3, -60); ctx.lineTo(-130 + (k + 1) * 43.3, -110); ctx.lineTo(-130 + k * 43.3, -110); ctx.fill(); }
              ctx.fillStyle = "#7FB2FF"; ctx.fillRect(-90, -30, 80, 60); ctx.fillStyle = "#1A2150"; ctx.fillRect(20, -20, 70, 110); }
            else { txt(ctx, "$ ⇄ Rp", 0, 0, 74, { align: "center", weight: 900, color: P.teal }); }
            txt(ctx, name, 0, 160, 40, { align: "center", weight: 800 });
            if (i < 2) crossMark(ctx, 0, -20, 170, (l - tc - 0.3) / 0.4); else { const u2 = (l - tc - 0.3) / 0.4; if (u2 > 0) { ctx.globalAlpha *= clamp(u2); pill(ctx, "bukan satu-satunya", 0, -150, { size: 28, fill: P.amber, color: "#10142E" }); } }
          }, OUT(l, tHidden + 0.9, 0.5));
        });
        // yang tak terlihat: AI
        const ua = l - tHidden; if (ua > 0) { ctx.save(); ctx.globalAlpha = clamp(ua / 0.8); txt(ctx, "sesuatu yang tidak pernah kamu lihat…", 960, 220, 48, { align: "center", weight: 800, color: P.ink2 });
          // bayangan samar yang berdenyut: belum terlihat jelas
          const hid = clamp((ua - 0.6) / 1.0) * (1 - clamp((l - tAI) / 0.3)); if (hid > 0) { ctx.globalAlpha = hid * (0.35 + 0.15 * Math.sin(t * 3)); ctx.setLineDash([16, 14]); ctx.lineDashOffset = -t * 20; ctx.strokeStyle = P.ink2; ctx.lineWidth = 5; H.rr(ctx, 840, 440, 240, 240, 26); ctx.stroke(); ctx.setLineDash([]); txt(ctx, "?", 960, 600, 130, { align: "center", weight: 900, color: P.ink2 }); }
          ctx.restore(); }
        const s = spring(l - tAI, 7, 0.4); if (l > tAI) { aiCore(ctx, 960, 560, 240 * s, t, clamp((l - tAI) / 0.3)); pop(ctx, l - tAI - 0.4, 960, 900, () => txt(ctx, "kecerdasan buatan (AI)", 0, 0, 56, { align: "center", weight: 900, color: P.amber })); }
        if (l > tAI + 0.8) bip(ctx, 1600, 860 - 60 * sm(fade(l, tAI + 0.8, 0.6)), 150, { mood: "wow", t, look: [-0.8, -0.4] });
      } else {   // b0_4
        bg(ctx, t); const tQ = at(b, "Bagaimana AI"), tDesk = at(b, "Ceritanya dimulai"), xf = eio((l - tDesk) / 1.0);
        ctx.save(); ctx.globalAlpha = 1 - xf;
        // kiri: HP di saku; kanan: pusat data jauh
        pop(ctx, l - 0.2, 480, 600, () => { ctx.fillStyle = "#2E4A86"; ctx.beginPath(); ctx.moveTo(-220, -170); ctx.lineTo(220, -170); ctx.lineTo(200, 200); ctx.quadraticCurveTo(0, 290, -200, 200); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = "#5B7CC8"; ctx.setLineDash([10, 9]); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-190, -140); ctx.lineTo(190, -140); ctx.stroke(); ctx.setLineDash([]);
          phone(ctx, 0, -150, 300, { glow: false }); ctx.fillStyle = "#2E4A86"; ctx.fillRect(-222, -100, 444, 40);
          txt(ctx, "HP di sakumu", 0, 330, 40, { align: "center", weight: 800 }); });
        pop(ctx, l - 0.8, 1450, 560, () => { glow(ctx, 0, 0, 360, P.teal, 0.25); for (let i = 0; i < 5; i++) rackIcon(ctx, -250 + i * 104, -170 + Math.abs(i - 2) * 22, 84, 280 - Math.abs(i - 2) * 44, t, i);
          txt(ctx, "AI di tempat yang jauh", 0, 230, 40, { align: "center", weight: 800 }); });
        const u = fade(l, tQ + 0.5, 1.2); if (u > 0) { ctx.strokeStyle = hexA(P.amber, 0.7); ctx.lineWidth = 5; ctx.setLineDash([14, 14]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(1240, 470); ctx.quadraticCurveTo(960, 140 + 0 * u, 640, 470); ctx.stroke(); ctx.setLineDash([]);
          pop(ctx, l - tQ - 1.0, 960, 260, () => txt(ctx, "?", 0, 40, 150, { align: "center", weight: 900, color: P.amber })); }
        ctx.restore();
        if (xf > 0) { ctx.save(); ctx.globalAlpha = xf; glow(ctx, 960, 520, 520, P.amber, 0.25); desk(ctx, 960, 600, 760, { light: 0.3 }); ctx.restore(); }
      }
    },

    // ---------- 1. Meja kerja di dalam HP ----------
    d02_b1(ctx, b, l, t) {
      bg(ctx, t);
      if (b.id === "b1_1") {
        const tDesk = at(b, "Bayangkan RAM"), tApps = at(b, "Aplikasi yang sedang"), tFast = at(b, "sangat cepat"), z = eio((l - tDesk + 0.3) / 1.2);
        // HP tembus pandang dengan keping RAM, lalu zoom ke meja
        if (z < 1) { ctx.save(); ctx.globalAlpha = 1 - z; const s = lerp(1, 4, z); ctx.translate(760, 540); ctx.scale(s, s); ctx.translate(-760, -540);
          ctx.strokeStyle = hexA(P.ink2, 0.8); ctx.lineWidth = 6; H.rr(ctx, 560, 120, 400, 840, 60); ctx.stroke(); ctx.fillStyle = "rgba(23,36,78,0.6)"; ctx.fill();
          ctx.fillStyle = "#1A2E5A"; H.rr(ctx, 600, 300, 320, 420, 20); ctx.fill(); chip(ctx, 690, 400, 90, { col: P.blue }); chip(ctx, 760, 540, 90, { col: P.amber, label: "RAM" }); chip(ctx, 840, 640, 70, { col: P.teal });
          ctx.restore(); kicker(ctx, l, 0.4, "RAM", "ada di setiap HP dan laptop", 1100, 460, 1 - z); }
        if (z > 0) { ctx.save(); ctx.globalAlpha = z;
          desk(ctx, 960, 650, 1100, { label: "RAM = meja kerja", light: 0.35 });
          ["chat", "cam", "game", "map"].forEach((k, i) => { const u = l - tApps - i * 0.3; if (u <= 0) return; const s = spring(u, 10, 0.4), y = 650 - 70 - (1 - eout(u / 0.5)) * 300; app(ctx, 600 + i * 240, y, 130 * s, k);
            if (l > tFast) { const v = (l - tFast + i * 0.25) % 1.4; if (v < 0.5) { ctx.strokeStyle = hexA(P.amber, 0.8 * (1 - v * 2)); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(600 + i * 240, y, 80 + v * 120, 0, 6.283); ctx.stroke(); } } });
          if (l > tFast) pop(ctx, l - tFast, 960, 220, () => pill(ctx, "diambil dengan sangat cepat ⚡", 0, 0, { size: 36, stroke: hexA(P.amber, 0.8) }));
          ctx.restore(); }
      } else if (b.id === "b1_2") {
        const tSlow = at(b, "lebih lambat dibuka");
        desk(ctx, 560, 660, 720, { label: "meja (RAM)" }); ["chat", "cam", "game"].forEach((k, i) => app(ctx, 360 + i * 200, 580, 110, k));
        pop(ctx, l - 0.6, 0, 0, () => cupboard(ctx, 1180, 190, 520, 640, clamp((l - tSlow) / 3.5), { label: "lemari = memori penyimpanan" }));
        pop(ctx, l - at(b, "Lemari itu besar"), 1440, 120, () => pill(ctx, "besar", 0, 0, { size: 34, fill: P.teal, color: "#10142E" }));
        if (l > tSlow) { pop(ctx, l - tSlow, 1840, 520, () => { ctx.fillStyle = "#EEF3FF"; ctx.beginPath(); ctx.arc(0, 0, 54, 0, 6.283); ctx.fill(); ctx.strokeStyle = "#10142E"; ctx.lineWidth = 7; ctx.lineCap = "round"; const a = t * 1.5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 36, Math.sin(a) * 36); ctx.moveTo(0, 0); ctx.lineTo(0, -26); ctx.stroke(); });
          pop(ctx, l - tSlow - 0.3, 1440, 960, () => pill(ctx, "tetapi lebih lambat dibuka", 0, 0, { size: 32, stroke: hexA(P.red, 0.8) })); }
      } else if (b.id === "b1_3") {
        const tLemot = at(b, "Itulah sebabnya");
        desk(ctx, 460, 680, 360, { label: "meja kecil" }); cupboard(ctx, 1320, 230, 440, 560, 0.8);
        // dua slot meja; aplikasi bolak-balik ke lemari
        const kinds = ["chat", "cam", "game", "map", "music"]; const per = 1.6;
        for (let i = 0; i < 5; i++) { const ph = ((l * 1 / per) + i * 0.37) % 1.6, seat = i % 2; const sx = 390 + seat * 140, sy = 610, ex = 1430 + (i % 3) * 110, ey = 400 + (i % 2) * 140;
          const go = ph < 0.8, u = eio(go ? ph / 0.8 : (ph - 0.8) / 0.8); const x = go ? lerp(sx, ex, u) : lerp(ex, sx, u), y = (go ? lerp(sy, ey, u) : lerp(ey, sy, u)) - Math.sin(u * Math.PI) * 220; app(ctx, x, y, 90, kinds[i]); }
        if (l > tLemot) { pop(ctx, l - tLemot, 860, 300, () => { phone(ctx, 0, 0, 380, { draw: (c, w, h) => { c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(0, 0, w, h); spinner(c, w / 2, h / 2, 50, t); } }); });
          pop(ctx, l - tLemot - 0.5, 860, 560, () => pill(ctx, "lemot…", 0, 0, { size: 40, fill: P.red, color: "#FFFFFF" }));
          bip(ctx, 860, 900, 150, { mood: "sad", t }); }
      } else if (b.id === "b1_4") {
        const tSmooth = at(b, "RAM menentukan");
        pop(ctx, l - 0.2, 600, 540, () => { panel(ctx, -300, -330, 600, 660, { fill: "#EEF3FF", stroke: false });
          txt(ctx, "SPESIFIKASI", -240, -250, 30, { weight: 900, color: "#5E6E98" }); [["Layar", "6,6 inci"], ["Kamera", "50 MP"], ["RAM", "8 GB"], ["Memori", "128 GB"], ["Baterai", "5.000 mAh"]].forEach(([a, v], i) => {
            const y = -170 + i * 92, hl = a === "RAM"; if (hl) { ctx.fillStyle = hexA(P.amber, 0.35 + 0.2 * Math.sin(t * 4)); H.rr(ctx, -260, y - 50, 520, 74, 14); ctx.fill(); }
            txt(ctx, a, -240, y, 38, { weight: 700, color: "#3A4672" }); txt(ctx, v, 240, y, 38, { align: "right", weight: 900, color: "#10142E" }); });
          txt(ctx, "bukan sekadar angka di brosur", 0, 300, 30, { align: "center", weight: 700, color: "#5E6E98" }); });
        // meter kelancaran
        const u = fade(l, tSmooth, 0.4), v = eio((l - tSmooth - 0.3) / 1.6); if (u > 0) { ctx.save(); ctx.globalAlpha = u; const cx = 1360, cy = 640, r = 260;
          ctx.lineWidth = 40; ctx.lineCap = "round"; [[P.red, 0, 0.33], [P.amber, 0.33, 0.66], [P.green, 0.66, 1]].forEach(([c, a0, a1]) => { ctx.strokeStyle = hexA(c, 0.85); ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI + a0 * Math.PI + 0.04, Math.PI + a1 * Math.PI - 0.04); ctx.stroke(); });
          const an = Math.PI + lerp(0.15, 0.86, v) * Math.PI; ctx.strokeStyle = P.ink; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an) * (r - 50), cy + Math.sin(an) * (r - 50)); ctx.stroke(); ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(cx, cy, 22, 0, 6.283); ctx.fill();
          txt(ctx, "lancar", cx, cy + 90, 56, { align: "center", weight: 900, color: P.green }); ctx.restore(); }
      } else {   // b1_5
        const tNow = at(b, "Sekarang"), tHungry = at(b, "karena aplikasi");
        slide(ctx, l - 0.3, 30, () => { txt(ctx, "Sepuluh tahun lalu", 480, 220, 44, { align: "center", weight: 800, color: P.ink2 }); desk(ctx, 480, 640, 300, { label: "2 GB" }); ["chat", "photo"].forEach((k, i) => app(ctx, 420 + i * 120, 580, 90, k)); });
        if (l > tNow) slide(ctx, l - tNow, 30, () => { txt(ctx, "Sekarang", 1300, 220, 44, { align: "center", weight: 800, color: P.ink }); const w = lerp(300, 900, eout((l - tNow) / 1.4)); desk(ctx, 1300, 640, w, { label: "8–12 GB", light: 0.3 });
          ["chat", "photo", "cam", "game", "video", "map"].forEach((k, i) => { const u = l - tHungry - i * 0.22; if (u > 0 || i < 2) app(ctx, 1300 - w / 2 + w * (i + 0.5) / 6, 580 - (u > 0 ? (1 - eout(u / 0.4)) * 120 : 0), 90 * (i < 2 ? 1 : spring(u, 10, 0.45)), k); }); });
        if (l > tHungry + 1.2) pop(ctx, l - tHungry - 1.2, 1300, 900, () => pill(ctx, "aplikasi, kamera, dan game makin rakus", 0, 0, { size: 32, stroke: hexA(P.amber, 0.8) }));
        arrow(ctx, 720, 470, 900, 470, hexA(P.amber, 0.9), 10, 30, eout((l - tNow) / 0.8));
      }
    },

    // ---------- 2. Dibuat oleh segelintir pabrik ----------
    d02_b2(ctx, b, l, t) {
      if (b.id === "b2_1") {
        bg(ctx, t, { stars: 0.4 });
        const tCell = at(b, "Setiap sel menyimpan"), tCount = at(b, "RAM delapan gigabyte"), tLeak = at(b, "Karena muatannya"), tRef = at(b, "harus diisi ulang");
        // keping RAM yang diperbesar menjadi kisi sel
        const z = eio((l - 0.5) / 2.2);
        ctx.save(); ctx.globalAlpha = 1 - z; chip(ctx, 960, 540, lerp(260, 1400, z), { col: P.blue, label: "RAM" }); ctx.restore();
        if (z > 0.6) { ctx.save(); ctx.globalAlpha = clamp((z - 0.6) / 0.4); const cols = 12, rows = 5, cw = 118, ch = 110, x0 = 960 - cols * cw / 2, y0 = 280; const r = rng(4);
          for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const bit = r() > 0.45 ? 1 : 0, x = x0 + i * cw + cw / 2, y = y0 + j * ch + ch / 2;
            // muatan: bocor perlahan, lalu diisi ulang oleh sapuan
            let q = bit; if (bit && l > tLeak) { const sweep = l > tRef ? ((l - tRef) * 0.9) % 1 : -1, pos = i / cols; const since = sweep >= 0 ? ((sweep - pos + 1) % 1) / 0.9 : (l - tLeak); q = clamp(1 - since * 0.55, 0.25, 1); }
            ctx.strokeStyle = "rgba(169,184,220,0.5)"; ctx.lineWidth = 3; H.rr(ctx, x - 34, y - 42, 68, 84, 10); ctx.stroke();
            if (bit) { const g = ctx.createLinearGradient(0, y + 42, 0, y - 42); g.addColorStop(0, P.teal); g.addColorStop(1, P.blue); ctx.fillStyle = g; const hh = 80 * q; H.rr(ctx, x - 32, y + 40 - hh, 64, hh, 8); ctx.fill(); glow(ctx, x, y + 40 - hh / 2, 60, P.teal, 0.25 * q); }
            if (l > tCell) txt(ctx, String(bit), x, y + 14, 40, { align: "center", weight: 900, color: bit ? "#FFFFFF" : P.dim }); }
          if (l > tRef) { const s = ((l - tRef) * 0.9) % 1, x = x0 + s * cols * cw; ctx.fillStyle = hexA(P.amber, 0.25); ctx.fillRect(x - 20, y0 - 20, 40, rows * ch + 40); glow(ctx, x, y0 + rows * ch / 2, 200, P.amber, 0.3); }
          ctx.restore(); }
        kicker(ctx, l, tCell, "1 sel = 1 bit", "angka 0 atau 1, berupa muatan listrik kecil", 110, 140, OUT(l, tCount));
        const uc = l - tCount; if (uc > 0) { ctx.save(); ctx.globalAlpha = clamp(uc / 0.3) * OUT(l, tLeak + 0.2); panel(ctx, 470, 830, 980, 170, { fill: "rgba(6,10,30,0.88)" });
          txt(ctx, Math.round(68719476736 * eio(uc / 2)).toLocaleString("id-ID") + " bit", 960, 915, 70, { align: "center", weight: 900, color: P.amber }); txt(ctx, "di dalam RAM 8 GB", 960, 970, 30, { align: "center", weight: 700, color: P.ink2 }); ctx.restore(); }
        if (l > tLeak) pop(ctx, l - tLeak, 960, 120, () => pill(ctx, l > tRef ? "diisi ulang belasan kali setiap detik" : "muatannya cepat bocor", 0, 0, { size: 36, stroke: hexA(l > tRef ? P.amber : P.red, 0.9) }));
      } else if (b.id === "b2_2") {
        const tFab = at(b, "di dalam pabrik"), tYears = at(b, "Membangun satu pabrik");
        G.render(ctx, l, (S) => { S.wafer.visible = true; G.waferAnim(l + 3, 0.1); G.camPath([[0, 0, 6.5, 4.8, 0, 0, 0], [b.dur, 2.6, 2.6, 4.2, 0.2, 0, 0]], l); });
        kicker(ctx, l, 0.5, "Wafer", "piringan silikon tempat sel-sel dicetak");
        const u = l - tFab; if (u > 0) slide(ctx, u, 30, () => { panel(ctx, 1260, 300, 560, 220, { fill: "rgba(6,10,30,0.82)" });
          txt(ctx, "Pabrik chip", 1300, 370, 40, { weight: 900 }); txt(ctx, "• ruang sangat bersih", 1300, 425, 32, { weight: 700, color: P.ink2 }); txt(ctx, "• biaya sangat mahal", 1300, 475, 32, { weight: 700, color: P.ink2 }); }, OUT(l, tYears + 0.2));
        const v = l - tYears; if (v > 0) { const yr = 2026 + Math.min(4, Math.floor(eio(v / 3) * 4)); pop(ctx, v, 1540, 520, () => calendar(ctx, 0, 0, 220, "TAHUN", String(yr)));
          pop(ctx, v - 0.6, 1540, 720, () => pill(ctx, "pabrik baru: bertahun-tahun", 0, 0, { size: 34, fill: P.amber, color: "#10142E" })); }
      } else {   // b2_3
        bg(ctx, t); const tMeans = at(b, "Artinya"), xf = eio((l - tMeans) / 0.9);
        ctx.save(); ctx.globalAlpha = 1 - xf;
        // donat ±90%
        const cx = 620, cy = 560, r = 280, v = eio((l - 0.4) / 1.8); ctx.lineWidth = 110;
        ctx.strokeStyle = "rgba(169,184,220,0.15)"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.stroke();
        [[P.teal, 0, 0.36], [P.violet, 0.36, 0.64], [P.blue, 0.64, 0.9]].forEach(([c, a0, a1]) => { const e = Math.min(a1, v * 0.9); if (e <= a0) return; ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2 + a0 * 6.283 + 0.01, -Math.PI / 2 + e * 6.283 - 0.01); ctx.stroke(); });
        txt(ctx, "±90%", cx, cy + 20, 96, { align: "center", weight: 900 }); txt(ctx, "RAM dunia", cx, cy + 74, 34, { align: "center", weight: 700, color: P.ink2 });
        [["Samsung", P.teal, "Samsung"], ["SK hynix", P.violet, "SK hynix"], ["Micron", P.blue, "dan Micron"]].forEach(([n, c, cue], i) => pop(ctx, l - at(b, cue), 1380, 300 + i * 220, () => { factory(ctx, -220, 70, 230, { col: c, t }); txt(ctx, n, -60, 30, 54, { weight: 900, color: c }); }));
        ctx.restore();
        if (xf > 0) { ctx.save(); ctx.globalAlpha = xf;
          factory(ctx, 1500, 700, 420, { col: P.teal, t, label: "pabrik RAM" });
          // pelanggan besar yang masih misterius menutup pintu
          const big = spring(l - tMeans - 0.8, 6, 0.45); ctx.fillStyle = "#05081A"; ctx.save(); ctx.translate(1080, 700); ctx.scale(big, big); ctx.beginPath(); ctx.ellipse(0, -190, 150, 190, 0, 0, 6.283); ctx.fill(); txt(ctx, "?", 0, -150, 150, { align: "center", weight: 900, color: P.amber }); ctx.restore();
          const tQ = at(b, "pelanggan lain harus mengantre"); ["phone", "laptop", "console", "car", "tv"].forEach((k, i) => { const u = l - tQ - i * 0.2; if (u <= 0) return; const x = 900 - i * 170 - (1 - eout(u / 0.6)) * 200, y = 640;
            ctx.save(); ctx.globalAlpha = clamp(u / 0.3); if (k === "phone") phone(ctx, x, y, 170, { glow: false }); else if (k === "laptop") laptop(ctx, x, y + 70, 170); else { ctx.fillStyle = "#2B3A7A"; H.rr(ctx, x - 70, y - 60, 140, 120, 20); ctx.fill(); txt(ctx, k === "console" ? "🎮" : k === "car" ? "🚗" : "📺", x, y + 22, 64, { align: "center" }); }
            ctx.restore(); });
          pop(ctx, l - tQ - 0.8, 560, 880, () => pill(ctx, "pelanggan lain harus mengantre", 0, 0, { size: 36, stroke: hexA(P.amber, 0.8) }));
          ctx.restore(); }
      }
    },

    // ---------- 3. AI butuh meja raksasa ----------
    d02_b3(ctx, b, l, t) {
      if (b.id === "b3_1") {
        bg(ctx, t); ctx.save(); ctx.globalAlpha = 1 - eio((l - 0.3) / 0.8); factory(ctx, 1500, 700, 420, { col: P.teal, t }); ctx.restore();
        const u = eio((l - 0.4) / 1.2); ctx.save(); ctx.translate(lerp(1080, 960, u), lerp(510, 520, u)); ctx.fillStyle = `rgba(5,8,26,${1 - u})`; ctx.beginPath(); ctx.ellipse(0, 0, 150, 190, 0, 0, 6.283); ctx.fill(); ctx.restore();
        aiCore(ctx, 960, 520, 300 * spring(l - 0.5, 7, 0.4), t, clamp((l - 0.5) / 0.4));
        pop(ctx, l - 1.0, 960, 975, () => pill(ctx, "Pelanggan besar itu: AI", 0, 0, { size: 52, fill: "rgba(10,16,48,0.92)", stroke: hexA(P.amber, 0.9), color: P.amber }));
      } else if (b.id === "b3_2") {
        bg(ctx, t, { stars: 0.5 }); const tMove = at(b, "Supaya bisa menjawab"), tNext = at(b, "tepat di samping");
        const r = rng(9), n = 900, flow = eio((l - tMove) / 3.2);
        for (let i = 0; i < n; i++) { const sx = 160 + r() * 700, sy = 200 + r() * 640, ex = 1060 + (i % 30) * 13, ey = 380 + Math.floor(i / 30) * 11, d = r() * 0.4, u = eio((flow - d) / 0.6);
          const x = lerp(sx, ex, u), y = lerp(sy, ey, u) - Math.sin(u * Math.PI) * 120; ctx.fillStyle = hexA(i % 7 ? P.teal : P.amber, 0.85); ctx.fillRect(x, y, 5, 5); }
        kicker(ctx, l, 0.4, "Parameter", "miliaran sampai triliunan angka di dalam model AI", 110, 150, OUT(l, tMove + 1));
        if (l > tMove + 1.2) { ctx.save(); ctx.globalAlpha = F(l, tMove + 1.2, 0.5); ctx.strokeStyle = hexA(P.amber, 0.9); ctx.lineWidth = 5; H.rr(ctx, 1040, 360, 420, 360, 20); ctx.stroke(); txt(ctx, "meja kerja super cepat", 1250, 780, 36, { align: "center", weight: 800, color: P.amber }); ctx.restore(); }
        if (l > tNext) pop(ctx, l - tNext, 1680, 540, () => { chip(ctx, 0, 0, 260, { col: P.violet, label: "PROSES" }); arrow(ctx, -230, 0, -160, 0, P.amber, 8, 24); }), pop(ctx, l - tNext - 0.4, 1680, 760, () => txt(ctx, "chip pemroses", 0, 0, 34, { align: "center", weight: 800, color: P.ink2 }));
      } else if (b.id === "b3_3") {
        bg(ctx, t, { stars: 0.5 }); const tSlow = at(b, "Kalau memorinya lambat"), tBuf = at(b, "seperti video");
        const words = ["Harga", " HP", " naik", " karena", " memori", " untuk", " AI", " sangat", " dicari", "…"];
        const speed = l < tSlow ? 2.6 : 0.5, nWords = l < tSlow ? Math.floor((l - 0.4) * speed) : Math.floor((tSlow - 0.4) * 2.6 + (l - tSlow) * speed * (l > tBuf ? 0.15 : 1));
        const shown = clamp(nWords, 0, words.length);
        panel(ctx, 260, 170, 1400, 220, { fill: "rgba(30,42,85,0.95)" }); txt(ctx, "AI", 320, 250, 36, { weight: 900, color: P.violet });
        txt(ctx, words.slice(0, shown).join("") + (Math.floor(t * 2) % 2 ? "▍" : ""), 320, 320, 52, { weight: 700, fit: 1280 });
        // memori: setiap kata baru = membaca ulang semua parameter (sapuan)
        const gx = 360, gy = 520, cols = 40, rows = 8, cw = 30; const last = l < tSlow ? (l - 0.4) * speed : (tSlow - 0.4) * 2.6 + (l - tSlow) * speed * (l > tBuf ? 0.15 : 1); const fr = last % 1;
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const lit = Math.abs(i / cols - fr) < 0.06; ctx.fillStyle = lit ? P.amber : hexA(P.teal, 0.35); ctx.fillRect(gx + i * cw, gy + j * cw, cw - 6, cw - 6); }
        txt(ctx, "memori: dibaca ulang untuk setiap potongan kata", 960, gy + rows * cw + 60, 34, { align: "center", weight: 700, color: P.ink2 });
        if (l > tSlow) pop(ctx, l - tSlow, 1700, 640, () => pill(ctx, "memori lambat", 0, 0, { size: 32, fill: P.red, color: "#FFFFFF" }));
        if (l > tBuf) { ctx.save(); ctx.globalAlpha = F(l, tBuf, 0.3); ctx.fillStyle = "rgba(0,0,0,0.45)"; H.rr(ctx, 260, 170, 1400, 220, 24); ctx.fill(); spinner(ctx, 960, 280, 60, t); ctx.restore();
          pop(ctx, l - tBuf - 0.3, 960, 1000, () => pill(ctx, "buffering…", 0, 0, { size: 36, stroke: hexA(P.amber, 0.8) })); }
      } else if (b.id === "b3_4") {
        const tPh = at(b, "Itu kira-kira sama");
        G.render(ctx, l, (S) => { S.dc.visible = S.floor.visible = S.grid.visible = true; G.dcAnim(l);
          G.camPath([[0, 6.9, 1.35, -4.6, 8.9, 1.3, -6.4], [tPh, 7.1, 1.6, -5.4, 8.9, 1.3, -7.0], [b.dur, 6.4, 1.9, -3.0, 8.4, 1.2, -9.5]], l); });
        const tGB = at(b, "tiga belas ribu"); const u = l - tGB;
        if (u > -0.3) slide(ctx, u + 0.3, 30, () => { panel(ctx, 90, 300, 640, 300, { fill: "rgba(6,10,30,0.85)" }); txt(ctx, "1 lemari server AI", 130, 370, 36, { weight: 800, color: P.ink2 });
          txt(ctx, Math.round(13400 * eio(u / 1.6)).toLocaleString("id-ID") + " GB", 130, 480, 100, { weight: 900, color: P.amber }); txt(ctx, "memori super cepat", 130, 550, 32, { weight: 700, color: P.ink2 }); });
        const v = l - tPh; if (v > 0) { ctx.save(); ctx.globalAlpha = clamp(v / 0.4); panel(ctx, 90, 640, 640, 380, { fill: "rgba(6,10,30,0.85)" });
          const n = Math.floor(1700 * eio((v - 0.3) / 3)); for (let i = 0; i < n; i++) { const x = 120 + (i % 50) * 11.6, y = 670 + Math.floor(i / 50) * 7.6; ctx.fillStyle = i % 11 ? P.teal : P.amber; ctx.fillRect(x, y, 7, 6); }
          txt(ctx, "= " + n.toLocaleString("id-ID") + " HP × 8 GB", 130, 995, 44, { weight: 900 }); ctx.restore(); }
      } else {   // b3_5
        const tRace = at(b, "Perusahaan teknologi");
        G.render(ctx, l, (S) => { S.dc.visible = S.floor.visible = S.grid.visible = true; G.dcAnim(l);
          G.camPath([[0, 6.2, 1.4, -2.6, 6.2, 1.3, -20], [8, 6.2, 9.5, 5.5, 6.2, 0, -16], [b.dur, 4.4, 13, 9.5, 6.2, 0, -18]], l); });
        kicker(ctx, l, at(b, "ribuan lemari"), "Pusat data", "ribuan lemari server dalam satu gedung", 110, 150, OUT(l, tRace + 3));
        if (l > tRace) pop(ctx, l - tRace, 1420, 920, () => pill(ctx, "berlomba membangun pusat data baru", 0, 0, { size: 34, stroke: hexA(P.amber, 0.8) }), OUT(l, b.dur - 4));
      }
    },

    // ---------- 4. Memori bertingkat yang rakus ----------
    d02_b4(ctx, b, l, t) {
      if (b.id === "b4_1") {
        const lift0 = at(b, "Chip-chip memorinya"), step = 0.42, C = { lift0, landStep: step, lands: Array.from({ length: 8 }, (_, i) => lift0 + 1.6 + i * step), stackGlow: Math.max(lift0 + 1.6 + 7 * step + 0.4, at(b, "lalu ditempel")) };
        const S0 = G.STACK;
        G.render(ctx, l, (S) => { S.floor.visible = true; G.waferAnim(l, 0.08); G.hbmAnim(l, C);
          G.camPath([[0, -1.5, 2.2, 6.0, 0, 0, 0], [lift0 - 0.3, 2.5, 1.6, 4.6, 0.4, 0, -0.2], [lift0 + 2.7, 6.8, 2.6, 4.8, 3.6, 0.3, -0.4], [C.stackGlow, 7.6, 1.5, 2.6, S0.x + 0.7, 0.45, S0.z], [b.dur, 8.4, 1.25, 1.3, S0.x + 0.8, 0.5, S0.z]], l); });
        kicker(ctx, l, 0.6, "Bukan RAM biasa", "", 110, 150, OUT(l, at(b, "Namanya HBM")));
        const tH = at(b, "Namanya HBM"); kicker(ctx, l, tH, "HBM", "high bandwidth memory · memori bertingkat untuk AI", 110, 150, OUT(l, b.dur - 0.6));
        if (l > C.stackGlow + 0.5) pop(ctx, l - C.stackGlow - 0.5, 1540, 900, () => pill(ctx, "tepat di samping chip AI", 0, 0, { size: 34, stroke: hexA(P.teal, 0.9) }));
      } else if (b.id === "b4_2") {
        bg(ctx, t); kicker(ctx, l, 0.3, "Untuk jumlah gigabyte yang sama", "", 110, 150);
        const tThree = at(b, "tiga kali lebih banyak");
        // kolom kiri: RAM biasa
        pop(ctx, l - 0.6, 560, 520, () => { wafer2(ctx, 0, 0, 150, { rot: t * 0.2 }); txt(ctx, "RAM biasa", 0, 250, 48, { align: "center", weight: 900 }); txt(ctx, "1 wafer", 0, 300, 34, { align: "center", weight: 700, color: P.ink2 }); });
        for (let i = 0; i < 3; i++) pop(ctx, l - tThree - i * 0.35, 1150 + i * 260, 520, () => wafer2(ctx, 0, 0, 120, { rot: t * 0.2 + i, glowCol: P.violet }));
        if (l > tThree) pop(ctx, l - tThree - 0.2, 1410, 770, () => { txt(ctx, "HBM", 0, 0, 48, { align: "center", weight: 900, color: P.violet }); txt(ctx, "±3× wafer", 0, 52, 34, { align: "center", weight: 700, color: P.ink2 }); });
        ctx.strokeStyle = "rgba(169,184,220,0.25)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(860, 300); ctx.lineTo(860, 860); ctx.stroke();
        if (l > tThree + 1.2) pop(ctx, l - tThree - 1.2, 960, 960, () => pill(ctx, "hasilnya sama: 1 GB", 0, 0, { size: 34, fill: P.amber, color: "#10142E" }));
      } else if (b.id === "b4_3") {
        bg(ctx, t); const tShift = at(b, "pabrik mengalihkan"), tLess = at(b, "Wafer untuk RAM HP");
        factory(ctx, 330, 640, 420, { col: P.teal, t, label: "pabrik RAM" });
        const share = lerp(0.35, 0.78, eio((l - tShift) / 4));   // porsi wafer ke HBM
        // jalur atas (HBM untuk AI) dan bawah (RAM HP & laptop)
        ctx.lineCap = "round"; ctx.strokeStyle = hexA(P.violet, 0.5); ctx.lineWidth = 20 + 60 * share; ctx.beginPath(); ctx.moveTo(560, 560); ctx.bezierCurveTo(800, 560, 860, 330, 1200, 330); ctx.stroke();
        ctx.strokeStyle = hexA(P.teal, 0.5); ctx.lineWidth = 20 + 60 * (1 - share); ctx.beginPath(); ctx.moveTo(560, 600); ctx.bezierCurveTo(800, 600, 860, 800, 1200, 800); ctx.stroke();
        const r = rng(12); for (let i = 0; i < 26; i++) { const ph = (t * 0.35 + i / 26) % 1, up = r() < share, bx = (u) => { const a = 1 - u; return up ? [a * a * a * 560 + 3 * a * a * u * 800 + 3 * a * u * u * 860 + u * u * u * 1200, a * a * a * 560 + 3 * a * a * u * 560 + 3 * a * u * u * 330 + u * u * u * 330] : [a * a * a * 560 + 3 * a * a * u * 800 + 3 * a * u * u * 860 + u * u * u * 1200, a * a * a * 600 + 3 * a * a * u * 600 + 3 * a * u * u * 800 + u * u * u * 800]; };
          const [x, y] = bx(ph); wafer2(ctx, x, y, 22, { glow: 0, rot: i }); }
        pop(ctx, l - 0.4, 1460, 330, () => { aiCore(ctx, 0, 0, 120, t); pill(ctx, "HBM untuk AI", 0, 200, { size: 34, fill: "rgba(10,16,48,0.92)", stroke: hexA(P.violet, 0.9), color: "#FFFFFF" }); });
        pop(ctx, l - 0.6, 1460, 800, () => { phone(ctx, -60, 0, 170, { glow: false }); laptop(ctx, 80, 70, 170); txt(ctx, "RAM HP dan laptop", 0, 150, 38, { align: "center", weight: 900, color: P.teal }); });
        for (let i = 0; i < 4; i++) pop(ctx, l - 0.8 - i * 0.25, 1660 + (i % 2) * 70, 240 + Math.floor(i / 2) * 60, () => coin(ctx, 0, 0, 30));
        pop(ctx, l - 1.0, 1700, 140, () => txt(ctx, "berani membayar lebih mahal", 0, 0, 30, { align: "center", weight: 800, color: P.amber }));
        if (l > tLess) pop(ctx, l - tLess, 1050, 980, () => pill(ctx, "wafer untuk HP dan laptop makin sedikit", 0, 0, { size: 34, stroke: hexA(P.red, 0.8) }));
      } else {   // b4_4
        bg(ctx, t); const tThird = at(b, "hampir sepertiga"), v = eio((l - tThird) / 1.4);
        kicker(ctx, l, 0.3, "Tahun 2027", "perkiraan Samsung");
        wafer2(ctx, 760, 560, 330, { rot: t * 0.05, slice: v * 0.31, sliceCol: P.violet, dim: 0.25 });
        if (l > tThird) { pop(ctx, l - tThird - 0.4, 1420, 470, () => { txt(ctx, "≈ 1/3", 0, 0, 150, { align: "center", weight: 900, color: P.violet }); txt(ctx, "wafer RAM dunia", 0, 70, 40, { align: "center", weight: 800 }); txt(ctx, "untuk membuat HBM", 0, 120, 40, { align: "center", weight: 800, color: P.ink2 }); }); }
        source(ctx, "Perkiraan Samsung untuk tahun 2027", F(l, tThird, 0.6));
      }
    },

    // ---------- 5. Harga yang melonjak ----------
    d02_b5(ctx, b, l, t) {
      bg(ctx, t);
      if (b.id === "b5_1") {
        const t90 = at(b, "naik sekitar sembilan puluh"), tRec = at(b, "rekor tertinggi"), t60 = at(b, "naik lagi sekitar enam puluh");
        kicker(ctx, l, 0.3, "Harga kontrak RAM", "harga borongan antara pabrik dan pembuat HP", 110, 140);
        const x0 = 300, y0 = 880, xs = [x0 + 120, x0 + 620, x0 + 1120], vals = [100, 190, 304], sc = 1.75, pts = vals.map((v, i) => [xs[i], y0 - v * sc]);
        ctx.strokeStyle = "rgba(169,184,220,0.2)"; ctx.lineWidth = 2; for (let k = 0; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(x0, y0 - k * 100 * sc); ctx.lineTo(x0 + 1300, y0 - k * 100 * sc); ctx.stroke(); }
        ["Okt–Des tahun lalu", "Jan–Mar tahun ini", "Apr–Jun tahun ini"].forEach((s, i) => txt(ctx, s, xs[i], y0 + 50, 30, { align: "center", weight: 700, color: P.ink2 }));
        const seg = [[0, t90, 1.6], [1, t60, 1.6]]; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.strokeStyle = P.amber;
        seg.forEach(([i, t0, d]) => { const u = eio((l - t0) / d); if (u <= 0) return; ctx.beginPath(); ctx.moveTo(...pts[i]); ctx.lineTo(lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u)); ctx.stroke(); });
        pts.forEach(([x, y], i) => { const t0 = i === 0 ? 0.6 : seg[i - 1][1] + 1.6; pop(ctx, l - t0, x, y, () => { glow(ctx, 0, 0, 60, P.amber, 0.5); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(0, 0, 16, 0, 6.283); ctx.fill(); }); });
        pop(ctx, l - t90 - 1.6, pts[1][0], pts[1][1] - 80, () => pill(ctx, "+90%", 0, 0, { size: 46, fill: P.red, color: "#FFFFFF" }));
        if (l > tRec) pop(ctx, l - tRec, pts[1][0] - 230, pts[1][1] - 80, () => pill(ctx, "rekor", 0, 0, { size: 32, fill: P.amber, color: "#10142E" }));
        pop(ctx, l - t60 - 1.6, pts[2][0], pts[2][1] - 80, () => pill(ctx, "+60% lagi", 0, 0, { size: 46, fill: P.red, color: "#FFFFFF" }));
        source(ctx, "Sumber: TrendForce · garis = ilustrasi kenaikan", F(l, t90, 0.6));
      } else if (b.id === "b5_2") {
        const tStop = at(b, "berhenti menjual"), tWhy = at(b, "Alasannya");
        kicker(ctx, l, 0.3, "Micron", "salah satu dari tiga pembuat besar");
        // rak toko berisi kotak RAM generik
        const sx = 260, sy = 360; ctx.fillStyle = "#2B356A"; H.rr(ctx, sx, sy, 760, 520, 16); ctx.fill(); [0, 1, 2].forEach(r => { ctx.fillStyle = "#4A5AA0"; ctx.fillRect(sx + 20, sy + 160 + r * 165, 720, 10);
          for (let c = 0; c < 5; c++) { const gone = l > tWhy && (r * 5 + c) * 0.18 < (l - tWhy); if (gone) continue; const x = sx + 50 + c * 140, y = sy + 50 + r * 165; ctx.fillStyle = "#1C2550"; H.rr(ctx, x, y, 110, 110, 10); ctx.fill(); ctx.strokeStyle = hexA(P.teal, 0.7); ctx.lineWidth = 3; ctx.stroke();
            ctx.fillStyle = P.teal; ctx.fillRect(x + 15, y + 62, 80, 18); for (let k = 0; k < 6; k++) { ctx.fillStyle = "#0A1030"; ctx.fillRect(x + 20 + k * 12, y + 66, 7, 10); } txt(ctx, "RAM", x + 55, y + 45, 28, { align: "center", weight: 900 }); } });
        txt(ctx, "untuk pembeli biasa", sx + 380, sy + 580, 34, { align: "center", weight: 700, color: P.ink2 });
        if (l > tStop) pop(ctx, l - tStop, sx + 380, sy + 250, () => { ctx.rotate(-0.08); ctx.fillStyle = P.red; H.rr(ctx, -330, -60, 660, 120, 16); ctx.fill(); txt(ctx, "TIDAK DIJUAL LAGI", 0, 20, 56, { align: "center", weight: 900, color: "#FFFFFF" }); });
        // truk menuju pusat data AI
        pop(ctx, l - tWhy, 1600, 560, () => { glow(ctx, 0, 0, 300, P.teal, 0.25); for (let i = 0; i < 4; i++) rackIcon(ctx, -200 + i * 105, -150, 88, 300, t, i); txt(ctx, "pusat data AI", 0, 210, 38, { align: "center", weight: 800 }); });
        if (l > tWhy) { const u = ((l - tWhy) * 0.35) % 1, x = lerp(1050, 1360, eio(u)); ctx.save(); ctx.globalAlpha = clamp((l - tWhy) / 0.4) * (1 - clamp((u - 0.85) / 0.15));
          ctx.fillStyle = "#3B4E9A"; H.rr(ctx, x - 120, 760, 160, 90, 10); ctx.fill(); ctx.fillStyle = "#5B7CC8"; H.rr(ctx, x + 40, 785, 70, 65, 10); ctx.fill(); ctx.fillStyle = "#0A1030"; [x - 80, x + 70].forEach(xx => { ctx.beginPath(); ctx.arc(xx, 858, 20, 0, 6.283); ctx.fill(); });
          txt(ctx, "RAM", x - 40, 818, 30, { align: "center", weight: 900 }); ctx.restore();
          pop(ctx, l - tWhy - 0.6, 1600, 960, () => pill(ctx, "permintaan pusat data AI sangat besar", 0, 0, { size: 32, stroke: hexA(P.amber, 0.8) })); }
      } else {   // b5_3 nasi goreng
        const tChili = at(b, "Bayangkan penjual"), t2 = at(b, "Ia punya dua pilihan"), tA = at(b, "menaikkan harga"), tB = at(b, "mengurangi cabainya");
        const ua = l - 0.3; slide(ctx, ua, 30, () => { txt(ctx, "bahan pokok naik 2×", 960, 200, 60, { align: "center", weight: 900, color: P.amber }); txt(ctx, "→ harga barang jadi ikut naik", 960, 260, 38, { align: "center", weight: 700, color: P.ink2 }); }, OUT(l, tChili));
        // gerobak nasi goreng
        const gx = l > t2 ? lerp(960, 560, eio((l - t2) / 0.9)) : 960;
        pop(ctx, l - tChili, gx, 640, () => {
          ctx.fillStyle = "#C0563A"; H.rr(ctx, -260, -40, 520, 220, 18); ctx.fill(); ctx.fillStyle = "#F3E3C3"; ctx.fillRect(-240, -20, 480, 70); txt(ctx, "NASI GORENG", 0, 30, 46, { align: "center", weight: 900, color: "#C0563A" });
          ctx.fillStyle = "#8A97BF"; ctx.fillRect(-250, -230, 12, 200); ctx.fillRect(238, -230, 12, 200); ctx.fillStyle = "#E8C547"; ctx.beginPath(); ctx.moveTo(-290, -230); ctx.lineTo(290, -230); ctx.lineTo(250, -290); ctx.lineTo(-250, -290); ctx.closePath(); ctx.fill();
          ctx.fillStyle = "#2B2B35"; [-180, 180].forEach(x => { ctx.beginPath(); ctx.arc(x, 200, 44, 0, 6.283); ctx.fill(); ctx.fillStyle = "#8A97BF"; ctx.beginPath(); ctx.arc(x, 200, 16, 0, 6.283); ctx.fill(); ctx.fillStyle = "#2B2B35"; });
          ctx.fillStyle = "#EEF3FF"; ctx.beginPath(); ctx.ellipse(130, -60, 90, 26, 0, 0, 6.283); ctx.fill(); const nC = l > tB ? 3 : 7; for (let i = 0; i < nC; i++) chili(ctx, 80 + (i % 4) * 32, -78 + Math.floor(i / 4) * 16, 46, -0.3 + i * 0.2);
          if (l < t2 + 0.5) pop(ctx, l - tChili - 1.2, -100, -170, () => priceTag(ctx, -120, 0, "cabai ×2", P.red, 36)); });
        if (l > t2) { pop(ctx, l - tA + 0.2, 1260, 420, () => { panel(ctx, -280, -110, 560, 220, { fill: "rgba(23,36,78,0.92)", stroke: hexA(P.amber, 0.7) }); txt(ctx, "A", -230, -40, 50, { weight: 900, color: P.amber }); txt(ctx, "Naikkan harga", -170, -40, 44, { weight: 900 }); priceTag(ctx, -170, 50, "Rp15.000 → Rp18.000", P.amber, 32); });
          pop(ctx, l - tB + 0.2, 1260, 740, () => { panel(ctx, -280, -110, 560, 220, { fill: "rgba(23,36,78,0.92)", stroke: hexA(P.teal, 0.7) }); txt(ctx, "B", -230, -40, 50, { weight: 900, color: P.teal }); txt(ctx, "Kurangi cabainya", -170, -40, 44, { weight: 900 }); txt(ctx, "harga tetap, isi berkurang", -170, 40, 32, { weight: 700, color: P.ink2 }); }); }
        if (l > tB + 1.5) bip(ctx, 1700, 960, 130, { mood: "think", t });
      }
    },

    // ---------- 6. Sampai ke sakumu ----------
    d02_b6(ctx, b, l, t) {
      bg(ctx, t);
      if (b.id === "b6_1") {
        const tImp = at(b, "didatangkan dari luar negeri"), tFelt = at(b, "langsung terasa");
        kicker(ctx, l, 0.3, "Indonesia", "belum punya pabrik RAM sendiri");
        [0, 1, 2].forEach(i => pop(ctx, l - tImp + 0.6 - i * 0.2, 300 + i * 0, 380 + i * 200, () => factory(ctx, 0, 70, 220, { col: [P.teal, P.violet, P.blue][i], t })));
        txt(ctx, "luar negeri", 300, 1000, 36, { align: "center", weight: 800, color: F(l, tImp, 0.5) > 0 ? P.ink2 : "rgba(0,0,0,0)" });
        // kepulauan bergaya (bentuk sederhana, bukan peta)
        const isl = [[1260, 600, 200, 60, -0.3], [1500, 660, 150, 46, -0.1], [1690, 640, 110, 40, 0.1], [1420, 520, 120, 70, 0.4], [1620, 520, 70, 50, 0.2], [1780, 560, 120, 70, 0]];
        isl.forEach(([x, y, a, c, r]) => { glow(ctx, x, y, a * 1.3, P.teal, 0.12); ctx.fillStyle = "#2F8A6A"; ctx.beginPath(); ctx.ellipse(x, y, a, c, r, 0, 6.283); ctx.fill(); ctx.strokeStyle = "#7FE0B0"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "#3FA07A"; ctx.beginPath(); ctx.ellipse(x - a * 0.2, y - c * 0.15, a * 0.5, c * 0.45, r, 0, 6.283); ctx.fill(); }); txt(ctx, "Indonesia", 1520, 790, 46, { align: "center", weight: 900 });
        if (l > tImp) { const u = ((l - tImp) * 0.3) % 1; ctx.strokeStyle = hexA(P.amber, 0.5); ctx.lineWidth = 4; ctx.setLineDash([12, 12]); ctx.lineDashOffset = -t * 30; ctx.beginPath(); ctx.moveTo(440, 560); ctx.quadraticCurveTo(820, 300, 1230, 560); ctx.stroke(); ctx.setLineDash([]);
          const a = 1 - u, x = a * a * 440 + 2 * a * u * 820 + u * u * 1230, y = a * a * 560 + 2 * a * u * 300 + u * u * 560; ctx.fillStyle = "#5B7CC8"; H.rr(ctx, x - 50, y - 26, 100, 52, 10); ctx.fill(); txt(ctx, "RAM", x, y + 12, 30, { align: "center", weight: 900 }); }
        if (l > tFelt) { for (let k = 0; k < 3; k++) { const v = ((l - tFelt) * 0.7 + k / 3) % 1; ctx.strokeStyle = hexA(P.red, 0.8 * (1 - v)); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(1500, 600, 80 + v * 260, 0, 6.283); ctx.stroke(); }
          pop(ctx, l - tFelt, 1500, 380, () => pill(ctx, "harga naik ↑", 0, 0, { size: 40, fill: P.red, color: "#FFFFFF" })); }
      } else if (b.id === "b6_2") {
        const tRange = at(b, "dari sekitar seratus"), tCheap = at(b, "Yang paling terasa"), xf = eio((l - tCheap) / 0.8);
        kicker(ctx, l, 0.3, "April", "banyak handphone naik harga", 110, 150, 1 - xf);
        const tags = ["+Rp150 rb", "+Rp300 rb", "+Rp600 rb", "+Rp1 jt"];
        ctx.save(); ctx.globalAlpha = 1 - xf; tags.forEach((s, i) => { const x = 360 + i * 400; pop(ctx, l - 0.6 - i * 0.2, x, 560, () => phone(ctx, 0, 0, 380 + i * 30, { glow: false })); pop(ctx, l - tRange - i * 0.35, x - 70, 820 + i * 0, () => priceTag(ctx, 0, 0, s, P.red, 34)); }); ctx.restore();
        if (xf > 0) { ctx.save(); ctx.globalAlpha = xf;
          // dua HP: porsi RAM dalam harga (ilustrasi)
          [["HP murah", 0.32, 600], ["HP mahal", 0.1, 1320]].forEach(([n, share, x]) => { phone(ctx, x - 230, 540, 360, { glow: false }); const bx = x - 20, by = 760, hgt = 480, u = eio((l - tCheap - 0.6) / 1.2);
            ctx.fillStyle = "rgba(169,184,220,0.15)"; H.rr(ctx, bx, by - hgt, 120, hgt, 12); ctx.fill(); ctx.fillStyle = P.amber; const hh = hgt * share * u; H.rr(ctx, bx, by - hh, 120, hh, 12); ctx.fill();
            txt(ctx, "porsi RAM", bx + 60, by - hh - 20, 28, { align: "center", weight: 800, color: P.amber }); txt(ctx, n, x - 120, 900, 44, { align: "center", weight: 900 }); });
          pop(ctx, l - tCheap - 1.5, 960, 1000, () => pill(ctx, "paling terasa di HP murah", 0, 0, { size: 34, fill: P.amber, color: "#10142E" }));
          ctx.restore(); }
      } else if (b.id === "b6_3") {
        const tUp = at(b, "naik dari sekitar lima belas"), v = eio((l - tUp - 0.6) / 2.2), share = lerp(0.15, 0.35, v);
        kicker(ctx, l, 0.3, "Laptop", "porsi memori dalam biaya komponen");
        laptop(ctx, 520, 760, 620);
        const x = 1060, y = 300, w = 220, h = 600; ctx.fillStyle = "rgba(169,184,220,0.15)"; H.rr(ctx, x, y, w, h, 16); ctx.fill();
        const segs = [["layar", P.blue, 0.2], ["prosesor", P.violet, 0.25], ["memori", P.amber, share], ["lain-lain", "#5E6E98", 0.55 - share + 0.0]]; let yy = y + h;
        const tot = segs.reduce((a, s) => a + s[2], 0); segs.forEach(([n, c, s]) => { const hh = h * s / tot; ctx.fillStyle = c; ctx.fillRect(x, yy - hh, w, hh - 3); if (n === "memori") { glow(ctx, x + w / 2, yy - hh / 2, 160, P.amber, 0.25 * v); txt(ctx, Math.round(share * 100) + "%", x + w + 40, yy - hh / 2 + 30, 110, { weight: 900, color: P.amber }); txt(ctx, "memori", x + w + 44, yy - hh / 2 + 80, 34, { weight: 800, color: P.ink2 }); } else txt(ctx, n, x + w / 2, yy - hh / 2 + 10, 26, { align: "center", weight: 700, color: "#FFFFFF" }); yy -= hh; });
        source(ctx, "Menurut salah satu produsen laptop besar", F(l, tUp, 0.6));
      } else {   // b6_4
        const tCut = at(b, "kembali ke empat"), tKeep = at(b, "supaya harganya");
        kicker(ctx, l, 0.3, "Cara lain", "mengurangi RAM pada HP murah");
        pop(ctx, l - 0.6, 620, 580, () => phone(ctx, 0, 0, 640, { draw: (c, w, h) => { c.fillStyle = "#EEF3FF"; c.fillRect(0, h * 0.18, w, h * 0.64); txt(c, "SPESIFIKASI", w / 2, h * 0.26, 22, { align: "center", weight: 900, color: "#5E6E98" });
          txt(c, "RAM", 40, h * 0.42, 34, { weight: 800, color: "#3A4672" }); const cut = l > tCut; txt(c, "8 GB", w - 40, h * 0.42, 40, { align: "right", weight: 900, color: cut ? "#9AA6C8" : "#10142E" });
          if (cut) { strike(c, w - 150, w - 34, h * 0.42 - 14, (l - tCut) / 0.4); pop(c, l - tCut - 0.5, w - 100, h * 0.52, () => txt(c, "4 / 6 GB", 0, 0, 44, { align: "center", weight: 900, color: P.red })); }
          txt(c, "Memori", 40, h * 0.66, 30, { weight: 800, color: "#3A4672" }); txt(c, "128 GB", w - 40, h * 0.66, 32, { align: "right", weight: 900, color: "#10142E" }); } }));
        if (l > tKeep) pop(ctx, l - tKeep, 1300, 560, () => { priceTag(ctx, -180, 0, "harga tidak melonjak", P.teal, 42); });
      }
    },

    // ---------- 7. Apakah akan berakhir? ----------
    d02_b7(ctx, b, l, t) {
      bg(ctx, t);
      if (b.id === "b7_1") {
        const nodes = [["Harga tinggi", "Ketika harga tinggi"], ["Pabrik baru dibangun", "pabrik akan membangun"], ["Pasokan bertambah", "Pasokan akan bertambah"], ["Harga perlahan turun", "harga perlahan turun"]];
        const cx = 960, cy = 520, R = 300; ctx.strokeStyle = "rgba(169,184,220,0.25)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
        const tCyc = at(b, "Industri memori sudah"); let act = -1; nodes.forEach(([, cue], i) => { if (l > at(b, cue)) act = i; });
        if (l > tCyc) { act = Math.floor((l - tCyc) * 1.6) % 4; }
        nodes.forEach(([n, cue], i) => { const a = -Math.PI / 2 + i * Math.PI / 2, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
          pop(ctx, l - at(b, cue) + 0.1, x, y, () => { const on = i === act; if (on) glow(ctx, 0, 0, 160, P.amber, 0.45); ctx.fillStyle = on ? P.amber : "#23336E"; H.rr(ctx, -190, -48, 380, 96, 48); ctx.fill(); txt(ctx, n, 0, 13, 34, { align: "center", weight: 900, color: on ? "#10142E" : P.ink, fit: 340 }); });
          if (l > at(b, cue) + 0.5) { const a2 = a + Math.PI / 4; arrow(ctx, cx + Math.cos(a2 - 0.25) * R, cy + Math.sin(a2 - 0.25) * R, cx + Math.cos(a2 + 0.25) * R, cy + Math.sin(a2 + 0.25) * R, hexA(P.amber, 0.8), 6, 22); } });
        kicker(ctx, l, 0.3, "Siklus memori", "pasar memori naik turun", 110, 140);
        if (l > tCyc) pop(ctx, l - tCyc, 960, 960, () => pill(ctx, "sudah terjadi beberapa kali", 0, 0, { size: 34, stroke: hexA(P.teal, 0.8) }));
      } else {   // b7_2
        const t27 = at(b, "sampai tahun dua ribu"), tGood = at(b, "Kabar baiknya"), xf = eio((l - tGood) / 0.9);
        ctx.save(); ctx.globalAlpha = 1 - xf;
        kicker(ctx, l, 0.3, "Butuh waktu", "membangun kapasitas pabrik baru");
        // pabrik dibangun tahap demi tahap + derek
        const prog = eio((l - 0.6) / 9); const fx = 720, base = 820, w = 640, h = 300; ctx.strokeStyle = hexA(P.ink2, 0.5); ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.strokeRect(fx - w / 2, base - h, w, h); ctx.setLineDash([]);
        const nb = Math.floor(prog * 12); for (let i = 0; i < nb; i++) { const c = i % 4, r = Math.floor(i / 4); ctx.fillStyle = "#2B3A7A"; ctx.fillRect(fx - w / 2 + c * w / 4 + 4, base - (r + 1) * h / 3 + 4, w / 4 - 8, h / 3 - 8); }
        ctx.strokeStyle = P.amber; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(fx + w / 2 + 80, base); ctx.lineTo(fx + w / 2 + 80, base - 520); ctx.lineTo(fx - 120, base - 520); ctx.stroke();
        const hx = lerp(fx - 100, fx + w / 2, (Math.sin(t * 0.8) + 1) / 2); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hx, base - 520); ctx.lineTo(hx, base - 420); ctx.stroke(); ctx.fillStyle = "#2B3A7A"; ctx.fillRect(hx - 40, base - 420, 80, 50);
        if (l > t27) { pop(ctx, l - t27, 1460, 460, () => calendar(ctx, 0, 0, 260, "SAMPAI", "2027")); pop(ctx, l - t27 - 0.5, 1460, 690, () => pill(ctx, "kekurangan bisa berlanjut", 0, 0, { size: 32, stroke: hexA(P.red, 0.8) })); }
        ctx.restore();
        if (xf > 0) { ctx.save(); ctx.globalAlpha = xf; txt(ctx, "Kabar baiknya: kenaikan mulai melambat", 960, 180, 54, { align: "center", weight: 900, color: P.green });
          [["Jan–Mar", 90, P.red], ["Apr–Jun", 60, P.red], ["akhir tahun", 12.5, P.green]].forEach(([n, v, c], i) => { const u = eio((l - tGood - 0.6 - i * 0.4) / 0.9); bar(ctx, 560 + i * 320, 860, 180, v * 6.2, u, c, n, i === 2 ? "+10–15%" : "+" + v + "%"); });
          ctx.restore(); source(ctx, "Sumber: TrendForce", xf); }
      }
    },

    // ---------- 8. Lalu, apa yang bisa kita lakukan? ----------
    d02_b8(ctx, b, l, t) {
      if (b.id !== "b8_5") bg(ctx, t, { stars: 0.6 });
      if (b.id === "b8_1") {
        numCard(ctx, l, 1, "Jangan membeli dengan panik");
        pop(ctx, l - 0.8, 640, 640, () => phone(ctx, 0, 0, 560));
        [["dirawat", "🧼", "dirawat"], ["tutup aplikasi yang tidak dipakai", "✕", "menutup aplikasi"], ["terus update", "⟳", "terus update"]].forEach(([s, ic, cue], i) => pop(ctx, l - at(b, cue), 1260, 470 + i * 150, () => { ctx.fillStyle = P.teal; ctx.beginPath(); ctx.arc(-60, -12, 44, 0, 6.283); ctx.fill(); txt(ctx, ic, -60, 4, 44, { align: "center", weight: 900, color: "#10142E" }); txt(ctx, s, 10, 2, 40, { weight: 800 }); }));
        if (l > at(b, "bisa dipakai lebih lama")) bip(ctx, 1700, 960, 130, { mood: "happy", t });
      } else if (b.id === "b8_2") {
        numCard(ctx, l, 2, "Pilih RAM sesuai kebutuhan");
        [["chat", "chat"], ["book", "belajar"], ["photo", "media sosial"]].forEach(([k, cue], i) => pop(ctx, l - at(b, cue), 300 + i * 200, 470, () => { app(ctx, 0, 0, 130, k); txt(ctx, cue, 0, 110, 30, { align: "center", weight: 700, color: P.ink2 }); }));
        if (l > at(b, "tidak selalu")) pop(ctx, l - at(b, "tidak selalu"), 500, 760, () => pill(ctx, "tidak selalu butuh RAM terbesar", 0, 0, { size: 34, stroke: hexA(P.amber, 0.8) }));
        const tCmp = at(b, "Bandingkan spesifikasinya");
        [["HP A", ["RAM 6 GB", "Memori 128 GB", "Baterai 5.000 mAh"], "Rp2.199.000"], ["HP B", ["RAM 8 GB", "Memori 128 GB", "Baterai 5.000 mAh"], "Rp2.499.000"]].forEach(([n, rows, p], i) => pop(ctx, l - tCmp - i * 0.3, 1180 + i * 400, 640, () => {
          panel(ctx, -180, -260, 360, 520, { fill: "rgba(23,36,78,0.95)" }); txt(ctx, n, 0, -200, 44, { align: "center", weight: 900 }); rows.forEach((r, k) => { checkMark(ctx, -130, -110 + k * 80, 34); txt(ctx, r, -100, -98 + k * 80, 28, { weight: 700 }); });
          txt(ctx, p, 0, 200, 36, { align: "center", weight: 900, color: P.amber }); }));
        if (l > tCmp + 1) pop(ctx, l - tCmp - 1, 1380, 980, () => pill(ctx, "bandingkan spesifikasi, bukan hanya harga", 0, 0, { size: 30, fill: P.teal, color: "#10142E" }));
      } else if (b.id === "b8_3") {
        numCard(ctx, l, 3, "Perhatikan “RAM 8 + 8 GB”");
        const tVirt = at(b, "Angka kedua"), tSlow = at(b, "Itu membantu");
        pop(ctx, l - 0.6, 960, 400, () => { txt(ctx, "RAM 8", -60, 0, 110, { align: "right", weight: 900 }); txt(ctx, "+ 8 GB", -20, 0, 110, { weight: 900, color: l > tVirt ? P.amber : P.ink }); if (l > tVirt) { ctx.strokeStyle = P.amber; ctx.lineWidth = 6; H.rr(ctx, -30, -100, 380, 130, 20); ctx.stroke(); } });
        if (l > tVirt) { slide(ctx, l - tVirt, 30, () => { desk(ctx, 700, 760, 520, { label: "RAM sungguhan" }); ctx.save(); ctx.globalAlpha *= 0.85; ctx.setLineDash([14, 10]); ctx.strokeStyle = P.amber; ctx.lineWidth = 5; H.rr(ctx, 980, 740, 440, 30, 8); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
          cupboard(ctx, 1500, 520, 260, 340, 0.6); txt(ctx, "meja tambahan, dipinjam dari penyimpanan", 1200, 712, 28, { align: "center", weight: 700, color: P.amber }); }); }
        if (l > tSlow) { pop(ctx, l - tSlow, 700, 960, () => pill(ctx, "cepat ⚡", 0, 0, { size: 34, fill: P.green, color: "#10142E" })); pop(ctx, l - tSlow - 0.4, 1220, 960, () => pill(ctx, "jauh lebih lambat 🐢", 0, 0, { size: 34, fill: P.red, color: "#FFFFFF" })); }
      } else if (b.id === "b8_4") {
        numCard(ctx, l, 4, "Setiap pertanyaan ke AI memakai memori dan listrik");
        const tAsk = at(b, "setiap pertanyaan"), tTug = at(b, "Teknologi cloud"), xf = eio((l - tTug) / 0.8);
        ctx.save(); ctx.globalAlpha = 1 - xf;
        phone(ctx, 420, 620, 460, { draw: (c, w, h) => { c.fillStyle = "#3B5BDB"; H.rr(c, w * 0.2, h * 0.3, w * 0.7, h * 0.14, 20); c.fill(); txt(c, "Kenapa langit biru?", w * 0.55, h * 0.385, 26, { align: "center", weight: 700 }); } });
        pop(ctx, l - tAsk, 1480, 600, () => { glow(ctx, 0, 0, 340, P.teal, 0.3); for (let i = 0; i < 4; i++) rackIcon(ctx, -210 + i * 108, -160, 90, 320, t, i); txt(ctx, "⚡ listrik  ·  ▦ memori", 0, 230, 36, { align: "center", weight: 800, color: P.amber }); });
        if (l > tAsk + 0.5) { const u = ((l - tAsk - 0.5) * 0.6) % 1; const x = lerp(640, 1240, eio(u)), y = 520 - Math.sin(u * Math.PI) * 160; glow(ctx, x, y, 50, P.amber, 0.9); ctx.fillStyle = "#3B5BDB"; H.rr(ctx, x - 40, y - 22, 80, 44, 14); ctx.fill(); }
        ctx.restore();
        if (xf > 0) { ctx.save(); ctx.globalAlpha = xf; const pull = Math.sin(t * 2) * 30;
          pop(ctx, l - tTug, 420, 600, () => { ctx.fillStyle = "#33407E"; [[-80, 0, 90], [20, -40, 110], [110, 10, 80]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }); txt(ctx, "cloud dan AI", 10, 170, 40, { align: "center", weight: 900 }); });
          pop(ctx, l - tTug - 0.2, 1500, 600, () => { phone(ctx, 0, 0, 300, { glow: false }); txt(ctx, "HP di saku kita", 0, 220, 40, { align: "center", weight: 900 }); });
          ctx.strokeStyle = P.amber; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(560, 600); ctx.lineTo(1360, 600); ctx.stroke(); wafer2(ctx, 960 + pull, 600, 120, { rot: t * 0.3 });
          pop(ctx, l - tTug - 0.8, 960, 860, () => pill(ctx, "berebut silikon yang sama", 0, 0, { size: 36, fill: P.amber, color: "#10142E" })); ctx.restore(); }
      } else {   // b8_5 penutup 3D
        const tFab = at(b, "di sebuah pabrik RAM"), tDC = at(b, "pusat data AI");
        G.render(ctx, l, (S) => { S.floor.visible = S.grid.visible = S.dc.visible = true; G.waferAnim(l + 10, 0.06); G.hbmDone(); G.dcAnim(l);
          G.camPath([[0, 0.4, 2.3, 4.6, 0, 0, 0], [tFab, 1.2, 3.2, 6.0, 1.0, 0, -1], [tDC + 0.5, 3.6, 7.5, 10.5, 5, 0.2, -6], [b.dur, 3.8, 9.5, 13.5, 5.6, 0.2, -9]], l);
          const [wx, wy] = G.project(0, 0.2, 0), [dx, dy] = G.project(6.2, 2.8, -10); S.__lab = [wx, wy, dx, dy]; });
        kicker(ctx, l, 0.4, "Jadi…", "ceritanya dimulai jauh dari toko", 110, 150, OUT(l, tFab));
        const P2 = G.project(0, 0.2, 0), P3 = G.project(6.2, 2.9, -10);
        if (l > tFab) pop(ctx, l - tFab, P2[0], P2[1] - 150, () => pill(ctx, "pabrik RAM", 0, 0, { size: 40, fill: P.teal, color: "#10142E" }));
        if (l > tDC) pop(ctx, l - tDC, P3[0], P3[1] - 80, () => pill(ctx, "pusat data AI", 0, 0, { size: 40, fill: P.violet, color: "#FFFFFF" }));
      }
    },

    // ---------- 9. Penutup ----------
    d02_b9(ctx, b, l, t) {
      bg(ctx, t, { stars: 0.6 }); glow(ctx, 960, 420, 600, P.violet, 0.3);
      bip(ctx, 960, 360, 260, { mood: "happy", t, wave: l });
      const u = fade(l, at(b, "subscribe"), 0.6);
      panel(ctx, 560, 560, 800, 120, { stroke: hexA(P.amber, 0.8), lw: 5 }); txt(ctx, "youtube.com/@iTeachSWE", 960, 638, 54, { align: "center", color: P.amber, weight: 900 });
      if (u > 0) pop(ctx, l - at(b, "subscribe"), 960, 765, () => { ctx.fillStyle = "#E5484D"; H.rr(ctx, -170, -45, 340, 90, 45); ctx.fill(); txt(ctx, "🔔 SUBSCRIBE", 0, 13, 38, { align: "center", color: "#FFFFFF", weight: 900 }); });
      txt(ctx, "I Teach Software Engineering", 960, 880, 34, { align: "center", color: P.ink2, weight: 700 });
      const v = fade(l, at(b, "Sampai jumpa"), 0.6); if (v > 0) { ctx.save(); ctx.globalAlpha = v * 0.8; [100, 1420].forEach(x => { ctx.strokeStyle = hexA(P.ink2, 0.5); ctx.lineWidth = 3; ctx.setLineDash([12, 10]); H.rr(ctx, x, 380, 400, 225, 16); ctx.stroke(); ctx.setLineDash([]); txt(ctx, "Tonton juga", x + 200, 500, 30, { align: "center", color: P.ink2 }); }); ctx.restore(); }
    },
  });
})(typeof window !== "undefined" ? window : globalThis);
