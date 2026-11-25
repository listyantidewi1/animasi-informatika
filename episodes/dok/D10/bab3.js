/* D10 bab 3 — LEVEL 3: Tiga jalan untuk memindahkan game (b3_1 … b3_6): emulator (penerjemah langsung), lapisan
   kompatibilitas (sistem tiruan), rekompilasi statis (menerjemahkan seluruh buku satu kali). */
(function (g) {
  const K = g.Kiko, D = K.dok, U = K.d08, N = U.N, X = K.d10, I = X.ikon;
  const { clamp, lerp, eio, eout } = D, { ramp, txt, RR } = U;
  const S = {}, W = 1920, HH = 1080;
  const JALAN = [["Emulator", I.balon, N.pink], ["Lapisan kompatibilitas", I.os, N.violet], ["Rekompilasi statis", I.buku, N.green]];
  // tiga keping jalan di atas; aktif menyala
  function keping(ctx, aktif) { const ws = [395, 685, 580]; let kx = 110; const rs = ws.map(w => { const r = { x: kx, y: 236, w, h: 76, cx: kx + w / 2 }; kx += w + 20; return r; }); JALAN.forEach(([s, , col], i) => { const r = rs[i], on = i === aktif; ctx.save(); ctx.globalAlpha *= on ? 1 : 0.55;
    ctx.fillStyle = "rgba(16,8,38,0.88)"; RR(ctx, r.x, r.y, r.w, r.h, 20); ctx.fill(); ctx.strokeStyle = on ? col : N.dim; ctx.lineWidth = on ? 5 : 3; if (on) { ctx.shadowColor = col; ctx.shadowBlur = 16; } ctx.stroke(); ctx.shadowBlur = 0;
    txt(ctx, "Jalan " + (i + 1) + ": " + s, r.cx, r.y + 52, 40, { align: "center", weight: 900, color: on ? N.ink : N.ink2, fit: r.w - 30 }); ctx.restore(); }); }

  S.b3_1 = function (ctx, b, l, t) {
    const tTiga = D.at(b, "tiga jalan");
    U.senja(ctx, t, { dim: 0.55, sunX: 960 });
    const rs = X.cols(3, { y: 330, h: 420 });
    JALAN.forEach(([, , col], i) => { const p = U.pop(l, tTiga - 0.2 + i * 0.3); X.kartu(ctx, rs[i], { col, a: p.a, sp: p.sp }); if (p.a > 0) { ctx.save(); ctx.globalAlpha *= p.a; U.neon(ctx, "JALAN " + (i + 1), rs[i].cx, rs[i].y + 190, 76, col, { align: "center", fit: rs[i].w - 60 }); U.tanya(ctx, rs[i].cx, rs[i].y + 320, 110, col); ctx.restore(); } });
    X.judul(ctx, "Menjalankan program di mesin yang bukan rumahnya", l, 0.3, N.gold);
  };

  S.b3_2 = function (ctx, b, l, t) {
    const tPen = D.at(b, "penerjemah langsung"), tSet = D.at(b, "Setiap kalimat"), tBan = D.at(b, "banyak game"), tLam = D.at(b, "tetapi lambat"), tDua = D.at(b, "bekerja dua kali");
    U.ruang(ctx, t, { col: N.pink, gx: 960, gy: 420 }); keping(ctx, 0);
    const y = 560, xs = [300, 960, 1620];
    ctx.save(); ctx.globalAlpha *= ramp(l, 0.4, 0.5); U.panel(ctx, xs[0] - 190, y - 150, 380, 300, { col: N.pink }); I.resep(ctx, xs[0], y - 30, 150, N.cyan); txt(ctx, "program Xbox", xs[0], y + 110, 44, { align: "center", weight: 900 });
    U.panel(ctx, xs[2] - 190, y - 150, 380, 300, { col: N.cyan }); I.pc(ctx, xs[2], y - 40, 170, N.cyan); txt(ctx, "PC", xs[2], y + 110, 44, { align: "center", weight: 900 }); ctx.restore();
    const pp = U.pop(l, tPen - 0.2); if (pp.a > 0) { ctx.save(); ctx.globalAlpha *= pp.a; U.panel(ctx, xs[1] - 210, y - 150, 420, 300, { col: N.gold }); I.balon(ctx, xs[1], y - 40, 190, N.gold); txt(ctx, "emulator", xs[1], y + 110, 44, { align: "center", weight: 900, color: N.gold }); ctx.restore(); }
    if (l > tSet - 0.2) { U.titikJalan(ctx, xs[0] + 200, y, xs[1] - 220, y, N.pink, t, 4, 10); U.titikJalan(ctx, xs[1] + 220, y, xs[2] - 200, y, N.cyan, t + 0.3, 4, 10); }
    X.judul(ctx, "Diterjemahkan saat program berjalan", l, tSet - 0.2, N.pink, { a: 1 - ramp(l, tLam - 0.2, 0.3) });
    X.judul(ctx, "Lambat, karena komputer bekerja dua kali", l, tLam, N.red);
    X.bawah(ctx, "bisa untuk banyak game sekaligus", l, tBan - 0.3, N.green, { a: 1 - ramp(l, tLam - 0.2, 0.3) });
  };

  S.b3_3 = function (ctx, b, l, t) {
    const tApa = D.at(b, "dibiarkan apa adanya"), tPer = D.at(b, "setiap permintaannya"), tTir = D.at(b, "sistem tiruan"), tKira = D.at(b, "Game mengira"), tMod = D.at(b, "program buatan modder");
    U.ruang(ctx, t, { col: N.violet, gx: 1400, gy: 420 }); keping(ctx, 1);
    const y = 570;
    ctx.save(); ctx.globalAlpha *= ramp(l, 0.4, 0.5); U.panel(ctx, 140, y - 160, 420, 320, { col: N.pink }); I.resep(ctx, 350, y - 40, 150, N.cyan); txt(ctx, "kode game", 350, y + 96, 44, { align: "center", weight: 900 });
    if (l > tApa - 0.2) txt(ctx, "tidak diubah", 350, y + 144, 40, { align: "center", weight: 800, color: N.green }); ctx.restore();
    const kq = ramp(l, tPer - 0.2, 0.6); U.panah(ctx, 590, y - 50, 1010, y - 50, N.gold, kq, 8); if (kq > 0.5) { ctx.save(); ctx.globalAlpha *= ramp(l, tPer + 0.2, 0.3); txt(ctx, "“buka berkas ini”", 800, y - 76, 40, { align: "center", weight: 800, color: N.gold, fit: 400 }); ctx.restore(); }
    const pt = U.pop(l, tTir - 0.2); if (pt.a > 0) { ctx.save(); ctx.globalAlpha *= pt.a; U.panel(ctx, 1040, y - 160, 740, 320, { col: N.violet }); I.os(ctx, 1190, y - 30, 170, N.violet);
      txt(ctx, "sistem tiruan", 1340, y - 50, 52, { weight: 900, fit: 410 }); txt(ctx, l > tMod - 0.2 ? "buatan modder" : "meniru Xbox", 1340, y + 14, 42, { weight: 800, color: N.ink2, fit: 410 }); ctx.restore();
      const ka = ramp(l, tTir + 0.4, 0.6); U.panah(ctx, 1010, y + 60, 590, y + 60, N.green, ka, 8); if (ka > 0.5) txt(ctx, "“Ini berkasnya”", 800, y + 116, 40, { align: "center", weight: 800, color: N.green, fit: 400 }); }
    X.judul(ctx, "Permintaan game dijawab oleh sistem tiruan", l, tPer - 0.3, N.violet);
  };

  S.b3_4 = function (ctx, b, l, t) {
    const tSel = D.at(b, "menerjemahkan seluruh buku"), tSeb = D.at(b, "sebelum buku itu dibaca"), tHas = D.at(b, "program baru"), tTan = D.at(b, "tanpa penerjemah");
    U.ruang(ctx, t, { col: N.green, gx: 960, gy: 420 }); keping(ctx, 2);
    const y = 570, xs = [320, 960, 1600];
    ctx.save(); ctx.globalAlpha *= ramp(l, 0.4, 0.5); I.buku(ctx, xs[0], y - 20, 300, N.pink); txt(ctx, "program Xbox", xs[0], y + 170, 46, { align: "center", weight: 900 }); ctx.restore();
    const k1 = ramp(l, tSel - 0.2, 0.7); U.panah(ctx, xs[0] + 130, y - 20, xs[1] - 170, y - 20, N.gold, k1, 9);
    const pm = U.pop(l, tSel); if (pm.a > 0) { ctx.save(); ctx.globalAlpha *= pm.a; I.mesin(ctx, xs[1], y - 20, 260, N.gold, t); txt(ctx, "diterjemahkan satu kali", xs[1], y + 170, 44, { align: "center", weight: 900, color: N.gold, fit: 520 }); ctx.restore(); }
    const k2 = ramp(l, tHas - 0.5, 0.7); U.panah(ctx, xs[1] + 170, y - 20, xs[2] - 130, y - 20, N.gold, k2, 9);
    const pb = U.pop(l, tHas - 0.1); if (pb.a > 0) { ctx.save(); ctx.globalAlpha *= pb.a; I.buku(ctx, xs[2], y - 20, 300, N.green); txt(ctx, "program PC baru", xs[2], y + 170, 44, { align: "center", weight: 900, fit: 520 }); ctx.restore(); }
    X.judul(ctx, "Seluruh buku diterjemahkan sebelum dibaca", l, tSel - 0.3, N.green, { a: 1 - ramp(l, tTan - 0.3, 0.3) });
    X.judul(ctx, "Berjalan langsung, tanpa penerjemah di tengah", l, tTan - 0.1, N.green);
  };

  S.b3_5 = function (ctx, b, l, t) {
    const tSta = D.at(b, "Kata statis"), tSeb = D.at(b, "sebelum program berjalan"), tSaat = D.at(b, "bukan pada saat berjalan"), tCep = D.at(b, "jauh lebih cepat");
    U.ruang(ctx, t, { col: N.gold, gx: 960, gy: 320 });
    // dua baris garis waktu
    const x0 = 520, x1 = 1760, mid = 900, rows = [["Rekompilasi statis", N.green, 380], ["Emulator", N.pink, 620]];
    rows.forEach(([s, col, y], i) => { const a = ramp(l, (i ? tSaat : tSeb) - 0.4, 0.4); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; txt(ctx, s, 130, y + 62, 44, { weight: 900, color: col, fit: 370 });
      ctx.fillStyle = "rgba(16,8,38,0.86)"; RR(ctx, x0, y, x1 - x0, 100, 18); ctx.fill();
      if (i === 0) { ctx.fillStyle = D.hexA(N.gold, 0.85); RR(ctx, x0 + 8, y + 8, mid - x0 - 12, 84, 12); ctx.fill(); txt(ctx, "terjemahkan", (x0 + mid) / 2, y + 64, 42, { align: "center", weight: 900, color: "#120826", fit: mid - x0 - 30 });
        ctx.fillStyle = D.hexA(N.green, 0.85); RR(ctx, mid + 4, y + 8, x1 - mid - 12, 84, 12); ctx.fill(); txt(ctx, "program berjalan", (mid + x1) / 2, y + 64, 42, { align: "center", weight: 900, color: "#120826" }); }
      else { for (let k = 0; k < 8; k++) { const xx = mid + 4 + k * (x1 - mid - 12) / 8, w = (x1 - mid - 12) / 8 - 6; ctx.fillStyle = D.hexA(k % 2 ? N.pink : N.gold, 0.85); RR(ctx, xx, y + 8, w, 84, 10); ctx.fill(); }
        txt(ctx, "terjemahkan sambil berjalan", (mid + x1) / 2, y + 150, 42, { align: "center", weight: 800, color: N.ink2 }); }
      ctx.restore(); });
    const am = ramp(l, tSeb - 0.3, 0.4); if (am > 0) { ctx.save(); ctx.globalAlpha *= am; ctx.strokeStyle = N.ink; ctx.lineWidth = 4; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(mid, 330); ctx.lineTo(mid, 740); ctx.stroke(); ctx.setLineDash([]); txt(ctx, "program mulai", mid, 316, 40, { align: "center", weight: 800, color: N.ink }); ctx.restore(); }
    X.judul(ctx, "Statis = diterjemahkan sebelum program berjalan", l, tSta - 0.2, N.gold);
    X.bawah(ctx, "hasilnya bisa jauh lebih cepat daripada emulator", l, tCep - 0.6, N.green, { y: 880 });
  };

  S.b3_6 = function (ctx, b, l, t) {
    const tN = D.at(b, "Nintendo 64"), tX = D.at(b, "Xbox 360"), tUs = D.at(b, "berusia belasan"), tBel = D.at(b, "Belum pernah ada"), tHari = D.at(b, "beberapa hari setelah rilis");
    U.ruang(ctx, t, { col: N.cyan, gx: 500, gy: 320 });
    const rs = X.cols(3, { y: 300, h: 470 });
    const p1 = U.pop(l, tN - 0.2), p2 = U.pop(l, tX - 0.2), p3 = U.pop(l, tBel - 0.2), us = l > tUs - 0.2;
    X.kartu(ctx, rs[0], { col: N.green, ikon: I.konsol, ih: 170, judul: "Nintendo 64", sub: us ? "game berusia puluhan tahun" : "berhasil direkompilasi", a: p1.a, sp: p1.sp });
    X.kartu(ctx, rs[1], { col: N.green, ikon: I.konsol, ih: 170, judul: "Xbox 360", sub: us ? "game berusia belasan tahun" : "berhasil direkompilasi", a: p2.a, sp: p2.sp });
    X.kartu(ctx, rs[2], { col: N.gold, ikon: I.tanya, ih: 170, judul: "Game sebesar ini", sub: l > tHari - 0.2 ? "beberapa hari setelah rilis" : "belum pernah dicoba", a: p3.a, sp: p3.sp });
    [0, 1].forEach(i => U.centang(ctx, rs[i].x + rs[i].w - 66, rs[i].y + 66, 40, ramp(l, (i ? tX : tN) + 0.3, 0.4)));
    X.judul(ctx, "Teknik ini bukan khayalan", l, 0.2, N.green, { a: 1 - ramp(l, tBel - 0.3, 0.3) });
    X.judul(ctx, "Tetapi belum pernah untuk game sebesar ini", l, tBel - 0.1, N.gold);
  };

  X.reg(3, S);
})(typeof window !== "undefined" ? window : globalThis);
