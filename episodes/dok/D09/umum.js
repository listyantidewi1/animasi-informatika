/* D09 — pembantu bersama adegan (dimuat sesudah sinema_dok.js dan kit.js).
   U = Kiko.d09. Semua gambar memakai kit D09 (latar grafit, ungu PHP, hijau terminal, merah alarm). */
(function (g) {
  const K = g.Kiko, D = K.dok, X = g.D09, C = X.C;
  const { clamp, lerp, eio, eout, spring } = D;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const U = K.d09 = { X, C, W, HH, TAU };
  const ramp = U.ramp = (l, t0, d = 0.5) => clamp((l - t0) / d);
  U.pop = (l, t0) => ({ a: ramp(l, t0, 0.25), sp: clamp(spring(l - t0, 10, 0.55), 0, 1.15) });
  U.T = (ctx, s, x, y, size, o = {}) => X.text(ctx, s, x, y, size, o);
  U.rr = X.rr; U.rgba = X.rgba;
  U.at = D.at; U.atEnd = D.atEnd;

  // daftarkan adegan bab: S[b.id] per beat
  U.reg = (seg, S) => { K.SCENES["d09_b" + seg] = function (ctx, b, l, t, TL) { const f = S[b.id]; X.bg(ctx, t); if (f) f(ctx, b, l, t, TL); }; };

  // muncul dengan pegas (skala dari titik tengah)
  U.muncul = function (ctx, l, t0, cx, cy, fn, o = {}) {
    const p = U.pop(l, t0); if (p.a <= 0) return 0; ctx.save(); ctx.globalAlpha *= p.a * (o.a == null ? 1 : o.a);
    const k = lerp(o.k0 == null ? 0.7 : o.k0, 1, p.sp); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy); fn(); ctx.restore(); return p.a;
  };
  // geser masuk dari arah tertentu
  U.geser = function (ctx, l, t0, dx, dy, fn, d = 0.6) {
    const u = ramp(l, t0, d); if (u <= 0) return 0; ctx.save(); ctx.globalAlpha *= clamp(u * 1.6); ctx.translate(dx * (1 - eout(u)), dy * (1 - eout(u))); fn(); ctx.restore(); return u;
  };
  // judul atas (≤ satu baris, 60 px)
  U.judul = function (ctx, s, l, t0, o = {}) {
    const u = ramp(l, t0, 0.4); if (u <= 0) return; ctx.save(); ctx.globalAlpha *= u * (o.a == null ? 1 : o.a); ctx.translate(0, (1 - eout(u)) * -20);
    U.T(ctx, s, o.x || W / 2, o.y || 150, o.size || 60, { align: o.align || "center", weight: 800, color: o.col || C.text, mono: o.mono, glow: o.glow, blur: o.blur }); ctx.restore();
  };
  // sumber kecil di kanan atas (bukan teks penting)
  U.sumber = (ctx, s, a = 1) => { ctx.save(); ctx.globalAlpha *= a; U.T(ctx, s, 1824, 64, 26, { align: "right", weight: 600, color: C.dim }); ctx.restore(); };
  U.status = (ctx) => U.T(ctx, "Status per 21 November 2026", 96, 64, 26, { weight: 600, color: C.dim });

  // potongan teks yang diketik huruf demi huruf
  U.ketik = (s, l, t0, cps = 14) => s.slice(0, Math.max(0, Math.floor((l - t0) * cps)));
  // terminal dengan perintah yang diketik: steps = [{cmd, t0, out: [baris], hl: {i: warna}}]; keluaran muncul 0,8 dtk setelah Enter
  U.termKetik = function (ctx, x, y, w, h, steps, l, o = {}) {
    const lines = []; let cursor = null;
    steps.forEach(st => {
      if (l < st.t0) return; const typed = U.ketik(st.cmd, l, st.t0, st.cps || 12); lines.push({ t: typed, cmd: true });
      const done = st.t0 + st.cmd.length / (st.cps || 12); if (typed.length < st.cmd.length) { cursor = lines.length - 1; return; }
      if (l < done + 0.8) { cursor = lines.length - 1; return; }
      (st.out || []).forEach((s, i) => { const L = typeof s === "string" ? { t: s } : Object.assign({}, s); if (L.hlAt != null && l < L.hlAt) delete L.hl; delete L.hlAt; lines.push(L); });
      if (st.gap !== false) lines.push({ t: "" });
    });
    if (cursor == null && (!steps.length || l >= steps[0].t0 - 0.5)) { lines.push({ t: "", cmd: true }); cursor = lines.length - 1; }
    const inn = X.terminal(ctx, x, y, w, h, lines, { size: o.size || 40, contoh: o.contoh !== false, title: o.title });
    if (cursor != null && Math.floor(l * 2.2) % 2 === 0) { const size = o.size || 40, lh = size * 1.55; ctx.save(); ctx.font = `500 ${size}px ${X.MONO}`;
      const L = lines[cursor]; const cw = ctx.measureText((L.cmd ? "$ " : "") + L.t).width; ctx.fillStyle = C.term; ctx.fillRect(inn.x + cw + 4, inn.y + 70 + cursor * lh - size * 0.85, size * 0.5, size); ctx.restore(); }
    return inn;
  };

  // kartu tebak bergaya komentar kode, dengan jam pasir
  U.tebak = function (ctx, l, t0, t) {
    U.muncul(ctx, l, t0, 960, 860, () => {
      const w = 760, x = 960 - w / 2, y = 790; ctx.fillStyle = C.panel; U.rr(ctx, x, y, w, 120, 20); ctx.fill(); ctx.strokeStyle = U.rgba(C.amber, 0.9); ctx.lineWidth = 3; U.rr(ctx, x, y, w, 120, 20); ctx.stroke();
      U.T(ctx, "// TODO: tebak dulu", x + 140, y + 76, 48, { mono: true, weight: 700, color: C.amber });
      U.jamPasir(ctx, x + 72, y + 60, 46, t);
    });
  };
  U.jamPasir = function (ctx, cx, cy, s, t) {
    const r = (t * 0.6) % 1, rot = r > 0.85 ? (r - 0.85) / 0.15 * Math.PI : 0; ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.strokeStyle = C.amber; ctx.lineWidth = 4; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-s * 0.45, -s * 0.6); ctx.lineTo(s * 0.45, -s * 0.6); ctx.lineTo(0, 0); ctx.lineTo(s * 0.45, s * 0.6); ctx.lineTo(-s * 0.45, s * 0.6); ctx.lineTo(0, 0); ctx.closePath(); ctx.stroke();
    const f = r > 0.85 ? 1 : r / 0.85; ctx.fillStyle = U.rgba(C.amber, 0.8);
    ctx.beginPath(); ctx.moveTo(-s * 0.4 * (1 - f), -s * 0.55 * (1 - f)); ctx.lineTo(s * 0.4 * (1 - f), -s * 0.55 * (1 - f)); ctx.lineTo(0, 0); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.4 * f, s * 0.55); ctx.lineTo(s * 0.4 * f, s * 0.55); ctx.lineTo(0, s * 0.55 * (1 - f)); ctx.fill(); ctx.restore();
  };

  // panah dengan kemajuan u (0..1)
  U.panah = function (ctx, x0, y0, x1, y1, col, u = 1, o = {}) {
    if (u <= 0) return; const x = lerp(x0, x1, u), y = lerp(y0, y1, u); ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = o.lw || 6; ctx.lineCap = "round";
    if (o.dash) ctx.setLineDash(o.dash); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
    const a = Math.atan2(y1 - y0, x1 - x0), s = o.head || 22; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - s * Math.cos(a - 0.45), y - s * Math.sin(a - 0.45)); ctx.lineTo(x - s * Math.cos(a + 0.45), y - s * Math.sin(a + 0.45)); ctx.closePath(); ctx.fill(); ctx.restore();
  };
  // kotak berlabel (panel)
  U.kotak = function (ctx, x, y, w, h, s, o = {}) {
    const col = o.col || C.php; ctx.save(); if (o.glow) X.glow(ctx, x + w / 2, y + h / 2, Math.max(w, h) * 0.8, col, o.glow);
    ctx.fillStyle = o.fill || C.panel; U.rr(ctx, x, y, w, h, o.r || 18); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = o.lw || 3; U.rr(ctx, x, y, w, h, o.r || 18); ctx.stroke(); ctx.restore();
    if (s) { const lines = String(s).split("\n"), size = o.size || 40, lh = size * 1.22, y0 = y + h / 2 - (lines.length - 1) * lh / 2 + size * 0.35;
      lines.forEach((ln, i) => U.T(ctx, ln, x + w / 2, y0 + i * lh, size, { align: "center", weight: o.weight || 700, color: o.color || C.text, mono: o.mono })); }
  };
  U.pill = function (ctx, s, cx, cy, o = {}) {
    const size = o.size || 40; ctx.save(); ctx.font = `800 ${size}px ${X.SANS}`; const w = ctx.measureText(s).width + size * 1.1, h = size * 1.6; ctx.restore();
    U.kotak(ctx, cx - w / 2, cy - h / 2, w, h, s, { col: o.col || C.amber, size, r: h / 2, color: o.color || C.text, weight: 800, fill: o.fill }); return w;
  };
  // centang / silang
  U.centang = function (ctx, cx, cy, s, u = 1, col = C.term) { if (u <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * 0.22; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const p = [[-0.5, 0], [-0.15, 0.38], [0.55, -0.42]]; ctx.beginPath(); ctx.moveTo(cx + p[0][0] * s, cy + p[0][1] * s);
    const k = u * 2; if (k < 1) ctx.lineTo(cx + lerp(p[0][0], p[1][0], k) * s, cy + lerp(p[0][1], p[1][1], k) * s); else { ctx.lineTo(cx + p[1][0] * s, cy + p[1][1] * s); ctx.lineTo(cx + lerp(p[1][0], p[2][0], k - 1) * s, cy + lerp(p[1][1], p[2][1], k - 1) * s); }
    ctx.stroke(); ctx.restore(); };
  U.silang = function (ctx, cx, cy, s, u = 1, col = C.red) { if (u <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * 0.2; ctx.lineCap = "round";
    const a = clamp(u * 2), b2 = clamp(u * 2 - 1); ctx.beginPath(); ctx.moveTo(cx - s / 2, cy - s / 2); ctx.lineTo(cx + lerp(-s / 2, s / 2, a), cy + lerp(-s / 2, s / 2, a)); if (b2 > 0) { ctx.moveTo(cx + s / 2, cy - s / 2); ctx.lineTo(cx + lerp(s / 2, -s / 2, b2), cy + lerp(-s / 2, s / 2, b2)); } ctx.stroke(); ctx.restore(); };

  // ---------- ikon garis sederhana (s ≈ tinggi) ----------
  function garis(ctx, col, lw) { ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.lineJoin = "round"; }
  U.server = function (ctx, cx, cy, s, o = {}) {   // rak server ungu, 3 unit
    const col = o.col || C.php, w = s * 0.75, h = s; ctx.save(); if (o.glow) X.glow(ctx, cx, cy, s, col, o.glow);
    for (let i = 0; i < 3; i++) { const y = cy - h / 2 + i * h / 3; ctx.fillStyle = C.panel; U.rr(ctx, cx - w / 2, y + 4, w, h / 3 - 8, 8); ctx.fill(); garis(ctx, col, Math.max(3, s * 0.025)); U.rr(ctx, cx - w / 2, y + 4, w, h / 3 - 8, 8); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + w / 2 - s * 0.1, y + h / 6, s * 0.03, 0, TAU); ctx.fillStyle = o.led || C.term; ctx.fill();
      ctx.fillStyle = U.rgba(col, 0.5); ctx.fillRect(cx - w / 2 + s * 0.08, y + h / 6 - 2, w * 0.45, 4); }
    ctx.restore();
  };
  U.perisai = function (ctx, cx, cy, s, col = C.term, o = {}) { ctx.save(); if (o.glow) X.glow(ctx, cx, cy, s * 1.1, col, o.glow); garis(ctx, col, s * 0.07); ctx.fillStyle = U.rgba(col, 0.15);
    ctx.beginPath(); ctx.moveTo(cx, cy - s / 2); ctx.quadraticCurveTo(cx + s * 0.2, cy - s * 0.38, cx + s * 0.42, cy - s * 0.38); ctx.quadraticCurveTo(cx + s * 0.44, cy + s * 0.2, cx, cy + s / 2); ctx.quadraticCurveTo(cx - s * 0.44, cy + s * 0.2, cx - s * 0.42, cy - s * 0.38); ctx.quadraticCurveTo(cx - s * 0.2, cy - s * 0.38, cx, cy - s / 2); ctx.fill(); ctx.stroke();
    if (o.centang !== false) U.centang(ctx, cx, cy, s * 0.4, 1, col); ctx.restore(); };
  U.gembok = function (ctx, cx, cy, s, buka = 0, col = C.amber) { ctx.save(); garis(ctx, col, s * 0.09); const w = s * 0.7, h = s * 0.5;
    ctx.beginPath(); ctx.arc(cx + (buka ? s * 0.28 : 0), cy - h * 0.1, s * 0.22, Math.PI, 0); ctx.lineTo(cx + (buka ? s * 0.28 : 0) + s * 0.22, cy - h * 0.1 + (buka ? -s * 0.05 : 0)); ctx.stroke();
    ctx.fillStyle = U.rgba(col, 0.2); U.rr(ctx, cx - w / 2, cy - h * 0.1, w, h, s * 0.08); ctx.fill(); ctx.stroke(); ctx.restore(); };
  U.globe = function (ctx, cx, cy, s, col = C.php) { ctx.save(); garis(ctx, col, s * 0.06); ctx.beginPath(); ctx.arc(cx, cy, s / 2, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, cy, s * 0.2, s / 2, 0, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - s / 2, cy); ctx.lineTo(cx + s / 2, cy); ctx.moveTo(cx - s * 0.43, cy - s * 0.25); ctx.lineTo(cx + s * 0.43, cy - s * 0.25); ctx.moveTo(cx - s * 0.43, cy + s * 0.25); ctx.lineTo(cx + s * 0.43, cy + s * 0.25); ctx.stroke(); ctx.restore(); };
  U.tagVersi = function (ctx, cx, cy, s, col = C.php) { ctx.save(); garis(ctx, col, s * 0.07); ctx.beginPath(); ctx.moveTo(cx - s * 0.5, cy - s * 0.3); ctx.lineTo(cx + s * 0.2, cy - s * 0.3); ctx.lineTo(cx + s * 0.5, cy); ctx.lineTo(cx + s * 0.2, cy + s * 0.3); ctx.lineTo(cx - s * 0.5, cy + s * 0.3); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + s * 0.18, cy, s * 0.07, 0, TAU); ctx.stroke(); ctx.restore(); };
  U.orang = function (ctx, cx, cy, s, col = C.text2) { ctx.save(); garis(ctx, col, s * 0.08); ctx.beginPath(); ctx.arc(cx, cy - s * 0.22, s * 0.2, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy + s * 0.48, s * 0.38, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); ctx.restore(); };
  U.ai = function (ctx, cx, cy, s, col = C.php, o = {}) {   // chip AI generik: kotak dengan kaki dan tulisan AI
    ctx.save(); if (o.glow) X.glow(ctx, cx, cy, s, col, o.glow); garis(ctx, col, s * 0.05); ctx.fillStyle = C.panel; U.rr(ctx, cx - s * 0.36, cy - s * 0.36, s * 0.72, s * 0.72, s * 0.08); ctx.fill(); ctx.stroke();
    for (let i = -1; i <= 1; i++) { const d = i * s * 0.2; ctx.beginPath(); ctx.moveTo(cx + d, cy - s * 0.36); ctx.lineTo(cx + d, cy - s * 0.5); ctx.moveTo(cx + d, cy + s * 0.36); ctx.lineTo(cx + d, cy + s * 0.5); ctx.moveTo(cx - s * 0.36, cy + d); ctx.lineTo(cx - s * 0.5, cy + d); ctx.moveTo(cx + s * 0.36, cy + d); ctx.lineTo(cx + s * 0.5, cy + d); ctx.stroke(); }
    U.T(ctx, "AI", cx, cy + s * 0.13, s * 0.36, { align: "center", weight: 900, color: col }); ctx.restore(); };
  U.lonceng = function (ctx, cx, cy, s, col = C.amber, t = 0) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.sin(t * 9) * 0.12); garis(ctx, col, s * 0.07);
    ctx.beginPath(); ctx.moveTo(-s * 0.38, s * 0.25); ctx.quadraticCurveTo(-s * 0.3, -s * 0.42, 0, -s * 0.42); ctx.quadraticCurveTo(s * 0.3, -s * 0.42, s * 0.38, s * 0.25); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, s * 0.36, s * 0.08, 0, TAU); ctx.fill(); ctx.restore(); };
  U.robot = function (ctx, cx, cy, s, col = C.term) { ctx.save(); garis(ctx, col, s * 0.07); U.rr(ctx, cx - s * 0.4, cy - s * 0.25, s * 0.8, s * 0.6, s * 0.12); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.25); ctx.lineTo(cx, cy - s * 0.45); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy - s * 0.48, s * 0.06, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(cx - s * 0.16, cy + s * 0.02, s * 0.07, 0, TAU); ctx.arc(cx + s * 0.16, cy + s * 0.02, s * 0.07, 0, TAU); ctx.fill(); ctx.fillRect(cx - s * 0.15, cy + s * 0.18, s * 0.3, s * 0.05); ctx.restore(); };
  U.laptop = function (ctx, cx, cy, s, col = C.php) { ctx.save(); garis(ctx, col, s * 0.04); ctx.fillStyle = C.win; U.rr(ctx, cx - s * 0.45, cy - s * 0.35, s * 0.9, s * 0.58, s * 0.04); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - s * 0.58, cy + s * 0.3); ctx.lineTo(cx + s * 0.58, cy + s * 0.3); ctx.lineTo(cx + s * 0.5, cy + s * 0.36); ctx.lineTo(cx - s * 0.5, cy + s * 0.36); ctx.closePath(); ctx.stroke(); ctx.restore(); };
  U.stopwatch = function (ctx, cx, cy, s, frac, col = C.amber) {   // frac 0..1 = satu putaran jarum
    ctx.save(); garis(ctx, col, s * 0.06); ctx.fillStyle = C.panel; ctx.beginPath(); ctx.arc(cx, cy, s / 2, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillRect(cx - s * 0.08, cy - s * 0.66, s * 0.16, s * 0.1); ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.56); ctx.lineTo(cx, cy - s * 0.5); ctx.stroke();
    ctx.fillStyle = U.rgba(col, 0.25); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, s * 0.42, -Math.PI / 2, -Math.PI / 2 + TAU * frac); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * s * 0.4, cy + Math.sin(a) * s * 0.4); ctx.lineTo(cx + Math.cos(a) * s * 0.45, cy + Math.sin(a) * s * 0.45); ctx.stroke(); }
    const a = -Math.PI / 2 + TAU * frac; ctx.lineWidth = s * 0.05; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * s * 0.36, cy + Math.sin(a) * s * 0.36); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, s * 0.04, 0, TAU); ctx.fill(); ctx.restore(); };
  U.struk = function (ctx, cx, cy, s, baris, col = C.amber) {   // struk belanja kecil
    const w = s * 0.9, h = s; ctx.save(); ctx.fillStyle = "#F4F1E8"; ctx.beginPath(); ctx.moveTo(cx - w / 2, cy - h / 2); ctx.lineTo(cx + w / 2, cy - h / 2); ctx.lineTo(cx + w / 2, cy + h / 2);
    for (let i = 0; i < 8; i++) ctx.lineTo(cx + w / 2 - (i + 0.5) * w / 8, cy + h / 2 + (i % 2 ? 0 : 14)); ctx.lineTo(cx - w / 2, cy + h / 2); ctx.closePath(); ctx.fill();
    baris.forEach((s2, i) => U.T(ctx, s2, cx, cy - h / 2 + 70 + i * 62, i === baris.length - 1 ? 48 : 36, { align: "center", weight: i === baris.length - 1 ? 900 : 700, color: i === baris.length - 1 ? "#B3261E" : "#3A3640", mono: true }));
    ctx.restore(); };
  U.folder = function (ctx, x, y, w, h, s, col = C.red) { ctx.save(); ctx.fillStyle = U.rgba(col, 0.2); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + 34); ctx.lineTo(x + w * 0.42, y + 34); ctx.lineTo(x + w * 0.36, y + 10); ctx.lineTo(x + 10, y + 10); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    if (s) U.T(ctx, s, x + w / 2, y + h + 64, 44, { align: "center", mono: true, weight: 700, color: col }); };

  // garis waktu horizontal sederhana: titik [x, label atas, label bawah, warna]
  U.garisWaktu = function (ctx, x0, x1, y, u = 1, col = C.line) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, u), y); ctx.stroke(); ctx.restore(); };
  U.titik = function (ctx, x, y, col, s = 14, aktif = 1) { if (aktif > 0.5) X.glow(ctx, x, y, s * 3, col, 0.6); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill(); };

  // kode C tiruan untuk pemindai/diff
  U.KODE_C = ["static int parse_block(buf_t *b, const char *in, size_t n)", "{", "    size_t i = 0, len = 0;", "    while (i < n && in[i] != '=') {",
    "        len += decode_char(in[i]);", "        i++;", "    }", "    memcpy(b->data + b->used, tmp, len);", "    b->used += len;", "    return check_tail(b, in + i);", "}"];

  // panel AI di samping editor (tanpa logo)
  U.panelAI = function (ctx, x, y, w, h, pesan, l, t0) {
    ctx.save(); ctx.fillStyle = C.win; U.rr(ctx, x, y, w, h, 16); ctx.fill(); ctx.strokeStyle = U.rgba(C.php, 0.6); ctx.lineWidth = 2; U.rr(ctx, x, y, w, h, 16); ctx.stroke(); ctx.restore();
    U.ai(ctx, x + 50, y + 50, 52, C.php); U.T(ctx, "asisten coding AI", x + 92, y + 64, 34, { weight: 700, color: C.text2 });
    pesan.forEach((p, i) => { const u = ramp(l, (p.t != null ? p.t : t0 + i * 0.8), 0.35); if (u <= 0) return; ctx.save(); ctx.globalAlpha *= u; const by = y + 120 + i * 112;
      ctx.fillStyle = p.saya ? U.rgba(C.term, 0.14) : U.rgba(C.php, 0.16); U.rr(ctx, x + 24, by, w - 48, 92, 14); ctx.fill();
      U.T(ctx, p.s, x + 46, by + 58, 32, { weight: 600, color: p.saya ? C.term : C.text, mono: p.mono }); ctx.restore(); });
  };


  // Short: latar Short tanpa nuansa biru (short_dok.js memakai D.P) + kartu ajakan sendiri (tanpa maskot)
  Object.assign(D.P, { bg0: "#1C1B20", bg1: "#09090B", panel: "rgba(24,23,28,0.94)", night: "#0B0B0D", violet: C.php, ink2: C.text2 });
  K.SCENES.d09_sc = function (ctx, b, l, t) {
    X.bg(ctx, t, { scan: false, tint: C.php });
    const u = ramp(l, 0.1, 0.5); ctx.save(); ctx.globalAlpha *= u;
    const f = X.windowFrame(ctx, 380, 170, 1160, 740, { tab: "video-lengkap.php" });
    U.T(ctx, "TONTON VIDEO LENGKAPNYA", 960, 330, 44, { align: "center", weight: 900, color: C.amber, spacing: 4 });
    U.T(ctx, "Celah Keamanan PHP Bocor Lagi,", 960, 450, 66, { align: "center", weight: 900 });
    U.T(ctx, "dan Kini AI Ikut Memburunya", 960, 535, 66, { align: "center", weight: 900, color: C.php });
    U.T(ctx, "kenapa tidak perlu panik + 5 kebiasaan", 960, 640, 42, { align: "center", weight: 700, color: C.text2 });
    U.panah(ctx, 960, 820, 960, 700, C.amber, eio(ramp(l, 0.6, 0.5)), { lw: 9, head: 30 });
    U.T(ctx, "video terkait di atas judul", 960, 880, 40, { align: "center", weight: 800, color: C.amber });
    ctx.restore();
  };

  // kartu bab: berkas bab-N.php diketik (menggantikan kartu bawaan)
  const beats = () => g.__beats || [];
  function cardStart(seg) { const bs = beats(); const i = bs.findIndex(x => x.seg === seg); if (i <= 0) return 0; const pb = bs[i - 1];
    return pb.start + D.speechEnd(pb) + (pb.cardDelay != null ? pb.cardDelay : 0.3); }
  const JUDUL_BAB = ["", "Satu bulan, dua kali bocor", "Apa sebenarnya celah keamanan itu?", "Bagaimana AI ikut mencari celah", "Patch adalah peta harta karun",
    "Jangan panik, baca pengumumannya dulu", "Lima kebiasaan menutup jendela", "Penutup"];
  U.JUDUL_BAB = JUDUL_BAB;
  D.cardFn = function (ctx, seg, title, a, t) {
    if (a <= 0) return; const ct = t - cardStart(seg); ctx.save(); ctx.globalAlpha = a; X.kartuBab(ctx, seg, JUDUL_BAB[seg] || title, t, clamp(ct / 1.7)); ctx.restore();
  };
})(typeof window !== "undefined" ? window : globalThis);
