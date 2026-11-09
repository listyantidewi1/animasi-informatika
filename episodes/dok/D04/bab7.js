/* D04 bab 7 — "Teka-teki tiga jalan" (b7_1, b7_2, b7_3, b7_4).
   Dunia meja kerja malam yang sama dengan bab 0/5 (dinding biru bergaris, jendela malam, lampu meja berlengan, rak berisi jilid
   1, 2, 3, 4A, 4B dan tempat kosong bergaris putus-putus 4C, 4D, 5, 6, 7, meja kayu, kacamata, tumpukan naskah). Knuth tidak digambar.
   b7_1 kalender meja berganti tahun sampai 2026 → label "Donald Knuth" → kamera mendekat ke kertas catatan; pensil menggambar
        rute yang mengunjungi 6 tempat (nomor kunjungan 1–6) tepat satu kali lalu kembali ke tempat awal (bendera "awal").
   b7_2 meja menjadi kabur (latar), 27 titik naik dari kertas menjadi kubus 3×3×3 bernomor 1–27; baris, lajur, dan tingkat
        bertanda "3"; satu ruangan disorot, tiga pintu satu arah berkedip bergantian (kanan, belakang, atas); bola cahaya
        berjalan ke kanan, tembus sisi kanan, muncul dari sisi kiri (tiga kali; layar permainan generik ikut bergerak serempak).
   b7_3 81 pintu (27 × 3) tampil abu-abu; Bip memegang kuas; jalur merah, hijau, biru disusuri SATU PER SATU (data asli
        K.KUBUS['3']) dengan penghitung ruangan 1→27 per warna; pintu yang dilewati berubah warna; akhirnya 81 dari 81 pintu
        berwarna dan setiap pintu hanya satu warna.
   b7_4 "ukuran 3 ✓" (Knuth) → kubus mengecil ke kiri; laptop generik + label "Filip Stappers" (tanpa orang); kubus 5 (data
        asli K.KUBUS['5']) lalu kubus 16 (kisi titik, tanpa jalur karangan) dengan penghitung ukuran di layar laptop sampai 16;
        laptop pergi, kubus garis putus-putus "n × n × n" dengan tanda tanya: "semua ukuran", "belum ditemukan".
   Kamera sendiri (noCam). Teks benda di dunia memudar bila keluar zona aman; label layar lewat D.post. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const KL = KIT.latar, KB = KIT.bipkit, P = D.P, LP = KL.parts;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const S = {};
  const COL3 = ["#FF5A5F", "#4FD67F", "#55A8FF"];          // merah, hijau, biru (sama dengan bab 0 dan 8)
  const CNAME = ["merah", "hijau", "biru"];
  const DOORC = "#FFC65A";                                     // warna sorot pintu/ruangan (bukan merah/hijau/biru)

  // ---------- pembantu ----------
  const ramp = (l, t0, d = 0.5) => clamp((l - t0) / d);
  const win = (l, a, b, f = 0.4) => ramp(l, a, f) * (1 - ramp(l, b, f));
  const camT = (ctx, c) => { ctx.translate(W / 2, HH / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y); };
  const toS = (c, x, y) => [(x - c.x) * c.z + W / 2, (y - c.y) * c.z + HH / 2];
  const drift = (c, t) => ({ x: c.x + Math.sin(t * 0.29) * 5 / c.z, y: c.y + Math.sin(t * 0.21 + 1) * 4 / c.z, z: c.z * (1 + 0.003 * Math.sin(t * 0.17)) });
  const mk = (w, h) => Object.assign(document.createElement("canvas"), { width: w, height: h });
  function grade(ctx, a, col = "#3B4690") { if (a <= 0.01) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore(); }
  function addLight(ctx, x, y, r, col, a) {
    if (a <= 0.01 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = "screen";
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, D.hexA(col, a)); gr.addColorStop(0.4, D.hexA(col, a * 0.42)); gr.addColorStop(1, D.hexA(col, 0));
    ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  }
  // faktor tampak teks dunia: 1 di dalam zona aman layar, memudar ke 0 di tepinya
  function safeA(ctx, x, y, w, size) {
    const m = ctx.getTransform(), X0 = m.a * x + m.e, X1 = m.a * (x + w) + m.e, Y = m.d * y + m.f, Yt = m.d * (y - size * 0.8) + m.f;
    return clamp((Yt - 66) / 30) * clamp((925 - Y) / 30) * clamp((X0 - 100) / 40) * clamp((1820 - X1) / 40);
  }
  function wtxt(ctx, s, x, y, size, opt = {}) {
    ctx.save(); ctx.font = `${opt.weight || 800} ${size}px ${FONT}`; const w = ctx.measureText(s).width;
    const al = opt.align || "center", x0 = al === "center" ? x - w / 2 : al === "right" ? x - w : x;
    const a = safeA(ctx, x0, y, w, size); if (a > 0.01) { ctx.globalAlpha *= a; D.txt(ctx, s, x, y, size, { align: al, weight: opt.weight || 800, color: opt.color }); }
    ctx.restore();
  }
  function tag(ctx, s, x, y, a, opt = {}) {
    if (a <= 0.01) return 0; const sp = opt.sp == null ? 1 : opt.sp; ctx.save(); ctx.globalAlpha *= clamp(a);
    ctx.translate(x, y); const k = lerp(0.86, 1, sp); ctx.scale(k, k); const w = D.label(ctx, s, 0, 0, { size: opt.size || 50, col: opt.col || P.amber, color: opt.color, fill: opt.fill });
    ctx.restore(); return w;
  }
  const pop = (l, t0) => ({ a: ramp(l, t0, 0.25), sp: clamp(spring(l - t0, 10, 0.55)) });
  function shadowE(ctx, x, y, rx, ry, a = 0.3) { ctx.save(); ctx.fillStyle = `rgba(30,12,8,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  function sparkle(ctx, x, y, r, a, col = "#FFF3C4") {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath();
    for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * 0.28 : r, an = i * Math.PI / 4 - Math.PI / 2; ctx.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); }
    ctx.closePath(); ctx.fill(); D.glow(ctx, x, y, r * 1.6, col, 0.5); ctx.restore();
  }
  function checkMark(ctx, x, y, r, a, sp = 1) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); const k = lerp(0.5, 1, sp); ctx.scale(k, k);
    D.glow(ctx, 0, 0, r * 2.2, P.green, 0.35);
    ctx.fillStyle = "#2FA862"; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = "#D8FFE6"; ctx.lineWidth = r * 0.12; ctx.stroke();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = r * 0.24; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-r * 0.45, 0); ctx.lineTo(-r * 0.1, r * 0.36); ctx.lineTo(r * 0.5, -r * 0.36); ctx.stroke(); ctx.restore();
  }

  // ---------- dunia meja (rupa sama dengan bab 0 dan 5) ----------
  const DESK_Y = 640, DESK_F = 1010;
  const WIN = { x: 120, y: 70, w: 280, h: 230 };
  const LAMP = { bx: 330, by: 690, jx: 262, jy: 500, hx: 430, hy: 372 };
  const SHELF = { x0: 1110, x1: 1850, y: 300, slot: 69, bx: 1130, bw: 62, bh: 170 };
  const BOOKS = [["1", "#E8665F"], ["2", "#36B3A3"], ["3", "#6A7BE0"], ["4A", "#E9A23B"], ["4B", "#9A6FD6"], ["4C"], ["4D"], ["5"], ["6"], ["7"]];
  const PAP = { x: 930, y: 815, w: 700, h: 300 };
  const GLS = { x: 500, y: 772 };
  const CAL = { x: 1640, y: 702, w: 230, h: 214 };
  const STK = { x: 170, y: 880 };
  const PEN_REST = { x: 1215, y: 930, ang: -0.32 };
  const BIP1 = { x: 1395, y: 770, s: 150 };
  const BIPC = { x: 1735, y: 812, s: 170 };
  const YEARS = [1990, 1995, 2000, 2005, 2011, 2016, 2022, 2026];
  // tempat-tempat di kertas (relatif pusat kertas), urutan rute A→F→A
  const PL = [[-250, -38], [-95, -100], [95, -52], [255, -96], [215, 78], [-40, 70]];
  const plW = i => [PAP.x + PL[i][0], PAP.y + PL[i][1]];

  function wall(ctx, t) {
    const gr = ctx.createLinearGradient(0, 0, 0, DESK_Y); gr.addColorStop(0, "#2A3A7C"); gr.addColorStop(1, "#3D509A");
    ctx.fillStyle = gr; ctx.fillRect(-600, -400, 3200, DESK_Y + 400);
    ctx.fillStyle = "rgba(255,255,255,0.035)"; for (let x = -576; x < 2600; x += 64) ctx.fillRect(x, -400, 3, DESK_Y + 400);
    ctx.fillStyle = "rgba(255,255,255,0.05)"; for (let x = -544; x < 2600; x += 64) for (let y = -360; y < DESK_Y - 20; y += 64) { ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); }
    LP.windowFrame(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, "#8A6E9E", () => LP.nightView(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, 0));
    addLight(ctx, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, 280, "#9DB8FF", 0.14);
  }
  function desk(ctx) {
    const top = DESK_Y, front = DESK_F;
    const gr = ctx.createLinearGradient(0, top, 0, front); gr.addColorStop(0, "#6E4834"); gr.addColorStop(1, "#9A6848");
    ctx.fillStyle = gr; ctx.fillRect(-600, top, 3200, front - top);
    ctx.strokeStyle = "rgba(60,30,20,0.18)"; ctx.lineWidth = 3;
    for (let i = 0; i < 10; i++) { const y = top + 26 + i * 40; if (y > front - 6) break; ctx.beginPath(); ctx.moveTo(-600, y); for (let x = -600; x <= 2600; x += 120) ctx.lineTo(x, y + Math.sin(x * 0.004 + i * 1.7) * 6); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,220,180,0.18)"; ctx.fillRect(-600, top, 3200, 4);
    ctx.fillStyle = "#B57D57"; ctx.fillRect(-600, front, 3200, 10);
    const g2 = ctx.createLinearGradient(0, front + 10, 0, 1400); g2.addColorStop(0, "#5A3726"); g2.addColorStop(1, "#3A2218");
    ctx.fillStyle = g2; ctx.fillRect(-600, front + 10, 3200, 500);
  }
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
    ctx.translate(hx, hy); ctx.rotate(-0.5);
    const sg = ctx.createLinearGradient(-60, 0, 60, 0); sg.addColorStop(0, "#38428A"); sg.addColorStop(0.5, "#5562B4"); sg.addColorStop(1, "#38428A");
    ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(-34, -14); ctx.lineTo(34, -14); ctx.lineTo(70, 92); ctx.lineTo(-70, 92); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2E3778"; ctx.beginPath(); ctx.ellipse(0, -14, 34, 9, 0, 0, TAU); ctx.fill();
    const lit = clamp(on);
    ctx.fillStyle = `rgb(${Math.round(lerp(40, 255, lit))},${Math.round(lerp(48, 236, lit))},${Math.round(lerp(110, 190, lit))})`;
    ctx.beginPath(); ctx.ellipse(0, 92, 70, 15, 0, 0, TAU); ctx.fill();
    ctx.restore();
    if (lit > 0.01) { addLight(ctx, hx + 50, hy + 90, 110, "#FFF2C8", 0.85 * lit); addLight(ctx, hx + 90, hy + 140, 280, "#FFC66E", 0.4 * lit); }
  }
  function spine(ctx, x, bottom, w, h, col, label) {
    const top = bottom - h;
    ctx.fillStyle = "rgba(10,10,30,0.3)"; ctx.fillRect(x + 6, top + 6, w, h);
    const gr = ctx.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, col); gr.addColorStop(0.55, col); gr.addColorStop(1, "rgba(20,20,40,0.35)");
    ctx.fillStyle = col; RR(ctx, x, top, w, h, 6); ctx.fill(); ctx.fillStyle = gr; RR(ctx, x, top, w, h, 6); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.fillRect(x + 8, top + 16, w - 16, 5); ctx.fillRect(x + 8, top + h - 22, w - 16, 5);
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillRect(x + 8, top + 28, w - 16, 3);
    const cy = top + h * 0.52; ctx.fillStyle = "rgba(16,20,56,0.82)"; ctx.beginPath(); ctx.arc(x + w / 2, cy, w / 2 - 1, 0, TAU); ctx.fill();
    wtxt(ctx, label, x + w / 2, cy + 15, label.length > 1 ? 40 : 44, { weight: 900, color: "#FFFFFF" });
  }
  function ghostSlot(ctx, x, bottom, w, h, t, label, i) {
    const top = bottom - h, pulse = 0.6 + 0.4 * Math.sin(t * 2.2 + i);
    ctx.save();
    ctx.fillStyle = D.hexA(P.warm, 0.1 + 0.08 * pulse); RR(ctx, x, top, w, h, 8); ctx.fill();
    ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 14; ctx.strokeStyle = D.hexA(P.warm, 0.75 + 0.25 * pulse); ctx.lineWidth = 4; RR(ctx, x + 2, top + 2, w - 4, h - 4, 8); ctx.stroke(); ctx.setLineDash([]);
    wtxt(ctx, label, x + w / 2, top + h * 0.52 + 15, label.length > 1 ? 40 : 44, { weight: 900, color: P.warm });
    ctx.restore();
  }
  function shelf(ctx, t) {
    const { x0, x1, y, slot, bx, bw, bh } = SHELF;
    BOOKS.forEach(([k, c], i) => { const x = bx + i * slot, h = k.length > 1 ? bh + 10 : bh; if (c) spine(ctx, x, y, bw, h, c, k); else ghostSlot(ctx, x, y, bw, h, t, k, i); });
    ctx.fillStyle = "#6B4632"; [x0 + 60, x1 - 120].forEach(x => { ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x + 18, y + 20); ctx.lineTo(x + 18, y + 90); ctx.closePath(); ctx.fill(); });
    ctx.fillStyle = "#8A5A3C"; RR(ctx, x0, y, x1 - x0, 24, 5); ctx.fill();
    ctx.fillStyle = "#A8714C"; ctx.fillRect(x0 + 4, y, x1 - x0 - 8, 5);
    ctx.fillStyle = "rgba(10,10,30,0.25)"; ctx.fillRect(x0 + 6, y + 24, x1 - x0 - 12, 8);
  }
  function stack(ctx) {
    const { x, y } = STK, w = 300, h = 150;
    shadowE(ctx, x + 10, y + 10, w * 0.6, h * 0.42, 0.28);
    for (let i = 0; i < 9; i++) { const dy = -i * 7, dx = Math.sin(i * 2.1) * 8, rot = Math.sin(i * 1.3) * 0.03;
      ctx.save(); ctx.translate(x + dx, y + dy); ctx.rotate(rot);
      ctx.fillStyle = i % 2 ? "#EDE3CF" : "#F6EEDC"; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = "rgba(120,90,60,0.25)"; ctx.fillRect(-w / 2, h / 2 - 3, w, 3); ctx.restore(); }
    ctx.save(); ctx.translate(x + Math.sin(8 * 2.1) * 8, y - 56); ctx.strokeStyle = "rgba(70,80,120,0.45)"; ctx.lineWidth = 3;
    for (let r = 0; r < 5; r++) { ctx.beginPath(); const yy = -52 + r * 24; ctx.moveTo(-120, yy); for (let u = 0; u <= 1; u += 0.05) ctx.lineTo(-120 + u * (r === 4 ? 140 : 230), yy + Math.sin(u * 40 + r) * 2.5); ctx.stroke(); }
    ctx.restore();
  }
  function glasses(ctx, glow) {
    const { x, y } = GLS;
    if (glow > 0.01) addLight(ctx, x, y - 4, 130, P.warm, 0.55 * glow);
    shadowE(ctx, x + 8, y + 20, 84, 14, 0.3);
    ctx.save(); ctx.translate(x, y); ctx.scale(0.76, 0.55);
    ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-86, -10); ctx.lineTo(70, -34); ctx.moveTo(86, -10); ctx.lineTo(-40, -36); ctx.stroke();
    [-46, 46].forEach(cx => {
      ctx.fillStyle = "rgba(190,220,255,0.28)"; ctx.beginPath(); ctx.arc(cx, 0, 38, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 7; ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${0.6 + 0.4 * glow})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, 0, 26, -2.4, -1.6); ctx.stroke();
    });
    ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-10, -6); ctx.quadraticCurveTo(0, -18, 10, -6); ctx.stroke();
    ctx.restore();
  }
  // kalender meja: fl 0..7 = indeks tahun (pecahan = halaman sedang dibalik ke atas)
  function calPage(ctx, x, top, w, h, yr, noText) {
    ctx.fillStyle = "#FBF6EA"; RR(ctx, x - w / 2, top, w, h, 10); ctx.fill();
    ctx.fillStyle = "#E25A54"; RR(ctx, x - w / 2, top, w, h * 0.3, 10); ctx.fill(); ctx.fillRect(x - w / 2, top + h * 0.2, w, h * 0.1);
    if (noText) return;
    wtxt(ctx, "TAHUN", x, top + h * 0.3 - 18, 40, { weight: 900, color: "#FFF4EC" });
    wtxt(ctx, String(yr), x, top + h * 0.78, 76, { weight: 900, color: "#2B2F5E" });
  }
  function calendar(ctx, t, fl) {
    const { x, y, w, h } = CAL, top = y - h;
    shadowE(ctx, x + 12, y + 6, w * 0.62, 18, 0.32);
    ctx.fillStyle = "#353B78"; ctx.beginPath(); ctx.moveTo(x - w / 2 - 10, y); ctx.lineTo(x + w / 2 + 10, y); ctx.lineTo(x + w / 2 - 6, top - 6); ctx.lineTo(x - w / 2 + 6, top - 6); ctx.closePath(); ctx.fill();
    const i = Math.min(7, Math.floor(fl)), fr = fl - i;
    const flip = fr > 0.001 && i < 7, k = flip ? Math.cos(fr * Math.PI / 2) : 0;
    calPage(ctx, x, top, w, h, YEARS[Math.min(7, i + (flip ? 1 : 0))], flip && k >= 0.5);
    if (flip) {   // halaman lama terangkat ke atas (engsel di atas); teks hanya di salah satu halaman supaya tidak bertumpuk
      ctx.save(); ctx.translate(x, top); ctx.scale(1, Math.max(0.02, k)); ctx.globalAlpha *= 0.4 + 0.6 * k;
      calPage(ctx, 0, 0, w, h, YEARS[i], k < 0.5); ctx.restore();
    }
    ctx.fillStyle = "#C9CDE6"; for (let r = 0; r < 6; r++) { const rx = x - w / 2 + 26 + r * (w - 52) / 5; ctx.beginPath(); ctx.arc(rx, top + 4, 7, 0, TAU); ctx.fill(); }
  }
  function pencil(ctx, x, y, ang, lift) {
    ctx.save();
    ctx.save(); ctx.translate(x + lift * 20, y + 8 + lift * 34); ctx.rotate(ang * 0.35); ctx.fillStyle = `rgba(30,12,8,${0.2 * (1 - lift * 0.5)})`; ctx.beginPath(); ctx.ellipse(110 * Math.cos(ang) / Math.max(0.4, Math.cos(ang * 0.35)), 0, 120, 11, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.translate(x, y); ctx.rotate(ang);
    // ujung di (0,0), badan ke arah +x
    ctx.fillStyle = "#3A3550"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(14, -5); ctx.lineTo(14, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#F2D2A2"; ctx.beginPath(); ctx.moveTo(14, -5); ctx.lineTo(40, -13); ctx.lineTo(40, 13); ctx.lineTo(14, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#F5C24A"; ctx.fillRect(40, -13, 170, 26); ctx.fillStyle = "#E0A93A"; ctx.fillRect(40, 4, 170, 9); ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fillRect(40, -10, 170, 4);
    ctx.fillStyle = "#B9BBC9"; ctx.fillRect(210, -13, 20, 26); ctx.fillStyle = "#F08DA0"; RR(ctx, 230, -13, 26, 26, 6); ctx.fill();
    ctx.restore();
  }
  // rumah kecil goresan pensil
  function house(ctx, x, y, a, sc = 1) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.fillStyle = "rgba(233,223,200,0.95)"; ctx.fillRect(-22, -14, 44, 30);
    ctx.strokeStyle = "#4A4E6E"; ctx.lineWidth = 3.5; ctx.lineJoin = "round"; ctx.strokeRect(-22, -14, 44, 30);
    ctx.fillStyle = "#C97A5C"; ctx.beginPath(); ctx.moveTo(-30, -12); ctx.lineTo(0, -38); ctx.lineTo(30, -12); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#4A4E6E"; ctx.fillRect(-6, 0, 12, 16);
    ctx.restore();
  }
  // kertas catatan + rute; o: places 0..1 (muncul), rp 0..6 (ruas tergambar), badges[i] 0..1, flag 0..1, glow 0..1, textA
  function routePt(rp) { const i = Math.min(5, Math.floor(rp)), f = rp - i, A = plW(i), B = plW((i + 1) % 6); return [lerp(A[0], B[0], f), lerp(A[1], B[1], f)]; }
  function paper(ctx, t, o = {}) {
    const { x, y, w, h } = PAP;
    shadowE(ctx, x + 14, y + 16, w * 0.55, h * 0.5, 0.25);
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.012);
    ctx.fillStyle = "#FBF4E2"; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = "rgba(90,130,200,0.28)"; ctx.lineWidth = 2; for (let r = 1; r < 7; r++) { const yy = -h / 2 + r * h / 7; ctx.beginPath(); ctx.moveTo(-w / 2 + 10, yy); ctx.lineTo(w / 2 - 10, yy); ctx.stroke(); }
    ctx.strokeStyle = "rgba(220,90,90,0.35)"; ctx.beginPath(); ctx.moveTo(-w / 2 + 70, -h / 2); ctx.lineTo(-w / 2 + 70, h / 2); ctx.stroke();
    ctx.fillStyle = "rgba(120,90,60,0.18)"; ctx.fillRect(-w / 2, h / 2 - 4, w, 4);
    ctx.restore();
    // rute
    const rp = o.rp || 0;
    if (rp > 0.001) {
      ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
      const pts = [plW(0)]; for (let s = 1; s <= Math.floor(rp); s++) pts.push(plW(s % 6)); if (rp % 1 > 0.001) pts.push(routePt(rp));
      const gl = o.glow || 0;
      if (gl > 0.01) { ctx.strokeStyle = D.hexA(P.amber, 0.45 * gl); ctx.lineWidth = 18; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }
      ctx.strokeStyle = gl > 0.01 ? `rgb(${Math.round(lerp(74, 214, gl))},${Math.round(lerp(78, 120, gl))},${Math.round(lerp(110, 40, gl))})` : "#4A4E6E";
      ctx.lineWidth = 6; ctx.setLineDash([]); ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
      // panah kecil di tengah ruas yang selesai
      for (let s = 0; s < Math.floor(rp); s++) { const A = plW(s), B = plW((s + 1) % 6), mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, an = Math.atan2(B[1] - A[1], B[0] - A[0]);
        ctx.save(); ctx.translate(mx, my); ctx.rotate(an); ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-8, -10); ctx.lineTo(-8, 10); ctx.closePath(); ctx.fill(); ctx.restore(); }
      ctx.restore();
    }
    // tempat
    for (let i = 0; i < 6; i++) { const [px, py] = plW(i), a = o.places ? clamp(o.places(i)) : 1; house(ctx, px, py, a, lerp(0.6, 1, spring(a * 0.6, 10, 0.5)));
      if (i === 0 && (o.start || 0) > 0.01) { ctx.save(); ctx.globalAlpha *= o.start; ctx.strokeStyle = P.amber; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(px, py - 8, 46 + Math.sin(t * 3) * 3, 0, TAU); ctx.stroke(); ctx.restore(); }
    }
    // nomor kunjungan
    const ta = o.textA == null ? 1 : o.textA;
    for (let i = 0; i < 6; i++) { const ba = o.badges ? clamp(o.badges[i] || 0) : 0; if (ba <= 0.01) continue; const [px, py] = plW(i), bx = px + 34, by = py - 44, k = lerp(0.5, 1, clamp(spring(ba * 0.7, 10, 0.5)));
      ctx.save(); ctx.globalAlpha *= ba; ctx.translate(bx, by); ctx.scale(k, k);
      ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fill(); ctx.strokeStyle = "#FFF1D0"; ctx.lineWidth = 3; ctx.stroke();
      ctx.globalAlpha *= ta; if (ta > 0.01) wtxt(ctx, String(i + 1), 0, 11, 30, { weight: 900, color: "#1B2150" }); ctx.restore(); }
    // bendera "awal"
    const fa = o.flag || 0;
    if (fa > 0.01) { const [px, py] = plW(0), bx = px - 46, by = py - 6, k = clamp(spring(fa * 0.8, 10, 0.5));
      ctx.save(); ctx.globalAlpha *= clamp(fa * 3); ctx.translate(bx, by); ctx.scale(1, k);
      ctx.strokeStyle = "#4A4E6E"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -66); ctx.stroke();
      ctx.fillStyle = "#E25A54"; ctx.beginPath(); ctx.moveTo(0, -66); ctx.lineTo(-80, -54); ctx.lineTo(0, -40); ctx.closePath(); ctx.fill();
      ctx.restore();
      if (ta > 0.01) { ctx.save(); ctx.globalAlpha *= clamp(fa * 2) * ta; wtxt(ctx, "awal", bx - 46, by - 92, 30, { weight: 900, color: "#B23A36" }); ctx.restore(); }
    }
  }
  function dust(ctx, t, a, box = [560, 330, 760, 480]) {
    ctx.save(); const r = D.rng(31);
    for (let i = 0; i < 30; i++) { const x0 = box[0] + r() * box[2], y0 = box[1] + r() * box[3], sp = 6 + r() * 10, ph = r() * 6.28;
      const x = x0 + Math.sin(t * 0.3 + ph) * 26, y = y0 - ((t * sp + ph * 30) % 120) + 60, al = a * (0.18 + 0.25 * Math.sin(t * 1.3 + ph) ** 2);
      ctx.fillStyle = `rgba(255,236,190,${al})`; ctx.beginPath(); ctx.arc(x, y, 2 + r() * 2, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  // seluruh dunia meja; o: cal (indeks tahun), route{…}, pen{x,y,ang,lift}|null, glassGlow, bip(ctx)
  function world(ctx, t, o = {}) {
    wall(ctx, t); lamp(ctx, t, 1); shelf(ctx, t); desk(ctx);
    stack(ctx); glasses(ctx, o.glassGlow || 0);
    calendar(ctx, t, o.cal == null ? 7 : o.cal);
    paper(ctx, t, o.route || {});
    const pn = o.pen || PEN_REST; pencil(ctx, pn.x, pn.y, pn.ang, pn.lift || 0);
    if (o.bip) o.bip(ctx);
    grade(ctx, 0.12);
    KL.parts.warmPool(ctx, 860, 760, 700, 0.6, 0.5);
    KL.parts.warmPool(ctx, LAMP.hx + 50, LAMP.hy + 40, 420, 0.4, 1);
    addLight(ctx, LAMP.hx + 55, LAMP.hy + 95, 150, "#FFE7B0", 0.5);
  }
  // keadaan akhir rute (sama dengan akhir b7_1)
  const ROUTE_DONE = { rp: 6, badges: [1, 1, 1, 1, 1, 1], flag: 1, glow: 0.6, start: 0, textA: 1 };

  // latar kabur (dunia meja tanpa Bip, statis), dibuat sekali
  let BLUR = null;
  function blurWorld() {
    if (BLUR) return BLUR;
    const pad = [120, 80], cw = W + 2 * pad[0], ch = HH + 2 * pad[1];
    const a = mk(cw, ch), x = a.getContext("2d"); x.translate(pad[0], pad[1]);
    world(x, 0, { cal: 7, route: ROUTE_DONE });
    const b = mk(cw, ch), y = b.getContext("2d"); y.filter = "blur(7px)"; y.drawImage(a, 0, 0); y.filter = "none";
    BLUR = { img: b, pad };
    return BLUR;
  }
  function drawBlur(ctx, a = 1) { if (a <= 0.01) return; const B = blurWorld(); ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(B.img, -B.pad[0], -B.pad[1]); ctx.restore(); }

  // ---------- kubus ----------
  const KUB = () => (K.KUBUS || {});
  const CUBE = { x: 705, y: 482, S: 175, yaw: 0.65, pitch: 0.4 };
  function mkProj(n, cx, cy, S, yaw = CUBE.yaw, pitch = CUBE.pitch) {
    const c = (n - 1) / 2, cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const f = (i, j, k) => { const x = i - c, y = k - c, z = j - c, xr = x * cyw + z * syw, zr = -x * syw + z * cyw;
      return { x: cx + xr * S, y: cy - (y * cp + zr * sp) * S, d: zr * cp - y * sp }; };
    f.n = n; f.S = S; f.cx = cx; f.cy = cy; return f;
  }
  const rid = s => [+s[0], +s[1], +s[2]];
  const rid5 = s => [+s[0], +s[1], +s[2]];
  function faceQuad(Pj, axis, v) {
    const lo = -0.5, hi = Pj.n - 0.5, q = [[lo, lo], [hi, lo], [hi, hi], [lo, hi]];
    return q.map(([u, w]) => { const c = [0, 0, 0]; c[axis] = v; c[(axis + 1) % 3] = u; c[(axis + 2) % 3] = w; return Pj(c[0], c[1], c[2]); });
  }
  function poly(ctx, pts) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath(); }
  // dinding belakang (kiri, belakang, bawah) + kisi sel; a = alpha
  function boxBack(ctx, Pj, a, grid = 1) {
    if (a <= 0.01) return; const n = Pj.n, lo = -0.5, hi = n - 0.5;
    ctx.save(); ctx.globalAlpha *= a;
    [[0, lo], [1, hi], [2, lo]].forEach(([ax, v]) => { const q = faceQuad(Pj, ax, v); poly(ctx, q); ctx.fillStyle = "rgba(120,150,255,0.10)"; ctx.fill(); });
    if (grid > 0.01) { ctx.strokeStyle = `rgba(200,215,255,${0.16 * grid})`; ctx.lineWidth = n > 6 ? 1.2 : 2;
      [[0, lo], [1, hi], [2, lo]].forEach(([ax, v]) => { for (let m = 1; m < n; m++) { const u = m - 0.5;
        for (const dir of [1, 2]) { const A = [0, 0, 0], B = [0, 0, 0]; A[ax] = B[ax] = v; const o1 = (ax + dir) % 3, o2 = (ax + 3 - dir) % 3; A[o1] = B[o1] = u; A[o2] = lo; B[o2] = hi;
          const p = Pj(...A), q = Pj(...B); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } } }); }
    // tiga rusuk belakang (bertemu di pojok kiri-belakang-bawah)
    const hc = [lo, hi, lo]; ctx.strokeStyle = "rgba(200,215,255,0.38)"; ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
    for (let ax = 0; ax < 3; ax++) { const B = hc.slice(); B[ax] = ax === 1 ? lo : hi; const p = Pj(...hc), q = Pj(...B); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
    ctx.setLineDash([]); ctx.restore();
  }
  function boxFront(ctx, Pj, a, draw = 1) {
    if (a <= 0.01) return; const n = Pj.n, lo = -0.5, hi = n - 0.5;
    ctx.save(); ctx.globalAlpha *= a;
    [[0, hi], [1, lo], [2, hi]].forEach(([ax, v]) => { poly(ctx, faceQuad(Pj, ax, v)); ctx.fillStyle = "rgba(170,195,255,0.045)"; ctx.fill(); });
    if (n > 6) { ctx.strokeStyle = "rgba(210,224,255,0.2)"; ctx.lineWidth = 1.3;
      [[0, hi], [1, lo], [2, hi]].forEach(([ax, v]) => { for (let m = 1; m < n; m++) { const u = m - 0.5; for (const dir of [1, 2]) { const A = [0, 0, 0], B = [0, 0, 0]; A[ax] = B[ax] = v; const o1 = (ax + dir) % 3, o2 = (ax + 3 - dir) % 3; A[o1] = B[o1] = u; A[o2] = lo; B[o2] = hi;
        const p = Pj(...A), q = Pj(...B); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } } }); }
    // 9 rusuk depan: semua rusuk yang tidak menyentuh pojok tersembunyi
    const hid = [lo, hi, lo], E = [];
    for (let ax = 0; ax < 3; ax++) for (const u of [lo, hi]) for (const w of [lo, hi]) { const A = [0, 0, 0], B = [0, 0, 0]; A[ax] = lo; B[ax] = hi; const o1 = (ax + 1) % 3, o2 = (ax + 2) % 3; A[o1] = B[o1] = u; A[o2] = B[o2] = w;
      const touch = [A, B].some(C => C[0] === hid[0] && C[1] === hid[1] && C[2] === hid[2]); if (!touch) E.push([A, B]); }
    ctx.strokeStyle = "rgba(220,232,255,0.78)"; ctx.lineWidth = n > 6 ? 2.5 : 3.5; ctx.lineCap = "round";
    E.forEach(([A, B], i) => { const u = clamp(draw * 1.4 - i * 0.04); if (u <= 0) return; const p = Pj(...A), q = Pj(lerp(A[0], B[0], u), lerp(A[1], B[1], u), lerp(A[2], B[2], u)); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); });
    ctx.restore();
  }
  // garis antarruangan bertetangga (tanpa tembus)
  function lattice(ctx, Pj, a) {
    if (a <= 0.01) return; const n = Pj.n; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = "rgba(205,218,255,0.26)"; ctx.lineWidth = 2.5;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) { const p = Pj(i, j, k);
      [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(([a1, b1, c1]) => { if (i + a1 >= n || j + b1 >= n || k + c1 >= n) return; const q = Pj(i + a1, j + b1, k + c1); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }); }
    ctx.restore();
  }
  // titik ruangan (jauh dulu). o: rise(n)→0..1, from(n)→[x,y], num(n)→0..1 (lencana nomor), hi(room)→0..1 sorot, col(room)
  function dots(ctx, Pj, o = {}) {
    const n = Pj.n, S = Pj.S, list = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) list.push([i, j, k]);
    const arr = list.map(r => ({ r, p: Pj(...r) })).sort((A, B) => B.p.d - A.p.d);
    ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    if (n > 6) { // kubus besar: titik kecil saja
      arr.forEach(({ r, p }) => { if (!(r[0] === n - 1 || r[1] === 0 || r[2] === n - 1)) return; const ru = o.rise ? o.rise(r) : 1; if (ru <= 0.01) return; const rad = Math.max(1.8, S * 0.15);
        ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * ru * 0.85; ctx.fillStyle = "#E4ECFF"; ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, TAU); ctx.fill(); });
      ctx.restore(); return;
    }
    arr.forEach(({ r, p }) => {
      const idx = r[2] * n * n + r[1] * n + r[0];
      const ru = o.rise ? o.rise(idx) : 1; if (ru <= 0.001) return;
      let x = p.x, y = p.y; if (o.from && ru < 1) { const [fx, fy] = o.from(idx), e = eio(ru); x = lerp(fx, p.x, e); y = lerp(fy, p.y, e) - Math.sin(e * Math.PI) * 120; }
      const rad = S * 0.112 * (1 - p.d * 0.07) * (n === 3 ? 1 : 1.25), h = o.hi ? o.hi(r) : 0, na = o.num ? o.num(idx) : 0;
      ctx.save(); ctx.globalAlpha *= clamp(ru * 3);
      D.glow(ctx, x, y, rad * 3.2, o.col ? o.col(r) || "#CFE0FF" : "#CFE0FF", 0.35 + 0.4 * h);
      if (h > 0.01) { D.glow(ctx, x, y, rad * 5, DOORC, 0.5 * h); }
      ctx.fillStyle = (o.col && o.col(r)) || (h > 0.5 ? "#FFE3A0" : "#F2F6FF"); ctx.beginPath(); ctx.arc(x, y, rad * (1 + 0.35 * h), 0, TAU); ctx.fill();
      if (na > 0.01) { // lencana nomor
        const k = lerp(0.6, 1, clamp(spring(na * 0.7, 10, 0.5))); ctx.save(); ctx.globalAlpha *= na; ctx.translate(x, y); ctx.scale(k, k);
        ctx.fillStyle = "rgba(16,22,64,0.92)"; ctx.beginPath(); ctx.arc(0, 0, 27, 0, TAU); ctx.fill(); ctx.strokeStyle = "rgba(242,246,255,0.85)"; ctx.lineWidth = 3; ctx.stroke();
        D.txt(ctx, String(idx + 1), 0, 14, 40, { align: "center", weight: 900, color: "#FFFFFF" }); ctx.restore(); }
      ctx.restore();
    });
    ctx.restore();
  }
  // panah pintu dari ruangan A sepanjang sumbu ax (+1). Tembus: panah ke dinding + rintisan masuk dari dinding seberang.
  function arrowLine(ctx, p, q, lw, col, head = true, a = 1) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round";
    const an = Math.atan2(q.y - p.y, q.x - p.x), hl = head ? lw * 2.6 : 0;
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x - Math.cos(an) * hl * 0.6, q.y - Math.sin(an) * hl * 0.6); ctx.stroke();
    if (head) { ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(q.x - Math.cos(an - 0.5) * hl, q.y - Math.sin(an - 0.5) * hl); ctx.lineTo(q.x - Math.cos(an + 0.5) * hl, q.y - Math.sin(an + 0.5) * hl); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  function door(ctx, Pj, r, ax, o = {}) {
    const n = Pj.n, e = [0, 0, 0]; e[ax] = 1; const g0 = o.g0 == null ? 0.2 : o.g0, g1 = o.g1 == null ? 0.8 : o.g1, u = o.u == null ? 1 : o.u;
    const at = f => Pj(r[0] + e[0] * f, r[1] + e[1] * f, r[2] + e[2] * f);
    if (r[ax] < n - 1) { if (u > 0.01) arrowLine(ctx, at(g0), at(lerp(g0, g1, u)), o.lw || 5, o.col || "#FFFFFF", o.head !== false, o.a == null ? 1 : o.a); return { tip: at(g1), mid: at(0.5) }; }
    // tembus
    const wallF = 0.5, gEnd = Math.min(0.48, g1 * 0.6);
    if (u > 0.01) arrowLine(ctx, at(g0), at(lerp(g0, gEnd + 0.02, u)), o.lw || 5, o.col || "#FFFFFF", o.head !== false, o.a == null ? 1 : o.a);
    return { tip: at(wallF), mid: at(0.35) };
  }

  // jalur warna c (data asli) sampai progres p (0..N); o: lw, alpha, head
  function pathSeg(Pj, seq, s) {
    const n = Pj.n, N = seq.length, A = rid(seq[s]), B = rid(seq[(s + 1) % N]);
    let ax = 0; for (let q = 0; q < 3; q++) if (A[q] !== B[q]) ax = q;
    return { A, B, ax, wrap: A[ax] === n - 1 && B[ax] === 0 };
  }
  function pointOn(Pj, sg, f) { // posisi kepala pada ruas sg dengan pecahan f (tembus: keluar dinding lalu masuk dari seberang)
    const e = [0, 0, 0]; e[sg.ax] = 1;
    if (!sg.wrap) return Pj(sg.A[0] + e[0] * f, sg.A[1] + e[1] * f, sg.A[2] + e[2] * f);
    if (f < 0.5) return Pj(sg.A[0] + e[0] * f, sg.A[1] + e[1] * f, sg.A[2] + e[2] * f);
    const g2 = f - 1; return Pj(sg.B[0] + e[0] * g2, sg.B[1] + e[1] * g2, sg.B[2] + e[2] * g2);
  }
  function drawPath(ctx, Pj, seq, c, p, o = {}) {
    if (p <= 0.001) return; const N = seq.length, col = COL3[c], lwB = o.lw || Math.max(2.5, Pj.S * 0.05);
    const segs = [];
    for (let s = 0; s < Math.ceil(Math.min(N, p)); s++) {
      const sg = pathSeg(Pj, seq, s), f = clamp(p - s), e = [0, 0, 0]; e[sg.ax] = 1; const A = sg.A, B = sg.B;
      const at = (R, fr) => Pj(R[0] + e[0] * fr, R[1] + e[1] * fr, R[2] + e[2] * fr);
      if (!sg.wrap) segs.push([at(A, 0), at(A, f), 0]);
      else { segs.push([at(A, 0), at(A, 0.5 * clamp(f * 2)), 1]); if (f > 0.5) segs.push([at(B, -0.5), at(B, -0.5 + 0.5 * clamp(f * 2 - 1)), 2]); }
    }
    ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha; ctx.lineCap = "round";
    [[lwB * (Pj.n > 3 ? 2 : 3.2), Pj.n > 3 ? 0.12 : 0.22, "lighter"], [lwB, 1, "source-over"]].forEach(([lw, al, mode]) => {
      ctx.globalCompositeOperation = mode; ctx.lineWidth = lw;
      segs.forEach(([a, b, kind]) => { ctx.strokeStyle = D.hexA(col, al); ctx.setLineDash(kind ? [lw * 1.3, lw * 0.9] : []); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
    });
    ctx.setLineDash([]); ctx.globalCompositeOperation = "source-over";
    // gerbang tembus (cincin kecil di dinding keluar & masuk)
    if (o.portals !== false && Pj.n <= 5) segs.forEach(([a, b, kind]) => { if (!kind) return; const q = kind === 1 ? b : a; ctx.strokeStyle = D.hexA(col, 0.9); ctx.lineWidth = Math.max(2, lwB * 0.5); ctx.beginPath(); ctx.ellipse(q.x, q.y, lwB * 1.6, lwB * 1.1, 0, 0, TAU); ctx.stroke(); });
    if (o.head && p < N) { const s = Math.floor(p), hp = pointOn(Pj, pathSeg(Pj, seq, s), p - s); ctx.globalCompositeOperation = "lighter"; D.glow(ctx, hp.x, hp.y, lwB * 9, col, 1); ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(hp.x, hp.y, lwB * 1.25, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  // panggung kubus: latar kabur + bayang gelap lembut di belakang kubus + debu
  function stage(ctx, t, cam, o = {}) {
    ctx.save(); camT(ctx, cam);
    if ((o.sharp || 0) > 0.01) { world(ctx, t, o.sharpOpt || { cal: 7, route: ROUTE_DONE }); }
    drawBlur(ctx, o.blur == null ? 1 : o.blur);
    ctx.restore();
    const ha = o.halo == null ? 1 : o.halo;
    if (ha > 0.01) { const [hx, hy] = o.haloAt || [CUBE.x, CUBE.y], R = o.haloR || 640; const gr = ctx.createRadialGradient(hx, hy, 60, hx, hy, R);
      gr.addColorStop(0, `rgba(10,14,48,${0.6 * ha})`); gr.addColorStop(0.6, `rgba(10,14,48,${0.4 * ha})`); gr.addColorStop(1, "rgba(10,14,48,0)"); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH); }
    dust(ctx, t, 0.8, [80, 100, 1760, 760]);
  }

  // =====================================================================
  // b7_1: kalender ke 2026 → "Donald Knuth" → kertas catatan: rute 6 tempat, tepat satu kali, kembali ke awal
  function T1(b) {
    return { tYr: D.at(b, "Kembali"), t26: D.atEnd(b, "enam,"), tKn: D.at(b, "Knuth"), tTul: D.at(b, "menulis"), tRute: D.at(b, "rute"),
      tKunj: D.at(b, "mengunjungi"), tTepat: D.at(b, "tepat satu"), tLalu: D.at(b, "lalu"), tAwal: D.at(b, "awal."), tEnd: D.speechEnd(b) };
  }
  function cam1(b, l, T) {
    return D.path([[0, 960, 560, 1.0], [T.tKn + 0.2, 950, 585, 1.05], [T.tRute - 0.05, 930, 790, 1.6], [b.dur + 0.6, 932, 792, 1.66]], l);
  }
  // waktu kunjungan tempat ke-k (k = 0..6; 6 = kembali ke awal)
  function visitT(T, k) { if (k <= 0) return T.tKunj; if (k <= 5) return lerp(T.tKunj + 0.15, T.tLalu - 0.15, k / 5); return T.tAwal; }
  function rp1(T, l) {
    if (l < T.tKunj + 0.15) return 0;
    for (let k = 0; k < 6; k++) { const a = k === 0 ? T.tKunj + 0.15 : visitT(T, k), b2 = visitT(T, k + 1); const a2 = k === 5 ? T.tLalu + 0.1 : a; if (l < b2) return k + eio(clamp((l - a2) / (b2 - a2))); }
    return 6;
  }
  function pen1(T, l, rp) {
    const A = plW(0), rest = PEN_REST;
    if (l < T.tTul) return rest;
    if (l < T.tKunj + 0.15) { const u = eio(ramp(l, T.tTul, T.tKunj + 0.1 - T.tTul)); return { x: lerp(rest.x, A[0], u), y: lerp(rest.y, A[1], u) - Math.sin(u * Math.PI) * 60, ang: lerp(rest.ang, -1.02, u), lift: Math.sin(u * Math.PI) * 0.8 }; }
    if (rp < 6) { const p = routePt(rp); return { x: p[0], y: p[1], ang: -1.02, lift: 0 }; }
    const u = eio(ramp(l, T.tAwal + 0.35, 0.9)); return { x: lerp(A[0], rest.x, u), y: lerp(A[1], rest.y, u) - Math.sin(u * Math.PI) * 60, ang: lerp(-1.02, rest.ang, u), lift: Math.sin(u * Math.PI) * 0.8 };
  }
  function routeState1(T, l, t) {
    const rp = rp1(T, l);
    return { rp, places: i => ramp(l, T.tRute + i * 0.08, 0.3), start: ramp(l, T.tRute + 0.1, 0.3) * (1 - ramp(l, T.tAwal - 0.2, 0.3)),
      badges: [0, 1, 2, 3, 4, 5].map(i => ramp(l, visitT(T, i) - 0.02, 0.2)), flag: ramp(l, T.tAwal - 0.05, 0.5), glow: ramp(l, T.tAwal, 0.6) * (0.6 + 0.4 * Math.sin(t * 2.4) ** 2), textA: 1 };
  }
  function bip1(ctx, b, l, t, T, pen) {
    let o;
    if (l < T.tKn) o = { pose: "diam", t, mood: "happy", look: [1, -0.3] };
    else if (l < T.tRute) o = { pose: "diam", t, mood: "think", look: [-0.9, 0.5] };
    else if (l < T.tAwal) o = { pose: "tunjuk", t, target: [pen.x, pen.y], mood: "happy" };
    else if (l < T.tAwal + 1.3) o = { pose: "kaget", t, k: l - T.tAwal, mood: "wow", seru: false };
    else o = { pose: "diam", t, mood: "happy", look: [-0.8, 0.4], wave: 0 };
    KB.draw(ctx, BIP1.x, BIP1.y, BIP1.s, o);
  }
  function calFl(T, l) { return 7 * eio(clamp((l - T.tYr) / Math.max(0.5, T.t26 - T.tYr))); }
  S.b7_1 = function (ctx, b, l, t) {
    const T = T1(b), c = drift(cam1(b, l, T), t), rs = routeState1(T, l, t), pen = pen1(T, l, rs.rp);
    ctx.save(); camT(ctx, c);
    world(ctx, t, { cal: calFl(T, l), route: rs, pen, glassGlow: win(l, T.tKn - 0.1, T.tRute, 0.5), bip: cx => bip1(cx, b, l, t, T, pen) });
    dust(ctx, t, 0.7);
    ctx.restore();
    D.post(cx => {
      // tahun 2026 (pil di atas kalender) saat kamera masih lebar
      const [kx, ky] = toS(c, CAL.x, CAL.y - CAL.h - 70), p0 = pop(l, T.t26 - 0.05);
      tag(cx, "tahun 2026", kx - 40, ky, p0.a * (1 - ramp(l, T.tKn + 0.3, 0.4)), { sp: p0.sp, col: "#FF8A80", size: 50 });
      // Donald Knuth
      const [gx, gy] = toS(c, GLS.x + 60, GLS.y - 150), p1 = pop(l, T.tKn);
      tag(cx, "Donald Knuth", clamp(gx, 330, 1600), clamp(gy, 140, 820), p1.a * (1 - ramp(l, T.tKunj - 0.2, 0.4)), { sp: p1.sp, col: P.warm, size: 50 });
      // "rute" → tepat satu kali → kembali ke awal
      const p2 = pop(l, T.tRute);
      tag(cx, "sebuah rute", 760, 168, p2.a * (1 - ramp(l, T.tTepat - 0.25, 0.25)), { sp: p2.sp, col: P.amber, size: 52 });
      const p3 = pop(l, T.tTepat);
      tag(cx, "setiap tempat: tepat 1 kali", 760, 168, p3.a * (1 - ramp(l, T.tLalu + 0.2, 0.3)), { sp: p3.sp, col: P.amber, size: 52 });
      const p4 = pop(l, T.tAwal - 0.05);
      tag(cx, "lalu kembali ke tempat awal", 760, 168, p4.a, { sp: p4.sp, col: P.green, size: 52 });
      // penghitung tempat dikunjungi (pojok kanan atas)
      const nV = rs.badges.reduce((s, v) => s + (v > 0.5 ? 1 : 0), 0), ca = ramp(l, T.tKunj, 0.3);
      if (ca > 0.01) tag(cx, `tempat dikunjungi: ${nV} / 6`, 1500, 168, ca, { col: P.blue, size: 46 });
    });
  };

  // =====================================================================
  // b7_2: kubus 27 ruangan, 3×3×3, tiga pintu satu arah, tembus seperti Pac-Man
  function T2(b) {
    return { tBay: D.at(b, "Bayangkan"), tGed: D.at(b, "gedung"), tKub: D.at(b, "kubus"), t27: D.at(b, "tujuh"), tRu: D.atEnd(b, "ruangan,"),
      t3a: D.at(b, "tiga kali"), t3b: D.at(b, "tiga kali tiga."), t3c: D.at(b, "tiga."), tSet: D.at(b, "Setiap"), tPin: D.at(b, "tiga pintu"), tArah: D.at(b, "satu arah"),
      tKan: D.at(b, "kanan,"), tBel: D.at(b, "belakang,"), tAtas: D.at(b, "atas."), tUj: D.at(b, "Pintu di"), tTem: D.at(b, "tembus"), tSis: D.at(b, "sisi"),
      tPac: D.at(b, "seperti di"), tEnd: D.speechEnd(b) };
  }
  // tiga kali "tiga": tiga kata "tiga" berurutan di "tiga kali tiga kali tiga."
  function threeT(b) { const i = b.text.indexOf("tiga kali tiga kali tiga."); const w = b.words, toks = b.text.split(/\s+/); let pos = 0, k0 = -1;
    for (let k = 0; k < toks.length; k++) { const j = b.text.indexOf(toks[k], pos); if (j === i) { k0 = k; break; } pos = j + toks[k].length; }
    if (k0 < 0 || !w) return [D.at(b, "tiga kali"), D.at(b, "tiga kali") + 1, D.at(b, "tiga.")]; return [w[k0][1], w[k0 + 2][1], w[k0 + 4][1]]; }
  const WIDE = { x: 960, y: 540, z: 1 };
  function cam2(b, l, T) { const c = D.path([[0, 932, 792, 1.66], [0.25, 932, 792, 1.66], [1.9, 960, 540, 1.0], [b.dur + 1, 960, 540, 1.0]], l); return c; }
  const swayYaw = t => CUBE.yaw + 0.022 * Math.sin(t * 0.35);
  // landing ruangan ke-idx (urutan nomor 1..27)
  function land2(T, idx) { return lerp(T.tKub + 0.15, T.tRu, idx / 26); }
  // token tembus: s ∈ [-0.5, 2.5) sepanjang baris j=0,k=0; tiga putaran
  // waktu (pecahan putaran) saat token menyeberang dinding kanan (s = 2.5)
  const ZC = (() => { let a = 0, z = 1; for (let i = 0; i < 40; i++) { const m = (a + z) / 2; if (3 * eio(m) < 2.5) a = m; else z = m; } return z; })();
  function loops2(T) { const L = 2.6, s1 = T.tSis + 0.1 - L * ZC, s2 = Math.max(s1 + L + 0.25, T.tPac - 0.1), s3 = s2 + L + 0.25; return [s1, s2, s3].map(s0 => ({ s0, L })); }
  function tokenS(lp, l) { for (const { s0, L } of lp) { if (l >= s0 && l < s0 + L) { const s = 3 * eio((l - s0) / L); return s < 2.5 ? s : s - 3; } } return null; }
  const crossTimes = lp => lp.map(({ s0, L }) => s0 + L * ZC);
  function arcade(ctx, x, y, w, h, s, t, a) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = "#2B2F66"; RR(ctx, x - w / 2 - 16, y - h / 2 - 16, w + 32, h + 32, 22); ctx.fill();
    ctx.fillStyle = "#0E1236"; RR(ctx, x - w / 2, y - h / 2, w, h, 12); ctx.fill();
    ctx.save(); RR(ctx, x - w / 2, y - h / 2, w, h, 12); ctx.clip();
    // lorong labirin generik: dinding atas & bawah dengan celah di kiri dan kanan
    const cy = y, gap = 54, x0 = x - w / 2 + 18, x1 = x + w / 2 - 18;
    ctx.strokeStyle = "#5A8CFF"; ctx.lineWidth = 6; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 4, cy - gap); ctx.lineTo(x0 + 30, cy - gap); ctx.lineTo(x0 + 30, y - h / 2 + 22); ctx.lineTo(x1 - 30, y - h / 2 + 22); ctx.lineTo(x1 - 30, cy - gap); ctx.lineTo(x + w / 2 + 4, cy - gap); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 4, cy + gap); ctx.lineTo(x0 + 30, cy + gap); ctx.lineTo(x0 + 30, y + h / 2 - 22); ctx.lineTo(x1 - 30, y + h / 2 - 22); ctx.lineTo(x1 - 30, cy + gap); ctx.lineTo(x + w / 2 + 4, cy + gap); ctx.stroke();
    ctx.strokeStyle = "rgba(90,140,255,0.6)"; ctx.lineWidth = 5; RR(ctx, x - 70, cy - 22, 140, 44, 10); ctx.stroke();
    // butir kecil
    ctx.fillStyle = "#FFE6B0"; for (let q = 0; q < 9; q++) { const px = x0 + 50 + q * (x1 - x0 - 100) / 8; if (Math.abs(px - x) < 80) continue; ctx.beginPath(); ctx.arc(px, cy + (q % 2 ? 0 : 0), 4, 0, TAU); ctx.fill(); }
    // bola: posisi mengikuti token kubus
    if (s != null) { const u = (s + 0.5) / 3, bx = lerp(x - w / 2 - 20, x + w / 2 + 20, u);
      ctx.fillStyle = "#FFD447"; D.glow(ctx, bx, cy, 50, "#FFD447", 0.6); ctx.beginPath(); ctx.arc(bx, cy, 20, 0, TAU); ctx.fill();
      // bayangan bola di sisi seberang saat menyeberang
      if (u > 0.92) { const bx2 = bx - (w + 40); ctx.beginPath(); ctx.arc(bx2, cy, 20, 0, TAU); ctx.fill(); }
    }
    ctx.restore();
    ctx.fillStyle = "#5A62B0"; RR(ctx, x - 50, y + h / 2 + 16, 100, 16, 6); ctx.fill();
    ctx.restore();
  }
  function bip2(ctx, b, l, t, T, Pj, tok, cross) {
    const u = eio(ramp(l, 0.45, 1.5)), x = lerp(BIP1.x, BIPC.x, u), y = lerp(BIP1.y, BIPC.y, u), s = lerp(BIP1.s, BIPC.s, u);
    let o;
    if (l < 0.45) o = { pose: "diam", t, mood: "happy", look: [-0.6, -0.6] };
    else if (u < 1) o = { pose: "jalan", t, dir: 1 };
    else if (l < T.t3a - 0.2) o = { pose: "diam", t, mood: "wow", look: [-1, -0.4] };
    else if (l < T.tSet) { const tg = Pj(1, 1, 1); o = { pose: "tunjuk", t, target: [tg.x + 80, tg.y], mood: "happy" }; }
    else if (l < T.tUj) { const tg = Pj(0, 0, 0); o = { pose: "tunjuk", t, target: [tg.x + 60, tg.y - 20], mood: "think" }; }
    else { const kc = cross.find(c => l >= c && l < c + 1.2); if (kc != null && kc === cross[0]) o = { pose: "kaget", t, k: l - kc, mood: "wow", seru: false };
      else { const lx = tok ? clamp((tok.x - x) / 600, -1, 1) : -0.6; o = { pose: "diam", t, mood: "happy", look: [lx, -0.2] }; } }
    KB.draw(ctx, x, y, s, o);
  }
  S.b7_2 = function (ctx, b, l, t) {
    const T = T2(b), c = cam2(b, l, T), cz = drift(c, t);
    const [t3a, t3b, t3c] = threeT(b);
    const blurA = ramp(l, 0.35, 1.2), haloA = ramp(l, 0.9, 1.0);
    stage(ctx, t, cz, { sharp: 1 - blurA, blur: blurA, halo: haloA, sharpOpt: { cal: 7, route: Object.assign({}, ROUTE_DONE, { textA: clamp((cz.z - 1.35) / 0.2) }) } });
    // proyeksi (kubus tetap di layar; tidak ikut kamera — muncul setelah kamera mundur)
    const Pj = mkProj(3, CUBE.x, CUBE.y, CUBE.S, swayYaw(t));
    const boxA = ramp(l, T.tGed - 0.1, 0.3), boxDraw = ramp(l, T.tGed - 0.1, Math.max(0.6, T.tKub + 0.5 - T.tGed));
    const fromPt = idx => { const r = D.rng(100 + idx); const [sx, sy] = toS(cz, PAP.x + (r() - 0.5) * 520, PAP.y + (r() - 0.5) * 160); return [sx, sy]; };
    const numA = idx => ramp(l, land2(T, idx), 0.15) * (1 - ramp(l, T.tSet - 0.3, 0.5));
    const latA = ramp(l, T.tRu, 0.6) * (1 - 0.55 * ramp(l, T.tSet, 0.6));
    // sorot baris / lajur / tingkat
    const rowA = [win(l, t3a - 0.05, t3b - 0.1, 0.3), win(l, t3b - 0.05, t3c - 0.1, 0.3), win(l, t3c - 0.05, T.tSet - 0.1, 0.3)];
    const rows = [[[0, 0, 0], [1, 0, 0], [2, 0, 0]], [[2, 0, 0], [2, 1, 0], [2, 2, 0]], [[0, 0, 0], [0, 0, 1], [0, 0, 2]]];
    // ruangan 000 disorot, pintu
    const hiA = ramp(l, T.tSet + 0.25, 0.4) * (1 - 0.6 * ramp(l, T.tUj + 0.2, 0.5));
    const doorT = [T.tKan, T.tBel, T.tAtas];
    const lp = loops2(T), cross = crossTimes(lp), sTok = l >= T.tUj ? tokenS(lp, l) : null;
    const tok = sTok != null ? Pj(sTok, 0, 0) : null;
    // gambar kubus
    boxBack(ctx, Pj, boxA, ramp(l, T.tRu, 0.6));
    lattice(ctx, Pj, latA);
    // sorot baris
    rows.forEach((rw, i) => { const a = rowA[i]; if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = "round";
      const p0 = Pj(...rw[0]), p2 = Pj(...rw[2]); ctx.strokeStyle = D.hexA(DOORC, 0.35); ctx.lineWidth = 54; ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      ctx.strokeStyle = DOORC; ctx.lineWidth = 6; ctx.stroke(); ctx.restore(); });
    // pintu ruangan 000 (abu-abu muncul di "tiga pintu", tiap pintu berkedip saat disebut)
    const r0 = [0, 0, 0], dA = ramp(l, T.tPin, 0.4) * (1 - ramp(l, T.tUj - 0.1, 0.5) * 0.65);
    for (let ax = 0; ax < 3; ax++) { const tk = doorT[ax], on = ramp(l, tk - 0.05, 0.15), blink = l > tk && l < tk + 1.0 ? 0.5 + 0.5 * Math.cos((l - tk) * TAU * 2.5) : 0;
      const col = on > 0.5 ? (blink > 0.01 && l < tk + 1.0 ? DOORC : "#FFFFFF") : "rgba(220,228,255,0.8)", u = ramp(l, T.tPin + ax * 0.12, 0.35);
      if (on > 0.01 && l < tk + 1.0) { const tip = door(ctx, Pj, r0, ax, { u: 1, lw: 30, col: D.hexA(DOORC, 0.3 * blink), head: false, a: dA }); }
      door(ctx, Pj, r0, ax, { u, lw: on > 0.5 ? 12 : 8, col, head: l >= T.tArah - 0.05, a: dA, g0: 0.22, g1: 0.82 });
    }
    // pintu tembus dari ruangan 200 (dan masuk ke 000)
    const wA = ramp(l, T.tUj, 0.4);
    if (wA > 0.01) {
      const fR = faceQuad(Pj, 0, 2.5), fL = faceQuad(Pj, 0, -0.5);
      const flashR = cross.reduce((m, tc) => Math.max(m, l > tc - 0.3 && l < tc + 0.5 ? 1 - Math.abs(l - tc) / 0.5 : 0), 0);
      ctx.save(); ctx.globalAlpha *= wA; poly(ctx, fR); ctx.fillStyle = D.hexA(DOORC, 0.12 + 0.3 * flashR); ctx.fill(); ctx.strokeStyle = D.hexA(DOORC, 0.4 + 0.5 * flashR); ctx.lineWidth = 4; ctx.stroke();
      poly(ctx, fL); ctx.fillStyle = D.hexA(DOORC, 0.05 + 0.2 * flashR); ctx.fill(); ctx.strokeStyle = D.hexA(DOORC, 0.25 + 0.5 * flashR); ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      arrowLine(ctx, Pj(2.2, 0, 0), Pj(2.5, 0, 0), 9, DOORC, true, wA);
      arrowLine(ctx, Pj(-0.5, 0, 0), Pj(-0.2, 0, 0), 7, DOORC, true, wA * 0.8);
      const e1 = Pj(2.5, 0, 0), e2 = Pj(-0.5, 0, 0); ctx.save(); ctx.globalAlpha *= wA; ctx.strokeStyle = DOORC; ctx.lineWidth = 4; [e1, e2].forEach(p => { ctx.beginPath(); ctx.ellipse(p.x, p.y, 30 + 14 * flashR, 21 + 10 * flashR, 0, 0, TAU); ctx.stroke(); }); ctx.restore();
    }
    dots(ctx, Pj, { rise: idx => ramp(l, land2(T, idx) - 0.55, 0.55), from: fromPt, num: numA, hi: r => (r[0] + r[1] + r[2] === 0 ? hiA : 0) });
    // token
    if (tok) { const tr = sTok; ctx.save(); ctx.globalCompositeOperation = "lighter";
      for (let q = 1; q <= 6; q++) { const sq = tr - q * 0.06; if (sq < -0.5) break; const pq = Pj(sq, 0, 0); D.glow(ctx, pq.x, pq.y, 30 - q * 3, "#FFD447", 0.5 - q * 0.07); }
      D.glow(ctx, tok.x, tok.y, 70, "#FFD447", 0.9); ctx.restore(); ctx.fillStyle = "#FFF3C4"; ctx.beginPath(); ctx.arc(tok.x, tok.y, 17, 0, TAU); ctx.fill(); }
    boxFront(ctx, Pj, boxA, boxDraw);
    // tepi ukuran "3"
    const edgeLbl = [{ A: [-0.5, -0.5, -0.5], B: [2.5, -0.5, -0.5] }, { A: [2.5, -0.5, -0.5], B: [2.5, 2.5, -0.5] }, { A: [-0.5, -0.5, -0.5], B: [-0.5, -0.5, 2.5] }];
    const edgeA = [t3a, t3b, t3c].map(tt => ramp(l, tt - 0.05, 0.25) * (1 - ramp(l, T.tPin, 0.5)));
    edgeLbl.forEach((E, i) => { const a = edgeA[i]; if (a <= 0.01) return; const p = Pj(...E.A), q = Pj(...E.B); ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = DOORC; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.restore(); });
    // Bip
    bip2(ctx, b, l, t, T, Pj, tok, cross);
    D.post(cx => {
      // label tepi "3"
      edgeLbl.forEach((E, i) => { const a = edgeA[i]; if (a <= 0.01) return; const m = Pj((E.A[0] + E.B[0]) / 2, (E.A[1] + E.B[1]) / 2, (E.A[2] + E.B[2]) / 2);
        const dx = m.x - CUBE.x, dy = m.y - CUBE.y, dl = Math.hypot(dx, dy) || 1, off = [70, 70, 70][i];
        const sp = clamp(spring(l - [t3a, t3b, t3c][i], 10, 0.5)); tag(cx, "3", m.x + dx / dl * off, m.y + dy / dl * off, a, { sp, col: DOORC, size: 56 }); });
      // panel kanan
      const nL = [...Array(27).keys()].filter(i => l >= land2(T, i)).length, cA = ramp(l, land2(T, 0), 0.2);
      if (cA > 0.01) { const big = l >= T.t27 - 0.02 ? 1 : 0; tag(cx, `${nL} ruangan`, 1450, 170, cA, { sp: big ? clamp(spring(l - T.t27, 10, 0.5)) : 1, col: big ? P.amber : P.ink2, size: 56 }); }
      const f1 = ramp(l, t3a, 0.2), f2 = ramp(l, t3b, 0.2), f3 = ramp(l, t3c, 0.2), fOut = 1 - ramp(l, T.tPin - 0.2, 0.4);
      if (f1 > 0.01) { const s = f3 > 0.5 ? "3 × 3 × 3 = 27" : f2 > 0.5 ? "3 × 3" : "3"; tag(cx, s, 1450, 290, f1 * fOut, { col: DOORC, size: 56 }); }
      const pA = pop(l, T.tArah); tag(cx, "3 pintu, satu arah", 1450, 290, pA.a * (1 - ramp(l, T.tUj - 0.2, 0.3)), { sp: pA.sp, col: DOORC, size: 52 });
      // label pintu
      const lbl = [["kanan", [0.6, 0, 0], [10, 72]], ["belakang", [0, 0.75, 0], [150, 10]], ["atas", [0, 0, 0.7], [-112, 0]]];
      lbl.forEach(([s, pos, off], i) => { const p = pop(l, doorT[i]); if (p.a <= 0.01) return; const q = Pj(...pos);
        tag(cx, s, q.x + off[0], q.y + off[1], p.a * (1 - ramp(l, T.tUj - 0.1, 0.4)), { sp: p.sp, col: DOORC, size: 48 }); });
      // tembus
      const pT = pop(l, T.tSis); tag(cx, "tembus ke sisi seberang", 1450, 290, pT.a, { sp: pT.sp, col: DOORC, size: 50 });
      // layar permainan generik
      const pP = pop(l, T.tPac), aw = 420, ah = 200;
      if (pP.a > 0.01) { cx.save(); cx.globalAlpha *= pP.a; cx.translate(1450, 470); const k = lerp(0.85, 1, pP.sp); cx.scale(k, k); arcade(cx, 0, 0, aw, ah, sTok, t, 1); cx.restore();
        tag(cx, "seperti game Pac-Man", 1450, 630, pP.a, { sp: pP.sp, col: "#FFD447", size: 46 }); }
    });
  };

  // =====================================================================
  // b7_3: 81 pintu; merah, hijau, biru satu per satu (data asli), penghitung 1→27 per warna
  function T3(b) {
    return { tTk: D.at(b, "Teka-tekinya"), tWar: D.at(b, "mewarnai"), tPin: D.at(b, "setiap pintu"), tM: D.at(b, "merah,"), tH: D.at(b, "hijau,"), tB: D.at(b, "biru,"),
      tSeh: D.at(b, "sehingga"), tJal: D.at(b, "satu jalan"), tSem: D.at(b, "semua ruangan"), tTep: D.at(b, "tepat satu"), tEnd: D.speechEnd(b) };
  }
  function runs3(T, b) { const a = T.tM + 0.1, L = 3.35, gap = 0.12; return [[a, a + L], [a + L + gap, a + 2 * L + gap], [a + 2 * L + 2 * gap, a + 3 * L + 2 * gap]]; }
  const prog = (l, r) => 27 * clamp((l - r[0]) / (r[1] - r[0]));
  const count = (l, r) => (l < r[0] ? 0 : Math.min(27, Math.floor(prog(l, r) + 1e-6) + 1));
  function doorColors(seqs, ps) {   // kunci "ijk:ax" → warna (yang sudah dilewati)
    const m = {}; seqs.forEach((seq, c) => { const p = ps[c]; for (let s = 0; s < Math.min(27, Math.ceil(p)); s++) { if (p - s < 0.5 && s === Math.floor(p)) continue; const A = rid(seq[s]), B = rid(seq[(s + 1) % 27]); let ax = 0; for (let q = 0; q < 3; q++) if (A[q] !== B[q]) ax = q; m[seq[s] + ":" + ax] = c; } }); return m;
  }
  function brush(ctx, px, py, s, col, t) {
    ctx.save(); ctx.translate(px, py); ctx.rotate(-0.5 + 0.06 * Math.sin(t * 3));
    ctx.fillStyle = "#B57D57"; RR(ctx, -0.035 * s, -0.02 * s, 0.07 * s, 0.34 * s, 0.03 * s); ctx.fill();
    ctx.fillStyle = "#C9CDE6"; ctx.fillRect(-0.045 * s, -0.09 * s, 0.09 * s, 0.08 * s);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-0.05 * s, -0.09 * s); ctx.quadraticCurveTo(-0.055 * s, -0.2 * s, 0, -0.25 * s); ctx.quadraticCurveTo(0.055 * s, -0.2 * s, 0.05 * s, -0.09 * s); ctx.closePath(); ctx.fill();
    D.glow(ctx, 0, -0.2 * s, 0.14 * s, col, 0.6); ctx.restore();
  }
  function stage3(ctx, t) { stage(ctx, t, drift(WIDE, t), { blur: 1, halo: 1 }); }
  function cube3Full(ctx, t, Pj, o) {
    // o: greyA, ps[3], active, dimOthers, doneGlow
    const seqs = KUB()["3"]; if (!seqs) return;
    boxBack(ctx, Pj, 1, 1);
    const dc = doorColors(seqs, o.ps);
    // pintu abu-abu yang belum berwarna
    if (o.greyA > 0.01) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) for (let ax = 0; ax < 3; ax++) {
      const key = `${i}${j}${k}:${ax}`; if (dc[key] != null) continue; const u = o.grow ? o.grow(k * 9 + j * 3 + i) : 1;
      door(ctx, Pj, [i, j, k], ax, { u, lw: 5, col: "rgba(220,230,255,0.75)", head: true, a: o.greyA, g0: 0.2, g1: 0.78 });
    }
    seqs.forEach((seq, c) => { const act = o.active === c; const al = o.active == null || act ? 1 : 0.32 + 0.68 * (o.doneGlow || 0);
      drawPath(ctx, Pj, seq, c, o.ps[c], { lw: 8, alpha: al, head: act }); });
    const headRoom = {}; if (o.active != null) { const p = o.ps[o.active]; if (p > 0 && p < 27) headRoom[seqs[o.active][Math.min(26, Math.round(p))]] = o.active; }
    dots(ctx, Pj, { col: r => { const k = r.join(""); return headRoom[k] != null ? COL3[headRoom[k]] : null; }, hi: r => (o.startHi && r.join("") === "000" ? o.startHi : 0) });
    boxFront(ctx, Pj, 1, 1);
  }
  function bip3(ctx, l, t, T, act, Pj) {
    const col = act == null ? "#C9CDE6" : COL3[act];
    if (l < T.tWar) { KB.draw(ctx, BIPC.x, BIPC.y, BIPC.s, { pose: "diam", t, mood: "think", look: [-1, -0.3] }); return; }
    KB.draw(ctx, BIPC.x, BIPC.y, BIPC.s, { pose: "pegang", hold: "samping", dir: -1, propSize: 0.5, t, mood: "happy", look: [-1, -0.2], prop: (c, px, py, s) => brush(c, px, py, s, col, t) });
  }
  S.b7_3 = function (ctx, b, l, t) {
    const T = T3(b), R = runs3(T, b), ps = R.map(r => prog(l, r)), Pj = mkProj(3, CUBE.x, CUBE.y, CUBE.S, swayYaw(t));
    let active = null; R.forEach((r, c) => { if (l >= r[0] && l < r[1]) active = c; });
    const doneT = R[2][1], doneGlow = ramp(l, doneT, 0.6);
    stage3(ctx, t);
    // sisa b7_2: sorot ruangan 000 memudar
    const greyA = ramp(l, T.tPin - 0.1, 0.4);
    cube3Full(ctx, t, Pj, { greyA, grow: idx => ramp(l, T.tPin - 0.1 + idx * 0.022, 0.3), ps, active, doneGlow, startHi: (1 - ramp(l, 0.2, 0.6)) * 0.4 + win(l, R[0][0] - 0.3, R[0][0] + 0.5, 0.2) });
    // kilau selesai
    if (doneGlow > 0.01) { const pulse = 0.5 + 0.5 * Math.sin((l - doneT) * 3); D.glow(ctx, CUBE.x, CUBE.y, 520, "#9FB6FF", 0.12 * doneGlow * pulse); }
    bip3(ctx, l, t, T, active, Pj);
    D.post(cx => {
      // 27 × 3 = 81 pintu → semua berwarna
      const p0 = pop(l, T.tPin);
      tag(cx, "27 ruangan × 3 pintu = 81 pintu", 1335, 150, p0.a * (1 - ramp(l, doneT - 0.1, 0.3)), { sp: p0.sp, col: DOORC, size: 46 });
      const pD = pop(l, doneT + 0.1); tag(cx, "81 pintu, masing-masing 1 warna", 1335, 150, pD.a, { sp: pD.sp, col: P.green, size: 46 });
      // legenda + penghitung per warna
      [T.tM, T.tH, T.tB].forEach((tw, c) => { const p = pop(l, tw - 0.05); if (p.a <= 0.01) return; const y = 330 + c * 112, n = count(l, R[c]), done = l >= R[c][1];
        cx.save(); cx.globalAlpha *= p.a; cx.translate(1180, y); const k = lerp(0.86, 1, p.sp); cx.scale(k, k);
        const act = active === c; D.panel(cx, 0, -46, 560, 92, { fill: act ? "rgba(22,30,80,0.95)" : "rgba(14,20,58,0.86)", stroke: act ? COL3[c] : "rgba(242,246,255,0.25)", lw: act ? 4 : 2, r: 46 });
        cx.fillStyle = COL3[c]; cx.beginPath(); cx.arc(48, 0, 22, 0, TAU); cx.fill(); if (act) D.glow(cx, 48, 0, 50, COL3[c], 0.6);
        D.txt(cx, CNAME[c], 88, 18, 50, { weight: 900, color: "#FFFFFF" });
        D.txt(cx, `${n} / 27`, done ? 440 : 520, 18, 50, { align: "right", weight: 900, color: n > 0 ? COL3[c] : P.ink2 });
        cx.restore();
        if (done) checkMark(cx, 1180 + 500, y, 26, ramp(l, R[c][1], 0.2), clamp(spring(l - R[c][1], 10, 0.5)));
      });
      // label "ruangan" kecil di atas penghitung saat jalan pertama
      const pR = ramp(l, R[0][0], 0.3) * (1 - ramp(l, doneT, 0.3)); if (pR > 0.01) { cx.save(); cx.globalAlpha *= pR; D.txt(cx, "ruangan dilewati:", 1180 + 12, 262, 40, { weight: 800, color: P.ink2 }); cx.restore(); }
    });
  };

  // =====================================================================
  // b7_4: ukuran 3 (Knuth) → Filip Stappers + laptop → 5 → 16 → "semua ukuran?" belum ditemukan
  function T4(b) {
    return { tKn: D.at(b, "Knuth"), tUk3: D.at(b, "berukuran tiga,"), tDan: D.at(b, "dan temannya,"), tFil: D.at(b, "Filip"), tKom: D.at(b, "memakai komputer"),
      tMen: D.at(b, "untuk menemukan"), tSam: D.at(b, "sampai di"), t16: D.at(b, "enam belas."), t16e: D.atEnd(b, "enam belas."), tTet: D.at(b, "Tetapi"), tSol: D.at(b, "solusi"),
      tSem: D.at(b, "semua ukuran"), tBel: D.at(b, "belum ditemukan."), tEnd: D.speechEnd(b) };
  }
  const C4 = { c3: { x: 200, y: 610, B: 150 }, c5: { x: 560, y: 560, B: 230 }, c16: { x: 1030, y: 470, B: 370 }, lap: { x: 1560, y: 570, w: 340 }, q: { x: 1530, y: 520, B: 210 }, bip: { x: 1836, y: 800, s: 116 } };
  function laptop(ctx, cx, cy, w, t, o = {}) {
    const sh = w * 0.62, top = cy - sh, bw = w * 1.14;
    ctx.save();
    shadowE(ctx, cx + 10, cy + w * 0.2, bw * 0.55, 16, 0.3);
    // alas + papan ketik
    ctx.fillStyle = "#3A417F"; ctx.beginPath(); ctx.moveTo(cx - w / 2, cy); ctx.lineTo(cx + w / 2, cy); ctx.lineTo(cx + bw / 2, cy + w * 0.17); ctx.lineTo(cx - bw / 2, cy + w * 0.17); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#4C559C"; ctx.fillRect(cx - bw / 2, cy + w * 0.17, bw, 8);
    const rows = 4, cols = 12;
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
      const v0 = r / rows, v1 = (r + 0.78) / rows, hw0 = lerp(w / 2, bw / 2, v0) * 0.9, hw1 = lerp(w / 2, bw / 2, v1) * 0.9, y0 = cy + w * 0.012 + v0 * w * 0.15, y1 = cy + w * 0.012 + v1 * w * 0.15;
      const u0 = q / cols, u1 = (q + 0.82) / cols; const hot = o.typing > 0.01 && ((Math.floor(t * 11) * 7 + r * 5 + q * 3) % 17 === 0);
      ctx.fillStyle = hot ? D.hexA(P.teal, 0.9 * o.typing + 0.1) : "#262C62";
      ctx.beginPath(); ctx.moveTo(cx - hw0 + u0 * 2 * hw0, y0); ctx.lineTo(cx - hw0 + u1 * 2 * hw0, y0); ctx.lineTo(cx - hw1 + u1 * 2 * hw1, y1); ctx.lineTo(cx - hw1 + u0 * 2 * hw1, y1); ctx.closePath(); ctx.fill();
    }
    // layar
    ctx.fillStyle = "#2C3272"; RR(ctx, cx - w / 2, top, w, sh, 14); ctx.fill();
    const sx = cx - w / 2 + 14, sy = top + 14, sw = w - 28, shh = sh - 26;
    const lit = clamp(o.lit || 0); ctx.fillStyle = `rgb(${Math.round(lerp(20, 24, lit))},${Math.round(lerp(24, 36, lit))},${Math.round(lerp(60, 92, lit))})`; RR(ctx, sx, sy, sw, shh, 8); ctx.fill();
    if (lit > 0.01) { D.glow(ctx, cx, top + sh / 2, w * 0.7, "#A9D4FF", 0.25 * lit); if (o.screen) { ctx.save(); RR(ctx, sx, sy, sw, shh, 8); ctx.clip(); o.screen(ctx, sx, sy, sw, shh); ctx.restore(); } }
    ctx.restore();
    return { top, sx, sy, sw, sh: shh };
  }
  function qCube(ctx, Pj, a, t) {  // kubus garis putus-putus "n × n × n"
    if (a <= 0.01) return; const n = Pj.n, lo = -0.5, hi = n - 0.5; ctx.save(); ctx.globalAlpha *= a;
    [[0, hi], [1, lo], [2, hi]].forEach(([ax, v]) => { poly(ctx, faceQuad(Pj, ax, v)); ctx.fillStyle = "rgba(255,211,138,0.08)"; ctx.fill(); });
    ctx.strokeStyle = D.hexA(P.warm, 0.85); ctx.lineWidth = 4; ctx.setLineDash([16, 12]); ctx.lineDashOffset = -t * 20;
    for (let ax = 0; ax < 3; ax++) for (const u of [lo, hi]) for (const w of [lo, hi]) { const A = [0, 0, 0], B = [0, 0, 0]; A[ax] = lo; B[ax] = hi; A[(ax + 1) % 3] = B[(ax + 1) % 3] = u; A[(ax + 2) % 3] = B[(ax + 2) % 3] = w;
      const p = Pj(...A), q = Pj(...B); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
    ctx.setLineDash([]); ctx.restore();
  }
  function bip4(ctx, l, t, T, laps) {
    const x = C4.bip.x, y = C4.bip.y, s = C4.bip.s;
    let o;
    if (l < T.tDan) o = { pose: "diam", t, mood: "happy", look: [-1, -0.2] };
    else if (l < T.tMen) o = { pose: "tunjuk", t, target: [C4.lap.x + 90, C4.lap.y - 100], mood: "happy" };
    else if (l < T.t16) o = { pose: "tunjuk", t, target: [C4.c16.x + 160, C4.c16.y], mood: "happy" };
    else if (l < T.t16 + 1.3) o = { pose: "kaget", t, k: l - T.t16, mood: "wow", seru: false };
    else if (l < T.tTet) o = { pose: "diam", t, mood: "wow", look: [-1, 0] };
    else o = { pose: "diam", t, mood: "think", look: [-0.7, -0.9] };
    KB.draw(ctx, x, y, s, o);
  }
  S.b7_4 = function (ctx, b, l, t) {
    const T = T4(b), seqs = KUB();
    stage3(ctx, t);
    // kubus 3: besar di tengah → kecil ke kiri
    const mv = eio(ramp(l, T.tDan - 0.2, 1.1));
    const S3 = lerp(CUBE.S, C4.c3.B / 3, mv), x3 = lerp(CUBE.x, C4.c3.x, mv), y3 = lerp(CUBE.y, C4.c3.y, mv);
    const P3 = mkProj(3, x3, y3, S3, swayYaw(t));
    if (seqs["3"]) { boxBack(ctx, P3, 1, 1); seqs["3"].forEach((seq, c) => drawPath(ctx, P3, seq, c, 27, { lw: lerp(8, 4, mv) })); dots(ctx, P3, {}); boxFront(ctx, P3, 1, 1); }
    // kubus 5 (data asli)
    const a5 = ramp(l, T.tMen - 0.1, 0.5), p5 = 125 * eio(ramp(l, T.tMen + 0.1, 1.3));
    if (a5 > 0.01 && seqs["5"]) { const k5 = lerp(0.7, 1, clamp(spring(l - T.tMen + 0.1, 9, 0.6))), P5 = mkProj(5, C4.c5.x, C4.c5.y, C4.c5.B / 5 * k5, swayYaw(t) + 0.01);
      ctx.save(); ctx.globalAlpha *= a5; boxBack(ctx, P5, 1, 1); seqs["5"].forEach((seq, c) => drawPath(ctx, P5, seq, c, p5, { lw: 3.5, portals: false, head: p5 < 125 })); dots(ctx, P5, {}); boxFront(ctx, P5, 1, 1); ctx.restore(); }
    // kubus 16: titik muncul per tingkat
    const a16 = ramp(l, T.tSam - 0.1, 0.4), g16 = ramp(l, T.tSam, Math.max(0.6, T.t16e - T.tSam));
    if (a16 > 0.01) { const k16 = lerp(0.6, 1, eio(g16)), P16 = mkProj(16, C4.c16.x, C4.c16.y, C4.c16.B / 16 * k16, swayYaw(t) + 0.02);
      ctx.save(); ctx.globalAlpha *= a16; boxBack(ctx, P16, 1, 0.8); dots(ctx, P16, { rise: r => clamp(g16 * 17 - r[2]) }); boxFront(ctx, P16, 1, 1);
      if (g16 > 0.98) D.glow(ctx, C4.c16.x, C4.c16.y, 380, "#9FB6FF", 0.12 * (0.6 + 0.4 * Math.sin(t * 2.5))); ctx.restore(); }
    // laptop (masuk dari kanan, keluar saat "Tetapi")
    const lin = eio(ramp(l, T.tDan - 0.1, 0.8)), lout = eio(ramp(l, T.tTet - 0.25, 0.7)), lx = C4.lap.x + (1 - lin) * 700 + lout * 760;
    const typing = ramp(l, T.tKom, 0.3) * (1 - ramp(l, T.t16e + 0.2, 0.3));
    const nSize = l < T.tMen + 0.6 ? 3 : l < T.tSam ? 5 : Math.min(16, 5 + Math.floor(11 * clamp((l - T.tSam) / Math.max(0.5, T.t16 + 0.15 - T.tSam)) + 1e-6));
    let LT = null;
    if (lin > 0.01 && lout < 0.999) LT = laptop(ctx, lx, C4.lap.y, C4.lap.w, t, { lit: ramp(l, T.tKom - 0.1, 0.4), typing });
    // kubus tanda tanya
    const qa = ramp(l, T.tSol, 0.6), Pq = mkProj(4, C4.q.x, C4.q.y, C4.q.B / 4, swayYaw(t) + 0.15 * Math.sin(t * 0.4));
    qCube(ctx, Pq, qa, t);
    if (qa > 0.01) { ctx.save(); ctx.globalAlpha *= qa * 0.5; dots(ctx, mkProj(4, C4.q.x, C4.q.y, C4.q.B / 4, swayYaw(t) + 0.15 * Math.sin(t * 0.4)), { alpha: 0.5 }); ctx.restore(); }
    bip4(ctx, l, t, T);
    D.post(cx => {
      // ukuran 3 ✓ (Knuth)
      const p3 = pop(l, T.tUk3);
      if (p3.a > 0.01) { const big = 1 - mv; const lx3 = lerp(1430, C4.c3.x, mv), ly3 = lerp(300, 800, mv);
        const mA = 1 - clamp(Math.min(mv, 1 - mv) * 6); const w3 = tag(cx, big > 0.5 ? "Knuth: ukuran 3" : "ukuran 3", lx3, ly3, p3.a * mA, { sp: p3.sp, col: P.green, size: big > 0.5 ? 56 : 46 });
        if (w3) checkMark(cx, lx3 + w3 / 2 + (big > 0.5 ? 40 : 32), ly3, big > 0.5 ? 30 : 24, p3.a * mA, p3.sp); }
      // Filip Stappers (label di samping papan ketik, tanpa wajah)
      const pF = pop(l, T.tFil); if (pF.a > 0.01 && lout < 0.95) tag(cx, "Filip Stappers", lx - 50, 795, pF.a * (1 - lout), { sp: pF.sp, col: P.teal, size: 50 });
      // layar laptop: penghitung ukuran
      if (LT && typing + ramp(l, T.tKom, 0.3) > 0.01) { const a = ramp(l, T.tKom, 0.3) * (1 - lout);
        cx.save(); cx.globalAlpha *= a; D.txt(cx, "ukuran", LT.sx + LT.sw / 2, LT.sy + 58, 44, { align: "center", weight: 800, color: P.ink2 });
        D.txt(cx, String(nSize), LT.sx + LT.sw / 2 - 20, LT.sy + 160, 92, { align: "center", weight: 900, color: "#FFFFFF" });
        const okA = l >= T.tMen + 0.6 ? 1 : 0; if (okA) checkMark(cx, LT.sx + LT.sw / 2 + 82, LT.sy + 128, 24, 1, 1);
        cx.restore(); }
      // label kubus 5 dan 16
      const p5l = pop(l, T.tMen + 1.0); if (p5l.a > 0.01) { const w = tag(cx, "ukuran 5", C4.c5.x, 800, p5l.a, { sp: p5l.sp, col: P.green, size: 46 }); checkMark(cx, C4.c5.x + w / 2 + 32, 800, 24, p5l.a, p5l.sp); }
      const p16 = pop(l, T.t16e - 0.1); if (p16.a > 0.01) { const w = tag(cx, "ukuran 16", C4.c16.x, 800, p16.a, { sp: p16.sp, col: P.green, size: 46 }); checkMark(cx, C4.c16.x + w / 2 + 32, 800, 24, p16.a, p16.sp); }
      // tanda tanya + semua ukuran + belum ditemukan
      const pq = pop(l, T.tSem); if (pq.a > 0.01) { cx.save(); cx.globalAlpha *= pq.a; const k = lerp(0.5, 1, pq.sp); cx.translate(C4.q.x, 262 + Math.sin(t * 2.2) * 6); cx.scale(k, k);
        D.glow(cx, 0, -45, 120, P.amber, 0.5); D.txt(cx, "?", 0, 10, 150, { align: "center", weight: 900, color: P.amber }); cx.restore();
        tag(cx, "semua ukuran", C4.q.x, 745, pq.a, { sp: pq.sp, col: P.warm, size: 48 }); }
      const pb = pop(l, T.tBel); tag(cx, "belum ditemukan", C4.q.x, 850, pb.a, { sp: pb.sp, col: P.red, size: 50 });
    });
  };

  K.SCENES.d04_b7 = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); };
  K.SCENES.d04_b7.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b7 = TL => [
    K.sfxAt(TL, "b7_1", "Kembali", 0.1, "whoosh", 0.5),
    K.sfxAt(TL, "b7_1", "enam,", 0.25, "pop", 0.55),
    K.sfxAt(TL, "b7_1", "Knuth", 0.0, "pop", 0.4),
    K.sfxAt(TL, "b7_1", "mengunjungi", 0.1, "whoosh", 0.4),
    K.sfxAt(TL, "b7_1", "awal.", 0.0, "shimmer", 0.6),
    K.sfxAt(TL, "b7_2", "gedung", -0.1, "whoosh", 0.55),
    K.sfxAt(TL, "b7_2", "tujuh", 0.15, "pop", 0.6),
    K.sfxAt(TL, "b7_2", "tiga.", 0.3, "pop", 0.45),
    K.sfxAt(TL, "b7_2", "kanan,", 0.0, "clack", 0.5),
    K.sfxAt(TL, "b7_2", "atas.", 0.0, "clack", 0.5),
    K.sfxAt(TL, "b7_2", "sisi", 0.1, "whoosh", 0.6),
    K.sfxAt(TL, "b7_2", "Pac-Man.", 0.85, "whoosh", 0.4),
    K.sfxAt(TL, "b7_3", "setiap pintu", 0.0, "shimmer", 0.45),
    K.sfxAt(TL, "b7_3", "merah,", 0.1, "riser", 0.4),
    K.sfxAt(TL, "b7_3", "merah,", 3.57, "pop", 0.5),
    K.sfxAt(TL, "b7_3", "merah,", 7.04, "pop", 0.5),
    K.sfxAt(TL, "b7_3", "merah,", 10.45, "shimmer", 0.65),
    K.sfxAt(TL, "b7_4", "berukuran tiga,", 0.0, "pop", 0.5),
    K.sfxAt(TL, "b7_4", "Filip", 0.0, "clack", 0.45),
    K.sfxAt(TL, "b7_4", "untuk menemukan", 0.1, "pop", 0.45),
    K.sfxAt(TL, "b7_4", "sampai di", 0.0, "riser", 0.45),
    K.sfxAt(TL, "b7_4", "enam belas.", 0.4, "pop", 0.6),
    K.sfxAt(TL, "b7_4", "semua ukuran", 0.0, "whoosh", 0.45),
    K.sfxAt(TL, "b7_4", "belum ditemukan.", 0.0, "boom", 0.45),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
