/* D05 bab 7 — Apakah membayar bisa menyelamatkanmu? (b7_1 … b7_5).
   b7_1 nasihat diketik, tombol "Ya"/"Tidak", Bip ragu di antaranya (jeda tebak); b7_2 layar TV generik: film berhenti, "Iklan · 0:30", "+$2,99/bulan", dompet mengempis;
   b7_3 nasihat dicoret, diganti pertanyaan baru; b7_4 gerobak "PLATFORM" di jalan menurun, empat rem menyala satu per satu dengan panel keterangan;
   b7_5 rem padam satu per satu (pesaing dibeli, aturan tertinggal, sambungan ditutup, PHK), gerobak meluncur, Bip mengejar. */
(function (g) {
  const K = g.Kiko, D = K.dok, KIT = K.kit, U = K.d05, P = D.P, KB = KIT.bipkit, KY = KIT.layar;
  const W = 1920, HH = 1080, TAU = Math.PI * 2;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, pop, tag, txt } = U;
  const FONT = K.FONT, RR = (...a) => K.helpers.rr(...a);
  const S = {};
  const NASIHAT1 = "Kalau kamu tidak membayar,", NASIHAT2 = "kamulah produknya.";

  function tombol(ctx, x, y, w, s, col, a, hover) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; const k = 1 + 0.04 * hover; ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = "rgba(10,10,30,0.35)"; RR(ctx, -w / 2 + 6, -46, w, 104, 52); ctx.fill(); ctx.fillStyle = col; RR(ctx, -w / 2, -52, w, 104, 52); ctx.fill();
    txt(ctx, s, 0, 20, 56, { align: "center", weight: 900, color: "#FFFFFF" }); ctx.restore(); }
  function ketik(ctx, s, x, y, size, u, col, opt = {}) { const n = Math.floor(s.length * clamp(u)); txt(ctx, s.slice(0, n), x, y, size, Object.assign({ weight: 900, color: col, align: "center" }, opt)); }

  // ---------- b7_1 ----------
  S.b7_1 = function (ctx, b, l, t) {
    const tKalau = D.at(b, "Kalau kamu"), tJadi = D.at(b, "apakah solusinya"), tTebak = D.at(b, "Coba tebak");
    U.studio(ctx, t);
    const u1 = clamp((l - tKalau + 0.2) / 1.6), u2 = clamp((l - tKalau - 1.6) / 1.3);
    D.post(c2 => {
      D.panel(c2, 260, 140, 1400, 300, { r: 30, fill: "rgba(10,18,52,0.85)", stroke: P.amber, lw: 4 });
      txt(c2, "“", 320, 260, 140, { weight: 900, color: P.amber });
      ketik(c2, NASIHAT1, 960, 270, 76, u1, P.ink); ketik(c2, NASIHAT2, 960, 370, 76, u2, P.amber);
      U.judul(c2, "Jadi, solusinya membayar?", 960, 560, 60, pop(l, tJadi).a, { sp: pop(l, tJadi).sp, col: P.violet });
    });
    const ba = ramp(l, tJadi + 0.6, 0.4), sway = Math.sin(t * 2.2);
    tombol(ctx, 560, 760, 300, "Ya", P.green, ba, sway > 0 ? 1 : 0); tombol(ctx, 1360, 760, 300, "Tidak", P.red, ba, sway < 0 ? 1 : 0);
    if (ba > 0) KB.draw(ctx, 960 + sway * 110, 750, 170, { pose: "jalan", dir: sway > 0 ? -1 : 1, mood: "think", t, speed: 0.6 });
    D.post(c2 => U.judul(c2, "Tebak dulu!", 960, 915, 56, pop(l, tTebak).a, { sp: pop(l, tTebak).sp, col: P.pink }));
  };

  // ---------- b7_2: TV + iklan ----------
  function tv(ctx, x, y, w, t, o) {
    const h = w * 0.58; ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "#4A3F2E"; RR(ctx, -w * 0.4, h * 0.52 + 30, w * 0.8, 40, 10); ctx.fill(); ctx.fillStyle = "#2A2E58"; ctx.fillRect(-w * 0.04, h / 2, w * 0.08, 40);
    ctx.fillStyle = "#1A1E44"; RR(ctx, -w / 2 - 16, -h / 2 - 16, w + 32, h + 32, 18); ctx.fill();
    ctx.save(); RR(ctx, -w / 2, -h / 2, w, h, 8); ctx.clip();
    // film: pemandangan senja dengan gunung
    const gr = ctx.createLinearGradient(0, -h / 2, 0, h / 2); gr.addColorStop(0, "#FF9F6A"); gr.addColorStop(1, "#7A4AB8"); ctx.fillStyle = gr; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = "#FFE29A"; ctx.beginPath(); ctx.arc(w * 0.18 + (o.jalan ? Math.sin(t * 0.4) * 20 : 0), -h * 0.05, h * 0.12, 0, TAU); ctx.fill();
    ctx.fillStyle = "#3A2F6E"; ctx.beginPath(); ctx.moveTo(-w / 2, h / 2); ctx.lineTo(-w * 0.25, -h * 0.05); ctx.lineTo(-w * 0.05, h * 0.18); ctx.lineTo(w * 0.2, -h * 0.12); ctx.lineTo(w / 2, h * 0.25); ctx.lineTo(w / 2, h / 2); ctx.fill();
    ctx.fillStyle = "#1E1A44"; ctx.beginPath(); ctx.moveTo(-w / 2, h / 2); ctx.lineTo(-w * 0.1, h * 0.22); ctx.lineTo(w * 0.15, h * 0.35); ctx.lineTo(w / 2, h * 0.2); ctx.lineTo(w / 2, h / 2); ctx.fill();
    if (o.iklan > 0) { ctx.fillStyle = `rgba(8,10,30,${0.75 * o.iklan})`; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.save(); ctx.globalAlpha *= o.iklan; ctx.fillStyle = "#FFD23F"; RR(ctx, -w * 0.3, -h * 0.28, w * 0.6, h * 0.5, 20); ctx.fill(); ctx.fillStyle = "#FF6F61"; ctx.beginPath(); ctx.arc(-w * 0.12, -h * 0.03, h * 0.12, 0, TAU); ctx.fill(); U.bars(ctx, w * 0.02, -h * 0.12, w * 0.22, h * 0.04, 3, "rgba(40,30,30,0.4)", 2); ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.fillRect(-w / 2, h / 2 - 12, w, 12); ctx.fillStyle = "#FFD23F"; ctx.fillRect(-w / 2, h / 2 - 12, w * clamp(o.prog), 12); }
    else { ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.fillRect(-w / 2, h / 2 - 12, w, 12); ctx.fillStyle = "#FF6F61"; ctx.fillRect(-w / 2, h / 2 - 12, w * 0.42, 12); }
    ctx.restore(); ctx.restore();
  }
  function dompet(ctx, x, y, s, isi) { ctx.save(); ctx.translate(x, y); const k = lerp(0.62, 1, isi);
    ctx.fillStyle = "#6E4630"; RR(ctx, -s * 0.5, -s * 0.36 * k, s, s * 0.72 * k, 18); ctx.fill(); ctx.fillStyle = "#8A5A3C"; RR(ctx, s * 0.1, -s * 0.14 * k, s * 0.42, s * 0.28 * k, 12); ctx.fill();
    ctx.fillStyle = "#FFC94D"; ctx.beginPath(); ctx.arc(s * 0.3, 0, s * 0.06, 0, TAU); ctx.fill();
    if (isi > 0.4) { ctx.fillStyle = "#7FCF8E"; RR(ctx, -s * 0.4, -s * 0.36 * k - s * 0.14 * isi, s * 0.5, s * 0.2, 6); ctx.fill(); } ctx.restore(); }
  S.b7_2 = function (ctx, b, l, t) {
    const tJan = D.at(b, "Januari"), tIklan = D.at(b, "menayangkan iklan"), tSudah = D.at(b, "sudah membayar"), tLagi = D.at(b, "membayar lagi"), tDolar = D.at(b, "dua koma");
    D.bg(ctx, t, { top: "#1A1E4A", bot: "#3A3270", stars: 0.2 });
    // ruang keluarga sederhana: dinding + sofa
    ctx.fillStyle = "#3A3270"; ctx.fillRect(0, 780, W, 300); ctx.fillStyle = "#5A4A8A"; RR(ctx, 1300, 760, 520, 160, 40); ctx.fill(); RR(ctx, 1280, 700, 560, 90, 40); ctx.fill();
    const ia = ramp(l, tIklan - 0.2, 0.4);
    tv(ctx, 760, 430, 1000, t, { iklan: ia, prog: clamp((l - tIklan) / 30), jalan: ia < 0.5 });
    const isi = 1 - 0.38 * eio(clamp((l - tDolar) / 1.2));
    const da = ramp(l, tLagi - 0.4, 0.4); if (da > 0) { ctx.save(); ctx.globalAlpha *= da; dompet(ctx, 1560, 520, 260, isi); ctx.restore(); }
    D.post(c2 => {
      tag(c2, "Januari 2024 · Prime Video (Amazon)", 760, 110, pop(l, tJan).a, { sp: pop(l, tJan).sp, col: P.blue, size: 44 });
      tag(c2, "Iklan · 0:30", 760, 430, ia * pop(l, tIklan).a, { col: "#FFD23F", size: 56 });
      tag(c2, "✓ pelanggan berbayar", 760, 820, pop(l, tSudah).a, { sp: pop(l, tSudah).sp, col: P.green, size: 48 });
      tag(c2, "+$2,99/bulan untuk tanpa iklan", 1440, 330, pop(l, tDolar).a, { sp: pop(l, tDolar).sp, col: P.pink, size: 48 });
    });
  };

  // ---------- b7_3 ----------
  S.b7_3 = function (ctx, b, l, t) {
    const tJamin = D.at(b, "tidak menjamin"), tPerkara = D.at(b, "Perkaranya"), tApakah = D.at(b, "apakah perusahaan");
    U.studio(ctx, t);
    const coret = eio(clamp((l - tJamin) / 0.7)), na = 1 - 0.55 * ramp(l, tApakah - 0.5, 0.5);
    D.post(c2 => {
      c2.save(); c2.globalAlpha = na; D.panel(c2, 260, 140, 1400, 300, { r: 30, fill: "rgba(10,18,52,0.85)", stroke: P.ink2, lw: 3 });
      txt(c2, NASIHAT1, 960, 270, 76, { align: "center", weight: 900, color: P.ink }); txt(c2, NASIHAT2, 960, 370, 76, { align: "center", weight: 900, color: P.ink2 });
      c2.strokeStyle = P.red; c2.lineWidth = 14; c2.lineCap = "round"; c2.beginPath(); c2.moveTo(340, 300); c2.lineTo(lerp(340, 1580, coret), lerp(300, 280, coret)); c2.stroke();
      c2.beginPath(); c2.moveTo(560, 395); c2.lineTo(lerp(560, 1360, clamp(coret * 1.2 - 0.2)), 380); c2.stroke(); c2.restore();
      const qa = pop(l, tApakah - 0.2); if (qa.a > 0) { c2.save(); c2.globalAlpha = qa.a; c2.translate(960, 680); const k = lerp(0.85, 1, qa.sp); c2.scale(k, k);
        D.panel(c2, -820, -150, 1640, 300, { r: 30, fill: "rgba(10,18,52,0.92)", stroke: P.amber, lw: 5 });
        txt(c2, "Bisakah mereka memperburuk layanan", 0, -20, 66, { align: "center", weight: 900, color: P.ink }); txt(c2, "tanpa kehilanganmu?", 0, 80, 72, { align: "center", weight: 900, color: P.amber }); c2.restore(); }
      tag(c2, "membayar ≠ jaminan", 960, 560 - 20, pop(l, tJamin).a * (1 - ramp(l, tApakah - 0.6, 0.3)), { sp: pop(l, tJamin).sp, col: P.pink, size: 52 });
    });
    KB.draw(ctx, 1720, 900, 160, { pose: l > tApakah ? "tunjuk" : "diam", target: [1400, 680], mood: l > tApakah ? "wow" : "think", t });
  };

  // ---------- jalan menurun + gerobak ----------
  const ANG = 0.17, ROAD = x => 470 + Math.tan(ANG) * x;
  function jalan(ctx, t, dx = 0) {
    const sky = ctx.createLinearGradient(0, 0, 0, 700); sky.addColorStop(0, "#3E62C4"); sky.addColorStop(1, "#FFD3A0"); ctx.fillStyle = sky; ctx.fillRect(-2000, -500, 8000, 2200);
    ctx.fillStyle = "#7FA36E"; ctx.beginPath(); ctx.moveTo(-2000, ROAD(-2000) - 30); ctx.lineTo(6000, ROAD(6000) - 30); ctx.lineTo(6000, 3000); ctx.lineTo(-2000, 3000); ctx.fill();
    ctx.fillStyle = "#5C6390"; ctx.beginPath(); ctx.moveTo(-2000, ROAD(-2000)); ctx.lineTo(6000, ROAD(6000)); ctx.lineTo(6000, ROAD(6000) + 170); ctx.lineTo(-2000, ROAD(-2000) + 170); ctx.fill();
    ctx.strokeStyle = "#FFF6E6"; ctx.lineWidth = 8; ctx.setLineDash([60, 50]); ctx.beginPath(); ctx.moveTo(-2000, ROAD(-2000) + 90); ctx.lineTo(6000, ROAD(6000) + 90); ctx.stroke(); ctx.setLineDash([]);
    // rambu turunan
    for (let x = -1200; x < 6000; x += 1400) { ctx.fillStyle = "#8C93B8"; ctx.fillRect(x, ROAD(x) - 210, 10, 180); ctx.fillStyle = "#FFD23F"; ctx.save(); ctx.translate(x + 5, ROAD(x) - 240); ctx.rotate(Math.PI / 4); ctx.fillRect(-42, -42, 84, 84); ctx.restore();
      ctx.fillStyle = "#2A2350"; ctx.beginPath(); ctx.moveTo(x - 20, ROAD(x) - 260); ctx.lineTo(x + 30, ROAD(x) - 224); ctx.lineTo(x - 20, ROAD(x) - 224); ctx.fill(); }
  }
  const REM_DESC = ["pengguna bisa pindah", "perusahaan bisa dihukum", "pindah tanpa kehilangan teman", "berani menolak fitur merugikan"];
  const REM_COL = [P.green, P.blue, P.teal, P.violet];
  function panelRem(c2, rem, l, lab, desc, x0 = 100, y0 = 110, mati) {
    D.panel(c2, x0, y0, 640, 4 * 92 + 40, { r: 24, fill: "rgba(10,18,52,0.88)" });
    U.REM.forEach((s, i) => { const on = rem[i], y = y0 + 64 + i * 92; c2.fillStyle = on > 0.05 ? U.mix("#5C6390", "#FF5A5F", on) : "#5C6390"; c2.beginPath(); c2.arc(x0 + 50, y - 14, 22, 0, TAU); c2.fill();
      if (on > 0.05) D.glow(c2, x0 + 50, y - 14, 50, "#FF8A6A", on * 0.6);
      txt(c2, (i + 1) + ". " + s, x0 + 92, y, 44, { weight: 900, color: on > 0.05 ? P.ink : P.dim });
      const d = desc ? desc[i] : null; if (d && on > 0.05) { c2.save(); c2.globalAlpha = on; c2.font = `900 44px ${FONT}`; const w0 = c2.measureText((i + 1) + ". " + s).width; c2.restore(); }
      if (mati && mati[i] > 0) { c2.save(); c2.globalAlpha = mati[i]; c2.font = `900 44px ${FONT}`; const w0 = c2.measureText((i + 1) + ". " + s).width; c2.strokeStyle = P.red; c2.lineWidth = 6; c2.beginPath(); c2.moveTo(x0 + 88, y - 15); c2.lineTo(x0 + 92 + w0 * mati[i], y - 15); c2.stroke(); c2.restore(); } });
  }
  S.b7_4 = function (ctx, b, l, t) {
    const tEmpat = D.at(b, "empat rem"), tR = ["Rem pertama", "Rem kedua", "Rem ketiga", "Rem keempat"].map(s => D.at(b, s));
    const c = { x: 1100, y: 560 + 60, z: 1 };
    ctx.save(); U.camT(ctx, c); jalan(ctx, t);
    const rem = tR.map(t0 => clamp((l - t0 - 0.6) / 0.4));
    const gx = 1450, A = U.gerobak(ctx, gx, ROAD(gx) + 60, 640, { rem, ang: ANG, t, putar: 0 });
    // Bip berdiri di samping
    KB.draw(ctx, 900, ROAD(900) + 10, 150, { pose: "tunjuk", target: [gx, ROAD(gx)], mood: "think", t });
    ctx.restore();
    D.post(c2 => {
      panelRem(c2, rem, l);
      const cur = rem.reduce((m, v, i) => (v > 0 ? i : m), -1);
      if (cur >= 0) tag(c2, REM_DESC[cur], 420, 590, rem[cur], { col: REM_COL[cur], size: 48 });
      tag(c2, "4 rem menurut Doctorow", 1500, 140, pop(l, tEmpat).a, { sp: pop(l, tEmpat).sp, col: P.amber, size: 48 });
      if (cur === 2) tag(c2, "kemampuan layanan lain untuk tersambung", 560, 680, rem[2] * (1 - (rem[3] || 0)), { col: P.teal, size: 40 });
    });
  };
  S.b7_5 = function (ctx, b, l, t) {
    const tLemah = D.at(b, "melemah bersamaan"), tOff = ["membeli pesaingnya", "aturan dari pemerintah", "sambungan antaraplikasi", "gelombang PHK"].map(s => D.at(b, s));
    const mati = tOff.map(t0 => clamp((l - t0 - 0.2) / 0.5)), rem = mati.map(m => 1 - m);
    // gerobak mulai meluncur sesudah rem terakhir padam
    const run = Math.max(0, l - tOff[3] - 0.6), dx = 260 * run * run * 0.5 + 40 * Math.max(0, l - tOff[1]) * clamp(mati[1]);
    const gx = 1450 + dx, c = { x: lerp(1100, gx - 350, clamp(run / 1.5)), y: 620 + Math.tan(ANG) * lerp(0, gx - 1450 - 100, clamp(run / 1.5)), z: 1 };
    ctx.save(); U.camT(ctx, c); jalan(ctx, t);
    U.gerobak(ctx, gx, ROAD(gx) + 60, 640, { rem, ang: ANG, t, putar: dx / 64 });
    const bx = Math.max(900 + 380 * Math.max(0, l - tOff[3] - 0.4), gx - 480);
    KB.draw(ctx, bx, ROAD(bx) + 10, 150, { pose: l > tOff[3] + 0.4 ? "jalan" : "kaget", k: l - tOff[0], dir: 1, mood: "wow", sweat: l > tOff[3], t, speed: 3 });
    ctx.restore();
    D.post(c2 => {
      panelRem(c2, rem, l, null, null, 100, 110, mati);
      const lab = ["pesaing dibeli", "aturan tertinggal", "sambungan ditutup", "PHK: pekerja takut"];
      const cur = mati.reduce((m, v, i) => (v > 0 ? i : m), -1);
      if (cur >= 0) tag(c2, lab[cur], 420, 590, clamp(mati[cur] * 2), { col: P.red, size: 52 });
      tag(c2, "melemah bersamaan", 1500, 140, pop(l, tLemah).a, { sp: pop(l, tLemah).sp, col: P.pink, size: 48 });
    });
  };

  K.SCENES.d05_b7 = function (ctx, b, l, t, TL) { const f = S[b.id]; if (f) f(ctx, b, l, t, TL); else D.bg(ctx, t); };
  K.SCENES.d05_b7.noCam = true;
  K.sfxParts = K.sfxParts || {};
  K.sfxParts.b7 = TL => [
    K.sfxAt(TL, "b7_1", "apakah solusinya", 0.6, "pop", 0.5), K.sfxAt(TL, "b7_1", "Coba tebak", 0, "pop", 0.6),
    K.sfxAt(TL, "b7_2", "menayangkan iklan", -0.2, "clack", 0.6), K.sfxAt(TL, "b7_2", "dua koma", 0, "pop", 0.5),
    K.sfxAt(TL, "b7_3", "tidak menjamin", 0, "whoosh", 0.5), K.sfxAt(TL, "b7_3", "apakah perusahaan", -0.2, "shimmer", 0.5),
    ...["Rem pertama", "Rem kedua", "Rem ketiga", "Rem keempat"].map(s => K.sfxAt(TL, "b7_4", s, 0.6, "clack", 0.6)),
    ...["membeli pesaingnya", "aturan dari pemerintah", "sambungan antaraplikasi", "gelombang PHK"].map(s => K.sfxAt(TL, "b7_5", s, 0.2, "pop", 0.4)),
    K.sfxAt(TL, "b7_5", "gelombang PHK", 1.0, "riser", 0.6),
  ].filter(Boolean);
})(typeof window !== "undefined" ? window : globalThis);
