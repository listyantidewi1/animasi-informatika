/* D09 bab 5 — Jangan panik, baca pengumumannya dulu (b5_1 … b5_9): kalimat pengumuman PHP, meter 9,2 vs php.ini bawaan,
   syarat Java4Shell, tiga pertanyaan triase, tebak server lab sekolah, patch terburu-buru, cek fakta PolitiFact, timbangan. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d09, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U, W = 1920, HH = 1080, TAU = U.TAU;
  const S = {};

  S.b5_1 = function (ctx, b, l, t) {
    const tKal = U.at(b, "Celah kritis kali ini"), tUm = U.atEnd(b, "tidak umum.");
    const f = X.windowFrame(ctx, 160, 140, 1600, 760, { title: "php.net · PHP 8.3.37 Released" });
    T(ctx, "PHP 8.3.37 Released!", f.x + 40, f.y + 100, 56, { weight: 800, color: C.php });
    T(ctx, "19 Nov 2026", f.x + 40, f.y + 160, 36, { weight: 600, color: C.dim });
    T(ctx, "The PHP development team announces the immediate", f.x + 40, f.y + 240, 38, { weight: 500, color: C.text2 });
    T(ctx, "availability of PHP 8.3.37. This is a security release.", f.x + 40, f.y + 296, 38, { weight: 500, color: C.text2 });
    const tSat = U.at(b, "satu kalimat penting"), hl = eio(ramp(l, tSat, Math.max(0.8, tUm - tSat)));
    const q1 = "The issues rated CRITICAL require either non-default", q2 = "configuration or uncommon setups.";
    ctx.save(); ctx.font = `700 42px ${X.SANS}`; const w1 = ctx.measureText(q1).width, w2 = ctx.measureText(q2).width; ctx.restore();
    ctx.fillStyle = U.rgba(C.amber, 0.32); ctx.fillRect(f.x + 30, f.y + 352, (w1 + 20) * clamp(hl * 2), 60); ctx.fillRect(f.x + 30, f.y + 414, (w2 + 20) * clamp(hl * 2 - 1), 60);
    T(ctx, q1, f.x + 40, f.y + 396, 42, { weight: 700 }); T(ctx, q2, f.x + 40, f.y + 458, 42, { weight: 700 });
    U.muncul(ctx, l, tUm - 0.3, 960, 790, () => { U.kotak(ctx, 260, 700, 1400, 190, "", { col: C.amber, fill: "rgba(18,17,21,0.97)" });
      T(ctx, "Celah kritis butuh konfigurasi yang bukan bawaan", 960, 780, 46, { align: "center", weight: 800, color: C.amber });
      T(ctx, "atau setup yang tidak umum.", 960, 845, 46, { align: "center", weight: 800, color: C.amber }); });
  };

  S.b5_2 = function (ctx, b, l, t) {
    const tSv = U.at(b, "Server yang memakai"), tBel = U.at(b, "belum tentu");
    X.meterCVSS(ctx, 540, 480, 230, 9.2); T(ctx, "kondisi terburuk", 540, 820, 48, { align: "center", weight: 800, color: C.red });
    U.geser(ctx, l, tSv - 0.3, 300, 0, () => { const f = X.windowFrame(ctx, 980, 200, 800, 560, { tab: "php.ini" });
      ["; pengaturan bawaan", "display_errors = Off", "allow_url_include = Off", "expose_php = Off"].forEach((s, i) => {
        T(ctx, s, f.x + 40, f.y + 90 + i * 90, 38, { mono: true, weight: 600, color: i ? C.text : C.dim });
        if (i) U.centang(ctx, f.x + f.w - 30, f.y + 76 + i * 90, 50, ramp(l, tSv + 0.4 + i * 0.35, 0.4)); }); });
    if (l > tBel) U.pill(ctx, "pengaturan bawaan: belum tentu bisa diserang", 1300, 860, { size: 40, col: C.term });
  };

  S.b5_3 = function (ctx, b, l, t) {
    const tVer = U.at(b, "Java versi"), tPro = U.at(b, "yang berjalan di prosesor");
    U.judul(ctx, "Syarat Java4Shell", l, 0.2, { y: 170, mono: true, col: C.red });
    [["Java 17.0.6 ke atas", tVer], ["prosesor x86-64 dengan AVX-512 VBMI", tPro]].forEach(([s, t0], i) => U.geser(ctx, l, t0 - 0.2, -200, 0, () => {
      const y = 340 + i * 200; U.kotak(ctx, 200, y, 1000, 150, "", { col: C.php }); U.centang(ctx, 280, y + 75, 70, ramp(l, t0 + 0.3, 0.4), C.amber);
      T(ctx, s, 360, y + 92, 46, { weight: 800 }); }));
    U.muncul(ctx, l, tPro + 0.4, 1520, 500, () => { const cx = 1520, cy = 500, s = 300; ctx.save(); ctx.strokeStyle = C.php; ctx.lineWidth = 6; ctx.fillStyle = C.panel; U.rr(ctx, cx - s / 2, cy - s / 2, s, s, 20); ctx.fill(); ctx.stroke();
      for (let i = 0; i < 6; i++) { const d = -s * 0.4 + i * s * 0.16; ctx.beginPath(); ctx.moveTo(cx + d, cy - s / 2); ctx.lineTo(cx + d, cy - s / 2 - 34); ctx.moveTo(cx + d, cy + s / 2); ctx.lineTo(cx + d, cy + s / 2 + 34); ctx.moveTo(cx - s / 2, cy + d); ctx.lineTo(cx - s / 2 - 34, cy + d); ctx.moveTo(cx + s / 2, cy + d); ctx.lineTo(cx + s / 2 + 34, cy + d); ctx.stroke(); }
      ctx.restore(); T(ctx, "AVX-512", cx, cy + 16, 56, { align: "center", mono: true, weight: 800, color: C.php }); T(ctx, "instruksi khusus", cx, cy + 300 - 60, 40, { align: "center", weight: 700, color: C.text2 }); });
  };

  const TRI = [["Versi?", "tag"], ["Terbuka ke internet?", "globe"], ["Data penting?", "gembok"]];
  function triase(ctx, l, ts, hasil) {
    TRI.forEach(([s, ik], i) => { const a = ts ? ramp(l, ts[i] - 0.2, 0.3) : 1; if (a <= 0) return; const x = 170 + i * 540, y = 300, h = hasil ? hasil[i] : null;
      const col = h ? h[1] : C.php; ctx.save(); ctx.globalAlpha *= a; U.kotak(ctx, x, y, 480, 420, "", { col, lw: h ? 5 : 3 });
      if (ik === "tag") U.tagVersi(ctx, x + 240, y + 120, 130, col); if (ik === "globe") U.globe(ctx, x + 240, y + 120, 130, col); if (ik === "gembok") U.gembok(ctx, x + 240, y + 130, 130, 0, col);
      T(ctx, s, x + 240, y + 280, 44, { align: "center", weight: 800 });
      if (h) T(ctx, h[0], x + 240, y + 365, 44, { align: "center", weight: 900, color: col });
      ctx.restore(); });
  }
  S.b5_4 = function (ctx, b, l, t) {
    U.judul(ctx, "Sebelum panik, tanyakan tiga hal", l, 0.2, { y: 170 });
    triase(ctx, l, [U.at(b, "Pertama"), U.at(b, "Kedua"), U.at(b, "Ketiga")]);
  };

  function serverLab(ctx, x, y) {
    const f = X.windowFrame(ctx, x, y, 900, 560, { title: "Server Lokal · lab sekolah" });
    [["Apache", "jalan"], ["MySQL", "jalan"]].forEach(([s, st], i) => { const yy = f.y + 90 + i * 100; T(ctx, s, f.x + 30, yy, 44, { weight: 800 }); ctx.fillStyle = C.term; ctx.beginPath(); ctx.arc(f.x + 520, yy - 14, 12, 0, TAU); ctx.fill(); T(ctx, st, f.x + 550, yy, 40, { weight: 700, color: C.term }); });
    T(ctx, "PHP 8.3 · pengaturan bawaan", f.x + 30, f.y + 300, 40, { weight: 700, color: C.php });
    T(ctx, "jaringan: LAN sekolah", f.x + 30, f.y + 380, 40, { weight: 700, color: C.text2 });
  }
  S.b5_5 = function (ctx, b, l, t) {
    U.geser(ctx, l, 0.2, -300, 0, () => serverLab(ctx, 160, 160));
    U.muncul(ctx, l, U.at(b, "jaringan sekolah"), 1450, 440, () => { ctx.save(); ctx.strokeStyle = C.php; ctx.lineWidth = 4; ctx.setLineDash([12, 10]); U.rr(ctx, 1140, 200, 620, 500, 30); ctx.stroke(); ctx.restore();
      [[1300, 330], [1600, 330], [1300, 560], [1600, 560]].forEach(([x, y]) => U.laptop(ctx, x, y, 150, C.text2)); T(ctx, "LAN sekolah", 1450, 760, 44, { align: "center", weight: 800, color: C.php }); });
    U.tebak(ctx, l, U.at(b, "Apakah gurumu"), t);
  };
  S.b5_6 = function (ctx, b, l, t) {
    const tPer = U.at(b, "tetapi PHP tetap"), tRis = U.at(b, "Risikonya");
    U.judul(ctx, "Server lab sekolah", l, 0, { y: 170 });
    triase(ctx, l, null, [["terkena", C.amber], ["tidak", C.term], ["nilai siswa", C.amber]].map((h, i) => l > 0.4 + i * 0.5 ? h : null));
    U.muncul(ctx, l, tPer, 960, 790, () => U.pill(ctx, "Perbarui dalam beberapa hari", 960, 790, { size: 52, col: C.amber }));
    if (l > tRis) U.pill(ctx, "risiko kecil, tapi tidak nol", 960, 885, { size: 40, col: C.text2 });
  };

  S.b5_7 = function (ctx, b, l, t) {
    const tTer = U.at(b, "Menambal terburu-buru"), tBer = U.at(b, "berhenti bekerja");
    const f = X.windowFrame(ctx, 360, 180, 1200, 640, { title: "localhost/aplikasi-sekolah" });
    const p = clamp((l - tTer) / 1.2);
    if (l < tBer - 0.6) { T(ctx, "Memasang pembaruan ...", 960, 440, 52, { align: "center", weight: 800 });
      ctx.fillStyle = C.win; U.rr(ctx, 560, 500, 800, 44, 22); ctx.fill(); ctx.fillStyle = C.amber; U.rr(ctx, 560, 500, 800 * p, 44, 22); ctx.fill();
      if (p > 0) T(ctx, "belum dites!", 960, 640, 44, { align: "center", weight: 800, color: C.amber }); }
    else U.muncul(ctx, l, tBer - 0.6, 960, 500, () => { T(ctx, "500", 960, 500, 180, { align: "center", weight: 900, color: C.red, glow: C.red, blur: 24 }); T(ctx, "Internal Server Error", 960, 600, 56, { align: "center", weight: 700, color: C.text2 }); });
  };

  function ikonLayanan(ctx, k, x, y, on) {
    const col = on ? C.text2 : U.rgba(C.text2, 0.25); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.lineJoin = "round";
    if (k === 0) { ctx.strokeRect(x - 70, y - 50, 140, 100); ctx.beginPath(); ctx.moveTo(x - 70, y - 50); ctx.lineTo(x, y + 10); ctx.lineTo(x + 70, y - 50); ctx.stroke(); }
    if (k === 1) { ctx.beginPath(); ctx.arc(x - 30, y + 10, 40, Math.PI * 0.5, Math.PI * 1.5); ctx.arc(x + 10, y - 20, 50, Math.PI, 0); ctx.arc(x + 50, y + 15, 35, Math.PI * 1.5, Math.PI * 0.5); ctx.closePath(); ctx.stroke(); }
    if (k === 2) { ctx.beginPath(); ctx.moveTo(x - 80, y - 30); ctx.lineTo(x, y - 75); ctx.lineTo(x + 80, y - 30); ctx.closePath(); ctx.stroke(); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 54 + i * 36, y - 20); ctx.lineTo(x - 54 + i * 36, y + 40); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(x - 80, y + 55); ctx.lineTo(x + 80, y + 55); ctx.stroke(); }
    ctx.restore(); if (!on) { ctx.save(); ctx.globalAlpha *= 0.8; U.silang(ctx, x + 70, y - 60, 40, 1, C.red); ctx.restore(); }
  }
  S.b5_8 = function (ctx, b, l, t) {
    const tGang = U.at(b, "mengalami gangguan"), tDug = U.at(b, "sebagian orang menduga"), tPol = U.at(b, "Namun menurut");
    ["surel", "awan", "bank"].forEach((s, i) => { const x = 560 + i * 400, on = l < tGang + i * 0.6; ikonLayanan(ctx, i, x, 300, on); T(ctx, s, x, 420, 40, { align: "center", weight: 700, color: on ? C.text2 : C.dim }); });
    T(ctx, "12–17 Nov 2026", 960, 170, 48, { align: "center", weight: 800, color: C.amber });
    U.muncul(ctx, l, tDug, 960, 640, () => { U.kotak(ctx, 460, 540, 1000, 200, "Dugaan: patch terburu-buru?", { col: C.text2, size: 52 }); });
    U.muncul(ctx, l, tPol + 0.6, 1300, 760, () => X.cap(ctx, "BELUM TERBUKTI", 1300, 810, -0.08, C.amber, 50), { k0: 1.6 });
    U.sumber(ctx, "Sumber: PolitiFact, 19 Nov 2026");
  };

  S.b5_9 = function (ctx, b, l, t) {
    const tSek = U.at(b, "cepat dan hati-hati sekaligus"), tilt = l < tSek ? Math.sin(l * 2.2) * 0.12 : 0.12 * Math.sin(l * 2.2) * Math.max(0, 1 - (l - tSek) * 1.5);
    const cx = 960, cy = 360; ctx.save(); ctx.strokeStyle = C.text2; ctx.lineWidth = 8; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx, cy - 40); ctx.lineTo(cx, cy + 380); ctx.moveTo(cx - 160, cy + 380); ctx.lineTo(cx + 160, cy + 380); ctx.stroke();
    ctx.translate(cx, cy); ctx.rotate(tilt); ctx.beginPath(); ctx.moveTo(-460, 0); ctx.lineTo(460, 0); ctx.stroke();
    [[-460, "cepat", C.amber], [460, "hati-hati", C.term]].forEach(([x, s, col]) => { ctx.save(); ctx.translate(x, 0); ctx.rotate(-tilt); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-110, 160); ctx.moveTo(0, 0); ctx.lineTo(110, 160); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-150, 160); ctx.quadraticCurveTo(0, 240, 150, 160); ctx.stroke(); T(ctx, s, 0, 300, 56, { align: "center", weight: 900, color: col }); ctx.restore(); });
    ctx.restore(); X.glow(ctx, cx, cy, 30, C.php, 1);
    if (l > tSek) U.pill(ctx, "cepat DAN hati-hati", 960, 860, { size: 52, col: C.php });
  };

  U.reg(5, S);
})(typeof window !== "undefined" ? window : globalThis);
