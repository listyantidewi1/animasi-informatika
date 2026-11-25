/* D10 bab 7 — BONUS STAGE B: Siapa para modder? (bb_1 … bb_6). Tiga tingkat modding, tiga cerita (gugatan 2021–2023,
   FiveM 2015 → 2023, perbaikan loading −70%), dua sisi garis. Orang sungguhan tidak digambar, tanpa logo. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920;

  S.bb_1 = function (ctx, b, l, t) {
    U.ruang(ctx, t, { col: N.cyan, gx: 400, gy: 460 });
    const p = U.pop(l, 0.3); ctx.save(); ctx.globalAlpha *= p.a; I.orang(ctx, 400, 500, 400 * lerp(0.85, 1, p.sp), N.cyan); I.gir(ctx, 560, 380, 150, N.gold, t); ctx.restore();
    X.daftar(ctx, b, l, 760, 290, 1030, [{ ph: "mengubah sebuah game", s: "Mengubah game dengan caranya sendiri", col: N.cyan }, { ph: "di luar pembaruan", s: "Di luar pembaruan resmi pembuatnya", col: N.violet }, { ph: "tidak dibayar", s: "Sebagian besar tidak dibayar", col: N.pink }, { ph: "rasa penasaran", s: "Didorong oleh rasa penasaran", col: N.gold }], { rh: 112, size: 44 });
    X.judul(ctx, "Siapa sebenarnya para modder?", l, 0.2, N.cyan);
  };
  S.bb_2 = function (ctx, b, l, t) {
    const tRE = D.at(b, "reverse engineering"), tArti = D.at(b, "yaitu memahami");
    U.ruang(ctx, t, { col: N.violet, gx: 960, gy: 420 });
    X.deret(ctx, b, l, t, [{ ph: "tingkat pertama", judul: "Mengganti isi", sub: "mobil, pakaian, atau peta", ikon: I.peti, col: N.cyan }, { ph: "tingkat kedua", judul: "Menulis skrip", sub: "menambahkan fitur baru", ikon: I.resep, col: N.gold }, { ph: "tingkat ketiga", judul: "Membongkar program", sub: "memahami cara kerjanya", ikon: I.lup, col: N.pink }], { y: 262, h: 470, gap: 44, nomor: true, redup: true, js: 48 });
    X.judul(ctx, "Kegiatan modder bertingkat", l, 0.2, N.violet);
    X.bawah(ctx, "Reverse engineering", l, tRE - 0.2, N.pink, { size: 56, a: 1 - ramp(l, tArti - 0.2, 0.3) });
    X.bawah(ctx, "Memahami sebuah program hanya dari hasil jadinya", l, tArti, N.pink);
  };
  S.bb_3 = function (ctx, b, l, t) {
    const t1 = D.at(b, "dua ribu dua puluh satu"), t2 = D.at(b, "menggugat"), t3 = D.at(b, "dua ribu dua puluh tiga");
    U.ruang(ctx, t, { col: N.red, gx: 960, gy: 420 });
    X.garisWaktu(ctx, l, 440, 220, 1700, [{ x: 400, lab: "2021", sub: "penggemar menyusun ulang kode GTA 3 dan Vice City", col: N.cyan, t0: t1 - 0.2, fit: 460 }, { x: 960, lab: "2021", sub: "Take-Two menggugat mereka ke pengadilan", col: N.red, t0: t2 - 0.3, fit: 460 }, { x: 1520, lab: "2023", sub: "perkara berakhir, isi kesepakatan tidak diumumkan", col: N.gold, t0: t3 - 0.2, fit: 460 }]);
    const p = U.pop(l, t2 - 0.1); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; I.palu(ctx, 960, 760, 130, N.red); ctx.restore(); }
    X.judul(ctx, "Hubungan modder dengan penerbit GTA selalu naik turun", l, 0.2, N.red);
  };
  S.bb_4 = function (ctx, b, l, t) {
    const t1 = D.at(b, "dua ribu lima belas"), t2 = D.at(b, "Delapan tahun kemudian"), t3 = D.at(b, "mengakuisisi");
    U.ruang(ctx, t, { col: N.green, gx: 1400, gy: 420 });
    X.garisWaktu(ctx, l, 440, 300, 1620, [{ x: 440, lab: "2015", sub: "Rockstar memblokir akun para pembuat FiveM", col: N.red, t0: t1 - 0.2, fit: 520 }, { x: 1480, lab: "2023", sub: "Rockstar mengakuisisi tim pembuatnya", col: N.green, t0: t3 - 0.6, fit: 520 }]);
    const k = eio(ramp(l, t2, Math.max(0.8, t3 - t2))); if (k > 0) { ctx.save(); ctx.strokeStyle = N.gold; ctx.lineWidth = 8; ctx.shadowColor = N.gold; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(440, 440); ctx.lineTo(lerp(440, 1480, k), 440); ctx.stroke(); ctx.restore(); txt(ctx, "8 tahun", 960, 410, 50, { align: "center", weight: 900, color: N.gold }); }
    const p = U.pop(l, t3); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; I.jabat(ctx, 960, 720, 190, N.green); ctx.restore(); }
    X.judul(ctx, "Ada juga cerita yang arahnya terbalik", l, 0.2, N.green);
    X.bawah(ctx, "FiveM adalah mod multiplayer untuk GTA 5", l, D.at(b, "sebuah mod") - 0.2, N.ink2, { size: 44, a: 1 - ramp(l, t3 - 0.3, 0.3) });
  };
  S.bb_5 = function (ctx, b, l, t) {
    const tLama = D.at(b, "begitu lama"), tBong = D.at(b, "membongkar"), tPang = D.at(b, "memangkas"), t70 = D.at(b, "tujuh puluh persen"), tMas = D.at(b, "memasukkan"), tHad = D.at(b, "sepuluh ribu dolar");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 420 });
    const bar = (y, lab, w, col, a, fill) => { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha *= a; txt(ctx, lab, 180, y + 52, 46, { weight: 800, color: N.ink2 }); ctx.fillStyle = "rgba(16,8,38,0.9)"; RR(ctx, 440, y, 1200, 76, 20); ctx.fill(); ctx.strokeStyle = D.hexA(col, 0.6); ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 16; RR(ctx, 440, y, Math.max(40, w * fill), 76, 20); ctx.fill(); ctx.restore(); };
    bar(290, "sebelum", 1200, N.red, ramp(l, tLama - 0.6, 0.4), eio(ramp(l, tLama - 0.6, 2.5)));
    bar(410, "sesudah", 360, N.green, ramp(l, tPang - 0.2, 0.4), eio(ramp(l, tPang - 0.2, 1.0)));
    const a7 = ramp(l, t70 - 0.3, 0.4); if (a7 > 0) { ctx.save(); ctx.globalAlpha *= a7; txt(ctx, "waktu loading turun sekitar 70%", 840, 464, 50, { weight: 900, color: N.green, fit: 800 }); ctx.restore(); }
    X.daftar(ctx, b, l, 360, 560, 1200, [{ t0: tMas - 0.2, s: "Rockstar memasukkan perbaikannya ke dalam game", col: N.cyan }], { rh: 104 });
    const ph = U.pop(l, tHad - 0.3); if (ph.a > 0) U.neon(ctx, "HADIAH US$10.000", W / 2, 790, 84, N.gold, { align: "center", a: ph.a });
    X.judul(ctx, "Layar loading GTA Online yang terlalu lama", l, 0.2, N.gold, { a: 1 - ramp(l, tBong - 0.3, 0.3) });
    X.judul(ctx, "Seorang programmer membongkar programnya", l, tBong, N.gold);
  };
  S.bb_6 = function (ctx, b, l, t) {
    const tA = D.at(b, "Modder yang memperbaiki"), tA2 = D.at(b, "sering dibiarkan"), tB = D.at(b, "Modder yang menyalin"), tB2 = D.at(b, "berhadapan dengan pengacara"), tP = D.at(b, "Proyek port");
    U.ruang(ctx, t, { col: N.violet, gx: 960, gy: 420 });
    const rs = X.cols(2, { y: 262, h: 500, gap: 80 }), p1 = U.pop(l, tA - 0.2), p2 = U.pop(l, tB - 0.2);
    X.kartu(ctx, rs[0], { col: N.green, ikon: I.jabat, ih: 150, judul: l > tA2 - 0.2 ? "Dibiarkan, bahkan dirangkul" : "", sub: "memperbaiki atau memperkaya game yang sudah dibeli pemain", a: p1.a, sp: p1.sp, js: 50, redup: l > tP - 0.2 });
    X.kartu(ctx, rs[1], { col: N.red, ikon: I.palu, ih: 150, judul: l > tB2 - 0.2 ? "Berhadapan dengan pengacara" : "", sub: "menyalin kode inti, atau membuat game bisa dimainkan tanpa membeli", a: p2.a, sp: p2.sp, js: 50 });
    X.judul(ctx, "Dari tiga cerita itu, garisnya cukup jelas", l, 0.2, N.violet);
    X.bawah(ctx, "Proyek port GTA 6 berdiri di sisi ini", l, tP, N.red, { x: rs[1].cx, fit: 800 });
  };
  X.reg(7, S);
})(typeof window !== "undefined" ? window : globalThis);
