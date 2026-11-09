/* D04 bab 6 — "Kebiasaan seorang penulis" (b6_1, b6_2).
   Dunia meja kerja malam yang sama dengan bab 0, 1, 5 (dinding biru bergaris, jendela malam, lampu meja berlengan, meja kayu,
   rak berisi jilid 1, 2, 3, 4A, 4B dan tempat kosong bergaris putus-putus 4C, 4D, 5, 6, 7). Knuth tidak digambar.
   b6_1 A: monitor tua: surel terus berdatangan, Bip menekan tombol daya saat "berhenti" → kotak masuk membeku di angka 0,
           "sejak 1990" muncul angka demi angka; surat kertas berjatuhan ke tumpukan di sebelahnya.
        B: buku terbuka di meja; Bip memeriksa dengan kaca pembesar, kesalahan ketik dilingkari merah; panel hadiah:
           "2,56 dolar" disusun angka demi angka, "= 1 dolar heksadesimal", lalu penjelasan 256 sen = 100 (heksadesimal).
        C: kamera naik ke dinding: cek generik "$2.56" meluncur, dua cek lain muncul (banyak penerima), ketiganya dibingkai.
        D: sertifikat generik "0x$1.00" dari "Bank Negeri Khayalan" (desain sendiri), masuk ke amplop, amplop disegel dan terbang.
   b6_2 rak: Bip menarik jilid 1, terlalu berat ("terkenal sulit"); kamera mundur, jilid 1 menjadi sampul besar bergaya;
        potongan kolom koran generik (tanpa foto, tanpa nama koran, tanpa tanggal) dengan nama penulis diketik; kalimat
        disorot kata demi kata mengikuti narasi; kalimat pertama terlepas dan menempel di sampul; kalimat kedua disorot,
        lembar "Riwayat hidup" muncul lalu terbang ke kolom.
   Kamera sendiri (noCam). Teks benda di dunia memudar bila keluar dari zona aman; label lewat D.post. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const KL = KIT.latar, KB = KIT.bipkit, P = D.P, LP = KL.parts;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const SERIF = `"Liberation Serif", "DejaVu Serif", "FreeSerif", serif`;
  const S = {};
  let WTA = 1, MASK = null;   // MASK: kotak layar [x0,y0,x1,y1] panel buram; tulisan benda di baliknya tidak digambar
  let _wta = 1;   // pengali alfa teks benda di dunia (b6_2: latar meredup → tulisan benda ikut memudar)

  // ---------- pembantu ----------
  const ramp = (l, t0, d = 0.5) => clamp((l - t0) / d);
  const win = (l, a, b, d = 0.3) => ramp(l, a, d) * (1 - ramp(l, b, d));
  const camT = (ctx, c) => { ctx.translate(W / 2, HH / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y); };
  const toS = (c, x, y) => [(x - c.x) * c.z + W / 2, (y - c.y) * c.z + HH / 2];
  const drift = (c, t) => ({ x: c.x + Math.sin(t * 0.29) * 5 / c.z, y: c.y + Math.sin(t * 0.21 + 1) * 4 / c.z, z: c.z * (1 + 0.003 * Math.sin(t * 0.17)) });
  const qb = (a, b, c, u) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * b + u * u * c;
  function grade(ctx, a, col = "#3B4690") { if (a <= 0.01) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, HH); ctx.restore(); }
  function addLight(ctx, x, y, r, col, a) {
    if (a <= 0.01 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = "screen";
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, D.hexA(col, a)); gr.addColorStop(0.4, D.hexA(col, a * 0.42)); gr.addColorStop(1, D.hexA(col, 0));
    ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  }
  function safeA(ctx, x, y, w, size) {
    const m = ctx.getTransform(), X0 = m.a * x + m.e, X1 = m.a * (x + w) + m.e, Y = m.d * y + m.f, Yt = m.d * (y - size * 0.8) + m.f;
    if (MASK && X1 > MASK[0] && X0 < MASK[2] && Y > MASK[1] && Yt < MASK[3]) return 0;
    return clamp((Yt - 66) / 30) * clamp((925 - Y) / 30) * clamp((X0 - 100) / 40) * clamp((1820 - X1) / 40);
  }
  // teks dengan jenis huruf bebas; opt.safe = pudar di tepi zona aman (teks benda di dunia)
  function ftxt(ctx, s, x, y, font, color, opt = {}) {
    ctx.save(); ctx.font = font; const w = ctx.measureText(s).width; const al = opt.align || "left";
    const x0 = al === "center" ? x - w / 2 : al === "right" ? x - w : x;
    let a = 1; if (opt.safe) { const sz = parseFloat((font.match(/([\d.]+)px/) || [0, 40])[1]); a = safeA(ctx, x0, y, w, sz) * WTA; }
    if (a > 0.01) { ctx.globalAlpha *= a; ctx.fillStyle = color; ctx.textAlign = al; ctx.textBaseline = "alphabetic"; ctx.fillText(s, x, y); }
    ctx.restore(); return w;
  }
  const fw = (ctx, s, font) => { ctx.save(); ctx.font = font; const w = ctx.measureText(s).width; ctx.restore(); return w; };
  function tag(ctx, s, x, y, a, opt = {}) {
    if (a <= 0.01) return; const sp = opt.sp == null ? 1 : opt.sp; ctx.save(); ctx.globalAlpha *= clamp(a);
    ctx.translate(x, y); const k = lerp(0.9, 1, sp); ctx.scale(k, k); const w = D.label(ctx, s, 0, 0, { size: opt.size || 48, col: opt.col || P.amber, color: opt.color });
    ctx.restore(); return w;
  }
  const pop = (l, t0) => ({ a: ramp(l, t0, 0.25), sp: clamp(spring(l - t0, 10, 0.55)) });
  const popK = (l, t0) => (l <= t0 ? 0 : lerp(0.6, 1, Math.min(1.08, spring(l - t0, 11, 0.5))));
  function shadowE(ctx, x, y, rx, ry, a = 0.3) { ctx.save(); ctx.fillStyle = `rgba(30,12,8,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  function sparkle(ctx, x, y, r, a, col = "#FFF3C4") {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath();
    for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * 0.28 : r, an = i * Math.PI / 4 - Math.PI / 2; ctx.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); }
    ctx.closePath(); ctx.fill(); D.glow(ctx, x, y, r * 1.6, col, 0.5); ctx.restore();
  }

  // ---------- dunia meja (rupa sama dengan bab 0/5) ----------
  const DESK_Y = 600, DESK_F = 930;
  const WIN = { x: 70, y: 66, w: 220, h: 190 };
  const LAMP = { bx: 165, by: 664, jx: 112, jy: 476, hx: 222, hy: 356 };
  const SHELF = { x0: 990, x1: 1900, y: 215, slot: 70, bx: 1180, bw: 58, bh: 150 };
  const VOLS = ["1", "2", "3", "4A", "4B", "4C", "4D", "5", "6", "7"];
  const BOOKC = ["#E8665F", "#36B3A3", "#6A7BE0", "#E9A23B", "#9A6FD6"];
  const MON = { x: 1450, sx: 1290, sy: 330, sw: 320, sh: 232 };
  const PWR = { x: MON.sx + MON.sw - 6, y: MON.sy + MON.sh + 32 };
  const TRAY = { x: 1150, y: 708 };
  const BOOK = { x: 715, top: 600, bot: 890, hw: 345 };
  const TYPO = { x: 958, y: 742 };
  const CHQ = { x: 600, y: 250, w: 520, h: 236 };
  const CHQS = [{ x: 380, y: 502, w: 216, h: 100 }, { x: 620, y: 502, w: 216, h: 100 }];
  const CERT = { x: 2060, y: 390, w: 480, h: 280 };
  const ENV = { x: 1850, y: 690, w: 400, h: 160 };

  function wall(ctx, t, bot = DESK_Y) {
    const gr = ctx.createLinearGradient(0, 0, 0, bot); gr.addColorStop(0, "#2A3A7C"); gr.addColorStop(1, "#3D509A");
    ctx.fillStyle = gr; ctx.fillRect(-600, -400, 3200, bot + 400);
    ctx.fillStyle = "rgba(255,255,255,0.035)"; for (let x = -576; x < 2600; x += 64) ctx.fillRect(x, -400, 3, bot + 400);
    ctx.fillStyle = "rgba(255,255,255,0.05)"; for (let x = -544; x < 2600; x += 64) for (let y = -360; y < bot - 20; y += 64) { ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); }
    LP.windowFrame(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, "#8A6E9E", () => LP.nightView(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, 0));
    addLight(ctx, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, 260, "#9DB8FF", 0.14);
  }
  function desk(ctx, top = DESK_Y, front = DESK_F) {
    const gr = ctx.createLinearGradient(0, top, 0, front); gr.addColorStop(0, "#6E4834"); gr.addColorStop(1, "#9A6848");
    ctx.fillStyle = gr; ctx.fillRect(-600, top, 3200, front - top);
    ctx.strokeStyle = "rgba(60,30,20,0.18)"; ctx.lineWidth = 3;
    for (let i = 0; i < 9; i++) { const y = top + 26 + i * 40; if (y > front - 6) break; ctx.beginPath(); ctx.moveTo(-600, y); for (let x = -600; x <= 2600; x += 120) ctx.lineTo(x, y + Math.sin(x * 0.004 + i * 1.7) * 6); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,220,180,0.18)"; ctx.fillRect(-600, top, 3200, 4);
    ctx.fillStyle = "#B57D57"; ctx.fillRect(-600, front, 3200, 10);
    const g2 = ctx.createLinearGradient(0, front + 10, 0, 1300); g2.addColorStop(0, "#5A3726"); g2.addColorStop(1, "#3A2218");
    ctx.fillStyle = g2; ctx.fillRect(-600, front + 10, 3200, 500);
  }
  function lamp(ctx, t) {
    const { bx, by, jx, jy, hx, hy } = LAMP;
    ctx.save();
    ctx.fillStyle = "rgba(20,10,10,0.35)"; ctx.beginPath(); ctx.ellipse(bx + 8, by + 8, 74, 16, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2C3570"; ctx.beginPath(); ctx.ellipse(bx, by, 66, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#3C478E"; ctx.beginPath(); ctx.ellipse(bx, by - 8, 60, 14, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#46529E"; ctx.lineCap = "round"; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(bx, by - 12); ctx.lineTo(jx, jy); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx - 4, by - 14); ctx.lineTo(jx - 4, jy); ctx.lineTo(hx - 2, hy - 5); ctx.stroke();
    ctx.fillStyle = "#FFB547"; [[bx, by - 12], [jx, jy], [hx, hy]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.fill(); });
    ctx.translate(hx, hy); ctx.rotate(-0.42);
    const sg = ctx.createLinearGradient(-60, 0, 60, 0); sg.addColorStop(0, "#38428A"); sg.addColorStop(0.5, "#5562B4"); sg.addColorStop(1, "#38428A");
    ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(-34, -14); ctx.lineTo(34, -14); ctx.lineTo(70, 92); ctx.lineTo(-70, 92); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2E3778"; ctx.beginPath(); ctx.ellipse(0, -14, 34, 9, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgb(255,236,190)"; ctx.beginPath(); ctx.ellipse(0, 92, 70, 15, 0, 0, TAU); ctx.fill();
    ctx.restore();
    addLight(ctx, hx + 40, hy + 90, 110, "#FFF2C8", 0.85); addLight(ctx, hx + 70, hy + 140, 280, "#FFC66E", 0.4);
  }
  function lights(ctx) {
    LP.warmPool(ctx, 760, 720, 760, 0.5, 0.5);
    LP.warmPool(ctx, LAMP.hx + 40, LAMP.hy + 30, 420, 0.34, 1);
  }
  function spine(ctx, x, bottom, w, h, col, label, t) {
    const top = bottom - h;
    ctx.fillStyle = "rgba(10,10,30,0.3)"; ctx.fillRect(x + 6, top + 6, w, h);
    const gr = ctx.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, col); gr.addColorStop(0.55, col); gr.addColorStop(1, "rgba(20,20,40,0.35)");
    ctx.fillStyle = col; RR(ctx, x, top, w, h, 6); ctx.fill(); ctx.fillStyle = gr; RR(ctx, x, top, w, h, 6); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.fillRect(x + 8, top + 16, w - 16, 5); ctx.fillRect(x + 8, top + h - 22, w - 16, 5);
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillRect(x + 8, top + 28, w - 16, 3);
    if (label) {
      const cy = top + h * 0.5, sa = safeA(ctx, x + w / 2 - 22, cy + 15, 44, 44) * WTA; ctx.fillStyle = `rgba(16,20,56,${0.82 * sa})`; ctx.beginPath(); ctx.arc(x + w / 2, cy, Math.min(30, w / 2 - 1), 0, TAU); ctx.fill();
      ftxt(ctx, label, x + w / 2, cy + 15, `900 ${label.length > 1 ? 40 : 44}px ${FONT}`, "#FFFFFF", { align: "center", safe: true });
    }
  }
  function ghostSlot(ctx, x, bottom, w, h, t, a, label, col = P.warm, i = 0) {
    if (a <= 0.01) return; const top = bottom - h, pulse = 0.6 + 0.4 * Math.sin(t * 2.2 + i);
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = D.hexA(col, 0.1 + 0.08 * pulse); RR(ctx, x, top, w, h, 8); ctx.fill();
    ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 14; ctx.strokeStyle = D.hexA(col, 0.75 + 0.25 * pulse); ctx.lineWidth = 4; RR(ctx, x + 2, top + 2, w - 4, h - 4, 8); ctx.stroke(); ctx.setLineDash([]);
    addLight(ctx, x + w / 2, top + h / 2, 90, col, 0.16 * pulse);
    if (label) ftxt(ctx, label, x + w / 2, top + h * 0.5 + 15, `900 ${label.length > 1 ? 40 : 44}px ${FONT}`, col, { align: "center", safe: true });
    ctx.restore();
  }
  function shelfBoard(ctx, x0, x1, y, brackets) {
    ctx.fillStyle = "#6B4632"; brackets.forEach(x => { ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x + 18, y + 20); ctx.lineTo(x + 18, y + 90); ctx.closePath(); ctx.fill(); });
    ctx.fillStyle = "#8A5A3C"; RR(ctx, x0, y, x1 - x0, 24, 5); ctx.fill();
    ctx.fillStyle = "#A8714C"; ctx.fillRect(x0 + 4, y, x1 - x0 - 8, 5);
    ctx.fillStyle = "rgba(10,10,30,0.25)"; ctx.fillRect(x0 + 6, y + 24, x1 - x0 - 12, 8);
  }
  function shelf(ctx, t, o = {}) {
    const { x0, x1, y, slot, bx, bw, bh } = SHELF;
    for (let i = 0; i < 10; i++) {
      const x = bx + i * slot;
      if (i < 5) { if (i === 0 && o.out1) { ghostSlot(ctx, x, y, bw, bh, t, 0.55 * o.out1, null, P.warm, 0); continue; } spine(ctx, x, y, bw, bh, BOOKC[i], VOLS[i], t); }
      else ghostSlot(ctx, x, y, bw, bh, t, 0.8, VOLS[i], P.warm, i);
    }
    shelfBoard(ctx, x0, x1, y, [x0 + 60, x1 - 120]);
  }
  function dust(ctx, t, a, cx = 760, cy = 560) {
    ctx.save(); const r = D.rng(61);
    for (let i = 0; i < 24; i++) { const x0 = cx - 420 + r() * 840, y0 = cy - 260 + r() * 480, sp = 6 + r() * 10, ph = r() * 6.28;
      const x = x0 + Math.sin(t * 0.3 + ph) * 26, y = y0 - ((t * sp + ph * 30) % 120) + 60, al = a * (0.18 + 0.25 * Math.sin(t * 1.3 + ph) ** 2);
      ctx.fillStyle = `rgba(255,236,190,${al})`; ctx.beginPath(); ctx.arc(x, y, 2 + r() * 2, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  // ---------- monitor surel tua ----------
  function envIcon(ctx, x, y, w, col = "#FFFFFF", dot = true) {
    const h = w * 0.66; ctx.fillStyle = col; RR(ctx, x - w / 2, y - h / 2, w, h, w * 0.08); ctx.fill();
    ctx.strokeStyle = "rgba(60,80,140,0.75)"; ctx.lineWidth = Math.max(2, w * 0.06); ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(x - w / 2 + 3, y - h / 2 + 4); ctx.lineTo(x, y + h * 0.08); ctx.lineTo(x + w / 2 - 3, y - h / 2 + 4); ctx.stroke();
    if (dot) { ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(x + w / 2, y - h / 2, w * 0.17, 0, TAU); ctx.fill(); }
  }
  function frostCrystals(ctx, x, y, w, h, u, t) {
    if (u <= 0.01) return; const r = D.rng(913);
    ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${0.75 * u})`; ctx.lineCap = "round";
    // sudut bawah (seperempat lingkaran) + tengah sisi kiri/kanan (kipas pendek); sudut atas dibiarkan bersih
    const corners = [[x, y + h, 1, -1, 0, Math.PI / 2, 1], [x + w, y + h, -1, -1, 0, Math.PI / 2, 1], [x, y + h * 0.62, 1, 1, -Math.PI / 4, Math.PI / 4, 0.6], [x + w, y + h * 0.62, -1, 1, -Math.PI / 4, Math.PI / 4, 0.6]];
    corners.forEach(([cx, cy, sx, sy, a0, a1, lk], ci) => {
      for (let k = 0; k < 6; k++) {
        const an = a0 + (k / 5) * (a1 - a0), L = (60 + r() * 70) * lk * eout(u), dx = Math.cos(an) * sx, dy = Math.sin(an) * sy;
        ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + dx * L, cy + dy * L); ctx.stroke();
        for (let j = 1; j <= 3; j++) { const p = j / 4, bx = cx + dx * L * p, by = cy + dy * L * p, bl = L * 0.28 * (1 - p * 0.5);
          ctx.lineWidth = 2; [0.6, -0.6].forEach(da => { const c = Math.cos(an + da), s = Math.sin(an + da); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + c * sx * bl, by + s * sy * bl); ctx.stroke(); }); }
      }
    });
    const gr = ctx.createRadialGradient(x + w / 2, y + h * 0.6, h * 0.3, x + w / 2, y + h * 0.6, w * 0.7);
    gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(1, `rgba(235,248,255,${0.55 * u})`); ctx.fillStyle = gr; ctx.fillRect(x, y, w, h);
    ctx.restore();
  }
  function snowflake(ctx, x, y, r, a, rot) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.lineCap = "round";
    for (let i = 0; i < 6; i++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r); ctx.moveTo(0, -r * 0.55); ctx.lineTo(-r * 0.25, -r * 0.8); ctx.moveTo(0, -r * 0.55); ctx.lineTo(r * 0.25, -r * 0.8); ctx.stroke(); }
    ctx.restore();
  }
  function monitor(ctx, t, l, st) {
    const { x, sx, sy, sw, sh } = MON;
    shadowE(ctx, x + 14, 664, 210, 20, 0.3);
    ctx.fillStyle = "#A99F88"; RR(ctx, x - 120, 638, 240, 28, 12); ctx.fill();
    ctx.fillStyle = "#C9BEA6"; RR(ctx, x - 120, 632, 240, 18, 10); ctx.fill();
    ctx.fillStyle = "#B3A88F"; ctx.fillRect(x - 42, 598, 84, 40);
    ctx.fillStyle = "#9E9480"; RR(ctx, sx - 32, sy - 34, sw + 80, sh + 104, 26); ctx.fill();
    const gb = ctx.createLinearGradient(0, sy - 40, 0, sy + sh + 60); gb.addColorStop(0, "#EAE1CC"); gb.addColorStop(1, "#CFC4AA");
    ctx.fillStyle = gb; RR(ctx, sx - 38, sy - 40, sw + 76, sh + 100, 24); ctx.fill();
    ctx.fillStyle = "#2E3352"; RR(ctx, sx - 10, sy - 10, sw + 20, sh + 20, 16); ctx.fill();
    ctx.fillStyle = "rgba(90,80,60,0.35)"; for (let i = 0; i < 5; i++) { RR(ctx, sx + 6 + i * 24, sy + sh + 26, 15, 7, 3); ctx.fill(); }
    // tombol daya + lampu kecil
    const pr = st.press || 0;
    ctx.fillStyle = "#8F8670"; ctx.beginPath(); ctx.arc(PWR.x, PWR.y, 15, 0, TAU); ctx.fill();
    ctx.fillStyle = pr > 0.5 ? "#C9BEA6" : "#DCD2BC"; ctx.beginPath(); ctx.arc(PWR.x, PWR.y + pr * 2, 11, 0, TAU); ctx.fill();
    const led = st.off > 0.5 ? "#7FB8FF" : "#5BD68A"; ctx.fillStyle = led; ctx.beginPath(); ctx.arc(PWR.x - 36, PWR.y, 6, 0, TAU); ctx.fill(); D.glow(ctx, PWR.x - 36, PWR.y, 18, led, 0.6);
    // layar
    ctx.save(); RR(ctx, sx, sy, sw, sh, 12); ctx.clip();
    if (st.off < 1) {
      ctx.fillStyle = "#EEF2FF"; ctx.fillRect(sx, sy, sw, sh);
      // baris surel menggulir turun (surel baru terus masuk)
      const rowH = 48, scroll = st.scroll;
      for (let i = -1; i < 5; i++) {
        const y = sy + 56 + i * rowH + (scroll % rowH);
        ctx.fillStyle = i % 2 ? "#F7F9FF" : "#E6ECFF"; ctx.fillRect(sx, y, sw, rowH - 2);
        envIcon(ctx, sx + 34, y + rowH / 2, 34, "#FFFFFF", false);
        ctx.fillStyle = "#3D4C86"; RR(ctx, sx + 66, y + 13, 110 + ((i * 37 + Math.floor(scroll / rowH) * 13) % 90 + 90) % 90, 10, 5); ctx.fill();
        ctx.fillStyle = "#9AA6CF"; RR(ctx, sx + 66, y + 29, 170, 8, 4); ctx.fill();
        ctx.fillStyle = "#4D7BFF"; ctx.beginPath(); ctx.arc(sx + sw - 22, y + rowH / 2, 7, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = "#3E63C9"; ctx.fillRect(sx, sy, sw, 52);
      ftxt(ctx, "Kotak masuk", sx + 18, sy + 39, `800 40px ${FONT}`, "#FFFFFF", { safe: true });
    }
    if (st.off > 0) {
      ctx.save(); ctx.globalAlpha *= st.off;
      const gr = ctx.createLinearGradient(0, sy, 0, sy + sh); gr.addColorStop(0, "#CFEAFF"); gr.addColorStop(1, "#EEF8FF"); ctx.fillStyle = gr; ctx.fillRect(sx, sy, sw, sh);
      ctx.restore();
      // bunga es di bawah tulisan: sudut bawah + sisi; kepala layar berpita biru tua padat di atasnya
      frostCrystals(ctx, sx, sy, sw, sh, st.frost || 0, t);
      ctx.save(); ctx.globalAlpha *= st.off;
      ctx.fillStyle = "#1F3A78"; ctx.fillRect(sx, sy, sw, 52);
      ftxt(ctx, "Kotak masuk", sx + 18, sy + 39, `800 40px ${FONT}`, "#FFFFFF", { safe: true });
      // angka 0 membeku
      const k = st.zeroK || 0;
      if (k > 0) { ctx.save(); ctx.translate(sx + sw / 2, sy + 150); ctx.scale(k, k); ftxt(ctx, "0", 0, 0, `900 116px ${FONT}`, "#1F3A78", { align: "center", safe: true }); ctx.restore(); }
      // "sejak _ _ _ _": empat kotak angka terisi satu per satu saat tahunnya diucapkan
      if (st.yearOn) {
        const f = `800 44px ${FONT}`, ws = fw(ctx, "sejak ", f), dw = fw(ctx, "0", f) + 8, tot = ws + 4 * dw, x0 = sx + sw / 2 - tot / 2, yb = sy + 212;
        ctx.save(); ctx.globalAlpha *= safeA(ctx, x0, yb, tot, 44) * WTA;
        ftxt(ctx, "sejak", x0, yb, f, "#2D4A8C");
        for (let i = 0; i < 4; i++) {
          const cx0 = x0 + ws + i * dw + dw / 2, kk = (st.yk || [1, 1, 1, 1])[i];
          if (kk > 0) { ctx.save(); ctx.translate(cx0, yb); ctx.scale(kk, kk); ftxt(ctx, "1990"[i], 0, 0, f, "#2D4A8C", { align: "center" }); ctx.restore(); }
          else { ctx.fillStyle = "rgba(45,74,140,0.6)"; RR(ctx, cx0 - dw / 2 + 4, yb + 2, dw - 8, 5, 2); ctx.fill(); }
        }
        ctx.restore();
      }
      ctx.restore();
    }
    // lencana di sudut monitor: merah berdenyut (surel masuk) → kepingan salju (membeku)
    ctx.restore(); ctx.save();
    { const bx = sx + sw + 18, by = sy - 16, pu = 0.5 + 0.5 * Math.sin(l * 9), on = 1 - (st.off || 0);
      if (on > 0.01) { ctx.save(); ctx.globalAlpha *= on; ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(bx, by, 20 + 3 * pu, 0, TAU); ctx.fill();
        ctx.strokeStyle = `rgba(255,90,95,${0.7 * (1 - (l * 2 % 1))})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(bx, by, 22 + 30 * (l * 2 % 1), 0, TAU); ctx.stroke(); ctx.restore(); }
      if (st.off > 0.01) { ctx.save(); ctx.globalAlpha *= st.off; ctx.fillStyle = "#7FB8FF"; ctx.beginPath(); ctx.arc(bx, by, 26, 0, TAU); ctx.fill(); snowflake(ctx, bx, by, 17, 1, l * 0.3); ctx.restore(); } }
    ctx.restore(); ctx.save(); RR(ctx, sx, sy, sw, sh, 12); ctx.clip();
    // kilat saat dimatikan
    if (st.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${st.flash})`; ctx.fillRect(sx, sy, sw, sh); }
    ctx.restore();
    // pantulan kaca
    ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo(sx + 20, sy); ctx.lineTo(sx + 120, sy); ctx.lineTo(sx + 40, sy + sh); ctx.lineTo(sx - 20, sy + sh); ctx.closePath(); ctx.fill(); ctx.restore();
    if (st.off > 0.3) addLight(ctx, sx + sw / 2, sy + sh / 2, 260, "#BFE6FF", 0.18 * st.off);
    else addLight(ctx, sx + sw / 2, sy + sh / 2, 260, "#A9C4FF", 0.2);
  }
  // surel kecil yang terbang masuk ke monitor sebelum dimatikan
  function inflow(ctx, l, stopAt) {
    if (l > stopAt) return;
    for (let i = 0; i < 9; i++) {
      const ts = 0.1 + i * 0.24; if (ts > stopAt - 0.35) break; const u = (l - ts) / 0.62; if (u <= 0 || u >= 1) continue;
      const e = eio(u), x0 = 1960, y0 = 90 + (i % 3) * 70, x1 = MON.x, y1 = MON.sy + 120;
      const x = qb(x0, 1700, x1, e), y = qb(y0, 40 + (i % 2) * 40, y1, e);
      ctx.save(); ctx.globalAlpha = Math.min(1, (1 - u) * 4); ctx.translate(x, y); ctx.rotate((1 - e) * 0.4 * (i % 2 ? 1 : -1)); envIcon(ctx, 0, 0, lerp(70, 36, e)); ctx.restore();
    }
  }

  // ---------- tumpukan surat kertas ----------
  function letter(ctx, x, y, w, h, i) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(40,20,10,0.25)"; RR(ctx, -w / 2 + 4, -h / 2 + 5, w, h, 6); ctx.fill();
    ctx.fillStyle = i % 3 === 1 ? "#F2E6CF" : "#FAF2E2"; RR(ctx, -w / 2, -h / 2, w, h, 6); ctx.fill();
    if (i % 3 === 2) { ctx.save(); RR(ctx, -w / 2, -h / 2, w, h, 6); ctx.clip(); ctx.lineWidth = 7;
      for (let k = -12; k < 16; k++) { ctx.strokeStyle = k % 2 ? "#E25B5B" : "#4F7BD8"; ctx.beginPath(); ctx.moveTo(-w / 2 + k * 18, -h / 2); ctx.lineTo(-w / 2 + k * 18 + 10, -h / 2 + 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-w / 2 + k * 18, h / 2); ctx.lineTo(-w / 2 + k * 18 + 10, h / 2 - 8); ctx.stroke(); }
      ctx.restore(); }
    ctx.strokeStyle = "rgba(140,110,70,0.45)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-w / 2 + 6, -h / 2 + 6); ctx.lineTo(0, h * 0.06); ctx.lineTo(w / 2 - 6, -h / 2 + 6); ctx.stroke();
    const sc = ["#E8665F", "#36B3A3", "#6A7BE0", "#E9A23B"][i % 4];
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(w / 2 - 44, -h / 2 + 12, 32, 38); ctx.fillStyle = sc; ctx.fillRect(w / 2 - 40, -h / 2 + 16, 24, 30);
    ctx.fillStyle = "rgba(80,70,90,0.55)"; [0, 1, 2].forEach(k => { RR(ctx, -w / 2 + 40, 8 + k * 14, 86 - k * 16, 6, 3); ctx.fill(); });
    ctx.restore();
  }
  const LET_N = 9;
  function letters(ctx, l, t0) {
    const { x, y } = TRAY, w = 186, h = 112;
    // baki kayu
    shadowE(ctx, x + 8, y + 10, 128, 16, 0.3);
    ctx.fillStyle = "#5E3B2A"; RR(ctx, x - 118, y - 18, 236, 30, 8); ctx.fill();
    let n = 0, fall = null;
    for (let i = 0; i < LET_N; i++) { const ts = t0 + i * 0.4; if (l >= ts + 0.36) n = i + 1; else if (l >= ts) { fall = { i, u: (l - ts) / 0.36 }; break; } }
    const spot = i => [x + Math.sin(i * 2.3) * 12, y - 70 - i * 15, Math.sin(i * 1.7) * 0.06];
    for (let i = 0; i < n; i++) { const [lx, ly, r] = spot(i); ctx.save(); ctx.translate(lx, ly); ctx.rotate(r); letter(ctx, 0, 0, w, h, i); ctx.restore(); }
    if (fall) { const [lx, ly, r] = spot(fall.i), u = fall.u * fall.u, yy = lerp(ly - 640, ly, u); ctx.save(); ctx.translate(lx + (1 - u) * 40, yy); ctx.rotate(r + (1 - u) * 0.5); letter(ctx, 0, 0, w, h, fall.i); ctx.restore(); }
    ctx.fillStyle = "#7A4E36"; RR(ctx, x - 122, y - 4, 244, 22, 8); ctx.fill(); ctx.fillStyle = "rgba(255,220,180,0.25)"; ctx.fillRect(x - 116, y - 3, 232, 3);
    return { n, top: y - 70 - Math.max(0, n - 1) * 15 - h / 2 };
  }

  // ---------- buku terbuka di meja ----------
  const TYPO_FONT = `italic 400 36px ${SERIF}`;
  function book(ctx, t, o = {}) {
    const cx = BOOK.x, top = BOOK.top, bot = BOOK.bot, hw = BOOK.hw;
    shadowE(ctx, cx + 10, bot + 12, hw + 40, 26, 0.35);
    ctx.fillStyle = "#B8433E"; ctx.beginPath(); ctx.moveTo(cx - hw - 14, top + 22); ctx.lineTo(cx + hw + 14, top + 22); ctx.lineTo(cx + hw + 22, bot + 12); ctx.lineTo(cx - hw - 22, bot + 12); ctx.closePath(); ctx.fill();
    // tepi halaman bertumpuk
    for (let k = 3; k >= 0; k--) { ctx.fillStyle = k % 2 ? "#E9DFC8" : "#F3EAD6"; ctx.beginPath(); ctx.moveTo(cx - hw - k * 2, top + 14 + k * 3); ctx.lineTo(cx + hw + k * 2, top + 14 + k * 3); ctx.lineTo(cx + hw + 6 + k * 2, bot + k * 3); ctx.lineTo(cx - hw - 6 - k * 2, bot + k * 3); ctx.closePath(); ctx.fill(); }
    // dua halaman (sedikit melengkung ke lipatan)
    const page = (s) => { ctx.beginPath(); ctx.moveTo(cx, top + 8); ctx.quadraticCurveTo(cx + s * hw * 0.5, top - 10, cx + s * hw, top + 6); ctx.lineTo(cx + s * (hw + 6), bot - 4); ctx.quadraticCurveTo(cx + s * hw * 0.5, bot - 16, cx, bot); ctx.closePath(); };
    [-1, 1].forEach(s => { const gr = ctx.createLinearGradient(cx, 0, cx + s * hw, 0); gr.addColorStop(0, "#D9CDB2"); gr.addColorStop(0.12, "#FBF5E6"); gr.addColorStop(1, "#FFF9EC"); ctx.fillStyle = gr; page(s); ctx.fill(); });
    ctx.strokeStyle = "rgba(120,90,60,0.4)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, top + 8); ctx.lineTo(cx, bot); ctx.stroke();
    // halaman kiri: judul bagian + diagram alir kecil + baris teks
    ctx.fillStyle = "rgba(60,50,80,0.75)"; RR(ctx, cx - hw + 40, top + 34, 160, 12, 6); ctx.fill();
    const bx = cx - hw + 60, by = top + 72;
    ctx.strokeStyle = "#5A6AB8"; ctx.lineWidth = 3;
    [[0, 0], [0, 70], [140, 70]].forEach(([dx, dy], k) => { ctx.fillStyle = ["#E7ECFF", "#FFF0D6", "#E2F6EE"][k]; RR(ctx, bx + dx, by + dy, 96, 44, 8); ctx.fill(); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(bx + 48, by + 44); ctx.lineTo(bx + 48, by + 70); ctx.moveTo(bx + 96, by + 92); ctx.lineTo(bx + 140, by + 92); ctx.stroke();
    ctx.fillStyle = "#5A6AB8"; [[bx + 48, by + 70, 0], [bx + 140, by + 92, -Math.PI / 2]].forEach(([ax, ay, r]) => { ctx.save(); ctx.translate(ax, ay); ctx.rotate(r); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-7, -11); ctx.lineTo(7, -11); ctx.closePath(); ctx.fill(); ctx.restore(); });
    ctx.fillStyle = "rgba(70,60,80,0.4)"; for (let k = 0; k < 5; k++) { RR(ctx, cx - hw + 40, top + 200 + k * 30, 260 - (k === 4 ? 120 : (k * 23) % 50), 9, 4); ctx.fill(); }
    // halaman kanan: baris teks; satu baris memuat kata yang salah ketik
    for (let k = 0; k < 8; k++) { const y = top + 40 + k * 32; if (Math.abs(y - (TYPO.y - 10)) < 20) continue; ctx.fillStyle = "rgba(70,60,80,0.4)"; RR(ctx, cx + 40, y, 270 - (k === 7 ? 130 : (k * 31) % 60), 9, 4); ctx.fill(); }
    ctx.save(); ctx.font = TYPO_FONT; const ww = ctx.measureText("algorimta").width, pre = ctx.measureText("algori").width, mt = ctx.measureText("mt").width; ctx.restore();
    const wx = TYPO.x - ww / 2;
    ctx.fillStyle = "rgba(70,60,80,0.4)"; RR(ctx, cx + 40, TYPO.y - 14, wx - (cx + 40) - 14, 9, 4); ctx.fill(); RR(ctx, wx + ww + 14, TYPO.y - 14, cx + hw - 30 - (wx + ww + 14), 9, 4); ctx.fill();
    if (o.err > 0) { ctx.fillStyle = `rgba(255,90,95,${0.6 * o.err})`; RR(ctx, wx + pre - 2, TYPO.y - 30, mt + 4, 38, 6); ctx.fill(); }
    if (!o.hideWord) ftxt(ctx, "algorimta", TYPO.x, TYPO.y, TYPO_FONT, "#2B2440", { align: "center", safe: !o.noSafe });
    if (o.circle > 0) { ctx.save(); ctx.strokeStyle = P.red; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(TYPO.x, TYPO.y - 12, ww / 2 + 26, 34, -0.05, -2.2, -2.2 + TAU * 1.05 * eio(o.circle)); ctx.stroke(); ctx.restore(); }
    return { ww };
  }

  // ---------- cek, bingkai, sertifikat, amplop ----------
  function cheque(ctx, x, y, w, h, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); const sc = o.sc == null ? 1 : o.sc; ctx.scale(sc, sc); ctx.globalAlpha *= o.a == null ? 1 : o.a;
    if (!o.framed) { ctx.fillStyle = "rgba(10,10,30,0.3)"; ctx.fillRect(-w / 2 + 8, -h / 2 + 10, w, h); }
    const gr = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gr.addColorStop(0, "#E4F3E8"); gr.addColorStop(1, "#CFE8D8"); ctx.fillStyle = gr; ctx.fillRect(-w / 2, -h / 2, w, h);
    // pola gelombang halus (pengaman), bukan desain cek asli
    ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip(); ctx.strokeStyle = "rgba(60,140,100,0.16)"; ctx.lineWidth = Math.max(1.5, h * 0.012);
    for (let k = 0; k < 9; k++) { ctx.beginPath(); for (let u = 0; u <= 1.001; u += 0.02) { const xx = -w / 2 + u * w, yy = -h / 2 + (k + 0.5) * h / 9 + Math.sin(u * 18 + k) * h * 0.03; u ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = "rgba(40,100,70,0.55)"; ctx.lineWidth = Math.max(2, h * 0.012); ctx.strokeRect(-w / 2 + h * 0.05, -h / 2 + h * 0.05, w - h * 0.1, h - h * 0.1);
    const u = h / 200;
    ctx.fillStyle = "rgba(40,80,60,0.55)"; RR(ctx, -w / 2 + 26 * u, -h / 2 + 26 * u, 120 * u, 12 * u, 6 * u); ctx.fill(); RR(ctx, -w / 2 + 26 * u, -h / 2 + 46 * u, 80 * u, 8 * u, 4 * u); ctx.fill();
    ctx.fillStyle = "rgba(40,80,60,0.4)"; RR(ctx, w / 2 - 110 * u, -h / 2 + 26 * u, 80 * u, 9 * u, 4 * u); ctx.fill();
    const fs = Math.round(Math.max(58 * u, o.minFs || 0)), af = `800 ${fs}px ${FONT}`;
    const bw = Math.max(190 * u, fw(ctx, "$2.56", af) + 18), bh = Math.max(72 * u, fs * 1.2), bx = w / 2 - bw - 16 * u, byy = -h / 2 + 46 * u;
    // baris nama penerima + jumlah tertulis (garis tangan)
    ctx.strokeStyle = "rgba(40,80,60,0.5)"; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(-w / 2 + 26 * u, -h / 2 + 108 * u); ctx.lineTo(bx - 20 * u, -h / 2 + 108 * u); ctx.moveTo(-w / 2 + 26 * u, -h / 2 + 150 * u); ctx.lineTo(w / 2 - 26 * u, -h / 2 + 150 * u); ctx.stroke();
    ctx.strokeStyle = "#2F4FA0"; ctx.lineWidth = 2.6 * u; ctx.beginPath();
    for (let q = 0; q <= 1.001; q += 0.02) { const xx = -w / 2 + 40 * u + q * 150 * u, yy = -h / 2 + 98 * u + Math.sin(q * 30) * 6 * u - Math.abs(Math.sin(q * 13)) * 5 * u; q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
    ctx.beginPath(); for (let q = 0; q <= 1.001; q += 0.02) { const xx = w / 2 - 170 * u + q * 140 * u, yy = h / 2 - 34 * u + Math.sin(q * 22 + 1) * 8 * u - q * 6 * u; q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
    // kotak jumlah
    ctx.fillStyle = "#FFFFFF"; RR(ctx, bx, byy, bw, bh, 8 * u); ctx.fill(); ctx.strokeStyle = "rgba(40,100,70,0.6)"; ctx.lineWidth = 2.5 * u; ctx.stroke();
    if (o.amt !== false) ftxt(ctx, "$2.56", bx + bw / 2, byy + bh * 0.5 + fs * 0.36, af, "#173D2B", { align: "center", safe: true });
    ctx.fillStyle = "rgba(30,40,40,0.55)"; for (let k = 0; k < 12; k++) { ctx.fillRect(-w / 2 + 26 * u + k * 15 * u, h / 2 - 26 * u, 9 * u, 10 * u); }
    ctx.restore();
  }
  // bingkai kayu yang tumbuh di sekeliling benda (u 0..1), kilau kaca (glint 0..1)
  function frame(ctx, x, y, w, h, u, glint, bw = 26) {
    if (u <= 0.01) return; const X = x - w / 2 - bw, Y = y - h / 2 - bw, Wd = w + bw * 2, Hd = h + bw * 2;
    ctx.save();
    // passe-partout putih
    ctx.globalAlpha *= clamp(u * 1.5); ctx.strokeStyle = "#F4EFE6"; ctx.lineWidth = bw * 0.55; ctx.strokeRect(x - w / 2 - bw * 0.28, y - h / 2 - bw * 0.28, w + bw * 0.56, h + bw * 0.56);
    ctx.globalAlpha = 1;
    const per = 2 * (Wd + Hd); ctx.setLineDash([per * eio(u), per]); ctx.lineCap = "butt";
    ctx.strokeStyle = "#5E3B26"; ctx.lineWidth = bw; ctx.beginPath(); ctx.rect(X + bw / 2, Y + bw / 2, Wd - bw, Hd - bw); ctx.stroke();
    ctx.strokeStyle = "#A8714C"; ctx.lineWidth = bw * 0.35; ctx.beginPath(); ctx.rect(X + bw * 0.3, Y + bw * 0.3, Wd - bw * 0.6, Hd - bw * 0.6); ctx.stroke();
    ctx.setLineDash([]);
    if (glint > 0 && glint < 1) { ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y - h / 2, w, h); ctx.clip(); const gx = x - w / 2 - 80 + (w + 160) * eio(glint);
      const gg = ctx.createLinearGradient(gx - 60, 0, gx + 60, 0); gg.addColorStop(0, "rgba(255,255,255,0)"); gg.addColorStop(0.5, "rgba(255,255,255,0.55)"); gg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gg; ctx.save(); ctx.translate(gx, y); ctx.rotate(0.35); ctx.fillRect(-60, -h, 120, h * 2); ctx.restore(); ctx.restore(); }
    ctx.restore();
  }
  function rosette(ctx, x, y, r, col) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = col;
    ctx.beginPath(); for (let i = 0; i < 24; i++) { const rr = i % 2 ? r * 0.82 : r, an = i * Math.PI / 12; ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); } ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FFF4D6"; ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, TAU); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, r * 0.38, 0, TAU); ctx.fill(); ctx.restore();
  }
  const CERT_BANK = "Bank Negeri Khayalan";
  function certificate(ctx, x, y, w, h, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(o.sc || 1, o.sc || 1);
    const un = o.unroll == null ? 1 : o.unroll;
    ctx.beginPath(); ctx.rect(-w / 2 - 20, -h / 2 - 20, w + 40, (h + 40) * un); ctx.clip();
    ctx.fillStyle = "rgba(10,10,30,0.3)"; ctx.fillRect(-w / 2 + 10, -h / 2 + 12, w, h);
    const gr = ctx.createLinearGradient(0, -h / 2, 0, h / 2); gr.addColorStop(0, "#FFF7E4"); gr.addColorStop(1, "#F6E8C8"); ctx.fillStyle = gr; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = "#B07A3A"; ctx.lineWidth = 6; ctx.strokeRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28);
    ctx.strokeStyle = "rgba(176,122,58,0.6)"; ctx.lineWidth = 2; ctx.strokeRect(-w / 2 + 26, -h / 2 + 26, w - 52, h - 52);
    // pita gelombang (pola sendiri)
    ctx.save(); ctx.strokeStyle = "rgba(149,132,255,0.35)"; ctx.lineWidth = 2;
    for (let k = 0; k < 5; k++) { ctx.beginPath(); for (let q = 0; q <= 1.001; q += 0.02) { const xx = -w / 2 + 40 + q * (w - 80), yy = -h / 2 + 96 + k * 6 + Math.sin(q * 24 + k * 0.8) * 7; q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
    ctx.restore();
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { ctx.fillStyle = "#B07A3A"; ctx.beginPath(); ctx.arc(sx * (w / 2 - 26), sy * (h / 2 - 26), 9, 0, TAU); ctx.fill(); });
    const m = ctx.getTransform(), eff = Math.hypot(m.a, m.b), small = 40 * eff < 42;   // kecil di layar: judul & nama bank jadi balok
    const vis0 = yy => o.hideBelow == null || y + yy * (o.sc || 1) < o.hideBelow;   // teks yang sudah masuk ke balik kantong amplop tidak digambar
    const vis = yy => { if (!small) return vis0(yy); if (vis0(yy)) { ctx.fillStyle = yy < 0 ? "rgba(122,78,30,0.75)" : "rgba(90,58,26,0.6)"; RR(ctx, yy < 0 ? -110 : -190, yy - 30, yy < 0 ? 220 : 380, 26, 10); ctx.fill(); } return false; };
    if (vis(-h / 2 + 70)) ftxt(ctx, "SERTIFIKAT", 0, -h / 2 + 70, `900 40px ${FONT}`, "#7A4E1E", { align: "center", safe: true });
    if (vis0(40)) ftxt(ctx, "0x$1.00", 0, 40, `900 92px ${FONT}`, "#2D3A8C", { align: "center", safe: true });
    if (o.bank > 0) {
      const n = Math.max(1, Math.round(CERT_BANK.length * clamp(o.bank))), s = CERT_BANK.slice(0, n), full = fw(ctx, CERT_BANK, `800 40px ${FONT}`);
      if (o.hl > 0) { ctx.fillStyle = `rgba(255,181,71,${0.45 * o.hl})`; RR(ctx, -full / 2 - 10, h / 2 - 92, (full + 20) * eio(o.hl), 54, 10); ctx.fill(); }
      if (vis(h / 2 - 52)) ftxt(ctx, s, -full / 2, h / 2 - 52, `800 40px ${FONT}`, "#5A3A1A", { safe: true });
    } else { ctx.fillStyle = "rgba(122,78,30,0.3)"; RR(ctx, -170, h / 2 - 78, 340, 14, 7); ctx.fill(); }
    rosette(ctx, w / 2 - 58, -h / 2 + 62, 26, "#D9534F");
    ctx.restore();
  }
  function envBack(ctx, x, y, w, h, a = 1) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a;
    shadowE(ctx, x + 10, y + h / 2 + 10, w * 0.56, 16, 0.3);
    ctx.fillStyle = "#E4CFA4"; RR(ctx, x - w / 2, y - h / 2, w, h, 10); ctx.fill();
    ctx.restore();
  }
  function envFlap(ctx, x, y, w, h, flap) {
    const fy = lerp(-h * 0.62, h * 0.18, eio(flap));
    ctx.fillStyle = flap < 0.5 ? "#DCC193" : "#EAD3A6"; ctx.beginPath(); ctx.moveTo(x - w / 2, y - h / 2); ctx.lineTo(x + w / 2, y - h / 2); ctx.lineTo(x, y + fy); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(150,110,60,0.5)"; ctx.lineWidth = 3; ctx.stroke(); return fy;
  }
  function envFront(ctx, x, y, w, h, flap, seal, a = 1) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a;
    // kantong depan
    ctx.fillStyle = "#F1DEB6"; ctx.beginPath(); ctx.moveTo(x - w / 2, y - h / 2 + 30); ctx.lineTo(x, y + h * 0.12); ctx.lineTo(x + w / 2, y - h / 2 + 30); ctx.lineTo(x + w / 2, y + h / 2); ctx.lineTo(x - w / 2, y + h / 2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(150,110,60,0.45)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - w / 2, y + h / 2); ctx.lineTo(x - w * 0.08, y + h * 0.05); ctx.moveTo(x + w / 2, y + h / 2); ctx.lineTo(x + w * 0.08, y + h * 0.05); ctx.stroke();
    // tutup: flap 0 = terbuka ke atas, 1 = tertutup ke bawah
    const fy = flap >= 0.5 ? envFlap(ctx, x, y, w, h, flap) : lerp(-h * 0.62, h * 0.18, eio(flap));
    if (seal > 0) { const k = popK(seal, 0) || 0; const sy = y + fy - 26; ctx.save(); ctx.translate(x, sy); ctx.scale(k, k); ctx.fillStyle = "#C8423F"; ctx.beginPath(); for (let i = 0; i < 16; i++) { const rr = i % 2 ? 24 : 28, an = i * Math.PI / 8; ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); } ctx.closePath(); ctx.fill(); ctx.fillStyle = "#E86A66"; ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.restore();
  }

  // =====================================================================
  // b6_1
  function T1(b) {
    return { fokus: D.at(b, "fokus,"), henti: D.at(b, "berhenti"), email: D.at(b, "email"), sejak: D.at(b, "sejak"),
      y1: D.at(b, "seribu"), y2: D.at(b, "sembilan ratus"), y3: D.at(b, "sembilan puluh"), y4: D.at(b, "puluh."), y4e: D.atEnd(b, "puluh."),
      orang: D.at(b, "Orang"), pertama: D.at(b, "pertama"), salah: D.at(b, "kesalahan"), bukunya: D.atEnd(b, "bukunya"),
      dapat: D.at(b, "mendapat"), hadiah: D.at(b, "hadiah dua"), d2: D.at(b, "dua koma"), koma: D.at(b, "koma"), d5: D.at(b, "lima"), d6: D.at(b, "enam"), dolar: D.at(b, "dolar,"), dolarE: D.atEnd(b, "dolar,"),
      satu: D.at(b, "satu dolar"), heks: D.at(b, "heksadesimal."), heksE: D.atEnd(b, "heksadesimal."),
      dulu: D.at(b, "Dulu,"), cek: D.at(b, "cek,"), cekE: D.atEnd(b, "cek,"), banyak: D.at(b, "banyak"), penerima: D.at(b, "penerima"), memilih: D.at(b, "memilih"), bingkai: D.at(b, "membingkainya."), bingkaiE: D.atEnd(b, "membingkainya."),
      kini: D.at(b, "Kini,"), sert: D.at(b, "sertifikat"), bank: D.at(b, "bank khayalan."), khayalE: D.atEnd(b, "khayalan."), dur: b.dur };
  }
  function cam1(l, T) {
    return D.path([[0, 1290, 500, 1.13], [T.y4e, 1322, 486, 1.2],
      [T.orang + 0.7, 765, 645, 1.3], [T.dulu - 0.1, 775, 650, 1.33],
      [T.cek - 0.2, 640, 330, 1.15], [T.bingkaiE + 0.25, 636, 326, 1.2],
      [T.sert - 0.25, 1700, 480, 1.2], [T.dur + 0.6, 1706, 484, 1.22]], l);
  }
  const BIP_A = [1745, 655, 200], BIP_B = [1150, 800, 190], BIP_H = [1330, 1000, 190], BIP_D = [2300, 728, 190];
  const LENS_MAG = 1.1;
  function lensTarget(l, T) { const u = eio(ramp(l, T.orang + 1.0, T.salah - T.orang - 1.0)); return [lerp(TYPO.x - 150, TYPO.x, u), TYPO.y - 12]; }
  function bip1(ctx, l, t, T, ev) {
    const wAB = ramp(l, T.y4e + 0.1, T.orang + 0.95 - T.y4e - 0.1), wBH = ramp(l, T.dulu, 1.0), wBD = ramp(l, T.kini + 0.1, T.sert - 0.3 - T.kini - 0.1);
    let p;
    if (wBD > 0) p = BIP_H.map((v, i) => lerp(v, BIP_D[i], eio(wBD))); else if (wBH > 0) p = BIP_B.map((v, i) => lerp(v, BIP_H[i], eio(wBH)));
    else p = BIP_A.map((v, i) => lerp(v, BIP_B[i], eio(wAB)));
    const [x, y, s] = p; let o;
    if (wAB > 0 && wAB < 1) o = { pose: "jalan", t, dir: -1 };
    else if ((wBD > 0 && wBD < 1) || (wBH > 0 && wBD <= 0)) o = { pose: "jalan", t, dir: 1 };
    else if (wAB <= 0) {
      if (l < T.henti - 0.55) o = { pose: "diam", t, mood: "sad", sweat: true, look: [-1, -0.4] };
      else if (l < T.henti + 0.65) o = { pose: "tekan", t, target: [PWR.x, PWR.y - 12], press: ramp(l, T.henti - 0.18, 0.18), mood: "think" };
      else o = { pose: "diam", t, mood: "happy", look: l < T.sejak ? [-1, -0.3] : [-1, 0.1] };
    } else if (wBH <= 0) {
      // lensa besar (±250 px di layar) yang berhenti tepat di tengah kata "algorimta" sekitar 8,5 s
      if (l < T.dapat) { const tg = lensTarget(l, T); o = { pose: "kacaPembesar", t, target: tg, glass: 1.1, mood: l > T.salah ? "wow" : "think",
        content: (c, cx, cy, r) => { c.save(); c.translate(cx, cy); c.scale(LENS_MAG, LENS_MAG); c.translate(-cx, -cy); book(c, t, { err: ev.err, circle: 0, noSafe: true }); c.restore(); } }; }
      else if (l >= T.d2 && l < T.d2 + 0.9) o = { pose: "kaget", t, k: l - T.d2, mood: "wow", seru: false };
      else o = { pose: "diam", t, mood: "happy", look: [-1, -1] };
    } else {
      if (l < T.khayalE + 0.15) o = { pose: "tunjuk", t, target: [CERT.x + 140, CERT.y + 30], mood: "happy" };
      else if (l < T.dur - 0.05) o = { pose: "diam", t, mood: "happy", look: [-1, 0.2] };
      else o = { pose: "diam", t, mood: "happy", look: [-0.6, -0.2], wave: l };
    }
    KB.draw(ctx, x, y, s, o);
  }
  // timing kecil
  function E1(l, T) {
    const off = ramp(l, T.henti, 0.12), flash = win(l, T.henti, T.henti + 0.12, 0.08) * 0.9;
    const yk = [popK(l, T.y1), popK(l, T.y2), popK(l, T.y3), popK(l, T.y4)];
    // sertifikat: terbuka saat "Kini", amplop baru masuk sesudah "bank khayalan" hampir selesai, lalu sertifikat masuk, tutup, segel
    const certIn = ramp(l, T.kini + 0.55, T.sert - T.kini - 0.55), envA = ramp(l, T.bank + 0.5, 0.45);
    const s0 = T.khayalE + 0.14, slide = ramp(l, s0, 0.6), flap = ramp(l, s0 + 0.6, 0.24), seal = l - (s0 + 0.84), fly = ramp(l, s0 + 0.84, 0.45);
    return { off, flash, yearOn: l >= T.sejak, yk, scroll: Math.min(l, T.henti) * 150, frost: ramp(l, T.henti + 0.15, 1.6), zeroK: popK(l, T.henti + 0.15), press: ramp(l, T.henti - 0.18, 0.18),
      err: ramp(l, T.salah, 0.3), circle: ramp(l, T.salah, 0.55), lett0: T.henti + 0.55,
      chq: ramp(l, T.dulu + 0.55, T.cek - T.dulu - 0.55), chqS: [ramp(l, T.banyak, 0.3), ramp(l, T.penerima, 0.3)],
      fr: [ramp(l, T.memilih + 0.1, 0.8), ramp(l, T.bingkai, 0.6), ramp(l, T.bingkai + 0.2, 0.6)], glint: ramp(l, T.bingkai + 0.5, 0.9),
      envA, certIn, bank: ramp(l, T.bank, T.khayalE - T.bank), hl: ramp(l, T.bank + 0.1, 0.5), slide, flap, seal, fly, s0 };
  }
  S.b6_1 = function (ctx, b, l, t, TL) {
    WTA = ramp(l, 0.3, 0.3);   // tulisan benda muncul saat kartu bab memudar
    const T = T1(b), ev = E1(l, T), c = drift(cam1(l, T), t);
    WTA *= 1 - ramp(l, T.dur - 0.25, 0.25);   // tulisan benda selesai memudar sebelum silang-pudar ke b6_2
    { const pg = panelGeo(l, T); MASK = pg.a > 0.4 ? [pg.x + pg.dx, pg.y, pg.x + pg.dx + pg.w, pg.y + pg.h] : null; }
    ctx.save(); camT(ctx, c);
    wall(ctx, t);
    // cek di dinding (fase C), digambar sebelum lampu/rak supaya cahaya jatuh di atasnya
    if (ev.chq > 0) {
      const u = eout(ev.chq), x = lerp(CHQ.x - 560, CHQ.x, u), rot = lerp(-0.3, 0, u);
      ctx.save(); ctx.globalAlpha *= clamp(ev.chq * 3); cheque(ctx, x, CHQ.y, CHQ.w, CHQ.h, { rot, framed: ev.fr[0] > 0.6 }); ctx.restore();
      frame(ctx, CHQ.x, CHQ.y, CHQ.w, CHQ.h, ev.fr[0], ev.glint, 30);
    }
    CHQS.forEach((q, i) => { const a = ev.chqS[i]; if (a <= 0) return; ctx.save(); ctx.translate(q.x, q.y); ctx.scale(lerp(0.88, 1, eout(a)), lerp(0.88, 1, eout(a))); ctx.translate(-q.x, -q.y); ctx.globalAlpha *= clamp(a * 2);
      cheque(ctx, q.x, q.y, q.w, q.h, { minFs: 40, framed: ev.fr[i + 1] > 0.6, rot: (i ? 0.02 : -0.02) * (1 - ev.fr[i + 1]) }); frame(ctx, q.x, q.y, q.w, q.h, ev.fr[i + 1], ev.glint, 16); ctx.restore(); });
    lamp(ctx, t);
    shelf(ctx, t);
    desk(ctx);
    book(ctx, t, { err: ev.err, circle: ev.circle });
    const pile = letters(ctx, l, ev.lett0);
    monitor(ctx, t, l, ev);
    inflow(ctx, l, T.henti);
    // amplop (baru masuk ±24,8 s, di meja kosong di depan monitor) + sertifikat (fase D)
    const hop = ev.fly > 0 && ev.fly < 1 ? Math.sin(ev.fly * Math.PI) * 22 : 0, ex = ENV.x, ey = ENV.y - hop + (1 - eout(ev.envA)) * 240;
    if (ev.envA > 0) { ctx.save(); ctx.translate(ex, ey); ctx.rotate(-0.04 * Math.sin(ev.fly * Math.PI)); ctx.translate(-ex, -ey); envBack(ctx, ex, ey, ENV.w, ENV.h, ev.envA); if (ev.flap < 0.5) { ctx.save(); ctx.globalAlpha *= ev.envA; envFlap(ctx, ex, ey, ENV.w, ENV.h, ev.flap); ctx.restore(); } }
    if (ev.certIn > 0 && ev.flap < 0.5) {
      const sl = ev.slide, ux = eio(clamp(sl / 0.65)), uy = eio(clamp((sl - 0.3) / 0.7));   // ke kanan dulu, lalu turun masuk kantong
      const cxp = lerp(CERT.x, ENV.x, ux), cy = lerp(CERT.y, ENV.y - 30, uy) - Math.sin(ux * Math.PI) * 40, sc = lerp(1, 0.7, ux);
      ctx.save(); if (sl > 0) { ctx.beginPath(); ctx.rect(-600, -400, 3200, ENV.y + ENV.h / 2 - 8 + 400); ctx.clip(); }
      certificate(ctx, cxp, cy, CERT.w, CERT.h, { unroll: eout(ev.certIn), bank: ev.bank, hl: ev.hl, sc, hideBelow: uy > 0 ? ENV.y - ENV.h / 2 + 34 : null }); ctx.restore();
    }
    if (ev.envA > 0) { envFront(ctx, ex, ey, ENV.w, ENV.h, ev.flap, ev.seal, ev.envA); ctx.restore(); }
    bip1(ctx, l, t, T, ev);
    lights(ctx);
    addLight(ctx, LAMP.hx + 45, LAMP.hy + 95, 150, "#FFE7B0", 0.45);
    dust(ctx, t, 0.8);
    if (ev.glint > 0 && ev.glint < 1) [[CHQ.x + CHQ.w / 2 + 10, CHQ.y - CHQ.h / 2 - 10, 26], [CHQS[0].x - CHQS[0].w / 2, CHQS[0].y - 50, 18], [CHQS[1].x + CHQS[1].w / 2, CHQS[1].y - 50, 18]].forEach(([sx, sy, r], k) => sparkle(ctx, sx, sy, r * (0.8 + 0.2 * Math.sin(t * 7 + k)), Math.sin(ev.glint * Math.PI)));
    ctx.restore();

    // ---------- label & panel hadiah ----------
    D.post(cx => {
      const tA = (s, wx, wy, t0, t1, col, size = 48) => { const p = pop(l, t0); tag(cx, s, ...toS(c, wx, wy), p.a * (1 - ramp(l, t1, 0.35)), { sp: p.sp, col, size }); };
      tA("email: berhenti", MON.x, MON.sy - 92, T.email, T.y4e + 0.35, P.blue);
      tA("surat kertas", TRAY.x - 30, pile.top - 56, ev.lett0 + 0.9, T.y4e + 0.35, P.warm, 46);
      tA("orang pertama", BOOK.x - 150, BOOK.top - 70, T.pertama, T.dapat - 0.35, P.amber);
      tA("kesalahan", TYPO.x + 30, TYPO.y - 150, T.salah + 0.15, T.d2 + 0.4, P.red);
      typoCallout(cx, l, T);
      tA("dulu: cek", CHQ.x, CHQ.y - CHQ.h / 2 - 80, T.cek, T.bingkai - 0.1, P.green);
      tA("$2.56 = 2,56 dolar", 1078, 252, T.cekE + 0.3, T.kini, P.amber, 44);
      tA("banyak penerima", 500, 594, T.banyak + 0.1, T.kini, P.teal, 46);
      tA("dibingkai", CHQ.x, CHQ.y - CHQ.h / 2 - 80, T.bingkai + 0.1, T.kini, P.warm);
      tA("kini: sertifikat", CERT.x, CERT.y - CERT.h / 2 - 62, T.sert, ev.s0, P.violet);
      tA("0x = tanda heksadesimal", CERT.x, CERT.y + CERT.h / 2 + 52, T.sert + 0.3, ev.s0, P.teal, 46);
      rewardPanel(cx, l, T);
    });
  };
  // kotak keterangan salah ketik (layar): "algorimta ✗ → algoritma ✓", huruf yang tertukar diwarnai
  function typoCallout(cx, l, T) {
    const t0 = T.salah + 0.5, a = ramp(l, t0, 0.25) * (1 - ramp(l, T.d2 - 0.15, 0.3)); if (a <= 0.01) return;
    const f = `800 56px ${FONT}`, w1 = fw(cx, "algori", f), wm = fw(cx, "mt", f), wa = fw(cx, "a", f), ww = w1 + wm + wa;
    const MK = 46, G = 22, AR = 74, tot = ww + G + MK + G * 1.6 + AR + G * 1.6 + ww + G + MK, X = 790 - tot / 2, Y = 818, k = popK(l, t0);
    cx.save(); cx.globalAlpha *= a; cx.translate(790, Y - 18); cx.scale(k, k); cx.translate(-790, -(Y - 18));
    D.panel(cx, X - 34, Y - 70, tot + 68, 100, { fill: "rgba(14,22,62,0.96)", stroke: D.hexA(P.amber, 0.7), lw: 3, r: 22 });
    const word = (x0, mid, col) => {
      cx.fillStyle = D.hexA(col, 0.62); RR(cx, x0 + w1 - 4, Y - 50, wm + 8, 64, 8); cx.fill();
      ftxt(cx, "algori" + mid + "a", x0, Y, f, P.ink);
      cx.fillStyle = col; cx.fillRect(x0 + w1 - 2, Y + 10, wm + 4, 6);
    };
    let x = X; word(x, "mt", P.red); x += ww + G;
    // tanda silang merah
    cx.save(); cx.strokeStyle = P.red; cx.lineWidth = 9; cx.lineCap = "round"; const mc = [x + MK / 2, Y - 20];
    cx.beginPath(); cx.moveTo(mc[0] - 16, mc[1] - 16); cx.lineTo(mc[0] + 16, mc[1] + 16); cx.moveTo(mc[0] + 16, mc[1] - 16); cx.lineTo(mc[0] - 16, mc[1] + 16); cx.stroke(); cx.restore();
    x += MK + G * 1.6;
    // panah (muncul sedikit sesudah kata salah)
    const u2 = ramp(l, t0 + 0.35, 0.3);
    cx.save(); cx.globalAlpha *= u2; cx.strokeStyle = P.ink2; cx.fillStyle = P.ink2; cx.lineWidth = 7; cx.lineCap = "round";
    cx.beginPath(); cx.moveTo(x, Y - 20); cx.lineTo(x + AR - 18, Y - 20); cx.stroke(); cx.beginPath(); cx.moveTo(x + AR, Y - 20); cx.lineTo(x + AR - 22, Y - 34); cx.lineTo(x + AR - 22, Y - 6); cx.closePath(); cx.fill(); cx.restore();
    x += AR + G * 1.6;
    cx.save(); cx.globalAlpha *= u2; word(x, "tm", P.green); x += ww + G;
    cx.strokeStyle = P.green; cx.lineWidth = 9; cx.lineCap = "round"; cx.lineJoin = "round"; cx.beginPath(); cx.moveTo(x + 4, Y - 20); cx.lineTo(x + 18, Y - 4); cx.lineTo(x + 44, Y - 40); cx.stroke(); cx.restore();
    cx.restore();
  }
  // panel hadiah (layar, kiri atas): 2,56 dolar disusun per kata, lalu persamaan bertumpuk baris demi baris
  const PAN = { x: 112, y: 80, w: 700 };
  function panRows(T) {
    return [[T.hadiah, 56], [T.d2, 170], [T.dolarE + 0.15, 262], [T.satu, 328], [T.heks, 390], [T.heks + 0.35, 478], [T.heks + 0.7, 534], [T.heks + 1.05, 600]];
  }
  function panelGeo(l, T) {
    const a = ramp(l, T.dapat - 0.1, 0.4) * (1 - ramp(l, T.dulu + 0.3, 0.4)), slide = eout(ramp(l, T.dapat - 0.1, 0.5));
    const rows = panRows(T); let h = 222; for (let i = 2; i < rows.length; i++) h = lerp(h, rows[i][1] + 30, eout(ramp(l, rows[i][0] - 0.05, 0.3)));
    return { a, x: PAN.x, y: PAN.y, w: PAN.w, slide, dx: -(1 - slide) * 140, h };
  }
  function rewardPanel(cx, l, T) {
    const G = panelGeo(l, T), a = G.a; if (a <= 0.01) return;
    const { x, y, w, h } = G, R = panRows(T), X = x + 36;
    cx.save(); cx.globalAlpha *= a; cx.translate(G.dx, 0);
    D.panel(cx, x, y, w, h, { fill: "rgba(14,22,62,0.98)", stroke: D.hexA(P.amber, 0.7), lw: 3, r: 26 });
    cx.save(); RR(cx, x, y, w, h, 26); cx.clip();
    const line = (i, s, f, col, xx = X) => { const t0 = R[i][0]; if (l < t0) return; cx.save(); cx.translate(xx, y + R[i][1]);
      if (parseFloat(f.match(/(\d+)px/)[1]) < 52) { const u = ramp(l, t0, 0.3); cx.globalAlpha *= u; cx.translate(0, (1 - eout(u)) * 14); } else { const k = popK(l, t0); cx.scale(k, k); }
      ftxt(cx, s, 0, 0, f, col); cx.restore(); };
    const div = (yy, t0) => { if (l < t0) return; cx.fillStyle = "rgba(255,255,255,0.2)"; cx.fillRect(X, y + yy, (w - 72) * eout(ramp(l, t0, 0.3)), 3); };
    if (l >= T.hadiah) ftxt(cx, "Hadiah", X, y + R[0][1], `800 44px ${FONT}`, P.ink2);
    // jumlah: angka muncul tepat saat diucapkan
    const amt = l >= T.d6 ? "2,56" : l >= T.d5 ? "2,5" : l >= T.koma ? "2," : l >= T.d2 ? "2" : "";
    const lastT = l >= T.d6 ? T.d6 : l >= T.d5 ? T.d5 : l >= T.koma ? T.koma : T.d2;
    if (amt) {
      const f = `900 116px ${FONT}`, wPrev = fw(cx, amt.slice(0, -1), f), k = popK(l, lastT), yy = y + R[1][1];
      ftxt(cx, amt.slice(0, -1), X, yy, f, P.amber);
      cx.save(); cx.translate(X + wPrev, yy); cx.scale(k, k); ftxt(cx, amt.slice(-1), 0, 0, f, P.amber); cx.restore();
      if (l >= T.dolar) { const k2 = popK(l, T.dolar); const wA = fw(cx, "2,56", f); cx.save(); cx.translate(X + wA + 22, yy); cx.scale(k2, k2); ftxt(cx, "dolar", 0, 0, `800 58px ${FONT}`, P.ink); cx.restore(); }
    }
    div(198, T.dolarE + 0.1);
    line(2, "= 256 sen", `800 52px ${FONT}`, P.ink);
    line(3, "= 1 dolar", `900 56px ${FONT}`, P.teal);
    line(4, "heksadesimal", `900 56px ${FONT}`, P.teal, X + 52);
    div(418, R[5][0] - 0.05);
    // persamaan penjelas, baris demi baris
    if (l >= R[5][0]) { const u = ramp(l, R[5][0], 0.3), f1 = `900 52px ${FONT}`, w1 = fw(cx, "256 = 100 ", f1);
      cx.save(); cx.globalAlpha *= u; cx.translate(X, y + R[5][1] + (1 - eout(u)) * 14); ftxt(cx, "256 = 100", 0, 0, f1, P.ink); ftxt(cx, "(heksadesimal)", w1, 0, `700 44px ${FONT}`, P.ink2); cx.restore(); }
    line(6, "karena 16 × 16 = 256", `700 44px ${FONT}`, P.ink2);
    line(7, "→ 1,00 dolar", `900 56px ${FONT}`, P.amber);
    cx.restore();
    cx.restore();
  }

  // =====================================================================
  // b6_2
  function T2(b) {
    return { buku: D.at(b, "Buku"), terkenal: D.at(b, "terkenal"), sulit: D.at(b, "sulit."), sulitE: D.atEnd(b, "sulit."), bill: D.at(b, "Bill"), kolom: D.at(b, "kolom"), bahwa: D.at(b, "bahwa ia"),
      memb1E: D.atEnd(b, "membacanya."), ia2: D.at(b, "Ia juga"), kirim: D.at(b, "kirimkan"), riwayat: D.at(b, "riwayat"), kepada: D.at(b, "kepadanya."), end: D.speechEnd(b), dur: b.dur };
  }
  // kolom koran (koordinat layar)
  const COL = { x: 992, y: 112, w: 800, h: 772 };
  const CFONT = `700 46px ${SERIF}`;
  // [teks baris, y, [[kata, frasa narasi mulai, frasa selesai(opsional)]]]
  const S1 = [["Butuh disiplin dan waktu", 384, [["Butuh", "butuh"], ["disiplin", "disiplin"], ["dan", "dan waktu"], ["waktu", "waktu berbulan"]]],
    ["berbulan-bulan untuk", 442, [["berbulan-bulan", "berbulan-bulan"], ["untuk", "untuk membacanya"]]],
    ["membacanya.", 500, [["membacanya.", "membacanya."]]]];
  const S2 = [["Kalau kamu bisa membaca", 638, [["Kalau", "kalau"], ["kamu", "kamu bisa"], ["bisa", "bisa membaca"], ["membaca", "membaca semua"]]],
    ["semua isi bukunya,", 696, [["semua", "semua isi"], ["isi", "isi bukunya"], ["bukunya,", "bukunya,"]]],
    ["kirimkan riwayat hidupmu", 754, [["kirimkan", "kirimkan"], ["riwayat", "riwayat"], ["hidupmu", "hidupmu"]]],
    ["kepada saya.", 812, [["kepada", "kepadanya.", 0], ["saya.", "kepadanya.", 1]]]];
  const TX0 = COL.x + 44;
  // waktu sorot tiap kata
  function wordTimes(b, lines) {
    const out = lines.map(([s, y, ws]) => ws.map(([wd, ph, half]) => {
      let a = D.at(b, ph), e = null;
      if (half === 0) e = (a + D.atEnd(b, ph)) / 2; else if (half === 1) { a = (a + D.atEnd(b, ph)) / 2; e = D.atEnd(b, ph); }
      return { wd, a, e, ph };
    }));
    const flat = out.flat();
    flat.forEach((w, i) => { if (w.e == null) w.e = i + 1 < flat.length ? Math.min(flat[i + 1].a, w.a + 0.7) : D.atEnd(b, w.ph); w.e = Math.max(w.e, w.a + 0.15); });
    return out;
  }
  function wordBoxes(ctx, lines) {
    return lines.map(([s, y, ws]) => { let from = 0; return ws.map(([wd]) => { const i = s.indexOf(wd, from); from = i + wd.length; return { x: TX0 + fw(ctx, s.slice(0, i), CFONT), w: fw(ctx, wd, CFONT), y, wd }; }); });
  }
  function hiWords(ctx, l, boxes, times, a = 1) {
    boxes.forEach((row, r) => row.forEach((bx, k) => { const tm = times[r][k], p = clamp((l - tm.a) / (tm.e - tm.a)); if (p <= 0) return;
      ctx.fillStyle = `rgba(255,214,74,${0.78 * a})`; RR(ctx, bx.x - 6, bx.y - 40, (bx.w + 12) * eio(p), 52, 8); ctx.fill(); }));
  }
  // badan kolom: tiap kata berupa balok abu-abu sampai diucapkan, lalu tintanya muncul
  function inkWords(ctx, l, boxes, times) {
    boxes.forEach((row, r) => row.forEach((bx, k) => { const tm = times[r][k], u = clamp((l - tm.a + 0.04) / 0.14);
      if (u < 1) { ctx.fillStyle = `rgba(60,56,70,${0.32 * (1 - u)})`; RR(ctx, bx.x, bx.y - 24, bx.w, 14, 7); ctx.fill(); }
      if (u > 0) { ctx.save(); ctx.globalAlpha *= u; ftxt(ctx, bx.wd, bx.x, bx.y, CFONT, "#2A2638"); ctx.restore(); } }));
  }
  function curWord(l, boxes, times) { let cur = null; boxes.forEach((row, r) => row.forEach((bx, k) => { if (l >= times[r][k].a - 0.05) cur = [bx.x + bx.w / 2, bx.y - 14]; })); return cur; }
  function newsprint(ctx, x, y, w, h, t) {
    ctx.save(); ctx.fillStyle = "rgba(5,8,30,0.35)"; ctx.fillRect(x + 12, y + 16, w, h);
    // tepi sobek
    const r = D.rng(77); ctx.beginPath(); ctx.moveTo(x, y);
    for (let q = 0; q <= 1.001; q += 0.025) ctx.lineTo(x + q * w, y + (r() - 0.5) * 8);
    for (let q = 0; q <= 1.001; q += 0.025) ctx.lineTo(x + w + (r() - 0.5) * 8, y + q * h);
    for (let q = 1; q >= -0.001; q -= 0.025) ctx.lineTo(x + q * w, y + h + (r() - 0.5) * 9);
    for (let q = 1; q >= -0.001; q -= 0.025) ctx.lineTo(x + (r() - 0.5) * 8, y + q * h);
    ctx.closePath(); const gr = ctx.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, "#F1EBDC"); gr.addColorStop(1, "#E3DBC7"); ctx.fillStyle = gr; ctx.fill(); ctx.restore();
  }
  function column(ctx, l, t, T, b, o) {
    const { x, y, w, h } = COL;
    newsprint(ctx, x, y, w, h, t);
    // kepala koran tanpa nama: balok tebal + garis
    ctx.fillStyle = "rgba(40,36,50,0.8)"; RR(ctx, x + 44, y + 30, 300, 26, 6); ctx.fill(); ctx.fillStyle = "rgba(40,36,50,0.35)"; RR(ctx, x + 360, y + 36, 180, 14, 7); ctx.fill();
    ctx.fillStyle = "rgba(40,36,50,0.85)"; ctx.fillRect(x + 44, y + 74, w - 88, 4); ctx.fillRect(x + 44, y + 82, w - 88, 1.5);
    ctx.fillStyle = "rgba(40,36,50,0.55)"; RR(ctx, x + 44, y + 104, 520, 20, 6); ctx.fill(); RR(ctx, x + 44, y + 134, 380, 20, 6); ctx.fill();
    // nama penulis kolom, diketik
    if (o.by > 0) { const s = "Bill Gates", n = Math.max(1, Math.round(s.length * o.by)); ftxt(ctx, s.slice(0, n), x + 44, y + 208, `800 46px ${FONT}`, "#3A2F5A");
      if (o.tr > 0) { ctx.save(); ctx.globalAlpha *= o.tr; ftxt(ctx, "(diterjemahkan)", x + 44 + fw(ctx, s, `800 46px ${FONT}`) + 20, y + 208, `italic 600 44px ${FONT}`, "#6E6680"); ctx.restore(); }
      if (o.by < 1 && Math.sin(l * 18) > 0) { const wv = fw(ctx, s.slice(0, n), `800 46px ${FONT}`); ctx.fillStyle = "#3A2F5A"; ctx.fillRect(x + 48 + wv, y + 170, 4, 44); } }
    ctx.fillStyle = "rgba(40,36,50,0.3)"; ctx.fillRect(x + 44, y + 234, w - 88, 2);
    // badan teks: kalimat 1
    const gb = (yy, ww) => { ctx.fillStyle = "rgba(60,56,70,0.32)"; RR(ctx, TX0, yy, ww, 14, 7); ctx.fill(); };
    if (o.cut < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - o.cut; hiWords(ctx, l, o.b1, o.t1); inkWords(ctx, l, o.b1, o.t1); ctx.restore();
    }
    if (o.cut > 0) { ctx.save(); ctx.globalAlpha *= o.cut; ctx.setLineDash([12, 9]); ctx.strokeStyle = "rgba(120,100,70,0.7)"; ctx.lineWidth = 3; RR(ctx, TX0 - 14, 334, 640, 190, 12); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = "rgba(160,140,100,0.12)"; RR(ctx, TX0 - 14, 334, 640, 190, 12); ctx.fill(); ctx.restore(); }
    const wLast = fw(ctx, "membacanya.", CFONT); gb(486, 0); ctx.fillStyle = "rgba(60,56,70,0.32)"; RR(ctx, TX0 + wLast + 24, 486, w - 88 - wLast - 24, 14, 7); ctx.fill();
    gb(540, w - 88); gb(570, w - 200);
    // kalimat 2
    hiWords(ctx, l, o.b2, o.t2); inkWords(ctx, l, o.b2, o.t2);
    const wK = fw(ctx, "kepada saya.", CFONT); ctx.fillStyle = "rgba(60,56,70,0.32)"; RR(ctx, TX0 + wK + 24, 798, w - 88 - wK - 24, 14, 7); ctx.fill();
    gb(842, w - 330);
  }
  // sampul buku bergaya (jilid 1), koordinat layar; (x,y) = tengah
  const CV = { x: 380, y: 492, w: 500, h: 744 };
  const STK = { x: 380, y: 668, w: 440, h: 300, rot: -0.03 };
  const STK_LINES = ["Butuh disiplin", "dan waktu", "berbulan-bulan", "untuk membacanya."];
  function cover(ctx, x, y, w, h, t, a = 1, sc = 1) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.fillStyle = "rgba(5,8,30,0.4)"; RR(ctx, -w / 2 + 14, -h / 2 + 18, w, h, 14); ctx.fill();
    ctx.fillStyle = "#8E2F2B"; RR(ctx, -w / 2 - 10, -h / 2, w + 10, h, 14); ctx.fill();
    const gr = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); gr.addColorStop(0, "#C9504A"); gr.addColorStop(0.08, "#E8665F"); gr.addColorStop(1, "#D4554F");
    ctx.fillStyle = gr; RR(ctx, -w / 2, -h / 2, w, h, 12); ctx.fill();
    // pola geometris sendiri: kisi titik + busur
    ctx.save(); RR(ctx, -w / 2, -h / 2, w, h, 12); ctx.clip();
    ctx.fillStyle = "rgba(255,255,255,0.09)"; for (let i = 0; i < 12; i++) for (let j = 0; j < 18; j++) { ctx.beginPath(); ctx.arc(-w / 2 + 24 + i * 42, -h / 2 + 24 + j * 42, 3, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = "rgba(255,230,200,0.16)"; ctx.lineWidth = 3; for (let k = 1; k < 7; k++) { ctx.beginPath(); ctx.arc(w / 2, h / 2, k * 70 + 6 * Math.sin(t * 0.8 + k), Math.PI, Math.PI * 1.5); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = "rgba(255,240,220,0.55)"; ctx.lineWidth = 3; RR(ctx, -w / 2 + 22, -h / 2 + 22, w - 44, h - 44, 8); ctx.stroke();
    const TF = `700 52px ${SERIF}`;
    if (sc >= 0.9) {
      ftxt(ctx, "The Art of", 0, -h / 2 + 104, TF, "#FFF6E8", { align: "center" });
      ftxt(ctx, "Computer", 0, -h / 2 + 164, TF, "#FFF6E8", { align: "center" });
      ftxt(ctx, "Programming", 0, -h / 2 + 224, TF, "#FFF6E8", { align: "center" });
      ftxt(ctx, "Jilid 1", 0, -h / 2 + 314, `800 44px ${FONT}`, "#FFE3B8", { align: "center" });
    } else { ctx.fillStyle = "#FFF6E8"; [[-130, 104], [-115, 164], [-150, 224]].forEach(([x0, yy]) => { RR(ctx, x0, -h / 2 + yy - 36, -2 * x0, 40, 12); ctx.fill(); }); }   // kecil: judul jadi balok
    ctx.fillStyle = "#FFD38A"; ctx.fillRect(-60, -h / 2 + 252, 120, 5);
    ctx.restore();
  }
  function sticker(ctx, x, y, w, h, rot, sc, a = 1, lift = 0) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
    ctx.fillStyle = `rgba(5,8,30,${0.3 + 0.2 * lift})`; RR(ctx, -w / 2 + 8 + lift * 10, -h / 2 + 10 + lift * 14, w, h, 12); ctx.fill();
    ctx.fillStyle = "#FFF4C8"; RR(ctx, -w / 2, -h / 2, w, h, 12); ctx.fill(); ctx.strokeStyle = "#E9B949"; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = "rgba(255,214,74,0.55)"; RR(ctx, -46, -h / 2 - 14, 92, 28, 6); ctx.fill();   // selotip
    STK_LINES.forEach((s, i) => ftxt(ctx, s, -w / 2 + 28, -h / 2 + 70 + i * 56, `800 44px ${SERIF}`, "#2A2638"));
    ctx.fillStyle = "#C9504A"; ctx.fillRect(-w / 2 + 28, h / 2 - 36, 60, 4);
    ctx.restore();
  }
  function cvSheet(ctx, x, y, w, h, rot, sc, a) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
    ctx.fillStyle = "rgba(5,8,30,0.35)"; RR(ctx, -w / 2 + 10, -h / 2 + 12, w, h, 10); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; RR(ctx, -w / 2, -h / 2, w, h, 10); ctx.fill();
    ctx.fillStyle = "#3E63C9"; RR(ctx, -w / 2, -h / 2, w, 20, 10); ctx.fill(); ctx.fillRect(-w / 2, -h / 2 + 10, w, 10);
    if (sc >= 0.92) { ftxt(ctx, "Riwayat", -w / 2 + 26, -h / 2 + 76, `900 44px ${FONT}`, "#1F2A5C"); ftxt(ctx, "hidup", -w / 2 + 26, -h / 2 + 124, `900 44px ${FONT}`, "#1F2A5C"); }
    else { ctx.fillStyle = "#1F2A5C"; RR(ctx, -w / 2 + 26, -h / 2 + 44, 150, 30, 8); ctx.fill(); RR(ctx, -w / 2 + 26, -h / 2 + 92, 110, 30, 8); ctx.fill(); }   // kecil: judul jadi balok
    // ikon orang generik (bukan wajah)
    const ax = w / 2 - 62, ay = -h / 2 + 92; ctx.fillStyle = "#DCE4FA"; ctx.beginPath(); ctx.arc(ax, ay, 38, 0, TAU); ctx.fill();
    ctx.fillStyle = "#8EA0D8"; ctx.beginPath(); ctx.arc(ax, ay - 8, 13, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(ax, ay + 22, 22, 13, 0, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = "rgba(60,70,110,0.35)"; for (let k = 0; k < 5; k++) { RR(ctx, -w / 2 + 26, -h / 2 + 160 + k * 26, w - 52 - (k % 2) * 60, 10, 5); ctx.fill(); }
    ctx.restore();
  }
  function heavyBook(ctx, x, y, w, h, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = "#8E2F2B"; RR(ctx, -w / 2 - 5, -h / 2, w + 5, h, 6); ctx.fill();
    ctx.fillStyle = "#E8665F"; RR(ctx, -w / 2, -h / 2, w, h, 6); ctx.fill();
    ctx.fillStyle = "#F6EEDC"; ctx.fillRect(w / 2 - 4, -h / 2 + 5, 6, h - 10);
    ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.fillRect(-w / 2 + 8, -h / 2 + 12, w - 16, 4);
    ctx.fillStyle = "rgba(16,20,56,0.82)"; ctx.beginPath(); ctx.arc(0, 2, w * 0.3, 0, TAU); ctx.fill();
    ftxt(ctx, "1", 0, 2 + w * 0.15, `900 ${Math.round(w * 0.42)}px ${FONT}`, "#FFFFFF", { align: "center" });
    ctx.restore();
  }
  // tanggalan kecil: bulan-bulan berganti saat "berbulan-bulan"
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"];
  function monthCal(ctx, x, y, l, t0, a) {
    if (a <= 0.01) return; const k = clamp(Math.floor((l - t0) / 0.22), 0, MONTHS.length - 1), f = (l - t0) / 0.22 - Math.floor((l - t0) / 0.22);
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
    ctx.fillStyle = "rgba(5,8,30,0.35)"; RR(ctx, -88, -84, 186, 186, 16); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; RR(ctx, -94, -92, 188, 186, 16); ctx.fill();
    ctx.fillStyle = "#E8665F"; RR(ctx, -94, -92, 188, 54, 16); ctx.fill(); ctx.fillRect(-94, -60, 188, 22);
    ctx.fillStyle = "#3A2F5A"; [-46, 46].forEach(rx => { ctx.beginPath(); ctx.arc(rx, -92, 9, 0, TAU); ctx.fill(); });
    ftxt(ctx, MONTHS[k], 0, 40, `900 64px ${FONT}`, "#1F2A5C", { align: "center" });
    // lembar sobek (tanpa tulisan) terbang
    if (l > t0 && l < t0 + 0.22 * (MONTHS.length - 1) && f < 0.8) { const u = f / 0.8; ctx.save(); ctx.translate(30 * u, -40 - 90 * u); ctx.rotate(0.6 * u); ctx.globalAlpha *= 1 - u; ctx.fillStyle = "#F4F4F8"; RR(ctx, -90, -36, 180, 130, 10); ctx.fill(); ctx.restore(); }
    ctx.restore();
  }
  function cam2(l, T) { return D.path([[0, 1395, 252, 1.55], [T.sulit + 0.5, 1385, 258, 1.6], [T.bill + 0.55, 960, 520, 1.0], [T.dur + 0.6, 960, 528, 1.03]], l); }
  const BIP_FG = [800, 742, 210];
  S.b6_2 = function (ctx, b, l, t, TL) {
    const T = T2(b), c = drift(cam2(l, T), t);
    // urutan: latar meredup dulu (2,2–2,5), lalu jilid 1 membesar jadi sampul (di depan Bip), lalu kolom koran masuk dari kanan, padat
    const D0 = T.sulitE + 0.04, G0 = T.sulitE + 0.29;
    const dim = ramp(l, D0, 0.3); WTA = 1 - dim; MASK = null;
    const pullUp = ramp(l, T.buku - 0.05, 0.4), pullOver = ramp(l, T.buku + 0.4, 0.45), hold = pullOver >= 1;
    const go = ramp(l, G0, 0.95);   // dari rak ke latar depan
    ctx.save(); camT(ctx, c);
    wall(ctx, t);
    lamp(ctx, t);
    shelf(ctx, t, { out1: pullUp > 0 ? 1 : 0 });
    desk(ctx);
    book(ctx, t, { err: 1, circle: 1 });
    letters(ctx, 99, 0);
    monitor(ctx, t, l, { off: 1, frost: 1, zeroK: 1, yearOn: true, yk: [1, 1, 1, 1] });
    lights(ctx);
    dust(ctx, t, 0.7, 1300, 330);
    ctx.restore(); WTA = 1;
    // latar meredup saat kolom koran datang
    // latar "mundur": kabut biru setinggi kecerahan dinding (kontras turun, layar tidak jadi gelap)
    grade(ctx, 0.12 * dim, "#2A3470");
    if (dim > 0) { ctx.save(); ctx.fillStyle = `rgba(58,72,140,${0.42 * dim})`; ctx.fillRect(0, 0, W, HH); ctx.restore(); }

    // ---------- latar depan (koordinat layar) ----------
    const b1 = wordBoxes(ctx, S1), b2 = wordBoxes(ctx, S2), t1 = wordTimes(b, S1), t2 = wordTimes(b, S2);
    const colIn = eout(ramp(l, T.bill - 0.06, 0.4)), colDX = (1 - colIn) * (W - COL.x + 60), bob = Math.sin(t * 0.9) * 3;
    const lift = ramp(l, T.memb1E + 0.12, 0.25), flyU = ramp(l, T.memb1E + 0.25, 0.85), cut = lift;
    if (colIn > 0) { ctx.save(); ctx.translate(colDX, bob); ctx.rotate(0.004 * Math.sin(t * 0.6)); column(ctx, l, t, T, b, { by: ramp(l, T.bill + 0.1, 0.55), tr: ramp(l, T.bill + 0.75, 0.3), b1, b2, t1, t2, cut }); ctx.restore(); }
    // sampul: jilid 1 di tangan Bip membesar menjadi sampul
    const bipW = toS(c, 1080, 140), bipS = 150 * c.z;
    const g2 = eio(go);
    const bx = lerp(bipW[0], BIP_FG[0], g2), by = lerp(bipW[1], BIP_FG[1], g2) + (l > T.sulit - 0.1 && go <= 0 ? 6 * Math.abs(Math.sin((l - T.sulit) * 9)) : 0), bs = lerp(bipS, BIP_FG[2], g2);
    const hp0 = [toS(c, 1080, 140)[0], toS(c, 1080, 140)[1] + 0.3 * bipS], cvU = eio(ramp(l, G0, 0.75)), cvS0 = bipS * 0.58 / CV.h;
    const drawCover = () => { if (cvU > 0) cover(ctx, lerp(hp0[0], CV.x, cvU), lerp(hp0[1], CV.y + Math.sin(t * 0.7) * 2, cvU), CV.w, CV.h, t, 1, lerp(cvS0, 1, cvU)); };
    // tanggalan bulan
    monthCal(ctx, 800, 390, l, D.at(b, "berbulan-bulan"), win(l, D.at(b, "berbulan-bulan") - 0.3, T.memb1E + 0.15, 0.3));
    // riwayat hidup
    const cvA = ramp(l, T.riwayat - 0.05, 0.25), cvF = ramp(l, T.kepada + 0.05, 0.7);
    // mendarat di pojok kanan atas kolom, di samping nama penulis (nama tetap terbaca)
    if (cvA > 0) { const k = popK(l, T.riwayat - 0.05), u = eio(cvF); cvSheet(ctx, qb(800, 1250, COL.x + COL.w - 92, u), qb(398, -60, COL.y + 112 + bob, u), 300, 320, lerp(-0.04, 0.14, u), k * lerp(1, 0.4, eout(cvF)), 1); }   // melengkung tinggi di atas nama, mengecil cepat
    // Bip
    let o;
    if (l < T.buku - 0.05) o = { pose: "diam", t, mood: "happy", look: [1, -0.3] };
    else if (!hold) o = { pose: "diam", t, mood: "think", look: [1, -0.6] };
    else if (go <= 0) o = { pose: "pegang", t, mood: l > T.sulit - 0.15 ? "sad" : "think", sweat: l > T.sulit - 0.1,
      prop: (cx2, px, py, s) => heavyBook(cx2, px, py + 4 * Math.sin(l * 7), s * 0.42, s * 0.58, -0.08) };
    else if (go < 1) o = { pose: "jalan", t, dir: 1 };
    else {
      const cw1 = curWord(l, b1, t1), cw2 = curWord(l, b2, t2), on1 = l > t1[0][0].a - 0.1 && l < T.memb1E + 0.1, on2 = l > t2[0][0].a - 0.1 && l < T.riwayat - 0.1;
      if (on1 && cw1) o = { pose: "tunjuk", t, target: [cw1[0], cw1[1]], mood: "think" };
      else if (on2 && cw2) o = { pose: "tunjuk", t, target: [cw2[0], cw2[1]], mood: "happy" };
      else if (l >= T.memb1E + 0.1 && l < T.ia2) o = { pose: "diam", t, mood: "wow", look: [-1, -0.3] };
      else if (l >= T.riwayat - 0.1 && l < T.kepada + 0.05) o = { pose: "diam", t, mood: "wow", look: [0, -1] };
      else if (l >= T.kepada + 0.05) o = { pose: "diam", t, mood: "happy", look: [1, -0.6], wave: l };
      else o = { pose: "diam", t, mood: "happy", look: [1, -0.4] };
    }
    KB.draw(ctx, bx, by, bs, o);
    drawCover();   // sampul di depan Bip: jilid 1 tidak hilang di balik badannya
    // stiker kalimat 1: terlepas dari kolom, melayang, menempel di sampul
    if (flyU > 0) {
      const sx0 = TX0 + 320, sy0 = 462, u = eio(flyU);
      const x = qb(sx0, 800, STK.x, u), y = qb(sy0, 760, STK.y, u), rot = lerp(0.05, STK.rot, u), sc = lerp(0.91, 1, u);
      sticker(ctx, x, y, STK.w, STK.h, rot, sc * (flyU >= 1 ? lerp(1.04, 1, clamp((l - T.memb1E - 1.1) / 0.25)) : 1), 1, 1 - u);
    }
    // jilid 1 ditarik keluar dari rak (di atas Bip supaya tidak hilang di balik badannya)
    if (pullUp > 0 && !hold) { const sx = SHELF.bx + SHELF.bw / 2, sy = SHELF.y - SHELF.bh / 2, hx = 1080, hy = 140 + 0.3 * 150;
      const x = lerp(sx, hx, eio(pullOver)), y = lerp(sy - 70 * eio(pullUp), hy, eio(pullOver)), sc = lerp(1, 0.62, eio(pullOver));
      ctx.save(); camT(ctx, c); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(-0.25 * eio(pullOver)); spine(ctx, -SHELF.bw / 2, SHELF.bh / 2, SHELF.bw, SHELF.bh, BOOKC[0], "1", t); ctx.restore(); }

    D.post(cx => {
      const ps = pop(l, T.sulit - 0.05); tag(cx, "terkenal sulit", bipW[0] + 40, bipW[1] - 0.68 * bipS - 70, ps.a * (1 - ramp(l, D0, 0.3)), { sp: ps.sp, col: P.pink });
      const pk = pop(l, T.kolom); tag(cx, "kolom koran", COL.x + COL.w / 2 - 80 + colDX, COL.y - 6 + bob, pk.a, { sp: pk.sp, col: P.blue, size: 46 });
    });
  };

  K.SCENES.d04_b6 = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); };
  K.SCENES.d04_b6.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b6 = TL => {
    const b1 = TL.beats.find(x => x.id === "b6_1"), b2 = TL.beats.find(x => x.id === "b6_2"); const out = [];
    if (b1) {
      const T = T1(b1), A = s => +(b1.start + s).toFixed(3);
      out.push([A(0.3), "whoosh", 0.4],
        K.sfxAt(TL, "b6_1", "berhenti", 0.0, "clack", 0.6),
        K.sfxAt(TL, "b6_1", "puluh.", 0.0, "pop", 0.45),
        K.sfxAt(TL, "b6_1", "kesalahan", 0.0, "pop", 0.5),
        K.sfxAt(TL, "b6_1", "dua koma", 0.0, "pop", 0.55),
        K.sfxAt(TL, "b6_1", "heksadesimal.", 0.0, "shimmer", 0.45),
        K.sfxAt(TL, "b6_1", "Dulu,", 0.55, "whoosh", 0.45),
        K.sfxAt(TL, "b6_1", "banyak", 0.0, "pop", 0.45),
        K.sfxAt(TL, "b6_1", "membingkainya.", 0.05, "clack", 0.5),
        K.sfxAt(TL, "b6_1", "sertifikat", -0.4, "shimmer", 0.5),
        [A(T.khayalE + 0.98), "clack", 0.5]);
    }
    if (b2) {
      const T = T2(b2), A = s => +(b2.start + s).toFixed(3);
      out.push(K.sfxAt(TL, "b6_2", "sulit.", 0.0, "boom", 0.4), K.sfxAt(TL, "b6_2", "Bill", -0.06, "whoosh", 0.5),
        K.sfxAt(TL, "b6_2", "berbulan-bulan", 0.0, "clack", 0.35), [A(T.memb1E + 1.1), "clack", 0.5],
        K.sfxAt(TL, "b6_2", "riwayat", -0.05, "pop", 0.5));
    }
    return out.filter(Boolean);
  };
})(typeof window !== "undefined" ? window : globalThis);
