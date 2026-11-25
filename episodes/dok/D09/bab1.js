/* D09 bab 1 — Satu bulan, dua kali bocor (b1_1 … b1_7): garis waktu Okt–Nov 2026, rilis PHP 21 Okt dan 19 Nov, CISA 17 Nov,
   laporan GTIG 16 Nov, batang Qualys 68 vs >1.000, lalu batang retak menjadi grid memori. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d09, X = U.X, C = U.C;
  const { clamp, lerp, eio, eout } = D, { ramp, T } = U, W = 1920, HH = 1080;
  const S = {};
  const X0 = 160, X1 = 1760, Y = 250, HARI = 56;   // 1 Okt .. 26 Nov
  const xh = d => lerp(X0, X1, d / HARI);
  // [hari sejak 1 Okt, label, x label, warna]
  const TGL = [[20, "21 Okt", 560, C.php], [45, "16 Nov", 1130, C.red], [46, "17 Nov", 1420, C.amber], [48, "19 Nov", 1710, C.red]];
  function garis(ctx, l, t, tampil, aktif, a = 1) {
    ctx.save(); ctx.globalAlpha *= a;
    U.garisWaktu(ctx, X0, X1, Y, 1);
    T(ctx, "Oktober 2026", xh(0), Y + 70, 36, { weight: 700, color: C.text2 }); T(ctx, "November 2026", xh(31), Y + 70, 36, { weight: 700, color: C.text2 });
    ctx.fillStyle = C.line; ctx.fillRect(xh(31) - 2, Y - 24, 4, 48);
    tampil.forEach(i => { const [d, s, lx, col] = TGL[i], on = i === aktif;
      ctx.save(); ctx.globalAlpha *= on ? 1 : 0.55; ctx.strokeStyle = U.rgba(col, 0.7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xh(d), Y); ctx.lineTo(lx, Y - 70); ctx.stroke();
      U.titik(ctx, xh(d), Y, col, on ? 14 : 10, on ? 1 : 0); U.pill(ctx, s, lx, Y - 100, { size: 40, col }); ctx.restore(); });
    ctx.restore();
  }
  const muncul = (l, t0) => ramp(l, t0, 0.5);

  S.b1_1 = function (ctx, b, l, t) {
    const u = eio(ramp(l, 0.3, 1.6)); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, lerp(X0, X1 + 80, u), HH); ctx.clip(); garis(ctx, l, t, [], -1); ctx.restore();
    U.status(ctx);
    U.muncul(ctx, l, U.at(b, "supaya urutannya"), 960, 620, () => { [0, 1, 2, 3].forEach(i => { const x = 420 + i * 360; U.kotak(ctx, x - 130, 540, 260, 160, "?", { col: TGL[i][3], size: 90, color: TGL[i][3] }); }); });
  };

  S.b1_2 = function (ctx, b, l, t) {
    garis(ctx, l, t, [0], 0); U.status(ctx); U.sumber(ctx, "Sumber: php.net");
    U.geser(ctx, l, 0.3, 0, 200, () => X.kartuCVE(ctx, 120, 430, { w: 900, h: 330, tag: "RILIS KEAMANAN PHP · 21 OKT", id: "CVE-2026-109618", title: "CVE-2026-109619 · tanpa login", cvss: 9.2, col: C.php, date: "2 celah · eksekusi perintah" }));
    const tMod = U.at(b, "Tim PHP sendiri"), tM = U.at(b, "mod_php");
    const a = U.muncul(ctx, l, tMod - 0.2, 1450, 600, () => {
      U.kotak(ctx, 1120, 440, 240, 110, "Browser", { col: C.text2, size: 40 });
      U.panah(ctx, 1240, 556, 1240, 618, C.text2, 1, { lw: 5 });
      U.kotak(ctx, 1120, 630, 640, 200, "", { col: C.php });
      T(ctx, "Apache", 1250, 750, 48, { align: "center", weight: 800 });
      const blink = l > tM ? 0.5 + 0.5 * Math.sin((l - tM) * 9) : 0;
      U.kotak(ctx, 1400, 670, 320, 120, "mod_php", { col: l > tM ? C.red : C.php, mono: true, size: 46, color: l > tM ? C.red : C.php, glow: blink * 0.6 });
    });
    if (a && l > tM) U.pill(ctx, "risiko paling tinggi", 1440, 890, { size: 40, col: C.red });
  };

  S.b1_3 = function (ctx, b, l, t) {
    garis(ctx, l, t, [0, 3], 3); U.status(ctx); U.sumber(ctx, "Sumber: php.net, The Hacker News");
    const tDel = U.at(b, "delapan celah"), tTuj = U.at(b, "tujuh di antaranya");
    for (let i = 0; i < 8; i++) { const u = ramp(l, tDel - 0.3 + i * 0.12, 0.45); if (u <= 0) continue;
      const a = (i - 3.5) * 0.09, cx = 960 + (i - 3.5) * 205, cy = 640 + Math.abs(i - 3.5) * 14;
      ctx.save(); ctx.globalAlpha *= clamp(u * 1.5); ctx.translate(cx, cy + (1 - eout(u)) * 200); ctx.rotate(a);
      ctx.fillStyle = C.panel; U.rr(ctx, -95, -130, 190, 260, 16); ctx.fill(); ctx.strokeStyle = U.rgba(C.red, 0.7); ctx.lineWidth = 2; U.rr(ctx, -95, -130, 190, 260, 16); ctx.stroke();
      ctx.fillStyle = C.red; ctx.fillRect(-95, -130, 190, 10);
      const v = i === 5 ? 8.8 : 9.2, k = eio(ramp(l, tTuj - 0.2 + i * 0.05, 0.8)); X.meterCVSS(ctx, 0, 10, 62, +(v * k).toFixed(1));
      T(ctx, "CVE", 0, -72, 30, { align: "center", weight: 800, color: C.text2, spacing: 3 }); ctx.restore(); }
    U.muncul(ctx, l, U.at(b, "Kali ini") , 960, 905, () => T(ctx, "8.2.36 · 8.3.37 · 8.4.28 · 8.5.13", 960, 905, 46, { align: "center", mono: true, weight: 700, color: C.term }));
    if (l > tTuj + 0.8) U.pill(ctx, "7 dari 8 skor 9,2", 960, 430, { size: 44, col: C.red });
  };

  S.b1_4 = function (ctx, b, l, t) {
    garis(ctx, l, t, [0, 2, 3], 2); U.status(ctx);
    U.geser(ctx, l, U.at(b, "Pada tujuh belas") - 0.2, 0, 200, () => X.kartuCVE(ctx, 380, 440, { w: 1160, h: 330, tag: "PERINGATAN CISA (AMERIKA SERIKAT)", id: "Java4Shell", title: "celah di Java · CVE-2026-114938", col: C.amber, date: "17 November 2026" }));
    U.muncul(ctx, l, U.at(b, "segera menambal"), 1330, 640, () => X.cap(ctx, "SEGERA TAMBAL", 1300, 700, -0.08, C.amber, 50), { k0: 1.6 });
  };

  S.b1_5 = function (ctx, b, l, t) {
    garis(ctx, l, t, [0, 1, 2, 3], 1); U.status(ctx);
    U.geser(ctx, l, 0.2, 0, 200, () => X.kartuCVE(ctx, 380, 440, { w: 1160, h: 330, tag: "LAPORAN GOOGLE THREAT INTELLIGENCE", id: "AI Threat Tracker", title: "16 November 2026", col: C.red }));
    U.muncul(ctx, l, U.at(b, "exploit_agent"), 960, 700, () => T(ctx, "sistem AI penyerang:  exploit_agent", 960, 700, 54, { align: "center", mono: true, weight: 700, color: C.red, glow: C.red, blur: 18 }));
  };

  function batang(ctx, l, t0, t1, u2) {
    const base = 860, H1 = 520; U.garisWaktu(ctx, 520, 1400, base, 1);
    const h0 = 68 / 1100 * H1 * eio(ramp(l, t0, 0.8)), h1 = H1 * eio(ramp(l, t1, 1.4));
    ctx.fillStyle = C.php2; ctx.fillRect(640, base - h0, 220, h0); ctx.fillStyle = C.red; ctx.fillRect(1060, base - h1, 220, h1);
    T(ctx, "Nov 2025", 750, base + 60, 40, { align: "center", weight: 700, color: C.text2 }); T(ctx, "Nov 2026", 1170, base + 60, 40, { align: "center", weight: 700, color: C.text2 });
    if (h0 > 2) T(ctx, "68", 750, base - h0 - 24, 56, { align: "center", weight: 900, color: C.php });
    if (h1 > 40) T(ctx, "lebih dari 1.000", 1170, base - h1 - 26, 52, { align: "center", weight: 900, color: C.red });
  }
  S.b1_6 = function (ctx, b, l, t) {
    const sh = ramp(l, 0, 0.8); garis(ctx, l, t, [0, 1, 2, 3], -1, 1 - sh);
    U.judul(ctx, "Celah yang ditambal Microsoft dalam sebulan", l, 0.6, { y: 170, size: 52 });
    batang(ctx, l, U.at(b, "enam puluh delapan") - 0.4, U.at(b, "lebih dari seribu") - 0.3);
    T(ctx, "hitungan Qualys untuk Patch Tuesday Microsoft", 1824, 64, 28, { align: "right", weight: 600, color: C.text2 });
  };
  S.b1_7 = function (ctx, b, l, t) {
    const tPaham = U.at(b, "Untuk menjawabnya"), u = ramp(l, tPaham, 1.0);
    ctx.save(); ctx.globalAlpha *= 1 - u; U.judul(ctx, "Celah yang ditambal Microsoft dalam sebulan", l, -1, { y: 170, size: 52 }); batang(ctx, l, -9, -9);
    U.muncul(ctx, l, 0.4, 1500, 420, () => T(ctx, "?", 1500, 470, 220, { align: "center", weight: 900, color: C.amber, glow: C.amber, blur: 30 })); ctx.restore();
    if (u > 0) { ctx.save(); ctx.globalAlpha *= u; const st = Array(12).fill("kosong"); st[2] = "php"; st[9] = "php"; X.loker(ctx, 390, 340, 6, 2, { state: st }); ctx.restore(); }
  };

  U.reg(1, S);
})(typeof window !== "undefined" ? window : globalThis);
