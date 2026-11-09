/* D04 bab 4: "Menghitung langkah" (b4_1–b4_4). Kamera sendiri (noCam): diagram diam di tempat supaya mudah dibaca, dorong-masuk sangat pelan.
   b4_1 meja kayu tampak atas (lanjutan bab 3): panel "Banyak langkah", blok memotong (4 merah + 2 biru) dan membagi (2 kuning) dihitung satu per satu
        (angka 1..6 dan 1..2 di dalam blok, lalu "6" dan "2"); Bip memeriksa angka langkah dengan kaca pembesar; judul "analisis algoritma" muncul
        kata demi kata; Jilid 1 di meja, catatan "analysis of algorithms" keluar dari bawahnya, lalu label "Donald Knuth".
   b4_2 kelas rekaan: papan tulis dengan papan angka 1–1000 (50 × 20 kotak), dua murid rekaan (penebak berhijab, teman memegang kartu rahasia "?"),
        gelembung "lebih besar" / "lebih kecil"; tebak satu per satu (kotak dicoret satu-satu, penghitung naik, "bisa sampai 1000 tebakan");
        lalu tebak di tengah: 500 (garis "tengah"), 750, 876, 812, 845, 828, 837, 832, 835, 833 → tersisa 834. Setiap langkah: kotak tebakan menyala +
        angka, gelembung tebakan, jawaban teman, separuh papan padam menyapu dari kotak tebakan, "sisa: a–b" di papan, garis sisa kemungkinan
        1000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1 di bawah papan, penghitung tebakan + 10 bulatan (muncul saat "sepuluh"). Langkah 1–2 pelan,
        3–10 makin cepat di jeda hening; 834 ketemu, kartu teman terbuka "834", "Betul!", Bip bersorak.
   b4_3 kelas yang sama (papan selesai) meredup; Jilid 3 (biru, "Sorting and Searching") masuk, terbuka: halaman kiri "Searching" dengan 16 kotak urut
        yang dibelah dua berulang, halaman kanan pohon pencarian; halaman dibalik saat "rinci"; cahaya ide pindah ke laptop dan HP generik;
        HP: kolom cari mengetik "Sinta", daftar nama urut; batang "4.000 nama · urut A–Z" di samping; saat "dalam sekejap" 12 kali belah dua
        (kurung di batang menyempit, daftar di HP melompat, penghitung 1→12), "Sinta" menyala hijau, "ketemu dalam 12 langkah".
   b4_4 dunia meja Knuth (malam, lampu, rak 1, 2, 3, 4A, 4B + garis putus-putus 4C, 4D, 5, 6, 7): angka 1974 muncul per digit sesuai ucapan,
        "usia 36 tahun", dudukan medali dengan pelat nama "Donald Knuth", medali generik bertuliskan 1974 turun ke dudukan, "Turing Award",
        "≈ 'Nobel' ilmu komputer"; kartu kutipan alasan penghargaan diketik, "art of computer programming" disorot, panah ke rak buku.
   Orang sungguhan tidak digambar. Tanpa logo. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit;
  const P = D.P, H = K.helpers, LP = KIT.latar.parts, B = KIT.bipkit, OR = KIT.orang, KY = KIT.layar;
  const { clamp, lerp, eio, eout, spring } = D;
  const TAU = Math.PI * 2, F = K.FONT, W = 1920, HH = 1080;
  const at = (b, s, o = 0) => D.at(b, s, o);
  const fd = (l, t0, d = 0.4) => clamp((l - t0) / d);
  const popS = u => (u <= 0 ? 0 : lerp(0.9, 1, Math.min(1.08, spring(u, 12, 0.45))));
  const popB = u => (u <= 0 ? 0 : lerp(0.6, 1, Math.min(1.08, spring(u, 11, 0.45))));
  const hh = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const RED = "#FF5A5F", RED_D = "#C23A4C", BLU = "#4FA3FF", BLU_D = "#2B68C4", AMB = P.amber, GRN = P.green, INK = "#28306A";
  const beatOf = (TL, id) => TL.beats.find(x => x.id === id);
  const txt = (ctx, s, x, y, size, opt = {}) => D.txt(ctx, s, x, y, size, opt);
  const tw = (ctx, s, size, w = 800) => { ctx.font = `${w} ${size}px ${F}`; return ctx.measureText(s).width; };
  function lab(ctx, s, x, y, u, o = {}) {
    if (u <= 0) return; const a = clamp(u / 0.15) * (o.a == null ? 1 : o.a); if (a <= 0.01) return;
    ctx.save(); ctx.globalAlpha *= a; const k = (o.big ? popB(u) : popS(u)) * (o.k || 1); ctx.translate(x, y); ctx.scale(k, k);
    if (o.glow) D.glow(ctx, 0, 0, o.glow, o.col || AMB, 0.35);
    D.label(ctx, s, 0, 0, { size: o.size || 48, col: o.col || AMB, color: o.color, fill: o.fill }); ctx.restore();
  }
  function arrow(c, x0, y0, x1, y1, col, lw = 8, bend = 0, u = 1) {
    if (u <= 0) return; const mx = (x0 + x1) / 2 + bend * (y1 - y0) * 0.3, my = (y0 + y1) / 2 - bend * (x1 - x0) * 0.3;
    const q = s => [lerp(lerp(x0, mx, s), lerp(mx, x1, s), s), lerp(lerp(y0, my, s), lerp(my, y1, s), s)];
    const n = 24, m = Math.max(1, Math.round(n * u)); c.save(); c.lineCap = "round"; c.lineJoin = "round";
    [["rgba(20,14,40,0.45)", lw + 6], [col, lw]].forEach(([cc, ww]) => { c.strokeStyle = cc; c.lineWidth = ww; c.beginPath(); for (let i = 0; i <= m; i++) { const [x, y] = q(i / n); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); });
    if (u >= 0.98) { const [ax, ay] = q(0.93), a = Math.atan2(y1 - ay, x1 - ax), hl = lw * 3; c.fillStyle = col; c.beginPath(); c.moveTo(x1, y1);
      c.lineTo(x1 - Math.cos(a - 0.5) * hl, y1 - Math.sin(a - 0.5) * hl); c.lineTo(x1 - Math.cos(a + 0.5) * hl, y1 - Math.sin(a + 0.5) * hl); c.closePath(); c.fill(); }
    c.restore();
  }
  function check(c, x, y, s, col, u = 1) {
    if (u <= 0) return; c.save(); c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = col; c.lineWidth = s * 0.22;
    const p = [[x - s * 0.45, y], [x - s * 0.12, y + s * 0.32], [x + s * 0.5, y - s * 0.38]]; c.beginPath(); c.moveTo(...p[0]);
    if (u < 0.4) c.lineTo(lerp(p[0][0], p[1][0], u / 0.4), lerp(p[0][1], p[1][1], u / 0.4)); else { c.lineTo(...p[1]); const v = (u - 0.4) / 0.6; c.lineTo(lerp(p[1][0], p[2][0], v), lerp(p[1][1], p[2][1], v)); }
    c.stroke(); c.restore();
  }
  function shadowE(ctx, x, y, rx, ry, a = 0.3) { ctx.save(); ctx.fillStyle = `rgba(30,12,8,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  function addLight(ctx, x, y, r, col, a) {
    if (a <= 0.01 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = "screen";
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, D.hexA(col, a)); gr.addColorStop(0.4, D.hexA(col, a * 0.42)); gr.addColorStop(1, D.hexA(col, 0));
    ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  }
  const push = (ctx, z, fx, fy) => { ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx, -fy); };
  // segitiga panah (bukan glyph): dir 1 = ke atas, -1 = ke bawah
  function tri(ctx, x, y, s, dir, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y - dir * s * 0.55); ctx.lineTo(x + s * 0.55, y + dir * s * 0.4); ctx.lineTo(x - s * 0.55, y + dir * s * 0.4); ctx.closePath(); ctx.fill(); }
  // percikan bintang kecil (perayaan)
  function sparks(ctx, x, y, u, n, r, cols) {
    if (u <= 0 || u >= 1.6) return; ctx.save();
    for (let i = 0; i < n; i++) { const a = i / n * TAU + hh(i) * 0.6, d = r * (0.3 + 0.9 * eout(clamp(u / 1.2))) * (0.7 + hh(i + 9) * 0.5);
      const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d + 60 * u * u, s = 7 + hh(i + 3) * 7;
      ctx.globalAlpha = clamp(1.5 - u) * 0.95; ctx.fillStyle = cols[i % cols.length]; ctx.save(); ctx.translate(px, py); ctx.rotate(u * 4 + i);
      ctx.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? s * 0.4 : s; ctx.lineTo(Math.cos(k / 8 * TAU) * rr, Math.sin(k / 8 * TAU) * rr); } ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.restore();
  }

  // =====================================================================================
  // b4_1: meja kayu tampak atas (sama dengan bab 3)
  // =====================================================================================
  const GRAIN = Array.from({ length: 22 }, (_, i) => ({ y: 20 + i * 50 + hh(i) * 26, a: 0.05 + hh(i + 40) * 0.07, f: 0.002 + hh(i + 80) * 0.003, ph: hh(i + 9) * 6 }));
  function deskTop(ctx, t) {
    let gr = ctx.createLinearGradient(0, 0, 0, 1080); gr.addColorStop(0, "#9C6849"); gr.addColorStop(0.45, "#B07A55"); gr.addColorStop(1, "#8A5A3F");
    ctx.fillStyle = gr; ctx.fillRect(0, 0, 1920, 1080);
    ctx.strokeStyle = "rgba(70,36,18,0.22)"; ctx.lineWidth = 3; [262, 540, 818].forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1920, y); ctx.stroke(); });
    ctx.strokeStyle = "rgba(255,226,190,0.10)"; ctx.lineWidth = 2; [265, 543, 821].forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1920, y); ctx.stroke(); });
    GRAIN.forEach(gn => { ctx.strokeStyle = `rgba(90,48,24,${gn.a})`; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let x = 0; x <= 1920; x += 40) { const y = gn.y + Math.sin(x * gn.f + gn.ph) * 9; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); });
    LP.warmPool(ctx, 520, 300, 900, 0.5 + 0.04 * Math.sin(t * 1.3), 0.6);
    LP.glowE(ctx, 120, 60, 520, 320, "#FFC46A", 0.16 + 0.02 * Math.sin(t * 1.7));
    for (let i = 0; i < 14; i++) { const x = (hh(i) * 1920 + t * (8 + hh(i + 3) * 10)) % 1920, y = 120 + hh(i + 5) * 760 + Math.sin(t * 0.6 + i) * 14;
      ctx.fillStyle = `rgba(255,236,200,${0.10 + 0.08 * Math.sin(t * 1.1 + i * 1.7)})`; ctx.beginPath(); ctx.arc(x, y, 2 + hh(i + 7) * 2.5, 0, TAU); ctx.fill(); }
  }
  // gunting kecil (ikon), sama dengan bab 3
  function scissors(ctx, x, y, open, s = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const ang = 0.04 + 0.34 * open;
    [[1, "#FF8A3D", "#E9EEF8"], [-1, "#FFB547", "#C9D3E8"]].forEach(([sd, hc, bc]) => {
      ctx.save(); ctx.rotate(sd * ang);
      ctx.fillStyle = bc; ctx.beginPath(); ctx.moveTo(-7, -4); ctx.lineTo(7, -4); ctx.lineTo(3 * sd, 104); ctx.lineTo(0, 110); ctx.lineTo(-5 * sd, 90); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = hc; ctx.lineCap = "round"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(-6 * sd, -40); ctx.stroke();
      ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(-10 * sd, -60, 15, 21, 0, 0, TAU); ctx.stroke();
      ctx.restore(); });
    ctx.fillStyle = "#5A6390"; ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.fill(); ctx.restore();
  }
  const iconScissors = (ctx, x, y) => { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.5); scissors(ctx, 0, -18, 0.55, 0.55); ctx.restore(); };
  const iconDivide = (ctx, x, y) => { ctx.save(); ctx.fillStyle = AMB; ctx.beginPath(); ctx.arc(x, y - 26, 8, 0, TAU); ctx.arc(x, y + 26, 8, 0, TAU); ctx.fill(); H.rr(ctx, x - 30, y - 6, 60, 12, 6); ctx.fill(); ctx.restore(); };

  const PNL = { x: 150, y: 250, w: 1150, h: 440 }, R1 = 430, R2 = 590, BX0 = 586, BPT = 108, BS = 94, CNTX = 1234;
  const bxp = i => BX0 + i * BPT;
  function stepBlock(ctx, x, y, s, col, colD, num, numA, glowA, drop) {
    ctx.save(); ctx.translate(x, y - drop);
    if (glowA > 0.01) D.glow(ctx, 0, 0, s * 1.05, col, 0.5 * glowA);
    ctx.fillStyle = "rgba(10,8,30,0.35)"; H.rr(ctx, -s / 2 + 4, -s / 2 + 8 + drop * 0.3, s, s, s * 0.18); ctx.fill();
    ctx.fillStyle = col; H.rr(ctx, -s / 2, -s / 2, s, s, s * 0.18); ctx.fill();
    ctx.save(); H.rr(ctx, -s / 2, -s / 2, s, s, s * 0.18); ctx.clip(); ctx.fillStyle = colD; ctx.fillRect(-s / 2, s / 2 - s * 0.18, s, s * 0.18); ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.32)"; H.rr(ctx, -s * 0.36, -s * 0.4, s * 0.72, s * 0.1, s * 0.05); ctx.fill();
    if (numA > 0.01) { ctx.save(); ctx.globalAlpha *= numA; const k = popB(numA * 0.6); ctx.scale(k, k); txt(ctx, String(num), 0, s * 0.19, Math.round(s * 0.52), { align: "center", color: "#FFFFFF", weight: 900 }); ctx.restore(); }
    ctx.restore();
  }
  function plan41(b) {
    return { tMem: at(b, "Membandingkan"), tBan: at(b, "banyaknya"), tSep: at(b, "seperti"), tIni: at(b, "ini"), tAna: at(b, "analisis"), tAlg: at(b, "algoritma,"),
      tIst: at(b, "istilah"), tDip: at(b, "dipopulerkan"), tKnu: at(b, "Knuth.") };
  }
  // baris blok + angka (dipakai juga di dalam lensa)
  function rows41(ctx, l, t, p) {
    const c1 = i => p.tBan + 0.05 + i * 0.16, c2 = i => p.tSep + 0.12 + i * 0.2;
    for (let i = 0; i < 6; i++) { const d0 = 0.1 + i * 0.06, u = clamp((l - d0) / 0.5), drop = (1 - Math.min(1, spring(l - d0, 10, 0.55))) * 60;
      if (u <= 0) continue; ctx.save(); ctx.globalAlpha *= clamp(u * 3); const cu = l - c1(i);
      stepBlock(ctx, bxp(i), R1, BS, i < 4 ? RED : BLU, i < 4 ? RED_D : BLU_D, i + 1, clamp(cu / 0.25), cu > 0 ? Math.max(0, 1 - cu / 0.6) : 0, drop); ctx.restore(); }
    for (let i = 0; i < 2; i++) { const d0 = 0.3 + i * 0.06, u = clamp((l - d0) / 0.5), drop = (1 - Math.min(1, spring(l - d0, 10, 0.55))) * 60;
      if (u <= 0) continue; ctx.save(); ctx.globalAlpha *= clamp(u * 3); const cu = l - c2(i), em = fd(l, p.tIni + 0.25, 0.5) * (0.5 + 0.5 * Math.sin(t * 2.6));
      stepBlock(ctx, bxp(i), R2, BS, AMB, "#C9852C", i + 1, clamp(cu / 0.25), Math.max(cu > 0 ? Math.max(0, 1 - cu / 0.6) : 0, em * 0.7), drop); ctx.restore(); }
    // jumlah
    const n1 = l - c1(5) - 0.3, n2 = l - c2(1) - 0.3;
    if (n1 > 0) { ctx.save(); ctx.globalAlpha *= clamp(n1 / 0.15); ctx.translate(CNTX, R1); const k = popB(n1); ctx.scale(k, k); txt(ctx, "6", 0, 36, 104, { align: "center", color: "#FFFFFF", weight: 900 }); ctx.restore(); }
    if (n2 > 0) { ctx.save(); ctx.globalAlpha *= clamp(n2 / 0.15); ctx.translate(CNTX, R2); const k = popB(n2); ctx.scale(k, k); txt(ctx, "2", 0, 36, 104, { align: "center", color: GRN, weight: 900 }); ctx.restore(); }
  }
  function world41(ctx, l, t, p, z) {
    deskTop(ctx, t);
    ctx.save(); push(ctx, z, 760, 520);
    D.panel(ctx, PNL.x, PNL.y, PNL.w, PNL.h, { fill: "rgba(16,26,66,0.9)", stroke: "rgba(242,246,255,0.22)" });
    txt(ctx, "Banyak langkah", PNL.x + 40, PNL.y + 62, 46, { color: P.ink2, weight: 800 });
    ctx.fillStyle = "rgba(242,246,255,0.12)"; ctx.fillRect(PNL.x + 36, (R1 + R2) / 2 - 1, PNL.w - 72, 2);
    iconScissors(ctx, 205, R1 - 2); txt(ctx, "memotong", 250, R1 + 16, 48, { color: P.ink, weight: 800 });
    iconDivide(ctx, 205, R2); txt(ctx, "membagi", 250, R2 + 16, 48, { color: P.ink, weight: 800 });
    rows41(ctx, l, t, p);
    const ck = fd(l, p.tIni + 0.25, 0.45); if (ck > 0) check(ctx, CNTX + 2, R2 - 92, 44, GRN, ck);
    // judul: analisis algoritma (kata demi kata)
    const ua = l - p.tAna; if (ua > 0) {
      const s1 = "analisis", s2 = " algoritma", size = 76, w1 = tw(ctx, s1, size, 900), w2 = tw(ctx, s2, size, 900), full = w1 + w2;
      const grow = lerp(w1, full, eio((l - p.tAlg) / 0.3)), pw = grow + size * 1.2, ph = size * 1.7, cx = 725, cy = 148;
      ctx.save(); ctx.globalAlpha *= clamp(ua / 0.2); const k = popS(ua); ctx.translate(cx, cy); ctx.scale(k, k);
      D.glow(ctx, 0, 0, 420, AMB, 0.22 + 0.05 * Math.sin(t * 2));
      ctx.fillStyle = "rgba(10,18,52,0.92)"; H.rr(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2); ctx.fill(); ctx.strokeStyle = AMB; ctx.lineWidth = 4; ctx.stroke();
      const x0 = -grow / 2; txt(ctx, s1, x0, size * 0.36, size, { color: "#FFFFFF", weight: 900 });
      const u2 = l - p.tAlg; if (u2 > 0) { ctx.save(); ctx.globalAlpha *= clamp(u2 / 0.25); txt(ctx, s2, x0 + w1, size * 0.36, size, { color: AMB, weight: 900 }); ctx.restore(); }
      ctx.restore();
    }
    // Jilid 1 (tampak atas) + catatan istilah + nama
    const ub = l - (p.tIst - 0.3); if (ub > 0) {
      const e = eout(clamp(ub / 0.7)), bx = lerp(-200, 330, e), by = 805, rot = lerp(-0.4, -0.06, e);
      const us = l - p.tIst; if (us > 0) { const es = eout(clamp(us / 0.7)), sx = lerp(bx + 40, 820, es);
        ctx.save(); ctx.translate(sx, 806); ctx.rotate(0.025); ctx.globalAlpha *= clamp(us / 0.2);
        ctx.fillStyle = "rgba(50,22,8,0.3)"; ctx.fillRect(-282, -48, 576, 104); ctx.fillStyle = "#FBF4E2"; ctx.fillRect(-290, -56, 576, 104);
        ctx.strokeStyle = "rgba(90,140,220,0.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-270, 34); ctx.lineTo(266, 34); ctx.stroke();
        ctx.globalAlpha *= clamp((es - 0.6) / 0.3); txt(ctx, "analysis of algorithms", -2, 16, 48, { align: "center", color: "#26306E", weight: 800 }); ctx.restore(); }
      ctx.save(); ctx.translate(bx, by); ctx.rotate(rot);
      ctx.fillStyle = "rgba(50,22,8,0.35)"; H.rr(ctx, -142, -88, 300, 200, 10); ctx.fill();
      ctx.fillStyle = "#FFF8EC"; H.rr(ctx, -150, -92, 300, 196, 10); ctx.fill();
      ctx.fillStyle = "#E8665F"; H.rr(ctx, -156, -100, 300, 196, 10); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.fillRect(-130, -76, 248, 6); ctx.fillRect(-130, 66, 248, 6);
      ctx.fillStyle = "rgba(16,20,56,0.82)"; ctx.beginPath(); ctx.arc(-6, -4, 46, 0, TAU); ctx.fill();
      txt(ctx, "1", -6, 20, 66, { align: "center", color: "#FFFFFF", weight: 900 });
      ctx.restore();
    }
    lab(ctx, "Donald Knuth", 1405, 806, l - p.tKnu, { size: 52, col: AMB, glow: 160 });
    ctx.restore();
  }
  let LENS = null;
  function sceneB41(ctx, b, l, t) {
    const p = plan41(b), z = 1 + 0.022 * eio(l / b.dur), toS = (x, y) => [760 + (x - 760) * z, 520 + (y - 520) * z];
    world41(ctx, l, t, p, z);
    // Bip dengan kaca pembesar: memeriksa angka langkah (6 lalu 2), lalu judul; sesudah itu menunjuk nama
    const bxB = 1500, byB = 488 + Math.sin(t * 1.8) * 6, s = 210;
    let tg = [CNTX, R1 - 10];
    if (l > p.tIni) tg = [CNTX, lerp(R1 - 10, R2 - 10, fd(l, p.tIni, 0.4))];
    if (l > p.tAna - 0.1) { const u = fd(l, p.tAna - 0.1, 0.7); tg = [lerp(CNTX, 990, u), lerp(R2 - 10, 160, u)]; }
    const tgS = toS(...tg);
    if (l < p.tIst - 0.1) {
      B.draw(ctx, bxB, byB, s, { t, pose: "kacaPembesar", glass: 0.95, target: tgS, shadow: false,
        content: (c, cx, cy, r) => {
          // isi lensa dirender di kanvas kecil (bukan 1920 px), lalu ditempel: perbesaran 1,5x di sekitar titik yang dilihat
          const R = Math.ceil(r) + 4, S = 2 * R; if (!LENS) LENS = document.createElement("canvas"); if (LENS.width !== S) { LENS.width = S; LENS.height = S; }
          const lc = LENS.getContext("2d"); lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, S, S);
          const fx = lerp(cx, tgS[0], 0.85), fy = lerp(cy, tgS[1], 0.85);
          lc.translate(R, R); lc.scale(1.5, 1.5); lc.translate(-fx, -fy); world41(lc, l, t, p, z);
          c.drawImage(LENS, cx - R, cy - R); } });
    } else B.draw(ctx, bxB, byB, s, { t, pose: "tunjuk", target: toS(1405, 760), mood: "happy", shadow: false });
  }

  // =====================================================================================
  // b4_2: tebak angka 1–1000 di kelas
  // =====================================================================================
  const STEPS = [[500, "B"], [750, "B"], [876, "K"], [812, "B"], [845, "K"], [828, "B"], [837, "K"], [832, "B"], [835, "K"], [833, "B"]];
  const SECRET = 834, RANGES = [];
  { let lo = 1, hi = 1000; STEPS.forEach(([gs, a]) => { if (a === "B") lo = gs + 1; else hi = gs - 1; RANGES.push([lo, hi]); }); }
  const COUNTS = [1000].concat(RANGES.map(r => r[1] - r[0] + 1));            // 1000, 500, 250, 125, 63, 32, 16, 8, 4, 2, 1
  const FIRST_OUT = new Int8Array(1001).fill(-1);
  for (let v = 1; v <= 1000; v++) for (let i = 0; i < RANGES.length; i++) if (v < RANGES[i][0] || v > RANGES[i][1]) { FIRST_OUT[v] = i; break; }
  const BD = { x: 84, y: 46, w: 1112, h: 654 }, GX = 160, GY = 168, PT = 19, CS = 16, COLS = 50;
  const cellXY = v => [GX + ((v - 1) % COLS) * PT + CS / 2, GY + Math.floor((v - 1) / COLS) * PT + CS / 2];
  const GS = { x: 1470, y: 1066, h: 500 }, FR = { x: 1745, y: 1066, h: 500 }, BIP2 = { x: 1222, y: 606, s: 128 };
  const STEP_D = [0.8, 0.7, 0.62, 0.56, 0.52, 0.48, 0.46, 0.46];
  function plan42(b) {
    if (b.__p42) return b.__p42;
    const p = { tCoba: at(b, "Coba"), tTeb: at(b, "tebak angka"), tSatu: at(b, "satu sampai"), tSeribu: at(b, "seribu."), tTem: at(b, "Temanmu"), tBes: at(b, "lebih besar"), tKec: at(b, "lebih kecil"),
      tMen: at(b, "Menebak satu"), tSrb: at(b, "seribu tebakan"), tKal: at(b, "Kalau"), tMid: at(b, "menebak angka"), tTgh: at(b, "tengah,"), tJaw: at(b, "setiap jawaban"),
      tBuang: at(b, "membuang"), tSep: at(b, "separuh"), tSpl: at(b, "sepuluh") };
    p.tScan = p.tMen + 0.15; p.wave = (p.tSeribu + 0.15 - p.tSatu) / 1000;
    const st = [];
    st.push({ tg: p.tMid, ta: p.tJaw + 0.35, tc: p.tBuang, cd: 0.8, tt: p.tSep + 0.3 });
    { const s = p.tSep + 0.75; st.push({ tg: s, ta: s + 0.45, tc: s + 0.75, cd: 0.5, tt: s + 1.2 }); }
    let s = Math.max(st[1].tt + 0.18, p.tSpl + 0.1);
    STEP_D.forEach(d => { st.push({ tg: s, ta: s + 0.3 * d, tc: s + 0.5 * d, cd: Math.max(0.2, 0.36 * d), tt: s + 0.82 * d }); s += d; });
    p.st = st; p.tFound = s + 0.05;
    b.__p42 = p; return p;
  }
  const scanN = u => 1 + Math.floor(2.5 * u + 6 * u * u * u);
  // ---- set kelas ----
  const SMUDGE = Array.from({ length: 9 }, (_, i) => [BD.x + 80 + hh(i + 20) * (BD.w - 160), BD.y + 60 + hh(i + 30) * (BD.h - 120), 60 + hh(i + 40) * 120, hh(i + 50) * 3]);
  function classroom(ctx, t) {
    let gr = ctx.createLinearGradient(0, 0, 0, 900); gr.addColorStop(0, "#4862AC"); gr.addColorStop(1, "#5C78C0");
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, 900);
    ctx.fillStyle = "rgba(255,255,255,0.035)"; for (let x = 20; x < W; x += 64) ctx.fillRect(x, 0, 3, 760);
    ctx.fillStyle = "rgba(255,255,255,0.05)"; for (let x = 52; x < W; x += 64) for (let y = 40; y < 740; y += 64) { ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#3D5499"; ctx.fillRect(0, 760, W, 140); ctx.fillStyle = "rgba(255,255,255,0.16)"; ctx.fillRect(0, 754, W, 7);
    ctx.fillStyle = "rgba(0,0,0,0.08)"; for (let x = 0; x < W; x += 180) ctx.fillRect(x, 761, 3, 139);
    gr = ctx.createLinearGradient(0, 900, 0, 1080); gr.addColorStop(0, "#A06F4C"); gr.addColorStop(1, "#7C5036"); ctx.fillStyle = gr; ctx.fillRect(0, 900, W, 180);
    ctx.fillStyle = "rgba(60,30,14,0.25)"; for (let i = 0; i < 4; i++) ctx.fillRect(0, 930 + i * 40, W, 3);
    // sinar matahari dari jendela di kanan (di luar layar)
    ctx.save(); ctx.globalCompositeOperation = "screen";
    for (let i = 0; i < 3; i++) { const ox = 1500 + i * 170 + Math.sin(t * 0.3 + i) * 20, a = 0.05 + 0.02 * Math.sin(t * 0.7 + i * 2);
      const g2 = ctx.createLinearGradient(ox, 0, ox - 520, 900); g2.addColorStop(0, `rgba(255,236,190,${a})`); g2.addColorStop(1, "rgba(255,236,190,0)");
      ctx.fillStyle = g2; ctx.beginPath(); ctx.moveTo(ox, -10); ctx.lineTo(ox + 110, -10); ctx.lineTo(ox - 420, 920); ctx.lineTo(ox - 560, 920); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    for (let i = 0; i < 16; i++) { const x = (hh(i + 60) * W + t * (6 + hh(i + 3) * 9)) % W, y = 80 + hh(i + 70) * 800 + Math.sin(t * 0.5 + i) * 16;
      ctx.fillStyle = `rgba(255,244,214,${0.10 + 0.08 * Math.sin(t * 1.1 + i * 1.7)})`; ctx.beginPath(); ctx.arc(x, y, 2 + hh(i + 7) * 2.5, 0, TAU); ctx.fill(); }
  }
  function boardFrame(ctx) {
    const { x, y, w, h } = BD;
    ctx.fillStyle = "rgba(14,18,50,0.35)"; H.rr(ctx, x + 10, y + 14, w, h, 14); ctx.fill();
    ctx.fillStyle = "#8A5A3C"; H.rr(ctx, x, y, w, h, 14); ctx.fill(); ctx.fillStyle = "#A8714C"; ctx.fillRect(x + 8, y + 4, w - 16, 5);
    const gr = ctx.createLinearGradient(0, y + 20, 0, y + h - 20); gr.addColorStop(0, "#2F6A5A"); gr.addColorStop(1, "#25574A");
    ctx.fillStyle = gr; ctx.fillRect(x + 20, y + 20, w - 40, h - 40);
    ctx.save(); ctx.beginPath(); ctx.rect(x + 20, y + 20, w - 40, h - 40); ctx.clip();
    SMUDGE.forEach(([sx, sy, r, rot]) => { ctx.fillStyle = "rgba(235,245,230,0.035)"; ctx.beginPath(); ctx.ellipse(sx, sy, r, r * 0.35, rot, 0, TAU); ctx.fill(); });
    ctx.restore();
    // baki kapur
    ctx.fillStyle = "#6E452E"; H.rr(ctx, x - 6, y + h - 6, w + 12, 22, 6); ctx.fill(); ctx.fillStyle = "#8F5D3E"; ctx.fillRect(x - 2, y + h - 6, w + 4, 5);
    ctx.fillStyle = "#F4F1E6"; H.rr(ctx, x + 120, y + h - 16, 60, 12, 5); ctx.fill(); ctx.fillStyle = "#FFD38A"; H.rr(ctx, x + 200, y + h - 16, 44, 12, 5); ctx.fill();
  }
  // teks kapur yang dibuka dari kiri (reveal 0..1 dari lebar penuh)
  function chalk(ctx, s, x, y, size, col, rev, align = "left") {
    if (rev <= 0) return; const w = tw(ctx, s, size, 800), x0 = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
    ctx.save(); ctx.beginPath(); ctx.rect(x0 - 6, y - size * 1.1, w * clamp(rev) + 12, size * 1.5); ctx.clip();
    txt(ctx, s, x0, y, size, { color: col, weight: 800 }); ctx.restore();
  }
  function cellState(v, l, p) {
    const shown = clamp((l - (p.tSatu + (v - 1) * p.wave)) / 0.18);
    let dead = 0, hot = 0;
    if (l >= p.tScan && l < p.tKal + 0.8) { const n = scanN(l - p.tScan), rv = 1 - fd(l, p.tKal + (v - 1) * 0.0004, 0.35);
      if (v < n) dead = rv; else if (v === n) hot = 1 - fd(l, p.tKal, 0.25); }
    const i = FIRST_OUT[v];
    if (i >= 0 && l >= p.st[i].tg - 0.05) { const s = p.st[i], gs = STEPS[i][0], delay = clamp(Math.abs(v - gs) / Math.max(1, COUNTS[i])) * s.cd * 0.75;
      dead = Math.max(dead, clamp((l - s.tc - delay) / (s.cd * 0.3 + 0.08)));
      if (v === gs) hot = Math.max(hot, 1 - fd(l, s.tc + 0.12, 0.2)); }
    return { shown, dead, hot };
  }
  function drawGrid(ctx, l, t, p) {
    const found = fd(l, p.tFound, 0.3);
    for (let v = 1; v <= 1000; v++) {
      const s = cellState(v, l, p); if (s.shown <= 0.01) continue; const [cx, cy] = cellXY(v), x = cx - CS / 2, y = cy - CS / 2;
      const a = lerp(0.9, 0.11, s.dead) * s.shown;
      if (v === SECRET && found > 0) continue;
      if (s.hot > 0.01) { ctx.globalAlpha = s.shown; D.glow(ctx, cx, cy, 34, AMB, 0.8 * s.hot); ctx.fillStyle = AMB; ctx.fillRect(x - 2, y - 2, CS + 4, CS + 4); ctx.globalAlpha = 1; continue; }
      ctx.globalAlpha = a; ctx.fillStyle = "#EAF3E4"; ctx.fillRect(x, y, CS, CS);
    }
    ctx.globalAlpha = 1;
    if (found > 0) { const [cx, cy] = cellXY(SECRET), pulse = 0.5 + 0.5 * Math.sin(t * 4);
      D.glow(ctx, cx, cy, 70 + 10 * pulse, GRN, 0.8 * found); ctx.fillStyle = GRN; ctx.fillRect(cx - CS / 2 - 3, cy - CS / 2 - 3, CS + 6, CS + 6);
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.globalAlpha = found; ctx.beginPath(); ctx.arc(cx, cy, 22 + 4 * pulse, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; }
  }
  // garis tepi kotak-kotak yang masih mungkin (per baris)
  function rangeOutline(ctx, lo, hi, a, col) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineJoin = "round";
    for (let r = Math.floor((lo - 1) / COLS); r <= Math.floor((hi - 1) / COLS); r++) {
      const a0 = Math.max(lo, r * COLS + 1), a1 = Math.min(hi, r * COLS + COLS); const [x0, y0] = cellXY(a0), [x1] = cellXY(a1);
      H.rr(ctx, x0 - CS / 2 - 5, y0 - CS / 2 - 5, x1 - x0 + CS + 10, CS + 10, 6); ctx.stroke(); }
    ctx.restore();
  }
  function zoomStrip(ctx, l, t, p) {
    const [lo, hi] = RANGES[6], a = fd(l, p.st[6].tt, 0.35), tw2 = 104, gap = 8, x0 = 186, y = 614, n = hi - lo + 1, found = fd(l, p.tFound, 0.3);
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
    const [ax] = cellXY(lo), [bx] = cellXY(hi), ay = cellXY(lo)[1] + CS / 2 + 8;
    ctx.strokeStyle = D.hexA(AMB, 0.7); ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.moveTo(ax - CS / 2 - 4, ay); ctx.lineTo(x0, y - 44); ctx.moveTo(bx + CS / 2 + 4, ay); ctx.lineTo(x0 + n * (tw2 + gap) - gap, y - 44); ctx.stroke(); ctx.setLineDash([]);
    for (let v = lo; v <= hi; v++) { const i = v - lo, x = x0 + i * (tw2 + gap), u = l - p.st[6].tt - i * 0.04; if (u <= 0) continue;
      const st = cellState(v, l, p), isF = v === SECRET && found > 0, k = popS(u);
      ctx.save(); ctx.translate(x + tw2 / 2, y); ctx.scale(k, k); ctx.globalAlpha *= clamp(u / 0.15) * lerp(1, 0.4, isF ? 0 : st.dead);
      if (isF) D.glow(ctx, 0, 0, 90, GRN, 0.6 * found); else if (st.hot > 0.05) D.glow(ctx, 0, 0, 80, AMB, 0.5 * st.hot);
      ctx.fillStyle = isF ? GRN : st.hot > 0.5 ? AMB : "rgba(234,243,228,0.92)"; H.rr(ctx, -tw2 / 2, -40, tw2, 80, 12); ctx.fill();
      txt(ctx, String(v), 0, 15, 44, { align: "center", color: isF ? "#0E2A1A" : "#1E3A30", weight: 900 });
      if (st.dead > 0.05 && !isF) { ctx.strokeStyle = "#C2465A"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-tw2 * 0.38, 26); ctx.lineTo(-tw2 * 0.38 + tw2 * 0.76 * clamp(st.dead * 1.5), -26); ctx.stroke(); }
      ctx.restore(); }
    ctx.restore();
  }
  function bubble(ctx, s, x, y, tail, u, o = {}) {
    if (u <= 0) return; const a = clamp(u / 0.15) * (o.a == null ? 1 : o.a); if (a <= 0.01) return;
    const size = o.size || 48, ar = o.arrow || 0, tW = tw(ctx, s, size, 900), w = tW + size * 1.0 + (ar ? size * 1.0 : 0), h = size * 1.7;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); const k = popS(u); ctx.scale(k, k);
    ctx.fillStyle = "rgba(14,18,50,0.28)"; H.rr(ctx, -w / 2 + 5, -h / 2 + 8, w, h, h * 0.45); ctx.fill();
    ctx.fillStyle = o.fill || "#FFFFFF";
    if (tail) { const tx = tail[0] - x, ty = tail[1] - y, bx = clamp(tx * 0.35, -w * 0.3, w * 0.3); ctx.beginPath(); ctx.moveTo(bx - 18, h / 2 - 4); ctx.lineTo(bx + 18, h / 2 - 4); ctx.lineTo(tx * 0.8, Math.max(h / 2 + 26, ty * 0.8)); ctx.closePath(); ctx.fill(); }
    H.rr(ctx, -w / 2, -h / 2, w, h, h * 0.45); ctx.fill();
    if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = 4; ctx.stroke(); }
    const x0 = -w / 2 + size * 0.5; txt(ctx, s, x0, size * 0.36, size, { color: o.color || INK, weight: 900 });
    if (ar) tri(ctx, x0 + tW + size * 0.62, 0, size * 0.62, ar, o.color || INK);
    ctx.restore();
  }
  const ANS = { B: { s: "lebih besar", fill: "#DDF7E6", color: "#16703F", arrow: 1 }, K: { s: "lebih kecil", fill: "#DCEBFF", color: "#1D4D9E", arrow: -1 } };
  // kartu rahasia di tangan teman (satuan badan); show 0..1 membalik kartu dan menampilkan angka
  const cardFn = show => (c, info) => {
    const fl = 1, flipK = Math.cos(Math.PI * clamp(show)); c.save(); c.scale(fl * Math.abs(flipK), 1); c.rotate(-0.08 * fl);
    c.fillStyle = "rgba(14,18,50,0.25)"; H.rr(c, -11, -24, 24, 26, 2.5); c.fill();
    const front = flipK < 0; c.fillStyle = front ? "#FFFFFF" : "#FF6F91"; H.rr(c, -12, -26, 24, 26, 2.5); c.fill();
    if (!front) { c.strokeStyle = "rgba(255,255,255,0.75)"; c.lineWidth = 1.2; H.rr(c, -8, -24, 16, 22, 2); c.stroke(); txt(c, "?", 0, -7.5, 15, { align: "center", color: "#FFFFFF", weight: 900 }); }
    else txt(c, String(SECRET), 0, -9.8, 8.6, { align: "center", color: "#16703F", weight: 900 });
    c.restore();
  };
  function students(ctx, l, t, p) {
    const fin = l - p.tFound;
    // penebak (berhijab): bingung → membaca papan → lega
    const kG = fd(l, p.tMen - 0.4, 0.5), gOpt = { t, age: "remaja", hair: "hijab", hijab: "#F2A93B", outfit: "kemeja", top: "#F3F5FB", bawah: "rokPanjang", bottom: "#34407E", skin: 2, seed: 3, tanya: false, flip: false };
    if (fin > 0) Object.assign(gOpt, { pose: "berdiri", blend: { to: "lega", k: eio(fin / 0.5) }, face: "senang", look: [0.6, -0.2] });
    else if (l < p.tMen - 0.4) Object.assign(gOpt, { pose: "garuk", look: [0.7, -0.3], face: "bingung" });
    else Object.assign(gOpt, { pose: "garuk", blend: { to: "berdiri", k: eio(kG) }, look: [-0.9, -0.5], face: l > p.tSrb - 0.6 && l < p.tKal + 0.3 ? "ngantuk" : "netral" });
    const ga = OR.draw(ctx, GS.x, GS.y, GS.h, gOpt);
    // teman: memegang kartu rahasia
    const fa = OR.draw(ctx, FR.x, FR.y, FR.h, { t, age: "remaja", pose: "tunjukBarang", flip: true, hair: "pendek", outfit: "kemeja", top: "#F3F5FB", bawah: "celana", bottom: "#34407E",
      skin: 3, seed: 7, face: fin > 0 ? "tertawa" : "senang", look: [-0.8, -0.1], holding: cardFn(fd(l, p.tFound + 0.15, 0.4)) });
    return { ga, fa };
  }
  function counterPanel(ctx, l, t, p) {
    const a = fd(l, p.tMen - 0.1, 0.35); if (a <= 0) return;
    const x = 1250, y = 56, w = 574, h = 236; ctx.save(); ctx.globalAlpha *= a;
    const scanning = l < p.tKal, k = p.st.filter(s => l >= s.tg).length, done = k >= 10, glw = done ? fd(l, p.st[9].tg, 0.3) : 0;
    if (glw > 0) D.glow(ctx, x + w / 2, y + h / 2, 360, GRN, 0.3 * glw);
    D.panel(ctx, x, y, w, h, { fill: "rgba(16,26,66,0.92)", stroke: done ? D.hexA(GRN, 0.9) : "rgba(242,246,255,0.25)", lw: done ? 4 : 2 });
    let num, col, title, bump;
    if (scanning) { num = l >= p.tScan ? scanN(l - p.tScan) : 0; col = "#FF8A8F"; title = "Satu per satu"; bump = 0.5; }
    else { num = k; col = done ? GRN : AMB; title = "Tebak di tengah"; bump = k ? l - p.st[k - 1].tg : l - p.tKal; }
    const ta = scanning ? 1 - fd(l, p.tKal - 0.25, 0.25) : fd(l, p.tKal, 0.3);
    ctx.save(); ctx.globalAlpha *= ta; txt(ctx, title, x + 34, y + 62, 46, { color: P.ink2, weight: 800 });
    txt(ctx, "tebakan", x + 34 + Math.max(150, tw(ctx, String(num), 120, 900)) + 22, y + 204, 46, { color: P.ink, weight: 800 });
    ctx.save(); const nw = tw(ctx, String(num), 120, 900); ctx.translate(x + 34 + nw / 2, y + 162); const kk = popB(clamp(bump / 0.6) * 0.6 + 0.4 * (bump > 0.6 ? 1 : 0)); ctx.scale(kk, kk);
    txt(ctx, String(num), 0, 42, 120, { align: "center", color: col, weight: 900 }); ctx.restore(); ctx.restore();
    // sepuluh bulatan
    const pa = fd(l, p.tSpl, 0.4); if (pa > 0 && !scanning) { for (let i = 0; i < 10; i++) { const px = x + 360 + (i % 5) * 42, py = y + 100 + Math.floor(i / 5) * 46, u = l - p.tSpl - i * 0.04; if (u <= 0) continue;
        const kk = popS(u), on = i < k, onU = on ? l - p.st[i].tg : 0; ctx.save(); ctx.globalAlpha *= clamp(u / 0.15); ctx.translate(px, py); ctx.scale(kk, kk);
        ctx.strokeStyle = D.hexA(P.ink, 0.55); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 15, 0, TAU); ctx.stroke();
        if (on) { const s2 = popB(onU); ctx.fillStyle = done ? GRN : AMB; ctx.beginPath(); ctx.arc(0, 0, 15 * s2, 0, TAU); ctx.fill(); }
        ctx.restore(); } }
    ctx.restore();
  }
  function chain(ctx, l, t, p) {
    const a0 = fd(l, p.tKal, 0.35); if (a0 <= 0) return;
    ctx.save(); ctx.globalAlpha *= a0; txt(ctx, "sisa kemungkinan", 96, 770, 44, { color: "#E8EEFF", weight: 800 }); ctx.restore();
    const times = [p.tKal + 0.3].concat(p.st.map(s => s.tt)); let x = 96; const y = 828, size = 44, h = 72;
    COUNTS.forEach((n, j) => {
      const s = String(n), w = tw(ctx, s, size, 900) + 28, u = l - times[j];
      if (u > 0) { const last = j === COUNTS.length - 1, cur = j === COUNTS.length - 1 || l < times[j + 1];
        if (j > 0) { ctx.save(); ctx.globalAlpha *= clamp(u / 0.15); ctx.strokeStyle = "#E8EEFF"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(x - 21, y - 9); ctx.lineTo(x - 13, y); ctx.lineTo(x - 21, y + 9); ctx.stroke(); ctx.restore(); }
        ctx.save(); ctx.globalAlpha *= clamp(u / 0.15); ctx.translate(x + w / 2, y); const k = popS(u); ctx.scale(k, k);
        if (cur) D.glow(ctx, 0, 0, 80, last ? GRN : AMB, 0.35);
        ctx.fillStyle = "rgba(14,22,60,0.92)"; H.rr(ctx, -w / 2, -h / 2, w, h, 16); ctx.fill(); ctx.strokeStyle = cur ? (last ? GRN : AMB) : "rgba(242,246,255,0.25)"; ctx.lineWidth = cur ? 4 : 2; ctx.stroke();
        txt(ctx, s, 0, 16, size, { align: "center", color: last ? GRN : cur ? AMB : "#FFFFFF", weight: 900 }); ctx.restore(); }
      x += w + 30;
    });
  }
  function drawB42(ctx, b, l, t, o = {}) {
    const p = plan42(b);
    classroom(ctx, t);
    ctx.save(); push(ctx, 1 + 0.012 * eio(Math.min(l, b.dur) / b.dur), 700, 420);
    boardFrame(ctx);
    // judul papan + label 1 dan 1000
    const rev = l < p.tSeribu ? 0.62 * fd(l, p.tTeb, 0.55) : lerp(0.62, 1, fd(l, p.tSeribu, 0.35));
    chalk(ctx, "Tebak angka 1–1000", 150, 128, 52, "#F4F6EE", rev);
    lab(ctx, "1", 128, cellXY(1)[1], l - p.tSatu, { size: 44, col: "#EAF3E4", fill: "rgba(20,50,40,0.95)" });
    { const u = l - (p.tSeribu + 0.15); if (u > 0) { ctx.save(); ctx.globalAlpha *= clamp(u / 0.2) * (1 - fd(l, p.st[6].tt - 0.3, 0.3)); txt(ctx, "1000", 1110, 606, 44, { align: "right", color: "#F4F6EE", weight: 800 });
      ctx.strokeStyle = "rgba(244,246,238,0.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1101, 562); ctx.lineTo(1101, 570); ctx.stroke(); ctx.restore(); } }
    drawGrid(ctx, l, t, p);
    // kotak sisa (mulai saat tinggal ≤ 125)
    const kTile = p.st.filter(s => l >= s.tt).length;
    if (kTile >= 3 && l < p.tFound) { const [lo, hi] = RANGES[kTile - 1]; rangeOutline(ctx, lo, hi, fd(l, p.st[kTile - 1].tt, 0.2) * (0.75 + 0.25 * Math.sin(t * 5)), AMB); }
    // garis tengah untuk tebakan pertama
    const tm = fd(l, p.tTgh - 0.15, 0.3) * (1 - fd(l, p.st[0].tc + 0.9, 0.4));
    if (tm > 0) { ctx.save(); ctx.globalAlpha *= tm; ctx.strokeStyle = AMB; ctx.lineWidth = 5; ctx.setLineDash([16, 10]); ctx.lineDashOffset = -t * 30;
      const yM = GY + 10 * PT - 1.5; ctx.beginPath(); ctx.moveTo(GX - 12, yM); ctx.lineTo(GX + COLS * PT + 6, yM); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      lab(ctx, "tengah", 300, GY + 10 * PT - 1.5, l - p.tTgh + 0.15, { size: 46, col: AMB, a: tm }); }
    // "sisa: a–b" di kanan atas papan
    if (l >= p.tKal) { const kk = kTile, [lo, hi] = kk ? RANGES[kk - 1] : [1, 1000], s = lo === hi ? `sisa: ${lo}` : `sisa: ${lo}–${hi}`, u = l - (kk ? p.st[kk - 1].tt : p.tKal);
      ctx.save(); ctx.globalAlpha *= fd(l, p.tKal, 0.3); ctx.translate(1150, 128); const k = 1 + 0.12 * Math.max(0, 1 - u / 0.3); ctx.scale(k, k);
      txt(ctx, s, 0, 0, 50, { align: "right", color: lo === hi ? GRN : AMB, weight: 900 }); ctx.restore(); }
    // tebakan sekarang di atas kotaknya
    const kG = p.st.filter(s => l >= s.tg).length;
    if (kG > 0 && l < p.tFound + 0.1) { const gs = STEPS[kG - 1][0], [cx, cy] = cellXY(gs), u = l - p.st[kG - 1].tg; lab(ctx, String(gs), Math.min(cx, 1110), cy - 50, u, { size: 48, col: AMB, a: 1 - fd(l, p.tFound - 0.1, 0.2) }); }
    // perbesaran: saat tinggal 8 kemungkinan, angkanya ditampilkan besar di bawah kotak-kotak
    if (kTile >= 7) zoomStrip(ctx, l, t, p);
    // tebak satu per satu: "bisa sampai 1000 tebakan"
    const ps = l - p.tSrb; if (ps > 0) lab(ctx, "bisa sampai 1000 tebakan!", 635, 360, ps, { size: 54, col: "#FF8A8F", a: 1 - fd(l, p.tKal + 0.1, 0.4), glow: 260 });
    // ketemu
    const uf = l - p.tFound; if (uf > 0) { const [cx, cy] = cellXY(SECRET); lab(ctx, String(SECRET), cx, cy - 66, uf, { size: 66, col: GRN, big: true, glow: 160 });
      sparks(ctx, cx, cy, uf, 16, 150, [AMB, GRN, "#FFFFFF", P.pink]); }
    ctx.restore();
    // garis sisa kemungkinan, panel penghitung
    chain(ctx, l, t, p);
    counterPanel(ctx, l, t, p);
    // murid + gelembung
    const { ga, fa } = students(ctx, l, t, p);
    const gHead = ga.top || ga.head, fHead = fa.top || fa.head;
    const gb = [1400, 476], fb = [1662, 452], fb2 = [1662, 352], fa2 = [1662, 398];
    if (l < p.tMen) {
      const fo = 1 - fd(l, p.tMen - 0.35, 0.3);
      bubble(ctx, ANS.B.s, fb2[0], fb2[1], null, l - p.tBes, { ...ANS.B, a: fo });
      bubble(ctx, ANS.K.s, fb[0], fb[1], fHead, l - p.tKec, { ...ANS.K, a: fo });
    } else if (l < p.tKal) {
      const n = scanN(Math.max(0, l - p.tScan)), u = l - p.tScan;
      bubble(ctx, `${n}?`, gb[0], gb[1], gHead, u, { size: 48, a: 1 - fd(l, p.tKal - 0.2, 0.25) });
      bubble(ctx, ANS.B.s, fa2[0], fa2[1], fHead, l - p.tScan - 0.3, { ...ANS.B, a: 1 - fd(l, p.tKal - 0.2, 0.25) });
    } else {
      const kG2 = p.st.filter(s => l >= s.tg).length, kA = p.st.filter(s => l >= s.ta).length;
      if (l < p.tFound) {
        if (kG2 > 0) bubble(ctx, `${STEPS[kG2 - 1][0]}?`, gb[0], gb[1], gHead, l - p.st[kG2 - 1].tg, { size: 48 });
        if (kA > 0) { const A = ANS[STEPS[kA - 1][1]]; bubble(ctx, A.s, fa2[0], fa2[1], fHead, l - p.st[kA - 1].ta, { ...A }); }
      } else {
        bubble(ctx, `${SECRET}!`, gb[0], gb[1], gHead, l - p.tFound, { size: 52, stroke: GRN });
        bubble(ctx, "Betul!", fa2[0], fa2[1], fHead, l - p.tFound - 0.3, { size: 52, fill: GRN, color: "#0E2A1A" });
      }
    }
    // Bip: menunjuk kotak yang sedang ditebak, lelah saat satu per satu, bersorak di akhir
    if (o.noBip) return;
    let bo = { t, pose: "diam", mood: "happy", shadow: false, look: [-0.6, -0.4] }, by = BIP2.y + Math.sin(t * 1.9) * 6;
    if (l >= p.tScan && l < p.tKal) { const n = scanN(l - p.tScan); bo = { t, pose: "tunjuk", shadow: false, target: cellXY(Math.min(1000, n)), mood: l > p.tSrb - 0.5 ? "sad" : "think", sweat: l > p.tSrb - 0.5 }; }
    else if (l >= p.st[0].tg && l < p.tFound) { const kk = p.st.filter(s => l >= s.tg).length; bo = { t, pose: "tunjuk", shadow: false, target: cellXY(STEPS[kk - 1][0]), mood: "happy" }; }
    else if (l >= p.tFound) { const u = l - p.tFound; by -= Math.abs(Math.sin(u * 6.2)) * 34 * Math.exp(-Math.max(0, u - 1.2) * 1.5); bo = { t, pose: "diam", mood: "wow", wave: u, shadow: false }; if (u > 0.6) bo.mood = "happy"; }
    B.draw(ctx, BIP2.x, by, BIP2.s, bo);
  }
  function sceneB42(ctx, b, l, t) { drawB42(ctx, b, l, t); }

  // =====================================================================================
  // b4_3: Jilid 3 → HP: mencari satu nama di antara 4.000 nama urut
  // =====================================================================================
  const NAMES = ["Adi", "Agus", "Ahmad", "Ani", "Arif", "Bagus", "Bayu", "Budi", "Cahya", "Citra", "Dani", "Desi", "Dewi", "Dimas", "Dina", "Eko", "Endah", "Fajar", "Farhan", "Fitri",
    "Gita", "Hadi", "Hana", "Hendra", "Indah", "Intan", "Irfan", "Joko", "Kartika", "Kevin", "Lestari", "Lina", "Made", "Maya", "Mega", "Nadia", "Nanda", "Novi", "Nurul", "Oki",
    "Putra", "Putri", "Rani", "Rendi", "Rina", "Rizki", "Rudi", "Sari", "Satria", "Sekar", "Sigit", "Silvia", "Sinta", "Siska", "Siti", "Sri", "Suci", "Taufik", "Tegar", "Tika",
    "Udin", "Umi", "Vina", "Wahyu", "Wati", "Yanti", "Yoga", "Yudi", "Zahra", "Zaki"];
  const NN = 4000, NP = NAMES.length, PSINTA = NAMES.indexOf("Sinta"), TGT = Math.round(PSINTA / (NP - 1) * (NN - 1));
  const pIdx = i => Math.round(i / (NN - 1) * (NP - 1));
  const HALV = (() => { const out = [[0, NN]]; let lo = 0, n = NN; while (n > 1) { const m = Math.ceil(n / 2); if (TGT < lo + m) n = m; else { lo = lo + n - m; n = m; } out.push([lo, n]); } return out; })();   // 13 keadaan: 4000 → 1
  const AV = ["#E8665F", "#36B3A3", "#6A7BE0", "#E9A23B", "#4FD67F", "#9A6FD6", "#55A8FF"];
  function listPhone(c, w, h, t, st) {
    const u = w / 100;
    c.fillStyle = "#F1F3FC"; c.fillRect(0, 0, w, h);
    const hh2 = u * 30, hg = c.createLinearGradient(0, 0, w, hh2); hg.addColorStop(0, "#3FA7C9"); hg.addColorStop(1, "#4D6FD8"); c.fillStyle = hg; c.fillRect(0, 0, w, hh2);
    c.fillStyle = "rgba(255,255,255,0.95)"; H.rr(c, u * 6, u * 8, w - u * 12, u * 18, u * 9); c.fill();
    KY.ikon(c, "cari", u * 17, u * 17, u * 10, "#4D6FD8");
    if (st.q) { txt(c, st.q, u * 30, u * 17 + 15, 44, { weight: 800, color: "#1E2766" }); if (st.caret) { const qw = tw(c, st.q, 44, 800); c.fillStyle = "#4D6FD8"; c.fillRect(u * 30 + qw + 4, u * 17 - 20, 4, 40); } }
    const rows = 7, rowH = (h - hh2 - u * 6) / rows, y0 = hh2 + u * 3;
    c.save(); c.beginPath(); c.rect(0, hh2, w, h - hh2); c.clip();
    for (let r = 0; r < rows; r++) {
      const idx = st.k - 3 + r, y = y0 + r * rowH + (st.shift || 0) * rowH; if (idx < 0 || idx >= NP) continue;
      const mid = r === 3 && st.hl;
      c.save(); c.globalAlpha *= (st.dim && !mid ? 0.55 : 1) * (st.na == null ? 1 : st.na);
      if (mid) { c.fillStyle = st.found ? "rgba(79,214,127,0.4)" : "rgba(255,181,71,0.45)"; H.rr(c, u * 3, y + 4, w - u * 6, rowH - 8, u * 4); c.fill(); }
      c.fillStyle = AV[idx % AV.length]; c.beginPath(); c.arc(u * 15, y + rowH / 2, u * 7, 0, TAU); c.fill();
      txt(c, NAMES[idx], u * 28, y + rowH / 2 + 16, 44, { weight: 800, color: "#1E2766" });
      if (mid && !st.found && st.dir) tri(c, w - u * 12, y + rowH / 2, u * 9, st.dir, "#E08A16");
      if (mid && st.found) check(c, w - u * 13, y + rowH / 2 + 2, u * 11, "#1F9E57", 1);
      c.restore();
      c.fillStyle = "rgba(40,50,110,0.1)"; c.fillRect(u * 6, y + rowH, w - u * 12, 2);
    }
    c.restore();
  }
  function laptop(ctx, x, y, s, t, a) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = "rgba(8,12,40,0.35)"; ctx.beginPath(); ctx.ellipse(10, 150, 250, 22, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2A3270"; H.rr(ctx, -200, -170, 400, 260, 16); ctx.fill();
    const sg = ctx.createLinearGradient(0, -150, 0, 70); sg.addColorStop(0, "#3D6FD6"); sg.addColorStop(1, "#2C4AA8"); ctx.fillStyle = sg; H.rr(ctx, -184, -154, 368, 228, 8); ctx.fill();
    for (let i = 0; i < 6; i++) { ctx.fillStyle = `rgba(255,255,255,${0.25 + 0.15 * Math.sin(t * 2 + i)})`; H.rr(ctx, -160, -132 + i * 34, 90 + hh(i + 3) * 180, 14, 7); ctx.fill(); }
    ctx.fillStyle = "#4A5396"; ctx.beginPath(); ctx.moveTo(-232, 96); ctx.lineTo(232, 96); ctx.lineTo(262, 140); ctx.lineTo(-262, 140); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#5C66AE"; ctx.fillRect(-232, 92, 464, 8); ctx.fillStyle = "#3A4282"; H.rr(ctx, -50, 112, 100, 14, 6); ctx.fill();
    ctx.restore();
  }
  // buku tampak depan: open 0..1 (sampul berputar ke kiri), flip 0..n (halaman dibalik), diag = waktu animasi diagram
  function book3(ctx, l, t, open, flip, diag, hlS) {
    const w = 380, h = 500, sp = lerp(960 - w / 2, 960, eio(open)), top = 300;
    ctx.save();
    shadowE(ctx, sp + (open > 0.5 ? 0 : w / 2), top + h + 18, w * (open > 0.5 ? 1.05 : 0.6), 22, 0.35);
    // halaman kanan (tumpukan kertas)
    ctx.fillStyle = "#DCD3BE"; ctx.fillRect(sp + 6, top + 10, w - 2, h - 6);
    ctx.fillStyle = "#FBF7EC"; ctx.fillRect(sp, top + 4, w - 8, h - 8);
    const pageR = () => { // pohon pencarian kecil
      txt(ctx, "binary search", sp + 36, top + 76, 48, { color: "#26306E", weight: 800 });
      const N = [[0, 0], [-1, 1], [1, 1], [-1.5, 2], [-0.5, 2], [0.5, 2], [1.5, 2]], E = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]], cx0 = sp + w / 2 - 4, cy0 = top + 170;
      const pos = ([a, d]) => [cx0 + a * 78, cy0 + d * 110];
      ctx.strokeStyle = "rgba(40,48,106,0.55)"; ctx.lineWidth = 4; E.forEach(([i, j]) => { const [x0, y0] = pos(N[i]), [x1, y1] = pos(N[j]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); });
      const path = [0, 2, 5], hi = Math.floor(diag / 0.7) % 4;
      N.forEach((n, i) => { const [x, y] = pos(n), on = path.indexOf(i) >= 0 && path.indexOf(i) < hi; ctx.fillStyle = on ? AMB : "#6A7BE0"; ctx.beginPath(); ctx.arc(x, y, 24, 0, TAU); ctx.fill(); });
    };
    const pageL = (x0) => { // kotak urut dibelah dua
      txt(ctx, "Searching", x0 + 40, top + 76, 50, { color: hlS > 0 ? "#C77A10" : "#26306E", weight: 900 });
      if (hlS > 0) { ctx.fillStyle = D.hexA(AMB, 0.35 * hlS); H.rr(ctx, x0 + 32, top + 30, tw(ctx, "Searching", 50, 900) * clamp(hlS * 1.4) + 16, 62, 10); ctx.fill(); }
      const n = 16, bw = 18, gap = 2, bx0 = x0 + (w - n * (bw + gap)) / 2, by = top + 200, k = Math.floor(diag / 0.6) % 6, R = [[0, 16], [8, 16], [8, 12], [10, 12], [11, 12], [11, 12]][k];
      for (let i = 0; i < n; i++) { const inR = i >= R[0] && i < R[1]; ctx.fillStyle = inR ? (k >= 4 && i === 11 ? GRN : "#6A7BE0") : "rgba(106,123,224,0.22)"; H.rr(ctx, bx0 + i * (bw + gap), by - (6 + i * 5), bw, 6 + i * 5 + 20, 4); ctx.fill(); }
      ctx.strokeStyle = AMB; ctx.lineWidth = 5; H.rr(ctx, bx0 + R[0] * (bw + gap) - 6, by + 30, (R[1] - R[0]) * (bw + gap) + 8, 14, 7); ctx.stroke();
      ctx.fillStyle = "rgba(40,48,106,0.18)"; for (let r = 0; r < 6; r++) H.rr(ctx, x0 + 40, top + 300 + r * 30, (r % 3 === 2 ? 200 : 290), 12, 6), ctx.fill();
    };
    if (open > 0.5) pageR();
    // halaman yang sedang dibalik (dari kanan ke kiri)
    const fk = flip - Math.floor(flip);
    // sampul / halaman kiri
    const ang = Math.PI * eio(open), cw = Math.cos(ang) * w;
    if (cw > 0) { // sampul masih di kanan
      ctx.fillStyle = "#6A7BE0"; H.rr(ctx, sp, top, cw, h, 10); ctx.fill();
      ctx.save(); ctx.translate(sp, top); ctx.scale(Math.max(0.001, cw / w), 1);
      ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.fillRect(30, 40, w - 60, 8); ctx.fillRect(30, h - 48, w - 60, 8);
      txt(ctx, "The Art of", w / 2, 128, 48, { align: "center", color: "#FFFFFF", weight: 800 });
      txt(ctx, "Computer", w / 2, 184, 48, { align: "center", color: "#FFFFFF", weight: 800 });
      txt(ctx, "Programming", w / 2, 240, 48, { align: "center", color: "#FFFFFF", weight: 800 });
      ctx.fillStyle = "rgba(16,20,56,0.82)"; ctx.beginPath(); ctx.arc(w / 2, 350, 62, 0, TAU); ctx.fill();
      txt(ctx, "3", w / 2, 378, 84, { align: "center", color: "#FFFFFF", weight: 900 });
      ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(sp, top, 10, h);
    } else { // halaman kiri
      const lw2 = -cw; ctx.fillStyle = "#4E5DBE"; H.rr(ctx, sp - lw2 - 6, top - 4, lw2 + 6, h + 8, 10); ctx.fill();
      ctx.fillStyle = "#FBF7EC"; ctx.fillRect(sp - lw2, top + 4, lw2, h - 8);
      if (lw2 > w * 0.6) { ctx.save(); ctx.beginPath(); ctx.rect(sp - lw2, top, lw2, h); ctx.clip(); pageL(sp - w); ctx.restore(); }
      ctx.fillStyle = "rgba(60,40,20,0.18)"; ctx.fillRect(sp - 14, top + 4, 14, h - 8);
    }
    if (open >= 1 && flip > 0 && fk > 0.02 && flip < 3) { // lembar dibalik
      const a2 = Math.PI * eio(fk), pw = Math.cos(a2) * w; ctx.fillStyle = pw > 0 ? "#F4EEDF" : "#FBF7EC";
      if (pw > 0) ctx.fillRect(sp, top + 4, pw - 8, h - 8); else ctx.fillRect(sp + pw, top + 4, -pw, h - 8);
      ctx.fillStyle = "rgba(40,48,106,0.12)"; for (let r = 0; r < 8; r++) { const x0 = pw > 0 ? sp + 30 : sp + pw + 30, ww = Math.abs(pw) - 60; if (ww > 20) ctx.fillRect(x0, top + 70 + r * 46, ww * (r % 3 === 2 ? 0.6 : 1), 12); }
    }
    ctx.restore();
  }
  function studio(ctx, t) {
    const gr = ctx.createLinearGradient(0, 0, 0, HH); gr.addColorStop(0, "#2D4189"); gr.addColorStop(1, "#4058A8"); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, HH);
    D.glow(ctx, 760, 520, 620, "#7FB2FF", 0.22 + 0.04 * Math.sin(t * 1.2)); D.glow(ctx, 1500, 380, 520, P.violet, 0.18);
    ctx.fillStyle = "rgba(255,255,255,0.06)"; for (let x = 32; x < W; x += 64) for (let y = 32; y < HH; y += 64) { ctx.beginPath(); ctx.arc(x, y, 2.5, 0, TAU); ctx.fill(); }
    for (let i = 0; i < 18; i++) { const x = (hh(i + 90) * W + t * (10 + hh(i) * 12)) % W, y = 60 + hh(i + 91) * 900 + Math.sin(t * 0.7 + i) * 20;
      ctx.fillStyle = `rgba(200,225,255,${0.12 + 0.1 * Math.sin(t * 1.3 + i)})`; ctx.beginPath(); ctx.arc(x, y, 2.5 + hh(i + 4) * 3, 0, TAU); ctx.fill(); }
  }
  function ideaBars(ctx, x, y, sc, u, a) {
    const n = 16, bw = 18, gap = 4, k = Math.floor(Math.max(0, u) / 0.55) % 6, R = [[0, 16], [8, 16], [8, 12], [10, 12], [11, 12], [11, 12]][k];
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc);
    D.glow(ctx, 0, -30, 260, "#8EC5FF", 0.35);
    const x0 = -(n * (bw + gap) - gap) / 2;
    for (let i = 0; i < n; i++) { const inR = i >= R[0] && i < R[1], h = 14 + i * 6;
      ctx.fillStyle = inR ? (k >= 4 && i === 11 ? GRN : "#CFE0FF") : "rgba(207,224,255,0.22)"; H.rr(ctx, x0 + i * (bw + gap), -h, bw, h, 5); ctx.fill(); }
    ctx.strokeStyle = AMB; ctx.lineWidth = 4; H.rr(ctx, x0 + R[0] * (bw + gap) - 5, 12, (R[1] - R[0]) * (bw + gap) + 6, 12, 6); ctx.stroke();
    ctx.restore();
  }
  const STRIP = { x: 1090, w: 66, y0: 170, y1: 850 }, sy = i => STRIP.y0 + i / NN * (STRIP.y1 - STRIP.y0);
  function plan43(b) {
    return { tJil: at(b, "Jilid"), tKet: at(b, "ketiga"), tMem: at(b, "membahas"), tCara: at(b, "cara mencari"), tRin: at(b, "rinci."), tIde: at(b, "Ide"), tKom: at(b, "komputer,"),
      tHP: at(b, "HP-mu,"), tBisa: at(b, "bisa"), tMen: at(b, "menemukan"), tRib: at(b, "ribuan"), tUrut: at(b, "urut"), tSek: at(b, "dalam sekejap") };
  }
  let BGC = null;
  function sceneB43(ctx, b, l, t, TL) {
    const p = plan43(b), b42 = beatOf(TL, "b4_2"), out = fd(l, p.tIde - 0.1, 0.7);
    // --- bagian A: kelas (papan selesai, lalu buram dan redup) + Jilid 3 ---
    const dim = fd(l, p.tJil - 0.15, 0.5), bookA = 1 - fd(l, p.tIde + 0.05, 0.45);
    if (out < 1) {
      if (dim <= 0) drawB42(ctx, b42, b42.dur + l, t);
      else { // latar buram: digambar di kanvas setengah ukuran lalu diperbesar (efek fokus), teksnya tidak untuk dibaca
        if (!BGC) { BGC = document.createElement("canvas"); BGC.width = 960; BGC.height = 540; }
        const bc = BGC.getContext("2d"); bc.setTransform(0.5, 0, 0, 0.5, 0, 0); drawB42(bc, b42, b42.dur + l, t);
        ctx.save(); ctx.filter = `blur(${(5 * dim).toFixed(1)}px)`; ctx.drawImage(BGC, 0, 0, W, HH); ctx.restore();
        ctx.fillStyle = `rgba(14,20,56,${0.32 * dim})`; ctx.fillRect(0, 0, W, HH); }
    }
    if (out > 0) { ctx.save(); ctx.globalAlpha *= out; studio(ctx, t); ctx.restore(); }
    const ui = l - (p.tJil - 0.1);
    if (ui > 0 && bookA > 0) {
      const e = eout(clamp(ui / 0.7)), open = fd(l, p.tMem, 0.8), flip = l > p.tRin ? 3 * clamp((l - p.tRin) / 1.0) : 0, shrink = 1 - bookA;
      ctx.save(); ctx.globalAlpha *= clamp(ui / 0.25) * clamp((bookA - 0.6) * 2.5); ctx.translate(lerp(700, 0, e), 0);
      const k = lerp(0.94, 1, e) * lerp(1, 0.55, eio(shrink)); ctx.translate(960, 550); ctx.scale(k, k); ctx.translate(-960, -550);
      D.glow(ctx, 960, 550, 600, "#7FB2FF", 0.25);
      book3(ctx, l, t, open, flip, Math.max(0, l - p.tCara), fd(l, p.tCara, 0.4));
      ctx.restore();
      const ua = l - p.tKet; if (ua > 0) { ctx.save(); ctx.globalAlpha *= clamp(ua / 0.2) * clamp(bookA * 2 - 1); const s1 = "Jilid 3: Sorting and ", s2 = "Searching", size = 50, w1 = tw(ctx, s1, size, 900), w2 = tw(ctx, s2, size, 900), pw = w1 + w2 + size * 1.2, ph = size * 1.7;
        ctx.translate(960, 196); const kk = popS(ua); ctx.scale(kk, kk); ctx.fillStyle = "rgba(10,18,52,0.92)"; H.rr(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2); ctx.fill(); ctx.strokeStyle = "#8EA0FF"; ctx.lineWidth = 3; ctx.stroke();
        txt(ctx, s1, -pw / 2 + size * 0.6, size * 0.36, size, { color: "#FFFFFF", weight: 900 }); const hl = fd(l, p.tCara, 0.3);
        if (hl > 0) D.glow(ctx, -pw / 2 + size * 0.6 + w1 + w2 / 2, 0, 160, AMB, 0.35 * hl);
        txt(ctx, s2, -pw / 2 + size * 0.6 + w1, size * 0.36, size, { color: hl > 0.5 ? AMB : "#FFFFFF", weight: 900 }); ctx.restore(); }
      lab(ctx, "cara mencari", 960, 866, l - p.tCara, { size: 52, col: AMB, a: clamp(bookA * 2 - 1) });
    }
    // --- bagian B: laptop + HP + batang nama ---
    if (out > 0) {
      // ide yang sama: 16 batang urut yang dibelah dua, terangkat dari halaman buku, melayang di tengah, lalu masuk ke HP
      const ia = fd(l, p.tIde - 0.05, 0.35) * (1 - fd(l, p.tHP + 0.25, 0.45));
      if (ia > 0) { const lift = eio(fd(l, p.tIde - 0.05, 0.9)), dive = eio(fd(l, p.tHP - 0.35, 0.7));
        const ix = lerp(lerp(770, 960, lift), 760, dive), iy = lerp(lerp(470, 470, lift), 560, dive), sc = lerp(lerp(1, 2.3, lift), 0.6, dive);
        ideaBars(ctx, ix, iy, sc, l - p.tIde, ia);
        // percikan menuju laptop saat "komputer"
        const la2 = fd(l, p.tKom - 0.3, 0.3) * (1 - fd(l, p.tHP, 0.4));
        if (la2 > 0) { ctx.save(); ctx.globalCompositeOperation = "screen";
          for (let i = 0; i < 12; i++) { const q = ((l - p.tKom) * 0.7 + i / 12) % 1, ex = 320, ey = 470, mx = (ix + ex) / 2, my = 250 - (i % 3) * 30;
            const x = (1 - q) * (1 - q) * ix + 2 * (1 - q) * q * mx + q * q * ex, y = (1 - q) * (1 - q) * iy + 2 * (1 - q) * q * my + q * q * ey;
            D.glow(ctx, x, y, 20, i % 2 ? AMB : "#8EC5FF", 0.9 * la2); ctx.fillStyle = D.hexA("#FFFFFF", 0.85 * la2); ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill(); }
          ctx.restore(); } }
      // laptop (komputer)
      const la = fd(l, p.tKom - 0.2, 0.5) * lerp(1, 0.35, fd(l, p.tMen, 0.6)) * out;
      laptop(ctx, 320, 560, 0.95 * popS(l - p.tKom + 0.2), t, la);
      // HP
      const pu = eout(fd(l, p.tHP - 0.45, 0.8)), phy = lerp(1500, 520, pu);
      // keadaan pencarian
      const step = l < p.tSek ? -1 : Math.min(11, Math.floor((l - p.tSek) / 0.15)), done = l >= p.tSek + 12 * 0.15 + 0.05;
      const q = "Sinta".slice(0, Math.max(0, Math.min(5, Math.floor((l - p.tMen) / 0.11) + 1))), typing = l >= p.tMen;
      let st = { q: typing ? q : "", caret: typing && !done && Math.floor(t * 2.5) % 2 === 0, k: 3, hl: false };
      const nameA = clamp((pu - 0.9) / 0.1);
      if (step >= 0) { const [lo, n] = HALV[Math.min(12, step + 1)], [lo0, n0] = HALV[step]; const mid = done ? TGT : lo0 + Math.floor(n0 / 2);
        st = { q: "Sinta", k: pIdx(mid), hl: true, dir: mid < TGT ? -1 : 1, found: done, dim: !done }; }
      st.na = nameA;
      if (pu > 0.001) { ctx.save(); ctx.globalAlpha *= out; KY.hp(ctx, 760, phy, 720, { t, lit: 1, glow: 0.5, glowCol: "#A9D4FF", screen: (c, w, h) => listPhone(c, w, h, t, st) }); ctx.restore(); }
      // batang 4.000 nama
      const ra = fd(l, p.tRib - 0.1, 0.4) * out;
      if (ra > 0) { ctx.save(); ctx.globalAlpha *= ra; const { x, w, y0, y1 } = STRIP, grow = eio(fd(l, p.tRib - 0.1, 0.7));
        ctx.fillStyle = "rgba(10,16,48,0.85)"; H.rr(ctx, x - 8, y0 - 10, w + 16, (y1 - y0) * grow + 20, 12); ctx.fill();
        const [lo, n] = step >= 0 ? HALV[Math.min(12, step + 1)] : [0, NN];
        for (let i = 0; i < 170; i++) { const yy = y0 + (i + 0.5) / 170 * (y1 - y0); if (yy > y0 + (y1 - y0) * grow) break; const idx = (i + 0.5) / 170 * NN, inR = idx >= lo - 12 && idx <= lo + n + 12;
          ctx.fillStyle = inR ? "rgba(220,232,255,0.9)" : "rgba(220,232,255,0.18)"; ctx.fillRect(x + 6, yy - 1, w - 12 - (hh(i) * 18), 2.2); }
        // huruf A, M, Z (urut)
        const lu = l - p.tUrut; if (lu > 0) [["A", 0], ["M", NAMES.indexOf("Made")], ["S", NAMES.indexOf("Sari")], ["Z", NAMES.indexOf("Zahra")]].forEach(([s, pi], j) => {
          const yy = sy(pi / (NP - 1) * (NN - 1)); ctx.save(); ctx.globalAlpha *= clamp((lu - j * 0.12) / 0.2); txt(ctx, s, x - 22, yy + 16, 44, { align: "right", color: "#FFFFFF", weight: 900 });
          ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x - 14, yy - 1.5, 12, 3); ctx.restore(); });
        // kurung sisa
        if (step >= 0) { const ya = sy(lo), yb = Math.max(ya + 6, sy(lo + n)); ctx.strokeStyle = done ? GRN : AMB; ctx.lineWidth = 6; H.rr(ctx, x - 6, ya - 6, w + 12, yb - ya + 12, 8); ctx.stroke();
          D.glow(ctx, x + w / 2, (ya + yb) / 2, 90, done ? GRN : AMB, 0.4); }
        ctx.restore(); }
      { const s1 = "4.000 nama", s2 = " · urut A–Z", size = 46, u1 = l - p.tRib, u2 = l - p.tUrut;
        if (u1 > 0) { ctx.save(); ctx.globalAlpha *= clamp(u1 / 0.2) * out; const w1 = tw(ctx, s1, size, 900), w2 = u2 > 0 ? tw(ctx, s2, size, 900) * eio(u2 / 0.3) : 0, pw = w1 + w2 + size * 1.2, ph = size * 1.7, cx = 1123 + 120;
          ctx.translate(cx, 104); const k = popS(u1); ctx.scale(k, k); ctx.fillStyle = "rgba(10,18,52,0.92)"; H.rr(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2); ctx.fill(); ctx.strokeStyle = D.hexA(AMB, 0.9); ctx.lineWidth = 3; ctx.stroke();
          txt(ctx, s1, -pw / 2 + size * 0.6, size * 0.36, size, { color: "#FFFFFF", weight: 900 });
          if (u2 > 0) { ctx.save(); ctx.globalAlpha *= clamp(u2 / 0.3); txt(ctx, s2, -pw / 2 + size * 0.6 + w1, size * 0.36, size, { color: AMB, weight: 900 }); ctx.restore(); }
          ctx.restore(); } }
      // penghitung langkah
      const ca = fd(l, p.tSek - 0.3, 0.3) * out;
      if (ca > 0) { ctx.save(); ctx.globalAlpha *= ca; const x = 1300, y = 190, w = 524, h = 230; const n = Math.max(0, step + 1), dn = done ? fd(l, p.tSek + 1.9, 0.3) : 0;
        if (dn > 0) D.glow(ctx, x + w / 2, y + h / 2, 330, GRN, 0.3 * dn);
        D.panel(ctx, x, y, w, h, { fill: "rgba(16,26,66,0.92)", stroke: done ? D.hexA(GRN, 0.9) : "rgba(242,246,255,0.25)", lw: done ? 4 : 2 });
        txt(ctx, "Membagi dua", x + 34, y + 62, 46, { color: P.ink2, weight: 800 });
        txt(ctx, String(n), x + 34, y + 194, 120, { color: done ? GRN : AMB, weight: 900 });
        txt(ctx, "kali", x + 34 + Math.max(80, tw(ctx, String(n), 120, 900)) + 20, y + 190, 48, { color: P.ink, weight: 800 }); ctx.restore(); }
      lab(ctx, "ketemu: 12 langkah", 1562, 488, l - (p.tSek + 1.95), { size: 50, col: GRN, big: true, glow: 220 });
      if (done) sparks(ctx, 760, 520, l - p.tSek - 1.9, 14, 260, [AMB, GRN, "#FFFFFF"]);
      // Bip menunjuk kurung di batang
      const ba = fd(l, p.tRib, 0.5) * out; if (ba > 0) { const [lo, n] = step >= 0 ? HALV[Math.min(12, step + 1)] : [0, NN], ty = sy(lo + n / 2);
        const by = lerp(1250, 712, eout(ba)) + Math.sin(t * 1.9) * 6;
        B.draw(ctx, 1600, by, 175, done && l > p.tSek + 2.1 ? { t, pose: "diam", mood: "happy", wave: l, shadow: false } : { t, pose: "tunjuk", target: [STRIP.x + STRIP.w + 10, ty], mood: step >= 0 ? "wow" : "happy", shadow: false }); }
    }
  }

  // =====================================================================================
  // b4_4: dunia meja Knuth (malam) — Turing Award 1974
  // =====================================================================================
  const DESK_Y = 560, DESK_F = 930;
  const WIN = { x: 110, y: 96, w: 320, h: 280 }, LAMP = { bx: 330, by: 612, jx: 262, jy: 430, hx: 448, hy: 296 };
  const SHELF = { x0: 980, x1: 1842, y: 400, slot: 82, bx: 1004, bw: 72 };
  const BOOKS = [{ k: "1", c: "#E8665F", h: 196 }, { k: "2", c: "#36B3A3", h: 196 }, { k: "3", c: "#6A7BE0", h: 196 }, { k: "4A", c: "#E9A23B", h: 206 }, { k: "4B", c: "#9A6FD6", h: 206 },
    { k: "4C", h: 206, d: 1 }, { k: "4D", h: 206, d: 1 }, { k: "5", h: 196, d: 1 }, { k: "6", h: 196, d: 1 }, { k: "7", h: 196, d: 1 }];
  const bookX = i => SHELF.bx + i * SHELF.slot;
  function wall(ctx, t) {
    const gr = ctx.createLinearGradient(0, 0, 0, DESK_Y); gr.addColorStop(0, "#2A3A7C"); gr.addColorStop(1, "#3D509A");
    ctx.fillStyle = gr; ctx.fillRect(-100, -100, W + 200, DESK_Y + 100);
    ctx.fillStyle = "rgba(255,255,255,0.035)"; for (let x = 16; x < W + 60; x += 64) ctx.fillRect(x, -100, 3, DESK_Y + 100);
    ctx.fillStyle = "rgba(255,255,255,0.05)"; for (let x = 48; x < W + 60; x += 64) for (let y = 24; y < DESK_Y - 20; y += 64) { ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); }
    LP.windowFrame(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, "#8A6E9E", () => LP.nightView(ctx, WIN.x, WIN.y, WIN.w, WIN.h, t, 0));
    addLight(ctx, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, 330, "#9DB8FF", 0.16);
  }
  function lamp(ctx) {
    const { bx, by, jx, jy, hx, hy } = LAMP;
    ctx.save();
    ctx.fillStyle = "rgba(20,10,10,0.35)"; ctx.beginPath(); ctx.ellipse(bx + 8, by + 8, 74, 16, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2C3570"; ctx.beginPath(); ctx.ellipse(bx, by, 66, 18, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#3C478E"; ctx.beginPath(); ctx.ellipse(bx, by - 8, 60, 14, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#46529E"; ctx.lineCap = "round"; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(bx, by - 12); ctx.lineTo(jx, jy); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx - 4, by - 14); ctx.lineTo(jx - 4, jy); ctx.lineTo(hx - 2, hy - 5); ctx.stroke();
    ctx.fillStyle = "#FFB547"; [[bx, by - 12], [jx, jy], [hx, hy]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.fill(); });
    ctx.translate(hx, hy); ctx.rotate(-0.42);
    const sg = ctx.createLinearGradient(-60, 0, 60, 0); sg.addColorStop(0, "#38428A"); sg.addColorStop(0.5, "#5562B4"); sg.addColorStop(1, "#38428A");
    ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(-34, -14); ctx.lineTo(34, -14); ctx.lineTo(70, 92); ctx.lineTo(-70, 92); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2E3778"; ctx.beginPath(); ctx.ellipse(0, -14, 34, 9, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgb(255,236,190)"; ctx.beginPath(); ctx.ellipse(0, 92, 70, 15, 0, 0, TAU); ctx.fill();
    ctx.restore();
    addLight(ctx, LAMP.hx + 40, LAMP.hy + 90, 110, "#FFF2C8", 0.85); addLight(ctx, LAMP.hx + 70, LAMP.hy + 140, 280, "#FFC66E", 0.4);
  }
  function shelf(ctx, t, lit, glowB) {
    const { x0, x1, y } = SHELF;
    ctx.fillStyle = "#6B4632"; [x0 + 60, x1 - 120].forEach(x => { ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x + 18, y + 20); ctx.lineTo(x + 18, y + 90); ctx.closePath(); ctx.fill(); });
    BOOKS.forEach((Bk, i) => {
      const x = bookX(i), w = SHELF.bw, h = Bk.h, top = y - h;
      if (Bk.d) { const pulse = 0.6 + 0.4 * Math.sin(t * 2.2 + i);
        ctx.fillStyle = D.hexA(P.warm, 0.1 + 0.08 * pulse); H.rr(ctx, x, top, w, h, 8); ctx.fill();
        ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 14; ctx.strokeStyle = D.hexA(P.warm, 0.75 + 0.25 * pulse); ctx.lineWidth = 4; H.rr(ctx, x + 2, top + 2, w - 4, h - 4, 8); ctx.stroke(); ctx.setLineDash([]);
        txt(ctx, Bk.k, x + w / 2, top + h * 0.5 + 16, 44, { align: "center", weight: 900, color: P.warm }); return; }
      const L = clamp(lit), gb = clamp(glowB && glowB[i] || 0);
      if (gb > 0) addLight(ctx, x + w / 2, top + h / 2, 150, Bk.c, 0.6 * gb);
      ctx.fillStyle = "rgba(10,10,30,0.3)"; ctx.fillRect(x + 6, top + 6, w, h);
      const gr = ctx.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, Bk.c); gr.addColorStop(0.55, Bk.c); gr.addColorStop(1, "rgba(20,20,40,0.35)");
      ctx.fillStyle = Bk.c; H.rr(ctx, x, top, w, h, 6); ctx.fill(); ctx.fillStyle = gr; H.rr(ctx, x, top, w, h, 6); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.fillRect(x + 8, top + 18, w - 16, 5); ctx.fillRect(x + 8, top + h - 24, w - 16, 5);
      if (L > 0.01) { ctx.save(); ctx.globalAlpha *= L; ctx.translate(x + w / 2, top + h * 0.52);
        ctx.fillStyle = "rgba(16,20,56,0.82)"; ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fill();
        txt(ctx, Bk.k, 0, 16, 44, { align: "center", weight: 900, color: "#FFFFFF" }); ctx.restore(); }
    });
    ctx.fillStyle = "#8A5A3C"; H.rr(ctx, x0, y, x1 - x0, 24, 5); ctx.fill(); ctx.fillStyle = "#A8714C"; ctx.fillRect(x0 + 4, y, x1 - x0 - 8, 5);
    ctx.fillStyle = "rgba(10,10,30,0.25)"; ctx.fillRect(x0 + 6, y + 24, x1 - x0 - 12, 8);
  }
  function deskFront(ctx) {
    const gr = ctx.createLinearGradient(0, DESK_Y, 0, DESK_F); gr.addColorStop(0, "#6E4834"); gr.addColorStop(1, "#9A6848");
    ctx.fillStyle = gr; ctx.fillRect(-100, DESK_Y, W + 200, DESK_F - DESK_Y);
    ctx.strokeStyle = "rgba(60,30,20,0.18)"; ctx.lineWidth = 3;
    for (let i = 0; i < 9; i++) { const y = DESK_Y + 26 + i * 40; ctx.beginPath(); ctx.moveTo(-100, y); for (let x = -100; x <= W + 100; x += 120) ctx.lineTo(x, y + Math.sin(x * 0.004 + i * 1.7) * 6); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,220,180,0.18)"; ctx.fillRect(-100, DESK_Y, W + 200, 4);
    ctx.fillStyle = "#B57D57"; ctx.fillRect(-100, DESK_F, W + 200, 10);
    const g2 = ctx.createLinearGradient(0, DESK_F + 10, 0, 1200); g2.addColorStop(0, "#5A3726"); g2.addColorStop(1, "#3A2218"); ctx.fillStyle = g2; ctx.fillRect(-100, DESK_F + 10, W + 200, 400);
  }
  function paperStack(ctx) {
    const x = 190, y = 850, w = 280, h = 140;
    shadowE(ctx, x + 10, y + 10, w * 0.6, h * 0.42, 0.28);
    for (let i = 0; i < 8; i++) { const dy = -i * 7, dx = Math.sin(i * 2.1) * 8, rot = Math.sin(i * 1.3) * 0.03;
      ctx.save(); ctx.translate(x + dx, y + dy); ctx.rotate(rot); ctx.fillStyle = i % 2 ? "#EDE3CF" : "#F6EEDC"; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = "rgba(120,90,60,0.25)"; ctx.fillRect(-w / 2, h / 2 - 3, w, 3); ctx.restore(); }
  }
  function medal(ctx, x, y, r, t, shine) {
    ctx.save(); ctx.translate(x, y);
    // pita di belakang
    [[-1, "#2F5BC4"], [1, "#2F5BC4"]].forEach(([sd, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(sd * r * 0.2, -r * 0.6); ctx.lineTo(sd * r * 0.75, -r * 1.55); ctx.lineTo(sd * r * 0.32, -r * 1.55); ctx.lineTo(0, -r * 0.7); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.beginPath(); ctx.moveTo(sd * r * 0.42, -r * 0.95); ctx.lineTo(sd * r * 0.56, -r * 1.55); ctx.lineTo(sd * r * 0.49, -r * 1.55); ctx.lineTo(sd * r * 0.36, -r * 0.98); ctx.closePath(); ctx.fill(); });
    ctx.fillStyle = "rgba(20,10,10,0.35)"; ctx.beginPath(); ctx.arc(6, 10, r, 0, TAU); ctx.fill();
    const gr = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r); gr.addColorStop(0, "#FFE9A6"); gr.addColorStop(0.55, "#F2B947"); gr.addColorStop(1, "#C98A22");
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#B47A1C"; ctx.lineWidth = r * 0.06; ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, TAU); ctx.stroke();
    // daun dafnah
    ctx.fillStyle = "#C98A22"; for (let sd = -1; sd <= 1; sd += 2) for (let i = 0; i < 7; i++) { const a = Math.PI / 2 + sd * (0.35 + i * 0.32); ctx.save(); ctx.translate(Math.cos(a) * r * 0.68, Math.sin(a) * r * 0.68); ctx.rotate(a + sd * 1.2);
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.1, r * 0.045, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    // bintang kecil di atas
    ctx.fillStyle = "#FFF1C2"; ctx.beginPath(); for (let k = 0; k < 10; k++) { const rr = k % 2 ? r * 0.06 : r * 0.14, a = -Math.PI / 2 + k / 10 * TAU; ctx.lineTo(Math.cos(a) * rr, -r * 0.42 + Math.sin(a) * rr); } ctx.closePath(); ctx.fill();
    txt(ctx, "1974", 0, r * 0.22, Math.round(r * 0.46), { align: "center", color: "#7A4A0E", weight: 900 });
    // kilau
    if (shine > 0) { ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip(); const sx = lerp(-r * 1.6, r * 1.6, ((t * 0.45) % 1.4) / 1.4);
      ctx.fillStyle = `rgba(255,255,255,${0.35 * shine})`; ctx.beginPath(); ctx.moveTo(sx - r * 0.2, -r); ctx.lineTo(sx + r * 0.1, -r); ctx.lineTo(sx - r * 0.4, r); ctx.lineTo(sx - r * 0.7, r); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.restore();
  }
  function plan44(b) {
    return { tSer: at(b, "seribu"), tSem: at(b, "sembilan"), tTuj: at(b, "tujuh"), tEmp: at(b, "empat,"), tUsi: at(b, "usia"), tEnam: at(b, "enam"), tKnu: at(b, "Knuth"),
      tMene: at(b, "menerima"), tTur: at(b, "Turing"), tNob: at(b, "Nobel-nya"), tSeri: at(b, "Seri"), tLang: at(b, "langsung"), tAlas: at(b, "alasan") };
  }
  const QUOTE = ["“… and in particular for his", "contributions to the", "“art of computer programming”", "through his well-known books…”"];
  function sceneB44(ctx, b, l, t) {
    const p = plan44(b), z = 1 + 0.02 * eio(l / b.dur);
    ctx.save(); push(ctx, z, 900, 520);
    wall(ctx, t);
    const seriG = fd(l, p.tSeri, 0.4) * (0.6 + 0.25 * Math.sin(t * 3)) + 0.4 * fd(l, p.tLang, 0.4);
    shelf(ctx, t, 1, [seriG, seriG, seriG, seriG, seriG]);
    deskFront(ctx);
    LP.warmPool(ctx, 600, 700, 700, 0.42 + 0.03 * Math.sin(t * 1.3), 0.35);
    lamp(ctx); paperStack(ctx);
    // tahun 1974 per digit, sesuai ucapan
    const dig = [["1", p.tSer], ["9", p.tSem], ["7", p.tTuj], ["4", p.tEmp]], size = 120;
    const DG = 14; let wsum = -DG; dig.forEach(([s]) => wsum += tw(ctx, s, size, 900) + DG); let xx = 720 - wsum / 2;
    dig.forEach(([s, t0]) => { const w = tw(ctx, s, size, 900), u = l - t0; if (u > 0) { ctx.save(); ctx.globalAlpha *= clamp(u / 0.15); ctx.translate(xx + w / 2, 150); const k = popB(u); ctx.scale(k, k);
      txt(ctx, s, 0, 44, size, { align: "center", color: "#FFFFFF", weight: 900 }); ctx.restore(); } xx += w + DG; });
    { const u = l - p.tEmp; if (u > 0) { ctx.fillStyle = AMB; const w = wsum * eio(u / 0.4); ctx.fillRect(720 - w / 2, 214, w, 8); } }
    lab(ctx, "usia 36 tahun", 720, 300, l - p.tEnam, { size: 48, col: "#8EC5FF" });
    // dudukan + pelat nama + medali
    const sa = l - (p.tKnu - 0.35); if (sa > 0) { const e = eout(clamp(sa / 0.6)); ctx.save(); ctx.globalAlpha *= clamp(sa / 0.2); ctx.translate(0, lerp(60, 0, e));
      shadowE(ctx, 724, 806, 210, 22, 0.35);
      ctx.fillStyle = "#4A2C1E"; ctx.beginPath(); ctx.moveTo(540, 800); ctx.lineTo(900, 800); ctx.lineTo(880, 770); ctx.lineTo(560, 770); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#6B4130"; ctx.fillRect(540, 800, 360, 70); ctx.fillStyle = "rgba(255,220,180,0.15)"; ctx.fillRect(540, 800, 360, 5);
      const pg = ctx.createLinearGradient(0, 812, 0, 860); pg.addColorStop(0, "#F6D78B"); pg.addColorStop(1, "#D6A84A"); ctx.fillStyle = pg; H.rr(ctx, 566, 810, 308, 52, 8); ctx.fill();
      txt(ctx, "Donald Knuth", 720, 852, 44, { align: "center", color: "#5A3A0E", weight: 900 });
      ctx.fillStyle = "#4A2C1E"; ctx.fillRect(712, 700, 16, 72); ctx.restore(); }
    const mu = l - p.tMene; if (mu > 0) { const e = Math.min(1.04, spring(mu, 8, 0.5)); const my = lerp(-200, 625, e);
      if (mu < 0.9) D.glow(ctx, 720, 625, 260, AMB, 0.5 * (1 - mu / 0.9));
      D.glow(ctx, 720, my, 230, "#FFD27A", 0.3 + 0.05 * Math.sin(t * 2)); medal(ctx, 720, my, 118, t, fd(l, p.tMene + 0.6, 0.5));
      sparks(ctx, 720, 625, mu - 0.5, 12, 200, [AMB, "#FFFFFF", "#FFE9A6"]); }
    lab(ctx, "Turing Award", 720, 438, l - p.tTur, { size: 60, col: AMB, big: true, glow: 200 });
    // "Nobel" ilmu komputer (kanan, sebelum kartu kutipan)
    const kq = l - (p.tSeri - 0.2), nOut = fd(l, p.tSeri - 0.3, 0.35);
    { const u = l - p.tNob; if (u > 0) { lab(ctx, "≈ “Nobel” ilmu komputer", 1360, 640, u, { size: 52, col: "#FFD27A", a: 1 - nOut, glow: 180 });
      ctx.save(); ctx.globalAlpha *= 1 - nOut; arrow(ctx, 996, 640, 862, 632, "#FFD27A", 6, 0.2, fd(l, p.tNob + 0.2, 0.4)); ctx.restore(); } }
    // kartu kutipan alasan penghargaan
    if (kq > 0) { const e = eout(clamp(kq / 0.6)), cx0 = lerp(2000, 1004, e), cy0 = 468, cw = 790, ch = 412;
      ctx.save(); ctx.translate(cx0, cy0); ctx.rotate(lerp(0.08, -0.012, e));
      ctx.fillStyle = "rgba(20,10,10,0.35)"; ctx.fillRect(10, 14, cw, ch); ctx.fillStyle = "#FBF7EC"; ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = "#E8DFC8"; ctx.fillRect(0, 0, cw, 6);
      const ua = l - p.tAlas; if (ua > 0) { ctx.save(); ctx.globalAlpha *= clamp(ua / 0.2); txt(ctx, "Alasan penghargaan (1974):", 40, 70, 44, { color: "#B5530F", weight: 900 }); ctx.restore(); }
      // ketikan
      const tStart = p.tSeri + 0.15, cps = 62; let rem = Math.max(0, (l - tStart) * cps); const ly = [146, 210, 274, 338];
      const hlU = l - p.tLang;
      if (hlU > 0) { const w = tw(ctx, QUOTE[2], 44, 800) + 20; ctx.fillStyle = D.hexA(AMB, 0.55); H.rr(ctx, 30, ly[2] - 44, w * eio(hlU / 0.45), 60, 10); ctx.fill(); }
      QUOTE.forEach((s, i) => { if (rem <= 0) return; const n = Math.min(s.length, Math.floor(rem)); rem -= s.length + 2; const part = s.slice(0, n); if (!part) return;
        txt(ctx, part, 40, ly[i], 44, { color: i === 2 && hlU > 0 ? "#5A2A00" : "#26306E", weight: i === 2 ? 800 : 700 });
        if (n < s.length && Math.floor(t * 4) % 2 === 0) { const w = tw(ctx, part, 44, i === 2 ? 800 : 700); ctx.fillStyle = "#26306E"; ctx.fillRect(42 + w, ly[i] - 36, 4, 44); } });
      ctx.restore();
    }
    // Bip: kagum pada medali, lalu menunjuk kutipan
    let bo = { t, pose: "diam", mood: "happy", shadow: true, look: [-0.8, -0.3] };
    if (l > p.tMene && l < p.tSeri) bo = { t, pose: "diam", mood: "wow", look: [-0.9, -0.4], shadow: true, wave: l > p.tNob ? l : undefined };
    if (l >= p.tSeri) bo = { t, pose: "tunjuk", target: [1100, 735], mood: "happy", shadow: true };
    B.draw(ctx, 952, 822, 128, bo);
    ctx.restore();
  }

  K.SCENES.d04_b4 = function (ctx, b, l, t, TL) {
    if (b.id === "b4_1") return sceneB41(ctx, b, l, t);
    if (b.id === "b4_2") return sceneB42(ctx, b, l, t);
    if (b.id === "b4_3") return sceneB43(ctx, b, l, t, TL);
    return sceneB44(ctx, b, l, t);
  };
  K.SCENES.d04_b4.noCam = true;

  // ---------- efek suara ----------
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b4 = TL => {
    const out = [
      K.sfxAt(TL, "b4_1", null, 0.35, "whoosh", 0.4),            // blok langkah jatuh ke panel
      K.sfxAt(TL, "b4_1", "banyaknya", 0.1, "pop", 0.45),        // hitungan 1..6
      K.sfxAt(TL, "b4_1", "analisis", 0.0, "shimmer", 0.6),      // judul "analisis algoritma"
      K.sfxAt(TL, "b4_1", "istilah", -0.2, "whoosh", 0.4),       // Jilid 1 + catatan istilah
      K.sfxAt(TL, "b4_1", "Knuth.", 0.0, "pop", 0.5),            // label nama
      K.sfxAt(TL, "b4_2", "tebak angka", 0.0, "pop", 0.45),      // judul papan
      K.sfxAt(TL, "b4_2", "satu sampai", 0.1, "shimmer", 0.5),   // 1000 kotak muncul
      K.sfxAt(TL, "b4_2", "lebih besar", 0.0, "pop", 0.5),       // gelembung jawaban
      K.sfxAt(TL, "b4_2", "Menebak satu", 0.15, "whoosh", 0.4),  // tebak satu per satu
      K.sfxAt(TL, "b4_2", "seribu tebakan", 0.0, "pop", 0.5),    // "bisa sampai 1000 tebakan"
      K.sfxAt(TL, "b4_2", "menebak angka", 0.0, "pop", 0.55),    // tebakan 500
      K.sfxAt(TL, "b4_2", "membuang", 0.0, "clack", 0.6)];       // separuh papan padam
    const b2 = TL.beats.find(x => x.id === "b4_2");
    if (b2) { const p = plan42(b2); out.push([+(b2.start + p.st[1].tc).toFixed(3), "clack", 0.5], [+(b2.start + p.st[2].tg - 0.1).toFixed(3), "riser", 0.45],
      [+(b2.start + p.tFound).toFixed(3), "shimmer", 0.75]); }
    out.push(
      K.sfxAt(TL, "b4_3", "Jilid", -0.1, "whoosh", 0.5),         // Jilid 3 masuk
      K.sfxAt(TL, "b4_3", "rinci.", 0.0, "whoosh", 0.35),        // halaman dibalik
      K.sfxAt(TL, "b4_3", "Ide", 0.0, "shimmer", 0.5),           // cahaya ide
      K.sfxAt(TL, "b4_3", "HP-mu,", -0.3, "pop", 0.5),           // HP naik
      K.sfxAt(TL, "b4_3", "ribuan", 0.0, "whoosh", 0.4),         // batang 4.000 nama
      K.sfxAt(TL, "b4_3", "dalam sekejap", 0.0, "riser", 0.5),   // 12 kali belah dua
      K.sfxAt(TL, "b4_3", "dalam sekejap", 1.9, "shimmer", 0.7), // Sinta ketemu
      K.sfxAt(TL, "b4_4", "empat,", 0.0, "pop", 0.5),            // 1974 lengkap
      K.sfxAt(TL, "b4_4", "enam", 0.0, "pop", 0.4),              // usia 36
      K.sfxAt(TL, "b4_4", "menerima", 0.0, "shimmer", 0.7),      // medali turun
      K.sfxAt(TL, "b4_4", "Turing", 0.0, "pop", 0.55),           // Turing Award
      K.sfxAt(TL, "b4_4", "Nobel-nya", 0.0, "pop", 0.45),        // ≈ Nobel
      K.sfxAt(TL, "b4_4", "Seri", -0.2, "whoosh", 0.45),         // kartu kutipan masuk
      K.sfxAt(TL, "b4_4", "langsung", 0.0, "shimmer", 0.55));    // frasa disorot
    return out.filter(Boolean);
  };
})(typeof window !== "undefined" ? window : globalThis);
