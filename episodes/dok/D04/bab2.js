/* D04 bab 2: "Apa itu algoritma?" (b2_1–b2_4).
   b2_1 meja kerja malam yang sama dengan bab 1 (lampu, kalender, rak 7 jilid bergaris putus-putus). Jilid 1 berpendar lalu menjadi buku
        sungguhan saat "terbit"; kalender dibalik dan angka tahun 1-9-6-8 muncul satu per satu saat diucapkan; buku terbang ke penyangga di
        meja, kamera mendekat, buku terbuka: "BAB 1 · Konsep Dasar", kotak judul kosong disorot "satu kata", lalu terisi "Algoritma".
   b2_2 dapur siang: kertas resep di meja terangkat ke depan; baris 4 diketik "Garam secukupnya" dan distabilo; "kita paham" (centang);
        Bip bingung di depan tiga takaran (sejumput, 1 sendok teh, 1 sendok makan) dengan tanda tanya; judul berbalik menjadi "Algoritma
        Nasi Goreng"; "secukupnya" dicoret dan diganti "1 sendok teh" (takaran itu menyala); kertas terpecah menjadi kartu langkah 1–5
        yang dicentang satu per satu saat Bip mengikutinya; daftar "langkahnya jelas" / "pasti berakhir"; kartu bendera "Selesai".
   b2_3 ruang naskah kuno (jendela kisi bintang, lampu minyak, rak gulungan): kata "algoritma" di atas; gulungan terbuka, nama
        "al-Khwarizmi" ditulis; salinannya naik dan berubah menjadi "algoritma"; Bip memeriksa dengan kaca pembesar; "ilmuwan Persia";
        garis waktu 12 ruas (tiap ruas 100 tahun) dengan penghitung 0 → ±1.200 tahun.
   b2_4 kembali ke meja malam (redup): sampul generik "The Art of Computer Programming", kata "Art" dilingkari, "art = seni"; sampul
        terbuka, baris kode sederhana diketik dan berkilau; baris kode berubah menjadi paranada yang mengalun dengan not; "puisi", "musik";
        Bip bergoyang mengikuti musik; kartu bab 3 menutup.
   Orang sungguhan tidak digambar. Kamera sendiri (noCam). */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const P = D.P, H = K.helpers, LT = KIT.latar, LP = LT.parts, B = KIT.bipkit;
  const { clamp, lerp, eio, eout, spring } = D;
  const TAU = Math.PI * 2, F = K.FONT;
  const at = (b, s, o = 0) => D.at(b, s, o), atE = (b, s, o = 0) => D.atEnd(b, s, o);
  const mkCam = (fx, fy, z) => ({ fx, fy, z, X: x => (x - fx) * z + 960, Y: y => (y - fy) * z + 540, S: (x, y) => [(x - fx) * z + 960, (y - fy) * z + 540],
    apply(c) { c.translate(960, 540); c.scale(z, z); c.translate(-fx, -fy); } });
  const camAt = (keys, l) => { const p = D.path(keys, l); return mkCam(p.x, p.y, p.z); };
  const hh = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const pop = (u, k = 11, z = 0.5) => (u <= 0 ? 0 : lerp(0.84, 1, Math.min(1.06, spring(u, k, z))));
  const typed = (s, u) => s.slice(0, Math.round(s.length * clamp(u)));
  const INK = "#2B3A8C", CREAM = "#FFF8EC", TEAL_D = "#0F7F86";

  // ---------- label layar (sesudah vignette) ----------
  function tag(s, x, y, u, o = {}) {
    if (u <= 0) return; const a = clamp(u / 0.18) * (o.a == null ? 1 : o.a); if (a <= 0.01) return;
    D.post(c => {
      c.globalAlpha = a; const col = o.col || P.amber;
      if (o.to) { const p = clamp(u / 0.4), [tx, ty] = o.to, ex = lerp(x, tx, eout(p)), ey = lerp(y, ty, eout(p));
        c.strokeStyle = "rgba(10,18,52,0.55)"; c.lineWidth = 10; c.lineCap = "round"; c.beginPath(); c.moveTo(x, y); c.lineTo(ex, ey); c.stroke();
        c.strokeStyle = col; c.lineWidth = 5; c.beginPath(); c.moveTo(x, y); c.lineTo(ex, ey); c.stroke();
        if (p > 0.85) { c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(tx, ty, 12, 0, TAU); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(tx, ty, 7.5, 0, TAU); c.fill(); } }
      const k = pop(u, 12, 0.5); c.translate(x, y); c.scale(k, k);
      D.label(c, s, 0, 0, { size: o.size || 48, col });
    });
  }
  function check(c, x, y, r, col = P.green, u = 1) {
    if (u <= 0) return; const k = pop(u, 13, 0.45); c.save(); c.translate(x, y); c.scale(k, k);
    c.fillStyle = col; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
    c.strokeStyle = "#FFFFFF"; c.lineWidth = r * 0.26; c.lineCap = "round"; c.lineJoin = "round";
    const d = clamp(u / 0.35); c.beginPath(); c.moveTo(-r * 0.45, 0); c.lineTo(-r * 0.12, r * 0.33);
    if (d > 0.5) c.lineTo(lerp(-r * 0.12, r * 0.5, (d - 0.5) * 2), lerp(r * 0.33, -r * 0.36, (d - 0.5) * 2)); c.stroke(); c.restore();
  }
  function sparkle(c, x, y, r, a, rot = 0) {
    if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot); c.fillStyle = "#FFF4D6";
    c.beginPath(); for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * 0.28 : r, an = i * Math.PI / 4; c.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); } c.closePath(); c.fill(); c.restore();
  }

  // =====================================================================================
  // dunia meja malam (sama dengan bab 1: dinding biru, jendela, jam, kalender, rak 7 jilid, meja kayu, lampu teal)
  // =====================================================================================
  const DESK = { bx0: 205, bx1: 1365, by: 562, fx0: 160, fx1: 1410, fy: 630, bot: 792, floor: 878 };
  const CAL = { x: 510, y: 150, w: 340, h: 380 };
  const SHELF = { x0: 880, x1: 1420, y: 300 };
  const SLOT = k => ({ x: 925 + k * 62, y: 150, w: 56, h: 150 });
  const VOL = ["#FF6F91", "#5AA9FF", "#5BD68A", "#FFB547", "#9584FF", "#3FD8C8", "#FF8A5B"];
  const BIPW = { x: 1765, s: 200, y: 778 };
  function room(ctx, t) {
    let gr = ctx.createLinearGradient(0, -200, 0, 720); gr.addColorStop(0, "#2D3D86"); gr.addColorStop(1, "#4459AC");
    ctx.fillStyle = gr; ctx.fillRect(-400, -300, 2720, 1020);
    ctx.fillStyle = "rgba(255,255,255,0.035)"; for (let x = -400; x < 2320; x += 64) ctx.fillRect(x, -300, 24, 1020);
    gr = ctx.createLinearGradient(0, 720, 0, 1100); gr.addColorStop(0, "#4B4488"); gr.addColorStop(1, "#302B68");
    ctx.fillStyle = gr; ctx.fillRect(-400, 720, 2720, 700);
    ctx.strokeStyle = "rgba(20,16,60,0.28)"; ctx.lineWidth = 3; [768, 826, 900, 990].forEach(y => { ctx.beginPath(); ctx.moveTo(-400, y); ctx.lineTo(2320, y); ctx.stroke(); });
    ctx.fillStyle = "#34468F"; ctx.fillRect(-400, 702, 2720, 22); ctx.fillStyle = "rgba(255,255,255,0.14)"; ctx.fillRect(-400, 702, 2720, 3);
    LP.glowE(ctx, 1640, 905, 330, 46, "#6F5BC8", 0.5, "source-over");
    LP.warmPool(ctx, 620, 500, 680, 0.62, 0.85);
    LP.windowFrame(ctx, 70, 186, 250, 250, t, "#8C6B58", () => LP.nightView(ctx, 70, 186, 250, 250, t, 0));
    LP.clock(ctx, 424, 210, 50, t, 23);
  }
  function book(ctx, x, y, w, h, k, o = {}) {
    const col = VOL[k], a = o.a == null ? 1 : o.a; if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = col; H.rr(ctx, x, y, w, h, 7); ctx.fill();
    ctx.fillStyle = "rgba(20,20,60,0.22)"; H.rr(ctx, x + w * 0.72, y, w * 0.28, h, 7); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillRect(x + 5, y + h * 0.12, w - 10, 5); ctx.fillRect(x + 5, y + h * 0.84, w - 10, 5);
    if (o.dash) { ctx.setLineDash([10, 7]); ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 3; H.rr(ctx, x - 4, y - 4, w + 8, h + 8, 9); ctx.stroke(); ctx.setLineDash([]); }
    if (o.num) H.text(ctx, String(k + 1), x + w / 2, y + h * 0.56 + 16, 46, { align: "center", weight: 900, color: "#FFFFFF" });
    ctx.restore();
  }
  function emptySlot(ctx, s, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.setLineDash([10, 7]); ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 3;
    H.rr(ctx, s.x - 4, s.y - 4, s.w + 8, s.h + 8, 9); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  }
  function shelf(ctx, t) {
    const { x0, x1, y } = SHELF;
    ctx.fillStyle = "#6E4632"; [x0 + 50, x1 - 50].forEach(bx => { ctx.beginPath(); ctx.moveTo(bx - 8, y + 18); ctx.lineTo(bx + 8, y + 18); ctx.lineTo(bx + 8, y + 70); ctx.lineTo(bx - 34, y + 18); ctx.closePath(); ctx.fill(); });
    LP.glowE(ctx, (x0 + x1) / 2, y + 30, 300, 26, "#0B1236", 0.3, "source-over");
    ctx.fillStyle = "#B57A55"; H.rr(ctx, x0, y, x1 - x0, 20, 4); ctx.fill(); ctx.fillStyle = "#D29A70"; ctx.fillRect(x0 + 4, y, x1 - x0 - 8, 4);
    ctx.fillStyle = "#8A5A40"; ctx.fillRect(x0 + 4, y + 16, x1 - x0 - 8, 4);
    [[905, 1], [1360, -1]].forEach(([bx, d]) => { ctx.fillStyle = "#7C8BC9"; ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx + d * 18, y); ctx.lineTo(bx + d * 18, y - 70); ctx.lineTo(bx, y - 92); ctx.closePath(); ctx.fill(); });
    ctx.fillStyle = "#E0835A"; ctx.beginPath(); ctx.moveTo(1376, y); ctx.lineTo(1412, y); ctx.lineTo(1418, y - 38); ctx.lineTo(1370, y - 38); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#3FAF8A"; for (let i = 0; i < 4; i++) { const a = -1.9 + i * 0.4 + 0.05 * Math.sin(t * 1.2 + i); ctx.save(); ctx.translate(1394, y - 38); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(28, 0, 30, 10, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  }
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
    LP.warmPool(ctx, 700, 600, 360, 0.7, 0.2);
  }
  function lamp(ctx, t) {
    const bx = 362, by = 604, j1 = [300, 476], hd = [432, 452], ang = Math.atan2(598 - 452, 720 - 432);
    LP.glowE(ctx, 712, 598, 330, 62, "#FFC46A", 0.5 + 0.03 * Math.sin(t * 2.1));
    ctx.fillStyle = "#22506A"; ctx.beginPath(); ctx.ellipse(bx, by, 56, 14, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#2F6E86"; H.rr(ctx, bx - 40, by - 20, 80, 16, 8); ctx.fill();
    ctx.lineCap = "round"; ctx.strokeStyle = "#2F7F86"; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(bx, by - 18); ctx.lineTo(j1[0], j1[1]); ctx.lineTo(hd[0], hd[1]); ctx.stroke();
    ctx.strokeStyle = "#7FD6CB"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx - 4, by - 22); ctx.lineTo(j1[0] - 4, j1[1]); ctx.lineTo(hd[0] - 3, hd[1] - 4); ctx.stroke();
    [[bx, by - 18], j1, hd].forEach(([x, y]) => { ctx.fillStyle = "#1F5B66"; ctx.beginPath(); ctx.arc(x, y, 11, 0, TAU); ctx.fill(); ctx.fillStyle = "#9FE6DA"; ctx.beginPath(); ctx.arc(x - 3, y - 3, 3.5, 0, TAU); ctx.fill(); });
    ctx.save(); ctx.translate(hd[0], hd[1]); ctx.rotate(ang);
    ctx.fillStyle = "#3FA79B"; ctx.beginPath(); ctx.moveTo(-26, -20); ctx.lineTo(-26, 20); ctx.lineTo(62, 60); ctx.lineTo(62, -60); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.beginPath(); ctx.moveTo(-26, -20); ctx.lineTo(62, -60); ctx.lineTo(62, -48); ctx.lineTo(-26, -12); ctx.closePath(); ctx.fill();
    D.glow(ctx, 66, 0, 120, "#FFD38A", 0.75);
    ctx.fillStyle = "#FFF1CC"; ctx.beginPath(); ctx.ellipse(62, 0, 12, 60, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
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
  // kertas 12 bab dalam sampul plastik (dari bab 1), tampak datar di meja
  function sleevePaper(ctx) {
    const q = [[650, 576], [790, 576], [808, 616], [632, 616]];
    ctx.fillStyle = "#EFE2C4"; ctx.beginPath(); q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(43,58,140,0.45)"; ctx.lineWidth = 2; for (let i = 0; i < 6; i++) { const y = 582 + i * 5.6, k = (y - 576) / 40; ctx.beginPath(); ctx.moveTo(lerp(662, 644, k), y); ctx.lineTo(lerp(662, 644, k) + 70 + hh(i) * 50, y); ctx.stroke(); }
    ctx.fillStyle = "rgba(200,230,255,0.22)"; ctx.beginPath(); ctx.moveTo(646, 573); ctx.lineTo(796, 573); ctx.lineTo(814, 619); ctx.lineTo(626, 619); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 2; ctx.stroke();
  }
  function envelope(ctx, x, y, w, h) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = "#F4E6CF"; H.rr(ctx, -w / 2, -h * 0.32, w, h * 0.32, 5); ctx.fill();
    ctx.strokeStyle = "rgba(140,100,60,0.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-w / 2, -h * 0.32); ctx.lineTo(0, -h * 0.08); ctx.lineTo(w / 2, -h * 0.32); ctx.stroke();
    ctx.fillStyle = "#E5484D"; H.rr(ctx, w / 2 - 44, -h * 0.29, 30, 14, 3); ctx.fill(); ctx.restore();
  }
  function deskWorld(ctx, t, o = {}) {
    room(ctx, t);
    if (o.cal) o.cal(ctx);
    shelf(ctx, t);
    desk(ctx);
    paperStack(ctx, 228, 606, 130, 52, 3); paperStack(ctx, 560, 606, 96, 22, 9);
    lamp(ctx, t);
    sleevePaper(ctx); deskPencil(ctx, 660, 626, 742, 621);
    glasses(ctx, 1070, 600); envelope(ctx, 1190, 604, 170, 104); pencilCup(ctx, 1330, 604);
  }

  // ---------- kalender 1965 → 1968 ----------
  function calPage(ctx, year, du, band, ta) {
    const { x, y, w, h } = CAL;
    ctx.fillStyle = CREAM; H.rr(ctx, x, y, w, h, 12); ctx.fill();
    const s = String(year);
    if (ta > 0) { ctx.font = `900 76px ${F}`; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      for (let i = 0; i < 4; i++) { const u = du[i]; if (u <= 0) continue; const k = pop(u, 12, 0.45);
        ctx.save(); ctx.globalAlpha *= clamp(u / 0.12) * ta; ctx.translate(x + w / 2 + (i - 1.5) * 55, y + 112 - 26 * (1 - eout(clamp(u / 0.3)))); ctx.scale(k, k);
        ctx.fillStyle = INK; ctx.fillText(s[i], 0, 0); ctx.restore(); } }
    ctx.fillStyle = "#E5484D"; H.rr(ctx, x + 16, y + 132, w - 32, 54, 10); ctx.fill();
    if (ta > 0 && band) { ctx.save(); ctx.globalAlpha *= ta; H.text(ctx, band, x + w / 2, y + 175, 44, { align: "center", weight: 900, color: "#FFFFFF" }); ctx.restore(); }
    const gy = y + 206, cw = (w - 24) / 7;
    for (let d = 0; d < 31; d++) { const col = (d + 3) % 7, row = Math.floor((d + 3) / 7), cx = x + 12 + cw * (col + 0.5), cy = gy + row * 30;
      ctx.fillStyle = col === 0 ? "rgba(229,72,77,0.55)" : "rgba(43,58,140,0.28)"; H.rr(ctx, cx - 11, cy + 9, 22, 8, 4); ctx.fill(); }
  }
  function calendar(ctx, tear, du, ta) {
    const { x, y, w, h } = CAL;
    ctx.strokeStyle = "#1F2A66"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 40, y + 6); ctx.lineTo(x + w / 2, y - 22); ctx.lineTo(x + w - 40, y + 6); ctx.stroke();
    ctx.fillStyle = "#C9B79A"; ctx.beginPath(); ctx.arc(x + w / 2, y - 22, 7, 0, TAU); ctx.fill();
    ctx.save(); ctx.shadowColor = "rgba(10,14,50,0.4)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12; ctx.fillStyle = "#E9DEC9"; H.rr(ctx, x + 4, y + 6, w, h, 12); ctx.fill(); ctx.restore();
    calPage(ctx, 1968, du, "TERBIT", ta * clamp(tear * 3));
    if (tear < 1) {   // halaman lama (1965) disobek dan terbang ke atas-kanan
      const u = eio(tear); ctx.save(); ctx.globalAlpha *= 1 - clamp((tear - 0.6) / 0.4);
      ctx.translate(x + w, y + 30); ctx.rotate(u * 0.6); ctx.translate(u * 260, -u * 160); ctx.translate(-(x + w), -(y + 30));
      calPage(ctx, 1965, [9, 9, 9, 9], "JANUARI", ta * (1 - clamp(tear / 0.2))); ctx.restore();
    }
    ctx.fillStyle = INK; H.rr(ctx, x, y, w, 30, 10); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(x + 8, y + 4, w - 16, 3);
    [x + 70, x + w - 70].forEach(rx => { ctx.strokeStyle = "#C9CEE8"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(rx, y + 14, 11, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); });
  }

  // ---------- buku jilid 1 di penyangga: tertutup → terbuka ----------
  const BK = { sx: 800, x0: 540, x1: 1060, y0: 255, y1: 585 };      // punggung buku di x = 800
  function scribbles(ctx, x0, x1, y0, n, seed, gap = 26) {
    for (let i = 0; i < n; i++) { const y = y0 + i * gap, r = D.rng(seed + i * 13); let x = x0; const end = x1 - (i === n - 1 ? (x1 - x0) * 0.45 : r() * 30);
      ctx.fillStyle = "rgba(60,70,130,0.26)";
      while (x < end - 12) { const ww = Math.min(end - x, 18 + r() * 46); H.rr(ctx, x, y - 4, ww, 8, 4); ctx.fill(); x += ww + 8; } }
  }
  function openBook(ctx, u, o) {
    const { sx, x0, x1, y0, y1 } = BK, pw = x1 - sx;
    // penyangga kayu
    ctx.fillStyle = "#8A5A40"; H.rr(ctx, x0 + 40, y1 - 6, x1 - x0 - 80, 22, 8); ctx.fill(); ctx.fillStyle = "#6E4632"; H.rr(ctx, sx - 12, y1 - 60, 24, 66, 6); ctx.fill();
    LP.glowE(ctx, sx, y1 + 18, 330, 14, "#0B1236", 0.4, "source-over");
    // sampul belakang (merah muda jilid 1)
    const lx = u > 0.5 ? lerp(sx, x0, eio((u - 0.5) * 2)) : sx;
    ctx.fillStyle = "#D94F75"; H.rr(ctx, lx - 8, y0 - 8, x1 - lx + 16, y1 - y0 + 16, 12); ctx.fill();
    // halaman kanan
    let gr = ctx.createLinearGradient(sx, 0, x1, 0); gr.addColorStop(0, "#E9DCC0"); gr.addColorStop(0.08, CREAM); gr.addColorStop(1, "#FBF1DD");
    ctx.fillStyle = gr; ctx.fillRect(sx, y0, pw, y1 - y0);
    ctx.fillStyle = "rgba(120,90,60,0.25)"; for (let i = 1; i <= 3; i++) ctx.fillRect(x1 - i * 3, y0 + 4, 2, y1 - y0 - 8);
    // halaman kiri (muncul saat sampul berbalik)
    if (u > 0.5) { gr = ctx.createLinearGradient(lx, 0, sx, 0); gr.addColorStop(0, "#FBF1DD"); gr.addColorStop(0.92, CREAM); gr.addColorStop(1, "#E9DCC0");
      ctx.fillStyle = gr; ctx.fillRect(lx, y0, sx - lx, y1 - y0); }
    ctx.fillStyle = "rgba(90,60,40,0.35)"; ctx.fillRect(sx - 2, y0, 4, y1 - y0);
    // isi halaman (coretan) begitu terbuka
    const ca = clamp((u - 0.85) / 0.15);
    if (ca > 0) { ctx.save(); ctx.globalAlpha *= ca;
      scribbles(ctx, x0 + 34, sx - 30, 392, 7, 11); scribbles(ctx, sx + 30, x1 - 30, 372, 8, 47); ctx.restore(); }
    // sampul depan berbalik di sekitar punggung
    if (u < 1) {
      const c = Math.cos(Math.PI * eio(u)), w = pw * Math.abs(c);
      if (c > 0) { ctx.fillStyle = VOL[0]; H.rr(ctx, sx, y0 - 8, w + 8, y1 - y0 + 16, 12); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.fillRect(sx + w * 0.08, y0 + 40, w * 0.84, 8); ctx.fillRect(sx + w * 0.08, y1 - 48, w * 0.84, 8);
        ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.save(); ctx.translate(sx + w / 2, (y0 + y1) / 2); ctx.scale(Math.max(0.01, w / pw), 1);
        ctx.beginPath(); ctx.arc(0, 0, 58, 0, TAU); ctx.fill(); ctx.fillStyle = VOL[0]; ctx.font = `900 72px ${F}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        if (o.coverNum) ctx.fillText("1", 0, 4); else { ctx.fillRect(-8, -30, 16, 60); } ctx.restore(); }
      else { ctx.fillStyle = "#F3E6CC"; H.rr(ctx, sx - w - 8, y0 - 6, w + 8, y1 - y0 + 12, 10); ctx.fill(); }
    }
  }

  function scene21(ctx, b, l, t) {
    const T = { jil: at(b, "Jilid"), ter: at(b, "terbit"), th: at(b, "tahun"), d: [at(b, "seribu"), at(b, "sembilan"), at(b, "enam"), at(b, "delapan,")],
      isi: at(b, "isinya"), mul: at(b, "dimulai"), satu: at(b, "satu kata"), alg: at(b, "algoritma.") };
    const FLY0 = T.d[3] + 0.45, FLY1 = FLY0 + 0.8, OPEN0 = FLY1 + 0.05, OPEN1 = OPEN0 + 0.75;
    const cm = camAt([[0, 960, 540, 1], [FLY0, 950, 520, 1.03], [OPEN1 + 0.2, 800, 425, 2.45], [b.dur, 800, 418, 2.6]], l);
    const far = cm.z < 1.3;
    const tear = clamp((l - T.th + 0.35) / 0.6), du = T.d.map(x => l - x);
    ctx.save(); cm.apply(ctx);
    deskWorld(ctx, t, { cal: c => calendar(c, tear, du, l < OPEN0 ? 1 : 0) });
    // rak: 7 jilid rencana; jilid 1 menjadi nyata saat "terbit"
    const real = clamp((l - T.ter) / 0.35), flyU = clamp((l - FLY0) / (FLY1 - FLY0));
    for (let k = 1; k < 7; k++) { const s = SLOT(k); book(ctx, s.x, s.y, s.w, s.h, k, { dash: true, num: far, a: lerp(0.55, 0.45, real) }); }
    { const s = SLOT(0);
      if (flyU <= 0) {
        const pul = clamp((l - T.jil) / 0.3) * (1 - real * 0.6); if (pul > 0) D.glow(ctx, s.x + s.w / 2, s.y + s.h / 2, 150 + 20 * Math.sin(l * 6), P.warm, 0.55 * pul + 0.3 * real);
        book(ctx, s.x, s.y, s.w, s.h, 0, { dash: real < 0.5, num: far, a: lerp(0.55, 1, real) });
        if (real > 0 && real < 1) for (let i = 0; i < 6; i++) sparkle(ctx, s.x + s.w / 2 + Math.cos(i * 1.05) * 70 * eout(real), s.y + s.h / 2 + Math.sin(i * 1.05) * 90 * eout(real), 12, 1 - real, i);
      } else emptySlot(ctx, s, 1);
    }
    // jilid 1 terbang ke penyangga di meja (punggung → sampul)
    if (flyU > 0 && flyU < 1) {
      const s = SLOT(0), e = eio(flyU), cx = lerp(s.x + s.w / 2, (BK.sx + BK.x1) / 2, e), cy = lerp(s.y + s.h / 2, (BK.y0 + BK.y1) / 2, e) - Math.sin(Math.PI * flyU) * 90,
        w = lerp(s.w, BK.x1 - BK.sx, e), hgt = lerp(s.h, BK.y1 - BK.y0, e);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.sin(Math.PI * flyU) * -0.35);
      D.glow(ctx, 0, 0, Math.max(w, hgt) * 0.8, P.warm, 0.35);
      ctx.fillStyle = VOL[0]; H.rr(ctx, -w / 2, -hgt / 2, w, hgt, 10); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.fillRect(-w / 2 + 6, -hgt / 2 + hgt * 0.12, w - 12, 6); ctx.fillRect(-w / 2 + 6, hgt / 2 - hgt * 0.16, w - 12, 6);
      ctx.restore();
    }
    if (flyU >= 1) openBook(ctx, clamp((l - OPEN0) / (OPEN1 - OPEN0)), { coverNum: false });
    // Bip di lantai kanan (terlihat hanya pada bidikan lebar)
    let bo = { t, pose: "diam", mood: "happy", look: [-1, -0.5] };
    if (l > T.jil && l < FLY0) bo = { t, pose: "tunjuk", target: [SLOT(0).x + 28, SLOT(0).y + 80], mood: l > T.ter ? "wow" : "happy" };
    else if (l >= FLY0) bo = { t, pose: "diam", mood: "wow", look: [-1, -0.2] };
    B.draw(ctx, BIPW.x, BIPW.y, BIPW.s, bo);
    // isi halaman (hanya saat kamera dekat)
    const pa = clamp((l - OPEN1 + 0.05) / 0.35);
    if (pa > 0) {
      ctx.save(); ctx.globalAlpha *= pa;
      H.text(ctx, "BAB 1", 670, 322, 20, { align: "center", weight: 900, color: "#D94F75" });
      H.text(ctx, "Konsep Dasar", 670, 356, 19, { align: "center", weight: 800, color: INK });
      // kotak judul di halaman kanan
      const SL = { x: 826, y: 292, w: 208, h: 50 }, hi = clamp((l - T.satu) / 0.3), fill = clamp((l - T.alg) / 0.6);
      if (hi > 0) D.glow(ctx, SL.x + SL.w / 2, SL.y + SL.h / 2, 150 + 10 * Math.sin(l * 5), fill > 0 ? P.teal : P.amber, 0.5 * hi);
      ctx.fillStyle = fill > 0 ? "rgba(63,216,200,0.16)" : `rgba(255,181,71,${0.12 + 0.18 * hi})`; H.rr(ctx, SL.x, SL.y, SL.w, SL.h, 8); ctx.fill();
      if (fill < 1) { ctx.setLineDash([8, 6]); ctx.strokeStyle = hi > 0 ? P.amber : "rgba(60,70,130,0.45)"; ctx.lineWidth = 2.5; H.rr(ctx, SL.x, SL.y, SL.w, SL.h, 8); ctx.stroke(); ctx.setLineDash([]); }
      else { ctx.strokeStyle = TEAL_D; ctx.lineWidth = 2.5; H.rr(ctx, SL.x, SL.y, SL.w, SL.h, 8); ctx.stroke(); }
      if (fill > 0) H.text(ctx, typed("Algoritma", fill), SL.x + 12, SL.y + 35, 26, { weight: 900, color: TEAL_D });
      ctx.restore();
      const gl = clamp((l - T.alg - 0.6) / 0.4);
      if (gl > 0) for (let i = 0; i < 5; i++) { const a = l * 1.3 + i * 1.26; sparkle(ctx, 930 + Math.cos(a) * 130, 317 + Math.sin(a) * 42, 7 + 3 * Math.sin(l * 4 + i), gl * 0.9, a); }
    }
    ctx.restore();
    // label layar
    const s0 = SLOT(0), [jx, jy] = cm.S(s0.x + s0.w / 2, 395);
    const ja = (1 - clamp((l - FLY0 + 0.3) / 0.3));
    if (ja > 0) tag(real > 0.5 ? "Jilid 1 terbit" : "Jilid 1", jx, jy, l - T.jil - 0.2, { a: ja, col: "#FF8FB1", size: 48, to: cm.S(s0.x + s0.w / 2, 306) });
    if (pa > 0) { const [px, py] = cm.S(930, 384); tag("satu kata", px, py, l - T.satu, { a: 1 - clamp((l - T.alg) / 0.3), col: P.amber, size: 50, to: cm.S(930, 346) }); }
  }

  // =====================================================================================
  // b2_2 dapur: resep → algoritma
  // =====================================================================================
  const CARD = { x: 220, y: 150, w: 700, h: 690 };
  const LINES = ["Panaskan minyak", "Tumis bawang", "Masukkan nasi", null, "Aduk, lalu sajikan"];
  const BADGE = ["#FF6F91", "#FFB547", "#5BD68A", "#5AA9FF", "#9584FF"];
  const MEAS = [{ x: 1270, nm: ["sejumput"], s: 0.6 }, { x: 1490, nm: ["1 sendok", "teh"], s: 0.85 }, { x: 1710, nm: ["1 sendok", "makan"], s: 1.15 }];
  const BIPK = { x: 1042, y: 720, s: 240 };
  function salt(ctx, x, y, w, hgt, seed) {
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.quadraticCurveTo(x, y - hgt * 2, x + w / 2, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(160,180,220,0.6)"; const r = D.rng(seed); for (let i = 0; i < 8; i++) { const u = r() - 0.5; ctx.fillRect(x + u * w * 0.8, y - r() * hgt * 0.9, 3, 3); }
  }
  function measure(ctx, i, x, y, a, glowA) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
    if (glowA > 0) D.glow(ctx, x, y - 40, 150, P.green, 0.6 * glowA);
    ctx.fillStyle = "rgba(20,30,80,0.25)"; ctx.beginPath(); ctx.ellipse(x, y + 2, 70, 12, 0, 0, TAU); ctx.fill();
    if (i === 0) {   // piring kecil berisi sejumput garam
      ctx.fillStyle = "#E8EEFF"; ctx.beginPath(); ctx.ellipse(x, y - 8, 62, 16, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#C9D3F2"; ctx.beginPath(); ctx.ellipse(x, y - 10, 44, 10, 0, 0, TAU); ctx.fill();
      salt(ctx, x, y - 12, 34, 8, 3);
    } else {         // sendok (teh: kecil, makan: besar)
      const s = i === 1 ? 0.8 : 1.15;
      ctx.save(); ctx.translate(x, y - 14); ctx.scale(s, s);
      ctx.strokeStyle = "#AEB8DC"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(10, -4); ctx.lineTo(90, -26); ctx.stroke();
      ctx.strokeStyle = "#DDE3F7"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(14, -8); ctx.lineTo(86, -28); ctx.stroke();
      ctx.fillStyle = "#C3CCEB"; ctx.beginPath(); ctx.ellipse(-26, 0, 44, 22, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#E6EBFA"; ctx.beginPath(); ctx.ellipse(-26, -3, 36, 15, 0, 0, TAU); ctx.fill();
      salt(ctx, -26, -6, 58, 14, 7 + i); ctx.restore();
    }
    ctx.restore();
  }
  function flag(ctx, x, y, s, t, a = 1) {   // bendera finis kotak-kotak, (x, y) kaki tiang
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = "#E8EAF8"; ctx.fillRect(x - 3, y - s, 6, s);
    const fw = s * 0.72, fh = s * 0.46, n = 6, m = 4;
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
      const u0 = i / n, u1 = (i + 1) / n, wv = u => Math.sin(t * 5 - u * 5) * 6 * u;
      ctx.fillStyle = (i + j) % 2 ? "#1E2552" : "#FFFFFF";
      ctx.beginPath(); ctx.moveTo(x + 3 + fw * u0, y - s + fh * j / m + wv(u0)); ctx.lineTo(x + 3 + fw * u1, y - s + fh * j / m + wv(u1));
      ctx.lineTo(x + 3 + fw * u1, y - s + fh * (j + 1) / m + wv(u1)); ctx.lineTo(x + 3 + fw * u0, y - s + fh * (j + 1) / m + wv(u0)); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(x, y - s, 7, 0, TAU); ctx.fill(); ctx.restore();
  }
  function scene22(ctx, b, l, t) {
    const T = { res: at(b, "resep"), men: at(b, "menulis"), gar: at(b, "\"garam"), sec: at(b, "secukupnya"), secE: atE(b, "secukupnya\"."), kita: at(b, "Kita mengerti"),
      tet: at(b, "tetapi"), kom: at(b, "komputer tidak"), tid: at(b, "tidak."), knu: at(b, "Menurut Knuth"), alg: at(b, "algoritma harus"), dit: at(b, "ditulis"),
      tep: at(b, "tepat"), sam: at(b, "sampai komputer"), iku: at(b, "mengikutinya"), lan: at(b, "langkah"), jel: at(b, "jelas"), pas: at(b, "pasti"), akh: at(b, "berakhir.") };
    const px = 0.25 * Math.sin(l * 0.22);
    LT.dapur(ctx, t, { api: 0.75, px });
    // kertas resep: tergeletak di meja lalu terangkat ke depan
    const lift = eio((l - T.res + 0.25) / 0.7);
    const split = eio((l - T.sam - 0.05) / 0.8);
    const C = CARD, flatQ = [[560, 588], [700, 588], [712, 612], [548, 612]];
    const cardQ = [[C.x, C.y], [C.x + C.w, C.y], [C.x + C.w, C.y + C.h], [C.x, C.y + C.h]];
    const Q = flatQ.map((p, i) => [lerp(p[0], cardQ[i][0], lift), lerp(p[1], cardQ[i][1], lift) - Math.sin(Math.PI * lift) * 60]);
    if (lift < 1) { ctx.fillStyle = CREAM; ctx.beginPath(); Q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(120,90,60,0.35)"; ctx.lineWidth = 2; ctx.stroke(); }
    const cardA = clamp((lift - 0.85) / 0.15);
    // Bip
    const meas0 = T.tet + 0.15, measOut = T.sam - 0.3;
    let bo = { t, pose: "diam", mood: "happy", look: [-1, -0.2] };
    if (l > T.kita && l < T.tet) bo = { t, pose: "diam", mood: "happy", look: [-1, -0.3] };
    if (l >= T.tet && l < T.dit + 0.6) bo = { t, pose: "diam", mood: "think", look: [1, 0.1 + 0.2 * Math.sin(l * 2.2)], sweat: l > T.tid };
    if (l >= T.dit + 0.6 && l < T.sam) bo = { t, pose: "diam", mood: "happy", look: [1, 0.2] };
    const stepT = i => T.sam + 0.75 + i * ((T.iku + 0.55 - T.sam - 0.75) / 4);
    let cur = -1; for (let i = 0; i < 5; i++) if (l >= stepT(i) - 0.15) cur = i;
    const NY = i => 300 + i * 100;
    if (l >= T.sam && l < T.lan) bo = { t, pose: "tunjuk", target: [C.x + C.w + 6, cur >= 0 ? NY(cur) : NY(0)], mood: "happy" };
    if (l >= T.lan && l < T.akh + 0.3) bo = { t, pose: "diam", mood: "happy", look: [-1, 0] };
    if (l >= T.akh + 0.3) bo = { t, pose: "diam", mood: "happy", look: [-0.6, -0.2], wave: l };
    B.draw(ctx, BIPK.x, BIPK.y, BIPK.s, bo);
    // tiga takaran di meja
    const chosen = clamp((l - T.dit - 0.5) / 0.4);
    MEAS.forEach((m, i) => { const u = l - meas0 - i * 0.3, a = clamp(u / 0.25) * (1 - clamp((l - measOut) / 0.4)) * (i === 1 ? 1 : 1 - 0.75 * chosen);
      if (u <= 0 || a <= 0) return; const k = pop(u, 12, 0.5); ctx.save(); ctx.translate(m.x, 612); ctx.scale(k * 1.45, k * 1.45); measure(ctx, i, 0, 0, a, i === 1 ? chosen : 0); ctx.restore(); });

    // ---- kartu resep / kartu langkah ----
    if (cardA > 0) {
      ctx.save(); ctx.globalAlpha *= cardA;
      // latar kertas (memudar saat terpecah)
      const pA = 1 - split;
      if (pA > 0) { ctx.save(); ctx.globalAlpha *= pA; ctx.shadowColor = "rgba(10,14,50,0.35)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14;
        ctx.fillStyle = CREAM; H.rr(ctx, C.x, C.y, C.w, C.h, 18); ctx.fill(); ctx.restore();
        ctx.save(); ctx.globalAlpha *= pA; ctx.fillStyle = "#E5484D"; ctx.beginPath(); ctx.arc(C.x + C.w / 2, C.y + 8, 14, 0, TAU); ctx.fill(); ctx.restore(); }
      // judul: berbalik dari "Resep" menjadi "Algoritma"
      const ty = lerp(C.y + 92, 214, split), fl = clamp((l - T.alg + 0.05) / 0.5), sy = Math.abs(Math.cos(Math.PI * fl));
      const titleA = clamp((l - T.res) / 0.3);
      if (titleA > 0) { ctx.save(); ctx.globalAlpha *= titleA;
        if (split > 0) { ctx.save(); ctx.globalAlpha *= split; ctx.fillStyle = "rgba(10,18,52,0.82)"; H.rr(ctx, C.x, ty - 62, C.w, 86, 43); ctx.fill(); ctx.restore(); }
        ctx.translate(C.x + C.w / 2, ty - 18); ctx.scale(1, Math.max(0.02, sy)); const nw = fl >= 0.5;
        const col = nw ? (split > 0.5 ? "#7FF0E2" : TEAL_D) : (split > 0.5 ? "#FFFFFF" : INK);
        H.text(ctx, nw ? "Algoritma Nasi Goreng" : typed("Resep Nasi Goreng", (l - T.res) / 0.9), 0, 18, 52, { align: "center", weight: 900, color: col, fit: C.w - 50 });
        ctx.restore(); }
      if (pA > 0) { ctx.save(); ctx.globalAlpha *= pA; ctx.fillStyle = "rgba(43,58,140,0.18)"; ctx.fillRect(C.x + 40, C.y + 120, C.w - 80, 3); ctx.restore(); }
      // jalur penghubung antarkartu langkah
      if (split > 0) { ctx.save(); ctx.globalAlpha *= split; ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 8; ctx.setLineDash([2, 16]); ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(C.x + 70, NY(0)); ctx.lineTo(C.x + 70, l > T.pas ? NY(5) : NY(4)); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
      for (let i = 0; i < 5; i++) {
        const y0 = C.y + 190 + i * 104, y1 = NY(i), cy = lerp(y0, y1, eio(clamp(split * 1.25 - i * 0.06)));
        const appear = i === 3 ? clamp((l - T.gar + 0.4) / 0.3) : clamp((l - T.res - 0.35 - i * 0.14) / 0.3);
        if (appear <= 0) continue;
        ctx.save(); ctx.globalAlpha *= appear;
        if (split > 0) { ctx.save(); ctx.globalAlpha *= split; ctx.shadowColor = "rgba(10,14,50,0.3)"; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6; ctx.fillStyle = CREAM; H.rr(ctx, C.x, cy - 42, C.w, 84, 20); ctx.fill(); ctx.restore(); }
        // nomor langkah (berdenyut saat "langkah yang jelas")
        const pu = l - (T.lan + 0.1 + i * 0.2), pk = pu > 0 && pu < 0.6 ? 1 + 0.22 * Math.sin(Math.PI * pu / 0.6) : 1;
        ctx.save(); ctx.translate(C.x + 70, cy); ctx.scale(pk, pk); ctx.fillStyle = BADGE[i]; ctx.beginPath(); ctx.arc(0, 0, 32, 0, TAU); ctx.fill();
        H.text(ctx, String(i + 1), 0, 15, 42, { align: "center", weight: 900, color: "#FFFFFF" }); ctx.restore();
        const tx = C.x + 124, by = cy + 16;
        if (i !== 3) H.text(ctx, LINES[i], tx, by, 46, { weight: 700, color: INK });
        else {
          // baris garam: diketik → distabilo → dicoret → diganti takaran tepat
          const g1 = clamp((l - T.gar) / Math.max(0.2, T.sec - T.gar)), g2 = clamp((l - T.sec) / Math.max(0.3, T.secE - T.sec));
          ctx.font = `700 46px ${F}`; const gw = ctx.measureText("Garam ").width;
          const hl = clamp((l - T.secE - 0.05) / 0.45), st = clamp((l - T.dit) / 0.4), oldA = 1 - clamp((l - T.dit - 0.45) / 0.25), nu = clamp((l - T.dit - 0.75) / 0.6);
          ctx.font = `700 46px ${F}`; const ow = ctx.measureText("secukupnya").width;
          if (hl > 0 && oldA > 0) { ctx.save(); ctx.globalAlpha *= 0.85 * oldA; ctx.fillStyle = "#FFE36A"; ctx.beginPath(); ctx.moveTo(tx + gw - 8, by - 40); ctx.lineTo(tx + gw - 8 + (ow + 16) * eout(hl), by - 42); ctx.lineTo(tx + gw - 8 + (ow + 16) * eout(hl), by + 12); ctx.lineTo(tx + gw - 8, by + 10); ctx.closePath(); ctx.fill(); ctx.restore(); }
          if (nu > 0 && split <= 0) { ctx.save(); ctx.globalAlpha *= 0.55 * (1 - split); ctx.fillStyle = "#B9F5D0"; H.rr(ctx, tx + gw - 8, by - 42, ctx.measureText("1 sendok teh").width * eout(nu) + 16, 56, 10); ctx.fill(); ctx.restore(); }
          H.text(ctx, typed("Garam", g1 * 1.2), tx, by, 46, { weight: 700, color: INK });
          if (oldA > 0.02 && g2 > 0) { ctx.save(); ctx.globalAlpha *= oldA; H.text(ctx, typed("secukupnya", g2), tx + gw, by - 30 * (1 - oldA), 46, { weight: 700, color: st > 0 ? "#B0303A" : INK }); ctx.restore();
            if (st > 0) { ctx.save(); ctx.globalAlpha *= oldA; ctx.strokeStyle = "#E5484D"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(tx + gw - 4, by - 16); ctx.lineTo(tx + gw - 4 + (ow + 8) * eout(st), by - 14); ctx.stroke(); ctx.restore(); } }
          if (nu > 0) H.text(ctx, typed("1 sendok teh", nu), tx + gw, by, 46, { weight: 800, color: "#16794A" });
        }
        // centang saat Bip mengikuti langkah
        const cu = l - stepT(i); if (split > 0.9 && cu > 0) check(ctx, C.x + C.w - 50, cy, 26, P.green, cu);
        ctx.restore();
      }
      // kartu bendera "Selesai"
      const fu = l - T.pas - 0.15;
      if (fu > 0) { const k = pop(fu, 11, 0.45), cy = NY(5); ctx.save(); ctx.translate(C.x + C.w / 2, cy); ctx.scale(k, k); ctx.translate(-(C.x + C.w / 2), -cy);
        ctx.save(); ctx.shadowColor = "rgba(10,14,50,0.3)"; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6; ctx.fillStyle = "#2E9A63"; H.rr(ctx, C.x, cy - 42, C.w, 84, 20); ctx.fill(); ctx.restore();
        flag(ctx, C.x + 60, cy + 30, 62, t);
        H.text(ctx, "Selesai", C.x + 124, cy + 16, 46, { weight: 900, color: "#FFFFFF" }); ctx.restore(); }
      ctx.restore();
    }
    // ---- label layar ----
    D.post(c => {
      // "kita paham"
      const ka = clamp((l - T.kita) / 0.3) * (1 - clamp((l - T.tet + 0.1) / 0.3));
      if (ka > 0) B.daftarPeriksa(c, 1120, 250, 700, { t, text: "Kita mengerti", state: "check", u: ka, su: clamp((l - T.kita - 0.4) / 0.3) });
      // tanda tanya di atas takaran + pertanyaan
      const qa = 1 - clamp((l - T.dit - 0.3) / 0.4);
      MEAS.forEach((m, i) => { const u = l - T.tid + 0.1 - i * 0.18; if (u <= 0 || qa <= 0) return; c.save(); c.globalAlpha = qa; const k = pop(u, 12, 0.45); c.translate(m.x, 450 + 6 * Math.sin(l * 3 + i)); c.scale(k, k); c.fillStyle = "rgba(10,18,52,0.35)"; c.beginPath(); c.arc(3, 5, 40, 0, TAU); c.fill(); c.fillStyle = P.amber; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.fill(); H.text(c, "?", 0, 19, 56, { align: "center", weight: 900, color: "#1C2050" }); c.restore(); });
      const la = clamp((l - meas0) / 0.3) * (1 - clamp((l - measOut) / 0.4));
      if (la > 0) MEAS.forEach((m, i) => { const u = clamp((l - meas0 - i * 0.3) / 0.25) * la * (i === 1 ? 1 : 1 - 0.6 * chosen); if (u <= 0) return; c.save(); c.globalAlpha = u;
        c.fillStyle = "rgba(10,18,52,0.82)"; H.rr(c, m.x - 106, 652, 212, m.nm.length * 52 + 20, 18); c.fill();
        if (i === 1 && chosen > 0) { c.strokeStyle = D.hexA(P.green, chosen); c.lineWidth = 4; c.stroke(); }
        m.nm.forEach((s, j) => H.text(c, s, m.x, 700 + j * 52, 44, { align: "center", weight: 800, color: "#FFFFFF" })); c.restore(); });
      const ba = clamp((l - T.tid - 0.2) / 0.3) * (1 - clamp((l - T.alg) / 0.4));
      if (ba > 0) { c.globalAlpha = ba; const k = pop(l - T.tid - 0.2, 12, 0.5); c.save(); c.translate(1450, 330); c.scale(k, k); D.label(c, "Berapa banyak?", 0, 0, { size: 54, col: P.pink }); c.restore(); c.globalAlpha = 1; }
      // syarat algoritma menurut Knuth
      const ha = clamp((l - T.lan + 0.2) / 0.3);
      if (ha > 0) { c.save(); c.globalAlpha = ha; c.fillStyle = "rgba(10,18,52,0.85)"; H.rr(c, 1150, 196, 450, 74, 37); c.fill(); H.text(c, "Menurut Knuth:", 1180, 248, 48, { weight: 900, color: P.amber }); c.restore(); }
      const r1 = clamp((l - T.jel + 0.1) / 0.3), r2 = clamp((l - T.pas) / 0.3);
      if (r1 > 0) B.daftarPeriksa(c, 1150, 290, 620, { t, text: "langkahnya jelas", state: "check", u: r1, su: clamp((l - T.jel + 0.3) / 0.3) });
      if (r2 > 0) B.daftarPeriksa(c, 1150, 418, 620, { t, text: "pasti berakhir", state: "check", u: r2, su: clamp((l - T.akh) / 0.3) });
    });
  }

  // =====================================================================================
  // b2_3 ruang naskah kuno: al-Khwarizmi → algoritma
  // =====================================================================================
  const SC = { cx: 860, cy: 470, w: 1000, h: 250 };
  function starTile(ctx, x, y, r) {
    ctx.beginPath(); for (let i = 0; i < 16; i++) { const rr = i % 2 ? r * 0.62 : r, a = i * Math.PI / 8 + Math.PI / 16; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath();
  }
  function archWindow(ctx, x, y, w, h, t) {
    ctx.save(); ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + w / 2); ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath();
    const gr = ctx.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, "#2B3F8E"); gr.addColorStop(1, "#5C6FBF"); ctx.fillStyle = gr; ctx.fill(); ctx.clip();
    ctx.fillStyle = "#FFFFFF"; for (let i = 0; i < 14; i++) { ctx.globalAlpha = 0.4 + 0.4 * Math.sin(t * 1.3 + i * 2.1); ctx.beginPath(); ctx.arc(x + hh(i) * w, y + hh(i + 40) * h * 0.7, 2.2, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1; ctx.strokeStyle = "#C99A5B"; ctx.lineWidth = 5;
    for (let j = 0; j < 7; j++) for (let i = 0; i < 3; i++) { starTile(ctx, x + w * (i + 0.5) / 3 + (j % 2 ? w / 6 : 0), y + 30 + j * 64, 26); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = "#8C5E3C"; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + w / 2); ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.stroke();
    ctx.fillStyle = "#A8744B"; H.rr(ctx, x - 24, y + h - 4, w + 48, 22, 6); ctx.fill();
  }
  function oilLamp(ctx, x, y, t) {
    ctx.strokeStyle = "#8C5E3C"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, y - 40); ctx.stroke();
    D.glow(ctx, x, y - 30, 260, "#FFB860", 0.45 + 0.05 * Math.sin(t * 7.3) + 0.03 * Math.sin(t * 13.1));
    ctx.fillStyle = "#C98A3B"; ctx.beginPath(); ctx.ellipse(x, y, 46, 18, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#E3A955"; ctx.beginPath(); ctx.ellipse(x, y - 6, 40, 10, 0, 0, TAU); ctx.fill();
    const fl = 1 + 0.12 * Math.sin(t * 9) + 0.06 * Math.sin(t * 17);
    ctx.fillStyle = "#FFE7A0"; ctx.beginPath(); ctx.moveTo(x + 30, y - 12); ctx.quadraticCurveTo(x + 46, y - 30 * fl, x + 36, y - 50 * fl); ctx.quadraticCurveTo(x + 26, y - 30, x + 30, y - 12); ctx.fill();
  }
  function scrollRack(ctx, x, y, w, t) {
    ctx.fillStyle = "#7A4E34"; H.rr(ctx, x, y, w, 18, 4); ctx.fill(); H.rr(ctx, x, y + 150, w, 18, 4); ctx.fill();
    for (let i = 0; i < Math.floor(w / 46); i++) for (let j = 0; j < 2; j++) { const cx = x + 26 + i * 46 + (j ? 14 : 0), cy = y + 60 + j * 52;
      ctx.fillStyle = (i + j) % 3 ? "#E9D5AE" : "#D9BE8E"; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, TAU); ctx.fill(); ctx.strokeStyle = "rgba(120,80,40,0.5)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 11, 0, TAU); ctx.stroke();
      if ((i * 7 + j) % 4 === 0) { ctx.fillStyle = "#C0504D"; ctx.fillRect(cx - 3, cy + 14, 6, 14); } }
  }
  function oldRoom(ctx, t) {
    let gr = ctx.createLinearGradient(0, 0, 0, 1080); gr.addColorStop(0, "#4A3C86"); gr.addColorStop(0.75, "#7E5E8C"); gr.addColorStop(1, "#5E4472");
    ctx.fillStyle = gr; ctx.fillRect(-100, -100, 2120, 1280);
    ctx.save(); ctx.globalAlpha = 0.08; ctx.strokeStyle = "#FFE2B0"; ctx.lineWidth = 2;
    for (let j = 0; j < 9; j++) for (let i = 0; i < 16; i++) { starTile(ctx, 60 + i * 128 + (j % 2) * 64, 40 + j * 110, 34); ctx.stroke(); } ctx.restore();
    LP.warmPool(ctx, 860, 480, 820, 0.5, 0.75);
    archWindow(ctx, 96, 150, 220, 470, t); archWindow(ctx, 1590, 150, 220, 470, t);
    // lantai + karpet bermotif
    gr = ctx.createLinearGradient(0, 760, 0, 1080); gr.addColorStop(0, "#5B3F66"); gr.addColorStop(1, "#3F2C52"); ctx.fillStyle = gr; ctx.fillRect(-100, 760, 2120, 420);
    ctx.fillStyle = "#9B3F4E"; ctx.beginPath(); ctx.moveTo(300, 800); ctx.lineTo(1500, 800); ctx.lineTo(1640, 1000); ctx.lineTo(160, 1000); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#E9B35C"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(330, 812); ctx.lineTo(1470, 812); ctx.lineTo(1596, 988); ctx.lineTo(204, 988); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = "rgba(233,179,92,0.5)"; for (let i = 0; i < 9; i++) { starTile(ctx, 420 + i * 120, 900, 18); ctx.fill(); }
    // meja rendah tempat gulungan dibentangkan
    LP.glowE(ctx, 860, 780, 520, 24, "#1A1030", 0.45, "source-over");
    ctx.fillStyle = "#6E4632"; [430, 1270].forEach(x => { H.rr(ctx, x - 16, 650, 32, 130, 8); ctx.fill(); });
    gr = ctx.createLinearGradient(0, 628, 0, 668); gr.addColorStop(0, "#B57A55"); gr.addColorStop(1, "#8A5A40"); ctx.fillStyle = gr; H.rr(ctx, 360, 628, 1000, 36, 10); ctx.fill();
    ctx.fillStyle = "rgba(255,230,190,0.35)"; ctx.fillRect(370, 630, 980, 4);
    oilLamp(ctx, 470, 250, t); oilLamp(ctx, 1260, 250, t + 1.7);
  }
  function scroll(ctx, u, t) {
    const { cx, cy, w, h } = SC, pw = Math.max(30, w * eio(u)), x0 = cx - pw / 2, x1 = cx + pw / 2;
    LP.glowE(ctx, cx, cy + h / 2 + 30, pw * 0.6 + 60, 22, "#1A1030", 0.35, "source-over");
    let gr = ctx.createLinearGradient(0, cy - h / 2, 0, cy + h / 2); gr.addColorStop(0, "#F6E7C6"); gr.addColorStop(0.5, "#FBEFD6"); gr.addColorStop(1, "#EAD3A6");
    ctx.fillStyle = gr; ctx.fillRect(x0, cy - h / 2, pw, h);
    if (u > 0.2) { ctx.save(); ctx.beginPath(); ctx.rect(x0, cy - h / 2, pw, h); ctx.clip(); ctx.strokeStyle = "rgba(150,90,40,0.55)"; ctx.lineWidth = 3;
      ctx.strokeRect(cx - w / 2 + 34, cy - h / 2 + 18, w - 68, h - 36); ctx.lineWidth = 1.5; ctx.strokeRect(cx - w / 2 + 42, cy - h / 2 + 26, w - 84, h - 52);
      ctx.fillStyle = "rgba(170,100,50,0.5)"; [cx - w / 2 + 90, cx + w / 2 - 90].forEach(sx => { starTile(ctx, sx, cy, 26); ctx.fill(); }); ctx.restore(); }
    [x0, x1].forEach(rx => { gr = ctx.createLinearGradient(rx - 18, 0, rx + 18, 0); gr.addColorStop(0, "#8C5E3C"); gr.addColorStop(0.5, "#C98A57"); gr.addColorStop(1, "#7A4E34");
      ctx.fillStyle = gr; H.rr(ctx, rx - 18, cy - h / 2 - 22, 36, h + 44, 14); ctx.fill(); ctx.fillStyle = "#E3B067"; ctx.beginPath(); ctx.arc(rx, cy - h / 2 - 26, 12, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(rx, cy + h / 2 + 26, 12, 0, TAU); ctx.fill(); });
  }
  function nameText(ctx, x, y, size, reveal, col) {
    ctx.save(); ctx.font = `900 ${size}px ${F}`; const w = ctx.measureText("al-Khwarizmi").width;
    ctx.beginPath(); ctx.rect(x - w / 2 - 10, y - size, (w + 20) * reveal, size * 1.4); ctx.clip();
    H.text(ctx, "al-Khwarizmi", x, y, size, { align: "center", weight: 900, color: col });
    ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - w / 2, y + 26); ctx.bezierCurveTo(x - w / 6, y + 46, x + w / 6, y + 6, x + w / 2 + 30, y + 30); ctx.stroke();
    ctx.restore(); return w;
  }
  function scene23(ctx, b, l, t) {
    const T = { alg: at(b, "algoritma"), ber: at(b, "berasal"), nam: at(b, "al-Khwarizmi,"), namE: atE(b, "al-Khwarizmi,"), ilm: at(b, "ilmuwan"),
      sek: at(b, "sekitar"), rib: at(b, "seribu"), rat: atE(b, "ratus"), thn: at(b, "tahun lalu"), end: atE(b, "lalu.") };
    const cz = 1 + 0.03 * eio(l / b.dur);
    ctx.save(); ctx.translate(960, 540); ctx.scale(cz, cz); ctx.translate(-960, -540);
    oldRoom(ctx, t);
    const un = clamp((l - T.ber + 0.1) / 0.9);
    scroll(ctx, un, t);
    const NY_ = SC.cy + 36, rev = clamp((l - T.nam + 0.05) / Math.max(0.5, T.namE - T.nam + 0.1));
    if (rev > 0) nameText(ctx, SC.cx, NY_, 104, rev, "#5A3418");
    // Bip dengan kaca pembesar
    const bipIn = clamp((l - T.ber) / 0.6);
    const bo = l > T.nam + 0.3 && l < T.sek ? { t, pose: "kacaPembesar", target: [1150, NY_ - 40], glass: 0.62,
      content: (c, cx, cy, r) => { c.fillStyle = "#FBEFD6"; c.fillRect(cx - r, cy - r, 2 * r, 2 * r); c.save(); c.translate(cx, cy); c.scale(1.6, 1.6); c.translate(-1120, -(NY_ - 36)); nameText(c, SC.cx, NY_, 104, 1, "#5A3418"); c.restore(); } }
      : { t, pose: "diam", mood: l > T.sek ? "wow" : "happy", look: l > T.sek ? [-0.9, 0.5] : [-1, -0.3] };
    B.draw(ctx, 1480 + 90 * (1 - eio(bipIn)), 700, 230, bipIn > 0 && bipIn < 1 ? { t, pose: "jalan", dir: -1 } : bo);
    ctx.restore();

    // ---- lapisan layar ----
    const WY = 200;
    D.post(c => {
      c.save(); c.translate(960, 540); c.scale(cz, cz); c.translate(-960, -540);
      // kata "algoritma" di atas
      const wa = l - T.alg + 0.1;
      if (wa > 0) { const k = pop(wa, 10, 0.5), mu = l - (T.namE + 1.15), pulse = mu > 0 && mu < 0.7 ? 1 + 0.12 * Math.sin(Math.PI * mu / 0.7) : 1;
        if (mu > 0) D.glow(c, SC.cx, WY - 34, 420, P.teal, 0.5 * Math.max(0, 1 - mu / 1.6));
        c.save(); c.translate(SC.cx, WY); c.scale(k * pulse, k * pulse); H.text(c, "algoritma", 0, 0, 112, { align: "center", weight: 900, color: "#7FF0E2" }); c.restore(); }
      // salinan nama naik lalu berubah menjadi "algoritma"
      const m0 = T.namE + 0.15, mu = clamp((l - m0) / 1.0);
      if (mu > 0 && mu < 1) { const e = eio(Math.min(1, mu / 0.75)), y = lerp(NY_, WY, e), x = SC.cx, s = lerp(104, 112, e), a = 1 - clamp((mu - 0.58) / 0.15);
        c.save(); c.globalAlpha = a; D.glow(c, x, y - 34, 160, P.amber, 0.5);
        if (mu < 0.4) H.text(c, "al-Khwarizmi", x, y, s * (1 - 0.2 * mu), { align: "center", weight: 900, color: "#FFD38A" });
        else H.text(c, "algoritma", x, y, s * (0.9 + 0.1 * mu), { align: "center", weight: 900, color: "#7FF0E2" });
        for (let i = 0; i < 6; i++) sparkle(c, x + Math.cos(i * 1.05 + l * 3) * 190, y - 30 + Math.sin(i * 1.05 + l * 3) * 50, 10, Math.sin(Math.PI * mu), i);
        c.restore(); }
      // "ilmuwan Persia"
      if (l > T.ilm) { c.save(); const k = pop(l - T.ilm, 12, 0.5); c.translate(SC.cx - 250, 660); c.scale(k, k); D.label(c, "ilmuwan Persia", 0, 0, { size: 48, col: "#E9B35C" }); c.restore(); }
      // garis waktu 12 ruas × 100 tahun
      const tl0 = T.sek - 0.25, X0 = 260, X1 = 1340, LY = 800, grow = eio((l - tl0) / Math.max(0.6, T.rat - tl0));
      if (l > tl0) { const ga = clamp((l - tl0) / 0.3); c.globalAlpha = ga;
        c.fillStyle = "rgba(10,18,52,0.6)"; H.rr(c, X0 - 40, LY - 26, X1 - X0 + 80, 52, 26); c.fill();
        c.strokeStyle = "rgba(255,255,255,0.25)"; c.lineWidth = 6; c.beginPath(); c.moveTo(X0, LY); c.lineTo(X1, LY); c.stroke();
        c.strokeStyle = "#E9B35C"; c.lineWidth = 8; c.lineCap = "round"; c.beginPath(); c.moveTo(X0, LY); c.lineTo(lerp(X0, X1, grow), LY); c.stroke();
        for (let i = 0; i <= 12; i++) { const x = lerp(X0, X1, i / 12), on = grow >= i / 12 - 1e-6; c.fillStyle = on ? "#FFE2A8" : "rgba(255,255,255,0.3)"; c.beginPath(); c.arc(x, LY, i % 12 === 0 ? 13 : 8, 0, TAU); c.fill(); }
        // ujung kiri: gulungan kecil; ujung kanan: sekarang
        c.save(); c.translate(X0, LY - 58); c.fillStyle = "#F6E7C6"; c.fillRect(-26, -16, 52, 32); c.fillStyle = "#A8744B"; c.fillRect(-32, -20, 8, 40); c.fillRect(24, -20, 8, 40); c.restore();
        H.text(c, "dulu", X0, LY + 76, 44, { align: "center", weight: 800, color: "#FFFFFF" });
        if (grow > 0.98) H.text(c, "sekarang", X1, LY + 76, 44, { align: "center", weight: 800, color: "#FFFFFF" });
        const yrs = Math.round(1200 * grow / 100) * 100, lu = clamp((l - T.rat + 0.05) / 0.3);
        const s = (lu > 0 ? "± " : "") + (yrs >= 1000 ? "1." + String(yrs - 1000).padStart(3, "0") : String(yrs)) + " tahun";
        c.save(); c.translate(lerp(X0, X1, grow / 2), LY - 64); const k = 1 + 0.15 * Math.sin(Math.PI * lu) * (lu < 1 ? 1 : 0); c.scale(k, k);
        if (yrs > 0) D.label(c, s, 0, 0, { size: 50, col: lu > 0 ? P.amber : "#E9B35C" }); c.restore();
        c.globalAlpha = 1; }
      c.restore();
    });
  }

  // =====================================================================================
  // b2_4 art = seni: kode → musik
  // =====================================================================================
  const CV = { x: 600, y: 140, w: 540, h: 690 };
  const CODE = [[["ulangi", "#7B4FD6"], [" 3 kali:", INK]], [["   aduk nasi", INK]], [["   cicipi", INK]], [["sajikan", "#7B4FD6"]]];
  function scene24(ctx, b, l, t) {
    const T = { art: at(b, "art,"), seni: at(b, "seni,"), kar: at(b, "karena"), pro: at(b, "menyusun"), ind: at(b, "indah,"), sep: at(b, "seperti"),
      gub: at(b, "menggubah"), pui: at(b, "puisi"), mus: at(b, "musik.") };
    const cm = mkCam(960, 540, 1 + 0.03 * eio(l / b.dur));
    ctx.save(); cm.apply(ctx);
    deskWorld(ctx, t, { cal: c => calendar(c, 1, [9, 9, 9, 9], clamp((eio((l - at(b, "menggubah") + 0.25) / 1.1) - 0.6) / 0.3)) });
    for (let k = 0; k < 7; k++) { const s = SLOT(k); if (k === 0) emptySlot(ctx, s, 1); else book(ctx, s.x, s.y, s.w, s.h, k, { dash: true, num: true, a: 0.45 }); }
    ctx.restore();
    // tirai redup agar buku di depan menonjol (Bip tetap terang di depan tirai)
    ctx.fillStyle = "rgba(14,20,60,0.24)"; ctx.fillRect(0, 0, 1920, 1080);
    const dance = clamp((l - T.gub) / 0.5);
    ctx.save(); cm.apply(ctx);
    B.draw(ctx, BIPW.x, BIPW.y - 14 * dance * Math.abs(Math.sin(l * 4.2)), BIPW.s, l < T.gub ? { t, pose: "diam", mood: "happy", look: [-1, -0.4] } : { t, pose: "diam", mood: "happy", look: [-1, Math.sin(l * 2.1) * 0.4], wave: l * 1.4 });
    ctx.restore();
    const open = eio((l - T.pro + 0.1) / 0.8), staffU = eio((l - T.gub + 0.25) / 1.1);
    // buku: sampul → halaman kode
    // saat musik mulai: buku mengecil ke kiri bawah, paranada mengambil tengah layar
    const bk = 1 - 0.45 * staffU, BC = [CV.x + CV.w / 2, CV.y + CV.h / 2], BN = [lerp(BC[0], 420, staffU), lerp(BC[1], 650, staffU)];
    const bmap = (x, y) => [BN[0] + (x - BC[0]) * bk, BN[1] + (y - BC[1]) * bk];
    ctx.save(); ctx.translate(BN[0], BN[1]); ctx.scale(bk, bk); ctx.translate(-BC[0], -BC[1]);
    ctx.save(); ctx.shadowColor = "rgba(5,8,30,0.5)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; ctx.fillStyle = "#D94F75"; H.rr(ctx, CV.x - 10, CV.y - 10, CV.w + 20, CV.h + 20, 18); ctx.fill(); ctx.restore();
    // halaman kode (di bawah sampul)
    if (open > 0) {
      ctx.fillStyle = CREAM; H.rr(ctx, CV.x, CV.y, CV.w, CV.h, 12); ctx.fill();
      ctx.fillStyle = "rgba(43,58,140,0.08)"; for (let i = 0; i < 9; i++) ctx.fillRect(CV.x + 30, CV.y + 120 + i * 64, CV.w - 60, 2);
      const sh = clamp((l - T.ind) / 0.4) * (1 - staffU);
      if (sh > 0) D.glow(ctx, CV.x + CV.w / 2, CV.y + 330, 380, P.amber, 0.35 * sh * (0.8 + 0.2 * Math.sin(l * 5)));
      CODE.forEach((ln, i) => { const u = clamp((l - T.pro - 0.35 - i * 0.32) / 0.3), a = u * (1 - clamp((staffU - 0.08) / 0.22)); if (a <= 0) return;
        ctx.save(); ctx.globalAlpha *= a; let x = CV.x + 50; const y = CV.y + 200 + i * 110;
        ln.forEach(([s, col]) => { H.text(ctx, s, x, y, 48, { weight: 800, color: col }); ctx.font = `800 48px ${F}`; x += ctx.measureText(s).width; }); ctx.restore(); });
      // saat buku mengecil: baris kode tinggal sebagai garis berwarna
      const ba = clamp((staffU - 0.15) / 0.2);
      if (ba > 0) CODE.forEach((ln, i) => { let x = CV.x + 50; const y = CV.y + 186 + i * 110; ctx.save(); ctx.globalAlpha *= ba;
        ln.forEach(([s, col]) => { ctx.font = `800 48px ${F}`; const w = ctx.measureText(s.trimStart()).width, ind = ctx.measureText(s).width - w;
          ctx.fillStyle = D.hexA(col, 0.55); H.rr(ctx, x + ind, y - 14, w, 22, 11); ctx.fill(); x += ind + w + 14; }); ctx.restore(); });
      if (sh > 0) for (let i = 0; i < 7; i++) sparkle(ctx, CV.x + 40 + hh(i) * (CV.w - 80), CV.y + 150 + hh(i + 9) * 420, 10 + 4 * Math.sin(l * 4 + i), sh * (0.5 + 0.5 * Math.sin(l * 3 + i * 1.7)), l + i);
    }
    // sampul depan (berbalik ke kiri)
    if (open < 1) {
      const c = Math.cos(Math.PI * open), w = CV.w * Math.abs(c);
      if (c > 0) { ctx.save(); ctx.beginPath(); ctx.rect(CV.x, CV.y - 20, w, CV.h + 40); ctx.clip(); ctx.translate(CV.x, 0); ctx.scale(Math.max(0.02, c), 1); ctx.translate(-CV.x, 0);
        const gr = ctx.createLinearGradient(CV.x, 0, CV.x + CV.w, 0); gr.addColorStop(0, "#C83F67"); gr.addColorStop(0.08, "#FF6F91"); gr.addColorStop(1, "#F2608A");
        ctx.fillStyle = gr; H.rr(ctx, CV.x, CV.y, CV.w, CV.h, 12); ctx.fill();
        ctx.fillStyle = "rgba(40,20,70,0.25)"; ctx.fillRect(CV.x + 40, CV.y + 60, CV.w - 80, 6); ctx.fillRect(CV.x + 40, CV.y + CV.h - 70, CV.w - 80, 6);
        // ornamen garis sederhana
        ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 3; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(CV.x + CV.w / 2, CV.y + CV.h - 200, 30 + i * 22, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
        const cx = CV.x + CV.w / 2;
        ctx.font = `800 58px ${F}`; const w1 = ctx.measureText("The ").width, w2 = ctx.measureText("Art").width, w3 = ctx.measureText(" of").width, x0 = cx - (w1 + w2 + w3) / 2, y1 = CV.y + 190;
        const hi = clamp((l - T.art) / 0.3);
        if (hi > 0) { D.glow(ctx, x0 + w1 + w2 / 2, y1 - 20, 130, P.amber, 0.6 * hi); ctx.fillStyle = `rgba(255,214,90,${0.9 * hi})`; H.rr(ctx, x0 + w1 - 8, y1 - 52, (w2 + 16) * eout(hi), 66, 12); ctx.fill(); }
        ctx.save(); ctx.globalAlpha *= clamp((l - 0.25) / 0.3) * clamp((c - 0.9) / 0.08);
        H.text(ctx, "The", x0, y1, 58, { weight: 800, color: "#FFFFFF" }); H.text(ctx, "Art", x0 + w1, y1, 58, { weight: 900, color: hi > 0.5 ? "#7A2141" : "#FFFFFF" }); H.text(ctx, "of", x0 + w1 + w2 + 16, y1, 58, { weight: 800, color: "#FFFFFF" });
        H.text(ctx, "Computer", cx, y1 + 84, 70, { align: "center", weight: 900, color: "#FFFFFF" });
        H.text(ctx, "Programming", cx, y1 + 168, 70, { align: "center", weight: 900, color: "#FFFFFF", fit: CV.w - 60 });
        H.text(ctx, "Jilid 1", cx, CV.y + CV.h - 110, 44, { align: "center", weight: 800, color: "rgba(255,255,255,0.85)" }); ctx.restore();
        ctx.restore(); }
      else { ctx.fillStyle = "#F3E6CC"; H.rr(ctx, CV.x - w, CV.y, w, CV.h, 12); ctx.fill(); }
    }
    ctx.restore();
    // paranada mengalun dengan not (dari baris kode)
    const SY = 400, GAP = 36, X0 = 900, X1 = 1790;
    const wave = (x, k) => Math.sin(x * 0.006 - l * 1.6 + k * 0.25) * 16 * staffU;
    if (staffU > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(staffU * 1.5);
      for (let k = 0; k < 5; k++) { ctx.strokeStyle = "rgba(255,244,214,0.85)"; ctx.lineWidth = 4; ctx.beginPath();
        for (let x = X0; x <= lerp(X0, X1, staffU); x += 20) { const y = SY + (k - 2) * GAP + wave(x, k); x === X0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
      // kunci G sederhana
      ctx.strokeStyle = P.amber; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath();
      for (let i = 0; i <= 40; i++) { const u = i / 40, a = u * TAU * 1.6, r = 46 * (1 - u * 0.55); const x = X0 + 60 + Math.cos(a) * r * 0.6, y = SY + 20 - u * 90 + Math.sin(a) * r; i ? ctx.lineTo(x, y + wave(X0 + 60, 2)) : ctx.moveTo(x, y + wave(X0 + 60, 2)); }
      ctx.stroke(); ctx.restore();
      // not: tiap not berangkat dari posisi kata di halaman kode
      const NOTES = [0, 2, 4, 3, 1, -1, 1, 3, 5, 4, 2, 0, 2, 3];
      NOTES.forEach((p, i) => {
        const line = Math.min(3, Math.floor(i / 3.5)), [sx, sy] = bmap(CV.x + 80 + (i % 4) * 110, CV.y + 190 + line * 110);
        const u = eio(clamp((l - T.gub - 0.2 - i * 0.09) / 0.9)); if (u <= 0) return;
        const drift = Math.max(0, l - T.gub - 1.6) * 34, tx = X0 + 160 + (((i * 52 - drift) % 728) + 728) % 728;
        const ty = SY + 2 * GAP - p * GAP / 2 + wave(tx, 2) - 10 * Math.abs(Math.sin(l * 3 + i));
        const x = lerp(sx, tx, u), y = lerp(sy, ty, u) - Math.sin(Math.PI * u) * 120;
        const col = [P.pink, P.amber, P.teal, P.violet, P.green, P.blue][i % 6];
        ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 0, 21, 15, -0.4, 0, TAU); ctx.fill();
        ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(18, -4); ctx.lineTo(18, -76); ctx.stroke();
        if (i % 3 === 0) { ctx.beginPath(); ctx.moveTo(18, -76); ctx.quadraticCurveTo(44, -60, 36, -34); ctx.stroke(); }
        ctx.restore(); });
    }
    // ---- label layar ----
    { const s = l - T.seni, a = 1 - clamp((l - T.pro + 0.35) / 0.2); if (s > 0 && a > 0) tag("art = seni", 1420, 330, s, { a, col: P.amber, size: 56, to: [CV.x + CV.w / 2 + 40, CV.y + 150] }); }
    const pa = l - T.pui + 0.05, ma = l - T.mus + 0.05;
    if (pa > 0) tag("puisi", 380, 390, pa, { col: P.pink, size: 54 });
    if (ma > 0) tag("musik", 1600, 240, ma, { col: P.teal, size: 54 });
    const pr = l - T.pro - 0.05; if (pr > 0 && staffU < 0.3) tag("program", 1420, 330, pr, { col: P.violet, size: 52, a: 1 - clamp(staffU / 0.3) });
  }

  // ---------- pengarah adegan ----------
  K.SCENES.d04_b2 = function (ctx, b, l, t) {
    if (b.id === "b2_1") return scene21(ctx, b, l, t);
    if (b.id === "b2_2") return scene22(ctx, b, l, t);
    if (b.id === "b2_3") return scene23(ctx, b, l, t);
    return scene24(ctx, b, l, t);
  };
  K.SCENES.d04_b2.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b2 = TL => [
    K.sfxAt(TL, "b2_1", "terbit", 0.1, "shimmer", 0.55),          // jilid 1 menjadi nyata di rak
    K.sfxAt(TL, "b2_1", "tahun", -0.3, "whoosh", 0.4),            // halaman kalender disobek
    K.sfxAt(TL, "b2_1", "delapan,", 0.05, "pop", 0.6),            // angka 8 mendarat: 1968
    K.sfxAt(TL, "b2_1", "dimulai", -0.15, "whoosh", 0.5),         // buku terbang ke penyangga lalu terbuka
    K.sfxAt(TL, "b2_1", "satu kata", 0.05, "pop", 0.5),           // kotak judul disorot
    K.sfxAt(TL, "b2_1", "algoritma.", 0.1, "shimmer", 0.7),       // kata "Algoritma" terisi
    K.sfxAt(TL, "b2_2", "resep", -0.2, "whoosh", 0.5),            // kertas resep terangkat
    K.sfxAt(TL, "b2_2", "secukupnya\".", 0.75, "pop", 0.5),       // stabilo
    K.sfxAt(TL, "b2_2", "Kita mengerti", 0.4, "pop", 0.45),       // centang "kita paham"
    K.sfxAt(TL, "b2_2", "tidak.", 0.0, "pop", 0.6),               // tanda tanya di atas takaran
    K.sfxAt(TL, "b2_2", "algoritma harus", 0.0, "shimmer", 0.55), // judul berbalik: Algoritma
    K.sfxAt(TL, "b2_2", "ditulis", 0.05, "clack", 0.6),           // "secukupnya" dicoret
    K.sfxAt(TL, "b2_2", "sampai komputer", 0.05, "whoosh", 0.5),  // kertas terpecah jadi kartu langkah
    K.sfxAt(TL, "b2_2", "mengikutinya,", 0.4, "pop", 0.4),        // centang langkah terakhir
    K.sfxAt(TL, "b2_2", "jelas", 0.0, "pop", 0.45),               // baris "langkahnya jelas"
    K.sfxAt(TL, "b2_2", "pasti", 0.2, "shimmer", 0.6),            // kartu bendera "Selesai"
    K.sfxAt(TL, "b2_3", "algoritma", -0.05, "pop", 0.5),          // kata algoritma muncul
    K.sfxAt(TL, "b2_3", "berasal", -0.05, "whoosh", 0.5),         // gulungan terbuka
    K.sfxAt(TL, "b2_3", "al-Khwarizmi,", 0.9, "shimmer", 0.6),    // nama berubah menjadi "algoritma"
    K.sfxAt(TL, "b2_3", "ilmuwan", 0.0, "pop", 0.45),             // label ilmuwan Persia
    K.sfxAt(TL, "b2_3", "tahun lalu", 0.0, "pop", 0.6),           // penghitung mendarat di ±1.200 tahun
    K.sfxAt(TL, "b2_4", "art,", 0.05, "pop", 0.55),               // "Art" disorot
    K.sfxAt(TL, "b2_4", "seni,", 0.0, "pop", 0.45),               // label art = seni
    K.sfxAt(TL, "b2_4", "menyusun", -0.1, "whoosh", 0.5),         // sampul terbuka, kode diketik
    K.sfxAt(TL, "b2_4", "indah,", 0.0, "shimmer", 0.5),           // kode berkilau
    K.sfxAt(TL, "b2_4", "menggubah", -0.2, "riser", 0.5),         // kode menjadi paranada
    K.sfxAt(TL, "b2_4", "musik.", 0.05, "shimmer", 0.6),          // not mengalun
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
