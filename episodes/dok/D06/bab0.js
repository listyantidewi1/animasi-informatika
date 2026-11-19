/* D06 bab 0 — Pembuka (b0_1 … b0_4). Tanpa salam/logo: bukti dulu.
   b0_1 grafik skor ujian coding 60% → hampir 100% (Stanford AI Index 2026); b0_2 daftar pekerjaan tumbuh tercepat (WEF 2025), software developer nomor 4;
   b0_3 banyak garis datar, satu garis merah turun: "kelompok itu mungkin kamu"; b0_4 judul + lima lembaga riset. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d06, P = D.P;
  const { clamp, lerp, eio, eout, spring } = D;
  const { ramp, txt, RR } = U;
  const S = {};

  // grafik skor (dipakai lagi di bab 1)
  U.grafikSkor = function (ctx, l, tNaik, o = {}) {
    const x = o.x || 330, y = o.y || 250, w = o.w || 1000, h = o.h || 420, v0 = 0.60, v1 = 0.97;
    U.panel(ctx, x - 150, y - 70, w + 250, h + 180);
    U.sumbu(ctx, x, y, w, h, [[0, "0%"], [0.25, ""], [0.5, "50%"], [0.75, ""], [1, "100%"]]);
    txt(ctx, "setahun sebelumnya", x + 60, y + h + 64, 40, { weight: 700, color: P.ink2 });
    txt(ctx, "sekarang", x + w - 60, y + h + 64, 40, { weight: 700, color: P.ink2, align: "right" });
    const k = eio(clamp((l - tNaik) / (o.d || 2.6)));
    const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24, e = u * u * (3 - 2 * u); pts.push([x + 90 + u * (w - 180), y + h - lerp(v0, v1, Math.pow(e, 0.8)) * h]); }
    const a0 = ramp(l, o.t0 == null ? 0.2 : o.t0, 0.4);
    if (a0 > 0) { ctx.save(); ctx.globalAlpha *= a0; U.titik(ctx, pts[0][0], pts[0][1], 16, P.blue); ctx.restore(); }
    const e = U.garis(ctx, pts, k, P.amber, 12); if (k > 0) U.titik(ctx, e[0], e[1], 18, P.amber);
    return { p0: pts[0], e, k, v: lerp(60, 97, k) };
  };

  S.b0_1 = function (ctx, b, l, t) {
    const tSkor = D.at(b, "skor AI"), t60 = D.at(b, "enam puluh persen"), t100 = D.at(b, "hampir seratus"), tUjian = D.at(b, "Ujian itu");
    U.latar(ctx, t, { col: P.amber, gx: 1300, gy: 300 });
    const G = U.grafikSkor(ctx, l, t100 - 1.2, { t0: t60 - 0.2 });
    D.post(c => {
      U.tagPop(c, "60%", G.p0[0] - 10, G.p0[1] - 80, l, t60, { col: P.blue, size: 56 });
      if (G.k > 0.98) U.tagPop(c, "hampir 100%", G.e[0] - 120, G.e[1] + 96, l, t100 + 1.4, { col: P.amber, size: 60 });
      U.judulPop(c, "Skor AI di ujian coding", 760, 108, 64, l, tSkor - 0.3, { col: P.teal });
      U.tagPop(c, "soal = masalah nyata dari proyek software nyata", 800, 600, l, tUjian + 0.3, { col: P.teal, size: 44 });
      U.sumber(c, l, t60, "Stanford AI Index 2026 (SWE-bench Verified)");
    });
    // jendela kode kecil di kanan: bug -> tes hijau
    const a = ramp(l, tUjian - 0.2, 0.5); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - eout(a)) * 40);
      U.jendela(ctx, 1380, 250, 440, 400, "perbaikan"); U.kode(ctx, 1410, 342, 380, 5, 11, clamp((l - tUjian) / 2.2));
      U.centang(ctx, 1600, 590, 34, (l - tUjian - 2.2) / 0.5); ctx.restore(); }
    else U.bip(ctx, 1640, 800, 190, t, { pose: "kaget", mood: "wow", k: l - t100 });
  };

  const JOBS = ["Big Data Specialists", "FinTech Engineers", "AI and Machine Learning Specialists", "Software and Applications Developers"];
  U.daftarTumbuh = function (ctx, l, t0, tHi, o = {}) {
    const x = o.x || 300, y = o.y || 230, w = o.w || 1320, rh = 100;
    JOBS.forEach((s, i) => { const k = eout(ramp(l, t0 + i * 0.35, 0.5)); if (k <= 0) return; const hi = i === 3 ? eio(ramp(l, tHi, 0.5)) : 0;
      ctx.save(); ctx.globalAlpha *= k; ctx.translate((1 - k) * -80, 0); const yy = y + i * (rh + 14);
      ctx.fillStyle = hi > 0 ? D.hexA(P.amber, 0.14 + 0.1 * hi) : "rgba(14,22,60,0.92)"; RR(ctx, x, yy, w, rh, 26); ctx.fill();
      ctx.strokeStyle = hi > 0 ? D.hexA(P.amber, 0.4 + 0.6 * hi) : "rgba(242,246,255,0.16)"; ctx.lineWidth = hi > 0 ? 6 : 3; ctx.stroke();
      ctx.fillStyle = hi > 0 ? P.amber : P.blue; ctx.beginPath(); ctx.arc(x + 70, yy + rh / 2, 38, 0, U.TAU); ctx.fill();
      txt(ctx, String(i + 1), x + 70, yy + rh / 2 + 18, 50, { align: "center", weight: 900, color: "#10142E" });
      txt(ctx, s, x + 140, yy + rh / 2 + 18, 50, { weight: 800, color: hi > 0.5 ? P.amber : P.ink, fit: w - 330 });
      U.panah(ctx, x + w - 110, yy + rh - 30, x + w - 50, yy + 34, hi > 0 ? P.amber : P.green, k, 7);
      ctx.restore(); });
  };
  S.b0_2 = function (ctx, b, l, t) {
    const tSurvei = D.at(b, "survei"), tDev = D.at(b, "software developer"), t4 = D.at(b, "empat besar");
    U.latar(ctx, t, { col: P.green, gx: 400, gy: 300 });
    U.daftarTumbuh(ctx, l, tSurvei - 0.4, tDev);
    D.post(c => {
      U.judulPop(c, "Pekerjaan yang tumbuh paling cepat, 2025–2030", 960, 120, 60, l, tSurvei - 0.6, { col: P.green });
      U.tagPop(c, "empat besar", 1480, 742, l, t4, { col: P.amber, size: 56 });
      U.sumber(c, l, tSurvei, "WEF Future of Jobs Report 2025 (1.000+ perusahaan)");
    });
  };

  S.b0_3 = function (ctx, b, l, t) {
    const tKalah = D.at(b, "siapa yang"), tSatu = D.at(b, "satu kelompok"), tKamu = D.at(b, "mungkin kamu");
    U.latar(ctx, t, { col: P.red, gx: 1400, gy: 700, ga: 0.2 });
    const x = 260, y = 260, w = 1400, h = 500; U.panel(ctx, x - 60, y - 60, w + 120, h + 120);
    const r = D.rng(5); const k = eio(ramp(l, 0.3, 2.2));
    for (let i = 0; i < 6; i++) { const yy = y + 90 + i * 34, pts = []; for (let j = 0; j <= 20; j++) pts.push([x + 40 + j * (w - 300) / 20, yy - j * (1.5 + i * 0.8) + Math.sin(j * 0.9 + i) * 8 * r()]);
      U.garis(ctx, pts, k, D.hexA(P.ink2, 0.55), 6, { glow: false }); }
    const kr = eio(ramp(l, tSatu - 0.3, 2.0)); const pr = []; for (let j = 0; j <= 20; j++) { const u = j / 20; pr.push([x + 40 + j * (w - 300) / 20, y + 160 + (u < 0.45 ? -u * 20 : -9 + Math.pow((u - 0.45) / 0.55, 1.4) * 250)]); }
    const e = U.garis(ctx, pr, kr, P.red, 12); if (kr > 0) U.titik(ctx, e[0], e[1], 16, P.red);
    if (kr > 0.3) U.orang(ctx, e[0] + 70, e[1] + 60, 130, P.red, ramp(l, tSatu + 0.4, 0.4), { laptop: true });
    D.post(c => {
      U.judulPop(c, "Lalu, siapa yang kalah?", 960, 150, 76, l, tKalah - 0.2, { col: P.red });
      U.tagPop(c, "satu kelompok mulai tertinggal", 700, 600, l, tSatu, { col: P.red, size: 52 });
      U.tagPop(c, "mungkin kamu", Math.min(1560, e[0] + 70), Math.min(840, e[1] + 120), l, tKamu, { col: P.amber, size: 60 });
    });
  };

  const LEMBAGA = [["World Economic Forum", P.green], ["ILO", P.blue], ["Stanford", P.red], ["METR", P.violet], ["Stack Overflow", P.amber]];
  S.b0_4 = function (ctx, b, l, t) {
    const tLima = D.at(b, "lima lembaga"), tApa = D.at(b, "apa yang harus");
    U.latar(ctx, t, { col: P.violet, gx: 960, gy: 420, ga: 0.35 });
    const a = eout(ramp(l, 0.2, 0.7));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - a) * 30);
    txt(ctx, "Apa yang Akan Terjadi pada", 960, 300, 92, { align: "center", weight: 900 });
    txt(ctx, "Software Engineer di Masa Depan?", 960, 420, 104, { align: "center", weight: 900, color: P.amber, fit: 1700 });
    ctx.fillStyle = P.amber; ctx.fillRect(960 - 110 * a, 462, 220 * a, 8); ctx.restore();
    D.post(c => {
      c.font = `800 46px ${K.FONT}`; const ws = LEMBAGA.map(([s]) => c.measureText(s).width + 46 * 1.2), tot = ws.reduce((x, y) => x + y, 0) + 4 * 30; let x = 960 - tot / 2;
      LEMBAGA.forEach(([s, col], i) => { U.tagPop(c, s, x + ws[i] / 2, 620, l, tLima + i * 0.22, { col, size: 46 }); x += ws[i] + 30; });
      U.tagPop(c, "lalu: apa yang harus kamu lakukan", 960, 760, l, tApa, { col: P.teal, size: 52 });
    });
    U.bip(ctx, 1700, 860, 170, t, { pose: "tunjuk", mood: "happy" });
  };

  U.reg(0, S);
})(typeof window !== "undefined" ? window : globalThis);
