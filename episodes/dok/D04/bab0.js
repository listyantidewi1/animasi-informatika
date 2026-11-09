/* D04 bab 0 — Pembuka (b0_1, b0_2, b0_3, b0_4).
   Satu dunia yang terus dibawa: meja kerja hangat di malam hari (lampu meja, jendela, rak dinding berisi buku 1, 2, 3, 4A, 4B
   dan tempat kosong bergaris putus-putus 4C, 4D, 5, 6, 7), dengan kamera sendiri.
   b0_1 lampu menyala, kalender Feb 2026, kacamata (sang profesor), pensil menulis "Shock! Shock!" di kertas catatan;
   b0_2 titik-titik naik dari catatan menjadi kubus 3×3×3; tiga jalur warna (data asli K.KUBUS['3']) disusuri; kartu AI; jam pasir ±1 jam;
   b0_3 papan nama "Donald Knuth"; kamera naik ke rak; 1962; buku menyala satu per satu; tempat kosong berpendar; judul video;
   b0_4 judul naik ke pita atas; cahaya ide dari buku mengalir ke HP (daftar nama, dicari dengan membagi dua); kartu AI + "peran AI?".
   Orang sungguhan tidak digambar: hanya meja, lampu, kacamata, pensil, kertas, label nama. AI digambar sebagai kartu catatan bernomor. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const KL = KIT.latar, KY = KIT.layar, KB = KIT.bipkit, P = D.P, LP = KL.parts;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const S = {};
  const COL3 = ["#FF5A5F", "#4FD67F", "#55A8FF"];          // merah, hijau, biru (warna jalur kubus, dipakai juga bab 7–8)
  const TITLE1 = "Buku yang Ditulis Selama 64 Tahun", TITLE2 = "dan Belum Selesai";
  const TITLE_ONE = "Buku yang Ditulis Selama 64 Tahun dan Belum Selesai";

  // ---------- pembantu ----------
  const ramp = (l, t0, d = 0.5) => clamp((l - t0) / d);
  const camT = (ctx, c) => { ctx.translate(W / 2, HH / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y); };
  const toS = (c, x, y) => [(x - c.x) * c.z + W / 2, (y - c.y) * c.z + HH / 2];
  const drift = (c, t) => ({ x: c.x + Math.sin(t * 0.29) * 5 / c.z, y: c.y + Math.sin(t * 0.21 + 1) * 4 / c.z, z: c.z * (1 + 0.003 * Math.sin(t * 0.17)) });
  const beatOf = (TL, id) => TL.beats.find(x => x.id === id);
  function txt(ctx, s, x, y, size, opt = {}) { D.txt(ctx, s, x, y, size, opt); }
  function grade(ctx, a, col = "#3B4690") { if (a <= 0.01) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, HH); ctx.restore(); }
  function addLight(ctx, x, y, r, col, a) {
    if (a <= 0.01 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = "screen";
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, D.hexA(col, a)); gr.addColorStop(0.4, D.hexA(col, a * 0.42)); gr.addColorStop(1, D.hexA(col, 0));
    ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  }
  // lampu meja menyala dengan kedip singkat
  function lampOn(l, t0) { const u = l - t0; if (u <= 0) return 0; const seq = [0.55, 0.1, 0.8, 0.3, 0.95, 0.7]; return u >= 0.42 ? 1 : seq[Math.floor(u / 0.07)]; }
  // label (layar) dengan muncul pegas
  function tag(ctx, s, x, y, a, opt = {}) {
    if (a <= 0.01) return; const sp = opt.sp == null ? 1 : opt.sp; ctx.save(); ctx.globalAlpha *= clamp(a);
    ctx.translate(x, y); const k = lerp(0.82, 1, sp); ctx.scale(k, k); D.label(ctx, s, 0, 0, { size: opt.size || 48, col: opt.col || P.amber, color: opt.color }); ctx.restore();
  }
  const pop = (l, t0) => ({ a: ramp(l, t0, 0.25), sp: clamp(spring(l - t0, 10, 0.55)) });
  // teks benda (kalender, catatan, punggung buku): tidak digambar bila kotaknya seluruhnya di luar kanvas (kamera sudah pindah)
  function onCanvas(ctx, x, y, w, h) { const m = ctx.getTransform(); const xs = [x, x + w].map(a => m.a * a + m.e), ys = [y, y + h].map(b => m.d * b + m.f);
    return Math.max(...xs) > 0 && Math.min(...xs) < W && Math.max(...ys) > 0 && Math.min(...ys) < HH; }
  // teks benda memudar saat keluar dari tepi bawah/samping layar (dasar teks dalam koordinat layar)
  function edgeA(ctx, x, y, w = 0) { const m = ctx.getTransform(), X0 = m.a * x + m.e, X1 = m.a * (x + w) + m.e, Y = m.d * y + m.f;
    return clamp((960 - Y) / 90) * clamp((X0 - 66) / 60) * clamp((1854 - X1) / 60); }

  // ---------- tata letak dunia (koordinat dunia = layar pada zoom 1) ----------
  const DESK_Y = 560, DESK_F = 930;
  const WIN = { x: 110, y: 96, w: 320, h: 280 };
  const LAMP = { bx: 330, by: 612, jx: 262, jy: 430, hx: 448, hy: 296 };
  const NOTE = { x: 900, y: 745, w: 720, h: 380, sy: 0.92 };
  const CAL = { x: 610, y: 598 };
  const GLS = { x: 1300, y: 655 };
  const HG = { x: 1500, y: 770 };
  const MUG = { x: 1835, y: 652 };
  const SHELF = { x0: 1080, x1: 2150, y: 410, slot: 82, bx: 1104, bw: 72 };
  const BOOKS = [
    { k: "1", c: "#E8665F", h: 196 }, { k: "2", c: "#36B3A3", h: 196 }, { k: "3", c: "#6A7BE0", h: 196 }, { k: "4A", c: "#E9A23B", h: 206 }, { k: "4B", c: "#9A6FD6", h: 206 },
    { k: "4C", h: 206, d: 1 }, { k: "4D", h: 206, d: 1 }, { k: "5", h: 196, d: 1 }, { k: "6", h: 196, d: 1 }, { k: "7", h: 196, d: 1 }];
  const bookX = i => SHELF.bx + i * SHELF.slot;
  const BIP_DESK = { x: 1655, y: 792, s: 210 };
  const BIP_SHELF = { x: 2005, y: SHELF.y - 85, s: 170 };
  const BALLS = [[455, 690, 0.2], [255, 642, 1.3], [1345, 872, 2.2], [1415, 724, 3.1], [470, 880, 4.0]];
  const notePt = (u, v) => [NOTE.x + u, NOTE.y + v * NOTE.sy];

  // ---------- benda-benda ----------
  function wall(ctx, t) {
    const gr = ctx.createLinearGradient(0, 0, 0, DESK_Y); gr.addColorStop(0, "#2A3A7C"); gr.addColorStop(1, "#3D509A");
    ctx.fillStyle = gr; ctx.fillRect(-500, -400, 3000, DESK_Y + 400);
    // motif dinding: garis tegak tipis + titik
    ctx.fillStyle = "rgba(255,255,255,0.035)"; for (let x = -480; x < 2500; x += 64) ctx.fillRect(x, -400, 3, DESK_Y + 400);
    ctx.fillStyle = "rgba(255,255,255,0.05)"; for (let x = -448; x < 2500; x += 64) for (let y = -360; y < DESK_Y - 20; y += 64) { ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); }
    // jendela malam
    LP.windowFrame(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, "#8A6E9E", () => LP.nightView(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, 0));
    addLight(ctx, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, 330, "#9DB8FF", 0.16);
  }
  // lampu meja (lengan berengsel, kap menghadap catatan)
  function lamp(ctx, t, on) {
    const { bx, by, jx, jy, hx, hy } = LAMP;
    ctx.save();
    ctx.fillStyle = "rgba(20,10,10,0.35)"; ctx.beginPath(); ctx.ellipse(bx + 8, by + 8, 74, 16, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2C3570"; ctx.beginPath(); ctx.ellipse(bx, by, 66, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#3C478E"; ctx.beginPath(); ctx.ellipse(bx, by - 8, 60, 14, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#46529E"; ctx.lineCap = "round"; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(bx, by - 12); ctx.lineTo(jx, jy); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx - 4, by - 14); ctx.lineTo(jx - 4, jy); ctx.lineTo(hx - 2, hy - 5); ctx.stroke();
    ctx.fillStyle = "#FFB547"; [[bx, by - 12], [jx, jy], [hx, hy]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.fill(); });
    // kap
    ctx.translate(hx, hy); ctx.rotate(-0.42);
    const sg = ctx.createLinearGradient(-60, 0, 60, 0); sg.addColorStop(0, "#38428A"); sg.addColorStop(0.5, "#5562B4"); sg.addColorStop(1, "#38428A");
    ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(-34, -14); ctx.lineTo(34, -14); ctx.lineTo(70, 92); ctx.lineTo(-70, 92); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2E3778"; ctx.beginPath(); ctx.ellipse(0, -14, 34, 9, 0, 0, TAU); ctx.fill();
    const lit = clamp(on);
    ctx.fillStyle = `rgb(${Math.round(lerp(40, 255, lit))},${Math.round(lerp(48, 236, lit))},${Math.round(lerp(110, 190, lit))})`;
    ctx.beginPath(); ctx.ellipse(0, 92, 70, 15, 0, 0, TAU); ctx.fill();
    ctx.restore();
    if (lit > 0.01) { addLight(ctx, hx + 40, hy + 90, 110, "#FFF2C8", 0.85 * lit); addLight(ctx, hx + 70, hy + 140, 280, "#FFC66E", 0.4 * lit); }
  }
  // rak dinding; lit[i] 0..1 menyala+label untuk buku 0..4, dash 0..1 per tempat kosong 5..9
  function shelf(ctx, t, o = {}) {
    const { x0, x1, y } = SHELF, lit = o.lit || [], dash = o.dash || [], pulse = o.pulse == null ? 1 : o.pulse;
    // penyangga
    ctx.fillStyle = "#6B4632"; [x0 + 60, x1 - 120].forEach(x => { ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x + 18, y + 20); ctx.lineTo(x + 18, y + 90); ctx.closePath(); ctx.fill(); });
    // buku
    BOOKS.forEach((B, i) => {
      const x = bookX(i), w = SHELF.bw, h = B.h, top = y - h;
      if (B.d) {
        const a = clamp(dash[i - 5] || 0); if (a <= 0.01) return;
        const pulse = 0.6 + 0.4 * Math.sin(t * 2.2 + i);
        ctx.save(); ctx.globalAlpha *= a;
        ctx.fillStyle = D.hexA(P.warm, 0.1 + 0.08 * pulse); RR(ctx, x, top, w, h, 8); ctx.fill();
        ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 14; ctx.strokeStyle = D.hexA(P.warm, 0.75 + 0.25 * pulse); ctx.lineWidth = 4; RR(ctx, x + 2, top + 2, w - 4, h - 4, 8); ctx.stroke(); ctx.setLineDash([]);
        addLight(ctx, x + w / 2, top + h / 2, 90, P.warm, 0.18 * pulse * a);
        ctx.save(); ctx.translate(x + w / 2, top + h * 0.5); const k = lerp(0.6, 1, clamp(spring(a * 0.9, 10, 0.5)));
        ctx.scale(k, k); if (onCanvas(ctx, -30, -30, 60, 60)) txt(ctx, B.k, 0, 16, 44, { align: "center", weight: 900, color: P.warm }); ctx.restore();
        ctx.restore(); return;
      }
      const L = clamp(lit[i] || 0);
      ctx.fillStyle = "rgba(10,10,30,0.3)"; ctx.fillRect(x + 6, top + 6, w, h);
      const gr = ctx.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, B.c); gr.addColorStop(0.55, B.c); gr.addColorStop(1, "rgba(20,20,40,0.35)");
      ctx.fillStyle = B.c; RR(ctx, x, top, w, h, 6); ctx.fill(); ctx.fillStyle = gr; RR(ctx, x, top, w, h, 6); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.fillRect(x + 8, top + 18, w - 16, 5); ctx.fillRect(x + 8, top + h - 24, w - 16, 5);
      ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillRect(x + 8, top + 30, w - 16, 3);
      if (L > 0.01) {
        addLight(ctx, x + w / 2, top + h / 2, 130, B.c, 0.45 * L * pulse);
        ctx.save(); ctx.globalAlpha *= L; const k = lerp(0.5, 1, clamp(spring(L * 0.8, 10, 0.5)));
        ctx.translate(x + w / 2, top + h * 0.52); ctx.scale(k, k);
        ctx.fillStyle = "rgba(16,20,56,0.82)"; ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fill();
        if (onCanvas(ctx, -30, -30, 60, 60)) txt(ctx, B.k, 0, 16, B.k.length > 1 ? 44 : 46, { align: "center", weight: 900, color: "#FFFFFF" }); ctx.restore();
      }
    });
    // papan rak
    ctx.fillStyle = "#8A5A3C"; RR(ctx, x0, y, x1 - x0, 24, 5); ctx.fill();
    ctx.fillStyle = "#A8714C"; ctx.fillRect(x0 + 4, y, x1 - x0 - 8, 5);
    ctx.fillStyle = "rgba(10,10,30,0.25)"; ctx.fillRect(x0 + 6, y + 24, x1 - x0 - 12, 8);
  }
  function desk(ctx) {
    const gr = ctx.createLinearGradient(0, DESK_Y, 0, DESK_F); gr.addColorStop(0, "#6E4834"); gr.addColorStop(1, "#9A6848");
    ctx.fillStyle = gr; ctx.fillRect(-500, DESK_Y, 3000, DESK_F - DESK_Y);
    ctx.strokeStyle = "rgba(60,30,20,0.18)"; ctx.lineWidth = 3;
    for (let i = 0; i < 9; i++) { const y = DESK_Y + 26 + i * 40; ctx.beginPath(); ctx.moveTo(-500, y); for (let x = -500; x <= 2500; x += 120) ctx.lineTo(x, y + Math.sin(x * 0.004 + i * 1.7) * 6); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,220,180,0.18)"; ctx.fillRect(-500, DESK_Y, 3000, 4);
    ctx.fillStyle = "#B57D57"; ctx.fillRect(-500, DESK_F, 3000, 10);
    const g2 = ctx.createLinearGradient(0, DESK_F + 10, 0, 1200); g2.addColorStop(0, "#5A3726"); g2.addColorStop(1, "#3A2218");
    ctx.fillStyle = g2; ctx.fillRect(-500, DESK_F + 10, 3000, 400);
  }
  function shadowE(ctx, x, y, rx, ry, a = 0.3) { ctx.save(); ctx.fillStyle = `rgba(30,12,8,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  // tumpukan naskah di kiri depan
  function stack(ctx) {
    const x = 210, y = 830, w = 300, h = 150;
    shadowE(ctx, x + 10, y + 10, w * 0.6, h * 0.42, 0.28);
    for (let i = 0; i < 9; i++) { const dy = -i * 7, dx = Math.sin(i * 2.1) * 8, rot = Math.sin(i * 1.3) * 0.03;
      ctx.save(); ctx.translate(x + dx, y + dy); ctx.rotate(rot);
      ctx.fillStyle = i % 2 ? "#EDE3CF" : "#F6EEDC"; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = "rgba(120,90,60,0.25)"; ctx.fillRect(-w / 2, h / 2 - 3, w, 3); ctx.restore(); }
    ctx.save(); ctx.translate(x + Math.sin(8 * 2.1) * 8, y - 56); ctx.strokeStyle = "rgba(70,80,120,0.45)"; ctx.lineWidth = 3;
    for (let r = 0; r < 5; r++) { ctx.beginPath(); const yy = -52 + r * 24; ctx.moveTo(-120, yy); for (let u = 0; u <= 1; u += 0.05) ctx.lineTo(-120 + u * (r === 4 ? 140 : 230), yy + Math.sin(u * 40 + r) * 2.5); ctx.stroke(); }
    ctx.restore();
  }
  // kalender meja (tenda); flip 0..1 membalik halaman ke FEB, yr 0..1 memunculkan 2026
  function calendar(ctx, t, flip, yr, hide = 0) {
    const { x, y } = CAL, w = 190, h = 168, top = y - h;
    shadowE(ctx, x + 8, y + 4, w * 0.6, 14, 0.3);
    ctx.fillStyle = "#3A447E"; ctx.beginPath(); ctx.moveTo(x - w / 2 - 6, y); ctx.lineTo(x - w / 2 + 14, top - 6); ctx.lineTo(x + w / 2 - 14, top - 6); ctx.lineTo(x + w / 2 + 6, y); ctx.closePath(); ctx.fill();
    const page = (fill) => { ctx.fillStyle = "#FBF6EA"; RR(ctx, x - w / 2 + 10, top + 10, w - 20, h - 18, 8); ctx.fill(); fill(); };
    page(() => {
      ctx.fillStyle = "#E8584F"; RR(ctx, x - w / 2 + 10, top + 10, w - 20, 58, 8); ctx.fill(); ctx.fillRect(x - w / 2 + 10, top + 50, w - 20, 18);
      const a = clamp(flip);
      const show = !hide && onCanvas(ctx, x - w / 2, top, w, h), ea = edgeA(ctx, x - 70, top + 136, 140);
      if (a > 0 && show) { ctx.save(); ctx.globalAlpha *= a * ea; txt(ctx, "FEB", x, top + 56, 46, { align: "center", weight: 900, color: "#FFFFFF" }); ctx.restore(); }
      if (yr > 0 && show) { ctx.save(); ctx.globalAlpha *= clamp(yr) * ea; txt(ctx, "2026", x, top + 136, 54, { align: "center", weight: 900, color: "#27306A" }); ctx.restore(); }
      else { ctx.fillStyle = "rgba(40,50,110,0.25)"; for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { ctx.beginPath(); ctx.arc(x - 66 + c * 26, top + 92 + r * 22, 5, 0, TAU); ctx.fill(); } }
    });
    // halaman lama (Jan, tanpa tulisan) terlipat ke atas
    const f = eio(clamp(flip));
    if (f < 1) { ctx.save(); const ph = top + 10, sc = Math.cos(f * Math.PI);
      ctx.translate(x, ph); ctx.scale(1, sc); ctx.fillStyle = sc > 0 ? "#F4EEDF" : "#D9D2C0"; RR(ctx, -w / 2 + 10, 0, w - 20, h - 18, 8); ctx.fill();
      if (sc > 0) { ctx.fillStyle = "#8D97C9"; RR(ctx, -w / 2 + 10, 0, w - 20, 58, 8); ctx.fill(); ctx.fillStyle = "rgba(40,50,110,0.22)";
        for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { ctx.beginPath(); ctx.arc(-66 + c * 26, 92 + r * 22, 5, 0, TAU); ctx.fill(); } }
      ctx.restore(); }
    ctx.fillStyle = "#9AA2C8"; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(x - 72 + i * 24, top + 8, 5, 0, TAU); ctx.fill(); }
  }
  function glasses(ctx, t, glow) {
    const { x, y } = GLS;
    if (glow > 0.01) addLight(ctx, x, y - 4, 150, P.warm, 0.5 * glow);
    shadowE(ctx, x + 10, y + 26, 110, 18, 0.3);
    ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.72);
    ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 7;
    // gagang terlipat
    ctx.beginPath(); ctx.moveTo(-86, -10); ctx.lineTo(70, -34); ctx.moveTo(86, -10); ctx.lineTo(-40, -36); ctx.stroke();
    [-46, 46].forEach(cx => {
      ctx.fillStyle = "rgba(190,220,255,0.28)"; ctx.beginPath(); ctx.arc(cx, 0, 38, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 7; ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, 0, 26, -2.4, -1.6); ctx.stroke();
    });
    ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-10, -6); ctx.quadraticCurveTo(0, -18, 10, -6); ctx.stroke();
    ctx.restore();
  }
  function mug(ctx, t) {
    const { x, y } = MUG;
    shadowE(ctx, x + 6, y + 4, 62, 14, 0.3);
    ctx.fillStyle = "#E06A5C"; RR(ctx, x - 48, y - 104, 96, 104, 14); ctx.fill();
    ctx.strokeStyle = "#E06A5C"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(x + 52, y - 54, 24, -1.3, 1.3); ctx.stroke();
    ctx.fillStyle = "#5A2E22"; ctx.beginPath(); ctx.ellipse(x, y - 104, 44, 10, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillRect(x - 36, y - 92, 10, 76);
    // uap
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) { const u = (t * 0.32 + i / 3) % 1; ctx.strokeStyle = `rgba(235,240,255,${0.35 * Math.sin(u * Math.PI)})`; ctx.lineWidth = 7;
      ctx.beginPath(); for (let k = 0; k <= 10; k++) { const v = k / 10, yy = y - 118 - u * 120 - v * 70, xx = x - 14 + i * 14 + Math.sin(v * 5 + t * 1.8 + i) * 12; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  }
  // pensil: ujung di (x, y), badan ke arah sudut ang (radian) dari ujung ke penghapus; lift 0..1 = bayangan menjauh
  function pencil(ctx, x, y, ang, lift = 0) {
    const L = 250;
    ctx.save();
    ctx.save(); ctx.translate(x + 10 + lift * 18, y + 6 + lift * 22); ctx.rotate(ang); ctx.fillStyle = `rgba(30,12,8,${0.26 - lift * 0.16})`; RR(ctx, 0, -9, L * (1 - lift * 0.35), 18, 9); ctx.fill(); ctx.restore();
    ctx.translate(x, y); ctx.rotate(ang);
    ctx.fillStyle = "#E9C08B"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(40, -11); ctx.lineTo(40, 11); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#3A3F55"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(13, -3.6); ctx.lineTo(13, 3.6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#F4C542"; ctx.fillRect(40, -11, L - 80, 22);
    ctx.fillStyle = "#D9A72C"; ctx.fillRect(40, 3, L - 80, 8); ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillRect(40, -9, L - 80, 4);
    ctx.fillStyle = "#B9C0D4"; ctx.fillRect(L - 40, -12, 18, 24); ctx.fillStyle = "#8E95AE"; ctx.fillRect(L - 34, -12, 3, 24); ctx.fillRect(L - 27, -12, 3, 24);
    ctx.fillStyle = "#F08FA0"; RR(ctx, L - 22, -11, 24, 22, 6); ctx.fill();
    ctx.restore();
  }
  // kertas catatan bergaris; s1/s2 = jumlah huruf "Shock!" yang sudah tertulis (boleh pecahan); scrib 0..1 = baris coretan berikutnya
  const SHOCK = "Shock!", SH_SIZE = 82, SH_U0 = -282, SH_V = -88;
  let shockW = null;
  function shockLayout(ctx) {
    if (shockW) return shockW; ctx.save(); ctx.font = `italic 800 ${SH_SIZE}px ${FONT}`;
    const pre = []; for (let i = 0; i <= SHOCK.length; i++) pre.push(ctx.measureText(SHOCK.slice(0, i)).width);
    const sp = ctx.measureText(SHOCK + " ").width; ctx.restore(); shockW = { pre, sp }; return shockW;
  }
  // posisi ujung pensil (koordinat dunia) saat menulis huruf ke-n (pecahan) pada baris "Shock!" ke-row
  function shockTip(ctx, row, n) { const S2 = shockLayout(ctx), i = Math.floor(clamp(n, 0, 6)), f = clamp(n, 0, 6) - i;
    const x = SH_U0 + row * S2.sp + lerp(S2.pre[i], S2.pre[Math.min(6, i + 1)], f); return notePt(x, SH_V - 26 + Math.sin(n * 7) * 16); }
  const SCRIB = [[-282, -10, 560], [-282, 46, 600], [-282, 102, 380]];
  function scribTip(s) { const k = Math.min(2, Math.floor(s * 3)), f = s * 3 - k, [u, v, w] = SCRIB[k]; return notePt(u + w * f, v - 8 + Math.sin(f * 60) * 6); }
  function note(ctx, t, s1, s2, scrib, hi = 0) {
    const { x, y, w, h, sy } = NOTE;
    shadowE(ctx, x + 14, y + 16, w * 0.54, h * 0.5 * sy, 0.32);
    ctx.save(); ctx.translate(x, y); ctx.scale(1, sy);
    ctx.fillStyle = "#E9E0CC"; ctx.fillRect(-w / 2 + 8, -h / 2 + 8, w, h);
    ctx.fillStyle = "#FBF7EC"; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = "rgba(90,140,220,0.35)"; ctx.lineWidth = 2.5; for (let v = -h / 2 + 46; v < h / 2 - 10; v += 56) { ctx.beginPath(); ctx.moveTo(-w / 2 + 12, v); ctx.lineTo(w / 2 - 12, v); ctx.stroke(); }
    ctx.strokeStyle = "rgba(230,90,90,0.5)"; ctx.beginPath(); ctx.moveTo(-w / 2 + 64, -h / 2); ctx.lineTo(-w / 2 + 64, h / 2); ctx.stroke();
    ctx.fillStyle = "#DCD3BE"; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(-w / 2 + 90 + i * 70, -h / 2 + 14, 7, 0, TAU); ctx.fill(); }
    ctx.restore();
    // tulisan (tanpa penskalaan vertikal supaya huruf tidak gepeng)
    const L = shockLayout(ctx);
    if (hi > 0.01) { const [hx, hy] = notePt(SH_U0 - 16, SH_V - 78), ww = L.sp + L.pre[6] + 32; ctx.fillStyle = `rgba(255,214,80,${0.42 * hi})`; RR(ctx, hx, hy, ww * clamp(hi * 1.5), 100, 14); ctx.fill(); }
    [[s1, 0], [s2, 1]].forEach(([n, row]) => {
      if (n <= 0) return; const [bx, by] = notePt(SH_U0 + row * L.sp, SH_V);
      const ea = edgeA(ctx, bx, by, L.pre[6]); if (ea <= 0.01 || !onCanvas(ctx, bx, by - SH_SIZE * 0.78, L.pre[6] + 20, SH_SIZE * 0.8)) return;
      // seluruh kata digambar sekali, dibuka huruf demi huruf dengan klip (huruf terakhir ikut memudar masuk)
      const i = Math.min(6, Math.floor(n)), f = clamp(n - i), xr = bx + L.pre[i] + (i < 6 ? (L.pre[i + 1] - L.pre[i]) * eout(f) : 30);
      ctx.save(); ctx.beginPath(); ctx.rect(bx - 30, by - SH_SIZE * 1.2, xr - bx + 30 + (n >= 6 ? 20 : 0), SH_SIZE * 1.6); ctx.clip();
      ctx.font = `italic 800 ${SH_SIZE}px ${FONT}`; ctx.fillStyle = "#26306E"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.globalAlpha *= ea; ctx.fillText(SHOCK, bx, by); ctx.restore();
    });
    if (scrib > 0) { ctx.save(); ctx.strokeStyle = "#3A4580"; ctx.lineWidth = 4.5; ctx.lineCap = "round"; ctx.lineJoin = "round";
      SCRIB.forEach(([u, v, ww], k) => { const f = clamp(scrib * 3 - k); if (f <= 0) return; ctx.beginPath();
        for (let q = 0; q <= f * 60; q++) { const uu = q / 60, [px, py] = notePt(u + ww * uu, v); const yy = py - 10 + Math.sin(uu * 60 + k) * 7 + Math.sin(uu * 13 + k * 2) * 4 - (Math.sin(uu * 23 + k) > 0.6 ? 12 : 0);
          q ? ctx.lineTo(px, yy) : ctx.moveTo(px, yy); } ctx.stroke(); });
      ctx.restore(); }
  }
  // bola kertas kusut
  function ball(ctx, x, y, r, a, seed) {
    if (a <= 0.01) return; const s = clamp(spring(a, 10, 0.5)); ctx.save(); ctx.globalAlpha *= clamp(a * 3);
    shadowE(ctx, x + 6, y + r * 0.8, r * 1.05, r * 0.3, 0.3);
    ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(seed);
    const rn = D.rng(Math.floor(seed * 100)); ctx.fillStyle = "#F2EBDA"; ctx.beginPath();
    for (let i = 0; i < 12; i++) { const ang = i / 12 * TAU, rr = r * (0.82 + rn() * 0.3); i ? ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr) : ctx.moveTo(Math.cos(ang) * rr, Math.sin(ang) * rr); } ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(120,100,70,0.45)"; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo((rn() - 0.5) * r, (rn() - 0.5) * r); ctx.lineTo((rn() - 0.5) * r * 1.2, (rn() - 0.5) * r * 1.2); ctx.lineTo((rn() - 0.5) * r, (rn() - 0.5) * r); ctx.stroke(); }
    ctx.restore();
  }
  // jam pasir; sand 0..1 = pasir yang sudah turun
  function hourglass(ctx, x, y, h, a, sand, t) {
    if (a <= 0.01) return; const s = clamp(spring(a, 9, 0.5)); ctx.save(); ctx.globalAlpha *= clamp(a * 2.5);
    ctx.translate(x, y); ctx.scale(s, s);
    const w = h * 0.52, bh = (h - 2 * h * 0.08) / 2, top = -h / 2;
    shadowE(ctx, 6, h / 2 + 2, w * 0.7, 12, 0.3);
    addLight(ctx, 0, 0, h * 0.8, P.warm, 0.18);
    // kaca
    const bulb = (dir) => { ctx.beginPath(); const y0 = dir < 0 ? top + h * 0.08 : 0, y1 = dir < 0 ? 0 : h / 2 - h * 0.08;
      if (dir < 0) { ctx.moveTo(-w * 0.42, y0); ctx.bezierCurveTo(-w * 0.46, y0 + bh * 0.6, -w * 0.08, y1 - bh * 0.2, -w * 0.05, y1); ctx.lineTo(w * 0.05, y1); ctx.bezierCurveTo(w * 0.08, y1 - bh * 0.2, w * 0.46, y0 + bh * 0.6, w * 0.42, y0); }
      else { ctx.moveTo(-w * 0.05, y0); ctx.bezierCurveTo(-w * 0.08, y0 + bh * 0.2, -w * 0.46, y1 - bh * 0.6, -w * 0.42, y1); ctx.lineTo(w * 0.42, y1); ctx.bezierCurveTo(w * 0.46, y1 - bh * 0.6, w * 0.08, y0 + bh * 0.2, w * 0.05, y0); }
      ctx.closePath(); };
    ctx.fillStyle = "rgba(200,225,255,0.22)"; bulb(-1); ctx.fill(); bulb(1); ctx.fill();
    // pasir
    const sd = clamp(sand);
    ctx.save(); bulb(-1); ctx.clip(); ctx.fillStyle = "#F2C46B"; const ty = lerp(top + h * 0.18, -2, sd); ctx.fillRect(-w, ty, 2 * w, -ty + 2); ctx.restore();
    ctx.save(); bulb(1); ctx.clip(); ctx.fillStyle = "#F2C46B"; const pyk = h / 2 - h * 0.08 - bh * 0.75 * sd;
    ctx.beginPath(); ctx.moveTo(-w * 0.5, h / 2); ctx.lineTo(-w * 0.5, pyk + bh * 0.2); ctx.quadraticCurveTo(0, pyk - bh * 0.18, w * 0.5, pyk + bh * 0.2); ctx.lineTo(w * 0.5, h / 2); ctx.closePath(); ctx.fill(); ctx.restore();
    if (sd < 1 && sd > 0) { ctx.strokeStyle = "#F2C46B"; ctx.lineWidth = 4; ctx.setLineDash([6, 5]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, pyk); ctx.stroke(); ctx.setLineDash([]); }
    ctx.strokeStyle = "rgba(230,240,255,0.7)"; ctx.lineWidth = 4; bulb(-1); ctx.stroke(); bulb(1); ctx.stroke();
    // bingkai kayu
    ctx.fillStyle = "#8A5A3C"; RR(ctx, -w / 2 - 8, top, w + 16, h * 0.08, 6); ctx.fill(); RR(ctx, -w / 2 - 8, h / 2 - h * 0.08, w + 16, h * 0.08, 6); ctx.fill();
    ctx.fillStyle = "#6B4632"; [-1, 1].forEach(d => ctx.fillRect(d * (w / 2 - 2) - 5, top + h * 0.08, 10, h - h * 0.16));
    ctx.restore();
  }
  // kartu catatan bernomor (gambaran AI yang abstrak, tanpa wajah/logo); a[i] 0..1 per kartu
  function aiCards(ctx, cx, cy, s, a, t, opt = {}) {
    const n = a.length, gap = 0.62 * s, pts = [];
    for (let i = 0; i < n; i++) { const ai = clamp(a[i]); if (ai <= 0.01) { pts.push(null); continue; }
      const x = cx + (i - (n - 1) / 2) * gap, y = cy + Math.abs(i - (n - 1) / 2) * s * 0.08 + Math.sin(t * 1.4 + i) * 5, rot = (i - (n - 1) / 2) * 0.09;
      pts.push([x, y]); }
    // garis cahaya penghubung
    ctx.save(); ctx.globalCompositeOperation = "screen";
    for (let i = 0; i + 1 < n; i++) { const p = pts[i], q = pts[i + 1]; if (!p || !q) continue; const al = Math.min(clamp(a[i]), clamp(a[i + 1]));
      ctx.strokeStyle = D.hexA(P.teal, 0.55 * al); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(p[0], p[1] - s * 0.45); ctx.quadraticCurveTo((p[0] + q[0]) / 2, p[1] - s * 0.8, q[0], q[1] - s * 0.45); ctx.stroke();
      const u = (t * 0.7 + i * 0.3) % 1, bx = lerp(lerp(p[0], (p[0] + q[0]) / 2, u), lerp((p[0] + q[0]) / 2, q[0], u), u), by = lerp(lerp(p[1] - s * 0.45, p[1] - s * 0.8, u), lerp(p[1] - s * 0.8, q[1] - s * 0.45, u), u);
      D.glow(ctx, bx, by, 26, P.teal, al); }
    ctx.restore();
    pts.forEach((p, i) => { if (!p) return; const ai = clamp(a[i]), sp = clamp(spring(ai * 1.2, 10, 0.5));
      ctx.save(); ctx.globalAlpha *= clamp(ai * 3); ctx.translate(p[0], p[1]); ctx.rotate((i - (n - 1) / 2) * 0.09); ctx.scale(sp, sp);
      const w = s * 0.56, h = s * 0.74;
      addLight(ctx, 0, 0, s * 0.7, opt.glow || P.teal, 0.22);
      ctx.fillStyle = "rgba(10,14,40,0.35)"; RR(ctx, -w / 2 + 6, -h / 2 + 8, w, h, 12); ctx.fill();
      ctx.fillStyle = "#EEF3FF"; RR(ctx, -w / 2, -h / 2, w, h, 12); ctx.fill();
      ctx.strokeStyle = D.hexA(P.teal, 0.9); ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = P.teal; RR(ctx, -w / 2, -h / 2, w, h * 0.16, 12); ctx.fill(); ctx.fillRect(-w / 2, -h / 2 + h * 0.08, w, h * 0.08);
      txt(ctx, String(i + 1), 0, h * 0.12, Math.max(48, s * 0.3), { align: "center", weight: 900, color: "#1E2766" });
      ctx.fillStyle = "rgba(40,50,110,0.3)"; [0.28, 0.38].forEach((v, k) => ctx.fillRect(-w * 0.32, h * v, w * (k ? 0.4 : 0.64), 5));
      ctx.restore(); });
  }
  // debu melayang di cahaya lampu (gerak sekunder)
  function dust(ctx, t, a) {
    if (a <= 0.01) return; const r = D.rng(41); ctx.save(); ctx.fillStyle = "#FFE9C2";
    for (let i = 0; i < 46; i++) { const bx = 520 + r() * 760, by = 300 + r() * 420, ph = r() * TAU, sp = 5 + r() * 9, rad = 1.6 + r() * 2.4;
      const x = bx + Math.sin(t * 0.33 + ph) * 34, y = by - ((t * sp + ph * 30) % 140) + 70;
      ctx.globalAlpha = a * (0.16 + 0.24 * (0.5 + 0.5 * Math.sin(t * 1.2 + ph))); ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  // ---------- kubus 3×3×3 (proyeksi isometrik sederhana) ----------
  function proj(cx, cy, Sz, yaw, pitch) {
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    return (i, j, k) => { const x = i - 1, y = k - 1, z = j - 1, xr = x * cyw + z * syw, zr = -x * syw + z * cyw;
      return { x: cx + xr * Sz, y: cy - (y * cp + zr * sp) * Sz, d: zr * cp - y * sp }; };
  }
  const R3 = K.KUBUS ? K.KUBUS["3"] : null;
  const rid = s => [+s[0], +s[1], +s[2]];
  // o: rise 0..1 per titik (fungsi n -> 0..1) + asal, prog[c] 0..27, alpha, dim
  function cube(ctx, t, cx, cy, Sz, yaw, o = {}) {
    const pr = proj(cx, cy, Sz, yaw, 0.5), a = o.alpha == null ? 1 : o.alpha; if (a <= 0.01) return;
    ctx.save(); ctx.globalAlpha *= a;
    const rooms = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) rooms.push([i, j, k]);
    const lat = o.lattice == null ? 1 : o.lattice;
    D.glow(ctx, cx, cy, Sz * 3.2, "#5A6BD8", 0.25 * lat);
    // kisi tipis (54 sisi dalam)
    if (lat > 0.01) { ctx.save(); ctx.globalAlpha *= lat; ctx.strokeStyle = "rgba(205,218,255,0.32)"; ctx.lineWidth = 3;
      rooms.forEach(([i, j, k]) => { const p = pr(i, j, k); [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(([di, dj, dk]) => { if (i + di > 2 || j + dj > 2 || k + dk > 2) return; const q = pr(i + di, j + dj, k + dk); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }); });
      ctx.restore(); }
    // jalur warna
    if (R3 && o.prog) o.prog.forEach((pg, c) => { if (pg <= 0) return; const seq = R3[c], col = COL3[c];
      const segs = []; // daftar ruas [x0,y0,x1,y1,fadeStart?]
      const nS = Math.min(27, pg);
      for (let s = 0; s < Math.ceil(nS); s++) { const A = rid(seq[s]), B = rid(seq[(s + 1) % 27]), f = clamp(nS - s);
        let ax = -1; for (let q = 0; q < 3; q++) if (A[q] !== B[q]) ax = q;
        const wrap = A[ax] === 2 && B[ax] === 0, e = [0, 0, 0]; e[ax] = 1;
        if (!wrap) { const p = pr(...A), q2 = pr(A[0] + e[0] * f, A[1] + e[1] * f, A[2] + e[2] * f); segs.push([p.x, p.y, q2.x, q2.y, 0]); }
        else { const f1 = clamp(f * 2), f2 = clamp(f * 2 - 1);
          const p = pr(...A), q1 = pr(A[0] + e[0] * 0.42 * f1, A[1] + e[1] * 0.42 * f1, A[2] + e[2] * 0.42 * f1); segs.push([p.x, p.y, q1.x, q1.y, 1]);
          if (f2 > 0) { const r0 = pr(B[0] - e[0] * 0.42, B[1] - e[1] * 0.42, B[2] - e[2] * 0.42), r1 = pr(B[0] - e[0] * 0.42 * (1 - f2), B[1] - e[1] * 0.42 * (1 - f2), B[2] - e[2] * 0.42 * (1 - f2)); segs.push([r0.x, r0.y, r1.x, r1.y, 2]); } }
      }
      const dimC = o.dim ? o.dim[c] : 1;
      ctx.save(); ctx.lineCap = "round"; ctx.globalAlpha *= dimC;
      [[18, 0.25, "lighter"], [7, 1, "source-over"]].forEach(([lw, al, mode]) => { ctx.globalCompositeOperation = mode; segs.forEach(([x0, y0, x1, y1, kind]) => {
        if (kind) { const gr = ctx.createLinearGradient(x0, y0, x1, y1); const aa = kind === 1 ? [al, al * 0.1] : [al * 0.1, al]; gr.addColorStop(0, D.hexA(col, aa[0])); gr.addColorStop(1, D.hexA(col, aa[1])); ctx.strokeStyle = gr; ctx.setLineDash([10, 8]); }
        else { ctx.strokeStyle = D.hexA(col, al); ctx.setLineDash([]); }
        ctx.lineWidth = lw * Sz / 120; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }); });
      ctx.setLineDash([]); ctx.globalCompositeOperation = "lighter";
      if (pg < 27 && segs.length) { const L = segs[segs.length - 1]; D.glow(ctx, L[2], L[3], 40 * Sz / 120, col, 1); }
      ctx.restore(); });
    // titik ruangan, jauh dulu
    const order = rooms.map(r => ({ r, p: pr(...r) })).sort((A, B) => B.p.d - A.p.d);
    order.forEach(({ r, p }, idx) => {
      const n = r[0] * 9 + r[1] * 3 + r[2], ru = o.rise ? o.rise(n) : 1; if (ru <= 0.001) return;
      let x = p.x, y = p.y; if (o.from && ru < 1) { const [fx, fy] = o.from(n), e = eio(ru); x = lerp(fx, p.x, e); y = lerp(fy, p.y, e) - Math.sin(e * Math.PI) * 60; }
      const rad = (11 - p.d * 2.4) * Sz / 120;
      ctx.save(); ctx.globalAlpha *= clamp(ru * 3);
      D.glow(ctx, x, y, rad * 3, "#CFE0FF", 0.4);
      ctx.fillStyle = r.join("") === "000" && o.start ? P.warm : "#F2F6FF"; ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill(); ctx.restore();
    });
    ctx.restore();
  }

  // ---------- adegan lengkap: meja ----------
  // o: lamp, night (gelap tambahan), book{lit,dash}, cal{flip,yr}, glassGlow, note{s1,s2,scrib,hi}, pen{x,y,ang,lift}, balls[], hg{a,sand},
  //    bip(ctx) (di meja) | bipShelf(ctx) (di rak), cubeFn(ctx) (di atas meja, sebelum Bip), extra(ctx)
  function world(ctx, t, o = {}) {
    wall(ctx, t);
    lamp(ctx, t, o.lamp || 0);
    shelf(ctx, t, o.book || {});
    if (o.bipShelf) o.bipShelf(ctx);
    desk(ctx);
    calendar(ctx, t, o.cal ? o.cal.flip : 1, o.cal ? o.cal.yr : 1, o.calHide);
    stack(ctx);
    glasses(ctx, t, o.glassGlow || 0);
    mug(ctx, t);
    const n = o.note || { s1: 6, s2: 6, scrib: 0 };
    note(ctx, t, n.s1, n.s2, n.scrib, n.hi || 0);
    (o.balls || []).forEach((a, i) => ball(ctx, BALLS[i][0], BALLS[i][1], 38, a, BALLS[i][2]));
    if (o.hg) hourglass(ctx, HG.x, HG.y, 210, o.hg.a, o.hg.sand, t);
    const pn = o.pen || { x: 1150, y: 872, ang: -0.18, lift: 0 }; pencil(ctx, pn.x, pn.y, pn.ang, pn.lift);
    if (o.extra) o.extra(ctx);
    if (o.bip) o.bip(ctx);
    // cahaya: malam (multiply biru) lalu genangan hangat lampu
    const lp = clamp(o.lamp || 0);
    grade(ctx, 0.24 * (1 - lp) + (o.night || 0));
    if (lp > 0.01) {
      KL.parts.warmPool(ctx, 880, 730, 720, 0.62 * lp, 0.5);
      KL.parts.warmPool(ctx, LAMP.hx + 40, LAMP.hy + 30, 420, 0.42 * lp, 1);
      addLight(ctx, LAMP.hx + 45, LAMP.hy + 95, 150, "#FFE7B0", 0.5 * lp);
    }
    dust(ctx, t, 0.5 + 0.5 * lp);
    if (o.cubeFn) o.cubeFn(ctx);
    if (o.front) o.front(ctx);
  }

  // =====================================================================
  // b0_1: lampu menyala → kalender Feb 2026 → kacamata (profesor 88 tahun) → pensil menulis "Shock! Shock!" → artinya "Kaget! Kaget!"
  function b1Cam(b, l) {
    const tW = D.at(b, "menulis"), tS = D.at(b, '"Shock!');
    return D.path([[0, 905, 640, 1.2], [5.4, 960, 585, 1.02], [tW - 0.1, 960, 585, 1.02], [tS - 0.15, 900, 700, 1.52], [b.dur + 1, 892, 702, 1.6]], l);
  }
  function b1State(ctx, b, l, t) {
    const tFeb = D.at(b, "Februari"), tYr = D.at(b, "dua ribu"), tW = D.at(b, "menulis"), tS1 = D.at(b, '"Shock!'), tS1e = D.atEnd(b, '"Shock!'),
      tS2 = D.at(b, 'Shock!",'), tS2e = D.atEnd(b, 'Shock!",'), tArt = D.at(b, "artinya"), tKag = D.at(b, '"Kaget!');
    // huruf ditulis: sedikit lebih panjang dari kata yang diucapkan supaya "satu per satu" terlihat
    const s1 = 6 * clamp((l - tS1 + 0.05) / Math.max(0.7, tS1e - tS1 + 0.15)), s2 = 6 * clamp((l - tS2 + 0.05) / Math.max(0.7, tS2e - tS2 + 0.25));
    const scrib = 0;
    // pensil: diam di meja → naik ke awal tulisan → menulis → coretan → kembali ke meja
    const rest = { x: 1150, y: 872, ang: -0.18, lift: 0 };
    let pen = rest;
    const [sx0, sy0] = shockTip(ctx, 0, 0);
    if (l > tW) {
      const go = eio(ramp(l, tW, tS1 - tW - 0.1));
      let tip = [lerp(rest.x, sx0, go), lerp(rest.y, sy0, go) - Math.sin(go * Math.PI) * 60], ang = lerp(rest.ang, -1.08, go), lift = go;
      if (l >= tS1 - 0.1) {
        if (s1 < 6) tip = shockTip(ctx, 0, s1);
        else if (l < tS2) { const u = eio(ramp(l, tS1e + 0.1, Math.max(0.2, tS2 - tS1e - 0.2))); const a0 = shockTip(ctx, 0, 6), a1 = shockTip(ctx, 1, 0); tip = [lerp(a0[0], a1[0], u), lerp(a0[1], a1[1], u) - Math.sin(u * Math.PI) * 24]; }
        else if (s2 < 6) tip = shockTip(ctx, 1, s2);
        else { const u = eio(ramp(l, tS2e + 0.25, 0.9)), a0 = shockTip(ctx, 1, 6); tip = [lerp(a0[0], rest.x, u), lerp(a0[1], rest.y, u) - Math.sin(u * Math.PI) * 50]; ang = lerp(-1.08, rest.ang, u); lift = 1 - u; }
      }
      pen = { x: tip[0], y: tip[1], ang, lift };
    }
    return { tFeb, tYr, tW, tS1, tS2, tArt, tKag, s1, s2, scrib, pen, lampV: lampOn(l, 0.12) };
  }
  function bipB1(ctx, b, l, t, st) {
    const tWalk = st.tW + 0.2, arrive = st.tS1 - 0.3, k = l - st.tS1 - 0.05;
    const u = eio(ramp(l, tWalk, arrive - tWalk)), x = lerp(BIP_DESK.x, 1370, u), y = lerp(BIP_DESK.y, 805, u);
    let o;
    if (l < 0.6) o = { pose: "diam", t, mood: "think", look: [-0.6, -0.3] };
    else if (l < tWalk) o = { pose: "diam", t, mood: l > st.tFeb ? "happy" : "think", look: l > 3.4 ? [-0.6, -0.2] : [-0.9, -0.4] };
    else if (u < 1) o = { pose: "jalan", t, dir: -1 };
    else if (k >= 0 && k < 1.4) o = { pose: "kaget", t, k, mood: "wow" };
    else o = { pose: "diam", t, mood: "wow", look: [-0.9, 0.3] };
    KB.draw(ctx, x, y, BIP_DESK.s, o);
  }
  S.b0_1 = function (ctx, b, l, t, TL) {
    const st = b1State(ctx, b, l, t), c = drift(b1Cam(b, l), t);
    const tProf = D.at(b, "profesor"), t88 = D.at(b, "delapan puluh");
    const gl = ramp(l, tProf - 0.1, 0.5) * (1 - ramp(l, st.tW + 0.3, 0.8));
    ctx.save(); camT(ctx, c);
    world(ctx, t, {
      lamp: st.lampV, cal: { flip: ramp(l, st.tFeb - 0.05, 0.5), yr: ramp(l, st.tYr, 0.4) }, glassGlow: gl,
      note: { s1: st.s1, s2: st.s2, scrib: st.scrib, hi: ramp(l, st.tKag - 0.1, 0.6) }, pen: st.pen,
      bip: cx => bipB1(cx, b, l, t, st),
    });
    ctx.restore();
    // layar gelap di awal: memudar cepat begitu lampu menyala
    const dk = 1 - ramp(l, 0.0, 0.5);
    if (dk > 0.01) { ctx.fillStyle = `rgba(6,8,24,${0.12 * dk})`; ctx.fillRect(0, 0, W, HH); }
    D.post(cx => {
      // profesor · 88 tahun (di atas kacamata)
      const fa = 1 - ramp(l, st.tW + 0.2, 0.5);
      const [gx, gy] = toS(c, GLS.x, GLS.y - 150);
      const p1 = pop(l, tProf), p2 = pop(l, t88);
      tag(cx, "seorang profesor", gx, gy - 46, p1.a * fa, { sp: p1.sp, col: P.warm, size: 46 });
      tag(cx, "88 tahun", gx, gy + 40, p2.a * fa, { sp: p2.sp, col: P.amber, size: 52 });
      // "Feb 2026" (di atas kalender)
      const [kx, ky] = toS(c, CAL.x, CAL.y - 220), p3 = pop(l, st.tYr + 0.35);
      tag(cx, "Februari 2026", kx, ky, p3.a * (1 - ramp(l, 3.3, 0.5)), { sp: p3.sp, col: "#FF8A80", size: 46 });
      // terjemahan
      const p4 = pop(l, st.tKag);
      const [nx, ny] = toS(c, NOTE.x + 40, NOTE.y + 130);
      if (p4.a > 0) { cx.save(); cx.globalAlpha = p4.a; cx.translate(nx, Math.min(ny, 820)); const k = lerp(0.8, 1, p4.sp); cx.scale(k, k);
        const s = "artinya: “Kaget! Kaget!”"; D.label(cx, s, 0, 0, { size: 60, col: P.amber }); cx.restore(); }
    });
  };

  // =====================================================================
  // b0_2: titik naik dari catatan → kubus 3×3×3; bola kertas (berminggu-minggu); 3 jalur warna; kartu AI; jam pasir ±1 jam
  const CUBE = { x: 905, y: 322, s: 140 };
  function b2Times(b) {
    return { tTk: D.at(b, "Teka-teki"), tMg: D.at(b, "berminggu-minggu"), tPk: D.atEnd(b, "pikirkan"), tTp: D.at(b, "terpecahkan"), tSb: D.at(b, "sebagian"),
      tAI: D.at(b, "AI"), tJam: D.at(b, "satu jam"), tEnd: D.speechEnd(b) };
  }
  function b2Prog(T, l) {
    // merah: "terpecahkan …", hijau: "… bantuan AI", biru: "… satu jam"; masing-masing ±1,9 dtk, selesai sebelum jeda
    return [27 * eio(ramp(l, T.tTp - 0.15, 2.0)), 27 * eio(ramp(l, T.tAI - 0.55, 1.9)), 27 * eio(ramp(l, T.tJam - 0.75, 1.9))];
  }
  const b2Yaw = l => -0.80 + 0.034 * l;
  S.b0_2 = function (ctx, b, l, t, TL) {
    const T = b2Times(b);
    const c = drift(D.path([[0, 892, 702, 1.6], [0.1, 892, 702, 1.6], [1.25, 935, 455, 1.08], [b.dur + 1, 935, 450, 1.11]], l), t);
    const prog = b2Prog(T, l), yaw = b2Yaw(l);
    const rise = n => ramp(l, T.tTk - 0.1 + n * 0.028, 0.75);
    const from = n => notePt(-250 + (n % 9) * 62, -60 + Math.floor(n / 9) * 60);
    const balls = BALLS.map((_, i) => ramp(l, T.tMg + i * 0.22, 0.45));
    const aiA = [0, 1, 2, 3].map(i => ramp(l, T.tAI - 0.3 + i * 0.16, 0.4));
    const wk = eio(ramp(l, 0.3, 1.3)), tipX = lerp(1370, 1655, wk), tipY = lerp(805, 792, wk);
    ctx.save(); camT(ctx, c);
    world(ctx, t, {
      lamp: 1, night: 0.12 * ramp(l, 0.3, 1.2), balls, hg: { a: ramp(l, T.tJam - 0.15, 0.5), sand: ramp(l, T.tJam + 0.2, 6) },
      bip: cx => {
        let o;
        if (wk > 0 && wk < 1) o = { pose: "jalan", t, dir: 1 };
        else if (l < T.tTk + 0.6) o = { pose: "diam", t, mood: "wow", look: [-0.9, 0.2] };
        else if (l < T.tTp - 0.3) o = { pose: "diam", t, mood: "think", look: [-0.8, -0.8] };
        else if (l < T.tJam - 0.3) o = { pose: "tunjuk", t, target: [CUBE.x + 150, CUBE.y + 30], mood: "happy" };
        else o = { pose: "diam", t, mood: "wow", look: [-0.9, 0.0] };
        KB.draw(cx, tipX, tipY, BIP_DESK.s, o);
      },
      cubeFn: cx => {
        // latar gelap lembut di belakang kubus supaya garis warna terbaca
        const ka = ramp(l, T.tTk - 0.2, 0.8);
        if (ka > 0) { cx.save(); cx.globalAlpha = ka; const gr = cx.createRadialGradient(CUBE.x, CUBE.y, 40, CUBE.x, CUBE.y, 420); gr.addColorStop(0, "rgba(12,16,52,0.7)"); gr.addColorStop(1, "rgba(12,16,52,0)"); cx.fillStyle = gr; cx.fillRect(CUBE.x - 420, CUBE.y - 420, 840, 840); cx.restore(); }
        const dim = [0, 1, 2].map(k => k === 2 ? 1 : lerp(1, 0.45, ramp(l, [T.tAI - 0.55, T.tJam - 0.75][k], 0.5)) * (1 - 0) + 0.45 * ramp(l, T.tJam + 0.9, 0.6) * (k < 2 ? 1 : 0));
        cube(cx, t, CUBE.x, CUBE.y, CUBE.s, yaw, { rise, from, prog, dim, lattice: ramp(l, T.tTk + 0.7, 0.8), start: 1 });
        // kartu AI di kanan kubus + garis cahaya ke kubus
        const ax = 1450, ay = 212;
        const la = ramp(l, T.tAI, 0.5);
        if (la > 0) { cx.save(); cx.globalAlpha = la; const gr = cx.createRadialGradient(ax, ay, 30, ax, ay, 330); gr.addColorStop(0, "rgba(12,16,52,0.75)"); gr.addColorStop(1, "rgba(12,16,52,0)"); cx.fillStyle = gr; cx.fillRect(ax - 330, ay - 330, 660, 660);
          cx.globalCompositeOperation = "screen"; for (let k = 0; k < 3; k++) { cx.strokeStyle = D.hexA(COL3[k], 0.5); cx.lineWidth = 4; cx.setLineDash([14, 10]); cx.lineDashOffset = -t * 50; cx.beginPath(); cx.moveTo(ax - 170, ay + 10 + k * 30); cx.quadraticCurveTo(1230, 300 + k * 30, CUBE.x + 230, CUBE.y - 20 + k * 40); cx.stroke(); }
          cx.setLineDash([]); cx.restore(); }
        aiCards(cx, ax, ay, 168, aiA, t);
      },
    });
    ctx.restore();
    D.post(cx => {
      const [tx, ty] = toS(c, CUBE.x, CUBE.y - 268);
      const pA = pop(l, T.tTk), pB = pop(l, T.tSb - 0.05);
      tag(cx, "Teka-teki", tx, Math.max(ty, 120), pA.a * (1 - pB.a), { sp: pA.sp, col: P.violet, size: 50 });
      tag(cx, "terpecahkan sebagian", tx, ty, pB.a, { sp: pB.sp, col: P.green, size: 50 });
      const [mx, my] = toS(c, 385, 742), pM = pop(l, T.tMg);
      tag(cx, "berminggu-minggu", mx, my, pM.a, { sp: pM.sp, col: P.warm, size: 46 });
      const [ax, ay] = toS(c, 1450, 74), pI = pop(l, T.tAI);
      tag(cx, "bantuan AI", ax, ay, pI.a, { sp: pI.sp, col: P.teal, size: 50 });
      const [hx, hy] = toS(c, HG.x - 10, HG.y - 160), pJ = pop(l, T.tJam);
      tag(cx, "± 1 jam", hx, hy, pJ.a, { sp: pJ.sp, col: P.amber, size: 52 });
    });
  };

  // =====================================================================
  // b0_3: "Donald Knuth" (label nama) → kamera naik ke rak → 1962 → buku 1..4B menyala → judul seri → tempat kosong 4C..7 → judul video
  function b3Times(b) {
    return { tNm: D.at(b, "Donald"), tNmE: D.atEnd(b, "Knuth."), tSj: D.at(b, "Sejak"), tYr: D.at(b, "seribu"), tBk: D.at(b, "menulis buku"), tArt: D.at(b, "The Art"),
      tArtE: D.atEnd(b, "Programming,"), tBl: D.at(b, "belum selesai."), tEnd: D.speechEnd(b) };
  }
  const SH_CAM = [1515, 267, 1.5];
  function judul(cx, mode, a, t) {
    if (a <= 0.01) return; cx.save(); cx.globalAlpha = a;
    if (mode < 0.5) {
      const y0 = 104;
      cx.fillStyle = "rgba(10,14,46,0.86)"; RR(cx, 230, y0, 1460, 214, 30); cx.fill(); cx.strokeStyle = D.hexA(P.amber, 0.7); cx.lineWidth = 3; cx.stroke();
      txt(cx, TITLE1, 960, y0 + 92, 80, { align: "center", weight: 900, fit: 1380 });
      txt(cx, TITLE2, 960, y0 + 184, 80, { align: "center", weight: 900, color: P.amber, fit: 1380 });
    } else {
      cx.fillStyle = "rgba(10,14,46,0.82)"; RR(cx, 150, 72, 1620, 84, 42); cx.fill(); cx.strokeStyle = D.hexA(P.amber, 0.6); cx.lineWidth = 3; cx.stroke();
      txt(cx, TITLE_ONE, 960, 130, 48, { align: "center", weight: 900, fit: 1540 });
    }
    cx.restore();
  }
  function typed(cx, s, x, y, u, size, col) {   // pil yang teksnya diketik huruf demi huruf (lebar pil tetap)
    if (u <= 0) return; const n = Math.floor(s.length * clamp(u)); cx.save();
    cx.font = `800 ${size}px ${FONT}`; const w = cx.measureText(s).width + size * 1.2, h = size * 1.7;
    cx.globalAlpha *= clamp(u * 6); cx.fillStyle = "rgba(10,18,52,0.9)"; RR(cx, x - w / 2, y - h / 2, w, h, h / 2); cx.fill(); cx.strokeStyle = D.hexA(col, 0.9); cx.lineWidth = 3; cx.stroke();
    cx.fillStyle = P.ink; cx.textAlign = "left"; cx.textBaseline = "alphabetic"; const sub = s.slice(0, n); cx.fillText(sub, x - w / 2 + size * 0.6, y + size * 0.36);
    if (u < 1 || Math.floor(u * 10) % 2 === 0) { const cw = cx.measureText(sub).width; cx.fillStyle = col; cx.fillRect(x - w / 2 + size * 0.6 + cw + 4, y - size * 0.42, 5, size * 0.84); }
    cx.restore();
  }
  function b3Lit(T, l) { return [0, 1, 2, 3, 4].map(i => ramp(l, T.tBk + 0.1 + i * 0.42, 0.45)); }
  function b3Dash(T, l) { return [0, 1, 2, 3, 4].map(i => ramp(l, T.tBl - 0.1 + i * 0.18, 0.5)); }
  function bipJump(ctx, l, t, t0, T, phase) {
    // Bip melompat dari meja ke ujung rak, lalu menunjuk tempat kosong
    const u = clamp((l - t0) / 0.9), e = eio(u);
    if (u <= 0 && phase === "desk") { KB.draw(ctx, BIP_DESK.x, BIP_DESK.y, BIP_DESK.s, { pose: "diam", t, mood: "happy", look: [-0.8, -0.3] }); return; }
    if (u >= 1 && phase === "shelf") {
      const o = l > T.tBl - 0.2 ? { pose: "tunjuk", t, target: [bookX(7) + 60, SHELF.y - 300], mood: "think" } : l > T.tBk ? { pose: "diam", t, mood: "wow", look: [-1, 0.1] } : { pose: "diam", t, mood: "happy", look: [-0.9, 0] };
      KB.draw(ctx, BIP_SHELF.x, BIP_SHELF.y, BIP_SHELF.s, o); return; }
    if (u > 0 && u < 1 && phase === "air") {
      const x = lerp(BIP_DESK.x, BIP_SHELF.x, e), y = lerp(BIP_DESK.y, BIP_SHELF.y, e) - Math.sin(u * Math.PI) * 190, s = lerp(BIP_DESK.s, BIP_SHELF.s, e);
      KB.draw(ctx, x, y, s, { pose: "kaget", t, k: 0.35 + u * 0.4, mood: "happy", seru: false });
    }
  }
  S.b0_3 = function (ctx, b, l, t, TL) {
    const T = b3Times(b), b2 = beatOf(TL, "b0_2");
    const c = drift(D.path([[0, 935, 450, 1.11], [T.tSj - 0.2, 935, 450, 1.11], [T.tYr + 0.5, ...SH_CAM], [b.dur + 1, SH_CAM[0], SH_CAM[1] + 6, SH_CAM[2] * 1.05]], l), t);
    const lit = b3Lit(T, l), dash = b3Dash(T, l), jump0 = T.tSj - 0.1;
    // sisa kubus dari b0_2 memudar dan menyusut ke kertas catatan
    const T2 = b2 ? b2Times(b2) : null, cubeOut = ramp(l, 0.1, 1.0);
    ctx.save(); camT(ctx, c);
    world(ctx, t, {
      lamp: 1, night: 0.12 * (1 - ramp(l, 0.2, 1.2)), balls: BALLS.map(() => 1 - ramp(l, 0.3, 0.6)), hg: { a: 1 - ramp(l, 0.2, 0.6), sand: 1 },
      book: { lit, dash }, glassGlow: ramp(l, T.tNm - 0.2, 0.4) * (1 - ramp(l, T.tSj, 0.6)),
      bipShelf: cx => bipJump(cx, l, t, jump0, T, "shelf"),
      bip: cx => bipJump(cx, l, t, jump0, T, "desk"),
      cubeFn: cx => {
        if (T2 && cubeOut < 1) { const s = lerp(CUBE.s, 30, eio(cubeOut)), y = lerp(CUBE.y, NOTE.y - 40, eio(cubeOut));
          cube(cx, t, CUBE.x, y, s, b2Yaw(b2.dur + l), { prog: [27, 27, 27], dim: [0.9, 0.9, 1], alpha: 1 - cubeOut, start: 1 }); }
      },
      front: cx => bipJump(cx, l, t, jump0, T, "air"),
    });
    ctx.restore();
    D.post(cx => {
      // label b0_2 memudar (bukan hilang mendadak)
      const fo = 1 - ramp(l, 0.0, 0.45);
      if (fo > 0.01) { const c2 = { x: 935, y: 450, z: 1.11 };
        tag(cx, "terpecahkan sebagian", ...toS(c2, CUBE.x, CUBE.y - 268), fo, { col: P.green, size: 50 });
        tag(cx, "berminggu-minggu", ...toS(c2, 385, 742), fo, { col: P.warm, size: 46 });
        tag(cx, "bantuan AI", ...toS(c2, 1450, 74), fo, { col: P.teal, size: 50 });
        tag(cx, "± 1 jam", ...toS(c2, HG.x - 10, HG.y - 160), fo, { col: P.amber, size: 52 }); }
      // label nama, diketik
      const nmOut = ramp(l, T.tSj + 0.1, 0.4);
      const [nx, ny] = toS(c, NOTE.x, NOTE.y - 335);
      if (nmOut < 1) { cx.save(); cx.globalAlpha = 1 - nmOut; typed(cx, "Donald Knuth", nx, ny, clamp((l - T.tNm + 0.05) / Math.max(0.5, T.tNmE - T.tNm)), 72, P.amber); cx.restore(); }
      // judul seri di atas buku (diketik)
      const [px, py] = toS(c, bookX(4) + 36, SHELF.y - 345);
      const ttl = "The Art of Computer Programming", tu = clamp((l - T.tArt + 0.05) / Math.max(0.6, T.tArtE - T.tArt));
      const titleIn = ramp(l, T.tEnd + 0.45, 0.5), pillOut = ramp(l, T.tEnd + 0.05, 0.35);
      if (tu > 0) { cx.save(); cx.globalAlpha = 1 - pillOut; typed(cx, ttl, px, py, tu, 56, P.warm); cx.restore(); }
      // 1962
      const [yx, yy] = toS(c, bookX(1) + 36, SHELF.y - 262), pY = pop(l, T.tYr);
      tag(cx, "sejak 1962", yx, yy, pY.a * (1 - pillOut), { sp: pY.sp, col: P.amber, size: 50 });
      const [bx, by] = toS(c, bookX(7) + 36, SHELF.y - 262), pB = pop(l, T.tBl);
      tag(cx, "belum selesai", bx, by, pB.a * (1 - pillOut), { sp: pB.sp, col: P.warm, size: 50 });
      // judul video
      judul(cx, 0, titleIn, t);
    });
  };

  // =====================================================================
  // b0_4: judul naik ke pita atas → cahaya ide dari buku → HP (daftar nama, dicari dengan membagi dua) → kartu AI + "peran AI?"
  const PHONE = { x: 560, y: 575, h: 640 };
  const NAMES = ["Adi", "Budi", "Citra", "Dewi", "Eko", "Fajar", "Gita"];
  function listScreen(c, w, h, t, st) {
    const u = w / 100;
    c.fillStyle = "#F1F3FC"; c.fillRect(0, 0, w, h);
    const hh = u * 30, hg = c.createLinearGradient(0, 0, w, hh); hg.addColorStop(0, "#3FA7C9"); hg.addColorStop(1, "#4D6FD8"); c.fillStyle = hg; c.fillRect(0, 0, w, hh);
    c.fillStyle = "rgba(255,255,255,0.95)"; RR(c, u * 6, u * 8, w - u * 12, u * 18, u * 9); c.fill();
    KY.ikon(c, "cari", u * 17, u * 17, u * 10, "#4D6FD8");
    c.save(); c.globalAlpha *= edgeA(c, u * 30, u * 17 + 15, 80); txt(c, "Eko", u * 30, u * 17 + 15, 44, { weight: 800, color: "#1E2766" }); c.restore();
    const rowH = (h - hh - u * 6) / NAMES.length, y0 = hh + u * 3;
    NAMES.forEach((n, i) => {
      const y = y0 + i * rowH, out = i < st.lo || i > st.hi;
      c.save(); c.globalAlpha = out ? 0.28 : 1;
      if (i === st.mid) { c.fillStyle = st.found ? "rgba(79,214,127,0.35)" : "rgba(255,181,71,0.4)"; RR(c, u * 3, y + 4, w - u * 6, rowH - 8, u * 4); c.fill(); }
      c.fillStyle = ["#E8665F", "#36B3A3", "#6A7BE0", "#E9A23B", "#4FD67F", "#9A6FD6", "#55A8FF"][i]; c.beginPath(); c.arc(u * 15, y + rowH / 2, u * 7, 0, TAU); c.fill();
      c.globalAlpha *= edgeA(c, u * 28, y + rowH / 2 + 16, 120); txt(c, n, u * 28, y + rowH / 2 + 16, 44, { weight: 800, color: "#1E2766" });
      c.restore();
      if (i < NAMES.length - 1) { c.fillStyle = "rgba(40,50,110,0.1)"; c.fillRect(u * 6, y + rowH, w - u * 12, 2); }
    });
  }
  function searchState(l, t0) {   // pencarian bagi dua: Dewi (tengah) → Fajar → Eko
    const k = l - t0;
    if (k < 0) return { lo: 0, hi: 6, mid: -1 };
    if (k < 0.8) return { lo: 0, hi: 6, mid: 3 };
    if (k < 1.6) return { lo: 4, hi: 6, mid: 5 };
    return { lo: 4, hi: 4, mid: 4, found: true };
  }
  S.b0_4 = function (ctx, b, l, t, TL) {
    const tId = D.at(b, "ide-ide"), tTua = D.at(b, "setua"), tApp = D.at(b, "aplikasi"), tHp = D.at(b, "HP-mu,"), tAI = D.at(b, "AI"), tPer = D.at(b, "peran"), tEnd = D.speechEnd(b);
    const b3 = beatOf(TL, "b0_3"), T3 = b3 ? b3Times(b3) : null;
    const c = drift(D.path([[0, SH_CAM[0], SH_CAM[1] + 6, SH_CAM[2] * 1.05], [0.5, SH_CAM[0], SH_CAM[1] + 6, SH_CAM[2] * 1.05], [2.6, 1075, 505, 1.0], [b.dur + 1, 1075, 505, 1.03]], l), t);
    const phoneU = eout(ramp(l, tApp - 0.35, 0.8)), ph = { x: PHONE.x, y: lerp(1500, PHONE.y, phoneU) };
    const st = searchState(l, tHp + 0.3);
    const aiA = [0, 1, 2, 3].map(i => ramp(l, tAI - 0.25 + i * 0.15, 0.4));
    ctx.save(); camT(ctx, c);
    world(ctx, t, {
      lamp: 1, night: 0.1 * ramp(l, 1.5, 1.5), calHide: phoneU > 0.35,
      book: { lit: [1, 1, 1, 1, 1], pulse: 0.55 + 0.45 * Math.sin(t * 2) + 0.5 * ramp(l, tTua, 0.4) * (1 - ramp(l, tTua + 1.2, 0.6)), dash: [1, 1, 1, 1, 1] },
      bipShelf: cx => {
        // Bip turun dari rak ke meja di tengah, lalu menoleh ke HP dan ke kartu AI
        const u = clamp((l - 0.9) / 0.9);
        if (u <= 0) KB.draw(cx, BIP_SHELF.x, BIP_SHELF.y, BIP_SHELF.s, { pose: "tunjuk", t, target: [bookX(7) + 32, SHELF.y - 100], mood: "think" });
      },
      front: cx => {
        const u = clamp((l - 0.9) / 0.9), e = eio(u), BX = 1120, BY = 800;
        // cahaya ide: dari buku ke HP
        const ia = ramp(l, tId - 0.1, 0.6), reach = l < tApp ? 0.5 * ramp(l, tId, 1.2) : lerp(0.5, 1, ramp(l, tApp, 0.6));
        if (ia > 0) { cx.save(); cx.globalCompositeOperation = "screen";
          for (let i = 0; i < 26; i++) { const src = i % 5, sx = bookX(src) + 32, sy = SHELF.y - 110, ex = ph.x, ey = ph.y - 40;
            const q = ((t * 0.32 + i * 0.137) % 1); if (q > reach) continue;
            const mx = (sx + ex) / 2, my = Math.min(sy, ey) - 260 - (i % 3) * 40;
            const x = (1 - q) * (1 - q) * sx + 2 * (1 - q) * q * mx + q * q * ex, y = (1 - q) * (1 - q) * sy + 2 * (1 - q) * q * my + q * q * ey;
            const fadeEnd = l < tApp ? clamp((reach - q) / 0.12) : 1;
            D.glow(cx, x, y, 22, BOOKS[src].c, 0.9 * ia * fadeEnd); cx.fillStyle = D.hexA("#FFFFFF", 0.9 * ia * fadeEnd); cx.beginPath(); cx.arc(x, y, 4.5, 0, TAU); cx.fill(); }
          cx.restore(); }
        // HP
        if (phoneU > 0.001) KY.hp(cx, ph.x, ph.y, PHONE.h, { t, lit: 1, glow: 0.5, glowCol: "#A9D4FF", screen: (c2, w, h, tt) => listScreen(c2, w, h, tt, st) });
        // kurung "sisa" di samping HP: rentang yang masih mungkin
        if (phoneU > 0.9 && st.mid >= 0) { const rows = NAMES.length, scrTop = ph.y - PHONE.h * 0.5 + PHONE.h * 0.08 + PHONE.h * 0.84 * 0.13, rowH = PHONE.h * 0.84 * 0.85 / rows;
          const y0 = scrTop + st.lo * rowH, y1 = scrTop + (st.hi + 1) * rowH, x = ph.x + PHONE.h * 0.485 / 2 + 26;
          cx.strokeStyle = st.found ? COL3[1] : P.amber; cx.lineWidth = 7; cx.lineCap = "round"; cx.beginPath(); cx.moveTo(x - 10, y0); cx.lineTo(x, y0); cx.lineTo(x, y1); cx.lineTo(x - 10, y1); cx.stroke(); }
        // kartu AI
        aiCards(cx, 1500, 636, 200, aiA, t);
        // Bip
        if (u > 0 && u < 1) KB.draw(cx, lerp(BIP_SHELF.x, BX, e), lerp(BIP_SHELF.y, BY, e) - Math.sin(u * Math.PI) * 170, lerp(BIP_SHELF.s, 200, e), { pose: "kaget", t, k: 0.35 + u * 0.4, mood: "happy", seru: false });
        else if (u >= 1) {
          let o;
          if (l < tApp) o = { pose: "diam", t, mood: "think", look: [0.6, -0.9] };
          else if (l < tAI - 0.2) o = { pose: "tunjuk", t, target: [ph.x + 120, ph.y - 60], mood: "happy" };
          else if (l < tEnd + 0.2) o = { pose: "tunjuk", t, target: [1430, 600], mood: "think" };
          else o = { pose: "diam", t, mood: "think", look: [0.2, -0.9] };
          KB.draw(cx, BX, BY, 200, o);
          // tanda tanya di atas kepala
          const qa = ramp(l, tPer, 0.4) * (1 - ramp(l, tEnd + 0.1, 0.2)); if (qa > 0) { const qs = clamp(spring(l - tPer, 9, 0.5)); cx.save(); cx.globalAlpha *= qa; cx.translate(BX + 10, BY - 230 + Math.sin(t * 2.2) * 8); cx.scale(qs, qs);
            D.glow(cx, 0, -30, 90, P.amber, 0.5); txt(cx, "?", 0, 10, 120, { align: "center", weight: 900, color: P.amber }); cx.restore(); }
        }
      },
    });
    ctx.restore();
    D.post(cx => {
      // judul: dari panel bawah ke pita atas, lalu pudar
      const mv = eio(ramp(l, 0.7, 0.6));
      judul(cx, 0, 1 - mv, t);
      judul(cx, 1, mv * (1 - ramp(l, tApp - 0.6, 0.5)), t);
      const [hx, hy] = toS(c, PHONE.x, PHONE.y - PHONE.h / 2 - 54), pH = pop(l, tApp);
      tag(cx, "aplikasi di HP-mu", hx, hy, pH.a, { sp: pH.sp, col: P.blue, size: 48 });
      const [ax, ay] = toS(c, 1500, 820), pA = pop(l, tAI);
      tag(cx, "peran AI?", ax, ay, pA.a, { sp: pA.sp, col: P.teal, size: 52 });
    });
  };

  K.SCENES.d04_b0 = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); };
  K.SCENES.d04_b0.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b0 = TL => [
    K.sfxAt(TL, "b0_1", null, 0.14, "clack", 0.6),
    K.sfxAt(TL, "b0_1", "Februari", 0.0, "pop", 0.4),
    K.sfxAt(TL, "b0_1", "profesor", 0.05, "pop", 0.45),
    K.sfxAt(TL, "b0_1", "menulis", 0.0, "whoosh", 0.45),
    K.sfxAt(TL, "b0_1", '"Shock!', 0.05, "pop", 0.75),
    K.sfxAt(TL, "b0_1", '"Kaget!', 0.0, "shimmer", 0.45),
    K.sfxAt(TL, "b0_2", "Teka-teki", -0.1, "whoosh", 0.55),
    K.sfxAt(TL, "b0_2", "berminggu-minggu", 0.05, "pop", 0.4),
    K.sfxAt(TL, "b0_2", "terpecahkan", -0.1, "shimmer", 0.55),
    K.sfxAt(TL, "b0_2", "AI", -0.2, "pop", 0.5),
    K.sfxAt(TL, "b0_2", "satu jam", 0.1, "clack", 0.55),
    K.sfxAt(TL, "b0_3", "Donald", 0.0, "pop", 0.5),
    K.sfxAt(TL, "b0_3", "Sejak", -0.1, "whoosh", 0.6),
    K.sfxAt(TL, "b0_3", "menulis buku", 0.15, "shimmer", 0.45),
    K.sfxAt(TL, "b0_3", "belum selesai.", -0.05, "shimmer", 0.5),
    K.sfxAt(TL, "b0_3", "belum selesai.", 1.35, "boom", 0.5),
    K.sfxAt(TL, "b0_4", null, 0.75, "whoosh", 0.5),
    K.sfxAt(TL, "b0_4", "aplikasi", -0.2, "pop", 0.55),
    K.sfxAt(TL, "b0_4", "AI", -0.2, "pop", 0.5),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
