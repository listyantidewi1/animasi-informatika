/* D10 bab 4 — BONUS STAGE A: Di dalam mesin penerjemah (ba_1 … ba_10). Empat langkah (disassembly, kelompokkan jadi fungsi,
   instruksi → baris C, kompilasi ulang), beda dengan dekompilasi, dua jebakan (lompatan tidak langsung; kode vs data),
   lalu kasus GTA 6. Semua kode di layar adalah ilustrasi yang disederhanakan. */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080;
  const LK = ["Disassembly", "Kelompokkan", "Jadi kode C", "Kompilasi ulang"];
  const ilus = ctx => D.post(c => { c.save(); txt(c, "(ilustrasi, disederhanakan)", 1810, 880, 40, { align: "right", weight: 700, color: N.dim }); c.restore(); });

  S.ba_1 = function (ctx, b, l, t) {
    const tBag = D.at(b, "Bagaimana sebenarnya"), tRes = D.at(b, "resepnya tidak ada");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 320 });
    const rs = X.cols(3, { x0: 200, x1: 1720, y: 320, h: 440, gap: 110 });
    const p1 = U.pop(l, 0.4), p2 = U.pop(l, tBag - 0.1), p3 = U.pop(l, tBag + 0.5);
    X.kartu(ctx, rs[0], { col: N.pink, ikon: I.kue, judul: "Kode mesin", sub: "hanya ini yang ada", a: p1.a, sp: p1.sp });
    X.kartu(ctx, rs[1], { col: N.gold, ikon: I.mesin, judul: "Alat penerjemah", sub: "bagaimana cara kerjanya?", a: p2.a, sp: p2.sp, t });
    X.kartu(ctx, rs[2], { col: N.green, ikon: I.pc, judul: "Program untuk PC", a: p3.a, sp: p3.sp });
    U.panah(ctx, rs[0].x + rs[0].w + 14, 540, rs[1].x - 14, 540, N.gold, ramp(l, tBag, 0.5), 8); U.panah(ctx, rs[1].x + rs[1].w + 14, 540, rs[2].x - 14, 540, N.gold, ramp(l, tBag + 0.5, 0.5), 8);
    X.judul(ctx, "Menerjemahkan program tanpa resepnya", l, tBag - 0.3, N.gold);
  };

  const HEX = ["48 8B 05 …", "01 D8", "EB 10"], ASM = ["mov rax, [alamat]", "add eax, ebx", "jmp +16"], ARTI = ["ambil nilai dari memori", "tambahkan dua angka", "lompat ke alamat lain"];
  S.ba_2 = function (ctx, b, l, t) {
    const tAng = D.at(b, "deretan angka"), ts = [D.at(b, "ambil nilai dari memori"), D.at(b, "tambahkan dua angka"), D.at(b, "lompat ke alamat tertentu")], tAlat = D.at(b, "Sebuah alat");
    U.ruang(ctx, t, { col: N.cyan, gx: 500, gy: 420 }); X.langkah(ctx, l, 0, LK);
    X.kode(ctx, 130, 350, 400, HEX.map((s, i) => ({ s, col: N.pink, t0: tAng + i * 0.2, hl: l > ts[i] - 0.3 && (i === 2 || l < ts[i + 1] - 0.3) ? 1 : 0 })), l, { judul: "kode mesin", size: 44, col: N.pink });
    U.panah(ctx, 545, 520, 622, 520, N.gold, ramp(l, tAlat, 0.5), 8);
    X.kode(ctx, 640, 350, 1150, ASM.map((s, i) => ({ s: s.padEnd(19) + "; " + ARTI[i], col: N.cyan, t0: ts[i] - 0.3, hl: l > ts[i] - 0.3 && (i === 2 || l < ts[i + 1] - 0.3) ? 1 : 0 })), l, { judul: "instruksi", size: 40, col: N.cyan });
    X.judul(ctx, "Langkah 1: angka dibaca kembali sebagai instruksi", l, 0.3, N.gold); ilus(ctx);
  };

  S.ba_3 = function (ctx, b, l, t) {
    const tJut = D.at(b, "Jutaan instruksi"), tFun = D.at(b, "fungsi-fungsi"), tAwal = D.at(b, "awal dan akhir");
    U.ruang(ctx, t, { col: N.violet, gx: 1400, gy: 420 }); X.langkah(ctx, l, 1, LK);
    // kolom baris instruksi mengalir, lalu dibingkai menjadi tiga fungsi
    const x = 300, y0 = 340, n = 12, rh = 38; const a = ramp(l, tJut - 0.3, 0.4); ctx.save(); ctx.globalAlpha *= a; const r = U.rng(5);
    for (let i = 0; i < n; i++) { const w = 260 + r() * 420; ctx.fillStyle = D.hexA(N.cyan, 0.55); RR(ctx, x, y0 + i * rh, w, 24, 8); ctx.fill(); } ctx.restore();
    [[0, 4, "fungsi A", N.pink], [4, 9, "fungsi B", N.gold], [9, 12, "fungsi C", N.green]].forEach(([i0, i1, s, col], k) => { const p = U.pop(l, tFun - 0.2 + k * 0.35); if (p.a <= 0) return; ctx.save(); ctx.globalAlpha *= p.a; ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.shadowColor = col; ctx.shadowBlur = 14;
      RR(ctx, x - 24, y0 + i0 * rh - 10, 760, (i1 - i0) * rh + 4, 14); ctx.stroke(); ctx.shadowBlur = 0; U.panah(ctx, x + 760, y0 + (i0 + i1) / 2 * rh - 8, x + 880, y0 + (i0 + i1) / 2 * rh - 8, col, 1, 6);
      txt(ctx, s, x + 910, y0 + (i0 + i1) / 2 * rh + 10, 52, { weight: 900, color: col }); if (l > tAwal - 0.2) txt(ctx, "awal dan akhir", x + 1160, y0 + (i0 + i1) / 2 * rh + 8, 40, { weight: 700, color: N.ink2, fit: 360 }); ctx.restore(); });
    X.judul(ctx, "Langkah 2: instruksi dikelompokkan menjadi fungsi", l, 0.3, N.gold);
  };

  const CC = ["rax = mem[alamat];", "eax = eax + ebx;", "goto L16;"];
  S.ba_4 = function (ctx, b, l, t) {
    const tHar = D.at(b, "secara harfiah"), tTam = D.at(b, "Instruksi tambah"), tLom = D.at(b, "instruksi lompat"), tHas = D.at(b, "Hasilnya adalah"), tMak = D.at(b, "maknanya sama persis");
    U.ruang(ctx, t, { col: N.green, gx: 1400, gy: 420 }); X.langkah(ctx, l, 2, LK);
    const hl = i => (i === 1 && l > tTam - 0.2 && l < tLom - 0.2) || (i === 2 && l > tLom - 0.2 && l < tHas - 0.3) ? 1 : 0;
    X.kode(ctx, 130, 350, 720, ASM.map((s, i) => ({ s, col: N.cyan, hl: hl(i) })), l, { judul: "instruksi mesin", size: 46, col: N.cyan });
    [0, 1, 2].forEach(i => U.panah(ctx, 870, 455 + i * 71, 1010, 455 + i * 71, N.gold, ramp(l, tHar - 0.2 + i * 0.3, 0.4), 7));
    X.kode(ctx, 1030, 350, 760, CC.map((s, i) => ({ s, col: N.green, t0: tHar + i * 0.3, hl: hl(i) })), l, { judul: "kode bahasa C", size: 46, col: N.green });
    X.judul(ctx, "Langkah 3: satu instruksi menjadi satu baris C", l, 0.3, N.gold);
    X.bawah(ctx, "sulit dibaca, tetapi maknanya sama persis", l, tMak - 1.6, N.green, { x: 700, y: 780, fit: 1100 }); ilus(ctx);
  };

  S.ba_5 = function (ctx, b, l, t) {
    const tCom = D.at(b, "compiler biasa"), tProg = D.at(b, "program baru"), tJadi = D.at(b, "tidak menulis ulang"), tAlat = D.at(b, "alat penerjemahnya");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 420 }); X.langkah(ctx, l, 3, LK);
    const y = 560, xs = [340, 960, 1580];
    ctx.save(); ctx.globalAlpha *= ramp(l, 0.4, 0.4); I.resep(ctx, xs[0], y, 280, N.green); txt(ctx, "kode C terjemahan", xs[0], y + 200, 44, { align: "center", weight: 900, fit: 520 }); ctx.restore();
    U.panah(ctx, xs[0] + 130, y, xs[1] - 180, y, N.gold, ramp(l, tCom - 0.4, 0.6), 9);
    const pm = U.pop(l, tCom - 0.2); if (pm.a > 0) { ctx.save(); ctx.globalAlpha *= pm.a; I.mesin(ctx, xs[1], y, 280, N.gold, t); txt(ctx, "compiler biasa", xs[1], y + 200, 44, { align: "center", weight: 900, color: N.gold }); ctx.restore(); }
    U.panah(ctx, xs[1] + 180, y, xs[2] - 190, y, N.gold, ramp(l, tProg - 0.4, 0.6), 9);
    const pp = U.pop(l, tProg - 0.1); if (pp.a > 0) { ctx.save(); ctx.globalAlpha *= pp.a; I.pc(ctx, xs[2], y - 20, 260, N.cyan); txt(ctx, "program PC baru", xs[2], y + 200, 44, { align: "center", weight: 900, fit: 520 }); ctx.restore(); }
    X.judul(ctx, "Langkah 4: compiler biasa menghasilkan program baru", l, 0.3, N.gold, { a: 1 - ramp(l, tJadi - 0.3, 0.3) });
    X.judul(ctx, "Modder menulis alat penerjemahnya, bukan gamenya", l, tJadi - 0.1, N.pink);
  };

  S.ba_6 = function (ctx, b, l, t) {
    const tDek = D.at(b, "Dekompilasi berusaha"), tBaca = D.at(b, "bisa dibaca"), tThn = D.at(b, "bertahun-tahun"), tRek = D.at(b, "Rekompilasi tidak peduli"), tJal = D.at(b, "bisa dijalankan");
    U.ruang(ctx, t, { col: N.cyan, gx: 500, gy: 320 });
    const rs = X.cols(2, { x0: 160, x1: 1760, y: 290, h: 500, gap: 80 });
    const p1 = U.pop(l, tDek - 0.2), p2 = U.pop(l, tRek - 0.2);
    X.kartu(ctx, rs[0], { col: N.cyan, a: p1.a, sp: p1.sp, redup: l > tRek - 0.2 }); X.kartu(ctx, rs[1], { col: N.green, a: p2.a, sp: p2.sp });
    if (p1.a > 0) { ctx.save(); ctx.globalAlpha *= p1.a * (l > tRek - 0.2 ? 0.5 : 1); txt(ctx, "Dekompilasi", rs[0].cx, rs[0].y + 84, 60, { align: "center", weight: 900, color: N.cyan }); ctx.restore();
      X.daftar(ctx, b, l, rs[0].x + 40, rs[0].y + 130, rs[0].w - 80, [{ t0: tBaca - 0.2, s: "rapi dan bisa dibaca", col: N.cyan }, { t0: tThn - 0.2, s: "bertahun-tahun per game", col: N.gold, tanda: "titik" }], { size: 42, rh: 110 }); }
    if (p2.a > 0) { ctx.save(); ctx.globalAlpha *= p2.a; txt(ctx, "Rekompilasi", rs[1].cx, rs[1].y + 84, 60, { align: "center", weight: 900, color: N.green }); ctx.restore();
      X.daftar(ctx, b, l, rs[1].x + 40, rs[1].y + 130, rs[1].w - 80, [{ t0: tRek + 0.3, s: "kode tidak enak dibaca", col: N.gold, tanda: "titik" }, { t0: tJal - 0.3, s: "asal bisa dijalankan", col: N.green }], { size: 42, rh: 110 }); }
    X.judul(ctx, "Rekompilasi berbeda dengan dekompilasi", l, 0.3, N.gold);
  };

  // deretan kotak alamat
  function alamat(ctx, y, n, hl, o = {}) { const w = 150, x0 = (W - n * w) / 2; for (let i = 0; i < n; i++) { const col = hl[i] || N.dim; ctx.save(); ctx.fillStyle = "rgba(16,8,38,0.9)"; RR(ctx, x0 + i * w + 6, y, w - 12, 100, 14); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = hl[i] ? 5 : 2; if (hl[i]) { ctx.shadowColor = col; ctx.shadowBlur = 14; } ctx.stroke(); ctx.restore();
    X.mono(ctx, String(96 + i * 4), x0 + i * w + w / 2, y + 64, 40, { align: "center", color: hl[i] ? N.ink : N.dim }); } return i => x0 + i * w + w / 2; }
  S.ba_7 = function (ctx, b, l, t) {
    const tSer = D.at(b, "lompat ke alamat seratus"), tKot = D.at(b, "tersimpan di kotak ini"), tBaru = D.at(b, "baru diketahui");
    U.ruang(ctx, t, { col: N.red, gx: 960, gy: 320 });
    const two = l > tKot - 0.6, xi = alamat(ctx, 640, 10, two ? {} : (l > tSer ? { 1: N.green } : {}));
    const p1 = U.pop(l, tSer - 0.3); if (p1.a > 0) { ctx.save(); ctx.globalAlpha *= p1.a * (two ? 0.35 : 1); U.panel(ctx, 150, 320, 720, 200, { col: N.green }); txt(ctx, "lompatan langsung", 190, 384, 40, { weight: 800, color: N.ink2 }); X.mono(ctx, "jmp 100", 190, 468, 60, { color: N.green }); ctx.restore();
      if (!two) U.panah(ctx, 510, 530, xi(1), 630, N.green, ramp(l, tSer + 0.3, 0.5), 7); }
    const p2 = U.pop(l, tKot - 0.5); if (p2.a > 0) { ctx.save(); ctx.globalAlpha *= p2.a; U.panel(ctx, 1050, 320, 720, 200, { col: N.red }); txt(ctx, "lompatan tidak langsung", 1090, 384, 40, { weight: 800, color: N.ink2 }); X.mono(ctx, "jmp [kotak]", 1090, 468, 60, { color: N.red });
      const bx = 1560, by = 400; ctx.fillStyle = "#0B0620"; RR(ctx, bx, by, 170, 96, 14); ctx.fill(); ctx.strokeStyle = N.gold; ctx.lineWidth = 4; ctx.stroke(); U.tanya(ctx, bx + 85, by + 46, 80, N.gold, 0.6 + 0.4 * Math.sin(t * 5)); ctx.restore(); }
    if (l > tBaru - 0.3) { const k = ramp(l, tBaru - 0.3, 0.5); [3, 6, 8].forEach((i, j) => U.panah(ctx, 1410, 530, xi(i), 630, D.hexA(N.gold, 0.8), k, 5, { dash: [14, 12] })); }
    X.judul(ctx, "Jebakan 1: lompatan tidak langsung", l, 0.3, N.red);
    X.bawah(ctx, "tujuannya baru diketahui saat program berjalan", l, tBaru - 0.2, N.gold, { y: 840 }); ilus(ctx);
  };

  S.ba_8 = function (ctx, b, l, t) {
    const tSeb = D.at(b, "sebelum program berjalan"), tSem = D.at(b, "semua kemungkinan"), tLew = D.at(b, "yang terlewat"), tKos = D.at(b, "tempat yang kosong"), tBer = D.at(b, "lalu berhenti");
    U.ruang(ctx, t, { col: N.red, gx: 1400, gy: 320 });
    const miss = l > tLew - 0.2, hl = {}; if (l > tSem - 0.2) { hl[3] = N.green; hl[6] = N.green; hl[8] = miss ? N.red : N.green; }
    const xi = alamat(ctx, 640, 10, hl);
    U.panel(ctx, 560, 310, 800, 190, { col: N.gold }); txt(ctx, "daftar tujuan yang ditemukan", 600, 370, 40, { weight: 800, color: N.ink2, fit: 720 });
    if (l > tSem - 0.2) X.mono(ctx, miss ? "108, 120, ???" : "108, 120, 128", 600, 452, 56, { color: miss ? N.red : N.green });
    if (l > tSem - 0.2) [3, 6, 8].forEach((i, j) => { if (miss && i === 8) return; U.panah(ctx, 960, 510, xi(i), 630, N.green, ramp(l, tSem + j * 0.2, 0.4), 6); });
    if (l > tKos - 0.3) { const k = ramp(l, tKos - 0.3, 0.5); U.panah(ctx, 960, 510, xi(8), 630, N.red, k, 7, { dash: [14, 10] }); U.silang(ctx, xi(8), 690, 80, ramp(l, tKos + 0.2, 0.3)); }
    X.judul(ctx, "Penerjemah harus menebak semua tujuan lompatan", l, 0.3, N.gold, { a: 1 - ramp(l, tLew - 0.3, 0.3) });
    X.judul(ctx, "Satu saja terlewat, program berhenti", l, tLew - 0.1, N.red); ilus(ctx);
  };

  S.ba_9 = function (ctx, b, l, t) {
    const tDamp = D.at(b, "berdampingan"), tTab = D.at(b, "tabel angka"), tKel = D.at(b, "keliru membaca"), tKac = D.at(b, "menjadi kacau");
    U.ruang(ctx, t, { col: N.violet, gx: 960, gy: 320 });
    const segs = [["kode", N.cyan, 5], ["data", N.gold, 4], ["kode", N.cyan, 5]], w = 112, x0 = (W - 14 * w) / 2, y = 380; let i0 = 0; const wrong = l > tKel - 0.2;
    const a = ramp(l, 0.4, 0.5); ctx.save(); ctx.globalAlpha *= a; U.panel(ctx, x0 - 30, y - 96, 14 * w + 60, 280, { col: N.violet }); txt(ctx, "isi berkas executable", x0, y - 36, 42, { weight: 800, color: N.ink2 });
    const r = U.rng(9); segs.forEach(([s, col, n], k) => { const isData = k === 1, c = isData && wrong ? N.red : (l > tDamp - 0.3 ? col : N.dim);
      for (let i = 0; i < n; i++) { const x = x0 + (i0 + i) * w; ctx.fillStyle = D.hexA(c, 0.22); RR(ctx, x + 5, y, w - 10, 80, 10); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.stroke(); X.mono(ctx, ("0" + Math.floor(r() * 255).toString(16).toUpperCase()).slice(-2), x + w / 2, y + 54, 40, { align: "center", color: N.ink }); }
      if (l > tDamp - 0.3) txt(ctx, isData && l > tTab - 0.3 ? "data (tabel angka)" : s, x0 + (i0 + n / 2) * w, y + 140, 44, { align: "center", weight: 900, color: c, fit: n * w - 10 }); i0 += n; }); ctx.restore();
    if (wrong) { const p = U.pop(l, tKel); ctx.save(); ctx.globalAlpha *= p.a; U.panah(ctx, 960, 590, 960, 660, N.red, 1, 7);
      X.kode(ctx, 560, 670, 800, [{ s: l > tKac - 0.3 ? "??? ; instruksi ngawur" : "data dibaca sebagai instruksi", col: N.red }], l, { size: 42, col: N.red }); ctx.restore(); }
    X.judul(ctx, "Jebakan 2: membedakan kode dari data", l, 0.3, N.red); if (!wrong) ilus(ctx);
  };

  S.ba_10 = function (ctx, b, l, t) {
    const tUnt = D.at(b, "satu keuntungan"), tSeb = D.at(b, "sebagian besar instruksi"), tBon = D.at(b, "tetap harus dibongkar"), tPang = D.at(b, "memanggil sistem Xbox"), tBel = D.at(b, "dibelokkan");
    U.ruang(ctx, t, { col: N.green, gx: 500, gy: 320 });
    const x0 = 160, w = 1600, y = 340, n = 20, cw = w / n, call = [4, 9, 13, 17];
    const a = ramp(l, tSeb - 0.6, 0.5); ctx.save(); ctx.globalAlpha *= a; txt(ctx, "kode mesin GTA 6 versi Xbox", x0, y - 24, 44, { weight: 900 });
    for (let i = 0; i < n; i++) { const isC = call.includes(i), on = isC && l > tPang - 0.3, col = on ? N.red : N.green; ctx.fillStyle = D.hexA(col, on ? 0.75 : 0.5); RR(ctx, x0 + i * cw + 4, y, cw - 8, 110, 10); ctx.fill(); }
    if (l > tSeb - 0.1) txt(ctx, "sebagian besar instruksi: tidak perlu diubah", x0, y + 170, 44, { weight: 800, color: N.green }); ctx.restore();
    const pt = U.pop(l, tPang - 0.2); if (pt.a > 0) { ctx.save(); ctx.globalAlpha *= pt.a; txt(ctx, "panggilan ke sistem Xbox", x0 + w, y + 170, 44, { align: "right", weight: 800, color: N.red }); ctx.restore(); }
    const pb = U.pop(l, tBel - 0.3); if (pb.a > 0) { ctx.save(); ctx.globalAlpha *= pb.a; U.panel(ctx, 610, 650, 700, 150, { col: N.violet }); I.os(ctx, 700, 725, 100, N.violet); txt(ctx, "sistem tiruan", 780, 742, 52, { weight: 900 }); ctx.restore();
      call.forEach((i, j) => U.panah(ctx, x0 + i * cw + cw / 2, y + 118, 760 + j * 130, 644, N.gold, ramp(l, tBel - 0.2 + j * 0.12, 0.4), 5)); }
    X.judul(ctx, "Pada GTA 6: prosesor asal dan tujuan sekeluarga", l, tUnt - 0.6, N.green, { a: 1 - ramp(l, tBon - 0.3, 0.3) });
    X.judul(ctx, "Setiap panggilan ke Xbox dibelokkan", l, tBon - 0.1, N.gold);
  };

  X.reg(4, S);
})(typeof window !== "undefined" ? window : globalThis);
