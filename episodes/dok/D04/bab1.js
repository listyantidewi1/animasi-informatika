/* D04 bab 1: "Selembar kertas, dua belas bab" (b1_1–b1_2).
   Satu dunia yang bersambung: meja kerja Knuth di malam hari (lampu meja, tumpukan kertas, kacamata, pensil, rak buku dengan
   ruang kosong yang kelak berisi jilid 1, 2, 3, 4A, 4B ...). Knuth tidak pernah digambar: ia hadir lewat benda dan label nama.
   b1_1 kalender Januari 1962 (tahun muncul angka demi angka saat disebut), tanggal 10 dilingkari, kue dengan lilin angka 24;
        Bip mengantar amplop penerbit; surat "tulis buku tentang compiler"; panel penjelas compiler (perintah → penerjemah → bahasa mesin);
        selembar kertas bergaris terangkat ke depan layar, tangan tanpa ciri menulis 12 baris bernomor (penghitung 1→12, huruf ilustratif);
        kertas menua, masuk sampul plastik ("disimpan puluhan tahun"), lalu kembali ke meja.
   b1_2 kalender dibalik 1962→1965 (+1, +2, +3 tahun, jam dinding berputar); naskah menumpuk di lantai lebih tinggi dari Bip,
        penghitung halaman 0→3.000; amplop penerbit "!" dan Bip kaget; tumpukan dibungkus "1 buku" lalu terbelah menjadi tujuh jilid
        yang terbang ke rak (1–7), label "rencana: 7 jilid".
   Kamera sendiri (noCam) supaya gerak bersambung antarbeat. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const P = D.P, H = K.helpers, LT = KIT.latar, LP = LT.parts, B = KIT.bipkit;
  const { clamp, lerp, eio, eout, spring } = D;
  const TAU = Math.PI * 2, F = K.FONT;
  const at = (b, s, o = 0) => D.at(b, s, o), atE = (b, s, o = 0) => D.atEnd(b, s, o);
  const mkCam = (fx, fy, z) => ({ fx, fy, z, X: x => (x - fx) * z + 960, Y: y => (y - fy) * z + 540, S: (x, y) => [(x - fx) * z + 960, (y - fy) * z + 540],
    inv: (x, y) => [(x - 960) / z + fx, (y - 540) / z + fy], apply(c) { c.translate(960, 540); c.scale(z, z); c.translate(-fx, -fy); } });
  const camAt = (keys, l) => { const p = D.path(keys, l); return mkCam(p.x, p.y, p.z); };
  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const hh = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const pop = (u, k = 11, z = 0.5) => (u <= 0 ? 0 : lerp(0.55, 1, Math.min(1.06, spring(u, k, z))));

  // ---------- tata letak dunia ----------
  const DESK = { bx0: 205, bx1: 1365, by: 562, fx0: 160, fx1: 1410, fy: 630, bot: 792, floor: 878 };
  const CAL = { x: 510, y: 150, w: 340, h: 380 };
  const SHELF = { x0: 880, x1: 1420, y: 300 };
  const SLOT = k => ({ x: 925 + k * 62, y: 136, w: 56, h: 164 });
  const COVER = "#7A5AC8";                                                  // sampul "1 buku" (ungu)
  const BIP = { x: 1765, s: 200, y: 878 - 100 };
  const STK = { x0: 1440, x1: 1650, base: 878, H: 500 };
  const PAPER_DESK = [[650, 576], [790, 576], [808, 616], [632, 616]];   // TL, TR, BR, BL (dunia)
  const UP = { cx: 760, cy: 478, w: 580, h: 780, rot: -0.015 };           // kertas di depan layar (koordinat layar)
  const LINE_Y = i => 112 + i * 56;                                         // baris tulisan (lokal kertas)
  const JAN1 = { 1962: 1, 1963: 2, 1964: 3, 1965: 5 };                       // hari pertama Januari (0 = Minggu)
  const INK = "#2B3A8C", CREAM = "#FFF8EC";

  // ---------- coretan tulisan tangan ilustratif (bukan huruf asli) ----------
  const SQ = Array.from({ length: 12 }, (_, i) => {
    const r = D.rng(101 + i * 37), pts = []; let x = 132; const maxX = 132 + 230 + r() * 190;
    while (x < maxX - 30) {
      const ww = 46 + r() * 92, n = Math.max(6, Math.floor(ww / 2.4)); const amps = Array.from({ length: 12 }, () => (r() < 0.16 ? 26 : 12 + r() * 4));
      for (let j = 0; j <= n; j++) { const s = j * 0.62, px = x + j * 2.4 + 5 * Math.cos(s), py = -(amps[Math.floor(s / TAU) % 12] / 2) * (1 - Math.cos(s)); pts.push([px, py, j === 0]); }
      x += ww + 20;
    }
    return pts;
  });

  // ---------- label layar dengan garis penunjuk (sesudah vignette) ----------
  function tag(s, x, y, u, o = {}) {
    if (u <= 0) return; const a = clamp(u / 0.18) * (o.a == null ? 1 : o.a); if (a <= 0.01) return;
    D.post(c => {
      c.globalAlpha = a; const col = o.col || P.amber;
      if (o.to) { const p = clamp(u / 0.4), [tx, ty] = o.to, [sx, sy] = o.from ? [x + o.from[0], y + o.from[1]] : [x, y], ex = lerp(sx, tx, eout(p)), ey = lerp(sy, ty, eout(p));
        c.strokeStyle = "rgba(10,18,52,0.55)"; c.lineWidth = 10; c.lineCap = "round"; c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex, ey); c.stroke();
        c.strokeStyle = col; c.lineWidth = 5; c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex, ey); c.stroke();
        if (p > 0.85) { c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(tx, ty, 12, 0, TAU); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(tx, ty, 7.5, 0, TAU); c.fill(); } }
      const k = pop(u, 12, 0.5); c.translate(x, y); c.scale(k, k);
      D.label(c, s, 0, 0, { size: o.size || 48, col });
    });
  }
  function arrow(c, x0, y0, x1, y1, col, lw = 8) {
    const a = Math.atan2(y1 - y0, x1 - x0), hl = lw * 3.2;
    c.lineCap = "round"; c.strokeStyle = col; c.lineWidth = lw; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - Math.cos(a) * hl * 0.6, y1 - Math.sin(a) * hl * 0.6); c.stroke();
    c.fillStyle = col; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - Math.cos(a - 0.5) * hl, y1 - Math.sin(a - 0.5) * hl); c.lineTo(x1 - Math.cos(a + 0.5) * hl, y1 - Math.sin(a + 0.5) * hl); c.closePath(); c.fill();
  }

  // =====================================================================================
  // ruang kerja malam
  // =====================================================================================
  function room(ctx, t, o = {}) {
    // dinding sama dengan bab 0: gradasi #2A3A7C → #3D509A, garis tegak tipis + titik
    let gr = ctx.createLinearGradient(0, -100, 0, 720); gr.addColorStop(0, "#2A3A7C"); gr.addColorStop(1, "#3D509A");
    ctx.fillStyle = gr; ctx.fillRect(-400, -300, 2720, 1020);
    ctx.fillStyle = "rgba(255,255,255,0.035)"; for (let x = -400; x < 2320; x += 64) ctx.fillRect(x, -300, 3, 1020);
    ctx.fillStyle = "rgba(255,255,255,0.05)"; for (let x = -368; x < 2320; x += 64) for (let y = -280; y < 700; y += 64) { ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); }
    gr = ctx.createLinearGradient(0, 720, 0, 1100); gr.addColorStop(0, "#4B4488"); gr.addColorStop(1, "#302B68");
    ctx.fillStyle = gr; ctx.fillRect(-400, 720, 2720, 700);
    ctx.strokeStyle = "rgba(20,16,60,0.28)"; ctx.lineWidth = 3; [768, 826, 900, 990].forEach(y => { ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(2320, y); ctx.stroke(); });
    ctx.fillStyle = "#34468F"; ctx.fillRect(-400, 702, 2720, 22); ctx.fillStyle = "rgba(255,255,255,0.14)"; ctx.fillRect(-400, 702, 2720, 3);
    // karpet kecil di tempat Bip berdiri
    LP.glowE(ctx, 1640, 905, 330, 46, "#6F5BC8", 0.5, "source-over");
    // cahaya lampu meja di dinding
    LP.warmPool(ctx, 620, 500, 680, 0.62, 0.85);
    // jendela malam
    LP.windowFrame(ctx, 70, 186, 250, 250, t, "#8C6B58", () => LP.nightView(ctx, 70, 186, 250, 250, t, 0));
    // jam dinding (berputar cepat saat "tiga tahun kemudian")
    LP.clock(ctx, 424, 210, 50, t, o.jam == null ? 23 : o.jam);
  }

  // ---------- kalender dinding ----------
  function calPage(ctx, year, o) {
    const { x, y, w, h } = CAL;
    ctx.fillStyle = o.back ? "#E6DAC4" : CREAM; H.rr(ctx, x, y, w, h, 12); ctx.fill();
    if (o.back) { ctx.strokeStyle = "rgba(120,90,60,0.25)"; ctx.lineWidth = 2; ctx.stroke(); return; }
    // tahun (angka demi angka)
    const s = String(year), du = o.du || [9, 9, 9, 9], ta = o.ta == null ? 1 : o.ta;
    ctx.font = `900 76px ${F}`; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    for (let i = 0; i < 4; i++) { const u = du[i]; if (u <= 0 || ta <= 0) continue; ctx.save(); ctx.globalAlpha *= clamp(u / 0.15) * ta;
      ctx.fillStyle = INK; ctx.fillText(s[i], x + w / 2 + (i - 1.5) * 55, y + 112 - 34 * (1 - eout(clamp(u / 0.3)))); ctx.restore(); }
    // pita bulan
    const mu = o.mu == null ? 1 : o.mu;
    if (mu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x, y + 128, 16 + (w - 32) * eio(mu), 64); ctx.clip();
      ctx.fillStyle = "#E5484D"; H.rr(ctx, x + 16, y + 132, w - 32, 54, 10); ctx.fill();
      if (ta > 0) { ctx.globalAlpha *= ta; H.text(ctx, "JANUARI", x + w / 2, y + 175, 44, { align: "center", weight: 900, color: "#FFFFFF" }); } ctx.restore(); }
    // kotak tanggal: angka hanya terbaca saat kamera dekat; dari jauh berupa titik
    const gy = y + 198, cw = (w - 24) / 7, ch = 30, off = JAN1[year] == null ? 1 : JAN1[year], na = (o.na || 0) * ta, ga = o.ga == null ? 1 : o.ga;
    for (let d = 1; d <= 31; d++) { const idx = off + d - 1, col = idx % 7, row = Math.floor(idx / 7), cx = x + 12 + cw * (col + 0.5), cy = gy + row * ch;
      if (na < 1) { ctx.fillStyle = col === 0 ? D.hexA("#E5484D", 0.55 * ga * (1 - na)) : D.hexA(INK, 0.28 * ga * (1 - na)); H.rr(ctx, cx - 11, cy + 9, 22, 8, 4); ctx.fill(); }
      if (na > 0) { ctx.save(); ctx.globalAlpha *= na * ga; H.text(ctx, String(d), cx, cy + 24, 28, { align: "center", weight: 700, color: col === 0 ? "#E5484D" : INK }); ctx.restore(); } }
    // tanggal 10 dilingkari (1962)
    if (year === 1962 && (o.circ || 0) > 0) { const idx = off + 9, cx = x + 12 + cw * (idx % 7 + 0.5), cy = gy + Math.floor(idx / 7) * ch + 14;
      ctx.save(); ctx.fillStyle = D.hexA("#E5484D", 0.16 * clamp(o.circ * 2)); ctx.beginPath(); ctx.ellipse(cx, cy, 22, 14, -0.08, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#E5484D"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(cx, cy, 23, 15, -0.08, -2.2, -2.2 + TAU * 1.08 * eio(o.circ)); ctx.stroke(); ctx.restore(); }
  }
  function calendar(ctx, st) {
    const { x, y, w, h } = CAL;
    ctx.strokeStyle = "#1F2A66"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 40, y + 6); ctx.lineTo(x + w / 2, y - 22); ctx.lineTo(x + w - 40, y + 6); ctx.stroke();
    ctx.fillStyle = "#C9B79A"; ctx.beginPath(); ctx.arc(x + w / 2, y - 22, 7, 0, TAU); ctx.fill();
    ctx.save(); ctx.shadowColor = "rgba(10,14,50,0.4)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12; ctx.fillStyle = "#E9DEC9"; H.rr(ctx, x + 4, y + 6, w, h, 12); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#EFE5D2"; H.rr(ctx, x + 2, y + 3, w, h, 12); ctx.fill();
    const flying = st.flip && st.flip.u > 0 && st.flip.u < 1, sc = flying ? Math.cos(Math.PI * eio(st.flip.u)) : -1, hide = st.hide || 0;
    calPage(ctx, st.base, Object.assign({}, st, { ta: (flying ? clamp((0.4 - sc) / 0.2) : 1) * (1 - hide) }));
    if (flying) {
      const py = y + 28;
      ctx.save(); ctx.translate(0, py); ctx.scale(1, sc); ctx.translate(0, -py);
      if (sc >= 0) { calPage(ctx, st.flip.year, { na: st.na, ga: st.ga, ta: clamp((sc - 0.45) / 0.2) }); ctx.fillStyle = `rgba(20,24,60,${0.35 * (1 - sc)})`; H.rr(ctx, x, y, w, h, 12); ctx.fill(); }
      else { ctx.globalAlpha *= 1 - clamp((st.flip.u - 0.55) / 0.4); calPage(ctx, st.flip.year, { back: true }); }
      ctx.restore();
    }
    ctx.fillStyle = INK; H.rr(ctx, x, y, w, 30, 10); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(x + 8, y + 4, w - 16, 3);
    [x + 70, x + w - 70].forEach(rx => { ctx.strokeStyle = "#C9CEE8"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(rx, y + 14, 11, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); });
  }

  // ---------- rak buku (ruang kosong untuk jilid-jilid) ----------
  // tempat jilid yang belum ditulis: kotak putus-putus hangat yang berdenyut + angka hangat (sama dengan bab 0)
  function slot(ctx, x, y, w, h, k, t, o = {}) {
    const a = o.a == null ? 1 : o.a; if (a <= 0.01) return;
    const pulse = 0.6 + 0.4 * Math.sin(t * 2.2 + k);
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = D.hexA(P.warm, 0.1 + 0.08 * pulse); H.rr(ctx, x, y, w, h, 8); ctx.fill();
    ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 14; ctx.strokeStyle = D.hexA(P.warm, 0.75 + 0.25 * pulse); ctx.lineWidth = 4; H.rr(ctx, x + 2, y + 2, w - 4, h - 4, 8); ctx.stroke(); ctx.setLineDash([]);
    addLight(ctx, x + w / 2, y + h / 2, 90, P.warm, 0.18 * pulse);
    if ((o.num || 0) > 0) { ctx.globalAlpha *= clamp(o.num * 2); const k2 = pop(o.num * 0.6, 12, 0.5);
      ctx.save(); ctx.translate(x + w / 2, y + h * 0.5); ctx.scale(k2, k2); H.text(ctx, String(k + 1), 0, 16, 44, { align: "center", weight: 900, color: P.warm }); ctx.restore(); }
    ctx.restore();
  }
  function shelf(ctx, t) {
    const { x0, x1, y } = SHELF;
    ctx.fillStyle = "#6B4632"; [x0 + 50, x1 - 50].forEach(bx => { ctx.beginPath(); ctx.moveTo(bx - 8, y + 18); ctx.lineTo(bx + 8, y + 18); ctx.lineTo(bx + 8, y + 70); ctx.lineTo(bx - 34, y + 18); ctx.closePath(); ctx.fill(); });
    LP.glowE(ctx, (x0 + x1) / 2, y + 30, 300, 26, "#0B1236", 0.3, "source-over");
    ctx.fillStyle = "#8A5A3C"; H.rr(ctx, x0, y, x1 - x0, 24, 5); ctx.fill(); ctx.fillStyle = "#A8714C"; ctx.fillRect(x0 + 4, y, x1 - x0 - 8, 5);
    ctx.fillStyle = "rgba(10,10,30,0.25)"; ctx.fillRect(x0 + 6, y + 24, x1 - x0 - 12, 8);
    // penyangga buku di kedua ujung ruang kosong
    [[905, 1], [1371, -1]].forEach(([bx, d]) => { ctx.fillStyle = "#7C8BC9"; ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx + d * 18, y); ctx.lineTo(bx + d * 18, y - 70); ctx.lineTo(bx, y - 92); ctx.closePath(); ctx.fill(); });
    // pot kecil di ujung kanan
    ctx.fillStyle = "#E0835A"; ctx.beginPath(); ctx.moveTo(1376, y); ctx.lineTo(1412, y); ctx.lineTo(1418, y - 38); ctx.lineTo(1370, y - 38); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#3FAF8A"; for (let i = 0; i < 4; i++) { const a = -1.9 + i * 0.4 + 0.05 * Math.sin(t * 1.2 + i); ctx.save(); ctx.translate(1394, y - 38); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(28, 0, 30, 10, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  }

  // ---------- meja dan lampu ----------
  function desk(ctx) {
    const d = DESK;
    LP.glowE(ctx, 785, d.floor, 760, 42, "#0B1236", 0.5, "source-over");
    ctx.fillStyle = "#6A4230"; H.rr(ctx, d.fx0 + 30, d.bot - 10, 36, d.floor - d.bot + 10, 6); ctx.fill(); H.rr(ctx, d.fx1 - 66, d.bot - 10, 36, d.floor - d.bot + 10, 6); ctx.fill();
    let gr = ctx.createLinearGradient(0, d.fy, 0, d.bot); gr.addColorStop(0, "#9A6646"); gr.addColorStop(1, "#7D4F37");
    ctx.fillStyle = gr; ctx.fillRect(d.fx0, d.fy, d.fx1 - d.fx0, d.bot - d.fy);
    [[d.fx0 + 40, 330], [d.fx1 - 370, 330]].forEach(([dx, dw]) => { ctx.fillStyle = "#8A5A40"; H.rr(ctx, dx, d.fy + 34, dw, 104, 10); ctx.fill();
      ctx.strokeStyle = "rgba(255,220,180,0.18)"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "#E3C48F"; H.rr(ctx, dx + dw / 2 - 30, d.fy + 78, 60, 14, 7); ctx.fill(); });
    gr = ctx.createLinearGradient(0, d.by, 0, d.fy); gr.addColorStop(0, "#B07A55"); gr.addColorStop(1, "#C98F65");
    ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(d.bx0, d.by); ctx.lineTo(d.bx1, d.by); ctx.lineTo(d.fx1, d.fy); ctx.lineTo(d.fx0, d.fy); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#DDA67B"; ctx.fillRect(d.fx0, d.fy - 2, d.fx1 - d.fx0, 16); ctx.fillStyle = "rgba(255,240,210,0.35)"; ctx.fillRect(d.fx0, d.fy - 2, d.fx1 - d.fx0, 3);
    // cahaya lampu di permukaan meja
    LP.warmPool(ctx, 700, 600, 360, 0.7, 0.2);
  }
  function addLight(ctx, x, y, r, col, a) {
    if (a <= 0.01 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = "screen";
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, D.hexA(col, a)); gr.addColorStop(0.4, D.hexA(col, a * 0.42)); gr.addColorStop(1, D.hexA(col, 0));
    ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  }
  // lampu meja dengan warna bab 0 (badan biru, sendi amber, kap biru dengan mulut menyala)
  function lamp(ctx, t) {
    const bx = 362, by = 604, j1 = [300, 476], hd = [432, 452], ang = Math.atan2(598 - 452, 720 - 432) - Math.PI / 2;
    LP.glowE(ctx, 712, 598, 330, 62, "#FFC46A", 0.5 + 0.03 * Math.sin(t * 2.1));
    ctx.save();
    ctx.fillStyle = "rgba(20,10,10,0.35)"; ctx.beginPath(); ctx.ellipse(bx + 8, by + 8, 66, 15, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2C3570"; ctx.beginPath(); ctx.ellipse(bx, by, 58, 16, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#3C478E"; ctx.beginPath(); ctx.ellipse(bx, by - 8, 52, 12, 0, 0, TAU); ctx.fill();
    ctx.lineCap = "round"; ctx.strokeStyle = "#46529E"; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(bx, by - 12); ctx.lineTo(j1[0], j1[1]); ctx.lineTo(hd[0], hd[1]); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx - 4, by - 14); ctx.lineTo(j1[0] - 4, j1[1]); ctx.lineTo(hd[0] - 2, hd[1] - 5); ctx.stroke();
    ctx.fillStyle = "#FFB547"; [[bx, by - 12], j1, hd].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.fill(); });
    ctx.translate(hd[0], hd[1]); ctx.rotate(ang);
    const sg = ctx.createLinearGradient(-60, 0, 60, 0); sg.addColorStop(0, "#38428A"); sg.addColorStop(0.5, "#5562B4"); sg.addColorStop(1, "#38428A");
    ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(-30, -12); ctx.lineTo(30, -12); ctx.lineTo(62, 80); ctx.lineTo(-62, 80); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2E3778"; ctx.beginPath(); ctx.ellipse(0, -12, 30, 8, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#FFECBE"; ctx.beginPath(); ctx.ellipse(0, 80, 62, 13, 0, 0, TAU); ctx.fill();
    ctx.restore();
    const [lx, ly] = [hd[0] + Math.cos(ang + Math.PI / 2) * 86, hd[1] + Math.sin(ang + Math.PI / 2) * 86];
    addLight(ctx, lx, ly, 110, "#FFF2C8", 0.8); addLight(ctx, lx + 40, ly + 50, 280, "#FFC66E", 0.38);
  }
  // ---------- benda di meja ----------
  function paperStack(ctx, cx, base, w, hgt, seed) {
    for (let i = 0; i < hgt / 5; i++) { const y = base - i * 5, dx = (hh(seed + i) - 0.5) * 10; ctx.fillStyle = i % 2 ? "#F2E7D2" : "#FFF8EA"; ctx.fillRect(cx - w / 2 + dx, y - 5, w, 5); }
    ctx.fillStyle = "#FFFDF6"; ctx.beginPath(); ctx.moveTo(cx - w / 2 + 6, base - hgt - 4); ctx.lineTo(cx + w / 2 + 6, base - hgt - 4); ctx.lineTo(cx + w / 2, base - hgt + 2); ctx.lineTo(cx - w / 2, base - hgt + 2); ctx.closePath(); ctx.fill();
  }
  function glasses(ctx, x, y) {
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = "#1E2A5C"; ctx.lineWidth = 5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-50, -14); ctx.lineTo(-62, 2); ctx.moveTo(50, -14); ctx.lineTo(62, 2); ctx.stroke();
    [-24, 24].forEach(dx => { ctx.fillStyle = "rgba(190,220,255,0.35)"; ctx.beginPath(); ctx.ellipse(dx, -14, 21, 15, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(dx - 4, -17, 9, 3.6, 4.4); ctx.stroke(); ctx.strokeStyle = "#1E2A5C"; ctx.lineWidth = 5; });
    ctx.beginPath(); ctx.moveTo(-4, -18); ctx.quadraticCurveTo(0, -24, 4, -18); ctx.stroke(); ctx.restore();
  }
  function pencilCup(ctx, x, y) {
    [[-14, -0.25, "#FFB547"], [4, 0.08, "#FF6F91"], [16, 0.3, "#5BD68A"]].forEach(([dx, a, c]) => { ctx.save(); ctx.translate(x + dx, y - 50); ctx.rotate(a);
      ctx.fillStyle = c; ctx.fillRect(-5, -54, 10, 60); ctx.fillStyle = "#F6D9B5"; ctx.beginPath(); ctx.moveTo(-5, -54); ctx.lineTo(5, -54); ctx.lineTo(0, -68); ctx.closePath(); ctx.fill(); ctx.restore(); });
    ctx.fillStyle = "#4C7FD6"; H.rr(ctx, x - 30, y - 62, 60, 62, 8); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.fillRect(x - 22, y - 56, 8, 48);
  }
  function deskPencil(ctx, x0, y0, x1, y1) {
    ctx.save(); ctx.lineCap = "butt"; ctx.strokeStyle = "#FFC94A"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    const a = Math.atan2(y1 - y0, x1 - x0); ctx.translate(x1, y1); ctx.rotate(a); ctx.fillStyle = "#F6D9B5"; ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(16, 0); ctx.lineTo(0, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2B2440"; ctx.beginPath(); ctx.moveTo(10, -2); ctx.lineTo(16, 0); ctx.lineTo(10, 2); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function cupcake(ctx, cx, base, u, t, a = 1) {
    if (u <= 0 || a <= 0) return; const k = pop(u, 10, 0.45);
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, base); ctx.scale(k, k);
    D.glow(ctx, 0, -96, 120, P.warm, 0.35 * clamp(u / 0.6));
    ctx.fillStyle = "#FF8FB1"; ctx.beginPath(); ctx.moveTo(-44, -50); ctx.lineTo(44, -50); ctx.lineTo(33, 0); ctx.lineTo(-33, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(160,40,90,0.35)"; ctx.lineWidth = 3; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * 12, -50); ctx.lineTo(i * 9, 0); ctx.stroke(); }
    ctx.fillStyle = "#FFF1DD"; ctx.beginPath(); ctx.ellipse(0, -54, 52, 18, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -66, 38, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#FF6F91"; ctx.beginPath(); ctx.arc(14, -78, 8, 0, TAU); ctx.fill();
    // lilin angka 2 dan 4
    [["2", -20, "#7FD3FF"], ["4", 22, "#FFD38A"]].forEach(([s, dx, c], j) => {
      ctx.font = `900 52px ${F}`; ctx.textAlign = "center"; ctx.lineWidth = 8; ctx.strokeStyle = "#FFFFFF"; ctx.lineJoin = "round"; ctx.strokeText(s, dx, -66); H.text(ctx, s, dx, -66, 52, { align: "center", weight: 900, color: c });
      const fl = clamp((u - 0.25) / 0.3), fx = dx + 2 * Math.sin(t * 9 + j), fy = -130;
      ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(dx, -108); ctx.lineTo(dx, -114); ctx.stroke();
      if (fl > 0) { D.glow(ctx, fx, fy, 40, P.amber, 0.7 * fl); ctx.fillStyle = "#FFB547"; ctx.beginPath(); ctx.ellipse(fx, fy, 10 * fl, 20 * fl, 0.08 * Math.sin(t * 11 + j), 0, TAU); ctx.fill();
        ctx.fillStyle = "#FFF4C8"; ctx.beginPath(); ctx.ellipse(fx, fy + 5, 5 * fl, 10 * fl, 0, 0, TAU); ctx.fill(); }
    });
    ctx.restore();
  }
  function envelope(ctx, x, y, w, h, o = {}) {   // (x, y) = tengah bawah; flat 0..1 = rebah di meja
    const fl = o.flat || 0, sy = lerp(1, 0.3, fl);
    ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(1, sy);
    ctx.fillStyle = "rgba(10,14,50,0.25)"; H.rr(ctx, -w / 2 + 6, -h + 8, w, h, 8); ctx.fill();
    ctx.fillStyle = "#F6E7C8"; H.rr(ctx, -w / 2, -h, w, h, 8); ctx.fill();
    ctx.strokeStyle = "#D9C29A"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w / 2 + 4, -h + 4); ctx.lineTo(0, -h * 0.42); ctx.lineTo(w / 2 - 4, -h + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-w / 2 + 4, -4); ctx.lineTo(-w * 0.12, -h * 0.48); ctx.moveTo(w / 2 - 4, -4); ctx.lineTo(w * 0.12, -h * 0.48); ctx.stroke();
    // perangko generik
    ctx.fillStyle = "#E5484D"; H.rr(ctx, w / 2 - w * 0.24, -h + h * 0.1, w * 0.17, h * 0.28, 3); ctx.fill(); ctx.fillStyle = "#FFE3A8"; ctx.beginPath(); ctx.arc(w / 2 - w * 0.155, -h + h * 0.24, h * 0.07, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // ---------- kertas bergaris: isi (koordinat lokal kertas 580 × 780) ----------
  function paperContent(ctx, w, h, st) {
    const age = st.age || 0;
    ctx.strokeStyle = "rgba(229,72,77,0.55)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(112, 0); ctx.lineTo(112, h); ctx.stroke();
    ctx.strokeStyle = "rgba(80,130,220,0.38)"; ctx.lineWidth = 2; for (let i = 0; i < 12; i++) { const y = LINE_Y(i) + 8; ctx.beginPath(); ctx.moveTo(18, y); ctx.lineTo(w - 18, y); ctx.stroke(); }
    const lines = st.lines || [];
    for (let i = 0; i < 12; i++) { const L = lines[i]; if (!L) continue; const y = LINE_Y(i);
      if (L.num > 0) { ctx.save(); ctx.globalAlpha *= clamp(L.num); ctx.translate(98, y); ctx.transform(1, 0, -0.16, 1, 0, 0);
        ctx.font = `italic 700 44px ${F}`; ctx.textAlign = "right"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = INK; ctx.fillText(`${i + 1}.`, 0, 0); ctx.restore(); }
      if (L.f > 0) { const pts = SQ[i], n = Math.floor(clamp(L.f) * pts.length); ctx.strokeStyle = INK; ctx.lineWidth = 4.2; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath();
        for (let j = 0; j < n; j++) { const [px, py, pen] = pts[j]; if (pen) ctx.moveTo(px, y + py); else ctx.lineTo(px, y + py); } ctx.stroke(); }
    }
    if (age > 0) {
      ctx.fillStyle = `rgba(214,168,88,${0.32 * age})`; ctx.fillRect(0, 0, w, h);
      const gr = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.68); gr.addColorStop(0, "rgba(150,100,40,0)"); gr.addColorStop(1, `rgba(150,100,40,${0.38 * age})`); ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h);
      for (let k = 0; k < 9; k++) { ctx.fillStyle = `rgba(160,110,50,${0.18 * age})`; ctx.beginPath(); ctx.arc(hh(k + 3) * w, hh(k + 40) * h, 6 + hh(k + 70) * 14, 0, TAU); ctx.fill(); }
      ctx.strokeStyle = `rgba(140,100,50,${0.4 * age})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0, h * 0.5); ctx.lineTo(w, h * 0.5 + 4); ctx.moveTo(w * 0.5, 0); ctx.lineTo(w * 0.5 - 3, h); ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${0.35 * age})`; ctx.beginPath(); ctx.moveTo(0, h * 0.5 + 3); ctx.lineTo(w, h * 0.5 + 7); ctx.stroke();
    }
    if ((st.stamp || 0) > 0) { const k = pop(st.stamp, 12, 0.45); ctx.save(); ctx.globalAlpha *= clamp(st.stamp / 0.2) * 0.9; ctx.translate(w - 100, 50); ctx.rotate(-0.12); ctx.scale(k, k);
      ctx.strokeStyle = "#D2353B"; ctx.lineWidth = 4; H.rr(ctx, -82, -34, 164, 64, 10); ctx.stroke(); H.text(ctx, "1962", 0, 16, 46, { align: "center", weight: 900, color: "#D2353B" }); ctx.restore(); }
  }
  function paperFill(age) { return age > 0 ? `rgb(${Math.round(lerp(255, 238, age))},${Math.round(lerp(250, 222, age))},${Math.round(lerp(238, 176, age))})` : "#FFFAEE"; }
  // kertas sebagai segi empat bebas (sudut TL, TR, BR, BL di layar); isi digambar dengan transformasi afin dari TL/TR/BL
  function paperQuad(ctx, q, st, contentA) {
    ctx.save(); ctx.shadowColor = "rgba(8,10,40,0.45)"; ctx.shadowBlur = 40 * (st.lift || 0); ctx.shadowOffsetY = 18 * (st.lift || 0);
    ctx.fillStyle = paperFill(st.age || 0); ctx.beginPath(); q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.restore();
    if (contentA > 0.01) { const [TL, TR, , BL] = q, sc = Math.hypot(TR[0] - TL[0], TR[1] - TL[1]) / UP.w;
      ctx.save(); ctx.globalAlpha *= contentA; ctx.beginPath(); q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip();
      ctx.transform((TR[0] - TL[0]) / UP.w, (TR[1] - TL[1]) / UP.w, (BL[0] - TL[0]) / UP.h, (BL[1] - TL[1]) / UP.h, TL[0], TL[1]);
      // kertas kecil (di meja / sedang terbang): isi digambar sebagai gambar, bukan teks yang perlu dibaca
      if (sc < 0.97 && typeof document !== "undefined") { OFF = OFF || Object.assign(document.createElement("canvas"), { width: UP.w, height: UP.h }); const o = OFF.getContext("2d");
        o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, UP.w, UP.h); paperContent(o, UP.w, UP.h, st); ctx.drawImage(OFF, 0, 0); }
      else paperContent(ctx, UP.w, UP.h, st);
      ctx.restore(); }
    if ((st.sleeve || 0) > 0) { const s = st.sleeve, [TL, TR, BR, BL] = q; ctx.save(); ctx.globalAlpha *= clamp(s * 1.5);
      const dy = -(1 - eout(s)) * (BL[1] - TL[1]) * 0.9;
      ctx.beginPath(); [TL, TR, BR, BL].forEach(([x, y], i) => { const e = i < 2 ? -10 : 10; (i ? ctx.lineTo : ctx.moveTo).call(ctx, x + (i === 0 || i === 3 ? -10 : 10), y + dy + e); }); ctx.closePath();
      ctx.fillStyle = "rgba(200,232,255,0.13)"; ctx.fill(); ctx.strokeStyle = "rgba(220,242,255,0.75)"; ctx.lineWidth = 3; ctx.stroke(); ctx.clip();
      const gx = lerp(TL[0] - 300, TR[0] + 300, (s * 1.3) % 1); ctx.fillStyle = "rgba(255,255,255,0.16)"; ctx.beginPath(); ctx.moveTo(gx, TL[1] + dy - 20); ctx.lineTo(gx + 120, TL[1] + dy - 20); ctx.lineTo(gx - 160, BL[1] + dy + 20); ctx.lineTo(gx - 280, BL[1] + dy + 20); ctx.closePath(); ctx.fill();
      ctx.restore(); }
  }
  let OFF = null;
  const ALL_LINES = Array.from({ length: 12 }, () => ({ num: 1, f: 1 }));
  function upQuad() { const c = Math.cos(UP.rot), s = Math.sin(UP.rot); return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => { const x = a * UP.w / 2, y = b * UP.h / 2; return [UP.cx + x * c - y * s, UP.cy + x * s + y * c]; }); }
  function upMap(lx, ly) { const c = Math.cos(UP.rot), s = Math.sin(UP.rot), x = lx - UP.w / 2, y = ly - UP.h / 2; return [UP.cx + x * c - y * s, UP.cy + x * s + y * c]; }

  // ---------- tangan tanpa ciri memegang pensil (ujung pensil di (x, y)) ----------
  function hand(ctx, x, y, t, sc = 1.15) {
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.fillStyle = "rgba(10,14,50,0.22)"; ctx.beginPath(); ctx.ellipse(100, 40, 110, 60, -0.5, 0, TAU); ctx.fill();
    // lengan baju
    ctx.save(); ctx.rotate(0.62); ctx.fillStyle = "#5B6CC7"; H.rr(ctx, 120, -46, 330, 100, 40); ctx.fill(); ctx.fillStyle = "#4757AE"; H.rr(ctx, 112, -50, 46, 108, 18); ctx.fill(); ctx.restore();
    // pensil
    ctx.save(); ctx.rotate(-0.92);
    ctx.fillStyle = "#FFC94A"; ctx.fillRect(18, -7, 140, 14); ctx.fillStyle = "#E8A93A"; ctx.fillRect(18, 2, 140, 5);
    ctx.fillStyle = "#C9CED8"; ctx.fillRect(158, -7, 16, 14); ctx.fillStyle = "#FF8FB1"; H.rr(ctx, 172, -7, 20, 14, 5); ctx.fill();
    ctx.fillStyle = "#F6D9B5"; ctx.beginPath(); ctx.moveTo(18, -7); ctx.lineTo(18, 7); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2B2440"; ctx.beginPath(); ctx.moveTo(6, -2.4); ctx.lineTo(6, 2.4); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.restore();
    // telapak dan jari (warna kulit netral, tanpa cincin/jam)
    const sk = "#E9B894", sd = "#C98F6C";
    ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(92, 6, 66, 50, -0.45, 0, TAU); ctx.fill();
    ctx.fillStyle = sd; ctx.beginPath(); ctx.ellipse(110, 30, 50, 26, -0.45, 0, Math.PI); ctx.fill();
    ctx.lineCap = "round"; ctx.strokeStyle = sk; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(70, -6); ctx.quadraticCurveTo(40, -30, 26, -30); ctx.stroke();   // telunjuk
    ctx.lineWidth = 21; ctx.beginPath(); ctx.moveTo(62, 22); ctx.quadraticCurveTo(36, 8, 24, -14); ctx.stroke();                                               // jari tengah
    ctx.strokeStyle = sd; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(34, -18); ctx.quadraticCurveTo(46, -12, 58, -2); ctx.stroke();
    ctx.strokeStyle = sk; ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(60, -40); ctx.quadraticCurveTo(44, -52, 34, -44); ctx.stroke();                      // ibu jari
    ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.beginPath(); ctx.ellipse(78, -12, 22, 9, -0.5, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // ---------- tumpukan naskah (b1_2) ----------
  function pageFace(ctx, x0, x1, yTop, yBot, seed, tint, tintA) {
    for (let y = yBot, i = 0; y > yTop + 0.5; y -= 5, i++) { const blk = Math.floor(i / 8), dx = (hh(seed + blk * 3.1) - 0.5) * 12, hgt = Math.min(5, y - yTop);
      ctx.fillStyle = i % 2 ? "#EFE3CC" : "#FFF8EA"; ctx.fillRect(x0 + dx, y - hgt, x1 - x0, hgt); }
    ctx.fillStyle = "rgba(110,80,50,0.18)"; ctx.fillRect(x1 - 18, yTop, 18, yBot - yTop);
    if (tintA > 0) { ctx.fillStyle = D.hexA(tint, tintA); ctx.fillRect(x0 - 6, yTop, x1 - x0 + 12, yBot - yTop); }
  }
  function pageTop(ctx, x0, x1, y, a = 1) {
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = "#FFFDF6"; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.lineTo(x1 + 26, y - 18); ctx.lineTo(x0 + 26, y - 18); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(43,58,140,0.55)"; ctx.lineWidth = 2.5; for (let i = 0; i < 3; i++) { const yy = y - 5 - i * 5; ctx.beginPath(); for (let x = x0 + 20 + i * 4; x < x1 - 10; x += 4) { const py = yy - 1.6 * Math.sin(x * 0.45 + i); x === x0 + 20 + i * 4 ? ctx.moveTo(x, py) : ctx.lineTo(x, py); } ctx.stroke(); }
    ctx.restore();
  }

  // =====================================================================================
  // b1_1
  // =====================================================================================
  function scene11(ctx, b, l, t) {
    const T = { jan: at(b, "Januari"), d0: at(b, "seribu"), d1: at(b, "sembilan"), d2: at(b, "enam puluh"), d3: at(b, "dua,"), ultah: at(b, "ulang tahunnya"),
      empat: at(b, "empat,"), knuth: at(b, "Knuth"), mhs: at(b, "mahasiswa"), diminta: at(b, "diminta"), penerbit: at(b, "penerbit"), buku: at(b, "menulis buku"),
      tentang: at(b, "tentang compiler"), comp: at(b, "compiler,"), yaitu: at(b, "yaitu"), penerj: at(b, "penerjemah"), untuk: at(b, "untuk komputer"),
      hari: at(b, "Hari itu juga"), tulis: at(b, "ia menulis judul"), duabelas: at(b, "dua belas bab"), selembar: at(b, "selembar kertas"), masih: at(b, "masih ia simpan"),
      simpan: at(b, "simpan"), puluhan: at(b, "puluhan tahun"), end: D.speechEnd(b) };
    // kamera: dekat ke kalender + kue, mundur ke meja penuh, lalu dorong pelan
    const pull0 = T.empat + 0.45, pull1 = pull0 + 1.6, back0 = T.end - 0.25, back1 = back0 + 0.9;
    const cm = camAt([[0, 720, 420, 1.6], [pull0, 704, 424, 1.66], [pull1, 960, 540, 1.0], [T.hari, 975, 532, 1.03], [back0, 985, 528, 1.05], [back1, 960, 540, 1.0], [b.dur + 2, 960, 540, 1.0]], l);
    // jadwal tulisan
    const W0 = T.hari + 0.72, GAP = [0.38, 0.3, 0.24, 0.2, 0.17, 0.15, 0.14, 0.13, 0.13, 0.13, 0.13, 0.24];   // baris 12 dimulai ±"bab"
    const S0 = GAP.reduce((a, g) => (a.push(a[a.length - 1] + g), a), [W0]), W1 = S0[12];                // W1 = tulisan selesai
    const lineSt = i => { const s0 = S0[i], d = S0[i + 1] - s0; return { s0, num: clamp((l - s0) / 0.06), f: clamp((l - s0 - 0.04) / (d - 0.05)) }; };
    const lines = Array.from({ length: 12 }, (_, i) => lineSt(i)), nDone = lines.filter(x => x.num > 0).length;
    const lift = eio((l - T.hari - 0.05) / 0.9), ret = eio((l - back0) / 0.9), up = lift * (1 - ret);
    const age = eio((l - Math.max(T.masih, W1 + 0.9)) / 1.4), sleeve = clamp((l - T.simpan + 0.05) / 0.7);
    const pIn = clamp((l - T.yaitu + 0.15) / 0.35), pOut = eio((l - T.hari - 0.22) / 0.25), pA0 = pIn * (1 - pOut);   // panel compiler utuh s.d. ±15,1 lalu naik keluar
    const dim = 0.12 * up;

    ctx.save(); cm.apply(ctx);
    room(ctx, t);
    calendar(ctx, { base: 1962, hide: Math.max(clamp(pIn / 0.3) * (pOut < 1 ? 1 : 0), clamp((up - 0.05) / 0.25)), du: [l - T.d0, l - T.d1, l - T.d2, l - T.d3], mu: clamp((l - T.jan + 0.1) / 0.45), na: clamp((cm.z - 1.42) / 0.12), ga: clamp((l - T.jan) / 0.5), circ: clamp((l - T.ultah) / 0.7) });
    shelf(ctx, t);
    desk(ctx);
    paperStack(ctx, 228, 606, 130, 52, 3); paperStack(ctx, 560, 606, 96, 22, 9);
    lamp(ctx, t);
    // kertas bergaris di meja (sebelum terangkat / sesudah kembali)
    const onDesk = up < 0.02;
    if (onDesk) { paperQuad(ctx, PAPER_DESK.map(p => p.slice()), { lines: l > back0 ? ALL_LINES : [], age: age, stamp: l > back0 ? 9 : 0, sleeve: sleeve > 0 ? 1 : 0, lift: 0 }, 1); }
    else { ctx.fillStyle = "rgba(120,80,50,0.25)"; ctx.beginPath(); PAPER_DESK.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); }
    if (l < T.hari + 0.2 || l > back1) deskPencil(ctx, 660, 626, 742, 621);
    cupcake(ctx, 910, 606, l - T.empat + 0.15, t, 1 - clamp((l - T.hari) / 0.6));
    glasses(ctx, 1070, 600); pencilCup(ctx, 1330, 604);
    // amplop: dibawa Bip lalu dilempar ke meja
    const walk0 = pull0 + 0.5, walk1 = T.diminta - 0.1, toss0 = T.penerbit - 0.55, land = T.penerbit + 0.02;
    const env = { x: 1190, y: 604 };
    const bipX = lerp(2120, BIP.x, eout((l - walk0) / (walk1 - walk0))), bob = l < walk1 ? Math.abs(Math.sin(l * 9)) * 10 : 0;
    // surat yang muncul dari amplop
    const letU = eio((l - T.buku + 0.25) / 0.6), letHide = eio((l - T.hari) / 0.5), letA = letU * (1 - letHide);
    if (l >= land) envelope(ctx, env.x, env.y, 170, 104, { flat: 1 });
    if (letA > 0.01) {
      const cy = lerp(700, 455, letU), w = 500, h = 250;
      ctx.save(); ctx.beginPath(); ctx.rect(900, 0, 600, 604); ctx.clip(); ctx.globalAlpha *= clamp(letA * 1.4);
      ctx.shadowColor = "rgba(8,10,40,0.35)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10; ctx.fillStyle = CREAM; H.rr(ctx, env.x - w / 2, cy - h / 2, w, h, 14); ctx.fill(); ctx.shadowColor = "transparent";
      ctx.strokeStyle = "#E5484D"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(env.x - w / 2 + 20, cy - h / 2 + 64); ctx.lineTo(env.x + w / 2 - 20, cy - h / 2 + 64); ctx.stroke();
      H.text(ctx, "Dari: penerbit", env.x - w / 2 + 28, cy - h / 2 + 50, 44, { weight: 700, color: "#5A6696" });
      const typ = (s, t0, d) => s.slice(0, Math.round(s.length * clamp((l - t0) / d)));
      const l1 = typ("Mohon tulis buku", T.buku, 0.65), l2a = typ("tentang ", T.tentang, 0.3), l2b = typ("compiler.", T.comp, 0.45);
      const hl = clamp((l - T.comp - 0.3) / 0.35);
      ctx.font = `800 44px ${F}`; const wT = ctx.measureText("tentang ").width, wC = ctx.measureText("compiler").width, x2 = env.x - w / 2 + 28;
      if (hl > 0) { ctx.fillStyle = D.hexA(P.amber, 0.75); H.rr(ctx, x2 + wT - 6, cy + 58 - 40, (wC + 12) * eio(hl), 52, 8); ctx.fill(); }
      H.text(ctx, l1, x2, cy + 10, 44, { weight: 800, color: INK });
      H.text(ctx, l2a + (l2a.length === 8 ? l2b : ""), x2, cy + 70, 44, { weight: 800, color: INK });
      ctx.restore();
    }
    ctx.restore();

    // ---- redup dunia saat kertas di depan layar ----
    if (dim > 0) { ctx.fillStyle = `rgba(8,10,36,${dim})`; ctx.fillRect(0, 0, 1920, 1080); }

    // ---- Bip (di atas lapisan redup) ----
    if (l > walk0 - 0.1) {
      ctx.save(); cm.apply(ctx);
      const compBox = cm.inv(960, 226), wordPt = [env.x - 30, 455 + 58];
      let opt = { t, pose: "diam", mood: "happy", look: [-0.8, -0.2] };
      const envProp = (c, px, py, s) => envelope(c, px, py + 0.13 * s, 0.5 * s, 0.3 * s, {});
      if (l < toss0) opt = { t, pose: "pegang", mood: "happy", prop: envProp, look: [-0.6, 0] };
      else if (l < T.buku) opt = { t, pose: "diam", mood: "wow", look: [-1, 0.2] };
      else if (l > T.comp && l < T.yaitu + 0.2) opt = { t, pose: "tunjuk", target: wordPt, mood: "happy" };
      else if (l >= T.yaitu + 0.2 && l < T.hari) opt = { t, pose: "tunjuk", target: compBox, mood: "happy" };
      else if (l >= T.selembar && l < T.masih) opt = { t, pose: "tunjuk", target: cm.inv(1040, 300), mood: "happy" };
      else if (l >= T.masih && l < T.masih + 1.5) opt = { t, pose: "diam", mood: "wow", look: [-1, -0.3] };
      else if (l >= T.hari) opt = { t, pose: "diam", mood: "happy", look: [-1, -0.25], wave: l > back1 ? l : undefined };
      const a = B.draw(ctx, bipX, BIP.y - bob, BIP.s, opt);
      // amplop melayang ke meja
      if (l >= toss0 && l < land) { const u = clamp((l - toss0) / (land - toss0)), p0 = a.prop || [bipX, BIP.y], x = lerp(p0[0], env.x, u), y = lerp(p0[1], env.y, u) - Math.sin(Math.PI * u) * 170;
        envelope(ctx, x, y, lerp(100, 170, u), lerp(60, 104, u), { flat: u, rot: (1 - u) * -0.5 + Math.sin(u * 9) * 0.1 }); }
      ctx.restore();
    }

    // ---- kertas di depan layar + tangan ----
    if (!onDesk) {
      const dq = PAPER_DESK.map(([x, y]) => cm.S(x, y)), uq = upQuad();
      const q = dq.map((p, i) => [lerp(p[0], uq[i][0], up), lerp(p[1], uq[i][1], up)]);
      paperQuad(ctx, q, { lines, age, stamp: l - Math.max(T.masih, W1 + 0.9), sleeve, lift: up }, 1);
      // tangan menulis
      const hin = eio((l - W0 + 0.45) / 0.45), hout = eio((l - W1) / 0.42);
      if (hin > 0 && hout < 1) {
        let i = lines.findIndex(x => x.f < 1); if (i < 0) i = 11; const L = lines[i], pts = SQ[i];
        const n = Math.min(pts.length - 1, Math.floor(L.f * pts.length)); const [px, py] = L.f <= 0 ? [60, -14] : pts[n];
        const [sx, sy] = upMap(px, LINE_Y(i) + py);
        const ox = (1 - hin) * 520 + hout * 560, oy = (1 - hin) * 420 + hout * 480;
        hand(ctx, sx + ox, sy + oy, t);
      }
      // penghitung judul bab
      const cA = clamp((l - W0 + 0.2) / 0.3) * (1 - clamp((l - back0) / 0.4));
      if (cA > 0) D.post(c => { c.globalAlpha = cA; const x = 1470, y = 245, w = 400, hgt = 250, done = nDone >= 12 ? clamp((l - S0[11] - 0.1) / 0.3) : 0;
        if (done > 0) D.glow(c, x, y, 260, P.amber, 0.35 * done);
        D.panel(c, x - w / 2, y - hgt / 2, w, hgt, { fill: "rgba(14,22,62,0.9)", stroke: done > 0 ? D.hexA(P.amber, 0.9) : P.line, lw: 3 });
        H.text(c, "judul bab", x, y - 52, 46, { align: "center", weight: 800, color: P.ink2 });
        const k = nDone > 0 ? 1 + 0.22 * (1 - eout(clamp((l - lines[nDone - 1].s0) / 0.22))) : 1;
        c.save(); c.translate(x, y + 70); c.scale(k, k); H.text(c, String(nDone), 0, 0, 120, { align: "center", weight: 900, color: done > 0 ? P.amber : P.ink }); c.restore();
      });
      // label kertas
      const s1 = l - T.selembar, s2 = l - T.puluhan, swap = clamp(s2 / 0.25), lbA = 1 - clamp((l - back0) / 0.35);
      const [ex, ey] = upMap(UP.w - 6, 230);
      const out1 = clamp((s2 + 0.3) / 0.25); if (s1 > 0 && out1 < 1) tag("selembar kertas", 1470, 520, s1, { a: (1 - out1) * lbA, to: [ex, ey], col: P.teal });
      if (s2 > 0) tag("disimpan puluhan tahun", 1440, 520, s2, { a: lbA, to: [ex, ey], col: P.amber });
    }

    // ---- label nama (Knuth hadir lewat benda) ----
    const nA = 1 - clamp((l - T.buku + 0.5) / 0.4);
    // posisi layar tetap = posisi dunia pada bidikan lebar (antara penyangga rak dan gelas pensil); penunjuk ke kacamata
    // (berpegang pada dunia, tetapi dibatasi ke dalam layar selama kamera masih mundur)
    const [gx, gy] = cm.S(1066, 588), [kx0, ky] = cm.S(1250, 398), kx = Math.min(kx0, 1450);
    tag("Donald Knuth", kx, ky, l - T.knuth, { a: nA, col: P.amber, size: 50, to: [gx, gy], from: [-140, 20] });
    tag("24 tahun · mahasiswa", kx + 115, ky + 64, l - T.mhs, { a: nA, col: P.teal, size: 44 });

    // ---- panel penjelas: compiler = penerjemah ----
    const pA = pA0;
    if (pA > 0) D.post(c => {
      c.globalAlpha = pA; c.translate(0, -60 * pOut); D.panel(c, 230, 74, 1460, 246, { fill: "rgba(12,20,58,0.92)", stroke: D.hexA(P.amber, 0.5), lw: 3, r: 28 });
      const lu = clamp((l - T.yaitu + 0.1) / 0.35), cu = clamp((l - T.penerj + 0.05) / 0.4), ru = clamp((l - T.untuk) / 0.4);
      // kiri: perintah
      if (lu > 0) { c.save(); c.globalAlpha *= lu; H.text(c, "perintah", 500, 136, 44, { align: "center", weight: 800, color: P.ink2 });
        c.translate(500, 236); const k = pop(lu, 12, 0.5); c.scale(k, k); c.fillStyle = CREAM; H.rr(c, -195, -52, 390, 104, 18); c.fill();
        H.text(c, "total = 2 + 3", 0, 17, 50, { align: "center", weight: 800, color: INK }); c.restore(); }
      // tengah: compiler (penerjemah) dengan roda gigi
      if (cu > 0) { c.save(); c.globalAlpha *= cu; H.text(c, "penerjemah", 960, 136, 44, { align: "center", weight: 800, color: P.amber });
        c.translate(960, 236); const k = pop(cu, 12, 0.5); c.scale(k, k); c.fillStyle = P.amber; H.rr(c, -175, -56, 350, 112, 22); c.fill();
        c.save(); c.translate(-122, 0); c.rotate(t * 2.2); c.fillStyle = "#10142E"; for (let i = 0; i < 8; i++) { c.rotate(TAU / 8); c.fillRect(-6, -30, 12, 14); } c.beginPath(); c.arc(0, 0, 21, 0, TAU); c.fill(); c.fillStyle = P.amber; c.beginPath(); c.arc(0, 0, 8, 0, TAU); c.fill(); c.restore();
        H.text(c, "compiler", 38, 16, 48, { align: "center", weight: 900, color: "#10142E" }); c.restore();
        // panah dan potongan perintah mengalir
        c.save(); c.globalAlpha *= cu; arrow(c, 702, 236, 778, 236, P.ink2); c.restore();
        const fl = (l - T.penerj) / 0.7;
        for (let j = 0; j < 3; j++) { const u = fl - j * 0.22; if (u > 0 && u < 1) { c.save(); c.globalAlpha *= Math.sin(Math.PI * u); c.fillStyle = CREAM; const x = lerp(700, 820, u); H.rr(c, x - 18, 222 + (j - 1) * 4, 36, 28, 6); c.fill(); c.restore(); } } }
      // kanan: bahasa mesin
      if (ru > 0) { c.save(); c.globalAlpha *= ru; arrow(c, 1142, 236, 1218, 236, P.teal); H.text(c, "bahasa mesin", 1420, 136, 44, { align: "center", weight: 800, color: P.teal });
        c.translate(1420, 236); const k = pop(ru, 12, 0.5); c.scale(k, k); c.fillStyle = "#0B1640"; H.rr(c, -195, -52, 390, 104, 18); c.fill(); c.strokeStyle = D.hexA(P.teal, 0.8); c.lineWidth = 3; c.stroke();
        const bits = "0110 1011", nb = Math.round(bits.length * clamp((l - T.untuk) / 0.5)); H.text(c, bits.slice(0, nb), -120, 18, 52, { weight: 800, color: P.teal }); c.restore(); }
    });
  }

  // sampul ungu "1 buku" yang membungkus tumpukan (muka depan buram, pita judul, papan atas, sorot punggung)
  function coverWrap(ctx, yTop, yBot, u, withTop) {
    const x0 = STK.x0 - 12, x1 = STK.x1 + 6, h = yBot - yTop, hb = h * eio(u);
    ctx.save();
    // muka depan tumbuh dari atas ke bawah
    ctx.fillStyle = COVER; H.rr(ctx, x0, yTop - 4, x1 - x0, hb + 4, 8); ctx.fill();
    // sisi samping (tebal buku)
    ctx.globalAlpha *= clamp(u * 2); ctx.fillStyle = "#5E44A6"; ctx.beginPath(); ctx.moveTo(x1, yTop - 4); ctx.lineTo(x1 + 26, yTop - 22); ctx.lineTo(x1 + 26, yTop - 22 + hb); ctx.lineTo(x1, yTop - 4 + hb); ctx.closePath(); ctx.fill();
    // sorot punggung buku di kiri
    ctx.fillStyle = "rgba(255,255,255,0.28)"; ctx.fillRect(x0 + 8, yTop + 2, 12, Math.max(0, hb - 8));
    // pita judul lebih terang (pada sampul utuh: sepertiga atas)
    ctx.save(); ctx.beginPath(); ctx.rect(x0, yTop - 4, x1 - x0, hb + 4); ctx.clip();
    const by = STK.base - STK.H * 0.78;                       // posisi pita tetap; potongan memotongnya
    if (by + 96 > yTop && by < yBot) { ctx.fillStyle = "#A68DEB"; ctx.fillRect(x0 + 28, by, x1 - x0 - 48, 96);
      ctx.fillStyle = "rgba(60,36,120,0.55)"; ctx.fillRect(x0 + 52, by + 26, (x1 - x0) * 0.55, 12); ctx.fillRect(x0 + 52, by + 54, (x1 - x0) * 0.35, 10); }
    ctx.restore();
    // papan atas
    if (withTop) { ctx.fillStyle = "#9273DA"; ctx.beginPath(); ctx.moveTo(x0, yTop - 4); ctx.lineTo(x1, yTop - 4); ctx.lineTo(x1 + 26, yTop - 22); ctx.lineTo(x0 + 26, yTop - 22); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }

  // =====================================================================================
  // b1_2
  // =====================================================================================
  function scene12(ctx, b, l, t) {
    const T = { tiga: at(b, "Tiga tahun"), kem: at(b, "kemudian,"), naskah: at(b, "naskah"), sekitar: at(b, "sekitar"), ribu: atE(b, "tiga ribu"), hal: at(b, "halaman."),
      kaget: at(b, "terkejut"), pnb: at(b, "Penerbit"), satu: at(b, "satu buku"), diubah: at(b, "diubah"), menjadi: at(b, "menjadi"), tujuh: at(b, "tujuh jilid"), end: D.speechEnd(b) };
    const cm = camAt([[0, 960, 540, 1.0], [T.naskah - 0.1, 960, 540, 1.0], [T.ribu + 0.3, 1090, 520, 1.05], [T.menjadi - 0.2, 1100, 515, 1.06], [T.tujuh + 0.4, 1080, 470, 1.08], [b.dur + 1, 1075, 466, 1.09]], l);
    // kalender: tiga kali dibalik
    const fT = [0, 1, 2].map(k => T.tiga + 0.1 + k * 0.5), FD = 0.42;
    let nf = 0; fT.forEach(f => { if (l >= f) nf++; });
    const cur = nf > 0 ? fT[nf - 1] : -9, fu = nf > 0 ? clamp((l - cur) / FD) : 0;
    const base = 1962 + nf, flip = nf > 0 && fu < 1 ? { year: 1962 + nf - 1, u: fu } : null;
    const spin = eio((l - T.tiga) / 1.6) * 3;
    // tumpukan naskah
    const g0 = T.naskah - 0.05, g1 = T.ribu + 0.05, gu = eout(clamp((l - g0) / (g1 - g0))), Hs = STK.H * gu, top = STK.base - Hs;
    const pages = Math.floor(3000 * clamp((l - g0) / (g1 - g0)) ** 1.6 / 100 + 1e-6) * 100;   // dibulatkan ratusan ("sekitar")
    const bookU = eio((l - T.satu + 0.1) / 0.45), split0 = T.diubah, ST = k => split0 + k * 0.12, FL = 0.5;
    const hs = STK.H / 7;

    ctx.save(); cm.apply(ctx);
    room(ctx, t, { jam: 23 + spin });
    calendar(ctx, { base, flip, na: 0, ga: 1, circ: 1 });
    shelf(ctx, t);
    desk(ctx);
    paperStack(ctx, 228, 606, 130, 52, 3); paperStack(ctx, 560, 606, 96, 22, 9);
    lamp(ctx, t);
    paperQuad(ctx, PAPER_DESK.map(p => p.slice()), { lines: ALL_LINES, age: 1, stamp: 9, sleeve: 1, lift: 0 }, 1);
    deskPencil(ctx, 660, 626, 742, 621);
    glasses(ctx, 1070, 600); pencilCup(ctx, 1330, 604);
    // amplop penerbit: melonjak saat "terkejut"
    const ku = l - T.kaget, hop = ku > 0 && ku < 0.7 ? Math.sin(Math.PI * ku / 0.7) * 42 : 0;
    envelope(ctx, 1190, 604 - hop, 170, 104, { flat: 1 - clamp(hop / 42) * 0.45, rot: hop > 0 ? -0.08 * Math.sin(ku * 18) : 0 });
    // garis tinggi Bip
    const bipTop = BIP.y - 0.68 * BIP.s, lnA = clamp((l - g0 - 0.6) / 0.4) * (1 - clamp((l - T.satu) / 0.4));
    if (lnA > 0) { ctx.save(); ctx.globalAlpha *= lnA; ctx.setLineDash([14, 10]); ctx.strokeStyle = D.hexA(P.teal, 0.9); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1405, bipTop); ctx.lineTo(BIP.x - 78, bipTop); ctx.stroke(); ctx.setLineDash([]);
      if (top < bipTop - 10) { ctx.fillStyle = P.teal; ctx.beginPath(); ctx.moveTo(STK.x0 - 40, bipTop - 36); ctx.lineTo(STK.x0 - 56, bipTop - 10); ctx.lineTo(STK.x0 - 24, bipTop - 10); ctx.closePath(); ctx.fill(); }
      ctx.restore(); }
    // tumpukan / tujuh potongan
    if (l < split0) {
      if (Hs > 1) {
        LP.glowE(ctx, (STK.x0 + STK.x1) / 2 + 14, STK.base, 160, 18, "#0B1236", 0.45, "source-over");
        ctx.fillStyle = "#D8CBB2"; ctx.beginPath(); ctx.moveTo(STK.x1, top); ctx.lineTo(STK.x1 + 26, top - 18); ctx.lineTo(STK.x1 + 26, STK.base - 18); ctx.lineTo(STK.x1, STK.base); ctx.closePath(); ctx.fill();
        pageFace(ctx, STK.x0, STK.x1, top, STK.base, 5, COVER, 0);
        pageTop(ctx, STK.x0, STK.x1, top);
        if (bookU > 0) coverWrap(ctx, top, STK.base, bookU, true);
      }
      // lembar-lembar yang jatuh ke tumpukan
      for (let j = 0; j < 18; j++) { const tj = g0 + j * ((g1 - g0) / 18), u = (l - tj) / 0.4; if (u <= 0 || u >= 1) continue;
        const yT = STK.base - STK.H * eout(clamp((tj + 0.4 - g0) / (g1 - g0))), x = (STK.x0 + STK.x1) / 2 + (hh(j) - 0.5) * 120 + Math.sin(u * 6 + j) * 30, y = lerp(yT - 260, yT - 6, eio(u));
        ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(u * 5 + j) * 0.5 * (1 - u)); ctx.fillStyle = "#FFFDF6"; ctx.fillRect(-60, -6, 120, 12); ctx.strokeStyle = "rgba(43,58,140,0.4)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-44, 0); ctx.lineTo(40, 0); ctx.stroke(); ctx.restore(); }
    }
    // tujuh potongan buku terbang ke rak dan menjadi tempat jilid yang belum ditulis (rencana 1965)
    for (let k = 0; k < 7; k++) {
      const s = SLOT(k), u = l < split0 ? -1 : (l - ST(k)) / FL;
      if (u >= 1) { slot(ctx, s.x, s.y, s.w, s.h, k, t, { num: (l - ST(k) - FL) / 0.3 }); continue; }
      if (l < split0) continue;
      const yT = STK.base - STK.H + k * hs, e = eio(clamp(u));
      if (u <= 0) { // potongan yang masih di tumpukan: sampul ungu terpotong
        ctx.fillStyle = "#C3B0EE"; ctx.beginPath(); ctx.moveTo(STK.x1 + 6, yT); ctx.lineTo(STK.x1 + 32, yT - 18); ctx.lineTo(STK.x1 + 32, yT + hs - 18); ctx.lineTo(STK.x1 + 6, yT + hs); ctx.closePath(); ctx.fill();
        coverWrap(ctx, yT, yT + hs, 1, k === 0);
        if (k > 0) { ctx.fillStyle = "rgba(255,248,234,0.9)"; ctx.fillRect(STK.x0 - 12, yT - 3, STK.x1 - STK.x0 + 18, 4); }
        continue; }
      const x = lerp(STK.x0 - 12, s.x, e), y = lerp(yT, s.y, e) - Math.sin(Math.PI * clamp(u)) * 120, w = lerp(STK.x1 - STK.x0 + 18, s.w, e), hgt = lerp(hs, s.h, e);
      ctx.save(); ctx.translate(x + w / 2, y + hgt / 2); ctx.rotate(Math.sin(Math.PI * clamp(u)) * (k % 2 ? 0.25 : -0.25)); ctx.translate(-w / 2, -hgt / 2);
      ctx.globalAlpha *= 1 - 0.75 * clamp((e - 0.45) / 0.55);
      ctx.fillStyle = COVER; H.rr(ctx, 0, 0, w, hgt, 8); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillRect(4, 4, Math.max(4, w * 0.08), hgt - 8);
      ctx.restore();
      ctx.save(); ctx.translate(x + w / 2, y + hgt / 2); ctx.rotate(Math.sin(Math.PI * clamp(u)) * (k % 2 ? 0.25 : -0.25)); ctx.translate(-w / 2, -hgt / 2);
      const dA = clamp((e - 0.35) / 0.5); if (dA > 0) { ctx.globalAlpha *= dA; ctx.setLineDash([12, 9]); ctx.strokeStyle = P.warm; ctx.lineWidth = 4; H.rr(ctx, 2, 2, w - 4, hgt - 4, 8); ctx.stroke(); ctx.setLineDash([]); }
      ctx.restore();
    }
    // Bip
    const kk = l - T.kaget;
    let opt = { t, pose: "diam", mood: "happy", look: [-1, -0.3] };
    if (l > g0 && l < T.kaget) opt = { t, pose: "diam", mood: "wow", look: [-0.7, -1] };
    else if (kk >= 0 && kk < 1.3) opt = { t, pose: "kaget", k: kk };
    else if (l >= T.kaget + 1.3 && l < split0) opt = { t, pose: "tunjuk", target: [(STK.x0 + STK.x1) / 2, top + 40], mood: "think" };
    else if (l >= split0 && l < T.tujuh) opt = { t, pose: "diam", mood: "wow", look: [-1, -1] };
    else if (l >= T.tujuh) opt = { t, pose: "diam", mood: "happy", look: [-1, -0.8], wave: l };
    B.draw(ctx, BIP.x, BIP.y, BIP.s, opt);
    // "!" penerbit terkejut
    if (ku > 0 && ku < 2.6) { const k = pop(ku, 12, 0.45); ctx.save(); ctx.globalAlpha *= 1 - clamp((ku - 2.2) / 0.4); ctx.translate(1190, 520); ctx.scale(k, k); B.seru(ctx, 0, 0, 110, { color: P.amber, glow: true }); ctx.restore(); }
    ctx.restore();

    // ---- lapisan layar ----
    // tahun bertambah
    const yrA = clamp((l - fT[0] - 0.2) / 0.2) * (1 - clamp((l - T.naskah - 1.4) / 0.4));
    if (yrA > 0) { const [px, py] = cm.S(990, 400); tag(`+${Math.max(1, nf)} tahun`, px, py, l - fT[0] - 0.2, { a: yrA, col: P.amber, size: 50 }); }
    // "tinggi Bip" (garis putus-putus pembanding)
    if (lnA > 0) { const [px, py] = cm.S(1300, bipTop); tag("tinggi Bip", px, py, l - g0 - 0.6, { a: lnA, col: P.teal, size: 44 }); }
    // siapa yang terkejut: penerbit (amplop)
    const pnA = 1 - clamp((l - T.pnb - 2.3) / 0.4);
    if (l > T.pnb && pnA > 0) { const [px, py] = cm.S(985, 455); tag("penerbit", px, py, l - T.pnb, { a: pnA, col: P.amber, size: 48, to: cm.S(1150, 582) }); }
    // penghitung halaman
    const cA = clamp((l - g0) / 0.3) * (1 - clamp((l - T.satu + 0.2) / 0.4));
    if (cA > 0) { const [px, py] = cm.S(1640, 232), z = cm.z; D.post(c => { c.globalAlpha = cA; c.translate(px, py); c.scale(z, z);
      const doneU = clamp((l - g1) / 0.3);
      if (doneU > 0) D.glow(c, 0, 0, 220, P.amber, 0.3 * doneU);
      D.panel(c, -165, -118, 330, 236, { fill: "rgba(14,22,62,0.9)", stroke: doneU > 0 ? D.hexA(P.amber, 0.9) : P.line, lw: 3 });
      const sa = clamp((l - T.sekitar) / 0.3); if (sa > 0) { c.save(); c.globalAlpha *= sa; H.text(c, "sekitar", 0, -62, 44, { align: "center", weight: 700, color: P.ink2 }); c.restore(); }
      const k = 1 + 0.15 * doneU * (1 - clamp((l - g1 - 0.3) / 0.3));
      c.save(); c.translate(0, 32); c.scale(k, k); H.text(c, fmt(pages), 0, 0, 84, { align: "center", weight: 900, color: doneU > 0 ? P.amber : P.ink }); c.restore();
      H.text(c, "halaman", 0, 88, 44, { align: "center", weight: 800, color: P.ink2 }); }); }
    // "1 buku"
    const bA = clamp((l - T.satu) / 0.25) * (1 - clamp((l - split0) / 0.3));
    if (bA > 0) { const [px, py] = cm.S((STK.x0 + STK.x1) / 2 + 10, STK.base - STK.H - 90); tag("1 buku", px, py, l - T.satu, { a: bA, col: "#B9A4FF", size: 52 }); }
    // "rencana: 7 jilid"
    if (l > T.tujuh) { const [px, py] = cm.S(1137, 384); tag("rencana: 7 jilid", px, py, l - T.tujuh, { a: 1 - clamp((l - T.end - 0.3) / 0.3), col: P.amber, size: 52, to: cm.S(1137, 312) }); }   // memudar di bawah kartu bab 2
  }

  // ---------- pengarah adegan ----------
  K.SCENES.d04_b1 = function (ctx, b, l, t) {
    if (b.id === "b1_1") return scene11(ctx, b, l, t);
    return scene12(ctx, b, l, t);
  };
  K.SCENES.d04_b1.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b1 = TL => [
    K.sfxAt(TL, "b1_1", "ulang tahunnya", 0.15, "pop", 0.45),          // tanggal 10 dilingkari
    K.sfxAt(TL, "b1_1", "empat,", 0.25, "shimmer", 0.5),              // lilin 24 menyala
    K.sfxAt(TL, "b1_1", "penerbit", 0.0, "clack", 0.55),              // amplop mendarat di meja
    K.sfxAt(TL, "b1_1", "compiler,", 0.3, "pop", 0.5),                // kata compiler disorot
    K.sfxAt(TL, "b1_1", "Hari itu juga", 0.05, "whoosh", 0.55),       // kertas terangkat ke depan
    K.sfxAt(TL, "b1_1", "simpan", 0.0, "shimmer", 0.45),              // sampul plastik, kertas menua
    K.sfxAt(TL, "b1_1", "kemudian.", 0.2, "whoosh", 0.4),             // kertas kembali ke meja
    K.sfxAt(TL, "b1_2", "Tiga tahun", 0.1, "whoosh", 0.5),            // kalender dibalik tiga kali
    K.sfxAt(TL, "b1_2", "tiga ribu", 0.7, "pop", 0.6),                // penghitung mencapai 3.000
    K.sfxAt(TL, "b1_2", "terkejut", 0.0, "pop", 0.7),                 // "!" dan Bip kaget
    K.sfxAt(TL, "b1_2", "diubah", 0.0, "whoosh", 0.6),               // tumpukan terbelah jadi tujuh jilid
    K.sfxAt(TL, "b1_2", "tujuh jilid", 0.1, "shimmer", 0.6),          // label rencana 7 jilid
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
