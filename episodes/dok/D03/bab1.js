/* D03 bab 1: "Suaramu adalah sidik jari" (b1_1–b1_4).
   Metafora utama bab: pola suara (spektrogram) = sidik jari. Satu dunia yang bersambung:
   b1_1 penampang kepala di studio → b1_2 empat tokoh di studio yang sama (bentuk tubuh beda, suara beda) →
   b1_3 gelembung gelombang tumbuh jadi spektrogram, berubah jadi sidik jari (Bip memeriksa dengan kaca pembesar) lalu kembali →
   b1_4 panel "Anak" dibawa ke ingatan Bu Rina; anak memanggil dari balik dinding, Bu Rina langsung mengenali.
   Profil suara tetap: ibu seed 11, anak seed 23 (dipakai bab lain). Kamera sendiri (noCam) supaya gerak bersambung antarbeat. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const P = D.P, H = K.helpers, L = KIT.layar, O = KIT.orang, LT = KIT.latar, B = KIT.bipkit;
  const { clamp, lerp, sm, eio, eout, spring } = D;
  const TAU = Math.PI * 2;
  const IBU = Object.assign({}, L.SUARA.ibu, { seed: 11 }), ANAK = Object.assign({}, L.SUARA.anak, { seed: 23 }), AYAH = Object.assign({}, L.SUARA.ayah);
  const at = (b, s, o = 0) => D.at(b, s, o);
  const flap = (l, sp = 23) => 0.5 + 0.5 * Math.sin(l * sp);
  const speaking = (b, l) => (b.words || []).some(w => l >= w[1] - 0.04 && l <= w[2] + 0.02);
  const mkCam = (fx, fy, z) => ({ fx, fy, z, X: x => (x - fx) * z + 960, Y: y => (y - fy) * z + 540, S: (x, y) => [(x - fx) * z + 960, (y - fy) * z + 540],
    apply(c) { c.translate(960, 540); c.scale(z, z); c.translate(-fx, -fy); } });
  const camAt = (keys, l) => { const p = D.path(keys, l); return mkCam(p.x, p.y, p.z); };
  const beatOf = (TL, id) => TL.beats.find(x => x.id === id);

  // ---------- label (layar, sesudah vignette) dengan garis penunjuk ----------
  function tag(s, x, y, u, o = {}) {
    if (u <= 0) return; const a = clamp(u / 0.18) * (o.a == null ? 1 : o.a); if (a <= 0.01) return;
    D.post(c => {
      c.globalAlpha = a; const col = o.col || P.amber;
      if (o.to) { const p = clamp(u / 0.4), [tx, ty] = o.to, ex = lerp(x, tx, eout(p)), ey = lerp(y, ty, eout(p));
        c.strokeStyle = "rgba(10,18,52,0.55)"; c.lineWidth = 10; c.lineCap = "round"; c.beginPath(); c.moveTo(x, y); c.lineTo(ex, ey); c.stroke();
        c.strokeStyle = col; c.lineWidth = 5; c.beginPath(); c.moveTo(x, y); c.lineTo(ex, ey); c.stroke();
        if (p > 0.85) { c.fillStyle = "#FFFFFF"; c.beginPath(); c.arc(tx, ty, 12, 0, TAU); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(tx, ty, 7.5, 0, TAU); c.fill(); } }
      const sp = spring(u, 12, 0.5), k = lerp(0.55, 1, sp); c.translate(x, y); c.scale(k, k);
      D.label(c, s, 0, 0, { size: o.size || 48, col });
    });
  }

  // panah pendek (layar)
  function arrow(c, x0, y0, x1, y1, col, lw = 7) {
    const a = Math.atan2(y1 - y0, x1 - x0), hl = lw * 3.2;
    c.lineCap = "round"; c.strokeStyle = "rgba(10,18,52,0.55)"; c.lineWidth = lw + 6; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
    c.strokeStyle = col; c.lineWidth = lw; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - Math.cos(a) * hl * 0.6, y1 - Math.sin(a) * hl * 0.6); c.stroke();
    c.fillStyle = col; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - Math.cos(a - 0.5) * hl, y1 - Math.sin(a - 0.5) * hl); c.lineTo(x1 - Math.cos(a + 0.5) * hl, y1 - Math.sin(a + 0.5) * hl); c.closePath(); c.fill();
  }

  // ---------- tokoh & gelembung bersama (b1_1 menyusut ke gelembung Anak, b1_2, b1_3) ----------
  const FLOOR = 860;
  const PPL = [
    { k: "adik", x: 315, h: 285, col: "#FFD38A", lab: "tinggi", seed: 2 },
    { k: "ayah", x: 745, h: 400, col: "#5AA9FF", lab: "serak", prof: AYAH, seed: 21 },
    { k: "anakRina", x: 1175, h: 385, col: "#3FD8C8", lab: "cepat", prof: ANAK, seed: 23 },
    { k: "buRina", x: 1605, h: 395, col: "#FF7FA0", lab: "memanjang", prof: IBU, seed: 11 },
  ];
  const NAMA = { ayah: "Ayah", anakRina: "Anak", buRina: "Ibu" };
  const HEADTOP = { adik: 572, ayah: 456, anakRina: 472, buRina: 452 };   // puncak kepala (y dunia) tiap tokoh
  // penampang kepala mini: [skala, pipih-x] mengikuti tubuh masing-masing
  const TRACT_G = { adik: [0.171, 1.0], ayah: [0.276, 1.1], anakRina: [0.229, 0.97], buRina: [0.239, 0.93] };
  // gelembung sebesar tubuhnya (adik ×0.75 … ayah ×1.15), ±70 px di atas kepala, ekor ±50 px
  const GEO = {};
  PPL.forEach(p => { const k = 0.75 + (p.h - 285) / 115 * 0.4, w = 340 * k, h = 150 * k, top = HEADTOP[p.k], cy = top - 68 - h / 2, sc = TRACT_G[p.k][0];
    GEO[p.k] = { k, w, h, cy, top, sc, sx: TRACT_G[p.k][1], gy: -h / 2 + 6 + 420 * sc, labY: cy - h / 2 - 50 }; });
  const PR = 170, PCY = 285;   // panel spektrogram (r sidik jari = PR)
  const SCROLL = t => t * 0.32;
  // salinan plan() dari layar.js (DUR 12 s): jadwal suku kata, untuk melingkari ciri khas tiap suara di panel
  const PLANS = {};
  function planOf(pr) {
    const key = pr.seed + "|" + pr.tempo + "|" + (pr.jeda || 1); if (PLANS[key]) return PLANS[key];
    const r = D.rng(pr.seed * 7919 + 13), tempo = pr.tempo || 4.2, jd = pr.jeda || 1, S = []; let t = 0.3, g = 0;
    while (t < 12 - 0.9) {
      const n = 3 + Math.floor(r() * 6); r();
      for (let k = 0; k < n; k++) { const d = (1 / tempo) * (0.6 + 0.8 * r()); if (t + d > 12 - 0.35) break; r(); r(); r(); r(); r(); S.push({ t0: t, t1: t + d, g, last: false }); t += d + 0.015; }
      if (S.length) S[S.length - 1].last = true; g++; t += (0.16 + r() * 0.5) * jd;
    }
    return (PLANS[key] = S);
  }
  const relOf = (tau, sc) => ((tau - sc) % 12 + 12) % 12;   // posisi (detik) di jendela panel 3,5 s

  // =====================================================================================
  // b1_1  penampang kepala: pita suara bergetar, dibentuk mulut/hidung/lidah/bibir
  // =====================================================================================
  const HP = {
    skin: new Path2D("M540 1110 C540 900 560 760 545 680 C470 600 455 470 480 360 C505 200 640 105 800 100 C950 95 1050 190 1065 300 C1070 330 1062 352 1058 365 C1080 400 1115 440 1122 468 C1126 482 1110 492 1090 492 C1088 505 1098 515 1096 528 C1086 540 1080 545 1078 548 C1092 556 1095 572 1084 584 C1076 600 1082 625 1072 645 C1060 668 1010 678 960 676 C925 676 905 700 900 740 C905 760 915 780 905 800 C900 900 905 1000 910 1110 Z"),
    hair: new Path2D("M462 600 C420 450 450 260 560 165 C660 80 840 62 950 125 C1020 165 1058 230 1066 300 C1030 262 975 238 915 238 C840 240 780 272 736 322 C700 362 660 392 628 436 C600 476 572 540 552 640 Z"),
    shirt: new Path2D("M300 1110 C330 1010 430 960 560 950 C640 990 820 990 905 950 C1030 960 1130 1010 1170 1110 Z"),
    nasal: new Path2D("M800 405 C860 375 1000 380 1072 446 C1088 460 1094 476 1088 484 C1060 470 1000 462 940 460 C880 458 840 462 822 462 C800 455 794 425 800 405 Z"),
    oral: new Path2D("M832 490 C900 478 1000 484 1068 530 L1080 548 L1068 563 C1000 566 930 582 870 602 C846 598 832 540 832 490 Z"),
    phar: new Path2D("M772 412 C800 398 828 404 842 432 C838 500 836 620 834 762 L770 762 C768 620 770 500 772 412 Z"),
    trach: new Path2D("M770 760 L834 760 L838 1110 L766 1110 Z"),
    tongue: new Path2D("M846 612 C846 540 920 500 990 508 C1035 512 1060 530 1064 548 C1040 556 1000 552 975 566 C935 592 900 640 862 664 C850 650 846 632 846 612 Z"),
  };
  const SKIN = O.SKIN[2], TRACT = "#5B2150";
  const PARTS = { mulut: [990, 528], hidung: [1010, 432], lidah: [935, 540], bibir: [1096, 552], pita: [803, 771] };
  // jalur denyut getaran: dari pita suara naik ke tekak lalu bercabang ke mulut dan hidung
  const PULSE = { up: [[803, 770], [804, 640], [806, 520], [812, 455]], mulut: [[812, 455], [880, 515], [990, 528], [1092, 550]], hidung: [[812, 455], [880, 425], [990, 420], [1086, 478]] };
  function along(pts, u) { const segs = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); tot += d; }
    let s = clamp(u) * tot; for (let i = 0; i < segs.length; i++) { if (s <= segs[i]) { const f = s / segs[i]; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } s -= segs[i]; } return pts[pts.length - 1]; }

  function drawHead(ctx, t, st) {
    // bahu & baju
    ctx.fillStyle = "#2FA79A"; ctx.fill(HP.shirt); ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(0, 0, 0, 0);
    // kulit
    ctx.save(); ctx.shadowColor = "rgba(10,14,50,0.35)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; ctx.fillStyle = SKIN; ctx.fill(HP.skin); ctx.restore();
    ctx.save(); ctx.clip(HP.skin);
    const sg = ctx.createLinearGradient(480, 0, 1120, 0); sg.addColorStop(0, "rgba(40,20,60,0.22)"); sg.addColorStop(0.6, "rgba(255,255,255,0)"); sg.addColorStop(1, "rgba(255,230,200,0.18)");
    ctx.fillStyle = sg; ctx.fillRect(400, 80, 800, 1040);
    ctx.fillStyle = "#2B2440"; ctx.fill(HP.hair); ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.beginPath(); ctx.ellipse(760, 150, 140, 34, -0.15, 0, TAU); ctx.fill();
    // telinga
    ctx.fillStyle = "#B97A55"; ctx.beginPath(); ctx.ellipse(686, 438, 40, 62, 0.1, 0, TAU); ctx.fill(); ctx.strokeStyle = "#8E5A3E"; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(690, 438, 24, -1.2, 1.6); ctx.stroke();
    ctx.restore();
    // alis & mata (berkedip)
    const blink = ((t + 0.7) % 3.9) > 3.76;
    ctx.strokeStyle = "#2B2440"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(962, 292); ctx.quadraticCurveTo(995, 278, 1030, 290); ctx.stroke();
    if (blink) { ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(990, 326); ctx.lineTo(1018, 326); ctx.stroke(); }
    else { ctx.fillStyle = "#1E1A33"; ctx.beginPath(); ctx.ellipse(1004, 324, 11, 15, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(1008, 318, 4, 0, TAU); ctx.fill(); }
    // jendela penampang: saluran suara
    const hl = st.hl || {};
    ctx.save();
    const tg = ctx.createLinearGradient(760, 380, 1080, 760); tg.addColorStop(0, "#6E2A62"); tg.addColorStop(1, "#4A1B47");
    ctx.fillStyle = tg; [HP.nasal, HP.oral, HP.phar, HP.trach].forEach(p => ctx.fill(p));
    // lapisan sorotan per bagian
    const glowFill = (p, col, a) => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fill(p); ctx.restore(); };
    glowFill(HP.nasal, P.violet, 0.75 * (hl.hidung || 0)); glowFill(HP.oral, P.teal, 0.6 * (hl.mulut || 0));
    // langit-langit (tulang), cincin trakea
    ctx.strokeStyle = "#F6D9C6"; ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(838, 474); ctx.bezierCurveTo(900, 468, 1000, 472, 1058, 500); ctx.stroke();
    ctx.strokeStyle = "rgba(255,190,210,0.35)"; ctx.lineWidth = 6; for (let y = 820; y < 1100; y += 42) { ctx.beginPath(); ctx.moveTo(772, y); ctx.quadraticCurveTo(803, y + 12, 834, y); ctx.stroke(); }
    // lidah (ikut bergerak saat bicara)
    ctx.save(); ctx.translate(0, -8 * (st.mouth || 0)); ctx.fillStyle = "#FF7F9C"; ctx.fill(HP.tongue);
    ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.beginPath(); ctx.ellipse(960, 522, 46, 9, -0.05, 0, TAU); ctx.fill();
    if ((hl.lidah || 0) > 0.01) { ctx.globalAlpha = hl.lidah; ctx.strokeStyle = "#FFE3EC"; ctx.lineWidth = 7; ctx.stroke(HP.tongue); D.glow(ctx, 940, 560, 120, P.pink, 0.5 * hl.lidah); }
    ctx.restore();
    // garis tepi saluran
    ctx.strokeStyle = "rgba(255,170,200,0.55)"; ctx.lineWidth = 4; [HP.nasal, HP.oral, HP.phar].forEach(p => ctx.stroke(p));
    if ((hl.hidung || 0) > 0.01) { ctx.save(); ctx.globalAlpha = hl.hidung; ctx.strokeStyle = "#E3DBFF"; ctx.lineWidth = 7; ctx.stroke(HP.nasal); ctx.restore(); }
    if ((hl.mulut || 0) > 0.01) { ctx.save(); ctx.globalAlpha = hl.mulut; ctx.strokeStyle = "#C9FFF6"; ctx.lineWidth = 7; ctx.stroke(HP.oral); ctx.restore(); }
    // pita suara (dua lipatan yang membuka-menutup)
    const vib = st.vib || 0, gap = 2 + vib * 5 * Math.abs(Math.sin(t * 40));
    D.glow(ctx, 803, 771, 70 + 30 * vib, P.amber, 0.25 + 0.6 * vib * (hl.pita == null ? 1 : 0.6 + 0.4 * hl.pita));
    ctx.fillStyle = "#FFC9D6"; ctx.beginPath(); ctx.moveTo(834, 758); ctx.lineTo(834, 784); ctx.lineTo(803 + gap, 771 + vib * 2 * Math.sin(t * 40)); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(770, 758); ctx.lineTo(770, 784); ctx.lineTo(803 - gap, 771 - vib * 2 * Math.sin(t * 40)); ctx.closePath(); ctx.fill();
    if (vib > 0.05) { ctx.strokeStyle = D.hexA(P.amber, 0.8 * vib); ctx.lineWidth = 4; for (let k = 0; k < 3; k++) { const ph = (t * 1.8 + k / 3) % 1; ctx.globalAlpha = (1 - ph) * vib; ctx.beginPath(); ctx.arc(803, 771, 22 + ph * 70, 0, TAU); ctx.stroke(); } ctx.globalAlpha = 1; }
    ctx.restore();
    // bibir dan bukaan mulut
    const m = st.mouth || 0;
    ctx.fillStyle = "#2A0E28"; ctx.beginPath(); ctx.ellipse(1083, 549, 9, 3 + 13 * m, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.clip(HP.skin); ctx.fillStyle = "#C9667A"; ctx.beginPath(); ctx.ellipse(1086, 526 - 3 * m, 16, 17, 0.25, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(1080, 570 + 4 * m, 16, 17, -0.25, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.beginPath(); ctx.ellipse(1090, 566 + 4 * m, 6, 3, -0.3, 0, TAU); ctx.fill(); ctx.restore();
    if ((hl.bibir || 0) > 0.01) { D.glow(ctx, 1092, 550, 110, P.amber, 0.7 * hl.bibir); ctx.save(); ctx.globalAlpha = hl.bibir; ctx.strokeStyle = "#FFE2A8"; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(1086, 526 - 3 * m, 15, 16, 0.25, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.ellipse(1080, 570 + 4 * m, 15, 16, -0.25, 0, TAU); ctx.stroke(); ctx.restore(); }
    // hidung: lubang hidung
    ctx.fillStyle = "#7B4630"; ctx.beginPath(); ctx.ellipse(1098, 484, 10, 5, 0.2, 0, TAU); ctx.fill();
  }
  // busur gelombang suara keluar dari mulut
  function soundArcs(ctx, x, y, t, amp, opt = {}) {
    if (amp <= 0.01) return; const n = opt.n || 6, reach = opt.reach || 640, spread = opt.spread || 0.55, dir = opt.dir || 0;
    ctx.save(); ctx.lineCap = "round";
    for (let k = 0; k < n; k++) { const ph = (t * (opt.speed || 0.9) + k / n) % 1, r = 40 + ph * reach, a = Math.sin(Math.PI * Math.min(1, ph * 1.4)) * (1 - ph) * amp;
      if (a <= 0.01) continue; const col = (opt.cols || [P.teal, P.warm])[k % 2];
      ctx.strokeStyle = D.hexA(col, 0.25 * a); ctx.lineWidth = 26 * (1 - ph * 0.5); ctx.beginPath(); ctx.arc(x, y, r, dir - spread, dir + spread); ctx.stroke();
      ctx.strokeStyle = D.hexA(col, 0.95 * a); ctx.lineWidth = 9 * (1 - ph * 0.5); ctx.beginPath(); ctx.arc(x, y, r, dir - spread, dir + spread); ctx.stroke(); }
    ctx.restore();
  }
  // isi lingkaran pembesaran: pita suara dilihat dari atas, bergetar cepat
  function glottis(ctx, cx, cy, r, t, vib) {
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
    const bg = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r); bg.addColorStop(0, "#E98AA2"); bg.addColorStop(1, "#7A2C5E"); ctx.fillStyle = bg; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    // dinding tekak (cincin lembut)
    ctx.strokeStyle = "rgba(255,210,225,0.35)"; ctx.lineWidth = 10; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.arc(cx, cy, r * (0.3 + k * 0.2), 0, TAU); ctx.stroke(); }
    const fold = (o, a) => { ctx.save(); ctx.globalAlpha *= a; const L2 = r * 0.7;
      for (const s of [-1, 1]) { ctx.fillStyle = "#FFE6EC"; ctx.beginPath(); ctx.moveTo(cx - r * 0.05 * s, cy - L2 * 0.62); ctx.quadraticCurveTo(cx + s * (r * 0.42 + o), cy, cx + s * (r * 0.06 + o * 0.25), cy + L2 * 0.62);
        ctx.quadraticCurveTo(cx + s * (r * 0.62), cy, cx + s * r * 0.3, cy - L2 * 0.62); ctx.closePath(); ctx.fill(); }
      ctx.restore(); };
    // celah (gelap) lalu lipatan; bayangan fase sebelumnya = kesan sangat cepat
    for (let k = 3; k >= 0; k--) { const tt = t - k * 0.012, o = r * 0.05 + vib * r * 0.13 * Math.abs(Math.sin(tt * 26));
      if (k === 0) { ctx.fillStyle = "#2A0A26"; ctx.beginPath(); ctx.ellipse(cx, cy, Math.max(3, o * 0.9), r * 0.42, 0, 0, TAU); ctx.fill(); }
      fold(o, k === 0 ? 1 : 0.18); }
    ctx.restore();
    // bingkai + garis kecepatan berputar
    ctx.save(); ctx.lineWidth = 12; ctx.strokeStyle = "#FFF6E6"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = D.hexA(P.amber, 0.9); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, r + 12, 0, TAU); ctx.stroke();
    ctx.strokeStyle = D.hexA(P.amber, 0.85 * vib); ctx.lineWidth = 8; ctx.lineCap = "round";
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU + t * 5.5; ctx.beginPath(); ctx.arc(cx, cy, r + 30, a, a + 0.18); ctx.stroke(); }
    ctx.restore();
  }

  function scene11(ctx, b, l, t) {
    const dur = b.dur, z = 1 + 0.045 * eio(l / dur);
    // detik terakhir: kepala menyusut tepat ke penampang mini di gelembung Anak (b1_2), Bip berjalan ke tempatnya di b1_2
    const G = GEO.anakRina, po = eio(clamp((l - (dur - 0.9)) / 0.9)), pc = eio(clamp((l - (dur - 0.65)) / 0.65));
    let cm = mkCam(860, 560, z);
    if (po > 0) { const A0 = cm.S(810, 520), zz = Math.exp(lerp(Math.log(z), Math.log(G.sc), po)), ax = lerp(A0[0], PPL[2].x, po), ay = lerp(A0[1], G.cy + G.gy, po);
      cm = mkCam(810 - (ax - 960) / zz, 520 - (ay - 540) / zz, zz); }
    LT.studio(ctx, t, { warna: "biru", floorY: 800, px: -0.15 + 0.1 * eio(l / dur) });
    const bubR = [lerp(-40, PPL[2].x - G.w / 2, pc), lerp(-40, G.cy - G.h / 2, pc), lerp(2000, G.w, pc), lerp(1160, G.h, pc)];
    if (pc > 0) { ctx.save(); ctx.globalAlpha = pc; ctx.fillStyle = "rgba(14,22,62,0.9)"; H.rr(ctx, ...bubR, lerp(0, 26, pc)); ctx.fill(); ctx.restore();
      ctx.save(); H.rr(ctx, ...bubR, lerp(0, 26, pc)); ctx.clip(); }
    const T = { pita: at(b, "pita suara"), getar: at(b, "bergetar"), ratus: at(b, "ratusan"), getaran: at(b, "Getaran itu"), mulut: at(b, "mulut"), hidung: at(b, "hidung"), lidah: at(b, "lidah"), bibir: at(b, "bibirmu") };
    const talk = speaking(b, l) ? 0.35 + 0.65 * Math.abs(Math.sin(l * 11.5)) : 0;
    const vib = clamp((l - T.pita + 0.1) / 0.5) * (0.55 + 0.45 * clamp((l - T.getar) / 0.4)) + (l < T.pita ? 0.35 * talk : 0);
    const hlOf = (t0, next) => { const u = clamp((l - t0) / 0.3); return next == null ? u : u * (1 - 0.55 * clamp((l - next) / 0.4)); };
    const hl = { mulut: hlOf(T.mulut, T.hidung), hidung: hlOf(T.hidung, T.lidah), lidah: hlOf(T.lidah, T.bibir), bibir: hlOf(T.bibir), pita: clamp((l - T.pita) / 0.3) * (1 - 0.5 * clamp((l - T.getaran) / 0.5)) };
    ctx.save(); cm.apply(ctx);
    drawHead(ctx, t, { mouth: talk, vib: clamp(vib), hl });
    // denyut getaran naik dari pita suara lalu bercabang ke mulut & hidung
    const pu = (l - T.getaran) / 1.6;
    if (pu > 0 && pu < 1.9) {
      const dots = (pts, u0) => { for (let k = 0; k < 7; k++) { const u = u0 - k * 0.045; if (u < 0 || u > 1) continue; const [x, y] = along(pts, u); D.glow(ctx, x, y, 34 - k * 3, P.warm, 0.8 * (1 - k / 7)); ctx.fillStyle = D.hexA("#FFF4C8", 1 - k / 7); ctx.beginPath(); ctx.arc(x, y, 9 - k, 0, TAU); ctx.fill(); } };
      dots(PULSE.up, pu * 1.4); if (pu > 0.62) { dots(PULSE.mulut, (pu - 0.62) * 1.2); dots(PULSE.hidung, (pu - 0.62) * 1.2); }
    }
    // gelombang suara keluar dari mulut (kuat setelah "bibirmu")
    const outAmp = 0.45 * talk * (1 - clamp((l - T.bibir) / 0.3)) + clamp((l - T.bibir + 0.2) / 0.5) * 1.0;
    soundArcs(ctx, 1100, 550, t, outAmp, { reach: 760, spread: 0.5 });
    ctx.restore();
    if (pc > 0) { ctx.restore(); ctx.save(); ctx.globalAlpha = pc; ctx.strokeStyle = D.hexA(PPL[2].col, 0.9); ctx.lineWidth = 5; H.rr(ctx, ...bubR, lerp(0, 26, pc)); ctx.stroke(); ctx.restore(); }
    // lingkaran pembesaran pita suara: keluar dari tenggorokan, lalu mengecil dan pudar di tempat
    const ap = clamp((l - T.pita - 0.15) / 0.4), dis = clamp((l - T.getaran - 0.1) / 0.55), ia = ap * (1 - dis);
    if (ia > 0.01) {
      const sp = spring(l - T.pita - 0.15, 9, 0.55), [fx, fy] = cm.S(...PARTS.pita), ix = 1400, iy = 330, ir = 175 * lerp(0.3, 1, Math.min(1, sp)) * (0.6 + 0.4 * ap) * (1 - 0.55 * eio(dis));
      const cx = lerp(fx, ix, eio(ap)), cy = lerp(fy, iy, eio(ap));
      ctx.save(); ctx.globalAlpha = ia;
      // kerucut penghubung
      const ang = Math.atan2(cy - fy, cx - fx), dd = Math.hypot(cx - fx, cy - fy), off = Math.asin(Math.min(0.99, ir / Math.max(dd, ir + 1)));
      ctx.fillStyle = "rgba(255,246,230,0.13)"; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(cx + Math.cos(ang + Math.PI / 2 + off) * ir, cy + Math.sin(ang + Math.PI / 2 + off) * ir);
      ctx.lineTo(cx + Math.cos(ang - Math.PI / 2 - off) * ir, cy + Math.sin(ang - Math.PI / 2 - off) * ir); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,246,230,0.6)"; ctx.lineWidth = 3; ctx.setLineDash([10, 9]); ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(cx + Math.cos(ang + Math.PI / 2 + off) * ir, cy + Math.sin(ang + Math.PI / 2 + off) * ir);
      ctx.moveTo(fx, fy); ctx.lineTo(cx + Math.cos(ang - Math.PI / 2 - off) * ir, cy + Math.sin(ang - Math.PI / 2 - off) * ir); ctx.stroke(); ctx.setLineDash([]);
      glottis(ctx, cx, cy, ir, t, clamp((l - T.getar + 0.3) / 0.4) * 0.7 + 0.3);
      ctx.restore();
      tag("ratusan kali per detik", 1400, 575, l - T.ratus, { col: P.amber, size: 46, a: 1 - clamp((l - T.getaran - 0.1) / 0.4) });
    }
    // Bip: melambai, menunjuk pembesaran, lalu menunjuk tiap bagian yang disebut; di akhir berjalan ke tempatnya di b1_2
    const bw = eio(clamp((l - (dur - 0.95)) / 0.9)), bx = lerp(1540, 960, bw), by = lerp(790, 785, bw), bs = lerp(240, 150, bw);
    let bo = { pose: "diam", t, wave: l < T.pita - 0.3 ? l : undefined, look: [-0.7, -0.1] };
    if (bw > 0 && bw < 1) bo = { pose: "jalan", t, dir: -1 };
    else if (bw >= 1) bo = { pose: "diam", t, look: [0.6, -0.8] };
    else if (l >= T.pita - 0.2 && l < T.getaran + 0.3) bo = { pose: "tunjuk", t, target: [1400, 330] };
    else if (l >= T.mulut - 0.15) { const key = l >= T.bibir - 0.15 ? "bibir" : l >= T.lidah - 0.15 ? "lidah" : l >= T.hidung - 0.15 ? "hidung" : "mulut"; bo = { pose: "tunjuk", t, target: cm.S(...PARTS[key]) }; }
    else if (l >= T.getaran + 0.3) bo = { pose: "diam", t, look: [-0.9, 0.1], mood: "wow" };
    B.draw(ctx, bx, by, bs, bo);
    // label
    const la = 1 - clamp((l - dur + 0.9) / 0.45);   // label pudar selagi kepala menyusut (lapisan label tidak ikut transisi)
    tag("pita suara", 330, 772, l - T.pita, { col: P.amber, a: la, to: cm.S(PARTS.pita[0] - 22, PARTS.pita[1]) });
    tag("mulut", 1330, 408, l - T.mulut, { col: P.teal, a: la, to: cm.S(...PARTS.mulut) });
    tag("hidung", 1330, 286, l - T.hidung, { col: P.violet, a: la, to: cm.S(...PARTS.hidung) });
    tag("lidah", 1190, 830, l - T.lidah, { col: P.pink, a: la, to: cm.S(965, 572) });
    tag("bibir", 1350, 545, l - T.bibir, { col: P.amber, a: la, to: cm.S(PARTS.bibir[0] + 4, PARTS.bibir[1] + 4) });
  }

  // =====================================================================================
  // b1_2 – b1_3  empat tokoh di studio; gelembung gelombang → spektrogram ↔ sidik jari
  // =====================================================================================
  function bubbleWave(ctx, p, x, y, w, h, t, amp) {
    const a = Math.max(0.2, amp);
    if (p.k === "adik") L.gelombang(ctx, x, y, w, h, { t, mode: "garis", rapat: 11, amp: a, seed: 3, col: "#FFD38A", col2: "#FFFFFF", speed: 1.3, lw: 6 });
    else if (p.k === "ayah") { L.gelombang(ctx, x, y, w, h, { t, mode: "cermin", rapat: 2.5, amp: a * 0.9, seed: 7, col: "#5AA9FF", col2: "#B9C7EA", speed: 0.6 });
      // serak: bintik kasar di sepanjang gelombang
      const r = D.rng(Math.floor(t * 14) + 5); ctx.fillStyle = D.hexA("#E6EEFF", 0.85 * a); for (let i = 0; i < 70; i++) { const u = r(), yy = y + h / 2 + (r() - 0.5) * h * 0.85 * Math.sin(Math.PI * u) * a; ctx.fillRect(x + u * w, yy, 4, 4); } }
    else if (p.k === "anakRina") L.gelombang(ctx, x, y, w, h, { t, mode: "batang", n: 30, amp: a, seed: 9, col: "#3FD8C8", col2: "#FFFFFF", speed: 2.8 });
    else L.gelombang(ctx, x, y, w, h, { t, mode: "garis", rapat: 3.2, amp: u => a * (u < 0.38 ? 1 : 0.62 + 0.1 * Math.sin(u * 30)), seed: 4, col: "#FF7FA0", col2: "#FFD38A", speed: 0.7, lw: 7 });
  }
  // gambar tokoh + gelembung/panel. st.i(p) mengembalikan keadaan per tokoh.
  function family(ctx, l, t, cm, st) {
    const anchors = [];
    PPL.forEach((p, i) => {
      const s = st(p, i); if (s.hide) { anchors.push(null); return; }
      const o = Object.assign(O.preset(p.k), { pose: s.pose || "berdiri", t, seed: p.seed, face: s.face, look: s.look || [0, -0.2], flip: !!s.flip, jalan: s.jalan, alpha: s.alpha });
      const a = O.draw(ctx, s.x == null ? p.x : s.x, FLOOR, p.h, o); anchors.push(a);
    });
    return anchors;
  }
  function bubble(ctx, p, rect, a, tail, t, amp, waveA) {
    const [x, y, w, h] = rect; ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = "rgba(14,22,62,0.9)"; H.rr(ctx, x, y, w, h, 26); ctx.fill();
    if (tail) { ctx.beginPath(); ctx.moveTo(x + w / 2 - 22, y + h - 2); ctx.lineTo(tail[0], tail[1]); ctx.lineTo(x + w / 2 + 22, y + h - 2); ctx.closePath(); ctx.fill(); }
    ctx.strokeStyle = D.hexA(p.col, 0.9); ctx.lineWidth = 5; H.rr(ctx, x, y, w, h, 26); ctx.stroke();
    if (waveA > 0.01) { ctx.save(); ctx.globalAlpha *= waveA; H.rr(ctx, x, y, w, h, 26); ctx.clip(); bubbleWave(ctx, p, x + 24, y + 16, w - 48, h - 32, t, amp); ctx.restore(); }
    ctx.restore();
  }

  // penampang kepala mini (sama dengan b1_1) per tokoh: ukuran & bentuknya mengikuti tubuh masing-masing
  function tractGlyph(ctx, p, cx, cy, t, a, vib, skin) {
    if (a <= 0.01) return; const { sc, sx } = GEO[p.k];
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.scale(sc * sx, sc); ctx.translate(-810, -520);
    ctx.save(); ctx.shadowColor = D.hexA(p.col, 0.9); ctx.shadowBlur = 18; ctx.fillStyle = skin || SKIN; ctx.fill(HP.skin); ctx.restore();
    ctx.lineWidth = 14; ctx.strokeStyle = p.col; ctx.stroke(HP.skin);
    ctx.save(); ctx.clip(HP.skin); ctx.fillStyle = p.k === "buRina" ? O.PRESETS.buRina.hijab : "#2B2440"; ctx.fill(HP.hair); ctx.restore();
    ctx.fillStyle = "#5B2150"; [HP.nasal, HP.oral, HP.phar, HP.trach].forEach(q => ctx.fill(q)); ctx.fillStyle = "#FF7F9C"; ctx.fill(HP.tongue);
    ctx.strokeStyle = D.hexA(p.col, 0.95); ctx.lineWidth = 10; [HP.nasal, HP.oral, HP.phar].forEach(q => ctx.stroke(q));
    const j = vib * 14 * Math.sin(t * 38); D.glow(ctx, 803, 771, 260, P.amber, 0.9 * (0.5 + 0.5 * vib)); ctx.fillStyle = "#FFE2A8"; ctx.beginPath(); ctx.arc(803 + j, 771, 40, 0, TAU); ctx.fill();
    ctx.strokeStyle = D.hexA("#FFFFFF", 0.9); ctx.lineWidth = 22; ctx.lineCap = "round";
    for (let k = 0; k < 2; k++) { const ph = (t * 1.6 + k / 2) % 1; ctx.globalAlpha = a * (1 - ph) * vib; ctx.beginPath(); ctx.arc(1110, 550, 80 + ph * 300, -0.6, 0.6); ctx.stroke(); }
    ctx.restore();
  }

  function scene12(ctx, b, l, t) {
    const dur = b.dur, cm = mkCam(960, 540, 1 + 0.03 * eio(l / dur));
    LT.studio(ctx, t, { warna: "biru", floorY: 800, px: 0 });
    const T = { bentuk: at(b, "bentuk tubuh"), suara: at(b, "suara setiap"), tinggi: at(b, "tinggi"), serak: at(b, "serak"), cepat: at(b, "berbicara cepat"), panjang: at(b, "memanjangkan") };
    const startOf = [T.tinggi - 0.35, T.serak - 0.3, T.cepat - 0.15, T.panjang - 0.35], endOf = [T.tinggi + 1.0, T.serak + 0.95, at(b, "cepat") + 0.75, b.dur - 0.7];
    const talkOf = i => { let v = 0; if (l > startOf[i] && l < endOf[i]) v = 1; const s0 = T.suara + i * 0.32; if (l > s0 && l < s0 + 0.9) v = Math.max(v, 0.8); return v; };
    ctx.save(); cm.apply(ctx);
    const A = family(ctx, l, t, cm, (p, i) => { const tk = talkOf(i); return { face: tk ? (flap(l, 22) > 0.5 ? "tertawa" : "senang") : (l > T.suara ? "senang" : "netral"), look: [0, -0.4] }; });
    // gelembung Anak sudah ada sejak awal (kepala b1_1 menyusut ke sini); yang lain muncul saat "bentuk tubuh",
    // berisi saluran suara seukuran tubuhnya, lalu berubah menjadi gelombang ("suara ... juga berbeda")
    const ORDER = [1, 0, -9, 2];
    PPL.forEach((p, i) => {
      const G = GEO[p.k], u = l - (T.bentuk - 0.1 + ORDER[i] * 0.22); if (u <= 0) return; const sp = spring(u, 10, 0.5), focus = clamp((l - startOf[i]) / 0.3) * (1 - clamp((l - endOf[i]) / 0.4));
      const k = lerp(0.4, 1, Math.min(1.1, sp)) * (1 + 0.08 * focus), w = G.w * k, h = G.h * k, a = A[i], sw = clamp((l - (T.suara + i * 0.32)) / 0.45);
      bubble(ctx, p, [p.x - w / 2, G.cy - h / 2, w, h], clamp(u / 0.2), a ? [a.head[0] + 6, G.top - 16] : null, t, 0.25 + 0.75 * talkOf(i), sw);
      if (sw < 1) { ctx.save(); H.rr(ctx, p.x - w / 2, G.cy - h / 2, w, h, 26); ctx.clip(); ctx.translate(p.x, G.cy); ctx.scale(k, k); tractGlyph(ctx, p, 0, G.gy, t, (1 - sw) * clamp(u / 0.2), 0.4 + 0.6 * talkOf(i), O.PRESETS[p.k].skin); ctx.restore(); }
    });
    // Bip (kecil, di antara Ayah dan Anak) menengok gelembung yang muncul, lalu menunjuk tiap pembicara
    const lt = [T.tinggi, T.serak, T.cepat + 0.3, T.panjang];
    let who = -1; lt.forEach((x, i) => { if (l >= x - 0.25) who = i; });
    const G2 = who >= 0 ? GEO[PPL[who].k] : null;
    B.draw(ctx, 960, 785, 150, who >= 0 ? { pose: "tunjuk", t, target: [PPL[who].x, G2.cy + G2.h / 2 + 10], mood: who === 1 ? "think" : "happy" }
      : { pose: "diam", t, look: l < T.bentuk + 0.4 ? [0.6, -0.8] : [Math.sin(l * 1.3) * 0.8, -0.8], mood: l > T.suara ? "wow" : "happy" });
    ctx.restore();
    // label tetap sampai akhir: b1_3 menggambarnya lagi di tempat yang sama lalu memudarkannya
    PPL.forEach((p, i) => tag(p.lab, cm.X(p.x), cm.Y(GEO[p.k].labY), l - lt[i], { col: p.col, size: 48 }));
  }

  // kamera b1_3 (dipakai juga oleh b1_4 untuk membawa panel "Anak")
  function cam13Keys(b) {
    const zi = at(b, "mirip sidik jari") - 0.35, zo = at(b, "Ilmuwan") + 0.05;
    return [[0, 960, 540, 1.03], [0.25, 960, 540, 1.03], [2.4, 1175, 470, 1.12], [zi, 1175, 470, 1.13], [zi + 0.9, 1175, 300, 1.45], [zo, 1175, 300, 1.47], [zo + 1.2, 1175, 470, 1.12], [b.dur, 1175, 466, 1.15]];
  }
  function panelState(b, l, i) {   // i: 1 ayah, 2 anak, 3 ibu
    const j = i - 1, m = eio((l - 0.15 - j * 0.08) / 0.8), rev = clamp((l - at(b, "digambar") - j * 0.18) / 1.3);
    const f0 = at(b, "mirip sidik jari") - 0.25 + j * 0.05, f1 = at(b, "Ilmuwan") + 0.35 + j * 0.05;
    const fs = 1 - eio((l - f0) / 0.6) + eio((l - f1) / 0.7);
    return { m, rev, fs: clamp(fs) };
  }
  // tiap sidik jari punya bentuk sendiri (miring, lebar, letak inti) yang hilang saat kembali menjadi spektrogram
  const FPX = { ayah: { rot: -0.35, sx: 1.15, sy: 0.9, dx: 0, dy: 0, tint: "#A9D2FF" }, anakRina: { rot: 0.25, sx: 1, sy: 1, dx: -0.15, dy: 0, tint: "#A6F6EC" }, buRina: { rot: 0, sx: 0.85, sy: 1.1, dx: 0, dy: -0.1, tint: "#FFC0D2" } };
  const fpCore = (p, fs) => { const f = FPX[p.k], k = 1 - fs; return [p.x + f.dx * PR * k, PCY + f.dy * PR * k + 0.04 * PR]; };
  function drawPanel(ctx, p, cx, cy, ps, t, opt = {}) {
    const r = PR, x = cx - 1.15 * r, y = cy - r, w = 2.3 * r, h = 2 * r, fs = ps.fs;
    if (fs >= 0.999) L.spektrogram(ctx, x, y, w, h, { profil: p.prof, dur: 3.5, fmax: 5500, scroll: SCROLL(t), reveal: ps.rev, frame: true, r: h * 0.06 });
    else {
      // peralihan tanpa frame kosong: guratan sidik jari mulai merentang ke garis harmonik (morf kit hanya sampai 0,35,
      // sebelum kotak gelapnya muncul), sementara spektrogram utuh memudar masuk di atasnya
      const f = FPX[p.k], k = 1 - fs, fpA = 1 - sm((fs - 0.25) / 0.6), spA = sm((fs - 0.15) / 0.6);
      if (fpA > 0.01) { ctx.save(); ctx.globalAlpha *= fpA; ctx.translate(cx + f.dx * r * k, cy + f.dy * r * k); ctx.rotate(f.rot * k); ctx.scale(lerp(1, f.sx, k), lerp(1, f.sy, k));
        L.sidikJari(ctx, 0, 0, r, { fromSpec: 0.35 * sm(fs / 0.8), profil: p.prof, seed: p.seed, t, scroll: SCROLL(t), dur: 3.5, col: opt.fpCol || f.tint }); ctx.restore(); }
      if (spA > 0.01) L.spektrogram(ctx, x, y, w, h, { profil: p.prof, dur: 3.5, fmax: 5500, scroll: SCROLL(t), frame: true, r: h * 0.06, alpha: spA });
    }
    const fa = (opt.frame || 0) * sm((fs - 0.6) / 0.4);
    if (fa > 0.01) { ctx.save(); ctx.globalAlpha *= fa; ctx.strokeStyle = p.col; ctx.lineWidth = 9; H.rr(ctx, x, y, w, h, h * 0.06); ctx.stroke(); ctx.restore(); }
    return { x, y, w, h };
  }
  // lingkaran ciri khas (dunia): digambar memutar lalu pudar
  function ring(ctx, kind, x, y, w, h, u, a, col) {
    if (a <= 0.01 || u <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const path = () => { ctx.beginPath(); if (kind === "e") ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(u)); else { H.rr(ctx, x, y, w, h, Math.min(w, h) * 0.3); } };
    const per = kind === "e" ? Math.PI * (w + h) / 2 : 2 * (w + h);
    if (kind !== "e") ctx.setLineDash([per * clamp(u), per + 10]);
    ctx.strokeStyle = "rgba(10,18,52,0.6)"; ctx.lineWidth = 15; path(); ctx.stroke();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 9; path(); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineWidth = 5; path(); ctx.stroke(); ctx.restore();
  }
  // ciri suara di panel: Ayah = pita bawah kasar (serak), Anak = rentetan suku kata pendek (cepat), Ibu = akhir kalimat
  const SIG_PICK = {};
  function sigRect(b, p, l, t, px, py, pw, ph) {
    if (p.k === "ayah") return ["e", px + pw * 0.04, py + ph * 0.72, pw * 0.92, ph * 0.3];
    const key = p.k + "@" + b.start, pr = p.prof, S = planOf(pr), tp = b.start + at(b, p.k === "anakRina" ? "pola" : "khas"), sc0 = SCROLL(tp);
    if (!SIG_PICK[key]) {
      if (p.k === "anakRina") {   // satu rentetan ≥4 suku kata yang utuh di jendela, agak ke kanan
        const groups = {}; S.forEach(s => (groups[s.g] = groups[s.g] || []).push(s));
        let best = null; Object.values(groups).forEach(gs => { if (gs.length < 4) return; const a0 = relOf(gs[0].t0, sc0), a1 = a0 + (gs[gs.length - 1].t1 - gs[0].t0); if (a0 > 0.7 && a1 < 3.35 && (!best || gs.length > best.n)) best = { t0: gs[0].t0, t1: gs[gs.length - 1].t1, n: gs.length }; });
        SIG_PICK[key] = best || { t0: sc0 + 1.2, t1: sc0 + 2.2 };
      } else {   // suku kata terakhir sebuah kalimat (sebelum jeda), agak ke kanan
        let best = null; S.forEach(s => { if (!s.last) return; const a0 = relOf(s.t0, sc0); if (a0 > 1.4 && a0 < 3.0 && (!best || a0 > best.a0)) best = { t0: s.t0, t1: s.t1, a0 }; });
        SIG_PICK[key] = best || { t0: sc0 + 2.2, t1: sc0 + 2.5 };
      }
    }
    const g = SIG_PICK[key], sc = SCROLL(t), x0 = px + pw * relOf(g.t0, sc) / 3.5, x1 = px + pw * (relOf(g.t0, sc) + (g.t1 - g.t0)) / 3.5;
    return p.k === "anakRina" ? ["r", x0 - 14, py + ph * 0.22, x1 - x0 + 28, ph * 0.74] : ["e", x0 - 26, py + ph * 0.26, x1 - x0 + 70, ph * 0.72];
  }
  // tanda "≠" (garis, bukan teks) di layar
  function neq(c, x, y, s, a) {
    if (a <= 0.01) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s);
    c.fillStyle = "rgba(10,18,52,0.88)"; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.fill(); c.strokeStyle = D.hexA(P.amber, 0.95); c.lineWidth = 5; c.stroke();
    c.strokeStyle = "#FFF6E6"; c.lineWidth = 8; c.lineCap = "round"; c.beginPath(); c.moveTo(-18, -9); c.lineTo(18, -9); c.moveTo(-18, 9); c.lineTo(18, 9); c.stroke();
    c.strokeStyle = P.amber; c.beginPath(); c.moveTo(-9, 24); c.lineTo(9, -24); c.stroke(); c.restore();
  }

  function scene13(ctx, b, l, t) {
    const cm = camAt(cam13Keys(b), l), dur = b.dur;
    LT.studio(ctx, t, { warna: "biru", floorY: 800, px: (cm.fx - 960) / 960 * 0.8 });
    const T = { gambar: at(b, "digambar"), setiap: at(b, "setiap orang"), pola: at(b, "pola"), khas: at(b, "khas"), sidik: at(b, "mirip sidik jari"), jari: at(b, "jari."), ilmu: at(b, "Ilmuwan"), spek: at(b, "spektrogram") };
    const zoomK = clamp((cm.z - 1.13) / 0.32);   // 0 = tiga panel, 1 = dekat ke sidik jari
    const tabT = [0, T.setiap, T.pola, T.khas];
    ctx.save(); cm.apply(ctx);
    family(ctx, l, t, cm, (p, i) => {
      if (i === 0) { const wl = clamp((l - 0.2) / 2.6); return { x: lerp(p.x, -200, eio(wl)), pose: "berdiri", jalan: wl > 0 && wl < 1, flip: true, face: "senang", hide: wl >= 1 }; }
      return { face: "senang", look: [0, -0.9], alpha: 1 - zoomK };
    });
    const boxes = [];
    PPL.forEach((p, i) => {
      const G = GEO[p.k];
      if (i === 0) { // gelembung adik ikut pergi
        const wl = clamp((l - 0.2) / 2.6); if (wl < 1) { const x = lerp(p.x, -200, eio(wl)); bubble(ctx, p, [x - G.w / 2, G.cy - G.h / 2, G.w, G.h], 1 - clamp(l / 0.9), null, t, 0.3, 1); } return; }
      const ps = panelState(b, l, i), side = i !== 2 ? 1 - 0.2 * zoomK : 1;
      ctx.save(); ctx.globalAlpha *= side;
      if (ps.rev <= 0) {   // gelembung tumbuh menjadi panel
        const w = lerp(G.w, 2.3 * PR, ps.m), h = lerp(G.h, 2 * PR, ps.m), cy = lerp(G.cy, PCY, ps.m);
        bubble(ctx, p, [p.x - w / 2, cy - h / 2, w, h], 1, ps.m < 0.5 ? [p.x + 6, G.top - 16] : null, t, 0.4, 1 - clamp((ps.m - 0.3) / 0.5));
        if (ps.m > 0.4) { ctx.save(); ctx.globalAlpha *= clamp((ps.m - 0.4) / 0.4); ctx.fillStyle = L.LUT_COL(0); H.rr(ctx, p.x - w / 2 + 3, cy - h / 2 + 3, w - 6, h - 6, 24); ctx.fill(); ctx.restore(); }
      } else {
        const frame = clamp((l - tabT[i]) / 0.3), bx = drawPanel(ctx, p, p.x, PCY, ps, t, { frame }); boxes[i] = bx;
        // ciri khas suara dilingkari sebentar saat namanya muncul
        const su = l - tabT[i] - 0.1, sa = clamp(su / 0.15) * (1 - clamp((su - 1.15) / 0.3)) * sm((ps.fs - 0.5) / 0.5);
        if (sa > 0.01) { ctx.save(); H.rr(ctx, bx.x - 20, bx.y - 20, bx.w + 40, bx.h + 40, 30); ctx.clip(); const R = sigRect(b, p, l, t, bx.x, bx.y, bx.w, bx.h); ring(ctx, R[0], R[1], R[2], R[3], R[4], eio(clamp(su / 0.5)), sa, p.col); ctx.restore(); }
      }
      ctx.restore();
    });
    // Bip: berdiri di antara Ayah dan Anak (dari b1_2), menunjuk tiap panel saat namanya muncul, melompat ke depan sidik jari Anak
    // dengan kaca pembesar, lalu turun di antara Anak dan Ibu dan menunjuk label "spektrogram"
    const up0 = T.khas + 0.3, up1 = up0 + 0.7, dn0 = T.ilmu + 0.15, dn1 = dn0 + 0.75, sL = 172;
    const core = fpCore(PPL[2], 0), dir = [0.5, 0.866], sh = [core[0] + dir[0] * 0.78 * sL, core[1] + dir[1] * 0.78 * sL], LP = [sh[0] + 0.33 * sL, sh[1] - 0.04 * sL];
    const FLR = [960, 785, 150], END = [1390, 785, 150];
    const lab = [(960 - 960) / cm.z + cm.fx, (470 - 540) / cm.z + cm.fy];   // label spektrogram (layar 960,470) dalam koordinat dunia
    let bp, bo;
    if (l < up0) { bp = FLR; const k = l >= T.khas - 0.1 ? 3 : l >= T.pola - 0.1 ? 2 : l >= T.setiap - 0.1 ? 1 : 0;
      bo = k ? { pose: "tunjuk", t, target: [PPL[k].x, PCY + PR * 0.6] } : { pose: "diam", t, look: [l < T.gambar ? -0.3 : -0.7, -0.9], mood: l > T.gambar ? "wow" : "happy" }; }
    else if (l < up1) { const u = eio((l - up0) / 0.7); bp = [lerp(FLR[0], LP[0], u), lerp(FLR[1], LP[1], u) - Math.sin(Math.PI * u) * 140, lerp(FLR[2], sL, u)]; bo = { pose: "jalan", t, dir: 1, shadow: false }; }
    else if (l < dn0) { bp = [LP[0], LP[1], sL];
      bo = { pose: "kacaPembesar", t, target: core, glass: 0.95, mood: l > T.jari ? "wow" : "think", shadow: false,
        content: (c, lx, ly, r) => { c.fillStyle = "rgba(26,33,96,0.85)"; c.fillRect(lx - r, ly - r, 2 * r, 2 * r); c.translate(lx, ly); c.scale(2.6, 2.6); c.translate(-lx, -ly);
          drawPanel(c, PPL[2], PPL[2].x, PCY, panelState(b, l, 2), t, { fpCol: "#E9FFFB" }); } }; }
    else if (l < dn1) { const u = eio((l - dn0) / 0.75); bp = [lerp(LP[0], END[0], u), lerp(LP[1], END[1], u) - Math.sin(Math.PI * u) * 90, lerp(sL, END[2], u)]; bo = { pose: "jalan", t, dir: 1, shadow: u > 0.8 }; }
    else { bp = END; bo = l >= T.spek - 0.2 ? { pose: "tunjuk", t, target: lab, mood: "happy" } : { pose: "diam", t, look: [-0.8, -0.7], mood: "happy" }; }
    B.draw(ctx, bp[0], bp[1], bp[2], bo);
    ctx.restore();
    const la = 1 - clamp((l - dur + 0.6) / 0.45);   // label pudar sebelum silang-pudar ke b1_4
    // label "tinggi/serak/cepat/memanjang" dari b1_2 memudar saat gelembung berubah ("tinggi" ikut adik pergi)
    PPL.forEach((p, i) => { const a = 1 - clamp((l - 0.2) / 0.5); const x = i === 0 ? lerp(p.x, -200, eio(clamp((l - 0.2) / 2.6))) : p.x; if (a > 0.01) tag(p.lab, cm.X(x), cm.Y(GEO[p.k].labY), 1, { col: p.col, size: 48, a }); });
    // sumbu sederhana pada panel Ayah saat "digambar sebagai peta warna"
    const ax = clamp((l - T.gambar) / 0.3) * (1 - clamp((l - T.gambar - 1.75) / 0.35));
    if (ax > 0.01) { const x0 = cm.X(PPL[1].x - 1.15 * PR), x1 = cm.X(PPL[1].x + 1.15 * PR), y0 = cm.Y(PCY - PR), y1 = cm.Y(PCY + PR), g = clamp((l - T.gambar) / 0.5);
      D.post(c => { c.globalAlpha = ax; arrow(c, x0 + 26, y1 - 26, x0 + 26, lerp(y1 - 26, y0 + 34, eio(g)), "#FFF6E6", 7); arrow(c, x0 + 26, y1 - 26, lerp(x0 + 26, x1 - 30, eio(g)), y1 - 26, "#FFF6E6", 7); });
      tag("nada", x0 + 120, y0 + 64, (l - T.gambar - 0.25), { col: "#FFF6E6", size: 44, a: ax });
      tag("waktu", x1 - 120, y1 - 92, (l - T.gambar - 0.45), { col: "#FFF6E6", size: 44, a: ax }); }
    // tab nama di atas panel: pudar tepat sebelum "mirip sidik jari", kembali sesudah "Ilmuwan"
    const tabA = (1 - clamp((l - (T.sidik - 0.35)) / 0.25)) + clamp((l - T.ilmu - 0.65) / 0.3);
    [1, 2, 3].forEach(i => { const p = PPL[i]; if (boxes[i]) tag(NAMA[p.k], cm.X(p.x), cm.Y(PCY - PR) - 44, l - tabT[i], { col: p.col, size: 46, a: clamp(tabA) * la }); });
    // "≠" di antara sidik jari: setiap orang khas
    const nq = clamp((l - T.sidik - 0.15) / 0.25) * (1 - clamp((l - T.ilmu - 0.2) / 0.3));
    if (nq > 0.01) { const pul = 1 + 0.07 * Math.sin(t * 6.5), s = lerp(0.5, 1, Math.min(1.05, spring(l - T.sidik - 0.15, 10, 0.5))) * pul;
      const m1 = cm.S((PPL[1].x + 0.84 * PR * 1.15 + fpCore(PPL[2], 0)[0] - 0.84 * PR) / 2, PCY), m2 = cm.S((fpCore(PPL[2], 0)[0] + 0.84 * PR + PPL[3].x - 0.84 * 0.85 * PR) / 2, PCY);
      D.post(c => { neq(c, m1[0], m1[1], s, nq); neq(c, m2[0], m2[1], s, nq); }); }
    // label spektrogram di sepertiga bawah panel Anak, dengan panah pendek ke panel Ayah dan Ibu
    const sp = l - T.spek;
    tag("spektrogram", 960, 470, sp, { col: P.amber, size: 60, a: la });
    if (sp > 0.15) { const ga = clamp((sp - 0.15) / 0.25) * la, g = eio(clamp((sp - 0.15) / 0.4)), ay = cm.Y(PCY + PR * 0.35);
      D.post(c => { c.globalAlpha = ga; arrow(c, 724, 470, lerp(724, cm.X(PPL[1].x + PR * 0.6), g), lerp(470, ay, g), P.amber, 8); arrow(c, 1196, 470, lerp(1196, cm.X(PPL[3].x - PR * 0.6), g), lerp(470, ay, g), P.amber, 8); }); }
    tag("mirip sidik jari", 960, 128, l - T.sidik, { col: "#BDF5EC", size: 52, a: 1 - clamp((l - T.ilmu - 0.05) / 0.4) });
  }

  // =====================================================================================
  // b1_4  Bu Rina mengenali suara anaknya dari balik dinding
  // =====================================================================================
  function heart(ctx, x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, 30);
    ctx.bezierCurveTo(-60, -10, -40, -60, 0, -32); ctx.bezierCurveTo(40, -60, 60, -10, 0, 30); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.beginPath(); ctx.ellipse(-22, -30, 10, 6, -0.6, 0, TAU); ctx.fill(); ctx.restore(); }
  function cloud(ctx, x, y, w, h, a) {   // gelembung pikiran
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = "#FFF6E6"; ctx.shadowColor = "rgba(10,14,50,0.3)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
    const n = 9; ctx.beginPath(); for (let i = 0; i < n; i++) { const u = i / n * TAU, px = x + Math.cos(u) * w * 0.5, py = y + Math.sin(u) * h * 0.5; ctx.moveTo(px + h * 0.2, py); ctx.arc(px, py, h * 0.2, 0, TAU); }
    ctx.ellipse(x, y, w * 0.5, h * 0.5, 0, 0, TAU); ctx.fill(); ctx.restore();
  }
  function eyeSlash(ctx, x, y, r, a) {
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = "#FFF6E6"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.strokeStyle = "#2A3378"; ctx.lineWidth = r * 0.1;
    ctx.beginPath(); ctx.moveTo(x - r * 0.62, y); ctx.quadraticCurveTo(x, y - r * 0.62, x + r * 0.62, y); ctx.quadraticCurveTo(x, y + r * 0.62, x - r * 0.62, y); ctx.stroke();
    ctx.fillStyle = "#2A3378"; ctx.beginPath(); ctx.arc(x, y, r * 0.2, 0, TAU); ctx.fill();
    ctx.strokeStyle = P.red; ctx.lineWidth = r * 0.14; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x - r * 0.55, y + r * 0.55); ctx.lineTo(x + r * 0.55, y - r * 0.55); ctx.stroke(); ctx.restore();
  }

  function speech(c, s, x, y, k, a, tail) {   // gelembung ucapan krem (teks ≥ 48 px)
    c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(k, k); c.font = `800 52px ${K.FONT}`; const w = c.measureText(s).width + 64;
    c.fillStyle = "rgba(10,14,50,0.25)"; H.rr(c, -w / 2 + 4, -44, w, 96, 40); c.fill();
    c.fillStyle = "#FFF6E6"; H.rr(c, -w / 2, -48, w, 96, 40); c.fill(); c.beginPath(); c.moveTo(tail * w * 0.1 - 18, 40); c.lineTo(tail * w * 0.22, 96); c.lineTo(tail * w * 0.1 + 18, 40); c.closePath(); c.fill();
    D.txt(c, s, 0, 18, 52, { align: "center", color: "#1E2A6B" }); c.restore();
  }
  function scene14(ctx, b, l, t, TL) {
    const dur = b.dur;
    const T0 = { ribu: at(b, "ribuan tahun"), pola: at(b, "pola ini") };
    // kamera: dorong ke jam dinding yang berputar ("selama ribuan tahun"), lalu kembali ke dua kamar
    const cm = camAt([[0, 900, 520, 1.08], [T0.ribu - 0.3, 900, 520, 1.08], [T0.ribu + 0.5, 520, 400, 1.42], [T0.pola - 0.35, 520, 400, 1.44], [T0.pola + 0.7, 900, 520, 1.1], [dur, 900, 520, 1.13]], l);
    const T = { ribu: at(b, "ribuan tahun"), pola: at(b, "pola ini"), kenal: at(b, "mengenali"), sayang: at(b, "sayangi"), tanpa: at(b, "tanpa melihat"), itu: at(b, "Itulah"), percaya: at(b, "percaya"), keluarga: at(b, "suara keluarga") };
    const call0 = T.kenal - 0.9, call1 = call0 + 1.5, c2a = T.keluarga - 0.5, c2b = c2a + 1.1;   // anak memanggil (dua kali)
    const jam = 19 + 48 * eio((l - T.ribu + 0.1) / 1.5);   // jarum jam berputar cepat: "selama ribuan tahun"
    ctx.save(); cm.apply(ctx);
    const S = LT.lewatDinding(ctx, t, 0.5, { kamar: { lamp: 1, jam }, anak: { lamp: 1, guling: true } });
    const km = S.anchors.kamar, ka = S.anchors.kamarAnak, wallX = S.anchors.wallX;
    LT.parts.warmPool(ctx, km.sit.x - 60, 610, 520, 0.35, 0.5);
    // Bu Rina duduk di tepi ranjang, membelakangi dinding (tidak melihat anaknya)
    const heard = clamp((l - T.sayang + 0.4) / 0.4), laugh = (l > T.percaya - 0.2 && l < T.percaya + 1.0);
    // "Itulah sebabnya": Bu Rina berbalik menghadap dinding (arah suara anaknya) dan tersenyum lembut; tetap tidak melihat anaknya
    const tu = eio(clamp((l - T.itu + 0.05) / 0.4)), rsx = Math.cos(Math.PI * tu), rx = km.sit.x + 30;
    ctx.save(); ctx.translate(rx, 0); ctx.scale(Math.sign(rsx || 1) * Math.max(0.06, Math.abs(rsx)), 1); ctx.translate(-rx, 0);
    const rina = O.draw(ctx, rx, 800, 400, Object.assign(O.preset("buRina"), { pose: "duduk", kursi: false, t, flip: true, face: heard > 0.5 ? (laugh ? "tertawa" : "senang") : "netral", look: [0.5, heard > 0.5 ? -0.25 : 0.15] }));
    ctx.restore();
    // anak duduk di ranjangnya, menghadap dinding, memanggil
    const callTalk = (l > call0 && l < call1) || (l > c2a && l < c2b) ? flap(l, 21) : 0;
    const anak = O.draw(ctx, ka.sit.x - 230, 800, 385, Object.assign(O.preset("anakRina"), { pose: "duduk", kursi: false, t, flip: true, face: callTalk > 0.5 ? "tertawa" : "senang", look: [0.8, 0] }));
    const mouth = [anak.head[0] - 34, anak.head[1] + 20], ear = [rina.head[0] + 14, rina.head[1]];
    // gelombang suara menembus dinding
    const wv = clamp((l - call0) / 0.3) * (1 - clamp((l - call1 - 1.2) / 0.8)) + clamp((l - c2a) / 0.3) * (1 - clamp((l - c2b - 1.2) / 0.8));
    soundArcs(ctx, mouth[0], mouth[1], t, wv, { dir: Math.PI, spread: 0.3, reach: mouth[0] - ear[0], speed: 0.75, n: 7, cols: l > T.itu ? [P.warm, "#FFE9C2"] : [P.teal, "#BDF5EC"] });
    ctx.restore();
    // ---- lapisan di layar ----
    const [mx, my] = cm.S(...mouth), [hx, hy] = cm.S(...rina.top), [ex, ey] = cm.S(...ear);
    // gelembung pikiran Bu Rina: pola suara anak yang ia kenal (panel dibawa dari b1_3)
    const bub = { x: hx + 40, y: hy - 200, w: 420, h: 300 }, pw = 290, ph = 160, pcy = bub.y - 34;
    const c0 = T.pola - 0.6, ca = clamp((l - c0) / 0.5);   // awan pikiran muncul sesudah jam berputar
    if (ca > 0.01) { const sp = spring(l - c0, 9, 0.55), k = lerp(0.3, 1, Math.min(1.05, sp));
      [[hx + 4, hy - 18, 13], [hx + 18, hy - 44, 20]].forEach(([x, y, r], j) => { ctx.save(); ctx.globalAlpha = clamp((l - c0 - j * 0.12) / 0.2); ctx.fillStyle = "#FFF6E6"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); });
      ctx.save(); ctx.translate(bub.x, bub.y); ctx.scale(k, k); cloud(ctx, 0, 0, bub.w, bub.h, ca); ctx.restore(); }
    const b13 = beatOf(TL, "b1_3"), c13 = camAt(cam13Keys(b13), b13.dur), z13 = c13.z;
    const src = { x: c13.X(PPL[2].x - 1.15 * PR), y: c13.Y(PCY - PR), w: 2.3 * PR * z13, h: 2 * PR * z13 }, dst = { x: bub.x - pw / 2, y: pcy - ph / 2, w: pw, h: ph };
    const fl = eio((l - c0) / (T.pola + 0.35 - c0)), R = { x: lerp(src.x, dst.x, fl), y: lerp(src.y, dst.y, fl) - Math.sin(Math.PI * fl) * 60, w: lerp(src.w, dst.w, fl), h: lerp(src.h, dst.h, fl) };
    const match = clamp((l - T.sayang + 0.25) / 0.35), glowM = match * (0.6 + 0.4 * Math.sin(t * 5));
    if (match > 0) D.glow(ctx, R.x + R.w / 2, R.y + R.h / 2, 240, P.teal, 0.5 * glowM);
    L.spektrogram(ctx, R.x, R.y, R.w, R.h, { profil: ANAK, dur: 3.5, fmax: 5500, scroll: SCROLL(t), frame: true, aksen: PPL[2].col });
    // garis pindai menyapu pola tersimpan: ingatan yang terus mencocokkan (dari "tanpa melihat" sampai "percaya")
    const scA = clamp((l - T.tanpa - 0.3) / 0.3) * (1 - clamp((l - T.percaya - 0.3) / 0.4));
    if (scA > 0.01) { const u = ((l - T.tanpa - 0.3) / 1.25) % 1, sx = R.x + R.w * u; ctx.save(); ctx.globalAlpha = scA; H.rr(ctx, R.x, R.y, R.w, R.h, R.h * 0.06); ctx.clip();
      const gg = ctx.createLinearGradient(sx - 70, 0, sx, 0); gg.addColorStop(0, D.hexA(P.teal, 0)); gg.addColorStop(1, D.hexA(P.teal, 0.55)); ctx.fillStyle = gg; ctx.fillRect(sx - 70, R.y, 70, R.h);
      ctx.fillStyle = "#E9FFFB"; ctx.fillRect(sx - 3, R.y, 6, R.h); ctx.restore();
      [0, 1, 2].forEach(j => { const ph = ((l - T.tanpa) * 1.3 + j / 3) % 1; ctx.save(); ctx.globalAlpha = scA * (1 - ph); ctx.strokeStyle = D.hexA(P.teal, 0.9); ctx.lineWidth = 4; H.rr(ctx, R.x - ph * 30, R.y - ph * 30, R.w + ph * 60, R.h + ph * 60, R.h * 0.08 + ph * 20); ctx.stroke(); ctx.restore(); }); }
    // paket pola suara yang datang menembus dinding lalu menumpuk tepat di atas pola tersimpan
    const pk = (l - call0 - 0.2) / (T.sayang - 0.25 - call0 - 0.2);
    if (pk > 0 && pk < 1.15) {   // jalur rendah di bawah ekor gelembung ucapan: lurus menembus dinding, lalu naik ke awan
      const u = eio(clamp(pk)), q0 = [mx - 110, my + 70], q1 = [cm.X(wallX), my + 70], q2 = [dst.x + pw / 2, dst.y + ph / 2];
      const px = (1 - u) * (1 - u) * q0[0] + 2 * u * (1 - u) * q1[0] + u * u * q2[0], py = (1 - u) * (1 - u) * q0[1] + 2 * u * (1 - u) * q1[1] + u * u * q2[1], w2 = lerp(150, pw, u), h2 = lerp(84, ph, u);
      ctx.save(); ctx.globalAlpha = 1 - clamp((pk - 1) / 0.15); D.glow(ctx, px, py, 120, P.teal, 0.5); L.spektrogram(ctx, px - w2 / 2, py - h2 / 2, w2, h2, { profil: ANAK, dur: 3.5, fmax: 5500, scroll: SCROLL(t), frame: false, aksen: "#BDF5EC", alpha: 0.9 }); ctx.restore(); }
    // ikon "tanpa melihat" di dinding
    const [wx] = cm.S(wallX, 0), ea = clamp((l - T.tanpa) / 0.3);
    if (ea > 0) { const sp = spring(l - T.tanpa, 10, 0.5); ctx.save(); ctx.translate(wx, cm.Y(300)); ctx.scale(lerp(0.4, 1, sp), lerp(0.4, 1, sp)); eyeSlash(ctx, 0, 0, 70, ea); ctx.restore(); }
    // hati: "langsung percaya"
    const ha = clamp((l - T.percaya) / 0.25);
    if (ha > 0) { const sp = spring(l - T.percaya, 9, 0.45), beat = 1 + 0.06 * Math.max(0, Math.sin(t * 7)), qx = bub.x + bub.w * 0.5, qy = bub.y - bub.h * 0.36;
      D.glow(ctx, qx, qy, 120, P.pink, 0.5 * ha); heart(ctx, qx, qy, 100 * lerp(0.3, 1, Math.min(1.1, sp)) * beat, "#FF6F91"); }
    // ucapan anak
    const s1 = clamp((l - call0 + 0.1) / 0.25) * (1 - clamp((l - call1 - 1.0) / 0.4)), s2 = clamp((l - c2a + 0.1) / 0.25) * (1 - clamp((l - dur + 0.9) / 0.4));
    const bx = Math.min(mx - 60, 1540), byy = my - 200;
    if (s1 > 0) D.post(c => speech(c, "Bu, aku lapar!", bx, byy, lerp(0.6, 1, Math.min(1.05, spring(l - call0 + 0.1, 10, 0.5))), s1, 1));
    if (s2 > 0) D.post(c => speech(c, "Bu, ayo makan!", bx, byy, lerp(0.6, 1, Math.min(1.05, spring(l - c2a + 0.1, 10, 0.5))), s2, 1));
    tag("Anakku", bub.x, bub.y + 92, l - T.sayang, { col: P.green, size: 48 });
  }

  // ---------- pengarah adegan ----------
  K.SCENES.d03_b1 = function (ctx, b, l, t, TL) {
    if (b.id === "b1_1") return scene11(ctx, b, l, t);
    if (b.id === "b1_2") return scene12(ctx, b, l, t);
    if (b.id === "b1_3") return scene13(ctx, b, l, t);
    return scene14(ctx, b, l, t, TL);
  };
  K.SCENES.d03_b1.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b1 = TL => [
    K.sfxAt(TL, "b1_1", "pita suara", 0.05, "pop", 0.6),
    K.sfxAt(TL, "b1_1", "ratusan", 0.0, "shimmer", 0.5),
    K.sfxAt(TL, "b1_1", "Getaran itu", -0.4, "whoosh", 0.5),
    K.sfxAt(TL, "b1_1", "mulut", 0.05, "pop", 0.45),
    K.sfxAt(TL, "b1_1", "bibirmu", 0.05, "whoosh", 0.6),   // gelombang keluar + kepala menyusut ke gelembung
    K.sfxAt(TL, "b1_2", "bentuk tubuh", 0.1, "shimmer", 0.45),
    K.sfxAt(TL, "b1_2", "tinggi", 0.0, "pop", 0.5),
    K.sfxAt(TL, "b1_2", "serak", 0.0, "pop", 0.5),
    K.sfxAt(TL, "b1_2", "memanjangkan", 0.0, "pop", 0.5),
    K.sfxAt(TL, "b1_3", "peta warna", -0.2, "shimmer", 0.55),
    K.sfxAt(TL, "b1_3", "mirip sidik jari", -0.95, "whoosh", 0.7),   // kamera mendekat, Bip melompat
    K.sfxAt(TL, "b1_3", "spektrogram", 0.0, "pop", 0.7),
    K.sfxAt(TL, "b1_4", "pola ini", -1.0, "whoosh", 0.5),
    K.sfxAt(TL, "b1_4", "sayangi", -0.2, "shimmer", 0.6),
    K.sfxAt(TL, "b1_4", "Itulah", -0.55, "whoosh", 0.4),   // Bu Rina berbalik ke arah dinding
    K.sfxAt(TL, "b1_4", "percaya", 0.0, "pop", 0.6),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
