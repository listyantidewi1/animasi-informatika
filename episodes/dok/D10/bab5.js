/* D10 bab 5 — LEVEL 4: Proyek Leonida (b4_1 … b4_6). Papan empat pekerjaan: kode game, sistem Xbox tiruan, shader (klaim 26.503,
   belum diverifikasi), aset dari salinan pemain. Lalu: bantuan AI, puluhan kontributor, hitungan hari. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920;
  const KERJA = [
    { judul: "Kode game", sub: "berjalan langsung di prosesor PC", ikon: I.chip, col: N.cyan },
    { judul: "Sistem tiruan", sub: "menjawab permintaan game", ikon: I.os, col: N.violet },
    { judul: "Shader", sub: "diterjemahkan untuk kartu grafis PC", ikon: I.gpu, col: N.pink },
    { judul: "Aset game", sub: "gambar, suara, peta dari salinan pemain", ikon: I.peti, col: N.gold }];
  function papan(ctx, l, t, aktif, ts) { const rs = X.cols(4, { y: 262, h: 470, gap: 36 });
    KERJA.forEach((k, i) => { const p = ts ? U.pop(l, ts[i]) : { a: 1, sp: 1 }; X.kartu(ctx, rs[i], { ...k, ih: 130, nomor: i + 1, a: p.a, sp: p.sp, t, redup: aktif >= 0 && i !== aktif }); }); return rs; }

  S.b4_1 = function (ctx, b, l, t) {
    const tLeo = D.at(b, "Leonida"), tNeg = D.at(b, "nama negara bagian"), tGab = D.at(b, "menggabungkan"), tEmp = D.at(b, "empat pekerjaan");
    U.ruang(ctx, t, { col: N.pink, gx: 960, gy: 420 });
    const out = eio(ramp(l, tEmp - 0.5, 0.5));
    ctx.save(); ctx.globalAlpha *= 1 - out;
    U.neonPop(ctx, "PROYEK LEONIDA", W / 2, 400, 120, N.pink, l, tLeo - 0.2, { align: "center" });
    const a1 = ramp(l, tNeg - 0.2, 0.4); if (a1 > 0) { ctx.save(); ctx.globalAlpha *= a1; txt(ctx, "nama negara bagian di dalam game", W / 2, 490, 48, { align: "center", weight: 700, color: N.ink2 }); ctx.restore(); }
    const pg = U.pop(l, tGab - 0.2); if (pg.a > 0) { X.kotak(ctx, 250, 590, 620, 120, "Jalan 2: lapisan", N.violet, { a: pg.a, size: 50 }); X.kotak(ctx, 1050, 590, 620, 120, "Jalan 3: rekompilasi", N.green, { a: pg.a, size: 50 });
      ctx.save(); ctx.globalAlpha *= pg.a; txt(ctx, "+", W / 2, 676, 90, { align: "center", weight: 900, color: N.gold }); ctx.restore(); }
    ctx.restore();
    if (out > 0.01) { ctx.save(); ctx.globalAlpha *= out; papan(ctx, l, t, -1, [0, 1, 2, 3].map(i => tEmp - 0.3 + i * 0.25)); ctx.restore(); }
    X.judul(ctx, "Empat pekerjaan dalam rencana proyek Leonida", l, tEmp - 0.2, N.pink);
    X.sumber(ctx, l, tGab, "penjelasan proyek, dikutip XDA Developers");
  };
  S.b4_2 = function (ctx, b, l, t) {
    const tHam = D.at(b, "hampir tanpa");
    U.ruang(ctx, t, { col: N.cyan, gx: 320, gy: 420 }); papan(ctx, l, t, 0);
    X.judul(ctx, "Pekerjaan 1: kode game", l, 0.2, N.cyan);
    X.bawah(ctx, "Prosesornya sekeluarga, jadi hampir tanpa diterjemahkan", l, tHam - 1.4, N.cyan);
  };
  S.b4_3 = function (ctx, b, l, t) {
    const tLel = D.at(b, "paling melelahkan"), tSatu = D.at(b, "satu jawaban");
    U.ruang(ctx, t, { col: N.violet, gx: 740, gy: 420 }); papan(ctx, l, t, 1);
    X.judul(ctx, "Pekerjaan 2: membangun ulang sistem Xbox", l, 0.2, N.violet);
    X.bawah(ctx, "Pekerjaan yang paling melelahkan", l, tLel - 0.3, N.gold, { a: 1 - ramp(l, tSatu - 0.3, 0.3) });
    X.bawah(ctx, "Satu jawaban keliru saja bisa membuat game berhenti", l, tSatu, N.red);
  };
  S.b4_4 = function (ctx, b, l, t) {
    const tAng = D.at(b, "dua puluh enam ribu"), tKl = D.at(b, "Angka itu"), tBel = D.at(b, "belum diperiksa");
    U.ruang(ctx, t, { col: N.pink, gx: 1170, gy: 420 }); papan(ctx, l, t, 2);
    X.judul(ctx, "Pekerjaan 3: menerjemahkan shader", l, 0.2, N.pink);
    const k = eout(ramp(l, tAng - 0.1, 2.2)); if (k > 0) D.post(c => { c.save(); c.globalAlpha *= ramp(l, tAng - 0.1, 0.3); const n = Math.round(26503 * k).toLocaleString("id-ID");
      txt(c, n + " shader", 400, 836, 72, { align: "center", weight: 900, color: N.gold }); c.restore();
      X.stempel(c, "KLAIM SENDIRI", 950, 812, l, tKl, N.red, { size: 48 }); X.stempel(c, "belum diverifikasi", 1490, 812, l, tBel, N.red, { size: 44, rot: 0.05 }); });
  };
  S.b4_5 = function (ctx, b, l, t) {
    const tTid = D.at(b, "tidak dibuat ulang"), tSal = D.at(b, "salinan game");
    U.ruang(ctx, t, { col: N.gold, gx: 1600, gy: 420 }); papan(ctx, l, t, 3);
    X.judul(ctx, "Pekerjaan 4: gambar, suara, dan peta", l, 0.2, N.gold);
    X.bawah(ctx, "Tidak dibuat ulang, melainkan diambil dari salinan milik pemain", l, tTid - 0.2, N.gold, { size: 46 });
  };
  S.b4_6 = function (ctx, b, l, t) {
    const tLalu = D.at(b, "Lalu, sejauh mana");
    U.ruang(ctx, t, { col: N.green, gx: 960, gy: 400 });
    X.deret(ctx, b, l, t, [{ ph: "bantuan AI", judul: "Bantuan AI", sub: "banyak dipakai, menurut kabar", ikon: I.gir, col: N.green }, { ph: "puluhan kontributor", judul: "Puluhan kontributor", sub: "bekerja bersama", ikon: I.orang, col: N.cyan }, { ph: "hitungan hari", judul: "Hitungan hari", sub: "bukan bertahun-tahun", ikon: I.kalender, col: N.gold }], { y: 280, h: 440, gap: 50, js: 48 });
    X.judul(ctx, "Satu detail yang menarik", l, 0.2, N.green);
    X.bawah(ctx, "Lalu, sejauh mana hasilnya?", l, tLalu - 0.2, N.gold, { size: 60 });
  };
  X.reg(5, S);
})(typeof window !== "undefined" ? window : globalThis);
