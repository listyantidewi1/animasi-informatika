/* D06 bab 1 — Seberapa pintar AI dalam coding? (b1_1 … b1_7)
   b1_1 pertanyaan + editor yang mengetik sendiri; b1_2 alur ujian: laporan bug → AI memperbaiki → tes otomatis; b1_3 grafik 60% → hampir 100%;
   b1_4 agen AI 12% → ±66% (OSWorld); b1_5 tiga kotak: satu gagal; b1_6 ujian vs pekerjaan nyata; b1_7 jembatan ke dampak pekerjaan. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d06, P = D.P;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {};

  S.b1_1 = function (ctx, b, l, t) {
    const tQ = D.at(b, "seberapa pintar");
    U.latar(ctx, t, { col: P.blue });
    U.jendela(ctx, 360, 330, 1200, 430, "Editor");
    U.kode(ctx, 420, 430, 1080, 7, 3, clamp((l - 0.8) / 5));
    const cur = Math.floor(t * 2) % 2; if (cur) { ctx.fillStyle = P.amber; ctx.fillRect(430, 430 + Math.min(6, Math.floor(clamp((l - 0.8) / 5) * 7)) * 46 - 6, 6, 32); }
    D.post(c => { U.judulPop(c, "Seberapa pintar AI dalam menulis kode?", 960, 190, 72, l, tQ - 0.2, { col: P.blue }); U.tagPop(c, "AI sedang mengetik…", 1330, 700, l, 1.2, { col: P.violet, size: 44 }); });
    U.bip(ctx, 1730, 860, 170, t, { pose: "diam", mood: "think" });
  };

  function kartu(ctx, x, y, w, h, judul, col, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - eout(a)) * 40); U.panel(ctx, x, y, w, h, { stroke: D.hexA(col, 0.8) });
    ctx.fillStyle = D.hexA(col, 0.2); RR(ctx, x, y, w, 84, 28); ctx.fill(); txt(ctx, judul, x + w / 2, y + 58, 46, { align: "center", weight: 900, color: col, fit: w - 40 }); ctx.restore(); }
  S.b1_2 = function (ctx, b, l, t) {
    const tUj = D.at(b, "ujian coding"), tBug = D.at(b, "laporan bug"), tFix = D.at(b, "memperbaiki"), tTes = D.at(b, "tes otomatis");
    U.latar(ctx, t, { col: P.teal });
    const y = 300, h = 420, w = 500, xs = [130, 710, 1290];
    const a1 = ramp(l, tBug - 0.3, 0.5), a2 = ramp(l, tFix - 0.3, 0.5), a3 = ramp(l, tTes - 0.3, 0.5);
    kartu(ctx, xs[0], y, w, h, "1. Laporan bug", P.red, a1);
    if (a1 > 0) { ctx.save(); ctx.globalAlpha *= a1; ctx.fillStyle = D.hexA(P.red, 0.9); ctx.beginPath(); ctx.ellipse(xs[0] + 110, y + 190, 44, 54, 0, 0, U.TAU); ctx.fill();
      ctx.strokeStyle = P.red; ctx.lineWidth = 8; ctx.lineCap = "round"; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(xs[0] + 70, y + 190 + i * 30); ctx.lineTo(xs[0] + 34, y + 180 + i * 42); ctx.moveTo(xs[0] + 150, y + 190 + i * 30); ctx.lineTo(xs[0] + 186, y + 180 + i * 42); ctx.stroke(); }
      [0, 1, 2, 3].forEach(i => { ctx.fillStyle = "rgba(242,246,255,0.3)"; RR(ctx, xs[0] + 220, y + 140 + i * 44, i === 3 ? 140 : 230, 20, 10); ctx.fill(); });
      txt(ctx, "\"tombol simpan", xs[0] + 50, y + 330, 40, { weight: 700, color: P.ink2 }); txt(ctx, "tidak bekerja\"", xs[0] + 50, y + 380, 40, { weight: 700, color: P.ink2 }); ctx.restore(); }
    kartu(ctx, xs[1], y, w, h, "2. AI memperbaiki kode", P.violet, a2);
    if (a2 > 0) { ctx.save(); ctx.globalAlpha *= a2; U.kode(ctx, xs[1] + 40, y + 130, 420, 6, 9, clamp((l - tFix) / 2.2)); ctx.restore(); }
    kartu(ctx, xs[2], y, w, h, "3. Tes otomatis", P.green, a3);
    if (a3 > 0) [0, 1, 2].forEach(i => { const k = (l - tTes - 0.3 - i * 0.45) / 0.4; ctx.save(); ctx.globalAlpha *= a3; ctx.fillStyle = "rgba(242,246,255,0.25)"; RR(ctx, xs[2] + 130, y + 150 + i * 84, 300, 22, 11); ctx.fill(); ctx.restore(); U.centang(ctx, xs[2] + 74, y + 160 + i * 84, 30, k); });
    U.panah(ctx, xs[0] + w + 14, y + h / 2, xs[1] - 14, y + h / 2, P.ink2, (l - tFix + 0.5) / 0.5, 8);
    U.panah(ctx, xs[1] + w + 14, y + h / 2, xs[2] - 14, y + h / 2, P.ink2, (l - tTes + 0.5) / 0.5, 8);
    D.post(c => { U.judulPop(c, "Ujian coding dari masalah nyata proyek open source", 960, 150, 58, l, tUj - 0.3, { col: P.teal }); U.tagPop(c, "nama ujiannya: SWE-bench Verified", 960, 790, l, tUj + 1.2, { col: P.teal, size: 44 }); });
  };

  S.b1_3 = function (ctx, b, l, t) {
    const tLap = D.at(b, "AI Index"), t60 = D.at(b, "enam puluh persen"), t100 = D.at(b, "hampir seratus"), tSatu = D.at(b, "hanya dalam satu tahun");
    U.latar(ctx, t, { col: P.amber, gx: 1300, gy: 300 });
    const G = U.grafikSkor(ctx, l, t60 + 0.4, { t0: 0.3, d: Math.max(1.5, t100 - t60) });
    D.post(c => {
      U.judulPop(c, "Skor AI di ujian coding", 760, 108, 64, l, 0.2, { col: P.teal });
      U.tagPop(c, "±60%", G.p0[0] - 10, G.p0[1] - 80, l, t60, { col: P.blue, size: 56 });
      U.tagPop(c, "hampir 100%", G.e[0] - 120, G.e[1] + 96, l, t100 + 0.6, { col: P.amber, size: 60 });
      U.sumber(c, l, tLap, "Stanford HAI, AI Index Report 2026");
    });
    const p = U.pop(l, tSatu); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; U.panel(ctx, 1400, 300, 420, 300, { stroke: D.hexA(P.amber, 0.8) }); U.angka(ctx, "1", 1610, 470, 170, P.amber, 1, { sp: p.sp }); txt(ctx, "tahun", 1610, 560, 60, { align: "center", weight: 900 }); ctx.restore(); }
    else U.bip(ctx, 1640, 800, 190, t, { pose: "kaget", mood: "wow", k: l - t100 });
  };

  S.b1_4 = function (ctx, b, l, t) {
    const tAgen = D.at(b, "Agen AI"), tKomp = D.at(b, "memakai komputer"), t12 = D.at(b, "dua belas persen"), t66 = D.at(b, "enam puluh enam");
    U.latar(ctx, t, { col: P.violet, gx: 500, gy: 300 });
    // layar komputer yang dioperasikan AI
    U.jendela(ctx, 130, 280, 820, 500, "Komputer");
    const cx = 250 + 520 * (0.5 + 0.5 * Math.sin(l * 0.9)), cy = 420 + 220 * (0.5 + 0.5 * Math.sin(l * 1.37 + 1));
    [[200, 390, 300, 150, P.blue], [540, 390, 340, 150, P.teal], [200, 580, 680, 150, P.violet]].forEach(([x, y, w, h, c]) => { ctx.fillStyle = D.hexA(c, 0.22); RR(ctx, x, y, w, h, 16); ctx.fill(); ctx.fillStyle = D.hexA(c, 0.7); RR(ctx, x + 20, y + 22, w * 0.5, 20, 10); ctx.fill(); });
    ctx.fillStyle = "#FFFFFF"; ctx.strokeStyle = "#10142E"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + 46); ctx.lineTo(cx + 13, cy + 34); ctx.lineTo(cx + 26, cy + 58); ctx.lineTo(cx + 36, cy + 52); ctx.lineTo(cx + 24, cy + 30); ctx.lineTo(cx + 40, cy + 28); ctx.closePath(); ctx.fill(); ctx.stroke();
    // batang 12% -> 66%
    const x = 1130, yb = 740, hh = 440; U.panel(ctx, 1040, 250, 760, 540);
    U.sumbu(ctx, x, yb - hh, 600, hh, [[0, ""], [0.5, ""], [1, ""]]);
    U.batang(ctx, x + 70, yb, 180, hh * 0.12, P.blue, (l - t12 + 0.3) / 0.8); U.batang(ctx, x + 350, yb, 180, hh * 0.66, P.amber, (l - t66 + 0.3) / 1.2);
    D.post(c => {
      U.judulPop(c, "Agen AI: AI yang memakai komputer sendiri", 960, 150, 60, l, tAgen - 0.2, { col: P.violet });
      U.tagPop(c, "12%", x + 160, yb - hh * 0.12 - 60, l, t12 + 0.4, { col: P.blue, size: 52 });
      U.tagPop(c, "±66%", x + 440, yb - hh * 0.66 - 60, l, t66 + 0.9, { col: P.amber, size: 60 });
      U.sumber(c, l, t12, "Stanford AI Index 2026 (ujian OSWorld)");
    });
  };

  S.b1_5 = function (ctx, b, l, t) {
    const t66 = D.at(b, "Enam puluh enam"), tGagal = D.at(b, "masih gagal"), t13 = D.at(b, "satu dari tiga");
    U.latar(ctx, t, { col: P.red, gx: 1400, gy: 600, ga: 0.18 });
    const w = 360, y = 330, xs = [330, 780, 1230];
    xs.forEach((x, i) => { const a = eout(ramp(l, t66 - 0.2 + i * 0.25, 0.5)); if (a <= 0) return; const bad = i === 2, kb = bad ? eio(ramp(l, tGagal - 0.1, 0.5)) : 0; ctx.save(); ctx.globalAlpha *= a;
      if (bad && kb > 0) ctx.translate(Math.sin(l * 30) * 6 * (1 - ramp(l, tGagal + 0.4, 0.4)), 0);
      U.panel(ctx, x, y, w, 360, { stroke: D.hexA(bad && kb > 0 ? P.red : P.green, 0.9), fill: bad && kb > 0 ? "rgba(70,16,36,0.92)" : "rgba(14,50,50,0.92)", lw: 5 });
      txt(ctx, "Percobaan " + (i + 1), x + w / 2, y + 70, 46, { align: "center", weight: 800, color: P.ink2 }); ctx.restore();
      if (bad) { U.centang(ctx, x + w / 2, y + 210, 80, kb > 0 ? 0 : (l - t66 - 0.4) / 0.4); U.silang(ctx, x + w / 2, y + 210, 80, (l - tGagal) / 0.4); } else U.centang(ctx, x + w / 2, y + 210, 80, (l - t66 - 0.2 - i * 0.25) / 0.4); });
    D.post(c => { U.judulPop(c, "66% berhasil berarti…", 960, 170, 72, l, t66 - 0.3, { col: P.amber }); U.tagPop(c, "masih gagal kira-kira 1 dari 3 percobaan", 960, 790, l, t13 - 0.3, { col: P.red, size: 56 }); });
  };

  S.b1_6 = function (ctx, b, l, t) {
    const tUj = D.at(b, "ujian adalah ujian"), tNy = D.at(b, "pekerjaan nyata"), tPa = D.at(b, "memahami masalahnya"), tTe = D.at(b, "menulis tesnya"), tPu = D.at(b, "memutuskan");
    U.latar(ctx, t, { col: P.teal, gx: 960, gy: 300 });
    const aL = eout(ramp(l, tUj - 0.3, 0.5)), aR = eout(ramp(l, tNy - 0.3, 0.5));
    if (aL > 0) { ctx.save(); ctx.globalAlpha *= aL; U.panel(ctx, 120, 240, 780, 400, { stroke: D.hexA(P.blue, 0.8) }); txt(ctx, "Ujian", 510, 310, 60, { align: "center", weight: 900, color: P.blue });
      [["soal rapi", 220], ["tes sudah jadi", 560]].forEach(([s, x], i) => { ctx.fillStyle = "#EEF2FF"; RR(ctx, x - 20, 350, 300, 190, 14); ctx.fill(); ctx.fillStyle = "rgba(40,50,100,0.35)"; for (let j = 0; j < 4; j++) { RR(ctx, x, 376 + j * 36, j === 3 ? 140 : 250, 16, 8); ctx.fill(); } txt(ctx, s, x + 130, 600, 44, { align: "center", weight: 800 }); });
      U.centang(ctx, 830, 370, 30, (l - tUj) / 0.4); ctx.restore(); }
    if (aR > 0) { ctx.save(); ctx.globalAlpha *= aR; U.panel(ctx, 1020, 240, 780, 400, { stroke: D.hexA(P.amber, 0.8) }); txt(ctx, "Pekerjaan nyata", 1410, 310, 60, { align: "center", weight: 900, color: P.amber });
      const r = D.rng(8); for (let i = 0; i < 7; i++) { ctx.save(); ctx.translate(1140 + r() * 520, 390 + r() * 150); ctx.rotate((r() - 0.5) * 0.7); ctx.fillStyle = ["#EEF2FF", "#FFE9B8", "#FFD0DC"][i % 3]; RR(ctx, -70, -45, 140, 90, 10); ctx.fill(); ctx.fillStyle = "rgba(40,50,100,0.35)"; RR(ctx, -52, -24, 90, 12, 6); ctx.fill(); RR(ctx, -52, 2, 60, 12, 6); ctx.fill(); ctx.restore(); }
      txt(ctx, "?", 1410, 610, 80, { align: "center", weight: 900, color: P.amber }); ctx.restore(); }
    D.post(c => {
      U.judulPop(c, "Ujian bukan pekerjaan nyata", 960, 140, 68, l, tUj - 0.4, { col: P.teal });
      [["memahami masalah", tPa, P.blue], ["menulis tes", tTe, P.green], ["memutuskan: layak dipakai?", tPu, P.amber]].forEach(([s, tt, col], i) => U.tagPop(c, s, [330, 800, 1400][i], 760, l, tt, { col, size: 48 }));
    });
    const aO = ramp(l, tPa - 0.6, 0.4); U.orang(ctx, 960, 700, 0, P.ink, 0); if (aO > 0) txt(ctx, "tugas manusia:", 120, 700, 44, { weight: 800, color: D.hexA(P.ink2, aO) });
  };

  S.b1_7 = function (ctx, b, l, t) {
    const tP = D.at(b, "sangat pandai"), tD = D.at(b, "apa dampaknya");
    U.latar(ctx, t, { col: P.green, gx: 960, gy: 400, ga: 0.25 });
    const p = U.pop(l, tP - 0.3);
    if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; U.panel(ctx, 310, 270, 1300, 190, { stroke: D.hexA(P.green, 0.8) }); txt(ctx, "AI sudah sangat pandai menulis kode", 1020, 386, 62, { align: "center", weight: 900, fit: 1080 }); ctx.restore(); U.centang(ctx, 400, 365, 48, (l - tP) / 0.4); }
    const q = U.pop(l, tD - 0.2);
    if (q.a > 0) { ctx.save(); ctx.globalAlpha *= q.a; ctx.translate(960, 630); const k = lerp(0.85, 1, q.sp); ctx.scale(k, k); U.panel(ctx, -650, -95, 1300, 190, { stroke: D.hexA(P.amber, 0.9), lw: 5 }); txt(ctx, "Apa dampaknya terhadap pekerjaan?", 0, 22, 66, { align: "center", weight: 900, color: P.amber, fit: 1200 }); ctx.restore(); }
    U.bip(ctx, 1700, 880, 170, t, { pose: "diam", mood: "think" });
  };

  U.reg(1, S);
})(typeof window !== "undefined" ? window : globalThis);
