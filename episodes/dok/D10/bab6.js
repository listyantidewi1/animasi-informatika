/* D10 bab 6 — LEVEL 5: "Hampir menyala" (b5_1 … b5_8). Layar hitam, judul yang dibesar-besarkan, tangga lima anak tangga,
   proyek menghilang, yang diketahui dan yang belum, tanah yang rapuh. Orang sungguhan tidak digambar. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, TAU = Math.PI * 2;

  S.b5_1 = function (ctx, b, l, t) {
    const tKab = D.at(b, "muncul kabar"), tKal = D.at(b, "hampir menyala"), tHit = D.at(b, "Layarnya masih hitam");
    U.ruang(ctx, t, { col: N.violet, gx: 520, gy: 460, dim: 0.7 });
    I.monitor(ctx, 520, 500, 500, N.violet, t);
    const p = U.pop(l, tKab - 0.2); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; U.panel(ctx, 980, 320, 800, 330, { col: N.cyan, fill: "rgba(10,6,26,0.94)" }); txt(ctx, "kabar dari dalam proyek", 1380, 390, 42, { align: "center", weight: 700, color: N.ink2 });
      const a = ramp(l, tKal - 0.6, 0.4); if (a > 0) { X.mono(ctx, "\"The game almost boots.\"", 1380, 490, 50, { align: "center", color: N.cyan, a, fit: 740 }); ctx.globalAlpha *= a; txt(ctx, "artinya: game ini hampir menyala", 1380, 584, 44, { align: "center", weight: 800, fit: 740 }); } ctx.restore(); }
    X.judul(ctx, "Beberapa jam setelah executable dirilis", l, 0.2, N.cyan);
    { const a = ramp(l, tHit - 0.1, 0.4); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; txt(ctx, "layarnya masih hitam", 520, 480, 44, { align: "center", weight: 800, color: N.ink2 }); ctx.restore(); } }
    X.sumber(ctx, l, tKal, "XDA Developers");
  };

  S.b5_2 = function (ctx, b, l, t) {
    const tJud = D.at(b, "judul yang jauh"), tMis = D.at(b, "misalnya"), tPad = D.at(b, "Padahal"), tMen = D.at(b, "kata menyala"), tBis = D.at(b, "kata bisa dimainkan"), tJauh = D.at(b, "sangat jauh");
    U.ruang(ctx, t, { col: N.red, gx: 960, gy: 420 });
    const out = eio(ramp(l, tPad - 0.3, 0.5));
    if (out < 0.99) { const p = U.pop(l, tJud - 0.4); ctx.save(); ctx.globalAlpha *= p.a * (1 - out); U.panel(ctx, 310, 300, 1300, 380, { col: N.red }); txt(ctx, "JUDUL YANG MENYEBAR", 960, 380, 42, { align: "center", weight: 800, color: N.ink2 });
      const a = ramp(l, tMis, 0.4); ctx.globalAlpha *= a; txt(ctx, "“GTA 6 sudah bisa", 960, 500, 84, { align: "center", weight: 900, fit: 1200 }); txt(ctx, "dimainkan di PC!”", 960, 606, 84, { align: "center", weight: 900, fit: 1200 }); ctx.restore(); }
    if (out > 0.01) { const rs = X.cols(2, { x0: 250, x1: 1670, y: 300, h: 420, gap: 300 }); const p1 = U.pop(l, tMen - 0.2), p2 = U.pop(l, tBis - 0.2);
      X.kartu(ctx, rs[0], { col: N.violet, ikon: (c, x, y, s, col) => I.monitor(c, x, y, s * 0.8, col, t), ih: 150, judul: "Menyala", sub: "program dimulai", a: p1.a * out, sp: p1.sp });
      X.kartu(ctx, rs[1], { col: N.green, ikon: I.konsol, judul: "Bisa dimainkan", sub: "dari awal sampai akhir", a: p2.a * out, sp: p2.sp });
      const pn = U.pop(l, tJauh - 0.2); if (pn.a > 0) { ctx.save(); ctx.globalAlpha *= pn.a; txt(ctx, "≠", 960, 560, 170, { align: "center", weight: 900, color: N.red }); ctx.restore(); } }
    X.judul(ctx, "Kabar itu menyebar dengan judul yang lebih besar", l, tJud - 0.5, N.red, { a: 1 - out });
    X.judul(ctx, "Bagi programmer, dua kata ini sangat berbeda", l, tPad, N.gold);
  };

  const TANGGA = ["Program dimulai tanpa langsung berhenti", "Menu muncul", "Dunia game tampil di layar", "Bisa dimainkan tanpa macet", "Lancar di berbagai macam komputer"];
  const TCOL = [N.cyan, N.violet, N.pink, N.gold, N.green];
  function tangga(ctx, l, ts, o = {}) { TANGGA.forEach((s, i) => { const p = ts ? U.pop(l, ts[i]) : { a: 1, sp: 1 }; if (p.a <= 0.01) return; const x = 160 + i * 150, y = 706 - i * 108, w = 1040, h = 92, col = TCOL[i], dim = o.dim && i > 0 ? lerp(1, 0.32, o.dim) : 1;
    ctx.save(); ctx.globalAlpha *= p.a * dim; ctx.translate(0, (1 - p.sp) * 30); U.panel(ctx, x, y, w, h, { col, blur: 12 }); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + 56, y + h / 2, 30, 0, TAU); ctx.fill(); txt(ctx, String(i + 1), x + 56, y + h / 2 + 15, 42, { align: "center", weight: 900, color: "#120826" });
    txt(ctx, s, x + 108, y + h / 2 + 15, 43, { weight: 800, fit: w - 136 }); ctx.restore(); }); }

  S.b5_3 = function (ctx, b, l, t) {
    const ts = ["anak tangga pertama", "anak tangga kedua", "anak tangga ketiga", "anak tangga keempat", "anak tangga kelima"].map(s => D.at(b, s) - 0.2);
    U.ruang(ctx, t, { col: N.cyan, gx: 1300, gy: 380 }); tangga(ctx, l, ts);
    X.judul(ctx, "Tangga dari “menyala” sampai “selesai”", l, 0.3, N.cyan);
  };
  S.b5_4 = function (ctx, b, l, t) {
    const tKl = D.at(b, "anak tangga pertama"), tBel = D.at(b, "belum ada satu pun");
    U.ruang(ctx, t, { col: N.gold, gx: 500, gy: 700 }); tangga(ctx, l, null, { dim: ramp(l, tKl - 0.6, 0.6) });
    const p = U.pop(l, tKl - 0.2); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; const x = 1236 + Math.sin(t * 4) * 8; U.panah(ctx, x + 70, 752, x, 752, N.gold, 1, 10); txt(ctx, "klaim yang beredar", 1330, 768, 46, { weight: 900, color: N.gold, fit: 470 }); ctx.restore(); }
    X.bawah(ctx, "Belum ada bukti dari pihak independen", l, tBel - 0.2, N.red, { x: 1270, fit: 900, size: 46 });
    X.judul(ctx, "Klaimnya baru di sekitar anak tangga pertama", l, 0.2, N.gold);
    X.status(ctx, l, tBel + 0.8); U.silang(ctx, 420, 400, 90, ramp(l, tBel, 0.4) * 0);
  };

  S.b5_5 = function (ctx, b, l, t) {
    U.ruang(ctx, t, { col: N.red, gx: 960, gy: 420, dim: 0.7 });
    X.deret(ctx, b, l, t, [{ ph: "halaman proyek", judul: "Halaman GitHub proyek", sub: "menghilang", ikon: I.hilang, col: N.red }, { ph: "server Discord", judul: "Server Discord proyek", sub: "ikut hilang", ikon: I.balon, col: N.violet }], { x0: 260, x1: 1660, y: 290, h: 440, gap: 120, js: 50 });
    X.judul(ctx, "Sekitar satu hari kemudian, ceritanya berbelok", l, 0.2, N.red);
    X.sumber(ctx, l, D.at(b, "halaman proyek"), "Decrypt, Dexerto");
  };
  S.b5_6 = function (ctx, b, l, t) {
    const tBer = D.at(b, "ia berhenti");
    U.ruang(ctx, t, { col: N.violet, gx: 960, gy: 360, dim: 0.7 });
    const p = U.pop(l, 0.4); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; U.panel(ctx, 460, 262, 1000, 220, { col: N.violet, fill: "rgba(10,6,26,0.94)" }); txt(ctx, "tulisan pemimpin proyek", 960, 322, 40, { align: "center", weight: 700, color: N.ink2 });
      X.mono(ctx, "\"I quit guys.\"", 960, 398, 60, { align: "center", color: N.pink, a: ramp(l, tBer - 0.6, 0.4) }); ctx.globalAlpha *= ramp(l, tBer, 0.4); txt(ctx, "artinya: saya berhenti", 960, 456, 42, { align: "center", weight: 800 }); ctx.restore(); }
    X.daftar(ctx, b, l, 360, 520, 1200, [{ ph: "lima belas tahun", s: "Ia mengaku berusia 15 tahun", col: N.gold, tanda: "titik" }, { ph: "Rockstar menurunkan", s: "Ia menyebut Rockstar menurunkan servernya", col: N.red, tanda: "titik" }], { rh: 104 });
    X.judul(ctx, "Pemimpin proyek menulis bahwa ia berhenti", l, 0.2, N.violet);
    X.bawah(ctx, "Keduanya adalah pengakuannya sendiri", l, D.at(b, "Rockstar menurunkan") + 1.6, N.gold, { x: 1240, fit: 1000 });
    X.sumber(ctx, l, tBer, "Decrypt, Dexerto");
  };
  S.b5_7 = function (ctx, b, l, t) {
    const tJadi = D.at(b, "Jadi, penyebab");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 420 });
    X.daftar(ctx, b, l, 260, 276, 1400, [{ ph: "Rockstar tidak", s: "Rockstar tidak memberikan pernyataan apa pun", col: N.red, tanda: "silang" }, { ph: "Halaman GitHub", s: "GitHub hanya menampilkan “tidak ditemukan”", col: N.cyan, tanda: "titik" }, { ph: "bukan pemberitahuan", s: "Bukan pemberitahuan pelanggaran hak cipta", col: N.cyan, tanda: "silang" }], { rh: 110 });
    const p = U.pop(l, tJadi - 0.1); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; X.kotak(ctx, 360, 640, 1200, 120, "Penyebab pastinya belum diketahui", N.gold, { size: 54 }); ctx.restore(); }
    X.judul(ctx, "Di sini kita harus berhati-hati", l, 0.2, N.gold);
    X.status(ctx, l, tJadi + 0.6);
  };
  S.b5_8 = function (ctx, b, l, t) {
    const tRek = D.at(b, "Rekompilasi"), tSal = D.at(b, "salinan bocoran"), tPem = D.at(b, "adalah pembajakan");
    U.ruang(ctx, t, { col: N.red, gx: 960, gy: 520, dim: 0.75 });
    const rs = X.cols(2, { x0: 150, x1: 1090, y: 290, h: 430, gap: 120 }), p1 = U.pop(l, tSal - 0.2), p0 = U.pop(l, tRek - 0.2);
    X.kartu(ctx, rs[0], { col: N.violet, ikon: I.peti, judul: "Salinan bocoran", sub: "bukan milik sah", a: p1.a, sp: p1.sp });
    X.kartu(ctx, rs[1], { col: N.green, ikon: I.mesin, ih: 150, judul: "Rekompilasi", sub: "tekniknya netral", a: p0.a, sp: p0.sp, t });
    if (p1.a > 0.5) U.panah(ctx, rs[0].x + rs[0].w + 16, 505, rs[1].x - 16, 505, N.gold, ramp(l, tSal, 0.4), 10);
    const k = ramp(l, tPem - 0.3, 0.4); if (k > 0) U.panah(ctx, rs[1].x + rs[1].w + 16, 505, 1210, 505, N.red, k, 10);
    X.stempel(ctx, "PEMBAJAKAN", 1490, 505, l, tPem - 0.1, N.red, { size: 60 });
    // tanah retak di bawah
    ctx.save(); ctx.strokeStyle = D.hexA(N.red, 0.5 * ramp(l, 0.6, 0.6)); ctx.lineWidth = 5; ctx.beginPath(); const R = U.rng ? U.rng(7) : Math.random; for (let i = 0, x = 110; i <= 34; i++, x += 50) { const y = 780 + (R() - 0.5) * 34; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
    X.judul(ctx, "Proyek seperti ini berdiri di atas tanah yang rapuh", l, 0.2, N.red);
  };
  X.reg(6, S);
})(typeof window !== "undefined" ? window : globalThis);
