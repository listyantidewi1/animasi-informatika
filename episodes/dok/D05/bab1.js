/* D05 bab 1 — Nama untuk sebuah perasaan (b1_1 … b1_4).
   b1_1 kata panjang diketik; bagian kasarnya TIDAK pernah digambar (tempatnya langsung diisi stiker Bip tersipu); lalu berubah jadi "pembusukan platform";
   b1_2 lini waktu 2022 → 2023 → 2024, piala kamus generik, jutaan orang "aku juga merasakannya"; b1_3 tangga tiga tahap, wajah pengguna & pedagang, karung uang menggelinding ke Juragan;
   b1_4 papan "teori konspirasi?" lalu masuk ke kantor Juragan: grafik untung naik, tiga centang "masuk akal". */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit, U = K.d05, P = D.P, KB = KIT.bipkit;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, pop, tag, txt } = U;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const S = {};

  // ---------- b1_1 ----------
  function stikerBip(ctx, x, y, w, h, k, t) {
    if (k <= 0.01) return; ctx.save(); ctx.translate(x, y); const s = lerp(1.6, 1, clamp(spring(k * 1.2, 11, 0.5))); ctx.rotate(-0.08 + (1 - k) * 0.3); ctx.scale(s, s); ctx.globalAlpha *= clamp(k * 4);
    ctx.fillStyle = "rgba(10,10,30,0.35)"; RR(ctx, -w / 2 + 8, -h / 2 + 10, w, h, 30); ctx.fill();
    ctx.fillStyle = "#FFFFFF"; RR(ctx, -w / 2, -h / 2, w, h, 30); ctx.fill(); ctx.fillStyle = "#FFE3EC"; RR(ctx, -w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 24); ctx.fill();
    KB.draw(ctx, 0, -6, h * 0.62, { pose: "diam", mood: "wow", t, shadow: false, look: [0.3, 0.5] });
    // pipi merona ekstra
    ctx.fillStyle = "rgba(255,111,145,0.55)"; ctx.beginPath(); ctx.ellipse(-h * 0.2, h * 0.06, h * 0.08, h * 0.045, 0, 0, TAU); ctx.ellipse(h * 0.2, h * 0.06, h * 0.08, h * 0.045, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  S.b1_1 = function (ctx, b, l, t) {
    const tKata = D.at(b, "enshittification"), tKasar = D.at(b, "Arti kasarnya"), tBusuk = D.at(b, "proses pembusukan"), tSebut = D.at(b, "pembusukan platform");
    U.studio(ctx, t);
    const fs = 130, y = 470; ctx.font = `900 ${fs}px ${FONT}`;
    const wEn = ctx.measureText("en").width, wTi = ctx.measureText("tification").width, wSt = 330, tot = wEn + wSt + wTi, x0 = 960 - tot / 2;
    const typ = clamp((l - tKata + 0.2) / 1.0), morph = eio(clamp((l - tSebut + 0.2) / 0.9));
    // kata asli (bagian kasar tidak pernah digambar)
    if (morph < 1) { ctx.save(); ctx.globalAlpha *= 1 - morph; ctx.translate(0, -morph * 40);
      const nEn = Math.min(2, Math.floor(typ * 16)), nTi = Math.max(0, Math.floor(typ * 16) - 6);
      txt(ctx, "en".slice(0, nEn), x0, y, fs, { weight: 900, color: P.ink });
      txt(ctx, "tification".slice(0, nTi), x0 + wEn + wSt, y, fs, { weight: 900, color: P.ink });
      stikerBip(ctx, x0 + wEn + wSt / 2, y - fs * 0.34, wSt - 20, 190, clamp((typ * 16 - 2) / 3), t);
      ctx.restore(); }
    if (morph > 0) { ctx.save(); ctx.globalAlpha *= morph; const k = lerp(0.85, 1, morph); ctx.translate(960, y); ctx.scale(k, k);
      txt(ctx, "pembusukan platform", 0, 0, 120, { align: "center", weight: 900, color: P.amber }); ctx.restore(); }
    // garis tumbuh di bawah kata
    ctx.fillStyle = D.hexA(P.amber, 0.8); ctx.fillRect(960 - 300 * typ, y + 50, 600 * typ, 8);
    D.post(c2 => {
      tag(c2, "kata bahasa Inggris yang agak kasar", 960, 190, pop(l, tKata - 0.8).a * (1 - morph), { sp: pop(l, tKata - 0.8).sp, col: P.pink, size: 48 });
      tag(c2, "arti kasarnya ≈ proses pembusukan", 960, 700, pop(l, tBusuk).a * (1 - morph), { sp: pop(l, tBusuk).sp, col: P.amber, size: 52 });
      tag(c2, "di video ini:", 960, 250, morph, { col: P.teal, size: 48 });
    });
    KB.draw(ctx, 1650, 820, 170, { pose: l > tSebut ? "diam" : "kaget", k: l - tKata, mood: l > tSebut ? "happy" : "wow", seru: false, t, wave: l > tSebut ? 1 : 0 });
  };

  // ---------- b1_2: lini waktu ----------
  function piala(ctx, x, y, s, col, t) {   // piala generik berbentuk buku kamus
    ctx.save(); ctx.translate(x, y);
    U.addLight(ctx, 0, -s * 0.5, s * 1.1, col, 0.35);
    ctx.fillStyle = "#6E4630"; RR(ctx, -s * 0.36, -s * 0.12, s * 0.72, s * 0.12, 6); ctx.fill(); ctx.fillStyle = "#FFC94D"; ctx.fillRect(-s * 0.08, -s * 0.36, s * 0.16, s * 0.24);
    // buku terbuka
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, -s * 0.36); ctx.quadraticCurveTo(-s * 0.25, -s * 0.46, -s * 0.48, -s * 0.38); ctx.lineTo(-s * 0.48, -s * 0.98); ctx.quadraticCurveTo(-s * 0.25, -s * 1.06, 0, -s * 0.96); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.36); ctx.quadraticCurveTo(s * 0.25, -s * 0.46, s * 0.48, -s * 0.38); ctx.lineTo(s * 0.48, -s * 0.98); ctx.quadraticCurveTo(s * 0.25, -s * 1.06, 0, -s * 0.96); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FFF6E6"; ctx.beginPath(); ctx.moveTo(0, -s * 0.42); ctx.quadraticCurveTo(-s * 0.22, -s * 0.5, -s * 0.42, -s * 0.44); ctx.lineTo(-s * 0.42, -s * 0.92); ctx.quadraticCurveTo(-s * 0.22, -s * 0.98, 0, -s * 0.9); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.42); ctx.quadraticCurveTo(s * 0.22, -s * 0.5, s * 0.42, -s * 0.44); ctx.lineTo(s * 0.42, -s * 0.92); ctx.quadraticCurveTo(s * 0.22, -s * 0.98, 0, -s * 0.9); ctx.closePath(); ctx.fill();
    U.bars(ctx, -s * 0.36, -s * 0.84, s * 0.28, s * 0.03, 4, "rgba(40,50,100,0.35)", 3); U.bars(ctx, s * 0.08, -s * 0.84, s * 0.28, s * 0.03, 4, "rgba(40,50,100,0.35)", 5);
    // bintang
    ctx.fillStyle = "#FFC94D"; ctx.save(); ctx.translate(0, -s * 1.15); ctx.rotate(t * 0.6); ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? s * 0.06 : s * 0.14, a = i * Math.PI / 5 - Math.PI / 2; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.restore();
  }
  S.b1_2 = function (ctx, b, l, t) {
    const t22 = D.at(b, "akhir tahun"), t23 = D.at(b, "Setahun kemudian"), tKata = D.at(b, "kata tahun ini"), tJuta = D.at(b, "jutaan orang"), tNama = D.at(b, "belum punya nama");
    U.studio(ctx, t);
    const Y = 430, xs = [360, 960, 1560];
    const grow = eio(clamp((l - t22 + 0.3) / (t23 - t22 + 1.2)));
    ctx.strokeStyle = D.hexA(P.ink, 0.6); ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(xs[0], Y); ctx.lineTo(lerp(xs[0], xs[2], grow), Y); ctx.stroke();
    ["2022", "2023", "2024"].forEach((yr, i) => { const tp = [t22, t23, tKata + 1.6][i], a = pop(l, tp - 0.2); if (a.a <= 0) return;
      ctx.save(); ctx.globalAlpha *= a.a; ctx.fillStyle = [P.blue, P.amber, P.violet][i]; ctx.beginPath(); ctx.arc(xs[i], Y, 22 * lerp(0.5, 1, a.sp), 0, TAU); ctx.fill(); ctx.restore(); });
    // 2022: tulisan blog (kertas)
    const pa = pop(l, t22 + 0.3); if (pa.a > 0) { ctx.save(); ctx.globalAlpha *= pa.a; ctx.translate(xs[0], Y - 170); ctx.rotate(-0.05); ctx.fillStyle = "#FFF6E6"; RR(ctx, -90, -110, 180, 220, 12); ctx.fill(); U.bars(ctx, -66, -80, 132, 12, 7, "rgba(40,50,100,0.35)", 2); ctx.restore(); }
    // piala 2023 (besar) dan 2024 (kecil)
    const p23 = pop(l, tKata - 0.3), p24 = pop(l, tKata + 1.6);
    if (p23.a > 0) { ctx.save(); ctx.globalAlpha *= p23.a; piala(ctx, xs[1], Y - 40, 210 * lerp(0.6, 1, p23.sp), P.amber, t); ctx.restore(); }
    if (p24.a > 0) { ctx.save(); ctx.globalAlpha *= p24.a; piala(ctx, xs[2], Y - 40, 150 * lerp(0.6, 1, p24.sp), P.violet, t); ctx.restore(); }
    // jutaan orang: kepala-kepala kecil memenuhi bagian bawah, satu per satu "!"
    const ja = clamp((l - tJuta + 0.3) / 2.5);
    if (ja > 0) { const r = D.rng(17); for (let i = 0; i < 70; i++) { const x = 140 + r() * 1640, y = 700 + r() * 190, k = clamp(ja * 70 / 8 - i / 8); if (k <= 0) continue;
      ctx.save(); ctx.globalAlpha *= k; const c = ["#FF8A65", "#5AA9FF", "#FFD38A", "#5BD68A", "#B39DFF", "#FF8FB1"][i % 6];
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 16, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y + 34, 24, 18, 0, Math.PI, 0); ctx.fill();
      const ex = clamp((l - tNama - (i % 9) * 0.12) / 0.3); if (ex > 0) { txt(ctx, "!", x, y - 26, 44 * ex, { align: "center", weight: 900, color: P.amber }); }
      else if (l > tJuta + 0.6) { txt(ctx, "?", x, y - 26, 40, { align: "center", weight: 900, color: P.ink2 }); }
      ctx.restore(); } }
    D.post(c2 => {
      [["2022", 0, t22], ["2023", 1, t23], ["2024", 2, tKata + 1.6]].forEach(([s, i, tp]) => tag(c2, s, xs[i], Y + 70, pop(l, tp).a, { sp: pop(l, tp).sp, col: [P.blue, P.amber, P.violet][i], size: 52 }));
      tag(c2, "tulisan Doctorow", xs[0], Y - 330 < 110 ? 110 : Y - 330, pop(l, t22 + 0.5).a, { sp: pop(l, t22 + 0.5).sp, col: P.blue, size: 44 });
      tag(c2, "Kata tahun ini 2023", xs[1], 120, pop(l, tKata).a, { sp: pop(l, tKata).sp, col: P.amber, size: 48 });
      tag(c2, "American Dialect Society", xs[1], 600, pop(l, tKata + 0.3).a * (1 - ja), { col: P.amber, size: 44 });
      tag(c2, "2024 · Kamus Macquarie", xs[2] - 70, 120, pop(l, tKata + 1.8).a, { sp: pop(l, tKata + 1.8).sp, col: P.violet, size: 44 });
      tag(c2, "(Australia)", xs[2], 600, pop(l, tKata + 2.0).a * (1 - ja), { col: P.violet, size: 44 });
    });
  };

  // ---------- b1_3: tangga tiga tahap ----------
  const STEPS = [{ x0: 140, x1: 700, y: 400 }, { x0: 700, x1: 1260, y: 590 }, { x0: 1260, x1: 1820, y: 780 }];
  function muka(ctx, x, y, r, col, senyum, jenis) {   // ikon pengguna (kepala) atau pedagang (lapak kecil) dengan wajah
    ctx.save(); ctx.translate(x, y);
    if (jenis === "jual") { ctx.fillStyle = "#9A6A44"; ctx.fillRect(-r * 1.1, r * 0.5, r * 2.2, r * 0.9); ctx.fillStyle = col; ctx.fillRect(-r * 1.2, -r * 1.5, r * 2.4, r * 0.45); }
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
    if (jenis !== "jual") { ctx.beginPath(); ctx.ellipse(0, r * 1.9, r * 1.2, r * 0.85, 0, Math.PI, 0); ctx.fill(); }
    ctx.fillStyle = "#2A2350"; ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.15, r * 0.12, 0, TAU); ctx.arc(r * 0.35, -r * 0.15, r * 0.12, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#2A2350"; ctx.lineWidth = r * 0.12; ctx.lineCap = "round"; ctx.beginPath();
    const m = lerp(-1, 1, senyum); ctx.moveTo(-r * 0.38, r * 0.35 - m * r * 0.05); ctx.quadraticCurveTo(0, r * 0.35 + m * r * 0.3, r * 0.38, r * 0.35 - m * r * 0.05); ctx.stroke();
    ctx.restore();
  }
  function karung(ctx, x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = "#E9C46A"; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.5, s * 0.45, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#C9A24A"; ctx.fillRect(-s * 0.2, -s * 0.55, s * 0.4, s * 0.16);
    txt(ctx, "Rp", 0, s * 0.18, s * 0.42, { align: "center", weight: 900, color: "#7A5A1E" }); ctx.restore(); }
  function tangga(ctx, l, t, o) {
    U.studio(ctx, t);
    STEPS.forEach((s, i) => { const a = o.step[i]; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
      ctx.fillStyle = ["#3D5BB8", "#4A4FA8", "#5A4396"][i]; ctx.fillRect(s.x0, s.y, s.x1 - s.x0, 980 - s.y); ctx.fillStyle = ["#5A7BE0", "#6A6FD0", "#7A5FC0"][i]; ctx.fillRect(s.x0, s.y, s.x1 - s.x0, 18);
      ctx.restore(); });
    // tokoh di tiap anak tangga
    const F = [[1, null], [o.u2, o.m2], [o.u3, o.m3]];
    STEPS.forEach((s, i) => { const a = o.step[i]; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
      const [us, ms] = F[i]; muka(ctx, s.x0 + 150, s.y - 110, 40, "#5AA9FF", us, "beli"); if (ms != null) muka(ctx, s.x0 + 360, s.y - 110, 40, "#FFB547", ms, "jual"); ctx.restore(); });
  }
  S.b1_3 = function (ctx, b, l, t) {
    const t1 = D.at(b, "Pertama"), t2 = D.at(b, "Kedua"), t3 = D.at(b, "Ketiga"), tKant = D.at(b, "kantongnya sendiri");
    const st = [ramp(l, t1 - 0.4, 0.5), ramp(l, t2 - 0.3, 0.5), ramp(l, t3 - 0.3, 0.5)];
    const u2 = lerp(1, 0, ramp(l, t2 + 1.2, 0.8)), u3 = lerp(1, 0, ramp(l, t3 + 1.0, 0.8));
    tangga(ctx, l, t, { step: st, u2: lerp(1, 0, ramp(l, t2 + 1.0, 0.6)), m2: 1, u3: 0, m3: u3 });
    // Juragan di bawah kanan dengan kantong
    const ja = ramp(l, t3 + 0.5, 0.5);
    if (ja > 0) { ctx.save(); ctx.globalAlpha *= ja; U.juragan(ctx, 1745, 780, 250, { pose: "bagi", k: 0.6, t, dir: -1 }); ctx.restore(); }
    // karung menggelinding turun anak tangga
    const ru = clamp((l - tKant + 1.2) / 2.4);
    for (let i = 0; i < 4; i++) { const u = clamp(ru * 1.6 - i * 0.2); if (u <= 0) continue;
      const path = [[360, 300], [700, 380], [760, 560], [1260, 570], [1320, 760], [1690, 660]];
      const seg = Math.min(path.length - 2, Math.floor(u * (path.length - 1))), f = u * (path.length - 1) - seg;
      const [x0, y0] = path[seg], [x1, y1] = path[seg + 1]; const hop = Math.sin(f * Math.PI) * (seg % 2 ? 20 : 40);
      if (u < 1) karung(ctx, lerp(x0, x1, f), lerp(y0, y1, f) - hop, 70, u * 14); }
    D.post(c2 => {
      tag(c2, "1  baik kepada pengguna", 420, 180, pop(l, t1).a, { sp: pop(l, t1).sp, col: P.green, size: 44 });
      tag(c2, "2  memeras pengguna", 960, 375, pop(l, t2).a, { sp: pop(l, t2).sp, col: P.amber, size: 44 });
      tag(c2, "3  memeras mitra bisnis", 1420, 560, pop(l, t3).a, { sp: pop(l, t3).sp, col: P.pink, size: 44 });
      tag(c2, "pengguna", 290, 400 + 80, st[0] * pop(l, t1 + 0.5).a, { col: P.blue, size: 40 });
      tag(c2, "mitra bisnis", 1060, 590 + 80, st[1] * pop(l, t2 + 0.6).a, { col: P.amber, size: 40 });
      tag(c2, "kantong pemilik", 1640, 880, pop(l, tKant).a, { sp: pop(l, tKant).sp, col: "#FFD23F", size: 44 });
    });
  };

  // ---------- b1_4 ----------
  S.b1_4 = function (ctx, b, l, t) {
    const tKon = D.at(b, "teori konspirasi"), tDalam = D.at(b, "dari dalam"), tAkal = D.at(b, "masuk akal"), tPem = D.at(b, "bagi pemiliknya");
    const sw = eio(clamp((l - tDalam + 0.3) / 0.8));
    if (sw < 1) { ctx.save(); ctx.globalAlpha *= 1 - sw; tangga(ctx, l, t, { step: [1, 1, 1], u2: 0, m2: 1, u3: 0, m3: 0 });
      // benang merah ala papan konspirasi
      const ka = ramp(l, tKon - 0.4, 0.6); if (ka > 0) { ctx.strokeStyle = D.hexA("#FF5A5F", 0.85 * ka); ctx.lineWidth = 5; const pts = [[300, 260], [1080, 470], [1520, 650], [500, 700], [1300, 230]];
        ctx.beginPath(); pts.forEach(([x, y], i) => { const k = clamp(ka * 5 - i); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(lerp(pts[i - 1][0], x, k), lerp(pts[i - 1][1], y, k)); }); ctx.stroke();
        pts.forEach(([x, y]) => { ctx.fillStyle = "#FF5A5F"; ctx.beginPath(); ctx.arc(x, y, 12, 0, TAU); ctx.fill(); }); }
      ctx.restore(); }
    if (sw > 0) { ctx.save(); ctx.globalAlpha *= sw; const z = lerp(1.15, 1, sw); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
      U.kantor(ctx, t);
      // papan grafik untung
      D.panel(ctx, 260, 120, 760, 460, { r: 20, fill: "#1A2458", stroke: P.green, lw: 4 });
      const gu = clamp((l - tDalam) / 3); ctx.strokeStyle = P.green; ctx.lineWidth = 10; ctx.lineJoin = "round"; ctx.beginPath();
      const pts = [[320, 520], [460, 500], [600, 450], [740, 380], [880, 250], [960, 180]]; pts.forEach(([x, y], i) => { const k = clamp(gu * 5 - i + 1); if (i === 0) ctx.moveTo(x, y); else if (k > 0) ctx.lineTo(lerp(pts[i - 1][0], x, k), lerp(pts[i - 1][1], y, k)); }); ctx.stroke();
      U.juragan(ctx, 1000, 900, 420, { pose: "tunjuk", k: 1, t, dir: -1 });
      ctx.restore(); }
    D.post(c2 => {
      tag(c2, "Teori konspirasi?", 960, 140, pop(l, tKon).a * (1 - sw), { sp: pop(l, tKon).sp, col: P.pink, size: 56 });
      if (sw > 0.5) { ["Tahap 1", "Tahap 2", "Tahap 3"].forEach((s, i) => { const a = pop(l, tAkal + i * 0.35); tag(c2, "✓ " + s, 1500, 260 + i * 110, a.a, { sp: a.sp, col: P.green, size: 52 }); });
        tag(c2, "masuk akal bagi pemiliknya", 1420, 640, pop(l, tPem).a, { sp: pop(l, tPem).sp, col: P.amber, size: 48 }); }
    });
  };

  K.SCENES.d05_b1 = function (ctx, b, l, t, TL) { const f = S[b.id]; ctx.save(); U.napas(ctx, t); if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); ctx.restore(); };
  K.SCENES.d05_b1.noCam = true;
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b1 = TL => [
    K.sfxAt(TL, "b1_1", "enshittification", 0.3, "pop", 0.7), K.sfxAt(TL, "b1_1", "pembusukan platform", -0.2, "whoosh", 0.5),
    K.sfxAt(TL, "b1_2", "kata tahun ini", -0.3, "shimmer", 0.6), K.sfxAt(TL, "b1_2", "belum punya nama", 0, "pop", 0.4),
    K.sfxAt(TL, "b1_3", "Pertama", 0, "clack", 0.5), K.sfxAt(TL, "b1_3", "Kedua", 0, "clack", 0.5), K.sfxAt(TL, "b1_3", "Ketiga", 0, "clack", 0.5), K.sfxAt(TL, "b1_3", "kantongnya sendiri", -1.0, "whoosh", 0.4),
    K.sfxAt(TL, "b1_4", "dari dalam", -0.3, "whoosh", 0.5),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
