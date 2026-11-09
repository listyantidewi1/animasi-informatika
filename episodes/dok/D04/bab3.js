/* D04 bab 3: "Salah satu algoritma tertua: mencari FPB" (b3_1–b3_3).
   Satu meja kerja kayu (tampak atas) dipakai sepanjang bab; diagram digambar di atasnya. Euclid (orang sungguhan) tidak digambar:
   hanya gulungan naskah kuno dengan dua ruas garis.
   b3_1 Jilid 1 terbuka di halaman "Algorithm E" (disorot "algoritma pertama"); buku menyingkir, garis waktu 1968 → ±300 SM dengan
        kurung "lebih dari 2.000 tahun"; gulungan kuno terbuka (dua ruas garis, ruas pendek diukurkan ke ruas panjang), label Euclid;
        "FPB" + "Faktor Persekutuan Terbesar"; ruas garis berubah merah dan biru.
   b3_2 ruas garis menjadi dua tali rafia di atas penggaris (91 cm merah, 21 cm biru); Bip melayang membawa gunting; tali biru
        ditempel di ujung tali merah lalu dipotong satu per satu: 91→70→49→28→7 (4 potongan "21" jatuh), peran bertukar, 21→14→7
        (2 potongan "7" jatuh). Penghitung potongan 0→6, catatan panjang (dua kolom), papan langkah "91 − 21 = 70" ...;
        dua tali 7 cm bertumpuk sama panjang, "7 cm" lalu "FPB = 7"; jeda hening: sorotan ulang potongan satu per satu.
   b3_3 potongan terbang kembali menjadi batang 91 dan 21; "cara pembagian": 91 : 21 = 4, sisa 7 (batang dibagi 4 ruas + sisa),
        panah sisa turun, 21 : 7 = 3, sisa 0; 7 dilingkari, "FPB = 7"; penghitung membagi 0→2 di samping memotong 6, balok langkah 6 vs 2.
   Kamera sendiri (noCam): diagram diam di tempat supaya mudah dibaca; latar bernapas pelan. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const P = D.P, H = K.helpers, LP = KIT.latar.parts, B = KIT.bipkit;
  const { clamp, lerp, eio, eout, spring } = D;
  const TAU = Math.PI * 2, F = K.FONT;
  const at = (b, s, o = 0) => D.at(b, s, o), atE = (b, s, o = 0) => D.atEnd(b, s, o);
  const fd = (l, t0, d = 0.4) => clamp((l - t0) / d);
  const popS = u => (u <= 0 ? 0 : lerp(0.9, 1, Math.min(1.08, spring(u, 12, 0.45))));     // label kecil: tidak pernah < 90%
  const popB = u => (u <= 0 ? 0 : lerp(0.6, 1, Math.min(1.08, spring(u, 11, 0.45))));     // angka besar
  const hh = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const RED = "#FF5A5F", RED_D = "#C23A4C", BLU = "#4FA3FF", BLU_D = "#2B68C4", AMB = P.amber, GRN = P.green, INK = "#28306A";

  // ---------- tata letak tali ----------
  const X0 = 560, PX = 13.6, cx = cm => X0 + cm * PX;
  const WY = 404, MY = 370, PY = 576, AY = 668, BY = 790, BIPY = 196, BIPS = 130;
  const RUL = { y0: 434, y1: 508 };

  // =====================================================================================
  // set: meja kayu tampak atas (lanjutan meja kerja malam), lampu hangat dari kiri atas
  // =====================================================================================
  const GRAIN = Array.from({ length: 22 }, (_, i) => ({ y: 20 + i * 50 + hh(i) * 26, a: 0.05 + hh(i + 40) * 0.07, f: 0.002 + hh(i + 80) * 0.003, ph: hh(i + 9) * 6 }));
  function set(ctx, t) {
    let gr = ctx.createLinearGradient(0, 0, 0, 1080); gr.addColorStop(0, "#9C6849"); gr.addColorStop(0.45, "#B07A55"); gr.addColorStop(1, "#8A5A3F");
    ctx.fillStyle = gr; ctx.fillRect(0, 0, 1920, 1080);
    // papan kayu
    ctx.strokeStyle = "rgba(70,36,18,0.22)"; ctx.lineWidth = 3; [262, 540, 818].forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1920, y); ctx.stroke(); });
    ctx.strokeStyle = "rgba(255,226,190,0.10)"; ctx.lineWidth = 2; [265, 543, 821].forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1920, y); ctx.stroke(); });
    GRAIN.forEach(gn => { ctx.strokeStyle = `rgba(90,48,24,${gn.a})`; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let x = 0; x <= 1920; x += 40) { const y = gn.y + Math.sin(x * gn.f + gn.ph) * 9; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); });
    // genangan cahaya lampu (bernapas pelan)
    LP.warmPool(ctx, 520, 300, 900, 0.5 + 0.04 * Math.sin(t * 1.3), 0.6);
    LP.glowE(ctx, 120, 60, 520, 320, "#FFC46A", 0.16 + 0.02 * Math.sin(t * 1.7));
    // debu cahaya melayang
    for (let i = 0; i < 14; i++) { const x = (hh(i) * 1920 + t * (8 + hh(i + 3) * 10)) % 1920, y = 120 + hh(i + 5) * 760 + Math.sin(t * 0.6 + i) * 14;
      ctx.fillStyle = `rgba(255,236,200,${0.10 + 0.08 * Math.sin(t * 1.1 + i * 1.7)})`; ctx.beginPath(); ctx.arc(x, y, 2 + hh(i + 7) * 2.5, 0, TAU); ctx.fill(); }
  }

  // ---------- teks & panel ----------
  const txt = (ctx, s, x, y, size, opt = {}) => D.txt(ctx, s, x, y, size, opt);
  const tw = (ctx, s, size, w = 800) => { ctx.font = `${w} ${size}px ${F}`; return ctx.measureText(s).width; };
  function lab(ctx, s, x, y, u, o = {}) {           // label pil dengan muncul-pop
    if (u <= 0) return; const a = clamp(u / 0.15) * (o.a == null ? 1 : o.a); if (a <= 0.01) return;
    ctx.save(); ctx.globalAlpha *= a; const k = popS(u) * (o.k || 1); ctx.translate(x, y); ctx.scale(k, k);
    if (o.glow) D.glow(ctx, 0, 0, o.glow, o.col || AMB, 0.35);
    D.label(ctx, s, 0, 0, { size: o.size || 48, col: o.col || AMB, color: o.color }); ctx.restore();
  }
  function arrow(c, x0, y0, x1, y1, col, lw = 8, bend = 0, u = 1) {
    if (u <= 0) return; const mx = (x0 + x1) / 2 + bend * (y1 - y0) * 0.3, my = (y0 + y1) / 2 - bend * (x1 - x0) * 0.3;
    const q = (s) => [lerp(lerp(x0, mx, s), lerp(mx, x1, s), s), lerp(lerp(y0, my, s), lerp(my, y1, s), s)];
    const n = 24, m = Math.max(1, Math.round(n * u)); c.lineCap = "round"; c.lineJoin = "round";
    [["rgba(20,14,40,0.45)", lw + 6], [col, lw]].forEach(([cc, ww]) => { c.strokeStyle = cc; c.lineWidth = ww; c.beginPath(); for (let i = 0; i <= m; i++) { const [x, y] = q(i / n); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); });
    if (u >= 0.98) { const [ax, ay] = q(0.93), a = Math.atan2(y1 - ay, x1 - ax), hl = lw * 3; c.fillStyle = col; c.beginPath(); c.moveTo(x1, y1);
      c.lineTo(x1 - Math.cos(a - 0.5) * hl, y1 - Math.sin(a - 0.5) * hl); c.lineTo(x1 - Math.cos(a + 0.5) * hl, y1 - Math.sin(a + 0.5) * hl); c.closePath(); c.fill(); }
  }
  function check(c, x, y, s, col, u = 1) {
    if (u <= 0) return; c.save(); c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = col; c.lineWidth = s * 0.22;
    const pts = [[x - s * 0.45, y], [x - s * 0.12, y + s * 0.32], [x + s * 0.5, y - s * 0.38]]; c.beginPath(); c.moveTo(...pts[0]);
    if (u < 0.4) c.lineTo(lerp(pts[0][0], pts[1][0], u / 0.4), lerp(pts[0][1], pts[1][1], u / 0.4)); else { c.lineTo(...pts[1]); const v = (u - 0.4) / 0.6; c.lineTo(lerp(pts[1][0], pts[2][0], v), lerp(pts[1][1], pts[2][1], v)); }
    c.stroke(); c.restore();
  }

  // ---------- tali rafia ----------
  function rope(ctx, x0, x1, y, col, colD, o = {}) {
    if (x1 - x0 < 1.5) return; const h = o.h || 22, a = o.a == null ? 1 : o.a; if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    if (o.rot) { const m = (x0 + x1) / 2; ctx.translate(m, y); ctx.rotate(o.rot); ctx.translate(-m, -y); }
    if (o.glow) { ctx.save(); ctx.shadowColor = o.glowCol || "#FFF1B8"; ctx.shadowBlur = 28 * o.glow; ctx.fillStyle = D.hexA(o.glowCol || "#FFF1B8", 0.6 * o.glow); H.rr(ctx, x0 - 6, y - h / 2 - 6, x1 - x0 + 12, h + 12, 10); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = "rgba(60,26,10,0.28)"; H.rr(ctx, x0 + 3, y - h / 2 + 7, x1 - x0, h, Math.min(5, h / 3)); ctx.fill();
    ctx.save(); H.rr(ctx, x0, y - h / 2, x1 - x0, h, Math.min(5, h / 3)); ctx.clip();
    ctx.fillStyle = col; ctx.fillRect(x0, y - h / 2, x1 - x0, h);
    ctx.fillStyle = colD; ctx.fillRect(x0, y + h / 2 - h * 0.26, x1 - x0, h * 0.26);
    ctx.strokeStyle = "rgba(255,255,255,0.38)"; ctx.lineWidth = Math.max(1.5, h * 0.09); ctx.setLineDash([h * 0.9, h * 0.45]);
    [-0.26, 0.04].forEach((f, i) => { ctx.lineDashOffset = -(x0 * 0.0) + i * h * 0.6 - (o.dash || 0); ctx.beginPath(); ctx.moveTo(x0, y + f * h); ctx.lineTo(x1, y + f * h); ctx.stroke(); });
    ctx.setLineDash([]); ctx.restore();
    // ujung potongan berserabut
    ctx.strokeStyle = colD; ctx.lineWidth = 2; [x0, x1].forEach((ex, j) => { for (let i = 0; i < 4; i++) { const yy = y - h / 2 + 3 + i * (h - 6) / 3, d = (j ? 1 : -1) * (3 + hh(i + j * 7 + Math.round(ex)) * 4);
      ctx.beginPath(); ctx.moveTo(ex, yy); ctx.lineTo(ex + d, yy + 1); ctx.stroke(); } });
    ctx.restore();
  }

  // ---------- penggaris ----------
  function ruler(ctx, a = 1, hl = null, mark = null) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
    const x0 = X0 - 26, x1 = cx(91) + 22, { y0, y1 } = RUL;
    ctx.fillStyle = "rgba(60,26,10,0.3)"; H.rr(ctx, x0 + 5, y0 + 8, x1 - x0, y1 - y0, 8); ctx.fill();
    const gr = ctx.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, "#FBE7A8"); gr.addColorStop(1, "#EFCB78");
    ctx.fillStyle = gr; H.rr(ctx, x0, y0, x1 - x0, y1 - y0, 8); ctx.fill(); ctx.strokeStyle = "#B88A3C"; ctx.lineWidth = 2.5; ctx.stroke();
    if (hl && hl.a > 0) { ctx.fillStyle = D.hexA(hl.col || AMB, 0.45 * hl.a); ctx.fillRect(cx(hl.from), y0 + 2, cx(hl.to) - cx(hl.from), y1 - y0 - 4); }
    ctx.strokeStyle = "#5A3B1E"; ctx.lineCap = "butt";
    for (let cm = 0; cm <= 91; cm++) { const L = cm % 10 === 0 ? 26 : cm % 5 === 0 ? 17 : 10; ctx.lineWidth = cm % 10 === 0 ? 3 : 2; ctx.beginPath(); ctx.moveTo(cx(cm), y0); ctx.lineTo(cx(cm), y0 + L); ctx.stroke(); }
    for (let cm = 0; cm <= 90; cm += 10) txt(ctx, String(cm), cx(cm), y1 - 9, 44, { align: "center", color: "#5A3B1E", weight: 800 });
    if (mark && mark.a > 0) { ctx.globalAlpha *= mark.a; const x = cx(mark.cm); ctx.fillStyle = mark.col || AMB;
      ctx.beginPath(); ctx.moveTo(x, y0 + 2); ctx.lineTo(x - 13, y0 - 18); ctx.lineTo(x + 13, y0 - 18); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#5A3B1E"; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.restore();
  }

  // ---------- gunting (pivot di (x,y), mata ke bawah) ----------
  function scissors(ctx, x, y, open, s = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const ang = 0.04 + 0.34 * open;
    [[1, "#FF8A3D", "#E9EEF8"], [-1, "#FFB547", "#C9D3E8"]].forEach(([sd, hc, bc]) => {
      ctx.save(); ctx.rotate(sd * ang);
      ctx.fillStyle = bc; ctx.beginPath(); ctx.moveTo(-7, -4); ctx.lineTo(7, -4); ctx.lineTo(3 * sd, 104); ctx.lineTo(0, 110); ctx.lineTo(-5 * sd, 90); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(40,48,106,0.55)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-2 * sd, 6); ctx.lineTo(-1 * sd, 92); ctx.stroke();
      ctx.strokeStyle = hc; ctx.lineCap = "round"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(-6 * sd, -40); ctx.stroke();
      ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(-10 * sd, -60, 15, 21, 0, 0, TAU); ctx.stroke();
      ctx.restore(); });
    ctx.fillStyle = "#5A6390"; ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.fill(); ctx.fillStyle = "#DCE3F5"; ctx.beginPath(); ctx.arc(-1.5, -1.5, 2.5, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function snipBurst(ctx, x, y, u) {
    if (u <= 0 || u >= 1) return; ctx.save(); ctx.globalAlpha = 1 - u; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.lineCap = "round";
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r0 = 16 + u * 20, r1 = 30 + u * 40; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    ctx.restore();
  }

  // ---------- panel kiri ----------
  function panelCount(ctx, y, title, n, a, o = {}) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
    if (o.glow > 0) D.glow(ctx, 318, y + 93, 300, o.gcol || AMB, 0.35 * o.glow);
    D.panel(ctx, 96, y, 444, 186, { fill: "rgba(16,26,66,0.9)", stroke: o.glow > 0 ? D.hexA(o.gcol || AMB, 0.4 + 0.6 * o.glow) : "rgba(242,246,255,0.22)", lw: o.glow > 0 ? 4 : 2 });
    txt(ctx, title, 128, y + 54, 46, { color: P.ink2, weight: 800 });
    const s = String(n), k = o.bump > 0 ? popB(o.bump) : 1, wN = tw(ctx, s, 112, 900);
    ctx.save(); ctx.translate(128 + wN / 2, y + 166 - 40); ctx.scale(k, k); txt(ctx, s, 0, 40, 112, { align: "center", color: o.ncol || AMB, weight: 900 }); ctx.restore();
    txt(ctx, "kali", 128 + wN + 18, y + 166, 48, { color: P.ink, weight: 800 });
    if (o.icon) o.icon(ctx, 462, y + 112);
    ctx.restore();
  }
  const iconScissors = (ctx, x, y) => { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.5); scissors(ctx, 0, 6, 0.55, 0.62); ctx.restore(); };
  const iconDivide = (ctx, x, y) => { ctx.save(); ctx.fillStyle = AMB; ctx.beginPath(); ctx.arc(x, y - 30, 9, 0, TAU); ctx.arc(x, y + 30, 9, 0, TAU); ctx.fill(); H.rr(ctx, x - 34, y - 6, 68, 12, 6); ctx.fill(); ctx.restore(); };

  // =====================================================================================
  // b3_1: buku → garis waktu → gulungan Euclid → FPB
  // =====================================================================================
  const BOOK_W = 880, BOOK_H = 520;
  function squiggle(ctx, x0, x1, y, seed, col, lw = 4) {
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; let x = x0, i = 0;
    while (x < x1 - 20) { const w = Math.min(x1 - x, 40 + hh(seed + i) * 80); ctx.beginPath(); for (let k = 0; k <= w; k += 6) { const yy = y - 5 * Math.abs(Math.sin((k + seed * 13) * 0.32)); k ? ctx.lineTo(x + k, yy) : ctx.moveTo(x + k, yy); } ctx.stroke(); x += w + 18; i++; }
  }
  function book(ctx, x, y, s, hl) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = "rgba(50,22,8,0.35)"; H.rr(ctx, -446, -262, 900, 540, 26); ctx.fill();
    ctx.fillStyle = "#2A3A80"; H.rr(ctx, -456, -276, 912, 548, 22); ctx.fill(); ctx.strokeStyle = "#4A5DB0"; ctx.lineWidth = 4; ctx.stroke();
    [[-436, 1], [4, -1]].forEach(([px, sd]) => { const gr = ctx.createLinearGradient(px, 0, px + 432, 0);
      if (sd > 0) { gr.addColorStop(0, "#FFF8EC"); gr.addColorStop(0.85, "#FBF0DC"); gr.addColorStop(1, "#E3D3B6"); } else { gr.addColorStop(0, "#E3D3B6"); gr.addColorStop(0.15, "#FBF0DC"); gr.addColorStop(1, "#FFF8EC"); }
      ctx.fillStyle = gr; H.rr(ctx, px, -256, 432, 512, 10); ctx.fill(); });
    ctx.fillStyle = "rgba(40,30,20,0.18)"; ctx.fillRect(-3, -256, 6, 512);
    // halaman kiri: judul algoritma pertama + langkah E1–E3 (tulisan ilustratif)
    txt(ctx, "Jilid 1", -404, -186, 60, { color: "#7A6A9A", weight: 800 });
    if (hl > 0) { ctx.save(); ctx.globalAlpha *= hl; ctx.fillStyle = "rgba(255,181,71,0.28)"; H.rr(ctx, -418, -150, 392, 92, 14); ctx.fill(); ctx.strokeStyle = AMB; ctx.lineWidth = 6; ctx.stroke(); ctx.restore(); }
    txt(ctx, "Algorithm E", -400, -84, 60, { color: INK, weight: 900 });
    ["E1.", "E2.", "E3."].forEach((e, i) => { txt(ctx, e, -400, 6 + i * 84, 60, { color: INK, weight: 800 }); squiggle(ctx, -296, -40 - (i === 1 ? 70 : 0), -6 + i * 84, 31 + i, "#5A6390"); squiggle(ctx, -296, -110, 28 + i * 84, 51 + i, "#8A90B8", 3); });
    // halaman kanan: paragraf + bagan alir kecil (ilustratif)
    for (let i = 0; i < 4; i++) squiggle(ctx, 40, 400 - (i % 2) * 60, -200 + i * 40, 70 + i, "#8A90B8", 3);
    ctx.strokeStyle = "#5A6390"; ctx.lineWidth = 4; [[110, -20], [270, -20], [190, 110]].forEach(([bx, by]) => { H.rr(ctx, bx - 60, by - 34, 120, 68, 12); ctx.stroke(); });
    arrowSmall(ctx, 170, -20, 210, -20); arrowSmall(ctx, 270, 14, 215, 76); arrowSmall(ctx, 135, 76, 110, 14);
    for (let i = 0; i < 2; i++) squiggle(ctx, 40, 380, 190 + i * 40, 90 + i, "#8A90B8", 3);
    ctx.restore();
  }
  function arrowSmall(ctx, x0, y0, x1, y1) { const a = Math.atan2(y1 - y0, x1 - x0); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - Math.cos(a - 0.5) * 12, y1 - Math.sin(a - 0.5) * 12); ctx.moveTo(x1, y1); ctx.lineTo(x1 - Math.cos(a + 0.5) * 12, y1 - Math.sin(a + 0.5) * 12); ctx.stroke(); }

  const SC = { x: 520, y: 400, w: 560, h: 340 };          // gulungan kuno
  const SEG = { x0: 330, len: 380, yA: 360, yC: 456 };   // ruas AB (91) dan CD (21) di gulungan
  const segC = SEG.len * 21 / 91;
  function scroll(ctx, t, u, tick, col) {
    if (u <= 0) return; const w = SC.w * eio(u), x0 = SC.x - w / 2, y0 = SC.y - SC.h / 2;
    ctx.save(); ctx.fillStyle = "rgba(50,22,8,0.3)"; H.rr(ctx, x0 + 8, y0 + 12, w, SC.h, 10); ctx.fill();
    const gr = ctx.createLinearGradient(0, y0, 0, y0 + SC.h); gr.addColorStop(0, "#F6E6BC"); gr.addColorStop(1, "#E7CC93"); ctx.fillStyle = gr; ctx.fillRect(x0, y0, w, SC.h);
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, SC.h); ctx.clip();
    ctx.globalAlpha *= clamp((u - 0.5) / 0.4);
    // tulisan kuno ilustratif
    squiggle(ctx, SC.x - 230, SC.x + 230, y0 + 40, 120, "#8B5E34", 3.5);
    // ruas AB dan CD: CD diukurkan ke AB (empat kali + sisa)
    const cA = col > 0 ? mixHex("#6B3F1F", RED, col) : "#6B3F1F", cC = col > 0 ? mixHex("#6B3F1F", BLU, col) : "#6B3F1F";
    ctx.lineCap = "round"; ctx.lineWidth = 10 + 4 * col;
    ctx.strokeStyle = cA; ctx.beginPath(); ctx.moveTo(SEG.x0, SEG.yA); ctx.lineTo(SEG.x0 + SEG.len, SEG.yA); ctx.stroke();
    ctx.strokeStyle = cC; ctx.beginPath(); ctx.moveTo(SEG.x0, SEG.yC); ctx.lineTo(SEG.x0 + segC, SEG.yC); ctx.stroke();
    ctx.strokeStyle = "#6B3F1F"; ctx.lineWidth = 4; [[SEG.x0, SEG.yA], [SEG.x0 + SEG.len, SEG.yA], [SEG.x0, SEG.yC], [SEG.x0 + segC, SEG.yC]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x, y - 16); ctx.lineTo(x, y + 16); ctx.stroke(); });
    // busur jangka: ruas pendek dipindah sepanjang ruas panjang
    for (let k = 1; k <= 4; k++) { const v = clamp(tick * 4 - (k - 1)); if (v <= 0) continue; const xa = SEG.x0 + (k - 1) * segC, xb = xa + segC * eout(v);
      ctx.strokeStyle = "rgba(107,63,31,0.85)"; ctx.lineWidth = 3.5; ctx.setLineDash([8, 7]); ctx.beginPath(); ctx.moveTo(xa, SEG.yA - 22);
      ctx.quadraticCurveTo((xa + xb) / 2, SEG.yA - 22 - 46 * eout(v), xb, SEG.yA - 22); ctx.stroke(); ctx.setLineDash([]);
      if (v >= 1) { ctx.strokeStyle = "#6B3F1F"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(xb, SEG.yA - 13); ctx.lineTo(xb, SEG.yA + 13); ctx.stroke(); } }
    // kolom bergaya kuno kecil (hiasan)
    ctx.fillStyle = "rgba(139,94,52,0.5)"; const kx = SC.x + 215, ky = SC.y + 60; ctx.fillRect(kx - 26, ky - 70, 52, 10); ctx.fillRect(kx - 30, ky + 56, 60, 12);
    for (let i = 0; i < 3; i++) ctx.fillRect(kx - 18 + i * 14, ky - 58, 8, 114);
    ctx.restore();
    // gulungan di kedua ujung
    [x0, x0 + w].forEach(ex => { const g2 = ctx.createLinearGradient(ex - 18, 0, ex + 18, 0); g2.addColorStop(0, "#B98A4E"); g2.addColorStop(0.5, "#F2DCA6"); g2.addColorStop(1, "#A77A42");
      ctx.fillStyle = g2; H.rr(ctx, ex - 18, y0 - 18, 36, SC.h + 36, 16); ctx.fill(); ctx.fillStyle = "#7A5530"; ctx.beginPath(); ctx.ellipse(ex, y0 - 18, 18, 7, 0, 0, TAU); ctx.ellipse(ex, y0 + SC.h + 18, 18, 7, 0, 0, TAU); ctx.fill(); });
    ctx.restore();
  }
  function mixHex(a, b, f) { const A = parseInt(a.slice(1), 16), Bv = parseInt(b.slice(1), 16); const r = [16, 8, 0].map(s => Math.round(lerp(A >> s & 255, Bv >> s & 255, clamp(f)))); return `rgb(${r[0]},${r[1]},${r[2]})`; }

  const TLN = { x0: 220, x1: 1700, y: 820 }, yrX = y => TLN.x0 + (y + 300) * (TLN.x1 - TLN.x0) / 2326;
  function timeline(ctx, t, u, trav, brk, lblL) {
    if (u <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(u / 0.3);
    const xe = lerp(TLN.x1, TLN.x0, eio(u));
    ctx.strokeStyle = "rgba(40,20,8,0.35)"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(TLN.x1, TLN.y + 4); ctx.lineTo(xe, TLN.y + 4); ctx.stroke();
    ctx.strokeStyle = "#FFF1D6"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(TLN.x1, TLN.y); ctx.lineTo(xe, TLN.y); ctx.stroke();
    [0, 500, 1000, 1500].forEach(yr => { const x = yrX(yr); if (x < xe) return; ctx.strokeStyle = "#FFF1D6"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, TLN.y - 12); ctx.lineTo(x, TLN.y + 12); ctx.stroke(); });
    // 1968 (Jilid 1)
    const x68 = yrX(1968); ctx.fillStyle = "#FFF1D6"; ctx.beginPath(); ctx.arc(x68, TLN.y, 13, 0, TAU); ctx.fill();
    txt(ctx, "1968", x68, TLN.y + 58, 46, { align: "center", color: "#FFF8EC", weight: 900 });
    // titik cahaya berjalan mundur + kurung
    if (trav > 0) { const xs = lerp(x68, yrX(-300), eio(trav));
      ctx.strokeStyle = AMB; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x68, TLN.y); ctx.lineTo(xs, TLN.y); ctx.stroke();
      ctx.strokeStyle = "rgba(255,241,214,0.9)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x68, TLN.y - 34); ctx.lineTo(x68, TLN.y - 48); ctx.lineTo(xs, TLN.y - 48); ctx.lineTo(xs, TLN.y - 34); ctx.stroke();
      D.glow(ctx, xs, TLN.y, 60, AMB, 0.9); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(xs, TLN.y, 11, 0, TAU); ctx.fill(); }
    if (lblL > 0) { ctx.save(); ctx.globalAlpha *= clamp(lblL / 0.2); ctx.fillStyle = AMB; ctx.beginPath(); ctx.arc(yrX(-300), TLN.y, 14, 0, TAU); ctx.fill();
      txt(ctx, "±300 SM", yrX(-300) + 40, TLN.y + 58, 46, { align: "center", color: "#FFF8EC", weight: 900 }); ctx.restore(); }
    ctx.restore();
    lab(ctx, "lebih dari 2.000 tahun", 960, TLN.y - 92, brk, { size: 48, col: AMB });
  }

  function sceneB31(ctx, b, l, t) {
    set(ctx, t);
    const tBook = at(b, "sudah"), tYai = at(b, "yaitu"), tEuc = at(b, "Euclid"), tFPB = at(b, "FPB."), tDua = at(b, "dua ribu"), tTah = atE(b, "tahun,");
    // buku: tengah → kanan
    const mv = eio((l - tBook + 0.1) / 1.0), bx = lerp(960, 1440, mv), by = lerp(392, 380, mv), bs = lerp(1, 0.75, mv);
    const bookIn = eout(fd(l, 0, 0.7));
    ctx.save(); ctx.globalAlpha *= bookIn; book(ctx, bx, by + (1 - bookIn) * 40, bs, fd(l, at(b, "pertama") - 0.1, 0.35)); ctx.restore();
    lab(ctx, "algoritma pertama", 960, 720, l - at(b, "pertama"), { size: 50, col: AMB, a: 1 - fd(l, tBook - 0.2, 0.4) });
    // garis waktu
    timeline(ctx, t, fd(l, tBook - 0.1, 0.7), fd(l, tBook + 0.4, Math.max(0.8, tDua + 0.3 - tBook - 0.4)), l - (tDua + 0.15), l - tTah);
    // gulungan kuno
    const col = fd(l, atE(b, "FPB.") + 0.1, 0.8);
    scroll(ctx, t, fd(l, tYai - 0.1, 0.9), fd(l, tEuc + 0.3, 1.6), col);
    lab(ctx, "Euclid · Yunani kuno", SC.x, 166, l - tEuc, { size: 48, col: P.warm });
    // FPB
    const uF = l - tFPB;
    if (uF > 0) { ctx.save(); ctx.globalAlpha *= clamp(uF / 0.15); D.glow(ctx, 960, 528, 200, AMB, 0.4 + 0.08 * Math.sin(t * 2.4));
      ctx.translate(960, 528); const k = popB(uF); ctx.scale(k, k); D.label(ctx, "FPB", 0, 0, { size: 76, col: AMB }); ctx.restore();
      const u2 = uF - 0.35; if (u2 > 0) { ctx.save(); ctx.globalAlpha *= clamp(u2 / 0.3);
        const words = ["Faktor ", "Persekutuan ", "Terbesar"]; let x = 960 - tw(ctx, words.join(""), 48) / 2;
        words.forEach(w => { txt(ctx, w[0], x, 652, 48, { color: AMB, weight: 900 }); const w0 = tw(ctx, w[0], 48, 900); txt(ctx, w.slice(1), x + w0 + 3, 652, 48, { color: "#FFF8EC", weight: 800 }); x += tw(ctx, w, 48) + 3; });
        ctx.restore(); } }
    // Bip: menunjuk buku, menoleh ke garis waktu, menunjuk gulungan, lalu senang
    const bIn = eout(fd(l, 0.1, 0.8)), bxp = lerp(1960, 1720, bIn), byp = 712 + Math.sin(t * 2) * 4;
    let opt = { t, pose: "diam", mood: "happy", wave: 0 };
    if (l < tBook - 0.2) opt = { t, pose: "tunjuk", target: [lerp(960, 1440, mv) - 260 * bs, by - 84 * bs] };
    else if (l < tYai) opt = { t, pose: "diam", mood: "wow", look: [-1, 0.3] };
    else if (l < tFPB - 0.2) opt = { t, pose: "tunjuk", target: [SC.x + 120, SC.y] };
    else opt = { t, pose: "diam", mood: "happy", wave: l - tFPB };
    B.draw(ctx, bxp, byp, 160, opt);
  }

  // =====================================================================================
  // b3_2: memotong tali
  // =====================================================================================
  const PIECES = [
    { k: 0, a: 70, b: 91, col: RED, colD: RED_D, row: AY, s: "21" }, { k: 1, a: 49, b: 70, col: RED, colD: RED_D, row: AY, s: "21" },
    { k: 2, a: 28, b: 49, col: RED, colD: RED_D, row: AY, s: "21" }, { k: 3, a: 7, b: 28, col: RED, colD: RED_D, row: AY, s: "21" },
    { k: 4, a: 14, b: 21, col: BLU, colD: BLU_D, row: BY, s: "7", dx: 16 }, { k: 5, a: 7, b: 14, col: BLU, colD: BLU_D, row: BY, s: "7", dx: -16 }];
  const EQ = [["91", "21", "70"], ["70", "21", "49"], ["49", "21", "28"], ["28", "21", "7"], ["21", "7", "14"], ["14", "7", "7"]];
  function plan(b) {
    if (b._p3 && b._p3.s === b.start) return b._p3;
    const c1 = at(b, "yang pendek,", 0.05), cE = at(b, "tujuh", -0.25), d = (cE - c1) / 5.5;
    const tc = [c1, c1 + d, c1 + 2 * d, c1 + 3 * d, c1 + 4.5 * d, c1 + 5.5 * d];
    const lift0 = at(b, "memotong"), lift1 = Math.min(lift0 + 1.2, at(b, "sepanjang") - 0.05);
    return (b._p3 = { s: b.start, tc, d, lift0, lift1, mark: at(b, "sepanjang"), sw: tc[3], tSem: at(b, "sembilan"), tDua: at(b, "dua puluh satu"),
      tTuj: at(b, "tujuh"), tFPB: at(b, "FPB-nya."), end: atE(b, "FPB-nya."), tKal: at(b, "Kalau"), tBay: at(b, "Bayangkan") });
  }
  // posisi tali merah (R) dan biru (U): o = offset cm, len cm, y
  function ropes(p, l) {
    const tc = p.tc, R = { o: 0, len: 91, y: WY }, U = { o: 0, len: 21, y: PY };
    for (let k = 0; k < 4; k++) if (l >= tc[k]) R.len = 91 - 21 * (k + 1);
    for (let k = 4; k < 6; k++) if (l >= tc[k]) U.len = 21 - 7 * (k - 3);
    const sw = p.sw;
    if (l < tc[3] + 0.15) {
      if (l >= p.lift0) { const u = eio((l - p.lift0) / (p.lift1 - p.lift0)); U.o = lerp(0, 70, u); U.y = lerp(PY, MY, u) - Math.sin(u * Math.PI) * 60; }
      for (let k = 1; k <= 3; k++) { const s0 = tc[k - 1] + 0.18; U.o -= 21 * eio((l - s0) / 0.45); }
    } else {
      // tukar peran: merah 7 naik, biru turun ke garis kerja, merah menjadi pengukur di ujung biru
      const u1 = eio((l - sw - 0.15) / 0.35), u2 = eio((l - sw - 0.4) / 0.45), u3 = eio((l - sw - 0.85) / 0.45);
      R.y = lerp(lerp(WY, 318, u1), MY, u3); R.o = lerp(0, 14, u3);
      U.o = lerp(7, 0, u2); U.y = lerp(MY, WY, u2);
      R.o -= 7 * eio((l - tc[4] - 0.18) / 0.45); R.o -= 7 * eio((l - tc[5] - 0.25) / 0.45);
    }
    return { R, U };
  }
  function cutX(p, k) { return k < 4 ? cx(91 - 21 * (k + 1)) : cx(21 - 7 * (k - 3)); }
  function bipX(p, l) {
    const tc = p.tc; let x = lerp(2060, 1560, eout(fd(l, 0.3, 1.4)));
    x = lerp(x, cutX(p, 0), eio((l - p.lift0) / (p.lift1 - p.lift0)));
    for (let k = 1; k < 6; k++) { const s0 = k === 4 ? p.sw + 0.85 : tc[k - 1] + 0.18, d = k === 4 ? 0.45 : 0.45; x = lerp(x, cutX(p, k), eio((l - s0) / d)); }
    return lerp(x, 1560, eio((l - tc[5] - 0.5) / 0.9));
  }
  function openAt(p, l) { let o = 0.08; p.tc.forEach(c => { if (l > c - 0.55 && l < c + 0.2) { const u = l - (c - 0.55); o = u < 0.3 ? lerp(0.08, 1, eout(u / 0.3)) : u < 0.55 ? lerp(1, 0.02, eio((u - 0.3) / 0.25)) : lerp(0.02, 0.08, (u - 0.55) / 0.2); } }); return o; }

  function pieceGeom(pc, p, l) {   // posisi potongan sesudah jatuh
    const tc = p.tc[pc.k], u = (l - tc) / 0.6; const fall = u < 1 ? u * u : 1, bounce = u > 1 ? -10 * Math.exp(-(u - 1) * 6) * Math.abs(Math.sin((u - 1) * 14)) : 0;
    const y = lerp(WY, pc.row, fall) + bounce, sh = (pc.dx || 0) * eio((l - tc - 0.6) / 0.4);
    return { x0: cx(pc.a) + 4 + sh, x1: cx(pc.b) - 2 + sh, y, rot: u < 1 ? 0.06 * Math.sin(u * Math.PI) * (pc.k % 2 ? 1 : -1) : 0, landed: u >= 1 };
  }

  // gambar seluruh keadaan b3_2 pada waktu l (dipakai juga di awal b3_3); o.ov = alfa lapisan label, o.skip = { pieces, bip }
  function drawB32(ctx, b, l, t, o = {}) {
    const p = plan(b), tc = p.tc, ov = o.ov == null ? 1 : o.ov, rulA = o.rul == null ? 1 : o.rul;
    const nCut = tc.filter(c => l >= c).length;
    const recap0 = p.end + 0.35, recapI = l >= recap0 ? Math.floor((l - recap0) / 0.5) : -1;
    const { R, U } = ropes(p, l);
    // penggaris (pembacaan ujung tali kerja)
    const workLen = l < tc[3] + 0.6 ? R.len : U.len, workCol = l < tc[3] + 0.6 ? RED : BLU;
    const hlR = l < p.tDua - 0.5 ? { from: 0, to: 91 * eio((l - p.tSem + 0.6) / 1.0), a: fd(l, p.tSem - 0.6, 0.2) * (1 - fd(l, p.tDua - 1.0, 0.4)), col: RED }
      : l < p.lift0 ? { from: 0, to: 21 * eio((l - p.tDua + 0.5) / 0.7), a: fd(l, p.tDua - 0.5, 0.2) * (1 - fd(l, p.lift0 - 0.4, 0.4)), col: BLU }
      : l > tc[5] + 0.5 ? { from: 0, to: 7, a: fd(l, tc[5] + 0.6, 0.4) * (0.7 + 0.3 * Math.sin(t * 3)), col: AMB } : null;
    ruler(ctx, rulA * fd(l, 1.2, 0.9), hlR, { cm: workLen, a: fd(l, p.lift0, 0.4) * (l < tc[5] + 0.5 ? 1 : 0.4), col: workCol });
    // potongan yang sudah jatuh
    if (!(o.skip && o.skip.pieces)) PIECES.forEach(pc => { if (l < tc[pc.k]) return; const gm = pieceGeom(pc, p, l);
      const hi = recapI === pc.k ? Math.sin(clamp((l - recap0 - pc.k * 0.5) / 0.5) * Math.PI) : 0;
      if (hi > 0) D.glow(ctx, (gm.x0 + gm.x1) / 2, gm.y, 60 + (gm.x1 - gm.x0) * 0.45, "#FFF1B8", 0.55 * hi);
      rope(ctx, gm.x0, gm.x1, gm.y - 6 * hi, pc.col, pc.colD, { rot: gm.rot, glow: hi, dash: 0 });
      lab(ctx, pc.s, (gm.x0 + gm.x1) / 2, pc.row - 52, (l - tc[pc.k] - 0.6) * (gm.landed ? 1 : 0), { size: 46, col: hi > 0.3 ? AMB : pc.col === RED ? RED : BLU, a: ov, k: 1 + 0.15 * hi }); });
    // tali utama
    const stackGlow = l > tc[5] + 0.6 ? fd(l, tc[5] + 0.6, 0.4) * (0.55 + 0.45 * Math.sin(t * 2.6)) * (recapI >= 0 && recapI < 6 ? 0.3 : 1) : 0;
    const appear = eio(fd(l, 0.35, 1.5));
    const segPos = (x0, len, y, sx0, sl, sy) => [lerp(sx0, x0, appear), lerp(sx0 + sl, x0 + len, appear), lerp(sy, y, appear), lerp(14, 22, appear)];
    if (!(o.skip && o.skip.ropes)) { const [a0, a1, ay, ah] = segPos(cx(U.o), U.len * PX, U.y, SEG.x0, segC, SEG.yC); rope(ctx, a0, a1, ay, BLU, BLU_D, { h: ah, glow: stackGlow + (l > p.tDua - 0.3 && l < p.lift0 ? 0.5 * fd(l, p.tDua - 0.3, 0.3) * (1 - fd(l, p.lift0 - 0.5, 0.4)) : 0) }); }
    if (!(o.skip && o.skip.ropes)) { const [a0, a1, ay, ah] = segPos(cx(R.o), R.len * PX, R.y, SEG.x0, SEG.len, SEG.yA); rope(ctx, a0, a1, ay, RED, RED_D, { h: ah, glow: stackGlow + (l > p.tSem - 0.3 && l < p.tDua - 0.6 ? 0.5 * fd(l, p.tSem - 0.3, 0.3) * (1 - fd(l, p.tDua - 0.9, 0.3)) : 0) }); }
    lab(ctx, "91 cm", cx(91) - 96, WY - 60, (l - p.tSem - 0.5) * (o.skip && o.skip.ropes ? 0 : 1), { size: 48, col: RED, a: 1 - fd(l, p.lift0 - 0.2, 0.3) });
    lab(ctx, "21 cm", cx(21) + 112, PY, (l - p.tDua - 0.5) * (o.skip && o.skip.ropes ? 0 : 1), { size: 48, col: BLU, a: 1 - fd(l, p.lift0 - 0.2, 0.3) });
    // garis tanda potong (putus-putus) sebelum tiap potongan
    tc.forEach((c, k) => { const s0 = k === 0 ? p.mark : c - 0.5, a = fd(l, s0, 0.2) * (1 - fd(l, c, 0.15)); if (a <= 0) return; const x = cutX(p, k);
      ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(x, MY - 40); ctx.lineTo(x, RUL.y0 - 4); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); });
    tc.forEach((c, k) => snipBurst(ctx, cutX(p, k), WY, (l - c) / 0.35));
    // ukuran 7 cm (dua tali bertumpuk sama panjang)
    const u7 = l - (tc[5] + 0.6);
    if (u7 > 0) { ctx.save(); ctx.globalAlpha *= clamp(u7 / 0.3) * ov; ctx.strokeStyle = "#FFF8EC"; ctx.lineWidth = 4; ctx.setLineDash([9, 7]);
      [cx(0), cx(7)].forEach(x => { ctx.beginPath(); ctx.moveTo(x, MY - 34); ctx.lineTo(x, WY + 22); ctx.stroke(); }); ctx.setLineDash([]); ctx.restore();
      lab(ctx, "7 cm", cx(7) + 118, 388, u7, { size: 50, col: AMB, a: ov });
      ctx.save(); ctx.globalAlpha *= clamp(u7 / 0.3) * ov; arrow(ctx, cx(7) + 36, 388, cx(7) + 14, 388, AMB, 6); ctx.restore(); }
    const uF = l - p.tFPB;
    if (uF > 0) { ctx.save(); ctx.globalAlpha *= clamp(uF / 0.15) * ov; D.glow(ctx, 1120, 372, 260, AMB, 0.35 + 0.06 * Math.sin(t * 2.2)); ctx.translate(1120, 372); const k = popB(uF); ctx.scale(k, k);
      D.label(ctx, "FPB = 7", 0, 0, { size: 76, col: AMB }); ctx.restore(); }
    // Bip dengan gunting
    if (!(o.skip && o.skip.bip)) {
      const bx = bipX(p, l), by = BIPY + Math.sin(t * 2.2) * 6, scis = fd(l, p.lift0 - 0.3, 0.35) * (1 - fd(l, tc[5] + 1.0, 0.3));
      let opt;
      if (scis > 0) { const op = openAt(p, l); opt = { t, pose: "pegang", mood: l > tc[5] ? "wow" : "happy", shadow: false, look: [0, 1], grip: 0.36, prop: (c, px, py) => { const k = 0.85 * (0.4 + 0.6 * popS(scis * 2)); c.save(); c.globalAlpha *= clamp(scis * 2); scissors(c, px, py + 92 * k, op, k); c.restore(); } }; }
      else if (l > p.tDua - 0.4 && l < p.lift0) opt = { t, pose: "tunjuk", shadow: false, target: [cx(14), PY] };
      else if (l > p.tSem - 0.5 && l < p.lift0) opt = { t, pose: "tunjuk", shadow: false, target: [cx(88), WY] };
      else opt = { t, pose: "diam", mood: "happy", shadow: false, wave: l > tc[5] ? l - tc[5] - 1 : l - 0.4 };
      B.draw(ctx, bx, by, BIPS, opt);
    }
    // ---- panel kiri: penghitung potongan + catatan panjang ----
    if (ov > 0) {
      const cA = fd(l, p.tKal, 0.4) * (o.keepA ? 1 : 1);
      if (!o.noA) panelCount(ctx, 92, "Memotong", nCut, cA, { icon: iconScissors, bump: nCut ? l - tc[nCut - 1] : 0, glow: l > tc[5] + 0.3 ? 0.5 + 0.3 * Math.sin(t * 2) : 0 });
      const aB = fd(l, p.tSem - 0.3, 0.5) * ov; if (aB > 0) { ctx.save(); ctx.globalAlpha *= aB;
        D.panel(ctx, 96, 304, 444, 556, { fill: "rgba(16,26,66,0.9)", stroke: "rgba(242,246,255,0.22)" });
        txt(ctx, "Panjang (cm)", 318, 364, 46, { align: "center", color: P.ink2, weight: 800 });
        rope(ctx, 150, 270, 410, RED, RED_D, { h: 20 }); rope(ctx, 366, 486, 410, BLU, BLU_D, { h: 20 });
        const colR = [["91", p.tSem + 0.5], ["70", tc[0]], ["49", tc[1]], ["28", tc[2]], ["7", tc[3]]], colU = [["21", p.tDua + 0.5], ["14", tc[4]], ["7", tc[5]]];
        [[colR, 210, RED], [colU, 426, BLU]].forEach(([col, x, cc]) => { const shown = col.filter(e => l >= e[1]).length;
          col.forEach(([s, t0], i) => { const u = l - t0; if (u <= 0) return; const y = 488 + i * 84, cur = i === shown - 1;
            if (i > 0) { ctx.save(); ctx.globalAlpha *= clamp(u / 0.2) * 0.8; ctx.fillStyle = cc; ctx.beginPath(); ctx.moveTo(x - 11, y - 70); ctx.lineTo(x + 11, y - 70); ctx.lineTo(x, y - 56); ctx.closePath(); ctx.fill(); ctx.restore(); }
            const hi = recapI >= 0 && ((cc === RED && recapI === i - 1 && i >= 1 && i <= 4) || (cc === BLU && recapI === i + 3 && i >= 1)) ? 1 : 0;
            ctx.save(); ctx.globalAlpha *= clamp(u / 0.15) * (cur || hi ? 1 : 0.55); const k = popB(u) * (1 + 0.1 * hi); ctx.translate(x, y - 20); ctx.scale(k, k);
            if (cur && l > tc[5] + 0.6) { D.glow(ctx, 0, 0, 70, AMB, 0.5); }
            txt(ctx, s, 0, 20, 56, { align: "center", color: cur ? "#FFFFFF" : "#C9D3F0", weight: 900 });
            if (!cur && !hi) { ctx.strokeStyle = "rgba(201,211,240,0.8)"; ctx.lineWidth = 4; const w = tw(ctx, s, 56, 900); ctx.beginPath(); ctx.moveTo(-w / 2 - 6, 2); ctx.lineTo(w / 2 + 6, 2); ctx.stroke(); }
            if (cur) { ctx.fillStyle = cc; H.rr(ctx, -34, 32, 68, 7, 3.5); ctx.fill(); }
            ctx.restore(); }); });
        ctx.restore(); }
      // ---- papan langkah (kanan bawah) ----
      const sStart = p.mark, aS = fd(l, sStart, 0.4) * ov;
      if (aS > 0) { ctx.save(); ctx.globalAlpha *= aS; D.panel(ctx, 980, 794, 820, 100, { fill: "rgba(16,26,66,0.9)", stroke: "rgba(242,246,255,0.22)" });
        if (l < tc[5] + 0.6) { let k = 0; for (let j = 1; j < 6; j++) if (l >= tc[j - 1] + 0.35) k = j; const e = EQ[k];
          const done = l >= tc[k], cW = k < 4 ? RED : BLU, cM = k < 4 ? BLU : RED;
          const parts = [[e[0], cW], [" − ", P.ink], [e[1], cM], [" = ", P.ink], [done ? e[2] : "?", done ? cW : P.ink2]];
          let wsum = 0; parts.forEach(q => wsum += tw(ctx, q[0], 60, 900) + 4); let x = 1390 - wsum / 2;
          const sw0 = k === 0 ? sStart : tc[k - 1] + 0.35, uin = l - sw0;
          ctx.save(); ctx.globalAlpha *= clamp(uin / 0.2);
          parts.forEach(([s, c], i) => { const w = tw(ctx, s, 60, 900); if (i === 4 && done) { const u = l - tc[k]; ctx.save(); ctx.translate(x + w / 2, 844); const kk = popB(u); ctx.scale(kk, kk); txt(ctx, s, 0, 22, 60, { align: "center", color: c, weight: 900 }); ctx.restore(); }
            else txt(ctx, s, x, 866, 60, { color: c, weight: 900 }); x += w + 4; });
          ctx.restore();
        } else { const u = l - tc[5] - 0.6; ctx.save(); ctx.globalAlpha *= clamp(u / 0.25);
          txt(ctx, "7  =  7", 1330, 866, 60, { align: "center", color: "#FFFFFF", weight: 900 }); txt(ctx, "sama", 1560, 862, 46, { align: "center", color: GRN, weight: 900 }); check(ctx, 1670, 846, 46, GRN, fd(l, tc[5] + 0.8, 0.4)); ctx.restore(); }
        ctx.restore(); }
    }
  }

  function sceneB32(ctx, b, l, t) { set(ctx, t); drawB32(ctx, b, l, t); }

  // =====================================================================================
  // b3_3: cara pembagian
  // =====================================================================================
  const BX0 = 690, BPX = 12, BAR1 = 232, BAR2 = 690, BH = 56, ROW1 = 404, ROW2 = 590, RX = 730;
  const bx = cm => BX0 + cm * BPX;
  function rowToks(ctx, toks, x) { const out = []; toks.forEach(tk => { const w = tw(ctx, tk.s, 84, 900); out.push({ ...tk, x, w }); x += w + (tk.ng ? 4 : 14); }); return out; }
  function drawToks(ctx, toks, y, l) {
    toks.forEach(tk => { const u = l - tk.t0; if (u <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(u / 0.12); ctx.translate(tk.x + tk.w / 2, y - 30); const k = popB(u); ctx.scale(k, k);
      txt(ctx, tk.s, 0, 30, 84, { align: "center", color: tk.col, weight: 900 }); ctx.restore(); });
  }
  function bar(ctx, y, len, col, colD, segLen, nSeg, tSeg, tRem, l, o = {}) {
    // batang = tali utuh; ruas muncul satu per satu (garis pemisah + label di dalam)
    rope(ctx, bx(0), bx(len), y, col, colD, { h: BH, glow: o.glow || 0 });
    for (let k = 0; k < nSeg; k++) { const u = l - (tSeg + k * (o.dt || 0.24)); if (u <= 0) continue; const xa = bx(k * segLen), xb = bx((k + 1) * segLen);
      ctx.save(); ctx.globalAlpha *= clamp(u / 0.15); ctx.fillStyle = "rgba(255,255,255,0.16)"; if (k % 2 === 0) ctx.fillRect(xa, y - BH / 2, xb - xa, BH);
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(xb, y - BH / 2 - 10); ctx.lineTo(xb, y + BH / 2 + 10); ctx.stroke();
      const kk = popS(u); ctx.translate((xa + xb) / 2, y); ctx.scale(kk, kk); txt(ctx, String(segLen), 0, 16, 44, { align: "center", color: "#FFFFFF", weight: 900 }); ctx.restore(); }
    if (tRem != null && l > tRem && len % segLen) { const xa = bx(nSeg * segLen), xb = bx(len), u = l - tRem;
      ctx.save(); ctx.globalAlpha *= clamp(u / 0.15); ctx.fillStyle = "rgba(255,181,71,0.55)"; ctx.fillRect(xa, y - BH / 2, xb - xa, BH); ctx.strokeStyle = AMB; ctx.lineWidth = 6; H.rr(ctx, xa - 2, y - BH / 2 - 6, xb - xa + 8, BH + 12, 10); ctx.stroke();
      const kk = popS(u); ctx.translate((xa + xb) / 2 + 2, y); ctx.scale(kk, kk); txt(ctx, String(len % segLen), 0, 16, 44, { align: "center", color: "#FFFFFF", weight: 900 }); ctx.restore(); }
    if (o.whole > 0) { ctx.save(); ctx.globalAlpha *= o.whole; txt(ctx, String(len), bx(len / 2), y + 16, 46, { align: "center", color: "#FFFFFF", weight: 900 }); ctx.restore(); }
  }
  function sceneB33(ctx, b, l, t, TL) {
    set(ctx, t);
    const b32 = TL.beats.find(x => x.id === "b3_2"), p = plan(b32), L32 = b32.dur;
    const tCara = at(b, "Cara"), tBuku = at(b, "buku Knuth"), tKita = at(b, "Kita langsung"), tBagi = at(b, "membagi"), tSisa = at(b, "sisanya,"),
      tSamp = at(b, "sampai"), tNol = at(b, "nol."), tJaw = at(b, "Jawabannya"), tTuj = at(b, "tujuh,"), tTet = at(b, "tetapi"), tDua = at(b, "dua kali");
    // --- sisa b3_2 memudar (penggaris, panel catatan, papan langkah, label) ---
    const ov = 1 - fd(l, 0.15, 0.6);
    if (ov > 0 || l < 1.6) drawB32(ctx, b32, L32, t, { ov, rul: 1 - fd(l, 0.4, 0.8), skip: { pieces: true, bip: true, ropes: true }, noA: true });
    // --- potongan & tali terbang kembali menjadi dua batang ---
    const fly = k => eio((l - 0.55 - k * 0.09) / 1.25);
    const merge = eio((l - 2.05) / 0.4);
    const items = [];
    PIECES.forEach(pc => { const gm = pieceGeom(pc, p, L32); items.push({ k: pc.k, sx0: gm.x0, sx1: gm.x1, sy: gm.y, a: pc.a, b: pc.b, col: pc.col, colD: pc.colD, bar: pc.col === RED ? BAR1 : BAR2 }); });
    const { R, U } = ropes(p, L32);
    items.push({ k: 6, sx0: cx(R.o), sx1: cx(R.o + R.len), sy: R.y, a: 0, b: 7, col: RED, colD: RED_D, bar: BAR1 });   // tali merah 7 = sisa paling akhir di batang 91
    items.push({ k: 7, sx0: cx(U.o), sx1: cx(U.o + U.len), sy: U.y, a: 0, b: 7, col: BLU, colD: BLU_D, bar: BAR2 });
    // tiap potongan kembali ke tempat asalnya (cm yang sama) di batangnya
    // --- papan pembagian (gelap, supaya angka berwarna mudah dibaca) ---
    const pa = fd(l, 1.5, 0.7); if (pa > 0) { ctx.save(); ctx.globalAlpha *= pa; D.panel(ctx, 604, 184, 1216, 600, { fill: "rgba(16,26,66,0.88)", stroke: "rgba(242,246,255,0.22)" }); ctx.restore(); }
    if (l < 2.6) items.forEach(it => { const u = fly(it.k === 6 ? 4.5 : it.k === 7 ? 5.5 : it.k), a = it.a, bb = it.b, gap = (1 - merge) * 5;
      const x0 = lerp(it.sx0, bx(a) + gap, u), x1 = lerp(it.sx1, bx(bb) - gap, u), y = lerp(it.sy, it.bar, u) - Math.sin(u * Math.PI) * 40, h = lerp(22, BH, u);
      rope(ctx, x0, x1, y, it.col, it.colD, { h }); });
    // --- dua batang utuh + pembagian ---
    const barA = fd(l, 2.45, 0.2);
    if (barA > 0) { ctx.save(); ctx.globalAlpha *= barA;
      bar(ctx, BAR1, 91, RED, RED_D, 21, 4, tBagi + 0.15, tSisa, l, { whole: fd(l, 2.5, 0.3) * (1 - fd(l, tBagi, 0.2)), dt: 0.22 });
      bar(ctx, BAR2, 21, BLU, BLU_D, 7, 3, tSamp + 0.55, null, l, { whole: fd(l, 2.5, 0.3) * (1 - fd(l, tSamp + 0.45, 0.2)), dt: 0.18, glow: fd(l, tJaw, 0.4) * (0.6 + 0.3 * Math.sin(t * 2.6)) });
      ctx.restore(); }
    // judul: buku jilid 1 + "cara pembagian"
    const uB = l - tBuku; if (uB > 0) { ctx.save(); ctx.globalAlpha *= clamp(uB / 0.2); ctx.translate(606, 126); const k = popS(uB); ctx.scale(k, k);
      ctx.fillStyle = "rgba(50,22,8,0.35)"; H.rr(ctx, -36, -48, 80, 104, 8); ctx.fill(); ctx.fillStyle = "#2A3A80"; H.rr(ctx, -42, -54, 80, 104, 8); ctx.fill();
      ctx.fillStyle = "#FFF8EC"; ctx.fillRect(28, -48, 8, 92); ctx.strokeStyle = AMB; ctx.lineWidth = 3; ctx.strokeRect(-32, -42, 54, 80); txt(ctx, "1", -5, 18, 48, { align: "center", color: "#FFF8EC", weight: 900 }); ctx.restore(); }
    lab(ctx, "cara pembagian", 930, 126, l - tCara, { size: 52, col: AMB });
    // baris pembagian
    ctx.font = `900 84px ${F}`;
    const r1 = rowToks(ctx, [{ s: "91", col: RED, t0: tKita + 0.1 }, { s: " : ", col: P.ink, t0: tKita + 0.3 }, { s: "21", col: BLU, t0: tKita + 0.35 }, { s: " = ", col: P.ink, t0: tBagi + 0.15 },
      { s: "4", col: "#FFFFFF", t0: tBagi + 0.15 + 4 * 0.22, ng: 1 }, { s: ", sisa ", col: P.ink2, t0: tSisa }, { s: "7", col: AMB, t0: tSisa + 0.1 }], RX);
    const r2 = rowToks(ctx, [{ s: "21", col: BLU, t0: tSamp + 0.3 }, { s: " : ", col: P.ink, t0: tSamp + 0.4 }, { s: "7", col: AMB, t0: tSamp + 0.45 }, { s: " = ", col: P.ink, t0: tSamp + 0.55 },
      { s: "3", col: "#FFFFFF", t0: tSamp + 0.55 + 3 * 0.18, ng: 1 }, { s: ", sisa ", col: P.ink2, t0: tNol - 0.15 }, { s: "0", col: GRN, t0: tNol }], RX);
    // nomor langkah
    [[ROW1, tKita], [ROW2, tSamp + 0.3]].forEach(([y, t0], i) => { const u = l - t0; if (u <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(u / 0.15); ctx.translate(RX - 66, y - 30); const k = popS(u); ctx.scale(k, k);
      ctx.fillStyle = AMB; ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fill(); txt(ctx, String(i + 1), 0, 16, 46, { align: "center", color: "#10142E", weight: 900 }); ctx.restore(); });
    drawToks(ctx, r1, ROW1, l); drawToks(ctx, r2, ROW2, l);
    // panah sisa turun ke baris berikutnya
    const ua = fd(l, tSamp - 0.05, 0.45), ub = fd(l, tSamp + 0.1, 0.5);
    if (ua > 0) { const a = r1[2], c = r2[0]; arrow(ctx, a.x + a.w / 2, ROW1 + 16, c.x + c.w / 2, ROW2 - 74, BLU, 7, 0.4, ua); }
    if (ub > 0) { const a = r1[6], c = r2[2]; arrow(ctx, a.x + a.w / 2, ROW1 + 16, c.x + c.w / 2 + 6, ROW2 - 74, AMB, 7, -0.25, ub); }
    // 0 ditandai centang kecil; 7 dilingkari
    if (l > tNol + 0.2) { const z = r2[6]; check(ctx, z.x + z.w + 46, ROW2 - 30, 46, GRN, fd(l, tNol + 0.2, 0.4)); }
    const uc = fd(l, tJaw, 0.6); if (uc > 0) { const s = r2[2]; ctx.save(); ctx.strokeStyle = AMB; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath();
      ctx.ellipse(s.x + s.w / 2, ROW2 - 30, 44, 56, 0, -Math.PI / 2, -Math.PI / 2 + TAU * eio(uc)); ctx.stroke(); ctx.restore();
      D.glow(ctx, s.x + s.w / 2, ROW2 - 30, 110, AMB, 0.25 * uc); }
    const uF = l - tTuj, FX = 1240; if (uF > 0) { const s = r2[2]; ctx.save(); ctx.globalAlpha *= clamp(uF / 0.3); arrow(ctx, FX - 150, BAR2 - 30, s.x + s.w / 2 + 30, ROW2 + 22, AMB, 6, 0.2, fd(l, tTuj, 0.4)); ctx.restore();
      ctx.save(); ctx.globalAlpha *= clamp(uF / 0.15); D.glow(ctx, FX, BAR2 + 6, 240, AMB, 0.35 + 0.06 * Math.sin(t * 2.2)); ctx.translate(FX, BAR2 + 6); const k = popB(uF); ctx.scale(k, k);
      D.label(ctx, "FPB = 7", 0, 0, { size: 76, col: AMB }); ctx.restore(); }
    // --- panel kiri: memotong 6 (dari b3_2) dan membagi 0→2, lalu balok langkah 6 vs 2 ---
    const nDiv = (l >= tSisa + 0.2 ? 1 : 0) + (l >= tNol + 0.2 ? 1 : 0), lastDiv = nDiv === 2 ? tNol + 0.2 : tSisa + 0.2;
    const cmp = fd(l, tTet, 0.5), emph = fd(l, tDua, 0.3);
    panelCount(ctx, 92, "Memotong", 6, 1, { icon: iconScissors, glow: (1 - fd(l, 0, 0.8)) * (0.5 + 0.3 * Math.sin(t * 2)) });
    panelCount(ctx, 304, "Membagi", nDiv, fd(l, tCara + 0.6, 0.5), { icon: iconDivide, bump: nDiv ? l - lastDiv : 0, ncol: AMB, glow: emph * (0.6 + 0.4 * Math.sin(t * 2.4)), gcol: GRN });
    if (cmp > 0) { ctx.save(); ctx.globalAlpha *= cmp; D.panel(ctx, 96, 516, 444, 344, { fill: "rgba(16,26,66,0.9)", stroke: "rgba(242,246,255,0.22)" });
      txt(ctx, "Banyak langkah", 318, 572, 46, { align: "center", color: P.ink2, weight: 800 });
      const rowsC = [[6, 694, i => (i < 4 ? RED : BLU), "6", tTet + 0.1, "memotong"], [2, 818, () => AMB, "2", tDua, "membagi"]];
      rowsC.forEach(([n, y, cf, s, t0, nm]) => { txt(ctx, nm, 128, y - 40, 44, { color: P.ink2, weight: 700 });
        for (let i = 0; i < n; i++) { const u = l - t0 - i * 0.1; if (u <= 0) continue; const k = popS(u);
          ctx.save(); ctx.globalAlpha *= clamp(u / 0.12); ctx.translate(150 + i * 54, y); ctx.scale(k, k); ctx.fillStyle = cf(i); H.rr(ctx, -22, -22, 44, 44, 9); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.fillRect(-16, -16, 32, 7); ctx.restore(); }
        const u = l - t0 - n * 0.1; if (u > 0) { ctx.save(); ctx.globalAlpha *= clamp(u / 0.15); txt(ctx, s, 506, y + 22, 64, { align: "right", color: s === "2" ? GRN : "#FFFFFF", weight: 900 }); ctx.restore(); } });
      ctx.restore(); }
    // --- Bip: turun ke kanan bawah, menunjuk baris yang sedang dihitung ---
    const bxp = lerp(1560, 1736, eio((l - 0.4) / 1.6)), byp = lerp(BIPY, 846, eio((l - 0.4) / 1.6)) + Math.sin(t * 2.2) * 5;
    let opt = { t, pose: "diam", mood: "happy", shadow: false, wave: l + 3 };
    if (l > tKita - 0.2 && l < tSamp - 0.1) opt = { t, pose: "tunjuk", shadow: false, target: [r1[6].x + r1[6].w + 20, ROW1 - 30] };
    else if (l >= tSamp - 0.1 && l < tJaw) opt = { t, pose: "tunjuk", shadow: false, target: [r2[6].x + r2[6].w + 20, ROW2 - 30] };
    else if (l >= tJaw && l < tTet) opt = { t, pose: "diam", mood: "wow", shadow: false, look: [-1, -0.6] };
    else if (l >= tTet) opt = { t, pose: "diam", mood: "happy", shadow: false, wave: l - tDua };
    B.draw(ctx, bxp, byp, 140, opt);
  }

  K.SCENES.d04_b3 = function (ctx, b, l, t, TL) {
    if (b.id === "b3_1") return sceneB31(ctx, b, l, t);
    if (b.id === "b3_2") return sceneB32(ctx, b, l, t);
    return sceneB33(ctx, b, l, t, TL);
  };
  K.SCENES.d04_b3.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b3 = TL => {
    const b2 = TL.beats.find(x => x.id === "b3_2"), out = [
      K.sfxAt(TL, "b3_1", "pertama", 0.05, "pop", 0.45),          // "Algorithm E" disorot
      K.sfxAt(TL, "b3_1", "sudah", 0.3, "whoosh", 0.45),          // buku bergeser, titik waktu berjalan mundur
      K.sfxAt(TL, "b3_1", "dua ribu", 0.2, "shimmer", 0.5),       // kurung "lebih dari 2.000 tahun"
      K.sfxAt(TL, "b3_1", "yaitu", 0.0, "whoosh", 0.4),           // gulungan kuno terbuka
      K.sfxAt(TL, "b3_1", "FPB.", 0.0, "pop", 0.6),               // label FPB
      K.sfxAt(TL, "b3_2", "tali rafia.", -0.3, "whoosh", 0.45),   // ruas garis menjadi tali
      K.sfxAt(TL, "b3_2", "sembilan", 0.5, "pop", 0.45),          // 91 di catatan
      K.sfxAt(TL, "b3_2", "dua puluh satu", 0.5, "pop", 0.45),    // 21 di catatan
      K.sfxAt(TL, "b3_2", "memotong", -0.2, "shimmer", 0.4),      // gunting muncul
      K.sfxAt(TL, "b3_2", "FPB-nya.", 0.0, "shimmer", 0.6),       // FPB = 7
      K.sfxAt(TL, "b3_3", null, 0.6, "whoosh", 0.5),              // potongan terbang kembali
      K.sfxAt(TL, "b3_3", "membagi", 1.0, "pop", 0.5),            // = 4
      K.sfxAt(TL, "b3_3", "sampai", 0.0, "whoosh", 0.4),          // panah sisa turun
      K.sfxAt(TL, "b3_3", "nol.", 0.0, "pop", 0.55),              // sisa 0
      K.sfxAt(TL, "b3_3", "tujuh,", 0.0, "shimmer", 0.55),        // FPB = 7
      K.sfxAt(TL, "b3_3", "dua kali", 0.0, "pop", 0.5)];          // penghitung 2 disorot
    if (b2) plan(b2).tc.forEach(c => out.push(K.sfxAt(TL, "b3_2", null, c, "clack", 0.55)));   // enam potongan
    return out.filter(Boolean);
  };
})(typeof window !== "undefined" ? window : globalThis);
