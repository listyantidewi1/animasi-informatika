/* D10 bab 2 — LEVEL 2: Mengapa game Xbox tidak bisa langsung dibuka di Windows? (b2_1 … b2_8).
   Perumpamaan resep (kode sumber) → compiler → kue (kode mesin); tiga hal: prosesor (cocok), sistem operasi, kartu grafis. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080, TAU = Math.PI * 2;

  // alur resep → compiler → kue. k1,k2 = kemajuan panah; a = [alpha resep, mesin, kue]
  function alur(ctx, l, t, a, k1, k2, o = {}) { const y = o.y || 500, xs = [380, 960, 1540];
    if (a[0] > 0) { ctx.save(); ctx.globalAlpha *= a[0]; I.resep(ctx, xs[0], y, 300, N.cyan); txt(ctx, "kode sumber", xs[0], y + 220, 52, { align: "center", weight: 900 }); txt(ctx, "= resep", xs[0], y + 280, 46, { align: "center", weight: 800, color: N.cyan }); ctx.restore(); }
    U.panah(ctx, xs[0] + 150, y, xs[1] - 190, y, N.gold, k1, 9);
    if (a[1] > 0) { ctx.save(); ctx.globalAlpha *= a[1]; I.mesin(ctx, xs[1], y, 300, N.gold, t); txt(ctx, "compiler", xs[1], y + 220, 52, { align: "center", weight: 900 }); ctx.restore(); }
    U.panah(ctx, xs[1] + 190, y, xs[2] - 190, y, N.gold, k2, 9);
    if (a[2] > 0) { ctx.save(); ctx.globalAlpha *= a[2]; I.kue(ctx, xs[2], y + 20, 300, N.pink); txt(ctx, "kode mesin", xs[2], y + 220, 52, { align: "center", weight: 900 }); txt(ctx, "= kue", xs[2], y + 280, 46, { align: "center", weight: 800, color: N.pink }); ctx.restore(); }
    return xs; }

  S.b2_1 = function (ctx, b, l, t) {
    const tKue = D.at(b, "sebuah kue"), tKode = D.at(b, "kode sumber"), tRes = D.at(b, "ibarat resep"), tBaca = D.at(b, "dibaca oleh manusia");
    U.ruang(ctx, t, { col: N.cyan, gx: 500, gy: 320 });
    const pk = U.pop(l, tKue - 0.1), sh = eio(ramp(l, tKode - 0.3, 0.6));
    if (pk.a > 0) { ctx.save(); ctx.globalAlpha *= pk.a * (1 - sh); I.kue(ctx, 960, 520, 380 * lerp(0.7, 1, pk.sp), N.pink); ctx.restore(); }
    if (sh > 0) { ctx.save(); ctx.globalAlpha *= sh; I.resep(ctx, 560, 520, 420, N.cyan);
      X.kode(ctx, 900, 330, 800, [{ s: "kecepatan = 80", col: N.cyan, t0: tKode }, { s: "jika hujan:", col: N.pink, t0: tKode + 0.4 }, { s: "    kecepatan = 50", col: N.cyan, t0: tKode + 0.8 }, { s: "jalankan(mobil)", col: N.gold, t0: tKode + 1.2 }], l, { judul: "kode sumber (ilustrasi)", size: 44 }); ctx.restore(); }
    X.judul(ctx, "Bayangkan sebuah kue", l, tKue - 0.3, N.pink, { a: 1 - ramp(l, tRes - 0.4, 0.3) });
    X.judul(ctx, "Kode sumber ibarat resep", l, tRes - 0.2, N.cyan);
    X.bawah(ctx, "bisa dibaca oleh manusia", l, tBaca - 0.2, N.green);
  };

  S.b2_2 = function (ctx, b, l, t) {
    const tCom = D.at(b, "compiler"), tMes = D.at(b, "kode mesin"), tAng = D.at(b, "deretan angka"), tKue = D.at(b, "itulah kuenya");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 320 });
    alur(ctx, l, t, [1, ramp(l, tCom - 0.3, 0.4), ramp(l, tMes - 0.2, 0.4)], ramp(l, 0.4, 0.8), ramp(l, tMes - 0.6, 0.6), { y: 470 });
    const pa = ramp(l, tAng - 0.1, 0.4); if (pa > 0) X.mono(ctx, "48 8B 05 01 D8 EB 10 …", 1500, 836, 40, { align: "center", color: N.pink, a: pa, fit: 560 });
    X.judul(ctx, "Compiler mengubah resep menjadi kode mesin", l, tCom - 0.2, N.gold);
  };

  S.b2_3 = function (ctx, b, l, t) {
    const tJual = D.at(b, "dijual"), tSim = D.at(b, "Resepnya tetap disimpan"), tDapur = D.at(b, "dapur Rockstar"), tDari = D.at(b, "dari sepotong kue"), tTidak = D.at(b, "tidak bisa mendapatkan");
    U.ruang(ctx, t, { col: N.pink, gx: 1400, gy: 320 });
    const rs = X.cols(2, { x0: 200, x1: 1720, y: 300, h: 460, gap: 380 });
    const p1 = U.pop(l, tJual - 0.3), p2 = U.pop(l, tSim - 0.2);
    X.kartu(ctx, rs[1], { col: N.pink, ikon: I.kue, judul: "Kue", sub: "yang dijual kepada pemain", a: p1.a, sp: p1.sp });
    X.kartu(ctx, rs[0], { col: N.cyan, ikon: I.resep, judul: "Resep", sub: l > tDapur - 0.2 ? "disimpan di dapur Rockstar" : "", a: p2.a, sp: p2.sp });
    if (p2.a > 0) U.gembok(ctx, rs[0].x + rs[0].w - 70, rs[0].y + 76, 80, N.gold);
    const k = ramp(l, tDari, 0.8); U.panah(ctx, rs[1].x - 40, 530, rs[0].x + rs[0].w + 40, 530, N.red, k, 9, { dash: [20, 14] }); U.silang(ctx, 960, 530, 110, ramp(l, tTidak, 0.4));
    X.judul(ctx, "Pemain hanya mendapat kuenya", l, tJual - 0.3, N.pink, { a: 1 - ramp(l, tDari - 0.2, 0.3) });
    X.judul(ctx, "Dari kue, resep utuhnya tidak bisa didapat kembali", l, tDari, N.red);
  };

  const HAL = [["Prosesor", I.chip], ["Sistem operasi", I.os], ["Kartu grafis", I.gpu]];
  // papan tiga hal; status[i]: 0 belum dibahas, 1 aktif, 2 cocok, 3 tidak cocok
  function papan(ctx, l, t, status, o = {}) { const rs = X.cols(3, { x0: o.x0 || 110, x1: o.x1 || 1810, y: o.y || 290, h: o.h || 190, gap: 40 });
    rs.forEach((r, i) => { const st = status[i], col = st === 2 ? N.green : st === 3 ? N.red : st === 1 ? N.gold : N.dim; ctx.save(); ctx.globalAlpha *= st === 0 ? 0.5 : 1;
      U.panel(ctx, r.x, r.y, r.w, r.h, { col, blur: st === 1 ? 26 : 8 }); HAL[i][1](ctx, r.x + 76, r.y + r.h / 2, 90, col, t);
      txt(ctx, HAL[i][0], r.x + 146, r.y + r.h / 2 + 16, 44, { weight: 900, fit: r.w - 236 });
      if (st === 2) U.centang(ctx, r.x + r.w - 60, r.y + r.h / 2, 40, 1); if (st === 3) U.silang(ctx, r.x + r.w - 60, r.y + r.h / 2, 46, 1); ctx.restore(); }); return rs; }

  S.b2_4 = function (ctx, b, l, t) {
    const tMeja = D.at(b, "meja makan"), tTiga = D.at(b, "tiga hal");
    U.ruang(ctx, t, { col: N.violet, gx: 960, gy: 300 });
    const pk = U.pop(l, 0.3); if (pk.a > 0) { ctx.save(); ctx.globalAlpha *= pk.a; I.kue(ctx, 960, 370, 240, N.pink); ctx.fillStyle = D.hexA(N.cyan, 0.8); ctx.shadowColor = N.cyan; ctx.shadowBlur = 16; RR(ctx, 620, 480, 680, 16, 8); ctx.fill(); ctx.restore(); }
    const rs = X.cols(3, { x0: 260, x1: 1660, y: 560, h: 230, gap: 60 });
    rs.forEach((r, i) => { const p = U.pop(l, tTiga - 0.2 + i * 0.25); if (p.a <= 0) return; ctx.save(); ctx.globalAlpha *= p.a; U.panel(ctx, r.x, r.y, r.w, r.h, { col: N.gold }); U.tanya(ctx, r.cx, r.y + 96, 130, N.gold); txt(ctx, "hal ke-" + (i + 1), r.cx, r.y + r.h - 28, 44, { align: "center", weight: 800, color: N.ink2 }); ctx.restore(); });
    X.judul(ctx, "Kue itu dibuat untuk satu jenis meja makan", l, tMeja - 1.2, N.pink, { a: 1 - ramp(l, tTiga - 0.5, 0.3) });
    X.judul(ctx, "Sebuah game butuh tiga hal dari mesinnya", l, tTiga - 0.3, N.gold);
  };

  S.b2_5 = function (ctx, b, l, t) {
    const tKel = D.at(b, "keluarga prosesor"), tX = D.at(b, "x86-64"), tArt = D.at(b, "Artinya");
    U.ruang(ctx, t, { col: N.green, gx: 500, gy: 320 });
    papan(ctx, l, t, [l > tArt ? 2 : 1, 0, 0]);
    const rs = X.cols(2, { x0: 330, x1: 1590, y: 520, h: 290, gap: 260 });
    [["Xbox Series", N.pink], ["PC", N.cyan]].forEach(([s, col], i) => { const p = U.pop(l, tKel - 0.3 + i * 0.3); if (p.a <= 0) return; const r = rs[i]; ctx.save(); ctx.globalAlpha *= p.a; U.panel(ctx, r.x, r.y, r.w, r.h, { col });
      I.chip(ctx, r.x + 110, r.y + r.h / 2, 150, col); txt(ctx, s, r.x + 210, r.y + 110, 50, { weight: 900, fit: r.w - 230 });
      if (l > tX - 0.2) txt(ctx, "x86-64", r.x + 210, r.y + 196, 60, { weight: 900, color: N.green, fit: r.w - 230 }); ctx.restore(); });
    const pe = U.pop(l, tX + 0.3); if (pe.a > 0) { ctx.save(); ctx.globalAlpha *= pe.a; txt(ctx, "=", 960, 700, 130, { align: "center", weight: 900, color: N.green }); ctx.restore(); }
    X.judul(ctx, "Hal pertama: prosesor", l, 0.3, N.gold, { a: 1 - ramp(l, tArt - 0.2, 0.3) });
    X.judul(ctx, "Kode mesinnya sudah dipahami prosesor PC", l, tArt, N.green);
  };

  S.b2_6 = function (ctx, b, l, t) {
    const tRibu = D.at(b, "Ribuan kali"), tBk = D.at(b, "membuka berkas"), tSu = D.at(b, "memutar suara"), tTo = D.at(b, "membaca tombol"), tXb = D.at(b, "sistem Xbox"), tTdk = D.at(b, "tidak ada di Windows");
    U.ruang(ctx, t, { col: N.red, gx: 1400, gy: 320 });
    papan(ctx, l, t, [2, l > tTdk ? 3 : 1, 0]);
    // kiri: game; kanan: sistem
    const ag = ramp(l, tRibu - 0.3, 0.4); ctx.save(); ctx.globalAlpha *= ag; U.panel(ctx, 130, 540, 360, 260, { col: N.pink }); I.resep(ctx, 310, 640, 130, N.cyan); txt(ctx, "game", 310, 770, 48, { align: "center", weight: 900 }); ctx.restore();
    const reqs = [[tBk, "buka berkas"], [tSu, "putar suara"], [tTo, "baca tombol"]];
    reqs.forEach(([t0, s], i) => { const p = U.pop(l, t0 - 0.15); if (p.a <= 0) return; const y = 560 + i * 82; ctx.save(); ctx.globalAlpha *= p.a; U.panah(ctx, 510, y + 30, 760, y + 30, N.gold, ramp(l, t0 - 0.15, 0.4), 6);
      ctx.fillStyle = "rgba(16,8,38,0.9)"; RR(ctx, 780, y, 400, 64, 16); ctx.fill(); ctx.strokeStyle = D.hexA(N.gold, 0.8); ctx.lineWidth = 3; ctx.stroke(); txt(ctx, s, 980, y + 46, 42, { align: "center", weight: 800, fit: 370 }); ctx.restore(); });
    const ps = U.pop(l, tXb - 0.2); if (ps.a > 0) { ctx.save(); ctx.globalAlpha *= ps.a; const gone = ramp(l, tTdk, 0.4); U.panel(ctx, 1290, 540, 500, 260, { col: gone > 0.5 ? N.red : N.violet }); ctx.globalAlpha *= 1 - 0.6 * gone; I.os(ctx, 1540, 630, 150, gone > 0.5 ? N.red : N.violet);
      ctx.globalAlpha = ps.a; txt(ctx, gone > 0.5 ? "di Windows: tidak ada" : "layanan sistem Xbox", 1540, 770, 44, { align: "center", weight: 900, color: gone > 0.5 ? N.red : N.ink, fit: 460 }); ctx.restore(); U.silang(ctx, 1540, 630, 130, ramp(l, tTdk + 0.1, 0.4)); }
    X.judul(ctx, "Hal kedua: sistem operasi", l, 0.3, N.gold);
  };

  S.b2_7 = function (ctx, b, l, t) {
    const tSh = D.at(b, "shader"), tWar = D.at(b, "warna setiap piksel"), tKh = D.at(b, "dimasak khusus"), tTdk = D.at(b, "tidak bisa langsung");
    U.ruang(ctx, t, { col: N.violet, gx: 500, gy: 320 });
    papan(ctx, l, t, [2, 3, l > tTdk ? 3 : 1]);
    // kisi shader
    const a = ramp(l, tSh - 0.3, 0.5), cols = [N.pink, N.cyan, N.gold, N.green, N.violet]; ctx.save(); ctx.globalAlpha *= a;
    U.panel(ctx, 130, 530, 560, 290, { col: N.violet }); for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) { const on = ramp(l, tSh + (r * 12 + c) * 0.03, 0.2); ctx.fillStyle = D.hexA(cols[(r * 5 + c * 3) % 5], 0.3 + 0.5 * on * (0.6 + 0.4 * Math.sin(t * 3 + r + c))); RR(ctx, 164 + c * 62, 556 + r * 46, 50, 36, 8); ctx.fill(); }
    txt(ctx, "ribuan shader", 410, 790, 44, { align: "center", weight: 900 }); ctx.restore();
    const pd = U.pop(l, tWar - 0.3); if (pd.a > 0) { ctx.save(); ctx.globalAlpha *= pd.a; U.panel(ctx, 730, 530, 1060, 130, { col: N.cyan }); txt(ctx, "shader = program kecil penghitung warna piksel", 1260, 612, 42, { align: "center", weight: 800, fit: 1010 }); ctx.restore(); }
    const pk = U.pop(l, tKh - 0.2); if (pk.a > 0) { ctx.save(); ctx.globalAlpha *= pk.a; U.panel(ctx, 730, 690, 1060, 130, { col: l > tTdk ? N.red : N.pink }); txt(ctx, l > tTdk ? "kartu grafis lain tidak bisa langsung memakainya" : "dimasak khusus untuk chip grafis Xbox", 1260, 772, 42, { align: "center", weight: 800, color: l > tTdk ? N.red : N.ink, fit: 1010 }); ctx.restore(); }
    X.judul(ctx, "Hal ketiga: kartu grafis", l, 0.3, N.gold);
  };

  S.b2_8 = function (ctx, b, l, t) {
    const tSatu = D.at(b, "hanya satu yang cocok"), tDua = D.at(b, "Dua sisanya"), tCara = D.at(b, "dengan cara apa");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 300 });
    const rs = X.cols(3, { y: 310, h: 440 }); const st = [l > tSatu - 0.2 ? N.green : N.gold, l > tDua - 0.2 ? N.red : N.gold, l > tDua - 0.2 ? N.red : N.gold];
    HAL.forEach(([s, ik], i) => { const p = U.pop(l, 0.3 + i * 0.2); X.kartu(ctx, rs[i], { col: st[i], ikon: ik, judul: s, sub: st[i] === N.green ? "cocok" : st[i] === N.red ? "harus dibuat sendiri" : "", scol: st[i], a: p.a, sp: p.sp, t, nomor: i + 1 }); });
    U.centang(ctx, rs[0].x + rs[0].w - 70, rs[0].y + 70, 44, ramp(l, tSatu, 0.4)); [1, 2].forEach(i => U.silang(ctx, rs[i].x + rs[i].w - 70, rs[i].y + 70, 50, ramp(l, tDua + (i - 1) * 0.2, 0.4)));
    X.judul(ctx, "Dari tiga colokan, hanya satu yang cocok", l, 0.3, N.gold);
    X.bawah(ctx, "Dengan cara apa modder membuat dua sisanya?", l, tCara - 0.4, N.pink);
  };

  X.reg(2, S);
})(typeof window !== "undefined" ? window : globalThis);
